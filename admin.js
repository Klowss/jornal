// ═══════════════════════════════════════
//  ADMIN
// ═══════════════════════════════════════
function renderAdmin() {
  document.getElementById('admin-cnt').textContent = users.length + ' usuários';
  const hierSel = document.getElementById('cu-hier');

  if (CU.hier === 'professor') {
    Array.from(hierSel.options).forEach(o => {
      if (o.value === 'professor') o.style.display = 'none';
    });
  }

  document.getElementById('admin-tbody').innerHTML = users.map(u => {
    const h = HIER_META[u.hier] || { label: 'Membro', cls: 'hb-mb' };
    const isMe = u.id === CU.id;
    const sp = u.status === 'active'
      ? '<span class="s-pill s-active">Ativo</span>'
      : u.status === 'suspended'
        ? '<span class="s-pill s-suspended">Suspenso</span>'
        : '<span class="s-pill s-pending">Pendente</span>';

    const editBtn = !isMe
      ? `<button class="btn btn-sm btn-outline-primary" onclick="openEditUserModal(${u.id})">
           <i class="ti ti-edit"></i> Editar
         </button>`
      : '';

    return `<tr>
      <td><strong>${u.name}</strong>${isMe ? ' <span style="font-size:.68rem;color:var(--muted)">(você)</span>' : ''}</td>
      <td style="color:var(--muted);font-size:.85rem">${u.email}</td>
      <td><span class="hier-badge ${h.cls}">${h.label}</span></td>
      <td>${sp}</td>
      <td>${editBtn}</td>
    </tr>`;
  }).join('');
}

// ─── Modal de edição de usuário ───────────────────────────────────────────────

function openEditUserModal(id) {
  const u = users.find(u => u.id === id);
  if (!u) return;

  // Remove modal anterior se existir
  document.getElementById('modal-edit-user-overlay')?.remove();

  const ROLES = [
    { value: 'superadmin', label: 'Superadmin', icon: 'ti-shield-star',  color: 'warning' },
    { value: 'professor',  label: 'Professor',  icon: 'ti-school',        color: 'info'    },
    { value: 'lider',      label: 'Líder',       icon: 'ti-users',         color: 'success' },
    { value: 'membro',     label: 'Membro',      icon: 'ti-user',          color: 'secondary'},
  ];

  const STATUS_OPTIONS = [
    { value: 'active',    label: 'Ativo',    icon: 'ti-check', color: 'success' },
    { value: 'suspended', label: 'Suspenso', icon: 'ti-ban',   color: 'danger'  },
    { value: 'pending',   label: 'Pendente', icon: 'ti-clock', color: 'warning' },
  ];

  // Bloqueia professor de promover para superadmin
  const allowedRoles = CU.hier === 'professor'
    ? ROLES.filter(r => r.value !== 'superadmin' && r.value !== 'professor')
    : ROLES;

  const initials = u.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

  const roleButtons = allowedRoles.map(r => {
    const active = u.hier === r.value;
    return `<button
      class="eu-role-btn ${active ? 'eu-active-info' : ''}"
      data-group="role"
      data-value="${r.value}"
      onclick="euSelect(this,'role')"
    >
      <i class="ti ${r.icon}"></i> ${r.label}
    </button>`;
  }).join('');

  const statusButtons = STATUS_OPTIONS.map(s => {
    const active = (u.status || 'active') === s.value;
    return `<button
      class="eu-status-btn ${active ? 'eu-active-' + s.color : ''}"
      data-group="status"
      data-value="${s.value}"
      data-color="${s.color}"
      onclick="euSelect(this,'status')"
    >
      <i class="ti ${s.icon}"></i> ${s.label}
    </button>`;
  }).join('');

  const teamOptions = Object.entries(TEAMS || {}).map(([k, v]) =>
    `<option value="${k}" ${u.team === k ? 'selected' : ''}>${v.name || k}</option>`
  ).join('');

  const overlay = document.createElement('div');
  overlay.id = 'modal-edit-user-overlay';
  overlay.innerHTML = `
    <style>
      #modal-edit-user-overlay {
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,.45);
        display: flex; align-items: center; justify-content: center;
        padding: 1rem;
      }
      #modal-edit-user-box {
        background: var(--card-bg, #fff);
        border-radius: 12px;
        border: 1px solid var(--border, #e5e7eb);
        width: 100%; max-width: 460px;
        box-shadow: 0 8px 32px rgba(0,0,0,.12);
        overflow: hidden;
      }
      .eu-header {
        padding: 1.1rem 1.4rem;
        border-bottom: 1px solid var(--border, #e5e7eb);
        display: flex; align-items: center; justify-content: space-between;
      }
      .eu-avatar {
        width: 38px; height: 38px; border-radius: 50%;
        background: #dbeafe; color: #1d4ed8;
        display: flex; align-items: center; justify-content: center;
        font-weight: 600; font-size: 13px; flex-shrink: 0;
      }
      .eu-body { padding: 1.2rem 1.4rem; }
      .eu-label {
        font-size: 11px; font-weight: 600; letter-spacing: .07em;
        text-transform: uppercase; color: var(--muted, #6b7280);
        margin: 0 0 8px;
      }
      .eu-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-bottom: 1.1rem; }
      .eu-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; margin-bottom: 1.1rem; }
      .eu-role-btn, .eu-status-btn {
        display: flex; align-items: center; gap: 7px;
        padding: 9px 11px; border-radius: 8px; cursor: pointer; font-size: 13px;
        border: 1px solid var(--border, #e5e7eb);
        background: var(--surface, #f9fafb);
        color: var(--text, #111);
        transition: background .15s, border-color .15s;
      }
      .eu-role-btn:hover, .eu-status-btn:hover { background: var(--surface-hover, #f3f4f6); }
      .eu-active-info    { border: 2px solid #3b82f6 !important; background: #eff6ff !important; color: #1d4ed8 !important; }
      .eu-active-success { border: 2px solid #22c55e !important; background: #f0fdf4 !important; color: #15803d !important; }
      .eu-active-danger  { border: 2px solid #ef4444 !important; background: #fef2f2 !important; color: #b91c1c !important; }
      .eu-active-warning { border: 2px solid #f59e0b !important; background: #fffbeb !important; color: #b45309 !important; }
      .eu-active-secondary { border: 2px solid #6b7280 !important; background: #f9fafb !important; color: #374151 !important; }
      .eu-footer {
        display: flex; gap: 8px;
        padding: 1rem 1.4rem;
        border-top: 1px solid var(--border, #e5e7eb);
      }
      .eu-btn-danger {
        flex: 1; padding: 9px;
        border-radius: 8px;
        border: 1px solid #fca5a5;
        background: none; color: #dc2626; cursor: pointer; font-size: 13px;
        display: flex; align-items: center; justify-content: center; gap: 6px;
      }
      .eu-btn-danger:hover { background: #fef2f2; }
      .eu-btn-save {
        flex: 2.5; padding: 9px;
        border-radius: 8px; border: none;
        background: var(--primary, #2563eb);
        color: #fff; cursor: pointer; font-size: 13px; font-weight: 600;
      }
      .eu-btn-save:hover { background: #1d4ed8; }
      .eu-btn-close {
        background: none; border: none; cursor: pointer;
        color: var(--muted, #6b7280); font-size: 18px; padding: 4px;
        border-radius: 6px; display: flex; align-items: center;
      }
      .eu-btn-close:hover { background: var(--surface, #f3f4f6); }
      .eu-select {
        width: 100%; margin-bottom: 1.1rem;
        padding: 9px 11px; font-size: 13px;
        border-radius: 8px; border: 1px solid var(--border, #e5e7eb);
        background: var(--surface, #f9fafb); color: var(--text, #111);
      }
      .eu-notes {
        width: 100%; resize: vertical; min-height: 64px;
        margin-bottom: 1.1rem; padding: 9px 11px; font-size: 13px;
        border-radius: 8px; border: 1px solid var(--border, #e5e7eb);
        background: var(--surface, #f9fafb); color: var(--text, #111);
        font-family: inherit; box-sizing: border-box;
      }
    </style>

    <div id="modal-edit-user-box">
      <div class="eu-header">
        <div style="display:flex;align-items:center;gap:10px">
          <div class="eu-avatar">${initials}</div>
          <div>
            <div style="font-weight:600;font-size:15px">${u.name}</div>
            <div style="font-size:12px;color:var(--muted,#6b7280)">${u.email}</div>
          </div>
        </div>
        <button class="eu-btn-close" onclick="closeEditUserModal()">
          <i class="ti ti-x"></i>
        </button>
      </div>

      <div class="eu-body">
        <!-- Cargo -->
        <p class="eu-label">Cargo / hierarquia</p>
        <div class="eu-grid-2" id="eu-roles">${roleButtons}</div>

        <!-- Equipe -->
        <p class="eu-label">Equipe</p>
        <select class="eu-select" id="eu-team-sel">${teamOptions}</select>

        <!-- Status -->
        <p class="eu-label">Status da conta</p>
        <div class="eu-grid-3" id="eu-statuses">${statusButtons}</div>

        <!-- Observação -->
        <p class="eu-label">Observação (opcional)</p>
        <textarea class="eu-notes" id="eu-notes-input" placeholder="Motivo da alteração…"></textarea>
      </div>

      <div class="eu-footer">
        <button class="eu-btn-danger" onclick="deleteUserConfirm(${u.id})">
          <i class="ti ti-trash"></i> Excluir
        </button>
        <button class="eu-btn-save" onclick="saveEditUser(${u.id})">
          Salvar alterações
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Fecha ao clicar fora
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeEditUserModal();
  });
}

// Seleciona opção nos grupos de botões do modal
function euSelect(btn, group) {
  const container = document.getElementById(group === 'role' ? 'eu-roles' : 'eu-statuses');
  container.querySelectorAll('button').forEach(b => {
    // Remove todas as classes de ativo
    ['eu-active-info','eu-active-success','eu-active-danger','eu-active-warning','eu-active-secondary']
      .forEach(cls => b.classList.remove(cls));
    b.style.borderWidth = '1px';
  });

  const colorMap = {
    active: 'success', suspended: 'danger', pending: 'warning',
    superadmin: 'warning', professor: 'info', lider: 'success', membro: 'secondary'
  };
  const color = btn.dataset.color || colorMap[btn.dataset.value] || 'info';
  btn.classList.add(`eu-active-${color}`);
  btn.style.borderWidth = '2px';
}

function closeEditUserModal() {
  document.getElementById('modal-edit-user-overlay')?.remove();
}

function saveEditUser(id) {
  const u = users.find(u => u.id === id);
  if (!u) return;

  // Lê cargo selecionado
  const roleBtn = document.querySelector('#eu-roles button.eu-active-info, #eu-roles button[class*="eu-active"]');
  if (roleBtn) u.hier = roleBtn.dataset.value;

  // Lê equipe
  const teamSel = document.getElementById('eu-team-sel');
  if (teamSel) u.team = teamSel.value;

  // Lê status
  const statusBtn = document.querySelector('#eu-statuses button[class*="eu-active"]');
  if (statusBtn) u.status = statusBtn.dataset.value;

  // Nota (opcional — pode salvar em u.notes se quiser)
  const notes = document.getElementById('eu-notes-input')?.value.trim();

  closeEditUserModal();

  const statusLabel = { active: 'ativo', suspended: 'suspenso', pending: 'pendente' };
  toast(`${u.name} atualizado com sucesso.`);
  addNotif(
    'Conta atualizada',
    `${u.name} agora é ${u.hier} — status: ${statusLabel[u.status] || u.status}.${notes ? ' Obs: ' + notes : ''}`,
    u.team
  );

  renderAdmin();
  renderTeam();
}

function deleteUserConfirm(id) {
  const u = users.find(u => u.id === id);
  if (!u) return;
  if (!confirm(`Tem certeza que deseja excluir a conta de ${u.name}? Essa ação não pode ser desfeita.`)) return;

  users = users.filter(u => u.id !== id);
  closeEditUserModal();
  toast(`Conta de ${u.name} excluída.`);
  addNotif('Conta excluída', `${u.name} foi removido do sistema.`, 'redacao');
  renderAdmin();
  renderTeam();
}

// ─── Criar usuário ────────────────────────────────────────────────────────────

function createUser() {
  const name  = document.getElementById('cu-name').value.trim();
  const email = document.getElementById('cu-email').value.trim();
  const pass  = document.getElementById('cu-pass').value;
  const team  = document.getElementById('cu-team').value;
  let   hier  = document.getElementById('cu-hier').value;

  if (CU.hier === 'professor' && hier === 'professor') hier = 'membro';

  if (!name || !email || !pass) return toast('Preencha todos os campos.');

  if (!email.endsWith('@aluno.ifnmg.edu.br')) {
    return toast('O email deve ser obrigatoriamente @aluno.ifnmg.edu.br');
  }

  if (users.find(u => u.email === email)) return toast('Email já cadastrado.');

  users.push({ id: Date.now(), name, email, pass, team, hier, status: 'active' });
  closeModal('m-user');
  ['cu-name', 'cu-email', 'cu-pass'].forEach(id => document.getElementById(id).value = '');

  toast('Login criado para ' + name + '!');
  addNotif('Novo membro', name + ' entrou para a equipe de ' + (TEAMS[team]?.name || ''), team);

  renderAdmin();
  renderTeam();
}