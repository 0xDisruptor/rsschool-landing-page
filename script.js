"use strict";

const isCatalog = Boolean(document.querySelector("#product-grid"));
const mobileQuery = window.matchMedia("(max-width: 768px)");

const homeSection = (id) =>
  isCatalog ? `./index.html#${id}` : `#${id}`;

const money = (value) => `$${Number(value).toFixed(2)}`;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

/* Shared header and footer */

document.querySelector("#header").innerHTML = `
  <a class="logo" href="./index.html" aria-label="Resource Coffee House home">
    <img src="./assets/logo.svg" alt="Resource Coffee House"
      width="100" height="60">
  </a>

  <nav class="site-nav" id="site-nav" aria-label="Main navigation">
    <ul class="nav-list">
      <li>
        <a class="nav-link" href="${homeSection("favorite-coffee")}">
          Favorite coffee
        </a>
      </li>
      <li>
        <a class="nav-link" href="${homeSection("about")}">About</a>
      </li>
      <li>
        <a class="nav-link" href="${homeSection("mobile-app")}">Mobile app</a>
      </li>
      <li>
        <a class="nav-link" href="#contact">Contact us</a>
      </li>
      <li class="mobile-menu-item">
        <a class="menu-link" href="./menu.html"
          ${isCatalog ? 'aria-current="page"' : ""}>
          Menu
          <img class="icon theme-icon" src="./assets/cup.svg" alt="">
        </a>
      </li>
    </ul>
  </nav>

  <div class="header-actions">
    <button class="theme-toggle" type="button" id="theme-toggle"
      aria-label="Dark theme" aria-pressed="false">
      <span class="theme-choice theme-sun">
        <img src="./assets/sun.svg" alt="">
      </span>
      <span class="theme-choice theme-moon">
        <img src="./assets/moon.svg" alt="">
      </span>
    </button>

    <a class="menu-link desktop-menu-link" href="./menu.html"
      ${isCatalog ? 'aria-current="page"' : ""}>
      Menu
      <img class="icon theme-icon" src="./assets/cup.svg" alt="">
    </a>

    <button class="burger" id="burger" type="button"
      aria-label="Open navigation" aria-expanded="false"
      aria-controls="site-nav">
      <span></span>
      <span></span>
    </button>
  </div>
`;

document.querySelector("#contact").innerHTML = `
  <div class="footer-intro">
    <h2>Sip, Savor, Smile.<br><em>It’s coffee time!</em></h2>

    <div class="social-links">
      <a class="round-button" href="https://twitter.com/"
        target="_blank" rel="noopener noreferrer" aria-label="Twitter">
        <img class="icon" src="./assets/twitter.svg" alt="">
      </a>
      <a class="round-button" href="https://www.instagram.com/"
        target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <img class="icon" src="./assets/instagram.svg" alt="">
      </a>
      <a class="round-button" href="https://www.facebook.com/"
        target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <img class="icon" src="./assets/facebook.svg" alt="">
      </a>
    </div>
  </div>

  <div class="contacts">
    <h3>Contact us</h3>
    <address>
      <a class="contact-link"
        href="https://www.google.com/maps/search/?api=1&query=8558+Green+Rd+Los+Angeles"
        target="_blank" rel="noopener noreferrer">
        <img class="icon" src="./assets/pin.svg" alt="">
        8558 Green Rd., LA
      </a>

      <a class="contact-link" href="tel:+16035550123">
        <img class="icon" src="./assets/phone.svg" alt="">
        +1 (603) 555-0123
      </a>

      <p class="contact-hours">
        <img class="icon" src="./assets/clock.svg" alt="">
        Mon–Sat: 9:00–23:00
      </p>
    </address>
  </div>
`;

/* Theme */

const themeToggle = document.querySelector("#theme-toggle");

function updateThemeButton() {
  themeToggle.setAttribute(
    "aria-pressed",
    String(document.documentElement.dataset.theme === "dark")
  );
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";

  document.documentElement.dataset.theme = nextTheme;

  try {
    localStorage.setItem("coffee-theme", nextTheme);
  } catch {
    // Theme switching still works when storage is unavailable.
  }

  updateThemeButton();
});

window.addEventListener("storage", (event) => {
  if (event.key !== "coffee-theme") return;

  document.documentElement.dataset.theme =
    event.newValue === "dark" ? "dark" : "light";

  updateThemeButton();
});

/* Mobile navigation */

const burger = document.querySelector("#burger");
const navigation = document.querySelector("#site-nav");
const pageMain = document.querySelector("main");
const pageFooter = document.querySelector("footer");

let menuOpen = false;

function updateScrollLock() {
  const modalOpen = Boolean(
    document.querySelector("#product-dialog")?.open
  );

  document.body.classList.toggle("scroll-locked", menuOpen || modalOpen);
}

function setMenu(open, restoreFocus = false) {
  menuOpen = open && mobileQuery.matches;

  navigation.classList.toggle("is-open", menuOpen);
  burger.setAttribute("aria-expanded", String(menuOpen));
  burger.setAttribute(
    "aria-label",
    menuOpen ? "Close navigation" : "Open navigation"
  );

  navigation.inert = mobileQuery.matches && !menuOpen;
  pageMain.inert = menuOpen;
  pageFooter.inert = menuOpen;

  document.body.classList.toggle("menu-open", menuOpen);
  updateScrollLock();

  if (restoreFocus) burger.focus();
}

setMenu(false);

burger.addEventListener("click", () => {
  setMenu(!menuOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});

mobileQuery.addEventListener("change", () => {
  setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (!menuOpen) return;

  if (event.key === "Escape") {
    event.preventDefault();
    setMenu(false, true);
    return;
  }

  if (event.key !== "Tab") return;

  const controls = Array.from(
    document.querySelectorAll("#header a, #header button")
  ).filter((element) => element.getClientRects().length > 0);

  const first = controls[0];
  const last = controls[controls.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

/* Home slider */

const sliderTrack = document.querySelector(".slider-track");

if (sliderTrack) {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = Array.from(document.querySelectorAll(".slider-dot"));
  const sliderWindow = document.querySelector(".slider-window");
  const status = document.querySelector("#slide-status");

  let currentSlide = 0;
  let touchStart = null;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    sliderTrack.style.transform =
      `translateX(-${currentSlide * 100}%)`;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentSlide;
      slide.setAttribute("aria-hidden", String(!active));
      slide.inert = !active;
    });

    dots.forEach((dot, dotIndex) => {
      dot.setAttribute("aria-pressed", String(dotIndex === currentSlide));
    });

    const name = slides[currentSlide].querySelector("h3").textContent;
    status.textContent = `${name}. Slide ${currentSlide + 1} of ${slides.length}.`;
  }

  document.querySelector(".slider-prev").addEventListener("click", () => {
    showSlide(currentSlide - 1);
  });

  document.querySelector(".slider-next").addEventListener("click", () => {
    showSlide(currentSlide + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  sliderWindow.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(currentSlide - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(currentSlide + 1);
    }
  });

  sliderWindow.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) {
      touchStart = null;
      return;
    }

    touchStart = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }, { passive: true });

  sliderWindow.addEventListener("touchend", (event) => {
    if (!touchStart) return;

    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      showSlide(currentSlide + (dx < 0 ? 1 : -1));
    }

    touchStart = null;
  }, { passive: true });

  sliderWindow.addEventListener("touchcancel", () => {
    touchStart = null;
  });

  showSlide(0);
}

/* Catalog and product modal */

if (isCatalog) {
  const grid = document.querySelector("#product-grid");
  const categoryButtons = document.querySelectorAll("[data-category]");
  const loadMore = document.querySelector("#load-more");
  const status = document.querySelector("#catalog-status");

  const dialog = document.querySelector("#product-dialog");
  const modalImage = document.querySelector("#modal-image");
  const modalTitle = document.querySelector("#modal-title");
  const modalDescription = document.querySelector("#modal-description");
  const sizeOptions = document.querySelector("#size-options");
  const additiveOptions = document.querySelector("#additive-options");
  const priceOutput = document.querySelector("#modal-price");

  let category = "coffee";
  let expanded = false;
  let selectedProduct = null;
  let lastProductButton = null;
  let renderedProducts = [];

  function visibleProducts() {
    const categoryProducts = products.filter(
      (product) => product.category === category
    );

    return mobileQuery.matches && !expanded
      ? categoryProducts.slice(0, 4)
      : categoryProducts;
  }

  function updateCatalog() {
    const visible = visibleProducts();
    const total = products.filter(
      (product) => product.category === category
    ).length;

    const firstNewIndex = renderedProducts.length;

    const sameProducts =
      visible.length === renderedProducts.length &&
      visible.every((product, index) => product.id === renderedProducts[index]);

    if (!sameProducts) {
      grid.innerHTML = visible.map((product) => `
        <article class="product-card">
          <button class="product-button" type="button"
            data-product="${product.id}"
            aria-haspopup="dialog"
            aria-label="View ${escapeHTML(product.name)}">
            <span class="product-image">
              <img src="${product.image}"
                alt="${escapeHTML(product.name)}"
                width="310" height="310" loading="lazy">
            </span>

            <span class="product-content">
              <span class="product-name" role="heading" aria-level="2">
                ${escapeHTML(product.name)}
              </span>
              <span class="product-description">
                ${escapeHTML(product.description)}
              </span>
              <span class="price">${money(product.price)}</span>
            </span>
          </button>
        </article>
      `).join("");

      renderedProducts = visible.map((product) => product.id);
    }

    loadMore.hidden = visible.length >= total;
    status.textContent = `${visible.length} of ${total} ${category} products shown.`;

    categoryButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.category === category)
      );
    });

    return firstNewIndex;
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      category = button.dataset.category;
      expanded = false;
      updateCatalog();
    });
  });

  loadMore.addEventListener("click", () => {
    expanded = true;
    const firstNewIndex = updateCatalog();

    grid.querySelectorAll(".product-button")[firstNewIndex]?.focus({
      preventScroll: true
    });
  });

  mobileQuery.addEventListener("change", () => {
    expanded = false;
    updateCatalog();
  });

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-product]");
    if (!button) return;

    const product = products.find(
      (item) => item.id === button.dataset.product
    );

    if (!product) return;

    lastProductButton = button;
    openProduct(product);
  });

  function openProduct(product) {
    selectedProduct = product;

    modalTitle.textContent = product.name;
    modalDescription.textContent = product.description;
    modalImage.src = product.image;
    modalImage.alt = product.name;

    sizeOptions.innerHTML = Object.entries(product.sizes)
      .map(([key, value], index) => `
        <label class="option-label">
          <input class="visually-hidden" type="radio"
            name="size" value="${key}" ${index === 0 ? "checked" : ""}>
          <b>${key.toUpperCase()}</b>
          <span>${escapeHTML(value.size)}</span>
        </label>
      `).join("");

    additiveOptions.innerHTML = product.additives
      .map((additive, index) => `
        <label class="option-label">
          <input class="visually-hidden" type="checkbox"
            name="additive" value="${index}">
          <b>${index + 1}</b>
          <span>${escapeHTML(additive.name)}</span>
        </label>
      `).join("");

    updatePrice();
    dialog.showModal();
    updateScrollLock();
  }

  function updatePrice() {
    if (!selectedProduct) return;

    const sizeKey = dialog.querySelector('[name="size"]:checked').value;
    const size = selectedProduct.sizes[sizeKey];

    // Calculate in cents to avoid floating-point rounding errors.
    let cents = Math.round(Number(selectedProduct.price) * 100);
    cents += Math.round(Number(size["add-price"]) * 100);

    dialog.querySelectorAll('[name="additive"]:checked').forEach((input) => {
      const additive = selectedProduct.additives[Number(input.value)];
      cents += Math.round(Number(additive["add-price"]) * 100);
    });

    priceOutput.value = money(cents / 100);
  }

  dialog.addEventListener("change", updatePrice);

  document.querySelector("#modal-close").addEventListener("click", () => {
    dialog.close();
  });

  // Close only when the pointer starts and ends outside the dialog box.
  let pointerStartedOutside = false;

  function outsideDialog(event) {
    const rect = dialog.getBoundingClientRect();

    return event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
  }

  dialog.addEventListener("pointerdown", (event) => {
    pointerStartedOutside = outsideDialog(event);
  });

  dialog.addEventListener("click", (event) => {
    if (pointerStartedOutside && outsideDialog(event)) {
      dialog.close();
    }

    pointerStartedOutside = false;
  });

  // Native <dialog> also closes on Escape and traps keyboard focus.
  dialog.addEventListener("close", () => {
    updateScrollLock();

    if (lastProductButton?.isConnected) {
      lastProductButton.focus({ preventScroll: true });
    } else {
      document.querySelector(
        `[data-category="${category}"]`
      )?.focus({ preventScroll: true });
    }
  });

  updateCatalog();
}