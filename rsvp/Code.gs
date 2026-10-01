// ==========================================================
// Madras Social — RSVP backend
// Writes each RSVP submission as a new row in the Google Sheet:
// https://docs.google.com/spreadsheets/d/14e4fdkWeNx-wee37USIsvN4O9FTW_55h5OX5NSLWRdE/edit
// ==========================================================

var SHEET_ID = '14e4fdkWeNx-wee37USIsvN4O9FTW_55h5OX5NSLWRdE';
var SHEET_NAME = 'RSVPs';

var HEADERS = [
  'Timestamp', 'Name', 'Instagram', 'Email', 'Phone',
  'Zone', 'Delivery address', 'Agreed to terms'
];

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.instagram || '',
      data.email || '',
      data.phone || '',
      data.zone || '',
      data.address || '',
      data.agree ? 'Yes' : 'No'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Visit the deployed URL directly in a browser to sanity-check the
// script is wired to the right sheet without submitting the form.
function doGet(e) {
  var sheet = getSheet_();
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      sheetId: SHEET_ID,
      sheetName: SHEET_NAME,
      rowCount: sheet.getLastRow()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
