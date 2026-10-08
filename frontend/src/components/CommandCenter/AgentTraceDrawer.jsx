import React, { useState } from 'react';
import { 
  Bot, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Users,
  Truck,
  Radio,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Maximize2
} from 'lucide-react';
import StrandsDagVisualizer from '../AWSArchitecture/StrandsDagVisualizer';

export default function AgentTraceDrawer({ agentTrace, totalExecutionMs }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!agentTrace) return null;

  const agents = [
    {
      id: 'risk_agent',
      name: 'Agent 1: Risk Detection',
      role: 'Sensor & Hydrological Telemetry Analyzer',
      icon: <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />,
      color: 'border-rose-200 bg-rose-50/60',
      badgeColor: 'text-rose-700 bg-rose-100 border-rose-200',
      output: `Detected: ${agentTrace.risk_agent?.severity || 'CRITICAL'} | Confidence: ${Math.round((agentTrace.risk_agent?.confidence || 0.94) * 100)}%`
    },
    {
      id: 'impact_agent',
      name: 'Agent 2: Impact Assessment',
      role: 'Critical Infrastructure & Demographics',
      icon: <Users className="h-4 w-4 text-blue-600 shrink-0" />,
      color: 'border-blue-200 bg-blue-50/60',
      badgeColor: 'text-blue-700 bg-blue-100 border-blue-200',
      output: `Exposed: ${agentTrace.impact_agent?.exposed_population?.toLocaleString() || '8,420'} citizens | ${agentTrace.impact_agent?.critical_facilities || 4} facilities`
    },
    {
      id: 'resource_agent',
      name: 'Agent 3: Resource & Response',
      role: 'Tactical Asset & Proximity Matcher',
      icon: <Truck className="h-4 w-4 text-emerald-600 shrink-0" />,
      color: 'border-emerald-200 bg-emerald-50/60',
      badgeColor: 'text-emerald-700 bg-emerald-100 border-emerald-200',
      output: `Matched ${agentTrace.resource_agent?.resources_matched || 3} available emergency assets`
    },
    {
      id: 'communication_agent',
      name: 'Agent 4: Communication',
      role: 'Multilingual Public Alert Synthesizer',
      icon: <Radio className="h-4 w-4 text-purple-600 shrink-0" />,
      color: 'border-purple-200 bg-purple-50/60',
      badgeColor: 'text-purple-700 bg-purple-100 border-purple-200',
      output: 'Generated localized alerts in EN, हिन्दी, and मराठी'
    },
    {
      id: 'coordinator_agent',
      name: 'Agent 5: Coordinator Commander',
      role: 'SOP RAG Retrieval & Decision Graph',
      icon: <FileCheck className="h-4 w-4 text-amber-600 shrink-0" />,
      color: 'border-amber-200 bg-amber-50/60',
      badgeColor: 'text-amber-800 bg-amber-100 border-amber-200',
      output: `Formulated Action Plan cited against ${agentTrace.coordinator_agent?.sop_referenced || 'SOP-FLD-102'}`
    }
  ];

  return (
    <div className="rounded-2xl bg-white p-5 border border-slate-200 mt-4 shadow-sm space-y-4">
      
      {/* Drawer Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-700 shadow-xs">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              AWS Strands Agents: Collaborative Multi-Agent Execution DAG
            </h4>
            <p className="text-[11px] text-slate-500">
              State transitions orchestrated sequentially via AWS Strands Agents graph
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-slate-700 border border-slate-200 font-mono text-[11px]">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            Total Pipeline: <strong className="text-slate-900 font-black">{totalExecutionMs || 532}ms</strong>
          </span>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 transition-all text-xs active:scale-95 shadow-xs"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                <span>Hide DAG Inspector</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Deep-Dive DAG Inspector</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Agents Flow Grid (Solid Opaque Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
        {agents.map((ag, index) => {
          const traceData = agentTrace[ag.id] || {};

          return (
            <div
              key={ag.id}
              className={`rounded-xl p-3.5 border ${ag.color} flex flex-col justify-between relative shadow-xs`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {ag.icon}
                    <span className="text-[11px] font-black text-slate-900">{ag.name.split(':')[0]}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {traceData.execution_ms || 110}ms
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 font-medium mb-2 line-clamp-1">
                  {ag.role}
                </p>

                <div className="text-[11px] font-semibold text-slate-800 bg-white p-2 rounded-lg border border-slate-200 leading-snug shadow-xs">
                  {ag.output}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80 text-[10px] text-slate-500 font-mono flex items-center justify-between font-medium">
                <span>AWS Bedrock</span>
                <span className="text-slate-700 font-bold">Node #{index + 1}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Interactive DAG Visualizer */}
      {isExpanded && (
        <div className="pt-2 animate-fade-in border-t border-slate-100">
          <StrandsDagVisualizer />
        </div>
      )}

    </div>
  );
}
