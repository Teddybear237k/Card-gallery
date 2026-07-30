//Getting all the constant needed
document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.card'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let currentIndex = 0;
  let lastFocused = null;

  function openLightbox(index) {
    currentIndex = index;
    lastFocused = document.activeElement;
    const img = cards[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    if (lastFocused) lastFocused.focus();
  }

  function showImage(index) {
    currentIndex = (index + cards.length) % cards.length;
    const img = cards[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
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
    if (lightbox.hidden) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentIndex + 1);
    }
  });

  // Clicking the dark backdrop (but not the image itself) closes it
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
});