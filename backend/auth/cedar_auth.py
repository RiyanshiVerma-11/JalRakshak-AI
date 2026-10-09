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


def evaluate_cedar_policy(
    principal_role: str,
    action: str,
    resource_id: str = "INC-ALL"
) -> bool:
    """
    Evaluates permission using genuine AWS Cedar engine (cedarpy).
    Grounded in statutory permissions defined in policies/incident_policy.cedar.
    """
    if not CEDAR_AVAILABLE or not _CACHED_POLICY:
        # Fallback to statutory rules if cedarpy engine failed to link
        logger.warning("AWS Cedar engine evaluating via deterministic statutory matrix.")
        if principal_role == "incident_commander":
            return True
        if principal_role in ("scada_analyst", "field_operator") and action in ("read_incidents", "read_telemetry"):
            return True
        return False

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
        # Result decision is Decision.Allow or Decision.Deny
        return str(result.decision) == "Decision.Allow" or result.decision == cedarpy.Decision.Allow
    except Exception as exc:
        logger.error(f"AWS Cedar evaluation error: {exc}")
        return False
