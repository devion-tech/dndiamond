import { apiRequest } from "@/utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const submitInquiry = createAsyncThunk(
  "inquiry/submitInquiry",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/api/inquiry", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const inquirySlice = createSlice({
  name: "inquiry",
  initialState: {
    result: null,
    submitting: false,
    error: null,
  },
  reducers: {
    clearInquiry(state) {
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitInquiry.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitInquiry.fulfilled, (state, action) => {
        state.submitting = false;
        state.result = action.payload;
      })
      .addCase(submitInquiry.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearInquiry } = inquirySlice.actions;
export default inquirySlice.reducer;
