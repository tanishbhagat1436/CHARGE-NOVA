import React from 'react';
import { BatteryCharging, X, ShieldCheck, Activity, Award } from 'lucide-react';

export default function BatteryHealthModal({ vehicle, onClose }) {
  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white border border-[#dadce0] rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-[#202124]">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-[#dadce0] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-50 text-[#1e8e3e] rounded-xl border border-emerald-200 font-bold">
              <BatteryCharging className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#202124]">Battery Health (SOH)</h3>
              <p className="text-[10px] text-[#5f6368]">Degradation & Chemistry</p>
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
          
          <div className="bg-[#f8f9fa] p-3.5 rounded-xl border border-[#dadce0] space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-[#202124]">
              <span>{vehicle.name}</span>
              <span className="text-[#1e8e3e] font-mono">98.4% SOH</span>
            </div>

            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-[#1e8e3e] h-full rounded-full w-[98%]"></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
              <div className="p-2 bg-white rounded-lg border border-[#dadce0]">
                <div className="text-[#5f6368] font-semibold">Battery Capacity</div>
                <div className="text-xs font-bold text-[#202124] font-mono mt-0.5">{vehicle.battery} kWh</div>
              </div>

              <div className="p-2 bg-white rounded-lg border border-[#dadce0]">
                <div className="text-[#5f6368] font-semibold">Cycle Degradation</div>
                <div className="text-xs font-bold text-[#1e8e3e] font-mono mt-0.5">&lt; 0.8% / year</div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold rounded-full text-xs transition-all shadow-sm"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}
