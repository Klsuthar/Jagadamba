document.addEventListener('DOMContentLoaded', () => {

    // --- Header & Navigation --- //
    const mainHeader = document.getElementById('main-header');
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile navigation
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            navToggle.querySelector('i').classList.toggle('fa-bars');
            navToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Close mobile nav when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                navToggle.querySelector('i').classList.add('fa-bars');
                navToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    });

    // Add scrolled class to header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // Active nav link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            let sectionId = current.getAttribute('id');

            let desktopLink = document.querySelector('.nav-link[href*=' + sectionId + ']');
            let mobileLink = document.querySelector('.mobile-nav-link[href*=' + sectionId + ']');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                if(desktopLink) desktopLink.classList.add('active');
                if(mobileLink) mobileLink.classList.add('active');
            } else {
                if(desktopLink) desktopLink.classList.remove('active');
                if(mobileLink) mobileLink.classList.remove('active');
            }
        });
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

    // Add a class to the body if JS is enabled, for fallback styles
    document.body.classList.add('js-enabled');

});