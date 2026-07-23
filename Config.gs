/**
 * @file Config.gs
 * @description Az alkalmazás globális konfigurációit és konstansait tartalmazó fájl.
 */

/**
 * Alkalmazásszintű nem módosítható konstansok.
 * @type {Object}
 */
const APP = Object.freeze({
  NAME: "ExpenseTracker",
  VERSION: "0.1.0",
  TIMEZONE: "Europe/Budapest",
  SHEETS: Object.freeze({
    EXPENSES: "Költségek",
    INCOME: "Bevételek",
    SETTINGS: "Beállítások",
    LOG: "Log"
  }),
  DRIVE: Object.freeze({
    FOLDER_ID: "12WOa_-P8ZPVgT5H-YhRhJkGxD4l0fhB7"
  })
});

/**
 * Táblázat-specifikus konfigurációs beállítások.
 * @type {Object}
 */
const CONFIG = {
  SHEET_ID: "19Tw4EmA2UcLHyM_Qj2XuBqCWCkLxuKKaCn2ohcYmfrA"
};