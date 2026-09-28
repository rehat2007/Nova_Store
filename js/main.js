/* ==========================================================================
   Nova — Main
   Shared navbar/back-to-top behavior (runs on every page) plus the homepage
   shop section: category deep-links, search, filter, and sort — all
   rendered in place without a page reload.
   ========================================================================== */

(() => {
  const { Products, Storage, UI } = window.Nova;

  /* ------------------------------------------------------------------
     Shared chrome: mobile menu, scroll shadow, back-to-top
     ------------------------------------------------------------------ */
  const initNavbar = () => {
    const navbar = document.querySelector(".navbar");
    const toggle = document.querySelector("[data-menu-open]");
    const closeBtn = document.querySelector("[data-menu-close]");
    const menu = document.querySelector(".mobile-menu");
    const scrim = document.querySelector("[data-menu-scrim]");

    const openMenu = () => {
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };

    const closeMenu = () => {
      menu.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    toggle?.addEventListener("click", openMenu);
    closeBtn?.addEventListener("click", closeMenu);
    scrim?.addEventListener("click", closeMenu);
    menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu?.classList.contains("is-open")) closeMenu();
    });

    if (navbar) {
      const onScroll = () => navbar.classList.toggle("is-scrolled", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  };

  const initBackToTop = () => {
    const button = document.querySelector("[data-back-to-top]");
    if (!button) return;

    const onScroll = () => button.classList.toggle("is-visible", window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  /* ------------------------------------------------------------------
     Product card rendering (used by the shop grid)
     ------------------------------------------------------------------ */
  const readWishlist = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem("nova-wishlist") || "[]"));
    } catch (error) {
      console.error("Nova: could not read wishlist from storage", error);
      return new Set();
    }
  };

  const wishlist = readWishlist();

  const saveWishlist = () => {
    try {
      localStorage.setItem("nova-wishlist", JSON.stringify([...wishlist]));
    } catch (error) {
      console.error("Nova: could not save wishlist to storage", error);
    }
  };

  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return `<span class="rating-star" aria-hidden="true">${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}</span> ${rating.toFixed(1)}`;
  };

  const createProductCard = (product, index = 0) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.style.animationDelay = `${Math.min(index, 8) * 40}ms`;
    const isWishlisted = wishlist.has(product.id);

    card.innerHTML = `
      <div class="product-card__media">
        <a href="product.html?id=${product.id}" tabindex="-1" aria-hidden="true"><img src="${product.image}" alt="" loading="lazy" /></a>
        <button type="button" class="product-card__wishlist ${isWishlisted ? "is-active" : ""}"
                aria-pressed="${isWishlisted}" aria-label="Save ${product.name} to wishlist">
          <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.35-9.5-8.5C.5 8 2 4.5 5.5 4.5c2 0 3.5 1.2 4.5 2.7C11 5.7 12.5 4.5 14.5 4.5 18 4.5 19.5 8 19.5 11.5 17 15.65 12 20 12 20z"/></svg>
        </button>
        <div class="product-card__quickview">
          <a class="btn btn-secondary btn-block" style="background:rgba(255,255,255,0.92)" href="product.html?id=${product.id}">Quick View</a>
        </div>
      </div>
      <p class="product-card__category">${product.category}</p>
      <h3 class="product-card__name"><a href="product.html?id=${product.id}">${product.name}</a></h3>
      <div class="product-card__meta">
        <span class="product-card__rating">${renderStars(product.rating)}</span>
        <span class="product-card__price">${UI.formatPrice(product.price)}</span>
      </div>
      <button type="button" class="btn btn-secondary btn-block" data-add-to-cart>Add to Cart</button>
    `;

    card.querySelector("[data-add-to-cart]").addEventListener("click", () => {
      Storage.addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: product.sizes[0],
        color: product.colors[0],
        quantity: 1,
      });
      UI.showToast("✓ Added to your cart");
    });

    card.querySelector(".product-card__wishlist").addEventListener("click", (e) => {
      const btn = e.currentTarget;
      const nowActive = !wishlist.has(product.id);
      nowActive ? wishlist.add(product.id) : wishlist.delete(product.id);
      saveWishlist();
      btn.classList.toggle("is-active", nowActive);
      btn.setAttribute("aria-pressed", String(nowActive));
    });

    return card;
  };

  const emptyStateMarkup = () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
      <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
    </svg>
    <h3>No products found.</h3>
    <p>Try searching for something else, or browse a different category.</p>
  `;

  /* ------------------------------------------------------------------
     Shop section (lives on the homepage): filter, search, sort, render
     ------------------------------------------------------------------ */
  const initShopSection = () => {
    const grid = document.querySelector("[data-shop-grid]");
    if (!grid) return;

    const params = new URLSearchParams(window.location.search);
    const state = {
      category: params.get("category") || "All",
      query: params.get("search") || "",
      sortBy: "featured",
    };

    const pills = document.querySelectorAll("[data-filter-pill]");
    const searchInputs = document.querySelectorAll("[data-shop-search]");
    const sortSelect = document.querySelector("[data-sort-select]");
    const resultCount = document.querySelector("[data-result-count]");

    searchInputs.forEach((input) => (input.value = state.query));

    const syncUrl = () => {
      try {
        const url = new URL(window.location.href);
        state.category === "All" ? url.searchParams.delete("category") : url.searchParams.set("category", state.category);
        state.query ? url.searchParams.set("search", state.query) : url.searchParams.delete("search");
        window.history.replaceState({}, "", url);
      } catch (error) {
        // Some browser/security configurations restrict history updates
        // (e.g. certain file:// setups) — filtering still works without it.
      }
    };

    const applyFilters = () => {
      let results = Products.getAll();
      results = Products.filterByCategory(results, state.category);
      results = Products.search(results, state.query);
      results = Products.sort(results, state.sortBy);

      grid.classList.toggle("empty-state", results.length === 0);
      grid.innerHTML = "";

      if (results.length === 0) {
        grid.innerHTML = emptyStateMarkup();
      } else {
        results.forEach((product, index) => grid.appendChild(createProductCard(product, index)));
      }

      if (resultCount) {
        resultCount.textContent = `${results.length} ${results.length === 1 ? "product" : "products"}`;
      }

      pills.forEach((pill) => pill.setAttribute("aria-pressed", String(pill.dataset.filterPill === state.category)));
      syncUrl();
    };

    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        state.category = pill.dataset.filterPill;
        applyFilters();
      });
    });

    searchInputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        state.query = e.target.value;
        searchInputs.forEach((other) => { if (other !== e.target) other.value = state.query; });
        applyFilters();
      });
    });

    sortSelect?.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      applyFilters();
    });

    // Category cards ("Featured Categories") deep-link into the shop grid.
    // Delegated on document so it also covers cards rendered after this runs.
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-category-link]");
      if (!link) return;
      e.preventDefault();
      state.category = link.dataset.categoryLink;
      applyFilters();
      document.querySelector("#shop").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    applyFilters();

    if (params.get("category") || params.get("search")) {
      window.requestAnimationFrame(() => {
        document.querySelector("#shop")?.scrollIntoView({ block: "start" });
      });
    }
  };

  const initNavSearchButtons = () => {
    document.querySelectorAll("[data-nav-search]").forEach((button) => {
      button.addEventListener("click", () => {
        const shopSection = document.querySelector("#shop");
        const searchField = document.querySelector("#shop-search") || document.querySelector("[data-shop-search]");
        if (!shopSection || !searchField) return;
        shopSection.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => searchField.focus(), 350);
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initBackToTop();
    initNavSearchButtons();
    UI.updateCartBadge();
    initShopSection();
  });
})();
