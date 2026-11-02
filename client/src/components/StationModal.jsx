import React, { useState, useEffect } from 'react';
import {
  Zap, X, MapPin, CheckCircle, Clock, ShieldCheck,
  Navigation, DollarSign, Coffee, Star,
  MessageSquare, Send, AlertCircle
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
    comment: 'Plugged in Gun #2 CCS2, got steady 54-56 kW up to 75%. CCD café next door has clean washrooms.',
    timeAgo: '2 hours ago',
  },
  {
    id: 'rev-2',
    userName: 'Priya Mehta (MG ZS EV)',
    rating: 4.5,
    testedPowerKW: 50,
    gunStatus: 'Gun #1 Working Fine',
    comment: 'Seamless RFID tap. Security guard helped parking. Charged 20% → 80% in 38 mins.',
    timeAgo: 'Yesterday',
  },
];

export default function StationModal({ station, onClose, user, token, isDark = false }) {
  const [activeTab, setActiveTab]           = useState('overview');
  const [reservedSlot, setReservedSlot]     = useState(false);
  const [reservationCode, setReservationCode] = useState('');
  const [timeLeftSecs, setTimeLeftSecs]     = useState(1800);
  const [reviews, setReviews]               = useState(INITIAL_REVIEWS);
  const [showAddReview, setShowAddReview]   = useState(false);
  const [newRating, setNewRating]           = useState(5);
  const [newTestedPower, setNewTestedPower] = useState(station?.power || 60);
  const [newGunStatus, setNewGunStatus]     = useState('Gun #2 Working 100%');
  const [newComment, setNewComment]         = useState('');
  const [isSubmitting, setIsSubmitting]     = useState(false);

  /* existing reservation check */
  useEffect(() => {
    if (!station) return;
    try {
      const saved = JSON.parse(localStorage.getItem('charge_nova_active_bookings') || '[]');
      const ex = saved.find(b => b.stationId === station.id && b.status === 'Active');
      if (ex) {
        const rem = Math.max(0, Math.floor((new Date(ex.expiresAt) - new Date()) / 1000));
        if (rem > 0) { setReservationCode(ex.code); setReservedSlot(true); setTimeLeftSecs(rem); }
      }
    } catch {}
  }, [station]);

  /* fetch backend reviews */
  useEffect(() => {
    if (!station) return;
    (async () => {
      try {
        const res = await axios.get(`${getApiBaseUrl()}/api/reservations/stations/${station.id}/reviews`);
        if (res.data?.reviews?.length > 0) setReviews([...res.data.reviews, ...INITIAL_REVIEWS]);
      } catch {}
    })();
  }, [station]);

  /* countdown timer */
  useEffect(() => {
    if (!reservedSlot || timeLeftSecs <= 0) return;
    const t = setInterval(() => setTimeLeftSecs(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [reservedSlot, timeLeftSecs]);

  if (!station) return null;

  const handleReserve = async () => {
    const code = 'NOVA-' + (station.operator ? station.operator.slice(0, 3).toUpperCase() : 'EV') + '-' + Math.floor(1000 + Math.random() * 9000);
    setReservationCode(code); setReservedSlot(true); setTimeLeftSecs(1800);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const obj = { _id: 'local-' + Date.now(), stationId: station.id, stationName: station.title || station.name, operator: station.operator || 'EV Network', code, powerKW: station.power || 60, connector: station.connectors?.[0] || 'CCS2', rateINR: station.rateINR || 19.5, coords: [station.lat, station.lng], expiresAt, status: 'Active', createdAt: new Date().toISOString() };
    try {
      const prev = JSON.parse(localStorage.getItem('charge_nova_active_bookings') || '[]');
      localStorage.setItem('charge_nova_active_bookings', JSON.stringify([obj, ...prev.filter(b => b.stationId !== station.id)]));
    } catch {}
    if (token) {
      try { await axios.post(`${getApiBaseUrl()}/api/reservations/book`, { stationId: station.id, stationName: station.title || station.name, operator: station.operator || 'EV Network', code, powerKW: station.power || 60, connector: station.connectors?.[0] || 'CCS2', rateINR: station.rateINR || 19.5, coords: [station.lat, station.lng] }, { headers: { Authorization: `Bearer ${token}` } }); } catch {}
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    const rev = { id: 'rev-' + Date.now(), userName: user?.name ? `${user.name} (EV Driver)` : 'Verified EV Driver', rating: newRating, testedPowerKW: Number(newTestedPower), gunStatus: newGunStatus, comment: newComment.trim(), timeAgo: 'Just now' };
    try { if (token) await axios.post(`${getApiBaseUrl()}/api/reservations/stations/${station.id}/reviews`, rev, { headers: { Authorization: `Bearer ${token}` } }); } catch {}
    setReviews([rev, ...reviews]); setNewComment(''); setShowAddReview(false); setIsSubmitting(false);
  };

  const openNav = () => window.open(`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}&travelmode=driving`, '_blank');
  const fmtTime = `${Math.floor(timeLeftSecs / 60)}:${String(timeLeftSecs % 60).padStart(2, '0')}`;
  const amenities = station.amenities?.length > 0 ? station.amenities : ['Restroom', 'Food Court', '24x7 Security', 'Wi-Fi'];

  /* ── Style tokens ── */
  const bg = isDark ? 'bg-[#111827] text-[#e2e8f0] border-[rgba(34,211,238,0.15)]' : 'bg-white text-ink border-surface-border';
  const headerBg = isDark ? 'bg-[#0b0f19] border-b border-[rgba(34,211,238,0.12)]' : 'bg-white border-b border-surface-border';
  const tabBar = isDark ? 'bg-[#0b0f19] border-b border-[rgba(34,211,238,0.12)]' : 'bg-surface-muted border-b border-surface-border';
  const tabActive = isDark ? 'text-[#22d3ee] border-[#22d3ee] bg-[#111827]' : 'text-primary border-primary bg-white';
  const tabInactive = isDark ? 'text-[#94a3b8] border-transparent hover:text-[#e2e8f0]' : 'text-ink-secondary border-transparent hover:text-ink';
  const tile = isDark ? 'bg-[#1a2035] border border-[rgba(34,211,238,0.1)]' : 'bg-surface-muted border border-surface-border';
  const muted = isDark ? 'text-[#94a3b8]' : 'text-ink-secondary';
  const reviewCard = isDark ? 'bg-[#1a2035] border border-[rgba(34,211,238,0.1)]' : 'bg-white border border-surface-border shadow-card';
  const inputCls = isDark
    ? 'bg-[#0b0f19] border border-[rgba(34,211,238,0.15)] text-[#e2e8f0] placeholder-[#64748b] focus:border-[#22d3ee]'
    : 'bg-white border border-surface-border text-ink placeholder-ink-tertiary focus:border-primary';

  const amenityIcon = (a) => {
    const l = a.toLowerCase();
    if (l.includes('restroom')) return '🚻';
    if (l.includes('food') || l.includes('café') || l.includes('cafe')) return '🍔';
    if (l.includes('wi-fi') || l.includes('wifi')) return '📶';
    if (l.includes('security')) return '🛡️';
    if (l.includes('store')) return '🛒';
    return '✓';
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className={`rounded-2xl max-w-md w-full overflow-hidden shadow-2xl max-h-[90vh] flex flex-col border ${bg}`}>

        {/* ── Header ── */}
        <div className={`p-4 flex items-center justify-between ${headerBg}`}>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-success/10 text-success rounded-xl border border-success/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {station.operator || 'EV Network'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                  isDark ? 'bg-success/20 text-[#34d399] border-success/30' : 'bg-success/10 text-success border-success/20'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Guns Online
                </span>
              </div>
              <h3 className="text-xs font-bold truncate max-w-[240px] mt-0.5">
                {station.title || station.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${muted} hover:text-ink hover:bg-surface-subtle`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Tab bar ── */}
        <div className={`flex text-xs font-bold ${tabBar}`}>
          {[
            { id: 'overview', label: 'Station & Amenities' },
            { id: 'reviews',  label: `Driver Reports (${reviews.length})`, icon: <MessageSquare className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === tab.id ? tabActive : tabInactive
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1">

          {activeTab === 'overview' ? (
            <>
              {/* Specs grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Power',  value: `${station.power || 60} kW`, color: 'text-success' },
                  { label: 'Tariff', value: `₹${station.rateINR || 19}/kWh`, color: 'text-primary' },
                  { label: 'Plug',   value: station.connectors?.[0] || 'CCS2', color: isDark ? 'text-[#e2e8f0]' : 'text-ink' },
                ].map(s => (
                  <div key={s.label} className={`p-2.5 rounded-xl ${tile}`}>
                    <div className={`text-[10px] uppercase font-bold ${muted}`}>{s.label}</div>
                    <div className={`text-sm font-bold font-mono mt-0.5 ${s.color}`}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div className="space-y-1.5">
                <div className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${muted}`}>
                  <Coffee className="w-3.5 h-3.5 text-primary" /> Highway Amenities
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {amenities.map((a, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 ${
                        isDark ? 'bg-[#1a2035] border border-[rgba(34,211,238,0.1)] text-[#94a3b8]' : 'bg-white border border-surface-border text-ink-secondary shadow-card'
                      }`}
                    >
                      <span>{amenityIcon(a)}</span>
                      <span>{a}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Reservation */}
              {!reservedSlot ? (
                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleReserve}
                    className="w-full py-2.5 bg-primary hover:bg-primary-700 text-white font-semibold rounded-full text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Reserve 30-Min Fast Slot — Free
                  </button>
                  <button
                    onClick={openNav}
                    className={`w-full py-2 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border ${
                      isDark
                        ? 'bg-transparent text-[#22d3ee] border-[rgba(34,211,238,0.2)] hover:bg-[#22d3ee]/10'
                        : 'bg-white text-primary border-surface-border hover:bg-surface-subtle'
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5" /> Open in Google Maps
                  </button>
                </div>
              ) : (
                <div className={`p-3 rounded-xl text-center space-y-2 border ${
                  isDark ? 'bg-success/10 border-success/20' : 'bg-success/5 border-success/20'
                }`}>
                  <div className={`text-xs font-bold flex items-center justify-center gap-1 text-success`}>
                    <CheckCircle className="w-4 h-4" /> Slot Reserved — Check Dashboard for Booking
                  </div>
                  <div className={`p-2.5 rounded-lg border space-y-1 ${
                    isDark ? 'bg-[#1a2035] border-[rgba(34,211,238,0.1)]' : 'bg-white border-surface-border'
                  }`}>
                    <div className={`text-[10px] ${muted}`}>Bay Passcode</div>
                    <div className="text-base font-mono font-extrabold text-primary tracking-wider">{reservationCode}</div>
                    <div className="text-[10px] text-success font-semibold flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" /> Held for: {fmtTime}
                    </div>
                  </div>
                  <button
                    onClick={openNav}
                    className="w-full py-2 bg-success hover:bg-success-dark text-white font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Navigate to Bay
                  </button>
                </div>
              )}
            </>
          ) : (
            /* ── Reviews tab ── */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold">Driver Verified Reports</h4>
                  <p className={`text-[10px] ${muted}`}>Real charging speeds & gun status</p>
                </div>
                <button
                  onClick={() => setShowAddReview(!showAddReview)}
                  className="px-2.5 py-1 bg-primary hover:bg-primary-700 text-white rounded-lg text-[10px] font-semibold transition-all shadow-sm"
                >
                  {showAddReview ? 'Cancel' : '+ Add Report'}
                </button>
              </div>

              {/* Add review form */}
              {showAddReview && (
                <form onSubmit={handleSubmitReview} className={`p-3 rounded-xl border space-y-2.5 ${
                  isDark ? 'bg-[#1a2035] border-[rgba(34,211,238,0.1)]' : 'bg-surface-muted border-surface-border'
                }`}>
                  <div className="text-[11px] font-bold">Submit Live Station Status</div>

                  {/* Star rating */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setNewRating(s)}>
                        <Star className={`w-4 h-4 transition-colors ${s <= newRating ? 'text-warning fill-current' : muted}`} />
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`text-[10px] font-semibold ${muted}`}>Gun Status</label>
                      <select value={newGunStatus} onChange={e => setNewGunStatus(e.target.value)}
                        className={`w-full rounded-lg px-2 py-1.5 text-[11px] mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary ${inputCls}`}>
                        <option>Gun #1 Working Fine</option>
                        <option>Gun #2 Working 100%</option>
                        <option>Both Guns Active</option>
                        <option>Slow Speed (~25 kW)</option>
                        <option>Gun Faulty / Error</option>
                      </select>
                    </div>
                    <div>
                      <label className={`text-[10px] font-semibold ${muted}`}>Tested Speed (kW)</label>
                      <input type="number" min="10" max="240" value={newTestedPower} onChange={e => setNewTestedPower(e.target.value)}
                        className={`w-full rounded-lg px-2 py-1.5 text-[11px] mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary ${inputCls}`} />
                    </div>
                  </div>

                  <div>
                    <label className={`text-[10px] font-semibold ${muted}`}>Your Experience</label>
                    <textarea rows={2} value={newComment} onChange={e => setNewComment(e.target.value)}
                      placeholder="e.g. Gun #2 at 55 kW. CCD café and clean washrooms nearby."
                      className={`w-full rounded-lg p-2 text-[11px] mt-0.5 resize-none focus:outline-none focus:ring-1 focus:ring-primary ${inputCls}`} />
                  </div>

                  <button type="submit" disabled={isSubmitting || !newComment.trim()}
                    className="w-full py-1.5 bg-primary hover:bg-primary-700 text-white font-semibold rounded-lg text-[11px] transition-all disabled:opacity-50 flex items-center justify-center gap-1">
                    <Send className="w-3 h-3" /> Post Live Report
                  </button>
                </form>
              )}

              {/* Review list */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {reviews.map((rev, i) => (
                  <div key={rev.id || i} className={`p-2.5 rounded-xl space-y-1.5 ${reviewCard}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold">{rev.userName}</span>
                      <span className={`text-[10px] ${muted}`}>{rev.timeAgo || 'Recent'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        isDark ? 'bg-success/20 text-[#34d399] border-success/30' : 'bg-success/10 text-success border-success/20'
                      }`}>
                        ⚡ {rev.testedPowerKW} kW
                      </span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                        isDark ? 'bg-primary/20 text-[#38bdf8] border-primary/30' : 'bg-primary/10 text-primary border-primary/20'
                      }`}>
                        {rev.gunStatus}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${muted}`}>{rev.comment}</p>
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
