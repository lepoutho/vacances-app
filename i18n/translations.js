/* ---------- Interface translations ---------- */
/* All user-facing labels, titles and dynamic strings for the Vacances app,
   grouped by language code. Loaded before javascript/app.js, which reads
   this global TRANSLATIONS object via the t() helper. */
const TRANSLATIONS = {
  en: {
    pageTitle: 'Vacations — Expense sharing',
    airlineMark: 'Vacations',
    defaultTripName: 'Our vacation',
    exportBtn: '⬇ Save my trip',
    importBtn: '⬆ Load my trip',
    resetBtn: '↺ Reset',

    peopleSectionTitle: 'Travelers',
    personNamePlaceholder: 'First name (e.g. Thomas)',
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
    expenseSubLineEveryone: (payer) => `Paid by ${payer} · shared by everyone`,
    deleteBtn: 'Delete',
    editBtn: 'Edit',
    editExpenseTitle: 'Edit expense',
    editExpenseSaveBtn: 'Save',

    totalsSectionTitle: 'Expenses',
    totalsEmptyHint: 'Add travelers and expenses to see the breakdown.',
    avgLine: (avgFmt, totalFmt, count) =>
      `Average expense per person: <strong>${avgFmt}</strong> (total ${totalFmt} over ${count} ${count === 1 ? 'person' : 'people'})`,
    totalOnlyLine: (totalFmt, count) =>
      `Total <strong>${totalFmt}</strong> over ${count} ${count === 1 ? 'person' : 'people'}`,
    totalCount: (n) => `${n} ${n === 1 ? 'expense' : 'expenses'}`,
    settlementTxCount: (n) => `${n} ${n === 1 ? 'transaction' : 'transactions'}`,
    copySettlementBtn: 'Copy result',
    copySettlementCopiedBtn: 'Copied!',
    settlementExportLine: (from, amountFmt, to, isFromPlural) =>
      `${from} ${isFromPlural ? 'owe' : 'owes'} ${amountFmt} to ${to}`,
    copySettlementError: 'Could not copy to clipboard. Please try again.',

    balancesSectionTitle: 'Balances',
    balEmptyHint: 'Add travelers and expenses to see the balances.',
    balanceUpToDate: 'settled up',
    balanceOwesReceive: (isPlural) => isPlural ? 'are owed' : 'is owed',
    balanceOwes: (isPlural) => isPlural ? 'owe' : 'owes',

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
    duplicateNameWarning: (name) => `"${name}" has already been added. Please choose a different name so travelers stay distinguishable.`,
    joinExpensesPartialNote: 'Expenses shown in red were not shared by everyone already on the trip — check whether you should be included in them too.',
    importParseError: 'Unable to read this save file.',
    resetConfirm: 'Resetting will erase all travelers, expenses, and the trip name. This action cannot be undone. Continue?',
    confirmPartialExpense: (desc, amountFmt, payer, shares) =>
      `"${desc}" (${amountFmt}) won't be shared by everyone.\nPaid by ${payer} · shared between ${shares}.\n\nContinue?`,
    modalOkBtn: 'OK',
    modalConfirmBtn: 'Continue',
    modalCancelBtn: 'Cancel',

    joinExpensesIntro: "Please select the expenses you'd like to join. If none, leave them unselected.",
    joinExpensesListLabel: 'Existing expenses',
    joinExpensesLevelTitle: 'Participation level for this expense',
    joinExpensesLevelLabel: 'Participation',
    joinExpensesConfirmBtn: 'Confirm',

    expenseAddedToast: 'Expense added'
  },

  es: {
    pageTitle: 'Vacaciones — Reparto de gastos',
    airlineMark: 'Vacaciones',
    defaultTripName: 'Nuestras vacaciones',
    exportBtn: '⬇ Guardar mi viaje',
    importBtn: '⬆ Cargar mi viaje',
    resetBtn: '↺ Reiniciar',

    peopleSectionTitle: 'Viajeros',
    personNamePlaceholder: 'Nombre (ej: Thomas)',
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
    expenseSubLineEveryone: (payer) => `Pagado por ${payer} · compartido por todos`,
    deleteBtn: 'Eliminar',
    editBtn: 'Editar',
    editExpenseTitle: 'Editar gasto',
    editExpenseSaveBtn: 'Guardar',

    totalsSectionTitle: 'Gastos',
    totalsEmptyHint: 'Añade viajeros y gastos para ver el detalle.',
    avgLine: (avgFmt, totalFmt, count) =>
      `Gasto medio por persona: <strong>${avgFmt}</strong> (total ${totalFmt} entre ${count} persona${count === 1 ? '' : 's'})`,
    totalOnlyLine: (totalFmt, count) =>
      `Total <strong>${totalFmt}</strong> entre ${count} persona${count === 1 ? '' : 's'}`,
    totalCount: (n) => `${n} gasto${n === 1 ? '' : 's'}`,
    settlementTxCount: (n) => `${n} transacción${n === 1 ? '' : 'es'}`,
    copySettlementBtn: 'Copiar resultado',
    copySettlementCopiedBtn: '¡Copiado!',
    settlementExportLine: (from, amountFmt, to, isFromPlural, isToPlural) =>
      `${from} ${isToPlural ? 'les' : 'le'} ${isFromPlural ? 'deben' : 'debe'} ${amountFmt} a ${to}`,
    copySettlementError: 'No se pudo copiar al portapapeles. Inténtalo de nuevo.',

    balancesSectionTitle: 'Saldos',
    balEmptyHint: 'Añade viajeros y gastos para ver los saldos.',
    balanceUpToDate: 'al día',
    balanceOwesReceive: (isPlural) => isPlural ? 'deben recibir' : 'debe recibir',
    balanceOwes: (isPlural) => isPlural ? 'deben' : 'debe',

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
    duplicateNameWarning: (name) => `"${name}" ya ha sido añadido. Elige un nombre diferente para que los viajeros sigan siendo distinguibles.`,
    joinExpensesPartialNote: 'Los gastos en rojo no fueron compartidos por todos los que ya estaban en el viaje — comprueba si también deberías participar en ellos.',
    importParseError: 'No se pudo leer este archivo de guardado.',
    resetConfirm: 'Reiniciar borrará todos los viajeros, gastos y el nombre del viaje. Esta acción no se puede deshacer. ¿Continuar?',
    confirmPartialExpense: (desc, amountFmt, payer, shares) =>
      `"${desc}" (${amountFmt}) no se compartirá entre todos.\nPagado por ${payer} · compartido entre ${shares}.\n\n¿Continuar?`,
    modalOkBtn: 'Aceptar',
    modalConfirmBtn: 'Continuar',
    modalCancelBtn: 'Cancelar',

    joinExpensesIntro: 'Selecciona los gastos en los que quieres participar. Si ninguno, no selecciones nada.',
    joinExpensesListLabel: 'Gastos existentes',
    joinExpensesLevelTitle: 'Nivel de participación en este gasto',
    joinExpensesLevelLabel: 'Participación',
    joinExpensesConfirmBtn: 'Confirmar',

    expenseAddedToast: 'Gasto añadido'
  },

  fr: {
    pageTitle: 'Vacances — Partage des dépenses',
    airlineMark: 'Vacances',
    defaultTripName: 'Nos vacances',
    exportBtn: '⬇ Sauvegarder mon voyage',
    importBtn: '⬆ Charger mon voyage',
    resetBtn: '↺ Réinitialiser',

    peopleSectionTitle: 'Voyageurs',
    personNamePlaceholder: 'Prénom (ex : Thomas)',
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
    expenseSubLine: (payer, shares) => `Payé par ${payer} · partagée entre ${shares}`,
    expenseSubLineEveryone: (payer) => `Payé par ${payer} · partagée par tous`,
    deleteBtn: 'Supprimer',
    editBtn: 'Modifier',
    editExpenseTitle: 'Modifier la dépense',
    editExpenseSaveBtn: 'Enregistrer',

    totalsSectionTitle: 'Dépenses',
    totalsEmptyHint: 'Ajoute des voyageurs et des dépenses pour voir le détail.',
    avgLine: (avgFmt, totalFmt, count) =>
      `Dépense moyenne par personne : <strong>${avgFmt}</strong> (total ${totalFmt} sur ${count} personne${count > 1 ? 's' : ''})`,
    totalOnlyLine: (totalFmt, count) =>
      `Total <strong>${totalFmt}</strong> sur ${count} personne${count > 1 ? 's' : ''}`,
    totalCount: (n) => `${n} dépense${n > 1 ? 's' : ''}`,
    settlementTxCount: (n) => `${n} transaction${n > 1 ? 's' : ''}`,
    copySettlementBtn: 'Copier le résultat',
    copySettlementCopiedBtn: 'Copié !',
    settlementExportLine: (from, amountFmt, to, isFromPlural) =>
      `${from} ${isFromPlural ? 'doivent' : 'doit'} ${amountFmt} à ${to}`,
    copySettlementError: "Impossible de copier dans le presse-papier. Merci de réessayer.",

    balancesSectionTitle: 'Soldes',
    balEmptyHint: 'Ajoute des voyageurs et des dépenses pour voir les soldes.',
    balanceUpToDate: 'à jour',
    balanceOwesReceive: (isPlural) => isPlural ? 'doivent recevoir' : 'doit recevoir',
    balanceOwes: (isPlural) => isPlural ? 'doivent' : 'doit',

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
    duplicateNameWarning: (name) => `« ${name} » a déjà été ajouté. Merci de choisir un nom différent pour que les voyageurs restent identifiables.`,
    joinExpensesPartialNote: "Les dépenses en rouge n'ont pas été partagées par tous les voyageurs déjà présents — vérifie si tu devrais y être inclus toi aussi.",
    importParseError: 'Impossible de lire ce fichier de sauvegarde.',
    resetConfirm: 'Réinitialiser va effacer tous les voyageurs, dépenses et le nom du voyage. Cette action est irréversible. Continuer ?',
    confirmPartialExpense: (desc, amountFmt, payer, shares) =>
      `« ${desc} » (${amountFmt}) ne sera pas partagée par tout le monde.\nPayée par ${payer} · partagée entre ${shares}.\n\nContinuer ?`,
    modalOkBtn: 'OK',
    modalConfirmBtn: 'Continuer',
    modalCancelBtn: 'Annuler',

    joinExpensesIntro: 'Merci de sélectionner les dépenses auxquelles vous voulez participer. Si aucune, ne rien sélectionner.',
    joinExpensesListLabel: 'Dépenses existantes',
    joinExpensesLevelTitle: 'Niveau de participation à cette dépense',
    joinExpensesLevelLabel: 'Participation',
    joinExpensesConfirmBtn: 'Valider',

    expenseAddedToast: 'Dépense ajoutée'
  },

  /* Mandarin Chinese doesn't conjugate verbs for number/person at all, so
     the isPlural/isFromPlural/isToPlural flags some strings receive are
     simply unused here — nothing needs to change based on them. */
  zh: {
    pageTitle: '度假 — 费用分摊',
    airlineMark: '度假',
    defaultTripName: '我们的假期',
    exportBtn: '⬇ 保存我的旅行',
    importBtn: '⬆ 加载我的旅行',
    resetBtn: '↺ 重置',

    peopleSectionTitle: '旅行者',
    personNamePlaceholder: '名字（例如：Thomas）',
    representsLabel: '相当于',
    personSizeTitle: '代表的人数',
    addPersonBtn: '添加',
    peopleEmptyHint: '添加参加假期的人员。',
    removePersonTitle: (name) => `移除${name}`,
    personSizeBadge: (size) => `· ${size} 人`,

    expenseSectionTitle: '新支出',
    expenseDescPlaceholder: '例如：餐厅、汽油、住宿…',
    expenseAmountPlaceholder: '金额 €',
    payerSelectEmpty: '请先添加一位旅行者',
    payerSelectPrefix: '付款人：',
    sharedBetweenLabel: '分摊对象',
    addExpenseBtn: '添加支出',
    filterByPayerLabel: '按付款人筛选',
    expenseEmptyDefault: '暂无支出。',
    expenseEmptyForPayer: '该付款人没有支出。',
    expenseSubLine: (payer, shares) => `付款人：${payer} · 分摊对象：${shares}`,
    expenseSubLineEveryone: (payer) => `付款人：${payer} · 所有人分摊`,
    deleteBtn: '删除',
    editBtn: '编辑',
    editExpenseTitle: '编辑支出',
    editExpenseSaveBtn: '保存',

    totalsSectionTitle: '支出汇总',
    totalsEmptyHint: '添加旅行者和支出以查看明细。',
    avgLine: (avgFmt, totalFmt, count) =>
      `人均支出：<strong>${avgFmt}</strong>（共 ${totalFmt}，${count} 人）`,
    totalOnlyLine: (totalFmt, count) => `总计 <strong>${totalFmt}</strong>，${count} 人`,
    totalCount: (n) => `${n} 笔支出`,
    settlementTxCount: (n) => `${n} 笔转账`,
    copySettlementBtn: '复制结果',
    copySettlementCopiedBtn: '已复制！',
    settlementExportLine: (from, amountFmt, to) => `${from} 欠 ${to} ${amountFmt}`,
    copySettlementError: '无法复制到剪贴板，请重试。',

    balancesSectionTitle: '余额',
    balEmptyHint: '添加旅行者和支出以查看余额。',
    balanceUpToDate: '已结清',
    balanceOwesReceive: '应收款',
    balanceOwes: '应付款',

    settlementSectionTitle: '结算',
    filterByTravelerLabel: '按旅行者筛选',
    settlementEmptyFiltered: '所选旅行者之间没有需要偿还的款项。',
    settlementEmptyAllSettled: '账目已结清 — 没有人欠任何人钱。',
    fromLabel: '从',
    toLabel: '到',

    allChipLabel: '全部',
    headerSummary: (peopleCount, expenseCount) => `${peopleCount} 人 · ${expenseCount} 笔支出`,

    footerText: '本次旅行的数据保存在您的浏览器中。',
    importInvalidFile: '此文件看起来不是有效的 Vacances 应用存档。',
    duplicateNameWarning: (name) => `"${name}" 已经添加过了。请选择一个不同的名字，以便区分各位旅行者。`,
    joinExpensesPartialNote: '红色显示的支出并非由旅行中已有的所有人分摊 — 请确认您是否也应该被包含在内。',
    importParseError: '无法读取此存档文件。',
    resetConfirm: '重置将清除所有旅行者、支出和旅行名称。此操作无法撤销。是否继续？',
    confirmPartialExpense: (desc, amountFmt, payer, shares) =>
      `"${desc}"（${amountFmt}）不会由所有人分摊。\n付款人：${payer} · 分摊对象：${shares}。\n\n是否继续？`,
    modalOkBtn: '确定',
    modalConfirmBtn: '继续',
    modalCancelBtn: '取消',

    joinExpensesIntro: '请选择您想要加入的支出。如果没有，请不要选择任何项。',
    joinExpensesListLabel: '现有支出',
    joinExpensesLevelTitle: '此项支出的参与比例',
    joinExpensesLevelLabel: '参与比例',
    joinExpensesConfirmBtn: '确认',

    expenseAddedToast: '支出已添加'
  },

  /* Hindi does conjugate for number, but also for gender — which this app
     has no way to know for a given traveler. Rather than guess (and risk
     being wrong as often as right), every place that needed a singular/
     plural verb elsewhere uses an invariant Sanskrit-derived adjective
     (प्राप्य / देय — "receivable" / "payable", identical for both genders)
     paired with है/हैं, which mark number only, never gender. */
  hi: {
    pageTitle: 'छुट्टियाँ — खर्च बांटना',
    airlineMark: 'छुट्टियाँ',
    defaultTripName: 'हमारी छुट्टियाँ',
    exportBtn: '⬇ अपनी यात्रा सहेजें',
    importBtn: '⬆ अपनी यात्रा लोड करें',
    resetBtn: '↺ रीसेट करें',

    peopleSectionTitle: 'यात्री',
    personNamePlaceholder: 'नाम (जैसे: Thomas)',
    representsLabel: 'के बराबर',
    personSizeTitle: 'प्रतिनिधित्व किए गए लोगों की संख्या',
    addPersonBtn: 'जोड़ें',
    peopleEmptyHint: 'छुट्टियों पर जाने वाले लोगों को जोड़ें।',
    removePersonTitle: (name) => `${name} को हटाएं`,
    personSizeBadge: (size) => `· ${size} लोग`,

    expenseSectionTitle: 'नया खर्च',
    expenseDescPlaceholder: 'जैसे: रेस्तरां, पेट्रोल, आवास…',
    expenseAmountPlaceholder: 'राशि €',
    payerSelectEmpty: 'एक यात्री जोड़ें',
    payerSelectPrefix: 'भुगतानकर्ता: ',
    sharedBetweenLabel: 'इनके बीच बांटा गया',
    addExpenseBtn: 'खर्च जोड़ें',
    filterByPayerLabel: 'भुगतानकर्ता के अनुसार फ़िल्टर करें',
    expenseEmptyDefault: 'अभी तक कोई खर्च नहीं है।',
    expenseEmptyForPayer: 'इस भुगतानकर्ता के लिए कोई खर्च नहीं है।',
    expenseSubLine: (payer, shares) => `भुगतानकर्ता: ${payer} · इनके बीच बांटा गया: ${shares}`,
    expenseSubLineEveryone: (payer) => `भुगतानकर्ता: ${payer} · सभी में बांटा गया`,
    deleteBtn: 'हटाएं',
    editBtn: 'संपादित करें',
    editExpenseTitle: 'खर्च संपादित करें',
    editExpenseSaveBtn: 'सहेजें',

    totalsSectionTitle: 'खर्च',
    totalsEmptyHint: 'विवरण देखने के लिए यात्री और खर्च जोड़ें।',
    avgLine: (avgFmt, totalFmt, count) =>
      `प्रति व्यक्ति औसत खर्च: <strong>${avgFmt}</strong> (कुल ${totalFmt}, ${count} व्यक्तियों पर)`,
    totalOnlyLine: (totalFmt, count) => `कुल <strong>${totalFmt}</strong>, ${count} व्यक्तियों पर`,
    totalCount: (n) => `${n} खर्च`,
    settlementTxCount: (n) => `${n} लेनदेन`,
    copySettlementBtn: 'परिणाम कॉपी करें',
    copySettlementCopiedBtn: 'कॉपी हो गया!',
    settlementExportLine: (from, amountFmt, to, isFromPlural) =>
      `${from} को ${to} को ${amountFmt} ${isFromPlural ? 'देने हैं' : 'देना है'}`,
    copySettlementError: 'क्लिपबोर्ड पर कॉपी नहीं हो सका। कृपया पुनः प्रयास करें।',

    balancesSectionTitle: 'शेष राशि',
    balEmptyHint: 'शेष राशि देखने के लिए यात्री और खर्च जोड़ें।',
    balanceUpToDate: 'चुकता',
    balanceOwesReceive: (isPlural) => isPlural ? 'प्राप्य हैं' : 'प्राप्य है',
    balanceOwes: (isPlural) => isPlural ? 'देय हैं' : 'देय है',

    settlementSectionTitle: 'हिसाब बराबर करने के लिए',
    filterByTravelerLabel: 'यात्री के अनुसार फ़िल्टर करें',
    settlementEmptyFiltered: 'चयनित यात्रियों से संबंधित कोई भुगतान नहीं है।',
    settlementEmptyAllSettled: 'सभी हिसाब बराबर हैं — किसी पर किसी का कुछ बकाया नहीं है।',
    fromLabel: 'से',
    toLabel: 'को',

    allChipLabel: 'सभी',
    headerSummary: (peopleCount, expenseCount) => `${peopleCount} लोग · ${expenseCount} खर्च`,

    footerText: 'इस यात्रा का डेटा आपके ब्राउज़र में सहेजा रहता है।',
    importInvalidFile: 'यह फ़ाइल Vacances ऐप की वैध सेव फ़ाइल नहीं लगती।',
    duplicateNameWarning: (name) => `"${name}" पहले ही जोड़ा जा चुका है। कृपया एक अलग नाम चुनें ताकि यात्रियों की पहचान अलग-अलग बनी रहे।`,
    joinExpensesPartialNote: 'लाल रंग में दिखाए गए खर्च यात्रा में पहले से मौजूद सभी लोगों के बीच नहीं बांटे गए थे — जांचें कि क्या आपको भी इनमें शामिल होना चाहिए।',
    importParseError: 'इस सेव फ़ाइल को पढ़ा नहीं जा सका।',
    resetConfirm: 'रीसेट करने से सभी यात्री, खर्च और यात्रा का नाम मिट जाएगा। यह क्रिया पूर्ववत नहीं की जा सकती। जारी रखें?',
    confirmPartialExpense: (desc, amountFmt, payer, shares) =>
      `"${desc}" (${amountFmt}) सभी के बीच नहीं बांटी जाएगी।\nभुगतानकर्ता: ${payer} · इनके बीच बांटा गया: ${shares}।\n\nजारी रखें?`,
    modalOkBtn: 'ठीक है',
    modalConfirmBtn: 'जारी रखें',
    modalCancelBtn: 'रद्द करें',

    joinExpensesIntro: 'कृपया वे खर्च चुनें जिनमें आप शामिल होना चाहते हैं। यदि कोई नहीं, तो कुछ भी न चुनें।',
    joinExpensesListLabel: 'मौजूदा खर्च',
    joinExpensesLevelTitle: 'इस खर्च में भागीदारी का स्तर',
    joinExpensesLevelLabel: 'भागीदारी',
    joinExpensesConfirmBtn: 'पुष्टि करें',

    expenseAddedToast: 'खर्च जोड़ा गया'
  },

  /* Swahili marks number on the verb via a noun-class prefix (a- singular /
     wa- plural for humans) rather than gender — Swahili has no grammatical
     gender at all, so unlike Hindi this agreement is reliable here without
     knowing anything about the traveler beyond "one" vs "more than one". */
  sw: {
    pageTitle: 'Likizo — Kugawana Gharama',
    airlineMark: 'Likizo',
    defaultTripName: 'Likizo Yetu',
    exportBtn: '⬇ Hifadhi safari yangu',
    importBtn: '⬆ Pakia safari yangu',
    resetBtn: '↺ Weka upya',

    peopleSectionTitle: 'Wasafiri',
    personNamePlaceholder: 'Jina la kwanza (mfano: Thomas)',
    representsLabel: 'sawa na',
    personSizeTitle: 'Idadi ya watu wanaowakilishwa',
    addPersonBtn: 'Ongeza',
    peopleEmptyHint: 'Ongeza watu wanaokwenda likizoni.',
    removePersonTitle: (name) => `Ondoa ${name}`,
    personSizeBadge: (size) => `· watu ${size}`,

    expenseSectionTitle: 'Gharama mpya',
    expenseDescPlaceholder: 'Mfano: Mkahawa, mafuta, malazi…',
    expenseAmountPlaceholder: 'Kiasi €',
    payerSelectEmpty: 'Ongeza msafiri',
    payerSelectPrefix: 'Imelipwa na ',
    sharedBetweenLabel: 'Imegawanywa kati ya',
    addExpenseBtn: 'Ongeza gharama',
    filterByPayerLabel: 'Chuja kwa mlipaji',
    expenseEmptyDefault: 'Hakuna gharama bado.',
    expenseEmptyForPayer: 'Hakuna gharama kwa mlipaji huyu.',
    expenseSubLine: (payer, shares) => `Imelipwa na ${payer} · imegawanywa kati ya ${shares}`,
    expenseSubLineEveryone: (payer) => `Imelipwa na ${payer} · imegawanywa na kila mtu`,
    deleteBtn: 'Futa',
    editBtn: 'Hariri',
    editExpenseTitle: 'Hariri gharama',
    editExpenseSaveBtn: 'Hifadhi',

    totalsSectionTitle: 'Gharama',
    totalsEmptyHint: 'Ongeza wasafiri na gharama ili kuona maelezo.',
    avgLine: (avgFmt, totalFmt, count) =>
      `Wastani wa gharama kwa mtu: <strong>${avgFmt}</strong> (jumla ${totalFmt} kwa watu ${count})`,
    totalOnlyLine: (totalFmt, count) => `Jumla <strong>${totalFmt}</strong> kwa watu ${count}`,
    totalCount: (n) => `gharama ${n}`,
    settlementTxCount: (n) => `malipo ${n}`,
    copySettlementBtn: 'Nakili matokeo',
    copySettlementCopiedBtn: 'Imenakiliwa!',
    settlementExportLine: (from, amountFmt, to, isFromPlural) =>
      `${from} ${isFromPlural ? 'wanadaiwa' : 'anadaiwa'} ${amountFmt} na ${to}`,
    copySettlementError: 'Imeshindwa kunakili kwenye ubao wa kunakili. Tafadhali jaribu tena.',

    balancesSectionTitle: 'Salio',
    balEmptyHint: 'Ongeza wasafiri na gharama ili kuona salio.',
    balanceUpToDate: 'sawa',
    balanceOwesReceive: (isPlural) => isPlural ? 'wanadai' : 'anadai',
    balanceOwes: (isPlural) => isPlural ? 'wanadaiwa' : 'anadaiwa',

    settlementSectionTitle: 'Kulipana',
    filterByTravelerLabel: 'Chuja kwa msafiri',
    settlementEmptyFiltered: 'Hakuna malipo yanayohusisha wasafiri waliochaguliwa.',
    settlementEmptyAllSettled: 'Hesabu zimekamilika — hakuna anayedaiwa na mtu yeyote.',
    fromLabel: 'Kutoka',
    toLabel: 'Kwenda',

    allChipLabel: 'Wote',
    headerSummary: (peopleCount, expenseCount) => `watu ${peopleCount} · gharama ${expenseCount}`,

    footerText: 'Data ya safari hii inabaki imehifadhiwa kwenye kivinjari chako.',
    importInvalidFile: 'Faili hii haionekani kuwa hifadhi halali ya programu ya Vacances.',
    duplicateNameWarning: (name) => `"${name}" tayari ameongezwa. Tafadhali chagua jina tofauti ili wasafiri wabaki wakitofautishwa.`,
    joinExpensesPartialNote: 'Gharama zilizoonyeshwa kwa rangi nyekundu hazikugawanywa na kila mtu aliyekuwa tayari safarini — angalia kama unapaswa kujumuishwa pia.',
    importParseError: 'Imeshindwa kusoma faili hii ya hifadhi.',
    resetConfirm: 'Kuweka upya kutafuta wasafiri wote, gharama, na jina la safari. Kitendo hiki hakiwezi kutenduliwa. Endelea?',
    confirmPartialExpense: (desc, amountFmt, payer, shares) =>
      `"${desc}" (${amountFmt}) haitagawanywa na kila mtu.\nImelipwa na ${payer} · imegawanywa kati ya ${shares}.\n\nEndelea?`,
    modalOkBtn: 'Sawa',
    modalConfirmBtn: 'Endelea',
    modalCancelBtn: 'Ghairi',

    joinExpensesIntro: 'Tafadhali chagua gharama ungependa kujiunga nazo. Kama hakuna, usichague chochote.',
    joinExpensesListLabel: 'Gharama zilizopo',
    joinExpensesLevelTitle: 'Kiwango cha ushiriki kwa gharama hii',
    joinExpensesLevelLabel: 'Ushiriki',
    joinExpensesConfirmBtn: 'Thibitisha',

    expenseAddedToast: 'Gharama imeongezwa'
  }
};

/* Order in which languages should appear in the language switcher. */
const LANGUAGE_ORDER = ['en', 'es', 'fr', 'zh', 'hi', 'sw'];

/* Native names shown in the switcher — always in their own language, never translated. */
const LANGUAGE_NAMES = { en: 'English', es: 'Español', fr: 'Français', zh: '中文', hi: 'हिन्दी', sw: 'Kiswahili' };
