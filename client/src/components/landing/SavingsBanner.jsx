import React from 'react';
import { TrendingDown } from 'lucide-react';
import { REAL_SAVINGS_METRICS } from './data/landingData';

export default function SavingsBanner({ metrics = REAL_SAVINGS_METRICS }) {
  return (
    <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto notion-reveal">
      <div className="max-w-5xl mx-auto">
        <div className="text-xs font-bold uppercase tracking-wider text-ink-tertiary mb-3 flex items-center justify-center gap-2">
          <TrendingDown className="w-3.5 h-3.5 text-success" />
          <span>Real Highway EV vs Petrol Economics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-2xl font-black font-mono tracking-tight ${m.color}`}>{m.val}</span>
                  {m.unit && <span className="text-xs text-ink-tertiary font-semibold">{m.unit}</span>}
                </div>
                <div className="text-xs font-bold text-ink mt-1">{m.label}</div>
              </div>
              <div className="text-[11px] text-ink-tertiary mt-2 pt-2 border-t border-surface-border/60">
                {m.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
