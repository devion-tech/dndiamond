"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useStore } from "@/context/StoreContext";
import { colors as colorOptions } from "@/data/initialData";
import toast from "react-hot-toast";
import { toggleWishlist } from "@/redux/wishlistSlice";
import { getAuthHeaders } from "@/common/token";
import { useDispatch } from "react-redux";

const colorMap = Object.fromEntries(
  colorOptions.map((c) => [c.name.toLowerCase(), c.hex]),
);

export default function ProductCard({ item }) {
  const { token } = useStore();
  const { formatPrice } = useStore();
  const [isToggling, setIsToggling] = useState(false);
  const [wishlisted, setWishlisted] = useState(item?.is_wishlist);
  const [hasError, setHasError] = useState(false);

  const colorList = item?.colors || [];
  const hasObjects = colorList.length > 0 && typeof colorList[0] === "object";
  const defaultVal = hasObjects ? colorList[0]?.value : colorList[0];
  const [selectedColor, setSelectedColor] = useState(defaultVal || null);

  const getHex = (v) => colorMap[v?.toLowerCase()] || "#cccccc";
  const dispatch = useDispatch();

  const handleColorSelect = (e, color) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasObjects && color.is_disabled) return;
    const val = hasObjects ? color.value : color;
    setSelectedColor(val);
  };

  const currentImage = (() => {
    if (hasObjects && selectedColor) {
      const match = colorList.find((c) => c.value === selectedColor);
      if (match?.image) return match.image;
    }
    return item.image;
  })();

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const headers = getAuthHeaders();
    if (isToggling) return;
    if (!headers.Authorization) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }

    const newWishlistedState = !wishlisted;

    setWishlisted(newWishlistedState);
    setIsToggling(true);
    setHasError(false);

    try {
      const response = await dispatch(
        toggleWishlist({
          product_id: item?.id,
        }),
      );
      if (!response?.payload?.success) {
        setWishlisted(wishlisted);
      }
      if (response?.payload?.success) {
        toast.success(response?.payload?.message);
      } else {
        toast.error(response?.payload?.message);
      }
    } catch (error) {
      setWishlisted(wishlisted);
      setHasError(true);

      toast.error(error.message || "Failed to update wishlist.");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Link
      href={`/product/${item?.slug}`}
      className="group relative flex flex-col justify-between bg-white overflow-hidden transition-all duration-500 h-full p-4 hover:shadow-xs"
    >
      <div className="relative aspect-square w-full bg-[#FAFAFA] flex items-center justify-center overflow-hidden rounded-xs p-8">
        <button
          onClick={handleWishlistClick}
          disabled={isToggling}
          className={`absolute top-4 right-4 z-20 p-2.5 transition-colors bg-white/60 hover:bg-white rounded-full shadow-2xs backdrop-blur-xs cursor-pointer flex items-center justify-center ${wishlisted ? "text-red-600 hover:text-red-700" : "text-neutral-400 hover:text-neutral-900"}`}
          aria-label="Add to Wishlist"
        >
          {wishlisted ? (
            <FaHeart className="text-red-600" size={12} />
          ) : (
            <FaRegHeart size={12} />
          )}
        </button>

        <img
          src={
            currentImage ||
            "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&fit=crop"
          }
          alt={item.title}
          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-700 will-change-transform"
        />
      </div>

      <div className="pt-5 text-center flex flex-col items-center space-y-1.5 flex-1 justify-end">
        <h3 className="font-serif text-xs md:text-sm font-medium text-neutral-800 tracking-wider uppercase group-hover:text-neutral-950 transition-colors line-clamp-1">
          {item.title}
        </h3>

        <div>
          <span className=" text-[11px] md:text-sm font-semibold text-neutral-900 tracking-wider">
            {formatPrice(item?.display_price)}
          </span>
        </div>

        {colorList.length > 0 && (
          <div className="flex items-center justify-center space-x-2 mt-1">
            {colorList.map((color, index) => {
              const val = hasObjects ? color.value : color;
              const isDisabled = hasObjects ? color.is_disabled : false;
              const hex = hasObjects ? getHex(val) : val;
              const isSelected = selectedColor === val;

              return (
                <button
                  key={index}
                  onClick={(e) => handleColorSelect(e, color)}
                  disabled={isDisabled}
                  className={`w-5 h-5 rounded-full border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-neutral-900 scale-110"
                      : "border-neutral-300 hover:border-neutral-500"
                  } ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}`}
                  style={{ backgroundColor: hex }}
                  title={val}
                  aria-label={val}
                />
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
