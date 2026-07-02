"use client";

import React from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useStore } from "@/context/StoreContext";

export default function ProductCard({ item }) {
  const { isWishlisted, toggleWishlist, calculatePrice, formatPrice } =
    useStore();
  const wishlisted = isWishlisted(item.id);

  // Calculate default price
  const defaultMetal = item.metalType ? item.metalType[0] : "14K Gold";
  const defaultCarat = item.diamondWeight ? item.diamondWeight[0] : 0.5;
  const finalPrice = calculatePrice(item, defaultMetal, defaultCarat);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item);
  };

  return (
    <Link
      href={`/category/${item.id}`}
      className="group relative flex flex-col justify-between bg-white overflow-hidden transition-all duration-500 h-full p-4 hover:shadow-xs"
    >
      {/* Top Image Section (off-white luxury card background) */}
      <div className="relative aspect-square w-full bg-[#FAFAFA] flex items-center justify-center overflow-hidden rounded-xs p-8">
        {/* Heart outline icon at top-right */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-4 right-4 z-20 p-2.5 text-neutral-400 hover:text-neutral-900 transition-colors bg-white/60 hover:bg-white rounded-full shadow-2xs backdrop-blur-xs cursor-pointer flex items-center justify-center"
          aria-label="Add to Wishlist"
        >
          {wishlisted ? (
            <FaHeart className="text-neutral-900" size={12} />
          ) : (
            <FaRegHeart size={12} />
          )}
        </button>

        <img
          src={
            item.image ||
            "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&fit=crop"
          }
          alt={item.title}
          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-700 will-change-transform"
        />

        {/* Visual marker label */}
        {item.discount > 0 && (
          <span className="absolute bottom-4 left-4 px-2 py-0.5 bg-neutral-900 text-[8px] font-bold text-white tracking-widest uppercase">
            {item.discount}% Off
          </span>
        )}
      </div>

      {/* Bottom Content (Luxury Editorial Spacing) */}
      <div className="pt-5 text-center flex flex-col items-center space-y-1.5 flex-1 justify-end">
        <span className="text-[9px] font-bold tracking-[0.25em] text-neutral-400 uppercase">
          {item.discount > 0 ? "EXCLUSIVE OFFER" : "NOVELTY"}
        </span>

        <h3 className="font-serif text-xs md:text-sm font-medium text-neutral-800 tracking-wider uppercase group-hover:text-neutral-950 transition-colors line-clamp-1">
          {item.title}
        </h3>

        <p className="text-[10px] text-neutral-400 font-light tracking-wide line-clamp-1">
          {item.style ? `${item.style}, ` : ""}
          {defaultMetal}
        </p>

        <div className="pt-1.5">
          <span className="font-serif text-[11px] md:text-xs font-semibold text-neutral-900 tracking-wider">
            {formatPrice(finalPrice)}
          </span>
        </div>
      </div>
    </Link>
  );
}
