// ====== MOBILE-FIRST NAVIGATION SYSTEM ======

class MobileNavigation {
    constructor() {
        this.isOpen = false;
        this.breakpoint = 768;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.scrollThreshold = 100;
        this.lastScrollY = 0;
        this.isScrollingUp = false;
        
        this.init();
    }
    
    init() {
        this.createMobileNavigation();
        this.createHamburgerMenu();
        this.addEventListeners();
        this.handleResize();
        
        console.log('📱 Mobile Navigation initialized');
    }
    
    // ====== HAMBURGER MENU CREATION ======
    
    createHamburgerMenu() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        // Create hamburger button
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'hamburger-menu';
        hamburgerBtn.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;
        hamburgerBtn.setAttribute('aria-label', 'Navigation öffnen');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        
        // Insert hamburger before nav links
        const navLinks = navbar.querySelector('.nav-links');
        if (navLinks) {
            navbar.insertBefore(hamburgerBtn, navLinks);
        }
        
        this.hamburgerBtn = hamburgerBtn;
    }
    
    createMobileNavigation() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelector('.nav-links');
        
        if (!navbar || !navLinks) return;
        
        // Add mobile classes
        navbar.classList.add('mobile-nav-ready');
        navLinks.classList.add('mobile-nav-links');
        
        // Create mobile overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        document.body.appendChild(overlay);
        
        this.overlay = overlay;
        
        // Transform existing nav items for mobile
        this.enhanceNavItems(navLinks);
        
        // Add quick actions to mobile nav
        this.addMobileQuickActions(navLinks);
    }
    
    enhanceNavItems(navLinks) {
        const navItems = navLinks.querySelectorAll('.nav-link');
        
        navItems.forEach((link, index) => {
            // Add mobile-specific classes
            link.classList.add('mobile-nav-item');
            
            // Add animation delay
            link.style.setProperty('--animation-delay', `${index * 0.1}s`);
            
            // Enhance with icons if not present
            if (!link.querySelector('i')) {
                const icon = this.getNavIcon(link.textContent.trim());
                if (icon) {
                    link.innerHTML = `<i class="${icon}"></i> ${link.textContent}`;
                }
            }
            
            // Add ripple effect
            link.addEventListener('click', (e) => this.createRippleEffect(e, link));
        });
    }
    
    getNavIcon(text) {
        const iconMap = {
            'Home': 'fas fa-home',
            'Über uns': 'fas fa-users',
            'Services': 'fas fa-cogs',
            'Projekte': 'fas fa-project-diagram',
            'Team': 'fas fa-user-friends',
            'Zertifikate': 'fas fa-certificate',
            'Kontakt': 'fas fa-envelope'
        };
        
        return iconMap[text] || 'fas fa-link';
    }
    
    addMobileQuickActions(navLinks) {
        const quickActions = document.createElement('div');
        quickActions.className = 'mobile-quick-actions';
        quickActions.innerHTML = `
            <div class="quick-action-grid">
                <button class="quick-action-btn" onclick="document.getElementById('openCallModal').click();">
                    <i class="fas fa-phone"></i>
                    <span>Anrufen</span>
                </button>
                <button class="quick-action-btn" onclick="document.getElementById('openEmailModal').click();">
                    <i class="fas fa-envelope"></i>
                    <span>E-Mail</span>
                </button>
                <button class="quick-action-btn" onclick="document.getElementById('openProjectModal').click();">
                    <i class="fas fa-calculator"></i>
                    <span>Kostenlos</span>
                </button>
                <button class="quick-action-btn" onclick="window.livechat && window.livechat.toggleChat();">
                    <i class="fas fa-comments"></i>
                    <span>Live Chat</span>
                </button>
            </div>
            <div class="mobile-contact-info">
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Elektro Eber - Ihr Partner für moderne Elektroinstallationen</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-clock"></i>
                    <span>Mo-Fr: 7:00-18:00 | Sa: 8:00-16:00</span>
                </div>
            </div>
        `;
        
        navLinks.appendChild(quickActions);
    }
    
    // ====== EVENT HANDLERS ======
    
    addEventListeners() {
        // Hamburger button click
        if (this.hamburgerBtn) {
            this.hamburgerBtn.addEventListener('click', () => this.toggleMobileNav());
        }
        
        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeMobileNav());
        }
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMobileNav();
            }
        });
        
        // Touch gestures for nav
        this.addTouchGestures();
        
        // Scroll behavior
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        // Nav link clicks
        const navLinks = document.querySelectorAll('.mobile-nav-item');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close nav after click on mobile
                if (window.innerWidth <= this.breakpoint) {
                    setTimeout(() => this.closeMobileNav(), 100);
                }
            });
        });
    }
    
    addTouchGestures() {
        const navLinks = document.querySelector('.mobile-nav-links');
        if (!navLinks) return;
        
        navLinks.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        });
        
        navLinks.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].clientY;
            const diff = this.touchStartY - this.touchEndY;
            
            // Swipe up to close
            if (diff > 100) {
                this.closeMobileNav();
            }
        });
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');
        
        if (!navbar) return;
        
        // Hide navbar when scrolling down, show when scrolling up
        if (currentScrollY > this.lastScrollY && currentScrollY > this.scrollThreshold) {
            // Scrolling down
            navbar.classList.add('nav-hidden');
            this.isScrollingUp = false;
        } else if (currentScrollY < this.lastScrollY) {
            // Scrolling up
            navbar.classList.remove('nav-hidden');
            this.isScrollingUp = true;
        }
        
        // Add background on scroll
        if (currentScrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    handleResize() {
        // Close mobile nav if resizing to desktop
        if (window.innerWidth > this.breakpoint && this.isOpen) {
            this.closeMobileNav();
        }
        
        // Update viewport units
        this.updateViewportUnits();
    }
    
    updateViewportUnits() {
        // Fix for mobile viewport issues
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // ====== NAVIGATION CONTROL ======
    
    toggleMobileNav() {
        if (this.isOpen) {
            this.closeMobileNav();
        } else {
            this.openMobileNav();
        }
    }
    
    openMobileNav() {
        const navLinks = document.querySelector('.mobile-nav-links');
        const body = document.body;
        
        if (!navLinks) return;
        
        this.isOpen = true;
        
        // Add classes
        navLinks.classList.add('mobile-nav-open');
        this.overlay.classList.add('mobile-overlay-active');
        this.hamburgerBtn.classList.add('hamburger-active');
        body.classList.add('mobile-nav-body-lock');
        
        // Update aria attributes
        this.hamburgerBtn.setAttribute('aria-expanded', 'true');
        this.hamburgerBtn.setAttribute('aria-label', 'Navigation schließen');
        
        // Animate nav items
        this.animateNavItems(true);
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        
        // Focus management
        setTimeout(() => {
            const firstNavItem = navLinks.querySelector('.mobile-nav-item');
            if (firstNavItem) firstNavItem.focus();
        }, 300);
        
        console.log('📱 Mobile Navigation opened');
    }
    
    closeMobileNav() {
        const navLinks = document.querySelector('.mobile-nav-links');
        const body = document.body;
        
        if (!navLinks || !this.isOpen) return;
        
        this.isOpen = false;
        
        // Remove classes
        navLinks.classList.remove('mobile-nav-open');
        this.overlay.classList.remove('mobile-overlay-active');
        this.hamburgerBtn.classList.remove('hamburger-active');
        body.classList.remove('mobile-nav-body-lock');
        
        // Update aria attributes
        this.hamburgerBtn.setAttribute('aria-expanded', 'false');
        this.hamburgerBtn.setAttribute('aria-label', 'Navigation öffnen');
        
        // Animate nav items
        this.animateNavItems(false);
        
        // Return focus to hamburger
        setTimeout(() => {
            this.hamburgerBtn.focus();
        }, 300);
        
        console.log('📱 Mobile Navigation closed');
    }
    
    animateNavItems(opening) {
        const navItems = document.querySelectorAll('.mobile-nav-item');
        
        navItems.forEach((item, index) => {
            if (opening) {
                setTimeout(() => {
                    item.classList.add('nav-item-animate-in');
                }, index * 50);
            } else {
                item.classList.remove('nav-item-animate-in');
            }
        });
    }
    
    // ====== UTILITY FUNCTIONS ======
    
    createRippleEffect(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.className = 'nav-ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // ====== PUBLIC API ======
    
    isNavigationOpen() {
        return this.isOpen;
    }
    
    forceClose() {
        if (this.isOpen) {
            this.closeMobileNav();
        }
    }
}

// Initialize Mobile Navigation
document.addEventListener('DOMContentLoaded', () => {
    const mobileNav = new MobileNavigation();
    
    // Make available globally
    window.mobileNavigation = mobileNav;
    
    // Integration with existing chat
    if (window.livechat) {
        window.livechat.mobileNav = mobileNav;
    }
});