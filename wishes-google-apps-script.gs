/**
 * Google Apps Script endpoint for the wedding wishes form.
 *
 * 1. Open script.google.com and create a project.
 * 2. Paste this file into Code.gs.
 * 3. Deploy as a Web app, executing as yourself, with access set to Anyone.
 * 4. Paste the deployment URL into data-submit-url on #wishesSection.
 */
const SPREADSHEET_ID = '1dK1B_yrHUx7j4CevMYTz5IJTNW6KhNFdp6kJXF1lK10';
const SHEET_NAME = 'Wishes';

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    const name = String(payload.name || '').trim().slice(0, 80);
    const message = String(payload.message || '').trim().slice(0, 600);

    if (!name || !message) {
      return jsonResponse({ ok: false, error: 'Name and message are required.' });
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Nama Lengkap', "Ucapan & Do'a", 'Timestamp']);
    }

    sheet.appendRow([name, message, new Date()]);
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
