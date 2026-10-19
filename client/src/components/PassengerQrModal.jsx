import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  X, 
  Copy, 
  Check, 
  Wifi, 
  ExternalLink, 
  RefreshCw, 
  Settings2, 
  Compass, 
  Car,
  ChevronDown
} from 'lucide-react';
import axios from 'axios';
import { getApiBaseUrl } from '../services/apiConfig';

export default function PassengerQrModal({ 
  routeData, 
  sourceLocation, 
  destLocation, 
  vehicleName, 
  onClose 
}) {
  const [copied, setCopied] = useState(false);
  const [detectedIp, setDetectedIp] = useState('172.18.103.14');
  const [availableInterfaces, setAvailableInterfaces] = useState([]);
  const [showNetworkSettings, setShowNetworkSettings] = useState(false);
  const [syncRoute, setSyncRoute] = useState(true);
  const [customIp, setCustomIp] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  const port = window.location.port || '3000';

  // Determine current hostname
  const currentHost = window.location.hostname;
  const isAlreadyOnLanIp = currentHost !== 'localhost' && currentHost !== '127.0.0.1';

  // Fetch local network IP from backend
  const fetchNetworkInfo = async () => {
    setIsDetecting(true);
    try {
      if (isAlreadyOnLanIp) {
        setDetectedIp(currentHost);
        setIsDetecting(false);
        return;
      }

      const response = await axios.get(`${getApiBaseUrl()}/api/network-info`, { timeout: 3000 });
      if (response.data?.ip) {
        setDetectedIp(response.data.ip);
      }
      if (response.data?.allInterfaces) {
        setAvailableInterfaces(response.data.allInterfaces);
      }
    } catch (err) {
      console.warn('Network auto-detection fallback:', err.message);
      // Fallback to active Wi-Fi address
      setDetectedIp('172.18.103.14');
    } finally {
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    fetchNetworkInfo();
  }, []);

  const activeIp = customIp.trim() || detectedIp;

  // Build target mobile URL
  let mobileUrl = `http://${activeIp}:${port}/`;

  if (syncRoute && sourceLocation?.lat && destLocation?.lat) {
    const params = new URLSearchParams({
      view: 'planner',
      src: sourceLocation.displayName || 'Origin',
      dst: destLocation.displayName || 'Destination',
      srcLat: sourceLocation.lat.toString(),
      srcLng: sourceLocation.lng.toString(),
      dstLat: destLocation.lat.toString(),
      dstLng: destLocation.lng.toString(),
      vehicle: vehicleName || 'Tata Nexon EV'
    });
    mobileUrl = `http://${activeIp}:${port}/?${params.toString()}`;
  }

  // QR Code URL (high resolution, high error tolerance)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(mobileUrl)}&margin=12&color=202124&bgcolor=ffffff`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 font-sans animate-in fade-in duration-150"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white border border-[#dadce0] rounded-2xl max-w-sm w-full max-h-[94vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 text-[#202124] custom-scrollbar">
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 p-3.5 border-b border-[#dadce0] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-left">
            <div className="p-1.5 bg-blue-50 text-[#1a73e8] rounded-xl border border-blue-200">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#202124]">Mobile Passenger Pass</h3>
              <p className="text-[11px] text-[#5f6368]">Live Route & Nav on your Phone</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#5f6368] hover:text-[#202124] rounded-full hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 flex flex-col items-center">
          
          {/* QR Code Container with Google Maps badge */}
          <div className="p-2.5 bg-[#f8f9fa] rounded-2xl border border-[#dadce0] shadow-sm flex flex-col items-center relative group">
            <img 
              src={qrImageUrl} 
              alt="Scan to open on phone" 
              className="w-40 h-40 rounded-xl object-contain bg-white p-1.5 border border-slate-200 shadow-sm"
            />
            <div className="mt-2 text-[10px] font-semibold text-[#1e8e3e] flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e] animate-pulse"></span>
              <span>Ready for Camera Scan</span>
            </div>
          </div>

          {/* Wi-Fi & Network Indicator */}
          <div className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-3 text-left space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#202124]">
                <Wifi className="w-4 h-4 text-[#1a73e8]" />
                <span>Wi-Fi IP:</span>
                <span className="font-mono text-[#1a73e8] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {activeIp}
                </span>
              </div>
              <button
                onClick={() => setShowNetworkSettings(!showNetworkSettings)}
                className="text-[11px] text-[#1a73e8] hover:underline flex items-center gap-1 font-medium"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>{showNetworkSettings ? 'Hide' : 'Change IP'}</span>
              </button>
            </div>

            {/* Network Settings Dropdown */}
            {showNetworkSettings && (
              <div className="pt-2 border-t border-[#dadce0] space-y-2 animate-in fade-in duration-150">
                <div className="text-[11px] text-[#5f6368]">
                  Select the Wi-Fi or mobile hotspot adapter your phone is connected to:
                </div>
                
                {availableInterfaces.length > 0 && (
                  <div className="space-y-1">
                    {availableInterfaces.map((iface, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCustomIp('');
                          setDetectedIp(iface.ip);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between border transition-all ${
                          detectedIp === iface.ip && !customIp 
                            ? 'bg-blue-50 border-[#1a73e8] text-[#1a73e8] font-semibold' 
                            : 'bg-white border-[#dadce0] text-[#202124] hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{iface.interface}</span>
                        <span className="font-mono text-[11px] text-[#5f6368]">{iface.ip}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Or type custom IP (e.g. 192.168.1.5)"
                    value={customIp}
                    onChange={(e) => setCustomIp(e.target.value)}
                    className="flex-1 text-xs px-2.5 py-1.5 border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8] font-mono"
                  />
                  <button
                    onClick={fetchNetworkInfo}
                    className="p-1.5 text-[#5f6368] hover:text-[#1a73e8] border border-[#dadce0] rounded-lg hover:bg-white transition-colors"
                    title="Refresh detection"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Sync Route Checkbox if a route exists */}
            {sourceLocation?.displayName && destLocation?.displayName && (
              <label className="flex items-center gap-2 pt-1 text-xs text-[#202124] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={syncRoute}
                  onChange={(e) => setSyncRoute(e.target.checked)}
                  className="rounded text-[#1a73e8] focus:ring-[#1a73e8]"
                />
                <span className="flex items-center gap-1 font-medium">
                  <Compass className="w-3.5 h-3.5 text-[#1a73e8]" />
                  <span>Sync active route: </span>
                  <span className="text-[#5f6368] font-normal truncate max-w-[200px]">
                    {sourceLocation.displayName.split(',')[0]} ➔ {destLocation.displayName.split(',')[0]}
                  </span>
                </span>
              </label>
            )}
          </div>

          {/* Quick Copy & Test URL Bar */}
          <div className="w-full bg-[#f8f9fa] p-2 rounded-xl border border-[#dadce0] flex items-center justify-between space-x-2">
            <span className="text-xs font-mono font-medium text-[#1a73e8] truncate pl-1" title={mobileUrl}>
              {mobileUrl}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#202124] rounded-lg text-xs font-semibold transition-all flex items-center gap-1 border border-[#dadce0] shadow-sm"
                title="Copy link to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#1e8e3e]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <a
                href={mobileUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 bg-white hover:bg-slate-100 text-[#5f6368] hover:text-[#1a73e8] rounded-lg border border-[#dadce0] shadow-sm transition-all"
                title="Open in new tab to test"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Instructions */}
          <div className="w-full text-left space-y-1.5 bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-[11px] text-[#3c4043]">
            <div className="font-bold text-[#1a73e8] flex items-center gap-1 text-xs">
              <span>Quick 3-Step Guide:</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-[#1a73e8]">1.</span>
              <span>Ensure your phone is connected to this laptop's Wi-Fi network or hotspot.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-[#1a73e8]">2.</span>
              <span>Open the Camera app on iPhone or Android and point it at the QR code.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-[#1a73e8]">3.</span>
              <span>Tap the yellow pop-up banner to monitor the trip live as a passenger!</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
