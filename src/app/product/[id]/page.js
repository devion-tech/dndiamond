"use client";

import React, { useState, useEffect, use } from "react";
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

export default function ProductDetail({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const {
    calculatePrice,
    addToCart,
    toggleWishlist,
    isWishlisted,
    formatPrice,
  } = useStore();

  const dispatch = useDispatch();
  const { selectedProduct: rawProduct, error: apiError } = useSelector(
    (state) => state.products,
  );
  const [product, setProduct] = useState(null);

  // Dynamic selection states
  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedCarat, setSelectedCarat] = useState(0.5);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [successAdded, setSuccessAdded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  // Fetch product details on mount/param change
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetail(productId));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, productId]);

  // Update local state when rawProduct updates
  useEffect(() => {
    if (rawProduct) {
      const p = rawProduct;
      const diamondCost = p.pricing?.diamond_cost || p.price || 600;
      const gemstoneCost = p.pricing?.gemstone_cost || 0;
      const additionalCost = p.pricing?.additional_cost || 150;

      const mapped = {
        id: p._id,
        title: p.name,
        category: resolveCategoryName(p.category_id, p.subcategory_id),
        image:
          p.images && p.images[0]
            ? p.images[0]
            : "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800",
        description:
          p.description ||
          "Ethically sourced certified diamond luxury masterpiece.",
        discount: p.discount || 0,
        metalType: p.metalType || ["14K Gold", "18K Gold", "Platinum"],
        diamondWeight: p.diamondWeight || [0.5, 0.75, 1.0],
        goldWeight: p.weight || 2.5,
        diamondPrice: diamondCost + gemstoneCost,
        makingCharges: additionalCost,
        style: p.subcategory_id?.name || "",
        origin: p.origin || "natural",
        isFromApi: true,
      };

      setProduct(mapped);
      setSelectedMetal(mapped.metalType[0]);
      setSelectedCarat(mapped.diamondWeight[0]);
      setLoadingError(false);
    }
  }, [rawProduct]);

  useEffect(() => {
    if (apiError) {
      setLoadingError(true);
    }
  }, [apiError]);

  // Recalculate price dynamically when options change
  useEffect(() => {
    if (product && selectedMetal && selectedCarat) {
      const calculated = calculatePrice(product, selectedMetal, selectedCarat);
      setCurrentPrice(calculated);

      // Compute raw original price before discount
      let metalMultiplier = 1.0;
      if (selectedMetal === "18K Gold") metalMultiplier = 0.75;
      else if (selectedMetal === "14K Gold") metalMultiplier = 0.58;
      else if (selectedMetal === "Platinum") metalMultiplier = 1.35;

      const goldVal = (product.goldWeight || 0) * metalMultiplier * 75.0;
      const baseCarat = product.diamondWeight ? product.diamondWeight[0] : 0.5;
      const gemMultiplier = Math.pow(selectedCarat / baseCarat, 1.8);
      const gemVal = (product.diamondPrice || 0) * gemMultiplier;
      const laborVal = product.makingCharges || 0;

      setOriginalPrice(Math.round(goldVal + gemVal + laborVal));
    }
  }, [product, selectedMetal, selectedCarat, calculatePrice]);

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

  const handleAddToCart = () => {
    addToCart(product, selectedMetal, selectedCarat, currentPrice);
    setSuccessAdded(true);
    setTimeout(() => setSuccessAdded(false), 3000);
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
                src={
                  product.image ||
                  "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800"
                }
                alt={product.title}
                className="h-full w-full object-cover"
              />
              {product.discount > 0 && (
                <span className="absolute top-5 left-5 px-3 py-1.5 bg-accent/90 backdrop-blur-xs text-[10px] font-extrabold text-white rounded-md tracking-wider uppercase">
                  Special Offer: {product.discount}% Off
                </span>
              )}
            </div>

            {/* Secondary Mock Thumbs */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className="aspect-square rounded-xl overflow-hidden border border-slate-100 bg-white hover:border-primary/50 transition-all cursor-pointer"
                >
                  <img
                    src={
                      product.image ||
                      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400"
                    }
                    alt={`Angle ${num}`}
                    className="h-full w-full object-cover opacity-75 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Custom Configuration */}
          <div className="text-left space-y-6 lg:pl-4">
            <div className="space-y-2 border-b border-slate-100 pb-5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-primary font-bold uppercase tracking-[0.25em]">
                  {product.category}
                </span>
                <span className="text-[10px] bg-neutral-100 text-neutral-800 font-extrabold border border-neutral-200/50 rounded-full px-3 py-0.5 uppercase tracking-wider">
                  Hallmarked & Certified
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-medium text-slate-900 tracking-wide">
                {product.title}
              </h1>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Stock ID: {product.id} • Collection Style: {product.style}
              </p>
            </div>

            {/* Pricing Calculator Output */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
                Configured Atelier Pricing
              </span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatPrice(currentPrice)}
                </span>
                {product.discount > 0 && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider border-t border-slate-200/50 pt-2">
                <span>Metal Weight: {product.goldWeight || 0}g</span>
                <span>Gold Rate: {formatPrice(75)}/g</span>
              </div>
            </div>

            {/* Interactive Selection forms */}
            <div className="space-y-5">
              {/* Metal Purity choice */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  1. Select Metal Color & Purity
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {product.metalType.map((metal) => (
                    <button
                      key={metal}
                      onClick={() => setSelectedMetal(metal)}
                      className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer text-center transition-all ${selectedMetal === metal ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diamond Carats size choice */}
              {product.diamondWeight && product.diamondWeight.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    2. Select Diamond Carat weight
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.diamondWeight.map((weight) => (
                      <button
                        key={weight}
                        onClick={() => setSelectedCarat(weight)}
                        className={`px-5 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${selectedCarat === weight ? "bg-primary text-white border-primary" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                      >
                        {weight} Carats
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
              <button
                onClick={handleAddToCart}
                className="flex-[2] btn-teal py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                <FaShoppingCart /> Add Custom Spec to Bag
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`flex-1 py-4 border rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all ${wishlisted ? "bg-neutral-800 text-white border-neutral-800 hover:bg-neutral-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
              >
                <FaHeart className={wishlisted ? "text-white" : ""} />{" "}
                {wishlisted ? "Saved" : "Save Favorite"}
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

            {/* Product Atelier Notes */}
            <div className="space-y-2 text-xs font-light leading-relaxed border-t border-slate-100 pt-6">
              <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">
                Atelier Craftsmanship Notes
              </h4>
              <p className="text-slate-500">
                {product.description} Each gemstone cluster is claw-set by hand
                under a microscope to ensure perfect optical reflection
                alignment and secure durability. Gold bands are forged and
                finished at standard hallmark certification quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
