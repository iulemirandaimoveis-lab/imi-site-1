// Form submission handler
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const alertContainer = form.querySelector('.alert-container');

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // Simulate API call
    setTimeout(() => {
        // Show success message
        alertContainer.innerHTML = `
            <div class="alert alert-success">
                Solicitação enviada com sucesso! Entraremos em contato em breve.
            </div>
        `;

        // Reset form
        form.reset();

        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = form.dataset.submitText || 'Enviar';

        // Scroll to alert
        alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1500);
}

// Property filter
function filterProperties() {
    const typeFilter = document.getElementById('filter-type')?.value || '';
    const statusFilter = document.getElementById('filter-status')?.value || '';
    const cityFilter = document.getElementById('filter-city')?.value || '';

    const properties = document.querySelectorAll('.property-card');
    let visibleCount = 0;

    properties.forEach(property => {
        const type = property.dataset.type || '';
        const status = property.dataset.status || '';
        const city = property.dataset.city || '';

        const typeMatch = !typeFilter || type === typeFilter;
        const statusMatch = !statusFilter || status === statusFilter;
        const cityMatch = !cityFilter || city === cityFilter;

        if (typeMatch && statusMatch && cityMatch) {
            property.style.display = 'block';
            visibleCount++;
        } else {
            property.style.display = 'none';
        }
    });

    // Update count
    const countElement = document.getElementById('property-count');
    if (countElement) {
        countElement.textContent = `${visibleCount} ${visibleCount === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}`;
    }
}

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Smooth scroll for hash links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add fade-in animation to sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.container, .hero').forEach(section => {
        observer.observe(section);
    });
});
