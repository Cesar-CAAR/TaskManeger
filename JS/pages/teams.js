(function () {
  "use strict";

  TaskManager.ready.then(function () {
    if (!TaskManager.requireSession()) return;

    TaskManager.renderSidebar("teams");

    let members = TaskManager.getMembers();
    const tbody = document.getElementById("members-table-body");
    const empty = document.getElementById("members-empty-state");
    const search = document.getElementById("member-search");

    function persist() {
      TaskManager.saveMembers(members);
    }

    function options(selected) {
      return ["Administrador", "Desarrollador", "Diseñador", "Documentación"].map(function (role) {
        return `<option ${role === selected ? "selected" : ""}>${role}</option>`;
      }).join("");
    }

    function summary() {
      document.getElementById("active-members-count").textContent = members.length;
      document.getElementById("admin-count").textContent = members.filter(function (m) {
        return m.role === "Administrador";
      }).length;
      document.getElementById("developer-count").textContent = members.filter(function (m) {
        return m.role === "Desarrollador";
      }).length;
    }

    function render() {
      const term = search.value.trim().toLowerCase();
      const visible = members.filter(function (m) {
        return (m.name + " " + m.email).toLowerCase().includes(term);
      });

      tbody.innerHTML = visible.map(function (m) {
        return `<tr>
          <td>
            <div class="member-name">${TaskManager.escapeHtml(m.name)}</div>
            <div class="member-email">${TaskManager.escapeHtml(m.email)}</div>
          </td>
          <td><select data-role-id="${m.id}">${options(m.role)}</select></td>
          <td><span class="status-badge">${m.status}</span></td>
          <td><button class="danger-button" type="button" data-delete-id="${m.id}">Eliminar</button></td>
        </tr>`;
      }).join("");

      empty.classList.toggle("hidden", visible.length > 0);

      tbody.querySelectorAll("[data-role-id]").forEach(function (select) {
        select.addEventListener("change", function () {
          members = members.map(function (m) {
            return m.id === select.dataset.roleId ? { ...m, role: select.value } : m;
          });
          persist();
          summary();
          TaskManager.showToast("Rol actualizado.", "success");
        });
      });

      tbody.querySelectorAll("[data-delete-id]").forEach(function (button) {
        button.addEventListener("click", function () {
          members = members.filter(function (m) {
            return m.id !== button.dataset.deleteId;
          });
          persist();
          render();
          TaskManager.showToast("Integrante eliminado.", "success");
        });
      });

      summary();
    }

    document.getElementById("member-form").addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("member-email").value.trim();

      if (members.some(function (m) {
        return m.email.toLowerCase() === email.toLowerCase();
      })) {
        TaskManager.showToast("Ese correo ya pertenece a un integrante.", "error");
        return;
      }

      members.push({
        id: TaskManager.createId(),
        name: document.getElementById("member-name").value.trim(),
        email,
        role: document.getElementById("member-role").value,
        status: "Activo"
      });

      persist();
      event.target.reset();
      render();
      TaskManager.showToast("Integrante agregado.", "success");
    });

    search.addEventListener("input", render);
    render();
  });
})();
