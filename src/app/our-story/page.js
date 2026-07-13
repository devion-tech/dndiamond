"use client";

import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { FaChevronRight, FaQuoteLeft, FaCrown, FaHistory, FaGem } from "react-icons/fa";

// Brand Milestones Data
const MILESTONES = [
    {
        year: "2006",
        title: "Atelier Origins",
        location: "Antwerp, Belgium",
        desc: "Founded in the historic diamond district of Antwerp. Our initial workshop served an exclusive circle of private collectors, focusing strictly on hand-forged platinum settings and rare-cut diamond settings."
    },
    {
        year: "2012",
        title: "Strict Provenance & GIA Integration",
        location: "Geneva, Switzerland",
        desc: "Pioneered a strict sourcing protocol. Partnered directly with major GIA laboratories and registered mines to certify conflict-free diamonds through the Kimberley Process, tracking every stone from rough to cut."
    },
    {
        year: "2018",
        title: "Central Flagship Showroom",
        location: "Central, Hong Kong",
        desc: "Opened our flagship salon in Central, Hong Kong. Merging traditional European bench-crafting methods with the vibrant, fast-growing bespoke market of East Asia's elite."
    },
    {
        year: "2023",
        title: "Atelier Expansion & Carbon Neutrality",
        location: "New York & Paris",
        desc: "Expanded consulting salons to Manhattan and Place Vendôme. DN Diamond integrated carbon-neutral supply tracking, validating sustainable practices across all setting procedures."
    },
    {
        year: "2026",
        title: "Atelier Digitized Future",
        location: "Hong Kong Atelier",
        desc: "Pioneering interactive luxury customization. Blending master craftsmanship with gouache CAD technology, allowing clients to see structural optical physics of stones in real-time."
    }
];

export default function OurStoryPage() {
    const [gsapLoaded, setGsapLoaded] = useState(false);
    
    // Refs for animations
    const gsapRef = useRef(null);
    const scrollTriggerRef = useRef(null);
    
    const heroContentRef = useRef(null);
    const visionSectionRef = useRef(null);
    const philosophySectionRef = useRef(null);
    const timelineRef = useRef(null);
    const ctaRef = useRef(null);

    // Dynamic GSAP Loader for SSR Safety in Next.js
    useEffect(() => {
        const loadGSAP = async () => {
            try {
                const { gsap } = await import("gsap");
                const { ScrollTrigger } = await import("gsap/ScrollTrigger");
                
                gsap.registerPlugin(ScrollTrigger);
                gsapRef.current = gsap;
                scrollTriggerRef.current = ScrollTrigger;
                setGsapLoaded(true);
            } catch (error) {
                console.error("Failed to load GSAP in Our Story Page", error);
            }
        };
        loadGSAP();
    }, []);

    // Animate page elements on mount/gsap load
    useEffect(() => {
        if (!gsapLoaded) return;
        
        const gsap = gsapRef.current;
        const ScrollTrigger = scrollTriggerRef.current;
        
        const ctx = gsap.context(() => {
            // Hero fade up
            if (heroContentRef.current) {
                gsap.fromTo(Array.from(heroContentRef.current.children),
                    { opacity: 0, y: 35 },
                    { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
                );
            }

            // Vision split panels reveal
            if (visionSectionRef.current) {
                const els = visionSectionRef.current.querySelectorAll("[data-anim]");
                gsap.fromTo(els,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: "power3.out",
                        scrollTrigger: { trigger: visionSectionRef.current, start: "top 80%", once: true }
                    }
                );
            }

            // Philosophy quote reveal
            if (philosophySectionRef.current) {
                const quote = philosophySectionRef.current.querySelector(".js-quote");
                const author = philosophySectionRef.current.querySelector(".js-author");
                
                gsap.fromTo([quote, author],
                    { opacity: 0, y: 25 },
                    {
                        opacity: 1, y: 0, duration: 1.0, stagger: 0.2, ease: "power2.out",
                        scrollTrigger: { trigger: philosophySectionRef.current, start: "top 85%", once: true }
                    }
                );
            }

            // Vertical Timeline Cards Scroll Reveal
            if (timelineRef.current) {
                const timelineCards = timelineRef.current.querySelectorAll(".js-timeline-item");
                timelineCards.forEach((card, idx) => {
                    const direction = idx % 2 === 0 ? -40 : 40;
                    gsap.fromTo(card,
                        { opacity: 0, x: direction, scale: 0.95 },
                        {
                            opacity: 1, x: 0, scale: 1, duration: 0.9, ease: "power3.out",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 85%",
                                once: true
                            }
                        }
                    );
                });
            }

            // Final CTA fade up
            if (ctaRef.current) {
                const ctaContent = ctaRef.current.querySelector(".js-cta-content");
                gsap.fromTo(Array.from(ctaContent.children),
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out",
                        scrollTrigger: { trigger: ctaRef.current, start: "top 80%", once: true }
                    }
                );
            }
        });

        return () => ctx.revert();
    }, [gsapLoaded]);

    const handleScrollToHistory = () => {
        const target = document.getElementById("brand-history");
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <Layout>
            <div className="w-full bg-[#FAF9F6] text-[#111111] font-sans selection:bg-neutral-900/10 selection:text-[#111111] overflow-x-hidden font-light">
                
                {/* HERO SECTION */}
                <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-start bg-black text-white">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1920"
                            alt="Luxury GIA Diamond Facet Details"
                            className="w-full h-full object-cover brightness-[0.3] scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
                    </div>

                    <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
                        <div ref={heroContentRef} className="max-w-3xl text-left space-y-6">
                            <span className="inline-block text-[11px] font-bold tracking-[0.35em] text-neutral-400 uppercase opacity-0">
                                OUR HERITAGE
                            </span>
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-white tracking-wide leading-[1.1] opacity-0">
                                A Legacy Forged<br />in Brilliance.
                            </h1>
                            <div className="w-16 h-[1px] bg-neutral-500 opacity-0" />
                            <p className="text-neutral-300 font-sans font-light text-sm sm:text-base leading-relaxed max-w-xl opacity-0">
                                Drawing inspiration from classical proportions and the natural physics of light. Explore the timeline of how a small studio of Antwerp goldsmiths grew to craft GIA masterpieces for the world's most discerning collectors.
                            </p>
                            <div className="pt-2 opacity-0">
                                <button
                                    onClick={handleScrollToHistory}
                                    className="group relative overflow-hidden px-8 py-3.5 bg-white border border-white text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 cursor-pointer focus:outline-none"
                                >
                                    <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                                        View Our Journey
                                    </span>
                                    <span className="absolute inset-0 bg-[#111111] origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 -z-0" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                        <button
                            onClick={handleScrollToHistory}
                            className="flex flex-col items-center group cursor-pointer focus:outline-none"
                            aria-label="Scroll down to history"
                        >
                            <div className="relative w-[20px] h-[32px] border border-white/20 rounded-full flex justify-center p-1 group-hover:border-white transition-colors duration-500">
                                <div className="w-[2px] h-[5px] bg-white rounded-full animate-bounce mt-1 group-hover:bg-white transition-colors duration-500" />
                            </div>
                        </button>
                    </div>
                </section>

                {/* THE BRAND VISION */}
                <section
                    id="brand-history"
                    ref={visionSectionRef}
                    className="relative py-24 sm:py-32 lg:py-40 px-6 sm:px-12 lg:px-24 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center"
                >
                    {/* Left Panel: Narrative Text */}
                    <div className="space-y-6 sm:space-y-8">
                        <span data-anim className="text-[11px] font-bold tracking-[0.3em] text-neutral-500 uppercase block">
                            THE GENESIS
                        </span>
                        <h2 data-anim className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-[#111111] leading-tight">
                            The Quest For The Perfect Cut
                        </h2>
                        <div data-anim className="w-16 h-[1px] bg-neutral-800" />
                        <p data-anim className="text-neutral-700 font-sans font-light text-sm sm:text-base leading-relaxed">
                            DN Diamond was born from a singular obsession: to liberate the maximum fire hidden within the diamond crystalline structure. Standard commercial cuts prioritize carat weight over light returns; we set out to do the exact opposite. 
                        </p>
                        <p data-anim className="text-neutral-600 font-sans font-light text-sm sm:text-base leading-relaxed">
                            By selecting only conflict-free rough stones showing zero fluorescence and superb crystal purity, and setting them in custom-made, hand-forged mounts, we established a new benchmark for GIA certified diamond artistry.
                        </p>
                        <p data-anim className="text-neutral-600 font-sans font-light text-sm sm:text-base leading-relaxed">
                            Today, from our primary atelier in Central, Hong Kong to our consulting salons in Europe and North America, every piece is sculpted specifically to hold the exact gemstone it cradles.
                        </p>
                    </div>

                    {/* Right Panel: Immersive Collage */}
                    <div data-anim className="grid grid-cols-2 gap-4 h-[400px] sm:h-[550px] lg:h-[700px] w-full">
                        <div className="overflow-hidden rounded-xs bg-neutral-100 h-full relative group">
                            <img
                                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600"
                                alt="Atelier Diamond Setting Details"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="grid grid-rows-2 gap-4 h-full">
                            <div className="overflow-hidden rounded-xs bg-neutral-100 relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?q=80&w=600"
                                    alt="Bench Jeweller Polishing Setting"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xs bg-neutral-100 relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600"
                                    alt="Finished Diamond Custom Ring"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* THE BRAND PHILOSOPHY QUOTE PANEL (Dark Parallax Panel) */}
                <section
                    ref={philosophySectionRef}
                    className="relative bg-black text-white py-24 sm:py-32 lg:py-40 text-center px-6"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[130px] pointer-events-none" />
                    
                    <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                        <FaQuoteLeft className="text-3xl sm:text-5xl text-neutral-400 opacity-60 mx-auto animate-pulse-slow" />
                        
                        <blockquote className="js-quote text-2xl sm:text-4xl lg:text-5xl font-serif font-light tracking-wide leading-relaxed text-neutral-100 max-w-3xl mx-auto italic">
                            "A diamond has no light of its own. It is the jeweler’s sacred duty to shape the facets so they capture passing rays and turn them into fire. We do not craft jewelry; we organize light."
                        </blockquote>
                        
                        <div className="js-author w-12 h-[1px] bg-white/40 mx-auto mt-8" />
                        <span className="block text-[11px] font-bold tracking-[0.3em] text-neutral-300 uppercase">
                            DN Diamond Master Lapidary
                        </span>
                    </div>
                </section>

                {/* HISTORICAL MILESTONES TIMELINE */}
                <section ref={timelineRef} className="py-24 sm:py-32 lg:py-40 bg-white">
                    <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
                        
                        {/* Title Header */}
                        <div className="text-center space-y-4 mb-20">
                            <span className="text-[11px] font-bold tracking-[0.3em] text-neutral-500 uppercase block">
                                CHRONICLE
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-neutral-900 leading-tight">
                                Brand Milestones & Timeline
                            </h2>
                            <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm max-w-md mx-auto">
                                Trace the history of DN Diamond as we expanded our signature techniques from Antwerp to global showrooms.
                            </p>
                        </div>

                        {/* Interactive Timeline Core Layout */}
                        <div className="relative border-l border-neutral-200 ml-4 md:ml-0 md:flex md:flex-col md:items-center md:border-l-0">
                            
                            {/* Central Desktop Axis Line */}
                            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-neutral-200 hidden md:block" />

                            {MILESTONES.map((stone, idx) => {
                                const isEven = idx % 2 === 0;
                                return (
                                    <div
                                        key={stone.year}
                                        className={`js-timeline-item relative mb-16 md:mb-24 w-full md:w-1/2 flex flex-col items-start ${isEven ? "md:self-start md:items-end md:pr-16" : "md:self-end md:items-start md:pl-16"}`}
                                    >
                                        {/* Dot on Central Axis */}
                                        <div className="absolute -left-[5px] md:left-auto md:right-auto top-2 h-2.5 w-2.5 rounded-full bg-neutral-900 border-4 border-white shadow-sm ring-2 ring-neutral-900/10 z-10"
                                            style={{
                                                left: isEven ? "auto" : "-5px",
                                                right: isEven ? "-5px" : "auto"
                                            }}
                                        />

                                        {/* Card Content container */}
                                        <div className="glass-card-light rounded-xs p-6 border border-neutral-100/80 bg-white max-w-lg w-full text-left relative transition-all duration-300 hover:shadow-lg">
                                            {/* Date Banner */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-2xl sm:text-3xl font-serif font-light text-neutral-900">
                                                    {stone.year}
                                                </span>
                                                <span className="text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-neutral-400 bg-neutral-50 px-2.5 py-1 rounded-sm border border-neutral-100">
                                                    {stone.location}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-serif text-lg font-medium text-neutral-900 mb-2">
                                                {stone.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm leading-relaxed">
                                                {stone.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            
                        </div>

                    </div>
                </section>

                {/* FINAL CALL TO ACTION */}
                <section
                    ref={ctaRef}
                    className="bg-black py-24 sm:py-32 lg:py-40 text-center relative overflow-hidden"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
                    
                    <div className="relative z-10 max-w-3xl mx-auto px-6 js-cta-content space-y-6 sm:space-y-8">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
                            THE NEXT CHAPTER
                        </span>
                        <h2 className="text-4xl sm:text-6xl font-serif font-light tracking-wide text-white leading-tight">
                            Design Your Own Legacy.
                        </h2>
                        <p className="text-neutral-400 font-sans font-light text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                            Whether seeking a classic solitaire, an intricate halo configuration, or a fully custom creation, start your journey today with our master setters.
                        </p>
                        
                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="/bespoke">
                                <button className="group relative overflow-hidden px-10 py-4 bg-white border border-white text-black text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-500 cursor-pointer focus:outline-none">
                                    <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                                        Configure Bespoke
                                    </span>
                                    <span className="absolute inset-0 bg-neutral-900 origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 -z-0" />
                                </button>
                            </a>
                            <a href="/contact">
                                <button className="group relative overflow-hidden px-10 py-4 border border-white text-white text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-500 cursor-pointer focus:outline-none bg-transparent">
                                    <span className="relative z-10 group-hover:text-[#111111] transition-colors duration-500">
                                        Reserve Consultation
                                    </span>
                                    <span className="absolute inset-0 bg-white origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 -z-0" />
                                </button>
                            </a>
                        </div>
                    </div>
                </section>

            </div>
        </Layout>
    );
}
