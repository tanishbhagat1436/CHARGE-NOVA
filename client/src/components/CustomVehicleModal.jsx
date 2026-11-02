import React, { useState } from 'react';
import { Car, X, Plus, AlertCircle } from 'lucide-react';

export default function CustomVehicleModal({ onAddVehicle, onClose }) {
  const [name, setName] = useState('');
  const [range, setRange] = useState('');
  const [battery, setBattery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name || !range || !battery) {
      setError('Please fill in all vehicle parameters.');
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans z-[99999]"
    >
      <div className="bg-white border border-surface-border rounded-2xl max-w-sm w-full overflow-hidden shadow-card-lg text-ink">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20 font-bold">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Custom EV Creator</h3>
              <p className="text-[10px] text-ink-secondary">Add Your Vehicle Specs</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-ink-tertiary hover:text-ink hover:bg-surface-subtle rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {error && (
            <div className="p-2.5 bg-danger/10 border border-danger/20 rounded-xl text-xs text-danger flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-ink-secondary">Vehicle Model Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Audi e-tron GT / Custom EV"
              className="w-full bg-white border border-surface-border rounded-lg px-3 py-2 text-xs text-ink placeholder-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-ink-secondary">Max Range (km)</label>
              <input
                type="number"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="400"
                className="w-full bg-white border border-surface-border rounded-lg px-3 py-2 text-xs text-ink placeholder-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-ink-secondary">Battery (kWh)</label>
              <input
                type="number"
                value={battery}
                onChange={(e) => setBattery(e.target.value)}
                placeholder="50"
                className="w-full bg-white border border-surface-border rounded-lg px-3 py-2 text-xs text-ink placeholder-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary hover:bg-primary-700 text-white font-semibold rounded-full text-xs transition-all flex items-center justify-center space-x-1.5 shadow-card mt-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add EV Model</span>
          </button>
        </form>

      </div>
    </div>
  );
}
