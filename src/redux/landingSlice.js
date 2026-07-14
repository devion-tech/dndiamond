import { getAuthHeaders } from "@/common/token";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const fetchMainPage = createAsyncThunk(
  "landing/fetchMainPage",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`${baseUrl}/api/user/mainPage`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message || "Failed to fetch main page data",
        );
      }
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to connect to server");
    }
  },
);

const landingSlice = createSlice({
  name: "landing",
  initialState: {
    items: [],
    bestProducts: [],
    loading: false,
    error: null,
    selectedAddressId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMainPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMainPage.fulfilled, (state, action) => {
        console.log("action?.payload :>> ", action?.payload);
        state.loading = false;
        state.items = action.payload?.image;
        state.bestProducts = action.payload?.best_selling_products;
      })
      .addCase(fetchMainPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedAddress, clearAddressError } = landingSlice.actions;
export default landingSlice.reducer;
