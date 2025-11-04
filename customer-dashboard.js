/**
 * Customer Dashboard Interface System
 * Provides comprehensive customer dashboard functionality
 */

class CustomerDashboard {
    constructor() {
        this.currentCustomer = null;
        this.currentView = 'overview';
        this.dashboardContainer = null;
        this.projectsData = [];
        this.invoicesData = [];
        this.maintenanceData = [];
        
        this.init();
    }
    
    init() {
        // Listen for successful authentication
        document.addEventListener('customerLoggedIn', (event) => {
            this.currentCustomer = event.detail.customer;
            this.showDashboard();
        });
        
        // Listen for logout
        document.addEventListener('customerLoggedOut', () => {
            this.hideDashboard();
        });
    }
    
    showDashboard() {
        if (!this.currentCustomer) return;
        
        this.createDashboard();
        this.loadCustomerData();
        this.showView('overview');
    }
    
    hideDashboard() {
        if (this.dashboardContainer) {
            this.dashboardContainer.remove();
            this.dashboardContainer = null;
        }
        this.currentCustomer = null;
    }
    
    createDashboard() {
        // Create main dashboard container
        this.dashboardContainer = document.createElement('div');
        this.dashboardContainer.className = 'customer-dashboard';
        this.dashboardContainer.innerHTML = `
            <div class="dashboard-overlay"></div>
            <div class="dashboard-content">
                <!-- Dashboard Header -->
                <div class="dashboard-header">
                    <div class="dashboard-header-content">
                        <div class="customer-info">
                            <div class="customer-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <div class="customer-details">
                                <h2>Willkommen, ${this.currentCustomer.firstName}!</h2>
                                <p class="customer-subtitle">Kunde seit ${this.formatDate(this.currentCustomer.memberSince)}</p>
                            </div>
                        </div>
                        <div class="dashboard-actions">
                            <button class="btn-dashboard-settings" id="dashboardSettings" title="Einstellungen">
                                <i class="fas fa-cog"></i>
                            </button>
                            <button class="btn-dashboard-close" id="dashboardClose" title="Dashboard schließen">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Dashboard Navigation -->
                <div class="dashboard-nav">
                    <div class="nav-container">
                        <button class="nav-item active" data-view="overview">
                            <i class="fas fa-home"></i>
                            <span>Übersicht</span>
                        </button>
                        <button class="nav-item" data-view="projects">
                            <i class="fas fa-briefcase"></i>
                            <span>Projekte</span>
                            <span class="nav-badge" id="projectsBadge">0</span>
                        </button>
                        <button class="nav-item" data-view="invoices">
                            <i class="fas fa-file-invoice"></i>
                            <span>Rechnungen</span>
                        </button>
                        <button class="nav-item" data-view="maintenance">
                            <i class="fas fa-tools"></i>
                            <span>Wartung</span>
                            <span class="nav-badge warning" id="maintenanceBadge">0</span>
                        </button>
                        <button class="nav-item" data-view="documents">
                            <i class="fas fa-folder"></i>
                            <span>Dokumente</span>
                        </button>
                        <button class="nav-item" data-view="profile">
                            <i class="fas fa-user-edit"></i>
                            <span>Profil</span>
                        </button>
                    </div>
                </div>
                
                <!-- Dashboard Main Content -->
                <div class="dashboard-main">
                    <!-- Overview View -->
                    <div class="dashboard-view active" id="overview-view">
                        <div class="view-header">
                            <h3>Dashboard Übersicht</h3>
                            <p>Ihr persönlicher Bereich für alle Elektro Eber Services</p>
                        </div>
                        
                        <!-- Quick Stats -->
                        <div class="dashboard-stats">
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-briefcase"></i>
                                </div>
                                <div class="stat-content">
                                    <h4 id="totalProjects">0</h4>
                                    <p>Gesamte Projekte</p>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-spinner"></i>
                                </div>
                                <div class="stat-content">
                                    <h4 id="activeProjects">0</h4>
                                    <p>Laufende Projekte</p>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-euro-sign"></i>
                                </div>
                                <div class="stat-content">
                                    <h4 id="totalInvoices">0,00 €</h4>
                                    <p>Rechnungssumme</p>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon maintenance">
                                    <i class="fas fa-calendar-check"></i>
                                </div>
                                <div class="stat-content">
                                    <h4 id="nextMaintenance">-</h4>
                                    <p>Nächste Wartung</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Recent Activity -->
                        <div class="dashboard-recent">
                            <h4>Aktuelle Aktivitäten</h4>
                            <div class="recent-activities" id="recentActivities">
                                <!-- Activities will be loaded here -->
                            </div>
                        </div>
                        
                        <!-- Quick Actions -->
                        <div class="dashboard-actions-grid">
                            <button class="action-card" data-action="new-project">
                                <i class="fas fa-plus-circle"></i>
                                <span>Neues Projekt anfragen</span>
                            </button>
                            <button class="action-card" data-action="emergency">
                                <i class="fas fa-exclamation-triangle"></i>
                                <span>Notdienst kontaktieren</span>
                            </button>
                            <button class="action-card" data-action="schedule-maintenance">
                                <i class="fas fa-calendar-plus"></i>
                                <span>Wartung planen</span>
                            </button>
                            <button class="action-card" data-action="contact-support">
                                <i class="fas fa-headset"></i>
                                <span>Support kontaktieren</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Projects View -->
                    <div class="dashboard-view" id="projects-view">
                        <div class="view-header">
                            <h3>Meine Projekte</h3>
                            <button class="btn-primary" id="newProjectBtn">
                                <i class="fas fa-plus"></i>
                                Neues Projekt
                            </button>
                        </div>
                        
                        <div class="projects-filters">
                            <button class="filter-btn active" data-filter="all">Alle</button>
                            <button class="filter-btn" data-filter="active">Aktiv</button>
                            <button class="filter-btn" data-filter="completed">Abgeschlossen</button>
                            <button class="filter-btn" data-filter="planning">In Planung</button>
                        </div>
                        
                        <div class="projects-grid" id="projectsGrid">
                            <!-- Projects will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Invoices View -->
                    <div class="dashboard-view" id="invoices-view">
                        <div class="view-header">
                            <h3>Rechnungen & Kostenvoranschläge</h3>
                            <div class="view-actions">
                                <select class="year-filter" id="invoiceYearFilter">
                                    <option value="">Alle Jahre</option>
                                </select>
                                <button class="btn-secondary" id="downloadAllInvoices">
                                    <i class="fas fa-download"></i>
                                    Alle herunterladen
                                </button>
                            </div>
                        </div>
                        
                        <div class="invoices-summary">
                            <div class="summary-card">
                                <h4>Gesamtsumme 2024</h4>
                                <p class="amount" id="yearlyTotal">0,00 €</p>
                            </div>
                            <div class="summary-card">
                                <h4>Offene Rechnungen</h4>
                                <p class="amount pending" id="pendingAmount">0,00 €</p>
                            </div>
                        </div>
                        
                        <div class="invoices-table-container">
                            <table class="invoices-table">
                                <thead>
                                    <tr>
                                        <th>Rechnungsnr.</th>
                                        <th>Datum</th>
                                        <th>Projekt</th>
                                        <th>Betrag</th>
                                        <th>Status</th>
                                        <th>Aktionen</th>
                                    </tr>
                                </thead>
                                <tbody id="invoicesTableBody">
                                    <!-- Invoices will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Maintenance View -->
                    <div class="dashboard-view" id="maintenance-view">
                        <div class="view-header">
                            <h3>Wartung & Service</h3>
                            <button class="btn-primary" id="scheduleMaintenance">
                                <i class="fas fa-calendar-plus"></i>
                                Wartung planen
                            </button>
                        </div>
                        
                        <div class="maintenance-overview">
                            <div class="maintenance-card next-due">
                                <div class="card-icon">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="card-content">
                                    <h4>Nächste Wartung</h4>
                                    <p id="nextMaintenanceDate">Keine geplant</p>
                                    <span class="status-badge" id="maintenanceStatus">Aktuell</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="maintenance-timeline" id="maintenanceTimeline">
                            <!-- Maintenance history will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Documents View -->
                    <div class="dashboard-view" id="documents-view">
                        <div class="view-header">
                            <h3>Dokumente</h3>
                            <div class="view-actions">
                                <input type="text" class="search-input" placeholder="Dokumente suchen..." id="documentsSearch">
                                <select class="document-filter" id="documentTypeFilter">
                                    <option value="">Alle Dokumente</option>
                                    <option value="invoice">Rechnungen</option>
                                    <option value="quote">Kostenvoranschläge</option>
                                    <option value="warranty">Garantie</option>
                                    <option value="protocol">Protokolle</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="documents-grid" id="documentsGrid">
                            <!-- Documents will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Profile View -->
                    <div class="dashboard-view" id="profile-view">
                        <div class="view-header">
                            <h3>Profil & Einstellungen</h3>
                        </div>
                        
                        <div class="profile-sections">
                            <div class="profile-section">
                                <h4>Persönliche Informationen</h4>
                                <form class="profile-form" id="profileForm">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="profileFirstName">Vorname</label>
                                            <input type="text" id="profileFirstName" name="firstName" readonly>
                                        </div>
                                        <div class="form-group">
                                            <label for="profileLastName">Nachname</label>
                                            <input type="text" id="profileLastName" name="lastName" readonly>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="profileEmail">E-Mail</label>
                                        <input type="email" id="profileEmail" name="email" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="profilePhone">Telefon</label>
                                        <input type="tel" id="profilePhone" name="phone">
                                    </div>
                                    <div class="form-group">
                                        <label for="profileAddress">Adresse</label>
                                        <textarea id="profileAddress" name="address" rows="3"></textarea>
                                    </div>
                                    <button type="button" class="btn-secondary" id="editProfileBtn">
                                        <i class="fas fa-edit"></i>
                                        Bearbeiten
                                    </button>
                                </form>
                            </div>
                            
                            <div class="profile-section">
                                <h4>Benachrichtigungseinstellungen</h4>
                                <div class="notification-settings">
                                    <label class="setting-item">
                                        <input type="checkbox" id="emailNotifications" checked>
                                        <span>E-Mail Benachrichtigungen</span>
                                    </label>
                                    <label class="setting-item">
                                        <input type="checkbox" id="projectUpdates" checked>
                                        <span>Projekt-Updates</span>
                                    </label>
                                    <label class="setting-item">
                                        <input type="checkbox" id="maintenanceReminders" checked>
                                        <span>Wartungserinnerungen</span>
                                    </label>
                                    <label class="setting-item">
                                        <input type="checkbox" id="invoiceNotifications" checked>
                                        <span>Rechnungsbenachrichtigungen</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="profile-section">
                                <h4>Sicherheit</h4>
                                <button class="btn-secondary" id="changePasswordBtn">
                                    <i class="fas fa-key"></i>
                                    Passwort ändern
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.dashboardContainer);
        
        // Add event listeners
        this.addEventListeners();
        
        // Show dashboard with animation
        setTimeout(() => {
            this.dashboardContainer.classList.add('show');
        }, 50);
    }
    
    addEventListeners() {
        // Navigation
        const navItems = this.dashboardContainer.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                this.showView(view);
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
        
        // Close dashboard
        const closeBtn = this.dashboardContainer.querySelector('#dashboardClose');
        closeBtn.addEventListener('click', () => {
            this.hideDashboard();
        });
        
        // Close on overlay click
        const overlay = this.dashboardContainer.querySelector('.dashboard-overlay');
        overlay.addEventListener('click', () => {
            this.hideDashboard();
        });
        
        // Quick actions
        const actionCards = this.dashboardContainer.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleQuickAction(card.dataset.action);
            });
        });
        
        // Project filters
        const filterBtns = this.dashboardContainer.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(f => f.classList.remove('active'));
                btn.classList.add('active');
                this.filterProjects(btn.dataset.filter);
            });
        });
        
        // Profile editing
        const editProfileBtn = this.dashboardContainer.querySelector('#editProfileBtn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                this.toggleProfileEditing();
            });
        }
        
        // Document search
        const documentsSearch = this.dashboardContainer.querySelector('#documentsSearch');
        if (documentsSearch) {
            documentsSearch.addEventListener('input', (e) => {
                this.filterDocuments(e.target.value);
            });
        }
    }
    
    showView(viewName) {
        // Hide all views
        const views = this.dashboardContainer.querySelectorAll('.dashboard-view');
        views.forEach(view => view.classList.remove('active'));
        
        // Show selected view
        const targetView = this.dashboardContainer.querySelector(`#${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
            
            // Load view-specific data
            this.loadViewData(viewName);
        }
    }
    
    loadCustomerData() {
        // Load customer's projects, invoices, and maintenance data
        this.projectsData = this.currentCustomer.projects || [];
        this.invoicesData = this.currentCustomer.invoices || [];
        this.maintenanceData = this.currentCustomer.maintenance || [];
        
        // Update overview stats
        this.updateOverviewStats();
        this.loadRecentActivities();
    }
    
    updateOverviewStats() {
        const totalProjects = this.projectsData.length;
        const activeProjects = this.projectsData.filter(p => p.status === 'active').length;
        const totalInvoiceAmount = this.invoicesData.reduce((sum, inv) => sum + inv.amount, 0);
        
        // Update stat cards
        this.dashboardContainer.querySelector('#totalProjects').textContent = totalProjects;
        this.dashboardContainer.querySelector('#activeProjects').textContent = activeProjects;
        this.dashboardContainer.querySelector('#totalInvoices').textContent = 
            new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalInvoiceAmount);
        
        // Update badges
        this.dashboardContainer.querySelector('#projectsBadge').textContent = activeProjects;
        
        // Next maintenance
        const nextMaintenance = this.getNextMaintenanceDate();
        this.dashboardContainer.querySelector('#nextMaintenance').textContent = 
            nextMaintenance ? this.formatDate(nextMaintenance) : 'Keine geplant';
    }
    
    loadViewData(viewName) {
        switch (viewName) {
            case 'projects':
                this.loadProjects();
                break;
            case 'invoices':
                this.loadInvoices();
                break;
            case 'maintenance':
                this.loadMaintenance();
                break;
            case 'documents':
                this.loadDocuments();
                break;
            case 'profile':
                this.loadProfile();
                break;
        }
    }
    
    loadProjects() {
        const projectsGrid = this.dashboardContainer.querySelector('#projectsGrid');
        projectsGrid.innerHTML = '';
        
        this.projectsData.forEach(project => {
            const projectCard = this.createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
    }
    
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-header">
                <h4>${project.title}</h4>
                <span class="project-status ${project.status}">${this.getStatusText(project.status)}</span>
            </div>
            <div class="project-details">
                <p><i class="fas fa-calendar"></i> ${this.formatDate(project.startDate)}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${project.location}</p>
                <p><i class="fas fa-euro-sign"></i> ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(project.budget)}</p>
            </div>
            <div class="project-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
                <span class="progress-text">${project.progress}% abgeschlossen</span>
            </div>
            <div class="project-actions">
                <button class="btn-secondary btn-sm" onclick="customerDashboard.viewProject('${project.id}')">
                    Details
                </button>
                ${project.status === 'active' ? `
                    <button class="btn-primary btn-sm" onclick="customerDashboard.trackProject('${project.id}')">
                        Verfolgen
                    </button>
                ` : ''}
            </div>
        `;
        
        return card;
    }
    
    loadInvoices() {
        const tableBody = this.dashboardContainer.querySelector('#invoicesTableBody');
        tableBody.innerHTML = '';
        
        this.invoicesData.forEach(invoice => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${invoice.number}</td>
                <td>${this.formatDate(invoice.date)}</td>
                <td>${invoice.projectTitle}</td>
                <td>${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(invoice.amount)}</td>
                <td><span class="status-badge ${invoice.status}">${this.getStatusText(invoice.status)}</span></td>
                <td>
                    <button class="btn-icon" onclick="customerDashboard.downloadInvoice('${invoice.id}')" title="Herunterladen">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-icon" onclick="customerDashboard.viewInvoice('${invoice.id}')" title="Anzeigen">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Update yearly totals
        const currentYear = new Date().getFullYear();
        const yearlyTotal = this.invoicesData
            .filter(inv => new Date(inv.date).getFullYear() === currentYear)
            .reduce((sum, inv) => sum + inv.amount, 0);
        
        this.dashboardContainer.querySelector('#yearlyTotal').textContent = 
            new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(yearlyTotal);
    }
    
    loadProfile() {
        // Load profile data into form
        const form = this.dashboardContainer.querySelector('#profileForm');
        form.querySelector('#profileFirstName').value = this.currentCustomer.firstName;
        form.querySelector('#profileLastName').value = this.currentCustomer.lastName;
        form.querySelector('#profileEmail').value = this.currentCustomer.email;
        form.querySelector('#profilePhone').value = this.currentCustomer.phone || '';
        form.querySelector('#profileAddress').value = this.currentCustomer.address || '';
    }
    
    loadRecentActivities() {
        const activitiesContainer = this.dashboardContainer.querySelector('#recentActivities');
        
        // Generate recent activities from projects and invoices
        const activities = [];
        
        // Recent project updates
        this.projectsData.slice(0, 3).forEach(project => {
            activities.push({
                type: 'project',
                title: `Projekt "${project.title}" aktualisiert`,
                date: project.lastUpdate || project.startDate,
                icon: 'fas fa-briefcase'
            });
        });
        
        // Recent invoices
        this.invoicesData.slice(0, 2).forEach(invoice => {
            activities.push({
                type: 'invoice',
                title: `Rechnung ${invoice.number} erstellt`,
                date: invoice.date,
                icon: 'fas fa-file-invoice'
            });
        });
        
        // Sort by date
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        activitiesContainer.innerHTML = activities.slice(0, 5).map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h5>${activity.title}</h5>
                    <p>${this.formatDate(activity.date)}</p>
                </div>
            </div>
        `).join('');
    }
    
    handleQuickAction(action) {
        switch (action) {
            case 'new-project':
                this.openProjectRequest();
                break;
            case 'emergency':
                this.contactEmergency();
                break;
            case 'schedule-maintenance':
                this.scheduleMaintenance();
                break;
            case 'contact-support':
                this.contactSupport();
                break;
        }
    }
    
    openProjectRequest() {
        // Open project request form (could be a modal or redirect)
        alert('Projekt-Anfrage Formular würde hier geöffnet werden');
    }
    
    contactEmergency() {
        // Show emergency contact information
        alert('Notdienst: 0800-EBER-SOS (24/7 verfügbar)');
    }
    
    scheduleMaintenance() {
        // Open maintenance scheduling
        alert('Wartungsplaner würde hier geöffnet werden');
    }
    
    contactSupport() {
        // Open support chat or contact form
        if (window.liveChatSystem) {
            window.liveChatSystem.openChat();
        } else {
            alert('Support kontaktieren: info@elektro-eber.de');
        }
    }
    
    // Utility methods
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('de-DE');
    }
    
    getStatusText(status) {
        const statusMap = {
            'active': 'Aktiv',
            'completed': 'Abgeschlossen',
            'planning': 'In Planung',
            'pending': 'Ausstehend',
            'paid': 'Bezahlt',
            'overdue': 'Überfällig'
        };
        return statusMap[status] || status;
    }
    
    getNextMaintenanceDate() {
        // Calculate next maintenance based on maintenance history
        const lastMaintenance = this.maintenanceData[0];
        if (lastMaintenance) {
            const nextDate = new Date(lastMaintenance.date);
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            return nextDate > new Date() ? nextDate : null;
        }
        return null;
    }
    
    filterProjects(filter) {
        const projectCards = this.dashboardContainer.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const status = card.querySelector('.project-status').classList[1];
            
            if (filter === 'all' || status === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    toggleProfileEditing() {
        const form = this.dashboardContainer.querySelector('#profileForm');
        const inputs = form.querySelectorAll('input:not([type="email"]), textarea');
        const editBtn = this.dashboardContainer.querySelector('#editProfileBtn');
        
        const isEditing = editBtn.textContent.includes('Speichern');
        
        if (isEditing) {
            // Save changes
            inputs.forEach(input => input.readOnly = true);
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Bearbeiten';
            this.saveProfile();
        } else {
            // Enable editing
            inputs.forEach(input => input.readOnly = false);
            editBtn.innerHTML = '<i class="fas fa-save"></i> Speichern';
        }
    }
    
    saveProfile() {
        // Save profile changes (would normally send to server)
        console.log('Profile saved');
    }
    
    filterDocuments(searchTerm) {
        // Filter documents based on search term
        console.log('Filtering documents:', searchTerm);
    }
    
    // Project-specific methods
    viewProject(projectId) {
        console.log('Viewing project:', projectId);
        // Show project details modal or navigate to project page
        this.showProjectDetails(projectId);
    }
    
    trackProject(projectId) {
        console.log('Tracking project:', projectId);
        // Start real-time project tracking
        if (window.projectTrackingSystem) {
            window.projectTrackingSystem.startTracking(projectId);
        }
    }
    
    showProjectDetails(projectId) {
        const project = this.projectsData.find(p => p.id === projectId);
        if (!project) return;
        
        // Create project details modal
        const modal = document.createElement('div');
        modal.className = 'project-details-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Projekt Details</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <h4>${project.title}</h4>
                    <p><strong>Standort:</strong> ${project.location}</p>
                    <p><strong>Status:</strong> ${this.getStatusText(project.status)}</p>
                    <p><strong>Fortschritt:</strong> ${project.progress}%</p>
                    <p><strong>Budget:</strong> ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(project.budget)}</p>
                    <div class="modal-actions">
                        <button class="btn-primary" onclick="customerDashboard.trackProject('${project.id}')">
                            <i class="fas fa-eye"></i> Live Tracking
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
        
        // Show modal
        setTimeout(() => modal.classList.add('show'), 50);
    }
    
    // Invoice methods
    downloadInvoice(invoiceId) {
        console.log('Downloading invoice:', invoiceId);
        // Implement invoice download
    }
    
    viewInvoice(invoiceId) {
        console.log('Viewing invoice:', invoiceId);
        // Implement invoice preview
    }
}

// Initialize dashboard system
const customerDashboard = new CustomerDashboard();

// Export for global access
window.customerDashboard = customerDashboard;