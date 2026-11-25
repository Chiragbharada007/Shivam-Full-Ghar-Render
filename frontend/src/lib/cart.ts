// src/lib/cart.ts
"use client";

export interface CartItem {
  id: string; // unique item key: `${productId}-${optionId || 'default'}-${selectedAddons.join('_')}`
  productId: string;
  productCode: string;
  name: string;
  price: number; // in paise
  quantity: number;
  image?: string;
  optionId?: string;
  optionLabel?: string;
  addOns?: Array<{ label: string; price: number }>;
  prepTimeDays: number;
}

const CART_STORAGE_KEY = "sfg_cart_items";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read cart from localStorage:", e);
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  } catch (e) {
    console.error("Failed to save cart to localStorage:", e);
  }
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const existingIndex = cart.findIndex((i) => i.id === item.id);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function updateCartQuantity(id: string, quantity: number): void {
  const cart = getCart();
  if (quantity <= 0) {
    const filtered = cart.filter((i) => i.id !== id);
    saveCart(filtered);
  } else {
    const item = cart.find((i) => i.id === id);
    if (item) {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

export function removeFromCart(id: string): void {
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
  window.dispatchEvent(new Event("cart-updated"));
}

export function getCartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => {
    const addOnTotal = (item.addOns || []).reduce((acc, a) => acc + a.price, 0);
    return sum + (item.price + addOnTotal) * item.quantity;
  }, 0);

  const maxPrepDays = items.reduce((max, item) => Math.max(max, item.prepTimeDays || 2), 2);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return { subtotal, maxPrepDays, itemCount };
}
