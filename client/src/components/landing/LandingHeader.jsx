import React from 'react';
import {
  Zap, User, LogIn, ChevronRight, ChevronDown, ChevronLeft, ArrowRight, Menu
} from 'lucide-react';

export default function LandingHeader({
  user,
  onClose,
  onOpenDashboard,
  onOpenAuthModal,
  onLaunchPlanner,
  activeFlyout,
  setActiveFlyout,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrollToSection
}) {
  const navItems = [
    ['corridors', 'Corridors'],
    ['features', 'Features'],
    ['fleet', 'Fleet'],
    ['savings', 'Savings'],
    ['networks', 'Networks'],
    ['faq', 'FAQ']
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-surface-border shadow-xs transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 h-16 sm:h-18 flex items-center justify-between gap-4">

        {/* Logo / Brand — Clean: "Charge Nova" & "EV Trip Planner" */}
        <button
          onClick={() => {
            setActiveFlyout(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center space-x-3 shrink-0 cursor-pointer text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-ink leading-tight">
              Charge Nova
            </div>
            <p className="text-[11px] text-ink-secondary font-medium">EV Trip Planner</p>
          </div>
        </button>

        {/* Notion-style Nav Links with Small Flyout Window for Every Button */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm font-medium text-ink-secondary relative">
          {navItems.map(([id, label]) => {
            const isOpen = activeFlyout === id;
            return (
              <button
                key={id}
                onClick={() => setActiveFlyout(isOpen ? null : id)}
                className={`px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-lg transition-all cursor-pointer font-medium flex items-center gap-1.5 text-xs lg:text-sm ${
                  isOpen
                    ? 'bg-stone-200/70 text-ink font-semibold'
                    : 'hover:text-ink hover:bg-stone-100/80'
                }`}
              >
                <span>{label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : 'text-ink-tertiary'}`} />
              </button>
            );
          })}
        </nav>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {user ? (
            <>
              {/* Back to Map button - ONLY shown if user is signed in and opened landing page */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-full border border-surface-border text-xs sm:text-sm font-semibold text-ink-secondary hover:text-ink hover:bg-surface-subtle transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Return to Map Planner"
                >
                  <ChevronLeft className="w-4 h-4 text-primary" />
                  <span>Back to Map</span>
                </button>
              )}

              {/* Account Dashboard Button */}
              <button
                onClick={onOpenDashboard}
                className="px-3.5 py-2 border border-surface-border text-primary rounded-full text-xs sm:text-sm font-semibold hover:bg-surface-subtle transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span className="max-w-[100px] truncate">{(user?.name || 'Account').split(' ')[0]}</span>
              </button>
            </>
          ) : (
            <>
              {/* When NOT signed in: Sign In + Launch Planner (NO Back to Map) */}
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-2 text-ink-secondary hover:text-ink hover:bg-stone-100/70 rounded-full font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-primary" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => onLaunchPlanner()}
                className="px-4.5 py-2 bg-primary hover:bg-primary-700 text-white font-semibold rounded-full shadow-xs transition-all flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer"
              >
                <span>Launch Planner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-ink-secondary hover:text-ink rounded-lg hover:bg-stone-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border bg-white px-4 py-3 space-y-1 shadow-card-md animate-slide-down">
          {navItems.map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="w-full text-left py-2 px-3 text-xs font-medium text-ink-secondary hover:text-ink hover:bg-surface-subtle rounded-lg cursor-pointer"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
