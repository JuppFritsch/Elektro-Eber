// ====== PROGRESSIVE WEB APP MANAGER ======

class PWAManager {
    constructor() {
        this.installPrompt = null;
        this.isInstalled = false;
        this.isOnline = navigator.onLine;
        this.updateAvailable = false;
        this.registration = null;
        
        this.init();
    }
    
    async init() {
        this.checkInstallStatus();
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupNetworkDetection();
        this.setupUpdateDetection();
        this.setupAppShortcuts();
        this.setupNotifications();
        
        console.log('📱 PWA Manager initialized');
    }
    
    // ====== SERVICE WORKER REGISTRATION ======
    
    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.warn('⚠️ Service Workers not supported');
            return;
        }
        
        try {
            this.registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            
            console.log('✅ Service Worker registered:', this.registration.scope);
            
            // Handle updates
            this.registration.addEventListener('updatefound', () => {
                this.handleServiceWorkerUpdate();
            });
            
            // Check for existing service worker
            if (this.registration.active) {
                console.log('🔧 Service Worker active');
            }
            
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
        }
    }
    
    handleServiceWorkerUpdate() {
        const newWorker = this.registration.installing;
        if (!newWorker) return;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.updateAvailable = true;
                this.showUpdateNotification();
            }
        });
    }
    
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <div class="update-info">
                    <i class="fas fa-download"></i>
                    <div>
                        <h4>Update verfügbar</h4>
                        <p>Eine neue Version der App ist verfügbar</p>
                    </div>
                </div>
                <div class="update-actions">
                    <button class="btn-update-dismiss">Später</button>
                    <button class="btn-update-install">Aktualisieren</button>
                </div>
            </div>
        `;
        
        // Event handlers
        notification.querySelector('.btn-update-dismiss').addEventListener('click', () => {
            notification.remove();
        });
        
        notification.querySelector('.btn-update-install').addEventListener('click', () => {
            this.applyUpdate();
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }
    
    applyUpdate() {
        if (this.registration && this.registration.waiting) {
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }
    
    // ====== APP INSTALLATION ======
    
    checkInstallStatus() {
        // Check if running as installed PWA
        this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone === true;
        
        if (this.isInstalled) {
            console.log('📱 Running as installed PWA');
            this.hideInstallPrompts();
        }
    }
    
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.installPrompt = e;
            this.showInstallBanner();
            
            console.log('📦 Install prompt available');
        });
        
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.installPrompt = null;
            this.hideInstallPrompts();
            this.showInstallSuccessMessage();
            
            console.log('✅ App installed successfully');
        });
    }
    
    showInstallBanner() {
        if (this.isInstalled || document.querySelector('.pwa-install-banner')) return;
        
        const banner = document.createElement('div');
        banner.className = 'pwa-install-banner';
        banner.innerHTML = `
            <div class="install-banner-content">
                <div class="install-info">
                    <div class="install-icon">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <div class="install-text">
                        <h4>Elektro Eber App installieren</h4>
                        <p>Schneller Zugriff, Offline-Funktionen und Push-Benachrichtigungen</p>
                    </div>
                </div>
                <div class="install-actions">
                    <button class="btn-install-dismiss">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="btn-install-app">
                        <i class="fas fa-download"></i>
                        Installieren
                    </button>
                </div>
            </div>
        `;
        
        // Event handlers
        banner.querySelector('.btn-install-dismiss').addEventListener('click', () => {
            banner.remove();
            localStorage.setItem('pwa-install-dismissed', Date.now());
        });
        
        banner.querySelector('.btn-install-app').addEventListener('click', () => {
            this.promptInstall();
        });
        
        // Check if previously dismissed
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        const dayInMs = 24 * 60 * 60 * 1000;
        
        if (!dismissed || (Date.now() - parseInt(dismissed)) > dayInMs * 7) {
            document.body.appendChild(banner);
            
            // Animate in
            setTimeout(() => banner.classList.add('show'), 100);
        }
    }
    
    async promptInstall() {
        if (!this.installPrompt) {
            console.warn('⚠️ Install prompt not available');
            return;
        }
        
        try {
            const result = await this.installPrompt.prompt();
            console.log('📦 Install prompt result:', result.outcome);
            
            if (result.outcome === 'accepted') {
                console.log('✅ User accepted install prompt');
            } else {
                console.log('❌ User dismissed install prompt');
            }
        } catch (error) {
            console.error('❌ Install prompt error:', error);
        } finally {
            this.installPrompt = null;
        }
    }
    
    hideInstallPrompts() {
        const banners = document.querySelectorAll('.pwa-install-banner');
        banners.forEach(banner => banner.remove());
    }
    
    showInstallSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'pwa-success-message';
        message.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <div>
                    <h4>App erfolgreich installiert!</h4>
                    <p>Sie können Elektro Eber jetzt vom Startbildschirm aus öffnen</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => message.classList.add('show'), 100);
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => message.remove(), 300);
        }, 5000);
    }\n    \n    // ====== NETWORK DETECTION ======\n    \n    setupNetworkDetection() {\n        window.addEventListener('online', () => {\n            this.isOnline = true;\n            this.showNetworkStatus('online');\n            console.log('🌐 Back online');\n        });\n        \n        window.addEventListener('offline', () => {\n            this.isOnline = false;\n            this.showNetworkStatus('offline');\n            console.log('📴 Gone offline');\n        });\n    }\n    \n    showNetworkStatus(status) {\n        // Remove existing status\n        const existing = document.querySelector('.network-status');\n        if (existing) existing.remove();\n        \n        const statusEl = document.createElement('div');\n        statusEl.className = `network-status ${status}`;\n        \n        if (status === 'online') {\n            statusEl.innerHTML = `\n                <i class=\"fas fa-wifi\"></i>\n                <span>Wieder online</span>\n            `;\n        } else {\n            statusEl.innerHTML = `\n                <i class=\"fas fa-wifi-slash\"></i>\n                <span>Offline-Modus</span>\n            `;\n        }\n        \n        document.body.appendChild(statusEl);\n        \n        // Auto-hide online status\n        if (status === 'online') {\n            setTimeout(() => {\n                statusEl.classList.add('fade-out');\n                setTimeout(() => statusEl.remove(), 300);\n            }, 3000);\n        }\n    }\n    \n    // ====== UPDATE DETECTION ======\n    \n    setupUpdateDetection() {\n        // Check for updates periodically\n        setInterval(() => {\n            this.checkForUpdates();\n        }, 60000 * 15); // Check every 15 minutes\n        \n        // Check on focus\n        window.addEventListener('focus', () => {\n            this.checkForUpdates();\n        });\n    }\n    \n    async checkForUpdates() {\n        if (this.registration) {\n            try {\n                await this.registration.update();\n                console.log('🔄 Checked for service worker updates');\n            } catch (error) {\n                console.error('❌ Update check failed:', error);\n            }\n        }\n    }\n    \n    // ====== APP SHORTCUTS ======\n    \n    setupAppShortcuts() {\n        // Handle URL parameters for shortcuts\n        const urlParams = new URLSearchParams(window.location.search);\n        const action = urlParams.get('action');\n        \n        if (action) {\n            this.handleShortcutAction(action);\n        }\n    }\n    \n    handleShortcutAction(action) {\n        console.log('🚀 Handling shortcut action:', action);\n        \n        switch (action) {\n            case 'emergency':\n                this.openEmergencyContact();\n                break;\n            case 'quote':\n                this.openQuoteForm();\n                break;\n            case 'chat':\n                this.openChat();\n                break;\n            case 'projects':\n                this.scrollToProjects();\n                break;\n            default:\n                console.log('Unknown shortcut action:', action);\n        }\n    }\n    \n    openEmergencyContact() {\n        // Open emergency modal or call directly\n        const phone = '+49 XXX XXXXXXX';\n        if (confirm('Notfall-Hotline anrufen?')) {\n            window.location.href = `tel:${phone}`;\n        }\n    }\n    \n    openQuoteForm() {\n        const modal = document.getElementById('openProjectModal');\n        if (modal) {\n            modal.click();\n        }\n    }\n    \n    openChat() {\n        if (window.livechat) {\n            window.livechat.openChat();\n        }\n    }\n    \n    scrollToProjects() {\n        const projectsSection = document.getElementById('projects');\n        if (projectsSection) {\n            projectsSection.scrollIntoView({ behavior: 'smooth' });\n        }\n    }\n    \n    // ====== PUSH NOTIFICATIONS ======\n    \n    async setupNotifications() {\n        if (!('Notification' in window) || !('PushManager' in window)) {\n            console.warn('⚠️ Push notifications not supported');\n            return;\n        }\n        \n        // Check current permission\n        const permission = Notification.permission;\n        console.log('🔔 Notification permission:', permission);\n        \n        if (permission === 'granted') {\n            this.subscribeToNotifications();\n        } else if (permission === 'default') {\n            // Show notification opt-in after some interaction\n            setTimeout(() => this.showNotificationOptIn(), 10000);\n        }\n    }\n    \n    showNotificationOptIn() {\n        if (document.querySelector('.notification-opt-in')) return;\n        \n        const optIn = document.createElement('div');\n        optIn.className = 'notification-opt-in';\n        optIn.innerHTML = `\n            <div class=\"opt-in-content\">\n                <div class=\"opt-in-info\">\n                    <i class=\"fas fa-bell\"></i>\n                    <div>\n                        <h4>Benachrichtigungen aktivieren</h4>\n                        <p>Erhalten Sie Updates zu Ihren Projekten und wichtige Mitteilungen</p>\n                    </div>\n                </div>\n                <div class=\"opt-in-actions\">\n                    <button class=\"btn-opt-in-dismiss\">Nicht jetzt</button>\n                    <button class=\"btn-opt-in-enable\">Aktivieren</button>\n                </div>\n            </div>\n        `;\n        \n        optIn.querySelector('.btn-opt-in-dismiss').addEventListener('click', () => {\n            optIn.remove();\n            localStorage.setItem('notifications-dismissed', Date.now());\n        });\n        \n        optIn.querySelector('.btn-opt-in-enable').addEventListener('click', async () => {\n            await this.requestNotificationPermission();\n            optIn.remove();\n        });\n        \n        document.body.appendChild(optIn);\n        setTimeout(() => optIn.classList.add('show'), 100);\n    }\n    \n    async requestNotificationPermission() {\n        try {\n            const permission = await Notification.requestPermission();\n            \n            if (permission === 'granted') {\n                console.log('✅ Notification permission granted');\n                this.subscribeToNotifications();\n                this.showTestNotification();\n            } else {\n                console.log('❌ Notification permission denied');\n            }\n        } catch (error) {\n            console.error('❌ Notification permission error:', error);\n        }\n    }\n    \n    async subscribeToNotifications() {\n        if (!this.registration) return;\n        \n        try {\n            const subscription = await this.registration.pushManager.subscribe({\n                userVisibleOnly: true,\n                applicationServerKey: this.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')\n            });\n            \n            console.log('📱 Push subscription:', subscription);\n            \n            // Send subscription to server\n            // await this.sendSubscriptionToServer(subscription);\n            \n        } catch (error) {\n            console.error('❌ Push subscription failed:', error);\n        }\n    }\n    \n    showTestNotification() {\n        if (Notification.permission === 'granted') {\n            new Notification('Elektro Eber', {\n                body: 'Benachrichtigungen erfolgreich aktiviert! 🔔',\n                icon: '/icons/icon-192x192.png',\n                badge: '/icons/badge-72x72.png',\n                tag: 'test-notification'\n            });\n        }\n    }\n    \n    urlBase64ToUint8Array(base64String) {\n        const padding = '='.repeat((4 - base64String.length % 4) % 4);\n        const base64 = (base64String + padding)\n            .replace(/-/g, '+')\n            .replace(/_/g, '/');\n        \n        const rawData = window.atob(base64);\n        const outputArray = new Uint8Array(rawData.length);\n        \n        for (let i = 0; i < rawData.length; ++i) {\n            outputArray[i] = rawData.charCodeAt(i);\n        }\n        return outputArray;\n    }\n    \n    // ====== BACKGROUND SYNC ======\n    \n    async scheduleBackgroundSync(tag) {\n        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {\n            try {\n                await this.registration.sync.register(tag);\n                console.log('📤 Background sync scheduled:', tag);\n            } catch (error) {\n                console.error('❌ Background sync failed:', error);\n            }\n        }\n    }\n    \n    // ====== PUBLIC API ======\n    \n    isAppInstalled() {\n        return this.isInstalled;\n    }\n    \n    isAppOnline() {\n        return this.isOnline;\n    }\n    \n    async installApp() {\n        await this.promptInstall();\n    }\n    \n    async enableNotifications() {\n        await this.requestNotificationPermission();\n    }\n    \n    async syncData(tag = 'generic-sync') {\n        await this.scheduleBackgroundSync(tag);\n    }\n}\n\n// ====== PWA INITIALIZATION ======\n\ndocument.addEventListener('DOMContentLoaded', () => {\n    const pwaManager = new PWAManager();\n    \n    // Make available globally\n    window.pwaManager = pwaManager;\n    \n    // Add PWA controls to existing UI\n    addPWAControls(pwaManager);\n});\n\nfunction addPWAControls(pwaManager) {\n    // Add install button to navigation or header\n    const nav = document.querySelector('.navbar');\n    if (nav && !pwaManager.isInstalled) {\n        const installBtn = document.createElement('button');\n        installBtn.className = 'pwa-install-btn';\n        installBtn.innerHTML = '<i class=\"fas fa-download\"></i>';\n        installBtn.title = 'App installieren';\n        installBtn.addEventListener('click', () => pwaManager.installApp());\n        \n        nav.appendChild(installBtn);\n    }\n    \n    // Add to mobile navigation\n    const mobileNav = document.querySelector('.mobile-quick-actions');\n    if (mobileNav && !pwaManager.isInstalled) {\n        const mobileInstallBtn = document.createElement('button');\n        mobileInstallBtn.className = 'quick-action-btn';\n        mobileInstallBtn.innerHTML = `\n            <i class=\"fas fa-mobile-alt\"></i>\n            <span>App installieren</span>\n        `;\n        mobileInstallBtn.addEventListener('click', () => pwaManager.installApp());\n        \n        mobileNav.querySelector('.quick-action-grid').appendChild(mobileInstallBtn);\n    }\n}