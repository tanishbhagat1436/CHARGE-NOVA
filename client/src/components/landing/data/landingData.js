import {
  Zap, Navigation, ShieldCheck, MapPin, Activity, ShieldAlert,
  FileText, QrCode, CheckCircle2, ArrowRight, User, LogIn,
  BarChart3, Sparkles, TrendingDown, DollarSign, Layers,
  ChevronRight, ChevronDown, ChevronLeft, Home, ArrowUp, BatteryCharging,
  Battery, Clock, Award, Leaf, PhoneCall, HelpCircle, Check,
  Cpu, Compass, Sliders, Globe, Shield, Gauge, Star
} from 'lucide-react';

export const CORRIDORS = [
  { id: 'delhi-jaipur',   title: 'Delhi → Jaipur',   highway: 'NH 48 · Delhi-Jaipur Expressway',   distanceKm: 280, duration: '4.5 hrs', stops: '1 Fast Stop',    recommendedStop: 'Neemrana Plaza (60 kW DC)', source: { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi, Delhi' },       dest: { lat: 26.9124, lng: 75.7873, displayName: 'Jaipur, Rajasthan' },       badge: 'Popular', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'mumbai-pune',    title: 'Mumbai → Pune',    highway: 'Mumbai-Pune Expressway',             distanceKm: 155, duration: '3.0 hrs', stops: '0–1 Stops',     recommendedStop: 'Khalapur Food Mall (50 kW DC)', source: { lat: 19.0760, lng: 72.8777, displayName: 'Mumbai, Maharashtra' },     dest: { lat: 18.5204, lng: 73.8567, displayName: 'Pune, Maharashtra' },       badge: 'Scenic',  badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'blr-mysuru',     title: 'Bengaluru → Mysuru', highway: 'NH 275 Access Expressway',          distanceKm: 145, duration: '2.5 hrs', stops: '0–1 Stops',     recommendedStop: 'Maddur Highway Plaza (60 kW DC)', source: { lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru, Karnataka' },   dest: { lat: 12.2958, lng: 76.6394, displayName: 'Mysuru, Karnataka' },       badge: 'Fast',    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'delhi-agra',     title: 'Delhi → Agra',     highway: 'Yamuna Expressway',                  distanceKm: 235, duration: '3.5 hrs', stops: '1 Fast Stop',    recommendedStop: 'Jewar Plaza (50 kW DC)', source: { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi, Delhi' },       dest: { lat: 27.1767, lng: 78.0081, displayName: 'Agra, Uttar Pradesh' },    badge: 'Heritage', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'chennai-blr',    title: 'Chennai → Bengaluru', highway: 'NH 48 Inter-State Corridor',      distanceKm: 345, duration: '6.0 hrs', stops: '1–2 Fast Stops', recommendedStop: 'Vellore & Krishnagiri Hubs', source: { lat: 13.0827, lng: 80.2707, displayName: 'Chennai, Tamil Nadu' },    dest: { lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru, Karnataka' },   badge: 'Cross-State', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'ahm-vadodara',   title: 'Ahmedabad → Vadodara', highway: 'National Expressway 1 (NE 1)',  distanceKm: 110, duration: '2.0 hrs', stops: 'Direct',          recommendedStop: 'Reliance Anand Plaza (60 kW DC)', source: { lat: 23.0225, lng: 72.5714, displayName: 'Ahmedabad, Gujarat' },    dest: { lat: 22.3072, lng: 73.1812, displayName: 'Vadodara, Gujarat' },      badge: 'Express', badgeColor: 'bg-teal-50 text-teal-700 border-teal-200' },
];

export const FLEET = [
  { name: 'Tata Nexon EV Max', category: 'Best-Selling Compact SUV', battery: 40.5, arai: 437, real: 310, dc: '50 kW DC', charge: '56 min (10–80%)', cost: '₹1.25/km', eff: '135 Wh/km' },
  { name: 'MG ZS EV Long Range', category: 'Executive Highway SUV', battery: 50.3, arai: 461, real: 340, dc: '60 kW DC', charge: '54 min (10–80%)', cost: '₹1.35/km', eff: '148 Wh/km' },
  { name: 'Hyundai Ioniq 5', category: 'Ultra-Fast 800V Architecture', battery: 72.6, arai: 631, real: 480, dc: '350 kW DC', charge: '18 min (10–80%)', cost: '₹1.45/km', eff: '151 Wh/km' },
  { name: 'Mahindra XUV400 EV', category: 'Long-Wheelbase Fast SUV', battery: 39.4, arai: 456, real: 300, dc: '50 kW DC', charge: '50 min (10–80%)', cost: '₹1.28/km', eff: '131 Wh/km' },
  { name: 'Tata Punch EV', category: 'Urban & Sub-Highway Crossover', battery: 35.0, arai: 421, real: 285, dc: '30 kW DC', charge: '56 min (10–80%)', cost: '₹1.10/km', eff: '122 Wh/km' },
  { name: 'BYD Atto 3', category: 'Extended Range EV Crossover', battery: 60.48, arai: 521, real: 380, dc: '80 kW DC', charge: '50 min (10–80%)', cost: '₹1.40/km', eff: '159 Wh/km' },
];

export const NETWORKS = [
  { name: 'Tata Power EZ Charge', count: '4,500+', tagline: 'Largest Indian DC Grid' },
  { name: 'Statiq Power Plazas',  count: '2,800+', tagline: 'App-Reservable Dual-Gun' },
  { name: 'Jio-bp pulse',         count: '1,500+', tagline: 'Highway Retail Outlets' },
  { name: 'Zeon Charging',        count: '1,200+', tagline: 'South India Corridors' },
  { name: 'ChargeZone',           count: '1,900+', tagline: 'Dedicated Fast Corridors' },
  { name: 'Glida (Fortum)',       count: '900+',   tagline: 'Premium Transit Plazas' },
];

export const FEATURES = [
  { icon: Zap,        color: 'text-primary bg-primary/10 border-primary/20',  title: 'Smart Charging Algorithm',   desc: 'Physics-informed battery modeling with AC cabin load, highway speed aero drag, and charging curve integration.', tag: 'Physics Engine' },
  { icon: Activity,   color: 'text-success bg-success/10 border-success/20',  title: 'Live Traffic & Climate',       desc: 'Real-time TomTom congestion delays and Open-Meteo ambient temperature range load calculation.', tag: 'TomTom + Open-Meteo' },
  { icon: BarChart3,  color: 'text-indigo-600 bg-indigo-50 border-indigo-200', title: 'Persistent Trip Analytics',    desc: 'MongoDB-backed history. Compare up to 3 corridors side-by-side with energy savings delta.', tag: 'Corridor Comparison' },
  { icon: Navigation, color: 'text-warning bg-warning/10 border-warning/20',   title: 'Hardware GPS Navigation',      desc: 'Turn-by-turn highway guidance via device GPS with heading rotation, live speed, and camera radars.', tag: 'Turn Guidance' },
  { icon: QrCode,     color: 'text-purple-600 bg-purple-50 border-purple-200', title: 'Passenger QR Pass',             desc: 'Passengers scan a live QR code to stream route telemetry, charging stops, and SOC directly on phone.', tag: 'Mobile Sync' },
  { icon: ShieldAlert,color: 'text-danger bg-danger/10 border-danger/20',   title: '24x7 Roadside SOS',            desc: 'Instant NHAI 1033 helpline, EV breakdown assistance, flatbed towing, and emergency charging vans.', tag: 'Emergency Assistance' },
];

export const STEPS = [
  { n: '01', color: 'text-primary',  title: 'Select Your EV',     desc: 'Pick from Nexon EV, MG ZS, Ioniq 5, or enter custom battery kWh specs.' },
  { n: '02', color: 'text-success',  title: 'Set Corridor',        desc: 'Enter origin & destination or use device GPS — search any Indian city or highway.' },
  { n: '03', color: 'text-warning',  title: 'Physics Optimizer',   desc: 'Engine calculates exact charging plazas, charge minutes, and TomTom traffic delays.' },
  { n: '04', color: 'text-danger',   title: 'Drive & Sync',        desc: 'Live GPS nav, passenger QR pass, and automatic trip save to your dashboard.' },
];

export const FAQS = [
  { q: 'How does Charge Nova calculate charging stops?', a: 'A physics-informed engine integrates battery capacity, highway aerodynamics, elevation, ambient temperature (AC cabin load), and your reserve buffer (5–30% SOC). Only high-reliability DC Fast Chargers along your driving corridor are recommended.' },
  { q: 'Why does real highway range differ from ARAI?', a: 'ARAI ratings are measured in low-speed urban cycles without AC or aerodynamic drag. At sustained highway speeds of 90–100 km/h with 35°C cabin cooling, EVs consume 20–30% more energy. Charge Nova accounts for these exact conditions.' },
  { q: 'How does the Passenger QR Pass work?', a: 'Click "QR Pass" inside the planner to generate a live QR. When passengers scan it, Charge Nova opens on their phone — live route, charging halts, turns, and battery status synced instantly.' },
  { q: 'Can I add a custom EV not in the list?', a: 'Yes! The Custom Vehicle Builder accepts battery capacity (kWh), highway range, connector type, and AC rating. The optimizer tailors every route to your exact specs.' },
  { q: 'Does Charge Nova use live traffic?', a: 'Every route is checked against TomTom Live Traffic — congestion delays, flow speeds, and travel times — ensuring charging arrival estimates stay accurate.' },
  { q: 'Are my trips saved permanently?', a: 'With MongoDB persistence, trips are saved under your authenticated profile. Reopen past corridors, track cumulative savings, and compare up to 3 corridors side-by-side.' },
];

export const TESTIMONIALS = [
  { name: 'Vikram Anand', vehicle: 'Nexon EV Max', corridor: 'Delhi → Jaipur', rating: 5, text: 'Charge Nova planned a perfect single-stop route. The physics calculation was spot-on — arrived at Neemrana with exactly 21% SOC as predicted.' },
  { name: 'Meera Krishnan', vehicle: 'MG ZS EV', corridor: 'Chennai → Bengaluru', rating: 5, text: 'The live traffic overlay saved us 40 minutes by routing around a highway bottleneck. Night HUD mode kept it easy on the eyes after sunset.' },
  { name: 'Arjun Malhotra', vehicle: 'Hyundai Ioniq 5', corridor: 'Mumbai → Pune', rating: 5, text: 'Trip analytics helped me realise I was 30% cheaper than petrol after just 3 months. The dashboard savings graph is incredibly motivating.' },
];

export const REAL_SAVINGS_METRICS = [
  {
    val: '₹1.25',
    unit: '/ km',
    label: 'Highway EV Running Cost',
    sub: 'vs ₹7.50 / km for standard petrol cars',
    badge: '6x Cheaper',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    color: 'text-success'
  },
  {
    val: 'Save 75%–80%',
    unit: '',
    label: 'Net Highway Fuel Savings',
    sub: 'Direct operational cash saved per trip',
    badge: 'Top Economy',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    color: 'text-primary'
  },
  {
    val: '₹1,760 Saved',
    unit: '',
    label: 'Delhi → Jaipur (280 km)',
    sub: '₹340 EV charge vs ₹2,100 petrol bill',
    badge: 'Real Trip Benchmark',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    color: 'text-warning'
  },
  {
    val: '0 g/km',
    unit: '',
    label: 'Tailpipe CO₂ Exhaust',
    sub: 'Eliminates ~46 kg CO₂ per corridor drive',
    badge: 'Zero Emission',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    color: 'text-success'
  }
];
