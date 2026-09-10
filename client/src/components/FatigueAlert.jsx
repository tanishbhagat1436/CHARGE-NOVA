import React from 'react';
import { Coffee, X } from 'lucide-react';

export default function FatigueAlert({ onClose }) {
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 font-sans max-w-sm w-full animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-slate-950 p-3.5 rounded-2xl shadow-2xl border-2 border-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-950 text-amber-400 rounded-xl">
            <Coffee className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-black uppercase text-slate-950">Driver Fatigue Warning</div>
            <div className="text-xs text-slate-900 font-bold">2+ hours driving. Take a 15-min coffee break!</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-slate-950 hover:bg-slate-950/20 rounded-lg transition-colors ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
