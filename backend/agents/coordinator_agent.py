"""
Agent 5: Coordinator Agent (AI Emergency Commander)
Orchestrates the entire multi-agent pipeline, queries the SOP RAG engine,
prioritizes actionable interventions, and formats the Human-in-the-Loop approval contract.
"""
from typing import Dict, Any, List
import uuid
from ..rag.rag_engine import rag_engine

class CoordinatorAgent:
    def __init__(self):
        self.name = "Coordinator Agent"
        self.role = "AI Emergency Commander & Decision Orchestrator"

    def synthesize(
        self,
        ward_info: Dict[str, Any],
        category: str,
        telemetry: Dict[str, Any],
        risk_output: Dict[str, Any],
        impact_output: Dict[str, Any],
        resource_output: List[Dict[str, Any]],
        comm_output: Dict[str, str]
    ) -> Dict[str, Any]:
        severity = risk_output.get("severity", "HIGH")
        ward_name = ward_info.get("name", "Target Sector")
        drain_outfall = ward_info.get("drainage_outfall", "Primary Outfall")

        # 1. RAG SOP Retrieval
        matched_sop = rag_engine.retrieve_protocol(category, telemetry)

        # 2. Build tactical action plan tailored to scenario & available resources
        recommended_actions = []

        if category == "flood":
            matched_pump = resource_output[0] if resource_output else None
            pump_name = matched_pump["resource_name"] if matched_pump else "Dewatering Pump P-04"
            pump_id = matched_pump["resource_id"] if matched_pump else "RES-PUMP-01"
            eta = matched_pump.get("estimated_eta_minutes", 15) if matched_pump else 15

            recommended_actions.append({
                "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                "priority": 1,
                "action": f"Deploy {pump_name} to {drain_outfall}",
                "resource_id": pump_id,
                "authority": "Stormwater Drainage Dept",
                "eta_minutes": eta,
                "status": "PENDING"
            })

            roads = impact_output.get("critical_roads", [])
            road_name = roads[0] if roads else "LBS Marg Arterial Road"
            recommended_actions.append({
                "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                "priority": 2,
                "action": f"Divert traffic from {road_name} to elevated bypass corridor",
                "resource_id": "TRAFFIC-POLICE",
                "authority": "Traffic Control Cell",
                "eta_minutes": 10,
                "status": "PENDING"
            })

            hospitals = impact_output.get("hospitals_names", [])
            if hospitals:
                recommended_actions.append({
                    "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                    "priority": 3,
                    "action": f"Alert {hospitals[0]}: Deploy sandbags to basement generator units & oxygen plant",
                    "resource_id": "HOSP-LIAISON",
                    "authority": "Disaster Health Cell",
                    "eta_minutes": 5,
                    "status": "PENDING"
                })

            schools = impact_output.get("schools_names", [])
            if schools:
                recommended_actions.append({
                    "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                    "priority": 4,
                    "action": f"Issue preemptive dismissal order to {len(schools)} institutions ({', '.join(schools[:2])})",
                    "resource_id": "EDU-DIRECTORATE",
                    "authority": "Municipal Education Dept",
                    "eta_minutes": 10,
                    "status": "PENDING"
                })

            recommended_actions.append({
                "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                "priority": 5,
                "action": f"Broadcast localized SMS & Public Address warnings (1077 Helpline)",
                "resource_id": "SNS-BROADCAST",
                "authority": "Citizen Advisory Cell",
                "eta_minutes": 2,
                "status": "PENDING"
            })

        elif category == "heatwave":
            shelters = impact_output.get("shelters_available", ["Dadar Sports Complex Shelter"])
            # Strip " (Cap: XXXX)" suffix appended by impact_agent so action text stays clean
            raw_shelter = shelters[0] if shelters else "Municipal Community Center"
            shelter_name = raw_shelter.split(" (Cap:")[0]

            recommended_actions.append({
                "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                "priority": 1,
                "action": f"Activate AC Public Cooling Shelter at {shelter_name} with cold hydration & ORS packs",
                "resource_id": "SHL-COOLING",
                "authority": "Municipal Amenities & Health",
                "eta_minutes": 15,
                "status": "PENDING"
            })

            med_van = resource_output[0] if resource_output else None
            van_name = med_van["resource_name"] if med_van else "Heatstroke Care Van MED-07"
            van_id = med_van["resource_id"] if med_van else "RES-MED-01"

            recommended_actions.append({
                "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                "priority": 2,
                "action": f"Position {van_name} at primary public transit hub",
                "resource_id": van_id,
                "authority": "Emergency Medical Services",
                "eta_minutes": 14,
                "status": "PENDING"
            })

            recommended_actions.append({
                "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                "priority": 3,
                "action": "Enforce mandatory work cessation for outdoor labor & construction sites (11:30 AM - 4:00 PM)",
                "resource_id": "LABOR-SQUAD",
                "authority": "Municipal Works Enforcement",
                "eta_minutes": 20,
                "status": "PENDING"
            })

            recommended_actions.append({
                "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                "priority": 4,
                "action": "Dispatch multilingual heat index alert to elderly & chronic illness registry",
                "resource_id": "SNS-BROADCAST",
                "authority": "Public Health Division",
                "eta_minutes": 3,
                "status": "PENDING"
            })

        elif category == "leak":
            leak_gang = resource_output[0] if resource_output else None
            gang_name = leak_gang["resource_name"] if leak_gang else "Acoustic Leak Gang R-02"
            gang_id = leak_gang["resource_id"] if leak_gang else "RES-LEAK-01"

            recommended_actions.append({
                "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                "priority": 1,
                "action": "Remotely throttle SCADA isolating valves V-08A and V-08B to arrest pressure drop",
                "resource_id": "SCADA-SYS",
                "authority": "Hydraulic Automation Center",
                "eta_minutes": 5,
                "status": "PENDING"
            })

            recommended_actions.append({
                "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                "priority": 2,
                "action": f"Dispatch {gang_name} with excavation and trench shoring equipment",
                "resource_id": gang_id,
                "authority": "Pipeline Maintenance Squad",
                "eta_minutes": 20,
                "status": "PENDING"
            })

            recommended_actions.append({
                "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                "priority": 3,
                "action": "Issue precautionary boil-water notice to downstream residential blocks",
                "resource_id": "SNS-BROADCAST",
                "authority": "Public Health Quality Lab",
                "eta_minutes": 5,
                "status": "PENDING"
            })

        else: # water_shortage
            tanker = resource_output[0] if resource_output else None
            tanker_name = tanker["resource_name"] if tanker else "Water Bowser T-101"
            tanker_id = tanker["resource_id"] if tanker else "RES-TANKER-01"

            recommended_actions.append({
                "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                "priority": 1,
                "action": f"Route GPS-tracked {tanker_name} to high-density informal settlement clusters",
                "resource_id": tanker_id,
                "authority": "Municipal Water Bowsers Division",
                "eta_minutes": 15,
                "status": "PENDING"
            })

            recommended_actions.append({
                "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                "priority": 2,
                "action": "Institute dedicated bypass supply to healthcare clinics and dialysis centers",
                "resource_id": "VALVE-CTRL",
                "authority": "Hydraulic Distribution Div",
                "eta_minutes": 25,
                "status": "PENDING"
            })

            recommended_actions.append({
                "id": f"ACT-{uuid.uuid4().hex[:6].upper()}",
                "priority": 3,
                "action": "Broadcast schedule & live GPS tracking link to resident associations",
                "resource_id": "SNS-BROADCAST",
                "authority": "Citizen Advisory Cell",
                "eta_minutes": 3,
                "status": "PENDING"
            })

        # Synthesize Human-in-the-Loop decision contract
        return {
            "recommended_actions": recommended_actions,
            "rag_reference": {
                "sop_id": matched_sop["id"],
                "statutory_reference": matched_sop["statutory_reference"],
                "rationale": f"Protocol {matched_sop['id']} triggered based on {category.upper()} metrics breaching standard threshold."
            }
        }

coordinator_agent = CoordinatorAgent()
