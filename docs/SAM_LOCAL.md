# AWS SAM Local Invocation & Validation Guide

JalRakshak AI provides production-ready AWS Serverless Application Model (SAM) templates and Lambda handlers located in `aws_infra/`.

## 1. Prerequisites
- **AWS SAM CLI**: Installed (`sam --version` -> `SAM CLI, version 1.166.2`)
- **Python Runtime**: Python 3.11
- **Docker Desktop** (Required exclusively for local container emulation during `sam local invoke`)

## 2. Validation & Linting (Verified Zero-Warning)
Validate template structure and SAM specification without requiring Docker:

```bash
sam validate --template aws_infra/template.yaml --region ap-south-1 --lint
```
**Raw Acceptance Output**:
```
aws_infra/template.yaml is a valid SAM Template
```

## 3. Production Build
Compile serverless functions and package dependencies into `.aws-sam/build`:

```bash
sam build --template aws_infra/template.yaml --region ap-south-1
```
**Raw Acceptance Output**:
```
Building codeuri: aws_infra runtime: python3.11 metadata: {} architecture: arm64 functions: CitizenReportIngestLambda, TelemetryProcessorLambda, DispatchActionLambda, BedrockAgentInvokerLambda
Running PythonPipBuilder:ResolveDependencies
Running PythonPipBuilder:CopySource
Build Succeeded

Built Artifacts  : .aws-sam\build
Built Template   : .aws-sam\build\template.yaml
```

## 4. Local Lambda Invocation — NOT YET RUN (requires Docker)
To invoke individual serverless Lambdas locally using sample EventBridge events:

1. Ensure **Docker Desktop** is running on the host (required for local container emulation).
2. Execute invocation using the test event payload:
```bash
sam local invoke CitizenReportIngestLambda -e events/citizen_event.json
```

**Real Command Execution Output**:
```
No current session found, using default AWS::AccountId
Error: Running AWS SAM projects locally requires a container runtime. Do you have Docker installed and running?
```

> **Docker Status Note**: On this host environment, Docker Desktop daemon is not currently active, so container runtime emulation cannot launch the Lambda execution container locally. The serverless Lambda handlers (`aws_infra/lambda_handlers.py`) are independently verified and exercised directly via `pytest tests/test_integration.py::test_serverless_lambda_handlers_execution` (which passes 100% without container overhead).
