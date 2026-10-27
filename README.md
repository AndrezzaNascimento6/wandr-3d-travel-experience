# NOVA — The Art of More

A fictional premium digital banking concept and cinematic, scroll-directed web experience. Built to explore motion design, interactive UX, and creative front-end engineering.

## Experience

- **Cinematic entry:** a full-screen transition when entering the experience
- **Card reveal:** depth, perspective and scroll-linked flip animation
- **Intelligent security:** counter-rotating vault and zoom motion
- **Wealth:** an illustration-only financial dashboard with an animated chart
- **Worldwide:** a dimensional globe that travels to the center as you scroll
- **Lifestyle:** three benefit panels with hover, tap and reveal interactions
- **Mobile banking demo:** an interactive phone with balance visibility, activity history, simulated transfers, demo top-ups and virtual-card freeze/unfreeze
- **Glass onboarding:** a responsive, animated, multi-path navigation modal

## Tech stack

React 19, TypeScript, Vite 6, Motion for React, Lucide, CSS 3D and responsive layouts.

## Run locally

```bash
npm install
npm run dev
```

## Validate and build

```bash
npm run typecheck
npm run build
```

## Deploy

Vercel: framework **Vite**, build `npm run build`, output directory `dist`.

## Disclaimer

NOVA is **not a real bank**. All accounts, card details, transaction data, prices and performance values are imaginary and illustrative. Interactive actions do not send data to any banking service or move real money.

This project uses the Oryzo AI website only as a motion/storytelling reference, not as a source of copied proprietary code or assets. Repository URL was retained from an earlier travel concept for continuity.

## Accessibility

This design concept targets **WCAG 2.2 AA** and goes beyond AA with a reduced-motion option for scroll-linked motion (WCAG 2.3.3 is Level AAA). Decorative scenes are hidden from assistive technologies when the meaningful description already exists in text.

- Keyboard: skip link, visible focus, mobile menu, working interactive demo, dialog focus trap, Escape and focus restoration.
- Motion: respects operating-system `prefers-reduced-motion` and a saved **REDUCE MOTION** control. Nonessential scroll choreography becomes a still composition.
- Comprehension: chart has an accessible label, globe has a concise alternative explanation, app notifications are announced politely, and decorative visuals are excluded from screen-reader output.
- Responsive: navigation remains available below 900 px, with larger controls and improved contrast.

Run automated browser checks on desktop (1440×900), tablet (768×1024), and mobile (375×812):

```bash
npm install
npx playwright install chromium
npm run test:a11y
```

**Manual validation is still required** before any conformance claim: NVDA + Firefox/Chrome (Windows), VoiceOver + Safari (macOS/iOS), TalkBack + Chrome (Android), 200–400% zoom, keyboard-only operation, landscape mode, and device-level reduced-motion settings. Automated axe and Playwright checks do not certify full WCAG conformance.


## NOVA × SIGNAL analytics experiment

A separate [SIGNAL Product Intelligence dashboard](https://github.com/AndrezzaNascimento6/ux-product-analytics-ai) studies this NOVA design experience.

Visitors are offered an optional, accessible analytics-consent choice. Tracking is disabled before consent and after decline. With permission, NOVA records random pseudonymous session IDs, section views, navigation and benefit actions, reduced-motion-control interactions, and **simulated** banking actions. Typed values, balances, transfer amounts, names and emails are not included in events. Consent choice is stored in localStorage.

This demo can send events to a Supabase `nova_events` table when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are defined at build time. Both NOVA and SIGNAL must share the same public Supabase URL/key. The browser sends validated events through the `nova_record_event` Supabase RPC. No anonymous user can read raw session rows once the secure [SIGNAL migration](https://github.com/AndrezzaNascimento6/ux-product-analytics-ai/blob/main/supabase/security_hardening.sql) has been applied. SIGNAL receives aggregated metrics through `signal_public_summary`, never individual event logs. The publishable/anon key is intentionally public; never use a service-role key in Vite. Without Supabase, opted-in events are stored only in NOVA's own browser localStorage and cannot appear on SIGNAL across origins.

**Important:** No real user study, conversion funnel to paying customers or real financial service is implemented. Only a clearly disclosed fictional portfolio experiment.

## Browser security

Vercel response headers enforce a Content Security Policy, anti-framing controls, no-referrer, no-sniff and restrictive browser permissions. Third-party font fetching (Google Fonts) remains an ordinary network request; third-party hosts may process network metadata such as IP addresses independently of analytics. This site does not display your home IP or store IPs in analytics event fields.
