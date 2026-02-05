/**
 * Common Utility Functions
 * Centralizes duplicate logic for Cart Management
 */

// Key for LocalStorage
const CART_KEY = "cart";

// Load Cart
function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  let items = raw ? JSON.parse(raw) : [];

  // Sanitize paths from legacy bugs (double assets/)
  if (items.length) {
    items = items.map((item) => {
      if (item.image && item.image.startsWith("assets/assets/")) {
        item.image = item.image.replace("assets/assets/", "assets/");
      }
      return item;
    });
  }
  return items;
}

// Save Cart
function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartCountGlobal();
}

// Update Cart Count (Badge)
function updateCartCountGlobal() {
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    const items = getCart();
    const total = items.reduce(
      (sum, item) => sum + (item.quantity || item.qty || 1),
      0,
    );
    cartCountEl.textContent = total;
  }
}

// Add Item to Cart (Shared Logic)
// item: { id, name, price, image, quantity, maxStock }
function addItemToCart(product) {
  const items = getCart();
  const existing = items.find((i) => i.id === product.id);

  if (existing) {
    if (product.maxStock && existing.quantity >= product.maxStock) {
      alert("Max stock reached"); // Simple alert, can be improved
      return;
    }
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    items.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart(items);

  // Dispatch event for other scripts to listen to
  window.dispatchEvent(new Event("cartUpdated"));
}

// Expose globally
window.getCart = getCart;
window.saveCart = saveCart;
window.addItemToCart = addItemToCart;
window.updateCartCountGlobal = updateCartCountGlobal;

// Initialize Count on Load
// Initialize Count on Load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCountGlobal();
  updateWishlistCountGlobal(); // Init wishlist count
  // Dispatch event to update wishlist UI if needed
  window.dispatchEvent(new Event("wishlistUpdated"));
});

// Listen for wishlist updates
window.addEventListener("wishlistUpdated", updateWishlistCountGlobal);

/* ================================
   Wishlist Management (Shared)
   ================================ */

const WISHLIST_KEY = "wishlist";

function getWishlist() {
  const raw = localStorage.getItem(WISHLIST_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveWishlist(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("wishlistUpdated"));
}

function toggleWishlist(product) {
  let items = getWishlist();
  const existingIndex = items.findIndex((i) => i.id == product.id);

  if (existingIndex > -1) {
    // Remove
    items.splice(existingIndex, 1);
  } else {
    // Add
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images[0], // Handle different data structures
      description: product.description || "",
    });
  }
  saveWishlist(items);
  return existingIndex === -1; // Returns true if added, false if removed
}

function isInWishlist(id) {
  const items = getWishlist();
  return items.some((i) => i.id == id);
}

function updateWishlistCountGlobal() {
  const badge = document.getElementById("wishlist-count");
  if (!badge) return;
  const items = getWishlist();
  badge.textContent = items.length;
}

// Expose globally
window.getWishlist = getWishlist;
window.saveWishlist = saveWishlist;
window.toggleWishlist = toggleWishlist;
window.isInWishlist = isInWishlist;
window.updateWishlistCountGlobal = updateWishlistCountGlobal;
