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

The Leaf Cafe in Da Nang inspires warm plaster, dark wood, greenery, and tile details. Michael's cafe photos were reviewed privately and are not published. The scene contains a reserved upper-right branch corner, paper texture behind readable text, wood-framed art, and a low-viewpoint table with a restrained original floral engraving. Matcha sits on a wooden saucer; Vietnamese egg coffee sits on a cream saucer. A distinct broad-leaf planter rests on the lower divider.

`assets/jacaranda-cascade.webp` is an AI-generated decorative illustration adapted from Michael's selected cascading-branch reference using the built-in image tool. It is 480 x 600 with transparency, optimized to 86,916 bytes. The filename reflects the requested reference, not a botanical identification. Other decorative assets are code-based SVGs. The colophon explicitly distinguishes these decorations from Michael's artwork.

The old tabletop frond planter and canopy shadow are no longer displayed. The two visible plants have distinct silhouettes and appear once each. Decoration ignores pointer input, is hidden from assistive technology, and simplifies for narrow screens, contrast preferences, and print. Reduced-motion preferences suppress transitions and smooth scrolling.

## Validation and limits

The saved check report contains source-file bytes, not compressed transfer sizes or live deployment data. Current budgets are 10 KiB for homepage JavaScript, 40 KiB for the combined stylesheets, and 100 KiB for the branch image. These are project limits; they are not accessibility or speed scores.

Standalone decorative assets were rendered and inspected. Full-page browser layout, keyboard/screen-reader interaction, Lighthouse, and automated accessibility audits remain outstanding for this revision because local preview automation was restricted. Do not describe the saved source check as a browser audit. No custom CI reporting workflow has been added.

Private planning records, reference photos, student materials, local project source, and sensitive autobiographical content are excluded from the public site.
