"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useStore } from "@/context/StoreContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "@/redux/orderSlice";
import { FaSearch, FaInbox, FaFileDownload } from "react-icons/fa";
import jsPDF from "jspdf";

const STATUS_STYLES = {
  processing: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  confirmed: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  shipped: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  delivered: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

function getStatusStyle(status) {
  return (
    STATUS_STYLES[status] || {
      bg: "bg-neutral-50",
      text: "text-neutral-700",
      dot: "bg-neutral-400",
    }
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPriceRaw(amount) {
  return Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function generateInvoicePDF(order, formatPrice) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth / 2, y, { align: "center" });
  y += 10;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text("Order Invoice", pageWidth / 2, y, { align: "center" });
  y += 12;

  // Divider
  doc.setDrawColor(200);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;

  // Order Info
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Order Number:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(order.order_number, 60, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.text("Order Date:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(order.createdAt), 60, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.text("Payment Status:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(order.payment_status.toUpperCase(), 60, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.text("Order Status:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(order.order_status.toUpperCase(), 60, y);
  y += 12;

  // Shipping Address
  doc.setDrawColor(200);
  doc.line(20, y, pageWidth - 20, y);
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Shipping Address", 20, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const addr = order.address;
  doc.text(
    `${addr.first_name} ${addr.last_name}`,
    20,
    y,
  );
  y += 5;
  doc.text(
    `${addr.address_line_1}${addr.address_line_2 ? ", " + addr.address_line_2 : ""}`,
    20,
    y,
  );
  y += 5;
  doc.text(
    `${addr.city}, ${addr.state} - ${addr.postal_code}`,
    20,
    y,
  );
  y += 5;
  doc.text(`${addr.country}`, 20, y);
  y += 5;
  doc.text(`Phone: ${addr.mobile} | Email: ${addr.email}`, 20, y);
  y += 12;

  // Products Table Header
  doc.setDrawColor(200);
  doc.line(20, y, pageWidth - 20, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Item", 20, y);
  doc.text("Details", 80, y);
  doc.text("Qty", 130, y);
  doc.text("Price", 150, y);
  doc.text("Total", 175, y);
  y += 7;
  doc.setDrawColor(200);
  doc.line(20, y, pageWidth - 20, y);
  y += 6;

  // Product Rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  order.products.forEach((product) => {
    const nameLines = doc.splitTextToSize(product.name, 55);
    doc.text(nameLines, 20, y);

    const detailsText = `${product.selected_options.gold_type} / ${product.selected_options.colors}`;
    doc.text(detailsText, 80, y);

    doc.text(String(product.quantity), 133, y);

    doc.text(`Rs.${formatPriceRaw(product.price)}`, 150, y);
    doc.text(`Rs.${formatPriceRaw(product.total_price)}`, 175, y);

    y += Math.max(nameLines.length * 5, 7) + 4;
  });

  // Totals
  y += 2;
  doc.setDrawColor(200);
  doc.line(120, y, pageWidth - 20, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", 130, y);
  doc.text(`Rs.${formatPriceRaw(order.subtotal)}`, 175, y);
  y += 6;

  doc.text("Shipping:", 130, y);
  doc.text(
    order.shipping_charge === 0
      ? "Free"
      : `Rs.${formatPriceRaw(order.shipping_charge)}`,
    175,
    y,
  );
  y += 6;

  if (order.discount_amount > 0) {
    doc.text("Discount:", 130, y);
    doc.text(`-Rs.${formatPriceRaw(order.discount_amount)}`, 175, y);
    y += 6;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Total:", 130, y);
  doc.text(`Rs.${formatPriceRaw(order.total_amount)}`, 175, y);
  y += 14;

  // Footer
  doc.setDrawColor(200);
  doc.line(20, y, pageWidth - 20, y);
  y += 8;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text("Thank you for your purchase!", pageWidth / 2, y, { align: "center" });

  doc.save(`invoice-${order.order_number}.pdf`);
}

export default function OrdersPage() {
  const { formatPrice } = useStore();
  const dispatch = useDispatch();
  const { myOrders, myOrdersPagination, loadingOrders, ordersError } =
    useSelector((state) => state.order);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(fetchMyOrders({ page, limit: 10, search: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  return (
    <Layout>
      <div className="bg-[#FAF9F6] min-h-screen py-10 md:py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-neutral-200">
            <div>
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.25em]">
                My Orders
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-light text-neutral-900 uppercase tracking-wider mt-1">
                Order History
              </h1>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <FaSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                size={12}
              />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-neutral-200 py-2 pl-9 pr-4 text-xs tracking-wider focus:outline-none focus:border-neutral-400 transition-colors text-neutral-800 placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Loading */}
          {loadingOrders && myOrders.length === 0 && (
            <div className="text-center py-20 text-xs text-neutral-400 uppercase tracking-widest">
              Loading orders...
            </div>
          )}

          {/* Error */}
          {ordersError && (
            <div className="text-center py-12 text-xs text-red-500">
              {ordersError}
            </div>
          )}

          {/* Empty */}
          {!loadingOrders && !ordersError && myOrders.length === 0 && (
            <div className="bg-white border border-neutral-200 p-16 text-center space-y-4">
              <div className="h-14 w-14 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-400 mx-auto border border-neutral-200">
                <FaInbox size={18} />
              </div>
              <h3 className="font-serif text-lg text-neutral-900">
                No Orders Yet
              </h3>
              <p className="text-xs text-neutral-500 font-light">
                You haven&apos;t placed any orders yet.
              </p>
            </div>
          )}

          {/* Order Cards */}
          {myOrders.length > 0 && (
            <div className="space-y-4">
              {myOrders.map((order) => {
                const statusStyle = getStatusStyle(order.order_status);

                return (
                  <div
                    key={order._id}
                    className="bg-white border border-neutral-200/80 hover:border-neutral-300 transition-all duration-200"
                  >
                    {/* Order Header */}
                    <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div>
                          <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-[0.2em] block">
                            Order
                          </span>
                          <span className="font-mono text-xs font-semibold text-neutral-900">
                            {order.order_number}
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-[0.2em] block">
                            Date
                          </span>
                          <span className="text-xs text-neutral-600">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-[0.2em] block">
                            Items
                          </span>
                          <span className="text-xs text-neutral-600">
                            {order.products.length}{" "}
                            {order.products.length === 1 ? "item" : "items"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-[0.2em] block">
                            Total
                          </span>
                          <span className="text-xs font-semibold text-neutral-900">
                            {formatPrice(order.total_amount)}
                          </span>
                        </div>
                      </div>

                      {/* Status + Download Invoice */}
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                          ></span>
                          {order.order_status}
                        </span>

                        <button
                          onClick={() => generateInvoicePDF(order, formatPrice)}
                          className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          <FaFileDownload size={10} />
                          Invoice
                        </button>
                      </div>
                    </div>

                    {/* Always Visible Details */}
                    <div className="border-t border-neutral-100 px-5 py-4 space-y-4 bg-[#FAF9F6]/30">
                      {/* Product List */}
                      <div className="space-y-3">
                        {order.products.map((product) => (
                          <div
                            key={product.product_id}
                            className="flex items-center gap-4"
                          >
                            <div className="h-14 w-14 border border-neutral-200 overflow-hidden bg-neutral-50 shrink-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-neutral-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-[10px] text-neutral-500 mt-0.5">
                                {product.selected_options.gold_type} •{" "}
                                {product.selected_options.colors} • Qty:{" "}
                                {product.quantity}
                              </p>
                            </div>
                            <span className="text-xs font-medium text-neutral-900 shrink-0">
                              {formatPrice(product.total_price)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Address */}
                      <div className="pt-3 border-t border-neutral-100">
                        <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-[0.2em] block mb-1">
                          Shipping To
                        </span>
                        <p className="text-[11px] text-neutral-600 leading-relaxed">
                          {order.address.first_name}{" "}
                          {order.address.last_name},{" "}
                          {order.address.address_line_1},{" "}
                          {order.address.city}, {order.address.state},{" "}
                          {order.address.country} -{" "}
                          {order.address.postal_code}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {myOrdersPagination && myOrdersPagination.total_pages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border border-neutral-200 text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-neutral-500">
                Page {myOrdersPagination.page} of{" "}
                {myOrdersPagination.total_pages}
              </span>
              <button
                disabled={page >= myOrdersPagination.total_pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border border-neutral-200 text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
