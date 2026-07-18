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
      <div className="bg-[#FAF9F6] min-h-screen py-12 md:py-20 px-4 md:px-8 font-sans text-neutral-800 relative selection:bg-neutral-900 selection:text-white">

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-955 text-white px-5 py-3.5 border border-neutral-850 flex items-center gap-3 animate-fade-in text-[10px] font-bold uppercase tracking-wider max-w-md shadow-2xl">
            <FaCheckCircle className="text-neutral-200 shrink-0" size={13} />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="max-w-6xl mx-auto space-y-12">

          {/* Header & Title Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-neutral-200">
            <div className="space-y-3 text-left">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.25em] flex items-center gap-2">
                Atelier Client Portal
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-light text-neutral-900 uppercase tracking-wider text-left">
                My Order Portfolio
              </h1>
            </div>

            {/* Concierge Support Badge */}
            <div className="border border-neutral-200 bg-white/40 px-5 py-3 flex items-center gap-3 text-left">
              <div className="h-8 w-8 bg-neutral-900 text-white flex items-center justify-center font-serif font-semibold text-xs shrink-0">
                DN
              </div>
              <div>
                <span className="text-[8px] text-neutral-400 uppercase font-bold tracking-wider block">Assigned Private Jeweler</span>
                <span className="text-[11px] font-semibold text-neutral-800">Victoria Kensington • Direct Atelier</span>
              </div>
            </div>
          </div>

          {/* Controls Bar: Filter Tabs & Search */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 border-b border-neutral-200 pb-2">
            {/* Tabs */}
            <div className="flex items-center gap-8 overflow-x-auto scrollbar-none">
              {[
                { id: "all", label: "All Purchases", count: STATIC_MOCK_ORDERS.length },
                { id: "in_progress", label: "In Progress", count: 2 },
                { id: "delivered", label: "Vaulted", count: 1 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer relative ${activeTab === tab.id
                    ? "text-neutral-955 font-semibold"
                    : "text-neutral-400 hover:text-neutral-955"
                    }`}
                >
                  <span>{tab.label}</span>
                  <span className="ml-1.5 text-[9px] font-mono text-neutral-400">({tab.count})</span>
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-neutral-900" />
                  )}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72 pb-2">
              <FaSearch className="absolute right-1 top-1/2 -translate-y-1/2 text-neutral-400" size={12} />
              <input
                type="text"
                placeholder="Search specifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-200 py-1.5 pr-6 text-xs tracking-wider focus:outline-none focus:border-neutral-950 transition-colors text-neutral-850 placeholder:text-neutral-400 placeholder:font-light"
              />
            </div>
          </div>

          {/* Order Cards List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-12">
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrder === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-neutral-200/70 space-y-0 transition-all duration-300 hover:border-neutral-350"
                  >
                    {/* Top Order Summary Bar */}
                    <div className="bg-transparent border-b border-neutral-100 px-6 sm:px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                      <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-left">
                        <div>
                          <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-[0.2em] block">Reference</span>
                          <span className="font-mono font-semibold text-neutral-900 text-sm tracking-wider">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-[0.2em] block">Date Placed</span>
                          <span className="font-medium text-neutral-600 mt-0.5 block">{order.date}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-[0.2em] block">Total Escrow</span>
                          <span className="font-serif font-bold text-neutral-900 text-sm tracking-wide block">{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>

                      {/* Status Badge & Expand Toggle */}
                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.25em] ${order.statusCategory === "delivered"
                          ? "text-neutral-950"
                          : "text-neutral-600"
                          }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${order.statusCategory === "delivered" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                            }`}></span>
                          {order.status}
                        </span>

                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-905 hover:text-neutral-550 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{isExpanded ? "Hide Tracking" : "Track Shipment"}</span>
                          <FaChevronRight className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} size={8} />
                        </button>
                      </div>
                    </div>

                    {/* Interactive Tracking Timeline Section (Shown when expanded) */}
                    {isExpanded && (
                      <div className="bg-[#FAF9F6]/50 border-b border-neutral-100 px-6 sm:px-8 py-8 space-y-6 animate-fade-in text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="text-[10px] font-bold text-neutral-905 uppercase tracking-[0.2em] flex items-center gap-2">
                              <FaTruck className="text-neutral-705" size={12} />
                              Courier Log
                            </h4>
                            <p className="text-[11px] text-neutral-500 mt-1">
                              Waybill ID: <span className="font-mono text-neutral-800">{order.trackingNumber}</span>
                            </p>
                          </div>
                          <div className="text-left sm:text-right text-[11px]">
                            <span className="text-neutral-400 uppercase text-[9px] font-bold tracking-[0.15em] block">Delivery Details</span>
                            <span className="font-semibold text-neutral-800">{order.estimatedDelivery}</span>
                          </div>
                        </div>

                        {/* Step Bar (Linear timeline) */}
                        <div className="relative pt-6">
                          {/* Connecting Line */}
                          <div className="absolute top-[37px] left-0 right-0 h-[1px] bg-neutral-200 -translate-y-1/2 hidden sm:block z-0" />

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
                            {order.steps.map((step, idx) => {
                              const isStepCompleted = step.completed;
                              const isStepActive = step.active;

                              return (
                                <div key={idx} className="flex sm:flex-col items-start gap-4 sm:gap-3">
                                  {/* Step Indicator Dot */}
                                  <div className="flex items-center justify-center shrink-0">
                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300 ${isStepActive
                                      ? "bg-neutral-955 text-white ring-4 ring-neutral-955/15"
                                      : isStepCompleted
                                        ? "bg-neutral-955 text-white"
                                        : "bg-white border border-neutral-300 text-neutral-300"
                                      }`}>
                                      {isStepCompleted ? (
                                        <span className="text-[8px]">✓</span>
                                      ) : (
                                        <span className="text-[8px] font-mono">{idx + 1}</span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Step Content */}
                                  <div className="space-y-0.5">
                                    <h5 className={`text-xs font-bold uppercase tracking-wider ${isStepActive ? "text-neutral-955" : isStepCompleted ? "text-neutral-700" : "text-neutral-400"
                                      }`}>
                                      {step.title}
                                    </h5>
                                    <p className="text-[10px] text-neutral-500 font-light leading-relaxed">{step.desc}</p>
                                    <span className="text-[9px] font-mono text-neutral-400 block pt-1">{step.date}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Items & Destination Details Grid */}
                    <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                      {/* Left Column: Items Requested */}
                      <div className="lg:col-span-8 space-y-6 text-left">
                        <div className="flex justify-between items-center border-b border-neutral-100 pb-3.5">
                          <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                            <FaGem className="text-neutral-600" size={11} />
                            Jewelry Pieces ({order.items.length})
                          </h3>
                          {order.appliedCouponCode && (
                            <span className="text-[9px] font-bold px-3 py-1 bg-neutral-50 border border-neutral-200 text-neutral-800 uppercase tracking-wider">
                              Code: {order.appliedCouponCode} (-{formatPrice(order.discountAmount)})
                            </span>
                          )}
                        </div>

                        <div className="divide-y divide-neutral-100">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col sm:flex-row gap-6 py-6 first:pt-0 last:pb-0"
                            >
                              {/* Product Thumbnail */}
                              <div className="relative h-28 w-28 overflow-hidden border border-neutral-200/60 shrink-0 bg-neutral-50">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2 right-2 bg-neutral-900/90 text-white text-[9px] font-mono px-1.5 py-0.5 tracking-wider">
                                  QTY {item.quantity}
                                </span>
                              </div>

                              {/* Item Details */}
                              <div className="flex-1 min-w-0 flex flex-col justify-between space-y-4">
                                <div>
                                  <div className="flex justify-between items-start gap-4">
                                    <h4 className="text-base sm:text-lg font-serif text-neutral-900 font-light tracking-wide leading-tight">
                                      {item.title}
                                    </h4>
                                    <span className="text-sm sm:text-base font-serif font-medium text-neutral-900 shrink-0">
                                      {formatPrice(item.total)}
                                    </span>
                                  </div>

                                  {/* Specifications Inline Text */}
                                  <p className="text-[11px] text-neutral-500 mt-2 flex flex-wrap gap-x-2 gap-y-1 items-center font-light uppercase tracking-wider">
                                    <span>{item.metal}</span>
                                    <span className="text-neutral-300">•</span>
                                    <span>{item.carat} Carats</span>
                                    <span className="text-neutral-300">•</span>
                                    <span>{item.specs}</span>
                                  </p>
                                </div>

                                {/* Certification Dossier Badge */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-neutral-100 text-[11px]">
                                  <div className="flex items-center gap-1.5 text-neutral-550">
                                    <FaCertificate className="text-neutral-600" size={11} />
                                    <span className="font-semibold text-neutral-805">GIA Inscription:</span>
                                    <span className="font-mono text-neutral-500 underline cursor-pointer hover:text-black">
                                      {item.certificate}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => triggerToast(`Verified ${item.certificate} inside GIA/IGI Vault Database`)}
                                    className="text-[9px] font-bold uppercase tracking-wider text-neutral-800 hover:text-black underline cursor-pointer flex items-center gap-1"
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
                        <div className="space-y-3 pb-6 border-b border-neutral-100">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                            <FaMapMarkerAlt size={10} className="text-neutral-705" /> Secure Address
                          </span>
                          <div className="space-y-1 text-xs text-neutral-700">
                            <p className="font-semibold text-neutral-900 text-sm tracking-wide">{order.customerName}</p>
                            <p className="font-light leading-relaxed text-neutral-505">{order.address}</p>
                            <p className="font-mono text-[10px] text-neutral-400 pt-1">{order.phone} • {order.email}</p>
                          </div>
                        </div>

                        {/* Quick Atelier Actions */}
                        <div className="space-y-3">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                            Documents & Concierge
                          </span>

                          <div className="grid grid-cols-1 gap-2.5">
                            <button
                              onClick={() => triggerToast(`Downloading Official GIA/IGI Valuation Dossier for ${order.id}...`)}
                              className="w-full py-3.5 px-4 bg-transparent hover:bg-neutral-900 text-neutral-900 hover:text-white border border-neutral-900 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-between cursor-pointer"
                            >
                              <span className="flex items-center gap-2.5">
                                <FaFileDownload size={11} />
                                Download Dossier
                              </span>
                              <span>↓</span>
                            </button>

                            <button
                              onClick={() => triggerToast(`Generating Official Escrow Tax Invoice for ${order.id}...`)}
                              className="w-full py-3.5 px-4 bg-transparent hover:bg-neutral-900 text-neutral-900 hover:text-white border border-neutral-900 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-between cursor-pointer"
                            >
                              <span className="flex items-center gap-2.5">
                                <FaPrint size={11} />
                                Print Invoice
                              </span>
                              <span>→</span>
                            </button>

                            <button
                              onClick={() => triggerToast(`Atelier Concierge notified: Requesting private ring resize / maintenance service`)}
                              className="w-full py-3.5 px-4 bg-neutral-100 hover:bg-neutral-900 hover:text-white border border-transparent text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-between cursor-pointer text-neutral-800"
                            >
                              <span className="flex items-center gap-2.5">
                                <FaRedoAlt size={10} />
                                Concierge Resize
                              </span>
                              <span>✦</span>
                            </button>
                          </div>
                        </div>

                        {/* Concierge Help Note */}
                        <p className="text-[10px] text-neutral-400 font-light leading-relaxed pt-2 border-t border-neutral-100">
                          Need modifications before dispatch? Contact your private jeweler directly or email <span className="underline font-medium text-neutral-600">concierge@dndiamond.com</span> quoting reference <span className="font-mono text-neutral-808">{order.id}</span>.
                        </p>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State when Search/Tab yields no matches */
            <div className="bg-white border border-neutral-200 p-16 max-w-xl mx-auto text-center space-y-6">
              <div className="h-16 w-16 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-450 mx-auto border border-neutral-200">
                <FaInbox size={20} />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl tracking-wide text-neutral-900">
                  No Matching Inquiries
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-light max-w-md mx-auto">
                  No orders matched your current filter &apos;<span className="font-semibold text-neutral-808">{activeTab}</span>&apos; or search query &apos;<span className="font-mono text-neutral-808">{searchQuery}</span>&apos;.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                }}
                className="inline-block px-8 py-3.5 bg-neutral-900 hover:bg-neutral-808 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer border-0 transition-colors"
              >
                Reset Filters & View All
              </button>
            </div>
          )}

          {/* Bottom Security Assurance Banner */}
          <div className="border border-neutral-200 bg-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-left transition-all duration-300 hover:border-neutral-350">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[9px] font-bold tracking-[0.25em] text-neutral-400 uppercase block">
                INSURED VAULT SHIPPING
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-light text-neutral-900 tracking-wide">
                100% Fully Insured Armored Delivery
              </h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Every DN Diamond delivery travels via Brinks or Malca-Amit armored security couriers, fully insured from our Antwerp/New York ateliers directly to your doorstep. All deliveries require dual signature identification.
              </p>
            </div>
            <button
              onClick={() => router.push("/jewelry")}
              className="px-8 py-4 bg-neutral-900 hover:bg-neutral-808 text-white text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0 cursor-pointer shadow-none"
            >
              Explore New Collections
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}
