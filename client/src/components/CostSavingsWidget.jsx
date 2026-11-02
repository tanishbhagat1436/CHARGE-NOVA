import React from 'react';
import { IndianRupee, Leaf, TrendingDown, Zap, Fuel } from 'lucide-react';
import { calculateTripCostAndSavings } from '../utils/costSavingsMath';

export default function CostSavingsWidget({ distanceKm, totalKwhCharged, isDark = false }) {
  const savings = calculateTripCostAndSavings(distanceKm, totalKwhCharged);

  const container = isDark
    ? 'bg-[#111827] border-[rgba(34,211,238,0.15)] text-[#e2e8f0]'
    : 'bg-white border-surface-border text-ink shadow-card';

  const tile = isDark
    ? 'bg-[#1a2035] border-[rgba(34,211,238,0.1)]'
    : 'bg-surface-muted border-surface-border';

  const labelMuted = isDark ? 'text-[#94a3b8]' : 'text-ink-secondary';

  return (
    <div className={`border p-4 rounded-2xl font-sans space-y-3 transition-colors ${container}`}>
      {/* Widget Header */}
      <div className={`flex items-center justify-between border-b pb-2.5 ${isDark ? 'border-[rgba(34,211,238,0.1)]' : 'border-surface-border'}`}>
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-success/10 text-success rounded-lg border border-success/20">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider">Trip Savings</h3>
            <p className={`text-[10px] ${labelMuted}`}>EV vs Petrol Benchmark</p>
          </div>
        </div>

        <span className={`px-2 py-0.5 border text-[10px] font-bold rounded-full flex items-center gap-1 ${
          isDark
            ? 'bg-success/20 text-[#34d399] border-success/30'
            : 'bg-success/10 text-success border-success/20'
        }`}>
          <Leaf className="w-3 h-3" />
          <span>-{savings.co2SavedKg} kg CO₂</span>
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* EV Cost */}
        <div className={`p-2.5 rounded-xl border ${tile} ${isDark ? 'border-success/30' : 'border-success/20'}`}>
          <div className={`text-[10px] font-bold uppercase flex items-center gap-1 ${labelMuted}`}>
            <Zap className="w-3 h-3 text-success fill-current" /> EV Cost
          </div>
          <div className="text-lg font-bold text-success font-mono mt-0.5">
            ₹{savings.evChargingCostINR}
          </div>
        </div>

        {/* Petrol Cost */}
        <div className={`p-2.5 rounded-xl border ${tile}`}>
          <div className={`text-[10px] font-bold uppercase flex items-center gap-1 ${labelMuted}`}>
            <Fuel className="w-3 h-3 text-danger" /> Petrol Cost
          </div>
          <div className={`text-lg font-bold line-through font-mono mt-0.5 ${labelMuted}`}>
            ₹{savings.petrolFuelCostINR}
          </div>
        </div>
      </div>

      {/* Net Money Saved Banner */}
      <div className={`px-3 py-2 rounded-xl flex items-center justify-between font-bold text-xs border ${
        isDark
          ? 'bg-success/15 border-success/30 text-[#34d399]'
          : 'bg-success/10 border-success/20 text-success'
      }`}>
        <span>Net Saved:</span>
        <span className="text-sm font-extrabold font-mono">₹{savings.savedCostINR}</span>
      </div>
    </div>
  );
}
