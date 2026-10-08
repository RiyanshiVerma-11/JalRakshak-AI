import React, { useState, useEffect } from 'react';
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  Clock, 
  ShieldAlert,
  AlertTriangle,
  Cloud,
  CheckCircle2,
  Server
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  selectedIncident,
  currentUser
}) {
  const [timeStr, setTimeStr] = useState('');
  const [awsStatus, setAwsStatus] = useState({
    execution_mode: 'HYBRID',
    live_credentials: false,
    region: 'ap-south-1'
  });
  const [showAwsDetails, setShowAwsDetails] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' IST');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/aws/metrics')
      .then(r => r.json())
      .then(data => {
        if (data) {
          setAwsStatus({
            execution_mode: data.execution_mode || 'HYBRID',
            live_credentials: Boolean(data.live_credentials),
            region: data.region || 'ap-south-1'
          });
        }
      })
      .catch(() => {});
  }, []);

  const isCitizen = currentUser?.role === 'citizen' || activeTab === 'citizen';
  const isLive = awsStatus.execution_mode === 'LIVE';

  const getTabLabel = () => {
    if (activeTab === 'citizen' || (isCitizen && activeTab !== 'copilot' && activeTab !== 'landing')) {
      return 'City Emergency PWA';
    }
    switch (activeTab) {
      case 'command': return 'Incident Command Center';
      case 'field_ops': return 'Tactical Field Operations';
      case 'scada': return 'SCADA Sensor Telemetry';
      case 'copilot': return isCitizen ? 'Public Safety Copilot' : 'Statutory SOP Copilot';
      case 'aws': return 'AWS Strands Architecture';
      case 'login': return 'Portal Authorization';
      default: return 'Overview & Mission';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-[46px] max-h-[46px] bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between gap-3 shadow-md select-none text-white">
      
      {/* 1. Left: Sidebar Toggle + JalRakshak Command Branding */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-3.5 w-3.5 text-cyan-400" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5 text-slate-300" />
          )}
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-black tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
            <ShieldAlert className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>JalRakshak <span className="text-cyan-400">Command</span></span>
          </span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-[11px] font-semibold text-slate-400 truncate hidden md:inline">
            {getTabLabel()}
          </span>
        </div>
      </div>

      {/* 2. Right: Active Incident Identifier + AWS Engine Pill + Live Status Badge + Current IST Time */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Active Incident Identifier */}
        {selectedIncident && (
          <div 
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs shadow-2xs shrink-0 max-w-[240px] sm:max-w-none truncate"
            title={`Active Incident: ${selectedIncident.id} - ${selectedIncident.ward_name} (${selectedIncident.severity || 'CRITICAL'})`}
          >
            <AlertTriangle className="h-3 w-3 text-rose-400 shrink-0 animate-pulse" />
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider hidden sm:inline">Active Incident:</span>
            <span className="font-mono font-bold text-[11px] text-white truncate">
              {selectedIncident.id} • {selectedIncident.ward_name}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-black tracking-wider uppercase bg-rose-900/80 text-rose-300 border border-rose-700/60 hidden lg:inline">
              {selectedIncident.severity || 'CRITICAL'}
            </span>
          </div>
        )}

        {/* AWS Engine Status Pill with Hover/Click Tooltip Popover */}
        <div className="relative">
          <button
            onClick={() => setShowAwsDetails(!showAwsDetails)}
            onMouseEnter={() => setShowAwsDetails(true)}
            onMouseLeave={() => setShowAwsDetails(false)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer shadow-xs ${
              isLive
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80'
                : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80'
            }`}
            title="Click to view AWS Cloud Engine details"
          >
            <Cloud className={`h-3 w-3 ${isLive ? 'text-emerald-400' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline">
              {isLive ? 'AWS Engine: Live Cloud (ap-south-1)' : 'AWS Engine: Hybrid Sandbox (ap-south-1)'}
            </span>
            <span className="sm:hidden">
              {isLive ? 'AWS: Live' : 'AWS: Hybrid'}
            </span>
            <span className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400 animate-pulse'}`} />
          </button>

          {/* Interactive Cloud Architecture Popover Tooltip */}
          {showAwsDetails && (
            <div 
              className="absolute right-0 top-full mt-2 w-80 p-3 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl text-left z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseEnter={() => setShowAwsDetails(true)}
              onMouseLeave={() => setShowAwsDetails(false)}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Cloud className="h-3.5 w-3.5 text-cyan-400" />
                  AWS Cloud Engine Status
                </span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${
                  isLive ? 'bg-emerald-900 text-emerald-300 border border-emerald-700' : 'bg-cyan-900 text-cyan-300 border border-cyan-700'
                }`}>
                  {awsStatus.execution_mode}
                </span>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-300 mb-2.5">
                <strong className="text-white">Dual-mode architecture:</strong> Runs offline zero-cost simulation locally or switches to real Amazon Bedrock, DynamoDB, &amp; EventBridge via <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded text-[10px]">AWS_EXECUTION_MODE=LIVE</code>.
              </p>

              <div className="space-y-1 text-[10px] text-slate-400 bg-slate-950/70 p-2 rounded-lg border border-slate-800 font-mono">
                <div className="flex justify-between items-center">
                  <span>Region:</span>
                  <span className="text-slate-200">{awsStatus.region} (Mumbai)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Bedrock LLM:</span>
                  <span className="text-cyan-300">Claude 3.5 Sonnet</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>EventBridge Bus:</span>
                  <span className="text-slate-200">jalrakshak-emergency-eventbus</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>State Store:</span>
                  <span className="text-slate-200">DynamoDB (PITR Enabled)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Emergency Fallback:</span>
                  <span className="text-emerald-400">&lt;50ms Statutory NDMA Matrix</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Status Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/40 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Live
        </span>

        {/* Current IST Time */}
        <span className="flex items-center gap-1 text-[10px] font-mono text-slate-300 font-semibold shrink-0">
          <Clock className="h-3 w-3 text-slate-400" />
          <span>{timeStr || '20:45:00 IST'}</span>
        </span>
      </div>

    </header>
  );
}

