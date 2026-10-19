import React, { useState } from 'react';
import { Zap, X, MapPin, CheckCircle, Clock, ShieldCheck, QrCode } from 'lucide-react';

export default function StationModal({ station, onClose }) {
  const [reservedSlot, setReservedSlot] = useState(false);
  const [reservationCode, setReservationCode] = useState('');

  if (!station) return null;

  const handleReserve = () => {
    const code = 'NOVA-SLOT-' + Math.floor(1000 + Math.random() * 9000);
    setReservationCode(code);
    setReservedSlot(true);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white border border-[#dadce0] rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 font-sans text-[#202124]">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-[#dadce0] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-50 text-[#1e8e3e] rounded-xl border border-emerald-200 font-bold">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#202124] truncate max-w-[200px]">{station.name}</h3>
              <p className="text-[10px] text-[#5f6368]">DC Fast Charging Point</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#5f6368] hover:text-[#202124] rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          
          <div className="bg-[#f8f9fa] p-3 rounded-xl border border-[#dadce0] space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-[#202124]">
              <span>{station.power} kW DC Fast Charger</span>
              <span className="text-[#1e8e3e] text-[10px] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Available</span>
            </div>
            <div className="text-[10px] text-[#5f6368]">
              Supported Plugs: {station.connectors?.join(', ') || 'CCS2'}
            </div>
          </div>

          {!reservedSlot ? (
            <button
              onClick={handleReserve}
              className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold rounded-full text-xs transition-all shadow-sm"
            >
              Reserve 30-Min Charging Slot Free
            </button>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
              <div className="text-xs font-bold text-[#137333] flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4 text-[#1e8e3e]" /> Slot Reserved Successfully!
              </div>
              <div className="text-[10px] text-[#5f6368]">Reservation Code:</div>
              <div className="text-sm font-mono font-bold text-[#1a73e8] bg-white p-1.5 rounded-lg border border-[#dadce0]">
                {reservationCode}
              </div>
              <div className="text-[9px] text-[#5f6368]">Show this code at the charger kiosk.</div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
