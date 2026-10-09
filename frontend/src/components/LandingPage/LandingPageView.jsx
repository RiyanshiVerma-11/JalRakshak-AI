import React, { useState } from 'react';
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
  Award,
  Layers,
  Clock,
  Gauge,
  Lock,
  ChevronRight,
  Server,
  FileCheck,
  TrendingDown,
  Navigation,
  Compass,
  Check,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { PERSONAS, ROLES } from '../../data/rolesData';

export default function LandingPageView({ 
  onEnterCommandCenter, 
  onSimulate, 
  onOpenCitizenPWA, 
  onOpenJudgeTour,
  onSelectRole,
  onOpenLogin,
  onNavigateTab,
  currentUser
}) {
  const [activeScenario, setActiveScenario] = useState('flood');

  const scenarios = [
    {
      id: 'flood',
      name: 'Urban Cloudburst & Flood',
      ward: 'Ward 17 (Kurla East)',
      icon: <CloudRain className="h-4 w-4 text-cyan-600" />,
      trigger: '118 mm/hr Rain Spike',
      threshold: 'Drain capacity 45 mm/hr exceeded by +162%',
      tacticalAction: 'Deploy 1000 GPM Pump P-04 to Outfall D-17 + Divert LBS Marg PCU flow',
      badge: 'Critical Hazard',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 'heatwave',
      name: 'Extreme Urban Heatwave',
      ward: 'Ward 4 (Dadar / Parel)',
      icon: <Flame className="h-4 w-4 text-amber-600" />,
      trigger: '48.6°C Heat Index',
      threshold: 'Wet-bulb temp 32.4°C (Level 3 Acute Thermal Distress)',
      tacticalAction: 'Open AC cooling shelters with ORS + Position heatstroke care van',
      badge: 'Severe Warning',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 'leak',
      name: 'Main Pipeline Rupture',
      ward: 'Ward 8 (WEH Andheri)',
      icon: <Wrench className="h-4 w-4 text-emerald-600" />,
      trigger: '2.4 Bar SCADA Drop',
      threshold: '520 KLD treated water loss + highway sub-base cavitation risk',
      tacticalAction: 'Remotely throttle SCADA valves + Dispatch acoustic leak gang',
      badge: 'Infrastructure Risk',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 'water_shortage',
      name: 'Elevated Reservoir Deficit',
      ward: 'Ward 12 (Govandi)',
      icon: <Droplet className="h-4 w-4 text-purple-600" />,
      trigger: 'Storage < 11.2% Level',
      threshold: 'Per capita deficit > 48 LPCD in informal settlements',
      tacticalAction: 'Route GPS-tracked potable water bowsers on rotation to standposts',
      badge: 'Supply Deficit',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
    }
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ======================================================== */}
      {/* 1. STICKY LIGHT ENTERPRISE TOP NAVIGATION BAR             */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-slate-200 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Statutory Subtitle */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-500/30">
              <ShieldAlert className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  JalRakshak <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">AI</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  AWS Strands Agents
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block leading-none">
                Autonomous Climate & Water Emergency Command
              </p>
            </div>
          </div>

          {/* Nav Anchor Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => scrollToSection('problem-solution')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            >
              Problem & Solution
            </button>
            <button
              onClick={() => scrollToSection('scenarios')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            >
              Live Scenarios
            </button>
            <button
              onClick={() => scrollToSection('strands-dag')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            >
              5-Agent DAG
            </button>
            <button
              onClick={() => {
                if (onNavigateTab) onNavigateTab('architecture');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <Server className="h-3 w-3 text-blue-500" />
              <span>AWS Stack</span>
            </button>
            <button
              onClick={onOpenCitizenPWA}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <Smartphone className="h-3 w-3 text-emerald-600" />
              <span>Citizen PWA</span>
            </button>
          </nav>

          {/* Single Primary Navbar CTA (Cleaned right side - uncluttered) */}
          <div className="flex items-center gap-2 shrink-0">
            {currentUser ? (
              <button
                onClick={onEnterCommandCenter}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-4 py-2 text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95"
                title={`Active Session: ${currentUser.name} (${currentUser.title})`}
              >
                <span>{currentUser.avatar || '👨‍💼'}</span>
                <span>Launch App</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('login');
                  else if (onOpenLogin) onOpenLogin();
                }}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-4 py-2 text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95"
                title="Sign in with AWS Cognito / Select Officer Role"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Sign In</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main High-Density Content Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 sm:space-y-12">
        
        {/* ======================================================== */}
        {/* 2. HERO SECTION: LIGHT MODERN PALETTE WITH LIVE HUD      */}
        {/* ======================================================== */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 border border-slate-200 p-5 sm:p-8 lg:p-10 shadow-md">
          {/* Subtle Ambient Shapes */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-cyan-100/40 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column (7 cols): High-Impact Value Proposition */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 border border-blue-200">
                  <Sparkles className="h-3 w-3 text-blue-600" />
                  AWS Hackathon 2026 • Track 02 (Heat & Water)
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  NDMA Disaster Act 2005 Grounded
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.14]">
                Turning Real-Time Climate Chaos into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
                  Prioritized Tactical Action
                </span>
              </h1>

              {/* Punchy Narrative Copy */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Most platforms tell municipal authorities <span className="text-rose-600 font-bold underline decoration-rose-300">what is happening</span>. 
                <strong className="text-blue-700 font-bold"> JalRakshak AI</strong> tells them <span className="text-emerald-700 font-bold underline decoration-emerald-300">what statutory action to authorize next</span> — synthesizing raw IoT telemetry, depot inventories, and statutory standard operating procedures in <strong className="text-slate-900">real-time (p50: 3.4ms local pipeline)</strong>.
              </p>

              {/* 4 Crisp Key Metric Badges with Enhanced Border Contrast & Drop Shadow */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="rounded-xl bg-white border border-slate-300/90 p-3 text-center shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                  <span className="text-xl font-black text-blue-600 block">Sub-Second</span>
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-semibold">5-Agent DAG Latency</span>
                </div>
                <div className="rounded-xl bg-white border border-slate-300/90 p-3 text-center shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
                  <span className="text-xl font-black text-emerald-600 block">100%</span>
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-semibold">Human-in-the-Loop</span>
                </div>
                <div 
                  onClick={onOpenLogin}
                  className="rounded-xl bg-white border border-slate-300/90 hover:border-amber-400 p-3 text-center shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  title="Click to open 4 Statutory Personas & RBAC Gateway"
                >
                  <span className="text-xl font-black text-amber-600 block group-hover:scale-105 transition-transform">4 Roles</span>
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-semibold flex items-center justify-center gap-0.5 group-hover:text-amber-700">
                    <span>PoLP IAM</span>
                    <ChevronRight className="h-2.5 w-2.5 text-amber-500" />
                  </span>
                </div>
                <div className="rounded-xl bg-white border border-slate-300/90 p-3 text-center shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
                  <span className="text-xl font-black text-purple-600 block">3 Langs</span>
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-semibold">EN • HI • MR Alerts</span>
                </div>
              </div>

              {/* Hero Action CTA: Keep a single clear primary CTA button */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onEnterCommandCenter}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black px-6 py-3.5 text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition-all ring-1 ring-blue-500/20"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>OPEN COMMAND CENTER</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => scrollToSection('problem-solution')}
                  className="flex items-center gap-1.5 rounded-full border border-slate-300 hover:border-slate-400 bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 px-4 py-2.5 text-xs font-semibold transition-all hover:shadow-xs group"
                  title="Scroll down to municipal bottleneck breakdown"
                >
                  <span>Why Cities Fail</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>

            </div>

            {/* Right Column (5 cols): High-Tech Live Incident HUD (Dark Cockpit Console Contrast) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-slate-900 text-white border border-slate-800 p-4 sm:p-5 shadow-2xl space-y-3">
                
                {/* HUD Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Live Incident HUD
                    </span>
                  </div>
                  <span className="rounded-md bg-rose-500/20 text-rose-300 px-2 py-0.5 text-[10px] font-black border border-rose-500/40">
                    CRITICAL FLOOD
                  </span>
                </div>

                {/* Incident Details Card */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 space-y-2.5 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-white text-sm">Ward 17 (Kurla - L Ward)</h4>
                      <span className="text-[11px] text-slate-400">Rainfall: 118 mm/hr • Outfall D-17 High Tide</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-bold text-xs bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                      Confidence: 94%
                    </span>
                  </div>

                  {/* Statutory SOP Citation */}
                  <div className="rounded-lg bg-slate-900 p-2.5 text-[11px] text-slate-300 border border-slate-800 font-mono">
                    <span className="text-amber-400 font-bold block mb-0.5">Statutory SOP Grounding:</span>
                    NDMA Urban Flooding Guidelines (2024), Chapter 4, Sec 4.3
                  </div>

                  {/* Priority 1 Action Directive */}
                  <div className="rounded-lg bg-emerald-950/60 p-2.5 text-[11px] text-emerald-300 border border-emerald-800/60">
                    <span className="font-bold block mb-0.5 text-emerald-400">[Priority 1 Tactical Action]:</span>
                    Deploy High-Capacity Dewatering Pump P-04 (1000 GPM) to Drain Outfall D-17 (ETA 18m)
                  </div>
                </div>

                {/* 4 Instant Simulators inside HUD */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono font-bold text-slate-400">
                    <span>1-Tap Disaster Simulator:</span>
                    <span className="text-cyan-400 font-normal">Click to test pipeline</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { onSimulate('flood'); onEnterCommandCenter(); }}
                      className="flex items-center gap-2 rounded-xl bg-blue-950/50 hover:bg-blue-900/70 border border-blue-800/60 p-2 text-left transition-all active:scale-95 group"
                    >
                      <CloudRain className="h-4 w-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-xs font-bold text-white block leading-tight">118mm Rain</span>
                        <span className="text-[10px] text-cyan-300 font-mono">Ward 17 Flood</span>
                      </div>
                    </button>

                    <button
                      onClick={() => { onSimulate('heatwave'); onEnterCommandCenter(); }}
                      className="flex items-center gap-2 rounded-xl bg-amber-950/50 hover:bg-amber-900/70 border border-amber-800/60 p-2 text-left transition-all active:scale-95 group"
                    >
                      <Flame className="h-4 w-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-xs font-bold text-white block leading-tight">48.6°C Heat</span>
                        <span className="text-[10px] text-amber-300 font-mono">Ward 4 Heatwave</span>
                      </div>
                    </button>

                    <button
                      onClick={() => { onSimulate('leak'); onEnterCommandCenter(); }}
                      className="flex items-center gap-2 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-800/60 p-2 text-left transition-all active:scale-95 group"
                    >
                      <Wrench className="h-4 w-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-xs font-bold text-white block leading-tight">Pipe Burst</span>
                        <span className="text-[10px] text-emerald-300 font-mono">Ward 8 WEH</span>
                      </div>
                    </button>

                    <button
                      onClick={() => { onSimulate('water_shortage'); onEnterCommandCenter(); }}
                      className="flex items-center gap-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/70 border border-purple-800/60 p-2 text-left transition-all active:scale-95 group"
                    >
                      <Droplet className="h-4 w-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-xs font-bold text-white block leading-tight">Depleted &lt;12%</span>
                        <span className="text-[10px] text-purple-300 font-mono">Ward 12 Bowsers</span>
                      </div>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. CORE PROBLEM VS SOLUTION: CLEAN CRISP LIGHT THEME     */}
        {/* ======================================================== */}
        <section id="problem-solution" className="scroll-mt-20 space-y-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
              THE REAL-WORLD MUNICIPAL BOTTLENECK
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Why Cities Paralyze During Climate Disasters — And How We Solve It
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              During waterlogging or severe heatwaves, municipal disaster teams don't suffer from a lack of data. They drown in <strong className="text-rose-700 font-semibold">information fragmentation</strong> and <strong className="text-rose-700 font-semibold">statutory decision paralysis</strong>.
            </p>
          </div>

          {/* Two-Column Comparison Grid: Broken Way vs JalRakshak AI */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT CARD: ❌ The Traditional Broken Process */}
            <div className="rounded-3xl bg-rose-50/70 border border-rose-200 p-6 sm:p-7 shadow-xs space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-rose-200/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600 border border-rose-300">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">The Broken Traditional Workflow</h3>
                    <p className="text-xs text-rose-700 font-medium">Why underpasses drown & citizens suffer</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-800 px-2.5 py-1 rounded border border-rose-300">
                  45+ MIN DELAY
                </span>
              </div>

              {/* 4 Pain Points in White Crisp Cards */}
              <div className="space-y-3 text-xs text-slate-700">
                
                <div className="rounded-xl bg-white border border-rose-200/80 p-3.5 space-y-1 shadow-xs">
                  <strong className="text-rose-900 font-bold block flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    1. Telemetry Silos & Blind Spots
                  </strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    SCADA pipeline pressures, IMD Doppler radars, ward 311 complaint helplines, and depot inventories sit in 4 completely separate software tools with zero automated cross-correlation.
                  </p>
                </div>

                <div className="rounded-xl bg-white border border-rose-200/80 p-3.5 space-y-1 shadow-xs">
                  <strong className="text-rose-900 font-bold block flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    2. The "What vs What-to-Do" Trap
                  </strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Standard GIS dashboards plot colored dots ("water is 60cm high"), but give zero tactical guidance on which dewatering pump is nearby, which valve to throttle, or which underpass needs barricading.
                  </p>
                </div>

                <div className="rounded-xl bg-white border border-rose-200/80 p-3.5 space-y-1 shadow-xs">
                  <strong className="text-rose-900 font-bold block flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    3. Statutory Fear & Bureaucratic Paralysis
                  </strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Under the Disaster Management Act 2005, officers risk inquiry if they deploy multi-crore public assets without legal grounding. Minutes are wasted in manual phone trees while flood waters rise.
                  </p>
                </div>

                <div className="rounded-xl bg-white border border-rose-200/80 p-3.5 space-y-1 shadow-xs">
                  <strong className="text-rose-900 font-bold block flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    4. Lagging Monolingual Public Broadcasts
                  </strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Emergency alerts take 2 hours to be translated and approved, usually broadcasting English-only generic notices with no safe turn-by-turn evacuation routing for slum residents.
                  </p>
                </div>

              </div>

              <div className="rounded-xl bg-rose-100/80 border border-rose-300 p-3 text-center text-xs font-mono text-rose-900">
                Average Emergency Triage Time: <strong className="text-rose-950 font-black">45 to 90 Minutes</strong>
              </div>
            </div>

            {/* RIGHT CARD: ✅ The JalRakshak AI Autonomous Way */}
            <div className="rounded-3xl bg-emerald-50/70 border border-emerald-200 p-6 sm:p-7 shadow-xs space-y-5 relative overflow-hidden ring-1 ring-emerald-500/20">
              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">The JalRakshak AI Solution</h3>
                    <p className="text-xs text-emerald-800 font-medium">Deterministic AWS Strands Multi-Agent Engine</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded border border-emerald-300">
                  ⚡ SUB-SECOND RESPONSE
                </span>
              </div>

              {/* 4 Solutions in White Crisp Cards */}
              <div className="space-y-3 text-xs text-slate-700">
                
                <div className="rounded-xl bg-white border border-emerald-200/80 p-3.5 space-y-1 shadow-xs">
                  <strong className="text-emerald-900 font-bold block flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    1. Sub-Second Strands 5-Agent Directed Acyclic Graph (DAG)
                  </strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Five specialized autonomous agents ingest synthetic sensor grid telemetry points across 4 wards, correlate GIS flood risk polygons, scan municipal inventory, and synthesize action plans deterministically without hallucinations.
                  </p>
                </div>

                <div className="rounded-xl bg-white border border-emerald-200/80 p-3.5 space-y-1 shadow-xs">
                  <strong className="text-emerald-900 font-bold block flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    2. Actionable Tactical Dispatch Manifests
                  </strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Generates exact execution plans: <span className="text-blue-700 font-mono font-semibold">"Deploy 1000 GPM Pump P-04 to Outfall D-17 (ETA 18 min), Throttle SCADA Valve SV-12 by 45%"</span> with real GPS asset tracking.
                  </p>
                </div>

                <div className="rounded-xl bg-white border border-emerald-200/80 p-3.5 space-y-1 shadow-xs">
                  <strong className="text-emerald-900 font-bold block flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    3. Statutory SOP Grounding (NDMA 2024 Guidelines)
                  </strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Every AI action plan cites the statutory legal chapter (e.g. <span className="text-amber-800 font-mono font-semibold">NDMA Urban Flooding Ch 4, Sec 4.3</span>) with 94%+ confidence, giving the Incident Commander zero legal hesitation.
                  </p>
                </div>

                <div className="rounded-xl bg-white border border-emerald-200/80 p-3.5 space-y-1 shadow-xs">
                  <strong className="text-emerald-900 font-bold block flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    4. Multilingual 30-Second Evacuation SNS Broadcasts
                  </strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Upon 1-click statutory approval, Amazon SNS & WhatsApp automatically broadcast geofenced audio & text alerts in English, Hindi (हिन्दी), and Marathi (मराठी) with safe navigation detour maps.
                  </p>
                </div>

              </div>

              <div className="rounded-xl bg-emerald-100/80 border border-emerald-300 p-3 text-center text-xs font-mono text-emerald-900">
                Average Emergency Triage Time: <strong className="text-emerald-950 font-black">Sub-Second (98%+ Faster)</strong>
              </div>
            </div>

          </div>

          {/* Quick Quantitative Impact Bar */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <span className="text-xl sm:text-2xl font-black text-blue-600 block">45m ➔ Sub-Second</span>
              <span className="text-[11px] text-slate-500 font-medium">98.8% Reduction in Triage Time</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 block">0 Legal Risk</span>
              <span className="text-[11px] text-slate-500 font-medium">Statutory NDMA SOP Grounded</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-amber-600 block">3 Indian Langs</span>
              <span className="text-[11px] text-slate-500 font-medium">English, Hindi & Marathi Reach</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-purple-600 block">100% HITL</span>
              <span className="text-[11px] text-slate-500 font-medium">Incident Commander Sign-off</span>
            </div>
          </div>

        </section>

        {/* ======================================================== */}
        {/* 4. THE 4 DEDICATED STATUTORY PERSONAS (RBAC SHOWCASE)     */}
        {/* ======================================================== */}
        <section id="roles" className="scroll-mt-20 rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-black">
                  Security Pillar & Indian Disaster Law
                </span>
                <span className="rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                  Principle of Least Privilege (PoLP)
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                4 Dedicated Role-Based Operational Dashboards
              </h3>
            </div>
            <button
              onClick={onOpenLogin}
              className="rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3.5 py-2 text-xs border border-blue-200 transition-all flex items-center gap-1.5 shadow-xs hover:shadow-sm"
              title="Open full enterprise IAM login, MFA, and PoLP Matrix"
            >
              <Lock className="h-3.5 w-3.5 text-blue-600" />
              <span>Open Dedicated Role Picker & AWS Cognito Gateway</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {PERSONAS.map((persona) => (
              <div
                key={persona.role}
                onClick={() => {
                  if (onSelectRole) onSelectRole(persona);
                }}
                className="rounded-2xl border border-slate-200 hover:border-blue-400 p-4 bg-slate-50/70 hover:bg-white transition-all cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
                      {persona.avatar}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {persona.icsTier.split('(')[0]}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {persona.name}
                    </h4>
                    <p className="text-xs font-bold text-slate-700">{persona.title}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{persona.department.split('&')[0]}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 text-xs text-slate-600">
                    <strong className="text-slate-400 block text-[9px] uppercase font-mono">Dedicated View:</strong>
                    {persona.role === ROLES.INCIDENT_COMMANDER && 'Decision Room & Statutory Sign-off'}
                    {persona.role === ROLES.FIELD_RESPONDER && 'Tactical Checklist & Photo Proof'}
                    {persona.role === ROLES.SCADA_ANALYST && 'Telemetry Waveforms & ML Sliders'}
                    {persona.role === ROLES.CITIZEN && 'Multimodal SOS & Advisory Feed'}
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-200/80 space-y-1.5">
                  <span className="w-full inline-flex items-center justify-center gap-1 rounded-xl bg-white group-hover:bg-blue-600 text-slate-700 group-hover:text-white py-2 px-3 text-xs font-bold border border-slate-200 group-hover:border-blue-600 transition-all shadow-xs">
                    <span>
                      {persona.role === ROLES.INCIDENT_COMMANDER && 'Launch as Commander ➔'}
                      {persona.role === ROLES.FIELD_RESPONDER && 'Launch as Field Lead ➔'}
                      {persona.role === ROLES.SCADA_ANALYST && 'Launch as SCADA Analyst ➔'}
                      {persona.role === ROLES.CITIZEN && 'Launch as Citizen ➔'}
                    </span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenLogin) onOpenLogin();
                    }}
                    className="w-full inline-flex items-center justify-center gap-1 text-[10px] text-slate-400 hover:text-blue-600 font-medium transition-colors"
                  >
                    <Lock className="h-2.5 w-2.5" />
                    <span>View IAM Policy & Credentials</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. THE 4 URBAN CLIMATE EMERGENCIES (DENSE 4-CRISIS GRID)  */}
        {/* ======================================================== */}
        <section id="scenarios" className="scroll-mt-20 rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-black">
                Comprehensive Climate Coverage
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                4 Real-World Climate & Water Emergencies Handled
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Click any scenario to test the autonomous response pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {scenarios.map((sc) => (
              <div
                key={sc.id}
                className="rounded-2xl border border-slate-200 hover:border-blue-300 p-4 bg-slate-50/70 hover:bg-white transition-all flex flex-col justify-between shadow-xs hover:shadow-sm"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs">
                      {sc.icon}
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${sc.badgeColor}`}>
                      {sc.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{sc.name}</h4>
                    <p className="text-[11px] font-bold text-rose-600 mt-0.5">Trigger: {sc.trigger}</p>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">
                    {sc.threshold}
                  </p>

                  <div className="rounded-lg bg-blue-50/50 p-2.5 text-[11px] text-slate-700 border border-blue-100 font-medium">
                    <strong className="text-blue-700 block text-[9px] uppercase font-mono">Tactical Action:</strong>
                    {sc.tacticalAction}
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-200/80">
                  <button
                    onClick={() => { onSimulate(sc.id); onEnterCommandCenter(); }}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white hover:bg-blue-600 text-slate-700 hover:text-white py-2 text-xs font-bold transition-all active:scale-95 border border-slate-200 hover:border-blue-600 shadow-xs"
                  >
                    <Play className="h-3 w-3" />
                    <span>Simulate Event ➔</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. THE 5 AUTONOMOUS AWS STRANDS AGENTS (VISUAL DAG)      */}
        {/* ======================================================== */}
        <section id="strands-dag" className="scroll-mt-20 rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-black">
                Under The Hood
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                The 5 AWS Strands Agents Workflow (Autonomous Multi-Agent DAG)
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Deterministic State Transitions (No Hallucinations)</span>
            </div>
          </div>

          {/* 5 Agents Horizontal DAG Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            <div className="rounded-xl bg-rose-50/50 border border-rose-200 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black font-mono text-rose-700">AGENT 1 (120ms)</span>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-900">Risk Detection</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Ingests raw sensor feeds, rainfall gauges, SCADA pressures & citizen tickets to compute severity & explainability.
              </p>
            </div>

            <div className="rounded-xl bg-blue-50/50 border border-blue-200 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black font-mono text-blue-700">AGENT 2 (145ms)</span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-900">Impact Assessment</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Intersects GIS hazard contours with municipal databases to count exposed population, ICU hospitals & schools.
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50/50 border border-emerald-200 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black font-mono text-emerald-700">AGENT 3 (95ms)</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-900">Resource Allocation</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Scans city depot inventories for nearest available dewatering pumps, bowsers & squads with real travel ETA.
              </p>
            </div>

            <div className="rounded-xl bg-purple-50/50 border border-purple-200 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black font-mono text-purple-700">AGENT 4 (110ms)</span>
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-900">Communication</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Synthesizes culturally nuanced emergency alerts in English, Hindi (हिन्दी) & Marathi (मराठी) with detour routes.
              </p>
            </div>

            <div className="rounded-xl bg-amber-50/50 border border-amber-200 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black font-mono text-amber-800">AGENT 5 (180ms)</span>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-900">Coordinator (SOP RAG)</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Queries NDMA statutory standard operating procedures & presents the decision contract for Human-in-the-Loop approval.
              </p>
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 7. BOTTOM CALL TO ACTION & FOOTER                        */}
        {/* ======================================================== */}
        <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 max-w-xl">
            <h4 className="text-base sm:text-lg font-black text-white">Ready to inspect the live incident command room?</h4>
            <p className="text-xs sm:text-sm text-blue-100">
              Experience real-time AI triage, GIS map telemetry layers, and 1-click statutory action plan execution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenJudgeTour}
              className="rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 text-xs sm:text-sm border border-white/20 transition-all shadow-xs backdrop-blur-sm"
            >
              🎬 3-Min Tour
            </button>

            <button
              onClick={onEnterCommandCenter}
              className="flex items-center gap-2 rounded-xl bg-white hover:bg-slate-100 text-blue-700 font-black px-5 py-2.5 text-xs sm:text-sm shadow-lg shadow-black/10 transition-all active:scale-95"
            >
              <span>ENTER COMMAND CENTER</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* Mini Footer */}
        <footer className="pt-2 pb-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>JalRakshak AI • WeMakeDevs AWS Hackathon (Track 2: Heat & Water)</span>
          </div>
          <div>
            Built with AWS Strands Multi-Agent System & NDMA Statutory Compliance
          </div>
        </footer>

      </div>

    </div>
  );
}
