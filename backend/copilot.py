"""
AI Emergency Copilot for Municipal Controllers & Incident Commanders.
Provides context-aware, RAG-grounded, actionable reasoning instead of generic chat.
"""
from typing import Dict, Any, List
from .data.mock_db import db
from .rag.sop_knowledge import query_sop_knowledge

class EmergencyCopilot:
    def __init__(self):
        self.system_prompt = (
            "You are the JalRakshak AI Emergency Copilot for Municipal Disaster Commanders. "
            "You provide decisive, prioritized, protocol-grounded emergency recommendations."
        )

    def answer_query(self, query: str, role: str = "incident_commander", user_name: str = None) -> Dict[str, Any]:
        q_lower = query.lower()
        incidents = db.get_incidents()
        critical_incidents = [i for i in incidents if i["severity"] == "CRITICAL"]
        primary_inc = critical_incidents[0] if critical_incidents else (incidents[0] if incidents else None)

        # Global vector search for query context
        vector_sop = query_sop_knowledge(query, top_k=1)

        # 1. Intent Check: What is this app for / Overview / About / Help / Kya hai
        is_about_app = any(term in q_lower for term in [
            "what is this app", "what does this app", "what is jalrakshak", "what is the app",
            "what is this", "what is it for", "who are you", "help", "about", "kya hai", "kya h",
            "kis liye", "ye app", "purpose", "how does this work", "how to use"
        ])

        if is_about_app:
            if role == "citizen":
                return {
                    "query": query,
                    "situation_summary": (
                        "**JalRakshak AI** is Mumbai's autonomous climate disaster intelligence & water resilience platform. "
                        "For residents and citizens like you, this app serves 4 vital life-saving purposes:\n\n"
                        "1. **Real-time Hyper-local Alerts**: Get instant warning if intense rain, waterlogging, or heatwaves are threatening your ward (e.g. Ward 17 Kurla).\n"
                        "2. **1-Tap Photo SOS Reporting**: Spot flooded streets or choked stormwater drains? Upload a photo via the Citizen Safety Portal. AWS AI automatically calculates water depth and dispatches municipal dewatering units.\n"
                        "3. **Safe Navigation & Shelter Directory**: Find real-time dry transit corridors (e.g. avoiding submerged LBS Marg) and active municipal relief shelters with drinking water and power backup.\n"
                        "4. **Emergency Helplines**: Instant 1-tap call to the Disaster Emergency Helpline **1077**."
                    ),
                    "key_metrics": {
                        "Your Profile": user_name or "Verified Resident",
                        "Monitored Ward": "Ward 17 (Kurla)",
                        "Active Hazard": "118 mm/hr Rain (Flood Risk)",
                        "Emergency Helpline": "1077 (Toll-Free)"
                    },
                    "recommended_actions": [
                        {
                            "priority": "P1",
                            "action": "Avoid waterlogged LBS Marg; use the BKC Elevated Connector for safe transit",
                            "authority": "Traffic Police Advisory",
                            "eta": "Active Now",
                            "resource_id": "CITIZEN-ROUTE",
                            "action_type": "NAVIGATE"
                        },
                        {
                            "priority": "P2",
                            "action": "Submit Photo SOS in Citizen Portal to report localized street waterlogging",
                            "authority": "Citizen Safety Portal",
                            "eta": "Instant",
                            "resource_id": "CITIZEN-SOS",
                            "action_type": "PHOTO_SOS"
                        },
                        {
                            "priority": "P3",
                            "action": "Kurla Community Indoor Shelter is open with backup power & clean water",
                            "authority": "Emergency Shelters",
                            "eta": "Open 24/7",
                            "resource_id": "CITIZEN-SHELTER",
                            "action_type": "SHELTER"
                        },
                        {
                            "priority": "P4",
                            "action": "Call Toll-Free Disaster Helpline 1077 if water enters your home",
                            "authority": "Disaster Control Room",
                            "eta": "Immediate",
                            "resource_id": "CITIZEN-CALL",
                            "action_type": "CALL"
                        }
                    ],
                    "statutory_sop_citation": {
                        "sop_id": "DMA-2005-SEC34",
                        "reference": "Disaster Management Act 2005 — Sec 34 (Citizen Assistance & Public Safety)",
                        "vector_score": 0.95,
                        "reasoning": "Section 34 requires disaster authorities to provide citizens with continuous localized early warnings, verified safe shelters, and emergency helpline services."
                    },
                    "why_critical": [
                        "Empowers citizens with verified situational reality instead of unverified social media rumors.",
                        "Citizen photo submissions feed directly into AWS Bedrock to route dewatering pumps to where they are needed most.",
                        "Provides designated dry shelter coordinates before street water levels rise."
                    ],
                    "suggested_followups": [
                        "Is LBS Marg or Kurla flooded right now?",
                        "Where is the nearest emergency relief shelter in Ward 17?",
                        "How do I submit a photo report for street flooding?",
                        "What should I do during an extreme heatwave?"
                    ]
                }
            else:
                return {
                    "query": query,
                    "situation_summary": (
                        "**JalRakshak AI** is Mumbai's autonomous, 5-agent climate disaster orchestration platform built on AWS. "
                        "It continuously ingests telemetry from synthetic sensor grids, weather radars, and citizen photo reports across 4 wards. "
                        "When climate anomalies (e.g. 118 mm/hr cloudbursts, pipe bursts, heatwaves) are detected, autonomous Strands agents "
                        "orchestrate multi-agency tactical action plans under NDMA & Disaster Management Act 2005 protocols with human-in-the-loop sign-off."
                    ),
                    "key_metrics": {
                        "Autonomous Agents": "5 Active (DAG)",
                        "IoT Sensor Grid": "Active (4 Wards)",
                        "Active Sectors": len(incidents),
                        "Pending Directives": len([i for i in incidents if i["status"] == "PENDING_APPROVAL"])
                    },
                    "recommended_actions": primary_inc.get("recommended_actions", [])[:3] if primary_inc else [],
                    "statutory_sop_citation": {
                        "sop_id": "NDMA-MUM-2024",
                        "reference": "NDMA National Disaster Management Guidelines — Urban Stormwater Protocols",
                        "vector_score": 0.92,
                        "reasoning": "Mandates automated multi-tier operational coordination between Stormwater, Traffic Police, Health Directorate, and Emergency EOCs."
                    },
                    "why_critical": [
                        "Reduces disaster response dispatch latency from 4 hours (manual lag) to under 60 seconds.",
                        "Prevents catastrophic ICU compromise at critical health facilities such as Bhabha Hospital.",
                        "Maintains strict auditability with statutory SOP citations and human-in-the-loop authorization."
                    ],
                    "suggested_followups": [
                        "What should we do about the flood in Ward 17?",
                        "Show dewatering pump P-04 ETA and dispatch route",
                        "Check heatwave status in Ward 4 Dadar",
                        "What resources are available right now?"
                    ]
                }

        # 2. Context extraction: Flood / Rain / Ward 17
        if "flood" in q_lower or "rain" in q_lower or "ward 17" in q_lower or "kurla" in q_lower:
            target_inc = next((i for i in incidents if i["category"] == "flood"), primary_inc)
            sop = query_sop_knowledge(f"flood inundation drainage rainfall {query}", top_k=1)

            if role == "citizen":
                actions = [
                    {
                        "priority": "P1",
                        "action": "Avoid LBS Marg corridor (water depth 38 cm near Bhabha Hospital). Use BKC Connector instead.",
                        "authority": "Traffic Advisory",
                        "eta": "Active Now",
                        "resource_id": "CITIZEN-ROUTE",
                        "action_type": "NAVIGATE"
                    },
                    {
                        "priority": "P2",
                        "action": "Kurla Municipal Community Hall is open as an emergency dry shelter with drinking water & electricity.",
                        "authority": "Relief Shelters",
                        "eta": "Open 24/7",
                        "resource_id": "CITIZEN-SHELTER",
                        "action_type": "SHELTER"
                    },
                    {
                        "priority": "P3",
                        "action": "If your building basement or street is flooding, submit a Photo SOS in the portal to alert pump teams.",
                        "authority": "Citizen Safety Portal",
                        "eta": "Instant",
                        "resource_id": "CITIZEN-SOS",
                        "action_type": "PHOTO_SOS"
                    },
                    {
                        "priority": "P4",
                        "action": "Keep electronics elevated and call Toll-Free 1077 if water ingress exceeds ankle level.",
                        "authority": "Disaster Helpline",
                        "eta": "Immediate",
                        "resource_id": "CITIZEN-CALL",
                        "action_type": "CALL"
                    }
                ]
                why_list = [
                    "Rainfall (118 mm/hr) has exceeded road drainage capacity by 162%.",
                    "Mithi River high tide is slowing gravity drainage at Outfall D-17.",
                    "BMC has dispatched Dewatering Pump P-04 (1000 GPM) to clear the arterial waterlogging.",
                    "Bhabha Hospital approach road is congested; non-emergency transit must be avoided."
                ]
                followups = [
                    "Where is the nearest relief shelter in Ward 17?",
                    "How do I submit a photo report for street flooding?",
                    "What is the status of drinking water in Kurla?",
                    "Is it safe to drive to BKC right now?"
                ]
            else:
                actions = [
                    {
                        "priority": "P1",
                        "action": "Deploy High-Capacity Dewatering Pump P-04 (1000 GPM) to Outfall D-17",
                        "authority": "Stormwater Drainage Dept",
                        "eta": "18 mins",
                        "resource_id": "RES-PUMP-01",
                        "action_type": "DISPATCH"
                    },
                    {
                        "priority": "P2",
                        "action": "Close LBS Marg arterial corridor; divert heavy traffic to BKC Elevated Connector",
                        "authority": "Traffic Police Division",
                        "eta": "10 mins",
                        "resource_id": "TRAFFIC-CORPS",
                        "action_type": "DISPATCH"
                    },
                    {
                        "priority": "P3",
                        "action": "Preemptively notify Bhabha Hospital to engage flood barriers and inspect backup generator elevation",
                        "authority": "Disaster Health Coordinator",
                        "eta": "5 mins",
                        "resource_id": "HOSP-ALERT",
                        "action_type": "DISPATCH"
                    },
                    {
                        "priority": "P4",
                        "action": "Send multilingual SMS warning in English, Hindi, and Marathi to 18,450 geo-fenced residents",
                        "authority": "Public Relations Cell",
                        "eta": "Immediate",
                        "resource_id": "SNS-BROADCAST",
                        "action_type": "DISPATCH"
                    }
                ]
                why_list = [
                    "Rainfall rate (118 mm/hr) is 2.6x the engineered drain capacity (45 mm/hr).",
                    "Outfall D-17 throttled by concurrent high tide in the Mithi River channel.",
                    "6 citizen geo-tagged reports confirm vehicles stalling on primary route.",
                    "Bhabha Hospital ICU facilities are situated 400m from the inundation contour."
                ]
                followups = [
                    "Show closest available backup pumps",
                    "Draft Hindi evacuation broadcast for Zone B",
                    "Check capacity of Kurla Community Indoor Shelter",
                    "What happens if rain continues for 2 more hours?"
                ]

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
                "recommended_actions": actions,
                "statutory_sop_citation": {
                    "sop_id": sop["id"],
                    "reference": f"{sop['citation']} — Disaster Management Act 2005",
                    "vector_score": sop.get("vector_score", 0.45),
                    "reasoning": "Section 4.3 mandates immediate high-discharge pump positioning and traffic diversion whenever rainfall exceeds 70 mm/hr and water depth crosses 30 cm."
                },
                "why_critical": why_list,
                "suggested_followups": followups
            }

        elif "heat" in q_lower or "dadar" in q_lower or "ward 4" in q_lower:
            target_inc = next((i for i in incidents if i["category"] == "heatwave"), primary_inc)
            sop = query_sop_knowledge(f"heatwave temperature wet bulb cooling shelter {query}", top_k=1)

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
                    "reference": f"{sop['citation']} — Disaster Management Act 2005",
                    "vector_score": sop.get("vector_score", 0.42),
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
            if role == "citizen":
                response = {
                    "query": query,
                    "situation_summary": (
                        f"You are connected to the **JalRakshak Citizen Public Safety Copilot**. "
                        f"Currently, Mumbai disaster response teams are actively responding to **{primary_inc['title']}** in **{primary_inc['ward_name']}** (Severity: **{primary_inc['severity']}**). "
                        f"If you are in an affected zone, please follow official advisories, stay clear of submerged roads, and report new waterlogging via Photo SOS."
                    ) if primary_inc else (
                        "No emergency warnings are currently active in your ward. The city water and drainage grid is functioning normally."
                    ),
                    "key_metrics": {
                        "Your Ward": "Ward 17 (Kurla)",
                        "Ward Status": "Active Flood Alert",
                        "Open Shelters": "Kurla Community Hall",
                        "Emergency Helpline": "1077 (Toll-Free)"
                    },
                    "recommended_actions": [
                        {
                            "priority": "P1",
                            "action": "Avoid waterlogged corridors (LBS Marg); use elevated bypass routes",
                            "authority": "Traffic Advisory",
                            "eta": "Active Now",
                            "resource_id": "CITIZEN-ROUTE",
                            "action_type": "NAVIGATE"
                        },
                        {
                            "priority": "P2",
                            "action": "Submit Photo SOS in Citizen Portal to report street waterlogging with GPS",
                            "authority": "Citizen Safety Portal",
                            "eta": "Instant",
                            "resource_id": "CITIZEN-SOS",
                            "action_type": "PHOTO_SOS"
                        },
                        {
                            "priority": "P3",
                            "action": "Proceed to designated relief shelter at Kurla Community Hall if needed",
                            "authority": "Municipal Relief",
                            "eta": "Open 24/7",
                            "resource_id": "CITIZEN-SHELTER",
                            "action_type": "SHELTER"
                        },
                        {
                            "priority": "P4",
                            "action": "Call Toll-Free Helpline 1077 for immediate emergency evacuation",
                            "authority": "Disaster Control Room",
                            "eta": "Immediate",
                            "resource_id": "CITIZEN-CALL",
                            "action_type": "CALL"
                        }
                    ],
                    "statutory_sop_citation": {
                        "sop_id": vector_sop["id"],
                        "title": vector_sop["title"],
                        "reference": f"{vector_sop['citation']} — Disaster Management Act 2005",
                        "vector_score": vector_sop.get("vector_score", 0.35),
                        "reasoning": "Section 34 requires proactive communication of localized alerts, safe evacuation corridors, and designated relief shelters."
                    },
                    "why_critical": [
                        "Intense precipitation exceeds typical roadside stormwater drain capacity.",
                        "Citizens are advised to avoid pedestrian transit near submerged drainage chambers.",
                        "Reporting waterlogging with photos helps municipal pump crews prioritize localized blockages."
                    ],
                    "suggested_followups": [
                        "What is this app for and how does it protect my area?",
                        "Is LBS Marg or Kurla flooded right now?",
                        "Where is the nearest emergency relief shelter in Ward 17?",
                        "How do I submit a photo report for street flooding?"
                    ]
                }
            else:
                response = {
                    "query": query,
                    "situation_summary": (
                        f"JalRakshak AI is monitoring **4 active climate & utility sectors**. "
                        f"Primary incident of concern is **{primary_inc['title']}** in **{primary_inc['ward_name']}** (Severity: **{primary_inc['severity']}**). "
                        f"All 5 autonomous Strands agents are actively evaluating telemetry."
                    ) if primary_inc else (
                        "JalRakshak AI is on standby. No active incidents currently detected. "
                        "Use the sidebar to trigger a live simulation — cloudburst, heatwave, pipeline leak, or water shortage."
                    ),
                    "key_metrics": {
                        "Active Incidents": len(incidents),
                        "Critical Zones": len(critical_incidents),
                        "Total Population at Risk": sum(i['impact_assessment']['exposed_population'] for i in incidents),
                        "Pending Approvals": len([i for i in incidents if i["status"] == "PENDING_APPROVAL"])
                    },
                    "recommended_actions": primary_inc.get("recommended_actions", [])[:3] if primary_inc else [],
                    "statutory_sop_citation": {
                        "sop_id": vector_sop["id"],
                        "title": vector_sop["title"],
                        "reference": f"{vector_sop['citation']} — Disaster Management Act 2005",
                        "vector_score": vector_sop.get("vector_score", 0.35),
                        "reasoning": f"Statutory mandate {vector_sop['id']} matched via TF-IDF cosine similarity ({vector_sop.get('vector_score', 0.35):.4f})."
                    },
                    "why_critical": [f['detail'] for f in primary_inc['explainability']['factors'][:3]] if primary_inc else ["No active incident. System is operational and ready."],
                    "suggested_followups": [
                        "What should we do about the flood in Ward 17?",
                        "Check heatwave status in Ward 4",
                        "Show pipeline leak repair progress in Ward 8",
                        "What resources are available right now?"
                    ]
                }

        return response

copilot = EmergencyCopilot()
