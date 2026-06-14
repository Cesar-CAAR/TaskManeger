import { renderSidebar } from "./components/sidebar.js";

const ROUTES = {
  login: {
    view: "views/auth/login.html",
    layout: "auth"
  },
  register: {
    view: "views/auth/register.html",
    layout: "auth"
  },
  board: {
    view: "views/board/board.html",
    layout: "app"
  },
  settings: {
    view: "views/settings/settings.html",
    layout: "app"
  },
  teams: {
    view: "views/teams/teams.html",
    layout: "app"
  }
};

let routeRenderedCallback = () => {};

function normalizeRoute(route) {
  return ROUTES[route] ? route : "login";
}

async function loadRoute(route) {
  const normalizedRoute = normalizeRoute(route);
  const config = ROUTES[normalizedRoute];
  const app = document.getElementById("app");

  try {
    const response = await fetch(config.view);

    if (!response.ok) {
      throw new Error(`No se pudo cargar ${config.view}`);
    }

    const html = await response.text();

    if (config.layout === "app") {
      app.innerHTML = `
        <div class="app-shell">
          ${renderSidebar(normalizedRoute)}
          <main class="page-content">${html}</main>
        </div>
      `;
    } else {
      app.innerHTML = html;
    }

    routeRenderedCallback(normalizedRoute);
  } catch (error) {
    app.innerHTML = `
      <main class="auth-page">
        <section class="auth-container">
          <div class="auth-card">
            <h2>No fue posible cargar la aplicación</h2>
            <p class="muted">
              Ejecuta el proyecto mediante Live Server o un servidor local.
              Abrir index.html directamente puede bloquear la carga de vistas modulares.
            </p>
          </div>
        </section>
      </main>
    `;
    console.error(error);
  }
}

export function navigate(route) {
  const normalizedRoute = normalizeRoute(route);

  if (window.location.hash === `#${normalizedRoute}`) {
    loadRoute(normalizedRoute);
    return;
  }

  window.location.hash = normalizedRoute;
}

export function initRouter(callback) {
  routeRenderedCallback = callback;

  document.addEventListener("click", (event) => {
    const routeButton = event.target.closest("[data-route]");

    if (routeButton) {
      event.preventDefault();
      navigate(routeButton.dataset.route);
    }
  });

  window.addEventListener("hashchange", () => {
    loadRoute(window.location.hash.replace("#", ""));
  });

  loadRoute(window.location.hash.replace("#", "") || "login");
}
