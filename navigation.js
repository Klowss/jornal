// ═══════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════
const VIEW_TITLES={calendar:'Agenda Geral','my-cal':'Minha Agenda',tasks:'Demandas',team:'Equipe',notifications:'Notificações',admin:'Administração',settings:'Configurações'};

function switchView(id) {
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.nav-item[id]').forEach(b=>b.classList.remove('active'));
  const vEl=document.getElementById('view-'+id);
  if(vEl) vEl.classList.add('active');
  const nEl=document.getElementById('nav-'+id);
  if(nEl) nEl.classList.add('active');
  document.getElementById('topbar-title').textContent=VIEW_TITLES[id]||'';
  closeSidebar();
  
  const aev=document.getElementById('btn-add-ev');
  const atk=document.getElementById('btn-add-task');
  if(aev) aev.style.display=(id==='calendar'&&can('createEvent'))?'inline-flex':'none';
  if(atk) atk.style.display=(id==='tasks'&&can('createTask'))?'inline-flex':'none';
  
  if(id==='calendar') renderCal();
  if(id==='my-cal')   renderMyCal();
  if(id==='tasks')    renderTasks();
  if(id==='team')     renderTeam();
  if(id==='notifications') renderNotifs();
  if(id==='admin')    renderAdmin();
  if(id==='settings') renderSettings();
}