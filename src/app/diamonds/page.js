"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FaGem, FaSearch, FaSlidersH, FaFileContract, FaCheckCircle, FaShoppingCart, FaArrowRight } from "react-icons/fa";
import Layout from "@/components/layout/Layout";
import { useStore } from "@/context/StoreContext";

function DiamondsContent() {
    const searchParams = useSearchParams();
    const { diamonds, addToCart, formatPrice } = useStore();

    // Search and filters
    const [search, setSearch] = useState("");
    const [shapeFilter, setShapeFilter] = useState("");
    const [clarityFilter, setClarityFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("DESC");
    const [successItem, setSuccessItem] = useState(null);

    // Sync search from URL
    useEffect(() => {
        const searchParam = searchParams.get("search");
        const shapeParam = searchParams.get("shape");
        if (searchParam) setSearch(searchParam);
        if (shapeParam) setShapeFilter(shapeParam);
    }, [searchParams]);

    // Apply filtering
    const filteredDiamonds = diamonds.filter((item) => {
        if (search && 
            !item.title.toLowerCase().includes(search.toLowerCase()) && 
            !item.certificate.toLowerCase().includes(search.toLowerCase()) &&
            !item.id.toLowerCase().includes(search.toLowerCase())
        ) {
            return false;
        }

        if (shapeFilter && item.shape !== shapeFilter) return false;
        if (clarityFilter && item.clarity !== clarityFilter) return false;
        if (colorFilter && item.color !== colorFilter) return false;

        return true;
    });

    // Apply sorting
    const sortedDiamonds = [...filteredDiamonds].sort((a, b) => {
        return sortOrder === "ASC" ? a.price - b.price : b.price - a.price;
    });

    const resetFilters = () => {
        setSearch("");
        setShapeFilter("");
        setClarityFilter("");
        setColorFilter("");
    };

    const handleAddToCart = (diamond) => {
        const price = Math.round(diamond.price - (diamond.discount ? (diamond.price * (diamond.discount / 100)) : 0));
        
        // Add loose diamond to cart with selected characteristics
        addToCart(
            {
                id: diamond.id,
                title: diamond.title,
                category: "Loose Diamond",
                image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400"
            }, 
            `${diamond.clarity} Clarity`, 
            diamond.carat, 
            price
        );

        setSuccessItem(diamond.id);
        setTimeout(() => setSuccessItem(null), 3000);
    };

    return (
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-10 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="text-left">
                    <span className="text-[10px] text-primary font-bold tracking-[0.3em] uppercase">GIA & IGI Conflict-Free Gems</span>
                    <h1 className="text-2xl font-serif font-medium text-slate-900 mt-1">
                        Certified Loose <span className="font-serif italic text-accent font-light">Diamonds</span>
                    </h1>
                </div>

                {/* Instant search & sorting dropdown */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input 
                            type="text" 
                            placeholder="Search Cert ID, title or shape..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2.5 w-full border border-slate-200 bg-white text-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400 font-medium"
                        />
                    </div>
                    
                    <select 
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white text-slate-700 px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold"
                    >
                        <option value="DESC">Price: High to Low</option>
                        <option value="ASC">Price: Low to High</option>
                    </select>
                </div>
            </div>

            {/* Filter Dashboard layout (Mobile-First Touch Pills) */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 mb-8 flex flex-col gap-6 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                        <FaSlidersH className="text-accent" /> Touch Filters
                    </div>
                    <button 
                        onClick={resetFilters}
                        className="text-[10px] text-slate-400 hover:text-slate-700 font-bold uppercase tracking-wider transition-colors cursor-pointer border-0 bg-transparent"
                    >
                        Clear All
                    </button>
                </div>

                {/* Horizontal Scrolling Pills */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    
                    {/* 1. Shape Pills */}
                    <div className="flex flex-col space-y-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1">Diamond Shape</span>
                        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar max-w-full scroll-smooth">
                            {[
                                { val: "", label: "All Shapes" },
                                { val: "Round", label: "💎 Round" },
                                { val: "Cushion", label: "⬜ Cushion" },
                                { val: "Princess", label: "◽ Princess" }
                            ].map(shape => (
                                <button
                                    key={shape.val}
                                    type="button"
                                    onClick={() => setShapeFilter(shape.val)}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-full transition-all shrink-0 cursor-pointer border ${
                                        shapeFilter === shape.val 
                                        ? "bg-slate-800 border-slate-800 text-white shadow-xs" 
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    {shape.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Clarity Pills */}
                    <div className="flex flex-col space-y-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1">Clarity Grade</span>
                        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar max-w-full">
                            {[
                                { val: "", label: "All Clarities" },
                                { val: "IF", label: "IF (Flawless)" },
                                { val: "VVS1", label: "VVS1" },
                                { val: "VS2", label: "VS2" }
                            ].map(clarity => (
                                <button
                                    key={clarity.val}
                                    type="button"
                                    onClick={() => setClarityFilter(clarity.val)}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-full transition-all shrink-0 cursor-pointer border ${
                                        clarityFilter === clarity.val 
                                        ? "bg-slate-800 border-slate-800 text-white shadow-xs" 
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    {clarity.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Color Pills */}
                    <div className="flex flex-col space-y-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1">Color Grade</span>
                        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar max-w-full">
                            {[
                                { val: "", label: "All Colors" },
                                { val: "D", label: "D (Colorless)" },
                                { val: "E", label: "E" },
                                { val: "F", label: "F" }
                            ].map(color => (
                                <button
                                    key={color.val}
                                    type="button"
                                    onClick={() => setColorFilter(color.val)}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-full transition-all shrink-0 cursor-pointer border ${
                                        colorFilter === color.val 
                                        ? "bg-slate-800 border-slate-800 text-white shadow-xs" 
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    {color.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Success add dialog */}
            {successItem && (
                <div className="bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-xl p-3.5 text-xs font-semibold flex items-center gap-2 mb-6 animate-fade-in text-left">
                    <FaCheckCircle className="text-neutral-800" /> Diamond added to cart. Bundle it with a custom bespoke ring!
                </div>
            )}

            {/* Interactive Grid or List */}
            {sortedDiamonds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sortedDiamonds.map((item) => {
                        const finalPrice = Math.round(item.price - (item.discount ? (item.price * (item.discount / 100)) : 0));
                        return (
                            <div key={item.id} className="glass-card rounded-2xl border border-slate-100 bg-white p-5 text-left flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                                        <div>
                                            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                                                <FaGem className="text-primary text-xs" /> {item.title}
                                            </h3>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                                                Cert: {item.certificate} • {item.lab} Approved
                                            </span>
                                        </div>
                                        {item.discount > 0 && (
                                            <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent font-extrabold text-[9px] rounded-md tracking-wider uppercase">
                                                {item.discount}% Off
                                            </span>
                                        )}
                                    </div>

                                    {/* Characteristics Specs Grid */}
                                    <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                        <div className="text-center space-y-0.5">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase block">Shape</span>
                                            <span className="text-xs font-bold text-slate-800">{item.shape}</span>
                                        </div>
                                        <div className="text-center space-y-0.5 border-x border-slate-200/50">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase block">Carats</span>
                                            <span className="text-xs font-extrabold text-primary">{item.carat} ct</span>
                                        </div>
                                        <div className="text-center space-y-0.5">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase block">Clarity</span>
                                            <span className="text-xs font-bold text-slate-800">{item.clarity}</span>
                                        </div>
                                        <div className="text-center space-y-0.5 border-t border-slate-200/50 pt-2">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase block">Color</span>
                                            <span className="text-xs font-bold text-slate-800">{item.color}</span>
                                        </div>
                                        <div className="text-center space-y-0.5 border-t border-x border-slate-200/50 pt-2">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase block">Cut</span>
                                            <span className="text-xs font-bold text-slate-800">{item.cut}</span>
                                        </div>
                                        <div className="text-center space-y-0.5 border-t border-slate-200/50 pt-2">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase block">Polish</span>
                                            <span className="text-xs font-bold text-slate-800">{item.polish}</span>
                                        </div>
                                    </div>

                                    {/* Description Notes */}
                                    <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                                        {item.notes} Fluorescence: {item.fluorescence}. Polish and symmetry ratios are certified Excellent.
                                    </p>
                                </div>

                                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <span className="text-[9px] text-slate-400 font-semibold block uppercase">Diamond Cost</span>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-sm font-extrabold text-slate-900">{formatPrice(finalPrice)}</span>
                                            {item.discount > 0 && (
                                                <span className="text-[10px] text-slate-400 line-through">{formatPrice(item.price)}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleAddToCart(item)}
                                            className="btn-gold px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
                                        >
                                            <FaShoppingCart size={9} /> Buy Loose
                                        </button>
                                        <a 
                                            href={`/bespoke?diamond=${item.id}`}
                                            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                                        >
                                            Build Ring <FaArrowRight size={8} />
                                        </a>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center text-center py-20 px-4 bg-white border border-slate-100 rounded-2xl space-y-4 shadow-2xs">
                    <FaGem className="text-slate-350 text-5xl animate-pulse" />
                    <h3 className="text-sm font-bold text-slate-800 tracking-wider">No certified diamonds match</h3>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-light">
                        We couldn't find any loose diamonds matching your specified criteria. Try removing some filters.
                    </p>
                    <button 
                        onClick={resetFilters}
                        className="btn-teal px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                        Reset All Filters
                    </button>
                </div>
            )}
        </div>
    );
}

export default function DiamondsPage() {
    return (
        <Layout>
            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center min-h-[400px] text-xs font-bold uppercase text-slate-400 tracking-widest">
                    Loading Loose Diamonds catalog...
                </div>
            }>
                <DiamondsContent />
            </Suspense>
        </Layout>
    );
}
