import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Navigation, 
  Gauge, 
  BatteryCharging, 
  Compass, 
  RotateCcw, 
  FastForward,
  Cpu,
  Radio,
  Zap
} from 'lucide-react';

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
  liveSpeed,
  navMode = 'simulator',
  setNavMode = () => {},
  simSpeedMultiplier = 5,
  setSimSpeedMultiplier = () => {},
  isSimPaused = false,
  setIsSimPaused = () => {},
  onResetSimulation = () => {}
}) {
  const progressPercent = totalDistance > 0 
    ? Math.min(100, Math.round((currentDistance / totalDistance) * 100)) 
    : 0;

  return (
    <div 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 font-sans max-w-xl w-full px-4 animate-in slide-in-from-bottom-4 duration-300"
      style={{ zIndex: 9990 }}
    >
      <div className="bg-white border border-[#dadce0] p-3.5 rounded-2xl shadow-xl space-y-2.5 text-[#202124]">
        
        {/* Top Control Line */}
        <div className="flex items-center justify-between border-b border-[#dadce0] pb-2.5 gap-2">
          
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className={`p-1.5 rounded-xl border shrink-0 ${isNavigating ? 'bg-emerald-50 text-[#1e8e3e] border-emerald-200' : 'bg-blue-50 text-[#1a73e8] border-blue-200'}`}>
              <Navigation className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#5f6368] flex items-center gap-1.5">
                <span>{isNavigating ? (navMode === 'simulator' ? 'VIRTUAL DRIVE SIMULATOR' : 'HARDWARE GPS LIVE') : 'ROUTE PLAN OVERVIEW'}</span>
                {isNavigating && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e] animate-pulse"></span>
                )}
              </div>
              <div className="text-xs font-bold text-[#202124] truncate">
                {vehicleName}
              </div>
            </div>
          </div>

          {/* Right Action & Mode Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            
            {/* Mode Switch Pill: Simulator vs GPS */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-[#dadce0] text-[11px]">
              <button
                onClick={() => setNavMode('simulator')}
                className={`px-2 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                  navMode === 'simulator'
                    ? 'bg-white text-[#1a73e8] shadow-xs font-semibold'
                    : 'text-[#5f6368] hover:text-[#202124]'
                }`}
                title="Virtual Drive Simulator (Smooth automated drive along polyline)"
              >
                <Cpu className="w-3 h-3" />
                <span className="hidden sm:inline">Sim</span>
              </button>
              <button
                onClick={() => setNavMode('deviceGps')}
                className={`px-2 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                  navMode === 'deviceGps'
                    ? 'bg-white text-[#1e8e3e] shadow-xs font-semibold'
                    : 'text-[#5f6368] hover:text-[#202124]'
                }`}
                title="Real-Time Hardware GPS Mode (uses device motion in car)"
              >
                <Radio className="w-3 h-3" />
                <span className="hidden sm:inline">GPS</span>
              </button>
            </div>

            {/* Start / Exit Navigation Action Button */}
            {!isNavigating ? (
              <button
                onClick={onStartNavigation}
                className="px-3.5 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs rounded-full shadow-sm hover:shadow transition-all flex items-center space-x-1 cursor-pointer active:scale-95"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>START NAV</span>
              </button>
            ) : (
              <button
                onClick={onExitNavigation}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#d93025] border border-red-200 font-semibold text-xs rounded-full transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>EXIT</span>
              </button>
            )}

          </div>

        </div>

        {/* Simulator Cockpit Controls (Visible When Navigating in Simulator Mode) */}
        {isNavigating && navMode === 'simulator' && (
          <div className="flex items-center justify-between bg-blue-50/60 p-2 rounded-xl border border-blue-100 text-xs">
            
            {/* Play / Pause & Restart */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSimPaused(!isSimPaused)}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 border transition-all ${
                  isSimPaused
                    ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
                    : 'bg-white text-[#202124] border-[#dadce0] hover:bg-slate-50'
                }`}
              >
                {isSimPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
                <span>{isSimPaused ? 'Resume' : 'Pause'}</span>
              </button>
              
              <button
                onClick={onResetSimulation}
                className="p-1.5 bg-white text-[#5f6368] hover:text-[#202124] border border-[#dadce0] rounded-lg hover:bg-slate-50 transition-colors"
                title="Restart simulation from beginning"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Speed Multiplier Pills */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#5f6368] font-bold uppercase mr-1 hidden sm:inline">Speed:</span>
              {[1, 5, 15, 30].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimSpeedMultiplier(spd)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all border ${
                    simSpeedMultiplier === spd
                      ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
                      : 'bg-white text-[#5f6368] border-[#dadce0] hover:bg-slate-50'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

          </div>
        )}

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

        {/* Progress Bar & Next Charging Stop Info */}
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between text-[10px] text-[#5f6368]">
            <span className="font-semibold text-[#202124]">{progressPercent}% Completed</span>
            {nextStop ? (
              <span className="flex items-center gap-1 font-medium text-[#1e8e3e]">
                <Zap className="w-3 h-3 fill-current text-[#1e8e3e]" />
                <span>Next Charge: {nextStop.name.split(',')[0]} (Km {nextStop.distanceFromStartKm})</span>
              </span>
            ) : (
              <span>Destination Approaching</span>
            )}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
            <div 
              className="bg-[#1a73e8] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
