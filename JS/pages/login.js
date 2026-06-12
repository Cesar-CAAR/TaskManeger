(function () {
  "use strict";

  TaskManager.ready.then(function () {
    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("login-email");
    const message = document.getElementById("login-message");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = emailInput.value.trim();
      const password = document.getElementById("login-password").value;
      const user = TaskManager.findUserByCredentials(email, password);

      if (!user) {
        message.textContent = "El correo o la contraseña no coinciden con ninguna cuenta registrada.";
        message.className = "form-message error";
        return;
      }

      TaskManager.saveSession(user.id);
      window.location.href = "../board/board.html";
    });
  });
})();
