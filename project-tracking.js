/**
 * Real-Time Project Tracking System
 * Provides live project status updates, timeline views, technician updates, and photo uploads
 */

class ProjectTrackingSystem {
    constructor() {
        this.currentProject = null;
        this.updateInterval = null;
        this.websocket = null;
        this.trackingContainer = null;
        this.isTracking = false;
        
        // Demo real-time updates data
        this.liveUpdates = {
            'PROJ-2024-001': {
                lastUpdate: Date.now(),
                currentPhase: 'installation',
                technician: 'Dennis Eckert',
                location: 'Erdgeschoss - Küche',
                nextUpdate: 'Verkabelung Steckdosen',
                photos: [],
                timeline: []
            },
            'PROJ-2024-003': {
                lastUpdate: Date.now() - 3600000, // 1 hour ago
                currentPhase: 'planning',
                technician: 'Jupp Fritsch',
                location: 'Vor Ort Begehung',
                nextUpdate: 'Materialbestellung',
                photos: [],
                timeline: []
            }
        };
        
        this.init();
    }
    
    init() {
        // Listen for project tracking requests
        document.addEventListener('trackProject', (event) => {
            this.startTracking(event.detail.projectId);
        });
        
        // Listen for close tracking
        document.addEventListener('closeTracking', () => {
            this.stopTracking();
        });
        
        // Generate demo timeline data
        this.generateDemoTimeline();
        
        // Start simulated real-time updates
        this.startSimulatedUpdates();
    }
    
    startTracking(projectId) {
        if (this.isTracking) {
            this.stopTracking();
        }
        
        this.currentProject = projectId;
        this.isTracking = true;
        
        // Get project data from customer dashboard
        const project = this.getProjectData(projectId);
        if (!project) {
            console.error('Project not found:', projectId);
            return;
        }
        
        this.createTrackingInterface(project);
        this.startRealTimeUpdates();
        
        // Trigger tracking started event
        document.dispatchEvent(new CustomEvent('trackingStarted', {
            detail: { projectId, project }
        }));
    }
    
    stopTracking() {
        if (this.trackingContainer) {
            this.trackingContainer.remove();
            this.trackingContainer = null;
        }
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        
        this.isTracking = false;
        this.currentProject = null;
        
        document.dispatchEvent(new CustomEvent('trackingStopped'));
    }
    
    createTrackingInterface(project) {
        this.trackingContainer = document.createElement('div');
        this.trackingContainer.className = 'project-tracking-modal';
        this.trackingContainer.innerHTML = `
            <div class="tracking-overlay"></div>
            <div class="tracking-content">
                <!-- Tracking Header -->
                <div class="tracking-header">
                    <div class="tracking-header-content">
                        <div class="project-info">
                            <div class="project-icon">
                                <i class="fas fa-hammer"></i>
                            </div>
                            <div class="project-details">
                                <h2>${project.title}</h2>
                                <p class="project-meta">${project.location} • Projekt ${project.id}</p>
                            </div>
                        </div>
                        <div class="tracking-actions">
                            <button class="btn-refresh" id="refreshTracking" title="Aktualisieren">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                            <button class="btn-notifications" id="toggleNotifications" title="Benachrichtigungen">
                                <i class="fas fa-bell"></i>
                                <span class="notification-dot active"></span>
                            </button>
                            <button class="btn-tracking-close" id="closeTracking" title="Schließen">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Project Status Bar -->
                <div class="project-status-bar">
                    <div class="status-indicator ${project.status}">
                        <i class="fas fa-circle"></i>
                        <span>${this.getStatusText(project.status)}</span>
                    </div>
                    <div class="project-progress">
                        <div class="progress-bar-container">
                            <div class="progress-bar">
                                <div class="progress-fill" data-progress="${project.progress}">
                                    <span class="progress-text">${project.progress}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="last-update">
                        <i class="fas fa-clock"></i>
                        <span id="lastUpdateTime">Gerade eben</span>
                    </div>
                </div>
                
                <!-- Tracking Navigation -->
                <div class="tracking-nav">
                    <button class="tracking-nav-btn active" data-view="live">
                        <i class="fas fa-broadcast-tower"></i>
                        <span>Live Status</span>
                    </button>
                    <button class="tracking-nav-btn" data-view="timeline">
                        <i class="fas fa-history"></i>
                        <span>Timeline</span>
                    </button>
                    <button class="tracking-nav-btn" data-view="photos">
                        <i class="fas fa-camera"></i>
                        <span>Fotos</span>
                        <span class="photo-count" id="photoCount">0</span>
                    </button>
                    <button class="tracking-nav-btn" data-view="technician">
                        <i class="fas fa-hard-hat"></i>
                        <span>Techniker</span>
                    </button>
                    <button class="tracking-nav-btn" data-view="documents">
                        <i class="fas fa-file-alt"></i>
                        <span>Dokumente</span>
                    </button>
                </div>
                
                <!-- Tracking Content -->
                <div class="tracking-main">
                    <!-- Live Status View -->
                    <div class="tracking-view active" id="live-view">
                        <div class="live-status-grid">
                            <!-- Current Activity Card -->
                            <div class="status-card primary">
                                <div class="card-header">
                                    <h3>Aktuelle Tätigkeit</h3>
                                    <div class="live-indicator">
                                        <span class="live-dot"></span>
                                        LIVE
                                    </div>
                                </div>
                                <div class="card-content">
                                    <div class="current-activity">
                                        <div class="activity-icon">
                                            <i class="fas fa-tools"></i>
                                        </div>
                                        <div class="activity-info">
                                            <h4 id="currentActivity">Elektroinstallation Küche</h4>
                                            <p id="activityDetails">Steckdosen und Schalter werden installiert</p>
                                            <div class="activity-meta">
                                                <span><i class="fas fa-map-marker-alt"></i> <span id="currentLocation">Erdgeschoss - Küche</span></span>
                                                <span><i class="fas fa-clock"></i> Seit 09:30 Uhr</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Technician Info Card -->
                            <div class="status-card">
                                <div class="card-header">
                                    <h3>Techniker vor Ort</h3>
                                    <div class="online-status online">
                                        <i class="fas fa-circle"></i>
                                        Online
                                    </div>
                                </div>
                                <div class="card-content">
                                    <div class="technician-info">
                                        <div class="technician-avatar">
                                            <i class="fas fa-hard-hat"></i>
                                        </div>
                                        <div class="technician-details">
                                            <h4 id="technicianName">Dennis Eckert</h4>
                                            <p>Elektrotechnik-Meister</p>
                                            <div class="technician-contact">
                                                <button class="btn-contact-tech">
                                                    <i class="fas fa-phone"></i>
                                                    Kontaktieren
                                                </button>
                                                <button class="btn-message-tech">
                                                    <i class="fas fa-comment"></i>
                                                    Nachricht
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Progress Overview Card -->
                            <div class="status-card full-width">
                                <div class="card-header">
                                    <h3>Projektfortschritt heute</h3>
                                    <div class="progress-percentage">${project.progress}%</div>
                                </div>
                                <div class="card-content">
                                    <div class="progress-phases">
                                        <div class="phase completed">
                                            <div class="phase-icon">
                                                <i class="fas fa-check-circle"></i>
                                            </div>
                                            <div class="phase-info">
                                                <h5>Planung & Vorbereitung</h5>
                                                <p>Abgeschlossen um 08:30</p>
                                            </div>
                                        </div>
                                        
                                        <div class="phase active">
                                            <div class="phase-icon">
                                                <i class="fas fa-cog fa-spin"></i>
                                            </div>
                                            <div class="phase-info">
                                                <h5>Installation</h5>
                                                <p>Läuft seit 09:30</p>
                                            </div>
                                        </div>
                                        
                                        <div class="phase pending">
                                            <div class="phase-icon">
                                                <i class="fas fa-clock"></i>
                                            </div>
                                            <div class="phase-info">
                                                <h5>Abschluss & Test</h5>
                                                <p>Geplant für 14:00</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Next Steps Card -->
                            <div class="status-card">
                                <div class="card-header">
                                    <h3>Nächste Schritte</h3>
                                    <div class="eta">ETA: 2h</div>
                                </div>
                                <div class="card-content">
                                    <div class="next-steps">
                                        <div class="step">
                                            <div class="step-number">1</div>
                                            <div class="step-info">
                                                <h5>Verkabelung abschließen</h5>
                                                <p>Alle Steckdosen anschließen</p>
                                            </div>
                                        </div>
                                        <div class="step">
                                            <div class="step-number">2</div>
                                            <div class="step-info">
                                                <h5>Funktionstest</h5>
                                                <p>Alle Installationen prüfen</p>
                                            </div>
                                        </div>
                                        <div class="step">
                                            <div class="step-number">3</div>
                                            <div class="step-info">
                                                <h5>Dokumentation</h5>
                                                <p>Abnahmeprotokoll erstellen</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Material Status Card -->
                            <div class="status-card">
                                <div class="card-header">
                                    <h3>Material & Equipment</h3>
                                    <div class="material-status ok">
                                        <i class="fas fa-check-circle"></i>
                                        Vollständig
                                    </div>
                                </div>
                                <div class="card-content">
                                    <div class="material-list">
                                        <div class="material-item">
                                            <i class="fas fa-plug"></i>
                                            <span>8x Steckdosen</span>
                                            <div class="item-status ok">✓</div>
                                        </div>
                                        <div class="material-item">
                                            <i class="fas fa-lightbulb"></i>
                                            <span>5x Lichtschalter</span>
                                            <div class="item-status ok">✓</div>
                                        </div>
                                        <div class="material-item">
                                            <i class="fas fa-bolt"></i>
                                            <span>25m Kabel NYM-J</span>
                                            <div class="item-status ok">✓</div>
                                        </div>
                                        <div class="material-item">
                                            <i class="fas fa-shield-alt"></i>
                                            <span>FI-Schalter</span>
                                            <div class="item-status ok">✓</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Timeline View -->
                    <div class="tracking-view" id="timeline-view">
                        <div class="timeline-container">
                            <div class="timeline-header">
                                <h3>Projekt Timeline</h3>
                                <div class="timeline-filters">
                                    <button class="filter-btn active" data-filter="today">Heute</button>
                                    <button class="filter-btn" data-filter="week">Diese Woche</button>
                                    <button class="filter-btn" data-filter="all">Alle</button>
                                </div>
                            </div>
                            
                            <div class="timeline-content" id="timelineContent">
                                <!-- Timeline items will be populated by JavaScript -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Photos View -->
                    <div class="tracking-view" id="photos-view">
                        <div class="photos-container">
                            <div class="photos-header">
                                <h3>Projekt Fotos</h3>
                                <button class="btn-upload-photos" id="uploadPhotos">
                                    <i class="fas fa-camera"></i>
                                    Fotos hochladen
                                </button>
                            </div>
                            
                            <div class="photos-grid" id="photosGrid">
                                <!-- Photos will be populated by JavaScript -->
                            </div>
                            
                            <!-- Photo Upload Area -->
                            <div class="photo-upload-area" id="photoUploadArea" style="display: none;">
                                <div class="upload-zone">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p>Fotos hier hinziehen oder klicken zum Auswählen</p>
                                    <input type="file" id="photoInput" accept="image/*" multiple style="display: none;">
                                    <button class="btn-select-files" onclick="document.getElementById('photoInput').click()">
                                        Dateien auswählen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Technician View -->
                    <div class="tracking-view" id="technician-view">
                        <div class="technician-details-container">
                            <div class="technician-profile">
                                <div class="profile-header">
                                    <div class="technician-avatar-large">
                                        <i class="fas fa-hard-hat"></i>
                                    </div>
                                    <div class="profile-info">
                                        <h3>Dennis Eckert</h3>
                                        <p>Elektrotechnik-Meister</p>
                                        <div class="profile-badges">
                                            <span class="badge">KNX Spezialist</span>
                                            <span class="badge">15+ Jahre Erfahrung</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="technician-stats">
                                    <div class="stat">
                                        <h4>247</h4>
                                        <p>Projekte abgeschlossen</p>
                                    </div>
                                    <div class="stat">
                                        <h4>4.9</h4>
                                        <p>Kundenbewertung</p>
                                    </div>
                                    <div class="stat">
                                        <h4>98%</h4>
                                        <p>Termintreue</p>
                                    </div>
                                </div>
                                
                                <div class="technician-contact-options">
                                    <button class="contact-option">
                                        <i class="fas fa-phone"></i>
                                        <span>Anrufen</span>
                                    </button>
                                    <button class="contact-option">
                                        <i class="fas fa-sms"></i>
                                        <span>SMS</span>
                                    </button>
                                    <button class="contact-option">
                                        <i class="fas fa-comment"></i>
                                        <span>Chat</span>
                                    </button>
                                    <button class="contact-option">
                                        <i class="fas fa-envelope"></i>
                                        <span>E-Mail</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Documents View -->
                    <div class="tracking-view" id="documents-view">
                        <div class="documents-container">
                            <div class="documents-header">
                                <h3>Projekt Dokumente</h3>
                                <button class="btn-generate-report" id="generateReport">
                                    <i class="fas fa-file-pdf"></i>
                                    Bericht erstellen
                                </button>
                            </div>
                            
                            <div class="documents-grid">
                                <div class="document-card">
                                    <div class="doc-icon">
                                        <i class="fas fa-clipboard-list"></i>
                                    </div>
                                    <div class="doc-info">
                                        <h4>Arbeitsprotokoll</h4>
                                        <p>Täglich aktualisiert</p>
                                        <span class="doc-date">Heute, 11:30</span>
                                    </div>
                                    <button class="btn-doc-action">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                                
                                <div class="document-card">
                                    <div class="doc-icon">
                                        <i class="fas fa-image"></i>
                                    </div>
                                    <div class="doc-info">
                                        <h4>Foto-Dokumentation</h4>
                                        <p>Fortschrittsdokumentation</p>
                                        <span class="doc-date">Heute, 10:15</span>
                                    </div>
                                    <button class="btn-doc-action">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                                
                                <div class="document-card">
                                    <div class="doc-icon">
                                        <i class="fas fa-check-double"></i>
                                    </div>
                                    <div class="doc-info">
                                        <h4>Abnahmeprotokoll</h4>
                                        <p>Nach Fertigstellung</p>
                                        <span class="doc-date">Ausstehend</span>
                                    </div>
                                    <button class="btn-doc-action disabled">
                                        <i class="fas fa-clock"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.trackingContainer);
        
        // Add event listeners
        this.addTrackingEventListeners();
        
        // Initialize views
        this.initializeViews();
        
        // Show tracking with animation
        setTimeout(() => {
            this.trackingContainer.classList.add('show');
        }, 50);
    }
    
    addTrackingEventListeners() {
        // Navigation
        const navBtns = this.trackingContainer.querySelectorAll('.tracking-nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.showTrackingView(view);
                
                // Update active nav
                navBtns.forEach(nav => nav.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Close tracking
        const closeBtn = this.trackingContainer.querySelector('#closeTracking');
        closeBtn.addEventListener('click', () => {
            this.stopTracking();
        });
        
        // Refresh
        const refreshBtn = this.trackingContainer.querySelector('#refreshTracking');
        refreshBtn.addEventListener('click', () => {
            this.refreshTrackingData();
        });
        
        // Photo upload
        const uploadBtn = this.trackingContainer.querySelector('#uploadPhotos');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.togglePhotoUpload();
            });
        }
        
        // Photo input
        const photoInput = this.trackingContainer.querySelector('#photoInput');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => {
                this.handlePhotoUpload(e.target.files);
            });
        }
        
        // Timeline filters
        const filterBtns = this.trackingContainer.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(f => f.classList.remove('active'));
                btn.classList.add('active');
                this.filterTimeline(btn.dataset.filter);
            });
        });
        
        // Overlay close
        const overlay = this.trackingContainer.querySelector('.tracking-overlay');
        overlay.addEventListener('click', () => {
            this.stopTracking();
        });
    }
    
    showTrackingView(viewName) {
        // Hide all views
        const views = this.trackingContainer.querySelectorAll('.tracking-view');
        views.forEach(view => view.classList.remove('active'));
        
        // Show selected view
        const targetView = this.trackingContainer.querySelector(`#${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
            
            // Load view-specific data
            this.loadTrackingViewData(viewName);
        }
    }
    
    loadTrackingViewData(viewName) {
        switch (viewName) {
            case 'timeline':
                this.loadTimelineData();
                break;
            case 'photos':
                this.loadPhotos();
                break;
            case 'technician':
                this.loadTechnicianData();
                break;
            case 'documents':
                this.loadDocuments();
                break;
        }
    }
    
    initializeViews() {
        // Initialize timeline
        this.loadTimelineData();
        
        // Initialize photos
        this.loadPhotos();
        
        // Start progress bar animation
        this.animateProgressBar();
    }
    
    animateProgressBar() {
        const progressFill = this.trackingContainer.querySelector('.progress-fill');
        const progress = progressFill.dataset.progress;
        
        setTimeout(() => {
            progressFill.style.width = progress + '%';
        }, 500);
    }
    
    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        this.updateInterval = setInterval(() => {
            this.updateLiveStatus();
        }, 30000);
        
        // Initial update
        this.updateLiveStatus();
    }
    
    updateLiveStatus() {
        const projectData = this.liveUpdates[this.currentProject];
        if (!projectData) return;
        
        // Update last update time
        const lastUpdateEl = this.trackingContainer.querySelector('#lastUpdateTime');
        if (lastUpdateEl) {
            lastUpdateEl.textContent = this.getRelativeTime(projectData.lastUpdate);
        }
        
        // Simulate activity changes
        this.simulateActivityUpdate();
    }
    
    simulateActivityUpdate() {
        const activities = [
            'Steckdosen installieren',
            'Lichtschalter montieren',
            'Kabelverlegung prüfen',
            'Sicherungen testen',
            'Abschlussarbeiten'
        ];
        
        const locations = [
            'Erdgeschoss - Küche',
            'Erdgeschoss - Wohnzimmer',
            'Obergeschoss - Schlafzimmer',
            'Keller - Technikraum'
        ];
        
        // Random activity update (10% chance)
        if (Math.random() < 0.1) {
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            
            const activityEl = this.trackingContainer.querySelector('#currentActivity');
            const locationEl = this.trackingContainer.querySelector('#currentLocation');
            
            if (activityEl) activityEl.textContent = randomActivity;
            if (locationEl) locationEl.textContent = randomLocation;
            
            // Add to timeline
            this.addTimelineEntry(randomActivity, 'activity');
        }
    }
    
    loadTimelineData() {
        const timelineContainer = this.trackingContainer.querySelector('#timelineContent');
        if (!timelineContainer) return;
        
        const timeline = this.generateProjectTimeline();
        
        timelineContainer.innerHTML = timeline.map(entry => `
            <div class="timeline-item ${entry.type}">
                <div class="timeline-time">
                    ${entry.time}
                </div>
                <div class="timeline-content">
                    <div class="timeline-icon">
                        <i class="${entry.icon}"></i>
                    </div>
                    <div class="timeline-details">
                        <h4>${entry.title}</h4>
                        <p>${entry.description}</p>
                        ${entry.photo ? `<div class="timeline-photo">
                            <img src="${entry.photo}" alt="Fortschrittsfoto" loading="lazy">
                        </div>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    generateProjectTimeline() {
        return [
            {
                time: '11:45',
                title: 'Steckdosen Installation',
                description: 'Alle 8 Steckdosen in der Küche erfolgreich installiert',
                type: 'completed',
                icon: 'fas fa-check-circle',
                photo: null
            },
            {
                time: '10:30',
                title: 'Kabelverlegung abgeschlossen',
                description: 'NYM-J Kabel für alle Stromkreise verlegt',
                type: 'completed',
                icon: 'fas fa-bolt',
                photo: null
            },
            {
                time: '09:15',
                title: 'Arbeiten gestartet',
                description: 'Techniker Dennis Eckert vor Ort angekommen',
                type: 'info',
                icon: 'fas fa-play-circle',
                photo: null
            },
            {
                time: '08:30',
                title: 'Materiallieferung',
                description: 'Alle benötigten Materialien geliefert und geprüft',
                type: 'delivery',
                icon: 'fas fa-truck',
                photo: null
            }
        ];
    }
    
    loadPhotos() {
        const photosGrid = this.trackingContainer.querySelector('#photosGrid');
        if (!photosGrid) return;
        
        // Demo photos (would normally come from server)
        const demoPhotos = [
            'Vor Beginn der Arbeiten - Küche',
            'Kabelverlegung in Wand',
            'Installierte Steckdosen',
            'Sicherungskasten Update'
        ];
        
        photosGrid.innerHTML = demoPhotos.map((caption, index) => `
            <div class="photo-item">
                <div class="photo-placeholder">
                    <i class="fas fa-image"></i>
                    <p>${caption}</p>
                </div>
                <div class="photo-info">
                    <span class="photo-time">Heute, ${9 + index}:${(index * 15).toString().padStart(2, '0')}</span>
                    <button class="btn-photo-action">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Update photo count
        const photoCount = this.trackingContainer.querySelector('#photoCount');
        if (photoCount) {
            photoCount.textContent = demoPhotos.length;
        }
    }
    
    // Utility methods
    getProjectData(projectId) {
        // Get project from customer data (would normally be from API)
        if (window.customerDashboard && window.customerDashboard.currentCustomer) {
            return window.customerDashboard.currentCustomer.projects.find(p => p.id === projectId);
        }
        
        // Fallback demo project
        return {
            id: projectId,
            title: 'Smart Home Installation',
            location: 'Musterhausen, Beispielstraße 123',
            status: 'active',
            progress: 65,
            startDate: new Date().toISOString(),
            budget: 5500
        };
    }
    
    getStatusText(status) {
        const statusMap = {
            'active': 'In Bearbeitung',
            'completed': 'Abgeschlossen',
            'planning': 'In Planung',
            'paused': 'Pausiert'
        };
        return statusMap[status] || status;
    }
    
    getRelativeTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        
        if (minutes < 1) return 'Gerade eben';
        if (minutes < 60) return `vor ${minutes} Min`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `vor ${hours}h`;
        
        return 'vor mehr als 1 Tag';
    }
    
    refreshTrackingData() {
        // Show refresh animation
        const refreshBtn = this.trackingContainer.querySelector('#refreshTracking i');
        refreshBtn.classList.add('fa-spin');
        
        setTimeout(() => {
            refreshBtn.classList.remove('fa-spin');
            this.updateLiveStatus();
            
            // Show success notification
            this.showNotification('Daten aktualisiert', 'success');
        }, 1000);
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `tracking-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        this.trackingContainer.appendChild(notification);
        
        // Show and auto-hide
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    togglePhotoUpload() {
        const uploadArea = this.trackingContainer.querySelector('#photoUploadArea');
        if (uploadArea.style.display === 'none') {
            uploadArea.style.display = 'block';
        } else {
            uploadArea.style.display = 'none';
        }
    }
    
    handlePhotoUpload(files) {
        console.log('Uploading photos:', files);
        // Handle photo upload logic here
        this.showNotification(`${files.length} Foto(s) hochgeladen`, 'success');
    }
    
    filterTimeline(filter) {
        // Timeline filtering logic
        console.log('Filtering timeline:', filter);
    }
    
    generateDemoTimeline() {
        // Generate more detailed demo timeline data
        this.demoTimeline = this.generateProjectTimeline();
    }
    
    startSimulatedUpdates() {
        // Start background simulation of real-time updates
        setInterval(() => {
            // Randomly update project data
            Object.keys(this.liveUpdates).forEach(projectId => {
                if (Math.random() < 0.05) { // 5% chance per interval
                    this.liveUpdates[projectId].lastUpdate = Date.now();
                }
            });
        }, 10000); // Every 10 seconds
    }
    
    addTimelineEntry(activity, type) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('de-DE', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Add to timeline (if timeline is currently loaded)
        const timelineContainer = this.trackingContainer?.querySelector('#timelineContent');
        if (timelineContainer) {
            const newEntry = document.createElement('div');
            newEntry.className = `timeline-item ${type} new`;
            newEntry.innerHTML = `
                <div class="timeline-time">${timeString}</div>
                <div class="timeline-content">
                    <div class="timeline-icon">
                        <i class="fas fa-cog fa-spin"></i>
                    </div>
                    <div class="timeline-details">
                        <h4>${activity}</h4>
                        <p>Live-Update vom Techniker</p>
                    </div>
                </div>
            `;
            
            timelineContainer.insertBefore(newEntry, timelineContainer.firstChild);
            
            // Remove 'new' class after animation
            setTimeout(() => {
                newEntry.classList.remove('new');
                const icon = newEntry.querySelector('.fas');
                icon.classList.remove('fa-spin', 'fa-cog');
                icon.classList.add('fa-check-circle');
            }, 2000);
        }
    }
}

// Initialize project tracking system
const projectTrackingSystem = new ProjectTrackingSystem();

// Export for global access
window.projectTrackingSystem = projectTrackingSystem;

// Add integration with customer dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Hook into customer dashboard project tracking buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('[onclick*="trackProject"]')) {
            e.preventDefault();
            const projectId = e.target.closest('[onclick*="trackProject"]').onclick.toString().match(/'([^']+)'/)[1];
            projectTrackingSystem.startTracking(projectId);
        }
    });
});