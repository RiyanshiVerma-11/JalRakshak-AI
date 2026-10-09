# JalRakshak AI — AWS Strands Multi-Agent Performance Benchmark

This document records the empirical performance benchmark of the 5-Agent AWS Strands DAG Orchestrator running completely locally on a developer laptop without network dependencies.

## 1. Benchmark Execution Metadata

| Parameter | Value |
| :--- | :--- |
| **Command** | `python tests/benchmark_strands.py 100` |
| **Iterations** | 100 consecutive runs (preceded by 1 unmeasured warmup pass) |
| **Host CPU** | AMD64 Family 23 Model 104 Stepping 1 (12 logical cores) |
| **System Memory** | 7.3 GB RAM available |
| **Operating System** | Windows 10 (64-bit) |
| **Python Version** | Python 3.11.3 |
| **Execution Mode** | OFFLINE (Build It Route — Zero AWS Account / Zero Outbound Calls) |
| **Active Model** | `LocalDeterministicModel` (AWS Strands SDK interface) |

---

## 2. Empirical Latency Measurements

```text
=====================================================================
>> JalRakshak AI: AWS Strands 5-Agent Performance Benchmark <<
=====================================================================
Platform:      Windows 10 (AMD64)
Python:        3.11.3
Target DAG:    5-Agent AWS Strands Workflow (Risk->Impact->Resource->Comms->Coord)
Iterations:    100 consecutive runs
---------------------------------------------------------------------
BENCHMARK RESULTS:
  Iterations:   100
  p50 Latency:  62.14 ms
  p95 Latency:  82.51 ms
  Min Latency:  57.74 ms
  Max Latency:  127.34 ms
=====================================================================
```

| Metric | Measured Latency | Notes |
| :--- | :--- | :--- |
| **p50 (Median)** | **62.14 ms** | Full 5-agent cycle including RAG vector search & hook dispatch |
| **p95** | **82.51 ms** | High-percentile latency under local background scheduler jitter |
| **Min** | **57.74 ms** | Fastest complete 5-agent traversal |
| **Max** | **127.34 ms** | Cold-path / garbage collection peak |

> **Host Variance & Latency Context:**  
> Latency is dominated by host scheduling and Python startup. Expect roughly 15-130 ms for the full local 5-agent loop depending on your machine. Rerun `python tests/benchmark_strands.py 100` to get your own figure; the script prints platform and Python version automatically.

---

## 3. Breakdown of the 5-Agent Pipeline Cycle

During every iteration of the benchmark, all five agents execute in sequence:

1. **Risk Detection Agent (`strands-agent-risk-01`)**:
   - Ingests rainfall rate, flood depth, drainage saturation deltas.
   - Computes physical hydrology explainability score and returns severity.
2. **Impact Assessment Agent (`strands-agent-impact-02`)**:
   - Cross-references ward GIS demographic layer, vulnerable hospitals, and schools.
   - Calculates exposed population and critical facility risk.
3. **Resource & Response Agent (`strands-agent-resource-03`)**:
   - Evaluates municipal asset inventory (1000 GPM dewatering pumps, medical vans).
   - Generates tactical transit ETAs and matches nearest available assets.
4. **Multilingual Communication Agent (`strands-agent-comm-04`)**:
   - Synthesizes localized advisories in English, Hindi, and Marathi.
5. **Coordinator Agent (`strands-agent-coord-05`)**:
   - Executes TF-IDF cosine similarity RAG query against statutory NDMA / CPHEEO SOP knowledge base.
   - Emits prioritized action directives for Incident Commander Human-in-the-Loop review.

---

## 4. How to Reproduce

Run the benchmark script directly from the repository root:

```bash
python tests/benchmark_strands.py 100
```
