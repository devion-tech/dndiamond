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
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Jewelry Box Art Image */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative aspect-square w-full max-w-[500px] overflow-hidden bg-neutral-50 border border-neutral-100 shadow-xs group">
              <img
                src="/about/about-diamond.png"
                alt="Exquisite loose diamonds in a luxury box"
                className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
              />
              {/* Ambient overlay */}
              <div className="absolute inset-0 bg-neutral-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Diamond Shape Selector Grid */}
          <div className="lg:col-span-7 space-y-10 text-center lg:text-left flex flex-col justify-center items-center lg:items-start w-full">
            <div className="space-y-3 w-full">
              <span className="block text-[9px] lg:text-[10px] xl:text-[11px] font-bold tracking-[0.35em] uppercase text-neutral-400">
                Certified Shapes
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 font-light tracking-wide leading-tight uppercase">
                Explore Our Diamonds
              </h2>
              <p className="text-xs xl:text-sm text-neutral-500 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                Select a shape to view our collection of ethically sourced, GIA
                & IGI certified loose diamonds, each cut to unleash maximum fire
                and brilliance.
              </p>
            </div>

            {/* Shape Icons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-y-10 gap-x-6 sm:gap-x-8 w-full pt-4">
              {SHAPES.map((shape) => (
                <Link
                  key={shape.name}
                  href={`/diamonds?shape=${shape.val}`}
                  className="group flex flex-col items-center justify-between space-y-3"
                >
                  {/* Icon Container with subtle background hover */}
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-neutral-50 hover:bg-neutral-100/50 flex items-center justify-center transition-all duration-500 overflow-hidden">
                    <img
                      src={`/diamonds/${shape.file}`}
                      alt={`${shape.val} Cut Diamond`}
                      className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform duration-700 ease-out group-hover:scale-115 group-hover:rotate-[15deg] will-change-transform"
                    />
                  </div>
                  {/* Label */}
                  <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] text-neutral-700 font-semibold uppercase group-hover:text-neutral-950 transition-colors duration-300">
                    {shape.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* CTA Link */}
            <div className="pt-6 w-full flex justify-center lg:justify-start">
              <Link
                href="/diamonds"
                className="btn-apollonian-outline btn-apollonian-outline-light text-[10px] sm:text-xs tracking-widest font-bold"
              >
                EXPLORE DIAMONDS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
