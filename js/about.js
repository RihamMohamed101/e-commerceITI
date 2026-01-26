

window.addEventListener("scroll", () => {
  document.querySelector("#navbar")
    .classList.toggle("scrolled", window.scrollY > 10);
});



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

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  });

