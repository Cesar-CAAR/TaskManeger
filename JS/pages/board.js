(function () {
  "use strict";

  const STATUS_LABELS = {
    todo: "Por hacer",
    in_progress: "En progreso",
    done: "Finalizada"
  };

  const COLUMNS = [
    { status: "todo", containerId: "column-todo", countId: "count-todo" },
    { status: "in_progress", containerId: "column-in-progress", countId: "count-in-progress" },
    { status: "done", containerId: "column-done", countId: "count-done" }
  ];

  let tasks = [];
  let selectedTaskId = null;
  let searchTerm = "";

  TaskManager.ready.then(function () {
    TaskManager.renderSidebar("board");
    initBoard();
  });

  function initBoard() {
    tasks = TaskManager.getTasks();

    const panel = document.getElementById("task-panel");
    const search = document.getElementById("task-search");
    const createDialog = document.getElementById("create-task-dialog");
    const createForm = document.getElementById("create-task-form");

    renderBoard();

    search.addEventListener("input", function () {
      searchTerm = search.value.trim().toLowerCase();
      renderBoard();
    });

    document.getElementById("create-task-button").addEventListener("click", function () {
      createForm.reset();
      createDialog.showModal();
    });

    document.getElementById("cancel-create-task").addEventListener("click", function () {
      createDialog.close();
    });

    createForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const title = document.getElementById("create-task-title").value.trim();
      const status = document.getElementById("create-task-status").value;

      if (!title) return;

      const task = {
        id: TaskManager.createId(),
        title,
        description: "",
        status,
        category: "General",
        priority: "Media",
        dueDate: "",
        assignee: "",
        createdAt: new Date().toISOString()
      };

      TaskManager.saveTask(task);
      tasks = TaskManager.getTasks();
      createDialog.close();
      renderBoard();
      TaskManager.showToast("Tarea creada.", "success");
    });

    document.getElementById("close-task-panel").addEventListener("click", function () {
      panel.classList.add("hidden");
      selectedTaskId = null;
    });

    document.getElementById("task-detail-form").addEventListener("submit", function (event) {
      event.preventDefault();
      saveCurrentTask();
      panel.classList.add("hidden");
      selectedTaskId = null;
    });

    document.getElementById("draft-task-button").addEventListener("click", function () {
      saveCurrentTask();
      TaskManager.showToast("Borrador guardado.", "success");
    });
  }

  function renderBoard() {
    COLUMNS.forEach(function (column) {
      const container = document.getElementById(column.containerId);
      const countEl = document.getElementById(column.countId);
      const columnTasks = tasks.filter(function (task) {
        if (task.status !== column.status) return false;
        if (!searchTerm) return true;
        const content = (task.title + " " + task.description + " " + task.category).toLowerCase();
        return content.includes(searchTerm);
      });

      countEl.textContent = columnTasks.length;

      container.innerHTML = columnTasks.map(function (task) {
        return renderTaskCard(task);
      }).join("");

      container.querySelectorAll(".task-card").forEach(function (card) {
        card.addEventListener("click", function () {
          openTaskPanel(card.dataset.taskId);
        });
      });
    });
  }

  function renderTaskCard(task) {
    const cardClass = ["task-card"];
    if (task.status === "in_progress") cardClass.push("highlight");
    if (task.status === "done") cardClass.push("done");

    let meta = "";
    if (task.dueDate) {
      meta = formatDate(task.dueDate);
    } else if (task.status === "done") {
      meta = "Completada";
    }

    return `<button class="${cardClass.join(" ")}" type="button" data-task-id="${task.id}">
      <span class="status-badge">${TaskManager.escapeHtml(task.category || "General")}</span>
      <h3>${TaskManager.escapeHtml(task.title)}</h3>
      <p>${TaskManager.escapeHtml(task.description || "Sin descripción")}</p>
      ${meta ? `<small>${TaskManager.escapeHtml(meta)}</small>` : ""}
    </button>`;
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
  }

  function openTaskPanel(taskId) {
    const task = TaskManager.getTaskById(taskId);
    if (!task) return;

    selectedTaskId = taskId;
    const panel = document.getElementById("task-panel");

    document.getElementById("task-panel-meta").textContent =
      STATUS_LABELS[task.status] || "Detalle";
    document.getElementById("task-panel-title").textContent = task.title;
    document.getElementById("task-id").value = task.id;
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-status").value = task.status;
    document.getElementById("task-category").value = task.category || "";
    document.getElementById("task-priority").value = task.priority || "Media";
    document.getElementById("task-date").value = task.dueDate || "";
    document.getElementById("task-assignee").value = task.assignee || "";
    document.getElementById("task-description").value = task.description || "";

    panel.classList.remove("hidden");
  }

  function saveCurrentTask() {
    if (!selectedTaskId) return;

    const existing = TaskManager.getTaskById(selectedTaskId);
    if (!existing) return;

    const updated = {
      ...existing,
      title: document.getElementById("task-title").value.trim(),
      status: document.getElementById("task-status").value,
      category: document.getElementById("task-category").value.trim(),
      priority: document.getElementById("task-priority").value,
      dueDate: document.getElementById("task-date").value,
      assignee: document.getElementById("task-assignee").value.trim(),
      description: document.getElementById("task-description").value.trim()
    };

    TaskManager.saveTask(updated);
    tasks = TaskManager.getTasks();
    renderBoard();
    TaskManager.showToast("Cambios guardados.", "success");
  }
})();
