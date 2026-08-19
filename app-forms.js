function appointmentForm(existing={}, presetClientId='') {
  const baseDate = existing.date || localDate(new Date());
  return `<div class="form-grid">
    <label>Cliente<select id="fClient">${clientOptions(existing.clientId||presetClientId)}</select></label>
    <label>Barbero<select id="fBarber">${barberOptions(existing.barberId)}</select></label>
    <label>Servicio<select id="fService">${serviceOptions(existing.serviceId)}</select></label>
    <label>Estado<select id="fStatus"><option value="confirmed" ${existing.status==='confirmed'?'selected':''}>Confirmada</option><option value="pending" ${existing.status==='pending'?'selected':''}>Pendiente</option><option value="completed" ${existing.status==='completed'?'selected':''}>Completada</option><option value="cancelled" ${existing.status==='cancelled'?'selected':''}>Cancelada</option></select></label>
    <label>Fecha<input id="fDate" type="date" value="${baseDate}" /></label>
    <label>Hora<input id="fTime" type="time" value="${existing.time||'10:00'}" /></label>
    <label class="full">Notas<textarea id="fNotes" placeholder="Indicaciones del cliente...">${escapeHtml(existing.notes||'')}</textarea></label>
    <div class="form-actions"><button class="button secondary" id="cancelModalBtn">Cancelar</button><button class="button primary" id="saveAppointmentBtn">Guardar cita</button></div>
  </div>`;
}
function openAppointmentModal(id=null, presetClientId='') {
  const existing=id?state.appointments.find(a=>a.id===id):null;
  openModal(existing?'Editar cita':'Nueva cita','Agenda',appointmentForm(existing||{},presetClientId),()=>{
    document.getElementById('cancelModalBtn').addEventListener('click',closeModal);
    document.getElementById('saveAppointmentBtn').addEventListener('click',()=>{
      const data={clientId:fClient.value,barberId:fBarber.value,serviceId:fService.value,status:fStatus.value,date:fDate.value,time:fTime.value,notes:fNotes.value.trim()};
      if(!data.clientId||!data.barberId||!data.serviceId||!data.date||!data.time) return showToast('Completa los campos obligatorios.');
      const conflict=state.appointments.some(a=>a.id!==id&&a.barberId===data.barberId&&a.date===data.date&&a.time===data.time&&a.status!=='cancelled');
      if(conflict) return showToast('Ese barbero ya tiene una cita a esa hora.');
      if(existing) Object.assign(existing,data); else state.appointments.push({id:uid('apt'),...data});
      closeModal(); saveState(existing?'Cita actualizada.':'Cita agendada correctamente.');
    });
  });
}

function openBarberModal(id=null) {
  const b=id?state.barbers.find(x=>x.id===id):{};
  openModal(id?'Editar barbero':'Agregar barbero','Equipo',`<div class="form-grid"><label>Nombre<input id="bName" value="${escapeHtml(b.name||'')}" /></label><label>Especialidad<input id="bSpecialty" value="${escapeHtml(b.specialty||'')}" /></label><label>Teléfono<input id="bPhone" value="${escapeHtml(b.phone||'')}" /></label><label>Comisión %<input id="bCommission" type="number" min="0" max="100" value="${b.commission??40}" /></label><label>Color de identificación<input id="bColor" type="color" value="${b.color||'#6b7280'}" /></label><label>Estado<select id="bActive"><option value="true" ${b.active!==false?'selected':''}>Activo</option><option value="false" ${b.active===false?'selected':''}>Inactivo</option></select></label><div class="form-actions"><button class="button secondary" id="cancelModalBtn">Cancelar</button><button class="button primary" id="saveBarberBtn">Guardar</button></div></div>`,()=>{
    cancelModalBtn.addEventListener('click',closeModal);
    saveBarberBtn.addEventListener('click',()=>{
      if(!bName.value.trim()) return showToast('Ingresa el nombre del barbero.');
      const data={name:bName.value.trim(),specialty:bSpecialty.value.trim(),phone:bPhone.value.trim(),commission:Number(bCommission.value)||0,color:bColor.value,active:bActive.value==='true'};
      if(id) Object.assign(b,data); else state.barbers.push({id:uid('bar'),...data});
      closeModal(); saveState(id?'Barbero actualizado.':'Barbero agregado.');
    });
  });
}

function openClientModal(id=null) {
  const c=id?state.clients.find(x=>x.id===id):{};
  openModal(id?'Editar cliente':'Nuevo cliente','Clientes',`<div class="form-grid"><label>Nombre<input id="cName" value="${escapeHtml(c.name||'')}" /></label><label>Teléfono<input id="cPhone" value="${escapeHtml(c.phone||'')}" /></label><label class="full">Email<input id="cEmail" type="email" value="${escapeHtml(c.email||'')}" /></label><label class="full">Notas<textarea id="cNotes">${escapeHtml(c.notes||'')}</textarea></label><div class="form-actions"><button class="button secondary" id="cancelModalBtn">Cancelar</button><button class="button primary" id="saveClientBtn">Guardar</button></div></div>`,()=>{
    cancelModalBtn.addEventListener('click',closeModal);
    saveClientBtn.addEventListener('click',()=>{
      if(!cName.value.trim()||!cPhone.value.trim()) return showToast('Nombre y teléfono son obligatorios.');
      const data={name:cName.value.trim(),phone:cPhone.value.trim(),email:cEmail.value.trim(),notes:cNotes.value.trim()};
      if(id) Object.assign(c,data); else state.clients.push({id:uid('cli'),...data});
      closeModal(); saveState(id?'Cliente actualizado.':'Cliente agregado.');
    });
  });
}

function openSaleModal(preset={}) {
  openModal('Registrar servicio','Ventas',`<div class="form-grid"><label>Cliente<select id="sClient">${clientOptions(preset.clientId||'')}</select></label><label>Barbero<select id="sBarber">${barberOptions(preset.barberId||'')}</select></label><label>Servicio<select id="sService">${serviceOptions(preset.serviceId||'')}</select></label><label>Medio de pago<select id="sPayment"><option>Débito</option><option>Crédito</option><option>Efectivo</option><option>Transferencia</option></select></label><label>Fecha<input id="sDate" type="date" value="${preset.date||localDate(new Date())}" /></label><label>Hora<input id="sTime" type="time" value="${preset.time||localTime(new Date())}" /></label><label class="full">Monto<input id="sAmount" type="number" min="0" /></label><div class="form-actions"><button class="button secondary" id="cancelModalBtn">Cancelar</button><button class="button primary" id="saveSaleBtn">Registrar venta</button></div></div>`,()=>{
    const syncAmount=()=>{ const svc=getService(sService.value); sAmount.value=svc.price; };
    sService.addEventListener('change',syncAmount); syncAmount(); cancelModalBtn.addEventListener('click',closeModal);
    saveSaleBtn.addEventListener('click',()=>{
      const amount=Number(sAmount.value); if(!amount) return showToast('Ingresa un monto válido.');
      state.sales.push({id:uid('sale'),clientId:sClient.value,barberId:sBarber.value,serviceId:sService.value,paymentMethod:sPayment.value,date:sDate.value,time:sTime.value,amount});
      closeModal(); saveState('Servicio y venta registrados.');
    });
  });
}

function openServiceModal(id=null) {
  const s=id?state.services.find(x=>x.id===id):{};
  openModal(id?'Editar servicio':'Nuevo servicio','Configuración',`<div class="form-grid"><label class="full">Nombre<input id="vName" value="${escapeHtml(s.name||'')}" /></label><label>Precio<input id="vPrice" type="number" min="0" value="${s.price||''}" /></label><label>Duración (min)<input id="vDuration" type="number" min="5" value="${s.duration||45}" /></label><label class="full">Estado<select id="vActive"><option value="true" ${s.active!==false?'selected':''}>Activo</option><option value="false" ${s.active===false?'selected':''}>Inactivo</option></select></label><div class="form-actions"><button class="button secondary" id="cancelModalBtn">Cancelar</button><button class="button primary" id="saveServiceBtn">Guardar</button></div></div>`,()=>{
    cancelModalBtn.addEventListener('click',closeModal);
    saveServiceBtn.addEventListener('click',()=>{
      if(!vName.value.trim()||!Number(vPrice.value)) return showToast('Completa nombre y precio.');
      const data={name:vName.value.trim(),price:Number(vPrice.value),duration:Number(vDuration.value)||45,active:vActive.value==='true'};
      if(id) Object.assign(s,data); else state.services.push({id:uid('svc'),...data}); closeModal(); saveState(id?'Servicio actualizado.':'Servicio agregado.');
    });
  });
}

function completeAppointment(id) {
  const a=state.appointments.find(x=>x.id===id); if(!a) return;
  if(a.status==='completed') return showToast('Esta cita ya está completada.');
  a.status='completed';
  const service=getService(a.serviceId);
  const existingSale=state.sales.some(s=>s.appointmentId===a.id);
  if(!existingSale) state.sales.push({id:uid('sale'),appointmentId:a.id,clientId:a.clientId,barberId:a.barberId,serviceId:a.serviceId,date:a.date,time:a.time,amount:service.price,paymentMethod:'Débito'});
  saveState('Cita completada y venta registrada.');
}
