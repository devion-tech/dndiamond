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

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (
    {
      page = 1,
      limit = 10,
      order_status = "",
      payment_status = "",
      search = "",
      start_date = "",
      end_date = "",
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", limit);
      if (order_status) params.set("order_status", order_status);
      if (payment_status) params.set("payment_status", payment_status);
      if (search) params.set("search", search);
      if (start_date) params.set("start_date", start_date);
      if (end_date) params.set("end_date", end_date);

      const data = await apiRequest(`/api/order/myOrders?${params.toString()}`);
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
    myOrders: [],
    myOrdersPagination: null,
    loadingOrders: false,
    ordersError: null,
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
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loadingOrders = true;
        state.ordersError = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loadingOrders = false;
        state.myOrders = action.payload.orders;
        state.myOrdersPagination = action.payload.pagination;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loadingOrders = false;
        state.ordersError = action.payload;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
