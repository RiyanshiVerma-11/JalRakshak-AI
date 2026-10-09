// AWS Cedar Policy Definition for JalRakshak AI
// Statutory Incident Command Authorization & Least-Privilege RBAC
// Grounded in NDMA 2024 Chapter 4 & Disaster Management Act 2005 (Sec 30 & 34)

// 1. Municipal Incident Commander (Tier 1 Apex Command)
permit(
    principal in JalRakshak::Role::"incident_commander",
    action in [
        JalRakshak::Action::"read_incidents",
        JalRakshak::Action::"approve_action",
        JalRakshak::Action::"dispatch_resource",
        JalRakshak::Action::"broadcast_sns",
        JalRakshak::Action::"simulate_scenario"
    ],
    resource
);

// 2. SCADA Systems Analyst & Telemetry Engineer
permit(
    principal in JalRakshak::Role::"scada_analyst",
    action in [
        JalRakshak::Action::"read_incidents",
        JalRakshak::Action::"read_telemetry",
        JalRakshak::Action::"inspect_sensors"
    ],
    resource
);

// 3. Field Response Teams & Logistics Operators
permit(
    principal in JalRakshak::Role::"field_operator",
    action in [
        JalRakshak::Action::"read_incidents",
        JalRakshak::Action::"update_status"
    ],
    resource
);

permit(
    principal in JalRakshak::Role::"field_responder",
    action in [
        JalRakshak::Action::"read_incidents",
        JalRakshak::Action::"update_status"
    ],
    resource
);

// 4. Citizen Access (Public Reporting & Advisory Ingress)
permit(
    principal in JalRakshak::Role::"citizen",
    action in [
        JalRakshak::Action::"submit_report",
        JalRakshak::Action::"read_advisories"
    ],
    resource
);

// 5. Explicit Denial of Sensitive Command Actions to Citizens
forbid(
    principal in JalRakshak::Role::"citizen",
    action in [
        JalRakshak::Action::"approve_action",
        JalRakshak::Action::"dispatch_resource",
        JalRakshak::Action::"broadcast_sns"
    ],
    resource
);
