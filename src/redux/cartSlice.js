import { getAuthHeaders } from "@/common/token";
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
  async ({ guestId }) => {
    const headers = getAuthHeaders();
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    let url = `${baseUrl}/api/cart/getCart`;
    const token = headers["Authorization"]
      ? headers["Authorization"].split(" ")[1]
      : null;
    if (!headers["Authorization"] || token === "null") {
      url += `?guest_id=${guestId}`;
    }
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch cart");
    const data = await res.json();
    return data.data || [];
  },
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ guestId, productId, quantity, selectedOptions }, { dispatch }) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const headers = getAuthHeaders();
    const token = headers["Authorization"]
      ? headers["Authorization"].split(" ")[1]
      : null;
    const body = {
      product_id: productId,
      quantity,
      selected_options: selectedOptions,
    };
    if (!token || token === "null") {
      body.guest_id = guestId;
    }
    console.log("add to cart --->>>>");
    console.log("token :>> ", token);

    const res = await fetch(`${baseUrl}/api/cart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      dispatch(fetchCart({ guestId }));
    }
  },
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ guestId, itemId, quantity }, { dispatch }) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const headers = getAuthHeaders();

    const body = { item_id: itemId, quantity };
    const token = headers["Authorization"]
      ? headers["Authorization"].split(" ")[1]
      : null;
    if (!token || token === "null") {
      body.guest_id = guestId;
    }

    const res = await fetch(`${baseUrl}/api/cart/updateCart`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
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
    subtotal: 0,
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
        state.subtotal = action?.payload?.subtotal;
        state.total_items = action?.payload?.total_items;
        state.items = action.payload?.items?.map((item) => {
          const p = item.product || {};
          return {
            cartId: item.item_id,
            id: p._id || "",
            title: item?.product?.name || "Atelier Piece",
            category: p.subcategory_id?.name || p.category_id?.name || "Ring",
            image:
              item?.product?.images?.[0] ||
              "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&fit=crop",
            metal: item.selected_options?.gold_type || "14K Gold",
            carat: item?.product?.weight || 0.5,
            price: item?.price_snapshot || 0,
            total: item?.total || 0,
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
