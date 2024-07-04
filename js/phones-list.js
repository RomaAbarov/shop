//набросал от себя (в макете ничего не показано)

const button = document.querySelector(".phones__button-list");
const ul = document.querySelector(".phones__list");
const links = ul.querySelectorAll(".phones__list-link");

button.addEventListener("click", function () {
  ul.classList.toggle("active");

  if (ul.classList.contains("active")) {
    ul.setAttribute("aria-expanded", "true");
    ul.setAttribute("aria-hidden", "false");
    links.forEach((link) => link.setAttribute("tabindex", "0"));
  } else {
    ul.setAttribute("aria-expanded", "false");
    ul.setAttribute("aria-hidden", "true");
    links.forEach((link) => link.setAttribute("tabindex", "-1"));
  }
});
