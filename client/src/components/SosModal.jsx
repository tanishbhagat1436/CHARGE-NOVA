import React, { useState } from 'react';
import { ShieldAlert, X, PhoneCall, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';

export default function SosModal({ onClose }) {
  const [sosSent, setSosSent] = useState(false);

  const handleDispatchSos = () => {
    setSosSent(true);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans z-[99999]"
    >
      <div className="bg-white border border-surface-border rounded-2xl max-w-sm w-full overflow-hidden shadow-card-lg text-ink">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-danger/10 text-danger rounded-xl border border-danger/20 font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">EV Emergency Assistance</h3>
              <p className="text-[10px] text-danger font-semibold">24x7 Highway RSA Helpline</p>
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
          
          <div className="bg-danger/5 p-3.5 rounded-xl border border-danger/20 space-y-1">
            <div className="text-xs font-bold text-danger flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-danger" />
              <span>National Highway EV Helpline</span>
            </div>
            <div className="text-base font-mono font-bold text-danger">
              1800-209-8282 / 112
            </div>
            <p className="text-[10px] text-ink-secondary">
              Flat-bed tow trucks, mobile EV charger vans, and roadside battery assistance available 24x7 across all major Indian highways.
            </p>
          </div>

          {!sosSent ? (
            <button
              onClick={handleDispatchSos}
              className="w-full py-2.5 bg-danger hover:bg-red-700 text-white font-semibold rounded-full text-xs transition-all flex items-center justify-center space-x-1.5 shadow-card cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Broadcast Live GPS SOS Request</span>
            </button>
          ) : (
            <div className="p-3 bg-success/10 border border-success/20 rounded-xl text-center space-y-1">
              <div className="text-xs font-bold text-success flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4 text-success" /> SOS Signal Sent!
              </div>
              <div className="text-[10px] text-ink-secondary">
                Nearest RSA towing vehicle notified with your live GPS location.
              </div>
            </div>
          )}

          <div className="pt-1">
            <button
              onClick={onClose}
              className="w-full py-2 bg-white hover:bg-surface-subtle text-ink-secondary rounded-full text-xs font-semibold border border-surface-border cursor-pointer transition-colors"
            >
              Close Emergency Help
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
