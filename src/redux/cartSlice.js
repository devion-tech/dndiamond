import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const resolvePrice = (item, goldPricePerGram = 75.0) => {
  const p = item.product_id || {};
  let metalMultiplier = 1.0;
  const goldType = (item.selected_options?.gold_type || "14k").toLowerCase();
  if (goldType === "18k" || goldType === "18k gold") metalMultiplier = 0.75;
  else if (goldType === "14k" || goldType === "14k gold")
    metalMultiplier = 0.58;
  else if (goldType === "22k" || goldType === "22k gold") metalMultiplier = 1.1;
  else if (goldType === "24k" || goldType === "24k gold") metalMultiplier = 1.2;
  else if (goldType === "10k" || goldType === "10k gold")
    metalMultiplier = 0.42;
  else if (goldType === "platinum") metalMultiplier = 1.35;

  const goldVal = (p.weight || 2.5) * metalMultiplier * goldPricePerGram;

  const diamondPrice = p.pricing?.diamond_cost || p.price || 600;
  const gemstoneCost = p.pricing?.gemstone_cost || 0;
  const gemVal = diamondPrice + gemstoneCost;
  const laborVal = p.pricing?.additional_cost || 150;

  const baseVal = Math.round(goldVal + gemVal + laborVal);
  const discountModifier = p.discount ? baseVal * (p.discount / 100) : 0;

  return Math.round(baseVal - discountModifier);
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ guestId, token }) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    let url = `${baseUrl}/api/cart/getCart`;
    const headers = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else if (guestId) {
      url += `?guest_id=${guestId}`;
    } else {
      return [];
    }

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error("Failed to fetch cart");
    const data = await res.json();
    return data.data?.items || [];
  },
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ guestId, productId, quantity, selectedOptions, token }, { dispatch }) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const body = {
      product_id: productId,
      quantity,
      selected_options: selectedOptions,
    };
    if (token) {
      body.guest_id = undefined;
    } else {
      body.guest_id = guestId;
    }
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${baseUrl}/api/cart/`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (res.ok) {
      dispatch(fetchCart({ guestId, token }));
    }
  },
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ guestId, itemId, quantity, token }, { dispatch }) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const body = { item_id: itemId, quantity };
    if (!token) body.guest_id = guestId;

    const res = await fetch(`${baseUrl}/api/cart/updateCart`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (res.ok) {
      dispatch(fetchCart({ guestId, token }));
    }
  },
);

export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async ({ guestId, itemId, token }, { dispatch }) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const body = { item_id: itemId };
    if (!token) body.guest_id = guestId;

    const res = await fetch(`${baseUrl}/api/cart/deleteCart`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (res.ok) {
      dispatch(fetchCart({ guestId, token }));
    }
  },
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async ({ guestId, token }) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let url = `${baseUrl}/api/cart/clear`;
    if (!token && guestId) url += `?guest_id=${guestId}`;

    await fetch(url, { method: "POST", headers });
    return [];
  },
);

export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId, token }, { dispatch }) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    await fetch(`${baseUrl}/api/cart/merge`, {
      method: "POST",
      headers,
      body: JSON.stringify({ guest_id: guestId }),
    });
    dispatch(fetchCart({ guestId, token }));
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearLocalCart(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map((item) => {
          const p = item.product_id || {};
          const calculatedPrice = resolvePrice(item);
          return {
            cartId: item._id,
            id: p._id || "",
            title: p.name || "Atelier Piece",
            category: p.subcategory_id?.name || p.category_id?.name || "Ring",
            image:
              p.images?.[0] ||
              "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&fit=crop",
            metal: item.selected_options?.gold_type || "14K Gold",
            carat: item.selected_options?.carat || 0.5,
            price: calculatedPrice,
            quantity: item.quantity,
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
  },
});

export const { clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
