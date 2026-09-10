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
      className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 font-sans">
        
        {/* Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white text-zinc-950 rounded-xl font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white truncate max-w-[200px]">{station.name}</h3>
              <p className="text-[10px] text-zinc-400 font-medium">Fast Charging Station</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          
          <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-white">
              <span>{station.power} kW DC Fast Charger</span>
              <span className="text-emerald-400 text-[10px] font-bold">Available Now</span>
            </div>
            <div className="text-[10px] text-zinc-400">
              Supported Plugs: {station.connectors?.join(', ') || 'CCS2'}
            </div>
          </div>

          {!reservedSlot ? (
            <button
              onClick={handleReserve}
              className="w-full py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl text-xs transition-all border border-white"
            >
              Reserve 30-Min Charging Slot Free
            </button>
          ) : (
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-center space-y-1">
              <div className="text-xs font-bold text-white flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Slot Reserved Successfully!
              </div>
              <div className="text-[10px] text-zinc-400">Reservation Code:</div>
              <div className="text-sm font-mono font-bold text-white bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
                {reservationCode}
              </div>
              <div className="text-[9px] text-zinc-500">Show this code at the charger kiosk.</div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
