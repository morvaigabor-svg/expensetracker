/**
 * Dashboard statisztikák kiszámítása a Sheetből
 */
function getDashboardStatsData(period = "havi") {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(APP.SHEETS.EXPENSES);

    if (!sheet) {
      return { labels: [], values: [], totalAmount: 0 };
    }

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return { labels: [], values: [], totalAmount: 0 };
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const totalsByCostCenter = {};
    let totalAmount = 0;

    // A 2. sortól futunk végig a táblázaton (1. sor a fejléc)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rawDate = row[0];       // A oszlop: Dátum
      const costCenter = row[1];    // B oszlop: Költséghely
      const amount = Number(row[2]);// C oszlop: Összeg

      if (!rawDate || !costCenter || isNaN(amount)) continue;

      const expenseDate = new Date(rawDate);
      let isIncluded = false;

      if (period === "havi") {
        // Aktuális naptári hónap
        if (expenseDate.getFullYear() === currentYear && expenseDate.getMonth() === currentMonth) {
          isIncluded = true;
        }
      } else if (period === "6havi") {
        // Utolsó 6 hónap
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        if (expenseDate >= sixMonthsAgo && expenseDate <= today) {
          isIncluded = true;
        }
      } else if (period === "eves") {
        // Aktuális naptári év
        if (expenseDate.getFullYear() === currentYear) {
          isIncluded = true;
        }
      }

      if (isIncluded) {
        totalsByCostCenter[costCenter] = (totalsByCostCenter[costCenter] || 0) + amount;
        totalAmount += amount;
      }
    }

    const labels = Object.keys(totalsByCostCenter);
    const values = labels.map(label => totalsByCostCenter[label]);

    return {
      labels: labels,
      values: values,
      totalAmount: totalAmount
    };

  } catch (error) {
    writeLog("ERROR", "Dashboard", error.message);
    throw error;
  }
}