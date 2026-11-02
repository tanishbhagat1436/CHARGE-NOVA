import React from 'react';
import { TrendingDown, Leaf, DollarSign } from 'lucide-react';

export default function SavingsCalculatorSection({
  dist,
  setDist,
  petrol,
  setPetrol,
  petrolCost,
  evCost,
  savings,
  co2Kg,
  savePct
}) {
  return (
    <section id="savings" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto notion-reveal">
      <div className="bg-white border border-surface-border p-6 sm:p-10 rounded-2xl shadow-card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Controls */}
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold border border-success/20 mb-3">
                <TrendingDown className="w-3.5 h-3.5" /> Interactive Economics
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">How Much Will You Save Driving EV?</h2>
              <p className="mt-2 text-ink-secondary text-xs sm:text-sm leading-relaxed">
                Adjust trip distance and petrol rates to see live side-by-side fuel costs and CO₂ offsets.
              </p>
            </div>

            <div className="space-y-4 bg-[#fafaf9] p-5 rounded-xl border border-surface-border">
              {/* Distance slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-ink-secondary">Trip Highway Distance</span>
                  <span className="text-primary font-mono font-bold">{dist} km</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={dist}
                  onChange={(e) => setDist(+e.target.value)}
                  className="w-full cursor-pointer accent-primary"
                />
              </div>

              {/* Petrol slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-ink-secondary">Petrol Fuel Rate / Litre</span>
                  <span className="text-primary font-mono font-bold">₹{petrol} / L</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="120"
                  value={petrol}
                  onChange={(e) => setPetrol(+e.target.value)}
                  className="w-full cursor-pointer accent-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-success/5 border border-success/20 rounded-xl text-xs text-success">
              <Leaf className="w-4 h-4 shrink-0" />
              <span><strong>Green Impact:</strong> You also eliminate <strong>{co2Kg} kg CO₂</strong> on this trip.</span>
            </div>
          </div>

          {/* Output cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-5 bg-[#fafaf9] border border-surface-border rounded-xl text-center space-y-1">
              <div className="text-[11px] text-ink-secondary font-semibold uppercase tracking-wider">Petrol Car Cost</div>
              <div className="text-2xl font-black font-mono text-danger">₹{petrolCost.toLocaleString()}</div>
              <div className="text-[10px] text-ink-tertiary">~14 km/L highway consumption</div>
            </div>

            <div className="p-5 bg-[#fafaf9] border border-surface-border rounded-xl text-center space-y-1">
              <div className="text-[11px] text-ink-secondary font-semibold uppercase tracking-wider">Charge Nova EV Cost</div>
              <div className="text-2xl font-black font-mono text-success">₹{evCost.toLocaleString()}</div>
              <div className="text-[10px] text-ink-tertiary">Commercial DC fast charging</div>
            </div>

            <div className="sm:col-span-2 p-5 sm:p-6 bg-success/10 border border-success/25 rounded-xl text-center space-y-1">
              <div className="text-xs text-success font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                <DollarSign className="w-4 h-4" /> Net Money Saved This Trip
              </div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-success">₹{savings.toLocaleString()}</div>
              <div className="text-xs text-success font-medium">Save ~{savePct}% in fuel costs on every single highway run!</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
