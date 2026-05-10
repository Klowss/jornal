// ═══════════════════════════════════════
//  NOTIFICATIONS
// ═══════════════════════════════════════
function renderNotifs() {
  updateNotifDot();
  const elP = document.getElementById('notif-list-pessoal');
  const elG = document.getElementById('notif-list-geral');
  
  const myNotifs = notifs.filter(n => n.user === CU.name);
  const geralNotifs = notifs.filter(n => !n.user);

  const buildHTML = (lista) => {
     if(!lista.length) return '<div class="empty py-3"><p>Nenhuma notificação</p></div>';
     return lista.map(n=>{
        const t=TEAMS[n.team]||{color:'var(--green)',bg:'var(--green-light)'};
        return `<div class="notif-item ${n.read?'':'unread'}" onclick="readNotif(${n.id})">
          <div class="notif-icon" style="background:${t.bg};color:${t.color}">📣</div>
          <div>
            <div class="notif-title">${n.title}</div>
            <div class="notif-text">${n.text}</div>
            <div class="notif-time">${n.time}</div>
          </div>
        </div>`;
      }).join('');
  }

  elP.innerHTML = buildHTML(myNotifs);
  elG.innerHTML = buildHTML(geralNotifs);
}
function readNotif(id){const n=notifs.find(n=>n.id===id);if(n){n.read=true;renderNotifs();}}
function markAllRead(){notifs.forEach(n=>n.read=true);renderNotifs();toast('Todas lidas.');}

function addNotif(title, text, team, user=null) {
  notifs.unshift({id:Date.now(),title,text,time:'Agora',team,read:false, user});
  updateNotifDot();
  
  if(user) {
    const u = users.find(x => x.name === user);
    if(u) {
       setTimeout(() => {
          toast(`📩 Email de notificação enviado para: ${u.email}`);
       }, 1500);
    }
  }
}
function updateNotifDot(){const dot=document.getElementById('notif-dot');dot.style.display=notifs.filter(n=>!n.read && (n.user === CU.name || !n.user)).length?'block':'none';}