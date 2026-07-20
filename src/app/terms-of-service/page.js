"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

const TERMS_SECTIONS = [
  {
    id: "agreement",
    title: "1. Agreement to Terms",
    content: "By accessing or using our website, you agree to be bound by these Terms of Service and all terms incorporated by reference. If you do not agree to all of these terms, do not use our website or services."
  },
  {
    id: "purchases",
    title: "2. Purchases & Payment",
    content: "We reserve the right to refuse or cancel any order at any time for reasons including but not limited to: product availability, errors in the description or price of the product, or fraud detection. By submitting payment info, you authorize us to charge the designated payment method."
  },
  {
    id: "intellectual",
    title: "3. Intellectual Property",
    content: "Unless otherwise indicated, the website is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the 'Content') are owned or controlled by us."
  },
  {
    id: "prohibited",
    title: "4. Prohibited Activities",
    content: "You may not access or use the website for any purpose other than that for which we make the website available. Prohibited activities include bypassing security features, uploading malicious code, or scraping product inventory data without permission."
  },
  {
    id: "disclaimers",
    title: "5. Disclaimers & Limitation of Liability",
    content: "The site is provided on an as-is and as-available basis. You agree that your use of the site and our services will be at your sole risk. In no event will we be liable to you or any third party for any direct, indirect, consequential, or exemplary damages."
  },
  {
    id: "governing",
    title: "6. Governing Law",
    content: "These terms and your use of the website are governed by and construed in accordance with the laws of Hong Kong SAR, without regard to its conflict of law principles."
  }
];

export default function TermsOfServicePage() {
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
              <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-wide text-neutral-950 mt-2">
                Terms of Service
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
            
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6 lg:border-r lg:border-neutral-150/40 lg:pr-10 text-left">
              <AnimateOnScroll direction="up" delay={150}>
                <span className="text-[10px] tracking-[0.25em] font-bold text-neutral-400 uppercase block mb-4">Contents</span>
                <ul className="space-y-4 text-xs font-medium text-neutral-500">
                  {TERMS_SECTIONS.map((sec) => (
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

            {/* Terms Content */}
            <div className="lg:col-span-8 space-y-12 text-left">
              {TERMS_SECTIONS.map((sec, idx) => (
                <AnimateOnScroll key={sec.id} direction="up" delay={100 + idx * 50}>
                  <div id={sec.id} className="space-y-4 scroll-mt-28">
                    <h2 className="font-serif text-xl sm:text-2xl font-light text-neutral-950">
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
