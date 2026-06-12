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
      users: [],
      session: null,
      members: [],
      tasks: [],
      theme: "light"
    };
  }

  function normalizeDb(stored) {
    const db = {
      users: [],
      session: null,
      members: Array.isArray(stored.members) ? stored.members : [],
      tasks: Array.isArray(stored.tasks) ? stored.tasks : [],
      theme: stored.theme === "dark" ? "dark" : "light"
    };

    if (Array.isArray(stored.users)) {
      db.users = stored.users;
    } else if (stored.account) {
      db.users = [stored.account.id ? stored.account : { ...stored.account, id: createId() }];
    }

    if (stored.session) {
      const byId = db.users.find(function (user) { return user.id === stored.session; });
      const byEmail = db.users.find(function (user) { return user.email === stored.session; });
      db.session = byId ? byId.id : (byEmail ? byEmail.id : null);
    }

    return db;
  }

  function migrateLegacyData() {
    const account = readJson(ACCOUNT_KEY, null);
    const session = localStorage.getItem(SESSION_KEY);
    const members = readJson(MEMBERS_KEY, null);
    const theme = localStorage.getItem(THEME_KEY);

    if (!account && !session && !members && !theme) {
      return null;
    }

    const migrated = normalizeDb({
      account,
      session,
      members: members || [],
      tasks: [],
      theme
    });

    localStorage.removeItem(ACCOUNT_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(MEMBERS_KEY);
    localStorage.removeItem(THEME_KEY);

    return migrated;
  }

  function getDb() {
    if (dbCache) return dbCache;

    const stored = readJson(DB_KEY, null);
    if (stored && typeof stored === "object") {
      dbCache = normalizeDb(stored);
      if (stored.account || stored.session !== dbCache.session) {
        writeJson(DB_KEY, dbCache);
      }
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
    dbCache = normalizeDb(db);
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
        saveDb(normalizeDb({
          users: Array.isArray(seed.users) ? seed.users : [],
          session: seed.session ?? null,
          members: Array.isArray(seed.members) ? seed.members : [],
          tasks: Array.isArray(seed.tasks) ? seed.tasks : [],
          theme: seed.theme === "dark" ? "dark" : "light"
        }));
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

  function getCurrentUserId() {
    return getDb().session;
  }

  function getCurrentUser() {
    const userId = getCurrentUserId();
    if (!userId) return null;
    return getDb().users.find(function (user) { return user.id === userId; }) || null;
  }

  function requireSession() {
    if (!getCurrentUser()) {
      window.location.href = "../auth/login.html";
      return false;
    }
    return true;
  }

  function findUserByCredentials(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    return getDb().users.find(function (user) {
      return user.email.trim().toLowerCase() === normalizedEmail && user.password === password;
    }) || null;
  }

  function registerUser(user) {
    const db = getDb();
    const normalizedEmail = user.email.trim().toLowerCase();

    if (db.users.some(function (existing) {
      return existing.email.trim().toLowerCase() === normalizedEmail;
    })) {
      return null;
    }

    const newUser = {
      ...user,
      id: user.id || createId(),
      email: user.email.trim()
    };

    db.users.push(newUser);

    if (db.users.length === 1) {
      db.tasks = db.tasks.map(function (task) {
        return task.userId ? task : { ...task, userId: newUser.id };
      });
      db.members = db.members.map(function (member) {
        return member.userId ? member : { ...member, userId: newUser.id };
      });
    }

    saveDb(db);
    return newUser;
  }

  function renderSidebar(activePage) {
    const container = document.getElementById("sidebar-container");
    if (!container) return;

    const user = getCurrentUser();
    const userLabel = user
      ? escapeHtml((user.name + " " + (user.lastname || "")).trim())
      : "Productivity";

    const links = [
      { id: "board", label: "▦ Tablero", href: "../board/board.html" },
      { id: "teams", label: "♟ Equipos", href: "../teams/teams.html" },
      { id: "settings", label: "⚙ Configuración", href: "../settings/settings.html" }
    ];

    container.innerHTML = `
      <aside class="sidebar">
        <div>
          <div class="brand"><h2>TaskManager</h2><p>${userLabel}</p></div>
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
    return getCurrentUser();
  }

  function saveAccount(updates) {
    const db = getDb();
    const userId = db.session;
    if (!userId) return;

    const index = db.users.findIndex(function (user) { return user.id === userId; });
    if (index < 0) return;

    db.users[index] = { ...db.users[index], ...updates, id: userId };
    saveDb(db);
  }

  function getSession() {
    return getDb().session;
  }

  function saveSession(userId) {
    const db = getDb();
    db.session = userId;
    saveDb(db);
  }

  function clearSession() {
    const db = getDb();
    db.session = null;
    saveDb(db);
  }

  function getMembers() {
    const userId = getCurrentUserId();
    if (!userId) return [];
    return getDb().members.filter(function (member) { return member.userId === userId; });
  }

  function saveMembers(members) {
    const userId = getCurrentUserId();
    if (!userId) return;

    const db = getDb();
    const others = db.members.filter(function (member) { return member.userId !== userId; });
    const owned = members.map(function (member) { return { ...member, userId }; });
    db.members = others.concat(owned);
    saveDb(db);
  }

  function getTasks() {
    const userId = getCurrentUserId();
    if (!userId) return [];
    return getDb().tasks.filter(function (task) { return task.userId === userId; });
  }

  function getTaskById(taskId) {
    const task = getDb().tasks.find(function (item) { return item.id === taskId; });
    if (!task || task.userId !== getCurrentUserId()) return null;
    return task;
  }

  function saveTask(task) {
    const userId = getCurrentUserId();
    if (!userId) return null;

    const db = getDb();
    const ownedTask = { ...task, userId };
    const index = db.tasks.findIndex(function (item) { return item.id === ownedTask.id; });

    if (index >= 0) {
      db.tasks[index] = ownedTask;
    } else {
      db.tasks.push(ownedTask);
    }

    saveDb(db);
    return ownedTask;
  }

  function deleteTask(taskId) {
    const userId = getCurrentUserId();
    if (!userId) return;

    const db = getDb();
    db.tasks = db.tasks.filter(function (task) {
      return !(task.id === taskId && task.userId === userId);
    });
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
    getCurrentUser,
    requireSession,
    findUserByCredentials,
    registerUser,
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
