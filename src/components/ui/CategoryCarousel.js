"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/categorySlice";

const getDBCategory = (apiName) => {
  const lower = apiName.toLowerCase();
  if (lower === "ring") return "Ring";
  if (lower === "earring") return "Earring";
  if (lower === "bracelets" || lower === "bracelet") return "Bracelet & Bangle";
  if (lower === "necklace") return "Necklace";
  if (lower === "pendant") return "Pendant";
  return apiName;
};

const getCategoryImage = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes("earring")) return "/products/earrings.webp";
  if (lower.includes("ring")) return "/products/rings.webp";
  if (lower.includes("necklace") || lower.includes("pendant"))
    return "/products/necklace.avif";
  if (lower.includes("bracelet") || lower.includes("bangle"))
    return "/products/bracelate.webp";
  return "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&fit=crop";
};

export default function CategoryCarousel() {
  const dispatch = useDispatch();
  const { items: apiCategories, loading } = useSelector(
    (state) => state.categories,
  );
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScrollButtons);
      checkScrollButtons();
      window.addEventListener("resize", checkScrollButtons);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScrollButtons);
      }
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, [apiCategories]);

  if (loading || !apiCategories || apiCategories.length === 0) {
    return null;
  }

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/carousel w-full py-10">
      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-x-visible lg:pb-0"
      >
        {apiCategories.map((cat) => {
          const dbCat = cat?.slug;
          const img = cat?.image;
          const path = `/category/${dbCat}`;
          const displayName = cat.name.toUpperCase();

          return (
            <div
              key={cat.name}
              className="min-w-[70%] sm:min-w-[45%] md:min-w-[30%] snap-center lg:min-w-0 lg:w-full"
            >
              <Link href={path} className="group flex flex-col items-center">
                {/* Square Image container */}
                <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 shadow-2xs transition-all duration-500">
                  <img
                    src={img}
                    alt={displayName}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                  />
                  {/* Subtle Luxury Hover Overlay */}
                  <div className="absolute inset-0 bg-neutral-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                {/* Label */}
                <span className="font-sans text-[10px] sm:text-[11px] lg:text-xs tracking-[0.25em] text-neutral-800 uppercase mt-4 text-center font-medium group-hover:text-neutral-955 group-hover:tracking-[0.28em] transition-all duration-300">
                  {displayName}
                </span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Left Control Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-4 top-[calc(50%-20px)] -translate-y-1/2 z-30 h-10 w-10 bg-white/90 hover:bg-white text-neutral-700 hover:text-neutral-900 rounded-full flex items-center justify-center shadow-md hover:shadow-lg backdrop-blur-xs transition-all lg:hidden cursor-pointer"
          aria-label="Scroll left"
        >
          <FaChevronLeft size={12} className="mr-0.5" />
        </button>
      )}

      {/* Right Control Arrow */}
      {canScrollRight && (
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-4 top-[calc(50%-20px)] -translate-y-1/2 z-30 h-10 w-10 bg-white/90 hover:bg-white text-neutral-700 hover:text-neutral-900 rounded-full flex items-center justify-center shadow-md hover:shadow-lg backdrop-blur-xs transition-all lg:hidden cursor-pointer"
          aria-label="Scroll right"
        >
          <FaChevronRight size={12} className="ml-0.5" />
        </button>
      )}
    </div>
  );
}
