import React, { useState, useEffect } from 'react';
import { 
  ArrowUp, 
  CornerUpLeft, 
  CornerUpRight, 
  CornerDownLeft, 
  RotateCcw, 
  Gauge, 
  MapPin,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';

export default function NavigationBanner({ 
  currentStep, 
  nextStepDistanceKm, 
  currentSpeed, 
  vehicleName, 
  isSimulating,
  onClose
}) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Web Speech API Voice Prompt Helper
  const speakInstruction = (text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (voiceEnabled && currentStep?.instruction) {
      const voiceText = nextStepDistanceKm > 0 
        ? `In ${nextStepDistanceKm} kilometers, ${currentStep.instruction}`
        : currentStep.instruction;
      speakInstruction(voiceText);
    }
  }, [currentStep, nextStepDistanceKm, voiceEnabled]);

  if (!currentStep) return null;

  const renderManeuverIcon = (type, modifier) => {
    const mod = (modifier || '').toLowerCase();
    const t = (type || '').toLowerCase();

    if (mod.includes('left') || mod.includes('slight left')) {
      return <CornerUpLeft className="w-6 h-6 text-white stroke-[2.5]" />;
    }
    if (mod.includes('right') || mod.includes('slight right')) {
      return <CornerUpRight className="w-6 h-6 text-white stroke-[2.5]" />;
    }
    if (mod.includes('uturn')) {
      return <CornerDownLeft className="w-6 h-6 text-white stroke-[2.5]" />;
    }
    if (t.includes('roundabout') || t.includes('rotary')) {
      return <RotateCcw className="w-6 h-6 text-white stroke-[2.5]" />;
    }
    if (t.includes('arrive')) {
      return <MapPin className="w-6 h-6 text-white stroke-[2.5]" />;
    }
    return <ArrowUp className="w-6 h-6 text-white stroke-[2.5]" />;
  };

  return (
    <div 
      className="fixed top-20 left-4 md:left-[420px] max-w-sm w-auto font-sans animate-in slide-in-from-top-2 duration-200"
      style={{ zIndex: 9990 }}
    >
      {/* Classic Google Maps Navigation Green Card */}
      <div className="bg-[#137333] text-white rounded-2xl p-3 shadow-xl flex items-center space-x-3 border border-[#0d652d]">
        
        {/* Left Turn Icon */}
        <div className="p-2 bg-[#0d652d] text-white rounded-xl shrink-0 shadow-inner">
          {renderManeuverIcon(currentStep.type, currentStep.modifier)}
        </div>

        {/* Turn Instruction Text */}
        <div className="truncate pr-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-green-100 flex items-center gap-1">
            <span>{nextStepDistanceKm > 0 ? `In ${nextStepDistanceKm} km` : 'Now'}</span>
            <span>•</span>
            <span className="truncate max-w-[120px] text-green-200">{currentStep.streetName}</span>
          </div>
          <h2 className="text-xs font-bold text-white truncate leading-snug">
            {currentStep.instruction}
          </h2>
        </div>

        {/* Speedometer Badge */}
        <div className="hidden sm:flex flex-col items-center bg-[#0d652d] px-2 py-1 rounded-lg shrink-0 ml-auto border border-[#1b7f3d]">
          <div className="text-[8px] font-bold uppercase text-green-200 flex items-center gap-0.5">
            <Gauge className="w-2.5 h-2.5 text-green-300" /> Speed
          </div>
          <div className="text-xs font-bold text-white font-mono">
            {currentSpeed} <span className="text-[8px] font-normal text-green-200">km/h</span>
          </div>
        </div>

        {/* Voice Audio Speaker Toggle */}
        <button
          onClick={() => {
            const next = !voiceEnabled;
            setVoiceEnabled(next);
            if (next) speakInstruction(currentStep.instruction);
          }}
          className={`p-1.5 rounded-lg transition-colors shrink-0 ${voiceEnabled ? 'bg-white text-[#137333] shadow-xs' : 'text-green-200 hover:text-white hover:bg-[#0d652d]'}`}
          title={voiceEnabled ? "Mute Voice Guidance" : "Enable Voice Navigation Guidance (Web Speech)"}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4 fill-current" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-green-200 hover:text-white hover:bg-[#0d652d] rounded-lg transition-colors shrink-0"
            title="Close Turn Guide"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

      </div>
    </div>
  );
}
