/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ShieldCheck, Scale, FileText, Landmark } from 'lucide-react';
import { motion } from 'motion/react';

interface LegalPagesProps {
  type: 'terms' | 'privacy';
}

export const LegalPages: React.FC<LegalPagesProps> = ({ type }) => {
  const { setRoute } = useApp();

  const handleBackToHome = () => {
    setRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.6 }}
      className="w-full pt-32 pb-24 text-left font-sans bg-canvas-white paper-texture"
      id={`legal-page-${type}`}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Navigation Assist Breadcrumbs */}
        <button
          onClick={handleBackToHome}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#777777] hover:text-signature-carmine transition-colors focus:outline-none mb-10 cursor-pointer font-bold group"
          id="legal-back-btn"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Studio Editorial</span>
        </button>

        {type === 'terms' ? (
          <article className="space-y-12">
            {/* Header section */}
            <div className="space-y-4 border-b border-soft-border pb-8">
              <div className="inline-flex items-center space-x-2 bg-signature-carmine/5 text-signature-carmine border border-signature-carmine/15 px-3 py-1 rounded-xs text-[9px] uppercase tracking-wider font-mono font-bold">
                <Scale className="w-3.5 h-3.5" />
                <span>Exhibition Legal Framework</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-light text-charcoal-ink leading-tight">
                Terms of Collection
              </h1>
              <p className="text-xs text-slate-gray font-light">
                Last updated and verified: July 8, 2026. Certified Ledger Rules apply globally.
              </p>
            </div>

            {/* Core Body content */}
            <div className="space-y-8 text-xs text-[#3D3D3D] leading-relaxed font-light">
              
              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-charcoal-ink">
                  1. Scope of the Exhibition Service
                </h2>
                <p>
                  Welcome to Artveen (the “Studio Platform”). These Terms of Collection govern the showcase, reservation, certified purchase, and delivery of original sea-salt canvas paintings, mixed-media masterworks, and custom giclée reproductions (collectively, "Artworks") offered by the artist Tanveen.
                </p>
                <p>
                  By navigating this platform, initiating a secured acquisition, or entering our Collector Registry, you enter a legally binding covenant adhering to standard physical provenance rules and intellectual property protections.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-charcoal-ink">
                  2. Provenance & Verification Tokens
                </h2>
                <p>
                  Every original canvas listed on Artveen is cataloged with a physical microchip embedded in the wooden stretcher and a verified entry in our central physical-ledger validation database. This system guarantees absolute authenticity, protecting collectors from downstream digital forgery or unauthorized physical replication.
                </p>
                <p>
                  Provenance certificates and physical verification documents are shipped in sealed wax cases alongside the primary artwork. Ownership transfer takes official effect upon signed receipt of physical delivery.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-charcoal-ink">
                  3. Secured Acquisitions & Investment Processing
                </h2>
                <p>
                  Acquisitions can be initiated directly via our full-screen secure checkout funnel. When you check out:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Original Paintings:</strong> Strictly limited to a quantity of one. Since original works are highly unique physical items, reservations are held in your session for up to thirty (30) minutes before reverting to public listing.</li>
                  <li><strong>Canvas & Fine Art Prints:</strong> Custom-prepared upon order validation using archival pigment inks on museum-grade cotton canvas. Since these are made to order, allow up to fourteen (14) business days for physical preparation.</li>
                  <li><strong>Pricing:</strong> All investments are listed in USD. Delivery costs, crating services, and customs duties are fully covered by the Studio’s complimentary global shipping covenant unless explicitly noted.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-charcoal-ink">
                  4. Intellectual Property & Reproduction Covenant
                </h2>
                <p>
                  Acquiring an Artwork grants physical ownership of the specific canvas or print. However, <strong>absolute copyright, design patents, and reproduction rights remain exclusively reserved by the artist Tanveen</strong>.
                </p>
                <p>
                  You are strictly prohibited from reproducing, scanning, selling digital prints of, or tokenizing the Artwork (including but not limited to NFTs or generative training models) without a signed copyright transfer agreement certified by our legal department.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-charcoal-ink">
                  5. Shipping & White-Glove Hand Delivery
                </h2>
                <p>
                  Original canvases are packed in custom wooden crates containing structural temperature controls. We use fully insured white-glove transport partners for global routes. If an item arrives with any structural blemish to the outer crate or internal canvas, take photographs immediately and notify our registrar at <span className="underline font-semibold text-charcoal-ink">studio@artveen.com</span> within twenty-four (24) hours of receipt to initiate transit insurance coverage.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-charcoal-ink">
                  6. Governing Law & Dispute Resolutions
                </h2>
                <p>
                  These Terms of Collection shall be construed under the laws of Bangladesh and international fine-art trade conventions. Any disputes, claims, or arbitration arising from platform transactions or provenance validation shall be handled exclusively in local courts of Dhaka, Bangladesh, with procedural language in English.
                </p>
              </section>

            </div>
          </article>
        ) : (
          <article className="space-y-12">
            {/* Header section */}
            <div className="space-y-4 border-b border-soft-border pb-8">
              <div className="inline-flex items-center space-x-2 bg-signature-carmine/5 text-signature-carmine border border-signature-carmine/15 px-3 py-1 rounded-xs text-[9px] uppercase tracking-wider font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Collector Privacy Covenants</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-light text-charcoal-ink leading-tight">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-gray font-light">
                Last updated and verified: July 8, 2026. Compliant with GDPR, CCPA, and secure data standards.
              </p>
            </div>

            {/* Core Body content */}
            <div className="space-y-8 text-xs text-[#3D3D3D] leading-relaxed font-light">
              
              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-charcoal-ink">
                  1. Information We Collect
                </h2>
                <p>
                  We believe that fine art collecting requires an absolute sanctuary of trust. We only collect details essential to processing secure deliveries, maintaining your Registry account, and providing rich analytics on our in-gallery interactions.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Collector Details:</strong> When you register as a collector, we log your legal name, billing/shipping address, telephone contact, and specialized art preferences.</li>
                  <li><strong>Delivery Tracking Details:</strong> Information necessary to safely crate and ship physical paintings, including coordinates and white-glove transport registries.</li>
                  <li><strong>Session Telemetry Metrics:</strong> We log general coordinates of click hotspots, scroll depth thresholds (25%, 50%, 75%, 100%), and relative view times to optimize our virtual exhibition layout and curate our gallery offerings. This telemetry is fully anonymized.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-charcoal-ink">
                  2. Telemetry and Analytics Pipeline (GDPR & CCPA Compliant)
                </h2>
                <p>
                  Our internal studio intelligence pipeline (utilizing GA4, Google Tag Manager, Microsoft Clarity, and custom click coordinate spotters) only loads scripts once you have completed your choices on the Cookie Consent dialog.
                </p>
                <p>
                  No personal identifier or financial credential is ever captured by our tracking coordinate heatmaps or stored in our local telemetry metrics ledger.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-charcoal-ink">
                  3. Secure Transactions & Stripe Gateway
                </h2>
                <p>
                  When checking out, your credit card number, authorization codes, and billing details are passed directly to our PCI-DSS compliant credit card processing gateways (such as Stripe). <strong>No raw financial credential or transaction key is ever processed, stored, or visible on the studio's primary servers</strong>.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-charcoal-ink">
                  4. Your Rights & Data Erasure
                </h2>
                <p>
                  As an esteemed collector, you hold sovereign control over your record in our Registry. At any point:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You may request a complete report of the personal shipping coordinates and details logged in our databases.</li>
                  <li>You may demand immediate, permanent erasure of your Collector Portal account, email subscription history, and associated transactional logs (subject to tax-keeping shipping regulations).</li>
                  <li>To exercise these rights, simply email our compliance desk at <span className="underline font-semibold text-charcoal-ink">studio@artveen.com</span>. We process all deletion queries within forty-eight (48) hours.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-charcoal-ink">
                  5. Third-Party Sharing Rules
                </h2>
                <p>
                  We will never rent, monetize, or sell collector emails or transaction lists to third-party marketing companies. Data is strictly shared with trusted shipping partners (e.g. DHL, FedEx, insured fine-art couriers) solely for completing certified physical delivery.
                </p>
              </section>

            </div>
          </article>
        )}
      </div>
    </motion.div>
  );
};
