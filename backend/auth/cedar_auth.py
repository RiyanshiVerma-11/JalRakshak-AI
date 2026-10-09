"""
AWS Cedar Policy Engine & Real JWT Authentication for JalRakshak AI.
Implements fine-grained statutory authorization via AWS Cedar (cedarpy)
and cryptographic JWT verification, eliminating all simulated auth bypasses.
"""
import os
import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
import jwt
from fastapi import HTTPException

try:
    import cedarpy
    CEDAR_AVAILABLE = True
except ImportError:
    cedarpy = None
    CEDAR_AVAILABLE = False

logger = logging.getLogger("jalrakshak.auth.cedar")

# Cryptographic token configuration
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jalrakshak-aws-cedar-production-key-2024")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Path to AWS Cedar policy file
_POLICY_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "policies"))
CEDAR_POLICY_PATH = os.path.join(_POLICY_DIR, "incident_policy.cedar")


def load_cedar_policy() -> str:
    """Loads the statutory AWS Cedar policy document from policies/incident_policy.cedar."""
    if os.path.exists(CEDAR_POLICY_PATH):
        with open(CEDAR_POLICY_PATH, "r", encoding="utf-8") as f:
            return f.read()
    return ""


# In-memory policy cache
_CACHED_POLICY = load_cedar_policy()


def create_access_token(
    officer_id: str,
    officer_name: str,
    role: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Issues a cryptographically signed HMAC-SHA256 JWT containing identity and role claims.
    Compatible with AWS Cognito token structures.
    """
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(hours=JWT_EXPIRATION_HOURS))
    payload = {
        "sub": officer_id,
        "name": officer_name,
        "role": role,
        "cognito:groups": [role],
        "iss": "jalrakshak-auth-service",
        "aud": "jalrakshak-api",
        "exp": expire,
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def verify_jwt_token(token: str) -> Dict[str, Any]:
    """
    Verifies cryptographic signature, expiry, and structure of a Bearer JWT.
    Rejects dummy string tokens with HTTP 401 Unauthorized.
    """
    if not token or not isinstance(token, str):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid Bearer token format."
        )

    # Reject plain dummy string tokens (e.g. 'incident_commander') immediately
    token_parts = token.strip().split(".")
    if len(token_parts) != 3:
        raise HTTPException(
            status_code=401,
            detail="Malformed Bearer token: JWT must have 3 dot-separated segments."
        )

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
            audience="jalrakshak-api"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Bearer token has expired. Re-authentication required."
        )
    except jwt.InvalidTokenError as err:
        raise HTTPException(
            status_code=401,
            detail=f"Cryptographic signature verification failed: {err}"
        )


def get_cedar_engine_name() -> str:
    """Returns the active statutory authorization engine name."""
    return "cedarpy" if (CEDAR_AVAILABLE and _CACHED_POLICY) else "fallback"


def evaluate_cedar_policy_with_details(
    principal_role: str,
    action: str,
    resource_id: str = "INC-ALL"
) -> Dict[str, Any]:
    """
    Evaluates statutory permission using AWS Cedar engine (cedarpy).
    Fixes D7: Transparently states which engine decided (cedarpy vs fallback) and logs it.
    """
    if not CEDAR_AVAILABLE or not _CACHED_POLICY:
        engine = "fallback"
        allowed = False
        if principal_role == "incident_commander":
            allowed = True
        elif principal_role in ("scada_analyst", "field_operator") and action in ("read_incidents", "read_telemetry"):
            allowed = True
        logger.info(f"[CEDAR AUTH] Engine: {engine} | Decision: {'ALLOW' if allowed else 'DENY'} | Role: {principal_role} | Action: {action}")
        return {
            "allowed": allowed,
            "engine": engine,
            "policy": "deterministic-statutory-rules"
        }

    engine = "cedarpy"
    request = {
        "principal": f'JalRakshak::Role::"{principal_role}"',
        "action": f'JalRakshak::Action::"{action}"',
        "resource": f'JalRakshak::Incident::"{resource_id}"',
        "context": {}
    }

    entities = [
        {"uid": {"type": "JalRakshak::Role", "id": principal_role}, "attrs": {}, "parents": []},
        {"uid": {"type": "JalRakshak::Incident", "id": resource_id}, "attrs": {}, "parents": []}
    ]

    try:
        result = cedarpy.is_authorized(request, _CACHED_POLICY, entities)
        allowed = (str(result.decision) == "Decision.Allow" or result.decision == cedarpy.Decision.Allow)
        logger.info(f"[CEDAR AUTH] Engine: {engine} | Decision: {'ALLOW' if allowed else 'DENY'} | Role: {principal_role} | Action: {action}")
        return {
            "allowed": allowed,
            "engine": engine,
            "decision": str(result.decision),
            "policy_source": "policies/incident_policy.cedar"
        }
    except Exception as exc:
        logger.error(f"[CEDAR AUTH] Error during cedarpy evaluation: {exc}")
        return {"allowed": False, "engine": engine, "error": str(exc)}


def evaluate_cedar_policy(
    principal_role: str,
    action: str,
    resource_id: str = "INC-ALL"
) -> bool:
    """Evaluates permission using AWS Cedar. Backwards-compatible bool wrapper."""
    details = evaluate_cedar_policy_with_details(principal_role, action, resource_id)
    return details["allowed"]
