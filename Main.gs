/**
 * @file Main.gs
 * @description WebApp belépési pontok és a kliens-szerver kommunikációs API felület.
 */

/**
 * A WebApp belépési pontja (HTTP GET kérések kezelése).
 *
 * @returns {GoogleAppsScript.HTML.HtmlOutput} A kirajzolt HTML oldal.
 */
function doGet() {
  return HtmlService
    .createTemplateFromFile("index")
    .evaluate()
    .setTitle(APP.NAME);
}

/**
 * Segédfüggvény HTML fájlok dinamikus beemeléséhez (pl. stílusok és scriptek szétválasztásához).
 *
 * @param {string} filename - A beemelendő HTML fájl neve (.html kiterjesztés nélkül).
 * @returns {string} A fájl nyers tartalma stringként.
 */
function include(filename) {
  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();
}

/**
 * Lekéri az alkalmazás beállításait a beállítások munkalapról.
 *
 * @returns {Object} A beállítások objektuma (költséghelyek, fizetési módok, befizetők, stb.).
 */
function getSettings() {
  return getSettingsData();
}

/**
 * Létrehoz egy egyedi költségazonosítót a megadott költséghelyhez.
 *
 * @param {string} costCenter - A választott költséghely neve.
 * @returns {string} Generált egyedi azonosító.
 */
function getExpenseId(costCenter) {
  return generateExpenseId(costCenter);
}

/**
 * Kiadás rögzítése a Google Spreadsheetben.
 *
 * @param {Object} expense - A kiadás adatai (dátum, összeg, költséghely, fizetési mód, megjegyzés).
 * @param {Array<string>} [imageUrls=[]] - Feltöltött blokk képek URL címei.
 * @param {string|null} [expenseId=null] - Egyedi költségazonosító.
 * @param {Object|null} [gpsCoords=null] - GPS koordináták.
 * @returns {Object} Eredmény objektum (success, id, message).
 */
function saveExpense(expense, imageUrls, expenseId, gpsCoords) {
  return saveExpenseData(expense, imageUrls, expenseId, gpsCoords);
}

/**
 * Bevétel rögzítése a Google Spreadsheetben.
 *
 * @param {Object} incomeData - A bevétel adatai (dátum, összeg, cél, fizetési mód, befizetők, megjegyzés).
 * @returns {Object} Eredmény objektum (success, count, message).
 */
function saveIncome(incomeData) {
  return saveIncomeData(incomeData);
}

/**
 * Pénzmozgás (készpénz-számla közötti átvezetés) rögzítése.
 *
 * @param {Object} transferData - A tranzakció adatai (dátum, típus, összeg, megjegyzés).
 * @returns {Object} Eredmény objektum (success, message).
 */
function saveTransfer(transferData) {
  return saveTransferData(transferData);
}

/**
 * A Dashboard felületéhez szükséges aggregált adatok és grafikon adatsorok lekérése.
 *
 * @param {string} timeFilter - Időszak szűrő (pl. "1H", "3H", "6H", "1E", "2E", "O").
 * @returns {Object} Dashboard adatok (összegyenleg, készpénz, számla, diagram címkék és értékek).
 */
function getPayKalDashboardData(timeFilter) {
  return getPayKalDashboardDataImpl(timeFilter);
}