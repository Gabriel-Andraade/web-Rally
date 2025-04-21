document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register");
  const icon = document.getElementById("icon");
  const nameInput = document.getElementById("name");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("number");
  const cpfInput = document.getElementById("cpf");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm");

  let telInputInstance;

  if (phoneInput) {
    telInputInstance = window.intlTelInput(phoneInput, {
      initialCountry: "auto",
      geoIpLookup(callback) {
        fetch("/geoip")
          .then((resp) => resp.json())
          .then((data) => callback(data.country))
          .catch(() => callback("br"));
      },
      nationalMode: false,
      autoHideDialCode: false,
      formatOnDisplay: true,
      autoPlaceholder: "polite",
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });
    window.telInputInstance = telInputInstance;
    setTimeout(() => telInputInstance.setNumber("+55"), 500);
  }

  if (cpfInput) {
    cpfInput.addEventListener("input", () => {
      let value = cpfInput.value.replace(/\D/g, "");
      value = value
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
      cpfInput.value = value.slice(0, 14);
    });
  }

  const inputFields = [
    nameInput,
    lastNameInput,
    emailInput,
    phoneInput,
    cpfInput,
    passwordInput,
    confirmInput,
  ];

  inputFields.forEach((field) => {
    if (field) {
      field.addEventListener("input", () => {
        const allFilled = inputFields.every(
          (input) => input.value.trim() !== ""
        );
        if (icon) {
          icon.classList.toggle("fa-door-open", allFilled);
          icon.classList.toggle("fa-door-closed", !allFilled);
        }
      });
    }
  });

  const sendCodeBtn = document.getElementById("sendCodeBtn");
  const verificationCodeInput = document.getElementById("verificationCode");

  if (sendCodeBtn) {
    sendCodeBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      const email = emailInput.value;

      if (!email) {
        alert("Por favor, insira um e-mail válido.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/users/send-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        alert("Código de verificação enviado com sucesso!");
      } catch (error) {
        console.error("Erro ao enviar código de verificação:", error);
        alert("Erro ao enviar código de verificação. Tente novamente.");
      }
    });
  }

  if (verificationCodeInput) {
    verificationCodeInput.addEventListener("blur", async () => {
      const email = emailInput.value;
      const code = verificationCodeInput.value;

      if (!email || !code) {
        alert("Por favor, insira o e-mail e o código de verificação.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/users/verify-code",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        alert("E-mail verificado com sucesso!");
      } catch (error) {
        console.error("Erro ao verificar código:", error);
        alert("Erro ao verificar código. Tente novamente.");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = {
        name: nameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value,
        number: telInputInstance
          ? telInputInstance.getNumber()
          : phoneInput.value,
        cpf: cpfInput.value,
        password: passwordInput.value,
        confirm: confirmInput.value,
      };

      if (formData.password !== formData.confirm) {
        alert("As senhas não coincidem!");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        alert("Erro ao registrar usuário. Tente novamente mais tarde.");
      }
    });
  }
});
