# Michael Tran's personal website

A static personal gallery for https://mhtran3.github.io/: artwork, education access work, and technical curiosity, without reducing Michael to a single professional title.

## Structure

- `index.html`: selected work, contact links, and complete project stories.
- `home.css`: base layout; `gallery.css`: current cafe materials, responsive scene, and colophon styles.
- `home.js`: progressive enhancement from ordinary story anchors to native dialogs.
- `lighting.js`: local-clock atmosphere with a native Auto/Daylight/Twilight/Lamplight selector.
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

`assets/jacaranda-bougainvillea.webp` is a sparse AI-generated gouache background (1280 x 853, 48,420 bytes), with separated branches entering from different edges and a soft distant jacaranda shape. The painting appears once behind opaque cards, with masked edges. Full-height moss-brown shade, paper grain, and irregular CSS pools of warm daylight extend through the collection. Daylight lightens the walnut surround and reveals more of the distant foliage; twilight and night reduce the window light while a small counter lamp glows. Original portfolio artwork remains unfiltered.

The local device clock selects daylight at 07:00–16:59, twilight at 05:00–06:59 and 17:00–19:59, and lamplight at 20:00–04:59. This fixed artistic schedule does not model actual sunrise or weather. A native selector offers manual previews and Auto. The script checks at minute boundaries, pauses its timer while hidden, and rechecks on visibility/pageshow. It uses no geolocation, storage, cookies, or network requests. A reload resets to Auto; without JavaScript, the page uses daylight and hides the control. Mode changes transition background colors and light opacity over 1.6 seconds, disabled for reduced motion. There is no looping animation or branch movement.

The counter remains a flat textured wood strip. Both drink bodies share their saucer centers and baseline. `assets/cafe-lamp.svg` is a small code-drawn olive-shaded table lamp; CSS supplies its warm light. The decorative counter clips its glow, and mobile sizing separates the lamp from the drinks. The generic broad-leaf planter and prominent hobbies section have been removed. Earlier dense foliage and realistic branch assets remain unused. Decorations ignore pointer input; the window and branch disappear for increased contrast, and all scene decorations disappear for forced colors and print.

The introduction identifies Michael as an artist, engineer, and educator, emphasizes connections across disciplines, and provides direct email, LinkedIn, and GitHub links. It avoids current-employment framing and qualifiers such as occasional. Cards present concrete education and technical work before interaction and use explicit underlined action labels. All details still have the native-dialog enhancement and no-JavaScript reading path. Personal interests live in an optional, initially closed footer disclosure, rather than the landing-page reading flow. The colophon explains this hierarchy and distinguishes generated decor from Michael's artwork.

## Validation and limits

The saved check report contains source-file bytes, not compressed transfer sizes or live deployment data. Current budgets are 10 KiB for both homepage JavaScript files together, 40 KiB for the combined stylesheets, 100 KiB for the foliage background, 150 KiB for the featured illustration, and 5 MiB combined / 2 MiB each for the optional video clips. These are project limits; they are not accessibility or speed scores.

Standalone decorative assets were rendered and inspected. Full-page browser layout, keyboard/screen-reader interaction, Lighthouse, and automated accessibility audits remain outstanding for this revision because local preview automation was restricted. Do not describe the saved source check as a browser audit. No custom CI reporting workflow has been added.

Private planning records, reference photos, student materials, local project source, and sensitive autobiographical content are excluded from the public site.

## Media behavior

Homepage cards use still images. All four videos have native controls, playsinline, preload=none, an accessible label, and adjacent visual descriptions. No autoplay or looping is used. Dialog close pauses and removes cloned media; a document-level play listener pauses other videos, including in the no-dialog/direct-story view. Source checks include poster references and video attributes. Native controls and responsive layout still need real-browser QA; source checks do not establish accessibility conformance.


## Separate branch accent

`assets/bougainvillea-branch-v1.webp` is a 900 × 600 transparent AI-generated gouache decoration (80,544 bytes). It appears once at the transition into animation and illustration, anchored to the actual page edge. A full-width wrapper around the homepage main content supplies the inline-size container for the edge calculation, excluding scrollbar width; the image overscans its clipped wrapper by 12px so the stem continues out of frame. A dedicated clipped wrapper keeps it behind content without clipping links or focus outlines. It is static and ignores pointer input; its image has empty alt text inside an aria-hidden wrapper. It is hidden at widths of 900px or less, in increased/forced contrast, and for print. No added JavaScript. Its source PNG and generation prompt are kept in the private planning folder, outside the public site.

The café theme keeps dark ink inside cards, dialogs, and paper-backed no-JavaScript stories. Header, introduction, navigation, section headings, and footer use cream text on the darker surround, with light focus outlines where needed. Print and forced-color overrides are explicit. These source decisions still need real-browser visual and accessibility verification.
