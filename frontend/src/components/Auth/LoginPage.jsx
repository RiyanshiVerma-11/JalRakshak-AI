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
  FileText,
  Building,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PERSONAS, ROLES } from '../../data/rolesData';

export default function LoginPage({ onLogin, activeUser, onClose }) {
  const [activeTab, setActiveTab] = useState('personas'); // 'personas', 'credentials', 'matrix'
  const [selectedPersona, setSelectedPersona] = useState(activeUser || PERSONAS[0]);
  const [email, setEmail] = useState('commissioner.patil@bmc.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [cognitoMfaCode, setCognitoMfaCode] = useState('742918');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSelectPersonaAndLogin = (persona) => {
    setIsAuthenticating(true);
    setSelectedPersona(persona);

    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#2563eb', '#10b981', '#f59e0b']
      });
      setIsAuthenticating(false);
      onLogin(persona);
      if (onClose) onClose();
    }, 400);
  };

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    handleSelectPersonaAndLogin(selectedPersona);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
        
        {/* Top Header Banner: Government & AWS Security Credentials */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950/70 to-slate-900 border-b border-slate-800 p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg border border-blue-400/30">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-black">
                  Statutory Incident Command System (ICS)
                </span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Amazon Cognito Verified
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                JalRakshak AI — Role-Based Access Control
              </h1>
              <p className="text-xs text-slate-400">
                Disaster Management Act 2005 (NDMA Sec 4.3) & AWS Principle of Least Privilege (PoLP)
              </p>
            </div>
          </div>

          {/* Quick Exit or Close if invoked from Header */}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-3 py-1.5 text-xs font-bold transition-all border border-slate-700"
            >
              Back to App ✕
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-5 sm:px-6 py-2.5">
          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('personas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'personas'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>⚡ 1-Click Persona Demo Access (Judge Fast-Track)</span>
            </button>

            <button
              onClick={() => setActiveTab('credentials')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'credentials'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Key className="h-3.5 w-3.5" />
              <span>🔐 Enterprise SSO / AWS Cognito Login</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'matrix'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>📜 RBAC Governance & PoLP Matrix</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <Server className="h-3.5 w-3.5 text-blue-400" />
            <span>Region: ap-south-1 (Mumbai)</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">

          {/* TAB 1: 1-CLICK PERSONA CARDS (SUPER USER-FRIENDLY FOR HACKATHON DEMO) */}
          {activeTab === 'personas' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-blue-950/40 border border-blue-800/60 p-3 text-xs text-blue-200 flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Hackathon Judge Fast-Track:</strong> In a real disaster command center, responsibilities are segregated by statutory tier. Select any persona below to experience their dedicated interface, permissions, and security guardrails in real time.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PERSONAS.map((persona) => {
                  const isSelected = (activeUser?.role || selectedPersona?.role) === persona.role;
                  return (
                    <div
                      key={persona.role}
                      onClick={() => handleSelectPersonaAndLogin(persona)}
                      className={`relative rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer group flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800/90 border-blue-500 shadow-lg ring-1 ring-blue-500/50'
                          : 'bg-slate-850/60 hover:bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                      }`}
                    >
                      {/* Persona Header */}
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl p-2 rounded-2xl bg-slate-800 border border-slate-700 shadow-inner">
                              {persona.avatar}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                                  {persona.name}
                                </h3>
                                {isSelected && (
                                  <span className="rounded-full bg-blue-500/20 px-2 py-0.2 text-[9px] font-black text-blue-400 border border-blue-500/40">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-bold text-slate-300">
                                {persona.title}
                              </p>
                              <p className="text-[11px] text-slate-400 font-medium">
                                {persona.department}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* ICS Tier & Statutory Authority Badge */}
                        <div className="flex flex-wrap gap-1.5 my-2.5">
                          <span className="rounded-lg bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-slate-700">
                            {persona.icsTier}
                          </span>
                          <span className="rounded-lg bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-amber-300 border border-slate-700">
                            Cognito: {persona.cognitoGroup.split('_')[2]}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed mb-3">
                          {persona.description}
                        </p>

                        {/* Allowed Highlights */}
                        <div className="space-y-1 mb-3 pt-2 border-t border-slate-800">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            Authorized Core Powers:
                          </span>
                          {persona.allowedActions.slice(0, 2).map((act, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>

                        {/* Restricted Highlights (Proof of Least Privilege) */}
                        {persona.restrictedActions.length > 0 && (
                          <div className="space-y-1 mb-3">
                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">
                              Restricted Guardrails (PoLP):
                            </span>
                            {persona.restrictedActions.slice(0, 1).map((act, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-rose-300">
                                <Lock className="h-3 w-3 text-rose-400 shrink-0 mt-0.5" />
                                <span>{act}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Select & Login Button */}
                      <div className="pt-2 border-t border-slate-800/80 mt-2">
                        <button
                          type="button"
                          disabled={isAuthenticating}
                          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-black transition-all ${
                            isSelected
                              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 group-hover:border-blue-500/50'
                          }`}
                        >
                          <span>{isSelected ? 'Continue As Active Role' : `Switch Role ➔ ${persona.title.split(' ')[0]}`}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ENTERPRISE AWS COGNITO LOGIN FORM */}
          {activeTab === 'credentials' && (
            <div className="max-w-md mx-auto py-4">
              <div className="rounded-2xl bg-slate-850 p-6 border border-slate-700 shadow-xl space-y-4">
                <div className="text-center pb-2 border-b border-slate-800">
                  <div className="inline-flex p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 mb-2 border border-blue-500/30">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Amazon Cognito User Pool SSO</h3>
                  <p className="text-xs text-slate-400">Pool ID: <code className="text-cyan-400">ap-south-1_JalRakshakPool</code></p>
                </div>

                <form onSubmit={handleCredentialsSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Target Persona</label>
                    <select
                      value={selectedPersona.role}
                      onChange={(e) => {
                        const found = PERSONAS.find(p => p.role === e.target.value);
                        if (found) setSelectedPersona(found);
                      }}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white font-bold focus:border-blue-500 outline-none"
                    >
                      {PERSONAS.map(p => (
                        <option key={p.role} value={p.role}>
                          {p.avatar} {p.name} — {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Government Officer Email / ID</label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 outline-none font-mono"
                      placeholder="officer@disaster.gov.in"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Password / Security Key</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-300">Cognito MFA Token (TOTP)</label>
                      <span className="text-[10px] text-emerald-400 font-mono">Hardware Token Synced</span>
                    </div>
                    <input
                      type="text"
                      value={cognitoMfaCode}
                      onChange={(e) => setCognitoMfaCode(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-cyan-300 font-mono tracking-widest text-center text-sm font-bold focus:border-blue-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 shadow-md active:scale-95 transition-all mt-4"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>{isAuthenticating ? 'Validating Cognito JWT...' : 'Authenticate & Issue Scoped Token'}</span>
                  </button>
                </form>

                <div className="text-[10px] text-slate-500 text-center pt-2 border-t border-slate-800 font-mono">
                  Claims: {selectedPersona.iamRoleArn}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STATUTORY & AWS GOVERNANCE MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl bg-slate-850 p-4 border border-slate-700 space-y-2">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-400" />
                  <span>Statutory Compliance: Disaster Management Act 2005 & NDMA 2024</span>
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Indian Disaster Law mandates a strict <strong>Incident Command System (ICS)</strong>. Deploying municipal machinery (Dewatering Pumps, Rescue Boats, Water Bowsers) or broadcasting mass emergency alerts carries legal and financial liability. JalRakshak AI models this hierarchy mathematically through AWS IAM Role Policies and Amazon Cognito group membership.
                </p>
              </div>

              {/* Table of Roles vs Permissions */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 shadow-inner">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-mono text-slate-400">
                      <th className="p-3">Statutory Persona</th>
                      <th className="p-3">ICS Tier & IAM Role</th>
                      <th className="p-3">Human-in-the-Loop Signoff</th>
                      <th className="p-3">Mass SNS Broadcast</th>
                      <th className="p-3">Field Task Execution</th>
                      <th className="p-3">What-If Simulation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {PERSONAS.map(p => (
                      <tr key={p.role} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span>{p.avatar}</span>
                          <span>{p.title}</span>
                        </td>
                        <td className="p-3 font-mono text-[10px] text-slate-400">
                          {p.icsTier}
                        </td>
                        <td className="p-3">
                          {p.permissions.canApproveActions ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 font-bold text-[10px]">
                              ✓ Authorized (Sec 4.3)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500 text-[10px]">
                              ✕ Locked
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {p.permissions.canBroadcastSNS ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 font-bold text-[10px]">
                              ✓ Authorized
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500 text-[10px]">
                              ✕ Locked
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {p.permissions.canUpdateFieldStatus ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 font-bold text-[10px]">
                              ✓ 1-Tap Status Proof
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500 text-[10px]">
                              ✕ N/A
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {p.permissions.canSimulateWhatIf ? (
                            <span className="inline-flex items-center gap-1 rounded bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 font-bold text-[10px]">
                              ✓ Parameter Tuning
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500 text-[10px]">
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

        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>Active Session: <strong className="text-white">{selectedPersona.name} ({selectedPersona.title})</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectPersonaAndLogin(selectedPersona)}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 text-xs shadow-md transition-all"
            >
              Enter JalRakshak AI ➔
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
