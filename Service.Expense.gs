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

    // 1. Sor hozzáadása a táblázathoz (E oszlop egyelőre üresen marad)
    sheet.appendRow([
      expense.date,          // A oszlop: Dátum
      expense.costCenter,    // B oszlop: Költséghely
      expense.amount,        // C oszlop: Összeg
      expense.paymentMethod, // D oszlop: Fizetési mód
      "",                    // E oszlop: Blokk (ezt a következő lépésben töltjük fel)
      expense.comment,       // F oszlop: Megjegyzés
      "",                    // G oszlop: Beküldő
      "",                    // H oszlop: GPS
      new Date(),            // I oszlop: Rögzítés ideje
      id                     // J oszlop: Egyedi azonosító
    ]);

    const lastRow = sheet.getLastRow();

    // 2. Ha vannak feltöltött képek, megalkotjuk a többszörös Hyperlinket
    if (imageUrls && imageUrls.length > 0) {
      let labels = [];
      for (let i = 0; i < imageUrls.length; i++) {
        labels.push(String(i + 1));
      }
      
      // Szöveg létrehozása, pl: "1 | 2 | 3"
      const fullText = labels.join(" | "); 
      let richTextBuilder = SpreadsheetApp.newRichTextValue().setText(fullText);

      // Linkek ráillesztése az egyes sorszámok karaktereire
      let currentOffset = 0;
      for (let i = 0; i < imageUrls.length; i++) {
        let label = String(i + 1);
        let start = currentOffset;
        let end = start + label.length;

        // Link hozzárendelése az adott sorszámhoz
        richTextBuilder.setLinkUrl(start, end, imageUrls[i]);
        
        // Léptetés a következő sorszámra (" | " hossza 3 karakter)
        currentOffset = end + 3; 
      }

      const richText = richTextBuilder.build();

      // Formázott, több-linkes szöveg beírása az E oszlopba (5. oszlop)
      sheet.getRange(lastRow, 5).setRichTextValue(richText);
    }

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