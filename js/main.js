// Espaço La Belle CG - JavaScript Interativo
document.addEventListener('DOMContentLoaded', function() {
    // Inicialização
    initMobileMenu();
    initSmoothScrolling();
    initActiveNavigation();
    initContactForm();
    initGallery();
    initAnimations();
    initAccessibility();
    initWhatsApp();
    initMaps();
    initSocialMedia();
    
    console.log('🎉 Espaço Labelle website carregado!');
});

// Menu Mobile
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
            
            // Atualiza ícone do botão
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('show')) {
                icon.className = 'fas fa-times text-xl';
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            } else {
                icon.className = 'fas fa-bars text-xl';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Fecha menu ao clicar em um link
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = 'fas fa-bars text-xl';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Fecha menu ao clicar fora
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = 'fas fa-bars text-xl';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Navegação Suave
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^=\"#\"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navegação Ativa
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNavigation() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateActiveNavigation, 100));
    updateActiveNavigation(); // Executa na inicialização
}

// Formulário de Contato
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type=\"submit\"]');
            const originalText = submitBtn.innerHTML;
            
            // Estado de carregamento
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-loading');
            submitBtn.innerHTML = 'Enviando...';
            
            // Processa formulário imediatamente
            try {
                // Coleta dados do formulário
                const formData = new FormData(contactForm);
                const data = {
                    nome: formData.get('nome'),
                    telefone: formData.get('telefone'),
                    email: formData.get('email'),
                    servico: formData.get('servico'),
                    mensagem: formData.get('mensagem')
                };
                
                console.log('📨 Processando formulário:', data);
                
                // Validação rápida
                if (!data.nome || !data.telefone) {
                    throw new Error('Nome e telefone são obrigatórios');
                }
                
                // Envia direto para WhatsApp
                const whatsappMessage = formatWhatsAppMessage(data);
                const whatsappUrl = `https://wa.me/5521990005476?text=${encodeURIComponent(whatsappMessage)}`;
                
                console.log('📱 URL do WhatsApp:', whatsappUrl);
                
                // Salva backup local
                FormStorage.save(data);
                
                // Tenta diferentes métodos para abrir WhatsApp
                const opened = tryOpenWhatsApp(whatsappUrl);
                
                if (opened) {
                    // 🎯 EVENTO DE CONVERSÃO - FORMULÁRIO ENVIADO
                    Analytics.trackEvent('Lead', 'WhatsApp_Contact', 'Form_Submission');
                    Analytics.trackConversion('form_submit', {
                        service: data.servico || 'not_specified',
                        source: 'website_form'
                    });
                    
                    // Feedback para o usuário
                    showNotification('📱 WhatsApp aberto! Complete o envio por lá.', 'success');
                    
                    // Reset do formulário após sucesso
                    setTimeout(() => {
                        contactForm.reset();
                    }, 1000);
                } else {
                    // Fallback: copia para clipboard
                    navigator.clipboard.writeText(whatsappMessage).then(() => {
                        showNotification('📋 Mensagem copiada! Cole no WhatsApp: (21) 99000-5476', 'info');
                    }).catch(() => {
                        showNotification('❌ Erro ao abrir WhatsApp. Ligue: (21) 99000-5476', 'error');
                    });
                }
                
            } catch (error) {
                console.error('❌ Erro no formulário:', error);
                showNotification('❌ Erro: ' + error.message, 'error');
            } finally {
                // Restaura botão sempre
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-loading');
                submitBtn.innerHTML = originalText;
            }
        });
        
        // Validação em tempo real
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

// Validação de Campo
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    
    let isValid = true;
    let errorMessage = '';
    
    // Validação básica
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório.';
    }
    
    // Validação específica por tipo
    if (value && type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, insira um e-mail válido.';
        }
    }
    
    if (value && type === 'tel') {
        const phoneRegex = /^[\(\)\s\-\+\d]{10,}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Por favor, insira um telefone válido.';
        }
    }
    
    // Aplica estilo de erro
    if (isValid) {
        field.classList.remove('error', 'border-red-500');
        field.classList.add('border-green-500');
        removeFieldError(field);
    } else {
        field.classList.add('error', 'border-red-500');
        field.classList.remove('border-green-500');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Mostra erro no campo
function showFieldError(field, message) {
    removeFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Remove erro do campo
function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Galeria Interativa
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Simula abertura de modal da galeria
            const content = this.querySelector('p').textContent;
            showNotification(`Visualizando: ${content}`, 'info');
        });
        
        // Adiciona efeito de hover com delay
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Animações de Scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observa elementos para animação
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, h3, h4');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Melhorias de Acessibilidade
function initAccessibility() {
    // Skip link
    addSkipLink();
    
    // Indicadores de foco melhorados
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Escape para fechar menu mobile
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                const mobileMenuBtn = document.getElementById('mobile-menu-btn');
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = 'fas fa-bars text-xl';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

// Adiciona skip link para acessibilidade
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#inicio';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Pular para o conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Sistema de Notificações
function showNotification(message, type = 'info') {
    // Remove notificações existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${getNotificationClasses(type)}`;
    
    notification.innerHTML = `
        <div class=\"flex items-center\">
            <i class=\"${getNotificationIcon(type)} mr-3\"></i>
            <span class=\"flex-1\">${message}</span>
            <button class=\"ml-3 text-current opacity-70 hover:opacity-100\" onclick=\"this.parentElement.parentElement.remove()\">
                <i class=\"fas fa-times\"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationClasses(type) {
    const classes = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-black',
        info: 'bg-blue-500 text-white'
    };
    return classes[type] || classes.info;
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Função de Throttle para otimização
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Função de Debounce para otimização
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Utilitários
const Utils = {
    // Formatar telefone
    formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    },
    
    // Validar email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Capitalizar primeira letra
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    // Scroll para elemento
    scrollToElement(elementId, offset = 100) {
        const element = document.getElementById(elementId);
        if (element) {
            const top = element.offsetTop - offset;
            window.scrollTo({
                top: top,
                behavior: 'smooth'
            });
        }
    }
};

// Expor utilitários globalmente
window.LaBeautyUtils = Utils;

// Service Worker Registration (se disponível)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('✅ Service Worker registrado com sucesso:', registration.scope);
            })
            .catch(function(error) {
                console.log('❌ Service Worker falhou ao registrar:', error);
            });
    });
}

// Analytics e Performance
const Analytics = {
    // Rastrear eventos
    trackEvent(category, action, label) {
        console.log(`📊 Evento rastreado: ${category} - ${action} - ${label}`);
        
        // ========================================
        // 🎯 INTEGRAÇÃO COM PIXELS DE RASTREAMENTO
        // ========================================
        
        // Google Analytics 4 (GA4)
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', action, {
                content_category: category,
                content_name: label
            });
        }
        
        // Google Ads Conversion
        if (typeof gtag !== 'undefined' && action === 'WhatsApp_Contact') {
            gtag('event', 'conversion', {
                'send_to': 'AW-XXXXXXXXX/XXXXXXXXX', // Substitua pelo seu ID
                'value': 1.0,
                'currency': 'BRL'
            });
        }
        
        // TikTok Pixel
        if (typeof ttq !== 'undefined') {
            ttq.track('ClickButton', {
                content_type: category,
                content_name: label
            });
        }
        
        // Eventos personalizados para outras plataformas
        if (window.dataLayer) {
            window.dataLayer.push({
                event: 'custom_event',
                event_category: category,
                event_action: action,
                event_label: label
            });
        }
    },
    
    // Rastrear conversões específicas
    trackConversion(conversionType, data = {}) {
        console.log(`🎯 Conversão rastreada: ${conversionType}`, data);
        
        // Google Analytics 4 - Eventos de Conversão
        if (typeof gtag !== 'undefined') {
            gtag('event', conversionType, {
                ...data,
                event_category: 'conversion'
            });
        }
        
        // Facebook Pixel - Eventos de Conversão
        if (typeof fbq !== 'undefined') {
            if (conversionType === 'form_submit') {
                fbq('track', 'Lead', data);
            } else if (conversionType === 'whatsapp_click') {
                fbq('track', 'Contact', data);
            }
        }
        
        // TikTok Pixel - Conversões
        if (typeof ttq !== 'undefined') {
            ttq.track('Contact', data);
        }
        
        // Google Ads - Conversão
        if (typeof gtag !== 'undefined' && conversionType === 'form_submit') {
            gtag('event', 'conversion', {
                'send_to': 'AW-XXXXXXXXX/XXXXXXXXX', // 🎯 SUBSTITUA PELO SEU ID
                'value': 1.0,
                'currency': 'BRL'
            });
        }
    },
    
    // Rastrear performance
    trackPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const perfData = performance.timing;
                    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`⚡ Tempo de carregamento: ${loadTime}ms`);
                }, 0);
            });
        }
    }
};

// Inicializar analytics
Analytics.trackPerformance();

// WhatsApp Integration
function initWhatsApp() {
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const whatsappConfig = {
        number: '5521990005476', // Substitua pelo número real
        message: '🌟 Olá! Gostaria de agendar um horário no Espaço Labelle. Pode me ajudar?'
    };
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const url = `https://wa.me/${whatsappConfig.number}?text=${encodeURIComponent(whatsappConfig.message)}`;
            console.log('📱 Botão flutuante - URL WhatsApp:', url);
            
            // Tenta abrir WhatsApp
            const opened = tryOpenWhatsApp(url);
            
            if (opened) {
                // 🎯 EVENTO DE CONVERSÃO - BOTÃO FLUTUANTE
                Analytics.trackEvent('Lead', 'WhatsApp_Contact', 'Float_Button');
                Analytics.trackConversion('whatsapp_click', {
                    source: 'float_button'
                });
                
                showNotification('📱 WhatsApp aberto!', 'success');
            } else {
                // Fallback
                showNotification('📱 Ligue: (21) 99000-5476', 'info');
            }
        });
        
        // Animação especial a cada 30 segundos
        setInterval(() => {
            whatsappBtn.classList.add('animate-bounce');
            setTimeout(() => {
                whatsappBtn.classList.remove('animate-bounce');
            }, 3000);
        }, 30000);
    }
}

// Maps Integration
function initMaps() {
    const mapElements = document.querySelectorAll('.map-container, .map-placeholder');
    const locationData = {
        address: 'Estrada Rio São Paulo, 1095, Campo Grande, Rio de Janeiro - RJ',
        coordinates: {
            lat: -22.8738,
            lng: -43.5676
        },
        name: 'Espaço Labelle'
    };
    
    mapElements.forEach(element => {
        element.addEventListener('click', function() {
            openMapsApp(locationData);
        });
    });
}

function openMapsApp(location) {
    // Detecta se é mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let url;
    
    if (isMobile) {
        // Para mobile, tenta abrir app nativo primeiro
        if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
            // iOS - Apple Maps primeiro, depois Google Maps
            url = `maps://maps.google.com/maps?q=${encodeURIComponent(location.address)}`;
            
            // Fallback para Google Maps web se não conseguir abrir app nativo
            setTimeout(() => {
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`, '_blank');
            }, 1000);
        } else {
            // Android - Google Maps
            url = `geo:${location.coordinates.lat},${location.coordinates.lng}?q=${encodeURIComponent(location.address)}`;
        }
    } else {
        // Desktop - Google Maps web
        url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
    }
    
    // Tenta abrir o app/site
    try {
        if (isMobile && !navigator.userAgent.includes('iPhone')) {
            window.location.href = url;
        } else {
            window.open(url, '_blank');
        }
        
        // Analytics
        Analytics.trackEvent('Maps', 'Open', isMobile ? 'Mobile' : 'Desktop');
        
        // Feedback visual
        showNotification('📍 Abrindo localização no seu GPS...', 'info');
        
    } catch (error) {
        console.error('❌ Erro ao abrir mapa:', error);
        
        // Fallback - copia endereço para clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(location.address);
            showNotification('📋 Endereço copiado para área de transferência!', 'success');
        } else {
            showNotification('📍 ' + location.address, 'info');
        }
    }
    
    console.log('🗺️ Mapa aberto:', url);
}

// Formatar mensagem para WhatsApp
function formatWhatsAppMessage(formData) {
    let message = `🌟 *AGENDAMENTO - ESPAÇO LABELLE* 🌟\n\n`;
    
    message += `👤 *Nome:* ${formData.nome}\n`;
    message += `📱 *Telefone:* ${formData.telefone}\n`;
    
    if (formData.email && formData.email.trim() !== '') {
        message += `📧 *Email:* ${formData.email}\n`;
    }
    
    if (formData.servico && formData.servico !== '') {
        const servicos = {
            'cabelo': '💇‍♀️ Cabelo',
            'estetica': '✨ Estética',
            'manicure': '💅 Manicure & Pedicure',
            'sobrancelhas': '👁️ Sobrancelhas & Cílios',
            'maquiagem': '💄 Maquiagem',
            'pacotes': '🎁 Pacotes Especiais'
        };
        message += `💅 *Serviço:* ${servicos[formData.servico] || formData.servico}\n`;
    }
    
    if (formData.mensagem && formData.mensagem.trim() !== '') {
        message += `\n💬 *Mensagem:*\n${formData.mensagem}\n`;
    }
    
    message += `\n⏰ *Enviado em:* ${new Date().toLocaleString('pt-BR')}\n`;
    message += `\n_Mensagem enviada pelo site do Espaço Labelle_ 💖`;
    
    return message;
}

// Tenta abrir WhatsApp com diferentes métodos
function tryOpenWhatsApp(url) {
    console.log('🔄 Tentando abrir WhatsApp:', url);
    
    try {
        // Método 1: window.open (mais compatível)
        const newWindow = window.open(url, '_blank');
        
        if (newWindow) {
            console.log('✅ WhatsApp aberto via window.open');
            return true;
        }
        
        // Método 2: location.href (para mobile)
        if (isMobileDevice()) {
            window.location.href = url;
            console.log('✅ WhatsApp aberto via location.href (mobile)');
            return true;
        }
        
        // Método 3: criar link temporário e clicar
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('✅ WhatsApp aberto via link temporário');
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao abrir WhatsApp:', error);
        return false;
    }
}

// Detecta se é dispositivo móvel
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Social Media Integration
function initSocialMedia() {
    // Rastrear cliques nas redes sociais
    const socialLinks = document.querySelectorAll('a[href*="instagram"], a[href*="facebook"], a[href*="wa.me"]');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const url = this.href;
            let platform = 'Unknown';
            
            if (url.includes('instagram')) {
                platform = 'Instagram';
            } else if (url.includes('facebook')) {
                platform = 'Facebook';
            } else if (url.includes('wa.me')) {
                platform = 'WhatsApp';
            }
            
            // Analytics
            Analytics.trackEvent('Social Media', 'Click', platform);
            
            console.log('📱 Rede social acessada:', platform, url);
            
            // Feedback visual sutil
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    console.log('📱 Integração de redes sociais ativada!');
}

// Função para compartilhar conteúdo (futuro)
function shareContent(platform, text = '', url = window.location.href) {
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        instagram: `https://www.instagram.com/espacolabellesmalteria`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        Analytics.trackEvent('Share', 'Click', platform);
    }
}
