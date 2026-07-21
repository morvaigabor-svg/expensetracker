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

function getSettings(){

return getSettingsData();

}

function saveExpense(expense){

  return saveExpenseData(expense);

}