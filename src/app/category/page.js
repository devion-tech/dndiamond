"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  FaFilter,
  FaSearch,
  FaRing,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/productSlice";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ui/ProductCard";
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

function CatalogContent() {
  const searchParams = useSearchParams();
  const { jewelry, calculatePrice, formatPrice } = useStore();

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("");
  const [maxPrice, setMaxPrice] = useState(15000);
  const [selectedCaratRange, setSelectedCaratRange] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [sortOrder, setSortOrder] = useState("DESC"); // DESC or ASC

  // API fetching states
  const [subcategoryId, setSubcategoryId] = useState("");

  // Filter drawer and accordion states
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [accordions, setAccordions] = useState({
    search: true,
    category: true,
    metal: true,
    price: true,
    origin: true,
    carat: true,
  });

  const toggleAccordion = (key) => {
    setAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Sync filters with URL search params on mount
  useEffect(() => {
    const catParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const originParam = searchParams.get("origin");
    const styleParam = searchParams.get("style");
    const subcatParam = searchParams.get("subcategory_id");

    if (catParam) setSelectedCategory(catParam);
    if (searchParam) setSearch(searchParam);
    if (originParam) setSelectedOrigin(originParam);
    if (styleParam) setSelectedStyle(styleParam);
    if (subcatParam) {
      setSubcategoryId(subcatParam);
    } else {
      setSubcategoryId("");
    }
  }, [searchParams]);

  const dispatch = useDispatch();
  const { items: rawProducts, loading: apiLoading } = useSelector(
    (state) => state.products,
  );

  // Fetch products dynamically from Redux
  useEffect(() => {
    dispatch(fetchProducts({ limit: 50, subcategory_id: subcategoryId }));
  }, [dispatch, subcategoryId]);

  const apiProducts = useMemo(() => {
    return rawProducts.map((p) => {
      const diamondCost = p.pricing?.diamond_cost || p.price || 600;
      const gemstoneCost = p.pricing?.gemstone_cost || 0;
      const additionalCost = p.pricing?.additional_cost || 150;
      return {
        id: p._id,
        title: p.name,
        category: resolveCategoryName(p.category_id, p.subcategory_id),
        image:
          p.images && p.images[0]
            ? p.images[0]
            : "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&fit=crop",
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
        origin: p.origin || (p.diamonds && p.diamonds[0]?.type?.toLowerCase().includes("lab") ? "labgrown" : "natural"),
        isFromApi: true,
      };
    });
  }, [rawProducts]);

  // Determine the source list
  const productsSource = apiProducts;

  // Apply filters and sorting dynamically
  const filteredJewelry = productsSource.filter((item) => {
    // Search filter
    if (
      search &&
      !item.title.toLowerCase().includes(search.toLowerCase()) &&
      !item.category.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (selectedCategory && item.category !== selectedCategory) {
      return false;
    }

    // Origin filter
    if (selectedOrigin && item.origin !== selectedOrigin) {
      return false;
    }

    // Style/subcategory filter
    if (
      selectedStyle &&
      (!item.style ||
        !item.style.toLowerCase().includes(selectedStyle.toLowerCase()))
    ) {
      return false;
    }

    // Metal type filter
    if (selectedMetal && !item.metalType.includes(selectedMetal)) {
      return false;
    }

    // Carat size filter check
    if (selectedCaratRange) {
      const hasMatchingCarat =
        item.diamondWeight &&
        item.diamondWeight.some((w) => {
          if (selectedCaratRange === "low") return w <= 0.5;
          if (selectedCaratRange === "mid") return w > 0.5 && w <= 1.0;
          if (selectedCaratRange === "high") return w > 1.0;
          return true;
        });
      if (!hasMatchingCarat) return false;
    }

    // Price range filter
    const defaultMetal = item.metalType ? item.metalType[0] : "14K Gold";
    const defaultCarat = item.diamondWeight ? item.diamondWeight[0] : 0.5;
    const itemPrice = calculatePrice(item, defaultMetal, defaultCarat);
    if (itemPrice > maxPrice) {
      return false;
    }

    return true;
  });

  // Apply Sorting
  const sortedJewelry = [...filteredJewelry].sort((a, b) => {
    const defaultMetalA = a.metalType ? a.metalType[0] : "14K Gold";
    const defaultCaratA = a.diamondWeight ? a.diamondWeight[0] : 0.5;
    const priceA = calculatePrice(a, defaultMetalA, defaultCaratA);

    const defaultMetalB = b.metalType ? b.metalType[0] : "14K Gold";
    const defaultCaratB = b.diamondWeight ? b.diamondWeight[0] : 0.5;
    const priceB = calculatePrice(b, defaultMetalB, defaultCaratB);

    return sortOrder === "ASC" ? priceA - priceB : priceB - priceA;
  });

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedMetal("");
    setMaxPrice(15000);
    setSelectedCaratRange("");
    setSelectedOrigin("");
    setSelectedStyle("");
    setSubcategoryId("");
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Page Header */}
      <div className="text-center space-y-2 mb-12">
        <span className="text-[9px] text-neutral-400 font-extrabold tracking-[0.3em] uppercase">
          High Jewelry Atelier
        </span>
        <h1 className="text-3xl lg:text-4xl font-serif font-light text-neutral-900 uppercase tracking-widest">
          The Jewelry{" "}
          <span className="font-serif italic font-light lowercase">
            Collection
          </span>
        </h1>
      </div>

      {/* Premium Toolbar */}
      <div className="flex items-center justify-between border-y border-neutral-100 py-3.5 px-2 mb-10 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-800">
        {/* Left Side: Filter button & Product count */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 text-neutral-800 hover:text-neutral-955 transition-colors uppercase tracking-widest font-bold cursor-pointer"
          >
            <FaFilter size={10} className="text-neutral-500" />
            <span>Filter</span>
          </button>
          <span className="h-4 w-px bg-neutral-200 hidden sm:inline-block"></span>
          <span className="text-neutral-400 font-medium tracking-widest hidden sm:inline-block">
            {sortedJewelry.length} Products Found
          </span>
        </div>

        {/* Right Side: Sort Option */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-medium tracking-widest">
            Sort
          </span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-transparent text-neutral-800 border-none font-bold uppercase tracking-widest focus:outline-none cursor-pointer pr-1"
          >
            <option value="DESC">Novelty (High-Low)</option>
            <option value="ASC">Novelty (Low-High)</option>
          </select>
        </div>
      </div>

      {/* Left Slide-out Filter Drawer */}
      {isFilterDrawerOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsFilterDrawerOpen(false)}
            className="fixed inset-0 bg-neutral-900/30 backdrop-blur-xs z-40 transition-opacity duration-300"
          />

          {/* Drawer Panel */}
          <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col justify-between transform transition-transform duration-300 animate-slide-in-left">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
              <span className="text-xs font-bold tracking-[0.2em] text-neutral-800 uppercase">
                Filters
              </span>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer flex items-center justify-center p-1"
                aria-label="Close Filters"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Scrollable Filters List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 text-left">
              {/* 1. Search Box Accordion */}
              <div className="border-b border-neutral-100 pb-4">
                <button
                  onClick={() => toggleAccordion("search")}
                  className="w-full flex justify-between items-center text-[10px] font-bold tracking-widest text-neutral-700 uppercase mb-3"
                >
                  <span>Keyword Search</span>
                  {accordions.search ? (
                    <FaChevronUp size={8} />
                  ) : (
                    <FaChevronDown size={8} />
                  )}
                </button>
                {accordions.search && (
                  <div className="relative mt-2">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs" />
                    <input
                      type="text"
                      placeholder="Search collection..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full border border-neutral-200 bg-neutral-50 text-neutral-800 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-neutral-955 focus:border-transparent transition-all placeholder:text-neutral-400"
                    />
                  </div>
                )}
              </div>

              {/* 2. Category Accordion */}
              <div className="border-b border-neutral-100 pb-4">
                <button
                  onClick={() => toggleAccordion("category")}
                  className="w-full flex justify-between items-center text-[10px] font-bold tracking-widest text-neutral-700 uppercase mb-3"
                >
                  <span>Category</span>
                  {accordions.category ? (
                    <FaChevronUp size={8} />
                  ) : (
                    <FaChevronDown size={8} />
                  )}
                </button>
                {accordions.category && (
                  <div className="space-y-1 mt-2">
                    {[
                      { label: "All Categories", value: "" },
                      { label: "Rings", value: "Ring" },
                      { label: "Earrings", value: "Earring" },
                      { label: "Pendants", value: "Pendant" },
                      {
                        label: "Bracelets & Bangles",
                        value: "Bracelet & Bangle",
                      },
                      { label: "Necklaces", value: "Necklace" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedCategory(opt.value)}
                        className={`w-full text-left py-1 text-[11px] font-medium tracking-wide uppercase transition-colors ${selectedCategory === opt.value ? "text-neutral-900 font-bold" : "text-neutral-400 hover:text-neutral-800"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Metal Setting Accordion */}
              <div className="border-b border-neutral-100 pb-4">
                <button
                  onClick={() => toggleAccordion("metal")}
                  className="w-full flex justify-between items-center text-[10px] font-bold tracking-widest text-neutral-700 uppercase mb-3"
                >
                  <span>Main Material</span>
                  {accordions.metal ? (
                    <FaChevronUp size={8} />
                  ) : (
                    <FaChevronDown size={8} />
                  )}
                </button>
                {accordions.metal && (
                  <div className="space-y-1 mt-2">
                    {[
                      { label: "All Metals", value: "" },
                      { label: "14K Gold", value: "14K Gold" },
                      { label: "18K Gold", value: "18K Gold" },
                      { label: "Platinum", value: "Platinum" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedMetal(opt.value)}
                        className={`w-full text-left py-1 text-[11px] font-medium tracking-wide uppercase transition-colors ${selectedMetal === opt.value ? "text-neutral-900 font-bold" : "text-neutral-400 hover:text-neutral-800"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Price Slider Accordion */}
              <div className="border-b border-neutral-100 pb-4">
                <button
                  onClick={() => toggleAccordion("price")}
                  className="w-full flex justify-between items-center text-[10px] font-bold tracking-widest text-neutral-700 uppercase mb-3"
                >
                  <span>Max Price</span>
                  {accordions.price ? (
                    <FaChevronUp size={8} />
                  ) : (
                    <FaChevronDown size={8} />
                  )}
                </button>
                {accordions.price && (
                  <div className="space-y-3 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-neutral-400 font-medium">
                        Cap value:
                      </span>
                      <span className="text-xs font-bold text-neutral-800">
                        {formatPrice(maxPrice)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="20000"
                      step="500"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-neutral-900 h-1 bg-neutral-100 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-neutral-400 font-semibold">
                      <span>{formatPrice(500)}</span>
                      <span>{formatPrice(20000)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Origin Accordion */}
              <div className="border-b border-neutral-100 pb-4">
                <button
                  onClick={() => toggleAccordion("origin")}
                  className="w-full flex justify-between items-center text-[10px] font-bold tracking-widest text-neutral-700 uppercase mb-3"
                >
                  <span>Stones Origin</span>
                  {accordions.origin ? (
                    <FaChevronUp size={8} />
                  ) : (
                    <FaChevronDown size={8} />
                  )}
                </button>
                {accordions.origin && (
                  <div className="space-y-1 mt-2">
                    {[
                      { label: "All Stones", value: "" },
                      { label: "Natural Diamonds", value: "natural" },
                      { label: "Lab-Grown Diamonds", value: "labgrown" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedOrigin(opt.value)}
                        className={`w-full text-left py-1 text-[11px] font-medium tracking-wide uppercase transition-colors ${selectedOrigin === opt.value ? "text-neutral-900 font-bold" : "text-neutral-400 hover:text-neutral-800"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. Carat Weight Accordion */}
              <div className="border-b border-neutral-100 pb-4">
                <button
                  onClick={() => toggleAccordion("carat")}
                  className="w-full flex justify-between items-center text-[10px] font-bold tracking-widest text-neutral-700 uppercase mb-3"
                >
                  <span>Center Stone Size</span>
                  {accordions.carat ? (
                    <FaChevronUp size={8} />
                  ) : (
                    <FaChevronDown size={8} />
                  )}
                </button>
                {accordions.carat && (
                  <div className="space-y-1 mt-2">
                    {[
                      { label: "All Sizes", value: "" },
                      { label: "Delicate (≤ 0.5 ct)", value: "low" },
                      { label: "Classic (0.5 - 1.0 ct)", value: "mid" },
                      { label: "Brilliant (1.0 ct+)", value: "high" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedCaratRange(opt.value)}
                        className={`w-full text-left py-1 text-[11px] font-medium tracking-wide uppercase transition-colors ${selectedCaratRange === opt.value ? "text-neutral-900 font-bold" : "text-neutral-400 hover:text-neutral-800"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Option button */}
              <button
                onClick={resetFilters}
                className="w-full text-center py-2 text-[10px] font-bold tracking-widest text-neutral-400 hover:text-neutral-955 transition-colors uppercase mt-4 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>

            {/* Sticky Bottom Drawer Button */}
            <div className="p-4 border-t border-neutral-100 bg-white">
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full py-4 bg-neutral-950 hover:bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-colors shadow-sm flex items-center justify-center cursor-pointer"
              >
                View Products ({sortedJewelry.length})
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Products Grid Layout */}
      <div className="w-full">
        {apiLoading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-4 text-center">
            <div className="h-8 w-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em]">
              Loading Atelier Pieces...
            </span>
          </div>
        ) : sortedJewelry.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 animate-fade-in">
            {sortedJewelry.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center text-center py-32 px-4 bg-white border border-neutral-100 rounded-sm space-y-5 max-w-lg mx-auto">
            <span className="font-serif italic text-3xl text-neutral-300">
              ✦
            </span>
            <h3 className="text-xs lg:text-sm font-bold text-neutral-800 uppercase tracking-widest font-sans">
              No matching creations found
            </h3>
            <p className="text-[10px] lg:text-xs text-neutral-400 leading-relaxed font-light font-sans max-w-xs uppercase tracking-wider">
              We couldn't locate any products matching your active filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Catalog() {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center min-h-[400px] text-[10px] font-bold uppercase text-neutral-400 tracking-[0.2em]">
            Loading Catalog...
          </div>
        }
      >
        <CatalogContent />
      </Suspense>
    </Layout>
  );
}
