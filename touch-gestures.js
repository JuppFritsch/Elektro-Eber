// ====== TOUCH GESTURES & MOBILE INTERACTIONS ======

class TouchGestureManager {
    constructor() {
        this.isTouch = 'ontouchstart' in window;
        this.currentProject = 0;
        this.projectCards = [];
        this.swipeThreshold = 50;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        
        this.init();
    }
    
    init() {
        if (!this.isTouch) {
            console.log('Touch gestures not supported on this device');
            return;
        }
        
        this.initProjectGalleryGestures();
        this.initServiceSwipeGestures();
        this.initTeamSwipeGestures();
        this.initGeneralTouchOptimizations();
        
        console.log('✨ Touch gestures initialized');
    }
    
    // ====== PROJECT GALLERY GESTURES ======
    
    initProjectGalleryGestures() {
        const projectsGrid = document.querySelector('.projects-grid');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (!projectsGrid || projectCards.length === 0) return;
        
        this.projectCards = Array.from(projectCards);
        
        // Transform grid for mobile swipe
        this.createMobileProjectGallery(projectsGrid);
        
        // Add touch events
        projectsGrid.addEventListener('touchstart', (e) => this.handleProjectTouchStart(e), { passive: false });
        projectsGrid.addEventListener('touchmove', (e) => this.handleProjectTouchMove(e), { passive: false });
        projectsGrid.addEventListener('touchend', (e) => this.handleProjectTouchEnd(e), { passive: false });
        
        // Add individual project touch events
        this.projectCards.forEach((card, index) => {
            card.addEventListener('touchstart', (e) => this.handleProjectCardTouchStart(e, card, index));
            card.addEventListener('touchend', (e) => this.handleProjectCardTouchEnd(e, card, index));
        });
        
        // Create navigation indicators
        this.createProjectIndicators();
    }
    
    createMobileProjectGallery(grid) {
        // Only transform on mobile
        if (window.innerWidth <= 768) {
            grid.style.display = 'flex';
            grid.style.flexWrap = 'nowrap';
            grid.style.overflowX = 'auto';
            grid.style.scrollBehavior = 'smooth';
            grid.style.scrollSnapType = 'x mandatory';
            grid.classList.add('mobile-gallery');
            
            this.projectCards.forEach((card, index) => {
                card.style.minWidth = '85%';
                card.style.marginRight = '1rem';
                card.style.scrollSnapAlign = 'center';
                card.dataset.index = index;
            });
        }
    }
    
    createProjectIndicators() {
        const projectsSection = document.getElementById('projects');
        if (!projectsSection || window.innerWidth > 768) return;
        
        const indicators = document.createElement('div');
        indicators.className = 'project-indicators';
        
        this.projectCards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `project-indicator ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            dot.addEventListener('click', () => this.goToProject(index));
            indicators.appendChild(dot);
        });
        
        projectsSection.appendChild(indicators);
    }
    
    handleProjectTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }
    
    handleProjectTouchMove(e) {
        if (!this.touchStartX || !this.touchStartY) return;
        
        this.touchEndX = e.touches[0].clientX;
        this.touchEndY = e.touches[0].clientY;
        
        const diffX = this.touchStartX - this.touchEndX;
        const diffY = this.touchStartY - this.touchEndY;
        
        // Prevent vertical scroll if horizontal swipe is dominant
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
            e.preventDefault();
        }
    }
    
    handleProjectTouchEnd(e) {
        if (!this.touchStartX || !this.touchEndX) return;
        
        const diffX = this.touchStartX - this.touchEndX;
        const diffY = this.touchStartY - this.touchEndY;
        
        // Check if it's a horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.swipeThreshold) {
            if (diffX > 0) {
                // Swipe left - next project
                this.nextProject();
            } else {
                // Swipe right - previous project
                this.previousProject();
            }
        }
        
        this.resetTouchValues();
    }
    
    handleProjectCardTouchStart(e, card, index) {
        card.classList.add('touch-active');
        
        // Haptic feedback if supported
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    }
    
    handleProjectCardTouchEnd(e, card, index) {
        card.classList.remove('touch-active');
        
        // Check for tap (not swipe)
        if (this.isTap()) {
            this.showProjectDetails(index);
        }
    }
    
    isTap() {
        const diffX = Math.abs(this.touchStartX - this.touchEndX);
        const diffY = Math.abs(this.touchStartY - this.touchEndY);
        return diffX < 10 && diffY < 10;
    }
    
    nextProject() {
        if (this.currentProject < this.projectCards.length - 1) {
            this.currentProject++;
            this.goToProject(this.currentProject);
        }
    }
    
    previousProject() {
        if (this.currentProject > 0) {
            this.currentProject--;
            this.goToProject(this.currentProject);
        }
    }
    
    goToProject(index) {
        const projectsGrid = document.querySelector('.projects-grid');
        const targetCard = this.projectCards[index];
        
        if (!projectsGrid || !targetCard) return;
        
        // Scroll to project
        targetCard.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
        
        this.currentProject = index;
        this.updateProjectIndicators();
        
        // Add visual feedback
        this.highlightCurrentProject();
    }
    
    updateProjectIndicators() {
        const indicators = document.querySelectorAll('.project-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentProject);
        });
    }
    
    highlightCurrentProject() {
        this.projectCards.forEach((card, index) => {
            card.classList.toggle('current', index === this.currentProject);
        });
    }
    
    showProjectDetails(index) {
        const project = this.projectCards[index];
        if (!project) return;
        
        // Create project detail modal
        this.createProjectModal(project);
    }
    
    createProjectModal(projectCard) {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="project-modal-content">
                <div class="project-modal-header">
                    <h3>${projectCard.querySelector('h3').textContent}</h3>
                    <button class="project-modal-close">&times;</button>
                </div>
                <div class="project-modal-body">
                    <div class="project-image-large">
                        ${projectCard.querySelector('.project-image').innerHTML}
                    </div>
                    <div class="project-description">
                        <p>${projectCard.querySelector('p').textContent}</p>
                        <div class="project-details-extended">
                            ${projectCard.querySelector('.project-meta').innerHTML}
                            <div class="project-technologies">
                                <strong>Technologien:</strong>
                                <span class="tech-tags">
                                    <span class="tech-tag">KNX</span>
                                    <span class="tech-tag">LED</span>
                                    <span class="tech-tag">Smart Home</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="project-modal-actions">
                    <button class="btn-primary" onclick="this.closest('.project-modal').remove(); document.getElementById('openProjectModal').click();">
                        📋 Ähnliches Projekt planen
                    </button>
                </div>
            </div>
        `;
        
        // Close modal on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Close button
        modal.querySelector('.project-modal-close').addEventListener('click', () => modal.remove());
        
        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => modal.classList.add('show'), 10);
    }
    
    // ====== SERVICE SWIPE GESTURES ======
    
    initServiceSwipeGestures() {
        const servicesContainer = document.querySelector('.services-grid');
        if (!servicesContainer) return;
        
        // Transform services for mobile
        this.createMobileServicesCarousel(servicesContainer);
        
        // Add touch events
        servicesContainer.addEventListener('touchstart', (e) => this.handleServiceTouchStart(e));
        servicesContainer.addEventListener('touchend', (e) => this.handleServiceTouchEnd(e));
    }
    
    createMobileServicesCarousel(container) {
        if (window.innerWidth <= 768) {
            const serviceCards = container.querySelectorAll('.service-card');
            
            container.style.display = 'flex';
            container.style.overflowX = 'auto';
            container.style.scrollSnapType = 'x mandatory';
            container.style.gap = '1rem';
            container.classList.add('mobile-services');
            
            serviceCards.forEach(card => {
                card.style.minWidth = '280px';
                card.style.scrollSnapAlign = 'center';
            });
        }
    }
    
    handleServiceTouchStart(e) {
        this.serviceStartX = e.touches[0].clientX;
    }
    
    handleServiceTouchEnd(e) {
        if (!this.serviceStartX) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = this.serviceStartX - endX;
        
        if (Math.abs(diff) > this.swipeThreshold) {
            // Provide haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(15);
            }
        }
        
        this.serviceStartX = 0;
    }
    
    // ====== TEAM SWIPE GESTURES ======
    
    initTeamSwipeGestures() {
        const teamContainer = document.querySelector('.team-grid');
        if (!teamContainer) return;
        
        this.createMobileTeamCarousel(teamContainer);
        
        teamContainer.addEventListener('touchstart', (e) => this.handleTeamTouchStart(e));
        teamContainer.addEventListener('touchend', (e) => this.handleTeamTouchEnd(e));
    }
    
    createMobileTeamCarousel(container) {
        if (window.innerWidth <= 768) {
            const teamMembers = container.querySelectorAll('.team-member');
            
            container.style.display = 'flex';
            container.style.overflowX = 'auto';
            container.style.scrollSnapType = 'x mandatory';
            container.style.gap = '1rem';
            container.classList.add('mobile-team');
            
            teamMembers.forEach(member => {
                member.style.minWidth = '250px';
                member.style.scrollSnapAlign = 'center';
            });
        }
    }
    
    handleTeamTouchStart(e) {
        this.teamStartX = e.touches[0].clientX;
    }
    
    handleTeamTouchEnd(e) {
        if (!this.teamStartX) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = this.teamStartX - endX;
        
        if (Math.abs(diff) > this.swipeThreshold) {
            if (navigator.vibrate) {
                navigator.vibrate(15);
            }
        }
        
        this.teamStartX = 0;
    }
    
    // ====== GENERAL TOUCH OPTIMIZATIONS ======
    
    initGeneralTouchOptimizations() {
        // Improve button touch targets
        this.optimizeTouchTargets();
        
        // Add touch feedback to buttons
        this.addTouchFeedback();
        
        // Prevent zoom on double-tap
        this.preventDoubleTabZoom();
    }
    
    optimizeTouchTargets() {
        const buttons = document.querySelectorAll('button, .btn, .filter-btn, .quick-action-btn');
        buttons.forEach(button => {
            // Ensure minimum touch target size (44px)
            const rect = button.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                button.style.minWidth = '44px';
                button.style.minHeight = '44px';
                button.classList.add('touch-optimized');
            }
        });
    }
    
    addTouchFeedback() {
        const interactiveElements = document.querySelectorAll('button, .btn, .card, .project-card, .service-card, .team-member');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-feedback');
                
                if (navigator.vibrate) {
                    navigator.vibrate(5);
                }
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('touch-feedback');
                }, 150);
            });
        });
    }
    
    preventDoubleTabZoom() {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    }
    
    resetTouchValues() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
    }
    
    // ====== RESPONSIVE UTILITIES ======
    
    handleResize() {
        // Reinitialize on orientation change
        setTimeout(() => {
            this.init();
        }, 300);
    }
}

// Initialize Touch Gestures
document.addEventListener('DOMContentLoaded', () => {
    const touchManager = new TouchGestureManager();
    
    // Handle orientation changes
    window.addEventListener('resize', () => touchManager.handleResize());
    window.addEventListener('orientationchange', () => {
        setTimeout(() => touchManager.handleResize(), 500);
    });
    
    // Make available globally
    window.touchManager = touchManager;
});