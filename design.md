# VeryStays / Sustainable Iberian — design reference

Source of truth for brand look: `public/icon.svg`, `mobile/constants/brandTheme.ts`, and CSS tokens in `src/index.css`. Prefer those files when values diverge.

**Type:** headings **DM Serif Display**; UI **Inter**.  
**Radius:** `0.75rem`.

---

## Core brand

| Hex | Use |
|---|---|
| `#1A8F7A` | Brand teal / Portugal (icon gradient). Web primary ~`#1D726B` (`hsl(175 60% 28%)`) |
| `#3ECF8E` | Bright green highlight (icon) |
| `#F5A623` | Iberian orange / Spain (icon). Web secondary ~`#CF8217` (`hsl(35 80% 45%)`) |
| `#F7D154` / `#E8A838` | Gold highlights (icon + social/map card accents) |
| `#345846` | Logo tile, in-app panel / dark green text on light UI |
| `#0F3D38` | **BRAND_DARK** — social cards, map overview footers, photo overlays (not the logo tile) |
| `#FFFFFF` | Text/icons on teal, orange, and dark panels |

Light surfaces: **green + orange**.  
Dark panels: cream (`#F4F7F6`) + gold accents — not orange fills.

---

## Neutrals / surfaces / text

### App / site (light)

| Token | Hex | Notes |
|---|---|---|
| Page | `#F5F7F8` | App background (`brandTheme.background`); web bg ~`#EDF0F3` |
| Cards | `#FFFFFF` | `brandTheme.surface` |
| Muted wash | `#EEF3F0` | `brandTheme.surfaceMuted` |
| Border | `#E2E8EE` | App; web ~`#C4CCD4` |
| Text | `#345846` | App; web ink ~`#131C20` |
| Muted text | `#4A6274` | Web muted ~`#505C62` |
| Teal wash | `#DBF0EE` | Web accent surface |

### Dark web

Near-black `#0A0E10`, cards `#141B1F`, brighter teal `#34B2A7`, orange `#DD9A3C`.

### Mobile (`brandTheme`)

```
background #F5F7F8 · surface #FFFFFF · surfaceMuted #EEF3F0 · border #E2E8EE
text #345846 · textMuted #4A6274
green #1A8F7A · greenBright #3ECF8E · orange #F5A623 · orangeLight #F7D154
panel #345846 · panelMuted #B8D4C4 · panelText #FFFFFF
```

---

## Semantic / map / reliability

Used on the activity map, rankings, and overview PNG exports. Keep distinct from brand teal/orange.

| Meaning | Fill | Stroke |
|---|---|---|
| Reliable (score ≥ 8 / ≤ 1 min delay) | `#059669` | `#065F46` |
| Mixed (score ≥ 5 / ≤ 4 min) | `#D97706` | `#92400E` |
| Poor | `#DC2626` | `#991B1B` |
| No / unknown score | `#94A3B8` | — |
| Airport hub | `#0284C7` | `#075985` |
| You-are-here | `#0F766E` | `#FFFFFF` (ring); halo same teal, low opacity |

Also: connection-line fallback `#2563EB`; airport-destination type `#0EA5E9`. Airport labels may use an orange border.

**Train service types** (dots, badges, history / departure labels — high contrast on light surfaces):

| Type | Hex |
|---|---|
| Alfa Pendular | `#0F5C4E` |
| Intercidades / Celta | `#B45309` |
| Regional / InterRegional | `#166534` |
| Urban | `#475569` |
| Metro | `#6D28D9` |
| Airport | `#0369A1` |

**Activity hexes:** size = traffic. Color = reliability when a score exists; otherwise busy green `hsl(145 58% 50%)`, mid blue `hsl(210 52% 46%)`, quiet purple `hsl(275 48% 34%)`.

---

## Do / don’t

- **Do** treat teal + gold/orange as the Iberian pair; keep reliability emerald/amber/red and airport blue distinct.
- **Do** use `#0F3D38` for export footers; `#345846` for the mark and in-app dark panels.
- **Don’t** use legacy navy `#012841` / sky `#7EC8E3` (old `theme.ts` / widgets) for new VeryStays UI.
- **Don’t** use reliability red/amber as brand orange, or airport blue as brand teal.
- **Don’t** put orange as large fills on dark panels — gold hairlines/type only.
