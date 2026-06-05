/* ════════════════════════════════════════════════════════
   TfL Collaboration Portal — Application Script
════════════════════════════════════════════════════════ */

// ════════════ CONSTANTS ════════════

const INTERNAL_TYPES = ['Curtailment Addition', 'Administrative Change'];

const USER_DISPLAY = {
  'creator':        { name: 'TfL User',        initials: 'TU', role: 'Service Change Creator' },
  'tendering-team': { name: 'Tendering Team',  initials: 'TT', role: 'Tendering Team'         },
  'read-only':      { name: 'Read-Only User',  initials: 'RO', role: 'Read-Only'              },
  'operator':       { name: 'Operator User',   initials: 'OU', role: 'Arriva London'          },
};


// ════════════ DATA ════════════

const ROUTES = [
  { r: '25',  op: 'Arriva London',   from: 'Oxford Circus',       to: 'Ilford',             mod: '2025-05-14', disp: '14 May 2025', st: 'pending'  },
  { r: '73',  op: 'Arriva London',   from: 'Victoria',            to: 'Stoke Newington',    mod: '2025-05-12', disp: '12 May 2025', st: 'complete' },
  { r: '38',  op: 'Arriva London',   from: 'Victoria',            to: 'Clapton Pond',       mod: '2025-05-09', disp: '09 May 2025', st: 'pending'  },
  { r: 'N25', op: 'Arriva London',   from: 'Oxford Circus',       to: 'Ilford',             mod: '2025-05-07', disp: '07 May 2025', st: 'complete' },
  { r: '8',   op: 'Go-Ahead London', from: 'Bow Church',          to: 'Tottenham Court Rd', mod: '2025-05-06', disp: '06 May 2025', st: 'pending'  },
  { r: '55',  op: 'Go-Ahead London', from: 'Oxford Circus',       to: 'Hackney Wick',       mod: '2025-05-05', disp: '05 May 2025', st: 'complete' },
  { r: '48',  op: 'Go-Ahead London', from: 'Walthamstow Central', to: 'London Bridge',      mod: '2025-05-02', disp: '02 May 2025', st: 'pending'  },
  { r: '15',  op: 'Tower Transit',   from: 'Trafalgar Square',    to: 'Blackwall',          mod: '2025-05-01', disp: '01 May 2025', st: 'complete' },
  { r: 'N15', op: 'Tower Transit',   from: 'Trafalgar Square',    to: 'Romford',            mod: '2025-04-29', disp: '29 Apr 2025', st: 'pending'  },
  { r: '205', op: 'Metroline',       from: 'Paddington',          to: 'Bow',                mod: '2025-04-28', disp: '28 Apr 2025', st: 'complete' },
  { r: '390', op: 'Metroline',       from: 'Archway',             to: 'Notting Hill Gate',  mod: '2025-04-25', disp: '25 Apr 2025', st: 'pending'  },
  { r: 'X26', op: 'Metrobus',        from: 'Croydon',             to: 'Heathrow Airport',   mod: '2025-04-22', disp: '22 Apr 2025', st: 'complete' },
];

const SERVICE_CHANGES = [
  { id: 'SC-001', route: '25', op: 'Arriva London',   implDate: '01/09/2025', specName: '25 Stop Seq v1.2',      type: 'Stop Sequence Change',       st: 'pending',  desc: 'New stop at Stratford City bus station added to outbound journey.',                                                                                                              deleted: false, confidential: false },
  { id: 'SC-002', route: '25', op: 'Arriva London',   implDate: '27/10/2025', specName: '25 New Sched Oct v2',   type: 'New Schedule',               st: 'complete', desc: 'Sunday frequency reduced from 12 to 15 minute headway from October timetable.',                                                                                              deleted: false, confidential: false },
  { id: 'SC-003', route: '25', op: 'Arriva London',   implDate: '12/01/2026', specName: '25 Reroute Jan 26',     type: 'Rerouting / Route Variation', st: 'pending',  desc: 'Temporary rerouting via Aldgate East due to Crossrail surface works. Estimated duration 6 weeks.',                                                                        deleted: false, confidential: false },
  { id: 'SC-004', route: '25', op: 'Arriva London',   implDate: '03/03/2025', specName: '25 Minor Amend Mar',    type: 'Stop Sequence Change',       st: 'complete', desc: 'Minor stop timing adjustment at Mile End — layover time extended by 2 minutes.',                                                                                                deleted: true,  confidential: false },
  { id: 'SC-005', route: '73', op: 'Arriva London',   implDate: '01/11/2025', specName: '73 Tender 2025',        type: 'New Tender',                 st: 'pending',  desc: 'Open tender for Route 73 operation from November 2025. File received and validated — awaiting award decision.',                                                             deleted: false, confidential: true,  tenderId: 'T-001' },
  { id: 'SC-006', route: '38', op: 'Arriva London',   implDate: '15/07/2025', specName: '38 Curtailment Jul 25', type: 'Curtailment Addition',       st: 'pending',  desc: 'Short working curtailment added to Route 38 inbound at Bethnal Green due to road works near Victoria Park. No operator action required — internal schedule change only.', deleted: false, confidential: false },
  { id: 'SC-007', route: '38', op: 'Arriva London',   implDate: '01/08/2025', specName: '38 Admin Amend Aug 25', type: 'Administrative Change',      st: 'complete', desc: 'Administrative correction to route record — garage code updated from GS to GM following depot reassignment. No timetable impact.',                                         deleted: false, confidential: false },
  { id: 'SC-008', route: '73', op: 'Go-Ahead London', implDate: '01/11/2025', specName: '73 Tender 2025',        type: 'New Tender',                 st: 'pending',  desc: 'Open tender for Route 73 operation from November 2025. Schedule file upload in progress — validation pending.',                                                              deleted: false, confidential: true,  tenderId: 'T-001' },
  { id: 'SC-009', route: '73', op: 'Tower Transit',   implDate: '01/11/2025', specName: '73 Tender 2025',        type: 'New Tender',                 st: 'pending',  desc: 'Open tender for Route 73 operation from November 2025. Invitation accepted — awaiting schedule file upload.',                                                                deleted: false, confidential: true,  tenderId: 'T-001' },
];

const SERVICE_REQUESTS = [
  { id: 'SR-001', title: 'Stop Sequence — Route 25',     scRef: 'SC-001', route: '25', op: 'Arriva London',   subOpCode: 'ARLN', due: '15/08/2025', st: 'waiting',   updated: '09 May 2025', msg: 'Please review the attached stop sequence file and return a validated MDV schedule file. Implementation date is 01/09/2025.',                                    file: null },
  { id: 'SR-002', title: 'New Schedule — Route 25',      scRef: 'SC-002', route: '25', op: 'Arriva London',   subOpCode: 'ARLN', due: '20/08/2025', st: 'pending',   updated: '07 May 2025', msg: 'Please review the new schedule and return a validated MDV schedule file by the due date. Implementation date is 27/10/2025.',                                   file: null },
  { id: 'SR-T01', title: 'Tender Submission — Route 73', scRef: 'SC-005', route: '73', op: 'Arriva London',   subOpCode: 'ARLN', due: '01/10/2025', st: 'validated', updated: '20 May 2025', msg: 'Please submit your schedule file for the Route 73 tender. Implementation date 01/11/2025. Include all trip patterns in your proposed schedule.',               file: 'ArrivaLondon_R73_draft.mdv' },
  { id: 'SR-T02', title: 'Tender Submission — Route 73', scRef: 'SC-008', route: '73', op: 'Go-Ahead London', subOpCode: 'GABS', due: '01/10/2025', st: 'validating', updated: '21 May 2025', msg: 'Please submit your schedule file for the Route 73 tender. Implementation date 01/11/2025. Include all trip patterns in your proposed schedule.',               file: 'GoAheadLondon_R73_draft.mdv' },
  { id: 'SR-T03', title: 'Tender Submission — Route 73', scRef: 'SC-009', route: '73', op: 'Tower Transit',   subOpCode: 'TTRA', due: '01/10/2025', st: 'waiting',   updated: '22 May 2025', msg: 'Please submit your schedule file for the Route 73 tender. Implementation date 01/11/2025. Include all trip patterns in your proposed schedule.',               file: null },
];

const DOCUMENTS = [
  { name: 'StopSeq_R25_v1.2.mdv',     by: 'Operator User', op: 'Arriva London', date: '09 May 2025 14:32' },
  { name: 'TimetableOutline_R25.xlsx', by: 'Operator User', op: 'Arriva London', date: '08 May 2025 10:15' },
  { name: 'RouteMap_25_May25.pdf',     by: 'TfL User',      op: '',              date: '07 May 2025 09:48' },
  { name: 'StopSeq_R25_v1.1.mdv',     by: 'Operator User', op: 'Arriva London', date: '06 May 2025 16:20' },
  { name: 'SpecHeader_SC001.xml',      by: 'TfL User',      op: '',              date: '05 May 2025 11:05' },
];

const RECIPIENTS = [
  { id: 1, name: 'Arriva London — Contact 1',   email: 'contact1@arrivabus.co.uk',    op: 'Arriva London',   sel: false },
  { id: 2, name: 'Arriva London — Contact 2',   email: 'contact2@arrivabus.co.uk',    op: 'Arriva London',   sel: false },
  { id: 3, name: 'Go-Ahead London — Contact 1', email: 'contact1@goahead.co.uk',      op: 'Go-Ahead London', sel: false },
  { id: 4, name: 'Go-Ahead London — Contact 2', email: 'contact2@goahead.co.uk',      op: 'Go-Ahead London', sel: false },
  { id: 5, name: 'Tower Transit — Contact',     email: 'contact1@towertransit.co.uk', op: 'Tower Transit',   sel: false },
  { id: 6, name: 'Metroline — Contact',         email: 'contact1@metroline.co.uk',    op: 'Metroline',       sel: false },
];


// ════════════ STATE ════════════

let currentRoute    = null;
let currentSc       = null;
let currentSr       = null;
let currentUserRole = 'creator'; // 'creator' | 'tendering-team' | 'read-only' | 'operator'
let pendingAwardId  = null;
let scBackTarget    = 's-route'; // where the SC back button returns to
let calYear  = 2025;
let calMonth = 4; // 0-indexed (4 = May)
let rSortCol = -1;
let rSortAsc = true;


// ════════════ NAVIGATION ════════════

function go(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  window.scrollTo(0, 0);
}

function setUserDisplay() {
  const u = USER_DISPLAY[currentUserRole] || USER_DISPLAY['creator'];
  document.querySelectorAll('.bar-un').forEach(el => el.textContent = u.name);
  document.querySelectorAll('.av').forEach(el => el.textContent = u.initials);
}

function doLogin() {
  const u   = document.getElementById('uname').value.trim();
  const p   = document.getElementById('pwd').value.trim();
  const err = document.getElementById('login-err');
  if (!u || !p) {
    document.getElementById('login-err-msg').textContent = 'Please enter your username and password.';
    err.classList.add('show');
    return;
  }
  err.classList.remove('show');
  const roleMap = { tfl: 'creator', tendering: 'tendering-team', readonly: 'read-only', operator: 'operator' };
  currentUserRole = roleMap[u.toLowerCase()] || 'creator';
  setUserDisplay();
  if (currentUserRole === 'operator') {
    go('s-operator');
    renderOperatorPortal();
  } else {
    go('s-dash');
    renderDashboard();
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('s-login').classList.contains('active')) {
    doLogin();
  }
});

function doLogout() {
  go('s-login');
  document.getElementById('uname').value = '';
  document.getElementById('pwd').value   = '';
}

function toggleDemoAccounts() {
  const el = document.getElementById('demo-list');
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}


// ════════════ DASHBOARD ════════════

function renderDashboard(data) {
  const d = data || [...ROUTES];
  document.getElementById('d-tbody').innerHTML = d.map(r => `
    <tr onclick="openRoute('${r.r}')">
      <td class="td-p">${r.r}</td>
      <td><span class="op-pill">${r.op}</span></td>
      <td>${r.from}</td>
      <td>${r.to}</td>
      <td class="td-m">${r.disp}</td>
      <td><span class="sc sc-${r.st}">${cap(r.st)}</span></td>
    </tr>`).join('');
  document.getElementById('d-chip').textContent    = d.length;
  document.getElementById('d-count').textContent   = d.length;
  document.getElementById('d-showing').textContent = `Showing ${d.length} of ${ROUTES.length}`;
  document.getElementById('d-pag').textContent     = `1–${d.length} of ${d.length}`;
}

function filterRoutes() {
  const q = document.getElementById('d-search').value.toLowerCase();
  let d = q
    ? ROUTES.filter(r => [r.r, r.op, r.from, r.to, r.st].some(v => v.toLowerCase().includes(q)))
    : [...ROUTES];
  if (rSortCol >= 0) {
    const k = ['r', 'op', 'from', 'to', 'mod', 'st'][rSortCol];
    d.sort((a, b) => rSortAsc ? a[k].localeCompare(b[k]) : b[k].localeCompare(a[k]));
  }
  renderDashboard(d);
}

function sortRoutes(col) {
  if (rSortCol === col) rSortAsc = !rSortAsc;
  else { rSortCol = col; rSortAsc = true; }
  for (let i = 0; i < 6; i++) {
    const e = document.getElementById('rsi' + i);
    if (e) { e.textContent = 'unfold_more'; e.classList.remove('active'); }
  }
  const e = document.getElementById('rsi' + col);
  if (e) { e.textContent = rSortAsc ? 'arrow_upward' : 'arrow_downward'; e.classList.add('active'); }
  filterRoutes();
}


// ════════════ ROUTE DETAILS ════════════

function openRoute(routeNum) {
  scBackTarget = 's-route';
  currentRoute = ROUTES.find(r => r.r === routeNum) || ROUTES[0];
  document.getElementById('r-bar-title').textContent  = `Route ${currentRoute.r}`;
  document.getElementById('r-bc-route').textContent   = `Route ${currentRoute.r}`;
  document.getElementById('r-heading').textContent    = `Route ${currentRoute.r} — ${currentRoute.from} to ${currentRoute.to}`;
  document.getElementById('r-subheading').textContent = currentRoute.op;
  document.getElementById('r-info-grid').innerHTML = infoGrid([
    ['Route Number',   currentRoute.r],
    ['Operator',       currentRoute.op],
    ['Start Terminus', currentRoute.from],
    ['End Terminus',   currentRoute.to],
    ['Last Modified',  currentRoute.disp],
    ['Status',         `<span class="sc sc-${currentRoute.st}">${cap(currentRoute.st)}</span>`],
  ]);
  renderCalendar();
  renderScTable();
  go('s-route');
}


// ════════════ CALENDAR ════════════

function renderCalendar() {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('cal-label').textContent = months[calMonth] + ' ' + calYear;

  const first       = new Date(calYear, calMonth, 1).getDay();
  const startOffset = (first === 0) ? 6 : first - 1; // Monday-first grid
  const days        = new Date(calYear, calMonth + 1, 0).getDate();
  const today       = new Date();

  let html = '';
  for (let i = 0; i < startOffset; i++) html += `<div class="cal-day empty"></div>`;
  for (let d = 1; d <= days; d++) {
    const date    = new Date(calYear, calMonth, d);
    const dow     = date.getDay(); // 0 = Sun, 6 = Sat
    const isToday = today.getDate() === d && today.getMonth() === calMonth && today.getFullYear() === calYear;
    let tags = '';
    if (dow >= 1 && dow <= 5) tags += `<span class="trip-tag tt-mf">Mon–Fri</span>`;
    if (dow === 6)             tags += `<span class="trip-tag tt-sa">Sat</span>`;
    if (dow === 0)             tags += `<span class="trip-tag tt-su">Sun</span>`;
    html += `<div class="cal-day${isToday ? ' today' : ''}"><span class="day-num">${d}</span>${tags}</div>`;
  }
  document.getElementById('cal-grid').innerHTML = html;
}

function calPrev() {
  if (calMonth === 0) { calMonth = 11; calYear--; } else calMonth--;
  renderCalendar();
}
function calNext() {
  if (calMonth === 11) { calMonth = 0; calYear++; } else calMonth++;
  renderCalendar();
}


// ════════════ SERVICE CHANGES TABLE ════════════

function typeBadge(sc) {
  const type = typeof sc === 'string' ? sc : sc.type;
  const op   = typeof sc === 'object' ? sc.op : null;
  if (type === 'New Tender') {
    const opPill = op
      ? `<span class="op-pill" style="background:#FFF3E0;color:#E65100;border:none;margin-left:4px">${op}</span>`
      : '';
    return `<span class="op-pill" style="background:#FFF8E1;color:#E65100;border:1px solid #FFB300;font-weight:600">New Tender</span>${opPill}`;
  }
  if (INTERNAL_TYPES.includes(type)) {
    return `<span class="op-pill" style="background:#F3E5F5;color:#6A1B9A">${type}</span>`;
  }
  return `<span class="op-pill" style="background:#EDE7F6;color:#512DA8">${type}</span>`;
}

function renderScTable() {
  const showDel      = document.getElementById('show-deleted')?.checked;
  const q            = (document.getElementById('sc-search')?.value || '').toLowerCase();
  const allTenderScs = SERVICE_CHANGES.filter(s =>
    s.route === currentRoute?.r && s.type === 'New Tender' && !s.deleted
  );

  // Tender banner — only for TfL roles (operators see their own tender SC row directly)
  const banEl  = document.getElementById('sc-tender-active-ban');
  const banTxt = document.getElementById('sc-tender-active-text');
  if (banEl) {
    if (allTenderScs.length > 0 && currentUserRole !== 'operator') {
      banEl.style.display = 'flex';
      banTxt.textContent  = `Route ${currentRoute.r} is currently in tender — ${allTenderScs.length} submission${allTenderScs.length !== 1 ? 's' : ''} in progress`;
    } else {
      banEl.style.display = 'none';
    }
  }

  const data = SERVICE_CHANGES.filter(s => {
    if (s.route !== currentRoute?.r) return false;
    if (!showDel && s.deleted) return false;
    // Operator: only own SCs, no internal types
    if (currentUserRole === 'operator') {
      if (INTERNAL_TYPES.includes(s.type)) return false;
      if (s.op !== 'Arriva London') return false;
    }
    // Tender SCs: tendering-team sees all; operators see their own (filtered above); others see none
    if (s.type === 'New Tender' && currentUserRole !== 'tendering-team' && currentUserRole !== 'operator') return false;
    if (q && ![s.id, s.route, s.op || '', s.type, s.st, s.desc, s.specName].some(v => v.toLowerCase().includes(q))) return false;
    return true;
  });
  data.sort((a, b) => parseDate(a.implDate) - parseDate(b.implDate));

  document.getElementById('sc-count-chip').textContent = data.length;
  document.getElementById('sc-foot').textContent       = data.length + ' service change' + (data.length !== 1 ? 's' : '');
  document.getElementById('sc-tbody').innerHTML = data.map(s => `
    <tr class="${s.type === 'New Tender' ? 'tr-tender' : ''}" onclick="openSc('${s.id}')">
      <td class="td-p">${s.route}</td>
      <td style="font-weight:500">${s.id}</td>
      <td>${s.implDate}</td>
      <td class="td-m">${s.specName}</td>
      <td>${typeBadge(s)}</td>
      <td><span class="sc sc-${s.st}">${cap(s.st)}</span></td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;color:var(--sec)">${s.desc}</td>
    </tr>`).join('');
}

function parseDate(d) {
  const p = d.split('/');
  return new Date(p[2], p[1] - 1, p[0]);
}


// ════════════ SERVICE CHANGE DETAILS ════════════

function openSc(scId) {
  currentSc = SERVICE_CHANGES.find(s => s.id === scId) || SERVICE_CHANGES[0];
  const isInternal = INTERNAL_TYPES.includes(currentSc.type);
  const isTender   = currentSc.type === 'New Tender';

  document.getElementById('sc-bc-route').textContent    = 'Route ' + currentSc.route;
  document.getElementById('sc-bc-ref').textContent      = currentSc.id;
  document.getElementById('sc-heading').textContent     = 'Route ' + currentSc.route + ' — ' + currentSc.specName;
  document.getElementById('sc-sub').textContent         = 'Route ' + currentSc.route + ' · ' + (currentSc.op || 'Tender in Progress');
  document.getElementById('sc-status-chip').className   = 'sc sc-' + currentSc.st;
  document.getElementById('sc-status-chip').textContent = cap(currentSc.st);

  document.getElementById('sc-info-grid').innerHTML = infoGrid([
    ['Service Change Ref',  currentSc.id],
    ['Title',               currentSc.specName],
    ['Type',                typeBadge(currentSc)],
    ['Route',               currentSc.route],
    ['Operator',            currentSc.op || '<em style="color:var(--sec)">Tender in progress</em>'],
    ['Implementation Date', currentSc.implDate],
    ['Confidential',        currentSc.confidential
      ? '<span class="sc sc-failed" style="height:20px;font-size:11px">Yes — restricted</span>'
      : 'No'],
    ['Status', `<span class="sc sc-${currentSc.st}">${cap(currentSc.st)}</span>`],
    ['Description', `<span style="white-space:pre-wrap;line-height:1.6">${currentSc.desc}</span>`],
  ]);

  // Set currentSr for both standard and tender SCs
  currentSr = SERVICE_REQUESTS.find(s => s.scRef === currentSc.id) || null;

  // Tender page banner and award button
  const tenderBan = document.getElementById('sc-tender-ban');
  const awardBtn  = document.getElementById('sc-award-btn');
  if (isTender) {
    tenderBan.style.display = 'flex';
    document.getElementById('sc-tender-ban-sub').textContent =
      (currentSc.op || 'Operator TBC') + ' · Tender ref: ' + (currentSc.tenderId || '');
    awardBtn.style.display =
      (currentUserRole === 'tendering-team' && currentSr?.st === 'validated') ? '' : 'none';
  } else {
    tenderBan.style.display = 'none';
    awardBtn.style.display  = 'none';
  }

  // Role-based button visibility
  const isOp   = currentUserRole === 'operator';
  const canAct = currentUserRole === 'creator' || currentUserRole === 'tendering-team';
  document.getElementById('sc-edit-btn').style.display     = canAct ? '' : 'none';
  document.getElementById('sc-abandon-btn').style.display  = canAct ? '' : 'none';
  document.getElementById('sc-dl-spec-btn').style.display  = isOp   ? '' : 'none';
  document.getElementById('sc-sub-edit-btn').style.display = canAct ? '' : 'none';
  document.getElementById('sc-sub-send-btn').style.display = canAct ? '' : 'none';
  const uploadBtn    = document.getElementById('sc-sub-upload-btn');
  if (uploadBtn) uploadBtn.style.display =
    (isOp && currentSr && ['waiting', 'pending', 'failed'].includes(currentSr.st)) ? '' : 'none';
  const docUploadBtn = document.getElementById('sc-doc-upload-btn');
  if (docUploadBtn) docUploadBtn.style.display = canAct ? '' : 'none';

  // Show/hide section based on SC type
  const submCard    = document.getElementById('sc-submission-card');
  const internalBan = document.getElementById('sc-internal-ban');
  submCard.style.display    = 'none';
  internalBan.style.display = 'none';

  if (isInternal) {
    internalBan.style.display = 'block';
  } else {
    submCard.style.display = 'block';
    renderInlineSubmission();
  }

  go('s-sc');
}


// ════════════ SERVICE REQUESTS TABLE ════════════

function renderSrTable() {
  const q    = (document.getElementById('sr-search')?.value || '').toLowerCase();
  const data = SERVICE_REQUESTS.filter(s =>
    s.scRef === currentSc?.id &&
    (!q || [s.title, s.id, s.scRef, s.route, s.op, s.st].some(v => v.toLowerCase().includes(q)))
  );
  data.sort((a, b) => parseDate(a.due) - parseDate(b.due));

  document.getElementById('sr-count-chip').textContent = data.length;
  document.getElementById('sr-foot').textContent       = data.length + ' service request' + (data.length !== 1 ? 's' : '');

  if (data.length === 0) {
    document.getElementById('sc-sr-empty').style.display      = 'block';
    document.getElementById('sc-sr-table-wrap').style.display = 'none';
    return;
  }
  document.getElementById('sc-sr-empty').style.display      = 'none';
  document.getElementById('sc-sr-table-wrap').style.display = 'block';
  document.getElementById('sr-tbody').innerHTML = data.map(s => `
    <tr onclick="openSr('${s.id}')">
      <td class="td-p">${s.title}</td>
      <td class="td-m">${s.due}</td>
      <td>${s.scRef}</td>
      <td>${s.route}</td>
      <td><span class="op-pill">${s.op}</span></td>
      <td><span class="sc sc-${s.st}">${cap(s.st)}</span></td>
      <td class="td-m">${s.updated}</td>
      <td><button class="btn btn-p btn-sm" onclick="event.stopPropagation();openSendDialog()"><span class="material-icons">send</span>Send</button></td>
    </tr>`).join('');
}


// ════════════ INLINE SUBMISSION (SR layer collapsed to SC level — TfL workflow) ════════════

function renderInlineSubmission() {
  const sr      = currentSr;
  const isOp    = currentUserRole === 'operator';
  const canAct  = currentUserRole === 'creator' || currentUserRole === 'tendering-team';
  const srRef   = document.getElementById('sc-sub-sr-ref');
  const chip    = document.getElementById('sc-sub-status-chip');
  const sendBtn = document.getElementById('sc-sub-send-btn');
  const editBtn = document.getElementById('sc-sub-edit-btn');
  const uplBtn  = document.getElementById('sc-sub-upload-btn');
  const empty   = document.getElementById('sc-sub-empty');
  const content = document.getElementById('sc-sub-content');

  // Role-adaptive card labels
  const collBan = document.querySelector('#sc-submission-card .sr-collapsed-banner');
  if (collBan)  collBan.style.display = isOp ? 'none' : '';
  const cardSub = document.querySelector('#sc-submission-card .card-sub');
  if (cardSub)  cardSub.textContent   = isOp
    ? 'Your schedule file submission for this service change'
    : 'Operator submission for this service change';

  if (!sr) {
    if (srRef)    srRef.textContent    = '';
    if (chip)   { chip.className = 'sc sc-pending'; chip.textContent = 'No submission'; }
    if (sendBtn)  sendBtn.style.display = 'none';
    if (editBtn)  editBtn.style.display = 'none';
    if (uplBtn)   uplBtn.style.display  = 'none';
    if (empty)    empty.style.display   = 'block';
    if (content)  content.style.display = 'none';
    return;
  }

  if (srRef)    srRef.textContent     = sr.id;
  if (chip)   { chip.className = 'sc sc-' + sr.st; chip.textContent = cap(sr.st); }
  // Send and Edit buttons only for creator / tendering-team
  if (sendBtn)  sendBtn.style.display  = canAct ? '' : 'none';
  if (editBtn)  editBtn.style.display  = canAct ? '' : 'none';
  // Upload button only for operators when file is expected
  if (uplBtn)   uplBtn.style.display   =
    (isOp && ['waiting', 'pending', 'failed'].includes(sr.st)) ? '' : 'none';
  if (empty)    empty.style.display    = 'none';
  if (content)  content.style.display  = 'block';

  document.getElementById('sc-sub-info-grid').innerHTML = infoGrid([
    ['Service Request Ref', sr.id],
    ['Sub-operator Code',   `<code style="font-size:12px;background:#f5f5f5;padding:2px 6px;border-radius:3px">${sr.subOpCode || '—'}</code> <span style="font-size:11px;color:var(--sec)">(pre-assigned from Novus)</span>`],
    ['Due Date',            sr.due],
    ['Last Updated',        sr.updated],
  ]);
  document.getElementById('sc-sub-message').textContent = sr.msg || '';
  renderInlineFileCard(sr.st);
  renderInlineDocs();
}

function renderInlineFileCard(status) {
  const sub  = document.getElementById('sc-sub-file-sub');
  const body = document.getElementById('sc-sub-file-body');
  const acts = document.getElementById('sc-sub-file-actions');
  if (!sub || !body || !acts) return;

  if (status === 'pending') {
    sub.textContent = 'No schedule file uploaded yet';
    if (currentUserRole === 'read-only') {
      body.innerHTML = `<div class="val-ing"><span class="material-icons">info_outline</span>No schedule file has been uploaded yet.</div>`;
    } else {
      body.innerHTML = `<div class="dropzone" onclick="toast('File picker — will be wired in build')">
        <span class="material-icons">upload_file</span>
        <p>Drop MDV or VDV file here, or click to browse</p>
        <span>Supports .mdv, .vdv, .zip</span>
      </div>`;
    }
    acts.innerHTML = '';
  } else if (status === 'waiting') {
    sub.textContent = 'Awaiting schedule file from operator';
    body.innerHTML  = `<div class="val-ing"><span class="material-icons">hourglass_empty</span>Waiting for the operator to upload a schedule file.</div>`;
    acts.innerHTML  = '';
  } else if (status === 'validating') {
    sub.textContent = 'Validation in progress…';
    body.innerHTML  = `<div class="val-ing"><span class="material-icons">sync</span>Novus is validating the uploaded schedule file. This may take a few minutes.</div>`;
    acts.innerHTML  = '';
  } else if (status === 'validated') {
    const fileName = currentSr?.file || 'schedule_file.mdv';
    sub.textContent = 'Schedule file validated successfully';
    body.innerHTML  = `
      <div class="val-success" style="margin-bottom:12px"><span class="material-icons">check_circle</span>The schedule file has been validated successfully by Novus.</div>
      <div class="file-row"><span class="material-icons">description</span><span class="fn">${fileName}</span><span class="fs">Uploaded ${currentSr?.updated || ''}</span></div>`;
    acts.innerHTML  = `
      <button class="btn btn-o btn-sm" onclick="toast('Warning report downloaded.')"><span class="material-icons">download</span>Report</button>
      <button class="btn btn-o btn-sm" onclick="toast('${fileName} downloaded.')"><span class="material-icons">download</span>File</button>`;
  } else if (status === 'failed') {
    const fileName = currentSr?.file || 'schedule_file.mdv';
    sub.textContent = 'Schedule file validation failed';
    body.innerHTML  = `
      <div class="val-fail" style="margin-bottom:12px"><span class="material-icons">error</span>Validation failed. Please review the error report, resolve the issues, and upload a corrected file.</div>
      <div class="file-row"><span class="material-icons" style="color:var(--err)">description</span><span class="fn">${fileName}</span><span class="fs">Uploaded ${currentSr?.updated || ''}</span></div>`;
    const canReplace = currentUserRole !== 'read-only';
    acts.innerHTML  = `
      <button class="btn btn-o btn-sm" onclick="toast('Error report downloaded.')"><span class="material-icons">download</span>Error Report</button>
      ${canReplace ? `<button class="btn btn-a btn-sm" onclick="${currentUserRole === 'operator' ? 'operatorUploadFile()' : "toast('File picker — will be wired in build')"}"><span class="material-icons">upload</span>Replace File</button>` : ''}`;
  }
}

function renderInlineDocs(filter) {
  const data = filter
    ? DOCUMENTS.filter(d => d.name.toLowerCase().includes(filter) || d.by.toLowerCase().includes(filter))
    : DOCUMENTS;
  const chip  = document.getElementById('sc-doc-chip');
  const foot  = document.getElementById('sc-doc-foot');
  const tbody = document.getElementById('sc-doc-tbody');
  if (!chip || !foot || !tbody) return;
  chip.textContent = data.length;
  foot.textContent = data.length + ' document' + (data.length !== 1 ? 's' : '');
  tbody.innerHTML  = data.map(d => `
    <tr>
      <td><span style="display:flex;align-items:center;gap:8px"><span class="material-icons" style="font-size:18px;color:var(--pri)">description</span>${d.name}</span></td>
      <td>${d.by}</td>
      <td>${d.op ? `<span class="op-pill">${d.op}</span>` : ''}</td>
      <td class="td-m">${d.date}</td>
      <td><button class="btn btn-t btn-sm" onclick="toast('${d.name} downloaded.')"><span class="material-icons">download</span></button></td>
    </tr>`).join('');
}

function filterInlineDocs(q) { renderInlineDocs(q.toLowerCase()); }


// ════════════ TENDER AWARD ════════════

function openAwardDialog(scId) {
  pendingAwardId = scId;
  const sc = SERVICE_CHANGES.find(s => s.id === scId);
  if (!sc) return;
  document.getElementById('award-op-name').textContent = sc.op || 'Unknown Operator';
  document.getElementById('d-award').classList.add('open');
}

function doAwardTender() {
  const sc = SERVICE_CHANGES.find(s => s.id === pendingAwardId);
  if (!sc) return;
  const tid = sc.tenderId;
  SERVICE_CHANGES.forEach(s => {
    if (s.tenderId === tid) s.st = (s.id === pendingAwardId) ? 'awarded' : 'rejected';
  });
  closeDlg('d-award');
  pendingAwardId = null;
  document.getElementById('sc-status-chip').className   = 'sc sc-awarded';
  document.getElementById('sc-status-chip').textContent = 'Awarded';
  document.getElementById('sc-award-btn').style.display = 'none';
  renderScTable();
  toast(`Tender awarded to ${sc.op}. All other submissions have been rejected.`);
}


// ════════════ SERVICE REQUEST DETAILS ════════════

function openSr(srId) {
  currentSr = SERVICE_REQUESTS.find(s => s.id === srId) || SERVICE_REQUESTS[0];
  document.getElementById('sr-bc-route').textContent    = 'Route ' + currentSr.route;
  document.getElementById('sr-bc-sc').textContent       = currentSr.scRef;
  document.getElementById('sr-bc-name').textContent     = currentSr.id;
  document.getElementById('sr-heading').textContent     = currentSr.title;
  document.getElementById('sr-sub').textContent         = currentSr.scRef + ' · Route ' + currentSr.route + ' · ' + currentSr.op;
  document.getElementById('sr-status-chip').className   = 'sc sc-' + currentSr.st;
  document.getElementById('sr-status-chip').textContent = cap(currentSr.st);
  document.getElementById('sr-info-grid').innerHTML = infoGrid([
    ['Service Request Ref', currentSr.id],
    ['Title',               currentSr.title],
    ['Service Change Ref',  currentSr.scRef],
    ['Route',               currentSr.route],
    ['Operator',            currentSr.op],
    ['Sub-operator Code',   `<code style="font-size:12px;background:#f5f5f5;padding:2px 6px;border-radius:3px">${currentSr.subOpCode || '—'}</code> <span style="font-size:11px;color:var(--sec)">(pre-assigned from Novus)</span>`],
    ['Due Date',            currentSr.due],
    ['Status',              `<span class="sc sc-${currentSr.st}">${cap(currentSr.st)}</span>`],
    ['Last Updated',        currentSr.updated],
  ]);
  renderFileCard(currentSr.st);
  renderDocs();
  go('s-sr');
}

function renderFileCard(status) {
  const sub  = document.getElementById('sr-file-sub');
  const body = document.getElementById('sr-file-body');
  const acts = document.getElementById('sr-file-actions');

  if (status === 'pending') {
    sub.textContent = 'No schedule file uploaded yet';
    body.innerHTML  = `<div class="dropzone" onclick="toast('File picker — will be wired in build')">
      <span class="material-icons">upload_file</span>
      <p>Drop MDV or VDV file here, or click to browse</p>
      <span>Supports .mdv, .vdv, .zip</span>
    </div>`;
    acts.innerHTML = '';

  } else if (status === 'waiting') {
    if (currentUserRole === 'operator') {
      sub.textContent = 'Please upload your MDV schedule file';
      body.innerHTML  = `<div class="dropzone" onclick="operatorUploadFile()">
        <span class="material-icons">upload_file</span>
        <p>Drop your MDV or VDV schedule file here, or click to browse</p>
        <span>Supports .mdv, .vdv, .zip</span>
      </div>`;
      acts.innerHTML  = `<button class="btn btn-p btn-sm" onclick="operatorUploadFile()"><span class="material-icons">upload</span>Upload Schedule File</button>`;
    } else {
      sub.textContent = 'Awaiting schedule file from operator';
      body.innerHTML  = `<div class="val-ing"><span class="material-icons">hourglass_empty</span>Waiting for the operator to upload a schedule file.</div>`;
      acts.innerHTML  = '';
    }

  } else if (status === 'validating') {
    sub.textContent = 'Validation in progress…';
    body.innerHTML  = `<div class="val-ing"><span class="material-icons">sync</span>Novus is validating the uploaded schedule file. This may take a few minutes.</div>`;
    acts.innerHTML  = '';

  } else if (status === 'validated') {
    sub.textContent = 'Schedule file validated successfully';
    body.innerHTML  = `
      <div class="val-success" style="margin-bottom:12px"><span class="material-icons">check_circle</span>The schedule file has been validated successfully by Novus.</div>
      <div class="file-row"><span class="material-icons">description</span><span class="fn">StopSeq_R25_final.mdv</span><span class="fs">124 KB · Uploaded 09 May 2025 14:32</span></div>`;
    acts.innerHTML  = `
      <button class="btn btn-o btn-sm" onclick="toast('Warning report downloaded.')"><span class="material-icons">download</span>Report</button>
      <button class="btn btn-o btn-sm" onclick="toast('Schedule file downloaded.')"><span class="material-icons">download</span>File</button>`;

  } else if (status === 'failed') {
    sub.textContent = 'Schedule file validation failed';
    body.innerHTML  = `
      <div class="val-fail" style="margin-bottom:12px"><span class="material-icons">error</span>Validation failed. Please review the error report, resolve the issues, and upload a corrected file.</div>
      <div class="file-row"><span class="material-icons" style="color:var(--err)">description</span><span class="fn">StopSeq_R25_v1.1.mdv</span><span class="fs">118 KB · Uploaded 07 May 2025 11:20</span></div>`;
    acts.innerHTML  = `
      <button class="btn btn-o btn-sm" onclick="toast('Error report downloaded.')"><span class="material-icons">download</span>Error Report</button>
      <button class="btn btn-a btn-sm" onclick="toast('File picker — will be wired in build')"><span class="material-icons">upload</span>Replace File</button>`;
  }
}


// ════════════ DOCUMENTS ════════════

function renderDocs(filter) {
  const data = filter
    ? DOCUMENTS.filter(d => d.name.toLowerCase().includes(filter) || d.by.toLowerCase().includes(filter))
    : DOCUMENTS;
  document.getElementById('doc-chip').textContent = data.length;
  document.getElementById('doc-foot').textContent = data.length + ' document' + (data.length !== 1 ? 's' : '');
  document.getElementById('doc-tbody').innerHTML  = data.map(d => `
    <tr>
      <td><span style="display:flex;align-items:center;gap:8px"><span class="material-icons" style="font-size:18px;color:var(--pri)">description</span>${d.name}</span></td>
      <td>${d.by}</td>
      <td>${d.op ? `<span class="op-pill">${d.op}</span>` : ''}</td>
      <td class="td-m">${d.date}</td>
      <td><button class="btn btn-t btn-sm" onclick="toast('${d.name} downloaded.')"><span class="material-icons">download</span></button></td>
    </tr>`).join('');
}

function filterDocs(q) { renderDocs(q.toLowerCase()); }


// ════════════ DIALOGS ════════════

function openScDialog() {
  document.getElementById('sc-dlg-title').textContent = 'Create Service Change';
  document.getElementById('d-sc-dialog').classList.add('open');
}
function closeScDlg() { document.getElementById('d-sc-dialog').classList.remove('open'); }
function closeDlg(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.scrim').forEach(s =>
  s.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('open'); })
);

function onFRoute() {
  const v = document.getElementById('f-route').value;
  document.getElementById('f-op').value = v ? v.split('|')[1] : '';
}

function submitSc() {
  const title = document.getElementById('f-title').value.trim();
  const route = document.getElementById('f-route').value;
  const impl  = document.getElementById('f-impl').value;
  const type  = document.getElementById('f-type').value;
  if (!title || !route || !impl || !type) {
    toast('Please complete all required fields.');
    return;
  }
  closeScDlg();
  toast('Service Change created successfully.');
}

function openEditSc() {
  document.getElementById('sc-dlg-title').textContent = 'Edit Service Change';
  if (currentSc) {
    document.getElementById('f-title').value = currentSc.specName;
    document.getElementById('f-op').value    = currentSc.op || '';
    document.getElementById('f-desc').value  = currentSc.desc;
    const cb = document.getElementById('f-confidential');
    if (cb) cb.checked = currentSc.confidential;
  }
  document.getElementById('d-sc-dialog').classList.add('open');
}

function openEditSr() { document.getElementById('d-sr-dialog').classList.add('open'); }

function confirmAbandon() { document.getElementById('d-abandon').classList.add('open'); }

function doAbandon() {
  if (currentSc) { currentSc.st = 'abandoned'; currentSc.deleted = true; }
  closeDlg('d-abandon');
  toast('Service change abandoned and archived.');
  go('s-route');
  renderScTable();
}


// ════════════ SEND TO OPERATOR ════════════

function openSendDialog() {
  // Default-select all contacts for the relevant operator
  RECIPIENTS.forEach(r => r.sel = (r.op === currentSr?.op));
  renderRecipients();
  document.getElementById('d-send-dialog').classList.add('open');
}

function renderRecipients() {
  const f    = document.getElementById('send-op-filter').value;
  const list = f ? RECIPIENTS.filter(r => r.op === f) : RECIPIENTS;
  document.getElementById('recipient-list').innerHTML =
    `<div class="select-all-row"><a onclick="selectAllRecipients(true)">Select all</a> &middot; <a onclick="selectAllRecipients(false)">Deselect all</a></div>` +
    list.map(r => `
    <div class="recipient-row" onclick="toggleRecip(${r.id})">
      <input type="checkbox" ${r.sel ? 'checked' : ''} onclick="event.stopPropagation();toggleRecip(${r.id})">
      <div>
        <div class="rname">${r.name}</div>
        <div class="remail">${r.email} · <span class="op-pill" style="font-size:11px">${r.op}</span></div>
      </div>
    </div>`).join('');
  const sel = RECIPIENTS.filter(r => r.sel).length;
  document.getElementById('recip-selected-count').textContent = sel + ' recipient' + (sel !== 1 ? 's' : '') + ' selected';
}

function selectAllRecipients(val) {
  const f    = document.getElementById('send-op-filter').value;
  const list = f ? RECIPIENTS.filter(r => r.op === f) : RECIPIENTS;
  list.forEach(r => r.sel = val);
  renderRecipients();
}

function toggleRecip(id) {
  const r = RECIPIENTS.find(r => r.id === id);
  if (r) r.sel = !r.sel;
  renderRecipients();
}

function filterRecipients() { renderRecipients(); }

function submitSend() {
  const sel = RECIPIENTS.filter(r => r.sel);
  if (!sel.length) { toast('Please select at least one recipient.'); return; }
  closeDlg('d-send-dialog');
  if (currentSr) {
    currentSr.st = 'waiting';
    const scChip = document.getElementById('sc-sub-status-chip');
    if (scChip) { scChip.className = 'sc sc-waiting'; scChip.textContent = 'Waiting'; }
    const srChip = document.getElementById('sr-status-chip');
    if (srChip) { srChip.className = 'sc sc-waiting'; srChip.textContent = 'Waiting'; }
  }
  renderInlineFileCard('waiting');
  renderFileCard('waiting');
  toast(`Service request sent to ${sel.length} recipient${sel.length !== 1 ? 's' : ''}.`);
}


// ════════════ OPERATOR PORTAL ════════════

function renderOperatorPortal() {
  const opName   = 'Arriva London';
  const opRoutes = ROUTES.filter(r => r.op === opName);
  // Only show SRs that have been dispatched — 'pending' means TfL hasn't sent yet
  const opSRs    = SERVICE_REQUESTS.filter(sr => sr.op === opName && sr.st !== 'pending');

  document.getElementById('op-routes-chip').textContent = opRoutes.length;
  document.getElementById('op-routes-tbody').innerHTML = opRoutes.map(r => `
    <tr style="cursor:pointer" onclick="openRoute('${r.r}')">
      <td class="td-p">${r.r}</td>
      <td>${r.from}</td>
      <td>${r.to}</td>
      <td><span class="sc sc-${r.st}">${cap(r.st)}</span></td>
    </tr>`).join('');

  document.getElementById('op-sub-chip').textContent = opSRs.length;
  document.getElementById('op-sub-tbody').innerHTML = opSRs.map(sr => {
    const sc = SERVICE_CHANGES.find(s => s.id === sr.scRef);
    return `
    <tr class="${sc?.type === 'New Tender' ? 'tr-tender' : ''}" style="cursor:pointer" onclick="openOperatorSc('${sr.scRef}')">
      <td class="td-p">${sr.route}</td>
      <td style="font-weight:500">${sr.scRef}</td>
      <td>${sc ? typeBadge(sc) : ''}</td>
      <td class="td-m">${sr.due}</td>
      <td><code style="font-size:12px;background:#f5f5f5;padding:2px 6px;border-radius:3px">${sr.subOpCode}</code></td>
      <td><span class="sc sc-${sr.st}">${cap(sr.st)}</span></td>
    </tr>`;
  }).join('');
}

function openOperatorSc(scId) {
  const sc = SERVICE_CHANGES.find(s => s.id === scId);
  if (sc) currentRoute = ROUTES.find(r => r.r === sc.route) || null;
  scBackTarget = 's-operator';
  openSc(scId);
}

function operatorUploadFile() {
  if (!currentSr) return;
  currentSr.st   = 'validating';
  currentSr.file = currentSr.file || (currentSr.op.replace(/ /g, '') + '_R' + currentSr.route + '_submission.mdv');
  renderInlineFileCard('validating');
  const chip = document.getElementById('sc-sub-status-chip');
  if (chip) { chip.className = 'sc sc-validating'; chip.textContent = 'Validating'; }
  const uploadBtn = document.getElementById('sc-sub-upload-btn');
  if (uploadBtn) uploadBtn.style.display = 'none';
  toast('File uploaded. Novus is validating your schedule file…');
  setTimeout(() => {
    currentSr.st      = 'validated';
    currentSr.updated = 'Just now';
    renderInlineFileCard('validated');
    const c = document.getElementById('sc-sub-status-chip');
    if (c) { c.className = 'sc sc-validated'; c.textContent = 'Validated'; }
    toast('Schedule file validated successfully.');
  }, 2500);
}


// ════════════ UTILITIES ════════════

function infoGrid(pairs) {
  return pairs.map(([l, v]) => `<div class="info-item"><label>${l}</label><span>${v}</span></div>`).join('');
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

let sbTimer;
function toast(msg) {
  const sb = document.getElementById('sb');
  document.getElementById('sb-txt').textContent = msg;
  sb.classList.add('show');
  clearTimeout(sbTimer);
  sbTimer = setTimeout(() => sb.classList.remove('show'), 3500);
}


// ════════════ INIT ════════════

renderDashboard();
