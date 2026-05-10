// ═══════════════════════════════════════
//  SETTINGS
// ═══════════════════════════════════════
function renderSettings() {
  const card=document.getElementById('team-color-card');
  if(can('changeColors')) {
    card.style.display='block';
    const rows=document.getElementById('team-color-rows');
    rows.innerHTML=Object.entries(TEAMS).map(([key,info])=>`
      <div class="color-row">
        <label>${info.name}</label>
        <div class="color-picker-wrap">
          <input type="color" id="cp-${key}" value="${info.color}" oninput="previewColor('${key}',this.value)">
          <div class="color-preview" id="cprev-${key}" style="background:${info.color}">${key.charAt(0).toUpperCase()}</div>
        </div>
      </div>`).join('');
  } else {
    card.style.display='none';
  }
}

function previewColor(key,val) {
  document.getElementById('cprev-'+key).style.background=val;
}

function applyTeamColors() {
  Object.keys(TEAMS).forEach(key=>{
    const inp=document.getElementById('cp-'+key);
    if(inp){
      TEAMS[key].color=inp.value;
      TEAMS[key].bg=hexToLight(inp.value);
    }
  });
  updateSbUser();
  toast('Cores das equipes atualizadas!');
}

function resetTeamColors() {
  TEAMS=JSON.parse(JSON.stringify(DEFAULT_TEAMS));
  renderSettings();
  updateSbUser();
  toast('Cores restauradas para o padrão.');
}

function hexToLight(hex) {
  const r=parseInt(hex.slice(1,3),16);
  const g=parseInt(hex.slice(3,5),16);
  const b=parseInt(hex.slice(5,7),16);
  const lr=Math.round(r+(255-r)*.85);
  const lg=Math.round(g+(255-g)*.85);
  const lb=Math.round(b+(255-b)*.85);
  return `rgb(${lr},${lg},${lb})`;
}