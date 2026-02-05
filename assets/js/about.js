// navbar

window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar"); // Changed from #navbar to .navbar
  if (nav) {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  }
});

// end navbar

// Theme btn
  const checkbox = document.getElementById("themecheckbox");

  const savedTheme = localStorage.getItem("theme");

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      
      localStorage.setItem("theme", "dark");
    } else {
      
      localStorage.setItem("theme", "light");
    }
  });

  if (savedTheme === "dark") {
  
    checkbox.checked = true;
    document.documentElement.classList.add("dark");
  }

  if (savedTheme === "light") {
   
    checkbox.checked = false;
    document.documentElement.classList.remove("dark");
  }

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
     
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  });

// end Theme btn