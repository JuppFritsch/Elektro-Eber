// Sidebar Navigation
const sidebarOpen = document.getElementById('sidebar-open');
const sidebarClose = document.getElementById('sidebar-close');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');

if (sidebarOpen && sidebar && mainContent) {
    sidebarOpen.addEventListener('click', () => {
        sidebar.classList.add('active');
        mainContent.classList.add('shifted');
    });
}

if (sidebarClose && sidebar && mainContent) {
    sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('active');
        mainContent.classList.remove('shifted');
    });
}

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !sidebarOpen.contains(e.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        mainContent.classList.remove('shifted');
    }
});

// Navigation Active States
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// Update active navigation based on scroll
function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// Enhanced Smooth Scrolling with Animations
class SmoothScrollManager {
    constructor() {
        this.isScrolling = false;
        this.scrollDuration = 1200; // ms
        this.easeOutCubic = t => 1 - Math.pow(1 - t, 3);
        this.init();
    }
    
    init() {
        // Handle all navigation links
        const allLinks = document.querySelectorAll('a[href^="#"]');
        allLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleLinkClick(e));
        });
        
        // Add scroll animation to elements when they come into view
        this.initScrollAnimations();
    }
    
    handleLinkClick(e) {
        e.preventDefault();
        const targetId = e.target.closest('a').getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768 && sidebar) {
            sidebar.classList.remove('active');
            mainContent.classList.remove('shifted');
        }
        
        this.smoothScrollTo(targetSection);
    }
    
    smoothScrollTo(targetElement) {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        const targetPosition = targetElement.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();
        
        // Add visual feedback
        this.addScrollIndicator(targetElement);
        
        const animateScroll = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / this.scrollDuration, 1);
            const easedProgress = this.easeOutCubic(progress);
            
            const currentPosition = startPosition + (distance * easedProgress);
            window.scrollTo(0, currentPosition);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                this.isScrolling = false;
                this.removeScrollIndicator();
                // Trigger entrance animations for target section
                this.triggerSectionAnimations(targetElement);
            }
        };
        
        requestAnimationFrame(animateScroll);
    }
    
    addScrollIndicator(targetElement) {
        // Remove existing indicators
        this.removeScrollIndicator();
        
        // Add glow effect to target section
        targetElement.classList.add('scroll-target');
        
        // Create progress indicator
        const indicator = document.createElement('div');
        indicator.className = 'scroll-progress-indicator';
        indicator.innerHTML = `
            <div class="scroll-progress-line"></div>
            <div class="scroll-target-pulse"></div>
        `;
        document.body.appendChild(indicator);
    }
    
    removeScrollIndicator() {
        document.querySelectorAll('.scroll-target').forEach(el => {
            el.classList.remove('scroll-target');
        });
        
        const indicator = document.querySelector('.scroll-progress-indicator');
        if (indicator) indicator.remove();
    }
    
    triggerSectionAnimations(section) {
        // Add entrance animations to section elements
        const animatableElements = section.querySelectorAll('h1, h2, h3, p, .card, .stat-card, .service-item, .team-member, .project-card');
        
        animatableElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    initScrollAnimations() {
        // Intersection Observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe all sections and major elements
        const elementsToAnimate = document.querySelectorAll('section, .card, .stat-card, .service-item, .team-member, .project-card');
        elementsToAnimate.forEach(element => {
            element.classList.add('animate-on-scroll');
            observer.observe(element);
        });
    }
}

// Initialize smooth scrolling
const smoothScroll = new SmoothScrollManager();

// Interactive Service Map
class InteractiveServiceMap {
    constructor() {
        this.serviceZones = document.querySelectorAll('.service-zone');
        this.modal = document.getElementById('serviceModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalContent = document.getElementById('modalContent');
        this.modalClose = document.querySelector('.modal-close');
        this.contactBtn = document.getElementById('contactBtn');
        this.currentService = null;
        
        this.serviceData = {
            residential: {
                title: 'Wohnbau Elektroinstallationen',
                description: 'Professionelle Elektroinstallationen für Ihr Zuhause - von der Planung bis zur Abnahme.',
                features: [
                    'Komplette Hausinstallationen nach neuesten Standards',
                    'Renovierung bestehender Elektrik',
                    'Sicherheitssysteme und Überwachung',
                    'Moderne Beleuchtungskonzepte',
                    'Smart Home Integration',
                    'Energieeffiziente Lösungen'
                ],
                benefits: [
                    'Erhöhung der Immobilienwerte',
                    'Modernste Sicherheitsstandards',
                    'Energiekosteneinsparungen',
                    'Zukunftssichere Installationen'
                ],
                projects: '150+ erfolgreich abgeschlossene Projekte',
                contact: 'Kostenlose Erstberatung für Ihr Wohnprojekt'
            },
            commercial: {
                title: 'Gewerbe & Büroelektrik',
                description: 'Maßgeschneiderte Elektrolösungen für Büros, Geschäfte und Gewerbeobjekte.',
                features: [
                    'Professionelle Büroelektrik',
                    'Strukturierte Netzwerkverkabelung',
                    'Moderne Sicherheitstechnik',
                    'Zugangskontrollsysteme',
                    'Brandmeldesysteme',
                    'Notbeleuchtung nach DIN'
                ],
                benefits: [
                    'Höhere Produktivität durch optimale Beleuchtung',
                    'Verbesserte Sicherheit',
                    'Flexible Arbeitsplatzgestaltung',
                    'Compliance mit Vorschriften'
                ],
                projects: '80+ Gewerbeobjekte realisiert',
                contact: 'Beratung für Ihr Gewerbeprojekt vereinbaren'
            },
            industrial: {
                title: 'Industrielle Elektroinstallationen',
                description: 'Speziallösungen für Produktionsstätten und industrielle Anlagen.',
                features: [
                    'Maschineninstallationen und -anschlüsse',
                    'Professioneller Schaltschrankbau',
                    'SPS-Steuerungstechnik',
                    'Wartung und präventiver Service',
                    'Störungsbeseitigung',
                    'Industrielle Automatisierung'
                ],
                benefits: [
                    'Minimierte Ausfallzeiten',
                    'Höhere Produktionseffizienz',
                    'Planbare Wartungsintervalle',
                    'Langfristige Kostensenkung'
                ],
                projects: '25+ Industrieanlagen betreut',
                contact: 'Industrielle Lösungen anfragen'
            },
            smart: {
                title: 'Smart Technology & IoT',
                description: 'Intelligente Lösungen für die Zukunft - Smart Home, IoT und Automatisierung.',
                features: [
                    'Smart Home Systeme (KNX, Z-Wave)',
                    'IoT-Integration und Vernetzung',
                    'Intelligente Gebäudeautomatisierung',
                    'Fernüberwachung und -steuerung',
                    'App-basierte Bedienung',
                    'Energie-Management-Systeme'
                ],
                benefits: [
                    'Komfort durch Automatisierung',
                    'Energieoptimierung',
                    'Fernzugriff von überall',
                    'Zukunftssichere Technologie'
                ],
                projects: '50+ Smart-Systeme installiert',
                contact: 'Smart Home Beratung buchen'
            },
            emergency: {
                title: '24/7 Elektro-Notdienst',
                description: 'Schnelle Hilfe bei Stromausfällen und elektrischen Störungen - rund um die Uhr verfügbar.',
                features: [
                    'Sofortige Störungsbeseitigung',
                    'Sicherheitsprüfungen',
                    'Notfall-Absicherung',
                    'Schnelle Reaktionszeiten',
                    'Mobile Werkstattausrüstung',
                    'Dokumentation für Versicherung'
                ],
                benefits: [
                    'Minimaler Geschäftsausfall',
                    'Sofortige Sicherheit',
                    '24/7 Erreichbarkeit',
                    'Professionelle Erste Hilfe'
                ],
                projects: 'Durchschnittlich 30 Min. Reaktionszeit',
                contact: 'Notfall-Hotline: +49 123 456789'
            },
            consultation: {
                title: 'Elektro-Beratung & Planung',
                description: 'Kompetente Beratung und professionelle Planung für alle Elektroprojekte.',
                features: [
                    'Detaillierte Projektplanung',
                    'Kostenvoranschläge',
                    'Technische Beratung',
                    'Energieeffizienz-Analyse',
                    'Lösungskonzepte',
                    'Machbarkeitsstudien'
                ],
                benefits: [
                    'Optimale Projektplanung',
                    'Kostentransparenz',
                    'Risikominimierung',
                    'Professionelle Umsetzung'
                ],
                projects: 'Kostenlose Erstberatung',
                contact: 'Beratungstermin vereinbaren'
            }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupHoverEffects();
    }
    
    bindEvents() {
        // Click events for service zones
        this.serviceZones.forEach(zone => {
            zone.addEventListener('click', (e) => {
                e.preventDefault();
                const serviceType = zone.getAttribute('data-service');
                this.showServiceModal(serviceType);
            });
        });
        
        // Modal close events
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // Close modal on overlay click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }
        
        // Contact button in modal
        if (this.contactBtn) {
            this.contactBtn.addEventListener('click', () => {
                this.closeModal();
                // Scroll to contact section
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }
    
    setupHoverEffects() {
        this.serviceZones.forEach(zone => {
            // Add subtle animations on hover
            zone.addEventListener('mouseenter', () => {
                zone.classList.add('active');
                this.animateServiceZone(zone);
            });
            
            zone.addEventListener('mouseleave', () => {
                zone.classList.remove('active');
            });
        });
    }
    
    animateServiceZone(zone) {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'zone-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(245, 158, 11, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        // Add ripple keyframes if not exists
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        width: 200px;
                        height: 200px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        zone.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    showServiceModal(serviceType) {
        if (!this.serviceData[serviceType] || !this.modal) return;
        
        const service = this.serviceData[serviceType];
        this.currentService = serviceType;
        
        // Update modal content
        this.modalTitle.textContent = service.title;
        
        this.modalContent.innerHTML = `
            <div class="modal-service-content">
                <div class="service-description">
                    <p>${service.description}</p>
                </div>
                
                <div class="service-features">
                    <h4><i class="fas fa-list-check"></i> Unsere Leistungen</h4>
                    <ul>
                        ${service.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="service-benefits">
                    <h4><i class="fas fa-star"></i> Ihre Vorteile</h4>
                    <ul>
                        ${service.benefits.map(benefit => `<li><i class="fas fa-arrow-right"></i> ${benefit}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="service-stats">
                    <div class="stat-highlight">
                        <i class="fas fa-chart-bar"></i>
                        <span>${service.projects}</span>
                    </div>
                </div>
                
                <div class="service-contact-info">
                    <p><i class="fas fa-info-circle"></i> ${service.contact}</p>
                </div>
            </div>
        `;
        
        // Add modal styles if not exists
        if (!document.querySelector('#modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                .modal-service-content {
                    line-height: 1.6;
                }
                
                .service-description p {
                    font-size: 1.1rem;
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                }
                
                .service-features,
                .service-benefits {
                    margin-bottom: 1.5rem;
                }
                
                .service-features h4,
                .service-benefits h4 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .service-features ul,
                .service-benefits ul {
                    list-style: none;
                    padding: 0;
                }
                
                .service-features li,
                .service-benefits li {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem 0;
                    color: var(--text-secondary);
                    transition: all 0.2s ease;
                }
                
                .service-features li:hover,
                .service-benefits li:hover {
                    color: var(--primary);
                    transform: translateX(5px);
                }
                
                .service-features li i,
                .service-benefits li i {
                    color: var(--accent);
                    font-size: 0.9rem;
                }
                
                .service-stats {
                    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(16, 185, 129, 0.1));
                    padding: 1.5rem;
                    border-radius: 15px;
                    margin: 1.5rem 0;
                    text-align: center;
                }
                
                .stat-highlight {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    font-weight: 600;
                    color: var(--primary-dark);
                }
                
                .stat-highlight i {
                    font-size: 1.2rem;
                }
                
                .service-contact-info {
                    background: rgba(59, 130, 246, 0.1);
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    text-align: center;
                    margin-top: 1rem;
                }
                
                .service-contact-info p {
                    margin: 0;
                    font-weight: 500;
                    color: var(--primary-dark);
                }
                
                .service-contact-info i {
                    color: #3b82f6;
                    margin-right: 0.5rem;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Show modal
        this.modal.style.display = 'flex';
        setTimeout(() => {
            this.modal.classList.add('show');
        }, 10);
    }
    
    closeModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('show');
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, 300);
    }
}

// Initialize Interactive Service Map
document.addEventListener('DOMContentLoaded', () => {
    const serviceMap = new InteractiveServiceMap();
    window.serviceMap = serviceMap;
});

// Services Tabs Functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

// Initialize tabs when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure first tab is active
    if (tabButtons.length > 0 && tabPanels.length > 0) {
        tabButtons[0].classList.add('active');
        tabPanels[0].classList.add('active');
    }
});

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active from all buttons and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => {
            panel.classList.remove('active');
            // Add fade out effect
            panel.style.opacity = '0';
        });
        
        // Add active to clicked button
        button.classList.add('active');
        
        // Add active to corresponding panel with delay for smooth transition
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) {
            setTimeout(() => {
                targetPanel.classList.add('active');
                targetPanel.style.opacity = '1';
                
                // Animate numbers in mini-stats
                const miniNumbers = targetPanel.querySelectorAll('.mini-number');
                miniNumbers.forEach(number => {
                    animateCounter(number);
                });
            }, 150);
        }
    });
});

// Counter animation function
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 1500; // 1.5 seconds
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOutCubic);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Project Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter projects
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (filterValue === 'all' || cardCategory === filterValue) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
            return;
        }
    
        // Show success message (in a real application, you would send the data to a server)
        showNotification('Vielen Dank für Ihre Nachricht! Wir melden uns bald bei Ihnen.', 'success');
        contactForm.reset();
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification to page
    document.body.appendChild(notification);
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
            }
            
            .notification-error {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                padding: 1rem;
                gap: 0.75rem;
            }
            
            .notification-content i:first-child {
                font-size: 1.2rem;
            }
            
            .notification-content span {
                flex: 1;
                font-weight: 500;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .team-member, .stat');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Enhanced Counter Animation with Easing
function animateCounterAdvanced(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const current = Math.floor(easedProgress * (end - start) + start);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Final value to ensure accuracy
            element.textContent = end + suffix;
        }
    };
    window.requestAnimationFrame(step);
}

// Animate all counters with enhanced functionality
const allCounters = document.querySelectorAll('[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const element = entry.target;
            const target = parseInt(element.getAttribute('data-target'));
            const text = element.textContent;
            const suffix = text.replace(/\d/g, '');
            
            // Mark as animated to prevent re-animation
            element.classList.add('animated');
            
            // Different duration based on number size for better UX
            const duration = target > 100 ? 2500 : target > 50 ? 2000 : 1500;
            
            animateCounterAdvanced(element, 0, target, duration, suffix);
        }
    });
}, {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
});

allCounters.forEach(counter => counterObserver.observe(counter));

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Smooth reveal animations for sections
const revealSections = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.pageYOffset;
        
        if (scrollY > (sectionTop - windowHeight + 100)) {
            section.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealSections);
revealSections(); // Initial call

// Add CSS for section reveals
const revealStyles = document.createElement('style');
revealStyles.textContent = `
    section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    section.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    #home {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(revealStyles);

// Add slideOutRight animation
const slideOutStyles = document.createElement('style');
slideOutStyles.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(slideOutStyles);

// Service cards hover effect enhancement
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Team member cards interaction
document.querySelectorAll('.team-member').forEach(member => {
    member.addEventListener('click', () => {
        member.classList.toggle('expanded');
    });
});

// Project Selection Modal
class ProjectModal {
    constructor() {
        this.modal = document.getElementById('projectModal');
        this.currentStep = 1;
        this.projectData = {
            type: null,
            services: [],
            specials: [],
            basePrice: 0,
            totalPrice: 0,
            size: 0,
            buildingAge: 1.0,
            accessibility: 1.0,
            timeframe: 1.0,
            workingHours: 1.0,
            materialQuality: 1.0,
            warranty: 1.0,
            location: null
        };
        this.servicesByType = {
            // Wohngebäude Services
            'house-new': [
                { id: 'full-installation', name: 'Komplettinstallation', description: 'Alle Elektroarbeiten für Neubau', price: 2500 },
                { id: 'smart-prep', name: 'Smart-Home Vorbereitung', description: 'Verkabelung für künftige Automation', price: 1200 },
                { id: 'premium-outlets', name: 'Premium-Steckdosen', description: 'Hochwertige Schalter und Steckdosen', price: 800 },
                { id: 'outdoor-connection', name: 'Außenanschlüsse', description: 'Garten, Garage, Terrasse', price: 650 }
            ],
            'house-renovation': [
                { id: 'rewiring', name: 'Komplett-Sanierung', description: 'Erneuerung der gesamten Elektrik', price: 1800 },
                { id: 'partial-upgrade', name: 'Teil-Modernisierung', description: 'Ausgewählte Bereiche erneuern', price: 1200 },
                { id: 'fuse-upgrade', name: 'Sicherungskasten', description: 'Moderne Elektroverteilung', price: 1500 },
                { id: 'safety-upgrade', name: 'Sicherheit nachrüsten', description: 'FI-Schutzschalter, RCD', price: 600 }
            ],
            'apartment': [
                { id: 'apartment-basic', name: 'Grundausstattung', description: 'Standard Elektroinstallation', price: 800 },
                { id: 'apartment-comfort', name: 'Komfort-Ausstattung', description: 'Erweiterte Elektrik mit Extras', price: 1200 },
                { id: 'kitchen-special', name: 'Küchen-Elektrik', description: 'Spezielle Kücheninstallation', price: 650 },
                { id: 'bathroom-special', name: 'Bad-Elektrik', description: 'Feuchtraum-Installation', price: 450 }
            ],
            'basement': [
                { id: 'basement-basic', name: 'Keller-Grundausstattung', description: 'Beleuchtung und Steckdosen', price: 400 },
                { id: 'workshop-setup', name: 'Werkstatt-Ausstattung', description: 'Starkstrom, spezielle Anschlüsse', price: 800 },
                { id: 'attic-conversion', name: 'Dachboden-Ausbau', description: 'Komplette Elektrifizierung', price: 950 },
                { id: 'storage-lighting', name: 'Lager-Beleuchtung', description: 'Optimale Ausleuchtung', price: 300 }
            ],
            'garden': [
                { id: 'garden-lighting', name: 'Gartenbeleuchtung', description: 'LED-Außenbeleuchtung', price: 550 },
                { id: 'garage-connection', name: 'Garagen-Anschluss', description: 'Strom und Licht für Garage', price: 450 },
                { id: 'pool-electrics', name: 'Pool-Elektrik', description: 'Sicherheitstechnik für Pool', price: 1200 },
                { id: 'garden-outlets', name: 'Garten-Steckdosen', description: 'Wetterfeste Außensteckdosen', price: 280 }
            ],
            
            // Gewerbe Services  
            'office': [
                { id: 'office-standard', name: 'Büro-Standard', description: 'Arbeitsplätze, Beleuchtung', price: 1500 },
                { id: 'network-infrastructure', name: 'Netzwerk-Infrastruktur', description: 'Cat6/7 Verkabelung', price: 2200 },
                { id: 'conference-tech', name: 'Konferenzraum-Technik', description: 'A/V-Installation, Präsentation', price: 1800 },
                { id: 'server-room', name: 'Server-Raum', description: 'IT-Infrastruktur, USV', price: 3500 }
            ],
            'retail': [
                { id: 'shop-lighting', name: 'Laden-Beleuchtung', description: 'Präsentationsbeleuchtung', price: 2200 },
                { id: 'pos-systems', name: 'Kassen-Systeme', description: 'Elektrische Kassen-Infrastructure', price: 1200 },
                { id: 'security-retail', name: 'Laden-Sicherheit', description: 'Alarmanlage, Überwachung', price: 1800 },
                { id: 'window-display', name: 'Schaufenster-Technik', description: 'Beleuchtung, Präsentation', price: 950 }
            ],
            'restaurant': [
                { id: 'kitchen-professional', name: 'Profi-Küche', description: 'Gastronomie-Elektrik', price: 4500 },
                { id: 'dining-atmosphere', name: 'Restaurant-Atmosphäre', description: 'Stimmungsbeleuchtung', price: 1800 },
                { id: 'ventilation-electric', name: 'Lüftungs-Elektrik', description: 'Dunstabzug, Klimaanlage', price: 2200 },
                { id: 'pos-restaurant', name: 'Gastronomie-Kassen', description: 'Spezialisierte Kassen-Systeme', price: 1500 }
            ],
            'medical': [
                { id: 'medical-safety', name: 'Medizin-Sicherheit', description: 'Spezielle Sicherheitsanforderungen', price: 3200 },
                { id: 'examination-rooms', name: 'Behandlungsräume', description: 'Medizinische Elektroinstallation', price: 2500 },
                { id: 'medical-equipment', name: 'Geräte-Anschlüsse', description: 'Medizintechnik-Stromversorgung', price: 1800 },
                { id: 'emergency-power-med', name: 'Notstrom Medizin', description: 'USV für kritische Geräte', price: 4500 }
            ],
            'warehouse': [
                { id: 'warehouse-lighting', name: 'Hallen-Beleuchtung', description: 'Industrielle LED-Beleuchtung', price: 3500 },
                { id: 'loading-dock', name: 'Laderampen-Technik', description: 'Elektrische Laderampen', price: 2800 },
                { id: 'conveyor-power', name: 'Förderband-Elektrik', description: 'Antriebe, Steuerungen', price: 4200 },
                { id: 'warehouse-heating', name: 'Hallen-Heizung', description: 'Elektrische Hallenheizung', price: 5500 }
            ],
            
            // Industrie Services
            'production': [
                { id: 'production-lines', name: 'Produktionslinien', description: 'Komplette Fertigungsstraßen', price: 15000 },
                { id: 'industrial-automation', name: 'Produktions-Automation', description: 'SPS, Robotik, Steuerungen', price: 22000 },
                { id: 'quality-control', name: 'Qualitätskontrolle', description: 'Mess- und Prüftechnik', price: 8500 },
                { id: 'production-monitoring', name: 'Produktions-Monitoring', description: 'Überwachung, Datenerfassung', price: 6500 }
            ],
            'control-cabinet': [
                { id: 'plc-programming', name: 'SPS-Programmierung', description: 'Siemens, Allen-Bradley, etc.', price: 4500 },
                { id: 'hmi-systems', name: 'HMI-Systeme', description: 'Bedienoberflächen, Panels', price: 3200 },
                { id: 'safety-circuits', name: 'Sicherheits-Schaltungen', description: 'Sicherheitsrelais, Not-Aus', price: 2800 },
                { id: 'fieldbus-systems', name: 'Feldbus-Systeme', description: 'Profibus, Ethernet/IP', price: 3800 }
            ],
            'machinery': [
                { id: 'cnc-connection', name: 'CNC-Maschinen', description: 'Werkzeugmaschinen-Anschluss', price: 5500 },
                { id: 'press-systems', name: 'Pressen-Elektrik', description: 'Hydraulik- und Pressensysteme', price: 6800 },
                { id: 'packaging-machines', name: 'Verpackungsmaschinen', description: 'Automatisierte Verpackung', price: 4200 },
                { id: 'testing-equipment', name: 'Prüfanlagen', description: 'Elektrische Prüf- und Messgeräte', price: 7500 }
            ],
            'automation': [
                { id: 'scada-systems', name: 'SCADA-Systeme', description: 'Prozessvisualisierung', price: 8500 },
                { id: 'mig-welding', name: 'Industrie 4.0', description: 'Digitalisierung, IoT-Integration', price: 12000 },
                { id: 'predictive-maintenance', name: 'Predictive Maintenance', description: 'Vorausschauende Wartung', price: 9500 },
                { id: 'energy-monitoring', name: 'Energie-Monitoring', description: 'Energiemanagement-Systeme', price: 6800 }
            ],
            
            // Smart Technology Services
            'smart-home-basic': [
                { id: 'smart-lighting-basic', name: 'Smart Beleuchtung', description: 'Intelligente LED-Steuerung', price: 1200 },
                { id: 'smart-outlets', name: 'Smart Steckdosen', description: 'WLAN-Steckdosen, Zeitschaltungen', price: 450 },
                { id: 'voice-assistant', name: 'Sprachassistent', description: 'Alexa, Google Integration', price: 350 },
                { id: 'smart-thermostat', name: 'Smart Thermostat', description: 'Intelligente Heizungssteuerung', price: 650 }
            ],
            'smart-home-premium': [
                { id: 'knx-installation', name: 'KNX-System', description: 'Professionelle Gebäudeautomation', price: 4500 },
                { id: 'smart-security-premium', name: 'Premium Sicherheit', description: 'Umfassendes Smart Security', price: 3200 },
                { id: 'multimedia-integration', name: 'Multimedia-Integration', description: 'Audio/Video im ganzen Haus', price: 2800 },
                { id: 'smart-blinds', name: 'Automatische Jalousien', description: 'Motorisierte Beschattung', price: 1800 }
            ],
            'security': [
                { id: 'alarm-system', name: 'Alarmanlage', description: 'Einbruchmeldeanlage', price: 1800 },
                { id: 'video-surveillance', name: 'Videoüberwachung', description: 'IP-Kameras, Aufzeichnung', price: 2200 },
                { id: 'access-control-smart', name: 'Zutrittskontrolle', description: 'Elektronische Schließsysteme', price: 1500 },
                { id: 'intercom-system', name: 'Gegensprechanlage', description: 'Video-Türsprechanlage', price: 800 }
            ],
            'network': [
                { id: 'structured-cabling', name: 'Strukturierte Verkabelung', description: 'Cat6A/7 Netzwerk', price: 1200 },
                { id: 'wifi-professional', name: 'Profi WLAN', description: 'Enterprise WLAN-Lösung', price: 950 },
                { id: 'network-security', name: 'Netzwerk-Sicherheit', description: 'Firewall, VPN-Zugang', price: 1500 },
                { id: 'server-installation', name: 'Server-Installation', description: 'Rack, USV, Verkabelung', price: 2200 }
            ],
            
            // Energie & Solar Services
            'solar-small': [
                { id: 'pv-modules-small', name: 'PV-Module (bis 10kW)', description: 'Solarmodule und Montage', price: 6500 },
                { id: 'inverter-small', name: 'Wechselrichter klein', description: 'String-Wechselrichter', price: 1200 },
                { id: 'grid-connection', name: 'Netzanschluss', description: 'Einspeisung, Zähler', price: 800 },
                { id: 'monitoring-small', name: 'Überwachung', description: 'PV-Anlagen Monitoring', price: 450 }
            ],
            'solar-large': [
                { id: 'pv-modules-large', name: 'PV-Module (über 10kW)', description: 'Große Solaranlagen', price: 12000 },
                { id: 'inverter-large', name: 'Wechselrichter groß', description: 'Zentral-Wechselrichter', price: 3500 },
                { id: 'transformer-station', name: 'Trafostation', description: 'Mittelspannungsanschluss', price: 8500 },
                { id: 'grid-management', name: 'Einspeisemanagement', description: 'Fernsteuerung, Regelung', price: 2200 }
            ],
            'battery': [
                { id: 'lithium-battery', name: 'Lithium-Speicher', description: 'Hochwertige Batteriesysteme', price: 8500 },
                { id: 'hybrid-inverter', name: 'Hybrid-Wechselrichter', description: 'Batterie-Wechselrichter', price: 2200 },
                { id: 'backup-power', name: 'Notstrom-Funktion', description: 'Ersatzstromversorgung', price: 1800 },
                { id: 'energy-management', name: 'Energiemanagement', description: 'Intelligente Steuerung', price: 1200 }
            ],
            'wallbox': [
                { id: 'wallbox-basic', name: 'Wallbox Standard', description: '11kW Ladestation', price: 800 },
                { id: 'wallbox-smart', name: 'Smart Wallbox', description: 'WLAN, App-Steuerung', price: 1200 },
                { id: 'load-management', name: 'Lastmanagement', description: 'Intelligente Ladung', price: 650 },
                { id: 'wallbox-installation', name: 'Installation', description: 'Montage und Anschluss', price: 450 }
            ],
            'power-upgrade': [
                { id: 'house-connection', name: 'Hausanschluss-Verstärkung', description: 'Leistungserhöhung', price: 2200 },
                { id: 'distribution-upgrade', name: 'Hauptverteilung', description: 'Erweiterte Elektroverteilung', price: 1800 },
                { id: 'three-phase-upgrade', name: 'Drehstrom-Upgrade', description: '3-Phasen Anschlüsse', price: 1200 },
                { id: 'smart-meter', name: 'Smart Meter', description: 'Intelligenter Stromzähler', price: 350 }
            ],
            
            // Service & Notfall
            'emergency': [
                { id: 'emergency-callout', name: 'Notfall-Anfahrt', description: '24h Bereitschaftsdienst', price: 180 },
                { id: 'fault-diagnosis', name: 'Störungsdiagnose', description: 'Fehlersuche und Analyse', price: 120 },
                { id: 'emergency-repair', name: 'Notfall-Reparatur', description: 'Sofortige Instandsetzung', price: 150 },
                { id: 'temporary-power', name: 'Provisorische Versorgung', description: 'Überbrückungslösungen', price: 200 }
            ],
            'maintenance': [
                { id: 'e-check', name: 'E-Check', description: 'Gesetzliche Sicherheitsprüfung', price: 180 },
                { id: 'thermal-inspection', name: 'Thermografie', description: 'Wärmebildaufnahmen', price: 220 },
                { id: 'insulation-test', name: 'Isolationsmessung', description: 'Elektrische Sicherheitsprüfung', price: 150 },
                { id: 'lightning-protection', name: 'Blitzschutzprüfung', description: 'Prüfung der Blitzschutzanlage', price: 250 }
            ],
            'repair': [
                { id: 'outlet-repair', name: 'Steckdosen-Reparatur', description: 'Defekte Steckdosen erneuern', price: 80 },
                { id: 'switch-repair', name: 'Schalter-Reparatur', description: 'Lichtschalter instandsetzen', price: 60 },
                { id: 'fuse-replacement', name: 'Sicherung tauschen', description: 'Defekte Sicherungen ersetzen', price: 45 },
                { id: 'cable-repair', name: 'Kabel-Reparatur', description: 'Beschädigte Leitungen reparieren', price: 120 }
            ],
            'upgrade': [
                { id: 'rcd-installation', name: 'FI-Schutzschalter', description: 'Personenschutz nachrüsten', price: 180 },
                { id: 'surge-protection', name: 'Überspannungsschutz', description: 'Schutz vor Spannungsspitzen', price: 220 },
                { id: 'circuit-upgrade', name: 'Stromkreis erweitern', description: 'Neue Stromkreise installieren', price: 280 },
                { id: 'earthing-upgrade', name: 'Erdung erneuern', description: 'Potentialausgleich modernisieren', price: 350 }
            ]
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Modal öffnen/schließen
        const openModalBtn = document.getElementById('openProjectModal');
        const closeModalBtn = document.getElementById('closeModal');
        
        if (openModalBtn) {
            openModalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeModal());
        }
        
        // Außerhalb Modal klicken zum Schließen
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // ESC Taste zum Schließen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });

        // Projekttyp auswählen - wird beim Modal öffnen gesetzt

        // Navigation zwischen Schritten
        const nextBtn1 = document.getElementById('nextStep1');
        const nextBtn2 = document.getElementById('nextStep2');
        const prevBtn = document.getElementById('prevStep');
        const prevBtn2 = document.getElementById('prevStep2');
        
        if (nextBtn1) nextBtn1.addEventListener('click', () => this.nextStep());
        if (nextBtn2) nextBtn2.addEventListener('click', () => this.nextStep());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevStep());
        if (prevBtn2) prevBtn2.addEventListener('click', () => this.prevStep());
        
        // Projekt neu starten
        const startOverBtn = document.getElementById('startOver');
        if (startOverBtn) startOverBtn.addEventListener('click', () => this.resetModal());
        
        // Preisberechnung bei Eingabeänderungen
        const projectSizeInput = document.getElementById('projectSize');
        const timeframeSelect = document.getElementById('timeframe');
        const buildingAgeSelect = document.getElementById('buildingAge');
        const accessibilitySelect = document.getElementById('accessibility');
        const workingHoursSelect = document.getElementById('workingHours');
        const materialQualitySelect = document.getElementById('materialQuality');
        const warrantySelect = document.getElementById('warranty');
        const locationInput = document.getElementById('location');
        
        if (projectSizeInput) projectSizeInput.addEventListener('input', () => this.calculatePrice());
        if (timeframeSelect) timeframeSelect.addEventListener('change', () => this.calculatePrice());
        if (buildingAgeSelect) buildingAgeSelect.addEventListener('change', () => this.calculatePrice());
        if (accessibilitySelect) accessibilitySelect.addEventListener('change', () => this.calculatePrice());
        if (workingHoursSelect) workingHoursSelect.addEventListener('change', () => this.calculatePrice());
        if (materialQualitySelect) materialQualitySelect.addEventListener('change', () => this.calculatePrice());
        if (warrantySelect) warrantySelect.addEventListener('change', () => this.calculatePrice());
        if (locationInput) locationInput.addEventListener('input', () => this.calculatePrice());
        
        // Event Listener für spezielle Anforderungen
        this.setupSpecialRequirementsListeners();
        
        // Event Listener für Spezial-Checkboxen
        this.setupSpecialRequirementsListeners();
        
        // Aktionsbuttons
        const requestQuoteBtn = document.getElementById('requestQuote');
        const callNowBtn = document.getElementById('callNow');
        
        if (requestQuoteBtn) requestQuoteBtn.addEventListener('click', () => this.requestQuote());
        if (callNowBtn) callNowBtn.addEventListener('click', () => this.callNow());
    }

    openModal() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        this.resetModal();
        this.setupProjectTypeListeners();
    }

    setupProjectTypeListeners() {
        // Projekttyp-Karten Event-Listener setzen
        document.querySelectorAll('.project-type-card').forEach(card => {
            card.addEventListener('click', () => this.selectProjectType(card));
        });
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    resetModal() {
        this.currentStep = 1;
        this.projectData = { 
            type: null, 
            services: [], 
            specials: [], 
            basePrice: 0, 
            totalPrice: 0 
        };
        
        // Alle Schritte zurücksetzen
        document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
        const step1 = document.getElementById('step-1');
        if (step1) step1.classList.add('active');
        
        // Auswahlen zurücksetzen
        document.querySelectorAll('.project-type-card').forEach(card => card.classList.remove('selected'));
        document.querySelectorAll('.service-item').forEach(item => item.classList.remove('selected'));
        
        // Eingabefelder leeren
        const projectSize = document.getElementById('projectSize');
        const timeframe = document.getElementById('timeframe');
        const additional = document.getElementById('additional');
        
        if (projectSize) projectSize.value = '';
        if (timeframe) timeframe.value = '';
        if (additional) additional.value = '';
        
        // Buttons deaktivieren
        const nextStep1 = document.getElementById('nextStep1');
        if (nextStep1) nextStep1.disabled = true;
    }

    selectProjectType(card) {
        console.log('Projekttyp ausgewählt:', card.dataset.type);
        
        // Alle Karten deselektieren
        document.querySelectorAll('.project-type-card').forEach(c => c.classList.remove('selected'));
        
        // Gewählte Karte auswählen
        card.classList.add('selected');
        
        // Projektdaten speichern
        this.projectData.type = card.dataset.type;
        this.projectData.basePrice = parseInt(card.dataset.basePrice);
        
        // Next Button aktivieren
        const nextBtn1 = document.getElementById('nextStep1');
        if (nextBtn1) {
            nextBtn1.disabled = false;
            console.log('Weiter-Button aktiviert');
        }
        
        // Services für nächsten Schritt vorbereiten
        this.loadServices();
    }

    loadServices() {
        const container = document.getElementById('servicesContainer');
        if (!container) return;
        
        const services = this.servicesByType[this.projectData.type] || [];
        
        container.innerHTML = '';
        
        // Services sind optional - Weiter Button immer aktiviert
        const nextBtn2 = document.getElementById('nextStep2');
        if (nextBtn2) nextBtn2.disabled = false;
        
        console.log('Services geladen für', this.projectData.type, ':', services.length, 'Services');
        
        services.forEach(service => {
            const serviceElement = document.createElement('div');
            serviceElement.className = 'service-item';
            serviceElement.dataset.serviceId = service.id;
            serviceElement.dataset.price = service.price;
            
            serviceElement.innerHTML = `
                <div class="service-checkbox"></div>
                <div class="service-info">
                    <h4>${service.name}</h4>
                    <p>${service.description}</p>
                </div>
                <div class="service-price">+${service.price.toLocaleString()}€</div>
            `;
            
            serviceElement.addEventListener('click', () => this.toggleService(serviceElement, service));
            container.appendChild(serviceElement);
        });
    }

    toggleService(element, service) {
        element.classList.toggle('selected');
        
        const index = this.projectData.services.findIndex(s => s.id === service.id);
        if (index > -1) {
            this.projectData.services.splice(index, 1);
            console.log('Service entfernt:', service.name);
        } else {
            this.projectData.services.push(service);
            console.log('Service hinzugefügt:', service.name);
        }
        
        console.log('Aktuelle Services:', this.projectData.services.map(s => s.name));
    }

    nextStep() {
        console.log('NextStep clicked, current step:', this.currentStep);
        
        if (this.currentStep < 3) {
            const currentStepEl = document.getElementById(`step-${this.currentStep}`);
            if (currentStepEl) currentStepEl.classList.remove('active');
            
            this.currentStep++;
            console.log('Moving to step:', this.currentStep);
            
            const nextStepEl = document.getElementById(`step-${this.currentStep}`);
            if (nextStepEl) nextStepEl.classList.add('active');
            
            // Nach Schritt 2: Services sind optional, immer erlauben
            if (this.currentStep === 3) {
                this.showSummary();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            const currentStepEl = document.getElementById(`step-${this.currentStep}`);
            if (currentStepEl) currentStepEl.classList.remove('active');
            
            this.currentStep--;
            
            const prevStepEl = document.getElementById(`step-${this.currentStep}`);
            if (prevStepEl) prevStepEl.classList.add('active');
        }
    }

    showSummary() {
        const selectedProject = document.getElementById('selectedProject');
        const typeCard = document.querySelector('.project-type-card.selected');
        
        if (typeCard) {
            selectedProject.innerHTML = `
                <h4>${typeCard.querySelector('h3').textContent}</h4>
                <p>${typeCard.querySelector('p').textContent}</p>
                <div class="selected-services">
                    <strong>Gewählte Leistungen:</strong>
                    ${this.projectData.services.length > 0 
                        ? `<ul>${this.projectData.services.map(s => `<li>${s.name}</li>`).join('')}</ul>`
                        : '<p>Keine Zusatzleistungen ausgewählt</p>'
                    }
                </div>
            `;
        }
        
        this.calculatePrice();
    }

    calculatePrice() {
        // Grundpreise sammeln
        const basePrice = this.projectData.basePrice || 0;
        const servicesPrice = this.projectData.services.reduce((sum, service) => sum + service.price, 0);
        const specialsPrice = this.projectData.specials.reduce((sum, special) => sum + special.price, 0);
        
        // Projektgröße berechnen
        const projectSizeEl = document.getElementById('projectSize');
        const size = projectSizeEl ? parseInt(projectSizeEl.value) || 0 : 0;
        let sizePrice = 0;
        if (size > 0) {
            const pricePerSqm = this.getPricePerSquareMeter();
            sizePrice = size * pricePerSqm;
        }
        
        // Multiplikatoren sammeln
        const buildingMultiplier = this.getMultiplierFromSelect('buildingAge');
        const accessMultiplier = this.getMultiplierFromSelect('accessibility');
        const timeMultiplier = this.getMultiplierFromSelect('timeframe');
        const hoursMultiplier = this.getMultiplierFromSelect('workingHours');
        const materialMultiplier = this.getMultiplierFromSelect('materialQuality');
        const warrantyMultiplier = this.getMultiplierFromSelect('warranty');
        
        // Anfahrtskosten berechnen
        const travelPrice = this.calculateTravelCosts();
        
        // Zwischensumme vor Multiplikatoren
        const subtotal = basePrice + servicesPrice + specialsPrice + sizePrice + travelPrice;
        
        // Einzelne Zuschläge berechnen
        const buildingPrice = subtotal * (buildingMultiplier - 1);
        const accessPrice = subtotal * (accessMultiplier - 1);
        const timePrice = subtotal * (timeMultiplier - 1);
        const hoursPrice = subtotal * (hoursMultiplier - 1);
        const materialPrice = subtotal * (materialMultiplier - 1);
        const warrantyPrice = subtotal * (warrantyMultiplier - 1);
        
        // Gesamtpreis berechnen
        const totalPrice = subtotal + buildingPrice + accessPrice + timePrice + hoursPrice + materialPrice + warrantyPrice;
        
        // Preisbereich berechnen (±15%)
        const minPrice = totalPrice * 0.85;
        const maxPrice = totalPrice * 1.15;
        
        // UI aktualisieren
        this.updatePriceDisplay({
            basePrice,
            servicesPrice,
            specialsPrice,
            sizePrice,
            buildingPrice,
            accessPrice,
            timePrice,
            hoursPrice,
            materialPrice,
            warrantyPrice,
            travelPrice,
            totalPrice,
            minPrice,
            maxPrice
        });
        
        this.projectData.totalPrice = Math.round(totalPrice);
    }
    
    getPricePerSquareMeter() {
        const categoryMultipliers = {
            // Wohngebäude
            'house-new': 45,
            'house-renovation': 35,
            'apartment': 30,
            'basement': 20,
            'garden': 15,
            
            // Gewerbe
            'office': 40,
            'retail': 50,
            'restaurant': 60,
            'medical': 55,
            'warehouse': 25,
            
            // Industrie
            'production': 80,
            'control-cabinet': 0, // Pauschalpreis
            'machinery': 65,
            'automation': 90,
            
            // Smart Technology
            'smart-home-basic': 35,
            'smart-home-premium': 65,
            'security': 25,
            'network': 20,
            
            // Energie & Solar
            'solar-small': 0, // Bei Solar zählt kWp, nicht m²
            'solar-large': 0,
            'battery': 0,
            'wallbox': 0,
            'power-upgrade': 15,
            
            // Service
            'emergency': 0,
            'maintenance': 5,
            'repair': 0,
            'upgrade': 10
        };
        
        return categoryMultipliers[this.projectData.type] || 25;
    }
    
    getMultiplierFromSelect(selectId) {
        const selectEl = document.getElementById(selectId);
        if (!selectEl || !selectEl.selectedOptions[0]) return 1.0;
        
        const multiplier = selectEl.selectedOptions[0].dataset.multiplier;
        return multiplier ? parseFloat(multiplier) : 1.0;
    }
    
    calculateTravelCosts() {
        const locationEl = document.getElementById('location');
        if (!locationEl || !locationEl.value) return 0;
        
        const plz = locationEl.value;
        // Vereinfachte PLZ-basierte Berechnung (Ravensburg ist 88XXX)
        if (plz.startsWith('88')) {
            return 0; // Lokal, keine Anfahrtskosten
        } else if (plz.startsWith('8')) {
            return 50; // Baden-Württemberg
        } else {
            return 120; // Weitere Entfernungen
        }
    }
    
    updatePriceDisplay(prices) {
        // Grundkosten
        const basePriceEl = document.getElementById('basePrice');
        const servicesPriceEl = document.getElementById('servicesPrice');
        const specialsPriceEl = document.getElementById('specialsPrice');
        
        if (basePriceEl) basePriceEl.textContent = `${prices.basePrice.toLocaleString()}€`;
        if (servicesPriceEl) servicesPriceEl.textContent = `${prices.servicesPrice.toLocaleString()}€`;
        if (specialsPriceEl) specialsPriceEl.textContent = `${prices.specialsPrice.toLocaleString()}€`;
        
        // Zuschläge und Rabatte
        const sizePriceEl = document.getElementById('sizePrice');
        const buildingPriceEl = document.getElementById('buildingPrice');
        const accessPriceEl = document.getElementById('accessPrice');
        const timePriceEl = document.getElementById('timePrice');
        const hoursPriceEl = document.getElementById('hoursPrice');
        const materialPriceEl = document.getElementById('materialPrice');
        const warrantyPriceEl = document.getElementById('warrantyPrice');
        
        if (sizePriceEl) sizePriceEl.textContent = this.formatPriceChange(prices.sizePrice);
        if (buildingPriceEl) buildingPriceEl.textContent = this.formatPriceChange(prices.buildingPrice);
        if (accessPriceEl) accessPriceEl.textContent = this.formatPriceChange(prices.accessPrice);
        if (timePriceEl) timePriceEl.textContent = this.formatPriceChange(prices.timePrice);
        if (hoursPriceEl) hoursPriceEl.textContent = this.formatPriceChange(prices.hoursPrice);
        if (materialPriceEl) materialPriceEl.textContent = this.formatPriceChange(prices.materialPrice);
        if (warrantyPriceEl) warrantyPriceEl.textContent = this.formatPriceChange(prices.warrantyPrice);
        
        // Anfahrt und Gesamt
        const travelPriceEl = document.getElementById('travelPrice');
        const totalPriceEl = document.getElementById('totalPrice');
        const minPriceEl = document.getElementById('minPrice');
        const maxPriceEl = document.getElementById('maxPrice');
        
        if (travelPriceEl) travelPriceEl.textContent = `${prices.travelPrice.toLocaleString()}€`;
        if (totalPriceEl) totalPriceEl.textContent = `${Math.round(prices.totalPrice).toLocaleString()}€`;
        if (minPriceEl) minPriceEl.textContent = `${Math.round(prices.minPrice).toLocaleString()}€`;
        if (maxPriceEl) maxPriceEl.textContent = `${Math.round(prices.maxPrice).toLocaleString()}€`;
    }
    
    formatPriceChange(price) {
        if (price === 0) return '±0€';
        const sign = price > 0 ? '+' : '';
        return `${sign}${Math.round(price).toLocaleString()}€`;
    }
    
    setupSpecialRequirementsListeners() {
        const specialCheckboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
        specialCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateSpecialRequirements(e.target);
                this.calculatePrice();
            });
        });
    }
    
    updateSpecialRequirements(checkbox) {
        const price = parseInt(checkbox.dataset.price) || 0;
        const name = checkbox.closest('.checkbox-item').querySelector('span:last-child').textContent;
        const id = checkbox.id;
        
        if (checkbox.checked) {
            // Hinzufügen wenn nicht bereits vorhanden
            if (!this.projectData.specials.find(s => s.id === id)) {
                this.projectData.specials.push({
                    id,
                    name,
                    price
                });
            }
        } else {
            // Entfernen wenn vorhanden
            this.projectData.specials = this.projectData.specials.filter(s => s.id !== id);
        }
    }

    requestQuote() {
        // Erstmal prüfen ob Kundendaten erfasst wurden
        this.showContactForm();
    }
    
    showContactForm() {
        // Kontaktformular im Modal anzeigen
        const modalContent = document.querySelector('#projectModal .modal-content');
        const currentContent = modalContent.innerHTML;
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>📧 Kontaktdaten für Ihr Angebot</h2>
                <span class="modal-close" id="closeModal">&times;</span>
            </div>
            
            <div class="project-contact-form">
                <div class="project-summary">
                    <h3>📋 Ihr gewähltes Projekt:</h3>
                    <p><strong>Projekttyp:</strong> ${this.getProjectTypeName(this.projectData.type)}</p>
                    <p><strong>Geschätzter Preis:</strong> ${Math.round(this.projectData.totalPrice).toLocaleString()}€</p>
                    <p><strong>Anzahl Services:</strong> ${this.projectData.services.length}</p>
                </div>
                
                <form id="projectContactForm" class="contact-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="projectContactName">Name *</label>
                            <input type="text" id="projectContactName" required placeholder="Ihr vollständiger Name">
                        </div>
                        <div class="form-group">
                            <label for="projectContactPhone">Telefon *</label>
                            <input type="tel" id="projectContactPhone" required placeholder="Ihre Telefonnummer">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="projectContactEmail">E-Mail *</label>
                        <input type="email" id="projectContactEmail" required placeholder="ihre.email@beispiel.de">
                    </div>
                    
                    <div class="form-group">
                        <label for="projectContactMessage">Zusätzliche Informationen</label>
                        <textarea id="projectContactMessage" rows="4" placeholder="Weitere Details zu Ihrem Projekt..."></textarea>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="projectContactPrivacy" required>
                            <span class="checkmark"></span>
                            Ich stimme der Datenschutzerklärung zu und bin damit einverstanden, dass meine Daten zur Bearbeitung meiner Projektanfrage gespeichert werden. *
                        </label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="window.projectModal.goBackToProject()">
                            <i class="fas fa-arrow-left"></i> Zurück
                        </button>
                        <button type="submit" class="btn-primary-large">
                            <i class="fas fa-paper-plane"></i> Projektanfrage senden
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        // Event Listeners für neues Formular
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('projectContactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitProjectRequest();
        });
        
        this.originalContent = currentContent;
    }
    
    goBackToProject() {
        if (this.originalContent) {
            const modalContent = document.querySelector('#projectModal .modal-content');
            modalContent.innerHTML = this.originalContent;
            this.bindEvents(); // Event Listeners neu setzen
        }
    }
    
    submitProjectRequest() {
        // Formular-Daten sammeln
        const formData = {
            name: document.getElementById('projectContactName').value,
            phone: document.getElementById('projectContactPhone').value,
            email: document.getElementById('projectContactEmail').value,
            message: document.getElementById('projectContactMessage').value
        };
        
        // Validierung
        if (!formData.name || !formData.phone || !formData.email) {
            alert('Bitte füllen Sie alle Pflichtfelder aus!');
            return;
        }
        
        // E-Mail Validierung
        if (!this.isValidEmail(formData.email)) {
            alert('Bitte geben Sie eine gültige E-Mail-Adresse ein!');
            return;
        }
        
        // Datenschutz Check
        const privacy = document.getElementById('projectContactPrivacy');
        if (!privacy.checked) {
            alert('Bitte stimmen Sie der Datenschutzerklärung zu!');
            return;
        }
        
        // Projektanfrage für Admin Dashboard erstellen
        const projectBooking = {
            id: 'EB-PROJEKT-' + Date.now(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            date: new Date().toISOString().split('T')[0],
            time: '10:00',
            service: {
                name: this.getProjectTypeName(this.projectData.type),
                price: `Angebot: ${Math.round(this.projectData.totalPrice).toLocaleString()}€`
            },
            message: `PROJEKTANFRAGE:\n\nProjekttyp: ${this.getProjectTypeName(this.projectData.type)}\nGeschätzter Preis: ${Math.round(this.projectData.totalPrice).toLocaleString()}€\nAnzahl Services: ${this.projectData.services.length}\n\nGewählte Services:\n${this.projectData.services.map(s => `• ${s.name} (${s.price}€)`).join('\n')}\n\nZusätzliche Informationen:\n${formData.message || 'Keine weiteren Angaben'}`,
            status: 'pending',
            timestamp: new Date().toLocaleString('de-DE'),
            type: 'project'
        };
        
        // In LocalStorage für Admin Dashboard speichern
        const existingBookings = JSON.parse(localStorage.getItem('elektro-eber-bookings') || '[]');
        existingBookings.push(projectBooking);
        localStorage.setItem('elektro-eber-bookings', JSON.stringify(existingBookings));
        
        // Erfolgs-Feedback mit schöner Benachrichtigung
        this.showProjectSuccessNotification(projectBooking.id);
        
        console.log('📊 Projektanfrage gespeichert:', projectBooking);
        this.closeModal();
        
        console.log('📊 Projektanfrage gespeichert:', projectBooking);
    }
    
    getProjectTypeName(type) {
        const typeNames = {
            'house-new': 'Neubau Einfamilienhaus',
            'house-renovation': 'Haus-Renovierung', 
            'apartment': 'Wohnung',
            'basement': 'Keller/Nebengebäude',
            'garden': 'Garten/Außenbereich',
            'office': 'Büro',
            'retail': 'Einzelhandel',
            'restaurant': 'Restaurant/Gastronomie',
            'medical': 'Medizin/Praxis',
            'warehouse': 'Lager/Logistik',
            'production': 'Produktion',
            'control-cabinet': 'Schaltschrank',
            'machinery': 'Maschinen/Anlagen',
            'automation': 'Automatisierung',
            'smart-home-basic': 'Smart Home Basic',
            'smart-home-premium': 'Smart Home Premium',
            'security': 'Sicherheitstechnik',
            'network': 'Netzwerktechnik',
            'solar-small': 'Photovoltaik Klein',
            'solar-large': 'Photovoltaik Groß',
            'battery': 'Batteriespeicher',
            'wallbox': 'Wallbox/E-Mobilität',
            'power-upgrade': 'Hausanschluss',
            'emergency': 'Notdienst',
            'maintenance': 'Wartung/E-Check',
            'repair': 'Reparatur',
            'upgrade': 'Modernisierung'
        };
        return typeNames[type] || 'Projektanfrage';
    }
    
    sendProjectEmail(formData, projectBooking) {
        const subject = encodeURIComponent(`🔌 PROJEKTANFRAGE - ${projectBooking.id}`);
        const body = encodeURIComponent(`
NEUE PROJEKTANFRAGE - ELEKTRO EBER
==================================

📋 PROJEKTDETAILS:
• Anfrage-ID: ${projectBooking.id}
• Projekttyp: ${this.getProjectTypeName(this.projectData.type)}
• Geschätzter Preis: ${Math.round(this.projectData.totalPrice).toLocaleString()}€

👤 KUNDENDETAILS:
• Name: ${formData.name}
• Telefon: ${formData.phone}
• E-Mail: ${formData.email}

🛠️ GEWÄHLTE SERVICES:
${this.projectData.services.map(s => `• ${s.name} - ${s.price}€`).join('\n')}

💬 NACHRICHT:
${formData.message || 'Keine weitere Nachricht'}

⏰ Anfrage erstellt: ${projectBooking.timestamp}

WICHTIG: Bitte kontaktieren Sie den Kunden innerhalb von 24 Stunden!

📊 Admin Dashboard: Öffnen Sie das Admin Dashboard um weitere Details zu sehen.
        `);
        
        // Mailto Link öffnen
        const mailtoLink = `mailto:dennis@elektro-eber.de?subject=${subject}&body=${body}`;
        window.open(mailtoLink);
        
        console.log('📧 Projekt-E-Mail geöffnet');
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    showProjectSuccessNotification(projectId) {
        // Overlay erstellen
        const overlay = document.createElement('div');
        overlay.className = 'success-notification-overlay';
        
        // Notification erstellen
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="success-icon">🎉</div>
            <h3>Projektanfrage erfolgreich gesendet!</h3>
            <p>Vielen Dank für Ihr Interesse. Wir haben Ihre Projektanfrage mit der ID <strong>${projectId}</strong> erhalten und melden uns innerhalb von 24 Stunden bei Ihnen zurück.</p>
            <p>In der Zwischenzeit können Sie gerne unsere anderen Services entdecken oder sich über unsere abgeschlossenen Projekte informieren.</p>
            <div>
                <button class="btn-primary" onclick="this.closest('.success-notification-overlay').remove();">
                    ✓ Perfekt, vielen Dank!
                </button>
                <button onclick="this.closest('.success-notification-overlay').remove(); window.location.href='#projekte';">
                    🏗️ Weitere Projekte ansehen
                </button>
            </div>
        `;
        
        // Zum DOM hinzufügen
        document.body.appendChild(overlay);
        overlay.appendChild(notification);
        
        // Automatisch nach 8 Sekunden schließen
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    overlay.remove();
                }, 300);
            }
        }, 8000);
        
        // Modal schließen
        this.closeModal();
    }
    
    showAppointmentSuccessNotification(formData) {
        // Overlay erstellen
        const overlay = document.createElement('div');
        overlay.className = 'success-notification-overlay';
        
        // Notification erstellen
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="success-icon">📅</div>
            <h3>Terminanfrage erfolgreich gesendet!</h3>
            <p>Vielen Dank, <strong>${formData.name}</strong>! Wir haben Ihre Terminanfrage mit der ID <strong>${formData.id}</strong> erhalten.</p>
            <p>Wir melden uns innerhalb von 24 Stunden bei Ihnen zurück, um den genauen Termin zu bestätigen.</p>
            <div>
                <button class="btn-primary" onclick="this.closest('.success-notification-overlay').remove();">
                    ✓ Perfekt, vielen Dank!
                </button>
                <button onclick="this.closest('.success-notification-overlay').remove(); window.location.href='#services';">
                    🔍 Unsere Services ansehen
                </button>
            </div>
        `;
        
        // Zum DOM hinzufügen
        document.body.appendChild(overlay);
        overlay.appendChild(notification);
        
        // Automatisch nach 8 Sekunden schließen
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    overlay.remove();
                }, 300);
            }
        }, 8000);
        
        // Modal schließen
        this.closeModal();
    }

    callNow() {
        window.location.href = 'tel:+49123456789';
    }
}

// Certification CTA Button functionality
function initializeCertificationsCTA() {
    const certificationBtns = document.querySelectorAll('.certifications-cta .btn-primary-large, .certifications-cta .btn-secondary-large');
    
    certificationBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Check if appointment system exists and open modal
            const appointmentModal = document.getElementById('appointmentModal');
            if (appointmentModal) {
                appointmentModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                // Pre-fill service field with certification consultation
                const serviceField = document.querySelector('#appointmentModal select[name="service"]');
                if (serviceField) {
                    serviceField.value = 'beratung';
                }
                
                // Pre-fill message with certification inquiry
                const messageField = document.querySelector('#appointmentModal textarea[name="message"]');
                if (messageField && messageField.value.trim() === '') {
                    messageField.value = 'Ich interessiere mich für eine Beratung zu Ihren Zertifizierungen und Qualifikationen.';
                }
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize certification CTA buttons
    initializeCertificationsCTA();
    
    // Initialize Cookie Management System
    const cookieManager = new CookieManager();
    window.cookieManager = cookieManager; // Make available globally for debugging
    
    // Initialize project modal
    try {
        window.projectModal = new ProjectModal();
        console.log('Project Modal initialized successfully! 🎉');
    } catch (error) {
        console.error('Error initializing Project Modal:', error);
        
        // Fallback: Einfacher Event Listener für den Button
        const openBtn = document.getElementById('openProjectModal');
        if (openBtn) {
            openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Modal wird geladen... Bitte versuchen Sie es erneut!');
                console.log('Fallback button click triggered');
            });
        }
    }
    
    // Initialize Theme Manager
    new ThemeManager();
    
    // Initialize testimonials slider
    setTimeout(() => {
        new TestimonialSlider();
    }, 500);
    
    // Initialize FAQ functionality
    setTimeout(() => {
        new FAQManager();
    }, 600);
    
    // Initialize Live Chat
    setTimeout(() => {
        try {
            const chat = new LiveChat();
            console.log('✅ LiveChat initialized successfully');
            window.liveChat = chat; // Make available for debugging
        } catch (error) {
            console.error('❌ LiveChat initialization failed:', error);
        }
    }, 700);
    
    // Initialize Simple Appointment System
    setTimeout(() => {
        new SimpleAppointmentSystem();
    }, 800);
    
    console.log('Elektro Eber Website geladen! 🔌⚡');
});

// Testimonials Slider Class
class TestimonialSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.testimonial-prev');
        this.nextBtn = document.querySelector('.testimonial-next');
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // Event listeners
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto-slide every 5 seconds
        this.autoSlide = setInterval(() => this.nextSlide(), 5000);
        
        // Pause auto-slide on hover
        const slider = document.querySelector('.testimonials-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => clearInterval(this.autoSlide));
            slider.addEventListener('mouseleave', () => {
                this.autoSlide = setInterval(() => this.nextSlide(), 5000);
            });
        }
        
        this.showSlide(0);
    }
    
    showSlide(index) {
        // Remove active class from all slides and dots
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        if (this.slides[index]) this.slides[index].classList.add('active');
        if (this.dots[index]) this.dots[index].classList.add('active');
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    }
    
    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
    }
    
    goToSlide(index) {
        this.showSlide(index);
    }
}

// FAQ Manager Class
class FAQManager {
    constructor() {
        this.categoryBtns = document.querySelectorAll('.faq-category-btn');
        this.categories = document.querySelectorAll('.faq-category');
        this.faqItems = document.querySelectorAll('.faq-item');
        
        this.init();
    }
    
    init() {
        // Category switching
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchCategory(btn));
        });
        
        // FAQ item toggle
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => this.toggleFAQ(item));
        });
    }
    
    switchCategory(activeBtn) {
        const category = activeBtn.dataset.category;
        
        // Update buttons
        this.categoryBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
        
        // Update categories
        this.categories.forEach(cat => {
            if (cat.dataset.category === category) {
                cat.classList.add('active');
            } else {
                cat.classList.remove('active');
            }
        });
        
        // Close all open FAQs when switching categories
        this.faqItems.forEach(item => item.classList.remove('active'));
    }
    
    toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQs in the same category
        const currentCategory = item.closest('.faq-category');
        const itemsInCategory = currentCategory.querySelectorAll('.faq-item');
        itemsInCategory.forEach(faqItem => faqItem.classList.remove('active'));
        
        // Toggle current FAQ
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

// Enhanced AI-Powered Live Chat Manager Class
class LiveChat {
    constructor() {
        this.chatButton = document.getElementById('chat-button');
        this.chatWindow = document.getElementById('chat-window');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-message');
        this.messagesContainer = document.getElementById('chat-messages');
        this.minimizeBtn = document.getElementById('minimize-chat');
        this.closeBtn = document.getElementById('close-chat');
        this.notification = document.getElementById('chat-notification');
        this.quickActionBtns = document.querySelectorAll('.quick-action-btn');
        
        this.isOpen = false;
        this.isMinimized = false;
        this.messageCount = 0;
        
        // AI-Enhanced Properties
        this.conversationHistory = [];
        this.userContext = {
            name: null,
            visitedSections: [],
            interests: [],
            previousQuestions: [],
            mood: 'neutral',
            language: this.detectUserLanguage(),
            sessionStart: Date.now(),
            timeSpent: 0,
            preferredContactMethod: null
        };
        this.botPersonality = {
            name: 'ElektroBot',
            expertise: 'Elektroinstallationen',
            humor: true,
            formality: 'friendly-professional',
            responseStyle: 'expert-helpful',
            brandVoice: 'elektro-eber',
            traits: ['knowledgeable', 'reliable', 'approachable', 'solution-oriented']
        };
        
        this.expertKnowledge = {
            specialties: ['Smart Home', 'Industrie 4.0', 'Photovoltaik', 'E-Mobilität', 'Sicherheitstechnik'],
            certifications: ['Elektroinnungsbetrieb', 'KNX-Partner', 'E-Check qualifiziert'],
            experience: '247+ erfolgreiche Projekte',
            serviceArea: 'Ravensburg & Umgebung'
        };
        
        this.init();
        this.setupAdvancedResponses();
        this.setupMultiLanguageResponses();
        this.startContextTracking();
        this.initPersonalizedGreeting();
        this.loadChatHistory();
        this.setupAdvancedFeatures();
    }
    
    init() {
        // Check if all elements exist
        if (!this.chatButton || !this.chatWindow || !this.chatInput || !this.sendButton) {
            console.error('Chat elements not found:', {
                chatButton: !!this.chatButton,
                chatWindow: !!this.chatWindow, 
                chatInput: !!this.chatInput,
                sendButton: !!this.sendButton
            });
            return;
        }

        // Chat button toggle
        this.chatButton.addEventListener('click', () => this.toggleChat());
        
        // Control buttons
        if (this.minimizeBtn) this.minimizeBtn.addEventListener('click', () => this.minimizeChat());
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeChat());
        
        // Send message
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Enhanced typing indicator
        this.chatInput.addEventListener('input', () => {
            this.handleTyping();
        });
        
        // Quick actions
        this.quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                this.sendUserMessage(message);
            });
        });
        
        // Context-aware proactive greeting
        setTimeout(() => {
            if (!this.isOpen && !this.hasShownInitialGreeting()) {
                this.showContextualNotification();
            }
        }, 5000);
        
        // Advanced welcome message when first opened
        this.hasGreeted = false;
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.chatWindow.classList.add('open');
        this.isOpen = true;
        this.hideNotification();
        this.chatInput.focus();
        
        // Send personalized welcome message if first time
        if (!this.hasGreeted) {
            this.sendPersonalizedWelcome();
            this.hasGreeted = true;
        }
        
        // Track user engagement
        this.userContext.timeSpent = Date.now() - this.userContext.sessionStart;
    }
    
    closeChat() {
        this.chatWindow.classList.remove('open');
        this.isOpen = false;
        this.isMinimized = false;
    }
    
    minimizeChat() {
        this.chatWindow.classList.remove('open');
        this.isMinimized = true;
        this.isOpen = false;
    }
    
    showNotification() {
        this.notification.classList.add('simple');
        this.notification.style.display = 'flex';
        this.notification.textContent = '1';
    }
    
    hideNotification() {
        this.notification.style.display = 'none';
        this.notification.classList.remove('simple');
    }
    
    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        console.log('Sending message:', message);
        this.sendUserMessage(message);
        this.chatInput.value = '';
    }
    
    sendUserMessage(message) {
        console.log('📨 User message received:', message);
        this.addMessage(message, 'user');
        
        // Add to conversation history
        this.conversationHistory.push({
            type: 'user',
            message: message,
            timestamp: Date.now()
        });
        
        // Analyze user intent and context
        this.analyzeUserInput(message);
        
        // Show enhanced typing indicator with varied timing
        const typingDelay = this.calculateResponseDelay(message);
        console.log('⏱️ Response delay:', typingDelay + 'ms');
        
        setTimeout(() => {
            this.showEnhancedTypingIndicator();
            
            // Generate intelligent response
            setTimeout(() => {
                console.log('🤖 Generating response...');
                this.hideTypingIndicator();
                this.generateIntelligentResponse(message);
            }, typingDelay);
        }, 300 + Math.random() * 500);
    }
    
    addMessage(text, sender = 'agent') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textP = document.createElement('p');
        textP.textContent = text;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = 'Jetzt';
        
        contentDiv.appendChild(textP);
        contentDiv.appendChild(timeSpan);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message agent-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </p>
            </div>
        `;
        
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingIndicator = this.messagesContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    setupAdvancedResponses() {
        this.responses = {
            'kostenvoranschlag': {
                primary: [
                    'Perfekt! Nutzen Sie unseren interaktiven Projektplaner! 🔧 Klicken Sie einfach auf "Projekt planen" auf der Startseite für eine sofortige Kosteneinschätzung.',
                    'Unser intelligenter Kostenrechner gibt Ihnen direkt eine erste Preisvorstellung - probieren Sie es aus! 💡',
                    'Für präzise Angebote schauen Sie sich unsere Leistungen an oder nutzen Sie das Kontaktformular weiter unten.'
                ],
                contextual: [
                    'Da Sie sich bereits die Projekte angesehen haben - der Projektplaner wird Ihnen basierend auf ähnlichen Arbeiten eine Schätzung geben! 🎯',
                    'Basierend auf unseren 247+ abgeschlossenen Projekten kann ich Ihnen eine erste Einschätzung geben. Was für ein Projekt schwebt Ihnen vor?'
                ],
                follow_up: [
                    'Haben Sie den Projektplaner schon ausprobiert? Falls Sie Fragen haben, helfe ich gerne weiter! 🤔',
                    'Möchten Sie, dass ich Ihnen durch den Kostenrechner helfe? Welche Art von Elektroarbeiten benötigen Sie?'
                ]
            },
            'notfall': [
                'Notfall-Situation? 🚨 Rufen Sie sofort +49 (0) 123 456 789 an!',
                'Mehr Infos zu unserem 24h-Notdienst finden Sie in den FAQ unter "Notdienst" - wir sind in 30-60 Min vor Ort!',
                'Bei Stromausfall oder Kurzschluss: Direkt anrufen für schnelle Hilfe!'
            ],
            'termin': [
                'Terminvereinbarung? Super! 📅 Nutzen Sie unser Kontaktformular weiter unten auf der Seite.',
                'Im Kontaktbereich können Sie Ihren Wunschtermin angeben - wir melden uns schnell zurück!',
                'Oder schauen Sie sich erst unsere Projekte und Services an, dann kontaktieren Sie uns für einen Beratungstermin.'
            ],
            'preis': [
                'Preise variieren je nach Projekt! 💰 Nutzen Sie unseren Projektplaner (Button "Projekt planen") für eine sofortige Einschätzung!',
                'Grundinstallationen ab 2.500€ - Details finden Sie in unseren FAQ unter "Preise".',
                'Der Kostenrechner auf der Hauptseite gibt Ihnen sofort eine Preisvorstellung für Ihr Projekt!'
            ],
            'smart home': [
                'Smart Home ist unser Spezialgebiet! 🏠✨ Schauen Sie unter "Leistungen" → "Smart Tech" für alle Details.',
                'KNX, WLAN-Lösungen, Hausautomation - alles in der Services-Sektion zu finden!',
                'Nutzen Sie den Projektplaner und wählen "Smart Home" für eine Kosteneinschätzung Ihrer Wünsche.'
            ],
            'leistungen': [
                'Alle unsere Services finden Sie unter "Leistungen"! 🔧 Wohnbau, Gewerbe, Industrie, Smart Tech.',
                'Klicken Sie auf "Leistungen" im Menü - dort sehen Sie alle Bereiche mit Details!',
                'Von Elektroinstallation bis Photovoltaik - scrollen Sie zu "Unsere Expertise" für alle Infos.'
            ],
            'team': [
                'Lernen Sie unser Expertenteam kennen! 👥 Scrollen Sie zu "Das Elektro Eber Team" auf der Hauptseite.',
                'Dennis Eckert und das Team stellen sich in der Team-Sektion vor - mit allen Qualifikationen!',
                'Unser Team hat bereits 247 Projekte erfolgreich abgeschlossen - Details in der Team-Sektion.'
            ],
            'projekte': [
                'Schauen Sie sich unsere Referenzen an! 📋 In der "Projekte" Sektion sehen Sie alle realisierten Arbeiten.',
                'Klicken Sie auf "Projekte" im Menü - dort können Sie nach Wohnen, Gewerbe oder Smart Tech filtern.',
                'Über 189 zufriedene Kunden - sehen Sie sich die Projekt-Galerie an!'
            ],
            'faq': [
                'Antworten auf alle wichtigen Fragen finden Sie in unserem FAQ-Bereich! ❓',
                'Scrollen Sie zu den "Häufig gestellten Fragen" - sortiert nach Allgemein, Leistungen, Preise und Notdienst.',
                'Die FAQ-Sektion beantwortet fast alles - von Preisen bis Garantie!'
            ],
            'bewertungen': [
                'Unsere Kundenbewertungen sehen Sie in der Testimonials-Sektion! ⭐ 4.9 Sterne Durchschnitt!',
                'Scrollen Sie zu "Das sagen unsere Kunden" für echte Bewertungen und Erfahrungen.',
                '98% Kundenzufriedenheit - lesen Sie die Erfahrungsberichte auf der Hauptseite!'
            ],
            'kontakt': [
                'Alle Kontaktmöglichkeiten finden Sie im Kontaktbereich! 📧 Formular, Telefon und Adresse.',
                'Scrollen Sie nach unten zum Kontaktformular oder rufen Sie +49 (0) 123 456 789 an.',
                'Wir sind in Aichstetten - alle Details im Kontakt-Bereich mit Karte!'
            ],
            'default': [
                'Ich helfe Ihnen gerne weiter! 🤖 Schauen Sie sich um: Leistungen, Team, Projekte, FAQ - alles auf dieser Seite!',
                'Nutzen Sie unseren Projektplaner für Kostenvoranschläge oder das Kontaktformular für persönliche Beratung!',
                'Was interessiert Sie? Leistungen, Preise, Team oder ein konkretes Projekt? Alles ist hier auf der Website zu finden!'
            ]
        };
    }
    
    sendAutoResponse(userMessage) {
        const message = userMessage.toLowerCase();
        let responseKey = 'default';
        
        // Keyword detection for better responses
        if (message.includes('kostenvoranschlag') || message.includes('angebot')) {
            responseKey = 'kostenvoranschlag';
        } else if (message.includes('preis') || message.includes('kosten') || message.includes('kostet')) {
            responseKey = 'preis';
        } else if (message.includes('notfall') || message.includes('hilfe') || message.includes('problem') || message.includes('defekt')) {
            responseKey = 'notfall';
        } else if (message.includes('termin') || message.includes('beratung') || message.includes('besuch')) {
            responseKey = 'termin';
        } else if (message.includes('smart home') || message.includes('knx') || message.includes('hausautomation')) {
            responseKey = 'smart home';
        } else if (message.includes('leistung') || message.includes('service') || message.includes('was macht') || message.includes('was bietet')) {
            responseKey = 'leistungen';
        } else if (message.includes('team') || message.includes('mitarbeiter') || message.includes('wer') || message.includes('dennis')) {
            responseKey = 'team';
        } else if (message.includes('projekt') || message.includes('referenz') || message.includes('beispiel') || message.includes('arbeit')) {
            responseKey = 'projekte';
        } else if (message.includes('frage') || message.includes('faq') || message.includes('hilfe')) {
            responseKey = 'faq';
        } else if (message.includes('bewertung') || message.includes('erfahrung') || message.includes('kunde') || message.includes('meinung')) {
            responseKey = 'bewertungen';
        } else if (message.includes('kontakt') || message.includes('erreichen') || message.includes('adresse') || message.includes('telefon')) {
            responseKey = 'kontakt';
        }
        
        const responses = this.responses[responseKey];
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        this.addMessage(response);
    }
    
    // ====== ENHANCED AI FUNCTIONS ======
    
    initPersonalizedGreeting() {
        // Detect returning user
        const lastVisit = localStorage.getItem('elektro-eber-last-visit');
        if (lastVisit) {
            this.userContext.isReturning = true;
            this.userContext.lastVisit = new Date(lastVisit);
        }
        localStorage.setItem('elektro-eber-last-visit', new Date().toISOString());
    }
    
    startContextTracking() {
        // Track which sections user views
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.id) {
                    if (!this.userContext.visitedSections.includes(entry.target.id)) {
                        this.userContext.visitedSections.push(entry.target.id);
                        this.updateUserInterests(entry.target.id);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
        
        // Track time spent
        setInterval(() => {
            this.userContext.timeSpent += 1000;
        }, 1000);
    }
    
    updateUserInterests(sectionId) {
        const interestMap = {
            'services': 'services',
            'team': 'company_info',
            'projekte': 'portfolio',
            'faq': 'support',
            'contact': 'contact'
        };
        
        const interest = interestMap[sectionId];
        if (interest && !this.userContext.interests.includes(interest)) {
            this.userContext.interests.push(interest);
        }
    }
    
    analyzeUserInput(message) {
        const lowercaseMessage = message.toLowerCase();
        
        // Extract name if provided
        if (!this.userContext.name) {
            const nameMatch = lowercaseMessage.match(/(?:ich bin|ich heiße|mein name ist|ich heisse)\s+([a-zäöüß]+)/i);
            if (nameMatch) {
                this.userContext.name = nameMatch[1];
                this.personalizeResponse = true;
            }
        }
        
        // Detect mood/urgency
        const urgentKeywords = ['notfall', 'dringend', 'schnell', 'sofort', 'problem', 'defekt', 'ausgefallen'];
        const politeKeywords = ['bitte', 'danke', 'höflich', 'freundlich'];
        
        if (urgentKeywords.some(keyword => lowercaseMessage.includes(keyword))) {
            this.userContext.mood = 'urgent';
        } else if (politeKeywords.some(keyword => lowercaseMessage.includes(keyword))) {
            this.userContext.mood = 'polite';
        }
        
        // Store question type
        this.userContext.previousQuestions.push({
            message: message,
            timestamp: Date.now(),
            intent: this.detectIntent(message)
        });
        
        // Keep only last 10 questions for context
        if (this.userContext.previousQuestions.length > 10) {
            this.userContext.previousQuestions.shift();
        }
    }
    
    detectIntent(message) {
        const intents = {
            'price_inquiry': ['preis', 'kosten', 'kostet', 'teuer', 'günstig', 'angebot', 'kostenvoranschlag'],
            'service_inquiry': ['service', 'leistung', 'was macht', 'angebote', 'installation'],
            'emergency': ['notfall', 'problem', 'defekt', 'ausgefallen', 'kaputt', 'dringend'],
            'appointment': ['termin', 'beratung', 'besichtigung', 'kommen sie'],
            'company_info': ['team', 'firma', 'unternehmen', 'wer sind', 'erfahrung'],
            'technical': ['wie funktioniert', 'technisch', 'smart home', 'knx', 'installation'],
            'location': ['wo', 'adresse', 'anfahrt', 'standort', 'aichstetten']
        };
        
        const lowercaseMessage = message.toLowerCase();
        
        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => lowercaseMessage.includes(keyword))) {
                return intent;
            }
        }
        
        return 'general';
    }
    
    calculateResponseDelay(message) {
        const baseDelay = 1200;
        const messageLength = message.length;
        const complexity = this.detectIntent(message) === 'technical' ? 500 : 0;
        
        return Math.min(baseDelay + (messageLength * 20) + complexity, 3000);
    }
    
    showEnhancedTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message agent-message typing-indicator enhanced';
        
        const statusMessages = [
            'ElektroBot schreibt...',
            'Expertenantwort wird erstellt...',
            'Analysiere Ihre Anfrage...',
            'Suche passende Lösung...'
        ];
        
        const randomStatus = statusMessages[Math.floor(Math.random() * statusMessages.length)];
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-thinking">
                    <i class="fas fa-robot"></i>
                    <div class="thinking-indicator"></div>
                </div>
            </div>
            <div class="message-content">
                <p class="typing-status">${randomStatus}</p>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    buildResponseContext() {
        return {
            visitedSections: this.userContext.visitedSections,
            interests: this.userContext.interests,
            isReturning: this.userContext.isReturning,
            mood: this.userContext.mood,
            timeSpent: this.userContext.timeSpent,
            conversationLength: this.conversationHistory.length,
            previousIntents: this.userContext.previousQuestions.map(q => q.intent),
            userName: this.userContext.name
        };
    }
    
    generatePriceResponse(context) {
        const responses = [
            '💰 **Preise für Elektroarbeiten:**\n\n🏠 **Wohnbau:** ab 2.500€\n🏢 **Gewerbe:** ab 3.500€\n⚡ **Smart Home:** ab 1.200€\n🔧 **Reparaturen:** ab 80€',
            '📊 **Transparent kalkuliert:** Nutzen Sie unseren interaktiven **Projektplaner** für eine sofortige Einschätzung! Einfach auf "Projekt planen" klicken.',
            '💡 **Kostenbeispiele:** Basierend auf 247+ Projekten kann ich Ihnen realistische Preise nennen. Was für Arbeiten planen Sie konkret?'
        ];
        
        if (context.visitedSections.includes('projekte')) {
            return '🎯 Da Sie sich bereits unsere Projekte angesehen haben - ähnliche Arbeiten kosteten zwischen 2.500€ und 15.000€. Der **Projektplaner** zeigt Ihnen basierend auf Ihren Wünschen eine präzise Schätzung!';
        }
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    generateEmergencyResponse(context) {
        if (context.mood === 'urgent') {
            return '🚨 **ELEKTRO-NOTFALL** 🚨\n\n📞 **Sofort anrufen: +49 (0) 123 456 789**\n\n⚠️ **Sicherheitscheck:**\n• Hauptschalter ausschalten\n• Gefahrenbereich verlassen\n• Bei Brandgefahr: 112\n\n⏰ **Wir kommen in 30-60 Min!**';
        }
        
        return '⚡ **24h-Notdienst:** Bei Elektroproblemen sind wir rund um die Uhr für Sie da!\n\n📞 **Hotline: +49 (0) 123 456 789**\n⏰ **Durchschnittliche Ankunftszeit: 45 Min**\n\n🛡️ Über 500 Notfälle erfolgreich gelöst!';
    }
    
    generateTechnicalResponse(userMessage, context) {
        const lowercaseMessage = userMessage.toLowerCase();
        
        if (lowercaseMessage.includes('smart home') || lowercaseMessage.includes('knx')) {
            return '🏠 **Smart Home Expertise:**\n\n🔧 **KNX-System:** Professionelle Gebäudeautomation\n📱 **App-Steuerung:** Licht, Heizung, Sicherheit\n💡 **LED-Integration:** Intelligente Beleuchtung\n🛡️ **Sicherheitstechnik:** Kameras, Alarmanlagen\n\nℹ️ 50+ Smart-Systeme bereits installiert!';
        }
        
        if (lowercaseMessage.includes('photovoltaik') || lowercaseMessage.includes('solar')) {
            return '☀️ **Photovoltaik-Expertise:**\n\n⚡ **Komplettlösungen:** Von 3kW bis 100kW\n🔋 **Batteriespeicher:** Maximale Eigennutzung\n📊 **Monitoring:** Live-Überwachung per App\n💰 **Förderung:** Unterstützung bei Anträgen\n\n✅ 80+ PV-Anlagen erfolgreich installiert!';
        }
        
        return '🔧 **Technische Expertise:** Als Elektroinnungsbetrieb lösen wir komplexe technische Herausforderungen!\n\n💡 Was konkret interessiert Sie? Ich erkläre gerne Details zu unseren Technologien!';
    }
    
    generateCompanyInfoResponse(context) {
        if (context.visitedSections.includes('team')) {
            return '👥 **Sie haben unser Team bereits kennengelernt!** Dennis Eckert und sein Expertenteam bringen jahrelange Erfahrung mit.\n\n🏆 **Unsere Erfolge:**\n• 247+ Projekte abgeschlossen\n• 98% Kundenzufriedenheit\n• Elektroinnungsbetrieb\n\n💪 Qualität und Zuverlässigkeit seit Jahren!';
        }
        
        return '🏢 **Elektro Eber - Ihr Elektroexperte:**\n\n👨‍🔧 **Dennis Eckert:** Meister mit Leidenschaft\n📍 **Standort:** Aichstetten (Raum Ravensburg)\n🛡️ **Garantie:** Vollumfänglicher Service\n🎖️ **Zertifiziert:** Elektroinnungsbetrieb\n\n🎯 Scrollen Sie zum Team-Bereich für mehr Details!';
    }
    
    generateContextualResponse(userMessage, context) {
        // Fallback with context awareness
        const responses = [
            `🤖 Gerne helfe ich Ihnen weiter! ${context.userName ? context.userName + ', ' : ''}was möchten Sie über Elektro Eber wissen?`,
            '💡 Als Ihr digitaler Elektro-Experte beantworte ich gerne alle Fragen! Worum geht es konkret?',
            '⚡ Elektrofragen? Perfekt! Lassen Sie uns gemeinsam die beste Lösung für Sie finden!'
        ];
        
        if (context.timeSpent > 60000 && !context.visitedSections.includes('services')) {
            return '🔍 **Tipp:** Schauen Sie sich unsere **Leistungen** an! Dort finden Sie Details zu allen Services von Wohnbau bis Smart Home.\n\n❓ Haben Sie spezielle Fragen dazu?';
        }
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    personalizeResponse(response, context) {
        if (context.userName) {
            // Add personal touch if name is known
            const personalPrefixes = [
                `${context.userName}, `,
                `Lieber ${context.userName}, `,
                `Hallo ${context.userName}! `
            ];
            
            if (!response.includes(context.userName)) {
                const prefix = personalPrefixes[Math.floor(Math.random() * personalPrefixes.length)];
                response = prefix + response.charAt(0).toLowerCase() + response.slice(1);
            }
        }
        
        // Add mood-appropriate tone
        if (context.mood === 'polite') {
            response += '\n\n😊 Vielen Dank für Ihre Höflichkeit!';
        }
        
        return response;
    }
    
    suggestFollowUp(intent, context) {
        const suggestions = {
            'price_inquiry': ['📋 Projektplaner nutzen', '📞 Kostenlose Beratung', '📧 Angebot anfordern'],
            'emergency': ['📞 Jetzt anrufen', '⚡ Notdienst-Infos', '🛡️ Sicherheitstipps'],
            'appointment': ['📅 Termin buchen', '📞 Rückruf vereinbaren', '📍 Anfahrt planen'],
            'technical': ['🔍 Service-Details', '📋 Projektbeispiele', '💡 Beratungstermin']
        };
        
        const followUpSuggestions = suggestions[intent] || ['📞 Kontakt aufnehmen', '🔍 Mehr erfahren', '📋 Projektplaner'];
        
        this.showFollowUpSuggestions(followUpSuggestions);
    }
    
    showFollowUpSuggestions(suggestions) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'chat-follow-up-suggestions';
        
        suggestionsDiv.innerHTML = `
            <div class="suggestions-header">💡 <strong>Wie kann ich Ihnen weiterhelfen?</strong></div>
            <div class="suggestions-buttons">
                ${suggestions.map(suggestion => 
                    `<button class="suggestion-btn" data-action="${suggestion}">${suggestion}</button>`
                ).join('')}
            </div>
        `;
        
        // Add event listeners to suggestion buttons
        setTimeout(() => {
            suggestionsDiv.querySelectorAll('.suggestion-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    this.handleSuggestionClick(action);
                    suggestionsDiv.remove();
                });
            });
        }, 100);
        
        this.messagesContainer.appendChild(suggestionsDiv);
        this.scrollToBottom();
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (suggestionsDiv.parentElement) {
                suggestionsDiv.style.opacity = '0.5';
                setTimeout(() => suggestionsDiv.remove(), 2000);
            }
        }, 30000);
    }
    
    handleSuggestionClick(action) {
        if (action.includes('Projektplaner')) {
            const projectBtn = document.getElementById('openProjectModal');
            if (projectBtn) projectBtn.click();
        } else if (action.includes('anrufen') || action.includes('Kontakt')) {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        } else if (action.includes('Termin')) {
            const appointmentBtn = document.getElementById('openAppointmentModal');
            if (appointmentBtn) appointmentBtn.click();
        } else if (action.includes('Service-Details')) {
            document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
        } else if (action.includes('Projektbeispiele')) {
            document.getElementById('projekte').scrollIntoView({ behavior: 'smooth' });
        }
        
        this.addMessage(`✅ Perfekt! Ich leite Sie weiter zu: ${action}`, 'system');
    }
    
    sendPersonalizedWelcome() {
        const hour = new Date().getHours();
        let greeting = '';
        
        if (hour < 12) {
            greeting = '🌅 Guten Morgen!';
        } else if (hour < 17) {
            greeting = '☀️ Guten Tag!';
        } else {
            greeting = '🌆 Guten Abend!';
        }
        
        let welcomeMessage = '';
        
        if (this.userContext.isReturning) {
            welcomeMessage = `${greeting} Schön, Sie wieder bei Elektro Eber zu sehen! 👋\n\n🤖 Ich bin Ihr **ElektroBot** und helfe Ihnen gerne bei allen Fragen rund um Elektroinstallationen, Smart Home und mehr!\n\n💡 **Womit kann ich Ihnen heute helfen?**`;
        } else {
            welcomeMessage = `${greeting} Herzlich willkommen bei **Elektro Eber**! 👋\n\n🤖 Ich bin Ihr **ElektroBot** und unterstütze Sie bei allen Elektro-Fragen:\n\n⚡ Kostenvoranschläge\n🏠 Smart Home Beratung\n🔧 Technische Fragen\n📅 Terminvereinbarung\n🚨 Notdienst-Infos\n\n💬 **Einfach losschreiben - ich helfe gerne!**`;
        }
        
        setTimeout(() => {
            this.addMessage(welcomeMessage);
        }, 800);
    }
    
    showContextualNotification() {
        const section = this.userContext.visitedSections[this.userContext.visitedSections.length - 1];
        let notificationText = 'Fragen? 💬';
        
        if (section === 'services') {
            notificationText = 'Fragen zu Services? 🔧';
        } else if (section === 'projekte') {
            notificationText = 'Projektberatung? 🏗️';
        } else if (section === 'team') {
            notificationText = 'Team kennenlernen? 👥';
        }
        
        this.notification.textContent = notificationText;
        this.notification.classList.remove('simple');
        this.notification.style.display = 'flex';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (this.notification.style.display === 'flex') {
                this.notification.style.display = 'none';
            }
        }, 5000);
    }
    
    hasShownInitialGreeting() {
        return localStorage.getItem('elektro-eber-chat-greeted') === 'true';
    }
    
    handleTyping() {
        // Show that user is typing (could be enhanced with indicators)
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            // User stopped typing - could trigger suggestions
        }, 2000);
    }
    
    addMessage(text, sender = 'agent', type = 'normal') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message ${type === 'system' ? 'system-message' : ''}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        if (sender === 'user') {
            avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
        } else if (type === 'system') {
            avatarDiv.innerHTML = '<i class="fas fa-cog"></i>';
        } else {
            avatarDiv.innerHTML = '<div class="elektro-bot-avatar">⚡</div>';
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        
        // Enhanced markdown support
        text = this.processMarkdown(text);
        textDiv.innerHTML = text;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = new Date().toLocaleTimeString('de-DE', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        contentDiv.appendChild(textDiv);
        contentDiv.appendChild(timeSpan);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Animate message entrance
        setTimeout(() => {
            messageDiv.classList.add('animate-in');
        }, 100);
    }
    
    processMarkdown(text) {
        // Simple markdown processing
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
        text = text.replace(/\n/g, '<br>'); // Line breaks
        text = text.replace(/(\d{2}:\d{2})/g, '<span class="time-highlight">$1</span>'); // Time highlighting
        
        return text;
    }
    
    // ====== MULTI-LANGUAGE SUPPORT ======
    
    detectUserLanguage() {
        // Auto-detect based on browser language
        const browserLang = navigator.language || navigator.userLanguage;
        
        if (browserLang.startsWith('en')) {
            return 'en';
        } else if (browserLang.startsWith('de')) {
            return 'de';
        }
        
        // Default to German (local business)
        return 'de';
    }
    
    setupMultiLanguageResponses() {
        this.languageData = {
            de: {
                botName: 'ElektroBot',
                greetings: {
                    morning: '🌅 Guten Morgen!',
                    day: '☀️ Guten Tag!',
                    evening: '🌆 Guten Abend!',
                    welcome_new: 'Herzlich willkommen bei **Elektro Eber**! 👋',
                    welcome_returning: 'Schön, Sie wieder bei Elektro Eber zu sehen! 👋'
                },
                intents: {
                    price_inquiry: {
                        keywords: ['preis', 'kosten', 'kostet', 'teuer', 'günstig', 'angebot', 'kostenvoranschlag'],
                        responses: [
                            '💰 **Preise für Elektroarbeiten:**\n\n🏠 **Wohnbau:** ab 2.500€\n🏢 **Gewerbe:** ab 3.500€\n⚡ **Smart Home:** ab 1.200€\n🔧 **Reparaturen:** ab 80€',
                            '📊 **Transparent kalkuliert:** Nutzen Sie unseren interaktiven **Projektplaner** für eine sofortige Einschätzung!',
                            '💡 **Kostenbeispiele:** Basierend auf 247+ Projekten kann ich Ihnen realistische Preise nennen. Was für Arbeiten planen Sie konkret?'
                        ]
                    },
                    emergency: {
                        keywords: ['notfall', 'problem', 'defekt', 'ausgefallen', 'kaputt', 'dringend'],
                        responses: [
                            '🚨 **ELEKTRO-NOTFALL** 🚨\n\n📞 **Sofort anrufen: +49 (0) 123 456 789**\n\n⚠️ **Sicherheitscheck:**\n• Hauptschalter ausschalten\n• Gefahrenbereich verlassen\n• Bei Brandgefahr: 112\n\n⏰ **Wir kommen in 30-60 Min!**',
                            '⚡ **24h-Notdienst:** Bei Elektroproblemen sind wir rund um die Uhr für Sie da!\n\n📞 **Hotline: +49 (0) 123 456 789**\n⏰ **Durchschnittliche Ankunftszeit: 45 Min**'
                        ]
                    }
                },
                suggestions: {
                    price_inquiry: ['📋 Projektplaner nutzen', '📞 Kostenlose Beratung', '📧 Angebot anfordern'],
                    emergency: ['📞 Jetzt anrufen', '⚡ Notdienst-Infos', '🛡️ Sicherheitstipps']
                },
                systemMessages: {
                    redirect: '✅ Perfekt! Ich leite Sie weiter zu:',
                    processing: 'Expertenantwort wird erstellt...',
                    analyzing: 'Analysiere Ihre Anfrage...'
                }
            },
            en: {
                botName: 'ElektroBot',
                greetings: {
                    morning: '🌅 Good morning!',
                    day: '☀️ Good day!',
                    evening: '🌆 Good evening!',
                    welcome_new: 'Welcome to **Elektro Eber**! 👋',
                    welcome_returning: 'Great to see you back at Elektro Eber! 👋'
                },
                intents: {
                    price_inquiry: {
                        keywords: ['price', 'cost', 'costs', 'expensive', 'cheap', 'quote', 'estimate'],
                        responses: [
                            '💰 **Electrical Work Prices:**\n\n🏠 **Residential:** from €2,500\n🏢 **Commercial:** from €3,500\n⚡ **Smart Home:** from €1,200\n🔧 **Repairs:** from €80',
                            '📊 **Transparent pricing:** Use our interactive **project planner** for immediate estimates!',
                            '💡 **Price examples:** Based on 247+ projects, I can give you realistic prices. What work are you planning?'
                        ]
                    },
                    emergency: {
                        keywords: ['emergency', 'problem', 'broken', 'failed', 'urgent', 'help'],
                        responses: [
                            '🚨 **ELECTRICAL EMERGENCY** 🚨\n\n📞 **Call immediately: +49 (0) 123 456 789**\n\n⚠️ **Safety check:**\n• Turn off main switch\n• Leave danger area\n• Fire emergency: 112\n\n⏰ **We arrive in 30-60 min!**',
                            '⚡ **24h Emergency Service:** Available around the clock for electrical problems!\n\n📞 **Hotline: +49 (0) 123 456 789**\n⏰ **Average arrival: 45 min**'
                        ]
                    }
                },
                suggestions: {
                    price_inquiry: ['📋 Use project planner', '📞 Free consultation', '📧 Request quote'],
                    emergency: ['📞 Call now', '⚡ Emergency info', '🛡️ Safety tips']
                },
                systemMessages: {
                    redirect: '✅ Perfect! Redirecting you to:',
                    processing: 'Creating expert response...',
                    analyzing: 'Analyzing your request...'
                }
            }
        };
    }
    
    detectLanguageFromMessage(message) {
        const lowercaseMessage = message.toLowerCase();
        
        // English indicators
        const englishWords = ['hello', 'hi', 'help', 'please', 'thank', 'price', 'cost', 'what', 'how', 'emergency', 'electrical'];
        const germanWords = ['hallo', 'hilfe', 'bitte', 'danke', 'preis', 'kosten', 'was', 'wie', 'notfall', 'elektro'];
        
        const englishMatches = englishWords.filter(word => lowercaseMessage.includes(word)).length;
        const germanMatches = germanWords.filter(word => lowercaseMessage.includes(word)).length;
        
        if (englishMatches > germanMatches && englishMatches > 0) {
            return 'en';
        } else if (germanMatches > 0) {
            return 'de';
        }
        
        return this.userContext.language; // Keep current language
    }
    
    switchLanguage(newLanguage) {
        if (['de', 'en'].includes(newLanguage) && newLanguage !== this.userContext.language) {
            this.userContext.language = newLanguage;
            
            const switchMessage = newLanguage === 'en' ? 
                '🌍 **Language switched to English!** I\'m here to help with all your electrical needs!' :
                '🌍 **Sprache auf Deutsch umgestellt!** Ich helfe gerne bei allen Elektro-Fragen!';
                
            this.addMessage(switchMessage, 'system');
        }
    }
    
    // ====== ERWEITERTE CHAT FEATURES ======
    
    setupAdvancedFeatures() {
        this.setupFileUpload();
        this.setupChatHistory();
        this.setupReadReceipts();
        this.setupTypingIndicators();
        this.addLanguageSwitcher();
        this.addChatExport();
    }
    
    setupFileUpload() {
        // Create file upload button
        const chatInputContainer = document.querySelector('.chat-input-container');
        if (!chatInputContainer) {
            console.log('Chat input container not found for file upload');
            return;
        }
        
        const fileUploadBtn = document.createElement('button');
        fileUploadBtn.className = 'chat-file-upload-btn';
        fileUploadBtn.innerHTML = '<i class="fas fa-paperclip"></i>';
        fileUploadBtn.title = 'Datei anhängen';
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,.pdf,.doc,.docx';
        fileInput.style.display = 'none';
        fileInput.id = 'chat-file-input';
        
        fileUploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        
        chatInputContainer.insertBefore(fileUploadBtn, chatInputContainer.firstChild);
        chatInputContainer.appendChild(fileInput);
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate file
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            this.addMessage('❌ Datei zu groß (max. 5MB). Bitte wählen Sie eine kleinere Datei.', 'system');
            return;
        }
        
        // Show file upload message
        const fileName = file.name;
        const fileSize = (file.size / 1024).toFixed(1) + ' KB';
        
        this.addMessage(`📎 **Datei hochgeladen:** ${fileName} (${fileSize})\n\n✅ Wir haben Ihre Datei erhalten und werden sie in der Beratung berücksichtigen. Unser Team wird sich mit detaillierteren Informationen bei Ihnen melden!`, 'user');
        
        // Store file info for later reference
        this.conversationHistory.push({
            type: 'file',
            fileName: fileName,
            fileSize: file.size,
            fileType: file.type,
            timestamp: Date.now()
        });
        
        // Auto-response for file upload
        setTimeout(() => {
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage('👍 **Perfekt!** Danke für die Datei. Das hilft uns sehr bei der Planung!\n\n💡 **Nächste Schritte:**\n• Unsere Experten analysieren Ihre Unterlagen\n• Wir erstellen einen maßgeschneiderten Vorschlag\n• Sie erhalten zeitnah eine detaillierte Rückmeldung\n\n📞 **Fragen?** Rufen Sie gerne an: +49 (0) 123 456 789');
            }, 1200);
        }, 800);
        
        // Clear input
        event.target.value = '';
    }
    
    setupChatHistory() {
        // Load previous conversations
        this.loadChatHistory();
        
        // Save conversations automatically
        window.addEventListener('beforeunload', () => {
            this.saveChatHistory();
        });
        
        // Auto-save every 30 seconds
        setInterval(() => {
            this.saveChatHistory();
        }, 30000);
    }
    
    loadChatHistory() {
        const savedHistory = localStorage.getItem('elektro-eber-chat-history');
        if (savedHistory) {
            try {
                const parsedHistory = JSON.parse(savedHistory);
                // Only load if from same session (within 24 hours)
                const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
                
                const recentHistory = parsedHistory.filter(entry => 
                    entry.timestamp > oneDayAgo
                );
                
                if (recentHistory.length > 0) {
                    this.conversationHistory = recentHistory;
                    this.restoreChatMessages();
                }
            } catch (e) {
                console.log('Fehler beim Laden des Chat-Verlaufs:', e);
            }
        }
    }
    
    saveChatHistory() {
        try {
            localStorage.setItem('elektro-eber-chat-history', JSON.stringify(this.conversationHistory));
        } catch (e) {
            console.log('Fehler beim Speichern des Chat-Verlaufs:', e);
        }
    }
    
    restoreChatMessages() {
        // Clear current messages
        this.messagesContainer.innerHTML = '';
        
        // Restore from history
        this.conversationHistory.forEach(entry => {
            if (entry.type === 'user' || entry.type === 'bot') {
                this.addMessage(entry.message, entry.type === 'user' ? 'user' : 'agent');
            } else if (entry.type === 'file') {
                this.addMessage(`📎 **Datei:** ${entry.fileName} (${(entry.fileSize / 1024).toFixed(1)} KB)`, 'user');
            }
        });
        
        // Show restoration message
        if (this.conversationHistory.length > 0) {
            this.addMessage('📚 **Chat-Verlauf wiederhergestellt!** Ihre vorherigen Nachrichten sind wieder da.', 'system');
        }
    }
    
    setupReadReceipts() {
        // Add read receipt to messages
        this.messageReadReceipts = true;
        
        // Mark bot messages as "read" after 2 seconds
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('agent-message')) {
                        setTimeout(() => {
                            this.addReadReceipt(node);
                        }, 2000);
                    }
                });
            });
        });
        
        observer.observe(this.messagesContainer, { childList: true });
    }
    
    addReadReceipt(messageElement) {
        if (messageElement.querySelector('.read-receipt')) return;
        
        const receipt = document.createElement('div');
        receipt.className = 'read-receipt';
        receipt.innerHTML = '✓✓ <span>gelesen</span>';
        
        const messageContent = messageElement.querySelector('.message-content');
        if (messageContent) {
            messageContent.appendChild(receipt);
        }
    }
    
    setupTypingIndicators() {
        let typingTimeout;
        
        this.chatInput.addEventListener('input', () => {
            if (!this.userIsTyping) {
                this.showUserTypingIndicator();
                this.userIsTyping = true;
            }
            
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                this.hideUserTypingIndicator();
                this.userIsTyping = false;
            }, 1000);
        });
    }
    
    showUserTypingIndicator() {
        // Could show to remote user - for now just internal tracking
        console.log('User is typing...');
    }
    
    hideUserTypingIndicator() {
        console.log('User stopped typing');
    }
    
    addLanguageSwitcher() {
        const chatHeader = document.querySelector('.chat-header');
        if (!chatHeader) return;
        
        const langSwitcher = document.createElement('div');
        langSwitcher.className = 'language-switcher';
        langSwitcher.innerHTML = `
            <button class="lang-btn ${this.userContext.language === 'de' ? 'active' : ''}" data-lang="de">🇩🇪 DE</button>
            <button class="lang-btn ${this.userContext.language === 'en' ? 'active' : ''}" data-lang="en">🇺🇸 EN</button>
        `;
        
        langSwitcher.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const newLang = btn.dataset.lang;
                if (newLang !== this.userContext.language) {
                    this.switchLanguage(newLang);
                    
                    // Update active state
                    langSwitcher.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });
        });
        
        chatHeader.appendChild(langSwitcher);
    }
    
    addChatExport() {
        const chatHeader = document.querySelector('.chat-header');
        if (!chatHeader) return;
        
        const exportBtn = document.createElement('button');
        exportBtn.className = 'chat-export-btn';
        exportBtn.innerHTML = '<i class="fas fa-download"></i>';
        exportBtn.title = 'Chat exportieren';
        
        exportBtn.addEventListener('click', () => {
            this.exportChatHistory();
        });
        
        chatHeader.appendChild(exportBtn);
    }
    
    exportChatHistory() {
        const chatData = {
            timestamp: new Date().toISOString(),
            userContext: this.userContext,
            conversation: this.conversationHistory.map(entry => ({
                type: entry.type,
                message: entry.message,
                timestamp: new Date(entry.timestamp).toLocaleString('de-DE')
            }))
        };
        
        const dataStr = JSON.stringify(chatData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `elektro-eber-chat-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.addMessage('📥 **Chat exportiert!** Die Datei wurde heruntergeladen und kann für Ihre Unterlagen gespeichert werden.', 'system');
    }
    
    // Enhanced welcome message with language detection
    sendPersonalizedWelcome() {
        const hour = new Date().getHours();
        const lang = this.userContext.language;
        const langData = this.languageData[lang];
        
        let greeting = '';
        
        if (hour < 12) {
            greeting = langData.greetings.morning;
        } else if (hour < 17) {
            greeting = langData.greetings.day;
        } else {
            greeting = langData.greetings.evening;
        }
        
        let welcomeMessage = '';
        
        if (this.userContext.isReturning) {
            welcomeMessage = `${greeting} ${langData.greetings.welcome_returning}\n\n🤖 Ich bin Ihr **${langData.botName}** und helfe Ihnen gerne bei allen Fragen rund um Elektroinstallationen, Smart Home und mehr!`;
        } else {
            welcomeMessage = lang === 'en' ? 
                `${greeting} ${langData.greetings.welcome_new}\n\n🤖 I'm your **${langData.botName}** and I'm here to help with all your electrical needs:\n\n⚡ Price estimates\n🏠 Smart Home consulting\n🔧 Technical questions\n📅 Appointments\n🚨 Emergency service\n\n💬 **Just start typing - I'm here to help!**` :
                `${greeting} ${langData.greetings.welcome_new}\n\n🤖 Ich bin Ihr **${langData.botName}** und unterstütze Sie bei allen Elektro-Fragen:\n\n⚡ Kostenvoranschläge\n🏠 Smart Home Beratung\n🔧 Technische Fragen\n📅 Terminvereinbarung\n🚨 Notdienst-Infos\n\n💬 **Einfach losschreiben - ich helfe gerne!**`;
        }
        
        setTimeout(() => {
            this.addMessage(welcomeMessage);
        }, 800);
        
        // Add helpful quick actions based on language
        setTimeout(() => {
            this.showQuickActions();
        }, 2000);
    }
    
    showQuickActions() {
        const lang = this.userContext.language;
        
        const quickActions = lang === 'en' ? [
            '💰 Get price estimate',
            '📅 Schedule appointment',
            '⚡ Emergency service',
            '🏠 Smart Home info'
        ] : [
            '💰 Kostenvoranschlag',
            '📅 Termin vereinbaren', 
            '⚡ Notdienst',
            '🏠 Smart Home Info'
        ];
        
        this.showFollowUpSuggestions(quickActions);
    }
    
    // ====== BOT PERSONALITY & BRANDING ======
    
    addPersonalityToResponse(response, intent, context) {
        // Add Elektro Eber personality traits
        response = this.addExpertiseSignature(response, intent);
        response = this.addFriendlyTone(response, context);
        response = this.addLocalTouch(response);
        
        return response;
    }
    
    addExpertiseSignature(response, intent) {
        const signatures = {
            'technical': [
                '\n\n⚡ **Dennis Eckert, Elektroinnungsmeister**',
                '\n\n🎖️ **Zertifizierte Elektro-Experten**',
                '\n\n🔧 **Über 247 Projekte Erfahrung**'
            ],
            'emergency': [
                '\n\n🛡️ **Elektro Eber - Ihr 24h Partner**',
                '\n\n⚡ **Schnell, sicher, zuverlässig**'
            ],
            'price_inquiry': [
                '\n\n💯 **Faire Preise, keine versteckten Kosten**',
                '\n\n📊 **Transparenz ist unser Standard**'
            ]
        };
        
        const intentSignatures = signatures[intent] || signatures['technical'];
        const signature = intentSignatures[Math.floor(Math.random() * intentSignatures.length)];
        
        return response + signature;
    }
    
    addFriendlyTone(response, context) {
        // Add encouraging phrases based on context
        if (context.mood === 'urgent') {
            return response + '\n\n💪 **Keine Sorge - wir lösen das schnell!**';
        }
        
        if (context.conversationLength > 3) {
            const encouragements = [
                '\n\n😊 **Toll, dass Sie so viele Fragen stellen!**',
                '\n\n👍 **Super, dass Sie sich so gründlich informieren!**',
                '\n\n🤝 **Gemeinsam finden wir die perfekte Lösung!**'
            ];
            return response + encouragements[Math.floor(Math.random() * encouragements.length)];
        }
        
        return response;
    }
    
    addLocalTouch(response) {
        // Add regional/local elements occasionally  
        if (Math.random() < 0.3) {
            const localTouches = [
                '\n\n🏠 **Ihr Elektro-Partner in Aichstetten**',
                '\n\n📍 **Ravensburg & Umgebung - wir sind in der Nähe!**',
                '\n\n🚗 **Kurze Anfahrtswege = faire Preise**'
            ];
            return response + localTouches[Math.floor(Math.random() * localTouches.length)];
        }
        
        return response;
    }
    
    generateExpertResponse(message, intent) {
        const lowercaseMessage = message.toLowerCase();
        
        // Smart Home expertise
        if (lowercaseMessage.includes('smart home') || lowercaseMessage.includes('hausautomation')) {
            return this.getSmartHomeExpertiseResponse();
        }
        
        // Solar/PV expertise
        if (lowercaseMessage.includes('solar') || lowercaseMessage.includes('photovoltaik')) {
            return this.getSolarExpertiseResponse();
        }
        
        // Industrial automation
        if (lowercaseMessage.includes('industrie') || lowercaseMessage.includes('automation') || lowercaseMessage.includes('sps')) {
            return this.getIndustrialExpertiseResponse();
        }
        
        // E-Mobility
        if (lowercaseMessage.includes('wallbox') || lowercaseMessage.includes('elektroauto') || lowercaseMessage.includes('ladestation')) {
            return this.getEMobilityExpertiseResponse();
        }
        
        return null; // No specific expertise response
    }
    
    getSmartHomeExpertiseResponse() {
        const responses = [
            '🏠✨ **Smart Home - unsere Spezialität!**\n\n🎖️ Als **KNX-Partner** installieren wir professionelle Gebäudeautomation:\n\n💡 **Intelligente Beleuchtung** - perfekt abgestimmt\n🌡️ **Heizungssteuerung** - bis zu 30% Energieeinsparung\n🔒 **Sicherheitstechnik** - Kameras, Alarmanlagen, Zutrittskontrolle\n📱 **App-Steuerung** - alles in einer Hand\n\n✨ **Dennis Eckert:** "Smart Home ist die Zukunft - wir bringen sie zu Ihnen nach Hause!"',
            
            '🤖 **Smart Home vom Profi!** \n\nUnsere **50+ Smart-Installationen** sprechen für sich:\n\n🔧 **KNX-Bus-System** - der Profi-Standard\n📡 **WLAN-Integration** - auch günstige Lösungen\n🎵 **Multimedia** - Musik in jedem Raum\n🌟 **Szenen-Steuerung** - "Zuhause", "Weg", "Nacht"\n\n💪 **Warum Elektro Eber?** Weil wir nicht nur verkaufen, sondern **verstehen** was Sie brauchen!'
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getSolarExpertiseResponse() {
        return '☀️⚡ **Photovoltaik - Ihr Weg zur Energieunabhängigkeit!**\n\n🏆 **80+ PV-Anlagen** erfolgreich installiert:\n\n⚡ **Komplettpaket:** Module, Wechselrichter, Montage, Netzanschluss\n🔋 **Batteriespeicher:** Maximale Eigennutzung Ihres Solarstroms\n📊 **Live-Monitoring:** Überwachen Sie Ihre Anlage per App\n💰 **Förderung:** Wir helfen bei Anträgen und Finanzierung\n\n🎯 **Dennis Eckert:** "Sonne gibt\'s gratis - wir sorgen dafür, dass Sie davon profitieren!"';
    }
    
    getIndustrialExpertiseResponse() {
        return '🏭⚙️ **Industrie 4.0 - Automatisierung auf höchstem Niveau!**\n\n🔧 **25+ Industrieanlagen** modernisiert:\n\n🤖 **SPS-Programmierung:** Siemens, Allen-Bradley, Schneider\n📊 **SCADA-Systeme:** Prozessvisualisierung und -überwachung\n🔌 **Schaltschrankbau:** Nach DIN-Normen gefertigt\n📡 **Industrie 4.0:** IoT-Integration, Predictive Maintenance\n\n💡 **Unser Vorteil:** Wir sprechen sowohl Technik als auch Betriebswirtschaft!';
    }
    
    getEMobilityExpertiseResponse() {
        return '🚗⚡ **E-Mobilität - die Zukunft fährt elektrisch!**\n\n🔌 **Wallbox-Spezialisten** mit Erfahrung:\n\n⚡ **11kW/22kW Ladestationen** - für jeden Bedarf\n🏠 **Hausanschluss-Check:** Ist Ihr Anschluss ausreichend?\n💰 **KfW-Förderung:** Bis zu 900€ Zuschuss möglich\n📱 **Smart Charging:** App-Steuerung, Lastmanagement\n🔒 **Sicherheit:** FI-Typ B, DC-Fehlerstromschutz\n\n⚡ **Fun Fact:** E-Autos fahren mit Solarstrom praktisch kostenlos!';
    }
    
    addHumorousTouch(response, context) {
        // Add appropriate humor occasionally
        if (this.botPersonality.humor && Math.random() < 0.2) {
            const humorousAdditions = [
                '\n\n⚡ **PS:** Wir bringen nicht nur Strom, sondern auch gute Laune mit! 😊',
                '\n\n💡 **Elektro-Witz:** Warum sind Elektriker immer gut drauf? Weil sie unter Spannung stehen! 😄',
                '\n\n🔌 **Garantiert:** Unsere Arbeit ist schockierend gut! ⚡',
                '\n\n😄 **Dennis sagt:** "Ohne Strom läuft nichts - außer unseren Kunden zum Nachbarn!" 🏃‍♂️'
            ];
            
            // Only add humor if the context is appropriate (not for emergencies)
            if (context.mood !== 'urgent') {
                return response + humorousAdditions[Math.floor(Math.random() * humorousAdditions.length)];
            }
        }
        
        return response;
    }
    
    generateBasicResponse(intent, context) {
        // Basic responses based on intent
        switch (intent) {
            case 'price_inquiry':
                return this.generatePriceResponse(context);
            case 'emergency':
                return this.generateEmergencyResponse(context);
            case 'appointment':
                return this.generateAppointmentResponse(context);
            case 'technical':
                return this.generateTechnicalResponse('', context);
            case 'company_info':
                return this.generateCompanyInfoResponse(context);
            default:
                return this.generateContextualResponse('', context);
        }
    }
    
    generateBrandedResponse(message, intent, context) {
        let response = '';
        
        // Try expert knowledge first
        const expertResponse = this.generateExpertResponse(message, intent);
        if (expertResponse) {
            response = expertResponse;
        } else {
            // Generate basic response based on intent
            response = this.generateBasicResponse(intent, context);
        }
        
        // Add personality layers
        response = this.addPersonalityToResponse(response, intent, context);
        response = this.addHumorousTouch(response, context);
        
        // Add call-to-action based on intent
        response = this.addCallToAction(response, intent);
        
        return response;
    }
    
    addCallToAction(response, intent) {
        const ctas = {
            'price_inquiry': '\n\n🎯 **Nächster Schritt:** Nutzen Sie unseren Projektplaner für eine sofortige Schätzung!',
            'technical': '\n\n📞 **Technische Beratung:** Rufen Sie an für detaillierte Fachberatung!',
            'emergency': '\n\n🚨 **Jetzt handeln:** Bei Notfällen sofort anrufen: +49 (0) 123 456 789',
            'appointment': '\n\n📅 **Termin vereinbaren:** Kostenloses Erstgespräch - wir kommen zu Ihnen!'
        };
        
        const cta = ctas[intent];
        return cta ? response + cta : response;
    }
    
    // Override the original generateIntelligentResponse to use branded version
    generateIntelligentResponse(userMessage) {
        const intent = this.detectIntent(userMessage);
        const context = this.buildResponseContext();
        
        // Detect language from message
        const detectedLang = this.detectLanguageFromMessage(userMessage);
        if (detectedLang !== this.userContext.language) {
            this.switchLanguage(detectedLang);
        }
        
        // Generate branded response with full personality
        let response = this.generateBrandedResponse(userMessage, intent, context);
        
        // Add personalization
        response = this.personalizeResponse(response, context);
        
        // Add to conversation history
        this.conversationHistory.push({
            type: 'bot',
            message: response,
            timestamp: Date.now(),
            intent: intent
        });
        
        this.addMessage(response);
        
        // Suggest follow-up actions (localized)
        setTimeout(() => {
            const suggestions = this.getLocalizedSuggestions(intent);
            this.suggestFollowUp(intent, context, suggestions);
        }, 2000);
        
        // Auto-save conversation
        this.saveChatHistory();
    }
    
    // Enhanced follow-up suggestions with localization
    suggestFollowUp(intent, context, customSuggestions = null) {
        const suggestions = customSuggestions || this.getLocalizedSuggestions(intent);
        this.showFollowUpSuggestions(suggestions);
    }
}

// Dark Mode Functionality
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
        this.updateToggleButtons();
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeToggleHeader = document.getElementById('theme-toggle-header');

        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        if (themeToggleHeader) {
            themeToggleHeader.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.updateToggleButtons();
        localStorage.setItem('theme', this.currentTheme);
        console.log('Theme switched to:', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    updateToggleButtons() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeToggleHeader = document.getElementById('theme-toggle-header');

        if (this.currentTheme === 'dark') {
            // Dark Mode ist aktiv
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
            }
            if (themeToggleHeader) {
                themeToggleHeader.innerHTML = '<i class="fas fa-sun"></i>';
            }
        } else {
            // Light Mode ist aktiv
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
            }
            if (themeToggleHeader) {
                themeToggleHeader.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
    }
}

// Simple Appointment Booking System
class SimpleAppointmentSystem {
    constructor() {
        this.modal = document.getElementById('appointmentModal');
        this.form = document.getElementById('appointmentForm');
        this.init();
    }
    
    init() {
        // Mindestdatum auf heute setzen
        this.setMinDate();
        
        // Modal öffnen/schließen
        const openButtons = document.querySelectorAll('#openAppointmentModal, #openAppointmentModalService, #openAppointmentModalCert');
        const closeButton = document.getElementById('closeAppointmentModal');
        
        openButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        });
        
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeModal());
        }
        
        // Modal schließen bei Klick außerhalb
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.closeModal();
            });
        }
        
        // Formular abschicken
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitAppointment();
            });
        }
    }
    
    openModal() {
        if (this.modal) {
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    submitAppointment() {
        // Formular-Daten sammeln
        const formData = {
            name: document.getElementById('bookingName').value,
            phone: document.getElementById('bookingPhone').value,
            email: document.getElementById('bookingEmail').value,
            preferredDate: document.getElementById('bookingPreferredDate').value,
            preferredTime: document.getElementById('bookingPreferredTime').value,
            service: document.getElementById('bookingService').value,
            message: document.getElementById('bookingMessage').value,
            timestamp: new Date().toLocaleString('de-DE'),
            id: 'EB-' + Date.now()
        };
        
        // Validierung
        if (!formData.name || !formData.phone || !formData.email) {
            this.showNotification('Bitte füllen Sie alle Pflichtfelder aus!', 'error');
            return;
        }
        
        // E-Mail Validierung
        if (!this.isValidEmail(formData.email)) {
            this.showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein!', 'error');
            return;
        }
        
        // Datenschutz Check
        const privacy = document.getElementById('bookingPrivacy');
        if (!privacy.checked) {
            this.showNotification('Bitte stimmen Sie der Datenschutzerklärung zu!', 'error');
            return;
        }
        
        // Button loading state
        const submitBtn = document.getElementById('submitAppointment');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wird gesendet...';
        submitBtn.disabled = true;
        
        // Buchung speichern
        this.saveBooking(formData);
        
        // Erfolgsmeldung mit schöner Benachrichtigung
        setTimeout(() => {
            this.showAppointmentSuccessNotification(formData);
            this.form.reset();
            
            // Button zurücksetzen
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1000);
    }
    
    saveBooking(formData) {
        // Datenstruktur für Admin Dashboard anpassen
        const bookingForDashboard = {
            id: formData.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            date: formData.preferredDate || new Date().toISOString().split('T')[0],
            time: formData.preferredTime === 'flexible' ? '10:00' : (formData.preferredTime || '10:00'),
            service: {
                name: this.getServiceDisplayName(formData.service),
                price: 'Kostenlose Erstberatung'
            },
            message: formData.message || '',
            status: 'pending',
            timestamp: formData.timestamp,
            type: 'appointment'
        };
        
        // In LocalStorage für Admin Dashboard speichern
        const existingBookings = JSON.parse(localStorage.getItem('elektro-eber-bookings') || '[]');
        existingBookings.push(bookingForDashboard);
        localStorage.setItem('elektro-eber-bookings', JSON.stringify(existingBookings));
        
        // Auch in der alten Struktur speichern (Backup)
        const simpleBookings = JSON.parse(localStorage.getItem('simple-appointments') || '[]');
        simpleBookings.push(formData);
        localStorage.setItem('simple-appointments', JSON.stringify(simpleBookings));
        
        console.log('📅 Termin gespeichert:', bookingForDashboard);
    }
    
    getServiceDisplayName(service) {
        const serviceNames = {
            'general': 'Allgemeine Elektroarbeiten',
            'renovation': 'Renovierung/Sanierung',
            'smart-home': 'Smart Home & KNX',
            'solar': 'Photovoltaik & Solartechnik',
            'emergency': 'Notfall/Reparatur',
            'planning': 'Neuplanung/Neubau'
        };
        return serviceNames[service] || 'Beratungsgespräch';
    }
    
    setMinDate() {
        const dateInput = document.getElementById('bookingPreferredDate');
        if (dateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.min = tomorrow.toISOString().split('T')[0];
        }
    }
    
    sendBookingEmail(formData) {
        // E-Mail Daten aufbereiten
        const subject = encodeURIComponent(`🔌 TERMINANFRAGE - ${formData.id}`);
        const body = encodeURIComponent(`
NEUE TERMINANFRAGE - ELEKTRO EBER
=================================

📋 TERMINDETAILS:
• Anfrage-ID: ${formData.id}
• Name: ${formData.name}
• Telefon: ${formData.phone}
• E-Mail: ${formData.email}
• Wunschdatum: ${formData.preferredDate || 'Nicht angegeben'}
• Wunschzeit: ${formData.preferredTime === 'flexible' ? 'Flexibel' : (formData.preferredTime || 'Flexibel')}
• Beratungsthema: ${this.getServiceDisplayName(formData.service)}

💬 NACHRICHT:
${formData.message || 'Keine weitere Nachricht'}

⏰ Anfrage erstellt: ${formData.timestamp}

WICHTIG: Bitte kontaktieren Sie den Kunden innerhalb von 24 Stunden!

📊 Admin Dashboard: Öffnen Sie das Admin Dashboard um weitere Details zu sehen und den Termin zu bestätigen.
        `);
        
        // Mailto Link öffnen
        const mailtoLink = `mailto:dennis@elektro-eber.de?subject=${subject}&body=${body}`;
        window.open(mailtoLink);
        
        console.log('📧 E-Mail geöffnet');
    }
    
    showSuccessMessage(formData) {
        const modalContent = document.querySelector('.simple-appointment-modal');
        if (!modalContent) return;
        
        modalContent.innerHTML = `
            <div class="success-message">
                <div class="success-header">
                    <i class="fas fa-check-circle success-icon"></i>
                    <h2>Terminanfrage versendet!</h2>
                    <p>Vielen Dank für Ihre Anfrage</p>
                </div>
                
                <div class="success-details">
                    <div class="detail-row">
                        <i class="fas fa-user"></i>
                        <span><strong>${formData.name}</strong></span>
                    </div>
                    <div class="detail-row">
                        <i class="fas fa-envelope"></i>
                        <span>${formData.email}</span>
                    </div>
                    <div class="detail-row">
                        <i class="fas fa-phone"></i>
                        <span>${formData.phone}</span>
                    </div>
                    <div class="detail-row">
                        <i class="fas fa-hashtag"></i>
                        <span>Anfrage-Nr: ${formData.id}</span>
                    </div>
                </div>
                
                <div class="success-info">
                    <h3>📞 Wie geht es weiter?</h3>
                    <ul>
                        <li><strong>Schnelle Antwort:</strong> Wir melden uns innerhalb von 24 Stunden</li>
                        <li><strong>Kostenlose Beratung:</strong> Unverbindliches Erstgespräch</li>
                        <li><strong>Flexible Termine:</strong> Auch abends und am Wochenende</li>
                    </ul>
                </div>
                
                <button class="btn-primary-large" onclick="location.reload()">
                    <i class="fas fa-home"></i>
                    Zur Startseite
                </button>
            </div>
        `;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 9999;
            font-size: 0.9rem;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Admin Funktionen
    getAllAppointments() {
        const appointments = JSON.parse(localStorage.getItem('simple-appointments') || '[]');
        console.table(appointments);
        return appointments;
    }
    
    clearAllAppointments() {
        localStorage.removeItem('simple-appointments');
        console.log('Alle Terminanfragen gelöscht');
    }
}

// DSGVO Cookie Management System
class CookieManager {
    constructor() {
        this.cookieSettings = {
            necessary: true, // Always required
            functional: false,
            analytical: false,
            marketing: false
        };
        
        this.cookieName = 'elektro-eber-cookies';
        this.consentGiven = false;
        
        this.init();
    }
    
    init() {
        this.loadCookieSettings();
        this.bindEvents();
        this.checkCookieConsent();
    }
    
    loadCookieSettings() {
        const savedSettings = localStorage.getItem(this.cookieName);
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                this.cookieSettings = { ...this.cookieSettings, ...settings };
                this.consentGiven = true;
            } catch (e) {
                console.error('Error loading cookie settings:', e);
            }
        }
    }
    
    saveCookieSettings() {
        const settingsWithTimestamp = {
            ...this.cookieSettings,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        localStorage.setItem(this.cookieName, JSON.stringify(settingsWithTimestamp));
        this.consentGiven = true;
        
        // Apply cookie settings
        this.applyCookieSettings();
        
        // Hide banner
        this.hideCookieBanner();
        
        this.showNotification('Cookie-Einstellungen gespeichert! 🍪', 'success');
    }
    
    applyCookieSettings() {
        // Apply functional cookies
        if (this.cookieSettings.functional) {
            // Enable theme persistence, form data saving, etc.
            this.enableFunctionalCookies();
        } else {
            this.disableFunctionalCookies();
        }
        
        // Apply analytical cookies
        if (this.cookieSettings.analytical) {
            this.enableAnalyticalCookies();
        } else {
            this.disableAnalyticalCookies();
        }
        
        // Apply marketing cookies
        if (this.cookieSettings.marketing) {
            this.enableMarketingCookies();
        } else {
            this.disableMarketingCookies();
        }
    }
    
    enableFunctionalCookies() {
        console.log('✅ Funktionale Cookies aktiviert');
        // Enable theme persistence, form autosave, etc.
        document.body.classList.add('functional-cookies-enabled');
    }
    
    disableFunctionalCookies() {
        console.log('❌ Funktionale Cookies deaktiviert');
        document.body.classList.remove('functional-cookies-enabled');
    }
    
    enableAnalyticalCookies() {
        console.log('📊 Analytische Cookies aktiviert');
        // Initialize analytics (Google Analytics, etc.)
        // gtag('config', 'GA_TRACKING_ID');
    }
    
    disableAnalyticalCookies() {
        console.log('📊 Analytische Cookies deaktiviert');
        // Disable analytics
        // gtag('config', 'GA_TRACKING_ID', { 'anonymize_ip': true });
    }
    
    enableMarketingCookies() {
        console.log('📢 Marketing Cookies aktiviert');
        // Enable marketing tools, Facebook Pixel, etc.
    }
    
    disableMarketingCookies() {
        console.log('📢 Marketing Cookies deaktiviert');
        // Disable marketing tools
    }
    
    checkCookieConsent() {
        if (!this.consentGiven) {
            // Show cookie banner after short delay
            setTimeout(() => {
                this.showCookieBanner();
            }, 1000);
        } else {
            this.applyCookieSettings();
        }
    }
    
    showCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.add('show');
        }
    }
    
    hideCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('show');
        }
    }
    
    showCookieModal() {
        const modal = document.getElementById('cookieModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);
            document.body.style.overflow = 'hidden';
            
            // Load current settings into modal
            this.updateModalSettings();
        }
    }
    
    hideCookieModal() {
        const modal = document.getElementById('cookieModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }
    
    updateModalSettings() {
        // Update toggle switches in modal
        const functionalToggle = document.getElementById('functionalCookies');
        const analyticalToggle = document.getElementById('analyticalCookies');
        const marketingToggle = document.getElementById('marketingCookies');
        
        if (functionalToggle) functionalToggle.checked = this.cookieSettings.functional;
        if (analyticalToggle) analyticalToggle.checked = this.cookieSettings.analytical;
        if (marketingToggle) marketingToggle.checked = this.cookieSettings.marketing;
    }
    
    getModalSettings() {
        // Get settings from modal toggles
        const functionalToggle = document.getElementById('functionalCookies');
        const analyticalToggle = document.getElementById('analyticalCookies');
        const marketingToggle = document.getElementById('marketingCookies');
        
        return {
            necessary: true, // Always true
            functional: functionalToggle ? functionalToggle.checked : false,
            analytical: analyticalToggle ? analyticalToggle.checked : false,
            marketing: marketingToggle ? marketingToggle.checked : false
        };
    }
    
    acceptAllCookies() {
        this.cookieSettings = {
            necessary: true,
            functional: true,
            analytical: true,
            marketing: true
        };
        
        this.saveCookieSettings();
        this.hideCookieModal();
    }
    
    declineAllCookies() {
        this.cookieSettings = {
            necessary: true,
            functional: false,
            analytical: false,
            marketing: false
        };
        
        this.saveCookieSettings();
    }
    
    saveCustomSettings() {
        this.cookieSettings = this.getModalSettings();
        this.saveCookieSettings();
        this.hideCookieModal();
    }
    
    bindEvents() {
        // Banner buttons
        const acceptAllBtn = document.getElementById('cookieAcceptAll');
        const declineBtn = document.getElementById('cookieDecline');
        const settingsBtn = document.getElementById('cookieSettings');
        
        if (acceptAllBtn) {
            acceptAllBtn.addEventListener('click', () => this.acceptAllCookies());
        }
        
        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.declineAllCookies());
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showCookieModal());
        }
        
        // Modal buttons
        const closeModalBtn = document.getElementById('closeCookieModal');
        const saveSettingsBtn = document.getElementById('saveSettings');
        const acceptAllModalBtn = document.getElementById('acceptAllModal');
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.hideCookieModal());
        }
        
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveCustomSettings());
        }
        
        if (acceptAllModalBtn) {
            acceptAllModalBtn.addEventListener('click', () => this.acceptAllCookies());
        }
        
        // Close modal on background click
        const modal = document.getElementById('cookieModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideCookieModal();
                }
            });
        }
        
        // Privacy link
        const privacyLink = document.querySelector('.privacy-link');
        if (privacyLink) {
            privacyLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPrivacyInfo();
            });
        }
    }
    
    showPrivacyInfo() {
        this.showNotification('Datenschutz-Seite wird bald verfügbar sein! 📋', 'info');
        // Here you would navigate to privacy policy page
        // window.location.href = '/datenschutz';
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'cookie-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10002;
            font-size: 0.9rem;
            max-width: 350px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }
    
    // Admin Functions for debugging
    getCookieSettings() {
        return this.cookieSettings;
    }
    
    resetCookieConsent() {
        localStorage.removeItem(this.cookieName);
        this.consentGiven = false;
        this.cookieSettings = {
            necessary: true,
            functional: false,
            analytical: false,
            marketing: false
        };
        this.showNotification('Cookie-Einstellungen zurückgesetzt! 🔄', 'info');
        setTimeout(() => location.reload(), 1500);
    }
}

// Enhanced Micro-Interactions Manager
class MicroInteractionsManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupRippleEffects();
        this.setupCardHoverEffects();
        this.setupButtonAnimations();
        this.setupScrollAnimations();
        this.setupParallaxEffects();
    }
    
    setupRippleEffects() {
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('button, .btn-primary, .btn-primary-large');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }
    
    createRipple(event, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Add ripple animation keyframes if not exists
        if (!document.querySelector('#ripple-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation-styles';
            style.textContent = `
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.team-card, .project-card, .service-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.animateCardEntry(card, e);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardExit(card);
            });
            
            card.addEventListener('mousemove', (e) => {
                this.handleCardMouseMove(card, e);
            });
        });
    }
    
    animateCardEntry(card, event) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Create entry animation based on mouse position
        const glowElement = document.createElement('div');
        glowElement.className = 'card-glow';
        glowElement.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: glow-expand 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 1;
        `;
        
        card.style.position = 'relative';
        card.appendChild(glowElement);
        
        // Add glow animation if not exists
        if (!document.querySelector('#glow-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'glow-animation-styles';
            style.textContent = `
                @keyframes glow-expand {
                    to {
                        transform: translate(-50%, -50%) scale(3);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            glowElement.remove();
        }, 600);
    }
    
    animateCardExit(card) {
        // Reset any transforms
        card.style.transform = '';
    }
    
    handleCardMouseMove(card, event) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    }
    
    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.filter-btn, .tab-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.animateButtonClick(button);
            });
        });
    }
    
    animateButtonClick(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Add success pulse
        button.classList.add('pulse-success');
        setTimeout(() => {
            button.classList.remove('pulse-success');
        }, 600);
        
        // Add pulse success animation if not exists
        if (!document.querySelector('#pulse-success-styles')) {
            const style = document.createElement('style');
            style.id = 'pulse-success-styles';
            style.textContent = `
                .pulse-success {
                    animation: pulse-success 0.6s ease;
                }
                
                @keyframes pulse-success {
                    0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Stagger animations for multiple elements
                    const siblings = entry.target.parentElement.children;
                    Array.from(siblings).forEach((sibling, index) => {
                        if (sibling.classList.contains('team-card') || sibling.classList.contains('project-card')) {
                            setTimeout(() => {
                                sibling.classList.add('animate-in');
                            }, index * 100);
                        }
                    });
                }
            });
        }, observerOptions);
        
        // Observe cards for scroll animations
        const animateElements = document.querySelectorAll('.team-card, .project-card, .service-zone');
        animateElements.forEach(el => observer.observe(el));
        
        // Add scroll animation styles
        if (!document.querySelector('#scroll-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'scroll-animation-styles';
            style.textContent = `
                .team-card,
                .project-card,
                .service-zone {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .animate-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-content, .section-intro');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }
}

// Enhanced Team Card Interactions
class TeamCardEnhancer {
    constructor() {
        this.teamCards = document.querySelectorAll('.team-card');
        this.init();
    }
    
    init() {
        this.setupHoverEffects();
        this.setupSkillAnimations();
        this.setupStatAnimations();
    }
    
    setupHoverEffects() {
        this.teamCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetCardAnimation(card);
            });
        });
    }
    
    animateCardHover(card) {
        // Animate avatar
        const avatar = card.querySelector('.member-avatar');
        if (avatar) {
            avatar.style.transform = 'scale(1.1) rotate(5deg)';
        }
        
        // Animate skills with stagger
        const skills = card.querySelectorAll('.skill');
        skills.forEach((skill, index) => {
            setTimeout(() => {
                skill.style.transform = 'scale(1.05) translateY(-2px)';
            }, index * 50);
        });
        
        // Pulse stats
        const stats = card.querySelectorAll('.stat-num');
        stats.forEach(stat => {
            stat.style.animation = 'pulse-glow 1s ease infinite alternate';
        });
        
        // Add glow animation if not exists
        if (!document.querySelector('#pulse-glow-styles')) {
            const style = document.createElement('style');
            style.id = 'pulse-glow-styles';
            style.textContent = `
                @keyframes pulse-glow {
                    0% { text-shadow: 0 0 5px rgba(245, 158, 11, 0.5); }
                    100% { text-shadow: 0 0 15px rgba(245, 158, 11, 0.8); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    resetCardAnimation(card) {
        const avatar = card.querySelector('.member-avatar');
        if (avatar) {
            avatar.style.transform = '';
        }
        
        const skills = card.querySelectorAll('.skill');
        skills.forEach(skill => {
            skill.style.transform = '';
        });
        
        const stats = card.querySelectorAll('.stat-num');
        stats.forEach(stat => {
            stat.style.animation = '';
        });
    }
    
    setupSkillAnimations() {
        // Add hover effects to individual skills
        const skills = document.querySelectorAll('.skill');
        skills.forEach(skill => {
            skill.addEventListener('mouseenter', () => {
                skill.style.transform = 'scale(1.1) rotate(2deg)';
                skill.style.boxShadow = '0 5px 15px rgba(245, 158, 11, 0.3)';
            });
            
            skill.addEventListener('mouseleave', () => {
                skill.style.transform = '';
                skill.style.boxShadow = '';
            });
        });
    }
    
    setupStatAnimations() {
        // Animate numbers on scroll
        const statNumbers = document.querySelectorAll('.stat-num, .exp-number');
        
        const animateNumber = (element) => {
            const target = parseInt(element.getAttribute('data-target')) || parseInt(element.textContent);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 16);
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateNumber(entry.target);
                }
            });
        });
        
        statNumbers.forEach(num => observer.observe(num));
    }
}

// Initialize Enhanced Interactions on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize micro-interactions
    const microInteractions = new MicroInteractionsManager();
    window.microInteractions = microInteractions;
    
    // Initialize team card enhancer
    const teamEnhancer = new TeamCardEnhancer();
    window.teamEnhancer = teamEnhancer;
    
    console.log('✨ Enhanced micro-interactions loaded successfully!');
    
    // Initialize advanced scroll effects
    initAdvancedScrollEffects();
});

// Advanced Scroll Effects System
function initAdvancedScrollEffects() {
    // Parallax scrolling for background elements
    const parallaxElements = document.querySelectorAll('.hero-visual-new, .circuit-board');
    
    // Add scroll-based animations
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.style.transform = `translateY(${rate}px)`;
            }
        });
        
        // Update scroll progress
        updateScrollProgress();
    });
    
    // Scroll progress indicator
    function updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        let progressBar = document.querySelector('.scroll-progress-bar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress-bar';
            document.body.appendChild(progressBar);
        }
        
        progressBar.style.width = scrolled + '%';
    }
    
    // Smooth reveal animations for specific elements
    const revealElements = document.querySelectorAll('h2, .service-card, .project-item, .team-card');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        element.classList.add('reveal-element');
        revealObserver.observe(element);
    });
    
    // Auto-scroll to sections with keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            const sections = ['home', 'stats', 'services', 'team', 'projects', 'certifications', 'faq', 'contact'];
            const currentSection = getCurrentSection();
            const currentIndex = sections.indexOf(currentSection);
            
            if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                e.preventDefault();
                scrollToSection(sections[currentIndex + 1]);
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                e.preventDefault();
                scrollToSection(sections[currentIndex - 1]);
            }
        }
    });
    
    function getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        let current = 'home';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom > 100) {
                current = section.id;
            }
        });
        
        return current;
    }
    
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section && smoothScroll) {
            smoothScroll.smoothScrollTo(section);
        }
    }
    
    console.log('🎨 Advanced scroll effects initialized successfully!');
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===============================================
// IMAGE OPTIMIZATION AND WEBP SUPPORT
// ===============================================

// WebP Support Detection
function supportsWebP() {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = function () {
            resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

// Image Optimization Class
class ImageOptimizer {
    constructor() {
        this.webpSupported = false;
        this.lazyLoadObserver = null;
        this.init();
    }

    async init() {
        // Check WebP support
        this.webpSupported = await supportsWebP();
        console.log('WebP Support:', this.webpSupported ? '✅ Supported' : '❌ Not supported');
        
        // Initialize lazy loading
        this.initLazyLoading();
        
        // Optimize existing images
        this.optimizeImages();
        
        // Add responsive image functionality
        this.addResponsiveImages();
    }

    initLazyLoading() {
        // Create intersection observer for lazy loading
        if ('IntersectionObserver' in window) {
            this.lazyLoadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.lazyLoadObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all lazy images
            document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
                this.lazyLoadObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadAllImages();
        }
    }

    loadImage(img) {
        // Add loading animation
        img.classList.add('image-loading');
        
        // Create optimized image source
        const originalSrc = img.dataset.src || img.src;
        const optimizedSrc = this.getOptimizedImageSrc(originalSrc);
        
        // Preload image
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // Update src with optimized version
            img.src = optimizedSrc;
            img.classList.remove('image-loading');
            img.classList.add('image-loaded');
            
            // Remove data-src to prevent re-loading
            if (img.dataset.src) {
                delete img.dataset.src;
            }
        };
        
        imageLoader.onerror = () => {
            // Fallback to original src if optimized version fails
            img.src = originalSrc;
            img.classList.remove('image-loading');
            img.classList.add('image-error');
        };
        
        imageLoader.src = optimizedSrc;
    }

    getOptimizedImageSrc(originalSrc) {
        // Don't optimize external images or already optimized images
        if (originalSrc.includes('http') && !originalSrc.includes(window.location.hostname)) {
            return originalSrc;
        }
        
        // If WebP is supported, try to use WebP version
        if (this.webpSupported && !originalSrc.includes('.webp')) {
            const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            return webpSrc;
        }
        
        return originalSrc;
    }

    optimizeImages() {
        // Add alt texts to images without them
        document.querySelectorAll('img:not([alt])').forEach(img => {
            const altText = this.generateAltText(img);
            img.setAttribute('alt', altText);
        });
        
        // Add loading attribute to images
        document.querySelectorAll('img:not([loading])').forEach(img => {
            // First few images should load immediately, others lazy
            const isAboveFold = img.getBoundingClientRect().top < window.innerHeight;
            img.setAttribute('loading', isAboveFold ? 'eager' : 'lazy');
        });
    }

    generateAltText(img) {
        // Try to get alt text from various sources
        const fileName = img.src.split('/').pop().split('.')[0];
        const className = img.className;
        const parentText = img.closest('section')?.querySelector('h2, h3')?.textContent;
        
        // Generate meaningful alt text based on context
        if (className.includes('logo')) {
            return 'Elektro Eber Logo';
        } else if (className.includes('team') || fileName.includes('team')) {
            return 'Team member of Elektro Eber';
        } else if (className.includes('project') || fileName.includes('project')) {
            return 'Elektroinstallation project by Elektro Eber';
        } else if (className.includes('service') || fileName.includes('service')) {
            return 'Electrical service offered by Elektro Eber';
        } else if (parentText) {
            return `Image related to ${parentText}`;
        } else {
            return 'Elektro Eber - Professional electrical installations';
        }
    }

    addResponsiveImages() {
        // Add responsive image functionality
        document.querySelectorAll('img:not([srcset])').forEach(img => {
            if (img.src && !img.src.includes('data:')) {
                const srcset = this.generateSrcSet(img.src);
                if (srcset) {
                    img.setAttribute('srcset', srcset);
                    img.setAttribute('sizes', this.generateSizes());
                }
            }
        });
    }

    generateSrcSet(originalSrc) {
        // Don't generate srcset for external images
        if (originalSrc.includes('http') && !originalSrc.includes(window.location.hostname)) {
            return null;
        }
        
        const baseSrc = originalSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '');
        const extension = this.webpSupported ? '.webp' : originalSrc.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
        
        // Generate different sizes
        const sizes = [
            { width: 320, suffix: '-320w' },
            { width: 480, suffix: '-480w' },
            { width: 768, suffix: '-768w' },
            { width: 1024, suffix: '-1024w' },
            { width: 1200, suffix: '-1200w' },
            { width: 1920, suffix: '-1920w' }
        ];
        
        return sizes.map(size => `${baseSrc}${size.suffix}${extension} ${size.width}w`).join(', ');
    }

    generateSizes() {
        return '(max-width: 320px) 280px, (max-width: 480px) 440px, (max-width: 768px) 720px, (max-width: 1024px) 960px, (max-width: 1200px) 1120px, 1200px';
    }

    loadAllImages() {
        // Fallback method for browsers without IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.loadImage(img);
        });
    }
}

// Preload Critical Images
class CriticalImageLoader {
    constructor() {
        this.criticalImages = [
            '/images/elektro-eber-logo.webp',
            '/images/hero-background.webp',
            '/images/team-photo.webp'
        ];
        this.preloadCriticalImages();
    }

    preloadCriticalImages() {
        this.criticalImages.forEach(imageSrc => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = imageSrc;
            
            // Add media query for responsive images
            if (imageSrc.includes('hero')) {
                link.media = '(min-width: 768px)';
            }
            
            document.head.appendChild(link);
        });
    }
}

// Image Performance Monitor
class ImagePerformanceMonitor {
    constructor() {
        this.imageStats = {
            loaded: 0,
            failed: 0,
            totalSize: 0,
            loadTime: 0
        };
        this.monitorImages();
    }

    monitorImages() {
        // Monitor all images for performance metrics
        document.querySelectorAll('img').forEach(img => {
            const startTime = performance.now();
            
            img.addEventListener('load', () => {
                const loadTime = performance.now() - startTime;
                this.imageStats.loaded++;
                this.imageStats.loadTime += loadTime;
                
                // Calculate approximate file size (estimation)
                this.estimateImageSize(img);
                
                console.log(`✅ Image loaded: ${img.src} (${loadTime.toFixed(2)}ms)`);
            });
            
            img.addEventListener('error', () => {
                this.imageStats.failed++;
                console.warn(`❌ Image failed to load: ${img.src}`);
            });
        });
    }

    estimateImageSize(img) {
        // Rough estimation based on dimensions and format
        const area = img.naturalWidth * img.naturalHeight;
        const isWebP = img.src.includes('.webp');
        const compressionRatio = isWebP ? 0.3 : 0.7; // WebP is typically 30% smaller
        const estimatedSize = (area * 3 * compressionRatio) / 1024; // Rough bytes to KB
        
        this.imageStats.totalSize += estimatedSize;
    }

    getStats() {
        return {
            ...this.imageStats,
            averageLoadTime: this.imageStats.loaded > 0 ? this.imageStats.loadTime / this.imageStats.loaded : 0,
            successRate: (this.imageStats.loaded / (this.imageStats.loaded + this.imageStats.failed)) * 100
        };
    }
}

// Initialize Image Optimization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all image optimization features
    window.imageOptimizer = new ImageOptimizer();
    window.criticalImageLoader = new CriticalImageLoader();
    window.imagePerformanceMonitor = new ImagePerformanceMonitor();
    
    console.log('🖼️ Image optimization system initialized');
    
    // Log performance stats after 5 seconds
    setTimeout(() => {
        const stats = window.imagePerformanceMonitor.getStats();
        console.log('📊 Image Performance Stats:', stats);
    }, 5000);
});

// Image Lazy Loading CSS Classes (add to CSS if not present)
const imageOptimizationCSS = `
    .image-loading {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: imageLoading 1.5s infinite;
        min-height: 200px;
    }
    
    .image-loaded {
        animation: imageAppear 0.3s ease-in;
    }
    
    .image-error {
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        min-height: 200px;
    }
    
    .image-error::after {
        content: '🖼️ Image not available';
        font-size: 14px;
    }
    
    @keyframes imageLoading {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    
    @keyframes imageAppear {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .image-loading, .image-loaded {
            animation: none;
        }
    }
`;

// Add CSS to head if not already present
if (!document.querySelector('#image-optimization-css')) {
    const style = document.createElement('style');
    style.id = 'image-optimization-css';
    style.textContent = imageOptimizationCSS;
    document.head.appendChild(style);
}

// ===============================================
// SEO PERFORMANCE MONITOR
// ===============================================

class SEOPerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoadTime: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
            totalBlockingTime: 0,
            seoScore: 0
        };
        
        this.seoChecks = {
            hasTitle: false,
            hasDescription: false,
            hasH1: false,
            hasStructuredData: false,
            hasCanonical: false,
            hasOpenGraph: false,
            hasAltTexts: false,
            hasSitemap: false,
            hasRobots: false
        };
        
        this.init();
    }

    init() {
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startMonitoring());
        } else {
            this.startMonitoring();
        }
    }

    startMonitoring() {
        this.measurePerformanceMetrics();
        this.performSEOAudit();
        this.calculateSEOScore();
        
        // Report results after a delay to ensure all measurements are complete
        setTimeout(() => {
            this.reportResults();
        }, 3000);
    }

    measurePerformanceMetrics() {
        // Page Load Time
        window.addEventListener('load', () => {
            this.metrics.pageLoadTime = performance.now();
        });

        // Web Vitals using Performance Observer
        if ('PerformanceObserver' in window) {
            // First Contentful Paint
            const fcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
                if (fcp) {
                    this.metrics.firstContentfulPaint = fcp.startTime;
                }
            });
            
            try {
                fcpObserver.observe({ entryTypes: ['paint'] });
            } catch (e) {
                console.warn('Paint timing not supported');
            }

            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.startTime;
            });
            
            try {
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP not supported');
            }

            // Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.metrics.cumulativeLayoutShift = clsValue;
            });
            
            try {
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('Layout Shift not supported');
            }
        }
    }

    performSEOAudit() {
        // Check for title tag
        const title = document.querySelector('title');
        this.seoChecks.hasTitle = title && title.textContent.trim().length > 0 && title.textContent.length <= 60;

        // Check for meta description
        const description = document.querySelector('meta[name="description"]');
        this.seoChecks.hasDescription = description && description.content.length > 0 && description.content.length <= 160;

        // Check for H1 tag
        const h1 = document.querySelector('h1');
        this.seoChecks.hasH1 = h1 && h1.textContent.trim().length > 0;

        // Check for structured data
        const structuredData = document.querySelector('script[type="application/ld+json"]');
        this.seoChecks.hasStructuredData = structuredData !== null;

        // Check for canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        this.seoChecks.hasCanonical = canonical !== null;

        // Check for Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        this.seoChecks.hasOpenGraph = ogTitle && ogDescription;

        // Check for alt texts on images
        const images = document.querySelectorAll('img');
        let imagesWithAlt = 0;
        images.forEach(img => {
            if (img.alt && img.alt.trim().length > 0) {
                imagesWithAlt++;
            }
        });
        this.seoChecks.hasAltTexts = images.length === 0 || (imagesWithAlt / images.length) >= 0.9;

        // Check for sitemap (async)
        fetch('/sitemap.xml')
            .then(response => {
                this.seoChecks.hasSitemap = response.ok;
            })
            .catch(() => {
                this.seoChecks.hasSitemap = false;
            });

        // Check for robots.txt (async)
        fetch('/robots.txt')
            .then(response => {
                this.seoChecks.hasRobots = response.ok;
            })
            .catch(() => {
                this.seoChecks.hasRobots = false;
            });
    }

    calculateSEOScore() {
        const checks = Object.values(this.seoChecks);
        const passedChecks = checks.filter(check => check === true).length;
        this.metrics.seoScore = Math.round((passedChecks / checks.length) * 100);
    }

    reportResults() {
        const report = {
            performance: this.metrics,
            seoChecks: this.seoChecks,
            recommendations: this.generateRecommendations()
        };

        console.group('🔍 SEO Performance Report');
        console.log('📊 Performance Metrics:', this.metrics);
        console.log('✅ SEO Checks:', this.seoChecks);
        console.log('💡 Recommendations:', report.recommendations);
        console.groupEnd();

        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'seo_audit', {
                custom_parameter: this.metrics.seoScore
            });
        }

        return report;
    }

    generateRecommendations() {
        const recommendations = [];

        if (!this.seoChecks.hasTitle) {
            recommendations.push('Add a descriptive title tag (30-60 characters)');
        }

        if (!this.seoChecks.hasDescription) {
            recommendations.push('Add a meta description (120-160 characters)');
        }

        if (!this.seoChecks.hasH1) {
            recommendations.push('Add an H1 heading to the page');
        }

        if (!this.seoChecks.hasStructuredData) {
            recommendations.push('Implement structured data (JSON-LD)');
        }

        if (!this.seoChecks.hasCanonical) {
            recommendations.push('Add a canonical URL');
        }

        if (!this.seoChecks.hasOpenGraph) {
            recommendations.push('Add Open Graph meta tags for social media');
        }

        if (!this.seoChecks.hasAltTexts) {
            recommendations.push('Add alt text to all images');
        }

        if (this.metrics.firstContentfulPaint > 2500) {
            recommendations.push('Optimize First Contentful Paint (target: <2.5s)');
        }

        if (this.metrics.largestContentfulPaint > 2500) {
            recommendations.push('Optimize Largest Contentful Paint (target: <2.5s)');
        }

        if (this.metrics.cumulativeLayoutShift > 0.1) {
            recommendations.push('Reduce Cumulative Layout Shift (target: <0.1)');
        }

        return recommendations;
    }
}

// Schema Validation Helper
class SchemaValidator {
    constructor() {
        this.schemas = [];
        this.validateSchemas();
    }

    validateSchemas() {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        
        scripts.forEach((script, index) => {
            try {
                const schema = JSON.parse(script.textContent);
                this.schemas.push({
                    index,
                    schema,
                    valid: this.isValidSchema(schema),
                    type: schema['@type'] || 'Unknown'
                });
            } catch (error) {
                console.warn(`Invalid JSON-LD schema at index ${index}:`, error);
                this.schemas.push({
                    index,
                    valid: false,
                    error: error.message,
                    type: 'Invalid'
                });
            }
        });

        console.group('📋 Schema.org Validation');
        this.schemas.forEach(schema => {
            if (schema.valid) {
                console.log(`✅ ${schema.type} schema is valid`);
            } else {
                console.warn(`❌ ${schema.type} schema has issues:`, schema.error);
            }
        });
        console.groupEnd();
    }

    isValidSchema(schema) {
        // Basic validation - check for required properties
        const hasContext = schema['@context'] === 'https://schema.org';
        const hasType = schema['@type'] && typeof schema['@type'] === 'string';
        
        return hasContext && hasType;
    }
}

// Initialize SEO monitoring
document.addEventListener('DOMContentLoaded', () => {
    // Initialize SEO monitoring
    window.seoMonitor = new SEOPerformanceMonitor();
    window.schemaValidator = new SchemaValidator();
    
    console.log('🚀 SEO monitoring system initialized');
});