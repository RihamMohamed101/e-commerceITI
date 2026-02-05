// ==========================================
// CHECKOUT MANAGEMENT SYSTEM - ENHANCED
// ==========================================

class CheckoutManager {
  constructor() {
    this.cart = this.loadCart();
    this.discountCode = null;
    this.discountPercentage = 0;
    this.shippingCost = 0; // Free shipping
    this.validDiscountCodes = {
      ZEKRA20: 20,
      ZEKRA50: 50,
      SAVE10: 10,
      SAVE20: 20,
      LUXURY15: 15,
    };
    this.init();
  }

  init() {
    this.displayCartItems();
    this.updateSummary();
    this.setupEventListeners();
    this.loadSavedAddress();
  }

  // Load cart from localStorage
  loadCart() {
    return getCart();
  }

  // Save cart to localStorage
  saveCart() {
    saveCart(this.cart);
  }

  // Setup event listeners
  setupEventListeners() {
    // Address editing
    const editAddressBtn = document.getElementById("edit-address");
    const addressForm = document.getElementById("address-form");
    const addressDisplay = document.getElementById("address-display");

    if (editAddressBtn) {
      editAddressBtn.addEventListener("click", () => {
        const isHidden = addressForm.classList.contains("hidden");

        if (isHidden) {
          addressDisplay.classList.add("hidden");
          addressForm.classList.remove("hidden");
          editAddressBtn.textContent = "Cancel";
        } else {
          addressForm.classList.add("hidden");
          addressDisplay.classList.remove("hidden");
          editAddressBtn.textContent = "Edit";
        }
      });
    }

    // Address form submission
    if (addressForm) {
      addressForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveAddress();
      });
    }

    // Payment method selection
    const paymentOptions = document.querySelectorAll(".payment-option-compact");
    paymentOptions.forEach((option) => {
      option.addEventListener("click", () => {
        paymentOptions.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");

        // Show/hide payment details based on selection
        const paymentType = option.getAttribute("data-payment");
        this.showPaymentDetails(paymentType);
      });
    });

    // Card number formatting
    const cardNumberInput = document.getElementById("card-number");
    if (cardNumberInput) {
      cardNumberInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\s/g, "");
        let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
        e.target.value = formattedValue;
      });
    }

    // Expiry date formatting
    const expiryInput = document.getElementById("card-expiry");
    if (expiryInput) {
      expiryInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 2) {
          value = value.slice(0, 2) + "/" + value.slice(2, 4);
        }
        e.target.value = value;
      });
    }

    // CVV input - numbers only
    const cvvInput = document.getElementById("card-cvv");
    if (cvvInput) {
      cvvInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "");
      });
    }

    // Discount code application
    const applyDiscountBtn = document.getElementById("apply-discount");
    if (applyDiscountBtn) {
      applyDiscountBtn.addEventListener("click", () => this.applyDiscount());
    }

    // Enter key for discount code
    const discountInput = document.getElementById("discount-code");
    if (discountInput) {
      discountInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.applyDiscount();
        }
      });
    }

    // Cart items container click handler (Event Delegation)
    const cartItemsContainer = document.getElementById("checkout-cart-items");
    if (cartItemsContainer) {
      cartItemsContainer.addEventListener("click", (e) =>
        this.handleCartAction(e),
      );
    }
  }

  // Handle cart actions (delegated)
  handleCartAction(e) {
    const target = e.target;
    // Handle Quantity buttons (look for closest button if clicked on icon/text)
    const qtyBtn = target.closest(".qty-btn");
    if (qtyBtn) {
      const id = parseInt(qtyBtn.dataset.id);
      const change = parseInt(qtyBtn.dataset.change);
      if (id && change) {
        this.updateQuantity(id, change);
      }
      return;
    }

    // Handle Remove button
    const removeBtn = target.closest(".remove-btn");
    if (removeBtn) {
      const id = parseInt(removeBtn.dataset.id);
      if (id) {
        this.removeItem(id);
      }
    }
  }

  // Show/hide payment details based on selection
  showPaymentDetails(paymentType) {
    const cardDetails = document.getElementById("card-details");
    const paypalDetails = document.getElementById("paypal-details");
    const cashDetails = document.getElementById("cash-details");

    // Hide all
    if (cardDetails) cardDetails.classList.add("hidden");
    if (paypalDetails) paypalDetails.classList.add("hidden");
    if (cashDetails) cashDetails.classList.add("hidden");

    // Show selected
    if (paymentType === "card" && cardDetails) {
      cardDetails.classList.remove("hidden");
    } else if (paymentType === "paypal" && paypalDetails) {
      paypalDetails.classList.remove("hidden");
    } else if (paymentType === "cash" && cashDetails) {
      cashDetails.classList.remove("hidden");
    }
  }

  // Update quantity
  updateQuantity(itemId, change) {
    const item = this.cart.find((i) => i.id === itemId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    this.saveCart();
    this.displayCartItems();
    this.updateSummary();
  }

  // Remove item
  removeItem(itemId) {
    this.cart = this.cart.filter((i) => i.id !== itemId);
    this.saveCart();
    this.displayCartItems();
    this.updateSummary();
    this.showNotification("Item removed from cart", "success");
  }

  // Display cart items with quantity controls
  displayCartItems() {
    const cartItemsContainer = document.getElementById("checkout-cart-items");
    const itemCount = document.getElementById("item-count");

    if (!cartItemsContainer) return;

    if (this.cart.length === 0) {
      cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-light);">
                    <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">Your cart is empty</p>
                    <p style="font-size: 0.9rem;">Add some items to checkout</p>
                    <a href="cart.html" style="display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: var(--secondary-color); color: white; border-radius: 8px; font-weight: 600; text-decoration: none;">Go Shopping</a>
                </div>
            `;
      if (itemCount) itemCount.textContent = "0 items";
      return;
    }

    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (itemCount) {
      itemCount.textContent = `${totalItems} ${totalItems === 1 ? "item" : "items"}`;
    }

    cartItemsContainer.innerHTML = this.cart
      .map(
        (item) => `
            <div class="checkout-cart-item">

    <img
        src="${item.image}"
        alt="${item.name}"
        class="item-image"
        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23f5f0eb%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2210%22 fill=%22%239c816b%22%3E${item.name}%3C/text%3E%3C/svg%3E'"
    >

    <div class="item-details">

        <h4 class="item-name">${item.name}</h4>

        <p class="item-description">
            ${item.description || "Premium luxury fragrance"}
        </p>

        <!-- Footer -->
        <div class="item-footer d-flex align-items-center justify-content-between">

            <!-- Quantity -->
            <div class="quantity-controls d-flex align-items-center gap-2">
                <button
                    class="qty-btn"
                    data-id="${item.id}"
                    data-change="-1"
                    ${item.quantity <= 1 ? "disabled" : ""}
                >−</button>

                <span class="qty-display">${item.quantity}</span>

                <button
                    class="qty-btn"
                    data-id="${item.id}"
                    data-change="1"
                >+</button>
            </div>

            <!-- Actions -->
            <div class="d-flex align-items-center gap-3">

                <!-- Delete -->
                <button
                    class="remove-btn btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                    data-id="${item.id}"
                    style="width:32px;height:32px;"
                    title="Delete"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

                <!-- Price -->
                <span class="item-price fw-bold">
                    $${(item.price * item.quantity).toFixed(2)}
                </span>

            </div>

        </div>

    </div>
</div>

        `,
      )
      .join("");
  }

  // Update price summary
  updateSummary() {
    const subtotal = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const discountAmount = subtotal * (this.discountPercentage / 100);
    const total = subtotal - discountAmount + this.shippingCost;

    // Update subtotal
    const subtotalElement = document.getElementById("summary-subtotal");
    if (subtotalElement) {
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }

    // Update discount row
    const discountRow = document.getElementById("discount-row");
    const discountAmountElement = document.getElementById("discount-amount");
    const appliedCodeElement = document.getElementById("applied-code");

    if (this.discountPercentage > 0 && discountRow) {
      discountRow.classList.remove("hidden");
      if (discountAmountElement) {
        discountAmountElement.textContent = `-$${discountAmount.toFixed(2)}`;
      }
      if (appliedCodeElement) {
        appliedCodeElement.textContent = `(${this.discountCode})`;
      }
    } else if (discountRow) {
      discountRow.classList.add("hidden");
    }

    // Update total
    const totalElement = document.getElementById("summary-total");
    if (totalElement) {
      totalElement.textContent = `$${total.toFixed(2)}`;
    }
  }

  // Apply discount code
  applyDiscount() {
    const discountInput = document.getElementById("discount-code");
    const discountMessage = document.getElementById("discount-message");

    if (!discountInput || !discountMessage) return;

    const code = discountInput.value.trim().toUpperCase();

    if (!code) {
      this.showDiscountMessage("Please enter a discount code", "error");
      return;
    }

    if (this.validDiscountCodes[code]) {
      this.discountCode = code;
      this.discountPercentage = this.validDiscountCodes[code];
      this.updateSummary();
      this.showDiscountMessage(
        `${this.discountPercentage}% discount applied!`,
        "success",
      );
      discountInput.value = "";
      discountInput.disabled = true;
    } else {
      this.showDiscountMessage("Invalid discount code", "error");
    }
  }

  // Show discount message
  showDiscountMessage(message, type) {
    const discountMessage = document.getElementById("discount-message");
    if (!discountMessage) return;

    discountMessage.textContent = message;
    discountMessage.className = `discount-message ${type}`;
    discountMessage.classList.remove("hidden");

    setTimeout(() => {
      discountMessage.classList.add("hidden");
    }, 4000);
  }

  // Load saved address or set Egypt default
  loadSavedAddress() {
    const savedAddress = localStorage.getItem("shippingAddress");
    if (savedAddress) {
      const address = JSON.parse(savedAddress);
      this.displayAddress(address);
      this.populateAddressForm(address);
    } else {
      // Set Alexandria, Egypt as default
      const defaultAddress = {
        name: "Mahmoud Mohamed",
        phone: "+20 10 1234 5678",
        street: "45 El Corniche Street, Sidi Gaber",
        city: "Alexandria",
        postal: "21599",
        governorate: "Alexandria",
      };
      this.displayAddress(defaultAddress);
    }
  }

  // Populate address form
  populateAddressForm(address) {
    const fields = {
      "full-name": address.name,
      phone: address.phone,
      address: address.street,
      city: address.city,
      postal: address.postal,
      governorate: address.governorate,
    };

    Object.entries(fields).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element && value) {
        element.value = value;
      }
    });
  }

  // Display address
  displayAddress(address) {
    const displayName = document.getElementById("display-name");
    const displayAddress = document.getElementById("display-address");
    const displayCity = document.getElementById("display-city");
    const displayCountry = document.getElementById("display-country");

    if (displayName)
      displayName.textContent = address.name || "Mahmoud Mohamed";
    if (displayAddress)
      displayAddress.textContent =
        address.street || "45 El Corniche Street, Sidi Gaber";
    if (displayCity)
      displayCity.textContent = `${address.city || "Alexandria"}, ${address.postal || "21599"}`;
    if (displayCountry) displayCountry.textContent = "Egypt";
  }

  // Save address
  saveAddress() {
    const name = document.getElementById("full-name").value;
    const phone = document.getElementById("phone").value;
    const street = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const postal = document.getElementById("postal").value;
    const governorate = document.getElementById("governorate").value;

    const address = { name, phone, street, city, postal, governorate };
    localStorage.setItem("shippingAddress", JSON.stringify(address));

    this.displayAddress(address);

    // Hide form and show display
    document.getElementById("address-form").classList.add("hidden");
    document.getElementById("address-display").classList.remove("hidden");

    const editBtn = document.getElementById("edit-address");
    editBtn.textContent = "Edit";

    this.showNotification("Address saved successfully!", "success");
  }

  // Place order
  placeOrder() {
    if (this.cart.length === 0) {
      this.showNotification("Your cart is empty!", "error");
      return;
    }

    // Check if address is saved
    const savedAddress = localStorage.getItem("shippingAddress");
    if (!savedAddress) {
      this.showNotification("Please add a shipping address", "warning");
      return;
    }

    // Validate payment details
    const selectedPayment = document.querySelector(
      'input[name="payment"]:checked',
    );
    if (!selectedPayment) {
      this.showNotification("Please select a payment method", "warning");
      return;
    }

    const paymentType = selectedPayment.value;

    // Validate card details
    if (paymentType === "card") {
      const cardNumber = document.getElementById("card-number").value;
      const cardName = document.getElementById("card-name").value;
      const cardExpiry = document.getElementById("card-expiry").value;
      const cardCvv = document.getElementById("card-cvv").value;

      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        this.showNotification("Please fill in all card details", "warning");
        return;
      }

      if (cardNumber.replace(/\s/g, "").length < 16) {
        this.showNotification("Please enter a valid card number", "error");
        return;
      }

      if (cardCvv.length < 3) {
        this.showNotification("Please enter a valid CVV", "error");
        return;
      }
    }

    // Validate PayPal details
    if (paymentType === "paypal") {
      const paypalEmail = document.getElementById("paypal-email").value;
      const paypalPassword = document.getElementById("paypal-password").value;

      if (!paypalEmail || !paypalPassword) {
        this.showNotification("Please fill in PayPal details", "warning");
        return;
      }

      if (!paypalEmail.includes("@")) {
        this.showNotification("Please enter a valid email", "error");
        return;
      }
    }

    // Simulate order processing
    const placeOrderBtn = document.getElementById("place-order-btn");
    if (placeOrderBtn) {
      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = `
                <svg style="width: 20px; height: 20px; animation: spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/>
                </svg>
                <span>Processing...</span>
            `;
    }

    setTimeout(() => {
      // Clear cart
      saveCart([]);

      // Show success message
      this.showSuccessModal(paymentType);
    }, 2000);
  }

  // Show success modal
  showSuccessModal(paymentType = "card") {
    const modal = document.createElement("div");
    modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;

    const total = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const discountAmount = total * (this.discountPercentage / 100);
    const finalTotal = total - discountAmount;

    const paymentMethodText =
      paymentType === "card"
        ? "Card Payment"
        : paymentType === "paypal"
          ? "PayPal"
          : "Cash on Delivery";

    modal.innerHTML = `
            <div style="background: white; padding: 3rem; border-radius: 20px; max-width: 500px; text-align: center; animation: slideUp 0.4s ease-out;">
                <svg style="width: 80px; height: 80px; fill: #5cbb98; margin-bottom: 1.5rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/>
                </svg>
                <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 2rem; color: #1a1614; margin-bottom: 0.5rem;">Order Placed Successfully!</h2>
                <p style="color: #6b6460; margin-bottom: 1.5rem;">Thank you for shopping with Zekra Perfumes</p>
                <div style="background: #faf8f6; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem;">
                    <p style="color: #6b6460; font-size: 0.9rem; margin-bottom: 0.5rem;">Order Total</p>
                    <p style="font-size: 2rem; font-weight: 700; color: #a78d78;">$${finalTotal.toFixed(2)}</p>
                    <p style="color: #6b6460; font-size: 0.85rem; margin-top: 0.5rem;">Payment: ${paymentMethodText}</p>
                </div>
                <button onclick="window.location.href='cart.html'" style="width: 100%; padding: 1rem; background: #9c816b; color: white; border: none; border-radius: 10px; font-weight: 600; font-size: 1rem; cursor: pointer;">Continue Shopping</button>
            </div>
        `;

    document.body.appendChild(modal);

    // Add animation
    const style = document.createElement("style");
    style.textContent = `
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
    document.head.appendChild(style);
  }

  // Show notification
  showNotification(message, type = "info") {
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;

    const styles = {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "1rem 1.5rem",
      borderRadius: "8px",
      backgroundColor:
        type === "success"
          ? "#5cbb98"
          : type === "warning"
            ? "#f59e0b"
            : type === "error"
              ? "#d94d4d"
              : "#a78d78",
      color: "#ffffff",
      fontWeight: "600",
      fontSize: "0.95rem",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
      zIndex: "10000",
      animation: "slideInRight 0.3s ease-out",
      maxWidth: "300px",
    };

    Object.assign(notification.style, styles);
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Animation styles
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize checkout when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.checkout = new CheckoutManager();
});
