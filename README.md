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

This is a static HTML/CSS/JavaScript site with Vercel Functions in `/api`. The checked-in `vercel.json` pins the framework to Other, runs `npm run build`, and serves the repository root as the output directory.

1. Push this repository to GitHub and import `Yashkhadgi/Yash-s_Portfolio_Main` in [Vercel](https://vercel.com).
2. Set the Root Directory to the repository root. The project config supplies Framework Preset `Other`, Build Command `npm run build`, and Output Directory `.`.
3. Keep the Production Branch as `main`, then click **Deploy**. Future pushes to `main` deploy to production automatically.

### Private visitor history

The `/visitors` page has two private tables. The first shows one row per browser-tab session, most recently active first: visit ID, visitor name/email (Unknown), IP, date/day, first and last update in IST, country/city, approximate browser/OS/device, sections viewed, page-view count, total foreground time and referral origin. Click a visit ID to open the second table: each recorded page/subpage in chronological order, its opening date/time, last update, approximate foreground duration, reported exit status and IP. Both tables refresh every 15 seconds while visible and have independent pagination (100 rows per page). Names/emails cannot be discovered from an anonymous visit; this tracker does not collect or link contact-form identities. Section/subpage changes count as page views; sessions are not unique people. The page requires an admin token and does not save that token in browser storage.

`visit-tracker.js` measures time while the portfolio tab is visible, using a monotonic browser clock. It sends cumulative updates every 15 seconds, on visibility changes, page navigation and pagehide, with beacon/keepalive delivery. It excludes hidden-tab intervals but does not prove attention or detect idle users. Each page view has a random event ID. The private `record_portfolio_visit` database function upserts that event, preserves the earliest opening time, takes the greatest cumulative duration and last-update timestamp, and preserves an observed exit. Out-of-order/duplicate heartbeats do not add page views or reduce duration. Foreground duration is capped at 24 hours per page view. Crashes, blockers and network failures can lose the final interval. Old rows have unknown duration; back/forward-cache restoration creates a new page view. Last update is a server receipt time, not an exact exit time.

Set up persistent storage before deploying:

1. Create a Supabase project. Open its SQL Editor and run [`scripts/visitor-table.sql`](scripts/visitor-table.sql). The table has Row Level Security enabled and denies browser/public access. The private summary view groups the full history before pagination. If you already ran an earlier version, rerun the entire updated script to add the timing columns, upsert function, indexes and updated summary view without deleting saved visits. The upsert function can only be executed with the backend role.
2. In Vercel → Project → Settings → Environment Variables, add:
   - `SUPABASE_URL`: the project's API URL, such as `https://YOUR_PROJECT.supabase.co`.
   - `SUPABASE_SECRET_KEY`: the backend secret key (`sb_secret_...`) from Supabase's API keys settings. Never put it in frontend code. This implementation uses the new secret key via the `apikey` header.
   - `VISITOR_ADMIN_TOKEN`: a unique random secret of at least 32 characters. For example, generate one with `openssl rand -hex 32`. Store it in your password manager; enter it when opening the visitor table. Do not use the example placeholder.
3. Deploy these source changes and redeploy after setting the variables. Open `https://YOUR_PORTFOLIO_DOMAIN/visitors` and enter your admin token.
4. Visit the main portfolio in another tab and navigate through Arrival → Theater → Archives. Within 15 seconds, the first table page should show one session with three page views; click its visit ID to see all three steps. A separate browser session with the same IP must appear as its own summary row. Supabase's Table Editor also lets you inspect the raw saved records directly.

Without database configuration, `/api/visit` continues logging to Vercel but returns 503 to indicate that it has not saved a database record. Storage errors return 502. Tracking failures never interrupt portfolio navigation. Previous Vercel log entries are not automatically imported. New records are retained in the database until deleted; manage retention there. Restrict Production credentials to Production if you don't want preview visits in the same table.

The Python development server only serves static files; use Vercel or `vercel dev` for API testing. `/visitors` itself does not send visit events. Names/emails are not collected by this tracker. IP addresses can be shared or masked, geolocation is approximate, and blocked JavaScript or network failures can cause missing records. Session IDs group page views in a browser tab and do not identify a person. The public tracking endpoint can receive automated/spam requests; use Vercel firewall controls if needed. Record your collection purpose and retention in your privacy notice.

### Contact form email delivery

The Contact page POSTs to the Vercel function at `/api/contact`. Add these environment variables in the Vercel project and redeploy:

- `RESEND_API_KEY`: a Resend API key.
- `CONTACT_FROM_EMAIL`: an address on your verified Resend sending domain (for example, `Portfolio <hello@yourdomain.com>`).
- `CONTACT_TO_EMAIL`: optional destination, defaulting to `yashkhadgi4@gmail.com`.

The visitor's email is used as the reply-to address. The function never exposes the API key in browser code. The local Python static server does not run Vercel functions; use a Vercel deployment or `vercel dev` to test real delivery. Without configuration, the form reports delivery unavailable and visitors can use the direct email link.

The Archives page now includes the supplied Red Hat, DS3 and Infosys certificate records with preview and download actions. Add future certificates under `more data abt me/certificates/` and extend the certificate grid in `pages/research.html` with the issuer, exact title, date, and original file link.
