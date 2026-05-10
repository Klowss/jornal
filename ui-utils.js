// ═══════════════════════════════════════
//  UI UTILS & TOAST
// ═══════════════════════════════════════
function toast(msg) {
  const t = document.getElementById('toast');
  if(!t) return;
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sb-overlay').classList.add('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sb-overlay').classList.remove('open');
}

function doSearch(val) {
  // Apenas demonstração para quando digitar na barra superior
  console.log("Buscando por:", val);
}