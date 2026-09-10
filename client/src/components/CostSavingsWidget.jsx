import React from 'react';
import { IndianRupee, Leaf, TrendingDown, Zap, Fuel } from 'lucide-react';
import { calculateTripCostAndSavings } from '../utils/costSavingsMath';

export default function CostSavingsWidget({ distanceKm, totalKwhCharged }) {
  const savings = calculateTripCostAndSavings(distanceKm, totalKwhCharged);

  return (
    <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 p-4 rounded-3xl shadow-xl font-sans space-y-3">
      
      {/* Widget Title Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Trip Savings & Ecology</h3>
            <p className="text-[10px] text-emerald-400 font-semibold">EV vs ICE Petrol Vehicle Comparison</p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold rounded-full flex items-center gap-1">
          <Leaf className="w-3 h-3 text-emerald-400" />
          <span>-{savings.co2SavedKg} kg CO₂</span>
        </span>
      </div>

      {/* Cost Comparison Cards */}
      <div className="grid grid-cols-2 gap-2">
        
        {/* EV Cost */}
        <div className="bg-slate-950 p-2.5 rounded-2xl border border-emerald-500/30">
          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400 fill-current" /> EV Charging Cost
          </div>
          <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
            ₹{savings.evChargingCostINR}
          </div>
        </div>

        {/* Petrol Cost */}
        <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <Fuel className="w-3 h-3 text-rose-400" /> Petrol Car Cost
          </div>
          <div className="text-lg font-bold text-slate-400 line-through font-mono mt-0.5">
            ₹{savings.petrolFuelCostINR}
          </div>
        </div>

      </div>

      {/* Net Money Saved Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-3 py-2 rounded-xl flex items-center justify-between font-extrabold text-xs shadow-lg shadow-emerald-500/20">
        <span>Net Fuel Money Saved:</span>
        <span className="text-sm font-black font-mono">₹{savings.savedCostINR} Total</span>
      </div>

    </div>
  );
}
