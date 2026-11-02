import React from 'react';
import { Activity, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function TrafficLegend({ totalDelayMins, showTraffic, setShowTraffic, onClose, isDark = false }) {
  const container = isDark
    ? 'bg-[#111827]/95 border-[rgba(34,211,238,0.2)] text-[#e2e8f0] backdrop-blur-md shadow-card-lg'
    : 'bg-white border-surface-border text-ink shadow-card-lg';

  const subtle = isDark
    ? 'bg-[#1a2035] border-[rgba(34,211,238,0.1)] text-[#e2e8f0]'
    : 'bg-surface-muted border-surface-border text-ink';

  const labelMuted = isDark ? 'text-[#94a3b8]' : 'text-ink-secondary';

  return (
    <div 
      className="fixed top-20 right-4 font-sans max-w-xs w-72 animate-slide-down"
      style={{ zIndex: 9990 }}
    >
      <div className={`border rounded-2xl p-3.5 space-y-2.5 ${container}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-[rgba(34,211,238,0.1)]' : 'border-surface-border'}`}>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg border border-primary/20">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold">Traffic Flow</h3>
              <p className={`text-[9px] ${labelMuted}`}>Live Highway Conditions</p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors ${isDark ? 'text-[#94a3b8] hover:text-white hover:bg-white/10' : 'text-ink-tertiary hover:text-ink hover:bg-surface-subtle'}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Delay Banner */}
        <div className={`p-2.5 rounded-xl border flex items-center justify-between ${subtle}`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${labelMuted}`}>Traffic Status</span>
          {totalDelayMins > 0 ? (
            <span className="text-xs font-bold text-warning flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> +{totalDelayMins} min delay
            </span>
          ) : (
            <span className="text-xs font-bold text-success flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Clear Road
            </span>
          )}
        </div>

        {/* Color Legend */}
        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-semibold">
          <div className={`flex items-center space-x-1.5 p-1.5 rounded-lg border ${subtle}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
            <span>Fast / Clear</span>
          </div>
          <div className={`flex items-center space-x-1.5 p-1.5 rounded-lg border ${subtle}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-warning shrink-0" />
            <span>Slow Traffic</span>
          </div>
          <div className={`flex items-center space-x-1.5 p-1.5 rounded-lg border ${subtle}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-danger shrink-0" />
            <span>Heavy Jam</span>
          </div>
          <div className={`flex items-center space-x-1.5 p-1.5 rounded-lg border ${subtle}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-red-900 shrink-0" />
            <span>Stationary</span>
          </div>
        </div>

      </div>
    </div>
  );
}
