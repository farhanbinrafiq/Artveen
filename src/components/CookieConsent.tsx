/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Check, X, Settings2 } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    const storedConsent = localStorage.getItem('tanveen_cookie_consent');
    if (!storedConsent) {
      // Small delay to feel premium and organic
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(storedConsent);
        setPreferences(parsed);
      } catch (e) {
        // Fallback
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = { essential: true, analytics: true, marketing: true };
    setPreferences(allPreferences);
    localStorage.setItem('tanveen_cookie_consent', JSON.stringify(allPreferences));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const minPreferences = { essential: true, analytics: false, marketing: false };
    setPreferences(minPreferences);
    localStorage.setItem('tanveen_cookie_consent', JSON.stringify(minPreferences));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('tanveen_cookie_consent', JSON.stringify(preferences));
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed bottom-6 left-6 right-6 md:left-8 md:right-auto md:max-w-md z-50 font-sans text-left"
        id="cookie-consent-container"
        role="dialog"
        aria-describedby="cookie-consent-desc"
        aria-labelledby="cookie-consent-title"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="bg-pure-white border border-soft-border rounded-xs shadow-2xl p-6 md:p-8 paper-texture relative"
        >
          {/* Accent border line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-signature-carmine" />

          {!showSettings ? (
            <div className="space-y-5">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-signature-carmine/5 text-signature-carmine rounded-full flex items-center justify-center shrink-0">
                  <Shield className="w-4.5 h-4.5 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-base font-bold text-charcoal-ink" id="cookie-consent-title">
                  Collector Privacy Registry
                </h3>
              </div>

              <p className="text-xs text-[#3D3D3D] leading-relaxed font-light" id="cookie-consent-desc">
                We use cookies and telemetry metrics to curate an optimal exhibition journey, verify physical provenance, and measure digital interactions on Tanveen's Art Escape. Respecting your privacy is fundamental to our fine art ethos.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 py-3 bg-charcoal-ink text-canvas-white hover:bg-signature-carmine transition-colors duration-300 text-[10px] uppercase tracking-widest font-bold rounded-xs cursor-pointer focus:outline-none"
                  id="cookie-accept-all"
                >
                  Accept All
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="py-3 px-4 border border-soft-border hover:border-charcoal-ink text-[#444444] hover:text-charcoal-ink transition-colors duration-300 text-[10px] uppercase tracking-widest font-bold rounded-xs flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
                  id="cookie-configure"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>Configure</span>
                </button>
                <button
                  onClick={handleRejectAll}
                  className="py-3 px-3 text-slate-gray/70 hover:text-charcoal-ink transition-colors duration-300 text-[10px] uppercase tracking-widest font-bold cursor-pointer focus:outline-none"
                  id="cookie-reject-nonessential"
                >
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-charcoal-ink">
                  Privacy Settings
                </h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-slate-gray hover:text-charcoal-ink p-1 focus:outline-none"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Preference 1: Essential */}
                <div className="flex items-start justify-between gap-4 border-b border-soft-border/50 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-charcoal-ink block">Essential Cookies</span>
                    <p className="text-[10px] text-slate-gray font-light leading-relaxed">
                      Required to process secure secure fine art acquisitions, maintain persistent cart memory, and record authentic user authorization roles.
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-xs bg-[#FAF9F5] border border-soft-border flex items-center justify-center text-emerald-600 font-bold shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                </div>

                {/* Preference 2: Analytics */}
                <button
                  onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                  className="w-full flex items-start justify-between gap-4 border-b border-soft-border/50 pb-3 text-left focus:outline-none cursor-pointer group"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-charcoal-ink block group-hover:text-signature-carmine transition-colors">
                      Analytics & Telemetry
                    </span>
                    <p className="text-[10px] text-slate-gray font-light leading-relaxed">
                      Logs coordinates, scroll retention heights, and page hits to help us understand which paintings and exhibition halls resonate.
                    </p>
                  </div>
                  <div className={`w-8 h-8 rounded-xs border flex items-center justify-center font-bold shrink-0 transition-all ${
                    preferences.analytics 
                      ? 'bg-signature-carmine text-canvas-white border-signature-carmine' 
                      : 'bg-pure-white border-[#CCCCCC]'
                  }`}>
                    {preferences.analytics && <Check className="w-4 h-4" />}
                  </div>
                </button>

                {/* Preference 3: Marketing */}
                <button
                  onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                  className="w-full flex items-start justify-between gap-4 text-left focus:outline-none cursor-pointer group"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-charcoal-ink block group-hover:text-signature-carmine transition-colors">
                      Custom Curations
                    </span>
                    <p className="text-[10px] text-slate-gray font-light leading-relaxed">
                      Assists with early-bird email reminders and matches curated recommendations for your art collecting requirements.
                    </p>
                  </div>
                  <div className={`w-8 h-8 rounded-xs border flex items-center justify-center font-bold shrink-0 transition-all ${
                    preferences.marketing 
                      ? 'bg-signature-carmine text-canvas-white border-signature-carmine' 
                      : 'bg-pure-white border-[#CCCCCC]'
                  }`}>
                    {preferences.marketing && <Check className="w-4 h-4" />}
                  </div>
                </button>
              </div>

              <div className="flex gap-2 pt-1 border-t border-soft-border/60">
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 py-3 bg-charcoal-ink text-canvas-white hover:bg-signature-carmine transition-colors duration-300 text-[10px] uppercase tracking-widest font-bold rounded-xs cursor-pointer focus:outline-none"
                >
                  Confirm Curations
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="py-3 px-4 border border-soft-border hover:border-charcoal-ink text-slate-gray hover:text-charcoal-ink transition-colors duration-300 text-[10px] uppercase tracking-widest font-bold rounded-xs cursor-pointer focus:outline-none"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
