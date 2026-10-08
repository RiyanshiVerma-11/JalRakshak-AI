"""
Agent 1: Risk Detection Agent
Analyzes environmental sensor inputs, hydrological telemetry, and citizen reports
to determine incident category, severity level, confidence score, and explainability breakdown.
"""
from typing import Dict, Any

class RiskDetectionAgent:
    def __init__(self):
        self.name = "Risk Detection Agent"
        self.role = "Environmental & Sensor Telemetry Risk Assessor"

    def evaluate(self, category: str, ward_info: Dict[str, Any], telemetry: Dict[str, Any]) -> Dict[str, Any]:
        drainage_capacity = ward_info.get("drainage_capacity_mm_hr", 50.0)
        citizen_count = telemetry.get("citizen_reports_count", 0)

        if category == "flood":
            rainfall = telemetry.get("rainfall_rate_mm_hr", 0.0)
            flood_depth = telemetry.get("flood_depth_cm", 0.0)
            saturation = telemetry.get("drainage_saturation_pct", 50.0)

            ratio = (rainfall / drainage_capacity) if drainage_capacity > 0 else 2.0

            if rainfall >= 100 or flood_depth >= 30 or ratio > 2.0:
                severity = "CRITICAL"
                confidence = 0.94
            elif rainfall >= 60 or flood_depth >= 20 or ratio > 1.2:
                severity = "HIGH"
                confidence = 0.89
            elif rainfall >= 35 or flood_depth >= 10:
                severity = "MODERATE"
                confidence = 0.82
            else:
                severity = "LOW"
                confidence = 0.75

            factors = [
                {
                    "factor": "Rainfall vs Drainage Threshold",
                    "detail": f"{rainfall} mm/hr recorded vs {drainage_capacity} mm/hr drainage capacity (exceeds by {int(max(0, (ratio-1)*100))}%)",
                    "weight": "+38%"
                },
                {
                    "factor": "Water Inundation Level",
                    "detail": f"Ground sensor water depth reading: {flood_depth} cm",
                    "weight": "+26%"
                },
                {
                    "factor": "Outfall Saturation",
                    "detail": f"Stormwater drain saturation at {saturation}% capacity",
                    "weight": "+20%"
                },
                {
                    "factor": "Citizen Corroboration",
                    "detail": f"{citizen_count} citizen reports confirmed in this sector",
                    "weight": "+16%"
                }
            ]

        elif category == "heatwave":
            temp = telemetry.get("temperature_c", 35.0)
            humidity = telemetry.get("humidity_pct", 50.0)
            heat_index = telemetry.get("heat_index_celsius", temp + 3.0)
            wet_bulb = telemetry.get("wet_bulb_temp_c", 28.0)

            if heat_index >= 46.0 or temp >= 43.0 or wet_bulb >= 31.0:
                severity = "CRITICAL" if heat_index >= 49.0 else "HIGH"
                confidence = 0.92
            elif heat_index >= 41.0 or temp >= 40.0:
                severity = "MODERATE"
                confidence = 0.85
            else:
                severity = "LOW"
                confidence = 0.78

            factors = [
                {"factor": "Heat Index Spike", "detail": f"Calculated Heat Index {heat_index}°C exceeds critical stress baseline (42°C)", "weight": "+40%"},
                {"factor": "Wet-Bulb Temperature", "detail": f"Wet-bulb reading {wet_bulb}°C impairs natural body thermoregulation", "weight": "+32%"},
                {"factor": "Sustained Dry Bulb Heat", "detail": f"Continuous peak dry bulb reading of {temp}°C", "weight": "+28%"}
            ]

        elif category == "leak":
            pressure_drop = telemetry.get("pressure_drop_bar", 1.0)
            loss_kld = telemetry.get("estimated_loss_kld", 200.0)

            if pressure_drop >= 1.8 or loss_kld >= 400:
                severity = "HIGH"
                confidence = 0.95
            elif pressure_drop >= 1.0 or loss_kld >= 150:
                severity = "MODERATE"
                confidence = 0.88
            else:
                severity = "LOW"
                confidence = 0.80

            factors = [
                {"factor": "Telemetry Pressure Drop", "detail": f"SCADA feed detects sudden {pressure_drop} bar drop across feeder line", "weight": "+48%"},
                {"factor": "Potable Water Loss", "detail": f"Estimated treated water loss rate: {loss_kld} Kilolitres/Day", "weight": "+32%"},
                {"factor": "Sub-surface Erosion Risk", "detail": "High probability of road cavitation under arterial corridor", "weight": "+20%"}
            ]

        else: # water_shortage
            res_pct = telemetry.get("reservoir_capacity_pct", 50.0)
            deficit = telemetry.get("per_capita_deficit_lpcd", 20.0)

            if res_pct < 15.0 or deficit >= 45.0:
                severity = "CRITICAL"
                confidence = 0.93
            elif res_pct < 25.0 or deficit >= 30.0:
                severity = "HIGH" if res_pct < 18.0 else "MODERATE"
                confidence = 0.87
            else:
                severity = "LOW"
                confidence = 0.76

            factors = [
                {"factor": "Reservoir Level", "detail": f"Terminal reservoir critically depleted to {res_pct}% capacity", "weight": "+42%"},
                {"factor": "Per Capita Deficit", "detail": f"Deficit of {deficit} Litres/Capita/Day in service area", "weight": "+35%"},
                {"factor": "Community Distress", "detail": f"{citizen_count} verified citizen shortage logs in past 6 hours", "weight": "+23%"}
            ]

        return {
            "risk_type": category,
            "severity": severity,
            "confidence": confidence,
            "explainability": {
                "confidence": confidence,
                "factors": factors
            }
        }

risk_agent = RiskDetectionAgent()
