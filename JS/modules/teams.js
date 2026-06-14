import { showToast } from "../components/toast.js";

const MEMBERS_KEY = "taskmanager-team-members";

const DEFAULT_MEMBERS = [
  {
    id: crypto.randomUUID(),
    name: "Ana Martínez",
    email: "ana@taskmanager.com",
    role: "Administrador",
    status: "Activo"
  },
  {
    id: crypto.randomUUID(),
    name: "Luis Hernández",
    email: "luis@taskmanager.com",
    role: "Desarrollador",
    status: "Activo"
  },
  {
    id: crypto.randomUUID(),
    name: "María López",
    email: "maria@taskmanager.com",
    role: "Diseñador",
    status: "Activo"
  }
];

let members = [];

export function initTeams() {
  members = loadMembers();

  const form = document.getElementById("member-form");
  const search = document.getElementById("member-search");

  renderMembers();

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("member-email").value.trim();

    if (members.some((member) => member.email.toLowerCase() === email.toLowerCase())) {
      showToast("Ese correo ya pertenece a un integrante.", "error");
      return;
    }

    members.push({
      id: crypto.randomUUID(),
      name: document.getElementById("member-name").value.trim(),
      email,
      role: document.getElementById("member-role").value,
      status: "Activo"
    });

    saveMembers();
    form.reset();
    renderMembers(search?.value || "");
    showToast("Integrante agregado correctamente.", "success");
  });

  search?.addEventListener("input", () => {
    renderMembers(search.value);
  });
}

function renderMembers(searchTerm = "") {
  const tbody = document.getElementById("members-table-body");
  const emptyState = document.getElementById("members-empty-state");
  const normalizedTerm = searchTerm.trim().toLowerCase();

  const visibleMembers = members.filter((member) => {
    const content = `${member.name} ${member.email}`.toLowerCase();
    return content.includes(normalizedTerm);
  });

  tbody.innerHTML = visibleMembers.map((member) => `
    <tr>
      <td>
        <div class="member-name">${escapeHtml(member.name)}</div>
        <div class="member-email">${escapeHtml(member.email)}</div>
      </td>
      <td>
        <select data-member-role="${member.id}" aria-label="Rol de ${escapeHtml(member.name)}">
          ${renderRoleOptions(member.role)}
        </select>
      </td>
      <td><span class="status-badge">${member.status}</span></td>
      <td>
        <button class="danger-button" type="button" data-delete-member="${member.id}">
          Eliminar
        </button>
      </td>
    </tr>
  `).join("");

  emptyState.classList.toggle("hidden", visibleMembers.length > 0);

  tbody.querySelectorAll("[data-member-role]").forEach((select) => {
    select.addEventListener("change", () => {
      updateRole(select.dataset.memberRole, select.value);
    });
  });

  tbody.querySelectorAll("[data-delete-member]").forEach((button) => {
    button.addEventListener("click", () => {
      deleteMember(button.dataset.deleteMember);
    });
  });

  updateSummary();
}

function updateRole(memberId, newRole) {
  members = members.map((member) => (
    member.id === memberId ? { ...member, role: newRole } : member
  ));

  saveMembers();
  updateSummary();
  showToast("Rol actualizado.", "success");
}

function deleteMember(memberId) {
  members = members.filter((member) => member.id !== memberId);
  saveMembers();
  renderMembers(document.getElementById("member-search")?.value || "");
  showToast("Integrante eliminado.", "success");
}

function updateSummary() {
  document.getElementById("active-members-count").textContent = members.length;
  document.getElementById("admin-count").textContent = members.filter(
    (member) => member.role === "Administrador"
  ).length;
  document.getElementById("developer-count").textContent = members.filter(
    (member) => member.role === "Desarrollador"
  ).length;
}

function renderRoleOptions(selectedRole) {
  return ["Administrador", "Desarrollador", "Diseñador", "Documentación"]
    .map((role) => `<option ${role === selectedRole ? "selected" : ""}>${role}</option>`)
    .join("");
}

function loadMembers() {
  try {
    const storedMembers = JSON.parse(localStorage.getItem(MEMBERS_KEY));

    if (Array.isArray(storedMembers)) {
      return storedMembers;
    }
  } catch {
    // Utiliza los datos de ejemplo cuando localStorage contiene datos inválidos.
  }

  localStorage.setItem(MEMBERS_KEY, JSON.stringify(DEFAULT_MEMBERS));
  return [...DEFAULT_MEMBERS];
}

function saveMembers() {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
