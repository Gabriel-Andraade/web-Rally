document.addEventListener("DOMContentLoaded", () => {
    // Fetch para recuperar dados do usuário do servidor
    fetch('http://localhost:3000/users') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao recuperar os dados do usuário');
            }
            return response.json();
        })
        .then(users => {
            if (users.length > 0) {
                const userData = users[users.length - 1];
                document.getElementById("name").textContent = userData.name || "Nome não encontrado";
                document.getElementById("lastName").textContent = userData.lastName || "Sobrenome não encontrado";
                console.log("Dados do Usuário:", {
                    name: userData.name,
                    lastName: userData.lastName,
                    email: userData.email,
                    number: userData.number
                });
            } else {
                console.log("Nenhum dado encontrado.");
            }
        })
        .catch(error => {
            console.error('Erro ao recuperar os dados do usuário:', error);
        });

    // Fechar o infoCard clicando fora dele
    document.addEventListener("click", (event) => {
        const infoCard = document.getElementById('infoCard');
        if (
            infoCard.classList.contains('show') &&
            !infoCard.contains(event.target) &&
            !event.target.closest('button')
        ) {
            infoCard.classList.remove('show');
        }
    });
});

// Função para carregar e exibir o conteúdo de arquivos HTML externos via servidor
function showInfo(topic) {
    const infoCard = document.getElementById('infoCard');
    const infoText = document.getElementById('infoText');

    const contentURL = `http://localhost:3000/content/${topic}.html?t=${new Date().getTime()}`;

    fetch(contentURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar ${topic}.html`);
            }
            return response.text();
        })
        .then(data => {
            infoText.innerHTML = data; // Insere o conteúdo do arquivo no infoCard
            infoCard.classList.add('show'); // Exibe o infoCard
        })
        .catch(error => {
            console.error('Erro ao carregar o conteúdo:', error);
            infoText.innerHTML = `<p>Erro ao carregar as informações. Tente novamente mais tarde.</p>`;
            infoCard.classList.add('show');
        });
}