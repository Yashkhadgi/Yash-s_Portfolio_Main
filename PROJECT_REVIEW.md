# Portfolio review - 8 October 2026

## Overall status

The project is a five-screen static HTML/JavaScript portfolio with an iframe-based route shell. It is not a React/Vite application. It can be served by a static host; it has not been publicly deployed or verified on Vercel/Netlify in this review.

Original images, screenshots, page styles, typography, colors and layouts are preserved. Functional enhancements run through the root index.html. Directly opening a child HTML file bypasses the shared enhancements; use the root URL.

## Fixed during this review

- Parent route navigation now replaces iframe history entries, fixing the Back-button stall. Removed the handler that intercepted native Alt+Left/Right.
- Existing navigation anchors point to shareable root hash URLs, including modified-click behavior.
- Same-route mobile selection closes the route menu. Escape closes the menu.
- Command buttons and Ctrl/Cmd+K open searchable navigation and project-source results, including technology keywords. Research search provides the twelfth project, Agriculture Price Prediction.
- Page 4/5 mobile Menu controls use the same navigation dialog instead of alerts. About's previously inert Command button works.
- Universe destinations support click/touch, Enter and Space, alongside their original hover behavior.
- Four theater case-study dialogs now show project-specific content from the supplied brief and correct repository links. Existing panel/diagram containers are retained. Architecture remains conceptual, not repository-verified.
- MemoryLens's placeholder GitHub link points to the supplied repository.
- Theater modal supports Escape, backdrop dismissal, keyboard focus containment and focus restoration. Tabs can scroll horizontally on small viewports.
- Patent disclosures expose expanded state and avoid clipping long content. Live content regions announce updates.
- Images have alt descriptions without changing sources. Keyboard focus is visible.
- CSS animation/transition reduction, reduced-motion starfield behavior and disabled parallax under reduced-motion preference.
- Short fade feedback when switching scenes and theater stages. No new continuous decorative animations.
- The existing progress ring follows actual page scrolling; the existing IST clock shows actual India time.
- Theme/audio controls disclose their unavailable state instead of silently doing nothing. They do not change the supplied visual palette or play unrequested audio.
- Enhancement failures no longer prevent the root page from becoming visible.

## JavaScript already present before this review

| Area | Existing behavior |
| --- | --- |
| Root | Hash routing, transitions, mobile journey navigation |
| Arrival | Three scenes, morph slider, canvas starfield, pointer motion |
| Universe | Technology filters, parallax, zoom/reset, hover preview |
| Theater | Stage switching, modal tabs, architecture drawer |
| Research | Methodology stage selection, patent expansion |
| About | Six question answers, eight technology evidence selectors |

## Content work awaiting your real data

These are publication blockers for credibility, not requests to replace images now. The existing exported screens contain claims that should not be treated as verified portfolio facts.

1. Arrival: placeholder portrait, Pune coordinates instead of Nagpur, alumni wording for current studies, architect/zero-defect claims, patent status labels and old year/build labels.
2. Universe: wrong SIH reference instead of Union Bank x KJ Somaiya, IEEE 2024 instead of TEMSMET 2025, two registered patents claim, invented inference/voxel metrics and unconfirmed technology stacks. Node hover metadata also contains these issues.
3. Theater: 98.4% accuracy, 420ms, 380ms, 500+ requests/second, embedding counts, certainty/drift and uptime values are unverified. The architecture drawer presents sample telemetry as live. Medical simulation copy needs research-prototype language. Generated product visuals are retained as requested, but are not verified screenshots.
4. Research: supplied DOI is linked, but this review did not independently verify the paper or patent documents. Existing 'verified' badges overstate that distinction. Preparation/model methodology details need the actual paper.
5. About: actual portrait; verified per-project technology mappings and feature status (especially BhashaYatra plans versus implemented work).
6. Resume PDF, paper PDF, patent records, conference presentation, certificates, personal photographs and product screenshots/demo recordings.

## Broader brief not implemented yet

- Dedicated education/experience Journey, Gallery and Contact pages. Current five screens are Arrival, Universe, Theater, Research and About, not the original seven-page architecture.
- Full searchable/sortable project gallery with grid/list modes and 12 detailed case studies. The existing universe has 12 nodes; the theater has four case-study summaries.
- Dual-degree timeline, internships/leadership timeline and hackathon explorer.
- Complete skills coverage, certificate viewer/downloads and supporting-document viewers.
- SafarSathi roadmap with verified feature statuses.
- Local question-answer interface beyond command keyword search; visitor modes.
- Full interactive architecture models/product demonstrations and project deep links.
- Light theme. This would be an additional visual design, so it was not substituted for the supplied palette.
- Audio asset/ambience implementation, optional with explicit user activation.
- Gallery lightbox after real photos arrive. Contact form requires an actual delivery service; current email link works through the visitor's email client.

## Engineering follow-up

- Tailwind CDN runtime, Google Fonts and remote generated images remain external dependencies. Compile matching static Tailwind CSS and locally host permitted existing assets before a production-hardening pass. Validate visual parity when doing so.
- Content is still spread across inline HTML and scripts. Move approved content into one structured source when replacing placeholders; the current command/project-summary data is centralized in page-enhancements.js.
- Full iframe content does not provide independent SEO metadata per project. Social sharing uses root metadata. Route-specific standalone pages would require a deliberate architectural migration.
- Small-screen universe remains a fixed spatial canvas and can clip destinations; command search provides access to all project sources, but a true touch-first universe needs a separately approved layout.
- Theme/audio are explicitly unavailable; this review does not claim feature completeness.
- More device testing, external asset availability and public deployment checks remain before release. Browser tests cover the core repaired interactions, not all external repositories or every device.
- Intermittent browser console error: `MutationObserver.observe: parameter 1 is not of type Node`. No MutationObserver call exists in the project source searched during this review; its origin in external scripts/browser instrumentation remains unresolved. Do not claim an error-free console until isolated.

## Verification performed

- Node syntax validation passed for app.js and page-enhancements.js.
- Browser Back returned Universe to Arrival; Back/Forward returned About to Research and back to About.
- Command search for FastAPI returned the expected five project sources.
- CustomerPulse modal source link resolved to its supplied GitHub repository; Escape closed the modal. MemoryLens displayed its own role and workflow.
- At a narrow viewport, Research Menu opened searchable navigation without the previous alert and navigated to About.
- Keyboard Enter on the CustomerPulse universe destination opened its existing preview.
- Desktop screenshot inspected after functional changes; original imagery and visual layout retained. No screenshot-diff baseline was available for a strict pixel-parity assertion.

## Next useful JavaScript additions

After content upload: certificate/PDF viewer, photo lightbox with keyboard/swipe navigation, project search/sort, interactive timeline, roadmap filters, resume download, and actual contact delivery/validation. Each needs either missing content or additional interface design; none should display fabricated success/results.
