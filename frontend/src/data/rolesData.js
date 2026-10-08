/**
 * JalRakshak AI — Role-Based Access Control (RBAC) & Persona Management
 * Strictly aligned with:
 * 1. Statutory NDMA Incident Command System (ICS) - Disaster Management Act 2005
 * 2. AWS Well-Architected Framework: Security Pillar (Principle of Least Privilege)
 * 3. Amazon Cognito User Pool Claims & AWS IAM Role Mappings
 */

export const ROLES = {
  INCIDENT_COMMANDER: 'incident_commander',
  FIELD_RESPONDER: 'field_responder',
  SCADA_ANALYST: 'scada_analyst',
  CITIZEN: 'citizen'
};

export const PERSONAS = [
  {
    role: ROLES.INCIDENT_COMMANDER,
    id: 'OFFICER_PATIL_EOC',
    name: 'IAS Shrikar Patil',
    title: 'Municipal Incident Commander',
    department: 'Brihanmumbai Disaster Management Authority (BMC EOC)',
    icsTier: 'Tier 1: Incident Commander (ICS-400 Certified)',
    avatar: '👨‍💼',
    badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-700',
    accentColor: 'from-rose-600 to-amber-600',
    statutoryAuthority: 'Section 4.3, NDMA Urban Flooding Protocols 2024 & DMA 2005 Sec 30',
    iamRoleArn: 'arn:aws:iam::123456789012:role/JalRakshak-IncidentCommanderRole',
    cognitoGroup: 'ap-south-1_JalRakshak_Commanders',
    description: 'Supreme human-in-the-loop executive with full statutory sign-off authority for multi-crore asset dispatch and citywide emergency alerts.',
    permissions: {
      canApproveActions: true,
      canModifyActions: true,
      canBroadcastSNS: true,
      canSimulateWhatIf: true,
      canAccessCommandCenter: true,
      canAccessFieldOps: true,
      canAccessCopilot: true,
      canAccessAWSArch: true,
      canAccessCitizenPWA: true,
      canUpdateFieldStatus: true
    },
    allowedActions: [
      'Statutory Human-in-the-Loop 1-Click Action Authorization',
      'Deploy 1000 GPM Dewatering Pumps, NDRF Inflatable Boats & Heat Care Vans',
      'Authorize Multilingual Mass SMS Alerts via Amazon SNS',
      'Issue Precautionary School & Hospital Evacuation Orders',
      'What-If Climate Impact Simulation Parameter Overrides'
    ],
    restrictedActions: []
  },
  {
    role: ROLES.FIELD_RESPONDER,
    id: 'NDRF_UNIT_08',
    name: 'Insp. Rajesh Yadav',
    title: 'Tactical Field Operations Lead',
    department: 'NDRF 8th Battalion & Ward L Quick Response Team',
    icsTier: 'Tier 3: Tactical Operations & Logistics Division (ICS-200)',
    avatar: '👷‍♂️',
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-700',
    accentColor: 'from-emerald-600 to-teal-600',
    statutoryAuthority: 'NDMA Standard Operating Procedure for Ground First Responders',
    iamRoleArn: 'arn:aws:iam::123456789012:role/JalRakshak-FieldResponderRole',
    cognitoGroup: 'ap-south-1_JalRakshak_FieldResponders',
    description: 'Ground tactical operative responsible for physical execution of dispatched directives, pump deployment, and geotagged evidence reporting.',
    permissions: {
      canApproveActions: false, // PoLP: Ground troops execute, commander authorizes
      canModifyActions: false,
      canBroadcastSNS: false,
      canSimulateWhatIf: false,
      canAccessCommandCenter: true,
      canAccessFieldOps: true,
      canAccessCopilot: true,
      canAccessAWSArch: false,
      canAccessCitizenPWA: true,
      canUpdateFieldStatus: true
    },
    allowedActions: [
      'View Real-Time Assigned Tactical Mission Manifest',
      '1-Tap Status Updates: "En Route" ➔ "Arrived on Scene" ➔ "Pumping Active"',
      'Submit Geotagged Field Photo Proof to Command Center',
      'Inspect Micro-Elevation & Obstruction GIS Overlays',
      'Direct Voice Dispatch Link to Municipal EOC'
    ],
    restrictedActions: [
      'Cannot approve or reassign unassigned civic assets',
      'Cannot broadcast citywide emergency SMS notifications',
      'Cannot modify statutory SOP guidelines or thresholds'
    ]
  },
  {
    role: ROLES.SCADA_ANALYST,
    id: 'ANALYST_VERMA_SCADA',
    name: 'Dr. Ananya Verma',
    title: 'Chief Hydrologist & SCADA Analyst',
    department: 'Civic Environmental Telemetry & Water Systems Directorate',
    icsTier: 'Tier 2: Planning & Technical Intelligence Section (ICS-300)',
    avatar: '👩‍🔬',
    badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-700',
    accentColor: 'from-cyan-600 to-blue-600',
    statutoryAuthority: 'Central Water Commission (CWC) Technical Advisory Protocol',
    iamRoleArn: 'arn:aws:iam::123456789012:role/JalRakshak-SCADAAnalystRole',
    cognitoGroup: 'ap-south-1_JalRakshak_TechnicalAnalysts',
    description: 'Data scientist and telemetry specialist monitoring sensor grids, pipeline SCADA pressure drops, and Strands 5-Agent execution DAGs.',
    permissions: {
      canApproveActions: false, // Technical advisor, not executive commander
      canModifyActions: false,
      canBroadcastSNS: false,
      canSimulateWhatIf: true,
      canAccessCommandCenter: true,
      canAccessFieldOps: false,
      canAccessCopilot: true,
      canAccessAWSArch: true,
      canAccessCitizenPWA: true,
      canUpdateFieldStatus: false
    },
    allowedActions: [
      'Real-time SCADA Waterline Pressure & Sensor Anomaly Inspection',
      'Strands 5-Agent Multi-Agent Latency & Execution Graph Deep-Dive',
      'Configure What-If Simulation Parameters (Rainfall mm/hr, Heat Index)',
      'Inspect Computer Vision Citizen Water Depth Calibration Metrics',
      'Amazon EventBridge Telemetry Stream Diagnostics'
    ],
    restrictedActions: [
      'Cannot sign off on physical tactical deployments (Read-Only Advice)',
      'Cannot issue statutory public advisories without Commander sign-off',
      'Cannot redirect emergency funding or relief inventories'
    ]
  },
  {
    role: ROLES.CITIZEN,
    id: 'CITIZEN_AARAV_KURLA',
    name: 'Aarav Sharma',
    title: 'Verified Resident (Ward 17)',
    department: 'Citizen Public Safety & Civic Reporting Portal',
    icsTier: 'Public Stakeholder (Disaster Management Act 2005 Sec 34)',
    avatar: '🧑',
    badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-700',
    accentColor: 'from-blue-600 to-indigo-600',
    statutoryAuthority: 'Public Grievance Redressal & Right to Safety',
    iamRoleArn: 'arn:aws:iam::123456789012:role/JalRakshak-PublicCitizenRole',
    cognitoGroup: 'ap-south-1_JalRakshak_PublicUsers',
    description: 'Community resident in vulnerable ward with access to multimodal photo emergency reporting, live localized advisories, and drinking water tankers.',
    permissions: {
      canApproveActions: false,
      canModifyActions: false,
      canBroadcastSNS: false,
      canSimulateWhatIf: false,
      canAccessCommandCenter: false, // Public safety: Civic command center is restricted
      canAccessFieldOps: false,
      canAccessCopilot: true, // Citizen can ask public safety questions
      canAccessAWSArch: false,
      canAccessCitizenPWA: true,
      canUpdateFieldStatus: false
    },
    allowedActions: [
      '1-Tap Multimodal Photo Reporting (Waterlogging, Floods, Heat, Leaks)',
      'View Real-Time Localized Emergency Advisories in English, Hindi & Marathi',
      'Live GPS Tracking of Potable Water Tankers & Relief Bowsers',
      'Locate Nearest Operational Public Cooling Shelters',
      '1-Tap 1077 Municipal SOS Emergency Hotline Call'
    ],
    restrictedActions: [
      'Classified Municipal Emergency Command Center is restricted',
      'Cannot view high-security SCADA water supply valve topologies',
      'Cannot trigger emergency sirens or dispatch municipal squads'
    ]
  }
];

export const DEFAULT_USER = PERSONAS[0]; // Incident Commander by default for full capability
