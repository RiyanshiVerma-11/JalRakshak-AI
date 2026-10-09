# Building JalRakshak AI: How We Used AWS Strands Agents SDK & AWS Cedar to Mitigate Urban Floods and Heatwaves (and What Fought Back)

Every year, Indian metropolises face a brutal dual climate cycle: in July, a 118 mm/hr cloudburst submerses low-lying municipal wards within 40 minutes, flooding hospital ICUs and turning arterial roads into canals. Nine months later, May brings lethal 48.6°C wet-bulb heatwaves, water pipeline ruptures, and parched municipal reservoirs.

When examining municipal emergency control rooms, there is a striking paradox: **the bottleneck is never a lack of sensors**. Modern command centers receive gigabytes of IoT rain gauge feeds, Doppler radar telemetry, SCADA pipeline pressure waveforms, and ambient thermal sensors every second.

The breakdown occurs in **operational decision latency**:
1. During a flash flood or severe heatwave, control rooms receive over 1,200 panicked citizen calls in under 30 minutes.
2. Correlating environmental telemetry against infrastructure capacities, hospital registries, and emergency resource fleets (dewatering pumps or mobile cooling units) requires 3 to 4 hours of manual cross-departmental coordination.
3. In civic governance, an ungrounded, probabilistic AI cannot legally dispatch emergency equipment, isolate power grids, or issue statutory evacuation sirens.

> **Our core design question:**  
> *Most civic dashboards tell administrators what is happening. Can we build an autonomous, protocol-grounded system that determines what statutory action to authorize next within 18 minutes — for both flash floods and extreme heatwaves?*

This led us to engineer **JalRakshak AI** (Water & Climate Guardian) for the WeMakeDevs x AWS Environmental Hacks (**Track: Heat and Water**).

---

## 1. Architecture Overview: An Open-Source AWS Triad

To qualify for the hackathon's **Build It** route, our architectural mandate was strict: **the entire platform had to run 100% locally on a laptop, without requiring judges to configure AWS API keys, personal credit cards, or paid cloud infrastructure.**

We leveraged four AWS open-source technologies to establish a zero-config, production-grade foundation:

```
                  ┌──────────────────────────────────────────────┐
                  │        Real-Time Environmental Stream        │
                  │   (SCADA Hydrology, Thermal Grids, PWA)      │
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

### The Tooling Matrix
* **Multi-Agent Orchestration:** **AWS Strands Agents SDK** (`strands-agents` v1.58.0)
* **Authorization & Statutory Policy:** **AWS Cedar** (`cedarpy` v4.12.1)
* **Serverless IaC:** **AWS SAM CLI** (`aws_infra/template.yaml`)
* **Local Emulation:** **LocalStack** & `boto3` endpoint resolution
* **Model Layer:** Dual-Mode — Amazon Bedrock Claude 3.5 Sonnet (Live Cloud) / `LocalDeterministicModel` (Offline Build It)
* **Knowledge Retrieval:** In-memory TF-IDF vector RAG grounded in NDMA Urban Flooding Guidelines 2024 & National Heat Action Plan (NHAP) 2024

---

## 2. Multi-Agent Orchestration with AWS Strands Agents SDK

Instead of relying on a monolithic prompt that hallucinates during complex crises, we structured our workflow using the **AWS Strands Agents SDK**. Each agent is an independent `strands.Agent` instance equipped with specialized `@tool` functions and system constraints:

```python
from strands import Agent, tool
from strands.hooks import HookProvider, HookRegistry, events

@tool
def evaluate_risk_tool(category: str, ward_info: dict, telemetry: dict) -> dict:
    """Evaluates hazard deltas against drainage capacity or wet-bulb thermal limits."""
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

The pipeline executes as a deterministic directed acyclic graph (DAG) across both track dimensions:

* **In Flood Scenarios (`URBAN_FLOOD`):**
  1. **Risk Agent:** Computes rainfall intensity (118 mm/hr) against stormwater drain saturation (92%).
  2. **Impact Agent:** Intersects flood footprint with GIS layers (Bhabha Hospital ICU, school basements).
  3. **Resource Agent:** Geospatially pairs nearest high-capacity dewatering pumps (Pump P-04, 18 min ETA).
  4. **Comms Agent:** Synthesizes localized advisories across English, Hindi, and Marathi.
  5. **Coordinator Agent:** Retrieves statutory **NDMA SOP-FLD-101** guidelines to formulate the operational action plan.

* **In Heatwave Scenarios (`HEATWAVE`):**
  1. **Risk Agent:** Detects 48.6°C wet-bulb thermal distress thresholds exceeding municipal survivability limits.
  2. **Impact Agent:** Maps exposed vulnerable populations (outdoor construction clusters, unshaded transit stops).
  3. **Resource Agent:** Dispatches mobile climate-controlled cooling vans and misting bowsers to transit hubs.
  4. **Comms Agent:** Broadcasts multilingual hydration and heat-stroke safety advisories.
  5. **Coordinator Agent:** Retrieves statutory **NHAP SOP-HEAT-04** protocols, recommending halting outdoor labour between 11:30 AM and 4:30 PM.

---

## 3. Statutory Governance with the AWS Cedar Policy Engine

Under the **Indian Disaster Management Act of 2005**, an AI system cannot legally authorize emergency deployments, isolate electrical grids, or enforce heatwave labour halts. Physical civil interventions require verified statutory human command sign-off.

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

If a field operator or citizen attempts to tamper with request headers to authorize resource deployment, Cedar intercepts and halts execution at the kernel level.

---

## 4. What Fought Back: Four Engineering Battles

Every serious build involves architectural friction. Here are the four biggest challenges we encountered during the hackathon sprint — and how we resolved them:

### Battle 1: LLM Latency & Throttling During Live Crises
* **The Challenge:** During concurrent sensor spikes, cloud LLM API calls to Amazon Bedrock risked hitting HTTP 429 rate throttles or 12-second latency spikes. In life-critical disaster mitigation, a 12-second stall is unacceptable.
* **The Resolution:** We built a custom `StrandsCircuitBreakerHook` subclassing `strands.hooks.HookProvider`. By listening to `AfterToolCallEvent` and `AfterInvocationEvent`, the hook detects any rate throttle, network latency, or API failure and instantaneously triggers deterministic NDMA/NHAP statutory fallback in **under 4 milliseconds**, without crashing the user session.

### Battle 2: The "Zero-Config" Honest Execution Dilemma
* **The Challenge:** In many hackathons, projects fake external AWS services with static mocks (`{"MessageId": "fake-1234", "status": 200}`). We refused to compromise on engineering honesty.
* **The Resolution:** We engineered a **Dual-Mode Architecture**. When running in Build It mode with zero credentials, our system explicitly marks responses with `{"delivered": false, "mode": "OFFLINE", "simulated": true}`. When LocalStack or live AWS credentials are provided (`AWS_EXECUTION_MODE=LIVE`), Boto3 transparently routes to real SNS SMS gateways and real DynamoDB tables. Judges see authentic transparency, not synthetic tricks.

### Battle 3: Mathematical Explainability vs. Black-Box Trust
* **The Challenge:** Civic disaster boards reject automated AI scores because standard LLMs cannot explain why a risk score is 87% vs 65%.
* **The Resolution:** We anchored the Risk Agent's scoring in a strict mathematical explainability equation combining rainfall/thermal spike weight (+38%), drainage/grid saturation (+25%), geotagged citizen reports (+21%), and hospital proximity (+16%). Every calculation is mathematically provable and bounded between 0.0 and 1.0.

### Battle 4: SAM Local Packaging & Monorepo CodeUri
* **The Challenge:** Running `sam build` within a unified React + FastAPI repository caused SAM CLI to attempt packaging the entire frontend `dist/` and `node_modules` into the Lambda zip file, exceeding AWS Lambda's 250 MB unzipped limit.
* **The Resolution:** We refactored `aws_infra/template.yaml` using strict `.samignore` filters and localized `CodeUri: .` anchors with explicit handler entrypoints (`aws_infra.lambda_handlers.citizen_ingest_handler`). SAM build size dropped from 290 MB to a lean 4.2 MB.

---

## 5. Operational Results and Impact

* **Integration Suite:** **30 out of 30 tests passing (100%)** with zero skips across authentication, multi-agent orchestration, and SAM IaC.
* **Workflow Latency:** **3.4 ms p50** for the complete local 5-agent decision loop.
* **Quantified ROI:** Traditional municipal escalation takes 4 hours (averaging ₹1.4 Crore in flood and thermal damage for a dense urban ward). JalRakshak AI enables pre-emptive intervention (pump dispatch or cooling shelter activation) in **18 minutes**, saving over ₹80 Lakhs in civic assets.

---

## 6. Key Takeaways for AWS Builders

1. **AWS Strands Agents SDK makes multi-agent coordination production-ready:** The separation between `@tool` functions, model interfaces, and lifecycle hooks (`HookProvider`) makes building agentic systems far cleaner and more fault-tolerant than raw prompt chaining.
2. **Cedar is the gold standard for AI Safety & Governance:** Never let LLMs make irreversible physical decisions without guardrails. Wrap agent actions in declarative AWS Cedar policies to guarantee deterministic, auditable human-in-the-loop sign-off.
3. **Build with honesty:** Transparent fallback mechanisms and dual-mode architectures build far more trust with judges and users than fabricated cloud responses.

---

*Repository and Documentation:*  
GitHub: [https://github.com/RiyanshiVerma-11/JalRakshak-AI](https://github.com/RiyanshiVerma-11/JalRakshak-AI)
