(function () {
  "use strict";

  TaskManager.ready.then(function () {
    TaskManager.applyI18n();

    const form = document.getElementById("register-form");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const password = document.getElementById("register-password").value;
      const confirm = document.getElementById("register-confirm").value;
      const message = document.getElementById("register-message");

      if (password !== confirm) {
        message.textContent = TaskManager.t("register.passwordMismatch");
        message.className = "form-message error";
        return;
      }

      const user = TaskManager.registerUser({
        name: document.getElementById("register-name").value.trim(),
        lastname: document.getElementById("register-lastname").value.trim(),
        email: document.getElementById("register-email").value.trim(),
        password,
        bio: ""
      });

      if (!user) {
        message.textContent = TaskManager.t("register.emailTaken");
        message.className = "form-message error";
        return;
      }

      message.textContent = TaskManager.t("register.success");
      message.className = "form-message success";

      setTimeout(function () {
        window.location.href = "login.html";
      }, 850);
    });
  });
})();
