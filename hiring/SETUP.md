# Madras Social — backend setup (one time, ~5 minutes)

The website's forms (job applications + launch list) post to a small Google
Apps Script that lives in the **hello@madrassocial.ca** Google account. That's
what makes everything land in the right place:

- applications + launch list → the hiring sheet (see below)
- resumes → a Drive folder owned by hello@madrassocial.ca
- confirmation + notification emails → sent **from** hello@madrassocial.ca
- notifications arrive at **hello@madrassocial.ca**

No servers, no monthly cost, nothing to maintain.

## The sheet

Applications are written to this spreadsheet, already set in `Code.gs`:

```
https://docs.google.com/spreadsheets/d/1KLOKnUjm8yrhdhfjrKUi8U6RDHBuxXaJHulW551_qvg/edit
```

Three tabs get used, and the script creates any that are missing:

| Tab | What's in it |
| --- | --- |
| **Applications** | one row per application, `Status` drives the follow-up emails |
| **Launch List** | the opening-night list, if that form goes live |
| **Email Templates** | the wording for Interview / Offer / No — edit freely |

**The sheet's own column names win.** Rename `Name` to `Applicant`, drag
columns into a different order, or add columns of your own — the script reads
the header row and writes to the right places. It only writes its own headers
into a tab whose first row is genuinely empty. If a column is named something
the script doesn't recognise, add that name to `APP_ALIASES` in `Code.gs`.

## Steps (do these logged in as hello@madrassocial.ca)

1. **Check the sheet opens in this account.** Open the link above while signed
   in as hello@madrassocial.ca. If it asks for access, the sheet is owned by
   someone else — share it with hello@madrassocial.ca as an **Editor** first.

2. **Create the script.** Go to <https://script.google.com> → **New project**.
   Delete the placeholder code, paste in the entire contents of
   `apps-script/Code.gs`, and save (name it "Madras Social backend").

3. **Run `setupOnce`.** Pick that function in the toolbar and press **Run**.
   Google asks for permissions (Sheets, Drive, Mail) — approve them. The log
   (View → Logs) prints the sheet name, its tabs, and the Resumes folder link.
   An error here means the account can't reach the sheet — go back to step 1.

4. **Deploy as a Web App.** Deploy → **New deployment** → type **Web app** →
   - Execute as: **Me** (hello@madrassocial.ca)
   - Who has access: **Anyone**

   → Deploy, then copy the Web App URL (ends in `/exec`).

5. **Wire the site.** Paste that URL into `config.js`:

   ```js
   ENDPOINT: 'https://script.google.com/macros/s/XXXX/exec',
   ```

   Then redeploy the site (or send the URL to The Ethereal Agency and we'll do
   it). **Until this line is filled in, the form confirms on screen and saves
   nothing.**

6. **Test.** Submit a real application on the live site. Within a few seconds:
   a row in the sheet, the resume in Drive, a confirmation email at the address
   you used, and a notification at hello@madrassocial.ca. Delete the test row
   afterwards — reference numbers come from a stored counter, so deleting a row
   never hands the next applicant a number that's already been used.

## Checking the wiring later

Open the Web App URL with the diagnostic token on the end:

```
https://script.google.com/macros/s/XXXX/exec?diag=ms-hiring-2026
```

It reports which account is running, the remaining daily mail quota, the
sheet's name and tabs, the Applications headers it found, any headers it
ignores, and — the important one — `fieldsWithNoColumn`, the fields that have
nowhere to go. Anything listed there is data being dropped.

`checkAccess()` in the editor prints the same report.
`sendTestApplication()` writes one fake row and sends both emails.

## Day-to-day

- **The sheet is the tracker.** Every application arrives with Status = "New".
  Work down the column: Reviewed → Interview → Offer → Hired.
- **Stage replies are automatic.** Setting Status to *Interview*, *Offer*, or
  *No — keep on file* sends the matching email from the **Email Templates**
  tab. `{{name}}`, `{{role}}` and `{{ref}}` fill themselves in. *New*,
  *Reviewed* and *Hired* send nothing.
- **Closing a role.** Delete its entry in `config.js` → the role cards,
  dropdown and counts update on the next deploy. The talent-pool option stays
  up permanently.
- **QR / poster tracking.** Print the careers URL with `?src=qr` (or
  `?src=poster`, `?src=ig`) — the Source column records where each applicant
  came from.

## Notes

- Emails send from hello@madrassocial.ca because the script *runs as* that
  account. A standard Gmail account sends 100 recipients/day and each
  application uses two, so roughly 50 applications a day before mail stops.
  The row is always written first, so a mail failure never costs an
  application — and the notification email says so when the applicant's
  confirmation didn't go out.
- Duplicate guard is the phone number. The same number twice is recognised and
  the applicant is told they're already covered; a different number is treated
  as a new person.
- To change the reference prefix (MS-2026-###), edit `REF_PREFIX` in both
  `Code.gs` and `config.js`. To restart numbering, delete the `REF_COUNTER`
  script property (Project Settings → Script Properties).
