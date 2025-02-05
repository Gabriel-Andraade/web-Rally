document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value; 
        const password = document.getElementById('password').value;

        if (!email || !password) {
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage) {
                errorMessage.textContent = 'Por favor, preencha todos os campos.';
            }
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/users');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const accounts = await response.json();

            const user = accounts.find(account => account.email === email && account.password === password);

            if (user) {
                alert(`Bem-vindo(a), ${user.name}! \u{1F604}`);
                window.location.href = '../main_pg/main_pg.html'; // Caminho absoluto
            } else {
                const errorMessage = document.getElementById('errorMessage');
                if (errorMessage) {
                    errorMessage.textContent = 'Usuário ou senha inválidos. Tente novamente.';
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage) {
                errorMessage.textContent = 'Erro ao buscar dados do usuário. Tente novamente mais tarde.';
            }
        }
    });
});