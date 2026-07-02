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

// Timeline step data
const TIMELINE_STEPS = [
    {
        step: "01",
        title: "Ethical Sourcing",
        subtitle: "Origin & Integrity",
        desc: "We strictly select GIA-certified diamonds under the Kimberley Process. Each rough stone is vetted to guarantee it is conflict-free and supports diamond-producing communities."
    },
    {
        step: "02",
        title: "Diamond Selection",
        subtitle: "Rarity & Optics",
        desc: "Out of thousands of stones, only a fraction meet our standards. We inspect beyond the 4Cs, checking for optical symmetry, light returns, and internal fire."
    },
    {
        step: "03",
        title: "Design Atelier",
        subtitle: "Sketches & Gouache",
        desc: "Designs are born as traditional gouache paintings. They are then refined into exact digital models, balancing metal weight and optical physics."
    },
    {
        step: "04",
        title: "Handcrafting",
        subtitle: "Artisanal Alchemy",
        desc: "Master goldsmiths hand-forge each setting in platinum or 18K gold. Every claw, prong, and setting is sculpted specifically to hold the exact gemstone."
    },
    {
        step: "05",
        title: "Certification",
        subtitle: "Validation & Control",
        desc: "The completed piece undergoes extensive QA. It is certified for stone positioning, alloy purity, and GIA laser inscription alignment."
    },
    {
        step: "06",
        title: "Delivered Forever",
        subtitle: "The Signature Box",
        desc: "Enclosed in our signature lacquer case, the piece is delivered with its official GIA dossier, ready to be treasured for generations."
    }
];

// Diamond Cut Shapes Data
const DIAMOND_SHAPES = [
    {
        name: "Round Brilliant",
        ratio: "1.00",
        facets: "57 or 58",
        desc: "The apex of fire and light return, featuring 57 or 58 facets mathematically designed to maximize scintillation, fire, and brilliance.",
        icon: (stroke) => (
            <svg viewBox="0 0 100 100" className="w-full h-full" stroke={stroke} fill="none" strokeWidth="1.2">
                <circle cx="50" cy="50" r="45" />
                <polygon points="50,22 68,32 68,53 50,63 32,53 32,32" />
                <line x1="50" y1="5" x2="50" y2="22" />
                <line x1="18.2" y1="18.2" x2="32" y2="32" />
                <line x1="5" y1="50" x2="22" y2="50" />
                <line x1="18.2" y1="81.8" x2="32" y2="68" />
                <line x1="50" y1="95" x2="50" y2="78" />
                <line x1="81.8" y1="81.8" x2="68" y2="68" />
                <line x1="95" y1="50" x2="78" y2="50" />
                <line x1="81.8" y1="18.2" x2="68" y2="32" />
                <line x1="50" y1="22" x2="81.8" y2="18.2" />
                <line x1="68" y1="32" x2="95" y2="50" />
                <line x1="68" y1="53" x2="81.8" y2="81.8" />
                <line x1="50" y1="63" x2="50" y2="95" />
                <line x1="32" y1="53" x2="18.2" y2="81.8" />
                <line x1="32" y1="32" x2="5" y2="50" />
                <line x1="50" y1="22" x2="18.2" y2="18.2" />
                <line x1="50" y1="63" x2="18.2" y2="81.8" />
                <line x1="50" y1="63" x2="81.8" y2="81.8" />
            </svg>
        )
    },
    {
        name: "Princess Cut",
        ratio: "1.00",
        facets: "50 to 58",
        desc: "A contemporary square cut with sharp, clean corners. Combines the modern geometry of straight lines with the exceptional fire of a brilliant faceting pattern.",
        icon: (stroke) => (
            <svg viewBox="0 0 100 100" className="w-full h-full" stroke={stroke} fill="none" strokeWidth="1.2">
                <rect x="15" y="15" width="70" height="70" />
                <line x1="15" y1="15" x2="85" y2="85" />
                <line x1="85" y1="15" x2="15" y2="85" />
                <rect x="32" y="32" width="36" height="36" />
                <line x1="50" y1="15" x2="50" y2="85" />
                <line x1="15" y1="50" x2="85" y2="50" />
                <polygon points="50,32 68,50 50,68 32,50" />
            </svg>
        )
    },
    {
        name: "Emerald Cut",
        ratio: "1.30 - 1.40",
        facets: "57 or 58",
        desc: "An elegant rectangular shape with step-cut facets and cropped corners. It creates a hall-of-mirrors effect, emphasizing diamond clarity and clean architecture.",
        icon: (stroke) => (
            <svg viewBox="0 0 100 100" className="w-full h-full" stroke={stroke} fill="none" strokeWidth="1.2">
                <polygon points="25,12 75,12 88,25 88,75 75,88 25,88 12,75 12,25" />
                <polygon points="29,18 71,18 82,29 82,71 71,82 29,82 18,71 18,29" />
                <polygon points="34,24 66,24 76,34 76,66 66,76 34,76 24,66 24,34" />
                <polygon points="40,32 60,32 68,40 68,60 60,68 40,68 32,60 32,40" />
                <line x1="12" y1="25" x2="32" y2="40" />
                <line x1="88" y1="25" x2="68" y2="40" />
                <line x1="88" y1="75" x2="68" y2="60" />
                <line x1="12" y1="75" x2="32" y2="60" />
            </svg>
        )
    },
    {
        name: "Marquise Cut",
        ratio: "1.85 - 2.10",
        facets: "56",
        desc: "An elongated boat-shape silhouette with pointed ends. Offers a dramatic appearance, maximizes perceived carat weight, and elongates the finger.",
        icon: (stroke) => (
            <svg viewBox="0 0 100 100" className="w-full h-full" stroke={stroke} fill="none" strokeWidth="1.2">
                <path d="M 50,8 C 76,30 76,70 50,92 C 24,70 24,30 50,8 Z" />
                <polygon points="50,28 64,50 50,72 36,50" />
                <line x1="50" y1="8" x2="50" y2="28" />
                <line x1="50" y1="92" x2="50" y2="72" />
                <line x1="24" y1="50" x2="36" y2="50" />
                <line x1="76" y1="50" x2="64" y2="50" />
                <line x1="40" y1="24" x2="50" y2="28" />
                <line x1="60" y1="24" x2="50" y2="28" />
                <line x1="40" y1="24" x2="36" y2="50" />
                <line x1="60" y1="24" x2="64" y2="50" />
                <line x1="40" y1="76" x2="50" y2="72" />
                <line x1="60" y1="76" x2="50" y2="72" />
                <line x1="40" y1="76" x2="36" y2="50" />
                <line x1="60" y1="76" x2="64" y2="50" />
            </svg>
        )
    },
    {
        name: "Oval Cut",
        ratio: "1.33 - 1.66",
        facets: "57 or 58",
        desc: "An elegant, elongated round shape. Offers the brilliance of a round cut while creating an elongating visual effect that highlights hand proportions.",
        icon: (stroke) => (
            <svg viewBox="0 0 100 100" className="w-full h-full" stroke={stroke} fill="none" strokeWidth="1.2">
                <ellipse cx="50" cy="50" rx="30" ry="43" />
                <polygon points="50,24 62,32 62,56 50,64 38,56 38,32" />
                <line x1="50" y1="7" x2="50" y2="24" />
                <line x1="50" y1="93" x2="50" y2="64" />
                <line x1="20" y1="50" x2="38" y2="50" />
                <line x1="80" y1="50" x2="62" y2="50" />
                <line x1="28" y1="21" x2="38" y2="32" />
                <line x1="72" y1="21" x2="62" y2="32" />
                <line x1="28" y1="79" x2="38" y2="56" />
                <line x1="72" y1="79" x2="62" y2="56" />
            </svg>
        )
    },
    {
        name: "Pear Cut",
        ratio: "1.45 - 1.75",
        facets: "58",
        desc: "A stunning teardrop shape combining round and marquise cuts. It features a rounded end and a tapered point, reflecting grace and unique styling.",
        icon: (stroke) => (
            <svg viewBox="0 0 100 100" className="w-full h-full" stroke={stroke} fill="none" strokeWidth="1.2">
                <path d="M 50,8 C 73,36 83,64 73,80 C 64,93 36,93 27,80 C 17,64 27,36 50,8 Z" />
                <polygon points="50,30 61,46 61,66 50,73 39,66 39,46" />
                <line x1="50" y1="8" x2="50" y2="30" />
                <line x1="50" y1="92" x2="50" y2="73" />
                <line x1="23.5" y1="50" x2="39" y2="46" />
                <line x1="76.5" y1="50" x2="61" y2="46" />
                <line x1="28.5" y1="77.5" x2="39" y2="66" />
                <line x1="71.5" y1="77.5" x2="61" y2="66" />
            </svg>
        )
    },
    {
        name: "Cushion Cut",
        ratio: "1.00 - 1.05",
        facets: "58",
        desc: "A romantic, square cut with rounded pillow-like corners. Emphasizes soft, vintage lines and holds maximum diamond color intensity.",
        icon: (stroke) => (
            <svg viewBox="0 0 100 100" className="w-full h-full" stroke={stroke} fill="none" strokeWidth="1.2">
                <path d="M 26,12 Q 50,14 74,12 Q 86,12 88,26 Q 86,50 88,74 Q 88,86 74,88 Q 50,86 26,88 Q 12,88 12,74 Q 14,50 12,26 Q 12,12 26,12 Z" />
                <path d="M 36,30 Q 50,32 64,30 Q 68,32 68,36 Q 66,50 68,64 Q 68,68 64,70 Q 50,68 36,70 Q 32,68 32,64 Q 34,50 32,36 Q 32,32 36,30 Z" />
                <line x1="12" y1="12" x2="32" y2="30" />
                <line x1="88" y1="12" x2="68" y2="30" />
                <line x1="88" y1="88" x2="68" y2="70" />
                <line x1="12" y1="88" x2="32" y2="70" />
                <line x1="50" y1="13" x2="50" y2="31" />
                <line x1="13" y1="50" x2="33" y2="50" />
                <line x1="87" y1="50" x2="67" y2="50" />
                <line x1="50" y1="87" x2="50" y2="69" />
            </svg>
        )
    },
    {
        name: "Heart Cut",
        ratio: "1.00",
        facets: "59",
        desc: "The ultimate symbol of romance. Features highly complex brilliant faceting requiring exact symmetry to ensure balanced sparkle in both lobes.",
        icon: (stroke) => (
            <svg viewBox="0 0 100 100" className="w-full h-full" stroke={stroke} fill="none" strokeWidth="1.2">
                <path d="M 50,23 C 55,12 83,10 86,33 C 88,52 69,73 50,90 C 31,73 12,52 14,33 C 17,10 45,12 50,23 Z" />
                <path d="M 50,42 C 53,36 68,34 70,45 C 71,54 61,66 50,75 C 39,66 29,54 30,45 C 32,34 47,36 50,42 Z" />
                <line x1="50" y1="23" x2="50" y2="42" />
                <line x1="50" y1="90" x2="50" y2="75" />
                <line x1="14" y1="33" x2="30" y2="45" />
                <line x1="86" y1="33" x2="70" y2="45" />
                <line x1="21" y1="57" x2="34" y2="59" />
                <line x1="79" y1="57" x2="66" y2="59" />
            </svg>
        )
    }
];

export default function AboutPage() {
    const [activeShapeIdx, setActiveShapeIdx] = useState(0);
    const [gsapLoaded, setGsapLoaded] = useState(false);

    // GSAP library reference refs
    const gsapRef = useRef(null);
    const scrollTriggerRef = useRef(null);

    // Section Refs
    const legacyImageContainerRef = useRef(null);
    const legacyImageRef = useRef(null);
    const craftsmanshipStatsRef = useRef(null);
    const yexpRef = useRef(null);
    const jewelsRef = useRef(null);
    const certRef = useRef(null);

    const orbitSectionRef = useRef(null);
    const orbitTrackRef = useRef({ rotation: 0 });
    const orbitSpinRef = useRef(null);
    const orbitTrackValRef = useRef(null);
    const updateOrbitFnRef = useRef(null);

    const timelineContainerRef = useRef(null);
    const timelineRef = useRef(null);
    const valuesRef = useRef(null);
    const galleryRef = useRef(null);
    const globalStatsRef = useRef(null);

    // Global Presence counter refs
    const gCountriesRef = useRef(null);
    const gClientsRef = useRef(null);
    const gCollectionsRef = useRef(null);
    const gExcellenceRef = useRef(null);

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
        const targetRot = -90 - (idx * 360) / 8;
        
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
            borderColor: "#C8A96A",
            boxShadow: "0 20px 40px rgba(200, 169, 106, 0.06)",
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
            borderColor: "#ECE8E2",
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

            // Section 2 (Legacy) Parallax & Scroll Reveal
            if (legacyImageRef.current && legacyImageContainerRef.current) {
                gsap.fromTo(legacyImageRef.current,
                    { yPercent: -15 },
                    {
                        yPercent: 15,
                        ease: "none",
                        scrollTrigger: {
                            trigger: legacyImageContainerRef.current,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    }
                );
            }

            const legacyContent = document.querySelector(".js-legacy-content");
            if (legacyContent) {
                gsap.fromTo(Array.from(legacyContent.children),
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.15,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: legacyContent,
                            start: "top 80%",
                            once: true
                        }
                    }
                );
            }

            // Section 3 (Craftsmanship) Image Parallax, Fade Ups, & Countup stats
            const craftImage = document.querySelector(".js-craft-image");
            const craftImageContainer = document.querySelector(".js-craft-image-container");
            if (craftImage && craftImageContainer) {
                gsap.fromTo(craftImage,
                    { yPercent: -12 },
                    {
                        yPercent: 12,
                        ease: "none",
                        scrollTrigger: {
                            trigger: craftImageContainer,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    }
                );
            }

            const craftContent = document.querySelector(".js-craft-content");
            if (craftContent) {
                gsap.fromTo(Array.from(craftContent.children),
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.15,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: craftContent,
                            start: "top 80%",
                            once: true
                        }
                    }
                );
            }

            if (craftsmanshipStatsRef.current) {
                const statsObj = { yexp: 0, jewels: 0, cert: 0 };
                gsap.to(statsObj, {
                    yexp: 20,
                    jewels: 10000,
                    cert: 100,
                    duration: 2.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: craftsmanshipStatsRef.current,
                        start: "top 85%",
                        once: true
                    },
                    onUpdate: () => {
                        if (yexpRef.current) yexpRef.current.innerText = Math.floor(statsObj.yexp) + "+";
                        if (jewelsRef.current) jewelsRef.current.innerText = Math.floor(statsObj.jewels).toLocaleString() + "+";
                        if (certRef.current) certRef.current.innerText = Math.floor(statsObj.cert) + "%";
                    }
                });
            }

            // Diamond Cuts Orbit Animation (Slow continuous rotation)
            const orbitTrack = orbitTrackRef.current;
            const orbitItems = document.querySelectorAll(".js-orbit-item");
            
            const updateOrbit = () => {
                const radius = window.innerWidth < 640 ? 110 : window.innerWidth < 1024 ? 170 : 230;
                orbitItems.forEach((item, idx) => {
                    const angle = (idx * 2 * Math.PI) / 8 + (orbitTrack.rotation * Math.PI) / 180;
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

            // Section 4 (Timeline) Horizontal Pinned Layout (only on screens >= 768px)
            if (timelineRef.current && timelineContainerRef.current && window.innerWidth >= 768) {
                const timelineEl = timelineRef.current;
                const containerEl = timelineContainerRef.current;
                const cards = timelineEl.querySelectorAll(".timeline-card");

                // Pin timeline scroll on screen width >= 768px
                const pinTrigger = ScrollTrigger.create({
                    trigger: containerEl,
                    start: "top top",
                    end: () => `+=${timelineEl.scrollWidth - window.innerWidth}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    animation: gsap.to(timelineEl, {
                        x: () => -(timelineEl.scrollWidth - window.innerWidth),
                        ease: "none"
                    })
                });

                // Horizontal stagger card reveals
                cards.forEach((card) => {
                    gsap.fromTo(card,
                        { opacity: 0, y: 60, scale: 0.95 },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.8,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: card,
                                containerAnimation: pinTrigger.animation,
                                start: "left 85%",
                                toggleActions: "play none none none"
                              }
                        }
                    );
                });
            }

            // Mobile vertical timeline reveals
            const mobileCards = document.querySelectorAll(".js-mobile-timeline-card");
            if (mobileCards.length > 0) {
                gsap.fromTo(Array.from(mobileCards),
                    { opacity: 0, x: -30 },
                    {
                        opacity: 1,
                        x: 0,
                        stagger: 0.15,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: ".js-mobile-timeline-container",
                            start: "top 80%",
                            once: true
                        }
                    }
                );
            }

            // Section 5 (Values) Grid Reveal
            if (valuesRef.current) {
                const cards = valuesRef.current.querySelectorAll(".js-value-card");
                gsap.fromTo(Array.from(cards),
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.15,
                        duration: 1.0,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: valuesRef.current,
                            start: "top 80%",
                            once: true
                        }
                    }
                );
            }

            // Section 6 (Gallery) Parallax and Card Reveals
            if (galleryRef.current) {
                const images = galleryRef.current.querySelectorAll(".js-gallery-img");
                const title = galleryRef.current.querySelector(".js-gallery-title");

                if (title) {
                    gsap.fromTo(title,
                        { opacity: 0, y: 35 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1.0,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: title,
                                start: "top 85%",
                                once: true
                            }
                        }
                    );
                }

                images.forEach((img) => {
                    const container = img.parentElement;
                    gsap.fromTo(img,
                        { yPercent: -10 },
                        {
                            yPercent: 10,
                            ease: "none",
                            scrollTrigger: {
                                trigger: container,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true
                            }
                        }
                    );
                });

                const cards = galleryRef.current.querySelectorAll(".js-gallery-card");
                gsap.fromTo(Array.from(cards),
                    { opacity: 0, scale: 0.95, y: 30 },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        stagger: 0.1,
                        duration: 1.0,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: galleryRef.current,
                            start: "top 75%",
                            once: true
                        }
                    }
                );
            }

            // Section 7 (Global Presence) Counter Animations
            if (globalStatsRef.current) {
                const globalStatsObj = { countries: 0, clients: 0, collections: 0, excellence: 0 };
                gsap.to(globalStatsObj, {
                    countries: 45,
                    clients: 15000,
                    collections: 12,
                    excellence: 20,
                    duration: 2.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: globalStatsRef.current,
                        start: "top 85%",
                        once: true
                    },
                    onUpdate: () => {
                        if (gCountriesRef.current) gCountriesRef.current.innerText = Math.floor(globalStatsObj.countries) + "+";
                        if (gClientsRef.current) gClientsRef.current.innerText = Math.floor(globalStatsObj.clients).toLocaleString() + "+";
                        if (gCollectionsRef.current) gCollectionsRef.current.innerText = Math.floor(globalStatsObj.collections) + "+";
                        if (gExcellenceRef.current) gExcellenceRef.current.innerText = Math.floor(globalStatsObj.excellence) + "+";
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
            <div className="w-full bg-[#FAF8F5] text-[#111111] font-sans selection:bg-[#C8A96A]/20 selection:text-[#111111] overflow-x-hidden">
                
                {/* ==================================================
                    SECTION 1: EDITORIAL STATIC LUXURY HERO (70vh)
                    ================================================== */}
                <section
                    className="relative h-[70vh] w-full overflow-hidden flex items-center justify-start bg-[#0F0F0F] text-white"
                >
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1920"
                            alt="DN Diamond Exquisite Jewelry Heritage"
                            className="w-full h-full object-cover brightness-[0.4]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent z-10" />
                    </div>

                    <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
                        <div className="max-w-2xl text-left space-y-6 js-about-hero-content">
                            <span className="inline-block text-[11px] font-bold tracking-[0.35em] text-[#C8A96A] uppercase opacity-0">
                                OUR STORY
                            </span>
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-white tracking-wide leading-[1.1] opacity-0">
                                Beyond Diamonds,<br />We Create Legacy.
                            </h1>
                            <div className="w-16 h-[1px] bg-[#C8A96A] opacity-0" />
                            <p className="text-neutral-300 font-sans font-light text-sm sm:text-base leading-relaxed max-w-lg opacity-0">
                                Every masterpiece begins with an extraordinary stone. At DN Diamond, we create jewellery that celebrates life's most meaningful moments through exceptional craftsmanship and timeless elegance.
                            </p>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                        <button
                            onClick={handleScrollToLegacy}
                            className="flex flex-col items-center group cursor-pointer focus:outline-none"
                            aria-label="Scroll down to heritage section"
                        >
                            <div className="relative w-[20px] h-[32px] border border-white/20 rounded-full flex justify-center p-1 group-hover:border-[#C8A96A] transition-colors duration-500">
                                <div className="w-[2px] h-[5px] bg-white rounded-full animate-bounce mt-1 group-hover:bg-[#C8A96A] transition-colors duration-500" />
                            </div>
                        </button>
                    </div>
                </section>

                {/* ==================================================
                    SECTION 2: OUR LEGACY (Split Layout)
                    ================================================== */}
                <section
                    id="section-legacy"
                    className="relative py-24 sm:py-32 lg:py-40 px-6 sm:px-12 lg:px-24 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center"
                >
                    {/* Left Column: Parallax Image */}
                    <div
                        ref={legacyImageContainerRef}
                        className="relative overflow-hidden h-[400px] sm:h-[550px] lg:h-[700px] w-full bg-[#ECE8E2]"
                    >
                        <img
                            ref={legacyImageRef}
                            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200"
                            alt="DN Diamond Exquisite Crafted Ring Detail"
                            className="absolute top-0 left-0 w-full h-[125%] object-cover"
                        />
                        <div className="absolute inset-0 bg-black/5" />
                    </div>

                    {/* Right Column: Editorial Copy */}
                    <div className="space-y-6 sm:space-y-8 js-legacy-content">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-[#C8A96A] uppercase block">
                            OUR HERITAGE
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-[#111111] leading-tight">
                            Our Legacy of Excellence
                        </h2>
                        <div className="w-16 h-[1px] bg-[#C8A96A]" />
                        <p className="text-neutral-700 font-sans font-light text-sm sm:text-base leading-relaxed">
                            Since our inception, DN Diamond has stood at the pinnacle of high jewellery, defining the art of diamond cutting and bespoke craftsmanship. Founded with a vision to create not just ornaments, but lasting legacies, our atelier has shaped the world’s most precious stones into works of timeless beauty.
                        </p>
                        <p className="text-neutral-600 font-sans font-light text-sm sm:text-base leading-relaxed">
                            Our story is written in light, facet by facet, stone by stone. Every jewel we create is a testament to the pursuit of absolute perfection. Inspired by classical proportions and driven by modern innovation, our master artisans craft heirlooms that bridge the gap between temporary trends and eternal heritage.
                        </p>
                        <div className="pt-4">
                            <a
                                href="/bespoke"
                                className="inline-flex items-center text-xs font-bold uppercase tracking-[0.25em] text-[#111111] hover:text-[#C8A96A] transition-colors duration-300 group"
                            >
                                Discover Bespoke Atelier
                                <FaChevronRight className="ml-2 text-[10px] transform group-hover:translate-x-1 transition-transform duration-300" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* ==================================================
                    SECTION 3: CRAFTSMANSHIP (Image Left, Text Right)
                    ================================================== */}
                <section className="bg-[#ECE8E2]/40 py-24 sm:py-32 lg:py-40">
                    <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
                        
                        {/* Left Column: Image (Jeweller Workbench) */}
                        <div className="md:order-1 order-2 js-craft-content space-y-6 sm:space-y-8">
                            <span className="text-[11px] font-bold tracking-[0.3em] text-[#C8A96A] uppercase block">
                                THE ARTISANS
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-[#111111] leading-tight">
                                Crafted Without Compromise.
                            </h2>
                            <div className="w-16 h-[1px] bg-[#C8A96A]" />
                            <p className="text-neutral-700 font-sans font-light text-sm sm:text-base leading-relaxed">
                                At DN Diamond, craftsmanship is a sacred dialogue between the artisan and the gem. Our bench jewellers possess decades of specialized experience, utilizing ancient hand-forging techniques alongside cutting-edge micro-setting precision.
                            </p>
                            <p className="text-neutral-600 font-sans font-light text-sm sm:text-base leading-relaxed">
                                Every setting is custom-built around the individual stone, ensuring that its unique fire and brilliance are highlighted from every angle. We select only conflict-free, GIA-certified diamonds of exceptional cut, color, and clarity, elevating them into extraordinary masterpieces.
                            </p>

                            {/* Counters Grid */}
                            <div
                                ref={craftsmanshipStatsRef}
                                className="grid grid-cols-3 gap-4 pt-6 border-t border-black/10"
                            >
                                <div>
                                    <span ref={yexpRef} className="block text-2xl sm:text-4xl font-serif font-light text-[#111111]">
                                        0+
                                    </span>
                                    <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-neutral-500 mt-1 block">
                                        Years Experience
                                    </span>
                                </div>
                                <div>
                                    <span ref={jewelsRef} className="block text-2xl sm:text-4xl font-serif font-light text-[#111111]">
                                        0+
                                    </span>
                                    <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-neutral-500 mt-1 block">
                                        Jewels Created
                                    </span>
                                </div>
                                <div>
                                    <span ref={certRef} className="block text-2xl sm:text-4xl font-serif font-light text-[#111111]">
                                        0%
                                    </span>
                                    <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-neutral-500 mt-1 block">
                                        Certified Diamonds
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Artisan Photo */}
                        <div className="md:order-2 order-1 js-craft-image-container relative overflow-hidden h-[400px] sm:h-[550px] lg:h-[700px] w-full bg-[#ECE8E2]">
                            <img
                                src="https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?q=80&w=1200"
                                alt="DN Diamond Jeweller at Workbench Handcrafting Fine Ring"
                                className="absolute top-0 left-0 w-full h-[125%] object-cover js-craft-image"
                            />
                            <div className="absolute inset-0 bg-black/5" />
                        </div>

                    </div>
                </section>

                {/* ==================================================
                    SECTION 3.5: THE GEOMETRY OF LIGHT (Signature Cuts Circular Orbit Carousel)
                    ================================================== */}
                <section
                    ref={orbitSectionRef}
                    className="py-24 sm:py-32 bg-[#FAF8F5] relative border-t border-[#ECE8E2] overflow-hidden"
                >
                    <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        
                        {/* Left Column: Interactive Circular Orbit Widget */}
                        <div className="lg:col-span-7 flex justify-center items-center h-[420px] sm:h-[600px] relative">
                            {/* Circular Track Line */}
                            <div className="js-orbit-container w-[220px] h-[220px] sm:w-[340px] sm:h-[340px] lg:w-[460px] lg:h-[460px] rounded-full border border-[#C8A96A]/20 border-dashed relative flex items-center justify-center">
                                
                                {/* Central Details Frame */}
                                <div className="absolute w-[120px] h-[120px] sm:w-[190px] sm:h-[190px] rounded-full bg-[#FAF8F5] border border-[#C8A96A]/20 flex flex-col items-center justify-center p-4 shadow-inner z-10">
                                    <div className="w-12 h-12 sm:w-20 sm:h-20 text-[#C8A96A]/85 transition-all duration-300 hover:scale-105">
                                        {DIAMOND_SHAPES[activeShapeIdx].icon("#C8A96A")}
                                    </div>
                                    <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-[#C8A96A] uppercase mt-2 text-center max-w-[100px] sm:max-w-none">
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
                                                ? "border-[#C8A96A] shadow-md scale-110 ring-4 ring-[#C8A96A]/10 z-20"
                                                : "border-[#ECE8E2] opacity-75 hover:opacity-100 hover:border-neutral-400 z-10"
                                                }`}
                                            aria-label={`Show details of ${shape.name}`}
                                        >
                                            <div className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-300 ${isActive ? "text-[#C8A96A]" : "text-neutral-400 group-hover:text-[#C8A96A]"}`}>
                                                {shape.icon(isActive ? "#C8A96A" : "#888888")}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Column: Editorial Detailed Information Text */}
                        <div className="lg:col-span-5 text-left space-y-6 sm:space-y-8 js-shape-details">
                            <span className="text-[11px] font-bold tracking-[0.3em] text-[#C8A96A] uppercase block">
                                THE GEOMETRY OF LIGHT
                            </span>
                            <div className="space-y-4">
                                <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-[#111111] leading-tight">
                                    {DIAMOND_SHAPES[activeShapeIdx].name}
                                </h2>
                                <div className="w-16 h-[1px] bg-[#C8A96A]" />
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

                            <div className="pt-4">
                                <button className="group relative overflow-hidden px-8 py-3.5 border border-[#111111] text-[#111111] text-xs font-bold uppercase tracking-[0.2em] bg-transparent transition-colors duration-500 hover:border-[#C8A96A] focus:outline-none">
                                    <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                                        Inquire About Cut
                                    </span>
                                    <span className="absolute inset-0 bg-[#C8A96A] origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 -z-0" />
                                </button>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ==================================================
                    SECTION 4: TIMELINE (Horizontal Pinned Desktop / Vertical Stack Mobile)
                    ================================================== */}
                {/* Desktop Pin Section */}
                <section
                    ref={timelineContainerRef}
                    className="relative bg-[#0F0F0F] text-[#FAF8F5] py-24 lg:py-32 overflow-hidden hidden md:block"
                >
                    <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 mb-16">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-[#C8A96A] uppercase block mb-3">
                            CREATION JOURNEY
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-white leading-tight">
                            The Diamond Journey
                        </h2>
                    </div>

                    <div
                        ref={timelineRef}
                        className="flex gap-12 px-6 sm:px-12 lg:px-24 items-center w-[230vw] h-[500px]"
                    >
                        {TIMELINE_STEPS.map((step, idx) => (
                            <div
                                key={idx}
                                className="timeline-card flex-shrink-0 w-[360px] lg:w-[420px] bg-[#171717] border border-white/5 p-8 lg:p-10 relative flex flex-col justify-between h-[380px] group hover:border-[#C8A96A]/30 transition-colors duration-500"
                            >
                                <div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-bold tracking-widest text-[#C8A96A] uppercase">
                                            {step.subtitle}
                                        </span>
                                        <span className="text-4xl lg:text-5xl font-serif font-light text-white/10 group-hover:text-[#C8A96A]/20 transition-colors duration-500">
                                            {step.step}
                                        </span>
                                    </div>
                                    <h3 className="text-xl lg:text-2xl font-serif font-light text-white tracking-wide mt-6 mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-neutral-400 font-sans font-light text-xs lg:text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                                <div className="w-full h-[1px] bg-white/10 group-hover:bg-[#C8A96A]/30 transition-colors duration-500 mt-6" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mobile Chronological Stack Section */}
                <section className="bg-[#0F0F0F] text-[#FAF8F5] py-20 px-6 block md:hidden">
                    <div className="mb-12 text-left">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-[#C8A96A] uppercase block mb-2">
                            CREATION JOURNEY
                        </span>
                        <h2 className="text-3xl font-serif font-light tracking-wide text-white">
                            The Diamond Journey
                        </h2>
                    </div>

                    <div className="js-mobile-timeline-container relative pl-6 border-l border-white/10 space-y-12">
                        {TIMELINE_STEPS.map((step, idx) => (
                            <div
                                key={idx}
                                className="js-mobile-timeline-card relative space-y-2 text-left"
                            >
                                <div className="absolute -left-[30px] top-1.5 w-2 h-2 bg-[#C8A96A] rounded-full" />
                                <span className="text-[9px] font-bold tracking-widest text-[#C8A96A] uppercase block">
                                    {step.step} / {step.subtitle}
                                </span>
                                <h3 className="text-lg font-serif font-light text-white tracking-wide">
                                    {step.title}
                                </h3>
                                <p className="text-neutral-400 font-sans font-light text-xs leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ==================================================
                    SECTION 5: OUR VALUES (Grid layout with 3D Tilt)
                    ================================================== */}
                <section
                    ref={valuesRef}
                    className="py-24 sm:py-32 lg:py-40 px-6 sm:px-12 lg:px-24 max-w-[1600px] mx-auto text-center"
                >
                    <div className="max-w-2xl mx-auto mb-16 sm:mb-24">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-[#C8A96A] uppercase block mb-3">
                            PHILOSOPHY
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-[#111111] leading-tight">
                            Our Core Values
                        </h2>
                        <p className="text-neutral-500 font-sans font-light text-sm sm:text-base leading-relaxed mt-4">
                            We operate under an unyielding framework of responsibility, artistic design, and precision alignment, ensuring that the legacy we build mirrors the perfection of our stones.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 [perspective:1000px]">
                        {/* Authenticity */}
                        <div
                            onMouseEnter={handleCardMouseEnter}
                            onMouseLeave={handleCardMouseLeave}
                            className="js-value-card bg-white border border-[#ECE8E2] p-8 lg:p-12 text-left flex flex-col justify-between h-[280px] sm:h-[300px] transition-all duration-300"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="p-3 bg-[#FAF8F5] border border-[#ECE8E2] text-[#C8A96A] rounded-full">
                                        <FaCertificate className="text-lg" />
                                    </span>
                                    <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-300">01</span>
                                </div>
                                <h3 className="text-xl font-serif font-light tracking-wide text-[#111111]">
                                    Authenticity
                                </h3>
                                <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm leading-relaxed">
                                    Every stone carries a unique laser-inscribed GIA registry, ensuring unmatched certification, origin transparency, and lifelong verification.
                                </p>
                            </div>
                        </div>

                        {/* Precision */}
                        <div
                            onMouseEnter={handleCardMouseEnter}
                            onMouseLeave={handleCardMouseLeave}
                            className="js-value-card bg-white border border-[#ECE8E2] p-8 lg:p-12 text-left flex flex-col justify-between h-[280px] sm:h-[300px] transition-all duration-300"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="p-3 bg-[#FAF8F5] border border-[#ECE8E2] text-[#C8A96A] rounded-full">
                                        <FaGem className="text-lg" />
                                    </span>
                                    <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-300">02</span>
                                </div>
                                <h3 className="text-xl font-serif font-light tracking-wide text-[#111111]">
                                    Precision
                                </h3>
                                <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm leading-relaxed">
                                    Crafted to tolerances measured in microns. Our settings maximize light dispersion, highlighting the individual fire and brilliance of the diamond.
                                </p>
                            </div>
                        </div>

                        {/* Integrity */}
                        <div
                            onMouseEnter={handleCardMouseEnter}
                            onMouseLeave={handleCardMouseLeave}
                            className="js-value-card bg-white border border-[#ECE8E2] p-8 lg:p-12 text-left flex flex-col justify-between h-[280px] sm:h-[300px] transition-all duration-300"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="p-3 bg-[#FAF8F5] border border-[#ECE8E2] text-[#C8A96A] rounded-full">
                                        <FaShieldAlt className="text-lg" />
                                    </span>
                                    <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-300">03</span>
                                </div>
                                <h3 className="text-xl font-serif font-light tracking-wide text-[#111111]">
                                    Integrity
                                </h3>
                                <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm leading-relaxed">
                                    We strictly adhere to the Kimberley Process and ethical sourcing standards, ensuring each gem is responsibly mined and socially positive.
                                </p>
                            </div>
                        </div>

                        {/* Legacy */}
                        <div
                            onMouseEnter={handleCardMouseEnter}
                            onMouseLeave={handleCardMouseLeave}
                            className="js-value-card bg-white border border-[#ECE8E2] p-8 lg:p-12 text-left flex flex-col justify-between h-[280px] sm:h-[300px] transition-all duration-300"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="p-3 bg-[#FAF8F5] border border-[#ECE8E2] text-[#C8A96A] rounded-full">
                                        <FaCrown className="text-lg" />
                                    </span>
                                    <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-300">04</span>
                                </div>
                                <h3 className="text-xl font-serif font-light tracking-wide text-[#111111]">
                                    Legacy
                                </h3>
                                <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm leading-relaxed">
                                    We design jewelry to be lived in, loved, and passed down. Each piece is constructed with structural longevity to become a family heirloom.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ==================================================
                    SECTION 6: LUXURY GALLERY (Masonry Layout with Hover Zoom)
                    ================================================== */}
                <section
                    ref={galleryRef}
                    className="py-24 sm:py-32 lg:py-40 bg-[#ECE8E2]/25 overflow-hidden"
                >
                    <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 mb-16 sm:mb-24 text-center js-gallery-title">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-[#C8A96A] uppercase block mb-3">
                            THE COLLECTIONS
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-[#111111] leading-tight">
                            An Assembly of Brilliance
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">

                        {/* Gallery Item 1: Wide Solitaire Ring */}
                        <div className="js-gallery-card md:col-span-2 relative overflow-hidden group h-[300px] sm:h-[400px] bg-[#ECE8E2]">
                            <img
                                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800"
                                alt="Stella Solitaire Ring Presentation Case"
                                className="absolute top-0 left-0 w-full h-[120%] object-cover js-gallery-img transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
                            <div className="absolute bottom-6 left-6 z-10 text-left">
                                <span className="text-[9px] font-bold tracking-[0.25em] text-[#C8A96A] uppercase">SOLITAIRE STUDY</span>
                                <h3 className="text-lg sm:text-xl font-serif font-light text-white mt-1">The Stella Solitaire</h3>
                            </div>
                        </div>

                        {/* Gallery Item 2: Portrait Choker */}
                        <div className="js-gallery-card md:col-span-1 relative overflow-hidden group h-[300px] sm:h-[400px] bg-[#ECE8E2]">
                            <img
                                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800"
                                alt="Aura Gold Diamond Choker Necklace Detail"
                                className="absolute top-0 left-0 w-full h-[120%] object-cover js-gallery-img transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
                            <div className="absolute bottom-6 left-6 z-10 text-left">
                                <span className="text-[9px] font-bold tracking-[0.25em] text-[#C8A96A] uppercase">ATELIER HIGHLIGHTS</span>
                                <h3 className="text-lg sm:text-xl font-serif font-light text-white mt-1">Aura Diamond Choker</h3>
                            </div>
                        </div>

                        {/* Gallery Item 3: Rose Ring */}
                        <div className="js-gallery-card md:col-span-1 relative overflow-hidden group h-[400px] sm:h-[500px] bg-[#ECE8E2]">
                            <img
                                src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800"
                                alt="La Rose Gold Ring Crafting Study"
                                className="absolute top-0 left-0 w-full h-[120%] object-cover js-gallery-img transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
                            <div className="absolute bottom-6 left-6 z-10 text-left">
                                <span className="text-[9px] font-bold tracking-[0.25em] text-[#C8A96A] uppercase">CRAFT STUDIES</span>
                                <h3 className="text-lg sm:text-xl font-serif font-light text-white mt-1">La Rose Ring Study</h3>
                            </div>
                        </div>

                        {/* Gallery Item 4: Diamond drops model */}
                        <div className="js-gallery-card md:col-span-1 relative overflow-hidden group h-[400px] sm:h-[500px] bg-[#ECE8E2]">
                            <img
                                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800"
                                alt="Model Wearing Elysian Diamond Drop Earrings"
                                className="absolute top-0 left-0 w-full h-[120%] object-cover js-gallery-img transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
                            <div className="absolute bottom-6 left-6 z-10 text-left">
                                <span className="text-[9px] font-bold tracking-[0.25em] text-[#C8A96A] uppercase">EDITORIAL COLLECTION</span>
                                <h3 className="text-lg sm:text-xl font-serif font-light text-white mt-1">Elysian Diamond Drops</h3>
                            </div>
                        </div>

                        {/* Gallery Item 5: Bridal bands */}
                        <div className="js-gallery-card md:col-span-1 relative overflow-hidden group h-[400px] sm:h-[500px] bg-[#ECE8E2]">
                            <img
                                src="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800"
                                alt="Signature Diamond Gold Bridal Band Stack"
                                className="absolute top-0 left-0 w-full h-[120%] object-cover js-gallery-img transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
                            <div className="absolute bottom-6 left-6 z-10 text-left">
                                <span className="text-[9px] font-bold tracking-[0.25em] text-[#C8A96A] uppercase">THE WEDDING BAND</span>
                                <h3 className="text-lg sm:text-xl font-serif font-light text-white mt-1">Signature Bridal Band</h3>
                            </div>
                        </div>

                        {/* Gallery Item 6: Marquise Brooch */}
                        <div className="js-gallery-card md:col-span-3 relative overflow-hidden group h-[300px] sm:h-[450px] bg-[#ECE8E2]">
                            <img
                                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200"
                                alt="Imperial Marquise Diamond Brooch Close-up Portrait"
                                className="absolute top-0 left-0 w-full h-[120%] object-cover js-gallery-img transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
                            <div className="absolute bottom-6 left-6 z-10 text-left">
                                <span className="text-[9px] font-bold tracking-[0.25em] text-[#C8A96A] uppercase">HERITAGE PIECE</span>
                                <h3 className="text-lg sm:text-2xl font-serif font-light text-white mt-1">Imperial Marquise Brooch</h3>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ==================================================
                    SECTION 7: GLOBAL PRESENCE (SVG Constellation Map & Counters)
                    ================================================== */}
                <section
                    ref={globalStatsRef}
                    className="relative bg-[#0F0F0F] text-white py-24 sm:py-32 lg:py-40 overflow-hidden"
                >
                    {/* Custom SVG World Map background */}
                    <div className="absolute inset-0 w-full h-full z-0">
                        <svg
                            className="absolute inset-0 w-full h-full opacity-[0.08] stroke-[#C8A96A] fill-none"
                            viewBox="0 0 1000 500"
                            preserveAspectRatio="xMidYMid slice"
                        >
                            <path d="M 0 100 L 1000 100 M 0 200 L 1000 200 M 0 300 L 1000 300 M 0 400 L 1000 400" strokeWidth="0.5" strokeDasharray="3,6" />
                            <path d="M 200 0 L 200 500 M 400 0 L 400 500 M 600 0 L 600 500 M 800 0 L 800 500" strokeWidth="0.5" strokeDasharray="3,6" />

                            <path d="M 80 120 C 130 90, 200 140, 280 220 Q 310 260 250 340 T 120 220 Z" strokeWidth="1" strokeDasharray="6,6" />
                            <path d="M 250 340 Q 300 380 280 460 T 220 440 Z" strokeWidth="1" strokeDasharray="6,6" />
                            <path d="M 430 120 Q 530 60, 680 100 T 820 150 Q 860 210, 800 300 T 670 280 Q 560 300, 460 230 Z" strokeWidth="1" strokeDasharray="6,6" />
                            <path d="M 450 250 Q 510 270, 540 370 T 470 450 Q 400 390, 420 290 Z" strokeWidth="1" strokeDasharray="6,6" />
                            <path d="M 770 380 Q 850 400, 820 450 T 750 430 Z" strokeWidth="1" strokeDasharray="6,6" />

                            <g className="stroke-[#C8A96A]/60" strokeWidth="0.75">
                                <path d="M 230 200 Q 490 140, 750 260" strokeDasharray="4,4" />
                                <path d="M 460 160 Q 605 190, 750 260" strokeDasharray="4,4" />
                                <path d="M 480 175 Q 615 200, 750 260" strokeDasharray="4,4" />
                                <path d="M 490 190 Q 620 210, 750 260" strokeDasharray="4,4" />
                                <path d="M 810 225 Q 780 240, 750 260" strokeDasharray="4,4" />
                            </g>

                            <g>
                                <circle cx="750" cy="260" r="5" fill="#C8A96A" />
                                <circle cx="750" cy="260" r="14" stroke="#C8A96A" strokeWidth="1.5" opacity="0.55" className="animate-ping" style={{ transformOrigin: "750px 260px" }} />
                            </g>

                            <circle cx="230" cy="200" r="3.5" fill="#C8A96A" opacity="0.8" />
                            <circle cx="460" cy="160" r="3.5" fill="#C8A96A" opacity="0.8" />
                            <circle cx="480" cy="175" r="3.5" fill="#C8A96A" opacity="0.8" />
                            <circle cx="490" cy="190" r="3.5" fill="#C8A96A" opacity="0.8" />
                            <circle cx="810" cy="225" r="3.5" fill="#C8A96A" opacity="0.8" />
                        </svg>
                    </div>

                    <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">

                        <div className="max-w-2xl text-left mb-16 sm:mb-24">
                            <span className="text-[11px] font-bold tracking-[0.3em] text-[#C8A96A] uppercase block mb-3">
                                GLOBAL FOOTPRINT
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-white leading-tight">
                                Our Global Presence
                            </h2>
                            <p className="text-neutral-400 font-sans font-light text-sm sm:text-base leading-relaxed mt-4">
                                Headquartered in Hong Kong, DN Diamond services the world’s most prestigious clienteles. Our private ateliers in Paris, Geneva, New York, London, and Tokyo provide an exclusive, high-security space for custom consultations.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pt-12 border-t border-white/10">
                            <div className="text-left">
                                <span ref={gCountriesRef} className="block text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#C8A96A]">
                                    0+
                                </span>
                                <span className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-neutral-400 mt-2 block">
                                    Countries Served
                                </span>
                            </div>

                            <div className="text-left">
                                <span ref={gClientsRef} className="block text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#C8A96A]">
                                    0+
                                </span>
                                <span className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-neutral-400 mt-2 block">
                                    Happy Clients
                                </span>
                            </div>

                            <div className="text-left">
                                <span ref={gCollectionsRef} className="block text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#C8A96A]">
                                    0+
                                </span>
                                <span className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-neutral-400 mt-2 block">
                                    Luxury Collections
                                </span>
                            </div>

                            <div className="text-left">
                                <span ref={gExcellenceRef} className="block text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#C8A96A]">
                                    0+
                                </span>
                                <span className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-neutral-400 mt-2 block">
                                    Years of Excellence
                                </span>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ==================================================
                    SECTION 8: FINAL CTA (Luxury Dark Section)
                    ================================================== */}
                <section className="bg-[#0F0F0F] py-24 sm:py-32 lg:py-40 text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C8A96A]/5 rounded-full blur-[120px] pointer-events-none" />
                    
                    <div className="relative z-10 max-w-3xl mx-auto px-6 js-cta-content space-y-6 sm:space-y-8">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-[#C8A96A] uppercase block">
                            THE NEXT CHAPTER
                        </span>
                        <h2 className="text-4xl sm:text-6xl font-serif font-light tracking-wide text-white leading-tight">
                            Crafting Tomorrow's Heirlooms.
                        </h2>
                        <p className="text-neutral-400 font-sans font-light text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                            Discover jewellery that reflects timeless elegance and extraordinary craftsmanship. Connect with our concierge to reserve a private atelier consultation.
                        </p>
                        
                        <div className="pt-8">
                            <a href="/jewelry">
                                <button className="group relative overflow-hidden px-10 py-4 bg-[#C8A96A] border border-[#C8A96A] text-[#111111] text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 focus:outline-none">
                                    <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                                        Explore Collection
                                    </span>
                                    <span className="absolute inset-0 bg-[#111111] origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 -z-0" />
                                </button>
                            </a>
                        </div>
                    </div>
                </section>

            </div>
        </Layout>
    );
}
