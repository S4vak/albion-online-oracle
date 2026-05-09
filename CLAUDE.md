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

1. `static-data.js` → `window._aooStatic` (all static game data: CITIES, RESOURCES, TIER_NAME, ENCH_MULT, QUALITY_MULT, QUALITY_LABEL, RECIPES, ITEMS — ~310 item archetypes organized by Destiny Board branch)
2. `data.js` → `window.AlbionData` (pure API logic — destructures `window._aooStatic`, adds API client, pricing functions)
3. `i18n.js` → `window.i18n` (FR/EN translation function `t(lang, key, vars)`)
4. `tweaks-panel.jsx` → exposes `TweaksPanel`, `TweakSection`, `TweakSlider`, `TweakRadio`, etc. on `window`
5. `ui.jsx` → `window.AlbionUI` (`Glyph`, `HelpTooltip`, `FieldLabel`, `fmtSilver`, `fmtSilverFull`, `fmtPct`, `Coin`)
6. `app.jsx` → mounts the React app to `#root`

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

Item IDs follow the pattern `T{tier}_{ARCHETYPE_ID}` or `T{tier}_{ARCHETYPE_ID}@{enchantment}` (e.g. `T6_2H_BOW@2`).

> **Do not use [broderickhyman/ao-bin-dumps](https://github.com/broderickhyman/ao-bin-dumps)** — archived and outdated.

### Game data dump: ao-data/ao-bin-dumps

**[ao-data/ao-bin-dumps](https://github.com/ao-data/ao-bin-dumps)** is the active maintained successor (updated continuously, 131 stars). Use it for item IDs, names, and localization.

Key files (raw URLs for scripting):
```
https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.txt
  → compact list: "  N: T4_ITEM_ID : English Name" — 12 000+ items, use for ID discovery

https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/localization.json
  → TMX localization, 85MB — contains EN-US and FR-FR names for all items
  → Key pattern: @ITEMS_T4_{ITEM_ID} → tuv array with @xml:lang entries

https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/items.json
  → Full item data (16MB) with shop categories, crafting info, etc.
```

Workflow to add new items to `static-data.js`:
1. Scan `formatted/items.txt` for T4 equipment IDs not yet in `ITEMS`
2. Verify existence via `albion-online-data.com/api/v2/stats/prices/T4_{ID}?locations=...` (item exists if any city has `sell_price_min > 0`)
3. Fetch names from `localization.json` using key `@ITEMS_T4_{ID}` → EN-US + FR-FR
4. Strip tier prefix: EN → remove `"Adept's "`, FR → remove `" de l'adepte"` (but watch for variant apostrophes `'` vs `'` and capitalization like `"de l'Adepte"` — always verify manually)

**Pitfalls when parsing `localization.json`:**
- Individual `tuv` entries can be null — guard with `if (!tuv) continue` before accessing `tuv["@xml:lang"]`
- FR suffix has multiple forms: `" de l'adepte"`, `" de l'Adepte"`, `" de l'adepte"` — normalize before stripping
- After stripping, visually verify a sample — some names still carry fragments

**Syntax check after large edits:**
```bash
node --check static-data.js && node --check data.js
```

**Current state:** all pricing is live via the albion-online-data.com API. `getResourcePrice`, `getItemPrices`, and `getPriceHistory` in `data.js` make real HTTP calls with a 5-min in-memory cache.

**Item coverage:** all craftable equipment is in `static-data.js` (weapons, armor, off-hands, capes, bags, tools, gathering armor, consumables — ~310 entries), organized by Destiny Board branch: Guerrier / Chasseur / Assassin / Mage / Équipement commun / Artisan & Récolte / Consommables.

### Erreurs à éviter lors d'éditions larges

**Fermeture prématurée d'un tableau** : lors d'un remplacement multi-étapes du tableau `ITEMS`, il est possible d'insérer un `];` de clôture alors que des entrées orphelines subsistent en dessous. Symptôme : `SyntaxError: Unexpected token ':'` sur une ligne `{ id:'...'`. Diagnostic : `node --check static-data.js`.

**Vérifier les doublons après réorganisation** :
```js
// Compter les IDs dupliqués
const ids = [...content.matchAll(/id:'([^']+)'/g)].map(m=>m[1]);
const dupes = ids.filter((id,i) => ids.indexOf(id) !== i);
```

**Catégorie incorrecte pour les armes de chasseur** : lances (`SPEAR`), dagues (`DAGGER`) et poings (`KNUCKLES`) utilisent `category:'hunter_weapon'` (Lymhurst), PAS `plate_weapon`. Erreur facile à commettre lors d'un copier-coller depuis les épées.

### Décisions d'architecture

**Séparation `static-data.js` / `data.js`** : toutes les données statiques (CITIES, RESOURCES, TIER_NAME, ENCH_MULT, QUALITY_MULT, QUALITY_LABEL, RECIPES, ITEMS) sont dans `static-data.js`, exposé via `window._aooStatic`. `data.js` destructure ce global et ne contient que la logique API. Avantage : ajouter un item ou modifier une recette ne nécessite de lire que `static-data.js`.

**Groupe Destiny Board dans `app.jsx`** : `FAMILY_GROUPS` mappe les branches de l'arbre de compétence (`guerrier`, `chasseur`, `assassin`, `mage`, `accessory`, `gathering`, `consumable`) vers les `group` d'items. Modifier la taxonomie UI = éditer `FAMILY_GROUPS` et `FAMILY_LABELS` dans `app.jsx`.

**Bâtons magiques segmentés** : `weapon_staff` est scindé en 6 groupes spécifiques (`weapon_staff_fire`, `_frost`, `_arcane`, `_holy`, `_nature`, `_curse`) + `weapon_shapeshifter`. Ne pas regrouper sous `weapon_staff` générique.

### Item `category` → crafting city bonus

The `category` field determines which city gives a crafting bonus:

| category | city |
|---|---|
| `plate`, `plate_weapon` | Bridgewatch |
| `leather`, `hunter_weapon` | Lymhurst |
| `cloth_armor`, `magic_weapon` | Fort Sterling / Thetford |
| `offhand` | Martlock |
| `tool`, `bag`, `cape` | no city bonus |

### Item `group` taxonomy

Groups drive UI filtering. Established values:
- Weapons: `weapon_sword`, `weapon_axe`, `weapon_bow`, `weapon_hammer`, `weapon_spear`, `weapon_dagger`, `weapon_mace`, `weapon_quarterstaff`, `weapon_knuckles`, `weapon_staff_arcane`, `weapon_staff_fire`, `weapon_staff_frost`, `weapon_staff_holy`, `weapon_staff_nature`, `weapon_staff_curse`, `weapon_shapeshifter`
- Armor: `armor_plate`, `armor_leather`, `armor_cloth`, `gatherer_armor`
- Other: `offhand`, `cape`, `bag`, `tool`

### Adding a new `recipeKey`

If a new item needs a recipe type that doesn't exist yet, add the function to `RECIPES` in `static-data.js` **before** referencing it in any item entry — otherwise the app crashes at load with `RECIPES[item.recipeKey] is not a function`.

### Bilingual support

The `t(lang, key, vars)` function from `i18n.js` handles all UI strings. `lang` is either `'fr'` or `'en'`, persisted in `localStorage` under `aoo_lang`. All user-visible strings must go through `T(lang, key)` — never hardcode display text.

### Item display names (`data.js`)

`displayName(item, tier, lang)` builds the full localized name:
- If the item has a `tierNames[lang][tier]` entry, that exact string is returned (used for consumables whose name changes per tier, e.g. "Potion d'énergie majeure" at T6).
- Otherwise: FR → `"{base} {tier_suffix}"` (e.g. "Arc du maître"), EN → `"{tier_prefix} {base}"` (e.g. "Master's Bow").

Tier suffixes/prefixes live in `TIER_NAME` in `static-data.js`. French uses genitive forms (`du novice`, `de l'adepte`, `du sage`…); English uses possessives (`Novice's`, `Adept's`, `Elder's`…).

**Herb resources** (`res:'herb'` in recipes) map to tier-specific Albion plant IDs — not `T_FIBER`. The `resourceApiId` function uses a lookup table: T2=AGARIC, T3=COMFREY, T4=BURDOCK, T5=TEASEL, T6=FOXGLOVE, T7=MULLEIN, T8=YARROW.

### Craft calculator logic (`app.jsx`)

The profit formula:
- `resCostEffective = rawResourceCost × (1 − returnRate)`
- `returnRate = cityBonus + 0.152` (without focus) or `cityBonus + focusBonus` (with focus)
- `stationFee = (nutritionPerItem(tier, ench) × stationTax) / 100`
- `profitPerItem = sellPrice × (1 − marketTaxRate) − resCostEffective − stationFee`
- `marketTaxRate` = 4.5% (no Premium) or 2.5% (Premium)

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
