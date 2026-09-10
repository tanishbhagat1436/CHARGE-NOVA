import React from 'react';
import { Play, Square, Navigation, Gauge, BatteryCharging, Compass } from 'lucide-react';

export default function SimulatorControl({
  isNavigating,
  onStartNavigation,
  onExitNavigation,
  currentSoc,
  currentDistance,
  totalDistance,
  vehicleName,
  autoFollowCar,
  setAutoFollowCar,
  nextStop,
  liveSpeed
}) {
  return (
    <div 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 font-sans max-w-xl w-full px-4 animate-in slide-in-from-bottom-4 duration-300"
      style={{ zIndex: 9990 }}
    >
      <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-2xl shadow-2xl space-y-2.5">
        
        {/* Top Status Line */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-xl border ${isNavigating ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isNavigating ? 'LIVE NAVIGATION ACTIVE' : 'ROUTE PLAN OVERVIEW'}
              </div>
              <div className="text-xs font-bold text-slate-100 truncate max-w-[200px]">
                {vehicleName}
              </div>
            </div>
          </div>

          {/* Start / Exit Navigation Action Button */}
          {!isNavigating ? (
            <button
              onClick={onStartNavigation}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-slate-100 font-bold text-xs rounded-xl shadow-md border border-emerald-700 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START LIVE NAVIGATION</span>
            </button>
          ) : (
            <button
              onClick={onExitNavigation}
              className="px-3.5 py-1.5 bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 border border-rose-700 font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>EXIT NAV</span>
            </button>
          )}

        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          
          {/* Speedometer */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="text-[9px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
              <Gauge className="w-3 h-3 text-emerald-400" /> Speed
            </div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              {liveSpeed} <span className="text-[9px] font-normal text-slate-400">km/h</span>
            </div>
          </div>

          {/* Odometer */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="text-[9px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
              <Compass className="w-3 h-3 text-blue-400" /> Distance
            </div>
            <div className="text-base font-bold text-blue-400 font-mono mt-0.5">
              {currentDistance} <span className="text-[9px] font-normal text-slate-400">/ {totalDistance} km</span>
            </div>
          </div>

          {/* Battery SOC */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="text-[9px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
              <BatteryCharging className="w-3 h-3 text-emerald-400" /> Battery SOC
            </div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              {currentSoc}%
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
