// CONFIGURATION: Replace with your actual 12-digit WhatsApp business number (with country code, e.g. "919999999999" for India)
const WHATSAPP_NUMBER = "910000000000"; 

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initScrollAnimations();
  initEnquiryModal();
  initGalleryLightbox();
  initFormValidation();
});

/* ==========================================
   MOBILE MENU DRAWER WITH OVERLAY BACKDROP
   ========================================== */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!menuToggle || !navMenu) return;

  // Create backdrop overlay dynamically
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  const toggleMenu = (forceClose = false) => {
    const isOpen = forceClose ? false : !navMenu.classList.contains('open');
    
    menuToggle.classList.toggle('open', isOpen);
    navMenu.classList.toggle('open', isOpen);
    overlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', () => toggleMenu());
  overlay.addEventListener('click', () => toggleMenu(true));

  // Close menu if a nav link is clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });
}

/* ==========================================
   STICKY HEADER SHRINK ON SCROLL
   ========================================== */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Initial run in case page loads scrolled down
  handleScroll();
}

/* ==========================================
   SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-up');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once animated, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    animatedElements.forEach(el => el.classList.add('visible'));
  }
}

/* ==========================================
   ENQUIRY POPUP MODAL
   ========================================== */
function initEnquiryModal() {
  const modal = document.querySelector('#enquiryModal');
  const closeBtn = document.querySelector('.modal-close');
  const enquireTriggers = document.querySelectorAll('[data-enquire-now]');
  const interestSelect = document.querySelector('#enquiryInterest');

  if (!modal) return;

  const openModal = (category) => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // If a specific category was passed, pre-select it in the dropdown
    if (category && interestSelect) {
      const optionToSelect = Array.from(interestSelect.options).find(opt => opt.value.toLowerCase() === category.toLowerCase());
      if (optionToSelect) {
        interestSelect.value = optionToSelect.value;
      }
    }
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Wire up all click triggers
  enquireTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const category = trigger.getAttribute('data-enquire-category') || '';
      openModal(category);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close modal when clicking on the overlay background
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================
   GALLERY LIGHTBOX
   ========================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (galleryItems.length === 0) return;

  // Create Lightbox Markup and inject into body
  const lightbox = document.createElement('div');
  lightbox.id = 'galleryLightbox';
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <img src="" alt="" class="lightbox-img">
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  const openLightbox = (imgSrc, imgAlt, captionText) => {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt;
    lightboxCaption.textContent = captionText;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Clear sources on close to save memory/avoid quick flash of old image next time
    setTimeout(() => {
      lightboxImg.src = '';
      lightboxCaption.textContent = '';
    }, 300);
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h4') ? item.querySelector('h4').textContent : '';
      const category = item.querySelector('span') ? item.querySelector('span').textContent : '';
      
      if (img) {
        const caption = title ? `${title} (${category})` : category;
        openLightbox(img.src, img.alt || 'Gallery image', caption);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* ==========================================
   FORM VALIDATION & WHATSAPP INTEGRATION
   ========================================== */
function initFormValidation() {
  const forms = document.querySelectorAll('.validate-form');

  forms.forEach(form => {
    const successAlert = form.querySelector('.alert-success');
    const errorAlert = form.querySelector('.alert-error');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (successAlert) successAlert.style.display = 'none';
      if (errorAlert) errorAlert.style.display = 'none';
      
      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const interest = form.querySelector('[name="interest"]').value;
      const message = form.querySelector('[name="message"]').value.trim();
      
      // Simple client-side checks
      if (!name || !phone || !message) {
        showFeedback(errorAlert, 'Please fill in all required fields (Name, Mobile, and Message).');
        return;
      }
      
      // Phone format validation (basic 10-digit Indian mobile check)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
        showFeedback(errorAlert, 'Please enter a valid 10-digit mobile number.');
        return;
      }

      // Optional email format check
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          showFeedback(errorAlert, 'Please enter a valid email address.');
          return;
        }
      }

      // Prevent duplicate submissions and show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Enquiry';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Preparing message...';
      }

      // Construct the formatted WhatsApp message
      const whatsappMessage = `New Website Enquiry

Name: ${name}
Mobile: ${phone}
Email: ${email || 'Not Provided'}
Interested In: ${interest}

Message:
${message}

Source: VIRBAC VETCARE PVT LTD Website`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      // Simulate a small loading transition for premium UX
      setTimeout(() => {
        // Show success / redirection feedback
        showFeedback(successAlert, 'Redirecting to WhatsApp to send your enquiry...');
        
        // Open WhatsApp Web or App in a new tab
        window.open(whatsappUrl, '_blank');

        // Re-enable the button after redirect, preserving form inputs
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        }, 1500);
      }, 1000);
    });
  });

  function showFeedback(alertElement, message) {
    if (!alertElement) return;
    alertElement.textContent = message;
    alertElement.style.display = 'block';
    
    // Smooth scroll to the alert so the user sees it
    alertElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
