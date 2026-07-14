"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Layout from "@/components/layout/Layout";
import confetti from "canvas-confetti";
import { FaCheckCircle, FaPrint } from "react-icons/fa";

export default function SuccessPage() {
  const router = useRouter();
  const { currentOrder } = useSelector((state) => state.order);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#121212", "#A3E635", "#FFFFFF", "#CCCCCC", "#D4AF37"],
    });
  }, []);

  useEffect(() => {
    if (!token || !currentOrder) {
      router.push("/");
    }
  }, [token, currentOrder, router]);

  if (!currentOrder) return null;

  const addr = currentOrder.address;
  const addressStr =
    typeof addr === "string"
      ? addr
      : addr
        ? `${addr.address_line_1}${addr.address_line_2 ? ", " + addr.address_line_2 : ""}${addr.landmark ? ", " + addr.landmark : ""}, ${addr.city}, ${addr.state}, ${addr.country} - ${addr.postal_code}`
        : "";

  return (
    <Layout>
      <div className="bg-slate-background min-h-screen py-16 px-4 md:px-8 font-sans">
        <div className="max-w-3xl mx-auto bg-white border border-slate-100 shadow-xl rounded-3xl overflow-hidden animate-fade-in print:shadow-none print:border-none print:my-0">
          <div className="bg-neutral-900 text-white p-8 md:p-12 text-center space-y-4 print:bg-white print:text-black print:p-0">
            <FaCheckCircle className="text-lime-400 text-6xl mx-auto animate-bounce print:hidden" />
            <div className="space-y-2">
              <h1 className="font-serif text-2xl md:text-3xl tracking-wide">
                Your Order is Placed Successfully!
              </h1>
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest print:text-neutral-500">
                Transaction Reference ID: {currentOrder._id || currentOrder.id}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-8">
            <div className="text-center max-w-lg mx-auto">
              <p className="text-sm text-slate-600 leading-relaxed font-light font-sans text-left">
                Your fine jewelry request is placed successfully. A dedicated dn
                Diamonds concierge representative will contact you within 2
                hours to confirm your GIA custom diamonds.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-8 space-y-4 text-left">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                Order Summary
              </h3>
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-3">
                {addressStr && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Address:</span>
                    <span className="font-medium text-slate-600 max-w-[280px] text-right truncate">
                      {addressStr}
                    </span>
                  </div>
                )}
                {currentOrder.totalAmount != null && (
                  <div className="border-t border-slate-200/80 pt-3 flex justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Grand Total Amount
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {currentOrder.totalAmount}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 print:hidden">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <FaPrint /> Print Receipt
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
