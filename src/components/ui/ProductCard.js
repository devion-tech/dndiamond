"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useStore } from "@/context/StoreContext";
import { colors as colorOptions } from "@/data/initialData";
import toast from "react-hot-toast";
import { getAuthHeaders } from "@/common/token";

const colorMap = Object.fromEntries(
  colorOptions.map((c) => [c.name.toLowerCase(), c.hex]),
);

export default function ProductCard({ item }) {
  const { token, formatPrice, addToCart, isWishlisted, toggleWishlist } =
    useStore();
  const product = useMemo(() => {
    const colors = item?.options?.filter((opt) => opt.name === "colors") || [];
    return {
      id: item?._id,
      title: item?.name,
      slug: item?.slug,
      colors: colors && colors.length > 0 ? colors[0].values : [],
      image:
        item?.images && item?.images[0]
          ? item?.images[0]
          : "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&fit=crop",
      display_price: item?.display_price || 0,
      isFromApi: true,
    };
  }, [item]);
  const [isToggling, setIsToggling] = useState(false);
  const wishlisted = isWishlisted(product?.id);
  const [hasError, setHasError] = useState(false);

  const colorList = product?.colors || [];
  const hasObjects = colorList.length > 0 && typeof colorList[0] === "object";
  const defaultVal = hasObjects ? colorList[0]?.value : colorList[0];
  const [selectedColor, setSelectedColor] = useState(defaultVal || null);

  const getHex = (v) => {
    const name = v?.toLowerCase() || "";
    if (name.includes("yellow")) return "#E5CE83";
    if (name.includes("white")) return "#E9E9E9";
    if (name.includes("rose")) return "#ECC5C0";
    if (name.includes("platinum")) return "#E5E4E2";
    return colorMap[name] || "#EDD680";
  };

  const handleColorSelect = (e, color) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasObjects && color.is_disabled) return;
    const val = hasObjects ? color.value : color;
    setSelectedColor(val);
  };

  const handleAddToBagClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const selectedOptions = {};
      if (selectedColor) {
        selectedOptions.color = selectedColor;
      }
      await addToCart(
        product,
        selectedOptions,
        product?.display_price || product?.price || 0,
      );
      toast.success("Added to bag!");
    } catch (error) {
      toast.error(error.message || "Failed to add to bag.");
    }
  };

  const currentImage = (() => {
    if (hasObjects && selectedColor) {
      const match = colorList.find((c) => c.value === selectedColor);
      if (match?.image) return match.image;
    }
    return product?.image;
  })();

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const headers = getAuthHeaders();
    if (isToggling) return;
    if (
      !token ||
      !headers["Authorization"] ||
      headers["Authorization"].split(" ")[1] === "null"
    ) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }

    setIsToggling(true);

    try {
      const response = await toggleWishlist({
        product_id: product?.id,
      });
      if (response?.payload?.success) {
        toast.success(response?.payload?.message);
      } else {
        toast.error(response?.payload?.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update wishlist.");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <>
      <Link
        href={`/product/${product?.slug}`}
        className="group relative flex flex-col justify-between bg-white overflow-hidden transition-all duration-500 h-full  hover:shadow-xs rounded-xl"
      >
        <div className="relative aspect-square w-full  flex items-center justify-center overflow-hidden rounded-xs">
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
            alt={product?.title}
            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-700 will-change-transform"
          />

          {/* <button
            onClick={handleAddToBagClick}
            className="absolute bottom-0 left-0 right-0 py-3 bg-neutral-900/90 hover:bg-neutral-950 text-white font-sans font-bold text-[9px] uppercase tracking-widest text-center translate-y-full group-hover:translate-y-0 transition-transform duration-350 ease-out backdrop-blur-xs flex items-center justify-center gap-1.5 cursor-pointer z-20 border-0"
          >
            Add to Bag
          </button> */}
        </div>

        <div className="pt-5 text-center flex flex-col items-center space-y-1.5 flex-1 justify-end p-4">
          <h3 className="text-sm font-medium text-black tracking-wide transition-colors line-clamp-1">
            {product?.title}
          </h3>

          <div>
            <span className="text-[11px]  font-bold text-black tracking-wide">
              {formatPrice(product?.display_price)}
            </span>
          </div>

          {selectedColor && (
            <span className="text-[10px] text-neutral-400 tracking-wider font-light uppercase mt-0.5 block">
              {selectedColor}
            </span>
          )}

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
                    className={`w-5 h-5 rounded-full border transition-all duration-200 cursor-pointer ${isSelected
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
    </>
  );
}
