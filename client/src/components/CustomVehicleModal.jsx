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
      className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white text-zinc-950 rounded-xl font-bold">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Custom EV Creator</h3>
              <p className="text-[10px] text-zinc-400 font-medium">Add Your Vehicle Specs</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-zinc-400">Vehicle Model Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Audi e-tron GT / Custom EV"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-400">Max Range (km)</label>
              <input
                type="number"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="400"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-400">Battery (kWh)</label>
              <input
                type="number"
                value={battery}
                onChange={(e) => setBattery(e.target.value)}
                placeholder="50"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl text-xs transition-all border border-white flex items-center justify-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add EV Model to Presets</span>
          </button>

        </form>

      </div>
    </div>
  );
}
