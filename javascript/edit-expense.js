/* ---------- Edit-expense modal ----------
   Opened from the "Modifier" link next to each expense in the list;
   edits an existing expense in place (description, amount, payer,
   participants, and — reusing the same row+percentage UI as the
   "join expenses" catch-up modal — each participant's participation
   level, so a reduced share set there can also be reviewed and changed
   later). Depends on globals defined in app.js ($, state, save, render,
   t, escapeHtml) — must be loaded after it. */
let editingExpenseId = null;
let editExpenseParticipants = new Set();

function renderEditExpensePayerSelect(){
  const sel = $('editExpensePayer');
  sel.innerHTML = '';
  state.people.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id; opt.textContent = t('payerSelectPrefix') + p.name;
    sel.appendChild(opt);
  });
}

/* Recomputes and displays, next to each participant's name, exactly how
   many euros this specific expense currently commits them to — live, as
   the amount, the checked participants, or a participation level changes
   in the form, before anything is saved. Same weighted-share formula as
   computeBalances() (weight = headcount × participation level), just
   scoped to this one expense's own amount field instead of the trip total. */
function updateEditExpenseShares(){
  const amount = parseFloat($('editExpenseAmount').value) || 0;
  const sizeById = Object.fromEntries(state.people.map(p => [p.id, personSize(p)]));
  const rows = Array.from(document.querySelectorAll('#editExpenseParticipants .edit-expense-person-row'));
  const weights = {};
  let totalWeight = 0;
  rows.forEach(row => {
    const checkbox = row.querySelector('input[type="checkbox"]');
    const pid = checkbox.getAttribute('data-person-id');
    if(!checkbox.checked){ weights[pid] = 0; return; }
    const levelInput = row.querySelector('.edit-expense-level-input');
    const levelPercent = levelInput ? (parseInt(levelInput.value, 10) || 0) : 100;
    const weight = (sizeById[pid] || 1) * (levelPercent / 100);
    weights[pid] = weight;
    totalWeight += weight;
  });
  rows.forEach(row => {
    const checkbox = row.querySelector('input[type="checkbox"]');
    const pid = checkbox.getAttribute('data-person-id');
    const shareSpan = row.querySelector('.edit-expense-share');
    const share = (checkbox.checked && totalWeight > 0) ? amount * weights[pid] / totalWeight : 0;
    shareSpan.textContent = `→ ${fmt(share)}`;
  });
}

function renderEditExpenseParticipants(existingLevels){
  existingLevels = existingLevels || {};
  const wrap = $('editExpenseParticipants');
  wrap.innerHTML = '';

  const allSelected = state.people.length > 0 && state.people.every(p => editExpenseParticipants.has(p.id));
  const allRow = document.createElement('label');
  allRow.className = 'join-expense-row join-expense-all';
  const allCheckbox = document.createElement('input');
  allCheckbox.type = 'checkbox';
  allCheckbox.checked = allSelected;
  const allLabel = document.createElement('span');
  allLabel.textContent = t('allChipLabel');
  allRow.appendChild(allCheckbox);
  allRow.appendChild(allLabel);
  wrap.appendChild(allRow);

  allCheckbox.addEventListener('change', () => {
    const checked = allCheckbox.checked;
    wrap.querySelectorAll('.edit-expense-person-row input[type="checkbox"]').forEach(cb => {
      cb.checked = checked;
      const pid = cb.getAttribute('data-person-id');
      if(checked) editExpenseParticipants.add(pid);
      else editExpenseParticipants.delete(pid);
      cb.closest('.join-expense-row').querySelector('.join-expense-level').hidden = !checked;
    });
    updateEditExpenseShares();
  });

  state.people.forEach(p => {
    const checked = editExpenseParticipants.has(p.id);
    const levelFraction = existingLevels[p.id] !== undefined ? existingLevels[p.id] : 1;
    const levelPercent = Math.round(levelFraction * 100);

    const row = document.createElement('div');
    row.className = 'join-expense-row edit-expense-person-row';

    const label = document.createElement('label');
    label.className = 'join-expense-label';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    checkbox.setAttribute('data-person-id', p.id);
    const nameSpan = document.createElement('span');
    nameSpan.className = 'join-expense-desc';
    nameSpan.textContent = p.name;
    const shareSpan = document.createElement('span');
    shareSpan.className = 'edit-expense-share';
    label.appendChild(checkbox);
    label.appendChild(nameSpan);
    label.appendChild(shareSpan);

    const levelWrap = document.createElement('div');
    levelWrap.className = 'join-expense-level';
    levelWrap.hidden = !checked;
    const levelLabel = document.createElement('span');
    levelLabel.className = 'join-expense-level-label';
    levelLabel.textContent = t('joinExpensesLevelLabel');
    const levelInput = document.createElement('input');
    levelInput.type = 'number';
    levelInput.className = 'edit-expense-level-input';
    levelInput.min = '5'; levelInput.max = '100'; levelInput.step = '5';
    levelInput.value = String(levelPercent);
    levelInput.title = t('joinExpensesLevelTitle');
    levelInput.setAttribute('data-person-id', p.id);
    levelInput.addEventListener('blur', (e) => { clampLevelInputOnBlur(e); updateEditExpenseShares(); });
    levelInput.addEventListener('input', updateEditExpenseShares);

    const stepper = document.createElement('div');
    stepper.className = 'level-stepper';
    const minusBtn = document.createElement('button');
    minusBtn.type = 'button';
    minusBtn.className = 'level-step-btn';
    minusBtn.textContent = '−';
    minusBtn.setAttribute('aria-label', '-5%');
    minusBtn.addEventListener('click', () => { stepLevelInput(levelInput, -5); updateEditExpenseShares(); });
    const plusBtn = document.createElement('button');
    plusBtn.type = 'button';
    plusBtn.className = 'level-step-btn';
    plusBtn.textContent = '+';
    plusBtn.setAttribute('aria-label', '+5%');
    plusBtn.addEventListener('click', () => { stepLevelInput(levelInput, 5); updateEditExpenseShares(); });
    stepper.appendChild(minusBtn);
    stepper.appendChild(levelInput);
    stepper.appendChild(plusBtn);

    const levelSuffix = document.createElement('span');
    levelSuffix.className = 'join-expense-level-suffix';
    levelSuffix.textContent = '%';
    levelWrap.appendChild(levelLabel);
    levelWrap.appendChild(stepper);
    levelWrap.appendChild(levelSuffix);

    checkbox.addEventListener('change', () => {
      if(checkbox.checked) editExpenseParticipants.add(p.id);
      else editExpenseParticipants.delete(p.id);
      levelWrap.hidden = !checkbox.checked;
      allCheckbox.checked = state.people.length > 0 && state.people.every(pp => editExpenseParticipants.has(pp.id));
      updateEditExpenseShares();
    });

    row.appendChild(label);
    row.appendChild(levelWrap);
    wrap.appendChild(row);
  });

  updateEditExpenseShares();
}

// Amount field is static markup (unlike the participant rows, which are
// rebuilt on every render), so this listener is attached once here rather
// than inside renderEditExpenseParticipants — attaching it there would
// stack up a duplicate listener each time the modal is reopened.
$('editExpenseAmount').addEventListener('input', updateEditExpenseShares);

function openEditExpenseModal(expenseId){
  const exp = state.expenses.find(e => e.id === expenseId);
  if(!exp) return;
  editingExpenseId = expenseId;
  $('editExpenseDesc').value = exp.desc;
  $('editExpenseAmount').value = exp.amount;
  renderEditExpensePayerSelect();
  $('editExpensePayer').value = exp.payer;
  editExpenseParticipants = new Set(exp.participants);
  renderEditExpenseParticipants(exp.participationLevels);
  $('editExpenseModal').hidden = false;
}

function closeEditExpenseModal(){
  $('editExpenseModal').hidden = true;
  editingExpenseId = null;
}

$('editExpenseSaveBtn').addEventListener('click', () => {
  if(!editingExpenseId){ closeEditExpenseModal(); return; }
  const desc = $('editExpenseDesc').value.trim();
  const amount = parseFloat($('editExpenseAmount').value);
  const payer = $('editExpensePayer').value;
  const participants = Array.from(editExpenseParticipants);
  if(!desc || !amount || amount <= 0 || !payer || participants.length === 0) return;

  const exp = state.expenses.find(e => e.id === editingExpenseId);
  if(exp){
    exp.desc = desc;
    exp.amount = amount;
    exp.payer = payer;
    exp.participants = participants;

    // Rebuilt fresh from the current checked rows each time — sparse on
    // purpose, only participants left below 100% end up stored at all.
    const newLevels = {};
    participants.forEach(pid => {
      const input = document.querySelector(`.edit-expense-level-input[data-person-id="${pid}"]`);
      if(!input) return;
      const level = clampLevelValue(parseInt(input.value, 10), input);
      if(level !== 100) newLevels[pid] = level / 100;
    });
    if(Object.keys(newLevels).length > 0) exp.participationLevels = newLevels;
    else delete exp.participationLevels;

    save(); render();
  }
  closeEditExpenseModal();
});

$('editExpenseCancelBtn').addEventListener('click', closeEditExpenseModal);

$('editExpenseModal').addEventListener('click', (e) => {
  if(e.target === $('editExpenseModal')) closeEditExpenseModal();
});

document.addEventListener('keydown', (e) => {
  if($('editExpenseModal').hidden) return;
  if(e.key === 'Escape') closeEditExpenseModal();
  else if(e.key === 'Enter' && e.target !== $('editExpenseCancelBtn')) $('editExpenseSaveBtn').click();
});
