import React from 'react';
import { Activity, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function TrafficLegend({ totalDelayMins, showTraffic, setShowTraffic, onClose }) {
  return (
    <div 
      className="fixed top-20 right-4 font-sans max-w-xs w-72 animate-in slide-in-from-top-2 duration-200"
      style={{ zIndex: 9990 }}
    >
      <div className="bg-zinc-900 border border-zinc-700 text-white rounded-2xl p-3 shadow-2xl space-y-2">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-white text-zinc-950 rounded-lg">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">TomTom Live Traffic</h3>
              <p className="text-[9px] text-zinc-400">100% Real Road Speed Data</p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white bg-zinc-950 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Delay Banner */}
        <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Highway Live Delay</span>
          {totalDelayMins > 0 ? (
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> +{totalDelayMins} min delay
            </span>
          ) : (
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Smooth Flow
            </span>
          )}
        </div>

        {/* Color Legend */}
        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
          <div className="flex items-center space-x-1.5 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-zinc-300">Smooth (Free)</span>
          </div>
          <div className="flex items-center space-x-1.5 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-zinc-300">Slow Flow</span>
          </div>
          <div className="flex items-center space-x-1.5 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span className="text-zinc-300">Heavy Jam</span>
          </div>
          <div className="flex items-center space-x-1.5 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-950"></span>
            <span className="text-zinc-300">Gridlock</span>
          </div>
        </div>

      </div>
    </div>
  );
}
