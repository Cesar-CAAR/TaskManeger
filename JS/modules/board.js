import { showToast } from "../components/toast.js";

export function initBoard() {
  const panel = document.getElementById("task-panel");
  const closeButton = document.getElementById("close-task-panel");
  const detailForm = document.getElementById("task-detail-form");
  const draftButton = document.getElementById("draft-task-button");
  const createTaskButton = document.getElementById("create-task-button");
  const searchInput = document.getElementById("task-search");

  document.querySelectorAll(".task-card").forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.dataset.taskTitle || "Detalle de tarea";
      document.getElementById("task-panel-title").textContent = title;
      panel.classList.remove("hidden");
    });
  });

  closeButton?.addEventListener("click", () => {
    panel.classList.add("hidden");
  });

  detailForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Cambios de la tarea guardados.", "success");
    panel.classList.add("hidden");
  });

  draftButton?.addEventListener("click", () => {
    showToast("Borrador guardado.", "success");
  });

  createTaskButton?.addEventListener("click", () => {
    showToast("El formulario para crear tareas se integrará en la siguiente versión.");
  });

  searchInput?.addEventListener("input", () => {
    const term = searchInput.value.trim().toLowerCase();

    document.querySelectorAll(".task-card").forEach((card) => {
      card.classList.toggle("hidden", !card.textContent.toLowerCase().includes(term));
    });
  });
}
