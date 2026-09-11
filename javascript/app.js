const STORAGE_KEY = 'vacances-trip-v1';
const LANG_STORAGE_KEY = 'vacances-lang';
const LOCALE_MAP = { en: 'en-US', es: 'es-ES', fr: 'fr-FR' };

let currentLang = 'fr';
try{
  const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
  if(savedLang && TRANSLATIONS[savedLang]) currentLang = savedLang;
}catch(e){ /* localStorage unavailable */ }

let state = { tripName: TRANSLATIONS[currentLang].defaultTripName, people: [], expenses: [] };
let selectedParticipants = new Set();
let participantsInitialized = false; // true once the default "everyone selected" fill has run
let settlementFilter = new Set(); // empty = everyone
let expensePayerFilter = new Set(); // empty = everyone

const $ = (id) => document.getElementById(id);

function uid(){ return Math.random().toString(36).slice(2, 9); }

/* ---------- i18n ---------- */
function t(key, ...args){
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
  const entry = dict[key] !== undefined ? dict[key] : TRANSLATIONS.fr[key];
  return typeof entry === 'function' ? entry(...args) : entry;
}

function applyStaticTranslations(){
  document.documentElement.lang = currentLang;
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.getAttribute('data-i18n-title')); });
}

function renderLangSelect(){
  const sel = $('langSelect');
  sel.innerHTML = '';
  LANGUAGE_ORDER.forEach(code => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = LANGUAGE_NAMES[code];
    sel.appendChild(opt);
  });
  sel.value = currentLang;
}

$('langSelect').addEventListener('change', (e) => {
  currentLang = e.target.value;
  try{ localStorage.setItem(LANG_STORAGE_KEY, currentLang); }catch(err){ /* ignore */ }
  applyStaticTranslations();
  render();
});

/* ---------- Modal dialogs (replaces native alert/confirm, whose title bar
   and buttons are drawn by the browser in its own language, not the
   page's — so they stayed untranslated no matter the selected language) --*/
function showModal({ message, confirmKey = 'modalOkBtn', cancelKey = null, danger = false }){
  return new Promise(resolve => {
    const overlay = $('modalOverlay');
    const confirmBtn = $('modalConfirmBtn');
    const cancelBtn = $('modalCancelBtn');

    $('modalMessage').textContent = message;
    confirmBtn.textContent = t(confirmKey);
    confirmBtn.classList.toggle('modal-btn-danger', danger);
    cancelBtn.hidden = !cancelKey;
    if(cancelKey) cancelBtn.textContent = t(cancelKey);

    function cleanup(result){
      overlay.hidden = true;
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', onCancel);
      overlay.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onKeydown);
      resolve(result);
    }
    function onConfirm(){ cleanup(true); }
    function onCancel(){ cleanup(false); }
    function onOverlayClick(e){ if(e.target === overlay) cleanup(false); }
    function onKeydown(e){
      if(e.key === 'Escape') cleanup(false);
      // Skip only when Cancel itself is focused, so its own native Enter
      // activation still cancels rather than being overridden. Any other
      // target (including stale focus left on an unrelated button behind
      // the overlay) confirms — Confirm being focused just double-fires
      // harmlessly alongside its own native activation.
      else if(e.key === 'Enter' && e.target !== cancelBtn) onConfirm();
    }

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', onCancel);
    overlay.addEventListener('click', onOverlayClick);
    document.addEventListener('keydown', onKeydown);

    overlay.hidden = false;
    confirmBtn.focus();
  });
}

function showAlert(message){
  return showModal({ message, confirmKey: 'modalOkBtn', cancelKey: null });
}

function showConfirm(message, { danger = false } = {}){
  return showModal({ message, confirmKey: 'modalConfirmBtn', cancelKey: 'modalCancelBtn', danger });
}

/* Join-existing-expenses modal (opened from the personForm handler below)
   lives in its own file: javascript/join-expenses.js */

function fmt(n){
  return n.toLocaleString(LOCALE_MAP[currentLang] || 'fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function save(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }catch(e){ console.error('Storage error', e); }
}

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      if(parsed && Array.isArray(parsed.people)) state = parsed;
    }
  }catch(e){ /* no saved trip yet */ }
  renderLangSelect();
  applyStaticTranslations();
  render();
}

function render(){
  $('tripName').value = state.tripName || t('defaultTripName');
  renderPeople();
  renderPayerSelect();
  renderParticipantChips();
  renderExpensePayerFilter();
  renderExpenses();
  renderTotals();
  renderBalances();
  renderSettlementFilter();
  renderSettlement();
  const totalPeopleCount = countPeople();
  $('headerSummary').textContent = t('headerSummary', totalPeopleCount, state.expenses.length);
}

/* ---------- Weighted headcount helpers ---------- */
function personSize(p){
  return p && p.size && p.size >= 1 ? p.size : 1;
}

function countPeople(){
  return state.people.reduce((s, p) => s + personSize(p), 0);
}

/* ---------- People ---------- */
function renderPeople(){
  const list = $('peopleList');
  list.innerHTML = '';
  $('peopleEmptyHint').style.display = state.people.length ? 'none' : 'block';
  state.people.forEach(p => {
    const li = document.createElement('li');
    const size = personSize(p);
    const sizeBadge = size > 1 ? ` <span class="person-size">${t('personSizeBadge', size)}</span>` : '';
    li.innerHTML = `<span>${escapeHtml(p.name)}${sizeBadge}</span>`;
    const btn = document.createElement('button');
    btn.textContent = '✕';
    btn.title = t('removePersonTitle', p.name);
    btn.onclick = () => removePerson(p.id);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function removePerson(id){
  state.people = state.people.filter(p => p.id !== id);
  state.expenses = state.expenses.filter(e => e.payer !== id);
  state.expenses.forEach(e => { e.participants = e.participants.filter(pid => pid !== id); });
  state.expenses = state.expenses.filter(e => e.participants.length > 0);
  selectedParticipants.delete(id);
  save(); render();
}

$('personForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('personInput');
  const sizeInput = $('personSize');
  const name = input.value.trim();
  if(!name) return;
  // Names are the only thing distinguishing travelers on screen (balances,
  // "paid by", shares…) — two people with the same name would look
  // impossible to tell apart everywhere, so duplicates are blocked here.
  const isDuplicate = state.people.some(p => p.name.trim().toLowerCase() === name.toLowerCase());
  if(isDuplicate){
    showAlert(t('duplicateNameWarning', name));
    return;
  }
  let size = parseInt(sizeInput.value, 10);
  if(!Number.isFinite(size) || size < 1) size = 1;
  const person = { id: uid(), name, size };
  const hadExpenses = state.expenses.length > 0;
  state.people.push(person);
  selectedParticipants.add(person.id);
  input.value = '';
  sizeInput.value = '1';
  save(); render();
  input.focus();
  if(hadExpenses) openJoinExpensesModal(person.id);
});

/* ---------- Expense form helpers ---------- */
function renderPayerSelect(){
  const sel = $('expensePayer');
  const prev = sel.value;
  sel.innerHTML = '';
  if(state.people.length === 0){
    sel.innerHTML = `<option value="">${escapeHtml(t('payerSelectEmpty'))}</option>`;
    sel.disabled = true;
    return;
  }
  sel.disabled = false;
  state.people.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id; opt.textContent = t('payerSelectPrefix') + p.name;
    sel.appendChild(opt);
  });
  if(state.people.some(p => p.id === prev)) sel.value = prev;
}

function renderParticipantChips(){
  const wrap = $('expenseParticipants');
  wrap.innerHTML = '';
  if(state.people.length === 0) return;
  if(!participantsInitialized){
    state.people.forEach(p => selectedParticipants.add(p.id));
    participantsInitialized = true;
  }

  const allSelected = state.people.every(p => selectedParticipants.has(p.id));
  const allChip = document.createElement('div');
  allChip.className = 'chip chip-all' + (allSelected ? ' active' : '');
  allChip.textContent = t('allChipLabel');
  allChip.onclick = () => {
    if(allSelected) selectedParticipants.clear();
    else state.people.forEach(p => selectedParticipants.add(p.id));
    renderParticipantChips();
  };
  wrap.appendChild(allChip);

  state.people.forEach(p => {
    const chip = document.createElement('div');
    chip.className = 'chip' + (selectedParticipants.has(p.id) ? ' active' : '');
    chip.textContent = p.name;
    chip.onclick = () => {
      if(selectedParticipants.has(p.id)) selectedParticipants.delete(p.id);
      else selectedParticipants.add(p.id);
      renderParticipantChips();
    };
    wrap.appendChild(chip);
  });
}

function addExpense(desc, amount, payer, participants){
  state.expenses.push({ id: uid(), desc, amount, payer, participants });
  $('expenseDesc').value = '';
  $('expenseAmount').value = '';
  save(); render();
  $('expenseDesc').focus();
}

$('expenseForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const desc = $('expenseDesc').value.trim();
  const amount = parseFloat($('expenseAmount').value);
  const payer = $('expensePayer').value;
  const participants = Array.from(selectedParticipants);
  if(!desc || !amount || amount <= 0 || !payer || participants.length === 0) return;

  const sharedByEveryone = participants.length === state.people.length;
  if(sharedByEveryone){
    addExpense(desc, amount, payer, participants);
    return;
  }

  // Not shared by everyone: confirm the exact split (payer included) before
  // adding it, since it's easy to forget to select someone by mistake.
  const byId = Object.fromEntries(state.people.map(p => [p.id, p.name]));
  const payerName = byId[payer] || '—';
  const shareNames = participants.map(id => byId[id]).filter(Boolean).join(', ');
  showConfirm(t('confirmPartialExpense', desc, fmt(amount), payerName, shareNames)).then(ok => {
    if(ok) addExpense(desc, amount, payer, participants);
  });
});

function renderExpensePayerFilter(){
  const wrap = $('expensePayerFilter');
  wrap.innerHTML = '';
  if(state.people.length === 0) return;

  const validIds = new Set(state.people.map(p => p.id));
  expensePayerFilter.forEach(id => { if(!validIds.has(id)) expensePayerFilter.delete(id); });

  const allChip = document.createElement('div');
  allChip.className = 'chip chip-filter chip-all' + (expensePayerFilter.size === 0 ? ' active' : '');
  allChip.textContent = t('allChipLabel');
  allChip.onclick = () => { expensePayerFilter.clear(); renderExpensePayerFilter(); renderExpenses(); };
  wrap.appendChild(allChip);

  state.people.forEach(p => {
    const chip = document.createElement('div');
    chip.className = 'chip chip-filter' + (expensePayerFilter.has(p.id) ? ' active' : '');
    chip.textContent = p.name;
    chip.onclick = () => {
      if(expensePayerFilter.has(p.id)) expensePayerFilter.delete(p.id);
      else expensePayerFilter.add(p.id);
      renderExpensePayerFilter();
      renderExpenses();
    };
    wrap.appendChild(chip);
  });
}

function renderExpenses(){
  const list = $('expenseList');
  list.innerHTML = '';
  const byId = Object.fromEntries(state.people.map(p => [p.id, p.name]));
  let expenses = [...state.expenses].reverse();
  if(expensePayerFilter.size > 0){
    expenses = expenses.filter(exp => expensePayerFilter.has(exp.payer));
  }
  const noneMatch = state.expenses.length > 0 && expenses.length === 0;
  $('expenseEmptyHint').style.display = state.expenses.length ? 'none' : 'block';
  $('expenseEmptyHint').textContent = t('expenseEmptyDefault');
  if(noneMatch){
    $('expenseEmptyHint').style.display = 'block';
    $('expenseEmptyHint').textContent = t('expenseEmptyForPayer');
  }
  expenses.forEach(exp => {
    const li = document.createElement('li');
    const payerName = byId[exp.payer] || '—';
    const sharedByEveryone = exp.participants.length === state.people.length;
    const subLine = sharedByEveryone
      ? t('expenseSubLineEveryone', escapeHtml(payerName))
      : t('expenseSubLine', escapeHtml(payerName), escapeHtml(exp.participants.map(id => byId[id]).filter(Boolean).join(', ')));
    li.innerHTML = `
      <div class="exp-top"><span>${escapeHtml(exp.desc)}</span><span>${fmt(exp.amount)}</span></div>
      <div class="exp-sub">${subLine}</div>
    `;
    const actions = document.createElement('div');
    actions.className = 'exp-actions';
    const edit = document.createElement('button');
    edit.className = 'exp-edit';
    edit.textContent = t('editBtn');
    edit.onclick = () => openEditExpenseModal(exp.id);
    actions.appendChild(edit);
    const del = document.createElement('button');
    del.className = 'exp-del';
    del.textContent = t('deleteBtn');
    del.onclick = () => { state.expenses = state.expenses.filter(e => e.id !== exp.id); save(); render(); };
    actions.appendChild(del);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

/* ---------- Totals per person (montant payé) ---------- */
function computeTotals(){
  const totals = {};
  state.people.forEach(p => totals[p.id] = { amount: 0, count: 0 });
  state.expenses.forEach(exp => {
    if(totals[exp.payer]){
      totals[exp.payer].amount += exp.amount;
      totals[exp.payer].count += 1;
    }
  });
  return totals;
}

/* True only when every expense is shared between all current travelers —
   otherwise a single "average per person" figure is misleading (e.g. one
   expense split among 2 of 4 people skews it), so the line stays hidden. */
function allExpensesShareEveryone(){
  if(state.expenses.length === 0) return false;
  return state.expenses.every(exp => exp.participants.length === state.people.length);
}

function renderTotals(){
  const wrap = $('totalsList');
  wrap.innerHTML = '';
  const hasData = state.people.length > 0 && state.expenses.length > 0;
  $('totalsEmptyHint').style.display = hasData ? 'none' : 'block';
  const showAvg = hasData && allExpensesShareEveryone();
  $('avgLine').style.display = showAvg ? 'block' : 'none';
  if(!hasData) return;
  const totals = computeTotals();
  if(showAvg){
    const totalAmount = state.expenses.reduce((s, e) => s + e.amount, 0);
    const totalPeopleCount = countPeople();
    const avg = totalAmount / totalPeopleCount;
    $('avgLine').innerHTML = t('avgLine', fmt(avg), fmt(totalAmount), totalPeopleCount);
  }
  // Only travelers who actually paid for something get a row here — a
  // "0 dépense · 0,00 €" line for someone who hasn't spent anything yet
  // is just noise in this particular table.
  state.people.forEach(p => {
    const personTotal = totals[p.id] || { amount: 0, count: 0 };
    if(personTotal.count === 0) return;
    const row = document.createElement('div');
    row.className = 'total-row';
    row.innerHTML = `<span>${escapeHtml(p.name)} <span class="total-count">${t('totalCount', personTotal.count)}</span></span>
      <span class="total-amount">${fmt(personTotal.amount)}</span>`;
    wrap.appendChild(row);
  });
}

/* ---------- Balances ---------- */
/* A participant's weight on one expense = their headcount (personSize)
   times their participation level for *that* expense (1 = 100% by
   default). Only set below 1 for someone who joined partway through and
   chose a reduced level in the "join expenses" catch-up modal — absent
   for every ordinary participant, so this stays a no-op almost always. */
function participantWeight(exp, pid, sizeById){
  const size = sizeById[pid] || 0;
  const level = (exp.participationLevels && exp.participationLevels[pid] !== undefined)
    ? exp.participationLevels[pid] : 1;
  return size * level;
}

function computeBalances(){
  const balance = {};
  const sizeById = {};
  state.people.forEach(p => { balance[p.id] = 0; sizeById[p.id] = personSize(p); });
  state.expenses.forEach(exp => {
    // Each participant's share is weighted by their headcount and, if set,
    // their reduced participation level — so someone at 50% pays half of
    // what a full participant of the same size would, and that missing
    // half is naturally absorbed by the others in proportion to their own
    // weight, since shares are computed as weight / totalWeight.
    const totalWeight = exp.participants.reduce((s, pid) => s + participantWeight(exp, pid, sizeById), 0);
    if(totalWeight <= 0) return;
    exp.participants.forEach(pid => {
      const weight = participantWeight(exp, pid, sizeById);
      if(pid in balance) balance[pid] -= exp.amount * weight / totalWeight;
    });
    if(exp.payer in balance) balance[exp.payer] += exp.amount;
  });
  return balance;
}

function renderBalances(){
  const wrap = $('balancesList');
  wrap.innerHTML = '';
  const hasData = state.people.length > 0 && state.expenses.length > 0;
  $('balEmptyHint').style.display = hasData ? 'none' : 'block';
  if(!hasData) return;
  const balance = computeBalances();
  state.people.forEach(p => {
    const val = balance[p.id] || 0;
    const row = document.createElement('div');
    row.className = 'bal-row';
    const cls = Math.abs(val) < 0.005 ? 'bal-zero' : (val > 0 ? 'bal-pos' : 'bal-neg');
    const label = Math.abs(val) < 0.005 ? t('balanceUpToDate') : (val > 0 ? t('balanceOwesReceive') : t('balanceOwes'));
    row.innerHTML = `<span>${escapeHtml(p.name)} <span style="color:var(--ink-soft); font-size:12px;">${label}</span></span>
      <span class="bal-amount ${cls}">${fmt(Math.abs(val))}</span>`;
    wrap.appendChild(row);
  });
}

/* ---------- Settlement (greedy min-transactions) ---------- */
function computeSettlement(){
  const balance = computeBalances();
  const debtors = [];
  const creditors = [];
  Object.entries(balance).forEach(([id, val]) => {
    if(val < -0.005) debtors.push({ id, amount: -val });
    else if(val > 0.005) creditors.push({ id, amount: val });
  });
  debtors.sort((a,b) => b.amount - a.amount);
  creditors.sort((a,b) => b.amount - a.amount);

  const tx = [];
  let i = 0, j = 0;
  while(i < debtors.length && j < creditors.length){
    const d = debtors[i], c = creditors[j];
    const amt = Math.min(d.amount, c.amount);
    tx.push({ from: d.id, to: c.id, amount: amt });
    d.amount -= amt; c.amount -= amt;
    if(d.amount < 0.005) i++;
    if(c.amount < 0.005) j++;
  }
  return tx;
}

function renderSettlementFilter(){
  const wrap = $('settlementFilter');
  wrap.innerHTML = '';
  if(state.people.length === 0) return;

  // drop filter entries for people that no longer exist
  const validIds = new Set(state.people.map(p => p.id));
  settlementFilter.forEach(id => { if(!validIds.has(id)) settlementFilter.delete(id); });

  const allChip = document.createElement('div');
  allChip.className = 'chip chip-filter chip-all' + (settlementFilter.size === 0 ? ' active' : '');
  allChip.textContent = t('allChipLabel');
  allChip.onclick = () => { settlementFilter.clear(); renderSettlementFilter(); renderSettlement(); };
  wrap.appendChild(allChip);

  state.people.forEach(p => {
    const chip = document.createElement('div');
    chip.className = 'chip chip-filter' + (settlementFilter.has(p.id) ? ' active' : '');
    chip.textContent = p.name;
    chip.onclick = () => {
      if(settlementFilter.has(p.id)) settlementFilter.delete(p.id);
      else settlementFilter.add(p.id);
      renderSettlementFilter();
      renderSettlement();
    };
    wrap.appendChild(chip);
  });
}

function renderSettlement(){
  const wrap = $('settlementTickets');
  const countLine = $('settlementCount');
  const copyBtn = $('settlementCopyBtn');
  wrap.innerHTML = '';
  if(state.people.length === 0 || state.expenses.length === 0){
    countLine.style.display = 'none';
    copyBtn.hidden = true;
    return;
  }
  const byId = Object.fromEntries(state.people.map(p => [p.id, p.name]));
  let tx = computeSettlement();
  if(settlementFilter.size > 0){
    tx = tx.filter(txItem => settlementFilter.has(txItem.from) || settlementFilter.has(txItem.to));
  }
  if(tx.length === 0){
    countLine.style.display = 'none';
    copyBtn.hidden = true;
    const msg = settlementFilter.size > 0
      ? t('settlementEmptyFiltered')
      : t('settlementEmptyAllSettled');
    wrap.innerHTML = `<div class="all-settled">${msg}</div>`;
    return;
  }
  countLine.style.display = 'block';
  countLine.textContent = t('settlementTxCount', tx.length);
  // Exports exactly what's currently shown — the traveler filter included.
  copyBtn.hidden = false;
  tx.forEach(txItem => {
    const el = document.createElement('div');
    el.className = 'ticket';
    el.innerHTML = `
      <div class="t-from">
        <span class="t-label">${t('fromLabel')}</span>
        <span class="t-name">${escapeHtml(byId[txItem.from] || '—')}</span>
      </div>
      <div class="t-mid">
        <span class="t-arrow">→</span>
        <span class="t-amount">${fmt(txItem.amount)}</span>
      </div>
      <div class="t-to">
        <span class="t-label">${t('toLabel')}</span>
        <span class="t-name">${escapeHtml(byId[txItem.to] || '—')}</span>
      </div>
      <div class="ticket-stub-line"></div>
    `;
    wrap.appendChild(el);
  });
}

/* Copies just the final settlement (who owes what to whom) as plain text —
   deliberately not the underlying expenses/balances, so nobody is tempted
   to "double-check" by hand without accounting for each expense's own,
   possibly different, set of participants. Matches whatever the traveler
   filter is currently showing on screen, not necessarily the full list. */
$('settlementCopyBtn').addEventListener('click', () => {
  const byId = Object.fromEntries(state.people.map(p => [p.id, p.name]));
  let tx = computeSettlement();
  if(settlementFilter.size > 0){
    tx = tx.filter(txItem => settlementFilter.has(txItem.from) || settlementFilter.has(txItem.to));
  }
  if(tx.length === 0) return;
  // A blank line between each debtor's group of lines (not between every
  // single line) makes a long list easier to scan — tx is already grouped
  // by "from" since that's how the settlement algorithm produces it.
  const lines = [];
  let previousFrom = null;
  tx.forEach(txItem => {
    if(previousFrom !== null && txItem.from !== previousFrom) lines.push('');
    lines.push(t('settlementExportLine', byId[txItem.from] || '—', fmt(txItem.amount), byId[txItem.to] || '—'));
    previousFrom = txItem.from;
  });
  const text = `${state.tripName || t('defaultTripName')}\n\n${lines.join('\n')}`;
  const btn = $('settlementCopyBtn');
  const originalLabel = t('copySettlementBtn');
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = t('copySettlementCopiedBtn');
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = originalLabel;
      btn.classList.remove('copied');
    }, 1500);
  }).catch(() => {
    showAlert(t('copySettlementError'));
  });
});

/* ---------- misc ---------- */
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

$('tripName').addEventListener('input', (e) => { state.tripName = e.target.value; save(); });

/* ---------- Export / Import JSON file ---------- */
function slugify(str){
  return (str || 'vacances')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'vacances';
}

$('exportBtn').addEventListener('click', () => {
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = slugify(state.tripName) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

$('importBtn').addEventListener('click', () => $('importInput').click());

$('importInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try{
      const parsed = JSON.parse(ev.target.result);
      if(!parsed || !Array.isArray(parsed.people) || !Array.isArray(parsed.expenses)){
        showAlert(t('importInvalidFile'));
        return;
      }
      state = {
        tripName: parsed.tripName || t('defaultTripName'),
        people: parsed.people.map(p => ({ ...p, size: (p.size && p.size >= 1) ? p.size : 1 })),
        expenses: parsed.expenses
      };
      selectedParticipants = new Set(state.people.map(p => p.id));
      participantsInitialized = true;
      settlementFilter = new Set();
      expensePayerFilter = new Set();
      save();
      render();
    }catch(err){
      showAlert(t('importParseError'));
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

$('resetBtn').addEventListener('click', () => {
  showConfirm(t('resetConfirm'), { danger: true }).then(sure => {
    if(!sure) return;
    state = { tripName: t('defaultTripName'), people: [], expenses: [] };
    selectedParticipants = new Set();
    participantsInitialized = false;
    settlementFilter = new Set();
    expensePayerFilter = new Set();
    save();
    render();
  });
});

load();
