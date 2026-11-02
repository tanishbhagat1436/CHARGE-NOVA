import React from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from './data/landingData';

export default function TestimonialsSection({ testimonials = TESTIMONIALS }) {
  return (
    <section className="py-16 bg-white border-y border-surface-border notion-reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Trusted by EV Drivers Across India</h2>
          <p className="mt-2 text-ink-secondary text-xs sm:text-sm">Real highway roadtrips planned with Charge Nova.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 bg-[#fafaf9] border border-surface-border rounded-2xl space-y-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-warning fill-current" />
                ))}
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed italic">"{t.text}"</p>
              <div>
                <div className="text-xs font-bold text-ink">{t.name}</div>
                <div className="text-[10px] text-ink-tertiary">{t.vehicle} · {t.corridor}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
