# Yash Khadgi — Portfolio Universe

A cinematic, interactive five-page portfolio showcasing projects, research landmarks, and builder philosophy.

---

## 🚀 Quick Start (Run Locally)

Choose any method to run locally:

### Option 1: Using npm (Recommended)
```bash
npm run dev
```

### Option 2: Using Python
```bash
python3 -m http.server 4173
```

### Option 3: Using npx serve
```bash
npx serve .
```

After starting, open **`http://localhost:4173`** (or the URL printed in your terminal) in your browser.

---

## 🧭 Page Routes

The root shell keeps the five pages in `pages/` preloaded and switches between them without reloading on every visit:

Scrolling beyond the bottom of a page opens the next page; scrolling past the top returns to the previous page. Navigation links still work directly. The scroll controller is authored in `journey-scroll.ts`; run `npm run build` after editing it to regenerate the committed browser script `journey-scroll.js` (Node.js 22.10+).

- `#arrival` — Cinematic Arrival
- `#universe` — The Builder's Universe
- `#theater` — Project Theater
- `#research` — Archives
- `#about` — The Person Behind the Builds

---

## 🌐 Deploy to Vercel

This is a static web application with zero build configuration needed.

1. Push this repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Keep default settings (`Build Command: None`, `Output Directory: .`).
4. Click **Deploy**.
