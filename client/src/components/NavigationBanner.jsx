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
  VolumeX,
  Zap,
} from 'lucide-react';

export default function NavigationBanner({
  currentStep,
  nextStepDistanceKm,
  currentSpeed,
  vehicleName,
  isSimulating,
  isDark = false,
  distToNextChargerKm = null,
  onClose,
}) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const speak = (text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    }
  };

  useEffect(() => {
    if (voiceEnabled && currentStep?.instruction) {
      const txt = nextStepDistanceKm > 0
        ? `In ${nextStepDistanceKm} kilometers, ${currentStep.instruction}`
        : currentStep.instruction;
      speak(txt);
    }
  }, [currentStep, nextStepDistanceKm, voiceEnabled]);

  if (!currentStep) return null;

  const renderIcon = (type, modifier) => {
    const mod = (modifier || '').toLowerCase();
    const t   = (type   || '').toLowerCase();
    if (mod.includes('left'))       return <CornerUpLeft   className="w-6 h-6 stroke-[2.5]" />;
    if (mod.includes('right'))      return <CornerUpRight  className="w-6 h-6 stroke-[2.5]" />;
    if (mod.includes('uturn'))      return <CornerDownLeft className="w-6 h-6 stroke-[2.5]" />;
    if (t.includes('roundabout') || t.includes('rotary')) return <RotateCcw className="w-6 h-6 stroke-[2.5]" />;
    if (t.includes('arrive'))       return <MapPin  className="w-6 h-6 stroke-[2.5]" />;
    return <ArrowUp className="w-6 h-6 stroke-[2.5]" />;
  };

  /* ── Style sets ── */
  const wrap = isDark
    ? 'bg-[#0b0f19]/90 border border-[rgba(34,211,238,0.2)] text-[#e2e8f0] shadow-hud backdrop-blur-md'
    : 'bg-[#16a34a] border border-[#15803d] text-white shadow-card-lg';

  const iconBox = isDark
    ? 'bg-[#1a2035] border border-[rgba(34,211,238,0.15)]'
    : 'bg-[#15803d]';

  const labelColor = isDark ? 'text-[#22d3ee]' : 'text-green-100';
  const streetColor = isDark ? 'text-[#94a3b8]' : 'text-green-200';
  const metricBox = isDark
    ? 'bg-[#1a2035] border border-[rgba(34,211,238,0.15)]'
    : 'bg-[#15803d] border border-[#166534]';

  return (
    <div
      className="fixed top-20 left-4 md:left-[420px] max-w-sm w-auto font-sans animate-slide-down"
      style={{ zIndex: 9990 }}
    >
      <div className={`rounded-2xl p-3 flex items-center space-x-3 ${wrap}`}>

        {/* Maneuver icon */}
        <div className={`p-2 rounded-xl shrink-0 ${iconBox}`}>
          {renderIcon(currentStep.type, currentStep.modifier)}
        </div>

        {/* Instruction text */}
        <div className="truncate pr-1 flex-1 min-w-0">
          <div className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${labelColor}`}>
            <span>{nextStepDistanceKm > 0 ? `In ${nextStepDistanceKm} km` : 'Now'}</span>
            <span>·</span>
            <span className={`truncate max-w-[120px] ${streetColor}`}>{currentStep.streetName}</span>
          </div>
          <h2 className="text-xs font-bold truncate leading-snug mt-0.5">
            {currentStep.instruction}
          </h2>
        </div>

        {/* Charger distance chip (if available) */}
        {distToNextChargerKm !== null && (
          <div className={`hidden sm:flex flex-col items-center px-2 py-1 rounded-lg shrink-0 ${metricBox}`}>
            <div className={`text-[8px] font-bold uppercase flex items-center gap-0.5 ${labelColor}`}>
              <Zap className="w-2.5 h-2.5" /> Charger
            </div>
            <div className="text-xs font-bold font-mono">
              {distToNextChargerKm} <span className={`text-[8px] font-normal ${streetColor}`}>km</span>
            </div>
          </div>
        )}

        {/* Speed */}
        <div className={`hidden sm:flex flex-col items-center px-2 py-1 rounded-lg shrink-0 ${metricBox}`}>
          <div className={`text-[8px] font-bold uppercase flex items-center gap-0.5 ${labelColor}`}>
            <Gauge className="w-2.5 h-2.5" /> Speed
          </div>
          <div className="text-xs font-bold font-mono">
            {currentSpeed} <span className={`text-[8px] font-normal ${streetColor}`}>km/h</span>
          </div>
        </div>

        {/* Voice toggle */}
        <button
          onClick={() => {
            const next = !voiceEnabled;
            setVoiceEnabled(next);
            if (next) speak(currentStep.instruction);
          }}
          className={`p-1.5 rounded-lg transition-colors shrink-0 ${
            voiceEnabled
              ? 'bg-white/20 text-white'
              : isDark ? 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-white/10' : 'text-green-200 hover:text-white hover:bg-[#15803d]'
          }`}
          title={voiceEnabled ? 'Mute Voice Guidance' : 'Enable Voice Navigation'}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4 fill-current" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Close */}
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors shrink-0 ${
              isDark ? 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-white/10' : 'text-green-200 hover:text-white hover:bg-[#15803d]'
            }`}
            title="Close Turn Guide"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

      </div>
    </div>
  );
}
