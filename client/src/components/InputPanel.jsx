import React, { useState, useEffect } from 'react';
import { 
  Zap, MapPin, Navigation, Car, ShieldCheck, Gauge, 
  Crosshair, Thermometer, Database, ShieldAlert, QrCode, 
  Search, User, LogIn, ChevronLeft, ChevronRight, Plus, 
  Sliders, ChevronDown, Check, Clock, TrendingDown,
  CheckCircle2, RefreshCw
} from 'lucide-react';
import { searchLocation, getBestUserLocation } from '../services/nominatimService';
import axios from 'axios';
import { getApiBaseUrl } from '../services/apiConfig';
import { calculateTripCostAndSavings } from '../utils/costSavingsMath';
import { INDIAN_CPO_NETWORKS } from '../services/openChargeMapService';
import { fetchLiveWeather } from '../services/weatherService';
import { useToast } from './Toast';
import { SkeletonListItem } from './Skeleton';

export const INITIAL_EV_PRESETS = [
  { id: 'nexon', name: 'Tata Nexon EV Max', range: 437, battery: 40.5, plug: 'CCS2' },
  { id: 'zs', name: 'MG ZS EV Long Range', range: 461, battery: 50.3, plug: 'CCS2' },
  { id: 'ioniq', name: 'Hyundai Ioniq 5', range: 631, battery: 72.6, plug: 'CCS2' },
  { id: 'xuv', name: 'Mahindra XUV400', range: 456, battery: 39.4, plug: 'CCS2' },
  { id: 'atto', name: 'BYD Atto 3', range: 521, battery: 60.48, plug: 'CCS2' },
];

function WaypointRow({ index, wp, onUpdate, onRemove, isDark = false }) {
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
        <label className="text-[11px] font-semibold text-ink-secondary flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-warning text-white text-[9px] font-extrabold flex items-center justify-center">
            {index + 1}
          </span>
          <span>Via Stop {index + 1}</span>
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="text-[10px] text-danger hover:underline font-semibold cursor-pointer"
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
          placeholder="Intermediate town or highway stop"
          className={`w-full rounded-lg pl-3 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary border ${
            isDark 
              ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.15)] text-[#e2e8f0] placeholder-[#64748b]' 
              : 'bg-white border-surface-border text-ink placeholder-ink-tertiary'
          }`}
        />
        <Search className="w-3.5 h-3.5 text-ink-tertiary absolute right-2.5 top-2.5" />
      </div>

      {isSearching && (
        <div className={`absolute left-0 right-0 top-full mt-1 rounded-xl border shadow-card-lg max-h-40 overflow-y-auto z-30 divide-y ${
          isDark ? 'bg-[#111827] border-[rgba(34,211,238,0.2)] divide-[rgba(34,211,238,0.1)]' : 'bg-white border-surface-border divide-surface-border'
        }`}>
          <SkeletonListItem />
          <SkeletonListItem />
        </div>
      )}

      {suggestions.length > 0 && !wp.location && !isSearching && (
        <div className={`absolute left-0 right-0 top-full mt-1 rounded-xl border shadow-card-lg max-h-40 overflow-y-auto z-30 divide-y ${
          isDark ? 'bg-[#111827] border-[rgba(34,211,238,0.2)] divide-[rgba(34,211,238,0.1)]' : 'bg-white border-surface-border divide-surface-border'
        }`}>
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
              className={`w-full text-left px-2.5 py-2 text-[11px] flex items-start space-x-2 cursor-pointer ${
                isDark ? 'text-[#e2e8f0] hover:bg-[#1a2035]' : 'text-ink hover:bg-surface-subtle'
              }`}
            >
              <MapPin className="w-3 h-3 text-warning mt-0.5 shrink-0" />
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
  setSelectedNetwork,
  isDark = false,
  onCloseMobilePlan,
}) {
  const toast = useToast();
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Live Highway Weather State
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
    } catch (err) {}
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
      toast.warning('Please calculate a valid highway route first.');
      return;
    }

    if (!user || !token) {
      toast.info('Sign in to save corridors to your personal dashboard.');
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
      toast.success('Corridor saved to your account!');
      fetchSavedTrips();
    } catch (error) {
      toast.error('Failed to save trip: ' + (error.response?.data?.error || error.message));
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
      toast.success('Found current location');
    } catch (error) {
      toast.error('Could not access live GPS location.');
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

  // Surface tokens
  const panelBg = isDark 
    ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.15)] text-[#e2e8f0]' 
    : 'bg-white border-surface-border text-ink';

  const cardSurface = isDark
    ? 'bg-[#111827] border-[rgba(34,211,238,0.12)]'
    : 'bg-surface-muted border-surface-border';

  const inputClass = isDark
    ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.15)] text-[#e2e8f0] placeholder-[#64748b] focus:border-primary'
    : 'bg-white border-surface-border text-ink placeholder-ink-tertiary focus:border-primary';

  // Minimal Collapsed Floating Pill Mode
  if (isCollapsed) {
    return (
      <div 
        className="fixed top-4 left-4 z-20 font-sans"
        style={{ zIndex: 9995 }}
      >
        <div className={`p-1.5 px-3 rounded-full shadow-card-md flex items-center space-x-2 border backdrop-blur-md ${
          isDark 
            ? 'bg-[#0b0f19]/90 border-[rgba(34,211,238,0.2)] text-[#e2e8f0]' 
            : 'bg-white/95 border-surface-border text-ink'
        }`}>
          <div 
            className="p-1.5 bg-primary text-white rounded-full cursor-pointer shadow-card"
            onClick={() => setIsCollapsed(false)}
            title="Expand Route Planner"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
          </div>
          <div 
            className="text-xs font-semibold cursor-pointer max-w-[190px] sm:max-w-xs truncate"
            onClick={() => setIsCollapsed(false)}
          >
            <span className="text-primary">{sourceLocation?.city || 'Origin'}</span>
            {waypoints?.filter(w => w.location).length > 0 && (
              <span className="text-warning font-bold mx-1">+{waypoints.filter(w => w.location).length}</span>
            )}
            <span className="text-ink-tertiary mx-1">➔</span>
            <span className="text-success">{destLocation?.city || 'Destination'}</span>
          </div>
          <button
            onClick={() => setIsCollapsed(false)}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all border flex items-center gap-0.5 cursor-pointer ${
              isDark 
                ? 'bg-[#1a2035] text-[#e2e8f0] border-[rgba(34,211,238,0.15)] hover:bg-[#22d3ee]/10' 
                : 'bg-surface-subtle text-ink border-surface-border hover:bg-slate-200'
            }`}
          >
            <span>Edit</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Calculated route quick metrics
  const tripHours = routeData ? Math.floor(routeData.durationMins / 60) : 0;
  const tripMins = routeData ? routeData.durationMins % 60 : 0;
  const costPreview = routeData ? calculateTripCostAndSavings(routeData.distanceKm) : null;

  return (
    <aside className={`w-full md:w-[380px] h-full border-r flex flex-col z-20 shadow-card-md relative font-sans transition-colors ${panelBg}`}>
      
      {/* Header */}
      <div className={`p-3.5 border-b flex items-center justify-between ${isDark ? 'border-[rgba(34,211,238,0.12)] bg-[#0b0f19]' : 'border-surface-border bg-white'}`}>
        <div className="flex items-center space-x-2">
          {onCloseMobilePlan && (
            <button
              onClick={onCloseMobilePlan}
              className="md:hidden px-2.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold flex items-center gap-1 cursor-pointer mr-1"
              title="Return to Map"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Map</span>
            </button>
          )}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={onReturnToLanding}>
            <div className="p-2 bg-primary text-white rounded-xl shadow-card font-bold">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Charge Nova</h1>
              <p className="text-[10px] text-ink-secondary font-medium">EV Highway Directions</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1.5">
          {user ? (
            <button
              onClick={onOpenDashboard}
              className={`px-2.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1 shadow-card transition-all ${
                isDark 
                  ? 'bg-[#1a2035] border-[rgba(34,211,238,0.2)] text-primary hover:bg-[#22d3ee]/10' 
                  : 'bg-surface-muted border-surface-border text-primary hover:bg-surface-subtle'
              }`}
              title="Account Dashboard"
            >
              <User className="w-3.5 h-3.5" />
              <span className="max-w-[70px] truncate">{(user?.name || 'Account').split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className={`px-2.5 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1 shadow-card transition-all ${
                isDark 
                  ? 'bg-[#1a2035] border-[rgba(34,211,238,0.15)] text-[#e2e8f0]' 
                  : 'bg-surface-muted border-surface-border text-ink-secondary hover:text-ink'
              }`}
              title="Sign In"
            >
              <LogIn className="w-3.5 h-3.5 text-primary" />
              <span>Sign In</span>
            </button>
          )}

          <button
            onClick={onOpenSosModal}
            className="p-1.5 bg-danger/10 hover:bg-danger/20 text-danger rounded-full border border-danger/20 transition-all text-xs font-bold"
            title="Emergency SOS"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowSavedTrips(!showSavedTrips)}
            className={`p-1.5 rounded-full border transition-all text-xs font-semibold ${
              isDark 
                ? 'bg-[#1a2035] border-[rgba(34,211,238,0.15)] text-primary' 
                : 'bg-surface-muted border-surface-border text-primary hover:bg-surface-subtle'
            }`}
            title="Saved Trips"
          >
            <Database className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsCollapsed(true)}
            className={`p-1.5 rounded-full border transition-all ${
              isDark 
                ? 'bg-[#1a2035] border-[rgba(34,211,238,0.15)] text-ink-secondary hover:text-[#e2e8f0]' 
                : 'bg-surface-muted border-surface-border text-ink-secondary hover:text-ink hover:bg-surface-subtle'
            }`}
            title="Collapse panel"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        
        {/* Saved Trips Drawer */}
        {showSavedTrips && (
          <div className={`p-3 rounded-xl border space-y-2 shadow-card ${cardSurface}`}>
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1.5 text-primary">
                <Database className="w-3.5 h-3.5" /> 
                {user ? `${(user.name || 'Account').split(' ')[0]}'s Saved Trips` : 'Saved Trips'}
              </span>
              <button onClick={() => setShowSavedTrips(false)} className="text-ink-secondary hover:text-ink">✕</button>
            </div>
            {!user ? (
              <div className={`p-3 text-center rounded-lg border space-y-2 ${isDark ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.1)]' : 'bg-white border-surface-border'}`}>
                <p className="text-[11px] text-ink-secondary">Sign in to access your personal saved routes.</p>
                <button
                  onClick={() => { setShowSavedTrips(false); if (onOpenAuthModal) onOpenAuthModal(); }}
                  className="px-3 py-1 bg-primary hover:bg-primary-700 text-white text-[11px] font-semibold rounded-full shadow-card transition-all"
                >
                  Sign In
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
                    className={`w-full text-left p-2 rounded-lg text-[11px] flex justify-between items-center border transition-colors cursor-pointer ${
                      isDark 
                        ? 'bg-[#0b0f19] hover:bg-[#1a2035] border-[rgba(34,211,238,0.1)] text-[#e2e8f0]' 
                        : 'bg-white hover:bg-primary/5 border-surface-border text-ink'
                    }`}
                  >
                    <span className="truncate font-medium max-w-[210px]">{t.title || `${t.sourceName} ➔ ${t.destName}`}</span>
                    <span className="text-primary font-mono font-bold shrink-0">{t.distanceKm} km</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className={`text-[11px] text-ink-secondary p-2 rounded-lg border text-center ${isDark ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.1)]' : 'bg-white border-surface-border'}`}>
                No trips saved to your account yet.
              </div>
            )}
          </div>
        )}

        {/* Calculated Route Mini-Summary (If route is present) */}
        {routeData && (
          <div className={`p-3 rounded-xl border space-y-1.5 shadow-card ${
            isDark ? 'bg-primary/10 border-primary/20 text-[#e2e8f0]' : 'bg-primary/5 border-primary/20 text-ink'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Route Optimized
              </span>
              <span className="font-mono text-primary font-bold">{routeData.distanceKm} km</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-ink-secondary">
              <span>{tripHours}h {tripMins}m driving • {smartHalts.length} halt{smartHalts.length !== 1 ? 's' : ''}</span>
              {costPreview && <span className="font-semibold text-success">Save ₹{costPreview.savedCostINR}</span>}
            </div>
          </div>
        )}

        {/* EV Model Selection */}
        <div className={`space-y-1.5 p-3 rounded-xl border ${cardSurface}`}>
          <div className="flex items-center justify-between text-xs font-bold text-ink-secondary uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-primary"><Car className="w-3.5 h-3.5" /> EV Vehicle</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={onOpenBatteryHealthModal}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                  isDark 
                    ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.15)] text-[#e2e8f0] hover:text-primary' 
                    : 'bg-white border-surface-border text-primary hover:underline'
                }`}
                title="Battery Health Degradation Curves"
              >
                Battery Health
              </button>
              <button
                onClick={onOpenCustomVehicleModal}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                  isDark 
                    ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.15)] text-[#e2e8f0] hover:text-primary' 
                    : 'bg-white border-surface-border text-ink hover:text-primary'
                }`}
                title="Add Custom EV"
              >
                + Custom
              </button>
            </div>
          </div>
          
          <select
            value={selectedVehicle.id}
            onChange={handleVehicleChange}
            className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary border cursor-pointer ${inputClass}`}
          >
            {evPresetsList.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name} ({preset.range} km • {preset.battery} kWh)
              </option>
            ))}
          </select>
        </div>

        {/* Source & Destination Search */}
        <div className={`space-y-2.5 p-3.5 rounded-xl border ${cardSurface}`}>
          
          {/* Origin */}
          <div className="space-y-1 relative">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-ink-secondary flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-success" /> Origin
              </label>
              
              <button
                onClick={handleFetchCurrentLocation}
                disabled={isLocatingUser}
                className={`text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded border transition-all ${
                  isDark 
                    ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.15)] text-primary hover:bg-[#1a2035]' 
                    : 'bg-white border-surface-border text-primary hover:underline'
                }`}
              >
                <Crosshair className="w-3 h-3 text-primary" />
                <span>{isLocatingUser ? 'Locating...' : 'My Location'}</span>
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
                placeholder="Choose starting point or GPS"
                className={`w-full rounded-lg pl-3 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary border ${inputClass}`}
              />
              <Search className="w-3.5 h-3.5 text-ink-tertiary absolute right-2.5 top-2.5" />
            </div>

            {isSearchingSource && (
              <div className={`absolute left-0 right-0 top-full mt-1 rounded-xl border shadow-card-lg max-h-40 overflow-y-auto z-30 divide-y ${
                isDark ? 'bg-[#111827] border-[rgba(34,211,238,0.2)] divide-[rgba(34,211,238,0.1)]' : 'bg-white border-surface-border divide-surface-border'
              }`}>
                <SkeletonListItem />
                <SkeletonListItem />
              </div>
            )}

            {sourceSuggestions.length > 0 && !sourceLocation && !isSearchingSource && (
              <div className={`absolute left-0 right-0 top-full mt-1 rounded-xl border shadow-card-lg max-h-40 overflow-y-auto z-30 divide-y ${
                isDark ? 'bg-[#111827] border-[rgba(34,211,238,0.2)] divide-[rgba(34,211,238,0.1)]' : 'bg-white border-surface-border divide-surface-border'
              }`}>
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
                    className={`w-full text-left px-2.5 py-2 text-[11px] flex items-start space-x-2 cursor-pointer ${
                      isDark ? 'text-[#e2e8f0] hover:bg-[#1a2035]' : 'text-ink hover:bg-surface-subtle'
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-success mt-0.5 shrink-0" />
                    <span className="truncate">{item.displayName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Waypoints */}
          {waypoints && waypoints.length > 0 && (
            <div className={`space-y-2.5 pt-1 border-t border-b border-dashed py-2 ${isDark ? 'border-[rgba(34,211,238,0.15)]' : 'border-surface-border'}`}>
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
                  isDark={isDark}
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
                className={`text-[11px] font-semibold text-primary flex items-center gap-1 cursor-pointer px-2 py-1 rounded-md border transition-all ${
                  isDark ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.15)] hover:bg-[#1a2035]' : 'bg-white border-surface-border hover:bg-surface-subtle shadow-card'
                }`}
              >
                <Plus className="w-3 h-3" />
                <span>+ Add Via Stop ({waypoints ? waypoints.length : 0}/3)</span>
              </button>
            </div>
          )}

          {/* Destination */}
          <div className="space-y-1 relative">
            <label className="text-[11px] font-semibold text-ink-secondary flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-danger" /> Destination
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
                className={`w-full rounded-lg pl-3 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary border ${inputClass}`}
              />
              <Search className="w-3.5 h-3.5 text-ink-tertiary absolute right-2.5 top-2.5" />
            </div>

            {isSearchingDest && (
              <div className={`absolute left-0 right-0 top-full mt-1 rounded-xl border shadow-card-lg max-h-40 overflow-y-auto z-30 divide-y ${
                isDark ? 'bg-[#111827] border-[rgba(34,211,238,0.2)] divide-[rgba(34,211,238,0.1)]' : 'bg-white border-surface-border divide-surface-border'
              }`}>
                <SkeletonListItem />
                <SkeletonListItem />
              </div>
            )}

            {destSuggestions.length > 0 && !destLocation && !isSearchingDest && (
              <div className={`absolute left-0 right-0 top-full mt-1 rounded-xl border shadow-card-lg max-h-40 overflow-y-auto z-30 divide-y ${
                isDark ? 'bg-[#111827] border-[rgba(34,211,238,0.2)] divide-[rgba(34,211,238,0.1)]' : 'bg-white border-surface-border divide-surface-border'
              }`}>
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
                    className={`w-full text-left px-2.5 py-2 text-[11px] flex items-start space-x-2 cursor-pointer ${
                      isDark ? 'text-[#e2e8f0] hover:bg-[#1a2035]' : 'text-ink hover:bg-surface-subtle'
                    }`}
                  >
                    <Navigation className="w-3 h-3 text-danger mt-0.5 shrink-0" />
                    <span className="truncate">{item.displayName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Starting Range Slider (Essential) */}
        <div className={`space-y-1.5 p-3 rounded-xl border ${cardSurface}`}>
          <div className="flex justify-between items-center text-[11px] font-semibold">
            <span className="flex items-center gap-1 text-ink-secondary">
              <Gauge className="w-3.5 h-3.5 text-success" /> Starting Range
            </span>
            <span className="text-primary font-bold">{currentRange} km</span>
          </div>
          <input
            type="range"
            min="30"
            max={selectedVehicle.range}
            value={currentRange}
            onChange={(e) => setCurrentRange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Progressive Disclosure Toggle: Advanced Parameters & Climate */}
        <div className={`rounded-xl border overflow-hidden ${cardSurface}`}>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full p-3 text-left flex items-center justify-between text-xs font-bold text-ink-secondary hover:text-ink transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" />
              <span>Advanced Corridor Options & Weather</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180 text-primary' : ''}`} />
          </button>

          {showAdvanced && (
            <div className={`p-3 border-t space-y-3 ${isDark ? 'border-[rgba(34,211,238,0.1)]' : 'border-surface-border'}`}>
              
              {/* Reserve Buffer Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-semibold">
                  <span className="flex items-center gap-1 text-ink-secondary">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Reserve Buffer SOC
                  </span>
                  <span className="text-primary font-bold">{minSocBuffer}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={minSocBuffer}
                  onChange={(e) => setMinSocBuffer(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* CPO Network Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-ink-secondary uppercase tracking-wider">
                  Prioritize CPO Network (India)
                </label>
                <select
                  value={selectedNetwork || 'All Networks'}
                  onChange={(e) => setSelectedNetwork && setSelectedNetwork(e.target.value)}
                  className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary border ${inputClass}`}
                >
                  {INDIAN_CPO_NETWORKS.map((network) => (
                    <option key={network} value={network}>
                      {network}
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Highway Weather */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-ink-secondary uppercase tracking-wider flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5" /> Origin Climate
                  </span>
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
                    className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingWeather ? 'animate-spin' : ''}`} /> Refresh
                  </button>
                </div>

                {weatherData && (
                  <div className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                    isDark ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.1)]' : 'bg-white border-surface-border'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{weatherData.icon}</span>
                      <div>
                        <div className="font-bold">{weatherData.temperature}°C • {weatherData.label}</div>
                        <div className="text-[10px] text-ink-secondary">
                          Wind: {weatherData.windSpeed} km/h • Load: {weatherData.penaltyPercent > 0 ? `-${weatherData.penaltyPercent}%` : 'Optimal'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cabin AC mode */}
                <div className="pt-1">
                  <div className="text-[10px] font-semibold text-ink-secondary mb-1">Cabin AC Setting</div>
                  <div className="grid grid-cols-3 gap-1">
                    {['Off', 'Normal AC', 'Max AC'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setAcMode(mode)}
                        className={`py-1 text-[10px] font-semibold rounded-md border transition-all ${
                          acMode === mode
                            ? 'bg-primary text-white border-primary shadow-card'
                            : isDark ? 'bg-[#0b0f19] text-[#94a3b8] border-[rgba(34,211,238,0.15)] hover:text-[#e2e8f0]' : 'bg-white text-ink-secondary border-surface-border hover:bg-surface-subtle'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Submit & Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onPlanRoute}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary-700 text-white font-semibold rounded-full shadow-card hover:shadow-card-md transition-all flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{isLoading ? 'Optimizing Corridor...' : 'Plan Live Highway Route'}</span>
          </button>

          {routeData && (
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button
                onClick={handleSaveTripToMongo}
                className={`py-1.5 border rounded-lg font-semibold transition-all shadow-card truncate ${
                  isDark ? 'bg-[#1a2035] border-[rgba(34,211,238,0.15)] text-[#e2e8f0] hover:bg-[#22d3ee]/10' : 'bg-white border-surface-border text-ink hover:bg-surface-subtle'
                }`}
              >
                Save Trip
              </button>

              <button
                onClick={onOpenExportModal}
                className={`py-1.5 border rounded-lg font-semibold transition-all shadow-card truncate ${
                  isDark ? 'bg-[#1a2035] border-[rgba(34,211,238,0.15)] text-[#e2e8f0] hover:bg-[#22d3ee]/10' : 'bg-white border-surface-border text-ink hover:bg-surface-subtle'
                }`}
              >
                Export PDF
              </button>

              <button
                onClick={onOpenPassengerQrModal}
                className={`py-1.5 border rounded-lg font-semibold transition-all flex items-center justify-center gap-1 shadow-card truncate ${
                  isDark ? 'bg-[#1a2035] border-[rgba(34,211,238,0.15)] text-[#e2e8f0] hover:bg-[#22d3ee]/10' : 'bg-white border-surface-border text-ink hover:bg-surface-subtle'
                }`}
              >
                <QrCode className="w-3 h-3" /> QR Pass
              </button>
            </div>
          )}

          {onCloseMobilePlan && (
            <button
              onClick={onCloseMobilePlan}
              className="w-full mt-2.5 py-2.5 bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-bold md:hidden flex items-center justify-center gap-1.5 shadow-card transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Done & View on Map</span>
            </button>
          )}
        </div>

      </div>
    </aside>
  );
}
