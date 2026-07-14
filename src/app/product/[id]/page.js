"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaArrowLeft,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaCheck,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail, clearSelectedProduct } from "@/redux/productSlice";
import Layout from "@/components/layout/Layout";
import { useStore } from "@/context/StoreContext";
import { colors as colorOptions } from "@/data/initialData";
import ProductCard from "@/components/ui/ProductCard";

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

  const {
    guestId,
    calculatePrice,
    addToCart,
    toggleWishlist,
    isWishlisted,
    formatPrice,
  } = useStore();
  console.log("guestId :>> ", guestId);

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
  const [activeTab, setActiveTab] = useState("overview");
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

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
          "Ethically sourced certified diamond luxury masterpiece.",
        discount: p.discount || 0,
        goldWeight: p.weight || 2.5,
        price: p.price || 0,
        display_price: p.display_price || 0,
        style: p.subcategory_id?.name || "",
        isFromApi: true,
      };

      // Define static options configuration
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

      const defaults = {
        color: "Yellow Gold",
        gold_type: "18K Solid Gold",
        size: "7",
      };

      setProduct(mapped);
      setProductOptions(staticOptionsList);
      setSelectedOptions(defaults);
      setLoadingError(false);
    }
  }, [rawProduct]);

  useEffect(() => {
    if (apiError) {
      setLoadingError(true);
    }
  }, [apiError]);

  // useEffect(() => {
  //   const getSimilarProducts = async () => {
  //     if (!rawProduct) return;
  //     try {
  //       setLoadingSimilar(true);
  //       const baseUrl =
  //         process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  //       const body = {
  //         page: 1,
  //         limit: 5,
  //       };

  //       if (rawProduct.subcategory_id) {
  //         const subId = typeof rawProduct.subcategory_id === "object"
  //           ? rawProduct.subcategory_id._id
  //           : rawProduct.subcategory_id;
  //         body.subcategory_id = subId;
  //       } else if (rawProduct.category_id) {
  //         const catId = typeof rawProduct.category_id === "object"
  //           ? rawProduct.category_id._id
  //           : rawProduct.category_id;
  //         body.category_id = catId;
  //       }

  //       const response = await fetch(`${baseUrl}/api/product/getProduct`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(body),
  //       });

  //       if (response.ok) {
  //         const resData = await response.json();
  //         const list = resData?.data?.products || [];
  //         const filtered = list.filter((p) => p._id !== rawProduct._id);
  //         const mapped = filtered.slice(0, 4).map((p) => {
  //           const colorsOpt = p?.options?.filter((opt) => opt.name === "colors" || opt.name === "color") || [];
  //           return {
  //             id: p._id,
  //             title: p.name,
  //             slug: p.slug,
  //             is_wishlist: p.is_wishlist || false,
  //             category: resolveCategoryName(p.category_id, p.subcategory_id),
  //             colors: colorsOpt && colorsOpt.length > 0 ? colorsOpt[0].values : [],
  //             image: p.images && p.images[0]
  //               ? p.images[0]
  //               : "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&fit=crop",
  //             display_price: p.display_price || p.price || 0,
  //             isFromApi: true,
  //           };
  //         });
  //         setSimilarProducts(mapped);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching similar products:", err);
  //     } finally {
  //       setLoadingSimilar(false);
  //     }
  //   };
  //   getSimilarProducts();
  // }, [rawProduct]);

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
    // Reset to first image when color changes
    if (optionName === "color" || optionName === "colors") {
      setSelectedImage(0);
    }
  };

  // Build gallery images: color image first (if color option exists) + product images
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

  // Current displayed image
  const currentImage = galleryImages[selectedImage] || galleryImages[0];

  if (loadingError) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col justify-center items-center py-40 px-4 bg-white text-center space-y-6">
          <span className="font-serif italic text-4xl text-neutral-300">✦</span>
          <h2 className="font-serif text-lg md:text-xl uppercase tracking-widest text-neutral-800">
            Creations Atelier
          </h2>
          <p className="text-[10px] md:text-xs text-neutral-400 max-w-sm uppercase tracking-wider leading-relaxed">
            This item could not be retrieved from our vaults. It may have been
            sold or does not exist.
          </p>
          <Link
            href="/category"
            className="px-6 py-3 bg-neutral-950 hover:bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
          >
            Return to Catalog
          </Link>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col justify-center items-center py-40 space-y-4 font-sans bg-white">
          <div className="h-8 w-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em]">
            Loading Atelier Piece...
          </span>
        </div>
      </Layout>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = async () => {
    try {
      await addToCart(product, selectedOptions, currentPrice);

      setSuccessAdded(true);
      setTimeout(() => setSuccessAdded(false), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  // Render option selector based on option name
  const renderOption = (option, index) => {
    const { name, values } = option;
    const isColor = name === "color" || name === "colors";
    const isGoldType = name === "gold_type";
    const isSize = name === "size" || name === "sizes";
    const selectedVal = selectedOptions[name];
    const stepNum = index + 1;

    const labelMap = {
      color: "Select Color",
      colors: "Select Color",
      gold_type: "Select Gold Type",
      size: "Select Size",
      sizes: "Select Size",
    };

    return (
      <div key={name} className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
          {stepNum}. {labelMap[name] || name}
        </label>

        {isColor ? (
          <div className="flex items-center gap-3">
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
                  className={`w-8 h-8 rounded-full border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-slate-800 scale-110 "
                      : "border-slate-200 hover:border-slate-400"
                  } ${val.is_disabled ? "opacity-30 cursor-not-allowed" : ""}`}
                  style={{ backgroundColor: hex }}
                  title={val.value}
                  aria-label={val.value}
                />
              );
            })}
          </div>
        ) : isGoldType ? (
          <div className="flex flex-wrap gap-2.5">
            {values.map((val, i) => {
              const isSelected = selectedVal === val.value;
              return (
                <button
                  key={i}
                  onClick={() =>
                    !val.is_disabled && handleOptionChange(name, val.value)
                  }
                  disabled={val.is_disabled}
                  className={`px-5 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#0e0e0e] text-white border-slate-800"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  } ${val.is_disabled ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                  {val.value}
                </button>
              );
            })}
          </div>
        ) : isSize ? (
          <div className="flex flex-wrap gap-2.5">
            {values.map((val, i) => {
              const isSelected = selectedVal === val.value;
              return (
                <button
                  key={i}
                  onClick={() =>
                    !val.is_disabled && handleOptionChange(name, val.value)
                  }
                  disabled={val.is_disabled}
                  className={`px-5 py-3 rounded-xl border text-xs font-bold tracking-wider cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  } ${val.is_disabled ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                  {val.value}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {values.map((val, i) => {
              const isSelected = selectedVal === val.value;
              return (
                <button
                  key={i}
                  onClick={() =>
                    !val.is_disabled && handleOptionChange(name, val.value)
                  }
                  disabled={val.is_disabled}
                  className={`px-5 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#0e0e0e] text-white border-slate-800"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  } ${val.is_disabled ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                  {val.value}
                </button>
              );
            })}
          </div>
        )}

        {isColor && selectedVal && (
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider">
            {selectedVal}
          </span>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-10 font-sans">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider mb-8 transition-colors cursor-pointer"
        >
          <FaArrowLeft size={10} />
          Back to Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Product Gallery */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-xs relative">
              <img
                src={currentImage}
                alt={product.title}
                className="h-full w-full object-cover"
              />
              {product.discount > 0 && (
                <span className="absolute top-5 left-5 px-3 py-1.5 bg-accent/90 backdrop-blur-xs text-[10px] font-extrabold text-white rounded-md tracking-wider uppercase">
                  Special Offer: {product.discount}% Off
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border bg-white cursor-pointer transition-all ${
                      selectedImage === idx
                        ? "border-slate-800 ring-2 ring-slate-800/20"
                        : "border-slate-100 hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="h-full w-full object-cover opacity-75 hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Custom Configuration */}
          <div className="text-left space-y-6 lg:pl-4">
            <div className="space-y-3 border-b border-slate-100 pb-5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-primary font-bold uppercase tracking-[0.25em]">
                  {product.category}
                </span>
                <span className="text-[10px] bg-neutral-100 text-neutral-800 font-extrabold border border-neutral-200/50 rounded-full px-3 py-0.5 uppercase tracking-wider">
                  Hallmarked & Certified
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-2xl sm:text-3xl font-serif font-medium text-slate-900 tracking-wide">
                  {product.title}
                </h1>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2.5 rounded-full border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50 active:scale-95 transition-all duration-200 shadow-xs flex items-center justify-center cursor-pointer group shrink-0"
                  aria-label={
                    wishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  {wishlisted ? (
                    <FaHeart
                      className="text-rose-500 scale-110 transition-transform duration-200"
                      size={20}
                    />
                  ) : (
                    <FaRegHeart
                      className="text-slate-400 group-hover:text-rose-500 transition-colors duration-200"
                      size={20}
                    />
                  )}
                </button>
              </div>

              {/* Configured Price below Title */}
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatPrice(currentPrice)}
                </span>
                {product.discount > 0 && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(product.display_price || product.price)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    {product.discount}% Off
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 font-bold uppercase tracking-wider pt-1">
                <span>Stock ID: {product.id}</span>
                <span>•</span>
                <span>Collection Style: {product.style}</span>
                <span>•</span>
                <span>Metal Weight: {product.goldWeight || 0}g</span>
              </div>
            </div>

            {/* Dynamic Options from product.options */}
            <div className="space-y-5">
              {productOptions.map((option, index) =>
                renderOption(option, index),
              )}
            </div>

            {/* Main CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
              <button
                onClick={handleAddToCart}
                className="w-full btn-teal py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                <FaShoppingCart /> Add Custom Spec to Bag
              </button>
            </div>

            {/* Success Message Banner */}
            {successAdded && (
              <div className="bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-xl p-3.5 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <FaCheck className="text-neutral-800" /> Specs added
                successfully. View in bag at checkout!
              </div>
            )}

            {/* Trust assurances lists */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
              {[
                {
                  text: "Lifetime Warranty",
                  icon: <FaShieldAlt className="text-accent text-base" />,
                },
                {
                  text: "FedEx Free Shipping",
                  icon: <FaTruck className="text-accent text-base" />,
                },
                {
                  text: "Easy Returns",
                  icon: <FaUndo className="text-accent text-base" />,
                },
              ].map((trust, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center space-y-1"
                >
                  {trust.icon}
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    {trust.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Elegant Tabbed Details & Specifications */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div className="flex border-b border-slate-100 gap-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                    activeTab === "overview"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("specifications")}
                  className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                    activeTab === "specifications"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                    activeTab === "shipping"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Shipping & Warranty
                </button>
              </div>

              {activeTab === "overview" && (
                <div className="space-y-3 transition-opacity duration-300">
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    {product.description}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Individually hand-set by master jewelers, this masterpiece
                    exemplifies the DN Diamond commitment to exceptional fire,
                    light performance, and bespoke craftsmanship.
                  </p>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="space-y-4 transition-opacity duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                    <div className="border-b border-slate-100 pb-1.5 flex justify-between items-center">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        Metal Weight
                      </span>
                      <span className="text-slate-800 font-bold">
                        {product.goldWeight || 2.5}g (approx.)
                      </span>
                    </div>
                    <div className="border-b border-slate-100 pb-1.5 flex justify-between items-center">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        Metal Composition
                      </span>
                      <span className="text-slate-800 font-bold">
                        {selectedOptions.gold_type || "18K Solid Gold"}
                      </span>
                    </div>
                    <div className="border-b border-slate-100 pb-1.5 flex justify-between items-center">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        Diamond Selection
                      </span>
                      <span className="text-slate-800 font-bold">
                        {rawProduct?.pricing?.diamond_cost > 0
                          ? `Atelier Select (${formatPrice(rawProduct.pricing.diamond_cost)})`
                          : "GIA Certified Brilliant Cut"}
                      </span>
                    </div>
                    <div className="border-b border-slate-100 pb-1.5 flex justify-between items-center">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        Diamond weight
                      </span>
                      <span className="text-slate-800 font-bold">
                        {rawProduct?.diamondWeight
                          ? `${rawProduct.diamondWeight.join(", ")} Carat`
                          : "0.50 Carat (approx.)"}
                      </span>
                    </div>
                    <div className="border-b border-slate-100 pb-1.5 flex justify-between items-center">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        Diamond Specifications
                      </span>
                      <span className="text-slate-800 font-bold">
                        Clarity: VS+ | Color: F-G
                      </span>
                    </div>
                    <div className="border-b border-slate-100 pb-1.5 flex justify-between items-center">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        Category & Style
                      </span>
                      <span className="text-slate-800 font-bold">
                        {product.category} • {product.style || "Atelier Style"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-2 text-xs text-slate-500 leading-relaxed font-light transition-opacity duration-300">
                  <p>
                    <strong>FedEx Priority Shipping:</strong> Every shipment is
                    fully insured, securely double-boxed, and requires a
                    signature upon delivery.
                  </p>
                  <p>
                    <strong>Lifetime Warranty:</strong> We guarantee the quality
                    of our craftsmanship for a lifetime. Annual polishing and
                    stone inspections are complimentary at our Hong Kong studio.
                  </p>
                  <p>
                    <strong>30-Day Returns:</strong> If you are not fully
                    satisfied, returns or resizing requests are accepted within
                    30 days of receipt.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="border-t border-slate-100 mt-20 pt-16">
            <div className="text-center space-y-2 mb-12">
              <span className="text-[9px] text-neutral-400 font-extrabold tracking-[0.3em] uppercase">
                Curated Selection
              </span>
              <h2 className="text-2xl lg:text-3xl font-serif font-light text-neutral-900 uppercase tracking-widest">
                You May Also{" "}
                <span className="font-serif italic font-light lowercase">
                  Like
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
              {similarProducts.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
