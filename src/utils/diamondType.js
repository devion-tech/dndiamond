const STORAGE_KEY = "dndiamond_diamond_type";

export function getDiamondType() {
  if (typeof window === "undefined") return "natural";
  return localStorage.getItem(STORAGE_KEY) || "natural";
}

export function setDiamondType(type) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, type);
}
