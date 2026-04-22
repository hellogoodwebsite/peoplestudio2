(() => {
  const menuContainer = document.querySelector('.menu-container');
  const mobileMenuContainer = document.querySelector('.mobile-menu-container');
  const mobileMenuContent = document.querySelector('.mobile-menu-content');
  const openBtn = document.querySelector('#nav-hamburger-btn');
  const closeBtn = document.querySelector('#mobile-menu-close-btn');

  const showMobileMenu = () => {
    if (!mobileMenuContainer) return;
    if (menuContainer) menuContainer.style.display = 'none';
    mobileMenuContainer.classList.add('enter');
    mobileMenuContent?.classList.add('enter');
    document.body.style.overflow = 'hidden';
  };

  const hideMobileMenu = () => {
    if (!mobileMenuContainer) return;
    mobileMenuContainer.classList.remove('enter');
    mobileMenuContent?.classList.remove('enter');
    if (menuContainer) menuContainer.style.display = 'flex';
    document.body.style.overflow = '';
  };

  openBtn?.addEventListener('click', showMobileMenu);
  closeBtn?.addEventListener('click', hideMobileMenu);

  mobileMenuContainer?.addEventListener('click', (event) => {
    if (event.target === mobileMenuContainer) hideMobileMenu();
  });

  // Dropdown behavior (mobile/tablet)
  document.querySelectorAll('.dropdown').forEach((dropdown) => {
    const trigger = dropdown.querySelector('.dropdown__trigger-link');
    trigger?.addEventListener('click', (event) => {
      if (window.matchMedia('(max-width: 1024px)').matches) {
        event.preventDefault();
        dropdown.classList.toggle('open');
      }
    });
  });

  // Promo interactions
  const promoBanner = document.querySelector('.promo-banner');
  const promoClose = document.querySelector('#promo-banner-close-btn');
  const promoCopy = document.querySelector('.promo-banner-copy-code');
  const promoToast = document.querySelector('.promo-banner-toast');

  promoClose?.addEventListener('click', () => {
    promoBanner?.classList.add('hidden');
  });

  promoCopy?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('A4F20');
      promoToast?.classList.add('visible');
      setTimeout(() => promoToast?.classList.remove('visible'), 1400);
    } catch (_) {
      // no-op for clipboard failures in restricted contexts
    }
  });

  // "Show more..." pills in industry cards
  document.querySelectorAll('.adapt-business-card').forEach((card) => {
    const shortTags = card.querySelector('.adapt-business-card__tags--short');
    const longTags = card.querySelector('.adapt-business-card__tags--long');
    const showMore = shortTags?.querySelector('.adapt-business-card__pill:last-child');

    if (!showMore || !longTags) return;

    showMore.addEventListener('click', () => {
      shortTags?.classList.add('adapt-business-card__tags--hidden');
      longTags.classList.remove('adapt-business-card__tags--hidden');
    });
  });

  // Large CSP hero carousel: autoplay + click navigation + mobile swipe
  (() => {
    const carousel = document.querySelector('#large-csp-carousel');
    const gradient = document.querySelector('.large-csp-hero__gradient');
    if (!carousel || !gradient) return;

    const ACTIVE_SLIDE_CLASS = 'large-csp__carousel-frame--active';
    const ANIMATE_FORWARD_CLASS = 'large-csp__carousel-frame-container--slide-forward';
    const ANIMATE_BACKWARD_CLASS = 'large-csp__carousel-frame-container--slide-backward';
    const MOVE_SLIDE_ELEMENT_DELAY_MS = 600;
    const AUTOPLAY_DELAY_MS = 4000;
    const AUTOPLAY_RESTART_DELAY_MS = 3000;
    const SWIPE_THRESHOLD_PX = 40;
    const SWIPE_VERTICAL_GUARD_PX = 30;

    const dummyHead = carousel.querySelector('#large-csp-dummy-head');
    const dummyTail = carousel.querySelector('#large-csp-dummy-tail');
    const cspElementCount = carousel.querySelectorAll('.large-csp-item').length;

    if (!dummyHead || !dummyTail || cspElementCount < 2) return;

    let activeId = 0;
    const activeSlide = carousel.querySelector(`.${ACTIVE_SLIDE_CLASS}`);
    if (activeSlide?.dataset.cspId) {
      activeId = Number(activeSlide.dataset.cspId) || 0;
    }

    let buttonsDisabled = false;
    let autoplayInterval = null;
    let autoplayRestartTimeout = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchInProgress = false;

    const applyGradientClass = (nextId, prevId) => {
      gradient.classList.remove(`large-csp-hero__gradient--${prevId + 1}`);
      gradient.classList.add(`large-csp-hero__gradient--${nextId + 1}`);
    };

    const moveElements = ({ isRotatingToLeft }) => {
      const currentActiveSlide = carousel.querySelector(`.${ACTIVE_SLIDE_CLASS}`);
      if (!currentActiveSlide) return;

      const newActiveSlide = isRotatingToLeft
        ? currentActiveSlide.nextElementSibling
        : currentActiveSlide.previousElementSibling;

      if (!newActiveSlide) return;

      currentActiveSlide.classList.remove(ACTIVE_SLIDE_CLASS);
      newActiveSlide.classList.add(ACTIVE_SLIDE_CLASS);

      const slideToMoveClone = isRotatingToLeft
        ? dummyHead.nextElementSibling?.cloneNode(true)
        : dummyTail.previousElementSibling?.cloneNode(true);
      const dummySlide = isRotatingToLeft ? dummyTail : dummyHead;
      const animationClass = isRotatingToLeft ? ANIMATE_BACKWARD_CLASS : ANIMATE_FORWARD_CLASS;

      if (!slideToMoveClone) return;

      carousel.removeChild(dummySlide);
      carousel.insertBefore(slideToMoveClone, isRotatingToLeft ? carousel.lastChild : carousel.firstChild);
      carousel.classList.add(animationClass);

      window.setTimeout(() => {
        carousel.insertBefore(dummySlide, isRotatingToLeft ? carousel.lastChild : carousel.firstChild);
        const staleNode = isRotatingToLeft ? dummyHead.nextElementSibling : dummyTail.previousElementSibling;
        if (staleNode) carousel.removeChild(staleNode);
        carousel.classList.remove(animationClass);
        buttonsDisabled = false;
      }, MOVE_SLIDE_ELEMENT_DELAY_MS);
    };

    const handleUpdateActiveCsp = (id) => {
      if (buttonsDisabled) return;

      const nextElementId = (activeId + 1) % cspElementCount;
      const previousElementId = (activeId + (cspElementCount - 1)) % cspElementCount;

      if (id === nextElementId) {
        buttonsDisabled = true;
        moveElements({ isRotatingToLeft: true });
      } else if (id === previousElementId) {
        buttonsDisabled = true;
        moveElements({ isRotatingToLeft: false });
      } else {
        return;
      }

      const previousId = activeId;
      activeId = id;
      applyGradientClass(activeId, previousId);
    };

    const stopAutoplay = () => {
      if (autoplayInterval) {
        window.clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
      if (autoplayRestartTimeout) {
        window.clearTimeout(autoplayRestartTimeout);
        autoplayRestartTimeout = null;
      }
    };

    const startAutoplay = () => {
      stopAutoplay();
      autoplayInterval = window.setInterval(() => {
        handleUpdateActiveCsp((activeId + 1) % cspElementCount);
      }, AUTOPLAY_DELAY_MS);
    };

    const restartAutoplay = () => {
      stopAutoplay();
      autoplayRestartTimeout = window.setTimeout(() => {
        startAutoplay();
      }, AUTOPLAY_RESTART_DELAY_MS);
    };

    carousel.addEventListener('click', (event) => {
      if (touchInProgress) return;
      const slide = event.target.closest('[data-csp-id]');
      if (!slide) return;
      const id = Number(slide.dataset.cspId);
      if (!Number.isFinite(id) || id === activeId || buttonsDisabled) return;
      restartAutoplay();
      handleUpdateActiveCsp(id);
    });

    const handleSwipe = (deltaX, deltaY) => {
      if (Math.abs(deltaY) > SWIPE_VERTICAL_GUARD_PX) return;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
      if (buttonsDisabled) return;

      const nextId = deltaX < 0
        ? (activeId + 1) % cspElementCount
        : (activeId + (cspElementCount - 1)) % cspElementCount;

      restartAutoplay();
      handleUpdateActiveCsp(nextId);
    };

    carousel.addEventListener('touchstart', (event) => {
      if (!event.touches.length) return;
      touchInProgress = true;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }, { passive: true });

    carousel.addEventListener('touchend', (event) => {
      if (!touchInProgress || !event.changedTouches.length) return;
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;
      handleSwipe(deltaX, deltaY);

      window.setTimeout(() => {
        touchInProgress = false;
      }, 0);
    }, { passive: true });

    carousel.addEventListener('touchcancel', () => {
      touchInProgress = false;
    }, { passive: true });

    startAutoplay();
  })();
})();
