(() => {
  const mobileMenuContainer = document.querySelector('.mobile-menu-container');
  const mobileMenuContent = document.querySelector('.mobile-menu-content');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const openBtn = document.querySelector('#nav-hamburger-btn');
  const closeBtn = document.querySelector('#mobile-menu-close-btn');
  const backBtn = document.querySelector('#mobile-menu-back-btn');
  const navLinksMobile = document.querySelector('#nav-links-mobile');
  const openProductsBtn = document.querySelector('#open-products-menu-btn');
  const openResourcesBtn = document.querySelector('#open-resources-menu-btn');
  const mobileProducts = document.querySelector('#mobile-menu-products');
  const mobileResources = document.querySelector('#mobile-menu-resources');

  const productsHiddenClass = 'mobile-menu-products--hidden';
  const resourcesHiddenClass = 'mobile-menu-resources--hidden';

  const resetMobileSubmenus = () => {
    mobileProducts?.classList.add(productsHiddenClass);
    mobileResources?.classList.add(resourcesHiddenClass);
    openProductsBtn?.setAttribute('aria-expanded', 'false');
    openResourcesBtn?.setAttribute('aria-expanded', 'false');
    backBtn?.classList.add('back-text--hidden');
    navLinksMobile?.classList.remove('mobile-menu-primary--submenu-open');
  };

  const openMobileSubmenu = (type) => {
    const isProducts = type === 'products';
    const panel = isProducts ? mobileProducts : mobileResources;
    const button = isProducts ? openProductsBtn : openResourcesBtn;
    const hiddenClass = isProducts ? productsHiddenClass : resourcesHiddenClass;

    if (!panel || !button) return;

    const shouldOpen = panel.classList.contains(hiddenClass);
    resetMobileSubmenus();

    if (!shouldOpen) return;

    panel.classList.remove(hiddenClass);
    button.setAttribute('aria-expanded', 'true');
    backBtn?.classList.remove('back-text--hidden');
    navLinksMobile?.classList.add('mobile-menu-primary--submenu-open');
  };

  const showMobileMenu = () => {
    if (!mobileMenuContainer) return;
    mobileMenuContainer.classList.add('enter');
    mobileMenuContent?.classList.add('enter');
    document.body.classList.add('mobile-menu-open');
    openBtn?.setAttribute('aria-expanded', 'true');
  };

  const hideMobileMenu = () => {
    if (!mobileMenuContainer) return;
    mobileMenuContainer.classList.remove('enter');
    mobileMenuContent?.classList.remove('enter');
    document.body.classList.remove('mobile-menu-open');
    openBtn?.setAttribute('aria-expanded', 'false');
    resetMobileSubmenus();
  };

  openBtn?.addEventListener('click', showMobileMenu);
  closeBtn?.addEventListener('click', hideMobileMenu);
  backBtn?.addEventListener('click', resetMobileSubmenus);
  openProductsBtn?.addEventListener('click', () => openMobileSubmenu('products'));
  openResourcesBtn?.addEventListener('click', () => openMobileSubmenu('resources'));

  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 1024px)').matches) hideMobileMenu();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideMobileMenu();
  });

  mobileMenuContainer?.addEventListener('click', (event) => {
    if (event.target === mobileMenuContainer) hideMobileMenu();
  });

  mobileMenuOverlay?.addEventListener('click', hideMobileMenu);

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

  // Promo banner interactions
  const promoBanner = document.querySelector('.promo-banner');
  const promoClose = document.querySelector('#promo-banner-close-btn');
  const promoCopy = document.querySelector('.promo-banner-copy-code');
  const promoToast = document.querySelector('.promo-banner-toast');
  const promoCode = (promoCopy?.textContent || '').trim() || 'A4F20';
  const promoStorageKey = `acuity_promo_${promoCode}`;
  const navElement = document.querySelector('.menu-container');
  const mobileNavElement = document.querySelector('.mobile-menu-header');
  const heroCarousel = document.querySelector('.hero-carousel');
  const heroSplit = document.querySelector('.hero-split');
  const heroBlock = document.getElementById('large-csp-hero-block-wrapper');

  const updatePromoOffsets = () => {
    if (!promoBanner || promoBanner.classList.contains('hidden')) return;
    const offset = promoBanner.clientHeight;

    if (navElement) navElement.style.marginTop = `${offset}px`;
    if (mobileNavElement) {
      mobileNavElement.style.marginTop = `${offset}px`;
      mobileNavElement.style.top = `${offset}px`;
    }

    if (heroCarousel && navElement) {
      heroCarousel.style.marginTop = `${navElement.clientHeight + offset}px`;
    }
    if (heroSplit && navElement) {
      heroSplit.style.marginTop = `${navElement.clientHeight}px`;
    }
    if (heroBlock) {
      heroBlock.style.marginTop = `${offset}px`;
    }
  };

  const clearPromoOffsets = () => {
    if (navElement) navElement.style.marginTop = '';
    if (mobileNavElement) {
      mobileNavElement.style.marginTop = '';
      mobileNavElement.style.removeProperty('top');
    }
    if (heroCarousel && navElement) {
      heroCarousel.style.marginTop = `${navElement.clientHeight}px`;
    }
    if (heroSplit && navElement) {
      heroSplit.style.marginTop = `${navElement.clientHeight}px`;
    }
    if (heroBlock) {
      heroBlock.style.marginTop = '';
    }
  };

  if (promoBanner && !window.localStorage.getItem(promoStorageKey)) {
    promoBanner.classList.remove('hidden');
    updatePromoOffsets();
    window.addEventListener('resize', updatePromoOffsets);
    window.addEventListener('load', updatePromoOffsets);
  }

  promoClose?.addEventListener('click', () => {
    if (!promoBanner) return;
    window.localStorage.setItem(promoStorageKey, 'true');
    promoBanner.classList.add('hidden');
    clearPromoOffsets();
    window.removeEventListener('resize', updatePromoOffsets);
    window.removeEventListener('load', updatePromoOffsets);
  });

  promoCopy?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(promoCode);
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

  // Adapt-business carousel drag/swipe interactions
  (() => {
    const carousel = document.querySelector('.adapt-business__carousel');
    if (!carousel) return;

    const carouselScrollingClass = 'adapt-business__carousel--scrolling';
    let isDragging = false;
    let startX = 0;

    const clampCarouselLeft = (left) => {
      const rightBoundary = window.innerWidth - carousel.offsetWidth - 10;
      if (left > 0 || window.innerWidth > carousel.offsetWidth) return 0;
      if (left < rightBoundary) return rightBoundary;
      return left;
    };

    const stopAutoScrollBeforeDrag = () => {
      if (!carousel.classList.contains(carouselScrollingClass)) return;
      const box = carousel.getBoundingClientRect();
      carousel.classList.remove(carouselScrollingClass);
      carousel.style.left = `${box.left}px`;
    };

    const dragToClientX = (clientX) => {
      const beginX = startX - carousel.offsetLeft;
      const nextLeft = clampCarouselLeft(clientX - beginX);
      carousel.style.left = `${nextLeft}px`;
    };

    const isTagTarget = (target) =>
      target?.classList?.contains('adapt-business-card__tags') ||
      target?.closest?.('.adapt-business-card__tags');

    carousel.addEventListener('mousedown', (event) => {
      if (isTagTarget(event.target)) return;
      stopAutoScrollBeforeDrag();
      isDragging = true;
      startX = event.clientX;
      carousel.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', (event) => {
      if (!isDragging) return;
      event.preventDefault();
      dragToClientX(event.clientX);
    });

    carousel.addEventListener('mouseleave', () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('touchstart', (event) => {
      if (!event.touches.length || isTagTarget(event.target)) return;
      stopAutoScrollBeforeDrag();
      startX = event.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchmove', (event) => {
      if (!event.touches.length) return;
      event.preventDefault();
      dragToClientX(event.touches[0].clientX);
    }, { passive: false });
  })();

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
