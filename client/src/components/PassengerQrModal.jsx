import React, { useState } from 'react';
import { Smartphone, X, Copy, Check, Wifi } from 'lucide-react';

export default function PassengerQrModal({ routeData, vehicleName, onClose }) {
  const [copied, setCopied] = useState(false);

  const hostname = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? '192.168.0.131' 
    : window.location.hostname;
  
  const port = window.location.port || '3000';
  const mobileUrl = `http://${hostname}:${port}/`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(mobileUrl)}&color=09090b&bgcolor=ffffff`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        
        {/* Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-left">
            <div className="p-2 bg-white text-zinc-950 rounded-xl font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Mobile Passenger Pass</h3>
              <p className="text-[10px] text-zinc-400 font-medium">100% Real Phone Scanner Ready</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real QR Code */}
        <div className="p-5 space-y-4 flex flex-col items-center">
          
          <div className="p-3 bg-white rounded-2xl border-4 border-white shadow-xl">
            <img 
              src={qrImageUrl} 
              alt="Scan QR Code" 
              className="w-44 h-44 rounded-xl object-contain"
            />
          </div>

          <div className="space-y-1 text-center">
            <div className="text-xs font-bold text-zinc-200 flex items-center justify-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-white" />
              <span>Connect phone to same Wi-Fi / Hotspot</span>
            </div>
            <div className="text-[11px] text-zinc-400">
              Scan with your iPhone or Android Camera to open Charge Nova on your phone!
            </div>
          </div>

          <div className="w-full bg-zinc-950 p-2 rounded-xl border border-zinc-800 flex items-center justify-between space-x-2">
            <span className="text-xs font-mono font-bold text-white truncate pl-1">
              {mobileUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 border border-zinc-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
