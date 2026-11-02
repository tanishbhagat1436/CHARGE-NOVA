import React from 'react';
import {
  Zap, ChevronLeft, User, LogIn, ShieldAlert, Database
} from 'lucide-react';

export default function PanelHeader({
  onCloseMobilePlan,
  onReturnToLanding,
  user,
  onOpenDashboard,
  onOpenAuthModal,
  onOpenSosModal,
  showSavedTrips,
  setShowSavedTrips,
  setIsCollapsed,
  isDark = false
}) {
  return (
    <div className={`p-3.5 border-b flex items-center justify-between ${
      isDark ? 'border-[rgba(34,211,238,0.12)] bg-[#0b0f19]' : 'border-surface-border bg-white'
    }`}>
      <div className="flex items-center space-x-2">
        {onCloseMobilePlan && (
          <button
            onClick={onCloseMobilePlan}
            className="md:hidden px-2.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold flex items-center gap-1 cursor-pointer mr-1"
            title="Return to Map"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Map</span>
          </button>
        )}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onReturnToLanding}>
          <div className="p-2 bg-primary text-white rounded-xl shadow-card font-bold">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Charge Nova</h1>
            <p className="text-[10px] text-ink-secondary font-medium">EV Highway Directions</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-1.5">
        {user ? (
          <button
            onClick={onOpenDashboard}
            className={`px-2.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1 shadow-card transition-all ${
              isDark 
                ? 'bg-[#1a2035] border-[rgba(34,211,238,0.2)] text-primary hover:bg-[#22d3ee]/10' 
                : 'bg-surface-muted border-surface-border text-primary hover:bg-surface-subtle'
            }`}
            title="Account Dashboard"
          >
            <User className="w-3.5 h-3.5" />
            <span className="max-w-[70px] truncate">{(user?.name || 'Account').split(' ')[0]}</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className={`px-2.5 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1 shadow-card transition-all ${
              isDark 
                ? 'bg-[#1a2035] border-[rgba(34,211,238,0.15)] text-[#e2e8f0]' 
                : 'bg-surface-muted border-surface-border text-ink-secondary hover:text-ink'
            }`}
            title="Sign In"
          >
            <LogIn className="w-3.5 h-3.5 text-primary" />
            <span>Sign In</span>
          </button>
        )}

        <button
          onClick={onOpenSosModal}
          className="p-1.5 bg-danger/10 hover:bg-danger/20 text-danger rounded-full border border-danger/20 transition-all text-xs font-bold"
          title="Emergency SOS"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowSavedTrips(!showSavedTrips)}
          className={`p-1.5 rounded-full border transition-all text-xs font-semibold ${
            isDark 
              ? 'bg-[#1a2035] border-[rgba(34,211,238,0.15)] text-primary' 
              : 'bg-surface-muted border-surface-border text-primary hover:bg-surface-subtle'
          }`}
          title="Saved Trips"
        >
          <Database className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsCollapsed(true)}
          className={`p-1.5 rounded-full border transition-all ${
            isDark 
              ? 'bg-[#1a2035] border-[rgba(34,211,238,0.15)] text-ink-secondary hover:text-[#e2e8f0]' 
              : 'bg-surface-muted border-surface-border text-ink-secondary hover:text-ink hover:bg-surface-subtle'
          }`}
          title="Collapse panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
