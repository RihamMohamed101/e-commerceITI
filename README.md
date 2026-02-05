# Zekra Perfumes Project

## Project Structure

This project has been refactored into a unified structure with clean code practices.

### Directories

- **`assets/`**: Contains all static assets.
  - **`css/`**: Stylesheets (`style.css` is the main global file).
  - **`js/`**: JavaScript files (`components.js` handles Navbar/Footer).
  - **`images/`**: All images.
  - **`videos/`**: Video assets.
- **`pages/`**: (Optional, currently all HTML files are in the root for simplicity).

### Key Features

- **Dynamic Navbar & Footer**: The Navbar and Footer are loaded dynamically via `assets/js/components.js`. To modify them, edit this single file.
- **Unified Assets**: All assets are centralized.
- **Cleaned Code**: Duplicates removed (partially, structure is now clean).

## How to Edit

1.  **Modify Navbar/Footer**: Open `assets/js/components.js` and edit the HTML strings.
2.  **Add Pages**: Create a new HTML file, add `<header class="navbar"></header>` and `<footer class="footer"></footer>`, and include `assets/js/components.js` and `assets/js/script.js`.
3.  **Styles**: Main styles are in `assets/css/style.css`. Page-specific styles are in properties files like `products.css`, `cart.css`.

## Setup

Simply open `index.html` in your browser. No server required (though recommended for some features).
