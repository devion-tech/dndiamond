"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById, clearOrderDetail } from "@/redux/orderSlice";
import { fetchCart } from "@/redux/cartSlice";
import Layout from "@/components/layout/Layout";
import confetti from "canvas-confetti";
import { FaCheckCircle, FaPrint } from "react-icons/fa";
import { useStore } from "@/context/StoreContext";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const dispatch = useDispatch();
  const { formatPrice } = useStore();

  const { orderDetail, loadingOrderDetail, orderDetailError } = useSelector(
    (state) => state.order,
  );

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
    const guestId = localStorage.getItem("praya_guestId") || "";
    dispatch(fetchCart({ guestId }));
    return () => dispatch(clearOrderDetail());
  }, [orderId, dispatch]);

  useEffect(() => {
    if (orderDetail) {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#121212", "#A3E635", "#FFFFFF", "#CCCCCC", "#D4AF37"],
      });
    }
  }, [orderDetail]);

  const order = orderDetail;
  const addr = order?.address;
  const addressStr =
    typeof addr === "string"
      ? addr
      : addr
        ? `${addr?.address_line_1}${addr?.address_line_2 ? ", " + addr?.address_line_2 : ""}, ${addr?.city}, ${addr?.state}, ${addr?.country} - ${addr?.postal_code}`
        : "";

  return (
    <div className="bg-slate-background min-h-screen py-12 px-4 md:px-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden animate-fade-in print:shadow-none print:border-none print:my-0">
        {/* Header */}
        <div className="bg-neutral-900 text-white py-8 px-6 text-center print:bg-white print:text-black">
          <FaCheckCircle className="text-lime-400 text-5xl mx-auto mb-3 animate-bounce print:hidden" />
          <h1 className="text-xl md:text-2xl font-medium">
            Order Placed Successfully!
          </h1>
          {order && (
            <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest mt-2">
              {order.order_number}
            </p>
          )}
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Loading */}
          {loadingOrderDetail && (
            <div className="flex items-center justify-center py-12 gap-3">
              <div className="h-6 w-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                Loading Order Details...
              </span>
            </div>
          )}

          {/* Error */}
          {orderDetailError && (
            <div className="text-center py-10 space-y-3">
              <p className="text-sm text-red-500">{orderDetailError}</p>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl"
              >
                Continue Shopping
              </button>
            </div>
          )}

          {/* Order Details */}
          {order && !loadingOrderDetail && (
            <>
              <p className="text-sm text-slate-500 text-center">
                Your order is confirmed. Our concierge will contact you within
                2 hours.
              </p>

              {/* Products */}
              {order.products?.length > 0 && (
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  {order.products.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-slate-50 rounded-xl p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {item.name}
                        </p>
                        {item.selected_options && (
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {Object.entries(item.selected_options)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" · ")}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-slate-800">
                          {formatPrice(item.total_price)}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Address + Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                {addressStr && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Shipping Address
                    </p>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {addressStr}
                      </p>
                      {addr?.mobile && (
                        <p className="text-[11px] text-slate-400 mt-1">
                          Phone: {addr.mobile}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Order Summary
                  </p>
                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-slate-600">
                        {formatPrice(order.subtotal)}
                      </span>
                    </div>
                    {order.shipping_charge != null && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Shipping</span>
                        <span className="text-slate-600">
                          {order.shipping_charge === 0
                            ? "Free"
                            : formatPrice(order.shipping_charge)}
                        </span>
                      </div>
                    )}
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Discount</span>
                        <span className="text-green-600">
                          -{formatPrice(order.discount_amount)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-1.5 flex justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase">
                        Total
                      </span>
                      <span className="text-sm font-extrabold text-black">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                      <span className="uppercase">
                        {order.payment_gateway}
                      </span>
                      <span className="uppercase">
                        {order.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center pt-3 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
                >
                  <FaPrint /> Print Receipt
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="px-7 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="bg-slate-background min-h-screen py-12 px-4 md:px-8 font-sans flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <OrderSuccessContent />
      </Suspense>
    </Layout>
  );
}
