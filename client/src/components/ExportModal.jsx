import React, { useState } from 'react';
import { Download, ExternalLink, X, MapPin, Zap, Check } from 'lucide-react';

export default function ExportModal({
  routeData,
  stops,
  sourceName,
  destName,
  vehicleName,
  onClose
}) {
  const [downloaded, setDownloaded] = useState(false);

  if (!routeData) return null;

  // Launch Google Maps multi-waypoint URL
  const handleOpenGoogleMaps = () => {
    const origin = encodeURIComponent(sourceName || 'Origin');
    const destination = encodeURIComponent(destName || 'Destination');
    
    let waypointsStr = '';
    if (stops && stops.length > 0) {
      waypointsStr = '&waypoints=' + stops.map(s => `${s.lat},${s.lng}`).join('|');
    }

    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsStr}&travelmode=driving`;
    window.open(gmapsUrl, '_blank');
  };

  // Trigger Print / Export PDF
  const handleExportPdf = () => {
    setDownloaded(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div 
      className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white text-zinc-950 rounded-xl font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Export Trip Itinerary</h3>
              <p className="text-[10px] text-zinc-400 font-medium">PDF Export & Google Maps Launcher</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
            <div className="text-xs font-bold text-white truncate">
              {sourceName} ➔ {destName}
            </div>
            <div className="text-[11px] text-zinc-400">
              Vehicle: <span className="text-white font-semibold">{vehicleName}</span> • Distance: <span className="text-white font-semibold">{routeData.distanceKm} km</span>
            </div>
            <div className="text-[10px] text-zinc-500">
              Recommended Stops: {stops.length} Fast Charging Stations
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleExportPdf}
              className="w-full py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-2 border border-white"
            >
              {downloaded ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
              <span>{downloaded ? 'Preparing Printable PDF...' : 'Download / Print PDF Itinerary'}</span>
            </button>

            <button
              onClick={handleOpenGoogleMaps}
              className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white border border-zinc-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-4 h-4 text-blue-400" />
              <span>Launch in Google Maps (Multi-Stop)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
