function getSettingsData(){

const ss =
SpreadsheetApp.openById(CONFIG.SHEET_ID);


const sheet =
ss.getSheetByName("Beállítások");


  const costCenters =
  sheet
  .getRange(
    "A2:A"
  )
  .getValues()
  .flat()
  .filter(String);



  const paymentMethods =
  sheet
  .getRange(
    "D2:D"
  )
  .getValues()
  .flat()
  .filter(String);



  return {

    costCenters: costCenters,

    paymentMethods: paymentMethods

  };

}