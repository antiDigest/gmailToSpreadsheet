function getSpreadsheet_() {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("Spend Email Log");
    return sheet;
}

function fillSpreadsheet_(rows, sheet) {
    for(var r=0; r<rows.length; r++) { 
        var row = rows[r];
        sheet.appendRow(row);
        highlightSpreadsheetRow_(sheet, row);
    } 
}

function highlightSpreadsheetRow_(sheet, row) {
    if (row[3] == row[row.length-1]) {
        highlightSpreadsheetRow_(sheet, row, "fc6e4e");
    } else if (row[4].indexOf("notification") > -1) {
        highlightSpreadsheetRow_(sheet, row, "fcc900");
    }
}

function highlightSpreadsheetRow_(sheet, row, color) {
    var sheetRow = sheet.getLastRow();
    var sheetCol = sheet.getLastColumn();
    var rowRange = sheet.getRange(sheetRow, 1, 1, row.length);
    rowRange.setBackground(color);
}