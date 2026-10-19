import React from 'react';
import { Compass, BarChart3, Activity, BatteryCharging, Crosshair, Sun, Moon, RotateCcw, Box, ShieldAlert } from 'lucide-react';

export default function MapToolbar({
  showNavBanner,
  setShowNavBanner,
  showSummaryCard,
  setShowSummaryCard,
  showTrafficLegend,
  setShowTrafficLegend,
  showBottomDashboard,
  setShowBottomDashboard,
  activeTile,
  setActiveTile,
  userGpsLocation,
  onRecenterUser,
  onResetBounds,
  is3dTilted,
  setIs3dTilted,
  onOpenSosModal,
  onOpenLandingPage,
  hasRoute
}) {
  const isDark = activeTile === 'dark';

  return (
    <div 
      className="fixed top-4 right-4 font-sans animate-in slide-in-from-top-4 duration-300"
      style={{ zIndex: 9999 }}
    >
      <div className={`p-1.5 rounded-full shadow-lg flex items-center space-x-1 flex-wrap gap-y-1 backdrop-blur-md border transition-all ${
        isDark 
          ? 'bg-slate-900/90 border-slate-700 text-white shadow-cyan-950/40' 
          : 'bg-white/95 border-[#dadce0] text-[#202124]'
      }`}>
        
        {/* About / Landing Page Button */}
        {onOpenLandingPage && (
          <button
            onClick={onOpenLandingPage}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 border cursor-pointer ${
              isDark 
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
                : 'bg-white hover:bg-slate-100 text-[#3c4043] border-transparent hover:border-[#dadce0]'
            }`}
            title="View Landing Page & Features"
          >
            <span>Home</span>
          </button>
        )}

        {/* SOS Emergency Button */}
        <button
          onClick={onOpenSosModal}
          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#d93025] border border-red-200 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
          title="24x7 EV Emergency Helpline"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#d93025]" />
          <span>SOS</span>
        </button>

        {/* Toggle Turn Guidance Banner */}
        <button
          onClick={() => setShowNavBanner(!showNavBanner)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all border cursor-pointer ${
            showNavBanner
              ? isDark 
                ? 'bg-cyan-950 text-[#00e5ff] border-cyan-700 shadow-sm'
                : 'bg-blue-50 text-[#1a73e8] border-blue-200 shadow-sm'
              : isDark 
                ? 'bg-slate-800/80 text-slate-300 hover:text-white border-transparent hover:bg-slate-700'
                : 'bg-white text-[#5f6368] hover:text-[#202124] border-transparent hover:bg-slate-100'
          }`}
        >
          <Compass className={`w-3.5 h-3.5 ${isDark ? 'text-[#00e5ff]' : 'text-[#1a73e8]'}`} />
          <span>Turns</span>
        </button>

        {/* Toggle Trip Analytics & Savings */}
        <button
          onClick={() => setShowSummaryCard(!showSummaryCard)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all border cursor-pointer ${
            showSummaryCard
              ? isDark 
                ? 'bg-cyan-950 text-[#00e5ff] border-cyan-700 shadow-sm'
                : 'bg-blue-50 text-[#1a73e8] border-blue-200 shadow-sm'
              : isDark 
                ? 'bg-slate-800/80 text-slate-300 hover:text-white border-transparent hover:bg-slate-700'
                : 'bg-white text-[#5f6368] hover:text-[#202124] border-transparent hover:bg-slate-100'
          }`}
        >
          <BarChart3 className={`w-3.5 h-3.5 ${isDark ? 'text-[#00e5ff]' : 'text-[#1a73e8]'}`} />
          <span>Trip Details</span>
        </button>

        {/* Toggle Traffic Flow */}
        <button
          onClick={() => setShowTrafficLegend(!showTrafficLegend)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all border cursor-pointer ${
            showTrafficLegend
              ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
              : isDark
                ? 'bg-slate-800/80 text-slate-300 hover:text-white border-transparent hover:bg-slate-700'
                : 'bg-white text-[#5f6368] hover:text-[#202124] border-transparent hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-amber-500" />
          <span>Traffic</span>
        </button>

        {/* Toggle Bottom Dashboard */}
        <button
          onClick={() => setShowBottomDashboard(!showBottomDashboard)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all border cursor-pointer ${
            showBottomDashboard
              ? 'bg-emerald-50 text-[#1e8e3e] border-emerald-200 shadow-sm'
              : isDark
                ? 'bg-slate-800/80 text-slate-300 hover:text-white border-transparent hover:bg-slate-700'
                : 'bg-white text-[#5f6368] hover:text-[#202124] border-transparent hover:bg-slate-100'
          }`}
        >
          <BatteryCharging className="w-3.5 h-3.5 text-[#1e8e3e]" />
          <span>Battery</span>
        </button>

        {/* 3D Tilt Toggle */}
        <button
          onClick={() => setIs3dTilted(!is3dTilted)}
          className={`px-2.5 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1 transition-all border cursor-pointer ${
            is3dTilted
              ? isDark 
                ? 'bg-cyan-950 text-[#00e5ff] border-cyan-700 shadow-sm'
                : 'bg-blue-50 text-[#1a73e8] border-blue-200 shadow-sm'
              : isDark
                ? 'bg-slate-800 text-slate-300 border-transparent hover:bg-slate-700'
                : 'bg-white text-[#5f6368] border-transparent hover:bg-slate-100'
          }`}
          title="Toggle 3D Perspective Tilt"
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D</span>
        </button>

        {/* Fly to GPS Location */}
        {userGpsLocation && (
          <button
            onClick={onRecenterUser}
            className={`p-1.5 rounded-full transition-all border cursor-pointer ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-[#00e5ff] border-slate-700' 
                : 'bg-white hover:bg-slate-100 text-[#1a73e8] border-transparent hover:border-[#dadce0]'
            }`}
            title="Fly to Live GPS Location"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        )}

        {/* Day / Night HUD Switcher */}
        <button
          onClick={() => setActiveTile(isDark ? 'osm' : 'dark')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer shadow-xs ${
            isDark
              ? 'bg-cyan-950/80 text-[#00e5ff] border-cyan-800'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
          title="Switch Day Mode / Night HUD Map"
        >
          {isDark ? (
            <>
              <Moon className="w-3.5 h-3.5 text-[#00e5ff] fill-current" />
              <span>Night HUD</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>Day Mode</span>
            </>
          )}
        </button>

        {/* Reset Bounds */}
        <button
          onClick={onResetBounds}
          className={`p-1.5 rounded-full transition-colors border cursor-pointer ${
            isDark 
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-transparent' 
              : 'bg-white hover:bg-slate-100 text-[#5f6368] hover:text-[#202124] border-transparent hover:border-[#dadce0]'
          }`}
          title="Reset Map View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}

