import React from 'react';
import { 
  ArrowUp, 
  CornerUpLeft, 
  CornerUpRight, 
  CornerDownLeft, 
  RotateCcw, 
  Gauge, 
  MapPin,
  X
} from 'lucide-react';

export default function NavigationBanner({ 
  currentStep, 
  nextStepDistanceKm, 
  currentSpeed, 
  vehicleName, 
  isSimulating,
  onClose
}) {
  if (!currentStep) return null;

  const renderManeuverIcon = (type, modifier) => {
    const mod = (modifier || '').toLowerCase();
    const t = (type || '').toLowerCase();

    if (mod.includes('left') || mod.includes('slight left')) {
      return <CornerUpLeft className="w-6 h-6 text-slate-100 stroke-[2.5]" />;
    }
    if (mod.includes('right') || mod.includes('slight right')) {
      return <CornerUpRight className="w-6 h-6 text-slate-100 stroke-[2.5]" />;
    }
    if (mod.includes('uturn')) {
      return <CornerDownLeft className="w-6 h-6 text-slate-100 stroke-[2.5]" />;
    }
    if (t.includes('roundabout') || t.includes('rotary')) {
      return <RotateCcw className="w-6 h-6 text-slate-100 stroke-[2.5]" />;
    }
    if (t.includes('arrive')) {
      return <MapPin className="w-6 h-6 text-slate-100 stroke-[2.5]" />;
    }
    return <ArrowUp className="w-6 h-6 text-slate-100 stroke-[2.5]" />;
  };

  return (
    <div 
      className="fixed top-20 left-4 md:left-[440px] max-w-sm w-auto font-sans animate-in slide-in-from-top-2 duration-200"
      style={{ zIndex: 9990 }}
    >
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl p-3 shadow-2xl flex items-center space-x-3">
        
        {/* Left Turn Icon */}
        <div className="p-2 bg-emerald-800 text-slate-100 rounded-xl border border-emerald-700 shrink-0">
          {renderManeuverIcon(currentStep.type, currentStep.modifier)}
        </div>

        {/* Turn Instruction Text */}
        <div className="truncate pr-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <span>{nextStepDistanceKm > 0 ? `In ${nextStepDistanceKm} km` : 'Now'}</span>
            <span>•</span>
            <span className="truncate max-w-[100px] text-slate-300">{currentStep.streetName}</span>
          </div>
          <h2 className="text-xs font-bold text-slate-100 truncate leading-snug">
            {currentStep.instruction}
          </h2>
        </div>

        {/* Speedometer Badge */}
        <div className="hidden sm:flex flex-col items-center bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 shrink-0 ml-auto">
          <div className="text-[8px] font-bold uppercase text-slate-400 flex items-center gap-0.5">
            <Gauge className="w-2.5 h-2.5 text-emerald-400" /> Speed
          </div>
          <div className="text-xs font-bold text-slate-200 font-mono">
            {currentSpeed} <span className="text-[8px] font-normal text-slate-400">km/h</span>
          </div>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors shrink-0 ml-1"
            title="Close Turn Guide"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

      </div>
    </div>
  );
}
