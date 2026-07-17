"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { useStore } from "@/context/StoreContext";
import CategoryCarousel from "@/components/ui/CategoryCarousel";
import ExploreDiamonds from "@/components/ui/ExploreDiamonds";
import ProductCard from "@/components/ui/ProductCard";
import EditorialBlock from "@/components/ui/EditorialBlock";
import { useDispatch, useSelector } from "react-redux";
import { fetchMainPage } from "@/redux/landingSlice";

const MARQUEE_ITEMS = [
  "Fine Jewellery",
  "Certified Diamonds",
  "Bespoke Design",
  "18K & Platinum",
  "GIA Certified",
  "Conflict-Free Gems",
  "Fine Jewellery",
  "Certified Diamonds",
  "Bespoke Design",
  "18K & Platinum",
  "GIA Certified",
  "Conflict-Free Gems",
];

async function loadGSAP() {
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  const { Observer } = await import("gsap/Observer");
  gsap.registerPlugin(ScrollTrigger, Observer);
  return { gsap, ScrollTrigger, Observer };
}

function useReveal(
  ref,
  { y = 36, duration = 0.8, stagger = 0, delay = 0, start = "top 85%" } = {},
) {
  useEffect(() => {
    if (!ref.current) return;
    let ctx;
    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      const targets = stagger ? Array.from(ref.current.children) : ref.current;
      ctx = gsap.context(() => {
        gsap.fromTo(
          targets,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            stagger: stagger || 0,
            ease: "power3.out",
            scrollTrigger: { trigger: ref.current, start, once: true },
          },
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
    <div
      className={
        dark
          ? "bg-neutral-955 border-y border-neutral-800 py-3.5 overflow-hidden"
          : "bg-neutral-50 border-y border-neutral-100 py-3.5 overflow-hidden"
      }
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform"
      >
        {MARQUEE_ITEMS.map((item, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-4 px-6 font-serif text-[10px] lg:text-[11px] xl:text-xs tracking-[0.3em] uppercase ${dark ? "text-neutral-500" : "text-neutral-400"}`}
          >
            {item}{" "}
            <span className={dark ? "text-neutral-700" : "text-neutral-200"}>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function BestSellersGrid() {
  const { bestProducts } = useSelector((state) => state.landing); const gridRef = useRef(null);
  useReveal(gridRef, { stagger: 0.1, y: 28, duration: 0.7, start: "top 82%" });
  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-12"
    >
      {bestProducts?.map((prod) => {
        return (
          <div key={prod?._id} className=" h-full">
            <ProductCard item={prod} />
          </div>
        );
      })}
    </div>
  );
}

const FAQ_ITEMS = [
  {
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 5–7 business days. Express shipping (2–3 days) is available at checkout.",
  },
  {
    question: "Are your jewellery pieces certified and hallmarked?",
    answer:
      "Yes, all our jewellery pieces are officially certified and hallmarked. Every diamond above 0.5 carats is accompanied by an original GIA or IGI certificate, ensuring its color, clarity, cut, and weight are verified to international standards.",
  },
  {
    question: "Can I request a bespoke piece?",
    answer:
      "Absolutely. We specialise in custom fine jewellery. You can collaborate directly with our designers and master craftspeople to create a unique piece from select diamonds and precious metals. Please visit our Bespoke section or schedule a consultation.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for standard, non-customised jewellery items in their original, unworn condition. Customised and bespoke designs are final sale due to their unique, individual nature, but are covered under our lifetime craftsmanship warranty.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className=" py-20 px-6 sm:px-10 lg:px-16 border-t border-neutral-100"
    >
      <div className="mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16">
        {/* Left Column: 5/12 width */}
        <div className="md:col-span-5 space-y-6 text-left">
          <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.25em] text-neutral-500 uppercase">
            Need Help?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight font-light text-neutral-900 tracking-wide">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm font-light text-neutral-500 leading-relaxed max-w-sm">
            Everything you need to know about our jewellery, customisation,
            certifications, and after-sales care.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-neutral-900 rounded-full text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors duration-300"
            >
              View all questions <span className="text-sm">→</span>
            </Link>
          </div>
        </div>

        {/* Right Column: 7/12 width */}
        <div className="md:col-span-7 space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border-b border-neutral-200/60 pb-4 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between py-3 text-left focus:outline-none cursor-pointer"
                >
                  <span className="font-serif text-sm sm:text-base font-medium text-neutral-900 tracking-wide pr-4">
                    {item.question}
                  </span>
                  <span className="text-lg sm:text-xl font-light text-neutral-400 select-none">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-xs sm:text-sm font-light text-neutral-500 leading-relaxed pl-1 pb-2 max-w-2xl">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CustomBespokeBanner() {
  const bannerRef = useRef(null);
  useEffect(() => {
    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      if (!bannerRef.current) return;
      gsap.fromTo(
        bannerRef.current.querySelector(".js-banner-content"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bannerRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    });
  }, []);

  return (
    <section
      ref={bannerRef}
      className="relative h-[360px] sm:h-[480px] w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background Image with Parallax Drift / Cover */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1920"
          alt="Bespoke Craftsmanship Studio"
          className="w-full h-full object-cover scale-105"
        />
        {/* Dark overlay with premium opacity */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
      </div>

      {/* Banner Content Container */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-6 js-banner-content opacity-0">
        <span className="block text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.35em] text-white/80 uppercase">
          Create Something That's Yours
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-white tracking-wide leading-tight">
          Customize every detail – from
          <br className="hidden sm:inline" /> diamond selection to the final
          design.
        </h2>
        <div className="pt-4">
          <Link
            href="/bespoke"
            className="inline-block px-8 py-3 bg-white text-black font-sans font-semibold text-[11px] sm:text-xs uppercase tracking-[0.2em] rounded-full hover:bg-neutral-100 transition-colors duration-300 shadow-sm cursor-pointer"
          >
            Design Your Piece
          </Link>
        </div>
      </div>
    </section>
  );
}

function ParallaxImage({ src, alt, className }) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  useEffect(() => {
    let ctx;
    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          imgRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: wrapRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );
      });
    });
    return () => ctx && ctx.revert();
  }, []);
  return (
    <div ref={wrapRef} className={`overflow-hidden ${className || ""}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="h-full w-full object-cover will-change-transform scale-110"
      />
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
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center"
    >
      {stats.map((s) => (
        <div key={s.n} className="opacity-0">
          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-neutral-955 mb-1">
            {s.n}
          </p>
          <p className="text-[10px] lg:text-[11px] xl:text-xs text-neutral-400 font-medium tracking-widest uppercase">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

const hasSlideText = (slide) => {
  return !!(
    (slide?.title && slide.title.trim() !== "") ||
    (slide?.label && slide.label.trim() !== "") ||
    (slide?.description && slide.description.trim() !== "")
  );
};

export default function Home() {
  const { formatPrice } = useStore();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.landing);
  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

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

  useEffect(() => {
    dispatch(fetchMainPage());
  }, [dispatch]);

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
        <span
          className="inline-block js-split-para font-light text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl"
          style={{ opacity: 0 }}
        >
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
      const nextIdx = (slideRef.current + 1) % items.length;
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

    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: "power3.out" },
      );
    }
    if (label) {
      gsap.fromTo(
        label,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.5 },
      );
    }
    if (lines && lines.length) {
      gsap.fromTo(
        lines,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1.2,
          ease: "power4.out",
          delay: 0.6,
        },
      );
    }
    if (paras && paras.length) {
      gsap.fromTo(
        paras,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1.0,
          ease: "power3.out",
          delay: 0.8,
        },
      );
    }
    if (button) {
      gsap.fromTo(
        button,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 1.0 },
      );
    }

    // Slow subtle zoom drift
    if (img) {
      gsap.to(img, { scale: 1.05, duration: 6, ease: "none", delay: 2 });
    }
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
    if (toImg) gsap.set(toImg, { scale: 1.15, opacity: 0 });
    if (toLines && toLines.length) gsap.set(toLines, { yPercent: 120, opacity: 0 });
    if (toParas && toParas.length) gsap.set(toParas, { yPercent: 100, opacity: 0 });
    if (toLabel) gsap.set(toLabel, { y: 20, opacity: 0 });
    if (toButton) gsap.set(toButton, { y: 30, opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(fromSlide, { opacity: 0, zIndex: 0 });
        setCurrentSlide(toIdx);
        slideRef.current = toIdx;
        isAnimatingRef.current = false;
      },
    });

    // Fade out previous slide elements
    if (fromImg)
      tl.to(fromImg, { opacity: 0, duration: 1.2, ease: "power2.inOut" }, 0);
    if (fromLines && fromLines.length)
      tl.to(
        fromLines,
        {
          yPercent: -100,
          opacity: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: "power3.in",
        },
        0,
      );
    if (fromParas && fromParas.length)
      tl.to(
        fromParas,
        {
          yPercent: -80,
          opacity: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: "power3.in",
        },
        0,
      );
    if (fromLabel)
      tl.to(
        fromLabel,
        { y: -20, opacity: 0, duration: 0.6, ease: "power2.in" },
        0,
      );
    if (fromButton)
      tl.to(
        fromButton,
        { y: -20, opacity: 0, duration: 0.6, ease: "power2.in" },
        0,
      );

    // Bring in new slide elements
    if (toImg) {
      tl.to(
        toImg,
        { opacity: 1, scale: 1, duration: 1.6, ease: "power3.out" },
        0.2,
      );
    }
    if (toLabel) {
      tl.to(
        toLabel,
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        0.4,
      );
    }
    if (toLines && toLines.length) {
      tl.to(
        toLines,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1.2,
          ease: "power4.out",
        },
        0.5,
      );
    }
    if (toParas && toParas.length) {
      tl.to(
        toParas,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1.0,
          ease: "power3.out",
        },
        0.7,
      );
    }
    if (toButton) {
      tl.to(
        toButton,
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        0.9,
      );
    }

    // Continue drift
    if (toImg) {
      tl.to(toImg, { scale: 1.05, duration: 5, ease: "none" }, 1.8);
    }
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
        gsap.fromTo(
          fill,
          { height: "0%" },
          { height: "100%", duration: 6, ease: "none" },
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
                if (isScrollDown && slideRef.current < items?.length - 1) {
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
            },
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
      <div className="w-full flex flex-col  overflow-x-hidden select-none">
        {/* ==================================================
                    SECTION 1: FULLSCREEN HERO CAROUSEL (100dvh)
                    ================================================== */}
        <section
          ref={heroContainerRef}
          className="relative h-[100dvh] min-h-[600px] w-full bg-[#0F0F0F] overflow-hidden select-none"
        >
          {/* Background Images Layer */}
          {items?.map((slide, idx) => {
            const hasText = hasSlideText(slide);
            return (
              <div
                key={idx}
                ref={(el) => (slideContainersRef.current[idx] = el)}
                className="absolute inset-0 w-full h-full flex items-center justify-start opacity-0 z-0"
              >
                {/* Background Photo */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={slide?.image?.image}
                    alt={slide?.title || "Dndiamond Hero Image"}
                    className="w-full h-full object-cover select-none js-hero-img"
                    style={{ transform: "scale(1.15)" }}
                  />
                  {hasText && (
                    <>
                      {/* Luxury Cinematic Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent z-10" />
                      <div className="absolute inset-0 bg-black/10 z-10" />
                    </>
                  )}
                </div>

                {/* Slide Content Layer */}
                {hasText && (
                  <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 flex items-center h-full">
                    <div className="max-w-2xl text-left space-y-6 js-hero-content">
                      {/* Category Label */}
                      {slide.label && slide.label.trim() !== "" && (
                        <span className="inline-block text-[11px] font-bold tracking-[0.3em] text-neutral-400 uppercase js-hero-label">
                          {slide.label}
                        </span>
                      )}

                      {/* Headline */}
                      {slide.title && slide.title.trim() !== "" && (
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-white tracking-wide leading-[1.1] md:leading-[1.05]">
                          {renderSplitTitle(slide.title)}
                        </h1>
                      )}

                      {/* Description */}
                      {slide.description && slide.description.trim() !== "" && (
                        <div className="mt-2 text-neutral-300">
                          {renderSplitDescription(slide.description)}
                        </div>
                      )}

                      {/* Call To Action Button */}
                      <div className="pt-4 js-hero-button">
                        <Link href={"/diamonds"} passHref>
                          <button className="group relative overflow-hidden px-8 py-3.5 border border-white/30 text-white text-xs font-bold uppercase tracking-[0.2em] bg-white/10 backdrop-blur-md transition-all duration-500 hover:border-white focus:outline-none shadow-lg">
                            <span className="relative z-10 group-hover:text-black transition-colors duration-500">
                              Shop Collection
                            </span>
                            <span className="absolute inset-0 bg-white origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 -z-0" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Vertical Progress Indicators (Right Side) */}
          <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 z-40 flex flex-col space-y-3">
            {items?.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleProgressClick(idx)}
                className="group relative flex items-center justify-end py-3 px-6 focus:outline-none cursor-pointer"
                aria-label={`Go to slide ${idx + 1}`}
              >
                {/* Descriptive label appearing on hover */}
                <span className="text-[10px] font-sans font-medium tracking-[0.25em] text-white/60 group-hover:text-white transition-colors duration-300 mr-4 opacity-0 group-hover:opacity-100 uppercase hidden sm:inline-block">
                  {items?.[idx]?.label}
                </span>

                {/* Progress bar container */}
                <div className="relative h-10 w-[2px] bg-white/20 transition-all duration-300 group-hover:bg-white/30">
                  <div className="absolute top-0 left-0 w-full bg-white js-progress-fill" />
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
              <div className="relative w-[22px] h-[36px] border border-white/30 rounded-full flex justify-center p-1 group-hover:border-white transition-colors duration-500">
                <div className="w-[2px] h-[7px] bg-white rounded-full animate-bounce mt-1 group-hover:bg-white transition-colors duration-500" />
              </div>
              <span className="text-[9px] font-sans tracking-[0.3em] uppercase text-white/50 group-hover:text-white transition-colors duration-500 mt-2 block">
                Scroll
              </span>
            </button>
          </div>
        </section>
        {/* ==================================================
                    SECTION 2: SHOP BY CATEGORY
                    ================================================== */}
        <section id="section-categories" className="py-10">
          <div className="text-center space-y-2 ">
            <h2 className="font-serif text-3xl font-medium  tracking-wide text-black">
              Shop by Category
            </h2>
          </div>
          <div className="mx-auto px-6 sm:px-10 lg:px-16 text-neutral-900">
            <CategoryCarousel headerRef={catHeadRef} />
          </div>
        </section>

        {/* Explore Diamonds shape cut section */}
        <ExploreDiamonds />

        {/* BEST SELLERS */}
        <section className="">
          <div className="mx-auto  px-6 sm:px-10 lg:px-16 ">
            <div className="text-center space-y-2 ">
              <h2 className="font-serif text-3xl font-medium py-10 tracking-wide text-black">
                Best selling product
              </h2>
            </div>
            <BestSellersGrid />
          </div>
        </section>

        {/* Stats bar */}
        {/* <section className=" py-16">
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
            <StatsTicker />
          </div>
        </section> */}

        {/* ==================================================
            SECTION: EDITORIAL COLLAGE (Jewelry That Speaks)
            ================================================== */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto px-6 sm:px-10 lg:px-16 max-w-[1600px]">
            <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 items-center">
              {/* Left Column: Portrait Model Photo */}
              <div className="col-span-1 md:col-span-4 flex justify-center order-2 md:order-1">
                <div className="relative aspect-[3/4] w-full max-w-[340px] overflow-hidden border border-neutral-100 shadow-sm select-none">
                  <img
                    src="/about/glamour-beauty-jewelry-luxury-concept-close-up-beautiful-woman-with-golden-ring-diamond-earring.jpg"
                    alt="Luxury jewelry model portrait"
                    className="h-full w-full object-cover transition-transform duration-10000 hover:scale-105"
                  />
                </div>
              </div>

              {/* Middle Column: Central Heading & CTA */}
              <div className="col-span-2 md:col-span-4 text-center space-y-6 px-2 sm:px-4 order-1 md:order-2">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight font-medium text-neutral-900 tracking-wide">
                  Jewelry That Speaks Before You Do
                </h2>
                <p className="text-neutral-500 font-sans text-xs font-light leading-relaxed max-w-xs mx-auto">
                  Designed to carry emotion, confidence, and individuality, each piece becomes a reflection of who you are crafted to feel personal, powerful, and timeless.
                </p>
                <div className="pt-2">
                  <Link href="/diamonds" passHref>
                    <button className="inline-block px-8 py-3 bg-black text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors duration-300 cursor-pointer border-none shadow-sm">
                      SHOP NOW
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Close-up Jewelry Detail Photo */}
              <div className="col-span-1 md:col-span-4 flex justify-center order-3">
                <div className="relative aspect-[3/4] w-full max-w-[340px] overflow-hidden border border-neutral-100 shadow-sm select-none">
                  <img
                    src="/about/luxury-white-gold-diamond-necklace-dark-background.jpg"
                    alt="Gold pendant necklace detail"
                    className="h-full w-full object-cover transition-transform duration-10000 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION: MARBLE EDITORIAL BADGES (Timeless / Most Loved)
            ================================================== */}
        <section className="relative w-full py-24 sm:py-32 lg:py-40 overflow-hidden bg-black">
          {/* Abstract Fluid Marble Background Image */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              src="/about/diamond-jewelry-luxury-fashion-jewelry.jpg"
              alt="Luxury fluid marble background"
              className="w-full h-full object-cover brightness-[0.25] scale-105"
            />
            {/* Cinematic Gradient Tint */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          </div>

          <div className="relative z-10 mx-auto px-6 max-w-5xl text-center select-none text-white leading-none space-y-8 sm:space-y-10">
            {/* Row 1 */}
            <div className="flex flex-wrap items-center justify-center gap-y-4">
              <span className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-[0.25em] uppercase">
                TIMELESS
              </span>
              <span className="inline-block h-8 w-14 sm:h-12 sm:w-20 rounded-lg overflow-hidden align-middle mx-3 sm:mx-5 border border-white/10 shrink-0">
                <img
                  src="/about/diamond-ring-isolated-black-background-3d-render.jpg"
                  alt="Timeless product snippet"
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light tracking-widest uppercase border border-white/30 rounded-full px-6 py-2">
                MOST LOVED
              </span>
            </div>

            {/* Row 2 */}
            <div className="flex flex-wrap items-center justify-center gap-y-4 pt-2">
              <span className="inline-block h-8 w-14 sm:h-12 sm:w-20 rounded-lg overflow-hidden align-middle mx-3 sm:mx-5 border border-white/10 shrink-0">
                <img
                  src="/about/gold-diamond-jewelry.jpg"
                  alt="Modern look product snippet"
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light tracking-widest uppercase border border-white/30 rounded-full px-6 py-2">
                MODERN LOOKS
              </span>
            </div>

            {/* Row 3 */}
            <div className="flex flex-wrap items-center justify-center gap-y-4 pt-2">
              <span className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light tracking-widest uppercase border border-white/30 rounded-full px-6 py-2">
                TRENDING
              </span>
              <span className="inline-block h-8 w-12 sm:h-12 sm:w-16 rounded-lg overflow-hidden align-middle mx-3 sm:mx-5 border border-white/10 shrink-0">
                <img
                  src="/about/elegant-bride-earrings-morning-bridal-preparation-fine-art-wedding-details.jpg"
                  alt="Trending model snippet"
                  className="h-full w-full object-cover"
                />
              </span>
            </div>
          </div>
        </section>





        {/* FAQ Section */}
        <FAQSection />
      </div>
    </Layout>
  );
}
