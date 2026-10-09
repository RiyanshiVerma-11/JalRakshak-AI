# Building JalRakshak AI: AWS Strands & Cedar for Floods and Heat (and What Fought Back)

**Track:** Heat and Water (Track 02) | **Route:** Build It (100% Local, Zero Cloud Credentials Required)  
**Team:** Team SheBuilds  
**Author:** [Riyanshi Verma](https://github.com/RiyanshiVerma-11) (Lead Developer & Systems Architect) & Team  
**Repository:** [https://github.com/RiyanshiVerma-11/JalRakshak-AI](https://github.com/RiyanshiVerma-11/JalRakshak-AI)  
**Hackathon:** WeMakeDevs × AWS "Environmental Hacks"  
**Tags:** `AWS`, `serverless`, `agents`, `disaster-management`, `sustainability`, `climate`, `open-source`

---

## The Crisis: Urban Disaster Decision Latency

Every year, Indian metropolises face a brutal dual climate cycle: in July, an intense 118 mm/hr cloudburst inundates low-lying municipal wards within 40 minutes, submerging hospital ICUs, tripping electrical substations, and turning arterial roadways into canals. Nine months later, May brings lethal 48.6°C wet-bulb heatwaves, water pipeline ruptures, and parched municipal reservoirs.

When examining municipal emergency control rooms during these disasters, there is a striking paradox: **the bottleneck is never a lack of sensors**. Modern command centers receive gigabytes of IoT rain gauge feeds, Doppler radar telemetry, SCADA pipeline pressure waveforms, and ambient thermal sensors every second.

The breakdown occurs in **operational decision latency**:
1. During a flash flood or severe heatwave, control rooms receive over 1,200 panicked citizen calls in under 30 minutes.
2. Correlating environmental telemetry against infrastructure capacities, hospital registries, and emergency resource fleets (1000 GPM dewatering pumps or mobile cooling vans) requires 3 to 4 hours of manual cross-departmental coordination.
3. In civic governance, an ungrounded, probabilistic AI cannot legally dispatch emergency equipment, isolate power grids, or issue statutory evacuation sirens under the **Disaster Management Act 2005**.

> **Our core design question:**  
> *Most civic dashboards tell administrators what is happening. Can we build an autonomous, protocol-grounded system that determines what statutory action to authorize next within 18 minutes — for both flash floods and extreme heatwaves — running completely offline without cloud dependencies?*

This led **Team SheBuilds** to engineer **JalRakshak AI** (Water & Climate Guardian) for the WeMakeDevs × AWS Environmental Hacks (**Track 02: Heat and Water — Build It Route**).

---

## 1. Architecture Overview: The AWS Open-Source Triad

To qualify for the hackathon's **Build It** route, our architectural mandate was absolute: **the entire platform must run 100% locally on a developer laptop, without requiring judges to create an AWS account, configure API keys, enter credit cards, or incur cloud bills.**

JalRakshak AI is built squarely on four open-source foundations from the AWS ecosystem:
* **[AWS Strands Agents SDK](https://github.com/awslabs/strands-agents):** Drives our deterministic 5-agent DAG workflow, `@tool` wrapper system, and rate-limit circuit-breaker hook.
* **[AWS Cedar Policy Engine](https://github.com/cedar-policy/cedar):** Powers statutory RBAC policy compilation and mathematical authorization decisions via official `cedarpy` bindings.
* **[AWS SAM CLI](https://github.com/aws/aws-sam-cli):** Validates serverless templates (`sam validate`) and packages portable Lambda container images without manual zip scripts.
* **[LocalStack](https://github.com/localstack/localstack):** Provides zero-cost offline emulation for EventBridge, DynamoDB, SNS, and S3 in `docker-compose.local.yml`.

```text
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
       ┌────────────────────────▼─────────┐   ┌─────▼──────────────────────────────────┐
       │   AWS Cedar Policy Engine (Rust) │   │     Amazon Bedrock / Local Fallback    │
       │  Statutory Commander Sign-off    │   │  TF-IDF SOP RAG (NDMA 2024 / NHAP)     │
       └──────────────────────────────────┘   └────────────────────────────────────────┘
```

![Figure 1: AWS Strands Architecture](https://raw.githubusercontent.com/RiyanshiVerma-11/JalRakshak-AI/main/docs/screenshots/strands_dag.jpg)

*Figure 1: AWS Strands Agents SDK Architecture — Visualizing the 5-Agent DAG sequence and circuit-breaker lifecycle.*

---

## 2. Build It Route: What Actually Runs on a Laptop

In accordance with the Build It route specifications:

```bash
# Three-command quickstart (Zero config, no .env required)
git clone https://github.com/RiyanshiVerma-11/JalRakshak-AI.git
pip install -r requirements.txt
python run_app.py
```

### The Architectural Truth Table: Real vs. Simulated

| Component | What Runs For Real on Your Laptop | What is Honestly Simulated |
| :--- | :--- | :--- |
| **AWS Strands Agents SDK** | Genuine `strands.Agent` loop, `@tool` invocation cycles, and `StrandsCircuitBreakerHook` lifecycle | In OFFLINE mode, LLM inference is fulfilled locally by `LocalDeterministicModel`; real Bedrock calls run when `AWS_EXECUTION_MODE=LIVE`. |
| **AWS Cedar Policy Engine** | Real Rust-backed Cedar policy evaluations via `cedarpy` against `policies/incident_policy.cedar` | None. Every permit/forbid decision is computed live by the Cedar engine. |
| **AWS SAM CLI** | Real SAM template validation (`sam validate`) and artifact build (`sam build`) | Container emulation (`sam local invoke`) requires Docker Desktop on the host. Direct handlers are tested via pytest. |
| **Incident State & Storage** | Real in-memory state store with thread locking, query indexing, and JSON serialization | DynamoDB network calls are skipped in offline mode (`simulated: true`), connecting live when credentials exist. |
| **Emergency Notifications** | Real alert generation in 3 languages (English, Hindi, Marathi) with SMS/WhatsApp payloads | Real SNS network publishing requires AWS credentials; offline mode queues payloads with `simulated: true`. |
| **Multimodal Vision** | Real computer vision feature extraction on actual uploaded image bytes via Pillow/NumPy | AWS Rekognition API call is bypassed offline in favor of local computer vision feature analysis. |

### Example tool inventory (captured on the author's machine)

Your own `/api/health -> build_it_tools` may report different versions and FALLBACK states depending on your host.

```json
[
  {
    "tool": "AWS Strands Agents SDK",
    "route": "Build It",
    "category": "Agents and AI",
    "status": "ACTIVE",
    "evidence": "strands-agents v1.58.0 | 5-agent DAG orchestrator"
  },
  {
    "tool": "AWS Cedar",
    "route": "Build It",
    "category": "Auth and policy",
    "status": "ACTIVE",
    "evidence": "cedarpy v4.12.1 | Policy: policies/incident_policy.cedar"
  },
  {
    "tool": "AWS SAM CLI",
    "route": "Build It",
    "category": "Serverless IaC",
    "status": "ACTIVE",
    "evidence": "Template: aws_infra/template.yaml | SAM CLI: sam.exe"
  },
  {
    "tool": "LocalStack",
    "route": "Build It",
    "category": "Serverless Emulation",
    "status": "FALLBACK",
    "evidence": "Endpoint: OFFLINE mode (docker-compose.local.yml ready) | boto3 v1.43.83"
  }
]
```

---

## 3. Multi-Agent Orchestration with AWS Strands Agents SDK

Instead of relying on a fragile prompt chain, our workflow is powered by the **AWS Strands Agents SDK**. Each agent is an independent `strands.Agent` instance equipped with `@tool` functions:

```python
@tool
def evaluate_risk_tool(category: str, ward_info: dict, telemetry: dict) -> dict:
    """
    Strands Tool: Evaluates hydrological and meteorological hazard risk
    from real-time sensor streams and drainage capacities.
    """
    return risk_agent.evaluate(category, ward_info, telemetry)
```
*Source File:* [backend/agents/strands_workflow.py](https://github.com/RiyanshiVerma-11/JalRakshak-AI/blob/main/backend/agents/strands_workflow.py)

```python
risk_detection_agent = Agent(
    agent_id="strands-agent-risk-01",
    name="Risk Detection Agent",
    description="Evaluates sensor deltas, hydrological saturation, and calculates mathematical explainability scores.",
    system_prompt="You are Strands Risk Detection Agent for JalRakshak AI. You evaluate real-time sensor streams and determine hazard severity.",
    tools=[evaluate_risk_tool],
    hooks=[circuit_breaker_hook],
    model=get_strands_model("Risk Detection Agent")
)
```
*Source File:* [backend/agents/strands_workflow.py](https://github.com/RiyanshiVerma-11/JalRakshak-AI/blob/main/backend/agents/strands_workflow.py)

The 5 agents collaborate sequentially:
1. **Risk Detection Agent:** Evaluates sensor deltas against hydrological saturation.
2. **Impact Assessment Agent:** Correlates GIS perimeters with demographic registries and hospital ICUs.
3. **Resource & Response Agent:** Optimizes municipal asset allocation (pumps, misting bowsers, tankers).
4. **Multilingual Communication Agent:** Synthesizes localized warnings in English, Hindi, and Marathi.
5. **Coordinator Agent:** Queries statutory NDMA / CPHEEO SOP knowledge base to formulate the actionable plan.

---

## 4. Statutory Governance with AWS Cedar

Under the Indian Disaster Management Act 2005, an AI cannot legally dispatch municipal machinery or isolate transformers without statutory authorization. We enforce this through declarative policies evaluated by the official Rust-backed **AWS Cedar** engine (`cedarpy`):

```cedar
// 1. Municipal Incident Commander (Tier 1 Apex Command)
permit(
    principal in JalRakshak::Role::"incident_commander",
    action in [
        JalRakshak::Action::"read_incidents",
        JalRakshak::Action::"approve_action",
        JalRakshak::Action::"dispatch_resource",
        JalRakshak::Action::"broadcast_sns",
        JalRakshak::Action::"simulate_scenario"
    ],
    resource
);

// 5. Explicit Denial of Sensitive Command Actions to Citizens
forbid(
    principal in JalRakshak::Role::"citizen",
    action in [
        JalRakshak::Action::"approve_action",
        JalRakshak::Action::"dispatch_resource",
        JalRakshak::Action::"broadcast_sns"
    ],
    resource
);
```
*Source File:* [policies/incident_policy.cedar](https://github.com/RiyanshiVerma-11/JalRakshak-AI/blob/main/policies/incident_policy.cedar)

During evaluation, cryptographic JWT claims are extracted and validated directly by Cedar:

```python
    try:
        result = cedarpy.is_authorized(request, _CACHED_POLICY, entities)
        allowed = (str(result.decision) == "Decision.Allow" or result.decision == cedarpy.Decision.Allow)
        logger.info(f"[CEDAR AUTH] Engine: {engine} | Decision: {'ALLOW' if allowed else 'DENY'} | Role: {principal_role} | Action: {action}")
        return {
            "allowed": allowed,
            "engine": engine,
            "decision": str(result.decision),
            "policy_source": "policies/incident_policy.cedar"
        }
    except Exception as exc:
        logger.error(f"[CEDAR AUTH] Error during cedarpy evaluation: {exc}")
        return {"allowed": False, "engine": engine, "error": str(exc)}
```
*Source File:* [backend/auth/cedar_auth.py](https://github.com/RiyanshiVerma-11/JalRakshak-AI/blob/main/backend/auth/cedar_auth.py)

---

## 5. What Fought Back: Four Engineering Battles

### Battle 1: LLM Latency & Rate Throttling During Live Crises
- **The Challenge:** During concurrent rainfall spikes, cloud LLM APIs risk HTTP 429 throttling or multi-second latency spikes.
- **The Resolution:** We built `StrandsCircuitBreakerHook` subclassing `strands.hooks.HookProvider`. By listening to `AfterToolCallEvent` and `AfterInvocationEvent`, the hook detects rate throttling and immediately engages deterministic statutory NDMA Chapter 4 fallbacks without crashing the user session.

### Battle 2: The "Zero-Config" Honest Execution Dilemma
- **The Challenge:** Many hackathon submissions fake external cloud calls with deceptive mock IDs (`MessageId: fake-1234`).
- **The Resolution:** We implemented explicit runtime transparency. In offline Build It mode, payloads clearly declare `simulated: true` and `mode: "OFFLINE"`. Real boto3 client creation occurs only when valid credentials matching `^(AKIA|ASIA)[A-Z0-9]{16}$` are present.

### Battle 3: Mathematical Explainability vs. Black-Box Scoring
- **The Challenge:** Municipal disaster controllers reject ungrounded AI scores because standard LLMs cannot mathematically justify why an emergency is 87% vs 65%.
- **The Resolution:** We anchored the Risk Agent's scoring in a physical explainability equation combining rainfall/thermal spike deltas (+38%), drainage saturation (+25%), verified citizen photo reports (+21%), and hospital proximity (+16%), bounded deterministically between 0.0 and 1.0.

### Battle 4: SAM Packaging & Monorepo CodeUri
- **The Challenge:** Running `sam build` in a monorepo caused SAM CLI to try packaging the entire frontend `dist/` and `node_modules` into the Lambda bundle, exceeding AWS Lambda limits.
- **The Resolution:** We refactored `aws_infra/template.yaml` using strict `.samignore` rules and localized `CodeUri: .` anchors with explicit handlers (`lambda_handlers.strands_agent_orchestrator_handler` and `lambda_handlers.citizen_ingest_handler`).
- **What I'd Do Differently (Architectural Lesson):** Declare the strict serverless packaging boundary and `.samignore` filters before authoring the first handler. In a monorepo, packaging is an architectural contract, not a deployment afterthought when `sam build` fails.

---

## 6. Operational Results & Quantified Benchmarks

![Figure 2: JalRakshak AI Live Command Center](https://raw.githubusercontent.com/RiyanshiVerma-11/JalRakshak-AI/main/docs/screenshots/command_center.jpg)

*Figure 2: Live Command Center — Incident Triage, GIS Flood Contours, and Human-in-the-Loop Action Approval. Notice the Cedar RBAC badge and tactical dispatch approval buttons.*

![Figure 3: SCADA Hydrology Console](https://raw.githubusercontent.com/RiyanshiVerma-11/JalRakshak-AI/main/docs/screenshots/scada_telemetry.jpg)

*Figure 3: SCADA Hydrology Console — Real-Time Pipeline Pressure Waveforms & Drainage Outfall Saturation for Kurla Ward 17.*

### Reproducible Performance Benchmarks (Measured Empirical Data)

* **Command Executed:** `python tests/benchmark_strands.py 100`
* **Test Machine:** AMD64 Family 23 Model 104 Stepping 1 (12 logical cores), 7.3 GB RAM, Windows 10, Python 3.11.3
* **Full Documentation:** [docs/BENCHMARK.md](https://github.com/RiyanshiVerma-11/JalRakshak-AI/blob/main/docs/BENCHMARK.md)

| Metric | Measured Value | Notes & Context |
| :--- | :---: | :--- |
| **Iterations** | **100 runs** | 100 consecutive executions of the full 5-agent DAG |
| **p50 Latency (Median)** | **62.14 ms** | Full local 5-agent loop in ~62 ms p50 on 12-core host |
| **p95 Latency** | **82.51 ms** | High percentile under local background scheduler jitter |
| **Min Latency** | **57.74 ms** | Fastest complete 5-agent traversal |
| **Max Latency** | **127.34 ms** | Peak traversal latency |
| **Test Suite Status** | **Passing** | Integration, Cedar RBAC, Build It route, and SAM validation |
| **SAM Build Artifact** | **Built Succeeded** | `StrandsAgentOrchestratorLambda`, `CitizenReportIngestLambda` |

> **Host Variance & Latency Context:**  
> Latency is dominated by host scheduling and Python startup. Expect roughly 15-130 ms for the full local 5-agent loop depending on your machine. Rerun `python tests/benchmark_strands.py 100` to get your own figure; the script prints platform and Python version automatically.

### Quantified Economic ROI & Modelled Assumptions

* **Baseline Traditional Escalation:** 4 hours manual phone tree escalation.
* **JalRakshak AI Decision Window:** **18 minutes** from telemetry trigger to authorized tactical pump deployment.
* **Modelled Economic Impact:** Based on a modeled 118 mm/hr cloudburst in Ward 17 (Kurla East):
  - *Unmitigated Damage Baseline:* ₹1.4 Crore (computed from flood ingress into 3 ground-floor hospital wards @ ₹45L, 2 basement distribution transformer failures @ ₹55L, and arterial LBS Marg traffic gridlock loss @ ₹40L).
  - *Mitigated Damage with JalRakshak AI:* ₹60 Lakhs (early dewatering pump pre-deployment keeps flood depth under 25 cm, preventing hospital ICU ingress and electrical substation submergence).
  - *Net Modelled Civic Assets Protected:* **₹80+ Lakhs saved** per severe cloudburst event.

#### Sources & Assumptions (Illustrative Simulation Model)
* **Model Type:** Illustrative municipal damage and loss estimation model, calibrated against published NDMA Guidelines on Management of Urban Flooding (Chapter 3) and municipal post-monsoon flood audit baselines for high-vulnerability urban corridors (Mumbai Ward L / Kurla East).
* **Precipitation Baseline:** 118 mm/hr cloudburst sustained over 40 minutes during high-tide outfall locking.
* **Asset Exposure Assumptions:** ~40 ground-floor commercial units (LBS Marg) with ₹1.5 Lakhs average inventory loss; 2 distribution transformers requiring repair/replacement; and emergency contractor pump mobilization cost differential.
* **Intervention Delta:** Autonomous multi-agent coordination reduces municipal authorization latency from 4 hours to 18 minutes, preventing inundation from exceeding the 25 cm critical substation threshold.

---

## 7. Who Actually Uses This?

Judging criterion 3 asks whether someone outside the core engineering team can operate this solution. JalRakshak AI separates civic responsibilities across four distinct personas:

1. **Resident Citizen:** At 02:10 AM during an intense 118 mm/hr cloudburst, a resident in Kurla East snaps a photo of water overtopping sidewalks. The client-side computer vision layer instantly grades flood depth (42 cm) and flags road impassability.
2. **Chief Hydrologist & SCADA Analyst:** The telemetry pipeline correlates the citizen report with an active 118 mm/hr rainfall spike and 92% drainage outfall saturation.
3. **Municipal Incident Commander:** The Strands Coordinator synthesizes a statutory dispatch directive; the Commander reviews the plan in the Decision Room and signs off under AWS Cedar in one tap.
4. **Tactical Field Responder:** 1000 GPM dewatering pumps and rescue teams deploy to Ward 17 while automated trilingual (English, Hindi, Marathi) SMS warnings reach residents — all inside 18 minutes.

![Figure 4: Citizen Emergency PWA & Trilingual Alert](https://raw.githubusercontent.com/RiyanshiVerma-11/JalRakshak-AI/main/docs/screenshots/citizen_reporting.jpg)

*Figure 4: Citizen Emergency PWA — Live photo submission with `CVBoundingBoxOverlay` flood depth estimation (42 cm) and automated multilingual (EN/HI/MR) emergency alert broadcast.*

---

## 8. What I'd Build with AWS Credits Next

If granted production AWS Cloud Credits, we would scale JalRakshak AI from a laptop-tested architecture to citywide municipal infrastructure:

1. **Physical IoT River Inundation Gateways:** Ingesting solar-powered LoRaWAN ultrasonic water-level sensors deployed along the Mithi River directly into the Amazon EventBridge custom bus.
2. **Doppler Radar Nowcasting Ingestion:** Streaming IMD (India Meteorological Department) Doppler radar netCDF4 spatial grids through AWS Lambda 90 minutes before precipitation hits urban drainage basins.
3. **OpenSearch Serverless Semantic Retrieval:** Upgrading the TF-IDF SOP store to Amazon OpenSearch Serverless with multi-vector embeddings for complex multi-jurisdictional disaster manuals.
4. **Cross-Agency AWS Cedar Policy Federation:** Federating Cedar policy stores across Municipal Corporations, the National Disaster Response Force (NDRF), and Traffic Police for unified inter-agency sign-offs.

---

## 9. Try It Yourself

You can clone and run JalRakshak AI on your machine in 60 seconds with zero AWS configuration:

```bash
git clone https://github.com/RiyanshiVerma-11/JalRakshak-AI.git
cd JalRakshak-AI
pip install -r requirements.txt
python run_app.py
```

Then visit [http://localhost:8004](http://localhost:8004) to test the emergency command center, simulate cloudbursts, and evaluate the Cedar authorization engine.

### Verify It Yourself in 30 Seconds

To verify the complete 5-agent loop, health check, and simulation without touching a browser, run our automated smoke test:

```bash
bash scripts/judge_smoke.sh
```

*Expected Terminal Output:*
```text
======================================================================
★ SMOKE TEST PASSED: ALL 5 STRANDS AGENTS VERIFIED LIVE & OPERATIONAL ★
======================================================================
```
For step-by-step evaluator instructions, see the **[Judge Quickstart Guide](https://github.com/RiyanshiVerma-11/JalRakshak-AI/blob/main/docs/JUDGE_QUICKSTART.md)**.

---

*Submitted to WeMakeDevs × AWS Environmental Hacks — Heat and Water Track (Build It Route).*  
*Project Repository:* [https://github.com/RiyanshiVerma-11/JalRakshak-AI](https://github.com/RiyanshiVerma-11/JalRakshak-AI)  
*Authors:* Team SheBuilds ([Riyanshi Verma](https://github.com/RiyanshiVerma-11) & Team)
