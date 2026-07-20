"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { useStore } from "@/context/StoreContext";
import CategoryCarousel from "@/components/ui/CategoryCarousel";
import ExploreDiamonds from "@/components/ui/ExploreDiamonds";
import ProductCard from "@/components/ui/ProductCard";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useDispatch, useSelector } from "react-redux";
import { fetchMainPage } from "@/redux/landingSlice";
import { fetchCategories } from "@/redux/categorySlice";

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

function MarqueeStrip({ dark }) {
  return (
    <div
      className="bg-neutral-955 border-y border-gray-300 py-3.5 overflow-hidden">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {/* Double items for seamless infinite scroll animation */}
        <div className="flex">
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-4 px-6 font-serif text-[10px] lg:text-[11px] xl:text-xs tracking-[0.3em] uppercase ${dark ? "text-neutral-500" : "text-neutral-400"
                }`}
            >
              {item}{" "}
              <span className={dark ? "text-neutral-700" : "text-neutral-200"}>
                ✦
              </span>
            </span>
          ))}
        </div>
        <div className="flex">
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={`dup-${i}`}
              className={`inline-flex items-center gap-4 px-6 font-serif text-[10px] lg:text-[11px] xl:text-xs tracking-[0.3em] uppercase ${dark ? "text-neutral-500" : "text-neutral-400"
                }`}
            >
              {item}{" "}
              <span className={dark ? "text-neutral-700" : "text-neutral-200"}>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BestSellersGrid() {
  const { bestProducts } = useSelector((state) => state.landing);
  return (
    <AnimateOnScroll direction="up" delay={150} duration={850}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-12">
        {bestProducts?.map((prod) => {
          return (
            <div key={prod?._id} className="h-full">
              <ProductCard item={prod} />
            </div>
          );
        })}
      </div>
    </AnimateOnScroll>
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
      className="py-20 px-6 sm:px-10 lg:px-16 border-t border-neutral-100"
    >
      <div className="mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16">
        {/* Left Column */}
        <div className="md:col-span-5 space-y-6 text-left">
          <AnimateOnScroll direction="up" delay={100}>
            <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.25em] text-neutral-500 uppercase">
              Need Help?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight font-light text-neutral-900 tracking-wide mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-500 leading-relaxed max-w-sm mt-4">
              Everything you need to know about our jewellery, customisation,
              certifications, and after-sales care.
            </p>
            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-neutral-900 rounded-xl text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors duration-300"
              >
                View all questions <span className="text-sm">→</span>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Right Column */}
        <div className="md:col-span-7 space-y-4">
          <AnimateOnScroll direction="up" delay={200}>
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
                    className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                      }`}
                  >
                    <p className="text-xs sm:text-sm font-light text-neutral-500 leading-relaxed pl-1 pb-2 max-w-2xl">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </AnimateOnScroll>
        </div>
      </div>
    </section>
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
  const { items: apiCategories } = useSelector((state) => state.categories);

  const categoriesList = useMemo(
    () => (apiCategories && apiCategories.length > 0 ? apiCategories : []),
    [apiCategories]
  );

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    dispatch(fetchMainPage());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Autoplay Effect for Hero Carousel
  useEffect(() => {
    if (!items || items.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % items.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [items]);

  const handlePrevClick = () => {
    if (!items || items.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNextClick = () => {
    if (!items || items.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % items.length);
  };

  const handleProgressClick = (idx) => {
    setCurrentSlide(idx);
  };

  const handleScrollToNextSection = () => {
    const categoriesSection = document.querySelector("#section-categories");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout>
      <div className="w-full flex flex-col overflow-x-hidden select-none">
        {/* ==================================================
            SECTION 1: FULLSCREEN HERO CAROUSEL (100dvh)
            ================================================== */}
        <section className="relative h-[100dvh] min-h-[600px] w-full bg-[#0F0F0F] overflow-hidden select-none">
          {/* Background Images & Content Layer */}
          {items?.map((slide, idx) => {
            const hasText = hasSlideText(slide);
            const isActive = idx === currentSlide;

            return (
              <div
                key={idx}
                className={`absolute inset-0 w-full h-full flex items-center justify-start transition-all duration-1000 ease-in-out ${isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
                  }`}
              >
                {/* Background Photo with slow scale pan */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={slide?.image?.image}
                    alt={slide?.title || "Dndiamond Hero Image"}
                    className={`w-full h-full object-cover select-none transition-transform duration-[5500ms] ease-out ${isActive ? "scale-100" : "scale-115"
                      }`}
                  />
                  {hasText && (
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent z-10" />
                  )}
                </div>

                {/* Slide Content Layer */}
                {hasText && (
                  <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 flex items-center h-full">
                    <div className="max-w-xl md:max-w-2xl text-left space-y-6">
                      {/* Category Label */}
                      {slide.label && slide.label.trim() !== "" && (
                        <span
                          className={`inline-block text-[11px] font-bold tracking-[0.3em] text-neutral-400 uppercase transition-all duration-700 delay-300 ${isActive
                            ? "translate-y-0 opacity-100"
                            : "translate-y-6 opacity-0"
                            }`}
                        >
                          {slide.label}
                        </span>
                      )}

                      {/* Headline */}
                      {slide.title && slide.title.trim() !== "" && (
                        <h1
                          className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-white tracking-wide leading-[1.1] md:leading-[1.05] transition-all duration-1000 delay-500 ${isActive
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                            }`}
                        >
                          {slide.title.split("\n").map((line, lidx) => (
                            <span key={lidx} className="block">
                              {line}
                            </span>
                          ))}
                        </h1>
                      )}

                      {/* Description */}
                      {slide.description && slide.description.trim() !== "" && (
                        <div
                          className={`mt-2 text-neutral-300 transition-all duration-1000 delay-700 ${isActive
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                            }`}
                        >
                          {slide.description.split("\n\n").map((para, pidx) => (
                            <p
                              key={pidx}
                              className="font-light text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl"
                            >
                              {para}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Call To Action Button */}
                      <div
                        className={`pt-4 transition-all duration-700 delay-[900ms] ${isActive
                          ? "translate-y-0 opacity-100"
                          : "translate-y-6 opacity-0"
                          }`}
                      >
                        <Link
                          href="/diamonds"
                          className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.25em] text-white transition-colors duration-300 border-b border-white pb-1.5 hover:text-neutral-300 hover:border-white/60 group cursor-pointer"
                        >
                          <span>SHOP NOW</span>
                          <span className="ml-1.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-[10px]">
                            ↗
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Vertical Progress Indicators (Right Side) */}
          <div className="absolute right-2 sm:right-12 top-1/2 -translate-y-1/2 z-40 flex flex-col space-y-2 sm:space-y-3">
            {items?.map((item, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={idx}
                  onClick={() => handleProgressClick(idx)}
                  className="group relative flex items-center justify-end py-2 px-3 sm:py-3 sm:px-6 focus:outline-none cursor-pointer"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <span className="text-[10px] font-sans font-medium tracking-[0.25em] text-white/60 group-hover:text-white transition-colors duration-300 mr-4 opacity-0 group-hover:opacity-100 uppercase hidden sm:inline-block">
                    {item?.label}
                  </span>

                  <div className="relative h-8 sm:h-10 w-[2px] bg-white/20 transition-all duration-300 group-hover:bg-white/30">
                    <div
                      className="absolute top-0 left-0 w-full bg-white transition-all ease-linear"
                      style={{
                        height: isActive ? "100%" : "0%",
                        transitionDuration: isActive ? "5500ms" : "0ms",
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mouse Floating Scroll Indicator (Bottom Center) */}
          <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 hidden sm:flex flex-col items-center">
            <button
              onClick={handleScrollToNextSection}
              className="flex flex-col items-center group cursor-pointer focus:outline-none"
              aria-label="Scroll down to category section"
            >
              <div className="relative w-[22px] h-[36px] border border-white/30 rounded-full flex justify-center p-1 group-hover:border-white transition-colors duration-500">
                <div className="w-[2px] h-[7px] bg-white rounded-full animate-bounce mt-1 transition-colors duration-500" />
              </div>
              <span className="text-[9px] font-sans tracking-[0.3em] uppercase text-white/50 group-hover:text-white transition-colors duration-500 mt-2 block">
                Scroll
              </span>
            </button>
          </div>

          {/* Navigation Arrows (Bottom Right) */}
          <div className="absolute right-4 sm:right-12 bottom-6 sm:bottom-10 z-40 flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={handlePrevClick}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-all duration-300 focus:outline-none cursor-pointer"
              aria-label="Previous slide"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <button
              onClick={handleNextClick}
              className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-all duration-300 focus:outline-none cursor-pointer"
              aria-label="Next slide"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </section>


        {/* ==================================================
            SECTION 2: CATEGORY CAROUSEL (SIMPLE SWIPER)
            ================================================== */}
        {categoriesList && categoriesList.length > 0 && (
          <section
            id="section-categories"
            className="py-10 bg-neutral-50/30 border-y border-neutral-100/60 overflow-hidden"
          >
            <CategoryCarousel categories={categoriesList} />
          </section>
        )}

        {/* BEST SELLERS */}
        <section className="py-10">
          <div className="mx-auto px-6 sm:px-10 lg:px-16">
            <div className="text-center space-y-2 mb-10">
              <AnimateOnScroll direction="up" delay={100}>
                <h2 className="font-serif text-3xl font-medium tracking-wide text-black">
                  Best selling product
                </h2>
              </AnimateOnScroll>
            </div>
            <BestSellersGrid />
          </div>
        </section>


        <MarqueeStrip />


        {/* Philosophy section */}
        <section className="py-10 sm:py-14 bg-[#FAF9F5]/40">
          <div className="mx-auto px-6 sm:px-10 ">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              {/* Left Column: Portrait Model Photo */}
              <div className="col-span-1 md:col-span-4 flex justify-center order-2 md:order-1">
                <AnimateOnScroll direction="left" delay={150}>
                  <div className="relative aspect-[3/4] w-full overflow-hidden border border-neutral-100 shadow-xs select-none rounded-xl">
                    <img
                      src="/about/glamour-beauty-jewelry-luxury-concept-close-up-beautiful-woman-with-golden-ring-diamond-earring.jpg"
                      alt="Luxury jewelry model portrait"
                      className="h-full w-full object-cover transition-transform duration-10000 hover:scale-105 "
                    />
                  </div>

                </AnimateOnScroll>
              </div>

              {/* Middle Column: Central Heading & CTA */}
              <div className="col-span-2 md:col-span-4 text-center space-y-6 px-2 sm:px-4 order-1 md:order-2">
                <AnimateOnScroll direction="up" delay={100}>
                  <span className="block text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.35em] text-neutral-400 uppercase">
                    Atelier Philosophy
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight font-light text-neutral-900 tracking-wide mt-2">
                    Jewelry That Speaks Before You Do
                  </h2>
                  <p className="text-neutral-500 font-sans text-xs font-light leading-relaxed max-w-xs mx-auto mt-4">
                    Designed to carry emotion, confidence, and individuality, each
                    piece becomes a reflection of who you are—crafted to feel
                    personal, powerful, and timeless.
                  </p>
                  <div className="pt-6">
                    <Link href="/diamonds" passHref>
                      <button className="inline-flex items-center justify-center px-8 py-3.5 border border-neutral-900 bg-transparent text-neutral-900 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 hover:bg-neutral-900 hover:text-white cursor-pointer rounded-xl">
                        Shop Collection
                      </button>
                    </Link>
                  </div>
                </AnimateOnScroll>
              </div>

              {/* Right Column: Close-up Jewelry Detail Photo */}
              <div className="col-span-1 md:col-span-4 flex justify-center order-3">
                <AnimateOnScroll direction="right" delay={150}>
                  <div className="relative aspect-[3/4] w-full overflow-hidden border border-neutral-100 shadow-xs select-none rounded-xl">
                    <img
                      src="/about/luxury-white-gold-diamond-necklace-dark-background.jpg"
                      alt="Gold pendant necklace detail"
                      className="h-full w-full object-cover transition-transform duration-10000 hover:scale-105 "
                    />
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>


        {/* Explore Diamonds shape cut section */}
        <ExploreDiamonds />


        {/* ==================================================
            SECTION: MARBLE EDITORIAL BADGES (Timeless / Most Loved)
            ================================================== */}
        <section className="relative w-full py-32 sm:py-40 lg:py-48 overflow-hidden bg-black text-center flex items-center justify-center">
          {/* Abstract Fluid Marble Background Image */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              src="/about/diamond-jewelry-luxury-fashion-jewelry.jpg"
              alt="Luxury fluid marble background"
              className="w-full h-full object-cover brightness-[0.2] scale-105"
            />
            {/* Cinematic Gradient Tint */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
          </div>

          <div className="relative z-10 mx-auto px-6 max-w-4xl space-y-8 select-none text-white">
            <AnimateOnScroll direction="up" delay={100}>
              <span className="block text-[11px] font-sans font-bold tracking-[0.35em] text-neutral-400 uppercase">
                ✦ Atelier Curation ✦
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-white uppercase leading-tight mt-2">
                Timeless Elegance &amp; Most Loved
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll direction="up" delay={200}>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-xl mx-auto tracking-wide">
                Designed to carry emotion, confidence, and individuality. Each
                piece in our curation becomes a reflection of who you are—crafted to
                feel personal, powerful, and enduring.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll direction="up" delay={300}>
              <div className="pt-4">
                <Link
                  href="/diamonds"
                  className="inline-flex items-center px-6 py-2.5 border border-white rounded-xl text-[11px] font-bold uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:text-neutral-300 hover:border-white/60 group cursor-pointer"
                >
                  <span>Explore the collections</span>
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />
      </div>
    </Layout>
  );
}
