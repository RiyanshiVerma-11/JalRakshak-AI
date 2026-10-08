"""
Agent 3: Resource & Response Agent
Matches emergency resources (dewatering pumps, rescue boats, water bowsers, medical vans, repair crews)
to incident requirements based on availability, proximity, and capacity.
"""
from typing import Dict, Any, List

class ResourceResponseAgent:
    def __init__(self):
        self.name = "Resource & Response Agent"
        self.role = "Emergency Logistics & Tactical Asset Dispatcher"

    def match_resources(self, category: str, ward_info: Dict[str, Any], available_resources: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        target_ward = ward_info.get("ward_id")
        allocated = []

        # Filter by needed type
        type_mapping = {
            "flood": ["pump", "rescue_boat"],
            "heatwave": ["medical_unit"],
            "leak": ["leak_gang"],
            "water_shortage": ["water_tanker"]
        }

        needed_types = type_mapping.get(category, ["pump"])

        for res in available_resources:
            if res.get("status") == "AVAILABLE" and res.get("type") in needed_types:
                # Proximity score: if in same ward, lower ETA
                is_local = (res.get("current_ward") == target_ward)
                est_eta = res.get("eta_minutes", 15) if is_local else res.get("eta_minutes", 15) + 8

                allocated.append({
                    "resource_id": res["id"],
                    "resource_name": res["name"],
                    "type": res["type"],
                    "capacity": res.get("capacity"),
                    "current_ward": res.get("current_ward"),
                    "estimated_eta_minutes": est_eta,
                    "is_local_ward": is_local
                })

        # Sort by ETA
        allocated.sort(key=lambda x: x["estimated_eta_minutes"])
        return allocated[:3] # Return top 3 matched resources

resource_agent = ResourceResponseAgent()
