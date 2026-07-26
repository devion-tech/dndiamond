"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import Link from "next/link";
import { FaCertificate, FaGem, FaGlobe, FaShieldAlt, FaPrint, FaSearch, FaCheckCircle } from "react-icons/fa";

const LABS = [
  {
    name: "GIA",
    title: "Gemological Institute of America",
    established: "1931",
    location: "Carlsbad, California",
    badge: "Gold Standard",
    desc: "The world's most trusted authority on natural diamonds. GIA created the famous 4Cs grading system (Carat, Color, Clarity, Cut) and maintains strict, uncompromising standards.",
    points: [
      "Microscopic laser inscriptions matching reports",
      "Rigorous double-blind grading procedures",
      "Strictest standards for cut symmetry and fire return"
    ]
  },
  {
    name: "IGI",
    title: "International Gemological Institute",
    established: "1975",
    location: "Antwerp, Belgium",
    badge: "Global Leader",
    desc: "The primary authority for certifying lab-grown diamonds and finished studded jewelry globally. Operates across major global trading hubs.",
    points: [
      "Advanced CVD & HPHT screening technology",
      "Detailed finished-jewelry mapping dossiers",
      "Fast, versatile international verification network"
    ]
  },
  {
    name: "HRD Antwerp",
    title: "Hoge Raad voor Diamant",
    established: "1973",
    location: "Antwerp, Belgium",
    badge: "European Benchmark",
    desc: "Europe's leading diamond authority. Highly respected by European courts and legacy design houses for high-security certificates and detailed fluorescence reports.",
    points: [
      "Incorruptible high-security hologram grading cards",
      "Advanced micro-text and UV-security structures",
      "Deeply analytical fluorescence mapping metrics"
    ]
  }
];

export default function CertificationPage() {
  const [reportNumber, setReportNumber] = useState("");
  const [searchState, setSearchState] = useState("idle"); // idle, loading, success, error
  const [mockResult, setMockResult] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!reportNumber.trim()) return;

    setSearchState("loading");
    
    // Simulate API request to verification database
    setTimeout(() => {
      if (reportNumber.length < 5) {
        setSearchState("error");
      } else {
        setMockResult({
          reportNumber: reportNumber.toUpperCase().replace(/\s/g, ""),
          type: "Natural Diamond",
          shape: "Round Brilliant",
          carat: "1.74 ct",
          color: "D",
          clarity: "FL (Flawless)",
          cut: "Excellent",
          polish: "Excellent",
          symmetry: "Excellent",
          fluorescence: "None",
          date: "October 14, 2025"
        });
        setSearchState("success");
      }
    }, 1200);
  };

  return (
    <Layout>
      <div className="w-full bg-[#FAFAFA] text-[#121212] font-secondary selection:bg-[#121212]/10 selection:text-[#121212] overflow-x-hidden">
        
        {/* ==================================================
            SECTION 1: HERO HEADER (Spacious & Refined)
            ================================================== */}
        <section className="relative py-20 sm:py-28 lg:py-36 px-6 sm:px-12 lg:px-20 max-w-[1600px] mx-auto border-b border-neutral-100">
          <div className="max-w-4xl text-left space-y-6">
            <AnimateOnScroll direction="up" delay={100}>
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1px] bg-neutral-900/30" />
                <span className="text-[10px] font-sans font-bold tracking-[0.35em] text-neutral-400 uppercase">
                  Authenticity &amp; Trust
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-[#121212] tracking-wide leading-[1.15] mt-4">
                Gemological Certification
              </h1>
              <div className="w-16 h-[1px] bg-neutral-900/10 my-8" />
              <p className="text-neutral-600 font-secondary font-light text-sm sm:text-base leading-relaxed max-w-2xl">
                Every diamond selected by dn Diamonds holds certified credentials from the world&apos;s leading independent grading authorities, guaranteeing absolute truth in cut, color, clarity, and provenance.
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ==================================================
            SECTION 2: INTERACTIVE GIA REPORT CHECKER (Minimal luxury)
            ================================================== */}
        <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-20 max-w-[1600px] mx-auto border-b border-neutral-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left side: Form input & Info */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <AnimateOnScroll direction="up" delay={100}>
                <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-neutral-400 uppercase block">
                  Verification Console
                </span>
                <h2 className="text-3xl font-serif font-light text-neutral-950 tracking-wide mt-2">
                  GIA Report Checker
                </h2>
                <p className="text-neutral-500 font-secondary font-light text-sm leading-relaxed mt-4">
                  Enter your Gemological Institute of America (GIA) certificate number below to query our simulated database and view detailed verification specifications.
                </p>

                {/* Search Form */}
                <form onSubmit={handleVerify} className="mt-8 space-y-4 max-w-md">
                  <div className="relative border border-neutral-200 hover:border-neutral-950 focus-within:border-neutral-950 rounded-sm bg-white transition-all duration-300">
                    <input
                      type="text"
                      placeholder="e.g. GIA 214589632"
                      value={reportNumber}
                      onChange={(e) => setReportNumber(e.target.value)}
                      className="w-full bg-transparent px-5 py-4 pl-12 pr-28 text-sm text-neutral-900 placeholder-neutral-300 focus:outline-none"
                    />
                    <FaSearch className="absolute left-4 top-4.5 text-neutral-300 text-sm" />
                    <button
                      type="submit"
                      disabled={searchState === "loading"}
                      className="absolute right-2 top-2 px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xs transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {searchState === "loading" ? "Searching..." : "Verify"}
                    </button>
                  </div>
                </form>

                {/* Status displays */}
                {searchState === "loading" && (
                  <div className="flex items-center gap-3 pt-6 text-neutral-500">
                    <div className="w-4 h-4 border border-neutral-900/10 border-t-neutral-900 rounded-full animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Querying Global Laboratories...</span>
                  </div>
                )}

                {searchState === "error" && (
                  <div className="pt-6 text-left space-y-2">
                    <span className="text-red-500 text-xs font-semibold uppercase tracking-wider block">No Matching Dossier Found</span>
                    <p className="text-neutral-500 text-xs font-light max-w-sm">
                      Please enter a valid report number containing 5 or more characters to match our simulated database.
                    </p>
                  </div>
                )}
              </AnimateOnScroll>
            </div>

            {/* Right side: Elegant physical GIA certificate mockup card */}
            <div className="lg:col-span-7 w-full">
              <AnimateOnScroll direction="up" delay={200}>
                {searchState === "success" && mockResult ? (
                  /* GIA Result Card - Luxury layout */
                  <div className="border border-neutral-200/80 rounded-sm bg-white p-6 sm:p-10 text-left shadow-lg relative overflow-hidden animate-fade-in">
                    
                    {/* Top Watermark Diamond */}
                    <div className="absolute top-0 right-0 w-28 h-28 bg-[#FAFAFA] rounded-bl-full flex items-center justify-center pointer-events-none">
                      <FaGem className="text-neutral-100 text-2xl transform translate-x-4 -translate-y-4" />
                    </div>

                    {/* Report Header */}
                    <div className="border-b border-neutral-150 pb-5 flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-sans font-bold tracking-[0.25em] uppercase text-neutral-400">Official Dossier Validation</span>
                        <h3 className="font-serif text-2xl font-light text-neutral-950 mt-1">GIA Diamond Grading Report</h3>
                      </div>
                      <button 
                        onClick={() => window.print()}
                        className="p-2.5 border border-neutral-150 hover:border-neutral-950 hover:bg-neutral-50 rounded-sm text-neutral-400 hover:text-neutral-950 transition-all duration-300 cursor-pointer"
                        title="Print Certificate"
                      >
                        <FaPrint size={13} />
                      </button>
                    </div>

                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-xs py-6 border-b border-neutral-100">
                      <div>
                        <span className="text-neutral-400 uppercase tracking-widest text-[8px] font-bold block">GIA Report Number</span>
                        <span className="font-mono text-sm font-semibold text-neutral-900 mt-1 block">{mockResult.reportNumber}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 uppercase tracking-widest text-[8px] font-bold block">Date of Issue</span>
                        <span className="text-sm font-medium text-neutral-900 mt-1 block">{mockResult.date}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 uppercase tracking-widest text-[8px] font-bold block">Shape &amp; Cutting Style</span>
                        <span className="text-sm font-medium text-neutral-900 mt-1 block">{mockResult.shape}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 uppercase tracking-widest text-[8px] font-bold block">Carat Weight</span>
                        <span className="text-sm font-semibold text-neutral-900 mt-1 block font-mono">{mockResult.carat}</span>
                      </div>
                    </div>

                    {/* Grading Results Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                      <div className="p-3.5 bg-[#FAF9F6] rounded-xs border border-neutral-200/50">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">Color Grade</span>
                        <span className="text-base font-serif font-light text-neutral-950 mt-1 block">{mockResult.color}</span>
                      </div>
                      <div className="p-3.5 bg-[#FAF9F6] rounded-xs border border-neutral-200/50">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">Clarity Grade</span>
                        <span className="text-base font-serif font-light text-neutral-950 mt-1 block">{mockResult.clarity}</span>
                      </div>
                      <div className="p-3.5 bg-[#FAF9F6] rounded-xs border border-neutral-200/50">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">Cut Grade</span>
                        <span className="text-base font-serif font-light text-neutral-950 mt-1 block">{mockResult.cut}</span>
                      </div>
                      <div className="p-3.5 bg-[#FAF9F6] rounded-xs border border-neutral-200/50">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">Fluorescence</span>
                        <span className="text-base font-serif font-light text-neutral-950 mt-1 block">{mockResult.fluorescence}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Placeholder when no search has run */
                  <div className="border border-dashed border-neutral-300 rounded-sm aspect-[16/10] sm:aspect-[16/11] lg:aspect-[4/3] flex flex-col items-center justify-center text-center p-8 bg-white/50">
                    <FaCertificate className="text-neutral-300 text-4xl mb-4 animate-pulse" />
                    <h3 className="font-serif text-lg font-light text-neutral-400">Verification Dossier Display</h3>
                    <p className="text-neutral-400 text-xs max-w-xs mt-2 font-secondary">
                      The GIA diamond dossier details will display here once verified. Try searching for a sample number (e.g. 21458).
                    </p>
                  </div>
                )}
              </AnimateOnScroll>
            </div>
            
          </div>
        </section>

        {/* ==================================================
            SECTION 3: LABORATORY DIRECTORY (Minimal light grid)
            ================================================== */}
        <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-20 max-w-[1600px] mx-auto border-b border-neutral-100">
          <div className="text-left max-w-3xl space-y-4 mb-16 sm:mb-24">
            <AnimateOnScroll direction="up" delay={100}>
              <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-neutral-400 uppercase">
                Independent Verification
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#121212] tracking-wide mt-3">
                Laboratory Authorities
              </h2>
              <div className="w-16 h-[1px] bg-neutral-900/10 my-6" />
              <p className="text-neutral-600 font-secondary font-light text-sm sm:text-base leading-relaxed">
                We guarantee absolute transparency. dn Diamonds does not self-grade; all gemstones are dispatched to independent global gemological authorities to undergo rigorous physical testing before setting.
              </p>
            </AnimateOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {LABS.map((lab, idx) => (
              <AnimateOnScroll key={lab.name} direction="up" delay={100 + idx * 100} duration={800}>
                <div className="bg-white border border-neutral-200 rounded-sm p-8 shadow-xs flex flex-col justify-between h-full hover:shadow-lg hover:border-neutral-950 transition-all duration-500 text-left group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                      <h3 className="font-serif text-2xl text-neutral-950 font-light uppercase tracking-wide group-hover:text-rose-950 transition-colors">
                        {lab.name}
                      </h3>
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest bg-[#F8F9FA] border border-neutral-150 px-2.5 py-1 rounded-sm">
                        {lab.badge}
                      </span>
                    </div>
                    <h4 className="text-[10px] font-bold text-neutral-800 tracking-wider uppercase font-sans">{lab.title}</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed font-light">
                      {lab.desc}
                    </p>
                    <ul className="text-[10px] text-[#121212] space-y-2 pt-4 border-t border-neutral-100">
                      {lab.points.map((pt, pidx) => (
                        <li key={pidx} className="flex items-center gap-2.5">
                          <span className="h-1 w-1 bg-neutral-900 rounded-full shrink-0"></span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-neutral-100 text-[9px] font-mono text-neutral-400 flex justify-between items-center mt-8">
                    <span>EST. {lab.established}</span>
                    <span>{lab.location}</span>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </section>

        {/* ==================================================
            SECTION 4: ETHICAL ORIGIN & COMPLIANCE
            ================================================== */}
        <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-20 max-w-[1600px] mx-auto border-b border-neutral-100">
          <AnimateOnScroll direction="up" delay={150}>
            <div className="bg-neutral-950 text-white rounded-sm p-8 sm:p-12 md:p-16 shadow-lg text-left flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
              <div className="space-y-4 max-w-3xl">
                <span className="text-[9px] font-bold tracking-[0.25em] text-neutral-400 uppercase block">
                  Ethical Sourcing &amp; Compliance
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif font-light tracking-wide text-white leading-tight">
                  Kimberley Process (KPCS) <br />
                  <span className="italic">&amp; Responsible Sourcing</span>
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed">
                  Beyond individual laboratory grading certificates, every diamond sourced by dn Diamonds adheres strictly to the United Nations-backed Kimberley Process Certification Scheme (KPCS). We guarantee zero conflict origin, ethical fair-labor mining practices, and transparent chain-of-custody documentation. We hallmark all mountings with 100% recycled 18K gold and platinum certifications.
                </p>
              </div>
              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
                <span className="px-5 py-3.5 bg-white/5 border border-white/10 rounded-sm text-[10px] font-bold tracking-widest uppercase text-neutral-200 text-center">
                  ✓ 100% Conflict-Free
                </span>
                <span className="px-5 py-3.5 bg-white/5 border border-white/10 rounded-sm text-[10px] font-bold tracking-widest uppercase text-neutral-200 text-center">
                  ✓ RJC Certified Sourcing
                </span>
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* ==================================================
            SECTION 5: SHOWROOM CONSULTATION CTA (Elegant Minimal)
            ================================================== */}
        <section className="bg-white py-24 sm:py-36 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto px-6 space-y-6 sm:space-y-8">
            <AnimateOnScroll direction="up" delay={100}>
              <span className="text-[10px] font-sans font-bold tracking-[0.35em] text-neutral-400 uppercase block">
                Atelier Services
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-neutral-950 leading-tight mt-3">
                Review Certificates in Person
              </h2>
              <div className="w-16 h-[1px] bg-neutral-900/10 mx-auto my-6" />
              <p className="text-neutral-500 font-secondary font-light text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                Schedule a consultation at our Central flagship showroom to inspect GIA laser inscriptions under microscopic zoom and review grading certificates before finalizing your commission.
              </p>

              <div className="pt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full max-w-md sm:max-w-none mx-auto">
                <Link href="/contact" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-10 py-4 bg-neutral-950 text-white border border-neutral-950 text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-900 transition-colors cursor-pointer focus:outline-none rounded-sm shadow-md active:scale-98 text-center">
                    Reserve Private Consultation
                  </button>
                </Link>
                <Link href="/bespoke" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-10 py-4 border border-neutral-900 bg-transparent text-neutral-950 text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-950 hover:text-white transition-colors cursor-pointer focus:outline-none rounded-sm active:scale-98 text-center">
                    Explore Bespoke Custom
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
