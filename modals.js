// ═══════════════════════════════════════
//  MODALS
// ═══════════════════════════════════════
function openModal(id) {
  const el = document.getElementById(id);
  if(!el) return;
  
  if(id === 'm-event' && !can('createEvent')) return toast('Você não tem permissão para criar eventos.');
  if(id === 'm-task'  && !can('createTask'))  return toast('Você não tem permissão para criar demandas.');

  const bsModal = bootstrap.Modal.getOrCreateInstance(el);
  bsModal.show();
  if(id==='m-event') buildEvChecks();
  
  if(id==='m-task') {
      const tkTeam = document.getElementById('tk-team');
      
      if (CU.hier === 'lider') {
          tkTeam.value = CU.team;
          tkTeam.disabled = true; 
      } else {
          tkTeam.disabled = false;
      }
      
      document.getElementById('tk-user').value = ''; 
      updateUserDropdown();
  }
}

function closeModal(id){ 
  const el = document.getElementById(id);
  if(!el) return;
  const bsModal = bootstrap.Modal.getInstance(el);
  if(bsModal) bsModal.hide();
}

function buildEvChecks() {
  document.getElementById('ev-checks').innerHTML=Object.entries(TEAMS).map(([k,v])=>`
    <label class="tc-lbl"><input type="checkbox" value="${k}"><span class="tc-dot" style="background:${v.color}"></span>${v.name}</label>`).join('');
}

function updateUserDropdown() {
    const team = document.getElementById('tk-team').value;
    const sel = document.getElementById('tk-user');
    
    let eligibleUsers = [];
    
    if (CU.hier === 'superadmin') {
        eligibleUsers = users.filter(u => u.status === 'active' && (u.hier === 'membro' || u.hier === 'lider'));
    } else if (CU.hier === 'lider') {
        eligibleUsers = users.filter(u => u.status === 'active' && u.team === CU.team && (u.hier === 'membro' || u.hier === 'lider'));
    } else {
        eligibleUsers = users.filter(u => u.status === 'active' && u.team === team && (u.hier === 'membro' || u.hier === 'lider'));
    }
    
    if(eligibleUsers.length === 0) {
        sel.innerHTML = '<option value="">Nenhum aluno disponível</option>';
    } else {
        sel.innerHTML = '<option value="" disabled selected>Selecione quem vai fazer...</option>' + 
                        eligibleUsers.map(u => {
                            const extraInfo = CU.hier === 'superadmin' ? ` (${TEAMS[u.team]?.name})` : '';
                            return `<option value="${u.name}">${u.name}${extraInfo}</option>`;
                        }).join('');
    }
}

function saveEvent() {
  if(!can('createEvent')) return toast('Acesso Negado: Permissão insuficiente.');

  const title=document.getElementById('ev-title').value.trim();
  const date=document.getElementById('ev-date').value;
  const desc=document.getElementById('ev-desc').value.trim();
  const teams=Array.from(document.querySelectorAll('#ev-checks input:checked')).map(i=>i.value);
  if(!title||!date) return toast('Preencha título e data.');
  events.push({id:Date.now(),title,date,desc,teams});
  closeModal('m-event');
  ['ev-title','ev-date','ev-desc'].forEach(id=>document.getElementById(id).value='');
  toast('Evento criado!');
  addNotif('Novo evento',title+' adicionado para '+date.split('-').reverse().join('/')+'.',teams[0]||'redacao');
  renderCal();
}

function saveTask() {
  if(!can('createTask')) return toast('Acesso Negado: Permissão insuficiente.');

  const title=document.getElementById('tk-title').value.trim();
  const desc=document.getElementById('tk-desc').value.trim();
  const team=document.getElementById('tk-team').value || CU.team;
  const assignedTo=document.getElementById('tk-user').value;

  if(!title) return toast('Informe o título da demanda.');
  if(!assignedTo) return toast('Selecione especificamente qual aluno fará a demanda.');

  tasks.push({id:Date.now(),title,desc,team,status:'todo',createdBy:CU.name, assignedTo: assignedTo});
  closeModal('m-task');
  ['tk-title','tk-desc'].forEach(id=>document.getElementById(id).value='');
  
  toast('Demanda criada com sucesso!');
  
  addNotif('Nova demanda para a equipe',`"${title}" atribuída à equipe de ${TEAMS[team]?.name}.`, team);
  addNotif('Demanda Atribuída a Você', `Você foi escalado(a) para executar a demanda: ${title}`, team, assignedTo);

  renderTasks();
  renderMyCal();
}