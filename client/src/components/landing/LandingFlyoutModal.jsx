import React from 'react';
import {
  Compass, Sliders, BatteryCharging, TrendingDown, Globe, HelpCircle,
  ChevronRight
} from 'lucide-react';
import {
  CORRIDORS, FEATURES, FLEET, REAL_SAVINGS_METRICS, NETWORKS, FAQS
} from './data/landingData';

export default function LandingFlyoutModal({
  activeFlyout,
  setActiveFlyout,
  flyoutRef,
  scrollToSection,
  onLaunchPlanner,
  setFleetTab
}) {
  if (!activeFlyout) return null;

  return (
    <div
      ref={flyoutRef}
      className="hidden md:block absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-surface-border shadow-card-lg animate-slide-down z-40 text-ink"
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-6">
        
        {/* Flyout 1: Corridors Detail Window */}
        {activeFlyout === 'corridors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Pre-Optimized Indian Highway Corridors</h4>
                  <p className="text-[11px] text-ink-secondary">Click any route to instantly calculate halts on the map canvas</p>
                </div>
              </div>
              <button
                onClick={() => scrollToSection('corridors')}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All 6 Corridors ↓</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {CORRIDORS.slice(0, 6).map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveFlyout(null);
                    onLaunchPlanner(c.source, c.dest);
                  }}
                  className="p-3 rounded-xl border border-surface-border bg-stone-50/60 hover:bg-white hover:border-primary/40 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className={`px-1.5 py-0.2 rounded font-semibold border ${c.badgeColor}`}>{c.badge}</span>
                    <span className="font-mono text-ink-secondary font-bold">{c.distanceKm} km</span>
                  </div>
                  <div className="text-xs font-bold group-hover:text-primary transition-colors">{c.title}</div>
                  <div className="text-[10px] text-ink-secondary truncate mt-0.5">{c.recommendedStop}</div>
                  <div className="text-[10px] font-semibold text-primary mt-2 flex items-center gap-0.5">
                    <span>Plan in Map</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flyout 2: Features Detail Window */}
        {activeFlyout === 'features' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Highway EV Navigation & Physics Suite</h4>
                  <p className="text-[11px] text-ink-secondary">Real-world physics modeling designed for Indian road conditions</p>
                </div>
              </div>
              <button
                onClick={() => scrollToSection('features')}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore Technical Details ↓</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="p-3 rounded-xl border border-surface-border bg-stone-50/60 hover:bg-white hover:shadow-xs transition-all">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`p-1.5 rounded-lg border ${f.color}`}>
                      <f.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs font-bold">{f.title}</div>
                  </div>
                  <p className="text-[11px] text-ink-secondary leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flyout 3: Fleet Detail Window */}
        {activeFlyout === 'fleet' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-success/10 text-success rounded-lg">
                  <BatteryCharging className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Supported Indian Highway EV Fleet</h4>
                  <p className="text-[11px] text-ink-secondary">Pre-configured battery capacities, charging curves, and highway consumption</p>
                </div>
              </div>
              <button
                onClick={() => scrollToSection('fleet')}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Compare All Fleet Specs ↓</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {FLEET.slice(0, 6).map((ev, i) => (
                <div
                  key={ev.name}
                  onClick={() => {
                    if (setFleetTab) setFleetTab(i);
                    scrollToSection('fleet');
                  }}
                  className="p-3 rounded-xl border border-surface-border bg-stone-50/60 hover:bg-white hover:border-primary/40 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="text-xs font-bold group-hover:text-primary transition-colors">{ev.name}</div>
                  <div className="text-[10px] text-ink-tertiary mb-2">{ev.category}</div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] pt-1.5 border-t border-surface-border/60">
                    <div>
                      <span className="text-ink-tertiary text-[9px] block">BATTERY</span>
                      <span className="font-mono font-bold">{ev.battery} kWh</span>
                    </div>
                    <div>
                      <span className="text-ink-tertiary text-[9px] block">REAL RANGE</span>
                      <span className="font-mono font-bold text-success">{ev.real} km</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flyout 4: Savings Detail Window */}
        {activeFlyout === 'savings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-warning/10 text-warning rounded-lg">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Highway EV Economics & Fuel Savings</h4>
                  <p className="text-[11px] text-ink-secondary">Actual numbers comparing commercial DC charging vs ₹105/L petrol</p>
                </div>
              </div>
              <button
                onClick={() => scrollToSection('savings')}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Interactive Calculator ↓</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {REAL_SAVINGS_METRICS.map((m) => (
                <div key={m.label} className="p-3.5 bg-stone-50/60 rounded-xl border border-surface-border">
                  <div className={`text-xl font-black font-mono ${m.color}`}>{m.val} {m.unit}</div>
                  <div className="text-xs font-bold text-ink mt-0.5">{m.label}</div>
                  <div className="text-[10px] text-ink-tertiary mt-1">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flyout 5: Networks Detail Window */}
        {activeFlyout === 'networks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Unified Indian Fast-Charging Grids</h4>
                  <p className="text-[11px] text-ink-secondary">Integrated corridor fast-chargers from India's premier CPOs</p>
                </div>
              </div>
              <button
                onClick={() => scrollToSection('networks')}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore Charging Network Partners ↓</span>
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2.5">
              {NETWORKS.map((n) => (
                <div key={n.name} className="p-3 bg-stone-50/60 rounded-xl border border-surface-border text-center flex flex-col justify-between">
                  <div className="w-7 h-7 mx-auto rounded-lg bg-white border border-surface-border flex items-center justify-center text-xs mb-1">⚡</div>
                  <div className="text-xs font-bold leading-tight truncate">{n.name}</div>
                  <div className="text-[10px] font-mono font-bold text-primary mt-1">{n.count}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flyout 6: FAQ Detail Window */}
        {activeFlyout === 'faq' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-50 text-purple-700 rounded-lg">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Frequently Asked Highway Questions</h4>
                  <p className="text-[11px] text-ink-secondary">Quick answers to common questions about long-distance EV driving</p>
                </div>
              </div>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All 6 FAQs ↓</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {FAQS.slice(0, 3).map((f) => (
                <div key={f.q} className="p-3 bg-stone-50/60 rounded-xl border border-surface-border text-xs space-y-1">
                  <div className="font-bold text-ink">{f.q}</div>
                  <p className="text-[11px] text-ink-secondary leading-relaxed line-clamp-3">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
