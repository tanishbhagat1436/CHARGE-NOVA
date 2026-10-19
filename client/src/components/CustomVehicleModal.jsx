import React, { useState } from 'react';
import { Car, X, Plus } from 'lucide-react';

export default function CustomVehicleModal({ onAddVehicle, onClose }) {
  const [name, setName] = useState('');
  const [range, setRange] = useState('');
  const [battery, setBattery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !range || !battery) {
      alert('Please fill in all vehicle parameters.');
      return;
    }

    const newVehicle = {
      id: 'custom-' + Date.now(),
      name,
      range: Number(range),
      battery: Number(battery),
      plug: 'CCS2'
    };

    onAddVehicle(newVehicle);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white border border-[#dadce0] rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-[#202124]">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-[#dadce0] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-50 text-[#1a73e8] rounded-xl border border-blue-200 font-bold">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#202124]">Custom EV Creator</h3>
              <p className="text-[10px] text-[#5f6368]">Add Your Vehicle Specs</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-[#5f6368] hover:text-[#202124] rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#5f6368]">Vehicle Model Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Audi e-tron GT / Custom EV"
              className="w-full bg-white border border-[#dadce0] rounded-lg px-3 py-2 text-xs text-[#202124] placeholder-[#5f6368] focus:outline-none focus:border-[#1a73e8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#5f6368]">Max Range (km)</label>
              <input
                type="number"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="400"
                className="w-full bg-white border border-[#dadce0] rounded-lg px-3 py-2 text-xs text-[#202124] placeholder-[#5f6368] focus:outline-none focus:border-[#1a73e8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#5f6368]">Battery (kWh)</label>
              <input
                type="number"
                value={battery}
                onChange={(e) => setBattery(e.target.value)}
                placeholder="50"
                className="w-full bg-white border border-[#dadce0] rounded-lg px-3 py-2 text-xs text-[#202124] placeholder-[#5f6368] focus:outline-none focus:border-[#1a73e8]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold rounded-full text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add EV Model</span>
          </button>

        </form>

      </div>
    </div>
  );
}
