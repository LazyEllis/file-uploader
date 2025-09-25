const mobileMenuButton = document.querySelector("#mobile-menu-button");
const mobileMenu = document.querySelector("#mobile-menu");
const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

const toggleMobileMenu = () => mobileMenu.classList.toggle("open");

const toggleDropdown = (e) => {
  const dropdownMenu = e.currentTarget.nextElementSibling;
  dropdownMenu.classList.toggle("open");
};

const closeDropdown = (e) => {
  const dropdownMenus = document.querySelectorAll(".dropdown-menu.open");

  if (dropdownMenus.length === 0) return;

  dropdownMenus.forEach((dropdownMenu) => {
    if (dropdownMenu.parentNode.contains(e.target)) return;
    dropdownMenu.classList.remove("open");
  });
};

mobileMenuButton.addEventListener("click", toggleMobileMenu);

dropdownToggles.forEach((toggle) =>
  toggle.addEventListener("click", toggleDropdown),
);

window.addEventListener("click", closeDropdown);
