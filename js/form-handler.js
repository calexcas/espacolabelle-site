// Sistema de Recepção de Formulários - Espaço La Belle CG

// Configurações do formulário
const FORM_CONFIG = {
    // Opção 1: Formspree (Recomendado - Gratuito até 50 envios/mês)
    formspree: {
        endpoint: 'https://formspree.io/f/SEU_ID_AQUI', // Substituir pelo seu ID
        enabled: false // Ativar quando configurar
    },
    
    // Opção 2: Netlify Forms (Se hospedar no Netlify)
    netlify: {
        enabled: false
    },
    
    // Opção 3: Email direto via mailto
    email: {
        address: 'contato@espacolabelle.com.br',
        enabled: true
    },
    
    // Opção 4: WhatsApp direto
    whatsapp: {
        number: '5521990005476', // Formato: código país + DDD + número
        enabled: true
    }
};

// Sistema de armazenamento local (backup)
class FormStorage {
    static save(formData) {
        const submissions = this.getAll();
        const submission = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            data: formData,
            status: 'pending'
        };
        
        submissions.push(submission);
        localStorage.setItem('form_submissions', JSON.stringify(submissions));
        
        console.log('💾 Formulário salvo localmente:', submission);
        return submission;
    }
    
    static getAll() {
        const stored = localStorage.getItem('form_submissions');
        return stored ? JSON.parse(stored) : [];
    }
    
    static markAsSent(id) {
        const submissions = this.getAll();
        const submission = submissions.find(s => s.id === id);
        if (submission) {
            submission.status = 'sent';
            localStorage.setItem('form_submissions', JSON.stringify(submissions));
        }
    }
    
    static export() {
        const submissions = this.getAll();
        const csv = this.convertToCSV(submissions);
        this.downloadCSV(csv, 'contatos-labelle.csv');
    }
    
    static convertToCSV(submissions) {
        const headers = ['Data', 'Nome', 'Telefone', 'Email', 'Serviço', 'Mensagem', 'Status'];
        const rows = submissions.map(s => [
            new Date(s.timestamp).toLocaleString('pt-BR'),
            s.data.nome || '',
            s.data.telefone || '',
            s.data.email || '',
            s.data.servico || '',
            (s.data.mensagem || '').replace(/[,\n]/g, ' '),
            s.status
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    static downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// Processador de formulários
class FormProcessor {
    static async process(formData) {
        // Salva localmente primeiro
        const submission = FormStorage.save(formData);
        
        // Tenta enviar por diferentes métodos
        let success = false;
        
        // Método 1: Formspree
        if (FORM_CONFIG.formspree.enabled) {
            success = await this.sendViaFormspree(formData);
            if (success) {
                FormStorage.markAsSent(submission.id);
                return { success: true, method: 'formspree' };
            }
        }
        
        // Método 2: WhatsApp (sempre funciona)
        if (FORM_CONFIG.whatsapp.enabled) {
            this.sendViaWhatsApp(formData);
            FormStorage.markAsSent(submission.id);
            return { success: true, method: 'whatsapp' };
        }
        
        // Método 3: Email direto
        if (FORM_CONFIG.email.enabled) {
            this.sendViaEmail(formData);
            return { success: true, method: 'email' };
        }
        
        return { success: false, method: 'none' };
    }
    
    static async sendViaFormspree(formData) {
        try {
            const response = await fetch(FORM_CONFIG.formspree.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            return response.ok;
        } catch (error) {
            console.error('❌ Erro no Formspree:', error);
            return false;
        }
    }
    
    static sendViaWhatsApp(formData) {
        const message = this.formatWhatsAppMessage(formData);
        const url = `https://wa.me/${FORM_CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }
    
    static sendViaEmail(formData) {
        const subject = `Contato do Site - ${formData.nome}`;
        const body = this.formatEmailMessage(formData);
        const url = `mailto:${FORM_CONFIG.email.address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = url;
    }
    
    static formatWhatsAppMessage(formData) {
        return `🌟 *NOVO CONTATO DO SITE* 🌟

👤 *Nome:* ${formData.nome}
📱 *Telefone:* ${formData.telefone}
📧 *Email:* ${formData.email}
💅 *Serviço:* ${formData.servico || 'Não especificado'}

💬 *Mensagem:*
${formData.mensagem || 'Nenhuma mensagem adicional'}

⏰ *Data:* ${new Date().toLocaleString('pt-BR')}`;
    }
    
    static formatEmailMessage(formData) {
        return `Novo contato recebido pelo site:

Nome: ${formData.nome}
Telefone: ${formData.telefone}
Email: ${formData.email}
Serviço de Interesse: ${formData.servico || 'Não especificado'}

Mensagem:
${formData.mensagem || 'Nenhuma mensagem adicional'}

Data: ${new Date().toLocaleString('pt-BR')}`;
    }
}

// Interface para administração
class AdminPanel {
    static show() {
        const submissions = FormStorage.getAll();
        const panel = document.createElement('div');
        panel.className = 'admin-panel fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        panel.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-4xl max-h-96 overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">📊 Contatos Recebidos (${submissions.length})</h3>
                    <div class="space-x-2">
                        <button onclick="FormStorage.export()" class="bg-green-500 text-white px-3 py-1 rounded text-sm">
                            📥 Exportar CSV
                        </button>
                        <button onclick="this.closest('.admin-panel').remove()" class="bg-red-500 text-white px-3 py-1 rounded text-sm">
                            ✖️ Fechar
                        </button>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-sm border-collapse border">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="border p-2">Data</th>
                                <th class="border p-2">Nome</th>
                                <th class="border p-2">Telefone</th>
                                <th class="border p-2">Email</th>
                                <th class="border p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${submissions.map(s => `
                                <tr>
                                    <td class="border p-2">${new Date(s.timestamp).toLocaleString('pt-BR')}</td>
                                    <td class="border p-2">${s.data.nome}</td>
                                    <td class="border p-2">${s.data.telefone}</td>
                                    <td class="border p-2">${s.data.email}</td>
                                    <td class="border p-2">
                                        <span class="${s.status === 'sent' ? 'text-green-600' : 'text-orange-600'}">
                                            ${s.status === 'sent' ? '✅ Enviado' : '⏳ Pendente'}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="mt-4 text-xs text-gray-500">
                    💡 Dica: Os contatos são salvos no seu navegador. Exporte regularmente para não perder dados.
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
    }
}

// Atalho para administrador (Ctrl+Shift+A)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        AdminPanel.show();
    }
});

// Exportar para uso global
window.FormProcessor = FormProcessor;
window.FormStorage = FormStorage;
window.AdminPanel = AdminPanel;

console.log('📧 Sistema de formulários carregado!');
console.log('💡 Pressione Ctrl+Shift+A para ver os contatos recebidos');
