# Nova — Modern E-Commerce Store

A polished, front-end-only e-commerce demo for a fictional clothing brand, built as a portfolio project to demonstrate real-world HTML, CSS, and JavaScript application logic — no frameworks, no backend.

**Live pages:** `index.html` (home + shop) · `product.html` · `cart.html` · `checkout.html`

---

## Project Overview

Nova is a small, premium fashion store selling t-shirts, hoodies, shoes, and accessories. The project is intentionally scoped small — 16 products, four pages — so every interaction can be built to a high standard instead of spreading effort thin across a huge catalog.

The goal was to build something that *feels* like a real product: persistent cart state, working search/filter/sort, form validation, empty states, toasts, and responsive layouts down to small phones — all with plain JavaScript.

## Features

- **Homepage** with a hero section, four browsable category cards, and a full shop section
- **Shop section** with live category filtering, text search, and six sort options — all updating in place with no page reloads
- **Product detail pages** with size/color selection, a quantity stepper, and dynamic loading from a `?id=` URL parameter
- **Persistent cart** (LocalStorage-backed) with quantity controls, line removal, and automatic subtotal/shipping/total calculation
- **Free shipping threshold** ($100+) with a live "you're $X away from free shipping" message
- **Checkout flow** with contact, shipping, and a non-functional payment UI, full client-side validation, and an order confirmation state
- **Toast notifications** for cart actions (no browser `alert()`s)
- **Wishlist hearts** on product cards (LocalStorage-backed)
- **Empty states** for an empty cart and a no-results search
- **Mobile-first responsive design**, a mobile nav drawer, and a back-to-top button
- Accessible markup: semantic elements, labeled form fields, visible focus states, and `aria-pressed`/`aria-current` used throughout interactive controls

## Technologies Used

- **HTML5** — semantic structure, forms, `<button>`/`<a>` used correctly for actions vs. navigation
- **CSS3** — custom properties for design tokens, CSS Grid & Flexbox, mobile-first media queries, keyframe animations, `prefers-reduced-motion` support
- **Vanilla JavaScript (ES6+)** — no frameworks, no build step
- **LocalStorage** — cart and wishlist persistence

No React, no backend, no database, no payment gateway, and no authentication — by design.

## JavaScript Functionality

The project is split into focused, single-responsibility files rather than one large script:

| File | Responsibility |
|---|---|
| `js/products.js` | Product catalog data, category metadata, and pure helpers: `filterByCategory()`, `search()`, `sort()`, `getById()`. Also generates each product's placeholder artwork as an inline SVG, so the demo needs no external image hosting. |
| `js/storage.js` | All cart persistence (`getCart`, `saveCart`, `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`) plus shared UI helpers: `showToast()`, `updateCartBadge()`, `formatPrice()`. |
| `js/main.js` | Shared navbar behavior (mobile menu, scroll shadow, back-to-top) and the homepage shop section: rendering product cards, wiring filter pills, search input, and the sort dropdown. |
| `js/product.js` | Reads the product `id` from the URL with `URLSearchParams`, renders the detail page, and handles size/color/quantity selection. |
| `js/cart.js` | Renders cart line items from storage and keeps quantity controls and totals in sync. |
| `js/checkout.js` | Renders the order summary, validates every field with small pure validator functions, and shows the confirmation state on submit. |

Techniques demonstrated throughout: `Array.prototype.filter/sort/find/reduce/map`, template literals, destructuring, arrow functions, `URLSearchParams`, `classList`, `addEventListener`, `JSON.stringify`/`JSON.parse`, and a small shared `window.Nova` namespace used instead of scattering globals.

## LocalStorage

The cart is stored under the key `nova-cart` as a JSON array of line items (`{ id, name, price, image, size, color, quantity }`), so it survives page refreshes, closing the browser, and reopening the site. A second key, `nova-wishlist`, stores an array of saved product IDs the same way.

## Project Structure


## How to Run

No build step or server required:

1. Download or clone the `nova-store` folder.
2. Open `index.html` directly in any modern browser.

That's it — all styling and scripts are loaded via relative paths, and the cart works entirely client-side.

## Screenshots

_Add screenshots of the homepage, shop grid, product detail page, cart, and checkout here before publishing the portfolio piece._

## Future Improvements

- Swap the generated SVG placeholder artwork for real photography
- Add product reviews with a simple star-rating submission form
- Add a "recently viewed" strip using LocalStorage
- Persist the selected sort/filter state across a full page reload (currently synced to the URL, but a refresh resets the sort dropdown)
- Add unit tests for the pure helper functions in `products.js` and `storage.js`

## What I Learned

Building Nova without a framework forced me to think carefully about state management by hand — deciding what belongs in the URL (filters), what belongs in LocalStorage (the cart), and what can just live in memory (the current sort order). It was also a good exercise in keeping CSS specificity under control across three stylesheets, and in writing accessible interactive components (custom size/color pickers, a mobile drawer, toasts) using only semantic HTML and ARIA attributes rather than a component library.
