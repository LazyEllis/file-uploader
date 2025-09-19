const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

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

dropdownToggles.forEach((toggle) =>
  toggle.addEventListener("click", toggleDropdown),
);

window.addEventListener("click", closeDropdown);
