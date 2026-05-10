// ═══════════════════════════════════════
//  TEAM
// ═══════════════════════════════════════
function renderTeam() {
  const g=document.getElementById('team-grid');
  g.innerHTML=users.filter(u=>u.status==='active').map(u=>{
    const t=TEAMS[u.team]||{color:'#888',bg:'#eee',name:'?'};
    const h=HIER_META[u.hier]||{label:'Membro',cls:'hb-mb'};
    return `<div class="member-card">
      <div class="m-avatar" style="background:${t.color}">${u.name.charAt(0)}</div>
      <div>
        <div class="m-name">${u.name} <span class="hier-badge ${h.cls}">${h.label}</span></div>
        <div class="m-email">${u.email}</div>
        <div class="m-role" style="background:${t.bg};color:${t.color}">${t.name}</div>
      </div>
    </div>`;
  }).join('');
}