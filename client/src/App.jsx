import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import AccountDashboardModal from './components/AccountDashboardModal';
import InputPanel, { INITIAL_EV_PRESETS } from './components/InputPanel';
import RouteSummary from './components/RouteSummary';
import SimulatorControl from './components/SimulatorControl';
import StationModal from './components/StationModal';
import NavigationBanner from './components/NavigationBanner';
import TrafficLegend from './components/TrafficLegend';
import ExportModal from './components/ExportModal';
import MapToolbar from './components/MapToolbar';
import SpeedAlert from './components/SpeedAlert';
import SosModal from './components/SosModal';
import FatigueAlert from './components/FatigueAlert';
import BatteryHealthModal from './components/BatteryHealthModal';
import CustomVehicleModal from './components/CustomVehicleModal';
import PassengerQrModal from './components/PassengerQrModal';
import NovaAiAssistant from './components/NovaAiAssistant';

import { getRouteFromOSRM } from './services/osrmService';
import { calculateSmartHalts } from './utils/chargingAlgorithm';
import { reverseGeocode, getBestUserLocation } from './services/nominatimService';
import { calculateDistanceKm } from './services/openChargeMapService';
import { fetchLiveRouteTraffic } from './services/liveTrafficService';
import { checkSpeedCameraAlert } from './utils/speedCameraService';

// Leaflet Default Marker Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Station Marker Icon - Google Maps Style
const createStationIcon = (isHalt = false) => L.divIcon({
  className: 'custom-station-icon',
  html: `<div class="${isHalt ? 'bg-amber-500 text-white shadow-amber-500/40 ring-4 ring-amber-100' : 'bg-emerald-600 text-white shadow-emerald-600/30 ring-4 ring-emerald-100'} p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
         </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17]
});

// Destination Marker Icon - Google Maps Red Pin
const destIcon = L.divIcon({
  className: 'custom-dest-icon',
  html: `<div class="bg-[#d93025] text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center ring-4 ring-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
         </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17]
});

// Animated EV Car Marker Icon - Google Blue Navigation Puck
const createCarIcon = (heading = 0) => L.divIcon({
  className: 'custom-car-icon',
  html: `<div style="transform: rotate(${heading}deg); transition: transform 0.3s ease-out;" class="bg-[#1a73e8] text-white p-2.5 rounded-full shadow-xl ring-4 ring-blue-100 border-2 border-white flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
         </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// Turn Step Marker Icon
const activeTurnIcon = L.divIcon({
  className: 'custom-active-turn-icon',
  html: `<div class="bg-[#1a73e8] text-white p-2 rounded-full shadow-lg ring-4 ring-blue-100 border-2 border-white flex items-center justify-center animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
         </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Smooth Camera Follow Controller
function MapBoundsController({ bounds, center, zoom, carCoords, autoFollowCar, isNavigating }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  
  useEffect(() => {
    if (isNavigating && autoFollowCar && carCoords) {
      map.panTo(carCoords, { animate: true, duration: 0.4 });
    } else if (bounds && bounds.isValid() && !isNavigating) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13, animate: true, duration: 1.2 });
    } else if (center && !isNavigating) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [bounds, center, zoom, carCoords, autoFollowCar, isNavigating, map]);

  return null;
}

export default function App() {
  // View & Auth State
  const [activeView, setActiveView] = useState('landing'); // 'landing' or 'planner'
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('charge_nova_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('charge_nova_token') || null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);

  const handleAuthSuccess = (userObj, tokenStr) => {
    setUser(userObj);
    setToken(tokenStr);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('charge_nova_user');
    localStorage.removeItem('charge_nova_token');
    setShowDashboardModal(false);
  };

  const handleLoadTripOnMap = (src, dst) => {
    setSourceLocation(src);
    setDestLocation(dst);
    handlePlanRoute(src, dst);
    setActiveView('planner');
    setShowDashboardModal(false);
  };

  // Input State & Presets List
  const [evPresetsList, setEvPresetsList] = useState(INITIAL_EV_PRESETS);
  const [selectedVehicle, setSelectedVehicle] = useState(INITIAL_EV_PRESETS[0]);
  const [currentRange, setCurrentRange] = useState(INITIAL_EV_PRESETS[0].range);
  const [minSocBuffer, setMinSocBuffer] = useState(15);
  const [selectedPlug, setSelectedPlug] = useState('CCS2');
  const [acMode, setAcMode] = useState('Normal AC');
  const [ambientTemp, setAmbientTemp] = useState(32);
  
  const [sourceLocation, setSourceLocation] = useState({ lat: 28.6139, lng: 77.2090, displayName: 'New Delhi' });
  const [destLocation, setDestLocation] = useState({ lat: 26.9124, lng: 75.7873, displayName: 'Jaipur, Rajasthan' });
  const [userGpsLocation, setUserGpsLocation] = useState(null);

  // Live Navigation Active State
  const [isNavigating, setIsNavigating] = useState(false);

  // Real-Time Hardware Device GPS Motion Watcher State
  const [liveDeviceCoords, setLiveDeviceCoords] = useState(null);
  const [realTimeDistanceKm, setRealTimeDistanceKm] = useState(0);
  const [liveGpsSpeed, setLiveGpsSpeed] = useState(0);
  const [liveGpsHeading, setLiveGpsHeading] = useState(0);
  const prevGpsPosRef = useRef(null);

  // Driver Safety & Speed Camera Alert State
  const [activeSpeedCamera, setActiveSpeedCamera] = useState(null);
  const [showFatigueAlert, setShowFatigueAlert] = useState(false);

  // App Operational State
  const [isLoading, setIsLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [stops, setStops] = useState([]);
  const [totalChargeTimeMins, setTotalChargeTimeMins] = useState(0);
  const [batteryProfile, setBatteryProfile] = useState([]);
  
  // Live Traffic Layers State
  const [showTraffic, setShowTraffic] = useState(true);
  const [trafficData, setTrafficData] = useState({ segments: [], totalDelayMins: 0 });

  // Minimalist Overlay Visibility
  const [showNavBanner, setShowNavBanner] = useState(false);
  const [showSummaryCard, setShowSummaryCard] = useState(false);
  const [showTrafficLegend, setShowTrafficLegend] = useState(false);
  const [showBottomDashboard, setShowBottomDashboard] = useState(true);

  // Modals State
  const [selectedStationModal, setSelectedStationModal] = useState(null);
  const [selectedTurnStep, setSelectedTurnStep] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showBatteryHealthModal, setShowBatteryHealthModal] = useState(false);
  const [showCustomVehicleModal, setShowCustomVehicleModal] = useState(false);
  const [showPassengerQrModal, setShowPassengerQrModal] = useState(false);

  // Map Controls & Theme Sensor
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);
  const [mapBounds, setMapBounds] = useState(null);
  const [activeTile, setActiveTile] = useState('osm');
  const [is3dTilted, setIs3dTilted] = useState(false);
  const [autoFollowCar, setAutoFollowCar] = useState(true);

  // Turn Step Tracker
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Auto Daylight Theme
  useEffect(() => {
    setActiveTile('osm');
  }, []);

  // Driver Fatigue Alert
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFatigueAlert(true);
    }, 120000);
    return () => clearTimeout(timer);
  }, []);

  // REAL-TIME HARDWARE GPS MOTION WATCHER
  useEffect(() => {
    let watchId = null;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed, heading } = position.coords;
          const newCoords = [latitude, longitude];
          setLiveDeviceCoords(newCoords);

          const speedKmH = speed ? Math.round(speed * 3.6) : 0;
          setLiveGpsSpeed(speedKmH);

          const camAlert = checkSpeedCameraAlert(latitude, longitude);
          setActiveSpeedCamera(camAlert);

          if (prevGpsPosRef.current) {
            const deltaKm = calculateDistanceKm(
              prevGpsPosRef.current[0],
              prevGpsPosRef.current[1],
              latitude,
              longitude
            );
            if (deltaKm > 0.005) {
              setRealTimeDistanceKm((prev) => Math.round((prev + deltaKm) * 100) / 100);
            }

            if (heading !== null && heading !== undefined && !isNaN(heading)) {
              setLiveGpsHeading(heading);
            } else {
              const dy = latitude - prevGpsPosRef.current[0];
              const dx = (longitude - prevGpsPosRef.current[1]) * Math.cos((latitude * Math.PI) / 180);
              const angle = (Math.atan2(dx, dy) * 180) / Math.PI;
              setLiveGpsHeading(angle);
            }
          }

          prevGpsPosRef.current = newCoords;
        },
        (error) => console.warn('GPS Watcher notice:', error.message),
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 5000 }
      );
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Main Route Planning Handler
  const handlePlanRoute = async (srcOverride = null, destOverride = null) => {
    const src = srcOverride || sourceLocation;
    const dest = destOverride || destLocation;

    if (!src || !dest) {
      alert('Please select valid Source and Destination locations.');
      return;
    }

    setIsLoading(true);
    setCurrentStepIndex(0);
    setSelectedTurnStep(null);
    setRealTimeDistanceKm(0);
    setIsNavigating(false);

    try {
      const osrmResult = await getRouteFromOSRM(
        [src.lat, src.lng],
        [dest.lat, dest.lng]
      );

      setRouteData(osrmResult);
      const bounds = L.latLngBounds(osrmResult.coordinates);
      setMapBounds(bounds);

      const haltResultsPromise = calculateSmartHalts({
        coordinates: osrmResult.coordinates,
        totalDistanceKm: osrmResult.distanceKm,
        vehicle: selectedVehicle,
        currentRangeKm: currentRange,
        minSocBufferPercent: minSocBuffer,
        preferredPlug: selectedPlug,
        acMode,
        ambientTemp
      });

      const trafficPromise = fetchLiveRouteTraffic(osrmResult.coordinates);

      const [haltResults, liveTrafficInfo] = await Promise.all([
        haltResultsPromise,
        trafficPromise
      ]);

      setStops(haltResults.recommendedStops);
      setTotalChargeTimeMins(haltResults.totalChargeTimeMins);
      setBatteryProfile(haltResults.batteryProfile);
      setTrafficData(liveTrafficInfo);

    } catch (error) {
      console.error('Route calculation error:', error);
      alert('Failed to calculate route: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Geolocation & Route Calculation
  useEffect(() => {
    let isMounted = true;

    const initLocationAndRoute = async () => {
      const userLoc = await getBestUserLocation();
      if (!isMounted) return;

      setUserGpsLocation(userLoc);
      setSourceLocation(userLoc);
      setMapCenter([userLoc.lat, userLoc.lng]);
      setMapZoom(12);

      handlePlanRoute(userLoc, destLocation);
    };

    initLocationAndRoute();

    return () => {
      isMounted = false;
    };
  }, []);


  // Location Selection Handlers
  const handleSelectSourceLocation = (loc) => {
    setSourceLocation(loc);
    handlePlanRoute(loc, destLocation);
  };

  const handleSelectDestLocation = (loc) => {
    setDestLocation(loc);
    handlePlanRoute(sourceLocation, loc);
  };

  const handleSelectSavedTrip = (src, dst) => {
    setSourceLocation(src);
    setDestLocation(dst);
    handlePlanRoute(src, dst);
  };

  // Start Live Navigation Action
  const handleStartLiveNavigation = () => {
    setIsNavigating(true);
    setShowNavBanner(true);
    setIs3dTilted(true);
    setAutoFollowCar(true);
  };

  // Exit Live Navigation Action
  const handleExitLiveNavigation = () => {
    setIsNavigating(false);
    setShowNavBanner(false);
    setIs3dTilted(false);
    if (routeData) {
      setMapBounds(L.latLngBounds(routeData.coordinates));
    }
  };

  // Derive Current Live GPS Position & Battery SOC
  const currentCarCoords = isNavigating
    ? (liveDeviceCoords || routeData?.coordinates?.[0] || [sourceLocation.lat, sourceLocation.lng])
    : (routeData?.coordinates?.[0] || [sourceLocation.lat, sourceLocation.lng]);

  const distanceDrivenKm = realTimeDistanceKm;
  const consumedSocPercent = (distanceDrivenKm / selectedVehicle.range) * 100;
  const currentSoc = Math.max(0, Math.round(((currentRange / selectedVehicle.range) * 100) - consumedSocPercent));

  useEffect(() => {
    if (routeData && routeData.steps && routeData.steps.length > 0) {
      const activeIdx = routeData.steps.findIndex(s => s.cumulativeKm >= distanceDrivenKm);
      if (activeIdx !== -1) {
        setCurrentStepIndex(activeIdx);
      }
    }
  }, [distanceDrivenKm, routeData]);

  // Handle URL Query Params from Passenger QR Code scan on mobile
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const srcName = params.get('src');
      const dstName = params.get('dst');
      const srcLat = parseFloat(params.get('srcLat'));
      const srcLng = parseFloat(params.get('srcLng'));
      const dstLat = parseFloat(params.get('dstLat'));
      const dstLng = parseFloat(params.get('dstLng'));
      const vehicleParam = params.get('vehicle');

      if (vehicleParam) {
        const foundVeh = INITIAL_EV_PRESETS.find(
          v => v.name.toLowerCase().includes(vehicleParam.toLowerCase()) || 
               vehicleParam.toLowerCase().includes(v.name.toLowerCase())
        );
        if (foundVeh) setSelectedVehicle(foundVeh);
      }

      if (srcLat && srcLng && dstLat && dstLng) {
        const srcObj = { 
          lat: srcLat, 
          lng: srcLng, 
          displayName: srcName || `${srcLat.toFixed(2)}, ${srcLng.toFixed(2)}` 
        };
        const dstObj = { 
          lat: dstLat, 
          lng: dstLng, 
          displayName: dstName || `${dstLat.toFixed(2)}, ${dstLng.toFixed(2)}` 
        };
        setSourceLocation(srcObj);
        setDestLocation(dstObj);
        setActiveView('planner');
        handlePlanRoute(srcObj, dstObj);
      } else if (params.get('view') === 'planner') {
        setActiveView('planner');
      }
    } catch (e) {
      console.warn('URL params parsing failed:', e);
    }
  }, []);

  const currentNavStep = routeData?.steps?.[currentStepIndex] || routeData?.steps?.[0];
  const nextNavStep = routeData?.steps?.[currentStepIndex + 1];
  const nextStepDistanceKm = nextNavStep 
    ? Math.max(0, Math.round((nextNavStep.cumulativeKm - distanceDrivenKm) * 10) / 10)
    : 0;

  const nextChargingStop = stops.find(st => st.distanceFromStartKm > distanceDrivenKm) || stops[0];

  const handleSelectTurnStep = (step) => {
    if (step && step.location) {
      setSelectedTurnStep(step);
      setCurrentStepIndex(step.id);
      setMapCenter([step.location[0], step.location[1]]);
      setMapZoom(14);
      setShowNavBanner(true);
    }
  };

  if (activeView === 'landing') {
    return (
      <div className="w-full min-h-screen bg-[#f8f9fa] text-[#202124] font-['Plus_Jakarta_Sans',sans-serif] overflow-y-auto overflow-x-hidden">
        <LandingPage
          onClose={() => setActiveView('planner')}
          evPresets={evPresetsList}
          onLaunchPlanner={(src, dst) => {
            setActiveView('planner');
            if (src && dst) {
              setSourceLocation(src);
              setDestLocation(dst);
              handlePlanRoute(src, dst);
            } else if (!routeData && sourceLocation && destLocation) {
              handlePlanRoute(sourceLocation, destLocation);
            }
          }}
          onOpenAuthModal={() => setShowAuthModal(true)}
          user={user}
          onOpenDashboard={() => setShowDashboardModal(true)}
        />

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {/* Account Dashboard & Trip Analytics Modal */}
        {showDashboardModal && (
          <AccountDashboardModal
            user={user}
            token={token}
            onClose={() => setShowDashboardModal(false)}
            onLogout={handleLogout}
            onLoadTripOnMap={handleLoadTripOnMap}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#f8f9fa] text-[#202124] overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] fixed inset-0">
      
      {/* SIDEBAR INPUT PANEL */}
      <InputPanel
        onPlanRoute={() => handlePlanRoute()}
        isLoading={isLoading}
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        currentRange={currentRange}
        setCurrentRange={setCurrentRange}
        minSocBuffer={minSocBuffer}
        setMinSocBuffer={setMinSocBuffer}
        selectedPlug={selectedPlug}
        setSelectedPlug={setSelectedPlug}
        sourceLocation={sourceLocation}
        setSourceLocation={setSourceLocation}
        destLocation={destLocation}
        setDestLocation={setDestLocation}
        onSelectSourceLocation={handleSelectSourceLocation}
        onSelectDestLocation={handleSelectDestLocation}
        onSelectSavedTrip={handleSelectSavedTrip}
        onUseCurrentLocation={(loc) => {
          setSourceLocation(loc);
          setMapCenter([loc.lat, loc.lng]);
          setMapZoom(13);
          handlePlanRoute(loc, destLocation);
        }}
        acMode={acMode}
        setAcMode={setAcMode}
        ambientTemp={ambientTemp}
        setAmbientTemp={setAmbientTemp}
        onOpenExportModal={() => setShowExportModal(true)}
        onOpenSosModal={() => setShowSosModal(true)}
        onOpenBatteryHealthModal={() => setShowBatteryHealthModal(true)}
        onOpenCustomVehicleModal={() => setShowCustomVehicleModal(true)}
        onOpenPassengerQrModal={() => setShowPassengerQrModal(true)}
        evPresetsList={evPresetsList}
        routeData={routeData}
        user={user}
        token={token}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenDashboard={() => setShowDashboardModal(true)}
        onReturnToLanding={() => setActiveView('landing')}
      />

      {/* MAIN MAP CONTAINER */}
      <main className="flex-1 h-full relative overflow-hidden">
        
        {/* Top Control Menu Bar */}
        <MapToolbar
          showNavBanner={showNavBanner}
          setShowNavBanner={setShowNavBanner}
          showSummaryCard={showSummaryCard}
          setShowSummaryCard={setShowSummaryCard}
          showTrafficLegend={showTrafficLegend}
          setShowTrafficLegend={setShowTrafficLegend}
          showBottomDashboard={showBottomDashboard}
          setShowBottomDashboard={setShowBottomDashboard}
          activeTile={activeTile}
          setActiveTile={setActiveTile}
          userGpsLocation={userGpsLocation}
          onRecenterUser={() => {
            if (userGpsLocation) {
              setMapCenter([userGpsLocation.lat, userGpsLocation.lng]);
              setMapZoom(14);
            }
          }}
          onResetBounds={handleExitLiveNavigation}
          is3dTilted={is3dTilted}
          setIs3dTilted={setIs3dTilted}
          onOpenSosModal={() => setShowSosModal(true)}
          onOpenLandingPage={() => setActiveView('landing')}
          hasRoute={Boolean(routeData)}
        />

        {/* Speed Camera Voice Alert */}
        {activeSpeedCamera && <SpeedAlert camera={activeSpeedCamera} />}

        {/* Driver Fatigue Alert */}
        {showFatigueAlert && <FatigueAlert onClose={() => setShowFatigueAlert(false)} />}

        {/* Turn Guidance Banner */}
        {showNavBanner && currentNavStep && (
          <NavigationBanner
            currentStep={selectedTurnStep || currentNavStep}
            nextStepDistanceKm={nextStepDistanceKm}
            currentSpeed={liveGpsSpeed}
            vehicleName={selectedVehicle.name}
            isSimulating={true}
            onClose={() => setShowNavBanner(false)}
          />
        )}

        {/* Live Traffic Legend */}
        {showTrafficLegend && routeData && (
          <TrafficLegend
            totalDelayMins={trafficData.totalDelayMins}
            showTraffic={showTraffic}
            setShowTraffic={setShowTraffic}
            onClose={() => setShowTrafficLegend(false)}
          />
        )}

        {/* Route Summary Panel */}
        {showSummaryCard && routeData && (
          <RouteSummary
            routeData={routeData}
            stops={stops}
            totalChargeTimeMins={totalChargeTimeMins}
            onSelectStation={(st) => setSelectedStationModal(st)}
            onSelectTurnStep={handleSelectTurnStep}
            onClose={() => setShowSummaryCard(false)}
          />
        )}

        {/* Live GPS Navigation Bottom Bar */}
        {showBottomDashboard && routeData && (
          <SimulatorControl
            isNavigating={isNavigating}
            onStartNavigation={handleStartLiveNavigation}
            onExitNavigation={handleExitLiveNavigation}
            currentSoc={currentSoc}
            currentDistance={distanceDrivenKm}
            totalDistance={routeData.distanceKm}
            vehicleName={selectedVehicle.name}
            autoFollowCar={autoFollowCar}
            setAutoFollowCar={setAutoFollowCar}
            nextStop={nextChargingStop}
            liveSpeed={liveGpsSpeed}
          />
        )}

        {/* Leaflet Map Canvas */}
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          zoomControl={false}
          className={`w-full h-full transition-all duration-500 ${is3dTilted ? '[transform:rotateX(35deg)_scale(1.05)]' : ''}`}
        >
          <MapBoundsController
            bounds={mapBounds}
            center={mapCenter}
            zoom={mapZoom}
            carCoords={currentCarCoords}
            autoFollowCar={autoFollowCar}
            isNavigating={isNavigating}
          />

          {/* Tile Layer - Google Maps Style Clean Tiles */}
          {activeTile === 'dark' ? (
            <TileLayer
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

          {/* Standard Polyline - Classic Google Maps Route Blue */}
          {routeData && !showTraffic && (
            <Polyline
              positions={routeData.coordinates}
              pathOptions={{ color: '#1a73e8', weight: 7, opacity: 0.95 }}
            />
          )}

          {/* 100% REAL LIVE TOMTOM TRAFFIC COLOR HIGHLIGHTS */}
          {showTraffic && trafficData.segments.map((segment) => (
            <React.Fragment key={segment.id}>
              <Polyline
                positions={segment.coordinates}
                pathOptions={{ color: segment.color, weight: 12, opacity: 0.35 }}
              />
              <Polyline
                positions={segment.coordinates}
                pathOptions={{ color: segment.color, weight: 9, opacity: 0.95 }}
              >
                <Popup>
                  <div className="font-sans text-xs p-1">
                    <div className="font-bold text-slate-100">{segment.label}</div>
                    {segment.delayMins > 0 ? (
                      <div className="text-amber-400 font-bold mt-0.5">+{segment.delayMins} min live delay</div>
                    ) : (
                      <div className="text-blue-400 font-bold mt-0.5">Clear live flowing road</div>
                    )}
                  </div>
                </Popup>
              </Polyline>
            </React.Fragment>
          ))}

          {/* Destination Marker */}
          {destLocation && (
            <Marker position={[destLocation.lat, destLocation.lng]} icon={destIcon}>
              <Popup>
                <div className="font-bold text-xs">Destination: {destLocation.displayName}</div>
              </Popup>
            </Marker>
          )}

          {/* Selected Turn Step Marker */}
          {selectedTurnStep && selectedTurnStep.location && (
            <Marker
              position={[selectedTurnStep.location[0], selectedTurnStep.location[1]]}
              icon={activeTurnIcon}
            >
              <Popup>
                <div className="font-sans p-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Selected Turn Maneuver</div>
                  <div className="text-xs font-bold text-slate-100">{selectedTurnStep.instruction}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Km {selectedTurnStep.cumulativeKm} • {selectedTurnStep.streetName}</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Recommended Charging Station Halts */}
          {stops.map((station, idx) => (
            <Marker
              key={station.id || idx}
              position={[station.lat, station.lng]}
              icon={createStationIcon(true)}
              eventHandlers={{
                click: () => setSelectedStationModal(station)
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 font-sans">
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    Recommended Stop #{idx + 1}
                  </span>
                  <div className="font-bold text-xs text-slate-100">{station.name}</div>
                  <div className="text-[11px] text-teal-400 font-semibold">{station.power} kW DC Fast Charge</div>
                  <div className="text-[10px] text-slate-400">
                    Charge ~{station.chargeTimeMins} mins ({station.arrivalSocPercent}% ➔ {station.departureSocPercent}%)
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* EV Car Marker */}
          {currentCarCoords && (
            <Marker position={currentCarCoords} icon={createCarIcon(liveGpsHeading)} zIndexOffset={1000}>
              <Popup>
                <div className="font-bold text-xs text-emerald-400">
                  {selectedVehicle.name} • {currentSoc}% Battery • {distanceDrivenKm} km driven
                  <div className="text-blue-400 text-[10px]">📡 Real Hardware GPS Motion Active</div>
                </div>
              </Popup>
            </Marker>
          )}

        </MapContainer>

        {/* Nova AI Assistant */}
        <NovaAiAssistant
          vehicle={selectedVehicle}
          currentSoc={currentSoc}
          currentRangeKm={currentRange}
          routeData={routeData}
          stops={stops}
          totalChargeTimeMins={totalChargeTimeMins}
          trafficData={trafficData}
          sourceLocation={sourceLocation}
          destLocation={destLocation}
        />

      </main>

      {/* Station Details Modal */}
      <StationModal
        station={selectedStationModal}
        onClose={() => setSelectedStationModal(null)}
      />

      {/* Export & Google Maps Modal */}
      {showExportModal && (
        <ExportModal
          routeData={routeData}
          stops={stops}
          sourceName={sourceLocation?.displayName || 'Origin'}
          destName={destLocation?.displayName || 'Destination'}
          vehicleName={selectedVehicle.name}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* 24x7 EV Emergency SOS Modal */}
      {showSosModal && <SosModal onClose={() => setShowSosModal(false)} />}

      {/* Battery Health Predictor Modal */}
      {showBatteryHealthModal && (
        <BatteryHealthModal
          vehicle={selectedVehicle}
          onClose={() => setShowBatteryHealthModal(false)}
        />
      )}

      {/* Custom EV Vehicle Modal */}
      {showCustomVehicleModal && (
        <CustomVehicleModal
          onAddVehicle={(newVeh) => {
            setEvPresetsList([newVeh, ...evPresetsList]);
            setSelectedVehicle(newVeh);
            setCurrentRange(newVeh.range);
          }}
          onClose={() => setShowCustomVehicleModal(false)}
        />
      )}

      {/* Passenger Live Mobile QR Code Pass Modal */}
      {showPassengerQrModal && (
        <PassengerQrModal
          routeData={routeData}
          sourceLocation={sourceLocation}
          destLocation={destLocation}
          vehicleName={selectedVehicle.name}
          onClose={() => setShowPassengerQrModal(false)}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* Account Dashboard & Trip Analytics Modal */}
      {showDashboardModal && (
        <AccountDashboardModal
          user={user}
          token={token}
          onClose={() => setShowDashboardModal(false)}
          onLogout={handleLogout}
          onLoadTripOnMap={handleLoadTripOnMap}
        />
      )}

    </div>
  );
}

