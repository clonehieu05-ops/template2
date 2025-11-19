document.addEventListener('DOMContentLoaded', () => {
  // Slider functionality (redesigned photo slider)
  // For the redesigned slider, we use thumbnail backgrounds to cycle the main image.
  const redesignedSlider = document.querySelector('.photo-slider.redesigned');
  if (redesignedSlider) {
    const mainImgEl = redesignedSlider.querySelector('.slider-main-img');
    const thumbEls = redesignedSlider.querySelectorAll('.thumbnail-row .slider-thumb');
    const prevBtn = redesignedSlider.querySelector('.slider-nav.prev');
    const nextBtn = redesignedSlider.querySelector('.slider-nav.next');
    const fullscreenBtn = redesignedSlider.querySelector('.fullscreen-btn');
    let currentIndex = 0;

    // Function to update the main image and selected thumbnail
    function updateMain(index) {
      if (!thumbEls.length) return;
      currentIndex = index;
      thumbEls.forEach((thumb, i) => {
        const thumbWrapper = thumb.parentElement;
        if (thumbWrapper) {
          thumbWrapper.classList.toggle('selected', i === currentIndex);
        }
      });
      const bg = thumbEls[currentIndex].style.backgroundImage;
      if (mainImgEl) {
        mainImgEl.style.backgroundImage = bg;
      }
    }

    // Initialize index based on which thumbnail is marked selected
    let initIndex = 0;
    thumbEls.forEach((thumb, i) => {
      if (thumb.parentElement.classList.contains('selected')) {
        initIndex = i;
      }
    });
    updateMain(initIndex);

    // Add click listeners for thumbnails
    thumbEls.forEach((thumb, i) => {
      thumb.addEventListener('click', () => {
        updateMain(i);
      });
    });

    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (!thumbEls.length) return;
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = thumbEls.length - 1;
        updateMain(newIndex);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!thumbEls.length) return;
        const newIndex = (currentIndex + 1) % thumbEls.length;
        updateMain(newIndex);
      });
    }

    // Fullscreen button opens the current image in a new tab
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (!mainImgEl) return;
        const bg = mainImgEl.style.backgroundImage;
        // Extract URL from background-image: url("...") or url('...')
        let url = '';
        if (bg && bg.startsWith('url')) {
          url = bg.slice(bg.indexOf('(') + 1, bg.lastIndexOf(')')).replace(/['"]/g, '');
        }
        if (url) {
          window.open(url, '_blank');
        }
      });
    }
  } else {
    // Fallback for original slider design that used .slide elements
    const slides = document.querySelectorAll('.photo-slider .slide');
    const nextBtn = document.querySelector('.photo-slider .next');
    const prevBtn = document.querySelector('.photo-slider .prev');
    let currentIndex = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${(i - index) * 100}%)`;
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
      });
    }
    if (slides.length) {
      showSlide(currentIndex);
    }
  }

  // Countdown timer
  const targetDate = new Date('2025-12-14T09:00:00');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }
  // Only start countdown if elements exist
  if (daysEl && hoursEl && minutesEl && secondsEl) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Scroll reveal via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => {
    observer.observe(el);
  });

  // Audio control toggle
  const audioBtn = document.querySelector('.audio-control');
  const audioEl = document.getElementById('background-audio');
  // Attempt to autoplay the background music on page load. This may fail if the browser blocks autoplay.
  if (audioEl) {
    audioEl.play().then(() => {
      // Update the control button to indicate playing state on successful autoplay
      if (audioBtn) {
        audioBtn.textContent = '❚❚';
      }
    }).catch(() => {
      // Autoplay blocked; keep the icon as the note until user clicks
    });
  }
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (!audioEl) return;
      if (audioEl.paused) {
        audioEl.play();
        audioBtn.textContent = '❚❚';
      } else {
        audioEl.pause();
        audioBtn.textContent = '♪';
      }
    });
  }

  // Heart burst on button click
  const heartBtn = document.querySelector('.heart-button');
  const heartContainer = document.querySelector('.heart-container');
  if (heartBtn && heartContainer) {
    heartBtn.addEventListener('click', () => {
      for (let i = 0; i < 6; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart burst';
        const size = 12 + Math.random() * 8;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        // Start from bottom of container
        heart.style.top = '100%';
        // Random horizontal position
        heart.style.left = Math.random() * 90 + '%';
        heartContainer.appendChild(heart);
        // Remove after animation
        setTimeout(() => {
          heart.remove();
        }, 12000);
      }
    });
  }
  // RSVP form submission
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // In a real application, you'd send this data to a server
      alert('Cảm ơn bạn đã xác nhận tham dự!');
      rsvpForm.reset();
    });
  }

  // Gift modal logic
  // Clicking on the gift icon opens the modal. The separate three-line button has been removed.
  const giftIcon = document.querySelector('.gift-icon');
  const giftModal = document.getElementById('gift-modal');
  if (giftIcon && giftModal) {
    giftIcon.addEventListener('click', () => {
      giftModal.classList.add('open');
    });
    const closeBtn = giftModal.querySelector('.close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        giftModal.classList.remove('open');
      });
    }
    // Click outside modal content closes it
    giftModal.addEventListener('click', (e) => {
      if (e.target === giftModal) {
        giftModal.classList.remove('open');
      }
    });
  }
  // Copy bank account numbers to clipboard
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const account = btn.getAttribute('data-account');
      if (account) {
        navigator.clipboard.writeText(account).then(() => {
          alert('Đã sao chép số tài khoản: ' + account);
        }).catch(() => {
          alert('Không thể sao chép. Vui lòng thử lại.');
        });
      }
    });
  });
});