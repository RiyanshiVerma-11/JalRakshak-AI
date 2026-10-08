import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Flame, 
  Droplet, 
  Wrench, 
  RotateCcw, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Clock, 
  Award,
  Activity
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  onSimulate, 
  onReset, 
  isSimulating,
  incidentsCount,
  criticalCount,
  onOpenJudgeTour,
  currentUser,
  onOpenLogin
}) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' IST');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTabLabel = () => {
    switch (activeTab) {
      case 'command': return 'Emergency Command Center';
      case 'field_ops': return 'Tactical Field Operations (NDRF)';
      case 'scada': return 'SCADA & Environmental Telemetry';
      case 'citizen': return 'Citizen PWA & Vision Reports';
      case 'copilot': return 'AI Emergency Copilot';
      case 'aws': return 'AWS Strands Architecture';
      default: return 'Overview & Mission';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-[46px] max-h-[46px] bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between gap-2 shadow-md select-none text-white">
      
      {/* Left: Sidebar Toggle + Portal Label + Live Clock */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-3.5 w-3.5 text-blue-400" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5 text-slate-300" />
          )}
        </button>

        <div className="flex items-center gap-2 truncate">
          <span className="text-xs font-black text-white tracking-tight truncate">
            {getTabLabel()}
          </span>
          
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/40 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live
          </span>

          <span className="hidden md:flex items-center gap-1 text-[10px] font-mono text-slate-400 shrink-0">
            <Clock className="h-3 w-3 text-slate-500" />
            <span>{timeStr || '19:40:00 IST'}</span>
          </span>
        </div>
      </div>

      {/* Right: Role Switcher + 3-Min Judge Tour + Ultra-Compact 1-Line Simulator Bar */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Active Persona / Role Switcher Pill (Crucial for Judge Demo) */}
        <button
          onClick={onOpenLogin}
          className="flex h-7 items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-2 text-[11px] font-bold text-white border border-slate-700 hover:border-blue-500/60 shadow-xs transition-all active:scale-95 shrink-0"
          title="Switch Persona / Open RBAC Security Gateway"
        >
          <span className="text-xs">{currentUser?.avatar || '👨‍💼'}</span>
          <span className="hidden sm:inline font-bold text-cyan-300">
            {currentUser?.name?.split(' ')[1] || currentUser?.name || 'Commander'}
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-700 font-mono">
            {currentUser?.role === 'incident_commander' ? '👑 Commander' : currentUser?.role === 'field_responder' ? '🚜 Field Ops' : currentUser?.role === 'scada_analyst' ? '🔬 SCADA' : '👥 Citizen'}
          </span>
        </button>

        {/* 3-Min Judge Tour Pill */}
        <button
          onClick={onOpenJudgeTour}
          className="flex h-7 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-2.5 text-[11px] font-bold text-white shadow-xs active:scale-95 transition-all whitespace-nowrap"
          title="Open 3-Minute Hackathon Demo Tour"
        >
          <Award className="h-3.5 w-3.5 text-amber-300" />
          <span>🎬 3-Min Tour</span>
        </button>

        {/* Ultra-Slim Simulation Quick Triggers (Fits inside 46px header) */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-800/90 px-1.5 py-0.5 border border-slate-700">
          <span className="text-[10px] font-bold text-slate-400 hidden xl:inline uppercase tracking-wider">
            Sim:
          </span>

          <button
            onClick={() => onSimulate('flood')}
            disabled={isSimulating}
            className="flex h-6 items-center gap-1 rounded px-1.5 text-[11px] font-bold text-blue-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="Simulate 118mm Cloudburst (Ward 17)"
          >
            <span>🌧️</span>
            <span className="hidden lg:inline text-[10px]">118mm</span>
          </button>

          <button
            onClick={() => onSimulate('heatwave')}
            disabled={isSimulating}
            className="flex h-6 items-center gap-1 rounded px-1.5 text-[11px] font-bold text-amber-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="Simulate 48.6°C Heat Index (Ward 4)"
          >
            <span>🔥</span>
            <span className="hidden lg:inline text-[10px]">48.6°C</span>
          </button>

          <button
            onClick={() => onSimulate('leak')}
            disabled={isSimulating}
            className="flex h-6 items-center gap-1 rounded px-1.5 text-[11px] font-bold text-emerald-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="Simulate Main Pipe Rupture (Ward 8)"
          >
            <span>🚰</span>
            <span className="hidden lg:inline text-[10px]">Burst</span>
          </button>

          <button
            onClick={() => onSimulate('water_shortage')}
            disabled={isSimulating}
            className="flex h-6 items-center gap-1 rounded px-1.5 text-[11px] font-bold text-purple-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="Simulate Reservoir < 12% Deficit (Ward 12)"
          >
            <span>💧</span>
            <span className="hidden lg:inline text-[10px]">&lt;12%</span>
          </button>

          <button
            onClick={onReset}
            disabled={isSimulating}
            className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="Reset Simulation Baseline"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>

      </div>

    </header>
  );
}
