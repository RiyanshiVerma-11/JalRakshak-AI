import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Cpu, 
  Truck, 
  Radio, 
  Info,
  MapPin,
  ThumbsUp
} from 'lucide-react';

export default function CommandCenterExplainerBanner({ 
  selectedIncident, 
  onApproveAll, 
  isApproving 
}) {
  const [showHelpModal, setShowHelpModal] = useState(false);

  const allApproved = (selectedIncident?.recommended_actions || []).every(a => a.status === 'APPROVED');

  return (
    <div className="space-y-3">
      
      {/* 3-Step Mental Model Ribbon: Clean Light Theme */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Left: 3 Simple Steps */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
            
            {/* Step 1 */}
            <div className="flex items-center gap-2.5 rounded-xl bg-rose-50/80 px-3.5 py-2 border border-rose-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white font-black text-[10px]">
                1
              </span>
              <div>
                <span className="font-black text-rose-900 block text-[11px]">Hazard Detected</span>
                <span className="text-[10px] text-rose-700 font-medium">IoT Sensors + Citizen Photos</span>
              </div>
            </div>

            <ArrowRight className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />

            {/* Step 2 */}
            <div className="flex items-center gap-2.5 rounded-xl bg-blue-50/80 px-3.5 py-2 border border-blue-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white font-black text-[10px]">
                2
              </span>
              <div>
                <span className="font-black text-blue-900 block text-[11px]">AI Plans Solution</span>
                <span className="text-[10px] text-blue-700 font-medium">Matches nearest pump & SOP</span>
              </div>
            </div>

            <ArrowRight className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />

            {/* Step 3 */}
            <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50/80 px-3.5 py-2 border border-emerald-200 shadow-2xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-black text-[10px]">
                3
              </span>
              <div>
                <span className="font-black text-emerald-900 block text-[11px]">You (Officer) Authorize</span>
                <span className="text-[10px] text-emerald-700 font-medium">1-Click Dispatch & Siren</span>
              </div>
            </div>

          </div>

          {/* Right: "Explain This Screen" Guide Button */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <button
              onClick={() => setShowHelpModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-200 transition-all active:scale-95 shadow-2xs"
            >
              <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
              <span>How this screen works (गाइड)</span>
            </button>
          </div>

        </div>

        {/* Selected Incident Fast-Action Strip */}
        {selectedIncident && (
          <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50/70 p-3 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 border border-rose-200 text-rose-700 shrink-0">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold">Currently Selected:</span>
                  <strong className="text-slate-900 font-black text-sm">{selectedIncident.ward_name}</strong>
                  <span className={`px-2 py-0.2 rounded-full font-black text-[10px] border ${
                    selectedIncident.severity === 'CRITICAL' 
                      ? 'bg-rose-100 text-rose-800 border-rose-300' 
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {selectedIncident.severity} RISK
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {selectedIncident.title} • <strong className="text-slate-700 font-bold">{selectedIncident.impact_assessment?.exposed_population?.toLocaleString()}</strong> citizens exposed
                </p>
              </div>
            </div>

            {/* Direct Approve All Action */}
            <div>
              {allApproved ? (
                <span className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>ACTION PLAN AUTHORIZED & DISPATCHED</span>
                </span>
              ) : (
                <button
                  onClick={onApproveAll}
                  disabled={isApproving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-4 py-2 text-xs font-black text-white shadow-md active:scale-95 transition-all"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{isApproving ? 'Authorizing...' : 'APPROVE & DISPATCH ALL (1-CLICK)'}</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* "HOW THIS SCREEN WORKS" EXPLANATION MODAL (Simple, Crystal Clear Hinglish/English) */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 relative space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Command Center Guide — How Everything Works
                  </h3>
                  <p className="text-xs text-slate-500">
                    Yeh screen kis cheez ke liye hai aur yahan kya dekhna hai
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* The 4 Main Elements Explained In Simple Language */}
            <div className="space-y-3 text-xs">
              
              {/* Item 1 */}
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-100 text-rose-700 font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs mb-0.5">
                    Live City Map (Left Side Pe Bada Map)
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Map pe Mumbai ke live hotspots dikh rahe hain (red circle = flood zone, orange = heatwave).
                    Ek <strong className="text-blue-700 font-bold">moving truck marker</strong> dikh raha hai — yeh dewatering pump hai jo live road route (BKC Elevated Corridor) se flood outfall D-17 ki taraf dispatch ho raha hai.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs mb-0.5">
                    AI Priority Queue (Right Side Ki List)
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Shehar ke saare incidents yahan urgency ke hisaab se sorted hain.
                    Sabse upar <strong>#1 Ward 17 (Kurla)</strong> hai kyunki 118mm rain se Bhabha Hospital aur 8,420 log risk pe hain. Kisi bhi card pe click karke use inspect kar sakte ho.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs mb-0.5">
                    Action Plan Panel (Neeche Bada Decision Board)
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Yeh sabse important section hai! Yahan AI bata raha hai ki <strong className="text-emerald-700 font-bold">kya action lena hai</strong>:
                    Pump D-17 pe bhejo, LBS Marg traffic divert karo, aur hospital alert karo.
                    Aapko bas <strong className="text-emerald-700 font-bold">"APPROVE & DISPATCH ALL"</strong> dabana hai!
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100 text-purple-700 font-bold shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs mb-0.5">
                    Municipal Siren & Voice Broadcast Button
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Action plan ke upar purple button hai: <strong>"TEST MUNICIPAL SIREN & VOICE BROADCAST"</strong>.
                    Ise dabate hi browser se authentic do-tone disaster siren bajta hai aur Hindi aur English me voice alert sunai deta hai!
                  </p>
                </div>
              </div>

            </div>

            {/* Close Button */}
            <div className="pt-2 text-right">
              <button
                onClick={() => setShowHelpModal(false)}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2 text-xs font-black text-white shadow-sm transition-all"
              >
                Samajh Aa Gaya (Got it, Close)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
