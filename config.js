// ═══════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const DEFAULT_TEAMS = {
  video:      { name:'Edição de Vídeo',      color:'#6c3fc5', bg:'#f0ebff' },
  midia:      { name:'Redes Sociais / Mídia', color:'#0ea5c4', bg:'#e8f7fb' },
  foto:       { name:'Fotografia',            color:'#d97706', bg:'#fff8eb' },
  entrevista: { name:'Entrevista / Rep.',      color:'#dc4c3e', bg:'#fdecea' },
  redacao:    { name:'Redação / Roteiro',      color:'#2563eb', bg:'#eff3ff' }
};

let TEAMS = JSON.parse(JSON.stringify(DEFAULT_TEAMS));

const HIER_META = {
  superadmin: { label:'Super Admin', cls:'hb-sa' },
  professor:  { label:'Professor',   cls:'hb-pr' },
  lider:      { label:'Líder',       cls:'hb-li' },
  membro:     { label:'Membro',      cls:'hb-mb' },
};