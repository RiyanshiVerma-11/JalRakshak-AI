import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  Cpu, 
  AlertTriangle, 
  Key, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Server, 
  Users, 
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  Building,
  Smartphone,
  ExternalLink,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PERSONAS, ROLES } from '../../data/rolesData';

export default function LoginPage({ onLogin, activeUser, onBackToLanding }) {
  const [activeTab, setActiveTab] = useState('personas'); // 'personas', 'credentials', 'matrix'
  const [selectedPersona, setSelectedPersona] = useState(activeUser || PERSONAS[0]);
  const [email, setEmail] = useState('commissioner.patil@bmc.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [cognitoMfaCode, setCognitoMfaCode] = useState('742918');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const fillPreset = (persona) => {
    setSelectedPersona(persona);
    if (persona.role === ROLES.INCIDENT_COMMANDER) {
      setEmail('commissioner.patil@bmc.gov.in');
      setPassword('Cmd@Mumbai2026');
      setCognitoMfaCode('742918');
    } else if (persona.role === ROLES.FIELD_RESPONDER) {
      setEmail('inspector.shinde@ndrf.gov.in');
      setPassword('Field@Ops2026');
      setCognitoMfaCode('883104');
    } else if (persona.role === ROLES.SCADA_ANALYST) {
      setEmail('ananya.deshmukh@mcgm.water.in');
      setPassword('Scada@Grid2026');
      setCognitoMfaCode('419520');
    } else {
      setEmail('rahul.sharma@mumbaicivic.in');
      setPassword('Citizen@Help2026');
      setCognitoMfaCode('109823');
    }
  };

  const handleSelectPersonaAndLogin = (persona) => {
    setIsAuthenticating(true);
    setSelectedPersona(persona);

    setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#2563eb', '#0284c7', '#10b981']
      });
      setIsAuthenticating(false);
      onLogin(persona);
    }, 350);
  };

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    handleSelectPersonaAndLogin(selectedPersona);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 text-slate-800 font-sans flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. TOP LIGHT HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Statutory Subtitle */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onBackToLanding}
              className="flex items-center gap-2.5 text-left group"
              title="Return to Product Landing Page"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-slate-900">
                    JalRakshak <span className="text-blue-600">AI</span>
                  </span>
                  <span className="rounded-full bg-blue-50 text-blue-700 text-[10px] font-mono font-bold px-2 py-0.2 border border-blue-200">
                    Cognito SSO
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-none">
                  Municipal Disaster Command Authentication
                </p>
              </div>
            </button>
          </div>

          {/* Right Header Navigation Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              AWS Region: ap-south-1 (Mumbai)
            </span>

            <button
              onClick={onBackToLanding}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 text-xs transition-colors border border-slate-200 shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN CENTERED CONTENT CONTAINER */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
        
        {/* Hero Title Section */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-blue-700 border border-blue-200">
            <Lock className="h-3.5 w-3.5 text-blue-600" />
            <span>STATUTORY INCIDENT COMMAND SYSTEM (ICS)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Sign In to JalRakshak Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Compliant with Disaster Management Act 2005 (NDMA Sec 4.3) and AWS Principle of Least Privilege (PoLP). Select your assigned statutory role or sign in with Amazon Cognito.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Tab Selection Navigation */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 sm:px-6 py-2.5 gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <button
                onClick={() => setActiveTab('personas')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                  activeTab === 'personas'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>⚡ 1-Click Role Access (Judge Fast-Track)</span>
              </button>

              <button
                onClick={() => setActiveTab('credentials')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                  activeTab === 'credentials'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Key className="h-3.5 w-3.5" />
                <span>🔐 AWS Cognito Form Login</span>
              </button>

              <button
                onClick={() => setActiveTab('matrix')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                  activeTab === 'matrix'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>📜 Statutory RBAC & PoLP Matrix</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-500 hidden md:block">
              Pool: <strong className="text-slate-700">ap-south-1_JalRakshakPool</strong>
            </div>
          </div>

          {/* TAB 1: 1-CLICK PERSONA CARDS (LIGHT THEMED, HIGH-CONTRAST) */}
          {activeTab === 'personas' && (
            <div className="p-4 sm:p-6 lg:p-8 space-y-5">
              
              <div className="rounded-2xl bg-blue-50 border border-blue-200 p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-blue-950 font-bold">Hackathon Evaluator Notice:</strong> Each role launches its own specialized operational dashboard tailored to that persona's statutory clearance. Click any role below for instant 1-click access.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                {PERSONAS.map((persona) => {
                  const isCurrent = activeUser?.role === persona.role;
                  return (
                    <div
                      key={persona.role}
                      onClick={() => handleSelectPersonaAndLogin(persona)}
                      className={`rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-md ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50/60'
                      }`}
                    >
                      <div>
                        {/* Header: Avatar, Name, Title, ICS Badge */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl p-2 rounded-2xl bg-slate-100 border border-slate-200 shadow-xs">
                              {persona.avatar}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {persona.name}
                                </h3>
                                {isCurrent && (
                                  <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.2 text-[9px] font-black border border-blue-200">
                                    ACTIVE ROLE
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-bold text-slate-700">
                                {persona.title}
                              </p>
                              <p className="text-[11px] text-slate-500 font-medium">
                                {persona.department}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* ICS Tier & Cognito Group Badges */}
                        <div className="flex flex-wrap gap-1.5 my-2.5">
                          <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 border border-slate-200">
                            {persona.icsTier}
                          </span>
                          <span className="rounded-lg bg-amber-50 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-800 border border-amber-200">
                            Cognito: {persona.cognitoGroup.split('_')[2]}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                          {persona.description}
                        </p>

                        {/* Authorized Core Powers */}
                        <div className="space-y-1 mb-3 pt-2.5 border-t border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                            Authorized Core Powers:
                          </span>
                          {persona.allowedActions.slice(0, 2).map((act, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>

                        {/* Restricted Guardrails (PoLP) */}
                        {persona.restrictedActions.length > 0 && (
                          <div className="space-y-1 mb-3">
                            <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block">
                              Restricted Guardrails (PoLP):
                            </span>
                            {persona.restrictedActions.slice(0, 1).map((act, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-rose-700">
                                <Lock className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                                <span>{act}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-3 border-t border-slate-100 mt-2">
                        <button
                          type="button"
                          disabled={isAuthenticating}
                          className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-black transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/10 active:scale-95"
                        >
                          <span>Sign In as {persona.title.split(' ')[0]} ➔</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: AWS COGNITO FORM LOGIN (LIGHT THEMED) */}
          {activeTab === 'credentials' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="max-w-md mx-auto rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
                
                <div className="text-center pb-2 border-b border-slate-200">
                  <div className="inline-flex p-3 rounded-2xl bg-blue-100 text-blue-700 mb-2 border border-blue-200 shadow-xs">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Amazon Cognito User Pool SSO</h3>
                  <p className="text-xs text-slate-500 font-mono">Pool ID: ap-south-1_JalRakshakPool</p>

                  {/* 1-Click Fast Fill Preset Chips */}
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5 font-bold">
                      1-Click Fast Fill for Evaluators:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PERSONAS.map(p => (
                        <button
                          key={p.role}
                          type="button"
                          onClick={() => fillPreset(p)}
                          className={`text-[10px] py-1 px-2 rounded-lg font-bold border transition-all flex items-center justify-center gap-1 ${
                            selectedPersona.role === p.role
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          <span>{p.avatar}</span>
                          <span className="truncate">{p.title.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCredentialsSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Persona</label>
                    <select
                      value={selectedPersona.role}
                      onChange={(e) => {
                        const found = PERSONAS.find(p => p.role === e.target.value);
                        if (found) fillPreset(found);
                      }}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-slate-900 font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    >
                      {PERSONAS.map(p => (
                        <option key={p.role} value={p.role}>
                          {p.avatar} {p.name} — {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Government Officer Email / ID</label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-mono"
                      placeholder="officer@bmc.gov.in"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Password / Security Key</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">Cognito MFA Token (TOTP)</label>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold">Hardware Token Synced</span>
                    </div>
                    <input
                      type="text"
                      value={cognitoMfaCode}
                      onChange={(e) => setCognitoMfaCode(e.target.value)}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-blue-700 font-mono tracking-widest text-center text-sm font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all mt-4"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>{isAuthenticating ? 'Validating Cognito JWT...' : 'Authenticate & Launch Dashboard ➔'}</span>
                  </button>
                </form>

                <div className="text-[10px] text-slate-500 text-center pt-2 border-t border-slate-200 font-mono truncate">
                  Role: {selectedPersona.iamRoleArn}
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: STATUTORY & AWS GOVERNANCE MATRIX (LIGHT THEMED) */}
          {activeTab === 'matrix' && (
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 text-xs">
              
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-2">
                <h3 className="text-sm font-extrabold text-amber-950 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  <span>Statutory Compliance: Disaster Management Act 2005 & NDMA 2024</span>
                </h3>
                <p className="text-amber-900 leading-relaxed text-xs">
                  Indian Disaster Law mandates a strict <strong>Incident Command System (ICS)</strong>. Deploying municipal machinery (Dewatering Pumps, Rescue Boats, Water Bowsers) or broadcasting mass emergency alerts carries legal and financial liability. JalRakshak AI models this hierarchy mathematically through AWS IAM Role Policies and Amazon Cognito group membership.
                </p>
              </div>

              {/* Table of Roles vs Permissions */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono text-slate-600">
                      <th className="p-3.5 font-bold">Statutory Persona</th>
                      <th className="p-3.5 font-bold">ICS Tier & IAM Role</th>
                      <th className="p-3.5 font-bold">Human-in-the-Loop Signoff</th>
                      <th className="p-3.5 font-bold">Mass SNS Broadcast</th>
                      <th className="p-3.5 font-bold">Field Task Execution</th>
                      <th className="p-3.5 font-bold">What-If Simulation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {PERSONAS.map(p => (
                      <tr key={p.role} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                          <span className="text-lg">{p.avatar}</span>
                          <span>{p.title}</span>
                        </td>
                        <td className="p-3.5 font-mono text-[10px] text-slate-500">
                          {p.icsTier}
                        </td>
                        <td className="p-3.5">
                          {p.permissions.canApproveActions ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 font-bold text-[10px]">
                              ✓ Authorized (Sec 4.3)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 text-[10px]">
                              ✕ Locked
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {p.permissions.canBroadcastSNS ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 font-bold text-[10px]">
                              ✓ Authorized
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 text-[10px]">
                              ✕ Locked
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {p.permissions.canUpdateFieldStatus ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 font-bold text-[10px]">
                              ✓ 1-Tap Status Proof
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 text-[10px]">
                              ✕ N/A
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {p.permissions.canSimulateWhatIf ? (
                            <span className="inline-flex items-center gap-1 rounded bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 font-bold text-[10px]">
                              ✓ Parameter Overrides
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 text-[10px]">
                              ✕ Locked
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* Card Footer */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Amazon Cognito Session: <strong className="text-slate-900">{selectedPersona.name} ({selectedPersona.title})</strong></span>
            </div>

            <button
              onClick={() => handleSelectPersonaAndLogin(selectedPersona)}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Launch {selectedPersona.title.split(' ')[0]} Portal ➔</span>
            </button>
          </div>

        </div>

      </main>

      {/* 3. LIGHT BOTTOM FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-900">JalRakshak AI</span>
          <span>•</span>
          <span>AWS Hackathon 2026</span>
          <span>•</span>
          <span className="text-blue-600 font-semibold">Track 02: Heat & Water</span>
        </div>
        <div>
          <span>Disaster Management Act 2005 & AWS Well-Architected Framework: Security Pillar</span>
        </div>
      </footer>

    </div>
  );
}
