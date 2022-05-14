var btn = document.querySelector("#mobile-menu-button");
var menu = document.querySelector("#mobile-menu");
var btn_profile = document.querySelector("#user-menu-button");
var menu_profile = document.querySelector("#profile_menu"); // Add Event Listeners navbar

btn.addEventListener("click", function () {
  menu.classList.toggle("hidden");
}); // Add Event Listeners profile

btn_profile.addEventListener("click", function () {
  menu_profile.classList.toggle("hidden");
});