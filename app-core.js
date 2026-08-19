const STORAGE_KEY = 'corextec_barber_demo_v1';
const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const DATE_FMT = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
const DATETIME_FMT = new Intl.DateTimeFormat('es-CL', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const uid = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const pad = n => String(n).padStart(2, '0');
const localDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const localTime = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const addDays = (date, days) => { const d = new Date(date); d.setDate(d.getDate() + days); return d; };
const monthKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const startOfToday = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
const escapeHtml = str => String(str ?? '').replace(/[&<>'"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[m]));

function seedState() {
  const now = new Date();
  const today = localDate(now);
  const yesterday = localDate(addDays(now, -1));
  const tomorrow = localDate(addDays(now, 1));
  const inTwo = localDate(addDays(now, 2));
  const currentYear = now.getFullYear();
  const m = now.getMonth();

  const serviceIds = { cut: 'svc_cut', beard: 'svc_beard', combo: 'svc_combo', premium: 'svc_premium' };
  const barberIds = { matias: 'bar_matias', diego: 'bar_diego', sebastian: 'bar_sebastian', lucas: 'bar_lucas' };
  const clientIds = { felipe: 'cli_felipe', cristobal: 'cli_cristobal', nicolas: 'cli_nicolas', benjamin: 'cli_benjamin', tomas: 'cli_tomas', martin: 'cli_martin' };

  const services = [
    { id: serviceIds.cut, name: 'Corte clásico', price: 15000, duration: 45, active: true },
    { id: serviceIds.beard, name: 'Perfilado de barba', price: 10000, duration: 30, active: true },
    { id: serviceIds.combo, name: 'Corte + barba', price: 22000, duration: 60, active: true },
    { id: serviceIds.premium, name: 'Servicio premium', price: 28000, duration: 75, active: true }
  ];

  const barbers = [
    { id: barberIds.matias, name: 'Matías Rojas', specialty: 'Fade & clásicos', phone: '+56 9 6123 4588', commission: 45, active: true, color: '#8b6d3f' },
    { id: barberIds.diego, name: 'Diego Soto', specialty: 'Barba & grooming', phone: '+56 9 7934 0211', commission: 45, active: true, color: '#4f6b8b' },
    { id: barberIds.sebastian, name: 'Sebastián Vera', specialty: 'Cortes modernos', phone: '+56 9 8330 1924', commission: 40, active: true, color: '#596b53' },
    { id: barberIds.lucas, name: 'Lucas Muñoz', specialty: 'Diseño & freestyle', phone: '+56 9 7245 1660', commission: 40, active: true, color: '#765b69' }
  ];

  const clients = [
    { id: clientIds.felipe, name: 'Felipe González', phone: '+56 9 5012 1122', email: 'felipe@email.cl', notes: 'Prefiere fade medio.' },
    { id: clientIds.cristobal, name: 'Cristóbal Díaz', phone: '+56 9 6112 3849', email: 'cristobal@email.cl', notes: '' },
    { id: clientIds.nicolas, name: 'Nicolás Paredes', phone: '+56 9 7772 1020', email: 'nicolas@email.cl', notes: 'Cliente frecuente.' },
    { id: clientIds.benjamin, name: 'Benjamín Silva', phone: '+56 9 9008 4412', email: '', notes: '' },
    { id: clientIds.tomas, name: 'Tomás Reyes', phone: '+56 9 4881 9320', email: 'tomas@email.cl', notes: '' },
    { id: clientIds.martin, name: 'Martín Castro', phone: '+56 9 5310 7744', email: '', notes: '' }
  ];

  const appointments = [
    { id: 'apt_1', clientId: clientIds.felipe, barberId: barberIds.matias, serviceId: serviceIds.combo, date: today, time: '10:00', status: 'confirmed', notes: '' },
    { id: 'apt_2', clientId: clientIds.cristobal, barberId: barberIds.diego, serviceId: serviceIds.cut, date: today, time: '11:30', status: 'confirmed', notes: '' },
    { id: 'apt_3', clientId: clientIds.nicolas, barberId: barberIds.sebastian, serviceId: serviceIds.premium, date: today, time: '13:00', status: 'pending', notes: '' },
    { id: 'apt_4', clientId: clientIds.benjamin, barberId: barberIds.matias, serviceId: serviceIds.cut, date: today, time: '15:30', status: 'confirmed', notes: '' },
    { id: 'apt_5', clientId: clientIds.tomas, barberId: barberIds.lucas, serviceId: serviceIds.combo, date: tomorrow, time: '10:30', status: 'confirmed', notes: '' },
    { id: 'apt_6', clientId: clientIds.martin, barberId: barberIds.diego, serviceId: serviceIds.beard, date: inTwo, time: '17:00', status: 'pending', notes: '' }
  ];

  const sales = [];
  const paymentMethods = ['Débito', 'Crédito', 'Efectivo', 'Transferencia'];
  const combos = [serviceIds.cut, serviceIds.combo, serviceIds.beard, serviceIds.premium];
  const barberOrder = Object.values(barberIds);
  const clientOrder = Object.values(clientIds);

  let saleCounter = 1;
  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const targetMonth = new Date(currentYear, m - monthOffset, 1);
    const count = 8 + (5 - monthOffset) * 2;
    for (let i = 0; i < count; i++) {
      const day = Math.min(27, 2 + ((i * 3 + monthOffset) % 26));
      const saleDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), day, 11 + (i % 7), 0);
      const serviceId = combos[(i + monthOffset) % combos.length];
      const service = services.find(s => s.id === serviceId);
      const barberId = barberOrder[(i * 2 + monthOffset) % barberOrder.length];
      const clientId = clientOrder[(i + monthOffset * 2) % clientOrder.length];
      sales.push({
        id: `sale_${saleCounter++}`,
        clientId,
        barberId,
        serviceId,
        date: localDate(saleDate),
        time: localTime(saleDate),
        amount: service.price,
        paymentMethod: paymentMethods[(i + monthOffset) % paymentMethods.length]
      });
    }
  }

  sales.push(
    { id: `sale_${saleCounter++}`, clientId: clientIds.felipe, barberId: barberIds.matias, serviceId: serviceIds.cut, date: yesterday, time: '16:10', amount: 15000, paymentMethod: 'Débito' },
    { id: `sale_${saleCounter++}`, clientId: clientIds.nicolas, barberId: barberIds.sebastian, serviceId: serviceIds.combo, date: yesterday, time: '17:20', amount: 22000, paymentMethod: 'Efectivo' }
  );

  return {
    settings: { businessName: 'Barber Studio', phone: '+56 9 5555 1234', address: 'Av. Central 245, Curicó', hours: 'Lun–Sáb 09:30 a 20:00' },
    services,
    barbers,
    clients,
    appointments,
    sales,
    reminders: []
  };
}

let state = loadState();
let currentView = 'dashboard';
let agendaRange = 'today';
let agendaBarber = 'all';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) { console.warn('No se pudo cargar el almacenamiento local', err); }
  const initial = seedState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}
function saveState(message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (message) showToast(message);
  renderAll();
}

function getService(id) { return state.services.find(x => x.id === id) || { name: 'Servicio', price: 0, duration: 0 }; }
function getBarber(id) { return state.barbers.find(x => x.id === id) || { name: 'Sin asignar', color: '#6b7280', commission: 0 }; }
function getClient(id) { return state.clients.find(x => x.id === id) || { name: 'Cliente', phone: '' }; }
function initials(name) { return name.split(' ').slice(0,2).map(x => x[0]).join('').toUpperCase(); }
function fullDateTime(item) { return new Date(`${item.date}T${item.time || '00:00'}:00`); }
function isSameMonth(dateString, base = new Date()) { const d = new Date(`${dateString}T12:00:00`); return d.getFullYear() === base.getFullYear() && d.getMonth() === base.getMonth(); }
function formatDate(dateString) { return DATE_FMT.format(new Date(`${dateString}T12:00:00`)); }
function formatDateTime(item) { return DATETIME_FMT.format(fullDateTime(item)); }
function statusLabel(status) { return ({ confirmed:'Confirmada', completed:'Completada', pending:'Pendiente', cancelled:'Cancelada' })[status] || status; }

function salesForMonth(base = new Date()) { return state.sales.filter(s => isSameMonth(s.date, base)); }
function barberSales(barberId, monthOnly = true) { return state.sales.filter(s => s.barberId === barberId && (!monthOnly || isSameMonth(s.date))); }
function clientSales(clientId) { return state.sales.filter(s => s.clientId === clientId); }

function renderAll() {
  renderBrand();
  renderDashboard();
  renderAgenda();
  renderBarbers();
  renderClients();
  renderSales();
  renderReminders();
  renderSettings();
  populateFilters();
}

function renderBrand() {
  document.getElementById('brandName').textContent = state.settings.businessName || 'Barber Studio';
  document.getElementById('todayLabel').textContent = new Intl.DateTimeFormat('es-CL', { weekday:'long', day:'numeric', month:'long' }).format(new Date());
}

function renderDashboard() {
  const now = new Date();
  const monthSales = salesForMonth(now);
  const monthRevenue = monthSales.reduce((a,s) => a + Number(s.amount || 0), 0);
  const today = localDate(now);
  const cutsToday = state.sales.filter(s => s.date === today).length;
  const appointmentsToday = state.appointments.filter(a => a.date === today && a.status !== 'cancelled').length;
  const avgTicket = monthSales.length ? monthRevenue / monthSales.length : 0;
  const priorBase = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const priorRevenue = salesForMonth(priorBase).reduce((a,s) => a + Number(s.amount || 0), 0);
  const delta = priorRevenue ? Math.round(((monthRevenue - priorRevenue) / priorRevenue) * 100) : 0;

  document.getElementById('dashboardMetrics').innerHTML = [
    ['$', 'Ventas del mes', CLP.format(monthRevenue), `${delta >= 0 ? '+' : ''}${delta}% vs. mes anterior`],
    ['✂', 'Servicios hoy', cutsToday, 'Servicios registrados'],
    ['◷', 'Citas de hoy', appointmentsToday, `${state.appointments.filter(a => a.date === today && a.status === 'confirmed').length} confirmadas`],
    ['♙', 'Clientes', state.clients.length, 'Base total'],
    ['↗', 'Ticket promedio', CLP.format(avgTicket), 'Promedio del mes']
  ].map((m,i) => `<article class="metric-card"><div class="metric-icon">${m[0]}</div><small>${m[1]}</small><span class="metric-value">${m[2]}</span><span class="metric-delta ${i===0 && delta < 0 ? 'neutral' : i > 0 ? 'neutral' : ''}">${m[3]}</span></article>`).join('');

  renderSalesChart();
  renderServiceDonut();

  const upcoming = state.appointments
    .filter(a => a.date === today && a.status !== 'cancelled')
    .sort((a,b) => a.time.localeCompare(b.time))
    .slice(0,5);
  document.getElementById('todayAppointments').innerHTML = upcoming.length ? upcoming.map(a => {
    const client = getClient(a.clientId), service = getService(a.serviceId), barber = getBarber(a.barberId);
    return `<div class="timeline-item"><div class="time-badge">${a.time}</div><div><strong>${escapeHtml(client.name)}</strong><small>${escapeHtml(service.name)} · ${escapeHtml(barber.name)}</small></div><span class="status ${a.status}">${statusLabel(a.status)}</span></div>`;
  }).join('') : empty('Sin citas para hoy', 'Agrega una nueva cita para comenzar.');

  const ranking = state.barbers.filter(b => b.active).map(b => {
    const sales = barberSales(b.id);
    return { ...b, revenue: sales.reduce((a,s) => a + Number(s.amount), 0), cuts: sales.length };
  }).sort((a,b) => b.revenue - a.revenue);
  const max = Math.max(...ranking.map(x => x.revenue), 1);
  document.getElementById('barberRanking').innerHTML = ranking.map((b,i) => `<div class="ranking-item"><span class="rank-num">#${i+1}</span><div class="avatar" style="background:${b.color}">${initials(b.name)}</div><div><strong>${escapeHtml(b.name)}</strong><small>${b.cuts} servicios este mes</small><div class="progress"><span style="width:${Math.max(5,b.revenue/max*100)}%"></span></div></div><div class="rank-value"><strong>${CLP.format(b.revenue)}</strong><small>ventas</small></div></div>`).join('');
}

function renderSalesChart() {
  const select = document.getElementById('salesChartYear');
  const years = [...new Set(state.sales.map(s => Number(s.date.slice(0,4))))].sort((a,b)=>b-a);
  const defaultYear = Number(select.value) || new Date().getFullYear();
  select.innerHTML = years.map(y => `<option value="${y}" ${y===defaultYear?'selected':''}>${y}</option>`).join('');
  const year = Number(select.value) || new Date().getFullYear();
  const values = Array.from({length:12}, (_,idx) => state.sales.filter(s => Number(s.date.slice(0,4))===year && Number(s.date.slice(5,7))===idx+1).reduce((a,s)=>a+Number(s.amount),0));
  const max = Math.max(...values, 1);
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  document.getElementById('salesChart').innerHTML = values.map((v,i) => `<div class="bar-column"><div class="bar" data-value="${CLP.format(v)}" style="height:${Math.max(v ? 4 : 1, v/max*88)}%"></div><span class="bar-label">${months[i]}</span></div>`).join('');
}

function renderServiceDonut() {
  const sales = salesForMonth();
  const counts = state.services.map(s => ({ ...s, count: sales.filter(x => x.serviceId === s.id).length })).filter(x => x.count > 0).sort((a,b)=>b.count-a.count);
  const total = counts.reduce((a,s)=>a+s.count,0) || 1;
  const colors = ['#b88a44','#829ab8','#c4ad87','#c9ced7','#7c8d78','#8f7480'];
  let cursor = 0;
  const segments = counts.map((s,i) => { const start = cursor; cursor += s.count/total*100; return `${colors[i%colors.length]} ${start}% ${cursor}%`; });
  const donut = document.getElementById('serviceDonut');
  donut.style.background = counts.length ? `conic-gradient(${segments.join(',')})` : '#eceff3';
  donut.innerHTML = `<div class="donut-center"><div><strong>${sales.length}</strong><small>servicios</small></div></div>`;
  document.getElementById('serviceLegend').innerHTML = counts.length ? counts.map((s,i) => `<div class="legend-item"><span class="legend-dot" style="background:${colors[i%colors.length]}"></span><span>${escapeHtml(s.name)}</span><strong>${Math.round(s.count/total*100)}%</strong></div>`).join('') : '<div class="empty-state">Sin ventas este mes.</div>';
}

function populateFilters() {
  const barberFilter = document.getElementById('agendaBarberFilter');
  const current = agendaBarber;
  barberFilter.innerHTML = `<option value="all">Todos los barberos</option>` + state.barbers.filter(b=>b.active).map(b=>`<option value="${b.id}">${escapeHtml(b.name)}</option>`).join('');
  barberFilter.value = current;
}

function renderAgenda() {
  const today = startOfToday();
  const endWeek = addDays(today, 7); endWeek.setHours(23,59,59,999);
  let items = [...state.appointments];
  if (agendaRange === 'today') items = items.filter(a => a.date === localDate(today));
  if (agendaRange === 'week') items = items.filter(a => { const d = fullDateTime(a); return d >= today && d <= endWeek; });
  if (agendaBarber !== 'all') items = items.filter(a => a.barberId === agendaBarber);
  items.sort((a,b)=>fullDateTime(a)-fullDateTime(b));
  document.getElementById('appointmentsTable').innerHTML = items.length ? items.map(a => {
    const c=getClient(a.clientId), b=getBarber(a.barberId), s=getService(a.serviceId);
    return `<tr><td><strong>${formatDate(a.date)}</strong><br><small>${a.time}</small></td><td><div class="person-cell"><div class="avatar" style="background:#697386">${initials(c.name)}</div><div><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml(c.phone)}</small></div></div></td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(b.name)}</td><td><span class="status ${a.status}">${statusLabel(a.status)}</span></td><td><strong>${CLP.format(s.price)}</strong></td><td><div class="table-actions"><button class="table-action" data-action="complete-appointment" data-id="${a.id}" title="Completar">✓</button><button class="table-action" data-action="edit-appointment" data-id="${a.id}" title="Editar">✎</button><button class="table-action" data-action="delete-appointment" data-id="${a.id}" title="Eliminar">×</button></div></td></tr>`;
  }).join('') : `<tr><td colspan="7">${empty('No hay citas en este período','Prueba otro filtro o agenda una nueva hora.')}</td></tr>`;
}
