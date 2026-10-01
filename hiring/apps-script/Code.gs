/**
 * ═══════════════════════════════════════════════════════════════
 * MADRAS SOCIAL — hiring & launch-list backend
 * Deploy this as a Web App from the hello@madrassocial.ca account.
 * (See SETUP.md — about 5 minutes, no code changes needed.)
 *
 * What it does on every submission from the website:
 *  · Applications  → appended to the "Applications" tab of the sheet below
 *  · Resume file   → saved to Drive folder "Madras Social — Resumes",
 *                    link recorded in the sheet
 *  · Launch list   → appended to the "Launch List" tab
 *  · Two emails    → applicant confirmation (brand voice) +
 *                    notification to hello@madrassocial.ca
 *  · Duplicates    → same phone twice = flagged, not double-counted
 *  · Stage replies → change the Status column in the sheet and the
 *                    matching template from "Email Templates" is sent
 *
 * The sheet's own header row wins. Rename "Name" to "Applicant" or move
 * columns around and the script still writes to the right place — see
 * APP_ALIASES. Only a completely blank tab gets our headers written in.
 * ═══════════════════════════════════════════════════════════════
 */

var BRAND = 'Madras Social';
var INBOX = 'hello@madrassocial.ca';          // the business inbox — notifications land here
var REF_PREFIX = 'MS-2026';

// The hiring sheet. The account running this script needs Editor access to it.
var SHEET_ID = '1KLOKnUjm8yrhdhfjrKUi8U6RDHBuxXaJHulW551_qvg';

// Lets you check the wiring from a browser: <web app URL>?diag=<this token>
var DIAG_TOKEN = 'ms-hiring-2026';

// The branded email designs live on the website, so changing how an email looks
// is a site deploy — this script does not need re-pasting for design edits.
// If either is unreachable, the plain-text version of the email still sends.
var SITE = 'https://hiring.madrassocial.ca';
var TEMPLATE_APPLICANT = SITE + '/email/applicant';
var TEMPLATE_INTERNAL = SITE + '/email/internal';

var APP_TAB = 'Applications';
var NOTIFY_TAB = 'Launch List';
var TEMPLATE_TAB = 'Email Templates';
var OUR_TABS = [APP_TAB, NOTIFY_TAB, TEMPLATE_TAB];

var APP_HEADERS = ['Timestamp', 'Ref', 'Name', 'Phone', 'Email', 'Role', 'Full/Part', 'Availability', 'Experience', 'Earliest start', 'Referral', 'Note', 'Source', 'Page', 'Resume', 'Status'];
var NOTIFY_HEADERS = ['Timestamp', 'Email', 'Phone', 'Postal', 'Source', 'Page'];
var STATUSES = ['New', 'Reviewed', 'Interview', 'Offer', 'Hired', 'No — keep on file'];

/* ── column names the script recognises ──────────────────────────
   Left side: whatever the header cell says, lower-cased with spaces and
   punctuation collapsed to underscores. Right side: the field it holds.
   Add a line here if the client renames a column to something new.        */
var APP_ALIASES = {
  timestamp: 'timestamp', created: 'timestamp', created_time: 'timestamp',
  submitted: 'timestamp', submitted_at: 'timestamp', date_received: 'timestamp',

  ref: 'ref', reference: 'ref', reference_no: 'ref', ref_no: 'ref', id: 'ref',

  name: 'name', full_name: 'name', fullname: 'name', applicant: 'name',
  applicant_name: 'name', candidate: 'name', candidate_name: 'name',

  phone: 'phone', phone_number: 'phone', number: 'phone', mobile: 'phone',
  mobile_number: 'phone', contact: 'phone', contact_number: 'phone', tel: 'phone',

  email: 'email', email_address: 'email', e_mail: 'email', mail: 'email',

  role: 'role', position: 'role', applying_for: 'role', job: 'role', role_applied_for: 'role',

  full_part: 'type', full_or_part_time: 'type', type: 'type', hours: 'type',
  full_part_time: 'type', employment_type: 'type',

  availability: 'availability', available: 'availability', shifts: 'availability',

  experience: 'experience', years_of_experience: 'experience', exp: 'experience',

  earliest_start: 'start', start: 'start', start_date: 'start',
  earliest_start_date: 'start', can_start: 'start', available_from: 'start',

  referral: 'referral', referred_by: 'referral', reference_from: 'referral',

  note: 'note', notes: 'note', message: 'note', anything_else: 'note',
  comments: 'note', details: 'note',

  source: 'source', came_from: 'source', src: 'source', platform: 'source',

  page: 'page', page_path: 'page', url: 'page',

  resume: 'resume', resume_link: 'resume', cv: 'resume', attachment: 'resume',

  status: 'status', stage: 'status', lead_status: 'status'
};

var NOTIFY_ALIASES = {
  timestamp: 'timestamp', created: 'timestamp', created_time: 'timestamp',
  submitted: 'timestamp', submitted_at: 'timestamp',
  email: 'email', email_address: 'email', e_mail: 'email', mail: 'email',
  phone: 'phone', phone_number: 'phone', number: 'phone', mobile: 'phone',
  postal: 'postal', postal_code: 'postal', postcode: 'postal', zip: 'postal',
  source: 'source', came_from: 'source', src: 'source', platform: 'source',
  page: 'page', page_path: 'page', url: 'page'
};

/* ── opening the book ────────────────────────────────────────── */
function getBook() {
  var ss;
  try {
    ss = SpreadsheetApp.openById(SHEET_ID);
  } catch (err) {
    throw new Error('Cannot open the hiring sheet. Share it with ' +
      safeUser() + ' as an Editor. (id ' + SHEET_ID + ' · ' + err + ')');
  }
  appSheet(ss);        // resolved first, so it gets the blank starting tab
  notifySheet(ss);
  ensureTemplates(ss);
  return ss;
}

/* ── which tab holds what ────────────────────────────────────────
   The sheet may already have a tab prepared for this. Rather than adding a
   second one beside it, an empty starting tab gets renamed, and a tab that
   already carries recognisable headers is used exactly where it is, under
   whatever name it has.                                                    */
function appSheet(ss) {
  var sh = ss.getSheetByName(APP_TAB);
  if (sh) { liveHeaders(sh, APP_HEADERS); return sh; }

  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var s = sheets[i];
    if (OUR_TABS.indexOf(s.getName()) !== -1) continue;
    if (s.getLastRow() === 0) {
      // Untouched — claim it and give it the right name.
      s.setName(APP_TAB);
      liveHeaders(s, APP_HEADERS);
      applyStatusValidation(s);
      return s;
    }
    if (recognisedFields(s) >= 3) {
      // Someone already set this up. Leave the name and the columns alone.
      return s;
    }
  }
  var made = ss.insertSheet(APP_TAB);
  liveHeaders(made, APP_HEADERS);
  applyStatusValidation(made);
  return made;
}

function notifySheet(ss) {
  var sh = ss.getSheetByName(NOTIFY_TAB) || ss.insertSheet(NOTIFY_TAB);
  liveHeaders(sh, NOTIFY_HEADERS);
  return sh;
}

// How many of our fields this tab's header row accounts for.
function recognisedFields(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) return 0;
  var hdr = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var seen = {}, n = 0;
  for (var i = 0; i < hdr.length; i++) {
    var key = APP_ALIASES[normHeader(hdr[i])];
    if (key && !seen[key]) { seen[key] = true; n++; }
  }
  return n;
}

function safeUser() {
  try { return Session.getEffectiveUser().getEmail(); } catch (err) { return 'the script account'; }
}

function getResumeFolder() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('FOLDER_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  var folder = DriveApp.createFolder('Madras Social — Resumes');
  props.setProperty('FOLDER_ID', folder.getId());
  return folder;
}

// Finds the tab by name. If it isn't there, an untouched blank tab gets renamed
// rather than left behind as clutter — a fresh spreadsheet arrives with one.
function ensureTab(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    var sheets = ss.getSheets();
    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].getLastRow() === 0 && OUR_TABS.indexOf(sheets[i].getName()) === -1) {
        sh = sheets[i].setName(name);
        break;
      }
    }
    if (!sh) sh = ss.insertSheet(name);
  }
  liveHeaders(sh, headers);
  if (name === APP_TAB) applyStatusValidation(sh);
  return sh;
}

// The tab's own header row when it has one, so existing columns are respected.
// Ours are written in only when row 1 is genuinely empty.
function liveHeaders(sheet, defaults) {
  var lastCol = sheet.getLastColumn();
  if (lastCol > 0) {
    var hdr = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    for (var i = 0; i < hdr.length; i++) {
      if (String(hdr[i]).trim() !== '') return hdr;
    }
  }
  sheet.getRange(1, 1, 1, defaults.length).setValues([defaults]);
  sheet.getRange(1, 1, 1, defaults.length)
    .setFontWeight('bold').setBackground('#1f1b1a').setFontColor('#ece4d8');
  sheet.setFrozenRows(1);
  return defaults;
}

function applyStatusValidation(sh) {
  var col = colOf(sh, APP_HEADERS, APP_ALIASES, 'status');
  if (!col) return;
  var rows = sh.getMaxRows() - 1;
  if (rows < 1) return;
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build();
  sh.getRange(2, col, rows, 1).setDataValidation(rule);
}

function normHeader(h) {
  return String(h).trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// 1-based column holding a given field, or 0 if the sheet has no column for it.
function colOf(sheet, defaults, aliases, key) {
  var hdr = liveHeaders(sheet, defaults);
  for (var i = 0; i < hdr.length; i++) {
    if (aliases[normHeader(hdr[i])] === key) return i + 1;
  }
  return 0;
}

// Writes one row in the sheet's own column order. A column the script has no
// value for is left blank; a value the sheet has no column for is dropped.
function appendMapped(sheet, defaults, aliases, values) {
  var hdr = liveHeaders(sheet, defaults);
  var row = [];
  for (var i = 0; i < hdr.length; i++) {
    var key = aliases[normHeader(hdr[i])];
    row.push(key && values.hasOwnProperty(key) ? values[key] : '');
  }
  sheet.appendRow(row);
  return row;
}

function ensureTemplates(ss) {
  var sh = ss.getSheetByName(TEMPLATE_TAB);
  if (sh) return sh;
  sh = ss.insertSheet(TEMPLATE_TAB);
  sh.appendRow(['Status', 'Subject', 'Body  ({{name}}, {{role}}, {{ref}} are replaced automatically)']);
  sh.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#1f1b1a').setFontColor('#ece4d8');
  sh.setFrozenRows(1);
  sh.appendRow(['Interview', 'Come talk to us — {{ref}}',
    'Hi {{name}},\n\nWe read your application for {{role}} and we\'d like to meet you. Reply to this email with a couple of times that work this week and we\'ll make one of them happen.\n\n— The Madras Social team']);
  sh.appendRow(['Offer', 'Good news from Madras Social — {{ref}}',
    'Hi {{name}},\n\nWe\'d like to offer you the {{role}} position on our opening team. We\'ll follow up with the details — but we wanted you to hear the good part first.\n\n— The Madras Social team']);
  sh.appendRow(['No — keep on file', 'About your application — {{ref}}',
    'Hi {{name}},\n\nThank you for applying for {{role}}. We went another way for this opening — but we\'re keeping your application on file, and you\'ll hear from us before the next posting goes public.\n\n— The Madras Social team']);
  return sh;
}

/* ── web app entry ───────────────────────────────────────────── */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.kind === 'notify') return json(handleNotify(data));
    if (data.kind === 'application') return json(handleApplication(data));
    return json({ ok: false, error: 'unknown kind' });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.diag === DIAG_TOKEN) return json(diagnostics());
  return json({ ok: true, service: 'Madras Social backend' });
}

// Reports the things that make this fail silently, so the wiring can be checked
// from a browser without opening the editor.
function diagnostics() {
  var out = { ok: true, runningAs: safeUser(), inbox: INBOX, sheetId: SHEET_ID };
  try { out.mailQuotaRemaining = MailApp.getRemainingDailyQuota(); }
  catch (err) { out.mailQuotaRemaining = 'ERROR: ' + err; }
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    out.sheetName = ss.getName();
    out.sheetUrl = ss.getUrl();
    out.tabs = ss.getSheets().map(function (sh) {
      return sh.getName() + ' (' + Math.max(0, sh.getLastRow() - 1) + ' rows)';
    });
    var app = appSheet(ss);
    out.applicationsTab = app.getName();
    var hdr = liveHeaders(app, APP_HEADERS);
    out.applicationsHeaders = hdr;
    // Headers the script writes nothing into — usually a typo, or a column the
    // client added by hand, which is fine but worth seeing.
    out.headersScriptIgnores = hdr.filter(function (h) {
      return String(h).trim() !== '' && !APP_ALIASES[normHeader(h)];
    });
    // Fields with nowhere to go — these are the ones that lose data.
    var missing = [];
    ['timestamp', 'ref', 'name', 'phone', 'email', 'role', 'type', 'availability',
     'experience', 'start', 'referral', 'note', 'source', 'page', 'resume', 'status']
      .forEach(function (k) {
        if (!colOf(app, APP_HEADERS, APP_ALIASES, k)) missing.push(k);
      });
    out.fieldsWithNoColumn = missing;
  } catch (err) {
    out.ok = false;
    out.sheetError = 'Cannot open the sheet — share it with ' + out.runningAs +
      ' as an Editor. (' + err + ')';
  }
  return out;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ── launch list ─────────────────────────────────────────────── */
function handleNotify(d) {
  var ss = getBook();
  var sh = notifySheet(ss);
  var emailCol = colOf(sh, NOTIFY_HEADERS, NOTIFY_ALIASES, 'email');

  // soft dedupe on email
  if (emailCol && sh.getLastRow() > 1) {
    var seen = sh.getRange(2, emailCol, sh.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < seen.length; i++) {
      if (String(seen[i][0]).trim().toLowerCase() === String(d.email || '').trim().toLowerCase()) {
        return { ok: true, duplicate: true };
      }
    }
  }

  appendMapped(sh, NOTIFY_HEADERS, NOTIFY_ALIASES, {
    timestamp: new Date(),
    email: d.email || '',
    phone: "'" + (d.phone || ''),
    postal: d.postal || '',
    source: d.source || 'direct',
    page: d.page || ''
  });
  return { ok: true };
}

/* ── applications ────────────────────────────────────────────── */
function handleApplication(d) {
  // One at a time: two people submitting in the same second would otherwise
  // both pass the duplicate check and could take the same reference number.
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var ss = getBook();
    var sh = appSheet(ss);   // not getSheetByName — an adopted tab keeps its own name

    // duplicate phone check
    var digits = String(d.phone || '').replace(/\D/g, '');
    var phoneCol = colOf(sh, APP_HEADERS, APP_ALIASES, 'phone');
    if (digits && phoneCol && sh.getLastRow() > 1) {
      var phones = sh.getRange(2, phoneCol, sh.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < phones.length; i++) {
        if (String(phones[i][0]).replace(/\D/g, '') === digits) {
          return { ok: true, duplicate: true };
        }
      }
    }

    var ref = nextRef();

    // resume → Drive
    var resumeLink = '';
    if (d.resume && d.resume.data) {
      try {
        var bytes = Utilities.base64Decode(d.resume.data);
        var safe = ref + ' — ' + (d.name || 'applicant') + ' — ' + (d.resume.name || 'resume');
        var blob = Utilities.newBlob(bytes, d.resume.mime || 'application/octet-stream', safe);
        resumeLink = getResumeFolder().createFile(blob).getUrl();
      } catch (err) {
        resumeLink = 'upload failed: ' + err;
      }
    }

    appendMapped(sh, APP_HEADERS, APP_ALIASES, {
      timestamp: new Date(),
      ref: ref,
      name: d.name || '',
      phone: "'" + (d.phone || ''),   // leading quote keeps (226) 555-0142 as typed
      email: d.email || '',
      role: d.role || '',
      type: d.type || '',
      availability: d.availability || '',
      experience: d.experience || '',
      start: d.start || '',
      referral: d.referral || '',
      note: d.note || '',
      source: d.source || 'direct',
      page: d.page || '',
      resume: resumeLink,
      status: 'New'
    });

    // Both emails are best-effort: the row is already saved, and a mail failure
    // must not cost us the application. Failures come back in the response so
    // the site (and the notification) can say something honest.
    var mailErrors = [];

    try {
      sendApplicantEmail(d, ref, resumeLink);
    } catch (err) {
      console.error('applicant email failed: ' + err);
      mailErrors.push('applicant: ' + err);
    }

    try {
      notifyBusiness(d, ref, resumeLink, digits, mailErrors);
    } catch (err) {
      console.error('business email failed: ' + err);
      mailErrors.push('business: ' + err);
    }

    return { ok: true, ref: ref, mailed: mailErrors.length === 0 };
  } finally {
    lock.releaseLock();
  }
}

// A stored counter, so deleting a test row doesn't hand the next applicant a
// number that has already been used.
function nextRef() {
  var props = PropertiesService.getScriptProperties();
  var n = parseInt(props.getProperty('REF_COUNTER') || '0', 10) + 1;
  props.setProperty('REF_COUNTER', String(n));
  return REF_PREFIX + '-' + Utilities.formatString('%03d', n);
}

/* ── shared email helpers ────────────────────────────────────── */

// Returns '' when the site is unreachable, so the plain-text email still goes.
function fetchTemplate(url) {
  try {
    var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    if (res.getResponseCode() !== 200) {
      console.warn('template ' + url + ' returned ' + res.getResponseCode());
      return '';
    }
    return res.getContentText();
  } catch (err) {
    console.error('template fetch failed (' + url + '): ' + err);
    return '';
  }
}

function firstName(full) {
  var n = String(full || '').trim().split(/\s+/)[0] || '';
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : '';
}

// "2026-09-02" → "2 September 2026". Built from the string rather than a Date,
// so a yyyy-mm-dd value can't slip a day across time zones.
var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
function prettyDate(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim());
  if (!m) return String(s || '');
  var mi = parseInt(m[2], 10) - 1;
  if (mi < 0 || mi > 11) return String(s);
  return parseInt(m[3], 10) + ' ' + MONTHS[mi] + ' ' + m[1];
}

function receivedStamp() {
  try {
    return Utilities.formatDate(new Date(), 'America/Toronto', 'd MMM, h:mm a');
  } catch (err) {
    return '';
  }
}

function thisYear() {
  try {
    return Utilities.formatDate(new Date(), 'America/Toronto', 'yyyy');
  } catch (err) {
    return '2026';
  }
}

// Keeps the line breaks someone typed, without letting any other markup through.
function nl2br(s) {
  return esc(s).replace(/\r?\n/g, '<br>');
}

/* ── email to the applicant ──────────────────────────────────── */
function sendApplicantEmail(d, ref, resumeLink) {
  var name = firstName(d.name);
  var hello = name ? 'Hi ' + name + ' —' : 'Hello —';

  var opts = {
    to: d.email,
    subject: 'We have it — ' + ref + ' · ' + BRAND,
    name: BRAND,
    replyTo: INBOX,
    body:
      'Hi ' + (d.name || 'there') + ',\n\n' +
      'Your application for ' + (d.role || 'the opening team') + ' landed. Your reference number is ' + ref + '.\n\n' +
      'Here\'s how it works: we read everything within two working days. If it\'s a fit, we text — so keep an eye on your phone. ' +
      'If it isn\'t this time, you stay on file and hear from us before the next posting goes public.\n\n' +
      'What you sent us:\n' +
      '  Role: ' + (d.role || '—') + '\n' +
      '  Full or part time: ' + (d.type || '—') + '\n' +
      '  Availability: ' + (d.availability || '—') + '\n' +
      '  Earliest start: ' + (prettyDate(d.start) || '—') + '\n' +
      '  Resume: ' + (resumeLink ? 'received' : 'not attached') + '\n\n' +
      'Thanks for wanting to build this with us.\n\n' +
      '— The Madras Social team\n8 Erb Street West, Uptown Waterloo'
  };

  var html = fetchTemplate(TEMPLATE_APPLICANT);
  if (html) {
    opts.htmlBody = html
      .replace(/\{\{HELLO\}\}/g, esc(hello))
      .replace(/\{\{REF\}\}/g, esc(ref))
      .replace(/\{\{ROLE\}\}/g, esc(d.role || '—'))
      .replace(/\{\{TYPE\}\}/g, esc(d.type || '—'))
      .replace(/\{\{AVAILABILITY\}\}/g, esc(d.availability || 'You didn’t say — that’s fine'))
      .replace(/\{\{START\}\}/g, esc(prettyDate(d.start) || '—'))
      .replace(/\{\{RESUME\}\}/g, resumeLink ? 'Received ✓' : 'Not attached — you can reply with it')
      .replace(/\{\{YEAR\}\}/g, thisYear());
  }

  sendAs(opts);
}

// Both emails go out from hello@madrassocial.ca because the script *runs as*
// that account — no send-as alias needed, and no extra Gmail permission.
function sendAs(opts) {
  MailApp.sendEmail(opts);
}

/* ── email to the business ───────────────────────────────────── */
function notifyBusiness(d, ref, resumeLink, digits, mailErrors) {
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit';

  var opts = {
    to: INBOX,
    subject: '[Application] ' + (d.role || '?') + ' — ' + (d.name || '?') + ' — can start ' + (prettyDate(d.start) || '?'),
    name: BRAND + ' Careers',
    replyTo: d.email || INBOX,
    body:
      (d.name || '?') + ' — ' + (d.role || '?') + ' — ref ' + ref + '\n' +
      'Phone: ' + (d.phone || '—') + '\nEmail: ' + (d.email || '—') + '\n' +
      'Availability: ' + (d.availability || '—') + '\nExperience: ' + (d.experience || '—') + '\n' +
      'Earliest start: ' + (prettyDate(d.start) || '—') + '\nReferral: ' + (d.referral || '—') + '\n' +
      'Note: ' + (d.note || '—') + '\nSource: ' + (d.source || '—') + '\n' +
      'Resume: ' + (resumeLink || '—') + '\n' +
      (mailErrors && mailErrors.length
        ? '\nNOTE: their confirmation email did not send (' + mailErrors.join('; ') + ')\n' : '') +
      '\nSheet: ' + sheetUrl + '\n'
  };

  var html = fetchTemplate(TEMPLATE_INTERNAL);
  if (html) {
    var warning = '';
    if (mailErrors && mailErrors.length) {
      warning =
        '<tr><td style="padding:0;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fdecea;">' +
        '<tr><td style="padding:14px 30px;border-left:4px solid #c4453a;font-family:Arial,Helvetica,sans-serif;' +
        'font-size:13px;line-height:1.65;color:#7a2018;">' +
        '<strong>Their confirmation email did not send.</strong> Worth texting them so they know it arrived. ' +
        '<span style="color:#a4675e;">(' + esc(mailErrors.join('; ')) + ')</span>' +
        '</td></tr></table></td></tr>';
    }

    var resumeBlock = '';
    if (resumeLink && resumeLink.indexOf('http') === 0) {
      resumeBlock =
        '<tr><td style="padding:22px 30px 0 30px;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #4A2B22;">' +
        '<tr><td align="center" style="padding:14px 10px;">' +
        '<a href="' + esc(resumeLink) + '" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;' +
        'font-weight:bold;color:#4A2B22;text-decoration:none;letter-spacing:0.4px;">Open their resume in Drive</a>' +
        '</td></tr></table></td></tr>';
    } else if (resumeLink) {
      // The upload failed — say so rather than showing nothing.
      resumeBlock =
        '<tr><td style="padding:22px 30px 0 30px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#7a2018;">' +
        'Resume upload failed: ' + esc(resumeLink) + '</td></tr>';
    }

    opts.htmlBody = html
      .replace(/\{\{WARNING\}\}/g, warning)
      .replace(/\{\{RESUME_BLOCK\}\}/g, resumeBlock)
      .replace(/\{\{NAME\}\}/g, esc(d.name || '—'))
      .replace(/\{\{ROLE\}\}/g, esc(d.role || '—'))
      .replace(/\{\{TYPE\}\}/g, esc(d.type || '—'))
      .replace(/\{\{REF\}\}/g, esc(ref))
      .replace(/\{\{PHONE_RAW\}\}/g, esc(digits))
      .replace(/\{\{PHONE\}\}/g, esc(d.phone || '—'))
      .replace(/\{\{EMAIL\}\}/g, esc(d.email || '—'))
      .replace(/\{\{AVAILABILITY\}\}/g, esc(d.availability || '—'))
      .replace(/\{\{EXPERIENCE\}\}/g, esc(d.experience || '—'))
      .replace(/\{\{START\}\}/g, esc(prettyDate(d.start) || '—'))
      .replace(/\{\{REFERRAL\}\}/g, esc(d.referral || '—'))
      .replace(/\{\{SOURCE\}\}/g, esc(d.source || 'direct'))
      .replace(/\{\{NOTE\}\}/g, d.note ? nl2br(d.note) : '—')
      .replace(/\{\{RECEIVED\}\}/g, esc(receivedStamp()))
      .replace(/\{\{SHEET_URL\}\}/g, sheetUrl)
      .replace(/\{\{YEAR\}\}/g, thisYear());
  }

  sendAs(opts);
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

/* ── stage replies: fires when the Status column is edited ────── */
function onStatusEdit(e) {
  try {
    var sh = e.range.getSheet();
    // Compare by id, not name — the applications tab may have been adopted
    // under a name the client chose.
    if (sh.getSheetId() !== appSheet(sh.getParent()).getSheetId()) return;

    var statusCol = colOf(sh, APP_HEADERS, APP_ALIASES, 'status');
    if (!statusCol || e.range.getColumn() !== statusCol) return;

    var row = e.range.getRow();
    if (row < 2) return;
    var status = e.range.getValue();

    var ss = sh.getParent();
    var tpl = ss.getSheetByName(TEMPLATE_TAB);
    if (!tpl) return;
    var rows = tpl.getDataRange().getValues();
    var match = null;
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] === status) { match = rows[i]; break; }
    }
    if (!match) return;   // "New" / "Reviewed" / "Hired" have no template — nothing sent

    var get = function (key) {
      var c = colOf(sh, APP_HEADERS, APP_ALIASES, key);
      return c ? sh.getRange(row, c).getValue() : '';
    };
    var email = String(get('email') || '').trim();
    if (!email) return;

    var fill = function (s) {
      return String(s)
        .replace(/\{\{name\}\}/g, get('name'))
        .replace(/\{\{role\}\}/g, get('role'))
        .replace(/\{\{ref\}\}/g, get('ref'));
    };
    MailApp.sendEmail({
      to: email,
      subject: fill(match[1]),
      body: fill(match[2]),
      name: BRAND,
      replyTo: INBOX
    });
  } catch (err) {
    console.error('stage reply failed: ' + err);
  }
}

/* ── run these from the editor to check the setup ────────────── */

// Run once: authorizes, prepares the tabs, installs the Status trigger.
function setupOnce() {
  var ss = getBook();
  var folder = getResumeFolder();
  var has = ScriptApp.getProjectTriggers().some(function (t) {
    return t.getHandlerFunction() === 'onStatusEdit';
  });
  if (!has) ScriptApp.newTrigger('onStatusEdit').forSpreadsheet(ss).onEdit().create();
  Logger.log('Running as: ' + safeUser());
  Logger.log('Sheet:  ' + ss.getName() + ' — ' + ss.getUrl());
  Logger.log('Tabs:   ' + ss.getSheets().map(function (s) { return s.getName(); }).join(' | '));
  Logger.log('Folder: ' + folder.getUrl());
  Logger.log('Setup complete. Now deploy as Web App (see SETUP.md).');
}

// Prints the same report the ?diag= URL returns.
function checkAccess() {
  Logger.log(JSON.stringify(diagnostics(), null, 2));
}

// Writes one fake application and sends both emails, so the whole path can be
// verified end to end. Delete the row afterwards.
function sendTestApplication() {
  var me = safeUser();
  var res = handleApplication({
    kind: 'application',
    name: 'Test Applicant',
    phone: '(226) 000-0000',
    email: me,
    role: 'Front of House (FOH)',
    type: 'Full time',
    availability: 'Evenings, Weekends',
    experience: '3–5 years',
    start: '2026-09-02',
    referral: '',
    note: 'Written by sendTestApplication() — safe to delete.',
    source: 'test',
    page: '/careers'
  });
  Logger.log('Result: ' + JSON.stringify(res));
  Logger.log('Check the sheet, plus ' + me + ' and ' + INBOX + ' for the two emails.');
}
