(function () {
  "use strict";

  TaskManager.ready.then(function () {
    TaskManager.renderSidebar("settings");

    const fallback = {
      name: "Julianne",
      lastname: "Hargreaves",
      email: "julianne.h@taskmanager.com",
      password: "",
      bio: "Diseñadora de producto enfocada en herramientas minimalistas de productividad."
    };

    const account = TaskManager.getAccount() || fallback;

    document.getElementById("profile-name").value = account.name || "";
    document.getElementById("profile-lastname").value = account.lastname || "";
    document.getElementById("profile-email").value = account.email || "";
    document.getElementById("profile-bio").value = account.bio || "";

    document.getElementById("profile-form").addEventListener("submit", function (event) {
      event.preventDefault();

      TaskManager.saveAccount({
        ...account,
        name: document.getElementById("profile-name").value.trim(),
        lastname: document.getElementById("profile-lastname").value.trim(),
        email: document.getElementById("profile-email").value.trim(),
        bio: document.getElementById("profile-bio").value.trim()
      });

      TaskManager.showToast("Perfil actualizado.", "success");
    });

    document.querySelectorAll("[data-theme]").forEach(function (button) {
      button.addEventListener("click", function () {
        const theme = button.dataset.theme;
        TaskManager.saveTheme(theme);
        TaskManager.showToast("Tema aplicado.", "success");
      });
    });

    document.getElementById("security-button").addEventListener("click", function () {
      TaskManager.showToast("Actualización de seguridad pendiente.");
    });
  });
})();
