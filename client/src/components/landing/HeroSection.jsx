import React from 'react';
import { Zap, Compass, TrendingDown, ArrowRight } from 'lucide-react';

export default function HeroSection({ onLaunchPlanner, scrollToSection }) {
  return (
    <section className="relative overflow-hidden pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center notion-reveal">
      {/* Subtle Notion dot grid backdrop */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

      <div className="relative">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.12] text-ink">
          Plan EV Roadtrips with{' '}
          <span className="text-primary underline decoration-primary/30 decoration-wavy decoration-2">Zero Range Anxiety</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-ink-secondary max-w-2xl mx-auto leading-relaxed">
          Physics-informed battery modeling, real-time TomTom traffic, commercial DC fast charger availability, and instant passenger QR passes.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onLaunchPlanner()}
            className="w-full sm:w-auto px-7 py-3 bg-primary hover:bg-primary-700 text-white font-semibold text-xs rounded-full shadow-card hover:shadow-card-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            <span>Launch Live Map Planner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToSection('corridors')}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-surface-subtle border border-surface-border text-ink font-semibold text-xs rounded-full shadow-card transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-primary" />
            <span>Explore Corridors</span>
          </button>
          <button
            onClick={() => scrollToSection('savings')}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-surface-subtle border border-surface-border text-ink font-semibold text-xs rounded-full shadow-card transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <TrendingDown className="w-4 h-4 text-success" />
            <span>Calculate Fuel Savings</span>
          </button>
        </div>
      </div>
    </section>
  );
}
