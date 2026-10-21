# Michael Tran's personal website

A static personal gallery for https://mhtran3.github.io/: artwork, education access work, and technical curiosity, without reducing Michael to a single professional title.

## Structure

- `index.html`: the café scene, the selected work (one folded sheet), contact, and the complete project stories.
- `home.css`: base layout, header, footer, stories and dialog; `gallery.css`: fonts, palette, story media, and colophon styles.
- `cafe.css`: the café itself: ceiling and downlights, plaster wall and trombone lamp, the table and the sun on it, the branches over it, the paper, and the counter.
- `home.js`: progressive enhancement from ordinary story anchors to native dialogs, and the seal comparison.
- `lighting.js`: continuous local-clock lighting. Blends hand-picked moments of the day (night, blue hour, sunrise, morning, noon, afternoon, golden hour, sunset) in OKLab, moves the sun, decides when lamps come on, and writes CSS custom properties. Includes the time-of-day slider and the Eye candy switch (remembered in localStorage).
- `cafe.js`: things to touch (the trombone lamp's pull cord, the table lamp, the espresso machine, sippable drinks, the counter gate), slow details (coffee cools, matcha glass sweats), and a ready-made slot for Michael's dog drawings.
- `colophon.html`: design decisions, implementation tradeoffs, authorship, and testing limitations.
- `scripts/check-site.py`: standard-library Python check for local references, fragment targets, duplicate IDs, and explicit byte budgets. Run `python scripts/check-site.py` to regenerate `site-check.json`.

No build step, third-party JavaScript, analytics, remote fonts, or runtime dependencies are required. Without JavaScript, stories remain in the page. The colophon uses no JavaScript. To preview locally, serve this directory with a static HTTP server.

## Content and provenance

The sheet opens with the perspective “Okay, we have AI. Now what?”, introduced with a passage from Michael's own reflection on connecting disciplines. Education and engineering follow (teaching and access work, the combat-AI prototype, Rubrik accessibility work), then graphics made for communities (Whig–Clio seal restoration, Scully/MOL/Class of 1976 apparel, the Class of 2023 jacket), then animation and illustration (the hotpot illustration and Bloom), with the wave sketch as a short sketchbook link. Every line on the sheet is drawn from Michael's own story text; nothing is invented.

Michael confirmed that the three featured shirt designs were printed. The Scully sweatshirt photograph provides a visible artwork-to-fabric comparison. MOL and reunion images are labeled as artwork, not garment photographs. Whig–Clio research, recovery of features lost to repeated compression, and official university use are Michael's supplied project context; the sheet shows the two seals (the seated figure and the bird) printed on the paper as a before-and-after comparison: one line, dragged across either seal or moved with the arrow keys, splits both between the supplied image and the restoration. The supplied image is cut, scaled and centred so each seal's outer ring lines up with its restoration (`gen-seal-compare.py`, in the private planning folder); the drawings inside differ because the restoration was rebuilt, not traced. The jacket is independently documented by Princeton University and Princeton Alumni Weekly. Its photograph shows garments on chairs, credited to Denise Applewhite, Office of Communications; the portrait is not displayed.

Hotpot's ZZZ 2025 Art Fest attribution is supplied by Michael and does not imply a publisher commission; its caption credits the characters to Zenless Zone Zero. Four process frames and an 18-second timelapse excerpt accompany it. Bloom uses a six-second silent excerpt. The combat-AI caption notes that sprites and environment art are third-party. Artwork colors remain unfiltered. See assets/media/README.md for media provenance.

The education entry connects Michael's rural Texas schooling and experience at Princeton to his tutoring practice and lists his roles (Trenton Arts, Princeton Online Tutoring Network, Scholars Institute Fellows Program, the Computer Science curriculum). No student outcomes or measured impact are inferred.

The engineering entry leads with actual dungeon heatmap footage and concrete system choices. The heatmap preview and its case-study copy play silently and loop while visible. The exploration-flow clip remains play-on-request; both have native controls. The simulation in the recorded clips was automatic. The case study states Michael's AI-assisted role and distinguishes third-party game art from his contribution. The RWKV reflection is linked from the engineering entry; it remains an early experiment and does not claim a working hybrid, benchmark comparison, or environmental savings.

## The café scene (October 2026)

The page is arranged after Michael's photographs of The Leaf in Đà Nẵng. Those photographs stay private and are not used on the site. From top to bottom:

- a dark ceiling with four downlights over the header;
- an ochre plaster wall behind the introduction, with the trombone wall lamp and its pull cord;
- a dark walnut table under trees, fixed to the screen. The selected work lies on it as one long folded sheet, like a zine: an editorial column with a narrow margin for labels and roles, pictures printed on the page, and creases between the parts. Scrolling slides the sheet along the table;
- a serving counter at the far end of the table: a table lamp, an espresso machine (press to pull a shot), a slot for the dog, three sippable drinks (iced matcha latte, egg coffee in a bowl of hot water, chè with pandan jelly), and a lift-up flap over a swinging gate. Contact details are written on the counter front.

### Light

Light works the way it does under trees. The table and the paper are drawn in warm brown shade; sun comes through gaps in the canopy as bright patches. Every gap between leaves throws a small oval image of the sun's disc, so the light images are built from thousands of gaps convolved with that oval: a lone gap prints a dim oval, crowded gaps print overlapping ovals that merge into a bright patch with a scalloped edge, and three openings carry the crisp silhouettes of leaves close to the table. A few stray ovals fall elsewhere (`assets/fleck-soft.webp`). Each patch is an alpha mask (`assets/fleck-*.webp`) filled with the colour of the sun at that minute, so one set of images serves wood and paper, pale gold at noon and orange at golden hour. Each patch sways on its own slow rhythm, in time with one of the branches over the table. The wood grain (`assets/table-grain.webp`, generated in code) lies on top of the light so it shows in sun and shade alike. `gen-light.py`, kept in the private planning folder, regenerates these images.

The light is fixed to the screen. On the paper it is drawn by a `position: fixed` pane inside a `clip-path` wrapper, so the browser pins it while the sheet scrolls, with no scroll script. It sits a few pixels toward the light from the light on the wood, and the sheet casts its shadow away from it. Photographs and illustrations sit above the light; both versions of the seals have transparent backgrounds, so the paper (and its light) shows through them as if they were printed.

After dark, lamplight pools on the table and the paper: always a little from the downlights, more with each lamp switched on. Measured in headless Chromium against the darkest pixels behind each line (light, fibre and creases included), at 1440 and 390 pixels wide and at eleven times from before dawn to night (with the lamps on and off), every text line on the sheet stays at or above 4.8:1. Text on the plaster picks its ink by measured contrast and keeps at least 6.2:1 on bare plaster.

The branches over the table (`assets/canopy-jacaranda.webp`, `assets/canopy-bougainvillea.webp`, colour-graded from the earlier jacaranda and bougainvillea paintings) come from AI-generated gouache paintings, as do the leaf shapes in the light. They are decoration, distinct from Michael's work. They pass behind the wall and the counter, stay in the table margins, and are hidden below 1200px wide, where they would hang over the words.

### Interactions and accessibility

Every interactive object is a real button with a label (Wall lamp, Table lamp, Pull a shot of espresso, Sip the iced matcha latte, Sip the egg coffee, Take a spoonful of chè, Swing the counter gate); lamp buttons expose `aria-pressed`, and a polite live region describes what happened. Each entry on the sheet has one keyboard stop, its title, which opens the story; the matching picture and "✳" line open it too for pointer users but are not extra tab stops. Without JavaScript the page stays at midday with lamps off, and the slider, cord and drink buttons are hidden. Reduced-motion preferences stop the breeze, the light, steam, cord swing and sip bounce. Increased contrast removes the light and the branches; forced colours and print remove the scene entirely.

### The dog (waiting for Michael's drawing)

`.counter-dog` sits behind the counter's left side. Add transparent PNG/WebP images inside it:

    <img data-pose="awake" src="assets/dog-awake.webp" alt="">
    <img data-pose="blink" src="assets/dog-blink.webp" alt="">   (optional)
    <img data-pose="nap" src="assets/dog-nap.webp" alt="">       (optional)

All poses share one canvas size and position, with the counter edge hiding the lower body. cafe.js then blinks him every few seconds and lets him nap after five quiet minutes, waking him on any interaction.

## Typography

Bricolage Grotesque (medium, automatic optical sizing) sets the name, the headings on the sheet, story headings, the contact heading, and colophon headings. Fraunces sets the reflective voice: the opening statement and the education quote on the sheet, and inside the stories the AI reflection's title and the education story's opening statement. Paragraphs, labels, and navigation use a quiet Helvetica-based system stack, with Arial as a fallback.

Both families are self-hosted WOFF2 subsets with their SIL OFL licenses (`assets/fonts/`, `assets/fonts/fraunces/`). Bricolage totals 66,368 bytes and Fraunces 76,812 bytes across Latin, extended Latin, and Vietnamese subsets; unicode ranges load subsets only when needed, and `font-display: swap` keeps fallback text readable. No runtime Google Fonts connection.

## Validation and limits

The saved check report contains source-file bytes, not compressed transfer sizes or live deployment data. Current budgets: 32 KiB for the three homepage scripts together (raised from 28 KiB for the video previews and the seal comparison), 69 KiB for the combined stylesheets, 72 KiB for the heading font subsets, 80 KiB for the reflection font subsets, 224 KiB for the table and its light, 200 KiB for the two branches, 80 KiB for the seal comparison, 24 KiB for the café fixtures, 150 KiB for the featured illustration, and 5 MiB combined / 2 MiB each for the optional video clips. Images exported from Claude's workspace carry a C2PA content-credentials record of about 6 KB each, which these budgets include. These are project limits, not accessibility or speed scores.

Layout was checked in headless Chromium at 1440, 1024, and 390 pixels wide, at several times of day, with keyboard navigation, dialogs, reduced motion, increased contrast, forced colours, and JavaScript off. Lighthouse, screen readers, and automated accessibility audits have not been run. Do not describe the saved source check as a browser audit.

Private planning records, reference photos, student materials, local project source, and sensitive autobiographical content are excluded from the public site.

## Media behavior

The sheet includes an inline heatmap video in place of its former still image. That preview and its copy inside the game story use muted, loop, playsinline, preload=none and data-autoplay="visible". IntersectionObserver starts them when at least 35% visible, pauses them offscreen, and honors a viewer pause. Opening a dialog pauses the background preview; closing unregisters and removes cloned media. Hidden documents pause video. Reduced motion disables automatic playback; native controls still allow manual play. Without JavaScript or IntersectionObserver, the poster and native controls remain. Autoplay policy rejections are caught without retries; loading interrupted by visibility can resume. Other clips stay manual, and a running manual clip takes priority over automatic heatmaps. A single-play listener prevents overlapping videos. All five video elements (four unique media files) retain accessible labels, posters, and controls.


## Trombone lamp placement and contact shadow — October 19, 2026

The lamp has a reserved right margin on the plaster introduction. Desktop geometry is 84×210 px, inset 44 px from the wrap's right edge and 24 px below the ceiling. The introduction reserves 144 px on the right and a 266 px minimum height so the fixture clears the lower timber trim at tablet sizes. At ≤640 px the lamp is 64×160 px, 28 px below the ceiling, with 72 px reserved beside the text. SVG proportions and percentage-based pulley/cord alignment stay intact.

The former enlarged silhouette translated by amplified paper-shadow values is replaced by a tight contact drop-shadow plus an unscaled cast shadow clamped to ±2.5 px horizontally and 1–3 px vertically. Its daylight component disappears after dark, leaving a restrained ambient shadow. The warm light pool and interactive cord are retained. No asset or JavaScript changes.
