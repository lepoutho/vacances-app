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
    label.appendChild(checkbox);
    label.appendChild(nameSpan);

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
    const levelSuffix = document.createElement('span');
    levelSuffix.className = 'join-expense-level-suffix';
    levelSuffix.textContent = '%';
    levelWrap.appendChild(levelLabel);
    levelWrap.appendChild(levelInput);
    levelWrap.appendChild(levelSuffix);

    checkbox.addEventListener('change', () => {
      if(checkbox.checked) editExpenseParticipants.add(p.id);
      else editExpenseParticipants.delete(p.id);
      levelWrap.hidden = !checkbox.checked;
      allCheckbox.checked = state.people.length > 0 && state.people.every(pp => editExpenseParticipants.has(pp.id));
    });

    row.appendChild(label);
    row.appendChild(levelWrap);
    wrap.appendChild(row);
  });
}

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
      let level = parseInt(input.value, 10);
      if(!Number.isFinite(level) || level < 1) level = 100;
      if(level > 100) level = 100;
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
