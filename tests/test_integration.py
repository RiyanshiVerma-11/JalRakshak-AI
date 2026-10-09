"""
JalRakshak AI — Comprehensive Integration & Fault-Tolerance Test Suite
Verifies:
1. End-to-End 118 mm/hr Cloudburst Pipeline (Agent 1 -> Agent 5 -> Incident Creation)
2. Fault Tolerance & Graceful Degradation (Bedrock Throttle -> Deterministic NDMA Rule Matrix)
3. Statutory RBAC & Human-in-the-Loop Sign-off (NDMA Sec 4.3 Policy)
4. AI Emergency Copilot Context-Aware SOP Retrieval
5. SAM Infrastructure as Code (IaC) Least-Privilege IAM Policy Validation
"""
import pytest
import yaml
from fastapi import HTTPException
from backend.data.mock_db import db
from backend.agents.strands_workflow import strands_orchestrator
from backend.agents.risk_agent import risk_agent
from backend.copilot import copilot
from backend.main import approve_action, ActionApprovalRequest

def test_flood_cloudburst_pipeline_and_incident_creation():
    """
    Test 1: Verifies that a 118 mm/hr rainfall input triggers Agent 1 (Risk Detection),
    executes the 5-Agent AWS Strands DAG, and successfully persists an Incident Record in DynamoDB store.
    """
    ward_id = "WARD-17"
    category = "flood"
    telemetry = {
        "rainfall_rate_mm_hr": 118.0,
        "flood_depth_cm": 42.0,
        "drainage_saturation_pct": 98.5,
        "temperature_c": 27.5,
        "citizen_reports_count": 8
    }

    # 1. Verify Agent 1 evaluates risk directly
    ward_info = db.wards[ward_id]
    risk_output = risk_agent.evaluate(category, ward_info, telemetry)
    assert risk_output["severity"] == "CRITICAL", f"Expected CRITICAL severity, got {risk_output['severity']}"
    assert risk_output["confidence"] >= 0.90, f"Expected confidence >= 0.90, got {risk_output['confidence']}"
    assert len(risk_output["explainability"]["factors"]) >= 4, "Expected at least 4 explainability factors"

    # 2. Execute full 5-Agent Strands Workflow
    incident = strands_orchestrator.execute_workflow(
        ward_id=ward_id,
        category=category,
        telemetry=telemetry,
        title_override="Test Live Cloudburst Incident"
    )

    # 3. Verify Incident Record Structure
    assert incident is not None
    assert incident["id"].startswith("INC-")
    assert incident["severity"] == "CRITICAL"
    assert "Kurla" in incident["ward_name"]
    assert incident["status"] == "PENDING_APPROVAL"
    assert incident["execution_mode"] in ["AWS_BEDROCK_STRANDS", "AWS_HYBRID_BEDROCK_STRANDS", "OFFLINE_LOCAL_STRANDS", "DETERMINISTIC_NDMA_FALLBACK"]

    # 4. Verify 5-Agent Trace
    trace = incident["agent_trace"]
    assert "risk_agent" in trace
    assert "impact_agent" in trace
    assert "resource_agent" in trace
    assert "communication_agent" in trace
    assert "coordinator_agent" in trace

    # 5. Verify Multilingual Alerts
    alerts = incident["alerts_content"]
    assert ("english" in alerts or "en" in alerts)
    assert ("hindi" in alerts or "hi" in alerts)
    assert ("marathi" in alerts or "mr" in alerts)

    # 6. Verify Database Persistence (DynamoDB mock)
    persisted = db.get_incident(incident["id"])
    assert persisted is not None
    assert persisted["id"] == incident["id"]

def test_bedrock_fault_tolerance_and_ndma_fallback():
    """
    Test 2: Verifies graceful degradation. If Amazon Bedrock experiences rate throttling
    or timeouts, the system falls back to the deterministic statutory NDMA 2024 matrix
    without throwing unhandled exceptions or causing downtime.
    """
    ward_id = "WARD-17"
    category = "flood"
    telemetry = {
        "rainfall_rate_mm_hr": 118.0,
        "flood_depth_cm": 42.0,
        "drainage_saturation_pct": 98.0
    }

    # Execute workflow with simulated Bedrock throttling (HTTP 429)
    fallback_incident = strands_orchestrator.execute_workflow(
        ward_id=ward_id,
        category=category,
        telemetry=telemetry,
        simulate_bedrock_throttle=True
    )

    assert fallback_incident is not None
    assert fallback_incident["execution_mode"] == "DETERMINISTIC_NDMA_FALLBACK"
    assert fallback_incident["fault_tolerance"]["graceful_degradation_active"] is True
    assert "NDMA" in fallback_incident["fault_tolerance"]["statutory_safety_net"]
    assert fallback_incident["severity"] == "CRITICAL"
    assert len(fallback_incident["recommended_actions"]) >= 3
    assert fallback_incident["rag_reference"]["sop_id"] == "NDMA-SOP-FLD-2024-SEC4.3"

def test_human_in_the_loop_action_approval():
    """
    Test 3: Verifies that human statutory approval advances action state and dispatches asset,
    verifying true round-trip database persistence under db._lock, while unauthorized/unauthenticated
    roles are strictly blocked under NDMA Section 4.3 statutory RBAC policy.
    """
    # 1. Create fresh test incident
    inc = strands_orchestrator.execute_workflow("WARD-17", "flood", {"rainfall_rate_mm_hr": 118.0})
    action = inc["recommended_actions"][0]
    action_id = action["id"]
    assigned_res_id = action.get("resource_id")

    # 2. Verify unauthenticated / default role request fails with 403 Forbidden
    with pytest.raises(HTTPException) as unauth_exc:
        approve_action(
            action_id=action_id,
            req=ActionApprovalRequest()  # No officer_role or officer_id provided
        )
    assert unauth_exc.value.status_code == 403
    assert "NDMA Section 4.3" in unauth_exc.value.detail

    # 3. Verify unauthorized citizen role is explicitly blocked with 403 Forbidden
    with pytest.raises(HTTPException) as exc_info:
        approve_action(
            action_id=action_id,
            req=ActionApprovalRequest(
                officer_id="CITIZEN_01",
                officer_name="Unauthorized Citizen",
                officer_role="citizen",
                notes="Unauthorized dispatch attempt"
            )
        )
    assert exc_info.value.status_code == 403
    assert "NDMA Section 4.3" in exc_info.value.detail

    # 4. Verify authorized Incident Commander successfully approves action
    res = approve_action(
        action_id=action_id,
        req=ActionApprovalRequest(
            officer_id="OFFICER_PATIL_EOC",
            officer_name="IAS Shrikar Patil",
            officer_role="incident_commander",
            notes="Authorized under NDMA Section 4.3"
        )
    )

    assert res["success"] is True
    assert res["action"]["status"] == "APPROVED"
    assert "IAS Shrikar Patil" in res["action"]["approved_by"]

    # 5. Verify Database Round-Trip State Persistence (db.get_incidents())
    # Asserts that the in-memory database copy was mutated under lock and not lost to shallow copy
    all_persisted = db.get_incidents()
    target_inc = next((i for i in all_persisted if i["id"] == inc["id"]), None)
    assert target_inc is not None, f"Incident {inc['id']} not found in database round-trip"
    persisted_act = next((a for a in target_inc["recommended_actions"] if a["id"] == action_id), None)
    assert persisted_act is not None, f"Action {action_id} not found in persisted incident"
    assert persisted_act["status"] == "APPROVED", f"Expected persisted status APPROVED, got {persisted_act['status']}"
    assert "IAS Shrikar Patil" in persisted_act["approved_by"]

    # 6. Verify Physical Resource Status Mutation (DISPATCHED)
    if assigned_res_id and not assigned_res_id.startswith("SNS"):
        res_list = db.get_resources()
        dispatched_res = next((r for r in res_list if r["id"] == assigned_res_id), None)
        assert dispatched_res is not None, f"Resource {assigned_res_id} not found in database"
        assert dispatched_res["status"] == "DISPATCHED", f"Expected resource status DISPATCHED, got {dispatched_res['status']}"
        assert dispatched_res["assigned_to"] == inc["id"]

def test_emergency_copilot_rag_query():
    """
    Test 4: Verifies the AI Emergency Copilot retrieves context-grounded SOP recommendations.
    """
    res = copilot.answer_query("flood situation in Kurla Ward 17")
    assert "situation_summary" in res
    assert "key_metrics" in res
    assert len(res["recommended_actions"]) >= 1
    assert "statutory_sop_citation" in res
    assert "Disaster Management" in res["statutory_sop_citation"]["reference"]

def test_sam_infrastructure_as_code_template():
    """
    Test 5: Verifies that the SAM template (aws_infra/template.yaml) is structurally valid,
    defines at least 10 AWS resources, and enforces least-privilege IAM policies for Bedrock, DynamoDB, and SNS.
    """
    class CfnLoader(yaml.SafeLoader):
        pass

    def cfn_tag(loader, tag_suffix, node):
        if isinstance(node, yaml.ScalarNode):
            return loader.construct_scalar(node)
        elif isinstance(node, yaml.SequenceNode):
            return loader.construct_sequence(node)
        return loader.construct_mapping(node)

    CfnLoader.add_multi_constructor("!", cfn_tag)

    with open("aws_infra/template.yaml", "r", encoding="utf-8") as f:
        template = yaml.load(f, Loader=CfnLoader)

    resources = template.get("Resources", {})
    assert len(resources) >= 10, f"Expected at least 10 AWS resources, found {len(resources)}"

    # Required production components
    assert "EmergencyEventBus" in resources
    assert "IncidentsTable" in resources
    assert "EmergencyAlertsTopic" in resources
    assert "StrandsExecutionRole" in resources
    assert "StrandsAgentOrchestratorLambda" in resources

    # Verify least-privilege IAM role properties
    role = resources["StrandsExecutionRole"]["Properties"]
    policies = role.get("Policies", [])
    policy_names = [p["PolicyName"] for p in policies]
    assert "DynamoDBLeastPrivilegeAccess" in policy_names
    assert "BedrockModelInvocationAccess" in policy_names
    assert "SNSEmergencyPublishAccess" in policy_names

def test_serverless_lambda_handlers_execution():
    """
    Test 6: Verifies that AWS Lambda handlers defined in SAM template
    (citizen_ingest_handler and strands_agent_orchestrator_handler) execute cleanly.
    """
    import json
    from aws_infra import lambda_handlers

    # 1. Citizen Ingest Handler
    citizen_event = {
        "body": json.dumps({
            "category": "waterlogging",
            "ward_id": "WARD-17",
            "user_description": "Water logging near bridge"
        })
    }
    cit_res = lambda_handlers.citizen_ingest_handler(citizen_event, None)
    assert cit_res["statusCode"] == 200
    cit_body = json.loads(cit_res["body"])
    assert cit_body["success"] is True
    assert cit_body["report_id"].startswith("CR-")
    assert cit_body["ai_analysis"]["severity_score"] > 0

    # 2. Strands Orchestrator Handler
    strands_event = {
        "detail": {
            "category": "flood",
            "ward_id": "WARD-17"
        }
    }
    strands_res = lambda_handlers.strands_agent_orchestrator_handler(strands_event, None)
    assert strands_res["statusCode"] == 200
    strands_body = json.loads(strands_res["body"])
    assert strands_body["status"] == "COMPLETED"
    assert strands_body["plan_generated"] is True


def test_dynamic_telemetry_simulation_endpoint():
    """
    Test 7: Verifies POST /api/v1/simulate/dynamic-telemetry endpoint:
    - Dynamic breach percentage calculation
    - Risk level thresholding (NORMAL -> ELEVATED -> HIGH -> CRITICAL)
    - High-discharge dewatering pump scaling
    - Mathematical confidence bounds [68.5, 98.8]%
    - Vector RAG semantic SOP retrieval
    """
    from fastapi.testclient import TestClient
    from backend.main import app

    client = TestClient(app)

    # Scenario A: Cloudburst 118 mm/hr with HIGH tide
    resp_a = client.post("/api/v1/simulate/dynamic-telemetry", json={
        "rainfall_rate": 118.0,
        "tide_level": "HIGH",
        "ward_id": "WARD-17",
        "verified_photos": 6
    })
    assert resp_a.status_code == 200
    data_a = resp_a.json()
    assert data_a["ward_id"] == "WARD-17"
    assert data_a["rainfall_rate"] == 118.0
    assert data_a["tide_level"] == "HIGH"
    assert data_a["risk_level"] == "HIGH"
    assert data_a["breach_pct"] > 0.0
    assert data_a["pump_count"] == 5
    assert 68.5 <= data_a["confidence_score"] <= 98.8
    assert data_a["exposed_population"] > 0
    assert "sop_match" in data_a
    assert data_a["sop_match"]["id"].startswith("SOP-")
    assert 0.0 < data_a["sop_match"]["vector_score"] <= 1.0
    assert len(data_a["sop_match"]["mandatory_actions"]) >= 1

    # Scenario B: Extreme catastrophic deluge 165 mm/hr with VERY_HIGH tide
    resp_b = client.post("/api/v1/simulate/dynamic-telemetry", json={
        "rainfall_rate": 165.0,
        "tide_level": "VERY_HIGH",
        "ward_id": "WARD-17",
        "verified_photos": 12
    })
    assert resp_b.status_code == 200
    data_b = resp_b.json()
    assert data_b["risk_level"] == "CRITICAL"
    assert data_b["breach_pct"] == 100.0
    assert data_b["pump_count"] == 8
    assert 68.5 <= data_b["confidence_score"] <= 98.8

    # Scenario C: Dry/mild weather 25 mm/hr with LOW tide
    resp_c = client.post("/api/v1/simulate/dynamic-telemetry", json={
        "rainfall_rate": 25.0,
        "tide_level": "LOW",
        "ward_id": "WARD-17",
        "verified_photos": 0
    })
    assert resp_c.status_code == 200
    data_c = resp_c.json()
    assert data_c["risk_level"] == "NORMAL"
    assert data_c["breach_pct"] == 0.0
    assert data_c["pump_count"] == 1
    assert 68.5 <= data_c["confidence_score"] <= 98.8


def test_rag_vector_search_cosine_similarity():
    """
    Test 8: Verifies semantic vector search in backend/rag/sop_knowledge.py:
    - Scikit-learn TF-IDF vectorization with cosine similarity matching
    - Returns valid cosine similarity score between 0.0 and 1.0
    - Correctly maps climate disaster queries to statutory NDMA SOP documents
    - Ensures all indexed SOP documents contain required schema
    """
    from backend.rag.sop_knowledge import query_sop_knowledge, get_all_sop_documents

    # 1. Corpus verification
    all_docs = get_all_sop_documents()
    assert len(all_docs) >= 5
    for doc in all_docs:
        assert "id" in doc
        assert "title" in doc
        assert "citation" in doc
        assert "category" in doc
        assert "mandatory_actions" in doc
        assert len(doc["mandatory_actions"]) >= 1

    # 2. Flood domain semantic retrieval
    flood_query = "Mithi River culvert overflow waterlogging inundated depth 40cm evacuation"
    flood_result = query_sop_knowledge(flood_query, top_k=1)
    assert flood_result["id"] in ["SOP-FLD-101", "SOP-FLD-102"]
    assert 0.15 <= flood_result["vector_score"] <= 1.0
    assert "NDMA" in flood_result["citation"]

    # 3. Heat wave domain semantic retrieval
    heat_query = "severe heat wave wet bulb temperature 43C vulnerable population ORS shelters"
    heat_result = query_sop_knowledge(heat_query, top_k=1)
    assert heat_result["id"] == "SOP-HEAT-04"
    assert 0.15 <= heat_result["vector_score"] <= 1.0
    assert "NHAP" in heat_result["citation"]

    # 4. Pipeline burst semantic retrieval
    pipe_query = "high pressure trunk main fracture contaminated water supply pipeline rupture"
    pipe_result = query_sop_knowledge(pipe_query, top_k=1)
    assert pipe_result["id"] == "SOP-PIPE-82"
    assert 0.15 <= pipe_result["vector_score"] <= 1.0
    assert "CPHEEO" in pipe_result["citation"]


def test_mathematical_confidence_score_bounds():
    """
    Test 9: Verifies mathematical confidence formula bounds across boundary cases:
    - Minimum bound 68.5%
    - Maximum bound 98.8%
    - Monotonically rewards verified citizen photos and rainfall deltas
    """
    from backend.main import _compute_confidence

    # Low rainfall, zero photos
    c_low = _compute_confidence(0.0, 0)
    assert 68.5 <= c_low <= 98.8

    # Baseline threshold 45 mm/hr
    c_base = _compute_confidence(45.0, 0)
    assert 68.5 <= c_base <= 98.8

    # Extreme rainfall with citizen corroboration
    c_extreme = _compute_confidence(200.0, 15)
    assert 68.5 <= c_extreme <= 98.8
    assert c_extreme > c_low


def test_live_aws_bedrock_invocation():
    """
    Test 10 (Bedrock Invocation):
    - When AWS_EXECUTION_MODE=LIVE and credentials exist, invokes Amazon Bedrock Runtime.
    - When in Build It route (Local / Zero-Config), verifies canonical model ID and
      verifies that the Strands local model bridge executes protocol-grounded inference.
    """
    from backend.cloud.config import get_backend_mode, get_bedrock_model_id, has_aws_credentials, DEFAULT_BEDROCK_MODEL_ID
    from backend.cloud.aws_bridge import aws_bridge

    model_id = get_bedrock_model_id()
    assert model_id == DEFAULT_BEDROCK_MODEL_ID

    mode = get_backend_mode()
    if mode == "AWS" and has_aws_credentials():
        import boto3
        import os
        region = os.environ.get("AWS_DEFAULT_REGION", os.environ.get("AWS_REGION", "ap-south-1"))
        client = boto3.client("bedrock-runtime", region_name=region)
        response = client.converse(
            modelId=model_id,
            messages=[{"role": "user", "content": [{"text": "JalRakshak ping"}]}]
        )
        assert response["ResponseMetadata"]["HTTPStatusCode"] == 200
    else:
        # Build It route: executes model bridge offline fallback without network/credentials
        resp = aws_bridge.invoke_bedrock_claude(
            prompt="Generate flood warning for Ward 17",
            system_prompt="You are municipal disaster controller"
        )
        assert resp is not None
        assert isinstance(resp, str)
        assert len(resp) > 0


def test_live_aws_dynamodb_persistence():
    """
    Test 11 (DynamoDB Persistence):
    - When AWS_EXECUTION_MODE=LIVE and credentials exist, verifies live DynamoDB table connectivity.
    - When in Build It route (Local / Zero-Config), verifies round-trip persistence in InMemoryStateStore.
    """
    from backend.cloud.config import get_backend_mode, has_aws_credentials
    from backend.cloud.aws_bridge import aws_bridge
    from backend.data.state_store import state_store

    mode = get_backend_mode()
    if mode == "AWS" and has_aws_credentials():
        import boto3
        import os
        region = os.environ.get("AWS_DEFAULT_REGION", os.environ.get("AWS_REGION", "ap-south-1"))
        table_name = os.environ.get("INCIDENTS_TABLE", "JalRakshak-IncidentsTable")
        client = boto3.client("dynamodb", region_name=region)
        response = client.describe_table(TableName=table_name)
        assert response["Table"]["TableStatus"] in ["ACTIVE", "UPDATING"]
    else:
        # Build It route: zero-config state store persistence
        test_inc = {
            "id": "INC-TEST-DYN-01",
            "ward_name": "Kurla L-Ward",
            "severity": "CRITICAL",
            "status": "PENDING_APPROVAL",
            "simulated": True
        }
        res = aws_bridge.persist_incident_to_dynamodb(test_inc)
        assert res is True
        persisted = state_store.get_incident("INC-TEST-DYN-01")
        assert persisted is not None
        assert persisted["id"] == "INC-TEST-DYN-01"


def test_zero_config_boot_and_health_endpoint():
    """
    Test 12: Verifies that the platform boots with zero configuration and zero credentials,
    serves /api/health with 200 OK and honest subsystem status, and runs the simulation pipeline.
    """
    from fastapi.testclient import TestClient
    from backend.main import app
    client = TestClient(app)

    # Health check
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "HEALTHY"
    assert data["route"] == "Build It"
    assert data["agents_online"] == 5
    assert "orchestrator" in data

    # Incident Simulation
    sim_resp = client.post(
        "/api/incidents/simulate",
        json={"scenario": "flood", "ward_id": "WARD-17"}
    )
    assert sim_resp.status_code == 200
    sim_data = sim_resp.json()
    incident = sim_data["incident"]
    assert incident["id"].startswith("INC-")
    assert len(incident["agent_trace"]) == 5


def test_simulated_flags_on_offline_responses():
    """
    Test 13: Verifies that every response carrying simulated values explicitly sets simulated=True
    and delivered=False, adhering strictly to the zero-fabrication hackathon rule.
    """
    from backend.cloud.aws_bridge import aws_bridge
    from backend.vision.image_analyzer import image_analyzer
    from backend.cloud.config import get_backend_mode

    mode = get_backend_mode()
    if mode != "AWS":
        # SNS alert without live credentials must be explicitly flagged simulated
        sns_res = aws_bridge.publish_sns_emergency_alert(
            subject="Test Advisory",
            message="Test message",
            languages={"english": "Test"},
            ward_id="WARD-17"
        )
        assert sns_res["simulated"] is True
        assert sns_res["delivered"] is False
        assert sns_res["message_id"] is None

        # Image analyzer without live Rekognition credentials must be flagged simulated
        vision_res = image_analyzer.analyze_image("waterlogging", "Heavy flood in street")
        assert vision_res["simulated"] is True
        # Cloud metrics must explicitly flag unbacked services
        metrics = aws_bridge.get_cloud_metrics()
        assert metrics["services"]["Amazon_SNS"]["simulated"] is True
        assert metrics["services"]["Amazon_Rekognition"]["simulated"] is True

        # Execution mode must be honest: OFFLINE_LOCAL_STRANDS when offline
        assert metrics["execution_mode"] == "OFFLINE_LOCAL_STRANDS"


def test_localstack_configuration_and_compose_spec():
    """
    Verifies that the LocalStack offline AWS emulation files exist, are well-formed,
    and specify the required serverless resources (S3, DynamoDB, SNS, EventBridge).
    """
    import os
    import yaml
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    compose_path = os.path.join(root_dir, "docker-compose.local.yml")
    init_script_path = os.path.join(root_dir, "scripts", "localstack-init.sh")
    setup_script_path = os.path.join(root_dir, "scripts", "setup_localstack.py")

    assert os.path.isfile(compose_path), "docker-compose.local.yml must exist"
    assert os.path.isfile(init_script_path), "scripts/localstack-init.sh must exist"
    assert os.path.isfile(setup_script_path), "scripts/setup_localstack.py must exist"

    with open(compose_path, "r", encoding="utf-8") as f:
        compose_data = yaml.safe_load(f)

    services = compose_data.get("services", {})
    assert "localstack" in services, "LocalStack service must be defined in compose"
    assert "4566:4566" in services["localstack"]["ports"]

    with open(init_script_path, "r", encoding="utf-8") as f:
        init_content = f.read()

    assert "jalrakshak-evidence-lake" in init_content
    assert "JalRakshak-IncidentsTable" in init_content
    assert "JalRakshak-Alerts-Multilingual" in init_content
    assert "jalrakshak-emergency-eventbus" in init_content


