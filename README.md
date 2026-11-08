# AURUM — An Evening in Gold

A cinematic, ultra-premium restaurant experience for **AURUM**, a fictional three-Michelin-star
fine-dining room in Mayfair. Built as a static, production-grade front end: Vite + React 19 +
TypeScript (strict), Tailwind CSS v4, GSAP and a React Three Fiber gold-dust hero.

No backend, no build-time secrets, no runtime API keys. `bun run build` produces a folder of static
files that can be hosted anywhere.

---

## Stack

| Concern      | Choice                                                        |
| ------------ | ------------------------------------------------------------- |
| Runtime / PM | [Bun](https://bun.sh) — `bun install`, `bun run dev`          |
| Build        | Vite 8 + React 19 + TypeScript 5.9 (strict, no `any`)         |
| Styling      | Tailwind CSS v4 (`@theme` tokens)                             |
| Type         | Cormorant Garamond + Inter via `@fontsource` (self-hosted)    |
| Motion       | GSAP + ScrollTrigger through `@gsap/react` (`useGSAP`), Lenis |
| Text         | SplitType                                                     |
| 3D           | `@react-three/fiber` + `@react-three/drei`                    |
| Forms        | `react-hook-form` + `zod` (`@hookform/resolvers`)             |
| Icons        | `lucide-react`                                                |
| Quality      | ESLint (flat config) + Prettier (+ Tailwind class sorting)    |

---

## Getting started

Requires **Bun 1.2+**.

```bash
bun install
bun run dev
```

The dev server runs on <http://localhost:3000>.

### Scripts

| Command              | What it does                                        |
| -------------------- | --------------------------------------------------- |
| `bun run dev`        | Vite dev server with HMR                            |
| `bun run build`      | Type-check (`tsc -b`) then build to `dist/`         |
| `bun run preview`    | Serve the production build locally                  |
| `bun run typecheck`  | TypeScript only                                     |
| `bun run lint`       | ESLint over the whole project                       |
| `bun run format`     | Prettier, with Tailwind class sorting               |
| `bun run format:check` | Verify formatting without writing                 |

> Hosted previews on a custom domain: set `VITE_ALLOWED_HOSTS="preview.example.com"` (comma
> separated) before `bun run dev`. Nothing is hard-coded in the config.

---

## Project structure

```
src/
  components/   Preloader, Cursor, Navbar, MobileMenu, Marquee, MagneticButton, SectionTitle
  sections/     Hero, Philosophy, Chef, TastingMenu, Counters, Gallery, Testimonials,
                Reservation, Location, Footer
  three/        GoldParticles.tsx — shader-driven gold dust
  hooks/        useLenis, useMediaQuery, useReducedMotion
  data/         menu, testimonials, gallery, nav (typed arrays)
  types/        shared domain types
  App.tsx       composition + scroll orchestration
  main.tsx      fonts, global CSS, React root
  index.css     design tokens, base layer, component layer
public/         favicon.svg / favicon.ico, robots.txt
```

### Design tokens

Defined once in `src/index.css` via Tailwind v4 `@theme`, so they are available as utilities
(`bg-ink`, `text-gold`, `font-display`, `ease-luxe`, …):

| Token       | Value     |
| ----------- | --------- |
| `ink`       | `#070707` |
| `charcoal`  | `#111113` |
| `gold`      | `#C9A45C` |
| `champagne` | `#E8D3A2` |
| `ivory`     | `#F2EDE4` |

---

## The experience

1. **Preloader** — AURUM letters rise as gold strokes, fill with a metallic sweep, a 0–100% counter
   runs, then three panels wipe upward to reveal the site.
2. **Cursor** — gold dot plus a lagging ring; the ring grows on links and shows `VIEW` over gallery
   images. Disabled on touch devices and for reduced motion.
3. **Hero** — lazy-loaded Three.js gold dust (custom GLSL, pointer parallax, ~1,600 motes on desktop
   / 420 on mobile) over two cross-fading Ken Burns images. Headline splits word-by-word with
   SplitType, and the metallic line lifts as a masked block. Magnetic `Reserve a Table` button.
4. **Smooth scroll** — Lenis driven from the GSAP ticker so ScrollTrigger and the page stay on one
   frame.
5. **Philosophy** — the quote fills word by word, colour per word, with scroll progress.
6. **The Chef** — clip-path portrait reveal, parallax inset image, and a signature flourish drawn
   with `stroke-dashoffset`.
7. **Tasting Menu** — six courses on a pinned horizontal track (desktop) that falls back to a
   stacked list on mobile and under reduced motion.
8. **Counters** — Michelin stars, years, wines and awards, counted up when they enter the viewport.
9. **Gallery** — asymmetric masonry columns, per-image parallax, and a keyboard-accessible lightbox
   (`←`/`→`/`Esc`, scroll lock restored on close).
10. **Testimonials** — auto-advancing carousel with star ratings, pause on hover/focus, manual
    controls.
11. **Reservation** — floating labels, a gold focus line, `react-hook-form` + `zod` validation and an
    animated confirmation with a drawn check ring.
12. **Location** — hours, contact details and a dark-styled Google Maps embed.
13. **Footer** — newsletter, link columns, socials, a giant metallic AURUM wordmark and back-to-top.

### Motion and accessibility

- `prefers-reduced-motion` is respected everywhere: the preloader is skipped, Lenis is disabled, the
  cursor is hidden, scroll reveals are omitted and the tasting menu becomes a normal list.
- The custom cursor only mounts for `(hover: hover) and (pointer: fine)`.
- Scroll-linked animations animate transform and opacity only. The gold dust runs on the GPU via a
  custom shader and pauses when the hero leaves the viewport.
- Every control is a real button or link with an accessible name; the gallery lightbox is a labelled
  `dialog`; there is a skip link; focus-visible rings are gold.
- Text is never left hidden behind an un-fired scroll trigger: reveals animate position, not
  visibility.

---

## Deploying to Cloudflare Pages

The build is fully static, so Cloudflare Pages needs no adapter.

### Dashboard

1. Push this repository to GitHub/GitLab.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Pick the repository, then set:
   - **Framework preset:** `None` (or `Vite`)
   - **Build command:** `bun run build`
   - **Build output directory:** `dist`
   - **Root directory:** repository root (or `aurum` if the project lives in a subfolder)
4. **Environment variables (optional):** `BUN_VERSION=1.2` if you want to pin the runtime.
5. **Save and Deploy.** Every push to the production branch redeploys; other branches get preview
   URLs.

### Wrangler (CLI)

```bash
bun install
bun run build
bunx wrangler pages deploy dist --project-name aurum
```

### Notes for hosting

- No client-side router is used, so no SPA rewrite rules are required.
- The only external requests are the Unsplash images and the Google Maps embed. Self-host the
  photography in `public/` and swap the `src` values in `src/data/*` if you want a zero-third-party
  build.
- Add a `Cache-Control: public, max-age=31536000, immutable` header for `/assets/*` in a `_headers`
  file for best repeat-visit performance.

---

## Customising

- **Copy and prices** — `src/data/menu.ts`, `src/data/testimonials.ts`, `src/data/gallery.ts`.
- **Imagery** — every image is a plain Unsplash URL built in the data files; replace with your own.
- **Menu length** — the pinned track measures itself, so adding or removing courses needs no code
  changes.
- **Colour and type** — edit the `@theme` block in `src/index.css`.
- **Reservation submissions** — `onSubmit` in `src/sections/Reservation.tsx` currently resolves a
  short timeout. Replace it with a `fetch` to your endpoint (or a Cloudflare Pages Function) and keep
  the success state.

---

## Credits

Photography from [Unsplash](https://unsplash.com). Typefaces: Cormorant Garamond (Christian Thalmann)
and Inter (Rasmus Andersson), both under the SIL Open Font License.

AURUM is a fictional restaurant created for this project.
