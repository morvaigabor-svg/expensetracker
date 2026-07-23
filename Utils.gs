/**
 * @file Utils.gs
 * @description Általános segédfüggvények és azonosító generátorok.
 */

/**
 * Generál egy egyedi kiadás-azonosítót a megadott költséghelyhez és dátumhoz.
 * Formátum: YYYYMMDD-[COSTCENTER]-[ROW_SEQ]
 *
 * @param {string} costCenter - A kiadáshoz tartozó költséghely.
 * @returns {string} Az előállított egyedi azonosító string.
 */
function generateExpenseId(costCenter) {
  const now = new Date();
  const date = Utilities.formatDate(now, APP.TIMEZONE, "yyyyMMdd");
  const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(APP.SHEETS.EXPENSES);
  const lastRow = sheet ? sheet.getLastRow() : 0;
  const sequence = String(lastRow).padStart(3, "0");

  return date + "-" + costCenter + "-" + sequence;
}