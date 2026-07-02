"use client";

import React from "react";
import Layout from "@/components/layout/Layout";

export default function AboutPage() {
    return (
        <Layout>
            <div className="w-full flex flex-col bg-white">
                
                {/* About Hero Banner & Overlay */}
                <section className="relative min-h-[90vh] w-full flex items-center justify-start overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80" 
                            alt="Apollonian Fine Jewelry Earring Close-up" 
                            className="h-full w-full object-cover object-right sm:object-center"
                        />
                    </div>

                    {/* Dark gradient overlay on the left */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>

                    {/* Content Overlay */}
                    <div className="relative z-20 mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-20 text-left">
                        <div className="max-w-xl text-white space-y-6">
                            
                            {/* Headline */}
                            <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-wide text-white mb-4">
                                About Us
                            </h1>

                            {/* Accent block intro */}
                            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed border-l-2 border-primary pl-4 py-1 italic">
                                This is an About us page for this conceptual luxury website, helping viewers become accustomed to Apollonian and its purpose, if it were real.
                            </p>

                            {/* Paragraph blocks */}
                            <div className="space-y-4 text-xs sm:text-[13px] text-neutral-300 font-light leading-relaxed">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <p>
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </p>
                                <p>
                                    Vel etea eros ac odio tempor oep dapibus ultrices. Mauris vitae ultricies leo integer. Placerat duis ultricies lacus sed turpis tincidunt id.
                                </p>
                                <p>
                                    Augue mauris augue neque gravida in fermentum et.
                                </p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Optional Atelier values below the main Figma screen to keep the page content rich */}
                <section className="bg-[#FAFAFA] py-16 sm:py-24 text-neutral-800">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
                        <div className="max-w-2xl mx-auto space-y-4">
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary block">Studio Philosophy</span>
                            <h2 className="font-serif text-2xl sm:text-3xl font-light text-neutral-900 leading-tight">
                                Designed with Order, Symmetry, and Pure Reason
                            </h2>
                            <p className="text-xs text-neutral-500 font-light leading-relaxed">
                                Inspired by the classical Apollonian ideals, we reject temporary seasonal trends. We craft minimalist, symmetrical settings constructed individually by master bench jewellers using ethically sourced precious metals and GIA-certified conflict-free diamonds.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </Layout>
    );
}
