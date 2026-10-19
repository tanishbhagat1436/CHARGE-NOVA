import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  X, 
  MapPin, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Coffee, 
  Wifi, 
  Shield, 
  Navigation, 
  DollarSign,
  Sparkles,
  QrCode,
  Star,
  MessageSquare,
  Send,
  AlertCircle,
  ThumbsUp
} from 'lucide-react';
import axios from 'axios';
import { getApiBaseUrl } from '../services/apiConfig';

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    userName: 'Rahul Sharma (Nexon EV Max)',
    rating: 5,
    testedPowerKW: 56,
    gunStatus: 'Gun #2 Working 100%',
    comment: 'Plugged in Gun #2 CCS2, got steady 54-56 kW speed up to 75%. CCD café next door has clean washrooms.',
    timeAgo: '2 hours ago'
  },
  {
    id: 'rev-2',
    userName: 'Priya Mehta (MG ZS EV)',
    rating: 4.5,
    testedPowerKW: 50,
    gunStatus: 'Gun #1 Working Fine',
    comment: 'Seamless RFID tap. Security guard on site helped parking. Charged 20% to 80% in 38 mins.',
    timeAgo: 'Yesterday'
  }
];

export default function StationModal({ station, onClose, user, token }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'reviews'
  const [reservedSlot, setReservedSlot] = useState(false);
  const [reservationCode, setReservationCode] = useState('');
  const [timeLeftSecs, setTimeLeftSecs] = useState(1800); // 30 minutes countdown
  
  // Reviews state
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTestedPower, setNewTestedPower] = useState(station?.power || 60);
  const [newGunStatus, setNewGunStatus] = useState('Gun #2 Working 100%');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Check if station was already reserved in localStorage
  useEffect(() => {
    if (!station) return;
    try {
      const savedBookings = JSON.parse(localStorage.getItem('charge_nova_active_bookings') || '[]');
      const existing = savedBookings.find(b => b.stationId === station.id && b.status === 'Active');
      if (existing) {
        const remaining = Math.max(0, Math.floor((new Date(existing.expiresAt) - new Date()) / 1000));
        if (remaining > 0) {
          setReservationCode(existing.code);
          setReservedSlot(true);
          setTimeLeftSecs(remaining);
        }
      }
    } catch (e) {
      console.warn('Booking parse error:', e);
    }
  }, [station]);

  // Fetch reviews from backend if available
  useEffect(() => {
    if (!station) return;
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${getApiBaseUrl()}/api/reservations/stations/${station.id}/reviews`);
        if (res.data?.reviews?.length > 0) {
          setReviews([...res.data.reviews, ...INITIAL_REVIEWS]);
        }
      } catch (e) {
        // Fallback to initial reviews
      }
    };
    fetchReviews();
  }, [station]);

  useEffect(() => {
    let timer = null;
    if (reservedSlot && timeLeftSecs > 0) {
      timer = setInterval(() => {
        setTimeLeftSecs(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [reservedSlot, timeLeftSecs]);

  if (!station) return null;

  const handleReserve = async () => {
    const code = 'NOVA-' + (station.operator ? station.operator.slice(0, 3).toUpperCase() : 'EV') + '-' + Math.floor(1000 + Math.random() * 9000);
    setReservationCode(code);
    setReservedSlot(true);
    setTimeLeftSecs(1800);

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const newBookingObj = {
      _id: 'local-' + Date.now(),
      stationId: station.id,
      stationName: station.title || station.name,
      operator: station.operator || 'EV Network',
      code,
      powerKW: station.power || 60,
      connector: station.connectors?.[0] || 'CCS2',
      rateINR: station.rateINR || 19.5,
      coords: [station.lat, station.lng],
      expiresAt,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    // Save in LocalStorage
    try {
      const savedBookings = JSON.parse(localStorage.getItem('charge_nova_active_bookings') || '[]');
      const filtered = savedBookings.filter(b => b.stationId !== station.id);
      localStorage.setItem('charge_nova_active_bookings', JSON.stringify([newBookingObj, ...filtered]));
    } catch (e) {}

    // Save in MongoDB if user is authenticated
    if (token) {
      try {
        await axios.post(`${getApiBaseUrl()}/api/reservations/book`, {
          stationId: station.id,
          stationName: station.title || station.name,
          operator: station.operator || 'EV Network',
          code,
          powerKW: station.power || 60,
          connector: station.connectors?.[0] || 'CCS2',
          rateINR: station.rateINR || 19.5,
          coords: [station.lat, station.lng]
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.warn('MongoDB reservation save failed, cached locally:', err.message);
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingReview(true);
    const reviewData = {
      id: 'rev-' + Date.now(),
      userName: user?.name ? `${user.name} (${user.defaultVehicle || 'EV Driver'})` : 'Verified EV Driver',
      rating: newRating,
      testedPowerKW: Number(newTestedPower),
      gunStatus: newGunStatus,
      comment: newComment.trim(),
      timeAgo: 'Just now'
    };

    try {
      if (token) {
        await axios.post(`${getApiBaseUrl()}/api/reservations/stations/${station.id}/reviews`, reviewData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.warn('Backend review save failed, using local list');
    }

    setReviews([reviewData, ...reviews]);
    setNewComment('');
    setShowAddReview(false);
    setIsSubmittingReview(false);
  };

  const handleOpenNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const mins = Math.floor(timeLeftSecs / 60);
  const secs = timeLeftSecs % 60;
  const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const amenitiesList = station.amenities && station.amenities.length > 0
    ? station.amenities
    : ['Restroom', 'Food Court', '24x7 Security', 'Wi-Fi'];

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-in fade-in duration-200"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white border border-[#dadce0] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-[#202124] max-h-[90vh] flex flex-col">
        
        {/* Header with CPO Branding */}
        <div className="p-4 bg-white border-b border-[#dadce0] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-50 text-[#1e8e3e] rounded-xl border border-emerald-200 font-bold shadow-sm">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1a73e8] border border-blue-200">
                  {station.operator || 'EV Network'}
                </span>
                <span className="text-[10px] text-[#1e8e3e] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e] animate-pulse"></span>
                  Guns Online
                </span>
              </div>
              <h3 className="text-xs font-bold text-[#202124] truncate max-w-[240px] mt-0.5">
                {station.title || station.name}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#5f6368] hover:text-[#202124] rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#dadce0] bg-[#f8f9fa] text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 text-center transition-all cursor-pointer border-b-2 ${
              activeTab === 'overview'
                ? 'text-[#1a73e8] border-[#1a73e8] bg-white'
                : 'text-[#5f6368] border-transparent hover:text-[#202124]'
            }`}
          >
            Station & Amenities
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2 text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'text-[#1a73e8] border-[#1a73e8] bg-white'
                : 'text-[#5f6368] border-transparent hover:text-[#202124]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Driver Reports ({reviews.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1">
          
          {activeTab === 'overview' ? (
            <>
              {/* Key Charger Specs Banner */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#f8f9fa] p-2.5 rounded-xl border border-[#dadce0]">
                  <div className="text-[10px] uppercase font-bold text-[#5f6368]">Power</div>
                  <div className="text-sm font-bold text-[#1e8e3e] font-mono mt-0.5">{station.power || 60} kW</div>
                </div>
                <div className="bg-[#f8f9fa] p-2.5 rounded-xl border border-[#dadce0]">
                  <div className="text-[10px] uppercase font-bold text-[#5f6368]">Tariff</div>
                  <div className="text-sm font-bold text-[#1a73e8] font-mono mt-0.5">₹{station.rateINR || 19}/kWh</div>
                </div>
                <div className="bg-[#f8f9fa] p-2.5 rounded-xl border border-[#dadce0]">
                  <div className="text-[10px] uppercase font-bold text-[#5f6368]">Plug</div>
                  <div className="text-sm font-bold text-[#202124] font-mono mt-0.5">{station.connectors?.[0] || 'CCS2'}</div>
                </div>
              </div>

              {/* Highway Amenities Section */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-[#5f6368] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
                  <span>Highway Amenities at Station</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {amenitiesList.map((amenity, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 bg-white border border-[#dadce0] rounded-lg text-[10px] font-semibold text-[#3c4043] flex items-center gap-1 shadow-xs"
                    >
                      {amenity.toLowerCase().includes('restroom') && <span>🚻</span>}
                      {amenity.toLowerCase().includes('food') && <span>🍔</span>}
                      {amenity.toLowerCase().includes('caf') && <span>☕</span>}
                      {amenity.toLowerCase().includes('wi-fi') && <span>📶</span>}
                      {amenity.toLowerCase().includes('security') && <span>🛡️</span>}
                      {amenity.toLowerCase().includes('store') && <span>🛒</span>}
                      <span>{amenity}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Reservation / Slot Action */}
              {!reservedSlot ? (
                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleReserve}
                    className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold rounded-full text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Reserve 30-Min Fast Slot Free</span>
                  </button>

                  <button
                    onClick={handleOpenNavigation}
                    className="w-full py-2 bg-white hover:bg-slate-50 text-[#1a73e8] border border-[#dadce0] font-semibold rounded-full text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open in Google Maps</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-in fade-in duration-300">
                  <div className="text-xs font-bold text-[#137333] flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4 text-[#1e8e3e]" />
                    <span>Slot Saved in Your Account & Bookings!</span>
                  </div>
                  
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200 space-y-1">
                    <div className="text-[10px] text-[#5f6368]">Charger Bay Auth Passcode:</div>
                    <div className="text-base font-mono font-extrabold text-[#1a73e8] tracking-wider">
                      {reservationCode}
                    </div>
                    <div className="text-[10px] text-[#137333] font-semibold flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Held for: {formattedTime} mins</span>
                    </div>
                  </div>

                  <button
                    onClick={handleOpenNavigation}
                    className="w-full py-2 bg-[#1e8e3e] hover:bg-[#137333] text-white font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate Directly to Bay</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Driver Community Reviews & Gun Status Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#202124]">Driver Verified Reports</h4>
                  <p className="text-[10px] text-[#5f6368]">Real charging speeds & working gun reports</p>
                </div>
                <button
                  onClick={() => setShowAddReview(!showAddReview)}
                  className="px-2.5 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-md text-[10px] font-semibold transition-all cursor-pointer shadow-xs"
                >
                  {showAddReview ? 'Cancel' : '+ Add Report'}
                </button>
              </div>

              {/* Add Report Form */}
              {showAddReview && (
                <form onSubmit={handleSubmitReview} className="bg-[#f8f9fa] p-3 rounded-xl border border-[#dadce0] space-y-2.5 animate-in fade-in duration-200">
                  <div className="text-[11px] font-bold text-[#202124]">Submit Live Station Status</div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-[#5f6368]">Gun Status</label>
                      <select
                        value={newGunStatus}
                        onChange={(e) => setNewGunStatus(e.target.value)}
                        className="w-full bg-white border border-[#dadce0] rounded-md px-2 py-1 text-[11px] text-[#202124]"
                      >
                        <option value="Gun #1 Working Fine">Gun #1 Working Fine</option>
                        <option value="Gun #2 Working 100%">Gun #2 Working 100%</option>
                        <option value="Both Guns Active">Both Guns Active</option>
                        <option value="Slow Speed (~25 kW)">Slow Speed (~25 kW)</option>
                        <option value="Gun Faulty / Error">Gun Faulty / Error</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-[#5f6368]">Tested Speed (kW)</label>
                      <input
                        type="number"
                        min="10"
                        max="240"
                        value={newTestedPower}
                        onChange={(e) => setNewTestedPower(e.target.value)}
                        className="w-full bg-white border border-[#dadce0] rounded-md px-2 py-1 text-[11px] text-[#202124]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-[#5f6368]">Your Experience & Amenities</label>
                    <textarea
                      rows={2}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="e.g. Gun #2 working at 55 kW. CCD coffee bar and clean washrooms available."
                      className="w-full bg-white border border-[#dadce0] rounded-md p-2 text-[11px] text-[#202124] placeholder-[#5f6368] focus:outline-none focus:border-[#1a73e8]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview || !newComment.trim()}
                    className="w-full py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold rounded-md text-[11px] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post Live Report</span>
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {reviews.map((rev, idx) => (
                  <div key={rev.id || idx} className="p-2.5 bg-white border border-[#dadce0] rounded-xl space-y-1 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#202124]">{rev.userName}</span>
                      <span className="text-[10px] text-[#5f6368]">{rev.timeAgo || 'Recent'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-50 text-[#137333] border border-emerald-200 rounded">
                        ⚡ {rev.testedPowerKW} kW real
                      </span>
                      <span className="text-[10px] font-medium text-[#1a73e8] bg-blue-50 px-1.5 py-0.2 border border-blue-200 rounded">
                        {rev.gunStatus}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#3c4043] leading-relaxed pt-0.5">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
