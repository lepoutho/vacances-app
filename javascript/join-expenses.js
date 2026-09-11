/* ---------- Join-existing-expenses modal ----------
   Shown right after adding a new traveler, when expenses already exist,
   so they can opt into the ones they were actually part of instead of
   being left out of every past expense by default. For each expense they
   opt into, they can also set a reduced "participation level" (e.g. 50%
   for someone joining a 10-day rental on day 5) — stored sparsely on the
   expense itself (exp.participationLevels[personId]) and left absent for
   everyone else, so ordinary expenses are entirely unaffected by it.
   Depends on globals defined in app.js ($, state, save, render, fmt,
   escapeHtml) — must be loaded after it. */
let joinExpensesPersonId = null;

function renderJoinExpensesItems(){
  const wrap = $('joinExpensesItems');
  wrap.innerHTML = '';
  const byId = Object.fromEntries(state.people.map(p => [p.id, p.name]));
  // Compare against everyone *except* the traveler currently being onboarded
  // (already added to state.people before this modal opens) — otherwise
  // every pre-existing expense would look "partial" just for missing them.
  const otherPeopleCount = state.people.length - 1;
  let hasPartial = false;
  state.expenses.forEach(exp => {
    const isPartial = exp.participants.length < otherPeopleCount;
    if(isPartial) hasPartial = true;
    const payerName = byId[exp.payer] || '—';
    const row = document.createElement('div');
    row.className = 'join-expense-row' + (isPartial ? ' join-expense-row-partial' : '');
    row.innerHTML = `
      <label class="join-expense-label">
        <input type="checkbox" data-expense-id="${exp.id}"/>
        <span class="join-expense-info">
          <span class="join-expense-top">
            <span class="join-expense-desc">${escapeHtml(exp.desc)}</span>
            <span class="join-expense-amount">${fmt(exp.amount)}</span>
          </span>
          <span class="join-expense-payer">${t('payerSelectPrefix')}${escapeHtml(payerName)}</span>
        </span>
      </label>
      <div class="join-expense-level" hidden>
        <span class="join-expense-level-label">${escapeHtml(t('joinExpensesLevelLabel'))}</span>
        <input type="number" class="join-expense-level-input" min="5" max="100" step="5" value="100" title="${escapeHtml(t('joinExpensesLevelTitle'))}"/>
        <span class="join-expense-level-suffix">%</span>
      </div>
    `;
    wrap.appendChild(row);
  });
  const note = $('joinExpensesPartialNote');
  note.hidden = !hasPartial;
  if(hasPartial) note.textContent = t('joinExpensesPartialNote');
}

function updateJoinExpensesAllCheckbox(){
  const boxes = Array.from(document.querySelectorAll('#joinExpensesItems input[type="checkbox"]'));
  $('joinExpensesAllCheckbox').checked = boxes.length > 0 && boxes.every(b => b.checked);
}

function openJoinExpensesModal(personId){
  joinExpensesPersonId = personId;
  renderJoinExpensesItems();
  $('joinExpensesAllCheckbox').checked = false;
  $('joinExpensesModal').hidden = false;
}

function closeJoinExpensesModal(){
  $('joinExpensesModal').hidden = true;
  joinExpensesPersonId = null;
}

$('joinExpensesAllCheckbox').addEventListener('change', (e) => {
  const checked = e.target.checked;
  document.querySelectorAll('#joinExpensesItems input[type="checkbox"]').forEach(b => {
    b.checked = checked;
    b.closest('.join-expense-row').querySelector('.join-expense-level').hidden = !checked;
  });
});

$('joinExpensesItems').addEventListener('change', (e) => {
  if(e.target.matches('input[type="checkbox"]')){
    updateJoinExpensesAllCheckbox();
    e.target.closest('.join-expense-row').querySelector('.join-expense-level').hidden = !e.target.checked;
  }
});

$('joinExpensesConfirmBtn').addEventListener('click', () => {
  if(joinExpensesPersonId){
    const checkedBoxes = Array.from(document.querySelectorAll('#joinExpensesItems input[type="checkbox"]:checked'));
    checkedBoxes.forEach(cb => {
      const expenseId = cb.getAttribute('data-expense-id');
      const exp = state.expenses.find(e => e.id === expenseId);
      if(!exp || exp.participants.includes(joinExpensesPersonId)) return;
      exp.participants.push(joinExpensesPersonId);
      const levelInput = cb.closest('.join-expense-row').querySelector('.join-expense-level-input');
      let level = parseInt(levelInput.value, 10);
      if(!Number.isFinite(level) || level < 1) level = 100;
      if(level > 100) level = 100;
      if(level !== 100){
        exp.participationLevels = exp.participationLevels || {};
        exp.participationLevels[joinExpensesPersonId] = level / 100;
      }
    });
    if(checkedBoxes.length > 0){ save(); render(); }
  }
  closeJoinExpensesModal();
});

$('joinExpensesModal').addEventListener('click', (e) => {
  if(e.target === $('joinExpensesModal')) closeJoinExpensesModal();
});

document.addEventListener('keydown', (e) => {
  if($('joinExpensesModal').hidden) return;
  if(e.key === 'Escape') closeJoinExpensesModal();
  // No dedicated Cancel button here, so nothing to defer to — any Enter
  // confirms (redundant but harmless if Confirm itself already has focus).
  else if(e.key === 'Enter') $('joinExpensesConfirmBtn').click();
});
