(() => {
  const nav = document.querySelector("#nav-main");
  const hamburger = nav?.querySelector(".hamburger");
  const expandedPanel = nav?.querySelector(".nav__expanded");
  const modal = document.querySelector("#video-modal");
  const modalOpenButton = document.querySelector("[data-modal-target='video-modal']");
  const modalCloseButton = modal?.querySelector(".video-modal__close");
  const modalFrame = modal?.querySelector("iframe");
  const initialModalSrc = modalFrame?.getAttribute("src") || "";

  function setNavState(isOpen) {
    if (!nav || !hamburger || !expandedPanel) {
      return;
    }

    nav.classList.toggle("nav--active", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    expandedPanel.setAttribute("aria-hidden", String(!isOpen));
  }

  function openModal() {
    if (!modal) {
      return;
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    if (!modal) {
      return;
    }

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    // Reset the iframe src to stop playback when closing.
    if (modalFrame && initialModalSrc) {
      modalFrame.setAttribute("src", initialModalSrc);
    }
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const isOpen = !nav?.classList.contains("nav--active");
      setNavState(isOpen);
    });
  }

  nav?.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      setNavState(false);
    });
  });

  modalOpenButton?.addEventListener("click", openModal);
  modalCloseButton?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      setNavState(false);
    }
  });

  const footerYear = document.querySelector("#footer-year");
  if (footerYear) {
    footerYear.textContent = `© ${new Date().getFullYear()} Max Kirkby. All rights reserved.`;
  }

  // Mirror the source site behavior to avoid transition glitches during resize.
  const bodyClasses = document.body.classList;
  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    if (resizeTimer) {
      window.clearTimeout(resizeTimer);
      resizeTimer = 0;
    } else {
      bodyClasses.add("resizing");
    }

    resizeTimer = window.setTimeout(() => {
      bodyClasses.remove("resizing");
      resizeTimer = 0;
    }, 100);
  });
})();
