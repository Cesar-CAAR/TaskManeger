import { getAccount, saveAccount } from "./auth.js";
import { showToast } from "../components/toast.js";

export function initSettings() {
  const form = document.getElementById("profile-form");
  const account = getAccount() || {
    name: "Julianne",
    lastname: "Hargreaves",
    email: "julianne.h@taskmanager.com",
    password: "",
    bio: "Diseñadora de producto enfocada en herramientas minimalistas de productividad."
  };

  fillProfile(account);

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const updatedAccount = {
      ...account,
      name: document.getElementById("profile-name").value.trim(),
      lastname: document.getElementById("profile-lastname").value.trim(),
      email: document.getElementById("profile-email").value.trim(),
      bio: document.getElementById("profile-bio").value.trim()
    };

    saveAccount(updatedAccount);
    showToast("Información del perfil actualizada.", "success");
  });

  document.querySelectorAll("[data-theme]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(`Tema ${button.dataset.theme === "dark" ? "oscuro" : "claro"} seleccionado.`);
    });
  });

  document.getElementById("security-button")?.addEventListener("click", () => {
    showToast("La actualización de contraseña se integrará posteriormente.");
  });
}

function fillProfile(account) {
  document.getElementById("profile-name").value = account.name || "";
  document.getElementById("profile-lastname").value = account.lastname || "";
  document.getElementById("profile-email").value = account.email || "";
  document.getElementById("profile-bio").value = account.bio || "";
}
