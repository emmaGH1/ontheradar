# OnTheRadar — Design Brief (hand this whole file to Grok)

Base system: editorial-landing-page skill (dark theme, Syne 800 headlines,
Space Grotesk body, mono uppercase eyebrows, `py-28 px-6` sections, buttons
shrink on hover). Use its bootstrap prompt as the foundation, with these
project-specific fills:

## Color slots
- bg: `#0F0F11` / surface: `#1A1A1E` / border: `#2A2A2F` (defaults, unchanged)
- accent-primary: neon lime green, matching the OnTheRadar logo — sample
  exact hex from the logo file, approx `#C6FF3A`. Used for CTAs, hover
  states, live metric numbers.
- accent-secondary: amber/orange, approx `#FF9F1C` — the "radar sweep
  warning" moment, used 1-2x max (e.g. a live-pulse dot, an alert state).
- Motion: subtle, slow-moving flux field — calm/premium, not dramatic.

## Page structure (product-story order, landing → app)

**1. Hero**
- Flux field background (slow, subtle — like the reference image but
  calmer), lime-tinted instead of red/orange
- Eyebrow: "ONTHERADAR" mono uppercase
- Headline: something like "The report card for your CAP agent." (refine
  copy later)
- Subhead: one sentence — post-launch metrics, real CAP data
- CTA button: lime, shrinks on hover per button law

**2. How it works**
- 3 steps, eyebrow pattern from skill file: paste SDK key → we query CAP
  → see your real numbers
- Keep it simple, one idea per section, no clutter

**3. Live preview (this is the centerpiece — sells the product itself)**
- Generative skeleton mesh loading animation that resolves into the 4
  real metric cards (order count, revenue, unique buyers, completion rate)
- This mirrors the actual dashboard's empty→loaded state, so it's not
  just decorative — it's a preview of the real product
- Wrap metric cards in the refraction glass container style (from image
  2) — feels premium, ties to "seeing through to real data"

**4. Use cases / who it's for**
- Short cards: sellers who want to know if they're getting real traction,
  post-launch health check, etc.
- Optional: morphing shape background behind this section only (one of
  the 2-3 total accent moments on the page — don't overuse)

**5. Pricing**
- Dead simple: "$0.05 per report. No subscription." Editorial, not corporate
  (per skill file's tone rule)

**6. Final CTA → into the app**
- This is where it hands off to the actual dashboard (SDK Key + Agent ID
  form you already built)

**7. Footer — "signal footer"**
- Radar/pulse motif: small animated ping dot next to "Live" or similar,
  amber accent used here as the secondary "emotional" moment
- Keep structure simple like the reference image 3 (links, socials,
  copyright) but themed to the radar/signal concept instead of generic

## Constraints (from skill file, don't deviate)
- No pure black/white, no overlays on images, no emojis, no exclamation
  marks
- One idea per section, editorial over corporate
- Stroke text via inline `WebkitTextStroke` only
- Glow hover via React `useState` component, not CSS-only
- Buttons shrink on hover (`scale-95`), never grow
- Strip AI co-author trailers before pushing (see skill file's git command)

## Reference sites
Linear, Stripe, Vercel, Cursor, Resend — same as skill file's list, good
fit for a dev-tooling product like this

## Next step for Grok
Build hero + live preview section first (these sell the product hardest
for judges) — how it works, use cases, pricing, footer can follow after
if time is short. If time runs out, hero + live preview + a functional
CTA into the existing dashboard is enough to demo.
