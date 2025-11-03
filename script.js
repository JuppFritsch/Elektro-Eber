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

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        // Close sidebar on mobile after click
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            mainContent.classList.remove('shifted');
        }
    });
});

// Services Tabs Functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active from all buttons and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Add active to clicked button and corresponding panel
        button.classList.add('active');
        document.getElementById(targetTab)?.classList.add('active');
    });
});

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
            basePrice: 0,
            totalPrice: 0
        };
        this.servicesByType = {
            residential: [
                { id: 'installation', name: 'Elektroinstallation', description: 'Steckdosen, Schalter, Leitungen', price: 1200 },
                { id: 'lighting', name: 'Beleuchtung', description: 'LED-Installation, Lichtplanung', price: 800 },
                { id: 'fuse-box', name: 'Sicherungskasten', description: 'Modernisierung der Elektroverteilung', price: 1500 },
                { id: 'safety', name: 'Sicherheitstechnik', description: 'RCD, Überspannungsschutz', price: 600 }
            ],
            commercial: [
                { id: 'office-wiring', name: 'Büroverkabelung', description: 'Netzwerk- und Stromverkabelung', price: 3500 },
                { id: 'emergency-lighting', name: 'Notbeleuchtung', description: 'Sicherheitsbeleuchtung nach DIN', price: 2200 },
                { id: 'access-control', name: 'Zutrittskontrolle', description: 'Elektronische Schließsysteme', price: 4000 },
                { id: 'fire-alarm', name: 'Brandmeldeanlage', description: 'Rauchmelder und Alarmierung', price: 5500 }
            ],
            industrial: [
                { id: 'machine-wiring', name: 'Maschinenverdrahtung', description: 'Industrielle Verkabelung', price: 8000 },
                { id: 'control-cabinet', name: 'Schaltschrankbau', description: 'SPS-Steuerungen, Schaltschränke', price: 12000 },
                { id: 'motor-control', name: 'Motorsteuerung', description: 'Frequenzumrichter, Motorschutz', price: 6500 },
                { id: 'measurement', name: 'Messtechnik', description: 'Industrielle Sensorik und Überwachung', price: 4500 }
            ],
            smart: [
                { id: 'knx-system', name: 'KNX-System', description: 'Gebäudeautomation mit KNX/EIB', price: 6500 },
                { id: 'home-assistant', name: 'Smart Home Hub', description: 'Zentrale Steuerung aller Geräte', price: 1800 },
                { id: 'voice-control', name: 'Sprachsteuerung', description: 'Alexa, Google Assistant Integration', price: 800 },
                { id: 'security-smart', name: 'Smart Security', description: 'Überwachung, Alarmanlagen', price: 3200 }
            ],
            solar: [
                { id: 'pv-system', name: 'PV-Anlage', description: 'Photovoltaik-Module und Wechselrichter', price: 15000 },
                { id: 'battery-storage', name: 'Batteriespeicher', description: 'Lithium-Speichersystem', price: 8500 },
                { id: 'wallbox', name: 'Wallbox', description: 'E-Auto Ladestation', price: 2200 },
                { id: 'monitoring', name: 'Monitoring', description: 'Überwachung und Ferndiagnose', price: 1200 }
            ],
            emergency: [
                { id: 'diagnosis', name: 'Fehlerdiagnose', description: 'Fehlersuche und -behebung', price: 120 },
                { id: 'repair', name: 'Sofortreparatur', description: 'Schnelle Fehlerbehebung', price: 180 },
                { id: 'emergency-service', name: '24h-Notdienst', description: 'Wochenende/Feiertage Zuschlag', price: 250 },
                { id: 'safety-check', name: 'Sicherheitsprüfung', description: 'Überprüfung nach Reparatur', price: 80 }
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
        
        if (projectSizeInput) projectSizeInput.addEventListener('input', () => this.calculatePrice());
        if (timeframeSelect) timeframeSelect.addEventListener('change', () => this.calculatePrice());
        
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
        this.projectData = { type: null, services: [], basePrice: 0, totalPrice: 0 };
        
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
        const basePrice = this.projectData.basePrice || 0;
        const servicesPrice = this.projectData.services.reduce((sum, service) => sum + service.price, 0);
        
        // Größenzuschlag (pro m² für bestimmte Projekttypen)
        const projectSizeEl = document.getElementById('projectSize');
        const size = projectSizeEl ? parseInt(projectSizeEl.value) || 0 : 0;
        let sizePrice = 0;
        if (size > 0) {
            const pricePerSqm = {
                residential: 25,
                commercial: 35,
                industrial: 45,
                smart: 55,
                solar: 0, // Bei Solar ist Größe bereits im Grundpreis
                emergency: 0
            };
            sizePrice = size * (pricePerSqm[this.projectData.type] || 0);
        }
        
        // Zeitfaktor
        const timeframe = document.getElementById('timeframe');
        const timeMultiplier = timeframe && timeframe.selectedOptions[0] ? 
            parseFloat(timeframe.selectedOptions[0].dataset.multiplier) || 1 : 1;
        const baseTotal = basePrice + servicesPrice + sizePrice;
        const timePrice = baseTotal * (timeMultiplier - 1);
        
        const totalPrice = baseTotal + timePrice;
        
        // UI aktualisieren
        const basePriceEl = document.getElementById('basePrice');
        const servicesPriceEl = document.getElementById('servicesPrice');
        const sizePriceEl = document.getElementById('sizePrice');
        const timePriceEl = document.getElementById('timePrice');
        const totalPriceEl = document.getElementById('totalPrice');
        
        if (basePriceEl) basePriceEl.textContent = `${basePrice.toLocaleString()}€`;
        if (servicesPriceEl) servicesPriceEl.textContent = `${servicesPrice.toLocaleString()}€`;
        if (sizePriceEl) sizePriceEl.textContent = `${sizePrice.toLocaleString()}€`;
        if (timePriceEl) timePriceEl.textContent = `${timePrice >= 0 ? '+' : ''}${Math.round(timePrice).toLocaleString()}€`;
        if (totalPriceEl) totalPriceEl.textContent = `${Math.round(totalPrice).toLocaleString()}€`;
        
        this.projectData.totalPrice = Math.round(totalPrice);
    }

    requestQuote() {
        const projectSizeEl = document.getElementById('projectSize');
        const timeframeEl = document.getElementById('timeframe');
        const additionalEl = document.getElementById('additional');
        
        const projectDetails = {
            type: this.projectData.type,
            services: this.projectData.services.map(s => s.name),
            size: projectSizeEl ? projectSizeEl.value : '',
            timeframe: timeframeEl ? timeframeEl.value : '',
            additional: additionalEl ? additionalEl.value : '',
            estimatedPrice: this.projectData.totalPrice
        };
        
        // In einer echten Anwendung würde hier eine API-Anfrage gesendet werden
        console.log('Angebot anfordern:', projectDetails);
        
        // Erfolgs-Feedback
        showNotification('Ihre Anfrage wurde versendet! Wir melden uns innerhalb von 24h bei Ihnen.', 'success');
        this.closeModal();
    }

    callNow() {
        window.location.href = 'tel:+49123456789';
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize project modal
    try {
        const modal = new ProjectModal();
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
        new LiveChat();
    }, 700);
    
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

// Live Chat Manager Class
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
        
        this.init();
        this.setupAutoResponses();
    }
    
    init() {
        // Chat button toggle
        this.chatButton.addEventListener('click', () => this.toggleChat());
        
        // Control buttons
        this.minimizeBtn.addEventListener('click', () => this.minimizeChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        
        // Send message
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Quick actions
        this.quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                this.sendUserMessage(message);
            });
        });
        
        // Show initial notification after 3 seconds
        setTimeout(() => {
            if (!this.isOpen) {
                this.showNotification();
            }
        }, 3000);
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
        this.notification.style.display = 'flex';
        this.notification.textContent = '1';
    }
    
    hideNotification() {
        this.notification.style.display = 'none';
    }
    
    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        this.sendUserMessage(message);
        this.chatInput.value = '';
    }
    
    sendUserMessage(message) {
        this.addMessage(message, 'user');
        
        // Show typing indicator
        setTimeout(() => {
            this.showTypingIndicator();
            
            // Send auto response after delay
            setTimeout(() => {
                this.hideTypingIndicator();
                this.sendAutoResponse(message);
            }, 1500);
        }, 500);
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
    
    setupAutoResponses() {
        this.responses = {
            'kostenvoranschlag': [
                'Gerne erstelle ich Ihnen einen kostenlosen Kostenvoranschlag! 📋',
                'Können Sie mir mehr Details zu Ihrem Projekt mitteilen?',
                'Welche Art von Elektroarbeiten planen Sie?'
            ],
            'notfall': [
                'Bei Notfällen sind wir 24/7 für Sie da! 🚨',
                'Rufen Sie uns sofort unter +49 (0) 123 456 789 an.',
                'Wir sind innerhalb von 30-60 Minuten vor Ort.'
            ],
            'termin': [
                'Sehr gerne vereinbare ich einen Termin mit Ihnen! 📅',
                'Wann würde Ihnen ein Termin am besten passen?',
                'Sie können auch direkt über unser Kontaktformular einen Wunschtermin angeben.'
            ],
            'preis': [
                'Die Kosten hängen vom Projektumfang ab. 💰',
                'Nutzen Sie gerne unseren Kostenrechner für eine erste Einschätzung.',
                'Für ein genaues Angebot komme ich gerne kostenlos zu Ihnen vor Ort.'
            ],
            'smart home': [
                'Smart Home ist unser Spezialgebiet! 🏠✨',
                'Wir installieren KNX-Systeme, WLAN-basierte Lösungen und mehr.',
                'Welche Smart Home Funktionen interessieren Sie am meisten?'
            ],
            'default': [
                'Vielen Dank für Ihre Nachricht! 🤖',
                'Ich bin der Eber Bot und helfe Ihnen gerne weiter!',
                'Sie können auch jederzeit unter +49 (0) 123 456 789 anrufen.',
                'Besuchen Sie unser Kontaktformular für detaillierte Anfragen.'
            ]
        };
    }
    
    sendAutoResponse(userMessage) {
        const message = userMessage.toLowerCase();
        let responseKey = 'default';
        
        if (message.includes('kostenvoranschlag') || message.includes('preis') || message.includes('kosten')) {
            responseKey = message.includes('kostenvoranschlag') ? 'kostenvoranschlag' : 'preis';
        } else if (message.includes('notfall') || message.includes('hilfe') || message.includes('problem')) {
            responseKey = 'notfall';
        } else if (message.includes('termin') || message.includes('beratung')) {
            responseKey = 'termin';
        } else if (message.includes('smart home') || message.includes('knx')) {
            responseKey = 'smart home';
        }
        
        const responses = this.responses[responseKey];
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        this.addMessage(response);
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