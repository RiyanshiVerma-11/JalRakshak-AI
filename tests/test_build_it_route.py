"""
Test Suite: Build It Route Security, Honesty & Offline Invariants (TASK 21 + PART A)

Validates the 13 core requirements of the WeMakeDevs x AWS Build It route:
1. test_no_header_only_auth_bypass: POST /api/actions/{id}/approve with only X-Officer-Role returns 401.
2. test_self_serve_token_requires_credential: POST /api/auth/token with missing/wrong credential returns 401.
3. test_no_duplicate_incident_on_simulate: two simulate calls add exactly two incidents.
4. test_cedar_fallback_matches_policy: for every (role, action), fallback decision matches cedarpy / .cedar policy.
5. test_no_unlabelled_detection_confidence: vision responses must not carry bounding-box confidence unless from real model.
6. test_zero_credential_offline_boot: with no AWS credentials, app reports mode OFFLINE and simulate completes.
7. test_offline_run_makes_no_network_calls: assert no boto3 client or network calls are attempted in OFFLINE mode.
8. test_build_it_tool_inventory_is_honest: health/judge payload lists the 4 Build It tools with honest statuses.
9. test_app_boots_without_strands_sdk: app boots and reports Strands as FALLBACK if SDK import fails.
10. test_env_example_copy_has_no_credentials: copying .env.example does not flip app into has credentials mode.
11. test_public_endpoint_allowlist_matches_counts: verify PUBLIC_DEMO_ENDPOINTS matches and protected endpoints return 401.
12. test_readme_testnames_match_suite: verify every test token in README.md exists in pytest suite.
13. test_benchmark_numbers_match_docs: verify any ms p50 claim in README/blog matches docs/BENCHMARK.md.
"""
import io
import os
import socket
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from PIL import Image

from backend.main import app
from backend.data.mock_db import db
from backend.cloud.config import get_backend_mode, get_build_it_tools_inventory
from backend.cloud.aws_bridge import create_boto_client, create_boto_resource
from backend.vision.image_analyzer import analyze_incident_image
from backend.auth.cedar_auth import (
    CEDAR_ROLE_PERMISSIONS,
    evaluate_cedar_policy_with_details,
    CEDAR_AVAILABLE,
    _CACHED_POLICY
)

client = TestClient(app)


# --------------------------------------------------------------------------
# 1. No Header-Only Authentication Bypass (TASK 1 & TASK 21.1)
# --------------------------------------------------------------------------
def test_no_header_only_auth_bypass():
    """
    Asserts that passing X-Officer-Role without a valid Bearer token fails with HTTP 401.
    Prevents role forgery attacks through arbitrary headers.
    """
    resp = client.post(
        "/api/actions/ACT-TEST-01/approve",
        headers={"X-Officer-Role": "incident_commander"},
        json={"officer_role": "incident_commander"}
    )
    assert resp.status_code == 401
    assert "Authentication required" in resp.json().get("detail", "")


# --------------------------------------------------------------------------
# 2. Self-Serve Token Requires Valid Credential (TASK 2 & TASK 21.2)
# --------------------------------------------------------------------------
def test_self_serve_token_requires_credential():
    """
    Asserts that POST /api/auth/token rejects requests without valid credentials
    and returns HTTP 401.
    """
    # 1. Missing credential entirely
    resp_missing = client.post(
        "/api/auth/token",
        json={"role": "incident_commander"}
    )
    assert resp_missing.status_code == 401
    assert "credential" in resp_missing.json().get("detail", "").lower()

    # 2. Incorrect credential
    resp_wrong = client.post(
        "/api/auth/token",
        json={"role": "incident_commander", "credential": "invalid_password"}
    )
    assert resp_wrong.status_code == 401
    assert "credential" in resp_wrong.json().get("detail", "").lower()

    # 3. Correct credential succeeds with valid signed JWT
    resp_ok = client.post(
        "/api/auth/token",
        json={"role": "incident_commander", "credential": "commander123"}
    )
    assert resp_ok.status_code == 200
    data = resp_ok.json()
    assert "access_token" in data
    assert data["role"] == "incident_commander"


# --------------------------------------------------------------------------
# 3. No Duplicate Incidents on Simulate (TASK 4 & TASK 21.3)
# --------------------------------------------------------------------------
def test_no_duplicate_incident_on_simulate():
    """
    Asserts that 2 calls to /api/incidents/simulate increase the total incident
    count by exactly 2, verifying the atomic upsert state store.
    """
    initial_count = len(db.get_incidents())

    resp1 = client.post(
        "/api/incidents/simulate",
        json={"category": "flood", "ward_id": "WARD-17"}
    )
    assert resp1.status_code == 200
    count_after_first = len(db.get_incidents())
    assert count_after_first == initial_count + 1

    resp2 = client.post(
        "/api/incidents/simulate",
        json={"category": "heatwave", "ward_id": "WARD-04"}
    )
    assert resp2.status_code == 200
    count_after_second = len(db.get_incidents())
    assert count_after_second == initial_count + 2


# --------------------------------------------------------------------------
# 4. Cedar Fallback Matches .cedar Policy (TASK 15 & TASK 21.4)
# --------------------------------------------------------------------------
def test_cedar_fallback_matches_policy():
    """
    Asserts that for every role and action in the application matrix,
    the deterministic fallback decision matches the cedarpy engine decision
    (or exactly matches the canonical policy definitions).
    """
    roles = ["incident_commander", "field_responder", "field_operator", "scada_analyst", "citizen"]
    actions = [
        "read_incidents",
        "approve_action",
        "dispatch_resource",
        "broadcast_sns",
        "simulate_scenario",
        "update_status",
        "read_telemetry",
        "inspect_sensors",
        "submit_report",
        "read_advisories"
    ]

    for role in roles:
        expected_allowed = CEDAR_ROLE_PERMISSIONS.get(role, set())
        for act in actions:
            eval_res = evaluate_cedar_policy_with_details(role, act)
            should_allow = act in expected_allowed
            assert eval_res["allowed"] == should_allow, (
                f"Mismatch for role='{role}' action='{act}': "
                f"eval={eval_res['allowed']} vs expected={should_allow} (engine={eval_res.get('engine')})"
            )


# --------------------------------------------------------------------------
# 5. No Unlabelled Detection Confidence (TASK 13 & TASK 21.5)
# --------------------------------------------------------------------------
def test_no_unlabelled_detection_confidence():
    """
    Asserts that vision responses from the local PIL engine never fabricate
    bounding-box confidence scores and always carry illustrative_demo_overlay: True.
    """
    # Create simple synthetic test image
    img = Image.new("RGB", (320, 240), color=(30, 80, 160))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    image_bytes = buf.getvalue()

    result = analyze_incident_image(image_bytes, category="flood")

    assert result.get("illustrative_demo_overlay") is True
    assert result.get("provider") == "Local PIL Heuristic Engine"

    # Crucial: no bounding box should claim a fabricated detector confidence
    for box in result.get("bounding_boxes", []):
        assert "confidence" not in box, f"Fabricated confidence found in box: {box}"


# --------------------------------------------------------------------------
# 6. Zero-Credential Offline Boot (TASK 7 & TASK 21.6)
# --------------------------------------------------------------------------
def test_zero_credential_offline_boot():
    """
    Asserts that with no AWS credentials, the app boots, /api/health reports
    mode OFFLINE with a clear reason, and /api/incidents/simulate completes successfully.
    """
    health_resp = client.get("/api/health")
    assert health_resp.status_code == 200
    health_data = health_resp.json()

    assert health_data["status"] == "HEALTHY"
    assert health_data["mode"] == "OFFLINE"
    assert "no AWS account" in health_data.get("reason", "").lower() or "zero-credential" in health_data.get("reason", "").lower()

    # Execute simulation in offline mode
    sim_resp = client.post(
        "/api/incidents/simulate",
        json={"category": "flood", "ward_id": "WARD-17"}
    )
    assert sim_resp.status_code == 200
    sim_data = sim_resp.json()
    assert "incident" in sim_data
    inc = sim_data["incident"]
    assert "id" in inc
    assert inc["category"] == "flood"
    assert inc["execution_mode"] in ("OFFLINE_LOCAL_STRANDS", "DETERMINISTIC_NDMA_FALLBACK")


# --------------------------------------------------------------------------
# 7. Offline Run Makes No Outbound Network Calls (TASK 17d & TASK 21.7)
# --------------------------------------------------------------------------
def test_offline_run_makes_no_network_calls():
    """
    Asserts that in OFFLINE mode:
    1. Boto3 client/resource factories immediately return None without calling AWS.
    2. Zero outbound HTTP connections are attempted during execution.
    """
    # Factory calls return None immediately
    assert create_boto_client("s3") is None
    assert create_boto_client("dynamodb") is None
    assert create_boto_client("bedrock-runtime") is None
    assert create_boto_resource("dynamodb") is None

    # Patch http.client.HTTPConnection.connect to ensure no outbound network calls
    with patch("http.client.HTTPConnection.connect") as mock_http:
        sim_resp = client.post(
            "/api/incidents/simulate",
            json={"scenario": "leak", "ward_id": "WARD-17"}
        )
        assert sim_resp.status_code == 200
        mock_http.assert_not_called()


# --------------------------------------------------------------------------
# 8. Build It Tool Inventory is Truthful (TASK 6 & TASK 21.8)
# --------------------------------------------------------------------------
def test_build_it_tool_inventory_is_honest():
    """
    Asserts that /api/health and /api/judge/overview report all 4 Build It tools
    with truthful statuses (ACTIVE only if loaded, otherwise FALLBACK) and genuine evidence.
    """
    overview_resp = client.get("/api/judge/overview")
    assert overview_resp.status_code == 200
    data = overview_resp.json()

    tools = data.get("build_it_tools", [])
    assert len(tools) == 4

    tool_names = [t["tool"] for t in tools]
    assert "AWS Strands Agents SDK" in tool_names
    assert "AWS Cedar" in tool_names
    assert "AWS SAM CLI" in tool_names
    assert "LocalStack" in tool_names

    for t in tools:
        assert t["route"] == "Build It"
        assert t["status"] in ("ACTIVE", "FALLBACK")
        assert len(t.get("evidence", "")) > 0

        # Never claim ACTIVE for something that did not load
        if t["tool"] == "AWS Cedar" and not CEDAR_AVAILABLE:
            assert t["status"] == "FALLBACK"
        if t["tool"] == "LocalStack" and os.environ.get("AWS_EXECUTION_MODE") != "LOCALSTACK":
            assert t["status"] == "FALLBACK"


# --------------------------------------------------------------------------
# 9. App Boots & Degrades Gracefully Without Strands SDK (TASK A2)
# --------------------------------------------------------------------------
def test_app_boots_without_strands_sdk():
    """
    Asserts that if the Strands SDK is unavailable, the app still boots,
    /api/health returns HTTP 200 with HEALTHY status and reports Strands as FALLBACK,
    and the pipeline degrades gracefully to deterministic execution without crashing.
    """
    import sys
    from unittest.mock import patch

    with patch.dict(sys.modules, {"strands": None}):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "HEALTHY"

        strands_tool = next(t for t in data["build_it_tools"] if "Strands" in t["tool"])
        assert strands_tool["status"] == "FALLBACK"


# --------------------------------------------------------------------------
# 10. Copying .env.example Has No Live Credentials (TASK A4)
# --------------------------------------------------------------------------
def test_env_example_copy_has_no_credentials(monkeypatch):
    """
    Asserts that copying .env.example template placeholders to .env or environment
    does NOT flip the application into 'has credentials' mode and does NOT
    produce a live boto3 client.
    """
    from backend.cloud.config import has_aws_credentials
    from backend.cloud.aws_bridge import create_boto_client

    monkeypatch.setenv("AWS_ACCESS_KEY_ID", "your_aws_access_key_here")
    monkeypatch.setenv("AWS_SECRET_ACCESS_KEY", "your_aws_secret_access_key_here")
    monkeypatch.setenv("AWS_ACCOUNT_ID", "123456789012")

    assert has_aws_credentials() is False
    assert create_boto_client("s3") is None
    assert create_boto_client("dynamodb") is None


# --------------------------------------------------------------------------
# 11. Public Endpoint Allowlist Matches Counts (TASK A5)
# --------------------------------------------------------------------------
def test_public_endpoint_allowlist_matches_counts():
    """
    Asserts that PUBLIC_DEMO_ENDPOINTS contains all 16 judge-safe unauthenticated endpoints,
    each is registered in the route table, and protected endpoints strictly reject
    unauthenticated requests with HTTP 401.
    """
    from backend.main import PUBLIC_DEMO_ENDPOINTS, app

    expected_endpoints = {
        "/health",
        "/api/health",
        "/api/judge/overview",
        "/api/demo/pipeline",
        "/api/incidents/simulate",
        "/api/resources",
        "/api/aws/metrics",
        "/api/citizen/reports",
        "/api/telemetry/live",
        "/api/rag/protocols",
        "/api/wards",
        "/api/auth/token",
        "/api/citizen/report",
        "/api/citizen/query",
        "/api/copilot/chat",
        "/api/v1/simulate/dynamic-telemetry",
    }
    assert PUBLIC_DEMO_ENDPOINTS == expected_endpoints
    assert len(PUBLIC_DEMO_ENDPOINTS) == 16

    route_paths = {r.path for r in app.routes if hasattr(r, "path")}
    for endpoint in PUBLIC_DEMO_ENDPOINTS:
        assert endpoint in route_paths, f"Missing route {endpoint} from FastAPI route table"

    # Strictly verify protected routes return 401 without token
    resp_incidents = client.get("/api/incidents")
    assert resp_incidents.status_code == 401

    resp_approve = client.post("/api/actions/ACT-001/approve", json={"officer_role": "incident_commander"})
    assert resp_approve.status_code == 401


# --------------------------------------------------------------------------
# 12. README Testnames Match Test Suite (TASK A7)
# --------------------------------------------------------------------------
def test_readme_testnames_match_suite():
    """
    Parses README.md, extracts every 'tests/...::test_x' token, and asserts
    that every extracted test name exists in `pytest --collect-only -q` output.
    Prevents fabricated or stale test listings in README documentation.
    """
    import re
    import subprocess
    import sys
    from pathlib import Path

    readme_path = Path(__file__).resolve().parent.parent / "README.md"
    assert readme_path.exists(), "README.md must exist at repository root"
    readme_content = readme_path.read_text(encoding="utf-8")

    readme_tests = set(re.findall(r"tests/[a-zA-Z0-9_]+\.py::test_[a-zA-Z0-9_]+", readme_content))
    assert len(readme_tests) > 0, "Expected to find tests/...::test_... entries in README.md"

    result = subprocess.run(
        [sys.executable, "-m", "pytest", "--collect-only", "-q"],
        capture_output=True,
        text=True,
        check=True
    )
    collected_tests = set()
    for line in result.stdout.splitlines():
        line = line.strip()
        if "::test_" in line:
            normalized = line.replace("\\", "/")
            collected_tests.add(normalized)

    for test_id in readme_tests:
        assert test_id in collected_tests, (
            f"Test '{test_id}' in README.md was not found in the pytest test suite! "
            f"Collected tests: {sorted(collected_tests)}"
        )


# --------------------------------------------------------------------------
# 13. Benchmark Numbers Match Docs (TASK A8)
# --------------------------------------------------------------------------
def test_benchmark_numbers_match_docs():
    """
    Asserts that any 'ms p50' latency claims in README or blog posts
    match real measurements documented in docs/BENCHMARK.md.
    """
    import re
    from pathlib import Path

    repo_root = Path(__file__).resolve().parent.parent
    benchmark_file = repo_root / "docs" / "BENCHMARK.md"
    assert benchmark_file.exists(), "docs/BENCHMARK.md must exist"
    benchmark_text = benchmark_file.read_text(encoding="utf-8")

    targets = [
        repo_root / "README.md",
        repo_root / "docs" / "AWS_BUILDER_CENTER_BLOG.md",
    ]

    p50_pattern = re.compile(r"(\d+(?:\.\d+)?)\s*ms\s*(?:p50|\(p50\)|P50)")
    for target in targets:
        if not target.exists():
            continue
        content = target.read_text(encoding="utf-8")
        matches = p50_pattern.findall(content)
        for num in matches:
            assert num in benchmark_text, (
                f"Latency claim '{num} ms p50' in {target.name} is not documented "
                f"in docs/BENCHMARK.md! Empirical reproducibility violation."
            )
