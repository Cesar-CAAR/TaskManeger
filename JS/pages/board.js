(function () {
  "use strict";
  TaskManager.renderSidebar("board");
  const panel = document.getElementById("task-panel");
  const title = document.getElementById("task-panel-title");
  const search = document.getElementById("task-search");
  document.querySelectorAll(".task-card").forEach(function (card) {
    card.addEventListener("click", function () { title.textContent = card.dataset.taskTitle || "Detalle de tarea"; panel.classList.remove("hidden"); });
  });
  document.getElementById("close-task-panel").addEventListener("click", function () { panel.classList.add("hidden"); });
  document.getElementById("task-detail-form").addEventListener("submit", function (event) { event.preventDefault(); TaskManager.showToast("Cambios guardados.", "success"); panel.classList.add("hidden"); });
  document.getElementById("draft-task-button").addEventListener("click", function () { TaskManager.showToast("Borrador guardado.", "success"); });
  document.getElementById("create-task-button").addEventListener("click", function () { TaskManager.showToast("Formulario de creación pendiente de integrar."); });
  search.addEventListener("input", function () { const term = search.value.trim().toLowerCase(); document.querySelectorAll(".task-card").forEach(function (card) { card.classList.toggle("hidden", !card.textContent.toLowerCase().includes(term)); }); });
})();
