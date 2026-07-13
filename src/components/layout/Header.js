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
  FaQrcode,
} from "react-icons/fa";
import { useStore } from "@/context/StoreContext";
import AuthModal from "../ui/AuthModal";

// Fallback categories removed to make the component fully dynamic.

const FEATURED_PRODUCTS = {
  ring: {
    title: "TIARA DIAMOND RING",
    designer: "by Design Lab",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80",
    path: "/category/JW-108",
  },
  earring: {
    title: "STELLA SOLITAIRE STUDS",
    designer: "by Atelier dn",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
    path: "/category/JW-103",
  },
  bracelets: {
    title: "SIGNATURE TENNIS BRACELET",
    designer: "by Atelier dn",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
    path: "/category/JW-104",
  },
  necklace: {
    title: "ETERNAL BLOSSOM PENDANT",
    designer: "by Design Lab",
    image:
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80",
    path: "/category/JW-105",
  },
};

function getDBCategory(apiName) {
  const lower = apiName.toLowerCase();
  if (lower === "ring") return "Ring";
  if (lower === "earring") return "Earring";
  if (lower === "bracelets" || lower === "bracelet") return "Bracelet & Bangle";
  if (lower === "necklace") return "Pendant"; // Default category mapping in initial data
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
    setAuthModalOpen,
  } = useStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileJewelryOpen, setMobileJewelryOpen] = useState(false);
  const [promoVisible, setPromoVisible] = useState(true);

  const [isJewelryHovered, setIsJewelryHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const [jewelryTab, setJewelryTab] = useState("labgrown"); // "labgrown" or "natural"

  const handleTabClick = (tab) => {
    setJewelryTab(tab);
    // Developer placeholder: User mentioned they will setup login when clicked
    // E.g., if (tab === "natural" && !user) {
    //   setAuthMode("login");
    //   setAuthModalOpen(true);
    // }
  };

  // Auth states
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data && data.success) {
        setAuthSuccess("Vault access granted. Welcome.");
        setTimeout(() => {
          setAuthModalOpen(false);
          setAuthSuccess("");
          setEmail("");
          setPassword("");
        }, 1000);
      } else {
        setAuthError(data?.message || "Invalid email or password.");
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication server.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);
    try {
      const data = await registerUser(regName, regEmail, regPhone, regPassword);
      if (data && data.success) {
        setAuthSuccess("Profile registered successfully. Please sign in.");
        setTimeout(() => {
          setAuthMode("login");
          setAuthSuccess("");
          setRegName("");
          setRegEmail("");
          setRegPhone("");
          setRegPassword("");
        }, 1500);
      } else {
        setAuthError(
          data?.message || "Registration failed. Please check inputs.",
        );
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication server.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsJewelryHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsJewelryHovered(false);
    }, 200); // 200ms delay to make it extremely smooth and luxury-grade
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const activeCategories = apiCategories || [];

  const filteredSearchItems =
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      const query = searchQuery.trim().toLowerCase();
      setSearchOpen(false);
      setSearchQuery("");
      if (
        ["round", "cushion", "princess", "emerald", "oval", "diamond"].some(
          (w) => query.includes(w),
        )
      ) {
        router.push(`/diamonds?search=${encodeURIComponent(query)}`);
      } else {
        router.push(`/category?search=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-100 font-sans">
      {promoVisible && (
        <div className="w-full bg-[#0E0E0E] text-white text-center py-2.5 px-4 text-[10px] sm:text-xs font-light tracking-wide relative flex items-center justify-center z-50">
          <span>
            Exclusive offer for new customers: enjoy a 20% discount on your
            first purchasess.
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
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-2 min-[375px]:px-4 sm:px-6 lg:px-8 relative">
        {/* Left Side: Mobile Toggle & Desktop Nav */}
        <div className="flex items-center gap-2 min-[375px]:gap-4 md:gap-6 static h-full">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 min-[375px]:p-2 text-neutral-700 hover:text-neutral-900 md:hidden focus:outline-none"
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
              <button className="flex items-center gap-1 text-[11px] sm:text-xs xl:text-[12px] font-semibold tracking-widest text-neutral-800 hover:text-neutral-955 uppercase transition-all duration-300">
                <span>Jewelry</span>
                <FaChevronDown
                  size={7}
                  className={`text-neutral-400 transition-transform duration-300 ${isJewelryHovered ? "rotate-180" : ""}`}
                />
              </button>

              {/* Mega Menu Container */}
              <div
                className={`absolute left-4 right-4 top-full ${isJewelryHovered ? "flex" : "hidden"} flex-col bg-white border border-neutral-100 rounded-sm p-8 shadow-xl animate-fade-in z-50 text-left cursor-default`}
              >
                {/* Tabs Selector */}
                <div className="flex justify-center border-b border-neutral-100 pb-4 mb-6 gap-8 w-full">
                  <button
                    onClick={() => handleTabClick("labgrown")}
                    className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-all pb-2 border-b-2 cursor-pointer ${jewelryTab === "labgrown"
                      ? "border-neutral-900 text-neutral-900"
                      : "border-transparent text-neutral-400 hover:text-neutral-600"
                      }`}
                  >
                    Lab Grown
                  </button>
                  <button
                    onClick={() => handleTabClick("natural")}
                    className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-all pb-2 border-b-2 cursor-pointer ${jewelryTab === "natural"
                      ? "border-neutral-900 text-neutral-900"
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
                      <h4 className="font-serif text-[11px] lg:text-xs xl:text-base font-bold tracking-wider text-neutral-900 uppercase border-b border-neutral-100 pb-1">
                        <Link
                          href={`/category/${cat?.slug}?origin=${jewelryTab}`}
                          onClick={() => setIsJewelryHovered(false)}
                          className="hover:text-neutral-500 transition-colors"
                        >
                          {getDisplayCategoryName(cat.name)}
                        </Link>
                      </h4>
                      <div className="space-y-2 pt-1">
                        <ul className="space-y-1.5 text-[10px] lg:text-[11px] xl:text-base font-light text-neutral-500 font-medium">
                          {cat.subcategories &&
                            cat.subcategories.slice(0, 5).map((sub) => (
                              <li key={sub.name}>
                                <Link
                                  href={`/category/${cat?.slug}/${sub?.slug}?origin=${jewelryTab}`}
                                  onClick={() => setIsJewelryHovered(false)}
                                  className="hover:text-neutral-955 transition-colors block py-0.5"
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



            {/* About Us */}
            <Link
              href="/about"
              className="text-[11px] sm:text-xs xl:text-xs font-semibold tracking-widest text-neutral-800 hover:text-neutral-955 uppercase transition-colors"
            >
              About Us
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className="text-[11px] sm:text-xs xl:text-xs font-semibold tracking-widest text-neutral-800 hover:text-neutral-955 uppercase transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
        {/* Center: Brand Logo Text */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <Link href="/">
            <span className="text-[11px] min-[375px]:text-sm sm:text-lg md:text-2xl font-light tracking-[0.15em] sm:tracking-[0.3em] text-neutral-900 hover:text-neutral-700 transition-colors uppercase block select-none">
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
              className="bg-transparent text-xs xl:text-sm w-20 focus:w-36 transition-all duration-300 focus:outline-none text-neutral-800 placeholder-neutral-400 font-light"
              readOnly
            />
            <button
              onClick={() => setSearchOpen(true)}
              className="text-neutral-500 hover:text-neutral-800"
              aria-label="Search Catalog"
            >
              <FaSearch size={12} />
            </button>
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 text-neutral-700 hover:text-neutral-900"
            aria-label="Search Catalog"
          >
            <FaSearch size={14} />
          </button>

          {/* 1. Cart */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
            aria-label="View Cart"
          >
            <FaShoppingBag size={14} />
            {cart.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-neutral-800 text-[8px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </button>

          {/* 2. Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
            aria-label="View Wishlist"
          >
            <FaHeart size={15} />
            {wishlistTotal > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-neutral-800 text-[8px] font-semibold text-white">
                {wishlistTotal}
              </span>
            )}
          </button>

          {/* 3. Profile */}
          <div className="relative group hidden md:block">
            <button
              onClick={() => {
                if (!user) {
                  setAuthMode("login");
                  setAuthModalOpen(true);
                }
              }}
              className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
              aria-label="Account Menu"
            >
              <FaUser
                size={14}
                className={user ? "text-neutral-950" : "text-neutral-400"}
              />
            </button>
            <div className="absolute right-0 top-full hidden group-hover:block w-48 bg-white border border-neutral-100 rounded-sm p-3 shadow-md animate-fade-in z-50">
              {user ? (
                <>
                  <div className="px-2 py-1.5 border-b border-neutral-100 mb-2 text-left">
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                      Welcome Back
                    </p>
                    <p className="text-xs font-semibold text-neutral-800 truncate">
                      {user.name || user.email}
                    </p>
                  </div>
                  {/* <a
                    href="http://localhost:3001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-sm px-2 py-1.5 text-[10px] font-bold text-neutral-700 hover:bg-neutral-50 transition-all uppercase tracking-wider text-center"
                  >
                    Open Admin Portal
                  </a> */}
                  <button
                    onClick={logoutUser}
                    className="w-full text-center mt-1.5 rounded-sm px-2 py-1.5 text-[10px] font-bold text-red-500 hover:bg-red-50 transition-all uppercase tracking-wider cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="px-2 py-1.5 border-b border-neutral-100 mb-2 text-left">
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                      Welcome
                    </p>
                    <p className="text-xs font-semibold text-neutral-500">
                      Bespoke Diamond Luxury
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setAuthModalOpen(true);
                    }}
                    className="w-full text-left rounded-sm px-2 py-1.5 text-[10px] font-bold text-neutral-800 hover:bg-neutral-50 transition-all uppercase tracking-widest cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("register");
                      setAuthModalOpen(true);
                    }}
                    className="w-full text-left mt-1 rounded-sm px-2 py-1.5 text-[10px] font-bold text-neutral-500 hover:bg-neutral-50 transition-all uppercase tracking-widest cursor-pointer"
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 4. Country Selector */}
          <div className="relative group hidden md:block">
            <button
              className="flex items-center gap-0.5 p-2 text-neutral-700 hover:text-neutral-900 transition-colors text-[10px] lg:text-xs xl:text-sm font-bold tracking-wider uppercase cursor-pointer"
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
              <div className="px-3 py-1 border-b border-neutral-100 mb-1 text-[8px] lg:text-[9px] xl:text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
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
                  className={`w-full text-left px-3 py-1.5 text-[9px] lg:text-[10px] xl:text-[11px] font-bold tracking-wider uppercase transition-all rounded-sm block cursor-pointer ${region === reg.code ? "bg-neutral-50 text-neutral-900" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"}`}
                >
                  {reg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full border-b border-neutral-200 bg-white px-6 py-4 shadow-lg animate-fade-in text-left z-50 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col gap-4">
            <div>
              <button
                onClick={() => setMobileJewelryOpen(!mobileJewelryOpen)}
                className="w-full flex items-center justify-between text-[11px] font-bold text-neutral-800 uppercase tracking-widest py-1 focus:outline-none"
              >
                <span>Jewelry</span>
                <FaChevronDown
                  className={`transform transition-transform duration-300 ${mobileJewelryOpen ? "rotate-180" : ""}`}
                  size={8}
                />
              </button>
              {mobileJewelryOpen && (
                <div className="pl-3 mt-3 space-y-4 border-l border-neutral-100 animate-fade-in">
                  {/* Mobile Tab Switcher */}
                  <div className="flex border-b border-neutral-100 pb-2 mb-2 gap-4">
                    <button
                      onClick={() => handleTabClick("labgrown")}
                      className={`text-[10px] font-bold tracking-wider uppercase pb-1 border-b-2 cursor-pointer ${jewelryTab === "labgrown"
                        ? "border-neutral-900 text-neutral-900"
                        : "border-transparent text-neutral-400"
                        }`}
                    >
                      Lab Grown
                    </button>
                    <button
                      onClick={() => handleTabClick("natural")}
                      className={`text-[10px] font-bold tracking-wider uppercase pb-1 border-b-2 cursor-pointer ${jewelryTab === "natural"
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
                    className="block text-[11px] font-bold text-neutral-600 hover:text-neutral-900 uppercase tracking-widest"
                  >
                    Shop All {jewelryTab === "labgrown" ? "Lab Grown" : "Natural"} Jewelry
                  </Link>
                  {activeCategories.map((cat) => (
                    <div key={cat.name} className="space-y-1.5">
                      <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">
                        {getDisplayCategoryName(cat.name)}
                      </p>
                      <div className="grid grid-cols-2 gap-2 pl-2">
                        <Link
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileJewelryOpen(false);
                          }}
                          href={`/category?category=${encodeURIComponent(getDBCategory(cat.name))}&origin=${jewelryTab}`}
                          className="text-[10px] font-semibold text-neutral-700 hover:text-neutral-950 py-0.5"
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
                              className="text-[10px] font-semibold text-neutral-700 hover:text-neutral-955 py-0.5"
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
                className="text-[11px] font-bold text-neutral-800 uppercase tracking-widest"
              >
                Loose Diamonds
              </Link>
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/our-story"
                className="text-[11px] font-bold text-neutral-800 uppercase tracking-widest"
              >
                Our Story
              </Link>
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/about"
                className="text-[11px] font-bold text-neutral-800 uppercase tracking-widest"
              >
                About Us
              </Link>
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/contact"
                className="text-[11px] font-bold text-neutral-800 uppercase tracking-widest"
              >
                Contact Us
              </Link>
            </div>

            {/* Mobile Profile & Country Selector */}
            <div className="border-t border-neutral-100 pt-4 mt-2 space-y-4">
              {/* Account/Profile */}
              <div className="space-y-2">
                <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">
                  Account
                </p>
                {user ? (
                  <div className="space-y-2 pl-2">
                    <p className="text-[10px] font-semibold text-neutral-700">
                      Welcome, <span className="text-neutral-900 font-bold">{user.name || user.email}</span>
                    </p>
                    <button
                      onClick={() => {
                        logoutUser();
                        setMobileMenuOpen(false);
                      }}
                      className="text-[10px] font-bold text-red-500 uppercase tracking-wider block cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4 pl-2">
                    <button
                      onClick={() => {
                        setAuthMode("login");
                        setAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="text-[10px] font-bold text-neutral-800 uppercase tracking-widest cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode("register");
                        setAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest cursor-pointer"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>

              {/* Region Selector */}
              <div className="space-y-2 pb-2">
                <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">
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
                      className={`px-2 py-1 text-[9px] font-bold tracking-wider rounded-sm uppercase transition-all border cursor-pointer ${region === reg.code
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "text-neutral-500 bg-neutral-50 border-neutral-200"
                        }`}
                    >
                      {reg.label}
                    </button>
                  ))}
                </div>
              </div>
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
              className="btn-apollonian-solid px-6 py-3 text-xs font-semibold cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-3 text-neutral-400 hover:text-neutral-600"
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
                      <div className="h-10 w-10 bg-neutral-50 rounded-sm border border-neutral-100 flex items-center justify-center text-primary font-bold text-xs uppercase">
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
                      <p className="text-xs font-bold text-neutral-800">
                        {item.title}
                      </p>
                      <p className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider">
                        {item.category || item.shape + " Cut Diamond"}
                      </p>
                    </div>
                    <div className="ml-auto text-xs font-bold text-neutral-900">
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
