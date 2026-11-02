import React from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import { STEPS } from './data/landingData';

export default function HowItWorksSection({ onLaunchPlanner, steps = STEPS }) {
  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto notion-reveal">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">How Charge Nova Works in 4 Steps</h2>
        <p className="mt-2 text-ink-secondary text-xs sm:text-sm">From zero planning to complete highway confidence in under 30 seconds.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((s) => (
          <div key={s.n} className="p-5 bg-white border border-surface-border rounded-2xl space-y-2 shadow-xs">
            <div className={`text-2xl font-black font-mono ${s.color}`}>{s.n}</div>
            <h4 className="text-base font-bold">{s.title}</h4>
            <p className="text-xs text-ink-secondary leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => onLaunchPlanner()}
          className="px-8 py-3.5 bg-primary hover:bg-primary-700 text-white font-semibold text-xs rounded-full shadow-card hover:shadow-card-md transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Launch EV Planner</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
