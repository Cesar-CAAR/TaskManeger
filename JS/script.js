const taskPanel = document.getElementById("task-panel");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");

function showView(id) {
  document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if (taskPanel) taskPanel.classList.add("hidden");
}

loginForm.addEventListener("submit", event => {
  event.preventDefault();
  showView("dashboard-view");
});

document.getElementById("open-register").addEventListener("click", () => {
  registerMessage.textContent = "";
  registerMessage.className = "form-message";
  showView("register-view");
});

document.getElementById("back-to-login").addEventListener("click", () => {
  showView("login-view");
});

registerForm.addEventListener("submit", event => {
  event.preventDefault();

  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("register-confirm-password").value;

  if (password !== confirmPassword) {
    registerMessage.textContent = "Las contraseñas no coinciden.";
    registerMessage.className = "form-message error";
    return;
  }

  registerMessage.textContent = "Cuenta registrada correctamente. Redirigiendo al inicio de sesión...";
  registerMessage.className = "form-message success";
  document.getElementById("email").value = email;

  setTimeout(() => {
    registerForm.reset();
    registerMessage.textContent = "";
    registerMessage.className = "form-message";
    showView("login-view");
  }, 900);
});
document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => showView(button.dataset.view)));
document.querySelectorAll(".logout").forEach(button => button.addEventListener("click", () => showView("login-view")));
document.getElementById("open-panel").addEventListener("click", () => taskPanel.classList.remove("hidden"));
document.getElementById("close-panel").addEventListener("click", () => taskPanel.classList.add("hidden"));


const memberFormCard = document.getElementById("member-form-card");
const memberForm = document.getElementById("member-form");
const memberTableBody = document.getElementById("member-table-body");
const memberCount = document.getElementById("member-count");
const memberSearch = document.getElementById("member-search");

function updateMemberCount() {
  memberCount.textContent = memberTableBody.querySelectorAll("tr").length;
}

function initials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map(word => word[0].toUpperCase()).join("");
}

function bindRemoveButtons() {
  document.querySelectorAll(".remove-member").forEach(button => {
    button.onclick = () => {
      button.closest("tr").remove();
      updateMemberCount();
    };
  });
}

document.getElementById("show-member-form").addEventListener("click", () => memberFormCard.classList.remove("hidden"));
document.getElementById("hide-member-form").addEventListener("click", () => memberFormCard.classList.add("hidden"));

memberForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("member-name").value.trim();
  const email = document.getElementById("member-email").value.trim();
  const role = document.getElementById("member-role").value;
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><div class="member-name"><span class="mini-avatar">${initials(name)}</span><strong>${name}</strong></div></td>
    <td>${email}</td>
    <td><select class="role-select"><option>Administrador</option><option>Desarrollador</option><option>Diseñador</option><option>Documentación</option></select></td>
    <td><span class="status active-status">Activo</span></td>
    <td><button class="danger-button remove-member" type="button">Eliminar</button></td>`;
  row.querySelector(".role-select").value = role;
  memberTableBody.appendChild(row);
  memberForm.reset();
  memberFormCard.classList.add("hidden");
  bindRemoveButtons();
  updateMemberCount();
});

memberSearch.addEventListener("input", () => {
  const term = memberSearch.value.toLowerCase();
  memberTableBody.querySelectorAll("tr").forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(term) ? "" : "none";
  });
});

bindRemoveButtons();
updateMemberCount();
