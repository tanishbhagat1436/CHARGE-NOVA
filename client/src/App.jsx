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
import BatterySocBar from './components/BatterySocBar';
import { ToastProvider, useToast } from './components/Toast';

import { getRouteFromOSRM } from './services/osrmService';
import { calculateSmartHalts } from './utils/chargingAlgorithm';
import { reverseGeocode, getBestUserLocation } from './services/nominatimService';
import { calculateDistanceKm } from './services/openChargeMapService';
import { fetchLiveRouteTraffic } from './services/liveTrafficService';
import { checkSpeedCameraAlert } from './utils/speedCameraService';
import { getApiBaseUrl } from './services/apiConfig';
import { Navigation as NavIcon, X, AlertTriangle } from 'lucide-react';

// Leaflet Default Marker Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Station Marker Icon - SaaS Style (no aggressive bounce)
const createStationIcon = (isHalt = false) => L.divIcon({
  className: 'custom-station-icon',
  html: `<div class="${isHalt ? 'bg-warning text-white ring-4 ring-warning/20' : 'bg-success text-white ring-4 ring-success/20'} p-2 rounded-full shadow-card-md border-2 border-white flex items-center justify-center transition-transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
         </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -19]
});

// Destination Marker Icon - Clean Red Pin
const destIcon = L.divIcon({
  className: 'custom-dest-icon',
  html: `<div class="bg-danger text-white p-2 rounded-full shadow-card-md border-2 border-white flex items-center justify-center ring-4 ring-danger/20 transition-transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
         </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -19]
});

// Origin Marker Icon - Clean Green Pin
const originIcon = L.divIcon({
  className: 'custom-origin-icon',
  html: `<div class="bg-success text-white p-2 rounded-full shadow-card-md border-2 border-white flex items-center justify-center ring-4 ring-success/20 transition-transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
         </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -19]
});

// Intermediate Waypoint Marker Icon - Amber Tag
const createWaypointIcon = (index) => L.divIcon({
  className: 'custom-waypoint-icon',
  html: `<div class="bg-warning text-white font-black text-xs w-7 h-7 rounded-full shadow-card-md border-2 border-white flex items-center justify-center ring-4 ring-warning/20">
          ${index + 1}
         </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
});

// Animated EV Car Marker Icon - Blue Puck
const createCarIcon = (heading = 0) => L.divIcon({
  className: 'custom-car-icon',
  html: `<div style="transform: rotate(${heading}deg); transition: transform 0.3s ease-out;" class="bg-primary text-white p-2.5 rounded-full shadow-card-lg ring-4 ring-primary/20 border-2 border-white flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Turn Step Marker Icon
const activeTurnIcon = L.divIcon({
  className: 'custom-active-turn-icon',
  html: `<div class="bg-primary text-white p-2 rounded-full shadow-card ring-4 ring-primary/20 border-2 border-white flex items-center justify-center">
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

// Calculate minimum perpendicular distance from a point to a polyline in meters
const getDistanceToRouteMeters = (carPoint, polyline) => {
  if (!carPoint || !polyline || polyline.length < 2) return 0;
  const carLat = carPoint[0];
  const carLng = carPoint[1];
  let minDistanceMeters = Infinity;

  for (let i = 0; i < polyline.length - 1; i++) {
    const p1 = polyline[i];
    const p2 = polyline[i + 1];

    const x = (p2[1] - p1[1]) * Math.cos(((p1[0] + p2[0]) / 2) * (Math.PI / 180));
    const y = p2[0] - p1[0];
    const segmentLenSq = x * x + y * y;

    let t = 0;
    if (segmentLenSq > 0) {
      const u = (carLng - p1[1]) * Math.cos(((p1[0] + p2[0]) / 2) * (Math.PI / 180));
      const v = carLat - p1[0];
      t = Math.max(0, Math.min(1, (u * x + v * y) / segmentLenSq));
    }

    const nearestLat = p1[0] + t * (p2[0] - p1[0]);
    const nearestLng = p1[1] + t * (p2[1] - p1[1]);

    const distMeters = calculateDistanceKm(carLat, carLng, nearestLat, nearestLng) * 1000;
    if (distMeters < minDistanceMeters) {
      minDistanceMeters = distMeters;
    }
  }

  return Math.round(minDistanceMeters);
};

function AppContent() {
  const toast = useToast();

  // View & Auth State
  const [activeView, setActiveView] = useState('landing');
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

  // Sync token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('charge_nova_token');
      if (!savedToken) return;

      try {
        const response = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem('charge_nova_user', JSON.stringify(data.user));
          }
        } else if (response.status === 401) {
          localStorage.removeItem('charge_nova_token');
          localStorage.removeItem('charge_nova_user');
          setUser(null);
          setToken(null);
        }
      } catch (err) {}
    };

    verifyToken();
  }, []);

  const handleAuthSuccess = (userObj, tokenStr) => {
    setUser(userObj);
    setToken(tokenStr);
    toast.success(`Welcome back, ${userObj.name || 'Driver'}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('charge_nova_user');
    localStorage.removeItem('charge_nova_token');
    setShowDashboardModal(false);
    toast.info('Signed out successfully');
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
  const [waypoints, setWaypoints] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState('All Networks');
  const [userGpsLocation, setUserGpsLocation] = useState(null);

  // Live Navigation Active State
  const [isNavigating, setIsNavigating] = useState(false);

  // Real-Time Hardware Device GPS Motion Watcher State
  const [liveDeviceCoords, setLiveDeviceCoords] = useState(null);
  const [realTimeDistanceKm, setRealTimeDistanceKm] = useState(0);
  const [liveGpsSpeed, setLiveGpsSpeed] = useState(0);
  const [liveGpsHeading, setLiveGpsHeading] = useState(0);
  const prevGpsPosRef = useRef(null);

  // Dual-Mode Driving Engine State
  const [navMode, setNavMode] = useState('simulator');
  const [simSpeedMultiplier, setSimSpeedMultiplier] = useState(5);
  const [isSimPaused, setIsSimPaused] = useState(false);
  const [simCoordIndex, setSimCoordIndex] = useState(0);
  const [simDistanceKm, setSimDistanceKm] = useState(0);
  const [simSpeedKmH, setSimSpeedKmH] = useState(76);
  const [simHeading, setSimHeading] = useState(0);
  const [simCoords, setSimCoords] = useState(null);

  // Alerts
  const [activeSpeedCamera, setActiveSpeedCamera] = useState(null);
  const [showFatigueAlert, setShowFatigueAlert] = useState(false);

  // Operational State
  const [isLoading, setIsLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [stops, setStops] = useState([]);
  const [totalChargeTimeMins, setTotalChargeTimeMins] = useState(0);
  const [batteryProfile, setBatteryProfile] = useState([]);
  
  // Traffic
  const [showTraffic, setShowTraffic] = useState(true);
  const [trafficData, setTrafficData] = useState({ segments: [], totalDelayMins: 0 });

  // Overlays
  const [showNavBanner, setShowNavBanner] = useState(false);
  const [showSummaryCard, setShowSummaryCard] = useState(false);
  const [showTrafficLegend, setShowTrafficLegend] = useState(false);
  const [showBottomDashboard, setShowBottomDashboard] = useState(true);

  // Off-Route Detection
  const [offRouteDistanceMeters, setOffRouteDistanceMeters] = useState(0);
  const [isOffRoute, setIsOffRoute] = useState(false);
  const [rerouteCountdown, setRerouteCountdown] = useState(5);
  const [isRerouteDismissed, setIsRerouteDismissed] = useState(false);

  // Modals
  const [selectedStationModal, setSelectedStationModal] = useState(null);
  const [selectedTurnStep, setSelectedTurnStep] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showBatteryHealthModal, setShowBatteryHealthModal] = useState(false);
  const [showCustomVehicleModal, setShowCustomVehicleModal] = useState(false);
  const [showPassengerQrModal, setShowPassengerQrModal] = useState(false);

  // Map Controls & Dark Mode
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);
  const [mapBounds, setMapBounds] = useState(null);
  const [activeTile, setActiveTile] = useState('osm');
  const [is3dTilted, setIs3dTilted] = useState(false);
  const [autoFollowCar, setAutoFollowCar] = useState(true);

  const isDark = activeTile === 'dark';

  // Mobile View Switching ('map' | 'plan')
  const [mobileView, setMobileView] = useState(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get('srcLat') || p.get('mode') === 'passenger') return 'map';
    } catch (e) {}
    return 'map';
  });

  // Synchronize HTML element dark class for CSS variables & Tailwind dark: variant
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Turn Step Tracker
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Driver Fatigue Alert
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFatigueAlert(true);
    }, 180000);
    return () => clearTimeout(timer);
  }, []);

  // Real-Time GPS Motion Watcher
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
  const handlePlanRoute = async (
    srcOverride = null, 
    destOverride = null, 
    waypointsOverride = null, 
    networkOverride = null
  ) => {
    const src = srcOverride || sourceLocation;
    const dest = destOverride || destLocation;
    const currentWaypoints = waypointsOverride !== null ? waypointsOverride : waypoints;
    const currentNetwork = networkOverride !== null ? networkOverride : selectedNetwork;

    if (!src || !dest) {
      toast.warning('Please select valid Source and Destination locations.');
      return;
    }

    setIsLoading(true);
    setCurrentStepIndex(0);
    setSelectedTurnStep(null);
    setRealTimeDistanceKm(0);
    setSimCoordIndex(0);
    setSimDistanceKm(0);
    setIsNavigating(false);
    setIsSimPaused(false);

    try {
      const validWaypoints = (currentWaypoints || [])
        .filter(wp => wp && wp.location && wp.location.lat && wp.location.lng)
        .map(wp => [wp.location.lat, wp.location.lng]);

      const osrmResult = await getRouteFromOSRM(
        [src.lat, src.lng],
        [dest.lat, dest.lng],
        validWaypoints
      );

      setRouteData(osrmResult);
      if (osrmResult?.coordinates?.[0]) {
        setSimCoords(osrmResult.coordinates[0]);
      }
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
        ambientTemp,
        preferredNetwork: currentNetwork
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

      toast.success(`Route calculated: ${osrmResult.distanceKm} km with ${haltResults.recommendedStops.length} halt(s)`);
      setMobileView('map');
    } catch (error) {
      console.error('Route calculation error:', error);
      toast.error('Failed to calculate route: ' + error.message);
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

  const handleStartLiveNavigation = () => {
    setIsNavigating(true);
    setShowNavBanner(true);
    setIs3dTilted(true);
    setAutoFollowCar(true);
    setIsSimPaused(false);
    if (simCoordIndex >= (routeData?.coordinates?.length || 1) - 1) {
      setSimCoordIndex(0);
      setSimDistanceKm(0);
      if (routeData?.coordinates?.[0]) {
        setSimCoords(routeData.coordinates[0]);
      }
    }
    toast.info('Live navigation started');
  };

  const handleExitLiveNavigation = () => {
    setIsNavigating(false);
    setShowNavBanner(false);
    setIs3dTilted(false);
    setIsSimPaused(false);
    if (routeData) {
      setMapBounds(L.latLngBounds(routeData.coordinates));
    }
  };

  const handleResetSimulation = () => {
    setSimCoordIndex(0);
    setSimDistanceKm(0);
    setRealTimeDistanceKm(0);
    setIsSimPaused(false);
    if (routeData?.coordinates?.[0]) {
      setSimCoords(routeData.coordinates[0]);
    }
    toast.info('Simulation restarted');
  };

  // Virtual Simulator Loop
  useEffect(() => {
    if (!isNavigating || navMode !== 'simulator' || !routeData?.coordinates?.length || isSimPaused) {
      return;
    }

    const coords = routeData.coordinates;
    const intervalMs = 200;

    const timer = setInterval(() => {
      setSimCoordIndex((prevIdx) => {
        if (prevIdx >= coords.length - 1) {
          setIsSimPaused(true);
          setSimSpeedKmH(0);
          toast.success('Destination reached!');
          return prevIdx;
        }

        const stepAdvancement = Math.max(1, Math.round(simSpeedMultiplier * 1.5));
        const nextIdx = Math.min(coords.length - 1, prevIdx + stepAdvancement);

        const p1 = coords[prevIdx];
        const p2 = coords[nextIdx];

        const segmentKm = calculateDistanceKm(p1[0], p1[1], p2[0], p2[1]);
        setSimDistanceKm((prev) => Math.round((prev + segmentKm) * 100) / 100);

        const dy = p2[0] - p1[0];
        const dx = (p2[1] - p1[1]) * Math.cos((p1[0] * Math.PI) / 180);
        const heading = (Math.atan2(dx, dy) * 180) / Math.PI;
        setSimHeading(heading);

        const cruiseSpeed = Math.floor(72 + (nextIdx % 18));
        setSimSpeedKmH(cruiseSpeed);
        setSimCoords(p2);

        const camAlert = checkSpeedCameraAlert(p2[0], p2[1]);
        setActiveSpeedCamera(camAlert);

        return nextIdx;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isNavigating, navMode, routeData, isSimPaused, simSpeedMultiplier]);

  // Current Live Telemetry & Battery SOC
  const isVirtualSim = isNavigating && navMode === 'simulator';
  const currentCarCoords = isNavigating
    ? (isVirtualSim 
        ? (simCoords || routeData?.coordinates?.[0] || [sourceLocation.lat, sourceLocation.lng]) 
        : (liveDeviceCoords || routeData?.coordinates?.[0] || [sourceLocation.lat, sourceLocation.lng]))
    : (routeData?.coordinates?.[0] || [sourceLocation.lat, sourceLocation.lng]);

  const distanceDrivenKm = isVirtualSim ? simDistanceKm : realTimeDistanceKm;
  const currentSpeedValue = isNavigating ? (isVirtualSim ? simSpeedKmH : liveGpsSpeed) : 0;
  const currentHeadingValue = isNavigating ? (isVirtualSim ? simHeading : liveGpsHeading) : 0;

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

  // Off-Route Detection Engine
  useEffect(() => {
    if (!isNavigating || !routeData?.coordinates?.length || isRerouteDismissed || !currentCarCoords) {
      setIsOffRoute(false);
      return;
    }

    const distMeters = getDistanceToRouteMeters(currentCarCoords, routeData.coordinates);
    setOffRouteDistanceMeters(distMeters);

    if (distMeters > 200) {
      setIsOffRoute(true);
    } else {
      setIsOffRoute(false);
      setRerouteCountdown(5);
    }
  }, [currentCarCoords, isNavigating, routeData, isRerouteDismissed]);

  useEffect(() => {
    let timer = null;
    if (isOffRoute && rerouteCountdown > 0) {
      timer = setInterval(() => {
        setRerouteCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isOffRoute && rerouteCountdown <= 0) {
      triggerAutoReroute();
    }
    return () => clearInterval(timer);
  }, [isOffRoute, rerouteCountdown]);

  const triggerAutoReroute = () => {
    setIsOffRoute(false);
    setRerouteCountdown(5);

    if ('speechSynthesis' in window) {
      try {
        const utter = new SpeechSynthesisUtterance('Off route detected. Recalculating directions.');
        utter.rate = 1.0;
        window.speechSynthesis.speak(utter);
      } catch (e) {}
    }

    const currentPoint = {
      lat: currentCarCoords[0],
      lng: currentCarCoords[1],
      displayName: `Reroute (${currentCarCoords[0].toFixed(3)}, ${currentCarCoords[1].toFixed(3)})`
    };
    setSourceLocation(currentPoint);
    handlePlanRoute(currentPoint, destLocation);
  };

  // URL Query Params
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
    } catch (e) {}
  }, []);

  const currentNavStep = routeData?.steps?.[currentStepIndex] || routeData?.steps?.[0];
  const nextNavStep = routeData?.steps?.[currentStepIndex + 1];
  const nextStepDistanceKm = nextNavStep 
    ? Math.max(0, Math.round((nextNavStep.cumulativeKm - distanceDrivenKm) * 10) / 10)
    : 0;

  const nextChargingStop = stops.find(st => st.distanceFromStartKm > distanceDrivenKm) || stops[0];
  const distToNextCharger = nextChargingStop ? Math.max(0, Math.round(nextChargingStop.distanceFromStartKm - distanceDrivenKm)) : null;

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
      <div className="w-full min-h-screen bg-surface-muted text-ink font-sans overflow-y-auto overflow-x-hidden">
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

        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {showDashboardModal && (
          <AccountDashboardModal
            user={user}
            token={token}
            isDark={isDark}
            onClose={() => setShowDashboardModal(false)}
            onLogout={handleLogout}
            onLoadTripOnMap={handleLoadTripOnMap}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans fixed inset-0 ${isDark ? 'bg-[#0b0f19] text-[#e2e8f0]' : 'bg-surface-muted text-ink'}`}>
      
      {/* SIDEBAR INPUT PANEL */}
      {/* On desktop (md:): fixed sidebar */}
      {/* On mobile (<md): clean slide-over when mobileView === 'plan' */}
      <div className={`
        ${mobileView === 'plan' ? 'fixed inset-0 z-50 flex flex-col' : 'hidden'}
        md:static md:flex md:z-20 md:w-[380px] shrink-0 h-full
      `}>
        <InputPanel
          onCloseMobilePlan={() => setMobileView('map')}
          onPlanRoute={() => {
            handlePlanRoute();
            setMobileView('map');
          }}
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
          onSelectSourceLocation={(loc) => {
            handleSelectSourceLocation(loc);
            setMobileView('map');
          }}
          onSelectDestLocation={(loc) => {
            handleSelectDestLocation(loc);
            setMobileView('map');
          }}
          onSelectSavedTrip={(src, dst) => {
            handleSelectSavedTrip(src, dst);
            setMobileView('map');
          }}
          onUseCurrentLocation={(loc) => {
            setSourceLocation(loc);
            setMapCenter([loc.lat, loc.lng]);
            setMapZoom(13);
            handlePlanRoute(loc, destLocation);
            setMobileView('map');
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
          smartHalts={stops}
          user={user}
          token={token}
          onOpenAuthModal={() => setShowAuthModal(true)}
          onOpenDashboard={() => setShowDashboardModal(true)}
          onReturnToLanding={() => setActiveView('landing')}
          waypoints={waypoints}
          setWaypoints={setWaypoints}
          selectedNetwork={selectedNetwork}
          setSelectedNetwork={setSelectedNetwork}
          isDark={isDark}
        />
      </div>

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
          onOpenMobilePlan={() => setMobileView('plan')}
        />

        {/* Persistent Battery SOC Bar */}
        <BatterySocBar soc={currentSoc} isDark={isDark} />

        {/* Speed Camera Alert */}
        {activeSpeedCamera && <SpeedAlert camera={activeSpeedCamera} />}

        {/* Fatigue Alert */}
        {showFatigueAlert && <FatigueAlert onClose={() => setShowFatigueAlert(false)} />}

        {/* Dynamic Auto-Rerouting Banner */}
        {isOffRoute && (
          <div 
            className="fixed top-20 left-1/2 -translate-x-1/2 font-sans animate-slide-down w-[92%] max-w-md"
            style={{ zIndex: 9998 }}
          >
            <div className="bg-warning text-white p-3 rounded-2xl shadow-card-lg border border-warning/40 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-white text-warning rounded-xl font-bold shrink-0">
                  <NavIcon className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚠️ Off Planned Corridor</span>
                    <span className="bg-black/20 px-1.5 py-0.5 rounded text-[10px]">
                      {offRouteDistanceMeters}m away
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-amber-100">
                    Auto-recalculating corridor in <span className="font-bold underline text-white">{rerouteCountdown}s</span>...
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                <button
                  onClick={triggerAutoReroute}
                  className="px-3 py-1.5 bg-white text-warning font-bold text-xs rounded-full shadow-card hover:bg-amber-50 transition-all cursor-pointer"
                >
                  Reroute
                </button>
                <button
                  onClick={() => {
                    setIsRerouteDismissed(true);
                    setIsOffRoute(false);
                    setTimeout(() => setIsRerouteDismissed(false), 30000);
                  }}
                  className="p-1 text-white hover:bg-black/20 rounded-full cursor-pointer"
                  title="Dismiss warning"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Turn Guidance Banner */}
        {showNavBanner && currentNavStep && (
          <NavigationBanner
            currentStep={selectedTurnStep || currentNavStep}
            nextStepDistanceKm={nextStepDistanceKm}
            currentSpeed={currentSpeedValue}
            vehicleName={selectedVehicle.name}
            isSimulating={true}
            isDark={isDark}
            distToNextChargerKm={distToNextCharger}
            onClose={() => setShowNavBanner(false)}
          />
        )}

        {/* Live Traffic Legend */}
        {showTrafficLegend && routeData && (
          <TrafficLegend
            totalDelayMins={trafficData.totalDelayMins}
            showTraffic={showTraffic}
            setShowTraffic={setShowTraffic}
            isDark={isDark}
            onClose={() => setShowTrafficLegend(false)}
          />
        )}

        {/* Route Summary Panel */}
        {showSummaryCard && routeData && (
          <RouteSummary
            routeData={routeData}
            stops={stops}
            totalChargeTimeMins={totalChargeTimeMins}
            isDark={isDark}
            onSelectStation={(st) => setSelectedStationModal(st)}
            onSelectTurnStep={handleSelectTurnStep}
            onClose={() => setShowSummaryCard(false)}
          />
        )}

        {/* Simulator Control Bottom Bar */}
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
            liveSpeed={currentSpeedValue}
            navMode={navMode}
            setNavMode={setNavMode}
            simSpeedMultiplier={simSpeedMultiplier}
            setSimSpeedMultiplier={setSimSpeedMultiplier}
            isSimPaused={isSimPaused}
            setIsSimPaused={setIsSimPaused}
            onResetSimulation={handleResetSimulation}
            isDark={isDark}
            onOpenMobilePlan={() => setMobileView('plan')}
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

          {/* Tile Layer */}
          {activeTile === 'dark' ? (
            <TileLayer
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              subdomains={['a', 'b', 'c', 'd']}
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

          {/* Route Polyline */}
          {routeData && !showTraffic && (
            <Polyline
              positions={routeData.coordinates}
              pathOptions={{ 
                color: isDark ? '#22d3ee' : '#2563eb', 
                weight: isDark ? 8 : 6, 
                opacity: 0.95 
              }}
            />
          )}

          {/* TomTom Traffic Segments */}
          {showTraffic && trafficData.segments.map((segment) => (
            <React.Fragment key={segment.id}>
              <Polyline
                positions={segment.coordinates}
                pathOptions={{ color: segment.color, weight: 12, opacity: 0.25 }}
              />
              <Polyline
                positions={segment.coordinates}
                pathOptions={{ color: segment.color, weight: 8, opacity: 0.95 }}
              >
                <Popup>
                  <div className="font-sans text-xs p-1">
                    <div className="font-bold">{segment.label}</div>
                    {segment.delayMins > 0 ? (
                      <div className="text-warning font-bold mt-0.5">+{segment.delayMins} min delay</div>
                    ) : (
                      <div className="text-primary font-bold mt-0.5">Clear flowing road</div>
                    )}
                  </div>
                </Popup>
              </Polyline>
            </React.Fragment>
          ))}

          {/* Origin Marker */}
          {sourceLocation && (
            <Marker position={[sourceLocation.lat, sourceLocation.lng]} icon={originIcon}>
              <Popup>
                <div className="font-sans p-1">
                  <span className="text-[10px] font-bold text-success uppercase">Origin</span>
                  <div className="font-bold text-xs mt-0.5">{sourceLocation.displayName}</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Intermediate Waypoints */}
          {waypoints && waypoints.map((wp, idx) => (
            wp.location && (
              <Marker
                key={`wp-marker-${idx}`}
                position={[wp.location.lat, wp.location.lng]}
                icon={createWaypointIcon(idx)}
              >
                <Popup>
                  <div className="font-sans p-1">
                    <span className="text-[10px] font-bold text-warning uppercase">Via Stop #{idx + 1}</span>
                    <div className="font-bold text-xs mt-0.5">{wp.location.displayName}</div>
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {/* Destination Marker */}
          {destLocation && (
            <Marker position={[destLocation.lat, destLocation.lng]} icon={destIcon}>
              <Popup>
                <div className="font-sans p-1">
                  <span className="text-[10px] font-bold text-danger uppercase">Destination</span>
                  <div className="font-bold text-xs mt-0.5">{destLocation.displayName}</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Turn Marker */}
          {selectedTurnStep && selectedTurnStep.location && (
            <Marker
              position={[selectedTurnStep.location[0], selectedTurnStep.location[1]]}
              icon={activeTurnIcon}
            >
              <Popup>
                <div className="font-sans p-1">
                  <div className="text-[10px] font-bold text-ink-tertiary uppercase">Turn Maneuver</div>
                  <div className="text-xs font-bold">{selectedTurnStep.instruction}</div>
                  <div className="text-[10px] text-ink-secondary mt-0.5">Km {selectedTurnStep.cumulativeKm} • {selectedTurnStep.streetName}</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Charging Halts */}
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
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-success/15 text-success">
                    Halt #{idx + 1}
                  </span>
                  <div className="font-bold text-xs">{station.name}</div>
                  <div className="text-[11px] text-primary font-semibold">{station.power} kW DC Fast Charge</div>
                  <div className="text-[10px] text-ink-secondary">
                    Charge ~{station.chargeTimeMins} mins ({station.arrivalSocPercent}% ➔ {station.departureSocPercent}%)
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Car Marker */}
          {currentCarCoords && (
            <Marker position={currentCarCoords} icon={createCarIcon(currentHeadingValue)} zIndexOffset={1000}>
              <Popup>
                <div className="font-bold text-xs text-success">
                  {selectedVehicle.name} • {currentSoc}% Battery • {distanceDrivenKm} km driven
                  <div className="text-primary font-semibold text-[10px] mt-0.5">
                    {isVirtualSim ? '🚗 Virtual Simulation Mode' : '📡 Real GPS Motion Mode'}
                  </div>
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

      {/* Station Modal */}
      <StationModal
        station={selectedStationModal}
        user={user}
        token={token}
        isDark={isDark}
        onClose={() => setSelectedStationModal(null)}
      />

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          routeData={routeData}
          stops={stops}
          sourceName={sourceLocation?.displayName || 'Origin'}
          destName={destLocation?.displayName || 'Destination'}
          vehicleName={selectedVehicle.name}
          waypoints={waypoints}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* SOS Modal */}
      {showSosModal && <SosModal onClose={() => setShowSosModal(false)} />}

      {/* Battery Health Modal */}
      {showBatteryHealthModal && (
        <BatteryHealthModal
          vehicle={selectedVehicle}
          onClose={() => setShowBatteryHealthModal(false)}
        />
      )}

      {/* Custom Vehicle Modal */}
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

      {/* Passenger QR Modal */}
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

      {/* Account Dashboard Modal */}
      {showDashboardModal && (
        <AccountDashboardModal
          user={user}
          token={token}
          isDark={isDark}
          onClose={() => setShowDashboardModal(false)}
          onLogout={handleLogout}
          onLoadTripOnMap={handleLoadTripOnMap}
          onOpenAuthModal={() => setShowAuthModal(true)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
