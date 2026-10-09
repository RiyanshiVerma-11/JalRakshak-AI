# Security Policy

## Demo Credentials & Non-Production Disclosures

JalRakshak AI is built for the **WeMakeDevs × AWS Environmental Hacks** hackathon under the **Build It** route.

### 1. Demo Credentials Notice
The following default demo credentials are provided exclusively for local judging and evaluation convenience:
- `commander123` (Municipal Incident Commander)
- `field123` (Tactical Field Responder / Operator)
- `scada123` (Hydrology & SCADA Analyst)
- `citizen123` (Resident Public Stakeholder)

**THESE PASSWORDS ARE DEMO-ONLY.**
In production deployments:
- Demo passwords MUST be overridden via environment variables:
  - `DEMO_PASSWORD_COMMANDER`
  - `DEMO_PASSWORD_FIELD`
  - `DEMO_PASSWORD_SCADA`
  - `DEMO_PASSWORD_CITIZEN`
- Or replaced entirely by a production federated IdP such as **Amazon Cognito** or municipal single sign-on (SSO).

### 2. Cryptographic JWT Secret
In default offline demo mode (`DEMO_MODE=true`), a hardcoded fallback string is accepted so judges do not need to configure environment variables.
In production (`DEMO_MODE=false`), `backend/auth/cedar_auth.py` strictly raises `RuntimeError` unless a cryptographically strong `JWT_SECRET_KEY` environment variable is explicitly provided.

### 3. AWS Credentials & Least Privilege
- The repository contains **ZERO AWS credentials, secrets, private keys, or `.pem` certificates**.
- All cloud infrastructure defined in `aws_infra/template.yaml` strictly adheres to the **Principle of Least Privilege (PoLP)** with scoped IAM roles (`StrandsExecutionRole`, `CitizenIngestExecutionRole`).
- The application never transmits credentials or sensitive data over unencrypted channels.

### 4. Reporting Vulnerabilities
If you discover a real security vulnerability in JalRakshak AI, please report it responsibly:
- **Email:** `security@jalrakshak.org` or open a private GitHub Security Advisory.
- Please do not disclose vulnerabilities publicly until our team has reviewed and addressed them.
