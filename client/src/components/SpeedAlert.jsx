import React, { useEffect } from 'react';
import { AlertTriangle, Volume2 } from 'lucide-react';

export default function SpeedAlert({ camera }) {
  if (!camera) return null;

  useEffect(() => {
    // Speak audio voice alert using browser Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Warning. Speed camera ahead in ${camera.distMeters} meters. Speed limit is ${camera.speedLimit} kilometers per hour.`
      );
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [camera.id]);

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 font-sans max-w-sm w-[92%] animate-slide-down">
      <div className="bg-danger text-white p-3 rounded-2xl shadow-card-lg border border-danger/30 flex items-center space-x-3">
        <div className="p-2 bg-white text-danger rounded-xl font-black text-sm shrink-0">
          {camera.speedLimit} <span className="text-[9px]">KM/H</span>
        </div>

        <div className="truncate flex-1">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-red-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-white" />
            <span>Speed Radar Detected</span>
          </div>
          <div className="text-xs font-bold truncate">{camera.name} ({camera.distMeters}m away)</div>
        </div>

        <Volume2 className="w-4 h-4 text-white animate-pulse shrink-0 ml-auto" />
      </div>
    </div>
  );
}
