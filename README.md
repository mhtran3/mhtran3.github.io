# mhtran3.github.io

My personal site: a small collection of my art, teaching and engineering work, set in a café inspired by The Leaf in Đà Nẵng. The light follows your time of day, and a few things in the café respond when you touch them.

Live at https://mhtran3.github.io.

## What's here

- `index.html`: the homepage: the café, my selected work, and the full project stories
- `colophon.html`: how the site is built and who made what
- `home.css`, `gallery.css`, `cafe.css`: base layout; fonts and stories; the café itself
- `home.js`: opens project stories as dialogs, plays the heatmap clip when it's in view, and runs the seal before-and-after
- `lighting.js`: the time-of-day light, the time slider and the Eye candy switch
- `cafe.js`: the things you can touch: the lamps, the espresso machine, the drinks and the counter gate
- `scripts/check-site.py`: checks local links, IDs and file sizes before I publish

It's plain HTML, CSS and JavaScript with no build step. To preview it, serve the folder (for example `python -m http.server`) and open http://localhost:8000.

## Credits

- Fonts: [Bricolage Grotesque](https://ateliertriay.github.io/bricolage/) by Mathieu Triay, and [Fraunces](https://fraunces.undercase.xyz/) by Phaedra Charles and Flavia Zimbardi, both under the SIL Open Font License (see `assets/fonts/`).
- Class of 2023 jacket photo: Denise Applewhite, Princeton University Office of Communications.
- The game footage uses third-party sprites and environment art. The hotpot illustration depicts characters from Zenless Zone Zero.
- The branches over the table and the leaf shapes in the sunlight come from AI-generated paintings, and the wood grain and light patterns are generated in code. They're decoration, not my artwork. I built the site with AI assistance for code and writing.

## For later

My dog will stand behind the counter once I've drawn him: add transparent images inside `.counter-dog` with `data-pose="awake"` (and optionally `"blink"` and `"nap"`), all the same size, and `cafe.js` takes care of the rest.
