function generateExpenseId(costCenter){


const now = new Date();


const date =
Utilities.formatDate(
now,
APP.TIMEZONE,
"yyyyMMdd"
);



const sheet =
SpreadsheetApp
.openById(CONFIG.SHEET_ID)
.getSheetByName(
APP.SHEETS.EXPENSES
);



const lastRow =
sheet.getLastRow();



const sequence =
String(lastRow)
.padStart(3,"0");



return (

date
+
"-"
+
costCenter
+
"-"
+
sequence

);


}