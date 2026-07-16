import { apiRequest } from "@/utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const resolveCategoryName = (categoryField, subcategoryField) => {
  if (
    categoryField &&
    typeof categoryField === "object" &&
    categoryField.name
  ) {
    const name = categoryField.name.toLowerCase();
    if (name === "bracelets" || name === "bracelet") return "Bracelet & Bangle";
    if (name === "ring") return "Ring";
    if (name === "earring") return "Earring";
    if (name === "necklace") return "Necklace";
    if (name === "pendant") return "Pendant";
    return categoryField.name;
  }
  const id =
    typeof categoryField === "string"
      ? categoryField
      : categoryField?._id || subcategoryField?.parent_id;
  const idMap = {
    "6a4203b35e05bfd78896e398": "Ring",
    "6a4204e55e05bfd78896e3ba": "Necklace",
    "6a42054a5e05bfd78896e3d1": "Earring",
    "6a4205ca5e05bfd78896e3ec": "Bracelet & Bangle",
  };
  return idMap[id] || "Ring";
};

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async ({ product_id }, { dispatch }) => {
    console.log("product_id", product_id);
    try {
      const data = await apiRequest("/api/wishlist/", {
        method: "POST",
        body: JSON.stringify({ product_id: product_id }),
      });
      return data;
    } catch (error) {
      throw error;
    }
  },
);

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async () => {
    console.log("called");
    const data = await apiRequest("/api/wishlist/?page=1&limit=50");
    return data.data || [];
  },
);

export const toggleWishlistApi = async ({ product }) => {
  const data = await apiRequest("/api/wishlist/", {
    method: "POST",
    body: JSON.stringify({ product_id: product.id }),
  });
  return data;
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearLocalWishlist(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.total = action.payload?.total || 0;
        state.items = action.payload?.products?.map((p) => {
          if (p && (p._id || p.id)) {
            return {
              id: p._id || p.id,
              title: p.name || p.title || "Atelier Piece",
              category:
                resolveCategoryName(p.category_id, p.subcategory_id) ||
                p.category ||
                "Ring",
              image:
                p.images && p.images[0]
                  ? p.images[0]
                  : p.image ||
                    "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&fit=crop",
              description: p.description || "",
              discount: p.discount || 0,
              metalType: p.metalType || ["14K Gold", "18K Gold", "Platinum"],
              diamondWeight: p.diamondWeight || [0.5],
              goldWeight: p.weight || 2.5,
              diamondPrice: p.pricing?.diamond_cost || p.diamondPrice || 600,
              makingCharges:
                p.pricing?.additional_cost || p.makingCharges || 150,
              display_price: p?.display_price,
            };
          }
          return p; // guest fallback
        });
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (action.payload) {
          state.total = action.payload?.data?.count || 0;
        }
      });
  },
});

export const { clearLocalWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
