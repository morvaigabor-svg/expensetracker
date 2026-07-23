/**
 * @file Service.Settings.gs
 * @description Alkalmazás beállításainak és törzsadatainak lekérdezése a 'Beállítások' munkalapról.
 */

/**
 * Beolvassa a dinamikus opciókat (költséghelyek, fizetési módok, befizetők, célok) a táblázatból.
 *
 * @returns {Object} Beállítások struktúrája tömbök formájában.
 */
function getSettingsData() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(APP.SHEETS.SETTINGS || "Beállítások");
    
    if (!sheet) {
      throw new Error("A Beállítások munkalap nem található!");
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return { costCenters: [], paymentMethods: [], incomePaymentMethods: [], payers: [], incomePurposes: [] };
    }

    // A-tól F oszlopig olvassuk be az adatokat (6 oszlop)
    const data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();

    const costCenters = [];
    const paymentMethods = [];
    const incomePaymentMethods = [];
    const payers = [];
    const incomePurposes = [];

    data.forEach(row => {
      if (row[0] && String(row[0]).trim() !== "") costCenters.push(String(row[0]).trim());          // A oszlop: Költséghelyek
      if (row[1] && String(row[1]).trim() !== "") paymentMethods.push(String(row[1]).trim());        // B oszlop: Kiadás fiz. mód
      if (row[2] && String(row[2]).trim() !== "") incomePaymentMethods.push(String(row[2]).trim());  // C oszlop: Befizetés módja
      if (row[4] && String(row[4]).trim() !== "") payers.push(String(row[4]).trim());               // E oszlop: Befizetők
      if (row[5] && String(row[5]).trim() !== "") incomePurposes.push(String(row[5]).trim());       // F oszlop: Befizetés célja
    });

    return {
      costCenters: costCenters,
      paymentMethods: paymentMethods,
      incomePaymentMethods: incomePaymentMethods,
      payers: payers,
      incomePurposes: incomePurposes
    };

  } catch (error) {
    if (typeof writeLog === "function") writeLog("ERROR", "Settings", error.message);
    throw error;
  }
}