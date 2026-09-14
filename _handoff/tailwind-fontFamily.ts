// Replaces the fontFamily block in tailwind.config.ts.
// The source's `kugile` / `gotham` / `display` / `body` aliases are kept and
// remapped so existing class usage across the app keeps working untouched —
// no component needs editing. `cormorant` and `jost` were unused; dropped.

fontFamily: {
  // canonical
  display: ['"New Icon"', 'Georgia', 'serif'],
  body:    ['Aksen', 'system-ui', 'sans-serif'],
  accent:  ['Seruni', '"New Icon"', 'serif'],

  // legacy aliases — same faces, so inherited markup renders correctly
  kugile:  ['"New Icon"', 'Georgia', 'serif'],
  gotham:  ['Aksen', 'system-ui', 'sans-serif'],
},
