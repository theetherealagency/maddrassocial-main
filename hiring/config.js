/* ═══════════════════════════════════════════════════════════
   MADRAS SOCIAL — site configuration
   This is the ONE file the agency edits day-to-day.
   ═══════════════════════════════════════════════════════════ */
window.CONFIG = {

  // Google Apps Script Web App URL (from SETUP.md step 4).
  // While this is empty the forms run in PREVIEW mode:
  // they validate and confirm, but nothing is recorded.
  ENDPOINT: 'https://script.google.com/macros/s/AKfycbxy2Q5nKclp3SPw4LWrt8naSzSyeq0ypWarHYGULBOhasG9WlALVc6ay7ZcrB7nET49/exec',

  // Open roles — drives the positions list AND the application dropdown.
  // To close a role, delete its block. To add one, copy a block.
  // Only add a field here once it's confirmed — the page shows what's set, nothing else.
  ROLES: [
    { title: 'Bartender',            openings: 1, type: 'Full / part time', urgent: true },
    { title: 'Front of House (FOH)', openings: 2, type: 'Full / part time' },
    { title: 'Kitchen Helper',       openings: 2, type: 'Full / part time' }
  ],

  // Menu direction — drives the orbital menu on the home page.
  MENU: [
    { name: 'Madras Tapas',   desc: 'Small plates for the table — ghee roast paneer, rum kozhi roast, Kochi shrimp lettuce wraps, Madurai mutton sukka.' },
    { name: 'Dosa District',  desc: 'Dosas made fresh off the pan — masala, Mysore, pepper chicken — plus Bangalore-style benne dosas finished in ghee.' },
    { name: 'Pottalam Club',  desc: 'Biryani, unwrapped at the table. Wedding mutton biryani, Ambur chicken on seeraga samba rice, Madurai veg brinji.' },
    { name: 'Main Affairs',   desc: 'The big plates — pepper-braised lamb shank, whole fish pollichathu, and a baked kari dosa lasagne.' },
    { name: 'The Curry Club', desc: 'Chicken Chettinad, Utthukuli butter chicken, Guntur kara mutton — all served with steamed sadam.' },
    { name: 'Sweet Social',   desc: 'Filter kapi tiramisu, pistachio semiya kunafa, Tirunelveli halwa. Save room.' }
  ],

  // Shown in confirmation + used as reference prefix
  REF_PREFIX: 'MS-2026',

  // Max resume size in MB
  RESUME_MAX_MB: 5
};
