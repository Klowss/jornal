// ═══════════════════════════════════════
//  INIT
// ═══════════════════════════════════════
function initApp() {
  buildNav();
  updateSbUser();
  taskFilter = can('seeAllTasks') ? 'all' : CU.team;
  
  if (!can('createEvent')) {
    const btnEv = document.getElementById('btn-add-ev');
    if (btnEv) btnEv.remove();
  }
  if (!can('createTask')) {
    const btnTk = document.getElementById('btn-add-task');
    if (btnTk) btnTk.remove();
  }

  switchView('my-cal');
  updateNotifDot();
}

const NAV = [
  {id:'my-cal',    label:'Minha Agenda',  icon:'<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><circle cx="12" cy="15" r="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'},
  {id:'calendar',  label:'Agenda Geral',  icon:'<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'},
  {id:'tasks',     label:'Demandas',      icon:'<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'},
  {id:'team',      label:'Equipe',        icon:'<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'},
  {id:'notifications',label:'Notificações',icon:'<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>'},
  {id:'admin',     label:'Administração', icon:'<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', restrict:'manageUsers'},
];

function buildNav() {
  const nav=document.getElementById('sb-nav');
  nav.innerHTML='<div class="nav-sect">Menu</div>';
  NAV.forEach(item=>{
    if(item.restrict && !can(item.restrict)) return;
    const b=document.createElement('button');
    b.className='nav-item'; b.id='nav-'+item.id;
    b.innerHTML=item.icon+' '+item.label;
    b.onclick=()=>switchView(item.id);
    nav.appendChild(b);
  });
}

function updateSbUser() {
  const t=TEAMS[CU.team]||{color:'#2f8f41',bg:'#e8f5eb'};
  const h=HIER_META[CU.hier]||{label:'Membro',cls:'hb-mb'};
  const av=document.getElementById('sb-av');
  av.textContent=CU.name.charAt(0).toUpperCase();
  av.style.background=t.color;
  document.getElementById('sb-name').textContent=CU.name;
  const rb=document.getElementById('sb-role');
  rb.textContent=h.label;
  rb.style.cssText=`background:${t.bg};color:${t.color};display:inline-block;font-size:.62rem;padding:1px 6px;border-radius:4px;font-weight:500;margin-top:2px`;
}