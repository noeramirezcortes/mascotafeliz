/**
 * VETERINARY CLINIC - MASCOTA FELIZ
 * Premium Interactive JavaScript - Impeccable Implementation
 * 
 * Features:
 * - Mobile Navigation with Smooth Transitions
 * - Scroll Animations with Intersection Observer
 * - Testimonials Slider with Touch Support
 * - Form Validation with Real-time Feedback
 * - Modal System with Accessibility
 * - Smooth Scrolling
 * - Gallery Lightbox
 * - Toast Notifications
 */

// ========================================
// DOM Content Loaded - Initialize All Components
// ========================================

const DOM = {
    header: document.getElementById('header'),
    nav: document.getElementById('nav'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    testimonialsSlider: document.getElementById('testimonialsSlider'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    appointmentModal: document.getElementById('appointmentModal'),
    closeModal: document.getElementById('closeModal'),
    openAppointmentModal: document.getElementById('openAppointmentModal'),
    contactForm: document.getElementById('contactForm'),
    appointmentForm: document.getElementById('appointmentForm')
};

// ========================================
// Utility Functions
// ========================================

/**
 * Debounce function to limit execution rate
 */
const debounce = (func, wait = 100) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

/**
 * Throttle function for scroll events
 */
const throttle = (func, limit = 100) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Check if element is in viewport
 */
const isInViewport = (element, threshold = 0.1) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return (
        rect.top <= windowHeight * (1 - threshold) &&
        rect.bottom >= windowHeight * threshold
    );
};

/**
 * Smooth scroll to element with offset
 */
const smoothScrollTo = (target, offset = 0) => {
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
};

// ========================================
// Mobile Navigation
// ========================================

class MobileNavigation {
    constructor() {
        this.mobileMenuBtn = DOM.mobileMenuBtn;
        this.nav = DOM.nav;
        this.header = DOM.header;
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.mobileMenuBtn || !this.nav) return;
        
        this.mobileMenuBtn.addEventListener('click', this.toggle.bind(this));
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.close.bind(this));
        });
        
        document.addEventListener('click', this.handleClickOutside.bind(this));
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        this.updateState();
    }
    
    open() {
        this.isOpen = true;
        this.updateState();
    }
    
    close() {
        this.isOpen = false;
        this.updateState();
    }
    
    updateState() {
        this.mobileMenuBtn.classList.toggle('active', this.isOpen);
        this.nav.classList.toggle('active', this.isOpen);
        this.header.classList.toggle('menu-open', this.isOpen);
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
        
        // Set ARIA attributes for accessibility
        this.mobileMenuBtn.setAttribute('aria-expanded', this.isOpen);
        this.nav.setAttribute('aria-hidden', !this.isOpen);
    }
    
    handleClickOutside(event) {
        if (this.isOpen && 
            !this.mobileMenuBtn.contains(event.target) && 
            !this.nav.contains(event.target)) {
            this.close();
        }
    }
}

// ========================================
// Header Scroll Effect
// ========================================

class HeaderScroll {
    constructor() {
        this.header = DOM.header;
        this.scrollThreshold = 50;
        
        this.init();
    }
    
    init() {
        if (!this.header) return;
        
        const handleScroll = throttle(() => {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrolled > this.scrollThreshold) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }, 16);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial check
        handleScroll();
    }
}

// ========================================
// Scroll Animations
// ========================================

class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll(
            '.service-card, .about-feature, .testimonial-card, .gallery-item, .stat, .contact-detail, .hero-badge, .hero-title, .hero-description, .hero-buttons, .hero-stats, .hero-image, .section-subtitle, .section-title, .section-description, .about-image, .about-text, .about-features, .contact-info-wrapper, .contact-form-wrapper, .map-container'
        );
        
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.createObserver();
        } else {
            // Fallback for older browsers
            this.fallbackAnimation();
            window.addEventListener('scroll', debounce(this.fallbackAnimation.bind(this), 50));
        }
    }
    
    createObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = element.getAttribute('data-delay') || '0s';
                    
                    element.classList.add('animate-on-scroll', 'animated');
                    element.style.transitionDelay = delay;
                    
                    // Remove observer after animation
                    observer.unobserve(element);
                }
            });
        }, observerOptions);
        
        this.animatedElements.forEach((element, index) => {
            element.classList.add('animate-on-scroll');
            element.setAttribute('data-delay', `${index * 0.1}s`);
            observer.observe(element);
        });
        
        // Trigger hero animations immediately
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero .animate-on-scroll');
            heroElements.forEach(el => el.classList.add('animated'));
        }, 100);
    }
    
    fallbackAnimation() {
        this.animatedElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('animated')) {
                const delay = element.getAttribute('data-delay') || '0s';
                element.classList.add('animate-on-scroll', 'animated');
                element.style.transitionDelay = delay;
            }
        });
    }
}

// ========================================
// Smooth Scroll
// ========================================

class SmoothScroll {
    constructor() {
        this.headerOffset = 88;
        this.init();
    }
    
    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', this.handleClick.bind(this));
        });
    }
    
    handleClick(event) {
        const href = event.currentTarget.getAttribute('href');
        
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
            event.preventDefault();
            
            smoothScrollTo(target, this.headerOffset);
            
            // Close mobile menu if open
            const mobileNav = document.querySelector('.mobile-menu-btn');
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.click();
            }
            
            // Focus on target for accessibility
            setTimeout(() => {
                target.focus({ behavior: 'smooth' });
            }, 500);
        }
    }
}

// ========================================
// Testimonials Slider
// ========================================

class TestimonialsSlider {
    constructor() {
        this.slider = DOM.testimonialsSlider;
        this.prevBtn = DOM.prevBtn;
        this.nextBtn = DOM.nextBtn;
        this.cards = [];
        this.currentIndex = 0;
        this.cardWidth = 380;
        this.gap = 24;
        this.visibleCards = 1;
        this.autoSlideInterval = null;
        this.autoSlideDelay = 5000;
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;
        
        this.init();
    }
    
    init() {
        if (!this.slider || !this.prevBtn || !this.nextBtn) return;
        
        this.updateCards();
        this.setupEventListeners();
        this.startAutoSlide();
        this.setupTouchEvents();
    }
    
    updateCards() {
        this.cards = Array.from(this.slider.querySelectorAll('.testimonial-card'));
        this.cardWidth = this.cards[0]?.offsetWidth || 380;
        this.visibleCards = Math.floor(this.slider.offsetWidth / (this.cardWidth + this.gap));
        this.updateSlider();
    }
    
    setupEventListeners() {
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        
        // Pause auto-slide on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        
        // Update on resize
        window.addEventListener('resize', debounce(this.updateCards.bind(this), 200));
    }
    
    setupTouchEvents() {
        const touchStart = (e) => {
            this.isDragging = true;
            this.startX = e.pageX || e.touches[0].pageX;
            this.scrollLeft = this.slider.scrollLeft;
            this.stopAutoSlide();
        };
        
        const touchMove = (e) => {
            if (!this.isDragging) return;
            const x = e.pageX || e.touches[0].pageX;
            const walk = (x - this.startX) * 2;
            this.slider.scrollLeft = this.scrollLeft - walk;
        };
        
        const touchEnd = () => {
            this.isDragging = false;
            this.startAutoSlide();
        };
        
        this.slider.addEventListener('mousedown', touchStart);
        this.slider.addEventListener('touchstart', touchStart, { passive: false });
        
        window.addEventListener('mousemove', touchMove, { passive: false });
        window.addEventListener('touchmove', touchMove, { passive: false });
        
        window.addEventListener('mouseup', touchEnd);
        window.addEventListener('touchend', touchEnd);
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlider();
            this.resetAutoSlide();
        }
    }
    
    next() {
        const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateSlider();
            this.resetAutoSlide();
        }
    }
    
    updateSlider() {
        const offset = this.currentIndex * (this.cardWidth + this.gap);
        this.slider.scrollTo({
            left: offset,
            behavior: 'smooth'
        });
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
            if (this.currentIndex < maxIndex) {
                this.currentIndex++;
            } else {
                this.currentIndex = 0;
            }
            this.updateSlider();
        }, this.autoSlideDelay);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
}

// ========================================
// Modal System
// ========================================

class Modal {
    constructor(modalId, options = {}) {
        this.modal = document.getElementById(modalId);
        this.closeBtn = this.modal?.querySelector('.modal-close');
        this.options = {
            closeOnOutsideClick: true,
            closeOnEscape: true,
            ...options
        };
        
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', this.close.bind(this));
        }
        
        // Outside click
        if (this.options.closeOnOutsideClick) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }
        
        // Escape key
        if (this.options.closeOnEscape) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                    this.close();
                }
            });
        }
    }
    
    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.modal.setAttribute('aria-hidden', 'false');
        
        // Focus on first focusable element
        const focusableElements = this.modal.querySelectorAll('[autofocus], input, select, textarea, button, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.modal.setAttribute('aria-hidden', 'true');
        
        // Return focus to trigger element
        const trigger = document.querySelector(`[data-modal-target="${this.modal.id}"]`);
        if (trigger) {
            trigger.focus();
        }
    }
    
    toggle() {
        if (this.modal.classList.contains('active')) {
            this.close();
        } else {
            this.open();
        }
    }
}

// ========================================
// Form Validation
// ========================================

class FormValidation {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        // Add data attributes for validation
        this.setupForm();
        
        // Real-time validation
        this.addValidationListeners();
        
        // Form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    
    setupForm() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.required) {
                input.setAttribute('data-required', 'true');
            }
            
            if (input.type === 'email') {
                input.setAttribute('data-type', 'email');
            }
        });
    }
    
    addValidationListeners() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
            
            input.addEventListener('focus', () => {
                input.classList.remove('error');
                const parent = input.closest('.form-group');
                if (parent) {
                    parent.classList.remove('error-group');
                }
            });
        });
    }
    
    validateField(input) {
        const value = input.value.trim();
        const parent = input.closest('.form-group');
        const isRequired = input.required || input.getAttribute('data-required') === 'true';
        const type = input.getAttribute('data-type') || input.type;
        
        let isValid = true;
        let errorMessage = '';
        
        // Check required
        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        }
        
        // Check email
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingresa un correo electrónico válido';
            }
        }
        
        // Update UI
        if (isValid) {
            input.classList.remove('error');
            if (parent) {
                parent.classList.remove('error-group');
            }
        } else {
            input.classList.add('error');
            if (parent) {
                parent.classList.add('error-group');
            }
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', `${input.id}-error`);
        }
        
        return isValid;
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('[data-required="true"], [required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    handleSubmit(event) {
        event.preventDefault();
        
        if (this.validateForm()) {
            // Form is valid
            this.onSuccess();
        } else {
            // Form has errors
            this.onError();
        }
    }
    
    onSuccess() {
        // Can be overridden by specific form instances
        showNotification('Formulario enviado correctamente. Nos pondremos en contacto contigo pronto.', 'success');
        this.form.reset();
    }
    
    onError() {
        showNotification('Por favor, completa todos los campos requeridos correctamente.', 'error');
    }
}

// Extended Form Validation for Contact Form
class ContactFormValidation extends FormValidation {
    onSuccess() {
        showNotification('Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.', 'success');
        this.form.reset();
    }
}

// Extended Form Validation for Appointment Form
class AppointmentFormValidation extends FormValidation {
    constructor(formId, modal) {
        super(formId);
        this.modal = modal;
        this.setupDateInput();
    }
    
    setupDateInput() {
        const dateInput = this.form.querySelector('input[type="date"]');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    }
    
    onSuccess() {
        showNotification('Cita agendada exitosamente. Nos contactaremos contigo pronto.', 'success');
        this.form.reset();
        if (this.modal) {
            this.modal.close();
        }
    }
}

// ========================================
// Toast Notifications
// ========================================

class Toast {
    constructor() {
        this.container = null;
        this.createContainer();
    }
    
    createContainer() {
        if (!document.querySelector('#toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('#toast-container');
        }
    }
    
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'error' ? 'fa-exclamation-circle' : 
                     type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}" aria-hidden="true"></i>
            <span>${message}</span>
        `;
        
        toast.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#10B981' : 
                       type === 'error' ? '#EF4444' : 
                       type === 'warning' ? '#F59E0B' : '#3B82F6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease-out, slideOut 0.3s ease-out ${(duration - 300)/1000}s forwards;
            pointer-events: auto;
            cursor: pointer;
        `;
        
        // Add styles if not already present
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .toast { transition: all 0.3s ease-out; }
                .toast:hover { opacity: 0.9; }
            `;
            document.head.appendChild(style);
        }
        
        this.container.appendChild(toast);
        
        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        });
        
        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
        
        return toast;
    }
}

// Global toast instance
const toast = new Toast();

// Legacy function for compatibility
function showNotification(message, type = 'info', duration = 3000) {
    toast.show(message, type, duration);
}

// ========================================
// Gallery Lightbox
// ========================================

class GalleryLightbox {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.currentIndex = 0;
        this.lightbox = null;
        
        this.init();
    }
    
    init() {
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => this.open(index));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.open(index);
                }
            });
            item.setAttribute('tabindex', '0');
        });
    }
    
    open(index) {
        this.currentIndex = index;
        const img = this.galleryItems[index].querySelector('.gallery-img');
        if (!img) return;
        
        const imgSrc = img.getAttribute('src');
        const imgAlt = img.getAttribute('alt');
        
        this.createLightbox(imgSrc, imgAlt);
        this.updateLightboxContent();
    }
    
    createLightbox(src, alt) {
        if (this.lightbox) return;
        
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'gallery-lightbox';
        this.lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Cerrar">&times;</button>
            <button class="lightbox-nav lightbox-prev" aria-label="Anterior"><i class="fas fa-chevron-left"></i></button>
            <button class="lightbox-nav lightbox-next" aria-label="Siguiente"><i class="fas fa-chevron-right"></i></button>
            <img src="${src}" alt="${alt}" class="lightbox-img">
        `;
        
        this.lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(this.lightbox);
        document.body.style.overflow = 'hidden';
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .gallery-lightbox.active { opacity: 1; }
            .lightbox-close {
                position: absolute; top: 20px; right: 20px;
                background: none; border: none; color: white;
                font-size: 40px; cursor: pointer; padding: 10px;
                transition: transform 0.2s ease;
            }
            .lightbox-close:hover { transform: scale(1.2); }
            .lightbox-img {
                max-width: 90%; max-height: 90%;
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            }
            .lightbox-nav {
                position: absolute; top: 50%; transform: translateY(-50%);
                background: rgba(255,255,255,0.1); border: none; color: white;
                font-size: 24px; cursor: pointer; padding: 20px;
                border-radius: 50%; transition: all 0.2s ease;
            }
            .lightbox-nav:hover { background: rgba(255,255,255,0.2); }
            .lightbox-prev { left: 20px; }
            .lightbox-next { right: 20px; }
        `;
        document.head.appendChild(style);
        
        // Event listeners
        const closeBtn = this.lightbox.querySelector('.lightbox-close');
        const prevBtn = this.lightbox.querySelector('.lightbox-prev');
        const nextBtn = this.lightbox.querySelector('.lightbox-next');
        
        closeBtn.addEventListener('click', this.close.bind(this));
        prevBtn.addEventListener('click', () => this.navigate(-1));
        nextBtn.addEventListener('click', () => this.navigate(1));
        
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.close();
        });
        
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Show lightbox
        setTimeout(() => this.lightbox.classList.add('active'), 10);
    }
    
    updateLightboxContent() {
        const img = this.galleryItems[this.currentIndex].querySelector('.gallery-img');
        if (img) {
            const lightboxImg = this.lightbox.querySelector('.lightbox-img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
        }
    }
    
    navigate(direction) {
        this.currentIndex += direction;
        
        if (this.currentIndex < 0) {
            this.currentIndex = this.galleryItems.length - 1;
        } else if (this.currentIndex >= this.galleryItems.length) {
            this.currentIndex = 0;
        }
        
        this.updateLightboxContent();
    }
    
    handleKeyDown(e) {
        switch (e.key) {
            case 'Escape':
                this.close();
                break;
            case 'ArrowLeft':
                this.navigate(-1);
                break;
            case 'ArrowRight':
                this.navigate(1);
                break;
        }
    }
    
    close() {
        if (!this.lightbox) return;
        
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.handleKeyDown);
        
        setTimeout(() => {
            this.lightbox.remove();
            this.lightbox = null;
        }, 300);
    }
}

// ========================================
// Initialize All Components
// ========================================

const initAll = () => {
    // Core
    new MobileNavigation();
    new HeaderScroll();
    new ScrollAnimations();
    new SmoothScroll();
    
    // Components
    new TestimonialsSlider();
    new GalleryLightbox();
    
    // Forms
    if (DOM.contactForm) {
        new ContactFormValidation('contactForm');
    }
    
    // Modal
    const appointmentModal = DOM.appointmentModal ? new Modal('appointmentModal') : null;
    
    if (DOM.openAppointmentModal && appointmentModal) {
        DOM.openAppointmentModal.addEventListener('click', () => appointmentModal.open());
    }
    
    if (DOM.closeModal && appointmentModal) {
        DOM.closeModal.addEventListener('click', () => appointmentModal.close());
    }
    
    // Appointment Form with Modal
    if (DOM.appointmentForm && appointmentModal) {
        new AppointmentFormValidation('appointmentForm', appointmentModal);
    }
    
    // Additional buttons that open appointment modal
    const ctaButtons = document.querySelectorAll('.btn-cta, .hero-buttons .btn-primary');
    ctaButtons.forEach(btn => {
        if (btn.id !== 'openAppointmentModal' && btn.id !== 'closeModal') {
            btn.addEventListener('click', () => {
                if (appointmentModal) appointmentModal.open();
            });
        }
    });
};

// DOM Content Loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

// ========================================
// Console Welcome Message
// ========================================

console.log('%c🐾 Clínica Veterinaria Mascota Feliz', 'color: #009698; font-size: 18px; font-weight: bold; font-family: Poppins, sans-serif;');
console.log('%c¡Bienvenido a nuestro sitio web!', 'color: #FA801D; font-size: 14px; font-family: Poppins, sans-serif;');
console.log('%cDiseño y desarrollo con ❤️', 'color: #6B7280; font-size: 12px; font-family: Poppins, sans-serif;');
