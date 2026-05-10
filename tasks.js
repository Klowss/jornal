// ═══════════════════════════════════════
//  TASKS
// ═══════════════════════════════════════
function renderTasks() {
  const fb=document.getElementById('task-filter-bar');
  const tsSub=document.getElementById('tasks-sub');

  if(!can('seeAllTasks')) {
    // REGRA DE MEMBRO: Vê estritamente o que foi delegado a ele
    fb.style.display='none';
    tsSub.textContent='Suas demandas atribuídas';
    const myTasks=tasks.filter(t => t.assignedTo === CU.name);
    renderKanban(myTasks, true); 
    return;
  }

  fb.style.display='flex';
  tsSub.textContent=taskFilter==='all'?'Todas as equipes':(TEAMS[taskFilter]?.name||'');
  const filters=[{key:'all',label:'Todos'}, ...Object.keys(TEAMS).map(k=>({key:k,label:TEAMS[k].name}))];
  fb.innerHTML=filters.map(f=>{
    const isA=taskFilter===f.key;
    const tc=TEAMS[f.key];
    if(isA&&tc) return `<button onclick="setFilter('${f.key}')" class="btn btn-sm" style="border:1.5px solid ${tc.color};background:${tc.bg};color:${tc.color};">${f.label}</button>`;
    if(isA) return `<button onclick="setFilter('${f.key}')" class="btn btn-dark btn-sm">${f.label}</button>`;
    return `<button onclick="setFilter('${f.key}')" class="btn btn-outline-secondary btn-sm bg-white">${f.label}</button>`;
  }).join('');
  
  const filtered=taskFilter==='all'?tasks:tasks.filter(t=>t.team===taskFilter);
  renderKanban(filtered, true);
}

function renderKanban(list, editable) {
  ['todo','doing','done'].forEach(status=>{
    const col=document.getElementById('col-'+status);
    const cnt=document.getElementById('cnt-'+status);
    const items=list.filter(t=>t.status===status);
    cnt.textContent=items.length;
    if(!items.length){ col.innerHTML='<div class="empty"><p>Nenhuma tarefa</p></div>'; return; }
    col.innerHTML=items.map(task=>{
      const info=TEAMS[task.team]||{name:'Geral',color:'#888',bg:'#eee'};
      let acts='';
      if(editable && can('moveTask')){
        if(status!=='todo') acts+=`<button class="tmv" onclick="mvTask(${task.id},'${status==='done'?'doing':'todo'}')">← Voltar</button>`;
        if(status!=='done') acts+=`<button class="tmv" onclick="mvTask(${task.id},'${status==='todo'?'doing':'done'}')">Avançar →</button>`;
        if(can('deleteTask')) acts+=`<button class="tmv tdel" onclick="delTask(${task.id})">Excluir</button>`;
      }
      return `<div class="task-card">
        <div class="task-badge" style="background:${info.bg};color:${info.color}">${info.name}</div>
        <h4>${task.title}</h4>
        <p>${task.desc}</p>
        <div style="font-size: .7rem; color: var(--green-dark); margin-top: 6px; font-weight: 600; background: var(--green-light); display: inline-block; padding: 2px 6px; border-radius: 4px;">
          👤 ${task.assignedTo || 'Não atribuído'}
        </div>
        ${acts?`<div class="task-actions">${acts}</div>`:''}
      </div>`;
    }).join('');
  });
}

function setFilter(k){ taskFilter=k; renderTasks(); }
function mvTask(id,status){
  const t=tasks.find(t=>t.id===id); if(!t) return;
  t.status=status; renderTasks(); renderMyCal();
  addNotif('Demanda movida',`"${t.title}" → ${status==='doing'?'Em Andamento':status==='done'?'Concluído':'A Fazer'}`,t.team);
}
function delTask(id){ tasks=tasks.filter(t=>t.id!==id); renderTasks(); renderMyCal(); toast('Demanda removida.'); }