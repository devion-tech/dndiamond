import { getAuthHeaders } from "@/common/token";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const headers = getAuthHeaders();

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

    const response = await fetch(`${baseUrl}/api/product/getProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data.data || { products: [], pagination: {} };
  },
);

export const fetchProductDetail = createAsyncThunk(
  "products/fetchProductDetail",
  async (productId) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    const response = await fetch(`${baseUrl}/api/product/${productId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    const data = await response.json();
    if (data && data.success && data.data && data.data.success !== false) {
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
