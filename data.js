// Dynamic data layer — static game data lives in static-data.js.
// Exposes window.AlbionData consumed by app.jsx.

(function () {
  'use strict';

  const { CITIES, RESOURCES, TIER_NAME, ENCH_MULT, QUALITY_MULT, QUALITY_LABEL, RECIPES, ITEMS } = window._aooStatic;

  function getRecipe(itemOrId, tier) {
    const item = (typeof itemOrId === 'string') ? ITEMS.find(i => i.id === itemOrId) : itemOrId;
    if (!item) return [];
    return RECIPES[item.recipeKey](tier);
  }

  function albionId(item, tier, ench) {
    return `T${tier}_${item.id}` + (ench > 0 ? `@${ench}` : '');
  }

  function displayName(item, tier, lang) {
    if (item.tierNames?.[lang]?.[tier]) return item.tierNames[lang][tier];
    return lang === 'fr'
      ? `${item.name[lang]} ${TIER_NAME[lang][tier]}`
      : `${TIER_NAME[lang][tier]} ${item.name[lang]}`;
  }

  /* ---------- API client ---------- */
  const API_BASE = 'https://www.albion-online-data.com/api/v2';

  const CITY_API_NAME = {
    bridgewatch:  'Bridgewatch',
    lymhurst:     'Lymhurst',
    martlock:     'Martlock',
    fortsterling: 'Fort Sterling',
    thetford:     'Thetford',
    caerleon:     'Caerleon',
    brecilien:    'Brecilien',
  };
  const API_TO_CITY_ID = Object.fromEntries(Object.entries(CITY_API_NAME).map(([k, v]) => [v, k]));

  function resourceApiId(resKey, tier) {
    switch (resKey) {
      case 'planks':   return `T${tier}_PLANKS`;
      case 'metalbar': return `T${tier}_METALBAR`;
      case 'leather':  return `T${tier}_LEATHER`;
      case 'cloth':    return `T${tier}_CLOTH`;
      case 'herb': {
        const herbId = { 2:'AGARIC', 3:'COMFREY', 4:'BURDOCK', 5:'TEASEL', 6:'FOXGLOVE', 7:'MULLEIN', 8:'YARROW' };
        return `T${tier}_${herbId[tier] || 'BURDOCK'}`;
      }
      default: return null;
    }
  }

  /* -- Cache: 5-min TTL -- */
  const _cache = new Map();
  const CACHE_TTL = 5 * 60 * 1000;
  function _cacheGet(key) {
    const e = _cache.get(key);
    if (!e) return null;
    if (Date.now() - e.ts > CACHE_TTL) { _cache.delete(key); return null; }
    return e.data;
  }
  function _cacheSet(key, data) { _cache.set(key, { data, ts: Date.now() }); }

  async function _apiFetch(path) {
    const cached = _cacheGet(path);
    if (cached) return cached;
    const resp = await fetch(API_BASE + path);
    if (!resp.ok) throw new Error(`Albion API ${resp.status}`);
    const data = await resp.json();
    _cacheSet(path, data);
    return data;
  }

  function _ageMin(dateStr) {
    if (!dateStr) return null;
    return Math.max(0, Math.round((Date.now() - new Date(dateStr).getTime()) / 60000));
  }

  function _locParam(names) {
    return names.map(n => encodeURIComponent(n)).join(',');
  }

  /* ---------- Pricing (async) ---------- */

  async function getItemPrices(itemId, tier, ench, quality) {
    const id = `T${tier}_${itemId}${ench > 0 ? `@${ench}` : ''}`;
    const locs = _locParam(Object.values(CITY_API_NAME));
    const path = `/stats/prices/${id}?locations=${locs}&qualities=${quality}`;
    const rows = await _apiFetch(path);
    const out = {};
    for (const cid of Object.keys(CITY_API_NAME)) out[cid] = { price: 0, ageMin: null };
    for (const r of rows) {
      const cid = API_TO_CITY_ID[r.city];
      if (cid) out[cid] = { price: r.sell_price_min || 0, ageMin: _ageMin(r.sell_price_min_date) };
    }
    return out;
  }

  async function getResourcePricesBatch(recipeEntries, cityId) {
    const location = CITY_API_NAME[cityId];
    if (!location) return {};
    const out = {};
    for (const r of recipeEntries) out[`${r.res}|${r.tier}|${r.ench}`] = { price: 0, ageMin: null };

    const idMap = {};
    for (const r of recipeEntries) {
      const apiId = resourceApiId(r.res, r.tier);
      if (apiId) idMap[apiId] = `${r.res}|${r.tier}|${r.ench}`;
    }
    const ids = Object.keys(idMap);
    if (!ids.length) return out;

    const path = `/stats/prices/${ids.join(',')}?locations=${encodeURIComponent(location)}&qualities=1`;
    const rows = await _apiFetch(path);
    for (const r of rows) {
      if (r.city !== location) continue;
      const key = idMap[r.item_id];
      if (key) out[key] = { price: r.sell_price_min || 0, ageMin: _ageMin(r.sell_price_min_date) };
    }
    return out;
  }

  async function getResourcePrice(res, tier, cityId) {
    const location = CITY_API_NAME[cityId];
    const id = resourceApiId(res, tier);
    if (!id || !location) return { price: 0, ageMin: null };
    const path = `/stats/prices/${id}?locations=${encodeURIComponent(location)}&qualities=1`;
    const rows = await _apiFetch(path);
    const r = rows.find(x => x.city === location);
    return r ? { price: r.sell_price_min || 0, ageMin: _ageMin(r.sell_price_min_date) } : { price: 0, ageMin: null };
  }

  async function getPriceHistory(itemId, tier, ench, quality, cityId, days = 30) {
    const id = `T${tier}_${itemId}${ench > 0 ? `@${ench}` : ''}`;
    const location = CITY_API_NAME[cityId];
    if (!location) return [];
    const now = Date.now();
    const endDate   = new Date(now).toISOString().slice(0, 10);
    const startDate = new Date(now - days * 86400000).toISOString().slice(0, 10);
    const path = `/stats/history/${id}?locations=${encodeURIComponent(location)}&date=${startDate}&end_date=${endDate}&time-scale=24&qualities=${quality}`;
    const rows = await _apiFetch(path);
    const cityRow = rows.find(r => r.location === location);
    if (!cityRow || !cityRow.data || !cityRow.data.length) return [];
    const sorted = [...cityRow.data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return sorted.map(d => ({
      day: Math.round((now - new Date(d.timestamp).getTime()) / 86400000),
      price: d.avg_price || 0,
      volume: d.item_count || 0,
    }));
  }

  function nutritionPerItem(tier, ench) {
    return Math.pow(2, tier - 1) * (1 + ench * 2);
  }

  function expandedRecipe(item, tier, ench) {
    return getRecipe(item, tier).map(r => ({ ...r, ench }));
  }

  window.AlbionData = {
    CITIES, ITEMS, RESOURCES, TIER_NAME,
    ENCH_MULT, QUALITY_MULT, QUALITY_LABEL,
    getItemPrices, getResourcePrice, getResourcePricesBatch, getPriceHistory,
    nutritionPerItem, expandedRecipe,
    albionId, displayName, getRecipe,
  };
})();
