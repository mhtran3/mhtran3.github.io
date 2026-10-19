# Michael Tran's personal website

A static personal gallery for https://mhtran3.github.io/: artwork, education access work, and technical curiosity, without reducing Michael to a single professional title.

## Structure

- `index.html`: selected work, contact links, and complete project stories.
- `home.css`: base layout; `gallery.css`: collection layout, cards, and colophon styles.
- `home.js`: progressive enhancement from ordinary story anchors to native dialogs.
- `lighting.js`: continuous local-clock lighting. Blends hand-picked moments of the day (night, blue hour, sunrise, morning, noon, afternoon, golden hour, sunset) in OKLab, moves the sun, decides when lamps come on, and writes CSS custom properties. Includes the time-of-day slider and the Eye candy switch (remembered in localStorage).
- `cafe.js`: things to touch — the trombone lamp's pull cord, the table lamp, sippable drinks, slow details (coffee cools, matcha glass sweats), and a ready-made slot for Michael's dog drawings.
- `cafe.css`: the café itself — ceiling and downlights, plaster wall and trombone lamp, the fixed frosted window with swaying branches and dapples, reading-surface lighting, and the counter.
- `colophon.html`: design decisions, implementation tradeoffs, authorship, and testing limitations.
- `scripts/check-site.py`: standard-library Python check for local references, fragment targets, duplicate IDs, and explicit byte budgets. Run `python scripts/check-site.py` to regenerate `site-check.json`.

No build step, third-party JavaScript, analytics, remote fonts, or runtime dependencies are required. Without JavaScript, stories remain in the page. The colophon uses no JavaScript. To preview locally, serve this directory with a static HTTP server.

## Content and provenance

The opening perspective is “Okay, we have AI. Now what?” Education and Rubrik accessibility work lead the professional collection, followed by the ongoing combat-AI prototype. The next section presents research-led Whig–Clio restoration for official university use, printed apparel for Scully/MOL/Class of 1976, and the Class of 2023 senior jacket. Bloom and the hotpot illustration follow in a quieter art section; the wave sketch stays in an optional sketchbook disclosure.

Michael confirmed that the three featured shirt designs were printed. The Scully sweatshirt photograph provides a visible artwork-to-fabric comparison. MOL and reunion images are labeled as artwork, not garment photographs. Whig–Clio research, recovery of features lost to repeated compression, and official university use are Michael’s supplied project context. The jacket is independently documented by Princeton University and Princeton Alumni Weekly. Its photograph shows garments on chairs, credited to Denise Applewhite, Office of Communications; the portrait is not displayed.

Hotpot’s ZZZ 2025 Art Fest attribution is supplied by Michael and does not imply a publisher commission. Four process frames and an 18-second timelapse excerpt accompany it. Bloom uses a six-second silent excerpt. Artwork colors remain unfiltered. See assets/media/README.md for media provenance.

The education card starts with “Everyone deserves access to quality education” and briefly describes helping students approach unfamiliar problems. Its detail connects Michael's rural Texas schooling and experience at Princeton to his tutoring practice: examining given information, goals, context, and prior learning. It also covers Trenton Arts, volunteer tutor coordination, mentoring, and curriculum development. His account and teaching aims come from the content interview; no student outcomes or measured impact are inferred.

The engineering card leads with actual dungeon heatmap footage and concrete system choices. Its case study includes two player-controlled video players: terrain-aware combat scores and exploration flow directions. The simulation in the recorded clips was automatic. The case study states Michael's AI-assisted role and distinguishes third-party game art from his contribution. The RWKV reflection is linked from the AI perspective and engineering card; it remains an early experiment and does not claim a working hybrid, benchmark comparison, or environmental savings.

## Cafe scene and reading hierarchy

The Leaf Cafe and Michael's IMG_0136 reference inform the frosted depth, negative space, and backlight. The photograph stays private. Michael selected jacaranda and bougainvillea for their personal connection to Da Nang and his Vietnamese heritage. The design treats these as stylized plant references, not a botanical identification of the original photograph.

`assets/jacaranda-bougainvillea.webp` is a sparse AI-generated gouache background (1280 x 853, 48,420 bytes), with separated branches entering from different edges and a soft distant jacaranda shape. The painting appears once behind opaque cards, with masked edges. Full-height moss-brown shade, paper grain, and irregular CSS pools of warm daylight extend through the collection. Daylight lightens the walnut surround and reveals more of the distant foliage; twilight and night reduce the window light while a small counter lamp glows. Original portfolio artwork remains unfiltered.

Lighting follows the local device clock continuously (see the Café scene section below); it uses no geolocation, cookies or network requests. The Eye candy switch, which stills all ambient motion, is the one preference stored, in localStorage. Without JavaScript the page stays at midday.

The counter remains a flat textured wood strip. Both drink bodies share their saucer centers and baseline. `assets/cafe-lamp.svg` is a small code-drawn olive-shaded table lamp; CSS supplies its warm light. The decorative counter clips its glow, and mobile sizing separates the lamp from the drinks. The generic broad-leaf planter and prominent hobbies section have been removed. Earlier dense foliage and realistic branch assets remain unused. Decorations ignore pointer input; the window and branch disappear for increased contrast, and all scene decorations disappear for forced colors and print.

The introduction identifies Michael as an artist, engineer, and educator, emphasizes connections across disciplines, and provides direct email, LinkedIn, and GitHub links. It avoids current-employment framing and qualifiers such as occasional. Cards present concrete education and technical work before interaction and use explicit underlined action labels. All details still have the native-dialog enhancement and no-JavaScript reading path. Personal interests live in an optional, initially closed footer disclosure, rather than the landing-page reading flow. The colophon explains this hierarchy and distinguishes generated decor from Michael's artwork.

## Validation and limits

The saved check report contains source-file bytes, not compressed transfer sizes or live deployment data. Current budgets are 28 KiB for the three homepage scripts together (heavily commented; about 9 KiB gzip-compressed), 69 KiB for the combined stylesheets (raised as the café scene grew and to include the font declarations; about 17 KiB gzip-compressed), 72 KiB for all heading font subsets, 300 KiB for the café window and skylight layers, 100 KiB for the separate branch accent, 12 KiB for the café fixtures, 150 KiB for the featured illustration, and 5 MiB combined / 2 MiB each for the optional video clips. These are project limits; they are not accessibility or speed scores.

Standalone decorative assets were rendered and inspected. Full-page browser layout, keyboard/screen-reader interaction, Lighthouse, and automated accessibility audits remain outstanding for this revision because local preview automation was restricted. Do not describe the saved source check as a browser audit. No custom CI reporting workflow has been added.

Private planning records, reference photos, student materials, local project source, and sensitive autobiographical content are excluded from the public site.

## Media behavior

Homepage cards use still images. All four videos have native controls, playsinline, preload=none, an accessible label, and adjacent visual descriptions. No autoplay or looping is used. Dialog close pauses and removes cloned media; a document-level play listener pauses other videos, including in the no-dialog/direct-story view. Source checks include poster references and video attributes. Native controls and responsive layout still need real-browser QA; source checks do not establish accessibility conformance.


## Separate branch accent

`assets/bougainvillea-branch-v1.webp` is a 900 × 600 transparent AI-generated gouache decoration (80,544 bytes). It appears once at the transition into animation and illustration, anchored to the actual page edge. A full-width wrapper around the homepage main content supplies the inline-size container for the edge calculation, excluding scrollbar width; the image overscans its clipped wrapper by 12px so the stem continues out of frame. A dedicated clipped wrapper keeps it behind content without clipping links or focus outlines. It is static and ignores pointer input; its image has empty alt text inside an aria-hidden wrapper. It is hidden at widths of 900px or less, in increased/forced contrast, and for print. No added JavaScript. Its source PNG and generation prompt are kept in the private planning folder, outside the public site.

The café theme keeps dark ink inside cards, dialogs, and paper-backed no-JavaScript stories. Header, introduction, navigation, section headings, and footer use cream text on the darker surround, with light focus outlines where needed. Print and forced-color overrides are explicit. These source decisions still need real-browser visual and accessibility verification.


## Café scene (October 2026 revision)

The page is arranged after Michael's photographs of The Leaf, especially IMG_0136 (a lit trombone wall lamp on plaster beneath a skylight of leaves) and IMG_0131 (the same lamp, with its pulley cord). From top to bottom: a dark ceiling with four downlights over the header; an ochre plaster wall behind the introduction, with the trombone lamp; a fixed frosted window behind the collection; and a slatted wooden serving counter. On the counter, left to right: a table lamp, an espresso machine (press to pull a shot), a slot for the dog, and three sippable drinks (iced matcha latte, egg coffee in a bowl of hot water, chè with pandan jelly). The counter ends in a lift-up flap over a swinging gate; contact details are written on the counter front.

Lighting is continuous rather than three modes. Text on the plaster picks its ink by measured contrast, and the plaster is nudged lighter or darker around sunrise and sunset so small text stays at or above 4.6:1 (checked every ten minutes across a full day in Chromium). Card shadows follow the sun's position; paper surfaces warm by a few percent under low sun and lamplight; the window reflects lamps only once it is darker outside than in. Artwork is never tinted.

Every interactive object is a real button with a label (Wall lamp, Table lamp, Pull a shot of espresso, Sip the iced matcha latte, Sip the egg coffee, Take a spoonful of chè, Swing the counter gate); lamp buttons expose `aria-pressed`, and a polite live region describes what happened. Without JavaScript the page stays at midday with lamps off, and the slider, cord and drink buttons are hidden. Reduced-motion preferences stop the breeze, steam, cord swing and sip bounce.

### The dog (waiting for Michael's drawing)

`.counter-dog` sits behind the counter's left side. Add transparent PNG/WebP images inside it:

    <img data-pose="awake" src="assets/dog-awake.webp" alt="">
    <img data-pose="blink" src="assets/dog-blink.webp" alt="">   (optional)
    <img data-pose="nap" src="assets/dog-nap.webp" alt="">       (optional)

All poses share one canvas size and position, with the counter edge hiding the lower body. cafe.js then blinks him every few seconds and lets him nap after five quiet minutes, waking him on any interaction.


## Typography — October 18, 2026

Bricolage Grotesque now supplies the name in the introduction, card and section headings, story headings, contact heading, and colophon headings at medium (500) weight. Optical sizing remains automatic. The header identity, serif monogram, paragraphs, navigation, and small labels keep their previous system fonts. The name uses slightly looser tracking suited to Bricolage.

The three WOFF2 subsets are self-hosted in `assets/fonts/` with their SIL OFL license and upstream source details. Total font bytes: 66,368 (40,220 Latin; 17,844 extended Latin; 8,304 Vietnamese). Unicode ranges load subsets as needed; `font-display: swap` preserves readable fallback text. No runtime Google Fonts connection. The stylesheet budget increased by 2 KiB to account for font-face declarations; a separate 72 KiB font budget was added. The design note and colophon explain Michael's choice and the distinction between heading and reading typography.


### Fraunces for selected reflections

Bricolage remains the primary heading family. Fraunces is limited to `h2.reflection-title` inside the expanded AI reflection and `p.reflection-lead` in the education story. The classes are on the elements themselves so they survive dialog cloning and work with direct hashes or no JavaScript; no script change. Both use medium weight and automatic optical sizing; the upstream Fraunces export fixes SOFT 50 and WONK 0. The title uses 28–42 px with 1.16 line height; the statement uses 23–28 px with 1.4 line height. Body text, project cards, metadata, and controls keep their previous typography.

Fraunces WOFF2 subsets and OFL license are under `assets/fonts/fraunces/`: 34,292 bytes Latin; 31,420 extended Latin; 11,100 Vietnamese; total 76,812. No preload: a normal enhanced homepage loads Fraunces when the relevant story opens, with a Georgia fallback while loading. An 80 KiB reflection-font budget and a 69 KiB total stylesheet budget include this addition. Both typography choices and roles are explained in the colophon.
