/**
 * Expense mentési szolgáltatás
 */
function saveExpenseData(expense, imageUrls = [], customId = null, gpsCoords = null) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(APP.SHEETS.EXPENSES);

    if (!sheet) {
      throw new Error("Költségek munkalap nem található");
    }

    const id = customId || generateExpenseId(expense.costCenter);

    // Beküldő Google e-mail címének kiolvasása
    const userEmail = Session.getActiveUser().getEmail() || "Ismeretlen";

    sheet.appendRow([
      expense.date,          // A oszlop: Dátum
      expense.costCenter,    // B oszlop: Költséghely
      expense.amount,        // C oszlop: Összeg
      expense.paymentMethod, // D oszlop: Fizetési mód
      "",                    // E oszlop: Blokk (RichText-tel töltjük fel)
      expense.comment,       // F oszlop: Megjegyzés
      userEmail,             // G oszlop: Beküldő e-mail címe
      "",                    // H oszlop: GPS (RichText-tel töltjük fel)
      new Date(),            // I oszlop: Rögzítés ideje
      id                     // J oszlop: Egyedi azonosító
    ]);

    const lastRow = sheet.getLastRow();

    // 1. Blokk képek linkelése (E oszlop = 5. oszlop)
    if (imageUrls && imageUrls.length > 0) {
      let labels = [];
      for (let i = 0; i < imageUrls.length; i++) {
        labels.push(String(i + 1));
      }
      
      const fullText = labels.join(" | "); 
      let richTextBuilder = SpreadsheetApp.newRichTextValue().setText(fullText);

      let currentOffset = 0;
      for (let i = 0; i < imageUrls.length; i++) {
        let label = String(i + 1);
        let start = currentOffset;
        let end = start + label.length;

        richTextBuilder.setLinkUrl(start, end, imageUrls[i]);
        currentOffset = end + 3; 
      }

      sheet.getRange(lastRow, 5).setRichTextValue(richTextBuilder.build());
    }

    // 2. GPS koordináta linkelése (H oszlop = 8. oszlop)
    if (gpsCoords && gpsCoords.lat && gpsCoords.lng) {
      const mapUrl = "https://maps.google.com/?q=" + gpsCoords.lat + "," + gpsCoords.lng;
      const gpsRichText = SpreadsheetApp.newRichTextValue()
        .setText("📍 Térkép")
        .setLinkUrl(mapUrl)
        .build();

      sheet.getRange(lastRow, 8).setRichTextValue(gpsRichText);
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