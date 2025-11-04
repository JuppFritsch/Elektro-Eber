// ====== CUSTOMER LOGIN & AUTHENTICATION SYSTEM ======

class CustomerAuthSystem {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.sessionTimer = null;
        
        // Demo users for development
        this.demoUsers = {
            'max.mustermann@email.de': {
                id: 'cust_001',
                email: 'max.mustermann@email.de',
                password: 'demo123', // In real app: hashed
                name: 'Max Mustermann',
                phone: '+49 123 456789',
                address: 'Musterstraße 15, 12345 Berlin',
                joinDate: '2023-03-15',
                projects: [
                    {
                        id: 'proj_001',
                        title: 'Smart Home Installation',
                        status: 'completed',
                        startDate: '2024-01-15',
                        completionDate: '2024-02-28',
                        progress: 100,
                        technician: 'Dennis Eckert',
                        description: 'Komplette KNX Installation mit LED-Beleuchtung'
                    },
                    {
                        id: 'proj_002', 
                        title: 'Photovoltaik Anlage',
                        status: 'in-progress',
                        startDate: '2024-10-01',
                        completionDate: '2024-11-15',
                        progress: 75,
                        technician: 'Marcus Weber',
                        description: '8.5 kWp Photovoltaik-Anlage mit Speichersystem'
                    }
                ],
                invoices: [
                    {
                        id: 'inv_001',
                        projectId: 'proj_001',
                        amount: 8500.00,
                        status: 'paid',
                        date: '2024-03-01',
                        dueDate: '2024-03-31'
                    },
                    {
                        id: 'inv_002',
                        projectId: 'proj_002',
                        amount: 3200.00,
                        status: 'pending',
                        date: '2024-10-15',
                        dueDate: '2024-11-15'
                    }
                ]
            },
            'anna.schmidt@gmail.com': {
                id: 'cust_002',
                email: 'anna.schmidt@gmail.com',
                password: 'demo456',
                name: 'Anna Schmidt',
                phone: '+49 987 654321',
                address: 'Beispielweg 22, 54321 Hamburg',
                joinDate: '2023-08-20',
                projects: [
                    {
                        id: 'proj_003',
                        title: 'Büro Elektroinstallation',
                        status: 'planning',
                        startDate: '2024-11-20',
                        completionDate: '2024-12-15',
                        progress: 15,
                        technician: 'Stefan König',
                        description: 'Neubau Bürogebäude - Komplettinstallation'
                    }
                ],
                invoices: []
            }
        };
        
        this.init();
    }
    
    init() {
        this.checkExistingSession();
        this.createLoginModal();
        this.setupEventListeners();
        this.addLoginButton();
        
        console.log('🔐 Customer Auth System initialized');
    }
    
    // ====== SESSION MANAGEMENT ======
    
    checkExistingSession() {
        const session = localStorage.getItem('elektro-eber-session');
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                const now = Date.now();
                
                if (now - sessionData.timestamp < this.sessionTimeout) {
                    this.currentUser = sessionData.user;
                    this.isLoggedIn = true;
                    this.startSessionTimer();
                    this.showUserArea();
                    console.log('✅ Session restored for:', sessionData.user.name);
                } else {
                    this.logout();
                }
            } catch (error) {
                console.error('❌ Session restore failed:', error);
                this.logout();
            }
        }
    }
    
    startSessionTimer() {
        this.clearSessionTimer();
        this.sessionTimer = setTimeout(() => {
            this.showSessionTimeoutWarning();
        }, this.sessionTimeout - 5 * 60 * 1000); // Warning 5 minutes before timeout
    }
    
    clearSessionTimer() {
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
            this.sessionTimer = null;
        }
    }
    
    extendSession() {
        if (this.isLoggedIn && this.currentUser) {
            const sessionData = {
                user: this.currentUser,
                timestamp: Date.now()
            };
            localStorage.setItem('elektro-eber-session', JSON.stringify(sessionData));
            this.startSessionTimer();
            console.log('🔄 Session extended');
        }
    }
    
    showSessionTimeoutWarning() {
        const warning = document.createElement('div');
        warning.className = 'session-timeout-warning';
        warning.innerHTML = `
            <div class="timeout-warning-content">
                <div class="warning-info">
                    <i class="fas fa-clock"></i>
                    <div>
                        <h4>Session läuft ab</h4>
                        <p>Sie werden in 5 Minuten automatisch abgemeldet</p>
                    </div>
                </div>
                <div class="warning-actions">
                    <button class="btn-extend-session">Verlängern</button>
                    <button class="btn-logout-now">Abmelden</button>
                </div>
            </div>
        `;
        
        warning.querySelector('.btn-extend-session').addEventListener('click', () => {
            this.extendSession();
            warning.remove();
        });
        
        warning.querySelector('.btn-logout-now').addEventListener('click', () => {
            this.logout();
            warning.remove();
        });
        
        document.body.appendChild(warning);
        
        // Auto-logout after 5 minutes
        setTimeout(() => {
            if (warning.parentNode) {
                this.logout();
                warning.remove();
            }
        }, 5 * 60 * 1000);
    }
    
    // ====== LOGIN MODAL CREATION ======
    
    createLoginModal() {
        const modal = document.createElement('div');
        modal.id = 'customerLoginModal';
        modal.className = 'customer-login-modal';
        modal.innerHTML = `
            <div class="login-modal-content">
                <div class="login-header">
                    <h3>Kundenbereich</h3>
                    <button class="login-close">&times;</button>
                </div>
                
                <!-- Login Form -->
                <div id="loginForm" class="auth-form active">
                    <div class="form-intro">
                        <i class="fas fa-user-shield"></i>
                        <p>Melden Sie sich an, um Ihre Projekte und Rechnungen einzusehen</p>
                    </div>
                    
                    <form class="login-form">
                        <div class="form-group">
                            <label>E-Mail-Adresse</label>
                            <div class="input-group">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="loginEmail" placeholder="ihre@email.de" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Passwort</label>
                            <div class="input-group">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="loginPassword" placeholder="Ihr Passwort" required>
                                <button type="button" class="password-toggle" onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'; this.innerHTML = this.previousElementSibling.type === 'password' ? '<i class=\"fas fa-eye\"></i>' : '<i class=\"fas fa-eye-slash\"></i>'">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="form-options">
                            <label class="checkbox-wrapper">
                                <input type="checkbox" id="rememberMe">
                                <span class="checkmark"></span>
                                Angemeldet bleiben
                            </label>
                            <button type="button" class="forgot-password-btn">Passwort vergessen?</button>
                        </div>
                        
                        <button type="submit" class="btn-login">
                            <i class="fas fa-sign-in-alt"></i>
                            Anmelden
                        </button>
                        
                        <div class="demo-credentials">
                            <h5>Demo-Zugänge:</h5>
                            <div class="demo-accounts">
                                <div class="demo-account">
                                    <strong>Max Mustermann:</strong><br>
                                    <code>max.mustermann@email.de</code><br>
                                    <code>demo123</code>
                                </div>
                                <div class="demo-account">
                                    <strong>Anna Schmidt:</strong><br>
                                    <code>anna.schmidt@gmail.com</code><br>
                                    <code>demo456</code>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                
                <!-- Password Reset Form -->
                <div id="resetForm" class="auth-form">
                    <div class="form-intro">
                        <i class="fas fa-key"></i>
                        <p>Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen</p>
                    </div>
                    
                    <form class="reset-form">
                        <div class="form-group">
                            <label>E-Mail-Adresse</label>
                            <div class="input-group">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="resetEmail" placeholder="ihre@email.de" required>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn-reset">
                            <i class="fas fa-paper-plane"></i>
                            Reset-Link senden
                        </button>
                        
                        <button type="button" class="btn-back-to-login">
                            <i class="fas fa-arrow-left"></i>
                            Zurück zur Anmeldung
                        </button>
                    </form>
                </div>
                
                <!-- Success Messages -->
                <div id="loginSuccess" class="auth-success">
                    <i class="fas fa-check-circle"></i>
                    <h4>Erfolgreich angemeldet!</h4>
                    <p>Sie werden zu Ihrem Dashboard weitergeleitet...</p>
                </div>
                
                <div id="resetSuccess" class="auth-success">
                    <i class="fas fa-envelope-open"></i>
                    <h4>E-Mail versendet!</h4>
                    <p>Prüfen Sie Ihr Postfach und folgen Sie den Anweisungen.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // ====== EVENT LISTENERS ======
    
    setupEventListeners() {
        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('customer-login-modal') || 
                e.target.classList.contains('login-close')) {
                this.closeLoginModal();
            }
        });
        
        // Login form
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('login-form')) {
                e.preventDefault();
                this.handleLogin();
            }
            
            if (e.target.classList.contains('reset-form')) {
                e.preventDefault();
                this.handlePasswordReset();
            }
        });
        
        // Form navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('forgot-password-btn')) {
                this.showResetForm();
            }
            
            if (e.target.classList.contains('btn-back-to-login')) {
                this.showLoginForm();
            }
            
            if (e.target.classList.contains('customer-logout')) {
                this.logout();
            }
        });
        
        // Session extension on activity
        document.addEventListener('click', () => {
            if (this.isLoggedIn) {
                this.extendSession();
            }
        });
    }
    
    // ====== LOGIN FUNCTIONALITY ======
    
    async handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Show loading state
        const submitBtn = document.querySelector('.btn-login');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Anmeldung...';
        submitBtn.disabled = true;
        
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check credentials (in real app: API call)
            const user = this.demoUsers[email];
            
            if (user && user.password === password) {
                this.currentUser = { ...user };
                delete this.currentUser.password; // Remove password from memory
                this.isLoggedIn = true;
                
                // Save session
                const sessionData = {
                    user: this.currentUser,
                    timestamp: Date.now(),
                    rememberMe: rememberMe
                };
                localStorage.setItem('elektro-eber-session', JSON.stringify(sessionData));
                
                this.startSessionTimer();
                this.showLoginSuccess();
                
                console.log('✅ Login successful:', this.currentUser.name);
            } else {
                throw new Error('Ungültige Anmeldedaten');
            }
        } catch (error) {
            console.error('❌ Login failed:', error);
            this.showLoginError(error.message);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async handlePasswordReset() {
        const email = document.getElementById('resetEmail').value.trim();
        
        const submitBtn = document.querySelector('.btn-reset');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sende...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In real app: send reset email
            console.log('📧 Password reset requested for:', email);
            
            this.showResetSuccess();
        } catch (error) {
            console.error('❌ Password reset failed:', error);
            this.showResetError('Fehler beim Senden der E-Mail');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    logout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.clearSessionTimer();
        
        localStorage.removeItem('elektro-eber-session');
        
        this.hideUserArea();
        this.showLoginButton();
        
        // Close dashboard if open
        const dashboard = document.getElementById('customerDashboard');
        if (dashboard) {
            dashboard.remove();
        }
        
        console.log('👋 User logged out');
        
        // Show logout message
        this.showMessage('Sie wurden erfolgreich abgemeldet', 'info');
    }
    
    // ====== UI MANAGEMENT ======
    
    addLoginButton() {
        // Add to main navigation
        const nav = document.querySelector('.nav-links');
        if (nav && !document.querySelector('.customer-login-btn')) {
            const loginBtn = document.createElement('li');
            loginBtn.innerHTML = '<a href="#" class="nav-link customer-login-btn"><i class="fas fa-user"></i> Kundenbereich</a>';
            
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isLoggedIn) {
                    this.showDashboard();
                } else {
                    this.showLoginModal();
                }
            });
            
            nav.appendChild(loginBtn);
        }
        
        // Add to mobile navigation
        const mobileNav = document.querySelector('.mobile-quick-actions .quick-action-grid');
        if (mobileNav && !document.querySelector('.mobile-login-btn')) {
            const mobileLoginBtn = document.createElement('button');
            mobileLoginBtn.className = 'quick-action-btn mobile-login-btn';
            mobileLoginBtn.innerHTML = `
                <i class="fas fa-user"></i>
                <span>Kundenbereich</span>
            `;
            
            mobileLoginBtn.addEventListener('click', () => {
                if (this.isLoggedIn) {
                    this.showDashboard();
                } else {
                    this.showLoginModal();
                }
            });
            
            mobileNav.appendChild(mobileLoginBtn);
        }
    }
    
    showLoginButton() {
        const loginBtn = document.querySelector('.customer-login-btn');
        const mobileLoginBtn = document.querySelector('.mobile-login-btn');
        
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-user"></i> Kundenbereich';
        }
        
        if (mobileLoginBtn) {
            mobileLoginBtn.innerHTML = `
                <i class="fas fa-user"></i>
                <span>Kundenbereich</span>
            `;
        }
    }
    
    showUserArea() {
        if (!this.currentUser) return;
        
        const loginBtn = document.querySelector('.customer-login-btn');
        const mobileLoginBtn = document.querySelector('.mobile-login-btn');
        
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user-check"></i> ${this.currentUser.name}`;
        }
        
        if (mobileLoginBtn) {
            mobileLoginBtn.innerHTML = `
                <i class="fas fa-user-check"></i>
                <span>${this.currentUser.name}</span>
            `;
        }
        
        // Add logout option
        this.addLogoutOption();
    }
    
    addLogoutOption() {
        // Remove existing logout buttons
        const existingLogout = document.querySelectorAll('.customer-logout');
        existingLogout.forEach(btn => btn.remove());
        
        // Add logout to user dropdown (if exists) or create one
        const userArea = document.querySelector('.customer-login-btn').parentElement;
        const logoutBtn = document.createElement('li');
        logoutBtn.innerHTML = '<a href="#" class="nav-link customer-logout"><i class="fas fa-sign-out-alt"></i> Abmelden</a>';
        
        userArea.appendChild(logoutBtn);
    }
    
    hideUserArea() {
        const logoutBtns = document.querySelectorAll('.customer-logout');
        logoutBtns.forEach(btn => btn.parentElement.remove());
    }
    
    showLoginModal() {
        const modal = document.getElementById('customerLoginModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);
            
            // Focus email field
            const emailField = document.getElementById('loginEmail');
            if (emailField) emailField.focus();
        }
    }
    
    closeLoginModal() {
        const modal = document.getElementById('customerLoginModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    }
    
    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('resetForm').classList.remove('active');
        document.getElementById('loginSuccess').classList.remove('active');
        document.getElementById('resetSuccess').classList.remove('active');
    }
    
    showResetForm() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('resetForm').classList.add('active');
        document.getElementById('loginSuccess').classList.remove('active');
        document.getElementById('resetSuccess').classList.remove('active');
        
        // Focus email field
        setTimeout(() => {
            const resetEmail = document.getElementById('resetEmail');
            if (resetEmail) resetEmail.focus();
        }, 100);
    }
    
    showLoginSuccess() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('resetForm').classList.remove('active');
        document.getElementById('loginSuccess').classList.add('active');
        document.getElementById('resetSuccess').classList.remove('active');
        
        // Auto-close and show dashboard
        setTimeout(() => {
            this.closeLoginModal();
            this.showUserArea();
            this.showDashboard();
        }, 2000);
    }
    
    showResetSuccess() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('resetForm').classList.remove('active');
        document.getElementById('loginSuccess').classList.remove('active');
        document.getElementById('resetSuccess').classList.add('active');
        
        // Auto-close
        setTimeout(() => {
            this.closeLoginModal();
        }, 3000);
    }
    
    showLoginError(message) {
        this.showMessage(message, 'error');
    }
    
    showResetError(message) {
        this.showMessage(message, 'error');
    }
    
    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `auth-message ${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        const modal = document.querySelector('.login-modal-content');
        if (modal) {
            modal.appendChild(messageEl);
            
            setTimeout(() => {
                messageEl.classList.add('fade-out');
                setTimeout(() => messageEl.remove(), 300);
            }, 4000);
        }
    }
    
    showDashboard() {
        if (!this.isLoggedIn || !this.currentUser) {
            this.showLoginModal();
            return;
        }
        
        // Dashboard will be implemented in next step
        console.log('🎯 Opening dashboard for:', this.currentUser.name);
        
        // For now, show a preview message
        this.showMessage('Dashboard wird geladen... (wird im nächsten Schritt implementiert)', 'info');
    }
    
    // ====== PUBLIC API ======
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    isUserLoggedIn() {
        return this.isLoggedIn;
    }
    
    async loginUser(email, password) {
        // Public method for programmatic login
        document.getElementById('loginEmail').value = email;
        document.getElementById('loginPassword').value = password;
        await this.handleLogin();
    }
    
    logoutUser() {
        this.logout();
    }
}

// ====== INITIALIZATION ======

document.addEventListener('DOMContentLoaded', () => {
    const customerAuth = new CustomerAuthSystem();
    
    // Make available globally
    window.customerAuth = customerAuth;
    
    // Integration with existing systems
    if (window.livechat) {
        window.livechat.customerAuth = customerAuth;
    }
    
    if (window.pwaManager) {
        window.pwaManager.customerAuth = customerAuth;
    }
});