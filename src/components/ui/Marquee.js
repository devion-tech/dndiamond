"use client";

import React from "react";
import { FaShieldAlt, FaTruck, FaUndo, FaGem, FaAward, FaCertificate } from "react-icons/fa";

const trustBadges = [
    { text: "Secure 256-Bit Payments", icon: <FaShieldAlt className="text-primary text-xs" /> },
    { text: "FedEx Insured 2-Day Shipping", icon: <FaTruck className="text-primary text-xs" /> },
    { text: "30-Day Easy Returns Guarantee", icon: <FaUndo className="text-primary text-xs" /> },
    { text: "GIA & IGI Certified Diamonds", icon: <FaGem className="text-primary text-xs" /> },
    { text: "Lifetime Bench Workmanship", icon: <FaAward className="text-primary text-xs" /> },
    { text: "100% Hallmarked Fine Gold", icon: <FaCertificate className="text-primary text-xs" /> }
];

export default function Marquee() {
    return (
        <section aria-label="Trust Guarantees" className="w-full bg-white border-y border-slate-100 py-4 overflow-hidden relative z-10">
            {/* Fade effect gradients */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>

            <div className="flex w-max animate-marquee">
                {/* Render badges twice to make loop infinite and gapless */}
                {[...trustBadges, ...trustBadges, ...trustBadges].map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 mx-12">
                        <span className="h-1.5 w-1.5 bg-accent/40 rounded-full shrink-0"></span>
                        {badge.icon}
                        <span className="text-slate-500 font-sans text-xs font-semibold tracking-[0.2em] whitespace-nowrap uppercase">
                            {badge.text}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
