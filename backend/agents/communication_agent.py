"""
Agent 4: Communication Agent
Synthesizes multilingual citizen emergency advisories, SMS alerts, and public broadcast notices.
"""
from typing import Dict, Any

class CommunicationAgent:
    def __init__(self):
        self.name = "Communication Agent"
        self.role = "Multilingual Public Alert & Citizen Warning Synthesizer"

    def generate_alerts(self, ward_name: str, category: str, severity: str, impact: Dict[str, Any], telemetry: Dict[str, Any]) -> Dict[str, str]:
        roads = impact.get("critical_roads", [])
        primary_road = roads[0] if roads else "main arterial road"

        if category == "flood":
            depth = telemetry.get("flood_depth_cm", 30)
            en = f"EMERGENCY ALERT: {severity} Flood risk in {ward_name}. {primary_road} submerged ({depth}cm). Avoid non-essential travel. Emergency Helpline: 1077."
            hi = f"आपातकालीन चेतावनी: {ward_name} में {severity} बाढ़ का खतरा। {primary_road} पर {depth} सेमी जलभराव। कृपया यात्रा टालें। आपातकालीन हेल्पलाइन: 1077।"
            mr = f"तातडीचा इशारा: {ward_name} मध्ये पूरस्थिती. {primary_road} येथे {depth} सेंमी पाणी साचले आहे. विनाकारण प्रवास टाळा. आपत्कालीन मदत: १०७७."

        elif category == "heatwave":
            temp = telemetry.get("temperature_c", 43)
            en = f"HEATWAVE WARNING: Severe heat ({temp}°C) in {ward_name}. Free cooling centers & ORS active at community halls. Stay hydrated; avoid direct sun 12-4 PM."
            hi = f"लू की गंभीर चेतावनी: {ward_name} में तापमान {temp}°C। नजदीकी कम्युनिटी हॉल में वातानुकूलित कूलिंग सेंटर व ओआरएस चालू है। दोपहर 12 से 4 धूप से बचें।"
            mr = f"उष्णतेची लाट इशारा: {ward_name} मध्ये तापमान {temp}°C. महापालिका कूलिंग सेंटर व मोफत ओआरएस केंद्र सुरू आहेत. दुपारी १२ ते ४ उन्हात जाणे टाळा."

        elif category == "leak":
            en = f"WATER ADVISORY: Mainline repair underway in {ward_name}. Temporary low pressure expected. Precautionary boil-water advisory in effect."
            hi = f"जल परामर्श: {ward_name} में मुख्य पाइपलाइन मरम्मत कार्य जारी। पानी का दबाव कम रहेगा। पीने से पहले पानी अवश्य उबालें।"
            mr = f"पाणी सूचना: {ward_name} येथे मुख्य जलवाहिनी दुरुस्ती सुरू. पाण्याचा दाब कमी राहील. पिण्याचे पाणी उकळून वापरावे."

        else: # water_shortage
            en = f"WATER RELIEF: GPS-tracked municipal water bowsers scheduled for {ward_name}. Track live tanker location or request aid on helpline 1916."
            hi = f"जल राहत सूचना: {ward_name} में नगर पालिका के जल टैंकर रवाना कर दिए गए हैं। टैंकर ट्रैकिंग व सहायता हेतु 1916 पर कॉल करें।"
            mr = f"पाणी टंचाई निवारण: {ward_name} मध्ये महापालिकेचे पाण्याचे टँकर पाठवण्यात आले आहेत. टँकर माहितीसाठी १९१६ वर संपर्क साधा."

        return {
            "english": en,
            "hindi": hi,
            "marathi": mr
        }

communication_agent = CommunicationAgent()
