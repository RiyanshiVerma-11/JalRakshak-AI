import React from 'react';
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
  Activity
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed, 
  onSimulate, 
  onReset, 
  isSimulating,
  criticalCount,
  incidentsCount 
}) {
  const navItems = [
    {
      id: 'command',
      label: 'Command Center',
      icon: <LayoutDashboard className="h-4 w-4 shrink-0" />,
      badge: criticalCount > 0 ? `${criticalCount} Crit` : null,
      badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800'
    },
    {
      id: 'citizen',
      label: 'Citizen PWA',
      icon: <Smartphone className="h-4 w-4 shrink-0" />,
      badge: 'Live',
      badgeColor: 'bg-blue-950/80 text-cyan-300 border-blue-800'
    },
    {
      id: 'copilot',
      label: 'Emergency Copilot',
      icon: <Bot className="h-4 w-4 shrink-0" />,
      badge: 'RAG',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800'
    },
    {
      id: 'aws',
      label: 'AWS Architecture',
      icon: <Cloud className="h-4 w-4 shrink-0" />,
      badge: '5 Agents',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800'
    },
    {
      id: 'landing',
      label: 'Problem & Mission',
      icon: <Globe className="h-4 w-4 shrink-0" />,
      badge: null
    }
  ];

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
    <aside 
      className={`fixed top-0 left-0 h-screen z-40 bg-slate-950 border-r border-slate-800 text-slate-300 shadow-xl flex flex-col justify-between transition-all duration-200 ease-in-out ${
        isCollapsed ? 'w-[64px]' : 'w-[230px]'
      }`}
    >
      
      {/* TOP: Brand & Navigation */}
      <div className="flex flex-col min-h-0 overflow-y-auto">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-800 bg-slate-900 h-13 shrink-0">
          <div 
            onClick={() => setActiveTab('landing')}
            className={`flex items-center gap-2 cursor-pointer overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}
            title="JalRakshak AI — Landing Overview"
          >
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-xs text-white">
              <ShieldAlert className="h-4 w-4 text-white" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            </div>

            {!isCollapsed && (
              <div className="leading-tight truncate">
                <h2 className="text-xs font-black text-white flex items-center gap-1">
                  JalRakshak <span className="text-cyan-400">AI</span>
                </h2>
                <span className="text-[10px] text-slate-400 font-medium block truncate">
                  Municipal Command
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

        {/* Collapsed Expand Button */}
        {isCollapsed && (
          <div className="py-1.5 border-b border-slate-800 flex justify-center">
            <button
              onClick={() => setIsCollapsed(false)}
              className="rounded-md p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <div className="px-2 py-2 space-y-0.5">
          {!isCollapsed && (
            <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
              Portals
            </div>
          )}

          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center rounded-lg transition-colors text-left ${
                  isCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-1.5'
                } ${
                  isActive
                    ? 'bg-blue-600/20 text-cyan-300 font-bold border-l-3 border-cyan-400 rounded-l-none'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 font-medium'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-xs truncate font-semibold">{item.label}</span>
                  )}
                </div>

                {!isCollapsed && item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Disaster Simulators */}
        <div className="px-2 pt-2 border-t border-slate-800/80">
          {!isCollapsed ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 py-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Activity className="h-3 w-3 text-cyan-400" />
                  Quick Simulators
                </span>
                <span className="text-[9px] text-slate-500 font-mono">1-Click</span>
              </div>

              <div className="space-y-1">
                {simulationTriggers.map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => onSimulate(sim.id)}
                    disabled={isSimulating}
                    className="w-full flex items-center justify-between rounded-md px-2 py-1 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 transition-colors disabled:opacity-50 text-left"
                    title={`Simulate ${sim.label}`}
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
                className="w-full flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors mt-1"
                title="Restore default database baseline"
              >
                <RotateCcw className="h-2.5 w-2.5 text-slate-500" />
                <span>Reset Data Baseline</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1 py-1 flex flex-col items-center">
              {simulationTriggers.map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => onSimulate(sim.id)}
                  disabled={isSimulating}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors text-slate-300"
                  title={`Simulate: ${sim.label}`}
                >
                  {sim.icon}
                </button>
              ))}
              <button
                onClick={onReset}
                disabled={isSimulating}
                className="p-1 text-slate-500 hover:text-slate-300"
                title="Reset simulation baseline"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* FOOTER: System Status & User Profile */}
      <div className="p-2 border-t border-slate-800 bg-slate-900/90 shrink-0">
        {!isCollapsed && (
          <div className="mb-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] flex items-center justify-between text-slate-400 font-mono">
            <span>AWS Strands:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              5/5 Online
            </span>
          </div>
        )}

        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2 px-1'}`}>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-950 border border-blue-800 text-[11px] font-black text-cyan-300">
            OP
          </div>

          {!isCollapsed && (
            <div className="truncate leading-tight">
              <span className="text-xs font-bold text-white block truncate">
                Officer Patil
              </span>
              <span className="text-[10px] text-emerald-400 font-medium block">
                ● Incident Commander
              </span>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
}
