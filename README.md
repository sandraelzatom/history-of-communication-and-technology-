# MuseumJourney

A scroll-driven museum exhibit built in React + Framer Motion. Walks through 4 eras of communication history, each with its own evolving visual identity — from heavy analog warmth in 1837 to razor-thin digital minimalism in 1983+.

---

## How it was made

### Concept

The core design idea: **visual weight decreases over time**, mirroring how communication itself became lighter and more abstract. Heavy borders, warm paper tones, and typewriter text in the telegraph era give way to thin lines, cool white backgrounds, and clean sans-serif in the digital era.

---

## Project structure

```
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
└── src/
    ├── app/
    │   ├── globals.css        ← Tailwind base + global reset
    │   ├── layout.tsx         ← Next.js root layout + metadata
    │   └── page.tsx           ← imports and renders MuseumJourneyPage
    └── components/
        └── MuseumJourney.tsx  ← all components in one file
```

### Inside `MuseumJourney.tsx`

```
MuseumJourney.tsx
│
├── eras[]                 ← data array: content + style per era
│
├── SignalPulse            ← animated background rings
├── useTypewriter()        ← custom hook for telegraph card text
├── PaperTexture           ← SVG feTurbulence noise overlay
├── TimelineSpine          ← sticky left-side progress tracker
├── EraCard                ← main exhibit card (×4)
└── MuseumJourneyPage      ← root: nav, hero, layout, footer
```

---

## Component breakdown

### `eras[]` — data layer

Each era is a plain object with two kinds of fields:

**Content** — `title`, `year`, `artifact`, `description`, `significance`, `medium`

**Style** — `bg`, `accent`, `border`, `borderWidth`, `fontWeight`, `letterSpacing`

Style values are injected directly as inline styles. No CSS class switching needed — adding a 5th era requires only a new object in this array.

Two boolean flags control special behavior per card:
- `isTypewriter` — triggers the typewriter hook (telegraph era only)
- `isHero` — applies two-column layout (digital era only)

---

### `SignalPulse`

Four `motion.div` circles that expand from center to `180vmax` and fade out, staggered 1 second apart, looping every 4 seconds. Alternates between red (`#D7263D`) and navy (`#1B3A6B`) borders. Fixed position, pointer-events none, z-index 0.

```tsx
animate={{ width: "180vmax", height: "180vmax", opacity: 0 }}
transition={{ duration: 4, delay: i * 1, repeat: Infinity, repeatDelay: 4 }}
```

---

### `useTypewriter(text, active, speed)`

Custom hook. When `active` flips true, starts a `setInterval` that appends one character at a time to `displayed`. Clears and resets when `active` changes. Returns `{ displayed, done }`.

Used only on the telegraph card — inactive cards show static text. The blinking cursor is a `motion.span` toggling `opacity: [1, 0]` on repeat.

---

### `PaperTexture`

Inline SVG using `<feTurbulence type="fractalNoise">` + `<feColorMatrix type="saturate" values="0">` to generate a film-grain noise pattern. Rendered absolute, full-size, 6% opacity. Only shown on the telegraph card via `era.hasTexture`.

---

### `TimelineSpine`

Sticky sidebar (desktop only, `hidden lg:flex`). Contains:

- A gray track line (full height)
- An animated red→yellow fill that grows based on `activeIndex`:
  ```
  height = ((activeIndex + 1) / eras.length) * 100%
  ```
- Four labeled dot nodes — each scales up (`scale: 1.4`) and glows when active

Receives `activeEra` from the parent via prop. Read-only — no click handlers.

---

### `EraCard`

The main exhibit card. Each instance:

1. **`useInView` (scroll tracking)** — margin `-30% 0px -30% 0px` means the card is "active" only when its center region hits the middle third of the viewport. Calls `onVisible(index)` to update parent state.

2. **`useInView` (entry animation, once)** — separate ref with `once: true` and `-100px` margin triggers the slide-in: `opacity: 0 → 1, x: 40 → 0` with a custom ease `[0.22, 1, 0.36, 1]`.

3. **Accent bar** — colored top border whose height decreases per era (`6px → 5px → 4px → 2px`), reinforcing the visual weight metaphor.

4. **Symbol pulse** — the era's symbol (`—·—·`, `☏`, `~∿~`, `01`) pulses `opacity: [0.4, 1, 0.4]` when the card is in view.

5. **Digital grid overlay** — `isHero` cards get a faint CSS `background-image` crosshatch at 4% opacity.

6. **Two-column layout** — `isHero` cards use `lg:grid lg:grid-cols-5`, with the right column showing a "Mass of communication" bar chart that animates in on scroll.

---

### `MuseumJourneyPage` — root

Holds one piece of state: `activeEra` (number, 0–3). Passes `handleVisible` (wrapped in `useCallback`) down to each `EraCard`. Renders:

- `<SignalPulse />` — fixed background
- `<nav>` — museum name, exhibit title, nav links with hover color swap
- `<header>` — two-column hero with title and decorative navy panel
- Section label bar (yellow, with a pulsing "Live Signal" dot)
- Main content grid: `180px TimelineSpine | flex-1 EraCards`
- Closing statement block (dark background)
- `<footer>`

---

## Dependencies

| Package | Purpose |
|---|---|
| `react` | `useState`, `useEffect`, `useRef`, `useCallback` |
| `framer-motion` | `motion.*`, `useInView`, `useAnimation`, `useScroll`, `useTransform`, `animate` |
| Google Fonts | `DM Sans` (body/headings) + `Space Mono` (labels/code) via `@import` in `<style>` |

No routing. No data fetching. No icon library. Self-contained single file.

---

## Installation & running locally

```bash
# 1. Clone your repo and copy all files into the structure above
# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open `http://localhost:3000` — you'll get the exact same result as the preview.

---

## Deployment

### Vercel (recommended — free, zero config)

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Click Deploy — Vercel auto-detects Next.js

### GitHub Pages

Add `output: "export"` to `next.config.mjs`:

```js
const nextConfig = {
  output: "export",
};
export default nextConfig;
```

Then run:

```bash
npm run build
# deploys the /out folder via gh-pages or GitHub Actions
```

---

## Customization

### Add a new era

Add one object to the `eras` array with content + style fields. The rest is automatic.

```ts
{
  id: "05",
  title: "The AI Era",
  year: "2022",
  yearEnd: "Now",
  medium: "Token · Inference · Prompt",
  artifact: "GPT-4 Technical Report",
  source: "OpenAI",
  symbol: "∞",
  bg: "#F0F4FF",
  border: "#0D0D0D",
  borderWidth: "0.5px",
  accent: "#5B21B6",
  accentLight: "#7C3AED",
  textPrimary: "#0D0D0D",
  textSecondary: "#4B5563",
  fontWeight: "300",
  letterSpacing: "0.04em",
  hasTexture: false,
  isTypewriter: false,
  description: "...",
  significance: "...",
}
```

### Change the color palette

The three brand colors are used throughout: edit them in one place each.
- `#D7263D` — red (signal, accent, CTAs)
- `#1B3A6B` — navy (telegraph blue, hero panel)
- `#F7B731` — amber (section bars, highlight text)

### Swap the typewriter era

Change `isTypewriter: true` to any era. The hook respects the `inView` state of whatever card it's attached to.

---

## Design decisions

**Why inline styles over CSS classes?**
Each era needs a unique combination of colors, weights, and borders. Keeping them in the data object makes the component logic era-agnostic — it reads style values from props rather than branching on era ID.

**Why two separate `useInView` calls per card?**
One tracks continuous scroll state (fires repeatedly, used for symbol pulse + typewriter activation + parent state update). The other fires once on entry to trigger the slide-in animation — re-triggering it on every scroll would feel glitchy.

**Why `useCallback` on `handleVisible`?**
`EraCard`'s `useEffect` lists `onVisible` as a dependency. Without `useCallback`, a new function reference on every parent render would cause the effect to re-run unnecessarily on every `activeEra` change.
