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
  LogIn,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { searchLocation, reverseGeocode, getBestUserLocation } from '../services/nominatimService';
import axios from 'axios';
import { getApiBaseUrl } from '../services/apiConfig';
import { calculateTripCostAndSavings } from '../utils/costSavingsMath';
import { INDIAN_CPO_NETWORKS } from '../services/openChargeMapService';
import { fetchLiveWeather } from '../services/weatherService';

export const INITIAL_EV_PRESETS = [
  { id: 'nexon', name: 'Tata Nexon EV Max', range: 437, battery: 40.5, plug: 'CCS2' },
  { id: 'zs', name: 'MG ZS EV Long Range', range: 461, battery: 50.3, plug: 'CCS2' },
  { id: 'ioniq', name: 'Hyundai Ioniq 5', range: 631, battery: 72.6, plug: 'CCS2' },
  { id: 'xuv', name: 'Mahindra XUV400', range: 456, battery: 39.4, plug: 'CCS2' },
  { id: 'atto', name: 'BYD Atto 3', range: 521, battery: 60.48, plug: 'CCS2' },
];

function WaypointRow({ index, wp, onUpdate, onRemove }) {
  const [query, setQuery] = useState(wp.location?.displayName || wp.query || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (wp.location?.displayName && query !== wp.location.displayName) {
      setQuery(wp.location.displayName);
    }
  }, [wp.location]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2 && (!wp.location || query !== wp.location.displayName)) {
        setIsSearching(true);
        const results = await searchLocation(query);
        setSuggestions(results);
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, wp.location]);

  return (
    <div className="space-y-1 relative">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-[#5f6368] flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
            {index + 1}
          </span>
          <span>Via Stop {index + 1}</span>
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="text-[10px] text-[#d93025] hover:underline font-semibold cursor-pointer"
        >
          ✕ Remove
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onUpdate({ ...wp, query: e.target.value, location: null });
          }}
          placeholder="Add intermediate town or highway stop"
          className="w-full bg-white border border-[#dadce0] rounded-lg pl-3 pr-8 py-2 text-xs text-[#202124] placeholder-[#5f6368] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
        />
        {isSearching ? (
          <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin absolute right-2.5 top-2.5" />
        ) : (
          <Search className="w-3.5 h-3.5 text-[#5f6368] absolute right-2.5 top-2.5" />
        )}
      </div>

      {suggestions.length > 0 && !wp.location && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#dadce0] rounded-xl shadow-xl max-h-40 overflow-y-auto z-30 divide-y divide-[#dadce0]">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const loc = { lat: item.lat, lng: item.lng, displayName: item.displayName };
                setQuery(item.displayName);
                setSuggestions([]);
                onUpdate({ ...wp, location: loc, query: item.displayName });
              }}
              className="w-full text-left px-2.5 py-2 text-[11px] text-[#202124] hover:bg-slate-50 flex items-start space-x-2 cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
              <span className="truncate">{item.displayName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


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
  smartHalts,
  user,
  token,
  onOpenAuthModal,
  onOpenDashboard,
  onReturnToLanding,
  waypoints = [],
  setWaypoints,
  selectedNetwork = 'All Networks',
  setSelectedNetwork
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Live Highway Weather State (Open-Meteo)
  const [weatherData, setWeatherData] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  useEffect(() => {
    if (!sourceLocation?.lat || !sourceLocation?.lng) return;
    let isMounted = true;
    const loadWeather = async () => {
      setIsLoadingWeather(true);
      const w = await fetchLiveWeather(sourceLocation.lat, sourceLocation.lng);
      if (isMounted) {
        setWeatherData(w);
        if (setAmbientTemp && w.temperature) {
          setAmbientTemp(w.temperature);
        }
        setIsLoadingWeather(false);
      }
    };
    loadWeather();
    return () => { isMounted = false; };
  }, [sourceLocation]);

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
    if (!token || !user) {
      setSavedTrips([]);
      return;
    }
    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/routes/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.data) {
        setSavedTrips(response.data.data);
      }
    } catch (err) {
      console.log('MongoDB server offline, using local session memory');
    }
  };

  useEffect(() => {
    if (!token || !user) {
      setSavedTrips([]);
      return;
    }
    fetchSavedTrips();
  }, [user, token]);

  const handleSaveTripToMongo = async () => {
    if (!routeData || !sourceLocation || !destLocation) {
      alert('Please calculate a valid route first.');
      return;
    }

    if (!user || !token) {
      alert('Please sign in or create an account to save trips to your personal dashboard.');
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    try {
      const costData = calculateTripCostAndSavings(routeData.distanceKm);
      await axios.post(`${getApiBaseUrl()}/api/routes/save`, {
        title: `${sourceLocation.city || sourceLocation.displayName.split(',')[0]} to ${destLocation.city || destLocation.displayName.split(',')[0]} Corridor`,
        sourceName: sourceLocation.displayName,
        destName: destLocation.displayName,
        sourceCoords: [sourceLocation.lat, sourceLocation.lng],
        destCoords: [destLocation.lat, destLocation.lng],
        vehicleName: selectedVehicle.name,
        distanceKm: routeData.distanceKm,
        durationMins: routeData.durationMins,
        stopsCount: smartHalts?.length || 0,
        chargingCostINR: costData.evChargingCostINR,
        savedCostINR: costData.savedCostINR
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`⚡ Trip saved to ${user?.name ? user.name.split(' ')[0] + "'s" : 'your'} personal account successfully!`);
      fetchSavedTrips();
    } catch (error) {
      console.error('Save Trip Error:', error);
      alert('Failed to save trip: ' + (error.response?.data?.error || error.message));
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

  // Minimal Collapsed Floating Google Search Pill Mode
  if (isCollapsed) {
    return (
      <div 
        className="fixed top-4 left-4 z-20 font-sans animate-in fade-in duration-200"
        style={{ zIndex: 9995 }}
      >
        <div className="bg-white/95 backdrop-blur-md border border-[#dadce0] p-1.5 px-3 rounded-full shadow-lg flex items-center space-x-2 text-[#202124]">
          <div 
            className="p-1.5 bg-[#1a73e8] text-white rounded-full cursor-pointer shadow-xs"
            onClick={() => setIsCollapsed(false)}
            title="Expand Route Planner"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
          </div>
          <div 
            className="text-xs font-semibold cursor-pointer max-w-[190px] sm:max-w-xs truncate"
            onClick={() => setIsCollapsed(false)}
          >
            <span className="text-[#1a73e8]">{sourceLocation?.city || 'Origin'}</span>
            {waypoints?.filter(w => w.location).length > 0 && (
              <span className="text-amber-600 font-bold mx-1">+{waypoints.filter(w => w.location).length} via</span>
            )}
            <span className="text-[#5f6368] mx-1">➔</span>
            <span className="text-[#1e8e3e]">{destLocation?.city || 'Destination'}</span>
          </div>
          <button
            onClick={() => setIsCollapsed(false)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#202124] text-[11px] font-bold rounded-full transition-all border border-slate-200 flex items-center gap-0.5 cursor-pointer"
          >
            <span>Edit</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full md:w-[400px] h-full bg-white border-r border-[#dadce0] flex flex-col z-20 shadow-md relative font-sans text-[#202124]">
      
      {/* Header - Google Maps Style */}
      <div className="p-3.5 border-b border-[#dadce0] bg-white flex items-center justify-between">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={onReturnToLanding}>
          <div className="p-2 bg-[#1a73e8] text-white rounded-xl shadow-sm font-bold">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[#202124]">
              Charge Nova
            </h1>
            <p className="text-[10px] text-[#5f6368] font-medium">EV Highway Directions</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1.5">
          {user ? (
            <button
              onClick={onOpenDashboard}
              className="px-2.5 py-1.5 bg-[#f8f9fa] hover:bg-slate-100 text-[#1a73e8] rounded-full border border-[#dadce0] transition-all text-xs font-semibold flex items-center gap-1 shadow-sm"
              title="Account Dashboard & Trip Analytics"
            >
              <User className="w-3.5 h-3.5" />
              <span className="max-w-[70px] truncate">{(user?.name || 'Account').split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-2.5 py-1.5 bg-[#f8f9fa] hover:bg-slate-100 text-[#5f6368] hover:text-[#202124] rounded-full border border-[#dadce0] transition-all text-xs font-medium flex items-center gap-1 shadow-sm"
              title="Sign In / Register Account"
            >
              <LogIn className="w-3.5 h-3.5 text-[#1a73e8]" />
              <span>Sign In</span>
            </button>
          )}

          <button
            onClick={onOpenSosModal}
            className="p-1.5 bg-red-50 hover:bg-red-100 text-[#d93025] rounded-full border border-red-200 transition-all text-xs font-bold"
            title="24x7 EV Emergency Helpline"
          >
            <ShieldAlert className="w-4 h-4 text-[#d93025]" />
          </button>

          <button
            onClick={() => setShowSavedTrips(!showSavedTrips)}
            className="p-1.5 bg-[#f8f9fa] hover:bg-slate-100 text-[#1a73e8] rounded-full border border-[#dadce0] transition-all text-xs font-semibold"
            title="View MongoDB Saved Trips"
          >
            <Database className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 bg-[#f8f9fa] hover:bg-slate-100 text-[#5f6368] hover:text-[#202124] rounded-full border border-[#dadce0] transition-all"
            title="Collapse panel to view full map"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        
        {/* Saved Trips Drawer */}
        {showSavedTrips && (
          <div className="bg-[#f8f9fa] p-3 rounded-xl border border-[#dadce0] space-y-2 animate-in fade-in duration-200 shadow-sm">
            <div className="flex justify-between items-center text-xs font-bold text-[#202124]">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#1a73e8]" /> 
                {user ? `${(user.name || 'Account').split(' ')[0]}'s Saved Trips` : 'Saved Trips'}
              </span>
              <button onClick={() => setShowSavedTrips(false)} className="text-[#5f6368] hover:text-[#202124] cursor-pointer">✕</button>
            </div>
            {!user ? (
              <div className="p-3 text-center bg-white rounded-lg border border-[#dadce0] space-y-2">
                <p className="text-[11px] text-[#5f6368]">Sign in to access your personal saved routes.</p>
                <button
                  onClick={() => { setShowSavedTrips(false); if (onOpenAuthModal) onOpenAuthModal(); }}
                  className="px-3 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[11px] font-semibold rounded-full shadow-sm cursor-pointer transition-all"
                >
                  Sign In / Sign Up
                </button>
              </div>
            ) : savedTrips.length > 0 ? (
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {savedTrips.map((t, idx) => (
                  <button
                    key={t._id || idx}
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
                    className="w-full text-left p-2 bg-white hover:bg-blue-50 rounded-lg text-[11px] flex justify-between items-center text-[#202124] border border-[#dadce0] transition-colors cursor-pointer"
                  >
                    <span className="truncate font-medium max-w-[210px]">{t.title || `${t.sourceName} ➔ ${t.destName}`}</span>
                    <span className="text-[#1a73e8] font-mono font-bold shrink-0">{t.distanceKm} km</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-[#5f6368] p-2 bg-white rounded-lg border border-[#dadce0] text-center">
                No trips saved to your account yet.
              </div>
            )}
          </div>
        )}


        {/* EV Model Preset */}
        <div className="space-y-1.5 bg-[#f8f9fa] p-3 rounded-xl border border-[#dadce0]">
          <div className="flex items-center justify-between text-xs font-bold text-[#5f6368] uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-[#1a73e8]" /> EV Vehicle</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={onOpenBatteryHealthModal}
                className="text-[10px] text-[#1a73e8] hover:underline font-semibold bg-white px-2 py-0.5 rounded border border-[#dadce0]"
                title="View Battery Health (SOH) Degradation"
              >
                Battery Health
              </button>
              <button
                onClick={onOpenCustomVehicleModal}
                className="text-[10px] text-[#202124] hover:text-[#1a73e8] font-semibold bg-white px-2 py-0.5 rounded border border-[#dadce0]"
                title="Add Custom EV Model"
              >
                + Custom
              </button>
            </div>
          </div>
          
          <select
            value={selectedVehicle.id}
            onChange={handleVehicleChange}
            className="w-full bg-white border border-[#dadce0] rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#202124] focus:outline-none focus:border-[#1a73e8] cursor-pointer"
          >
            {evPresetsList.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name} ({preset.range} km • {preset.battery} kWh)
              </option>
            ))}
          </select>
        </div>

        {/* Preferred CPO Network Filter (India) */}
        <div className="space-y-1.5 bg-[#f8f9fa] p-3 rounded-xl border border-[#dadce0]">
          <div className="flex items-center justify-between text-xs font-bold text-[#5f6368] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> CPO Network Filter
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              🇮🇳 India
            </span>
          </div>
          <select
            value={selectedNetwork || 'All Networks'}
            onChange={(e) => setSelectedNetwork && setSelectedNetwork(e.target.value)}
            className="w-full bg-white border border-[#dadce0] rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#202124] focus:outline-none focus:border-[#1a73e8] cursor-pointer"
          >
            {INDIAN_CPO_NETWORKS.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-[#5f6368]">
            Filters highway fast-chargers prioritizing selected charging provider.
          </p>
        </div>

        {/* Source & Destination Search - Classic Directions Style */}
        <div className="space-y-2.5 bg-[#f8f9fa] p-3.5 rounded-xl border border-[#dadce0]">
          
          {/* Starting Location */}
          <div className="space-y-1 relative">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#5f6368] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#1e8e3e]" /> Origin
              </label>
              
              <button
                onClick={handleFetchCurrentLocation}
                disabled={isLocatingUser}
                className="text-[10px] font-semibold text-[#1a73e8] hover:underline flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-[#dadce0]"
              >
                {isLocatingUser ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Crosshair className="w-3 h-3 text-[#1a73e8]" />
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
                placeholder="Choose starting point or live GPS"
                className="w-full bg-white border border-[#dadce0] rounded-lg pl-3 pr-8 py-2 text-xs text-[#202124] placeholder-[#5f6368] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
              />
              {isSearchingSource ? (
                <Loader2 className="w-3.5 h-3.5 text-[#1a73e8] animate-spin absolute right-2.5 top-2.5" />
              ) : (
                <Search className="w-3.5 h-3.5 text-[#5f6368] absolute right-2.5 top-2.5" />
              )}
            </div>

            {sourceSuggestions.length > 0 && !sourceLocation && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#dadce0] rounded-xl shadow-xl max-h-40 overflow-y-auto z-30 divide-y divide-[#dadce0]">
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
                    className="w-full text-left px-2.5 py-2 text-[11px] text-[#202124] hover:bg-slate-50 flex items-start space-x-2"
                  >
                    <MapPin className="w-3 h-3 text-[#1e8e3e] mt-0.5 shrink-0" />
                    <span className="truncate">{item.displayName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Intermediate Waypoints / Via Stops */}
          {waypoints && waypoints.length > 0 && (
            <div className="space-y-2.5 pt-1 border-t border-b border-dashed border-[#dadce0] py-2">
              {waypoints.map((wp, idx) => (
                <WaypointRow
                  key={idx}
                  index={idx}
                  wp={wp}
                  onUpdate={(updatedWp) => {
                    const next = [...waypoints];
                    next[idx] = updatedWp;
                    setWaypoints(next);
                  }}
                  onRemove={() => {
                    setWaypoints(waypoints.filter((_, i) => i !== idx));
                  }}
                />
              ))}
            </div>
          )}

          {/* Add Via Stop Button */}
          {(!waypoints || waypoints.length < 3) && (
            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={() => {
                  const currentWps = waypoints || [];
                  if (currentWps.length < 3 && setWaypoints) {
                    setWaypoints([...currentWps, { query: '', location: null }]);
                  }
                }}
                className="text-[11px] font-semibold text-[#1a73e8] hover:text-[#1557b0] flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded-md border border-[#dadce0] hover:bg-slate-50 transition-all shadow-xs"
              >
                <Plus className="w-3 h-3 text-[#1a73e8]" />
                <span>+ Add Via Stop ({waypoints ? waypoints.length : 0}/3)</span>
              </button>
            </div>
          )}

          {/* Destination */}
          <div className="space-y-1 relative">
            <label className="text-[11px] font-semibold text-[#5f6368] flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-[#d93025]" /> Destination
            </label>
            <div className="relative">
              <input
                type="text"
                value={destQuery}
                onChange={(e) => {
                  setDestQuery(e.target.value);
                  setDestLocation(null);
                }}
                placeholder="Choose destination"
                className="w-full bg-white border border-[#dadce0] rounded-lg pl-3 pr-8 py-2 text-xs text-[#202124] placeholder-[#5f6368] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
              />
              {isSearchingDest ? (
                <Loader2 className="w-3.5 h-3.5 text-[#d93025] animate-spin absolute right-2.5 top-2.5" />
              ) : (
                <Search className="w-3.5 h-3.5 text-[#5f6368] absolute right-2.5 top-2.5" />
              )}
            </div>

            {destSuggestions.length > 0 && !destLocation && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#dadce0] rounded-xl shadow-xl max-h-40 overflow-y-auto z-30 divide-y divide-[#dadce0]">
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
                    className="w-full text-left px-2.5 py-2 text-[11px] text-[#202124] hover:bg-slate-50 flex items-start space-x-2"
                  >
                    <Navigation className="w-3 h-3 text-[#d93025] mt-0.5 shrink-0" />
                    <span className="truncate">{item.displayName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Highway Weather & Climate Section */}
        <div className="space-y-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#dadce0]">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-[#5f6368] uppercase tracking-wider flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-[#5f6368]" /> 
              <span>Live Highway Weather</span>
            </div>
            <span className="text-[9px] text-[#1a73e8] font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Open-Meteo Live
            </span>
          </div>

          {weatherData ? (
            <div className="bg-white p-2.5 rounded-lg border border-[#dadce0] flex items-center justify-between text-xs shadow-xs">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{weatherData.icon}</span>
                <div>
                  <div className="font-bold text-[#202124]">
                    {weatherData.temperature}°C • {weatherData.label}
                  </div>
                  <div className="text-[10px] text-[#5f6368]">
                    Wind {weatherData.windSpeed} km/h • Range Load: {weatherData.penaltyPercent > 0 ? `-${weatherData.penaltyPercent}%` : 'Optimal'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (sourceLocation?.lat) {
                    setIsLoadingWeather(true);
                    const w = await fetchLiveWeather(sourceLocation.lat, sourceLocation.lng);
                    setWeatherData(w);
                    if (setAmbientTemp && w.temperature) setAmbientTemp(w.temperature);
                    setIsLoadingWeather(false);
                  }
                }}
                className="text-[10px] text-[#1a73e8] hover:underline font-semibold cursor-pointer shrink-0 ml-1"
                title="Refresh Live Weather"
              >
                {isLoadingWeather ? '...' : '↻ Refresh'}
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-[#5f6368] bg-white p-2 rounded-lg border border-[#dadce0]">
              Detecting origin highway weather...
            </div>
          )}

          {/* AC Setting Buttons */}
          <div className="pt-0.5">
            <div className="text-[10px] font-semibold text-[#5f6368] mb-1">Cabin AC Setting</div>
            <div className="grid grid-cols-3 gap-1">
              {['Off', 'Normal AC', 'Max AC'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAcMode(mode)}
                  className={`py-1 text-[10px] font-semibold rounded-md border transition-all cursor-pointer ${
                    acMode === mode
                      ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-sm'
                      : 'bg-white text-[#5f6368] border-[#dadce0] hover:bg-slate-50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Range & Buffer Sliders */}
        <div className="space-y-2.5 bg-[#f8f9fa] p-3 rounded-xl border border-[#dadce0]">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-semibold">
              <span className="text-[#3c4043] flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-[#1e8e3e]" /> Starting Range
              </span>
              <span className="text-[#1a73e8] font-bold">{currentRange} km</span>
            </div>
            <input
              type="range"
              min="30"
              max={selectedVehicle.range}
              value={currentRange}
              onChange={(e) => setCurrentRange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1a73e8]"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-semibold">
              <span className="text-[#3c4043] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1a73e8]" /> Reserve Buffer SOC
              </span>
              <span className="text-[#1a73e8] font-bold">{minSocBuffer}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={minSocBuffer}
              onChange={(e) => setMinSocBuffer(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1a73e8]"
            />
          </div>
        </div>

        {/* Submit & Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onPlanRoute}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Optimizing Highway Route...</span>
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
                className="py-1.5 bg-white hover:bg-slate-50 border border-[#dadce0] text-[#3c4043] rounded-lg font-semibold transition-all shadow-sm truncate"
              >
                Save Trip
              </button>

              <button
                onClick={onOpenExportModal}
                className="py-1.5 bg-white hover:bg-slate-50 border border-[#dadce0] text-[#3c4043] rounded-lg font-semibold transition-all shadow-sm truncate"
              >
                Export PDF
              </button>

              <button
                onClick={onOpenPassengerQrModal}
                className="py-1.5 bg-white hover:bg-slate-50 border border-[#dadce0] text-[#3c4043] rounded-lg font-semibold transition-all flex items-center justify-center gap-1 shadow-sm truncate"
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
