# JalRakshak AI — System Architecture & Data Flow

This document details the complete end-to-end architecture of **JalRakshak AI**, an autonomous climate and water emergency decision command platform built using the **AWS Strands Agents SDK**, **AWS Cedar**, and **AWS Serverless Application Model (SAM)**.

---

## 1. High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph INGESTION["1. INGESTION & EVENT LAYER (Build It Zero-Config)"]
        LiveFeed["🌐 Open-Meteo Public Weather API<br/>(Live Mumbai Rain/Temp Telemetry)"]
        Sensors["📡 SCADA Hydrology / Outfall Sensors<br/>(Rainfall mm/hr, Water Depth, Outfall Saturation)"]
        Citizen["📱 Citizen Emergency PWA<br/>(Multimodal Photo Upload + GPS Coordinates)"]
        LocalSeed["📦 Calibrated Seed Registry<br/>(NDMA / BMC Ward-17 Physical Baseline)"]

        LiveFeed -->|Online| Sensors
        LocalSeed -.->|Offline Mode| Sensors
        Sensors --> EventBridge["⚡ Amazon EventBridge Custom Bus<br/>('jalrakshak-emergency-eventbus')"]
        Citizen --> EventBridge
    end

    subgraph STRANDS["2. AWS STRANDS 5-AGENT MULTI-AGENT DAG"]
        direction TB
        A1["🤖 Agent 1: Risk Detection<br/>Sensor deltas vs. physical saturation threshold"]
        A2["🤖 Agent 2: Impact Assessment<br/>GIS demographic & critical hospital exposure"]
        A3["🤖 Agent 3: Resource Matcher<br/>Municipal depot asset allocation & ETA routing"]
        A4["🤖 Agent 4: Communication Agent<br/>Multilingual advisory synthesis (EN / HI / MR)"]
        A5["🤖 Agent 5: Incident Coordinator<br/>Synthesizes operational action directives"]

        EventBridge --> A1
        A1 -->|Risk Assessment Payload| A2
        A2 -->|GIS Impact Footprint| A3
        A3 -->|Matched Assets & ETAs| A4
        A4 -->|Localized Broadcasts| A5

        Hook["🛡️ StrandsCircuitBreakerHook<br/>Listens to AfterToolCallEvent & AfterInvocationEvent<br/>Triggers Deterministic NDMA Fallback on Throttling"]
        Hook -.-> A1
        Hook -.-> A2
        Hook -.-> A3
        Hook -.-> A4
        Hook -.-> A5
    end

    subgraph RAG["3. STATUTORY SOP RAG & AWS CEDAR RBAC"]
        SOPStore[("📚 TF-IDF SOP Knowledge Base<br/>- NDMA Urban Flooding Guidelines 2024 (Ch. 4)<br/>- National Heat Action Plan (NHAP) 2024<br/>- CPHEEO Water Supply Manual 2021<br/>- Jal Jeevan Mission Emergency Protocols")]
        A5 <-->|Cosine Similarity Retrieval| SOPStore
        CedarAuth{"🔒 AWS Cedar Policy Engine<br/>(cedarpy + policies/incident_policy.cedar)<br/>Statutory Role & Permission Evaluation"}
        A5 --> CedarAuth
    end

    subgraph HITL["4. HUMAN-IN-THE-LOOP COMMAND & PHYSICAL DISPATCH"]
        Commander["👨‍💼 Municipal Incident Commander<br/>(Statutory ICS-400 Authority under DMA 2005)"]
        CedarAuth --> Commander
        Commander -->|Approved| Dispatch["🚜 Dewatering Pump P-04 Dispatched (18 min ETA)"]
        Commander -->|Approved| Broadcast["📢 Multilingual Broadcast Queued (Amazon SNS)"]
        Commander -->|Approved| Audit["📝 Immutable Audit Log (Amazon DynamoDB)"]
    end

    style INGESTION fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style STRANDS fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc
    style RAG fill:#14532d,stroke:#4ade80,stroke-width:2px,color:#f8fafc
    style HITL fill:#831843,stroke:#f43f5e,stroke-width:2px,color:#f8fafc
```

---

## 2. Component Specifications

### 2.1 Multi-Agent DAG (`AWS Strands Agents SDK`)
The pipeline runs as a directed sequence composed of 5 specialized agents subclassing `strands.Agent`:
1. **`risk_detection_agent`**: Evaluates rainfall rate ($\text{mm/hr}$), flood depth ($\text{cm}$), and drainage saturation against physical discharge ceilings. In offline mode, uses `LocalDeterministicModel`. In live cloud mode, connects to `BedrockModel` (Claude 3.5 Sonnet).
2. **`impact_assessment_agent`**: Maps hazard perimeters onto Ward GIS demographic registries, computing vulnerable populations and critical facility proximity.
3. **`resource_matching_agent`**: Computes nearest available emergency assets (1000 GPM dewatering pumps, medical vans, drinking water bowsers) and generates transit ETAs.
4. **`communication_agent_instance`**: Generates localized public alerts in English, Hindi, and Marathi formatted for SMS and WhatsApp distribution.
5. **`coordinator_agent_instance`**: Queries the statutory SOP RAG database and formulates prioritized action directives.

### 2.2 Statutory Policy Engine (`AWS Cedar`)
Statutory authorization is defined declaratively in `policies/incident_policy.cedar` and evaluated via `cedarpy`:
- **`incident_commander`**: Permitted `read_incidents`, `approve_action`, `dispatch_resource`, `broadcast_sns`, `simulate_scenario`.
- **`scada_analyst`**: Permitted `read_incidents`, `read_telemetry`, `inspect_sensors`.
- **`field_responder`**: Permitted `read_incidents`, `update_status`.
- **`citizen`**: Permitted `submit_report`, `read_advisories`; explicitly forbidden from `approve_action`, `dispatch_resource`, `broadcast_sns`.

### 2.3 Serverless Infrastructure as Code (`AWS SAM CLI`)
Defined in `aws_infra/template.yaml`:
- **`StrandsAgentOrchestratorLambda`**: Bound to `StrandsExecutionRole` with least-privilege policies for DynamoDB, EventBridge, Bedrock, and SNS.
- **`CitizenReportIngestLambda`**: Bound to `CitizenIngestExecutionRole` with access to S3, Rekognition, and DynamoDB.
- **`EmergencyEventBus`**: Amazon EventBridge custom event bus for sensor threshold triggers.
- **`EmergencyAlertsTopic`**: Amazon SNS topic for multilingual emergency broadcasting.
- **`EvidenceBucket`**: Amazon S3 bucket for field telemetry photos.
- **State Tables**: DynamoDB tables for incidents, municipal resources, citizen reports, and audit logs.
