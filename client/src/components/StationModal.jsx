import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  X, 
  MapPin, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Coffee, 
  Wifi, 
  Shield, 
  Navigation, 
  DollarSign,
  Sparkles,
  QrCode
} from 'lucide-react';

export default function StationModal({ station, onClose }) {
  const [reservedSlot, setReservedSlot] = useState(false);
  const [reservationCode, setReservationCode] = useState('');
  const [timeLeftSecs, setTimeLeftSecs] = useState(1800); // 30 minutes countdown

  useEffect(() => {
    let timer = null;
    if (reservedSlot && timeLeftSecs > 0) {
      timer = setInterval(() => {
        setTimeLeftSecs(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [reservedSlot, timeLeftSecs]);

  if (!station) return null;

  const handleReserve = () => {
    const code = 'NOVA-' + (station.operator ? station.operator.slice(0, 3).toUpperCase() : 'EV') + '-' + Math.floor(1000 + Math.random() * 9000);
    setReservationCode(code);
    setReservedSlot(true);
    setTimeLeftSecs(1800);
  };

  const handleOpenNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const mins = Math.floor(timeLeftSecs / 60);
  const secs = timeLeftSecs % 60;
  const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const amenitiesList = station.amenities && station.amenities.length > 0
    ? station.amenities
    : ['Restroom', 'Food Court', '24x7 Security', 'Wi-Fi'];

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-in fade-in duration-200"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white border border-[#dadce0] rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-[#202124]">
        
        {/* Header with CPO Branding */}
        <div className="p-4 bg-white border-b border-[#dadce0] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-50 text-[#1e8e3e] rounded-xl border border-emerald-200 font-bold shadow-sm">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1a73e8] border border-blue-200">
                  {station.operator || 'EV Network'}
                </span>
                <span className="text-[10px] text-[#1e8e3e] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e] animate-pulse"></span>
                  Live
                </span>
              </div>
              <h3 className="text-xs font-bold text-[#202124] truncate max-w-[210px] mt-0.5">
                {station.title || station.name}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#5f6368] hover:text-[#202124] rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5">
          
          {/* Key Charger Specs Banner */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#f8f9fa] p-2 rounded-xl border border-[#dadce0]">
              <div className="text-[10px] uppercase font-bold text-[#5f6368]">Power</div>
              <div className="text-sm font-bold text-[#1e8e3e] font-mono mt-0.5">{station.power || 60} kW</div>
            </div>
            <div className="bg-[#f8f9fa] p-2 rounded-xl border border-[#dadce0]">
              <div className="text-[10px] uppercase font-bold text-[#5f6368]">Tariff</div>
              <div className="text-sm font-bold text-[#1a73e8] font-mono mt-0.5">₹{station.rateINR || 19}/kWh</div>
            </div>
            <div className="bg-[#f8f9fa] p-2 rounded-xl border border-[#dadce0]">
              <div className="text-[10px] uppercase font-bold text-[#5f6368]">Plug</div>
              <div className="text-sm font-bold text-[#202124] font-mono mt-0.5">{station.connectors?.[0] || 'CCS2'}</div>
            </div>
          </div>

          {/* Highway Amenities Section */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-[#5f6368] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
              <span>Highway Amenities at Station</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {amenitiesList.map((amenity, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 bg-white border border-[#dadce0] rounded-lg text-[10px] font-semibold text-[#3c4043] flex items-center gap-1 shadow-xs"
                >
                  {amenity.toLowerCase().includes('restroom') && <span>🚻</span>}
                  {amenity.toLowerCase().includes('food') && <span>🍔</span>}
                  {amenity.toLowerCase().includes('caf') && <span>☕</span>}
                  {amenity.toLowerCase().includes('wi-fi') && <span>📶</span>}
                  {amenity.toLowerCase().includes('security') && <span>🛡️</span>}
                  {amenity.toLowerCase().includes('store') && <span>🛒</span>}
                  <span>{amenity}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Reservation / Slot Action */}
          {!reservedSlot ? (
            <div className="space-y-2 pt-1">
              <button
                onClick={handleReserve}
                className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold rounded-full text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Reserve 30-Min Fast Slot Free</span>
              </button>

              <button
                onClick={handleOpenNavigation}
                className="w-full py-2 bg-white hover:bg-slate-50 text-[#1a73e8] border border-[#dadce0] font-semibold rounded-full text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </button>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-in fade-in duration-300">
              <div className="text-xs font-bold text-[#137333] flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4 text-[#1e8e3e]" />
                <span>Slot Reserved for Your Vehicle!</span>
              </div>
              
              <div className="bg-white p-2 rounded-lg border border-emerald-200 space-y-1">
                <div className="text-[10px] text-[#5f6368]">Charger Bay Auth Passcode:</div>
                <div className="text-base font-mono font-extrabold text-[#1a73e8] tracking-wider">
                  {reservationCode}
                </div>
                <div className="text-[10px] text-[#137333] font-semibold flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Held for: {formattedTime} mins</span>
                </div>
              </div>

              <button
                onClick={handleOpenNavigation}
                className="w-full py-2 bg-[#1e8e3e] hover:bg-[#137333] text-white font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate Directly to Bay</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

