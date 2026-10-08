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
    assert incident["execution_mode"] in ["AWS_BEDROCK_STRANDS", "DETERMINISTIC_NDMA_FALLBACK"]

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
    while unauthorized roles are blocked under NDMA Section 4.3 statutory RBAC policy.
    """
    # 1. Create fresh test incident
    inc = strands_orchestrator.execute_workflow("WARD-17", "flood", {"rainfall_rate_mm_hr": 118.0})
    action = inc["recommended_actions"][0]
    action_id = action["id"]

    # 2. Verify unauthorized role is blocked with 403 Forbidden
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

    # 3. Verify authorized Incident Commander successfully approves action
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
