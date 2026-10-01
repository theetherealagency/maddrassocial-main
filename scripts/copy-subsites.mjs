// Copies the hiring and RSVP sites into dist/_sites/ so the one Vercel project
// can serve them; middleware.js routes their hostnames there. Docs and the Apps
// Script sources stay in the repo but are not published.
import { cpSync, rmSync } from 'node:fs';
import { basename, relative } from 'node:path';

const SKIP_FILES = new Set(['vercel.json', '.vercelignore', 'README.md', 'SETUP.md', 'Code.gs']);
const SKIP_DIRS = new Set(['apps-script']);

for (const site of ['hiring', 'rsvp']) {
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
