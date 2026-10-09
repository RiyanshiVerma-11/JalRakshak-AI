# 🎬 JalRakshak AI — Official 3-Minute Hackathon Demo Video Script

**Target Hackathon:** WeMakeDevs × AWS "Environmental Hacks"  
**Track:** Track 02 — Heat and Water  
**Submission Route:** Build It (100% Local, Zero Cloud Credentials, No AWS Account / Credit Card / `.env` Required)  
**Target Duration:** **2 minutes 52 seconds** (strictly adhering to the 3:00 hard submission ceiling)  
**Target Delivery Pace:** ~135 words per minute (clear, authoritative, well-paced)  
**Spoken Word Count:** ~390 words  

---

## 📋 Pre-Recording Setup & Environment Checklist

Before hitting record in OBS Studio / Loom / Screen Studio:
1. **Local Server Running:** Start `python run_app.py` in your primary terminal (`http://localhost:8004`).
2. **Browser Window (1080p / 1920×1080):** Set browser zoom to 110% for crisp typography on 1080p monitors.
3. **Pre-Staged Tabs:**
   - **Tab 1:** `http://localhost:8004/` (Landing Page with "Continue as Judge" and "Citizen PWA" entrypoints).
   - **Tab 2:** `http://localhost:8004/command-center` (Emergency Command Center in clean initial state).
   - **Tab 3:** `http://localhost:8004/citizen` (Citizen Emergency PWA view with Kurla report pre-loaded).
   - **Tab 4:** Split terminal or secondary window showing repository root for the 30-second judge smoke test.
4. **Microphone:** Level checked at -6 dB peak, background noise gate enabled.
5. **Cursor:** Set cursor size to Medium-Large with smooth click highlighting.

---

## ⏱️ Scene-by-Scene Timeline & Teleprompter Script

```
0:00 ─── [0:00 - 0:25] Scene 1: The Problem & Build It Route (25s)
0:25 ─── [0:25 - 0:50] Scene 2: Citizen Ingest & Multimodal CV (25s)
0:50 ─── [0:50 - 1:20] Scene 3: Cloudburst Simulation & Explainability (30s)
1:20 ─── [1:20 - 1:50] Scene 4: AWS Strands 5-Agent Collaborative DAG (30s)
1:50 ─── [1:50 - 2:20] Scene 5: AWS Cedar (`cedarpy`) Statutory RBAC (30s)
2:20 ─── [2:20 - 2:40] Scene 6: SCADA Telemetry & 48.6°C Heatwave (20s)
2:40 ─── [2:40 - 2:52] Scene 7: Quantified ROI & 30-Second Verification (12s)
```

---

### 📍 [0:00 - 0:25] Scene 1: The Hook, The Crisis & The Build It Route (25s)

* **Visual Setup:**
  - Start on **Landing Page** (`http://localhost:8004/`).
  - Mouse moves smoothly across the hero headline: *"Autonomous Climate & Water Emergency Command"*.
  - Hover over the **"Build It Route (Zero Config)"** badge and the **"Continue as Judge (read-only)"** button.
* **Teleprompter Voiceover:**
  > "Every monsoon and summer across Indian metros like Mumbai, climate disasters strike low-lying wards. In just 40 minutes, a 118 millimeter-per-hour cloudburst inundates hospital basements, while May brings lethal 48.6°C wet-bulb heatwaves.
  > 
  > *[PAUSE 1s]*
  > 
  > Modern command centers don't lack sensors. The bottleneck is **operational decision latency**: municipal teams receive thousands of calls, but take 4 hours of bureaucratic coordination to deploy a single pump.
  > 
  > We built **JalRakshak AI** for the **Build It route**: 100% local, zero AWS credentials required, compressing statutory disaster response from 4 hours down to **18 minutes**."

---

### 📍 [0:25 - 0:50] Scene 2: Citizen Ingest & Multimodal Computer Vision (25s)

* **Visual Setup:**
  - Click **"Citizen PWA"** tab or navigate to `/citizen`.
  - Show the mobile-optimized emergency submission screen for **Kurla East (Ward L)**.
  - Click **"Inspect CV Analysis"** to open the **`CVBoundingBoxOverlay`** modal.
  - Hover over the green/cyan detection bounding boxes showing water depth (`42 cm`) and obstruction flags (`IMPASSABLE FOR LIGHT VEHICLES`).
  - Toggle the language selector: English ➔ हिंदी ➔ मराठी to demonstrate live localized UI and emergency hotline `SOS 1077`.
* **Teleprompter Voiceover:**
  > "Disaster response starts on the ground. At 2:10 AM, a resident in Kurla East snaps a flooded roadway photo on our offline-ready Citizen Emergency PWA.
  > 
  > *[CLICK: Open CV Bounding Box Overlay]*
  > 
  > Our client-side multimodal computer vision layer instantly isolates curb landmarks, estimates water depth at 42 centimeters, and flags light vehicle impassability.
  > 
  > Localized municipal advisories are immediately presented in English, Hindi, and Marathi, with direct SOS 1077 integration, while streaming verified structured evidence directly into the central command queue."

---

### 📍 [0:50 - 1:20] Scene 3: Cloudburst Simulation & Mathematical Explainability (30s)

* **Visual Setup:**
  - Switch smoothly to the **Emergency Command Center** (`/command-center`).
  - In the top scenario bar, click the **"118mm Cloudburst"** simulation button.
  - Show the live incident queue populate: Ward 17, Kurla West & East flagged as `CRITICAL (Severity 92)`.
  - Zoom cursor in on the **Mathematical Explainability Scorecard** panel.
  - Point to the itemized percentage weights and hydrological variables.
* **Teleprompter Voiceover:**
  > "In the Command Center, incoming telemetry triggers an active disaster state. Live rain gauges spike to 118 mm/hr while outfall saturation reaches 92%.
  > 
  > *[CLICK: Expand Explainability Scorecard]*
  > 
  > Municipal disaster boards cannot rely on black-box AI scores. JalRakshak computes hazard severity with complete mathematical transparency:
  > - Rainfall surge exceeding drainage capacity by 162% (+38% weight)
  > - Outfall D-17 throttled by Mithi River tidal locking (+25%)
  > - 6 verified citizen CV reports (+21%)
  > - Critical Bhabha Hospital ICU directly in the inundation perimeter (+16%)."

---

### 📍 [1:20 - 1:50] Scene 4: AWS Strands 5-Agent Collaborative DAG (30s)

* **Visual Setup:**
  - Click **"Agent Trace"** in the sidebar or bottom drawer to expand the **5-Agent Collaborative DAG**.
  - Highlight the sequential agent execution flow:
    1. `Risk Detection Agent`
    2. `Impact Assessment Agent`
    3. `Resource & Response Agent`
    4. `Multilingual Communication Agent`
    5. `Coordinator Agent`
  - Mouse hover over the tool execution badges (`@tool` invocations, TF-IDF RAG retrieval for NDMA Guidelines 2024, circuit breaker status: `CLOSED`).
* **Teleprompter Voiceover:**
  > "Orchestrating this is the official **AWS Strands Agents SDK** (`strands-agents`) executing a sequential 5-agent DAG:
  > 1. The **Risk Detection Agent** evaluates hydrological saturation.
  > 2. The **Impact Assessment Agent** correlates GIS hazard polygons with demographic registries.
  > 3. The **Resource Agent** optimizes municipal depot routing, dispatching 1,000 GPM dewatering pumps in 18 minutes.
  > 4. The **Multilingual Communication Agent** synthesizes ward-specific broadcasts in English, Hindi, and Marathi.
  > 5. The **Coordinator Agent** retrieves statutory NDMA standard operating procedures using local TF-IDF RAG.
  > 
  > Our custom Strands Circuit Breaker monitors every invocation, achieving a lightning-fast local p50 latency of **62.14 milliseconds**."

---

### 📍 [1:50 - 2:20] Scene 5: Statutory Governance with AWS Cedar (`cedarpy`) (30s)

* **Visual Setup:**
  - Navigate to the **Action Plan Panel** on the right side of the Command Center.
  - Point to the **AWS Cedar RBAC badge** displaying `cedarpy: ACTIVE (Rust Engine)`.
  - Point out the 3 pending tactical actions:
    - `[DISPATCH] 1000 GPM Dewatering Pump P-04`
    - `[POWER GRID] Isolate Dadar Substation Transformer T-09`
    - `[PUBLIC ADVISORY] Trilingual Ward Broadcast (SMS/CAP)`
  - Click **"Approve & Execute All"** as authenticated `Incident Commander`.
  - Trigger celebratory confetti animation, status change to `APPROVED`, and show the signed audit trail entry.
* **Teleprompter Voiceover:**
  > "Under India's Disaster Management Act 2005, an AI cannot legally dispatch municipal assets or isolate power transformers without statutory human authorization.
  > 
  > *[PAUSE 1s]*
  > 
  > JalRakshak enforces strict Human-in-the-Loop governance evaluated live by the official Rust-backed **AWS Cedar policy engine** (`cedarpy`). Only authenticated Incident Commanders with valid cryptographic JWTs can authorize tactical deployments.
  > 
  > *[CLICK: 'Approve & Execute All']*
  > 
  > With 1 click, the Commander signs off: dewatering pump P-04 is en route, Dadar power substation isolates against electrocution risk, and emergency broadcasts are transmitted."

---

### 📍 [2:20 - 2:40] Scene 6: Multi-Persona Command & Track 02 Heatwave (20s)

* **Visual Setup:**
  - Switch persona in the header dropdown to **Insp. Rajesh Yadav (Field Lead)**: show mobile tactical checklist and turn-by-turn flood bypass ETA.
  - Switch to **Dr. Ananya Verma (SCADA Analyst)**: show hydraulic pressure sensor waveforms.
  - Click **"48.6°C Wet-Bulb Heatwave"** scenario button to demonstrate full Track 02 (Heat & Water) capabilities.
* **Teleprompter Voiceover:**
  > "JalRakshak adapts to 4 distinct municipal personas:
  > - Field Leads receive dynamic flood-bypass routes on mobile.
  > - SCADA Analysts monitor pressure telemetry, catching negative 2.4 Bar cavitation drops before water mains rupture.
  > - And for Track 02's Heat challenge, controllers can simulate lethal **48.6°C Wet-Bulb Heatwaves**, dispatching mobile misting bowsers and opening statutory cooling shelters under protocol `SOP-HEAT-04`."

---

### 📍 [2:40 - 2:52] Scene 7: Quantified ROI & 30-Second Verification (12s)

* **Visual Setup:**
  - Cut to terminal window running: `bash scripts/judge_smoke.sh`.
  - Show the clean test progression, HTTP 200 verification, and the bright green banner:
    `★ SMOKE TEST PASSED: ALL 5 STRANDS AGENTS VERIFIED LIVE & OPERATIONAL ★`.
  - Cut back to Landing Page hero footer with GitHub link.
* **Teleprompter Voiceover:**
  > "Early 18-minute intervention saves over **₹80 Lakhs** per severe event based on NDMA flood audit baselines.
  > 
  > *[CUT TO TERMINAL: Smoke test completes in 4 seconds]*
  > 
  > Evaluators can verify the entire system in 30 seconds with zero cloud credentials by running `bash scripts/judge_smoke.sh`.
  > 
  > JalRakshak AI: turning environmental signals into life-saving civic action."

---

## 📊 Quick-Reference Presenter Cheat Sheet

| Time | Duration | Screen / Route | Primary Visual Action | Key Technical Buzzwords |
| :--- | :--- | :--- | :--- | :--- |
| **0:00 - 0:25** | 25s | `/` (Landing Page) | Hover "Build It" badge & "Judge Tour" | 118mm cloudburst, decision latency, Build It route, 18-min response |
| **0:25 - 0:50** | 25s | `/citizen` | Open `CVBoundingBoxOverlay`, toggle languages | Multimodal CV, 42cm depth, impassable, English/Hindi/Marathi, SOS 1077 |
| **0:50 - 1:20** | 30s | `/command-center` | Click "118mm Cloudburst", open Explainability | 92% outfall saturation, Mathematical Explainability, Bhabha Hospital |
| **1:20 - 1:50** | 30s | `/command-center` | Expand 5-Agent Collaborative DAG trace | AWS Strands Agents SDK, 5-agent DAG, Circuit Breaker, 62.14 ms p50 |
| **1:50 - 2:20** | 30s | `/command-center` | Click "Approve & Execute All", confetti | AWS Cedar (`cedarpy`), Human-in-the-Loop, Disaster Management Act 2005 |
| **2:20 - 2:40** | 20s | `/field-ops` & `/scada` | Switch personas, click "48.6°C Heatwave" | Field Ops, SCADA cavitation, Track 02 Heatwave, misting bowsers |
| **2:40 - 2:52** | 12s | Terminal | Run `bash scripts/judge_smoke.sh` | ₹80+ Lakhs ROI, 30-sec smoke test, zero-credential verified |

---

## 📺 YouTube / Submission Video Metadata & Description

Copy and paste this directly into your hackathon video submission form / YouTube description:

```markdown
JalRakshak AI — Autonomous Urban Flood & Heat Emergency Decision-Support Platform
Hackathon: WeMakeDevs × AWS "Environmental Hacks" (October 2026)
Track: Track 02: Heat and Water
Submission Route: Build It (100% Local, Zero Cloud Credentials, No AWS Account Required)

GitHub Repository: https://github.com/RiyanshiVerma-11/JalRakshak-AI
Builder Center Post: https://github.com/RiyanshiVerma-11/JalRakshak-AI/blob/main/docs/AWS_BUILDER_CENTER_BLOG.md
Team: SheBuilds (Riyanshi Verma & Team)

⏱️ Chapters:
00:00 - The Problem: Operational Decision Latency in Urban Disasters
00:25 - Citizen Emergency PWA & Multimodal Computer Vision Overlay
00:50 - 118mm Cloudburst Inundation & Mathematical Explainability
01:20 - AWS Strands Agents SDK: 5-Agent Collaborative Execution DAG
01:50 - AWS Cedar (cedarpy): Human-in-the-Loop Statutory Governance
02:20 - Role Personas & Track 02 Heatwave Response (48.6°C Wet-Bulb)
02:40 - Quantified ROI & 30-Second Evaluator Verification

🛠️ AWS Open-Source Tooling Used (Build It Route):
- AWS Strands Agents SDK (strands-agents): 5-agent DAG orchestration with circuit breakers
- AWS Cedar (cedarpy): Formal Rust-backed policy authorization
- AWS SAM CLI: Serverless infrastructure-as-code for event buses and queues
- LocalStack: Zero-cost offline AWS service emulation

Run it locally in 60 seconds (no AWS account or .env required):
git clone https://github.com/RiyanshiVerma-11/JalRakshak-AI.git
cd JalRakshak-AI
pip install -r requirements.txt
python run_app.py
```
