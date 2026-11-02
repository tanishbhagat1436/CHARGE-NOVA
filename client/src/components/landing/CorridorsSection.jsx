import React from 'react';
import { Compass, Clock, BatteryCharging, Zap, ArrowRight } from 'lucide-react';
import { CORRIDORS } from './data/landingData';

export default function CorridorsSection({ onLaunchPlanner, corridors = CORRIDORS }) {
  return (
    <section id="corridors" className="py-16 bg-white border-y border-surface-border notion-reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/15 mb-2">
              <Compass className="w-3.5 h-3.5" /> Popular Indian Expressways
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pre-Configured Highway Corridors</h2>
            <p className="mt-1.5 text-ink-secondary text-xs sm:text-sm">Click any corridor to instantly calculate charging stops, live traffic, and battery arrival SOC.</p>
          </div>
          <button
            onClick={() => onLaunchPlanner()}
            className="px-4 py-2 bg-white hover:bg-surface-subtle border border-surface-border text-primary rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs cursor-pointer"
          >
            <span>Custom Route Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {corridors.map((c) => (
            <div
              key={c.id}
              className="bg-[#fafaf9] border border-surface-border rounded-2xl p-5 hover:border-primary/50 hover:shadow-card transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${c.badgeColor}`}>{c.badge}</span>
                  <span className="text-[11px] font-mono font-bold text-ink-secondary">{c.distanceKm} km</span>
                </div>
                <h3 className="text-base font-bold group-hover:text-primary transition-colors">{c.title}</h3>
                <p className="text-xs text-ink-secondary font-medium mt-0.5">{c.highway}</p>
                
                <div className="mt-4 pt-3 border-t border-surface-border space-y-2 text-xs">
                  <div className="flex items-center justify-between text-ink-secondary">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary" /> Drive Time:</span>
                    <span className="font-semibold text-ink">{c.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-ink-secondary">
                    <span className="flex items-center gap-1"><BatteryCharging className="w-3.5 h-3.5 text-success" /> Charging Halts:</span>
                    <span className="font-semibold text-success">{c.stops}</span>
                  </div>
                  <div className="text-[11px] bg-white p-2 rounded-lg border border-surface-border">
                    <span className="font-semibold text-primary">Key Halt: </span>
                    <span className="text-ink-secondary">{c.recommendedStop}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onLaunchPlanner(c.source, c.dest)}
                className="mt-5 w-full py-2.5 bg-white group-hover:bg-primary group-hover:text-white border border-surface-border group-hover:border-primary text-primary font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Plan This Corridor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
