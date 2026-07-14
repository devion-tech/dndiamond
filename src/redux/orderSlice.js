import { getAuthHeaders } from "@/common/token";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async ({ address_id, promo_code, notes }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`${baseUrl}/api/order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ address_id, promo_code, notes }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to place order");
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to connect to server",
      );
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: null,
    placing: false,
    error: null,
  },
  reducers: {
    clearOrder(state) {
      state.currentOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.placing = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.placing = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.placing = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
