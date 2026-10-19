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
      <div className="bg-white border border-[#dadce0] p-3.5 rounded-2xl shadow-xl space-y-2.5 text-[#202124]">
        
        {/* Top Status Line */}
        <div className="flex items-center justify-between border-b border-[#dadce0] pb-2.5">
          
          <div className="flex items-center space-x-2.5">
            <div className={`p-1.5 rounded-xl border ${isNavigating ? 'bg-emerald-50 text-[#1e8e3e] border-emerald-200' : 'bg-blue-50 text-[#1a73e8] border-blue-200'}`}>
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#5f6368]">
                {isNavigating ? 'LIVE NAVIGATION ACTIVE' : 'ROUTE PLAN OVERVIEW'}
              </div>
              <div className="text-xs font-bold text-[#202124] truncate max-w-[200px]">
                {vehicleName}
              </div>
            </div>
          </div>

          {/* Start / Exit Navigation Action Button */}
          {!isNavigating ? (
            <button
              onClick={onStartNavigation}
              className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs rounded-full shadow-sm hover:shadow transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START NAVIGATION</span>
            </button>
          ) : (
            <button
              onClick={onExitNavigation}
              className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-[#d93025] border border-red-200 font-semibold text-xs rounded-full transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>EXIT NAV</span>
            </button>
          )}

        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          
          {/* Speedometer */}
          <div className="bg-[#f8f9fa] p-2 rounded-xl border border-[#dadce0]">
            <div className="text-[9px] font-bold text-[#5f6368] uppercase flex items-center justify-center gap-1">
              <Gauge className="w-3 h-3 text-[#1e8e3e]" /> Speed
            </div>
            <div className="text-base font-bold text-[#1e8e3e] font-mono mt-0.5">
              {liveSpeed} <span className="text-[9px] font-normal text-[#5f6368]">km/h</span>
            </div>
          </div>

          {/* Odometer */}
          <div className="bg-[#f8f9fa] p-2 rounded-xl border border-[#dadce0]">
            <div className="text-[9px] font-bold text-[#5f6368] uppercase flex items-center justify-center gap-1">
              <Compass className="w-3 h-3 text-[#1a73e8]" /> Distance
            </div>
            <div className="text-base font-bold text-[#1a73e8] font-mono mt-0.5">
              {currentDistance} <span className="text-[9px] font-normal text-[#5f6368]">/ {totalDistance} km</span>
            </div>
          </div>

          {/* Battery SOC */}
          <div className="bg-[#f8f9fa] p-2 rounded-xl border border-[#dadce0]">
            <div className="text-[9px] font-bold text-[#5f6368] uppercase flex items-center justify-center gap-1">
              <BatteryCharging className="w-3 h-3 text-[#1e8e3e]" /> Battery SOC
            </div>
            <div className="text-base font-bold text-[#1e8e3e] font-mono mt-0.5">
              {currentSoc}%
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
