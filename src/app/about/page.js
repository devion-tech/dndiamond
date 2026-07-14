"use client";

import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
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
    FaAward
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

    const handleScrollToLegacy = () => {
        const section = document.getElementById("section-legacy");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Card Interactive 3D tilt effects
    const handleCardMouseEnter = (e) => {
        const gsap = gsapRef.current;
        if (!gsap) return;
        gsap.to(e.currentTarget, {
            y: -8,
            rotationX: 1.5,
            rotationY: -1.5,
            borderColor: "#111111",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.04)",
            duration: 0.4,
            ease: "power2.out"
        });
    };

    const handleCardMouseLeave = (e) => {
        const gsap = gsapRef.current;
        if (!gsap) return;
        gsap.to(e.currentTarget, {
            y: 0,
            rotationX: 0,
            rotationY: 0,
            borderColor: "#E5E5E5",
            boxShadow: "0 0px 0px rgba(0,0,0,0)",
            duration: 0.4,
            ease: "power2.out"
        });
    };

    // Animation Initialization Trigger
    useEffect(() => {
        if (!gsapLoaded) return;

        const gsap = gsapRef.current;
        const ScrollTrigger = scrollTriggerRef.current;

        const ctx = gsap.context(() => {
            // Animate editorial static hero on load
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
            <div className="w-full bg-[#FAF9F6] text-[#111111] font-sans selection:bg-neutral-900/10 selection:text-[#111111] overflow-x-hidden">

                {/* ==================================================
                    SECTION 1: EDITORIAL MINIMALIST HERO (Discover World's Best Jewelry)
                    ================================================== */}
                <section className="relative w-full bg-[#FAF9F6] pt-16 pb-20 sm:pt-24 sm:pb-28">
                    <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 flex flex-col items-center">

                        {/* Title Header with inline oval image */}
                        <div className="w-full text-center space-y-4 js-about-hero-content">
                            <h1 className="text-4xl sm:text-7xl lg:text-[90px] font-serif font-light text-neutral-900 tracking-[0.05em] leading-none uppercase flex flex-wrap justify-center items-center">
                                <span>DISC</span>
                                <span className="inline-flex w-17 h-17  rounded-full overflow-hidden align-middle border border-neutral-300 mx-2 sm:mx-4 transform translate-y-[-2px] sm:translate-y-[-6px]">
                                    <img
                                        src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600"
                                        className="w-full h-full object-cover"
                                        alt="Discover"
                                    />
                                </span>
                                <span>VER</span>
                            </h1>
                            <h1 className="text-4xl sm:text-7xl lg:text-[90px] font-serif font-light text-neutral-900 tracking-[0.05em] leading-none uppercase">
                                WORLD&apos;S BEST
                            </h1>
                            <h1 className="text-4xl sm:text-7xl lg:text-[90px] font-serif font-light text-neutral-900 tracking-[0.05em] leading-none uppercase">
                                JEWELRY*
                            </h1>
                        </div>

                        {/* Image Layout Grid (Left, Middle Portrait, Right with spin badge and horizontal image) */}
                        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-10 items-center mt-12 sm:mt-20">

                            {/* Left Column: Square profile image & Shop Now pill button */}
                            <div className="col-span-1 md:col-span-3 flex flex-col items-center md:items-start space-y-6">
                                <div className="relative group overflow-hidden border border-neutral-250 w-full aspect-square max-w-[240px] bg-neutral-100 shadow-sm">
                                    <span className="absolute top-3 left-3 text-[10px] font-mono text-neutral-500 z-10 font-medium">/01</span>
                                    <img
                                        src=""
                                        alt="Earrings close-up"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <a href="/jewelry" className="inline-block">
                                    <button className="px-6 py-2 border border-neutral-800 rounded-full text-xs font-semibold uppercase tracking-widest text-neutral-800 hover:bg-neutral-800 hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer bg-transparent">
                                        Shop Now <span className="text-sm">→</span>
                                    </button>
                                </a>
                            </div>

                            {/* Middle Column: Dominant Portrait Necklaces Image */}
                            <div className="col-span-1 md:col-span-6 flex justify-center">
                                <div className="relative group overflow-hidden border border-neutral-250 w-full aspect-[3/4] max-w-[380px] bg-neutral-100 shadow-sm">
                                    <img
                                        src="/products/atelier_interior.png"
                                        alt="Dainty gold necklaces display"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                                <div className="relative group overflow-hidden border border-neutral-250 w-full aspect-[16/10] max-w-[240px] bg-neutral-100 shadow-sm">
                                    <span className="absolute top-3 left-3 text-[10px] font-mono text-neutral-500 z-10 font-medium">/02</span>
                                    <img
                                        src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600"
                                        alt="Gold ring and necklace details close-up"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                            </div>

                        </div>

                        {/* About Us section content */}
                        <div className="w-full max-w-2xl text-center mt-20 sm:mt-28 space-y-6">
                            <h2 className="text-xl sm:text-2xl font-serif tracking-[0.25em] text-neutral-800 uppercase">
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
                    SECTION: CERTIFICATION & TRUST STANDARDS (Multiple Laboratory Verifications)
                    ================================================== */}
                <section
                    id="certification"
                    className="py-24 sm:py-32 bg-[#FAF9F6] border-y border-neutral-200"
                >
                    <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 space-y-16">

                        {/* Heading header row */}
                        <div className="text-left space-y-4 max-w-3xl">
                            <span className="text-[11px] font-bold tracking-[0.3em] text-neutral-500 uppercase block">
                                GEMOLOGICAL AUTHENTICITY
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-neutral-900 leading-tight">
                                International Diamond Grading Standards
                            </h2>
                            <div className="w-16 h-[1px] bg-neutral-800 my-4" />
                            <p className="text-neutral-700 font-sans font-light text-sm sm:text-base leading-relaxed">
                                Every loose diamond and bespoke commission curated by DN Diamond undergoes strict independent certification matching global gemological criteria. We guarantee authenticity by sourcing diamonds holding verification credentials from the world&apos;s three leading independent authorities: GIA, IGI, and HRD Antwerp.
                            </p>
                        </div>

                        {/* Six column comprehensive certification standards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">

                            {/* Card 1: GIA */}
                            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 text-left hover:shadow-md hover:border-neutral-300 transition-all">
                                <div className="space-y-4 flex-1">
                                    <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                                        <h3 className="font-serif text-xl text-neutral-900 font-semibold uppercase tracking-wide">
                                            GIA
                                        </h3>
                                        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest bg-neutral-100 px-2.5 py-1 rounded">
                                            USA Benchmark
                                        </span>
                                    </div>
                                    <h4 className="text-xs font-bold text-neutral-800 tracking-wider uppercase">Gemological Institute of America</h4>
                                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                                        The global gold standard for natural loose diamond grading. Renowned for inventing the original 4Cs evaluation system and maintaining the strictest standards for cut symmetry and clarity.
                                    </p>
                                    <ul className="text-[11px] text-neutral-700 space-y-2 font-sans pt-2 border-t border-neutral-50">
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Invisible micro laser inscription
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Global online report database
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Uncompromising cut & clarity grading
                                        </li>
                                    </ul>
                                </div>
                                <div className="pt-4 border-t border-neutral-100 text-[10px] font-mono text-neutral-400 flex justify-between items-center">
                                    <span>EST. 1931</span>
                                    <span>Carlsbad, CA</span>
                                </div>
                            </div>

                            {/* Card 2: IGI */}
                            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 text-left hover:shadow-md hover:border-neutral-300 transition-all">
                                <div className="space-y-4 flex-1">
                                    <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                                        <h3 className="font-serif text-xl text-neutral-900 font-semibold uppercase tracking-wide">
                                            IGI
                                        </h3>
                                        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest bg-neutral-100 px-2.5 py-1 rounded">
                                            Global Authority
                                        </span>
                                    </div>
                                    <h4 className="text-xs font-bold text-neutral-800 tracking-wider uppercase">International Gemological Institute</h4>
                                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                                        The world&apos;s premier independent laboratory for lab-grown diamonds, finished luxury jewelry pieces, and bespoke gemstone verification across 20+ worldwide labs.
                                    </p>
                                    <ul className="text-[11px] text-neutral-700 space-y-2 font-sans pt-2 border-t border-neutral-50">
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Advanced CVD/HPHT lab-grown screening
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Full studded jewelry mapping dossiers
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Tamper-evident security sealing
                                        </li>
                                    </ul>
                                </div>
                                <div className="pt-4 border-t border-neutral-100 text-[10px] font-mono text-neutral-400 flex justify-between items-center">
                                    <span>EST. 1975</span>
                                    <span>Antwerp / NY / Tokyo</span>
                                </div>
                            </div>

                            {/* Card 3: HRD */}
                            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 text-left hover:shadow-md hover:border-neutral-300 transition-all">
                                <div className="space-y-4 flex-1">
                                    <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                                        <h3 className="font-serif text-xl text-neutral-900 font-semibold uppercase tracking-wide">
                                            HRD
                                        </h3>
                                        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest bg-neutral-100 px-2.5 py-1 rounded">
                                            Europe Standard
                                        </span>
                                    </div>
                                    <h4 className="text-xs font-bold text-neutral-800 tracking-wider uppercase">Hoge Raad voor Diamant</h4>
                                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                                        Antwerp&apos;s leading diamond authority, respected across European court systems and luxury European design houses for ultra-precise high-security certificates.
                                    </p>
                                    <ul className="text-[11px] text-neutral-700 space-y-2 font-sans pt-2 border-t border-neutral-50">
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Micro-text & UV-security grading cards
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Detailed luminescence & fluorescence scale
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Anonymized double-blind grading
                                        </li>
                                    </ul>
                                </div>
                                <div className="pt-4 border-t border-neutral-100 text-[10px] font-mono text-neutral-400 flex justify-between items-center">
                                    <span>EST. 1973</span>
                                    <span>Antwerp, Belgium</span>
                                </div>
                            </div>

                            {/* Card 4: GCAL */}
                            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 text-left hover:shadow-md hover:border-neutral-300 transition-all">
                                <div className="space-y-4 flex-1">
                                    <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                                        <h3 className="font-serif text-xl text-neutral-900 font-semibold uppercase tracking-wide">
                                            GCAL
                                        </h3>
                                        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest bg-neutral-100 px-2.5 py-1 rounded">
                                            8X Cut Grade
                                        </span>
                                    </div>
                                    <h4 className="text-xs font-bold text-neutral-800 tracking-wider uppercase">Gem Certification & Assurance Lab</h4>
                                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                                        Famous for the GCAL 8X Ultimate Cut grade and zero-tolerance accuracy. Every certificate includes actual photomicrographs of the diamond&apos;s internal inclusions and laser inscription.
                                    </p>
                                    <ul className="text-[11px] text-neutral-700 space-y-2 font-sans pt-2 border-t border-neutral-50">
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Gemprint® unique optical fingerprinting
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            360° optical brilliance & scintillation scan
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Consumer guaranteed grading accuracy
                                        </li>
                                    </ul>
                                </div>
                                <div className="pt-4 border-t border-neutral-100 text-[10px] font-mono text-neutral-400 flex justify-between items-center">
                                    <span>EST. 2001</span>
                                    <span>New York, NY</span>
                                </div>
                            </div>

                            {/* Card 5: AGS */}
                            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 text-left hover:shadow-md hover:border-neutral-300 transition-all">
                                <div className="space-y-4 flex-1">
                                    <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                                        <h3 className="font-serif text-xl text-neutral-900 font-semibold uppercase tracking-wide">
                                            AGS
                                        </h3>
                                        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest bg-neutral-100 px-2.5 py-1 rounded">
                                            Ideal Cut Pioneer
                                        </span>
                                    </div>
                                    <h4 className="text-xs font-bold text-neutral-800 tracking-wider uppercase">American Gem Society Laboratories</h4>
                                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                                        The scientific pioneers of light performance grading. Now integrated with GIA digital reports, AGS developed the industry&apos;s first mathematical standard for the &apos;Ideal Cut 0&apos; rating.
                                    </p>
                                    <ul className="text-[11px] text-neutral-700 space-y-2 font-sans pt-2 border-t border-neutral-50">
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            ASET light performance ray-tracing
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Exact angular tilt & leakage mapping
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Precision proportions check
                                        </li>
                                    </ul>
                                </div>
                                <div className="pt-4 border-t border-neutral-100 text-[10px] font-mono text-neutral-400 flex justify-between items-center">
                                    <span>EST. 1934</span>
                                    <span>Las Vegas, NV</span>
                                </div>
                            </div>

                            {/* Card 6: SGL / EGL */}
                            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 text-left hover:shadow-md hover:border-neutral-300 transition-all">
                                <div className="space-y-4 flex-1">
                                    <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                                        <h3 className="font-serif text-xl text-neutral-900 font-semibold uppercase tracking-wide">
                                            SGL & EGL
                                        </h3>
                                        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest bg-neutral-100 px-2.5 py-1 rounded">
                                            International Lab
                                        </span>
                                    </div>
                                    <h4 className="text-xs font-bold text-neutral-800 tracking-wider uppercase">Solitaire & European Gemological Labs</h4>
                                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                                        Widely recognized across international jewelry markets for fastidious certification of multi-stone studded jewelry, solitaire rings, and high-precision diamond assortments.
                                    </p>
                                    <ul className="text-[11px] text-neutral-700 space-y-2 font-sans pt-2 border-t border-neutral-50">
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Mobile laboratory studded jewelry checks
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Multi-tier diamond authenticity screening
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                                            Covers both natural & lab-grown stones
                                        </li>
                                    </ul>
                                </div>
                                <div className="pt-4 border-t border-neutral-100 text-[10px] font-mono text-neutral-400 flex justify-between items-center">
                                    <span>Global Network</span>
                                    <span>London / Dubai / Mumbai</span>
                                </div>
                            </div>

                        </div>

                        {/* Kimberley Process & Ethical Assurance Wide Banner */}
                        <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 shadow-md text-left flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mt-12">
                            <div className="space-y-4 max-w-3xl">
                                <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase block">
                                    ETHICAL ORIGIN & COMPLIANCE
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-serif font-light tracking-wide text-white">
                                    Kimberley Process (KPCS) & RJC Certified
                                </h3>
                                <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed">
                                    In addition to individual gemological grading reports, every diamond sourced by DN Diamond adheres strictly to the United Nations-backed Kimberley Process Certification Scheme (KPCS) and the Responsible Jewellery Council (RJC). We guarantee zero conflict origin, ethical mining practices, transparent chain-of-custody documentation, and 100% recycled 18K gold and platinum hallmarking on all finished creations.
                                </p>
                            </div>
                            <div className="shrink-0 flex flex-wrap gap-3">
                                <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-[11px] font-mono tracking-wider uppercase text-neutral-200">
                                    ✓ 100% Conflict-Free
                                </span>
                                <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-[11px] font-mono tracking-wider uppercase text-neutral-200">
                                    ✓ Traceable Origin
                                </span>
                            </div>
                        </div>
                    </div>
                </section>



                {/* ==================================================
                    SECTION 8: FINAL CTA (Luxury Dark Section)
                    ================================================== */}
                <section className="bg-black py-24 sm:py-32 lg:py-40 text-center relative overflow-hidden">
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
                                <button className="group relative overflow-hidden px-10 py-4 bg-white border border-white text-black text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-500 focus:outline-none cursor-pointer">
                                    <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                                        Explore Collection
                                    </span>
                                    <span className="absolute inset-0 bg-neutral-900 origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 -z-0" />
                                </button>
                            </a>
                            <a href="/contact">
                                <button className="group relative overflow-hidden px-10 py-4 border border-white text-white text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-500 focus:outline-none cursor-pointer bg-transparent">
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
