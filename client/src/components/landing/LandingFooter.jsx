import React from 'react';
import { Zap, ArrowUp } from 'lucide-react';
import { CORRIDORS, FLEET } from './data/landingData';

export default function LandingFooter({
  onLaunchPlanner,
  scrollToSection,
  corridors = CORRIDORS,
  fleet = FLEET
}) {
  return (
    <footer className="border-t border-surface-border bg-white pt-14 pb-8 text-ink-secondary text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-surface-border">

          <div className="col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-xs">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="text-base font-bold text-ink">Charge Nova</span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              India's open, intelligent highway EV corridor optimizer. Helping electric vehicle owners eliminate range anxiety and save thousands in fuel costs.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-success font-semibold bg-success/8 px-2.5 py-1 rounded-full border border-success/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>All Highway Systems Operational</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Corridors</h4>
            <ul className="space-y-1.5">
              {corridors.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onLaunchPlanner(c.source, c.dest)}
                    className="hover:text-primary transition-colors text-left cursor-pointer"
                  >
                    {c.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Features</h4>
            <ul className="space-y-1.5">
              {[
                'Smart Stop Algorithm',
                'Fuel Savings Calculator',
                'Live TomTom Traffic',
                'Turn-by-Turn GPS',
                'Passenger QR Pass',
                '24x7 Roadside SOS'
              ].map((f) => (
                <li key={f}>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    {f}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Fleet Models</h4>
            <ul className="space-y-1.5">
              {fleet.map((f) => (
                <li key={f.name}>
                  <button
                    onClick={() => scrollToSection('fleet')}
                    className="hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    {f.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <span>© {new Date().getFullYear()} Charge Nova. Integrated with OpenChargeMap & TomTom Traffic.</span>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-primary flex items-center gap-1 font-medium cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" /> Top
            </button>
            <button
              onClick={() => onLaunchPlanner()}
              className="hover:text-primary font-medium cursor-pointer"
            >
              Launch Planner
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
