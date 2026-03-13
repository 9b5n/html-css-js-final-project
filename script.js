/* ================================================
   StyleRent — Shared JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile Navigation ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('open')) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Sticky Nav Shadow ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* ---------- Active Nav Link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Scroll Reveal Animation ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Gallery Filters ---------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterTabs.length > 0 && galleryItems.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.dataset.category;

        galleryItems.forEach(item => {
          if (category === 'all' || item.dataset.category === category) {
            item.style.display = '';
            item.style.animation = 'fadeInUp 0.5s ease forwards';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------- Size Selector ---------- */
  const sizeOptions = document.querySelectorAll('.size-option:not(.disabled)');
  sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
      sizeOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      // Update hidden field if present
      const sizeInput = document.getElementById('selectedSize');
      if (sizeInput) {
        sizeInput.value = option.dataset.size;
      }
    });
  });

  /* ---------- Product Thumbnail Switcher ---------- */
  const thumbs = document.querySelectorAll('.product-thumbnails img');
  const mainImage = document.querySelector('.product-image-main img');
  if (thumbs.length > 0 && mainImage) {
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImage.src = thumb.dataset.full || thumb.src;
      });
    });
  }

  /* ---------- Rental Cost Calculator ---------- */
  const durationOptions = document.querySelectorAll('.duration-option');
  const pickupDateInput = document.getElementById('pickupDate');
  const returnDateInput = document.getElementById('returnDate');

  let selectedDuration = 4; // default days
  const dailyRate = 1200; // ₹ per day
  const securityDeposit = 2000;

  function updateCostSummary() {
    const subtotal = selectedDuration * dailyRate;
    const total = subtotal + securityDeposit;

    const durationDisplay = document.getElementById('summaryDuration');
    const subtotalDisplay = document.getElementById('summarySubtotal');
    const depositDisplay = document.getElementById('summaryDeposit');
    const totalDisplay = document.getElementById('summaryTotal');

    if (durationDisplay) durationDisplay.textContent = selectedDuration + ' Days';
    if (subtotalDisplay) subtotalDisplay.textContent = '₹' + subtotal.toLocaleString('en-IN');
    if (depositDisplay) depositDisplay.textContent = '₹' + securityDeposit.toLocaleString('en-IN');
    if (totalDisplay) totalDisplay.textContent = '₹' + total.toLocaleString('en-IN');

    // Update return date automatically
    if (pickupDateInput && pickupDateInput.value && returnDateInput) {
      const pickup = new Date(pickupDateInput.value);
      pickup.setDate(pickup.getDate() + selectedDuration);
      returnDateInput.value = pickup.toISOString().split('T')[0];
    }
  }

  if (durationOptions.length > 0) {
    durationOptions.forEach(option => {
      option.addEventListener('click', () => {
        durationOptions.forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        selectedDuration = parseInt(option.dataset.days, 10);
        updateCostSummary();
      });
    });
  }

  if (pickupDateInput) {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    pickupDateInput.min = today;
    pickupDateInput.addEventListener('change', updateCostSummary);
  }

  // Initial cost calculation
  if (document.getElementById('summaryTotal')) {
    updateCostSummary();
  }

  /* ---------- Booking Form Validation ---------- */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      bookingForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      // Required field validation
      const requiredFields = bookingForm.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.closest('.form-group').classList.add('error');
        }
      });

      // Email validation
      const emailField = bookingForm.querySelector('input[type="email"]');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        valid = false;
        emailField.closest('.form-group').classList.add('error');
      }

      // Phone validation
      const phoneField = bookingForm.querySelector('input[type="tel"]');
      if (phoneField && phoneField.value && !/^[0-9]{10}$/.test(phoneField.value.replace(/\s/g, ''))) {
        valid = false;
        phoneField.closest('.form-group').classList.add('error');
      }

      if (valid) {
        showToast('Booking confirmed! We\'ll send you a confirmation email shortly.', 'success');
        bookingForm.reset();
      } else {
        showToast('Please fill in all required fields correctly.', 'error');
      }
    });
  }

  /* ---------- Contact Form Validation ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      const requiredFields = contactForm.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.closest('.form-group').classList.add('error');
        }
      });

      const emailField = contactForm.querySelector('input[type="email"]');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        valid = false;
        emailField.closest('.form-group').classList.add('error');
      }

      if (valid) {
        showToast('Thank you! Our styling team will reach out within 24 hours.', 'success');
        contactForm.reset();
      } else {
        showToast('Please fill in all required fields correctly.', 'error');
      }
    });
  }

  /* ---------- Toast Notification ---------- */
  window.showToast = function(message, type = '') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'toast' + (type ? ' ' + type : '');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  };

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});

/* ---------- CSS Animation Keyframe (injected) ---------- */
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(fadeStyle);
