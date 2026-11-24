# PocketDM V2 foundation

Standalone static character simulation laboratory. Open public/v2/index.html through a local HTTP server. Run node --test tests.mjs. The original IADM_tactic repository remains unchanged. The public prototype contains synthetic character presets and original prologue scenarios adapted from the existing storm-choice concept. No sourcebook or community database is redistributed.

The simulation formulas are provisional PocketDM extensions, not official Mythras calculations. The character profile preserves seven Mythras-style attributes and separates knowledge, sensory abilities, inventory, condition, behavior evidence and doctrine. Next: verified d100 resolver, hit locations, actual equipment rules, creature import permissions, combat event logs and narrative book integration.

Deploy safely using firebase hosting:channel:deploy v2 --project lore-weaver-rt9pc --config firebase.json from this directory. Preview only; do not deploy to live until existing hosting assets can be preserved.

## Crónica interactiva (ES)

Open public/v2/cronica/index.html using an HTTP server. Native custom elements: book-page, book-title, book-portrait, book-inset, combat-phase. The reader displays one or two pages, animated transitions, zoom (100–250%), and scrolling/panning. Inline sigils open the associated explanation. events.mjs contains explicitly illustrative event fixtures, not actual combat results. Art is drawn from the provided PocketDM project assets; external book layout references are not redistributed.

### Revisión editorial

Desktop: wider two-page spread automatically fitted to the viewport. Mobile: single page, vertical transitions and next/previous controls at the foot. Organic SVG masks soften artwork edges; chapter headings overlap atmospheric art. The shared native dialog displays mechanics without changing page geometry. Run `node test-cronica-browser.mjs` on Windows with Edge to test both viewport modes and overlay behavior.
