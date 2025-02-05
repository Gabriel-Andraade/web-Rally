document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register");
    const confirmButton = document.getElementById("confirmForm");
    const icon = document.getElementById("icon");

    const inputFields = [
        document.getElementById('name'),
        document.getElementById('lastName'),
        document.getElementById('email'),
        document.getElementById('number'),
        document.getElementById('password'),
        document.getElementById('confirm')
    ];

    inputFields.forEach(field => {
        field.addEventListener('input', () => {
            const allFilled = inputFields.every(input => input.value.trim() !== '');
            if (allFilled) {
                icon.classList.remove("fa-door-closed");
                icon.classList.add("fa-door-open");
            } else {
                icon.classList.remove("fa-door-open");
                icon.classList.add("fa-door-closed");
            }
        });
    });

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = getFormData();

        if (formData.password !== formData.confirm) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            const response = await sendRegistrationData(formData);
            handleResponse(response);
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            alert('Erro ao registrar usuário. Tente novamente mais tarde.');
        }
    });
});

function getFormData() {
    return {
        name: document.getElementById('name').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        number: document.getElementById('number').value,
        password: document.getElementById('password').value,
        confirm: document.getElementById('confirm').value
    };
}

async function sendRegistrationData(formData) {
    const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response.json();
}

function handleResponse(response) {
    if (response.message === 'Usuário registrado com sucesso!') {
        alert('Usuário registrado com sucesso!');
        window.location.href = '../main_pg/main_pg.html'; 
    } else {
        alert(`Erro: ${response.message}`);
    }
}