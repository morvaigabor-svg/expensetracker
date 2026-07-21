/**
 * Expense mentési szolgáltatás
 */
function saveExpenseData(expense, imageUrls = [], customId = null) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(APP.SHEETS.EXPENSES);

    if (!sheet) {
      throw new Error("Költségek munkalap nem található");
    }

    const id = customId || generateExpenseId(expense.costCenter);

    // Blokk hyperlink formula előállítása (1 | 2 | 3 formátumban)
    let receiptsFormula = "";
    if (imageUrls && imageUrls.length > 0) {
      const links = imageUrls.map((url, index) => {
        return `HYPERLINK("${url}", "${index + 1}")`;
      });
      receiptsFormula = "=" + links.join(' & " | " & ');
    }

    sheet.appendRow([
      expense.date,          // A oszlop: Dátum
      expense.costCenter,    // B oszlop: Költséghely
      expense.amount,        // C oszlop: Összeg
      expense.paymentMethod, // D oszlop: Fizetési mód
      receiptsFormula,       // E oszlop: Blokk (Hyperlinkek)
      expense.comment,       // F oszlop: Megjegyzés
      "",                    // G oszlop: Beküldő (később)
      "",                    // H oszlop: GPS (később)
      new Date(),            // I oszlop: Rögzítés időpontja
      id                     // J oszlop: Egyedi azonosító
    ]);

    writeLog("INFO", "Expense", "Mentés sikeres: " + id);

    return {
      success: true,
      id: id,
      message: "Mentés sikeres"
    };

  } catch (error) {
    writeLog("ERROR", "Expense", error.message);
    throw error;
  }
}