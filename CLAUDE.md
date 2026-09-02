# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Wentao Zhang's personal academic/job-hunting website. Static HTML/CSS/vanilla JS — no build step, no npm, no framework, no tests. Edit a file, commit, push; GitHub Pages serves it.

## Commands

```bash
python3 -m http.server 8000        # preview at http://localhost:8000
git add . && git commit -m "…" && git push   # deploy (Pages builds from main / root)
cp resume_wentao.pdf assets/Wentao_Zhang_CV.pdf   # after updating the CV
```

Opening `index.html` via `file://` also works: `data/conferences.js` is loaded with a plain `<script>` tag rather than `fetch` specifically to keep that working. Don't convert it to `fetch`/JSON.

## Layout

- `index.html` — profile, About, Skills, metric strip, Publications, Contact. Single page with `#about` / `#skills` / `#publications` anchors that the nav on other pages links back to.
- `projects.html` — long-form project write-ups (`#dft`, `#mlff`, …).
- `conferences.html` — the 3D globe page; the only page that pulls CDN scripts.
- `css/style.css` — all styling for all three pages.
- `js/globe.js` — globe rendering; rarely needs edits.
- `data/conferences.js` — conference records. **This is the file that changes when conference content changes.**

The nav block is duplicated verbatim in all three HTML files (each marks its own link `is-active`); the footer likewise. Adding a page means editing all three.

## Conference globe

`data/conferences.js` defines `window.HOME_BASE` (Duke — arcs originate here) and `window.CONFERENCES`. `js/globe.js` sorts by `year` descending and derives everything else: the summary count line, the list below the globe, pins, labels, rings, and arcs.

- West longitude and south latitude are **negative**.
- `role` matching `/invited/i` gets a taller, fatter pin — that's the only role with rendering behavior.
- Any entry with `placeholder: true` un-hides a warning banner on the page. Never push with the banner showing; unverified conference claims on a job-hunting site are worse than none.
- The opening camera is `globe.pointOfView({lat: 46, lng: -45, altitude: 2.4})`, framed for US + Europe pins. Adding conferences well outside that arc means re-framing it.
- `globe.gl`, `topojson-client`, and the country-outline TopoJSON all come from unpkg, unpinned (`globe.gl@2`). Every CDN dependency degrades gracefully — if `Globe` is undefined the loading panel says so and the list still renders; if the TopoJSON fetch fails you get a plain cream sphere. Preserve those fallbacks when editing `js/globe.js`.

## Styling

The whole palette is CSS custom properties at the top of `css/style.css` (Claude light scheme: bone `#F0EEE6`, clay `#D97757`, ink `#191917`). Links and small accent text use the darker `--accent-text` (`#A8482A`) because it passes AA on bone — don't swap them for `--accent`.

`js/globe.js` duplicates those colors as constants (`CLAY`, `CLAY_TEXT`, `GLOBE_FILL`, `LAND_FILL`, …) and they are kept in sync **by hand**. Changing `--accent` means changing `CLAY` too.

## Repo/deploy gotchas

- The repo is `code1peter/wentaozhang.github.io` — the owner is `code1peter`, so this is a **project** page served at `https://code1peter.github.io/wentaozhang.github.io/`, not a user page at the domain root. Absolute root-relative paths (`/css/style.css`) break; keep every link relative. `robots.txt` and any future `llms.txt` are only honored at the origin root (`code1peter.github.io/robots.txt`), which this repo does not control, so those files are inert at this subpath.
- SEO markup added in `d8d410d` is live and intentional: `sitemap.xml`, `robots.txt`, per-page `<link rel="canonical">`, and a JSON-LD `Person` block in `index.html` whose `sameAs` links the site to the Google Scholar and GitHub identities. The absolute URLs in all of these hard-code the `/wentaozhang.github.io/` subpath — renaming the repo or adding a custom domain means updating every one of them.
- `.gitignore` currently excludes `assets/Wentao_Zhang_CV.pdf` and `resume_wentao.pdf` because the PDF still contains a phone number. The site's CV links are therefore live 404s until a phone-free export is committed and those two lines are removed. The phone number is deliberately kept off the HTML pages.
- LinkedIn markup exists in `index.html` but is HTML-commented out pending a real profile URL.
