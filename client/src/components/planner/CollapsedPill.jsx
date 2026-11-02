import React from 'react';
import { Zap, ChevronRight } from 'lucide-react';

export default function CollapsedPill({
  setIsCollapsed,
  sourceLocation,
  destLocation,
  waypoints,
  isDark = false
}) {
  const viaCount = waypoints?.filter((w) => w.location).length || 0;

  return (
    <div
      className="fixed top-4 left-4 z-20 font-sans"
      style={{ zIndex: 9995 }}
    >
      <div className={`p-1.5 px-3 rounded-full shadow-card-md flex items-center space-x-2 border backdrop-blur-md ${
        isDark 
          ? 'bg-[#0b0f19]/90 border-[rgba(34,211,238,0.2)] text-[#e2e8f0]' 
          : 'bg-white/95 border-surface-border text-ink'
      }`}>
        <div 
          className="p-1.5 bg-primary text-white rounded-full cursor-pointer shadow-card"
          onClick={() => setIsCollapsed(false)}
          title="Expand Route Planner"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
        </div>
        <div 
          className="text-xs font-semibold cursor-pointer max-w-[190px] sm:max-w-xs truncate"
          onClick={() => setIsCollapsed(false)}
        >
          <span className="text-primary">{sourceLocation?.city || 'Origin'}</span>
          {viaCount > 0 && (
            <span className="text-warning font-bold mx-1">+{viaCount}</span>
          )}
          <span className="text-ink-tertiary mx-1">➔</span>
          <span className="text-success">{destLocation?.city || 'Destination'}</span>
        </div>
        <button
          onClick={() => setIsCollapsed(false)}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all border flex items-center gap-0.5 cursor-pointer ${
            isDark 
              ? 'bg-[#1a2035] text-[#e2e8f0] border-[rgba(34,211,238,0.15)] hover:bg-[#22d3ee]/10' 
              : 'bg-surface-subtle text-ink border-surface-border hover:bg-slate-200'
          }`}
        >
          <span>Edit</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
