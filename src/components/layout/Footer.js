"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useStore } from "@/context/StoreContext";

const getDBCategory = (apiName) => {
  const lower = apiName.toLowerCase();
  if (lower === "ring") return "Ring";
  if (lower === "earring") return "Earring";
  if (lower === "bracelets" || lower === "bracelet") return "Bracelet & Bangle";
  if (lower === "necklace") return "Necklace";
  if (lower === "pendant") return "Pendant";
  return apiName;
};

const getDisplayCategoryName = (apiName) => {
  const lower = apiName.toLowerCase();
  if (lower === "ring") return "Rings";
  if (lower === "earring") return "Earrings";
  if (lower === "bracelets" || lower === "bracelet")
    return "Bracelets & Bangles";
  if (lower === "necklace") return "Necklaces";
  return apiName.charAt(0).toUpperCase() + apiName.slice(1);
};

export default function Footer() {
  const { items: apiCategories } = useSelector((state) => state.categories);
  const { region } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeRegion = mounted ? region : "HK";

  // Accordion toggle state for mobile view
  const [openSections, setOpenSections] = useState({
    shop: false,
    about: false,
    services: false,
    locations: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getLocations = () => {
    switch (activeRegion) {
      case "AU":
        return [
          "Sydney, NSW (Primary Showroom)",
          "Chicago, IL",
          "New York, NY",
          "San Francisco, CA",
        ];
      case "NZ":
        return [
          "Auckland, NZ (Primary Showroom)",
          "Chicago, IL",
          "New York, NY",
          "San Francisco, CA",
        ];
      case "HK":
      default:
        return [
          "T.S.T, Hong Kong (Office & Showroom)",
          "Chicago, IL",
          "New York, NY",
          "San Francisco, CA",
        ];
    }
  };

  // Fallback static categories in case Redux is not populated yet
  const fallbackCategories = [
    { name: "Rings", slug: "ring" },
    { name: "Earrings", slug: "earring" },
    { name: "Necklaces", slug: "necklace" },
    { name: "Bracelets & Bangles", slug: "bracelet" },
    { name: "Pendants", slug: "pendant" },
  ];

  const categoriesList =
    apiCategories && apiCategories.length > 0
      ? apiCategories.map((cat) => ({
          name: getDisplayCategoryName(cat.name),
          slug: cat.slug,
        }))
      : fallbackCategories;

  return (
    <footer className="bg-[#0B0B0B] text-white font-sans pt-16 pb-10 text-left">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        {/* Footer Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 border-b border-[#1A1A1A] pb-16">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-3">
              <Link href="/" className="inline-block">
                <span className="font-serif text-xl sm:text-2xl font-light tracking-[0.35em] text-white uppercase">
                  DNDIAMOND
                </span>
              </Link>
              <p className="text-xs font-light leading-relaxed max-w-sm text-neutral-400">
                Ethically sourced diamonds, masterfully crafted bespoke jewelry,
                and extraordinary designs created to celebrate your life's most
                meaningful moments.
              </p>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-5 pt-2">
              <a
                href="#"
                className="text-neutral-500 hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-white transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebook size={16} />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-white transition-colors duration-300"
                aria-label="YouTube"
              >
                <FaYoutube size={16} />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={16} />
              </a>
            </div>
          </div>

          {/* Collapsible/Grid Columns (Columns 2-4) */}
          <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Column 2: Shop Jewelry */}
            <div className="border-b border-[#1A1A1A] md:border-b-0 pb-4 md:pb-0">
              <button
                onClick={() => toggleSection("shop")}
                className="w-full flex justify-between items-center py-2 text-left md:pointer-events-none focus:outline-none group"
              >
                <h4 className="text-[10px] font-sans font-bold tracking-[0.25em] text-white uppercase">
                  Shop Jewelry
                </h4>
                <span className="text-sm font-light text-neutral-500 md:hidden">
                  {openSections.shop ? "−" : "+"}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 md:max-h-none md:opacity-100 ${
                  openSections.shop
                    ? "max-h-96 opacity-100 mt-4"
                    : "max-h-0 opacity-0 md:mt-5"
                }`}
              >
                <ul className="space-y-3.5 text-xs font-light">
                  {categoriesList.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="hover:text-white transition-colors duration-300 block py-0.5"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/diamonds"
                      className="hover:text-white transition-colors duration-300 block py-0.5"
                    >
                      Loose Diamonds
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 3: About Us */}
            <div className="border-b border-[#1A1A1A] md:border-b-0 pb-4 md:pb-0">
              <button
                onClick={() => toggleSection("about")}
                className="w-full flex justify-between items-center py-2 text-left md:pointer-events-none focus:outline-none"
              >
                <h4 className="text-[10px] font-sans font-bold tracking-[0.25em] text-white uppercase">
                  About
                </h4>
                <span className="text-sm font-light text-neutral-500 md:hidden">
                  {openSections.about ? "−" : "+"}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 md:max-h-none md:opacity-100 ${
                  openSections.about
                    ? "max-h-96 opacity-100 mt-4"
                    : "max-h-0 opacity-0 md:mt-5"
                }`}
              >
                <ul className="space-y-3.5 text-xs font-light">
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-white transition-colors duration-300 block py-0.5"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/our-story"
                      className="hover:text-white transition-colors duration-300 block py-0.5"
                    >
                      Our Story
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/bespoke"
                      className="hover:text-white transition-colors duration-300 block py-0.5"
                    >
                      Bespoke Design
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 4: Customer Services */}
            <div className="border-b border-[#1A1A1A] md:border-b-0 pb-4 md:pb-0">
              <button
                onClick={() => toggleSection("services")}
                className="w-full flex justify-between items-center py-2 text-left md:pointer-events-none focus:outline-none"
              >
                <h4 className="text-[10px] font-sans font-bold tracking-[0.25em] text-white uppercase">
                  Services
                </h4>
                <span className="text-sm font-light text-neutral-500 md:hidden">
                  {openSections.services ? "−" : "+"}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 md:max-h-none md:opacity-100 ${
                  openSections.services
                    ? "max-h-96 opacity-100 mt-4"
                    : "max-h-0 opacity-0 md:mt-5"
                }`}
              >
                <ul className="space-y-3.5 text-xs font-light">
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-white transition-colors duration-300 block py-0.5"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/orders"
                      className="hover:text-white transition-colors duration-300 block py-0.5"
                    >
                      Track Order
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="hover:text-white transition-colors duration-300 block py-0.5"
                    >
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#faq"
                      className="hover:text-white transition-colors duration-300 block py-0.5"
                    >
                      FAQs
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Column 5: Locations & Newsletter */}
          <div className="lg:col-span-3 space-y-8">
            {/* Locations Column */}
            <div>
              <button
                onClick={() => toggleSection("locations")}
                className="w-full flex justify-between items-center py-2 text-left lg:pointer-events-none focus:outline-none"
              >
                <h4 className="text-[10px] font-sans font-bold tracking-[0.25em] text-white uppercase">
                  Showrooms
                </h4>
                <span className="text-sm font-light text-neutral-500 lg:hidden">
                  {openSections.locations ? "−" : "+"}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 lg:max-h-none lg:opacity-100 ${
                  openSections.locations
                    ? "max-h-96 opacity-100 mt-4"
                    : "max-h-0 opacity-0 lg:mt-5"
                }`}
              >
                <ul className="space-y-2.5 text-xs font-light text-neutral-400">
                  {getLocations().map((loc, idx) => (
                    <li key={idx} className="block py-0.5">
                      {loc}
                    </li>
                  ))}
                </ul>
                {activeRegion === "HK" && (
                  <div className="text-[11px] font-light text-neutral-500 space-y-1 pt-3.5 mt-3.5 border-t border-[#1A1A1A]">
                    <p>Tel: +852 3693 4141</p>
                    <p>Email: dndiamondhk@yahoo.com</p>
                  </div>
                )}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <h4 className="text-xs font-serif font-medium tracking-wider text-white">
                  Join the Inner Circle
                </h4>
                <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
                  Subscribe to receive updates on collections, design
                  inspiration, and private boutique events.
                </p>
              </div>

              <form className="relative flex items-center border-b border-neutral-800 py-1.5 w-full">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-transparent text-xs w-full focus:outline-none text-white placeholder-neutral-600 font-light pr-16"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-0 text-white hover:text-neutral-300 text-[10px] font-bold tracking-widest transition-colors cursor-pointer"
                  aria-label="Subscribe"
                >
                  SIGN UP
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bottom Block */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 text-[9px] font-medium text-neutral-500 tracking-widest uppercase">
          {/* Copyright & Trademark */}
          <div>
            <span>© DNDIAMOND, LLC. ALL RIGHTS RESERVED.</span>
          </div>

          {/* Clean Contact Anchor as alternative support link */}
          <div>
            <Link
              href="/contact"
              className="hover:text-white transition-colors duration-300"
            >
              Support & Inquiries
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
