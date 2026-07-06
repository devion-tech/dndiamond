import { createAsyncThunk } from "@reduxjs/toolkit";

export const toggleWishlistApi = createAsyncThunk(
    "wishlist/toggleApi",
    async ({ product, token }, { dispatch }) => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        if (!token) {
            if (typeof window !== "undefined") {
                const local = localStorage.getItem("praya_wishlist");
                const list = local ? JSON.parse(local) : [];
                const idx = list.findIndex(item => item.id === product.id);
                if (idx !== -1) {
                    list.splice(idx, 1);
                } else {
                    list.push(product);
                }
                localStorage.setItem("praya_wishlist", JSON.stringify(list));
                return list;
            }
            return [];
        }
        try {
            const res = await fetch(`${baseUrl}/api/wishlist/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ product_id: product.id })
            });
            if (!res.ok) {
                throw new Error(`Failed to toggle wishlist: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
);