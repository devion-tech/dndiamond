"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

export default function EditorialBlock({ eyebrow, heading, body, cta, ctaHref, dark = false }) {
  const ref = useRef(null);

  useEffect(() => {
    let ctx;
    const loadAnimations = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!ref.current) return;

      const els = ref.current.querySelectorAll("[data-anim]");
      ctx = gsap.context(() => {
        gsap.fromTo(
          els,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }, ref);
    };

    loadAnimations();

    return () => ctx && ctx.revert();
  }, []);

  return (
    <div ref={ref} className="space-y-6 text-left">
      {eyebrow && (
        <span
          data-anim
          className={`block text-[9px] lg:text-[10px] xl:text-[11px] font-sans font-bold tracking-[0.35em] uppercase opacity-0 ${
            dark ? "text-neutral-500" : "text-neutral-400"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h3
        data-anim
        className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide leading-tight opacity-0 ${
          dark ? "text-white" : "text-neutral-955"
        }`}
      >
        {heading}
      </h3>
      <div
        data-anim
        className={`space-y-3 text-xs xl:text-sm font-light leading-relaxed max-w-md opacity-0 ${
          dark ? "text-neutral-400" : "text-neutral-500"
        }`}
      >
        {Array.isArray(body) ? (
          body.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p>{body}</p>
        )}
      </div>
      {cta && (
        <div data-anim className="pt-2 opacity-0">
          <Link
            href={ctaHref}
            className={`btn-apollonian-outline ${
              dark ? "btn-apollonian-outline-dark" : "btn-apollonian-outline-light"
            }`}
          >
            {cta}
          </Link>
        </div>
      )}
    </div>
  );
}
