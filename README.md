# Wentao Zhang — personal website

Static site. No build step, no npm, no framework. Edit a file, push, it's live.

```
index.html              landing page — About / Publications / Skills / Education
projects.html           detailed project write-ups
conferences.html        the 3D globe
css/style.css           all styling
js/globe.js             globe logic — you shouldn't need to touch this
data/conferences.js     ← conference data, edit this
assets/                 CV PDF
```

**The About section on `index.html` is a draft.** It's marked with a yellow box in
the page and an HTML comment in the source. Rewrite it in your own voice, then
delete the `<div class="draft-flag">…</div>` block.

---

## Step 1 — Preview it locally

```bash
cd ~/Desktop/Personal_website
python3 -m http.server 8000
```

Open <http://localhost:8000>. Stop with `Ctrl-C`.

You can also just double-click `index.html` — the data file is loaded as a plain
`<script>` (not `fetch`) specifically so that `file://` previews work.

---

## Step 2 — Fix the placeholders

Search the project for `YOUR-USERNAME` and `YOUR-ID`:

```bash
grep -rn "YOUR-USERNAME\|YOUR-ID" .
```

Replace with your real GitHub, LinkedIn, and Google Scholar URLs — or delete
those `<a class="btn">` lines entirely if you don't want them.

**Your phone number is deliberately not on the site.** Publishing it invites
scraper spam, and recruiters will happily use email. It's still in the CV PDF,
which is the right place for it.

---

## Step 3 — Finish the conference entries

`data/conferences.js` holds your two conferences — **APS (Denver, CO)** and
**ESW26 (Madison, WI)**. Cities and coordinates are correct.

Three things still need your input, marked with comments in the file:

- **`role`** is empty on both, because I don't know whether you gave a talk,
  presented a poster, or attended. Fill in `"Poster"` / `"Talk"` /
  `"Invited talk"` / `"Attendee"`, and add `title` if you presented.
- **The APS year** — I assumed March 2026. Note that APS renamed the March
  Meeting to the *Global Physics Summit* starting in 2025, so check which name
  matches the year you went.
- **The ESW26 month** — I left it as just `"2026"`.

For each conference, one block:

```js
{
  name: "APS March Meeting",
  city: "Minneapolis",
  state: "MN",
  lat: 44.9778,
  lng: -93.2650,      // west longitude is NEGATIVE
  date: "March 2024",
  year: 2024,          // number, used for sorting
  role: "Poster",      // Talk / Poster / Invited talk / Attendee
  title: "Machine-learned force fields for relativistic DFT",
  placeholder: false   // set false once you've verified it
}
```

Get coordinates from <https://www.latlong.net> or by googling
"*city name* latitude longitude".

To add more later, copy a block and edit it. Adding conferences outside the US
works fine too — it's a globe. If you add international ones, widen the opening
camera in `js/globe.js` (search for `pointOfView`).

Any entry marked `placeholder: true` triggers a warning banner on the page.
Nothing is marked that way now, so the banner is hidden. **Never ship with it
showing** — inaccurate conference claims on a job-hunting site are worse than no
conference page at all.

---

## Colors

The whole palette is CSS variables at the top of `css/style.css` — the Claude
light scheme: bone canvas `#F0EEE6`, clay accent `#D97757`, ink `#191917`.
Change `--accent` and `--accent-text` together to reskin the site; links and
small accent text use the darker `--accent-text` so they stay legible on cream.

The globe reads its colors from constants at the top of `js/globe.js`, kept in
sync with those variables by hand. If you change `--accent`, change `CLAY`
there too.

---

## Step 4 — Deploy to GitHub Pages (free)

The folder isn't a git repo yet. One time only:

```bash
cd ~/Desktop/Personal_website
git init -b main
git add .
git commit -m "Personal website"
```

Create an empty repo on GitHub named **`<your-username>.github.io`** — that exact
name gets you `https://<your-username>.github.io` with no subpath. Then:

```bash
git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
git push -u origin main
```

On GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
Live in about a minute.

Every update after that is:

```bash
git add . && git commit -m "Update conferences" && git push
```

---

## Step 5 — Custom domain (optional, ~$12/yr)

Buy `wentaozhang.com` (or similar) from Cloudflare Registrar or Namecheap. Then:

1. Create a file named `CNAME` in the project root containing one line:
   `wentaozhang.com`
2. At your registrar, add DNS records:
   - Four `A` records for `@` → `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - One `CNAME` for `www` → `<your-username>.github.io`
3. GitHub → Settings → Pages → set the custom domain, tick **Enforce HTTPS**.

---

## Keeping the CV in sync

`assets/Wentao_Zhang_CV.pdf` is a copy of `resume_wentao.pdf`. When you update
your CV, overwrite it:

```bash
cp resume_wentao.pdf assets/Wentao_Zhang_CV.pdf
```

Keep the filename stable so links you've already sent out don't break.

---

## Notes on the globe

- `globe.gl` (which bundles three.js) loads from unpkg CDN, and the Earth
  textures come from the same place. Only `conferences.html` pays that cost.
- If the CDN is unreachable, the page degrades gracefully: the loading panel
  says so and the conference list below still renders.
- Auto-rotation is disabled for visitors with `prefers-reduced-motion` set, and
  stops permanently on the first drag/scroll.
- To pin the library version (recommended once you're happy with how it looks),
  change `globe.gl@2` to a specific version like `globe.gl@2.34.4` in
  `conferences.html`.
