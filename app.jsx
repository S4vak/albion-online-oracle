/* Albion Oracle — Craft profit calculator (main app) */

const { useState, useEffect, useRef, useMemo, useCallback } = React;
const { Glyph, HelpTooltip, FieldLabel, fmtSilver, fmtSilverFull, fmtPct, Coin } = window.AlbionUI;
const { CITIES, ITEMS, RESOURCES, TIER_NAME, getItemPrices, getResourcePricesBatch, getPriceHistory, nutritionPerItem, expandedRecipe, ENCH_MULT, QUALITY_MULT, displayName } = window.AlbionData;
const { t: T, STR } = window.i18n;

/* ---------- Item Picker Modal ---------- */
const GROUP_LABELS = {
  fr: {
    weapon_sword: 'Épées', weapon_axe: 'Haches', weapon_hammer: 'Masses & Marteaux',
    weapon_dagger: 'Dagues', weapon_spear: 'Lances', weapon_bow: 'Arcs & Arbalètes',
    weapon_staff: 'Bâtons magiques', weapon_quarterstaff: 'Bâtons & Lances', weapon_knuckles: 'Poings & Gantelets',
    armor_plate: 'Armures de plates', armor_leather: 'Armures en cuir', armor_cloth: 'Armures en tissu',
    offhand: 'Mains secondaires', cape: 'Capes', bag: 'Sacs',
    gatherer_armor: 'Équipement de récolte', tool: 'Outils',
    potion: 'Potions', food: 'Nourriture',
  },
  en: {
    weapon_sword: 'Swords', weapon_axe: 'Axes', weapon_hammer: 'Maces & Hammers',
    weapon_dagger: 'Daggers', weapon_spear: 'Spears', weapon_bow: 'Bows & Crossbows',
    weapon_staff: 'Magic staves', weapon_quarterstaff: 'Quarterstaffs', weapon_knuckles: 'Knuckles & Gauntlets',
    armor_plate: 'Plate armor', armor_leather: 'Leather armor', armor_cloth: 'Cloth armor',
    offhand: 'Off-hands', cape: 'Capes', bag: 'Bags',
    gatherer_armor: 'Gatherer gear', tool: 'Tools',
    potion: 'Potions', food: 'Food',
  },
};
const GROUP_ORDER = [
  'weapon_sword','weapon_axe','weapon_hammer','weapon_dagger','weapon_spear','weapon_bow',
  'weapon_staff','weapon_quarterstaff','weapon_knuckles',
  'armor_plate','armor_leather','armor_cloth',
  'offhand','cape','bag',
  'gatherer_armor','tool',
  'potion','food',
];

const FAMILY_GROUPS = {
  weapon:     ['weapon_sword','weapon_axe','weapon_hammer','weapon_dagger','weapon_spear','weapon_bow','weapon_staff','weapon_quarterstaff','weapon_knuckles'],
  armor:      ['armor_plate','armor_leather','armor_cloth'],
  accessory:  ['offhand','cape','bag'],
  consumable: ['potion','food'],
  gathering:  ['gatherer_armor','tool'],
};
const FAMILY_LABELS = {
  fr: { weapon:'Armes', armor:'Armures', accessory:'Accessoires', consumable:'Consommables', gathering:'Récolte & Outils' },
  en: { weapon:'Weapons', armor:'Armor', accessory:'Accessories', consumable:'Consumables', gathering:'Gathering & Tools' },
};
const ALL_GROUPS = new Set(ITEMS.map(i => i.group));

// Gathering sub-categories by profession (armour + matching tool per resource type)
const GATHERING_SUBCATS = [
  { key:'g_ore',   fr:'Mineur',              en:'Mining',      match:(i) => i.id.includes('_GATHERER_ORE')   || i.id === '2H_TOOL_PICKAXE' },
  { key:'g_hide',  fr:'Chasseur de peaux',   en:'Skinning',    match:(i) => i.id.includes('_GATHERER_HIDE')  || i.id === '2H_TOOL_SKINNER' },
  { key:'g_wood',  fr:'Bûcheron',            en:'Logging',     match:(i) => i.id.includes('_GATHERER_WOOD')  || i.id === '2H_TOOL_AXE' },
  { key:'g_rock',  fr:'Carrier',             en:'Quarrying',   match:(i) => i.id.includes('_GATHERER_ROCK')  || i.id === '2H_TOOL_HAMMER' },
  { key:'g_fiber', fr:'Récolteur de fibres', en:'Harvesting',  match:(i) => i.id.includes('_GATHERER_FIBER') || i.id === '2H_TOOL_SICKLE' },
  { key:'g_fish',  fr:'Pêcheur',             en:'Fishing',     match:(i) => i.id.includes('_GATHERER_FISH')  || i.id === '2H_TOOL_FISHING' },
];
const GATHERING_SUBCAT_MAP = Object.fromEntries(GATHERING_SUBCATS.map(s => [s.key, s]));

function ItemPickerModal({ lang, current, onPick, onClose }) {
  const [search, setSearch] = useState('');
  const [family, setFamily] = useState(null);
  const [subcat, setSubcat] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const selectFamily = useCallback((fk) => {
    setFamily(fk);
    setSubcat(null);
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const profDef = GATHERING_SUBCAT_MAP[subcat];
    const activeGroups = !profDef && subcat ? [subcat] : (!profDef && family ? FAMILY_GROUPS[family] : null);
    return ITEMS.filter(i => {
      if (profDef) { if (!profDef.match(i)) return false; }
      else if (activeGroups && !activeGroups.includes(i.group)) return false;
      if (!s) return true;
      return (i.name[lang] || '').toLowerCase().includes(s) ||
             (i.name.en || '').toLowerCase().includes(s) ||
             i.id.toLowerCase().includes(s);
    });
  }, [search, lang, family, subcat]);

  const groups = useMemo(() => {
    const g = {};
    filtered.forEach(it => { (g[it.group] = g[it.group] || []).push(it); });
    Object.values(g).forEach(arr => arr.sort((a, b) => a.id.localeCompare(b.id)));
    return g;
  }, [filtered]);
  const orderedKeys = GROUP_ORDER.filter(k => groups[k] && groups[k].length);

  return (
    <div className="modal-shade" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="eyebrow">{lang === 'fr' ? 'Bibliothèque' : 'Library'}</div>
            <h2 className="display" style={{ fontSize: 22, margin: '4px 0 0' }}>{T(lang, 'item_picker')}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close"><Glyph name="cross" size={18} stroke={2} /></button>
        </div>
        <div className="modal-search">
          <span className="modal-search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21 L 16 16" /></svg>
          </span>
          <input
            ref={inputRef}
            className="input"
            placeholder={T(lang, 'item_search_ph')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="modal-filter">
          <div className="filter-row">
            <button className={'filter-pill' + (!family ? ' active' : '')} onClick={() => selectFamily(null)}>
              {lang === 'fr' ? 'Tout' : 'All'}
            </button>
            {Object.keys(FAMILY_GROUPS).map(fk => (
              <button key={fk} className={'filter-pill' + (family === fk ? ' active' : '')} onClick={() => selectFamily(fk)}>
                {FAMILY_LABELS[lang][fk]}
              </button>
            ))}
          </div>
          {family && (
            <div className="filter-row filter-row-sub">
              {family === 'gathering'
                ? GATHERING_SUBCATS.map(s => (
                    <button key={s.key} className={'filter-pill filter-pill-sm' + (subcat === s.key ? ' active' : '')}
                      onClick={() => setSubcat(subcat === s.key ? null : s.key)}>
                      {s[lang]}
                    </button>
                  ))
                : FAMILY_GROUPS[family].filter(g => ALL_GROUPS.has(g)).map(g => (
                    <button key={g} className={'filter-pill filter-pill-sm' + (subcat === g ? ' active' : '')}
                      onClick={() => setSubcat(subcat === g ? null : g)}>
                      {(GROUP_LABELS[lang] && GROUP_LABELS[lang][g]) || g}
                    </button>
                  ))
              }
            </div>
          )}
        </div>
        <div className="modal-body">
          {Object.keys(groups).length === 0 && (
            <div className="muted" style={{ textAlign: 'center', padding: 40 }}>{lang === 'fr' ? 'Aucun objet trouvé' : 'No item found'}</div>
          )}
          {orderedKeys.map(cat => (
            <div key={cat} className="modal-group">
              <div className="modal-group-title">{(GROUP_LABELS[lang] && GROUP_LABELS[lang][cat]) || cat}</div>
              <div className="modal-grid">
                {groups[cat].map(it => (
                  <button
                    key={it.id}
                    className={'pick-tile' + (current.id === it.id ? ' active' : '')}
                    onClick={() => { onPick(it); onClose(); }}
                  >
                    <div className="pick-icon">
                      <Glyph name={it.iconGlyph} size={36} stroke={1.4} />
                    </div>
                    <div className="pick-name">{it.name[lang]}</div>
                    <div className="pick-sub">T2 – T8</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="modal-foot muted">
          <kbd>Esc</kbd> {lang === 'fr' ? 'pour fermer' : 'to close'} · {filtered.length} {lang === 'fr' ? 'objets' : 'items'}
        </div>
      </div>
    </div>
  );
}

/* ---------- Item Picker (inline) ---------- */
function ItemPicker({ lang, item, setItem, tier, setTier, ench, setEnch, quality, setQuality, qty, setQty }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="item-picker">
      <button className="item-card item-card-button" onClick={() => setPickerOpen(true)} type="button">
        <div className="item-icon">
          <Glyph name={item.iconGlyph} size={48} />
          <div className="tier-badge">T{tier}</div>
        </div>
        <div style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
          <div className="eyebrow" style={{ fontSize: 10 }}>{T(lang, 'item_picker')}</div>
          <h3 className="item-name">{displayName(item, tier, lang)}</h3>
          <div className="item-meta">
            T{tier}.{ench} · {T(lang, 'quality_label')[quality]}
          </div>
          <div className="item-meta" style={{ marginTop: 6, fontStyle: 'normal' }}>
            {expandedRecipe(item, tier, ench).map((r, i) => (
              <span key={i} style={{ marginRight: 10 }}>
                <span className="num" style={{ color: 'var(--gold-deep)', fontWeight: 600 }}>{r.qty}×</span> {RESOURCES[r.res].tiers[r.tier][lang]}
              </span>
            ))}
          </div>
        </div>
        <div className="item-card-cta">
          <span className="cta-pill">{lang === 'fr' ? 'Changer' : 'Change'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6 L 15 12 L 9 18" /></svg>
        </div>
      </button>

      <div className="col gap-md">
        <div className="row gap-md" style={{ alignItems: 'flex-start' }}>
          <div className="field" style={{ flex: 1 }}>
            <FieldLabel>{T(lang, 'tier')}</FieldLabel>
            <div className="seg">
              {[2, 3, 4, 5, 6, 7, 8].map(n => (
                <button key={n} className={'seg-item' + (tier === n ? ' active' : '')} onClick={() => setTier(n)}>T{n}</button>
              ))}
            </div>
          </div>
          <div className="field">
            <FieldLabel>{T(lang, 'enchant')}</FieldLabel>
            <div className="seg">
              {[0, 1, 2, 3, 4].map(n => (
                <button key={n} className={'seg-item' + (ench === n ? ' active' : '')} onClick={() => setEnch(n)}>{T(lang, 'ench_label')[n]}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="row gap-md">
          <div className="field" style={{ flex: 1 }}>
            <FieldLabel>{T(lang, 'quality')}</FieldLabel>
            <div className="seg seg-quality">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} className={'seg-item' + (quality === n ? ' active' : '')} onClick={() => setQuality(n)}>
                  {T(lang, 'quality_label')[n]}
                </button>
              ))}
            </div>
          </div>
          <div className="field" style={{ width: 140 }}>
            <FieldLabel>{T(lang, 'quantity')}</FieldLabel>
            <input type="number" className="input num" min="1" max="9999" value={qty} onChange={(e) => setQty(Math.max(1, Math.min(9999, parseInt(e.target.value) || 1)))} />
          </div>
        </div>
      </div>

      {pickerOpen && (
        <ItemPickerModal
          lang={lang}
          current={item}
          onPick={(it) => { setItem(it); }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

/* ---------- City Picker ---------- */
function CityPicker({ lang, item, cityId, setCityId }) {
  return (
    <div className="cities">
      {CITIES.map(c => {
        const match = (c.bonuses[item.category] != null) || (c.bonuses.all != null);
        const bonusVal = c.bonuses[item.category] != null ? c.bonuses[item.category] : (c.bonuses.all || 0);
        return (
          <button key={c.id} className={'city' + (cityId === c.id ? ' active' : '')} onClick={() => setCityId(c.id)} title={c.desc[lang]}>
            <div className="city-row">
              <span className="city-emblem" style={{ color: c.tint }}>
                <Glyph name={c.biome} size={14} stroke={1.6} />
              </span>
              <span className="city-name">{c.name}</span>
            </div>
            <div className={'city-bonus' + (match && bonusVal > 0 ? ' match' : '')}>
              {match && bonusVal > 0 ? `+${Math.round(bonusVal * 100)}% ${T(lang, 'return_rate').toLowerCase()}` : T(lang, 'city_bonus_no')}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Resource prices table ---------- */
function ResourcesTable({ lang, item, tier, ench, cityId, prices, overrides, setOverride, resetOverride }) {
  const recipe = expandedRecipe(item, tier, ench);
  return (
    <table className="res-table">
      <thead>
        <tr>
          <th>{lang === 'fr' ? 'Ressource' : 'Resource'}</th>
          <th style={{ width: 70 }}>{T(lang, 'qty')}</th>
          <th style={{ width: 140, textAlign: 'right' }}>{lang === 'fr' ? 'Prix unitaire' : 'Unit price'}</th>
          <th style={{ width: 130, textAlign: 'right' }}>{lang === 'fr' ? 'Sous-total' : 'Subtotal'}</th>
          <th style={{ width: 160 }}>{T(lang, 'data_freshness')}</th>
        </tr>
      </thead>
      <tbody>
        {recipe.map((r, idx) => {
          const key = `${r.res}|${r.tier}|${r.ench}`;
          const market = prices[key] || { price: 0, ageMin: 0 };
          const overridden = overrides[key];
          const price = overridden != null ? overridden : market.price;
          const subtotal = price * r.qty;
          const resDef = RESOURCES[r.res];
          const tname = resDef.tiers[r.tier][lang];
          return (
            <tr key={idx}>
              <td>
                <div className="res-row-name">
                  <div className="res-icon"><Glyph name={resDef.family} size={20} stroke={1.4} /></div>
                  <div>
                    <div className="res-name-main">{tname}</div>
                    <div className="res-name-sub">T{r.tier}{r.ench > 0 ? '.' + r.ench : ''} · {resDef.name[lang]}</div>
                  </div>
                </div>
              </td>
              <td className="num">{r.qty}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                  <input
                    type="number"
                    className={'price-input' + (overridden != null ? ' overridden' : '')}
                    value={price}
                    onChange={(e) => setOverride(key, parseInt(e.target.value) || 0)}
                  />
                  <Coin />
                </div>
              </td>
              <td style={{ textAlign: 'right' }} className="num">{fmtSilverFull(subtotal)}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className={'freshness' + (market.ageMin == null ? ' stale' : market.ageMin > 120 ? ' old' : market.ageMin > 30 ? ' stale' : '')}>
                    <span className="dot"></span>
                    <span>{market.ageMin == null ? '…' : market.ageMin < 60 ? T(lang, 'ago_min', { n: market.ageMin }) : lang === 'fr' ? `il y a ${Math.round(market.ageMin / 60)}h` : `${Math.round(market.ageMin / 60)}h ago`}</span>
                  </span>
                  {overridden != null && (
                    <button className="reset-mini" onClick={() => resetOverride(key)} title={T(lang, 'resource_auto')}>
                      ↻
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ---------- Price history chart (SVG sparkline-ish) ---------- */
function PriceHistory({ lang, item, tier, ench, quality, cityId }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState([]);
  const [histLoading, setHistLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setHistLoading(true);
    getPriceHistory(item.id, tier, ench, quality, cityId, days).then(d => {
      if (active) { setData(d); setHistLoading(false); }
    }).catch(() => { if (active) { setData([]); setHistLoading(false); } });
    return () => { active = false; };
  }, [item.id, tier, ench, quality, cityId, days]);
  const W = 800, H = 220, PAD_L = 56, PAD_R = 18, PAD_T = 18, PAD_B = 32;

  if (histLoading) return <div className="chart-loading muted">{lang === 'fr' ? 'Chargement…' : 'Loading…'}</div>;
  if (!data.length) return null;
  const prices = data.map(d => d.price);
  const min = Math.min(...prices) * 0.96;
  const max = Math.max(...prices) * 1.04;
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

  const x = (i) => PAD_L + (i / (data.length - 1)) * (W - PAD_L - PAD_R);
  const y = (v) => PAD_T + (1 - (v - min) / (max - min)) * (H - PAD_T - PAD_B);

  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.price).toFixed(1)}`).join(' ');
  const fill = `${path} L ${x(data.length - 1).toFixed(1)} ${H - PAD_B} L ${x(0).toFixed(1)} ${H - PAD_B} Z`;

  // Y-axis ticks (4)
  const ticks = [];
  for (let i = 0; i <= 4; i++) {
    const v = min + (max - min) * (1 - i / 4);
    ticks.push({ y: PAD_T + (i / 4) * (H - PAD_T - PAD_B), v });
  }

  const today = data[data.length - 1].price;
  const start = data[0].price;
  const change = ((today - start) / start) * 100;

  return (
    <div className="chart-card">
      <div className="chart-head">
        <h3>{T(lang, 'history')}</h3>
        <div className="stat">{T(lang, 'avg')} <span className="v">{fmtSilverFull(avg)}</span> <Coin after /></div>
        <div className="stat">{lang === 'fr' ? 'Variation' : 'Change'} <span className="v" style={{ color: change >= 0 ? 'var(--moss)' : 'var(--crimson)' }}>{fmtPct(change)}</span></div>
        <div className="seg">
          {[7, 14, 30].map(d => (
            <button key={d} className={'seg-item' + (days === d ? ' active' : '')} onClick={() => setDays(d)}>{d}{lang === 'fr' ? 'j' : 'd'}</button>
          ))}
        </div>
      </div>
      <div className="chart">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="histfill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid */}
          {ticks.map((tk, i) => (
            <g key={i}>
              <line x1={PAD_L} x2={W - PAD_R} y1={tk.y} y2={tk.y} stroke="var(--paper-edge)" strokeDasharray={i === ticks.length - 1 ? '0' : '2 4'} strokeWidth="1" />
              <text x={PAD_L - 8} y={tk.y + 4} textAnchor="end" fontSize="11" fill="var(--ink-faint)" fontFamily="IBM Plex Sans">
                {fmtSilver(tk.v)}
              </text>
            </g>
          ))}
          {/* Avg line */}
          <line x1={PAD_L} x2={W - PAD_R} y1={y(avg)} y2={y(avg)} stroke="var(--crimson)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          <text x={W - PAD_R} y={y(avg) - 4} textAnchor="end" fontSize="10" fill="var(--crimson)" fontFamily="IBM Plex Sans">{T(lang, 'avg')} · {fmtSilverFull(avg)}</text>
          {/* Fill + line */}
          <path d={fill} fill="url(#histfill)" />
          <path d={path} fill="none" stroke="var(--gold-deep)" strokeWidth="2" strokeLinejoin="round" />
          {/* Last point */}
          <circle cx={x(data.length - 1)} cy={y(today)} r="4.5" fill="var(--gold-bright)" stroke="var(--gold-deep)" strokeWidth="1.5" />
          {/* X labels */}
          {[0, Math.floor(data.length / 2), data.length - 1].map((i) => (
            <text key={i} x={x(i)} y={H - PAD_B + 18} textAnchor="middle" fontSize="11" fill="var(--ink-faint)" fontFamily="IBM Plex Sans">
              {i === data.length - 1 ? (lang === 'fr' ? "auj." : 'today') : `${data[i].day}${lang === 'fr' ? 'j' : 'd'}`}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ---------- Main App ---------- */
function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('aoo_lang') || 'fr');
  const [theme, setTheme] = useState(() => localStorage.getItem('aoo_theme') || 'parchment');

  // Form state
  const [item, setItem] = useState(null);
  const [tier, setTier] = useState(6);
  const [ench, setEnch] = useState(0);
  const [quality, setQuality] = useState(1);
  const [qty, setQty] = useState(50);
  const [cityId, setCityId] = useState('lymhurst'); // bow → magic → no exact match, but Lymhurst has planks bonus
  const [useFocus, setUseFocus] = useState(false);
  const [focusBonus, setFocusBonus] = useState(0.467); // 46.7% extra return at full mastery
  const [stationTax, setStationTax] = useState(220);
  const [premium, setPremium] = useState(false);
  const [overrides, setOverrides] = useState({});
  const [sellOverride, setSellOverride] = useState(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aoo_theme', theme);
  }, [theme]);
  useEffect(() => { localStorage.setItem('aoo_lang', lang); }, [lang]);

  // When item changes, sync tier to its base tier (but allow change)
  // Note: we keep manual tier overrides; only auto-set on item swap.
  // Simpler: assume the item recipe is referenced at its declared tier; let user pick tier 2-8 of same family.
  // For prototype we keep it simple: tier of item is the recipe's primary tier. Recipe scales via expanded recipe.

  // Fetch resource market prices from real API
  const [resourcePrices, setResourcePrices] = useState({});
  const [resPricesLoading, setResPricesLoading] = useState(false);
  useEffect(() => {
    if (!item) { setResourcePrices({}); setResPricesLoading(false); return; }
    let active = true;
    setResPricesLoading(true);
    const recipe = expandedRecipe(item, tier, ench);
    getResourcePricesBatch(recipe, cityId).then(prices => {
      if (active) { setResourcePrices(prices); setResPricesLoading(false); }
    }).catch(() => { if (active) setResPricesLoading(false); });
    return () => { active = false; };
  }, [item?.id, tier, ench, cityId]);

  // Fetch item sell prices across cities from real API
  const [itemPrices, setItemPrices] = useState({});
  const [itemPricesLoading, setItemPricesLoading] = useState(false);
  useEffect(() => {
    if (!item) { setItemPrices({}); setItemPricesLoading(false); return; }
    let active = true;
    setItemPricesLoading(true);
    getItemPrices(item.id, tier, ench, quality).then(prices => {
      if (active) { setItemPrices(prices); setItemPricesLoading(false); }
    }).catch(() => { if (active) setItemPricesLoading(false); });
    return () => { active = false; };
  }, [item?.id, tier, ench, quality]);

  const sellMarket = itemPrices[cityId] || { price: 0, ageMin: null };
  const sellPrice = sellOverride != null ? sellOverride : sellMarket.price;

  // Reset sell override when item changes
  useEffect(() => { setSellOverride(null); }, [item?.id, tier, ench, quality, cityId]);
  // Reset resource overrides when item or city changes
  useEffect(() => { setOverrides({}); }, [item?.id, tier, ench, cityId]);

  const setOverride = (key, value) => setOverrides(prev => ({ ...prev, [key]: value }));
  const resetOverride = (key) => setOverrides(prev => { const n = { ...prev }; delete n[key]; return n; });

  // ---- Computations ----
  const city = CITIES.find(c => c.id === cityId);
  const cityBonus = item ? (city.bonuses[item.category] != null ? city.bonuses[item.category] : (city.bonuses.all || 0)) : 0;
  // Effective return rate: city bonus alone (15.2% base + city). Focus boosts to ~53% (36 + 24 with full focus).
  // We'll model: base return = 15.2%, +cityBonus, focus replaces base with cityBonus + focus value approximated.
  // Simpler model:
  //   without focus: returnRate = cityBonus + 0.152
  //   with focus:    returnRate = cityBonus + 0.367  (focus returns ~36.7% on top)
  const returnRate = useFocus ? Math.min(0.95, cityBonus + focusBonus) : Math.min(0.85, cityBonus + 0.152);

  const pricesLoading = resPricesLoading || itemPricesLoading;

  const recipe = item ? expandedRecipe(item, tier, ench) : [];
  const resCostRaw = recipe.reduce((acc, r) => {
    const key = `${r.res}|${r.tier}|${r.ench}`;
    const price = (overrides[key] != null) ? overrides[key] : (resourcePrices[key]?.price ?? 0);
    return acc + price * r.qty;
  }, 0);
  // Effective resource cost = raw * (1 - returnRate)
  const resCostEffective = resCostRaw * (1 - returnRate);

  // Station fee: nutrition × stationTax / 100
  const nutPerItem = nutritionPerItem(tier, ench);
  const stationFee = (nutPerItem * stationTax) / 100;

  // Per-item costs / revenues
  const costPerItem = resCostEffective + stationFee;
  const marketTaxRate = premium ? 0.025 : 0.045;
  const revenuePerItem = sellPrice * (1 - marketTaxRate);
  const profitPerItem = revenuePerItem - costPerItem;

  const totalCost = costPerItem * qty;
  const totalRevenue = revenuePerItem * qty;
  const totalProfit = profitPerItem * qty;
  const margin = sellPrice > 0 ? (profitPerItem / sellPrice) * 100 : 0;

  // Verdict
  let verdictKey = 'good';
  if (margin <= 0 || profitPerItem <= 0) verdictKey = 'loss';
  else if (margin < 5) verdictKey = 'marginal';
  else if (margin >= 18) verdictKey = 'great';

  // ---- Render ----
  return (
    <div className="app">
      <Header lang={lang} setLang={setLang} />
      <Hero lang={lang} />

      <div className="workspace">
        <div className="col gap-md">
          {/* Step 1 */}
          <div className="section">
            <div className="section-head">
              <div className="step-no">1</div>
              <h2>{T(lang, 'step1')}</h2>
              <span className="sub">{lang === 'fr' ? 'choisissez l\'objet, le tier et la qualité' : 'pick the item, tier, and quality'}</span>
            </div>
            <ItemPicker
              lang={lang} item={item} setItem={setItem}
              tier={tier} setTier={setTier}
              ench={ench} setEnch={setEnch}
              quality={quality} setQuality={setQuality}
              qty={qty} setQty={setQty}
            />
          </div>

          {/* Step 2 */}
          <div className="section">
            <div className="section-head">
              <div className="step-no">2</div>
              <h2>{T(lang, 'step2')}</h2>
              <span className="sub">{lang === 'fr' ? 'chaque ville a sa spécialité' : 'each city has its specialty'}</span>
            </div>
            <CityPicker lang={lang} item={item} cityId={cityId} setCityId={setCityId} />
            <div style={{ marginTop: 14, fontSize: 14, color: 'var(--ink-soft)', fontStyle: 'italic' }}>
              {city.desc[lang]}
            </div>

            <div className="row gap-lg" style={{ marginTop: 18, alignItems: 'flex-start' }}>
              <div className="field" style={{ minWidth: 200 }}>
                <FieldLabel help={T(lang, 'focus_help')}>{T(lang, 'focus')}</FieldLabel>
                <label className={'toggle' + (useFocus ? ' on' : '')} onClick={() => setUseFocus(f => !f)}>
                  <span className="toggle-track"><span className="toggle-knob"></span></span>
                  <span className="toggle-label">{useFocus ? (lang === 'fr' ? 'Activé' : 'On') : (lang === 'fr' ? 'Désactivé' : 'Off')}</span>
                </label>
              </div>
              <div className="field" style={{ flex: 1 }}>
                <FieldLabel help={T(lang, 'return_help')}>{T(lang, 'return_rate')}</FieldLabel>
                <div className="num" style={{ fontSize: 22, fontWeight: 600 }}>
                  {(returnRate * 100).toFixed(1)}<span style={{ fontSize: 14, color: 'var(--ink-faint)', marginLeft: 4 }}>%</span>
                </div>
                <div className="muted" style={{ marginTop: -2 }}>
                  {lang === 'fr' ? 'base 15,2%' : 'base 15.2%'} {cityBonus > 0 ? `+ ${(cityBonus * 100).toFixed(1)}% (${city.name})` : ''}{useFocus ? ` + ${lang === 'fr' ? 'focus' : 'focus'}` : ''}
                </div>
              </div>
              <div className="field" style={{ minWidth: 220 }}>
                <FieldLabel help={T(lang, 'station_tax_help')}>{T(lang, 'station_tax')}</FieldLabel>
                <div className="row gap-sm" style={{ alignItems: 'center' }}>
                  <input type="number" className="input num" min="0" step="10" value={stationTax} onChange={(e) => setStationTax(Math.max(0, parseInt(e.target.value) || 0))} style={{ width: 110 }} />
                  <span className="muted" style={{ fontSize: 12 }}>{T(lang, 'station_tax_unit')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="section">
            <div className="section-head">
              <div className="step-no">3</div>
              <h2>{T(lang, 'step3')}</h2>
              <span className="sub">{lang === 'fr' ? 'préremplis depuis l\'API · modifiable' : 'auto-filled from the API · editable'}</span>
            </div>
            <div style={{ marginBottom: 14 }} className="muted">
              {lang === 'fr'
                ? 'Survolez un prix pour le modifier. Les valeurs en doré sont vos saisies manuelles.'
                : 'Hover a price to edit it. Gold values are your manual entries.'}
            </div>
            {item && <ResourcesTable
              lang={lang} item={item} tier={tier} ench={ench} cityId={cityId}
              prices={resourcePrices} overrides={overrides}
              setOverride={setOverride} resetOverride={resetOverride}
            />}

            {item && <div className="divider"><Glyph name="fleur" size={18} /></div>}

            {item && <div className="sell-price-card">
              <div>
                <FieldLabel help={T(lang, 'sell_price_help')}>{T(lang, 'sell_price')} · {city.name}</FieldLabel>
                <div className="muted" style={{ marginTop: 4 }}>
                  {lang === 'fr' ? 'Prix actuel sur le marché' : 'Current market price'}{sellMarket.ageMin != null ? ` · ${sellMarket.ageMin < 60 ? T(lang, 'ago_min', { n: sellMarket.ageMin }) : (lang === 'fr' ? `il y a ${Math.round(sellMarket.ageMin / 60)}h` : `${Math.round(sellMarket.ageMin / 60)}h ago`)}` : ''}
                  {sellOverride != null && <button className="reset-mini" style={{ marginLeft: 8 }} onClick={() => setSellOverride(null)}>↻ {T(lang, 'resource_auto')}</button>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <input
                  type="number"
                  className={'sell-price-input num' + (sellOverride != null ? ' overridden' : '')}
                  value={sellPrice}
                  onChange={(e) => setSellOverride(parseInt(e.target.value) || 0)}
                />
                <Coin />
                <span className="silver-suffix">/ {T(lang, 'unit')}</span>
              </div>
            </div>}
          </div>

          {/* Step 4 */}
          <div className="section">
            <div className="section-head">
              <div className="step-no">4</div>
              <h2>{T(lang, 'step4')}</h2>
              <span className="sub">{lang === 'fr' ? 'tout ce qui vous coûte du silver' : 'every silver you spend'}</span>
            </div>
            <div className="row gap-lg" style={{ alignItems: 'flex-start' }}>
              <div className="field" style={{ flex: 1, minWidth: 200 }}>
                <FieldLabel help={T(lang, 'market_tax_help')}>{T(lang, 'market_tax')}</FieldLabel>
                <div className="num" style={{ fontSize: 22, fontWeight: 600 }}>
                  {(marketTaxRate * 100).toFixed(1)}<span style={{ fontSize: 14, color: 'var(--ink-faint)', marginLeft: 4 }}>%</span>
                </div>
                <div className="muted">{premium ? (lang === 'fr' ? 'Premium actif' : 'Premium active') : (lang === 'fr' ? 'Sans Premium' : 'No Premium')}</div>
              </div>
              <div className="field">
                <FieldLabel>{T(lang, 'premium')}</FieldLabel>
                <label className={'toggle' + (premium ? ' on' : '')} onClick={() => setPremium(p => !p)}>
                  <span className="toggle-track"><span className="toggle-knob"></span></span>
                  <span className="toggle-label">{premium ? (lang === 'fr' ? 'Activé' : 'On') : (lang === 'fr' ? 'Désactivé' : 'Off')}</span>
                </label>
              </div>
              <div className="field" style={{ flex: 1, minWidth: 220 }}>
                <FieldLabel>{lang === 'fr' ? 'Frais de station total' : 'Total station fee'}</FieldLabel>
                <div className="num" style={{ fontSize: 22, fontWeight: 600 }}>
                  {fmtSilverFull(stationFee * qty)} <Coin after />
                </div>
                <div className="muted">{nutPerItem} {lang === 'fr' ? 'nutrition / objet' : 'nutrition / item'}</div>
              </div>
            </div>
          </div>

          {/* History chart */}
          {item && <PriceHistory lang={lang} item={item} tier={tier} ench={ench} quality={quality} cityId={cityId} />}
        </div>

        {/* Right rail: results */}
        <div className="results-rail">
          {!item
            ? <div className="no-item-placeholder">
                <Glyph name="fleur-corner" size={48} stroke={1} />
                <p className="display" style={{ marginTop: 16, fontSize: 18 }}>{T(lang, 'no_data')}</p>
                <p className="muted" style={{ marginTop: 6 }}>{lang === 'fr' ? 'Sélectionnez un objet à l\'étape 1 pour démarrer le calcul.' : 'Select an item in step 1 to start the calculation.'}</p>
              </div>
            : <>
                <ResultCard
                  lang={lang}
                  totalProfit={totalProfit}
                  profitPerItem={profitPerItem}
                  margin={margin}
                  qty={qty}
                  totalCost={totalCost}
                  totalRevenue={totalRevenue}
                  verdictKey={verdictKey}
                  resCostEffective={resCostEffective}
                  stationFee={stationFee}
                  marketTaxAmount={sellPrice * marketTaxRate}
                  returnRate={returnRate}
                />
                <VolumeCard lang={lang} volume={sellMarket.volume} cityName={city.name} />
              </>
          }
        </div>
      </div>

      <Footer lang={lang} />

      <TweaksUI theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} stationTax={stationTax} setStationTax={setStationTax} focusBonus={focusBonus} setFocusBonus={setFocusBonus} />
    </div>
  );
}

/* ---------- Header ---------- */
function Header({ lang, setLang }) {
  const navItems = [
    { id: 'craft', label: T(lang, 'nav_craft'), active: true },
    { id: 'refining', label: T(lang, 'nav_refining'), badge: T(lang, 'soon') },
    { id: 'market', label: T(lang, 'nav_market'), badge: T(lang, 'soon') },
    { id: 'transport', label: T(lang, 'nav_transport'), badge: T(lang, 'soon') },
    { id: 'builds', label: T(lang, 'nav_builds'), badge: T(lang, 'soon') },
  ];
  return (
    <header className="header">
      <a className="brand" href="#">
        <div className="brand-seal">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3 L 19 7 L 19 13 C 19 17, 16 21, 12 22 C 8 21, 5 17, 5 13 L 5 7 Z" />
            <path d="M9 12 L 11 14 L 15 10" />
          </svg>
        </div>
        <div className="brand-words">
          <div className="display">{T(lang, 'brand_word')}</div>
          <div className="tag">{T(lang, 'brand_tag')}</div>
        </div>
      </a>

      <nav className="nav">
        {navItems.map(n => (
          <a key={n.id} className={'nav-item' + (n.active ? ' active' : '')} href="#" onClick={(e) => e.preventDefault()}>
            {n.label}
            {n.badge && <span className="badge">{n.badge}</span>}
          </a>
        ))}
      </nav>

      <div className="head-actions">
        <div className="lang-switch" role="group" aria-label="Language">
          <button className={lang === 'fr' ? 'active' : ''} onClick={() => setLang('fr')}>FR</button>
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
        </div>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero({ lang }) {
  return (
    <section className="hero">
      <div className="eyebrow">{T(lang, 'nav_craft')}</div>
      <h1>{T(lang, 'hero_title')}</h1>
      <p>{T(lang, 'hero_sub')}</p>
      <div className="hero-ornament">
        <Glyph name="fleur-corner" size={80} stroke={1.2} />
      </div>
    </section>
  );
}

/* ---------- Result Card ---------- */
function ResultCard({ lang, totalProfit, profitPerItem, margin, qty, totalCost, totalRevenue, verdictKey, resCostEffective, stationFee, marketTaxAmount, returnRate }) {
  const positive = totalProfit >= 0;
  const verdictIcon = { great: 'check', good: 'check', marginal: 'warn', loss: 'cross' }[verdictKey];

  // Breakdown — total values across qty
  const items = [
    { id: 'res', label: T(lang, 'cost_resources'), v: resCostEffective * qty, color: 'var(--royal)' },
    { id: 'sta', label: T(lang, 'cost_station'), v: stationFee * qty, color: 'var(--moss)' },
    { id: 'tax', label: T(lang, 'cost_market_tax'), v: marketTaxAmount * qty, color: 'var(--crimson)' },
  ];
  const total = items.reduce((a, b) => a + b.v, 0) + Math.max(totalProfit, 0);
  const profitItem = { id: 'profit', label: T(lang, 'net_profit'), v: Math.max(totalProfit, 0), color: 'var(--gold)' };
  const all = [...items, profitItem];

  return (
    <div className="result-card">
      <div className="result-head">
        <div className="eyebrow">{T(lang, 'results_title')} · {qty} {T(lang, 'pieces_crafted')}</div>
        <div className={'profit-num ' + (positive ? 'pos' : 'neg')}>
          <span className="sym">{positive ? '+' : '−'}</span>
          <span>{fmtSilverFull(Math.abs(totalProfit))}</span>
          <span className="sym" style={{ fontSize: 14 }}>silver</span>
        </div>
        <div className="profit-sub">
          {fmtSilverFull(profitPerItem)} <span className="muted">/ {T(lang, 'unit')}</span> · {T(lang, 'including_returns')} {(returnRate * 100).toFixed(0)}%
        </div>
      </div>

      <div className="profit-meta">
        <div className="pm-cell"><div className="num">{fmtPct(margin)}</div><div className="lbl">{T(lang, 'margin')}</div></div>
        <div className="pm-cell"><div className="num">{fmtSilver(totalCost)}</div><div className="lbl">{T(lang, 'total_cost')}</div></div>
        <div className="pm-cell"><div className="num">{fmtSilver(totalRevenue)}</div><div className="lbl">{T(lang, 'total_revenue')}</div></div>
      </div>

      <div className={'verdict ' + verdictKey}>
        <span className="verdict-icon"><Glyph name={verdictIcon} size={14} stroke={2.4} /></span>
        <div>
          <h4 className="verdict-title">{T(lang, 'verdict_' + verdictKey)}</h4>
          <div className="verdict-desc">{T(lang, 'verdict_' + verdictKey + '_d')}</div>
        </div>
      </div>

      <div className="breakdown">
        <div className="breakdown-title">{T(lang, 'breakdown')}</div>
        {all.map(it => {
          const pct = total > 0 ? (it.v / total) * 100 : 0;
          return (
            <div key={it.id} className="bd-row" style={{ display: 'block' }}>
              <div className="lbl">
                <span>{it.label}</span>
                <span className="v">{fmtSilverFull(it.v)} <span className="muted" style={{ fontSize: 11 }}>· {pct.toFixed(0)}%</span></span>
              </div>
              <div className="bd-bar">
                <div className="fill" style={{ width: pct + '%', background: it.color, opacity: it.id === 'profit' ? 1 : 0.7 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Volume ---------- */
function VolumeCard({ lang, volume, cityName }) {
  const level = volume > 200 ? 'high' : volume > 60 ? 'med' : 'low';
  const pct = Math.min(100, (volume / 350) * 100);
  return (
    <div className="volume-gauge">
      <Glyph name="fleur" size={20} stroke={1.4} />
      <div style={{ flex: 1 }}>
        <div className="volume-text" style={{ marginBottom: 4 }}>
          <span className="num">{volume}</span> {lang === 'fr' ? 'ventes / jour' : 'sales / day'} · {cityName}
        </div>
        <div className="volume-bar"><div className="v" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }} /></div>
        <div className="muted" style={{ marginTop: 4, fontSize: 12 }}>
          {T(lang, 'volume_' + level)}
        </div>
      </div>
    </div>
  );
}

/* ---------- Footer ---------- */
function Footer({ lang }) {
  return (
    <footer className="footer">
      <span>{T(lang, 'footer')}</span>
      <span className="src">{T(lang, 'sources')}: {T(lang, 'api_source')}</span>
    </footer>
  );
}

/* ---------- Tweaks ---------- */
function TweaksUI({ theme, setTheme, lang, setLang, stationTax, setStationTax, focusBonus, setFocusBonus }) {
  const { TweaksPanel, TweakSection, TweakRadio, TweakSlider } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label={lang === 'fr' ? 'Apparence' : 'Appearance'} />
      <TweakRadio
        label={lang === 'fr' ? 'Thème' : 'Theme'}
        value={theme}
        onChange={setTheme}
        options={[
          { value: 'parchment', label: lang === 'fr' ? 'Parch.' : 'Parch.' },
          { value: 'light', label: lang === 'fr' ? 'Clair' : 'Light' },
          { value: 'dark', label: lang === 'fr' ? 'Sombre' : 'Dark' },
        ]}
      />
      <TweakRadio
        label={lang === 'fr' ? 'Langue' : 'Language'}
        value={lang}
        onChange={setLang}
        options={[
          { value: 'fr', label: 'FR' },
          { value: 'en', label: 'EN' },
        ]}
      />
      <TweakSection label={lang === 'fr' ? 'Calculs' : 'Calc'} />
      <TweakSlider
        label={lang === 'fr' ? 'Taxe station' : 'Station tax'}
        value={stationTax} min={0} max={1500} step={10}
        onChange={setStationTax}
        unit=" / 100"
      />
      <TweakSlider
        label={lang === 'fr' ? 'Bonus Focus' : 'Focus bonus'}
        value={Math.round(focusBonus * 1000) / 10}
        min={0} max={75} step={0.5}
        onChange={(v) => setFocusBonus(v / 100)}
        unit="%"
      />
    </TweaksPanel>
  );
}

/* ---------- Mount ---------- */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
