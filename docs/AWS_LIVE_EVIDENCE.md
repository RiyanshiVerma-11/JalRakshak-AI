# AWS Live Cloud Deployment & Execution Evidence Status

## Executive Disclosure

**Status:** Live AWS Cloud Mode Implemented; Unverified in Current Local Evaluation Environment.

In accordance with the hackathon **Build It** route principles and strict submission integrity rules:
- **Zero Fabricated Logs:** No synthetic Bedrock invocation logs, token counts, or request IDs are fabricated in this document or across the repository.
- **Current Runtime Mode:** The local evaluation environment runs strictly in **OFFLINE** mode (`AWS_EXECUTION_MODE=HYBRID` / default zero-credential Build It mode).
- **Network Boundaries:** In offline mode, the system executes 100% locally with zero outbound network calls (verified by `tests/test_build_it_route.py::test_offline_run_makes_no_network_calls`).

---

## Architecture of Live Cloud Mode (`AWS_EXECUTION_MODE=LIVE`)

When provisioned with valid AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION=ap-south-1`):

1. **Amazon Bedrock (Claude 3.5 Sonnet)**:
   - Orchestrated via `backend/agents/strands_workflow.py` using `strands.models.BedrockModel`.
   - Model ID: `anthropic.claude-3-5-sonnet-20240620-v1:0` in `ap-south-1` (Mumbai).
   - Invocation gate: `backend/cloud/aws_bridge.py::is_live_cloud_active()` verifies credentials before socket initialization.

2. **Amazon DynamoDB**:
   - Automated persistence across `JalRakshak-IncidentsTable`, `JalRakshak-ResourcesTable`, and `JalRakshak-AuditLogTable`.
   - Managed via `backend/cloud/aws_bridge.py::persist_incident_to_dynamodb()`.

3. **Amazon EventBridge**:
   - Custom event bus `jalrakshak-emergency-eventbus` routes telemetry threshold breaches to `StrandsAgentOrchestratorLambda`.

4. **Amazon SNS**:
   - Multilingual SMS / push notifications published to `arn:aws:sns:ap-south-1:*:JalRakshak-Alerts-Multilingual`.

5. **Amazon S3**:
   - Evidence lake `jalrakshak-evidence-${AWS::AccountId}-${AWS::Region}` stores citizen-uploaded disaster photos.

---

## Local Verification Commands

To verify that the offline Build It implementation functions completely without AWS credentials:

```bash
# 1. Verify health inspection endpoint reports OFFLINE mode with honest reason
curl http://localhost:8004/api/health

# 2. Run automated test suite confirming zero outbound socket attempts
python -m pytest tests/test_build_it_route.py -v
```
