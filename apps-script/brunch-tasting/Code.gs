// Brunch At Social's Table - website form endpoint
// Appends signups to the Brunch lead sheet with platform = "website",
// emails the guest, and notifies the business.
// The email design lives at TEMPLATE_URL on the website, so it can be
// updated by deploying the site - this script does not need re-pasting.
// After editing: Deploy > Manage deployments > pencil > New version > Deploy

var SHEET_ID = '1b2Oo8hwcQwAVikr75_q7NUbr2l5MIVemzpQMw5nNPXs';
var NOTIFY_INTERNAL = 'hello@madrassocial.ca';
var REPLY_TO = 'hello@madrassocial.ca';
var SHARED_TOKEN = 'mami-brunch-2026';
var TEMPLATE_URL = 'https://www.madrassocial.ca/brunch/email-template.html';
// Guests must see this as the sender. Google only allows it once the address is
// verified under Gmail > Settings > Accounts > "Send mail as" on the account
// running this script. Run listAliases() to check.
var SEND_AS = 'hello@madrassocial.ca';

function doGet() {
  return json({ ok: true, service: "Brunch At Social's Table intake" });
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (SHARED_TOKEN && body.token !== SHARED_TOKEN) {
      return json({ ok: false, error: 'bad token' });
    }

    var first = String(body.firstName || '').trim();
    var last = String(body.lastName || '').trim();
    var email = String(body.email || '').trim();
    var phone = String(body.phone || '').trim();
    if (!first || !email) return json({ ok: false, error: 'missing name or email' });

    appendRow(first, last, email, phone);

    var emailed = false;
    try {
      sendGuestEmail(first, email);
      emailed = true;
    } catch (err) {
      console.error('guest email failed: ' + err);
    }

    var notified = false;
    try {
      notifyBusiness(first, last, email, phone);
      notified = true;
    } catch (err) {
      console.error('business email failed: ' + err);
    }

    return json({ ok: true, emailed: emailed, notified: notified });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

var DEFAULT_HEADERS = ['created_time', 'first_name', 'last_name', 'email',
  'phone', 'platform', 'form_name', 'lead_status', 'id'];

// Uses the sheet's own header row if it has one, so it also works when
// appending to the Meta export. Writes DEFAULT_HEADERS into a blank sheet.
function sheetHeaders(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol > 0) {
    var hdr = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var filled = hdr.filter(function (h) {
      return String(h).trim() !== '';
    });
    if (filled.length) return hdr;
  }
  sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setValues([DEFAULT_HEADERS]);
  sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  return DEFAULT_HEADERS;
}

function appendRow(first, last, email, phone) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheets()[0];
  var headers = sheetHeaders(sheet);

  var values = {
    id: 'w:' + Date.now(),
    created_time: nowStamp(ss),
    form_name: 'Brunch Tasting - Website',
    is_organic: 'true',
    platform: 'website',
    first_name: first,
    last_name: last,
    email: email,
    phone: phone,
    lead_status: 'CREATED'
  };

  var row = headers.map(function (h) {
    var key = String(h).trim().toLowerCase();
    return values.hasOwnProperty(key) ? values[key] : '';
  });

  sheet.appendRow(row);
}

function nowStamp(ss) {
  var tz = '';
  try {
    tz = ss.getSpreadsheetTimeZone() || '';
  } catch (err) {
    tz = '';
  }
  if (!tz) tz = 'America/Toronto';
  try {
    return Utilities.formatDate(new Date(), tz, "yyyy-MM-dd'T'HH:mm:ssXXX");
  } catch (err) {
    return new Date().toISOString();
  }
}

function niceName(first) {
  var n = String(first || '').trim();
  if (!n) return '';
  return n.charAt(0).toUpperCase() + n.slice(1);
}

function sendGuestEmail(first, email) {
  var name = niceName(first);
  var hello = name ? 'Hello ' + name + ',' : 'Hello,';
  var opts = {
    to: email,
    subject: "You're on the list - Brunch At Social's Table",
    name: 'Madras Social',
    replyTo: REPLY_TO,
    body: guestText(name)
  };

  var html = fetchTemplate();
  if (html) opts.htmlBody = html.replace('{{HELLO}}', escapeHtml(hello));

  sendAs(opts);
}

// Sends from SEND_AS when it is a verified alias, otherwise falls back to the
// account default so a missing alias never stops the email going out.
function sendAs(opts) {
  var alias = verifiedAlias();
  if (alias) {
    opts.from = alias;
    GmailApp.sendEmail(opts.to, opts.subject, opts.body, opts);
    return;
  }
  console.warn(SEND_AS + ' is not a verified send-as alias; sending from the account default');
  MailApp.sendEmail(opts);
}

function verifiedAlias() {
  try {
    return GmailApp.getAliases().indexOf(SEND_AS) !== -1 ? SEND_AS : '';
  } catch (err) {
    console.error('alias lookup failed: ' + err);
    return '';
  }
}

// Run this from the editor to check the script can reach the sheet.
function checkAccess() {
  Logger.log('Running as: ' + Session.getEffectiveUser().getEmail());
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];
    Logger.log('Opened: ' + ss.getName() + '  (tab: ' + sheet.getName() + ')');
    Logger.log('Headers: ' + sheetHeaders(sheet).join(' | '));
    Logger.log('OK - the script can write to this sheet.');
  } catch (err) {
    Logger.log('CANNOT open the sheet: ' + err);
    Logger.log('Share the sheet with the account above, as Editor.');
  }
}

// Run this from the editor to see which From addresses this account can use.
function listAliases() {
  var aliases = GmailApp.getAliases();
  Logger.log('Account: ' + Session.getEffectiveUser().getEmail());
  Logger.log('Verified send-as aliases: ' + (aliases.length ? aliases.join(', ') : '(none)'));
  Logger.log(SEND_AS + ' usable as From: ' + (aliases.indexOf(SEND_AS) !== -1));
}

// Returns '' if the site is unreachable, so the plain-text email still sends.
function fetchTemplate() {
  try {
    var res = UrlFetchApp.fetch(TEMPLATE_URL, { muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) return '';
    var html = res.getContentText();
    return html.indexOf('{{HELLO}}') === -1 ? '' : html;
  } catch (err) {
    console.error('template fetch failed: ' + err);
    return '';
  }
}

function guestText(name) {
  return [
    name ? 'Hello ' + name + ',' : 'Hello,',
    '',
    "Thank you for signing up for Brunch At Social's Table.",
    '',
    "We're inviting a small group to try our new brunch in our dining room before it launches - it's free, and all we ask is your honest feedback.",
    '',
    'Warm dosas and soft idlis. Filter coffee and chutneys. 100% pure vegetarian, made with pure desi ghee.',
    '',
    'WHAT HAPPENS NEXT',
    "We're reviewing signups now and will reach out to selected guests with the date and details.",
    '',
    'Madras Social',
    '6261 Mayfield Rd, Unit 145, Brampton, ON',
    '(905) 913-5900 | hello@madrassocial.ca'
  ].join('\n');
}

function notifyBusiness(first, last, email, phone) {
  sendAs({
    to: NOTIFY_INTERNAL,
    subject: 'New brunch tasting signup - ' + first + ' ' + last,
    name: 'Madras Social Website',
    body: [
      'A new Brunch Tasting signup came in from the website.',
      '',
      'Name:  ' + first + ' ' + last,
      'Email: ' + email,
      'Phone: ' + phone,
      'Platform: website',
      '',
      'Sheet: https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit'
    ].join('\n')
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function testAppendAndEmail() {
  var me = Session.getEffectiveUser().getEmail();
  appendRow('Test', 'Entry', me, '(416) 555-0123');
  sendGuestEmail('test', me);
  notifyBusiness('Test', 'Entry', me, '(416) 555-0123');
  Logger.log('Wrote one test row and sent the emails. Delete the row afterwards.');
}
