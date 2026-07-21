/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHeart,
  FaRegHeart,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaGem,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaShoppingBag,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail, clearSelectedProduct } from "@/redux/productSlice";
import Layout from "@/components/layout/Layout";
import { useStore } from "@/context/StoreContext";
import { colors as colorOptions } from "@/data/initialData";
import ProductCard from "@/components/ui/ProductCard";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

const colorMap = Object.fromEntries(
  colorOptions.map((c) => [c.name.toLowerCase(), c.hex]),
);

const resolveCategoryName = (categoryField, subcategoryField) => {
  if (
    categoryField &&
    typeof categoryField === "object" &&
    categoryField.name
  ) {
    const name = categoryField.name.toLowerCase();
    if (name === "bracelets" || name === "bracelet") return "Bracelet & Bangle";
    if (name === "ring") return "Ring";
    if (name === "earring") return "Earring";
    if (name === "necklace") return "Necklace";
    if (name === "pendant") return "Pendant";
    return categoryField.name;
  }
  const id =
    typeof categoryField === "string"
      ? categoryField
      : categoryField?._id || subcategoryField?.parent_id;
  const idMap = {
    "6a4203b35e05bfd78896e398": "Ring",
    "6a4204e55e05bfd78896e3ba": "Necklace",
    "6a42054a5e05bfd78896e3d1": "Earring",
    "6a4205ca5e05bfd78896e3ec": "Bracelet & Bangle",
  };
  return idMap[id] || "Ring";
};

const resolveCategorySlug = (categoryField, subcategoryField) => {
  if (
    categoryField &&
    typeof categoryField === "object" &&
    categoryField.slug
  ) {
    return categoryField.slug;
  }
  const name = resolveCategoryName(
    categoryField,
    subcategoryField,
  ).toLowerCase();
  if (name.includes("ring")) return "ring";
  if (name.includes("necklace")) return "necklace";
  if (name.includes("earring")) return "earring";
  if (name.includes("bracelet")) return "bracelet";
  if (name.includes("pendant")) return "pendant";
  return "ring";
};

const getHex = (v) => {
  const name = v?.toLowerCase() || "";
  if (name.includes("yellow")) return "#E5CE83";
  if (name.includes("white")) return "#E9E9E9";
  if (name.includes("rose")) return "#ECC5C0";
  if (name.includes("platinum")) return "#E5E4E2";
  return colorMap[name] || "#EDD680";
};

export default function ProductDetail({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { guestId, addToCart, toggleWishlist, isWishlisted, formatPrice } =
    useStore();

  const dispatch = useDispatch();
  const { selectedProduct: rawProduct, error: apiError } = useSelector(
    (state) => state.products,
  );

  const [product, setProduct] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [successAdded, setSuccessAdded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  // Swiper thumbs instance
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState({
    details: true,
    specs: false,
    diamonds: false,
    shipping: false,
    warranty: false,
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Fetch product details on mount/param change
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetail({ productId, guestId }));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, productId, guestId]);

  // Update local state when rawProduct updates
  useEffect(() => {
    if (rawProduct) {
      const p = rawProduct;

      const mapped = {
        id: p._id,
        title: p.name,
        slug: p.slug,
        category: resolveCategoryName(p.category_id, p.subcategory_id),
        image:
          p.images && p.images[0]
            ? p.images[0]
            : "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800",
        images: p.images || [],
        description:
          p.description ||
          "Individually hand-crafted by master jewelers using ethically sourced, GIA-certified diamonds.",
        discount: p.discount || 0,
        goldWeight: p.weight || 2.5,
        price: p.price || 0,
        display_price: p.display_price || 0,
        style: p.subcategory_id?.name || "",
        isFromApi: true,
      };

      const staticOptionsList = [
        {
          name: "color",
          values: [
            { value: "Yellow Gold" },
            { value: "White Gold" },
            { value: "Rose Gold" },
            { value: "Platinum" },
          ],
        },
        {
          name: "gold_type",
          values: [
            { value: "18K Solid Gold" },
            { value: "14K Solid Gold" },
            { value: "Platinum 950" },
          ],
        },
        {
          name: "size",
          values: [
            { value: "6" },
            { value: "7" },
            { value: "8" },
            { value: "9" },
            { value: "10" },
          ],
        },
      ];

      const optionsList =
        p.options && p.options.length > 0 ? p.options : staticOptionsList;
      const defaults = {};
      optionsList.forEach((opt) => {
        const firstVal =
          opt.values?.find((v) => !v.is_disabled)?.value ||
          opt.values?.[0]?.value;
        defaults[opt.name] = firstVal || "";
      });

      setProduct(mapped);
      setProductOptions(optionsList);
      setSelectedOptions(defaults);
      setLoadingError(false);
    }
  }, [rawProduct]);

  useEffect(() => {
    if (apiError) {
      setLoadingError(true);
    }
  }, [apiError]);

  // Compute current price from selected gold_type option
  useEffect(() => {
    if (product && selectedOptions.gold_type) {
      const goldTypeOption = productOptions.find((o) => o.name === "gold_type");
      const selected = goldTypeOption?.values?.find(
        (v) => v.value === selectedOptions.gold_type,
      );
      if (selected?.price) {
        setCurrentPrice(selected.price);
      } else {
        setCurrentPrice(product.display_price || product.price || 0);
      }
    }
  }, [product, productOptions, selectedOptions.gold_type]);

  // Handle option change
  const handleOptionChange = (optionName, value) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
    if (optionName === "color" || optionName === "colors") {
      setSelectedImage(0);
      if (mainSwiper) mainSwiper.slideTo(0);
    }
  };

  // Build gallery images
  const galleryImages = useMemo(() => {
    const colorOpt = productOptions.find(
      (o) => o.name === "color" || o.name === "colors",
    );
    const colorVal = selectedOptions.color || selectedOptions.colors;
    const images = product?.images || [];
    const fallback =
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800";

    if (colorOpt && colorVal) {
      const match = colorOpt.values?.find((v) => v.value === colorVal);
      const colorImage = match?.image;
      if (colorImage) {
        return [colorImage, ...images.filter((img) => img !== colorImage)];
      }
    }
    return images.length > 0 ? images : [fallback];
  }, [selectedOptions, productOptions, product]);

  if (loadingError) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col justify-center items-center py-32 px-4 bg-[#FFFFFF] text-center space-y-5">
          <span className="text-4xl text-[#C9A227]">✦</span>
          <h2 className="text-xl font-medium uppercase tracking-widest text-[#111111]">
            Vault Creation
          </h2>
          <p className="text-xs text-[#666666] max-w-sm uppercase tracking-wider leading-relaxed">
            This piece is currently unavailable in our active catalog.
          </p>
          <Link
            href="/category"
            className="px-8 py-3.5 bg-[#111111] hover:bg-[#333333] text-white text-xs font-medium uppercase tracking-widest transition-colors rounded-full cursor-pointer"
          >
            Return to Fine Jewelry
          </Link>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col justify-center items-center py-40 space-y-4 font-sans bg-[#FFFFFF]">
          <div className="h-7 w-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] text-[#666666] font-medium uppercase tracking-[0.2em]">
            Loading Creation...
          </span>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(product, selectedOptions, currentPrice);
      setSuccessAdded(true);
      setTimeout(() => setSuccessAdded(false), 3500);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(product, selectedOptions, currentPrice);
      router.push("/checkout");
    } catch (error) {
      console.error(error);
    }
  };

  // Render option selector with minimal luxury styling
  const renderOption = (option) => {
    const { name, values } = option;
    const isColor = name === "color" || name === "colors";
    const isGoldType = name === "gold_type";
    const isSize = name === "size" || name === "sizes";
    const selectedVal = selectedOptions[name];

    const labelMap = {
      color: "Metal Color",
      colors: "Metal Color",
      gold_type: "Gold Purity",
      size: "Ring Size",
      sizes: "Ring Size",
    };

    const displayName = labelMap[name] || name.replace("_", " ");

    return (
      <div key={name} className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-sans font-medium text-[#111111] text-xs">
            {displayName}: <span className="text-[#666666]">{selectedVal}</span>
          </span>
          {isSize && (
            <button
              onClick={() => alert("Standard US Ring Size Guide: Sizes 5 to 10 available.")}
              className="text-[11px] text-[#666666] hover:text-[#111111] underline cursor-pointer font-normal"
            >
              Size Guide
            </button>
          )}
        </div>

        {isColor ? (
          <div className="flex items-center gap-2.5 pt-1">
            {values.map((val, i) => {
              const hex = getHex(val.value);
              const isSelected = selectedVal === val.value;
              return (
                <button
                  key={i}
                  onClick={() =>
                    !val.is_disabled && handleOptionChange(name, val.value)
                  }
                  disabled={val.is_disabled}
                  className={`w-7 h-7 rounded-full border transition-all duration-300 cursor-pointer relative flex items-center justify-center p-0.5 ${
                    isSelected
                      ? "border-[#111111] ring-1 ring-[#111111] scale-105"
                      : "border-[#ECECEC] hover:border-[#999999]"
                  } ${val.is_disabled ? "opacity-30 cursor-not-allowed" : ""}`}
                  title={val.value}
                  aria-label={val.value}
                >
                  <span
                    className="w-full h-full rounded-full border border-black/10"
                    style={{ backgroundColor: hex }}
                  />
                </button>
              );
            })}
          </div>
        ) : isSize ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {values.map((val, i) => {
              const isSelected = selectedVal === val.value;
              return (
                <button
                  key={i}
                  onClick={() =>
                    !val.is_disabled && handleOptionChange(name, val.value)
                  }
                  disabled={val.is_disabled}
                  className={`w-9 h-9 rounded-full border text-xs font-medium cursor-pointer transition-all duration-300 flex items-center justify-center ${
                    isSelected
                      ? "bg-[#111111] text-white border-[#111111]"
                      : "bg-[#FFFFFF] text-[#111111] border-[#ECECEC] hover:border-[#111111]"
                  } ${val.is_disabled ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                  {val.value}
                </button>
              );
            })}
          </div>
        ) : isGoldType ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {values.map((val, i) => {
              const isSelected = selectedVal === val.value;
              return (
                <button
                  key={i}
                  onClick={() =>
                    !val.is_disabled && handleOptionChange(name, val.value)
                  }
                  disabled={val.is_disabled}
                  className={`px-3.5 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "bg-[#111111] text-white border-[#111111]"
                      : "bg-[#FFFFFF] text-[#111111] border-[#ECECEC] hover:border-[#111111]"
                  } ${val.is_disabled ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                  {val.value}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {values.map((val, i) => {
              const isSelected = selectedVal === val.value;
              return (
                <button
                  key={i}
                  onClick={() =>
                    !val.is_disabled && handleOptionChange(name, val.value)
                  }
                  disabled={val.is_disabled}
                  className={`px-3.5 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "bg-[#111111] text-white border-[#111111]"
                      : "bg-[#FFFFFF] text-[#111111] border-[#ECECEC] hover:border-[#111111]"
                  } ${val.is_disabled ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                  {val.value}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="bg-[#FFFFFF] min-h-screen font-sans">
        <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-8 lg:px-12 xl:px-16 py-4 sm:py-6">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-normal text-[#666666] tracking-wide mb-4">
            <Link href="/" className="hover:text-[#111111] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/category"
              className="hover:text-[#111111] transition-colors"
            >
              Jewelry
            </Link>
            <span>/</span>
            <Link
              href={`/category/${resolveCategorySlug(rawProduct?.category_id, rawProduct?.subcategory_id)}`}
              className="hover:text-[#111111] transition-colors"
            >
              {product.category || "Ring"}
            </Link>
            <span>/</span>
            <span className="text-[#111111] truncate max-w-[180px] sm:max-w-none">
              {product.title}
            </span>
          </div>

          {/* MAIN 2-COLUMN VIEWPORT (Fits Desktop Screen 100vh) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
            {/* LEFT COLUMN: SWIPER GALLERY CAROUSEL */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Main Swiper Slider */}
              <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[620px] rounded-[24px] overflow-hidden bg-[#FAFAFA] border border-[#ECECEC] group flex items-center justify-center">
                <Swiper
                  onSwiper={setMainSwiper}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  navigation={{
                    nextEl: ".swiper-button-next-custom",
                    prevEl: ".swiper-button-prev-custom",
                  }}
                  modules={[Navigation, Thumbs, FreeMode]}
                  className="w-full h-full"
                  onSlideChange={(swiper) => setSelectedImage(swiper.activeIndex)}
                >
                  {galleryImages.map((img, idx) => (
                    <SwiperSlide
                      key={idx}
                      className="flex items-center justify-center p-8 h-full"
                    >
                      <img
                        src={img}
                        alt={`${product.title} - View ${idx + 1}`}
                        className="w-full h-full object-contain select-none max-h-[580px] transition-transform duration-500 hover:scale-105"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Offer Tag */}
                {product.discount > 0 && (
                  <span className="absolute top-5 left-5 z-20 px-3 py-1 bg-[#111111] text-[10px] font-medium text-white rounded-full tracking-wider uppercase">
                    {product.discount}% OFF
                  </span>
                )}

                {/* Swiper Prev / Next Chevrons */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#111111] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                      aria-label="Previous Slide"
                    >
                      <FaChevronLeft size={12} />
                    </button>
                    <button
                      className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#111111] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                      aria-label="Next Slide"
                    >
                      <FaChevronRight size={12} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Swiper */}
              {galleryImages.length > 1 && (
                <div className="w-full">
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    slidesPerView={5}
                    spaceBetween={12}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="thumbs-swiper cursor-pointer"
                  >
                    {galleryImages.map((img, idx) => (
                      <SwiperSlide key={idx}>
                        <div
                          className={`h-20 sm:h-22 rounded-2xl overflow-hidden border bg-[#FAFAFA] p-1 transition-all duration-300 ${
                            selectedImage === idx
                              ? "border-[#111111] ring-1 ring-[#111111]"
                              : "border-[#ECECEC] hover:border-[#999999] opacity-70"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY PURCHASING PANE */}
            <div className="lg:col-span-5 text-left sticky top-[90px] space-y-5">
              {/* Product Header & Rating */}
              <div className="space-y-2 border-b border-[#ECECEC] pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-[#666666]">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-[#C9A227] text-xs">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={11} />
                      ))}
                    </div>
                    <span className="text-xs text-[#666666] font-normal">
                      5.0 (48 Reviews)
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-start gap-4 pt-1">
                  <h1 className="text-2xl sm:text-3xl font-medium text-[#111111] leading-tight">
                    {product.title}
                  </h1>
                  <button
                    onClick={async () => {
                      await toggleWishlist({
                        product_id: product?.id,
                      });
                    }}
                    className="p-3 rounded-full border border-[#ECECEC] hover:border-[#111111] bg-white transition-all duration-300 flex items-center justify-center cursor-pointer shrink-0"
                    aria-label="Wishlist"
                  >
                    {isWishlisted(product?.id) ? (
                      <FaHeart className="text-rose-500" size={16} />
                    ) : (
                      <FaRegHeart className="text-[#666666] hover:text-rose-500" size={16} />
                    )}
                  </button>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-2xl sm:text-3xl font-semibold text-[#111111]">
                    {formatPrice(currentPrice)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm text-[#999999] line-through font-normal">
                      {formatPrice(product.display_price || product.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Options (Metal Color, Gold Type, Ring Size) */}
              <div className="space-y-4">
                {productOptions.map((option) => renderOption(option))}
              </div>

              {/* Action Buttons: Add to Bag & Buy Now */}
              <div className="space-y-2.5 pt-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 h-[54px] rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-sm"
                  >
                    <FaShoppingBag size={13} /> Add to Bag
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 h-[54px] rounded-full border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white text-xs font-medium uppercase tracking-wider flex items-center justify-center cursor-pointer transition-all duration-300"
                  >
                    Buy Now
                  </button>
                </div>

                {successAdded && (
                  <div className="bg-[#FAFAFA] border border-[#ECECEC] text-[#111111] rounded-2xl p-3 text-xs font-medium flex items-center justify-center gap-2 animate-fade-in">
                    <FaCheck className="text-[#C9A227]" /> Item added to your shopping bag
                  </div>
                )}
              </div>

              {/* TRUST CARDS (4 Clean Tiles) */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#ECECEC]">
                <div className="bg-[#FAFAFA] border border-[#ECECEC] rounded-xl p-3 flex items-center gap-3">
                  <FaShieldAlt className="text-[#C9A227] text-base shrink-0" />
                  <div className="text-left">
                    <p className="text-[11px] font-medium text-[#111111]">Lifetime Warranty</p>
                    <p className="text-[9px] text-[#666666]">Guaranteed Craftsmanship</p>
                  </div>
                </div>
                <div className="bg-[#FAFAFA] border border-[#ECECEC] rounded-xl p-3 flex items-center gap-3">
                  <FaTruck className="text-[#C9A227] text-base shrink-0" />
                  <div className="text-left">
                    <p className="text-[11px] font-medium text-[#111111]">Free Express Shipping</p>
                    <p className="text-[9px] text-[#666666]">Insured FedEx Delivery</p>
                  </div>
                </div>
                <div className="bg-[#FAFAFA] border border-[#ECECEC] rounded-xl p-3 flex items-center gap-3">
                  <FaGem className="text-[#C9A227] text-base shrink-0" />
                  <div className="text-left">
                    <p className="text-[11px] font-medium text-[#111111]">Certified Diamonds</p>
                    <p className="text-[9px] text-[#666666]">GIA Hallmarked Quality</p>
                  </div>
                </div>
                <div className="bg-[#FAFAFA] border border-[#ECECEC] rounded-xl p-3 flex items-center gap-3">
                  <FaUndo className="text-[#C9A227] text-base shrink-0" />
                  <div className="text-left">
                    <p className="text-[11px] font-medium text-[#111111]">30-Day Returns</p>
                    <p className="text-[9px] text-[#666666]">Hassle-free Exchange</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACCORDION DETAILS SECTION (Below First Viewport) */}
          <div className="mt-16 pt-12 border-t border-[#ECECEC] max-w-4xl mx-auto space-y-4 text-left">
            <h3 className="text-2xl font-medium text-[#111111] text-center mb-8">
              Creation Details &amp; Specifications
            </h3>

            {/* Accordion 1: Product Details */}
            <div className="border border-[#ECECEC] rounded-2xl overflow-hidden bg-[#FFFFFF]">
              <button
                onClick={() => toggleAccordion("details")}
                className="w-full px-6 py-4 flex justify-between items-center text-xs font-medium uppercase tracking-wider text-[#111111] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
              >
                <span>Product Details</span>
                {openAccordions.details ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
              </button>
              {openAccordions.details && (
                <div className="px-6 pb-6 pt-2 text-xs text-[#666666] leading-relaxed font-normal border-t border-[#ECECEC]/50 space-y-3">
                  <p>{product.description}</p>
                  <p>
                    Hand-crafted with meticulous precision, this piece represents the pinnacle of fine diamond setting and luxury metal craftsmanship.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 2: Specifications */}
            <div className="border border-[#ECECEC] rounded-2xl overflow-hidden bg-[#FFFFFF]">
              <button
                onClick={() => toggleAccordion("specs")}
                className="w-full px-6 py-4 flex justify-between items-center text-xs font-medium uppercase tracking-wider text-[#111111] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
              >
                <span>Specifications</span>
                {openAccordions.specs ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
              </button>
              {openAccordions.specs && (
                <div className="px-6 pb-6 pt-3 text-xs text-[#666666] border-t border-[#ECECEC]/50 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between py-1.5 border-b border-[#ECECEC]">
                      <span className="text-[#111111] font-medium">Stock ID / SKU</span>
                      <span>{product.id}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#ECECEC]">
                      <span className="text-[#111111] font-medium">Metal Weight</span>
                      <span>{product.goldWeight || 2.5}g (approx.)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#ECECEC]">
                      <span className="text-[#111111] font-medium">Metal Purity</span>
                      <span>{selectedOptions.gold_type || "18K Solid Gold"}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#ECECEC]">
                      <span className="text-[#111111] font-medium">Metal Color</span>
                      <span>{selectedOptions.color || selectedOptions.colors || "Yellow Gold"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Diamond Details */}
            <div className="border border-[#ECECEC] rounded-2xl overflow-hidden bg-[#FFFFFF]">
              <button
                onClick={() => toggleAccordion("diamonds")}
                className="w-full px-6 py-4 flex justify-between items-center text-xs font-medium uppercase tracking-wider text-[#111111] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
              >
                <span>Diamond &amp; Gemstone Details</span>
                {openAccordions.diamonds ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
              </button>
              {openAccordions.diamonds && (
                <div className="px-6 pb-6 pt-3 text-xs text-[#666666] border-t border-[#ECECEC]/50 space-y-3">
                  {rawProduct?.diamonds && rawProduct.diamonds.length > 0 ? (
                    rawProduct.diamonds.map((d, i) => (
                      <div key={i} className="bg-[#FAFAFA] p-4 rounded-xl border border-[#ECECEC] space-y-2">
                        <div className="flex justify-between font-medium text-[#111111]">
                          <span>Stone #{i + 1} ({d.type || "Natural"})</span>
                          <span>{d.quantity || 1} x {d.weight || 0.5} Carat</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] pt-1">
                          <div><span className="text-[#999999] block">Shape</span>{d.shape || "Round"}</div>
                          <div><span className="text-[#999999] block">Color</span>{d.color || "D"}</div>
                          <div><span className="text-[#999999] block">Clarity</span>{d.clarity || "VS1"}</div>
                          <div><span className="text-[#999999] block">Cut</span>{d.cut || "Excellent"}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="font-normal">
                      Featuring GIA-certified ideal brilliant cut diamonds selected for maximum fire, brilliance, and scintillation.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Accordion 4: Shipping & Returns */}
            <div className="border border-[#ECECEC] rounded-2xl overflow-hidden bg-[#FFFFFF]">
              <button
                onClick={() => toggleAccordion("shipping")}
                className="w-full px-6 py-4 flex justify-between items-center text-xs font-medium uppercase tracking-wider text-[#111111] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
              >
                <span>Shipping &amp; Returns</span>
                {openAccordions.shipping ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
              </button>
              {openAccordions.shipping && (
                <div className="px-6 pb-6 pt-3 text-xs text-[#666666] leading-relaxed border-t border-[#ECECEC]/50 space-y-2">
                  <p>
                    <strong className="text-[#111111] font-medium">Complimentary FedEx Shipping:</strong> All orders are shipped via insured express courier, packaged in discreet luxury boxes, requiring signature on delivery.
                  </p>
                  <p>
                    <strong className="text-[#111111] font-medium">30-Day Return Policy:</strong> Returns and complimentary ring resizing are welcomed within 30 days of delivery.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 5: Lifetime Warranty */}
            <div className="border border-[#ECECEC] rounded-2xl overflow-hidden bg-[#FFFFFF]">
              <button
                onClick={() => toggleAccordion("warranty")}
                className="w-full px-6 py-4 flex justify-between items-center text-xs font-medium uppercase tracking-wider text-[#111111] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
              >
                <span>Lifetime Warranty</span>
                {openAccordions.warranty ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
              </button>
              {openAccordions.warranty && (
                <div className="px-6 pb-6 pt-3 text-xs text-[#666666] leading-relaxed border-t border-[#ECECEC]/50 space-y-2">
                  <p>
                    Every piece is backed by our lifetime warranty against manufacturing defects, including complimentary annual ultrasonic cleaning, prong inspections, and polishing services.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RELATED PRODUCTS SWIPER CAROUSEL */}
          <div className="mt-20 pt-12 border-t border-[#ECECEC]">
            <div className="text-center space-y-2 mb-10">
              <span className="text-[10px] font-medium tracking-widest uppercase text-[#666666]">
                Curated Selection
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#111111]">
                You May Also Like
              </h2>
            </div>

            {rawProduct?.related_products && rawProduct.related_products.length > 0 ? (
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 4 },
                }}
                className="related-swiper py-4"
              >
                {rawProduct.related_products.map((item) => (
                  <SwiperSlide key={item?._id}>
                    <ProductCard item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-xs text-[#666666] text-center font-normal">
                Explore our full catalog for complementary creations.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
