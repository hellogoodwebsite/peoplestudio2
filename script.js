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
})();
