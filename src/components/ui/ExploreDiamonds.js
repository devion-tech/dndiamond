"use client";

import React from "react";
import Link from "next/link";

const SHAPES = [
  { name: "ROUND", file: "round.avif", val: "Round" },
  { name: "CUSHION", file: "cushion.avif", val: "Cushion" },
  { name: "PRINCESS", file: "princess.avif", val: "Princess" },
  { name: "EMERALD", file: "emerald.avif", val: "Emerald" },
  { name: "PEAR", file: "pear.avif", val: "Pear" },
  { name: "OVAL", file: "oval.avif", val: "Oval" },
  { name: "RADIANT", file: "radiant.avif", val: "Radiant" },
  { name: "ASSCHER", file: "asschers.avif", val: "Asscher" },
  { name: "MARQUISE", file: "Marquise.avif", val: "Marquise" },
  { name: "HEART", file: "heart.avif", val: "Heart" },
];

export default function ExploreDiamonds() {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1760px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Loose Diamond Art Image */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 shadow-sm group">
              <img
                src="/about/about-diamond.png"
                alt="Exquisite loose diamonds in a luxury box"
                className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 rounded-2xl"
              />
              {/* Ambient overlay */}
              <div className="absolute inset-0 bg-neutral-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Title, Shape Grid & CTA Button */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col justify-between items-center lg:items-start w-full space-y-6 lg:space-y-8 pt-1">
            {/* Header Info */}
            <div className="space-y-3 w-full">
              <span className="block text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.3em] text-neutral-400 uppercase">
                Certified Shapes
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-neutral-900 tracking-wide leading-tight">
                Explore Our Diamonds
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-neutral-500 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                Select a shape to view our collection of ethically sourced, GIA
                &amp; IGI certified loose diamonds, each cut to unleash maximum fire
                and brilliance.
              </p>
            </div>

            {/* Shape Icons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-y-6 gap-x-4 sm:gap-x-6 w-full pt-2">
              {SHAPES.map((shape) => (
                <Link
                  key={shape.name}
                  href={`/diamonds?shape=${shape.val}`}
                  className="group flex flex-col items-center justify-center space-y-2.5"
                >
                  {/* Icon Container */}
                  <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-full bg-white border border-neutral-200/80 shadow-2xs flex items-center justify-center transition-all duration-300 overflow-hidden group-hover:border-neutral-900 group-hover:shadow-md">
                    <img
                      src={`/diamonds/${shape.file}`}
                      alt={`${shape.val} Cut Diamond`}
                      className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[12deg] will-change-transform"
                    />
                  </div>
                  {/* Label */}
                  <span className="w-full text-center font-sans text-[9px] sm:text-[10px] tracking-[0.25em] text-neutral-500 font-normal uppercase group-hover:text-black transition-colors duration-300">
                    {shape.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* CTA Link */}
            <div className="pt-2 w-full flex justify-center lg:justify-start">
              <Link
                href="/diamonds"
                className="inline-flex items-center gap-2 border border-neutral-900 bg-neutral-900 text-white hover:bg-transparent hover:text-neutral-900 px-8 py-3.5 text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase rounded-xl transition-all duration-300 shadow-xs cursor-pointer"
              >
                <span>EXPLORE DIAMONDS</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
