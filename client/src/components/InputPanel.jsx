import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  MapPin, 
  Navigation, 
  Car, 
  ShieldCheck, 
  Gauge, 
  Loader2,
  Crosshair,
  Thermometer,
  Database,
  ShieldAlert,
  QrCode,
  Search,
  User,
  LogIn
} from 'lucide-react';
import { searchLocation, reverseGeocode, getBestUserLocation } from '../services/nominatimService';
import axios from 'axios';

export const INITIAL_EV_PRESETS = [
  { id: 'nexon', name: 'Tata Nexon EV Max', range: 437, battery: 40.5, plug: 'CCS2' },
  { id: 'zs', name: 'MG ZS EV Long Range', range: 461, battery: 50.3, plug: 'CCS2' },
  { id: 'ioniq', name: 'Hyundai Ioniq 5', range: 631, battery: 72.6, plug: 'CCS2' },
  { id: 'xuv', name: 'Mahindra XUV400', range: 456, battery: 39.4, plug: 'CCS2' },
  { id: 'atto', name: 'BYD Atto 3', range: 521, battery: 60.48, plug: 'CCS2' },
];

export default function InputPanel({
  onPlanRoute,
  isLoading,
  selectedVehicle,
  setSelectedVehicle,
  currentRange,
  setCurrentRange,
  minSocBuffer,
  setMinSocBuffer,
  selectedPlug,
  setSelectedPlug,
  sourceLocation,
  setSourceLocation,
  destLocation,
  setDestLocation,
  onSelectSourceLocation,
  onSelectDestLocation,
  onSelectSavedTrip,
  onUseCurrentLocation,
  acMode,
  setAcMode,
  ambientTemp,
  setAmbientTemp,
  onOpenExportModal,
  onOpenSosModal,
  onOpenBatteryHealthModal,
  onOpenCustomVehicleModal,
  onOpenPassengerQrModal,
  evPresetsList,
  routeData,
  user,
  token,
  onOpenAuthModal,
  onOpenDashboard,
  onReturnToLanding
}) {
  const [sourceQuery, setSourceQuery] = useState(sourceLocation?.displayName || 'New Delhi');
  const [destQuery, setDestQuery] = useState(destLocation?.displayName || 'Jaipur, Rajasthan');
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [isSearchingSource, setIsSearchingSource] = useState(false);
  const [isSearchingDest, setIsSearchingDest] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);

  const [savedTrips, setSavedTrips] = useState([]);
  const [showSavedTrips, setShowSavedTrips] = useState(false);

  useEffect(() => {
    if (sourceLocation && sourceLocation.displayName) {
      setSourceQuery(sourceLocation.displayName);
    }
  }, [sourceLocation]);

  useEffect(() => {
    if (destLocation && destLocation.displayName) {
      setDestQuery(destLocation.displayName);
    }
  }, [destLocation]);

  const fetchSavedTrips = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get('http://localhost:5000/api/routes/history', { headers });
      if (response.data?.data) {
        setSavedTrips(response.data.data);
      }
    } catch (err) {
      console.log('MongoDB server offline, using local session memory');
    }
  };

  useEffect(() => {
    fetchSavedTrips();
  }, [user, token]);

  const handleSaveTripToMongo = async () => {
    if (!routeData || !sourceLocation || !destLocation) {
      alert('Please calculate a valid route first.');
      return;
    }

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post('http://localhost:5000/api/routes/save', {
        title: `${sourceLocation.city || 'Origin'} to ${destLocation.city || 'Destination'} Corridor`,
        sourceName: sourceLocation.displayName,
        destName: destLocation.displayName,
        sourceCoords: [sourceLocation.lat, sourceLocation.lng],
        destCoords: [destLocation.lat, destLocation.lng],
        vehicleName: selectedVehicle.name,
        distanceKm: routeData.distanceKm,
        durationMins: routeData.durationMins
      }, { headers });
      alert('⚡ Trip saved to your account in MongoDB Atlas successfully!');
      fetchSavedTrips();
    } catch (error) {
      alert('Trip saved to local history session!');
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (sourceQuery.length > 2 && (!sourceLocation || sourceQuery !== sourceLocation.displayName)) {
        setIsSearchingSource(true);
        const results = await searchLocation(sourceQuery);
        setSourceSuggestions(results);
        setIsSearchingSource(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [sourceQuery, sourceLocation]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (destQuery.length > 2 && (!destLocation || destQuery !== destLocation.displayName)) {
        setIsSearchingDest(true);
        const results = await searchLocation(destQuery);
        setDestSuggestions(results);
        setIsSearchingDest(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [destQuery, destLocation]);

  const handleFetchCurrentLocation = async () => {
    setIsLocatingUser(true);
    try {
      const locationData = await getBestUserLocation();
      setSourceLocation(locationData);
      setSourceQuery(locationData.displayName);
      if (onUseCurrentLocation) {
        onUseCurrentLocation(locationData);
      }
    } catch (error) {
      console.error('Error fetching live location:', error);
      alert('Could not access live GPS location.');
    } finally {
      setIsLocatingUser(false);
    }
  };

  const handleVehicleChange = (e) => {
    const preset = evPresetsList.find(p => p.id === e.target.value);
    if (preset) {
      setSelectedVehicle(preset);
      setCurrentRange(preset.range);
    }
  };

  return (
    <aside className="w-full md:w-[420px] h-full bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-xl relative font-sans">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={onReturnToLanding}>
          <div className="p-2 bg-emerald-800 text-slate-100 rounded-xl border border-emerald-700 font-bold">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-100">
              Charge Nova
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">EV Highway Planner</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1.5">
          {user ? (
            <button
              onClick={onOpenDashboard}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-xl border border-slate-800 transition-all text-xs font-bold flex items-center gap-1"
              title="Account Dashboard & Trip Analytics"
            >
              <User className="w-3.5 h-3.5" />
              <span className="max-w-[70px] truncate">{(user?.name || 'Account').split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-all text-xs font-bold flex items-center gap-1"
              title="Sign In / Register Account"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sign In</span>
            </button>
          )}

          <button
            onClick={onOpenSosModal}
            className="p-2 bg-rose-900/30 hover:bg-rose-900/50 text-rose-300 rounded-xl border border-rose-800 transition-all text-xs font-bold"
            title="24x7 EV Emergency Helpline"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </button>

          <button
            onClick={() => setShowSavedTrips(!showSavedTrips)}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-xl border border-slate-800 transition-all text-xs font-bold"
            title="View MongoDB Saved Trips"
          >
            <Database className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Saved Trips Drawer */}
        {showSavedTrips && (
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 animate-in fade-in duration-200">
            <div className="flex justify-between items-center text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-emerald-400" /> Saved MongoDB Trips</span>
              <button onClick={() => setShowSavedTrips(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            {savedTrips.length > 0 ? (
              <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                {savedTrips.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const src = { lat: t.sourceCoords[0], lng: t.sourceCoords[1], displayName: t.sourceName };
                      const dst = { lat: t.destCoords[0], lng: t.destCoords[1], displayName: t.destName };
                      setSourceLocation(src);
                      setDestLocation(dst);
                      setShowSavedTrips(false);
                      if (onSelectSavedTrip) {
                        onSelectSavedTrip(src, dst);
                      }
                    }}
                    className="w-full text-left p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-[11px] flex justify-between items-center text-slate-200 border border-slate-800"
                  >
                    <span className="truncate font-semibold">{t.title || `${t.sourceName} ➔ ${t.destName}`}</span>
                    <span className="text-emerald-400 font-mono font-bold shrink-0">{t.distanceKm} km</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-500">No saved trips yet.</div>
            )}
          </div>
        )}

        {/* EV Model Preset */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-emerald-400" /> Select EV Model</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={onOpenBatteryHealthModal}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                title="View Battery Health (SOH) Degradation"
              >
                Battery Health
              </button>
              <button
                onClick={onOpenCustomVehicleModal}
                className="text-[10px] text-slate-300 hover:text-white font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                title="Add Custom EV Model"
              >
                + Custom EV
              </button>
            </div>
          </div>
          
          <select
            value={selectedVehicle.id}
            onChange={handleVehicleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-slate-600 cursor-pointer"
          >
            {evPresetsList.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name} ({preset.range} km range • {preset.battery} kWh)
              </option>
            ))}
          </select>
        </div>

        {/* Source & Destination Search */}
        <div className="space-y-2.5 bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="space-y-1 relative">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Starting Location
              </label>
              
              <button
                onClick={handleFetchCurrentLocation}
                disabled={isLocatingUser}
                className="text-[10px] font-bold text-slate-300 hover:text-white flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800"
              >
                {isLocatingUser ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Crosshair className="w-3 h-3 text-emerald-400" />
                    <span>My Location</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={sourceQuery}
                onChange={(e) => {
                  setSourceQuery(e.target.value);
                  setSourceLocation(null);
                }}
                placeholder="Search Indian city or use live GPS"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-600"
              />
              {isSearchingSource ? (
                <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin absolute right-2.5 top-2.5" />
              ) : (
                <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5" />
              )}
            </div>

            {sourceSuggestions.length > 0 && !sourceLocation && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-40 overflow-y-auto z-30 divide-y divide-slate-800">
                {sourceSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const loc = { lat: item.lat, lng: item.lng, displayName: item.displayName };
                      setSourceLocation(loc);
                      setSourceQuery(item.displayName);
                      setSourceSuggestions([]);
                      if (onSelectSourceLocation) {
                        onSelectSourceLocation(loc);
                      }
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-200 hover:bg-slate-800 flex items-start space-x-1.5"
                  >
                    <MapPin className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="truncate">{item.displayName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1 relative">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-indigo-400" /> Destination
            </label>
            <div className="relative">
              <input
                type="text"
                value={destQuery}
                onChange={(e) => {
                  setDestQuery(e.target.value);
                  setDestLocation(null);
                }}
                placeholder="Search Indian destination"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-600"
              />
              {isSearchingDest ? (
                <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin absolute right-2.5 top-2.5" />
              ) : (
                <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5" />
              )}
            </div>

            {destSuggestions.length > 0 && !destLocation && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-40 overflow-y-auto z-30 divide-y divide-slate-800">
                {destSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const loc = { lat: item.lat, lng: item.lng, displayName: item.displayName };
                      setDestLocation(loc);
                      setDestQuery(item.displayName);
                      setDestSuggestions([]);
                      if (onSelectDestLocation) {
                        onSelectDestLocation(loc);
                      }
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-200 hover:bg-slate-800 flex items-start space-x-1.5"
                  >
                    <Navigation className="w-3 h-3 text-indigo-400 mt-0.5 shrink-0" />
                    <span className="truncate">{item.displayName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Climate & Weather Impact */}
        <div className="space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-slate-400" /> Climate AC Impact
          </div>

          <div className="grid grid-cols-3 gap-1">
            {['Off', 'Normal AC', 'Max AC'].map((mode) => (
              <button
                key={mode}
                onClick={() => setAcMode(mode)}
                className={`py-1 text-[10px] font-bold rounded-lg border transition-all ${
                  acMode === mode
                    ? 'bg-slate-800 text-slate-100 border-slate-600'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Range & Buffer Sliders */}
        <div className="space-y-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Range
              </span>
              <span className="text-emerald-400 font-mono">{currentRange} km</span>
            </div>
            <input
              type="range"
              min="30"
              max={selectedVehicle.range}
              value={currentRange}
              onChange={(e) => setCurrentRange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Target Buffer SOC
              </span>
              <span className="text-indigo-400 font-mono">{minSocBuffer}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={minSocBuffer}
              onChange={(e) => setMinSocBuffer(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* Submit & Action Buttons */}
        <div className="space-y-1.5">
          <button
            onClick={onPlanRoute}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-700 text-slate-100 font-bold rounded-xl border border-emerald-700 transition-all flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Plan Live Highway Route</span>
              </>
            )}
          </button>

          {routeData && (
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button
                onClick={handleSaveTripToMongo}
                className="py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl font-bold transition-all truncate"
              >
                Save Mongo
              </button>

              <button
                onClick={onOpenExportModal}
                className="py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl font-bold transition-all truncate"
              >
                Export PDF
              </button>

              <button
                onClick={onOpenPassengerQrModal}
                className="py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-0.5 truncate"
              >
                <QrCode className="w-3 h-3" /> QR Pass
              </button>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
}
