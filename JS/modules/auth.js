import { navigate } from "../router.js";
import { showToast } from "../components/toast.js";

const ACCOUNT_KEY = "taskmanager-account";

export function initAuth(route) {
  if (route === "login") {
    initLogin();
  }

  if (route === "register") {
    initRegister();
  }
}

function initLogin() {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const storedAccount = getAccount();

  if (!form || !emailInput) {
    return;
  }

  if (storedAccount?.email) {
    emailInput.value = storedAccount.email;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = document.getElementById("login-password").value;
    const message = document.getElementById("login-message");

    if (storedAccount && (storedAccount.email !== email || storedAccount.password !== password)) {
      message.textContent = "El correo o la contraseña no coinciden con la cuenta registrada.";
      message.className = "form-message error";
      return;
    }

    localStorage.setItem("taskmanager-session", email);
    showToast("Sesión iniciada correctamente.", "success");
    navigate("board");
  });
}

function initRegister() {
  const form = document.getElementById("register-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = document.getElementById("register-message");
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm").value;

    if (password !== confirmPassword) {
      message.textContent = "Las contraseñas no coinciden.";
      message.className = "form-message error";
      return;
    }

    const account = {
      name: document.getElementById("register-name").value.trim(),
      lastname: document.getElementById("register-lastname").value.trim(),
      email: document.getElementById("register-email").value.trim(),
      password,
      bio: ""
    };

    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
    message.textContent = "Cuenta registrada correctamente. Redirigiendo al inicio de sesión...";
    message.className = "form-message success";
    showToast("Registro completado.", "success");

    setTimeout(() => {
      navigate("login");
    }, 850);
  });
}

export function getAccount() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNT_KEY)) || null;
  } catch {
    return null;
  }
}

export function saveAccount(account) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}
