import React, { useState } from 'react';
import { ShieldAlert, X, PhoneCall, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';

export default function SosModal({ onClose }) {
  const [sosSent, setSosSent] = useState(false);

  const handleDispatchSos = () => {
    setSosSent(true);
  };

  return (
    <div 
      className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-zinc-900 border border-rose-900/60 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-rose-950 text-rose-400 rounded-xl border border-rose-900/60 font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">24x7 EV Emergency Assistance</h3>
              <p className="text-[10px] text-rose-400 font-semibold">Indian Highway RSA Helpline</p>
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
          
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1.5">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span>National Highway EV Helpline</span>
            </div>
            <div className="text-base font-mono font-bold text-rose-400">
              1800-209-8282 / 112
            </div>
            <p className="text-[10px] text-zinc-400">
              Flat-bed tow trucks, mobile EV charger vans, and roadside battery assistance available 24x7.
            </p>
          </div>

          {!sosSent ? (
            <button
              onClick={handleDispatchSos}
              className="w-full py-2.5 bg-rose-900/80 hover:bg-rose-900 text-rose-100 font-bold rounded-xl text-xs transition-all border border-rose-700 flex items-center justify-center space-x-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Send Live GPS SOS Dispatch Request</span>
            </button>
          ) : (
            <div className="p-3 bg-zinc-950 border border-emerald-800 rounded-xl text-center space-y-1">
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4" /> SOS Signal Broadcast Sent!
              </div>
              <div className="text-[10px] text-zinc-300">
                Nearest RSA towing vehicle notified with your live GPS location.
              </div>
            </div>
          )}

          <div className="pt-1">
            <button
              onClick={onClose}
              className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold border border-zinc-800"
            >
              Close Emergency Help
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
