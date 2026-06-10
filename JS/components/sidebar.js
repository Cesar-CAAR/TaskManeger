const NAVIGATION_ITEMS = [
  { route: "board", label: "▦ Tablero" },
  { route: "teams", label: "♟ Equipos" },
  { route: "settings", label: "⚙ Configuración" }
];

export function renderSidebar(activeRoute) {
  const items = NAVIGATION_ITEMS.map(({ route, label }) => `
    <button
      class="nav-button ${route === activeRoute ? "active" : ""}"
      type="button"
      data-route="${route}"
    >
      ${label}
    </button>
  `).join("");

  return `
    <aside class="sidebar">
      <div>
        <div class="brand">
          <h2>TaskManager</h2>
          <p>Productivity</p>
        </div>

        <nav class="nav-list" aria-label="Navegación principal">
          ${items}
        </nav>
      </div>

      <div class="sidebar-footer">
        <button class="nav-button" type="button" id="help-button">? Ayuda</button>
        <button class="nav-button" type="button" id="logout-button">↪ Cerrar sesión</button>
      </div>
    </aside>
  `;
}
