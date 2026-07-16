import { apiRequest } from "@/utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}) => {
    const body = {
      page: params.page || 1,
      limit: params.limit || 10,
    };

    if (params.product_type) {
      body.product_type = params.product_type;
    }
    if (params.subcategory_id) {
      body.subcategory_id = params.subcategory_id;
    }
    if (params.subcategory_slug) {
      body.subcategory_slug = params.subcategory_slug;
    }
    if (params.category_slug) {
      body.category_slug = params.category_slug;
    }
    if (params.sort_by) {
      body.sort_by = params.sort_by;
    }
    if (params.filters) {
      body.filters = params.filters;
    }

    const data = await apiRequest("/api/product/getProduct", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return data.data || { products: [], pagination: {} };
  },
);

export const fetchProductDetail = createAsyncThunk(
  "products/fetchProductDetail",
  async ({ productId, guestId }) => {
    const data = await apiRequest(
      `/api/product/${productId}?guestId=${guestId}`,
    );
    if (data && data.data && data.data.success !== false) {
      return data.data;
    }
    throw new Error("Product not found");
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    pagination: {},
    selectedProduct: null,
    loading: false,
    loadingMore: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearProducts: (state) => {
      state.items = [];
      state.pagination = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.error = null;
        if ((action.meta.arg.page || 1) === 1) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        const { products = [], pagination = {} } = action.payload;
        if ((action.meta.arg.page || 1) === 1) {
          state.items = products;
        } else {
          state.items = [...state.items, ...products];
        }
        state.pagination = pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.error.message;
        if ((action.meta.arg.page || 1) === 1) {
          state.items = [];
        }
      })
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedProduct, clearProducts } = productSlice.actions;
export default productSlice.reducer;
