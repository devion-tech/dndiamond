import { apiRequest } from "@/utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async () => {
        const data = await apiRequest("/api/category/");
        return data.data;
    }
);

const categorySlice = createSlice({
    name: "categories",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || [];
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default categorySlice.reducer;
