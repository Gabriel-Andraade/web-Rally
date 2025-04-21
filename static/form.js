document.addEventListener("DOMContentLoaded", () => {
  const phoneInput = document.getElementById("number");
  const cpfInput = document.getElementById("cpf");
  if (phoneInput) {
    const iti = window.intlTelInput(phoneInput, {
      initialCountry: "auto",
      geoIpLookup: function (callback) {
        fetch("/geoip")
          .then((resp) => resp.json())
          .then((resp) => callback(resp.country))
          .catch(() => callback("br"));
      },
      nationalMode: false,
      formatOnDisplay: true,
      autoPlaceholder: "polite",
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });
    window.telInputInstance = iti;
    setTimeout(() => {
      iti.setNumber("+55");
    }, 100);
  }
  cpfInput.addEventListener("input", () => {
    let value = cpfInput.value.replace(/\D/g, "");
    value = value
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
    cpfInput.value = value.slice(0, 14);
  });
  const registerForm = document.getElementById("register");
  const icon = document.getElementById("icon");
  const inputFields = [
    document.getElementById("name"),
    document.getElementById("lastName"),
    document.getElementById("email"),
    phoneInput,
    cpfInput,
    document.getElementById("password"),
    document.getElementById("confirm"),
  ];
  inputFields.forEach((field) => {
    field.addEventListener("input", () => {
      const allFilled = inputFields.every((input) => input.value.trim() !== "");
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
    const formData = collectFormData();
    if (formData.password !== formData.confirm) {
      alert("As senhas não coincidem!");
      return;
    }
    try {
      const response = await submitRegistrationData(formData);
      handleResponse(response);
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      alert("Erro ao registrar usuário. Tente novamente mais tarde.");
    }
  });
});
function collectFormData() {
  return {
    name: document.getElementById("name").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    number: window.telInputInstance.getNumber(),
    cpf: document.getElementById("cpf").value,
    password: document.getElementById("password").value,
    confirm: document.getElementById("confirm").value,
  };
}
async function submitRegistrationData(formData) {
  const response = await fetch("http://localhost:3000/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
}
function handleResponse(response) {
  if (response.message === "Usuário registrado com sucesso!") {
    alert("Usuário registrado com sucesso!");
    window.location.href = "static/main_pg/main_pg.html";
  } else {
    alert(`Erro: ${response.message}`);
  }
}
