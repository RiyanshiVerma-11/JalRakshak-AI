import React, { useState } from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Smartphone, 
  Bot, 
  Cloud, 
  Globe, 
  CloudRain, 
  Flame, 
  Wrench, 
  Droplet, 
  RotateCcw, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Activity, 
  Truck, 
  Lock, 
  Key, 
  CheckCircle2, 
  Radio, 
  PhoneCall, 
  Gauge, 
  Camera, 
  AlertTriangle, 
  Star, 
  UserCheck, 
  Sparkles, 
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Shield,
  Layers,
  ArrowUpRight,
  LogOut,
  FileText,
  MapPin
} from 'lucide-react';
import { ROLES, PERSONAS } from '../data/rolesData';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  commandMode,
  setCommandMode,
  isCollapsed, 
  setIsCollapsed, 
  onSimulate, 
  onReset, 
  isSimulating, 
  criticalCount, 
  incidentsCount, 
  currentUser, 
  onOpenLogin,
  onLogout 
}) {
  const [isSimDrawerOpen, setIsSimDrawerOpen] = useState(false);
  const role = currentUser?.role || ROLES.INCIDENT_COMMANDER;

  // -------------------------------------------------------------
  // Role-Specific Navigation Definitions (Statutory RBAC & PoLP)
  // -------------------------------------------------------------
  const getRoleNavConfig = () => {
    switch (role) {
      case ROLES.FIELD_RESPONDER:
        return {
          title: 'Field Operations Lead',
          icsTier: 'ICS-200 Tactical Operations',
          accentBorder: 'border-emerald-500',
          accentText: 'text-emerald-400',
          accentBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
          primaryTab: 'field_ops',
          allowedItems: [
            {
              id: 'field_ops',
              label: 'Tactical Field Ops',
              icon: <Truck className="h-4 w-4 shrink-0" />,
              badge: '★ PRIMARY',
              badgeColor: 'bg-emerald-600 text-white font-black shadow-xs',
              desc: 'Mission Manifest & Ground Status'
            },
            {
              id: 'citizen',
              label: 'Citizen Vision Reports',
              icon: <Smartphone className="h-4 w-4 shrink-0" />,
              badge: 'Vision Feed',
              badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800',
              desc: 'Ground Reality & Depth Verification'
            },
            {
              id: 'copilot',
              label: 'Field SOP Copilot',
              icon: <Bot className="h-4 w-4 shrink-0" />,
              badge: 'NDRF RAG',
              badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800',
              desc: 'Tactical Standard Operating Guide'
            },
            {
              id: 'landing',
              label: 'Problem & Mission',
              icon: <Globe className="h-4 w-4 shrink-0" />,
              badge: null,
              desc: 'Platform Overview'
            }
          ],
          restrictedItems: [
            {
              id: 'command',
              label: 'Command Center',
              icon: <LayoutDashboard className="h-4 w-4 shrink-0" />,
              requiredRole: 'Incident Commander',
              reason: 'Municipal EOC Tactical Sign-Off and multi-crore fund dispatch are restricted to ICS-400 Incident Commander (NDMA Sec 4.3).'
            },
            {
              id: 'scada',
              label: 'SCADA Telemetry',
              icon: <Activity className="h-4 w-4 shrink-0" />,
              requiredRole: 'SCADA Analyst',
              reason: 'Water supply valve telemetry and hydraulic pressure topologies require Hydrology Directorate credentials.'
            },
            {
              id: 'aws',
              label: 'AWS Architecture',
              icon: <Cloud className="h-4 w-4 shrink-0" />,
              requiredRole: 'Technical Analyst',
              reason: 'AWS Strands 5-Agent internal state graph is restricted to Cloud & Technical intelligence staff.'
            }
          ]
        };

      case ROLES.SCADA_ANALYST:
        return {
          title: 'Chief Hydrologist & SCADA',
          icsTier: 'ICS-300 Telemetry & Planning',
          accentBorder: 'border-cyan-500',
          accentText: 'text-cyan-400',
          accentBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
          primaryTab: 'scada',
          allowedItems: [
            {
              id: 'scada',
              label: 'SCADA Telemetry',
              icon: <Activity className="h-4 w-4 shrink-0" />,
              badge: '★ PRIMARY',
              badgeColor: 'bg-cyan-600 text-white font-black shadow-xs',
              desc: 'Synthetic Sensor Grid (4 Wards) & Telemetry'
            },
            {
              id: 'aws',
              label: 'AWS Strands DAG',
              icon: <Cloud className="h-4 w-4 shrink-0" />,
              badge: '5 Agents',
              badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800',
              desc: 'Multi-Agent Latency & Execution DAG'
            },
            {
              id: 'copilot',
              label: 'Hydrology Copilot',
              icon: <Bot className="h-4 w-4 shrink-0" />,
              badge: 'Telemetry AI',
              badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800',
              desc: 'Inundation Curve Modeling'
            },
            {
              id: 'command',
              label: 'Command Center',
              icon: <LayoutDashboard className="h-4 w-4 shrink-0" />,
              badge: '👁️ Advisory',
              badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
              desc: 'Technical Advisor (Read-Only Mode)'
            },
            {
              id: 'landing',
              label: 'Problem & Mission',
              icon: <Globe className="h-4 w-4 shrink-0" />,
              badge: null,
              desc: 'Platform Overview'
            }
          ],
          restrictedItems: [
            {
              id: 'field_ops',
              label: 'Tactical Field Ops',
              icon: <Truck className="h-4 w-4 shrink-0" />,
              requiredRole: 'Field Responder',
              reason: 'Ground tactical deployments, dewatering pump operations, and battalion manifests are restricted to NDRF field units.'
            },
            {
              id: 'citizen',
              label: 'Citizen PWA',
              icon: <Smartphone className="h-4 w-4 shrink-0" />,
              requiredRole: 'Citizen Resident',
              reason: 'Public safety emergency reporting portal is segregated from SCADA engineering directorate.'
            }
          ]
        };

      case ROLES.CITIZEN:
        return {
          title: 'Citizen / Resident',
          icsTier: 'DMA 2005 Sec 34 Public',
          accentBorder: 'border-blue-500',
          accentText: 'text-blue-400',
          accentBg: 'bg-blue-950/80 text-blue-300 border-blue-800',
          primaryTab: 'citizen',
          allowedItems: [
            {
              id: 'citizen',
              label: 'Citizen Safety Portal',
              icon: <Smartphone className="h-4 w-4 shrink-0" />,
              badge: '★ PRIMARY',
              badgeColor: 'bg-blue-600 text-white font-black shadow-xs',
              desc: '1-Tap SOS & Photo Flood Reporting'
            },
            {
              id: 'copilot',
              label: 'Public Safety Copilot',
              icon: <Bot className="h-4 w-4 shrink-0" />,
              badge: 'Emergency FAQ',
              badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800',
              desc: 'Multilingual Flood Advisories & Guides'
            },
            {
              id: 'landing',
              label: 'Problem & Mission',
              icon: <Globe className="h-4 w-4 shrink-0" />,
              badge: null,
              desc: 'Platform Overview'
            }
          ],
          restrictedItems: [
            {
              id: 'command',
              label: 'Municipal Command Center',
              icon: <LayoutDashboard className="h-4 w-4 shrink-0" />,
              requiredRole: 'Incident Commander',
              reason: 'Classified Municipal EOC Decision Room is strictly restricted to certified disaster management officers.'
            },
            {
              id: 'field_ops',
              label: 'Tactical Field Ops',
              icon: <Truck className="h-4 w-4 shrink-0" />,
              requiredRole: 'Field Responder',
              reason: 'NDRF tactical dispatch manifests and asset positioning are classified under Disaster Management Act 2005.'
            },
            {
              id: 'scada',
              label: 'SCADA Telemetry',
              icon: <Activity className="h-4 w-4 shrink-0" />,
              requiredRole: 'SCADA Analyst',
              reason: 'Municipal drinking water pipeline SCADA valve topologies are high-security critical infrastructure.'
            },
            {
              id: 'aws',
              label: 'AWS Architecture',
              icon: <Cloud className="h-4 w-4 shrink-0" />,
              requiredRole: 'System Administrator',
              reason: 'Internal cloud multi-agent orchestration is restricted to verified government administrators.'
            }
          ]
        };

      case ROLES.INCIDENT_COMMANDER:
      default:
        return {
          title: 'Municipal Incident Commander',
          icsTier: 'ICS-400 Statutory Commander',
          accentBorder: 'border-rose-500',
          accentText: 'text-rose-400',
          accentBg: 'bg-rose-950/80 text-rose-300 border-rose-800',
          primaryTab: 'command',
          allowedItems: [
            {
              id: 'overview_gis',
              targetTab: 'command',
              commandMode: 'gis',
              label: 'Incident Overview & GIS',
              icon: <MapPin className="h-4 w-4 shrink-0" />,
              badge: 'LIVE MAP',
              badgeColor: 'bg-blue-950/90 text-blue-300 border-blue-800',
              desc: 'Live Spatial Map & Priority Queue'
            },
            {
              id: 'tactical_directives',
              targetTab: 'command',
              commandMode: 'decision',
              label: 'Tactical Action Directives',
              icon: <ShieldAlert className="h-4 w-4 shrink-0" />,
              badge: '★ CORE',
              badgeColor: 'bg-rose-600 text-white font-black shadow-xs',
              desc: 'Executive Decision Room'
            },
            {
              id: 'sensor_grid',
              targetTab: 'scada',
              label: 'Sensor Grid & Outfalls',
              icon: <Activity className="h-4 w-4 shrink-0" />,
              badge: '4 Wards',
              badgeColor: 'bg-cyan-950/90 text-cyan-300 border-cyan-800',
              desc: 'Telemetry & Sluice Outfalls'
            },
            {
              id: 'statutory_sops',
              targetTab: 'copilot',
              label: 'Statutory Logs & SOPs',
              icon: <FileText className="h-4 w-4 shrink-0" />,
              badge: 'NDMA RAG',
              badgeColor: 'bg-indigo-950/90 text-indigo-300 border-indigo-800',
              desc: 'Compliance & Audit Logs'
            }
          ],
          restrictedItems: []
        };
    }
  };

  const navConfig = getRoleNavConfig();

  const handleItemClick = (item) => {
    if (item.targetTab) {
      setActiveTab(item.targetTab);
      if (item.commandMode && setCommandMode) {
        setCommandMode(item.commandMode);
      }
    } else {
      setActiveTab(item.id);
    }
  };

  const isItemActive = (item) => {
    if (role === ROLES.INCIDENT_COMMANDER) {
      if (item.id === 'overview_gis') {
        return activeTab === 'command' && commandMode === 'gis';
      }
      if (item.id === 'tactical_directives') {
        return activeTab === 'command' && (commandMode === 'decision' || !commandMode || ['all', 'dag', 'whatif'].includes(commandMode));
      }
      if (item.id === 'sensor_grid') {
        return activeTab === 'scada';
      }
      if (item.id === 'statutory_sops') {
        return activeTab === 'copilot';
      }
    }
    return activeTab === item.id;
  };

  const simulationTriggers = [
    {
      id: 'flood',
      label: '118mm Cloudburst',
      sub: 'W-17 Kurla',
      icon: <CloudRain className="h-3 w-3 text-cyan-400" />
    },
    {
      id: 'heatwave',
      label: '48.6°C Heat Index',
      sub: 'W-4 Dadar',
      icon: <Flame className="h-3 w-3 text-amber-400" />
    },
    {
      id: 'leak',
      label: 'Main Pipe Burst',
      sub: 'W-8 Andheri',
      icon: <Wrench className="h-3 w-3 text-emerald-400" />
    },
    {
      id: 'water_shortage',
      label: 'Reservoir < 12%',
      sub: 'W-12 Govandi',
      icon: <Droplet className="h-3 w-3 text-purple-400" />
    }
  ];

  return (
    <>
      <aside 
        className={`fixed top-0 left-0 h-screen z-40 bg-slate-950 border-r border-slate-800 text-slate-300 shadow-2xl flex flex-col justify-between transition-all duration-200 ease-in-out ${
          isCollapsed ? 'w-[70px]' : 'w-[280px]'
        }`}
      >
        
        {/* TOP: Brand & Active Role Profile */}
        <div className="flex flex-col min-h-0 overflow-y-auto">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-800 bg-slate-900/90 h-13 shrink-0">
            <div 
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-2.5 cursor-pointer overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}
              title="JalRakshak AI — Landing Overview"
            >
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-md text-white">
                <ShieldAlert className="h-4 w-4 text-white" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
              </div>

              {!isCollapsed && (
                <div className="leading-tight truncate">
                  <h2 className="text-xs font-black text-white flex items-center gap-1">
                    JalRakshak <span className="text-cyan-400">AI</span>
                  </h2>
                  <span className="text-[10px] text-slate-400 font-medium block truncate">
                    Autonomous Command
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                className="rounded-md p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Collapsed Expand Toggle */}
          {isCollapsed && (
            <div className="py-2 border-b border-slate-800 flex justify-center">
              <button
                onClick={() => setIsCollapsed(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
                title="Expand sidebar"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            </div>
          )}



          {/* ROLE-AUTHORIZED NAVIGATION PORTALS */}
          <div className="px-2 py-2 space-y-1">
            {!isCollapsed && (
              <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Operational Modules</span>
                <span className="text-[9px] text-emerald-400 font-mono font-normal">Active Clearance</span>
              </div>
            )}

            {navConfig.allowedItems.map((item) => {
              const isActive = isItemActive(item);
              const isPrimary = item.badge === '★ CORE' || item.badge === '★ PRIMARY';

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center rounded-xl transition-all text-left group ${
                    isCollapsed ? 'justify-center p-2.5 my-1' : 'justify-between px-2.5 py-2 my-1'
                  } ${
                    isActive
                      ? `bg-blue-600/25 ${navConfig.accentText} font-bold border-l-4 ${navConfig.accentBorder} rounded-l-none shadow-xs`
                      : isPrimary
                      ? 'text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900 font-medium'
                  }`}
                  title={isCollapsed ? `${item.label} (${item.desc})` : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className={`${isActive ? navConfig.accentText : isPrimary ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'} shrink-0`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <div className="min-w-0 flex-1 leading-snug">
                        <span className="text-xs font-bold block text-white leading-tight">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-400 block leading-tight mt-0.5 whitespace-normal break-words">
                          {item.desc}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ml-1.5 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>



          {/* ROLE-TAILORED QUICK ACTION WIDGET */}
          <div className="px-2 pt-2 pb-1 border-t border-slate-800/80 mt-1">
            {!isCollapsed ? (
              <div className="space-y-1.5">
                
                {/* WIDGET FOR ROLE A: INCIDENT COMMANDER (Disaster Simulators - Collapsible Drawer) */}
                {role === ROLES.INCIDENT_COMMANDER && (
                  <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-2 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => setIsSimDrawerOpen(!isSimDrawerOpen)}
                      className="w-full flex items-center justify-between text-left px-1 py-0.5 group cursor-pointer"
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 group-hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
                        <Activity className="h-3 w-3 text-cyan-400" />
                        <span>Disaster Scenarios</span>
                      </span>
                      <span className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                        <span>{isSimDrawerOpen ? 'Close' : 'Simulate'}</span>
                        {isSimDrawerOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </span>
                    </button>

                    {isSimDrawerOpen && (
                      <div className="space-y-1 pt-1.5 border-t border-slate-800 animate-fade-in">
                        <div className="text-[9px] text-slate-400 font-medium px-1">
                          1-Click Synthetic Stress Testing:
                        </div>
                        <div className="space-y-1">
                          {simulationTriggers.map((sim) => (
                            <button
                              key={sim.id}
                              onClick={() => onSimulate(sim.id)}
                              disabled={isSimulating}
                              className="w-full flex items-center justify-between rounded-lg px-2 py-1 text-xs text-slate-300 bg-slate-950/80 hover:bg-slate-800 hover:text-white border border-slate-800/80 transition-colors disabled:opacity-50 text-left cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                {sim.icon}
                                <span className="font-semibold text-[11px] truncate text-slate-200">{sim.label}</span>
                              </div>
                              <span className="text-[9px] font-mono text-cyan-400/90 shrink-0">{sim.sub}</span>
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={onReset}
                          disabled={isSimulating}
                          className="w-full flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold text-slate-400 hover:text-white bg-slate-950/50 hover:bg-slate-800 border border-slate-800/60 transition-colors mt-0.5 cursor-pointer"
                        >
                          <RotateCcw className="h-2.5 w-2.5 text-slate-500" />
                          <span>Reset Scenario Baseline</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* WIDGET FOR ROLE B: FIELD RESPONDER (Tactical Ground Ops HUD) */}
                {role === ROLES.FIELD_RESPONDER && (
                  <div className="rounded-xl bg-emerald-950/40 border border-emerald-800/60 p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                        <Truck className="h-3 w-3 text-emerald-400" />
                        Tactical Field Tools
                      </span>
                      <span className="text-[9px] text-emerald-400 font-mono font-bold">VHF Ch-08</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-center text-xs">
                      <div className="rounded-lg bg-emerald-950/80 border border-emerald-800 p-1.5">
                        <span className="text-xs font-black text-white block">4 Units</span>
                        <span className="text-[9px] text-emerald-300 font-mono">Assigned</span>
                      </div>
                      <div className="rounded-lg bg-emerald-950/80 border border-emerald-800 p-1.5">
                        <span className="text-xs font-black text-emerald-400 block">Active</span>
                        <span className="text-[9px] text-emerald-300 font-mono">Pumping</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('field_ops')}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-2 text-xs shadow-xs transition-colors"
                    >
                      <Radio className="h-3.5 w-3.5" />
                      <span>Open Field Manifest ➔</span>
                    </button>
                  </div>
                )}

                {/* WIDGET FOR ROLE C: SCADA ANALYST (IoT Sensor Telemetry) */}
                {role === ROLES.SCADA_ANALYST && (
                  <div className="rounded-xl bg-cyan-950/40 border border-cyan-800/60 p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                        <Activity className="h-3 w-3 text-cyan-400" />
                        SCADA Live Telemetry
                      </span>
                      <span className="flex items-center gap-1 text-[9px] text-cyan-400 font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        Live
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-center text-xs">
                      <div className="rounded-lg bg-cyan-950/80 border border-cyan-800 p-1.5">
                        <span className="text-xs font-black text-white block">4 Wards</span>
                        <span className="text-[9px] text-cyan-300 font-mono">Online</span>
                      </div>
                      <div className="rounded-lg bg-cyan-950/80 border border-cyan-800 p-1.5">
                        <span className="text-xs font-black text-rose-400 block">-2.4 Bar</span>
                        <span className="text-[9px] text-rose-300 font-mono">Drop W-8</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('scada')}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 px-2 text-xs shadow-xs transition-colors"
                    >
                      <Gauge className="h-3.5 w-3.5" />
                      <span>Inspect Waveforms ➔</span>
                    </button>
                  </div>
                )}

                {/* WIDGET FOR ROLE D: CITIZEN (Community Emergency SOS) */}
                {role === ROLES.CITIZEN && (
                  <div className="rounded-xl bg-blue-950/40 border border-blue-800/60 p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 flex items-center gap-1">
                        <PhoneCall className="h-3 w-3 text-rose-400" />
                        Community Emergency
                      </span>
                      <span className="text-[9px] text-rose-400 font-mono font-bold">1077 SOS</span>
                    </div>

                    <a
                      href="tel:1077"
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold py-1.5 px-2 text-xs shadow-xs transition-colors"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      <span>Call 1077 Helpline</span>
                    </a>

                    <button
                      onClick={() => setActiveTab('citizen')}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-2 text-xs shadow-xs transition-colors"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span>Submit Photo SOS ➔</span>
                    </button>
                  </div>
                )}

              </div>
            ) : null}
          </div>

        </div>

        {/* FOOTER: User Profile & Session Clearance (PoLP Enforced) */}
        <div className="p-2.5 border-t border-slate-800 bg-slate-900/95 shrink-0 space-y-2">
          {!isCollapsed ? (
            <>
              {/* PoLP IAM Clearance Badge */}
              <div className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[9px] flex items-center justify-between text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Shield className="h-2.5 w-2.5 text-blue-400" />
                  <span>AWS IAM:</span>
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  PoLP Enforced
                </span>
              </div>

              {/* Active User Profile Pill with Sign Out Link */}
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 shadow-xs">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-lg p-1 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                    {currentUser?.avatar || '👨‍💼'}
                  </span>
                  <div className="min-w-0 flex-1 leading-tight">
                    <h4 className="text-xs font-black text-white truncate">
                      {currentUser?.name || 'IAS Shrikar Patil'}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight whitespace-normal break-words mt-0.5">
                      {currentUser?.title || (role === ROLES.CITIZEN ? 'Citizen Resident' : 'Municipal Incident Commander')}
                    </p>
                  </div>
                </div>

                {/* Single Clean Sign Out Button */}
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/60 border border-transparent hover:border-rose-900/60 transition-all shrink-0 active:scale-95"
                  title="Sign Out of AWS Cognito session"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div 
                className="text-base p-1.5 rounded-lg bg-slate-800 border border-slate-700" 
                title={`${currentUser?.name || 'User'} (${currentUser?.title || 'Resident'})`}
              >
                {currentUser?.avatar || '🧑'}
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/60 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

      </aside>
    </>
  );
}
