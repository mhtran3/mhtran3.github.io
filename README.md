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

## Cafe scene and reading hierarchy

The Leaf Cafe and Michael's IMG_0136 reference inform the frosted depth, negative space, and backlight. The photograph stays private. Michael selected jacaranda and bougainvillea for their personal connection to Da Nang and his Vietnamese heritage. The design treats these as stylized plant references, not a botanical identification of the original photograph.

`assets/jacaranda-bougainvillea.webp` is a sparse AI-generated gouache background (1280 x 853, 48,420 bytes), with separated branches entering from different edges and a soft distant jacaranda shape. Pale gaps and warm edge light contrast with deeper brown and green page accents. The background appears once, behind opaque cards and captions. No runtime blur or additional JavaScript is needed. Original artwork is unfiltered.

The counter remains a flat textured wood strip. Both drink bodies share their saucer centers and baseline. The generic broad-leaf planter and prominent hobbies section have been removed. Earlier dense foliage and realistic branch assets remain unused. Decorations ignore pointer input and disappear for contrast preferences and print.

The introduction identifies Michael as an artist, engineer, and educator, emphasizes connections across disciplines, and provides direct email, LinkedIn, and GitHub links. It avoids current-employment framing and qualifiers such as occasional. Cards present concrete education and technical work before interaction and use explicit underlined action labels. All details still have the native-dialog enhancement and no-JavaScript reading path. Personal interests live in an optional, initially closed footer disclosure, rather than the landing-page reading flow. The colophon explains this hierarchy and distinguishes generated decor from Michael's artwork.

## Validation and limits

The saved check report contains source-file bytes, not compressed transfer sizes or live deployment data. Current budgets are 10 KiB for homepage JavaScript, 40 KiB for the combined stylesheets, and 100 KiB for the foliage background. These are project limits; they are not accessibility or speed scores.

Standalone decorative assets were rendered and inspected. Full-page browser layout, keyboard/screen-reader interaction, Lighthouse, and automated accessibility audits remain outstanding for this revision because local preview automation was restricted. Do not describe the saved source check as a browser audit. No custom CI reporting workflow has been added.

Private planning records, reference photos, student materials, local project source, and sensitive autobiographical content are excluded from the public site.
