import React, { useState, useEffect } from 'react';
import StrandsDagVisualizer from './StrandsDagVisualizer';
import { 
  Cloud, 
  Cpu, 
  Database, 
  Radio, 
  Layers, 
  FileCode, 
  Activity, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight,
  Server,
  Zap,
  Terminal,
  RefreshCw
} from 'lucide-react';

export default function AWSArchitectureView() {
  const [awsMetrics, setAwsMetrics] = useState(null);
  const [selectedService, setSelectedService] = useState('strands');
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/aws/metrics');
      const data = await res.json();
      setAwsMetrics(data);
    } catch (err) {
      console.error('Failed to fetch AWS metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 8000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      id: 'strands',
      name: 'AWS Strands Agents SDK',
      category: 'Agentic Orchestration',
      badge: 'Core Hero Engine',
      description: 'Coordinates 5 specialized autonomous agents (Risk, Impact, Resource, Communication, Coordinator) into a deterministic decision graph.',
      roleInApp: 'Evaluates real-time sensor breaches, cross-references municipal SOP knowledge base, and synthesizes prioritized action plan.',
      specs: 'Amazon Bedrock Claude 3.5 Sonnet + Strands Graph State Machine'
    },
    {
      id: 'eventbridge',
      name: 'Amazon EventBridge',
      category: 'Event-Driven Bus',
      badge: 'Reactive Trigger',
      description: 'Captures IoT rain gauge spikes, SCADA mainline pressure drops, and citizen PWA submissions to trigger Strands agents without polling.',
      roleInApp: 'Decoupled asynchronous event routing from field telemetry to the emergency orchestration graph.',
      specs: 'EventBus: jalrakshak-emergency-eventbus'
    },
    {
      id: 'lambda',
      name: 'AWS Lambda',
      category: 'Serverless Compute',
      badge: 'Real-time Ingest',
      description: 'Executes lightweight event ingestion, payload validation, and Rekognition multimodal vision inference on citizen photo evidence.',
      roleInApp: 'Serverless compute layer scaling instantly during peak monsoon cloudburst events.',
      specs: 'Python 3.11 Runtime | ARM64 Graviton3'
    },
    {
      id: 'dynamodb',
      name: 'Amazon DynamoDB',
      category: 'NoSQL Database',
      badge: 'Single-Digit Latency',
      description: 'Stores real-time municipal state: active incidents, resource location vectors, citizen tickets, and human-in-the-loop audit logs.',
      roleInApp: 'Fast key-value lookups with Point-in-Time Recovery (PITR) for disaster resilience.',
      specs: 'Tables: IncidentsTable, ResourcesTable, AuditLogTable'
    },
    {
      id: 's3',
      name: 'Amazon S3',
      category: 'Object Storage',
      badge: 'Asset Lake',
      description: 'Stores high-resolution citizen incident photos, GIS ward polygon GeoJSON, and historical hydrological telemetry archives.',
      roleInApp: 'Durable media storage with presigned upload URLs generated on-demand for citizens.',
      specs: 'Bucket: jalrakshak-evidence-ap-south-1'
    },
    {
      id: 'sns',
      name: 'Amazon SNS',
      category: 'Notification Service',
      badge: 'Multilingual Broadcast',
      description: 'Dispatches critical geo-targeted SMS, Civil Defense alerts, and automated siren activations in English, Hindi, and Marathi.',
      roleInApp: 'Publishes authorized emergency advisories instantly across telecom operator gateways.',
      specs: 'Topic: JalRakshak-Alerts-Multilingual | Region: ap-south-1'
    },
    {
      id: 'cognito',
      name: 'Amazon Cognito & AWS IAM',
      category: 'Identity & PoLP Governance',
      badge: 'Statutory RBAC & ICS',
      description: 'Enforces Principle of Least Privilege (PoLP) and Indian Disaster Management Act 2005 (ICS) hierarchy across 4 distinct personas.',
      roleInApp: 'Secures high-impact statutory human-in-the-loop signoff, separates Commander from Field Responders, and isolates public access.',
      specs: 'AWS Cedar Engine (cedarpy) | Statutory Least-Privilege RBAC'
    }
  ];

  const currentService = services.find(s => s.id === selectedService) || services[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Top Banner */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md text-white">
              <Cloud className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">AWS Cloud Architecture & Strands Orchestration</h2>
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                  ap-south-1 (Mumbai)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Enterprise-grade event-driven emergency response running on AWS Strands Agents SDK & Serverless Cloud
              </p>
            </div>
          </div>

          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs active:scale-95 transition-all self-start md:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>Refresh CloudWatch</span>
          </button>
        </div>

        {/* Real-time Cloud Metrics Ribbon */}
        {awsMetrics?.services && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Strands Agents</span>
              <strong className="text-blue-700 text-xs flex items-center gap-1.5 mt-0.5 font-black">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                5/5 Online
              </strong>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">EventBridge</span>
              <strong className="text-emerald-700 text-xs mt-0.5 block font-black">
                {awsMetrics.services.Amazon_EventBridge?.events_today ?? 'Active stream'}
              </strong>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">DynamoDB p99</span>
              <strong className="text-amber-700 text-xs mt-0.5 block font-black">
                {awsMetrics.services.Amazon_DynamoDB?.p99_latency_ms ? `${awsMetrics.services.Amazon_DynamoDB.p99_latency_ms} ms` : 'Low-Latency'}
              </strong>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">S3 Media Lake</span>
              <strong className="text-purple-700 text-xs mt-0.5 block font-black">
                {awsMetrics.services.Amazon_S3?.objects_stored || 284} evidence files
              </strong>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">SNS Delivery</span>
              <strong className="text-blue-700 text-xs mt-0.5 block font-black">
                {awsMetrics.services.Amazon_SNS?.delivery_rate_pct || 99.8}% success
              </strong>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Lambda Ingest</span>
              <strong className="text-slate-800 text-xs mt-0.5 block font-black">
                {awsMetrics.services.AWS_Lambda?.avg_duration_ms || 128} ms duration
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Architecture Flow Diagram */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-600" />
          Data → Decision → Action: End-to-End Pipeline
        </h3>

        {/* Visual Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          
          {/* Step 1 */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider block mb-1">01 • Ingestion</span>
              <h4 className="font-extrabold text-slate-900 mb-1">Telemetry & Citizen Reports</h4>
              <p className="text-[11px] text-slate-600">
                Weather stations (118mm/hr), SCADA pressure drops, and photo uploads from Citizen PWA.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
              <span>S3 / Rekognition</span>
              <ArrowRight className="h-3 w-3 text-blue-600" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block mb-1">02 • Event Bus</span>
              <h4 className="font-extrabold text-slate-900 mb-1">Amazon EventBridge</h4>
              <p className="text-[11px] text-slate-600">
                Threshold filters evaluate sensor deltas (&gt;70mm/hr) and route structured events without polling.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
              <span>Rule Patterns</span>
              <ArrowRight className="h-3 w-3 text-amber-600" />
            </div>
          </div>

          {/* Step 3 (The Core Hero) */}
          <div className="rounded-xl bg-blue-50/80 p-4 border border-blue-300 flex flex-col justify-between shadow-xs ring-1 ring-blue-300/40">
            <div>
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider block mb-1">03 • Hero Engine</span>
              <h4 className="font-extrabold text-slate-900 mb-1">AWS Strands Agents</h4>
              <p className="text-[11px] text-slate-700">
                Risk Detection → Impact Assessment → Resource Matching → Multilingual Advisory → SOP RAG Coordinator.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-blue-200 flex items-center justify-between text-[10px] text-blue-700 font-bold">
              <span>5-Agent DAG</span>
              <ArrowRight className="h-3 w-3 text-blue-600" />
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider block mb-1">04 • Governance</span>
              <h4 className="font-extrabold text-slate-900 mb-1">Human-in-the-Loop</h4>
              <p className="text-[11px] text-slate-600">
                Municipal Incident Commander reviews Explainability scorecard, modifies directives, and signs off.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
              <span>Audit Trail</span>
              <ArrowRight className="h-3 w-3 text-purple-600" />
            </div>
          </div>

          {/* Step 5 */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block mb-1">05 • Execution</span>
              <h4 className="font-extrabold text-slate-900 mb-1">Asset Dispatch & SNS</h4>
              <p className="text-[11px] text-slate-600">
                Pumps deployed (P-04 to Outfall D-17), roads closed, and SMS alerts dispatched in Hindi & English.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-emerald-700 font-bold">
              <span>Amazon SNS</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </div>
          </div>

        </div>
      </div>

      {/* Hero AWS Strands Agents SDK Interactive DAG */}
      <StrandsDagVisualizer />

      {/* Deep-Dive Service Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Service Selectors (4 cols) */}
        <div className="md:col-span-4 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block px-1">
            AWS Cloud Building Blocks
          </span>
          {services.map((srv) => (
            <button
              key={srv.id}
              onClick={() => setSelectedService(srv.id)}
              className={`w-full rounded-xl p-3.5 text-left transition-all border flex items-center justify-between ${
                selectedService === srv.id
                  ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs ring-1 ring-blue-300'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div>
                <strong className="block text-xs font-bold text-slate-900">{srv.name}</strong>
                <span className="text-[10px] text-slate-500">{srv.category}</span>
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-slate-200">
                {srv.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Service Deep-Dive Card (8 cols) */}
        <div className="md:col-span-8 rounded-2xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-base font-black text-slate-900">{currentService.name}</h4>
                <span className="text-xs text-blue-700 font-semibold">{currentService.category}</span>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                {currentService.badge}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block mb-1">Architectural Purpose:</span>
                <p className="text-slate-700 leading-relaxed font-medium">{currentService.description}</p>
              </div>

              <div>
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block mb-1">Role in JalRakshak AI:</span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {currentService.roleInApp}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block mb-1">Provisioning Target:</span>
                <p className="text-blue-700 font-mono text-[11px] font-semibold">{currentService.specs}</p>
              </div>
            </div>
          </div>

          {/* EventBus Live Event Stream */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2">
              <Terminal className="h-3.5 w-3.5 text-blue-600" />
              Live Amazon EventBridge Event Bus Stream
            </span>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-200 max-h-36 overflow-y-auto space-y-1">
              {awsMetrics?.recent_events?.length > 0 ? (
                awsMetrics.recent_events.map((evt, eIdx) => (
                  <div key={eIdx} className="flex items-start gap-2 border-b border-slate-800/80 pb-1">
                    <span className="text-cyan-400 shrink-0">[{evt.timestamp?.split('T')[1]?.slice(0, 8)}]</span>
                    <span className="text-amber-300 shrink-0 font-bold">{evt.detail_type}</span>
                    <span className="text-slate-300 truncate">{JSON.stringify(evt.detail)}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 italic">No events on bus yet. Trigger a live scenario above!</div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
