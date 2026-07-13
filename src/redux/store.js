import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./categorySlice";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import productReducer from "./productSlice";
import addressReducer from "./addressSlice";

export const store = configureStore({
    reducer: {
        categories: categoryReducer,
        auth: authReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        products: productReducer,
        address: addressReducer,
    },
});
