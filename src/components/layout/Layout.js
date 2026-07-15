"use client";

import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "../ui/CartDrawer";
import WishlistDrawer from "../ui/WishlistDrawer";

export default function Layout({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] text-primary font-sans">
      {/* Header layout */}
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      {/* Main content body */}
      <main className="flex-1 w-full flex flex-col ">{children}</main>

      {/* Footer layout */}
      <Footer />

      {/* Global Drawer Panels */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
      />
    </div>
  );
}
