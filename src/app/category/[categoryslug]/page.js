"use client";

import React, {
  useState,
  useEffect,
  Suspense,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useSearchParams, useParams } from "next/navigation";
import { FaFilter } from "react-icons/fa";
import FilterDrawer from "@/components/ui/FilterDrawer";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, clearProducts } from "@/redux/productSlice";
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
  const { calculatePrice, formatPrice } = useStore();

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("");
  const [maxPrice, setMaxPrice] = useState(15000);
  const [selectedCaratRange, setSelectedCaratRange] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [sortOrder, setSortOrder] = useState("DESC");

  const { categoryslug } = useParams();

  // API fetching states
  const [subcategoryId, setSubcategoryId] = useState("");
  const [page, setPage] = useState(1);

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

  const dispatch = useDispatch();
  const {
    items: rawProducts,
    loading: apiLoading,
    loadingMore,
    pagination,
  } = useSelector((state) => state.products);

  const totalPages = pagination?.total_pages || 1;
  const currentPage = pagination?.page || 1;

  // Fetch products dynamically from Redux
  useEffect(() => {
    setPage(1);
    dispatch(clearProducts());
    dispatch(fetchProducts({ page: 1, limit: 10, category_slug: categoryslug }));
  }, [dispatch, categoryslug]);

  // Fetch next page
  const loadMore = useCallback(() => {
    if (loadingMore || currentPage >= totalPages) return;
    const nextPage = currentPage + 1;
    setPage(nextPage);
    dispatch(
      fetchProducts({
        page: nextPage,
        limit: 10,
        category_slug: categoryslug,
      }),
    );
  }, [dispatch, loadingMore, currentPage, totalPages, categoryslug]);

  // IntersectionObserver for infinite scroll
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadMore]);

  // Sync filters with URL search params on mount
  useEffect(() => {
    const searchParam = searchParams.get("search");
    const originParam = searchParams.get("origin");
    const metalParam = searchParams.get("metal");
    const caratParam = searchParams.get("carat");

    if (searchParam) setSearch(searchParam);
    if (originParam) setSelectedOrigin(originParam);
    if (metalParam) setSelectedMetal(metalParam);
    if (caratParam) setSelectedCaratRange(caratParam);
  }, [searchParams]);

  const data = rawProducts || [];
  const apiProducts = useMemo(() => {
    return data.map((p) => {
      const colors = p?.options?.filter((opt) => opt.name === "colors") || [];
      const diamondCost = p.pricing?.diamond_cost || p.price || 600;
      const gemstoneCost = p.pricing?.gemstone_cost || 0;
      const additionalCost = p.pricing?.additional_cost || 150;
      return {
        id: p._id,
        title: p.name,
        slug: p.slug,
        is_wishlist: p.is_wishlist || false,
        category: resolveCategoryName(p.category_id, p.subcategory_id),
        colors: colors && colors.length > 0 ? colors[0].values : [],
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
        origin: p.origin || "natural",
        isFromApi: true,
        display_price: p.display_price || 0,
      };
    });
  }, [data]);

  // Determine the source list
  const productsSource = apiProducts || [];

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
        <h1 className="text-3xl lg:text-4xl font-light text-neutral-900 uppercase tracking-widest">
          The Jewelry{" "}
          <span className="">
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
            {sortedJewelry?.length} Products Found
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

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedMetal={selectedMetal}
        setSelectedMetal={setSelectedMetal}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        selectedCaratRange={selectedCaratRange}
        setSelectedCaratRange={setSelectedCaratRange}
        selectedOrigin={selectedOrigin}
        setSelectedOrigin={setSelectedOrigin}
        accordions={accordions}
        toggleAccordion={toggleAccordion}
        resetFilters={resetFilters}
        productCount={sortedJewelry?.length}
        formatPrice={formatPrice}
        hideCategory={true}
      />

      {/* Main Products Grid Layout */}
      <div className="w-full">
        {apiLoading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-4 text-center">
            <div className="h-8 w-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em]">
              Loading Atelier Pieces...
            </span>
          </div>
        ) : sortedJewelry?.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 animate-fade-in">
              {sortedJewelry?.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
            {/* Sentinel for infinite scroll */}
            <div ref={sentinelRef} className="h-4" />
            {loadingMore && (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!loadingMore &&
              currentPage >= totalPages &&
              sortedJewelry.length > 0 && (
                <div className="text-center py-8">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em]">
                    You've seen all products
                  </span>
                </div>
              )}
          </>
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
