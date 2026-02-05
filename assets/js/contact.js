const checkbox = document.getElementById("themecheckbox");
const root = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  root.classList.add("dark");
  checkbox.checked = true;
} else {
  root.classList.remove("dark");
  checkbox.checked = false;
}

// Toggle theme on click
checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});




document.getElementById("formbtn").addEventListener("click",()=>{
  alert("Message Sent!");
})
