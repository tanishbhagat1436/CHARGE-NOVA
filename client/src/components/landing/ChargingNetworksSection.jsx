import React from 'react';
import { Globe } from 'lucide-react';
import { NETWORKS } from './data/landingData';

export default function ChargingNetworksSection({ networks = NETWORKS }) {
  return (
    <section id="networks" className="py-16 bg-white border-y border-surface-border notion-reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/15 mb-2">
            <Globe className="w-3.5 h-3.5" /> Unified Charging Ecosystem
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">India's Leading Fast Charging Grids</h2>
          <p className="mt-2 text-ink-secondary text-xs sm:text-sm">Charge Nova unifies commercial fast-charging providers into a single seamless corridor view.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {networks.map((net, i) => (
            <div
              key={i}
              className="bg-[#fafaf9] border border-surface-border rounded-xl p-4 text-center flex flex-col items-center gap-2 hover:border-primary/50 transition-all"
            >
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-surface-border text-primary font-bold text-sm shadow-xs">
                ⚡
              </div>
              <div className="text-xs font-bold text-ink leading-tight text-center">{net.name}</div>
              <div className="text-[10px] font-bold text-primary font-mono">{net.count} Plugs</div>
              <div className="text-[9px] text-ink-tertiary text-center leading-tight border-t border-surface-border pt-2 w-full">{net.tagline}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
