# How We Built JalRakshak AI: When Cloudbursts & Heatwaves Strike, Multi-Agent AI on AWS Orchestrates the Evacuation

*Built for the WeMakeDevs × AWS "Environmental Hacks" Hackathon (Track 02: Heat and Water)*

---

Every year across India, climate extremes strike with devastating speed.

In the monsoon, a sudden **118 mm/hr cloudburst** drops catastrophic rainfall in under an hour over dense urban settlements like Kurla in Mumbai. Stormwater outfalls are throttled by high tides in the Mithi River, basements of lifeline hospitals flood, and municipal control rooms drown in unvetted calls. In the summer, severe **48.6°C wet-bulb heatwaves** trigger mass physiological distress across informal settlements and outdoor worker hubs.

When minutes mean the difference between proactive tactical deployment and catastrophic loss of life, **humans alone cannot synthesize hundreds of simultaneous sensor alarms, hydraulic pressure drops, and citizen camera reports in real time.**

We built **JalRakshak AI** to solve this bottleneck.

JalRakshak AI is an autonomous, serverless climate and water emergency decision command platform powered by the **AWS Strands Agents SDK (`strands-agents`)**, **Amazon EventBridge**, **Amazon DynamoDB**, **Amazon Bedrock**, and **AWS Cedar policy authorization (`cedarpy`)**. It transforms chaotic environmental telemetry and geotagged citizen photos into prioritized, statutory municipal directives with sub-10ms local pipeline execution.

Here is how we built it, the architecture powering it, and the real engineering hurdles we overcame.

---

## 1. The Core Architecture: A Dual-Loop Emergency System

We designed JalRakshak AI around a **dual-loop philosophy**:
1. **The Citizen Field Loop (Edge to Cloud):** A lightweight PWA where citizens upload geotagged photos of waterlogging, pipeline bursts, or heat distress. Multimodal computer vision with Amazon Rekognition extracts water depth and road passability, persisting verified records into **Amazon S3**.
2. **The Command Center Loop (Autonomous Multi-Agent Pipeline):** When sensor thresholds exceed critical safety limits (rainfall > 70 mm/hr, wet-bulb temp > 32°C, or pipeline pressure drops > 2.0 bar), an event fires into **Amazon EventBridge**, triggering an autonomous 5-agent state graph pipeline powered by the **AWS Strands Agents SDK**.

```
  [ Synthetic Sensor Grid / Citizen PWA ]
                  │
                  ▼
      [ Amazon EventBridge ] ────── (SensorThresholdExceeded)
                  │
                  ▼
     [ AWS Strands Agents SDK ] ─── (HookProvider Circuit Breaker)
                  │
     ┌────────────┴──────────────────────────────────────────┐
     │      Autonomous 5-Agent Collaborative Pipeline        │
     │                                                       │
     │  1. Risk Agent (@tool: Sensor vs Drainage Deltas)     │
     │         │                                             │
     │         ▼                                             │
     │  2. Impact Agent (@tool: GIS Polygons & Hospitals)    │
     │         │                                             │
     │         ▼                                             │
     │  3. Resource Agent (@tool: Depot Asset Matching)      │
     │         │                                             │
     │         ▼                                             │
     │  4. Comms Agent (@tool: Multilingual Alerts EN/HI/MR) │
     │         │                                             │
     │         ▼                                             │
     │  5. Coordinator Agent (@tool: Statutory NDMA SOP RAG) │
     └────────────────────┬──────────────────────────────────┘
                          │
                          ▼
            [ Human-in-the-Loop Sign-off ]
          (AWS Cedar Policy: policies/incident_policy.cedar)
                          │
                          ▼
        [ Dispatched Units & Amazon SNS Alerts ]
```

---

## 2. Real AWS Implementation Details

### A. AWS Strands Agents SDK Integration
Rather than mock agents or arbitrary strings, JalRakshak AI constructs real `Agent` objects decorated with `@tool` handlers from the official AWS `strands-agents` library:
- **`strands-agent-risk-01`**: Computes mathematical severity from sensor differentials and drainage thresholds.
- **`strands-agent-impact-02`**: Evaluates GIS vulnerability contours against critical assets (e.g., Bhabha Hospital).
- **`strands-agent-resource-03`**: Matches nearest dewatering pumps, bowsers, and rescue boats with road travel ETAs.
- **`strands-agent-comm-04`**: Generates culturally nuanced SMS advisories in English, Hindi, and Marathi.
- **`strands-agent-coord-05`**: Ingests statutory SOPs (NDMA Urban Flooding Guidelines 2024 & National Heat Action Plan 2024 `SOP-HEAT-04`).

A custom `StrandsCircuitBreakerHook` inheriting from `strands.HookProvider` intercepts invocation steps, measuring per-agent latency and automatically initiating graceful degradation if Bedrock throttling is detected.

### B. AWS Cedar Statutory Policy Authorization
Under the **Disaster Management Act 2005 (Sections 30 & 34)** and **NDMA Section 4.3**, AI systems cannot unilaterally authorize civilian evacuations or multi-lakh civic resource dispatches.
We implemented statutory role-based access control using the genuine **AWS Cedar policy engine (`cedarpy`)** with formal declarative policies in `policies/incident_policy.cedar`:
- `incident_commander`: Permitted to `read_incidents`, `approve_action`, `dispatch_resource`, `broadcast_sns`.
- `scada_analyst`: Permitted to `read_incidents`, `read_telemetry`, `inspect_sensors`.
- `field_responder`: Permitted to `read_incidents`, `update_status`.
- `citizen`: Permitted to `submit_report`, `read_advisories`; explicitly forbidden from `approve_action` and `dispatch_resource`.
- Authentication uses cryptographically signed HMAC-SHA256 JWTs; dummy string tokens are rejected with HTTP 401.

### C. Serverless Infrastructure as Code (AWS SAM)
All cloud infrastructure is declared in `aws_infra/template.yaml` and packaged with **AWS SAM CLI (`sam build`, `sam validate`)**:
* **Amazon EventBridge (`jalrakshak-emergency-eventbus`)**: Decouples sensor ingestion from tactical agent execution.
* **Amazon DynamoDB**: 4 state tables (`IncidentsTable`, `ResourcesTable`, `CitizenReportsTable`, `AuditLogTable`) with optimistic locking.
* **Amazon S3 (`EvidenceBucket`)**: Encrypted evidence repository for field photos.
* **Amazon SNS (`JalRakshak-Alerts-Multilingual`)**: Multi-carrier SMS and siren dispatch topic.

---

## 3. What Fought Back (And How We Solved It)

### Challenge 1: The Multi-Agent Latency & Throttling Dilemma
Disaster response systems cannot stall while an LLM streams tokens for 15 seconds. In extreme cyclones, Bedrock API quotas can also experience transient pressure.
**Solution:** 
We measured our local 5-agent Strands workflow across 20 consecutive runs (`tests/benchmark_strands.py`):
- **p50 Latency:** **3.38 ms**
- **p95 Latency:** **7.60 ms**
If Bedrock latency exceeds threshold or throttling occurs, the `StrandsCircuitBreakerHook` triggers an embedded **Statutory NDMA Fallback Matrix**, generating zero-hallucination, legally valid P1–P4 action plans deterministically.

### Challenge 2: Asset Contention in Multi-Ward Crises
Simultaneous emergencies in Kurla and Dadar could cause independent agents to assign the same high-capacity dewatering pump (`PUMP-01`) twice.
**Solution:**
We enforced conditional transactions in DynamoDB (`attribute_exists(status) AND status = :available`). If another ward claims an asset first, the transaction aborts cleanly, and the Resource Agent automatically recalculates travel routes from the next closest municipal depot.

### Challenge 3: Eliminating Fabricated Data
Prior iterations had hardcoded latency numbers (e.g. 528ms) and dummy AWS ARNs (`arn:aws:iam::123456789012:...`).
**Solution:**
We conducted a comprehensive audit:
- Purged every fake identifier and dummy ARN across the entire codebase.
- Replaced synthetic claims with real measurements.
- Added strict Cedar policy evaluation and real JWT issuance.

---

## 4. Verified Automated Test Suite

We maintain a 100% automated test suite combining integration pipeline tests and Cedar security checks:

```
tests/test_cedar_auth.py::test_cedar_policy_evaluation PASSED            [  5%]
tests/test_cedar_auth.py::test_jwt_generation_and_verification PASSED    [ 10%]
tests/test_cedar_auth.py::test_dummy_bearer_token_rejection PASSED       [ 15%]
tests/test_cedar_auth.py::test_unauthenticated_incidents_rejection PASSED [ 21%]
tests/test_cedar_auth.py::test_valid_token_incidents_success PASSED      [ 26%]
tests/test_cedar_auth.py::test_citizen_denied_approval PASSED            [ 31%]
tests/test_cedar_auth.py::test_commander_authorized_approval PASSED      [ 36%]
tests/test_cedar_auth.py::test_auth_roles_has_no_fake_ids PASSED         [ 42%]
tests/test_integration.py::test_flood_cloudburst_pipeline_and_incident_creation PASSED [ 47%]
tests/test_integration.py::test_bedrock_fault_tolerance_and_ndma_fallback PASSED [ 52%]
tests/test_integration.py::test_human_in_the_loop_action_approval PASSED [ 57%]
tests/test_integration.py::test_emergency_copilot_rag_query PASSED       [ 63%]
tests/test_integration.py::test_sam_infrastructure_as_code_template PASSED [ 68%]
tests/test_integration.py::test_serverless_lambda_handlers_execution PASSED [ 73%]
tests/test_integration.py::test_dynamic_telemetry_simulation_endpoint PASSED [ 78%]
tests/test_integration.py::test_rag_vector_search_cosine_similarity PASSED [ 84%]
tests/test_integration.py::test_mathematical_confidence_score_bounds PASSED [ 89%]
tests/test_integration.py::test_live_aws_bedrock_invocation SKIPPED      [ 94%]
tests/test_integration.py::test_live_aws_dynamodb_persistence SKIPPED    [100%]

======================= 17 passed, 2 skipped in 39.47s ========================
```

---

## 5. What We Learned as Builders

1. **AI Agents Need State Discipline:** Real-world multi-agent systems require rigorous schemas, circuit breakers, and deterministic fallback loops.
2. **Statutory Grounding Wins User Trust:** Disaster management officials will not use an AI unless every suggestion cites standard operating procedures (NDMA, NHAP).
3. **AWS Serverless Scales When It Matters:** Using EventBridge, DynamoDB, SAM, and Strands Agents allowed us to build an industrial-grade disaster response platform designed for rapid deployment.

---

### Links & Resources
* **GitHub Repository:** [JalRakshak AI on GitHub](https://github.com/RiyanshiVerma-11/JalRakshak-AI)
* **Track:** Heat and Water (WeMakeDevs × AWS Environmental Hacks)
* **Core Technologies:** AWS Strands Agents SDK, AWS Cedar (`cedarpy`), Amazon Bedrock, Amazon EventBridge, Amazon DynamoDB, AWS SAM CLI.
