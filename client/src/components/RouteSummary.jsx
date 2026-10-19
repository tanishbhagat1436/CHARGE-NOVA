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
      <div className="bg-white border border-[#dadce0] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[calc(100vh-110px)] text-[#202124]">
        
        {/* Header - Google Maps Style */}
        <div className="p-3 bg-white border-b border-[#dadce0] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5f6368]">Trip Overview</span>
            <h2 className="text-xs font-bold text-[#202124] flex items-center gap-1.5 mt-0.5">
              <span className="text-[#1a73e8] font-extrabold">{totalDistance} km</span>
              <span>•</span>
              <span className="text-[#3c4043] font-mono">{hours}h {mins}m</span>
            </h2>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Tabs Switcher */}
            <div className="flex bg-[#f8f9fa] p-0.5 rounded-lg border border-[#dadce0] text-[10px] font-semibold">
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'itinerary' ? 'bg-[#1a73e8] text-white shadow-sm font-bold' : 'text-[#5f6368]'}`}
              >
                Plan
              </button>
              <button
                onClick={() => setActiveTab('savings')}
                className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'savings' ? 'bg-[#1a73e8] text-white shadow-sm font-bold' : 'text-[#5f6368]'}`}
              >
                Savings
              </button>
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
        </div>

        {/* Tab 1: Itinerary */}
        {activeTab === 'itinerary' && (
          <div className="p-3 overflow-y-auto space-y-3 flex-1 text-xs">
            
            {/* Charging Halts */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#5f6368] flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#1e8e3e]" /> Recommended Halts ({stops.length})
              </div>

              {stops.length > 0 ? (
                <div className="space-y-1.5">
                  {stops.map((st, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectStation && onSelectStation(st)}
                      className="p-2.5 bg-[#f8f9fa] hover:bg-blue-50 border border-[#dadce0] hover:border-[#1a73e8] rounded-xl cursor-pointer transition-all space-y-1 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[#202124] text-xs truncate max-w-[180px]">{st.name}</span>
                        <span className="text-[9px] font-mono text-[#1a73e8] font-bold">Km {st.distanceFromStartKm}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-[#5f6368]">
                        <span className="font-medium text-[#1e8e3e]">{st.power} kW DC Fast</span>
                        <span className="text-[#3c4043] font-semibold">Charge ~{st.chargeTimeMins} mins</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2.5 bg-[#f8f9fa] rounded-xl text-[10px] text-[#5f6368] border border-[#dadce0]">
                  Direct drive! Battery range is sufficient for this trip.
                </div>
              )}
            </div>

            {/* Turn Maneuvers */}
            {routeData.steps && routeData.steps.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#5f6368] flex items-center gap-1">
                  <Compass className="w-3 h-3 text-[#1a73e8]" /> Turn Directions ({routeData.steps.length})
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {routeData.steps.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => onSelectTurnStep && onSelectTurnStep(step)}
                      className="w-full text-left p-2 bg-[#f8f9fa] hover:bg-blue-50 rounded-xl text-[11px] flex justify-between items-center text-[#202124] border border-[#dadce0] transition-all"
                    >
                      <span className="truncate pr-1 font-medium">{step.instruction}</span>
                      <span className="text-[9px] font-mono text-[#5f6368] shrink-0">Km {step.cumulativeKm}</span>
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
