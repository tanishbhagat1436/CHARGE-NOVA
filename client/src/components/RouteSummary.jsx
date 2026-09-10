import React, { useState } from 'react';
import { 
  Compass, 
  Battery, 
  MapPin, 
  Navigation, 
  DollarSign, 
  Leaf, 
  ArrowRight,
  Zap,
  Clock,
  TrendingDown,
  X
} from 'lucide-react';
import CostSavingsWidget from './CostSavingsWidget';

export default function RouteSummary({
  routeData,
  stops,
  totalChargeTimeMins,
  onSelectStation,
  onSelectTurnStep,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('itinerary');

  if (!routeData) return null;

  const totalDistance = routeData.distanceKm;
  const driveTimeMins = routeData.durationMins;
  const totalTripTimeMins = driveTimeMins + totalChargeTimeMins;

  const hours = Math.floor(totalTripTimeMins / 60);
  const mins = totalTripTimeMins % 60;

  return (
    <div 
      className="fixed top-20 right-4 font-sans max-w-xs w-80 animate-in slide-in-from-right-4 duration-300"
      style={{ zIndex: 9990 }}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-110px)]">
        
        {/* Header */}
        <div className="p-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Route Summary</span>
            <h2 className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span>{totalDistance} km</span>
              <span>•</span>
              <span className="text-zinc-300 font-mono">{hours}h {mins}m</span>
            </h2>
          </div>

          <div className="flex items-center space-x-1">
            {/* Tabs Switcher */}
            <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[10px] font-bold">
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`px-2 py-0.5 rounded-md transition-all ${activeTab === 'itinerary' ? 'bg-white text-zinc-950 font-black' : 'text-zinc-400'}`}
              >
                Plan
              </button>
              <button
                onClick={() => setActiveTab('savings')}
                className={`px-2 py-0.5 rounded-md transition-all ${activeTab === 'savings' ? 'bg-white text-zinc-950 font-black' : 'text-zinc-400'}`}
              >
                Savings
              </button>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Itinerary */}
        {activeTab === 'itinerary' && (
          <div className="p-3 overflow-y-auto space-y-3 flex-1 text-xs">
            
            {/* Charging Halts */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-white" /> Recommended Fast Halts ({stops.length})
              </div>

              {stops.length > 0 ? (
                <div className="space-y-1.5">
                  {stops.map((st, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectStation && onSelectStation(st)}
                      className="p-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl cursor-pointer transition-all space-y-1"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white text-xs truncate max-w-[180px]">{st.name}</span>
                        <span className="text-[9px] font-mono text-zinc-300 font-bold">Km {st.distanceFromStartKm}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-zinc-400">
                        <span>{st.power} kW DC Fast</span>
                        <span className="text-white font-bold">Charge ~{st.chargeTimeMins} mins</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 bg-zinc-950 rounded-xl text-[10px] text-zinc-400 border border-zinc-800">
                  Direct drive! Battery range is sufficient for this trip.
                </div>
              )}
            </div>

            {/* Turn Maneuvers */}
            {routeData.steps && routeData.steps.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-zinc-300" /> Turn Directions ({routeData.steps.length})
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {routeData.steps.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => onSelectTurnStep && onSelectTurnStep(step)}
                      className="w-full text-left p-1.5 bg-zinc-950 hover:bg-zinc-800 rounded-xl text-[11px] flex justify-between items-center text-zinc-200 border border-zinc-800 transition-all"
                    >
                      <span className="truncate pr-1 font-medium">{step.instruction}</span>
                      <span className="text-[9px] font-mono text-zinc-400 shrink-0">Km {step.cumulativeKm}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Fuel Savings */}
        {activeTab === 'savings' && (
          <div className="p-3 overflow-y-auto flex-1">
            <CostSavingsWidget distanceKm={totalDistance} />
          </div>
        )}

      </div>
    </div>
  );
}
