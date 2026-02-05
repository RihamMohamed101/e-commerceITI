var bntt = document.querySelectorAll(".btns button");
var products = [];

(async () => {
  var res = await fetch("assets/data/products.json");
  products = await res.json();
  display(products);
})();

bntt.forEach((e) => {
  e.addEventListener("click", (el) => {
    bntt.forEach((e) => e.classList.remove("active"));

    el.target.classList.add("active");

    var category = el.target.dataset.category;

    if (category == "all") {
      display(products);
    } else {
      var filterData = products.filter((e) => {
        return e.category === category;
      });
      display(filterData);
    }
  });
});

// function display(products) {

//   }
// }

function goTodetails(i) {
  window.location.href = `product-details.html?id=${i}`;
}

function display(products) {
  var dataDisplayed = document.querySelector(".prod");
  dataDisplayed.innerHTML = ``;

  // بنجيب الـ wishlist الحالية عشان نعرف إيه اللي متضاف
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  for (let i = 0; i < products.length; i++) {
    const isWished = window.isInWishlist(products[i].id);

    dataDisplayed.innerHTML += `
      <div class="col-lg-3 col-md-6 mb-4">
        <div class="box p-3 bg-light rounded-4 h-100 shadow-sm" onclick="goTodetails(${products[i].id})" style="cursor: pointer;">

          <div class="cont position-relative overflow-hidden mb-3">
            <figure class="m-0">
              <img src="${products[i].images[0]}" class="w-100 rounded-3" alt="${products[i].title}" style="height: 250px; object-fit: cover;" />
            </figure>

            <div class="layer d-flex justify-content-evenly align-items-center position-absolute top-0 start-0 w-100 h-100 opacity-0 bg-dark bg-opacity-25 transition-all">
               <button class="btn btn-light btn-sm rounded-circle"><i class="fa-solid fa-eye"></i></button>
            </div>
          </div>

          <div class="text-content d-flex justify-content-between align-items-center">
            <div>
              <h3 class="h6 fw-bold mb-1" style="color: #333;">${products[i].name}</h3>
              <p class="text-muted fw-bold small mb-0">$${products[i].price}</p>
            </div>

            <div class="d-flex gap-2">
              <button
                id="wish-btn-${products[i].id}"
                class="btn ${isWished ? "btn-danger text-white" : "btn-outline-danger"} btn-sm rounded-3"
                onclick="handleWishlistClick(event, ${products[i].id})">
                <i class="${isWished ? "fa-solid" : "fa-regular"} fa-heart"></i>
              </button>

              <button class="btn btn-dark btn-sm rounded-3 px-3" onclick="addToCartHandler(${products[i].id}); event.stopPropagation();">
                <i class="fa-solid fa-cart-plus"></i>
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  }
}

function addToCartHandler(id) {
  const p = products.find((x) => x.id == id);
  if (p) {
    const cartItem = {
      id: p.id,
      name: p.name,
      price: p.price,
      image: `${p.images[0]}`,
      quantity: 1,
    };
    window.addToCart(cartItem);
  }
}

function handleWishlistClick(event, id) {
  event.stopPropagation();
  const product = products.find((p) => p.id == id);
  if (product) {
    const added = window.toggleWishlist(product);

    // Update UI button immediately without reloading
    const btn = document.getElementById(`wish-btn-${id}`);
    if (btn) {
      if (added) {
        btn.classList.remove("btn-outline-danger");
        btn.classList.add("btn-danger", "text-white");
        btn.querySelector("i").classList.replace("fa-regular", "fa-solid");
      } else {
        btn.classList.add("btn-outline-danger");
        btn.classList.remove("btn-danger", "text-white");
        btn.querySelector("i").classList.replace("fa-solid", "fa-regular");
      }
    }
  }
}
