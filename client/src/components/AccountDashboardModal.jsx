import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  LogOut, 
  Database, 
  Zap, 
  MapPin, 
  Gauge, 
  DollarSign, 
  BarChart3, 
  Layers, 
  CheckSquare, 
  Square, 
  Calendar, 
  Trash2, 
  RotateCw, 
  Search, 
  Leaf, 
  ShieldCheck, 
  ChevronRight,
  Car,
  Clock,
  Navigation
} from 'lucide-react';
import axios from 'axios';
import { getApiBaseUrl } from '../services/apiConfig';
import { calculateTripCostAndSavings } from '../utils/costSavingsMath';

function BookingCard({ booking, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    return Math.max(0, Math.floor((new Date(booking.expiresAt) - new Date()) / 1000));
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isExpired = timeLeft <= 0 || booking.status === 'Cancelled' || booking.status === 'Expired';

  const handleNavigate = () => {
    if (booking.coords && booking.coords.length === 2) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${booking.coords[0]},${booking.coords[1]}&travelmode=driving`, '_blank');
    }
  };

  return (
    <div className={`p-4 bg-white border rounded-xl space-y-3 shadow-xs transition-all ${
      isExpired ? 'border-slate-200 opacity-60' : 'border-emerald-300 ring-2 ring-emerald-50'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1a73e8] border border-blue-200">
              {booking.operator || 'EV Network'}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isExpired 
                ? 'bg-slate-100 text-slate-500 border-slate-200' 
                : 'bg-emerald-50 text-[#137333] border-emerald-200'
            }`}>
              {isExpired ? 'Expired / Released' : 'Held / Active Bay'}
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#202124] mt-1">{booking.stationName}</h4>
          <p className="text-[11px] text-[#5f6368]">
            {booking.powerKW || 60} kW DC Fast Charger • {booking.connector || 'CCS2'} • ₹{booking.rateINR || 19}/kWh
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-[#5f6368] font-medium">Bay Passcode</div>
          <div className="text-sm font-mono font-black text-[#1a73e8] tracking-wider">{booking.code}</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#dadce0]">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Clock className={`w-3.5 h-3.5 ${isExpired ? 'text-slate-400' : 'text-[#1e8e3e]'}`} />
          {isExpired ? (
            <span className="text-slate-400">30-min window elapsed</span>
          ) : (
            <span className="text-[#137333] font-bold">Holds for next: {mins}m {secs < 10 ? '0' : ''}{secs}s</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleNavigate}
            className="px-3 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <Navigation className="w-3 h-3" />
            <span>Navigate</span>
          </button>
          {!isExpired && (
            <button
              onClick={() => onCancel(booking._id || booking.code)}
              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-[#d93025] border border-red-200 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountDashboardModal({ user, token, onClose, onLogout, onLoadTripOnMap, onOpenAuthModal }) {
  const [activeTab, setActiveTab] = useState('trips'); // 'trips' | 'bookings'
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTripIds, setSelectedTripIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingTripId, setDeletingTripId] = useState(null);

  useEffect(() => {
    if (token && user) {
      fetchUserTrips();
      fetchUserBookings();
    } else {
      setTrips([]);
      setBookings([]);
      setIsLoading(false);
    }
  }, [token, user]);

  const fetchUserBookings = async () => {
    try {
      if (token && user) {
        const response = await axios.get(`${getApiBaseUrl()}/api/reservations/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data?.bookings) {
          setBookings(response.data.bookings);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend booking fetch notice:', e.message);
    }
    // Fallback to local storage
    try {
      const local = JSON.parse(localStorage.getItem('charge_nova_active_bookings') || '[]');
      setBookings(local);
    } catch (e) {
      setBookings([]);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this 30-minute charging slot reservation?')) return;
    try {
      if (token && !String(bookingId).startsWith('local-')) {
        await axios.delete(`${getApiBaseUrl()}/api/reservations/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (e) {}

    // Update state and local storage
    setBookings(prev => prev.map(b => (b._id === bookingId || b.code === bookingId) ? { ...b, status: 'Cancelled' } : b));
    try {
      const saved = JSON.parse(localStorage.getItem('charge_nova_active_bookings') || '[]');
      const updated = saved.map(b => (b._id === bookingId || b.code === bookingId) ? { ...b, status: 'Cancelled' } : b);
      localStorage.setItem('charge_nova_active_bookings', JSON.stringify(updated));
    } catch (e) {}
  };

  const fetchUserTrips = async () => {
    if (!token || !user) {
      setTrips([]);
      setIsLoading(false);
      return;
    }

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
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this trip from your account?')) {
      return;
    }

    setDeletingTripId(tripId);
    try {
      await axios.delete(`${getApiBaseUrl()}/api/routes/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrips(prev => prev.filter(t => t._id !== tripId));
      setSelectedTripIds(prev => prev.filter(id => id !== tripId));
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip: ' + (error.response?.data?.error || error.message));
    } finally {
      setDeletingTripId(null);
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

  // Filter trips by search query
  const filteredTrips = trips.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.sourceName && t.sourceName.toLowerCase().includes(q)) ||
      (t.destName && t.destName.toLowerCase().includes(q)) ||
      (t.vehicleName && t.vehicleName.toLowerCase().includes(q))
    );
  });

  const selectedTrips = trips.filter(t => selectedTripIds.includes(t._id));

  // Lifetime user metrics
  const totalDistanceKm = trips.reduce((acc, t) => acc + (t.distanceKm || 0), 0);
  const totalSavedCostINR = trips.reduce((acc, t) => {
    if (t.savedCostINR && t.savedCostINR > 0) return acc + t.savedCostINR;
    return acc + calculateTripCostAndSavings(t.distanceKm || 0).savedCostINR;
  }, 0);
  const totalCo2SavedKg = Math.round(totalDistanceKm * 0.135 * 10) / 10;

  // Unauthenticated fallback view
  if (!user || !token) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 font-sans"
        style={{ zIndex: 99999 }}
      >
        <div className="bg-white border border-[#dadce0] w-full max-w-md rounded-2xl shadow-2xl p-6 text-center space-y-4">
          <div className="w-14 h-14 mx-auto bg-blue-50 text-[#1a73e8] rounded-2xl flex items-center justify-center border border-blue-200">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#202124]">Personal Account Dashboard</h3>
            <p className="text-xs text-[#5f6368] mt-1">Please sign in or create an account to view your saved trips, lifetime savings, and EV stats.</p>
          </div>
          <div className="flex items-center justify-center space-x-2 pt-2">
            <button
              onClick={() => {
                onClose();
                if (onOpenAuthModal) onOpenAuthModal();
              }}
              className="px-5 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold rounded-full shadow-sm transition-all"
            >
              Sign In / Sign Up
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#3c4043] text-xs font-semibold rounded-full transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userInitial = (user.name || 'User').charAt(0).toUpperCase();

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white border border-[#dadce0] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative text-[#202124]">
        
        {/* Header Bar */}
        <div className="p-4 border-b border-[#dadce0] bg-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#1a73e8] text-white rounded-full flex items-center justify-center font-bold text-base shadow-sm ring-4 ring-blue-50">
              {userInitial}
            </div>
            <div>
              <h3 className="font-bold text-base text-[#202124] flex items-center gap-2">
                <span>{user.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#1a73e8] border border-blue-200 font-bold uppercase tracking-wider">
                  Personal Dashboard
                </span>
              </h3>
              <div className="flex items-center gap-2 text-xs text-[#5f6368] mt-0.5">
                <span>{user.email}</span>
                {user.defaultVehicle && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium text-[#1a73e8]">
                      <Car className="w-3 h-3" />
                      {user.defaultVehicle}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchUserTrips}
              disabled={isLoading}
              className="p-1.5 text-[#5f6368] hover:text-[#1a73e8] hover:bg-blue-50 rounded-full transition-colors border border-[#dadce0]"
              title="Refresh your trips"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#1a73e8]' : ''}`} />
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#d93025] border border-red-200 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#5f6368] hover:text-[#202124] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Close Dashboard"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#dadce0] bg-[#f8f9fa] text-xs font-bold px-4">
          <button
            onClick={() => setActiveTab('trips')}
            className={`py-2.5 px-4 transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'trips'
                ? 'text-[#1a73e8] border-[#1a73e8] bg-white'
                : 'text-[#5f6368] border-transparent hover:text-[#202124]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Saved Trips & Analytics ({trips.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-2.5 px-4 transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'text-[#1a73e8] border-[#1a73e8] bg-white'
                : 'text-[#5f6368] border-transparent hover:text-[#202124]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>My Active Bookings / Reserved Slots ({bookings.filter(b => b.status === 'Active' && new Date(b.expiresAt) > new Date()).length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {activeTab === 'bookings' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#202124] flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>My Active 30-Minute Slot Passes</span>
                  </h4>
                  <p className="text-xs text-[#5f6368]">
                    Reserved charger bays with priority passcode held for your vehicle
                  </p>
                </div>
                <button
                  onClick={fetchUserBookings}
                  className="text-xs text-[#1a73e8] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Refresh Passes</span>
                </button>
              </div>

              {bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {bookings.map((booking, idx) => (
                    <BookingCard
                      key={booking._id || booking.code || idx}
                      booking={booking}
                      onCancel={handleCancelBooking}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#f8f9fa] rounded-2xl border border-[#dadce0] space-y-2">
                  <div className="w-12 h-12 mx-auto bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border border-amber-200">
                    <Zap className="w-6 h-6 fill-amber-500" />
                  </div>
                  <h5 className="font-bold text-xs text-[#202124]">No Active Charging Bay Bookings</h5>
                  <p className="text-[11px] text-[#5f6368] max-w-sm mx-auto">
                    Click any recommended station pin on your planned highway route and select <strong>"Reserve 30-Min Fast Slot Free"</strong> to hold your charging gun before arrival.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Lifetime Analytics Banner (4 Key SaaS Metrics) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="p-3.5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl flex items-center space-x-3">
              <div className="p-2.5 bg-blue-50 text-[#1a73e8] rounded-xl border border-blue-200">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#5f6368] tracking-wider">Total Distance</div>
                <div className="text-lg font-bold text-[#1a73e8] font-mono">{totalDistanceKm} km</div>
              </div>
            </div>

            <div className="p-3.5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-50 text-[#1e8e3e] rounded-xl border border-emerald-200">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#5f6368] tracking-wider">Fuel Saved</div>
                <div className="text-lg font-bold text-[#1e8e3e] font-mono">₹{totalSavedCostINR.toLocaleString()}</div>
              </div>
            </div>

            <div className="p-3.5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl flex items-center space-x-3">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl border border-teal-200">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#5f6368] tracking-wider">CO₂ Offset</div>
                <div className="text-lg font-bold text-teal-700 font-mono">{totalCo2SavedKg} kg</div>
              </div>
            </div>

            <div className="p-3.5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl flex items-center space-x-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#5f6368] tracking-wider">Saved Trips</div>
                <div className="text-lg font-bold text-[#202124] font-mono">{trips.length} Trips</div>
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
                  className="text-xs text-[#1a73e8] hover:underline font-semibold cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>

              {/* Side-by-Side Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedTrips.map((t, idx) => {
                  const costInfo = calculateTripCostAndSavings(t.distanceKm || 0);
                  const estEvCost = t.chargingCostINR || costInfo.evChargingCostINR;
                  const estPetrolCost = costInfo.petrolFuelCostINR;
                  const netSavings = t.savedCostINR || costInfo.savedCostINR;

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
                          onLoadTripOnMap(
                            { lat: t.sourceCoords[0], lng: t.sourceCoords[1], displayName: t.sourceName },
                            { lat: t.destCoords[0], lng: t.destCoords[1], displayName: t.destName }
                          );
                          onClose();
                        }}
                        className="w-full py-1.5 mt-2 bg-blue-50 hover:bg-blue-100 text-[#1a73e8] border border-blue-200 rounded-lg text-[11px] font-semibold transition-all text-center cursor-pointer"
                      >
                        Load on Map ➔
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PAST TRIPS TABLE & SEARCH */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h4 className="font-bold text-xs text-[#202124] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#1a73e8]" />
                  <span>{user.name.split(' ')[0]}'s Saved Trips ({filteredTrips.length})</span>
                </h4>
                <p className="text-[11px] text-[#5f6368]">Only visible to your logged in account</p>
              </div>

              {/* Search Box */}
              {trips.length > 0 && (
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#5f6368] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search trips by city or route..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f8f9fa] border border-[#dadce0] rounded-full focus:outline-none focus:border-[#1a73e8] text-[#202124]"
                  />
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-[#5f6368] bg-[#f8f9fa] rounded-xl border border-[#dadce0]">
                <RotateCw className="w-5 h-5 animate-spin text-[#1a73e8] mx-auto mb-2" />
                Loading your saved trips...
              </div>
            ) : filteredTrips.length > 0 ? (
              <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden divide-y divide-[#dadce0] shadow-sm">
                {filteredTrips.map((t) => {
                  const isChecked = selectedTripIds.includes(t._id);
                  const costInfo = calculateTripCostAndSavings(t.distanceKm || 0);
                  const estEvCost = t.chargingCostINR || costInfo.evChargingCostINR;
                  const netSavings = t.savedCostINR || costInfo.savedCostINR;

                  return (
                    <div 
                      key={t._id} 
                      className="p-3.5 hover:bg-[#f8f9fa] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleTripSelection(t._id)}
                          className="text-[#1a73e8] cursor-pointer"
                          title="Select to compare side-by-side"
                        >
                          {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-400" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-[#202124] truncate">
                            {t.title || `${t.sourceName} ➔ ${t.destName}`}
                          </div>
                          <div className="text-[11px] text-[#5f6368] flex items-center gap-2 mt-0.5 truncate">
                            <span>{t.vehicleName || 'Tata Nexon EV Max'}</span>
                            <span>•</span>
                            <span className="font-mono text-[#1a73e8] font-bold">{t.distanceKm} km</span>
                            {t.stopsCount > 0 && (
                              <>
                                <span>•</span>
                                <span>{t.stopsCount} stop{t.stopsCount > 1 ? 's' : ''}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                        <div className="text-right pr-2">
                          <div className="text-xs font-mono font-bold text-[#1e8e3e]">₹{netSavings} Saved</div>
                          <div className="text-[10px] text-[#5f6368]">EV: ₹{estEvCost}</div>
                        </div>

                        <button
                          onClick={() => {
                            onLoadTripOnMap(
                              { lat: t.sourceCoords[0], lng: t.sourceCoords[1], displayName: t.sourceName },
                              { lat: t.destCoords[0], lng: t.destCoords[1], displayName: t.destName }
                            );
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#1a73e8] border border-[#dadce0] rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer"
                        >
                          View Map
                        </button>

                        <button
                          onClick={(e) => handleDeleteTrip(t._id, e)}
                          disabled={deletingTripId === t._id}
                          className="p-1.5 text-slate-400 hover:text-[#d93025] hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer disabled:opacity-50"
                          title="Delete trip from account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : trips.length > 0 ? (
              <div className="p-6 text-center bg-[#f8f9fa] rounded-xl border border-[#dadce0] text-xs text-[#5f6368]">
                No trips matching "{searchQuery}".
              </div>
            ) : (
              <div className="p-8 text-center bg-[#f8f9fa] rounded-xl border border-[#dadce0] space-y-2">
                <div className="p-3 bg-blue-50 text-[#1a73e8] rounded-full w-fit mx-auto border border-blue-200">
                  <Database className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-xs text-[#202124]">No Trips Saved Under Your Account Yet</h5>
                <p className="text-[11px] text-[#5f6368] max-w-sm mx-auto">
                  Plan a highway route in the map planner and click <strong>"Save Trip"</strong> to record lifetime fuel savings and EV analytics under your profile.
                </p>
              </div>
            )}

          </div>
          </>
          )}

        </div>

      </div>
    </div>
  );
}
