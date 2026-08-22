const STORAGE_KEY = 'vacances-trip-v1';
let state = { tripName: 'Nos vacances', people: [], expenses: [] };
let selectedParticipants = new Set();
let settlementFilter = new Set(); // empty = everyone
let expensePayerFilter = new Set(); // empty = everyone

const $ = (id) => document.getElementById(id);

function uid(){ return Math.random().toString(36).slice(2, 9); }

function fmt(n){
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
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
  render();
}

function render(){
  $('tripName').value = state.tripName || 'Nos vacances';
  renderPeople();
  renderPayerSelect();
  renderParticipantChips();
  renderExpensePayerFilter();
  renderExpenses();
  renderTotals();
  renderBalances();
  renderSettlementFilter();
  renderSettlement();
  $('headerSummary').textContent =
    `${state.people.length} voyageur${state.people.length>1?'s':''} · ${state.expenses.length} dépense${state.expenses.length>1?'s':''}`;
}

/* ---------- People ---------- */
function renderPeople(){
  const list = $('peopleList');
  list.innerHTML = '';
  $('peopleEmptyHint').style.display = state.people.length ? 'none' : 'block';
  state.people.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${escapeHtml(p.name)}</span>`;
    const btn = document.createElement('button');
    btn.textContent = '✕';
    btn.title = 'Retirer ' + p.name;
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
  const name = input.value.trim();
  if(!name) return;
  const person = { id: uid(), name };
  state.people.push(person);
  selectedParticipants.add(person.id);
  input.value = '';
  save(); render();
  input.focus();
});

/* ---------- Expense form helpers ---------- */
function renderPayerSelect(){
  const sel = $('expensePayer');
  const prev = sel.value;
  sel.innerHTML = '';
  if(state.people.length === 0){
    sel.innerHTML = '<option value="">Ajoute un voyageur</option>';
    sel.disabled = true;
    return;
  }
  sel.disabled = false;
  state.people.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id; opt.textContent = 'Payé par ' + p.name;
    sel.appendChild(opt);
  });
  if(state.people.some(p => p.id === prev)) sel.value = prev;
}

function renderParticipantChips(){
  const wrap = $('expenseParticipants');
  wrap.innerHTML = '';
  if(state.people.length === 0) return;
  state.people.forEach(p => {
    if(!selectedParticipants.has(p.id) && selectedParticipants.size === 0){
      selectedParticipants.add(p.id);
    }
  });
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

$('expenseForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const desc = $('expenseDesc').value.trim();
  const amount = parseFloat($('expenseAmount').value);
  const payer = $('expensePayer').value;
  const participants = Array.from(selectedParticipants);
  if(!desc || !amount || amount <= 0 || !payer || participants.length === 0) return;

  state.expenses.push({ id: uid(), desc, amount, payer, participants });
  $('expenseDesc').value = '';
  $('expenseAmount').value = '';
  save(); render();
  $('expenseDesc').focus();
});

function renderExpensePayerFilter(){
  const wrap = $('expensePayerFilter');
  wrap.innerHTML = '';
  if(state.people.length === 0) return;

  const validIds = new Set(state.people.map(p => p.id));
  expensePayerFilter.forEach(id => { if(!validIds.has(id)) expensePayerFilter.delete(id); });

  const allChip = document.createElement('div');
  allChip.className = 'chip chip-all' + (expensePayerFilter.size === 0 ? ' active' : '');
  allChip.textContent = 'Tous';
  allChip.onclick = () => { expensePayerFilter.clear(); renderExpensePayerFilter(); renderExpenses(); };
  wrap.appendChild(allChip);

  state.people.forEach(p => {
    const chip = document.createElement('div');
    chip.className = 'chip' + (expensePayerFilter.has(p.id) ? ' active' : '');
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
  $('expenseEmptyHint').textContent = "Aucune dépense pour l'instant.";
  if(noneMatch){
    $('expenseEmptyHint').style.display = 'block';
    $('expenseEmptyHint').textContent = "Aucune dépense pour ce payeur.";
  }
  expenses.forEach(exp => {
    const li = document.createElement('li');
    const payerName = byId[exp.payer] || '—';
    const shareNames = exp.participants.map(id => byId[id]).filter(Boolean).join(', ');
    li.innerHTML = `
      <div class="exp-top"><span>${escapeHtml(exp.desc)}</span><span>${fmt(exp.amount)}</span></div>
      <div class="exp-sub">Payé par ${escapeHtml(payerName)} · partagé entre ${escapeHtml(shareNames)}</div>
    `;
    const del = document.createElement('button');
    del.className = 'exp-del';
    del.textContent = 'Supprimer';
    del.onclick = () => { state.expenses = state.expenses.filter(e => e.id !== exp.id); save(); render(); };
    li.appendChild(del);
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

function renderTotals(){
  const wrap = $('totalsList');
  wrap.innerHTML = '';
  const hasData = state.people.length > 0 && state.expenses.length > 0;
  $('totalsEmptyHint').style.display = hasData ? 'none' : 'block';
  $('avgLine').style.display = hasData ? 'block' : 'none';
  if(!hasData) return;
  const totals = computeTotals();
  const totalAmount = state.expenses.reduce((s, e) => s + e.amount, 0);
  const avg = totalAmount / state.people.length;
  $('avgLine').innerHTML = `Dépense moyenne par personne : <strong>${fmt(avg)}</strong> (total ${fmt(totalAmount)} sur ${state.people.length} voyageur${state.people.length > 1 ? 's' : ''})`;
  state.people.forEach(p => {
    const t = totals[p.id] || { amount: 0, count: 0 };
    const row = document.createElement('div');
    row.className = 'total-row';
    row.innerHTML = `<span>${escapeHtml(p.name)} <span class="total-count">${t.count} dépense${t.count > 1 ? 's' : ''}</span></span>
      <span class="total-amount">${fmt(t.amount)}</span>`;
    wrap.appendChild(row);
  });
}

/* ---------- Balances ---------- */
function computeBalances(){
  const balance = {};
  state.people.forEach(p => balance[p.id] = 0);
  state.expenses.forEach(exp => {
    const share = exp.amount / exp.participants.length;
    exp.participants.forEach(pid => { if(pid in balance) balance[pid] -= share; });
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
    const label = Math.abs(val) < 0.005 ? 'à jour' : (val > 0 ? 'doit recevoir' : 'doit');
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
  allChip.className = 'chip chip-all' + (settlementFilter.size === 0 ? ' active' : '');
  allChip.textContent = 'Tous';
  allChip.onclick = () => { settlementFilter.clear(); renderSettlementFilter(); renderSettlement(); };
  wrap.appendChild(allChip);

  state.people.forEach(p => {
    const chip = document.createElement('div');
    chip.className = 'chip' + (settlementFilter.has(p.id) ? ' active' : '');
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
  wrap.innerHTML = '';
  if(state.people.length === 0 || state.expenses.length === 0) return;
  const byId = Object.fromEntries(state.people.map(p => [p.id, p.name]));
  let tx = computeSettlement();
  if(settlementFilter.size > 0){
    tx = tx.filter(t => settlementFilter.has(t.from) || settlementFilter.has(t.to));
  }
  if(tx.length === 0){
    const msg = settlementFilter.size > 0
      ? "Aucun remboursement concernant les voyageurs sélectionnés."
      : "Les comptes sont équilibrés — personne ne doit rien à personne.";
    wrap.innerHTML = `<div class="all-settled">${msg}</div>`;
    return;
  }
  tx.forEach(t => {
    const el = document.createElement('div');
    el.className = 'ticket';
    el.innerHTML = `
      <div class="t-from">
        <span class="t-label">De</span>
        <span class="t-name">${escapeHtml(byId[t.from] || '—')}</span>
      </div>
      <div class="t-mid">
        <span class="t-arrow">→</span>
        <span class="t-amount">${fmt(t.amount)}</span>
      </div>
      <div class="t-to">
        <span class="t-label">À</span>
        <span class="t-name">${escapeHtml(byId[t.to] || '—')}</span>
      </div>
      <div class="ticket-stub-line"></div>
    `;
    wrap.appendChild(el);
  });
}

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
        alert("Ce fichier ne semble pas être une sauvegarde valide de l'appli Vacances.");
        return;
      }
      state = {
        tripName: parsed.tripName || 'Nos vacances',
        people: parsed.people,
        expenses: parsed.expenses
      };
      selectedParticipants = new Set(state.people.map(p => p.id));
      settlementFilter = new Set();
      expensePayerFilter = new Set();
      save();
      render();
    }catch(err){
      alert("Impossible de lire ce fichier JSON.");
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

$('resetBtn').addEventListener('click', () => {
  const sure = confirm("Réinitialiser va effacer tous les voyageurs, dépenses et le nom du voyage. Cette action est irréversible. Continuer ?");
  if(!sure) return;
  state = { tripName: 'Nos vacances', people: [], expenses: [] };
  selectedParticipants = new Set();
  settlementFilter = new Set();
  expensePayerFilter = new Set();
  save();
  render();
});

load();
