"use client";

import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaTrash,
  FaPlus,
  FaMinus,
  FaLock,
  FaGift,
  FaCheckCircle,
  FaCreditCard,
  FaUpload,
  FaMapMarkerAlt,
  FaQrcode,
  FaArrowRight,
} from "react-icons/fa";
import { useStore } from "@/context/StoreContext";
import confetti from "canvas-confetti";

export default function CartDrawer({ isOpen, onClose }) {
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

  // Checkout form state
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
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

  // KYC Compliance states
  const [kycDocType, setKycDocType] = useState("HKID");
  const [kycDocNum, setKycDocNum] = useState("");
  const [kycFile, setKycFile] = useState("");
  const [kycSimulating, setKycSimulating] = useState(false);

  // PayMe app simulation states
  const [payMeRedirecting, setPayMeRedirecting] = useState(false);
  const [payMePaid, setPayMePaid] = useState(false);

  const [orderConfirmed, setOrderConfirmed] = useState(null);

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

  if (!isOpen) return null;

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
      }, 1200); // Premium visual loader simulation
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Validate form
    const { name, email, phone, address, city, postalCode } = shippingInfo;
    if (!name || !email || !phone || !address || !city || !postalCode) {
      alert("Please complete all shipping address fields.");
      return;
    }

    if (isKycRequired && !isKycCompleted) {
      alert("Please complete the required DPMS KYC identity verification.");
      return;
    }

    const orderDetails = {
      ...shippingInfo,
      shippingMethod,
      kycDocType: isKycRequired ? kycDocType : null,
      kycDocNum: isKycRequired ? kycDocNum : null,
      payMePaid: shippingInfo.paymentMethod === "PayMe" ? payMePaid : false,
      totalAmount: getGrandTotal(),
    };

    const confirmedOrder = checkoutOrder(orderDetails);
    // Save the shipping method and full total details
    confirmedOrder.shippingMethod = shippingMethod;
    confirmedOrder.totalAmount = getGrandTotal();

    setOrderConfirmed(confirmedOrder);

    // Confetti celebration for premium effect
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#000000", "#FFFFFF", "#888888", "#CCCCCC"],
    });
  };

  const handleReset = () => {
    setOrderConfirmed(null);
    setIsCheckoutMode(false);
    setShippingInfo({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      paymentMethod: "Credit Card",
    });
    setShippingMethod("Standard Shipping");
    setKycDocNum("");
    setKycFile("");
    setPayMePaid(false);
    setPayMeRedirecting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dark background overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col glass-drawer">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex flex-col text-left">
              <h2 className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase">
                Shopping Cart
              </h2>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider mt-0.5">
                {!totalItems
                  ? "Your bag is empty"
                  : `${totalItems} Items Added`}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Order Confirmation Screen */}
          {orderConfirmed ? (
            <div className="flex-1 flex flex-col justify-start items-center text-center p-6 overflow-y-auto space-y-6">
              <div className="pt-4">
                <FaCheckCircle className="text-emerald-500 text-5xl animate-bounce mx-auto" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">
                  Order Placed Successfully!
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Reference ID: {orderConfirmed.id}
                </p>
              </div>

              <p className="text-xs text-slate-500 max-w-[320px] leading-relaxed font-light">
                Thank you,{" "}
                <span className="font-semibold text-slate-700">
                  {orderConfirmed.customerName}
                </span>
                . Your luxury inquiry has been received. Our concierge
                representative will contact you at{" "}
                <span className="font-semibold text-slate-700">
                  {orderConfirmed.email}
                </span>{" "}
                shortly.
              </p>

              {/* Localized HK Payment Action on success screen */}
              {region === "HK" &&
                ["FPS", "PayMe", "AlipayHK", "WeChat Pay HK"].includes(
                  orderConfirmed.paymentMethod,
                ) && (
                  <div className="border border-primary/20 bg-primary/5 rounded-2xl p-4 w-full text-left space-y-3">
                    <h4 className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                      <FaQrcode className="text-primary" /> Scan or Authorize
                      Local Payment
                    </h4>

                    {orderConfirmed.paymentMethod === "FPS" && (
                      <div className="space-y-2 text-center">
                        <div className="flex justify-center p-2 bg-white rounded-xl border border-slate-100 max-w-[120px] mx-auto">
                          <svg
                            width="100"
                            height="100"
                            viewBox="0 0 100 100"
                            className="text-slate-800"
                          >
                            <rect width="100" height="100" fill="white" />
                            <path
                              d="M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z M5,75 h20 v20 h-20 z M10,80 h10 v10 h-10 z"
                              fill="currentColor"
                            />
                            <rect
                              x="35"
                              y="5"
                              width="5"
                              height="15"
                              fill="currentColor"
                            />
                            <rect
                              x="45"
                              y="10"
                              width="10"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="60"
                              y="5"
                              width="5"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="35"
                              y="25"
                              width="20"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="65"
                              y="25"
                              width="5"
                              height="15"
                              fill="currentColor"
                            />
                            <rect
                              x="5"
                              y="35"
                              width="15"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="25"
                              y="35"
                              width="5"
                              height="10"
                              fill="currentColor"
                            />
                            <rect
                              x="35"
                              y="40"
                              width="10"
                              height="15"
                              fill="currentColor"
                            />
                            <rect
                              x="50"
                              y="35"
                              width="15"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="75"
                              y="35"
                              width="20"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="80"
                              y="45"
                              width="10"
                              height="10"
                              fill="currentColor"
                            />
                            <rect
                              x="5"
                              y="55"
                              width="10"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="20"
                              y="50"
                              width="5"
                              height="15"
                              fill="currentColor"
                            />
                            <rect
                              x="55"
                              y="55"
                              width="15"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="35"
                              y="70"
                              width="15"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="60"
                              y="70"
                              width="10"
                              height="10"
                              fill="currentColor"
                            />
                            <rect
                              x="75"
                              y="75"
                              width="10"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="85"
                              y="85"
                              width="10"
                              height="10"
                              fill="currentColor"
                            />
                            <rect
                              x="32"
                              y="42"
                              width="36"
                              height="16"
                              rx="3"
                              fill="#1A1A1A"
                            />
                            <text
                              x="50"
                              y="53"
                              fill="white"
                              fontSize="8"
                              fontWeight="black"
                              textAnchor="middle"
                            >
                              FPS
                            </text>
                          </svg>
                        </div>
                        <p className="text-[10px] text-slate-500 text-left font-light leading-relaxed">
                          Please scan the FPS QR code using your local mobile
                          banking app to authorize transfer of{" "}
                          <strong>
                            {formatConvertedPrice(orderConfirmed.totalAmount)}
                          </strong>{" "}
                          to Dndiamond Accounts.
                        </p>
                      </div>
                    )}

                    {orderConfirmed.paymentMethod === "PayMe" && (
                      <div className="space-y-2 text-center">
                        <div className="flex items-center justify-center p-3 bg-white rounded-xl border border-slate-100 max-w-[50px] mx-auto text-[#1A1A1A] font-black text-xl">
                          P
                        </div>
                        <p className="text-[10px] text-slate-500 text-left font-light leading-relaxed">
                          Redirected successfully. If the application did not
                          launch, please wire the total of{" "}
                          <strong>
                            {formatConvertedPrice(orderConfirmed.totalAmount)}
                          </strong>{" "}
                          directly using PayMe P2P code.
                        </p>
                      </div>
                    )}

                    {["AlipayHK", "WeChat Pay HK"].includes(
                      orderConfirmed.paymentMethod,
                    ) && (
                      <div className="space-y-2 text-center">
                        <div className="flex justify-center p-2 bg-white rounded-xl border border-slate-100 max-w-[120px] mx-auto">
                          <svg
                            width="100"
                            height="100"
                            viewBox="0 0 100 100"
                            className="text-neutral-800"
                          >
                            <rect width="100" height="100" fill="white" />
                            <path
                              d="M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z M5,75 h20 v20 h-20 z M10,80 h10 v10 h-10 z"
                              fill="currentColor"
                            />
                            <rect
                              x="35"
                              y="5"
                              width="5"
                              height="15"
                              fill="currentColor"
                            />
                            <rect
                              x="45"
                              y="10"
                              width="10"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="60"
                              y="5"
                              width="5"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="35"
                              y="25"
                              width="20"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="65"
                              y="25"
                              width="5"
                              height="15"
                              fill="currentColor"
                            />
                            <rect
                              x="5"
                              y="35"
                              width="15"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="25"
                              y="35"
                              width="5"
                              height="10"
                              fill="currentColor"
                            />
                            <rect
                              x="35"
                              y="40"
                              width="10"
                              height="15"
                              fill="currentColor"
                            />
                            <rect
                              x="50"
                              y="35"
                              width="15"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="75"
                              y="35"
                              width="20"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="80"
                              y="45"
                              width="10"
                              height="10"
                              fill="currentColor"
                            />
                            <rect
                              x="5"
                              y="55"
                              width="10"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="20"
                              y="50"
                              width="5"
                              height="15"
                              fill="currentColor"
                            />
                            <rect
                              x="55"
                              y="55"
                              width="15"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="35"
                              y="70"
                              width="15"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="60"
                              y="70"
                              width="10"
                              height="10"
                              fill="currentColor"
                            />
                            <rect
                              x="75"
                              y="75"
                              width="10"
                              height="5"
                              fill="currentColor"
                            />
                            <rect
                              x="85"
                              y="85"
                              width="10"
                              height="10"
                              fill="currentColor"
                            />
                            <circle cx="50" cy="50" r="8" fill="#1A1A1A" />
                          </svg>
                        </div>
                        <p className="text-[10px] text-slate-500 text-left font-light leading-relaxed">
                          Please scan the QR code above with your mobile{" "}
                          {orderConfirmed.paymentMethod} app to settle the
                          amount of{" "}
                          <strong>
                            {formatConvertedPrice(orderConfirmed.totalAmount)}
                          </strong>
                          .
                        </p>
                      </div>
                    )}
                  </div>
                )}

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 w-full text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    Total Price:
                  </span>
                  <span className="font-extrabold text-slate-800">
                    {formatConvertedPrice(orderConfirmed.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    Payment Mode:
                  </span>
                  <span className="font-bold text-slate-600">
                    {orderConfirmed.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Logistics:</span>
                  <span className="font-semibold text-slate-600">
                    {orderConfirmed.shippingMethod}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    Shipping Address:
                  </span>
                  <span className="font-medium text-slate-600 truncate max-w-[180px]">
                    {orderConfirmed.address}
                  </span>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="w-full btn-teal py-4 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs border-0"
              >
                Continue Shopping
              </button>
            </div>
          ) : cart.length === 0 ? (
            // Empty State
            <div className="flex-1 flex flex-col justify-center items-center text-center p-8 space-y-4">
              <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
                <FaLock size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 tracking-wider">
                Your bag is empty
              </h3>
              <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed font-light">
                Explore our custom ring builders and loose GIA-certified
                diamonds to find your perfect pieces.
              </p>
              <button
                onClick={onClose}
                className="btn-teal px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            // Content State
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Drawer Body Scroll */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                {!isCheckoutMode ? (
                  // Item List
                  cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all bg-white"
                    >
                      {item.image && item.image.includes("http") ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-20 w-20 object-cover rounded-lg border border-slate-100 shrink-0"
                        />
                      ) : (
                        <div className="h-20 w-20 bg-slate-50 border border-slate-100 rounded-lg shrink-0 flex items-center justify-center text-primary font-bold text-lg">
                          {item.category.charAt(0)}
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

                        <div className="flex items-center justify-between">
                          {/* Quantity select */}
                          <div className="flex items-center border border-slate-200 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item.cartId, item.quantity - 1)
                              }
                              className="px-2.5 py-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                              <FaMinus size={8} />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.cartId, item.quantity + 1)
                              }
                              className="px-2.5 py-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                              <FaPlus size={8} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-slate-400 hover:text-rose-500 p-2 cursor-pointer transition-colors"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex flex-col justify-between">
                        <span className="text-xs font-extrabold text-slate-900">
                          {formatPrice(item?.total)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">
                          {formatPrice(item.price)} each
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  // Checkout Form Block
                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-[10px] pb-2 border-b border-slate-100">
                      <FaLock /> Secure Checkout Form
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={shippingInfo.name}
                        onChange={handleFormChange}
                        placeholder="e.g. Alexander Vanderbilt"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={shippingInfo.email}
                          onChange={handleFormChange}
                          placeholder="concierge@luxury.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-slate-800"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={shippingInfo.phone}
                          onChange={handleFormChange}
                          placeholder="+852 2345 6789"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={shippingInfo.address}
                        onChange={handleFormChange}
                        placeholder="Flat B, 25/F, Highrise Mansion, Mid-Levels"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          City / Territory
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={shippingInfo.city}
                          onChange={handleFormChange}
                          placeholder="Hong Kong"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-slate-800"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Postal / ZIP Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          required
                          value={shippingInfo.postalCode}
                          onChange={handleFormChange}
                          placeholder="0000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Dynamic Shipping Selection */}
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Shipping Method
                      </label>
                      <select
                        name="shippingMethod"
                        value={shippingMethod}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-slate-700 font-semibold"
                      >
                        {region === "HK" ? (
                          <>
                            <option value="Standard Courier Delivery">
                              Standard Courier Delivery (Free)
                            </option>
                            <option value="Showroom Pickup - Central">
                              Showroom Pickup - Central, Hong Kong (Free)
                            </option>
                          </>
                        ) : (
                          <>
                            <option value="Standard Shipping">
                              Standard Shipping (Free)
                            </option>
                            <option value="Express Insured Delivery">
                              Express Insured Delivery (Flat $25)
                            </option>
                          </>
                        )}
                      </select>
                      {region === "HK" &&
                        shippingMethod === "Showroom Pickup - Central" && (
                          <div className="bg-primary/5 border border-primary/20 rounded-xl p-2.5 text-[9px] text-slate-600 font-medium leading-relaxed mt-1">
                            📍 <strong>Showroom Location:</strong> 18/F, Central
                            Tower, 28 Queen's Road Central, Hong Kong.
                            <br />
                            Hours: Mon-Sat 10:00 AM - 7:00 PM. Verification ID
                            required on collection.
                          </div>
                        )}
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Payment Mode
                      </label>
                      <select
                        name="paymentMethod"
                        value={shippingInfo.paymentMethod}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-slate-700 font-semibold"
                      >
                        {region === "HK" ? (
                          <>
                            <option value="Credit Card">
                              Credit Card (Visa / Mastercard) & Apple Pay
                            </option>
                            <option value="FPS">
                              FPS (Faster Payment System QR Code)
                            </option>
                            <option value="PayMe">
                              PayMe (by HSBC Wallet)
                            </option>
                            <option value="AlipayHK">AlipayHK Wallet</option>
                            <option value="WeChat Pay HK">
                              WeChat Pay HK Wallet
                            </option>
                            <option value="Bank Transfer">
                              Local Bank Wire Transfer
                            </option>
                          </>
                        ) : (
                          <>
                            <option value="Credit Card">
                              Credit Card (Visa / Mastercard / AMEX)
                            </option>
                            <option value="UPI">
                              UPI (Google Pay / Apple Pay)
                            </option>
                            <option value="Bank Transfer">
                              Bank Wire Transfer
                            </option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* Local Payment Details Block inside Form */}
                    {isCheckoutMode &&
                      region === "HK" &&
                      shippingInfo.paymentMethod === "FPS" && (
                        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 text-center space-y-3 animate-fade-in text-left">
                          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 justify-center">
                            <FaQrcode className="text-neutral-800" /> Faster
                            Payment System (FPS)
                          </h4>
                          <div className="flex justify-center py-2 bg-white rounded-xl border border-slate-100 max-w-[120px] mx-auto">
                            <svg
                              width="100"
                              height="100"
                              viewBox="0 0 100 100"
                              className="text-slate-800"
                            >
                              <rect width="100" height="100" fill="white" />
                              <path
                                d="M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z M5,75 h20 v20 h-20 z M10,80 h10 v10 h-10 z"
                                fill="currentColor"
                              />
                              <rect
                                x="35"
                                y="5"
                                width="5"
                                height="15"
                                fill="currentColor"
                              />
                              <rect
                                x="45"
                                y="10"
                                width="10"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="60"
                                y="5"
                                width="5"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="35"
                                y="25"
                                width="20"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="65"
                                y="25"
                                width="5"
                                height="15"
                                fill="currentColor"
                              />
                              <rect
                                x="5"
                                y="35"
                                width="15"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="25"
                                y="35"
                                width="5"
                                height="10"
                                fill="currentColor"
                              />
                              <rect
                                x="35"
                                y="40"
                                width="10"
                                height="15"
                                fill="currentColor"
                              />
                              <rect
                                x="50"
                                y="35"
                                width="15"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="75"
                                y="35"
                                width="20"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="80"
                                y="45"
                                width="10"
                                height="10"
                                fill="currentColor"
                              />
                              <rect
                                x="5"
                                y="55"
                                width="10"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="20"
                                y="50"
                                width="5"
                                height="15"
                                fill="currentColor"
                              />
                              <rect
                                x="55"
                                y="55"
                                width="15"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="35"
                                y="70"
                                width="15"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="60"
                                y="70"
                                width="10"
                                height="10"
                                fill="currentColor"
                              />
                              <rect
                                x="75"
                                y="75"
                                width="10"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="85"
                                y="85"
                                width="10"
                                height="10"
                                fill="currentColor"
                              />
                              <rect
                                x="32"
                                y="42"
                                width="36"
                                height="16"
                                rx="3"
                                fill="#1A1A1A"
                              />
                              <text
                                x="50"
                                y="53"
                                fill="white"
                                fontSize="8"
                                fontWeight="black"
                                textAnchor="middle"
                              >
                                FPS
                              </text>
                            </svg>
                          </div>
                          <p className="text-[9px] text-slate-500 text-center leading-relaxed">
                            Scan with your HK banking app to settle{" "}
                            <strong>
                              {formatConvertedPrice(getGrandTotal())}
                            </strong>{" "}
                            instantly.
                          </p>
                        </div>
                      )}

                    {isCheckoutMode &&
                      region === "HK" &&
                      shippingInfo.paymentMethod === "PayMe" && (
                        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 text-center space-y-3 animate-fade-in text-left">
                          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 justify-center">
                            <span className="h-4 w-4 bg-[#1A1A1A] rounded-full flex items-center justify-center text-[9px] font-black text-white">
                              P
                            </span>
                            HSBC PayMe App Integration
                          </h4>

                          {payMePaid ? (
                            <div className="flex items-center gap-2 justify-center bg-neutral-50 border border-neutral-200 py-2.5 rounded-xl">
                              <FaCheckCircle className="text-neutral-800 text-sm animate-pulse" />
                              <span className="text-[10px] text-neutral-800 font-bold uppercase tracking-wider">
                                PayMe Authorized Successfully
                              </span>
                            </div>
                          ) : payMeRedirecting ? (
                            <div className="flex flex-col items-center justify-center py-2 space-y-2">
                              <div className="h-4 w-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                                Launching PayMe Wallet...
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setPayMeRedirecting(true);
                                  setTimeout(() => {
                                    setPayMeRedirecting(false);
                                    setPayMePaid(true);
                                  }, 1500);
                                }}
                                className="w-full bg-[#1A1A1A] hover:bg-[#262626] text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                              >
                                Open PayMe to Pay{" "}
                                {formatConvertedPrice(getGrandTotal())}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                    {isCheckoutMode &&
                      region === "HK" &&
                      ["AlipayHK", "WeChat Pay HK"].includes(
                        shippingInfo.paymentMethod,
                      ) && (
                        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 text-center space-y-3 animate-fade-in text-left">
                          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 justify-center">
                            <FaQrcode className="text-neutral-800" />
                            {shippingInfo.paymentMethod} Wallet Scan
                          </h4>
                          <div className="flex justify-center py-2 bg-white rounded-xl border border-slate-100 max-w-[120px] mx-auto">
                            <svg
                              width="100"
                              height="100"
                              viewBox="0 0 100 100"
                              className="text-neutral-800"
                            >
                              <rect width="100" height="100" fill="white" />
                              <path
                                d="M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z M5,75 h20 v20 h-20 z M10,80 h10 v10 h-10 z"
                                fill="currentColor"
                              />
                              <rect
                                x="35"
                                y="5"
                                width="5"
                                height="15"
                                fill="currentColor"
                              />
                              <rect
                                x="45"
                                y="10"
                                width="10"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="60"
                                y="5"
                                width="5"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="35"
                                y="25"
                                width="20"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="65"
                                y="25"
                                width="5"
                                height="15"
                                fill="currentColor"
                              />
                              <rect
                                x="5"
                                y="35"
                                width="15"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="25"
                                y="35"
                                width="5"
                                height="10"
                                fill="currentColor"
                              />
                              <rect
                                x="35"
                                y="40"
                                width="10"
                                height="15"
                                fill="currentColor"
                              />
                              <rect
                                x="50"
                                y="35"
                                width="15"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="75"
                                y="35"
                                width="20"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="80"
                                y="45"
                                width="10"
                                height="10"
                                fill="currentColor"
                              />
                              <rect
                                x="5"
                                y="55"
                                width="10"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="20"
                                y="50"
                                width="5"
                                height="15"
                                fill="currentColor"
                              />
                              <rect
                                x="55"
                                y="55"
                                width="15"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="35"
                                y="70"
                                width="15"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="60"
                                y="70"
                                width="10"
                                height="10"
                                fill="currentColor"
                              />
                              <rect
                                x="75"
                                y="75"
                                width="10"
                                height="5"
                                fill="currentColor"
                              />
                              <rect
                                x="85"
                                y="85"
                                width="10"
                                height="10"
                                fill="currentColor"
                              />
                              <circle cx="50" cy="50" r="8" fill="#1A1A1A" />
                            </svg>
                          </div>
                          <p className="text-[9px] text-slate-500 text-center leading-relaxed">
                            Scan with your {shippingInfo.paymentMethod} app to
                            pay{" "}
                            <strong>
                              {formatConvertedPrice(getGrandTotal())}
                            </strong>
                            .
                          </p>
                        </div>
                      )}

                    {isCheckoutMode &&
                      shippingInfo.paymentMethod === "Credit Card" && (
                        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3 animate-fade-in text-left">
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                Card Number
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="4111  1111  1111  1111"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] focus:outline-none text-slate-800 font-semibold"
                                />
                                <FaCreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  placeholder="MM / YY"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] focus:outline-none text-slate-800 font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  Security CVV
                                </label>
                                <input
                                  type="text"
                                  placeholder="123"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] focus:outline-none text-slate-800 font-semibold"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* High-Ticket DPMS Compliance KYC Verification Form */}
                    {isKycRequired && (
                      <div className="border border-neutral-200 bg-neutral-50/50 rounded-2xl p-4 text-left space-y-3 animate-fade-in">
                        <h4 className="text-neutral-800 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          ⚠️ DPMS Legal Compliance Verification
                        </h4>
                        <p className="text-[9px] text-neutral-500 leading-relaxed font-light">
                          Anti-money laundering laws in HK require customer ID
                          verification for transactions of{" "}
                          <strong>HK$ 120,000</strong> or above. Please upload
                          your document to proceed.
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                              Document Type
                            </label>
                            <select
                              value={kycDocType}
                              onChange={(e) => setKycDocType(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none text-slate-700 font-semibold"
                            >
                              <option value="HKID">Hong Kong ID (HKID)</option>
                              <option value="Passport">Passport</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                              Document Number
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
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none text-slate-800 font-semibold"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                            Upload Copy
                          </label>
                          {kycSimulating ? (
                            <div className="bg-white border border-slate-200 rounded-xl p-3 text-center flex flex-col items-center justify-center space-y-1.5">
                              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-[9px] text-slate-400 font-medium">
                                Encrypting file securely...
                              </span>
                            </div>
                          ) : !kycFile ? (
                            <div
                              onClick={() =>
                                document
                                  .getElementById("kyc-file-input")
                                  .click()
                              }
                              className="border-2 border-dashed border-slate-300 hover:border-primary/60 hover:bg-white/80 transition-all rounded-xl p-3 text-center cursor-pointer flex flex-col items-center justify-center space-y-1"
                            >
                              <FaUpload className="text-slate-400 text-xs" />
                              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                                Tap to upload copy (ID/Passport)
                              </span>
                              <input
                                id="kyc-file-input"
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={handleKycUpload}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-[9px] text-neutral-800 font-bold">
                              <span className="truncate max-w-[180px]">
                                📄 {kycFile}
                              </span>
                              <button
                                type="button"
                                onClick={() => setKycFile("")}
                                className="text-neutral-500 hover:text-neutral-800 font-black uppercase text-[8px]"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>

                        {kycFile && kycDocNum.trim().length > 0 && (
                          <div className="flex items-center gap-1.5 text-[9px] text-neutral-800 font-bold uppercase tracking-wider mt-1 pl-1">
                            <FaCheckCircle className="text-neutral-800" />{" "}
                            Identity copy verified and encrypted
                          </div>
                        )}
                      </div>
                    )}
                  </form>
                )}
              </div>

              {/* Drawer Footer Price details */}
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5 space-y-4">
                {/* Promo Code verification */}
                {!isCheckoutMode && (
                  <>
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Promo Code (PRAYA10)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 pl-8 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-slate-800 placeholder:text-slate-400 font-semibold"
                        />
                        <FaGift className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Apply
                      </button>
                      {/* Error/Success Promo responses */}
                    </form>
                    {promoError && (
                      <p className="text-[10px] text-neutral-800 font-semibold text-left">
                        {promoError}
                      </p>
                    )}
                    {promoSuccess && (
                      <p className="text-[10px] text-neutral-800 font-bold text-left">
                        {promoSuccess}
                      </p>
                    )}
                  </>
                )}

                {/* Applied Code Summary */}
                {appliedCoupon && (
                  <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-800 font-semibold">
                      <FaCheckCircle size={12} className="text-neutral-800" />
                      Code: {appliedCoupon.code} (
                      {appliedCoupon.discountPercent}% Off)
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Pricing totals */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex justify-between text-xs text-left">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="font-extrabold text-slate-800">
                      {formatConvertedPrice(getCartSubtotal())}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-xs text-neutral-800 text-left font-bold">
                      <span className="font-medium">Discount</span>
                      <span className="font-extrabold">
                        -${formatConvertedPrice(getDiscountAmount())}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-left">
                    <span className="text-slate-500 font-medium">
                      Estimated Tax (
                      {region === "HK"
                        ? "0% GST/VAT"
                        : `${region === "AU" ? "10% GST" : "15% GST"}`}
                      )
                    </span>
                    <span className="font-extrabold text-slate-800">
                      {region === "HK"
                        ? "Free"
                        : formatConvertedPrice(getTaxAmount())}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-left">
                    <span className="text-slate-500 font-medium">
                      Shipping Fee ({shippingMethod})
                    </span>
                    <span className="font-bold text-neutral-800 uppercase">
                      {getShippingFee() === 0
                        ? "Free"
                        : formatConvertedPrice(
                            Math.round(
                              getShippingFee() * (region === "AU" ? 1.5 : 1.6),
                            ),
                          )}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-slate-200/80 pt-3 text-left">
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      Estimated Total
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {formatConvertedPrice(getGrandTotal())}
                    </span>
                  </div>
                </div>

                {/* Main drawer button */}
                {!isCheckoutMode ? (
                  <button
                    onClick={() => setIsCheckoutMode(true)}
                    className="w-full btn-teal py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs border-0"
                  >
                    <FaLock size={12} /> Secure Checkout Flow
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCheckoutMode(false)}
                      className="flex-1 py-4 border border-slate-200 hover:bg-slate-50 bg-white rounded-xl text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isKycRequired && !isKycCompleted}
                      className={`flex-[2] py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm border-0 ${
                        isKycRequired && !isKycCompleted
                          ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                          : "btn-gold text-white"
                      }`}
                    >
                      {isKycRequired && !isKycCompleted
                        ? "KYC Verification Required"
                        : "Confirm Inquiry"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
