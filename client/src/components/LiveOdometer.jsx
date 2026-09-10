import React from 'react';
import { Gauge, BatteryCharging, Navigation, MapPin, Compass, Eye } from 'lucide-react';

export default function LiveOdometer({
  distanceDrivenKm,
  totalDistanceKm,
  currentSoc,
  nextStop,
  autoFollowCar,
  setAutoFollowCar,
  currentSpeed
}) {
  const remainingKm = Math.max(0, Math.round((totalDistanceKm - distanceDrivenKm) * 10) / 10);
  const distanceToNextStop = nextStop
    ? Math.max(0, Math.round((nextStop.distanceFromStartKm - distanceDrivenKm) * 10) / 10)
    : null;

  return (
    <div className="absolute bottom-6 right-6 z-30 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-4 rounded-3xl shadow-2xl max-w-xs w-full font-sans">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Live Drive Tracker</div>
            <div className="text-xs font-bold text-slate-100">Highway Odometer</div>
          </div>
        </div>

        {/* Camera Lock Toggle */}
        <button
          onClick={() => setAutoFollowCar(!autoFollowCar)}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-xl flex items-center gap-1 transition-all border ${
            autoFollowCar
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
              : 'bg-slate-950 text-slate-400 border-slate-800'
          }`}
          title="Toggle Auto Camera Center on EV Car"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{autoFollowCar ? 'Follow' : 'Free'}</span>
        </button>
      </div>

      {/* Main Odometer Counter */}
      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 mb-3 space-y-1">
        <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex justify-between">
          <span>Distance Driven</span>
          <span className="text-teal-400">{remainingKm} km left</span>
        </div>
        <div className="text-2xl font-black text-emerald-400 font-mono flex items-baseline justify-between">
          <span>{distanceDrivenKm} <span className="text-xs text-slate-400 font-sans">km</span></span>
          <span className="text-xs text-slate-400 font-normal font-sans">of {totalDistanceKm} km</span>
        </div>
      </div>

      {/* Next Stop Countdown */}
      {nextStop && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl mb-3 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 truncate">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="truncate">
              <div className="font-bold text-amber-400 truncate">{nextStop.name}</div>
              <div className="text-[10px] text-slate-400">Next Charge Halt</div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-extrabold text-amber-300 font-mono">{distanceToNextStop} km</div>
          </div>
        </div>
      )}

      {/* Battery SOC Level */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-400 flex items-center gap-1">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" /> Battery SOC
          </span>
          <span className={`font-mono ${currentSoc <= 15 ? 'text-rose-400 animate-pulse font-extrabold' : 'text-emerald-400'}`}>
            {currentSoc}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-150 ${
              currentSoc <= 15 ? 'bg-rose-500' : currentSoc <= 30 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${currentSoc}%` }}
          ></div>
        </div>
      </div>

    </div>
  );
}
