let products = null;

fetch("assets/data/products.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    showDetail();
    showSimilarProducts();
  });

const productId = new URLSearchParams(window.location.search).get("id");

function showDetail() {
  const mainImgContainer = document.querySelector(".main-image");
  const subImgContainer = document.querySelector(".sub-images"); // Select the new sub-images container
  const nameEl = document.querySelector(".name");
  const priceEl = document.querySelector(".price");
  const descEl = document.querySelector(".description");
  const wishBtn = document.querySelector(".add-to-wishlist");

  const product = products.find((p) => p.id == productId);

  if (product) {
    // 1. Handle Images (Array logic)
    // Check if 'images' array exists, otherwise fallback to single 'image' wrapped in array
    const imageList = product.images || [product.image];

    // Set Main Image (First one by default)
    mainImgContainer.innerHTML = `<img src="${imageList[0]}" id="mainImgDisplay" alt="${product.name}">`;

    // Clear previous sub-images
    subImgContainer.innerHTML = "";

    // Generate Sub Images
    imageList.forEach((imgSrc, index) => {
      const imgEl = document.createElement("img");
      imgEl.src = imgSrc;
      imgEl.classList.add("sub-thumb");
      if (index === 0) imgEl.classList.add("active"); // Highlight first one

      // Hover Event to change Main Image
      imgEl.onmouseover = function () {
        // Change main image source
        document.getElementById("mainImgDisplay").src = this.src;

        // Remove active class from all and add to current
        document
          .querySelectorAll(".sub-thumb")
          .forEach((el) => el.classList.remove("active"));
        this.classList.add("active");
      };

      subImgContainer.appendChild(imgEl);
    });

    // 2. Set Text Details
    nameEl.innerText = product.name;
    priceEl.innerText = `$${product.price}`;
    descEl.innerText = product.description;

    // 3. Wishlist Logic (Same as before)
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let isInWishlist = wishlist.some((item) => item.id == product.id);

    function updateButtonState() {
      if (isInWishlist) {
        wishBtn.innerHTML = '<i class="fa-solid fa-heart"></i> Wishlisted';
        wishBtn.classList.add("active");
      } else {
        wishBtn.innerHTML =
          '<i class="fa-regular fa-heart"></i> Add to Wishlist';
        wishBtn.classList.remove("active");
      }
    }
    updateButtonState();

    wishBtn.onclick = () => {
      wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      if (isInWishlist) {
        wishlist = wishlist.filter((item) => item.id != product.id);
        isInWishlist = false;
      } else {
        // Use the first image for the wishlist thumbnail
        wishlist.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: imageList[0],
        });
        isInWishlist = true;
      }
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      updateButtonState();
    };

    // 4. Cart Logic
    const cartBtn = document.querySelector(".add-to-cart-btn");
    if (cartBtn) {
      cartBtn.onclick = () => {
        // product object is available here
        addItemToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: imageList[0], // Use first image
          quantity: 1,
          maxStock: product.quantity,
        });
        alert(`${product.name} added to cart`); // Simple feedback
      };
    }
  }
}

function showSimilarProducts() {
  const simContainer = document.querySelector(".simImages");
  const similarProducts = products.filter((p) => p.id != productId);

  simContainer.innerHTML = "";

  similarProducts.forEach((product) => {
    let imageSrc =
      product.images && product.images.length > 0
        ? product.images[0]
        : product.image;

    let newProduct = document.createElement("div");
    newProduct.classList.add("item");
    newProduct.innerHTML = `
            <a href="product-details.html?id=${product.id}">
                <img src="${imageSrc}" alt="${product.name}" class="simImage">
                <div class="simName">${product.name}</div>
                <div class="simPrice">$${product.price}</div>
            </a>
        `;
    simContainer.appendChild(newProduct);
  });
}
