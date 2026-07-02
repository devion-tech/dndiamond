import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async () => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const response = await fetch(`${baseUrl}/api/category/`);
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
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
