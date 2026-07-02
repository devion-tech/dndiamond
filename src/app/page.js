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

async function loadGSAP() {
    const { gsap } = await import("gsap");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
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
        <div className={dark ? "bg-neutral-950 border-y border-neutral-800 py-3.5 overflow-hidden" : "bg-neutral-50 border-y border-neutral-100 py-3.5 overflow-hidden"}>
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

    const heroTextRef = useRef(null);
    const heroLineRef = useRef(null);
    useEffect(() => {
        loadGSAP().then(({ gsap }) => {
            if (heroTextRef.current) {
                gsap.fromTo(Array.from(heroTextRef.current.children),
                    { opacity: 0, y: 32 },
                    { opacity: 1, y: 0, duration: 1, stagger: 0.14, ease: "power3.out", delay: 0.3 }
                );
            }
            if (heroLineRef.current) {
                gsap.fromTo(heroLineRef.current,
                    { scaleX: 0 },
                    { scaleX: 1, duration: 1.2, ease: "power3.inOut", delay: 0.6, transformOrigin: "left" }
                );
            }
        });
    }, []);

    const catHeadRef = useRef(null);
    const bestHeadRef = useRef(null);
    useReveal(catHeadRef, { y: 24, duration: 0.75 });
    useReveal(bestHeadRef, { y: 24, duration: 0.75 });

    return (
        <Layout>
            <div className="w-full flex flex-col bg-white">

                {/* 1. HERO */}
                <section className="relative h-[88vh] w-full overflow-hidden flex items-end pb-16 sm:pb-20">
                    <div className="absolute inset-0 z-0">
                        <img src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&q=80" alt="The Diamond Collection"
                            className="h-full w-full object-cover object-center brightness-[0.78]" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-neutral-950/10 to-transparent z-10" />
                    <div ref={heroLineRef} className="absolute top-0 left-0 right-0 h-px bg-white/20 z-40"
                        style={{ transform: "scaleX(0)", transformOrigin: "left" }} />
                    <div className="relative z-20 mx-auto max-w-[1600px] w-full px-6 sm:px-10 lg:px-16">
                        <div ref={heroTextRef} className="max-w-lg space-y-5">
                            <span className="block text-[9px] lg:text-[10px] xl:text-[11px] font-bold tracking-[0.4em] uppercase text-white/60 opacity-0">
                                Masterpiece Collection
                            </span>
                            <h1 className="font-serif text-white text-5xl sm:text-7xl lg:text-8xl font-light tracking-wide leading-[1.05] lowercase opacity-0">
                                the diamond collection
                            </h1>
                            <p className="text-white/75 text-xs sm:text-sm xl:text-base font-light tracking-wide leading-relaxed opacity-0">
                                Ethically sourced. Masterfully cut. Discover fine diamond jewelry that lasts a lifetime.
                            </p>
                            <div className="pt-1 opacity-0">
                                <Link href="/jewelry" className="btn-apollonian-outline rounded-full btn-apollonian-outline-dark">
                                    SHOP NOW
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Marquee */}
                <MarqueeStrip />

                {/* 2. SHOP BY CATEGORY */}
                <section className="bg-white py-16">
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

                {/*  BEST SELLERS */}
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

                {/* Marquee dark */}
                <MarqueeStrip dark />

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
