document.addEventListener('DOMContentLoaded', () => {

    // --- Header & Navigation --- //
    const mainHeader = document.getElementById('main-header');
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile navigation
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isNavOpen = mainNav.classList.toggle('active');
            navToggle.querySelector('i').className = isNavOpen ? 'fas fa-times' : 'fas fa-bars';
        });
    }

    // Close mobile nav when a link is clicked
    mainNav.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            mainNav.classList.remove('active');
            navToggle.querySelector('i').className = 'fas fa-bars';
        }
    });

    // Add scrolled class to header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    }, { passive: true });

    // Active nav link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href*=\'#${id}\']`);
            const mobileNavLink = document.querySelector(`.mobile-nav-link[href*=\'#${id}\']`);

            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                mobileNavLinks.forEach(link => link.classList.remove('active'));

                if (navLink) navLink.classList.add('active');
                if (mobileNavLink) mobileNavLink.classList.add('active');
            } else {
                if (navLink) navLink.classList.remove('active');
                if (mobileNavLink) mobileNavLink.classList.remove('active');
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // --- Gallery Lightbox --- //
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentIndex = 0;

    function showLightbox(index) {
        const item = galleryItems[index];
        const imageSrc = item.getAttribute('data-image');
        lightboxImage.setAttribute('src', imageSrc);
        lightbox.classList.add('active');
        currentIndex = index;
    }

    function hideLightbox() {
        lightbox.classList.remove('active');
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        showLightbox(currentIndex);
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        showLightbox(currentIndex);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => showLightbox(index));
    });

    if (lightbox) {
        lightboxClose.addEventListener('click', hideLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                hideLightbox();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') hideLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

    // --- Scroll Animations using Intersection Observer --- //
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve the element after it has been animated
                // observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    scrollElements.forEach(el => {
        observer.observe(el);
    });

    // --- Achievement Counter Animation --- //
    const achievementNumbers = document.querySelectorAll('.achievement-number');

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = +el.getAttribute('data-target');
                el.innerText = '0';

                const updateCount = () => {
                    const current = +el.innerText;
                    const increment = target / 200; // Animation speed

                    if (current < target) {
                        el.innerText = `${Math.ceil(current + increment)}`;
                        requestAnimationFrame(updateCount);
                    } else {
                        el.innerText = target;
                    }
                };

                updateCount();
                observer.unobserve(el); // Animate only once
            }
        });
    }, {
        threshold: 0.5 // Start when 50% of the element is visible
    });

    achievementNumbers.forEach(num => {
        counterObserver.observe(num);
    });

    // Add a class to the body if JS is enabled, for fallback styles
    document.body.classList.add('js-enabled');

});