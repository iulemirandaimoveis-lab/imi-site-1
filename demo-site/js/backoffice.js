// IMI Backoffice - JavaScript Compartilhado

// ===== AUTHENTICATION =====
function checkAuth() {
    const session = localStorage.getItem('imiSession') || sessionStorage.getItem('imiSession');
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }

    const sessionData = JSON.parse(session);
    const userEmailElement = document.getElementById('user-email');
    if (userEmailElement) {
        userEmailElement.textContent = sessionData.email;
    }

    return sessionData;
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('imiSession');
        sessionStorage.removeItem('imiSession');
        window.location.href = 'login.html';
    }
}

// ===== SIDEBAR =====
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('.admin-main');
    const toggle = document.querySelector('.mobile-menu-toggle');

    if (!sidebar) return;

    // Toggle sidebar visibility
    sidebar.classList.toggle('active');

    // Toggle hamburger animation
    if (toggle) {
        toggle.classList.toggle('active');
    }

    // On desktop, also toggle main content margin
    if (window.innerWidth > 768) {
        main?.classList.toggle('expanded');
    }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.querySelector('.mobile-menu-toggle');

    if (window.innerWidth <= 768 && sidebar && toggle) {
        if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
            sidebar.classList.remove('active');
            toggle.classList.remove('active');
        }
    }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const sidebar = document.getElementById('sidebar');
        const toggle = document.querySelector('.mobile-menu-toggle');

        // Reset sidebar state on resize
        if (window.innerWidth > 768) {
            sidebar?.classList.remove('active');
            toggle?.classList.remove('active');
        }
    }, 250);
});

// ===== ALERTS =====
function showAlert(message, type = 'info') {
    const container = document.querySelector('.alert-container');
    if (!container) return;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <strong>${type === 'error' ? 'Erro!' : type === 'success' ? 'Sucesso!' : 'Informação:'}</strong><br>
        ${message}
    `;

    container.innerHTML = '';
    container.appendChild(alert);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transition = 'opacity 0.3s';
        setTimeout(() => alert.remove(), 300);
    }, 5000);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== FILE UPLOAD =====
class ImageUploader {
    constructor(options = {}) {
        this.maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB
        this.maxFiles = options.maxFiles || 10;
        this.acceptedFormats = options.acceptedFormats || ['image/jpeg', 'image/png', 'image/webp'];
        this.files = [];
        this.onFilesChange = options.onFilesChange || (() => { });
    }

    validateFile(file) {
        if (!this.acceptedFormats.includes(file.type)) {
            throw new Error(`Formato não aceito: ${file.type}`);
        }

        if (file.size > this.maxSize) {
            throw new Error(`Arquivo muito grande: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        }

        return true;
    }

    async compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Resize if too large
                    const maxDimension = 1920;
                    if (width > maxDimension || height > maxDimension) {
                        if (width > height) {
                            height = (height / width) * maxDimension;
                            width = maxDimension;
                        } else {
                            width = (width / height) * maxDimension;
                            height = maxDimension;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        }));
                    }, 'image/jpeg', 0.85);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    async addFiles(fileList) {
        const newFiles = Array.from(fileList);

        if (this.files.length + newFiles.length > this.maxFiles) {
            throw new Error(`Máximo de ${this.maxFiles} arquivos permitidos`);
        }

        for (const file of newFiles) {
            try {
                this.validateFile(file);
                const compressed = await this.compressImage(file);
                this.files.push(compressed);
            } catch (error) {
                console.error('Erro ao processar arquivo:', error);
                throw error;
            }
        }

        this.onFilesChange(this.files);
        return this.files;
    }

    removeFile(index) {
        this.files.splice(index, 1);
        this.onFilesChange(this.files);
    }

    clear() {
        this.files = [];
        this.onFilesChange(this.files);
    }

    getFiles() {
        return this.files;
    }
}

// ===== FORM VALIDATION =====
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

// ===== DATA FORMATTING =====
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));
}

function formatDateTime(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// ===== LOCAL STORAGE HELPERS =====
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
        return false;
    }
}

function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Erro ao ler do localStorage:', error);
        return defaultValue;
    }
}

// ===== DEBOUNCE =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== COPY TO CLIPBOARD =====
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showAlert('Copiado para a área de transferência!', 'success');
    } catch (error) {
        console.error('Erro ao copiar:', error);
        showAlert('Erro ao copiar para a área de transferência', 'error');
    }
}

// ===== EXPORT DATA =====
function exportToCSV(data, filename) {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function convertToCSV(data) {
    if (!data || !data.length) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.join(','));

    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            return `"${value}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Check auth on all backoffice pages
    if (window.location.pathname.includes('backoffice') ||
        window.location.pathname.includes('users') ||
        window.location.pathname.includes('properties-list') ||
        window.location.pathname.includes('leads') ||
        window.location.pathname.includes('settings')) {
        checkAuth();
    }
});
