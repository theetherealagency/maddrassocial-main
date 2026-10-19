// Copies the hiring site into dist/_sites/ so the one Vercel project can serve
// it; middleware.js routes its hostname there. Docs and the Apps Script sources
// stay in the repo but are not published. (RSVP used to be copied too; it is
// now the /rsvp route in the main app, and rsvp.madrassocial.ca redirects.)
import { cpSync, rmSync } from 'node:fs';
import { basename, relative } from 'node:path';

const SKIP_FILES = new Set(['vercel.json', '.vercelignore', 'README.md', 'SETUP.md', 'Code.gs']);
const SKIP_DIRS = new Set(['apps-script']);

for (const site of ['hiring']) {
  const dest = `dist/_sites/${site}`;
  rmSync(dest, { recursive: true, force: true });
  cpSync(site, dest, {
    recursive: true,
    filter: (src) => {
      const name = basename(src);
      const rel = relative(site, src);
      if (SKIP_FILES.has(name)) return false;
      if (rel.split('/').some((part) => SKIP_DIRS.has(part))) return false;
      return true;
    },
  });
  console.log(`[subsites] copied ${site}/ -> ${dest}`);
}
