"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/categorySlice";
import {
  FaSearch,
  FaHeart,
  FaUser,
  FaChevronDown,
  FaTimes,
  FaBars,
  FaMapMarkerAlt,
  FaShoppingBag,
} from "react-icons/fa";
import { useStore } from "@/context/StoreContext";
import AuthModal from "../ui/AuthModal";
import { apiRequest } from "@/utils/api";

function getDBCategory(apiName) {
  const lower = apiName.toLowerCase();
  if (lower === "ring") return "Ring";
  if (lower === "earring") return "Earring";
  if (lower === "bracelets" || lower === "bracelet") return "Bracelet & Bangle";
  if (lower === "necklace") return "Pendant";
  return apiName;
}

function getDisplayCategoryName(apiName) {
  const lower = apiName.toLowerCase();
  if (lower === "ring") return "Rings";
  if (lower === "earring") return "Earrings";
  if (lower === "bracelets" || lower === "bracelet") return "Bracelets";
  if (lower === "necklace") return "Necklaces";
  return apiName.charAt(0).toUpperCase() + apiName.slice(1);
}

export default function Header({ onOpenCart, onOpenWishlist }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items: apiCategories } = useSelector((state) => state.categories);
  const {
    cart,
    totalItems,
    wishlistTotal,
    jewelry,
    diamonds,
    region,
    saveRegion,
    formatPrice,
    user,
    loginUser,
    registerUser,
    logoutUser,
    authModalOpen,
    openModal,
    closeModal,
  } = useStore();

  const categoriesList = apiCategories || [];

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileJewelryOpen, setMobileJewelryOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [isJewelryHovered, setIsJewelryHovered] = useState(false);
  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const [jewelryTab, setJewelryTab] = useState("labgrown");
  const [promoVisible, setPromoVisible] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [recentOrder, setRecentOrder] = useState(null);

  const fetchRecentOrder = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("dndiamond_token");
      if (!token) return;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/my-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        const orders = data.data || data.orders || (Array.isArray(data) ? data : []);
        if (orders.length > 0) {
          const latest = orders[0];
          setRecentOrder({
            id: latest._id || latest.id,
            totalAmount: latest.total_amount || latest.totalAmount || 0,
            status: latest.status || "Processing",
            date: new Date(latest.createdAt || Date.now()).toLocaleDateString(),
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const timeoutRef = useRef(null);
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsJewelryHovered(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsJewelryHovered(false);
    }, 150);
  };

  const aboutTimeoutRef = useRef(null);
  const handleAboutMouseEnter = () => {
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    setIsAboutHovered(true);
  };
  const handleAboutMouseLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setIsAboutHovered(false);
    }, 150);
  };

  const handleTabClick = (tab) => {
    setJewelryTab(tab);
  };

  const activeCategories = categoriesList.length > 0 ? categoriesList : [];

  const [apiSearchResults, setApiSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setApiSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const data = await apiRequest("/api/product/getProduct", {
          method: "POST",
          body: JSON.stringify({ search: searchQuery.trim(), limit: 5, page: 1 }),
        });
        const items = data?.data?.products || data?.products || (Array.isArray(data?.data) ? data.data : []);
        setApiSearchResults(items);
      } catch (err) {
        console.error("Live API search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fallbackSearchItems =
    searchQuery.trim() !== ""
      ? [
          ...jewelry.filter(
            (j) =>
              j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              j.category.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
          ...diamonds.filter(
            (d) =>
              d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              d.shape.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        ].slice(0, 5)
      : [];

  const filteredSearchItems =
    apiSearchResults.length > 0
      ? apiSearchResults.map((p) => ({
          id: p._id || p.id,
          title: p.name || p.title,
          price: p.display_price || p.price || 0,
          category: p.category || p.category_id?.name || "Jewelry",
          image:
            p.images && p.images[0]
              ? p.images[0]
              : p.image ||
                "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=80",
        }))
      : fallbackSearchItems;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-100 font-sans">
      {promoVisible && (
        <div className="w-full bg-[#0E0E0E] text-white text-center py-2.5 px-4 text-[10px] sm:text-xs font-light tracking-wide relative flex items-center justify-center z-50">
          <span>
            Exclusive offer for new customers: enjoy a 20% discount on your
            first purchase.
          </span>
          <button
            onClick={() => setPromoVisible(false)}
            className="absolute right-4 p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Promo"
          >
            <FaTimes size={10} />
          </button>
        </div>
      )}
      <div className="mx-auto flex h-14 items-center justify-between px-2 min-[375px]:px-4 sm:px-6 lg:px-8 relative">
        {/* Left Side: Mobile Toggle & Desktop Nav */}
        <div className="flex items-center gap-2 min-[375px]:gap-4 md:gap-6 static h-full">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 min-[375px]:p-2 text-neutral-700 hover:text-neutral-900 md:hidden focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
          {/* Desktop Left-aligned Navigation */}
          <nav className="hidden md:flex items-center gap-6 static h-full">
            {/* Jewelry (mega menu dropdown) */}
            <div
              className="group h-full flex items-center static"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 text-[11px] sm:text-xs xl:text-[12px] font-medium tracking-widest text-neutral-800 hover:text-neutral-950 uppercase transition-all duration-300 cursor-pointer">
                <span>Jewelry</span>
                <FaChevronDown
                  size={7}
                  className={`text-neutral-400 transition-transform duration-300 ${
                    isJewelryHovered ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mega Menu Container */}
              <div
                className={`absolute left-4 right-4 top-full ${
                  isJewelryHovered ? "flex" : "hidden"
                } flex-col bg-white border border-neutral-100 rounded-sm p-8 shadow-xl animate-fade-in z-50 text-left cursor-default`}
              >
                {/* Tabs Selector */}
                <div className="flex justify-center border-b border-neutral-100 pb-4 mb-6 gap-8 w-full">
                  <button
                    onClick={() => handleTabClick("labgrown")}
                    className={`text-[11px] font-medium tracking-[0.2em] uppercase transition-all pb-2 border-b-2 cursor-pointer ${
                      jewelryTab === "labgrown"
                        ? "border-neutral-900 text-neutral-900 font-medium"
                        : "border-transparent text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    Lab Grown
                  </button>
                  <button
                    onClick={() => handleTabClick("natural")}
                    className={`text-[11px] font-medium tracking-[0.2em] uppercase transition-all pb-2 border-b-2 cursor-pointer ${
                      jewelryTab === "natural"
                        ? "border-neutral-900 text-neutral-900 font-medium"
                        : "border-transparent text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    Natural
                  </button>
                </div>

                {/* Left Part: 4 columns for categories */}
                <div className="grid grid-cols-4 gap-8 w-full">
                  {activeCategories.map((cat) => (
                    <div key={cat.name} className="space-y-4">
                      <h4 className="text-[11px] lg:text-xs xl:text-base font-medium tracking-wider text-neutral-900 uppercase border-b border-neutral-100 pb-1">
                        <Link
                          href={`/category/${cat?.slug}?origin=${jewelryTab}`}
                          onClick={() => setIsJewelryHovered(false)}
                          className="hover:text-neutral-500 transition-colors"
                        >
                          {getDisplayCategoryName(cat.name)}
                        </Link>
                      </h4>
                      <div className="space-y-2 pt-1">
                        <ul className="space-y-1.5 text-[10px] lg:text-[11px] xl:text-base text-neutral-500 font-light">
                          {cat.subcategories &&
                            cat.subcategories.slice(0, 5).map((sub) => (
                              <li key={sub.name}>
                                <Link
                                  href={`/category/${cat?.slug}/${sub?.slug}?origin=${jewelryTab}`}
                                  onClick={() => setIsJewelryHovered(false)}
                                  className="hover:text-neutral-900 transition-colors block py-0.5"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Diamond */}
            <Link
              href="/diamonds"
              className="text-[11px] sm:text-xs xl:text-xs font-medium tracking-widest text-neutral-800 hover:text-neutral-950 uppercase transition-colors"
            >
              Diamond
            </Link>

            {/* About Submenu Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={handleAboutMouseEnter}
              onMouseLeave={handleAboutMouseLeave}
            >
              <button className="flex items-center gap-1 text-[11px] sm:text-xs xl:text-[12px] font-medium tracking-widest text-neutral-800 hover:text-neutral-950 uppercase transition-all duration-300 cursor-pointer">
                <span>About</span>
                <FaChevronDown
                  size={7}
                  className={`text-neutral-400 transition-transform duration-300 ${
                    isAboutHovered ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full w-44 bg-white border border-neutral-100 p-3.5 shadow-lg animate-fade-in z-50 text-left rounded-sm ${
                  isAboutHovered ? "block" : "hidden"
                }`}
              >
                <ul className="space-y-2.5 text-[10px] sm:text-[11px] font-medium tracking-wider text-neutral-700 uppercase">
                  <li>
                    <Link
                      href="/about"
                      onClick={() => setIsAboutHovered(false)}
                      className="hover:text-neutral-950 transition-colors block py-1 border-b border-transparent hover:border-neutral-200"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/our-story"
                      onClick={() => setIsAboutHovered(false)}
                      className="hover:text-neutral-950 transition-colors block py-1 border-b border-transparent hover:border-neutral-200"
                    >
                      Our Story
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/certification"
                      onClick={() => setIsAboutHovered(false)}
                      className="hover:text-neutral-950 transition-colors block py-1 border-b border-transparent hover:border-neutral-200"
                    >
                      Certification
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>

        {/* Center: Brand Logo Text */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <Link href="/">
            <span className="text-[11px] min-[375px]:text-sm sm:text-lg md:text-2xl font-light tracking-[0.15em] sm:tracking-[0.3em] pl-[0.15em] sm:pl-[0.3em] text-neutral-900 hover:text-neutral-700 transition-colors uppercase block select-none">
              DNDIAMOND
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 min-[375px]:gap-2.5 md:gap-3">
          {/* Search Bar */}
          <div className="hidden sm:flex items-center border-b border-neutral-200 py-1 mr-2">
            <input
              type="text"
              placeholder="Search"
              onClick={() => setSearchOpen(true)}
              className="bg-transparent text-xs xl:text-sm w-36 transition-all duration-300 focus:outline-none text-neutral-800 placeholder-neutral-400 font-light"
              readOnly
            />
            <button
              onClick={() => setSearchOpen(true)}
              className="text-neutral-500 hover:text-neutral-800 cursor-pointer"
              aria-label="Search Catalog"
            >
              <FaSearch size={12} />
            </button>
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 text-neutral-700 hover:text-neutral-900 cursor-pointer"
            aria-label="Search Catalog"
          >
            <FaSearch size={14} />
          </button>

          {/* 1. Cart */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer shrink-0"
            aria-label="View Cart"
          >
            <FaShoppingBag size={16} className="shrink-0" />
            {cart.length > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[9px] font-medium text-white shadow-xs">
                {totalItems}
              </span>
            )}
          </button>

          {/* 2. Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2.5 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer shrink-0"
            aria-label="View Wishlist"
          >
            <FaHeart size={16} className="shrink-0" />
            {wishlistTotal > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[9px] font-medium text-white shadow-xs">
                {wishlistTotal}
              </span>
            )}
          </button>

          {/* 3. Profile */}
          <div
            className="relative group hidden md:block"
            onMouseEnter={fetchRecentOrder}
          >
            <button
              onClick={() => {
                if (!user) {
                  setAuthMode("login");
                  openModal();
                }
              }}
              className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
              aria-label="Account Menu"
            >
              <FaUser
                size={14}
                className={user ? "text-neutral-955" : "text-neutral-400"}
              />
            </button>
            <div className="absolute right-0 top-full hidden group-hover:block w-52 bg-white border border-neutral-100 rounded-sm p-3 shadow-md animate-fade-in z-50">
              {user ? (
                <>
                  <div className="px-2 py-1.5 border-b border-neutral-100 mb-2 text-left">
                    <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider">
                      Welcome Back
                    </p>
                    <p className="text-xs font-medium text-neutral-800 truncate">
                      {user.name || user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="block rounded-sm px-2 py-1.5 text-[10px] font-medium text-neutral-700 hover:bg-neutral-50 transition-all uppercase tracking-wider text-left border-b border-neutral-50"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block rounded-sm px-2 py-1.5 text-[10px] font-medium text-neutral-700 hover:bg-neutral-50 transition-all uppercase tracking-wider text-left border-b border-neutral-50"
                  >
                    My Orders
                  </Link>
                  {recentOrder && (
                    <div className="mt-2 p-2.5 bg-slate-50 border border-slate-100 rounded-md text-left text-[9px] space-y-1 font-sans">
                      <div className="flex justify-between font-medium text-slate-800 uppercase tracking-wider">
                        <span>Recent Order</span>
                        <Link
                          href="/orders"
                          className="text-neutral-500 hover:text-neutral-800 underline"
                        >
                          View
                        </Link>
                      </div>
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>ID: {recentOrder.id}</span>
                        <span className="bg-neutral-200 text-neutral-800 px-1 py-0.2 rounded-xs uppercase text-[8px] font-medium">
                          {recentOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-700 font-medium pt-0.5 border-t border-slate-100">
                        <span>{recentOrder.date}</span>
                        <span>{formatPrice(recentOrder.totalAmount)}</span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={logoutUser}
                    className="w-full text-center mt-2.5 rounded-sm px-2 py-1.5 text-[10px] font-medium text-red-500 hover:bg-red-50 transition-all uppercase tracking-wider cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="px-2 py-1.5 border-b border-neutral-100 mb-2 text-left">
                    <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider">
                      Welcome
                    </p>
                    <p className="text-xs font-medium text-neutral-500">
                      Bespoke Diamond Luxury
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      openModal();
                    }}
                    className="w-full text-left rounded-sm px-2 py-1.5 text-[10px] font-medium text-neutral-800 hover:bg-neutral-50 transition-all uppercase tracking-widest cursor-pointer"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 4. Country Selector */}
          {mounted && (
            <div className="relative group hidden md:block">
              <button
                className="flex items-center gap-0.5 p-2 text-neutral-700 hover:text-neutral-900 transition-colors text-[10px] lg:text-xs xl:text-sm font-medium tracking-wider uppercase cursor-pointer"
                aria-label="Country Selector"
              >
                <FaMapMarkerAlt size={11} className="text-neutral-500 mr-0.5" />
                <span>{region}</span>
                <FaChevronDown
                  size={5}
                  className="text-neutral-400 group-hover:rotate-180 transition-transform duration-300 ml-0.5"
                />
              </button>
              <div className="absolute right-0 top-full hidden group-hover:block w-44 bg-white border border-neutral-100 rounded-sm p-1.5 shadow-md animate-fade-in z-50">
                <div className="px-3 py-1 border-b border-neutral-100 mb-1 text-[8px] lg:text-[9px] xl:text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                  Country Selector
                </div>
                {[
                  { code: "HK", label: "Hong Kong (HKD)" },
                  { code: "AU", label: "Australia (AUD)" },
                  { code: "NZ", label: "New Zealand (NZD)" },
                ].map((reg) => (
                  <button
                    key={reg.code}
                    onClick={() => saveRegion(reg.code)}
                    className={`w-full text-left px-3 py-1.5 text-[9px] lg:text-[10px] xl:text-[11px] font-medium tracking-wider uppercase transition-all rounded-sm block cursor-pointer ${
                      region === reg.code
                        ? "bg-neutral-50 text-neutral-900 font-medium"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                    }`}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full border-b border-neutral-200 bg-white px-6 py-4 shadow-lg animate-fade-in text-left z-50 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col gap-4">
            <div>
              <button
                onClick={() => setMobileJewelryOpen(!mobileJewelryOpen)}
                className="w-full flex items-center justify-between text-[11px] font-medium text-neutral-800 uppercase tracking-widest py-1 focus:outline-none cursor-pointer"
              >
                <span>Jewelry</span>
                <FaChevronDown
                  className={`transform transition-transform duration-300 ${
                    mobileJewelryOpen ? "rotate-180" : ""
                  }`}
                  size={8}
                />
              </button>
              {mobileJewelryOpen && (
                <div className="pl-3 mt-3 space-y-4 border-l border-neutral-100 animate-fade-in">
                  {/* Mobile Tab Switcher */}
                  <div className="flex border-b border-neutral-100 pb-2 mb-2 gap-4">
                    <button
                      onClick={() => handleTabClick("labgrown")}
                      className={`text-[10px] font-medium tracking-wider uppercase pb-1 border-b-2 cursor-pointer ${
                        jewelryTab === "labgrown"
                          ? "border-neutral-900 text-neutral-900"
                          : "border-transparent text-neutral-400"
                      }`}
                    >
                      Lab Grown
                    </button>
                    <button
                      onClick={() => handleTabClick("natural")}
                      className={`text-[10px] font-medium tracking-wider uppercase pb-1 border-b-2 cursor-pointer ${
                        jewelryTab === "natural"
                          ? "border-neutral-900 text-neutral-900"
                          : "border-transparent text-neutral-400"
                      }`}
                    >
                      Natural
                    </button>
                  </div>
                  <Link
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileJewelryOpen(false);
                    }}
                    href={`/category?origin=${jewelryTab}`}
                    className="block text-[11px] font-medium text-neutral-600 hover:text-neutral-900 uppercase tracking-widest"
                  >
                    Shop All{" "}
                    {jewelryTab === "labgrown" ? "Lab Grown" : "Natural"}{" "}
                    Jewelry
                  </Link>
                  {activeCategories.map((cat) => (
                    <div key={cat.name} className="space-y-1.5">
                      <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-widest">
                        {getDisplayCategoryName(cat.name)}
                      </p>
                      <div className="grid grid-cols-2 gap-2 pl-2">
                        <Link
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileJewelryOpen(false);
                          }}
                          href={`/category?category=${encodeURIComponent(getDBCategory(cat.name))}&origin=${jewelryTab}`}
                          className="text-[10px] font-medium text-neutral-700 hover:text-neutral-950 py-0.5"
                        >
                          All {getDisplayCategoryName(cat.name)}
                        </Link>
                        {cat.subcategories &&
                          cat.subcategories.slice(0, 3).map((sub) => (
                            <Link
                              key={sub.name}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileJewelryOpen(false);
                              }}
                              href={`/category?category=${encodeURIComponent(getDBCategory(cat.name))}&style=${encodeURIComponent(sub.name.toLowerCase())}&origin=${jewelryTab}${sub._id ? `&subcategory_id=${sub._id}` : ""}`}
                              className="text-[10px] font-medium text-neutral-700 hover:text-neutral-955 py-0.5"
                            >
                              {sub.name}
                            </Link>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-neutral-100 pt-3 flex flex-col gap-3">
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/diamonds"
                className="text-[11px] font-medium text-neutral-800 uppercase tracking-widest"
              >
                Loose Diamonds
              </Link>
              {/* Mobile About Accordion */}
              <div>
                <button
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className="w-full flex items-center justify-between text-[11px] font-medium text-neutral-800 uppercase tracking-widest py-1 cursor-pointer focus:outline-none"
                >
                  <span>About</span>
                  <FaChevronDown
                    size={8}
                    className={`text-neutral-400 transition-transform duration-300 ${
                      mobileAboutOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileAboutOpen && (
                  <div className="pl-3 mt-2 space-y-2.5 border-l border-neutral-100 animate-fade-in flex flex-col">
                    <Link
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileAboutOpen(false);
                      }}
                      href="/about"
                      className="text-[10px] font-medium text-neutral-600 hover:text-neutral-900 uppercase tracking-widest py-0.5"
                    >
                      About Us
                    </Link>
                    <Link
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileAboutOpen(false);
                      }}
                      href="/our-story"
                      className="text-[10px] font-medium text-neutral-600 hover:text-neutral-900 uppercase tracking-widest py-0.5"
                    >
                      Our Story
                    </Link>

                    <Link
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileAboutOpen(false);
                      }}
                      href="/about#certification"
                      className="text-[10px] font-medium text-neutral-600 hover:text-neutral-900 uppercase tracking-widest py-0.5"
                    >
                      Certification
                    </Link>
                  </div>
                )}
              </div>
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/contact"
                className="text-[11px] font-medium text-neutral-800 uppercase tracking-widest"
              >
                Contact Us
              </Link>
            </div>

            {/* Mobile Profile & Country Selector */}
            <div className="border-t border-neutral-100 pt-4 mt-2 space-y-4">
              {/* Account/Profile */}
              <div className="space-y-2">
                <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-widest">
                  Account
                </p>
                {user ? (
                  <div className="space-y-2 pl-2">
                    <p className="text-[10px] font-medium text-neutral-700">
                      Welcome,{" "}
                      <span className="text-neutral-900 font-medium">
                        {user.name || user.email}
                      </span>
                    </p>
                    <button
                      onClick={() => {
                        logoutUser();
                        setMobileMenuOpen(false);
                      }}
                      className="text-[10px] font-medium text-red-500 uppercase tracking-wider block cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4 pl-2">
                    <button
                      onClick={() => {
                        setAuthMode("login");
                        openModal();
                        setMobileMenuOpen(false);
                      }}
                      className="text-[10px] font-medium text-neutral-800 uppercase tracking-widest cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>

              {/* Region Selector */}
              {mounted && (
                <div className="space-y-2 pb-2">
                  <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-widest">
                    Region
                  </p>
                  <div className="flex gap-2 pl-2 flex-wrap">
                    {[
                      { code: "HK", label: "HK (HKD)" },
                      { code: "AU", label: "AU (AUD)" },
                      { code: "NZ", label: "NZ (NZD)" },
                    ].map((reg) => (
                      <button
                        key={reg.code}
                        onClick={() => {
                          saveRegion(reg.code);
                          setMobileMenuOpen(false);
                        }}
                        className={`px-2 py-1 text-[9px] font-medium tracking-wider rounded-sm uppercase transition-all border cursor-pointer ${
                          region === reg.code
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "text-neutral-500 bg-neutral-50 border-neutral-200"
                        }`}
                      >
                        {reg.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
      {searchOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-neutral-200 shadow-xl z-40 p-4 animate-fade-in">
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto max-w-3xl flex gap-3"
          >
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
              <input
                type="text"
                placeholder="Search products, collections, shapes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-sm py-3 pl-11 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-transparent transition-all"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="btn-apollonian-solid px-6 py-3 text-xs font-medium cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-3 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <FaTimes size={16} />
            </button>
          </form>
          {/* Instant Search Results Dropdown */}
          {searchQuery.trim() !== "" && (
            <div className="mx-auto max-w-3xl mt-3 bg-white border border-neutral-100 shadow-lg divide-y divide-neutral-50 overflow-hidden rounded-sm">
              {filteredSearchItems.length > 0 ? (
                filteredSearchItems.map((item) => (
                  <Link
                    key={item.id}
                    href={
                      item.shape
                        ? `/diamonds?search=${item.id}`
                        : `/category/${item.id}`
                    }
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-neutral-50 transition-colors"
                  >
                    {item.image && !item.image.includes("http") ? (
                      <div className="h-10 w-10 bg-neutral-50 rounded-sm border border-neutral-100 flex items-center justify-center text-primary font-medium text-xs uppercase">
                        {item.category.charAt(0)}
                      </div>
                    ) : (
                      <img
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=80&fit=crop"
                        }
                        alt={item.title}
                        className="h-10 w-10 object-cover rounded-sm border border-neutral-100"
                      />
                    )}
                    <div className="text-left">
                      <p className="text-xs font-medium text-neutral-800">
                        {item.title}
                      </p>
                      <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider">
                        {item.category || item.shape + " Cut Diamond"}
                      </p>
                    </div>
                    <div className="ml-auto text-xs font-medium text-neutral-900">
                      {formatPrice(item.price)}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-4 text-center text-xs text-neutral-400 font-medium">
                  No direct matches found. Press Enter to search overall.
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {/* 5. Luxury Authentication Modal */}
      <AuthModal />
    </header>
  );
}
