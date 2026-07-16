"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useStore } from "@/context/StoreContext";
import { useRouter } from "next/navigation";
import {
  FaShoppingBag,
  FaCalendarAlt,
  FaTruck,
  FaChevronRight,
  FaPrint,
  FaMapMarkerAlt,
  FaInbox,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaBoxOpen,
  FaGem,
  FaCertificate,
  FaShieldAlt,
  FaFileDownload,
  FaEye,
  FaRedoAlt
} from "react-icons/fa";

// Realistic Luxury Static Mock Orders for High-End Jewelry Experience
const STATIC_MOCK_ORDERS = [
  {
    id: "DN-884920",
    date: "July 12, 2026",
    status: "In Transit - Armored Courier",
    statusCategory: "in_progress",
    totalAmount: 14850,
    discountAmount: 500,
    appliedCouponCode: "VIP-CONCIERGE-500",
    customerName: "Alexander Wright",
    email: "a.wright@luxuryestate.com",
    phone: "+1 (212) 884-9201",
    address: "742 Fifth Avenue, Penthouse B, New York, NY 10019, United States",
    trackingNumber: "SEC-Brinks-9948210US",
    estimatedDelivery: "July 16, 2026 before 12:00 PM (Signature Required)",
    currentStep: 3,
    steps: [
      { title: "Order Confirmed", desc: "Payment secured & escrowed", date: "Jul 12, 09:14 AM", completed: true },
      { title: "Atelier Crafting", desc: "Master lapidary QA & polish", date: "Jul 13, 02:30 PM", completed: true },
      { title: "Armored Transit", desc: "Brinks high-security courier", date: "Jul 14, 08:00 AM", completed: true, active: true },
      { title: "Signature Delivery", desc: "Hand-delivered to client", date: "Expected Jul 16", completed: false }
    ],
    items: [
      {
        title: "The Solitaire Oval Diamond Ring",
        metal: "Platinum 950",
        carat: "2.10",
        specs: "E Color • VVS1 Clarity • Triple Excellent Cut",
        certificate: "GIA Dossier #2489104820",
        quantity: 1,
        price: 12400,
        total: 12400,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600"
      },
      {
        title: "Eternity Diamond Pavé Band",
        metal: "18K White Gold",
        carat: "0.85",
        specs: "F Color • VS1 Clarity • Full Circle Setting",
        certificate: "IGI Lab Verification #992140",
        quantity: 1,
        price: 2450,
        total: 2450,
        image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600"
      }
    ]
  },
  {
    id: "DN-773105",
    date: "June 28, 2026",
    status: "Delivered & Certified",
    statusCategory: "delivered",
    totalAmount: 8200,
    discountAmount: 0,
    appliedCouponCode: null,
    customerName: "Alexander Wright",
    email: "a.wright@luxuryestate.com",
    phone: "+1 (212) 884-9201",
    address: "742 Fifth Avenue, Penthouse B, New York, NY 10019, United States",
    trackingNumber: "SEC-Brinks-7731050US",
    estimatedDelivery: "Delivered on June 30, 2026 at 10:42 AM",
    currentStep: 4,
    steps: [
      { title: "Order Confirmed", desc: "Payment secured", date: "Jun 28, 11:20 AM", completed: true },
      { title: "Atelier Crafting", desc: "Setting inspection", date: "Jun 29, 10:00 AM", completed: true },
      { title: "Armored Transit", desc: "Brinks courier transport", date: "Jun 29, 06:15 PM", completed: true },
      { title: "Signature Delivery", desc: "Signed by A. Wright", date: "Jun 30, 10:42 AM", completed: true }
    ],
    items: [
      {
        title: "Royal Emerald Step-Cut Pendant",
        metal: "18K Yellow Gold",
        carat: "1.50",
        specs: "D Color • IF (Internally Flawless) • Hall of Mirrors Cut",
        certificate: "HRD Antwerp Certificate #88491023",
        quantity: 1,
        price: 8200,
        total: 8200,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600"
      }
    ]
  },
  {
    id: "DN-662941",
    date: "July 14, 2026",
    status: "Atelier Bespoke Crafting",
    statusCategory: "in_progress",
    totalAmount: 24500,
    discountAmount: 1000,
    appliedCouponCode: "BESPOKE-PREMIER-1K",
    customerName: "Alexander Wright",
    email: "a.wright@luxuryestate.com",
    phone: "+1 (212) 884-9201",
    address: "742 Fifth Avenue, Penthouse B, New York, NY 10019, United States",
    trackingNumber: "Pending Final Lapidary Sign-off",
    estimatedDelivery: "Estimated Dispatch: July 22, 2026",
    currentStep: 2,
    steps: [
      { title: "Order Confirmed", desc: "Gouache sketches approved", date: "Jul 14, 08:30 AM", completed: true },
      { title: "Atelier Crafting", desc: "Hand-forging platinum prongs & setting 32 round brilliants", date: "In Progress", completed: true, active: true },
      { title: "GIA Laser Audit", desc: "Inscribing custom registry codes", date: "Scheduled Jul 20", completed: false },
      { title: "Signature Delivery", desc: "Armored dispatch to penthouse", date: "Expected Jul 22", completed: false }
    ],
    items: [
      {
        title: "Bespoke Radiance Tennis Bracelet",
        metal: "Platinum 950",
        carat: "6.50 Total",
        specs: "32 Perfectly Matched Round Brilliants • E/F Color • VVS2+",
        certificate: "GCAL 8X Cut Guarantee Dossier #5502914",
        quantity: 1,
        price: 24500,
        total: 24500,
        image: "https://images.unsplash.com/photo-1611591471483-b45b233a0058?q=80&w=600"
      }
    ]
  }
];

export default function OrdersPage() {
  const router = useRouter();
  const { formatPrice } = useStore();

  // State for tabs, search, and active tracking expansion
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState("DN-884920"); // Open first order by default
  const [toastMessage, setToastMessage] = useState(null);

  // Trigger quick interactive toast alerts when actions are clicked
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filter logic
  const filteredOrders = STATIC_MOCK_ORDERS.filter((order) => {
    const matchesTab =
      activeTab === "all" ? true : order.statusCategory === activeTab;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.metal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.certificate.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesTab && matchesSearch;
  });

  return (
    <Layout>
      <div className="bg-[#FAF9F6] min-h-screen py-10 md:py-16 px-4 md:px-8 font-sans text-neutral-800 relative selection:bg-neutral-900 selection:text-white">

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-neutral-700 flex items-center gap-3 animate-fade-in text-xs font-medium max-w-md">
            <FaCheckCircle className="text-lime-400 shrink-0" size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="max-w-6xl mx-auto space-y-10">

          {/* Header & Title Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-neutral-200">
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <FaShieldAlt className="text-neutral-700" size={12} />
                Client Concierge & Atelier Archive
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-light text-neutral-900 uppercase tracking-widest text-left">
                My Order Portfolio
              </h1>
            </div>

            {/* Concierge Support Badge */}
            <div className="bg-white px-5 py-3 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-3 text-left">
              <div className="h-9 w-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-serif font-bold text-sm shrink-0">
                DN
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">Assigned Private Jeweler</span>
                <span className="text-xs font-semibold text-neutral-800">Victoria Kensington • (Direct Atelier)</span>
              </div>
            </div>
          </div>

          {/* Controls Bar: Filter Tabs & Search */}
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white p-2 sm:p-3 rounded-2xl border border-neutral-200 shadow-sm">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {[
                { id: "all", label: "All Purchases", count: STATIC_MOCK_ORDERS.length },
                { id: "in_progress", label: "In Progress / Transit", count: 2 },
                { id: "delivered", label: "Delivered & Vaulted", count: 1 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center gap-2 ${activeTab === tab.id
                    ? "bg-neutral-900 text-white shadow-md"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                    }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-700"
                    }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={13} />
              <input
                type="text"
                placeholder="Search order #, diamond specs, metal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900 focus:bg-white transition-all text-neutral-800"
              />
            </div>
          </div>

          {/* Order Cards List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-8">
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrder === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-neutral-200 shadow-sm rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                  >
                    {/* Top Order Summary Bar */}
                    <div className="bg-neutral-900 text-white px-6 sm:px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-left">
                        <div>
                          <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest block">Reference Number</span>
                          <span className="font-mono font-bold text-white text-sm sm:text-base tracking-wider">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest block">Date Placed</span>
                          <span className="font-semibold text-neutral-200 flex items-center gap-1.5 mt-0.5">
                            <FaCalendarAlt className="text-neutral-400" size={11} />
                            {order.date}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest block">Total Escrow</span>
                          <span className="font-serif font-bold text-white text-base tracking-wide">{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>

                      {/* Status Badge & Expand Toggle */}
                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-neutral-800">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${order.statusCategory === "delivered"
                          ? "bg-lime-950/80 text-lime-400 border border-lime-700/60"
                          : "bg-amber-950/80 text-amber-300 border border-amber-700/60"
                          }`}>
                          <span className={`h-2 w-2 rounded-full ${order.statusCategory === "delivered" ? "bg-lime-400 animate-pulse" : "bg-amber-400 animate-pulse"
                            }`}></span>
                          {order.status}
                        </span>

                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{isExpanded ? "Hide Timeline" : "Track Steps"}</span>
                          <FaChevronRight className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} size={10} />
                        </button>
                      </div>
                    </div>

                    {/* Interactive Tracking Timeline Section (Shown when expanded) */}
                    {isExpanded && (
                      <div className="bg-neutral-50/80 border-b border-neutral-200 px-6 sm:px-8 py-6 space-y-6 animate-fade-in text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                              <FaTruck className="text-neutral-700" size={14} />
                              Security Tracking Progress
                            </h4>
                            <p className="text-[11px] text-neutral-500 mt-0.5">
                              Waybill / Courier Code: <span className="font-mono font-semibold text-neutral-800">{order.trackingNumber}</span>
                            </p>
                          </div>
                          <div className="bg-white px-4 py-2 rounded-xl border border-neutral-200 text-right text-[11px]">
                            <span className="text-neutral-400 uppercase text-[9px] font-bold block">Estimated Arrival</span>
                            <span className="font-semibold text-neutral-800">{order.estimatedDelivery}</span>
                          </div>
                        </div>

                        {/* Step Bar */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                          {order.steps.map((step, idx) => (
                            <div
                              key={idx}
                              className={`p-4 rounded-2xl border relative flex flex-col justify-between transition-all ${step.active
                                ? "bg-white border-neutral-900 shadow-md ring-2 ring-neutral-900/10"
                                : step.completed
                                  ? "bg-neutral-100/70 border-neutral-200 text-neutral-700"
                                  : "bg-transparent border-neutral-200/60 opacity-50"
                                }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-mono font-bold uppercase text-neutral-400">Step 0{idx + 1}</span>
                                {step.completed ? (
                                  <span className="h-4 w-4 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[9px]">✓</span>
                                ) : (
                                  <span className="h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center text-[8px] text-neutral-400">○</span>
                                )}
                              </div>
                              <div className="mt-2">
                                <h5 className="text-xs font-bold text-neutral-900">{step.title}</h5>
                                <p className="text-[10px] text-neutral-500 font-light mt-0.5">{step.desc}</p>
                              </div>
                              <span className="text-[9px] font-mono text-neutral-400 block mt-3 pt-2 border-t border-neutral-200/50">
                                {step.date}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Order Items & Destination Details Grid */}
                    <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                      {/* Left Column: Items Requested */}
                      <div className="lg:col-span-8 space-y-5 text-left">
                        <div className="flex justify-between items-center border-b border-neutral-150 pb-3">
                          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                            <FaGem className="text-neutral-800" size={12} />
                            Jewelry Pieces in Portfolio ({order.items.length})
                          </h3>
                          {order.appliedCouponCode && (
                            <span className="bg-lime-50 text-lime-900 border border-lime-200 text-[10px] font-bold px-3 py-1 rounded-full">
                              Promo Applied: {order.appliedCouponCode} (-{formatPrice(order.discountAmount)})
                            </span>
                          )}
                        </div>

                        <div className="space-y-6">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col sm:flex-row gap-5 p-4 rounded-2xl bg-neutral-50/50 border border-neutral-150/80 hover:bg-neutral-50 transition-colors"
                            >
                              {/* Product Thumbnail */}
                              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden border border-neutral-200 shrink-0 bg-white shadow-sm">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2 right-2 bg-neutral-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-sm">
                                  ×{item.quantity}
                                </span>
                              </div>

                              {/* Item Details */}
                              <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                                <div>
                                  <div className="flex justify-between items-start gap-4">
                                    <h4 className="text-base sm:text-lg font-serif text-neutral-900 font-semibold leading-tight">
                                      {item.title}
                                    </h4>
                                    <span className="text-sm sm:text-base font-serif font-bold text-neutral-900 shrink-0">
                                      {formatPrice(item.total)}
                                    </span>
                                  </div>

                                  {/* Specifications pills */}
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[10px] font-medium text-neutral-700">
                                      {item.metal}
                                    </span>
                                    <span className="px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[10px] font-medium text-neutral-700">
                                      {item.carat} Carats
                                    </span>
                                    <span className="px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[10px] font-medium text-neutral-700">
                                      {item.specs}
                                    </span>
                                  </div>
                                </div>

                                {/* Certification Dossier Badge */}
                                <div className="flex items-center justify-between pt-3 border-t border-neutral-200/60">
                                  <div className="flex items-center gap-2 text-neutral-700 text-[11px]">
                                    <FaCertificate className="text-neutral-900" size={13} />
                                    <span className="font-semibold text-neutral-800">Laser Inscription:</span>
                                    <span className="font-mono text-neutral-600 underline cursor-pointer hover:text-black">
                                      {item.certificate}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => triggerToast(`Verified ${item.certificate} inside GIA/IGI Vault Database`)}
                                    className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 hover:text-black underline cursor-pointer flex items-center gap-1"
                                  >
                                    Verify Report →
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Destination & Concierge Actions */}
                      <div className="lg:col-span-4 lg:border-l border-neutral-200 lg:pl-8 space-y-6 text-left">

                        {/* Shipping Destination */}
                        <div className="space-y-3 bg-neutral-50 p-5 rounded-2xl border border-neutral-200/60">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                            <FaMapMarkerAlt size={11} className="text-neutral-700" /> Secure Destination
                          </span>
                          <div className="space-y-1 text-xs text-neutral-700">
                            <p className="font-bold text-neutral-900 text-sm">{order.customerName}</p>
                            <p className="font-light leading-relaxed">{order.address}</p>
                            <p className="font-mono text-[11px] text-neutral-500 pt-1">{order.phone} • {order.email}</p>
                          </div>
                        </div>

                        {/* Quick Atelier Actions */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                            Atelier Documents & Support
                          </span>

                          <div className="grid grid-cols-1 gap-2.5">
                            <button
                              onClick={() => triggerToast(`Downloading Official GIA/IGI Valuation Dossier for ${order.id}...`)}
                              className="w-full py-3 px-4 bg-white hover:bg-neutral-900 hover:text-white border border-neutral-250 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-between cursor-pointer group"
                            >
                              <span className="flex items-center gap-2.5">
                                <FaFileDownload className="text-neutral-500 group-hover:text-white transition-colors" size={13} />
                                Download Certified Dossier
                              </span>
                              <span>↓</span>
                            </button>

                            <button
                              onClick={() => triggerToast(`Generating Official Escrow Tax Invoice for ${order.id}...`)}
                              className="w-full py-3 px-4 bg-white hover:bg-neutral-900 hover:text-white border border-neutral-250 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-between cursor-pointer group"
                            >
                              <span className="flex items-center gap-2.5">
                                <FaPrint className="text-neutral-500 group-hover:text-white transition-colors" size={13} />
                                Print Official Invoice
                              </span>
                              <span>→</span>
                            </button>

                            <button
                              onClick={() => triggerToast(`Atelier Concierge notified: Requesting private ring resize / maintenance service`)}
                              className="w-full py-3 px-4 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-xl text-xs font-bold tracking-wider uppercase transition-all text-neutral-800 flex items-center justify-between cursor-pointer"
                            >
                              <span className="flex items-center gap-2.5">
                                <FaRedoAlt size={11} className="text-neutral-600" />
                                Request Concierge Resize
                              </span>
                              <span>✦</span>
                            </button>
                          </div>
                        </div>

                        {/* Concierge Help Note */}
                        <p className="text-[11px] text-neutral-400 font-light leading-relaxed pt-2 border-t border-neutral-200">
                          Need modifications before dispatch? Contact your private jeweler directly or email <span className="underline font-medium text-neutral-700">concierge@dndiamond.com</span> quoting reference <span className="font-mono text-neutral-800">{order.id}</span>.
                        </p>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State when Search/Tab yields no matches */
            <div className="bg-white border border-neutral-200 rounded-3xl p-16 max-w-xl mx-auto text-center space-y-6 shadow-sm">
              <div className="h-20 w-20 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-400 mx-auto border border-neutral-200">
                <FaInbox size={26} />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl tracking-wide text-neutral-900">
                  No Matching Inquiries
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light max-w-md mx-auto">
                  No orders matched your current filter &apos;<span className="font-semibold text-neutral-800">{activeTab}</span>&apos; or search query &apos;<span className="font-mono text-neutral-800">{searchQuery}</span>&apos;.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                }}
                className="inline-block px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border-0 transition-colors"
              >
                Reset Filters & View All
              </button>
            </div>
          )}

          {/* Bottom Security Assurance Banner */}
          <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-left">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase block">
                INSURED VAULT SHIPPING
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-light text-white tracking-wide">
                100% Fully Insured Armored Delivery
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                Every DN Diamond delivery travels via Brinks or Malca-Amit armored security couriers, fully insured from our Antwerp/New York ateliers directly to your doorstep. All deliveries require dual signature identification.
              </p>
            </div>
            <button
              onClick={() => router.push("/jewelry")}
              className="px-8 py-4 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shrink-0 cursor-pointer shadow-md"
            >
              Explore New Collections
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}
