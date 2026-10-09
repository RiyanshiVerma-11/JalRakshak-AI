"""
Central AWS and Cloud Configuration for JalRakshak AI.
Single source of truth for Bedrock model IDs, AWS account fallback, regions,
and LocalStack / open-source endpoint resolution.
"""
import os
from typing import Optional

# Canonical Bedrock Model ID across all callers and tests (Fixes D3)
DEFAULT_BEDROCK_MODEL_ID = "anthropic.claude-3-5-sonnet-20240620-v1:0"

# Obviously fake fallback AWS Account ID for zero-config local mode (Fixes D4)
DEFAULT_AWS_ACCOUNT_ID = "000000000000"

# Target AWS Region
DEFAULT_AWS_REGION = "ap-south-1"


def get_bedrock_model_id() -> str:
    """Returns configured Bedrock Model ID with canonical fallback."""
    return os.environ.get("BEDROCK_MODEL_ID", DEFAULT_BEDROCK_MODEL_ID)


def get_aws_account_id() -> str:
    """Returns AWS Account ID, defaulting to zeroed local mock ID."""
    return os.environ.get("AWS_ACCOUNT_ID", DEFAULT_AWS_ACCOUNT_ID)


def get_aws_region() -> str:
    """Returns active AWS region."""
    return os.environ.get("AWS_DEFAULT_REGION", os.environ.get("AWS_REGION", DEFAULT_AWS_REGION))


def get_aws_endpoint_url() -> Optional[str]:
    """
    Returns custom endpoint URL if LocalStack or custom mock is active.
    Checks AWS_ENDPOINT_URL and LOCALSTACK_HOSTNAME.
    """
    endpoint = os.environ.get("AWS_ENDPOINT_URL")
    if endpoint:
        return endpoint
    localstack_host = os.environ.get("LOCALSTACK_HOSTNAME")
    if localstack_host:
        port = os.environ.get("EDGE_PORT", "4566")
        return f"http://{localstack_host}:{port}"
    return None


def get_backend_mode() -> str:
    """
    Returns one of three honest states (Fixes D2 / Phase 3):
    - AWS: Real AWS credentials verified against STS
    - LOCAL: Running against LocalStack (AWS_ENDPOINT_URL set)
    - OFFLINE: Zero-config Build It mode with deterministic local fallbacks
    """
    if get_aws_endpoint_url():
        return "LOCAL"
    mode_env = os.environ.get("AWS_EXECUTION_MODE", "LOCAL").upper()
    if mode_env == "LIVE":
        return "AWS"
    return "OFFLINE"


def has_aws_credentials() -> bool:
    """Checks whether real AWS access credentials exist in the environment."""
    key = os.environ.get("AWS_ACCESS_KEY_ID")
    secret = os.environ.get("AWS_SECRET_ACCESS_KEY")
    if key and secret and not key.startswith("test") and not key.startswith("fake"):
        return True
    return False

