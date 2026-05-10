// ═══════════════════════════════════════
//  CALENDAR & MINHA AGENDA
// ═══════════════════════════════════════
function renderCal() { renderCalInto('cal-grid','cal-lbl',calDate,events); }
function chMonth(d){ calDate.setMonth(calDate.getMonth()+d); renderCal(); }

function renderMyCal() {  
  const hdr = document.getElementById('my-tasks-header');
  const brd = document.getElementById('my-tasks-board');

  if (CU.hier === 'superadmin') {
    hdr.style.display = 'none';
    brd.style.display = 'none';
  } else {
    hdr.style.display = 'block';
    brd.style.display = 'flex';
    
    const myTasks = tasks.filter(t => t.assignedTo === CU.name);
    const ptContainer = document.getElementById('my-personal-tasks');
    if(!myTasks.length) {
       ptContainer.innerHTML = '<div style="grid-column: 1 / -1;"><p class="text-muted small mb-0">Nenhuma demanda atribuída especificamente a você no momento.</p></div>';
    } else {
       ptContainer.innerHTML = myTasks.map(task => {
          const info=TEAMS[task.team]||{name:'Geral',color:'#888',bg:'#eee'};
          const statusName = task.status === 'todo' ? 'A Fazer' : (task.status === 'doing' ? 'Em Andamento' : 'Concluído');
          
          return `
          <div class="personal-card">
            <div>
              <span class="status-pill" style="background:${info.bg}; color:${info.color}">${info.name}</span>
              <span style="float:right; font-size:.65rem; font-weight:600; padding: 2px 6px; border-radius:4px; background:var(--bg); border: 1px solid var(--border);">${statusName}</span>
              <h4>${task.title}</h4>
              <p>${task.desc}</p>
            </div>
            <div class="d-flex align-items-center justify-content-between mt-2 pt-2 border-top">
               <button class="btn btn-sm btn-light border" onclick="switchView('tasks')">Ir para Demandas</button>
            </div>
          </div>`;
       }).join('');
    }
  }

  // Oculta completamente a seção de eventos na "Minha Agenda" se for Membro
  const evSection = document.getElementById('my-events-section');
  if(CU.hier === 'membro') {
      evSection.style.display = 'none';
  } else {
      evSection.style.display = 'block';
      const myEvs=events.filter(e=>e.teams.includes(CU.team));
      renderCalInto('my-cal-grid','my-cal-lbl',myCalDate,myEvs);
  }
}
function chMonthMy(d){ myCalDate.setMonth(myCalDate.getMonth()+d); renderMyCal(); }

function renderCalInto(gid,lid,date,evList) {
  const g=document.getElementById(gid);
  const l=document.getElementById(lid);
  const y=date.getFullYear(),m=date.getMonth();
  l.textContent=MONTHS[m]+' '+y;
  const today=new Date();
  const first=new Date(y,m,1).getDay();
  const days=new Date(y,m+1,0).getDate();
  let html='';
  for(let i=0;i<first;i++) html+='<div class="cal-cell other"></div>';
  for(let d=1;d<=days;d++){
    const ds=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const isTod=d===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();
    const dayEvs=evList.filter(e=>e.date===ds);
    const numH=isTod?`<span class="day-num today">${d}</span>`:`<span class="day-num">${d}</span>`;
    const chips=dayEvs.map(ev=>{
      const col=TEAMS[ev.teams[0]]?.color||'var(--green)';
      return `<div class="ev-chip" style="background:${col}" onclick="showEvDetail(${ev.id})">${ev.title}</div>`;
    }).join('');
    html+=`<div class="cal-cell">${numH}${chips}</div>`;
  }
  const total=first+days;
  const rem=(7-(total%7))%7;
  for(let i=0;i<rem;i++) html+='<div class="cal-cell other"></div>';
  g.innerHTML=html;
}

function showEvDetail(id) {
  const ev=events.find(e=>e.id===id); if(!ev) return;
  document.getElementById('evd-title').textContent=ev.title;
  const d=new Date(ev.date+'T12:00:00');
  const tags=ev.teams.map(t=>{const i=TEAMS[t]; return `<span style="display:inline-flex;align-items:center;gap:3px;font-size:.72rem;font-weight:500;padding:2px 8px;border-radius:4px;background:${i.bg};color:${i.color}">${i.name}</span>`;}).join('');
  document.getElementById('evd-body').innerHTML=`
    <p style="font-size:.78rem;color:var(--muted);margin-bottom:.5rem">📅 ${d.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}</p>
    <p style="font-size:.87rem;margin-bottom:1rem;line-height:1.5">${ev.desc}</p>
    <p style="font-size:.72rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:.45rem">Equipes</p>
    <div style="display:flex;flex-wrap:wrap;gap:.35rem">${tags}</div>`;
  openModal('m-ev-detail');
}