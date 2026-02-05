// Navbar Logic
window.addEventListener("scroll", () => {
  document
    .querySelector("#navbar")
    ?.classList.toggle("scrolled", window.scrollY > 10);
});

document.addEventListener("DOMContentLoaded", () => {
  // Fix: Target the correct container ID from wishlist.html
  const section = document.getElementById("wishlist-grid");
  if (!section) return;

  renderWishlist();

  window.addEventListener("wishlistUpdated", renderWishlist);
});

function renderWishlist() {
  const section = document.getElementById("wishlist-grid");
  const items = window.getWishlist();

  section.innerHTML = "";

  // Ensure the container has the row class for the grid system
  section.className = "row";

  if (items.length === 0) {
    section.innerHTML = `
          <div class="empty-wishlist col-12" style="text-align: center; padding: 50px;">
            <div class="image-wrapper" style="margin-bottom: 20px;">
               <i class="fa-regular fa-heart" style="font-size: 60px; color: #ccc;"></i>
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Start saving your favorite items now!</p>
            <a href="products.html" class="btn btn-dark mt-3">Go Shopping</a>
          </div>
        `;
    return;
  }

  items.forEach((item) => {
    // In wishlist, item is always "wished", so heart is solid red
    section.innerHTML += `
      <div class="col-lg-3 col-md-6 mb-4">
        <div class="box p-3 bg-light rounded-4 h-100 shadow-sm" style="cursor: pointer;" onclick="window.location.href='product-details.html?id=${item.id}'">

          <div class="cont position-relative overflow-hidden mb-3">
            <figure class="m-0">
              <img src="${item.image}" class="w-100 rounded-3" alt="${item.name}" style="height: 250px; object-fit: cover;" />
            </figure>

            <div class="layer d-flex justify-content-evenly align-items-center position-absolute top-0 start-0 w-100 h-100 opacity-0 bg-dark bg-opacity-25 transition-all">
               <button class="btn btn-light btn-sm rounded-circle"><i class="fa-solid fa-eye"></i></button>
            </div>
          </div>

          <div class="text-content d-flex justify-content-between align-items-center">
            <div>
              <h3 class="h6 fw-bold mb-1" style="color: #333;">${item.name}</h3>
              <p class="text-muted fw-bold small mb-0">$${item.price.toFixed(2)}</p>
            </div>

            <div class="d-flex gap-2">
              <button
                class="btn btn-danger text-white btn-sm rounded-3"
                onclick="event.stopPropagation(); removeFromWishlist(${item.id})">
                <i class="fa-solid fa-heart"></i>
              </button>

              <button class="btn btn-dark btn-sm rounded-3 px-3" onclick="event.stopPropagation(); addToCartFromWishlist(${item.id})">
                <i class="fa-solid fa-cart-plus"></i>
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  });
}

// Remove function needs to remain same, but the UI button calls it
// existing removeFromWishlist is good.

function addToCartFromWishlist(id) {
  const items = window.getWishlist();
  const product = items.find((i) => i.id == id);
  if (product) {
    window.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    alert("Added to cart!");
  }
}
