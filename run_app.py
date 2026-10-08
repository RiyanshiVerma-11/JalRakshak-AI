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
    print("[*] AWS Strands Multi-Agent Decision Engine: ONLINE")
    print("[*] SOP RAG Knowledge Base: LOADED")
    print("[*] Amazon EventBridge & DynamoDB State Bus: INITIALIZED")
    print("----------------------------------------------------------")
    print("[*] Web Application live at: http://localhost:8004")
    print("[*] API Documentation at:    http://localhost:8004/docs")
    print("==========================================================")
    
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8004, reload=False)
