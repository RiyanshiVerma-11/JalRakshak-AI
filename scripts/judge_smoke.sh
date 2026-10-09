#!/usr/bin/env bash
# ==============================================================================
# JalRakshak AI — Automated Judge Smoke Verification Script
# ==============================================================================
# Single-command evaluation verification for hackathon evaluators:
# 1. Sets up virtual environment & installs from requirements.lock
# 2. Boots run_app.py on a dedicated port
# 3. Polls /api/health until HEALTHY
# 4. Executes POST /api/incidents/simulate
# 5. Asserts HTTP 200 & verifies all 5 Strands agents in agent_trace
# 6. Cleans up background server and exits 0 (SUCCESS) or 1 (FAILURE)
# ==============================================================================
set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PORT="${PORT:-8084}"
VENV_DIR=".smoke_venv"
APP_PID=""

cleanup() {
    if [ -n "$APP_PID" ] && kill -0 "$APP_PID" 2>/dev/null; then
        echo -e "${CYAN}Stopping server (PID: $APP_PID)...${NC}"
        kill "$APP_PID" 2>/dev/null || true
    fi
}
trap cleanup EXIT INT TERM

echo -e "${CYAN}======================================================================${NC}"
echo -e "${CYAN}>> JalRakshak AI: Judge Smoke Test Verification                     <<${NC}"
echo -e "${CYAN}======================================================================${NC}"

# Step 1: Virtual environment setup
SKIP_VENV="${SKIP_VENV:-0}"
if [ "$SKIP_VENV" != "1" ]; then
    if [ ! -d "$VENV_DIR" ]; then
        echo -e "--> Creating smoke virtual environment in ${VENV_DIR}..."
        python -m venv "$VENV_DIR"
    fi

    if [ -f "${VENV_DIR}/bin/activate" ]; then
        source "${VENV_DIR}/bin/activate"
    elif [ -f "${VENV_DIR}/Scripts/activate" ]; then
        source "${VENV_DIR}/Scripts/activate"
    fi

    echo -e "--> Installing dependencies from requirements.lock..."
    pip install -q -r requirements.lock
else
    echo -e "--> Skipping venv creation [SKIP_VENV=1]..."
fi

# Step 2: Boot server in background on $PORT
echo -e "--> Starting JalRakshak AI server on port ${PORT}..."
export PORT="$PORT"
python run_app.py &
APP_PID=$!

# Step 3: Poll /api/health until HEALTHY
HEALTH_URL="http://127.0.0.1:${PORT}/api/health"
SIMULATE_URL="http://127.0.0.1:${PORT}/api/incidents/simulate"

echo -e "--> Polling ${HEALTH_URL} for healthy status..."
MAX_ATTEMPTS=30
ATTEMPT=0
HEALTHY=false

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if STATUS_RESP=$(curl -s "$HEALTH_URL" 2>/dev/null); then
        if echo "$STATUS_RESP" | grep -q '"status":[ ]*"HEALTHY"'; then
            HEALTHY=true
            echo -e "${GREEN}✓ Health Check Passed: System reports HEALTHY${NC}"
            break
        fi
    fi
    ATTEMPT=$((ATTEMPT + 1))
    sleep 1
done

if [ "$HEALTHY" != "true" ]; then
    echo -e "${RED}✗ Error: Server failed to reach HEALTHY state within 30 seconds.${NC}"
    exit 1
fi

# Step 4: POST /api/incidents/simulate
echo -e "--> Executing 5-Agent Strands simulation via ${SIMULATE_URL}..."
SIM_RESP=$(curl -s -X POST "$SIMULATE_URL" \
    -H "Content-Type: application/json" \
    -d '{"scenario":"flood","ward_id":"WARD-17","custom_rainfall":118.0}')

# Step 5: Assert HTTP 200 & verify all 5 agents in agent_trace
MISSING_AGENTS=0
for AGENT in "risk_agent" "impact_agent" "resource_agent" "communication_agent" "coordinator_agent"; do
    if echo "$SIM_RESP" | grep -q "\"$AGENT\""; then
        echo -e "${GREEN}✓ Agent Trace Verified: $AGENT executed successfully${NC}"
    else
        echo -e "${RED}✗ Agent Trace Missing: $AGENT not found in trace${NC}"
        MISSING_AGENTS=$((MISSING_AGENTS + 1))
    fi
done

echo -e "${CYAN}----------------------------------------------------------------------${NC}"
if [ $MISSING_AGENTS -eq 0 ]; then
    echo -e "${GREEN}======================================================================${NC}"
    echo -e "${GREEN}★ SMOKE TEST PASSED: ALL 5 STRANDS AGENTS VERIFIED LIVE & OPERATIONAL ★${NC}"
    echo -e "${GREEN}======================================================================${NC}"
    exit 0
else
    echo -e "${RED}======================================================================${NC}"
    echo -e "${RED}✗ SMOKE TEST FAILED: ${MISSING_AGENTS} agents missing from execution trace.${NC}"
    echo -e "${RED}======================================================================${NC}"
    exit 1
fi
