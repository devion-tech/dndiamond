import React, { useEffect } from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
  FaArrowRight,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/categorySlice";
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
  const dispatch = useDispatch();
  const { items: apiCategories } = useSelector((state) => state.categories);
  const { region } = useStore();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const getLocations = () => {
    switch (region) {
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
          "Central, Hong Kong (Primary Showroom & Pickup)",
          "Chicago, IL",
          "New York, NY",
          "San Francisco, CA",
        ];
    }
  };

  return (
    <footer className="bg-[#FAFAFA] text-neutral-600 font-sans border-t border-neutral-200/60 pt-16 pb-8 text-left">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Footer Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-neutral-200/50 pb-12">
          {/* Columns 1-4 (Links and locations) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* 1. Customer Services */}
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.25em] text-neutral-900 uppercase mb-5">
                Customer Services
              </h4>
              <ul className="space-y-3 text-[11px] font-light">
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Track your Order
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Frequently Asked Questions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Schedule an appointment
                  </a>
                </li>
              </ul>
            </div>

            {/* 2. About Us */}
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.25em] text-neutral-900 uppercase mb-5">
                About Us
              </h4>
              <ul className="space-y-3 text-[11px] font-light">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Origins
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Our Purpose
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Sustainability
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Giving Back
                  </a>
                </li>
              </ul>
            </div>

            {/* 3. Shop Jewelry */}
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.25em] text-neutral-900 uppercase mb-5">
                Shop Jewelry
              </h4>
              <ul className="space-y-3 text-[11px] font-light">
                {apiCategories &&
                  apiCategories.map((cat) => (
                    <li key={cat.name}>
                      <Link
                        href={`/category?category=${encodeURIComponent(getDBCategory(cat.name))}`}
                        className="hover:text-neutral-900 transition-colors"
                      >
                        {getDisplayCategoryName(cat.name)}
                      </Link>
                    </li>
                  ))}
                <li>
                  <Link
                    href="/diamonds"
                    className="hover:text-neutral-900 transition-colors"
                  >
                    Loose Diamonds
                  </Link>
                </li>
              </ul>
            </div>

            {/* 4. Main Locations */}
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.25em] text-neutral-900 uppercase mb-5">
                Main Locations
              </h4>
              <ul className="space-y-3 text-[11px] font-light text-neutral-500">
                {getLocations().map((loc, index) => (
                  <li key={index}>{loc}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter and Socials Block (Col span 4) */}
          <div className="md:col-span-4 space-y-6">
            <div className="space-y-2">
              <h4 className="text-[14px] font-serif text-neutral-900 font-medium tracking-wide">
                You can be one step ahead.
              </h4>
              <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
                Sign up to hear about our updates on the dot.
              </p>
            </div>

            {/* Email Input Form */}
            <form className="relative flex items-center border-b border-neutral-300 py-1.5 w-full">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-transparent text-xs w-full focus:outline-none text-neutral-800 placeholder-neutral-400 font-light pr-16"
                required
              />
              <button
                type="submit"
                className="absolute right-0 text-neutral-800 hover:text-neutral-950 text-[10px] font-bold tracking-widest transition-colors cursor-pointer"
                aria-label="Subscribe"
              >
                SIGN UP
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <FaTwitter size={14} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <FaFacebook size={14} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <FaYoutube size={14} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <FaLinkedin size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Block */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-10 text-[9px] font-semibold text-neutral-500 tracking-wider">
          {/* Copyright & Trademark */}
          <div>
            <span>© DNDIAMOND, LLC</span>
          </div>

          {/* Inline Legals */}
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <a href="#" className="hover:text-neutral-800 transition-colors">
              PRIVACY POLICY
            </a>
            <span>•</span>
            <a href="#" className="hover:text-neutral-800 transition-colors">
              TERMS OF USE
            </a>
            <span>•</span>
            <a href="#" className="hover:text-neutral-800 transition-colors">
              SITEMAP
            </a>
            <span>•</span>
            <a href="#" className="hover:text-neutral-800 transition-colors">
              DO NOT SELL MY INFORMATION
            </a>
            <span>•</span>
            <a href="#" className="hover:text-neutral-800 transition-colors">
              COOKIES
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
