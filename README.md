# The Builder's Journey

The connected five-page portfolio of Yash Khadgi.

## Preview locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/`. The root shell connects all screens while preserving the original page designs.

## Routes

- `#arrival` — cinematic arrival
- `#universe` — builder's universe
- `#theater` — project theater
- `#research` — research landmarks
- `#about` — person behind the builds

## Deploy

This is a static site with no build step. Deploy the repository root to Vercel, Netlify, GitHub Pages, or any static host. The single public entry point is `index.html`.

Read [PROJECT_REVIEW.md](PROJECT_REVIEW.md) for the functional audit, unresolved content claims and remaining features. This is a preview-ready site, not a fully verified publication-ready portfolio.

`page-enhancements.js` attaches shared search, accessibility and case-study behavior to the preserved screens. Always preview through the root URL, rather than opening child HTML files directly. Images and fonts still require internet access.
