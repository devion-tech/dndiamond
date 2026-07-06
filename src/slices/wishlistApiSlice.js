const token =
  typeof window !== "undefined" ? localStorage.getItem("praya_token") : null;

export const toggleWishlistApi = async ({ product }) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  console.log("token :>> ", token);
  const res = await fetch(`${baseUrl}/api/wishlist/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: product.id }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update wishlist.");
  }

  return data;
};
