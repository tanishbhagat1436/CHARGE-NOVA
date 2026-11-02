import React, { useState } from 'react';
import {
  Compass, Battery, MapPin, Navigation, DollarSign,
  Leaf, ArrowRight, Zap, Clock, TrendingDown, X
} from 'lucide-react';
import CostSavingsWidget from './CostSavingsWidget';

export default function RouteSummary({
  routeData,
  stops,
  totalChargeTimeMins,
  onSelectStation,
  onSelectTurnStep,
  onClose,
  isDark = false,
}) {
  const [activeTab, setActiveTab] = useState('itinerary');

  if (!routeData) return null;

  const totalDistance = routeData.distanceKm;
  const driveTimeMins = routeData.durationMins;
  const totalTripTimeMins = driveTimeMins + totalChargeTimeMins;
  const hours = Math.floor(totalTripTimeMins / 60);
  const mins  = totalTripTimeMins % 60;

  /* ── Surface styles ── */
  const panel = isDark
    ? 'bg-[#0b0f19]/90 border border-[rgba(34,211,238,0.15)] text-[#e2e8f0] backdrop-blur-md'
    : 'bg-white border border-surface-border text-ink shadow-card-lg';

  const header = isDark
    ? 'border-b border-[rgba(34,211,238,0.1)]'
    : 'border-b border-surface-border bg-white';

  const tabActive = isDark
    ? 'bg-[#22d3ee]/20 text-[#22d3ee] font-bold'
    : 'bg-primary text-white shadow-sm font-bold';

  const tabInactive = isDark
    ? 'text-[#94a3b8] hover:text-[#e2e8f0]'
    : 'text-ink-secondary hover:text-ink';

  const haltCard = isDark
    ? 'bg-[#1a2035] hover:bg-[#1e293b] border border-[rgba(34,211,238,0.1)] hover:border-[rgba(34,211,238,0.3)]'
    : 'bg-surface-muted hover:bg-primary/5 border border-surface-border hover:border-primary';

  const turnBtn = isDark
    ? 'bg-[#1a2035] hover:bg-[#1e293b] border border-[rgba(34,211,238,0.1)] text-[#e2e8f0]'
    : 'bg-surface-muted hover:bg-primary/5 border border-surface-border text-ink';

  const labelMuted = isDark ? 'text-[#94a3b8]' : 'text-ink-secondary';

  return (
    <div
      className="fixed top-20 right-4 font-sans max-w-xs w-80 animate-fade-up"
      style={{ zIndex: 9990 }}
    >
      <div className={`rounded-2xl overflow-hidden flex flex-col max-h-[calc(100vh-110px)] ${panel}`}>

        {/* ── Header ── */}
        <div className={`p-3 flex items-center justify-between ${header}`}>
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${labelMuted}`}>Trip Overview</span>
            <h2 className="text-xs font-bold flex items-center gap-1.5 mt-0.5">
              <span className="text-primary font-extrabold">{totalDistance} km</span>
              <span className={labelMuted}>·</span>
              <span className="font-mono">{hours}h {mins}m</span>
            </h2>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Tab toggle */}
            <div className={`flex p-0.5 rounded-lg text-[10px] font-semibold ${
              isDark ? 'bg-[#1a2035]' : 'bg-surface-subtle border border-surface-border'
            }`}>
              {['itinerary', 'savings'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 rounded-md transition-all capitalize ${
                    activeTab === tab ? tabActive : tabInactive
                  }`}
                >
                  {tab === 'itinerary' ? 'Plan' : 'Savings'}
                </button>
              ))}
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className={`p-1 rounded-lg transition-colors ${
                  isDark ? 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-white/10' : 'text-ink-tertiary hover:text-ink hover:bg-surface-subtle'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Tab: Itinerary ── */}
        {activeTab === 'itinerary' && (
          <div className="p-3 overflow-y-auto space-y-3 flex-1 text-xs">

            {/* Charging halts */}
            <div className="space-y-1.5">
              <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${labelMuted}`}>
                <Zap className="w-3 h-3 text-success" /> Recommended Halts ({stops.length})
              </div>

              {stops.length > 0 ? (
                <div className="space-y-1.5">
                  {stops.map((st, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectStation?.(st)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-all space-y-1 ${haltCard}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs truncate max-w-[180px]">{st.name}</span>
                        <span className="text-[9px] font-mono text-primary font-bold shrink-0">Km {st.distanceFromStartKm}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-medium text-success">{st.power} kW DC Fast</span>
                        <span className={`font-semibold ${labelMuted}`}>~{st.chargeTimeMins} mins</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-2.5 rounded-xl text-[10px] border ${
                  isDark ? 'bg-[#1a2035] border-[rgba(34,211,238,0.1)] text-[#94a3b8]' : 'bg-surface-muted border-surface-border text-ink-secondary'
                }`}>
                  Direct drive — battery range is sufficient for this trip.
                </div>
              )}
            </div>

            {/* Turn list */}
            {routeData.steps?.length > 0 && (
              <div className="space-y-1.5">
                <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${labelMuted}`}>
                  <Compass className="w-3 h-3 text-primary" /> Turn Directions ({routeData.steps.length})
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {routeData.steps.map(step => (
                    <button
                      key={step.id}
                      onClick={() => onSelectTurnStep?.(step)}
                      className={`w-full text-left p-2 rounded-xl text-[11px] flex justify-between items-center border transition-all ${turnBtn}`}
                    >
                      <span className="truncate pr-1 font-medium">{step.instruction}</span>
                      <span className={`text-[9px] font-mono shrink-0 ${labelMuted}`}>Km {step.cumulativeKm}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Savings ── */}
        {activeTab === 'savings' && (
          <div className="p-3 overflow-y-auto flex-1">
            <CostSavingsWidget distanceKm={totalDistance} isDark={isDark} />
          </div>
        )}

      </div>
    </div>
  );
}
