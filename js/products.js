/* ==========================================================================
   Nova — Product Data
   Product catalog + pure helper functions for filtering, searching, sorting.
   Exposes everything under the shared `Nova` namespace so pages can share it
   without ES modules (keeps the project file:// friendly).
   ========================================================================== */

window.Nova = window.Nova || {};

(() => {
  /* ---- Category metadata ---- */
  const CATEGORIES = [
    { id: "tshirts", label: "T-Shirts", tagline: "Everyday essentials." },
    { id: "hoodies", label: "Hoodies", tagline: "Comfort with attitude." },
    { id: "shoes", label: "Shoes", tagline: "Step into something better." },
    { id: "accessories", label: "Accessories", tagline: "Complete your look." },
  ];

  /* ---- Swatch colors used for generated artwork + color pills ---- */
  const SWATCHES = {
    Black: "#1B1B1E",
    White: "#F5F4F0",
    Gray: "#9C9A92",
    Charcoal: "#3A3A3D",
    Navy: "#2B3446",
    Cream: "#EDE7D9",
    Olive: "#5C6446",
    Sand: "#D8C7A8",
    Brown: "#5A4635",
    "Off-White": "#EFEDE4",
    Natural: "#DCD3BE",
  };

  /* ---- Catalog: 16 products across 4 categories ---- */
  const PRODUCTS = [
    {
      id: 1,
      name: "Essential Oversized Tee",
      category: "T-Shirts",
      price: 29.99,
      rating: 4.8,
      reviews: 214,
      description:
        "A heavyweight cotton tee cut with a relaxed, oversized silhouette. Garment-washed for a broken-in feel from the first wear, with a dropped shoulder and reinforced collar that keeps its shape wash after wash.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White", "Gray"],
    },
    {
      id: 2,
      name: "Classic Crewneck Tee",
      category: "T-Shirts",
      price: 24.99,
      rating: 4.6,
      reviews: 178,
      description:
        "Our take on the everyday classic — a mid-weight combed cotton tee with a clean crewneck and true-to-size fit. Built to layer or wear on its own, every day of the week.",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["White", "Black", "Navy"],
    },
    {
      id: 3,
      name: "Ribbed Longsleeve Tee",
      category: "T-Shirts",
      price: 34.99,
      rating: 4.7,
      reviews: 96,
      description:
        "A fitted longsleeve in a fine rib knit that moves with you. Thumbhole cuffs and a slightly extended hem make it as at home under a jacket as it is on its own.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Charcoal", "Cream"],
    },
    {
      id: 4,
      name: "Relaxed Fit Pocket Tee",
      category: "T-Shirts",
      price: 27.99,
      rating: 4.5,
      reviews: 132,
      description:
        "A boxy, relaxed pocket tee in soft slub cotton. The single chest pocket and dropped hem add just enough detail to keep things interesting without trying too hard.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Olive", "Black", "White"],
    },
    {
      id: 5,
      name: "Heavyweight Pullover Hoodie",
      category: "Hoodies",
      price: 64.99,
      rating: 4.9,
      reviews: 301,
      description:
        "Our signature hoodie in a substantial 420gsm fleece. A brushed interior, double-lined hood, and kangaroo pocket make this the one you'll reach for on repeat.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Gray", "Olive"],
    },
    {
      id: 6,
      name: "Cropped Zip Hoodie",
      category: "Hoodies",
      price: 59.99,
      rating: 4.6,
      reviews: 88,
      description:
        "A cropped, full-zip hoodie in mid-weight fleece with a streamlined hood and ribbed hem. Cut to sit at the waist for layering over higher-rise bottoms.",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Cream", "Black"],
    },
    {
      id: 7,
      name: "Fleece-Lined Hoodie",
      category: "Hoodies",
      price: 69.99,
      rating: 4.7,
      reviews: 154,
      description:
        "Built for colder days, this hoodie pairs a brushed fleece interior with a wind-resistant outer face. A drawcord hood and ribbed cuffs seal in the warmth.",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Charcoal", "Navy"],
    },
    {
      id: 8,
      name: "Essential Hoodie",
      category: "Hoodies",
      price: 54.99,
      rating: 4.8,
      reviews: 267,
      description:
        "The foundation of any hoodie rotation. Mid-weight, true-to-size, and finished with a clean minimal logo — nothing more, nothing less.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["White", "Black", "Sand"],
    },
    {
      id: 9,
      name: "Minimal Leather Sneaker",
      category: "Shoes",
      price: 119.99,
      rating: 4.8,
      reviews: 203,
      description:
        "A clean, low-profile sneaker in full-grain leather with a cupsole construction. Designed to pair with everything from denim to tailored trousers.",
      sizes: ["7", "8", "9", "10", "11", "12"],
      colors: ["White", "Black"],
    },
    {
      id: 10,
      name: "Canvas Low-Top",
      category: "Shoes",
      price: 79.99,
      rating: 4.5,
      reviews: 121,
      description:
        "A lightweight canvas low-top with a vulcanized rubber sole. Breathable, easy to break in, and built for warm-weather rotation.",
      sizes: ["7", "8", "9", "10", "11"],
      colors: ["Off-White", "Olive"],
    },
    {
      id: 11,
      name: "Suede Runner",
      category: "Shoes",
      price: 99.99,
      rating: 4.6,
      reviews: 74,
      description:
        "A retro-inspired runner in soft suede with a cushioned midsole. Understated colorways and a low-bulk silhouette make it easy to wear daily.",
      sizes: ["7", "8", "9", "10", "11", "12"],
      colors: ["Gray", "Sand"],
    },
    {
      id: 12,
      name: "Studio Slip-On",
      category: "Shoes",
      price: 69.99,
      rating: 4.4,
      reviews: 59,
      description:
        "A no-lace slip-on with a knit upper and flexible sole, built for quick exits and long errands alike. Machine washable for easy care.",
      sizes: ["7", "8", "9", "10", "11"],
      colors: ["Black", "Cream"],
    },
    {
      id: 13,
      name: "Structured Canvas Tote",
      category: "Accessories",
      price: 39.99,
      rating: 4.7,
      reviews: 142,
      description:
        "A structured tote in heavyweight cotton canvas with leather handles and an interior pocket. Roomy enough for a laptop, sturdy enough for daily use.",
      sizes: ["One Size"],
      colors: ["Natural", "Black"],
    },
    {
      id: 14,
      name: "Minimal Leather Belt",
      category: "Accessories",
      price: 34.99,
      rating: 4.6,
      reviews: 83,
      description:
        "A full-grain leather belt with a matte brushed buckle. Cut clean with no visible branding, so it works with everything already in your closet.",
      sizes: ["S", "M", "L"],
      colors: ["Black", "Brown"],
    },
    {
      id: 15,
      name: "Wool Beanie",
      category: "Accessories",
      price: 22.99,
      rating: 4.8,
      reviews: 198,
      description:
        "A ribbed beanie in soft merino wool with a folded cuff. Warm without the bulk, and finished with a subtle woven label.",
      sizes: ["One Size"],
      colors: ["Charcoal", "Olive", "Cream"],
    },
    {
      id: 16,
      name: "Everyday Crossbody Bag",
      category: "Accessories",
      price: 49.99,
      rating: 4.5,
      reviews: 67,
      description:
        "A compact crossbody in water-resistant canvas with an adjustable strap and two zip pockets. Built for the essentials, nothing more.",
      sizes: ["One Size"],
      colors: ["Black", "Sand"],
    },
  ];

  /* ---- Generated placeholder artwork ----
     Keeps the demo self-contained (no external image hosting) while still
     giving every card a distinct, on-brand visual. Each category gets a
     simple line-art icon rendered over a tinted swatch background. */
  const ICONS = {
    "T-Shirts": (stroke) => `
      <path d="M70 40 L100 25 L130 40 L155 55 L140 85 L120 72 L120 175 L80 175 L80 72 L60 85 L45 55 Z"
            fill="none" stroke="${stroke}" stroke-width="3" stroke-linejoin="round" />`,
    Hoodies: (stroke) => `
      <path d="M60 55 C60 35 140 35 140 55 L150 50 L165 75 L148 90 L148 175 L52 175 L52 90 L35 75 L50 50 Z"
            fill="none" stroke="${stroke}" stroke-width="3" stroke-linejoin="round" />
      <path d="M85 55 C85 70 115 70 115 55" fill="none" stroke="${stroke}" stroke-width="3" />`,
    Shoes: (stroke) => `
      <path d="M35 130 L35 110 C35 100 45 95 55 92 L95 80 C105 77 110 65 122 65 C132 65 132 78 142 82 L165 92 C172 95 175 102 175 110 L175 130 Z"
            fill="none" stroke="${stroke}" stroke-width="3" stroke-linejoin="round" />
      <path d="M35 130 L175 130" stroke="${stroke}" stroke-width="3" />`,
    Accessories: (stroke) => `
      <path d="M55 85 L55 70 C55 50 145 50 145 70 L145 85" fill="none" stroke="${stroke}" stroke-width="3" />
      <rect x="40" y="85" width="120" height="95" rx="10" fill="none" stroke="${stroke}" stroke-width="3" />`,
  };

  const getPlaceholderSVG = (category, primaryColorName) => {
    const bg = SWATCHES[primaryColorName] ? tint(SWATCHES[primaryColorName]) : "#E9ECE2";
    const stroke = "#1B1B1E";
    const icon = (ICONS[category] || ICONS["Accessories"])(stroke);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 210" role="img" aria-label="${category} illustration">
        <rect width="210" height="210" fill="${bg}" />
        <g opacity="0.85">${icon}</g>
      </svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  // Lighten a hex color toward white to make a soft background tint.
  function tint(hex, amount = 0.82) {
    const n = hex.replace("#", "");
    const r = parseInt(n.substring(0, 2), 16);
    const g = parseInt(n.substring(2, 4), 16);
    const b = parseInt(n.substring(4, 6), 16);
    const mix = (c) => Math.round(c + (255 - c) * amount);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  }

  // Attach a ready-to-use image to every product once, at load time.
  PRODUCTS.forEach((product) => {
    product.image = getPlaceholderSVG(product.category, product.colors[0]);
  });

  /* ---- Helper functions ---- */
  const getAll = () => PRODUCTS;

  const getById = (id) => PRODUCTS.find((product) => product.id === Number(id));

  const filterByCategory = (list, categoryLabel) => {
    if (!categoryLabel || categoryLabel === "All") return list;
    return list.filter((product) => product.category === categoryLabel);
  };

  const search = (list, query) => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(({ name, category, description }) =>
      [name, category, description].some((field) => field.toLowerCase().includes(q))
    );
  };

  const sort = (list, sortBy) => {
    const sorted = [...list];
    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted; // "featured" — original catalog order
    }
  };

  window.Nova.Products = {
    CATEGORIES,
    SWATCHES,
    getAll,
    getById,
    filterByCategory,
    search,
    sort,
  };
})();
