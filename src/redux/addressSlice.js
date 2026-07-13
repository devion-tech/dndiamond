import { getAuthHeaders } from "@/common/token";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`${baseUrl}/api/address`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch addresses");
      }
      return data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to connect to server",
      );
    }
  },
);

export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`${baseUrl}/api/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(addressData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to save address");
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to connect to server",
      );
    }
  },
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    items: [],
    loading: false,
    saving: false,
    error: null,
    selectedAddressId: null,
  },
  reducers: {
    setSelectedAddress(state, action) {
      state.selectedAddressId = action.payload;
    },
    clearAddressError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        if (action.payload.length > 0 && !state.selectedAddressId) {
          state.selectedAddressId = action.payload[0]._id;
        }
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
        state.selectedAddressId = action.payload._id;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedAddress, clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
