// Highlight active nav link on click
const navItems = document.querySelectorAll(".sidebar li");

navItems.forEach(item => {
  item.addEventListener("click", () => {
    navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
  });
});
