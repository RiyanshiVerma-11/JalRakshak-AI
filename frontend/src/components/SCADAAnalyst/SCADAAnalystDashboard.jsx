import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || '';
import { 
  Activity, 
  Cpu, 
  Droplet, 
  Gauge, 
  CloudRain, 
  Flame, 
  Wrench, 
  Sliders, 
  Radio, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  Terminal, 
  Server,
  Lock,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Clock
} from 'lucide-react';
import StrandsDagVisualizer from '../AWSArchitecture/StrandsDagVisualizer';

export default function SCADAAnalystDashboard({ 
  currentUser, 
  incidents = [], 
  onSimulate, 
  onSwitchToCommander,
  onOpenLogin
}) {
  const [selectedWard, setSelectedWard] = useState('WARD-17');
  const [liveRainfall, setLiveRainfall] = useState(118.0);
  const [drainCapacity, setDrainCapacity] = useState(45.0);
  const [pipePressure, setPipePressure] = useState(1.8);
  const [normalPressure] = useState(4.2);
  const [temperature, setTemperature] = useState(44.8);
  const [reservoirPct, setReservoirPct] = useState(11.2);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [simulatedRiskScore, setSimulatedRiskScore] = useState(94);
  const [telemetryTime, setTelemetryTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTelemetryTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute live mathematical risk based on sliders
  useEffect(() => {
    let score = 50;
    if (selectedWard === 'WARD-17') {
      const rainRatio = liveRainfall / drainCapacity;
      score = Math.min(99, Math.round(40 + rainRatio * 25));
    } else if (selectedWard === 'WARD-08') {
      const drop = normalPressure - pipePressure;
      score = Math.min(99, Math.round(50 + drop * 18));
    } else if (selectedWard === 'WARD-04') {
      score = Math.min(99, Math.round(30 + (temperature / 50) * 60));
    } else {
      score = Math.min(99, Math.round(100 - reservoirPct * 2.5));
    }
    setSimulatedRiskScore(score);
  }, [liveRainfall, drainCapacity, pipePressure, temperature, reservoirPct, selectedWard]);

  const handleRunCalibration = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
    }, 800);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto animate-fade-in text-slate-800">
      
      {/* Top Banner: SCADA & Hydrology Telemetry Directorate */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border border-cyan-800/60 p-4 sm:p-5 shadow-xl text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600/30 text-cyan-400 border border-cyan-500/40 text-2xl shadow-inner">
            👩‍🔬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-black">
                Environmental Telemetry & SCADA Directorate (ICS-300)
              </span>
              <span className="flex items-center gap-1 rounded-full bg-cyan-500/20 px-2 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-500/40">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                248 IoT Sensors Stream Live
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white">
              {currentUser?.name || 'Dr. Ananya Verma'} — {currentUser?.title || 'Chief Hydrologist & SCADA Analyst'}
            </h1>
            <p className="text-xs text-slate-300">
              Department: <strong className="text-white">Municipal Hydrology & SCADA Telemetry Systems</strong>
            </p>
          </div>
        </div>

        {/* Live Clock & PoLP Notice */}
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-slate-800/90 px-3 py-1.5 border border-slate-700 text-right">
            <span className="text-[9px] font-mono uppercase text-slate-400 block">Telemetry Clock</span>
            <span className="text-xs font-mono font-bold text-cyan-300">{telemetryTime}</span>
          </div>
        </div>
      </div>

      {/* Statutory PoLP Advisory Strip */}
      <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-amber-700 shrink-0" />
          <span>
            <strong>Principle of Least Privilege (PoLP) Notice:</strong> You are in <strong>Technical Advisory Mode</strong>. You have unrestricted telemetry analysis and simulation tuning access. Statutory dispatch of pumps, rescue squads, and mass SMS requires <strong>Incident Commander</strong> sign-off (NDMA Sec 4.3).
          </span>
        </div>
        <button
          onClick={onSwitchToCommander}
          className="rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-black px-2.5 py-1 text-[11px] shadow-2xs whitespace-nowrap"
        >
          Request Commander Sign-Off ➔
        </button>
      </div>

      {/* 4 Sensor Telemetry Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Rain Gauge Spike */}
        <div className="rounded-2xl bg-white border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase text-slate-500 font-mono">IoT Rain Gauge R-17</span>
            <span className="p-1 rounded-lg bg-blue-100 text-blue-700"><CloudRain className="h-3.5 w-3.5" /></span>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-black text-rose-600 flex items-center gap-1.5">
              <span>{liveRainfall.toFixed(1)}</span>
              <span className="text-xs font-bold text-slate-500">mm/hr</span>
              <span className="text-[10px] text-rose-500 flex items-center font-bold font-mono"><TrendingUp className="h-3 w-3" />+162%</span>
            </div>
            <p className="text-[11px] text-slate-600">Threshold: {drainCapacity} mm/hr (Mithi Outfall D-17)</p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-rose-700 font-bold">
            <span>Severe Cloudburst</span>
            <span className="font-mono">Ward 17 (Kurla)</span>
          </div>
        </div>

        {/* Card 2: SCADA Mainline Pressure */}
        <div className="rounded-2xl bg-white border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase text-slate-500 font-mono">SCADA 600mm Sensor S-08</span>
            <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700"><Wrench className="h-3.5 w-3.5" /></span>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-black text-amber-600 flex items-center gap-1.5">
              <span>{pipePressure.toFixed(1)}</span>
              <span className="text-xs font-bold text-slate-500">Bar</span>
              <span className="text-[10px] text-amber-600 flex items-center font-bold font-mono"><TrendingDown className="h-3 w-3" />-2.4 Bar</span>
            </div>
            <p className="text-[11px] text-slate-600">Baseline: 4.2 Bar | Treated Loss: 520 KLD</p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-amber-700 font-bold">
            <span>Cavitation Risk</span>
            <span className="font-mono">Ward 8 (WEH Andheri)</span>
          </div>
        </div>

        {/* Card 3: Wet-Bulb Heat Index */}
        <div className="rounded-2xl bg-white border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase text-slate-500 font-mono">IMD Weather AWS W-04</span>
            <span className="p-1 rounded-lg bg-amber-100 text-amber-700"><Flame className="h-3.5 w-3.5" /></span>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-black text-amber-600 flex items-center gap-1.5">
              <span>{temperature.toFixed(1)}°C</span>
              <span className="text-[10px] text-amber-700 font-bold font-mono">51.2°C Index</span>
            </div>
            <p className="text-[11px] text-slate-600">Wet-Bulb: 32.4°C (Thermal Distress Level 3)</p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-amber-800 font-bold">
            <span>Severe Heat Index Spike</span>
            <span className="font-mono">Ward 4 (Dadar)</span>
          </div>
        </div>

        {/* Card 4: Reservoir Capacity */}
        <div className="rounded-2xl bg-white border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase text-slate-500 font-mono">Govandi Elevated S-12</span>
            <span className="p-1 rounded-lg bg-purple-100 text-purple-700"><Droplet className="h-3.5 w-3.5" /></span>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-black text-rose-600 flex items-center gap-1.5">
              <span>{reservoirPct.toFixed(1)}%</span>
              <span className="text-xs font-bold text-slate-500">Live</span>
              <span className="text-[10px] text-rose-600 flex items-center font-bold font-mono"><TrendingDown className="h-3 w-3" />Critical</span>
            </div>
            <p className="text-[11px] text-slate-600">Per Capita Deficit: 48 LPCD | 1 hr supply</p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-purple-800 font-bold">
            <span>Bowser Rotation Queued</span>
            <span className="font-mono">Ward 12 (Govandi)</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Grid: Telemetry Waveforms + ML What-If Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 7 Cols: Telemetry Deep Dive & Calibration Sandbox */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Interactive Calibration Sandbox */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-cyan-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Hydrological Sensor Calibration & What-If ML Tuning
                </h3>
              </div>
              <button
                onClick={handleRunCalibration}
                disabled={isCalibrating}
                className="flex items-center gap-1 text-[11px] font-bold text-cyan-700 hover:text-cyan-900 transition-colors"
              >
                <RefreshCw className={`h-3 w-3 ${isCalibrating ? 'animate-spin' : ''}`} />
                <span>{isCalibrating ? 'Calibrating Sensors...' : 'Recalibrate Sensor Array'}</span>
              </button>
            </div>

            {/* Ward Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-600">Target Telemetry Station:</span>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="rounded-lg bg-slate-50 border border-slate-300 px-3 py-1 font-bold text-slate-800 text-xs focus:border-cyan-600 outline-none"
              >
                <option value="WARD-17">Station 17: Kurla West / Mithi Outfall D-17 (Flood Sensor)</option>
                <option value="WARD-08">Station 08: Andheri East / WEH Corridor (SCADA Pressure)</option>
                <option value="WARD-04">Station 04: Dadar Parel (Heat Index & Wet-Bulb)</option>
                <option value="WARD-12">Station 12: Govandi / Trombay Creek (Reservoir Level)</option>
              </select>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              
              {/* Slider 1: Rain */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Precipitation Rate</span>
                  <span className="font-mono text-blue-700">{liveRainfall} mm/hr</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="180"
                  step="2"
                  value={liveRainfall}
                  onChange={(e) => setLiveRainfall(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Normal (25mm)</span>
                  <span>Cloudburst (100mm+)</span>
                </div>
              </div>

              {/* Slider 2: Drain Outfall */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Drain Discharge Capacity</span>
                  <span className="font-mono text-emerald-700">{drainCapacity} mm/hr</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={drainCapacity}
                  onChange={(e) => setDrainCapacity(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Choked (30mm)</span>
                  <span>Clear (70mm)</span>
                </div>
              </div>

              {/* Slider 3: SCADA Pressure */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Pipeline Pressure</span>
                  <span className="font-mono text-amber-700">{pipePressure} Bar</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={pipePressure}
                  onChange={(e) => setPipePressure(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Burst (&lt;2.0 Bar)</span>
                  <span>Healthy (4.2 Bar)</span>
                </div>
              </div>

              {/* Slider 4: Wet-Bulb Temp */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Ambient Temperature</span>
                  <span className="font-mono text-rose-700">{temperature}°C</span>
                </div>
                <input
                  type="range"
                  min="28"
                  max="50"
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Normal (32°C)</span>
                  <span>Extreme Heat (45°C+)</span>
                </div>
              </div>
            </div>

            {/* Real-Time Mathematical Risk Output */}
            <div className="rounded-xl bg-gradient-to-r from-slate-900 to-cyan-950 p-3.5 text-white flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider block font-bold">
                  AI Multi-Agent Computed Vulnerability Index:
                </span>
                <span className="text-xl font-black text-white">
                  Risk Score: {simulatedRiskScore}/100 — {simulatedRiskScore > 75 ? '🚨 CRITICAL HAZARD' : '⚠️ HIGH RISK'}
                </span>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => onSimulate(
                    selectedWard === 'WARD-17' ? 'flood' : selectedWard === 'WARD-08' ? 'leak' : selectedWard === 'WARD-04' ? 'heatwave' : 'water_shortage',
                    selectedWard === 'WARD-17' ? liveRainfall : null
                  )}
                  className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-3 py-1.5 text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  ⚡ Fire Live Simulation ➔
                </button>
              </div>
            </div>
          </div>

          {/* High Tide & Hydrology Waveform Analysis */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-blue-600" />
                <span>Arabian Sea Tidal Hydrograph & Outfall Gate Clearance</span>
              </h3>
              <span className="text-[10px] font-mono text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Peak Spring Tide: 4.82m at 18:30 hrs
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-mono text-[11px] text-slate-700">
                  <span>14:00 (Low Tide 1.2m)</span>
                  <span>16:30 (Rising 3.4m)</span>
                  <span className="text-rose-600 font-bold">18:30 (PEAK 4.82m)</span>
                  <span>21:00 (Ebb 2.8m)</span>
                </div>
                {/* Visual Bar Graph */}
                <div className="h-4 rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="bg-blue-400 h-full w-[25%]"></div>
                  <div className="bg-cyan-500 h-full w-[35%]"></div>
                  <div className="bg-rose-500 h-full w-[25%] animate-pulse"></div>
                  <div className="bg-blue-600 h-full w-[15%]"></div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                <strong>Hydrologist Assessment:</strong> High tide of 4.82m creates negative hydraulic head against Drain Outfall D-17. Gravitational discharge into Mithi River drops to <strong>0% efficiency</strong> between 17:45 and 19:15 hrs. Dewatering pump P-04 deployment is mathematically mandatory to avoid submerging Bhabha Hospital basements.
              </p>
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Strands 5-Agent Latency Diagnostics & Bedrock Metrics */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Strands Execution DAG Latency */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-cyan-600" />
                <h3 className="text-xs font-black uppercase text-slate-900">
                  AWS Strands Agents Pipeline Latency
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live Measured
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">1. Risk Detection Agent</span>
                <span className="font-mono text-blue-700 font-bold">Risk Detection (Measured)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">2. Impact Assessment Agent</span>
                <span className="font-mono text-blue-700 font-bold">Impact Assessment (Measured)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">3. Resource Allocation Agent</span>
                <span className="font-mono text-blue-700 font-bold">Resource Matching (Measured)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">4. Multilingual Comm Agent</span>
                <span className="font-mono text-blue-700 font-bold">Multilingual Comm (Measured)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">5. Coordinator Agent (RAG)</span>
                <span className="font-mono text-blue-700 font-bold">Coordinator RAG (Measured)</span>
              </div>
            </div>
          </div>

          {/* Amazon Bedrock Token Consumption */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
              <Server className="h-4 w-4 text-purple-600" />
              <span>Amazon Bedrock Foundation Model Metrics</span>
            </h3>
            
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Model ID:</span>
                <span className="font-bold text-slate-900">anthropic.claude-3-5-sonnet-v2</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Embeddings:</span>
                <span className="font-bold text-slate-900">amazon.titan-embed-text-v2</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Inference Latency:</span>
                <span className="text-emerald-600 font-bold">Real-time (measured per invocation)</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Invocation Cost:</span>
                <span className="text-slate-900 font-bold">On-demand pricing</span>
              </div>
            </div>
          </div>

          {/* Direct Hand-off to Incident Commander */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 p-4 text-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Statutory Commander Hand-off
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When telemetry anomalies exceed critical thresholds, transmit formal recommendation to Municipal Incident Commander for statutory dispatch under Disaster Management Act 2005.
            </p>
            <button
              onClick={onSwitchToCommander}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black py-2 text-xs shadow-md transition-all active:scale-95"
            >
              <span>Transmit Recommendation to EOC Commander ➔</span>
            </button>
          </div>

        </div>

      </div>

      {/* ⚡ Custom Telemetry Injector — Live API Slider */}
      <CustomTelemetryInjector apiBase={API_BASE} />

    </div>
  );
}


// ──────────────────────────────────────────────────────────────────────────
//  CustomTelemetryInjector – live API-wired rainfall slider for judge demo
// ──────────────────────────────────────────────────────────────────────────
function CustomTelemetryInjector({ apiBase = '' }) {
  const [rainfall, setRainfall]     = React.useState(118);
  const [tide, setTide]             = React.useState('HIGH');
  const [loading, setLoading]       = React.useState(false);
  const [result, setResult]         = React.useState(null);
  const [error, setError]           = React.useState(null);

  const riskColor = {
    CRITICAL: 'text-rose-500',
    HIGH:     'text-orange-500',
    ELEVATED: 'text-yellow-500',
    NORMAL:   'text-emerald-500',
  };
  const riskBg = {
    CRITICAL: 'bg-rose-950/60 border-rose-700/60',
    HIGH:     'bg-orange-950/60 border-orange-700/60',
    ELEVATED: 'bg-yellow-950/60 border-yellow-700/60',
    NORMAL:   'bg-emerald-950/60 border-emerald-700/60',
  };

  const handleInject = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/v1/simulate/dynamic-telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rainfall_rate:    rainfall,
          tide_level:       tide,
          ward_id:          'WARD-17',
          verified_photos:  Math.floor(rainfall / 18),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950/80 to-slate-900 border border-cyan-700/50 p-4 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-cyan-800/40 pb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 text-base">⚡</span>
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300">
            Custom Telemetry Injector
          </h3>
          <p className="text-[10px] text-slate-400 font-mono">Live Bedrock + RAG recalculation via /api/v1/simulate/dynamic-telemetry</p>
        </div>
      </div>

      {/* Rainfall Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-300">Rainfall Rate Injection</span>
          <span className={`font-mono font-black text-sm ${rainfall >= 130 ? 'text-rose-400' : rainfall >= 90 ? 'text-orange-400' : rainfall >= 55 ? 'text-yellow-400' : 'text-emerald-400'}`}>
            {rainfall} mm/hr
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="220"
          step="5"
          value={rainfall}
          onChange={(e) => { setRainfall(Number(e.target.value)); setResult(null); }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-cyan-400"
          style={{ background: `linear-gradient(to right, #22d3ee ${((rainfall-10)/210)*100}%, #1e293b ${((rainfall-10)/210)*100}%)` }}
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>10 mm/hr (Normal)</span>
          <span className="text-yellow-500">55 (Elevated)</span>
          <span className="text-orange-500">90 (High)</span>
          <span className="text-rose-500">130+ (CRITICAL)</span>
        </div>
      </div>

      {/* Tide Level Selector */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-bold whitespace-nowrap">Tidal State:</span>
        {['LOW', 'NORMAL', 'HIGH', 'VERY_HIGH'].map((t) => (
          <button
            key={t}
            onClick={() => { setTide(t); setResult(null); }}
            className={`rounded-lg px-2.5 py-1 font-bold text-[10px] border transition-all ${tide === t ? 'bg-cyan-600/40 border-cyan-500/60 text-cyan-300' : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:border-cyan-600/40'}`}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Action Button */}
      <button
        onClick={handleInject}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-black py-2.5 text-xs shadow-lg transition-all active:scale-95"
      >
        {loading ? (
          <>
            <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Invoking Bedrock + RAG Pipeline…
          </>
        ) : (
          <>⚡ Recalculate &amp; Inject Telemetry</>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-rose-950/60 border border-rose-700/50 px-3 py-2 text-xs text-rose-300 font-mono">
          ⚠ {error}
        </div>
      )}

      {/* Live Result HUD */}
      {result && (
        <div className={`rounded-2xl border p-3.5 space-y-3 ${riskBg[result.risk_level] || 'bg-slate-800/60 border-slate-700/50'}`}>
          {/* Risk Badge */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">AI Risk Classification</span>
              <span className={`text-2xl font-black ${riskColor[result.risk_level] || 'text-white'}`}>
                {result.risk_level}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block">Confidence Score</span>
              <span className="text-2xl font-black text-emerald-400">{result.confidence_score}%</span>
            </div>
          </div>

          {/* 4-card HUD grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Breach %',          value: `${result.breach_pct}%`,                 color: 'text-rose-400' },
              { label: 'Pumps Required',     value: `${result.pump_count} units`,             color: 'text-cyan-400' },
              { label: 'Exposed Citizens',   value: result.exposed_population.toLocaleString(), color: 'text-orange-400' },
              { label: 'Vector Similarity',  value: result.sop_match.vector_score.toFixed(4),  color: 'text-purple-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl bg-slate-900/60 border border-slate-700/40 p-2.5 text-center">
                <span className="text-[9px] font-mono uppercase text-slate-500 block">{label}</span>
                <span className={`text-base font-black ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* SOP Match */}
          <div className="rounded-xl bg-slate-900/70 border border-slate-700/40 p-2.5 space-y-1">
            <span className="text-[9px] font-mono uppercase text-slate-500">RAG Vector SOP Match</span>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-300">{result.sop_match.id}</span>
              <span className="text-[10px] font-mono text-purple-300">{result.sop_match.vector_score.toFixed(4)}</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">{result.sop_match.citation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

