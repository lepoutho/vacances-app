/* ---------- Edit-expense modal ----------
   Opened from the "Modifier" link next to each expense in the list;
   edits an existing expense in place (description, amount, payer,
   participants). Depends on globals defined in app.js ($, state, save,
   render, t) — must be loaded after it. */
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

function renderEditExpenseParticipants(){
  const wrap = $('editExpenseParticipants');
  wrap.innerHTML = '';
  const allSelected = state.people.length > 0 && state.people.every(p => editExpenseParticipants.has(p.id));

  const allChip = document.createElement('div');
  allChip.className = 'chip chip-all' + (allSelected ? ' active' : '');
  allChip.textContent = t('allChipLabel');
  allChip.onclick = () => {
    if(allSelected) editExpenseParticipants.clear();
    else state.people.forEach(p => editExpenseParticipants.add(p.id));
    renderEditExpenseParticipants();
  };
  wrap.appendChild(allChip);

  state.people.forEach(p => {
    const chip = document.createElement('div');
    chip.className = 'chip' + (editExpenseParticipants.has(p.id) ? ' active' : '');
    chip.textContent = p.name;
    chip.onclick = () => {
      if(editExpenseParticipants.has(p.id)) editExpenseParticipants.delete(p.id);
      else editExpenseParticipants.add(p.id);
      renderEditExpenseParticipants();
    };
    wrap.appendChild(chip);
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
  renderEditExpenseParticipants();
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
