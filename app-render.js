function renderBarbers() {
  document.getElementById('barbersGrid').innerHTML = state.barbers.map(b => {
    const sales = barberSales(b.id); const revenue=sales.reduce((a,s)=>a+Number(s.amount),0); const commission=revenue*b.commission/100;
    const todayCount = state.sales.filter(s => s.barberId===b.id && s.date===localDate(new Date())).length;
    return `<article class="barber-card"><div class="barber-card-head"><div class="barber-profile"><div class="avatar" style="background:${b.color}">${initials(b.name)}</div><div><h3>${escapeHtml(b.name)}</h3><p>${escapeHtml(b.specialty || 'Barbero')}</p></div></div><span class="status ${b.active?'completed':'cancelled'}">${b.active?'Activo':'Inactivo'}</span></div><div class="barber-stats"><div class="barber-stat"><small>Servicios mes</small><strong>${sales.length}</strong></div><div class="barber-stat"><small>Ventas</small><strong>${CLP.format(revenue)}</strong></div><div class="barber-stat"><small>Hoy</small><strong>${todayCount}</strong></div></div><div class="card-footer"><span class="commission-label">Comisión ${b.commission}% · <strong>${CLP.format(commission)}</strong></span><button class="text-button" data-action="edit-barber" data-id="${b.id}">Editar</button></div></article>`;
  }).join('');
}

function renderClients() {
  const q = document.getElementById('clientSearch').value.trim().toLowerCase();
  const filtered = state.clients.filter(c => `${c.name} ${c.phone} ${c.email}`.toLowerCase().includes(q));
  document.getElementById('clientsTable').innerHTML = filtered.length ? filtered.map(c => {
    const sales = clientSales(c.id).sort((a,b)=>b.date.localeCompare(a.date)); const total=sales.reduce((a,s)=>a+Number(s.amount),0);
    return `<tr><td><div class="person-cell"><div class="avatar" style="background:#6b7280">${initials(c.name)}</div><div><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml(c.email || 'Sin email')}</small></div></div></td><td>${escapeHtml(c.phone)}</td><td>${sales.length}</td><td>${sales[0]?formatDate(sales[0].date):'—'}</td><td><strong>${CLP.format(total)}</strong></td><td><div class="table-actions"><button class="table-action" data-action="book-client" data-id="${c.id}" title="Agendar">◷</button><button class="table-action" data-action="edit-client" data-id="${c.id}" title="Editar">✎</button><button class="table-action" data-action="delete-client" data-id="${c.id}" title="Eliminar">×</button></div></td></tr>`;
  }).join('') : `<tr><td colspan="6">${empty('Sin resultados','No encontramos clientes con ese criterio.')}</td></tr>`;
}

function renderSales() {
  const monthSales = salesForMonth(); const monthTotal=monthSales.reduce((a,s)=>a+Number(s.amount),0); const avg=monthSales.length?monthTotal/monthSales.length:0;
  document.getElementById('salesSummary').innerHTML = `<div class="summary-chip"><small>Mes actual</small><strong>${CLP.format(monthTotal)}</strong></div><div class="summary-chip"><small>Servicios</small><strong>${monthSales.length}</strong></div><div class="summary-chip"><small>Ticket promedio</small><strong>${CLP.format(avg)}</strong></div>`;
  const items=[...state.sales].sort((a,b)=>`${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)).slice(0,120);
  document.getElementById('salesTable').innerHTML = items.length ? items.map(s => `<tr><td>${formatDate(s.date)}<br><small>${s.time||''}</small></td><td>${escapeHtml(getClient(s.clientId).name)}</td><td>${escapeHtml(getService(s.serviceId).name)}</td><td>${escapeHtml(getBarber(s.barberId).name)}</td><td>${escapeHtml(s.paymentMethod||'—')}</td><td><strong>${CLP.format(s.amount)}</strong></td><td><div class="table-actions"><button class="table-action" data-action="delete-sale" data-id="${s.id}" title="Eliminar">×</button></div></td></tr>`).join('') : `<tr><td colspan="7">${empty('Sin ventas','Registra el primer servicio realizado.')}</td></tr>`;
}

function upcomingReminders() {
  const now = new Date(); const limit = new Date(now.getTime()+24*60*60*1000);
  return state.appointments.filter(a => ['confirmed','pending'].includes(a.status) && fullDateTime(a)>=now && fullDateTime(a)<=limit).sort((a,b)=>fullDateTime(a)-fullDateTime(b));
}
function renderReminders() {
  const pending = upcomingReminders().filter(a => !state.reminders.some(r=>r.appointmentId===a.id));
  document.getElementById('pendingReminders').innerHTML = pending.length ? pending.map(a => {
    const c=getClient(a.clientId), s=getService(a.serviceId);
    return `<div class="reminder-item"><div class="reminder-copy"><strong>${escapeHtml(c.name)} · ${a.time}</strong><span>${escapeHtml(s.name)} · ${formatDate(a.date)} · ${escapeHtml(c.phone)}</span></div><div class="reminder-actions"><button class="button success small" data-action="send-reminder" data-id="${a.id}">Enviar WhatsApp</button></div></div>`;
  }).join('') : empty('Todo al día','No hay recordatorios pendientes para las próximas 24 horas.');
  const sent=[...state.reminders].sort((a,b)=>b.sentAt.localeCompare(a.sentAt)).slice(0,15);
  document.getElementById('sentReminders').innerHTML = sent.length ? sent.map(r => {
    const a=state.appointments.find(x=>x.id===r.appointmentId); const c=a?getClient(a.clientId):{name:r.clientName||'Cliente'};
    return `<div class="reminder-item"><div class="reminder-copy"><strong>${escapeHtml(c.name)}</strong><span>Enviado ${new Intl.DateTimeFormat('es-CL',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(r.sentAt))}</span></div><span class="status completed">Enviado</span></div>`;
  }).join('') : empty('Sin envíos todavía','Los recordatorios enviados aparecerán aquí.');
}

function renderSettings() {
  document.getElementById('settingBusinessName').value = state.settings.businessName || '';
  document.getElementById('settingPhone').value = state.settings.phone || '';
  document.getElementById('settingAddress').value = state.settings.address || '';
  document.getElementById('settingHours').value = state.settings.hours || '';
  document.getElementById('servicesList').innerHTML = state.services.map(s => `<div class="settings-list-item"><div><strong>${escapeHtml(s.name)}</strong><small>${s.duration} min · ${s.active?'Activo':'Inactivo'}</small></div><strong>${CLP.format(s.price)}</strong><button class="text-button" data-action="edit-service" data-id="${s.id}">Editar</button></div>`).join('');
}

function empty(title, description) { return `<div class="empty-state"><strong>${title}</strong><span>${description}</span></div>`; }
function showToast(message) {
  const el=document.getElementById('toast'); el.textContent=message; el.classList.remove('hidden'); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>el.classList.add('hidden'),2600);
}
function showView(view) {
  currentView=view;
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===`${view}View`));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===view));
  const titles={dashboard:'Dashboard',agenda:'Agenda de horas',barbers:'Barberos',clients:'Clientes',sales:'Ventas y servicios',reminders:'Recordatorios',settings:'Configuración'};
  document.getElementById('viewTitle').textContent=titles[view];
  document.getElementById('sidebar').classList.remove('open');
}

function openModal(title, kicker, bodyHtml, onReady) {
  document.getElementById('modalTitle').textContent=title;
  document.getElementById('modalKicker').textContent=kicker;
  document.getElementById('modalBody').innerHTML=bodyHtml;
  document.getElementById('modalBackdrop').classList.remove('hidden');
  if (onReady) onReady();
}
function closeModal() { document.getElementById('modalBackdrop').classList.add('hidden'); document.getElementById('modalBody').innerHTML=''; }

function clientOptions(selected='') { return state.clients.map(c=>`<option value="${c.id}" ${c.id===selected?'selected':''}>${escapeHtml(c.name)}</option>`).join(''); }
function barberOptions(selected='') { return state.barbers.filter(b=>b.active || b.id===selected).map(b=>`<option value="${b.id}" ${b.id===selected?'selected':''}>${escapeHtml(b.name)}</option>`).join(''); }
function serviceOptions(selected='') { return state.services.filter(s=>s.active || s.id===selected).map(s=>`<option value="${s.id}" ${s.id===selected?'selected':''}>${escapeHtml(s.name)} · ${CLP.format(s.price)}</option>`).join(''); }
