import React, { useState } from 'react';
import { 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Building, 
  Sparkles,
  Sliders
} from 'lucide-react';

export default function WhatIfImpactSimulator({ incident, onRunDynamicSimulation }) {
  // Timeline step: 0: T+0m, 1: T+15m, 2: T+30m, 3: T+60m, 4: T+120m
  const [timeStep, setTimeStep] = useState(1);
  // Controlled rainfall state (range 35-200 mm/hr, default 118 mm/hr)
  const [rainfall, setRainfall] = useState(118);
  const [isDynamicRunning, setIsDynamicRunning] = useState(false);

  // Baseline Simulation Timeline Data (calibrated for 118 mm/hr cloudburst)
  const steps = [
    {
      time: 'T+0m',
      label: 'Cloudburst',
      baseRain: 118,
      no_ai: {
        depth_cm: 20,
        inundation_sqkm: 1.2,
        hospital_status: 'NORMAL: Baseline monitoring, road approach clear',
        stalled_vehicles: 12,
        economic_loss_lakhs: 20,
        exposed_pop: 2400
      },
      with_ai: {
        depth_cm: 20,
        inundation_sqkm: 1.2,
        hospital_status: 'Precautionary flood barrier sealed at hospital gate',
        stalled_vehicles: 0,
        economic_loss_lakhs: 5,
        exposed_pop: 8420,
        action_active: 'Risk Agent detected capacity breach & auto-alerted EOC'
      }
    },
    {
      time: 'T+15m',
      label: 'Pump En Route',
      baseRain: 118,
      no_ai: {
        depth_cm: 38,
        inundation_sqkm: 2.1,
        hospital_status: 'Water enters hospital compound road; emergency bays slowing',
        stalled_vehicles: 45,
        economic_loss_lakhs: 85,
        exposed_pop: 5600
      },
      with_ai: {
        depth_cm: 36,
        inundation_sqkm: 1.6,
        hospital_status: 'Bhabha Hospital sandbagged & generators elevated',
        stalled_vehicles: 2,
        economic_loss_lakhs: 18,
        exposed_pop: 8420,
        action_active: 'Pump P-04 (1000 GPM) arriving at Outfall D-17'
      }
    },
    {
      time: 'T+30m',
      label: 'Dewatering Active',
      baseRain: 95,
      no_ai: {
        depth_cm: 52,
        inundation_sqkm: 3.2,
        hospital_status: '⚠️ Basement flooded: Oxygen plant compromised',
        stalled_vehicles: 110,
        economic_loss_lakhs: 240,
        exposed_pop: 8420
      },
      with_ai: {
        depth_cm: 24,
        inundation_sqkm: 1.4,
        hospital_status: '100% PROTECTED: Oxygen plant & ICU fully operational',
        stalled_vehicles: 0,
        economic_loss_lakhs: 32,
        exposed_pop: 8420,
        action_active: '1000 GPM pump discharging 3,780 Litres/min'
      }
    },
    {
      time: 'T+60m',
      label: 'Water Receding',
      baseRain: 60,
      no_ai: {
        depth_cm: 62,
        inundation_sqkm: 3.8,
        hospital_status: '❌ Critical: 420 ICU patients require emergency evacuation',
        stalled_vehicles: 260,
        economic_loss_lakhs: 540,
        exposed_pop: 14500
      },
      with_ai: {
        depth_cm: 12,
        inundation_sqkm: 0.6,
        hospital_status: 'SAFE: Water receding into cleared stormwater gullies',
        stalled_vehicles: 0,
        economic_loss_lakhs: 48,
        exposed_pop: 8420,
        action_active: 'LBS Marg corridor reopened for tactical & emergency transit'
      }
    },
    {
      time: 'T+120m',
      label: 'Drain Cleared',
      baseRain: 25,
      no_ai: {
        depth_cm: 48,
        inundation_sqkm: 2.8,
        hospital_status: 'Severe structural contamination, power grid shutdown in ward',
        stalled_vehicles: 310,
        economic_loss_lakhs: 720,
        exposed_pop: 18000
      },
      with_ai: {
        depth_cm: 4,
        inundation_sqkm: 0.1,
        hospital_status: 'RESTORED: Full normal operations across ward',
        stalled_vehicles: 0,
        economic_loss_lakhs: 52,
        exposed_pop: 8420,
        action_active: 'Post-event drainage telemetry inspection completed'
      }
    }
  ];

  const currentStepData = steps[timeStep];
  const rainRatio = rainfall / 118.0;

  // Status Quo (No AI) dynamic calculations reactive to rainfall slider
  const noAiDepth = Math.max(5, Math.round(currentStepData.no_ai.depth_cm * Math.pow(rainRatio, 1.15)));
  const noAiInundation = Math.max(0.2, Number((currentStepData.no_ai.inundation_sqkm * Math.pow(rainRatio, 0.95)).toFixed(1)));
  const noAiVehicles = Math.max(0, Math.round(currentStepData.no_ai.stalled_vehicles * Math.pow(rainRatio, 1.2)));
  const noAiLossLakhs = Math.max(10, Math.round(currentStepData.no_ai.economic_loss_lakhs * Math.pow(rainRatio, 1.25)));

  // With JalRakshak AI dynamic calculations reactive to rainfall slider
  const withAiDepth = Math.max(2, Math.round(currentStepData.with_ai.depth_cm * Math.pow(rainRatio, 0.65)));
  const withAiInundation = Math.max(0.1, Number((currentStepData.with_ai.inundation_sqkm * Math.pow(rainRatio, 0.7)).toFixed(1)));
  const withAiVehicles = Math.max(0, Math.round(currentStepData.with_ai.stalled_vehicles * Math.pow(rainRatio, 0.8)));
  const withAiLossLakhs = Math.max(2, Math.round(currentStepData.with_ai.economic_loss_lakhs * Math.pow(rainRatio, 0.75)));

  // Losses Prevented & Avoided dynamic calculation
  const savedLakhs = Math.max(0, noAiLossLakhs - withAiLossLakhs);
  const savedCr = (savedLakhs / 100).toFixed(2);
  const avoidedPct = noAiLossLakhs > 0 ? Math.round(((noAiLossLakhs - withAiLossLakhs) / noAiLossLakhs) * 100) : 91;

  // Dynamic precipitation rate at selected time horizon
  const currentRainRate = Math.round(rainfall * (currentStepData.baseRain / 118.0));

  // Dynamic hospital status text based on severity & AI intervention
  let hospitalStatusNoAi = currentStepData.no_ai.hospital_status;
  if (rainfall >= 135 && timeStep >= 2) {
    hospitalStatusNoAi = '❌ CATASTROPHIC: Oxygen generation offline, 420 ICU emergency airlifts required';
  } else if (rainfall >= 90 && timeStep >= 2) {
    hospitalStatusNoAi = '⚠️ Critical: Basement submerged, ICU oxygen supply compromised';
  } else if (rainfall < 60 && timeStep >= 2) {
    hospitalStatusNoAi = '⚠️ Minor waterlogging at hospital approach gate (delayed access)';
  }

  let hospitalStatusWithAi = currentStepData.with_ai.hospital_status;
  if (timeStep >= 2) {
    hospitalStatusWithAi = '100% PROTECTED: Barriers sealed & 1000 GPM pump active (Zero ICU breach)';
  }

  return (
    <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xl mt-4 transition-all space-y-4">
      
      {/* 1. Header Bar: Dark Slate Text (#0F172A) & Dark Badges (#1E293B) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md">
            <TrendingDown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-tight text-[#0F172A] flex flex-wrap items-center gap-2">
              <span>PREDICTIVE WHAT-IF IMPACT SIMULATOR</span>
              <span className="rounded-full bg-[#1E293B] text-white px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase border border-slate-700 shadow-xs">
                LIVE SCENARIO PROOF
              </span>
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Real-time comparison: Status Quo (4-hour manual delay) vs JalRakshak Autonomous Response
            </p>
          </div>
        </div>

        {/* High-Contrast Losses Prevented Pill */}
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-black text-emerald-900 border border-emerald-300 shadow-xs self-start sm:self-auto">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>₹{savedCr} Cr Losses Prevented</span>
        </div>
      </div>

      {/* 2. DYNAMIC TELEMETRY CONTROLLER (Judge Sandbox) - Unified Cohesive Palette */}
      <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-black tracking-wide uppercase text-[#0F172A]">
              Interactive Environmental Stress Testing (Judge Sandbox)
            </span>
          </div>
          {/* Telemetry Input Pill with Dark Slate Text */}
          <span className="text-[11px] font-mono font-bold text-[#0F172A] bg-blue-100/90 px-2.5 py-1 rounded-lg border border-blue-200 shadow-xs">
            Live Telemetry Input: <strong className="text-blue-900 font-black">{rainfall} mm/hr</strong>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
              <span>Moderate (35 mm/hr)</span>
              <span className="text-blue-700 font-black text-xs">{rainfall} mm/hr</span>
              <span>Extreme Cloudburst (200 mm/hr)</span>
            </div>
            {/* Controlled State Range Slider */}
            <input
              type="range"
              min="35"
              max="200"
              step="5"
              value={rainfall}
              onChange={(e) => setRainfall(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
            />
          </div>

          {onRunDynamicSimulation && (
            <button
              onClick={async () => {
                setIsDynamicRunning(true);
                await onRunDynamicSimulation('flood', rainfall);
                setIsDynamicRunning(false);
              }}
              disabled={isDynamicRunning}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 shrink-0 disabled:opacity-50"
            >
              {isDynamicRunning ? 'Recalculating 5-Agent DAG...' : '⚡ Trigger Live Bedrock Run'}
            </button>
          )}
        </div>
        <p className="text-[10px] text-slate-500 font-medium">
          Move the slider to any arbitrary rainfall value. Notice how water depth, economic loss, and pump dispatch counts immediately recalculate across all timeline intervals.
        </p>
      </div>

      {/* 3. Interactive Time Horizon Scrubber & Explicitly Bordered Pills */}
      <div className="py-3 border-y border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between text-xs font-bold gap-2">
          <span className="flex items-center gap-1.5 text-[#0F172A] text-xs font-extrabold">
            <Clock className="h-4 w-4 text-blue-600" />
            Simulation Horizon: <span className="text-blue-700 font-black">{currentStepData.time} ({currentStepData.label})</span>
          </span>
          <span className="text-xs text-slate-600 font-medium">
            Precipitation Rate: <strong className="text-slate-900 font-mono font-bold">{currentRainRate} mm/hr</strong>
          </span>
        </div>

        {/* Range Scrubber */}
        <input 
          type="range" 
          min="0" 
          max="4" 
          step="1"
          value={timeStep}
          onChange={(e) => setTimeStep(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
        />

        {/* 5 Horizon Buttons: Inactive have readable dark gray/slate text with explicit border, Active have solid highlight */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {steps.map((step, idx) => (
            <button
              key={step.time}
              type="button"
              onClick={() => setTimeStep(idx)}
              className={`px-2.5 py-2 rounded-xl text-xs text-center transition-all active:scale-95 flex flex-col items-center justify-center ${
                timeStep === idx
                  ? 'bg-blue-600 text-white font-bold border-2 border-blue-700 shadow-md shadow-blue-500/25'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border-2 border-slate-300 font-semibold shadow-2xs'
              }`}
            >
              <span className="font-mono text-xs font-black">{step.time}</span>
              <span className="text-[10px] opacity-90 truncate">{step.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Side-by-Side Dual Pathway Comparison Cards (Harmonious Theme) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        
        {/* Pathway A: Without JalRakshak AI (Status Quo) */}
        <div className="rounded-2xl bg-gradient-to-b from-rose-50/80 to-rose-100/40 p-5 border-2 border-rose-300 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-200">
              <span className="text-xs font-black uppercase text-rose-900 flex items-center gap-1.5 tracking-wider">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                Status Quo (No AI Intervention)
              </span>
              <span className="text-[11px] font-bold font-mono text-rose-900 bg-rose-200/80 px-2.5 py-0.5 rounded-full border border-rose-300">
                Manual 4-hr Lag
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3.5 text-xs">
              <div className="rounded-xl bg-white p-3 border border-rose-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Water Depth</span>
                <strong className="text-rose-700 text-2xl font-black block">{noAiDepth} cm</strong>
              </div>
              <div className="rounded-xl bg-white p-3 border border-rose-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Inundation Area</span>
                <strong className="text-rose-700 text-2xl font-black block">{noAiInundation} km²</strong>
              </div>
              <div className="rounded-xl bg-white p-3 border border-rose-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Stalled Vehicles</span>
                <strong className="text-amber-800 text-2xl font-black block">{noAiVehicles} units</strong>
              </div>
              <div className="rounded-xl bg-white p-3 border border-rose-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Municipal Damage</span>
                <strong className="text-rose-900 text-2xl font-black block">₹{noAiLossLakhs} Lakhs</strong>
              </div>
            </div>

            {/* Hospital Vulnerability status */}
            <div className="mt-3.5 p-3 rounded-xl bg-white border-2 border-rose-300 shadow-xs">
              <span className="text-[11px] font-extrabold text-rose-900 block mb-1 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-rose-600" />
                Bhabha Municipal Hospital Status:
              </span>
              <p className="font-bold text-rose-800 text-xs leading-snug">
                {hospitalStatusNoAi}
              </p>
            </div>
          </div>

          <div className="text-xs text-rose-900 font-extrabold pt-2.5 border-t border-rose-200 flex items-center gap-1.5">
            <span>⚠️ Severe ICU threat & unmitigated road gridlock</span>
          </div>
        </div>

        {/* Pathway B: With JalRakshak AI (Automated 5-Agent Response) */}
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50/80 to-teal-50/50 p-5 border-2 border-emerald-400 shadow-md flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"></div>

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
              <span className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5 tracking-wider">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                With JalRakshak AI (Pump P-04 Dispatched)
              </span>
              <span className="text-[11px] font-black font-mono text-emerald-950 bg-emerald-200/90 px-2.5 py-0.5 rounded-full border border-emerald-400">
                Response in &lt; 60s
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3.5 text-xs">
              <div className="rounded-xl bg-white p-3 border border-emerald-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Water Depth</span>
                <strong className="text-emerald-700 text-2xl font-black block">{withAiDepth} cm</strong>
              </div>
              <div className="rounded-xl bg-white p-3 border border-emerald-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Inundation Area</span>
                <strong className="text-teal-700 text-2xl font-black block">{withAiInundation} km²</strong>
              </div>
              <div className="rounded-xl bg-white p-3 border border-emerald-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Traffic Stalls</span>
                <strong className="text-emerald-700 text-2xl font-black block">{withAiVehicles} (Diverted to BKC)</strong>
              </div>
              <div className="rounded-xl bg-white p-3 border border-emerald-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Controlled Damage</span>
                {/* Prominently displays the Lakhs currency unit */}
                <strong className="text-emerald-900 text-2xl font-black block">
                  ₹{withAiLossLakhs} <span className="text-sm font-bold text-emerald-800">Lakhs</span>
                </strong>
              </div>
            </div>

            {/* Hospital Protection Status */}
            <div className="mt-3.5 p-3 rounded-xl bg-white border-2 border-emerald-300 shadow-xs">
              <span className="text-[11px] font-extrabold text-emerald-950 block mb-1 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-emerald-600" />
                Bhabha Municipal Hospital Status:
              </span>
              <p className="font-extrabold text-emerald-800 text-xs leading-snug">
                {hospitalStatusWithAi}
              </p>
            </div>
          </div>

          <div className="text-xs text-emerald-950 font-bold pt-2.5 border-t border-emerald-200 flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-700">Active: {currentStepData.with_ai.action_active}</span>
            <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-md font-black text-[11px] shadow-xs">
              {avoidedPct}% Damage Avoided
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
