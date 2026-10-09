# JalRakshak AI — 3-Minute Hackathon Demo Video Script

**Target Hackathon:** WeMakeDevs × AWS "Environmental Hacks"  
**Track:** Track 02: Heat and Water  
**Total Target Video Duration:** Exactly **2 minutes 50 seconds** (comfortably under the 3:00 hard ceiling)

---

## ⏱️ Video Timeline & Scene-by-Scene Script

### [0:00 - 0:30] Scene 1: The Hook & The Problem
* **Visual:** Open on the modern JalRakshak AI Landing Page / Command Center. Show title and subtitle: *"Turning real-time environmental signals and citizen reports into prioritized actions."*
* **Voiceover:**
  > "Every monsoon and summer in Indian metros like Mumbai, climate disasters hit with zero mercy. In 45 minutes, a 118 mm/hr cloudburst submerges critical hospital basements, while summer brings 48.6°C wet-bulb heatwaves.
  > 
  > The problem isn't a lack of sensors. It's an **operational decision bottleneck**: municipal control rooms receive thousands of calls, but take four hours of bureaucratic delays to dispatch a single pump.
  > 
  > Most platforms tell authorities *what* is happening. **JalRakshak AI tells them what statutory action to authorize next in real-time.**"

---

### [0:30 - 1:00] Scene 2: Live Inundation & Mathematical Explainability
* **Visual:** Click **"118mm Cloudburst"** in the top simulation bar. Live sensors spike across Kurla L-Ward. Point cursor to the **Explainability Scorecard** and the **GIS Inundation Contour Map**.
* **Voiceover:**
  > "Let's simulate a live 118 mm/hr cloudburst in Kurla. Instantly, our real-time telemetry stream flags critical danger.
  > 
  > Civic disaster boards cannot trust an unexplained black-box AI score. JalRakshak breaks down every risk calculation with 100% mathematical transparency:
  > - Rainfall spike exceeds drain capacity by 162% (+38% weight)
  > - Outfall D-17 throttled by Mithi River high tide (+25%)
  > - 6 geotagged citizen photos verified by computer vision (+21%)
  > - Bhabha Hospital 420-bed ICU directly in the inundation zone (+16%)."

---

### [1:00 - 1:40] Scene 3: The AWS Strands 5-Agent Collaborative DAG
* **Visual:** Open the bottom **Execution Drawer** or navigate to the **AWS Architecture / Strands DAG Visualizer** tab. Show all 5 agent nodes executing collaboratively.
* **Voiceover:**
  > "Under the hood, this is powered by the **AWS Strands Agents SDK** (`strands-agents`) running on Amazon Bedrock Claude 3.5 Sonnet:
  > 1. **Risk Detection Agent** computes sensor deltas and drainage capacity.
  > 2. **Impact Assessment Agent** correlates GIS hazard polygons with demographic databases.
  > 3. **Resource Allocation Agent** queries municipal depot inventories, assigning high-capacity Pump P-04 with an 18-minute ETA.
  > 4. **Multilingual Comms Agent** generates localized emergency alerts in English, Hindi, and Marathi.
  > 5. **Coordinator Agent** retrieves statutory NDMA standard operating procedures via vector RAG.
  > 
  > Our custom Strands Circuit Breaker monitors execution: local workflow latency benchmarked at **62.14 ms p50** (measured across 100 iterations in `docs/BENCHMARK.md`), backed by an embedded deterministic NDMA fallback if cloud APIs throttle."

---

### [1:40 - 2:15] Scene 4: Human-in-the-Loop & AWS Cedar Statutory Authorization
* **Visual:** Click **"Approve & Execute All"** in the Action Plan. Show confetti animation, status transitions to `APPROVED`, and the audit log record. Show the AWS Cedar RBAC badge.
* **Voiceover:**
  > "Under the Indian Disaster Management Act of 2005, an AI cannot legally sign off on civilian evacuations. 
  > 
  > JalRakshak enforces strict Human-in-the-Loop authorization evaluated by the genuine **AWS Cedar policy engine** (`cedarpy`). Only authenticated Incident Commanders with valid cryptographic JWTs can authorize physical deployments. Unauthorized roles receive an instant HTTP 403.
  > 
  > With 1 click, the Municipal Commander authorizes the action: Pump P-04 is dispatched, the Dadar power grid is isolated, and localized mass alerts are queued across Amazon SNS telecom gateways."

---

### [2:15 - 2:45] Scene 5: Multi-Role Personas — Field Ops & SCADA Hydrology
* **Visual:** Use 1-click persona switching: Switch to **Insp. Rajesh Yadav (Field Ops)** to show the tactical mission manifest, then to **Dr. Ananya Verma (Chief Hydrologist)** to show the SCADA Telemetry Console.
* **Voiceover:**
  > "JalRakshak empowers 4 distinct disaster management roles:
  > - **Field Operations Lead Insp. Rajesh Yadav** receives the tactical mobile manifest with real-time route ETAs and 1-tap pump status verification.
  > - **Chief Hydrologist Dr. Ananya Verma** monitors the SCADA telemetry console with live hydraulic pressure waveforms, detecting -2.4 Bar pipeline cavitation drops before mains burst.
  > - And for Track 02's Heat challenge, controllers can trigger the **48.6°C Wet-Bulb Heatwave** scenario, deploying mobile cooling vans and activating statutory protocol `SOP-HEAT-04`."

---

### [2:45 - 3:00] Scene 6: The ROI Clincher & Built on AWS
* **Visual:** Show the **What-If Inundation Recession Curve** comparing the 4-hour traditional lag vs. JalRakshak's rapid response, followed by the AWS architecture badge ribbon.
* **Voiceover:**
  > "The quantified impact: Traditional bureaucratic delays flood hospitals and cause ₹1.4 Crore in damage. JalRakshak AI enables pre-emptive intervention in 18 minutes, saving over ₹80 Lakhs and protecting critical lifelines.
  > 
  > Built natively on AWS with Strands Agents, Bedrock, EventBridge, DynamoDB, S3, SNS, SAM, and Cedar.
  > 
  > JalRakshak AI: turning environmental signals into life-saving action."

---

## 🎬 Recording Checklist & Pro-Tips for the Video
1. **Resolution:** Record at 1080p (1920x1080) at 60 fps.
2. **Audio:** Use crisp microphone audio; keep background music very soft (-24 dB).
3. **Pacing:** Speak with calm authority, matching the rapid visual transitions.
4. **Key Features to Highlight for Judges:**
   - Mention **AWS Strands Agents SDK** explicitly at 1:05.
   - Mention **AWS Cedar (`cedarpy`)** explicitly at 1:45.
   - Mention **AWS SAM (`aws_infra/template.yaml`)** and **EventBridge/DynamoDB**.
   - Show the **48.6°C Heatwave** button at 2:35 to cement the Track 02 Heat & Water fit.
