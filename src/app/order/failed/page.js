"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Layout from "@/components/layout/Layout";
import { FaTimesCircle } from "react-icons/fa";

export default function OrderFailedPage() {
  const router = useRouter();
  const { currentOrder } = useSelector((state) => state.order);

  return (
    <Layout>
      <div className="bg-slate-background min-h-screen py-16 px-4 md:px-8 font-sans">
        <div className="max-w-3xl mx-auto bg-white border border-slate-100 shadow-xl rounded-3xl overflow-hidden animate-fade-in">
          <div className="bg-neutral-900 text-white p-8 md:p-12 text-center space-y-4">
            <FaTimesCircle className="text-red-500 text-6xl mx-auto" />
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-medium tracking-wide">
                Order Confirmation Failed
              </h1>
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
                Transaction Reference ID:{" "}
                {currentOrder?._id || currentOrder?.id || "N/A"}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-8">
            <div className="text-center max-w-lg mx-auto">
              <p className="text-sm text-slate-600 leading-relaxed font-light font-sans text-left">
                We encountered an issue while confirming your order. Your payment
                may have been processed but the order could not be completed. A
                dedicated dn Diamonds concierge representative will contact you
                shortly to assist with resolving this.
              </p>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-center">
              <p className="text-xs text-red-600 font-medium leading-relaxed">
                If your payment was deducted, please do not worry. Our team will
                reach out to you within 2 hours to resolve this. You can also
                contact our support for immediate assistance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
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
