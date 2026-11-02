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
      vehicle: vehicleName || 'Tata Nexon EV',
      mode: 'passenger'
    });
    mobileUrl = `http://${activeIp}:${port}/?${params.toString()}`;
  }

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(mobileUrl)}&margin=12&color=0f172a&bgcolor=ffffff`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 font-sans z-[99999]"
    >
      <div className="bg-white border border-surface-border rounded-2xl max-w-sm w-full max-h-[94vh] overflow-y-auto shadow-card-lg text-ink">
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 p-3.5 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center space-x-2 text-left">
            <div className="p-1.5 bg-primary/10 text-primary rounded-xl border border-primary/20 font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Mobile Passenger Pass</h3>
              <p className="text-[11px] text-ink-secondary">Live Route & Nav on your Phone</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-ink-tertiary hover:text-ink hover:bg-surface-subtle rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 flex flex-col items-center">
          
          {/* QR Code Container */}
          <div className="p-2.5 bg-surface-muted rounded-2xl border border-surface-border shadow-card flex flex-col items-center relative group">
            <img 
              src={qrImageUrl} 
              alt="Scan to open on phone" 
              className="w-40 h-40 rounded-xl object-contain bg-white p-1.5 border border-surface-border shadow-card"
            />
            <div className="mt-2 text-[10px] font-semibold text-success flex items-center gap-1.5 bg-success/10 px-2.5 py-0.5 rounded-full border border-success/20">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span>Ready for Camera Scan</span>
            </div>
          </div>

          {/* Wi-Fi & Network Indicator */}
          <div className="w-full bg-surface-muted border border-surface-border rounded-xl p-3 text-left space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Wifi className="w-4 h-4 text-primary" />
                <span>Wi-Fi IP:</span>
                <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {activeIp}
                </span>
              </div>
              <button
                onClick={() => setShowNetworkSettings(!showNetworkSettings)}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>{showNetworkSettings ? 'Hide' : 'Change IP'}</span>
              </button>
            </div>

            {/* Network Settings Dropdown */}
            {showNetworkSettings && (
              <div className="pt-2 border-t border-surface-border space-y-2">
                <div className="text-[11px] text-ink-secondary">
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
                        className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between border transition-all cursor-pointer ${
                          detectedIp === iface.ip && !customIp 
                            ? 'bg-primary/10 border-primary text-primary font-semibold' 
                            : 'bg-white border-surface-border text-ink hover:bg-surface-subtle'
                        }`}
                      >
                        <span className="truncate">{iface.name}</span>
                        <span className="font-mono text-[10px] text-ink-secondary">{iface.ip}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-1">
                  <input
                    type="text"
                    value={customIp}
                    onChange={(e) => setCustomIp(e.target.value)}
                    placeholder="Or enter custom IP (e.g. 192.168.1.100)"
                    className="w-full px-2 py-1 text-xs border border-surface-border rounded bg-white text-ink placeholder-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sync Route Checkbox */}
          <label className="flex items-center space-x-2 text-xs text-ink-secondary cursor-pointer self-start">
            <input 
              type="checkbox" 
              checked={syncRoute} 
              onChange={(e) => setSyncRoute(e.target.checked)}
              className="rounded text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
            />
            <span>Include current route & vehicle ({vehicleName})</span>
          </label>

          {/* Direct URL Link Box */}
          <div className="w-full space-y-1 text-left">
            <div className="text-[10px] font-bold text-ink-secondary uppercase tracking-wider">Mobile Companion Link</div>
            <div className="flex items-center space-x-1.5">
              <input 
                type="text" 
                readOnly 
                value={mobileUrl} 
                className="flex-1 bg-surface-muted border border-surface-border rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-ink-secondary select-all focus:outline-none"
              />
              <button 
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-primary hover:bg-primary-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-card shrink-0"
                title="Copy Mobile URL"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="w-full text-left text-[11px] text-ink-secondary space-y-1 border-t border-surface-border pt-3">
            <div className="font-bold text-ink">How to connect:</div>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Connect your phone to the same Wi-Fi or phone hotspot.</li>
              <li>Open your phone's default Camera app.</li>
              <li>Point camera at the QR code and tap the link banner.</li>
            </ol>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-surface-subtle hover:bg-slate-200 text-ink rounded-full text-xs font-semibold border border-surface-border cursor-pointer transition-colors"
          >
            Done
          </button>

        </div>

      </div>
    </div>
  );
}
