(function () {
  "use strict";

  TaskManager.ready.then(function () {
    if (!TaskManager.requireSession()) return;

    TaskManager.renderSidebar("settings");

    const user = TaskManager.getCurrentUser();
    if (!user) return;

    document.getElementById("profile-name").value = user.name || "";
    document.getElementById("profile-lastname").value = user.lastname || "";
    document.getElementById("profile-email").value = user.email || "";
    document.getElementById("profile-bio").value = user.bio || "";

    document.getElementById("profile-form").addEventListener("submit", function (event) {
      event.preventDefault();

      TaskManager.saveAccount({
        name: document.getElementById("profile-name").value.trim(),
        lastname: document.getElementById("profile-lastname").value.trim(),
        email: document.getElementById("profile-email").value.trim(),
        bio: document.getElementById("profile-bio").value.trim()
      });

      TaskManager.renderSidebar("settings");
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
