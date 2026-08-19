function handleDelete(type,id) {
  const messages={appointment:'Eliminar esta cita?',client:'Eliminar este cliente? Sus ventas se conservarán.',sale:'Eliminar esta venta del registro?'};
  if(!confirm(messages[type])) return;
  if(type==='appointment') state.appointments=state.appointments.filter(x=>x.id!==id);
  if(type==='client') state.clients=state.clients.filter(x=>x.id!==id);
  if(type==='sale') state.sales=state.sales.filter(x=>x.id!==id);
  saveState('Registro eliminado.');
}

function handleGlobalClick(e) {
  const jump=e.target.closest('[data-jump]'); if(jump) return showView(jump.dataset.jump);
  const el=e.target.closest('[data-action]'); if(!el) return;
  const {action,id}=el.dataset;
  if(action==='edit-appointment') openAppointmentModal(id);
  if(action==='delete-appointment') handleDelete('appointment',id);
  if(action==='complete-appointment') completeAppointment(id);
  if(action==='edit-barber') openBarberModal(id);
  if(action==='edit-client') openClientModal(id);
  if(action==='delete-client') handleDelete('client',id);
  if(action==='book-client') openAppointmentModal(null,id);
  if(action==='delete-sale') handleDelete('sale',id);
  if(action==='edit-service') openServiceModal(id);
  if(action==='send-reminder') {
    const a=state.appointments.find(x=>x.id===id); if(!a) return;
    state.reminders.push({id:uid('rem'),appointmentId:a.id,clientName:getClient(a.clientId).name,sentAt:new Date().toISOString(),channel:'whatsapp'});
    saveState('Recordatorio marcado como enviado por WhatsApp.');
  }
}

document.querySelectorAll('.nav-item').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.view)));
document.addEventListener('click',handleGlobalClick);
document.getElementById('mobileMenuBtn').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
document.getElementById('modalClose').addEventListener('click',closeModal);
document.getElementById('modalBackdrop').addEventListener('click',e=>{ if(e.target.id==='modalBackdrop') closeModal(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });

document.getElementById('quickAppointmentBtn').addEventListener('click',()=>openAppointmentModal());
document.getElementById('agendaAddBtn').addEventListener('click',()=>openAppointmentModal());
document.getElementById('addBarberBtn').addEventListener('click',()=>openBarberModal());
document.getElementById('addClientBtn').addEventListener('click',()=>openClientModal());
document.getElementById('addSaleBtn').addEventListener('click',()=>openSaleModal());
document.getElementById('addServiceBtn').addEventListener('click',()=>openServiceModal());
document.getElementById('clientSearch').addEventListener('input',renderClients);
document.getElementById('salesChartYear').addEventListener('change',renderSalesChart);
document.getElementById('agendaBarberFilter').addEventListener('change',e=>{agendaBarber=e.target.value;renderAgenda();});
document.querySelectorAll('#agendaDateFilter .segment').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('#agendaDateFilter .segment').forEach(b=>b.classList.remove('active'));btn.classList.add('active');agendaRange=btn.dataset.range;renderAgenda();}));

document.getElementById('saveSettingsBtn').addEventListener('click',()=>{
  state.settings={businessName:settingBusinessName.value.trim()||'Barber Studio',phone:settingPhone.value.trim(),address:settingAddress.value.trim(),hours:settingHours.value.trim()};
  saveState('Configuración guardada.');
});
document.getElementById('seedResetBtn').addEventListener('click',()=>{
  if(!confirm('Esto restaurará todos los datos de demostración. ¿Continuar?')) return;
  state=seedState(); localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); renderAll(); showToast('Demo restaurada.');
});

document.getElementById('globalSearch').addEventListener('input',e=>{
  const q=e.target.value.trim().toLowerCase(); const box=document.getElementById('searchResults');
  if(q.length<2){box.classList.add('hidden');return;}
  const clients=state.clients.filter(c=>`${c.name} ${c.phone}`.toLowerCase().includes(q)).slice(0,5);
  const appointments=state.appointments.filter(a=>getClient(a.clientId).name.toLowerCase().includes(q)).slice(0,4);
  const html=[...clients.map(c=>({type:'client',id:c.id,title:c.name,sub:`Cliente · ${c.phone}`})),...appointments.map(a=>({type:'appointment',id:a.id,title:getClient(a.clientId).name,sub:`Cita · ${formatDateTime(a)}`}))];
  box.innerHTML=html.length?html.map(r=>`<button class="search-result" data-search-type="${r.type}" data-search-id="${r.id}"><span><strong>${escapeHtml(r.title)}</strong><small>${escapeHtml(r.sub)}</small></span><span>→</span></button>`).join(''):'<div class="empty-state">Sin resultados.</div>';
  box.classList.remove('hidden');
});
document.getElementById('searchResults').addEventListener('click',e=>{
  const btn=e.target.closest('[data-search-type]'); if(!btn)return;
  document.getElementById('searchResults').classList.add('hidden'); document.getElementById('globalSearch').value='';
  if(btn.dataset.searchType==='client'){showView('clients');document.getElementById('clientSearch').value=getClient(btn.dataset.searchId).name;renderClients();}
  else {showView('agenda'); agendaRange='all'; document.querySelectorAll('#agendaDateFilter .segment').forEach(b=>b.classList.toggle('active',b.dataset.range==='all')); renderAgenda();}
});

renderAll();
showView('dashboard');
