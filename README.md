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

The opening perspective is “Okay, we have AI. Now what?” Education and Rubrik accessibility work lead the professional collection, followed by the ongoing combat-AI prototype. The next section presents research-led Whig–Clio restoration for official university use, printed apparel for Scully/MOL/Class of 1976, and the Class of 2023 senior jacket. Bloom and the hotpot illustration follow in a quieter art section; the wave sketch stays in an optional sketchbook disclosure.

Michael confirmed that the three featured shirt designs were printed. The Scully sweatshirt photograph provides a visible artwork-to-fabric comparison. MOL and reunion images are labeled as artwork, not garment photographs. Whig–Clio research, recovery of features lost to repeated compression, and official university use are Michael’s supplied project context. The jacket is independently documented by Princeton University and Princeton Alumni Weekly. Its photograph shows garments on chairs, credited to Denise Applewhite, Office of Communications; the portrait is not displayed.

Hotpot’s ZZZ 2025 Art Fest attribution is supplied by Michael and does not imply a publisher commission. Four process frames and an 18-second timelapse excerpt accompany it. Bloom uses a six-second silent excerpt. Artwork colors remain unfiltered. See assets/media/README.md for media provenance.

The education card starts with “Everyone deserves access to quality education.” Its detail covers Trenton Arts, volunteer tutor coordination, mentoring, curriculum development, and current tutoring.

The engineering card leads with actual dungeon heatmap footage and concrete system choices. Its case study includes two player-controlled video players: terrain-aware combat scores and exploration flow directions. The simulation in the recorded clips was automatic. The case study states Michael's AI-assisted role and distinguishes third-party game art from his contribution. The RWKV reflection is linked from the AI perspective and engineering card; it remains an early experiment and does not claim a working hybrid, benchmark comparison, or environmental savings.

## Cafe scene and reading hierarchy

The Leaf Cafe and Michael's IMG_0136 reference inform the frosted depth, negative space, and backlight. The photograph stays private. Michael selected jacaranda and bougainvillea for their personal connection to Da Nang and his Vietnamese heritage. The design treats these as stylized plant references, not a botanical identification of the original photograph.

`assets/jacaranda-bougainvillea.webp` is a sparse AI-generated gouache background (1280 x 853, 48,420 bytes), with separated branches entering from different edges and a soft distant jacaranda shape. Pale gaps and warm edge light contrast with deeper brown and green page accents. The background appears once, behind opaque cards and captions. No runtime blur or additional JavaScript is needed. Original artwork is unfiltered.

The counter remains a flat textured wood strip. Both drink bodies share their saucer centers and baseline. The generic broad-leaf planter and prominent hobbies section have been removed. Earlier dense foliage and realistic branch assets remain unused. Decorations ignore pointer input and disappear for contrast preferences and print.

The introduction identifies Michael as an artist, engineer, and educator, emphasizes connections across disciplines, and provides direct email, LinkedIn, and GitHub links. It avoids current-employment framing and qualifiers such as occasional. Cards present concrete education and technical work before interaction and use explicit underlined action labels. All details still have the native-dialog enhancement and no-JavaScript reading path. Personal interests live in an optional, initially closed footer disclosure, rather than the landing-page reading flow. The colophon explains this hierarchy and distinguishes generated decor from Michael's artwork.

## Validation and limits

The saved check report contains source-file bytes, not compressed transfer sizes or live deployment data. Current budgets are 10 KiB for homepage JavaScript, 40 KiB for the combined stylesheets, 100 KiB for the foliage background, 150 KiB for the featured illustration, and 5 MiB combined / 2 MiB each for the optional video clips. These are project limits; they are not accessibility or speed scores.

Standalone decorative assets were rendered and inspected. Full-page browser layout, keyboard/screen-reader interaction, Lighthouse, and automated accessibility audits remain outstanding for this revision because local preview automation was restricted. Do not describe the saved source check as a browser audit. No custom CI reporting workflow has been added.

Private planning records, reference photos, student materials, local project source, and sensitive autobiographical content are excluded from the public site.

## Media behavior

Homepage cards use still images. All four videos have native controls, playsinline, preload=none, an accessible label, and adjacent visual descriptions. No autoplay or looping is used. Dialog close pauses and removes cloned media; a document-level play listener pauses other videos, including in the no-dialog/direct-story view. Source checks include poster references and video attributes. Native controls and responsive layout still need real-browser QA; source checks do not establish accessibility conformance.
