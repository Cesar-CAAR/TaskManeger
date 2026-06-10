(function () {
  "use strict";
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const account = TaskManager.getAccount();
  if (account && account.email) emailInput.value = account.email;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = document.getElementById("login-password").value;
    const message = document.getElementById("login-message");
    if (account && (account.email !== email || account.password !== password)) {
      message.textContent = "El correo o la contraseña no coinciden con la cuenta registrada.";
      message.className = "form-message error"; return;
    }
    TaskManager.saveSession(email); window.location.href = "../board/board.html";
  });
})();
