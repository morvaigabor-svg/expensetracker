/**
 * @file Service.Dashboard.gs
 * @description A PayKal Dashboard felületének adatszolgáltatója.
 */

/**
 * Lekéri az 'Egyenleg' munkalapról a pillanatnyi egyenlegeket és az idősoros grafikon adatait.
 *
 * @param {string} timeFilter - Időszak szűrő opció ("1H", "3H", "6H", "1E", "2E", "O").
 * @returns {Object} Dashboard adatszerkezet (totalBalance, cashBalance, bankBalance, labels, values).
 */
function getPayKalDashboardDataImpl(timeFilter) {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const balanceSheet = ss.getSheetByName('Egyenleg');

  if (!balanceSheet) {
    return { totalBalance: 0, cashBalance: 0, bankBalance: 0, labels: [], values: [] };
  }

  // 1. Aktuális egyenlegek közvetlen lekérése a kijelölt cellákból
  const totalBalance = Number(balanceSheet.getRange('N2').getValue()) || 0;
  const cashBalance  = Number(balanceSheet.getRange('N4').getValue()) || 0;
  const bankBalance  = Number(balanceSheet.getRange('N6').getValue()) || 0;

  // 2. Idősoros diagram adatok lekérése (A: Dátum, H: Egyenleg)
  const lastRow = balanceSheet.getLastRow();
  if (lastRow < 2) {
    return {
      totalBalance: totalBalance,
      cashBalance: cashBalance,
      bankBalance: bankBalance,
      labels: [],
      values: []
    };
  }

  const rawData = balanceSheet.getRange(2, 1, lastRow - 1, 8).getValues();
  const now = new Date();
  let startDate = new Date();

  switch (timeFilter) {
    case '1H': startDate.setMonth(now.getMonth() - 1); break;
    case '3H': startDate.setMonth(now.getMonth() - 3); break;
    case '6H': startDate.setMonth(now.getMonth() - 6); break;
    case '1E': startDate.setFullYear(now.getFullYear() - 1); break;
    case '2E': startDate.setFullYear(now.getFullYear() - 2); break;
    case 'O':  startDate = new Date(2000, 0, 1); break;
    default:   startDate.setMonth(now.getMonth() - 1); break;
  }

  const seenDates = {};
  const filteredPoints = [];

  for (let i = 0; i < rawData.length; i++) {
    const rawDate = rawData[i][0];
    const amount  = Number(rawData[i][7]);

    if (!rawDate || !(rawDate instanceof Date) || isNaN(rawDate.getTime())) {
      continue;
    }

    if (rawDate >= startDate && rawDate <= now) {
      const dateKey = Utilities.formatDate(rawDate, Session.getScriptTimeZone(), "yyyy-MM-dd");

      if (!seenDates[dateKey]) {
        seenDates[dateKey] = true;
        const displayLabel = Utilities.formatDate(rawDate, Session.getScriptTimeZone(), "MM.dd.");
        
        filteredPoints.push({
          label: displayLabel,
          value: isNaN(amount) ? 0 : amount
        });
      }
    }
  }

  filteredPoints.reverse();

  const labels = [];
  const values = [];

  for (let j = 0; j < filteredPoints.length; j++) {
    labels.push(filteredPoints[j].label);
    values.push(filteredPoints[j].value);
  }

  return {
    totalBalance: totalBalance,
    cashBalance: cashBalance,
    bankBalance: bankBalance,
    labels: labels,
    values: values
  };
}