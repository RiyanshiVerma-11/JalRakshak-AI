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
d:\Riyanshi\01_coding\projects\41 JalRakshak AI\aws_infra\template.yaml is a valid SAM Template
```

## 3. Production Build
Compile serverless functions and package dependencies into `.aws-sam/build`:

```bash
sam build --template aws_infra/template.yaml --region ap-south-1
```
**Raw Acceptance Output**:
```
Building codeuri: d:\Riyanshi\01_coding\projects\41 JalRakshak AI\aws_infra runtime: python3.11 metadata: {} architecture: arm64 functions: CitizenReportIngestLambda, TelemetryProcessorLambda, DispatchActionLambda, BedrockAgentInvokerLambda
Running PythonPipBuilder:ResolveDependencies
Running PythonPipBuilder:CopySource
Build Succeeded

Built Artifacts  : .aws-sam\build
Built Template   : .aws-sam\build\template.yaml
```

## 4. Local Lambda Invocation
To invoke individual serverless Lambdas locally using sample EventBridge events:

1. Ensure **Docker Desktop** is running on the host.
2. Execute invocation using the test event payload:
```bash
sam local invoke CitizenReportIngestLambda -e events/citizen_event.json
```

**Expected Event Processing**:
The handler reads the citizen report payload, logs event correlation ID to CloudWatch, persists the record, and emits an EventBridge event to `aws.iot.environment`.
