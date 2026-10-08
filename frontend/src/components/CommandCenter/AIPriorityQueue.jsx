import React from 'react';
import { 
  AlertCircle, 
  Flame, 
  CloudRain, 
  Droplet, 
  Wrench, 
  ChevronRight, 
  ShieldCheck, 
  Users, 
  Clock, 
  Sparkles 
} from 'lucide-react';

export default function AIPriorityQueue({ incidents, selectedIncident, onSelectIncident }) {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'flood':
        return <CloudRain className="h-4 w-4 text-blue-600" />;
      case 'heatwave':
        return <Flame className="h-4 w-4 text-amber-600" />;
      case 'leak':
        return <Wrench className="h-4 w-4 text-emerald-600" />;
      default:
        return <Droplet className="h-4 w-4 text-purple-600" />;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-black tracking-wide text-rose-700 border border-rose-200">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-black tracking-wide text-amber-800 border border-amber-200">
            HIGH
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-yellow-50 px-2.5 py-0.5 text-[10px] font-black tracking-wide text-yellow-800 border border-yellow-200">
            MODERATE
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white border border-slate-200 p-4 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
            <span className="font-black text-xs">2</span>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>ACTIVE INCIDENTS QUEUE</span>
              <span className="text-[10px] text-blue-600 font-bold">(Click to select)</span>
            </h3>
            <p className="text-[10px] text-slate-500">
              Ranked by urgency • Click any card to inspect action plan
            </p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 border border-slate-200">
          {incidents.length} Emergencies
        </span>
      </div>

      {/* Queue Items */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
        {incidents.map((incident, index) => {
          const isSelected = selectedIncident?.id === incident.id;
          const isApproved = incident.status === 'IN_PROGRESS';

          return (
            <div
              key={incident.id}
              onClick={() => onSelectIncident(incident)}
              className={`group relative rounded-xl p-3.5 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-blue-50/60 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50/80 hover:border-slate-300'
              }`}
            >
              {/* Rank and Category */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-[11px] font-black text-slate-700 border border-slate-200">
                    #{index + 1}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                    {getCategoryIcon(incident.category)}
                    <span>{incident.ward_name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isApproved && (
                    <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="h-3 w-3" />
                      DISPATCHED
                    </span>
                  )}
                  {getSeverityBadge(incident.severity)}
                </div>
              </div>

              {/* Title */}
              <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1 mb-2">
                {incident.title}
              </h4>

              {/* Stats & Key Factor */}
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2 text-[11px] border border-slate-200 mb-2">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Users className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>Exposed: <strong className="text-slate-900 font-extrabold">{incident.impact_assessment?.exposed_population?.toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span>Confidence: <strong className="text-emerald-700 font-extrabold">{Math.round((incident.explainability?.confidence || 0.9) * 100)}%</strong></span>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-slate-500 font-medium">
                  ⚡ <strong className="text-blue-700 font-bold">{incident.recommended_actions?.length || 0}</strong> actions planned
                </span>
                <span className="flex items-center text-blue-600 font-extrabold group-hover:translate-x-0.5 transition-transform">
                  Inspect & Authorize
                  <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
