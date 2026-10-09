"""
JalRakshak AI — Automated Judge Smoke Verification Script (Cross-Platform Python)
Single-command evaluation verification for hackathon evaluators across Windows, macOS, and Linux:
1. Boots run_app.py on an isolated test port (8089).
2. Polls /api/health until reporting 'status: HEALTHY'.
3. Executes POST /api/incidents/simulate with a test cloudburst scenario.
4. Asserts HTTP 200 & verifies all 5 Strands agents in agent_trace.
5. Cleans up the background server process and exits 0 (SUCCESS) or 1 (FAILURE).
"""
import json
import os
import subprocess
import sys
import time
import urllib.request
import urllib.error

# Configure UTF-8 encoding on stdout for Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PORT = int(os.environ.get("PORT", "8089"))
HEALTH_URL = f"http://127.0.0.1:{PORT}/api/health"
SIMULATE_URL = f"http://127.0.0.1:{PORT}/api/incidents/simulate"

CYAN = "\033[96m"
GREEN = "\033[92m"
RED = "\033[91m"
RESET = "\033[0m"

def print_cyan(text):
    print(f"{CYAN}{text}{RESET}", flush=True)

def print_green(text):
    print(f"{GREEN}{text}{RESET}", flush=True)

def print_red(text):
    print(f"{RED}{text}{RESET}", flush=True)

def main():
    print_cyan("======================================================================")
    print_cyan(">> JalRakshak AI: Judge Smoke Test Verification                     <<")
    print_cyan("======================================================================")

    env = os.environ.copy()
    env["PORT"] = str(PORT)

    print(f"--> Starting JalRakshak AI server on port {PORT}...")
    server_process = subprocess.Popen(
        [sys.executable, "run_app.py"],
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    try:
        # Step 1: Poll /api/health
        print(f"--> Polling {HEALTH_URL} for healthy status...")
        max_attempts = 30
        healthy = False

        for attempt in range(max_attempts):
            try:
                req = urllib.request.Request(HEALTH_URL, headers={"User-Agent": "JudgeSmoke/1.0"})
                with urllib.request.urlopen(req, timeout=1.5) as resp:
                    if resp.status == 200:
                        data = json.loads(resp.read().decode("utf-8"))
                        if data.get("status") == "HEALTHY":
                            healthy = True
                            print_green("✓ Health Check Passed: System reports HEALTHY")
                            print_green(f"  Execution Mode: {data.get('mode')} | Orchestrator: {data.get('orchestrator')}")
                            break
            except Exception:
                pass
            time.sleep(1)

        if not healthy:
            print_red("✗ Error: Server failed to reach HEALTHY state within 30 seconds.")
            return 1

        # Step 2: POST /api/incidents/simulate
        print(f"--> Executing 5-Agent Strands simulation via {SIMULATE_URL}...")
        payload = json.dumps({
            "scenario": "flood",
            "ward_id": "WARD-17",
            "custom_rainfall": 118.0
        }).encode("utf-8")

        req = urllib.request.Request(
            SIMULATE_URL,
            data=payload,
            headers={"Content-Type": "application/json", "User-Agent": "JudgeSmoke/1.0"}
        )

        with urllib.request.urlopen(req, timeout=10.0) as resp:
            if resp.status != 200:
                print_red(f"✗ Error: /api/incidents/simulate returned HTTP {resp.status}")
                return 1
            sim_data = json.loads(resp.read().decode("utf-8"))

        incident = sim_data.get("incident", {})
        trace = incident.get("agent_trace", [])

        expected_agents = [
            "risk_agent",
            "impact_agent",
            "resource_agent",
            "communication_agent",
            "coordinator_agent"
        ]

        missing_agents = 0
        for agent in expected_agents:
            if agent in trace:
                print_green(f"✓ Agent Trace Verified: {agent} executed successfully")
            else:
                print_red(f"✗ Agent Trace Missing: {agent} not found in trace")
                missing_agents += 1

        print_cyan("----------------------------------------------------------------------")
        if missing_agents == 0:
            print_green("======================================================================")
            print_green("★ SMOKE TEST PASSED: ALL 5 STRANDS AGENTS VERIFIED LIVE & OPERATIONAL ★")
            print_green("======================================================================")
            return 0
        else:
            print_red("======================================================================")
            print_red(f"✗ SMOKE TEST FAILED: {missing_agents} agents missing from execution trace.")
            print_red("======================================================================")
            return 1

    finally:
        print_cyan(f"--> Cleaning up server process (PID: {server_process.pid})...")
        server_process.terminate()
        try:
            server_process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            server_process.kill()

if __name__ == "__main__":
    sys.exit(main())
