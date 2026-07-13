"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { useStore } from "@/context/StoreContext";
import confetti from "canvas-confetti";
import {
  FaLock,
  FaCheckCircle,
  FaArrowLeft,
  FaCreditCard,
  FaQrcode,
  FaGift,
  FaUpload,
  FaPrint,
  FaCopy,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaGem,
} from "react-icons/fa";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    totalItems,
    updateQuantity,
    removeFromCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    getCartSubtotal,
    getDiscountAmount,
    getCartTotal,
    checkoutOrder,
    region,
    getRegionDetails,
    formatPrice,
    formatConvertedPrice,
    getTaxAmount,
  } = useStore();

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Shipping details state
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "Credit Card",
  });

  const [shippingMethod, setShippingMethod] = useState("Standard Shipping");
  const [copiedField, setCopiedField] = useState("");

  // KYC Compliance states
  const [kycDocType, setKycDocType] = useState("HKID");
  const [kycDocNum, setKycDocNum] = useState("");
  const [kycFile, setKycFile] = useState("");
  const [kycSimulating, setKycSimulating] = useState(false);

  // PayMe app simulation states
  const [payMeRedirecting, setPayMeRedirecting] = useState(false);
  const [payMePaid, setPayMePaid] = useState(false);

  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Credit Card formatting & state
  const [cardInfo, setCardInfo] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  // Default shipping and payment methods based on region
  useEffect(() => {
    if (region === "HK") {
      setShippingMethod("Standard Courier Delivery");
      setShippingInfo((prev) => ({ ...prev, paymentMethod: "Credit Card" }));
    } else {
      setShippingMethod("Standard Shipping");
      setShippingInfo((prev) => ({ ...prev, paymentMethod: "Credit Card" }));
    }
  }, [region]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (promoCode.trim() === "") return;

    const res = applyCouponCode(promoCode);
    if (res.success) {
      setPromoSuccess(res.message);
      setPromoCode("");
    } else {
      setPromoError(res.message);
    }
  };

  const handleFormChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardChange = (e) => {
    let { name, value } = e.target;
    if (name === "number") {
      // Format spaces: xxxx xxxx xxxx xxxx
      value = value
        .replace(/\s?/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    } else if (name === "expiry") {
      // Format slash: MM/YY
      value = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .slice(0, 5);
    } else if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }
    setCardInfo({
      ...cardInfo,
      [name]: value,
    });
  };

  const getShippingFee = () => {
    if (shippingMethod === "Express Insured Delivery") {
      return 25; // Base shipping fee
    }
    return 0;
  };

  const getGrandTotal = () => {
    const feeMultiplier = region === "AU" ? 1.5 : region === "NZ" ? 1.6 : 7.8;
    return (
      getCartTotal() +
      Math.round(
        getShippingFee() *
          (shippingMethod === "Express Insured Delivery" ? feeMultiplier : 0),
      )
    );
  };

  const isKycRequired = region === "HK" && getCartTotal() >= 120000;
  const isKycCompleted =
    !isKycRequired || (kycFile && kycDocNum.trim().length > 0);

  const handleKycUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setKycSimulating(true);
      setTimeout(() => {
        setKycFile(fileName);
        setKycSimulating(false);
      }, 1200); // Visual loader simulation
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Validate main shipping form
    const { name, email, phone, address, city, postalCode } = shippingInfo;
    if (!name || !email || !phone || !address || !city || !postalCode) {
      alert("Please complete all shipping address fields.");
      return;
    }

    if (isKycRequired && !isKycCompleted) {
      alert("Please complete the required DPMS KYC identity verification.");
      return;
    }

    if (shippingInfo.paymentMethod === "Credit Card") {
      if (
        cardInfo.number.replace(/\s/g, "").length < 15 ||
        cardInfo.expiry.length < 5 ||
        cardInfo.cvv.length < 3
      ) {
        alert("Please complete card billing details.");
        return;
      }
    }

    const orderDetails = {
      ...shippingInfo,
      shippingMethod,
      kycDocType: isKycRequired ? kycDocType : null,
      kycDocNum: isKycRequired ? kycDocNum : null,
      payMePaid: shippingInfo.paymentMethod === "PayMe" ? payMePaid : false,
      totalAmount: getGrandTotal(),
    };

    // Trigger local storage storage and clear cart
    const confirmedOrder = checkoutOrder(orderDetails);
    confirmedOrder.shippingMethod = shippingMethod;
    confirmedOrder.totalAmount = getGrandTotal();

    setOrderConfirmed(confirmedOrder);

    // Blast premium confetti
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#121212", "#A3E635", "#FFFFFF", "#CCCCCC", "#D4AF37"],
    });
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(""), 2000);
  };

  // If loading confirmed view
  if (orderConfirmed) {
    return (
      <Layout>
        <div className="bg-slate-background min-h-screen py-16 px-4 md:px-8 font-sans">
          <div className="max-w-3xl mx-auto bg-white border border-slate-100 shadow-xl rounded-3xl overflow-hidden animate-fade-in print:shadow-none print:border-none print:my-0">
            {/* Header Success Section */}
            <div className="bg-neutral-900 text-white p-8 md:p-12 text-center space-y-4 print:bg-white print:text-black print:p-0">
              <FaCheckCircle className="text-lime-400 text-6xl mx-auto animate-bounce print:hidden" />
              <div className="space-y-2">
                <h1 className="font-serif text-2xl md:text-3xl tracking-wide">
                  Your Inquiry has been Received
                </h1>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest print:text-neutral-500">
                  Transaction Reference ID: {orderConfirmed.id}
                </p>
              </div>
            </div>

            {/* Receipt details */}
            <div className="p-6 md:p-10 space-y-8">
              <div className="text-center max-w-lg mx-auto">
                <p className="text-sm text-slate-600 leading-relaxed font-light font-sans text-left">
                  Thank you,{" "}
                  <strong className="text-slate-800">
                    {orderConfirmed.customerName}
                  </strong>
                  . Your fine jewelry request is placed. A dedicated dn Diamonds
                  concierge representative will contact you at{" "}
                  <strong className="text-slate-800">
                    {orderConfirmed.email}
                  </strong>{" "}
                  or phone{" "}
                  <strong className="text-slate-800">
                    {orderConfirmed.phone}
                  </strong>{" "}
                  within 2 hours to confirm your GIA custom diamonds.
                </p>
              </div>

              {/* Localized HK Payment Action on success screen */}
              {region === "HK" &&
                ["FPS", "PayMe", "AlipayHK", "WeChat Pay HK"].includes(
                  orderConfirmed.paymentMethod,
                ) && (
                  <div className="border border-lime-500/20 bg-lime-50/30 rounded-2xl p-6 max-w-xl mx-auto space-y-4 print:border-neutral-200">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                      <FaQrcode className="text-lime-600 text-base" /> Scan &
                      Settle Local Payment
                    </h3>

                    {orderConfirmed.paymentMethod === "FPS" && (
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm shrink-0">
                          <svg
                            width="140"
                            height="140"
                            viewBox="0 0 100 100"
                            className="text-slate-800"
                          >
                            <rect width="100" height="100" fill="white" />
                            <path
                              d="M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z M5,75 h20 v20 h-20 z M10,80 h10 v10 h-10 z"
                              fill="currentColor"
                            />
                            <rect x="35" y="5" width="5" height="15" fill="currentColor" />
                            <rect x="45" y="10" width="10" height="5" fill="currentColor" />
                            <rect x="60" y="5" width="5" height="5" fill="currentColor" />
                            <rect x="35" y="25" width="20" height="5" fill="currentColor" />
                            <rect x="65" y="25" width="5" height="15" fill="currentColor" />
                            <rect x="5" y="35" width="15" height="5" fill="currentColor" />
                            <rect x="25" y="35" width="5" height="10" fill="currentColor" />
                            <rect x="35" y="40" width="10" height="15" fill="currentColor" />
                            <rect x="50" y="35" width="15" height="5" fill="currentColor" />
                            <rect x="75" y="35" width="20" height="5" fill="currentColor" />
                            <rect x="80" y="45" width="10" height="10" fill="currentColor" />
                            <rect x="5" y="55" width="10" height="5" fill="currentColor" />
                            <rect x="20" y="50" width="5" height="15" fill="currentColor" />
                            <rect x="55" y="55" width="15" height="5" fill="currentColor" />
                            <rect x="35" y="70" width="15" height="5" fill="currentColor" />
                            <rect x="60" y="70" width="10" height="10" fill="currentColor" />
                            <rect x="75" y="75" width="10" height="5" fill="currentColor" />
                            <rect x="85" y="85" width="10" height="10" fill="currentColor" />
                            <rect x="30" y="42" width="40" height="16" rx="3" fill="#121212" />
                            <text
                              x="50"
                              y="53"
                              fill="white"
                              fontSize="8"
                              fontWeight="black"
                              textAnchor="middle"
                            >
                              FPS PAY
                            </text>
                          </svg>
                        </div>
                        <div className="space-y-2 text-left">
                          <p className="text-xs text-slate-500 leading-relaxed font-light">
                            Please open your local Hong Kong mobile banking app
                            (HSBC, BOCHK, Hang Seng, etc.), choose <strong>Scan QR Code</strong>,
                            and scan this code to pay the total of:
                          </p>
                          <p className="text-base font-extrabold text-neutral-900">
                            {formatConvertedPrice(orderConfirmed.totalAmount)}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                            Receiver: dn Diamonds Limited
                          </p>
                        </div>
                      </div>
                    )}

                    {orderConfirmed.paymentMethod === "PayMe" && (
                      <div className="space-y-2 text-left">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-[#FF5A5F] text-white rounded-full flex items-center justify-center font-black text-lg shadow-sm">
                            P
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">
                              PayMe App Launch Successful
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              Amount Settle:{" "}
                              <strong>
                                {formatConvertedPrice(orderConfirmed.totalAmount)}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                          If PayMe did not launch on your device automatically,
                          please scan or wire directly using the standard PayMe P2P
                          merchant code provided during checkout.
                        </p>
                      </div>
                    )}

                    {["AlipayHK", "WeChat Pay HK"].includes(
                      orderConfirmed.paymentMethod,
                    ) && (
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm shrink-0">
                          <svg
                            width="140"
                            height="140"
                            viewBox="0 0 100 100"
                            className="text-slate-800"
                          >
                            <rect width="100" height="100" fill="white" />
                            <path
                              d="M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z M5,75 h20 v20 h-20 z M10,80 h10 v10 h-10 z"
                              fill="currentColor"
                            />
                            <rect x="35" y="5" width="5" height="15" fill="currentColor" />
                            <rect x="45" y="10" width="10" height="5" fill="currentColor" />
                            <rect x="60" y="5" width="5" height="5" fill="currentColor" />
                            <rect x="35" y="25" width="20" height="5" fill="currentColor" />
                            <rect x="65" y="25" width="5" height="15" fill="currentColor" />
                            <rect x="5" y="35" width="15" height="5" fill="currentColor" />
                            <rect x="25" y="35" width="5" height="10" fill="currentColor" />
                            <rect x="35" y="40" width="10" height="15" fill="currentColor" />
                            <rect x="50" y="35" width="15" height="5" fill="currentColor" />
                            <rect x="75" y="35" width="20" height="5" fill="currentColor" />
                            <rect x="80" y="45" width="10" height="10" fill="currentColor" />
                            <rect x="5" y="55" width="10" height="5" fill="currentColor" />
                            <rect x="20" y="50" width="5" height="15" fill="currentColor" />
                            <rect x="55" y="55" width="15" height="5" fill="currentColor" />
                            <rect x="35" y="70" width="15" height="5" fill="currentColor" />
                            <rect x="60" y="70" width="10" height="10" fill="currentColor" />
                            <rect x="75" y="75" width="10" height="5" fill="currentColor" />
                            <rect x="85" y="85" width="10" height="10" fill="currentColor" />
                            <circle cx="50" cy="50" r="10" fill="#121212" />
                          </svg>
                        </div>
                        <div className="space-y-2 text-left">
                          <p className="text-xs text-slate-500 leading-relaxed font-light">
                            Scan this merchant QR code with your mobile{" "}
                            <strong>{orderConfirmed.paymentMethod}</strong> wallet to
                            complete the payment of:
                          </p>
                          <p className="text-base font-extrabold text-neutral-900">
                            {formatConvertedPrice(orderConfirmed.totalAmount)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {/* Wire bank transfer instructions */}
              {orderConfirmed.paymentMethod === "Bank Transfer" && (
                <div className="border border-slate-200 rounded-3xl p-6 max-w-xl mx-auto space-y-4 bg-slate-50 text-left print:border-neutral-200">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    🏛️ Wire Transfer Billing Instructions
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Please transfer the total amount of{" "}
                    <strong className="text-slate-800 font-extrabold">
                      {formatConvertedPrice(orderConfirmed.totalAmount)}
                    </strong>{" "}
                    to our official corporate account below. Quote reference code{" "}
                    <strong className="text-neutral-900 font-bold">
                      {orderConfirmed.id}
                    </strong>{" "}
                    in your wire comment.
                  </p>

                  <div className="space-y-2 bg-white p-4 border border-slate-100 rounded-2xl text-xs">
                    {[
                      { label: "Bank Name", value: "HSBC Hong Kong" },
                      { label: "Account Name", value: "dn Diamonds Limited" },
                      { label: "Account Number", value: "848-123456-838" },
                      { label: "Swift / BIC Code", value: "HSBCHKHHKHH" },
                      { label: "Transfer Reference", value: orderConfirmed.id },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-b-0"
                      >
                        <span className="text-slate-400 font-medium">
                          {item.label}
                        </span>
                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                          <span>{item.value}</span>
                          <button
                            onClick={() =>
                              copyToClipboard(item.value, item.label)
                            }
                            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                            title="Copy to clipboard"
                          >
                            <FaCopy size={10} />
                          </button>
                          {copiedField === item.label && (
                            <span className="text-[8px] bg-neutral-800 text-white px-1.5 py-0.5 rounded font-normal animate-pulse">
                              Copied
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order summary table */}
              <div className="border-t border-slate-100 pt-8 space-y-4 text-left">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                  Order Summary
                </h3>

                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Recipient:</span>
                    <span className="font-bold text-slate-700">
                      {orderConfirmed.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Address:</span>
                    <span className="font-medium text-slate-600 max-w-[280px] text-right truncate">
                      {orderConfirmed.address}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Logistics:</span>
                    <span className="font-bold text-slate-700">
                      {orderConfirmed.shippingMethod}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Payment:</span>
                    <span className="font-bold text-slate-700">
                      {orderConfirmed.paymentMethod}
                    </span>
                  </div>
                  <div className="border-t border-slate-200/80 pt-3 flex justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Grand Total Amount
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {formatConvertedPrice(orderConfirmed.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <FaPrint /> Print Receipt
                </button>
                <button
                  onClick={() => {
                    setOrderConfirmed(null);
                    router.push("/");
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <Layout>
        <div className="bg-slate-background min-h-screen py-24 px-4 flex flex-col justify-center items-center text-center font-sans">
          <div className="bg-white border border-slate-100 shadow-xl rounded-3xl p-10 max-w-md w-full space-y-6 animate-fade-in">
            <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
              <FaLock size={20} />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-xl tracking-wide text-slate-800">
                Your Bag is Empty
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-light max-w-xs mx-auto">
                Explore our fine collections, loose GIA-certified diamonds, or
                bespoke ring design builders to begin your inquiry.
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="w-full btn-teal py-4 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Browse Collections
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-slate-background min-h-screen py-10 md:py-16 px-4 md:px-8 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {/* Back Navigation Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors"
            >
              <FaArrowLeft size={10} /> Back to Gallery
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold tracking-wider uppercase">
              <FaLock className="text-slate-500" /> Secure Checkout SSL
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
            {/* Left Side: Checkout Forms */}
            <div className="lg:col-span-7 space-y-8">
              <form onSubmit={handlePlaceOrder} className="space-y-8">
                {/* 1. Shipping Details Card */}
                <div className="bg-white border border-slate-100 shadow-md rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                    <span className="h-6 w-6 rounded-full bg-neutral-900 text-white font-bold text-[10px] flex items-center justify-center">
                      1
                    </span>
                    <h2 className="font-serif text-lg tracking-wide text-slate-800">
                      Shipping Details
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col text-left space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={shippingInfo.name}
                        onChange={handleFormChange}
                        placeholder="e.g. Eleanor Vanderbilt"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white text-slate-800 font-medium font-sans text-left"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col text-left space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={shippingInfo.email}
                          onChange={handleFormChange}
                          placeholder="concierge@luxury.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white text-slate-800 font-medium font-sans text-left"
                        />
                      </div>
                      <div className="flex flex-col text-left space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Contact Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={shippingInfo.phone}
                          onChange={handleFormChange}
                          placeholder="+852 2345 6789"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white text-slate-800 font-medium font-sans text-left"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col text-left space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={shippingInfo.address}
                        onChange={handleFormChange}
                        placeholder="Flat C, 28/F, Highrise Mansion, Mid-Levels"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white text-slate-800 font-medium font-sans text-left"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col text-left space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          City / Territory
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={shippingInfo.city}
                          onChange={handleFormChange}
                          placeholder="Hong Kong"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white text-slate-800 font-medium font-sans text-left"
                        />
                      </div>
                      <div className="flex flex-col text-left space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Postal / ZIP Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          required
                          value={shippingInfo.postalCode}
                          onChange={handleFormChange}
                          placeholder="0000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white text-slate-800 font-medium font-sans text-left"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Logistics & Delivery Options Card */}
                <div className="bg-white border border-slate-100 shadow-md rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                    <span className="h-6 w-6 rounded-full bg-neutral-900 text-white font-bold text-[10px] flex items-center justify-center">
                      2
                    </span>
                    <h2 className="font-serif text-lg tracking-wide text-slate-800">
                      Delivery Logistics
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col text-left space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Shipping Method
                      </label>
                      <select
                        name="shippingMethod"
                        value={shippingMethod}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white text-slate-700 font-semibold"
                      >
                        {region === "HK" ? (
                          <>
                            <option value="Standard Courier Delivery">
                              Standard Courier Delivery (Complimentary)
                            </option>
                            <option value="Showroom Pickup - T.S.T Office">
                              Showroom Pickup - T.S.T Office, Hong Kong (Complimentary)
                            </option>
                          </>
                        ) : (
                          <>
                            <option value="Standard Shipping">
                              Standard Shipping (Complimentary)
                            </option>
                            <option value="Express Insured Delivery">
                              Express Insured Delivery (Flat $25 USD)
                            </option>
                          </>
                        )}
                      </select>
                    </div>

                    {region === "HK" &&
                      shippingMethod === "Showroom Pickup - T.S.T Office" && (
                        <div className="bg-neutral-50 border border-slate-200 rounded-2xl p-4 text-[11px] text-slate-600 font-medium leading-relaxed flex gap-3 text-left">
                          <div className="text-slate-800 pt-0.5">
                            <FaMapMarkerAlt size={14} />
                          </div>
                          <div>
                            <strong>Hong Kong Atelier Showroom:</strong>
                            <p className="mt-0.5 text-slate-500 font-light">
                              Unit 303, 3/F, Chevalier House, 45–51 Chatham Road, T.S.T,
                              Kowloon, Hong Kong.
                            </p>
                            <p className="mt-1 font-semibold text-slate-700">
                              Hours: Mon-Sat 10:00 AM - 7:00 PM. Photo ID required on
                              pickup.
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* High-Ticket DPMS Legal KYC Form */}
                {isKycRequired && (
                  <div className="bg-red-50/20 border border-neutral-200 rounded-3xl p-6 space-y-4 text-left animate-fade-in">
                    <div className="flex items-center gap-2 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                      ⚠️ High-Value Transaction Legal KYC Compliance
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-light font-sans text-left">
                      Under Hong Kong Anti-Money Laundering Laws (DPMS Category B
                      regulations), custom GIA jewelry transactions valued at or above
                      <strong> HK$ 120,000</strong> require identity check registration.
                      Your documents are encrypted and saved securely.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col text-left space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          Document Type
                        </label>
                        <select
                          value={kycDocType}
                          onChange={(e) => setKycDocType(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] focus:outline-none text-slate-700 font-bold"
                        >
                          <option value="HKID">Hong Kong ID Card (HKID)</option>
                          <option value="Passport">International Passport</option>
                        </select>
                      </div>
                      <div className="flex flex-col text-left space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          Document ID Number
                        </label>
                        <input
                          type="text"
                          required
                          value={kycDocNum}
                          onChange={(e) => setKycDocNum(e.target.value)}
                          placeholder={
                            kycDocType === "HKID"
                              ? "e.g. A123456(7)"
                              : "e.g. G12345678"
                          }
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-[11px] focus:outline-none text-slate-800 font-bold text-left"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Upload ID Copy
                      </label>
                      {kycSimulating ? (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-2">
                          <div className="h-6 w-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Encrypting and uploading securely...
                          </span>
                        </div>
                      ) : !kycFile ? (
                        <div
                          onClick={() =>
                            document.getElementById("kyc-page-file-input").click()
                          }
                          className="border-2 border-dashed border-slate-300 hover:border-slate-800 bg-white hover:bg-slate-50 transition-all rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center space-y-2"
                        >
                          <FaUpload className="text-slate-400 text-lg" />
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            Choose or drag ID/Passport copy
                          </span>
                          <span className="text-[9px] text-slate-400">
                            Accepted: JPEG, PNG, PDF (Max 10MB)
                          </span>
                          <input
                            id="kyc-page-file-input"
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={handleKycUpload}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-neutral-900 text-white rounded-2xl px-4 py-3.5 text-xs font-bold">
                          <span className="truncate max-w-[240px]">
                            📄 Secure Upload: {kycFile}
                          </span>
                          <button
                            type="button"
                            onClick={() => setKycFile("")}
                            className="text-slate-400 hover:text-white uppercase text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {kycFile && kycDocNum.trim().length > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-800 font-bold uppercase tracking-wider mt-1 pl-1">
                        <FaCheckCircle className="text-neutral-950" /> Compliance Document Validated
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Secure Billing details Card */}
                <div className="bg-white border border-slate-100 shadow-md rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                    <span className="h-6 w-6 rounded-full bg-neutral-900 text-white font-bold text-[10px] flex items-center justify-center">
                      3
                    </span>
                    <h2 className="font-serif text-lg tracking-wide text-slate-800">
                      Payment Settlement Method
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col text-left space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Choose Payment Type
                      </label>
                      <select
                        name="paymentMethod"
                        value={shippingInfo.paymentMethod}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white text-slate-700 font-semibold"
                      >
                        {region === "HK" ? (
                          <>
                            <option value="Credit Card">
                              Credit Card (Visa / Mastercard) & Apple Pay
                            </option>
                            <option value="FPS">
                              FPS (Faster Payment System QR Code Instant Settle)
                            </option>
                            <option value="PayMe">
                              PayMe Wallet (by HSBC)
                            </option>
                            <option value="AlipayHK">AlipayHK Smart App</option>
                            <option value="WeChat Pay HK">
                              WeChat Pay HK Wallet
                            </option>
                            <option value="Bank Transfer">
                              Corporate Bank Wire (HSBC Transfer)
                            </option>
                          </>
                        ) : (
                          <>
                            <option value="Credit Card">
                              Credit Card (Visa / Mastercard / AMEX)
                            </option>
                            <option value="UPI">
                              Google Pay / UPI Apple Pay
                            </option>
                            <option value="Bank Transfer">
                              Swift Wire Bank Transfer
                            </option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* PayMe redirect simulate */}
                    {shippingInfo.paymentMethod === "PayMe" && (
                      <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 text-center space-y-4 animate-fade-in text-left">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 justify-center">
                          <span className="h-5 w-5 bg-[#FF5A5F] rounded-full flex items-center justify-center text-[11px] font-black text-white">
                            P
                          </span>
                          HSBC PayMe Checkout Redirect
                        </h4>

                        {payMePaid ? (
                          <div className="flex items-center gap-2 justify-center bg-white border border-lime-500/20 py-3 rounded-xl shadow-xs text-slate-800">
                            <FaCheckCircle className="text-lime-500 text-sm" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                              PayMe Wallet Settle Linked
                            </span>
                          </div>
                        ) : payMeRedirecting ? (
                          <div className="flex flex-col items-center justify-center py-3 space-y-2">
                            <div className="h-5 w-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                              Launching PayMe App on device...
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setPayMeRedirecting(true);
                              setTimeout(() => {
                                setPayMeRedirecting(false);
                                setPayMePaid(true);
                              }, 1600);
                            }}
                            className="w-full bg-[#FF5A5F] hover:bg-[#ff444a] text-white py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm border-0"
                          >
                            Authorize with PayMe Wallet
                          </button>
                        )}
                      </div>
                    )}

                    {/* Credit Card Form Inputs */}
                    {shippingInfo.paymentMethod === "Credit Card" && (
                      <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 space-y-4 animate-fade-in text-left">
                        <div className="flex items-center justify-between text-slate-700 pb-2 border-b border-slate-200/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Card Information
                          </span>
                          <FaCreditCard size={14} />
                        </div>

                        <div className="flex flex-col space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="number"
                            required
                            placeholder="4111  1111  1111  1111"
                            value={cardInfo.number}
                            onChange={handleCardChange}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none text-slate-800 font-semibold text-left"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              name="expiry"
                              required
                              placeholder="MM / YY"
                              value={cardInfo.expiry}
                              onChange={handleCardChange}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none text-slate-800 font-semibold text-left"
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              Security CVV
                            </label>
                            <input
                              type="password"
                              name="cvv"
                              required
                              placeholder="123"
                              value={cardInfo.cvv}
                              onChange={handleCardChange}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none text-slate-800 font-semibold text-left"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm order button */}
                <button
                  type="submit"
                  disabled={isKycRequired && !isKycCompleted}
                  className={`w-full py-4.5 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all border-0 ${
                    isKycRequired && !isKycCompleted
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-neutral-900 text-white hover:bg-neutral-800 hover:scale-[1.01]"
                  }`}
                >
                  <FaLock />{" "}
                  {isKycRequired && !isKycCompleted
                    ? "Upload KYC Copy to Settle"
                    : `Confirm inquiry & place order • ${formatConvertedPrice(
                        getGrandTotal(),
                      )}`}
                </button>
              </form>
            </div>

            {/* Right Side: Order Summary Panel */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="bg-white border border-slate-100 shadow-md rounded-3xl p-6 space-y-6">
                <h3 className="font-serif text-lg tracking-wide text-slate-800 pb-4 border-b border-slate-100 text-left">
                  Atelier Bag Summary
                </h3>

                {/* Items */}
                <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-2 space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                      {item.image && item.image.includes("http") ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-16 w-16 object-cover rounded-xl border border-slate-100 shrink-0"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-xl shrink-0 flex items-center justify-center text-neutral-800 font-serif font-black text-lg">
                          {item.category ? item.category.charAt(0) : "✦"}
                        </div>
                      )}

                      <div className="flex-1 min-w-0 text-left flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 truncate">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-semibold tracking-wider mt-0.5">
                            {item.metal} • {item.carat} ct
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-slate-500 font-medium">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex flex-col justify-between">
                        <span className="text-xs font-extrabold text-slate-900">
                          {formatPrice(item.total)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">
                          {formatPrice(item.price)} each
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon promotion application */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  {!appliedCoupon ? (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Promo Code (PRAYA10)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 pl-8 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 text-slate-800 placeholder:text-slate-400 font-semibold text-left"
                        />
                        <FaGift className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border-0"
                      >
                        Apply
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between bg-lime-50 border border-lime-200 rounded-xl px-3.5 py-2.5 text-xs text-lime-900 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <FaCheckCircle className="text-lime-600" />
                        Code: {appliedCoupon.code} ({appliedCoupon.discountPercent}% Off)
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-lime-700 hover:text-lime-900 font-bold border-0 bg-transparent cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {promoError && (
                    <p className="text-[10px] text-red-500 font-semibold text-left">
                      {promoError}
                    </p>
                  )}
                  {promoSuccess && (
                    <p className="text-[10px] text-lime-600 font-bold text-left">
                      {promoSuccess}
                    </p>
                  )}
                </div>

                {/* Bill details */}
                <div className="border-t border-slate-100 pt-4 space-y-2 text-left text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Subtotal</span>
                    <span className="font-extrabold text-slate-800">
                      {formatConvertedPrice(getCartSubtotal())}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between font-bold text-lime-600">
                      <span className="font-medium">Discount Code</span>
                      <span>-${formatConvertedPrice(getDiscountAmount())}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">
                      Estimated Tax (
                      {region === "HK"
                        ? "0% VAT"
                        : `${region === "AU" ? "10% GST" : "15% GST"}`}
                      )
                    </span>
                    <span className="font-extrabold text-slate-800">
                      {region === "HK" ? "Free" : formatConvertedPrice(getTaxAmount())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">
                      Shipping logistics
                    </span>
                    <span className="font-bold text-slate-800">
                      {getShippingFee() === 0
                        ? "Free"
                        : formatConvertedPrice(
                            Math.round(
                              getShippingFee() * (region === "AU" ? 1.5 : 1.6),
                            ),
                          )}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/80 pt-4">
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      Total Invoice Value
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {formatConvertedPrice(getGrandTotal())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Secure Trust Badges */}
              <div className="bg-white border border-slate-100 shadow-md rounded-3xl p-6 space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">
                  dn Diamonds Guarantee
                </h4>
                <div className="grid grid-cols-2 gap-4 text-left">
                  {[
                    {
                      icon: <FaShieldAlt className="text-neutral-700" />,
                      title: "Secure SSL Settle",
                      desc: "256-bit encryption",
                    },
                    {
                      icon: <FaGem className="text-neutral-700" />,
                      title: "GIA Certified Stone",
                      desc: "Official laser registry",
                    },
                  ].map((badge, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <div className="text-slate-600 mt-0.5">{badge.icon}</div>
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-800">
                          {badge.title}
                        </h5>
                        <p className="text-[9px] text-slate-400 font-light mt-0.5">
                          {badge.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
