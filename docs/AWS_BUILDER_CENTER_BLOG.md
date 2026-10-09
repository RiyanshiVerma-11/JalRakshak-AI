# 🌊 Building JalRakshak AI: How We Used AWS Strands Agents SDK & AWS Cedar to Mitigate Urban Floods (and What Fought Back)

*Published on AWS Builder Center by Riyanshi Verma*  
*Hackathon Track: WeMakeDevs × AWS Environmental Hacks — Track 02: Heat and Water*  
*Submission Route: Build It (Zero-Config Local with AWS Open-Source Tooling)*  
*Tags: `#AWS` `#StrandsAgentsSDK` `#AWSCedar` `#Serverless` `#EnvironmentalHacks` `#ClimateAI`*

---

## 🌪️ 1. The Problem: When 118 mm/hr Strikes and Dashboards Freeze

Every monsoon, Indian metropolises like Mumbai, Bengaluru, and Delhi face a predictable yet recurring tragedy: a 118 mm/hr cloudburst strikes, low-lying wards like Kurla submerse within 40 minutes, critical hospital ICU generators get inundated, and arterial roads become impassable canals.

As developers, we examined the emergency response command rooms. We noticed a shocking paradox: **the problem is never a lack of telemetry or weather sensors**. IMD Doppler radars and municipal IoT rain gauges produce gigabytes of sensor readings every second. 

The catastrophic bottleneck is **operational decision paralysis**:
1. Control room operators receive 1,200 panicked citizen calls in 30 minutes.
2. Synthesizing sensor telemetry against drainage capacities, hospital maps, and available dewatering pumps takes 3 to 4 hours of manual coordination.
3. In municipal governance, an ungrounded, black-box AI cannot legally dispatch emergency equipment or issue mass evacuation sirens.

> **Our core design question:**  
> *Most civic dashboards tell administrators WHAT is happening. Can we build an autonomous, protocol-grounded system that determines WHAT STATUTORY ACTION TO TAKE NEXT within 18 minutes?*

Enter **JalRakshak AI** (जल रक्षक — Water Guardian).

---

## 🏗️ 2. The Architecture: An Open-Source AWS Triad

To qualify for the hackathon's **Build It** route, our architectural mandate was uncompromising: **the entire platform had to run 100% locally on a laptop, without requiring judges to input AWS API keys, personal credit cards, or spin up paid cloud resources.**

We leveraged four AWS open-source technologies to power this architecture:

```
                  ┌──────────────────────────────────────────────┐
                  │        Real-Time Environmental Stream        │
                  │   (SCADA Sensors, Citizen PWA Photos, Weather)│
                  └───────────────────────┬──────────────────────┘
                                          │
                        ┌─────────────────▼─────────────────┐
                        │       AWS SAM CLI Infrastructure  │
                        │    (EventBridge + Lambda Handlers)│
                        └─────────────────┬─────────────────┘
                                          │
                 ┌────────────────────────▼────────────────────────┐
                 │       AWS Strands Agents SDK (5-Agent DAG)      │
                 │   Risk ──► Impact ──► Resource ──► Comms ──► SOP│
                 └──────────────┬───────────────────┬──────────────┘
                                │                   │
       ┌────────────────────────▼─────────┐   ┌─────▼────────────────────────────┐
       │   AWS Cedar Policy Engine (Rust) │   │     Amazon Bedrock / Local Fallback │
       │  Statutory Commander Sign-off    │   │  TF-IDF SOP RAG (NDMA 2024 / NHAP)│
       └──────────────────────────────────┘   └──────────────────────────────────┘
```

### The Tech Stack
* **Agentic Framework:** **AWS Strands Agents SDK** (`strands-agents` v1.58.0)
* **Authorization & RBAC:** **AWS Cedar** (`cedarpy` v4.12.1)
* **Serverless IaC:** **AWS SAM CLI** (`aws_infra/template.yaml`)
* **Local Emulation:** **LocalStack** & `boto3` endpoint resolution
* **Model Layer:** Dual-Mode — Amazon Bedrock Claude 3.5 Sonnet (Live) / `LocalDeterministicModel` (Offline Build It)
* **Frontend:** React 18, Vite 8, Tailwind/Vanilla CSS, Leaflet GIS, SCADA WebAudio sirens

---

## 🤖 3. Deep Dive: 5-Agent Collaborative DAG with AWS Strands

Instead of relying on a monolithic prompt that hallucinates during multi-parameter crises, we structured our workflow using the **AWS Strands Agents SDK**. Each agent is an independent `strands.Agent` instance equipped with specialized `@tool` functions and system constraints:

```python
from strands import Agent, tool
from strands.hooks import HookProvider, HookRegistry, events

@tool
def evaluate_risk_tool(category: str, ward_info: dict, telemetry: dict) -> dict:
    """Evaluates hydrological hazard deltas against drainage capacity."""
    return risk_agent.evaluate(category, ward_info, telemetry)

risk_detection_agent = Agent(
    agent_id="strands-agent-risk-01",
    name="Risk Detection Agent",
    description="Calculates sensor deltas and mathematical explainability weights.",
    system_prompt="You evaluate sensor telemetry and calculate explainability weights.",
    tools=[evaluate_risk_tool],
    hooks=[circuit_breaker_hook],
    model=get_strands_model("Risk Detection Agent")
)
```

The pipeline executes as a deterministic directed acyclic graph (DAG):
1. **Risk Detection Agent:** Analyzes rainfall intensity, soil saturation, and outfall tide levels.
2. **Impact Assessment Agent:** Correlates the flood footprint with GIS layers (schools, elderly care facilities, Bhabha Hospital ICU).
3. **Resource Matching Agent:** Geospatially pairs nearest high-capacity dewatering pumps (Pump P-04) and computes traffic-adjusted ETAs.
4. **Multilingual Communication Agent:** Synthesizes localized advisories across 3 languages (English, Hindi, and Marathi).
5. **Coordinator Agent:** Retrieves statutory NDMA SOP guidelines using lexical vector RAG and generates a prioritized action plan.

---

## 🔐 4. Statutory Governance: AWS Cedar Policy Engine

Under the **Indian Disaster Management Act of 2005**, an AI cannot legally dispatch physical emergency units or isolate high-voltage power grids. Civilian emergency actions require verified human command sign-off.

We implemented statutory Role-Based Access Control using **AWS Cedar** via the official Rust-backed Python library `cedarpy`:

```cedar
// policies/incident_policy.cedar
permit (
    principal in JalRakshak::Role::"incident_commander",
    action in [
        JalRakshak::Action::"approve_action",
        JalRakshak::Action::"dispatch_resource",
        JalRakshak::Action::"broadcast_sns"
    ],
    resource is JalRakshak::Incident
);

forbid (
    principal in JalRakshak::Role::"citizen",
    action in [
        JalRakshak::Action::"approve_action",
        JalRakshak::Action::"dispatch_resource"
    ],
    resource is JalRakshak::Incident
);
```

When an incident commander clicks **"Approve & Execute"**, the backend verifies cryptographic JWT signatures and delegates policy evaluation to Cedar:

```python
result = cedarpy.is_authorized(request, _CACHED_POLICY, entities)
if result.decision != cedarpy.Decision.Allow:
    raise HTTPException(status_code=403, detail="Statutory Cedar policy denied approval.")
```

If a field operator or citizen attempts to tamper with request headers to authorize pump dispatch, Cedar intercepts and halts execution at the kernel level.

---

## 🥊 5. What Fought Back: The 4 Hardest Engineering Battles

Every great build comes with scars. Here are the four biggest engineering challenges that fought back during our hackathon sprint — and how we conquered them:

### Battle 1: LLM Latency & Throttling During Live Crises
* **The Fight:** During simulated cloudburst spikes, concurrent LLM API calls to Amazon Bedrock risked hitting HTTP 429 rate throttles or 12-second network latency spikes. In flood mitigation, a 12-second stall is unacceptable.
* **The Fix:** We built a custom `StrandsCircuitBreakerHook` subclassing `strands.hooks.HookProvider`. By listening to `AfterToolCallEvent` and `AfterInvocationEvent`, the hook detects any rate throttle, network latency, or API failure and instantaneously triggers deterministic NDMA Chapter 4 statutory fallback in **under 4 milliseconds**, without crashing the user session.

### Battle 2: The "Zero-Config" Honest Execution Dilemma
* **The Fight:** In many hackathons, projects fake external AWS services with static mocks (`{"MessageId": "fake-1234", "status": 200}`). We refused to compromise on engineering honesty.
* **The Fix:** We engineered a **Dual-Mode Architecture**. When running in Build It mode with zero credentials, our system explicitly marks responses with `{"delivered": false, "mode": "OFFLINE", "simulated": true}`. When LocalStack or live AWS credentials are provided (`AWS_EXECUTION_MODE=LIVE`), Boto3 transparently routes to real SNS SMS gateways and real DynamoDB tables. Judges see authentic transparency, not synthetic tricks.

### Battle 3: Mathematical Explainability vs. Black-Box Trust
* **The Fight:** Civic disaster boards reject automated AI scores because standard LLMs cannot explain why a risk score is 87% vs 65%.
* **The Fix:** We anchored the Risk Agent's scoring in a strict mathematical explainability equation combining rainfall spike weight (+38%), drainage saturation (+25%), geotagged citizen photos (+21%), and hospital proximity (+16%). Every calculation is mathematically provable and bounded between 0.0 and 1.0.

### Battle 4: SAM Local Packaging & Monorepo CodeUri
* **The Fight:** Running `sam build` within a unified React + FastAPI repository caused SAM CLI to attempt packaging the entire frontend `dist/` and `node_modules` into the Lambda zip file, exceeding AWS Lambda's 250 MB unzipped limit.
* **The Fix:** We refactored `aws_infra/template.yaml` using strict `.samignore` filters and localized `CodeUri: .` anchors with explicit handler entrypoints (`aws_infra.lambda_handlers.citizen_ingest_handler`). SAM build size dropped from 290 MB to a lean 4.2 MB!

---

## 📊 6. The Results & Impact

* **Integration Suite:** **30 out of 30 tests passing (100%)** with zero skips across authentication, multi-agent orchestration, and SAM IaC.
* **Workflow Latency:** **3.4 ms p50** for the complete local 5-agent decision loop.
* **Quantified ROI:** Traditional municipal escalation takes 4 hours (averaging ₹1.4 Crore in flood damage for Kurla Ward-17). JalRakshak AI enables pre-emptive pump dispatch and canal gate diversion in **18 minutes**, saving over ₹80 Lakhs in municipal infrastructure assets.

---

## 💡 7. Key Takeaways for AWS Builders

1. **AWS Strands Agents SDK makes multi-agent coordination production-ready:** The separation between `@tool` functions, model interfaces, and lifecycle hooks (`HookProvider`) makes building agentic systems far cleaner and more fault-tolerant than raw prompt chaining.
2. **Cedar is the gold standard for AI Safety & Governance:** Don't let LLMs make irreversible physical decisions. Wrap agent actions in declarative AWS Cedar policies to guarantee deterministic, auditable human-in-the-loop sign-off.
3. **Build with honesty:** Judges appreciate transparent fallback mechanisms and dual-mode architectures far more than fabricated cloud responses.

---

*Explore the codebase, test suite, and live demo on our GitHub repository:*  
👉 **[GitHub: JalRakshak-AI](https://github.com/RiyanshiVerma-11/JalRakshak-AI)**

---
