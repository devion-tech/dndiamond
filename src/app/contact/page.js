"use client";

import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { FaPhoneAlt, FaEnvelope, FaClock, FaMapMarkerAlt, FaChevronDown, FaCheckCircle, FaLaptop, FaCalendarAlt } from "react-icons/fa";
import confetti from "canvas-confetti";

// Showrooms Data
const SHOWROOMS = [
    {
        id: "surat",
        city: "Surat, India",
        name: "Surat (Head Office)",
        address: "78, Patel Nagar Soc., Near M.M Silk Mill, A.K Road, Surat - 395008, Gujarat, India.",
        phone: "+91 261 655 4294",
        hours: "Mon - Sat: 10:00 AM - 7:00 PM (By Appointment Only)",
        email: "Purvish.k@dnitin.com",
        coords: "21.1702° N, 72.8311° E",
        mapQuery: "78, Patel Nagar Soc., Near M.M Silk Mill, A.K Road, Surat - 395008, Gujarat, India",
        description: "Located in the diamond hub of Surat, our Head Office oversees the complete sourcing, sorting, and raw diamond curation pipeline.",
        label: "HEAD OFFICE"
    },
    {
        id: "mumbai",
        city: "Mumbai, India",
        name: "Mumbai Branch",
        address: "'E' Tower, EC-6090, Bharat Diamond Bourse, BKC, Bandra (E), Mumbai - 400051, India.",
        phone: "+91 22-6114 3333",
        hours: "Mon - Sat: 10:00 AM - 7:00 PM (By Appointment Only)",
        email: "dnitin@dnitin.com",
        coords: "19.0596° N, 72.8634° E",
        mapQuery: "Bharat Diamond Bourse, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051",
        description: "Located inside the highly secure Bharat Diamond Bourse, our Mumbai branch coordinates trading operations and loose diamond certifications.",
        label: "REGIONAL BRANCH"
    },
    {
        id: "hongkong",
        city: "T.S.T, Hong Kong",
        name: "Hong Kong Office",
        address: "D. N. Diamonds (HK) Ltd., Unit 303, 3/F, Chevalier House, 45-51 Chatham Road, T.S.T, Kln., Hong Kong.",
        phone: "+852 3693 4141",
        hours: "Mon - Sat: 10:00 AM - 7:00 PM (By Appointment Only)",
        email: "dndiamondhk@yahoo.com",
        coords: "22.2988° N, 114.1722° E",
        mapQuery: "Chevalier House, 45-51 Chatham Rd, Tsim Sha Tsui, Hong Kong",
        description: "Located in Tsim Sha Tsui, Chevalier House, our Hong Kong office features high-definition GIA examination suites and custom design commissions.",
        label: "INTERNATIONAL OFFICE"
    }
];

// FAQs Data
const FAQS = [
    {
        q: "How long does a bespoke diamond custom commission take?",
        a: "Typically, custom bespoke designs take between 4 to 6 weeks. This timeline includes stone curation, gouache renderings or 3D CAD modeling, hand-forging by our master goldsmiths in platinum or gold, and strict GIA registration quality assurance checks."
    },
    {
        q: "Are all DN Diamond gemstones GIA certified?",
        a: "Yes. Every single diamond over 0.3 carats sourced by our atelier comes with a certificate of origin and grading dossier from the Gemological Institute of America (GIA), featuring laser inscriptions matching its GIA report number."
    },
    {
        q: "What measures do you take to guarantee ethical diamond sourcing?",
        a: "We strictly purchase polished diamonds from verified suppliers who certify that the diamonds are conflict-free under the Kimberley Process. We prioritize sustainable mines that support local community healthcare and education programs."
    },
    {
        q: "Can I book a consultation if I cannot visit a physical showroom?",
        a: "Absolutely. Our expert concierges offer virtual consultations via high-definition video calls. We can display selected GIA-certified diamonds and model designs under magnification, coordinating global insured shipping directly to your doorstep."
    },
    {
        q: "What is your resizing and adjustment policy?",
        a: "We provide one complimentary ring resizing within the first year of purchase for all bespoke ring commissions. To arrange a resize, simply contact your consultant or reserve an appointment through the concierge portal."
    }
];

export default function ContactPage() {
    const [activeFaq, setActiveFaq] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const [gsapLoaded, setGsapLoaded] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(SHOWROOMS[0]);

    // GSAP Reference Refs
    const gsapRef = useRef(null);
    const scrollTriggerRef = useRef(null);

    const formRef = useRef(null);
    const contactInfoRef = useRef(null);
    const mapContainerRef = useRef(null);

    const [formInput, setFormInput] = useState({
        inquiryType: "Bespoke Custom Commission",
        location: "Surat (Head Office)",
        name: "",
        email: "",
        phone: "",
        date: "",
        timeSlot: "11:00 AM",
        notes: ""
    });

    // Dynamic GSAP Loader
    useEffect(() => {
        const loadGSAP = async () => {
            try {
                const { gsap } = await import("gsap");
                const { ScrollTrigger } = await import("gsap/ScrollTrigger");
                gsap.registerPlugin(ScrollTrigger);
                gsapRef.current = gsap;
                scrollTriggerRef.current = ScrollTrigger;
                setGsapLoaded(true);
            } catch (error) {
                console.error("Failed to load GSAP in Contact page", error);
            }
        };
        loadGSAP();
    }, []);

    // Scroll trigger animations
    useEffect(() => {
        if (!gsapLoaded) return;

        const gsap = gsapRef.current;
        const ScrollTrigger = scrollTriggerRef.current;

        const ctx = gsap.context(() => {
            // Fade in Hero content
            const heroHeader = document.querySelector(".js-contact-hero");
            if (heroHeader) {
                gsap.fromTo(Array.from(heroHeader.children),
                    { opacity: 0, y: 25 },
                    { opacity: 1, y: 0, duration: 1.0, stagger: 0.12, ease: "power3.out" }
                );
            }

            // Split Panel animations
            if (formRef.current && contactInfoRef.current) {
                gsap.fromTo(formRef.current,
                    { opacity: 0, x: -30 },
                    {
                        opacity: 1, x: 0, duration: 1.0, ease: "power3.out",
                        scrollTrigger: { trigger: formRef.current, start: "top 80%", once: true }
                    }
                );

                gsap.fromTo(contactInfoRef.current,
                    { opacity: 0, x: 30 },
                    {
                        opacity: 1, x: 0, duration: 1.0, ease: "power3.out",
                        scrollTrigger: { trigger: contactInfoRef.current, start: "top 80%", once: true }
                    }
                );
            }

            // FAQ card list reveals
            const faqCards = document.querySelectorAll(".js-faq-item");
            if (faqCards.length > 0) {
                gsap.fromTo(Array.from(faqCards),
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power2.out",
                        scrollTrigger: { trigger: ".js-faq-container", start: "top 82%", once: true }
                    }
                );
            }
        });

        return () => ctx.revert();
    }, [gsapLoaded]);

    const handleInputChange = (e) => {
        setFormInput({
            ...formInput,
            [e.target.name]: e.target.value
        });
    };

    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
    };

    const handleBookNow = (room, e) => {
        if (e) e.stopPropagation();
        setSelectedRoom(room);
        setFormInput(prev => ({
            ...prev,
            location: room.name
        }));

        // Smooth scroll to form
        const formEl = document.getElementById("consultation-form-section");
        if (formEl) {
            formEl.scrollIntoView({ behavior: "smooth" });
        }
    };

    const toggleFaq = (idx) => {
        setActiveFaq(activeFaq === idx ? null : idx);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple check
        if (!formInput.name || !formInput.email || !formInput.phone || !formInput.date) {
            alert("Please provide name, email, phone number, and a preferred date.");
            return;
        }

        setSubmitting(true);

        // Mock API call delay
        setTimeout(() => {
            const referenceId = "DN-ATELIER-" + Math.floor(100000 + Math.random() * 900000);
            setSubmittedData({
                referenceId,
                name: formInput.name,
                location: formInput.location,
                date: formInput.date,
                timeSlot: formInput.timeSlot,
                inquiryType: formInput.inquiryType
            });
            setSubmitting(false);

            // Trigger beautiful celebration
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ["#111111", "#888888", "#FFFFFF", "#E5E5E5"]
            });
        }, 1200);
    };

    const handleReset = () => {
        setSubmittedData(null);
        setFormInput({
            inquiryType: "Bespoke Custom Commission",
            location: "Surat (Head Office)",
            name: "",
            email: "",
            phone: "",
            date: "",
            timeSlot: "11:00 AM",
            notes: ""
        });
    };

    return (
        <Layout>
            <div className="w-full bg-[#FAF9F6] text-[#111111] font-sans selection:bg-neutral-900/10 selection:text-[#111111] overflow-x-hidden font-light">

                {/* HERO BLOCK */}
                <section className="bg-black text-white py-20 lg:py-28 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/5 rounded-full blur-[140px] pointer-events-none" />

                    <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 text-center space-y-4 js-contact-hero">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
                            RESERVATIONS
                        </span>
                        <h1 className="text-4xl sm:text-6xl font-serif font-light tracking-wide text-white leading-tight">
                            Connect With Our Concierge
                        </h1>
                        <div className="w-16 h-[1px] bg-neutral-500 mx-auto my-3" />
                        <p className="text-neutral-400 font-sans font-light text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                            Reserve a private viewing suite session in Surat, Mumbai, or Hong Kong, or arrange a detailed digital consultation with our master bench artisans.
                        </p>
                    </div>
                </section>

                {/* SHOWROOM DIRECTORY */}
                <section className="py-24 sm:py-32 max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
                    <div className="text-center space-y-3 mb-16">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-neutral-500 uppercase block">
                            LOCATIONS
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-serif font-light text-neutral-900">
                            Our Global Consultation Suites
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {SHOWROOMS.map((room) => {
                            const isSelected = selectedRoom.id === room.id;
                            return (
                                <div
                                    key={room.id}
                                    onClick={() => handleRoomSelect(room)}
                                    className={`glass-card-light rounded-xs p-6 sm:p-8 border bg-white shadow-sm flex flex-col justify-between transition-all duration-300 cursor-pointer ${isSelected
                                        ? "border-neutral-900 ring-1 ring-neutral-900 shadow-md transform -translate-y-1"
                                        : "border-neutral-100 hover:border-neutral-300 hover:shadow-md"
                                        }`}
                                >
                                    <div className="space-y-4 text-left">
                                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-800">
                                                {room.city}
                                            </span>
                                            <span className="text-[8px] font-sans text-neutral-400 tracking-wider">
                                                {room.coords}
                                            </span>
                                        </div>

                                        <h3 className="font-serif text-base font-semibold text-neutral-900 leading-snug">
                                            {room.name}
                                        </h3>

                                        <p className="text-neutral-500 font-sans text-xs leading-relaxed min-h-[48px]">
                                            {room.address}
                                        </p>

                                        <div className="space-y-2 pt-2 text-neutral-600 text-xs font-sans">
                                            <div className="flex items-center gap-2">
                                                <FaPhoneAlt className="text-neutral-400 text-[10px]" />
                                                <span>{room.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaEnvelope className="text-neutral-400 text-[10px]" />
                                                <a href={`mailto:${room.email}`} className="hover:underline truncate">{room.email}</a>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-neutral-400 text-[10px]" />
                                                <span className="text-[11px] leading-tight text-neutral-500">{room.hours}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            onClick={(e) => handleBookNow(room, e)}
                                            className="w-full text-center py-2.5 bg-neutral-955 border border-neutral-955 text-white text-[10px] font-bold uppercase tracking-[0.15em] transition-all hover:bg-neutral-800 hover:border-neutral-800 cursor-pointer"
                                        >
                                            Book Consultation
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* DUAL COLUMN: INTAKE FORM & FLAGSHIP HIGHLIGHT (MAP) */}
                <section
                    id="consultation-form-section"
                    className="py-24 sm:py-32 bg-white border-y border-neutral-100"
                >
                    <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                        {/* LEFT COLUMN: CONCIERGE BOOKING FORM */}
                        <div ref={formRef} className="lg:col-span-7 w-full">
                            <div className="glass-card-light rounded-xs p-8 sm:p-10 border border-neutral-100/85 shadow-lg bg-neutral-50/50 text-left">
                                {submittedData ? (
                                    // Success state block
                                    <div className="text-center py-10 space-y-6 animate-fade-in">
                                        <FaCheckCircle className="text-neutral-800 text-6xl mx-auto animate-bounce" />
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-serif font-light text-neutral-900">
                                                Consultation Requested
                                            </h3>
                                            <span className="inline-block text-xs font-mono font-bold bg-neutral-100 text-neutral-800 border border-neutral-200 px-3 py-1 rounded-sm uppercase tracking-widest mt-1">
                                                ID: {submittedData.referenceId}
                                            </span>
                                        </div>
                                        <p className="text-neutral-600 font-sans text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                                            Thank you, <strong>{submittedData.name}</strong>. Our concierge has reserved a tentative slot for <strong>{submittedData.inquiryType}</strong> on <strong>{submittedData.date}</strong> at <strong>{submittedData.timeSlot}</strong> at our <strong>{submittedData.location}</strong> salon. A consultant will email you details shortly.
                                        </p>
                                        <div className="pt-4">
                                            <button
                                                onClick={handleReset}
                                                className="px-8 py-3 bg-neutral-950 border border-neutral-955 text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-neutral-900 cursor-pointer"
                                            >
                                                Submit Another Request
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Form input fields
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="border-b border-neutral-100 pb-3 mb-6">
                                            <h3 className="font-serif text-xl sm:text-2xl font-light text-neutral-900">
                                                Book Consultation Session
                                            </h3>
                                            <p className="text-neutral-400 text-xs font-sans mt-1">
                                                Please complete the fields below to coordinate with our private diamond brokers.
                                            </p>
                                        </div>

                                        {/* Row 1: Category & Showroom */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">
                                                    Inquiry Class
                                                </label>
                                                <select
                                                    name="inquiryType"
                                                    value={formInput.inquiryType}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900 rounded-sm transition-all"
                                                >
                                                    <option>Bespoke Custom Commission</option>
                                                    <option>Ready-to-Wear Fine Jewelry</option>
                                                    <option>Loose GIA Diamond Search</option>
                                                    <option>Atelier Viewing Visit</option>
                                                    <option>General Concierge Inquiry</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">
                                                    Preferred Showroom
                                                </label>
                                                <select
                                                    name="location"
                                                    value={formInput.location}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900 rounded-sm transition-all"
                                                >
                                                    <option>Surat (Head Office)</option>
                                                    <option>Mumbai Branch</option>
                                                    <option>Hong Kong Office</option>
                                                    <option>Virtual Consultation (Zoom Call)</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Row 2: Customer Credentials */}
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                placeholder="e.g. Sterling H. Dupont"
                                                value={formInput.name}
                                                onChange={handleInputChange}
                                                className="w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 rounded-sm transition-all text-neutral-800 placeholder-neutral-300"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    placeholder="sterling@example.com"
                                                    value={formInput.email}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 rounded-sm transition-all text-neutral-800 placeholder-neutral-300"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    required
                                                    placeholder="+852 9123 4567"
                                                    value={formInput.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 rounded-sm transition-all text-neutral-800 placeholder-neutral-300"
                                                />
                                            </div>
                                        </div>

                                        {/* Row 3: Calendar Date and Slot */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">
                                                    Preferred Date
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        required
                                                        value={formInput.date}
                                                        onChange={handleInputChange}
                                                        className="w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 rounded-sm transition-all text-neutral-800"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">
                                                    Time Slot
                                                </label>
                                                <select
                                                    name="timeSlot"
                                                    value={formInput.timeSlot}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900 rounded-sm transition-all"
                                                >
                                                    <option>10:00 AM</option>
                                                    <option>11:00 AM</option>
                                                    <option>12:00 PM</option>
                                                    <option>02:00 PM</option>
                                                    <option>03:00 PM</option>
                                                    <option>04:00 PM</option>
                                                    <option>05:00 PM</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Notes area */}
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">
                                                Design Specifications & Notes
                                            </label>
                                            <textarea
                                                name="notes"
                                                rows={3}
                                                placeholder="Describe carat weights, shapes, preferred settings, or special timeline requests..."
                                                value={formInput.notes}
                                                onChange={handleInputChange}
                                                className="w-full border border-neutral-200 bg-white px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 rounded-sm transition-all text-neutral-800 placeholder-neutral-300 resize-none"
                                            />
                                        </div>

                                        {/* Submit button */}
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full py-4 bg-[#111111] hover:bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 disabled:opacity-50 cursor-pointer"
                                            >
                                                {submitting ? "Checking Availability..." : "Request Reservation Slot"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                            {/* RIGHT COLUMN: INTERACTIVE MAP FOR SELECTED SHOWROOM */}
                            <div ref={contactInfoRef} className="lg:col-span-5 w-full space-y-8 text-left">
                                <div className="space-y-4">
                                    <span className="text-[11px] font-bold tracking-[0.3em] text-neutral-500 uppercase block">
                                        {selectedRoom.label}
                                    </span>
                                    <h3 className="font-serif text-3xl font-light text-neutral-900 leading-tight">
                                        {selectedRoom.name}
                                    </h3>
                                    <p className="text-neutral-600 font-sans text-xs sm:text-sm leading-relaxed">
                                        {selectedRoom.description}
                                    </p>
                                </div>

                                {/* Luxury Map Container */}
                                <div className="w-full aspect-[4/3] rounded-xs bg-neutral-100 border border-neutral-200 relative overflow-hidden shadow-inner">
                                    <iframe
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedRoom.mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                        className="w-full h-full border-0 grayscale-[20%] contrast-[110%] opacity-90 transition-opacity duration-300"
                                        allowFullScreen=""
                                        loading="lazy"
                                        title={`Map of ${selectedRoom.name}`}
                                    ></iframe>

                                    {/* Custom Coordinate Badge */}
                                    <div className="absolute bottom-4 left-4 bg-neutral-900 text-white text-[8px] font-mono tracking-widest px-2.5 py-1 rounded-sm select-none border border-white/10 z-10 shadow-sm">
                                        {selectedRoom.id.toUpperCase()}: {selectedRoom.coords}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-neutral-100">
                                    <h4 className="font-serif text-base font-semibold text-neutral-900">
                                        Direct Showroom Contact
                                    </h4>
                                    <ul className="space-y-3 text-neutral-500 text-xs font-sans">
                                        <li className="flex items-center gap-3">
                                            <FaEnvelope className="text-neutral-400 text-sm" />
                                            <span>Concierge Email: <a href={`mailto:${selectedRoom.email}`} className="text-neutral-900 font-bold hover:underline">{selectedRoom.email}</a></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <FaPhoneAlt className="text-neutral-400 text-sm" />
                                            <span>Direct Hotline: <span className="text-neutral-900 font-bold">{selectedRoom.phone}</span></span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <FaClock className="text-neutral-400 text-sm" />
                                            <span>Hours: <span className="text-neutral-800">{selectedRoom.hours}</span></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>        </div>

                    </div>
                </section>

                {/* FAQ ACCORDION */}
                <section className="py-24 sm:py-32 bg-[#FAF9F6] js-faq-container">
                    <div className="max-w-4xl mx-auto px-6">

                        <div className="text-center space-y-3 mb-16">
                            <span className="text-[11px] font-bold tracking-[0.3em] text-neutral-550 uppercase block">
                                ASSISTANCE
                            </span>
                            <h2 className="text-3xl font-serif font-light text-neutral-900">
                                Frequently Asked Questions
                            </h2>
                            <div className="w-12 h-[1px] bg-neutral-800 mx-auto mt-3" />
                        </div>

                        {/* Questions list */}
                        <div className="space-y-4">
                            {FAQS.map((faq, idx) => {
                                const isOpen = idx === activeFaq;
                                return (
                                    <div
                                        key={idx}
                                        className="js-faq-item border border-neutral-200/60 bg-white rounded-xs transition-all duration-300"
                                    >
                                        <button
                                            onClick={() => toggleFaq(idx)}
                                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer group"
                                        >
                                            <span className="font-serif text-sm sm:text-base font-semibold text-neutral-800 group-hover:text-neutral-900 transition-colors leading-snug">
                                                {faq.q}
                                            </span>
                                            <FaChevronDown
                                                size={10}
                                                className={`text-neutral-400 transition-transform duration-300 ml-4 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                                            />
                                        </button>

                                        {/* Expandable answer panel */}
                                        <div
                                            className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[160px] border-t border-neutral-100" : "max-h-0"}`}
                                        >
                                            <div className="p-5 text-left text-neutral-500 font-sans text-xs sm:text-sm leading-relaxed font-light">
                                                {faq.a}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </section>

            </div>
        </Layout>
    );
}
