import React, { useState, useEffect } from 'react';
import { 
  X, User, LogOut, Database, Zap, MapPin, Gauge, 
  DollarSign, BarChart3, Layers, CheckSquare, Square, 
  Calendar, Trash2, Search, Leaf, ShieldCheck, 
  ChevronRight, Car, Clock, Navigation, Download,
  ArrowUpDown
} from 'lucide-react';
import axios from 'axios';
import { getApiBaseUrl } from '../services/apiConfig';
import { calculateTripCostAndSavings } from '../utils/costSavingsMath';
import Skeleton, { SkeletonRow } from './Skeleton';

function BookingCard({ booking, onCancel, isDark = false }) {
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

  const cardBg = isDark
    ? 'bg-[#1a2035] border-[rgba(34,211,238,0.15)] text-[#e2e8f0]'
    : 'bg-white border-surface-border text-ink shadow-card';

  return (
    <div className={`p-4 rounded-xl border space-y-3 transition-all ${cardBg} ${
      isExpired ? 'opacity-60' : 'ring-1 ring-success/20'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {booking.operator || 'EV Network'}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isExpired 
                ? isDark ? 'bg-surface-subtle text-ink-tertiary border-surface-border' : 'bg-slate-100 text-slate-500 border-slate-200' 
                : 'bg-success/10 text-success border-success/20'
            }`}>
              {isExpired ? 'Expired / Released' : 'Held / Active Bay'}
            </span>
          </div>
          <h4 className="text-sm font-bold mt-1">{booking.stationName}</h4>
          <p className="text-[11px] text-ink-secondary">
            {booking.powerKW || 60} kW DC Fast Charger • {booking.connector || 'CCS2'} • ₹{booking.rateINR || 19}/kWh
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-ink-secondary font-medium">Bay Passcode</div>
          <div className="text-sm font-mono font-black text-primary tracking-wider">{booking.code}</div>
        </div>
      </div>

      <div className={`flex items-center justify-between pt-2 border-t ${isDark ? 'border-[rgba(34,211,238,0.1)]' : 'border-surface-border'}`}>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Clock className={`w-3.5 h-3.5 ${isExpired ? 'text-ink-tertiary' : 'text-success'}`} />
          {isExpired ? (
            <span className="text-ink-tertiary">30-min window elapsed</span>
          ) : (
            <span className="text-success font-bold">Holds: {mins}m {secs < 10 ? '0' : ''}{secs}s</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleNavigate}
            className="px-3 py-1 bg-primary hover:bg-primary-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-card"
          >
            <Navigation className="w-3 h-3" />
            <span>Navigate</span>
          </button>
          {!isExpired && (
            <button
              onClick={() => onCancel(booking._id || booking.code)}
              className="px-2.5 py-1 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountDashboardModal({ user, token, onClose, onLogout, onLoadTripOnMap, onOpenAuthModal, isDark = false }) {
  const [activeTab, setActiveTab] = useState('trips'); // 'trips' | 'bookings'
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTripIds, setSelectedTripIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'distance-desc' | 'savings-desc'
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
    } finally {
      setDeletingTripId(null);
    }
  };

  const toggleTripSelection = (id) => {
    if (selectedTripIds.includes(id)) {
      setSelectedTripIds(selectedTripIds.filter(tId => tId !== id));
    } else {
      if (selectedTripIds.length >= 3) {
        return;
      }
      setSelectedTripIds([...selectedTripIds, id]);
    }
  };

  // Export Trips as CSV
  const handleExportCSV = () => {
    if (!trips.length) return;
    const headers = 'Title,Origin,Destination,Vehicle,Distance_KM,Duration_Mins,Stops,Saved_INR,Date\n';
    const rows = trips.map(t => {
      const costInfo = calculateTripCostAndSavings(t.distanceKm || 0);
      const netSavings = t.savedCostINR || costInfo.savedCostINR;
      return `"${t.title || ''}","${t.sourceName || ''}","${t.destName || ''}","${t.vehicleName || ''}",${t.distanceKm || 0},${t.durationMins || 0},${t.stopsCount || 0},${netSavings},"${new Date(t.createdAt).toLocaleDateString()}"`;
    }).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `charge_nova_trips_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Sort & filter trips
  const filteredTrips = trips
    .filter(t => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.sourceName && t.sourceName.toLowerCase().includes(q)) ||
        (t.destName && t.destName.toLowerCase().includes(q)) ||
        (t.vehicleName && t.vehicleName.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'distance-desc') return (b.distanceKm || 0) - (a.distanceKm || 0);
      if (sortBy === 'savings-desc') {
        const sA = a.savedCostINR || calculateTripCostAndSavings(a.distanceKm || 0).savedCostINR;
        const sB = b.savedCostINR || calculateTripCostAndSavings(b.distanceKm || 0).savedCostINR;
        return sB - sA;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const selectedTrips = trips.filter(t => selectedTripIds.includes(t._id));

  // Lifetime metrics
  const totalDistanceKm = trips.reduce((acc, t) => acc + (t.distanceKm || 0), 0);
  const totalSavedCostINR = trips.reduce((acc, t) => {
    if (t.savedCostINR && t.savedCostINR > 0) return acc + t.savedCostINR;
    return acc + calculateTripCostAndSavings(t.distanceKm || 0).savedCostINR;
  }, 0);
  const totalCo2SavedKg = Math.round(totalDistanceKm * 0.135 * 10) / 10;

  const modalBg = isDark
    ? 'bg-[#111827] border-[rgba(34,211,238,0.2)] text-[#e2e8f0]'
    : 'bg-white border-surface-border text-ink';

  const surfaceSubtle = isDark
    ? 'bg-[#1a2035] border-[rgba(34,211,238,0.1)]'
    : 'bg-surface-muted border-surface-border';

  // Unauthenticated view
  if (!user || !token) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm z-[99999] font-sans"
      >
        <div className={`border rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-card-lg ${modalBg}`}>
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Account Dashboard</h3>
            <p className="text-xs text-ink-secondary mt-1">Sign in to sync saved corridors, track lifetime fuel savings, and manage bookings.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { onClose(); if (onOpenAuthModal) onOpenAuthModal(); }}
              className="flex-1 py-2.5 bg-primary hover:bg-primary-700 text-white text-xs font-semibold rounded-full shadow-card transition-all"
            >
              Sign In / Sign Up
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2.5 border rounded-full text-xs font-semibold ${isDark ? 'border-surface-border text-ink-secondary hover:text-white' : 'border-surface-border text-ink-secondary hover:text-ink'}`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm z-[99999] font-sans"
    >
      <div className={`border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-card-lg ${modalBg}`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-[rgba(34,211,238,0.15)] bg-[#0b0f19]' : 'border-surface-border bg-white'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">{user.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">Active Driver</span>
              </div>
              <p className="text-[11px] text-ink-secondary">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs text-danger hover:bg-danger/10 border border-danger/20 rounded-full font-semibold transition-all flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-ink-secondary hover:text-ink rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className={`flex border-b text-xs font-bold ${isDark ? 'border-[rgba(34,211,238,0.1)] bg-[#0b0f19]' : 'border-surface-border bg-surface-muted'}`}>
          <button
            onClick={() => setActiveTab('trips')}
            className={`flex-1 py-2.5 text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'trips'
                ? 'text-primary border-primary bg-transparent font-bold'
                : 'text-ink-secondary border-transparent hover:text-ink'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Saved Highway Corridors ({trips.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-2.5 text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'text-primary border-primary bg-transparent font-bold'
                : 'text-ink-secondary border-transparent hover:text-ink'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Charger Bay Holds ({bookings.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'bookings' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold">Your Active Charger Bay Holds</h4>
                  <p className="text-[11px] text-ink-secondary">Real-time reservations held with station passcodes</p>
                </div>
              </div>

              {bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bookings.map((booking, idx) => (
                    <BookingCard
                      key={booking._id || idx}
                      booking={booking}
                      onCancel={handleCancelBooking}
                      isDark={isDark}
                    />
                  ))}
                </div>
              ) : (
                <div className={`p-8 text-center rounded-xl border text-xs text-ink-secondary ${surfaceSubtle}`}>
                  No active charger holds currently. Click on any station on the map to reserve a fast bay for 30 minutes free.
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Lifetime Analytics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Distance', val: `${totalDistanceKm} km`, sub: 'EV Highway Cruising', color: 'text-primary' },
                  { label: 'Lifetime Saved', val: `₹${totalSavedCostINR.toLocaleString()}`, sub: 'vs Petrol ICE Car', color: 'text-success' },
                  { label: 'CO₂ Prevented', val: `${totalCo2SavedKg} kg`, sub: 'Direct Tailpipe Offset', color: 'text-success' },
                  { label: 'Corridors Planned', val: trips.length, sub: 'Logged to MongoDB', color: 'text-primary' }
                ].map(item => (
                  <div key={item.label} className={`p-3.5 rounded-xl border ${surfaceSubtle}`}>
                    <div className="text-[10px] text-ink-secondary font-bold uppercase tracking-wider">{item.label}</div>
                    <div className={`text-xl font-black font-mono mt-1 ${item.color}`}>{item.val}</div>
                    <div className="text-[9px] text-ink-tertiary mt-0.5">{item.sub}</div>
                  </div>
                ))}
              </div>

              {/* Side-by-side comparison */}
              {selectedTrips.length > 1 && (
                <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-primary/10 border-primary/20' : 'bg-primary/5 border-primary/20'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4" />
                      Side-by-Side Corridor Comparison ({selectedTrips.length}/3)
                    </span>
                    <button
                      onClick={() => setSelectedTripIds([])}
                      className="text-[10px] text-primary hover:underline font-semibold"
                    >
                      Clear Selection
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedTrips.map(st => {
                      const costInfo = calculateTripCostAndSavings(st.distanceKm || 0);
                      return (
                        <div key={st._id} className={`p-2.5 rounded-lg border text-xs space-y-1 ${isDark ? 'bg-[#111827] border-[rgba(34,211,238,0.15)]' : 'bg-white border-surface-border'}`}>
                          <div className="font-bold truncate">{st.title || `${st.sourceName} ➔ ${st.destName}`}</div>
                          <div className="text-[10px] text-ink-secondary">{st.distanceKm} km • {st.vehicleName}</div>
                          <div className="text-[11px] font-bold text-success font-mono">₹{st.savedCostINR || costInfo.savedCostINR} Saved</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Trips Table Controls */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h4 className="font-bold text-xs flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-primary" />
                      <span>Saved Trips ({filteredTrips.length})</span>
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-48">
                      <Search className="w-3.5 h-3.5 text-ink-tertiary absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search trips..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-primary ${
                          isDark 
                            ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.15)] text-[#e2e8f0]' 
                            : 'bg-white border-surface-border text-ink'
                        }`}
                      />
                    </div>

                    {/* Sort Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`text-xs rounded-lg px-2 py-1.5 border focus:outline-none focus:ring-1 focus:ring-primary ${
                        isDark 
                          ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.15)] text-[#e2e8f0]' 
                          : 'bg-white border-surface-border text-ink'
                      }`}
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="distance-desc">Longest First</option>
                      <option value="savings-desc">Max Savings</option>
                    </select>

                    {/* CSV Export Button */}
                    {trips.length > 0 && (
                      <button
                        onClick={handleExportCSV}
                        className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                          isDark 
                            ? 'border-[rgba(34,211,238,0.2)] text-primary hover:bg-[#1a2035]' 
                            : 'border-surface-border text-primary hover:bg-surface-subtle'
                        }`}
                        title="Download trip history as CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : filteredTrips.length > 0 ? (
                  <div className={`rounded-xl overflow-hidden divide-y border shadow-card ${
                    isDark 
                      ? 'bg-[#111827] border-[rgba(34,211,238,0.15)] divide-[rgba(34,211,238,0.1)]' 
                      : 'bg-white border-surface-border divide-surface-border'
                  }`}>
                    {filteredTrips.map((t) => {
                      const isChecked = selectedTripIds.includes(t._id);
                      const costInfo = calculateTripCostAndSavings(t.distanceKm || 0);
                      const estEvCost = t.chargingCostINR || costInfo.evChargingCostINR;
                      const netSavings = t.savedCostINR || costInfo.savedCostINR;

                      return (
                        <div 
                          key={t._id} 
                          className={`p-3.5 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                            isDark ? 'hover:bg-[#1a2035]' : 'hover:bg-surface-subtle'
                          }`}
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => toggleTripSelection(t._id)}
                              className="text-primary cursor-pointer"
                              title="Select to compare"
                            >
                              {isChecked ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5 text-ink-tertiary" />}
                            </button>

                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs truncate">
                                {t.title || `${t.sourceName} ➔ ${t.destName}`}
                              </div>
                              <div className="text-[11px] text-ink-secondary flex items-center gap-2 mt-0.5 truncate">
                                <span>{t.vehicleName || 'Tata Nexon EV Max'}</span>
                                <span>•</span>
                                <span className="font-mono text-primary font-bold">{t.distanceKm} km</span>
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
                              <div className="text-xs font-mono font-bold text-success">₹{netSavings} Saved</div>
                              <div className="text-[10px] text-ink-secondary">EV: ₹{estEvCost}</div>
                            </div>

                            <button
                              onClick={() => {
                                onLoadTripOnMap(
                                  { lat: t.sourceCoords[0], lng: t.sourceCoords[1], displayName: t.sourceName },
                                  { lat: t.destCoords[0], lng: t.destCoords[1], displayName: t.destName }
                                );
                                onClose();
                              }}
                              className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all shadow-card cursor-pointer ${
                                isDark 
                                  ? 'bg-[#1a2035] border-[rgba(34,211,238,0.15)] text-primary hover:bg-[#22d3ee]/10' 
                                  : 'bg-white border-surface-border text-primary hover:bg-surface-subtle'
                              }`}
                            >
                              View Map
                            </button>

                            <button
                              onClick={(e) => handleDeleteTrip(t._id, e)}
                              disabled={deletingTripId === t._id}
                              className="p-1.5 text-ink-tertiary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete trip"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : trips.length > 0 ? (
                  <div className={`p-6 text-center rounded-xl border text-xs text-ink-secondary ${surfaceSubtle}`}>
                    No trips matching "{searchQuery}".
                  </div>
                ) : (
                  <div className={`p-8 text-center rounded-xl border space-y-2 ${surfaceSubtle}`}>
                    <div className="p-3 bg-primary/10 text-primary rounded-full w-fit mx-auto border border-primary/20">
                      <Database className="w-6 h-6" />
                    </div>
                    <h5 className="font-bold text-xs">No Trips Saved Under Your Account Yet</h5>
                    <p className="text-[11px] text-ink-secondary max-w-sm mx-auto">
                      Plan a highway route in the map planner and click <strong>"Save Trip"</strong> to record lifetime fuel savings and EV analytics.
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
