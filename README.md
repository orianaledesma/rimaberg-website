# Rima Berg — Jewellery (Vilnius)

Bilingual (EN/LT) catalogue site for the Rima Berg jewellery atelier. A vitrine,
not a shop: pieces are browsed and viewed, and enquiries go out by email — there
is no cart or checkout. Built from the "Direction C" design handoff.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build (also type-checks + lints)
npm run start    # serve the production build
npm run lint
```

Requires Node 18.18+ (developed on 18.19).

## Architecture

- **Next.js 15 (App Router) + React 19 + TypeScript.** Pages are React Server
  Components; only the interactive bits (`Carousel`, `Reveal`, `Cursor`,
  `LocaleSwitcher`) are client components.
- **State lives in three places.** Server data = the typed product catalogue in
  `src/data`. URL state = the catalogue filter (`/catalogue?category=rings`).
  Local UI state = carousel index, in-view flags — kept inside the client
  components that own them.
- **i18n: next-intl, cookie-based** (no `/en` `/lt` URL segments). The active
  locale is stored in the `rb-locale` cookie; `LocaleSwitcher` writes it through
  a server action that revalidates the layout, so the whole tree re-renders in
  the chosen language. Copy lives in `messages/{en,lt}.json`; per-product text
  (material, stones, description…) is stored as `{ en, lt }` on each product.
- **Design tokens** (palette) are CSS custom properties in `globals.css`; the
  reusable animation classes (`rb-*`) are ported verbatim from the prototype.
  Components never hardcode brand colours — they reference the tokens.
- **Images** are served from `public/products` through `next/image`. Product
  detail pages are statically generated via `generateStaticParams`.

## File structure

```
src/
├── app/
│   ├── layout.tsx              # fonts, SEO metadata, provider, style imports
│   ├── page.tsx                # Home (hero · featured carousel · tile grid · atelier)
│   ├── catalogue/
│   │   ├── page.tsx            # Catalogue (filter by ?category=)
│   │   └── [id]/page.tsx       # Product detail (SSG)
│   ├── about/page.tsx          # About + Contact
│   ├── not-found.tsx           # branded 404
│   └── globals.css             # Tailwind layers only
├── components/
│   ├── layout/                 # Header, Footer, CategoryNav, LocaleSwitcher, Logo
│   ├── catalogue/              # ProductCard, ProductTileGrid, FeaturedCarousel
│   ├── ui/                     # Carousel, Reveal (generic primitives)
│   └── sections/               # AtelierSection (composed page section)
├── data/
│   ├── products.ts             # typed catalogue (seed data — see below)
│   ├── categories.ts           # category definitions + nav order
│   └── blur.ts                 # generated LCP blur placeholders
├── i18n/                       # locales, request config, setLocale action
└── styles/                     # tokens · base · animations · navigation ·
                                # carousel · product · layout (imported in layout.tsx)
messages/                       # en.json, lt.json
public/products/                # ~128 studio photos
```

Styling: brand colours are CSS custom properties in `styles/tokens.css`; the
reusable `rb-*` classes are split into themed partials under `styles/` and
imported once from the root layout. Components compose those classes with
inline layout values — they never hardcode brand colours.

## Content pipeline

Piece data is authored in a spreadsheet, not in code. The flow:

```
content/products.csv  ──(npm run import:products)──►  src/data/products.generated.ts
public/products/*      ──(npm run contact-sheet)──►   content/contact-sheet.html
```

- **`content/products.csv`** is the source of truth — one row per piece, columns
  are LT-first (`*_lt` then `*_en`). The `images` column lists filenames from
  `public/products` separated by `|` (first = primary, second = hover swap).
  `category` ∈ earrings·rings·pendants·bracelets·engagement; `status` ∈
  onRequest·preOrder·madeToOrder.
- **`npm run import:products`** validates the CSV and regenerates
  `src/data/products.generated.ts` (typed). Never edit the generated file or
  hand-edit `products.ts`'s data — edit the CSV and re-run.
- **`npm run contact-sheet`** builds `content/contact-sheet.html`: every photo
  as a labelled thumbnail (✓ marks ones already in the CSV), with a filename
  filter — open it to map photos → pieces while filling the CSV.
- **`npm run builder`** builds `content/builder.html`: an interactive tool to
  group several photos into one piece (click photos → number = order, first =
  primary), fill its fields (LT/EN) and **Export CSV** in the importer's schema.
  Work is saved in the browser (localStorage); seeded with the current pieces.
  Flow: build pieces → Export CSV → replace `content/products.csv` →
  `npm run import:products`.

### Content TODO (Rima / Ori)
The current 14 rows are placeholder built on real photos. To finish: open the
contact sheet, add a CSV row per real piece (names, materials, stones, EN/LT
descriptions), run the importer; replace the atelier/portrait photos in
`about/page.tsx`; confirm contact details + the real store address/maps link in
`messages/*.json` (`contact`) and `src/data/site.ts` (`STORE_MAPS_URL`).

## Trade-offs & decisions

- **Catalogue, not commerce.** Matches the "each piece is unique / made to
  order" model; "Enquire" opens a pre-filled `mailto`. A cart can be added later
  without reworking the data layer.
- **Cookie i18n over routed i18n.** Simpler, no duplicated URL trees, and it
  matches the house pattern already used in trade-calendar. The cost is that the
  three pages that read the cookie render dynamically rather than fully static.
- **Data file over CMS.** Fastest path to launch and easy to diff in git. The
  `Product` type is the seam to swap in a headless CMS later with no page changes.
- **Inline styles for layout, tokens for colour.** The handoff specified exact
  pixel values; porting them to inline styles preserved fidelity, while colours
  go through CSS custom properties so the brand stays themeable.

## AI usage

Scaffolded and built with Claude Code: the design handoff (a bundled React
prototype) was unpacked to recover the Direction C source, which was then ported
to a production Next.js App Router structure, wired to a typed data layer and
next-intl, and verified with a passing build and a runtime smoke test. The
architecture choices, content model and bilingual copy were directed and
reviewed by the studio.
