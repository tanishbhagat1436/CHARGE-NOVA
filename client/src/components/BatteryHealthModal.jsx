import React from 'react';
import { BatteryCharging, X, ShieldCheck, Activity, Award } from 'lucide-react';

export default function BatteryHealthModal({ vehicle, onClose }) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans z-[99999]"
    >
      <div className="bg-white border border-surface-border rounded-2xl max-w-sm w-full overflow-hidden shadow-card-lg text-ink">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-success/10 text-success rounded-xl border border-success/20 font-bold">
              <BatteryCharging className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Battery Health (SOH)</h3>
              <p className="text-[10px] text-ink-secondary">Degradation & Chemistry</p>
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
          
          <div className="bg-surface-muted p-3.5 rounded-xl border border-surface-border space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>{vehicle.name}</span>
              <span className="text-success font-mono">98.4% SOH</span>
            </div>

            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-success h-full rounded-full w-[98%]"></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
              <div className="p-2 bg-white rounded-lg border border-surface-border">
                <div className="text-ink-secondary font-semibold">Pack Capacity</div>
                <div className="text-xs font-bold font-mono mt-0.5">{vehicle.battery} kWh</div>
              </div>

              <div className="p-2 bg-white rounded-lg border border-surface-border">
                <div className="text-ink-secondary font-semibold">Annual Degradation</div>
                <div className="text-xs font-bold text-success font-mono mt-0.5">&lt; 0.8% / year</div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-primary hover:bg-primary-700 text-white font-semibold rounded-full text-xs transition-all shadow-card cursor-pointer"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}
