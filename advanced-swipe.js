// ====== ADVANCED SWIPE FUNCTIONALITY FOR SERVICES & TEAM ======

class AdvancedSwipeManager {
    constructor() {
        this.isTouch = 'ontouchstart' in window;
        this.swipeThreshold = 50;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.currentServiceTab = 0;
        this.currentTeamMember = 0;
        this.serviceTabs = [];
        this.teamCards = [];
        
        // Animation settings
        this.animationDuration = 300;
        this.easeFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
        
        this.init();
    }
    
    init() {
        if (!this.isTouch) {
            console.log('Advanced swipe gestures not supported on this device');
            this.initDesktopEnhancements();
            return;
        }
        
        this.initServiceSwipes();
        this.initTeamSwipes();
        this.initGeneralSwipeEnhancements();
        this.createSwipeIndicators();
        
        console.log('🚀 Advanced Swipe Manager initialized');
    }
    
    // ====== SERVICE TABS SWIPE FUNCTIONALITY ======
    
    initServiceSwipes() {
        const servicesSection = document.getElementById('services');
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        if (!servicesSection || tabButtons.length === 0) return;
        
        this.serviceTabs = Array.from(tabButtons);
        
        // Create mobile swipe container for services
        this.createMobileServiceLayout(servicesSection);
        
        // Add swipe events to service section
        servicesSection.addEventListener('touchstart', (e) => this.handleServiceTouchStart(e), { passive: false });
        servicesSection.addEventListener('touchmove', (e) => this.handleServiceTouchMove(e), { passive: false });
        servicesSection.addEventListener('touchend', (e) => this.handleServiceTouchEnd(e), { passive: false });
        
        // Enhance existing tab buttons with touch feedback
        this.enhanceServiceTabs(tabButtons);
        
        // Create service navigation dots
        this.createServiceIndicators(servicesSection);
    }
    
    createMobileServiceLayout(servicesSection) {
        const tabsContainer = servicesSection.querySelector('.tabs-container');
        const tabContent = servicesSection.querySelector('.tab-content');
        
        if (!tabsContainer || !tabContent) return;
        
        // Mobile-only modifications
        if (window.innerWidth <= 768) {
            tabContent.style.display = 'flex';
            tabContent.style.overflowX = 'hidden';
            tabContent.style.scrollSnapType = 'x mandatory';
            tabContent.classList.add('mobile-service-content');
            
            const tabPanels = tabContent.querySelectorAll('.tab-panel');
            tabPanels.forEach((panel, index) => {
                panel.style.minWidth = '100%';
                panel.style.scrollSnapAlign = 'start';
                panel.dataset.index = index;
                
                // Add mobile-specific enhancements
                this.enhanceServicePanel(panel);
            });
            
            // Hide tab buttons on mobile, show dots instead
            const tabButtons = servicesSection.querySelector('.tab-buttons');
            if (tabButtons && window.innerWidth <= 768) {
                tabButtons.style.display = 'none';
            }
        }
    }
    
    enhanceServicePanel(panel) {
        // Add swipe hint
        if (!panel.querySelector('.swipe-hint')) {
            const swipeHint = document.createElement('div');
            swipeHint.className = 'swipe-hint';
            swipeHint.innerHTML = '<i class="fas fa-hand-point-left"></i> Wischen für mehr Services';
            panel.appendChild(swipeHint);
            
            // Hide hint after 3 seconds
            setTimeout(() => {
                swipeHint.style.opacity = '0';
                setTimeout(() => swipeHint.remove(), 300);
            }, 3000);
        }
        
        // Add service animations
        const serviceItems = panel.querySelectorAll('.service-item');
        serviceItems.forEach((item, index) => {
            item.style.setProperty('--item-delay', `${index * 0.1}s`);
            item.classList.add('service-item-animated');
        });
    }
    
    enhanceServiceTabs(tabButtons) {
        tabButtons.forEach((btn, index) => {
            // Add touch feedback
            btn.addEventListener('touchstart', () => {
                btn.classList.add('tab-touch-active');
                if (navigator.vibrate) navigator.vibrate(10);
            });
            
            btn.addEventListener('touchend', () => {
                setTimeout(() => btn.classList.remove('tab-touch-active'), 150);
            });
            
            // Enhanced click handler
            btn.addEventListener('click', () => {
                this.switchToServiceTab(index);
            });
        });
    }
    
    createServiceIndicators(servicesSection) {
        if (window.innerWidth > 768) return;
        
        const indicators = document.createElement('div');
        indicators.className = 'service-swipe-indicators';
        
        this.serviceTabs.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `service-indicator ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            dot.addEventListener('click', () => this.switchToServiceTab(index));
            indicators.appendChild(dot);
        });
        
        servicesSection.appendChild(indicators);
    }
    
    handleServiceTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }
    
    handleServiceTouchMove(e) {
        if (!this.touchStartX || !this.touchStartY) return;
        
        this.touchEndX = e.touches[0].clientX;
        this.touchEndY = e.touches[0].clientY;
        
        const diffX = this.touchStartX - this.touchEndX;
        const diffY = this.touchStartY - this.touchEndY;
        
        // Prevent vertical scroll if horizontal swipe is dominant
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 15) {
            e.preventDefault();
        }
    }
    
    handleServiceTouchEnd(e) {
        if (!this.touchStartX || !this.touchEndX) return;
        
        const diffX = this.touchStartX - this.touchEndX;
        const diffY = this.touchStartY - this.touchEndY;
        
        // Check if it's a horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.swipeThreshold) {
            if (diffX > 0) {
                // Swipe left - next service
                this.nextServiceTab();
            } else {
                // Swipe right - previous service
                this.previousServiceTab();
            }
        }
        
        this.resetTouchValues();
    }
    
    switchToServiceTab(index) {
        if (index < 0 || index >= this.serviceTabs.length) return;
        
        this.currentServiceTab = index;
        
        // Update tab buttons (if visible)
        this.serviceTabs.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
        
        // Update tab panels
        const tabPanels = document.querySelectorAll('.tab-panel');
        tabPanels.forEach((panel, i) => {
            panel.classList.toggle('active', i === index);
        });
        
        // Smooth scroll to panel on mobile
        if (window.innerWidth <= 768) {
            const targetPanel = tabPanels[index];
            if (targetPanel) {
                targetPanel.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start'
                });
            }
        }
        
        // Update indicators
        this.updateServiceIndicators();
        
        // Add transition effect
        this.animateServiceTransition(index);
        
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(15);
    }
    
    nextServiceTab() {
        const nextIndex = (this.currentServiceTab + 1) % this.serviceTabs.length;
        this.switchToServiceTab(nextIndex);
    }
    
    previousServiceTab() {
        const prevIndex = (this.currentServiceTab - 1 + this.serviceTabs.length) % this.serviceTabs.length;
        this.switchToServiceTab(prevIndex);
    }
    
    updateServiceIndicators() {
        const indicators = document.querySelectorAll('.service-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentServiceTab);
        });
    }
    
    animateServiceTransition(index) {
        const tabPanels = document.querySelectorAll('.tab-panel');
        const activePanel = tabPanels[index];
        
        if (!activePanel) return;
        
        // Fade in animation
        activePanel.style.opacity = '0';
        activePanel.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            activePanel.style.transition = `opacity ${this.animationDuration}ms ${this.easeFunction}, transform ${this.animationDuration}ms ${this.easeFunction}`;
            activePanel.style.opacity = '1';
            activePanel.style.transform = 'translateX(0)';
        }, 50);
    }
    
    // ====== TEAM CARDS SWIPE FUNCTIONALITY ======
    
    initTeamSwipes() {
        const teamSection = document.getElementById('team');
        const teamCards = document.querySelectorAll('.team-card');
        
        if (!teamSection || teamCards.length === 0) return;
        
        this.teamCards = Array.from(teamCards);
        
        // Create mobile team carousel
        this.createMobileTeamLayout(teamSection);
        
        // Add swipe events
        teamSection.addEventListener('touchstart', (e) => this.handleTeamTouchStart(e), { passive: false });
        teamSection.addEventListener('touchmove', (e) => this.handleTeamTouchMove(e), { passive: false });
        teamSection.addEventListener('touchend', (e) => this.handleTeamTouchEnd(e), { passive: false });
        
        // Enhance team cards
        this.enhanceTeamCards(teamCards);
        
        // Create team indicators
        this.createTeamIndicators(teamSection);
    }
    
    createMobileTeamLayout(teamSection) {
        const teamCardsContainer = teamSection.querySelector('.team-cards');\n        \n        if (!teamCardsContainer || window.innerWidth > 768) return;\n        \n        teamCardsContainer.style.display = 'flex';\n        teamCardsContainer.style.overflowX = 'auto';\n        teamCardsContainer.style.scrollSnapType = 'x mandatory';\n        teamCardsContainer.style.gap = '1rem';\n        teamCardsContainer.style.padding = '0 1rem';\n        teamCardsContainer.classList.add('mobile-team-container');\n        \n        this.teamCards.forEach((card, index) => {\n            card.style.minWidth = '85%';\n            card.style.scrollSnapAlign = 'center';\n            card.dataset.index = index;\n            \n            // Add mobile-specific styling\n            this.enhanceTeamCardMobile(card);\n        });\n    }\n    \n    enhanceTeamCardMobile(card) {\n        // Add swipe affordance\n        if (!card.querySelector('.team-swipe-hint')) {\n            const swipeHint = document.createElement('div');\n            swipeHint.className = 'team-swipe-hint';\n            swipeHint.innerHTML = '<i class=\"fas fa-arrows-alt-h\"></i>';\n            card.appendChild(swipeHint);\n        }\n        \n        // Add parallax effect on scroll\n        card.addEventListener('touchmove', (e) => {\n            const rect = card.getBoundingClientRect();\n            const centerX = window.innerWidth / 2;\n            const cardCenterX = rect.left + rect.width / 2;\n            const offset = (cardCenterX - centerX) / centerX;\n            \n            card.style.transform = `scale(${1 - Math.abs(offset) * 0.1}) rotateY(${offset * 5}deg)`;\n        });\n    }\n    \n    enhanceTeamCards(teamCards) {\n        teamCards.forEach((card, index) => {\n            // Add touch feedback\n            card.addEventListener('touchstart', () => {\n                card.classList.add('team-touch-active');\n                if (navigator.vibrate) navigator.vibrate(5);\n            });\n            \n            card.addEventListener('touchend', () => {\n                setTimeout(() => card.classList.remove('team-touch-active'), 150);\n            });\n            \n            // Add tap to expand functionality\n            card.addEventListener('click', () => {\n                this.expandTeamCard(card, index);\n            });\n        });\n    }\n    \n    createTeamIndicators(teamSection) {\n        if (window.innerWidth > 768) return;\n        \n        const indicators = document.createElement('div');\n        indicators.className = 'team-swipe-indicators';\n        \n        this.teamCards.forEach((_, index) => {\n            const dot = document.createElement('button');\n            dot.className = `team-indicator ${index === 0 ? 'active' : ''}`;\n            dot.dataset.index = index;\n            dot.addEventListener('click', () => this.switchToTeamMember(index));\n            indicators.appendChild(dot);\n        });\n        \n        teamSection.appendChild(indicators);\n    }\n    \n    handleTeamTouchStart(e) {\n        this.teamStartX = e.touches[0].clientX;\n        this.teamStartY = e.touches[0].clientY;\n    }\n    \n    handleTeamTouchMove(e) {\n        if (!this.teamStartX || !this.teamStartY) return;\n        \n        this.teamEndX = e.touches[0].clientX;\n        this.teamEndY = e.touches[0].clientY;\n        \n        const diffX = this.teamStartX - this.teamEndX;\n        const diffY = this.teamStartY - this.teamEndY;\n        \n        // Prevent vertical scroll if horizontal swipe\n        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 15) {\n            e.preventDefault();\n        }\n    }\n    \n    handleTeamTouchEnd(e) {\n        if (!this.teamStartX || !this.teamEndX) return;\n        \n        const diffX = this.teamStartX - this.teamEndX;\n        const diffY = this.teamStartY - this.teamEndY;\n        \n        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.swipeThreshold) {\n            if (diffX > 0) {\n                this.nextTeamMember();\n            } else {\n                this.previousTeamMember();\n            }\n        }\n        \n        this.teamStartX = 0;\n        this.teamEndX = 0;\n        this.teamStartY = 0;\n        this.teamEndY = 0;\n    }\n    \n    switchToTeamMember(index) {\n        if (index < 0 || index >= this.teamCards.length) return;\n        \n        this.currentTeamMember = index;\n        const targetCard = this.teamCards[index];\n        \n        // Scroll to team member\n        targetCard.scrollIntoView({\n            behavior: 'smooth',\n            block: 'nearest',\n            inline: 'center'\n        });\n        \n        // Update visual indicators\n        this.updateTeamIndicators();\n        this.highlightCurrentTeamMember();\n        \n        // Haptic feedback\n        if (navigator.vibrate) navigator.vibrate(15);\n    }\n    \n    nextTeamMember() {\n        const nextIndex = (this.currentTeamMember + 1) % this.teamCards.length;\n        this.switchToTeamMember(nextIndex);\n    }\n    \n    previousTeamMember() {\n        const prevIndex = (this.currentTeamMember - 1 + this.teamCards.length) % this.teamCards.length;\n        this.switchToTeamMember(prevIndex);\n    }\n    \n    updateTeamIndicators() {\n        const indicators = document.querySelectorAll('.team-indicator');\n        indicators.forEach((indicator, index) => {\n            indicator.classList.toggle('active', index === this.currentTeamMember);\n        });\n    }\n    \n    highlightCurrentTeamMember() {\n        this.teamCards.forEach((card, index) => {\n            card.classList.toggle('team-current', index === this.currentTeamMember);\n        });\n    }\n    \n    expandTeamCard(card, index) {\n        // Create expanded team member modal\n        this.createTeamMemberModal(card, index);\n    }\n    \n    createTeamMemberModal(card, index) {\n        const modal = document.createElement('div');\n        modal.className = 'team-member-modal';\n        \n        const memberInfo = {\n            0: {\n                name: 'Dennis Eckert',\n                role: 'CEO & Geschäftsführer',\n                experience: '8 Jahre',\n                description: 'Geschäftsführer und Projektleiter seit der Gründung 2023. Verantwortlich für Kundenbetreuung, Projektmanagement und strategische Unternehmensführung.',\n                skills: ['Projektleitung', 'Kundenbetreuung', 'Unternehmensführung'],\n                contact: 'dennis@elektro-eber.de'\n            },\n            1: {\n                name: 'Marcus Weber',\n                role: 'CTO & Technischer Leiter',\n                experience: '12 Jahre',\n                description: 'Technischer Leiter mit über 12 Jahren Erfahrung in der Elektrotechnik. Spezialist für komplexe Installationen und innovative Lösungen.',\n                skills: ['Elektroplanung', 'Smart Home', 'Industrieautomation'],\n                contact: 'marcus@elektro-eber.de'\n            },\n            2: {\n                name: 'Stefan König',\n                role: 'Meister & Installationsleiter',\n                experience: '15 Jahre',\n                description: 'Erfahrener Elektroinstallateur und Meister. Leitet alle Installationsarbeiten und ist für die Qualitätssicherung vor Ort verantwortlich.',\n                skills: ['Installation', 'Wartung', 'Qualitätssicherung'],\n                contact: 'stefan@elektro-eber.de'\n            }\n        };\n        \n        const member = memberInfo[index];\n        if (!member) return;\n        \n        modal.innerHTML = `\n            <div class=\"team-modal-content\">\n                <div class=\"team-modal-header\">\n                    <div class=\"member-avatar-large\">\n                        <i class=\"fas fa-user-tie\"></i>\n                    </div>\n                    <div class=\"member-details\">\n                        <h3>${member.name}</h3>\n                        <p class=\"role\">${member.role}</p>\n                        <p class=\"experience\">${member.experience} Berufserfahrung</p>\n                    </div>\n                    <button class=\"team-modal-close\">&times;</button>\n                </div>\n                <div class=\"team-modal-body\">\n                    <p class=\"description\">${member.description}</p>\n                    <div class=\"skills-section\">\n                        <h4>Expertise</h4>\n                        <div class=\"skills-list\">\n                            ${member.skills.map(skill => `<span class=\"skill-tag\">${skill}</span>`).join('')}\n                        </div>\n                    </div>\n                    <div class=\"contact-section\">\n                        <h4>Kontakt</h4>\n                        <a href=\"mailto:${member.contact}\" class=\"contact-link\">\n                            <i class=\"fas fa-envelope\"></i> ${member.contact}\n                        </a>\n                    </div>\n                </div>\n                <div class=\"team-modal-actions\">\n                    <button class=\"btn-primary\" onclick=\"document.getElementById('openProjectModal').click(); this.closest('.team-member-modal').remove();\">\n                        <i class=\"fas fa-handshake\"></i> Projekt besprechen\n                    </button>\n                </div>\n            </div>\n        `;\n        \n        // Close handlers\n        modal.addEventListener('click', (e) => {\n            if (e.target === modal) modal.remove();\n        });\n        \n        modal.querySelector('.team-modal-close').addEventListener('click', () => modal.remove());\n        \n        document.body.appendChild(modal);\n        setTimeout(() => modal.classList.add('show'), 10);\n    }\n    \n    // ====== GENERAL SWIPE ENHANCEMENTS ======\n    \n    initGeneralSwipeEnhancements() {\n        // Add momentum scrolling\n        this.addMomentumScrolling();\n        \n        // Add edge bounce effects\n        this.addEdgeBounceEffects();\n        \n        // Add swipe sound effects (optional)\n        this.addSwipeSoundEffects();\n    }\n    \n    addMomentumScrolling() {\n        const scrollContainers = document.querySelectorAll('.mobile-service-content, .mobile-team-container');\n        \n        scrollContainers.forEach(container => {\n            container.style.webkitOverflowScrolling = 'touch';\n            container.style.scrollBehavior = 'smooth';\n        });\n    }\n    \n    addEdgeBounceEffects() {\n        // Add visual feedback when reaching end of swipeable content\n        const containers = document.querySelectorAll('.mobile-service-content, .mobile-team-container');\n        \n        containers.forEach(container => {\n            container.addEventListener('scroll', () => {\n                const { scrollLeft, scrollWidth, clientWidth } = container;\n                \n                // At start\n                if (scrollLeft === 0) {\n                    container.classList.add('at-start');\n                    container.classList.remove('at-end');\n                }\n                // At end\n                else if (scrollLeft + clientWidth >= scrollWidth - 1) {\n                    container.classList.add('at-end');\n                    container.classList.remove('at-start');\n                }\n                // In middle\n                else {\n                    container.classList.remove('at-start', 'at-end');\n                }\n            });\n        });\n    }\n    \n    addSwipeSoundEffects() {\n        // Optional: Add subtle sound effects for swipes\n        // This can be enabled based on user preferences\n        if (localStorage.getItem('swipe-sounds-enabled') === 'true') {\n            // Implementation would go here\n        }\n    }\n    \n    createSwipeIndicators() {\n        // Add visual indicators showing swipe capability\n        const swipeAreas = document.querySelectorAll('#services, #team');\n        \n        swipeAreas.forEach(area => {\n            if (window.innerWidth <= 768) {\n                area.classList.add('swipe-enabled');\n            }\n        });\n    }\n    \n    // ====== DESKTOP ENHANCEMENTS ======\n    \n    initDesktopEnhancements() {\n        // Add keyboard navigation for desktop users\n        this.addKeyboardNavigation();\n        \n        // Add mouse wheel support\n        this.addMouseWheelSupport();\n    }\n    \n    addKeyboardNavigation() {\n        document.addEventListener('keydown', (e) => {\n            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;\n            \n            switch(e.key) {\n                case 'ArrowLeft':\n                    e.preventDefault();\n                    this.previousServiceTab();\n                    break;\n                case 'ArrowRight':\n                    e.preventDefault();\n                    this.nextServiceTab();\n                    break;\n                case 'ArrowUp':\n                    e.preventDefault();\n                    this.previousTeamMember();\n                    break;\n                case 'ArrowDown':\n                    e.preventDefault();\n                    this.nextTeamMember();\n                    break;\n            }\n        });\n    }\n    \n    addMouseWheelSupport() {\n        const servicesSection = document.getElementById('services');\n        const teamSection = document.getElementById('team');\n        \n        [servicesSection, teamSection].forEach(section => {\n            if (!section) return;\n            \n            section.addEventListener('wheel', (e) => {\n                if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {\n                    e.preventDefault();\n                    \n                    if (section.id === 'services') {\n                        if (e.deltaX > 0) {\n                            this.nextServiceTab();\n                        } else {\n                            this.previousServiceTab();\n                        }\n                    } else if (section.id === 'team') {\n                        if (e.deltaX > 0) {\n                            this.nextTeamMember();\n                        } else {\n                            this.previousTeamMember();\n                        }\n                    }\n                }\n            }, { passive: false });\n        });\n    }\n    \n    // ====== UTILITY FUNCTIONS ======\n    \n    resetTouchValues() {\n        this.touchStartX = 0;\n        this.touchStartY = 0;\n        this.touchEndX = 0;\n        this.touchEndY = 0;\n    }\n    \n    handleResize() {\n        // Reinitialize on orientation change\n        setTimeout(() => {\n            this.init();\n        }, 300);\n    }\n    \n    // ====== PUBLIC API ======\n    \n    getCurrentServiceTab() {\n        return this.currentServiceTab;\n    }\n    \n    getCurrentTeamMember() {\n        return this.currentTeamMember;\n    }\n    \n    goToService(index) {\n        this.switchToServiceTab(index);\n    }\n    \n    goToTeamMember(index) {\n        this.switchToTeamMember(index);\n    }\n}\n\n// Initialize Advanced Swipe Manager\ndocument.addEventListener('DOMContentLoaded', () => {\n    const advancedSwipe = new AdvancedSwipeManager();\n    \n    // Handle orientation changes\n    window.addEventListener('resize', () => advancedSwipe.handleResize());\n    window.addEventListener('orientationchange', () => {\n        setTimeout(() => advancedSwipe.handleResize(), 500);\n    });\n    \n    // Make available globally\n    window.advancedSwipeManager = advancedSwipe;\n});