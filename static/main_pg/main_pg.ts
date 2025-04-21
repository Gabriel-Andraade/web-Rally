document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/users")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao recuperar os dados do usuário");
      }
      return response.json();
    })
    .then((users: any[]) => {
      if (users.length > 0) {
        const userData = users[users.length - 1];
        const nameElement = document.getElementById("name");
        const lastNameElement = document.getElementById("lastName");

        if (nameElement)
          nameElement.textContent = userData.name || "Nome não encontrado";
        if (lastNameElement)
          lastNameElement.textContent =
            userData.lastName || "Sobrenome não encontrado";

        console.log("Dados do Usuário:", {
          name: userData.name,
          lastName: userData.lastName,
          email: userData.email,
          number: userData.number,
        });
      } else {
        console.log("Nenhum dado encontrado.");
      }
    })
    .catch((error) => {
      console.error("Erro ao recuperar os dados do usuário:", error);
    });

  document.addEventListener("click", (event) => {
    const infoCard = document.getElementById("infoCard");
    if (
      infoCard?.classList.contains("show") &&
      !infoCard.contains(event.target as Node) &&
      !(event.target as HTMLElement).closest("button")
    ) {
      infoCard.classList.remove("show");
    }
  });
});

function showInfo(topic: string): void {
  const infoCard = document.getElementById("infoCard");
  const infoText = document.getElementById("infoText");
  const contentURL = `http://localhost:3000/content/${topic}.html?t=${new Date().getTime()}`;

  if (!infoCard || !infoText) {
    console.error("Elementos infoCard ou infoText não encontrados.");
    return;
  }

  fetch(contentURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro ao carregar ${topic}.html`);
      }
      return response.text();
    })
    .then((data) => {
      infoText.innerHTML = data;
      infoCard.classList.add("show");
    })
    .catch((error) => {
      console.error("Erro ao carregar o conteúdo:", error);
      infoText.innerHTML = `<p>Erro ao carregar as informações. Tente novamente mais tarde.</p>`;
      infoCard.classList.add("show");
    });
}
