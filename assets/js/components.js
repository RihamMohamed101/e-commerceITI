// Navbar is now static in HTML files.

const footerHTML = `
  <div class="footer-container">
    <div class="footer-col brand">
        <!-- Update path to absolute or relative if needed. Assuming style.css handles size. -->
        <img src="assets/images/WhatsApp Image 2026-01-31 at 11.41.56 AM.jpeg" alt="Logo" style="max-width: 150px;">
      <p>
        Discover luxury perfumes crafted to match your personality.
        Timeless scents, unforgettable moments.
      </p>
    </div>

    <div class="footer-col">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="products.html">Shop</a></li>
        <li><a href="about.html">About Us</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Help</h4>
      <ul>
        <li><a href="#">FAQs</a></li>
        <li><a href="#">Shipping</a></li>
        <li><a href="#">Returns</a></li>
        <li><a href="#">Privacy Policy</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Follow Us</h4>
      <div class="social-icons">
        <a href="#"><i class="fab fa-facebook-f"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-tiktok"></i></a>
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    <p>© 2026 ELIXIR Perfumes. All rights reserved.</p>
  </div>
`;

function loadComponents() {
  const header = document.querySelector("header.navbar");
  const footer = document.querySelector("footer.footer");

  /* Navbar is now static in HTML files
  if (header) {
    header.innerHTML = navbarHTML;
    // Re-highlight active link based on current URL
    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";
    const links = header.querySelectorAll("nav ul li a");
    links.forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active"); // Ensure CSS has .active style if needed
      }
    });
  }
  */

  if (footer) {
    footer.innerHTML = footerHTML;
  }
}

// Execute immediately
loadComponents();
