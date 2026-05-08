// Mock data for Albion Online craft calculator.
// Items are archetypes (tier-agnostic). Real Albion item IDs are derived as
// `T{tier}_{archetype.id}` or `T{tier}_{archetype.id}@{ench}` — same naming
// convention used by the albion-online-data API.

(function () {
  'use strict';

  /* ---------- Cities ---------- */
  const CITIES = [
    { id: 'bridgewatch', name: 'Bridgewatch', biome: 'desert', tint: '#c97a2a',
      bonuses: { plate: 0.36, plate_weapon: 0.36, stoneblock: 0.36 },
      desc: { fr: 'Cité du désert. Spécialiste des armures de plates et des armes de mêlée en métal.', en: 'Desert city. Plate armour and metal melee weapons specialist.' } },
    { id: 'lymhurst', name: 'Lymhurst', biome: 'forest', tint: '#5a8a3a',
      bonuses: { leather: 0.36, planks: 0.36, hunter_weapon: 0.20 },
      desc: { fr: 'Cité de la forêt. Spécialiste du cuir et des planches, légère bonification sur les armes de chasseur.', en: 'Forest city. Leather and planks specialist, slight bonus on hunter weapons.' } },
    { id: 'martlock', name: 'Martlock', biome: 'highlands', tint: '#4a6c8a',
      bonuses: { offhand: 0.36, hide: 0.36 },
      desc: { fr: 'Cité des Highlands. Spécialiste des objets de main secondaire et du tannage.', en: 'Highlands city. Off-hands and tanning specialist.' } },
    { id: 'fortsterling', name: 'Fort Sterling', biome: 'steppe', tint: '#b8b3a0',
      bonuses: { cloth_armor: 0.36, planks: 0.20 },
      desc: { fr: 'Cité des steppes. Spécialiste des armures en tissu.', en: 'Steppe city. Cloth armour specialist.' } },
    { id: 'thetford', name: 'Thetford', biome: 'swamp', tint: '#7d5aa8',
      bonuses: { magic_weapon: 0.36, cloth: 0.36 },
      desc: { fr: 'Cité des marais. Spécialiste des armes magiques et du tissage.', en: 'Swamp city. Magic weapons and cloth specialist.' } },
    { id: 'caerleon', name: 'Caerleon', biome: 'royal', tint: '#a83232',
      bonuses: { all: 0.117 },
      desc: { fr: 'Cité royale au cœur des terres noires. Petit bonus universel, fort volume de marché.', en: 'Royal city at the heart of the black zones. Small universal bonus, high market volume.' } },
    { id: 'brecilien', name: 'Brecilien', biome: 'mist', tint: '#3aa8a0',
      bonuses: { all: 0.25 },
      desc: { fr: 'Cité cachée des Brumes. Bonus universel le plus élevé, mais marché plus discret.', en: 'Hidden city in the Mists. Highest universal bonus, but a quieter market.' } },
  ];

  /* ---------- Resources ---------- */
  const RESOURCES = {
    planks:   { name: { fr: 'Planches', en: 'Planks' },     family: 'planks',
      tiers: { 2: { fr:'Planches de Bouleau', en:'Birch Planks'},
               3: { fr:'Planches de Châtaignier', en:'Chestnut Planks'},
               4: { fr:'Planches de Pin', en:'Pine Planks'},
               5: { fr:'Planches de Cèdre', en:'Cedar Planks'},
               6: { fr:'Planches de Chêne', en:'Bloodoak Planks'},
               7: { fr:'Planches d\'Écorcecendre', en:'Ashenbark Planks'},
               8: { fr:'Planches de Bois Blanc', en:'Whitewood Planks'} } },
    metalbar: { name: { fr: 'Lingots', en: 'Metal bars' },  family: 'metal',
      tiers: { 2: { fr:'Lingots d\'Étain', en:'Tin Bar'},
               3: { fr:'Lingots de Cuivre', en:'Bronze Bar'},
               4: { fr:'Lingots d\'Acier', en:'Steel Bar'},
               5: { fr:'Lingots de Titane', en:'Titanium Steel Bar'},
               6: { fr:'Lingots de Runite', en:'Runite Steel Bar'},
               7: { fr:'Lingots de Météorite', en:'Meteorite Steel Bar'},
               8: { fr:'Lingots d\'Adamantium', en:'Adamantium Steel Bar'} } },
    leather:  { name: { fr: 'Cuir', en: 'Leather' },        family: 'leather',
      tiers: { 2: { fr:'Cuir Brut', en:'Stiff Leather'},
               3: { fr:'Cuir Fin', en:'Thin Leather'},
               4: { fr:'Cuir Moyen', en:'Medium Leather'},
               5: { fr:'Cuir Lourd', en:'Heavy Leather'},
               6: { fr:'Cuir Robuste', en:'Robust Leather'},
               7: { fr:'Cuir Épais', en:'Thick Leather'},
               8: { fr:'Cuir Résilient', en:'Resilient Leather'} } },
    cloth:    { name: { fr: 'Tissu', en: 'Cloth' },         family: 'cloth',
      tiers: { 2: { fr:'Toile Simple', en:'Simple Cloth'},
               3: { fr:'Soie Légère', en:'Neat Cloth'},
               4: { fr:'Soie Tissée', en:'Fine Cloth'},
               5: { fr:'Soie d\'Araignée', en:'Ornate Cloth'},
               6: { fr:'Soie Sombre', en:'Lavish Cloth'},
               7: { fr:'Soie Royale', en:'Opulent Cloth'},
               8: { fr:'Soie Asmodéenne', en:'Baroque Cloth'} } },
    herb:     { name: { fr: 'Herbes', en: 'Herbs' },        family: 'herb',
      tiers: { 2: { fr:'Agaric', en:'Agaric'},
               3: { fr:'Burdock', en:'Burdock'},
               4: { fr:'Teasel', en:'Teasel'},
               5: { fr:'Foxglove', en:'Foxglove'},
               6: { fr:'Muellin', en:'Muellin'},
               7: { fr:'Comfrey', en:'Comfrey'},
               8: { fr:'Garlicroot', en:'Garlicroot'} } },
    farm:     { name: { fr: 'Produits agricoles', en: 'Farm products' }, family: 'farm',
      tiers: { 2: { fr:'Maïs', en:'Corn'},
               3: { fr:'Blé', en:'Wheat'},
               4: { fr:'Citrouille', en:'Pumpkin'},
               5: { fr:'Chou', en:'Cabbage'},
               6: { fr:'Pomme de terre', en:'Potato'},
               7: { fr:'Navet', en:'Turnip'},
               8: { fr:'Carotte', en:'Carrot'} } },
  };

  const TIER_NAME = {
    fr: { 2:'de Novice', 3:'de Compagnon', 4:'d\'Adepte', 5:'d\'Expert', 6:'de Maître', 7:'de Grand Maître', 8:'d\'Ancien' },
    en: { 2:"Novice's", 3:"Journeyman's", 4:"Adept's", 5:"Expert's", 6:"Master's", 7:"Grandmaster's", 8:"Elder's" },
  };

  const BASE_PRICE_RES = {
    planks:   { 2: 8,  3: 24, 4: 88,  5: 250, 6: 720, 7: 2100, 8: 6400 },
    metalbar: { 2: 10, 3: 30, 4: 110, 5: 320, 6: 920, 7: 2700, 8: 8200 },
    leather:  { 2: 9,  3: 26, 4: 95,  5: 280, 6: 800, 7: 2350, 8: 7100 },
    cloth:    { 2: 9,  3: 27, 4: 100, 5: 290, 6: 830, 7: 2450, 8: 7400 },
    herb:     { 2: 7,  3: 20, 4: 72,  5: 210, 6: 600, 7: 1750, 8: 5300 },
    farm:     { 2: 3,  3: 10, 4: 35,  5: 100, 6: 290, 7: 860,  8: 2600 },
  };

  const ENCH_MULT = { 0: 1, 1: 3.6, 2: 9.5, 3: 24, 4: 60 };
  const QUALITY_MULT = { 1: 1.0, 2: 1.2, 3: 1.5, 4: 2.0, 5: 3.0 };
  const QUALITY_LABEL = {
    fr: { 1: 'Normal', 2: 'Bon', 3: 'Remarquable', 4: 'Excellent', 5: 'Chef-d\'œuvre' },
    en: { 1: 'Normal', 2: 'Good', 3: 'Outstanding', 4: 'Excellent', 5: 'Masterpiece' },
  };

  const CITY_MOD = {
    bridgewatch:  { sell: 1.00, buy_res: 0.96 },
    lymhurst:     { sell: 0.98, buy_res: 1.02 },
    martlock:     { sell: 1.04, buy_res: 1.00 },
    fortsterling: { sell: 0.97, buy_res: 1.04 },
    thetford:     { sell: 1.01, buy_res: 1.05 },
    caerleon:     { sell: 1.10, buy_res: 1.08 },
    brecilien:    { sell: 0.95, buy_res: 0.92 },
  };

  /* ---------- Recipe helpers ---------- */
  // Standard recipes used by Albion items at item-tier T:
  //   1H weapon (one-resource):   8 × T
  //   2H weapon (one-resource):   16 × T + 8 × (T-1)        (or scaled fallback)
  //   1H weapon (mixed):          6 × A_T + 4 × B_(T-1)
  //   2H weapon (mixed):          12 × A_T + 8 × B_T
  //   Helmet/Boots (single):      8 × T
  //   Helmet/Boots (mixed):       6 × A_T + 2 × B_(T-1)
  //   Armor (single):             16 × T
  //   Armor (mixed):              12 × A_T + 4 × B_(T-1)
  //   Cape:                       8 × cloth_T + 8 × leather_(T-1)
  //   Shield:                     8 × metal_T + 8 × planks_(T-1)
  // These are simplified — real Albion has small variations per item but the
  // shapes are very close.
  const RECIPES = {
    bow_2h:           (T) => [ {res:'planks',   tier:T, qty:16}, {res:'planks',   tier:Math.max(2,T-1), qty:8} ],
    sword_1h:         (T) => [ {res:'metalbar', tier:T, qty:8} ],
    sword_2h:         (T) => [ {res:'metalbar', tier:T, qty:16}, {res:'metalbar', tier:Math.max(2,T-1), qty:8} ],
    dagger_1h:        (T) => [ {res:'metalbar', tier:T, qty:6}, {res:'leather',  tier:Math.max(2,T-1), qty:4} ],
    spear_2h:         (T) => [ {res:'metalbar', tier:T, qty:12}, {res:'planks',  tier:T, qty:8} ],
    staff_2h_metal:   (T) => [ {res:'metalbar', tier:T, qty:12}, {res:'cloth',   tier:T, qty:8} ],
    staff_2h_wood:    (T) => [ {res:'planks',   tier:T, qty:12}, {res:'cloth',   tier:T, qty:8} ],
    staff_1h_wood:    (T) => [ {res:'planks',   tier:T, qty:6}, {res:'cloth',    tier:Math.max(2,T-1), qty:4} ],
    plate_helm:       (T) => [ {res:'metalbar', tier:T, qty:6}, {res:'leather',  tier:Math.max(2,T-1), qty:2} ],
    plate_armor:      (T) => [ {res:'metalbar', tier:T, qty:12}, {res:'leather', tier:Math.max(2,T-1), qty:4} ],
    plate_boots:      (T) => [ {res:'metalbar', tier:T, qty:6}, {res:'leather',  tier:Math.max(2,T-1), qty:2} ],
    leather_helm:     (T) => [ {res:'leather', tier:T, qty:6}, {res:'cloth',     tier:Math.max(2,T-1), qty:2} ],
    leather_armor:    (T) => [ {res:'leather', tier:T, qty:12}, {res:'cloth',    tier:Math.max(2,T-1), qty:4} ],
    leather_boots:    (T) => [ {res:'leather', tier:T, qty:6}, {res:'cloth',     tier:Math.max(2,T-1), qty:2} ],
    cloth_helm:       (T) => [ {res:'cloth',   tier:T, qty:6}, {res:'leather',   tier:Math.max(2,T-1), qty:2} ],
    cloth_armor:      (T) => [ {res:'cloth',   tier:T, qty:12}, {res:'leather',  tier:Math.max(2,T-1), qty:4} ],
    cloth_boots:      (T) => [ {res:'cloth',   tier:T, qty:6}, {res:'leather',   tier:Math.max(2,T-1), qty:2} ],
    shield:           (T) => [ {res:'metalbar', tier:T, qty:8}, {res:'planks',   tier:Math.max(2,T-1), qty:8} ],
    tower_shield:     (T) => [ {res:'metalbar', tier:T, qty:12}, {res:'planks',  tier:Math.max(2,T-1), qty:8} ],
    torch:            (T) => [ {res:'planks',   tier:T, qty:6}, {res:'cloth',    tier:Math.max(2,T-1), qty:2} ],
    book:             (T) => [ {res:'cloth',    tier:T, qty:8}, {res:'leather',  tier:Math.max(2,T-1), qty:4} ],
    cape:             (T) => [ {res:'cloth',    tier:T, qty:8}, {res:'leather',  tier:Math.max(2,T-1), qty:8} ],
    dagger_2h:        (T) => [ {res:'metalbar', tier:T, qty:12}, {res:'leather',  tier:T, qty:8} ],
    quarterstaff_1h:  (T) => [ {res:'planks',   tier:T, qty:8} ],
    quarterstaff_2h:  (T) => [ {res:'planks',   tier:T, qty:16}, {res:'metalbar', tier:Math.max(2,T-1), qty:8} ],
    knuckles_1h:      (T) => [ {res:'metalbar', tier:T, qty:6},  {res:'leather',  tier:Math.max(2,T-1), qty:4} ],
    knuckles_2h:      (T) => [ {res:'metalbar', tier:T, qty:12}, {res:'leather',  tier:T, qty:8} ],
    orb:              (T) => [ {res:'cloth',    tier:T, qty:8},  {res:'leather',  tier:Math.max(2,T-1), qty:2} ],
    totem:            (T) => [ {res:'planks',   tier:T, qty:6},  {res:'cloth',    tier:Math.max(2,T-1), qty:2} ],
    horn:             (T) => [ {res:'leather',  tier:T, qty:8},  {res:'cloth',    tier:Math.max(2,T-1), qty:4} ],
    bag:              (T) => [ {res:'cloth',    tier:T, qty:8},  {res:'leather',  tier:Math.max(2,T-1), qty:4} ],
    potion:           (T) => [ {res:'herb',     tier:T, qty:8} ],
    food_simple:      (T) => [ {res:'farm',     tier:T, qty:8} ],
    food_complex:     (T) => [ {res:'farm',     tier:T, qty:12}, {res:'farm',    tier:Math.max(2,T-1), qty:4} ],
    food_meat:        (T) => [ {res:'farm',     tier:T, qty:8},  {res:'herb',    tier:Math.max(2,T-1), qty:2} ],
    tool_metal:       (T) => [ {res:'metalbar', tier:T, qty:12}, {res:'planks',  tier:T, qty:8} ],
    tool_wood:        (T) => [ {res:'planks',   tier:T, qty:12}, {res:'metalbar',tier:Math.max(2,T-1), qty:4} ],
  };

  /* ---------- Item archetypes ---------- */
  // category drives city-bonus matching:
  //   plate / plate_weapon → Bridgewatch
  //   leather / hunter_weapon → Lymhurst
  //   cloth_armor → Fort Sterling
  //   magic_weapon → Thetford
  //   offhand → Martlock
  const ITEMS = [
    // ── 2H Weapons ──
    { id:'2H_BOW',          name:{ fr:'Arc',                en:'Bow' },               group:'weapon_bow',   category:'hunter_weapon',  iconGlyph:'bow',    recipeKey:'bow_2h' },
    { id:'2H_LONGBOW',      name:{ fr:'Arc Long',           en:'Warbow' },            group:'weapon_bow',   category:'hunter_weapon',  iconGlyph:'bow',    recipeKey:'bow_2h' },
    { id:'2H_CROSSBOW',     name:{ fr:'Arbalète',           en:'Crossbow' },          group:'weapon_bow',   category:'hunter_weapon',  iconGlyph:'bow',    recipeKey:'bow_2h' },
    { id:'2H_AXE',          name:{ fr:'Hache à Deux Mains', en:'Greataxe' },          group:'weapon_axe',   category:'plate_weapon',   iconGlyph:'sword',  recipeKey:'sword_2h' },
    { id:'2H_HAMMER',       name:{ fr:'Marteau à Deux Mains', en:'Polehammer' },      group:'weapon_hammer',category:'plate_weapon',   iconGlyph:'sword',  recipeKey:'sword_2h' },
    { id:'2H_CLAYMORE',     name:{ fr:'Espadon',            en:'Claymore' },          group:'weapon_sword', category:'plate_weapon',   iconGlyph:'sword',  recipeKey:'sword_2h' },
    { id:'2H_SPEAR',        name:{ fr:'Pique',              en:'Pike' },              group:'weapon_spear', category:'plate_weapon',   iconGlyph:'sword',  recipeKey:'spear_2h' },
    { id:'2H_FIRESTAFF',    name:{ fr:'Grand Bâton de Feu', en:'Great Fire Staff' },  group:'weapon_staff', category:'magic_weapon',   iconGlyph:'staff',  recipeKey:'staff_2h_wood' },
    { id:'2H_FROSTSTAFF',   name:{ fr:'Grand Bâton de Givre', en:'Great Frost Staff' }, group:'weapon_staff', category:'magic_weapon', iconGlyph:'staff',  recipeKey:'staff_2h_wood' },
    { id:'2H_ARCANESTAFF',  name:{ fr:'Grand Bâton Arcanique', en:'Great Arcane Staff' }, group:'weapon_staff', category:'magic_weapon', iconGlyph:'staff', recipeKey:'staff_2h_wood' },
    { id:'2H_HOLYSTAFF',    name:{ fr:'Grand Bâton Sacré',  en:'Great Holy Staff' },  group:'weapon_staff', category:'magic_weapon',   iconGlyph:'staff',  recipeKey:'staff_2h_wood' },
    { id:'2H_NATURESTAFF',  name:{ fr:'Bâton Sauvage',      en:'Wild Staff' },        group:'weapon_staff', category:'magic_weapon',   iconGlyph:'staff',  recipeKey:'staff_2h_wood' },
    { id:'2H_CURSEDSTAFF',  name:{ fr:'Grand Bâton Maudit', en:'Great Cursed Staff' },group:'weapon_staff', category:'magic_weapon',   iconGlyph:'staff',  recipeKey:'staff_2h_wood' },

    // ── 1H Weapons ──
    { id:'MAIN_SWORD',      name:{ fr:'Épée à Une Main',    en:'Broadsword' },        group:'weapon_sword', category:'plate_weapon',   iconGlyph:'sword',  recipeKey:'sword_1h' },
    { id:'MAIN_AXE',        name:{ fr:'Hache à Une Main',   en:'Battleaxe' },         group:'weapon_axe',   category:'plate_weapon',   iconGlyph:'sword',  recipeKey:'sword_1h' },
    { id:'MAIN_MACE',       name:{ fr:'Masse',              en:'Mace' },              group:'weapon_hammer',category:'plate_weapon',   iconGlyph:'sword',  recipeKey:'sword_1h' },
    { id:'MAIN_HAMMER',     name:{ fr:'Marteau',            en:'Hammer' },            group:'weapon_hammer',category:'plate_weapon',   iconGlyph:'sword',  recipeKey:'sword_1h' },
    { id:'MAIN_DAGGER',     name:{ fr:'Dague',              en:'Dagger' },            group:'weapon_dagger',category:'plate_weapon',   iconGlyph:'sword',  recipeKey:'dagger_1h' },
    { id:'MAIN_FIRESTAFF',  name:{ fr:'Bâton de Feu',       en:'Fire Staff' },        group:'weapon_staff', category:'magic_weapon',   iconGlyph:'staff',  recipeKey:'staff_1h_wood' },
    { id:'MAIN_NATURESTAFF',name:{ fr:'Bâton de Nature',    en:'Nature Staff' },      group:'weapon_staff', category:'magic_weapon',   iconGlyph:'staff',  recipeKey:'staff_1h_wood' },
    { id:'MAIN_HOLYSTAFF',  name:{ fr:'Bâton Sacré',        en:'Holy Staff' },        group:'weapon_staff', category:'magic_weapon',   iconGlyph:'staff',  recipeKey:'staff_1h_wood' },

    // ── Armor — Plate ──
    { id:'HEAD_PLATE_SET1', name:{ fr:'Heaume de Soldat',   en:'Soldier Helmet' },    group:'armor_plate',  category:'plate',           iconGlyph:'helm',   recipeKey:'plate_helm' },
    { id:'ARMOR_PLATE_SET1',name:{ fr:'Armure de Soldat',   en:'Soldier Armor' },     group:'armor_plate',  category:'plate',           iconGlyph:'plate',  recipeKey:'plate_armor' },
    { id:'SHOES_PLATE_SET1',name:{ fr:'Bottes de Soldat',   en:'Soldier Boots' },     group:'armor_plate',  category:'plate',           iconGlyph:'boots',  recipeKey:'plate_boots' },
    { id:'HEAD_PLATE_SET2', name:{ fr:'Heaume de Chevalier',en:'Knight Helmet' },     group:'armor_plate',  category:'plate',           iconGlyph:'helm',   recipeKey:'plate_helm' },
    { id:'ARMOR_PLATE_SET2',name:{ fr:'Armure de Chevalier',en:'Knight Armor' },      group:'armor_plate',  category:'plate',           iconGlyph:'plate',  recipeKey:'plate_armor' },
    { id:'SHOES_PLATE_SET2',name:{ fr:'Bottes de Chevalier',en:'Knight Boots' },      group:'armor_plate',  category:'plate',           iconGlyph:'boots',  recipeKey:'plate_boots' },

    // ── Armor — Leather ──
    { id:'HEAD_LEATHER_SET1', name:{fr:'Capuche de Mercenaire', en:'Mercenary Hood' }, group:'armor_leather', category:'leather',        iconGlyph:'hood',   recipeKey:'leather_helm' },
    { id:'ARMOR_LEATHER_SET1',name:{fr:'Veste de Mercenaire', en:'Mercenary Jacket' }, group:'armor_leather', category:'leather',        iconGlyph:'jacket', recipeKey:'leather_armor' },
    { id:'SHOES_LEATHER_SET1',name:{fr:'Chaussures de Mercenaire', en:'Mercenary Shoes' }, group:'armor_leather', category:'leather',    iconGlyph:'boots',  recipeKey:'leather_boots' },
    { id:'HEAD_LEATHER_SET2', name:{fr:'Capuche de Chasseur', en:'Hunter Hood' },      group:'armor_leather', category:'leather',        iconGlyph:'hood',   recipeKey:'leather_helm' },
    { id:'ARMOR_LEATHER_SET2',name:{fr:'Veste de Chasseur',  en:'Hunter Jacket' },     group:'armor_leather', category:'leather',        iconGlyph:'jacket', recipeKey:'leather_armor' },
    { id:'SHOES_LEATHER_SET2',name:{fr:'Chaussures de Chasseur', en:'Hunter Shoes' },  group:'armor_leather', category:'leather',        iconGlyph:'boots',  recipeKey:'leather_boots' },

    // ── Armor — Cloth ──
    { id:'HEAD_CLOTH_SET1', name:{ fr:'Chaperon d\'Érudit', en:'Scholar Cowl' },      group:'armor_cloth',  category:'cloth_armor',     iconGlyph:'hood',   recipeKey:'cloth_helm' },
    { id:'ARMOR_CLOTH_SET1',name:{ fr:'Robe d\'Érudit',     en:'Scholar Robe' },      group:'armor_cloth',  category:'cloth_armor',     iconGlyph:'robe',   recipeKey:'cloth_armor' },
    { id:'SHOES_CLOTH_SET1',name:{ fr:'Sandales d\'Érudit', en:'Scholar Sandals' },   group:'armor_cloth',  category:'cloth_armor',     iconGlyph:'boots',  recipeKey:'cloth_boots' },
    { id:'HEAD_CLOTH_SET2', name:{ fr:'Capuche de Clerc',   en:'Cleric Cowl' },       group:'armor_cloth',  category:'cloth_armor',     iconGlyph:'hood',   recipeKey:'cloth_helm' },
    { id:'ARMOR_CLOTH_SET2',name:{ fr:'Robe de Clerc',      en:'Cleric Robe' },       group:'armor_cloth',  category:'cloth_armor',     iconGlyph:'robe',   recipeKey:'cloth_armor' },
    { id:'SHOES_CLOTH_SET2',name:{ fr:'Sandales de Clerc',  en:'Cleric Sandals' },    group:'armor_cloth',  category:'cloth_armor',     iconGlyph:'boots',  recipeKey:'cloth_boots' },

    // ── Off-hands ──
    { id:'OFF_SHIELD',      name:{ fr:'Bouclier',           en:'Shield' },            group:'offhand',      category:'offhand',         iconGlyph:'shield', recipeKey:'shield' },
    { id:'OFF_TOWERSHIELD', name:{ fr:'Bouclier-Tour',      en:'Tower Shield' },      group:'offhand',      category:'offhand',         iconGlyph:'shield', recipeKey:'tower_shield' },
    { id:'OFF_TORCH',       name:{ fr:'Torche',             en:'Torch' },             group:'offhand',      category:'offhand',         iconGlyph:'staff',  recipeKey:'torch' },
    { id:'OFF_BOOK',        name:{ fr:'Tome de Sorts',      en:'Tome of Spells' },    group:'offhand',      category:'offhand',         iconGlyph:'robe',   recipeKey:'book' },

    // ── Capes ──
    { id:'CAPE',            name:{ fr:'Cape Standard',      en:'Cape' },              group:'cape',         category:'cloth_armor',     iconGlyph:'cape',   recipeKey:'cape' },

    // ── Extra Swords ──
    { id:'2H_DUALSWORD',    name:{ fr:'Épées Doubles',      en:'Dual Swords' },       group:'weapon_sword', category:'plate_weapon',   iconGlyph:'sword',  recipeKey:'sword_2h' },

    // ── Extra Axes ──
    { id:'2H_HALBERD',      name:{ fr:'Hallebarde',         en:'Halberd' },           group:'weapon_axe',   category:'plate_weapon',   iconGlyph:'sword',  recipeKey:'sword_2h' },
    { id:'2H_SCYTHE',       name:{ fr:'Faux de Guerre',     en:'Scythe' },            group:'weapon_axe',   category:'plate_weapon',   iconGlyph:'sword',  recipeKey:'sword_2h' },

    // ── Extra Hammers ──
    { id:'2H_FLAIL',        name:{ fr:'Fléau',              en:'Flail' },             group:'weapon_hammer',category:'plate_weapon',   iconGlyph:'sword',  recipeKey:'sword_2h' },

    // ── Extra Daggers ──
    { id:'2H_DAGGERPAIR',   name:{ fr:'Doubles Dagues',     en:'Dual Daggers' },      group:'weapon_dagger',category:'plate_weapon',   iconGlyph:'dagger_pair', recipeKey:'dagger_2h' },
    { id:'2H_CLAWPAIR',     name:{ fr:'Griffes',            en:'Claws' },             group:'weapon_dagger',category:'plate_weapon',   iconGlyph:'dagger_pair', recipeKey:'dagger_2h' },

    // ── Extra Spears ──
    { id:'MAIN_SPEAR',      name:{ fr:'Lance',              en:'Spear' },             group:'weapon_spear', category:'plate_weapon',   iconGlyph:'spear',  recipeKey:'sword_1h' },
    { id:'2H_GLAIVE',       name:{ fr:'Glaive',             en:'Glaive' },            group:'weapon_spear', category:'plate_weapon',   iconGlyph:'spear',  recipeKey:'spear_2h' },

    // ── Extra Bows ──
    { id:'2H_CROSSBOWLARGE',name:{ fr:'Arbalète Lourde',    en:'Heavy Crossbow' },    group:'weapon_bow',   category:'hunter_weapon',  iconGlyph:'bow',    recipeKey:'bow_2h' },

    // ── Missing 1H Magic Staves ──
    { id:'MAIN_ARCANESTAFF',name:{ fr:'Bâton Arcanique',    en:'Arcane Staff' },      group:'weapon_staff', category:'magic_weapon',   iconGlyph:'staff',  recipeKey:'staff_1h_wood' },
    { id:'MAIN_FROSTSTAFF', name:{ fr:'Bâton de Givre',     en:'Frost Staff' },       group:'weapon_staff', category:'magic_weapon',   iconGlyph:'staff',  recipeKey:'staff_1h_wood' },
    { id:'MAIN_CURSEDSTAFF',name:{ fr:'Bâton Maudit',       en:'Cursed Staff' },      group:'weapon_staff', category:'magic_weapon',   iconGlyph:'staff',  recipeKey:'staff_1h_wood' },

    // ── Quarterstaffs ──
    { id:'MAIN_QUARTERSTAFF',     name:{ fr:'Bâton',                   en:'Quarterstaff' },         group:'weapon_quarterstaff', category:'hunter_weapon', iconGlyph:'staff', recipeKey:'quarterstaff_1h' },
    { id:'2H_QUARTERSTAFF',       name:{ fr:'Bâton Cerclé de Fer',     en:'Iron-clad Staff' },      group:'weapon_quarterstaff', category:'hunter_weapon', iconGlyph:'staff', recipeKey:'quarterstaff_2h' },
    { id:'2H_DOUBLEBLADEDSTAFF',  name:{ fr:'Bâton à Double Lame',     en:'Double Bladed Staff' },  group:'weapon_quarterstaff', category:'hunter_weapon', iconGlyph:'staff', recipeKey:'staff_2h_wood' },

    // ── Knuckles ──
    { id:'MAIN_KNUCKLES',   name:{ fr:'Poings de Fer',      en:'Knuckles' },          group:'weapon_knuckles', category:'plate_weapon',  iconGlyph:'knuckles', recipeKey:'knuckles_1h' },
    { id:'2H_KNUCKLES',     name:{ fr:'Gantelets de Combat',en:'Gauntlets' },         group:'weapon_knuckles', category:'plate_weapon',  iconGlyph:'knuckles', recipeKey:'knuckles_2h' },

    // ── Armor — Plate SET3 ──
    { id:'HEAD_PLATE_SET3', name:{ fr:'Heaume du Gardien',  en:'Guardian Helmet' },   group:'armor_plate',  category:'plate',           iconGlyph:'helm',   recipeKey:'plate_helm' },
    { id:'ARMOR_PLATE_SET3',name:{ fr:'Armure du Gardien',  en:'Guardian Armor' },    group:'armor_plate',  category:'plate',           iconGlyph:'plate',  recipeKey:'plate_armor' },
    { id:'SHOES_PLATE_SET3',name:{ fr:'Bottes du Gardien',  en:'Guardian Boots' },    group:'armor_plate',  category:'plate',           iconGlyph:'boots',  recipeKey:'plate_boots' },

    // ── Armor — Leather SET3 ──
    { id:'HEAD_LEATHER_SET3', name:{ fr:'Capuche du Ranger', en:'Ranger Hood' },      group:'armor_leather', category:'leather',        iconGlyph:'hood',   recipeKey:'leather_helm' },
    { id:'ARMOR_LEATHER_SET3',name:{ fr:'Veste du Ranger',   en:'Ranger Jacket' },    group:'armor_leather', category:'leather',        iconGlyph:'jacket', recipeKey:'leather_armor' },
    { id:'SHOES_LEATHER_SET3',name:{ fr:'Chaussures du Ranger', en:'Ranger Shoes' },  group:'armor_leather', category:'leather',        iconGlyph:'boots',  recipeKey:'leather_boots' },

    // ── Armor — Cloth SET3 ──
    { id:'HEAD_CLOTH_SET3', name:{ fr:'Capuche du Mage',    en:'Mage Cowl' },         group:'armor_cloth',  category:'cloth_armor',     iconGlyph:'hood',   recipeKey:'cloth_helm' },
    { id:'ARMOR_CLOTH_SET3',name:{ fr:'Robe du Mage',       en:'Mage Robe' },         group:'armor_cloth',  category:'cloth_armor',     iconGlyph:'robe',   recipeKey:'cloth_armor' },
    { id:'SHOES_CLOTH_SET3',name:{ fr:'Sandales du Mage',   en:'Mage Sandals' },      group:'armor_cloth',  category:'cloth_armor',     iconGlyph:'boots',  recipeKey:'cloth_boots' },

    // ── Extra Off-hands ──
    { id:'OFF_ORB',         name:{ fr:'Orbe Arcanique',     en:'Arcane Orb' },        group:'offhand',      category:'offhand',         iconGlyph:'orb',    recipeKey:'orb' },
    { id:'OFF_TOTEM',       name:{ fr:'Totem',              en:'Totem' },             group:'offhand',      category:'offhand',         iconGlyph:'totem',  recipeKey:'totem' },
    { id:'OFF_HORN',        name:{ fr:'Cor du Chasseur',    en:"Hunter's Horn" },     group:'offhand',      category:'offhand',         iconGlyph:'horn',   recipeKey:'horn' },

    // ── Bags ──
    { id:'BAG',             name:{ fr:'Sac',                en:'Bag' },               group:'bag',          category:'bag',             iconGlyph:'bag',    recipeKey:'bag' },

    // ── Potions ──
    { id:'POTION_HEAL',               name:{ fr:'Potion de Soin',             en:'Healing Potion' },         group:'potion', category:'consumable', iconGlyph:'potion', recipeKey:'potion' },
    { id:'POTION_ENERGY',             name:{ fr:'Potion d\'Énergie',          en:'Energy Potion' },          group:'potion', category:'consumable', iconGlyph:'potion', recipeKey:'potion' },
    { id:'POTION_PURITY',             name:{ fr:'Potion de Purification',     en:'Cleansing Potion' },       group:'potion', category:'consumable', iconGlyph:'potion', recipeKey:'potion' },
    { id:'POTION_RESISTANCE_FIRE',    name:{ fr:'Résistance au Feu',          en:'Fire Resistance Potion' }, group:'potion', category:'consumable', iconGlyph:'potion', recipeKey:'potion' },
    { id:'POTION_RESISTANCE_POISON',  name:{ fr:'Résistance au Poison',       en:'Poison Resistance Potion' },group:'potion',category:'consumable', iconGlyph:'potion', recipeKey:'potion' },
    { id:'POTION_RESISTANCE_NORMAL',  name:{ fr:'Résistance Physique',        en:'Physical Resistance Potion' },group:'potion',category:'consumable',iconGlyph:'potion',recipeKey:'potion' },
    { id:'POTION_INVISIBILITY',       name:{ fr:'Potion d\'Invisibilité',     en:'Invisibility Potion' },    group:'potion', category:'consumable', iconGlyph:'potion', recipeKey:'potion' },

    // ── Food ──
    { id:'BREAD',           name:{ fr:'Pain',               en:'Bread' },                  group:'food', category:'consumable', iconGlyph:'food', recipeKey:'food_simple' },
    { id:'MEAL_SOUP',       name:{ fr:'Soupe',              en:'Soup' },                   group:'food', category:'consumable', iconGlyph:'food', recipeKey:'food_simple' },
    { id:'MEAL_SALAD',      name:{ fr:'Salade',             en:'Salad' },                  group:'food', category:'consumable', iconGlyph:'food', recipeKey:'food_simple' },
    { id:'MEAL_STEW',       name:{ fr:'Ragoût',             en:'Stew' },                   group:'food', category:'consumable', iconGlyph:'food', recipeKey:'food_complex' },
    { id:'GOOSE_PIE',       name:{ fr:'Tourte à l\'Oie',    en:'Goose Pie' },              group:'food', category:'consumable', iconGlyph:'food', recipeKey:'food_complex' },
    { id:'BEEF_STEW',       name:{ fr:'Bœuf Bourguignon',   en:'Beef Stew' },              group:'food', category:'consumable', iconGlyph:'food', recipeKey:'food_complex' },
    { id:'PORK_OMELETTE',   name:{ fr:'Omelette au Porc',   en:'Pork Omelette' },          group:'food', category:'consumable', iconGlyph:'food', recipeKey:'food_meat' },
    { id:'ROAST_GOOSE',     name:{ fr:'Rôti d\'Oie',        en:'Roast Goose' },            group:'food', category:'consumable', iconGlyph:'food', recipeKey:'food_meat' },

    // ── Gatherer Armor — Fiber ──
    { id:'HEAD_GATHERER_FIBER',   name:{ fr:'Capuche du Récolteur de Fibres',  en:'Fiber Gatherer Hood' },    group:'gatherer_armor', category:'leather', iconGlyph:'hood',   recipeKey:'leather_helm' },
    { id:'ARMOR_GATHERER_FIBER',  name:{ fr:'Veste du Récolteur de Fibres',    en:'Fiber Gatherer Garb' },    group:'gatherer_armor', category:'leather', iconGlyph:'jacket', recipeKey:'leather_armor' },
    { id:'SHOES_GATHERER_FIBER',  name:{ fr:'Chaussures Récolteur de Fibres',  en:'Fiber Gatherer Workboots' },group:'gatherer_armor',category:'leather', iconGlyph:'boots',  recipeKey:'leather_boots' },
    { id:'BAG_GATHERER_FIBER',    name:{ fr:'Sac du Récolteur de Fibres',      en:'Fiber Gatherer Backpack' }, group:'gatherer_armor', category:'bag',     iconGlyph:'bag',    recipeKey:'bag' },

    // ── Gatherer Armor — Hide ──
    { id:'HEAD_GATHERER_HIDE',    name:{ fr:'Capuche du Chasseur de Peaux',  en:'Hide Gatherer Hood' },       group:'gatherer_armor', category:'leather', iconGlyph:'hood',   recipeKey:'leather_helm' },
    { id:'ARMOR_GATHERER_HIDE',   name:{ fr:'Veste du Chasseur de Peaux',    en:'Hide Gatherer Garb' },       group:'gatherer_armor', category:'leather', iconGlyph:'jacket', recipeKey:'leather_armor' },
    { id:'SHOES_GATHERER_HIDE',   name:{ fr:'Chaussures Chasseur de Peaux',  en:'Hide Gatherer Workboots' },  group:'gatherer_armor', category:'leather', iconGlyph:'boots',  recipeKey:'leather_boots' },
    { id:'BAG_GATHERER_HIDE',     name:{ fr:'Sac du Chasseur de Peaux',      en:'Hide Gatherer Backpack' },   group:'gatherer_armor', category:'bag',     iconGlyph:'bag',    recipeKey:'bag' },

    // ── Gatherer Armor — Ore ──
    { id:'HEAD_GATHERER_ORE',     name:{ fr:'Casque du Mineur',      en:'Ore Gatherer Hood' },    group:'gatherer_armor', category:'plate', iconGlyph:'helm',   recipeKey:'plate_helm' },
    { id:'ARMOR_GATHERER_ORE',    name:{ fr:'Armure du Mineur',      en:'Ore Gatherer Garb' },    group:'gatherer_armor', category:'plate', iconGlyph:'plate',  recipeKey:'plate_armor' },
    { id:'SHOES_GATHERER_ORE',    name:{ fr:'Bottes du Mineur',      en:'Ore Gatherer Workboots' },group:'gatherer_armor',category:'plate', iconGlyph:'boots',  recipeKey:'plate_boots' },
    { id:'BAG_GATHERER_ORE',      name:{ fr:'Sac du Mineur',         en:'Ore Gatherer Backpack' }, group:'gatherer_armor', category:'bag',  iconGlyph:'bag',    recipeKey:'bag' },

    // ── Gatherer Armor — Rock ──
    { id:'HEAD_GATHERER_ROCK',    name:{ fr:'Casque du Carrier',     en:'Rock Gatherer Hood' },   group:'gatherer_armor', category:'plate', iconGlyph:'helm',   recipeKey:'plate_helm' },
    { id:'ARMOR_GATHERER_ROCK',   name:{ fr:'Armure du Carrier',     en:'Rock Gatherer Garb' },   group:'gatherer_armor', category:'plate', iconGlyph:'plate',  recipeKey:'plate_armor' },
    { id:'SHOES_GATHERER_ROCK',   name:{ fr:'Bottes du Carrier',     en:'Rock Gatherer Workboots' },group:'gatherer_armor',category:'plate',iconGlyph:'boots',  recipeKey:'plate_boots' },
    { id:'BAG_GATHERER_ROCK',     name:{ fr:'Sac du Carrier',        en:'Rock Gatherer Backpack' },group:'gatherer_armor', category:'bag',  iconGlyph:'bag',    recipeKey:'bag' },

    // ── Gatherer Armor — Wood ──
    { id:'HEAD_GATHERER_WOOD',    name:{ fr:'Capuche du Bûcheron',   en:'Wood Gatherer Hood' },   group:'gatherer_armor', category:'leather', iconGlyph:'hood',   recipeKey:'leather_helm' },
    { id:'ARMOR_GATHERER_WOOD',   name:{ fr:'Veste du Bûcheron',     en:'Wood Gatherer Garb' },   group:'gatherer_armor', category:'leather', iconGlyph:'jacket', recipeKey:'leather_armor' },
    { id:'SHOES_GATHERER_WOOD',   name:{ fr:'Chaussures du Bûcheron',en:'Wood Gatherer Workboots' },group:'gatherer_armor',category:'leather',iconGlyph:'boots', recipeKey:'leather_boots' },
    { id:'BAG_GATHERER_WOOD',     name:{ fr:'Sac du Bûcheron',       en:'Wood Gatherer Backpack' },group:'gatherer_armor', category:'bag',   iconGlyph:'bag',    recipeKey:'bag' },

    // ── Gatherer Armor — Fish ──
    { id:'HEAD_GATHERER_FISH',    name:{ fr:'Chapeau du Pêcheur',    en:'Fisher Hood' },          group:'gatherer_armor', category:'leather', iconGlyph:'hood',   recipeKey:'leather_helm' },
    { id:'ARMOR_GATHERER_FISH',   name:{ fr:'Veste du Pêcheur',      en:'Fisher Garb' },          group:'gatherer_armor', category:'leather', iconGlyph:'jacket', recipeKey:'leather_armor' },
    { id:'SHOES_GATHERER_FISH',   name:{ fr:'Chaussures du Pêcheur', en:'Fisher Workboots' },     group:'gatherer_armor', category:'leather', iconGlyph:'boots',  recipeKey:'leather_boots' },
    { id:'BAG_GATHERER_FISH',     name:{ fr:'Sac du Pêcheur',        en:'Fisher Backpack' },      group:'gatherer_armor', category:'bag',     iconGlyph:'bag',    recipeKey:'bag' },

    // ── Tools ──
    { id:'2H_TOOL_PICKAXE',  name:{ fr:'Pioche',          en:'Pickaxe' },          group:'tool', category:'tool', iconGlyph:'tool', recipeKey:'tool_metal' },
    { id:'2H_TOOL_SICKLE',   name:{ fr:'Faucille',        en:'Sickle' },           group:'tool', category:'tool', iconGlyph:'tool', recipeKey:'tool_metal' },
    { id:'2H_TOOL_FISHING',  name:{ fr:'Canne à Pêche',   en:'Fishing Rod' },      group:'tool', category:'tool', iconGlyph:'tool', recipeKey:'tool_wood' },
  ];

  function getRecipe(itemOrId, tier) {
    const item = (typeof itemOrId === 'string') ? ITEMS.find(i => i.id === itemOrId) : itemOrId;
    if (!item) return [];
    return RECIPES[item.recipeKey](tier);
  }

  // Full Albion ID for the API.
  function albionId(item, tier, ench) {
    return `T${tier}_${item.id}` + (ench > 0 ? `@${ench}` : '');
  }

  // Localized display name.
  function displayName(item, tier, lang) {
    return `${TIER_NAME[lang][tier]} ${item.name[lang]}`;
  }

  /* ---------- Pricing ---------- */
  function hash(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h;
  }
  function noise(seed, range) {
    const n = (hash(seed) % 1000) / 1000;
    return 1 + (n - 0.5) * range;
  }

  function fairItemPrice(item, tier, ench, quality) {
    const recipe = getRecipe(item, tier);
    let resCost = 0;
    for (const r of recipe) resCost += BASE_PRICE_RES[r.res][r.tier] * r.qty;
    const base = resCost * 1.18;
    return Math.round(base * (ENCH_MULT[ench] || 1) * (QUALITY_MULT[quality] || 1));
  }

  function getItemPrices(itemId, tier, ench, quality) {
    const item = ITEMS.find(i => i.id === itemId);
    if (!item) return null;
    const fair = fairItemPrice(item, tier, ench, quality);
    const out = {};
    for (const c of CITIES) {
      const seed = `${itemId}|${tier}|${ench}|${quality}|${c.id}`;
      const jitter = noise(seed, 0.18);
      const price = Math.round(fair * CITY_MOD[c.id].sell * jitter);
      const vol = Math.max(1, Math.round(noise(seed + '|vol', 1.4) * (c.id === 'caerleon' ? 280 : c.id === 'brecilien' ? 60 : 140) / Math.pow(1.4, tier - 4)));
      const ageMin = Math.round(noise(seed + '|age', 1.2) * (c.id === 'caerleon' ? 4 : c.id === 'brecilien' ? 25 : 12));
      out[c.id] = { price, volume: vol, ageMin: Math.max(1, ageMin) };
    }
    return out;
  }

  function getResourcePrice(res, tier, cityId) {
    const seed = `res|${res}|${tier}|${cityId}`;
    const jitter = noise(seed, 0.14);
    const base = BASE_PRICE_RES[res][tier];
    const mod = CITY_MOD[cityId].buy_res;
    const price = Math.round(base * mod * jitter);
    const ageMin = Math.max(1, Math.round(noise(seed + '|age', 1.4) * 8));
    const volume = Math.max(20, Math.round(noise(seed + '|vol', 1.4) * 1200 / Math.pow(1.5, tier - 4)));
    return { price, ageMin, volume };
  }

  function getPriceHistory(itemId, tier, ench, quality, cityId, days = 30) {
    const item = ITEMS.find(i => i.id === itemId);
    if (!item) return [];
    const fair = fairItemPrice(item, tier, ench, quality) * CITY_MOD[cityId].sell;
    const points = [];
    let trend = 0;
    for (let i = days - 1; i >= 0; i--) {
      const seed = `hist|${itemId}|${tier}|${ench}|${quality}|${cityId}|${i}`;
      const day = (hash(seed) % 1000) / 1000;
      trend += (day - 0.5) * 0.04;
      trend = Math.max(-0.25, Math.min(0.25, trend));
      const v = fair * (1 + trend) * (1 + (day - 0.5) * 0.06);
      points.push({ day: i, price: Math.round(v), volume: Math.max(1, Math.round(day * 200)) });
    }
    return points;
  }

  function nutritionPerItem(tier, ench) {
    const base = Math.pow(2, tier - 1);
    return base * (1 + ench * 2);
  }

  // Backward-compat: returns recipe entries as before but tier-aware.
  function expandedRecipe(item, tier, ench) {
    return getRecipe(item, tier).map(r => ({ ...r, ench }));
  }

  window.AlbionData = {
    CITIES, ITEMS, RESOURCES, TIER_NAME,
    ENCH_MULT, QUALITY_MULT, QUALITY_LABEL,
    getItemPrices, getResourcePrice, getPriceHistory,
    fairItemPrice, nutritionPerItem, expandedRecipe,
    albionId, displayName, getRecipe,
  };
})();
