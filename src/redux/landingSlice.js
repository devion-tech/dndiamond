import { apiRequest } from "@/utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMainPage = createAsyncThunk(
  "landing/fetchMainPage",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/api/user/mainPage");
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
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
