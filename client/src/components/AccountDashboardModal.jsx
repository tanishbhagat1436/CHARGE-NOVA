import React, { useState, useEffect } from 'react';
import { X, User, LogOut, Database, Zap, MapPin, Gauge, DollarSign, BarChart3, Layers, CheckSquare, Square, Calendar } from 'lucide-react';
import axios from 'axios';

export default function AccountDashboardModal({ user, token, onClose, onLogout, onLoadTripOnMap }) {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTripIds, setSelectedTripIds] = useState([]);

  useEffect(() => {
    fetchUserTrips();
  }, []);

  const fetchUserTrips = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/routes/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.data) {
        setTrips(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user trips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTripSelection = (id) => {
    if (selectedTripIds.includes(id)) {
      setSelectedTripIds(selectedTripIds.filter(tId => tId !== id));
    } else {
      if (selectedTripIds.length >= 3) {
        alert('You can compare up to 3 trips side-by-side.');
        return;
      }
      setSelectedTripIds([...selectedTripIds, id]);
    }
  };

  const selectedTrips = trips.filter(t => selectedTripIds.includes(t._id));

  // Lifetime metrics calculation
  const totalDistanceKm = trips.reduce((acc, t) => acc + (t.distanceKm || 0), 0);
  const totalSavedCostINR = trips.reduce((acc, t) => acc + (t.savedCostINR || Math.round((t.distanceKm / 14) * 105 - (t.distanceKm / 437) * 40.5 * 10)), 0);
  const totalStops = trips.reduce((acc, t) => acc + (t.stopsCount || 1), 0);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-100 flex items-center gap-2">
                <span>{user?.name || 'Account Dashboard'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">ACCOUNT</span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Lifetime Analytics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center space-x-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <Gauge className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Distance Planned</div>
                <div className="text-xl font-black text-slate-100 font-mono">{totalDistanceKm} km</div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center space-x-3">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Fuel Money Saved</div>
                <div className="text-xl font-black text-emerald-400 font-mono">₹{totalSavedCostINR.toLocaleString()}</div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center space-x-3">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Saved Trips Stored</div>
                <div className="text-xl font-black text-indigo-400 font-mono">{trips.length} Trips</div>
              </div>
            </div>
          </div>

          {/* TRIP COMPARISON SECTION */}
          {selectedTrips.length > 0 && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-sm text-slate-100">Side-by-Side Trip Comparison ({selectedTrips.length} Selected)</h4>
                </div>
                <button
                  onClick={() => setSelectedTripIds([])}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Clear Selection
                </button>
              </div>

              {/* Side-by-Side Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedTrips.map((t, idx) => {
                  const estPetrolCost = Math.round((t.distanceKm / 14) * 105);
                  const estEvCost = Math.round((t.distanceKm / 437) * 40.5 * 10);
                  const netSavings = Math.max(0, estPetrolCost - estEvCost);

                  return (
                    <div key={t._id || idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 relative">
                      <div className="text-xs font-extrabold text-emerald-400 truncate">{t.title || `${t.sourceName} ➔ ${t.destName}`}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{t.vehicleName || 'Tata Nexon EV Max'}</div>
                      <div className="border-t border-slate-800 pt-2 space-y-1 text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>Distance:</span>
                          <span className="font-mono font-bold">{t.distanceKm} km</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Charging Cost:</span>
                          <span className="font-mono font-bold text-teal-400">₹{estEvCost}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Petrol Cost:</span>
                          <span className="font-mono font-bold text-rose-400">₹{estPetrolCost}</span>
                        </div>
                        <div className="flex justify-between text-slate-100 font-bold pt-1 border-t border-slate-800/80">
                          <span>Net Savings:</span>
                          <span className="font-mono text-emerald-400">₹{netSavings}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onLoadTripOnMap({ lat: t.sourceCoords[0], lng: t.sourceCoords[1], displayName: t.sourceName }, { lat: t.destCoords[0], lng: t.destCoords[1], displayName: t.destName });
                          onClose();
                        }}
                        className="w-full py-1.5 mt-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold transition-all text-center"
                      >
                        Load Corridor on Map ➔
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PAST TRIPS TABLE */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Your Saved Past Trips in MongoDB</span>
              </h4>
              <span className="text-[11px] text-slate-400">Check boxes to compare trips</span>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading saved trips...</div>
            ) : trips.length > 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
                {trips.map((t) => {
                  const isChecked = selectedTripIds.includes(t._id);
                  const estEvCost = Math.round((t.distanceKm / 437) * 40.5 * 10);
                  const estPetrolCost = Math.round((t.distanceKm / 14) * 105);
                  const netSavings = Math.max(0, estPetrolCost - estEvCost);

                  return (
                    <div key={t._id} className="p-4 hover:bg-slate-900/60 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => toggleTripSelection(t._id)}
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-600" />}
                        </button>

                        <div>
                          <div className="font-bold text-xs text-slate-100">{t.title || `${t.sourceName} ➔ ${t.destName}`}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{t.vehicleName || 'EV Vehicle'}</span>
                            <span>•</span>
                            <span className="font-mono text-emerald-400 font-bold">{t.distanceKm} km</span>
                            <span>•</span>
                            <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-emerald-400">₹{netSavings} Saved</div>
                          <div className="text-[10px] text-slate-500">EV Cost: ₹{estEvCost}</div>
                        </div>

                        <button
                          onClick={() => {
                            onLoadTripOnMap(
                              { lat: t.sourceCoords[0], lng: t.sourceCoords[1], displayName: t.sourceName },
                              { lat: t.destCoords[0], lng: t.destCoords[1], displayName: t.destName }
                            );
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition-all"
                        >
                          View Map
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-500">
                No trips saved to your account yet. Calculate a route and click <strong>"Save Mongo"</strong> in the planner!
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
