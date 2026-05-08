# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the project

No build step. Open `index.html` directly in a browser, or serve it with any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Architecture

This is a **no-build, browser-compiled React app**. React 18 and Babel standalone are loaded from CDN. JSX files are compiled at runtime by Babel — there is no transpilation step.

### Script loading order (index.html)

Files must load in this exact order because each one exposes a global that the next depends on:

1. `data.js` → `window.AlbionData` (items, cities, recipes, mock pricing)
2. `i18n.js` → `window.i18n` (FR/EN translation function `t(lang, key, vars)`)
3. `tweaks-panel.jsx` → exposes `TweaksPanel`, `TweakSection`, `TweakSlider`, `TweakRadio`, etc. on `window`
4. `ui.jsx` → `window.AlbionUI` (`Glyph`, `HelpTooltip`, `FieldLabel`, `fmtSilver`, `fmtSilverFull`, `fmtPct`, `Coin`)
5. `app.jsx` → mounts the React app to `#root`

### Global state pattern

There is no module bundler. Cross-file sharing uses globals: `window.AlbionData`, `window.AlbionUI`, `window.i18n`, and the tweaks primitives. Each file declares its exports via `window.X = { ... }` at the bottom.

### Theme system

Three themes (`parchment`, `light`, `dark`) are driven by `data-theme` on `<html>`. The active theme is persisted in `localStorage` under `aoo_theme` and bootstrapped inline in `index.html` before first paint to avoid flash. All colors are CSS custom properties defined in `styles.css` per-theme under `:root[data-theme="..."]`.

### Data source: albion-online-data.com API

**This project uses [albion-online-data.com](https://www.albion-online-data.com/) as its sole data source.** The community-run API provides real-time market prices and history for all Albion Online items.

Key endpoints (no auth required, CORS-enabled):
```
GET https://www.albion-online-data.com/api/v2/stats/prices/{item_ids}?locations={cities}&qualities={quality}
GET https://www.albion-online-data.com/api/v2/stats/history/{item_ids}?locations={cities}&date={date}&end_date={end}&time-scale=24
```
- `item_ids`: comma-separated, e.g. `T4_2H_BOW,T4_2H_BOW@1`
- `locations`: `Bridgewatch`, `Lymhurst`, `Martlock`, `FortSterling`, `Thetford`, `Caerleon`, `Brecilien`
- `qualities`: 1–5 (Normal → Masterpiece)

Item IDs follow the pattern `T{tier}_{ARCHETYPE_ID}` or `T{tier}_{ARCHETYPE_ID}@{enchantment}` (e.g. `T6_2H_BOW@2`). The authoritative list of all item archetypes and their IDs is maintained at [ao-bin-dumps](https://github.com/broderickhyman/ao-bin-dumps) (`items.json`).

**Current state:** all pricing is **mocked** — the mock uses a deterministic hash (`noise()`) so prices are stable across reloads. When wiring up real data, replace `getResourcePrice`, `getItemPrices`, and `getPriceHistory` in `data.js`.

### Bilingual support

The `t(lang, key, vars)` function from `i18n.js` handles all UI strings. `lang` is either `'fr'` or `'en'`, persisted in `localStorage` under `aoo_lang`. All user-visible strings must go through `T(lang, key)` — never hardcode display text.

### Craft calculator logic (`app.jsx`)

The profit formula:
- `resCostEffective = rawResourceCost × (1 − returnRate)`
- `returnRate = cityBonus + 0.152` (without focus) or `cityBonus + focusBonus` (with focus)
- `stationFee = (nutritionPerItem(tier, ench) × stationTax) / 100`
- `profitPerItem = sellPrice × (1 − marketTaxRate) − resCostEffective − stationFee`
- `marketTaxRate` = 4.5% (no Premium) or 2.5% (Premium)
