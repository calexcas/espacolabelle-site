// Service Worker para Espaço La Belle CG
const CACHE_NAME = 'espaco-labelle-v1.1.0';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    // CDN Assets (cached dinamicamente)
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap'
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
    console.log('💾 Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('💾 Service Worker: Cache aberto');
                return cache.addAll(CACHE_URLS);
            })
            .then(function() {
                console.log('✅ Service Worker: Instalado com sucesso');
                return self.skipWaiting();
            })
            .catch(function(error) {
                console.error('❌ Service Worker: Erro na instalação:', error);
            })
    );
});

// Ativar Service Worker
self.addEventListener('activate', function(event) {
    console.log('🚀 Service Worker: Ativando...');
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            console.log('✅ Service Worker: Ativado com sucesso');
            return self.clients.claim();
        })
    );
});

// Interceptar requests
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - retorna resposta do cache
                if (response) {
                    console.log('📦 Service Worker: Servindo do cache:', event.request.url);
                    return response;
                }
                
                // Cache miss - busca na rede
                return fetch(event.request).then(function(response) {
                    // Verifica se é uma resposta válida
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clona a resposta
                    const responseToCache = response.clone();
                    
                    // Adiciona ao cache dinamicamente
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            // Cache apenas recursos do mesmo domínio e CDNs importantes
                            if (shouldCache(event.request.url)) {
                                console.log('💾 Service Worker: Adicionando ao cache:', event.request.url);
                                cache.put(event.request, responseToCache);
                            }
                        });
                    
                    return response;
                }).catch(function(error) {
                    console.log('🌐 Service Worker: Erro na rede:', error);
                    
                    // Retorna página offline personalizada se disponível
                    if (event.request.destination === 'document') {
                        return caches.match('/offline.html') || new Response(
                            getOfflineHTML(),
                            { 
                                headers: { 'Content-Type': 'text/html' }
                            }
                        );
                    }
                    
                    // Para outros recursos, retorna erro
                    return new Response('Recurso não disponível offline', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
    );
});

// Verifica se deve cachear a URL
function shouldCache(url) {
    const cacheablePatterns = [
        /^https:\/\/cdn\.tailwindcss\.com/,
        /^https:\/\/cdn\.jsdelivr\.net/,
        /^https:\/\/fonts\.googleapis\.com/,
        /^https:\/\/fonts\.gstatic\.com/,
        /\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i
    ];
    
    return cacheablePatterns.some(pattern => pattern.test(url));
}

// HTML offline básico
function getOfflineHTML() {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - Espaço Labelle</title>
        <style>
            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #ec4899, #8b5cf6);
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                color: white;
            }
            .offline-container {
                max-width: 500px;
                padding: 2rem;
            }
            .offline-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            .offline-title {
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 1rem;
            }
            .offline-message {
                font-size: 1.1rem;
                margin-bottom: 2rem;
                opacity: 0.9;
            }
            .offline-button {
                background: rgba(255,255,255,0.2);
                border: 2px solid white;
                color: white;
                padding: 1rem 2rem;
                border-radius: 25px;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.3s;
            }
            .offline-button:hover {
                background: white;
                color: #ec4899;
            }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="offline-icon">📱</div>
            <h1 class="offline-title">Você está offline</h1>
            <p class="offline-message">
                Parece que você não está conectado à internet. 
                Verifique sua conexão e tente novamente.
            </p>
            <button class="offline-button" onclick="window.location.reload()">
                Tentar Novamente
            </button>
        </div>
    </body>
    </html>
    `;
}

// Sync em background (quando voltar online)
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-sync') {
        console.log('🔄 Service Worker: Sincronização em background');
        event.waitUntil(
            // Aqui você pode implementar sincronização de dados
            // Por exemplo, enviar formulários que ficaram pendentes
            syncPendingData()
        );
    }
});

// Sincronizar dados pendentes
function syncPendingData() {
    return new Promise((resolve, reject) => {
        // Implementar lógica de sincronização
        console.log('📤 Service Worker: Sincronizando dados pendentes...');
        
        // Exemplo: buscar dados do IndexedDB e enviar para servidor
        // Por enquanto, apenas resolve
        setTimeout(() => {
            console.log('✅ Service Worker: Sincronização concluída');
            resolve();
        }, 1000);
    });
}

// Push notifications (se implementado no futuro)
self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Clique em notificação
self.addEventListener('notificationclick', function(event) {
    console.log('🔔 Service Worker: Notificação clicada');
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Mensagens do main thread
self.addEventListener('message', function(event) {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

console.log('🚀 Service Worker carregado - Versão:', CACHE_NAME);