"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import Link from "next/link";
import { FaMapMarkerAlt, FaCompass, FaRegGem, FaHistory } from "react-icons/fa";

export default function OurStoryPage() {
  return (
    <Layout>
      <div className="w-full bg-[#FAFAFA] text-[#121212] font-secondary selection:bg-[#121212]/10 selection:text-[#121212] overflow-x-hidden">

        {/* ==================================================
            SECTION 1: THE ATELIER HERO (Spacious & Refined)
            ================================================== */}
        <section className="relative py-20 sm:py-28 lg:py-36 px-6 sm:px-12 lg:px-20 max-w-[1600px] mx-auto border-b border-neutral-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column - Typography */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <AnimateOnScroll direction="up" delay={100}>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-neutral-900/30" />
                  <span className="text-[10px] font-sans font-bold tracking-[0.35em] text-neutral-400 uppercase">
                    Our Heritage &amp; Ethos
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-[#121212] tracking-wide leading-[1.15] mt-4">
                  A Quest for <br />
                  <span className="italic font-normal">the Perfect Fire</span>
                </h1>
                <div className="w-16 h-[1px] bg-neutral-900/10 my-8" />
                <p className="text-neutral-600 font-secondary font-light text-sm sm:text-base leading-relaxed max-w-xl">
                  dn Diamonds was founded upon a singular obsession: to unleash the absolute maximum light performance hidden within raw gemstone structures. By rejecting commercial mass-cutting standards that favor weight over refraction, we ensure every diamond is cut to unleash its true brilliance.
                </p>
                <p className="text-neutral-600 font-secondary font-light text-sm sm:text-base leading-relaxed max-w-xl pt-2">
                  From our private consulting salon in Central, Hong Kong, we translate classical design proportions into modern heirlooms that endure for generations.
                </p>
              </AnimateOnScroll>
            </div>

            {/* Right Column - Luxury Editorial Image */}
            <div className="lg:col-span-6 w-full">
              <AnimateOnScroll direction="up" delay={200}>
                <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-sm overflow-hidden bg-neutral-100 shadow-sm border border-neutral-200/50 group">
                  <img
                    src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200"
                    alt="Luxury Diamond Facet Detail"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-[#121212]/5 pointer-events-none" />
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 2: CORE VALUES (Asymmetrical Grid)
            ================================================== */}
        <section className="py-24 sm:py-32 lg:py-40 px-6 sm:px-12 lg:px-20 max-w-[1600px] mx-auto border-b border-neutral-100">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-24">
            <AnimateOnScroll direction="up" delay={100}>
              <span className="text-[10px] font-sans font-bold tracking-[0.35em] text-neutral-400 uppercase block">
                The Pillars of Artistry
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#121212] tracking-wide mt-3">
                Our Uncompromising Standards
              </h2>
              <div className="w-16 h-[1px] bg-neutral-900/10 mx-auto my-6" />
            </AnimateOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 lg:gap-24">
            {/* Value 1: Mathematical Precision */}
            <AnimateOnScroll direction="up" delay={150} className="space-y-6 text-left">
              <div className="w-12 h-12 rounded-sm bg-[#121212] text-white flex items-center justify-center text-lg shadow-sm">
                <FaRegGem />
              </div>
              <h3 className="text-2xl font-serif font-light text-[#121212]">
                Mathematical Precision
              </h3>
              <p className="text-neutral-600 font-secondary font-light text-sm sm:text-base leading-relaxed">
                Standard commercial cuts prioritize retaining carat weight from the raw rough diamond. At our atelier, we discard compromises. Every facet is sculpted to mathematically calculated proportions that maximize internal reflection and color dispersion, ensuring that light is organized, intensified, and reflected back with spectacular brilliance.
              </p>
              <div className="relative aspect-[16/10] rounded-sm overflow-hidden bg-neutral-100 group border border-neutral-200/50">
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800"
                  alt="Diamond setting and geometry detail"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-102"
                />
              </div>
            </AnimateOnScroll>

            {/* Value 2: Absolute Provenance */}
            <AnimateOnScroll direction="up" delay={250} className="space-y-6 text-left md:mt-12">
              <div className="w-12 h-12 rounded-sm bg-[#121212] text-white flex items-center justify-center text-lg shadow-sm">
                <FaCompass />
              </div>
              <h3 className="text-2xl font-serif font-light text-[#121212]">
                Absolute Provenance
              </h3>
              <p className="text-neutral-600 font-secondary font-light text-sm sm:text-base leading-relaxed">
                A masterpiece cannot exist without pure roots. dn Diamonds adheres to a strict sourcing protocol. Every diamond above 0.5 carats is accompanied by an original GIA grading dossier, and all rough minerals are tracked to source, complying with the Kimberley Process to verify conflict-free authenticity and clean provenance.
              </p>
              <div className="relative aspect-[16/10] rounded-sm overflow-hidden bg-neutral-100 group border border-neutral-200/50">
                <img
                  src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800"
                  alt="Polished high-end jewelry"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-102"
                />
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ==================================================
            SECTION 3: THE CHRONICLE (Minimal Hairline Timeline)
            ================================================== */}
        <section className="py-24 sm:py-32 lg:py-40 bg-[#F8F9FA] px-6 sm:px-12 lg:px-20 border-b border-neutral-100">
          <div className="max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-24">
              <AnimateOnScroll direction="up" delay={100}>
                <span className="text-[10px] font-sans font-bold tracking-[0.35em] text-neutral-400 uppercase block">
                  Chronicles of dn Diamonds
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-neutral-950 tracking-wide mt-3">
                  Our Journey
                </h2>
                <div className="w-16 h-[1px] bg-neutral-900/10 mx-auto my-6" />
              </AnimateOnScroll>
            </div>

            {/* Vertical Line Timeline */}
            <div className="relative border-l border-neutral-300/60 ml-4 md:ml-32 space-y-16 py-4">
              {/* Milestone 1 */}
              <div className="relative pl-8 md:pl-12 group">
                {/* Year tag left-aligned on desktop */}
                <div className="absolute -left-8 md:-left-36 top-1.5 text-xl md:text-2xl font-serif font-light text-neutral-400 group-hover:text-[#121212] transition-colors duration-300">
                  2006
                </div>
                {/* Bullet */}
                <div className="absolute -left-[5px] top-3.5 w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-[#121212] transition-colors duration-300 ring-4 ring-[#F8F9FA]" />
                
                <AnimateOnScroll direction="up" delay={100} className="space-y-2 text-left">
                  <h3 className="text-xl font-serif font-light text-neutral-900">
                    Antwerp Roots
                  </h3>
                  <p className="text-neutral-600 font-secondary font-light text-sm leading-relaxed max-w-2xl">
                    Our initial workshop was founded in the historic diamond district of Antwerp, Belgium. Working alongside veteran lapidaries, we focused exclusively on creating hand-forged settings and executing custom commission designs for private collectors.
                  </p>
                </AnimateOnScroll>
              </div>

              {/* Milestone 2 */}
              <div className="relative pl-8 md:pl-12 group">
                <div className="absolute -left-8 md:-left-36 top-1.5 text-xl md:text-2xl font-serif font-light text-neutral-400 group-hover:text-[#121212] transition-colors duration-300">
                  2018
                </div>
                <div className="absolute -left-[5px] top-3.5 w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-[#121212] transition-colors duration-300 ring-4 ring-[#F8F9FA]" />

                <AnimateOnScroll direction="up" delay={200} className="space-y-2 text-left">
                  <h3 className="text-xl font-serif font-light text-neutral-900">
                    Flagship Central Salon
                  </h3>
                  <p className="text-neutral-600 font-secondary font-light text-sm leading-relaxed max-w-2xl">
                    We established our primary design salon and boutique in Central, Hong Kong. Merging historical European bench-crafting techniques with the bespoke requirements of clients in East Asia.
                  </p>
                </AnimateOnScroll>
              </div>

              {/* Milestone 3 */}
              <div className="relative pl-8 md:pl-12 group">
                <div className="absolute -left-8 md:-left-36 top-1.5 text-xl md:text-2xl font-serif font-light text-neutral-400 group-hover:text-[#121212] transition-colors duration-300">
                  Present
                </div>
                <div className="absolute -left-[5px] top-3.5 w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-[#121212] transition-colors duration-300 ring-4 ring-[#F8F9FA]" />

                <AnimateOnScroll direction="up" delay={300} className="space-y-2 text-left">
                  <h3 className="text-xl font-serif font-light text-neutral-900">
                    The Connected Atelier
                  </h3>
                  <p className="text-neutral-600 font-secondary font-light text-sm leading-relaxed max-w-2xl">
                    Today, we combine generational bench-crafting methods with high-resolution CAD optical previews, providing an integrated, conflict-free pipeline from grading report verification to final customized settings.
                  </p>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 4: FINAL CALL TO ACTION (Elegant Minimal)
            ================================================== */}
        <section className="bg-white py-24 sm:py-36 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto px-6 space-y-6 sm:space-y-8">
            <AnimateOnScroll direction="up" delay={100}>
              <span className="text-[10px] font-sans font-bold tracking-[0.35em] text-neutral-400 uppercase block">
                The Next Chapter
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-neutral-950 leading-tight mt-3">
                Design Your Own Legacy
              </h2>
              <div className="w-16 h-[1px] bg-neutral-900/10 mx-auto my-6" />
              <p className="text-neutral-500 font-secondary font-light text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                Whether seeking a classic solitaire, an intricate halo configuration, or a fully custom creation, start your journey today with our master setters.
              </p>

              <div className="pt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full max-w-md sm:max-w-none mx-auto">
                <Link href="/bespoke" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-10 py-4 bg-neutral-950 text-white border border-neutral-950 text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-900 transition-colors cursor-pointer focus:outline-none rounded-sm shadow-md active:scale-98 text-center">
                    Configure Bespoke Piece
                  </button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-10 py-4 border border-neutral-900 bg-transparent text-neutral-950 text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-950 hover:text-white transition-colors cursor-pointer focus:outline-none rounded-sm active:scale-98 text-center">
                    Reserve Private Consultation
                  </button>
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

      </div>
    </Layout>
  );
}
