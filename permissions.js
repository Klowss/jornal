// ═══════════════════════════════════════
//  PERMISSIONS
// ═══════════════════════════════════════
function can(act) {
  if(!CU) return false;
  const h = CU.hier;
  const p = {
    createEvent:  ['superadmin','professor','lider'], 
    createTask:   ['superadmin','professor','lider'], 
    moveTask:     ['superadmin','professor','lider','membro'],
    deleteTask:   ['superadmin','professor'],
    manageUsers:  ['superadmin','professor'],
    suspendUser:  ['superadmin'],
    seeAllTasks:  ['superadmin','professor','lider'],
    seeAllEvents: ['superadmin','professor','lider','membro'],
    changeColors: ['superadmin','professor'],
  };
  return (p[act]||[]).includes(h);
}