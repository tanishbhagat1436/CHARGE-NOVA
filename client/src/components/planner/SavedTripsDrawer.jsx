import React from 'react';
import { Database } from 'lucide-react';

export default function SavedTripsDrawer({
  showSavedTrips,
  setShowSavedTrips,
  user,
  savedTrips = [],
  onSelectSavedTrip,
  setSourceLocation,
  setDestLocation,
  onOpenAuthModal,
  cardSurface,
  isDark = false
}) {
  if (!showSavedTrips) return null;

  return (
    <div className={`p-3 rounded-xl border space-y-2 shadow-card ${cardSurface}`}>
      <div className="flex justify-between items-center text-xs font-bold">
        <span className="flex items-center gap-1.5 text-primary">
          <Database className="w-3.5 h-3.5" /> 
          {user ? `${(user.name || 'Account').split(' ')[0]}'s Saved Trips` : 'Saved Trips'}
        </span>
        <button
          onClick={() => setShowSavedTrips(false)}
          className="text-ink-secondary hover:text-ink cursor-pointer"
        >
          ✕
        </button>
      </div>

      {!user ? (
        <div className={`p-3 text-center rounded-lg border space-y-2 ${
          isDark ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.1)]' : 'bg-white border-surface-border'
        }`}>
          <p className="text-[11px] text-ink-secondary">Sign in to access your personal saved routes.</p>
          <button
            onClick={() => {
              setShowSavedTrips(false);
              if (onOpenAuthModal) onOpenAuthModal();
            }}
            className="px-3 py-1 bg-primary hover:bg-primary-700 text-white text-[11px] font-semibold rounded-full shadow-card transition-all cursor-pointer"
          >
            Sign In
          </button>
        </div>
      ) : savedTrips.length > 0 ? (
        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
          {savedTrips.map((t, idx) => (
            <button
              key={t._id || idx}
              onClick={() => {
                const src = { lat: t.sourceCoords[0], lng: t.sourceCoords[1], displayName: t.sourceName };
                const dst = { lat: t.destCoords[0], lng: t.destCoords[1], displayName: t.destName };
                setSourceLocation(src);
                setDestLocation(dst);
                setShowSavedTrips(false);
                if (onSelectSavedTrip) {
                  onSelectSavedTrip(src, dst);
                }
              }}
              className={`w-full text-left p-2 rounded-lg text-[11px] flex justify-between items-center border transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-[#0b0f19] hover:bg-[#1a2035] border-[rgba(34,211,238,0.1)] text-[#e2e8f0]' 
                  : 'bg-white hover:bg-primary/5 border-surface-border text-ink'
              }`}
            >
              <span className="truncate font-medium max-w-[210px]">{t.title || `${t.sourceName} ➔ ${t.destName}`}</span>
              <span className="text-primary font-mono font-bold shrink-0">{t.distanceKm} km</span>
            </button>
          ))}
        </div>
      ) : (
        <div className={`text-[11px] text-ink-secondary p-2 rounded-lg border text-center ${
          isDark ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.1)]' : 'bg-white border-surface-border'
        }`}>
          No trips saved to your account yet.
        </div>
      )}
    </div>
  );
}
