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
  Shield,
  Layers,
  ArrowUpRight,
  LogOut
} from 'lucide-react';
import { ROLES, PERSONAS } from '../data/rolesData';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
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
  const [restrictedModal, setRestrictedModal] = useState(null);
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
            },
            {
              id: 'login',
              label: 'Portal Login & Roles',
              icon: <Key className="h-4 w-4 shrink-0 text-amber-400" />,
              badge: 'Cognito',
              badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800',
              desc: 'Switch Persona & Credentials'
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
              desc: '248 IoT Sensor Grid & Telemetry'
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
            },
            {
              id: 'login',
              label: 'Portal Login & Roles',
              icon: <Key className="h-4 w-4 shrink-0 text-amber-400" />,
              badge: 'Cognito',
              badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800',
              desc: 'Switch Persona & Credentials'
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
            },
            {
              id: 'login',
              label: 'Portal Login & Roles',
              icon: <Key className="h-4 w-4 shrink-0 text-amber-400" />,
              badge: 'Cognito',
              badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800',
              desc: 'Switch Persona & Credentials'
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
          title: 'Incident Commander',
          icsTier: 'ICS-400 Statutory Commander',
          accentBorder: 'border-rose-500',
          accentText: 'text-rose-400',
          accentBg: 'bg-rose-950/80 text-rose-300 border-rose-800',
          primaryTab: 'command',
          allowedItems: [
            {
              id: 'command',
              label: 'Command Center',
              icon: <LayoutDashboard className="h-4 w-4 shrink-0" />,
              badge: '★ PRIMARY',
              badgeColor: 'bg-rose-600 text-white font-black shadow-xs',
              desc: 'Executive Decision Room'
            },
            {
              id: 'field_ops',
              label: 'Field Operations',
              icon: <Truck className="h-4 w-4 shrink-0" />,
              badge: 'NDRF Units',
              badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
              desc: 'Tactical Ground Manifest'
            },
            {
              id: 'scada',
              label: 'SCADA Telemetry',
              icon: <Activity className="h-4 w-4 shrink-0" />,
              badge: '248 IoT',
              badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
              desc: 'Environmental Sensor Grid'
            },
            {
              id: 'citizen',
              label: 'Citizen PWA',
              icon: <Smartphone className="h-4 w-4 shrink-0" />,
              badge: 'Public Feed',
              badgeColor: 'bg-blue-950/80 text-cyan-300 border-blue-800',
              desc: 'Vision Incident Queue'
            },
            {
              id: 'copilot',
              label: 'Emergency Copilot',
              icon: <Bot className="h-4 w-4 shrink-0" />,
              badge: 'NDMA RAG',
              badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800',
              desc: 'Statutory SOP Assistant'
            },
            {
              id: 'aws',
              label: 'AWS Architecture',
              icon: <Cloud className="h-4 w-4 shrink-0" />,
              badge: '5 Agents',
              badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800',
              desc: 'Strands DAG Architecture'
            },
            {
              id: 'landing',
              label: 'Problem & Mission',
              icon: <Globe className="h-4 w-4 shrink-0" />,
              badge: null,
              desc: 'Platform Overview'
            },
            {
              id: 'login',
              label: 'Portal Login & Roles',
              icon: <Key className="h-4 w-4 shrink-0 text-amber-400" />,
              badge: 'Cognito',
              badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800',
              desc: 'Switch Persona & Credentials'
            }
          ],
          restrictedItems: []
        };
    }
  };

  const navConfig = getRoleNavConfig();

  const handleItemClick = (item) => {
    setActiveTab(item.id);
  };

  const handleRestrictedClick = (item) => {
    setRestrictedModal(item);
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
          isCollapsed ? 'w-[68px]' : 'w-[245px]'
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

          {/* ACTIVE ROLE IDENTITY CARD (Visible when Expanded) */}
          {!isCollapsed && (
            <div className="p-2.5 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-mono uppercase font-black tracking-widest text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-cyan-400" />
                  Active Persona & Tier
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenLogin}
                    className="text-[9px] font-bold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-0.5"
                    title="Switch to another persona"
                  >
                    <span>Switch</span>
                    <ChevronRight className="h-2.5 w-2.5" />
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-[9px] font-bold text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-0.5"
                    title="Sign Out of AWS Cognito session"
                  >
                    <LogOut className="h-2.5 w-2.5" />
                    <span>Exit</span>
                  </button>
                </div>
              </div>

              <div 
                onClick={onOpenLogin}
                className={`rounded-xl p-2 bg-slate-900 border ${navConfig.accentBorder}/50 hover:border-${navConfig.accentBorder} transition-all cursor-pointer shadow-xs group`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl p-1 rounded-lg bg-slate-800 border border-slate-700">
                    {currentUser?.avatar || '👨‍💼'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-black text-white truncate group-hover:text-cyan-300 transition-colors">
                      {currentUser?.name || 'IAS Shrikar Patil'}
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate">
                      {currentUser?.title || 'Incident Commander'}
                    </p>
                  </div>
                </div>

                <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[9px] font-mono">
                  <span className={`px-1.5 py-0.5 rounded border font-bold ${navConfig.accentBg}`}>
                    {navConfig.icsTier}
                  </span>
                  <span className="text-slate-500 font-bold">PoLP RBAC</span>
                </div>
              </div>
            </div>
          )}

          {/* ROLE-AUTHORIZED NAVIGATION PORTALS */}
          <div className="px-2 py-2 space-y-1">
            {!isCollapsed && (
              <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Authorized Portals</span>
                <span className="text-[9px] text-emerald-400 font-mono font-normal">Active Clearance</span>
              </div>
            )}

            {navConfig.allowedItems.map((item) => {
              const isActive = activeTab === item.id;
              const isPrimary = item.badge === '★ PRIMARY';

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center rounded-xl transition-all text-left group ${
                    isCollapsed ? 'justify-center p-2.5 my-1' : 'justify-between px-2.5 py-2 my-0.5'
                  } ${
                    isActive
                      ? `bg-blue-600/25 ${navConfig.accentText} font-bold border-l-4 ${navConfig.accentBorder} rounded-l-none shadow-xs`
                      : isPrimary
                      ? 'text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900 font-medium'
                  }`}
                  title={isCollapsed ? `${item.label} (${item.desc})` : undefined}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`${isActive ? navConfig.accentText : isPrimary ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <div className="truncate">
                        <span className="text-xs truncate font-bold block leading-tight">
                          {item.label}
                        </span>
                        <span className="text-[9px] text-slate-500 truncate block">
                          {item.desc}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* RESTRICTED PORTALS (PoLP SECURITY CLEARANCE REQUIRED) */}
          {navConfig.restrictedItems.length > 0 && (
            <div className="px-2 pt-2 border-t border-slate-800/60 space-y-1">
              {!isCollapsed && (
                <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Lock className="h-3 w-3 text-amber-500/70" />
                    Restricted Portals
                  </span>
                  <span className="text-[9px] text-amber-500 font-mono font-bold">PoLP Guarded</span>
                </div>
              )}

              {navConfig.restrictedItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleRestrictedClick(item)}
                  className={`w-full flex items-center rounded-xl transition-all text-left opacity-60 hover:opacity-100 hover:bg-amber-950/20 border border-transparent hover:border-amber-800/40 group ${
                    isCollapsed ? 'justify-center p-2.5 my-1' : 'justify-between px-2.5 py-1.5 my-0.5'
                  }`}
                  title={isCollapsed ? `🔒 Restricted: Requires ${item.requiredRole}` : item.reason}
                >
                  <div className="flex items-center gap-2.5 truncate text-slate-400 group-hover:text-slate-300">
                    <Lock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    {!isCollapsed && (
                      <div className="truncate">
                        <span className="text-xs truncate font-semibold block leading-tight text-slate-400 group-hover:text-amber-200">
                          {item.label}
                        </span>
                        <span className="text-[9px] text-slate-500 truncate block">
                          Requires {item.requiredRole}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && (
                    <span className="text-[9px] font-mono font-bold text-amber-400/90 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60 shrink-0">
                      Locked
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ROLE-TAILORED QUICK ACTION WIDGET */}
          <div className="px-2 pt-2 pb-1 border-t border-slate-800/80 mt-1">
            {!isCollapsed ? (
              <div className="space-y-1.5">
                
                {/* WIDGET FOR ROLE A: INCIDENT COMMANDER (Disaster Simulators) */}
                {role === ROLES.INCIDENT_COMMANDER && (
                  <>
                    <div className="flex items-center justify-between px-2 py-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Activity className="h-3 w-3 text-cyan-400" />
                        Disaster Simulators
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">1-Click</span>
                    </div>

                    <div className="space-y-1">
                      {simulationTriggers.map((sim) => (
                        <button
                          key={sim.id}
                          onClick={() => onSimulate(sim.id)}
                          disabled={isSimulating}
                          className="w-full flex items-center justify-between rounded-lg px-2 py-1 text-xs text-slate-300 bg-slate-900/90 hover:bg-slate-800 hover:text-white border border-slate-800 transition-colors disabled:opacity-50 text-left"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            {sim.icon}
                            <span className="font-semibold text-[11px] truncate text-slate-200">{sim.label}</span>
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 shrink-0">{sim.sub}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={onReset}
                      disabled={isSimulating}
                      className="w-full flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors mt-0.5"
                    >
                      <RotateCcw className="h-2.5 w-2.5 text-slate-500" />
                      <span>Reset Data Baseline</span>
                    </button>
                  </>
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
                        <span className="text-xs font-black text-white block">248 IoT</span>
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
            ) : (
              <div className="flex flex-col items-center gap-1 py-1">
                <button
                  onClick={onOpenLogin}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-cyan-400"
                  title="Switch Persona"
                >
                  <UserCheck className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* FOOTER: Role Access Status & AWS Security Clearance */}
        <div className="p-2 border-t border-slate-800 bg-slate-900/90 shrink-0">
          {!isCollapsed && (
            <div className="mb-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[9px] flex items-center justify-between text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Shield className="h-2.5 w-2.5 text-blue-400" />
                <span>AWS IAM:</span>
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                PoLP Enforced
              </span>
            </div>
          )}

          <div 
            onClick={onOpenLogin}
            className={`flex items-center rounded-xl p-1 hover:bg-slate-800/80 transition-all cursor-pointer border border-transparent hover:border-slate-700 ${isCollapsed ? 'justify-center' : 'gap-2 px-1'}`}
            title="Click to switch persona or manage access control"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-950 border border-blue-800 text-xs shadow-xs">
              {currentUser?.avatar || '👨‍💼'}
            </div>

            {!isCollapsed && (
              <div className="truncate leading-tight flex-1">
                <span className="text-xs font-bold text-white block truncate">
                  {currentUser?.name?.split(' ')[0]} {currentUser?.name?.split(' ')[1] || ''}
                </span>
                <span className={`text-[10px] font-medium block truncate ${navConfig.accentText}`}>
                  ● {currentUser?.title || 'Commander'}
                </span>
              </div>
            )}

            {!isCollapsed && (
              <div className="flex items-center gap-1.5 shrink-0 mr-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenLogin) onOpenLogin();
                  }}
                  className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Switch Persona"
                >
                  <Key className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onLogout) onLogout();
                  }}
                  className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 transition-colors"
                  title="Sign Out of session"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </aside>

      {/* RESTRICTED PORTAL ACCESS DENIED DIALOG (REAL ENTERPRISE FEEL) */}
      {restrictedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/50 p-5 shadow-2xl space-y-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
                  Access Denied • Least Privilege
                </span>
                <h3 className="text-base font-black text-white leading-tight">
                  {restrictedModal.label} is Restricted
                </h3>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-xs space-y-2">
              <p className="text-slate-300 leading-relaxed">
                {restrictedModal.reason}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Current Role: <strong className="text-white">{currentUser?.title}</strong></span>
                <span>Required: <strong className="text-amber-400">{restrictedModal.requiredRole}</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setRestrictedModal(null)}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3.5 py-2 text-xs font-bold transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setRestrictedModal(null);
                  onOpenLogin();
                }}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Switch to {restrictedModal.requiredRole} ➔</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
