/* ---------- Interface translations ---------- */
/* All user-facing labels, titles and dynamic strings for the Vacances app,
   grouped by language code. Loaded before javascript/app.js, which reads
   this global TRANSLATIONS object via the t() helper. */
const TRANSLATIONS = {
  en: {
    pageTitle: 'Vacations — Expense sharing',
    airlineMark: 'Vacations',
    defaultTripName: 'Our vacation',
    exportBtn: '⬇ Save .json file',
    importBtn: '⬆ Open .json file',
    resetBtn: '↺ Reset',

    peopleSectionTitle: 'Travelers',
    personNamePlaceholder: 'First name (e.g. Thomas-and-Marie)',
    representsLabel: 'represents',
    personSizeTitle: 'Number of people represented',
    addPersonBtn: 'Add',
    peopleEmptyHint: 'Add the people going on vacation.',
    removePersonTitle: (name) => `Remove ${name}`,
    personSizeBadge: (size) => `· ${size} people`,

    expenseSectionTitle: 'New expense',
    expenseDescPlaceholder: 'E.g. Restaurant, gas, lodging…',
    expenseAmountPlaceholder: 'Amount €',
    payerSelectEmpty: 'Add a traveler',
    payerSelectPrefix: 'Paid by ',
    sharedBetweenLabel: 'Shared between',
    addExpenseBtn: 'Add expense',
    filterByPayerLabel: 'Filter by payer',
    expenseEmptyDefault: 'No expenses yet.',
    expenseEmptyForPayer: 'No expenses for this payer.',
    expenseSubLine: (payer, shares) => `Paid by ${payer} · shared between ${shares}`,
    deleteBtn: 'Delete',

    totalsSectionTitle: 'Expenses',
    totalsEmptyHint: 'Add travelers and expenses to see the breakdown.',
    avgLine: (avgFmt, totalFmt, count) =>
      `Average expense per person: <strong>${avgFmt}</strong> (total ${totalFmt} over ${count} ${count === 1 ? 'person' : 'people'})`,
    totalCount: (n) => `${n} ${n === 1 ? 'expense' : 'expenses'}`,

    balancesSectionTitle: 'Balances',
    balEmptyHint: 'Add travelers and expenses to see the balances.',
    balanceUpToDate: 'settled up',
    balanceOwesReceive: 'is owed',
    balanceOwes: 'owes',

    settlementSectionTitle: 'To settle up',
    filterByTravelerLabel: 'Filter by traveler',
    settlementEmptyFiltered: 'No repayments involving the selected travelers.',
    settlementEmptyAllSettled: 'Accounts are settled — nobody owes anybody anything.',
    fromLabel: 'From',
    toLabel: 'To',

    allChipLabel: 'All',
    headerSummary: (peopleCount, expenseCount) =>
      `${peopleCount} ${peopleCount === 1 ? 'person' : 'people'} · ${expenseCount} ${expenseCount === 1 ? 'expense' : 'expenses'}`,

    footerText: "This trip's data stays saved in your browser.",
    importInvalidFile: 'This file does not look like a valid Vacances app save.',
    importParseError: 'Unable to read this JSON file.',
    resetConfirm: 'Resetting will erase all travelers, expenses, and the trip name. This action cannot be undone. Continue?',
    modalOkBtn: 'OK',
    modalConfirmBtn: 'Continue',
    modalCancelBtn: 'Cancel'
  },

  es: {
    pageTitle: 'Vacaciones — Reparto de gastos',
    airlineMark: 'Vacaciones',
    defaultTripName: 'Nuestras vacaciones',
    exportBtn: '⬇ Guardar archivo .json',
    importBtn: '⬆ Abrir archivo .json',
    resetBtn: '↺ Reiniciar',

    peopleSectionTitle: 'Viajeros',
    personNamePlaceholder: 'Nombre (ej: Thomas-y-Marie)',
    representsLabel: 'representa',
    personSizeTitle: 'Número de personas representadas',
    addPersonBtn: 'Añadir',
    peopleEmptyHint: 'Añade a las personas que se van de vacaciones.',
    removePersonTitle: (name) => `Quitar a ${name}`,
    personSizeBadge: (size) => `· ${size} personas`,

    expenseSectionTitle: 'Nuevo gasto',
    expenseDescPlaceholder: 'Ej: Restaurante, gasolina, alojamiento…',
    expenseAmountPlaceholder: 'Importe €',
    payerSelectEmpty: 'Añade un viajero',
    payerSelectPrefix: 'Pagado por ',
    sharedBetweenLabel: 'Compartido entre',
    addExpenseBtn: 'Añadir gasto',
    filterByPayerLabel: 'Filtrar por pagador',
    expenseEmptyDefault: 'Todavía no hay gastos.',
    expenseEmptyForPayer: 'No hay gastos para este pagador.',
    expenseSubLine: (payer, shares) => `Pagado por ${payer} · compartido entre ${shares}`,
    deleteBtn: 'Eliminar',

    totalsSectionTitle: 'Gastos',
    totalsEmptyHint: 'Añade viajeros y gastos para ver el detalle.',
    avgLine: (avgFmt, totalFmt, count) =>
      `Gasto medio por persona: <strong>${avgFmt}</strong> (total ${totalFmt} entre ${count} persona${count === 1 ? '' : 's'})`,
    totalCount: (n) => `${n} gasto${n === 1 ? '' : 's'}`,

    balancesSectionTitle: 'Saldos',
    balEmptyHint: 'Añade viajeros y gastos para ver los saldos.',
    balanceUpToDate: 'al día',
    balanceOwesReceive: 'debe recibir',
    balanceOwes: 'debe',

    settlementSectionTitle: 'Para saldar cuentas',
    filterByTravelerLabel: 'Filtrar por viajero',
    settlementEmptyFiltered: 'Ningún reembolso relacionado con los viajeros seleccionados.',
    settlementEmptyAllSettled: 'Las cuentas están saldadas — nadie le debe nada a nadie.',
    fromLabel: 'De',
    toLabel: 'A',

    allChipLabel: 'Todos',
    headerSummary: (peopleCount, expenseCount) =>
      `${peopleCount} persona${peopleCount === 1 ? '' : 's'} · ${expenseCount} gasto${expenseCount === 1 ? '' : 's'}`,

    footerText: 'Los datos de este viaje se guardan en tu navegador.',
    importInvalidFile: 'Este archivo no parece ser una copia de seguridad válida de la app Vacaciones.',
    importParseError: 'No se pudo leer este archivo JSON.',
    resetConfirm: 'Reiniciar borrará todos los viajeros, gastos y el nombre del viaje. Esta acción no se puede deshacer. ¿Continuar?',
    modalOkBtn: 'Aceptar',
    modalConfirmBtn: 'Continuar',
    modalCancelBtn: 'Cancelar'
  },

  fr: {
    pageTitle: 'Vacances — Partage des dépenses',
    airlineMark: 'Vacances',
    defaultTripName: 'Nos vacances',
    exportBtn: '⬇ Enregistrer le fichier .json',
    importBtn: '⬆ Ouvrir le fichier .json',
    resetBtn: '↺ Réinitialiser',

    peopleSectionTitle: 'Voyageurs',
    personNamePlaceholder: 'Prénom (ex: Thomas-et-Marie)',
    representsLabel: 'représente',
    personSizeTitle: 'Nombre de personnes représentées',
    addPersonBtn: 'Ajouter',
    peopleEmptyHint: 'Ajoute les personnes qui partent en vacances.',
    removePersonTitle: (name) => `Retirer ${name}`,
    personSizeBadge: (size) => `· ${size} personnes`,

    expenseSectionTitle: 'Nouvelle dépense',
    expenseDescPlaceholder: 'Ex: Restaurant, essence, logement…',
    expenseAmountPlaceholder: 'Montant €',
    payerSelectEmpty: 'Ajoute un voyageur',
    payerSelectPrefix: 'Payé par ',
    sharedBetweenLabel: 'Partagée entre',
    addExpenseBtn: 'Ajouter la dépense',
    filterByPayerLabel: 'Filtrer par payeur',
    expenseEmptyDefault: "Aucune dépense pour l'instant.",
    expenseEmptyForPayer: 'Aucune dépense pour ce payeur.',
    expenseSubLine: (payer, shares) => `Payé par ${payer} · partagé entre ${shares}`,
    deleteBtn: 'Supprimer',

    totalsSectionTitle: 'Dépenses',
    totalsEmptyHint: 'Ajoute des voyageurs et des dépenses pour voir le détail.',
    avgLine: (avgFmt, totalFmt, count) =>
      `Dépense moyenne par personne : <strong>${avgFmt}</strong> (total ${totalFmt} sur ${count} personne${count > 1 ? 's' : ''})`,
    totalCount: (n) => `${n} dépense${n > 1 ? 's' : ''}`,

    balancesSectionTitle: 'Soldes',
    balEmptyHint: 'Ajoute des voyageurs et des dépenses pour voir les soldes.',
    balanceUpToDate: 'à jour',
    balanceOwesReceive: 'doit recevoir',
    balanceOwes: 'doit',

    settlementSectionTitle: 'Pour équilibrer les comptes',
    filterByTravelerLabel: 'Filtrer par voyageur',
    settlementEmptyFiltered: 'Aucun remboursement concernant les voyageurs sélectionnés.',
    settlementEmptyAllSettled: 'Les comptes sont équilibrés — personne ne doit rien à personne.',
    fromLabel: 'De',
    toLabel: 'À',

    allChipLabel: 'Tous',
    headerSummary: (peopleCount, expenseCount) =>
      `${peopleCount} personne${peopleCount > 1 ? 's' : ''} · ${expenseCount} dépense${expenseCount > 1 ? 's' : ''}`,

    footerText: 'Les données de ce voyage restent enregistrées dans ton navigateur.',
    importInvalidFile: "Ce fichier ne semble pas être une sauvegarde valide de l'appli Vacances.",
    importParseError: 'Impossible de lire ce fichier JSON.',
    resetConfirm: 'Réinitialiser va effacer tous les voyageurs, dépenses et le nom du voyage. Cette action est irréversible. Continuer ?',
    modalOkBtn: 'OK',
    modalConfirmBtn: 'Continuer',
    modalCancelBtn: 'Annuler'
  }
};

/* Order in which languages should appear in the language switcher. */
const LANGUAGE_ORDER = ['en', 'es', 'fr'];

/* Native names shown in the switcher — always in their own language, never translated. */
const LANGUAGE_NAMES = { en: 'English', es: 'Español', fr: 'Français' };
