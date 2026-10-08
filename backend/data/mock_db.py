"""
Simulated Amazon DynamoDB Data Store & Real-Time Municipal Registry for JalRakshak AI.
Supports realistic coordinates for Mumbai wards (Kurla/BKC, Dadar, Andheri, Chembur, Colaba).
"""
import copy
import threading
from datetime import datetime
from typing import Dict, List, Any, Optional

# Municipal Infrastructure Registry by Ward
WARDS_REGISTRY = {
    "WARD-17": {
        "ward_id": "WARD-17",
        "name": "Ward 17 (Kurla - L Ward)",
        "zone": "Central East",
        "lat": 19.0688,
        "lng": 72.8796,
        "population": 84200,
        "area_sqkm": 4.2,
        "elevation_m": 4.5,
        "drainage_outfall": "Drain Outfall D-17 (Mithi River Channel)",
        "drainage_capacity_mm_hr": 45.0,
        "hospitals": [
            {"id": "HOSP-01", "name": "Bhabha Municipal General Hospital", "beds": 420, "has_icu": True, "lat": 19.0665, "lng": 72.8835},
            {"id": "HOSP-02", "name": "City Life Dialysis & Trauma Center", "beds": 65, "has_icu": True, "lat": 19.0712, "lng": 72.8751}
        ],
        "schools": [
            {"id": "SCH-01", "name": "St. Jude High School & Junior College", "students": 1450, "lat": 19.0699, "lng": 72.8812},
            {"id": "SCH-02", "name": "Municipal Primary School No. 4", "students": 820, "lat": 19.0642, "lng": 72.8770},
            {"id": "SCH-03", "name": "Holy Cross Convent School", "students": 1100, "lat": 19.0725, "lng": 72.8840}
        ],
        "critical_roads": [
            {"id": "RD-01", "name": "LBS Marg Arterial Corridor", "priority": "CRITICAL", "traffic_pcu": 4500},
            {"id": "RD-02", "name": "CST Road Junction (BKC Link)", "priority": "HIGH", "traffic_pcu": 3800}
        ],
        "shelters": [
            {"id": "SHL-01", "name": "Kurla Community Indoor Hall", "capacity": 1200, "lat": 19.0730, "lng": 72.8860, "is_active": True}
        ]
    },
    "WARD-04": {
        "ward_id": "WARD-04",
        "name": "Ward 4 (Dadar / Parel)",
        "zone": "South Central",
        "lat": 19.0178,
        "lng": 72.8478,
        "population": 96500,
        "area_sqkm": 3.8,
        "elevation_m": 8.0,
        "drainage_outfall": "Outfall D-04 (Hindmata Storm Drain)",
        "drainage_capacity_mm_hr": 55.0,
        "hospitals": [
            {"id": "HOSP-03", "name": "KEM Municipal Medical College & Hospital", "beds": 1800, "has_icu": True, "lat": 19.0033, "lng": 72.8428}
        ],
        "schools": [
            {"id": "SCH-04", "name": "King George High School", "students": 1200, "lat": 19.0201, "lng": 72.8490}
        ],
        "critical_roads": [
            {"id": "RD-03", "name": "Dr. Ambedkar Road Highway", "priority": "HIGH", "traffic_pcu": 6000}
        ],
        "shelters": [
            {"id": "SHL-02", "name": "Dadar Sports Complex Shelter", "capacity": 1500, "lat": 19.0190, "lng": 72.8450, "is_active": True}
        ]
    },
    "WARD-08": {
        "ward_id": "WARD-08",
        "name": "Ward 8 (Andheri East - K East)",
        "zone": "Western Suburbs",
        "lat": 19.1136,
        "lng": 72.8697,
        "population": 115000,
        "area_sqkm": 5.1,
        "elevation_m": 12.0,
        "drainage_outfall": "Outfall D-08 (Chakala Nullah)",
        "drainage_capacity_mm_hr": 60.0,
        "hospitals": [
            {"id": "HOSP-04", "name": "SevenHills Super Specialty Hospital", "beds": 750, "has_icu": True, "lat": 19.1170, "lng": 72.8790}
        ],
        "schools": [
            {"id": "SCH-05", "name": "St. Xavier's High School", "students": 1600, "lat": 19.1120, "lng": 72.8640}
        ],
        "critical_roads": [
            {"id": "RD-04", "name": "Western Express Highway - Andheri Flyover", "priority": "CRITICAL", "traffic_pcu": 8500}
        ],
        "shelters": [
            {"id": "SHL-03", "name": "Marol Community Hall", "capacity": 800, "lat": 19.1180, "lng": 72.8710, "is_active": True}
        ]
    },
    "WARD-12": {
        "ward_id": "WARD-12",
        "name": "Ward 12 (Chembur / Govandi - M East)",
        "zone": "Eastern Suburbs",
        "lat": 19.0622,
        "lng": 72.9015,
        "population": 142000,
        "area_sqkm": 6.0,
        "elevation_m": 5.0,
        "drainage_outfall": "Outfall D-12 (Trombay Creek)",
        "drainage_capacity_mm_hr": 40.0,
        "hospitals": [
            {"id": "HOSP-05", "name": "Shatabdi Municipal Hospital", "beds": 350, "has_icu": True, "lat": 19.0580, "lng": 72.9050}
        ],
        "schools": [
            {"id": "SCH-06", "name": "Chembur Karnataka High School", "students": 950, "lat": 19.0610, "lng": 72.8980}
        ],
        "critical_roads": [
            {"id": "RD-05", "name": "Eastern Freeway Link Road", "priority": "HIGH", "traffic_pcu": 4900}
        ],
        "shelters": [
            {"id": "SHL-04", "name": "Govandi Welfare Hall", "capacity": 900, "lat": 19.0590, "lng": 72.9080, "is_active": True}
        ]
    }
}

# Municipal Emergency Resources Catalog
DEFAULT_RESOURCES = [
    {
        "id": "RES-PUMP-01",
        "name": "High-Volume Dewatering Pump P-04 (1000 GPM)",
        "type": "pump",
        "capacity": "1000 GPM Diesel High-Head",
        "status": "AVAILABLE",
        "current_ward": "WARD-04",
        "lat": 19.0210,
        "lng": 72.8465,
        "eta_minutes": 18,
        "assigned_to": None
    },
    {
        "id": "RES-PUMP-02",
        "name": "Submersible Mobile Pump P-09 (600 GPM)",
        "type": "pump",
        "capacity": "600 GPM Submersible Electric",
        "status": "AVAILABLE",
        "current_ward": "WARD-17",
        "lat": 19.0720,
        "lng": 72.8730,
        "eta_minutes": 8,
        "assigned_to": None
    },
    {
        "id": "RES-PUMP-03",
        "name": "Trailer Dewatering Pump P-14 (1200 GPM)",
        "type": "pump",
        "capacity": "1200 GPM Heavy Heavy Discharge",
        "status": "DISPATCHED",
        "current_ward": "WARD-08",
        "lat": 19.1120,
        "lng": 72.8680,
        "eta_minutes": 25,
        "assigned_to": "INC-003"
    },
    {
        "id": "RES-TANKER-01",
        "name": "Municipal Potable Water Bowser T-101 (10,000L)",
        "type": "water_tanker",
        "capacity": "10,000 Litres Potable Water",
        "status": "AVAILABLE",
        "current_ward": "WARD-12",
        "lat": 19.0640,
        "lng": 72.9030,
        "eta_minutes": 15,
        "assigned_to": None
    },
    {
        "id": "RES-TANKER-02",
        "name": "Stainless Steel Food-Grade Tanker T-104 (12,000L)",
        "type": "water_tanker",
        "capacity": "12,000 Litres RO Water",
        "status": "AVAILABLE",
        "current_ward": "WARD-17",
        "lat": 19.0690,
        "lng": 72.8780,
        "eta_minutes": 12,
        "assigned_to": None
    },
    {
        "id": "RES-BOAT-01",
        "name": "NDRF Quick Response Boat Unit QRF-B2",
        "type": "rescue_boat",
        "capacity": "12-person Inflatable Motorized",
        "status": "AVAILABLE",
        "current_ward": "WARD-04",
        "lat": 19.0195,
        "lng": 72.8440,
        "eta_minutes": 22,
        "assigned_to": None
    },
    {
        "id": "RES-MED-01",
        "name": "Mobile Heatstroke & Emergency Care Van MED-07",
        "type": "medical_unit",
        "capacity": "4 beds with ORS, IV drip & Oxygen",
        "status": "AVAILABLE",
        "current_ward": "WARD-04",
        "lat": 19.0180,
        "lng": 72.8490,
        "eta_minutes": 14,
        "assigned_to": None
    },
    {
        "id": "RES-LEAK-01",
        "name": "Acoustic Leak Correlator Repair Gang R-02",
        "type": "leak_gang",
        "capacity": "Excavator + Acoustic Sensor + Sleeve Clamps",
        "status": "AVAILABLE",
        "current_ward": "WARD-08",
        "lat": 19.1150,
        "lng": 72.8710,
        "eta_minutes": 20,
        "assigned_to": None
    }
]

# Initial Seed Incidents
INITIAL_INCIDENTS = [
    {
        "id": "INC-001",
        "category": "flood",
        "ward_id": "WARD-17",
        "ward_name": "Ward 17 (Kurla - L Ward)",
        "title": "Severe Waterlogging & Rising Flood Risk",
        "status": "PENDING_APPROVAL",
        "severity": "CRITICAL",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "lat": 19.0688,
        "lng": 72.8796,
        "telemetry": {
            "rainfall_rate_mm_hr": 118.0,
            "accumulated_rain_24h_mm": 184.0,
            "flood_depth_cm": 38.0,
            "drainage_saturation_pct": 98.0,
            "temperature_c": 28.5,
            "citizen_reports_count": 6
        },
        "explainability": {
            "confidence": 0.94,
            "factors": [
                {"factor": "Rainfall Intensity", "detail": "118 mm/hr (Exceeds 45 mm/hr drainage threshold by 162%)", "weight": "+38%"},
                {"factor": "Hydrological Saturation", "detail": "Storm drain outfall D-17 throttled by high tide in Mithi River", "weight": "+25%"},
                {"factor": "Citizen Corroboration", "detail": "6 geo-tagged citizen photos with verified water depths 25-40 cm", "weight": "+21%"},
                {"factor": "Critical Infrastructure Vulnerability", "detail": "Bhabha Hospital & 3 municipal schools inside the inundation contour", "weight": "+16%"}
            ]
        },
        "impact_assessment": {
            "exposed_population": 8420,
            "hospitals_count": 1,
            "hospitals_names": ["Bhabha Municipal General Hospital (420 beds)"],
            "schools_count": 3,
            "schools_names": ["St. Jude High School", "Municipal Primary School No. 4", "Holy Cross Convent"],
            "critical_roads_count": 2,
            "critical_roads": ["LBS Marg Arterial Corridor", "CST Road Junction"],
            "shelters_available": ["Kurla Community Indoor Hall (Cap: 1200)"]
        },
        "recommended_actions": [
            {
                "id": "ACT-101",
                "priority": 1,
                "action": "Deploy High-Capacity Dewatering Pump P-04 to Outfall D-17",
                "resource_id": "RES-PUMP-01",
                "authority": "Stormwater Drainage Dept",
                "eta_minutes": 18,
                "status": "PENDING"
            },
            {
                "id": "ACT-102",
                "priority": 2,
                "action": "Traffic Diversion: Divert traffic away from LBS Marg via BKC Connector",
                "resource_id": "TRAFFIC-CORPS",
                "authority": "Traffic Police Division",
                "eta_minutes": 10,
                "status": "PENDING"
            },
            {
                "id": "ACT-103",
                "priority": 3,
                "action": "Hospital Flood Protection: Alert Bhabha Hospital to seal basement generators",
                "resource_id": "HOSP-ALERT",
                "authority": "Disaster Health Coordinator",
                "eta_minutes": 5,
                "status": "PENDING"
            },
            {
                "id": "ACT-104",
                "priority": 4,
                "action": "Precautionary School Evacuation: Notify 3 schools for controlled dismissal",
                "resource_id": "EDU-CELL",
                "authority": "Education Officer",
                "eta_minutes": 10,
                "status": "PENDING"
            },
            {
                "id": "ACT-105",
                "priority": 5,
                "action": "Multilingual Citizen Broadcast via SMS & Public Audio Systems",
                "resource_id": "SNS-BROADCAST",
                "authority": "Public Information Cell",
                "eta_minutes": 2,
                "status": "PENDING"
            }
        ],
        "alerts_content": {
            "english": "EMERGENCY: High flood risk in Ward 17 (Kurla). LBS Marg submerged (35cm). Avoid area; use BKC Connector. Emergency Help: 1077.",
            "hindi": "आपातकालीन सूचना: वार्ड 17 (कुर्ला) में भारी जलभराव। LBS मार्ग पर 35 सेमी पानी। कृपया इस मार्ग से बचें और BKC कनेक्टर का प्रयोग करें। हेल्पलाइन: 1077।",
            "marathi": "तातडीचा इशारा: प्रभाग १७ (कुर्ला) मध्ये गंभीर पाणी साचले आहे. LBS मार्ग बंद. पर्यायी BKC कनेक्टर वापरा. मदत कक्ष: १०७७."
        },
        "rag_reference": {
            "sop_id": "SOP-FLD-102",
            "statutory_reference": "NDMA Guidelines on Management of Urban Flooding (2024), Chapter 4, Sec 4.3",
            "rationale": "Rainfall intensity (118 mm/hr) breached the Level-3 Red threshold (>100mm/hr) with immediate inundation risk."
        },
        "agent_trace": {
            "risk_agent": {"status": "SUCCESS", "confidence": 0.94, "execution_ms": 120},
            "impact_agent": {"status": "SUCCESS", "entities_assessed": 7, "execution_ms": 145},
            "resource_agent": {"status": "SUCCESS", "resources_matched": 3, "execution_ms": 95},
            "communication_agent": {"status": "SUCCESS", "languages": ["en", "hi", "mr"], "execution_ms": 110},
            "coordinator_agent": {"status": "SUCCESS", "plan_ready": True, "execution_ms": 180}
        }
    },
    {
        "id": "INC-002",
        "category": "heatwave",
        "ward_id": "WARD-04",
        "ward_name": "Ward 4 (Dadar / Parel)",
        "title": "Extreme Heat Index Spike & Wet-Bulb Stress",
        "status": "PENDING_APPROVAL",
        "severity": "HIGH",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "lat": 19.0178,
        "lng": 72.8478,
        "telemetry": {
            "temperature_c": 43.2,
            "humidity_pct": 68.0,
            "heat_index_celsius": 48.6,
            "wet_bulb_temp_c": 31.8,
            "citizen_reports_count": 4
        },
        "explainability": {
            "confidence": 0.91,
            "factors": [
                {"factor": "Heat Index Exceeded", "detail": "Heat Index 48.6°C exceeds danger threshold of 46°C", "weight": "+40%"},
                {"factor": "Wet-Bulb Stress", "detail": "Wet-bulb 31.8°C restricts natural sweat evaporation", "weight": "+30%"},
                {"factor": "Elderly & Vulnerable Concentration", "detail": "High proportion of geriatric outpatients around KEM Hospital", "weight": "+20%"},
                {"factor": "Outdoor Labor Density", "detail": "Major construction corridors along Dr. Ambedkar Road", "weight": "+10%"}
            ]
        },
        "impact_assessment": {
            "exposed_population": 14200,
            "hospitals_count": 1,
            "hospitals_names": ["KEM Municipal Medical College (1800 beds)"],
            "schools_count": 1,
            "schools_names": ["King George High School"],
            "critical_roads_count": 1,
            "critical_roads": ["Dr. Ambedkar Road"],
            "shelters_available": ["Dadar Sports Complex Cooling Shelter"]
        },
        "recommended_actions": [
            {
                "id": "ACT-201",
                "priority": 1,
                "action": "Activate Dadar Sports Complex as Air-Conditioned Public Cooling Shelter with ORS & potable water",
                "resource_id": "SHL-02",
                "authority": "Health Dept",
                "eta_minutes": 15,
                "status": "PENDING"
            },
            {
                "id": "ACT-202",
                "priority": 2,
                "action": "Dispatch Mobile Heatstroke Care Van MED-07 to Dadar Central Transit Hub",
                "resource_id": "RES-MED-01",
                "authority": "Emergency Medical Services",
                "eta_minutes": 14,
                "status": "PENDING"
            },
            {
                "id": "ACT-203",
                "priority": 3,
                "action": "Enforce mandatory work suspension for outdoor laborers between 11:30 AM - 4:00 PM",
                "resource_id": "LABOR-SQUAD",
                "authority": "Municipal Works Enforcement",
                "eta_minutes": 20,
                "status": "PENDING"
            }
        ],
        "alerts_content": {
            "english": "HEAT ADVISORY: Severe heat index 48.6°C in Ward 4. Cooling shelter open at Dadar Sports Complex with free cold water & ORS. Avoid peak sun.",
            "hindi": "लू की चेतावनी: वार्ड 4 में तापमान 48.6°C (हीट इंडेक्स)। दादर स्पोर्ट्स कॉम्प्लेक्स में मुफ्त पेयजल व ओआरएस युक्त कूलिंग शेल्टर चालू है।",
            "marathi": "उष्णतेची लाट: प्रभाग ४ मध्ये तीव्र तापमान. दादर स्पोर्ट्स कॉम्प्लेक्स येथे मोफत थंड पाणी व ओआरएस सुविधा उपलब्ध आहे. दुपारच्या उन्हात बाहेर पडणे टाळा."
        },
        "rag_reference": {
            "sop_id": "SOP-HEAT-201",
            "statutory_reference": "National Heat Action Plan (NHAP) 2024 Guidelines, Tier-2 Severe Heatwave Standard",
            "rationale": "Heat Index exceeded 46°C threshold with elevated humidity creating physiological distress."
        },
        "agent_trace": {
            "risk_agent": {"status": "SUCCESS", "confidence": 0.91, "execution_ms": 115},
            "impact_agent": {"status": "SUCCESS", "entities_assessed": 5, "execution_ms": 130},
            "resource_agent": {"status": "SUCCESS", "resources_matched": 2, "execution_ms": 88},
            "communication_agent": {"status": "SUCCESS", "languages": ["en", "hi", "mr"], "execution_ms": 105},
            "coordinator_agent": {"status": "SUCCESS", "plan_ready": True, "execution_ms": 160}
        }
    },
    {
        "id": "INC-003",
        "category": "leak",
        "ward_id": "WARD-08",
        "ward_name": "Ward 8 (Andheri East)",
        "title": "600mm High-Pressure Mainline Rupture",
        "status": "IN_PROGRESS",
        "severity": "HIGH",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "lat": 19.1136,
        "lng": 72.8697,
        "telemetry": {
            "pressure_drop_bar": 2.1,
            "flow_anomaly_pct": 340.0,
            "estimated_loss_kld": 480.0,
            "citizen_reports_count": 8
        },
        "explainability": {
            "confidence": 0.96,
            "factors": [
                {"factor": "SCADA Pressure Drop", "detail": "Sudden pressure loss from 4.2 bar to 2.1 bar in Zone 3 feeder", "weight": "+45%"},
                {"factor": "Estimated Water Loss", "detail": "480,000 Litres/day potable water escaping onto roadway", "weight": "+30%"},
                {"factor": "Road Cavitation Risk", "detail": "High-velocity water scouring sub-base near Chakala Junction", "weight": "+25%"}
            ]
        },
        "impact_assessment": {
            "exposed_population": 22000,
            "hospitals_count": 1,
            "hospitals_names": ["SevenHills Super Specialty Hospital"],
            "schools_count": 1,
            "schools_names": ["St. Xavier's High School"],
            "critical_roads_count": 1,
            "critical_roads": ["Western Express Highway Link"],
            "shelters_available": []
        },
        "recommended_actions": [
            {
                "id": "ACT-301",
                "priority": 1,
                "action": "Throttle isolating SCADA Valves V-08A and V-08B to stop pressurized outflow",
                "resource_id": "SCADA-SYS",
                "authority": "Hydraulic Engineering Dept",
                "eta_minutes": 8,
                "status": "APPROVED"
            },
            {
                "id": "ACT-302",
                "priority": 2,
                "action": "Deploy Acoustic Leak Repair Gang R-02 with trench shoring & sleeve clamp",
                "resource_id": "RES-LEAK-01",
                "authority": "Pipeline Emergency Squad",
                "eta_minutes": 20,
                "status": "APPROVED"
            },
            {
                "id": "ACT-303",
                "priority": 3,
                "action": "Issue Precautionary Boil-Water Advisory to Chakala & Marol sectors",
                "resource_id": "SNS-BROADCAST",
                "authority": "Public Health Lab",
                "eta_minutes": 5,
                "status": "APPROVED"
            }
        ],
        "alerts_content": {
            "english": "WATER NOTICE: Mainline rupture in Ward 8 (Andheri East). Repairs underway. Temporary pressure drop; boil tap water before drinking.",
            "hindi": "जल आपूर्ति सूचना: वार्ड 8 (अंधेरी पूर्व) में मुख्य पाइपलाइन फटने की मरम्मत जारी है। पीने का पानी उबालकर प्रयोग करें।",
            "marathi": "पाणी पुरवठा सूचना: प्रभाग ८ (अंधेरी पूर्व) येथे जलवाहिनी दुरुस्ती काम चालू. कृपया पिण्याचे पाणी उकळून प्यावे."
        },
        "rag_reference": {
            "sop_id": "SOP-LEAK-401",
            "statutory_reference": "CPHEEO Water Supply & Pipeline Maintenance Manual, Sec 9.4",
            "rationale": "High pressure burst causing roadway destabilization and high loss of treated potable water."
        },
        "agent_trace": {
            "risk_agent": {"status": "SUCCESS", "confidence": 0.96, "execution_ms": 110},
            "impact_agent": {"status": "SUCCESS", "entities_assessed": 4, "execution_ms": 125},
            "resource_agent": {"status": "SUCCESS", "resources_matched": 2, "execution_ms": 90},
            "communication_agent": {"status": "SUCCESS", "languages": ["en", "hi", "mr"], "execution_ms": 100},
            "coordinator_agent": {"status": "SUCCESS", "plan_ready": True, "execution_ms": 150}
        }
    },
    {
        "id": "INC-004",
        "category": "water_shortage",
        "ward_id": "WARD-12",
        "ward_name": "Ward 12 (Chembur / Govandi)",
        "title": "Informal Settlement Potable Deficit (Reservoir < 16%)",
        "status": "PENDING_APPROVAL",
        "severity": "MODERATE",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "lat": 19.0622,
        "lng": 72.9015,
        "telemetry": {
            "reservoir_capacity_pct": 15.8,
            "supply_hours_day": 1.5,
            "per_capita_deficit_lpcd": 42.0,
            "citizen_reports_count": 12
        },
        "explainability": {
            "confidence": 0.89,
            "factors": [
                {"factor": "Terminal Storage Depletion", "detail": "Govandi Elevated Reservoir at critical 15.8% capacity", "weight": "+40%"},
                {"factor": "Deficit Severity", "detail": "Per capita deficit of 42 Litres/capita/day in dense informal housing", "weight": "+35%"},
                {"factor": "Citizen Outcry", "detail": "12 verified community shortage tickets in past 4 hours", "weight": "+25%"}
            ]
        },
        "impact_assessment": {
            "exposed_population": 38000,
            "hospitals_count": 1,
            "hospitals_names": ["Shatabdi Municipal Hospital"],
            "schools_count": 1,
            "schools_names": ["Chembur Karnataka High School"],
            "critical_roads_count": 0,
            "critical_roads": [],
            "shelters_available": []
        },
        "recommended_actions": [
            {
                "id": "ACT-401",
                "priority": 1,
                "action": "Dispatch GPS-Tracked Potable Water Bowsers T-101 and T-104 on designated community rotation",
                "resource_id": "RES-TANKER-01",
                "authority": "Municipal Water Bowsers Division",
                "eta_minutes": 15,
                "status": "PENDING"
            },
            {
                "id": "ACT-402",
                "priority": 2,
                "action": "Prioritize dedicated supply bypass line to Shatabdi Municipal Hospital",
                "resource_id": "VALVE-CTRL",
                "authority": "Hydraulic Distribution Div",
                "eta_minutes": 25,
                "status": "PENDING"
            }
        ],
        "alerts_content": {
            "english": "WATER SCHEDULE: Free municipal water tankers deployed to Govandi West blocks from 2:00 PM. Dial 1916 for tanker tracking.",
            "hindi": "जल सूचना: गोवंडी पश्चिम क्षेत्र में दोपहर 2:00 बजे से मुफ्त नगर पालिका पानी टैंकर उपलब्ध हैं। ट्रैकिंग हेतु 1916 डायल करें।",
            "marathi": "पाणी पुरवठा: गोवंडी पश्चिम येथे दुपारी २:०० वाजल्यापासून मोफत टँकर पुरवठा. टँकर माहितीसाठी १९१६ वर संपर्क करा."
        },
        "rag_reference": {
            "sop_id": "SOP-WTR-301",
            "statutory_reference": "Jal Jeevan Mission Urban Water Security Framework, Resilience SOP Sec 7",
            "rationale": "Reservoir capacity fallen under 20% threshold triggering equitable rationing."
        },
        "agent_trace": {
            "risk_agent": {"status": "SUCCESS", "confidence": 0.89, "execution_ms": 105},
            "impact_agent": {"status": "SUCCESS", "entities_assessed": 3, "execution_ms": 115},
            "resource_agent": {"status": "SUCCESS", "resources_matched": 2, "execution_ms": 82},
            "communication_agent": {"status": "SUCCESS", "languages": ["en", "hi", "mr"], "execution_ms": 95},
            "coordinator_agent": {"status": "SUCCESS", "plan_ready": True, "execution_ms": 140}
        }
    }
]

# Citizen Reports Registry
INITIAL_CITIZEN_REPORTS = [
    {
        "id": "CR-101",
        "category": "waterlogging",
        "ward_id": "WARD-17",
        "address": "Opposite Kurla Station West, LBS Marg Crossing",
        "reporter_name": "Aakash Verma",
        "created_at": "12 mins ago",
        "status": "VERIFIED",
        "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
        "user_description": "Water reached waist level near bus stop. Autos stuck. Drainage completely choked.",
        "ai_analysis": {
            "detected_category": "Severe Waterlogging / Flash Inundation",
            "estimated_water_depth_cm": "30 - 45 cm",
            "road_passability": "IMPASSABLE FOR LIGHT VEHICLES",
            "debris_detected": True,
            "severity_score": 0.92,
            "model_confidence": 0.95
        }
    },
    {
        "id": "CR-102",
        "category": "leak",
        "ward_id": "WARD-08",
        "address": "Near Chakala Metro Station, Andheri Kurla Road",
        "reporter_name": "Pooja Deshmukh",
        "created_at": "35 mins ago",
        "status": "DISPATCHED",
        "image_url": "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80",
        "user_description": "Huge fountain of clean water spurting from footpath, pavement is cracking.",
        "ai_analysis": {
            "detected_category": "High-Pressure Mainline Rupture",
            "estimated_water_depth_cm": "10 - 20 cm flowing",
            "road_passability": "PARTIAL HAZARD",
            "debris_detected": False,
            "severity_score": 0.88,
            "model_confidence": 0.94
        }
    }
]

# Database State Manager (Thread-Safe Concurrency Lock for Async / Multi-worker Safety)
class MockDatabase:
    def __init__(self):
        self._lock = threading.RLock()
        self.incidents = copy.deepcopy(INITIAL_INCIDENTS)
        self.resources = copy.deepcopy(DEFAULT_RESOURCES)
        self.citizen_reports = copy.deepcopy(INITIAL_CITIZEN_REPORTS)
        self.wards = copy.deepcopy(WARDS_REGISTRY)
        self.audit_log: List[Dict[str, Any]] = [
            {
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "event": "System Initialized",
                "officer": "SYSTEM_BOOTSTRAP",
                "details": "JalRakshak AI Multi-Agent Environment Online"
            }
        ]
        self.aws_event_bus: List[Dict[str, Any]] = []

    def get_incidents(self) -> List[Dict[str, Any]]:
        with self._lock:
            return copy.deepcopy(self.incidents)

    def get_incident(self, incident_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            for inc in self.incidents:
                if inc["id"] == incident_id:
                    return inc
            return None

    def add_incident(self, incident: Dict[str, Any]):
        with self._lock:
            # Add to head of list so it appears first in priority queue
            self.incidents.insert(0, incident)

    def update_incident(self, incident_id: str, updates: Dict[str, Any]):
        with self._lock:
            for i, inc in enumerate(self.incidents):
                if inc["id"] == incident_id:
                    self.incidents[i].update(updates)
                    return self.incidents[i]
            return None

    def get_resources(self) -> List[Dict[str, Any]]:
        with self._lock:
            return self.resources

    def get_citizen_reports(self) -> List[Dict[str, Any]]:
        with self._lock:
            return self.citizen_reports

    def add_citizen_report(self, report: Dict[str, Any]):
        with self._lock:
            self.citizen_reports.insert(0, report)

    def log_audit(self, officer: str, event: str, details: str):
        with self._lock:
            self.audit_log.insert(0, {
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "officer": officer,
                "event": event,
                "details": details
            })

    def log_aws_event(self, source: str, detail_type: str, detail: Dict[str, Any]):
        with self._lock:
            self.aws_event_bus.insert(0, {
                "event_id": f"evt-{len(self.aws_event_bus)+1000}",
                "timestamp": datetime.now().isoformat(),
                "source": source,
                "detail_type": detail_type,
                "detail": detail
            })

    def reset_to_defaults(self):
        with self._lock:
            self.incidents = copy.deepcopy(INITIAL_INCIDENTS)
            self.resources = copy.deepcopy(DEFAULT_RESOURCES)
            self.citizen_reports = copy.deepcopy(INITIAL_CITIZEN_REPORTS)
            self.log_audit("SYSTEM", "RESET_SIMULATION", "Database restored to standard operational baseline.")

db = MockDatabase()
