import React from 'react';
import { Coffee, X } from 'lucide-react';

export default function FatigueAlert({ onClose }) {
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 font-sans max-w-sm w-full animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white text-[#202124] p-3 rounded-2xl shadow-xl border border-[#dadce0] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-50 text-[#f9ab00] rounded-xl border border-amber-200">
            <Coffee className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-[#f9ab00]">Driver Fatigue Warning</div>
            <div className="text-xs text-[#202124] font-medium">2+ hours driving. Time for a 15-min rest break!</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-[#5f6368] hover:text-[#202124] hover:bg-slate-100 rounded-full transition-colors ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
