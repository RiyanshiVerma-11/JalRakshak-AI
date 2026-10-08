import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ShieldAlert, MapPin, Cpu, Layers } from 'lucide-react';
import Header from './components/Header';
import StatRibbon from './components/CommandCenter/StatRibbon';
import CommandCenterExplainerBanner from './components/CommandCenter/CommandCenterExplainerBanner';
import LiveCityMap from './components/CommandCenter/LiveCityMap';
import AIPriorityQueue from './components/CommandCenter/AIPriorityQueue';
import ActionPlanPanel from './components/CommandCenter/ActionPlanPanel';
import AgentTraceDrawer from './components/CommandCenter/AgentTraceDrawer';
import CitizenPWAView from './components/CitizenPWA/CitizenPWAView';
import AICopilotView from './components/AICopilot/AICopilotView';
import AWSArchitectureView from './components/AWSArchitecture/AWSArchitectureView';
import LandingPageView from './components/LandingPage/LandingPageView';
import Sidebar from './components/Sidebar';
import JudgeDemoTour from './components/JudgeDemoTour';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing'); // 'landing', 'command', 'citizen', 'copilot', 'aws'
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

  const fetchIncidents = async () => {
    try {
      const res = await fetch('/api/incidents');
      const data = await res.json();
      setIncidents(data);
      if (!selectedIncident && data.length > 0) {
        setSelectedIncident(data[0]);
      } else if (selectedIncident) {
        // Keep updated state of current incident
        const updated = data.find(i => i.id === selectedIncident.id);
        if (updated) setSelectedIncident(updated);
      }
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/resources');
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    }
  };

  useEffect(() => {
    fetchIncidents();
    fetchResources();
    const interval = setInterval(() => {
      fetchIncidents();
      fetchResources();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Cinematic Live Scenario Trigger
  const handleSimulate = async (scenario) => {
    setIsSimulating(true);
    showNotification(`⚡ Live Event Triggered: Activating AWS Strands 5-Agent Pipeline for ${scenario.toUpperCase()}...`, 'alert');

    try {
      const res = await fetch('/api/incidents/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
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
        setActiveTab('command');

        showNotification(`✅ AWS Strands Workflow complete: Action Plan generated for ${data.incident.ward_name}`, 'success');
      }
    } catch (err) {
      console.error('Simulation failed:', err);
      showNotification('Simulation error. Please check backend connection.', 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  // Human-in-the-Loop Action Approval
  const handleApproveAction = async (actionId) => {
    try {
      const res = await fetch(`/api/actions/${actionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer_id: "OFFICER_PATIL_EOC",
          officer_name: "Municipal Disaster Controller",
          notes: "Approved under NDMA Urban Flood Emergency Protocol 2024"
        })
      });
      const data = await res.json();

      if (data.success) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });

        showNotification(`Tactical order authorized! Assigned asset dispatched and Amazon SNS queued.`, 'success');
        await fetchIncidents();
        await fetchResources();
      }
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  // Human-in-the-Loop Action Modification
  const handleModifyAction = async (actionId, modifiedText) => {
    try {
      const res = await fetch(`/api/actions/${actionId}/modify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer_id: "OFFICER_PATIL_EOC",
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

      {/* Collapsible Operational Sidebar (shown when in main app) */}
      {activeTab !== 'landing' && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onSimulate={handleSimulate}
          onReset={handleReset}
          isSimulating={isSimulating}
          criticalCount={criticalCount}
          incidentsCount={incidents.length}
        />
      )}

      {/* Main Content View Container with smooth margin shift */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        activeTab !== 'landing' 
          ? (isSidebarCollapsed ? 'ml-[70px]' : 'ml-[260px]') 
          : 'ml-0'
      }`}>

        {/* Main Operational Header (shown inside Main Application) */}
        {activeTab !== 'landing' && (
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
            onSimulate={handleSimulate}
            onReset={handleReset}
            isSimulating={isSimulating}
            incidentsCount={incidents.length}
            criticalCount={criticalCount}
            onOpenJudgeTour={() => setIsTourOpen(true)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-5 max-w-[1600px] w-full mx-auto">
          
          {/* TAB 0: LANDING PAGE (PROBLEM & MISSION) */}
          {activeTab === 'landing' && (
            <LandingPageView
              onEnterCommandCenter={() => setActiveTab('command')}
              onSimulate={handleSimulate}
              onOpenCitizenPWA={() => setActiveTab('citizen')}
              onOpenJudgeTour={() => setIsTourOpen(true)}
            />
          )}

          {/* TAB 1: EMERGENCY COMMAND CENTER (MODULAR ARCHITECTURE) */}
          {activeTab === 'command' && (
            <div className="space-y-4">
              
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

              {/* MODULE 4: ALL-IN-ONE VIEW (Classic Full Screen Overview) */}
              {commandMode === 'all' && (
                <div className="space-y-4 animate-fade-in">
                  <CommandCenterExplainerBanner
                    selectedIncident={selectedIncident}
                    onApproveAll={() => {
                      (selectedIncident?.recommended_actions || []).forEach(a => {
                        if (a.status !== 'APPROVED') handleApproveAction(a.id);
                      });
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
                  />

                  <AgentTraceDrawer
                    agentTrace={selectedIncident?.agent_trace}
                    totalExecutionMs={selectedIncident?.total_execution_ms}
                  />
                </div>
              )}

            </div>
          )}

          {/* TAB 2: CITIZEN PWA */}
          {activeTab === 'citizen' && (
            <CitizenPWAView
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
            />
          )}

          {/* TAB 4: AWS ARCHITECTURE */}
          {activeTab === 'aws' && (
            <AWSArchitectureView />
          )}

        </main>

        {/* Operational Footer */}
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
