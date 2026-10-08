import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Radio, 
  ArrowRight, 
  Navigation, 
  PhoneCall, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  WifiOff,
  UploadCloud,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FieldOpsView({ 
  currentUser, 
  incidents = [], 
  resources = [], 
  onUpdateResourceStatus, 
  onOpenGIS 
}) {
  // Extract all tactical actions that involve physical assets
  const [tasks, setTasks] = useState([
    {
      id: 'TASK-P04-01',
      actionId: 'ACT-01',
      title: 'Deploy High-Capacity Dewatering Pump P-04 (1000 GPM)',
      target: 'Drain Outfall D-17 (Mithi River Channel, Kurla)',
      coordinates: '19.0688° N, 72.8796° E',
      priority: 'P1 - CRITICAL',
      assetId: 'PUMP-04',
      status: 'EN_ROUTE', // 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'OPERATIONAL', 'COMPLETED'
      etaMinutes: 12,
      instructions: 'Position suction inlet at 45° angle to bypass debris grate. Divert discharge into secondary culvert.',
      sopCitation: 'NDMA Urban Flooding Guidelines 2024 Sec 4.3',
      photoEvidence: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      timestamp: '19:42:10 IST'
    },
    {
      id: 'TASK-HOSP-02',
      actionId: 'ACT-03',
      title: 'Engage Sandbag Perimeter around Basement Oxygen Unit',
      target: 'Bhabha Municipal General Hospital, Kurla West',
      coordinates: '19.0665° N, 72.8835° E',
      priority: 'P2 - HIGH',
      assetId: 'NDRF-SQUAD-3',
      status: 'OPERATIONAL',
      etaMinutes: 0,
      instructions: 'Deploy 250 heavy-duty polymer sandbags at basement power generator ramps. Check diesel generator fuel level.',
      sopCitation: 'National Hospital Disaster Management Protocol',
      photoEvidence: null,
      timestamp: '19:35:45 IST'
    },
    {
      id: 'TASK-TRFC-03',
      actionId: 'ACT-02',
      title: 'Traffic Diversion & Arterial Cordon (LBS Marg)',
      target: 'LBS Marg Junction & BKC Connector Ramp',
      coordinates: '19.0710° N, 72.8780° E',
      priority: 'P2 - HIGH',
      assetId: 'TRAFFIC-UNIT-L',
      status: 'ARRIVED',
      etaMinutes: 0,
      instructions: 'Close light vehicle corridor where water depth exceeds 35 cm. Route emergency ambulances via elevated connector.',
      sopCitation: 'Mumbai Traffic Police Monsoon Protocol',
      photoEvidence: null,
      timestamp: '19:38:20 IST'
    },
    {
      id: 'TASK-TNK-04',
      actionId: 'ACT-04',
      title: 'Potable Water Bowser Routing (10,000 Litres)',
      target: 'Govandi Shivaji Nagar Community Standpost',
      coordinates: '19.0622° N, 72.9015° E',
      priority: 'P1 - CRITICAL',
      assetId: 'BOWSER-02',
      status: 'EN_ROUTE',
      etaMinutes: 18,
      instructions: 'Prioritize pregnant mothers & dialysis patients. Dispense chlorine water purification tablets with ration.',
      sopCitation: 'Jal Jeevan Mission Emergency Supply SOP',
      photoEvidence: null,
      timestamp: '19:40:00 IST'
    }
  ]);

  const [activePhotoModal, setActivePhotoModal] = useState(null);
  const [radioConnecting, setRadioConnecting] = useState(false);
  const [radioConnected, setRadioConnected] = useState(false);

  // Cycle status forward
  const handleAdvanceStatus = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      
      let nextStatus = 'EN_ROUTE';
      if (task.status === 'ASSIGNED') nextStatus = 'EN_ROUTE';
      else if (task.status === 'EN_ROUTE') nextStatus = 'ARRIVED';
      else if (task.status === 'ARRIVED') nextStatus = 'OPERATIONAL';
      else if (task.status === 'OPERATIONAL') nextStatus = 'COMPLETED';
      else nextStatus = 'OPERATIONAL';

      if (nextStatus === 'COMPLETED') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4']
        });
      }

      return {
        ...task,
        status: nextStatus,
        etaMinutes: nextStatus === 'EN_ROUTE' ? 8 : 0,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST'
      };
    }));
  };

  const handleSimulatePhotoUpload = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        photoEvidence: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
        status: task.status === 'ASSIGNED' || task.status === 'EN_ROUTE' ? 'ARRIVED' : task.status
      };
    }));
    setActivePhotoModal(null);
    confetti({ particleCount: 30, spread: 45 });
  };

  const handleConnectRadio = () => {
    setRadioConnecting(true);
    setTimeout(() => {
      setRadioConnecting(false);
      setRadioConnected(true);
    }, 1200);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto animate-fade-in">
      
      {/* Top Banner: Ground Unit Tactical Terminal */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-900 border border-emerald-800/60 p-4 sm:p-5 shadow-lg text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-2xl">
            👷‍♂️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-black">
                Tactical Field Responder Terminal (ICS-200)
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/40">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                GPS Geofence: Ward 17 Kurla Locked
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white">
              {currentUser?.name || 'Insp. Rajesh Yadav'} — {currentUser?.title || 'Tactical Field Operations Lead'}
            </h1>
            <p className="text-xs text-slate-300">
              Department: <strong className="text-white">NDRF 8th Battalion & Ward L Quick Response Team</strong>
            </p>
          </div>
        </div>

        {/* Radio Hotline to EOC Incident Commander */}
        <div className="flex items-center gap-2">
          {radioConnected ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-900/80 px-3 py-2 border border-emerald-500 text-xs font-bold text-emerald-200">
              <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span>EOC Voice Link Active (Ch. 4)</span>
              <button 
                onClick={() => setRadioConnected(false)}
                className="text-[10px] underline ml-1 text-emerald-300 hover:text-white"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectRadio}
              disabled={radioConnecting}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Radio className="h-4 w-4" />
              <span>{radioConnecting ? 'Establishing Secure Patch...' : '📻 Connect EOC Radio Hotline'}</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-slate-800/80 px-3 py-2 border border-slate-700 text-[11px] text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>AWS AppSync: Offline Cache Ready</span>
          </div>
        </div>
      </div>

      {/* Task Manifest Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Assigned Tactical Mission Manifest */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Live Dispatched Task Manifest ({tasks.length} Directives)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Last synced: 19:42:15 IST
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map(task => {
              const isDone = task.status === 'COMPLETED';
              const isOperational = task.status === 'OPERATIONAL';
              const isArrived = task.status === 'ARRIVED';
              const isEnRoute = task.status === 'EN_ROUTE';

              return (
                <div 
                  key={task.id}
                  className={`rounded-2xl border p-4 transition-all bg-white shadow-xs ${
                    isDone 
                      ? 'border-emerald-300 bg-emerald-50/20' 
                      : isOperational 
                        ? 'border-blue-400 ring-1 ring-blue-400/40' 
                        : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Task Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        task.priority.includes('CRITICAL') 
                          ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Asset: {task.assetId}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Ref: {task.actionId}
                      </span>
                    </div>

                    {/* Live State Badge */}
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                        isDone 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : isOperational 
                            ? 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse'
                            : isArrived 
                              ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                        {isOperational && <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>}
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Title & Target */}
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug mb-1">
                    {task.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-2.5">
                    <span className="flex items-center gap-1 font-bold text-slate-800">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {task.target}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      [{task.coordinates}]
                    </span>
                    {task.etaMinutes > 0 && (
                      <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        <Clock className="h-3 w-3" />
                        ETA: ~{task.etaMinutes} mins
                      </span>
                    )}
                  </div>

                  {/* Tactical Instructions */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-700 mb-3">
                    <div className="font-bold text-slate-900 mb-0.5 flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-blue-600" />
                      <span>Field Operating Directive:</span>
                    </div>
                    <p>{task.instructions}</p>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono">
                      Statutory Citation: {task.sopCitation}
                    </div>
                  </div>

                  {/* Photo Proof & Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {task.photoEvidence ? (
                        <div className="flex items-center gap-2">
                          <img 
                            src={task.photoEvidence} 
                            alt="Field Proof" 
                            className="h-9 w-9 rounded-lg object-cover border border-slate-300 shadow-2xs cursor-pointer hover:scale-110 transition-transform"
                            onClick={() => window.open(task.photoEvidence, '_blank')}
                          />
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Geotagged Photo Proof Verified
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSimulatePhotoUpload(task.id)}
                          className="flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 text-xs font-bold transition-all border border-slate-300"
                        >
                          <Camera className="h-3.5 w-3.5 text-blue-600" />
                          <span>📸 Upload Field Geotag Proof</span>
                        </button>
                      )}
                    </div>

                    {/* Advance Status Button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAdvanceStatus(task.id)}
                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black shadow-xs transition-all active:scale-95 ${
                          isDone 
                            ? 'bg-slate-100 text-slate-500 border border-slate-200' 
                            : isOperational 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                              : isArrived 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                        }`}
                      >
                        <span>
                          {isEnRoute && 'Mark "Arrived on Scene" ➔'}
                          {isArrived && 'Mark "Operating / Active" ➔'}
                          {isOperational && 'Mark "Mission Complete" ✓'}
                          {isDone && 'Re-open Task Status'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Field Readiness & Radio Telemetry */}
        <div className="space-y-4">
          
          {/* Quick Ground Info Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Field Responder Authority Boundary</span>
            </h3>
            
            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <strong className="block text-emerald-950 font-extrabold mb-0.5">Authorized Ground Powers:</strong>
                • Advance physical asset states (En Route, Active, Cleared)<br/>
                • Submit geotagged visual proof to EOC<br/>
                • Direct telemetry feedback loop
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                <strong className="block text-rose-950 font-extrabold mb-0.5">🔒 PoLP Statutory Restrictions:</strong>
                • Cannot approve new civic orders or budgets<br/>
                • Cannot broadcast emergency SMS alerts<br/>
                • Must follow EOC Commander Incident Action Plan
              </div>
            </div>
          </div>

          {/* Quick Asset Depot Status */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Ward L Tactical Inventory
              </h3>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">Depot 17</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">Dewatering Pumps (1000 GPM)</span>
                <span className="font-mono font-black text-blue-750 bg-blue-100 px-2 py-0.5 rounded">1 Active / 2 Ready</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">Inflatable NDRF Rescue Boats</span>
                <span className="font-mono font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">2 Staged</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">Heavy Sandbags (50kg)</span>
                <span className="font-mono font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded">450 Units</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">Mobile Drinking Water Bowsers</span>
                <span className="font-mono font-black text-purple-800 bg-purple-100 px-2 py-0.5 rounded">2 Dispatched</span>
              </div>
            </div>
          </div>

          {/* Quick SOS Contact */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-white shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <PhoneCall className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-black uppercase text-amber-400">Emergency Radio Frequencies</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
              <div className="flex justify-between">
                <span>EOC Command:</span>
                <span className="text-white font-bold">VHF 156.800 MHz</span>
              </div>
              <div className="flex justify-between">
                <span>NDRF Tactical:</span>
                <span className="text-white font-bold">UHF 446.000 MHz</span>
              </div>
              <div className="flex justify-between">
                <span>Municipal Hotline:</span>
                <span className="text-emerald-400 font-bold">1077 / 1916</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
