"use client";

import React, {
    useState,
    useEffect,
    Suspense,
    useMemo,
    useCallback,
    useRef,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import FilterDrawer from "@/components/ui/FilterDrawer";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, clearProducts } from "@/redux/productSlice";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ui/ProductCard";
import { useStore } from "@/context/StoreContext";

function ShopContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { formatPrice } = useStore();

    const searchQueryParam = searchParams.get("search") || "";
    const categoryParam = searchParams.get("category") || "";
    const originParam = searchParams.get("origin") || "";
    const subcategoryParam = searchParams.get("subcategory_id") || "";
    const styleParam = searchParams.get("style") || "";

    // Local filter states
    const [search, setSearch] = useState(searchQueryParam);
    const [selectedCategory, setSelectedCategory] = useState(categoryParam);
    const [selectedMetal, setSelectedMetal] = useState("");
    const [maxPrice, setMaxPrice] = useState(25000);
    const [selectedCaratRange, setSelectedCaratRange] = useState("");
    const [selectedOrigin, setSelectedOrigin] = useState(originParam);
    const [selectedStyle, setSelectedStyle] = useState(styleParam);
    const [subcategoryId, setSubcategoryId] = useState(subcategoryParam);
    const [sortOrder, setSortOrder] = useState("DESC");

    const [page, setPage] = useState(1);
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

    // Keep search state in sync with URL search query param
    useEffect(() => {
        setSearch(searchQueryParam);
    }, [searchQueryParam]);

    useEffect(() => {
        setSelectedCategory(categoryParam);
    }, [categoryParam]);

    useEffect(() => {
        setSelectedOrigin(originParam);
    }, [originParam]);

    // Fetch products from Redux on mount & when params change
    useEffect(() => {
        setPage(1);
        dispatch(clearProducts());

        const paramsObj = {
            page: 1,
            limit: 16,
        };

        if (searchQueryParam) {
            paramsObj.search = searchQueryParam;
        }
        if (subcategoryId) {
            paramsObj.subcategory_id = subcategoryId;
        }
        if (selectedOrigin) {
            paramsObj.product_type = selectedOrigin;
        }

        dispatch(fetchProducts(paramsObj));
    }, [dispatch, searchQueryParam, subcategoryId, selectedOrigin]);

    // Load next page function
    const loadMore = useCallback(() => {
        if (loadingMore || currentPage >= totalPages) return;
        const nextPage = currentPage + 1;
        setPage(nextPage);

        const paramsObj = {
            page: nextPage,
            limit: 16,
        };
        if (searchQueryParam) {
            paramsObj.search = searchQueryParam;
        }
        if (subcategoryId) {
            paramsObj.subcategory_id = subcategoryId;
        }
        if (selectedOrigin) {
            paramsObj.product_type = selectedOrigin;
        }

        dispatch(fetchProducts(paramsObj));
    }, [dispatch, loadingMore, currentPage, totalPages, searchQueryParam, subcategoryId, selectedOrigin]);

    // Infinite Scroll Sentinel
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
            { threshold: 0.1 },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loadMore]);

    // Client-side filtering & search processing
    const filteredProducts = useMemo(() => {
        let list = rawProducts || [];

        // Filter by search query
        if (search.trim() !== "") {
            const q = search.toLowerCase();
            list = list.filter(
                (p) =>
                    p.name?.toLowerCase().includes(q) ||
                    p.title?.toLowerCase().includes(q) ||
                    p.category?.toLowerCase().includes(q) ||
                    p.category_id?.name?.toLowerCase().includes(q) ||
                    p.subcategory_id?.name?.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q),
            );
        }

        // Filter by category
        if (selectedCategory) {
            const catQ = selectedCategory.toLowerCase();
            list = list.filter((p) => {
                const catName = (
                    p.category ||
                    p.category_id?.name ||
                    ""
                ).toLowerCase();
                return catName.includes(catQ);
            });
        }

        // Filter by metal
        if (selectedMetal) {
            const metalQ = selectedMetal.toLowerCase();
            list = list.filter((p) => {
                const opts = p.options || [];
                const colorOpt = opts.find(
                    (o) => o.name === "color" || o.name === "colors",
                );
                if (colorOpt) {
                    return colorOpt.values?.some((v) =>
                        v.value.toLowerCase().includes(metalQ),
                    );
                }
                return true;
            });
        }

        // Filter by origin (Lab Grown / Natural)
        if (selectedOrigin) {
            const originQ = selectedOrigin.toLowerCase();
            list = list.filter((p) => {
                const type = (p.product_type || p.origin || "").toLowerCase();
                return type === originQ || originQ === "all";
            });
        }

        // Sort order
        if (sortOrder === "ASC") {
            list = [...list].sort(
                (a, b) => (a.price || a.display_price) - (b.price || b.display_price),
            );
        } else if (sortOrder === "DESC") {
            list = [...list].sort(
                (a, b) => (b.price || b.display_price) - (a.price || a.display_price),
            );
        }

        return list;
    }, [rawProducts, search, selectedCategory, selectedMetal, selectedOrigin, sortOrder]);

    const resetFilters = () => {
        setSearch("");
        setSelectedCategory("");
        setSelectedMetal("");
        setMaxPrice(25000);
        setSelectedCaratRange("");
        setSelectedOrigin("");
        setSelectedStyle("");
        setSubcategoryId("");
        router.push("/shop");
    };

    const activeFilterCount =
        (search ? 1 : 0) +
        (selectedCategory ? 1 : 0) +
        (selectedMetal ? 1 : 0) +
        (selectedOrigin ? 1 : 0);

    return (
        <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 relative font-sans bg-[#FFFFFF] min-h-screen">
            {/* Page Header */}
            <div className="text-center space-y-3 mb-8">
                <span className="text-[10px] font-medium text-[#666666] tracking-widest uppercase">
                    {searchQueryParam
                        ? `Search Results`
                        : selectedCategory
                            ? `${selectedCategory} Collection`
                            : selectedOrigin
                                ? `${selectedOrigin === "labgrown" ? "Lab Grown" : "Natural"} Jewelry`
                                : "Fine Jewelry Shop"}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111111] tracking-tight">
                    {searchQueryParam
                        ? `Results for "${searchQueryParam}"`
                        : selectedCategory
                            ? selectedCategory
                            : "Shop All Jewelry"}
                </h1>
                <p className="text-xs sm:text-sm text-[#666666] max-w-xl mx-auto font-normal">
                    Explore our range of ethically sourced, GIA-certified diamond creations masterfully crafted in 18K solid gold and platinum.
                </p>
            </div>

            {/* Inline Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (search.trim()) {
                            router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
                        } else {
                            router.push(`/shop`);
                        }
                    }}
                    className="relative flex items-center"
                >
                    <FaSearch className="absolute left-4 text-[#999999] text-sm" />
                    <input
                        type="text"
                        placeholder="Search jewelry, diamonds, collections..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#FAFAFA] border border-[#ECECEC] rounded-full py-3.5 pl-11 pr-24 text-xs focus:outline-none focus:border-[#111111] transition-all text-[#111111] placeholder-[#999999]"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                router.push("/shop");
                            }}
                            className="absolute right-20 text-[#999999] hover:text-[#111111] p-1"
                        >
                            <FaTimes size={12} />
                        </button>
                    )}
                    <button
                        type="submit"
                        className="absolute right-2 px-4 py-2 bg-[#111111] text-white text-[11px] font-medium rounded-full hover:bg-[#333333] transition-colors cursor-pointer"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Premium Toolbar */}
            <div className="flex flex-wrap items-center justify-between border-y border-[#ECECEC] py-4 px-2 mb-8 gap-4 text-xs font-medium uppercase tracking-wider text-[#111111]">
                {/* Left Side: Filter button & Product count */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsFilterDrawerOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#ECECEC] hover:border-[#111111] bg-white transition-all cursor-pointer text-[#111111]"
                    >
                        <FaFilter size={11} className="text-[#666666]" />
                        <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
                    </button>
                    <span className="text-[#666666] font-normal tracking-normal text-xs">
                        {filteredProducts.length} Creations Available
                    </span>
                </div>

                {/* Active Filter Pills */}
                {activeFilterCount > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        {search && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAFAFA] border border-[#ECECEC] rounded-full text-[11px] text-[#111111] lowercase font-normal">
                                "{search}"
                                <button onClick={() => setSearch("")} className="hover:text-red-500">
                                    <FaTimes size={10} />
                                </button>
                            </span>
                        )}
                        {selectedCategory && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAFAFA] border border-[#ECECEC] rounded-full text-[11px] text-[#111111] font-normal">
                                {selectedCategory}
                                <button onClick={() => setSelectedCategory("")} className="hover:text-red-500">
                                    <FaTimes size={10} />
                                </button>
                            </span>
                        )}
                        {selectedOrigin && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAFAFA] border border-[#ECECEC] rounded-full text-[11px] text-[#111111] font-normal">
                                {selectedOrigin}
                                <button onClick={() => setSelectedOrigin("")} className="hover:text-red-500">
                                    <FaTimes size={10} />
                                </button>
                            </span>
                        )}
                        <button
                            onClick={resetFilters}
                            className="text-[11px] text-[#666666] hover:text-[#111111] underline cursor-pointer font-normal normal-case"
                        >
                            Clear All
                        </button>
                    </div>
                )}

                {/* Right Side: Sort Option */}
                <div className="flex items-center gap-2">
                    <span className="text-[#666666] font-normal">Sort:</span>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="bg-transparent text-[#111111] border-none font-medium focus:outline-none cursor-pointer text-xs"
                    >
                        <option value="DESC">Price: High to Low</option>
                        <option value="ASC">Price: Low to High</option>
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
                productCount={filteredProducts.length}
                formatPrice={formatPrice}
            />

            {/* Products Grid */}
            <div className="w-full">
                {apiLoading ? (
                    <div className="flex flex-col justify-center items-center py-32 space-y-4 text-center">
                        <div className="h-7 w-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] text-[#666666] font-medium uppercase tracking-widest">
                            Loading Creations...
                        </span>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 animate-fade-in">
                            {filteredProducts.map((item) => (
                                <ProductCard key={item._id || item.id} item={item} />
                            ))}
                        </div>

                        {/* Sentinel for infinite scroll */}
                        <div ref={sentinelRef} className="h-8" />
                        {loadingMore && (
                            <div className="flex justify-center py-8">
                                <div className="h-6 w-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col justify-center items-center py-28 text-center space-y-4 bg-[#FAFAFA] rounded-2xl border border-[#ECECEC] p-8 max-w-2xl mx-auto">
                        <div className="h-12 w-12 rounded-full bg-white border border-[#ECECEC] flex items-center justify-center text-[#999999]">
                            <FaSearch size={18} />
                        </div>
                        <h3 className="text-lg font-medium text-[#111111]">No Creations Found</h3>
                        <p className="text-xs text-[#666666] max-w-md font-normal leading-relaxed">
                            We couldn't find any items matching your criteria. Try adjusting your search query or clearing your filters.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="px-6 py-3 bg-[#111111] text-white text-xs font-medium rounded-full hover:bg-[#333333] transition-colors cursor-pointer"
                        >
                            Clear Search &amp; Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Layout>
            <Suspense
                fallback={
                    <div className="flex justify-center items-center py-40">
                        <div className="h-7 w-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                }
            >
                <ShopContent />
            </Suspense>
        </Layout>
    );
}
