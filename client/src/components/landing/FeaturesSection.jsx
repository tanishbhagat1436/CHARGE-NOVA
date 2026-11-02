import React from 'react';
import { Sliders } from 'lucide-react';
import { FEATURES } from './data/landingData';

export default function FeaturesSection({ features = FEATURES }) {
  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto notion-reveal">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/15 mb-2">
          <Sliders className="w-3.5 h-3.5" /> Highway Optimization Suite
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Engineered for Indian EV Highways</h2>
        <p className="mt-2 text-ink-secondary text-xs sm:text-sm">Everything you need to cruise between cities without guessing where or when to charge.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => (
          <div key={f.title} className="p-6 bg-white border border-surface-border rounded-2xl space-y-3 hover:border-primary/40 hover:shadow-card transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${f.color}`}>
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold">{f.title}</h3>
            <p className="text-ink-secondary text-xs leading-relaxed">{f.desc}</p>
            <div className="text-[11px] font-semibold text-primary flex items-center gap-1 pt-1">{f.tag}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
