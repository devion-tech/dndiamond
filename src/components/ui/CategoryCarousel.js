"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function CategoryCarousel({ categories: customCategories }) {
  const { items: apiCategories, loading } = useSelector(
    (state) => state.categories,
  );

  const categories = customCategories || apiCategories;

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInitialized, setSwiperInitialized] = useState(false);

  // If loading or there are no categories, hide the component completely
  if (loading || !categories || categories.length === 0) return null;

  return (
    <div className="w-full relative mx-auto max-w-[1760px] px-4 sm:px-8 lg:px-12 xl:px-16">
      {/* Category Section Header with Navigation Arrows on the right */}
      <div className="flex items-end justify-between border-b border-neutral-100 pb-6 mb-10">
        <div className="text-left space-y-2">
          <span className="block text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.3em] text-neutral-400 uppercase">
            Explore Collections
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-neutral-900">
            Shop by Category
          </h2>
        </div>

        {/* Navigation Arrow buttons */}
        <div className="flex items-center space-x-3">
          <button
            ref={prevRef}
            className="w-10 h-10 rounded-full border border-neutral-900/10 hover:border-neutral-900/30 bg-white text-neutral-900 flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 active:scale-95 shadow-2xs"
            aria-label="Previous category"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <button
            ref={nextRef}
            className="w-10 h-10 rounded-full border border-neutral-900/10 hover:border-neutral-900/30 bg-white text-neutral-900 flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 active:scale-95 shadow-2xs"
            aria-label="Next category"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* Swiper Slider */}
      <div className="w-full relative">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
            setSwiperInitialized(true);
          }}
          spaceBetween={24}
          breakpoints={{
            0: {
              slidesPerView: 1.4,
              spaceBetween: 16,
            },
            480: {
              slidesPerView: 2.2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 24,
            },
          }}
          className="swiper-container"
        >
          {categories.map((cat, idx) => (
            <SwiperSlide key={cat._id || cat.slug || idx}>
              <Link
                href={`/category/${cat.slug}`}
                className="group block relative overflow-hidden rounded-[20px] bg-neutral-100 aspect-[4/3] shadow-xs border border-neutral-100/50"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Vignette bottom-heavy gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300" />

                {/* Text overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-left flex flex-col pointer-events-none">
                  <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-neutral-300 font-medium">
                    Collection
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-light text-white tracking-wider mt-1 uppercase">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
