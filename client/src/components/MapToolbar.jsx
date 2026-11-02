import React from 'react';
import {
  Compass, BarChart3, Activity, BatteryCharging,
  Crosshair, Sun, Moon, RotateCcw, Box, ShieldAlert,
  Sliders
} from 'lucide-react';

export default function MapToolbar({
  showNavBanner, setShowNavBanner,
  showSummaryCard, setShowSummaryCard,
  showTrafficLegend, setShowTrafficLegend,
  showBottomDashboard, setShowBottomDashboard,
  activeTile, setActiveTile,
  userGpsLocation, onRecenterUser,
  onResetBounds,
  is3dTilted, setIs3dTilted,
  onOpenSosModal,
  onOpenLandingPage,
  hasRoute,
  onOpenMobilePlan,
}) {
  const isDark = activeTile === 'dark';

  /* ── Shell surface ── */
  const shell = isDark
    ? 'bg-[#0b0f19]/90 border border-[rgba(34,211,238,0.15)] shadow-hud backdrop-blur-md'
    : 'bg-white/95 border border-surface-border shadow-card-md backdrop-blur-sm';

  /* ── Button factories ── */
  const btn = (active, activeStyle, inactiveStyle) =>
    `px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer shrink-0 ${active ? activeStyle : inactiveStyle}`;

  const ghostBtn = isDark
    ? 'bg-transparent text-[#94a3b8] border-transparent hover:text-[#e2e8f0] hover:bg-white/10'
    : 'bg-transparent text-ink-secondary border-transparent hover:text-ink hover:bg-surface-subtle';

  const activeBlue = isDark
    ? 'bg-primary/20 text-[#38bdf8] border-primary/30'
    : 'bg-primary/10 text-primary border-primary/20 shadow-sm';

  const activeGreen = isDark
    ? 'bg-success/20 text-[#34d399] border-success/30'
    : 'bg-success/10 text-success border-success/20 shadow-sm';

  const activeAmber = isDark
    ? 'bg-warning/20 text-[#fbbf24] border-warning/30'
    : 'bg-warning/10 text-warning border-warning/20 shadow-sm';

  const iconBtn = (active) => `p-1.5 rounded-full transition-all border cursor-pointer shrink-0 ${
    active
      ? isDark ? 'bg-primary/20 text-[#38bdf8] border-primary/30' : 'bg-primary/10 text-primary border-primary/20'
      : isDark ? 'bg-transparent text-[#94a3b8] border-transparent hover:text-[#e2e8f0] hover:bg-white/10'
                : 'bg-transparent text-ink-secondary border-transparent hover:text-ink hover:bg-surface-subtle'
  }`;

  return (
    <div
      className="fixed top-3 left-3 right-3 md:left-auto md:right-4 font-sans animate-slide-down flex justify-end pointer-events-none"
      style={{ zIndex: 9999 }}
    >
      <div className={`pointer-events-auto p-1.5 rounded-full flex items-center space-x-1 overflow-x-auto max-w-full scrollbar-none flex-nowrap ${shell}`}>

        {/* Mobile Plan / Edit Route Button */}
        {onOpenMobilePlan && (
          <button
            onClick={onOpenMobilePlan}
            className="px-3 py-1.5 bg-primary text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm md:hidden shrink-0 cursor-pointer"
            title="Edit Route"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Plan</span>
          </button>
        )}

        {/* Home / Landing Page */}
        {onOpenLandingPage && (
          <button
            onClick={onOpenLandingPage}
            className={btn(false, '', ghostBtn)}
            title="View Landing Page"
          >
            <span>Home</span>
          </button>
        )}

        {/* SOS */}
        <button
          onClick={onOpenSosModal}
          className="px-3 py-1.5 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
          title="24x7 EV Emergency Helpline"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SOS</span>
        </button>

        {/* Turns */}
        <button
          onClick={() => setShowNavBanner(!showNavBanner)}
          className={btn(showNavBanner, activeBlue, ghostBtn)}
        >
          <Compass className={`w-3.5 h-3.5 ${showNavBanner ? (isDark ? 'text-[#38bdf8]' : 'text-primary') : ''}`} />
          <span>Turns</span>
        </button>

        {/* Trip Details */}
        <button
          onClick={() => setShowSummaryCard(!showSummaryCard)}
          className={btn(showSummaryCard, activeBlue, ghostBtn)}
        >
          <BarChart3 className={`w-3.5 h-3.5 ${showSummaryCard ? (isDark ? 'text-[#38bdf8]' : 'text-primary') : ''}`} />
          <span>Details</span>
        </button>

        {/* Traffic */}
        <button
          onClick={() => setShowTrafficLegend(!showTrafficLegend)}
          className={btn(showTrafficLegend, activeAmber, ghostBtn)}
        >
          <Activity className={`w-3.5 h-3.5 ${showTrafficLegend ? 'text-warning' : ''}`} />
          <span>Traffic</span>
        </button>

        {/* Battery panel */}
        <button
          onClick={() => setShowBottomDashboard(!showBottomDashboard)}
          className={btn(showBottomDashboard, activeGreen, ghostBtn)}
        >
          <BatteryCharging className={`w-3.5 h-3.5 ${showBottomDashboard ? 'text-success' : ''}`} />
          <span>Battery</span>
        </button>

        {/* 3D Tilt */}
        <button
          onClick={() => setIs3dTilted(!is3dTilted)}
          className={btn(is3dTilted, activeBlue, ghostBtn)}
          title="Toggle 3D Perspective"
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D</span>
        </button>

        {/* GPS recenter */}
        {userGpsLocation && (
          <button
            onClick={onRecenterUser}
            className={iconBtn(false)}
            title="Fly to GPS Location"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        )}

        {/* Day / Night switcher */}
        <button
          onClick={() => setActiveTile(isDark ? 'osm' : 'dark')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
            isDark
              ? 'bg-[#22d3ee]/15 text-[#22d3ee] border-[#22d3ee]/25'
              : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
          }`}
          title="Switch Day / Night HUD"
        >
          {isDark ? (
            <>
              <Moon className="w-3.5 h-3.5 fill-current" />
              <span>Night HUD</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 fill-current" />
              <span>Day</span>
            </>
          )}
        </button>

        {/* Reset bounds */}
        <button
          onClick={onResetBounds}
          className={iconBtn(false)}
          title="Reset Map View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
