import React from 'react';
import { Activity, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function TrafficLegend({ totalDelayMins, showTraffic, setShowTraffic, onClose }) {
  return (
    <div 
      className="fixed top-20 right-4 font-sans max-w-xs w-72 animate-in slide-in-from-top-2 duration-200"
      style={{ zIndex: 9990 }}
    >
      <div className="bg-white border border-[#dadce0] text-[#202124] rounded-2xl p-3 shadow-xl space-y-2">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dadce0] pb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-blue-50 text-[#1a73e8] rounded-lg border border-blue-200">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#202124]">Traffic Flow</h3>
              <p className="text-[9px] text-[#5f6368]">Live Highway Conditions</p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-[#5f6368] hover:text-[#202124] hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Delay Banner */}
        <div className="p-2 bg-[#f8f9fa] rounded-xl border border-[#dadce0] flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#5f6368] uppercase">Traffic Status</span>
          {totalDelayMins > 0 ? (
            <span className="text-xs font-bold text-[#f9ab00] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> +{totalDelayMins} min delay
            </span>
          ) : (
            <span className="text-xs font-bold text-[#1e8e3e] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Clear Road
            </span>
          )}
        </div>

        {/* Color Legend - Google Maps Colors */}
        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-semibold">
          <div className="flex items-center space-x-1.5 p-1.5 bg-[#f8f9fa] rounded-lg border border-[#dadce0]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8]"></span>
            <span className="text-[#3c4043]">Fast / Clear</span>
          </div>
          <div className="flex items-center space-x-1.5 p-1.5 bg-[#f8f9fa] rounded-lg border border-[#dadce0]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f9ab00]"></span>
            <span className="text-[#3c4043]">Slow Traffic</span>
          </div>
          <div className="flex items-center space-x-1.5 p-1.5 bg-[#f8f9fa] rounded-lg border border-[#dadce0]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d93025]"></span>
            <span className="text-[#3c4043]">Heavy Jam</span>
          </div>
          <div className="flex items-center space-x-1.5 p-1.5 bg-[#f8f9fa] rounded-lg border border-[#dadce0]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#800020]"></span>
            <span className="text-[#3c4043]">Stationary</span>
          </div>
        </div>

      </div>
    </div>
  );
}
