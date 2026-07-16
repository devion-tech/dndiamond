"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Layout from "@/components/layout/Layout";
import { useStore } from "@/context/StoreContext";
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setSelectedAddress,
} from "@/redux/addressSlice";
import { createOrder } from "@/redux/orderSlice";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  FaLock,
  FaCheckCircle,
  FaArrowLeft,
  FaGift,
  FaShieldAlt,
  FaGem,
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";

const addressSchema = yup.object({
  first_name: yup
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  last_name: yup
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  mobile: yup
    .string()
    .trim()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email")
    .required("Email is required"),
  country: yup
    .string()
    .trim()
    .min(2, "Country must be at least 2 characters")
    .required("Country is required"),
  state: yup
    .string()
    .trim()
    .min(2, "State must be at least 2 characters")
    .required("State is required"),
  city: yup
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .required("City is required"),
  address_line_1: yup
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .required("Address is required"),
  address_line_2: yup.string().trim().default(""),
  landmark: yup.string().trim().default(""),
  postal_code: yup
    .string()
    .trim()
    .matches(/^\d{4,6}$/, "Postal code must be 4-6 digits")
    .required("Postal code is required"),
});

const emptyAddress = {
  first_name: "",
  last_name: "",
  mobile: "",
  email: "",
  country: "",
  state: "",
  city: "",
  address_line_1: "",
  address_line_2: "",
  landmark: "",
  postal_code: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    cart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    getCartSubtotal,
    getDiscountAmount,
    getCartTotal,
    region,
    formatConvertedPrice,
    getTaxAmount,
    formatPrice,
    token,
    setAuthModalOpen,
  } = useStore();

  const {
    items: addresses,
    loading: addressesLoading,
    saving: savingAddress,
    updating: updatingAddress,
    deleting: deleting,
    selectedAddressId,
  } = useSelector((state) => state.address);

  const { placing: placingOrder } = useSelector((state) => state.order);

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [newAddress, setNewAddress] = useState({ ...emptyAddress });
  const [fieldErrors, setFieldErrors] = useState({});
  const [editingAddress, setEditingAddress] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (!addressesLoading) {
      setShowAddressForm(addresses.length === 0);
    }
  }, [addresses, addressesLoading]);

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

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

  const handleAddressFieldChange = async (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    try {
      await yup.reach(addressSchema, name).validate(value);
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err) {
      setFieldErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const handleAddressBlur = async (name) => {
    try {
      await yup.reach(addressSchema, name).validate(newAddress[name]);
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err) {
      setFieldErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      await addressSchema.validate(newAddress, { abortEarly: false });
      setFieldErrors({});
    } catch (err) {
      const errors = {};
      err.inner.forEach((e) => {
        if (!errors[e.path]) errors[e.path] = e.message;
      });
      setFieldErrors(errors);
      return;
    }

    if (editingAddress) {
      const result = await dispatch(
        updateAddress({ id: editingAddress._id, addressData: newAddress }),
      );
      if (updateAddress.fulfilled.match(result)) {
        toast.success("Address updated successfully");
        setNewAddress({ ...emptyAddress });
        setEditingAddress(null);
        setShowAddressForm(false);
        dispatch(fetchAddresses());
      } else {
        toast.error(result.payload || "Failed to update address");
      }
    } else {
      const result = await dispatch(addAddress(newAddress));
      if (addAddress.fulfilled.match(result)) {
        toast.success("Address saved successfully");
        setNewAddress({ ...emptyAddress });
        setShowAddressForm(false);
        dispatch(fetchAddresses());
      } else {
        toast.error(result.payload || "Failed to save address");
      }
    }
  };

  const getSelectedAddress = () => {
    return addresses.find((a) => a._id === selectedAddressId) || null;
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setNewAddress({
      first_name: addr.first_name || "",
      last_name: addr.last_name || "",
      mobile: addr.mobile || "",
      email: addr.email || "",
      country: addr.country || "",
      state: addr.state || "",
      city: addr.city || "",
      address_line_1: addr.address_line_1 || "",
      address_line_2: addr.address_line_2 || "",
      landmark: addr.landmark || "",
      postal_code: addr.postal_code || "",
    });
    setFieldErrors({});
    setShowAddressForm(true);
  };

  const handleDeleteClick = (addrId) => {
    setDeletingAddressId(addrId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAddressId) return;
    const result = await dispatch(deleteAddress(deletingAddressId));
    if (deleteAddress.fulfilled.match(result)) {
      toast.success("Address deleted successfully");
    } else {
      toast.error(result.payload || "Failed to delete address");
    }
    setShowDeleteModal(false);
    setDeletingAddressId(null);
  };

  const handleCancelForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setNewAddress({ ...emptyAddress });
    setFieldErrors({});
  };

  const getShippingFee = () => 0;

  const getGrandTotal = () => {
    return getCartTotal() + getShippingFee();
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const addr = getSelectedAddress();
    if (!addr) {
      toast.error("Please select or add a shipping address");
      return;
    }

    const result = await dispatch(
      createOrder({
        address_id: addr._id,
        promo_code: appliedCoupon?.code || "",
        notes: "",
      }),
    );

    if (createOrder.fulfilled.match(result)) {
      router.push("/success");
    } else {
      toast.error(result.payload || "Failed to place order");
    }
  };

  const inputClass = (fieldName) =>
    `w-full bg-slate-50 border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 transition-all text-slate-800 font-medium ${fieldErrors[fieldName]
      ? "border-red-500 focus:ring-red-500"
      : "border-slate-200 focus:ring-neutral-900 focus:bg-white"
    }`;

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
    <>
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
              {/* Left Side: Address Section */}
              <div className="lg:col-span-7 space-y-8">
                <form onSubmit={handlePlaceOrder} className="space-y-8">
                  {/* Shipping Address Card */}
                  <div className="bg-white border border-slate-100 shadow-md rounded-3xl p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                      <span className="h-6 w-6 rounded-full bg-neutral-900 text-white font-bold text-[10px] flex items-center justify-center">
                        1
                      </span>
                      <h2 className="font-serif text-lg tracking-wide text-slate-800">
                        Shipping Address
                      </h2>
                    </div>

                    {addressesLoading ? (
                      <div className="flex flex-col items-center justify-center py-10 space-y-3">
                        <div className="h-6 w-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Loading saved addresses...
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* Saved Addresses List */}
                        {addresses.length > 0 && !showAddressForm && (
                          <div className="space-y-3">
                            {addresses.map((addr) => (
                              <label
                                key={addr._id}
                                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${selectedAddressId === addr._id
                                  ? "border-neutral-900 bg-neutral-50"
                                  : "border-slate-200 hover:border-slate-400 bg-white"
                                  }`}
                              >
                                <input
                                  type="radio"
                                  name="selectedAddress"
                                  value={addr._id}
                                  checked={selectedAddressId === addr._id}
                                  onChange={() =>
                                    dispatch(setSelectedAddress(addr._id))
                                  }
                                  className="mt-1 accent-neutral-900"
                                />
                                <div className="flex-1 text-left">
                                  <p className="text-xs font-bold text-slate-800">
                                    {addr.first_name} {addr.last_name}
                                  </p>
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    {addr.address_line_1}
                                    {addr.address_line_2
                                      ? `, ${addr.address_line_2}`
                                      : ""}
                                    {addr.landmark ? `, ${addr.landmark}` : ""}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    {addr.city}, {addr.state}, {addr.country} -{" "}
                                    {addr.postal_code}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-1">
                                    {addr.mobile} | {addr.email}
                                  </p>
                                </div>
                                <div className="flex flex-col items-center gap-2 shrink-0">
                                  <FaMapMarkerAlt
                                    className={`text-sm ${selectedAddressId === addr._id
                                      ? "text-neutral-900"
                                      : "text-slate-300"
                                      }`}
                                  />
                                  <div className="flex gap-1">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleEditAddress(addr);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-neutral-900 transition-colors cursor-pointer bg-transparent border-0"
                                      title="Edit address"
                                    >
                                      <FaEdit size={12} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDeleteClick(addr._id);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer bg-transparent border-0"
                                      title="Delete address"
                                    >
                                      <FaTrashAlt size={12} />
                                    </button>
                                  </div>
                                </div>
                              </label>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                setEditingAddress(null);
                                setNewAddress({ ...emptyAddress });
                                setShowAddressForm(true);
                                setFieldErrors({});
                              }}
                              className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-slate-300 hover:border-neutral-900 rounded-2xl text-xs font-bold text-slate-500 hover:text-neutral-900 transition-all cursor-pointer bg-transparent"
                            >
                              <FaPlus size={10} /> Add New Address
                            </button>
                          </div>
                        )}

                        {/* Address Form */}
                        {showAddressForm && (
                          <div className="space-y-4 animate-fade-in">
                            {addresses.length > 0 && (
                              <button
                                type="button"
                                onClick={handleCancelForm}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-neutral-900 uppercase tracking-wider cursor-pointer bg-transparent border-0"
                              >
                                <FaArrowLeft size={8} /> Cancel
                              </button>
                            )}

                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                              {editingAddress
                                ? "Edit Address"
                                : "Add New Address"}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col text-left space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  First Name *
                                </label>
                                <input
                                  type="text"
                                  name="first_name"
                                  value={newAddress.first_name}
                                  onChange={handleAddressFieldChange}
                                  onBlur={() => handleAddressBlur("first_name")}
                                  placeholder="John"
                                  className={inputClass("first_name")}
                                />
                                {fieldErrors.first_name && (
                                  <p className="text-[10px] text-red-500 mt-1">
                                    {fieldErrors.first_name}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col text-left space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  Last Name *
                                </label>
                                <input
                                  type="text"
                                  name="last_name"
                                  value={newAddress.last_name}
                                  onChange={handleAddressFieldChange}
                                  onBlur={() => handleAddressBlur("last_name")}
                                  placeholder="Doe"
                                  className={inputClass("last_name")}
                                />
                                {fieldErrors.last_name && (
                                  <p className="text-[10px] text-red-500 mt-1">
                                    {fieldErrors.last_name}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col text-left space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  Mobile Number *
                                </label>
                                <input
                                  type="tel"
                                  name="mobile"
                                  value={newAddress.mobile}
                                  onChange={handleAddressFieldChange}
                                  onBlur={() => handleAddressBlur("mobile")}
                                  placeholder="9876543210"
                                  className={inputClass("mobile")}
                                />
                                {fieldErrors.mobile && (
                                  <p className="text-[10px] text-red-500 mt-1">
                                    {fieldErrors.mobile}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col text-left space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  Email Address *
                                </label>
                                <input
                                  type="email"
                                  name="email"
                                  value={newAddress.email}
                                  onChange={handleAddressFieldChange}
                                  onBlur={() => handleAddressBlur("email")}
                                  placeholder="john@example.com"
                                  className={inputClass("email")}
                                />
                                {fieldErrors.email && (
                                  <p className="text-[10px] text-red-500 mt-1">
                                    {fieldErrors.email}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col text-left space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  Country *
                                </label>
                                <input
                                  type="text"
                                  name="country"
                                  value={newAddress.country}
                                  onChange={handleAddressFieldChange}
                                  onBlur={() => handleAddressBlur("country")}
                                  placeholder="India"
                                  className={inputClass("country")}
                                />
                                {fieldErrors.country && (
                                  <p className="text-[10px] text-red-500 mt-1">
                                    {fieldErrors.country}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col text-left space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  State *
                                </label>
                                <input
                                  type="text"
                                  name="state"
                                  value={newAddress.state}
                                  onChange={handleAddressFieldChange}
                                  onBlur={() => handleAddressBlur("state")}
                                  placeholder="Maharashtra"
                                  className={inputClass("state")}
                                />
                                {fieldErrors.state && (
                                  <p className="text-[10px] text-red-500 mt-1">
                                    {fieldErrors.state}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col text-left space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  City *
                                </label>
                                <input
                                  type="text"
                                  name="city"
                                  value={newAddress.city}
                                  onChange={handleAddressFieldChange}
                                  onBlur={() => handleAddressBlur("city")}
                                  placeholder="Mumbai"
                                  className={inputClass("city")}
                                />
                                {fieldErrors.city && (
                                  <p className="text-[10px] text-red-500 mt-1">
                                    {fieldErrors.city}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col text-left space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  Postal Code *
                                </label>
                                <input
                                  type="text"
                                  name="postal_code"
                                  value={newAddress.postal_code}
                                  onChange={handleAddressFieldChange}
                                  onBlur={() =>
                                    handleAddressBlur("postal_code")
                                  }
                                  placeholder="400001"
                                  className={inputClass("postal_code")}
                                />
                                {fieldErrors.postal_code && (
                                  <p className="text-[10px] text-red-500 mt-1">
                                    {fieldErrors.postal_code}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col text-left space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Address Line 1 *
                              </label>
                              <input
                                type="text"
                                name="address_line_1"
                                value={newAddress.address_line_1}
                                onChange={handleAddressFieldChange}
                                onBlur={() =>
                                  handleAddressBlur("address_line_1")
                                }
                                placeholder="123 Main Street"
                                className={inputClass("address_line_1")}
                              />
                              {fieldErrors.address_line_1 && (
                                <p className="text-[10px] text-red-500 mt-1">
                                  {fieldErrors.address_line_1}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col text-left space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Address Line 2
                              </label>
                              <input
                                type="text"
                                name="address_line_2"
                                value={newAddress.address_line_2}
                                onChange={handleAddressFieldChange}
                                placeholder="Apartment 4B (optional)"
                                className={inputClass("address_line_2")}
                              />
                            </div>

                            <div className="flex flex-col text-left space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Landmark
                              </label>
                              <input
                                type="text"
                                name="landmark"
                                value={newAddress.landmark}
                                onChange={handleAddressFieldChange}
                                placeholder="Near Central Mall (optional)"
                                className={inputClass("landmark")}
                              />
                            </div>

                            <button
                              type="button"
                              onClick={handleSaveAddress}
                              disabled={savingAddress}
                              className={`w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all border-0 ${savingAddress
                                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                : "bg-neutral-900 text-white hover:bg-neutral-800"
                                }`}
                            >
                              {savingAddress ? (
                                <>
                                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  {editingAddress
                                    ? "Updating Address..."
                                    : "Saving Address..."}
                                </>
                              ) : (
                                <>
                                  <FaMapMarkerAlt />{" "}
                                  {editingAddress
                                    ? "Update Address"
                                    : "Save Address"}
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Confirm order button */}
                  {!showAddressForm && selectedAddressId && (
                    <button
                      type="submit"
                      disabled={addressesLoading || !selectedAddressId || placingOrder}
                      className={`w-full py-4.5 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all border-0 ${addressesLoading || !selectedAddressId || placingOrder
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-neutral-900 text-white hover:bg-neutral-800 hover:scale-[1.01]"
                        }`}
                    >
                      {placingOrder ? (
                        <>
                          <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <FaLock />{" "}
                          {addressesLoading
                            ? "Loading..."
                            : `Confirm inquiry & place order • ${formatConvertedPrice(
                              getGrandTotal(),
                            )}`}
                        </>
                      )}
                    </button>
                  )}
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
                      <div
                        key={index}
                        className="flex gap-4 py-3 first:pt-0 last:pb-0"
                      >
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
                  {/* <div className="border-t border-slate-100 pt-4 space-y-3">
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
                          Code: {appliedCoupon.code} (
                          {appliedCoupon.discountPercent}% Off)
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
                  </div> */}

                  {/* Bill details */}
                  <div className="border-t border-slate-100 pt-4 space-y-2 text-left text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">
                        Subtotal
                      </span>
                      <span className="font-extrabold text-slate-800">
                        {formatConvertedPrice(getCartSubtotal())}
                      </span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between font-bold text-lime-600">
                        <span className="font-medium">Discount Code</span>
                        <span>
                          -${formatConvertedPrice(getDiscountAmount())}
                        </span>
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
                        {region === "HK"
                          ? "Free"
                          : formatConvertedPrice(getTaxAmount())}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">
                        Shipping
                      </span>
                      <span className="font-bold text-slate-800">Free</span>
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
                        <div className="text-slate-600 mt-0.5">
                          {badge.icon}
                        </div>
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

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingAddressId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        loading={deleting}
      />
    </>
  );
}
