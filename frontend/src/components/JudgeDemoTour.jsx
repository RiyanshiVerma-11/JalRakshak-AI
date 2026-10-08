import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ShieldAlert, 
  Cpu, 
  LineChart, 
  Scan, 
  Volume2, 
  CheckCircle2, 
  Award,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { emergencyAudio } from '../utils/audioAlert';

export default function JudgeDemoTour({ 
  isOpen, 
  onClose, 
  onSimulateScenario, 
  setActiveTab, 
  onSelectIncident 
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const tourSteps = [
    {
      step: 1,
      time: '0:00 - 0:30',
      tag: 'THE PROBLEM & THE HOOK',
      title: 'Monsoon Cloudburst in Mumbai (118 mm/hr)',
      quote: '"Most climate platforms tell authorities WHAT is happening. JalRakshak AI tells them WHAT TO DO NEXT."',
      description: 'When intense rain starts, municipal dashboards flood controllers with raw numbers. JalRakshak converts live IoT rainfall spikes and citizen reports into an automated, prioritized operational response.',
      badgeColor: 'border-rose-200 bg-rose-50 text-rose-700',
      actionLabel: 'Trigger Live Cloudburst (118mm/hr)',
      onAction: async () => {
        setActiveTab('command');
        await onSimulateScenario('flood');
      }
    },
    {
      step: 2,
      time: '0:30 - 1:00',
      tag: 'THE KILLER FEATURE',
      title: 'Explainability: "Why Critical?" Scorecard',
      quote: '"We eliminate black-box AI distrust with mathematical transparency."',
      description: 'Instead of an unexplainable red dot, our Risk Agent displays 4 calibrated factors with exact weights: 118mm/hr rainfall exceeds drainage capacity by 162% (+38%), high-tide outfall throttling (+25%), 6 citizen corroborations (+21%), and Bhabha Hospital intersection (+16%).',
      badgeColor: 'border-blue-200 bg-blue-50 text-blue-700',
      actionLabel: 'Inspect Explainability Scorecard',
      onAction: () => {
        setActiveTab('command');
      }
    },
    {
      step: 3,
      time: '1:00 - 1:40',
      tag: 'AWS STRANDS AGENTS SDK',
      title: '5-Agent Collaborative Execution DAG (532ms)',
      quote: '"Autonomous Bedrock Claude 3.5 agents connected in a deterministic state graph."',
      description: '1. Risk Agent evaluates sensor deltas -> 2. Impact Agent intersects GIS demographics (8,420 exposed) -> 3. Resource Agent matches nearest high-capacity pump (P-04, 18 min ETA) -> 4. Communication Agent drafts alerts in Hindi/Marathi -> 5. Coordinator Agent binds NDMA SOP.',
      badgeColor: 'border-indigo-200 bg-indigo-50 text-indigo-700',
      actionLabel: 'Inspect AWS Strands DAG Architecture',
      onAction: () => {
        setActiveTab('aws');
      }
    },
    {
      step: 4,
      time: '1:40 - 2:15',
      tag: 'IMPACT PROOF',
      title: 'Predictive "What-If" Inundation Recession Curve',
      quote: '"Proof of value: Status Quo 4-hr lag vs JalRakshak Rapid AI Response."',
      description: 'Without AI, bureaucratic delays mean pumps arrive after 4 hours: flood water reaches 65 cm, Bhabha Hospital is inundated, and economic loss hits ₹1.4 Crore. With JalRakshak AI, early pre-deployment clears drains in 60 mins, saving ₹80+ Lakhs and keeping critical lifelines open.',
      badgeColor: 'border-purple-200 bg-purple-50 text-purple-700',
      actionLabel: 'Open What-If Recession Simulator',
      onAction: () => {
        setActiveTab('command');
      }
    },
    {
      step: 5,
      time: '2:15 - 2:40',
      tag: 'MULTIMODAL COMPUTER VISION',
      title: 'Ground Truth: Rekognition Photogrammetric Calibration',
      quote: '"Field citizen photos calibrated with millimetre precision."',
      description: 'Citizen uploads are scanned by Claude 3.5 Sonnet Vision. The system overlays bounding boxes on submerged vehicles, choked drain grates, and calculates calibrated water depth (38.4 cm over curb datum) to verify ground reality before allocating multi-lakh municipal assets.',
      badgeColor: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      actionLabel: 'Inspect Computer Vision Bounding Boxes',
      onAction: () => {
        setActiveTab('citizen');
      }
    },
    {
      step: 6,
      time: '2:40 - 3:00',
      tag: 'THE GRAND FINALE',
      title: 'One-Click HITL Dispatch & Multilingual SMS Broadcast',
      quote: '"Democratizing climate emergency response for 1.4 Billion citizens."',
      description: 'The Municipal Commissioner clicks [AUTHORIZE EMERGENCY PLAN]. Instantly: P-04 Dewatering Pump is routed, Dadar power substation is isolated, and 18,450 geo-targeted SMS advisories fire in English, Hindi, and Marathi.',
      badgeColor: 'border-amber-200 bg-amber-50 text-amber-800',
      actionLabel: 'Trigger Commissioner Authorization',
      onAction: () => {
        setActiveTab('command');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        try { emergencyAudio.playAlarm(); } catch(e){}
      }
    }
  ];

  useEffect(() => {
    let timer;
    if (isAutoPlaying && isOpen) {
      timer = setTimeout(() => {
        if (currentStep < tourSteps.length - 1) {
          setCurrentStep(c => c + 1);
        } else {
          setIsAutoPlaying(false);
        }
      }, 15000);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentStep, isOpen]);

  if (!isOpen) return null;

  const current = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      
      {/* Modal Card */}
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 relative overflow-hidden">
        
        {/* Top Glowing Ambient Light */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500"></div>

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200 shadow-xs">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900">3-Minute Hackathon Judge Demo Tour</h3>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                  Track 02: Heat & Water
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Step-by-step walkthrough designed for AWS Hackathon Evaluators
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="pt-4 pb-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5">
            <span>STEP {current.step} OF 6</span>
            <span className="text-blue-700 font-bold">{current.time}</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {tourSteps.map((s, idx) => (
              <div
                key={s.step}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  idx === currentStep
                    ? 'bg-blue-600 shadow-xs'
                    : idx < currentStep
                    ? 'bg-emerald-500'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Tour Content Stage */}
        <div className="py-4 space-y-3">
          
          <div className="flex items-center gap-2">
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-black tracking-wider uppercase border ${current.badgeColor}`}>
              {current.tag}
            </span>
          </div>

          <h2 className="text-xl font-black text-slate-900 leading-tight">
            {current.title}
          </h2>

          {/* Golden Quote Box */}
          <div className="rounded-xl bg-blue-50/70 p-3.5 border border-blue-200 text-xs italic text-blue-900 font-semibold">
            {current.quote}
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {current.description}
          </p>

          {/* Interactive Trigger Button for This Step */}
          {current.actionLabel && (
            <div className="pt-2">
              <button
                onClick={current.onAction}
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-black text-white shadow-md active:scale-95 transition-all"
              >
                <Sparkles className="h-4 w-4 text-white" />
                <span>{current.actionLabel}</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(c => Math.max(0, c - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setCurrentStep(c => Math.min(tourSteps.length - 1, c + 1))}
              disabled={currentStep === tourSteps.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isAutoPlaying 
                  ? 'bg-purple-50 text-purple-700 border-purple-200' 
                  : 'text-slate-600 hover:text-slate-800 border-slate-200'
              }`}
            >
              <Play className={`h-3 w-3 ${isAutoPlaying ? 'animate-spin' : ''}`} />
              <span>{isAutoPlaying ? 'Auto-Advancing (15s)' : 'Auto-Play Tour'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-sm"
            >
              Exit Tour
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
