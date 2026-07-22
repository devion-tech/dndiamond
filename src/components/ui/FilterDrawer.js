"use client";

import React from "react";
import { FaSearch, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function FilterDrawer({
  isOpen,
  onClose,
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  selectedOrigin,
  setSelectedOrigin,
  selectedFilters,
  setSelectedFilters,
  accordions,
  toggleAccordion,
  resetFilters,
  onApplyFilters,
  productCount,
  formatPrice,
  hideCategory = false,
  attributes = null,
  categories = [],
}) {
  if (!isOpen) return null;

  const handleFilterSelect = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
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
            onClick={onClose}
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
                  className="pl-9 pr-4 py-2 w-full border border-neutral-200 bg-neutral-50 text-neutral-800 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-neutral-950 focus:border-transparent transition-all placeholder:text-neutral-400"
                />
              </div>
            )}
          </div>

          {/* 2. Category Accordion */}
          {!hideCategory && categories.length > 0 && (
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
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left py-1 text-[11px] font-medium tracking-wide uppercase transition-colors ${selectedCategory === "" ? "text-neutral-900 font-bold" : "text-neutral-400 hover:text-neutral-800"}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug || cat._id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left py-1 text-[11px] font-medium tracking-wide uppercase transition-colors ${selectedCategory === cat.slug ? "text-neutral-900 font-bold" : "text-neutral-400 hover:text-neutral-800"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Price Slider Accordion */}
          {/* <div className="border-b border-neutral-100 pb-4">
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
          </div> */}

          {/* 4. Stones Origin Accordion */}
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
                <button
                  onClick={() => setSelectedOrigin("")}
                  className={`w-full text-left py-1 text-[11px] font-medium tracking-wide uppercase transition-colors ${selectedOrigin === "" ? "text-neutral-900 font-bold" : "text-neutral-400 hover:text-neutral-800"}`}
                >
                  All Stones
                </button>
                {(attributes?.diamondTypes || []).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedOrigin(opt.value)}
                    className={`w-full text-left py-1 text-[11px] font-medium tracking-wide uppercase transition-colors ${selectedOrigin === opt.value ? "text-neutral-900 font-bold" : "text-neutral-400 hover:text-neutral-800"}`}
                  >
                    {opt.value === "natural"
                      ? "Natural Diamonds"
                      : opt.value === "labgrown"
                        ? "Lab-Grown Diamonds"
                        : opt.value}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Dynamic Attribute Filters */}
          {attributes?.dynamicAttributes &&
            Object.entries(attributes.dynamicAttributes).map(
              ([key, options]) =>
                options.length > 0 && (
                  <div key={key} className="border-b border-neutral-100 pb-4">
                    <button
                      onClick={() => toggleAccordion(key)}
                      className="w-full flex justify-between items-center text-[10px] font-bold tracking-widest text-neutral-700 uppercase mb-3"
                    >
                      <span>{key.replace(/_/g, " ")}</span>
                      {accordions[key] ? (
                        <FaChevronUp size={8} />
                      ) : (
                        <FaChevronDown size={8} />
                      )}
                    </button>
                    {accordions[key] && (
                      <div className="space-y-1 mt-2">
                        <button
                          onClick={() => handleFilterSelect(key, "")}
                          className={`w-full text-left py-1 text-[11px] font-medium tracking-wide uppercase transition-colors ${!selectedFilters[key] ? "text-neutral-900 font-bold" : "text-neutral-400 hover:text-neutral-800"}`}
                        >
                          All {key.replace(/_/g, " ")}
                        </button>
                        {options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleFilterSelect(key, opt.value)}
                            className={`w-full text-left py-1 text-[11px] font-medium tracking-wide uppercase transition-colors ${selectedFilters[key] === opt.value ? "text-neutral-900 font-bold" : "text-neutral-400 hover:text-neutral-800"}`}
                          >
                            {opt.value}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ),
            )}

          {/* Reset Option button */}
          <button
            onClick={resetFilters}
            className="w-full text-center py-2 text-[10px] font-bold tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors uppercase mt-4 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>

        {/* Sticky Bottom Drawer Button */}
        <div className="p-4 border-t border-neutral-100 bg-white">
          <button
            onClick={() => {
              if (onApplyFilters) onApplyFilters();
              onClose();
            }}
            className="w-full py-4 bg-neutral-950 hover:bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-colors shadow-sm flex items-center justify-center cursor-pointer"
          >
            View Products
          </button>
        </div>
      </div>
    </>
  );
}
