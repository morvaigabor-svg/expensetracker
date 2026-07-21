/**
 * WebApp belépési pont
 */
function doGet() {
  return HtmlService
    .createTemplateFromFile("index")
    .evaluate()
    .setTitle(APP.NAME);
}

/**
 * HTML include
 */
function include(filename) {
  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();
}

function getSettings() {
  return getSettingsData();
}

function getExpenseId(costCenter) {
  return generateExpenseId(costCenter);
}

function saveExpense(expense, imageUrls, expenseId, gpsCoords) {
  return saveExpenseData(expense, imageUrls, expenseId, gpsCoords);
}