import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  Users, 
  Building, 
  GraduationCap, 
  Route, 
  FileText, 
  Radio, 
  Sparkles,
  Send,
  Edit3,
  ThumbsUp,
  Share2,
  HelpCircle,
  Truck,
  Volume2,
  VolumeX,
  Activity,
  LineChart,
  Scan,
  Maximize2,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  X,
  Compass,
  Layers,
  Check,
  Lock
} from 'lucide-react';
import { emergencyAudio } from '../../utils/audioAlert';
import WhatIfImpactSimulator from './WhatIfImpactSimulator';
import CVBoundingBoxOverlay from '../CitizenPWA/CVBoundingBoxOverlay';

export default function ActionPlanPanel({ 
  incident, 
  onApproveAction, 
  onModifyAction, 
  onOpenGIS,
  currentUser,
  onOpenLogin,
  onSwitchToFieldOps
}) {
  const [activePanelTab, setActivePanelTab] = useState('tactical'); // 'tactical', 'whatif', 'vision'
  const [selectedLang, setSelectedLang] = useState('english');
  const [isApprovingAll, setIsApprovingAll] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [modifyText, setModifyText] = useState('');
  const [modifyingActionId, setModifyingActionId] = useState(null);
  const [isAudioBroadcasting, setIsAudioBroadcasting] = useState(false);

  // RBAC Permission Check: Incident Commander holds statutory authorization
  const canApprove = currentUser?.permissions?.canApproveActions ?? true;

  // Multi-Action Selection Checkboxes
  const [selectedActionIds, setSelectedActionIds] = useState([]);

  // Ground Reality Mini-PIP Map Modal
  const [pipMapAction, setPipMapAction] = useState(null);

  // P5 Broadcast preview toggle inside action card
  const [expandedBroadcast, setExpandedBroadcast] = useState(false);

  // Sync selected actions whenever incident changes
  useEffect(() => {
    if (incident?.recommended_actions) {
      const pendingIds = incident.recommended_actions
        .filter(a => a.status !== 'APPROVED')
        .map(a => a.id);
      setSelectedActionIds(pendingIds);
    }
  }, [incident?.id, incident?.recommended_actions]);

  // Listen for JudgeDemoTour event to open What-If panel
  useEffect(() => {
    const handleOpenWhatIf = () => setActivePanelTab('whatif');
    window.addEventListener('jalrakshak:openWhatIf', handleOpenWhatIf);
    return () => window.removeEventListener('jalrakshak:openWhatIf', handleOpenWhatIf);
  }, []);

  if (!incident) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-white p-8 text-center border border-slate-200 shadow-xs">
        <ShieldAlert className="h-12 w-12 text-slate-400 mb-3" />
        <h4 className="text-base font-bold text-slate-700">No Incident Selected</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Select an incident from the Active Incidents Queue or click a hotspot on the Live City Map to inspect recommendations.
        </p>
      </div>
    );
  }

  const actionsList = incident.recommended_actions || [];
  const pendingActions = actionsList.filter(a => a.status !== 'APPROVED');
  const allApproved = actionsList.length > 0 && actionsList.every(a => a.status === 'APPROVED');
  const selectedPendingActions = pendingActions.filter(a => selectedActionIds.includes(a.id));

  // Multi-Action Approval Execution
  const handleApproveSelected = async () => {
    if (selectedPendingActions.length === 0) return;
    setIsApprovingAll(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#059669', '#0284c7']
      });

      for (const action of selectedPendingActions) {
        await onApproveAction(action.id);
      }
    } finally {
      setIsApprovingAll(false);
    }
  };

  const handleStartModify = (action) => {
    setModifyingActionId(action.id);
    setModifyText(action.action);
    setIsModifying(true);
  };

  const handleSaveModify = async () => {
    if (modifyingActionId && modifyText) {
      await onModifyAction(modifyingActionId, modifyText);
      setIsModifying(false);
      setModifyingActionId(null);
    }
  };

  const handlePlayVoiceBroadcast = async () => {
    if (isAudioBroadcasting) {
      emergencyAudio.stopAll();
      setIsAudioBroadcasting(false);
      return;
    }

    const engText = incident.alerts_content?.english || "Severe flood alert issued. Evacuate low lying areas.";
    const hiText = incident.alerts_content?.hindi || "बाढ़ चेतावनी जारी। निचले इलाकों से सुरक्षित स्थानों पर जाएं।";

    await emergencyAudio.playFullDisasterBroadcast(
      engText, 
      hiText, 
      (state) => setIsAudioBroadcasting(state)
    );
  };

  // Ground Reality GIS metadata resolver for Mini-PIP Map
  const getActionGISMetadata = (action) => {
    if (!action) return null;
    const actLower = (action.action || '').toLowerCase();
    const resId = action.resource_id || '';

    if (resId.includes('PUMP') || actLower.includes('pump') || actLower.includes('outfall')) {
      return {
        landmark: "Outfall D-17 (Mithi River Tidal Confluence)",
        coords: "19.0688° N, 72.8796° E",
        elevation: "2.4m Above Mean Sea Level",
        waterDepth: `${incident.telemetry?.flood_depth_cm || 38} cm`,
        route: "Dadar Depot ➔ BKC Elevated Connector ➔ Outfall D-17 (6.8 km)",
        tacticalObjective: "High-volume dewatering into Mithi tidal channel to relieve 98% storm drain saturation.",
        assetType: "1000 GPM High-Head Diesel Pump P-04"
      };
    }
    if (actLower.includes('traffic') || actLower.includes('diversion') || actLower.includes('lbs')) {
      return {
        landmark: "LBS Marg & BKC Connector Junction",
        coords: "19.0580° N, 72.8710° E",
        elevation: "4.8m (Elevated Causeway)",
        waterDepth: "12 cm (Passable via Flyover)",
        route: "Kurla South Traffic Post ➔ LBS Diversion Cordon",
        tacticalObjective: "Reroute 8,500 PCU/hr traffic from inundated LBS low-point to elevated BKC corridor.",
        assetType: "Traffic Police Mobile Flying Squad"
      };
    }
    if (actLower.includes('hospital') || actLower.includes('bhabha')) {
      return {
        landmark: "Bhabha Municipal General Hospital (Sector B)",
        coords: "19.0645° N, 72.8750° E",
        elevation: "3.2m (Basement Generator Pit at Risk)",
        waterDepth: "22 cm on access road",
        route: "Direct On-Site Emergency Crew",
        tacticalObjective: "Deploy submersible sump pumps & sandbag perimeter around critical ICU power backup generators.",
        assetType: "Disaster Health Protection Detail"
      };
    }
    if (actLower.includes('school') || actLower.includes('evacuat')) {
      return {
        landmark: "Ward 17 Education Cluster (St. Jude & Holy Cross)",
        coords: "19.0660° N, 72.8820° E",
        elevation: "3.6m",
        waterDepth: "18 cm localized pooling",
        route: "School Evacuation Safe Corridor ➔ Kurla High Ground",
        tacticalObjective: "Coordinate staggered school dismissal before evening high-tide peak at 18:30 hrs.",
        assetType: "Education Cell Rapid Transit Buses"
      };
    }
    return {
      landmark: "Ward 17 Emergency Telecom Tower & Siren Grid",
      coords: "19.0688° N, 72.8796° E",
      elevation: "Cell Broadcast Coverage: 100% Ward Area",
      waterDepth: "N/A (Over-the-Air Telecom)",
      route: "Amazon SNS ➔ Telco Cell Broadcast Center (CBC)",
      tacticalObjective: "Push geo-fenced multilingual SMS alert and sound audible municipal sirens across Ward 17.",
      assetType: "Amazon SNS + Telco Cell Broadcast (CBC)"
    };
  };

  // Dynamic button label computation
  const getApproveButtonLabel = () => {
    if (isApprovingAll) return 'Authorizing Actions...';
    if (selectedPendingActions.length === pendingActions.length && pendingActions.length > 0) {
      return `APPROVE & EXECUTE ALL (${pendingActions.length})`;
    }
    if (selectedPendingActions.length > 0) {
      return `APPROVE SELECTED (${selectedPendingActions.length})`;
    }
    return 'APPROVE SELECTED (0)';
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white border border-slate-200 p-3.5 sm:p-4 shadow-xs overflow-y-auto">
      
      {/* Incident Header (Tightly Structured) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-4 w-4 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 font-black text-[10px] border border-emerald-300">
              3
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
              TACTICAL DECISION CENTER (NDMA Review & Sign-Off)
            </span>
            <span className={`rounded-full px-2 py-0.2 text-[10px] font-black tracking-wider uppercase border ${
              incident.severity === 'CRITICAL'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {incident.severity} RISK
            </span>
            <span className="text-xs font-bold text-slate-700">{incident.ward_name}</span>
            <span className="text-[10px] text-slate-400 font-mono">ID: {incident.id}</span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            {incident.title}
          </h2>
        </div>

        {/* Dynamic Multi-Action Authorization Button */}
        <div className="flex items-center gap-2">
          {allApproved ? (
            <span className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700 border border-emerald-300 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              PLAN FULLY AUTHORIZED & DISPATCHED
            </span>
          ) : !canApprove ? (
            <button
              type="button"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition-all bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 shadow-xs"
              title={`Logged in as ${currentUser?.title || 'User'}. Click to switch to Incident Commander role.`}
            >
              <Lock className="h-3.5 w-3.5 text-amber-600" />
              <span>🔒 Incident Commander Sign-Off Required (NDMA Sec 4.3)</span>
            </button>
          ) : (
            <button
              onClick={handleApproveSelected}
              disabled={isApprovingAll || selectedPendingActions.length === 0}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-black transition-all active:scale-95 ${
                selectedPendingActions.length === 0
                  ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md'
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>{getApproveButtonLabel()}</span>
            </button>
          )}
        </div>
      </div>

      {/* Feature Navigation Tabs (With Informative Micro-Badges) */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pt-2 pb-2">
        <div className="flex items-center gap-1.5 text-xs flex-wrap">
          {/* TAB 1: TACTICAL ACTIONS */}
          <button
            onClick={() => setActivePanelTab('tactical')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold transition-all ${
              activePanelTab === 'tactical'
                ? 'bg-blue-50 text-blue-700 border border-blue-300 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5 text-blue-600" />
            <span>Tactical Action Directives</span>
            <span className="rounded-full bg-blue-100 text-blue-800 px-1.5 py-0.2 text-[10px] font-black border border-blue-200">
              {actionsList.length} Directives
            </span>
          </button>

          {/* TAB 2: PREDICTIVE WHAT-IF MODEL */}
          <button
            onClick={() => setActivePanelTab('whatif')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold transition-all ${
              activePanelTab === 'whatif'
                ? 'bg-purple-50 text-purple-700 border border-purple-300 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LineChart className="h-3.5 w-3.5 text-purple-600" />
            <span>Predictive "What-If" Inundation Model</span>
            <span className="rounded-full bg-purple-100 text-purple-800 px-1.5 py-0.2 text-[10px] font-black border border-purple-200">
              {((incident.impact_assessment?.exposed_population || 8420) / 1000).toFixed(1)}k Pop
            </span>
          </button>

          {/* TAB 3: FIELD VISION REKOGNITION CLAUDE 3.5 */}
          <button
            onClick={() => setActivePanelTab('vision')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold transition-all ${
              activePanelTab === 'vision'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-300 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Scan className="h-3.5 w-3.5 text-indigo-600" />
            <span>Field Vision Rekognition Claude 3.5</span>
            <span className="rounded-full bg-indigo-100 text-indigo-800 px-1.5 py-0.2 text-[10px] font-black border border-indigo-200">
              {incident.telemetry?.citizen_reports_count || 6} Photos
            </span>
          </button>
        </div>

        {/* Global Web Audio Siren & TTS Broadcast Button */}
        <button
          onClick={handlePlayVoiceBroadcast}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all shadow-xs ${
            isAudioBroadcasting
              ? 'bg-rose-600 text-white shadow-rose-200 animate-pulse'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
          }`}
        >
          {isAudioBroadcasting ? (
            <>
              <VolumeX className="h-3 w-3" />
              <span>STOP SIREN</span>
              <div className="flex items-center gap-0.5 ml-1">
                <span className="w-1 h-2.5 bg-white rounded-full animate-bounce"></span>
                <span className="w-1 h-3.5 bg-white rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
              </div>
            </>
          ) : (
            <>
              <Volume2 className="h-3 w-3" />
              <span>TEST MUNICIPAL SIREN & TTS</span>
            </>
          )}
        </button>
      </div>

      {/* VIEW 1: PREDICTIVE WHAT-IF SIMULATOR */}
      {activePanelTab === 'whatif' && (
        <div className="pt-3">
          <WhatIfImpactSimulator incident={incident} />
        </div>
      )}

      {/* VIEW 2: COMPUTER VISION BOUNDING BOX DIAGNOSTIC */}
      {activePanelTab === 'vision' && (
        <div className="pt-3">
          <CVBoundingBoxOverlay 
            category={incident.category}
            depthEstimate={`${incident.telemetry?.flood_depth_cm || 38} cm`}
            passability="IMPASSABLE FOR LIGHT VEHICLES"
            reporterName="Citizen Field Telemetry"
          />
        </div>
      )}

      {/* VIEW 3: TACTICAL ACTION DIRECTIVES (1080p ZERO-SCROLL ACTIONABLE VIEW) */}
      {activePanelTab === 'tactical' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 pt-3">
          
          {/* Left Column: Explainability & Impact (5 cols - Compact & Tight Vertical Spacing) */}
          <div className="lg:col-span-5 space-y-2">
            
            {/* Explainability ("Why did AI flag this?") */}
            <div className="rounded-xl bg-slate-50 p-2.5 sm:p-3 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Why did AI flag this as {incident.severity}?
                  </h4>
                </div>
                <span className="rounded-md bg-blue-100 text-blue-800 px-1.5 py-0.2 text-[10px] font-black border border-blue-200">
                  Confidence: {Math.round((incident.explainability?.confidence || 0.94) * 100)}%
                </span>
              </div>

              <div className="space-y-1">
                {(incident.explainability?.factors || []).map((item, idx) => (
                  <div key={idx} className="rounded-lg bg-white p-1.5 px-2 text-xs border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-[11px]">{item.factor}</span>
                      <span className="font-black text-blue-600 text-[11px]">{item.weight}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-tight mt-0.5">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Assessment Card */}
            <div className="rounded-xl bg-slate-50 p-2.5 sm:p-3 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-blue-600" />
                  Impact Assessment (GIS Demographics)
                </h4>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Live Sensor Mesh</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs mb-2">
                <div className="rounded-lg bg-white p-1.5 px-2 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block">Exposed Citizens</span>
                  <strong className="text-sm font-black text-slate-900 leading-none">
                    {incident.impact_assessment?.exposed_population?.toLocaleString() || '8,420'}
                  </strong>
                </div>
                <div className="rounded-lg bg-white p-1.5 px-2 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block">Hospitals at Risk</span>
                  <strong className="text-sm font-black text-amber-700 leading-none">
                    {incident.impact_assessment?.hospitals_count || 1} Hospital
                  </strong>
                </div>
              </div>

              {/* Critical Infrastructure Breakdown (Tight lines) */}
              <div className="text-[10px] text-slate-700 space-y-1 border-t border-slate-200 pt-1.5">
                {incident.impact_assessment?.hospitals_names?.length > 0 && (
                  <div className="flex items-start gap-1.5">
                    <Building className="h-3 w-3 text-rose-600 shrink-0 mt-0.5" />
                    <span className="truncate"><strong>Hospital:</strong> {incident.impact_assessment.hospitals_names.join(', ')}</span>
                  </div>
                )}
                {incident.impact_assessment?.schools_names?.length > 0 && (
                  <div className="flex items-start gap-1.5">
                    <GraduationCap className="h-3 w-3 text-amber-600 shrink-0 mt-0.5" />
                    <span className="truncate"><strong>Schools:</strong> {incident.impact_assessment.schools_names.join(', ')}</span>
                  </div>
                )}
                {incident.impact_assessment?.critical_roads?.length > 0 && (
                  <div className="flex items-start gap-1.5">
                    <Route className="h-3 w-3 text-blue-600 shrink-0 mt-0.5" />
                    <span className="truncate"><strong>Corridors:</strong> {incident.impact_assessment.critical_roads.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Statutory SOP RAG Citation */}
            {incident.rag_reference && (
              <div className="rounded-xl bg-amber-50/80 p-2 sm:p-2.5 border border-amber-200 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 text-amber-800 mb-0.5 font-bold">
                  <FileText className="h-3 w-3 text-amber-600" />
                  <span className="uppercase tracking-wider text-[10px]">Statutory SOP RAG Citation</span>
                </div>
                <p className="font-extrabold text-slate-900 text-[10px]">
                  {incident.rag_reference.statutory_reference} ({incident.rag_reference.sop_id})
                </p>
                <p className="text-[10px] text-slate-600 italic leading-tight mt-0.5">
                  "{incident.rag_reference.rationale}"
                </p>
              </div>
            )}

          </div>

          {/* Right Column: Tactical Action Execution (7 cols - Compact Padding, Fit P1-P5 Without Scrolling) */}
          <div className="lg:col-span-7 max-h-[580px] overflow-y-auto pr-1.5 custom-thin-scrollbar space-y-2">
            
            {/* Priority Actions Header with Bulk Selection */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-blue-600" />
                  Prioritized Tactical Actions (Human Authorization Required)
                </h3>
              </div>

              {/* Bulk Toggle Button */}
              {pendingActions.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedPendingActions.length === pendingActions.length) {
                      setSelectedActionIds([]);
                    } else {
                      setSelectedActionIds(pendingActions.map(a => a.id));
                    }
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {selectedPendingActions.length === pendingActions.length ? (
                    <>
                      <CheckSquare className="h-3.5 w-3.5 text-blue-600" />
                      <span>Deselect All</span>
                    </>
                  ) : (
                    <>
                      <Square className="h-3.5 w-3.5 text-slate-400" />
                      <span>Select All Pending ({pendingActions.length})</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Action Cards List (P1 to P5 rendered with py-2.5 px-3 density) */}
            <div className="space-y-2">
              {actionsList.map((action) => {
                const isApproved = action.status === 'APPROVED';
                const isSelected = selectedActionIds.includes(action.id);
                const isBroadcastAction = action.resource_id === 'SNS-BROADCAST' || 
                  action.id === 'ACT-105' || 
                  (action.action && action.action.toLowerCase().includes('broadcast')) ||
                  (action.action && action.action.toLowerCase().includes('sms'));

                return (
                  <div
                    key={action.id}
                    className={`rounded-xl py-2.5 px-3 transition-all border ${
                      isApproved
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : isSelected
                        ? 'bg-white border-blue-300 shadow-2xs ring-1 ring-blue-100'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs opacity-90'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      
                      {/* Left: Checkbox + Priority Badge + Text */}
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        {/* Action Selection Checkbox */}
                        <div className="pt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            id={`chk-${action.id}`}
                            checked={isApproved || isSelected}
                            disabled={isApproved}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedActionIds(prev => [...prev, action.id]);
                              } else {
                                setSelectedActionIds(prev => prev.filter(id => id !== action.id));
                              }
                            }}
                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                          />
                        </div>

                        <div className="space-y-0.5 flex-1 min-w-0">
                          {/* Priority Tag & Authority Row */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="flex h-4 w-5 items-center justify-center rounded bg-blue-100 text-blue-800 font-black text-[10px] border border-blue-200 shrink-0">
                              P{action.priority}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate max-w-[130px]">
                              {action.authority}
                            </span>
                            {action.eta_minutes && (
                              <span className="flex items-center gap-0.5 text-[10px] text-slate-500 font-semibold shrink-0">
                                <Clock className="h-2.5 w-2.5 text-slate-400" />
                                ETA: {action.eta_minutes}m
                              </span>
                            )}
                            {action.resource_id && (
                              <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200/60 hidden sm:inline-flex items-center gap-0.5 shrink-0">
                                <Truck className="h-2.5 w-2.5 text-blue-600" />
                                <span>{action.resource_id}</span>
                              </span>
                            )}
                          </div>

                          {/* Action Directive Description */}
                          <p className="text-xs font-bold text-slate-900 leading-snug">
                            {action.action}
                          </p>

                          {/* Approval Status Stamp */}
                          {isApproved && action.approved_by && (
                            <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              <span>Authorized by {action.approved_by} at {action.approved_at || '14:22 hrs'}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Action Execution Controls */}
                      <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                        
                        {/* 📍 View on GIS Button (Action-to-Map Direct Spatial Context) */}
                        <button
                          type="button"
                          onClick={() => setPipMapAction(action)}
                          className="flex items-center gap-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 px-2 py-1 text-xs font-bold transition-all shrink-0 active:scale-95 shadow-2xs"
                          title="Open Ground Reality GIS HUD & Map Coordinates"
                        >
                          <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                          <span className="text-[11px] whitespace-nowrap">View on GIS</span>
                        </button>

                        {/* Status / Approval Controls */}
                        {isApproved ? (
                          <span className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-800 border border-emerald-300 shrink-0">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span className="text-[10px]">DISPATCHED</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStartModify(action)}
                              className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 border border-slate-200 transition-all flex items-center gap-0.5 shrink-0"
                              title="Modify action parameters inline"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span className="text-[11px]">Edit</span>
                            </button>

                            {/* Individual Subtle Outline Approve Button (Primary Bulk CTA Dominates) */}
                            {!canApprove ? (
                              <button
                                type="button"
                                onClick={onOpenLogin}
                                className="flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-all shrink-0"
                                title="Statutory sign-off reserved for Incident Commander (NDMA Sec 4.3). Click to switch role."
                              >
                                <Lock className="h-3 w-3 text-amber-600" />
                                <span className="text-[11px]">Sign-off Locked</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onApproveAction(action.id)}
                                className="flex items-center gap-1 rounded-lg border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 px-2 py-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-all active:scale-95 shrink-0"
                                title="Approve this single directive"
                              >
                                <CheckCircle2 className="h-3 w-3 text-slate-400 group-hover:text-emerald-600" />
                                <span className="text-[11px]">Approve</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* P5 CITIZEN BROADCAST PREVIEW COLLAPSIBLE (Inspect SMS Before Approval) */}
                    {isBroadcastAction && (
                      <div className="mt-2 pt-2 border-t border-slate-100 pl-6">
                        <button
                          type="button"
                          onClick={() => setExpandedBroadcast(!expandedBroadcast)}
                          className="flex items-center justify-between w-full text-left py-1 px-2 rounded-lg bg-purple-50 hover:bg-purple-100/80 text-purple-900 border border-purple-200/80 transition-colors"
                        >
                          <span className="flex items-center gap-1.5 flex-wrap">
                            <Radio className="h-3.5 w-3.5 text-purple-600 animate-pulse shrink-0" />
                            <span className="text-[11px] font-bold">Citizen Warning Broadcast Message:</span>
                            <span className="flex items-center gap-1">
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-purple-200 text-purple-900 border border-purple-300">EN</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-purple-200 text-purple-900 border border-purple-300">हिन्दी</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-purple-200 text-purple-900 border border-purple-300">मराठी</span>
                            </span>
                          </span>
                          <span className="text-[10px] font-bold text-purple-700 flex items-center gap-0.5 shrink-0">
                            {expandedBroadcast ? (
                              <><span>Hide Message</span><ChevronUp className="h-3 w-3" /></>
                            ) : (
                              <><span>Inspect Alert Copy</span><ChevronDown className="h-3 w-3" /></>
                            )}
                          </span>
                        </button>

                        {expandedBroadcast && (
                          <div className="mt-2 bg-slate-50 rounded-xl p-2.5 border border-purple-200 space-y-2 animate-fade-in">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold text-slate-500">Live Alert Copy Before Dispatch</span>
                              <div className="flex items-center gap-1">
                                {[
                                  { id: 'english', label: 'EN' },
                                  { id: 'hindi', label: 'हिन्दी' },
                                  { id: 'marathi', label: 'मराठी' }
                                ].map(lang => (
                                  <button
                                    key={lang.id}
                                    type="button"
                                    onClick={() => setSelectedLang(lang.id)}
                                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase transition-all ${
                                      selectedLang === lang.id
                                        ? 'bg-purple-600 text-white shadow-2xs'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                    }`}
                                  >
                                    {lang.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="bg-white p-2 rounded-lg border border-purple-100 font-mono text-[11px] text-slate-800 leading-snug">
                              {incident.alerts_content?.[selectedLang] || "EMERGENCY: High flood risk in Ward 17 (Kurla). LBS Marg submerged (35cm). Avoid area; use BKC Connector. Emergency Help: 1077."}
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                              <span>Recipients: 18,400 registered phones • Cell Broadcast (CBC)</span>
                              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                                <Check className="h-3 w-3" /> Pre-validated by RAG SOP
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* INLINE ACTION MODIFIER: Appears directly inside this card */}
                    {modifyingActionId === action.id && (
                      <div className="mt-2 pt-2 border-t border-blue-200 bg-blue-50/50 p-2.5 rounded-xl space-y-1.5 animate-fade-in pl-6">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                            <Edit3 className="h-3 w-3 text-blue-600" />
                            Modify Tactical Directive (Human-in-the-Loop)
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">P{action.priority} • {action.authority}</span>
                        </div>
                        <textarea
                          value={modifyText}
                          onChange={(e) => setModifyText(e.target.value)}
                          rows={2}
                          className="w-full rounded-lg bg-white p-2 text-xs text-slate-900 border border-blue-400 focus:border-blue-600 focus:outline-none font-medium shadow-xs"
                          autoFocus
                          placeholder="Enter revised operational order..."
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => { setIsModifying(false); setModifyingActionId(null); }}
                            className="rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveModify}
                            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1 text-xs font-bold text-white shadow-xs active:scale-95 transition-all"
                          >
                            Save & Authorize Modified Action
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* MINI-PIP GROUND REALITY GIS MODAL (Triggered by [📍 View on Map]) */}
      {pipMapAction && (() => {
        const meta = getActionGISMetadata(pipMapAction);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 text-white space-y-4">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <span>Ground Reality GIS Deployment</span>
                      <span className="rounded bg-blue-500/20 text-blue-300 text-[10px] px-1.5 py-0.2 border border-blue-400/30">
                        P{pipMapAction.priority} Directive
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {pipMapAction.action}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPipMapAction(null)}
                  className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Simulated Tactical GIS Radar/Grid Card */}
              <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 overflow-hidden">
                {/* Background radar grid pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-cyan-400 text-[11px] flex items-center gap-1.5">
                      <Compass className="h-3.5 w-3.5 animate-spin [animation-duration:10s]" />
                      TARGET LOCATION: {meta.landmark}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {meta.coords}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-slate-900/80 p-2 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Ground Inundation Depth</span>
                      <strong className="text-sm font-black text-rose-400">{meta.waterDepth}</strong>
                    </div>
                    <div className="rounded-lg bg-slate-900/80 p-2 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Topographic Elevation</span>
                      <strong className="text-sm font-black text-amber-300">{meta.elevation}</strong>
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                      <Truck className="h-3.5 w-3.5" />
                      <span>{meta.assetType}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-snug">
                      <strong>Tactical Objective:</strong> {meta.tacticalObjective}
                    </p>
                    <p className="text-slate-400 text-[10px] font-mono pt-1 border-t border-slate-800/80">
                      Dispatch Corridor: {meta.route}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setPipMapAction(null)}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Close Preview
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPipMapAction(null);
                    if (onOpenGIS) {
                      onOpenGIS(pipMapAction);
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg active:scale-95 transition-all"
                >
                  <span>Open Full Live GIS Map</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
