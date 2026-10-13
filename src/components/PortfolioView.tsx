/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TIMELINE_EVENTS } from '../data';
import { Brush, Award, Star, Palette, Globe, Landmark, FileText, CheckCircle, Quote, Compass } from 'lucide-react';

export const PortfolioView: React.FC = () => {
  
  // Render appropriate vector icon based on timeline event type
  const renderTimelineIcon = (type: string) => {
    const classStr = "w-4 h-4 text-canvas-white";
    switch(type) {
      case 'brush': return <Brush className={classStr} />;
      case 'award': return <Award className={classStr} />;
      case 'palette': return <Palette className={classStr} />;
      case 'globe': return <Globe className={classStr} />;
      default: return <Star className={classStr} />;
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-canvas-white paper-texture pt-32 pb-28 text-left font-sans" id="portfolio-page">
      
      {/* Structural visual rails inspired by contemporary museums */}
      <div className="absolute left-12 top-0 bottom-0 w-[1px] bg-soft-border/25 hidden xl:block pointer-events-none" />
      <div className="absolute right-12 top-0 bottom-0 w-[1px] bg-soft-border/25 hidden xl:block pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* ========================================================= */}
        {/* EDITORIAL HEADER SECTION */}
        {/* ========================================================= */}
        <div className="border-b border-soft-border pb-10 mb-20">
          <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold block mb-2">
            The Artist Dossier
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-charcoal-ink tracking-tight">
            Biography & Statement
          </h2>
          <p className="text-xs md:text-sm text-slate-gray font-light mt-3 leading-relaxed max-w-xl">
            A comprehensive catalog of Tanveen's experimental processes, material philosophy, and chronological milestones.
          </p>
        </div>

        {/* ========================================================= */}
        {/* BIOGRAPHY & MATERIAL PHILOSOPHY (Asymmetrical Split) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start mb-32">
          
          {/* Left Column: Minimal Portrait Panel (takes 4 columns) */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-36">
            <div className="aspect-[3/4] bg-[#FAF9F5] border border-soft-border rounded-xs p-8 flex flex-col justify-between items-start shadow-[0_15px_40px_rgba(0,0,0,0.015)] relative">
              
              <div className="space-y-4 w-full">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-gray/60 block border-b border-soft-border/50 pb-2">
                  Permanent Coordinates
                </span>
                <div className="w-14 h-14 bg-studio-mist border border-soft-border/65 rounded-full flex items-center justify-center text-charcoal-ink">
                  <Palette className="w-6 h-6 text-signature-carmine" />
                </div>
                <h3 className="font-serif text-2xl font-light text-charcoal-ink">Tanveen</h3>
                <p className="text-[9px] uppercase tracking-[0.25em] text-signature-carmine font-bold font-sans">
                  Dhaka & Cox’s Bazar
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-soft-border/50 w-full">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-gray/60 block">
                  Studio Focus
                </span>
                <p className="text-[11px] text-slate-gray leading-relaxed font-serif italic">
                  "My practice concerns extreme material tactility. I capture coastal elements to let nature leave its own physical handwriting."
                </p>
              </div>

              <div className="absolute top-4 right-4 text-[9px] font-mono text-slate-gray/30 font-bold">
                VOL. 26
              </div>
            </div>

            {/* Material Ingredients block */}
            <div className="p-6 bg-studio-mist/20 border border-soft-border/40 rounded-xs space-y-3 text-left">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-gray/80 font-bold block">Physical Ingredients</span>
              <ul className="text-xs text-slate-gray/90 space-y-2 font-sans font-light">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-signature-carmine rounded-full" />
                  <span>Hand-harvested sea salt grains</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-signature-carmine rounded-full" />
                  <span>Crushed Inani Beach sandstone</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-signature-carmine rounded-full" />
                  <span>Sreemangal forest earth pigments</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-signature-carmine rounded-full" />
                  <span>Pure coastal storm rainwater</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Narrative Biography Essays (takes 8 columns) */}
          <div className="lg:col-span-8 space-y-12 text-left">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-signature-carmine font-bold block">
                The Creative Creed
              </span>
              <h3 className="text-3xl font-serif font-light text-charcoal-ink tracking-tight">
                The Material Manifesto
              </h3>
            </div>

            <div className="space-y-6 text-slate-gray font-sans font-light leading-relaxed text-sm md:text-base">
              <p>
                My creative practice operates at the intersection of geographical memory and heavy material tactility. Growing up on the riverine deltas and coastal contours of Bangladesh, I developed an obsession with water—its weight, its capacity for reflection, and the microscopic crystals left behind when the tide recedes.
              </p>
              <p>
                Unlike standard digital visualizers or commercial canvases, my paintings are heavy, physical objects. I combine modeling pastes, ground minerals, charcoal, and natural sea salt collected from Sreemangal tea hills and Cox’s Bazar sandbars. By grinding these organic elements and encapsulating them inside clear gel polymer structures, the medium becomes an active participant in the painting itself.
              </p>

              {/* Injected Pull-Quote */}
              <div className="my-12 py-8 border-t border-b border-soft-border/50 text-center relative">
                <Quote className="w-8 h-8 text-gallery-blue/30 mx-auto mb-4 stroke-[1.2]" />
                <p className="font-serif italic text-lg md:text-xl text-charcoal-ink leading-relaxed max-w-xl mx-auto">
                  "In a screen-bound world, we have forgotten how to read with our hands. My work is an invitation to touch the horizon."
                </p>
                <div className="w-12 h-[1px] bg-signature-carmine mx-auto mt-6" />
              </div>

              <p>
                Through these textured layers, the work shifts color and refracts glare depending on the room’s ambient light. It invites the collector to slow down, step closer, and run their hand along the dry waves. In an increasingly flat, screen-bound digital world, I hope to offer a visual sanctuary of texture and narrative.
              </p>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* INTERACTIVE MILESTONES (Museum Chronicle Style) */}
        {/* ========================================================= */}
        <div className="space-y-14 mb-32">
          
          <div className="border-b border-soft-border/60 pb-6 mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-signature-carmine font-bold block mb-1">
              The Chronicle
            </span>
            <h3 className="text-3xl font-serif font-light text-charcoal-ink tracking-tight">
              Chronological Journey
            </h3>
            <p className="text-xs text-slate-gray mt-1 font-sans font-light">
              A historical registry of exhibitions, residencies, and critical thresholds.
            </p>
          </div>

          {/* Timeline Stack */}
          <div className="relative border-l border-soft-border/50 pl-6 ml-4 md:ml-32 space-y-12 text-left">
            {TIMELINE_EVENTS.map((event, eventIdx) => (
              <div key={event.id} className="relative" id={`timeline-event-${event.id}`}>
                
                {/* Milestone Indicator Icon */}
                <span className="absolute -left-[35px] top-1 w-7 h-7 rounded-full bg-charcoal-ink border-4 border-canvas-white flex items-center justify-center shadow-xs">
                  {renderTimelineIcon(event.iconType)}
                </span>

                {/* Left Side Floating Year (Desktop only) */}
                <div className="hidden md:block absolute -left-36 top-1 text-right w-24">
                  <span className="font-serif text-xl font-light text-signature-carmine">
                    {event.year}
                  </span>
                </div>

                {/* Detail Card - Premium Layout */}
                <div className="bg-pure-white border border-soft-border p-6 md:p-8 rounded-xs hover:border-signature-carmine/30 transition-all duration-300 space-y-3 shadow-[0_12px_40px_rgba(0,0,0,0.005)] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-[2px] h-0 bg-signature-carmine group-hover:h-full transition-all duration-500" />

                  <span className="inline-block md:hidden font-serif font-bold text-signature-carmine text-base mb-1">
                    {event.year}
                  </span>
                  
                  <div className="flex justify-between items-baseline gap-4">
                    <h4 className="font-serif text-xl font-light text-charcoal-ink">
                      {event.title}
                    </h4>
                    <span className="font-mono text-[8px] text-slate-gray/40">ENTRY 0{eventIdx + 1}</span>
                  </div>

                  <p className="text-xs md:text-sm text-slate-gray leading-relaxed font-sans font-light">
                    {event.description}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* PERMANENT EXHIBITIONS & PUBLICATIONS */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 pt-16 border-t border-soft-border/60">
          
          {/* Solo Exhibitions Section */}
          <div className="space-y-6">
            <h4 className="font-serif text-xl font-light text-charcoal-ink flex items-center space-x-3 pb-3 border-b border-soft-border/50">
              <Landmark className="w-5 h-5 text-gallery-blue" />
              <span>Solo Exhibitions</span>
            </h4>
            <ul className="space-y-4 font-sans text-slate-gray font-light text-xs md:text-sm">
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-signature-carmine shrink-0 mt-0.5" />
                <span><strong>2024</strong>: <em>The Mineral Veil</em>, Saffron Art Space, Singapore.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-signature-carmine shrink-0 mt-0.5" />
                <span><strong>2022</strong>: <em>Tidal Echoes</em>, National Fine Arts Gallery, Shilpakala Academy, Dhaka.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-signature-carmine shrink-0 mt-0.5" />
                <span><strong>2020</strong>: <em>Beneath the Surface</em>, Bengal Art Lounge, Dhaka.</span>
              </li>
            </ul>
          </div>

          {/* Press & Publications Section */}
          <div className="space-y-6">
            <h4 className="font-serif text-xl font-light text-charcoal-ink flex items-center space-x-3 pb-3 border-b border-soft-border/50">
              <FileText className="w-5 h-5 text-gallery-blue" />
              <span>Press & Publications</span>
            </h4>
            <ul className="space-y-4 font-sans text-slate-gray font-light text-xs md:text-sm">
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-signature-carmine shrink-0 mt-0.5" />
                <span><strong>2025</strong>: <em>"The Tactility of Coastal Solitude,"</em> Art Asia Pacific Quarterly, Issue 142.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-signature-carmine shrink-0 mt-0.5" />
                <span><strong>2023</strong>: <em>"Dhaka's New Wave of Organic Abstraction,"</em> The Daily Star Art Review.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-signature-carmine shrink-0 mt-0.5" />
                <span><strong>2021</strong>: <em>"Crystalline Landscapes: Painting with Cox's Bazar Salt,"</em> Bangladesh Heritage Trust.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
