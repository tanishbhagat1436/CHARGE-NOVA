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
  X,
  Home,
  ArrowUp
} from 'lucide-react';

export default function LandingPage({ onLaunchPlanner, onOpenAuthModal, user, onOpenDashboard, onClose }) {
  const [calcDistance, setCalcDistance] = useState(350);
  const [petrolPrice, setPetrolPrice] = useState(105);
  
  // Calculate EV vs Petrol savings
  const petrolCost = Math.round((calcDistance / 14) * petrolPrice); // ~14 km/L average mileage
  const evCost = Math.round((calcDistance / 437) * 40.5 * 10); // ~10 INR per kWh commercial charging rate
  const savings = Math.max(0, petrolCost - evCost);

  return (
    <div id="top" className="min-h-screen w-full bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-slate-950 animate-in fade-in duration-300">
      
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-[128px]"></div>
      </div>

      {/* NAVBAR */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="p-2.5 bg-emerald-500 text-slate-950 rounded-2xl shadow-lg shadow-emerald-500/20 font-black">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Charge Nova <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">PRO</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">EV Highway Trip Planner & Analytics</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-300">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-200"
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span>Home</span>
            </button>
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#savings" className="hover:text-emerald-400 transition-colors">Savings Calculator</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
          </nav>

          {/* User Auth & Action Buttons */}
          <div className="flex items-center space-x-3">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
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
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.name || 'Account'}</span>
                </button>
                
                <button
                  onClick={onLaunchPlanner}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 text-xs cursor-pointer"
                >
                  <span>Launch Planner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenAuthModal}
                  className="px-4 py-2.5 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>Sign In / Register</span>
                </button>

                <button
                  onClick={onLaunchPlanner}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 text-xs cursor-pointer"
                >
                  <span>Open Planner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-8 animate-in fade-in duration-500">
          <Sparkles className="w-4 h-4" />
          <span>Next-Generation EV Highway Routing & Charging Analytics</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Plan Long EV Trips with <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Zero Range Anxiety</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Intelligent highway route optimization, real-time charger availability, live TomTom traffic, weather range modeling, and personalized trip analytics stored safely in your account.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onLaunchPlanner}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Zap className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
            <span>Plan Live Highway Route</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {!user && (
            <button
              onClick={onOpenAuthModal}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-5 h-5 text-emerald-400" />
              <span>Create Free Account</span>
            </button>
          )}
        </div>

        {/* STATS BANNER */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-sm">
          <div className="p-4 border-r border-slate-800/80 last:border-0">
            <div className="text-3xl font-black text-emerald-400">10,000+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">EV Routes Calculated</div>
          </div>
          <div className="p-4 border-r border-slate-800/80 last:border-0">
            <div className="text-3xl font-black text-indigo-400">500+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">DC Fast Chargers Mapped</div>
          </div>
          <div className="p-4 border-r border-slate-800/80 last:border-0">
            <div className="text-3xl font-black text-teal-400">₹1.8 Cr+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Saved in Fuel Costs</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-black text-amber-400">99.8%</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Range Accuracy</div>
          </div>
        </div>

      </section>

      {/* FEATURES GRID */}
      <section id="features" className="relative z-10 py-20 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything You Need for Effortless EV Highways
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              Engineered specifically for Indian highways, EV battery physics, and real-time charging infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Smart Charging Stops Algorithm</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Calculates precise optimal charging locations based on your vehicle's SOH, minimum buffer SOC, plug type, and highway speeds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Live Traffic & Weather Modeling</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Real-time TomTom traffic congestion overlays and ambient climate (AC mode) range degradation factor modeling.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 hover:border-teal-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center border border-teal-500/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Trip Comparison & Analytics</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Save your trips to your personal MongoDB account. Compare past corridors side-by-side to track savings and energy consumption.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 hover:border-indigo-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Live Hardware GPS Guidance</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connects directly to your mobile or PC device GPS for turn-by-turn navigation guidance and speed camera voice alerts.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center border border-purple-500/20">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">PDF Itinerary & Mobile QR Pass</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Export complete trip itineraries as PDF documents or generate instant mobile QR passes for your passengers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 hover:border-rose-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center border border-rose-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">24x7 Highway Emergency SOS</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Instant access to 24x7 roadside EV assistance, mobile towing numbers, and emergency helpline contact details.
              </p>
            </div>

          </div>

          {/* Features Navigation Bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Back to Home Top</span>
            </button>

            <button
              onClick={onLaunchPlanner}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Map Planner</span>
            </button>
          </div>

        </div>
      </section>

      {/* INTERACTIVE SAVINGS CALCULATOR */}
      <section id="savings" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <TrendingDown className="w-4 h-4" />
                <span>Instant Financial Analysis</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white">
                How Much Money Will You Save Driving EV?
              </h2>

              <p className="text-slate-400 text-sm leading-relaxed">
                Adjust your trip distance to compare commercial EV charging costs against standard petrol fuel prices across Indian highways.
              </p>

              <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                
                {/* Distance Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Highway Trip Distance</span>
                    <span className="text-emerald-400 font-mono">{calcDistance} km</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1500"
                    step="25"
                    value={calcDistance}
                    onChange={(e) => setCalcDistance(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Petrol Price Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Petrol Price per Litre</span>
                    <span className="text-indigo-400 font-mono">₹{petrolPrice} / L</span>
                  </div>
                  <input
                    type="range"
                    min="90"
                    max="120"
                    value={petrolPrice}
                    onChange={(e) => setPetrolPrice(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

              </div>

            </div>

            {/* Savings Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Petrol Car Cost</div>
                <div className="text-3xl font-extrabold text-rose-400 font-mono">₹{petrolCost.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500">Based on ~14 km/L mileage</div>
              </div>

              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Charge Nova EV Cost</div>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">₹{evCost.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500">Based on commercial DC Fast charging</div>
              </div>

              <div className="sm:col-span-2 p-6 sm:p-8 bg-gradient-to-r from-emerald-950/60 via-emerald-900/40 to-teal-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-2">
                <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Total Net Money Saved This Trip
                </div>
                <div className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono">₹{savings.toLocaleString()}</div>
                <div className="text-xs text-emerald-300/80 font-medium">Save over {Math.round((savings / petrolCost) * 100)}% per highway corridor!</div>
              </div>

            </div>

          </div>

          {/* Savings Section Navigation Bar */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 border-t border-slate-800/80 pt-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowUp className="w-4 h-4 text-emerald-400" />
              <span>Back to Home Top</span>
            </button>

            <button
              onClick={onLaunchPlanner}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Open Map Planner</span>
            </button>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 py-20 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How Charge Nova Works
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              Plan your complete EV highway itinerary in 4 quick steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative">
              <div className="text-3xl font-black text-emerald-500 font-mono">01</div>
              <h4 className="text-lg font-bold text-white">Select Your EV</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Choose from Tata Nexon EV, MG ZS EV, Hyundai Ioniq 5, or enter your custom battery kWh specs.</p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative">
              <div className="text-3xl font-black text-indigo-500 font-mono">02</div>
              <h4 className="text-lg font-bold text-white">Set Highway Route</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Enter your starting point or use live GPS location and destination city anywhere across India.</p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative">
              <div className="text-3xl font-black text-teal-500 font-mono">03</div>
              <h4 className="text-lg font-bold text-white">Smart Optimization</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Our physics engine calculates recommended charging stations, charge times, and live traffic delay.</p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative">
              <div className="text-3xl font-black text-amber-500 font-mono">04</div>
              <h4 className="text-lg font-bold text-white">Navigate & Store</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Start live turn-by-turn guidance and save trips to your account to compare past analytics anytime.</p>
            </div>

          </div>

          {/* CTA Banner */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowUp className="w-5 h-5 text-emerald-400" />
              <span>Back to Home Top</span>
            </button>

            <button
              onClick={onLaunchPlanner}
              className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all inline-flex items-center gap-3 cursor-pointer"
            >
              <Zap className="w-6 h-6 fill-current" />
              <span>Launch EV Planner Now</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="font-bold text-slate-300">Charge Nova EV Highway Planner</span>
          </div>
          <div>&copy; {new Date().getFullYear()} Charge Nova. OpenChargeMap & OSRM Engine Integration.</div>
        </div>
      </footer>

      {/* STICKY FLOATING ACTION MENU */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-3 font-sans">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-md transition-all flex items-center gap-2 text-xs font-bold cursor-pointer hover:scale-105"
          title="Return to Home Top"
        >
          <ArrowUp className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </button>

        <button
          onClick={onLaunchPlanner}
          className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all flex items-center gap-2 text-xs cursor-pointer hover:scale-105"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Launch Map Planner</span>
        </button>
      </div>

    </div>
  );
}
