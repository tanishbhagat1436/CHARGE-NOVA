import React, { useState } from 'react';
import { Download, ExternalLink, X, MapPin, Zap, Check, FileCode, Car } from 'lucide-react';
import { downloadGpxFile } from '../utils/gpxGenerator';

export default function ExportModal({
  routeData,
  stops,
  sourceName,
  destName,
  vehicleName,
  waypoints = [],
  onClose
}) {
  const [downloaded, setDownloaded] = useState(false);
  const [gpxDownloaded, setGpxDownloaded] = useState(false);

  if (!routeData) return null;

  // Handle GPX Download
  const handleDownloadGpx = () => {
    downloadGpxFile({
      routeData,
      stops,
      sourceName,
      destName,
      waypoints,
      vehicleName
    });
    setGpxDownloaded(true);
    setTimeout(() => setGpxDownloaded(false), 3000);
  };

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
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white border border-[#dadce0] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-[#202124]">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-[#dadce0] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-50 text-[#1a73e8] rounded-xl border border-blue-200 font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#202124]">Export Trip Itinerary</h3>
              <p className="text-[10px] text-[#5f6368]">PDF Document & Google Maps Export</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-[#5f6368] hover:text-[#202124] rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          
          <div className="bg-[#f8f9fa] p-3.5 rounded-xl border border-[#dadce0] space-y-1">
            <div className="text-xs font-bold text-[#202124] truncate">
              {sourceName} ➔ {destName}
            </div>
            <div className="text-[11px] text-[#5f6368]">
              Vehicle: <span className="text-[#202124] font-semibold">{vehicleName}</span> • Distance: <span className="text-[#1a73e8] font-bold">{routeData.distanceKm} km</span>
            </div>
            <div className="text-[10px] text-[#5f6368]">
              Recommended Stops: {stops.length} Fast Charging Stations
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {/* GPX Car Infotainment Button */}
            <button
              onClick={handleDownloadGpx}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full text-xs transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              {gpxDownloaded ? <Check className="w-4 h-4 text-white" /> : <FileCode className="w-4 h-4" />}
              <span>{gpxDownloaded ? 'GPX File Downloaded!' : 'Download .GPX File (Car Infotainment)'}</span>
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#5f6368]">
              <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Android Auto</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Apple CarPlay</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Garmin</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">OSMAnd</span>
            </div>

            <button
              onClick={handleExportPdf}
              className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold rounded-full text-xs transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              {downloaded ? <Check className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
              <span>{downloaded ? 'Opening Print Dialog...' : 'Download / Print PDF Itinerary'}</span>
            </button>

            <button
              onClick={handleOpenGoogleMaps}
              className="w-full py-2.5 bg-white hover:bg-slate-50 text-[#1a73e8] border border-[#dadce0] font-semibold rounded-full text-xs transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-[#1a73e8]" />
              <span>Launch in Google Maps (Multi-Stop)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
