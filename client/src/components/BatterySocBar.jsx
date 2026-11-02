import React from 'react';
import { BatteryCharging, Battery, BatteryLow, BatteryWarning } from 'lucide-react';

/**
 * Persistent Battery SOC HUD bar — always visible on map canvas.
 * Colour-coded by battery level for highway glanceability.
 */
export default function BatterySocBar({ soc = 100, isDark = false }) {
  if (soc === null || soc === undefined) return null;

  // Colour thresholds
  const getConfig = (pct) => {
    if (pct >= 50) return {
      color: '#16a34a',       // emerald-600
      bg: 'rgba(22,163,74,0.12)',
      border: 'rgba(22,163,74,0.3)',
      label: 'Healthy',
      Icon: BatteryCharging,
      pulse: false,
    };
    if (pct >= 25) return {
      color: '#d97706',       // amber-600
      bg: 'rgba(217,119,6,0.12)',
      border: 'rgba(217,119,6,0.3)',
      label: 'Plan Charge',
      Icon: Battery,
      pulse: false,
    };
    if (pct >= 15) return {
      color: '#ea580c',       // orange-600
      bg: 'rgba(234,88,12,0.12)',
      border: 'rgba(234,88,12,0.3)',
      label: 'Charge Soon',
      Icon: BatteryLow,
      pulse: false,
    };
    return {
      color: '#dc2626',       // red-600
      bg: 'rgba(220,38,38,0.15)',
      border: 'rgba(220,38,38,0.4)',
      label: 'Critical',
      Icon: BatteryWarning,
      pulse: true,
    };
  };

  const cfg = getConfig(soc);
  const { color, bg, border, label, Icon, pulse } = cfg;

  const containerStyle = {
    background: isDark
      ? 'rgba(11,15,25,0.85)'
      : 'rgba(255,255,255,0.92)',
    border: `1px solid ${border}`,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  };

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[9990] flex items-center gap-2 px-3 py-1.5 rounded-full shadow-card-md"
      style={containerStyle}
      title={`Battery State of Charge: ${soc}%`}
    >
      {/* Icon */}
      <Icon
        className={`w-4 h-4 shrink-0 ${pulse ? 'soc-critical' : ''}`}
        style={{ color }}
      />

      {/* SOC Label */}
      <span
        className="text-hud-md font-mono font-bold tabular-nums"
        style={{ color }}
      >
        {soc}%
      </span>

      {/* Bar track */}
      <div
        className="w-24 h-2 rounded-full overflow-hidden"
        style={{ background: isDark ? '#1a2035' : '#e2e8f0' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.max(2, soc)}%`,
            background: color,
            boxShadow: `0 0 6px ${color}60`,
          }}
        />
      </div>

      {/* Status tag */}
      <span
        className="text-[10px] font-semibold uppercase tracking-wide hidden sm:block"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}
