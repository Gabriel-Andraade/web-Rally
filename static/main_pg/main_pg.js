document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/users")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Erro ao recuperar os dados do usuário");
      }
      return response.json();
    })
    .then(function (users) {
      if (users.length > 0) {
        var userData = users[users.length - 1];
        var nameElement = document.getElementById("name");
        var lastNameElement = document.getElementById("lastName");
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
    .catch(function (error) {
      console.error("Erro ao recuperar os dados do usuário:", error);
    });

  document.addEventListener("click", function (event) {
    var infoCard = document.getElementById("infoCard");
    if (
      (infoCard === null || infoCard === void 0
        ? void 0
        : infoCard.classList.contains("show")) &&
      !infoCard.contains(event.target) &&
      !event.target.closest("button")
    ) {
      infoCard.classList.remove("show");
    }
  });
});
function showInfo(topic) {
  var infoCard = document.getElementById("infoCard");
  var infoText = document.getElementById("infoText");
  var contentURL = "http://localhost:3000/content/"
    .concat(topic, ".html?t=")
    .concat(new Date().getTime());
  if (!infoCard || !infoText) {
    console.error("Elementos infoCard ou infoText não encontrados.");
    return;
  }
  fetch(contentURL)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Erro ao carregar ".concat(topic, ".html"));
      }
      return response.text();
    })
    .then(function (data) {
      infoText.innerHTML = data;
      infoCard.classList.add("show");
    })
    .catch(function (error) {
      console.error("Erro ao carregar o conteúdo:", error);
      infoText.innerHTML =
        "<p>Erro ao carregar as informa\u00E7\u00F5es. Tente novamente mais tarde.</p>";
      infoCard.classList.add("show");
    });
}
