const slider = document.querySelector(".hero-slider");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

const images = [
  "assets/images/bg.jpg",
  "assets/images/bg2.jpg",
  "assets/images/bg3.jpg",
];

if (slider && next && prev) {
  let index = 0;

  function changeSlide() {
    slider.style.opacity = 0;
    setTimeout(() => {
      slider.style.backgroundImage = `url(${images[index]})`;
      slider.style.opacity = 1;
    }, 300);
  }

  next.addEventListener("click", () => {
    index = (index + 1) % images.length;
    changeSlide();
  });

  prev.addEventListener("click", () => {
    index = (index - 1 + images.length) % images.length;
    changeSlide();
  });

  changeSlide();

  setInterval(() => {
    index = (index + 1) % images.length;
    changeSlide();
  }, 4000);
}

const cartBtn = document.getElementById("cart-btn");
const cartCountEl = document.getElementById("cart-count");
const miniCart = document.getElementById("mini-cart");
const miniCartBody = document.getElementById("mini-cart-body");
const closeMini = document.getElementById("close-mini");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout");
const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");

// Helper to load cart is now in common.js (getCart)
function renderMiniCart() {
  const items = getCart();
  if (!items.length) {
    miniCartBody.innerHTML = '<p class="empty">Your cart is empty.</p>';
    return;
  }
  miniCartBody.innerHTML = "";
  items.forEach((it) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<img src="${it.image}" alt="${it.name}"><div style="flex:1"><strong>${it.name}</strong><div style="color:#666">Qty: ${it.quantity} • $${it.price.toFixed(2)}</div></div><button data-id="${it.id}" class="remove">Remove</button>`;
    miniCartBody.appendChild(div);
  });
}

if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    miniCart.classList.toggle("open");
    miniCart.setAttribute("aria-hidden", !miniCart.classList.contains("open"));
    renderMiniCart();
  });
}
if (closeMini) {
  closeMini.addEventListener("click", () => {
    miniCart.classList.remove("open");
    miniCart.setAttribute("aria-hidden", "true");
  });
}
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    saveCart([]);
    renderMiniCart();
  });
}
if (miniCartBody) {
  miniCartBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove")) {
      const id = e.target.getAttribute("data-id");
      let items = getCart();
      items = items.filter((i) => i.id != id);
      saveCart(items);
      renderMiniCart();
    }
  });
}
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    const user = localStorage.getItem("user");
    if (!user) {
      const go = confirm(
        "You must be logged in to checkout. Go to the Register page?",
      );
      if (go) window.location.href = "login.html";
      return;
    }
    // proceed to checkout flow (demo)
    window.location.href = "checkout.html";
  });
}

// helper to add product from other parts of site
window.addToCart = function addToCart(product) {
  addItemToCart(product);
  renderMiniCart();
};

// Listen for updates from other scripts (like cart.js)
window.addEventListener("cartUpdated", () => {
  renderMiniCart();
  updateCartCountGlobal();
});

// Auth state: show login/register links and if user exists replace them with username + logout
function renderAuthState() {
  const raw = localStorage.getItem("user");
  const navActions = document.querySelector(".nav-actions");
  const existing = document.querySelector(".auth-user");
  if (existing) existing.remove();
  if (!raw) {
    if (loginLink) loginLink.style.display = "inline-flex";
    if (registerLink) registerLink.style.display = "inline-flex";
    return;
  }
  if (loginLink) loginLink.style.display = "none";
  if (registerLink) registerLink.style.display = "none";
  const user = JSON.parse(raw);
  const div = document.createElement("div");
  div.className = "auth-user";
  div.innerHTML = `<span>${user.name}</span> <button id="logout-btn" class="icon-btn">Logout</button>`;
  navActions.appendChild(div);
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    renderAuthState();
  });
}

// init
updateCartCountGlobal();
renderAuthState();
renderMiniCart();

