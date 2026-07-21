"use client";

import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import {
    FaChevronDown,
    FaChevronLeft,
    FaChevronRight,
    FaGem,
    FaCrown,
    FaShieldAlt,
    FaFingerprint,
    FaGlobe,
    FaCertificate,
    FaAward,
    FaTruck,
    FaHistory,
    FaExchangeAlt
} from "react-icons/fa";

// Diamond Cut Shapes Data
const DIAMOND_SHAPES = [
    {
        name: "Round Brilliant",
        ratio: "1.00 - 1.03",
        facets: "57 or 58",
        desc: "The apex of fire and light return, mathematically designed to maximize scintillation and fire.",
        iconUrl: "/shape/Round.png"
    },
    {
        name: "Princess Cut",
        ratio: "1.00 - 1.04",
        facets: "50 to 58",
        desc: "A contemporary square cut with sharp, clean corners and brilliant faceting pattern.",
        iconUrl: "/shape/Princess.png"
    },
    {
        name: "Emerald Cut",
        ratio: "1.30 - 1.45",
        facets: "57 or 58",
        desc: "An elegant step-cut rectangular silhouette with cropped corners creating a hall-of-mirrors effect.",
        iconUrl: "/shape/Emerald.png"
    },
    {
        name: "Asscher Cut",
        ratio: "1.00 - 1.03",
        facets: "58",
        desc: "A classic octagonal step-cut shape with a high crown, deep pavilion, and concentric square pattern.",
        iconUrl: "/shape/Asscher.png"
    },
    {
        name: "Cushion Cut",
        ratio: "1.00 - 1.05",
        facets: "58",
        desc: "A romantic cushion-shaped cut with pillow-like corners, blending vintage allure with strong fire.",
        iconUrl: "/shape/Cushion.png"
    },
    {
        name: "Heart Cut",
        ratio: "0.95 - 1.02",
        facets: "59",
        desc: "The romantic symbol of love, requiring meticulous pavilion alignment for equal lobe reflection.",
        iconUrl: "/shape/Heart.png"
    },
    {
        name: "Marquise Cut",
        ratio: "1.85 - 2.10",
        facets: "56",
        desc: "An elongated boat-shape silhouette that maximizes perceived carat size and slims the hand.",
        iconUrl: "/shape/Marquise.png"
    },
    {
        name: "Oval Cut",
        ratio: "1.33 - 1.66",
        facets: "57 or 58",
        desc: "A brilliant elongated round silhouette, combining intense scintillation with an elegant visual outline.",
        iconUrl: "/shape/Oval.png"
    },
    {
        name: "Pear Cut",
        ratio: "1.45 - 1.75",
        facets: "58",
        desc: "A stunning teardrop shape that combines the brilliance of a round cut with the grace of a pointed end.",
        iconUrl: "/shape/Pear.png"
    },
    {
        name: "Radiant Cut",
        ratio: "1.15 - 1.35",
        facets: "70",
        desc: "A rectangular shape with cropped corners and brilliant faceting, offering the fire of a round brilliant in step-cut form.",
        iconUrl: "/shape/Radiant.png"
    },
    {
        name: "Trillion Cut",
        ratio: "1.00 - 1.05",
        facets: "43",
        desc: "A bold triangular shape with curved or straight sides, maximizing visual footprint and light return.",
        iconUrl: "/shape/Trillion.png"
    }
];

export default function AboutPage() {
    const [activeShapeIdx, setActiveShapeIdx] = useState(0);
    const [gsapLoaded, setGsapLoaded] = useState(false);

    // GSAP library reference refs
    const gsapRef = useRef(null);
    const scrollTriggerRef = useRef(null);

    const orbitSectionRef = useRef(null);
    const orbitTrackRef = useRef({ rotation: 0 });
    const orbitSpinRef = useRef(null);
    const orbitTrackValRef = useRef(null);
    const updateOrbitFnRef = useRef(null);



    // Dynamic GSAP Loader for SSR safety
    useEffect(() => {
        let ctx;
        const loadGSAP = async () => {
            try {
                const { gsap } = await import("gsap");
                const { ScrollTrigger } = await import("gsap/ScrollTrigger");

                gsap.registerPlugin(ScrollTrigger);
                gsapRef.current = gsap;
                scrollTriggerRef.current = ScrollTrigger;

                setGsapLoaded(true);
            } catch (error) {
                console.error("Failed to dynamically load GSAP plugins", error);
            }
        };
        loadGSAP();

        return () => {
            if (ctx) ctx.revert();
        };
    }, []);

    const handleShapeClick = (idx) => {
        const gsap = gsapRef.current;
        if (!gsap) return;

        // Pause continuous auto spin
        if (orbitSpinRef.current) {
            orbitSpinRef.current.pause();
        }

        const currentRot = orbitTrackValRef.current.rotation;
        // Compute closest target angle to bring item idx to -90 degrees (12 o'clock top position)
        const targetRot = -90 - (idx * 360) / DIAMOND_SHAPES.length;

        // Closest angle path math
        const diff = ((((targetRot - currentRot) % 360) + 540) % 360) - 180;
        const finalTargetRot = currentRot + diff;

        // Tween track to position
        gsap.killTweensOf(orbitTrackValRef.current);
        gsap.to(orbitTrackValRef.current, {
            rotation: finalTargetRot,
            duration: 1.4,
            ease: "power3.out",
            onUpdate: updateOrbitFnRef.current,
            onComplete: () => {
                // Resume slow auto spin after 7 seconds of inactivity
                setTimeout(() => {
                    if (orbitSpinRef.current && orbitTrackValRef.current) {
                        gsap.killTweensOf(orbitTrackValRef.current);
                        const curVal = orbitTrackValRef.current.rotation;
                        orbitSpinRef.current = gsap.to(orbitTrackValRef.current, {
                            rotation: curVal + 360,
                            duration: 80,
                            repeat: -1,
                            ease: "none",
                            onUpdate: updateOrbitFnRef.current
                        });
                    }
                }, 7000);
            }
        });

        // Transition information details
        selectShape(idx);
    };

    const selectShape = (idx) => {
        const gsap = gsapRef.current;
        if (!gsap) return;
        if (idx === activeShapeIdx) return;

        const detailsEl = document.querySelector(".js-shape-details");
        if (detailsEl) {
            gsap.to(detailsEl, {
                opacity: 0,
                y: 20,
                duration: 0.35,
                onComplete: () => {
                    setActiveShapeIdx(idx);
                    gsap.fromTo(detailsEl,
                        { opacity: 0, y: -20 },
                        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
                    );
                }
            });
        } else {
            setActiveShapeIdx(idx);
        }
    };

    useEffect(() => {
        if (!gsapLoaded) return;

        const gsap = gsapRef.current;
        const ScrollTrigger = scrollTriggerRef.current;

        const ctx = gsap.context(() => {
            const heroContent = document.querySelector(".js-about-hero-content");
            if (heroContent) {
                gsap.fromTo(Array.from(heroContent.children),
                    { opacity: 0, y: 35 },
                    { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.25 }
                );
            }

            // Diamond Cuts Orbit Animation (Slow continuous rotation)
            const orbitTrack = orbitTrackRef.current;
            const orbitItems = document.querySelectorAll(".js-orbit-item");

            const updateOrbit = () => {
                const radius = window.innerWidth < 640 ? 110 : window.innerWidth < 1024 ? 170 : 230;
                orbitItems.forEach((item, idx) => {
                    const angle = (idx * 2 * Math.PI) / DIAMOND_SHAPES.length + (orbitTrack.rotation * Math.PI) / 180;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    gsap.set(item, {
                        x: x,
                        y: y,
                        rotation: (angle * 180) / Math.PI + 90
                    });
                });
            };

            // Initial render
            updateOrbit();

            window.addEventListener("resize", updateOrbit);
            return () => {
                window.removeEventListener("resize", updateOrbit);
            };

            // Auto spin setup
            const autoSpin = gsap.to(orbitTrack, {
                rotation: 360,
                duration: 80,
                repeat: -1,
                ease: "none",
                onUpdate: updateOrbit
            });

            orbitSpinRef.current = autoSpin;
            orbitTrackValRef.current = orbitTrack;
            updateOrbitFnRef.current = updateOrbit;

            // Pause auto-rotation on hover
            const orbitContainer = document.querySelector(".js-orbit-container");
            if (orbitContainer) {
                orbitContainer.addEventListener("mouseenter", () => autoSpin.pause());
                orbitContainer.addEventListener("mouseleave", () => {
                    if (!gsap.isTweening(orbitTrack)) {
                        autoSpin.play();
                    }
                });
            }



            // Section 8 (Final CTA) Content reveal
            const ctaContent = document.querySelector(".js-cta-content");
            if (ctaContent) {
                gsap.fromTo(Array.from(ctaContent.children),
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.15,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: ctaContent,
                            start: "top 80%",
                            once: true
                        }
                    }
                );
            }
        });

        return () => {
            ctx.revert();
        };
    }, [gsapLoaded]);

    return (
        <Layout>
            <div className="w-full font-sans  overflow-x-hidden">
                {/* ==================================================
                    SECTION 1: EDITORIAL MINIMALIST HERO (Discover World's Best Jewelry)
                    ================================================== */}
                <section className="relative w-full pt-16 pb-20 sm:pt-24 sm:pb-28">
                    <div className="container mx-auto px-6 sm:px-12 lg:px-24 flex flex-col items-center">

                        {/* Title Header with inline oval image */}
                        <div className="w-full text-center space-y-4 js-about-hero-content">
                            <h1 className="text-3xl sm:text-6xl lg:text-[80px]  font-light text-neutral-900 tracking-[0.05em] leading-none uppercase flex flex-wrap justify-center items-center">
                                <span>DISC</span>
                                <span className="inline-flex w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden align-middle border border-neutral-300 mx-2  transform translate-y-[-2px] sm:translate-y-[2px]">
                                    <img
                                        src="/about/diamond-ring-isolated-black-background-3d-render.jpg"
                                        className="w-full h-full object-cover rounded-xl"
                                        alt="Discover"
                                    />
                                </span>
                                <span>VER</span>
                            </h1>
                            <h1 className="text-4xl sm:text-7xl lg:text-[90px] font-light text-neutral-900 tracking-[0.05em] leading-none uppercase">
                                WORLD&apos;S BEST
                            </h1>
                            <h1 className="text-4xl sm:text-7xl lg:text-[90px] font-light text-neutral-900 tracking-[0.05em] leading-none uppercase">
                                JEWELRY*
                            </h1>
                        </div>

                        {/* Image Layout Grid (Left, Middle Portrait, Right with spin badge and horizontal image) */}
                        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-10 items-center mt-12 sm:mt-20">

                            {/* Left Column: Square profile image & Shop Now pill button */}
                            <div className="col-span-1 md:col-span-3 flex flex-col items-center md:items-start space-y-6">
                                <div className="relative group overflow-hidden  w-full aspect-square max-w-[240px] bg-neutral-100 shadow-sm">
                                    <span className="absolute top-3 left-3 text-[10px] font-mono text-neutral-500 z-10 font-medium">/01</span>
                                    <img
                                        src="/about/close-up-brunette-woman-hand-pushing-her-hair-back-her-ear-baring-silver-earring.jpg"
                                        alt="Earrings close-up"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-xl"
                                    />
                                </div>
                                <a href="/jewelry" className="inline-block">
                                    <button className="px-6 py-2 border border-neutral-800 rounded-xl text-xs font-semibold uppercase tracking-widest text-neutral-800 hover:bg-neutral-800 hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer bg-transparent">
                                        Shop Now <span className="text-sm">→</span>
                                    </button>
                                </a>
                            </div>

                            {/* Middle Column: Dominant Portrait Necklaces Image */}
                            <div className="col-span-1 md:col-span-6 flex justify-center">
                                <div className="relative group overflow-hidden  w-full aspect-[3/4] max-w-[380px] bg-neutral-100 shadow-sm">
                                    <img
                                        src="/about/retro-style-portrait-young-woman-dark-background.jpg"
                                        alt="Dainty gold necklaces display"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Spinning Badge & Rectangular image */}
                            <div className="col-span-1 md:col-span-3 flex flex-col items-center md:items-end space-y-12">

                                {/* Rotating circular text stamp */}
                                <div className="relative w-28 h-28 flex items-center justify-center">
                                    <svg className="w-full h-full animate-[spin_16s_linear_infinite]" viewBox="0 0 100 100">
                                        <path id="circleTextPath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                                        <text className="fill-neutral-800 text-[8px] tracking-[0.14em] font-sans uppercase font-semibold">
                                            <textPath href="#circleTextPath" startOffset="0%">
                                                Fashion Brand • Fashion Brand •
                                            </textPath>
                                        </text>
                                    </svg>
                                    <div className="absolute w-2 h-2 bg-neutral-900 rounded-full" />
                                </div>

                                {/* Small horizontal close-up image */}
                                <div className="relative group overflow-hidden  w-full aspect-[16/10] max-w-[240px] bg-neutral-100 shadow-sm">
                                    <img
                                        src="/about/luxury-white-gold-diamond-necklace-dark-background.jpg"
                                        alt="Gold ring and necklace details close-up"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-xl"
                                    />
                                </div>

                            </div>

                        </div>

                        {/* About Us section content */}
                        <div className="w-full max-w-2xl text-center mt-20 sm:mt-28 space-y-6">
                            <h2 className="text-xl sm:text-2xl  tracking-[0.25em] text-neutral-800 uppercase">
                                About Us
                            </h2>
                            <p className="text-neutral-600 font-sans font-light text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                                DN Diamond designs modern, unisex jewellery pieces that are handcrafted from recycled precious metals. In an industry that&apos;s focused on trends, we believe in timelessness.
                            </p>
                        </div>

                    </div>
                </section>


                {/* ==================================================
                    SECTION 3.5: THE GEOMETRY OF LIGHT (Signature Cuts Circular Orbit Carousel)
                    ================================================== */}
                <section
                    ref={orbitSectionRef}
                    className="py-24 sm:py-32 bg-[#FAF9F6] relative border-t border-neutral-200 overflow-hidden"
                >
                    <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        {/* Left Column: Interactive Circular Orbit Widget */}
                        <div className="lg:col-span-7 flex justify-center items-center h-[420px] sm:h-[600px] relative">
                            {/* Circular Track Line */}
                            <div className="js-orbit-container w-[220px] h-[220px] sm:w-[340px] sm:h-[340px] lg:w-[460px] lg:h-[460px] rounded-full border border-neutral-300 border-dashed relative flex items-center justify-center">

                                {/* Central Details Frame */}
                                <div className="absolute w-[120px] h-[120px] sm:w-[190px] sm:h-[190px] rounded-full bg-[#FAF9F6] border border-neutral-300 flex flex-col items-center justify-center p-4 shadow-inner z-10">
                                    <div className="w-12 h-12 sm:w-20 sm:h-20 text-neutral-800 transition-all duration-300 hover:scale-105 flex items-center justify-center">
                                        <img
                                            src={DIAMOND_SHAPES[activeShapeIdx].iconUrl}
                                            alt={DIAMOND_SHAPES[activeShapeIdx].name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-neutral-800 uppercase mt-2 text-center max-w-[100px] sm:max-w-none">
                                        {DIAMOND_SHAPES[activeShapeIdx].name}
                                    </span>
                                </div>

                                {/* Floating Orbit Cards */}
                                {DIAMOND_SHAPES.map((shape, idx) => {
                                    const isActive = idx === activeShapeIdx;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleShapeClick(idx)}
                                            className={`js-orbit-item absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white border flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none ${isActive
                                                ? "border-neutral-900 shadow-md scale-110 ring-4 ring-neutral-900/10 z-20"
                                                : "border-neutral-200 opacity-75 hover:opacity-100 hover:border-neutral-400 z-10"
                                                }`}
                                            aria-label={`Show details of ${shape.name}`}
                                        >
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                                                <img
                                                    src={shape.iconUrl}
                                                    alt={shape.name}
                                                    className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                                                />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Right Column: Editorial Detailed Information Text */}
                        <div className="lg:col-span-5 text-left space-y-6 sm:space-y-8 js-shape-details">
                            <span className="text-[11px] font-bold tracking-[0.3em] text-neutral-500 uppercase block">
                                THE GEOMETRY OF LIGHT
                            </span>
                            <div className="space-y-4">
                                <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-[#111111] leading-tight">
                                    {DIAMOND_SHAPES[activeShapeIdx].name}
                                </h2>
                                <div className="w-16 h-[1px] bg-neutral-800" />
                            </div>
                            {/* Facet & Ratio Specs */}
                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-black/5">
                                <div>
                                    <span className="text-xs font-sans text-neutral-400 uppercase tracking-widest block">Facet Count</span>
                                    <span className="text-xl font-serif text-[#111111] mt-1 block">{DIAMOND_SHAPES[activeShapeIdx].facets} Facets</span>
                                </div>
                                <div>
                                    <span className="text-xs font-sans text-neutral-400 uppercase tracking-widest block">Classic L/W Ratio</span>
                                    <span className="text-xl font-serif text-[#111111] mt-1 block">{DIAMOND_SHAPES[activeShapeIdx].ratio}</span>
                                </div>
                            </div>
                            <p className="text-neutral-700 font-sans font-light text-sm sm:text-base leading-relaxed">
                                {DIAMOND_SHAPES[activeShapeIdx].desc}
                            </p>
                            <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm leading-relaxed">
                                Our master lapidaries select cut dimensions that yield the ultimate light dispersion, capturing and refracting light in deep volumetric facets built for maximum dispersion.
                            </p>
                        </div>
                    </div>
                </section>





                {/* ==================================================
                    SECTION: OUR PROMISE
                    ================================================== */}
                <section className="py-20 sm:py-28 bg-[#FAF9F6] border-t border-neutral-200 text-center">
                    <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16 space-y-12">
                        <div className="max-w-2xl mx-auto space-y-4">
                            <AnimateOnScroll direction="up" delay={100}>
                                <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-neutral-900">
                                    Our Promise
                                </h2>
                                <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm leading-relaxed mt-4">
                                    At DN Diamond, we&apos;re committed to sustainable luxury and transparent craftsmanship. Every diamond jewellery piece reflects our dedication to quality, ethics, and customer satisfaction.
                                </p>
                            </AnimateOnScroll>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 pt-6">
                            {/* Promise 1 */}
                            <AnimateOnScroll direction="up" delay={150}>
                                <div className="flex flex-col items-center p-6 space-y-4 lg:border-r lg:border-neutral-200/50 last:border-r-0 h-full">
                                    <div className="text-neutral-800 text-3xl mb-1">
                                        <FaCertificate />
                                    </div>
                                    <span className="text-xs sm:text-sm font-serif font-light text-neutral-900 uppercase tracking-wider text-center max-w-[200px]">
                                        Certified Diamond Jewellery
                                    </span>
                                </div>
                            </AnimateOnScroll>

                            {/* Promise 2 */}
                            <AnimateOnScroll direction="up" delay={250}>
                                <div className="flex flex-col items-center p-6 space-y-4 lg:border-r lg:border-neutral-200/50 last:border-r-0 h-full">
                                    <div className="text-neutral-800 text-3xl mb-1">
                                        <FaTruck />
                                    </div>
                                    <span className="text-xs sm:text-sm font-serif font-light text-neutral-900 uppercase tracking-wider text-center max-w-[200px]">
                                        Free Shipping with Insurance
                                    </span>
                                </div>
                            </AnimateOnScroll>

                            {/* Promise 3 */}
                            <AnimateOnScroll direction="up" delay={350}>
                                <div className="flex flex-col items-center p-6 space-y-4 lg:border-r lg:border-neutral-200/50 last:border-r-0 h-full">
                                    <div className="text-neutral-800 text-3xl mb-1">
                                        <FaShieldAlt />
                                    </div>
                                    <span className="text-xs sm:text-sm font-serif font-light text-neutral-900 uppercase tracking-wider text-center max-w-[200px]">
                                        Lifetime Warranty
                                    </span>
                                </div>
                            </AnimateOnScroll>

                            {/* Promise 4 */}
                            <AnimateOnScroll direction="up" delay={450}>
                                <div className="flex flex-col items-center p-6 space-y-4 h-full">
                                    <div className="text-neutral-800 text-3xl mb-1">
                                        <FaGlobe />
                                    </div>
                                    <span className="text-xs sm:text-sm font-serif font-light text-neutral-900 uppercase tracking-wider text-center max-w-[200px]">
                                        Conflict-Free Sourcing
                                    </span>
                                </div>
                            </AnimateOnScroll>
                        </div>
                    </div>
                </section>



                {/* ==================================================
                    SECTION 8: FINAL CTA (Luxury Dark Section)
                    ================================================== */}
                <section className="bg-[#0B0B0B] py-24 sm:py-32 lg:py-40 text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto px-6 js-cta-content space-y-6 sm:space-y-8">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
                            THE NEXT CHAPTER
                        </span>
                        <h2 className="text-4xl sm:text-6xl font-serif font-light tracking-wide text-white leading-tight">
                            Crafting Tomorrow&apos;s Heirlooms.
                        </h2>
                        <p className="text-neutral-400 font-sans font-light text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                            Discover jewellery that reflects timeless elegance and extraordinary craftsmanship. Connect with our concierge to reserve a private atelier consultation.
                        </p>

                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="/jewelry">
                                <button className="group relative rounded-xl overflow-hidden px-10 py-4 bg-white border border-white text-black text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-500 focus:outline-none cursor-pointer">
                                    <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                                        Explore Collection
                                    </span>
                                    <span className="absolute inset-0 bg-neutral-900 origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 -z-0" />
                                </button>
                            </a>
                            <a href="/contact">
                                <button className="group relative overflow-hidden rounded-xl px-10 py-4 border border-white text-white text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-500 focus:outline-none cursor-pointer bg-transparent">
                                    <span className="relative z-10 group-hover:text-[#111111] transition-colors duration-500">
                                        Book Atelier Visit
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
