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
  return (
    <div 
      className="fixed top-4 right-4 font-sans animate-in slide-in-from-top-4 duration-300"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-slate-900 border border-slate-700 p-1.5 rounded-2xl shadow-2xl flex items-center space-x-1.5 flex-wrap gap-y-1">
        
        {/* About / Landing Page Button */}
        {onOpenLandingPage && (
          <button
            onClick={onOpenLandingPage}
            className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
            title="View Landing Page & Features"
          >
            <span>About</span>
          </button>
        )}

        {/* SOS Emergency Button */}
        <button
          onClick={onOpenSosModal}
          className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
          title="24x7 EV Emergency Helpline"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>SOS</span>
        </button>

        {/* Toggle Turn Guidance Banner */}
        <button
          onClick={() => setShowNavBanner(!showNavBanner)}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all border ${
            showNavBanner
              ? 'bg-emerald-800 text-white border-emerald-700 shadow-md font-bold'
              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Turn Guide</span>
        </button>

        {/* Toggle Trip Analytics & Savings */}
        <button
          onClick={() => setShowSummaryCard(!showSummaryCard)}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all border ${
            showSummaryCard
              ? 'bg-emerald-800 text-white border-emerald-700 shadow-md font-bold'
              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Trip Details</span>
        </button>

        {/* Toggle Traffic Flow */}
        <button
          onClick={() => setShowTrafficLegend(!showTrafficLegend)}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all border ${
            showTrafficLegend
              ? 'bg-blue-800 text-white border-blue-700 shadow-md font-bold'
              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          <span>Traffic</span>
        </button>

        {/* Toggle Bottom Dashboard */}
        <button
          onClick={() => setShowBottomDashboard(!showBottomDashboard)}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all border ${
            showBottomDashboard
              ? 'bg-emerald-800 text-white border-emerald-700 shadow-md font-bold'
              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          <span>Battery</span>
        </button>

        {/* 3D Tilt Toggle */}
        <button
          onClick={() => setIs3dTilted(!is3dTilted)}
          className={`px-2.5 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1 transition-all border ${
            is3dTilted
              ? 'bg-slate-800 text-white border-slate-600 shadow-md font-bold'
              : 'bg-slate-950 text-slate-400 border-slate-800'
          }`}
          title="Toggle 3D Map View"
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D</span>
        </button>

        {/* Fly to GPS Location */}
        {userGpsLocation && (
          <button
            onClick={onRecenterUser}
            className="p-2 bg-slate-950 hover:bg-slate-800 text-blue-400 border border-slate-800 rounded-xl transition-all"
            title="Fly to Live GPS Location"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        )}

        {/* Tile Style Switcher */}
        <button
          onClick={() => setActiveTile(activeTile === 'dark' ? 'osm' : 'dark')}
          className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
          title="Toggle Map Style"
        >
          {activeTile === 'dark' ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          <span>{activeTile === 'dark' ? 'Dark' : 'Light'}</span>
        </button>

        {/* Reset Bounds */}
        <button
          onClick={onResetBounds}
          className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-colors"
          title="Reset Map View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
