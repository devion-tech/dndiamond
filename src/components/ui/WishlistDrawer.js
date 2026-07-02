"use client";

import React from "react";
import { FaTimes, FaTrash, FaShoppingCart, FaHeartBroken, FaEye } from "react-icons/fa";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";

export default function WishlistDrawer({ isOpen, onClose }) {
    const { wishlist, toggleWishlist, addToCart, calculatePrice, formatPrice } = useStore();

    if (!isOpen) return null;

    const handleMoveToCart = (item) => {
        // Use default configuration details
        const defaultMetal = item.metalType ? item.metalType[0] : "14K Gold";
        const defaultCarat = item.diamondWeight ? item.diamondWeight[0] : 0.5;
        const price = calculatePrice(item, defaultMetal, defaultCarat);
        
        addToCart(item, defaultMetal, defaultCarat, price);
        toggleWishlist(item); // Remove from wishlist after moving
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
            {/* Dark background overlay */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col glass-drawer">
                    
                    {/* Drawer Header */}
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase">My Wishlist</h2>
                            <span className="text-[10px] text-slate-400 font-semibold tracking-wider mt-0.5">
                                {wishlist.length === 0 ? "No favorites added yet" : `${wishlist.length} Items Saved`}
                            </span>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all cursor-pointer">
                            <FaTimes size={16} />
                        </button>
                    </div>

                    {/* Content Body */}
                    {wishlist.length === 0 ? (
                        <div className="flex-1 flex flex-col justify-center items-center text-center p-8 space-y-4">
                            <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-350 mb-2">
                                <FaHeartBroken size={20} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-800 tracking-wider">Your wishlist is empty</h3>
                            <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed font-light">
                                Add items you love to your wishlist to keep track of them for later purchases.
                            </p>
                            <button 
                                onClick={onClose}
                                className="btn-teal px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                            >
                                Continue Browsing
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            {wishlist.map((item) => (
                                <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all bg-white relative group">
                                    {item.image && item.image.includes("http") ? (
                                        <img src={item.image} alt={item.title} className="h-20 w-20 object-cover rounded-lg border border-slate-100 shrink-0" />
                                    ) : (
                                        <div className="h-20 w-20 bg-slate-50 border border-slate-100 rounded-lg shrink-0 flex items-center justify-center text-primary font-bold text-lg">
                                            {item.category.charAt(0)}
                                        </div>
                                    )}
                                    
                                    <div className="flex-1 min-w-0 text-left flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                                            <p className="text-[10px] text-slate-400 font-semibold tracking-wider mt-0.5">
                                                Category: {item.category}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleMoveToCart(item)}
                                                className="btn-gold px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <FaShoppingCart size={9} /> Move to Cart
                                            </button>
                                            
                                            <Link 
                                                href={`/jewelry/${item.id}`}
                                                onClick={onClose}
                                                className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                                            >
                                                <FaEye size={9} /> View
                                            </Link>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col justify-between items-end">
                                        <button 
                                            onClick={() => toggleWishlist(item)}
                                            className="text-slate-400 hover:text-primary p-2 cursor-pointer transition-colors"
                                            aria-label="Remove item"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                        <span className="text-xs font-extrabold text-slate-900 mt-2">
                                            {formatPrice(calculatePrice(item, item.metalType?.[0] || "14K Gold", item.diamondWeight?.[0] || 0.5))}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
