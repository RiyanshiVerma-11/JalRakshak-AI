"""
Test Suite: AWS Cedar Policy Engine & Cryptographic JWT Authentication
Verifies:
1. Rejection of dummy string tokens with HTTP 401.
2. Token generation and cryptographic verification.
3. Statutory RBAC authorization via AWS Cedar (cedarpy).
4. Protection of /api/incidents and /api/actions/{action_id}/approve.
5. Absence of fake AWS account IDs (123456789012) in auth roles endpoint.
"""
import pytest
from fastapi.testclient import TestClient
from fastapi import HTTPException

from backend.main import app
from backend.auth.cedar_auth import (
    create_access_token,
    verify_jwt_token,
    evaluate_cedar_policy
)
from backend.data.mock_db import db

client = TestClient(app)


def test_cedar_policy_evaluation():
    # Statutory Incident Commander: permitted to approve and read
    assert evaluate_cedar_policy("incident_commander", "approve_action") is True
    assert evaluate_cedar_policy("incident_commander", "read_incidents") is True

    # SCADA Analyst: permitted to read incidents, but not approve
    assert evaluate_cedar_policy("scada_analyst", "read_incidents") is True
    assert evaluate_cedar_policy("scada_analyst", "approve_action") is False

    # Citizen: explicitly forbidden from approving
    assert evaluate_cedar_policy("citizen", "approve_action") is False
    assert evaluate_cedar_policy("citizen", "read_incidents") is False


def test_jwt_generation_and_verification():
    token = create_access_token(
        officer_id="OFFICER_TEST_01",
        officer_name="Commissioner Test",
        role="incident_commander"
    )
    assert isinstance(token, str)
    assert len(token.split(".")) == 3

    payload = verify_jwt_token(token)
    assert payload["sub"] == "OFFICER_TEST_01"
    assert payload["role"] == "incident_commander"


def test_dummy_bearer_token_rejection():
    # Plain string tokens like 'incident_commander' must be rejected with 401
    with pytest.raises(HTTPException) as exc_info:
        verify_jwt_token("incident_commander")
    assert exc_info.value.status_code == 401

    # Endpoints with Bearer incident_commander must return 401
    resp = client.get(
        "/api/incidents",
        headers={"Authorization": "Bearer incident_commander"}
    )
    assert resp.status_code == 401
    assert "Malformed Bearer token" in resp.json()["detail"]


def test_unauthenticated_incidents_rejection():
    resp = client.get("/api/incidents")
    assert resp.status_code == 401


def test_valid_token_incidents_success():
    tok_res = client.post("/api/auth/token", json={"role": "incident_commander", "credential": "commander123"})
    assert tok_res.status_code == 200
    token = tok_res.json()["access_token"]

    resp = client.get(
        "/api/incidents",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_citizen_denied_approval():
    tok_res = client.post("/api/auth/token", json={"role": "citizen", "credential": "citizen123"})
    token = tok_res.json()["access_token"]

    action_id = db.incidents[0]["recommended_actions"][0]["id"]
    resp = client.post(
        f"/api/actions/{action_id}/approve",
        headers={"Authorization": f"Bearer {token}"},
        json={"officer_role": "citizen"}
    )
    assert resp.status_code == 403
    assert "Cedar" in resp.json()["detail"]


def test_commander_authorized_approval():
    tok_res = client.post("/api/auth/token", json={"role": "incident_commander", "credential": "commander123"})
    token = tok_res.json()["access_token"]

    action_id = db.incidents[0]["recommended_actions"][0]["id"]
    resp = client.post(
        f"/api/actions/{action_id}/approve",
        headers={"Authorization": f"Bearer {token}"},
        json={"officer_role": "incident_commander"}
    )
    assert resp.status_code == 200
    assert resp.json()["success"] is True


def test_auth_roles_has_no_fake_ids():
    resp = client.get("/api/auth/roles")
    assert resp.status_code == 200
    text = resp.text
    assert "123456789012" not in text
    assert "ap-south-1_JalRakshakPool" not in text
    assert "6a992bc4439f01e7" not in text
    data = resp.json()
    assert data["authorization_engine"] == "AWS Cedar (cedarpy)"
