# Michael Tran's personal website

A static personal gallery for https://mhtran3.github.io/: artwork, education access work, and technical curiosity, without reducing Michael to a single professional title.

## Structure

- `index.html`: selected work, contact links, and complete project stories.
- `home.css`: base layout; `gallery.css`: current cafe materials, responsive scene, and colophon styles.
- `home.js`: progressive enhancement from ordinary story anchors to native dialogs.
- `colophon.html`: design decisions, implementation tradeoffs, authorship, and testing limitations.
- `scripts/check-site.py`: standard-library Python check for local references, fragment targets, duplicate IDs, and explicit byte budgets. Run `python scripts/check-site.py` to regenerate `site-check.json`.

No build step, third-party JavaScript, analytics, remote fonts, or runtime dependencies are required. Without JavaScript, stories remain in the page. The colophon uses no JavaScript. To preview locally, serve this directory with a static HTTP server.

## Content and provenance

The Scully co-op shirt artwork and wave-board study are optimized copies of Michael's existing public artwork. The skateboard card is labeled as a detail; its full study identifies the Hokusai reference. Original artwork remains unfiltered. The Rita Moreno preview is retained but not displayed.

The education card starts with “Everyone deserves access to quality education.” Its detail covers Trenton Arts, volunteer tutor coordination, mentoring, curriculum development, and current tutoring.

The AI card connects Michael's concerns and views on intentionality to an early RWKV experiment. It distinguishes inspecting memory/state from developing a new architecture, and does not claim a working hybrid, a benchmark comparison, or environmental savings. The separate combat-AI case study remains linked directly below the card, with concrete system choices and Michael's AI-assisted role described.

## Cafe scene

The Leaf Cafe in Da Nang inspires warm plaster, dark wood, greenery, and tile details. Michael's IMG_0136 reference informs the negative space between paired leaflets and daylight passing through them. The photograph stays private.

`assets/frosted-foliage.webp` is an AI-generated gouache-style background (1280 x 853, 73,418 bytes). It suggests an eye-level view through frosted glass, with flat leaf shapes, luminous gaps, and softly painted distant foliage. A CSS light layer blends it into the page. The background appears once behind opaque gallery cards, leaving an exposed band above them. No runtime blur or extra JavaScript is needed. Original artwork is unfiltered.

The table divider is now a flat textured wood strip, without a beveled top, engraving, gradient shading, or cast shadow. Both drink bodies share the center of their saucer, and the saucers share a baseline. The separate broad-leaf planter remains on the lower divider. The earlier realistic branch, tabletop fern, and canopy shadow assets are retained but unused.

Decorations ignore pointer input, are hidden from assistive technology, and are removed for contrast preferences and print. Reduced-motion preferences suppress transitions and smooth scrolling. The colophon distinguishes generated decoration from Michael's own artwork.

## Validation and limits

The saved check report contains source-file bytes, not compressed transfer sizes or live deployment data. Current budgets are 10 KiB for homepage JavaScript, 40 KiB for the combined stylesheets, and 100 KiB for the foliage background. These are project limits; they are not accessibility or speed scores.

Standalone decorative assets were rendered and inspected. Full-page browser layout, keyboard/screen-reader interaction, Lighthouse, and automated accessibility audits remain outstanding for this revision because local preview automation was restricted. Do not describe the saved source check as a browser audit. No custom CI reporting workflow has been added.

Private planning records, reference photos, student materials, local project source, and sensitive autobiographical content are excluded from the public site.
