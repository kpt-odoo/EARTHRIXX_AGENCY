# Alex Carter — Video Editor Portfolio

A dark, cinematic, static portfolio for video editors & colorists. Inspired by artefakt.com, dny19.com, 1820productions.com and befesti.nl.

- **No build step. No frameworks. No dependencies.** Pure HTML + CSS + vanilla JS.
- Works on GitHub Pages, Netlify, Vercel, Cloudflare Pages or any static host.
- Mobile responsive, accessible (reduced-motion support), ~2 MB of assets.

## Folder structure

```
video-portfolio/
├── index.html          ← all content lives here
├── css/style.css       ← all styling (colors, fonts, layout)
├── js/main.js          ← all interactions (preloader, cursor, modal…)
├── assets/
│   ├── img/            ← hero, 7 project thumbnails, portrait
│   └── video/          ← hero loop + hover-preview loops (placeholders)
└── .nojekyll           ← tells GitHub Pages to serve files as-is
```

## 1. Make it yours (5 minutes)

Open `index.html` in any editor and search & replace:

| Find                        | Replace with                          |
|-----------------------------|---------------------------------------|
| `Alex Carter`               | your name (also in `<title>` + meta)  |
| `ALEX CARTER`               | your name in caps                     |
| `A/C`                       | your initials                         |
| `hello@alexcarter.studio`   | your email (appears twice)            |
| `MUMBAI, INDIA`             | your city                             |
| `instagram.com` etc.        | your social profile URLs              |

Then update in `index.html`:

- **Projects** — each `<article class="work__item">` has a title, category/year,
  thumbnail (`assets/img/...`) and a `data-video="assets/video/..."` attribute.
  Replace the images and point `data-video` at your real clips.
- **About** — the three bio paragraphs + `about-portrait.jpg`.
- **Stats** — change the `data-count` numbers (`6`, `250`, `60`, `15`).
- **Clients marquee** — swap the fictional studio names for your clients.
- **Showreel** — in `js/main.js` (section 7) point `reelOpen` at your real
  showreel file instead of `assets/video/hero-bg.mp4`.

### Replacing media

| Placeholder | Size     | Replace with                        |
|-------------|----------|-------------------------------------|
| `hero-poster.jpg` | 1408×704 | your best still frame        |
| `hero-bg.mp4`     | 1120×560 | 10–20 s muted loop of your work |
| `work-*.jpg`      | 1344×768 | project thumbnails           |
| `hover-*.mp4`     | 640×360  | 5–10 s muted clip per project |
| `about-portrait.jpg` | 864×1152 | your photo at the desk     |

Tip: keep placeholder videos **muted, short and H.264** so hover previews start
instantly. Example ffmpeg command to make a hover loop from a clip:

```bash
ffmpeg -i clip.mp4 -t 6 -an -vf "scale=640:360" -c:v libx264 -crf 26 -movflags +faststart hover-music.mp4
```

## 2. Publish on GitHub Pages

1. Create a new repository on GitHub (e.g. `portfolio`).
   - Want a root domain like `yourname.github.io`? Name the repo exactly that.
2. Upload the **contents** of this folder to the repo (drag & drop works on
   github.com, or `git init && git add . && git commit -m "portfolio" && git remote add origin ... && git push -u origin main`).
3. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from
   a branch → Branch: main / (root) → Save**.
4. Wait ~1 minute, then open `https://<username>.github.io/<repo-name>/`.

Your custom domain (optional): add a `CNAME` file containing your domain, and a
DNS `CNAME` record pointing to `<username>.github.io`.

## Fonts & colors

- Display: [Anton](https://fonts.google.com/specimen/Anton) (closest free match to the reference's Thunder)
- Body: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
- Mono: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- Palette: bg `#0a0909` · ink `#e1e6e1` · accent `#f73a0b` (edit the `:root`
  variables at the top of `css/style.css` to re-theme the whole site)
# EARTHRIXX_AGENCY
