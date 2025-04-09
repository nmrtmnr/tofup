const Menu = (element) => {
  element.addEventListener("click", () => {
    element.classList.toggle("c-menu--active");
  });
};

export default Menu;
