navbarBurgerClick = function navbarBurgerClick(id) {
    if (id.getAttribute("class") === "navbar-burger") {
        id.setAttribute("class", "navbar-burger is-active");
        document.getElementById("navbar-menu").setAttribute("class", "navbar-menu is-active");
    } else {
        id.setAttribute("class", "navbar-burger");
        document.getElementById("navbar-menu").setAttribute("class", "navbar-menu");
    }
};