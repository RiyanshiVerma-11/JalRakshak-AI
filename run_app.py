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

    from backend.cloud.config import (
        get_backend_mode_with_reason,
        has_aws_credentials,
        get_bedrock_model_id,
        get_build_it_tools_inventory
    )
    from backend.auth.cedar_auth import get_cedar_engine_name
    from backend.agents.strands_workflow import get_strands_model_provider

    backend_mode, reason = get_backend_mode_with_reason()
    creds_detected = has_aws_credentials()
    cedar_engine = get_cedar_engine_name()
    model_provider = get_strands_model_provider()
    tools_inventory = get_build_it_tools_inventory()

    print("==================================================================")
    print(">> JalRakshak AI - Urban Flood & Heat Decision Support Platform <<")
    print(">> WeMakeDevs x AWS Environmental Hacks | Track: Heat and Water <<")
    print(">> Build Route: BUILD IT (Local AWS Open-Source Tooling Only)   <<")
    print(">> No AWS account, no credit card, no bill required to run.     <<")
    print("==================================================================")
    print("BUILD IT ROUTE - 4 DECLARED AWS OPEN-SOURCE TOOLS:")
    for idx, t in enumerate(tools_inventory, 1):
        print(f"  [{idx}] {t['tool']:<24} -> [{t['status']}] ({t['evidence']})")
    print("------------------------------------------------------------------")
    print("EXECUTION SUBSYSTEM RESOLUTION:")
    print(f"  - Resolved Mode:    {backend_mode}")
    print(f"  - Mode Reason:      {reason}")
    print(f"  - Strands Provider: {model_provider}")
    print(f"  - Cedar Auth:       AWS Cedar ({cedar_engine})")
    print(f"  - AWS Credentials:  {'DETECTED (Live AWS)' if creds_detected else 'NONE (Zero-Credential Build It Guarantee: 0 outbound calls)'}")
    print("------------------------------------------------------------------")
    print("DISPATCH & STORAGE SUBSYSTEM STATUS:")
    if backend_mode == "AWS":
        print("  - Amazon Bedrock / SNS / S3 / DynamoDB: Live AWS Cloud endpoints (User configured)")
    elif backend_mode == "LOCALSTACK":
        print(f"  - LocalStack Gateway: {os.environ.get('AWS_ENDPOINT_URL', 'http://localhost:4566')} (Real emulated SDK calls)")
    else:
        print("  - Amazon SNS: Local in-memory notification stream (simulated: true)")
        print("  - Amazon S3: Local filesystem evidence lake (simulated: true)")
        print("  - Amazon DynamoDB: Atomic InMemoryStateStore (real local persistence)")
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
