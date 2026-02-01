// IMI - Footer Loader
// Carrega o footer padrão em todas as páginas

document.addEventListener('DOMContentLoaded', function () {
    // Verifica se já existe um footer na página
    const existingFooter = document.querySelector('footer');

    // Se não existir, carrega o footer padrão
    if (!existingFooter) {
        loadFooter();
    }
});

function loadFooter() {
    fetch('includes/footer.html')
        .then(response => response.text())
        .then(html => {
            // Adiciona o footer ao final do body
            document.body.insertAdjacentHTML('beforeend', html);
        })
        .catch(error => {
            console.error('Erro ao carregar footer:', error);
        });
}
