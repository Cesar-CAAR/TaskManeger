(function () {
  "use strict";
  TaskManager.renderSidebar("teams");
  const DEFAULTS = [
    { id: TaskManager.createId(), name: "Ana Martínez", email: "ana@taskmanager.com", role: "Administrador", status: "Activo" },
    { id: TaskManager.createId(), name: "Luis Hernández", email: "luis@taskmanager.com", role: "Desarrollador", status: "Activo" },
    { id: TaskManager.createId(), name: "María López", email: "maria@taskmanager.com", role: "Diseñador", status: "Activo" }
  ];
  let members = TaskManager.readJson(TaskManager.MEMBERS_KEY, null);
  if (!Array.isArray(members)) { members = DEFAULTS; save(); }
  const tbody = document.getElementById("members-table-body");
  const empty = document.getElementById("members-empty-state");
  const search = document.getElementById("member-search");
  function save() { TaskManager.writeJson(TaskManager.MEMBERS_KEY, members); }
  function options(selected) { return ["Administrador", "Desarrollador", "Diseñador", "Documentación"].map(function (role) { return `<option ${role === selected ? "selected" : ""}>${role}</option>`; }).join(""); }
  function summary() { document.getElementById("active-members-count").textContent = members.length; document.getElementById("admin-count").textContent = members.filter(function (m) { return m.role === "Administrador"; }).length; document.getElementById("developer-count").textContent = members.filter(function (m) { return m.role === "Desarrollador"; }).length; }
  function render() {
    const term = search.value.trim().toLowerCase(); const visible = members.filter(function (m) { return (m.name + " " + m.email).toLowerCase().includes(term); });
    tbody.innerHTML = visible.map(function (m) { return `<tr><td><div class="member-name">${TaskManager.escapeHtml(m.name)}</div><div class="member-email">${TaskManager.escapeHtml(m.email)}</div></td><td><select data-role-id="${m.id}">${options(m.role)}</select></td><td><span class="status-badge">${m.status}</span></td><td><button class="danger-button" type="button" data-delete-id="${m.id}">Eliminar</button></td></tr>`; }).join("");
    empty.classList.toggle("hidden", visible.length > 0);
    tbody.querySelectorAll("[data-role-id]").forEach(function (select) { select.addEventListener("change", function () { members = members.map(function (m) { return m.id === select.dataset.roleId ? { ...m, role: select.value } : m; }); save(); summary(); TaskManager.showToast("Rol actualizado.", "success"); }); });
    tbody.querySelectorAll("[data-delete-id]").forEach(function (button) { button.addEventListener("click", function () { members = members.filter(function (m) { return m.id !== button.dataset.deleteId; }); save(); render(); TaskManager.showToast("Integrante eliminado.", "success"); }); });
    summary();
  }
  document.getElementById("member-form").addEventListener("submit", function (event) { event.preventDefault(); const email = document.getElementById("member-email").value.trim(); if (members.some(function (m) { return m.email.toLowerCase() === email.toLowerCase(); })) { TaskManager.showToast("Ese correo ya pertenece a un integrante.", "error"); return; } members.push({ id: TaskManager.createId(), name: document.getElementById("member-name").value.trim(), email, role: document.getElementById("member-role").value, status: "Activo" }); save(); event.target.reset(); render(); TaskManager.showToast("Integrante agregado.", "success"); });
  search.addEventListener("input", render); render();
})();
