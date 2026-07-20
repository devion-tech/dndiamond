"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import Link from "next/link";
import { FaCertificate, FaGem, FaGlobe, FaShieldAlt, FaPrint, FaSearch } from "react-icons/fa";

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
  },
  {
    name: "GCAL",
    title: "Gem Certification & Assurance Lab",
    established: "2001",
    location: "New York, New York",
    badge: "Ultimate Cut Accuracy",
    desc: "Renowned for its patented GCAL 8X Cut grading, which analyzes light performance across eight optical metrics, and backing their grading with consumer cash guarantees.",
    points: [
      "Unique Gemprint® optical fingerprint scanning",
      "Physical photomicrographs of inclusions on reports",
      "360° light performance & light-leakage mapping"
    ]
  },
  {
    name: "AGS",
    title: "American Gem Society Laboratories",
    established: "1934",
    location: "Las Vegas, Nevada",
    badge: "Ideal Cut Pioneer",
    desc: "Scientific pioneers of light performance grading. Creators of the rigorous 'Ideal Cut 0' rating which mathematically models diamond scintillation and light return.",
    points: [
      "ASET light performance ray-tracing dossiers",
      "Exact leakage and angular tilt mapping",
      "Digital report integration powered by GIA"
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
    }, 1500);
  };

  return (
    <Layout>
      <div className="w-full bg-white text-neutral-900 font-sans overflow-x-hidden selection:bg-neutral-900/10 selection:text-neutral-900">
        
        {/* ==================================================
            HERO / HEADER
            ================================================== */}
        <section className="relative py-24 sm:py-32 border-b border-neutral-100 bg-neutral-50/30">
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16 text-center space-y-6">
            <AnimateOnScroll direction="up" delay={100}>
              <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.3em] text-neutral-400 uppercase">
                Authenticity &amp; Trust
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-wide text-neutral-950 mt-3 leading-tight">
                Gemological Certification
              </h1>
              <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm max-w-xl mx-auto mt-4 leading-relaxed">
                Every diamond selected by DN Diamond holds certified credentials from the world&apos;s leading independent grading authorities, guaranteeing absolute truth in cut, color, clarity, and provenance.
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ==================================================
            INTERACTIVE MOCKUP REPORT CHECKER
            ================================================== */}
        <section className="py-20 sm:py-28 border-b border-neutral-100">
          <div className="mx-auto max-w-4xl px-6">
            <AnimateOnScroll direction="up" delay={100}>
              <div className="text-center space-y-2 mb-12">
                <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase font-bold">Verification Console</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-neutral-950">GIA Report Checker</h2>
                <p className="text-neutral-500 text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed mt-2">
                  Test our simulated report look-up database. Enter a GIA certificate ID below to view verification metrics.
                </p>
              </div>

              {/* Input Form */}
              <div className="bg-neutral-50 border border-neutral-100 rounded-3xl p-6 sm:p-10 max-w-xl mx-auto shadow-xs">
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. GIA 214589632"
                      value={reportNumber}
                      onChange={(e) => setReportNumber(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-full px-6 py-4 pl-12 pr-32 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                    <FaSearch className="absolute left-5 top-5 text-neutral-400" />
                    <button
                      type="submit"
                      disabled={searchState === "loading"}
                      className="absolute right-2 top-2 px-6 py-3.5 bg-neutral-950 text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-neutral-900 transition-colors active:scale-95 disabled:opacity-50"
                    >
                      {searchState === "loading" ? "Searching..." : "Verify"}
                    </button>
                  </div>
                </form>

                {/* Database Loading State */}
                {searchState === "loading" && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-8 h-8 border-2 border-neutral-900/10 border-t-neutral-900 rounded-full animate-spin" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Querying Global Laboratories...</span>
                  </div>
                )}

                {/* Error State */}
                {searchState === "error" && (
                  <div className="text-center py-10 space-y-3">
                    <span className="text-red-500 text-sm font-medium">No report matches the entered ID.</span>
                    <p className="text-neutral-500 text-xs font-light leading-relaxed max-w-xs mx-auto">
                      Please enter a valid report number containing 5 or more characters to trigger the simulated database matching.
                    </p>
                  </div>
                )}

                {/* Success Mock Report Card */}
                {searchState === "success" && mockResult && (
                  <div className="mt-8 border border-neutral-200/80 rounded-2xl bg-white p-6 sm:p-8 space-y-6 text-left shadow-sm relative overflow-hidden animate-fade-in">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-50 rounded-bl-full flex items-center justify-center">
                      <FaGem className="text-neutral-200 text-xl transform translate-x-3 -translate-y-3" />
                    </div>

                    <div className="border-b border-neutral-100 pb-4 flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-mono uppercase text-neutral-400 font-semibold">Gemological Certificate</span>
                        <h3 className="font-serif text-lg font-medium text-neutral-950 mt-0.5">GIA Grading Dossier</h3>
                      </div>
                      <button 
                        onClick={() => window.print()}
                        className="p-2 border border-neutral-100 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                        title="Print Report"
                      >
                        <FaPrint size={12} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs border-b border-neutral-100 pb-6">
                      <div>
                        <span className="text-neutral-400 font-light block">Report Number</span>
                        <span className="font-mono font-medium text-neutral-900 mt-0.5 block">{mockResult.reportNumber}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 font-light block">Issue Date</span>
                        <span className="font-medium text-neutral-900 mt-0.5 block">{mockResult.date}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 font-light block">Species / Shape</span>
                        <span className="font-medium text-neutral-900 mt-0.5 block">{mockResult.type} / {mockResult.shape}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 font-light block">Carat Weight</span>
                        <span className="font-medium text-neutral-900 mt-0.5 block font-mono">{mockResult.carat}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                      <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100/50">
                        <span className="text-[9px] text-neutral-400 block">Color Grade</span>
                        <span className="text-sm font-serif font-semibold text-neutral-900 mt-0.5 block">{mockResult.color}</span>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100/50">
                        <span className="text-[9px] text-neutral-400 block">Clarity Grade</span>
                        <span className="text-sm font-serif font-semibold text-neutral-900 mt-0.5 block">{mockResult.clarity}</span>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100/50">
                        <span className="text-[9px] text-neutral-400 block">Cut Grade</span>
                        <span className="text-sm font-serif font-semibold text-neutral-900 mt-0.5 block">{mockResult.cut}</span>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100/50">
                        <span className="text-[9px] text-neutral-400 block">Fluorescence</span>
                        <span className="text-sm font-serif font-semibold text-neutral-900 mt-0.5 block">{mockResult.fluorescence}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ==================================================
            LABORATORY CREDENTIALS GRID
            ================================================== */}
        <section className="py-20 sm:py-28 bg-neutral-50/30">
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16 space-y-16">
            <div className="text-left max-w-3xl space-y-4">
              <AnimateOnScroll direction="up" delay={100}>
                <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.3em] text-neutral-400 uppercase">
                  Global Classrooms &amp; Testing Labs
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-wide text-neutral-950 leading-tight">
                  Independent Laboratory Verifications
                </h2>
                <div className="w-16 h-[1px] bg-neutral-800 my-4" />
                <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm leading-relaxed max-w-2xl mt-4">
                  We guarantee absolute transparency. We do not self-grade; all DN Diamond gemstones are dispatched to independent global gemological authorities to undergo rigorous physical testing before mounting.
                </p>
              </AnimateOnScroll>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {LABS.map((lab, idx) => (
                <AnimateOnScroll key={lab.name} direction="up" delay={100 + idx * 100} duration={800}>
                  <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between h-full hover:shadow-md hover:border-neutral-200/80 transition-all duration-350 text-left">
                    <div className="space-y-4 flex-1">
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                        <h3 className="font-serif text-xl text-neutral-950 font-semibold uppercase tracking-wide">
                          {lab.name}
                        </h3>
                        <span className="text-[8px] sm:text-[9px] font-bold text-neutral-500 uppercase tracking-widest bg-neutral-50 border border-neutral-100 px-2.5 py-1 rounded">
                          {lab.badge}
                        </span>
                      </div>
                      <h4 className="text-[10px] font-bold text-neutral-800 tracking-wider uppercase font-sans">{lab.title}</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed font-light font-sans">
                        {lab.desc}
                      </p>
                      <ul className="text-[10px] text-neutral-700 space-y-2 font-sans pt-3 border-t border-neutral-50">
                        {lab.points.map((pt, pidx) => (
                          <li key={pidx} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-neutral-100 text-[9px] font-mono text-neutral-400 flex justify-between items-center mt-6">
                      <span>EST. {lab.established}</span>
                      <span>{lab.location}</span>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================
            ETHICAL ORIGIN & COMPLIANCE BANNER
            ================================================== */}
        <section className="py-20 border-b border-neutral-100">
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
            <AnimateOnScroll direction="up" delay={150}>
              <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-12 shadow-lg text-left flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="space-y-4 max-w-3xl">
                  <span className="text-[9px] font-bold tracking-[0.25em] text-neutral-400 uppercase block">
                    Ethical Sourcing &amp; Compliance
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-light tracking-wide text-white">
                    Kimberley Process (KPCS) &amp; RJC Compliance
                  </h3>
                  <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed">
                    Beyond individual laboratory grading certificates, every diamond sourced by DN Diamond adheres strictly to the United Nations-backed Kimberley Process Certification Scheme (KPCS). We guarantee zero conflict origin, ethical fair-labor mining practices, and transparent chain-of-custody documentation. We hallmark all mountings with 100% recycled 18K gold and platinum certifications.
                  </p>
                </div>
                <div className="shrink-0 flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-white/10 border border-white/10 rounded-full text-[10px] font-mono tracking-wider uppercase text-neutral-200">
                    ✓ 100% Conflict-Free
                  </span>
                  <span className="px-4 py-2 bg-white/10 border border-white/10 rounded-full text-[10px] font-mono tracking-wider uppercase text-neutral-200">
                    ✓ RJC Certified Sourcing
                  </span>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ==================================================
            FINAL CTA CONCIERGE
            ================================================== */}
        <section className="py-24 sm:py-32 text-center bg-white relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto px-6 space-y-6 sm:space-y-8">
            <AnimateOnScroll direction="up" delay={100}>
              <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.3em] text-neutral-400 uppercase block">
                Atelier Services
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif font-light tracking-wide text-neutral-900 leading-tight">
                Review Certificates in Person
              </h2>
              <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm leading-relaxed max-w-xl mx-auto mt-4">
                Schedule a consultation at our Central flagship showroom to inspect GIA laser inscriptions under microscopic zoom and review grading certificates before finalizing your commission.
              </p>

            </AnimateOnScroll>
          </div>
        </section>

      </div>
    </Layout>
  );
}
