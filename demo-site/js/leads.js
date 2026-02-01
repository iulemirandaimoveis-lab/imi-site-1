// IMI - Leads Management

let currentFilter = 'all';
let leadsData = [];

// Filter leads by status
function filterLeads(status) {
    currentFilter = status;

    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter cards
    const cards = document.querySelectorAll('.lead-card');
    cards.forEach(card => {
        if (status === 'all' || card.dataset.status === status) {
            card.style.display = 'block';
            // Animate in
            card.style.animation = 'fadeInUp 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Search leads
function searchLeads(query) {
    query = query.toLowerCase();
    const cards = document.querySelectorAll('.lead-card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const matchesFilter = currentFilter === 'all' || card.dataset.status === currentFilter;
        const matchesSearch = text.includes(query);

        if (matchesFilter && matchesSearch) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Open lead detail modal
function openLeadModal(leadId) {
    const modal = document.getElementById('lead-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Add smooth animation
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideIn 0.3s ease';

    // Load lead data (simulated)
    loadLeadData(leadId);
}

// Close lead modal
function closeLeadModal() {
    const modal = document.getElementById('lead-modal');
    const modalContent = modal.querySelector('.modal-content');

    // Animate out
    modalContent.style.animation = 'modalSlideOut 0.3s ease';

    setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }, 300);
}

// Load lead data
function loadLeadData(leadId) {
    // Simulated data - in production, fetch from API
    const leads = {
        1: {
            name: 'João Mendes',
            email: 'joao.mendes@email.com',
            phone: '(81) 99876-5432',
            message: 'Gostaria de agendar uma visita ao apartamento em Jardins. Tenho interesse em conhecer pessoalmente e gostaria de saber mais sobre as condições de pagamento.',
            status: 'new'
        },
        2: {
            name: 'Maria Silva',
            email: 'maria.silva@email.com',
            phone: '(81) 99123-4567',
            message: 'Preciso de uma avaliação técnica para financiamento. Qual o prazo e valor?',
            status: 'progress'
        },
        3: {
            name: 'Pedro Costa',
            email: 'pedro.costa@email.com',
            phone: '(81) 99555-7788',
            message: 'Avaliação concluída. Cliente satisfeito com o serviço prestado.',
            status: 'converted'
        },
        4: {
            name: 'Ana Santos',
            email: 'ana.santos@email.com',
            phone: '(81) 99444-3322',
            message: 'Preciso de consultoria para investimento em imóveis comerciais. Pode me ajudar?',
            status: 'new'
        }
    };

    const lead = leads[leadId];
    if (lead) {
        document.getElementById('modal-name').textContent = lead.name;
        document.getElementById('modal-email').textContent = lead.email;
        document.getElementById('modal-phone').textContent = lead.phone;
        document.getElementById('modal-message').textContent = lead.message;
        document.getElementById('modal-status').value = lead.status;
    }
}

// Save lead notes
function saveLeadNotes() {
    const notes = document.querySelector('#lead-modal textarea').value;

    if (!notes.trim()) {
        showAlert('Por favor, adicione uma nota antes de salvar.', 'warning');
        return;
    }

    // Simulate saving
    showAlert('Anotação salva com sucesso!', 'success');

    // Add to history
    const history = document.querySelector('.lead-history');
    const newItem = document.createElement('div');
    newItem.className = 'history-item';
    newItem.innerHTML = `
        <div class="history-dot"></div>
        <div class="history-content">
            <span class="history-title">Nota adicionada</span>
            <span class="history-time">${formatDateTime(new Date())}</span>
        </div>
    `;
    history.insertBefore(newItem, history.firstChild);

    // Animate in
    newItem.style.animation = 'fadeInLeft 0.3s ease';

    // Clear textarea
    document.querySelector('#lead-modal textarea').value = '';
}

// Export leads to CSV
function exportLeads() {
    const leads = [
        { nome: 'João Mendes', email: 'joao.mendes@email.com', telefone: '(81) 99876-5432', status: 'Novo', data: '30/01/2026' },
        { nome: 'Maria Silva', email: 'maria.silva@email.com', telefone: '(81) 99123-4567', status: 'Em Andamento', data: '29/01/2026' },
        { nome: 'Pedro Costa', email: 'pedro.costa@email.com', telefone: '(81) 99555-7788', status: 'Convertido', data: '27/01/2026' },
        { nome: 'Ana Santos', email: 'ana.santos@email.com', telefone: '(81) 99444-3322', status: 'Novo', data: '30/01/2026' }
    ];

    exportToCSV(leads, 'leads-imi-' + new Date().toISOString().split('T')[0] + '.csv');
}

// Auto-refresh lead counts (simulated real-time)
function updateLeadCounts() {
    // In production, fetch from API
    const counts = {
        all: 12,
        new: 5,
        progress: 4,
        converted: 3
    };

    document.querySelectorAll('.tab-count').forEach((el, index) => {
        const statuses = ['all', 'new', 'progress', 'converted'];
        el.textContent = counts[statuses[index]];
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Update counts every 30 seconds
    setInterval(updateLeadCounts, 30000);

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // ESC to close modal
        if (e.key === 'Escape') {
            const modal = document.getElementById('lead-modal');
            if (modal.classList.contains('active')) {
                closeLeadModal();
            }
        }
    });

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    @keyframes modalSlideOut {
        from {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
        to {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);
