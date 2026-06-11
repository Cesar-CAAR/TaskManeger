(function () {
  "use strict";

  const DB_KEY = "taskmanager-db";
  const ACCOUNT_KEY = "taskmanager-account";
  const SESSION_KEY = "taskmanager-session";
  const MEMBERS_KEY = "taskmanager-team-members";
  const THEME_KEY = "taskmanager-theme";
  const SEED_PATH = "../../data/seed.json";

  let dbCache = null;
  let initPromise = null;

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
  }

  function showToast(message, type) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = ("toast " + (type || "")).trim();
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 2800);
  }

  function emptyDb() {
    return {
      account: null,
      session: null,
      members: [],
      tasks: [],
      theme: "light"
    };
  }

  function migrateLegacyData() {
    const account = readJson(ACCOUNT_KEY, null);
    const session = localStorage.getItem(SESSION_KEY);
    const members = readJson(MEMBERS_KEY, null);
    const theme = localStorage.getItem(THEME_KEY);

    if (!account && !session && !members && !theme) {
      return null;
    }

    const db = emptyDb();

    if (account) {
      db.account = account.id ? account : { ...account, id: createId() };
    }

    if (session) {
      db.session = session;
    }

    if (Array.isArray(members)) {
      db.members = members;
    }

    if (theme === "dark" || theme === "light") {
      db.theme = theme;
    }

    localStorage.removeItem(ACCOUNT_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(MEMBERS_KEY);
    localStorage.removeItem(THEME_KEY);

    return db;
  }

  function getDb() {
    if (dbCache) return dbCache;

    const stored = readJson(DB_KEY, null);
    if (stored && typeof stored === "object") {
      dbCache = {
        account: stored.account ?? null,
        session: stored.session ?? null,
        members: Array.isArray(stored.members) ? stored.members : [],
        tasks: Array.isArray(stored.tasks) ? stored.tasks : [],
        theme: stored.theme === "dark" ? "dark" : "light"
      };
      return dbCache;
    }

    const migrated = migrateLegacyData();
    if (migrated) {
      dbCache = migrated;
      writeJson(DB_KEY, dbCache);
      return dbCache;
    }

    dbCache = emptyDb();
    return dbCache;
  }

  function saveDb(db) {
    dbCache = {
      account: db.account ?? null,
      session: db.session ?? null,
      members: Array.isArray(db.members) ? db.members : [],
      tasks: Array.isArray(db.tasks) ? db.tasks : [],
      theme: db.theme === "dark" ? "dark" : "light"
    };
    writeJson(DB_KEY, dbCache);
  }

  function initDatabase() {
    if (initPromise) return initPromise;

    initPromise = (async function () {
      const existing = readJson(DB_KEY, null);

      if (existing && typeof existing === "object") {
        getDb();
        applyStoredTheme();
        return dbCache;
      }

      const migrated = migrateLegacyData();
      if (migrated) {
        saveDb(migrated);
        applyStoredTheme();
        return dbCache;
      }

      try {
        const response = await fetch(SEED_PATH);
        if (!response.ok) throw new Error("No se pudo cargar seed.json");
        const seed = await response.json();
        saveDb({
          account: seed.account ?? null,
          session: seed.session ?? null,
          members: Array.isArray(seed.members) ? seed.members : [],
          tasks: Array.isArray(seed.tasks) ? seed.tasks : [],
          theme: seed.theme === "dark" ? "dark" : "light"
        });
      } catch (error) {
        console.warn("Usando base de datos vacía:", error);
        saveDb(emptyDb());
      }

      applyStoredTheme();
      return dbCache;
    })();

    return initPromise;
  }

  function applyStoredTheme() {
    document.body.classList.toggle("dark-theme", getDb().theme === "dark");
  }

  function renderSidebar(activePage) {
    const container = document.getElementById("sidebar-container");
    if (!container) return;

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
            ${links.map(function (link) {
              return `<a class="nav-link ${link.id === activePage ? "active" : ""}" href="${link.href}">${link.label}</a>`;
            }).join("")}
          </nav>
        </div>
        <div class="sidebar-footer">
          <button class="nav-button" type="button" id="help-button">? Ayuda</button>
          <button class="nav-button" type="button" id="logout-button">↪ Cerrar sesión</button>
        </div>
      </aside>`;

    document.getElementById("help-button").addEventListener("click", function () {
      showToast("Centro de ayuda en construcción.");
    });

    document.getElementById("logout-button").addEventListener("click", function () {
      clearSession();
      window.location.href = "../auth/login.html";
    });
  }

  function getAccount() {
    return getDb().account;
  }

  function saveAccount(account) {
    const db = getDb();
    db.account = { ...account, id: account.id || createId() };
    saveDb(db);
  }

  function getSession() {
    return getDb().session;
  }

  function saveSession(email) {
    const db = getDb();
    db.session = email;
    saveDb(db);
  }

  function clearSession() {
    const db = getDb();
    db.session = null;
    saveDb(db);
  }

  function getMembers() {
    return getDb().members.slice();
  }

  function saveMembers(members) {
    const db = getDb();
    db.members = members;
    saveDb(db);
  }

  function getTasks() {
    return getDb().tasks.slice();
  }

  function getTaskById(taskId) {
    return getDb().tasks.find(function (task) { return task.id === taskId; }) || null;
  }

  function saveTask(task) {
    const db = getDb();
    const index = db.tasks.findIndex(function (t) { return t.id === task.id; });

    if (index >= 0) {
      db.tasks[index] = task;
    } else {
      db.tasks.push(task);
    }

    saveDb(db);
    return task;
  }

  function deleteTask(taskId) {
    const db = getDb();
    db.tasks = db.tasks.filter(function (task) { return task.id !== taskId; });
    saveDb(db);
  }

  function saveTheme(theme) {
    const db = getDb();
    db.theme = theme === "dark" ? "dark" : "light";
    saveDb(db);
    applyStoredTheme();
  }

  window.TaskManager = {
    DB_KEY,
    ACCOUNT_KEY,
    SESSION_KEY,
    MEMBERS_KEY,
    THEME_KEY,
    ready: initDatabase(),
    createId,
    readJson,
    writeJson,
    escapeHtml,
    showToast,
    applyStoredTheme,
    renderSidebar,
    getDb,
    saveDb,
    getAccount,
    saveAccount,
    getSession,
    saveSession,
    clearSession,
    getMembers,
    saveMembers,
    getTasks,
    getTaskById,
    saveTask,
    deleteTask,
    saveTheme
  };

  initDatabase();
})();
