/* ==========================================================================
   Nova — Storage & Shared UI Utilities
   Everything the cart needs to persist itself in LocalStorage, plus small
   UI helpers (toast, cart badge, price formatting) reused on every page.
   ========================================================================== */

window.Nova = window.Nova || {};

(() => {
  const CART_KEY = "nova-cart";
  const FREE_SHIPPING_THRESHOLD = 100;
  const SHIPPING_COST = 5;

  /* ---- Core read/write ---- */
  const getCart = () => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error("Nova: could not read cart from storage", error);
      return [];
    }
  };

  const saveCart = (cart) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      updateCartBadge();
    } catch (error) {
      console.error("Nova: could not save cart to storage", error);
    }
  };

  // A single cart line is unique by product id + size + color, so the same
  // product in a different size doesn't merge with another line.
  const findLineIndex = (cart, id, size, color) =>
    cart.findIndex((line) => line.id === id && line.size === size && line.color === color);

  const addToCart = ({ id, name, price, image, size, color, quantity = 1 }) => {
    const cart = getCart();
    const existingIndex = findLineIndex(cart, id, size, color);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ id, name, price, image, size, color, quantity });
    }

    saveCart(cart);
    return cart;
  };

  const removeFromCart = (id, size, color) => {
    const cart = getCart().filter(
      (line) => !(line.id === id && line.size === size && line.color === color)
    );
    saveCart(cart);
    return cart;
  };

  const updateQuantity = (id, size, color, quantity) => {
    const cart = getCart();
    const index = findLineIndex(cart, id, size, color);
    if (index === -1) return cart;

    cart[index].quantity = Math.max(1, quantity);
    saveCart(cart);
    return cart;
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartCount = () => getCart().reduce((total, line) => total + line.quantity, 0);

  const getCartSubtotal = () =>
    getCart().reduce((total, line) => total + line.price * line.quantity, 0);

  const getShippingCost = (subtotal) => (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST);

  const getCartTotals = () => {
    const subtotal = getCartSubtotal();
    const shipping = getShippingCost(subtotal);
    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
      qualifiesForFreeShipping: subtotal >= FREE_SHIPPING_THRESHOLD,
      amountToFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    };
  };

  /* ---- Shared UI helpers ---- */
  const formatPrice = (amount) => `$${amount.toFixed(2)}`;

  const updateCartBadge = () => {
    const count = getCartCount();
    document.querySelectorAll("[data-cart-badge]").forEach((badge) => {
      badge.textContent = count > 99 ? "99+" : String(count);
      badge.classList.toggle("is-visible", count > 0);
    });
  };

  let toastTimer = null;

  const showToast = (message) => {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("role", "status");
      stack.setAttribute("aria-live", "polite");
      document.body.appendChild(stack);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    stack.appendChild(toast);

    window.setTimeout(() => {
      toast.classList.add("is-leaving");
      toast.addEventListener("animationend", () => toast.remove(), { once: true });
    }, 2600);
  };

  window.Nova.Storage = {
    getCart,
    saveCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartSubtotal,
    getShippingCost,
    getCartTotals,
    FREE_SHIPPING_THRESHOLD,
  };

  window.Nova.UI = {
    formatPrice,
    updateCartBadge,
    showToast,
  };
})();
