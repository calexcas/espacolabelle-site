// Sistema de Gerenciamento de Galeria - Espaço La Belle CG

class GalleryManager {
    constructor() {
        this.images = this.loadImages();
        this.categories = [
            'ambiente', 'cabelo', 'estetica', 'manicure', 
            'sobrancelhas', 'maquiagem', 'antes-depois'
        ];
        this.init();
    }
    
    init() {
        this.renderGallery();
        this.addAdminControls();
        console.log('🖼️ Sistema de galeria carregado!');
    }
    
    // Carrega imagens do localStorage
    loadImages() {
        const stored = localStorage.getItem('gallery_images');
        return stored ? JSON.parse(stored) : this.getDefaultImages();
    }
    
    // Imagens padrão (placeholder)
    getDefaultImages() {
        return [
            {
                id: 1,
                url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop',
                title: 'Ambiente Aconchegante',
                category: 'ambiente',
                description: 'Nosso espaço foi pensado para seu conforto e relaxamento'
            },
            {
                id: 2,
                url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=400&fit=crop',
                title: 'Cortes Modernos',
                category: 'cabelo',
                description: 'Cortes e penteados seguindo as últimas tendências'
            },
            {
                id: 3,
                url: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=400&fit=crop',
                title: 'Tratamentos Faciais',
                category: 'estetica',
                description: 'Cuidados especializados para sua pele'
            },
            {
                id: 4,
                url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop',
                title: 'Nail Art Personalizada',
                category: 'manicure',
                description: 'Unhas decoradas com muito estilo e criatividade'
            },
            {
                id: 5,
                url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop',
                title: 'Design de Sobrancelhas',
                category: 'sobrancelhas',
                description: 'Sobrancelhas perfeitas para realçar seu olhar'
            },
            {
                id: 6,
                url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
                title: 'Maquiagem Profissional',
                category: 'maquiagem',
                description: 'Maquiagem para todas as ocasiões especiais'
            }
        ];
    }
    
    // Salva imagens no localStorage
    saveImages() {
        localStorage.setItem('gallery_images', JSON.stringify(this.images));
    }
    
    // Adiciona nova imagem
    addImage(imageData) {
        const newImage = {
            id: Date.now(),
            ...imageData,
            dateAdded: new Date().toISOString()
        };
        
        this.images.unshift(newImage);
        this.saveImages();
        this.renderGallery();
        
        console.log('✅ Nova imagem adicionada:', newImage);
        return newImage;
    }
    
    // Remove imagem
    removeImage(id) {
        this.images = this.images.filter(img => img.id !== id);
        this.saveImages();
        this.renderGallery();
        console.log('🗑️ Imagem removida:', id);
    }
    
    // Renderiza galeria
    renderGallery() {
        const galleryContainer = document.querySelector('#galeria .grid');
        if (!galleryContainer) return;
        
        galleryContainer.innerHTML = this.images.map(image => `
            <div class="gallery-item bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer" 
                 data-image-id="${image.id}">
                <div class="aspect-square relative overflow-hidden">
                    <img src="${image.url}" 
                         alt="${image.title}"
                         class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                         loading="lazy"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwdjIwMG0tMTAwLTEwMGgyMDAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+'">
                    
                    <!-- Overlay com informações -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div class="p-4 text-white w-full">
                            <h4 class="font-semibold text-sm mb-1">${image.title}</h4>
                            <p class="text-xs opacity-90">${image.description || ''}</p>
                        </div>
                    </div>
                    
                    <!-- Badge da categoria -->
                    <div class="absolute top-2 right-2">
                        <span class="bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                            ${this.getCategoryName(image.category)}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Adiciona eventos de clique
        this.addGalleryEvents();
    }
    
    // Adiciona eventos da galeria
    addGalleryEvents() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const imageId = parseInt(item.dataset.imageId);
                const image = this.images.find(img => img.id === imageId);
                if (image) {
                    this.openLightbox(image);
                }
            });
        });
    }
    
    // Abre lightbox
    openLightbox(image) {
        const lightbox = document.createElement('div');
        lightbox.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4';
        
        lightbox.innerHTML = `
            <div class="max-w-4xl max-h-full relative">
                <button class="absolute top-4 right-4 text-white text-2xl hover:text-pink-400 z-10" onclick="this.closest('.fixed').remove()">
                    <i class="fas fa-times"></i>
                </button>
                
                <img src="${image.url}" 
                     alt="${image.title}"
                     class="max-w-full max-h-screen object-contain rounded-lg">
                
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                    <h3 class="text-xl font-bold mb-2">${image.title}</h3>
                    <p class="text-gray-300">${image.description || ''}</p>
                    <div class="mt-2 text-sm text-pink-400">
                        <i class="fas fa-tag mr-1"></i>
                        ${this.getCategoryName(image.category)}
                    </div>
                </div>
            </div>
        `;
        
        // Fecha ao clicar fora
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.remove();
            }
        });
        
        // Fecha com ESC
        document.addEventListener('keydown', function escListener(e) {
            if (e.key === 'Escape') {
                lightbox.remove();
                document.removeEventListener('keydown', escListener);
            }
        });
        
        document.body.appendChild(lightbox);
    }
    
    // Nome amigável das categorias
    getCategoryName(category) {
        const names = {
            'ambiente': 'Ambiente',
            'cabelo': 'Cabelo',
            'estetica': 'Estética',
            'manicure': 'Manicure',
            'sobrancelhas': 'Sobrancelhas',
            'maquiagem': 'Maquiagem',
            'antes-depois': 'Antes/Depois'
        };
        return names[category] || category;
    }
    
    // Controles de administração
    addAdminControls() {
        // Botão flutuante para adicionar imagens (apenas para admin)
        const adminBtn = document.createElement('button');
        adminBtn.innerHTML = '<i class="fas fa-plus"></i>';
        adminBtn.className = 'admin-gallery-btn fixed bottom-20 left-4 bg-pink-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-pink-700 transition-colors z-40 hidden';
        adminBtn.title = 'Adicionar Imagem à Galeria';
        
        adminBtn.addEventListener('click', () => this.showAddImageModal());
        document.body.appendChild(adminBtn);
        
        // Mostra botão com Ctrl+Shift+G
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'G') {
                adminBtn.classList.toggle('hidden');
                if (!adminBtn.classList.contains('hidden')) {
                    console.log('🎨 Modo de edição da galeria ativado!');
                }
            }
        });
    }
    
    // Modal para adicionar imagem
    showAddImageModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-xl font-bold mb-4">📸 Adicionar Nova Imagem</h3>
                
                <form id="add-image-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-semibold mb-2">URL da Imagem *</label>
                        <input type="url" name="url" required 
                               class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                               placeholder="https://...">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold mb-2">Título *</label>
                        <input type="text" name="title" required 
                               class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                               placeholder="Ex: Corte moderno">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold mb-2">Categoria</label>
                        <select name="category" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500">
                            ${this.categories.map(cat => `
                                <option value="${cat}">${this.getCategoryName(cat)}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold mb-2">Descrição</label>
                        <textarea name="description" rows="3" 
                                  class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                  placeholder="Breve descrição da imagem..."></textarea>
                    </div>
                    
                    <div class="flex space-x-3 pt-4">
                        <button type="submit" class="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors">
                            <i class="fas fa-plus mr-2"></i>Adicionar
                        </button>
                        <button type="button" onclick="this.closest('.fixed').remove()" 
                                class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                    </div>
                </form>
                
                <div class="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
                    <h4 class="font-semibold text-blue-800 mb-2">💡 Dicas para melhores imagens:</h4>
                    <ul class="text-blue-700 space-y-1">
                        <li>• Use imagens em alta resolução (mín. 400x400px)</li>
                        <li>• Prefira formato quadrado para melhor layout</li>
                        <li>• Você pode usar URLs do Unsplash, Pexels ou suas próprias imagens</li>
                        <li>• Teste sempre se a URL carrega corretamente</li>
                    </ul>
                </div>
            </div>
        `;
        
        // Processa formulário
        modal.querySelector('#add-image-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            const imageData = {
                url: formData.get('url'),
                title: formData.get('title'),
                category: formData.get('category'),
                description: formData.get('description')
            };
            
            this.addImage(imageData);
            modal.remove();
            
            showNotification('✅ Imagem adicionada à galeria!', 'success');
        });
        
        document.body.appendChild(modal);
    }
    
    // Exporta dados da galeria
    exportGallery() {
        const data = {
            images: this.images,
            exportDate: new Date().toISOString(),
            total: this.images.length
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'galeria-labelle.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    // Importa dados da galeria
    importGallery(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.images && Array.isArray(data.images)) {
                this.images = data.images;
                this.saveImages();
                this.renderGallery();
                console.log('✅ Galeria importada com sucesso!');
                return true;
            }
        } catch (error) {
            console.error('❌ Erro ao importar galeria:', error);
        }
        return false;
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.galleryManager = new GalleryManager();
});

console.log('🖼️ Sistema de galeria carregado!');
console.log('💡 Pressione Ctrl+Shift+G para ativar modo de edição da galeria');
