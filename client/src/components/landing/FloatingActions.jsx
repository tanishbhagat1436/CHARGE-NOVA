import React from 'react';
import { ArrowUp, Zap } from 'lucide-react';

export default function FloatingActions({ onLaunchPlanner }) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 font-sans">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="p-3 bg-white text-ink-secondary hover:text-primary border border-surface-border rounded-full shadow-card transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:scale-105"
        title="Back to Top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
      <button
        onClick={() => onLaunchPlanner()}
        className="px-5 py-3 bg-primary hover:bg-primary-700 text-white font-semibold rounded-full shadow-card-lg transition-all flex items-center gap-2 text-xs cursor-pointer hover:scale-105 active:scale-95"
      >
        <Zap className="w-4 h-4 fill-current" />
        <span>Launch Planner</span>
      </button>
    </div>
  );
}
