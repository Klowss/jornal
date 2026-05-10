// ═══════════════════════════════════════
//  DATA
// ═══════════════════════════════════════
let users = [
  { id:1, name:'Ana',       email:'ana@aluno.ifnmg.edu.br',       pass:'ana123',   team:'redacao',    hier:'superadmin', status:'active' },
  { id:2, name:'Montanari', email:'montanari@aluno.ifnmg.edu.br', pass:'mont123',   team:'redacao',    hier:'superadmin', status:'active' },
  { id:3, name:'Prof. Souza', email:'souza@aluno.ifnmg.edu.br',     pass:'prof123',   team:'redacao',    hier:'professor',  status:'active' },
  { id:4, name:'Carlos Lima', email:'carlos@aluno.ifnmg.edu.br',    pass:'carlos123', team:'video',      hier:'lider',      status:'active' },
  { id:5, name:'Bia Neves',   email:'bia@aluno.ifnmg.edu.br',       pass:'bia123',    team:'foto',       hier:'lider',      status:'active' },
  { id:6, name:'Lucas Mota',  email:'lucas@aluno.ifnmg.edu.br',     pass:'lucas123',  team:'redacao',    hier:'membro',     status:'active' },
  { id:7, name:'Fer Reis',    email:'fer@aluno.ifnmg.edu.br',       pass:'fer123',    team:'midia',      hier:'membro',     status:'active' },
  { id:8, name:'Pedro Silva', email:'pedro@aluno.ifnmg.edu.br',     pass:'pedro123',  team:'entrevista', hier:'membro',     status:'active' },
  { id:9, name:'Julia Castro',email:'julia@aluno.ifnmg.edu.br',     pass:'julia123',  team:'foto',       hier:'membro',     status:'active' },
];

let events = [
  { id:1, title:'Feira de Ciências', date:'2026-04-15', desc:'Cobertura das apresentações no pátio central.', teams:['foto','redacao','video'] },
  { id:2, title:'Palestra sobre IA',  date:'2026-04-22', desc:'Gravar palestra do Prof. Alves — Bloco B.',    teams:['video','entrevista'] },
  { id:3, title:'Reunião de Pauta',   date:'2026-04-08', desc:'Sala 12, 14h. Definir pautas do mês.',         teams:['redacao'] },
  { id:4, title:'Visita Técnica',     date:'2026-04-29', desc:'Cobertura da visita ao campus Almenara.',       teams:['foto','midia'] },
];

let tasks = [
  { id:1, title:'Editar teaser Feira',    desc:'Vídeo de 30s para o Instagram.',            team:'video',      status:'todo',  createdBy:'Carlos Lima', assignedTo: 'Carlos Lima' },
  { id:2, title:'Agendar posts semana',   desc:'Cronograma semanal de publicações.',        team:'midia',      status:'doing', createdBy:'Prof. Souza', assignedTo: 'Fer Reis' },
  { id:3, title:'Artigo sobre gincana',   desc:'Texto de 500 palavras para o site.',        team:'redacao',    status:'done',  createdBy:'Prof. Souza', assignedTo: 'Lucas Mota' },
  { id:4, title:'Fotos do laboratório',   desc:'Registro das aulas práticas de química.',   team:'foto',       status:'todo',  createdBy:'Bia Neves',   assignedTo: 'Julia Castro' },
  { id:5, title:'Entrevista c/ diretora', desc:'Pauta: projetos para o 2º semestre.',       team:'entrevista', status:'todo',  createdBy:'Prof. Souza', assignedTo: 'Pedro Silva' },
  { id:6, title:'Roteiro ep. 3',          desc:'Roteiro do terceiro episódio do podcast.',  team:'redacao',    status:'doing', createdBy:'Lucas Mota',  assignedTo: 'Lucas Mota' },
];

let notifs = [
  { id:1, title:'Novo evento criado',  text:'Feira de Ciências adicionada para 15/04.',                time:'Hoje, 09:12', team:'redacao', read:false, user: null },
  { id:2, title:'Demanda atribuída',   text:'Editar teaser Feira foi atribuída à Edição de Vídeo.',  time:'Ontem, 17:30',team:'video',   read:false, user: null },
  { id:3, title:'Tarefa concluída',    text:'Artigo sobre gincana foi marcado como concluído.',        time:'Ontem, 14:00',team:'redacao', read:true,  user: null },
  { id:4, title:'Nova demanda',        text:'Você foi designado para: Roteiro ep. 3',                  time:'Ontem, 10:00',team:'redacao', read:false, user: 'Lucas Mota' }
];