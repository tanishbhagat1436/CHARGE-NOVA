import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FAQS } from './data/landingData';

export default function FaqSection({
  faqOpen,
  setFaqOpen,
  faqs = FAQS
}) {
  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 notion-reveal">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/15 mb-2">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Common Questions About Charge Nova</h2>
          <p className="mt-2 text-ink-secondary text-xs sm:text-sm">Charging algorithms, range physics, and device connectivity explained.</p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-surface-border rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm hover:bg-surface-subtle transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-ink-secondary transition-transform duration-200 shrink-0 ${faqOpen === i ? 'rotate-180 text-primary' : ''}`} />
              </button>
              {faqOpen === i && (
                <div className="px-4 pb-4 text-xs text-ink-secondary leading-relaxed border-t border-surface-border pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
