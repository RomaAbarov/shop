const burgerMenu = document.querySelector(".burger-menu");
const burgerButton = document.querySelector(".burger-menu__button");
const mainBurgermenu = document.querySelector(".enhanced > .burger-menu__list");
const lastElemMainBurgermenu = mainBurgermenu.querySelector(
  ":scope > .burger-menu__list-item:last-child"
);

burgerButton.addEventListener("click", function () {
  burgerButton.classList.toggle("active");
  document.body.classList.toggle("stop-scroll");
  toggleDropdown(burgerButton, mainBurgermenu);
});

//выход по esc из главной страницы бургер меню
burgerMenu.addEventListener("keydown", (e) => {
  if (e.code === "Escape" && focusIsInside(burgerMenu)) {
    burgerButton.classList.remove("active");
    toggleDropdown(burgerButton, mainBurgermenu);
  }

  if (e.code === "Tab" && e.shiftKey && focusIsInside(burgerButton)) {
    toggleDropdown(burgerButton, mainBurgermenu);
  }

  if (e.code === "Tab" && focusIsInside(lastElemMainBurgermenu)) {
    toggleDropdown(burgerButton, mainBurgermenu);
  }
});

//при клике вне бургер-меню

document.body.addEventListener("click", (e) => {
  const target = e.target;

  if (!burgerMenu.contains(target)) {
    collapseDropdownsWhenClickingOutside(target);
    burgerButton.classList.remove("active");
    document.body.classList.remove("stop-scroll");

    const ulAnimation = burgerMenu.querySelectorAll(
      ".burger-menu__list.animation"
    );
    if (ulAnimation) {
      ulAnimation.forEach((ul) => ul.classList.remove("animation"));
    }

    if (burgerButton.getAttribute("aria-expanded") === "true") {
      burgerButton.setAttribute("aria-expanded", "false");
      mainBurgermenu.setAttribute("hidden", "");
    }
  }
});

// работа с вложенными меню в главное меню
const submenus = document.querySelectorAll(
  ".burger-menu__list-item[data-has-children]"
);

submenus.forEach((item) => {
  const dropdowns = item.querySelectorAll(":scope .burger-menu__list");
  dropdowns.forEach((dropdown) => {
    dropdown.setAttribute("hidden", "");

    //перемещение с клавиатуры
    dropdown.addEventListener("keydown", function (e) {
      if (!e.code === "Tab") return;

      let firstFocusableEl = dropdown.firstElementChild.firstElementChild;
      let lastFocusableEl = dropdown.lastElementChild.firstElementChild;

      tabFocusRestrictor(e, firstFocusableEl, lastFocusableEl);
    });
  });

  const buttons = item.querySelectorAll("button");

  buttons.forEach((button) => {
    let menuButton = button.matches(".burger-menu__list-button");

    if (menuButton) {
      // кнопка выпадающего меню
      let dropdown = button.parentNode.querySelector(".burger-menu__list");

      //проверка на то что у кнопки есть выпадаюший выпадающий список
      if (!dropdown) return;

      let buttonBack = dropdown.querySelector(".burger-menu__back");

      button.addEventListener("click", function (e) {
        toggleDropdown(button, dropdown);
        toggleDropdown(buttonBack, dropdown);

        dropdown.firstElementChild.firstElementChild.focus();
        dropdown.classList.add("animation");
      });

      dropdown.addEventListener(
        "keydown",
        (e) => {
          e.stopImmediatePropagation();

          if (e.code === "Escape" && focusIsInside(dropdown)) {
            toggleDropdown(button, dropdown);
            toggleDropdown(buttonBack, dropdown);
            dropdown.classList.remove("animation");
            button.focus();
          }
        },
        false
      );
    } else {
      // кнопка назад
      let dropdown = button.parentNode.parentNode;
      let buttonSwitch = dropdown.parentNode.querySelector(
        ":scope > .burger-menu__list-button"
      );

      button.addEventListener("click", function (e) {
        toggleDropdown(button, dropdown);
        toggleDropdown(buttonSwitch, dropdown);
        buttonSwitch.focus();
        dropdown.classList.remove("animation");
      });
    }
  });
});

function toggleDropdown(button, dropdown) {
  if (button.getAttribute("aria-expanded") === "true") {
    button.setAttribute("aria-expanded", "false");
    dropdown.setAttribute("hidden", "");
  } else {
    button.setAttribute("aria-expanded", "true");
    dropdown.removeAttribute("hidden");
  }
}

const dropdowns = document.querySelectorAll(
  ".burger-menu__list-item[data-has-children] .burger-menu__list"
);

function collapseDropdownsWhenClickingOutside(target) {
  dropdowns.forEach(function (dropdown) {
    if (!dropdown.parentNode.contains(target)) {
      dropdown.setAttribute("hidden", "");
      const button = dropdown.parentNode.querySelector("button");
      button.setAttribute("aria-expanded", "false");
      const buttonBack = dropdown.querySelector(":scope .burger-menu__back");
      buttonBack.setAttribute("aria-expanded", "false");
    }
  });
}

function focusIsInside(element) {
  return element.contains(document.activeElement);
}

// Закрываем навигацию, если протапались за её пределы
document.addEventListener("keyup", collapseDropdownsWhenTabbingOutside);

function collapseDropdownsWhenTabbingOutside(e) {
  if (e.code === "Tab" && !focusIsInside(burgerMenu)) {
    dropdowns.forEach(function (dropdown) {
      dropdown.setAttribute("hidden", "");

      const button = dropdown.parentNode.querySelector("button");
      button.setAttribute("aria-expanded", "false");

      const buttonBack = dropdown.querySelector(":scope .burger-menu__back");
      buttonBack.setAttribute("aria-expanded", "false");

      burgerButton.classList.remove("active");
      document.body.classList.remove("stop-scroll");
    });
  }
}

function tabFocusRestrictor(e, firstItem, lastItem) {
  if (e.code === "Tab" && e.shiftKey && firstItem === document.activeElement) {
    lastItem.focus();
    e.preventDefault();
  }

  if (e.code === "Tab" && !e.shiftKey && lastItem === document.activeElement) {
    firstItem.focus();
    e.preventDefault();
  }
}
