/* ==========================================================================
   app.js — Interactivity for Commercial Loan Help
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* =======================================================================
     Mobile Nav Toggle
     ======================================================================= */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* =======================================================================
     Sticky Nav Shadow on Scroll
     ======================================================================= */
  const nav = document.querySelector('.site-nav');

  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  /* =======================================================================
     FAQ Accordion Toggle
     Content always stays in DOM — we toggle a CSS class for show/hide
     ======================================================================= */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all other FAQ items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const otherBtn = other.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        item.classList.toggle('open', !isOpen);
        question.setAttribute('aria-expanded', !isOpen);
      });
    }
  });

  /* =======================================================================
     Smooth Scroll to Sections
     ======================================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* =======================================================================
     Active Nav Link Highlighting
     ======================================================================= */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop();

    if (
      (currentPage === 'index.html' && (linkPage === 'index.html' || href === '/')) ||
      (linkPage === currentPage)
    ) {
      // Don't highlight nav items for homepage — no matching nav link
      if (currentPage !== 'index.html') {
        link.classList.add('active');
      }
    }
  });

  /* =======================================================================
     Scroll-Reveal Animations (Intersection Observer)
     JS-controlled: content visible by default (for crawlers/SEO);
     .js-reveal-init on <html> enables the opacity:0 → revealed transition.
     ======================================================================= */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    // Enable reveal animations now that JS is running
    document.documentElement.classList.add('js-reveal-init');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target); // Only animate once
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything immediately (no animation)
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* =======================================================================
     Lead Form Validation & Submission (Mock)
     ======================================================================= */
  const leadForms = document.querySelectorAll('.lead-form');

  leadForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

      // Validate required fields
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        }
      });

      // Validate email if present
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          emailField.classList.add('error');
          isValid = false;
        }
      }

      // Validate phone if present
      const phoneField = form.querySelector('input[type="tel"]');
      if (phoneField && phoneField.value) {
        const phoneClean = phoneField.value.replace(/\D/g, '');
        if (phoneClean.length < 10) {
          phoneField.classList.add('error');
          isValid = false;
        }
      }

      if (isValid) {
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log('Lead form submission:', data);

        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
          background: #16A34A;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          text-align: center;
          font-weight: 600;
          margin-top: 1rem;
        `;
        successMsg.textContent = 'Thank you! We\'ll be in touch within 24 hours.';
        form.appendChild(successMsg);
        form.reset();

        // Remove success message after 5 seconds
        setTimeout(() => successMsg.remove(), 5000);
      }
    });
  });

  /* =======================================================================
     Learn Hub: Category Filtering
     ======================================================================= */
  const filterTabs = document.querySelectorAll('.learn-filter-tab');
  const articleCards = document.querySelectorAll('.learn-grid .article-card');

  if (filterTabs.length > 0 && articleCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        filterTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const filter = tab.getAttribute('data-filter');

        // Show/hide cards
        articleCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* =======================================================================
     Learn Hub: Download Form Submissions (Mock)
     ======================================================================= */
  const downloadForms = document.querySelectorAll('.download-form');

  downloadForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailInput && emailRegex.test(emailInput.value)) {
        const resource = form.getAttribute('data-resource');
        console.log('Download request:', { resource, email: emailInput.value });

        // Hide form, show success
        form.hidden = true;
        const successMsg = form.nextElementSibling;
        if (successMsg && successMsg.classList.contains('download-success')) {
          successMsg.hidden = false;
        }
      }
    });
  });

  /* =======================================================================
     Initialize Lucide Icons
     ======================================================================= */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

});
