"""
Municipal Emergency Response Standard Operating Procedures (SOP) Knowledge Base
Sources: National Disaster Management Authority (NDMA) Guidelines,
         Urban Flooding Management Manual,
         National Heat Action Plan (NHAP),
         Jal Jeevan Mission Urban Water Resilience Protocols.
"""

EMERGENCY_PROTOCOLS = [
    {
        "id": "SOP-FLD-101",
        "category": "flood",
        "title": "NDMA Urban Flood Response - Inundation Exceeding 30cm",
        "trigger_conditions": {
            "rainfall_rate_mm_hr": 70.0,
            "flood_depth_cm": 30.0,
            "drainage_saturation_pct": 85.0
        },
        "mandatory_actions": [
            {
                "priority": 1,
                "action": "Deploy high-discharge dewatering pumps (min 500 GPM) to primary stormwater outfalls",
                "authority": "Municipal Stormwater Drainage Dept",
                "timeframe_minutes": 20
            },
            {
                "priority": 2,
                "action": "Coordinate with Traffic Police for vehicular diversion from arterial roads exhibiting depth > 25cm",
                "authority": "Traffic Police & Disaster Cell",
                "timeframe_minutes": 15
            },
            {
                "priority": 3,
                "action": "Issue preemptive alert to educational institutions and healthcare facilities within 1.5km radius",
                "authority": "District Disaster Management Authority (DDMA)",
                "timeframe_minutes": 10
            },
            {
                "priority": 4,
                "action": "Broadcast multilingual SMS/PA warnings with alternate route instructions and emergency helpline (1077)",
                "authority": "Public Relations & Citizen Advisory Desk",
                "timeframe_minutes": 10
            }
        ],
        "statutory_reference": "NDMA Guidelines on Management of Urban Flooding (2024), Chapter 4, Sec 4.3"
    },
    {
        "id": "SOP-FLD-102",
        "category": "flood",
        "title": "NDMA Flash Flood & Severe Cloudburst Protocol (>100mm/hr)",
        "trigger_conditions": {
            "rainfall_rate_mm_hr": 100.0,
            "drainage_saturation_pct": 100.0
        },
        "mandatory_actions": [
            {
                "priority": 1,
                "action": "Activate Emergency Operations Center (EOC) Level-3 Red Protocol",
                "authority": "Municipal Commissioner / District Collector",
                "timeframe_minutes": 5
            },
            {
                "priority": 2,
                "action": "Deploy specialized NDRF / Civil Defense rescue units with inflatable boats to low-lying settlement clusters",
                "authority": "State Disaster Response Force",
                "timeframe_minutes": 25
            },
            {
                "priority": 3,
                "action": "Cut electricity feeder lines to submerged transformers to prevent electrocution hazards",
                "authority": "State Electricity Distribution Corp",
                "timeframe_minutes": 15
            },
            {
                "priority": 4,
                "action": "Open secondary elevated municipal school shelters with dry ration and potable water supplies",
                "authority": "Social Welfare & Revenue Dept",
                "timeframe_minutes": 30
            }
        ],
        "statutory_reference": "National Disaster Management Framework, Cloudburst Standard Operating Procedure, Art. 12"
    },
    {
        "id": "SOP-HEAT-04",
        "category": "heatwave",
        "title": "Severe Heatwave & High Wet-Bulb Emergency Response Protocol",
        "trigger_conditions": {
            "temperature_celsius": 42.0,
            "heat_index_celsius": 46.0
        },
        "mandatory_actions": [
            {
                "priority": 1,
                "action": "Designate and open climate-controlled public cooling shelters (community centers, AC transit hubs) with ORS and drinking water",
                "authority": "Health & Municipal Amenities Dept",
                "timeframe_minutes": 30
            },
            {
                "priority": 2,
                "action": "Halt outdoor physical construction and manual sanitation work between 11:30 AM and 4:30 PM",
                "authority": "Labor Enforcement & Municipal Works",
                "timeframe_minutes": 20
            },
            {
                "priority": 3,
                "action": "Deploy Mobile Water Misting Fans and Water Bowsers at major transit interchanges and high-density markets",
                "authority": "Fire & Emergency Services",
                "timeframe_minutes": 45
            },
            {
                "priority": 4,
                "action": "Dispatch heatstroke triage kits and IV fluid reserves to Primary Health Centers in affected wards",
                "authority": "Chief Medical Officer",
                "timeframe_minutes": 30
            }
        ],
        "statutory_reference": "National Heat Action Plan (NHAP) 2024 Guidelines, Tier-2 Severe Heatwave Standard"
    },
    {
        "id": "SOP-WTR-301",
        "category": "water_shortage",
        "title": "Critical Reservoir Depletion & Urban Water Rationing Protocol",
        "trigger_conditions": {
            "reservoir_capacity_pct": 20.0,
            "per_capita_deficit_lpcd": 40.0
        },
        "mandatory_actions": [
            {
                "priority": 1,
                "action": "Initiate automated water supply scheduling: prioritize domestic morning supply window (06:00 - 08:30)",
                "authority": "Hydraulic Engineering Department",
                "timeframe_minutes": 60
            },
            {
                "priority": 2,
                "action": "Dispatch GPS-tracked municipal water bowsers to unpiped informal settlements and dialysis clinics",
                "authority": "Water Supply & Fleet Management",
                "timeframe_minutes": 40
            },
            {
                "priority": 3,
                "action": "Enforce non-essential water bans (vehicle washing, ornamental fountains, turf irrigation)",
                "authority": "Municipal Vigilance Squad",
                "timeframe_minutes": 120
            }
        ],
        "statutory_reference": "Jal Jeevan Mission Urban Water Security Framework, Resilience SOP Sec 7"
    },
    {
        "id": "SOP-LEAK-401",
        "category": "leak",
        "title": "High-Pressure Mainline Rupture & Contamination Containment",
        "trigger_conditions": {
            "pressure_drop_bar": 1.5,
            "estimated_loss_kld": 250.0
        },
        "mandatory_actions": [
            {
                "priority": 1,
                "action": "Remotely throttle SCADA isolating valves upstream (Valve V-14A and V-14B) to halt pressure bleed",
                "authority": "SCADA Automation Control Center",
                "timeframe_minutes": 10
            },
            {
                "priority": 2,
                "action": "Dispatch emergency pipeline repair gang equipped with acoustic leak correlator and trench shoring",
                "authority": "Water Distribution Maintenance Div",
                "timeframe_minutes": 25
            },
            {
                "priority": 3,
                "action": "Issue precautionary boil-water advisory to downstream residential blocks to prevent cross-contamination",
                "authority": "Public Health & Quality Testing Lab",
                "timeframe_minutes": 15
            }
        ],
        "statutory_reference": "Central Public Health & Environmental Engineering Organisation (CPHEEO) Manual, Sec 9.4"
    }
]
