import React, { useState, useEffect, useRef } from 'react';
import {
  LandingHeader,
  LandingFlyoutModal,
  HeroSection,
  SavingsBanner,
  CorridorsSection,
  SavingsCalculatorSection,
  FeaturesSection,
  FleetExplorerSection,
  ChargingNetworksSection,
  HowItWorksSection,
  TestimonialsSection,
  FaqSection,
  LandingFooter,
  FloatingActions
} from './landing';

export default function LandingPage({
  onLaunchPlanner,
  onOpenAuthModal,
  user,
  onOpenDashboard,
  onClose,
  evPresets = []
}) {
  const [dist, setDist] = useState(350);
  const [petrol, setPetrol] = useState(105);
  const [fleetTab, setFleetTab] = useState(0);
  const [faqOpen, setFaqOpen] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFlyout, setActiveFlyout] = useState(null); // 'corridors' | 'features' | 'fleet' | 'savings' | 'networks' | 'faq' | null
  const flyoutRef = useRef(null);

  // Economic calculations
  const petrolCost = Math.round((dist / 14) * petrol);
  const evCost = Math.round((dist / 437) * 40.5 * 10);
  const savings = Math.max(0, petrolCost - evCost);
  const co2Kg = Math.round(dist * 0.165);
  const savePct = petrolCost > 0 ? Math.round((savings / petrolCost) * 100) : 0;

  // Close flyouts on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target)) {
        setActiveFlyout(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smooth scroll-reveal effect for Notion-style aesthetics
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-6');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    const elements = document.querySelectorAll('.notion-reveal');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    setActiveFlyout(null);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="top" className="w-full min-h-screen bg-[#fafaf9] text-ink selection:bg-primary/15 selection:text-primary font-sans">
      {/* Notion-Style Frosted Glass Header */}
      <LandingHeader
        user={user}
        onClose={onClose}
        onOpenDashboard={onOpenDashboard}
        onOpenAuthModal={onOpenAuthModal}
        onLaunchPlanner={onLaunchPlanner}
        activeFlyout={activeFlyout}
        setActiveFlyout={setActiveFlyout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToSection={scrollToSection}
      />

      {/* Notion-Style Interactive Header Flyout Window */}
      <LandingFlyoutModal
        activeFlyout={activeFlyout}
        setActiveFlyout={setActiveFlyout}
        flyoutRef={flyoutRef}
        scrollToSection={scrollToSection}
        onLaunchPlanner={onLaunchPlanner}
        setFleetTab={setFleetTab}
      />

      {/* Hero Section */}
      <HeroSection
        onLaunchPlanner={onLaunchPlanner}
        scrollToSection={scrollToSection}
      />

      {/* Real Savings Numbers Banner */}
      <SavingsBanner />

      {/* Pre-Optimized Highway Corridors */}
      <CorridorsSection
        onLaunchPlanner={onLaunchPlanner}
      />

      {/* Financial Savings Calculator */}
      <SavingsCalculatorSection
        dist={dist}
        setDist={setDist}
        petrol={petrol}
        setPetrol={setPetrol}
        petrolCost={petrolCost}
        evCost={evCost}
        savings={savings}
        co2Kg={co2Kg}
        savePct={savePct}
      />

      {/* Highway Features Grid */}
      <FeaturesSection />

      {/* Supported EV Fleet Explorer */}
      <FleetExplorerSection
        fleetTab={fleetTab}
        setFleetTab={setFleetTab}
        onLaunchPlanner={onLaunchPlanner}
      />

      {/* Integrated Fast Charging Networks */}
      <ChargingNetworksSection />

      {/* 4 Steps: How It Works */}
      <HowItWorksSection
        onLaunchPlanner={onLaunchPlanner}
      />

      {/* Real Driver Testimonials */}
      <TestimonialsSection />

      {/* Frequently Asked Questions */}
      <FaqSection
        faqOpen={faqOpen}
        setFaqOpen={setFaqOpen}
      />

      {/* Footer */}
      <LandingFooter
        onLaunchPlanner={onLaunchPlanner}
        scrollToSection={scrollToSection}
      />

      {/* Floating Action Controls */}
      <FloatingActions
        onLaunchPlanner={onLaunchPlanner}
      />
    </div>
  );
}
