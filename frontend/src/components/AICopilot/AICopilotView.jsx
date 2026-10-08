import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  HelpCircle, 
  Truck, 
  ArrowRight,
  Clock,
  Layers,
  ThumbsUp
} from 'lucide-react';

export default function AICopilotView({ onApproveAction }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: (
        <div>
          <p className="font-bold text-slate-900 mb-1 text-sm">
            Good afternoon, Municipal Disaster Operations Commander.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            I am the <strong>JalRakshak AI Emergency Copilot</strong>. I analyze real-time environmental telemetry, municipal asset inventories, and statutory standard operating procedures (NDMA, NHAP, Jal Jeevan Mission) to recommend prioritized tactical actions.
          </p>
        </div>
      ),
      structuredData: null
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = [
    "What should we do about the current flood situation in Ward 17?",
    "Are there cooling shelters available near Dadar?",
    "Show available dewatering pumps and ETAs",
    "Why was Ward 17 elevated to CRITICAL severity?"
  ];

  const handleSend = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.situation_summary,
          structuredData: data
        }
      ]);
    } catch (err) {
      console.error('Copilot request failed:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Encountered an issue communicating with the multi-agent decision engine. Please verify backend connection."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Copilot Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900">AI Emergency Copilot</h3>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                Strands RAG Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Grounded in Municipal Standard Operating Procedures & Live Incident Feeds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[11px]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Telemetry Synced
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-2xl p-4 text-xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-1.5 mb-2 font-bold opacity-90 text-[11px]">
                {msg.role === 'user' ? (
                  <span>Incident Commander (You)</span>
                ) : (
                  <span className="flex items-center gap-1 text-blue-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    JalRakshak AI Copilot
                  </span>
                )}
              </div>

              {/* Text Content */}
              <div className="leading-relaxed text-slate-800 font-medium">
                {msg.content}
              </div>

              {/* Structured Emergency Response Card */}
              {msg.structuredData && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                  
                  {/* Key Metrics Pill Grid */}
                  {msg.structuredData.key_metrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      {Object.entries(msg.structuredData.key_metrics).map(([k, v], i) => (
                        <div key={i} className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">{k}</span>
                          <strong className="text-slate-900 text-xs font-black">{v}</strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* RECOMMENDED ACTIONS */}
                  {msg.structuredData.recommended_actions?.length > 0 && (
                    <div className="rounded-xl bg-blue-50/50 p-3.5 border border-blue-200">
                      <h5 className="font-extrabold text-blue-800 uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                        RECOMMENDED TACTICAL ACTIONS
                      </h5>
                      <div className="space-y-2">
                        {msg.structuredData.recommended_actions.map((act, aIdx) => (
                          <div key={aIdx} className="rounded-lg bg-white p-3 border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
                            <div className="space-y-0.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                  {act.priority}
                                </span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase">{act.authority}</span>
                                {act.eta && <span className="text-[10px] text-slate-500">ETA: {act.eta}</span>}
                              </div>
                              <p className="font-bold text-slate-900 text-xs">{act.action}</p>
                            </div>
                            <button
                              onClick={() => onApproveAction && onApproveAction(act.resource_id || 'RES-GENERIC')}
                              className="rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-[11px] font-bold text-white shrink-0 active:scale-95 transition-all shadow-xs"
                            >
                              Dispatch
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WHY CRITICAL / EXPLAINABILITY */}
                  {msg.structuredData.why_critical?.length > 0 && (
                    <div className="rounded-xl bg-amber-50/60 p-3.5 border border-amber-200">
                      <h5 className="font-extrabold text-amber-800 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                        <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
                        WHY THESE ACTIONS? (AI REASONING)
                      </h5>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700 font-medium">
                        {msg.structuredData.why_critical.map((reason, rIdx) => (
                          <li key={rIdx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* STATUTORY SOP CITATION */}
                  {msg.structuredData.statutory_sop_citation && (
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-0.5">
                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                        <span>SOP RAG CITATION: {msg.structuredData.statutory_sop_citation.reference} ({msg.structuredData.statutory_sop_citation.sop_id})</span>
                      </div>
                      <p className="text-slate-600 italic">
                        {msg.structuredData.statutory_sop_citation.reasoning}
                      </p>
                    </div>
                  )}

                  {/* SUGGESTED FOLLOW-UPS */}
                  {msg.structuredData.suggested_followups?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.structuredData.suggested_followups.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSend(prompt)}
                          className="rounded-lg bg-white hover:bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 border border-slate-200 transition-all flex items-center gap-1 active:scale-95 shadow-xs"
                        >
                          <span>{prompt}</span>
                          <ArrowRight className="h-2.5 w-2.5" />
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-none bg-white p-4 border border-slate-200 text-xs flex items-center gap-2 text-blue-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>
              <span className="font-semibold">Consulting AWS Strands Agents & Statutory SOP RAG Database...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts Bar */}
      <div className="px-4 py-2.5 border-t border-slate-200 bg-white flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
          Suggested:
        </span>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="whitespace-nowrap rounded-lg bg-slate-50 hover:bg-slate-100 px-2.5 py-1 text-[11px] text-slate-700 font-medium border border-slate-200 transition-all active:scale-95"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Query Input Box */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask Copilot: e.g. What should we do about the flood in Ward 17?"
          className="flex-1 rounded-xl bg-slate-50 px-4 py-2.5 text-xs text-slate-900 border border-slate-300 focus:border-blue-600 focus:outline-none placeholder:text-slate-400 font-medium"
        />
        <button
          type="submit"
          disabled={isLoading || !inputQuery.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

    </div>
  );
}
