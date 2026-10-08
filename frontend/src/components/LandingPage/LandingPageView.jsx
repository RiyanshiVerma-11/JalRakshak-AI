import React from 'react';
import { 
  ShieldAlert, 
  CloudRain, 
  Flame, 
  Wrench, 
  Droplet, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Users, 
  Building, 
  Truck, 
  Radio, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Play, 
  AlertTriangle,
  LayoutDashboard,
  Smartphone,
  Bot,
  Zap,
  Globe,
  ExternalLink,
  Award
} from 'lucide-react';

export default function LandingPageView({ onEnterCommandCenter, onSimulate, onOpenCitizenPWA, onOpenJudgeTour }) {
  return (
    <div className="space-y-16 pb-24 max-w-6xl mx-auto">
      
      {/* ======================================================== */}
      {/* 0. DEDICATED LANDING TOP NAVBAR (STICKY ON SCROLL)       */}
      {/* ======================================================== */}
      <nav className="sticky top-2 sm:top-4 z-50 flex items-center justify-between py-3.5 px-3 sm:px-6 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md transition-all">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/30 text-white">
            <ShieldAlert className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                JalRakshak <span className="text-blue-600">AI</span>
              </h2>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                AWS Strands Agents
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Municipal Climate Emergency Decision Platform
            </p>
          </div>
        </div>

        {/* Quick Nav Anchors & Enter Button */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
            <a href="#problem" className="hover:text-blue-600 transition-colors">The Problem</a>
            <a href="#scenarios" className="hover:text-blue-600 transition-colors">4 Scenarios</a>
            <a href="#agents" className="hover:text-blue-600 transition-colors">5 AWS Agents</a>
          </div>

          {/* 3-Min Judge Demo Tour Button in Navbar */}
          <button
            onClick={onOpenJudgeTour}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 px-3 py-2 text-xs font-bold text-indigo-700 border border-indigo-200 shadow-sm active:scale-95 transition-all"
          >
            <Award className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden sm:inline">🎬 3-Min Judge Tour</span>
            <span className="sm:hidden">Tour</span>
          </button>

          {/* MAIN ENTRY BUTTON IN NAVBAR */}
          <button
            onClick={onEnterCommandCenter}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs sm:text-sm font-extrabold text-white shadow-md shadow-blue-600/30 active:scale-95 transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>ENTER MAIN APP</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </nav>

      {/* ======================================================== */}
      {/* 1. HERO SECTION: The Core Pitch                          */}
      {/* ======================================================== */}
      <section className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 p-8 sm:p-16 text-center shadow-lg shadow-slate-100">
        
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-gradient-to-b from-blue-50/70 to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          
          {/* Top Hackathon & Engine Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 border border-blue-200 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              AWS Hackathon 2026 • Track 02 (Heat & Water)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
              <Cpu className="h-3.5 w-3.5 text-slate-600" />
              Powered by AWS Strands Agents SDK
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Turning Real-Time Climate Chaos into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Prioritized Action
            </span>
          </h1>

          {/* The Pitch Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 font-medium leading-relaxed">
            Most climate dashboards only show city commissioners <span className="text-rose-600 font-bold underline decoration-rose-300">what is happening</span>.<br className="hidden sm:inline" />
            <strong className="text-blue-700 font-black"> JalRakshak AI</strong> tells them <span className="text-emerald-700 font-bold underline decoration-emerald-300">what tactical action to authorize next</span>.
          </p>

          {/* ======================================================== */}
          {/* THE BIG HERO BUTTON: DIRECT ENTRY TO MAIN APPLICATION    */}
          {/* ======================================================== */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onEnterCommandCenter}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 px-8 py-4 text-base font-black text-white shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>ENTER MAIN APPLICATION (COMMAND CENTER)</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              onClick={onOpenJudgeTour}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 px-6 py-4 text-sm font-black text-indigo-700 border border-indigo-200 active:scale-95 transition-all"
            >
              <Award className="h-4 w-4 text-amber-500" />
              <span>🎬 3-Min Judge Demo Tour</span>
            </button>

            <button
              onClick={() => onSimulate('flood')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-slate-100 hover:bg-slate-200 px-6 py-4 text-sm font-bold text-slate-700 border border-slate-300 active:scale-95 transition-all"
            >
              <Play className="h-4 w-4 text-blue-600" />
              <span>Simulate 118mm Cloudburst</span>
            </button>
          </div>

          {/* Trust & Compliance Ticker */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Human-in-the-Loop Signoff Layer
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              NDMA SOP Statutory Compliance
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Sub-600ms Multi-Agent Response
            </span>
          </div>

        </div>
      </section>


      {/* ======================================================== */}
      {/* 2. THE PROBLEM WE ARE SOLVING: Before vs After           */}
      {/* ======================================================== */}
      <section id="problem" className="space-y-6 scroll-mt-20">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600">
            The Critical Municipal Gap
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Urban Climate Emergencies Turn into Disasters
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            During heavy rainfall or sudden heat waves, municipal control rooms receive thousands of disjointed alerts, but lack contextual decision intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* THE BROKEN STATUS QUO */}
          <div className="rounded-2xl bg-rose-50/70 border border-rose-200 p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200 flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-rose-600" />
                  What Happens Today (Broken Status Quo)
                </span>
                <span className="text-xs text-rose-600 font-mono font-bold">Passive & Slow</span>
              </div>

              {/* Sample Dumb Alert Card */}
              <div className="rounded-xl bg-white p-4 border border-rose-200 text-left space-y-2 font-mono text-xs shadow-xs">
                <div className="text-amber-700 font-bold">🌧️ Generic Weather App:</div>
                <div className="text-slate-600">"Heavy rainfall alert in Mumbai Suburbs. 80-120mm expected. Take precautions."</div>
              </div>

              {/* Consequence List */}
              <ul className="space-y-2.5 text-xs text-slate-700 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">❌</span>
                  <span><strong>Zero Specificity:</strong> Doesn't say <em>which ward</em>, <em>which road</em>, or <em>which hospital</em> will drown.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">❌</span>
                  <span><strong>Action Paralysis:</strong> Officers must manually phone 6 departments to locate an available dewatering pump.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">❌</span>
                  <span><strong>Unvetted Citizen Panic:</strong> Hundreds of angry social media tweets with zero automated depth verification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">❌</span>
                  <span><strong>Catastrophic Delays:</strong> By the time pumps arrive, ICU generators are flooded and traffic is deadlocked.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-rose-200 text-[11px] text-rose-700 font-semibold">
              Outcome: Flooded hospitals, submerged buses, trapped citizens, preventable loss of life.
            </div>
          </div>

          {/* THE JALRAKSHAK AI SOLUTION */}
          <div className="rounded-2xl bg-blue-50/70 border border-blue-200 p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  The JalRakshak AI Transformation
                </span>
                <span className="text-xs text-blue-700 font-mono font-bold">Action in &lt; 60s</span>
              </div>

              {/* Sample Smart Response Card */}
              <div className="rounded-xl bg-white p-4 border border-blue-200 text-left space-y-1.5 font-mono text-xs shadow-xs">
                <div className="text-rose-700 font-bold flex items-center justify-between">
                  <span>⚠️ WARD 17: CRITICAL FLOOD RISK</span>
                  <span className="text-[10px] text-blue-600 font-normal">Confidence: 94%</span>
                </div>
                <div className="text-slate-600 text-[11px]">Exposed: 8,420 citizens • 1 Hospital • 3 Schools • 2 Arterial Roads</div>
                <div className="text-emerald-700 font-semibold text-[11px]">→ Priority 1: Deploy Pump P-04 to Outfall D-17 (ETA 18m)</div>
                <div className="text-emerald-700 font-semibold text-[11px]">→ Priority 2: Divert LBS Marg traffic via BKC Connector</div>
              </div>

              {/* Benefit List */}
              <ul className="space-y-2.5 text-xs text-slate-700 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold shrink-0">✓</span>
                  <span><strong>Data → Decision → Action:</strong> Turns 118mm/hr rain + citizen photos into a ranked 5-step tactical action plan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold shrink-0">✓</span>
                  <span><strong>Resource Grounded:</strong> Finds the exact closest available 1000 GPM pump (P-04) with real travel ETA.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold shrink-0">✓</span>
                  <span><strong>Explainability ("Why Critical?"):</strong> Shows exactly why: rain exceeds drain capacity by 162% + hospital nearby.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold shrink-0">✓</span>
                  <span><strong>Human-in-the-Loop:</strong> Authorized commissioner clicks [APPROVE] → assets dispatched & SMS sent in Hindi & English.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-blue-200 text-[11px] text-blue-700 font-semibold">
              Outcome: Rapid dewatering, clear traffic detours, safeguarded hospital ICUs, resilient cities.
            </div>
          </div>

        </div>

        {/* MID-PAGE CTA BUTTON */}
        <div className="text-center pt-2">
          <button
            onClick={onEnterCommandCenter}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 px-5 py-2.5 text-xs font-bold border border-blue-200 transition-all hover:scale-105"
          >
            <span>See the Command Center in Action</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>


      {/* ======================================================== */}
      {/* 3. THE 4 URBAN CLIMATE EMERGENCIES WE ADDRESS            */}
      {/* ======================================================== */}
      <section id="scenarios" className="space-y-6 scroll-mt-20">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600">
            One Unified Platform
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Not Just Floods: Complete Urban Climate Resilience
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Cities face cascading environmental hazards throughout the year. JalRakshak AI handles all four major crises.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Crisis 1: Flood */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3 border border-blue-200">
                <CloudRain className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">Floods & Cloudbursts</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Precipitation breaching stormwater drain capacity, waterlogged underpasses, inundated hospitals.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-blue-700 font-medium">
              ⚡ Action: Deploy dewatering pumps, divert traffic, seal power transformers.
            </div>
          </div>

          {/* Crisis 2: Heatwave */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-3 border border-amber-200">
                <Flame className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">Extreme Heatwaves</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                High wet-bulb temperatures and heat index &gt; 46°C triggering acute heatstroke among outdoor workers.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-amber-700 font-medium">
              ⚡ Action: Open public cooling centers, halt afternoon outdoor labor, dispatch medical vans.
            </div>
          </div>

          {/* Crisis 3: Pipeline Burst */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 mb-3 border border-teal-200">
                <Wrench className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">Pipeline Ruptures</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                High-pressure mainline bursts causing 480K Litres/day potable loss and road sub-base collapse.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-teal-700 font-medium">
              ⚡ Action: Throttle SCADA valves, dispatch acoustic leak repair gang, issue boil-water notice.
            </div>
          </div>

          {/* Crisis 4: Water Shortage */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-3 border border-indigo-200">
                <Droplet className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">Water Shortages</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Elevated reservoir depletion &lt; 15% creating acute drinking water deficit in informal settlements.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-indigo-700 font-medium">
              ⚡ Action: GPS-routed water bowsers, prioritize hospital bypass lines, enforce rationing.
            </div>
          </div>

        </div>
      </section>


      {/* ======================================================== */}
      {/* 4. THE 5 AUTONOMOUS AWS STRANDS AGENTS                   */}
      {/* ======================================================== */}
      <section id="agents" className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 space-y-6 shadow-sm scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 block mb-1">
              Real Multi-Agent Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The 5 AWS Strands Agents Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Five specialized, deterministic agents collaborating in an automated decision graph.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Deterministic State Graph (AWS Strands)</span>
          </div>
        </div>

        {/* 5 Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          
          <div className="rounded-xl bg-slate-50 p-4 border border-rose-200 space-y-2">
            <span className="text-[10px] font-black text-rose-700 uppercase">Agent 1</span>
            <h4 className="text-xs font-bold text-slate-900">Risk Detection</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Analyzes rainfall rate, heat index, and ground depth sensors to classify severity and confidence.
            </p>
            <div className="text-[10px] font-mono text-slate-700 bg-white border border-slate-200 p-1.5 rounded">
              Output: Severity + Weights
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-blue-200 space-y-2">
            <span className="text-[10px] font-black text-blue-700 uppercase">Agent 2</span>
            <h4 className="text-xs font-bold text-slate-900">Impact Assessment</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Intersects hazard contour with municipal GIS to identify exposed population, hospitals, and schools.
            </p>
            <div className="text-[10px] font-mono text-slate-700 bg-white border border-slate-200 p-1.5 rounded">
              Output: Demographics
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-emerald-200 space-y-2">
            <span className="text-[10px] font-black text-emerald-700 uppercase">Agent 3</span>
            <h4 className="text-xs font-bold text-slate-900">Resource Matching</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Scans city depot inventories for available pumps, tankers, and medical vans with real travel ETA.
            </p>
            <div className="text-[10px] font-mono text-slate-700 bg-white border border-slate-200 p-1.5 rounded">
              Output: Pump P-04 (18m)
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-purple-200 space-y-2">
            <span className="text-[10px] font-black text-purple-700 uppercase">Agent 4</span>
            <h4 className="text-xs font-bold text-slate-900">Communication</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Synthesizes localized, clear emergency broadcasts in English, Hindi (हिन्दी), and Marathi (मराठी).
            </p>
            <div className="text-[10px] font-mono text-slate-700 bg-white border border-slate-200 p-1.5 rounded">
              Output: Multilingual SMS
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-blue-300 space-y-2 shadow-xs">
            <span className="text-[10px] font-black text-blue-700 uppercase">Agent 5</span>
            <h4 className="text-xs font-bold text-slate-900">Coordinator (Commander)</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Queries NDMA statutory SOPs and formulates the prioritized Emergency Action Plan for human sign-off.
            </p>
            <div className="text-[10px] font-mono text-slate-700 bg-white border border-slate-200 p-1.5 rounded">
              Output: Action Plan
            </div>
          </div>

        </div>
      </section>


      {/* ======================================================== */}
      {/* 5. BOTTOM CALL TO ACTION                                 */}
      {/* ======================================================== */}
      <section className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center space-y-5 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Experience the Platform Live
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Explore the interactive Command Center, trigger a live monsoon cloudburst, submit a photo report through the Citizen PWA, or consult the AI Copilot.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onEnterCommandCenter}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-7 py-3.5 text-sm font-black text-white shadow-lg active:scale-95 transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>ENTER MAIN APP (COMMAND CENTER)</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => onSimulate('flood')}
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-3.5 text-xs font-bold text-slate-200 border border-slate-700 active:scale-95 transition-all"
          >
            <Play className="h-4 w-4 text-blue-400" />
            <span>Test Live Disaster Scenario</span>
          </button>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. FLOATING STICKY BOTTOM BAR (ALWAYS ACCESSIBLE)        */}
      {/* ======================================================== */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg rounded-2xl bg-white/95 border border-slate-300 p-2.5 shadow-2xl flex items-center justify-between gap-3 backdrop-blur-xl">
        <div className="flex items-center gap-2 pl-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
          </span>
          <span className="text-xs font-bold text-slate-900 hidden sm:inline">
            JalRakshak AI Live System
          </span>
          <span className="text-[11px] text-blue-700 font-mono sm:hidden">
            Live Ready
          </span>
        </div>

        <button
          onClick={onEnterCommandCenter}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-black text-white shadow-md active:scale-95 transition-all whitespace-nowrap"
        >
          <span>ENTER MAIN APP</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

    </div>
  );
}
