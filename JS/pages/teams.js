(function () {
  "use strict";

  const ROLE_KEYS = ["administrator", "developer", "designer", "documentation"];

  TaskManager.ready.then(function () {
    if (!TaskManager.requireSession()) return;

    TaskManager.applyI18n();
    TaskManager.renderSidebar("teams");

    let members = TaskManager.getMembers();
    const tbody = document.getElementById("members-table-body");
    const empty = document.getElementById("members-empty-state");
    const search = document.getElementById("member-search");

    function persist() {
      TaskManager.saveMembers(members);
    }

    function roleOptions(selected) {
      return ROLE_KEYS.map(function (role) {
        const label = TaskManager.t("role." + role);
        return `<option value="${role}" ${role === selected ? "selected" : ""}>${label}</option>`;
      }).join("");
    }

    function summary() {
      document.getElementById("active-members-count").textContent = members.length;
      document.getElementById("admin-count").textContent = members.filter(function (m) {
        return I18n.normalizeRole(m.role) === "administrator";
      }).length;
      document.getElementById("developer-count").textContent = members.filter(function (m) {
        return I18n.normalizeRole(m.role) === "developer";
      }).length;
    }

    function render() {
      const term = search.value.trim().toLowerCase();
      const visible = members.filter(function (m) {
        return (m.name + " " + m.email).toLowerCase().includes(term);
      });

      tbody.innerHTML = visible.map(function (m) {
        const role = I18n.normalizeRole(m.role);
        const statusKey = m.status === "active" || m.status === "Activo" ? "status.active" : m.status;
        const statusLabel = TaskManager.t(statusKey) || m.status;

        return `<tr>
          <td>
            <div class="member-name">${TaskManager.escapeHtml(m.name)}</div>
            <div class="member-email">${TaskManager.escapeHtml(m.email)}</div>
          </td>
          <td><select data-role-id="${m.id}">${roleOptions(role)}</select></td>
          <td><span class="status-badge">${TaskManager.escapeHtml(statusLabel)}</span></td>
          <td><button class="danger-button" type="button" data-delete-id="${m.id}">${TaskManager.t("teams.delete")}</button></td>
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
          TaskManager.showToast(TaskManager.t("teams.roleUpdated"), "success");
        });
      });

      tbody.querySelectorAll("[data-delete-id]").forEach(function (button) {
        button.addEventListener("click", function () {
          members = members.filter(function (m) {
            return m.id !== button.dataset.deleteId;
          });
          persist();
          render();
          TaskManager.showToast(TaskManager.t("teams.memberRemoved"), "success");
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
        TaskManager.showToast(TaskManager.t("teams.emailExists"), "error");
        return;
      }

      members.push({
        id: TaskManager.createId(),
        name: document.getElementById("member-name").value.trim(),
        email,
        role: document.getElementById("member-role").value,
        status: "active"
      });

      persist();
      event.target.reset();
      render();
      TaskManager.showToast(TaskManager.t("teams.memberAdded"), "success");
    });

    search.addEventListener("input", render);
    render();
  });
})();
