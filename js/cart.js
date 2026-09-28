/* ==========================================================================
   Nova — Cart Page
   Renders cart lines from LocalStorage, wires up quantity controls and
   removal, and keeps the order summary in sync with every change.
   ========================================================================== */

(() => {
  const { Storage, UI } = window.Nova;

  const itemsContainer = document.querySelector("[data-cart-items]");
  const emptyState = document.querySelector("[data-cart-empty]");
  const layout = document.querySelector("[data-cart-layout]");
  const subtotalEl = document.querySelector("[data-cart-subtotal]");
  const shippingEl = document.querySelector("[data-cart-shipping]");
  const totalEl = document.querySelector("[data-cart-total]");
  const freeShippingNote = document.querySelector("[data-free-shipping-note]");

  if (!itemsContainer) return;

  const renderLine = (line) => {
    const el = document.createElement("li");
    el.className = "cart-item";
    el.innerHTML = `
      <div class="cart-item__media"><img src="${line.image}" alt="${line.name}" /></div>
      <div>
        <div class="cart-item__top">
          <div>
            <p class="cart-item__name">${line.name}</p>
            <p class="cart-item__variant">${line.size} · ${line.color}</p>
            <p class="cart-item__price">${UI.formatPrice(line.price)} each</p>
          </div>
        </div>
        <div class="cart-item__bottom">
          <div class="qty-control">
            <button type="button" aria-label="Decrease quantity for ${line.name}" data-decrease>−</button>
            <input type="text" inputmode="numeric" value="${line.quantity}" aria-label="Quantity" data-qty readonly />
            <button type="button" aria-label="Increase quantity for ${line.name}" data-increase>+</button>
          </div>
          <span class="cart-item__subtotal">${UI.formatPrice(line.price * line.quantity)}</span>
        </div>
        <button type="button" class="cart-item__remove" data-remove>Remove</button>
      </div>
    `;

    el.querySelector("[data-decrease]").addEventListener("click", () => {
      if (line.quantity <= 1) return;
      Storage.updateQuantity(line.id, line.size, line.color, line.quantity - 1);
      render();
    });

    el.querySelector("[data-increase]").addEventListener("click", () => {
      Storage.updateQuantity(line.id, line.size, line.color, line.quantity + 1);
      render();
    });

    el.querySelector("[data-remove]").addEventListener("click", () => {
      Storage.removeFromCart(line.id, line.size, line.color);
      UI.showToast("✓ Item removed from cart");
      render();
    });

    return el;
  };

  const render = () => {
    const cart = Storage.getCart();

    if (cart.length === 0) {
      layout.hidden = true;
      emptyState.hidden = false;
      return;
    }

    layout.hidden = false;
    emptyState.hidden = true;

    itemsContainer.innerHTML = "";
    cart.forEach((line) => itemsContainer.appendChild(renderLine(line)));

    const { subtotal, shipping, total, qualifiesForFreeShipping, amountToFreeShipping } = Storage.getCartTotals();
    subtotalEl.textContent = UI.formatPrice(subtotal);
    shippingEl.textContent = shipping === 0 ? "Free" : UI.formatPrice(shipping);
    totalEl.textContent = UI.formatPrice(total);

    if (freeShippingNote) {
      freeShippingNote.textContent = qualifiesForFreeShipping
        ? "You've unlocked free shipping."
        : `Add ${UI.formatPrice(amountToFreeShipping)} more for free shipping.`;
    }
  };

  render();
})();
