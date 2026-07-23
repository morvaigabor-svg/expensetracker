/**
 * @file Service.Log.gs
 * @description Alkalmazásszintű naplózó (logging) szolgáltatás.
 */

/**
 * Új naplóbejegyzés beszúrása a 'Log' munkalapra.
 *
 * @param {string} level - A napló szintje (pl. "INFO", "WARN", "ERROR").
 * @param {string} module - A modul/szolgáltatás neve (pl. "Expense", "Income", "Drive").
 * @param {string} message - A naplózandó üzenet vagy hiba leírása.
 */
function writeLog(level, module, message) {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = ss.getSheetByName(APP.SHEETS.LOG);

  if (sheet) {
    sheet.appendRow([
      new Date(),
      level,
      module,
      message
    ]);
  }
}

/**
 * Teszt funkció a naplózó rendszer működésének ellenőrzésére.
 */
function testLog() {
  writeLog("INFO", "Test", "Log rendszer működik");
}