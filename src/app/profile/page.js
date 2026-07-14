"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { useStore } from "@/context/StoreContext";
import { fetchAddresses, addAddress } from "@/redux/addressSlice";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useStore();
  const { items: addresses, loading: addressesLoading, saving: savingAddress } = useSelector((state) => state.address);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    dispatch(fetchAddresses());
  }, [user, router, dispatch]);

  if (!user) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.mobile ||
      !formData.email ||
      !formData.country ||
      !formData.state ||
      !formData.city ||
      !formData.address_line_1 ||
      !formData.postal_code
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const res = await dispatch(addAddress(formData)).unwrap();
      if (res) {
        toast.success("Address added successfully!");
        setShowForm(false);
        setFormData({
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
        });
      }
    } catch (err) {
      toast.error(err || "Failed to add address.");
    }
  };

  return (
    <Layout>
      <div className="bg-[#FAF9F6] min-h-screen py-10 md:py-16 px-4 md:px-8 font-sans text-neutral-800">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-left space-y-2 pb-6 border-b border-neutral-200">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] block">
              Atelier Member Portal
            </span>
            <h1 className="text-3xl font-serif font-light text-neutral-900 uppercase tracking-widest text-left">
              My Profile
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: User Details Card (5/12 cols) */}
            <div className="lg:col-span-5 bg-white border border-neutral-100 shadow-sm rounded-2xl p-6 md:p-8 space-y-6">
              <h2 className="font-serif text-lg text-neutral-900 tracking-wide border-b border-neutral-100 pb-3 text-left">
                Account Details
              </h2>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 shrink-0">
                    <FaUser size={13} />
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-400 uppercase font-bold tracking-wider block">Full Name</span>
                    <span className="text-xs font-semibold text-neutral-800">{user.name || "Anonymous Member"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 shrink-0">
                    <FaEnvelope size={13} />
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-400 uppercase font-bold tracking-wider block">Email Address</span>
                    <span className="text-xs font-semibold text-neutral-800 truncate block max-w-[200px] md:max-w-xs">{user.email}</span>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 shrink-0">
                      <FaPhone size={13} />
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase font-bold tracking-wider block">Phone Number</span>
                      <span className="text-xs font-semibold text-neutral-800">{user.phone}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-neutral-100 text-left">
                <p className="text-[10px] text-neutral-400 italic font-light">
                  Need to update your contact details or password? Please coordinate directly with your dedicated DN concierge representative.
                </p>
              </div>
            </div>

            {/* Right: Addresses section (7/12 cols) */}
            <div className="lg:col-span-7 bg-white border border-neutral-100 shadow-sm rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <h2 className="font-serif text-lg text-neutral-900 tracking-wide text-left">
                  Saved Addresses
                </h2>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-855 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border-0"
                  >
                    <FaPlus size={8} /> Add New
                  </button>
                )}
              </div>

              {showForm ? (
                <form onSubmit={handleSubmit} className="space-y-4 text-left animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      New Address Details
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="text-neutral-400 hover:text-neutral-900 bg-transparent border-0 cursor-pointer"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">First Name *</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Last Name *</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Mobile Number *</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Country *</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Address Line 1 *</label>
                    <input
                      type="text"
                      name="address_line_1"
                      value={formData.address_line_1}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Address Line 2</label>
                      <input
                        type="text"
                        name="address_line_2"
                        value={formData.address_line_2}
                        onChange={handleInputChange}
                        className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Postal Code *</label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-800"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border-0 mt-2"
                  >
                    {savingAddress ? "Saving address..." : "Save Address Details"}
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  {addressesLoading ? (
                    <div className="flex flex-col items-center py-10 space-y-2">
                      <div className="h-5 w-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Loading address book...</span>
                    </div>
                  ) : addresses.length > 0 ? (
                    addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className="flex gap-4 p-4 border border-neutral-100 bg-[#FAFAFA]/50 rounded-xl items-start text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 shrink-0 mt-0.5">
                          <FaMapMarkerAlt size={12} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-neutral-800">
                            {addr.first_name} {addr.last_name}
                          </h4>
                          <p className="text-[11px] text-neutral-500 mt-1 font-light leading-relaxed">
                            {addr.address_line_1}
                            {addr.address_line_2 ? `, ${addr.address_line_2}` : ""}
                            {addr.landmark ? ` (Landmark: ${addr.landmark})` : ""}
                          </p>
                          <p className="text-[11px] text-neutral-500 font-light">
                            {addr.city}, {addr.state}, {addr.country} - {addr.postal_code}
                          </p>
                          <p className="text-[10px] text-neutral-400 mt-1.5">
                            {addr.mobile} | {addr.email}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 space-y-3">
                      <span className="font-serif italic text-2xl text-neutral-300">✦</span>
                      <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">No Saved Addresses</h4>
                      <p className="text-[10px] text-neutral-400 max-w-xs mx-auto font-light leading-relaxed">
                        Add a shipping address to your account to facilitate quick inquiries and checkout.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
