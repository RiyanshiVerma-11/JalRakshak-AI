"""
JalRakshak AI — AWS Strands 5-Agent Multi-Agent Workflow Benchmark
Measures the end-to-end execution latency across 20 consecutive runs of the complete
5-Agent AWS Strands DAG (Risk -> Impact -> Resource -> Communication -> Coordinator).
Uses high-precision time.perf_counter() and computes min, max, p50, and p95.
"""
import sys
import os
import time
import platform
import statistics
from typing import List

# Ensure repository root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.agents.strands_workflow import strands_orchestrator


def run_benchmark(iterations: int = 20) -> dict:
    telemetry = {
        "rainfall_rate_mm_hr": 118.0,
        "flood_depth_cm": 42.0,
        "drainage_saturation_pct": 98.5,
        "temperature_c": 27.5,
        "citizen_reports_count": 8,
    }
    ward_id = "WARD-17"
    category = "flood"

    print("=====================================================================")
    print(">> JalRakshak AI: AWS Strands 5-Agent Performance Benchmark <<")
    print("=====================================================================")
    print(f"Platform:      {platform.system()} {platform.release()} ({platform.machine()})")
    print(f"Python:        {platform.python_version()} ({sys.executable})")
    print(f"Target DAG:    5-Agent AWS Strands Workflow (Risk->Impact->Resource->Comms->Coord)")
    print(f"Iterations:    {iterations} consecutive runs")
    print("---------------------------------------------------------------------")

    # Warmup run to prime imports and internal caches
    strands_orchestrator.execute_workflow(
        ward_id=ward_id,
        category=category,
        telemetry=telemetry,
        title_override="Benchmark Warmup Run",
    )

    latencies_ms: List[float] = []

    for i in range(1, iterations + 1):
        t0 = time.perf_counter()
        strands_orchestrator.execute_workflow(
            ward_id=ward_id,
            category=category,
            telemetry=telemetry,
            title_override=f"Benchmark Run {i}",
        )
        elapsed_ms = (time.perf_counter() - t0) * 1000.0
        latencies_ms.append(elapsed_ms)
        print(f"  Run {i:02d}/{iterations:02d}: {elapsed_ms:6.2f} ms")

    sorted_lats = sorted(latencies_ms)
    min_lat = sorted_lats[0]
    max_lat = sorted_lats[-1]
    p50_lat = statistics.median(sorted_lats)

    # Nearest-rank method for p95
    p95_index = int(0.95 * len(sorted_lats))
    p95_lat = sorted_lats[min(p95_index, len(sorted_lats) - 1)]

    print("=====================================================================")
    print("BENCHMARK RESULTS:")
    print(f"  Iterations:   {iterations}")
    print(f"  p50 Latency:  {p50_lat:.2f} ms")
    print(f"  p95 Latency:  {p95_lat:.2f} ms")
    print(f"  Min Latency:  {min_lat:.2f} ms")
    print(f"  Max Latency:  {max_lat:.2f} ms")
    print("=====================================================================")

    return {
        "iterations": iterations,
        "p50_ms": round(p50_lat, 2),
        "p95_ms": round(p95_lat, 2),
        "min_ms": round(min_lat, 2),
        "max_ms": round(max_lat, 2),
        "platform": f"{platform.system()} {platform.release()} {platform.machine()}",
        "python": platform.python_version(),
    }


if __name__ == "__main__":
    run_benchmark(20)
