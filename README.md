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

- `#arrival` — Cinematic Arrival, About, education, leadership, experience, and categorized skills
- `#universe` — The Builder's Universe
- `#theater` — Project Theater
- `#research` — Archives
- `#contact` — Contact links, resume, and message form (`#about` redirects here).

---

## 🌐 Deploy to Vercel

This is a static web application with zero build configuration needed.

1. Push this repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Keep default settings (`Build Command: None`, `Output Directory: .`).
4. Click **Deploy**.

### Contact form email delivery

The Contact page POSTs to the Vercel function at `/api/contact`. Add these environment variables in the Vercel project and redeploy:

- `RESEND_API_KEY`: a Resend API key.
- `CONTACT_FROM_EMAIL`: an address on your verified Resend sending domain (for example, `Portfolio <hello@yourdomain.com>`).
- `CONTACT_TO_EMAIL`: optional destination, defaulting to `yashkhadgi4@gmail.com`.

The visitor's email is used as the reply-to address. The function never exposes the API key in browser code. The local Python static server does not run Vercel functions; use a Vercel deployment or `vercel dev` to test real delivery. Without configuration, the form reports delivery unavailable and visitors can use the direct email link.

The Archives page now includes the supplied Red Hat, DS3 and Infosys certificate records with preview and download actions. Add future certificates under `more data abt me/certificates/` and extend the certificate grid in `pages/research.html` with the issuer, exact title, date, and original file link.
