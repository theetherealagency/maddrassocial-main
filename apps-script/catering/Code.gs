// Catering enquiries — website form endpoint.
// Appends each enquiry to the catering sheet, emails the enquirer a
// confirmation, and notifies the business.
//
// Setup:
//   1. Open the sheet below, Extensions > Apps Script, paste this file.
//   2. Run checkAccess() once and accept the permission prompts.
//   3. Deploy > New deployment > Web app
//        Execute as:      Me
//        Who has access:  Anyone
//   4. Copy the /exec URL into the site's VITE_CATERING_SHEET_ENDPOINT.
// After editing: Deploy > Manage deployments > pencil > New version > Deploy

var SHEET_ID = '1jPPECYFnWL_k8yRkhL7hWFqLhG1JwCttmQ855f09ltE';
var NOTIFY_INTERNAL = 'hello@madrassocial.ca';
var REPLY_TO = 'hello@madrassocial.ca';
var SHARED_TOKEN = 'mami-catering-2026';
// Enquirers must see this as the sender. Google only allows it once the address
// is verified under Gmail > Settings > Accounts > "Send mail as" on the account
// running this script. Run listAliases() to check.
var SEND_AS = 'hello@madrassocial.ca';
var PHONE = '(905) 913-5900';
// The branded email design lives on the website, so it can be changed by
// deploying the site — this script does not need re-pasting for design edits.
var TEMPLATE_URL = 'https://www.madrassocial.ca/catering/email-template.html';
var INTERNAL_TEMPLATE_URL = 'https://www.madrassocial.ca/catering/email-internal.html';

var HEADERS = ['created_time', 'form_name', 'occasion', 'full_name', 'email',
  'phone', 'event_date', 'guests', 'budget', 'description', 'consent',
  'platform', 'lead_status', 'id'];

function doGet(e) {
  // ?diag=<token> reports the things that make email silently fail, so setup can
  // be checked from outside the editor.
  if (e && e.parameter && e.parameter.diag && e.parameter.diag === SHARED_TOKEN) {
    return json(diagnostics());
  }
  return json({ ok: true, service: 'Madras Social catering intake' });
}

function diagnostics() {
  var out = { ok: true, notifyInternal: NOTIFY_INTERNAL, sendAs: SEND_AS };
  try {
    out.runningAs = Session.getEffectiveUser().getEmail();
  } catch (err) {
    out.runningAs = 'ERROR: ' + err;
  }
  try {
    out.mailQuotaRemaining = MailApp.getRemainingDailyQuota();
  } catch (err) {
    out.mailQuotaRemaining = 'ERROR: ' + err;
  }
  try {
    var aliases = GmailApp.getAliases();
    out.aliases = aliases;
    out.sendAsVerified = aliases.indexOf(SEND_AS) !== -1;
  } catch (err) {
    out.aliases = 'ERROR: ' + err;
  }
  try {
    out.templateStatus = UrlFetchApp.fetch(TEMPLATE_URL, { muteHttpExceptions: true })
      .getResponseCode();
  } catch (err) {
    out.templateStatus = 'ERROR: ' + err;
  }
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    out.sheetName = ss.getName();
    out.tabs = ss.getSheets().map(function (sh) {
      return sh.getName() + ' (' + sh.getLastRow() + ' rows)';
    });
    var first = ss.getSheets()[0];
    var lastCol = first.getLastColumn();
    var hdr = lastCol > 0 ? first.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    out.firstTabHeaders = hdr;
    out.unmatchedHeaders = hdr.filter(function (h) {
      return String(h).trim() !== '' && !HEADER_ALIASES[normHeader(h)];
    });
  } catch (err) {
    out.sheetName = 'ERROR: ' + err;
  }
  return out;
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (SHARED_TOKEN && body.token !== SHARED_TOKEN) {
      return json({ ok: false, error: 'bad token' });
    }

    var lead = {
      formName: String(body.formName || 'Catering').trim(),
      occasion: String(body.occasion || '').trim(),
      fullName: String(body.fullName || '').trim(),
      email: String(body.email || '').trim(),
      phone: String(body.phone || '').trim(),
      eventDate: String(body.eventDate || '').trim(),
      guests: String(body.guests || '').trim(),
      budget: String(body.budget || '').trim(),
      description: String(body.description || '').trim(),
      consent: body.consent ? 'yes' : 'no'
    };

    if (!lead.fullName || !lead.email) {
      return json({ ok: false, error: 'missing name or email' });
    }

    appendRow(lead);

    var emailed = false;
    try {
      sendEnquirerEmail(lead);
      emailed = true;
    } catch (err) {
      console.error('enquirer email failed: ' + err);
    }

    var notified = false;
    try {
      notifyBusiness(lead);
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

// Uses the sheet's own header row when it has one, so a sheet that already has
// columns keeps them. Writes HEADERS into a blank sheet.
function sheetHeaders(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol > 0) {
    var hdr = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var filled = hdr.filter(function (h) {
      return String(h).trim() !== '';
    });
    if (filled.length) return hdr;
  }
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  return HEADERS;
}

function appendRow(lead) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var values = {
    id: 'w:' + Date.now(),
    created_time: nowStamp(ss),
    form_name: lead.formName,
    occasion: lead.occasion,
    full_name: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    event_date: lead.eventDate,
    guests: lead.guests,
    budget: lead.budget,
    description: lead.description,
    consent: lead.consent,
    platform: 'website',
    lead_status: 'CREATED'
  };

  // The first tab keeps every enquiry, so there is always one place to see the
  // whole pipeline. Each card also gets its own tab.
  var master = ss.getSheets()[0];
  writeTo(master, values);

  var tabName = tabNameFor(lead.formName);
  var tab = ss.getSheetByName(tabName);
  if (!tab) {
    tab = ss.insertSheet(tabName);
  }
  // Guard against the first tab already being named after a card, which would
  // otherwise write the same enquiry twice.
  if (tab.getSheetId() !== master.getSheetId()) {
    writeTo(tab, values);
  }
}

// Your sheet's own header row wins, so columns match whatever they are called.
// "Name", "Full Name", "Number", "Mobile", "Email Address" etc. all resolve to
// the right field — otherwise a header the script did not expect writes blank.
var HEADER_ALIASES = {
  created_time: 'created_time', created: 'created_time', timestamp: 'created_time',
  submitted: 'created_time', submitted_at: 'created_time',

  form_name: 'form_name', form: 'form_name', card: 'form_name',
  enquiry: 'form_name', enquiry_type: 'form_name', service: 'form_name',

  occasion: 'occasion', event: 'occasion', event_type: 'occasion',

  full_name: 'full_name', name: 'full_name', fullname: 'full_name',
  contact_name: 'full_name', customer_name: 'full_name', client_name: 'full_name',

  email: 'email', email_address: 'email', e_mail: 'email', mail: 'email',

  phone: 'phone', phone_number: 'phone', number: 'phone', mobile: 'phone',
  mobile_number: 'phone', contact: 'phone', contact_number: 'phone', tel: 'phone',

  event_date: 'event_date', date: 'event_date', function_date: 'event_date',

  guests: 'guests', number_of_guests: 'guests', guest_count: 'guests',
  no_of_guests: 'guests', pax: 'guests',

  budget: 'budget', budget_range: 'budget',

  description: 'description', notes: 'description', details: 'description',
  message: 'description', additional_notes: 'description', requirements: 'description',

  consent: 'consent',
  platform: 'platform', source: 'platform',
  lead_status: 'lead_status', status: 'lead_status',
  id: 'id'
};

function normHeader(h) {
  return String(h).trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function writeTo(sheet, values) {
  var headers = sheetHeaders(sheet);
  var row = headers.map(function (h) {
    var key = HEADER_ALIASES[normHeader(h)];
    return key && values.hasOwnProperty(key) ? values[key] : '';
  });
  sheet.appendRow(row);
}

// Google forbids : \ / ? * [ ] in tab names and caps them at 100 characters.
function tabNameFor(formName) {
  var n = String(formName || 'Other').replace(/[:\\\/?*\[\]]/g, '').trim();
  return n ? n.slice(0, 90) : 'Other';
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

function firstName(full) {
  var n = String(full || '').trim().split(/\s+/)[0] || '';
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : '';
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ---------- Email to the person enquiring ---------- */

function sendEnquirerEmail(lead) {
  var name = firstName(lead.fullName);
  var hello = name ? 'Hello ' + name + ',' : 'Hello,';

  var text = hello + '\n\n'
    + 'Thank you for your catering enquiry. We have it, and someone from our team '
    + 'will be in touch shortly to talk through the menu.\n\n'
    + 'What you sent us:\n'
    + '  Enquiry: ' + lead.formName + '\n'
    + '  Occasion: ' + lead.occasion + '\n'
    + '  Date: ' + lead.eventDate + '\n'
    + '  Guests: ' + lead.guests + '\n'
    + '  Budget: ' + lead.budget + '\n\n'
    + 'If your date is close, call us on ' + PHONE + ' and we will sort it faster.\n\n'
    + 'Madras Social\n'
    + '6261 Mayfield Rd, Unit 145, Brampton, ON L6P 0X9\n';

  var opts = {
    to: lead.email,
    subject: 'We have your catering enquiry — Madras Social',
    name: 'Madras Social',
    replyTo: REPLY_TO,
    body: text
  };

  var html = fetchTemplate();
  if (html) {
    opts.htmlBody = html
      .replace(/{{HELLO}}/g, escapeHtml(hello))
      .replace(/{{ENQUIRY}}/g, escapeHtml(lead.formName || '—'))
      .replace(/{{OCCASION}}/g, escapeHtml(lead.occasion || '—'))
      .replace(/{{DATE}}/g, escapeHtml(lead.eventDate || '—'))
      .replace(/{{GUESTS}}/g, escapeHtml(lead.guests || '—'))
      .replace(/{{BUDGET}}/g, escapeHtml(lead.budget || '—'));
  }

  sendAs(opts);
}

// Returns '' if the site is unreachable, so the plain-text email still sends.
function fetchTemplate(url) {
  try {
    var res = UrlFetchApp.fetch(url || TEMPLATE_URL, { muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) {
      console.warn('template fetch returned ' + res.getResponseCode());
      return '';
    }
    return res.getContentText();
  } catch (err) {
    console.error('template fetch failed: ' + err);
    return '';
  }
}

/* ---------- Email to the business ---------- */

function notifyBusiness(lead) {
  var subject = '[' + lead.formName + '] New catering enquiry'
    + (lead.occasion ? ' — ' + lead.occasion : '')
    + (lead.eventDate ? ' (' + lead.eventDate + ')' : '');

  var text = 'New catering enquiry from the website.\n\n'
    + 'Card / form: ' + lead.formName + '\n'
    + 'Name: ' + lead.fullName + '\n'
    + 'Phone: ' + lead.phone + '\n'
    + 'Email: ' + lead.email + '\n'
    + 'Occasion: ' + lead.occasion + '\n'
    + 'Date: ' + lead.eventDate + '\n'
    + 'Guests: ' + lead.guests + '\n'
    + 'Budget: ' + lead.budget + '\n'
    + 'Consent: ' + lead.consent + '\n\n'
    + 'Description:\n' + lead.description + '\n';

  var opts = {
    to: NOTIFY_INTERNAL,
    subject: subject,
    name: 'Madras Social website',
    replyTo: lead.email || REPLY_TO,
    body: text
  };

  var html = fetchTemplate(INTERNAL_TEMPLATE_URL);
  if (html) {
    opts.htmlBody = html
      .replace(/{{CARD}}/g, escapeHtml(lead.formName || 'Catering'))
      .replace(/{{OCCASION}}/g, escapeHtml(lead.occasion || '—'))
      .replace(/{{NAME}}/g, escapeHtml(lead.fullName || '—'))
      .replace(/{{FIRST_NAME}}/g, escapeHtml(firstName(lead.fullName) || 'them'))
      .replace(/{{EMAIL}}/g, escapeHtml(lead.email || ''))
      .replace(/{{PHONE}}/g, escapeHtml(lead.phone || '—'))
      .replace(/{{PHONE_RAW}}/g, escapeHtml(String(lead.phone || '').replace(/[^0-9+]/g, '')))
      .replace(/{{DATE}}/g, escapeHtml(lead.eventDate || '—'))
      .replace(/{{GUESTS}}/g, escapeHtml(lead.guests || '—'))
      .replace(/{{BUDGET}}/g, escapeHtml(lead.budget || '—'))
      .replace(/{{DESCRIPTION}}/g, nl2br(lead.description || '—'))
      .replace(/{{CONSENT}}/g, escapeHtml(lead.consent))
      .replace(/{{RECEIVED}}/g, escapeHtml(receivedStamp()))
      .replace(/{{REPLY_SUBJECT}}/g, encodeURIComponent('Your Madras Social catering enquiry'));
  }

  sendAs(opts);
}

// Keeps line breaks the customer typed, without allowing any other markup.
function nl2br(s) {
  return escapeHtml(s).replace(/\r?\n/g, '<br>');
}

function receivedStamp() {
  try {
    return Utilities.formatDate(new Date(), 'America/Toronto', 'd MMM yyyy, h:mm a');
  } catch (err) {
    return new Date().toISOString();
  }
}

/* ---------- Sending helpers ---------- */

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

/* ---------- Run these from the editor to check setup ---------- */

function checkAccess() {
  Logger.log('Running as: ' + Session.getEffectiveUser().getEmail());
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];
    Logger.log('Opened: ' + ss.getName() + '  (tab: ' + sheet.getName() + ')');
    Logger.log('Headers: ' + sheetHeaders(sheet).join(' | '));
    Logger.log('OK — the script can write to this sheet.');
  } catch (err) {
    Logger.log('CANNOT open the sheet: ' + err);
    Logger.log('Share the sheet with the account above, as Editor.');
  }
}

function listAliases() {
  var aliases = GmailApp.getAliases();
  Logger.log('Account: ' + Session.getEffectiveUser().getEmail());
  Logger.log('Verified send-as aliases: ' + (aliases.length ? aliases.join(', ') : '(none)'));
  Logger.log(SEND_AS + ' usable as From: ' + (aliases.indexOf(SEND_AS) !== -1));
}

// Writes one fake enquiry and sends both emails, so you can verify end to end.
function sendTestLead() {
  var lead = {
    formName: 'Weddings & Celebrations',
    occasion: 'Test wedding',
    fullName: 'Test Person',
    email: Session.getEffectiveUser().getEmail(),
    phone: '(905) 000-0000',
    eventDate: '2026-12-01',
    guests: '120',
    budget: '$30 per guest',
    description: 'This is a test enquiry written by sendTestLead().',
    consent: 'yes'
  };
  appendRow(lead);
  sendEnquirerEmail(lead);
  notifyBusiness(lead);
  Logger.log('Test row appended and both emails sent to ' + lead.email + ' / ' + NOTIFY_INTERNAL);
}
