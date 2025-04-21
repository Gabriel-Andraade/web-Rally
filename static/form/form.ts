export {};

declare global {
  interface Window {
    intlTelInput: (input: HTMLElement, options: Record<string, any>) => void;
    intlTelInputGlobals: any;
    telInputInstance: any;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const phoneInput = document.getElementById("number") as HTMLInputElement;
  const cpfInput = document.getElementById("cpf") as HTMLInputElement;

  if (phoneInput) {
    const iti = (window as any).intlTelInput(phoneInput, {
      initialCountry: "auto",
      geoIpLookup: function (callback: (countryCode: string) => void) {
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

    (window as any).telInputInstance = iti;

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

  const registerForm = document.getElementById("register") as HTMLFormElement;
  const icon = document.getElementById("icon") as HTMLElement;

  const inputFields = [
    document.getElementById("name") as HTMLInputElement,
    document.getElementById("lastName") as HTMLInputElement,
    document.getElementById("email") as HTMLInputElement,
    phoneInput,
    cpfInput,
    document.getElementById("password") as HTMLInputElement,
    document.getElementById("confirm") as HTMLInputElement,
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

function collectFormData(): Record<string, string> {
  return {
    name: (document.getElementById("name") as HTMLInputElement).value,
    lastName: (document.getElementById("lastName") as HTMLInputElement).value,
    email: (document.getElementById("email") as HTMLInputElement).value,
    number: (window as any).telInputInstance.getNumber(),
    cpf: (document.getElementById("cpf") as HTMLInputElement).value,
    password: (document.getElementById("password") as HTMLInputElement).value,
    confirm: (document.getElementById("confirm") as HTMLInputElement).value,
  };
}

async function submitRegistrationData(
  formData: Record<string, string>
): Promise<any> {
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

function handleResponse(response: any): void {
  if (response.message === "Usuário registrado com sucesso!") {
    alert("Usuário registrado com sucesso!");
    window.location.href = "static/main_pg/main_pg.html";
  } else {
    alert(`Erro: ${response.message}`);
  }
}
