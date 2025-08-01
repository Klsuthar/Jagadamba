// DOM Elements
const mobileNavItems = document.querySelectorAll('.mobile-nav .nav-item');
const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
const desktopHeader = document.getElementById('desktop-header');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

// State
let currentGalleryIndex = 0;
let galleryImages = [];
let isScrolling = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    initializeScrollAnimations();
    initializeNavigation();
    initializeScrollListener();
});

// Gallery Initialization
function initializeGallery() {
    galleryImages = Array.from(galleryItems).map(item => item.dataset.image);
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentGalleryIndex = index;
            openLightbox();
        });
    });
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateGallery(-1));
    lightboxNext.addEventListener('click', () => navigateGallery(1));
    
    // Close lightbox on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateGallery(-1);
        if (e.key === 'ArrowRight') navigateGallery(1);
    });
    
    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

function openLightbox() {
    lightboxImage.src = galleryImages[currentGalleryIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateGallery(direction) {
    currentGalleryIndex += direction;
    
    if (currentGalleryIndex < 0) {
        currentGalleryIndex = galleryImages.length - 1;
    } else if (currentGalleryIndex >= galleryImages.length) {
        currentGalleryIndex = 0;
    }
    
    lightboxImage.src = galleryImages[currentGalleryIndex];
}

// Scroll Animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Navigation
function initializeNavigation() {
    // Mobile Navigation
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            if (section) {
                scrollToSection(section);
                updateMobileNavActive(item);
            }
        });
    });
    
    // Desktop Navigation
    desktopNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('href').substring(1);
            scrollToSection(section);
            updateDesktopNavActive(link);
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = sectionId === 'home' ? 0 : section.offsetTop - 80;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function updateMobileNavActive(activeItem) {
    mobileNavItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
}

function updateDesktopNavActive(activeLink) {
    desktopNavLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Scroll Listener with Throttling
function initializeScrollListener() {
    let ticking = false;
    
    function updateOnScroll() {
        const scrollY = window.scrollY;
        
        // Update desktop header
        if (window.innerWidth >= 768) {
            if (scrollY > 50) {
                desktopHeader.classList.add('scrolled');
            } else {
                desktopHeader.classList.remove('scrolled');
            }
        }
        
        // Update active navigation based on scroll position
        updateActiveNavOnScroll();
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

function updateActiveNavOnScroll() {
    const sections = ['home', 'about', 'gallery', 'contact'];
    const scrollPosition = window.scrollY + 100;
    
    let activeSection = 'home';
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section && scrollPosition >= section.offsetTop) {
            activeSection = sectionId;
        }
    });
    
    // Update mobile navigation
    mobileNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === activeSection) {
            item.classList.add('active');
        }
    });
    
    // Update desktop navigation
    desktopNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSection}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
    document.head.appendChild(script);
}

// Optimize images loading
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // Add lazy loading for better performance
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        }
    });
}

// Initialize image optimization
optimizeImages();

// Add touch support for lightbox navigation
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - next image
            navigateGallery(1);
        } else {
            // Swiped right - previous image
            navigateGallery(-1);
        }
    }
}

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Handle tab navigation in lightbox
    if (lightbox.classList.contains('active')) {
        const focusableElements = lightbox.querySelectorAll('button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }
});

// Performance monitoring
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
            }, 0);
        });
    }
}

logPerformance();
