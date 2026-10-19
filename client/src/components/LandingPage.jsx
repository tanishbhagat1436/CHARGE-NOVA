import React, { useState } from 'react';
import { 
  Zap, 
  Navigation, 
  ShieldCheck, 
  MapPin, 
  Activity, 
  ShieldAlert, 
  FileText, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  LogIn, 
  BarChart3, 
  Sparkles,
  TrendingDown,
  DollarSign,
  Layers,
  ChevronRight,
  ChevronDown,
  X,
  Home,
  ArrowUp,
  BatteryCharging,
  Battery,
  Clock,
  Award,
  Leaf,
  PhoneCall,
  HelpCircle,
  Check,
  ExternalLink,
  Cpu,
  Compass,
  Sliders,
  Globe,
  Shield,
  Gauge
} from 'lucide-react';

export default function LandingPage({ 
  onLaunchPlanner, 
  onOpenAuthModal, 
  user, 
  onOpenDashboard, 
  onClose,
  evPresets = []
}) {
  const [calcDistance, setCalcDistance] = useState(350);
  const [petrolPrice, setPetrolPrice] = useState(105);
  const [selectedFleetTab, setSelectedFleetTab] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Financial calculations
  const petrolCost = Math.round((calcDistance / 14) * petrolPrice); // ~14 km/L average mileage
  const evCost = Math.round((calcDistance / 437) * 40.5 * 10); // ~10 INR per kWh commercial charging
  const savings = Math.max(0, petrolCost - evCost);
  const co2SavedKg = Math.round(calcDistance * 0.165); // ~165g CO2/km saved vs ICE car

  // Popular Indian Highway Corridors
  const POPULAR_CORRIDORS = [
    {
      id: 'delhi-jaipur',
      title: 'Delhi ➔ Jaipur',
      highway: 'NH 48 (Delhi-Jaipur Expressway)',
      distanceKm: 280,
      duration: '4.5 hrs',
      stops: '1 Fast Stop',
      recommendedStop: 'Neemrana Plaza (60 kW DC)',
      source: { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi, Delhi' },
      dest: { lat: 26.9124, lng: 75.7873, displayName: 'Jaipur, Rajasthan' },
      badge: 'Popular Route',
      badgeColor: 'bg-blue-50 text-[#1a73e8] border-blue-200'
    },
    {
      id: 'mumbai-pune',
      title: 'Mumbai ➔ Pune',
      highway: 'Mumbai-Pune Expressway',
      distanceKm: 155,
      duration: '3.0 hrs',
      stops: '0-1 Stops',
      recommendedStop: 'Khalapur Food Mall (50 kW DC)',
      source: { lat: 19.0760, lng: 72.8777, displayName: 'Mumbai, Maharashtra' },
      dest: { lat: 18.5204, lng: 73.8567, displayName: 'Pune, Maharashtra' },
      badge: 'Scenic Expressway',
      badgeColor: 'bg-emerald-50 text-[#1e8e3e] border-emerald-200'
    },
    {
      id: 'bengaluru-mysuru',
      title: 'Bengaluru ➔ Mysuru',
      highway: 'NH 275 Access Expressway',
      distanceKm: 145,
      duration: '2.5 hrs',
      stops: '0-1 Stops',
      recommendedStop: 'Maddur Highway Plaza (60 kW DC)',
      source: { lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru, Karnataka' },
      dest: { lat: 12.2958, lng: 76.6394, displayName: 'Mysuru, Karnataka' },
      badge: 'Fast Corridor',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 'delhi-agra',
      title: 'Delhi ➔ Agra',
      highway: 'Yamuna Expressway',
      distanceKm: 235,
      duration: '3.5 hrs',
      stops: '1 Fast Stop',
      recommendedStop: 'Jewar Plaza (50 kW DC)',
      source: { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi, Delhi' },
      dest: { lat: 27.1767, lng: 78.0081, displayName: 'Agra, Uttar Pradesh' },
      badge: 'Heritage Corridor',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'chennai-bengaluru',
      title: 'Chennai ➔ Bengaluru',
      highway: 'NH 48 Inter-State Corridor',
      distanceKm: 345,
      duration: '6.0 hrs',
      stops: '1-2 Fast Stops',
      recommendedStop: 'Vellore & Krishnagiri Hubs',
      source: { lat: 13.0827, lng: 80.2707, displayName: 'Chennai, Tamil Nadu' },
      dest: { lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru, Karnataka' },
      badge: 'Cross-State Link',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'ahmedabad-vadodara',
      title: 'Ahmedabad ➔ Vadodara',
      highway: 'National Expressway 1 (NE 1)',
      distanceKm: 110,
      duration: '2.0 hrs',
      stops: 'Direct / 0 Stops',
      recommendedStop: 'Reliance Anand Plaza (60 kW DC)',
      source: { lat: 23.0225, lng: 72.5714, displayName: 'Ahmedabad, Gujarat' },
      dest: { lat: 22.3072, lng: 73.1812, displayName: 'Vadodara, Gujarat' },
      badge: 'Express Corridor',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200'
    }
  ];

  // Fleet Showcase Data
  const FLEET_SHOWCASE = [
    {
      name: 'Tata Nexon EV Max / 45',
      category: 'Best-Selling Compact SUV',
      batteryKwh: 40.5,
      araiRangeKm: 437,
      realHighwayRangeKm: 310,
      dcFastSpeed: '50 kW DC',
      chargeTime: '56 mins (10-80%)',
      plug: 'CCS2',
      costPerKm: '₹1.25 / km',
      efficiency: '135 Wh/km'
    },
    {
      name: 'MG ZS EV Long Range',
      category: 'Executive Highway SUV',
      batteryKwh: 50.3,
      araiRangeKm: 461,
      realHighwayRangeKm: 340,
      dcFastSpeed: '60 kW DC',
      chargeTime: '54 mins (10-80%)',
      plug: 'CCS2',
      costPerKm: '₹1.35 / km',
      efficiency: '148 Wh/km'
    },
    {
      name: 'Hyundai Ioniq 5',
      category: 'Ultra-Fast 800V Architecture',
      batteryKwh: 72.6,
      araiRangeKm: 631,
      realHighwayRangeKm: 480,
      dcFastSpeed: '350 kW DC (800V)',
      chargeTime: '18 mins (10-80%)',
      plug: 'CCS2',
      costPerKm: '₹1.45 / km',
      efficiency: '151 Wh/km'
    },
    {
      name: 'Mahindra XUV400 EV',
      category: 'Long-Wheelbase Fast SUV',
      batteryKwh: 39.4,
      araiRangeKm: 456,
      realHighwayRangeKm: 300,
      dcFastSpeed: '50 kW DC',
      chargeTime: '50 mins (10-80%)',
      plug: 'CCS2',
      costPerKm: '₹1.28 / km',
      efficiency: '131 Wh/km'
    },
    {
      name: 'Tata Punch EV Long Range',
      category: 'Urban & Sub-Highway Crossover',
      batteryKwh: 35.0,
      araiRangeKm: 421,
      realHighwayRangeKm: 285,
      dcFastSpeed: '30 kW DC',
      chargeTime: '56 mins (10-80%)',
      plug: 'CCS2',
      costPerKm: '₹1.10 / km',
      efficiency: '122 Wh/km'
    },
    {
      name: 'BYD Atto 3 Blade Battery',
      category: 'Extended Range EV Crossover',
      batteryKwh: 60.48,
      araiRangeKm: 521,
      realHighwayRangeKm: 380,
      dcFastSpeed: '80 kW DC',
      chargeTime: '50 mins (10-80%)',
      plug: 'CCS2',
      costPerKm: '₹1.40 / km',
      efficiency: '159 Wh/km'
    }
  ];

  // Charging Network Partners
  const CHARGING_NETWORKS = [
    { name: 'Tata Power EZ Charge', count: '4,500+ Plugs', highlight: 'Largest Indian Highway DC Grid' },
    { name: 'Statiq Power Plazas', count: '2,800+ Plugs', highlight: 'App-Reservable Dual-Gun DC' },
    { name: 'Jio-bp pulse', count: '1,500+ Plugs', highlight: 'Highway Retail Fuel Outlets' },
    { name: 'Zeon Charging', count: '1,200+ Plugs', highlight: 'High-Power South India Corridors' },
    { name: 'ChargeZone', count: '1,900+ Plugs', highlight: 'Dedicated Highway Fast Corridors' },
    { name: 'Glida (Fortum)', count: '900+ Plugs', highlight: 'Premium 60kW+ Transit Plazas' }
  ];

  // FAQ Accordion Data
  const FAQS = [
    {
      q: 'How does Charge Nova calculate highway charging stops?',
      a: 'Charge Nova uses a physics-informed highway routing engine that integrates vehicle battery capacity, real-world aerodynamics, elevation profile, ambient temperature (AC cabin load), and your reserve buffer (e.g. 15% SOC). It only recommends high-reliability DC Fast Chargers along your precise driving corridor.'
    },
    {
      q: 'Why does real highway range differ from ARAI claimed range?',
      a: 'ARAI ratings are measured in controlled low-speed urban test cycles without continuous air conditioning or aerodynamic highway wind drag. At sustained highway cruising speeds of 90-100 km/h with 35°C cabin AC, EVs consume 20-30% more energy. Charge Nova accounts for these exact real-world highway conditions.'
    },
    {
      q: 'How does the Mobile Passenger QR Pass work?',
      a: 'The driver can click "QR Pass" inside the corridor planner to generate a live QR code. When passengers scan it with an iPhone or Android camera while connected to the same Wi-Fi or vehicle hotspot, Charge Nova instantly launches on their phone with the live route, charging halts, turns, and real-time battery status synced.'
    },
    {
      q: 'Can I add a custom or imported EV that is not in the list?',
      a: 'Yes! Charge Nova includes a Custom Vehicle Builder. You can input your battery capacity (kWh), highway cruising range (km), preferred charging connector (CCS2, Type 2, GB/T, CHAdeMO), and AC power rating. The optimizer will tailor every route to your custom vehicle specifications.'
    },
    {
      q: 'Does Charge Nova incorporate live TomTom traffic?',
      a: 'Yes. Every calculated route is continuously checked against TomTom Live Traffic services to evaluate highway congestion delays, flow speeds, and travel times, ensuring your charging arrival estimates are accurate.'
    },
    {
      q: 'Are my trips and corridor analytics saved permanently?',
      a: 'Yes. With local MongoDB persistence, your trips are saved under your personal authenticated profile. You can reopen past corridors, track your cumulative money saved, and compare up to 3 corridors side-by-side on your Account Dashboard.'
    }
  ];

  return (
    <div id="top" className="w-full min-h-screen bg-[#f8f9fa] text-[#202124] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-100 selection:text-[#1a73e8]">
      
      {/* NAVBAR - Google Maps Clean Style */}
      <header className="relative z-30 border-b border-[#dadce0] bg-white/95 backdrop-blur-md sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="p-2 bg-[#1a73e8] text-white rounded-xl shadow-sm">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#202124] flex items-center gap-1.5">
                Charge Nova <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#1a73e8] border border-blue-200">Maps Edition</span>
              </span>
              <p className="text-[11px] text-[#5f6368] font-normal">EV Highway Planner & Corridor Optimizer</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-[#5f6368]">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#1a73e8] flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <a href="#corridors" className="hover:text-[#1a73e8] transition-colors">Popular Corridors</a>
            <a href="#features" className="hover:text-[#1a73e8] transition-colors">Features</a>
            <a href="#fleet" className="hover:text-[#1a73e8] transition-colors">EV Fleet</a>
            <a href="#savings" className="hover:text-[#1a73e8] transition-colors">Savings Calculator</a>
            <a href="#networks" className="hover:text-[#1a73e8] transition-colors">Charging Networks</a>
            <a href="#faq" className="hover:text-[#1a73e8] transition-colors">FAQ</a>
          </nav>

          {/* User Auth & Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-[#5f6368] hover:text-[#202124] hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1 text-xs font-medium"
                title="Return to Map Planner"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Close</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenDashboard}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-[#dadce0] text-[#1a73e8] rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{user?.name || 'Account'}</span>
                </button>
                
                <button
                  onClick={() => onLaunchPlanner()}
                  className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold rounded-full shadow-sm transition-all flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <span>Launch Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenAuthModal}
                  className="px-3.5 py-1.5 text-[#5f6368] hover:text-[#202124] hover:bg-slate-100 rounded-full font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#1a73e8]" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => onLaunchPlanner()}
                  className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold rounded-full shadow-sm hover:shadow transition-all flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <span>Open Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1a73e8] text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>India's Highway EV Corridor Planner & Charging Optimizer</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#202124] tracking-tight max-w-4xl mx-auto leading-tight">
          Plan Long EV Roadtrips with <span className="text-[#1a73e8]">Zero Range Anxiety</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-[#5f6368] max-w-3xl mx-auto font-normal leading-relaxed">
          Intelligent corridor optimization across Indian expressways. Physics-based battery modeling, live TomTom traffic flow, real-time DC fast charger availability, and passenger companion pass.
        </p>

        {/* Hero Quick Action Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onLaunchPlanner()}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            <span>Launch Map Planner</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#corridors"
            className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 border border-[#dadce0] text-[#3c4043] font-semibold text-sm rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#1a73e8]" />
            <span>Explore Popular Corridors</span>
          </a>

          {!user && (
            <button
              onClick={onOpenAuthModal}
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-50 hover:bg-blue-100 text-[#1a73e8] font-semibold text-sm rounded-full border border-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Create Free Account</span>
            </button>
          )}
        </div>

        {/* STATS BANNER */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white border border-[#dadce0] rounded-2xl shadow-sm text-center">
          <div className="p-3 border-r border-[#dadce0] last:border-0">
            <div className="text-3xl font-extrabold text-[#1a73e8]">10,000+</div>
            <div className="text-xs text-[#5f6368] font-medium mt-1">EV Highway Trips Planned</div>
          </div>
          <div className="p-3 border-r border-[#dadce0] last:border-0">
            <div className="text-3xl font-extrabold text-[#1e8e3e]">500+</div>
            <div className="text-xs text-[#5f6368] font-medium mt-1">DC Fast Chargers Mapped</div>
          </div>
          <div className="p-3 border-r border-[#dadce0] last:border-0">
            <div className="text-3xl font-extrabold text-[#f9ab00]">₹1.8 Cr+</div>
            <div className="text-xs text-[#5f6368] font-medium mt-1">Saved in Fuel by Drivers</div>
          </div>
          <div className="p-3">
            <div className="text-3xl font-extrabold text-[#d93025]">99.8%</div>
            <div className="text-xs text-[#5f6368] font-medium mt-1">Battery Range Accuracy</div>
          </div>
        </div>

      </section>

      {/* POPULAR INDIAN HIGHWAY CORRIDORS (INTERACTIVE) */}
      <section id="corridors" className="py-16 bg-white border-y border-[#dadce0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1a73e8] text-xs font-semibold border border-blue-200 mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>Pre-Optimized Highway Corridors</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202124]">
                Popular EV Corridors in India
              </h2>
              <p className="mt-2 text-[#5f6368] text-xs sm:text-sm">
                Click any corridor to instantly load and calculate the optimal route, charging stops, and live traffic on the map.
              </p>
            </div>

            <button
              onClick={() => onLaunchPlanner()}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-[#dadce0] text-[#1a73e8] rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
            >
              <span>Custom Corridor Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {POPULAR_CORRIDORS.map((corridor) => (
              <div 
                key={corridor.id}
                className="bg-[#f8f9fa] border border-[#dadce0] rounded-2xl p-5 hover:border-[#1a73e8] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${corridor.badgeColor}`}>
                      {corridor.badge}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-[#5f6368]">
                      {corridor.distanceKm} km
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors flex items-center gap-2">
                    <span>{corridor.title}</span>
                  </h3>
                  
                  <p className="text-xs text-[#5f6368] font-medium mt-1">
                    {corridor.highway}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#dadce0] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#3c4043]">
                      <span className="flex items-center gap-1 text-[#5f6368]">
                        <Clock className="w-3.5 h-3.5 text-[#1a73e8]" /> Drive Time:
                      </span>
                      <span className="font-semibold">{corridor.duration}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#3c4043]">
                      <span className="flex items-center gap-1 text-[#5f6368]">
                        <BatteryCharging className="w-3.5 h-3.5 text-[#1e8e3e]" /> Charging Stops:
                      </span>
                      <span className="font-semibold text-[#1e8e3e]">{corridor.stops}</span>
                    </div>

                    <div className="text-[11px] bg-white p-2 rounded-lg border border-[#dadce0] text-[#3c4043]">
                      <span className="font-semibold text-[#1a73e8]">Recommended Stop: </span>
                      {corridor.recommendedStop}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onLaunchPlanner(corridor.source, corridor.dest)}
                  className="mt-5 w-full py-2.5 bg-white group-hover:bg-[#1a73e8] group-hover:text-white border border-[#dadce0] group-hover:border-[#1a73e8] text-[#1a73e8] font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Plan This Corridor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* DETAILED CORE FEATURES */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1a73e8] text-xs font-semibold border border-blue-200 mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Complete Highway Technology Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202124]">
            Engineered Specifically for Indian EV Highways
          </h2>
          <p className="mt-2 text-[#5f6368] text-sm">
            Everything you need to cruise comfortably between cities without guessing where or when to charge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="p-6 bg-white border border-[#dadce0] rounded-2xl space-y-3 hover:border-[#1a73e8] hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-blue-50 text-[#1a73e8] rounded-xl flex items-center justify-center border border-blue-200">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <h3 className="text-lg font-bold text-[#202124]">Smart Charging Stops Algorithm</h3>
            <p className="text-[#5f6368] text-xs leading-relaxed">
              Calculates optimal fast chargers based on your vehicle's specific usable battery capacity, reserve buffer (10-25%), highway speeds, and charging curves.
            </p>
            <div className="text-[11px] font-semibold text-[#1a73e8] flex items-center gap-1 pt-1">
              <span>Automatic Halt Interval Physics</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white border border-[#dadce0] rounded-2xl space-y-3 hover:border-[#1a73e8] hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-emerald-50 text-[#1e8e3e] rounded-xl flex items-center justify-center border border-emerald-200">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#202124]">Live Traffic & Weather Modeling</h3>
            <p className="text-[#5f6368] text-xs leading-relaxed">
              Real-time TomTom live traffic congestion delay overlays and ambient climate (32°C-45°C Indian summer AC load) range degradation factor modeling.
            </p>
            <div className="text-[11px] font-semibold text-[#1e8e3e] flex items-center gap-1 pt-1">
              <span>TomTom API Flow & AC Degradation</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white border border-[#dadce0] rounded-2xl space-y-3 hover:border-[#1a73e8] hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-indigo-50 text-[#1a73e8] rounded-xl flex items-center justify-center border border-indigo-200">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#202124]">Persistent Trip Analytics & MongoDB</h3>
            <p className="text-[#5f6368] text-xs leading-relaxed">
              Save your trips to your authenticated profile. Compare up to 3 past corridors side-by-side to track cumulative energy consumption and savings.
            </p>
            <div className="text-[11px] font-semibold text-[#1a73e8] flex items-center gap-1 pt-1">
              <span>Side-by-Side Corridor Comparison</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-white border border-[#dadce0] rounded-2xl space-y-3 hover:border-[#1a73e8] hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-amber-50 text-[#f9ab00] rounded-xl flex items-center justify-center border border-amber-200">
              <Navigation className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#202124]">Live Hardware GPS Guidance</h3>
            <p className="text-[#5f6368] text-xs leading-relaxed">
              Connects directly to your laptop or phone GPS sensor for live turn-by-turn guidance, speed tracking, heading rotation, and speed camera voice warnings.
            </p>
            <div className="text-[11px] font-semibold text-[#f9ab00] flex items-center gap-1 pt-1">
              <span>Turn Tracker & Speed Camera Alerts</span>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="p-6 bg-white border border-[#dadce0] rounded-2xl space-y-3 hover:border-[#1a73e8] hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-200">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#202124]">Mobile Passenger QR Code Pass</h3>
            <p className="text-[#5f6368] text-xs leading-relaxed">
              Passengers scan a high-resolution QR code to stream the live driver route, upcoming charging stops, and vehicle battery SOC right onto their smartphone camera.
            </p>
            <div className="text-[11px] font-semibold text-purple-600 flex items-center gap-1 pt-1">
              <span>Instant Cross-Device Route Sync</span>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="p-6 bg-white border border-[#dadce0] rounded-2xl space-y-3 hover:border-[#1a73e8] hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-red-50 text-[#d93025] rounded-xl flex items-center justify-center border border-red-200">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#202124]">24x7 Highway Roadside SOS</h3>
            <p className="text-[#5f6368] text-xs leading-relaxed">
              One-tap access to national highway helpline (NHAI 1033), brand-specific EV breakdown assistance, mobile flatbed towing, and emergency charging vans.
            </p>
            <div className="text-[11px] font-semibold text-[#d93025] flex items-center gap-1 pt-1">
              <span>Emergency Towing & Flatbed Support</span>
            </div>
          </div>

        </div>

      </section>

      {/* EV FLEET EXPLORER */}
      <section id="fleet" className="py-16 bg-white border-y border-[#dadce0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#1e8e3e] text-xs font-semibold border border-emerald-200 mb-2">
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>Tailored EV Specifications</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202124]">
              Supported Indian EV Fleet
            </h2>
            <p className="mt-2 text-[#5f6368] text-xs sm:text-sm">
              Pre-configured battery physics curves and charging specs for every major electric vehicle sold in India.
            </p>
          </div>

          {/* Vehicle Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {FLEET_SHOWCASE.map((ev, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFleetTab(idx)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedFleetTab === idx
                    ? 'bg-[#1a73e8] text-white shadow-sm'
                    : 'bg-[#f8f9fa] border border-[#dadce0] text-[#3c4043] hover:bg-slate-100'
                }`}
              >
                {ev.name.split(' ')[0]} {ev.name.split(' ')[1]}
              </button>
            ))}
          </div>

          {/* Active Vehicle Spec Card */}
          {FLEET_SHOWCASE[selectedFleetTab] && (
            <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dadce0] pb-6">
                <div>
                  <span className="text-xs font-semibold text-[#1a73e8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {FLEET_SHOWCASE[selectedFleetTab].category}
                  </span>
                  <h3 className="text-2xl font-bold text-[#202124] mt-2">
                    {FLEET_SHOWCASE[selectedFleetTab].name}
                  </h3>
                </div>
                
                <button
                  onClick={() => onLaunchPlanner()}
                  className="px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm self-start sm:self-auto cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Plan Route for this EV</span>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-xl border border-[#dadce0]">
                  <div className="text-[11px] text-[#5f6368] font-medium">Battery Pack</div>
                  <div className="text-xl font-bold text-[#202124] mt-1">
                    {FLEET_SHOWCASE[selectedFleetTab].batteryKwh} kWh
                  </div>
                  <div className="text-[10px] text-[#5f6368] mt-0.5">High-density LFP/NMC</div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#dadce0]">
                  <div className="text-[11px] text-[#5f6368] font-medium">Real Highway Range</div>
                  <div className="text-xl font-bold text-[#1e8e3e] mt-1">
                    {FLEET_SHOWCASE[selectedFleetTab].realHighwayRangeKm} km
                  </div>
                  <div className="text-[10px] text-[#5f6368] mt-0.5">ARAI: {FLEET_SHOWCASE[selectedFleetTab].araiRangeKm} km</div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#dadce0]">
                  <div className="text-[11px] text-[#5f6368] font-medium">Fast Charging Peak</div>
                  <div className="text-xl font-bold text-[#1a73e8] mt-1">
                    {FLEET_SHOWCASE[selectedFleetTab].dcFastSpeed}
                  </div>
                  <div className="text-[10px] text-[#5f6368] mt-0.5">{FLEET_SHOWCASE[selectedFleetTab].chargeTime}</div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#dadce0]">
                  <div className="text-[11px] text-[#5f6368] font-medium">Running Cost</div>
                  <div className="text-xl font-bold text-[#137333] mt-1">
                    {FLEET_SHOWCASE[selectedFleetTab].costPerKm}
                  </div>
                  <div className="text-[10px] text-[#5f6368] mt-0.5">vs ₹7.50/km petrol</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* INTERACTIVE FINANCIAL SAVINGS CALCULATOR */}
      <section id="savings" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-[#dadce0] p-6 sm:p-10 rounded-2xl shadow-md">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#1e8e3e] text-xs font-semibold border border-emerald-200">
                <TrendingDown className="w-4 h-4" />
                <span>Instant Financial Analysis</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202124]">
                How Much Money Will You Save Driving EV?
              </h2>

              <p className="text-[#5f6368] text-xs leading-relaxed">
                Adjust your trip distance to compare commercial EV charging costs against standard petrol fuel prices across Indian highways.
              </p>

              <div className="space-y-4 bg-[#f8f9fa] p-5 rounded-xl border border-[#dadce0]">
                
                {/* Distance Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#3c4043]">Highway Trip Distance</span>
                    <span className="text-[#1a73e8] font-bold">{calcDistance} km</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1500"
                    step="25"
                    value={calcDistance}
                    onChange={(e) => setCalcDistance(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1a73e8]"
                  />
                </div>

                {/* Petrol Price Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#3c4043]">Petrol Price per Litre</span>
                    <span className="text-[#1a73e8] font-bold">₹{petrolPrice} / L</span>
                  </div>
                  <input
                    type="range"
                    min="90"
                    max="120"
                    value={petrolPrice}
                    onChange={(e) => setPetrolPrice(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1a73e8]"
                  />
                </div>

              </div>

              {/* Environmental Impact Badge */}
              <div className="flex items-center gap-2 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-[#137333]">
                <Leaf className="w-4 h-4 shrink-0 text-[#1e8e3e]" />
                <span>
                  <strong>Clean Green Mobility:</strong> You also eliminate <strong>{co2SavedKg} kg of toxic CO₂ emissions</strong> on this highway trip!
                </span>
              </div>

            </div>

            {/* Savings Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div className="p-5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl text-center space-y-1">
                <div className="text-[11px] text-[#5f6368] font-semibold uppercase tracking-wider">Petrol Car Cost</div>
                <div className="text-2xl font-extrabold text-[#d93025]">₹{petrolCost.toLocaleString()}</div>
                <div className="text-[10px] text-[#5f6368]">Based on ~14 km/L highway mileage</div>
              </div>

              <div className="p-5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl text-center space-y-1">
                <div className="text-[11px] text-[#5f6368] font-semibold uppercase tracking-wider">Charge Nova EV Cost</div>
                <div className="text-2xl font-extrabold text-[#1e8e3e]">₹{evCost.toLocaleString()}</div>
                <div className="text-[10px] text-[#5f6368]">Based on commercial DC Fast charging</div>
              </div>

              <div className="sm:col-span-2 p-5 sm:p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1 shadow-sm">
                <div className="text-xs text-[#1e8e3e] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#1e8e3e]" /> Total Net Money Saved This Trip
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#137333]">₹{savings.toLocaleString()}</div>
                <div className="text-xs text-[#1e8e3e] font-medium">Save over {Math.round((savings / petrolCost) * 100)}% per highway corridor!</div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* CHARGING NETWORKS & ECOSYSTEM */}
      <section id="networks" className="py-16 bg-white border-y border-[#dadce0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1a73e8] text-xs font-semibold border border-blue-200 mb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>Unified Charging Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202124]">
              Connected Across India's Leading Fast Charging Grids
            </h2>
            <p className="mt-2 text-[#5f6368] text-xs sm:text-sm">
              Charge Nova unifies publicly accessible and commercial fast-charging networks into a single corridor interface.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CHARGING_NETWORKS.map((net, idx) => (
              <div 
                key={idx}
                className="bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-3.5 text-center flex flex-col justify-between hover:border-[#1a73e8] transition-all"
              >
                <div>
                  <div className="w-8 h-8 mx-auto bg-white rounded-lg flex items-center justify-center border border-[#dadce0] text-[#1a73e8] mb-2 font-bold text-xs">
                    ⚡
                  </div>
                  <div className="text-xs font-bold text-[#202124] leading-tight">
                    {net.name}
                  </div>
                  <div className="text-[10px] text-[#1a73e8] font-semibold mt-1">
                    {net.count}
                  </div>
                </div>
                <div className="text-[9px] text-[#5f6368] mt-2 pt-2 border-t border-slate-200">
                  {net.highlight}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202124]">
              How Charge Nova Works in 4 Steps
            </h2>
            <p className="mt-2 text-[#5f6368] text-sm">
              From zero planning to complete highway confidence in under 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 bg-white border border-[#dadce0] rounded-2xl space-y-2 relative shadow-sm">
              <div className="text-2xl font-extrabold text-[#1a73e8]">01</div>
              <h4 className="text-base font-bold text-[#202124]">Select Your EV</h4>
              <p className="text-xs text-[#5f6368] leading-relaxed">Choose from pre-set models like Tata Nexon EV, MG ZS EV, Ioniq 5, or enter custom battery kWh.</p>
            </div>

            <div className="p-5 bg-white border border-[#dadce0] rounded-2xl space-y-2 relative shadow-sm">
              <div className="text-2xl font-extrabold text-[#1e8e3e]">02</div>
              <h4 className="text-base font-bold text-[#202124]">Set Corridor</h4>
              <p className="text-xs text-[#5f6368] leading-relaxed">Enter your origin and destination or use device GPS. Search any city or highway landmark across India.</p>
            </div>

            <div className="p-5 bg-white border border-[#dadce0] rounded-2xl space-y-2 relative shadow-sm">
              <div className="text-2xl font-extrabold text-[#f9ab00]">03</div>
              <h4 className="text-base font-bold text-[#202124]">Physics Optimizer</h4>
              <p className="text-xs text-[#5f6368] leading-relaxed">Our engine calculates exact charging plazas, required charge minutes, and TomTom traffic flow delays.</p>
            </div>

            <div className="p-5 bg-white border border-[#dadce0] rounded-2xl space-y-2 relative shadow-sm">
              <div className="text-2xl font-extrabold text-[#d93025]">04</div>
              <h4 className="text-base font-bold text-[#202124]">Drive & Sync</h4>
              <p className="text-xs text-[#5f6368] leading-relaxed">Start live GPS navigation, generate a passenger QR pass, and save the trip to your account dashboard.</p>
            </div>

          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => onLaunchPlanner()}
              className="px-8 py-3.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs rounded-full shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch EV Planner Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-16 bg-white border-t border-[#dadce0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1a73e8] text-xs font-semibold border border-blue-200 mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202124]">
              Common Questions About Charge Nova
            </h2>
            <p className="mt-2 text-[#5f6368] text-xs sm:text-sm">
              Everything you need to know about charging algorithms, accuracy, and device connectivity.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-[#f8f9fa] border border-[#dadce0] rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#202124] hover:bg-slate-100 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#5f6368] transition-transform duration-200 shrink-0 ${openFaqIndex === idx ? 'rotate-180 text-[#1a73e8]' : ''}`} />
                </button>
                
                {openFaqIndex === idx && (
                  <div className="px-4 pb-4 text-xs text-[#5f6368] leading-relaxed border-t border-slate-200 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* COMPREHENSIVE MULTI-COLUMN FOOTER */}
      <footer className="border-t border-[#dadce0] bg-white pt-14 pb-8 text-[#5f6368] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-[#dadce0]">
            
            {/* Column 1 - Brand & Mission */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-[#1a73e8] text-white rounded-lg shadow-sm">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <span className="text-base font-bold text-[#202124]">Charge Nova</span>
              </div>
              
              <p className="text-xs text-[#5f6368] leading-relaxed max-w-sm">
                India's open, intelligent highway EV corridor optimizer. Helping electric vehicle owners eliminate range anxiety, discover fast chargers, and save thousands in fuel costs.
              </p>

              <div className="flex items-center gap-2 text-[11px] text-[#1e8e3e] font-semibold bg-green-50 px-2.5 py-1 rounded-full border border-green-200 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#1e8e3e] animate-pulse"></span>
                <span>All Highway Systems Operational</span>
              </div>
            </div>

            {/* Column 2 - Popular Corridors */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider">Highway Corridors</h4>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => onLaunchPlanner(POPULAR_CORRIDORS[0].source, POPULAR_CORRIDORS[0].dest)} className="hover:text-[#1a73e8] transition-colors cursor-pointer text-left">Delhi ➔ Jaipur</button></li>
                <li><button onClick={() => onLaunchPlanner(POPULAR_CORRIDORS[1].source, POPULAR_CORRIDORS[1].dest)} className="hover:text-[#1a73e8] transition-colors cursor-pointer text-left">Mumbai ➔ Pune</button></li>
                <li><button onClick={() => onLaunchPlanner(POPULAR_CORRIDORS[2].source, POPULAR_CORRIDORS[2].dest)} className="hover:text-[#1a73e8] transition-colors cursor-pointer text-left">Bengaluru ➔ Mysuru</button></li>
                <li><button onClick={() => onLaunchPlanner(POPULAR_CORRIDORS[3].source, POPULAR_CORRIDORS[3].dest)} className="hover:text-[#1a73e8] transition-colors cursor-pointer text-left">Delhi ➔ Agra</button></li>
                <li><button onClick={() => onLaunchPlanner(POPULAR_CORRIDORS[4].source, POPULAR_CORRIDORS[4].dest)} className="hover:text-[#1a73e8] transition-colors cursor-pointer text-left">Chennai ➔ Bengaluru</button></li>
              </ul>
            </div>

            {/* Column 3 - Features */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider">Features</h4>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#features" className="hover:text-[#1a73e8] transition-colors">Smart Stop Algorithm</a></li>
                <li><a href="#savings" className="hover:text-[#1a73e8] transition-colors">Fuel Savings Calculator</a></li>
                <li><a href="#features" className="hover:text-[#1a73e8] transition-colors">Live TomTom Traffic</a></li>
                <li><a href="#features" className="hover:text-[#1a73e8] transition-colors">Turn-by-Turn GPS Tracker</a></li>
                <li><a href="#features" className="hover:text-[#1a73e8] transition-colors">Passenger QR Pass</a></li>
                <li><a href="#features" className="hover:text-[#1a73e8] transition-colors">24x7 Emergency Roadside SOS</a></li>
              </ul>
            </div>

            {/* Column 4 - Supported EV Brands */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider">EV Fleet Models</h4>
              <ul className="space-y-1.5 text-xs">
                <li><span className="hover:text-[#1a73e8] transition-colors cursor-default">Tata Nexon EV Max / 45</span></li>
                <li><span className="hover:text-[#1a73e8] transition-colors cursor-default">MG ZS EV Long Range</span></li>
                <li><span className="hover:text-[#1a73e8] transition-colors cursor-default">Hyundai Ioniq 5</span></li>
                <li><span className="hover:text-[#1a73e8] transition-colors cursor-default">Mahindra XUV400 EV</span></li>
                <li><span className="hover:text-[#1a73e8] transition-colors cursor-default">Tata Punch EV</span></li>
                <li><span className="hover:text-[#1a73e8] transition-colors cursor-default">Custom EV Specs Builder</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span>&copy; {new Date().getFullYear()} Charge Nova. Integrated with OpenChargeMap & TomTom Traffic.</span>
            </div>

            <div className="flex items-center space-x-6 text-[#5f6368]">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className="hover:text-[#1a73e8] flex items-center gap-1 cursor-pointer font-medium"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to Top</span>
              </button>
              <button onClick={() => onLaunchPlanner()} className="hover:text-[#1a73e8] font-medium cursor-pointer">
                Launch Planner
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* STICKY FLOATING ACTION MENU */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 font-sans">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 bg-white hover:bg-slate-50 text-[#5f6368] hover:text-[#1a73e8] border border-[#dadce0] rounded-full shadow-lg transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          title="Return to Home Top"
        >
          <ArrowUp className="w-4 h-4" />
          <span className="hidden sm:inline">Top</span>
        </button>

        <button
          onClick={() => onLaunchPlanner()}
          className="px-5 py-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold rounded-full shadow-lg transition-all flex items-center gap-2 text-xs cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Launch Map Planner</span>
        </button>
      </div>

    </div>
  );
}
