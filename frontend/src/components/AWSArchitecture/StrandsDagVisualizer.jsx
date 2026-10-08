import React, { useState } from 'react';
import { 
  GitCommit, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Layers, 
  ArrowRight, 
  FileCode, 
  ShieldCheck, 
  Play, 
  Sparkles,
  Search,
  Users,
  Truck,
  Radio,
  FileText
} from 'lucide-react';

export default function StrandsDagVisualizer() {
  const [selectedAgentId, setSelectedAgentId] = useState('risk');
  const [isSimulatingDAG, setIsSimulatingDAG] = useState(false);
  const [activeStep, setActiveStep] = useState(null);

  const agents = [
    {
      id: 'risk',
      step: 1,
      name: 'Risk Detection Agent',
      role: 'Sensor Telemetry & Hydrological Thresholds',
      model: 'anthropic.claude-3-5-sonnet',
      arn: 'arn:aws:bedrock:ap-south-1:agent/risk-detection-01',
      tools: ['evaluate_rainfall_capacity_ratio', 'scada_pressure_delta_calc', 'citizen_corroboration_index'],
      latency_ms: 115,
      tokens: { prompt: 450, completion: 180, cost_usd: 0.0028 },
      status: 'ONLINE',
      color: '#0284c7',
      icon: <Zap className="h-4 w-4" />,
      prompt_summary: 'Analyze rainfall intensity (118 mm/hr) against 45 mm/hr drainage capacity. Score composite risk (0.94) and explain dominant factor.'
    },
    {
      id: 'impact',
      step: 2,
      name: 'Impact Assessment Agent',
      role: 'GIS Demographics & Critical Lifelines',
      model: 'anthropic.claude-3-5-sonnet',
      arn: 'arn:aws:bedrock:ap-south-1:agent/impact-assessment-02',
      tools: ['gis_spatial_intersection', 'hospital_bed_capacity_lookup', 'school_evacuation_checker'],
      latency_ms: 130,
      tokens: { prompt: 580, completion: 210, cost_usd: 0.0034 },
      status: 'ONLINE',
      color: '#2563eb',
      icon: <Users className="h-4 w-4" />,
      prompt_summary: 'Intersect Ward 17 GIS boundary with municipal registry. Identify 8,420 exposed citizens, Bhabha Hospital (420 beds), and 3 schools.'
    },
    {
      id: 'resource',
      step: 3,
      name: 'Resource & Response Agent',
      role: 'Inventory Proximity & ETA Optimization',
      model: 'anthropic.claude-3-5-sonnet',
      arn: 'arn:aws:bedrock:ap-south-1:agent/resource-response-03',
      tools: ['dynamodb_resource_scan', 'osrm_eta_routing_matrix', 'crew_qualification_matcher'],
      latency_ms: 88,
      tokens: { prompt: 390, completion: 140, cost_usd: 0.0022 },
      status: 'ONLINE',
      color: '#059669',
      icon: <Truck className="h-4 w-4" />,
      prompt_summary: 'Query available pumps in neighboring depots. Match Dewatering Pump P-04 (Dadar Depot, 18 min ETA) and reserve in DynamoDB.'
    },
    {
      id: 'comm',
      step: 4,
      name: 'Multilingual Advisory Agent',
      role: 'Citizen Early Warning & Civil Defense',
      model: 'anthropic.claude-3-5-sonnet',
      arn: 'arn:aws:bedrock:ap-south-1:agent/communication-04',
      tools: ['synthesize_multilingual_advisory', 'amazon_sns_topic_formatter', 'speech_synthesis_markup'],
      latency_ms: 105,
      tokens: { prompt: 510, completion: 260, cost_usd: 0.0036 },
      status: 'ONLINE',
      color: '#7c3aed',
      icon: <Radio className="h-4 w-4" />,
      prompt_summary: 'Synthesize actionable, non-panicking emergency bulletins in English, Hindi, and Marathi with localized evacuation coordinates.'
    },
    {
      id: 'coord',
      step: 5,
      name: 'Coordinator Commander Agent',
      role: 'Statutory SOP RAG & HITL Contract Formatter',
      model: 'anthropic.claude-3-5-sonnet',
      arn: 'arn:aws:bedrock:ap-south-1:agent/coordinator-05',
      tools: ['query_sop_knowledge_base', 'validate_ndma_compliance', 'format_hitl_decision_contract'],
      latency_ms: 140,
      tokens: { prompt: 720, completion: 310, cost_usd: 0.0048 },
      status: 'ONLINE',
      color: '#d97706',
      icon: <FileText className="h-4 w-4" />,
      prompt_summary: 'Query NDMA Urban Flood 2024 Chapter 4 SOP. Assemble structured 4-step Human-in-the-Loop decision contract ready for officer sign-off.'
    }
  ];

  const currentAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  // Animated DAG Step Simulation
  const handleRunDAGSimulation = async () => {
    if (isSimulatingDAG) return;
    setIsSimulatingDAG(true);

    for (let i = 0; i < agents.length; i++) {
      setActiveStep(agents[i].step);
      setSelectedAgentId(agents[i].id);
      await new Promise(r => setTimeout(r, 900));
    }

    await new Promise(r => setTimeout(r, 600));
    setActiveStep(null);
    setIsSimulatingDAG(false);
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
      
      {/* Title & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900">AWS Strands Agents SDK • Directed Acyclic Graph (DAG)</h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                STATE MACHINE ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Deterministic 5-Agent Collaborative Execution Pipeline • 578ms Total End-to-End Latency
            </p>
          </div>
        </div>

        {/* Live Step Trigger */}
        <button
          onClick={handleRunDAGSimulation}
          disabled={isSimulatingDAG}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm active:scale-95 transition-all"
        >
          <Play className={`h-3.5 w-3.5 ${isSimulatingDAG ? 'animate-spin' : ''}`} />
          <span>{isSimulatingDAG ? 'Executing DAG Nodes...' : 'Simulate Live DAG Step Execution'}</span>
        </button>
      </div>

      {/* Visual DAG Flow Diagram (SVG Node Graph) */}
      <div className="rounded-xl bg-slate-50 p-6 border border-slate-200 overflow-x-auto">
        <div className="min-w-[720px] flex items-center justify-between relative py-4">
          
          {/* Connecting Line along all nodes */}
          <div className="absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2 bg-slate-200 z-0">
            {/* Animated glowing particle */}
            <div className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 w-full animate-pulse opacity-75"></div>
          </div>

          {/* 5 Agent Nodes */}
          {agents.map((agent) => {
            const isSelected = selectedAgentId === agent.id;
            const isProcessing = activeStep === agent.step;

            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
              >
                {/* Node Circle */}
                <div 
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold transition-all shadow-sm ${
                    isSelected
                      ? 'scale-110 ring-4 ring-blue-400 bg-white border-2 border-blue-600'
                      : 'bg-white border border-slate-200 hover:border-slate-400 hover:scale-105'
                  } ${isProcessing ? 'animate-bounce ring-4 ring-amber-400' : ''}`}
                >
                  <div style={{ color: agent.color }}>
                    {agent.icon}
                  </div>
                </div>

                {/* Step badge */}
                <span className="mt-2 text-[10px] font-mono font-bold text-slate-500 uppercase">
                  Step 0{agent.step}
                </span>

                {/* Node Title */}
                <span className={`text-[11px] font-bold text-center max-w-[110px] mt-0.5 leading-tight ${
                  isSelected ? 'text-blue-700' : 'text-slate-800'
                }`}>
                  {agent.name.replace(' Agent', '')}
                </span>

                {/* Latency Pill */}
                <span className="mt-1 rounded bg-white px-2 py-0.5 text-[9px] font-mono text-slate-600 border border-slate-200 shadow-xs">
                  {agent.latency_ms} ms
                </span>
              </div>
            );
          })}

        </div>
      </div>

      {/* Selected Agent Deep-Dive Inspector */}
      <div className="rounded-xl bg-slate-50 p-5 border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
        
        {/* Left: Metadata & Prompt (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg text-white font-bold text-[11px]" style={{ backgroundColor: currentAgent.color }}>
                0{currentAgent.step}
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">
                {currentAgent.name}
              </h4>
            </div>
            <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 font-bold">
              {currentAgent.arn}
            </span>
          </div>

          <div className="rounded-xl bg-white p-3.5 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Agent Operational Objective</span>
            <p className="text-slate-800 leading-relaxed font-mono text-[11px]">
              {currentAgent.prompt_summary}
            </p>
          </div>

          {/* Registered Tools */}
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">Registered Tool Calling Bindings</span>
            <div className="flex flex-wrap gap-1.5">
              {currentAgent.tools.map((tool, idx) => (
                <span key={idx} className="rounded-md bg-white px-2.5 py-1 text-[11px] font-mono text-blue-700 border border-slate-200 flex items-center gap-1 font-semibold shadow-xs">
                  <FileCode className="h-3.5 w-3.5 text-blue-600" />
                  {tool}()
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: CloudWatch Metrics & Token Economics (5 cols) */}
        <div className="md:col-span-5 bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <Coins className="h-3.5 w-3.5 text-amber-600" />
            Amazon Bedrock CloudWatch Metrics
          </h5>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Foundation Model:</span>
              <strong className="text-slate-900 font-mono">{currentAgent.model}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Execution Latency:</span>
              <strong className="text-blue-700 font-mono font-bold">{currentAgent.latency_ms} ms</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Token Consumption:</span>
              <strong className="text-slate-800 font-mono">{currentAgent.tokens.prompt} in / {currentAgent.tokens.completion} out</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Estimated Cost:</span>
              <strong className="text-emerald-700 font-mono font-bold">${currentAgent.tokens.cost_usd.toFixed(4)}</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">State Transition:</span>
              <strong className="text-purple-700 font-mono font-bold">DETERMINISTIC_PASS</strong>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
