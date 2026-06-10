(function () {
  "use strict";
  const ACCOUNT_KEY = "taskmanager-account";
  const SESSION_KEY = "taskmanager-session";
  const MEMBERS_KEY = "taskmanager-team-members";
  const THEME_KEY = "taskmanager-theme";

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return "member-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }
  function readJson(key, fallback) {
    try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
    catch { return fallback; }
  }
  function writeJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function escapeHtml(value) { const div = document.createElement("div"); div.textContent = value; return div.innerHTML; }
  function showToast(message, type) {
    const container = document.getElementById("toast-container"); if (!container) return;
    const toast = document.createElement("div"); toast.className = ("toast " + (type || "")).trim(); toast.textContent = message;
    container.appendChild(toast); setTimeout(function () { toast.remove(); }, 2800);
  }
  function applyStoredTheme() {
    document.body.classList.toggle("dark-theme", localStorage.getItem(THEME_KEY) === "dark");
  }
  function renderSidebar(activePage) {
    const container = document.getElementById("sidebar-container"); if (!container) return;
    const links = [
      { id: "board", label: "▦ Tablero", href: "../board/board.html" },
      { id: "teams", label: "♟ Equipos", href: "../teams/teams.html" },
      { id: "settings", label: "⚙ Configuración", href: "../settings/settings.html" }
    ];
    container.innerHTML = `
      <aside class="sidebar">
        <div>
          <div class="brand"><h2>TaskManager</h2><p>Productivity</p></div>
          <nav class="nav-list" aria-label="Navegación principal">
            ${links.map(function (link) { return `<a class="nav-link ${link.id === activePage ? "active" : ""}" href="${link.href}">${link.label}</a>`; }).join("")}
          </nav>
        </div>
        <div class="sidebar-footer">
          <button class="nav-button" type="button" id="help-button">? Ayuda</button>
          <button class="nav-button" type="button" id="logout-button">↪ Cerrar sesión</button>
        </div>
      </aside>`;
    document.getElementById("help-button").addEventListener("click", function () { showToast("Centro de ayuda en construcción."); });
    document.getElementById("logout-button").addEventListener("click", function () { localStorage.removeItem(SESSION_KEY); window.location.href = "../auth/login.html"; });
  }
  window.TaskManager = {
    ACCOUNT_KEY, SESSION_KEY, MEMBERS_KEY, THEME_KEY, createId, readJson, writeJson, escapeHtml, showToast, applyStoredTheme, renderSidebar,
    getAccount: function () { return readJson(ACCOUNT_KEY, null); },
    saveAccount: function (account) { writeJson(ACCOUNT_KEY, account); },
    saveSession: function (email) { localStorage.setItem(SESSION_KEY, email); }
  };
  applyStoredTheme();
})();
