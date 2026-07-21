"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FaTool, FaRing, FaSlidersH, FaEnvelopeOpen, FaCheckCircle, FaUserCheck, FaUpload } from "react-icons/fa";
import Layout from "@/components/layout/Layout";
import { useStore } from "@/context/StoreContext";
import confetti from "canvas-confetti";

function BespokeContent() {
    const searchParams = useSearchParams();
    const { diamonds, submitInquiry } = useStore();

    // Form steps state
    const [step, setStep] = useState(1);

    // Inquiry configuration state
    const [formData, setFormData] = useState({
        category: "Ring",
        style: "Classic Solitaire",
        metalPreference: "18K Gold",
        caratPreference: "1.0 ct",
        diamondShape: "Round",
        notes: "",
        customerName: "",
        email: "",
        phone: ""
    });

    const [inquiryResult, setInquiryResult] = useState(null);

    // Sync diamond query parameters on mount
    useEffect(() => {
        const diamondId = searchParams.get("diamond");
        if (diamondId) {
            const selectedDiamond = diamonds.find(d => d.id === diamondId);
            if (selectedDiamond) {
                setFormData(prev => ({
                    ...prev,
                    diamondShape: selectedDiamond.shape,
                    caratPreference: `${selectedDiamond.carat} ct`,
                    notes: `Pre-selected diamond reference ID: ${selectedDiamond.id} (${selectedDiamond.title} with GIA certificate ${selectedDiamond.certificate}).`
                }));
                // Go straight to configuration specifications step
                setStep(2);
            }
        }
    }, [searchParams, diamonds]);

    const handleNext = () => {
        setStep(prev => Math.min(prev + 1, 3));
    };

    const handleBack = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        const { customerName, email, phone } = formData;
        if (!customerName || !email || !phone) {
            alert("Please fill in your name, email, and phone number.");
            return;
        }

        const res = submitInquiry(formData);
        setInquiryResult(res);

        // Confetti celebration
        confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#000000", "#FFFFFF", "#888888", "#CCCCCC"]
        });
    };

    const handleReset = () => {
        setInquiryResult(null);
        setStep(1);
        setFormData({
            category: "Ring",
            style: "Classic Solitaire",
            metalPreference: "18K Gold",
            caratPreference: "1.0 ct",
            diamondShape: "Round",
            notes: "",
            customerName: "",
            email: "",
            phone: ""
        });
    };

    return (
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-10 font-sans">

            {/* Header */}
            <div className="text-center space-y-2 mb-10">
                <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase block">Atelier Tailored Crafts</span>
                <h1 className="text-2xl sm:text-4xl font-serif font-medium text-black">
                    Bespoke Customizer <span className="font-serif italic text-accent font-light">Atelier</span>
                </h1>
                <p className="text-slate-400 text-xs font-light max-w-sm mx-auto">
                    Design your ideal engagement ring, earrings, or pendants. Our master bench jewellers will bring your dream setting to life.
                </p>
            </div>

            {/* Step indicators */}
            {!inquiryResult && (
                <div className="flex items-center justify-center gap-2 mb-10 max-w-md mx-auto">
                    {[
                        { num: 1, label: "Choose Category", icon: <FaRing /> },
                        { num: 2, label: "Specifications", icon: <FaSlidersH /> },
                        { num: 3, label: "Inquiry Info", icon: <FaEnvelopeOpen /> }
                    ].map((s) => (
                        <React.Fragment key={s.num}>
                            <div className="flex items-center gap-1.5">
                                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === s.num ? "bg-primary text-white" : step > s.num ? "bg-neutral-800 text-white" : "bg-slate-200 text-slate-500"}`}>
                                    {step > s.num ? "✓" : s.num}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:inline ${step === s.num ? "text-slate-800" : "text-slate-400"}`}>
                                    {s.label}
                                </span>
                            </div>
                            {s.num < 3 && <span className="h-0.5 w-10 bg-slate-200"></span>}
                        </React.Fragment>
                    ))}
                </div>
            )}

            {/* Customizer forms container */}
            <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl bg-white max-w-2xl mx-auto">

                {inquiryResult ? (
                    // Success View
                    <div className="text-center py-6 space-y-6">
                        <FaCheckCircle className="text-primary text-6xl mx-auto animate-bounce" />

                        <div className="space-y-1">
                            <h2 className="text-lg font-bold text-slate-800">Inquiry Submitted Successfully!</h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Reference ID: {inquiryResult.id}</p>
                        </div>

                        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-light">
                            Thank you, <span className="font-semibold text-slate-700">{inquiryResult.customerName}</span>. Your custom jewelry request has been successfully submitted to our design workshop. We will review the specs and email you with custom renders within 2 business days.
                        </p>

                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50 text-left space-y-2 max-w-sm mx-auto">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-medium">Category Setting:</span>
                                <span className="font-bold text-slate-800">{inquiryResult.category} ({inquiryResult.style})</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-medium">Metal Setting:</span>
                                <span className="font-bold text-slate-800">{inquiryResult.metalPreference}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-medium">Diamond Center:</span>
                                <span className="font-bold text-slate-800">{inquiryResult.caratPreference} {inquiryResult.diamondShape}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleReset}
                            className="bg-neutral-900 text-white border border-neutral-900 hover:bg-white hover:text-neutral-900 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer shadow-xs transition-all duration-300"
                        >
                            Design Another Piece
                        </button>
                    </div>
                ) : (
                    // Configuration form steps
                    <div className="space-y-6">

                        {/* STEP 1: Select Category */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left">Select Category & Layout Style</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { val: "Ring", label: "Custom Ring", desc: "Solitaire bands, engagement halo rings, wedding bands.", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200" },
                                        { val: "Earring", label: "Custom Earrings", desc: "Claw solitaire studs, halo drop earrings, everyday studs.", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200" },
                                        { val: "Pendant", label: "Custom Pendant", desc: "Solitaire pendants, eternity cluster flower necklaces.", img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200" },
                                        { val: "Bracelet & Bangle", label: "Custom Bracelet", desc: "Tennis bracelet styles, gold cuffs, bangles.", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200" }
                                    ].map((cat) => (
                                        <button
                                            key={cat.val}
                                            onClick={() => setFormData(prev => ({ ...prev, category: cat.val }))}
                                            className={`p-4 rounded-2xl border text-left flex gap-4 transition-all cursor-pointer ${formData.category === cat.val ? "bg-slate-50 border-primary shadow-xs" : "bg-white border-slate-200 hover:bg-slate-50/50"}`}
                                        >
                                            <div className="h-14 w-14 rounded-lg overflow-hidden shrink-0">
                                                <img src={cat.img} alt={cat.label} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs font-bold text-slate-800 block">{cat.label}</span>
                                                <p className="text-[10px] text-slate-400 leading-normal font-light">{cat.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Band Style</label>
                                    <select
                                        name="style"
                                        value={formData.style}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white text-slate-700 px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold"
                                    >
                                        <option value="Classic Solitaire">Classic Solitaire Band</option>
                                        <option value="Halo Accent">Halo Diamond Band</option>
                                        <option value="Three-Stone Accent">Three-Stone Accent Band</option>
                                        <option value="Pavé Diamond Band">Micro-Pavé Diamond Band</option>
                                        <option value="Floral Vintage Layout">Floral Vintage Setting</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Configure Specs */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left">Specify Materials & Diamond Carats</h3>

                                {/* Metal selection */}
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Metal Purity</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {["14K Gold", "18K Gold", "Platinum"].map((metal) => (
                                            <button
                                                key={metal}
                                                onClick={() => setFormData(prev => ({ ...prev, metalPreference: metal }))}
                                                className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer text-center transition-all ${formData.metalPreference === metal ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                                            >
                                                {metal}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Center stone shape selection */}
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Diamond Center Shape</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                        {["Round", "Cushion", "Princess", "Emerald", "Oval"].map((shape) => (
                                            <button
                                                key={shape}
                                                onClick={() => setFormData(prev => ({ ...prev, diamondShape: shape }))}
                                                className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer text-center transition-all ${formData.diamondShape === shape ? "bg-primary text-white border-primary" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                                            >
                                                {shape}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Carat weight select */}
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Desired Carat Size</label>
                                    <select
                                        name="caratPreference"
                                        value={formData.caratPreference}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white text-slate-700 px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold"
                                    >
                                        <option value="0.5 ct">Delicate (0.5 ct)</option>
                                        <option value="0.75 ct">Standard (0.75 ct)</option>
                                        <option value="1.0 ct">Classic (1.0 ct)</option>
                                        <option value="1.5 ct">Premium (1.5 ct)</option>
                                        <option value="2.0 ct">Brilliant (2.0 ct)</option>
                                    </select>
                                </div>

                                {/* Notes detail */}
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Design Requests details</label>
                                    <textarea
                                        name="notes"
                                        rows="3"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        placeholder="Explain setting heights, micro-pavé details, ring engraving, or specify GIA code references..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 p-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all placeholder:text-slate-400 leading-relaxed font-light"
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Contact & Submit */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left">Enter Contact Details for Atelier Quote</h3>

                                <div className="space-y-4">
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            required
                                            value={formData.customerName}
                                            onChange={handleInputChange}
                                            placeholder="Alexander Vanderbilt"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-slate-800"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5 text-left">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="concierge@dndiamonds.com"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-slate-800"
                                            />
                                        </div>
                                        <div className="space-y-1.5 text-left">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+852 2345 6789"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-slate-800"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation buttons */}
                        <div className="flex gap-4 pt-6 border-t border-slate-100">
                            {step > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="flex-1 py-3.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer transition-all"
                                >
                                    Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    onClick={handleNext}
                                    className="flex-[2] bg-neutral-900 text-white border border-neutral-900 hover:bg-white hover:text-neutral-900 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-all duration-300"
                                >
                                    Next Step
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="flex-[2] bg-white text-neutral-900 border border-neutral-900 hover:bg-neutral-900 hover:text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    Submit Custom Inquiry
                                </button>
                            )}
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}

export default function Bespoke() {
    return (
        <Layout>
            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center min-h-[400px] text-xs font-bold uppercase text-slate-400 tracking-widest">
                    Loading Bespoke Ring Builder...
                </div>
            }>
                <BespokeContent />
            </Suspense>
        </Layout>
    );
}
