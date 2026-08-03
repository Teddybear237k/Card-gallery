document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.card'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const radios = Array.from(document.querySelectorAll('.filter-wrapper input[type="radio"]'));

  let currentIndex = 0;
  let lastFocused = null;

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canUseViewTransitions = () =>
    typeof document.startViewTransition === 'function' && !prefersReducedMotion();

  // Runs `fn` inside a View Transition when supported, otherwise runs it immediately. The CSS crossfade (@starting-style + allow-discrete) is the floor either way; this layers the morph/reflow on top where the browser can do it.
  function withViewTransition(fn) {
    if (canUseViewTransitions()) {
      return document.startViewTransition(fn);
    }
    fn();
    return null;
  }

  function setImage(index) {
    const img = cards[index].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    return img;
  }

  function openLightbox(index) {
    currentIndex = index;
    lastFocused = document.activeElement;
    const cardImg = cards[currentIndex].querySelector('img');

    // Shared view-transition-name morphs the clicked thumbnail into the
    // expanded image on browsers that support it; cleared afterwards so
    // it doesn't linger on every future transition.
    if (canUseViewTransitions()) {
      cardImg.style.viewTransitionName = 'lightbox-hero';
      lightboxImg.style.viewTransitionName = 'lightbox-hero';
    }

    const transition = withViewTransition(() => {
      setImage(currentIndex);
      lightbox.showModal();
    });

    const cleanup = () => {
      cardImg.style.viewTransitionName = '';
      lightboxImg.style.viewTransitionName = '';
    };
    if (transition) {
      transition.finished.finally(cleanup);
    }

    closeBtn.focus();
  }

  function closeLightbox() {
    withViewTransition(() => {
      lightbox.close();
    });
  }

  function showImage(index) {
    currentIndex = (index + cards.length) % cards.length;
    setImage(currentIndex);
  }

  cards.forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(index));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.open) return;

    if (e.key === 'ArrowLeft') {
      showImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentIndex + 1);
    }
  });

  // Escape triggers the dialog's native 'cancel' event before it closes. Intercept it so Escape gets the same transition-wrapped close as the close button, then restore focus once it's actually closed.
  lightbox.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeLightbox();
  });

  lightbox.addEventListener('close', () => {
    if (lastFocused) lastFocused.focus();
  });

  // Clicking the backdrop (dialog element itself, outside its children) closes it, same as before.
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Filter pills: intercept the click, prevent the native check, and apply it inside a View Transition so the grid reflows smoothly when supported. Falls back to the instant native check (with the CSS fade-out floor) everywhere else.
  radios.forEach((radio) => {
    radio.addEventListener('click', (e) => {
      if (radio.checked || !canUseViewTransitions()) return;
      e.preventDefault();
      document.startViewTransition(() => {
        radio.checked = true;
      });
    });
  });
});