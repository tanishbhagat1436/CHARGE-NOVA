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
      <div className="bg-white/95 border border-[#dadce0] p-1.5 rounded-full shadow-md flex items-center space-x-1 flex-wrap gap-y-1 backdrop-blur-sm text-[#202124]">
        
        {/* About / Landing Page Button */}
        {onOpenLandingPage && (
          <button
            onClick={onOpenLandingPage}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-[#3c4043] rounded-full text-xs font-medium transition-all flex items-center gap-1 border border-transparent hover:border-[#dadce0]"
            title="View Landing Page & Features"
          >
            <span>Home</span>
          </button>
        )}

        {/* SOS Emergency Button */}
        <button
          onClick={onOpenSosModal}
          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#d93025] border border-red-200 rounded-full text-xs font-semibold flex items-center gap-1 transition-all"
          title="24x7 EV Emergency Helpline"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#d93025]" />
          <span>SOS</span>
        </button>

        {/* Toggle Turn Guidance Banner */}
        <button
          onClick={() => setShowNavBanner(!showNavBanner)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all border ${
            showNavBanner
              ? 'bg-blue-50 text-[#1a73e8] border-blue-200 shadow-sm'
              : 'bg-white text-[#5f6368] hover:text-[#202124] border-transparent hover:bg-slate-100'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-[#1a73e8]" />
          <span>Turns</span>
        </button>

        {/* Toggle Trip Analytics & Savings */}
        <button
          onClick={() => setShowSummaryCard(!showSummaryCard)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all border ${
            showSummaryCard
              ? 'bg-blue-50 text-[#1a73e8] border-blue-200 shadow-sm'
              : 'bg-white text-[#5f6368] hover:text-[#202124] border-transparent hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-[#1a73e8]" />
          <span>Trip Details</span>
        </button>

        {/* Toggle Traffic Flow */}
        <button
          onClick={() => setShowTrafficLegend(!showTrafficLegend)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all border ${
            showTrafficLegend
              ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
              : 'bg-white text-[#5f6368] hover:text-[#202124] border-transparent hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-amber-600" />
          <span>Traffic</span>
        </button>

        {/* Toggle Bottom Dashboard */}
        <button
          onClick={() => setShowBottomDashboard(!showBottomDashboard)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all border ${
            showBottomDashboard
              ? 'bg-emerald-50 text-[#1e8e3e] border-emerald-200 shadow-sm'
              : 'bg-white text-[#5f6368] hover:text-[#202124] border-transparent hover:bg-slate-100'
          }`}
        >
          <BatteryCharging className="w-3.5 h-3.5 text-[#1e8e3e]" />
          <span>Battery</span>
        </button>

        {/* 3D Tilt Toggle */}
        <button
          onClick={() => setIs3dTilted(!is3dTilted)}
          className={`px-2.5 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1 transition-all border ${
            is3dTilted
              ? 'bg-blue-50 text-[#1a73e8] border-blue-200 shadow-sm'
              : 'bg-white text-[#5f6368] border-transparent hover:bg-slate-100'
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
            className="p-1.5 bg-white hover:bg-slate-100 text-[#1a73e8] rounded-full transition-all border border-transparent hover:border-[#dadce0]"
            title="Fly to Live GPS Location"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        )}

        {/* Tile Style Switcher */}
        <button
          onClick={() => setActiveTile(activeTile === 'dark' ? 'osm' : 'dark')}
          className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-[#5f6368] rounded-full text-xs font-medium transition-all flex items-center gap-1 border border-transparent hover:border-[#dadce0]"
          title="Toggle Map Style"
        >
          {activeTile === 'dark' ? <Moon className="w-3.5 h-3.5 text-[#1a73e8]" /> : <Sun className="w-3.5 h-3.5 text-[#f9ab00]" />}
          <span>{activeTile === 'dark' ? 'Dark' : 'Day'}</span>
        </button>

        {/* Reset Bounds */}
        <button
          onClick={onResetBounds}
          className="p-1.5 bg-white hover:bg-slate-100 text-[#5f6368] hover:text-[#202124] rounded-full transition-colors border border-transparent hover:border-[#dadce0]"
          title="Reset Map View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
