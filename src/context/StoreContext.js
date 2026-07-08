"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initialJewelry,
  initialDiamonds,
  initialCoupons,
} from "../data/initialData";
import {
  initializeAuth,
  loginUser as loginUserThunk,
  registerUser as registerUserThunk,
  logoutUser as logoutUserThunk,
} from "@/redux/authSlice";
import {
  fetchCart,
  addToCart as addToCartThunk,
  updateCart as updateCartThunk,
  deleteCart as deleteCartThunk,
  clearCart as clearCartThunk,
} from "@/redux/cartSlice";
import {
  fetchWishlist,
  toggleWishlist as toggleWishlistThunk,
} from "@/redux/wishlistSlice";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const dispatch = useDispatch();

  const [jewelry, setJewelry] = useState([]);
  const [diamonds, setDiamonds] = useState([]);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [goldPricePerGram, setGoldPricePerGram] = useState(75.0);

  const [inquiries, setInquiries] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [region, setRegion] = useState("HK"); // "HK", "AU", "NZ"

  // Redux bindings
  const { token, user, guestId } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist.items);
  const wishlistTotal = useSelector((state) => state.wishlist.total);

  // Dynamic price calculation formula
  const calculatePrice = (item, metalType, caratWeight) => {
    let metalMultiplier = 1.0;
    if (metalType === "18K Gold") metalMultiplier = 0.75;
    else if (metalType === "14K Gold") metalMultiplier = 0.58;
    else if (metalType === "Platinum") metalMultiplier = 1.35;

    const goldVal = (item.goldWeight || 0) * metalMultiplier * goldPricePerGram;

    let gemMultiplier = 1.0;
    if (caratWeight) {
      const baseCarat = item.diamondWeight ? item.diamondWeight[0] : 0.5;
      gemMultiplier = Math.pow(caratWeight / (baseCarat || 0.5), 1.8);
    }
    const gemVal = (item.diamondPrice || 0) * gemMultiplier;
    const laborVal = item.makingCharges || 0;

    const baseVal = Math.round(goldVal + gemVal + laborVal);
    const discountModifier = item.discount
      ? baseVal * (item.discount / 100)
      : 0;

    return Math.round(baseVal - discountModifier);
  };

  // Hydrate states and initialize Auth on mount
  useEffect(() => {
    const storedInquiries = localStorage.getItem("praya_inquiries");
    const storedGoldPrice = localStorage.getItem("praya_goldPrice");
    const storedRegion = localStorage.getItem("praya_region");

    if (storedInquiries) setInquiries(JSON.parse(storedInquiries));
    if (storedGoldPrice) setGoldPricePerGram(Number(storedGoldPrice));
    if (storedRegion) setRegion(storedRegion || "HK");

    // Dispatch initialize auth, then load cart & wishlist
    dispatch(initializeAuth()).then((res) => {
      const payload = res.payload;
      if (payload) {
        dispatch(fetchCart({ guestId: payload.guestId }));
        dispatch(fetchWishlist({ token: payload.token }));
      }
    });
  }, [dispatch]);

  const saveInquiries = (newInquiries) => {
    setInquiries(newInquiries);
    localStorage.setItem("praya_inquiries", JSON.stringify(newInquiries));
  };

  const saveRegion = (newRegion) => {
    setRegion(newRegion);
    localStorage.setItem("praya_region", newRegion);
  };

  const getRegionDetails = () => {
    switch (region) {
      case "AU":
        return {
          prefix: "A$",
          multiplier: 1.5,
          taxRate: 0.1,
          label: "Australia (AUD)",
        };
      case "NZ":
        return {
          prefix: "NZ$",
          multiplier: 1.6,
          taxRate: 0.15,
          label: "New Zealand (NZD)",
        };
      case "HK":
      default:
        return {
          prefix: "HK$",
          multiplier: 1,
          taxRate: 0.0,
          label: "Hong Kong (HKD)",
        };
    }
  };

  const getConvertedPrice = (basePrice) => {
    const { multiplier } = getRegionDetails();
    return Math.round(basePrice * multiplier);
  };

  const formatPrice = (basePrice) => {
    const { prefix } = getRegionDetails();
    const converted = getConvertedPrice(basePrice);
    return `${prefix} ${converted.toLocaleString()}`;
  };

  const formatConvertedPrice = (convertedPrice) => {
    const { prefix } = getRegionDetails();
    return `${prefix} ${convertedPrice.toLocaleString()}`;
  };

  // --- Cart Redux Wrapper ---
  const addToCart = async (product, selectedOptions, finalPrice) => {
    dispatch(
      addToCartThunk({
        guestId,
        productId: product.id,
        quantity: 1,
        selectedOptions,
        token,
      }),
    );
  };

  const removeFromCart = async (cartId) => {
    dispatch(
      deleteCartThunk({
        guestId,
        itemId: cartId,
        token,
      }),
    );
  };

  const updateQuantity = async (cartId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(cartId);
      return;
    }
    dispatch(
      updateCartThunk({
        guestId,
        itemId: cartId,
        quantity,
        token,
      }),
    );
  };

  const clearCart = async () => {
    dispatch(
      clearCartThunk({
        guestId,
        token,
      }),
    );
    setAppliedCoupon(null);
  };

  // --- Wishlist Redux Wrapper ---
  const toggleWishlist = async (product) => {
    dispatch(
      toggleWishlistThunk({
        product,
        token,
      }),
    );
  };

  const isWishlisted = (id) => wishlist?.some((item) => item.id === id);

  // --- Inquiries Actions ---
  const submitInquiry = (inquiryData) => {
    const newInquiry = {
      id: `INQ-${Math.floor(700 + Math.random() * 200)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Received",
      ...inquiryData,
    };
    const updated = [newInquiry, ...inquiries];
    saveInquiries(updated);
    return newInquiry;
  };

  // --- Checkout Actions ---
  const checkoutOrder = (shippingInfo) => {
    const orderId = `ORD-${Math.floor(900 + Math.random() * 100)}`;
    const orderTotal = getCartTotal();

    const order = {
      id: orderId,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      items: cart?.items,
      totalAmount: orderTotal,
      paymentMethod: shippingInfo.paymentMethod,
      customerName: shippingInfo.name,
      email: shippingInfo.email,
      phone: shippingInfo.phone,
      address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}`,
      appliedCouponCode: appliedCoupon ? appliedCoupon.code : null,
      discountAmount: getDiscountAmount(),
    };

    const storedOrders = localStorage.getItem("praya_orders") || "[]";
    const orders = JSON.parse(storedOrders);
    orders.unshift(order);
    localStorage.setItem("praya_orders", JSON.stringify(orders));

    clearCart();
    return order;
  };

  // --- User Auth Redux Wrapper ---
  const registerUser = async (name, email, phone, password) => {
    const result = await dispatch(
      registerUserThunk({ name, email, phone, password }),
    );
    if (registerUserThunk.fulfilled.match(result)) {
      return { success: true };
    }
    return { success: false, message: result.payload || "Registration failed" };
  };

  const loginUser = async (email, password) => {
    const result = await dispatch(loginUserThunk({ email, password }));
    if (loginUserThunk.fulfilled.match(result)) {
      const authState = result.payload;
      // Trigger cart merge and fetches
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}/api/cart/merge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify({ guest_id: guestId }),
        },
      );
      dispatch(fetchCart({ guestId }));
      dispatch(fetchWishlist({ token: authState.token }));
      return { success: true };
    }
    return {
      success: false,
      message: result.payload || "Authentication failed",
    };
  };

  const logoutUser = () => {
    dispatch(logoutUserThunk());
    dispatch(fetchCart({ guestId }));
    dispatch(fetchWishlist({ token: null }));
  };

  // --- Coupon Actions ---
  const applyCouponCode = (code) => {
    const coupon = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive,
    );
    if (!coupon)
      return { success: false, message: "Invalid or inactive promo code." };

    const subtotal = cart?.subtotal || 0;
    if (subtotal < coupon.minOrderValue) {
      return {
        success: false,
        message: `Minimum order value of $${coupon.minOrderValue} required for this coupon.`,
      };
    }

    setAppliedCoupon(coupon);
    return {
      success: true,
      message: `Coupon Applied: ${coupon.discountPercent}% Off!`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // --- Subtotal & Pricing Aggregators ---
  const getCartSubtotal = () => {
    const baseSub = cart?.subtotal || 0;
    return getConvertedPrice(baseSub);
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getCartSubtotal();
    return Math.round(subtotal * (appliedCoupon.discountPercent / 100));
  };

  const getTaxAmount = () => {
    const { taxRate } = getRegionDetails();
    const taxable = getCartSubtotal() - getDiscountAmount();
    return Math.round(taxable * taxRate);
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const discount = getDiscountAmount();
    const tax = getTaxAmount();
    return Math.max(0, subtotal - discount + tax);
  };
  console.log("cart :>> ", cart);

  return (
    <StoreContext.Provider
      value={{
        jewelry,
        diamonds,
        coupons,
        goldPricePerGram,
        cart: cart?.items || [],
        totalItems: cart?.total_items || 0,
        wishlist,
        wishlistTotal,
        inquiries,
        appliedCoupon,
        region,
        guestId,
        user,
        token,
        saveRegion,
        getRegionDetails,
        getConvertedPrice,
        formatPrice,
        formatConvertedPrice,
        getTaxAmount,
        calculatePrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        submitInquiry,
        checkoutOrder,
        applyCouponCode,
        removeCoupon,
        getCartSubtotal,

        getDiscountAmount,
        getCartTotal,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
}
