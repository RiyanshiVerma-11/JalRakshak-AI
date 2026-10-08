import React, { useState } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Building, 
  Users, 
  IndianRupee, 
  Zap, 
  Droplet,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function WhatIfImpactSimulator({ incident }) {
  const [timeStep, setTimeStep] = useState(2); // 0: T+0m, 1: T+15m, 2: T+30m, 3: T+60m, 4: T+120m

  const timeLabels = ['T+0m (Cloudburst)', 'T+15m (Pump En Route)', 'T+30m (Dewatering Active)', 'T+60m (Water Receding)', 'T+120m (Drain Cleared)'];

  // Simulation Timeline Data
  const steps = [
    {
      time: 'T+0m',
      rain_rate: '118 mm/hr',
      no_ai: {
        depth_cm: 20,
        inundation_sqkm: 1.2,
        hospital_status: 'NORMAL (Baseline monitoring)',
        hospital_safe: true,
        stalled_vehicles: 12,
        economic_loss_lakhs: 20,
        exposed_pop: 2400
      },
      with_ai: {
        depth_cm: 20,
        inundation_sqkm: 1.2,
        hospital_status: 'Precautionary flood barrier sealed',
        hospital_safe: true,
        stalled_vehicles: 0,
        economic_loss_lakhs: 5,
        exposed_pop: 8420,
        action_active: 'Risk Agent detected 162% capacity breach'
      }
    },
    {
      time: 'T+15m',
      rain_rate: '118 mm/hr',
      no_ai: {
        depth_cm: 38,
        inundation_sqkm: 2.1,
        hospital_status: 'Water enters hospital compound road',
        hospital_safe: true,
        stalled_vehicles: 45,
        economic_loss_lakhs: 85,
        exposed_pop: 5600
      },
      with_ai: {
        depth_cm: 36,
        inundation_sqkm: 1.6,
        hospital_status: 'Bhabha Hospital sandbagged & generators elevated',
        hospital_safe: true,
        stalled_vehicles: 2,
        economic_loss_lakhs: 18,
        exposed_pop: 8420,
        action_active: 'Pump P-04 (1000 GPM) arriving at Outfall D-17'
      }
    },
    {
      time: 'T+30m',
      rain_rate: '95 mm/hr',
      no_ai: {
        depth_cm: 52,
        inundation_sqkm: 3.2,
        hospital_status: '⚠️ Basement flooded: Oxygen plant compromised',
        hospital_safe: false,
        stalled_vehicles: 110,
        economic_loss_lakhs: 240,
        exposed_pop: 8420
      },
      with_ai: {
        depth_cm: 24,
        inundation_sqkm: 1.4,
        hospital_status: '100% PROTECTED: Oxygen plant & ICU operational',
        hospital_safe: true,
        stalled_vehicles: 0,
        economic_loss_lakhs: 32,
        exposed_pop: 8420,
        action_active: '1000 GPM pump discharging 3,780 Litres/min'
      }
    },
    {
      time: 'T+60m',
      rain_rate: '60 mm/hr',
      no_ai: {
        depth_cm: 62,
        inundation_sqkm: 3.8,
        hospital_status: '❌ Critical: 420 ICU patients require emergency evacuation',
        hospital_safe: false,
        stalled_vehicles: 260,
        economic_loss_lakhs: 540,
        exposed_pop: 14500
      },
      with_ai: {
        depth_cm: 12,
        inundation_sqkm: 0.6,
        hospital_status: 'SAFE: Water receding to drainage gullies',
        hospital_safe: true,
        stalled_vehicles: 0,
        economic_loss_lakhs: 48,
        exposed_pop: 8420,
        action_active: 'LBS Marg corridor reopened for traffic'
      }
    },
    {
      time: 'T+120m',
      rain_rate: '25 mm/hr',
      no_ai: {
        depth_cm: 48,
        inundation_sqkm: 2.8,
        hospital_status: 'Severe structural contamination, power grid shutdown',
        hospital_safe: false,
        stalled_vehicles: 310,
        economic_loss_lakhs: 720,
        exposed_pop: 18000
      },
      with_ai: {
        depth_cm: 4,
        inundation_sqkm: 0.1,
        hospital_status: 'RESTORED: Full normal operations across ward',
        hospital_safe: true,
        stalled_vehicles: 0,
        economic_loss_lakhs: 52,
        exposed_pop: 8420,
        action_active: 'Post-event drainage inspection initiated'
      }
    }
  ];

  const current = steps[timeStep];

  return (
    <div className="rounded-2xl glass-panel-elevated p-5 border border-slate-800 shadow-2xl mt-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
            <TrendingDown className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              Predictive "What-If" Impact Simulator (Proof of Impact)
            </h4>
            <p className="text-[11px] text-slate-400">
              Comparing Status Quo (4-hour manual delay) vs JalRakshak Autonomous Response
            </p>
          </div>
        </div>

        {/* Loss Avoided Pill */}
        <div className="flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 py-1.5 text-xs font-black text-emerald-400 border border-emerald-500/40 shadow-sm self-start sm:self-auto">
          <Sparkles className="h-3.5 w-3.5" />
          <span>₹{(current.no_ai.economic_loss_lakhs - current.with_ai.economic_loss_lakhs) / 100} Cr Losses Prevented</span>
        </div>
      </div>

      {/* Interactive Time Scrubber Slider */}
      <div className="py-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Clock className="h-3.5 w-3.5" />
            Simulation Horizon: <strong>{timeLabels[timeStep]}</strong>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Precipitation: <strong className="text-blue-300">{current.rain_rate}</strong>
          </span>
        </div>

        <input 
          type="range" 
          min="0" 
          max="4" 
          step="1"
          value={timeStep}
          onChange={(e) => setTimeStep(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />

        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
          <span>T+0m (Cloudburst)</span>
          <span>T+15m (Dispatch)</span>
          <span>T+30m (Dewatering)</span>
          <span>T+60m (Receding)</span>
          <span>T+120m (Restored)</span>
        </div>
      </div>

      {/* Side-by-Side Dual Pathway Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        
        {/* Pathway A: Without JalRakshak AI (Status Quo) */}
        <div className="rounded-xl bg-red-950/20 p-4 border border-red-500/30 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-red-500/20">
              <span className="text-xs font-black uppercase text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Status Quo (No AI Intervention)
              </span>
              <span className="text-[10px] font-mono text-red-400/80">Manual 4-hr Lag</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="rounded-lg bg-slate-950/70 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Water Depth</span>
                <strong className="text-red-400 text-sm">{current.no_ai.depth_cm} cm</strong>
              </div>
              <div className="rounded-lg bg-slate-950/70 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Inundation Area</span>
                <strong className="text-red-300 text-sm">{current.no_ai.inundation_sqkm} km²</strong>
              </div>
              <div className="rounded-lg bg-slate-950/70 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Stalled Vehicles</span>
                <strong className="text-amber-400 text-sm">{current.no_ai.stalled_vehicles} units</strong>
              </div>
              <div className="rounded-lg bg-slate-950/70 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Municipal Damage</span>
                <strong className="text-red-400 text-sm">₹{current.no_ai.economic_loss_lakhs} Lakhs</strong>
              </div>
            </div>

            {/* Hospital Vulnerability status */}
            <div className="mt-3 p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 text-xs">
              <span className="text-[10px] font-bold text-red-400 block mb-0.5">Bhabha Municipal Hospital Status:</span>
              <p className="font-semibold text-slate-200 text-[11px]">{current.no_ai.hospital_status}</p>
            </div>
          </div>

          <div className="text-[10px] text-red-400 font-mono pt-2 border-t border-red-500/20">
            ⚠️ Severe ICU threat & unmitigated road gridlock
          </div>
        </div>

        {/* Pathway B: With JalRakshak AI (Automated 5-Agent Response) */}
        <div className="rounded-xl bg-cyan-950/20 p-4 border border-cyan-500/40 flex flex-col justify-between space-y-3 ring-1 ring-cyan-500/30">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
              <span className="text-xs font-black uppercase text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                With JalRakshak AI (Pump P-04 Dispatched)
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Response in &lt; 60s</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="rounded-lg bg-slate-950/70 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Water Depth</span>
                <strong className="text-emerald-400 text-sm">{current.with_ai.depth_cm} cm</strong>
              </div>
              <div className="rounded-lg bg-slate-950/70 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Inundation Area</span>
                <strong className="text-cyan-300 text-sm">{current.with_ai.inundation_sqkm} km²</strong>
              </div>
              <div className="rounded-lg bg-slate-950/70 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Traffic Stalls</span>
                <strong className="text-emerald-400 text-sm">0 (Diverted to BKC)</strong>
              </div>
              <div className="rounded-lg bg-slate-950/70 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Controlled Damage</span>
                <strong className="text-emerald-400 text-sm">₹{current.with_ai.economic_loss_lakhs} Lakhs</strong>
              </div>
            </div>

            {/* Hospital Protection Status */}
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs">
              <span className="text-[10px] font-bold text-emerald-400 block mb-0.5">Bhabha Municipal Hospital Status:</span>
              <p className="font-semibold text-emerald-200 text-[11px]">{current.with_ai.hospital_status}</p>
            </div>
          </div>

          <div className="text-[10px] text-cyan-300 font-mono pt-2 border-t border-cyan-500/30 flex items-center justify-between">
            <span>Active: {current.with_ai.action_active}</span>
            <span className="text-emerald-400 font-bold">91% Damage Avoided</span>
          </div>
        </div>

      </div>

    </div>
  );
}
