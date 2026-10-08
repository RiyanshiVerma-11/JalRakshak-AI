"""
JalRakshak AI - FastAPI Backend Server
Empowering municipal emergency response with AWS Strands Multi-Agent orchestration,
SOP RAG retrieval, multimodal citizen vision, and Human-in-the-Loop decision execution.
"""
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid
from datetime import datetime

from .data.mock_db import db
from .agents.strands_workflow import strands_orchestrator
from .vision.image_analyzer import image_analyzer
from .aws_simulator.aws_bridge import aws_bridge
from .rag.rag_engine import rag_engine
from .copilot import copilot

app = FastAPI(
    title="JalRakshak AI - Climate Emergency Response Platform",
    description="Multi-agent emergency decision orchestrator powered by AWS Strands & SOP RAG",
    version="1.0.0"
)

# Enable CORS for local Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class SimulateRequest(BaseModel):
    scenario: str # "flood", "heatwave", "leak", "water_shortage"
    ward_id: Optional[str] = "WARD-17"
    custom_rainfall: Optional[float] = None
    custom_temp: Optional[float] = None

class ActionApprovalRequest(BaseModel):
    officer_id: Optional[str] = "OFFICER_PATIL_EOC"
    officer_name: Optional[str] = "Municipal Commissioner EOC"
    officer_role: Optional[str] = "incident_commander"
    notes: Optional[str] = "Authorized for immediate tactical execution under NDMA protocol"

class ActionModifyRequest(BaseModel):
    officer_id: Optional[str] = "OFFICER_PATIL_EOC"
    officer_name: Optional[str] = "Municipal Commissioner EOC"
    officer_role: Optional[str] = "incident_commander"
    modified_action: str
    modified_resource_id: Optional[str] = None
    notes: Optional[str] = None

class CopilotQuery(BaseModel):
    query: str

# API Endpoints
@app.get("/api/health")
def read_health():
    return {
        "platform": "JalRakshak AI",
        "tagline": "Turning real-time environmental signals and citizen reports into prioritized actions.",
        "status": "OPERATIONAL",
        "aws_region": aws_bridge.region,
        "agents_online": 5,
        "orchestrator": "AWS Strands Agents SDK"
    }

@app.get("/api/incidents")
def get_incidents():
    return db.get_incidents()

@app.get("/api/incidents/{incident_id}")
def get_incident_detail(incident_id: str):
    inc = db.get_incident(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc

@app.post("/api/incidents/simulate")
def simulate_scenario(req: SimulateRequest):
    """
    Simulates a live climate emergency event (e.g. 118mm/hr cloudburst in Ward 17)
    and executes the complete 5-agent AWS Strands workflow.
    """
    category = req.scenario
    ward_id = req.ward_id or "WARD-17"

    telemetry = {}
    title = None

    if category == "flood":
        rain = req.custom_rainfall or 118.0
        telemetry = {
            "rainfall_rate_mm_hr": rain,
            "accumulated_rain_24h_mm": 195.0,
            "flood_depth_cm": 42.0,
            "drainage_saturation_pct": 98.5,
            "temperature_c": 27.5,
            "citizen_reports_count": 8
        }
        title = f"🔴 LIVE EVENT: Extreme Cloudburst ({rain} mm/hr) & Flash Flood Risk"
    elif category == "heatwave":
        temp = req.custom_temp or 44.8
        telemetry = {
            "temperature_c": temp,
            "humidity_pct": 72.0,
            "heat_index_celsius": 51.2,
            "wet_bulb_temp_c": 32.4,
            "citizen_reports_count": 6
        }
        title = f"🔥 LIVE EVENT: Severe Heat Index Spike ({temp}°C / 51.2°C Index)"
        ward_id = "WARD-04"
    elif category == "leak":
        telemetry = {
            "pressure_drop_bar": 2.4,
            "flow_anomaly_pct": 390.0,
            "estimated_loss_kld": 520.0,
            "citizen_reports_count": 9
        }
        title = "🚰 LIVE EVENT: Critical 600mm Mainline Burst on Arterial Highway"
        ward_id = "WARD-08"
    else: # water_shortage
        telemetry = {
            "reservoir_capacity_pct": 11.2,
            "supply_hours_day": 1.0,
            "per_capita_deficit_lpcd": 48.0,
            "citizen_reports_count": 15
        }
        title = "💧 LIVE EVENT: Govandi Elevated Reservoir Depletion (< 12%)"
        ward_id = "WARD-12"

    # Emit trigger event to Amazon EventBridge
    aws_bridge.emit_event(
        source="aws.iot.environment",
        detail_type="SensorThresholdExceeded",
        detail={"category": category, "ward_id": ward_id, "telemetry": telemetry}
    )

    # Execute 5-agent Strands workflow
    incident = strands_orchestrator.execute_workflow(
        ward_id=ward_id,
        category=category,
        telemetry=telemetry,
        title_override=title
    )

    return {
        "message": f"Simulated {category.upper()} emergency. Multi-agent workflow completed successfully.",
        "incident": incident
    }

@app.post("/api/actions/{action_id}/approve")
def approve_action(action_id: str, req: ActionApprovalRequest):
    """
    Human-in-the-Loop Approval:
    Authorizes tactical dispatch, dispatches assigned resource, sends SNS broadcast if needed, and writes audit record.
    """
    # Statutory RBAC Validation: NDMA Section 4.3 & Principle of Least Privilege
    if req.officer_role and req.officer_role != "incident_commander":
        db.log_audit(
            officer=f"{req.officer_name} ({req.officer_role})",
            event="ACCESS_DENIED_UNAUTHORIZED_APPROVAL_ATTEMPT",
            details=f"Blocked attempt to approve action '{action_id}' by unauthorized role '{req.officer_role}'"
        )
        raise HTTPException(
            status_code=403,
            detail=f"Authorization Denied: Role '{req.officer_role}' lacks statutory sign-off authority under NDMA Section 4.3 & Disaster Management Act 2005. Only Incident Commander (EOC) can authorize tactical dispatch."
        )

    incidents = db.get_incidents()
    target_action = None
    parent_incident = None

    for inc in incidents:
        for act in inc.get("recommended_actions", []):
            if act["id"] == action_id:
                target_action = act
                parent_incident = inc
                break
        if target_action:
            break

    if not target_action:
        raise HTTPException(status_code=404, detail="Action not found")

    target_action["status"] = "APPROVED"
    target_action["approved_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    target_action["approved_by"] = f"{req.officer_name} ({req.officer_id})"

    # If action has an assigned physical resource, update resource status
    resource_id = target_action.get("resource_id")
    if resource_id and not resource_id.startswith("SNS"):
        for res in db.get_resources():
            if res["id"] == resource_id:
                res["status"] = "DISPATCHED"
                res["assigned_to"] = parent_incident["id"]
                break

    # If this was an alert/broadcast action, dispatch through Amazon SNS
    if "SNS" in str(resource_id) or "Broadcast" in target_action["action"] or "SMS" in target_action["action"]:
        aws_bridge.publish_sns_emergency_alert(
            subject=f"JalRakshak Alert: {parent_incident['title']}",
            message=parent_incident.get("alerts_content", {}).get("english", target_action["action"]),
            languages=parent_incident.get("alerts_content", {}),
            ward_id=parent_incident["ward_id"]
        )

    # Check if all actions are resolved
    all_approved = all(a["status"] == "APPROVED" for a in parent_incident.get("recommended_actions", []))
    if all_approved:
        parent_incident["status"] = "IN_PROGRESS"

    db.log_audit(
        officer=f"{req.officer_name} ({req.officer_role})",
        event="ACTION_APPROVED_NDMA_SEC_4_3",
        details=f"Statutory approval granted for '{target_action['action']}' ({parent_incident['id']})"
    )

    return {
        "success": True,
        "action": target_action,
        "incident_id": parent_incident["id"],
        "message": f"Action authorized by {req.officer_name}. Resources dispatched & alerts queued."
    }

@app.post("/api/actions/{action_id}/modify")
def modify_action(action_id: str, req: ActionModifyRequest):
    """
    Human-in-the-Loop Modification: Allows commander to adjust order parameters or resource allocation.
    """
    if req.officer_role and req.officer_role != "incident_commander":
        raise HTTPException(
            status_code=403,
            detail=f"Authorization Denied: Only Incident Commander can modify statutory disaster directives."
        )

    incidents = db.get_incidents()
    for inc in incidents:
        for act in inc.get("recommended_actions", []):
            if act["id"] == action_id:
                act["action"] = req.modified_action
                if req.modified_resource_id:
                    act["resource_id"] = req.modified_resource_id
                act["status"] = "MODIFIED_AND_APPROVED"
                act["approved_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                act["approved_by"] = req.officer_id

                db.log_audit(
                    officer=f"{req.officer_name} ({req.officer_role})",
                    event="ACTION_MODIFIED",
                    details=f"Modified action {action_id}: {req.modified_action}"
                )
                return {"success": True, "action": act}

    raise HTTPException(status_code=404, detail="Action not found")

@app.get("/api/auth/roles")
def get_auth_roles():
    """
    Returns Amazon Cognito User Pool configuration and IAM Principle of Least Privilege role mappings.
    """
    return {
        "cognito_user_pool_id": "ap-south-1_JalRakshakPool",
        "cognito_client_id": "6a992bc4439f01e7",
        "statutory_act": "Disaster Management Act 2005 (Sections 30 & 34)",
        "roles": [
            {
                "role": "incident_commander",
                "title": "Municipal Incident Commander",
                "ics_tier": "Tier 1 (Apex Command)",
                "iam_role_arn": "arn:aws:iam::123456789012:role/JalRakshak-IncidentCommanderRole",
                "permissions": ["DISPATCH_AUTHORITY", "BROADCAST_SNS", "OVERRIDE_SIMULATION"]
            },
            {
                "role": "field_responder",
                "title": "Tactical Field Operations Lead",
                "ics_tier": "Tier 3 (Tactical Response)",
                "iam_role_arn": "arn:aws:iam::123456789012:role/JalRakshak-FieldResponderRole",
                "permissions": ["UPDATE_ASSET_STATUS", "UPLOAD_FIELD_PROOF", "READ_TACTICAL_MANIFEST"]
            },
            {
                "role": "scada_analyst",
                "title": "Chief Hydrologist & SCADA Analyst",
                "ics_tier": "Tier 2 (Intelligence & Planning)",
                "iam_role_arn": "arn:aws:iam::123456789012:role/JalRakshak-SCADAAnalystRole",
                "permissions": ["READ_SCADA_TELEMETRY", "TUNE_SIMULATION", "INSPECT_STRANDS_DAG"]
            },
            {
                "role": "citizen",
                "title": "Public Resident",
                "ics_tier": "Public Stakeholder",
                "iam_role_arn": "arn:aws:iam::123456789012:role/JalRakshak-PublicCitizenRole",
                "permissions": ["SUBMIT_VISION_REPORT", "VIEW_BROADCASTS", "TRACK_WATER_TANKERS"]
            }
        ]
    }

@app.get("/api/resources")
def get_resources():
    return db.get_resources()

@app.get("/api/citizen/reports")
def get_citizen_reports():
    return db.get_citizen_reports()

@app.post("/api/citizen/report")
async def submit_citizen_report(
    category: str = Form("waterlogging"),
    ward_id: str = Form("WARD-17"),
    address: str = Form(""),
    user_description: str = Form(""),
    reporter_name: str = Form("Citizen Resident"),
    reporter_phone: str = Form("98XXXXXXXX"),
    image: Optional[UploadFile] = File(None)
):
    """
    Citizen PWA Report Submission with Computer Vision Analysis.
    """
    report_id = f"CR-{uuid.uuid4().hex[:4].upper()}"

    # Analyze with multimodal computer vision
    vision_result = image_analyzer.analyze_image(
        category=category,
        description=user_description,
        image_bytes_len=0
    )

    # Mock S3 upload
    sample_images = {
        "waterlogging": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
        "leak": "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80",
        "heatwave": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        "water_shortage": "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=600&q=80"
    }
    image_url = sample_images.get(category, sample_images["waterlogging"])

    report_record = {
        "id": report_id,
        "category": category,
        "ward_id": ward_id,
        "address": address or "Sector Main Road",
        "reporter_name": reporter_name,
        "created_at": "Just now",
        "status": "AI_VERIFIED",
        "image_url": image_url,
        "user_description": user_description,
        "ai_analysis": vision_result
    }

    db.add_citizen_report(report_record)

    # Emit AWS EventBridge event
    aws_bridge.emit_event(
        source="aws.jalrakshak.citizen",
        detail_type="CitizenReportSubmitted",
        detail={"report_id": report_id, "category": category, "ward_id": ward_id, "severity": vision_result["severity_score"]}
    )

    db.log_audit("CITIZEN_PWA", "REPORT_INGESTED", f"Ingested report {report_id} from {ward_id} (AI Score: {vision_result['severity_score']})")

    return {
        "success": True,
        "report_id": report_id,
        "ai_analysis": vision_result,
        "message": "Report analyzed by Computer Vision and synchronized to Emergency Command Center."
    }

@app.post("/api/copilot/chat")
def chat_copilot(req: CopilotQuery):
    """
    Municipal Emergency Copilot providing RAG-grounded, actionable disaster responses.
    """
    return copilot.answer_query(req.query)

@app.get("/api/aws/metrics")
def get_aws_metrics():
    return aws_bridge.get_cloud_metrics()

@app.get("/api/rag/protocols")
def get_protocols():
    return rag_engine.get_all_protocols()

@app.get("/api/wards")
def get_wards():
    return db.wards

@app.post("/api/reset")
def reset_system():
    db.reset_to_defaults()
    return {"success": True, "message": "JalRakshak AI baseline restored."}

# Mount static frontend build if available
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist_path):
    assets_path = os.path.join(frontend_dist_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Don't intercept API routes
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(frontend_dist_path, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(frontend_dist_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"error": "Frontend build index.html not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8004)

