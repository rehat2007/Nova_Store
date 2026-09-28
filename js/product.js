/* ==========================================================================
   Nova — Product Detail Page
   Loads a single product from the URL's ?id= parameter and wires up the
   size/color pickers, quantity stepper, and add-to-cart button.
   ========================================================================== */

(() => {
  const { Products, Storage, UI } = window.Nova;

  const root = document.querySelector("[data-product-page]");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const product = Products.getById(params.get("id"));

  if (!product) {
    root.innerHTML = `
      <div class="empty-state">
        <h3>We couldn't find that product.</h3>
        <p>It may have sold out or the link may be incorrect.</p>
        <a class="btn btn-primary" href="shop.html">Back to Shop</a>
      </div>`;
    return;
  }

  const state = {
    size: product.sizes[0],
    color: product.colors[0],
    quantity: 1,
  };

  document.title = `${product.name} — Nova`;

  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return `<span class="rating-star" aria-hidden="true">${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}</span> ${rating.toFixed(1)} (${product.reviews} reviews)`;
  };

  root.innerHTML = `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="index.html">Home</a><span aria-hidden="true">/</span>
      <a href="shop.html">Shop</a><span aria-hidden="true">/</span>
      <a href="shop.html?category=${encodeURIComponent(product.category)}">${product.category}</a><span aria-hidden="true">/</span>
      <span aria-current="page">${product.name}</span>
    </nav>

    <div class="product-detail">
      <div class="product-detail__media">
        <img src="${product.image}" alt="${product.name} in ${state.color}" />
      </div>

      <div>
        <p class="product-detail__category">${product.category}</p>
        <h1 class="product-detail__title">${product.name}</h1>
        <p class="product-detail__rating">${renderStars(product.rating)}</p>
        <p class="product-detail__price">${UI.formatPrice(product.price)}</p>
        <p class="product-detail__desc">${product.description}</p>

        <div class="option-group">
          <div class="option-group__label">
            <span>Size</span>
            <span class="selected-value" data-selected-size>${state.size}</span>
          </div>
          <div class="option-pills" role="group" aria-label="Select size" data-size-group>
            ${product.sizes
              .map(
                (size) => `<button type="button" class="option-pill" data-size="${size}" aria-pressed="${size === state.size}">${size}</button>`
              )
              .join("")}
          </div>
        </div>

        <div class="option-group">
          <div class="option-group__label">
            <span>Color</span>
            <span class="selected-value" data-selected-color>${state.color}</span>
          </div>
          <div class="option-pills" role="group" aria-label="Select color" data-color-group>
            ${product.colors
              .map(
                (color) => `<button type="button" class="option-pill" data-color="${color}" aria-pressed="${color === state.color}">${color}</button>`
              )
              .join("")}
          </div>
        </div>

        <div class="option-group">
          <div class="option-group__label"><span>Quantity</span></div>
          <div class="qty-control">
            <button type="button" aria-label="Decrease quantity" data-qty-decrease>−</button>
            <input type="text" inputmode="numeric" value="1" aria-label="Quantity" data-qty-input readonly />
            <button type="button" aria-label="Increase quantity" data-qty-increase>+</button>
          </div>
        </div>

        <div class="product-detail__actions">
          <button type="button" class="btn btn-primary btn-block" data-add-to-cart>Add to Cart</button>
        </div>
        <p class="product-detail__note">Free shipping on orders over $${Storage.FREE_SHIPPING_THRESHOLD}. This is a portfolio demo — no real payment is processed.</p>
      </div>
    </div>
  `;

  const sizeGroup = root.querySelector("[data-size-group]");
  const colorGroup = root.querySelector("[data-color-group]");
  const qtyInput = root.querySelector("[data-qty-input]");

  sizeGroup.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-size]");
    if (!btn) return;
    state.size = btn.dataset.size;
    root.querySelector("[data-selected-size]").textContent = state.size;
    sizeGroup.querySelectorAll(".option-pill").forEach((pill) => pill.setAttribute("aria-pressed", String(pill === btn)));
  });

  colorGroup.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-color]");
    if (!btn) return;
    state.color = btn.dataset.color;
    root.querySelector("[data-selected-color]").textContent = state.color;
    colorGroup.querySelectorAll(".option-pill").forEach((pill) => pill.setAttribute("aria-pressed", String(pill === btn)));
  });

  root.querySelector("[data-qty-decrease]").addEventListener("click", () => {
    state.quantity = Math.max(1, state.quantity - 1);
    qtyInput.value = state.quantity;
  });

  root.querySelector("[data-qty-increase]").addEventListener("click", () => {
    state.quantity += 1;
    qtyInput.value = state.quantity;
  });

  root.querySelector("[data-add-to-cart]").addEventListener("click", () => {
    Storage.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: state.size,
      color: state.color,
      quantity: state.quantity,
    });
    UI.showToast("✓ Added to your cart");
  });
})();
