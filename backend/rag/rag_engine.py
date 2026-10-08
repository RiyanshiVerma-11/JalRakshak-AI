"""
RAG Engine: Retrieves statutory municipal emergency protocols and checks conditions.
"""
from typing import List, Dict, Any
from .protocols import EMERGENCY_PROTOCOLS

class ProtocolRAGEngine:
    def __init__(self):
        self.protocols = EMERGENCY_PROTOCOLS

    def retrieve_protocol(self, category: str, telemetry: Dict[str, Any]) -> Dict[str, Any]:
        """
        Match category and evaluate trigger thresholds to return the most pertinent SOP.
        """
        category_protocols = [p for p in self.protocols if p["category"] == category]
        if not category_protocols:
            return self.protocols[0]

        # If multiple protocols for same category (e.g., standard flood vs severe cloudburst)
        best_match = category_protocols[0]
        if category == "flood":
            rainfall = telemetry.get("rainfall_rate_mm_hr", 0)
            if rainfall >= 100:
                for p in category_protocols:
                    if p["id"] == "SOP-FLD-102":
                        best_match = p
                        break
            else:
                for p in category_protocols:
                    if p["id"] == "SOP-FLD-101":
                        best_match = p
                        break

        return best_match

    def get_all_protocols(self) -> List[Dict[str, Any]]:
        return self.protocols

rag_engine = ProtocolRAGEngine()
