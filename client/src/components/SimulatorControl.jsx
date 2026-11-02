import React from 'react';
import {
  Play, Pause, Square, Navigation,
  Gauge, BatteryCharging, Compass,
  RotateCcw, FastForward, Cpu, Radio, Zap, Sliders
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
  onResetSimulation = () => {},
  isDark = false,
  onOpenMobilePlan,
}) {
  const progressPercent = totalDistance > 0
    ? Math.min(100, Math.round((currentDistance / totalDistance) * 100))
    : 0;

  /* ── Battery colour ── */
  const getSocColor = (soc) => {
    if (soc >= 50) return '#16a34a';
    if (soc >= 25) return '#d97706';
    if (soc >= 15) return '#ea580c';
    return '#dc2626';
  };
  const socColor = getSocColor(currentSoc);

  /* ── Container surface ── */
  const surface = isDark
    ? 'bg-[#0b0f19]/90 border border-[rgba(34,211,238,0.15)] backdrop-blur-md text-[#e2e8f0]'
    : 'bg-white border border-surface-border text-ink shadow-card-lg';

  const metricTile = isDark
    ? 'bg-[#1a2035] border border-[rgba(34,211,238,0.1)]'
    : 'bg-surface-muted border border-surface-border';

  const metricLabel = isDark ? 'text-[#94a3b8]' : 'text-ink-secondary';

  const pillBase = isDark
    ? 'bg-[#1a2035] border border-[rgba(34,211,238,0.12)]'
    : 'bg-surface-subtle border border-surface-border';

  const pillActive = isDark
    ? 'bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee]/30'
    : 'bg-primary/10 text-primary border border-primary/20';

  const pillInactive = isDark
    ? 'text-[#94a3b8] hover:text-[#e2e8f0]'
    : 'text-ink-secondary hover:text-ink';

  return (
    <div
      className="fixed bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 font-sans max-w-xl w-[calc(100%-20px)] sm:w-full px-2 sm:px-4 animate-fade-up"
      style={{ zIndex: 9990 }}
    >
      <div className={`p-3 md:p-3.5 rounded-2xl space-y-2.5 shadow-card-lg ${surface}`}>

        {/* ── Top bar: title + mode pill + action ── */}
        <div className="flex items-center justify-between border-b pb-2.5 gap-2"
          style={{ borderColor: isDark ? 'rgba(34,211,238,0.1)' : '#e2e8f0' }}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className={`p-1.5 rounded-xl border shrink-0 ${
              isNavigating
                ? 'bg-success/10 text-success border-success/20'
                : 'bg-primary/10 text-primary border-primary/20'
            }`}>
              <Navigation className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${metricLabel}`}>
                <span>
                  {isNavigating
                    ? (navMode === 'simulator' ? 'Virtual Drive' : 'GPS Live')
                    : 'Route Overview'}
                </span>
                {isNavigating && (
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                )}
              </div>
              <div className="text-xs font-bold truncate">{vehicleName}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mode pill */}
            <div className={`flex items-center p-0.5 rounded-lg text-[11px] ${pillBase}`}>
              <button
                onClick={() => setNavMode('simulator')}
                className={`px-2 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                  navMode === 'simulator' ? pillActive : pillInactive
                }`}
                title="Virtual Drive Simulator"
              >
                <Cpu className="w-3 h-3" />
                <span className="hidden sm:inline">Sim</span>
              </button>
              <button
                onClick={() => setNavMode('deviceGps')}
                className={`px-2 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                  navMode === 'deviceGps' ? pillActive : pillInactive
                }`}
                title="Live Hardware GPS"
              >
                <Radio className="w-3 h-3" />
                <span className="hidden sm:inline">GPS</span>
              </button>
            </div>

            {/* Mobile Plan Button */}
            {onOpenMobilePlan && !isNavigating && (
              <button
                onClick={onOpenMobilePlan}
                className="md:hidden px-2.5 py-1.5 rounded-full border border-surface-border bg-surface-subtle text-ink font-semibold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                title="Edit Route / Vehicle"
              >
                <Sliders className="w-3 h-3 text-primary" />
                <span className="text-[11px]">Plan</span>
              </button>
            )}

            {/* Start / Exit */}
            {!isNavigating ? (
              <button
                onClick={onStartNavigation}
                className="px-3.5 py-1.5 bg-primary hover:bg-primary-700 text-white font-semibold text-xs rounded-full shadow-sm transition-all flex items-center space-x-1 active:scale-95 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>START</span>
              </button>
            ) : (
              <button
                onClick={onExitNavigation}
                className="px-3 py-1.5 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 font-semibold text-xs rounded-full transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>EXIT</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Simulator cockpit controls ── */}
        {isNavigating && navMode === 'simulator' && (
          <div className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
            isDark ? 'bg-[#1a2035] border-[rgba(34,211,238,0.1)]' : 'bg-primary/5 border-primary/10'
          }`}>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSimPaused(!isSimPaused)}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 border transition-all ${
                  isSimPaused
                    ? 'bg-primary text-white border-primary'
                    : isDark
                      ? 'bg-[#0b0f19] text-[#e2e8f0] border-[rgba(34,211,238,0.15)] hover:bg-[#1a2035]'
                      : 'bg-white text-ink border-surface-border hover:bg-surface-subtle'
                }`}
              >
                {isSimPaused
                  ? <Play className="w-3 h-3 fill-current" />
                  : <Pause className="w-3 h-3 fill-current" />}
                <span>{isSimPaused ? 'Resume' : 'Pause'}</span>
              </button>
              <button
                onClick={onResetSimulation}
                className={`p-1.5 rounded-lg transition-colors border ${
                  isDark
                    ? 'bg-[#0b0f19] text-[#94a3b8] border-[rgba(34,211,238,0.15)] hover:text-[#e2e8f0]'
                    : 'bg-white text-ink-secondary border-surface-border hover:bg-surface-subtle'
                }`}
                title="Restart simulation"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Speed pills */}
            <div className="flex items-center gap-1">
              <span className={`text-[10px] font-bold uppercase mr-1 hidden sm:inline ${metricLabel}`}>
                Speed:
              </span>
              {[1, 5, 15, 30].map(spd => (
                <button
                  key={spd}
                  onClick={() => setSimSpeedMultiplier(spd)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all border ${
                    simSpeedMultiplier === spd
                      ? 'bg-primary text-white border-primary'
                      : isDark
                        ? 'bg-[#0b0f19] text-[#94a3b8] border-[rgba(34,211,238,0.1)] hover:text-[#e2e8f0]'
                        : 'bg-white text-ink-secondary border-surface-border hover:bg-surface-subtle'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Live metrics grid ── */}
        <div className="grid grid-cols-3 gap-2 text-center">

          {/* Speed */}
          <div className={`p-2 rounded-xl border ${metricTile}`}>
            <div className={`text-[9px] font-bold uppercase flex items-center justify-center gap-1 ${metricLabel}`}>
              <Gauge className="w-3 h-3 text-success" /> Speed
            </div>
            <div className="text-base font-bold text-success font-mono mt-0.5">
              {liveSpeed} <span className={`text-[9px] font-normal ${metricLabel}`}>km/h</span>
            </div>
          </div>

          {/* Distance */}
          <div className={`p-2 rounded-xl border ${metricTile}`}>
            <div className={`text-[9px] font-bold uppercase flex items-center justify-center gap-1 ${metricLabel}`}>
              <Compass className="w-3 h-3 text-primary" /> Distance
            </div>
            <div className="text-base font-bold text-primary font-mono mt-0.5">
              {currentDistance} <span className={`text-[9px] font-normal ${metricLabel}`}>/ {totalDistance} km</span>
            </div>
          </div>

          {/* Battery SOC */}
          <div className={`p-2 rounded-xl border ${metricTile}`}>
            <div className={`text-[9px] font-bold uppercase flex items-center justify-center gap-1 ${metricLabel}`}>
              <BatteryCharging className="w-3 h-3" style={{ color: socColor }} /> SOC
            </div>
            <div className="text-base font-bold font-mono mt-0.5" style={{ color: socColor }}>
              {currentSoc}%
            </div>
          </div>

        </div>

        {/* ── Progress bar + next stop ── */}
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className={`font-semibold ${isDark ? 'text-[#e2e8f0]' : 'text-ink'}`}>
              {progressPercent}% Completed
            </span>
            {nextStop ? (
              <span className="flex items-center gap-1 font-medium text-success">
                <Zap className="w-3 h-3 fill-current" />
                <span>Next: {nextStop.name.split(',')[0]} (Km {nextStop.distanceFromStartKm})</span>
              </span>
            ) : (
              <span className={metricLabel}>Destination Approaching</span>
            )}
          </div>
          <div className="w-full rounded-full h-1.5 overflow-hidden" style={{
            background: isDark ? '#1a2035' : '#e2e8f0'
          }}>
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
