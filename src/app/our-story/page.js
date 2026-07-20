"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import Link from "next/link";
import {
  FaQuoteLeft,
  FaArrowRight,
  FaGem,
  FaCrown,
  FaShieldAlt,
  FaFingerprint,
  FaGlobe,
  FaCertificate,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTruck,
  FaAward
} from "react-icons/fa";

// Brand Milestones Data with curated high-quality jewelry photography URLs
const MILESTONES = [
  {
    year: "2006",
    title: "Atelier Origins",
    location: "Antwerp, Belgium",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800",
    desc: "Founded in the historic diamond district of Antwerp. Our initial workshop served an exclusive circle of private collectors, focusing strictly on hand-forged platinum settings and rare-cut diamond settings."
  },
  {
    year: "2012",
    title: "Strict Provenance & Sourcing",
    location: "Geneva, Switzerland",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800",
    desc: "Pioneered a strict sourcing protocol. Partnered directly with major GIA laboratories and registered mines to certify conflict-free diamonds through the Kimberley Process, tracking every stone from rough to cut."
  },
  {
    year: "2018",
    title: "Central Flagship Salon",
    location: "Central, Hong Kong",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800",
    desc: "Opened our flagship salon in Central, Hong Kong. Merging traditional European bench-crafting methods with the vibrant, fast-growing bespoke market of East Asia's elite."
  },
  {
    year: "2023",
    title: "Atelier Expansion & Carbon Neutrality",
    location: "New York & Paris",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800",
    desc: "Expanded consulting salons to Manhattan and Place Vendôme. DN Diamond integrated carbon-neutral supply tracking, validating sustainable practices across all setting procedures."
  },
  {
    year: "2026",
    title: "Atelier Digitized Future",
    location: "Hong Kong Atelier",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800",
    desc: "Pioneering interactive luxury customization. Blending master craftsmanship with gouache CAD technology, allowing clients to see structural optical physics of stones in real-time."
  }
];

// Featured Masterpiece Data
const FEATURED_TENNIS_BRACELET = {
  title: "Diamond Tennis Bracelet 18K Rose Gold",
  status: "Ready to Ship",
  category: "Signature Masterpiece",
  metal: "18K Solid Rose Gold",
  caratTotal: "4.50 ctw",
  clarity: "VVS1 - VS1",
  colorGrade: "F - G (Colorless)",
  settingType: "Hand-Forged 4-Claw Prong Setting",
  closure: "Double Security Safety Clasp",
  certification: "GIA Certified & Kimberley Compliant",
  price: "$9,850",
  image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000",
  altImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000",
  desc: "An icon of timeless sophistication. Each brilliant-cut diamond is individually hand-selected for matching fire and color, seamlessly set into a fluid 18K solid rose gold articulating chain that contours effortlessly to the wrist."
};

// Craftsmanship Pillars Data
const CRAFTSMANSHIP_PILLARS = [
  {
    icon: FaGem,
    title: "Master Lapidary Precision",
    desc: "Every diamond facet is sculpted to mathematically calculated proportions, maximizing internal reflection and fire dispersion."
  },
  {
    icon: FaShieldAlt,
    title: "100% Conflict-Free Provenance",
    desc: "Direct ethical sourcing adhering strictly to the Kimberley Process, with complete transparency from mine to high jewelry."
  },
  {
    icon: FaCrown,
    title: "Hand-Forged Atelier Mountings",
    desc: "Crafted by master goldsmiths in 18K Rose Gold, 18K Yellow Gold, and Platinum, built specifically around the unique geometry of each stone."
  },
  {
    icon: FaFingerprint,
    title: "Generational Bespoke Heirlooms",
    desc: "Designed to transcend trends. Each creation is accompanied by full GIA authentication and a lifetime craftsmanship guarantee."
  }
];

export default function OurStoryPage() {
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState(0);
  const [activeImageTab, setActiveImageTab] = useState(0);

  const handleScrollToHistory = () => {
    const target = document.getElementById("brand-history");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout>
      <div className="w-full bg-white text-neutral-900 font-sans selection:bg-neutral-900/10 selection:text-neutral-900 overflow-x-hidden">

        {/* ==================================================
            HERO SECTION
            ================================================== */}
        <section className="relative min-h-[75vh] sm:min-h-[85vh] w-full flex items-center justify-center bg-neutral-950 text-white overflow-hidden py-16 sm:py-24">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1920"
              alt="Luxury Diamond Facet Details"
              className="w-full h-full object-cover brightness-[0.22] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent z-10" />
          </div>

          <div className="relative z-20 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-8 text-left space-y-4 sm:space-y-6 max-w-3xl">
              <AnimateOnScroll direction="up" delay={150}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="w-6 sm:w-8 h-[1px] bg-rose-300/60" />
                  <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.25em] sm:tracking-[0.3em] text-rose-200/90 uppercase">
                    Our Heritage &amp; Atelier Ethos
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-white tracking-wide leading-[1.1] mt-2 sm:mt-3">
                  A Legacy Forged<br />in Brilliance &amp; Perfection
                </h1>
                <div className="w-12 sm:w-16 h-[1px] bg-white/30 my-4 sm:my-6" />
                <p className="text-neutral-300 font-sans font-light text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl">
                  Drawing inspiration from classical proportions and the natural physics of light, DN Diamond has spent decades crafting grading masterpieces for the world&apos;s most discerning jewelry collectors.
                </p>
                <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <button
                    onClick={handleScrollToHistory}
                    className="group relative overflow-hidden px-6 sm:px-8 py-3.5 bg-white border border-white text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 cursor-pointer focus:outline-none rounded-xl shadow-lg w-full sm:w-auto text-center"
                  >
                    <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                      View Our Journey
                    </span>
                    <span className="absolute inset-0 bg-neutral-950 origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 -z-0" />
                  </button>
                  <Link href="/bespoke" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 border border-white/40 bg-white/5 backdrop-blur-md text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/20 transition-all duration-300 cursor-pointer focus:outline-none rounded-xl text-center">
                      Explore Bespoke Atelier
                    </button>
                  </Link>
                </div>
              </AnimateOnScroll>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex-col items-center">
            <button
              onClick={handleScrollToHistory}
              className="flex flex-col items-center group cursor-pointer focus:outline-none"
              aria-label="Scroll down to history"
            >
              <div className="relative w-[20px] h-[32px] border border-white/30 rounded-full flex justify-center p-1 group-hover:border-white transition-colors duration-500">
                <div className="w-[2px] h-[5px] bg-white rounded-full animate-bounce mt-1" />
              </div>
            </button>
          </div>
        </section>

        {/* ==================================================
            HERITAGE STATISTICS BAR
            ================================================== */}
        <section className="bg-neutral-900 border-y border-neutral-800 text-white py-8 sm:py-12">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <AnimateOnScroll direction="up" delay={100} className="p-3 sm:p-4 bg-neutral-950/40 md:bg-transparent rounded-2xl border border-white/5 md:border-none">
              <span className="block text-2xl sm:text-4xl lg:text-5xl font-serif font-light text-rose-200">2006</span>
              <span className="block text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 mt-1.5 font-medium">Est. Antwerp Atelier</span>
            </AnimateOnScroll>
            <AnimateOnScroll direction="up" delay={200} className="p-3 sm:p-4 bg-neutral-950/40 md:bg-transparent rounded-2xl border border-white/5 md:border-none">
              <span className="block text-2xl sm:text-4xl lg:text-5xl font-serif font-light text-white">100%</span>
              <span className="block text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 mt-1.5 font-medium">Kimberley Conflict-Free</span>
            </AnimateOnScroll>
            <AnimateOnScroll direction="up" delay={300} className="p-3 sm:p-4 bg-neutral-950/40 md:bg-transparent rounded-2xl border border-white/5 md:border-none">
              <span className="block text-2xl sm:text-4xl lg:text-5xl font-serif font-light text-rose-200">15,000+</span>
              <span className="block text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 mt-1.5 font-medium">Bespoke Heirlooms</span>
            </AnimateOnScroll>
            <AnimateOnScroll direction="up" delay={400} className="p-3 sm:p-4 bg-neutral-950/40 md:bg-transparent rounded-2xl border border-white/5 md:border-none">
              <span className="block text-2xl sm:text-4xl lg:text-5xl font-serif font-light text-white">4</span>
              <span className="block text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 mt-1.5 font-medium">Global Flagship Salons</span>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ==================================================
            THE GENESIS / BRAND VISION
            ================================================== */}
        <section
          id="brand-history"
          className="relative py-16 sm:py-28 lg:py-36 px-4 sm:px-8 lg:px-16 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-center"
        >
          {/* Left Panel: Narrative Text */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 text-left">
            <AnimateOnScroll direction="up" delay={100}>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
                The Genesis &amp; Philosophy
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-light tracking-wide text-neutral-950 leading-tight mt-2 sm:mt-3">
                The Quest For The Perfect Cut
              </h2>
              <div className="w-12 sm:w-16 h-[1px] bg-neutral-800 my-4 sm:my-6" />
              <p className="text-neutral-600 font-sans font-light text-xs sm:text-sm md:text-base leading-relaxed">
                DN Diamond was born from a singular obsession: to liberate the maximum fire hidden within the diamond crystalline structure. Standard commercial cuts prioritize carat weight over light returns; we set out to do the exact opposite.
              </p>
              <p className="text-neutral-600 font-sans font-light text-xs sm:text-sm md:text-base leading-relaxed">
                By selecting only conflict-free rough stones showing zero fluorescence and superb crystal purity, and setting them in custom-made, hand-forged mounts, we established a new benchmark for certified diamond artistry.
              </p>
              <p className="text-neutral-600 font-sans font-light text-xs sm:text-sm md:text-base leading-relaxed">
                Today, from our primary atelier in Central, Hong Kong to our consulting salons in Europe and North America, every piece is sculpted specifically to hold the exact gemstone it cradles.
              </p>
            </AnimateOnScroll>
          </div>

          {/* Right Panel: Immersive Collage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[320px] sm:min-h-[480px] lg:h-[600px] w-full">
            <div className="overflow-hidden rounded-2xl bg-neutral-100 h-64 sm:h-full relative group shadow-sm">
              <AnimateOnScroll direction="up" delay={150} className="h-full">
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600"
                  alt="Atelier Diamond Setting Details"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </AnimateOnScroll>
            </div>
            <div className="grid grid-rows-2 gap-4 h-full min-h-[300px]">
              <div className="overflow-hidden rounded-2xl bg-neutral-100 relative group shadow-sm h-full">
                <AnimateOnScroll direction="up" delay={250} className="h-full">
                  <img
                    src="https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?q=80&w=600"
                    alt="Bench Jeweller Polishing"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </AnimateOnScroll>
              </div>
              <div className="overflow-hidden rounded-2xl bg-neutral-100 relative group shadow-sm h-full">
                <AnimateOnScroll direction="up" delay={350} className="h-full">
                  <img
                    src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600"
                    alt="Finished Custom Diamond Ring"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            FEATURED MASTERPIECE SPOTLIGHT:
            "Diamond Tennis Bracelet 18K Rose Gold - Ready to Ship"
            ================================================== */}
        <section className="bg-neutral-950 text-white py-16 sm:py-28 lg:py-36 relative overflow-hidden border-t border-b border-neutral-800">
          {/* Subtle Ambient Gold Glow Background */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-rose-500/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-20">
              <AnimateOnScroll direction="up" delay={100}>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-950/80 border border-rose-800/60 rounded-full mb-2 sm:mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-semibold text-rose-200 tracking-wider uppercase">
                    {FEATURED_TENNIS_BRACELET.status}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-6xl font-serif font-light text-white tracking-wide">
                  Signature Atelier Masterpiece
                </h2>
                <div className="w-12 sm:w-16 h-[1px] bg-rose-300/40 mx-auto my-3 sm:my-4" />
                <p className="text-neutral-400 font-sans font-light text-xs sm:text-sm leading-relaxed max-w-xl mx-auto px-2">
                  A definitive statement of high-jewelry benchcraft. Hand-set in Antwerp and ready for immediate complimentary insured dispatch worldwide.
                </p>
              </AnimateOnScroll>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

              {/* Left Column: Product Media Showcase */}
              <div className="lg:col-span-7 space-y-4">
                <AnimateOnScroll direction="up" delay={150}>
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 group shadow-2xl">
                    <img
                      src={activeImageTab === 0 ? FEATURED_TENNIS_BRACELET.image : FEATURED_TENNIS_BRACELET.altImage}
                      alt={FEATURED_TENNIS_BRACELET.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent pointer-events-none" />

                    {/* Corner Tag */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-neutral-950/85 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-white/10 flex items-center gap-2">
                      <FaCrown className="text-rose-300 text-xs" />
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white">18K Rose Gold Edition</span>
                    </div>

                    {/* Floating Price & Status Tag */}
                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-neutral-900/95 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-3 rounded-xl border border-white/10">
                      <div>
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">Masterpiece Valued At</span>
                        <span className="text-lg sm:text-xl font-serif text-rose-200 font-semibold">{FEATURED_TENNIS_BRACELET.price} USD</span>
                      </div>
                      <span className="text-[10px] sm:text-xs font-sans font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                        <FaCheckCircle className="text-[10px]" /> Express Shipping Ready
                      </span>
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Thumbnail selector */}
                <div className="flex gap-3 sm:gap-4">
                  <button
                    onClick={() => setActiveImageTab(0)}
                    className={`relative rounded-xl overflow-hidden h-16 w-24 sm:h-20 sm:w-28 border transition-all cursor-pointer ${activeImageTab === 0 ? "border-rose-300 ring-2 ring-rose-300/30" : "border-white/10 opacity-60 hover:opacity-100"}`}
                  >
                    <img src={FEATURED_TENNIS_BRACELET.image} alt="Angle 1" className="w-full h-full object-cover" />
                  </button>
                  <button
                    onClick={() => setActiveImageTab(1)}
                    className={`relative rounded-xl overflow-hidden h-16 w-24 sm:h-20 sm:w-28 border transition-all cursor-pointer ${activeImageTab === 1 ? "border-rose-300 ring-2 ring-rose-300/30" : "border-white/10 opacity-60 hover:opacity-100"}`}
                  >
                    <img src={FEATURED_TENNIS_BRACELET.altImage} alt="Angle 2" className="w-full h-full object-cover" />
                  </button>
                </div>
              </div>

              {/* Right Column: Detailed Product Specifications & Story */}
              <div className="lg:col-span-5 space-y-5 sm:space-y-6 text-left">
                <AnimateOnScroll direction="up" delay={200}>
                  <h3 className="text-xl sm:text-3xl lg:text-4xl font-serif font-light text-white leading-tight">
                    {FEATURED_TENNIS_BRACELET.title}
                  </h3>
                  <p className="text-neutral-300 font-sans font-light text-xs sm:text-sm leading-relaxed mt-3 sm:mt-4">
                    {FEATURED_TENNIS_BRACELET.desc}
                  </p>

                  {/* Specs Table */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3 py-4 sm:py-6 my-4 sm:my-6 border-y border-white/10">
                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[9px] sm:text-[10px] text-neutral-400 font-sans uppercase tracking-wider block">Precious Metal</span>
                      <span className="text-xs sm:text-sm font-serif text-white mt-0.5 block font-medium">{FEATURED_TENNIS_BRACELET.metal}</span>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[9px] sm:text-[10px] text-neutral-400 font-sans uppercase tracking-wider block">Total Carat Weight</span>
                      <span className="text-xs sm:text-sm font-serif text-white mt-0.5 block font-medium">{FEATURED_TENNIS_BRACELET.caratTotal}</span>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[9px] sm:text-[10px] text-neutral-400 font-sans uppercase tracking-wider block">Diamond Clarity</span>
                      <span className="text-xs sm:text-sm font-serif text-white mt-0.5 block font-medium">{FEATURED_TENNIS_BRACELET.clarity}</span>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[9px] sm:text-[10px] text-neutral-400 font-sans uppercase tracking-wider block">Color Grade</span>
                      <span className="text-xs sm:text-sm font-serif text-white mt-0.5 block font-medium">{FEATURED_TENNIS_BRACELET.colorGrade}</span>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 text-xs font-sans text-neutral-300 pb-2">
                    <div className="flex items-center gap-2">
                      <FaAward className="text-rose-300 text-xs flex-shrink-0" />
                      <span>{FEATURED_TENNIS_BRACELET.settingType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCertificate className="text-rose-300 text-xs flex-shrink-0" />
                      <span>{FEATURED_TENNIS_BRACELET.certification}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaTruck className="text-rose-300 text-xs flex-shrink-0" />
                      <span>Complimentary Insured Overnight Global Delivery</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full">
                    <Link href="/jewelry" className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-rose-200 text-neutral-950 font-bold text-xs uppercase tracking-[0.2em] hover:bg-white transition-colors duration-300 cursor-pointer rounded-xl focus:outline-none text-center">
                        Acquire Bracelet Now
                      </button>
                    </Link>
                    <Link href="/contact" className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 border border-white/30 bg-transparent text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer rounded-xl focus:outline-none text-center">
                        Inquire Private Concierge
                      </button>
                    </Link>
                  </div>
                </AnimateOnScroll>
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================
            BRAND MILESTONES / HISTORIC TIMELINE (INTERACTIVE)
            ================================================== */}
        <section className="py-16 sm:py-28 lg:py-36 bg-neutral-50 relative overflow-hidden border-b border-neutral-200">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16">

            {/* Section Title */}
            <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-16">
              <AnimateOnScroll direction="up" delay={100}>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
                  Chronicles of Excellence
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-light text-neutral-950 tracking-wide">
                  Our Milestone Journey
                </h2>
                <div className="w-12 sm:w-16 h-[1px] bg-neutral-800 mx-auto my-3 sm:my-4" />
                <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                  Explore how two decades of relentless dedication to high jewelry and ethical diamond cutting shaped our international presence.
                </p>
              </AnimateOnScroll>
            </div>

            {/* Interactive Timeline Tabs (Scrollable on mobile) */}
            <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap justify-start sm:justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {MILESTONES.map((m, idx) => (
                <button
                  key={m.year}
                  onClick={() => setActiveMilestoneIdx(idx)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer focus:outline-none whitespace-nowrap flex-shrink-0 ${activeMilestoneIdx === idx ? "bg-neutral-950 text-white shadow-md scale-105" : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400"}`}
                >
                  {m.year}
                </button>
              ))}
            </div>

            {/* Active Milestone Card Highlight */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center p-4 sm:p-8 md:p-10 transition-all duration-500">

              <div className="lg:col-span-6 relative aspect-[16/10] sm:aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-100">
                <img
                  src={MILESTONES[activeMilestoneIdx].image}
                  alt={MILESTONES[activeMilestoneIdx].title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-neutral-950 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase">
                  {MILESTONES[activeMilestoneIdx].year}
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left p-1 sm:p-4">
                <div className="flex items-center gap-2 text-rose-800 text-[11px] sm:text-xs font-sans font-semibold uppercase tracking-widest">
                  <FaMapMarkerAlt />
                  <span>{MILESTONES[activeMilestoneIdx].location}</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-serif font-light text-neutral-950">
                  {MILESTONES[activeMilestoneIdx].title}
                </h3>
                <div className="w-10 sm:w-12 h-[1px] bg-neutral-300" />
                <p className="text-neutral-600 font-sans font-light text-xs sm:text-sm md:text-base leading-relaxed">
                  {MILESTONES[activeMilestoneIdx].desc}
                </p>
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between border-t border-neutral-100 text-xs font-sans text-neutral-400 font-medium gap-3">
                  <span>Milestone {activeMilestoneIdx + 1} of {MILESTONES.length}</span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      disabled={activeMilestoneIdx === 0}
                      onClick={() => setActiveMilestoneIdx(prev => Math.max(0, prev - 1))}
                      className="flex-1 sm:flex-none px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100 disabled:opacity-30 cursor-pointer text-black text-center text-xs font-medium"
                    >
                      ← Prev
                    </button>
                    <button
                      disabled={activeMilestoneIdx === MILESTONES.length - 1}
                      onClick={() => setActiveMilestoneIdx(prev => Math.min(MILESTONES.length - 1, prev + 1))}
                      className="flex-1 sm:flex-none px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100 disabled:opacity-30 cursor-pointer text-black text-center text-xs font-medium"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ==================================================
            CRAFTSMANSHIP PILLARS
            ================================================== */}
        <section className="py-16 sm:py-28 lg:py-36 bg-white text-neutral-900 border-b border-neutral-200">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16">

            <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-20">
              <AnimateOnScroll direction="up" delay={100}>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
                  The Pillars of Artistry
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-light text-neutral-950 tracking-wide">
                  Our Uncompromising Standards
                </h2>
                <div className="w-12 sm:w-16 h-[1px] bg-neutral-800 mx-auto my-3 sm:my-4" />
                <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                  From rough sorting in Antwerp to master diamond setting in Hong Kong, every step is executed under non-negotiable principles.
                </p>
              </AnimateOnScroll>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {CRAFTSMANSHIP_PILLARS.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <AnimateOnScroll key={pillar.title} direction="up" delay={150 + idx * 100}>
                    <div className="p-6 sm:p-8 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-neutral-950 transition-all duration-500 group h-full flex flex-col justify-between hover:shadow-xl">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-950 text-white flex items-center justify-center text-lg sm:text-xl group-hover:bg-rose-900 transition-colors duration-500">
                          <IconComponent />
                        </div>
                        <h3 className="text-lg sm:text-xl font-serif font-light text-neutral-950 group-hover:text-rose-950 transition-colors">
                          {pillar.title}
                        </h3>
                        <p className="text-neutral-600 font-sans font-light text-xs sm:text-sm leading-relaxed">
                          {pillar.desc}
                        </p>
                      </div>
                      <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-neutral-200/60">
                        <span className="text-[10px] font-mono text-neutral-400 font-semibold tracking-wider uppercase">Pillar / 0{idx + 1}</span>
                      </div>
                    </div>
                  </AnimateOnScroll>
                );
              })}
            </div>

          </div>
        </section>

        {/* ==================================================
            BRAND PHILOSOPHY QUOTE
            ================================================== */}
        <section className="relative bg-neutral-950 text-white py-16 sm:py-28 lg:py-36 text-center px-4 sm:px-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-white/5 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <AnimateOnScroll direction="up" delay={100}>
              <FaQuoteLeft className="text-2xl sm:text-3xl text-rose-300 opacity-60 mx-auto" />
              <blockquote className="text-lg sm:text-2xl lg:text-4xl font-serif font-light tracking-wide leading-relaxed text-neutral-100 max-w-3xl mx-auto italic mt-4 sm:mt-6 px-2">
                &ldquo;A diamond has no light of its own. It is the jeweler&apos;s sacred duty to shape the facets so they capture passing rays and turn them into fire. We do not craft jewelry; we organize light.&rdquo;
              </blockquote>
              <div className="w-10 sm:w-12 h-[1px] bg-white/20 mx-auto mt-6 sm:mt-8 mb-3 sm:mb-4" />
              <span className="block text-[9px] sm:text-[11px] font-sans font-bold tracking-[0.25em] sm:tracking-[0.3em] text-rose-200 uppercase">
                DN Diamond Master Lapidary &amp; Founder
              </span>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ==================================================
            FINAL CALL TO ACTION
            ================================================== */}
        <section className="bg-white py-16 sm:py-28 lg:py-36 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
            <AnimateOnScroll direction="up" delay={100}>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
                The Next Chapter
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-neutral-950 leading-tight mt-2 sm:mt-3">
                Design Your Own Legacy
              </h2>
              <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                Whether seeking a classic solitaire, an intricate halo configuration, or a fully custom creation, start your journey today with our master setters.
              </p>

              <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto">
                <Link href="/bespoke" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-neutral-950 text-white border border-neutral-950 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-900 transition-colors cursor-pointer focus:outline-none rounded-xl shadow-lg active:scale-95 text-center">
                    Configure Bespoke Piece
                  </button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 border border-neutral-900 bg-transparent text-neutral-950 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-950 hover:text-white transition-colors cursor-pointer focus:outline-none rounded-xl active:scale-95 text-center">
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
