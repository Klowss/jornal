// ═══════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════
function doAuth() {
  const email = document.getElementById('a-email').value.trim();
  const pass  = document.getElementById('a-pass').value;
  
  // VERIFICAÇÃO: O email tem que ser @aluno.ifnmg.edu.br
  if (!email.endsWith('@aluno.ifnmg.edu.br')) {
      return toast('Acesso negado: Utilize seu email institucional @aluno.ifnmg.edu.br');
  }
  
  const u = users.find(u => u.email===email && u.pass===pass);
  if (!u) return toast('Email ou senha incorretos.');
  if (u.status==='suspended') return toast('Acesso suspenso. Contate a coordenação.');
  startSession(u);
}

function startSession(u) {
  CU = u;
  document.getElementById('auth-screen').style.display='none';
  document.getElementById('app').classList.add('active');
  initApp();
}

function logout() {
  CU=null;
  document.getElementById('app').classList.remove('active');
  document.getElementById('auth-screen').style.display='flex';
  document.getElementById('a-email').value='';
  document.getElementById('a-pass').value='';
}