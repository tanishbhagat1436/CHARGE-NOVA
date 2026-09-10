import React from 'react';
import { BatteryCharging, X, ShieldCheck, Activity, Award } from 'lucide-react';

export default function BatteryHealthModal({ vehicle, onClose }) {
  return (
    <div 
      className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white text-zinc-950 rounded-xl font-bold">
              <BatteryCharging className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Battery State of Health (SOH)</h3>
              <p className="text-[10px] text-zinc-400 font-medium">Degradation Predictor</p>
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
          
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-white">
              <span>{vehicle.name}</span>
              <span className="text-emerald-400 font-mono">98.4% SOH</span>
            </div>

            <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
              <div className="bg-white h-full rounded-full w-[98%]"></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
              <div className="p-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="text-zinc-400 font-semibold">Battery Capacity</div>
                <div className="text-xs font-bold text-white font-mono mt-0.5">{vehicle.battery} kWh</div>
              </div>

              <div className="p-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="text-zinc-400 font-semibold">Est. Cycle Degradation</div>
                <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">&lt; 0.8% / year</div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl text-xs transition-all border border-white"
          >
            Close Health Predictor
          </button>

        </div>

      </div>
    </div>
  );
}
