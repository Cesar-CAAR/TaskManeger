function showView(viewId) {
  const views = document.querySelectorAll('.view');
  views.forEach(view => view.classList.remove('active'));

  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active');
  }
}

function toggleTaskPanel() {
  const panel = document.getElementById('task-panel');
  panel.classList.toggle('hidden');
}