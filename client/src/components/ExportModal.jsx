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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans z-[99999]"
    >
      <div className="bg-white border border-surface-border rounded-2xl max-w-md w-full overflow-hidden shadow-card-lg text-ink">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20 font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Export Trip Itinerary</h3>
              <p className="text-[10px] text-ink-secondary">PDF Document & Google Maps Export</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-ink-tertiary hover:text-ink hover:bg-surface-subtle rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          
          <div className="bg-surface-muted p-3.5 rounded-xl border border-surface-border space-y-1">
            <div className="text-xs font-bold truncate">
              {sourceName} ➔ {destName}
            </div>
            <div className="text-[11px] text-ink-secondary">
              Vehicle: <span className="font-semibold text-ink">{vehicleName}</span> • Distance: <span className="text-primary font-bold">{routeData.distanceKm} km</span>
            </div>
            <div className="text-[10px] text-ink-tertiary">
              Recommended Halts: {stops.length} Fast Charging Stations
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {/* GPX Car Infotainment Button */}
            <button
              onClick={handleDownloadGpx}
              className="w-full py-2.5 px-4 bg-white hover:bg-surface-subtle border border-surface-border text-ink rounded-xl text-xs font-semibold transition-all flex items-center justify-between shadow-card cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Download GPX File</div>
                  <div className="text-[10px] text-ink-secondary">For Car Screen & GPS Dashboards</div>
                </div>
              </div>
              <span className={`text-[11px] font-bold ${gpxDownloaded ? 'text-success' : 'text-primary'}`}>
                {gpxDownloaded ? 'Downloaded ✓' : 'Export .gpx'}
              </span>
            </button>

            {/* Google Maps External Link */}
            <button
              onClick={handleOpenGoogleMaps}
              className="w-full py-2.5 px-4 bg-white hover:bg-surface-subtle border border-surface-border text-ink rounded-xl text-xs font-semibold transition-all flex items-center justify-between shadow-card cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Open in Google Maps</div>
                  <div className="text-[10px] text-ink-secondary">Launches route with charging waypoints</div>
                </div>
              </div>
              <span className="text-[11px] text-primary font-bold">Open App ➔</span>
            </button>

            {/* Print / Save as PDF */}
            <button
              onClick={handleExportPdf}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-card cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloaded ? 'Opening Print Dialog...' : 'Print / Save as PDF'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
