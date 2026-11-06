
/* ==========================================
   4PM — 4 PRIVILEGED MEN
   Vanilla JavaScript Storefront
========================================== */

const products = [
  {
    id: 1,
    name: "Premium Oversized T-Shirt",
    category: "Clothing",
    price: 18500,
    oldPrice: 22000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    description: "A refined oversized essential designed for everyday comfort and effortless streetwear styling.",
    tag: "BESTSELLER",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Classic Black Hoodie",
    category: "Clothing",
    price: 32000,
    oldPrice: 38000,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    description: "A premium everyday hoodie with a relaxed silhouette and timeless appeal.",
    tag: "POPULAR",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 3,
    name: "Urban Streetwear Jacket",
    category: "Clothing",
    price: 58000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
    description: "A contemporary outerwear piece for a bold, confident wardrobe.",
    tag: "NEW",
    sizes: ["M", "L", "XL"]
  },
  {
    id: 4,
    name: "Essential White Sneakers",
    category: "Shoes",
    price: 45000,
    oldPrice: 52000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    description: "Clean lines and versatile styling make these sneakers an everyday essential.",
    tag: "TRENDING",
    sizes: ["40", "41", "42", "43", "44"]
  },
  {
    id: 5,
    name: "Premium Leather Watch",
    category: "Accessories",
    price: 65000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
    description: "A sophisticated accessory for men who appreciate understated elegance.",
    tag: "EXCLUSIVE",
    sizes: ["One Size"]
  },
  {
    id: 6,
    name: "Minimalist Black Shirt",
    category: "Clothing",
    price: 27000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800",
    description: "A versatile shirt combining simplicity, comfort and contemporary tailoring.",
    tag: "",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 7,
    name: "Luxury Casual Sneakers",
    category: "Shoes",
    price: 55000,
    oldPrice: 62000,
    image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=800",
    description: "A modern footwear choice built around comfort and distinctive styling.",
    tag: "SALE",
    sizes: ["40", "41", "42", "43", "44"]
  },
  {
    id: 8,
    name: "Classic Sunglasses",
    category: "Accessories",
    price: 22000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
    description: "A sharp finishing touch for a confident, modern look.",
    tag: "",
    sizes: ["One Size"]
  }
];


/* ==========================================
   APPLICATION STATE
========================================== */

let activeCategory = "All";
let searchTerm = "";
let activeProduct = null;

let cart = loadStorage("4pm-cart", []);
let wishlist = loadStorage("4pm-wishlist", []);


/* ==========================================
   STORAGE
========================================== */

function loadStorage(key, fallback) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage() {
  localStorage.setItem("4pm-cart", JSON.stringify(cart));
  localStorage.setItem("4pm-wishlist", JSON.stringify(wishlist));
}


/* ==========================================
   UTILITIES
========================================== */

function formatPrice(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
}

function getProduct(id) {
  return products.find(product => product.id === Number(id));
}

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


/* ==========================================
   PRODUCT DISPLAY
========================================== */

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyState");
  const productTotal = document.getElementById("productTotal");

  let filtered = products.filter(product => {

    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  const sortValue = document.getElementById("sortProducts").value;

  if (sortValue === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sortValue === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  productTotal.textContent =
    `Showing ${filtered.length} products`;

  emptyState.classList.toggle("hidden", filtered.length > 0);

  grid.innerHTML = filtered.map(product => {

    const liked = wishlist.includes(product.id);

    return `
      <article class="product-card">

        <div class="relative overflow-hidden">

          <img
            src="${product.image}"
            alt="${product.name}"
            class="product-image"
            loading="lazy"
          >

          ${product.tag ? `
            <span class="product-tag">${product.tag}</span>
          ` : ""}

          <div class="product-actions">

            <button
              class="product-action ${liked ? "liked" : ""}"
              data-action="wishlist"
              data-id="${product.id}"
              aria-label="Toggle wishlist"
            >
              <i class="${liked ? "fa-solid" : "fa-regular"} fa-heart"></i>
            </button>

            <button
              class="product-action"
              data-action="quickview"
              data-id="${product.id}"
              aria-label="Quick view"
            >
              <i class="fa-regular fa-eye"></i>
            </button>

          </div>

        </div>

        <div class="p-3 sm:p-4">

          <p class="text-[10px] uppercase tracking-widest text-gray-400">
            ${product.category}
          </p>

          <h3 class="font-bold text-xs sm:text-sm mt-2">
            ${product.name}
          </h3>

          <div class="flex flex-wrap gap-2 items-center mt-3">

            <span class="font-extrabold text-sm">
              ${formatPrice(product.price)}
            </span>

            ${product.oldPrice ? `
              <span class="text-xs text-gray-400 line-through">
                ${formatPrice(product.oldPrice)}
              </span>
            ` : ""}

          </div>

          <button
            class="add-cart-btn"
            data-action="add"
            data-id="${product.id}"
          >
            ADD TO BAG
            <i class="fa-solid fa-arrow-right ml-2"></i>
          </button>

        </div>
      </article>
    `;
  }).join("");
}


/* ==========================================
   CATEGORY FILTERS
========================================== */

document.querySelectorAll(".filter-btn").forEach(button => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    activeCategory = button.dataset.filter;

    renderProducts();
  });

});


document.querySelectorAll(".collection-card").forEach(card => {

  card.addEventListener("click", () => {

    activeCategory = card.dataset.category;
    searchTerm = "";

    document.getElementById("searchInput").value = "";

    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.dataset.filter === activeCategory
      );
    });

    renderProducts();

    document.getElementById("shop").scrollIntoView({
      behavior: "smooth"
    });

  });

});


/* ==========================================
   SEARCH
========================================== */

const searchPanel = document.getElementById("searchPanel");

document.getElementById("searchBtn").addEventListener("click", () => {

  searchPanel.classList.toggle("hidden");

  if (!searchPanel.classList.contains("hidden")) {
    document.getElementById("searchInput").focus();
  }

});

document.getElementById("closeSearch").addEventListener("click", () => {
  searchPanel.classList.add("hidden");
});

document.getElementById("searchInput").addEventListener("input", event => {

  searchTerm = event.target.value.trim().toLowerCase();

  renderProducts();

  document.getElementById("shop").scrollIntoView({
    behavior: "smooth"
  });

});


/* ==========================================
   PRODUCT ACTIONS
========================================== */

document.getElementById("productGrid").addEventListener("click", event => {

  const button = event.target.closest("[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "add") {
    addToCart(id);
  }

  if (action === "wishlist") {
    toggleWishlist(id);
  }

  if (action === "quickview") {
    openQuickView(id);
  }

});


/* ==========================================
   WISHLIST
========================================== */

function toggleWishlist(id) {

  if (wishlist.includes(id)) {

    wishlist = wishlist.filter(item => item !== id);

    showToast("Removed from your wishlist.");

  } else {

    wishlist.push(id);

    showToast("Added to your wishlist.");

  }

  saveStorage();
  updateCounters();
  renderProducts();

}

document.getElementById("wishlistBtn").addEventListener("click", () => {

  activeCategory = "All";

  searchTerm = "";

  document.getElementById("searchInput").value = "";

  document.querySelectorAll(".filter-btn").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.filter === "All"
    );
  });

  const grid = document.getElementById("productGrid");

  const savedProducts = products.filter(product =>
    wishlist.includes(product.id)
  );

  document.getElementById("productTotal").textContent =
    `${savedProducts.length} wishlist products`;

  document.getElementById("emptyState").classList.toggle(
    "hidden",
    savedProducts.length > 0
  );

  grid.innerHTML = savedProducts.map(product => `
    <article class="product-card">
      <img src="${product.image}" class="product-image" alt="${product.name}">
      <div class="p-4">
        <h3 class="font-bold text-sm">${product.name}</h3>
        <p class="mt-2 font-bold">${formatPrice(product.price)}</p>
        <button class="add-cart-btn" data-action="add" data-id="${product.id}">
          ADD TO BAG
        </button>
        <button class="text-xs mt-3 underline"
          data-action="wishlist" data-id="${product.id}">
          REMOVE FROM WISHLIST
        </button>
      </div>
    </article>
  `).join("");

  document.getElementById("shop").scrollIntoView({
    behavior: "smooth"
  });

});


/* ==========================================
   SHOPPING CART
========================================== */

function addToCart(id, size = null) {

  const product = getProduct(id);

  if (!product) return;

  // Default size for quick additions.
  // Quick view lets customers choose a size.
  const selectedSize = size || product.sizes[0];

  const existingItem = cart.find(item =>
    item.id === id && item.size === selectedSize
  );

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id,
      size: selectedSize,
      quantity: 1
    });
  }

  saveStorage();
  updateCounters();
  renderCart();

  showToast(`${product.name} added to your bag.`);

}


function updateCounters() {

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  document.getElementById("cartCount").textContent = totalItems;

  document.getElementById("wishlistCount").textContent =
    wishlist.length;

}


function renderCart() {

  const cartItems = document.getElementById("cartItems");

  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="text-center py-20">
        <i class="fa-solid fa-bag-shopping text-4xl text-gray-300"></i>
        <p class="font-bold mt-5">Your bag is currently empty.</p>
        <p class="text-sm text-gray-500 mt-2">
          Discover something exceptional.
        </p>
      </div>
    `;

  } else {

    cartItems.innerHTML = cart.map(item => {

      const product = getProduct(item.id);

      if (!product) return "";

      return `
        <div class="cart-item">

          <img src="${product.image}" alt="${product.name}">

          <div class="flex-1">

            <h3 class="font-bold text-sm">
              ${product.name}
            </h3>

            <p class="text-xs text-gray-500 mt-1">
              Size: ${item.size}
            </p>

            <p class="font-bold text-sm mt-2">
              ${formatPrice(product.price * item.quantity)}
            </p>

            <div class="quantity-controls">

              <button data-cart-action="decrease" data-id="${item.id}" data-size="${item.size}">
                -
              </button>

              <span class="text-sm">${item.quantity}</span>

              <button data-cart-action="increase" data-id="${item.id}" data-size="${item.size}">
                +
              </button>

              <button
                data-cart-action="remove"
                data-id="${item.id}"
                data-size="${item.size}"
                class="ml-auto text-xs text-red-500 border-0"
              >
                REMOVE
              </button>

            </div>

          </div>

        </div>
      `;

    }).join("");

  }

  const subtotal = cart.reduce((total, item) => {

    const product = getProduct(item.id);

    return total + (product ? product.price * item.quantity : 0);

  }, 0);

  document.getElementById("cartSubtotal").textContent =
    formatPrice(subtotal);

}


document.getElementById("cartItems").addEventListener("click", event => {

  const button = event.target.closest("[data-cart-action]");

  if (!button) return;

  const id = Number(button.dataset.id);
  const size = button.dataset.size;

  const item = cart.find(item =>
    item.id === id && item.size === size
  );

  if (!item) return;

  const action = button.dataset.cartAction;

  if (action === "increase") {
    item.quantity++;
  }

  if (action === "decrease") {
    item.quantity--;

    if (item.quantity <= 0) {
      cart = cart.filter(item =>
        !(item.id === id && item.size === size)
      );
    }
  }

  if (action === "remove") {
    cart = cart.filter(item =>
      !(item.id === id && item.size === size)
    );
  }

  saveStorage();
  updateCounters();
  renderCart();

});


/* ==========================================
   CART DRAWER
========================================== */

const cartOverlay = document.getElementById("cartOverlay");

function openCart() {

  cartOverlay.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");

  renderCart();

}

function closeCart() {

  cartOverlay.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");

}

document.getElementById("cartBtn").addEventListener("click", openCart);

document.getElementById("closeCart").addEventListener("click", closeCart);

cartOverlay.addEventListener("click", event => {

  if (event.target === cartOverlay) {
    closeCart();
  }

});


/* ==========================================
   QUICK VIEW
========================================== */

const quickView = document.getElementById("quickView");

function openQuickView(id) {

  const product = getProduct(id);

  if (!product) return;

  activeProduct = product;

  document.getElementById("quickViewContent").innerHTML = `

    <div class="grid md:grid-cols-2">

      <img
        src="${product.image}"
        alt="${product.name}"
        class="quick-image"
      >

      <div class="quick-info">

        <p class="section-label">${product.category}</p>

        <h2 class="text-2xl font-extrabold mt-3">
          ${product.name}
        </h2>

        <p class="text-xl font-bold mt-5">
          ${formatPrice(product.price)}
        </p>

        <p class="text-sm text-gray-500 leading-7 mt-5">
          ${product.description}
        </p>

        <label class="block text-xs font-bold mt-8 mb-3">
          SELECT SIZE
        </label>

        <div class="flex flex-wrap gap-2" id="sizeOptions">
          ${product.sizes.map((size, index) => `
            <button
              class="size-btn border px-4 py-3 text-xs font-bold ${index === 0 ? "selected-size" : ""}"
              data-size="${size}"
            >
              ${size}
            </button>
          `).join("")}
        </div>

        <button id="quickAddBtn" class="gold-button w-full mt-8">
          ADD TO BAG
        </button>

      </div>

    </div>

  `;

  quickView.classList.remove("hidden");
  quickView.classList.add("flex");

  document.body.classList.add("overflow-hidden");

  const sizeOptions = document.getElementById("sizeOptions");

  sizeOptions.addEventListener("click", event => {

    const button = event.target.closest("[data-size]");

    if (!button) return;

    sizeOptions.querySelectorAll("button").forEach(btn => {
      btn.classList.remove("selected-size");
    });

    button.classList.add("selected-size");

  });

  document.getElementById("quickAddBtn").addEventListener("click", () => {

    const selected = sizeOptions.querySelector(".selected-size");

    if (!selected) {
      showToast("Please select a size.");
      return;
    }

    addToCart(product.id, selected.dataset.size);

    closeQuickView();

  });

}


function closeQuickView() {

  quickView.classList.add("hidden");
  quickView.classList.remove("flex");

  document.body.classList.remove("overflow-hidden");

}

document.getElementById("closeQuickView").addEventListener(
  "click",
  closeQuickView
);

quickView.addEventListener("click", event => {

  if (event.target === quickView) {
    closeQuickView();
  }

});


/* ==========================================
   PRODUCT SORTING
========================================== */

document.getElementById("sortProducts").addEventListener(
  "change",
  renderProducts
);


/* ==========================================
   MOBILE MENU
========================================== */

const mobileMenu = document.getElementById("mobileMenu");

document.getElementById("menuBtn").addEventListener("click", () => {

  mobileMenu.classList.toggle("hidden");

});

mobileMenu.querySelectorAll("a").forEach(link => {

  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });

});


/* ==========================================
   NEWSLETTER
========================================== */

document.getElementById("newsletterForm").addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const email = event.target.querySelector("input").value;

    document.getElementById("newsletterMessage").textContent =
      "Thank you for your interest in 4PM!";

    event.target.reset();

    console.log("Newsletter signup demo:", email);

  }
);


/* ==========================================
   CHECKOUT DEMO
========================================== */

document.getElementById("checkoutBtn").addEventListener("click", () => {

  if (cart.length === 0) {
    showToast("Your shopping bag is empty.");
    return;
  }

  showToast("Checkout integration is coming soon.");

});


/* ==========================================
   GLOBAL KEYBOARD SUPPORT
========================================== */

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeCart();
    closeQuickView();
    searchPanel.classList.add("hidden");
    mobileMenu.classList.add("hidden");
  }

});


/* ==========================================
   INITIALIZE STORE
========================================== */

document.getElementById("year").textContent =
  new Date().getFullYear();

renderProducts();
renderCart();
updateCounters();

console.log("4PM Storefront successfully initialized.");

