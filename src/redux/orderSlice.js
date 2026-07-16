import { apiRequest } from "@/utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async ({ address_id, promo_code, notes }, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/api/order/", {
        method: "POST",
        body: JSON.stringify({ address_id, promo_code, notes }),
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
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
