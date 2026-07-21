/**
 * Expense mentési szolgáltatás
 */


function saveExpenseData(expense){


try {


const ss =
SpreadsheetApp.openById(CONFIG.SHEET_ID);


const sheet =
ss.getSheetByName(
APP.SHEETS.EXPENSES
);



if(!sheet){

throw new Error(
"Költségek munkalap nem található"
);

}



const id =
generateExpenseId(
expense.costCenter
);



sheet.appendRow([

expense.date,

expense.costCenter,

expense.amount,

expense.paymentMethod,

"", // blokk helye később

expense.comment,

"", // beküldő később

"", // GPS később

new Date(),

id

]);



writeLog(
"INFO",
"Expense",
"Mentés sikeres: " + id
);



return {

success:true,

id:id,

message:"Mentés sikeres"

};



}
catch(error){



writeLog(

"ERROR",

"Expense",

error.message

);



throw error;



}


}