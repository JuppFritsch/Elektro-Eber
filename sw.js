// ====== PROGRESSIVE WEB APP SERVICE WORKER ======

const CACHE_NAME = 'elektro-eber-v1.2.0';
const STATIC_CACHE = 'elektro-eber-static-v1.2.0';
const DYNAMIC_CACHE = 'elektro-eber-dynamic-v1.2.0';

// URLs to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/touch-gestures.js',
    '/mobile-navigation.js',
    '/advanced-swipe.js',
    '/manifest.json',
    
    // Essential external resources
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    
    // Offline page
    '/offline.html'
];

// URLs to cache on demand
const DYNAMIC_ASSETS = [
    '/icons/',
    '/images/',
    '/screenshots/'
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
    '/api/',
    '/?action=',
    'mailto:',
    'tel:'
];

// ====== SERVICE WORKER INSTALLATION ======

self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installation started');
    
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then((cache) => {
                console.log('📦 Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),
            
            // Skip waiting to activate immediately
            self.skipWaiting()
        ])
    );
});

// ====== SERVICE WORKER ACTIVATION ======

self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker: Activation started');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            cleanupOldCaches(),
            
            // Claim all clients
            self.clients.claim()
        ])
    );
});

async function cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const validCaches = [STATIC_CACHE, DYNAMIC_CACHE];
    
    const deletePromises = cacheNames
        .filter(name => !validCaches.includes(name))
        .map(name => {
            console.log('🗑️ Deleting old cache:', name);
            return caches.delete(name);
        });
    
    return Promise.all(deletePromises);
}

// ====== FETCH EVENT HANDLING ======

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Handle different types of requests
    if (isStaticAsset(request.url)) {
        event.respondWith(cacheFirst(request));
    } else if (isNetworkFirst(request.url)) {
        event.respondWith(networkFirst(request));
    } else if (isDynamicAsset(request.url)) {
        event.respondWith(staleWhileRevalidate(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

// ====== CACHING STRATEGIES ======

// Cache First - for static assets
async function cacheFirst(request) {
    try {
        const cached = await caches.match(request);
        if (cached) {
            console.log('📋 Serving from cache:', request.url);
            return cached;
        }
        
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('❌ Cache first failed:', error);
        return getOfflinePage();
    }
}

// Network First - for dynamic content
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        
        if (response.ok) {
            // Cache successful responses
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.log('🌐 Network failed, trying cache:', request.url);
        
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return getOfflinePage();
        }
        
        throw error;
    }
}

// Stale While Revalidate - for images and assets
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    
    // Start fetch in background
    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => cached);
    
    // Return cached version immediately if available
    return cached || fetchPromise;
}

// ====== UTILITY FUNCTIONS ======

function isStaticAsset(url) {
    return STATIC_ASSETS.some(asset => url.includes(asset)) ||
           url.includes('.css') ||
           url.includes('.js') ||
           url.includes('.woff') ||
           url.includes('.woff2');
}

function isNetworkFirst(url) {
    return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

function isDynamicAsset(url) {
    return DYNAMIC_ASSETS.some(pattern => url.includes(pattern)) ||
           url.includes('.png') ||
           url.includes('.jpg') ||
           url.includes('.jpeg') ||
           url.includes('.webp') ||
           url.includes('.svg');
}

async function getOfflinePage() {
    try {
        return await caches.match('/offline.html');
    } catch {
        return new Response(
            generateOfflineHTML(),
            { 
                headers: { 'Content-Type': 'text/html' },
                status: 200
            }
        );
    }
}

function generateOfflineHTML() {
    return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline - Elektro Eber</title>
    <style>
        :root {
            --primary-color: #f59e0b;
            --background: #1e1e1e;
            --text: #ffffff;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--background);
            color: var(--text);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
        }
        
        .offline-container {
            text-align: center;
            max-width: 500px;
        }
        
        .offline-icon {
            font-size: 4rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        
        h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: var(--primary-color);
        }
        
        p {
            line-height: 1.6;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .offline-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        button {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: opacity 0.3s ease;
        }
        
        button:hover {
            opacity: 0.9;
        }
        
        .contact-info {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin: 0.5rem 0;
            font-size: 0.9rem;
        }
        
        @media (max-width: 600px) {
            .offline-actions { flex-direction: column; }
            button { width: 100%; }
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">⚡</div>
        <h1>Offline-Modus</h1>
        <p>Sie sind derzeit offline. Keine Sorge - einige Funktionen stehen weiterhin zur Verfügung!</p>
        
        <div class="offline-actions">
            <button onclick="window.location.reload()">
                🔄 Erneut versuchen
            </button>
            <button onclick="window.history.back()">
                ← Zurück
            </button>
        </div>
        
        <div class="contact-info">
            <div class="contact-item">
                <span>📞</span>
                <span>Notfall: +49 XXX XXXXXXX</span>
            </div>
            <div class="contact-item">
                <span>✉️</span>
                <span>info@elektro-eber.de</span>
            </div>
            <div class="contact-item">
                <span>🕒</span>
                <span>24/7 Notfallservice</span>
            </div>
        </div>
    </div>
    
    <script>
        // Auto-retry connection every 30 seconds
        setInterval(() => {
            if (navigator.onLine) {
                window.location.reload();
            }
        }, 30000);
        
        // Listen for online event
        window.addEventListener('online', () => {
            window.location.reload();
        });
    </script>
</body>
</html>`;
}

// ====== BACKGROUND SYNC ======

self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync:', event.tag);
    
    if (event.tag === 'contact-form') {
        event.waitUntil(syncContactForms());
    } else if (event.tag === 'chat-messages') {
        event.waitUntil(syncChatMessages());
    }
});

async function syncContactForms() {
    try {
        // Get pending forms from IndexedDB
        const pendingForms = await getPendingContactForms();
        
        for (const form of pendingForms) {
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form.data)
                });
                
                if (response.ok) {
                    await removePendingForm(form.id);
                    console.log('✅ Contact form synced successfully');
                }
            } catch (error) {
                console.error('❌ Failed to sync contact form:', error);
            }
        }
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

async function syncChatMessages() {
    try {
        // Sync pending chat messages
        const pendingMessages = await getPendingChatMessages();
        
        for (const message of pendingMessages) {
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(message.data)
                });
                
                if (response.ok) {
                    await removePendingMessage(message.id);
                    console.log('✅ Chat message synced successfully');
                }
            } catch (error) {
                console.error('❌ Failed to sync chat message:', error);
            }
        }
    } catch (error) {
        console.error('❌ Chat sync failed:', error);
    }
}

// ====== PUSH NOTIFICATIONS ======

self.addEventListener('push', (event) => {
    console.log('📱 Push notification received');
    
    const options = {
        body: 'Sie haben eine neue Nachricht von Elektro Eber',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'elektro-eber-notification',
        renotify: true,
        requireInteraction: false,
        actions: [
            {
                action: 'open',
                title: 'Öffnen',
                icon: '/icons/action-open.png'
            },
            {
                action: 'dismiss',
                title: 'Schließen',
                icon: '/icons/action-close.png'
            }
        ],
        data: {
            url: '/',
            timestamp: Date.now()
        }
    };
    
    if (event.data) {
        try {
            const payload = event.data.json();
            Object.assign(options, payload);
        } catch (error) {
            console.error('❌ Invalid push payload:', error);
        }
    }
    
    event.waitUntil(
        self.registration.showNotification('Elektro Eber', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'dismiss') {
        return;
    }
    
    const url = event.notification.data?.url || '/';
    
    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clients) => {
            // Check if there's already a window open
            for (const client of clients) {
                if (client.url.includes(self.location.origin)) {
                    client.focus();
                    client.navigate(url);
                    return;
                }
            }
            
            // Open new window if none exists
            return self.clients.openWindow(url);
        })
    );
});

// ====== INDEXEDDB HELPERS ======

async function getPendingContactForms() {
    // Implementation would depend on your IndexedDB setup
    return [];
}

async function removePendingForm(id) {
    // Implementation would depend on your IndexedDB setup
    console.log('Removing pending form:', id);
}

async function getPendingChatMessages() {
    // Implementation would depend on your IndexedDB setup
    return [];
}

async function removePendingMessage(id) {
    // Implementation would depend on your IndexedDB setup
    console.log('Removing pending message:', id);
}

// ====== CACHE MANAGEMENT ======

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    } else if (event.data && event.data.type === 'CACHE_UPDATE') {
        event.waitUntil(updateCaches());
    }
});

async function updateCaches() {
    const cache = await caches.open(STATIC_CACHE);
    return cache.addAll(STATIC_ASSETS);
}

// ====== ERROR HANDLING ======

self.addEventListener('error', (event) => {
    console.error('❌ Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Service Worker unhandled rejection:', event.reason);
});

console.log('🚀 Service Worker loaded successfully');