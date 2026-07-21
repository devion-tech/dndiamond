"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

const PRIVACY_SECTIONS = [
  {
    id: "collection",
    title: "1. Information We Collect",
    content: "We collect personal information that you voluntarily provide to us when you register on our website, express an interest in obtaining information about us or our products, or when you contact us. This may include names, email addresses, phone numbers, billing/shipping addresses, and payment details."
  },
  {
    id: "processing",
    title: "2. How We Process Your Information",
    content: "We process your personal information for a variety of reasons, including to deliver and facilitate delivery of products, respond to user inquiries, send administrative updates, prevent fraud, and comply with legal obligations. We do not sell or trade your personal information to third parties."
  },
  {
    id: "cookies",
    title: "3. Cookies & Tracking Technologies",
    content: "We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. These assist us in understanding site usage patterns and preferences to optimize your bespoke browsing experience."
  },
  {
    id: "security",
    title: "4. Information Security",
    content: "We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure."
  },
  {
    id: "rights",
    title: "5. Your Privacy Rights",
    content: "Depending on your geographic location, you may have rights under local privacy laws (such as GDPR or CCPA). These may include the right to request access to and obtain a copy of your personal information, request rectification or erasure, or restrict the processing of your data."
  },
  {
    id: "updates",
    title: "6. Updates to This Policy",
    content: "We may update this privacy notice from time to time. The updated version will be indicated by an updated 'Revised' date at the top of this page and will be effective as soon as it is accessible."
  }
];

export default function PrivacyPolicyPage() {
  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <Layout>
      <div className="w-full bg-white text-neutral-900 font-sans overflow-x-hidden selection:bg-neutral-900/10 selection:text-neutral-900">
        
        {/* Header Section */}
        <section className="py-20 sm:py-28 border-b border-neutral-100 bg-neutral-50/20">
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16 text-center space-y-4">
            <AnimateOnScroll direction="up" delay={100}>
              <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.3em] text-neutral-400 uppercase">
                Legal &amp; Transparency
              </span>
              <h1 className="text-4xl sm:text-5xl font-light tracking-wide text-neutral-950 mt-2">
                Privacy Policy
              </h1>
              <p className="text-neutral-500 font-mono text-[9px] sm:text-[10px] tracking-widest mt-2 uppercase">
                Last Revised: October 18, 2025
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Content Section with Sticky Sidebar */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Sidebar Navigation (Sticky on Desktop) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6 lg:border-r lg:border-neutral-150/40 lg:pr-10 text-left">
              <AnimateOnScroll direction="up" delay={150}>
                <span className="text-[10px] tracking-[0.25em] font-bold text-neutral-400 uppercase block mb-4">Contents</span>
                <ul className="space-y-4 text-xs font-medium text-neutral-500">
                  {PRIVACY_SECTIONS.map((sec) => (
                    <li key={sec.id}>
                      <button
                        onClick={() => handleScroll(sec.id)}
                        className="hover:text-neutral-950 transition-colors cursor-pointer text-left focus:outline-none"
                      >
                        {sec.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </AnimateOnScroll>
            </aside>

            {/* Privacy Content */}
            <div className="lg:col-span-8 space-y-12 text-left">
              {PRIVACY_SECTIONS.map((sec, idx) => (
                <AnimateOnScroll key={sec.id} direction="up" delay={100 + idx * 50}>
                  <div id={sec.id} className="space-y-4 scroll-mt-28">
                    <h2 className="text-xl sm:text-2xl font-light text-neutral-950">
                      {sec.title}
                    </h2>
                    <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed font-light font-sans max-w-3xl">
                      {sec.content}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

          </div>
        </section>

      </div>
    </Layout>
  );
}
