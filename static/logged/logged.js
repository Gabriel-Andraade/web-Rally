document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const cpf = document.getElementById("cpf").value;
    const errorMessage = document.getElementById("errorMessage");

    if (!email || !password || !cpf) {
      if (errorMessage) {
        errorMessage.textContent = "Por favor, preencha todos os campos.";
      }
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, cpf }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Bem-vindo(a), ${data.name}!`);
        localStorage.setItem("token", data.token ?? "fake-token");
        window.location.href = "/main_pg.html";
      } else {
        if (errorMessage) {
          errorMessage.textContent = data.message;
        }
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      if (errorMessage) {
        errorMessage.textContent =
          "Erro ao conectar. Tente novamente mais tarde.";
      }
    }
  });
});
