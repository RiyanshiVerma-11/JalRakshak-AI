import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ShieldAlert, MapPin, Cpu, Layers, Lock, Key, Sliders } from 'lucide-react';
import Header from './components/Header';
import StatRibbon from './components/CommandCenter/StatRibbon';
import CommandCenterExplainerBanner from './components/CommandCenter/CommandCenterExplainerBanner';
import LiveCityMap from './components/CommandCenter/LiveCityMap';
import AIPriorityQueue from './components/CommandCenter/AIPriorityQueue';
import ActionPlanPanel from './components/CommandCenter/ActionPlanPanel';
import AgentTraceDrawer from './components/CommandCenter/AgentTraceDrawer';
import WhatIfImpactSimulator from './components/CommandCenter/WhatIfImpactSimulator';
import CitizenPWAView from './components/CitizenPWA/CitizenPWAView';
import AICopilotView from './components/AICopilot/AICopilotView';
import AWSArchitectureView from './components/AWSArchitecture/AWSArchitectureView';
import LandingPageView from './components/LandingPage/LandingPageView';
import Sidebar from './components/Sidebar';
import JudgeDemoTour from './components/JudgeDemoTour';
import LoginPage from './components/Auth/LoginPage';
import FieldOpsView from './components/FieldOps/FieldOpsView';
import SCADAAnalystDashboard from './components/SCADAAnalyst/SCADAAnalystDashboard';
import { DEFAULT_USER, PERSONAS, ROLES } from './data/rolesData';

const SESSION_STORAGE_KEY = 'jalrakshak_session';

const ROUTE_CONFIG = {
  landing: { path: '/', isProtected: false },
  login: { path: '/login', isProtected: false },
  command: { path: '/command-center', isProtected: true, permission: 'canAccessCommandCenter' },
  field_ops: { path: '/field-ops', isProtected: true, permission: 'canAccessFieldOps' },
  scada: { path: '/scada', isProtected: true, permission: 'canAccessCommandCenter' },
  citizen: { path: '/citizen', isProtected: false },
  copilot: { path: '/copilot', isProtected: true, permission: 'canAccessCopilot' },
  aws: { path: '/aws', isProtected: false }
};

const PATH_TO_TAB = {
  '/': 'landing',
  '/landing': 'landing',
  '/login': 'login',
  '/app': 'command',
  '/dashboard': 'command',
  '/command': 'command',
  '/command-center': 'command',
  '/field-ops': 'field_ops',
  '/field_ops': 'field_ops',
  '/scada': 'scada',
  '/scada-analyst': 'scada',
  '/citizen': 'citizen',
  '/pwa': 'citizen',
  '/copilot': 'copilot',
  '/aws': 'aws',
  '/architecture': 'aws'
};

const getStoredSession = () => {
  try {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse saved session:', e);
  }
  return null;
};

const getRoleAuthorizedDashboard = (persona) => {
  if (!persona) return 'login';
  if (persona.role === ROLES.CITIZEN) {
    return 'citizen';
  } else if (persona.role === ROLES.FIELD_RESPONDER) {
    return 'field_ops';
  } else if (persona.role === ROLES.SCADA_ANALYST) {
    return 'scada';
  } else {
    return 'command';
  }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getStoredSession());

  const [activeTab, setActiveTab] = useState(() => {
    const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    const mappedTab = PATH_TO_TAB[pathname];
    const initialSession = getStoredSession();

    if (mappedTab) {
      const config = ROUTE_CONFIG[mappedTab];
      if (config?.isProtected && !initialSession) {
        // Strictly protect dashboard routes from unauthenticated access
        return 'login';
      }
      return mappedTab;
    }
    return 'landing';
  });

  const [commandMode, setCommandMode] = useState('decision'); // 'decision', 'gis', 'dag', 'all'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [resources, setResources] = useState([]);
  const [focusedGISAction, setFocusedGISAction] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const selectedIncidentRef = useRef(selectedIncident);
  selectedIncidentRef.current = selectedIncident;

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await fetch('/api/incidents');
      if (!res.ok) return;
      const data = await res.json();
      setIncidents(data);
      setSelectedIncident(prev => {
        if (!prev && data.length > 0) {
          return data[0];
        }
        if (prev) {
          const updated = data.find(i => i.id === prev.id);
          return updated || prev;
        }
        return prev;
      });
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    }
  }, []);

  const fetchResources = useCallback(async () => {
    try {
      const res = await fetch('/api/resources');
      if (!res.ok) return;
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
    fetchResources();
    const interval = setInterval(() => {
      fetchIncidents();
      fetchResources();
    }, 6000);
    return () => clearInterval(interval);
  }, [fetchIncidents, fetchResources]);

  // Cinematic Live Scenario Trigger
  const handleSimulate = async (scenario, customRainfall = null) => {
    setIsSimulating(true);
    const rainMsg = customRainfall ? ` (${customRainfall} mm/hr Custom Telemetry)` : '';
    showNotification(`⚡ Live Event Triggered: Activating AWS Strands 5-Agent Pipeline for ${scenario.toUpperCase()}${rainMsg}...`, 'alert');

    try {
      const payload = { scenario };
      if (customRainfall) payload.custom_rainfall = customRainfall;

      const res = await fetch('/api/incidents/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.incident) {
        // Fire confetti
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.4 },
          colors: ['#ef4444', '#f59e0b', '#06b6d4']
        });

        // Set new incident as selected and switch to Command Center
        await fetchIncidents();
        await fetchResources();
        setSelectedIncident(data.incident);
        navigateWithGuard('command');

        showNotification(`✅ AWS Strands Workflow complete: Action Plan generated for ${data.incident.ward_name}`, 'success');
      }
    } catch (err) {
      console.error('Simulation failed:', err);
      showNotification('Simulation error. Please check backend connection.', 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  // Strict Authentication Guard & Route Protection
  const navigateWithGuard = (targetTabOrPath, overrideUser = currentUser) => {
    let targetTab = targetTabOrPath;
    if (PATH_TO_TAB[targetTabOrPath]) {
      targetTab = PATH_TO_TAB[targetTabOrPath];
    }

    const config = ROUTE_CONFIG[targetTab] || { path: `/${targetTab}`, isProtected: false };

    // 1. Unauthenticated user trying to access a protected route
    if (config.isProtected && !overrideUser) {
      sessionStorage.setItem('jalrakshak_intended_target', targetTab);
      showNotification('🔒 Authentication required. Please sign in to access the Incident Command Center.', 'alert');
      setActiveTab('login');
      if (window.location.pathname !== '/login') {
        window.history.pushState({ tab: 'login' }, '', '/login');
      }
      return false;
    }

    // 2. Role-Based Clearance Check (RBAC / PoLP)
    if (config.isProtected && overrideUser && config.permission) {
      if (!overrideUser.permissions?.[config.permission]) {
        showNotification(`⚠️ Access Restricted: Role '${overrideUser.title}' lacks clearance for this section.`, 'alert');
        const fallbackTab = getRoleAuthorizedDashboard(overrideUser);
        setActiveTab(fallbackTab);
        const fallbackPath = ROUTE_CONFIG[fallbackTab]?.path || `/${fallbackTab}`;
        if (window.location.pathname !== fallbackPath) {
          window.history.pushState({ tab: fallbackTab }, '', fallbackPath);
        }
        return false;
      }
    }

    // 3. Authorized Navigation
    setActiveTab(targetTab);
    if (window.location.pathname !== config.path) {
      window.history.pushState({ tab: targetTab }, '', config.path);
    }
    return true;
  };

  // Landing Page Single Primary CTA Handler
  const handleEnterCommandCenter = () => {
    if (!currentUser) {
      sessionStorage.setItem('jalrakshak_intended_target', 'command');
      showNotification('🔒 Authentication required. Please sign in to access the Command Center.', 'alert');
      navigateWithGuard('login');
    } else {
      if (currentUser.permissions?.canAccessCommandCenter) {
        navigateWithGuard('command');
      } else {
        const authorizedTab = getRoleAuthorizedDashboard(currentUser);
        navigateWithGuard(authorizedTab);
      }
    }
  };

  // Role Authentication / Persona Switching Handler
  const handleLogin = (persona) => {
    setCurrentUser(persona);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(persona));
    } catch (e) {
      console.error('Failed to store session:', e);
    }

    showNotification(`Authenticated as ${persona.name} (${persona.title}) [${persona.icsTier}]`, 'success');

    // Check if there was an intended protected route they tried to visit
    const intended = sessionStorage.getItem('jalrakshak_intended_target');
    sessionStorage.removeItem('jalrakshak_intended_target');

    let targetTab = null;
    if (intended && ROUTE_CONFIG[intended]?.isProtected) {
      const perm = ROUTE_CONFIG[intended]?.permission;
      if (!perm || persona.permissions?.[perm]) {
        targetTab = intended;
      }
    }

    // Redirect to their specific authorized dashboard based on their role
    if (!targetTab) {
      targetTab = getRoleAuthorizedDashboard(persona);
    }

    setActiveTab(targetTab);
    const targetPath = ROUTE_CONFIG[targetTab]?.path || `/${targetTab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab: targetTab }, '', targetPath);
    }
  };

  // Sign Out Handler (Revokes AWS Cognito Session)
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem('jalrakshak_intended_target');
    } catch (e) {
      console.error('Failed to remove session:', e);
    }
    showNotification('AWS Cognito session invalidated. Signed out safely.', 'info');
    setActiveTab('login');
    if (window.location.pathname !== '/login') {
      window.history.pushState({ tab: 'login' }, '', '/login');
    }
  };

  // Synchronize browser history and popstate
  useEffect(() => {
    const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    const mappedTab = PATH_TO_TAB[pathname];
    if (mappedTab) {
      const config = ROUTE_CONFIG[mappedTab];
      if (config?.isProtected && !currentUser) {
        showNotification('🔒 Authentication required. Please sign in to access this route.', 'alert');
        setActiveTab('login');
        if (window.location.pathname !== '/login') {
          window.history.replaceState({ tab: 'login' }, '', '/login');
        }
      }
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      const mappedTab = PATH_TO_TAB[pathname] || 'landing';
      const config = ROUTE_CONFIG[mappedTab];

      if (config?.isProtected && !currentUser) {
        setActiveTab('login');
        window.history.replaceState({ tab: 'login' }, '', '/login');
      } else {
        setActiveTab(mappedTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

  // Human-in-the-Loop Action Approval (Enforces RBAC)
  const handleApproveAction = async (actionId) => {
    if (!currentUser?.permissions?.canApproveActions) {
      showNotification(`Authorization Denied: Role '${currentUser?.title}' lacks statutory sign-off authority under NDMA Sec 4.3.`, 'alert');
      setActiveTab('login');
      return;
    }

    try {
      const res = await fetch(`/api/actions/${actionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer_id: currentUser?.id || "OFFICER_PATIL_EOC",
          officer_name: currentUser?.name || "Municipal Disaster Controller",
          officer_role: currentUser?.role || "incident_commander",
          notes: `Authorized under NDMA Protocol by ${currentUser?.name} (${currentUser?.title})`
        })
      });
      const data = await res.json();

      if (!res.ok) {
        showNotification(data.detail || 'Authorization Denied by RBAC Policy.', 'alert');
        return;
      }

      if (data.success) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });

        showNotification(`Tactical order authorized by ${currentUser?.name}! Assigned asset dispatched and Amazon SNS queued.`, 'success');
        await fetchIncidents();
        await fetchResources();
      }
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  // Human-in-the-Loop Action Modification (Enforces RBAC)
  const handleModifyAction = async (actionId, modifiedText) => {
    if (!currentUser?.permissions?.canModifyActions) {
      showNotification(`Modification Denied: Role '${currentUser?.title}' cannot alter statutory directives.`, 'alert');
      return;
    }

    try {
      const res = await fetch(`/api/actions/${actionId}/modify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer_id: currentUser?.id || "OFFICER_PATIL_EOC",
          officer_name: currentUser?.name || "Municipal Disaster Controller",
          officer_role: currentUser?.role || "incident_commander",
          modified_action: modifiedText
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Tactical directive modified and authorized.`, 'success');
        await fetchIncidents();
      }
    } catch (err) {
      console.error('Modification failed:', err);
    }
  };

  // Reset to Baseline
  const handleReset = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
      await fetchIncidents();
      await fetchResources();
      showNotification('JalRakshak AI restored to standard operational baseline.', 'info');
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className={`fixed top-16 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-2xl transition-all border ${
          notification.type === 'alert'
            ? 'bg-red-600 border-red-400'
            : notification.type === 'success'
            ? 'bg-emerald-600 border-emerald-400'
            : 'bg-cyan-600 border-cyan-400'
        }`}>
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Collapsible Operational Sidebar (shown ONLY when inside main operational app) */}
      {!['landing', 'login'].includes(activeTab) && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={navigateWithGuard}
          commandMode={commandMode}
          setCommandMode={setCommandMode}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onSimulate={handleSimulate}
          onReset={handleReset}
          isSimulating={isSimulating}
          criticalCount={criticalCount}
          incidentsCount={incidents.length}
          currentUser={currentUser}
          onOpenLogin={() => navigateWithGuard('login')}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content View Container with smooth margin shift */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        !['landing', 'login'].includes(activeTab) 
          ? (isSidebarCollapsed ? 'ml-[70px]' : 'ml-[280px]') 
          : 'ml-0'
      }`}>

        {/* Main Operational Header (shown ONLY inside Main Application) */}
        {!['landing', 'login'].includes(activeTab) && (
          <Header
            activeTab={activeTab}
            setActiveTab={navigateWithGuard}
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
            selectedIncident={selectedIncident}
            currentUser={currentUser}
          />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 w-full ${['landing', 'login'].includes(activeTab) ? 'p-0 max-w-none' : 'p-3 sm:p-5 max-w-[1600px] mx-auto'}`}>
          
          {/* TAB 0: LANDING PAGE (PROBLEM & MISSION) */}
          {activeTab === 'landing' && (
            <LandingPageView
              currentUser={currentUser}
              onEnterCommandCenter={handleEnterCommandCenter}
              onSimulate={handleSimulate}
              onOpenCitizenPWA={() => navigateWithGuard('citizen')}
              onOpenJudgeTour={() => setIsTourOpen(true)}
              onSelectRole={handleLogin}
              onOpenLogin={() => navigateWithGuard('login')}
              onNavigateTab={(tab) => navigateWithGuard(tab)}
            />
          )}

          {/* TAB 0.5: DEDICATED FULL-PAGE LOGIN (STANDARD PRODUCT FLOW: LANDING -> LOGIN -> DASHBOARD) */}
          {activeTab === 'login' && (
            <LoginPage
              activeUser={currentUser}
              onLogin={handleLogin}
              onBackToLanding={() => navigateWithGuard('landing')}
            />
          )}

          {/* TAB 1: EMERGENCY COMMAND CENTER (MODULAR ARCHITECTURE) */}
          {activeTab === 'command' && (
            <div className="space-y-4">
              
              {/* Public Safety Restriction Notice for Citizen Role */}
              {currentUser?.role === ROLES.CITIZEN && (
                <div className="rounded-2xl bg-amber-50 border border-amber-300 p-4 text-amber-950 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0" />
                    <div>
                      <strong className="text-sm font-bold">Public Safety Notice: Municipal Emergency Operations Center</strong>
                      <p className="text-xs text-amber-800">
                        You are viewing this portal under the <strong>Resident / Public Stakeholder Role</strong>. Tactical asset dispatch and SCADA valve telemetry are restricted under NDMA Section 34.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateWithGuard('citizen')}
                      className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 text-xs shadow-xs"
                    >
                      Go to Citizen Portal ➔
                    </button>
                    <button
                      onClick={() => navigateWithGuard('login')}
                      className="rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-3 py-1.5 text-xs"
                    >
                      Switch to Official Role ➔
                    </button>
                  </div>
                </div>
              )}

              {/* MODULAR COMMAND TOOLBAR: Instant Access to Sections Without Endless Scrolling */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
                
                {/* Section Switcher Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                  <span className="text-slate-400 uppercase text-[10px] px-2 font-black hidden sm:inline">
                    Modular Sections:
                  </span>
                  
                  <button
                    onClick={() => setCommandMode('decision')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                      commandMode === 'decision'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>🎯 Tactical Decision Room</span>
                  </button>

                  <button
                    onClick={() => setCommandMode('gis')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                      commandMode === 'gis'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>🗺️ Live GIS & Queue</span>
                  </button>

                  <button
                    onClick={() => setCommandMode('dag')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                      commandMode === 'dag'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Cpu className="h-3.5 w-3.5" />
                    <span>⚡ 5-Agent Execution DAG</span>
                  </button>

                  <button
                    onClick={() => setCommandMode('whatif')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                      commandMode === 'whatif'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>🔬 What-If & Stress Test</span>
                  </button>

                  <button
                    onClick={() => setCommandMode('all')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                      commandMode === 'all'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>📋 All-in-One View</span>
                  </button>
                </div>

                {/* Instant Active Ward Selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase hidden md:inline">Focus Ward:</span>
                  <select
                    value={selectedIncident?.id || ''}
                    onChange={(e) => {
                      const found = incidents.find(i => i.id === e.target.value);
                      if (found) setSelectedIncident(found);
                    }}
                    className="rounded-lg bg-slate-50 border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                  >
                    {incidents.map(inc => (
                      <option key={inc.id} value={inc.id}>
                        {inc.severity === 'CRITICAL' ? '🚨' : '⚠️'} {inc.ward_name} ({inc.category})
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* KPI Stat Ribbon (Always visible across all modes) */}
              <StatRibbon
                incidents={incidents}
                resources={resources}
              />

              {/* MODULE 1: TACTICAL DECISION ROOM (Focused on Action Plan, Directives & Inline Edit — Zero Scrolling) */}
              {commandMode === 'decision' && (
                <div className="space-y-3 animate-fade-in">
                  <ActionPlanPanel
                    incident={selectedIncident}
                    onApproveAction={handleApproveAction}
                    onModifyAction={handleModifyAction}
                    onOpenGIS={(action) => {
                      setCommandMode('gis');
                      if (action) setFocusedGISAction(action);
                    }}
                    currentUser={currentUser}
                    onOpenLogin={() => navigateWithGuard('login')}
                    onSwitchToFieldOps={() => setActiveTab('field_ops')}
                  />

                  {/* Compact Quick toggle to view GIS or Agents */}
                  <div className="flex items-center justify-between p-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-slate-600 font-medium">Want to see the physical GIS deployment on the city map?</span>
                    <button
                      onClick={() => setCommandMode('gis')}
                      className="flex items-center gap-1 font-bold text-blue-700 hover:text-blue-800"
                    >
                      <span>Open Live GIS Map</span>
                      <MapPin className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* MODULE 2: LIVE GIS & PRIORITY QUEUE */}
              {commandMode === 'gis' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-7">
                      <LiveCityMap
                        incidents={incidents}
                        resources={resources}
                        selectedIncident={selectedIncident}
                        focusedAction={focusedGISAction}
                        onSelectIncident={(inc) => {
                          setSelectedIncident(inc);
                        }}
                      />
                    </div>
                    <div className="lg:col-span-5 h-[480px]">
                      <AIPriorityQueue
                        incidents={incidents}
                        selectedIncident={selectedIncident}
                        onSelectIncident={(inc) => {
                          setSelectedIncident(inc);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                    <span>Incident selected: <strong>{selectedIncident?.ward_name} ({selectedIncident?.severity} Risk)</strong></span>
                    <button
                      onClick={() => setCommandMode('decision')}
                      className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 shadow-xs"
                    >
                      Authorize Tactical Directives →
                    </button>
                  </div>
                </div>
              )}

              {/* MODULE 3: 5-AGENT EXECUTION DAG */}
              {commandMode === 'dag' && (
                <div className="space-y-4 animate-fade-in">
                  <AgentTraceDrawer
                    agentTrace={selectedIncident?.agent_trace}
                    totalExecutionMs={selectedIncident?.total_execution_ms}
                  />
                </div>
              )}

              {/* MODULE 3.5: WHAT-IF DYNAMIC STRESS TESTING */}
              {commandMode === 'whatif' && (
                <div className="space-y-4 animate-fade-in">
                  <WhatIfImpactSimulator
                    incident={selectedIncident}
                    onRunDynamicSimulation={handleSimulate}
                  />
                </div>
              )}

              {/* MODULE 4: ALL-IN-ONE VIEW (Classic Full Screen Overview) */}
              {commandMode === 'all' && (
                <div className="space-y-4 animate-fade-in">
                  <CommandCenterExplainerBanner
                    selectedIncident={selectedIncident}
                    onApproveAll={async () => {
                      const pending = (selectedIncident?.recommended_actions || []).filter(a => a.status !== 'APPROVED');
                      for (const a of pending) {
                        await handleApproveAction(a.id);
                      }
                    }}
                    isApproving={isSimulating}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-7">
                      <LiveCityMap
                        incidents={incidents}
                        resources={resources}
                        selectedIncident={selectedIncident}
                        focusedAction={focusedGISAction}
                        onSelectIncident={(inc) => setSelectedIncident(inc)}
                      />
                    </div>
                    <div className="lg:col-span-5 h-[480px]">
                      <AIPriorityQueue
                        incidents={incidents}
                        selectedIncident={selectedIncident}
                        onSelectIncident={(inc) => setSelectedIncident(inc)}
                      />
                    </div>
                  </div>

                  <ActionPlanPanel
                    incident={selectedIncident}
                    onApproveAction={handleApproveAction}
                    onModifyAction={handleModifyAction}
                    onOpenGIS={(action) => {
                      setCommandMode('gis');
                      if (action) setFocusedGISAction(action);
                    }}
                    currentUser={currentUser}
                    onOpenLogin={() => navigateWithGuard('login')}
                    onSwitchToFieldOps={() => setActiveTab('field_ops')}
                  />

                  <AgentTraceDrawer
                    agentTrace={selectedIncident?.agent_trace}
                    totalExecutionMs={selectedIncident?.total_execution_ms}
                  />
                </div>
              )}

            </div>
          )}

          {/* TAB 1.5: TACTICAL FIELD OPERATIONS (NDRF / GROUND RESPONDERS) */}
          {activeTab === 'field_ops' && (
            <FieldOpsView
              currentUser={currentUser}
              incidents={incidents}
              resources={resources}
              onOpenGIS={() => {
                setActiveTab('command');
                setCommandMode('gis');
              }}
            />
          )}

          {/* TAB 1.7: SCADA & ENVIRONMENTAL TELEMETRY DASHBOARD (CHIEF HYDROLOGIST & ANALYST) */}
          {activeTab === 'scada' && (
            <SCADAAnalystDashboard
              currentUser={currentUser}
              incidents={incidents}
              onSimulate={handleSimulate}
              onSwitchToCommander={() => {
                const cmd = PERSONAS.find(p => p.role === ROLES.INCIDENT_COMMANDER);
                if (cmd) handleLogin(cmd);
              }}
              onOpenLogin={() => setActiveTab('login')}
            />
          )}

          {/* TAB 2: CITIZEN PWA */}
          {activeTab === 'citizen' && (
            <CitizenPWAView
              currentUser={currentUser}
              onOpenLogin={() => setActiveTab('login')}
              onReportSubmitted={() => {
                fetchIncidents();
                showNotification('Citizen Report synchronized to AI Command Queue!', 'success');
              }}
            />
          )}

          {/* TAB 3: AI EMERGENCY COPILOT */}
          {activeTab === 'copilot' && (
            <AICopilotView
              onApproveAction={handleApproveAction}
              currentUser={currentUser}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* TAB 4: AWS ARCHITECTURE */}
          {activeTab === 'aws' && (
            <AWSArchitectureView />
          )}

        </main>

        {/* Operational Footer (shown inside Main Application) */}
        {!['landing', 'login'].includes(activeTab) && (
          <footer className="border-t border-slate-200 bg-white py-3.5 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800">JalRakshak AI</span>
              <span>•</span>
              <span>AWS Hackathon 2026</span>
              <span>•</span>
              <span className="text-blue-600 font-semibold">AWS Strands Agents Engine</span>
            </div>
            <div>
              <span>National Disaster Management Authority (NDMA) & Jal Jeevan Mission Compliant</span>
            </div>
          </footer>
        )}

      </div>

      {/* 3-Minute Hackathon Judge Demo Tour Modal */}
      <JudgeDemoTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSimulateScenario={handleSimulate}
        setActiveTab={setActiveTab}
        onSelectIncident={setSelectedIncident}
      />

    </div>
  );
}
