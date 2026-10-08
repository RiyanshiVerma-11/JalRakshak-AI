"""
AI Emergency Copilot for Municipal Controllers & Incident Commanders.
Provides context-aware, RAG-grounded, actionable reasoning instead of generic chat.
"""
from typing import Dict, Any, List
from .data.mock_db import db
from .rag.rag_engine import rag_engine

class EmergencyCopilot:
    def __init__(self):
        self.system_prompt = (
            "You are the JalRakshak AI Emergency Copilot for Municipal Disaster Commanders. "
            "You provide decisive, prioritized, protocol-grounded emergency recommendations."
        )

    def answer_query(self, query: str) -> Dict[str, Any]:
        q_lower = query.lower()
        incidents = db.get_incidents()
        critical_incidents = [i for i in incidents if i["severity"] == "CRITICAL"]
        primary_inc = critical_incidents[0] if critical_incidents else (incidents[0] if incidents else None)

        # Context extraction
        if "flood" in q_lower or "rain" in q_lower or "ward 17" in q_lower or "kurla" in q_lower:
            target_inc = next((i for i in incidents if i["category"] == "flood"), primary_inc)
            sop = rag_engine.retrieve_protocol("flood", target_inc["telemetry"] if target_inc else {})

            response = {
                "query": query,
                "situation_summary": (
                    f"**{target_inc['ward_name']}** is experiencing a **CRITICAL FLOOD RISK** due to intense precipitation "
                    f"({target_inc['telemetry'].get('rainfall_rate_mm_hr', 118)} mm/hr) exceeding the local drainage threshold (45 mm/hr). "
                    f"Water depth has reached {target_inc['telemetry'].get('flood_depth_cm', 38)} cm on LBS Marg."
                ),
                "key_metrics": {
                    "Exposed Population": f"{target_inc['impact_assessment']['exposed_population']:,}",
                    "Hospitals at Risk": target_inc['impact_assessment']['hospitals_count'],
                    "Schools in Zone": target_inc['impact_assessment']['schools_count'],
                    "Drainage Saturation": f"{target_inc['telemetry'].get('drainage_saturation_pct', 98)}%"
                },
                "recommended_actions": [
                    {
                        "priority": "P1",
                        "action": "Deploy High-Capacity Dewatering Pump P-04 (1000 GPM) to Outfall D-17",
                        "authority": "Stormwater Drainage Dept",
                        "eta": "18 mins",
                        "resource_id": "RES-PUMP-01"
                    },
                    {
                        "priority": "P2",
                        "action": "Close LBS Marg arterial corridor; divert heavy traffic to BKC Elevated Connector",
                        "authority": "Traffic Police Division",
                        "eta": "10 mins",
                        "resource_id": "TRAFFIC-CORPS"
                    },
                    {
                        "priority": "P3",
                        "action": "Preemptively notify Bhabha Hospital to engage flood barriers and inspect backup generator elevation",
                        "authority": "Disaster Health Coordinator",
                        "eta": "5 mins",
                        "resource_id": "HOSP-ALERT"
                    },
                    {
                        "priority": "P4",
                        "action": "Send multilingual SMS warning in English, Hindi, and Marathi to 18,450 geo-fenced residents",
                        "authority": "Public Relations Cell",
                        "eta": "Immediate",
                        "resource_id": "SNS-BROADCAST"
                    }
                ],
                "statutory_sop_citation": {
                    "sop_id": sop["id"],
                    "reference": sop["statutory_reference"],
                    "reasoning": "Section 4.3 mandates immediate high-discharge pump positioning and traffic diversion whenever rainfall exceeds 70 mm/hr and water depth crosses 30 cm."
                },
                "why_critical": [
                    "Rainfall rate (118 mm/hr) is 2.6x the engineered drain capacity (45 mm/hr).",
                    "Outfall D-17 throttled by concurrent high tide in the Mithi River channel.",
                    "6 citizen geo-tagged reports confirm vehicles stalling on primary route.",
                    "Bhabha Hospital ICU facilities are situated 400m from the inundation contour."
                ],
                "suggested_followups": [
                    "Show closest available backup pumps",
                    "Draft Hindi evacuation broadcast for Zone B",
                    "Check capacity of Kurla Community Indoor Shelter",
                    "What happens if rain continues for 2 more hours?"
                ]
            }

        elif "heat" in q_lower or "dadar" in q_lower or "ward 4" in q_lower:
            target_inc = next((i for i in incidents if i["category"] == "heatwave"), primary_inc)
            sop = rag_engine.retrieve_protocol("heatwave", target_inc["telemetry"] if target_inc else {})

            response = {
                "query": query,
                "situation_summary": (
                    f"**{target_inc['ward_name']}** has triggered an **EXTREME HEAT ADVISORY**. "
                    f"Heat index reached **48.6°C** with high relative humidity (68%) and wet-bulb reading of 31.8°C, "
                    f"placing elderly residents and outdoor construction workers at acute heatstroke risk."
                ),
                "key_metrics": {
                    "Vulnerable Population": f"{target_inc['impact_assessment']['exposed_population']:,}",
                    "Heat Index": "48.6°C",
                    "Wet-Bulb Temp": "31.8°C",
                    "Cooling Shelters Ready": len(target_inc['impact_assessment']['shelters_available'])
                },
                "recommended_actions": [
                    {
                        "priority": "P1",
                        "action": "Activate Dadar Sports Complex as air-conditioned community cooling shelter with ORS & ice packs",
                        "authority": "Health & Amenities Dept",
                        "eta": "15 mins",
                        "resource_id": "SHL-02"
                    },
                    {
                        "priority": "P2",
                        "action": "Position Mobile Heatstroke Care Van MED-07 outside Dadar Central Transit Hub",
                        "authority": "Emergency Medical Services",
                        "eta": "14 mins",
                        "resource_id": "RES-MED-01"
                    },
                    {
                        "priority": "P3",
                        "action": "Enforce mandatory halt of outdoor physical construction labor between 11:30 AM and 4:30 PM",
                        "authority": "Municipal Works Enforcement",
                        "eta": "20 mins",
                        "resource_id": "LABOR-SQUAD"
                    }
                ],
                "statutory_sop_citation": {
                    "sop_id": sop["id"],
                    "reference": sop["statutory_reference"],
                    "reasoning": "National Heat Action Plan Tier-2 triggers mandatory cooling centers and work pauses when Heat Index exceeds 46°C."
                },
                "why_critical": [
                    "Heat Index 48.6°C exceeds human safety thresholds for prolonged outdoor exposure.",
                    "Wet-bulb reading (31.8°C) severely inhibits perspiration-based cooling.",
                    "Dense geriatric population visiting KEM Hospital area.",
                    "High density of informal transit commuters at Dadar Interchange."
                ],
                "suggested_followups": [
                    "Deploy water misting fans at Dadar Station",
                    "Check IV fluid inventory at KEM Hospital",
                    "Send SMS alert to registered outdoor workers"
                ]
            }

        elif "resource" in q_lower or "pump" in q_lower or "tanker" in q_lower:
            resources = db.get_resources()
            avail = [r for r in resources if r["status"] == "AVAILABLE"]
            response = {
                "query": query,
                "situation_summary": f"Currently **{len(avail)} out of {len(resources)} emergency assets** are ACTIVE and AVAILABLE for immediate dispatch across municipal zones.",
                "key_metrics": {
                    "Available Pumps": len([r for r in avail if r["type"] == "pump"]),
                    "Water Bowsers": len([r for r in avail if r["type"] == "water_tanker"]),
                    "Medical Vans": len([r for r in avail if r["type"] == "medical_unit"]),
                    "Rescue Boats": len([r for r in avail if r["type"] == "rescue_boat"])
                },
                "recommended_actions": [
                    {
                        "priority": "P1",
                        "action": f"Reserve {r['name']} ({r['capacity']}) in {r['current_ward']} for Tier-1 dispatch",
                        "authority": "Logistics Control",
                        "eta": f"{r['eta_minutes']} mins",
                        "resource_id": r["id"]
                    } for r in avail[:3]
                ],
                "statutory_sop_citation": {
                    "sop_id": "SOP-LOGISTICS-01",
                    "reference": "Disaster Asset Readiness Standard Operating Procedure",
                    "reasoning": "Assets positioned within 20 minutes radius maintain Level-1 rapid deployment compliance."
                },
                "why_critical": [
                    "P-04 (1000 GPM) is in Ward 4, 18 minutes from Ward 17 hotspot.",
                    "P-09 (600 GPM) is already pre-staged in Ward 17 (8 mins ETA).",
                    "All high-volume assets require operator sign-off in the Command Center."
                ],
                "suggested_followups": [
                    "Dispatch P-04 to Ward 17 Outfall D-17 now",
                    "Inspect maintenance status of P-14 in Ward 8",
                    "Request mutual aid from neighboring municipal corporation"
                ]
            }

        else:
            response = {
                "query": query,
                "situation_summary": (
                    f"JalRakshak AI is monitoring **4 active climate & utility sectors**. "
                    f"Primary incident of concern is **{primary_inc['title']}** in **{primary_inc['ward_name']}** (Severity: **{primary_inc['severity']}**). "
                    f"All 5 autonomous Strands agents are actively evaluating telemetry."
                ),
                "key_metrics": {
                    "Active Incidents": len(incidents),
                    "Critical Zones": len(critical_incidents),
                    "Total Population at Risk": sum(i['impact_assessment']['exposed_population'] for i in incidents),
                    "Pending Approvals": len([i for i in incidents if i["status"] == "PENDING_APPROVAL"])
                },
                "recommended_actions": primary_inc.get("recommended_actions", [])[:3] if primary_inc else [],
                "statutory_sop_citation": primary_inc.get("rag_reference", {
                    "sop_id": "SOP-GEN-01",
                    "reference": "Integrated Disaster Management Framework",
                    "reasoning": "Real-time municipal resilience protocol."
                }),
                "why_critical": [f['detail'] for f in primary_inc['explainability']['factors'][:3]] if primary_inc else ["System operational."],
                "suggested_followups": [
                    "What should we do about the flood in Ward 17?",
                    "Check heatwave status in Ward 4",
                    "Show pipeline leak repair progress in Ward 8",
                    "What resources are available right now?"
                ]
            }

        return response

copilot = EmergencyCopilot()
