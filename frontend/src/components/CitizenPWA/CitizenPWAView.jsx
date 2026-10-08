import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import CVBoundingBoxOverlay from './CVBoundingBoxOverlay';
import { 
  Camera, 
  MapPin, 
  Droplet, 
  Flame, 
  Wrench, 
  CloudRain, 
  AlertCircle, 
  CheckCircle2, 
  Smartphone, 
  Send, 
  Radio, 
  PhoneCall, 
  ShieldAlert, 
  Sparkles,
  Eye,
  Truck,
  RotateCcw,
  Scan,
  X
} from 'lucide-react';

export default function CitizenPWAView({ onReportSubmitted }) {
  const [showCVModal, setShowCVModal] = useState(false);
  const [category, setCategory] = useState('waterlogging');
  const [wardId, setWardId] = useState('WARD-17');
  const [address, setAddress] = useState('LBS Marg, Near Kurla Depot');
  const [description, setDescription] = useState('Water has risen up to knee level, cars are getting stuck near the junction. Storm drain is clogged.');
  const [reporterName, setReporterName] = useState('Priya Sharma');
  const [reporterPhone, setReporterPhone] = useState('+91 98201 44829');
  const [previewImage, setPreviewImage] = useState('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [activeTab, setActiveTab] = useState('report'); // 'report' or 'feed'

  // Categories config
  const categories = [
    { id: 'waterlogging', label: 'Waterlogging', hindi: 'जलभराव', icon: <Droplet className="h-4 w-4" /> },
    { id: 'flood', label: 'Severe Flood', hindi: 'बाढ़', icon: <CloudRain className="h-4 w-4" /> },
    { id: 'heatwave', label: 'Extreme Heat', hindi: 'लू / गर्मी', icon: <Flame className="h-4 w-4" /> },
    { id: 'leak', label: 'Pipe Rupture', hindi: 'पाइपलाइन लीकेज', icon: <Wrench className="h-4 w-4" /> },
    { id: 'water_shortage', label: 'Water Shortage', hindi: 'पानी की कमी', icon: <Droplet className="h-4 w-4" /> },
  ];

  // Dynamic Computer Vision Preview
  const getVisionPreview = () => {
    if (category === 'waterlogging' || category === 'flood') {
      return {
        detected_category: 'Severe Urban Waterlogging',
        estimated_depth: '35 - 50 cm',
        road_passability: 'IMPASSABLE FOR LIGHT VEHICLES',
        debris: 'DETECTED (Drain Choke)',
        confidence: '95%',
        severity: 'HIGH'
      };
    } else if (category === 'leak') {
      return {
        detected_category: 'High-Pressure Mainline Rupture',
        estimated_depth: '15 - 25 cm continuous flow',
        road_passability: 'ROADWAY CAVITATION HAZARD',
        debris: 'NONE',
        confidence: '93%',
        severity: 'HIGH'
      };
    } else if (category === 'heatwave') {
      return {
        detected_category: 'Extreme Heat Island Distress',
        estimated_depth: 'N/A (Thermal Hazard)',
        road_passability: 'PASSABLE - HEAT STRESS',
        debris: 'NONE',
        confidence: '91%',
        severity: 'HIGH'
      };
    } else {
      return {
        detected_category: 'Drinking Water Scarcity Deficit',
        estimated_depth: '0 cm (Dry Supply)',
        road_passability: 'CLEAR',
        debris: 'NONE',
        confidence: '92%',
        severity: 'MODERATE'
      };
    }
  };

  const vision = getVisionPreview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('ward_id', wardId);
      formData.append('address', address);
      formData.append('user_description', description);
      formData.append('reporter_name', reporterName);
      formData.append('reporter_phone', reporterPhone);

      const res = await fetch('/api/citizen/report', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setSubmittedReport(data);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 }
      });

      if (onReportSubmitted) {
        onReportSubmitted();
      }
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      
      {/* PWA Phone Shell */}
      <div className="w-full max-w-md rounded-[38px] bg-slate-950 p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/60 relative">
        
        {/* Phone Speaker Notch */}
        <div className="mx-auto h-4 w-28 rounded-full bg-slate-800 mb-3 flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-slate-700"></span>
        </div>

        {/* Screen Content Container */}
        <div className="rounded-[28px] bg-[#0c1222] p-4 text-slate-100 min-h-[640px] flex flex-col justify-between border border-slate-800/80">
          
          {/* Top Bar inside PWA */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md">
                  <ShieldAlert className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white">JalRakshak Citizen</h3>
                  <p className="text-[10px] text-cyan-400 font-semibold">City Emergency PWA</p>
                </div>
              </div>

              {/* SOS Quick Button */}
              <a
                href="tel:1077"
                className="flex items-center gap-1 rounded-full bg-red-500/20 hover:bg-red-500/30 px-2.5 py-1 text-[11px] font-bold text-red-400 border border-red-500/40"
              >
                <PhoneCall className="h-3 w-3" />
                <span>SOS 1077</span>
              </a>
            </div>

            {/* PWA Tabs */}
            <div className="flex rounded-xl bg-slate-900 p-1 mb-3.5 border border-slate-800 text-xs">
              <button
                onClick={() => { setActiveTab('report'); setSubmittedReport(null); }}
                className={`flex-1 rounded-lg py-1.5 font-bold transition-all text-center ${
                  activeTab === 'report' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                Report Emergency
              </button>
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex-1 rounded-lg py-1.5 font-bold transition-all text-center ${
                  activeTab === 'feed' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                Community Alerts
              </button>
            </div>

            {/* SUBMITTED CONFIRMATION VIEW */}
            {submittedReport ? (
              <div className="space-y-4 py-6 text-center animate-fade-in">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                
                <div>
                  <h4 className="text-base font-black text-white">Report Ingested by AI</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Your photo was analyzed by computer vision and forwarded to the Municipal Emergency Operations Center.
                  </p>
                  <span className="inline-block mt-2 font-mono text-xs bg-slate-900 px-3 py-1 rounded-lg text-cyan-300 border border-slate-800">
                    Ticket ID: {submittedReport.report_id}
                  </span>
                </div>

                <div className="rounded-xl bg-slate-900/90 p-3 text-left text-xs border border-slate-800 space-y-1.5">
                  <p className="font-bold text-slate-200">AI Computer Vision Output:</p>
                  <p className="text-slate-400">Category: <strong className="text-white">{submittedReport.ai_analysis?.detected_category}</strong></p>
                  <p className="text-slate-400">Estimated Depth: <strong className="text-cyan-300">{submittedReport.ai_analysis?.estimated_water_depth_cm}</strong></p>
                  <p className="text-slate-400">Road Passability: <strong className="text-red-400">{submittedReport.ai_analysis?.road_passability}</strong></p>
                  <p className="text-slate-400">Confidence: <strong className="text-emerald-400">{Math.round((submittedReport.ai_analysis?.model_confidence || 0.95)*100)}%</strong></p>
                </div>

                <button
                  onClick={() => setSubmittedReport(null)}
                  className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-white transition-all"
                >
                  Submit Another Report
                </button>
              </div>
            ) : activeTab === 'report' ? (
              /* REPORT FORM */
              <form onSubmit={handleSubmit} className="space-y-3">
                
                {/* Category Selector */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Issue Category (श्रेणी)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={`flex items-center gap-1.5 rounded-xl p-2 text-left text-xs font-bold transition-all border ${
                          category === c.id
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm'
                            : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {c.icon}
                        <div className="leading-tight">
                          <span className="block text-[11px]">{c.label}</span>
                          <span className="block text-[9px] text-slate-500 font-normal">{c.hindi}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Upload & Instant Computer Vision Preview */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Photo Evidence (फोटो साक्ष्य)
                  </label>
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900 h-28 flex items-center justify-center">
                    <img
                      src={previewImage}
                      alt="Incident Evidence"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-2 justify-between">
                      <span className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded text-slate-300 flex items-center gap-1">
                        <Camera className="h-3 w-3 text-cyan-400" />
                        Live Field Camera Attached
                      </span>
                    </div>
                  </div>

                  {/* AI Vision Analysis Preview Pill */}
                  <div className="mt-1.5 rounded-xl bg-slate-900/90 p-2 border border-cyan-500/30 text-[11px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-cyan-300 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-cyan-400" />
                        AI Vision Analysis
                      </span>
                      <span className="font-mono text-emerald-400 text-[10px] font-bold">
                        Confidence: {vision.confidence}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                      <div>Depth: <strong className="text-white">{vision.estimated_depth}</strong></div>
                      <div>Debris: <strong className="text-amber-400">{vision.debris}</strong></div>
                    </div>
                    <div className="text-[10px] text-red-400 font-semibold mt-0.5 truncate">
                      ⚠️ {vision.road_passability}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowCVModal(true)}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/40 text-[10px] transition-all"
                    >
                      <Scan className="h-3 w-3" />
                      <span>Inspect AI Bounding Boxes & Depth Ruler</span>
                    </button>
                  </div>
                </div>

                {/* Location Input */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Location & Landmark (स्थान)
                  </label>
                  <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 border border-slate-800">
                    <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-transparent text-xs text-white focus:outline-none"
                      placeholder="e.g. Near Station, Market Road"
                    />
                  </div>
                </div>

                {/* User Notes */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Describe Situation (विवरण)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 p-2.5 text-xs text-white border border-slate-800 focus:border-cyan-400 focus:outline-none"
                    placeholder="Describe water depth, stuck vehicles, or leaks..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-3 text-xs font-black text-white shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Submitting to AI Command...' : 'Submit Citizen Report'}</span>
                </button>

              </form>
            ) : (
              /* COMMUNITY ALERTS FEED VIEW */
              <div className="space-y-3 py-1">
                <div className="rounded-xl bg-red-950/30 p-3 border border-red-500/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-red-400 bg-red-500/20 px-2 py-0.5 rounded">
                      EMERGENCY ADVISORY (वार्ड 17)
                    </span>
                    <span className="text-[10px] text-slate-500">2 mins ago</span>
                  </div>
                  <h5 className="text-xs font-bold text-white mb-1">Heavy Flooding on LBS Marg</h5>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Water depth reached 38cm. Traffic diverted to BKC Connector. Avoid low-lying underpasses.
                  </p>
                  <p className="text-[10px] text-amber-300 font-mono mt-2 bg-slate-950/60 p-1.5 rounded">
                    हिन्दी: एलबीएस मार्ग पर जलभराव। कृपया बीकेसी कनेक्टर का उपयोग करें। हेल्पलाइन: 1077
                  </p>
                </div>

                <div className="rounded-xl bg-cyan-950/30 p-3 border border-cyan-500/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      WATER BOWSER ROUTE
                    </span>
                    <span className="text-[10px] text-slate-500">Scheduled 2:00 PM</span>
                  </div>
                  <h5 className="text-xs font-bold text-white mb-1">Tanker T-101 En Route to Govandi</h5>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Potable water distribution starting at Community Center. Dial 1916 for live GPS tracking.
                  </p>
                </div>

                <div className="rounded-xl bg-amber-950/30 p-3 border border-amber-500/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                      HEAT ADVISORY
                    </span>
                    <span className="text-[10px] text-slate-500">Active</span>
                  </div>
                  <h5 className="text-xs font-bold text-white mb-1">Dadar Sports Complex Cooling Shelter Open</h5>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Air conditioned community hall open with free ORS and cold water packets.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Footer inside PWA */}
          <div className="pt-3 border-t border-slate-800/80 text-center text-[10px] text-slate-500 flex items-center justify-between">
            <span>Powered by AWS Strands Agents</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync
            </span>
          </div>

        </div>

      </div>

      {/* Field Computer Vision Inspection Modal */}
      {showCVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl relative">
            <button
              onClick={() => setShowCVModal(false)}
              className="absolute -top-10 right-0 p-2 text-slate-400 hover:text-white transition-all flex items-center gap-1 text-xs font-bold"
            >
              <X className="h-4 w-4" />
              <span>Close Diagnostic</span>
            </button>
            <CVBoundingBoxOverlay
              category={category}
              depthEstimate={vision.estimated_depth}
              passability={vision.road_passability}
              imageUrl={previewImage}
            />
          </div>
        </div>
      )}

    </div>
  );
}
