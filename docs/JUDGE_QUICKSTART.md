# JalRakshak AI — Hackathon Judge Quickstart Guide

**Track:** Heat and Water | **Route:** Build It  
**Evaluation Guarantee:** 100% offline-ready. No AWS account, credentials, credit card, or `.env` file required.

---

## 5-Step Evaluation Workflow

### Step 1: Clone Repository
```bash
git clone https://github.com/RiyanshiVerma-11/JalRakshak-AI.git
cd JalRakshak-AI
```
*Expected Output:* Clean git clone with all frontend build artifacts and Python backend ready.

---

### Step 2: Install Locked Dependencies
```bash
pip install -r requirements.lock
```
*Expected Output:* All dependencies installed with exact pinned versions matching the submission lockfile.

---

### Step 3: Run the Automated Verification Suite
```bash
python -m pytest tests/ -v
```
*Expected Output:* 100% green passing tests covering AWS Cedar RBAC, AWS Strands multi-agent orchestration, offline execution, and SAM template validation.

---

### Step 4: Launch Application Server
```bash
python run_app.py
```
*Expected Output:*
```text
================================================================================
🚀 JalRakshak AI (Build It Route) — Autonomous Disaster Command Center
================================================================================
  Server running at:       http://localhost:8004
  Mode:                    OFFLINE (Build It Route)
  Strands Agent Engine:    ACTIVE (LocalDeterministicModel)
  Cedar Policy Engine:     ACTIVE (cedarpy)
================================================================================
```

---

### Step 5: Explore the Application & Inspect Endpoints

Open your browser to the following URLs:

1. **Interactive Platform UI (Landing & Command Center):**  
   👉 [http://localhost:8004/](http://localhost:8004/)  
   *Tip:* Click the **"Continue as Judge (read-only)"** button on the landing page to enter the Command Center with the guided 3-minute demo tour pre-loaded.

2. **System Health & Build It Tool Inventory:**  
   👉 [http://localhost:8004/api/health](http://localhost:8004/api/health)  
   *Returns:* JSON health status, active offline mode reason, and the live status of all 4 Build It tools.

3. **Judge Read-Only Overview:**  
   👉 [http://localhost:8004/api/judge/overview](http://localhost:8004/api/judge/overview)  
   *Returns:* Executive summary of active incidents, municipal asset deployments, and statutory Cedar authorization status.

4. **Statutory SOP Knowledge Base:**  
   👉 [http://localhost:8004/api/rag/protocols](http://localhost:8004/api/rag/protocols)  
   *Returns:* Statutory disaster operating procedures (NDMA 2024, NHAP, CPHEEO) indexed by the TF-IDF vector RAG engine.

5. **FastAPI OpenAPI Interactive Documentation:**  
   👉 [http://localhost:8004/docs](http://localhost:8004/docs)  
   *Returns:* Full OpenAPI spec with interactive Swagger UI for testing all REST endpoints.
