import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Droplet, 
  Flame, 
  Wrench, 
  AlertTriangle, 
  Truck, 
  Cross, 
  Building2,
  Navigation,
  Route,
  Activity,
  Zap,
  Clock
} from 'lucide-react';

// Custom modern SVG DivIcons for Leaflet
const createDivIcon = (bgClass, borderClass, emoji, text) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="
          position: absolute; 
          width: 38px; 
          height: 38px; 
          border-radius: 9999px; 
          background: ${bgClass}; 
          border: 2px solid ${borderClass}; 
          box-shadow: 0 0 18px ${borderClass}; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-size: 16px;
        ">
          ${emoji}
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20]
  });
};

const createResourceIcon = (color, emoji, isDispatched = false) => {
  return L.divIcon({
    className: 'custom-resource-marker',
    html: `
      <div style="
        position: relative;
        width: 32px; 
        height: 32px; 
        border-radius: 10px; 
        background: rgba(15, 23, 42, 0.95); 
        border: 2px solid ${color}; 
        box-shadow: 0 0 14px ${color}; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        font-size: 15px;
      ">
        ${isDispatched ? '<span style="position: absolute; top:-3px; right:-3px; width:8px; height:8px; border-radius:9999px; background:#10b981; animation:ping 1.5s infinite;"></span>' : ''}
        ${emoji}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Dispatch Route Coordinates (Dadar Depot -> BKC Elevated -> Kurla Outfall D-17)
const DISPATCH_WAYPOINTS = [
  [19.0178, 72.8478], // Dadar Depot (Start)
  [19.0310, 72.8540], // Matunga Central
  [19.0450, 72.8630], // Sion Junction
  [19.0580, 72.8710], // BKC Elevated Connector
  [19.0688, 72.8796]  // Outfall D-17 (Target)
];

export default function LiveCityMap({ incidents, resources, selectedIncident, onSelectIncident, focusedAction }) {
  const [activeLayer, setActiveLayer] = useState('ALL'); // 'ALL', 'HAZARDS', 'RESOURCES'
  const [showDispatchRoute, setShowDispatchRoute] = useState(true);
  const [routeProgress, setRouteProgress] = useState(0.65); // 0.0 to 1.0 along route
  const [mapCenter] = useState([19.0550, 72.8650]); // Centered between Dadar and Kurla

  // Animate the moving truck along the route
  useEffect(() => {
    const interval = setInterval(() => {
      setRouteProgress((prev) => (prev >= 0.95 ? 0.2 : prev + 0.05));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Compute interpolated moving coordinates for truck marker
  const getInterpolatedCoord = (progress) => {
    const totalSegments = DISPATCH_WAYPOINTS.length - 1;
    const currentSegmentIndex = Math.min(Math.floor(progress * totalSegments), totalSegments - 1);
    const segmentProgress = (progress * totalSegments) - currentSegmentIndex;

    const p1 = DISPATCH_WAYPOINTS[currentSegmentIndex];
    const p2 = DISPATCH_WAYPOINTS[currentSegmentIndex + 1];

    const lat = p1[0] + (p2[0] - p1[0]) * segmentProgress;
    const lng = p1[1] + (p2[1] - p1[1]) * segmentProgress;
    return [lat, lng];
  };

  const movingTruckCoord = getInterpolatedCoord(routeProgress);
  const currentEtaMinutes = Math.max(2, Math.round(18 * (1 - routeProgress)));

  const getIncidentIcon = (category, severity) => {
    if (category === 'flood') {
      return createDivIcon('rgba(239, 68, 68, 0.88)', '#ef4444', '🌧️', 'Flood');
    } else if (category === 'heatwave') {
      return createDivIcon('rgba(245, 158, 11, 0.88)', '#f59e0b', '🔥', 'Heat');
    } else if (category === 'leak') {
      return createDivIcon('rgba(20, 184, 166, 0.88)', '#14b8a6', '🚰', 'Leak');
    } else {
      return createDivIcon('rgba(99, 102, 241, 0.88)', '#6366f1', '💧', 'Deficit');
    }
  };

  const getHazardCircleColor = (severity) => {
    if (severity === 'CRITICAL') return { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.25 };
    if (severity === 'HIGH') return { color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.20 };
    return { color: '#eab308', fillColor: '#eab308', fillOpacity: 0.15 };
  };

  return (
    <div className="relative h-[510px] w-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs">
      
      {/* Map Layer Switcher Header */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-1 rounded-xl bg-white/95 p-1.5 backdrop-blur-md border border-slate-200 shadow-md">
        <span className="text-[11px] font-bold text-slate-600 px-2 flex items-center gap-1">
          <Layers className="h-3.5 w-3.5 text-blue-600" />
          Layers:
        </span>
        <button
          onClick={() => setActiveLayer('ALL')}
          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
            activeLayer === 'ALL'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Layers
        </button>
        <button
          onClick={() => setActiveLayer('HAZARDS')}
          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
            activeLayer === 'HAZARDS'
              ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hazards ({incidents.length})
        </button>
        <button
          onClick={() => setActiveLayer('RESOURCES')}
          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
            activeLayer === 'RESOURCES'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Assets ({resources.length})
        </button>
        
        {/* Toggle Dispatch Route Animation */}
        <button
          onClick={() => setShowDispatchRoute(!showDispatchRoute)}
          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all flex items-center gap-1 ${
            showDispatchRoute
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600'
          }`}
          title="Toggle live route drawing & animated moving pump truck"
        >
          <Route className="h-3 w-3" />
          <span>{showDispatchRoute ? 'Route Active' : 'Show Route'}</span>
        </button>
      </div>

      {/* Action-to-Map Direct Spatial Context Highlight Banner */}
      {focusedAction && (
        <div className="absolute top-16 left-3 z-[1000] max-w-md rounded-xl bg-slate-900/95 text-white p-2.5 px-3 border border-blue-400 shadow-xl backdrop-blur-md animate-fade-in flex items-start gap-2.5">
          <div className="h-6 w-6 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="h-3.5 w-3.5 text-rose-400 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                Direct Spatial Pin Highlighted
              </span>
              <span className="rounded bg-blue-500/20 text-blue-300 text-[9px] px-1.5 py-0.2 font-mono">
                P{focusedAction.priority} Directive
              </span>
            </div>
            <p className="text-xs font-bold text-slate-100 truncate">
              {focusedAction.action}
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Assigned: {focusedAction.authority} • {focusedAction.resource_id || 'Tactical Unit'}
            </p>
          </div>
        </div>
      )}

      {/* Live En-Route Asset Banner (Top Right) */}
      {showDispatchRoute && (
        <div className="absolute top-3 right-3 z-[1000] hidden sm:flex items-center gap-2 rounded-xl bg-white/95 p-2.5 border border-slate-200 shadow-md backdrop-blur-md text-xs">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px]">
              <Truck className="h-3.5 w-3.5 text-blue-600" />
              <span>Pump P-04 (1000 GPM) En Route</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Via BKC Elevated • ETA: <strong className="text-emerald-700 font-black">{currentEtaMinutes} mins</strong>
            </p>
          </div>
        </div>
      )}

      {/* Map Legend Overlay (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-[1000] hidden md:flex flex-col gap-1 rounded-xl bg-white/95 p-2.5 backdrop-blur-md border border-slate-200 text-[11px] text-slate-700 shadow-md">
        <span className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Live GIS Legend</span>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200"></span>
          <span>Critical Flood Zone (&gt;30cm)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-5 bg-blue-600 border border-blue-400 border-dashed"></span>
          <span>Tactical Dispatch Corridor</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
          <span>Active Dewatering / Bowser</span>
        </div>
      </div>

      {/* Leaflet Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Tactical Dispatch Animated Route (Dadar to Kurla Outfall D-17) */}
        {showDispatchRoute && (
          <>
            {/* Outer Glow Route */}
            <Polyline
              positions={DISPATCH_WAYPOINTS}
              pathOptions={{
                color: '#06b6d4',
                weight: 6,
                opacity: 0.4
              }}
            />
            {/* Core Animated Dash Route */}
            <Polyline
              positions={DISPATCH_WAYPOINTS}
              pathOptions={{
                color: '#38bdf8',
                weight: 3,
                opacity: 0.95,
                dashArray: '8, 8'
              }}
            />

            {/* Moving Pump Truck Marker along the route */}
            <Marker
              position={movingTruckCoord}
              icon={createResourceIcon('#10b981', '🚜', true)}
            >
              <Popup>
                <div className="p-1 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-white font-bold">Dewatering Pump P-04</strong>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      EN ROUTE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">Target: Drain Outfall D-17 (Kurla)</p>
                  <p className="text-[11px] text-cyan-300 font-semibold mt-1">
                    ETA: ~{currentEtaMinutes} mins remaining
                  </p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Hazards Layer */}
        {(activeLayer === 'ALL' || activeLayer === 'HAZARDS') &&
          incidents.map((inc) => {
            const style = getHazardCircleColor(inc.severity);
            const radius = inc.severity === 'CRITICAL' ? 1400 : 900;
            const isSelected = selectedIncident?.id === inc.id;

            return (
              <React.Fragment key={inc.id}>
                {/* Hazard Perimeter Contour */}
                <Circle
                  center={[inc.lat, inc.lng]}
                  radius={radius}
                  pathOptions={{
                    color: isSelected ? '#38bdf8' : style.color,
                    fillColor: style.fillColor,
                    fillOpacity: isSelected ? 0.35 : style.fillOpacity,
                    weight: isSelected ? 3 : 1.5,
                    dashArray: inc.severity === 'CRITICAL' ? '4, 4' : null
                  }}
                />

                {/* Incident Marker */}
                <Marker
                  position={[inc.lat, inc.lng]}
                  icon={getIncidentIcon(inc.category, inc.severity)}
                  eventHandlers={{
                    click: () => onSelectIncident(inc)
                  }}
                >
                  <Popup>
                    <div className="p-1 min-w-[220px]">
                      <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5 mb-1.5">
                        <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          inc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {inc.severity}
                        </span>
                        <span className="text-[11px] text-slate-400">{inc.ward_name}</span>
                      </div>
                      
                      <h4 className="text-xs font-bold text-white mb-1">{inc.title}</h4>
                      
                      <div className="text-[11px] text-slate-300 space-y-0.5 mb-2.5">
                        <p>👥 <span className="text-slate-400">Exposed Population:</span> <strong className="text-cyan-400">{inc.impact_assessment?.exposed_population?.toLocaleString()}</strong></p>
                        {inc.category === 'flood' && (
                          <p>🌧️ <span className="text-slate-400">Precipitation:</span> <strong className="text-blue-300">{inc.telemetry?.rainfall_rate_mm_hr} mm/hr</strong></p>
                        )}
                        {inc.category === 'heatwave' && (
                          <p>🌡️ <span className="text-slate-400">Heat Index:</span> <strong className="text-amber-300">{inc.telemetry?.heat_index_celsius}°C</strong></p>
                        )}
                        <p>🎯 <span className="text-slate-400">AI Confidence:</span> <strong className="text-emerald-400">{Math.round((inc.explainability?.confidence || 0.9) * 100)}%</strong></p>
                      </div>

                      <button
                        onClick={() => onSelectIncident(inc)}
                        className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-2 py-1 text-xs font-bold text-white shadow-md hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center justify-center gap-1"
                      >
                        <Navigation className="h-3 w-3" />
                        <span>Inspect Action Plan</span>
                      </button>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

        {/* Resources Layer */}
        {(activeLayer === 'ALL' || activeLayer === 'RESOURCES') &&
          resources.map((res) => {
            const isDispatched = res.status === 'DISPATCHED';
            const color = isDispatched ? '#a855f7' : '#10b981';
            let emoji = '🚜';
            if (res.type === 'pump') emoji = '🌊';
            if (res.type === 'water_tanker') emoji = '💧';
            if (res.type === 'medical_unit') emoji = '🚑';
            if (res.type === 'rescue_boat') emoji = '🚤';
            if (res.type === 'leak_gang') emoji = '🛠️';

            return (
              <Marker
                key={res.id}
                position={[res.lat, res.lng]}
                icon={createResourceIcon(color, emoji, isDispatched)}
              >
                <Popup>
                  <div className="p-1 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-white">{res.name}</strong>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isDispatched ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mb-0.5">Capacity: {res.capacity}</p>
                    <p className="text-[11px] text-slate-400">Current Station: {res.current_ward}</p>
                    <p className="text-[11px] text-cyan-300 font-semibold mt-1">
                      Deployment ETA: ~{res.eta_minutes} mins
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

      </MapContainer>
    </div>
  );
}
