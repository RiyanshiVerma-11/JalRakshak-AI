# 🌊 JalRakshak AI — Autonomous Climate & Water Emergency Response Platform

> **"Most climate platforms tell authorities what is happening. JalRakshak AI tells them what to do next."**  
> *Transforming real-time environmental signals and citizen reports into prioritized, explainable, human-authorized tactical actions.*

[![AWS Hackathon](https://img.shields.io/badge/AWS%20Hackathon-WeMakeDevs%202026-FF9900?style=for-the-badge&logo=amazon-aws)](https://www.wemakedevs.org/aws/env)
[![AWS Strands Agents](https://img.shields.io/badge/Orchestrator-AWS%20Strands%20Agents%20SDK-06B6D4?style=for-the-badge&logo=amazonaws)](https://aws.amazon.com)
[![Bedrock Claude 3.5](https://img.shields.io/badge/AI%20Model-Claude%203.5%20Sonnet-6366F1?style=for-the-badge)](https://aws.amazon.com/bedrock/)
[![NDMA Compliant](https://img.shields.io/badge/Statutory%20SOP-NDMA%20%26%20NHAP%202024-10B981?style=for-the-badge)](https://ndma.gov.in)

---

## 🎯 The Core Problem & The Killer Differentiator

When extreme climate events strike dense urban centers—such as a **118 mm/hr monsoon cloudburst** or a **48.6°C wet-bulb heatwave**—disaster management authorities are flooded with raw sensor telemetry, generic weather warnings, and unvetted citizen complaints.

Existing platforms display passive red icons:
```
🌧️ Heavy Rainfall Alert in Mumbai Suburbs
```

**JalRakshak AI transforms Data → Decision → Action:**
```
⚠️ Ward 17 (Kurla - L Ward): HIGH FLOOD RISK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 Estimated Exposed Population:  8,420 citizens
🏥 Hospitals at Immediate Risk:    1 (Bhabha Municipal General - 420 beds)
🏫 Educational Institutions:       3 (St. Jude High, Primary School #4, Holy Cross)
🛣️ Critical Corridors Submerged:   2 (LBS Marg - 38cm depth, CST Road Junction)

🎯 STATUTORY SOP RAG CITATION:
NDMA Urban Flooding Guidelines (2024), Chapter 4, Sec 4.3

📋 PRIORITIZED TACTICAL ACTIONS (Pending Human Authorization):
[Priority 1] Deploy High-Capacity Dewatering Pump P-04 (1000 GPM) to Drain Outfall D-17
[Priority 2] Traffic Police: Divert vehicular flow from LBS Marg via BKC Connector
[Priority 3] Alert Bhabha Hospital: Engage sandbags around basement generators & oxygen unit
[Priority 4] Precautionary dismissal order for 3 schools within 1.5km hazard contour
[Priority 5] Broadcast geo-fenced multilingual SMS alerts in English, Hindi, and Marathi

[ APPROVE & EXECUTE ALL ]   [ MODIFY DIRECTIVE ]
```

---

## 🏗️ The 3 Integrated Interfaces

### 👨‍💼 1. Emergency Command Center (For Municipal Incident Controllers)
* **Live City GIS Map:** High-precision Leaflet map with hazard perimeter contours (Red for Critical, Amber for High), real-time locations of tactical assets (Dewatering Pumps, Potable Water Bowsers, Medical Heat Vans, Rescue Boats), and vulnerable civic infrastructure.
* **AI Priority Queue:** Dynamically ranked disaster incidents (#1 Ward 17 Flood, #2 Ward 4 Heatwave, #3 Ward 8 Pipeline Rupture, #4 Ward 12 Water Shortage) scored continuously by the multi-agent pipeline.
* **Explainability Scorecard ("Why Critical?"):** Demystifies AI black-box decisions with weighted quantitative factors (+38% Rainfall intensity vs drain threshold, +26% Outfall high-tide saturation, +20% Citizen corroboration, +16% Hospital proximity).
* **Human-in-the-Loop Action Approval Card:** Authorized commanders review tactical directives, modify parameters if needed, and execute with 1-click authorization that dispatches assets and queues Amazon SNS emergency broadcasts.
* **AWS Strands Multi-Agent Trace Drawer:** Live visual inspection of the 5 collaborating agents, execution latencies (sub-600ms total DAG), and Amazon Bedrock invocations.

### 📱 2. Citizen PWA (Mobile-Responsive Progressive Web App)
* **One-Tap Emergency Reporting:** Report Waterlogging (जलभराव), Severe Floods (बाढ़), Extreme Heat (लू), Pipeline Bursts (पाइपलाइन लीकेज), and Water Shortages (पानी की कमी).
* **Instant Multimodal Computer Vision Analysis:** Ingests citizen field photos and extracts:
  * *Detected Category:* Severe Urban Waterlogging
  * *Estimated Water Depth:* 35 – 50 cm
  * *Road Passability:* IMPASSABLE FOR LIGHT VEHICLES
  * *Debris / Choke Risk:* Detected (Storm Drain Choked)
  * *AI Confidence:* 95%
* **Community Emergency Broadcast Feed:** Real-time localized advisories in English, Hindi (हिन्दी), and Marathi (मराठी) with live water tanker GPS tracking and one-tap 1077 SOS calling.

### 🤖 3. AI Emergency Copilot (Conversational Disaster Commander)
* Natural language copilot that doesn't generate generic answers—it synthesizes live incident state, municipal inventory levels, and statutory standard operating procedures.
* Authority queries: *"What should we do about the flood in Ward 17?"* or *"Are there cooling shelters near Dadar?"*
* Returns structured situation summaries, actionable priority directives with 1-click dispatch buttons, explainability bullets, and statutory SOP citations.

---

## 🤖 The 5 Autonomous AWS Strands Agents

JalRakshak AI avoids monolithic LLM prompts or superficial agents. It implements **5 dedicated, stateful autonomous agents** built according to the **AWS Strands Agents SDK** paradigm:

```
                          SENSORS & TELEMETRY + CITIZEN PWA REPORTS
                                             │
                                             ▼
                                  [ Amazon EventBridge ]
                                             │
                                             ▼
                       ┌───────────────────────────────────────────┐
                       │   AGENT 1: RISK DETECTION AGENT           │
                       │   Evaluates rainfall, heat index, SCADA   │
                       │   Output: Severity, Confidence, Factors   │
                       └─────────────────────┬─────────────────────┘
                                             │
                                             ▼
                       ┌───────────────────────────────────────────┐
                       │   AGENT 2: IMPACT ASSESSMENT AGENT        │
                       │   Spatial GIS intersection with wards     │
                       │   Output: Population, Hospitals, Schools  │
                       └─────────────────────┬─────────────────────┘
                                             │
                                             ▼
                       ┌───────────────────────────────────────────┐
                       │   AGENT 3: RESOURCE & RESPONSE AGENT      │
                       │   Proximity & capacity asset matcher      │
                       │   Output: Pump P-04 (18m), Bowsers, Vans  │
                       └─────────────────────┬─────────────────────┘
                                             │
                                             ▼
                       ┌───────────────────────────────────────────┐
                       │   AGENT 4: COMMUNICATION AGENT            │
                       │   Multilingual advisory synthesizer       │
                       │   Output: Localized English, Hindi, MR    │
                       └─────────────────────┬─────────────────────┘
                                             │
                                             ▼
                       ┌───────────────────────────────────────────┐
                       │   AGENT 5: COORDINATOR AGENT (COMMANDER)  │
                       │   RAG SOP Retrieval (NDMA Guidelines)     │
                       │   Output: Ranked Emergency Action Plan    │
                       └─────────────────────┬─────────────────────┘
                                             │
                                             ▼
                       ┌───────────────────────────────────────────┐
                       │       HUMAN-IN-THE-LOOP APPROVAL          │
                       │       Municipal Commander Sign-off        │
                       └─────────────────────┬─────────────────────┘
                                      ↙             ↘
                       [ Tactical Asset Dispatch ]   [ Amazon SNS Broadcast ]
```

1. **Agent 1: Risk Detection Agent (`risk_agent.py`)**  
   Ingests raw meteorological feeds, ground waterlevel sensors, SCADA pressure feeds, and citizen reports. Computes severity (`CRITICAL`, `HIGH`, `MODERATE`), multi-factor confidence, and weighted explainability factors.
2. **Agent 2: Impact Assessment Agent (`impact_agent.py`)**  
   Executes GIS intersection against municipal asset registries. Quantifies exposed demographics, active healthcare facilities, schools, and arterial road corridors inside the hazard contour.
3. **Agent 3: Resource & Response Agent (`resource_agent.py`)**  
   Performs tactical logistics matching across city resource depots. Identifies closest available dewatering pumps, potable water bowsers, medical heat units, rescue boats, and pipeline repair squads based on travel ETA.
4. **Agent 4: Communication Agent (`communication_agent.py`)**  
   Drafts hyper-localized, culturally nuanced emergency advisories in English, Hindi, and Marathi with specific route detour guidance and emergency helpline numbers.
5. **Agent 5: Coordinator Agent (`coordinator_agent.py`)**  
   The AI Emergency Commander. Queries the SOP RAG Knowledge Base (`rag_engine.py`) to ground every intervention in statutory standards (NDMA, NHAP, Jal Jeevan Mission), synthesizes all agent inputs, and presents the structured Human-in-the-Loop decision contract.

---

## 🌪️ 4 Real-World Climate Scenarios Supported

| Scenario | Input Triggers | AI Transformation | Tactical Response Actions |
| :--- | :--- | :--- | :--- |
| **🌊 Urban Flooding & Waterlogging** | Rainfall > 70 mm/hr, Water Depth > 30 cm, Drainage Saturation > 85% | Cloudburst risk, road impassability, hospital flooding risk | Deploy 1000 GPM dewatering pump, divert arterial traffic, seal basement hospital generators |
| **🔥 Extreme Heatwave** | Temp > 42°C, Heat Index > 46°C, Wet-bulb > 31°C | Thermal distress, high vulnerable geriatric density | Open AC public cooling shelters with ORS, position heatstroke care van, halt outdoor manual labor |
| **🚰 Mainline Pipeline Rupture** | SCADA pressure drop > 1.5 bar, treated water loss > 250 KLD | Road cavitation risk, drinking water loss, contamination | Remotely throttle SCADA valves, dispatch acoustic leak repair gang, issue precautionary boil-water notice |
| **💧 Severe Water Shortage** | Reservoir < 20% capacity, per capita deficit > 40 LPCD | Informal settlement distress, prolonged dry supply | Route GPS-tracked potable water bowsers on rotation, prioritize hospital supply lines |

---

## ☁️ AWS Cloud Architecture

| AWS Service | Production Architectural Role | In-App Realization |
| :--- | :--- | :--- |
| **AWS Strands Agents SDK** | Multi-agent collaborative decision graph with deterministic state transitions | `backend/agents/strands_workflow.py` executing the 5 agents |
| **Amazon Bedrock** | Foundation model inference (Claude 3.5 Sonnet & Titan Embeddings) | Reasoning engine for risk evaluation and SOP semantic matching |
| **Amazon EventBridge** | Decoupled event bus capturing telemetry threshold breaches & citizen tickets | `backend/aws_simulator/aws_bridge.py` emitting `SensorThresholdExceeded` events |
| **Amazon DynamoDB** | Single-digit millisecond state storage for incidents, assets, and audit trails | In-memory real-time state store with DynamoDB schema in `aws_infra/template.yaml` |
| **Amazon S3** | Durable object lake for citizen evidence photos and GeoJSON contours | Presigned S3 upload generator and evidence lake simulation |
| **Amazon SNS** | High-throughput multilingual SMS and emergency broadcast dispatcher | Dispatches localized SMS in English, Hindi, and Marathi upon human approval |
| **AWS Lambda** | Serverless compute for real-time ingestion and Rekognition vision inference | Production handlers defined in `aws_infra/lambda_handlers.py` |

---

## 🎬 Cinematic Demo Script (For Hackathon Judges & Video Pitch)

1. **The Calm Dashboard:**  
   Open `http://localhost:8004`. Show the interactive Command Center with live Mumbai wards, active resource markers, and healthy baseline metrics.
2. **The Cloudburst Event:**  
   Click the quickbar button: **`🌧️ 118mm Rain`**.  
   *What happens:*  
   * Ward 17 immediately transitions from 🟢 Normal to 🔴 **CRITICAL FLOOD RISK**.
   * The **AWS Strands Agents DAG** fires sequentially (Risk: 120ms → Impact: 145ms → Resource: 95ms → Comm: 110ms → Coordinator: 180ms).
   * Total pipeline finishes in ~530ms with complete execution trace in the bottom drawer.
3. **The Explainability Moment:**  
   Point judges to the **"Why Critical?"** scorecard. Show that the AI isn't hallucinating—it cites the 118mm/hr rain exceeding the 45mm/hr drain capacity (+38%), high-tide saturation (+26%), citizen photos (+21%), and Bhabha Hospital's proximity (+16%).
4. **The RAG SOP Citation:**  
   Show the statutory reference: *NDMA Guidelines on Management of Urban Flooding (2024), Chapter 4, Sec 4.3*.
5. **The Human-in-the-Loop Moment:**  
   Show that the AI does *not* blindly dispatch assets. It presents the 5 prioritized actions to the commissioner. Click **`[ APPROVE & EXECUTE ALL ]`**.  
   *Confetti fires*, status updates to **DISPATCHED**, tactical pump P-04 is en route, and Amazon SNS alert is logged.
6. **The Citizen PWA Demo:**  
   Switch to the **Citizen PWA** tab. Show how a resident uploads a flooded street photo. The embedded computer vision instantly extracts *Depth: 35-50cm* and *Road Impassable*, then synchronizes to the command center.
7. **The AI Emergency Copilot:**  
   Switch to the **AI Copilot** tab. Ask: *"What should we do about the current flood situation in Ward 17?"*. Notice how it generates a decisive, tactical response grounded in live telemetry and NDMA protocols.
8. **The AWS Architecture View:**  
   Switch to the **AWS Architecture** tab. Show judges the live EventBridge stream, Lambda metrics, DynamoDB p99 latencies, and SAM CloudFormation template.

---

## 🚀 Quickstart & Local Installation

### Prerequisites
* Python 3.10+ (Python 3.11 recommended)
* Node.js v18+ (tested on v24) & npm

### 1. Run Everything with One Command
The built React frontend is pre-compiled into `frontend/dist/` and served directly by FastAPI on port 8004:
```bash
python run_app.py
```
Open **[http://localhost:8004](http://localhost:8004)** in your browser!

### 2. (Optional) Run in Frontend Dev Mode (Hot-Reloading)
If you want to edit React components with instant hot-reloading:
```bash
# Terminal 1: Backend
python run_app.py

# Terminal 2: Frontend
cd frontend
npm run dev
```
Open **[http://localhost:6173](http://localhost:6173)** (automatically proxies `/api/*` to FastAPI).

### 3. Deploy to AWS
Using the provided AWS Serverless Application Model (SAM) template:
```bash
cd aws_infra
sam build
sam deploy --guided
```

---

## 🏆 Hackathon Alignment Checklist

- [x] **Predictive → Context-Aware → Actionable → Explainable → Human-Controlled**
- [x] **AWS Strands Agents SDK:** Real 5-agent state graph orchestration
- [x] **Statutory SOP RAG:** Grounded in NDMA 2024, NHAP, CPHEEO, and Jal Jeevan Mission
- [x] **Multimodal Citizen Vision:** Real-time water depth and road hazard detection
- [x] **Multilingual Citizen Alerts:** Localized broadcasts in English, Hindi, and Marathi
- [x] **Live Interactive GIS Map:** Leaflet map with hazard contours and tactical asset positions
- [x] **Human-in-the-Loop Safety:** Mandatory authorization before tactical dispatch
- [x] **Production AWS IaC:** Ready-to-deploy SAM CloudFormation template

---
*Created for the AWS Hackathon 2026. Built with precision, resilience, and compassion for urban climate safety.*
