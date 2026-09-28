/* ==========================================================================
   Nova — Checkout Page
   Renders the order summary from the cart, validates the checkout form,
   and shows a success state on submit. Nothing here contacts a server —
   this is a frontend-only demo, as the brief requires.
   ========================================================================== */

(() => {
  const { Storage, UI } = window.Nova;

  const summaryList = document.querySelector("[data-order-summary]");
  const form = document.querySelector("[data-checkout-form]");
  const checkoutView = document.querySelector("[data-checkout-view]");
  const confirmationView = document.querySelector("[data-confirmation-view]");

  if (!form) return;

  const subtotalEl = document.querySelector("[data-checkout-subtotal]");
  const shippingEl = document.querySelector("[data-checkout-shipping]");
  const totalEl = document.querySelector("[data-checkout-total]");

  const renderSummary = () => {
    const cart = Storage.getCart();

    if (cart.length === 0) {
      window.location.href = "cart.html";
      return;
    }

    summaryList.innerHTML = cart
      .map(
        (line) => `
        <div class="summary-row">
          <span>${line.name} × ${line.quantity}<br><small style="color: var(--color-muted)">${line.size} · ${line.color}</small></span>
          <span>${UI.formatPrice(line.price * line.quantity)}</span>
        </div>`
      )
      .join("");

    const { subtotal, shipping, total } = Storage.getCartTotals();
    subtotalEl.textContent = UI.formatPrice(subtotal);
    shippingEl.textContent = shipping === 0 ? "Free" : UI.formatPrice(shipping);
    totalEl.textContent = UI.formatPrice(total);
  };

  /* ---- Validation ---- */
  const validators = {
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Enter a valid email address.",
    phone: (value) => value.trim().length >= 7 || "Enter a valid phone number.",
    fullName: (value) => value.trim().length >= 2 || "Enter your full name.",
    address: (value) => value.trim().length >= 4 || "Enter your street address.",
    city: (value) => value.trim().length >= 2 || "Enter your city.",
    postalCode: (value) => value.trim().length >= 3 || "Enter a valid postal code.",
    country: (value) => value.trim().length >= 2 || "Enter your country.",
    cardNumber: (value) => /^[\d\s]{13,19}$/.test(value.trim()) || "Enter a valid 13–19 digit card number.",
    cardExpiry: (value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value.trim()) || "Use MM/YY format.",
    cardCvv: (value) => /^\d{3,4}$/.test(value.trim()) || "Enter a valid CVV.",
    cardName: (value) => value.trim().length >= 2 || "Enter the name on the card.",
  };

  const showFieldError = (field, message) => {
    const wrapper = field.closest(".field");
    wrapper.classList.add("has-error");
    field.setAttribute("aria-invalid", "true");
    const errorEl = wrapper.querySelector(".field-error");
    if (errorEl) errorEl.textContent = message;
  };

  const clearFieldError = (field) => {
    const wrapper = field.closest(".field");
    wrapper.classList.remove("has-error");
    field.removeAttribute("aria-invalid");
  };

  const validateField = (field) => {
    const validator = validators[field.name];
    if (!validator) return true;
    const result = validator(field.value);
    if (result === true) {
      clearFieldError(field);
      return true;
    }
    showFieldError(field, result);
    return false;
  };

  form.querySelectorAll("input").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".field").classList.contains("has-error")) validateField(field);
    });
  });

  const generateOrderId = () => `NV-${Date.now().toString().slice(-8)}`;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fields = [...form.querySelectorAll("input")];
    const isValid = fields.map(validateField).every(Boolean);

    if (!isValid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      firstInvalid?.focus();
      UI.showToast("Please fix the highlighted fields");
      return;
    }

    const orderId = generateOrderId();
    document.querySelector("[data-order-id]").textContent = orderId;

    Storage.clearCart();
    checkoutView.hidden = true;
    confirmationView.hidden = false;
    confirmationView.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  renderSummary();
})();
