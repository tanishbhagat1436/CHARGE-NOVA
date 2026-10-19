import React from 'react';
import { IndianRupee, Leaf, TrendingDown, Zap, Fuel } from 'lucide-react';
import { calculateTripCostAndSavings } from '../utils/costSavingsMath';

export default function CostSavingsWidget({ distanceKm, totalKwhCharged }) {
  const savings = calculateTripCostAndSavings(distanceKm, totalKwhCharged);

  return (
    <div className="bg-white border border-[#dadce0] p-4 rounded-2xl shadow-sm font-sans space-y-3 text-[#202124]">
      
      {/* Widget Title Header */}
      <div className="flex items-center justify-between border-b border-[#dadce0] pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-emerald-50 text-[#1e8e3e] rounded-lg border border-emerald-200">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">Trip Savings</h3>
            <p className="text-[10px] text-[#5f6368]">EV vs Petrol Comparison</p>
          </div>
        </div>

        <span className="px-2 py-0.5 bg-emerald-50 text-[#1e8e3e] border border-emerald-200 text-[10px] font-bold rounded-full flex items-center gap-1">
          <Leaf className="w-3 h-3 text-[#1e8e3e]" />
          <span>-{savings.co2SavedKg} kg CO₂</span>
        </span>
      </div>

      {/* Cost Comparison Cards */}
      <div className="grid grid-cols-2 gap-2">
        
        {/* EV Cost */}
        <div className="bg-[#f8f9fa] p-2.5 rounded-xl border border-emerald-200">
          <div className="text-[10px] text-[#5f6368] font-bold uppercase flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#1e8e3e] fill-current" /> EV Cost
          </div>
          <div className="text-lg font-bold text-[#1e8e3e] font-mono mt-0.5">
            ₹{savings.evChargingCostINR}
          </div>
        </div>

        {/* Petrol Cost */}
        <div className="bg-[#f8f9fa] p-2.5 rounded-xl border border-[#dadce0]">
          <div className="text-[10px] text-[#5f6368] font-bold uppercase flex items-center gap-1">
            <Fuel className="w-3 h-3 text-[#d93025]" /> Petrol Cost
          </div>
          <div className="text-lg font-bold text-[#80868b] line-through font-mono mt-0.5">
            ₹{savings.petrolFuelCostINR}
          </div>
        </div>

      </div>

      {/* Net Money Saved Banner */}
      <div className="bg-emerald-50 border border-emerald-200 text-[#137333] px-3 py-2 rounded-xl flex items-center justify-between font-bold text-xs">
        <span>Net Saved:</span>
        <span className="text-sm font-extrabold font-mono">₹{savings.savedCostINR}</span>
      </div>

    </div>
  );
}
