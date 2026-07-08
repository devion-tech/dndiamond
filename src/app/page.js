"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { useStore } from "@/context/StoreContext";
import CategoryCarousel from "@/components/ui/CategoryCarousel";
import ExploreDiamonds from "@/components/ui/ExploreDiamonds";

const BEST_SELLERS = [
    { id: "JW-101", name: "Classic Diamond Halo Ring", price: 4150, img: "/bestsellers/RF16377DD-03-W.webp" },
    { id: "JW-102", name: "Vianne Everyday Diamond Band", price: 850, img: "/bestsellers/RFB0281DD-01W.webp" },
    { id: "JW-103", name: "Stella Solitaire Studs", price: 2450, img: "/bestsellers/101977EA-W2.webp" },
    { id: "JW-104", name: "Signature Tennis Bracelet", price: 10450, img: "/bestsellers/GFA1049DD-01W1.webp" },
    { id: "JW-108", name: "Tiara Diamond Ring", price: 150, img: "/bestsellers/RFB6659DD-01-W.webp" },
];

const MARQUEE_ITEMS = [
    "Fine Jewellery", "Certified Diamonds", "Bespoke Design",
    "18K & Platinum", "GIA Certified", "Conflict-Free Gems",
    "Fine Jewellery", "Certified Diamonds", "Bespoke Design",
    "18K & Platinum", "GIA Certified", "Conflict-Free Gems",
];

// Carousel Slide Data for Home Page Hero
const SLIDES = [
    {
        label: "THE DIAMOND COLLECTION",
        title: "Inspiring Light,\nDefining Elegance.",
        description: "Ethically sourced. Masterfully cut. Discover fine GIA certified diamond jewelry designed to hold stories that last a lifetime.",
        buttonText: "Shop Collection",
        img: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1920",
        link: "/jewelry"
    },
    {
        label: "BESPOKE CREATIONS",
        title: "Crafted Specifically\nFor Your Story.",
        description: "Work directly with our master bench jewellers to design a unique custom piece engineered to endure for generations.",
        buttonText: "Reserve Consultation",
        img: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?q=80&w=1920",
        link: "/bespoke"
    },
    {
        label: "CERTIFIED BRILLIANCE",
        title: "GIA Conflict-Free\nMasterpieces.",
        description: "Every diamond carries an official GIA laser-inscribed registration, guaranteeing unmatched clarity, color, and provenance.",
        buttonText: "Explore Diamonds",
        img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1920",
        link: "/diamonds"
    },
    {
        label: "THE ATELIER",
        title: "A Legacy Of\nPure Precision.",
        description: "Drawing inspiration from classical proportions and symmetry. Explore our collection of hand-forged gold and platinum masterpieces.",
        buttonText: "About DN Diamond",
        img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920",
        link: "/about"
    }
];

async function loadGSAP() {
    const { gsap } = await import("gsap");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    const { Observer } = await import("gsap/Observer");
    gsap.registerPlugin(ScrollTrigger, Observer);
    return { gsap, ScrollTrigger, Observer };
}

function useReveal(ref, { y = 36, duration = 0.8, stagger = 0, delay = 0, start = "top 85%" } = {}) {
    useEffect(() => {
        if (!ref.current) return;
        let ctx;
        loadGSAP().then(({ gsap, ScrollTrigger }) => {
            const targets = stagger ? Array.from(ref.current.children) : ref.current;
            ctx = gsap.context(() => {
                gsap.fromTo(targets,
                    { opacity: 0, y },
                    {
                        opacity: 1, y: 0, duration, delay,
                        stagger: stagger || 0, ease: "power3.out",
                        scrollTrigger: { trigger: ref.current, start, once: true },
                    }
                );
            });
        });
        return () => ctx && ctx.revert();
    }, []);
}

function MarqueeStrip({ dark }) {
    const trackRef = useRef(null);
    useEffect(() => {
        loadGSAP().then(({ gsap }) => {
            const track = trackRef.current;
            if (!track) return;
            const totalW = track.scrollWidth / 2;
            gsap.to(track, { x: -totalW, duration: 28, ease: "none", repeat: -1 });
        });
    }, []);

    return (
        <div className={dark ? "bg-neutral-955 border-y border-neutral-800 py-3.5 overflow-hidden" : "bg-neutral-50 border-y border-neutral-100 py-3.5 overflow-hidden"}>
            <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
                {MARQUEE_ITEMS.map((item, i) => (
                    <span key={i} className={`inline-flex items-center gap-4 px-6 font-serif text-[10px] lg:text-[11px] xl:text-xs tracking-[0.3em] uppercase ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
                        {item} <span className={dark ? "text-neutral-700" : "text-neutral-200"}>✦</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

function BestSellersGrid({ formatPrice }) {
    const gridRef = useRef(null);
    useReveal(gridRef, { stagger: 0.1, y: 28, duration: 0.7, start: "top 82%" });
    return (
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-5 gap-x-5 gap-y-8">
            {BEST_SELLERS.map(prod => (
                <BestSellerCard key={prod.id} prod={prod} formatPrice={formatPrice} />
            ))}
        </div>
    );
}

function BestSellerCard({ prod, formatPrice }) {
    const imgRef = useRef(null);
    const onEnter = () => import("gsap").then(({ gsap }) => gsap.to(imgRef.current, { scale: 1.05, duration: 0.6, ease: "power2.out" }));
    const onLeave = () => import("gsap").then(({ gsap }) => gsap.to(imgRef.current, { scale: 1, duration: 0.5, ease: "power2.inOut" }));
    return (
        <Link href={`/jewelry/${prod.id}`} className="group flex flex-col text-left" onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <div className="aspect-square w-full overflow-hidden bg-white border border-neutral-100 p-2 mb-4">
                <img ref={imgRef} src={prod.img} alt={prod.name} className="h-full w-full object-contain will-change-transform" />
            </div>
            <h4 className="font-serif text-[10px] lg:text-[11px] xl:text-xs tracking-widest text-neutral-800 uppercase mb-1">{prod.name}</h4>
            <p className="font-sans text-[11px] lg:text-xs xl:text-sm text-neutral-500 font-medium">{formatPrice(prod.price)}</p>
        </Link>
    );
}

function ParallaxImage({ src, alt, className }) {
    const wrapRef = useRef(null);
    const imgRef = useRef(null);
    useEffect(() => {
        let ctx;
        loadGSAP().then(({ gsap, ScrollTrigger }) => {
            ctx = gsap.context(() => {
                gsap.fromTo(imgRef.current,
                    { yPercent: -8 },
                    {
                        yPercent: 8, ease: "none",
                        scrollTrigger: { trigger: wrapRef.current, start: "top bottom", end: "bottom top", scrub: 1.2 },
                    }
                );
            });
        });
        return () => ctx && ctx.revert();
    }, []);
    return (
        <div ref={wrapRef} className={`overflow-hidden ${className || ""}`}>
            <img ref={imgRef} src={src} alt={alt} className="h-full w-full object-cover will-change-transform scale-110" />
        </div>
    );
}

function EditorialBlock({ eyebrow, heading, body, cta, ctaHref, dark }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!ref.current) return;
        let ctx;
        loadGSAP().then(({ gsap, ScrollTrigger }) => {
            const els = ref.current.querySelectorAll("[data-anim]");
            ctx = gsap.context(() => {
                gsap.fromTo(els,
                    { opacity: 0, y: 24 },
                    {
                        opacity: 1, y: 0,
                        duration: 0.75, stagger: 0.12, ease: "power3.out",
                        scrollTrigger: { trigger: ref.current, start: "top 84%", once: true },
                    }
                );
            });
        });
        return () => ctx && ctx.revert();
    }, []);

    return (
        <div ref={ref} className="space-y-6 text-left">
            {eyebrow && (
                <span data-anim className="block text-[9px] lg:text-[10px] xl:text-[11px] font-bold tracking-[0.35em] uppercase opacity-0"
                    style={{ color: dark ? "#555" : "#aaa" }}>
                    {eyebrow}
                </span>
            )}
            <h3 data-anim className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide leading-tight opacity-0 ${dark ? "text-white" : "text-neutral-955"}`}>
                {heading}
            </h3>
            <div data-anim className={`space-y-3 text-xs xl:text-sm font-light leading-relaxed max-w-md opacity-0 ${dark ? "text-neutral-400" : "text-neutral-500"}`}>
                {Array.isArray(body) ? body.map((p, i) => <p key={i}>{p}</p>) : <p>{body}</p>}
            </div>
            {cta && (
                <div data-anim className="pt-2 opacity-0">
                    <Link href={ctaHref} className={dark ? "btn-apollonian-outline btn-apollonian-outline-dark" : "btn-apollonian-outline btn-apollonian-outline-light"}>
                        {cta}
                    </Link>
                </div>
            )}
        </div>
    );
}

function StatsTicker() {
    const ref = useRef(null);
    useReveal(ref, { stagger: 0.15, y: 20, duration: 0.6, start: "top 88%" });
    const stats = [
        { n: "12+", label: "Years of craft" },
        { n: "4,000+", label: "Pieces created" },
        { n: "GIA", label: "Certified diamonds" },
        { n: "3", label: "Showrooms" },
    ];
    return (
        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map(s => (
                <div key={s.n} className="opacity-0">
                    <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-neutral-955 mb-1">{s.n}</p>
                    <p className="text-[10px] lg:text-[11px] xl:text-xs text-neutral-400 font-medium tracking-widest uppercase">{s.label}</p>
                </div>
            ))}
        </div>
    );
}

export default function Home() {
    const { formatPrice } = useStore();

    // Slider State
    const [currentSlide, setCurrentSlide] = useState(0);
    const [gsapLoaded, setGsapLoaded] = useState(false);

    // Dynamic GSAP values refs
    const gsapRef = useRef(null);
    const observerRef = useRef(null);

    // Hero references
    const heroContainerRef = useRef(null);
    const slideContainersRef = useRef([]);
    const slideRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const autoplayTimerRef = useRef(null);

    // Category & sellers animations reveal refs
    const catHeadRef = useRef(null);
    const bestHeadRef = useRef(null);

    useReveal(catHeadRef, { y: 24, duration: 0.75 });
    useReveal(bestHeadRef, { y: 24, duration: 0.75 });

    // Text Split renderers to create beautiful masking reveals
    const renderSplitTitle = (text) => {
        return text.split("\n").map((line, idx) => (
            <span key={idx} className="block overflow-hidden pb-1">
                <span className="inline-block js-split-line" style={{ opacity: 0 }}>
                    {line}
                </span>
            </span>
        ));
    };

    const renderSplitDescription = (text) => {
        return text.split("\n\n").map((para, idx) => (
            <span key={idx} className="block overflow-hidden mt-3">
                <span className="inline-block js-split-para font-light text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl" style={{ opacity: 0 }}>
                    {para}
                </span>
            </span>
        ));
    };

    // Autoplay Controller setup
    const startAutoplay = () => {
        stopAutoplay();
        autoplayTimerRef.current = setInterval(() => {
            if (isAnimatingRef.current) return;
            const nextIdx = (slideRef.current + 1) % SLIDES.length;
            transitionSlides(slideRef.current, nextIdx, "next");
        }, 2000);
    };

    const stopAutoplay = () => {
        if (autoplayTimerRef.current) {
            clearInterval(autoplayTimerRef.current);
        }
    };

    const initSlide0 = () => {
        const gsap = gsapRef.current;
        if (!gsap) return;

        const firstSlide = slideContainersRef.current[0];
        if (!firstSlide) return;

        const img = firstSlide.querySelector(".js-hero-img");
        const label = firstSlide.querySelector(".js-hero-label");
        const lines = firstSlide.querySelectorAll(".js-split-line");
        const paras = firstSlide.querySelectorAll(".js-split-para");
        const button = firstSlide.querySelector(".js-hero-button");

        gsap.set(slideContainersRef.current.slice(1), { opacity: 0, zIndex: 0 });
        gsap.set(firstSlide, { opacity: 1, zIndex: 10 });

        gsap.fromTo(img,
            { scale: 1.15, opacity: 0 },
            { scale: 1, opacity: 1, duration: 2, ease: "power3.out" }
        );
        gsap.fromTo(label,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.5 }
        );
        gsap.fromTo(lines,
            { yPercent: 120, opacity: 0 },
            { yPercent: 0, opacity: 1, stagger: 0.1, duration: 1.2, ease: "power4.out", delay: 0.6 }
        );
        gsap.fromTo(paras,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, stagger: 0.1, duration: 1.0, ease: "power3.out", delay: 0.8 }
        );
        gsap.fromTo(button,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 1.0 }
        );

        // Slow subtle zoom drift
        gsap.to(img, { scale: 1.05, duration: 6, ease: "none", delay: 2 });
        animateProgressBar(0);
    };

    const transitionSlides = (fromIdx, toIdx, direction = "next") => {
        const gsap = gsapRef.current;
        if (!gsap || fromIdx === toIdx || isAnimatingRef.current) return;
        isAnimatingRef.current = true;

        const fromSlide = slideContainersRef.current[fromIdx];
        const toSlide = slideContainersRef.current[toIdx];

        if (!fromSlide || !toSlide) {
            isAnimatingRef.current = false;
            return;
        }

        const fromImg = fromSlide.querySelector(".js-hero-img");
        const toImg = toSlide.querySelector(".js-hero-img");
        const toLines = toSlide.querySelectorAll(".js-split-line");
        const toParas = toSlide.querySelectorAll(".js-split-para");
        const toLabel = toSlide.querySelector(".js-hero-label");
        const toButton = toSlide.querySelector(".js-hero-button");

        const fromLines = fromSlide.querySelectorAll(".js-split-line");
        const fromParas = fromSlide.querySelectorAll(".js-split-para");
        const fromLabel = fromSlide.querySelector(".js-hero-label");
        const fromButton = fromSlide.querySelector(".js-hero-button");

        // Reorder layer levels
        gsap.set(toSlide, { opacity: 1, zIndex: 10 });
        gsap.set(fromSlide, { zIndex: 5 });

        // Reset slide parameters
        gsap.set(toImg, { scale: 1.15, opacity: 0 });
        gsap.set(toLines, { yPercent: 120, opacity: 0 });
        gsap.set(toParas, { yPercent: 100, opacity: 0 });
        gsap.set(toLabel, { y: 20, opacity: 0 });
        gsap.set(toButton, { y: 30, opacity: 0 });

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(fromSlide, { opacity: 0, zIndex: 0 });
                setCurrentSlide(toIdx);
                slideRef.current = toIdx;
                isAnimatingRef.current = false;
            }
        });

        // Fade out previous slide elements
        if (fromImg) tl.to(fromImg, { opacity: 0, duration: 1.2, ease: "power2.inOut" }, 0);
        if (fromLines.length) tl.to(fromLines, { yPercent: -100, opacity: 0, stagger: 0.05, duration: 0.8, ease: "power3.in" }, 0);
        if (fromParas.length) tl.to(fromParas, { yPercent: -80, opacity: 0, stagger: 0.05, duration: 0.8, ease: "power3.in" }, 0);
        if (fromLabel) tl.to(fromLabel, { y: -20, opacity: 0, duration: 0.6, ease: "power2.in" }, 0);
        if (fromButton) tl.to(fromButton, { y: -20, opacity: 0, duration: 0.6, ease: "power2.in" }, 0);

        // Bring in new slide elements
        tl.to(toImg, { opacity: 1, scale: 1, duration: 1.6, ease: "power3.out" }, 0.2);
        tl.to(toLabel, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.4);
        tl.to(toLines, { yPercent: 0, opacity: 1, stagger: 0.1, duration: 1.2, ease: "power4.out" }, 0.5);
        tl.to(toParas, { yPercent: 0, opacity: 1, stagger: 0.1, duration: 1.0, ease: "power3.out" }, 0.7);
        tl.to(toButton, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.9);

        // Continue drift
        tl.to(toImg, { scale: 1.05, duration: 5, ease: "none" }, 1.8);
        animateProgressBar(toIdx);
    };

    const animateProgressBar = (activeIdx) => {
        const gsap = gsapRef.current;
        if (!gsap) return;

        const fills = document.querySelectorAll(".js-progress-fill");
        if (!fills || fills.length === 0) return;

        gsap.killTweensOf(fills);

        fills.forEach((fill, idx) => {
            if (idx < activeIdx) {
                gsap.set(fill, { height: "100%" });
            } else if (idx > activeIdx) {
                gsap.set(fill, { height: "0%" });
            } else {
                gsap.fromTo(fill,
                    { height: "0%" },
                    { height: "100%", duration: 6, ease: "none" }
                );
            }
        });
    };

    const handleProgressClick = (idx) => {
        if (idx === currentSlide || isAnimatingRef.current) return;
        const dir = idx > currentSlide ? "next" : "prev";
        transitionSlides(slideRef.current, idx, dir);
        startAutoplay();
    };

    const handleScrollToNextSection = () => {
        const categoriesSection = document.querySelector("#section-categories");
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Observer and dynamic setup
    useEffect(() => {
        let ctx;
        loadGSAP().then(({ gsap, ScrollTrigger, Observer }) => {
            gsapRef.current = gsap;
            observerRef.current = Observer;
            setGsapLoaded(true);

            ctx = gsap.context(() => {
                // Initialize slides
                initSlide0();
                startAutoplay();

                // Setup wheel and swipe scroll intercept
                const heroContainer = heroContainerRef.current;
                if (heroContainer) {
                    Observer.create({
                        target: heroContainer,
                        type: "wheel,touch,pointer",
                        tolerance: 40,
                        onChange: (self) => {
                            const isScrollDown = self.deltaY > 0;
                            const isScrollUp = self.deltaY < 0;

                            if (isAnimatingRef.current) {
                                if (window.scrollY === 0) self.event.preventDefault();
                                return;
                            }

                            if (window.scrollY === 0) {
                                if (isScrollDown && slideRef.current < SLIDES.length - 1) {
                                    self.event.preventDefault();
                                    const nextIdx = slideRef.current + 1;
                                    transitionSlides(slideRef.current, nextIdx, "next");
                                    startAutoplay();
                                } else if (isScrollUp && slideRef.current > 0) {
                                    self.event.preventDefault();
                                    const prevIdx = slideRef.current - 1;
                                    transitionSlides(slideRef.current, prevIdx, "prev");
                                    startAutoplay();
                                }
                            }
                        }
                    });
                }
            }, heroContainerRef);
        });

        return () => {
            if (ctx) ctx.revert();
            if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
        };
    }, []);

    return (
        <Layout>
            <div className="w-full flex flex-col bg-white overflow-x-hidden select-none">

                {/* ==================================================
                    SECTION 1: FULLSCREEN HERO CAROUSEL (100vh)
                    ================================================== */}
                <section
                    ref={heroContainerRef}
                    className="relative h-screen w-full bg-[#0F0F0F] overflow-hidden select-none"
                >
                    {/* Background Images Layer */}
                    {SLIDES.map((slide, idx) => (
                        <div
                            key={idx}
                            ref={(el) => (slideContainersRef.current[idx] = el)}
                            className="absolute inset-0 w-full h-full flex items-center justify-start opacity-0 z-0"
                        >
                            {/* Background Photo */}
                            <div className="absolute inset-0 overflow-hidden">
                                <img
                                    src={slide.img}
                                    alt={slide.label}
                                    className="w-full h-full object-cover select-none js-hero-img"
                                    style={{ transform: "scale(1.15)" }}
                                />
                                {/* Luxury Cinematic Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent z-10" />
                                <div className="absolute inset-0 bg-black/10 z-10" />
                            </div>

                            {/* Slide Content Layer */}
                            <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 flex items-center h-full">
                                <div className="max-w-2xl text-left space-y-6 js-hero-content">
                                    {/* Category Label */}
                                    <span className="inline-block text-[11px] font-bold tracking-[0.3em] text-[#C8A96A] uppercase js-hero-label">
                                        {slide.label}
                                    </span>

                                    {/* Headline */}
                                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-white tracking-wide leading-[1.1] md:leading-[1.05]">
                                        {renderSplitTitle(slide.title)}
                                    </h1>

                                    {/* Description */}
                                    <div className="mt-2 text-neutral-300">
                                        {renderSplitDescription(slide.description)}
                                    </div>

                                    {/* Call To Action Button */}
                                    <div className="pt-4 js-hero-button">
                                        <Link href={slide.link}>
                                            <button className="group relative overflow-hidden px-8 py-3.5 border border-white/30 text-white text-xs font-bold uppercase tracking-[0.2em] bg-transparent transition-colors duration-500 hover:border-[#C8A96A] focus:outline-none">
                                                <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                                                    {slide.buttonText}
                                                </span>
                                                <span className="absolute inset-0 bg-[#C8A96A] origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 -z-0" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Vertical Progress Indicators (Right Side) */}
                    <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col space-y-3">
                        {SLIDES.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleProgressClick(idx)}
                                className="group relative flex items-center justify-end py-3 px-2 focus:outline-none"
                                aria-label={`Go to slide ${idx + 1}`}
                            >
                                {/* Descriptive label appearing on hover */}
                                <span className="text-[10px] font-sans font-medium tracking-[0.25em] text-[#FAF8F5]/60 group-hover:text-[#C8A96A] transition-colors duration-300 mr-4 opacity-0 group-hover:opacity-100 uppercase hidden sm:inline-block">
                                    {SLIDES[idx].label}
                                </span>

                                {/* Progress bar container */}
                                <div className="relative h-10 w-[2px] bg-white/20 transition-all duration-300 group-hover:bg-white/30">
                                    <div
                                        className="absolute top-0 left-0 w-full bg-[#C8A96A] js-progress-fill"
                                        style={{ height: idx < currentSlide ? "100%" : idx > currentSlide ? "0%" : "0%" }}
                                    />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Mouse Floating Scroll Indicator (Bottom Center) */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                        <button
                            onClick={handleScrollToNextSection}
                            className="flex flex-col items-center group cursor-pointer focus:outline-none"
                            aria-label="Scroll down to category section"
                        >
                            {/* Floating Mouse Outline */}
                            <div className="relative w-[22px] h-[36px] border border-white/30 rounded-full flex justify-center p-1 group-hover:border-[#C8A96A] transition-colors duration-500">
                                <div className="w-[2px] h-[7px] bg-white rounded-full animate-bounce mt-1 group-hover:bg-[#C8A96A] transition-colors duration-500" />
                            </div>
                            <span className="text-[9px] font-sans tracking-[0.3em] uppercase text-white/50 group-hover:text-[#C8A96A] transition-colors duration-500 mt-2 block">
                                Scroll
                            </span>
                        </button>
                    </div>
                </section>

                {/* Marquee Strip */}
                <MarqueeStrip />

                {/* ==================================================
                    SECTION 2: SHOP BY CATEGORY
                    ================================================== */}
                <section id="section-categories" className="bg-white py-16">
                    <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16 text-white">
                        <div ref={catHeadRef} className="text-center space-y-2 opacity-0">
                            <h2 className="font-serif text-2xl lg:text-3xl tracking-[0.15em] text-neutral-900 uppercase">
                                SHOP BY CATEGORY
                            </h2>
                            <p className="text-[10px] tracking-[0.25em] text-neutral-400 font-medium uppercase">
                                Find your perfect piece from our curated selection.
                            </p>
                        </div>
                        <CategoryCarousel />
                    </div>
                </section>

                {/* Explore Diamonds shape cut section */}
                <ExploreDiamonds />

                {/* BEST SELLERS */}
                <section className="bg-white py-4">
                    <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
                        <div ref={bestHeadRef} className="text-center space-y-2 opacity-0">
                            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-black">
                                Best selling product
                            </h2>
                            <p className="font-serif italic text-neutral-400 text-sm font-light">
                                Our most beloved pieces.
                            </p>
                        </div>
                        <BestSellersGrid formatPrice={formatPrice} />
                    </div>
                </section>

                {/* Stats bar */}
                <section className="bg-neutral-50 border-y border-neutral-100 py-16">
                    <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
                        <StatsTicker />
                    </div>
                </section>

                {/* GIFTS OF THE SEASON */}
                <section className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <EditorialBlock
                                eyebrow="Gift Edit · 2024"
                                heading="Gifts of the season."
                                body={[
                                    "Diamond jewelry that endures — chosen for the moments that do. From solitaire pendants to fine rings, our gift edit is curated for the people you love most.",
                                ]}
                                cta="SHOP GIFTS"
                                ctaHref="/jewelry?category=Pendant"
                            />
                            <ParallaxImage
                                src="/products/rings.jpg"
                                alt="Gifts of the Season"
                                className="aspect-[4/5] border border-neutral-100"
                            />
                        </div>
                    </div>
                </section>
                {/* WHAT WERE WE MADE FOR? */}
                <section className="bg-[#0D0D0D] text-white py-24 sm:py-32">
                    <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <ParallaxImage
                                src="/products/atelier_interior.png"
                                alt="Dndiamond Atelier Studio"
                                className="aspect-[4/5] border border-neutral-800"
                            />
                            <EditorialBlock dark
                                eyebrow="Our Story"
                                heading="What were we made for?"
                                body={[
                                    "We were made to transform the rarest materials on earth into things that hold meaning. Every diamond we source, every band we shape — it carries a story that belongs to you.",
                                    "Founded by craftsmen, driven by detail.",
                                ]}
                                cta="ABOUT US"
                                ctaHref="/about"
                            />
                        </div>
                    </div>
                </section>

            </div>
        </Layout>
    );
}
