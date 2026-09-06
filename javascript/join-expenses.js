/* ---------- Join-existing-expenses modal ----------
   Shown right after adding a new traveler, when expenses already exist,
   so they can opt into the ones they were actually part of instead of
   being left out of every past expense by default.
   Depends on globals defined in app.js ($, state, save, render, fmt,
   escapeHtml) — must be loaded after it. */
let joinExpensesPersonId = null;

function renderJoinExpensesItems(){
  const wrap = $('joinExpensesItems');
  wrap.innerHTML = '';
  state.expenses.forEach(exp => {
    const row = document.createElement('label');
    row.className = 'join-expense-row';
    row.innerHTML = `
      <input type="checkbox" data-expense-id="${exp.id}"/>
      <span class="join-expense-desc">${escapeHtml(exp.desc)}</span>
      <span class="join-expense-amount">${fmt(exp.amount)}</span>
    `;
    wrap.appendChild(row);
  });
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
  document.querySelectorAll('#joinExpensesItems input[type="checkbox"]').forEach(b => { b.checked = checked; });
});

$('joinExpensesItems').addEventListener('change', (e) => {
  if(e.target.matches('input[type="checkbox"]')) updateJoinExpensesAllCheckbox();
});

$('joinExpensesConfirmBtn').addEventListener('click', () => {
  if(joinExpensesPersonId){
    const checkedIds = Array.from(document.querySelectorAll('#joinExpensesItems input[type="checkbox"]:checked'))
      .map(cb => cb.getAttribute('data-expense-id'));
    if(checkedIds.length > 0){
      const idSet = new Set(checkedIds);
      state.expenses.forEach(exp => {
        if(idSet.has(exp.id) && !exp.participants.includes(joinExpensesPersonId)){
          exp.participants.push(joinExpensesPersonId);
        }
      });
      save(); render();
    }
  }
  closeJoinExpensesModal();
});

$('joinExpensesModal').addEventListener('click', (e) => {
  if(e.target === $('joinExpensesModal')) closeJoinExpensesModal();
});

document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && !$('joinExpensesModal').hidden) closeJoinExpensesModal();
});
