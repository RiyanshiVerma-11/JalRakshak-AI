import React from 'react';
import { AlertCircle, AlertTriangle, Users, Truck, Radio, ShieldCheck } from 'lucide-react';

export default function StatRibbon({ incidents, resources, snsSubscribers = null }) {
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL').length;
  const highCount = incidents.filter(i => i.severity === 'HIGH').length;
  const moderateCount = incidents.filter(i => i.severity === 'MODERATE' || i.severity === 'LOW').length;

  const totalExposedPop = incidents.reduce((sum, inc) => {
    return sum + (inc.impact_assessment?.exposed_population || 0);
  }, 0);

  const deployedResources = resources.filter(r => r.status === 'DISPATCHED').length;
  const availableResources = resources.filter(r => r.status === 'AVAILABLE').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-4">
      
      {/* Critical Card */}
      <div className="rounded-xl bg-white p-3 border-l-4 border-l-rose-500 border border-slate-200 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Critical</span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-black text-rose-700">{criticalCount}</span>
          <span className="text-[11px] text-rose-700 font-semibold">Immediate</span>
        </div>
      </div>

      {/* High Risk Card */}
      <div className="rounded-xl bg-white p-3 border-l-4 border-l-amber-500 border border-slate-200 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">High Risk</span>
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-700">{highCount}</span>
          <span className="text-[11px] text-amber-700 font-semibold">Elevated</span>
        </div>
      </div>

      {/* Moderate Card */}
      <div className="rounded-xl bg-white p-3 border-l-4 border-l-yellow-500 border border-slate-200 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Moderate</span>
          <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-black text-yellow-700">{moderateCount}</span>
          <span className="text-[11px] text-yellow-700 font-semibold">Monitoring</span>
        </div>
      </div>

      {/* Population at Risk */}
      <div className="rounded-xl bg-white p-3 border-l-4 border-l-blue-600 border border-slate-200 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Pop in Zone</span>
          <Users className="h-3.5 w-3.5 text-blue-600" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-black text-blue-700">
            {totalExposedPop.toLocaleString()}
          </span>
          <span className="text-[11px] text-blue-700 font-semibold">Citizens</span>
        </div>
      </div>

      {/* Assets Deployed */}
      <div className="rounded-xl bg-white p-3 border-l-4 border-l-emerald-600 border border-slate-200 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Tactical Assets</span>
          <Truck className="h-3.5 w-3.5 text-emerald-600" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-700">{deployedResources}</span>
          <span className="text-[11px] text-emerald-700 font-semibold">/ {resources.length} Dispatched</span>
        </div>
      </div>

      {/* Broadcasts Sent */}
      <div className="rounded-xl bg-white p-3 border-l-4 border-l-purple-600 border border-slate-200 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
            {snsSubscribers != null ? "SNS Subscribers" : "SNS Topic"}
          </span>
          <Radio className="h-3.5 w-3.5 text-purple-600" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-black text-purple-700">
            {snsSubscribers != null ? Number(snsSubscribers).toLocaleString() : "—"}
          </span>
          <span className={`text-[11px] font-semibold ${snsSubscribers != null ? "text-purple-700" : "text-slate-500"}`}>
            {snsSubscribers != null ? "Active" : "SNS Topic (not configured)"}
          </span>
        </div>
      </div>

    </div>
  );
}
