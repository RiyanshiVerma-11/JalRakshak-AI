"""
Agent 2: Impact Assessment Agent
Performs GIS spatial intersection with municipal registry to identify
vulnerable populations, schools, hospitals, critical arterial corridors, and shelters.
"""
from typing import Dict, Any, List

class ImpactAssessmentAgent:
    def __init__(self):
        self.name = "Impact Assessment Agent"
        self.role = "Critical Infrastructure & Demographic Impact Evaluator"

    def assess(self, ward_info: Dict[str, Any], risk_evaluation: Dict[str, Any], category: str) -> Dict[str, Any]:
        severity = risk_evaluation.get("severity", "MODERATE")
        total_pop = ward_info.get("population", 50000)

        # Scale exposed population based on severity and area
        if severity == "CRITICAL":
            exposed_pop = int(total_pop * 0.10) # 10% direct hazard contour
        elif severity == "HIGH":
            exposed_pop = int(total_pop * 0.06)
        elif severity == "MODERATE":
            exposed_pop = int(total_pop * 0.03)
        else:
            exposed_pop = int(total_pop * 0.01)

        # Hospitals
        hospitals = ward_info.get("hospitals", [])
        hospitals_names = [f"{h['name']} ({h.get('beds', 0)} beds)" for h in hospitals]

        # Schools
        schools = ward_info.get("schools", [])
        schools_names = [s["name"] for s in schools]

        # Critical Roads
        roads = ward_info.get("critical_roads", [])
        critical_roads = [r["name"] for r in roads]

        # Shelters available
        shelters = ward_info.get("shelters", [])
        shelters_available = [f"{s['name']} (Cap: {s.get('capacity', 500)})" for s in shelters if s.get("is_active", True)]

        return {
            "exposed_population": exposed_pop,
            "hospitals_count": len(hospitals),
            "hospitals_names": hospitals_names,
            "schools_count": len(schools),
            "schools_names": schools_names,
            "critical_roads_count": len(critical_roads),
            "critical_roads": critical_roads,
            "shelters_available": shelters_available,
            "drainage_outfall": ward_info.get("drainage_outfall", "Main Storm Drain Outfall")
        }

impact_agent = ImpactAssessmentAgent()
