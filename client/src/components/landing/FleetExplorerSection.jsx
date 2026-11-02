import React from 'react';
import { BatteryCharging, Zap } from 'lucide-react';
import { FLEET } from './data/landingData';

export default function FleetExplorerSection({
  fleetTab,
  setFleetTab,
  onLaunchPlanner,
  fleet = FLEET
}) {
  const currentEv = fleet[fleetTab] || fleet[0];

  return (
    <section id="fleet" className="py-16 bg-white border-y border-surface-border notion-reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold border border-success/20 mb-2">
            <BatteryCharging className="w-3.5 h-3.5" /> Tailored EV Specifications
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Supported Indian EV Fleet</h2>
          <p className="mt-2 text-ink-secondary text-xs sm:text-sm">Pre-configured battery physics curves for every major EV sold in India.</p>
        </div>

        {/* Vehicle tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {fleet.map((ev, i) => (
            <button
              key={ev.name}
              onClick={() => setFleetTab(i)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                fleetTab === i
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-[#fafaf9] border border-surface-border text-ink-secondary hover:text-ink hover:bg-surface-subtle'
              }`}
            >
              {ev.name.split(' ').slice(0, 2).join(' ')}
            </button>
          ))}
        </div>

        {/* Spec card */}
        {currentEv && (
          <div className="bg-[#fafaf9] border border-surface-border rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
              <div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/15">
                  {currentEv.category}
                </span>
                <h3 className="text-2xl font-bold mt-2">{currentEv.name}</h3>
              </div>
              <button
                onClick={() => onLaunchPlanner()}
                className="px-5 py-2.5 bg-primary hover:bg-primary-700 text-white rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Plan Route for this EV</span>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Battery Pack',       value: `${currentEv.battery} kWh`,  sub: 'LFP / NMC Chem',               color: 'text-ink' },
                { label: 'Real Highway Range', value: `${currentEv.real} km`,       sub: `ARAI: ${currentEv.arai} km`, color: 'text-success' },
                { label: 'Fast Charging Peak', value: currentEv.dc,                sub: currentEv.charge,          color: 'text-primary' },
                { label: 'Running Cost',       value: currentEv.cost,              sub: 'vs ₹7.50/km petrol',            color: 'text-success' },
              ].map((m) => (
                <div key={m.label} className="p-4 bg-white rounded-xl border border-surface-border shadow-xs">
                  <div className="text-[11px] text-ink-secondary font-medium">{m.label}</div>
                  <div className={`text-xl font-bold font-mono mt-1 ${m.color}`}>{m.value}</div>
                  <div className="text-[10px] text-ink-tertiary mt-0.5">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
