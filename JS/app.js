import { initRouter, navigate } from "./router.js";
import { initAuth } from "./modules/auth.js";
import { initBoard } from "./modules/board.js";
import { initSettings } from "./modules/settings.js";
import { initTeams } from "./modules/teams.js";
import { showToast } from "./components/toast.js";

function initRoute(route) {
  if (route === "login" || route === "register") {
    initAuth(route);
    return;
  }

  initSharedNavigation();

  if (route === "board") {
    initBoard();
  }

  if (route === "settings") {
    initSettings();
  }

  if (route === "teams") {
    initTeams();
  }
}

function initSharedNavigation() {
  document.getElementById("logout-button")?.addEventListener("click", () => {
    localStorage.removeItem("taskmanager-session");
    showToast("Sesión cerrada.");
    navigate("login");
  });

  document.getElementById("help-button")?.addEventListener("click", () => {
    showToast("Centro de ayuda en construcción.");
  });
}

initRouter(initRoute);
