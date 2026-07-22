function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('PayKal Pénzügyi Rendszer')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Beállítások és törzsadatok lekérése a Google Sheets táblázatból
 */
function getSettings() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Beállítások") || ss.getSheets()[0];
    
    return {
      costCenters: getColumnValues(sheet, 1),          // 1. oszlop: Költséghelyek
      paymentMethods: getColumnValues(sheet, 2),       // 2. oszlop: Kiadás fizetési módok
      incomePurposes: getColumnValues(sheet, 3),       // 3. oszlop: Befizetés céljai
      incomePaymentMethods: getColumnValues(sheet, 4), // 4. oszlop: Befizetés módjai
      payers: getColumnValues(sheet, 5)                // 5. oszlop: Befizetők nevének listája
    };
  } catch (error) {
    Logger.log("Hiba a getSettings-ben: " + error.toString());
    return {
      costCenters: [],
      paymentMethods: [],
      incomePurposes: [],
      incomePaymentMethods: [],
      payers: []
    };
  }
}

/**
 * Segédfüggvény egy adott oszlop adatainak kinyerésére a 2. sortól
 */
function getColumnValues(sheet, columnIndex) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  
  const values = sheet.getRange(2, columnIndex, lastRow - 1, 1).getValues();
  return values
    .map(function(row) { return row[0]; })
    .filter(function(val) { 
      return val !== "" && val !== null && val !== undefined; 
    });
}