import React, { useState } from 'react';
import { 
  Eye, 
  Layers, 
  Ruler, 
  Scan, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Maximize2, 
  Camera, 
  Sparkles,
  Info
} from 'lucide-react';

/**
 * Computer Vision Bounding Box Overlay for Citizen Field Photos.
 * Simulates Amazon Rekognition / Bedrock Claude 3.5 Sonnet Vision
 * with calibrated waterline measurement, object bounding boxes, and passability analysis.
 */
export default function CVBoundingBoxOverlay({ 
  imageUrl, 
  category = "waterlogging",
  depthEstimate = "38 cm",
  passability = "IMPASSABLE FOR LIGHT VEHICLES",
  reporterName = "Field Citizen",
  timestamp = "10 mins ago"
}) {
  const [showBoxes, setShowBoxes] = useState(true);
  const [showRuler, setShowRuler] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);

  // Calibrated computer vision detections based on hazard type
  const detections = category === 'leak' ? [
    {
      id: 'leak-pt',
      label: 'Mainline Rupture Point',
      sublabel: '600mm Ductile Iron Pipe Fissure',
      confidence: '96.4%',
      box: { top: '35%', left: '30%', width: '42%', height: '35%' },
      color: '#06b6d4',
      type: 'critical'
    },
    {
      id: 'scour-zone',
      label: 'Asphalt Cavitation Scour',
      sublabel: 'Sub-base erosion hazard',
      confidence: '92.1%',
      box: { top: '65%', left: '18%', width: '64%', height: '28%' },
      color: '#f59e0b',
      type: 'warning'
    }
  ] : [
    {
      id: 'veh-1',
      label: 'Submerged Light Motor Vehicle',
      sublabel: 'Exhaust & air intake flooded',
      confidence: '94.8%',
      box: { top: '42%', left: '18%', width: '40%', height: '34%' },
      color: '#ef4444',
      type: 'danger'
    },
    {
      id: 'drain-clog',
      label: 'Clogged Stormwater Outfall Grate',
      sublabel: 'Plastic debris choke detected',
      confidence: '91.2%',
      box: { top: '68%', left: '68%', width: '26%', height: '24%' },
      color: '#f59e0b',
      type: 'warning'
    },
    {
      id: 'curb-sub',
      label: 'Submerged Pedestrian Walkway Curb',
      sublabel: 'Calibrated depth reference mark',
      confidence: '97.5%',
      box: { top: '56%', left: '2%', width: '32%', height: '20%' },
      color: '#3b82f6',
      type: 'info'
    }
  ];

  return (
    <div className="rounded-2xl glass-panel-elevated border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Scan className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white">AWS Rekognition Multimodal Vision Engine</span>
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.2 text-[10px] font-bold text-cyan-300 border border-cyan-500/40">
                Claude 3.5 Sonnet Vision
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Photogrammetric Waterline Depth Calibration & Hazard Object Localization
            </p>
          </div>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold border transition-all ${
              showBoxes 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-slate-800/60 text-slate-400 border-slate-700'
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Bounding Boxes</span>
          </button>

          <button
            onClick={() => setShowRuler(!showRuler)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold border transition-all ${
              showRuler 
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' 
                : 'bg-slate-800/60 text-slate-400 border-slate-700'
            }`}
          >
            <Ruler className="h-3 w-3" />
            <span>Waterline Ruler</span>
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold border transition-all ${
              showHeatmap 
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
                : 'bg-slate-800/60 text-slate-400 border-slate-700'
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>Thermal Inundation</span>
          </button>
        </div>
      </div>

      {/* Main Image Stage with Dynamic SVG & HTML Overlays */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-slate-950 overflow-hidden select-none">
        
        {/* Base Citizen Photo */}
        <img 
          src={imageUrl || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"} 
          alt="Citizen Ground Evidence" 
          className={`w-full h-full object-cover transition-all duration-300 ${
            showHeatmap ? 'contrast-125 saturate-200 hue-rotate-15 filter' : ''
          }`}
        />

        {/* Thermal / Inundation Overlay simulation */}
        {showHeatmap && (
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-60"
            style={{
              background: 'radial-gradient(ellipse at 50% 75%, rgba(6, 182, 212, 0.8) 0%, rgba(59, 130, 246, 0.5) 45%, transparent 80%)'
            }}
          />
        )}

        {/* Calibrated Waterline Depth Ruler (Vertical Gauge on Left + Horizontal Surface Line) */}
        {showRuler && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Water Surface Line across the frame */}
            <div 
              className="absolute left-0 right-0 border-t-2 border-dashed border-cyan-400 shadow-md flex items-center justify-between px-4 z-20"
              style={{ top: '62%' }}
            >
              <div className="rounded-md bg-cyan-950/90 text-cyan-300 px-2 py-0.5 text-[11px] font-mono font-bold border border-cyan-400/60 flex items-center gap-1 shadow-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                WATER SURFACE LINE (CALIBRATED: {depthEstimate})
              </div>
              <span className="text-[10px] font-mono text-cyan-200 bg-slate-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                Δz = +38.4 cm over curb datum
              </span>
            </div>

            {/* Vertical Depth Measurement Ruler on Left */}
            <div className="absolute left-3 top-8 bottom-8 w-12 bg-slate-950/85 backdrop-blur-md rounded-lg border border-slate-700/80 p-1 flex flex-col justify-between text-[9px] font-mono text-slate-300 z-20">
              <span className="text-red-400 font-bold">50cm CRIT</span>
              <span className="text-amber-400 font-bold">40cm HIGH</span>
              <span className="text-cyan-400 font-bold text-[10px] underline">38cm CURR</span>
              <span className="text-blue-400">25cm MED</span>
              <span className="text-emerald-400">10cm LOW</span>
              <span className="text-slate-500">0cm DATUM</span>
            </div>
          </div>
        )}

        {/* Object Bounding Boxes */}
        {showBoxes && detections.map((det) => (
          <div
            key={det.id}
            onClick={() => setSelectedBox(det)}
            className="absolute cursor-pointer group transition-all duration-150 z-20"
            style={{
              top: det.box.top,
              left: det.box.left,
              width: det.box.width,
              height: det.box.height,
              border: `2px solid ${det.color}`,
              backgroundColor: `${det.color}15`,
              boxShadow: `0 0 12px ${det.color}60`
            }}
          >
            {/* Corner Crosshairs */}
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2" style={{ borderColor: det.color }}></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2" style={{ borderColor: det.color }}></span>
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2" style={{ borderColor: det.color }}></span>
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2" style={{ borderColor: det.color }}></span>

            {/* Label Tag */}
            <div 
              className="absolute -top-7 left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-mono font-bold text-white shadow-md flex items-center gap-1"
              style={{ backgroundColor: det.color }}
            >
              <span>{det.label}</span>
              <span className="bg-black/40 px-1 rounded text-[9px] font-black">{det.confidence}</span>
            </div>

            {/* Hover Tooltip */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-0 mt-1 z-30 pointer-events-none rounded-lg bg-slate-950/95 p-2 text-[10px] text-slate-200 border border-slate-700 shadow-xl whitespace-nowrap">
              <strong className="block text-white">{det.label}</strong>
              <span className="text-slate-400 block">{det.sublabel}</span>
              <span className="text-cyan-400 font-mono mt-0.5 block">Confidence: {det.confidence}</span>
            </div>
          </div>
        ))}

        {/* Live HUD Diagnostics Watermark */}
        <div className="absolute bottom-2 right-2 rounded-lg bg-slate-950/85 backdrop-blur-md px-3 py-1.5 border border-slate-800 text-[10px] font-mono text-slate-400 z-20 flex items-center gap-3">
          <div>LAT: 19.0688°N • LNG: 72.8796°E</div>
          <div className="h-2.5 w-px bg-slate-700"></div>
          <div className="text-cyan-300 font-bold">PASSABILITY: {passability}</div>
        </div>

      </div>

      {/* Ground Truth Diagnostic Analysis Card */}
      <div className="p-3.5 bg-slate-900/60 border-t border-slate-800 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Waterline Calibrated</span>
            <strong className="text-cyan-300 text-sm font-black flex items-center gap-1 mt-0.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              {depthEstimate} (± 2.5 cm)
            </strong>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Road Passability</span>
            <strong className="text-red-400 text-xs font-black block mt-0.5 truncate">
              {passability}
            </strong>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Model Inference Cost</span>
            <strong className="text-slate-200 text-xs font-black block mt-0.5">
              184ms • $0.0031 (Bedrock)
            </strong>
          </div>
        </div>
      </div>

    </div>
  );
}
