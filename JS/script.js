const loginForm = document.getElementById("login-form");
const logoutButton = document.getElementById("logout-button");
function showView(id) {
  document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
loginForm.addEventListener("submit", event => { event.preventDefault(); showView("dashboard-view"); });
logoutButton.addEventListener("click", () => showView("login-view"));
