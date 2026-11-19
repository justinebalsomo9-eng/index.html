const products = [
  {
    id: 1,
    name: "The Ada Blazer",
    category: "Outerwear",
    price: 248,
    color: "Sand",
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?crop=entropy&cs=tinysrgb&fit=crop&h=1200&w=900&q=85",
  },
  {
    id: 2,
    name: "Lou Trench",
    category: "Outerwear",
    price: 310,
    color: "Stone",
    image:
      "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?crop=entropy&cs=tinysrgb&fit=crop&h=1200&w=900&q=85",
  },
  {
    id: 3,
    name: "Mara Silk Dress",
    category: "Dresses",
    price: 190,
    color: "Ivory",
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1659522761084-79196b64abe4?crop=entropy&cs=tinysrgb&fit=crop&h=1200&w=900&q=85",
  },
  {
    id: 4,
    name: "Noa Column Dress",
    category: "Dresses",
    price: 220,
    color: "Black",
    image:
      "https://images.unsplash.com/photo-1631002724711-d1ae3cf651b0?crop=entropy&cs=tinysrgb&fit=crop&h=1200&w=900&q=85",
  },
  {
    id: 5,
    name: "René Wool Suit",
    category: "Tailoring",
    price: 395,
    color: "Espresso",
    image:
      "https://images.unsplash.com/photo-1731505583021-16c3a17339cd?crop=entropy&cs=tinysrgb&fit=crop&h=1200&w=900&q=85",
  },
  {
    id: 6,
    name: "Sora Draped Set",
    category: "Sets",
    price: 280,
    color: "Oat",
    badge: "Limited",
    image:
      "https://images.unsplash.com/photo-1715559522419-db7face19c1c?crop=entropy&cs=tinysrgb&fit=crop&h=1200&w=900&q=85",
  },
];

const categories = ["All", "Outerwear", "Dresses", "Tailoring", "Sets"];
const cart = {};
const favorites = new Set();
let activeCategory = "All";
let searchQuery = "";

const productGrid = document.querySelector("#productGrid");
const categoryFilters = document.querySelector("#categoryFilters");
const emptyState = document.querySelector("#emptyState");
const cartOverlay = document.querySelector("#cartOverlay");
const cartItems = document.querySelector("#cartItems");
const cartFooter = document.querySelector("#cartFooter");

function money(value) {
  return `$${value}`;
}

function scrollToShop() {
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
}

function iconHeart(isActive) {
  return `
    <svg viewBox="0 0 24 24" fill="${isActive ? "currentColor" : "none"}" stroke="currentColor">
      <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>
    </svg>`;
}

function renderFilters() {
  categoryFilters.innerHTML = categories
    .map(
      (category) => `
        <button class="filter ${category === activeCategory ? "active" : ""}" data-category="${category}">
          ${category}${category === "All" ? ` (${products.length})` : ""}
        </button>`,
    )
    .join("");
}

function renderProducts() {
  const visible = products.filter(
    (product) =>
      (activeCategory === "All" || product.category === activeCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  productGrid.innerHTML = visible
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-media">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
            ${product.badge ? `<span class="badge">${product.badge}</span>` : ""}
            <button
              class="favorite ${favorites.has(product.id) ? "active" : ""}"
              data-favorite="${product.id}"
              aria-label="Favorite ${product.name}"
            >
              ${iconHeart(favorites.has(product.id))}
            </button>
            <button class="quick-add" data-add="${product.id}">Add to bag</button>
          </div>
          <div class="product-info">
            <div>
              <h3>${product.name}</h3>
              <p class="color">${product.color}</p>
            </div>
            <p>${money(product.price)}</p>
          </div>
          <button class="mobile-add" data-add="${product.id}">Add to bag</button>
        </article>`,
    )
    .join("");

  productGrid.classList.toggle("hidden", visible.length === 0);
  emptyState.classList.toggle("hidden", visible.length > 0);
}

function cartCount() {
  return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
}

function renderCart() {
  const count = cartCount();
  const selectedProducts = products.filter((product) => cart[product.id]);
  const countBadge = document.querySelector("#cartCount");

  countBadge.textContent = count;
  countBadge.classList.toggle("hidden", count === 0);
  document.querySelector("#drawerCount").textContent = `(${count})`;

  if (selectedProducts.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <svg viewBox="0 0 24 24">
          <path d="M5 8h14l-1 13H6L5 8Z"/>
          <path d="M9 9V6a3 3 0 0 1 6 0v3"/>
        </svg>
        <h3>Your bag is empty</h3>
        <button id="exploreButton">Explore the collection</button>
      </div>`;
    cartFooter.classList.add("hidden");
    document.querySelector("#exploreButton").addEventListener("click", () => {
      closeCart();
      scrollToShop();
    });
    return;
  }

  cartItems.innerHTML = selectedProducts
    .map(
      (product) => `
        <div class="cart-item">
          <img src="${product.image}" alt="" />
          <div class="cart-item-details">
            <div class="cart-item-top">
              <div>
                <h3>${product.name}</h3>
                <p>${product.color}</p>
              </div>
              <span class="item-total">${money(product.price * cart[product.id])}</span>
            </div>
            <div class="quantity">
              <button data-decrease="${product.id}" aria-label="Decrease quantity">−</button>
              <span>${cart[product.id]}</span>
              <button data-increase="${product.id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
        </div>`,
    )
    .join("");

  const subtotal = selectedProducts.reduce(
    (total, product) => total + product.price * cart[product.id],
    0,
  );
  document.querySelector("#subtotal").textContent = money(subtotal);
  cartFooter.classList.remove("hidden");
}

function openCart() {
  renderCart();
  cartOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  openCart();
}

function updateCart(id, change) {
  cart[id] = (cart[id] || 0) + change;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderFilters();
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const favoriteButton = event.target.closest("[data-favorite]");

  if (addButton) addToCart(Number(addButton.dataset.add));

  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    renderProducts();
  }
});

cartItems.addEventListener("click", (event) => {
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  if (increase) updateCart(Number(increase.dataset.increase), 1);
  if (decrease) updateCart(Number(decrease.dataset.decrease), -1);
});

document.querySelectorAll("[data-scroll-shop]").forEach((button) => {
  button.addEventListener("click", scrollToShop);
});

document.querySelectorAll("[data-category-link]").forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.categoryLink;
    renderFilters();
    renderProducts();
    scrollToShop();
  });
});

const searchPanel = document.querySelector("#searchPanel");
const searchInput = document.querySelector("#searchInput");

document.querySelector("#searchButton").addEventListener("click", () => {
  searchPanel.classList.toggle("hidden");
  if (!searchPanel.classList.contains("hidden")) searchInput.focus();
});

document.querySelector("#closeSearch").addEventListener("click", () => {
  searchPanel.classList.add("hidden");
  searchInput.value = "";
  searchQuery = "";
  renderProducts();
});

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim();
  renderProducts();
});

document.querySelector("#clearSearch").addEventListener("click", () => {
  searchInput.value = "";
  searchQuery = "";
  activeCategory = "All";
  renderFilters();
  renderProducts();
});

document.querySelector("#cartButton").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", (event) => {
  if (event.target === cartOverlay) closeCart();
});

const mobileMenu = document.querySelector("#mobileMenu");
document.querySelector("#menuButton").addEventListener("click", () => {
  mobileMenu.classList.remove("hidden");
  document.body.style.overflow = "hidden";
});

function closeMenu() {
  mobileMenu.classList.add("hidden");
  document.body.style.overflow = "";
}

document.querySelector("#closeMenu").addEventListener("click", closeMenu);
document.querySelector("[data-mobile-shop]").addEventListener("click", () => {
  closeMenu();
  scrollToShop();
});
document.querySelector("[data-mobile-story]").addEventListener("click", () => {
  closeMenu();
  document.querySelector("#story").scrollIntoView({ behavior: "smooth" });
});
document.querySelectorAll("[data-mobile-category]").forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.mobileCategory;
    renderFilters();
    renderProducts();
    closeMenu();
    scrollToShop();
  });
});

document.querySelector("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#formMessage").textContent = "Thank you — you are on the list.";
  event.target.reset();
});

document.querySelector("#checkoutButton").addEventListener("click", () => {
  alert("Checkout is ready for your payment integration.");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeMenu();
    searchPanel.classList.add("hidden");
  }
});

renderFilters();
renderProducts();
renderCart();
