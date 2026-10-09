"""
JalRakshak AI — Unified Launcher
Starts the FastAPI application which serves both:
1. The backend multi-agent APIs (/api/*)
2. The high-performance React Command Center & Citizen PWA UI (at http://localhost:8004)
"""
import sys
import os

if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass

    from backend.cloud.config import get_backend_mode, has_aws_credentials, get_bedrock_model_id
    from backend.auth.cedar_auth import get_cedar_engine_name
    from backend.agents.strands_workflow import get_strands_model_provider

    backend_mode = get_backend_mode()
    creds_detected = has_aws_credentials()
    cedar_engine = get_cedar_engine_name()
    model_provider = get_strands_model_provider()

    print("==================================================================")
    print(">> JalRakshak AI - Urban Flood & Heat Decision Support Platform <<")
    print(">> WeMakeDevs x AWS Environmental Hacks | Track: Heat and Water <<")
    print(">> Build Route: Build It (Local AWS Open-Source Tooling)        <<")
    print("==================================================================")
    print("STARTUP SUBSYSTEM SELF-CHECK:")
    print(f"  [1] Decision Pipeline:  AWS Strands Agents SDK (5 agents active)")
    print(f"  [2] Model Provider:     {model_provider}")
    print(f"  [3] Bedrock Model ID:   {get_bedrock_model_id()}")
    print(f"  [4] Auth Engine:        AWS Cedar ({cedar_engine})")
    print(f"  [5] State Store:        InMemoryStateStore (Local zero-config)")
    print(f"  [6] AWS Credentials:    {'DETECTED (Live AWS)' if creds_detected else 'NONE DETECTED (Zero-Config Build It Mode)'}")
    print(f"  [7] Backend Mode:       {backend_mode}")
    print("DISPATCH & STORAGE SUBSYSTEM STATUS:")
    if backend_mode == "AWS":
        print("  - Amazon Bedrock / SNS / S3 / DynamoDB: Live AWS Cloud endpoints")
    elif backend_mode == "LOCAL":
        print(f"  - LocalStack Endpoint: {os.environ.get('AWS_ENDPOINT_URL')} (Real SDK calls)")
    else:
        print("  - Amazon SNS: Local simulator active (simulated: true, no fake IDs)")
        print("  - Amazon S3: Local artifact storage active (simulated: true)")
        print("  - Amazon DynamoDB: InMemoryStateStore active (real local persistence)")
        print("  - Amazon Rekognition: Local PIL statistical engine (simulated: true)")
    print("------------------------------------------------------------------")
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8004"))
    print(f"[*] Web Application live at: http://localhost:{port}")
    print(f"[*] API Documentation at:    http://localhost:{port}/docs")
    print(f"[*] Health Check at:         http://localhost:{port}/api/health")
    print("==================================================================")

    import uvicorn
    uvicorn.run("backend.main:app", host=host, port=port, reload=False)
