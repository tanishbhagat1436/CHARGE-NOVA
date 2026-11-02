import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function RouteMiniSummary({
  routeData,
  smartHalts = [],
  costPreview,
  tripHours = 0,
  tripMins = 0,
  isDark = false
}) {
  if (!routeData) return null;

  return (
    <div className={`p-3 rounded-xl border space-y-1.5 shadow-card ${
      isDark ? 'bg-primary/10 border-primary/20 text-[#e2e8f0]' : 'bg-primary/5 border-primary/20 text-ink'
    }`}>
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-primary flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Route Optimized
        </span>
        <span className="font-mono text-primary font-bold">{routeData.distanceKm} km</span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-ink-secondary">
        <span>{tripHours}h {tripMins}m driving • {smartHalts.length} halt{smartHalts.length !== 1 ? 's' : ''}</span>
        {costPreview && <span className="font-semibold text-success">Save ₹{costPreview.savedCostINR}</span>}
      </div>
    </div>
  );
}
