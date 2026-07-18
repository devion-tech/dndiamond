"use client";

import { getAuthHeaders } from "@/common/token";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const getCurrency = () => {
  if (typeof window === "undefined") return "HKD";

  const region = localStorage.getItem("praya_region") || "HK";

  const currencyMap = {
    HK: "HKD",
    AU: "AUD",
    NZ: "NZD",
  };

  return currencyMap[region] || "HKD";
};

export const apiRequest = async (url, options = {}) => {
  const headers = getAuthHeaders();

  const res = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-currency": getCurrency(),
      ...headers,
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (res.status === 401) {
    const { store } = await import("@/redux/store");
    const { openModal } = await import("@/redux/authSlice");

    store.dispatch(openModal());
    throw new Error("Unauthorized");
  }

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
