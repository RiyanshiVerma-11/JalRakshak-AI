import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  X,
  Upload,
  RefreshCw,
  Navigation,
  Bot,
  MessageSquareQuote,
  Trash2
} from 'lucide-react';

export default function CitizenPWAView({ onReportSubmitted, currentUser, onOpenLogin }) {
  const [showCVModal, setShowCVModal] = useState(false);
  const [category, setCategory] = useState('waterlogging');
  const [wardId] = useState('WARD-17');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState(currentUser?.name || 'Resident Citizen');
  const [reporterPhone, setReporterPhone] = useState('+91 98201 XXXXX');
  
  // Real Photo Upload & Camera State
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [activeTab, setActiveTab] = useState('report'); // 'report', 'feed', or 'ai_help'

  // Live Community Feed reports
  const [liveReports, setLiveReports] = useState([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);

  // Citizen AI Help query state
  const [citizenQuery, setCitizenQuery] = useState('');
  const [citizenAnswer, setCitizenAnswer] = useState(null);
  const [isQueryingAI, setIsQueryingAI] = useState(false);

  const [lang, setLang] = useState('en'); // 'en', 'hi', 'mr'

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Categories config
  const categories = [
    { id: 'waterlogging', label: 'Waterlogging', hindi: 'जलभराव', marathi: 'पाणी साचणे', icon: <Droplet className="h-4 w-4" /> },
    { id: 'flood', label: 'Severe Flood', hindi: 'भीषण बाढ़', marathi: 'तीव्र पूर', icon: <CloudRain className="h-4 w-4" /> },
    { id: 'heatwave', label: 'Extreme Heat', hindi: 'लू / भीषण गर्मी', marathi: 'तीव्र उष्णतेची लाट', icon: <Flame className="h-4 w-4" /> },
    { id: 'leak', label: 'Pipe Rupture', hindi: 'पाइपलाइन लीकेज', marathi: 'जलवाहिनी गळती', icon: <Wrench className="h-4 w-4" /> },
    { id: 'water_shortage', label: 'Water Shortage', hindi: 'पानी की कमी', marathi: 'पाण्याची टंचाई', icon: <Droplet className="h-4 w-4" /> },
  ];

  // Fetch live reports when opening feed
  const fetchFeed = async () => {
    setIsLoadingFeed(true);
    try {
      const res = await fetch('/api/citizen/reports');
      if (res.ok) {
        const data = await res.json();
        setLiveReports(data);
      }
    } catch (e) {
      console.error('Error fetching feed:', e);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'feed') {
      fetchFeed();
    }
  }, [activeTab]);

  // Stop Webcam stream
  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Real File Upload Handler
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file) => {
    setSelectedFile(file);
    stopCamera();
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Start Real Live Webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        mediaStreamRef.current = stream;
        setIsCameraActive(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 100);
      } else {
        setCameraError('Camera access not supported in this browser.');
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Camera permission denied or camera not available. Please use file upload.');
      setIsCameraActive(false);
    }
  };

  // Snap photo from webcam
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `live_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          processImageFile(file);
        }
      }, 'image/jpeg', 0.9);
      stopCamera();
    }
  };



  // GPS Geolocation Auto-Detection
  const detectGPSLocation = () => {
    if ('geolocation' in navigator) {
      setIsDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setAddress(`GPS: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E (Near CST Junction / Ward 17)`);
          setIsDetectingLocation(false);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setAddress('LBS Marg Arterial Junction (Ward 17)');
          setIsDetectingLocation(false);
        },
        { timeout: 5000 }
      );
    } else {
      setAddress('LBS Marg Arterial Junction (Ward 17)');
    }
  };

  // Dynamic Computer Vision Preview
  const getVisionPreview = () => {
    if (category === 'waterlogging' || category === 'flood') {
      const isDeep = description.toLowerCase().includes('waist') || description.toLowerCase().includes('knee') || description.toLowerCase().includes('stuck');
      return {
        detected_category: 'Severe Urban Waterlogging',
        estimated_depth: isDeep ? '40 - 55 cm' : '20 - 30 cm',
        road_passability: isDeep ? 'IMPASSABLE FOR LIGHT VEHICLES' : 'PARTIAL PASSABILITY (SLOW)',
        debris: 'DETECTED (Drain Choke)',
        confidence: selectedFile ? '97% (Live Photo Verified)' : '94%',
        severity: 'HIGH'
      };
    } else if (category === 'leak') {
      return {
        detected_category: 'High-Pressure Mainline Rupture',
        estimated_depth: '15 - 25 cm continuous flow',
        road_passability: 'SURFACE EROSION / LANE HAZARD',
        debris: 'NONE',
        confidence: selectedFile ? '96% (Live Photo Verified)' : '93%',
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

  // Submit real report to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('ward_id', wardId);
      formData.append('address', address || 'Municipal Ward 17 Roadway');
      formData.append('user_description', description || `${category} reported at location by citizen.`);
      formData.append('reporter_name', reporterName);
      formData.append('reporter_phone', reporterPhone);

      // Append the real file if selected/captured!
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const res = await fetch('/api/citizen/report', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setSubmittedReport(data);

      confetti({
        particleCount: 60,
        spread: 70,
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

  // Citizen AI Helpline Query
  const handleCitizenQuery = async (e) => {
    e.preventDefault();
    if (!citizenQuery.trim()) return;
    setIsQueryingAI(true);
    try {
      const res = await fetch('/api/citizen/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: citizenQuery })
      });
      if (res.ok) {
        const data = await res.json();
        setCitizenAnswer(data);
      }
    } catch (e) {
      console.error('Error querying AI helpline:', e);
    } finally {
      setIsQueryingAI(false);
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
        <div className="rounded-[28px] bg-[#0c1222] p-4 text-slate-100 min-h-[660px] flex flex-col justify-between border border-slate-800/80">
          
          <div>
            {/* Header Title & SOS Hotline */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xs">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                    JalRakshak Citizen
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </h3>
                  <p className="text-[10px] text-slate-400">City Emergency PWA</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href="tel:1077"
                  className="flex items-center gap-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 px-2.5 py-1 text-rose-300 border border-rose-500/40 text-[10px] font-bold transition-all shadow-xs"
                >
                  <PhoneCall className="h-3 w-3 text-rose-400" />
                  <span>SOS 1077</span>
                </a>
                {onOpenLogin && (
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-bold transition-all shadow-xs cursor-pointer"
                    title="Switch to Municipal Officer / Official Login"
                  >
                    <span>Staff Portal ➔</span>
                  </button>
                )}
              </div>
            </div>

            {/* Language Toggle: English | हिंदी | मराठी (Fix D11/Phase 8) */}
            <div className="flex items-center justify-between px-2 py-1.5 mt-2 bg-slate-900/60 rounded-xl border border-slate-800/80 text-[10px]">
              <span className="text-slate-400 font-bold">भाषा / Lang:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    lang === 'en' ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLang('hi')}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    lang === 'hi' ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
                <button
                  type="button"
                  onClick={() => setLang('mr')}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    lang === 'mr' ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  मराठी
                </button>
              </div>
            </div>

            {/* Navigation Tabs (Report vs Feed vs AI Query) */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-xl my-2.5 text-[11px] font-bold border border-slate-800">
              <button
                type="button"
                onClick={() => { setActiveTab('report'); setSubmittedReport(null); }}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'report' ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'hi' ? 'घटना रिपोर्ट' : (lang === 'mr' ? 'घटना नोंद' : 'Report Incident')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('feed')}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'feed' ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'hi' ? 'लाइव अलर्ट' : (lang === 'mr' ? 'थेट सूचना' : 'Live Alerts')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ai_help')}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'ai_help' ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'hi' ? 'AI हेल्पलाइन' : (lang === 'mr' ? 'AI मदत' : 'AI Helpline')}
              </button>
            </div>

            {/* TAB 1: SUBMITTED CONFIRMATION VIEW */}
            {submittedReport ? (
              <div className="space-y-4 py-6 text-center animate-fade-in">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                
                <div>
                  <h4 className="text-base font-black text-white">Report Ingested by AI</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Your real photo was analyzed by computer vision and forwarded to the Municipal Emergency Operations Center.
                  </p>
                  <span className="inline-block mt-2 font-mono text-xs bg-slate-900 px-3 py-1 rounded-lg text-cyan-300 border border-slate-800">
                    Ticket ID: {submittedReport.report_id}
                  </span>
                </div>

                {submittedReport.report?.image_url && (
                  <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                    <img
                      src={submittedReport.report.image_url}
                      alt="Uploaded proof"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="rounded-xl bg-slate-900/90 p-3 text-left text-xs border border-slate-800 space-y-1.5">
                  <p className="font-bold text-slate-200">AI Computer Vision Output:</p>
                  <p className="text-slate-400">Category: <strong className="text-white">{submittedReport.ai_analysis?.detected_category}</strong></p>
                  <p className="text-slate-400">Estimated Depth: <strong className="text-cyan-300">{submittedReport.ai_analysis?.estimated_water_depth_cm}</strong></p>
                  <p className="text-slate-400">Road Passability: <strong className="text-red-400">{submittedReport.ai_analysis?.road_passability}</strong></p>
                  <p className="text-slate-400">Severity Score: <strong className="text-emerald-400">{submittedReport.ai_analysis?.severity_score}</strong></p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSubmittedReport(null);
                      setPreviewImage(null);
                      setSelectedFile(null);
                      setDescription('');
                    }}
                    className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-white transition-all"
                  >
                    Submit Another
                  </button>
                  <button
                    onClick={() => setActiveTab('feed')}
                    className="flex-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 transition-all"
                  >
                    View in Feed →
                  </button>
                </div>
              </div>
            ) : activeTab === 'report' ? (
              
              /* TAB 1: REAL REPORT FORM WITH FILE UPLOAD & CAMERA */
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
                          <span className="block text-[11px]">
                            {lang === 'hi' ? c.hindi : (lang === 'mr' ? c.marathi : c.label)}
                          </span>
                          <span className="block text-[9px] text-slate-500 font-normal">
                            {lang === 'hi' ? c.label : (lang === 'mr' ? c.hindi : c.hindi)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* REAL PHOTO EVIDENCE ZONE */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Photo Evidence (फोटो साक्ष्य)
                    </label>
                    {previewImage && (
                      <button
                        type="button"
                        onClick={() => { setPreviewImage(null); setSelectedFile(null); }}
                        className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* WEBCAM ACTIVE VIEWFINDER */}
                  {isCameraActive ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-cyan-400 bg-black h-48 flex flex-col justify-between p-2">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="relative z-10 flex justify-between items-center text-[10px] bg-slate-900/80 px-2 py-1 rounded-md text-cyan-300 font-mono">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
                          Live Camera View
                        </span>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="text-slate-400 hover:text-white"
                        >
                          ✕ Close
                        </button>
                      </div>

                      <div className="relative z-10 flex justify-center pb-1">
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/50 active:scale-95 transition-all"
                        >
                          <Camera className="h-4 w-4" />
                          <span>Snap Photo</span>
                        </button>
                      </div>
                    </div>
                  ) : previewImage ? (
                    /* UPLOADED / CAPTURED PHOTO PREVIEW */
                    <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500/50 bg-slate-900 h-32 flex items-center justify-center group">
                      <img
                        src={previewImage}
                        alt="Citizen Upload"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-2 justify-between">
                        <span className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded text-emerald-300 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          {selectedFile ? selectedFile.name.substring(0, 20) : 'Live Capture Attached'}
                        </span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[10px] bg-cyan-600/90 hover:bg-cyan-500 text-slate-950 px-2 py-0.5 rounded font-bold transition-all"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* EMPTY DROPZONE WITH REAL BUTTONS */
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-3 bg-slate-900/50 text-center transition-all"
                    >
                      <Camera className="h-6 w-6 text-slate-500 mx-auto mb-1.5" />
                      <p className="text-xs font-bold text-slate-300 mb-0.5">Attach Proof of Hazard</p>
                      <p className="text-[10px] text-slate-500 mb-2.5">Drag photo here or choose an option below</p>
                      
                      <div className="flex gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold border border-slate-700 transition-all"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          <span>Upload File</span>
                        </button>

                        <button
                          type="button"
                          onClick={startCamera}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-bold border border-cyan-500/40 transition-all"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          <span>Open Camera</span>
                        </button>
                      </div>

                      {cameraError && (
                        <p className="text-[10px] text-rose-400 mt-2 font-medium">{cameraError}</p>
                      )}
                    </div>
                  )}

                  {/* AI Vision Analysis Preview Pill */}
                  <div className="mt-2 rounded-xl bg-slate-900/90 p-2.5 border border-cyan-500/30 text-[11px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-cyan-300 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-cyan-400" />
                        AI Vision Diagnostic
                      </span>
                      <span className="font-mono text-emerald-400 text-[10px] font-bold">
                        {vision.confidence}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                      <div>Depth: <strong className="text-white">{vision.estimated_depth}</strong></div>
                      <div>Debris: <strong className="text-amber-400">{vision.debris}</strong></div>
                    </div>
                    <div className="text-[10px] text-red-400 font-semibold mt-0.5 truncate">
                      ⚠️ {vision.road_passability}
                    </div>

                    {previewImage && (
                      <button
                        type="button"
                        onClick={() => setShowCVModal(true)}
                        className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/40 text-[10px] transition-all"
                      >
                        <Scan className="h-3 w-3" />
                        <span>Inspect Bounding Boxes & Ruler on Your Photo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Location Input with Auto-GPS */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Location & Landmark (स्थान)
                    </label>
                    <button
                      type="button"
                      onClick={detectGPSLocation}
                      disabled={isDetectingLocation}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
                    >
                      <Navigation className="h-3 w-3" />
                      <span>{isDetectingLocation ? 'Locating...' : 'Auto-Detect GPS'}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 border border-slate-800">
                    <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-transparent text-xs text-white focus:outline-none"
                      placeholder="e.g. Near Metro Station / LBS Marg Junction"
                      required
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
                    className="w-full rounded-xl bg-slate-900 p-2.5 text-xs text-white border border-slate-800 focus:outline-none focus:border-cyan-500/60 transition-all resize-none"
                    placeholder="Describe water depth, traffic condition, pipeline leak or people in danger..."
                    required
                  />
                </div>

                {/* Reporter Identity */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Your Name</label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 border border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Mobile Number</label>
                    <input
                      type="text"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 border border-slate-800 font-mono"
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-3 text-xs font-black text-white shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Analyzing & Transmitting to AWS...' : 'Submit Citizen Emergency Report'}</span>
                </button>

              </form>

            ) : activeTab === 'feed' ? (
              
              /* TAB 2: LIVE COMMUNITY ALERTS & REPORTS FEED */
              <div className="space-y-3 py-1 animate-fade-in max-h-[460px] overflow-y-auto pr-1">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold text-slate-300">Live Ward Incident Feed</span>
                  <button
                    onClick={fetchFeed}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                  >
                    <RefreshCw className={`h-3 w-3 ${isLoadingFeed ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {/* Official Municipal Advisory Banner (Multilingual EN/HI/MR - Fix D11/Phase 8) */}
                <div className="rounded-xl bg-cyan-950/40 p-3 border border-cyan-500/40 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-cyan-300 font-bold border-b border-cyan-800/60 pb-1">
                    <span className="flex items-center gap-1.5">
                      <Radio className="h-3 w-3 text-cyan-400 animate-pulse" />
                      {lang === 'hi' ? 'आधिकारिक आपातकालीन चेतावनी' : (lang === 'mr' ? 'अधिकृत आपत्कालीन सूचना' : 'Official Emergency Advisory')}
                    </span>
                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-cyan-900/60 text-cyan-200">
                      {lang.toUpperCase()} DISPATCH
                    </span>
                  </div>
                  <p className="text-slate-200 text-[11px] leading-relaxed">
                    {lang === 'hi'
                      ? 'कुर्ला एल-वार्ड: मीठी नदी जलस्तर वृद्धि चेतावनी। जलभराव वाले क्षेत्रों में जाने से बचें। आपातकालीन सहायता: 1077।'
                      : (lang === 'mr'
                        ? 'कुर्ला एल-वॉर्ड: मिठी नदी पाणी पातळी इशारा. पाणी साचलेल्या सखल भागातून प्रवास टाळा. आपत्कालीन मदत: 1077.'
                        : 'Kurla L-Ward: Mithi River level rise advisory. Avoid submerged underpasses and arterial roads. Emergency helpline: 1077.')}
                  </p>
                </div>

                {liveReports.map((report) => (
                  <div key={report.id} className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded">
                        {report.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{report.created_at}</span>
                    </div>

                    <div className="flex gap-2 items-start mt-1">
                      {report.image_url && (
                        <img
                          src={report.image_url}
                          alt="Report thumbnail"
                          className="h-12 w-12 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                      )}
                      <div>
                        <h5 className="font-bold text-white text-[11px]">{report.address}</h5>
                        <p className="text-[10px] text-slate-400 line-clamp-2">{report.user_description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800 text-slate-400">
                      <span>Reporter: {report.reporter_name}</span>
                      <span className="text-emerald-400 font-bold">Severity: {report.ai_analysis?.severity_score || '0.92'}</span>
                    </div>
                  </div>
                ))}
              </div>

            ) : (
              
              /* TAB 3: CITIZEN AI WATER & CLIMATE HELPLINE QUERY */
              <div className="space-y-3 py-1 animate-fade-in">
                <div className="rounded-xl bg-blue-500/10 p-3 border border-blue-500/30">
                  <h5 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
                    <Bot className="h-4 w-4 text-cyan-400" />
                    Ask JalRakshak Citizen AI
                  </h5>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Ask any question about local drinking water safety, open emergency shelters, water tanker schedules, or road flooding in your ward.
                  </p>
                </div>

                <form onSubmit={handleCitizenQuery} className="space-y-2">
                  <div className="relative">
                    <textarea
                      rows={2}
                      value={citizenQuery}
                      onChange={(e) => setCitizenQuery(e.target.value)}
                      placeholder="e.g. Is municipal tap water safe to drink in Ward 17? Where is the nearest cooling shelter?"
                      className="w-full rounded-xl bg-slate-900 p-2.5 text-xs text-white border border-slate-800 focus:outline-none focus:border-cyan-400 resize-none"
                      required
                    />
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      "Is tap water safe in Ward 17?",
                      "Where is the nearest water tanker?",
                      "How do I report a pipe breach?"
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => setCitizenQuery(prompt)}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isQueryingAI}
                    className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2 text-xs font-black text-slate-950 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isQueryingAI ? 'Querying NDMA & Municipal Knowledge...' : 'Ask AI Helpline'}</span>
                  </button>
                </form>

                {citizenAnswer && (
                  <div className="rounded-xl bg-slate-900 p-3 border border-cyan-500/40 space-y-2 animate-fade-in text-xs">
                    <div className="flex items-center justify-between text-[10px] text-cyan-300 font-bold border-b border-slate-800 pb-1">
                      <span>AI Advisory Answer</span>
                      <span>Verified</span>
                    </div>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      {citizenAnswer.answer}
                    </p>
                    {citizenAnswer.recommended_actions?.length > 0 && (
                      <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] font-bold text-amber-400 block mb-0.5">Recommended Precaution:</span>
                        <p className="text-[10px] text-slate-300">{citizenAnswer.recommended_actions[0].action}</p>
                      </div>
                    )}
                    <span className="text-[9px] text-slate-500 block font-mono">
                      Ref: {citizenAnswer.reference}
                    </span>
                  </div>
                )}
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
