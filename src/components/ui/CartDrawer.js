"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import Link from "next/link";

export default function CartDrawer({ isOpen, onClose }) {
  const router = useRouter();
  const {
    cart,
    totalItems,
    updateQuantity,
    removeFromCart,
    appliedCoupon,
    applyCouponCode,
    getCartSubtotal,
    getDiscountAmount,
    getCartTotal,
    checkoutOrder,
    region,
    formatPrice,
    formatConvertedPrice,
    getTaxAmount,
    token,
    openModal,
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

  // const handleApplyPromo = (e) => {
  //   e.preventDefault();
  //   setPromoError("");
  //   setPromoSuccess("");

  //   if (promoCode.trim() === "") return;

  //   const res = applyCouponCode(promoCode);
  //   if (res.success) {
  //     setPromoSuccess(res.message);
  //     setPromoCode("");
  //   } else {
  //     setPromoError(res.message);
  //   }
  // };

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

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col glass-drawer">
          {/* Drawer Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex flex-col text-left">
              <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-800 uppercase">
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
          {cart?.items?.length === 0 ? (
            // Empty State
            <div className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-4">
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
              <Link href="/shop" onClick={onClose}>
                <button className="bg-neutral-900 text-white border border-neutral-900 hover:bg-white hover:text-neutral-900 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-300">
                  Browse Collections
                </button>
              </Link>
            </div>
          ) : (
            // Content State
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Drawer Body Scroll */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                {!isCheckoutMode ? (
                  // Item List
                  cart?.items?.map((item, index) => (
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
                        <span className="text-xs font-extrabold text-black">
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
                            <option value="Showroom Pickup - T.S.T Office">
                              Showroom Pickup - T.S.T Office, Hong Kong (Free)
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
                        shippingMethod === "Showroom Pickup - T.S.T Office" && (
                          <div className="bg-primary/5 border border-primary/20 rounded-xl p-2.5 text-[9px] text-slate-600 font-medium leading-relaxed mt-1">
                            📍 <strong>Showroom Location:</strong> Unit 303,
                            3/F, Chevalier House, 45–51 Chatham Road, T.S.T,
                            Kln., Hong Kong.
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
                  </form>
                )}
              </div>

              {/* Drawer Footer Price details */}
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5 space-y-4">
                {/* Promo Code verification */}
                {/* {!isCheckoutMode && (
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
                )} */}

                {/* Applied Code Summary */}
                {/* {appliedCoupon && (
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
                )} */}

                {/* Pricing totals */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex justify-between text-xs text-left">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="font-extrabold text-slate-800">
                      {formatConvertedPrice(cart?.subtotal)}
                    </span>
                  </div>
                  {/* {appliedCoupon && (
                    <div className="flex justify-between text-xs text-neutral-800 text-left font-bold">
                      <span className="font-medium">Discount</span>
                      <span className="font-extrabold">
                        -${formatConvertedPrice(getDiscountAmount())}
                      </span>
                    </div>
                  )} */}

                  {/* <div className="flex justify-between text-xs text-left">
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
                  </div> */}

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
                    <span className="text-base font-extrabold text-black">
                      {formatConvertedPrice(cart?.subtotal || 0)}
                    </span>
                  </div>
                </div>

                {/* Main drawer button */}
                <button
                  onClick={() => {
                    if (!token) {
                      onClose();
                      openModal();
                      return;
                    }
                    router.push("/checkout");
                    onClose();
                  }}
                  className="w-full bg-neutral-900 text-white border border-neutral-900 hover:bg-white hover:text-neutral-900 py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all duration-300"
                >
                  <FaLock size={12} /> Proceed to Secure Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
