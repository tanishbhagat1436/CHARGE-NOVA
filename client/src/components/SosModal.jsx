import React, { useState } from 'react';
import { ShieldAlert, X, PhoneCall, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';

export default function SosModal({ onClose }) {
  const [sosSent, setSosSent] = useState(false);

  const handleDispatchSos = () => {
    setSosSent(true);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white border border-[#dadce0] rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-[#202124]">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-[#dadce0] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-red-50 text-[#d93025] rounded-xl border border-red-200 font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#202124]">EV Emergency Assistance</h3>
              <p className="text-[10px] text-[#d93025] font-semibold">24x7 Highway RSA Helpline</p>
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
          
          <div className="bg-red-50 p-3.5 rounded-xl border border-red-200 space-y-1">
            <div className="text-xs font-bold text-[#d93025] flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#d93025]" />
              <span>National Highway EV Helpline</span>
            </div>
            <div className="text-base font-mono font-bold text-[#d93025]">
              1800-209-8282 / 112
            </div>
            <p className="text-[10px] text-[#5f6368]">
              Flat-bed tow trucks, mobile EV charger vans, and roadside battery assistance available 24x7.
            </p>
          </div>

          {!sosSent ? (
            <button
              onClick={handleDispatchSos}
              className="w-full py-2.5 bg-[#d93025] hover:bg-red-700 text-white font-semibold rounded-full text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Broadcast Live GPS SOS Request</span>
            </button>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
              <div className="text-xs font-bold text-[#137333] flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4 text-[#1e8e3e]" /> SOS Signal Sent!
              </div>
              <div className="text-[10px] text-[#5f6368]">
                Nearest RSA towing vehicle notified with your live GPS location.
              </div>
            </div>
          )}

          <div className="pt-1">
            <button
              onClick={onClose}
              className="w-full py-2 bg-white hover:bg-slate-50 text-[#5f6368] rounded-full text-xs font-semibold border border-[#dadce0]"
            >
              Close Emergency Help
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
