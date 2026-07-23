/**
 * @file Service.Drive.gs
 * @description Google Drive fájl- és mappakezelő szolgáltatások (blokkok feltöltése, jogosultságok beállítása).
 */

/**
 * Lekéri a cél Google Drive mappát a konfigurált azonosító alapján.
 *
 * @returns {GoogleAppsScript.Drive.Folder} Google Drive mappa objektum.
 */
function getExpenseFolder() {
  return DriveApp.getFolderById(APP.DRIVE.FOLDER_ID);
}

/**
 * Google Drive kapcsolat ellenőrzése (teszt és diagnosztikai célból).
 */
function testDriveConnection() {
  const folder = getExpenseFolder();
  Logger.log("Drive mappa neve: " + folder.getName());
}

/**
 * Fájlfeltöltés ellenőrzése a célmappába (teszt célból).
 */
function testDriveUpload() {
  const text = "ExpenseTracker teszt fájl";
  const blob = Utilities.newBlob(text, "text/plain", "teszt.txt");
  const folder = getExpenseFolder();
  const file = folder.createFile(blob);
  Logger.log("Fájl létrehozva: " + file.getName());
}

/**
 * Kép (Base64 formátumban) feltöltése a Drive célmappájába.
 *
 * @param {string} imageData - Data URL formátumú kép string (Base64).
 * @param {string} expenseId - A kiadáshoz tartozó egyedi azonosító.
 * @param {number} imageNumber - A képsorozatszám.
 * @returns {Object} Feltöltött fájl adatai (id, url, name).
 */
function uploadExpenseImage(imageData, expenseId, imageNumber) {
  const folder = getExpenseFolder();
  
  const contentType = imageData.match(/data:(.*);base64/)[1];
  const base64 = imageData.split(",")[1];
  const bytes = Utilities.base64Decode(base64);
  const extension = contentType.split("/")[1];

  const fileName = expenseId + "_" + imageNumber + "." + extension;
  const blob = Utilities.newBlob(bytes, contentType, fileName);
  const file = folder.createFile(blob);

  // Megtekintési jogosultság beállítása a link birtokosainak
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return {
    id: file.getId(),
    url: file.getUrl(),
    name: file.getName()
  };
}