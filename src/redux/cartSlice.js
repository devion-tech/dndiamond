import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const resolvePrice = (item, goldPricePerGram = 75.00) => {
    const p = item.product_id || {};
    let metalMultiplier = 1.0;
    const goldType = item.selected_options?.gold_type || "14K Gold";
    if (goldType === "18K Gold") metalMultiplier = 0.75;
    else if (goldType === "14K Gold") metalMultiplier = 0.58;
    else if (goldType === "Platinum") metalMultiplier = 1.35;

    const goldVal = (p.weight || 2.5) * metalMultiplier * goldPricePerGram;

    let gemMultiplier = 1.0;
    const carat = item.selected_options?.carat || 0.5;
    const baseCarat = p.diamondWeight ? p.diamondWeight[0] : 0.5;
    gemMultiplier = Math.pow(carat / (baseCarat || 0.5), 1.8);
    
    const diamondPrice = p.pricing?.diamond_cost || p.price || 600;
    const gemstoneCost = p.pricing?.gemstone_cost || 0;
    const gemVal = (diamondPrice + gemstoneCost) * gemMultiplier;
    const laborVal = p.pricing?.additional_cost || 150;

    const baseVal = Math.round(goldVal + gemVal + laborVal);
    const discountModifier = p.discount ? (baseVal * (p.discount / 100)) : 0;

    return Math.round(baseVal - discountModifier);
};

const getHeaders = (token) => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
};

export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async ({ guestId, token }) => {
        if (!guestId) return [];
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/api/cart/getCart?guest_id=${guestId}`, {
            headers: getHeaders(token)
        });
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        return data.data?.items || [];
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ guestId, productId, quantity, selectedOptions, token }, { dispatch }) => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const body = {
            guest_id: guestId,
            product_id: productId,
            quantity,
            selected_options: {
                gold_type: selectedOptions.goldType,
                color: selectedOptions.goldType.toLowerCase().includes("rose") ? "rose" : (selectedOptions.goldType.toLowerCase().includes("yellow") ? "yellow" : "white"),
                carat: selectedOptions.carat
            }
        };
        const res = await fetch(`${baseUrl}/api/cart/`, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify(body)
        });
        if (res.ok) {
            dispatch(fetchCart({ guestId, token }));
        }
    }
);

export const updateCart = createAsyncThunk(
    "cart/updateCart",
    async ({ guestId, itemId, quantity, token }, { dispatch }) => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/api/cart/updateCart`, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify({ guest_id: guestId, item_id: itemId, quantity })
        });
        if (res.ok) {
            dispatch(fetchCart({ guestId, token }));
        }
    }
);

export const deleteCart = createAsyncThunk(
    "cart/deleteCart",
    async ({ guestId, itemId, token }, { dispatch }) => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/api/cart/deleteCart`, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify({ guest_id: guestId, item_id: itemId })
        });
        if (res.ok) {
            dispatch(fetchCart({ guestId, token }));
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async ({ guestId, token }) => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        await fetch(`${baseUrl}/api/cart/clear?guest_id=${guestId}`, {
            method: "POST",
            headers: getHeaders(token)
        });
        return [];
    }
);

export const mergeCart = createAsyncThunk(
    "cart/mergeCart",
    async ({ guestId, token }, { dispatch }) => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        await fetch(`${baseUrl}/api/cart/merge`, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify({ guest_id: guestId })
        });
        dispatch(fetchCart({ guestId, token }));
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        clearLocalCart(state) {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.map(item => {
                    const p = item.product_id || {};
                    const calculatedPrice = resolvePrice(item);
                    return {
                        cartId: item._id,
                        id: p._id || "",
                        title: p.name || "Atelier Piece",
                        category: p.subcategory_id?.name || p.category_id?.name || "Ring",
                        image: p.images?.[0] || "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&fit=crop",
                        metal: item.selected_options?.gold_type || "14K Gold",
                        carat: item.selected_options?.carat || 0.5,
                        price: calculatedPrice,
                        quantity: item.quantity
                    };
                });
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
            });
    }
});

export const { clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
