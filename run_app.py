"""
JalRakshak AI — Unified Launcher
Starts the FastAPI application which serves both:
1. The backend multi-agent APIs (/api/*)
2. The high-performance React Command Center & Citizen PWA UI (at http://localhost:8004)
"""
import sys
import uvicorn

if __name__ == "__main__":
    # Ensure stdout handles utf-8 if possible
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass

    print("==========================================================")
    print(">> JalRakshak AI - Climate Emergency Response Platform <<")
    print("==========================================================")
    import os
    mode = os.environ.get("AWS_EXECUTION_MODE", "HYBRID").upper()
    print("[*] Autonomous 5-Agent Decision Engine: ONLINE")
    print(f"[*] Amazon Bedrock (Claude 3.5 Sonnet): {mode} RUNTIME ACTIVE")
    print("[*] Amazon SNS Multilingual Dispatcher: BOTO3 ATTACHED")
    print("[*] SOP RAG Knowledge Base: LOADED (NDMA Chapter 4)")
    print(f"[*] Amazon EventBridge & DynamoDB State Bus: INITIALIZED ({mode})")
    print("----------------------------------------------------------")
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8004"))
    print(f"[*] Web Application live at: http://localhost:{port}")
    print(f"[*] API Documentation at:    http://localhost:{port}/docs")
    print("==========================================================")
    
    uvicorn.run("backend.main:app", host=host, port=port, reload=False)
