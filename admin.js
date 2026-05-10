// ═══════════════════════════════════════
//  ADMIN
// ═══════════════════════════════════════
function renderAdmin() {
  document.getElementById('admin-cnt').textContent=users.length+' usuários';
  const hierSel=document.getElementById('cu-hier');
  if(CU.hier==='professor') {
    Array.from(hierSel.options).forEach(o=>{ if(o.value==='professor') o.style.display='none'; });
  }
  document.getElementById('admin-tbody').innerHTML=users.map(u=>{
    const t=TEAMS[u.team]||{name:'?',color:'#888',bg:'#eee'};
    const h=HIER_META[u.hier]||{label:'Membro',cls:'hb-mb'};
    const isMe=u.id===CU.id;
    const sp=u.status==='active'?'<span class="s-pill s-active">Ativo</span>':'<span class="s-pill s-suspended">Suspenso</span>';
    const suspBtn=can('suspendUser')&&!isMe?`<button class="btn btn-sm btn-outline-${u.status==='active'?'danger':'success'}" onclick="toggleStatus(${u.id})">${u.status==='active'?'Suspender':'Reativar'}</button>`:'';
    return `<tr>
      <td><strong>${u.name}</strong>${isMe?' <span style="font-size:.68rem;color:var(--muted)">(você)</span>':''}</td>
      <td style="color:var(--muted);font-size:.85rem">${u.email}</td>
      <td><span style="font-size:.72rem;font-weight:500;padding:2px 7px;border-radius:4px;background:${t.bg};color:${t.color}">${t.name}</span></td>
      <td><span class="hier-badge ${h.cls}">${h.label}</span></td>
      <td>${sp}</td>
      <td>${suspBtn}</td>
    </tr>`;
  }).join('');
}

function toggleStatus(id) {
  const u=users.find(u=>u.id===id); if(!u) return;
  u.status=u.status==='active'?'suspended':'active';
  toast(u.name+' '+(u.status==='active'?'reativado.':'suspenso.'));
  addNotif('Acesso atualizado',`${u.name} foi ${u.status==='active'?'reativado':'suspenso'}.`,'redacao');
  renderAdmin(); renderTeam();
}

function createUser() {
  const name=document.getElementById('cu-name').value.trim();
  const email=document.getElementById('cu-email').value.trim();
  const pass=document.getElementById('cu-pass').value;
  const team=document.getElementById('cu-team').value;
  let hier=document.getElementById('cu-hier').value;
  if(CU.hier==='professor'&&hier==='professor') hier='membro';
  
  if(!name||!email||!pass) return toast('Preencha todos os campos.');
  
  // VERIFICAÇÃO ADICIONADA: Criação de conta obriga @aluno.ifnmg.edu.br
  if(!email.endsWith('@aluno.ifnmg.edu.br')) {
      return toast('O email deve ser obrigatoriamente @aluno.ifnmg.edu.br');
  }

  if(users.find(u=>u.email===email)) return toast('Email já cadastrado.');
  
  users.push({id:Date.now(),name,email,pass,team,hier,status:'active'});
  closeModal('m-user');
  ['cu-name','cu-email','cu-pass'].forEach(id=>document.getElementById(id).value='');
  toast('Login criado para '+name+'!');
  addNotif('Novo membro',name+' entrou para a equipe de '+(TEAMS[team]?.name||''),team);
  renderAdmin(); renderTeam();
}