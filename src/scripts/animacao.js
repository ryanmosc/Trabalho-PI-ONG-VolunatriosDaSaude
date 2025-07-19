class MobileNavbar {
  constructor(menuButtonSelector, navListSelector) {
    this.menuButton = document.querySelector(menuButtonSelector);
    this.navList = document.querySelector(navListSelector);
    this.activeClass = "active";

    // Bind para manter o contexto
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
  }

  toggleMenu() {
    const isActive = this.navList.classList.toggle(this.activeClass);
    this.menuButton.classList.toggle(this.activeClass);

    // Acessibilidade
    this.menuButton.setAttribute("aria-expanded", isActive);

    // Se ativou o menu, adiciona listeners extras
    if (isActive) {
      document.addEventListener("click", this.handleOutsideClick);
      document.addEventListener("keydown", this.handleEscapeKey);
    } else {
      document.removeEventListener("click", this.handleOutsideClick);
      document.removeEventListener("keydown", this.handleEscapeKey);
    }
  }

  handleOutsideClick(event) {
    if (!this.navList.contains(event.target) && !this.menuButton.contains(event.target)) {
      this.toggleMenu();
    }
  }

  handleEscapeKey(event) {
    if (event.key === "Escape") {
      this.toggleMenu();
    }
  }

  addClickEvent() {
    this.menuButton.addEventListener("click", this.toggleMenu);
  }

  init() {
    if (this.menuButton && this.navList) {
      this.menuButton.setAttribute("aria-expanded", "false");
      this.addClickEvent();
    }
    return this;
  }
}

// Inicia a funcionalidade
const mobileNavbar = new MobileNavbar(".mobile-menu", "#nav_list");
mobileNavbar.init();
