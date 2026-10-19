import React, { useState, useEffect } from 'react';
import { X, User, LogOut, Database, Zap, MapPin, Gauge, DollarSign, BarChart3, Layers, CheckSquare, Square, Calendar } from 'lucide-react';
import axios from 'axios';
import { getApiBaseUrl } from '../services/apiConfig';

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
      const response = await axios.get(`${getApiBaseUrl()}/api/routes/history`, {
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

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white border border-[#dadce0] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative text-[#202124]">
        
        {/* Header Bar */}
        <div className="p-4 border-b border-[#dadce0] bg-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 text-[#1a73e8] rounded-xl border border-blue-200">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#202124] flex items-center gap-2">
                <span>{user?.name || 'Account Dashboard'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#1a73e8] border border-blue-200 font-semibold">ACCOUNT</span>
              </h3>
              <p className="text-xs text-[#5f6368]">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#d93025] border border-red-200 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#5f6368] hover:text-[#202124] hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Lifetime Analytics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-xl flex items-center space-x-3">
              <div className="p-2.5 bg-blue-50 text-[#1a73e8] rounded-xl">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#5f6368]">Total Distance</div>
                <div className="text-xl font-bold text-[#1a73e8] font-mono">{totalDistanceKm} km</div>
              </div>
            </div>

            <div className="p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-xl flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-50 text-[#1e8e3e] rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#5f6368]">Fuel Money Saved</div>
                <div className="text-xl font-bold text-[#1e8e3e] font-mono">₹{totalSavedCostINR.toLocaleString()}</div>
              </div>
            </div>

            <div className="p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-xl flex items-center space-x-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#5f6368]">Saved Trips</div>
                <div className="text-xl font-bold text-[#202124] font-mono">{trips.length} Trips</div>
              </div>
            </div>
          </div>

          {/* TRIP COMPARISON SECTION */}
          {selectedTrips.length > 0 && (
            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#dadce0] space-y-3 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-[#1a73e8]" />
                  <h4 className="font-bold text-xs text-[#202124]">Side-by-Side Trip Comparison ({selectedTrips.length} Selected)</h4>
                </div>
                <button
                  onClick={() => setSelectedTripIds([])}
                  className="text-xs text-[#1a73e8] hover:underline font-semibold"
                >
                  Clear Selection
                </button>
              </div>

              {/* Side-by-Side Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedTrips.map((t, idx) => {
                  const estPetrolCost = Math.round((t.distanceKm / 14) * 105);
                  const estEvCost = Math.round((t.distanceKm / 437) * 40.5 * 10);
                  const netSavings = Math.max(0, estPetrolCost - estEvCost);

                  return (
                    <div key={t._id || idx} className="p-3.5 bg-white border border-[#dadce0] rounded-xl space-y-2 shadow-sm">
                      <div className="text-xs font-bold text-[#1a73e8] truncate">{t.title || `${t.sourceName} ➔ ${t.destName}`}</div>
                      <div className="text-[11px] text-[#5f6368] font-medium">{t.vehicleName || 'Tata Nexon EV Max'}</div>
                      <div className="border-t border-[#dadce0] pt-2 space-y-1 text-xs">
                        <div className="flex justify-between text-[#5f6368]">
                          <span>Distance:</span>
                          <span className="font-mono font-bold text-[#202124]">{t.distanceKm} km</span>
                        </div>
                        <div className="flex justify-between text-[#5f6368]">
                          <span>Charging Cost:</span>
                          <span className="font-mono font-bold text-[#1e8e3e]">₹{estEvCost}</span>
                        </div>
                        <div className="flex justify-between text-[#5f6368]">
                          <span>Petrol Cost:</span>
                          <span className="font-mono font-bold text-[#d93025]">₹{estPetrolCost}</span>
                        </div>
                        <div className="flex justify-between text-[#202124] font-bold pt-1 border-t border-[#dadce0]">
                          <span>Net Savings:</span>
                          <span className="font-mono text-[#1e8e3e]">₹{netSavings}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onLoadTripOnMap({ lat: t.sourceCoords[0], lng: t.sourceCoords[1], displayName: t.sourceName }, { lat: t.destCoords[0], lng: t.destCoords[1], displayName: t.destName });
                          onClose();
                        }}
                        className="w-full py-1.5 mt-2 bg-blue-50 hover:bg-blue-100 text-[#1a73e8] border border-blue-200 rounded-lg text-[11px] font-semibold transition-all text-center"
                      >
                        Load on Map ➔
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PAST TRIPS TABLE */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-xs text-[#202124] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#1a73e8]" />
                <span>Saved Past Trips (MongoDB)</span>
              </h4>
              <span className="text-[11px] text-[#5f6368]">Select checkboxes to compare</span>
            </div>

            {isLoading ? (
              <div className="p-6 text-center text-xs text-[#5f6368]">Loading saved trips...</div>
            ) : trips.length > 0 ? (
              <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden divide-y divide-[#dadce0]">
                {trips.map((t) => {
                  const isChecked = selectedTripIds.includes(t._id);
                  const estEvCost = Math.round((t.distanceKm / 437) * 40.5 * 10);
                  const estPetrolCost = Math.round((t.distanceKm / 14) * 105);
                  const netSavings = Math.max(0, estPetrolCost - estEvCost);

                  return (
                    <div key={t._id} className="p-3 hover:bg-[#f8f9fa] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => toggleTripSelection(t._id)}
                          className="text-[#1a73e8]"
                        >
                          {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-400" />}
                        </button>

                        <div>
                          <div className="font-bold text-xs text-[#202124]">{t.title || `${t.sourceName} ➔ ${t.destName}`}</div>
                          <div className="text-[11px] text-[#5f6368] flex items-center gap-2 mt-0.5">
                            <span>{t.vehicleName || 'EV Vehicle'}</span>
                            <span>•</span>
                            <span className="font-mono text-[#1a73e8] font-semibold">{t.distanceKm} km</span>
                            <span>•</span>
                            <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-[#1e8e3e]">₹{netSavings} Saved</div>
                          <div className="text-[10px] text-[#5f6368]">EV Cost: ₹{estEvCost}</div>
                        </div>

                        <button
                          onClick={() => {
                            onLoadTripOnMap(
                              { lat: t.sourceCoords[0], lng: t.sourceCoords[1], displayName: t.sourceName },
                              { lat: t.destCoords[0], lng: t.destCoords[1], displayName: t.destName }
                            );
                            onClose();
                          }}
                          className="px-3 py-1 bg-white hover:bg-slate-50 text-[#1a73e8] border border-[#dadce0] rounded-lg text-xs font-semibold transition-all shadow-sm"
                        >
                          View Map
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center bg-[#f8f9fa] rounded-xl border border-[#dadce0] text-xs text-[#5f6368]">
                No trips saved to your account yet. Calculate a route and click <strong>"Save Trip"</strong> in the planner!
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
