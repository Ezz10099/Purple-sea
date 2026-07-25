// ================================================================
//  THE PURPLE SEA — Game Data
//  Locations: Kefr-Yamm (home), Tyre, Sidon
//  Currency: Coins
//  Era: ~950 BC, Phoenician Coast
// ================================================================

const GAME_DATA = {

  player: {
    gold: 40,
    inventory: [
      { itemId: 'fish_dried',     buyPrice: 5,  quantity: 5 },
      { itemId: 'clay_pot_empty', buyPrice: 4,  quantity: 3 },
      { itemId: 'rope_basic',     buyPrice: 8,  quantity: 2 },
    ],
    maxCarryWeight: 35,
    day: 1,
    reputation: 0,
    activeQuests: [],
    completedQuests: [],
    loreFlags: [],
    homeCity: 'kefr-yamm'
  },

  currency: 'Coins',

  // ── ITEMS ────────────────────────────────────────────────────
  items: [
    // ── Kefr-Yamm basics (from Dagon's inventory JSON) ────────
    { id: 'fish_dried',       name: 'Dried Fish',          basePrice: 5,   weight: 2,   rarity: 'common',    emoji: '🐟' },
    { id: 'fish_fresh',       name: 'Fresh Fish',          basePrice: 3,   weight: 3,   rarity: 'common',    emoji: '🐠' },
    { id: 'clay_pot_empty',   name: 'Clay Pot (Empty)',    basePrice: 4,   weight: 2,   rarity: 'common',    emoji: '🏺' },
    { id: 'clay_pot_oil',     name: 'Clay Pot (Olive Oil)',basePrice: 14,  weight: 4,   rarity: 'common',    emoji: '🫙' },
    { id: 'rope_basic',       name: 'Basic Rope',          basePrice: 8,   weight: 3,   rarity: 'common',    emoji: '🪢' },
    { id: 'cheap_wine_jug',   name: 'Cheap Wine',          basePrice: 10,  weight: 4,   rarity: 'common',    emoji: '🍷' },
    { id: 'grain_sack_small', name: 'Grain Sack',          basePrice: 7,   weight: 5,   rarity: 'common',    emoji: '🌾' },
    { id: 'sail_patch_kit',   name: 'Sail Patch Kit',      basePrice: 12,  weight: 1,   rarity: 'uncommon',  emoji: '⛵' },
    // ── Trade goods ───────────────────────────────────────────
    { id: 'olive_oil',        name: 'Olive Oil',           basePrice: 12,  weight: 4,   rarity: 'common',    emoji: '🫒' },
    { id: 'grain',            name: 'Egyptian Grain',      basePrice: 6,   weight: 10,  rarity: 'common',    emoji: '🌾' },
    { id: 'cedar',            name: 'Cedar Wood',          basePrice: 40,  weight: 15,  rarity: 'rare',      emoji: '🌲' },
    { id: 'papyrus',          name: 'Papyrus Scrolls',     basePrice: 18,  weight: 1,   rarity: 'uncommon',  emoji: '📜' },
    { id: 'linen',            name: 'Egyptian Linen',      basePrice: 22,  weight: 2,   rarity: 'uncommon',  emoji: '🧵' },
    { id: 'bronze_tools',     name: 'Bronze Tools',        basePrice: 25,  weight: 4,   rarity: 'uncommon',  emoji: '🪓' },
    { id: 'fine_glass',       name: 'Fine Glass',          basePrice: 90,  weight: 1.5, rarity: 'rare',      emoji: '🫙' },
    { id: 'perfume',          name: 'Perfume',             basePrice: 70,  weight: 0.5, rarity: 'rare',      emoji: '✨' },
    { id: 'copper',           name: 'Copper Ingots',       basePrice: 35,  weight: 6,   rarity: 'uncommon',  emoji: '🟤' },
    { id: 'ivory',            name: 'Carved Ivory',        basePrice: 150, weight: 3,   rarity: 'rare',      emoji: '🗿' },
    { id: 'silver',           name: 'Silver Bars',         basePrice: 85,  weight: 3,   rarity: 'uncommon',  emoji: '⬜' },
    { id: 'purple_dye',       name: 'Tyrian Purple Dye',   basePrice: 400, weight: 0.5, rarity: 'legendary', emoji: '🟣' },
    // ── Lore items (not tradeable, quest/exploration only) ────
    { id: 'fathers_old_coin', name: "Old Merchant's Coin", basePrice: 0,   weight: 0,   rarity: 'lore',      emoji: '🪙' },
    { id: 'torn_map_fragment',name: 'Torn Map Fragment',   basePrice: 0,   weight: 0,   rarity: 'lore',      emoji: '🗺' },
    { id: 'dagons_sealed_box',name: "Dagon's Sealed Box",  basePrice: 0,   weight: 2,   rarity: 'quest',     emoji: '📦' },
    { id: 'blue_kition_shell',name: 'Blue Shell (Kition)', basePrice: 0,   weight: 0.1, rarity: 'quest',     emoji: '🐚' },
  ],

  // ── QUESTS ───────────────────────────────────────────────────
  quests: [
    {
      id: 'first_delivery_sidon',
      order: 1,
      title: "Dagon's Package",
      location: 'kefr-yamm',
      description: 'Dagon has a sealed box that needs to reach a merchant in Sidon. He cannot leave the shop. You are going anyway.',
      objective: 'Sail to Sidon, find merchant Baalshamin at the dock district, and deliver the sealed box.',
      costToUnlock: 0,
      reward: {
        gold: 25,
        lore: 'Dagon nods slowly. "You did well. Come back when you have something worth selling."',
        flag: 'tutorial_complete'
      },
      status: 'available',
      steps: [
        { step: 1, action: 'receive_item',  itemId: 'dagons_sealed_box' },
        { step: 2, action: 'travel',        destination: 'sidon'        },
        { step: 3, action: 'deliver',       npcId: 'merchant_baalshamin'},
        { step: 4, action: 'return',        destination: 'kefr-yamm'    }
      ]
    },
    {
      id: 'dagons_missing_shipment',
      order: 2,
      title: 'The Missing Shipment',
      location: 'kefr-yamm',
      description: 'A shipment of rope Dagon ordered from Tyre never arrived. He thinks it was intercepted.',
      objective: 'Travel to Tyre. Ask at the harbor about a rope shipment destined for Kefr-Yamm.',
      costToUnlock: 0,
      reward: {
        gold: 80,
        lore: 'Dagon counts the coins twice. "Someone in Tyre is going to regret this."',
        flag: 'tyre_harbor_reputation'
      },
      status: 'locked',
      unlockCondition: { questCompleted: 'first_delivery_sidon', goldMin: 100 }
    },
    {
      id: 'rib_addis_last_wish',
      order: 3,
      title: "Rib-Addi's Last Wish",
      location: 'kefr-yamm',
      description: 'The old blind sailor asks for something. A specific blue shell, found only on the beaches of Kition at low tide. He has wanted one for decades.',
      objective: 'Travel to Kition. Find the blue shell on the beach. Return to Rib-Addi.',
      costToUnlock: 0,
      reward: {
        gold: 0,
        item: 'rib_addi_rope_bracelet',
        lore: 'He places the bracelet in your hand. Then he tells you what he saw beyond the Pillars — every detail. You will need this.',
        flag: 'rib_addi_secret_unlocked'
      },
      status: 'locked',
      unlockCondition: { loreFlag: 'rib_addi_met', locationsExploredMin: 3 }
    }
  ],

towns: [
    {
      id: 'kefr-yamm',
      name: 'Kefr-Yamm',
      type: 'starting_village',
      region: 'Phoenician Coast',
      x: 295, y: 195,
      color: 0xb8955a,
      isHome: true,
      sells: ['fish_dried', 'fish_fresh', 'rope_basic', 'clay_pot_empty', 'cheap_wine_jug'],
      buys:  ['bronze_tools', 'fine_glass', 'papyrus', 'linen'],
      description: 'Your home. A small forgotten port of fishermen and low-rank traders.',
      secret: 'An old blind sailor claims to have seen land beyond the Pillars of Hercules.',
      buildings: null
    },
    {
      id: 'tyre',
      name: 'Tyre',
      type: 'Major City',
      region: 'Phoenician Coast',
      x: 310, y: 220,
      color: 0x6B2D8B,
      isHome: false,
      sells: ['purple_dye', 'fine_glass', 'ivory', 'cedar'],
      buys:  ['fish', 'grain', 'olive_oil', 'rope'],
      description: 'The crown jewel of Phoenicia. The wealthiest trading city in the world.',
      secret: 'The High Priest of Melqart holds an ancient map of a sea route around Africa.',
      buildings: [
        {
          id: 'harbor',
          label: 'Tyre Harbor',
          icon: '⚓',
          x: 340, y: 520,
          w: 100, h: 40,
          color: 0x5a4020,
          roofColor: null,
          desc: 'The greatest harbor in the world. Ships from every known land dock here.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'dye_workshop',
          label: 'Purple Dye Workshop',
          icon: '🟣',
          x: 160, y: 280,
          w: 110, h: 85,
          color: 0x6B2D8B,
          roofColor: 0x3a1050,
          desc: 'The smell is unbearable. The wealth is unimaginable. Tyrian Purple is made here.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'temple',
          label: 'Temple of Melqart',
          icon: '🏛',
          x: 400, y: 200,
          w: 120, h: 90,
          color: 0xc8a84b,
          roofColor: 0x8B6914,
          desc: 'The great temple of the Phoenician god. Priests here hold ancient knowledge.',
          action: 'talk',
          dialogs: [
            '"Melqart blessed every Phoenician ship that ever sailed. Pray before you leave."',
            '"The god demands tribute — but rewards those who give generously."',
            '"There is a sea route around all of Africa. The High Priest knows it. He does not share freely."'
          ]
        },
        {
          id: 'glass_market',
          label: 'Glass Market',
          icon: '🫙',
          x: 580, y: 300,
          w: 100, h: 80,
          color: 0x4a8a9a,
          roofColor: 0x2a5a6a,
          desc: 'Shelves of transparent glass — a Phoenician invention that shocks every foreign buyer.',
          action: 'trade',
          dialogs: []
        }
      ]
    },
    {
      id: 'sidon',
      name: 'Sidon',
      type: 'Major City',
      region: 'Phoenician Coast',
      x: 300, y: 140,
      color: 0x2D5A8B,
      isHome: false,
      sells: ['fine_glass', 'perfume', 'bronze_tools', 'linen'],
      buys:  ['cedar', 'copper', 'wine', 'clay_pots'],
      description: "Tyre's old rival. Famous for glasswork and fierce merchant pride.",
      secret: 'A Sidonian guild secretly controls prices across three islands.',
      buildings: [
        {
          id: 'harbor',
          label: 'Sidon Harbor',
          icon: '⚓',
          x: 340, y: 520,
          w: 100, h: 40,
          color: 0x5a4020,
          roofColor: null,
          desc: 'A busy rival port. Sidonian sailors are proud and competitive.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'glass_workshop',
          label: 'Glass Workshop',
          icon: '🫙',
          x: 160, y: 260,
          w: 110, h: 85,
          color: 0x2D5A8B,
          roofColor: 0x1a3a6a,
          desc: 'Master glassblowers work here day and night. Their craft rivals even Tyre.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'guild',
          label: 'Merchant Guild',
          icon: '📋',
          x: 420, y: 200,
          w: 110, h: 85,
          color: 0x8B5E2D,
          roofColor: 0x5a3a10,
          desc: 'The secret guild that controls trade across three islands. Cunning and dangerous.',
          action: 'talk',
          dialogs: [
            '"You want to trade in Sidon? You deal with us first. Those are the rules."',
            '"We know what every merchant paid for every cargo on every ship last season."',
            '"Join the guild and prices across the islands become... friendlier."'
          ]
        },
        {
          id: 'perfume',
          label: 'Perfume Bazaar',
          icon: '✨',
          x: 580, y: 290,
          w: 100, h: 80,
          color: 0x9a6a8a,
          roofColor: 0x6a3a5a,
          desc: 'Frankincense, myrrh, and cedar oil fill the air. Used in temples and royal courts.',
          action: 'trade',
          dialogs: []
        }
      ]
    },
    {
      id: 'byblos',
      name: 'Byblos',
      type: 'Ancient City',
      region: 'Phoenician Coast',
      x: 290, y: 168,
      color: 0x8B5E2D,
      isHome: false,
      sells: ['papyrus', 'linen', 'cedar', 'olive_oil'],
      buys:  ['fine_glass', 'perfume', 'bronze_tools', 'copper'],
      description: 'One of the oldest cities in the world. A city of scholars and ancient knowledge.',
      secret: 'Ancient tunnels beneath the city lead to a pre-Phoenician temple.',
      buildings: [
        {
          id: 'harbor',
          label: 'Byblos Harbor',
          icon: '⚓',
          x: 340, y: 520,
          w: 100, h: 40,
          color: 0x5a4020,
          roofColor: null,
          desc: 'The oldest trading harbor in the world. Egypt and Phoenicia have traded here for a thousand years.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'library',
          label: 'Ancient Library',
          icon: '📚',
          x: 180, y: 250,
          w: 120, h: 90,
          color: 0x8B5E2D,
          roofColor: 0x5a3a10,
          desc: 'Thousands of scrolls and clay tablets. Scholars here know things no one else remembers.',
          action: 'talk',
          dialogs: [
            '"The alphabet you use to write — the Phoenicians invented it. Every letter you know came from this coast."',
            '"Beneath this city are tunnels older than Phoenicia itself. No one who entered the deepest ones came back."',
            '"Byblos gave the world the word Bible. Everything written comes from here."'
          ]
        },
        {
          id: 'papyrus',
          label: 'Papyrus Warehouse',
          icon: '📜',
          x: 430, y: 200,
          w: 110, h: 85,
          color: 0xc4a45a,
          roofColor: 0x8a7030,
          desc: 'Rolls of Egyptian papyrus stacked to the ceiling. Every scribe in the world needs this.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'temple_byblos',
          label: 'Temple of Adonis',
          icon: '🏛',
          x: 580, y: 280,
          w: 110, h: 85,
          color: 0xd4a84b,
          roofColor: 0x9a7030,
          desc: 'An ancient temple older than the city itself. Strange carvings line the walls.',
          action: 'talk',
          dialogs: [
            '"Adonis died here and was reborn. Every year the river runs red with his blood — or so they say."',
            '"The carvings on the inner walls predate Phoenicia. No scholar can read them."',
            '"Leave an offering. The god remembers those who give."'
          ]
        }
      ]
    },
    {
      id: 'kition',
      name: 'Kition',
      type: 'Island Colony',
      region: 'Cyprus',
      x: 250, y: 112,
      color: 0x5A8B2D,
      isHome: false,
      sells: ['copper', 'bronze_tools', 'wine'],
      buys:  ['linen', 'papyrus', 'purple_dye', 'ivory'],
      description: 'A Phoenician colony on copper-rich Cyprus. Rough, busy, and profitable.',
      secret: 'A collapsed mine holds a chamber filled with pre-Phoenician offerings.',
      buildings: [
        {
          id: 'harbor',
          label: 'Kition Harbor',
          icon: '⚓',
          x: 340, y: 520,
          w: 100, h: 40,
          color: 0x5a4020,
          roofColor: null,
          desc: 'A rough port smelling of copper dust and sea salt.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'mine',
          label: 'Copper Mine Office',
          icon: '⛏',
          x: 170, y: 260,
          w: 110, h: 85,
          color: 0x5A8B2D,
          roofColor: 0x3a6010,
          desc: 'The source of Cyprus copper — the most traded metal in the Mediterranean.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'smelter',
          label: 'The Smelter',
          icon: '🔥',
          x: 430, y: 210,
          w: 110, h: 85,
          color: 0x8B4020,
          roofColor: 0x5a2010,
          desc: 'Furnaces roar day and night, turning raw copper into ingots and bronze tools.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'tavern_kition',
          label: 'The Copper Cup',
          icon: '🍷',
          x: 580, y: 290,
          w: 100, h: 80,
          color: 0x7a5a2a,
          roofColor: 0x4a3010,
          desc: 'Miners, sailors, and merchants drink together here. Information flows freely.',
          action: 'talk',
          dialogs: [
            '"There is a collapsed mine east of town. Strange carvings inside — older than Phoenicia."',
            '"Cyprus copper built every bronze sword in the Mediterranean. Remember that when you negotiate."',
            '"A Cypriot miner found gold nuggets last month. He disappeared two days later."'
          ]
        }
      ]
    },
    {
      id: 'carthage',
      name: 'Carthage',
      type: 'Great Colony',
      region: 'North Africa',
      x: 148, y: 195,
      color: 0x8B2D2D,
      isHome: false,
      sells: ['ivory', 'grain', 'olive_oil'],
      buys:  ['purple_dye', 'fine_glass', 'cedar', 'papyrus'],
      description: "Phoenicia's greatest colony. Growing fast, ambitious, and politically dangerous.",
      secret: "The founders buried a great treasure beneath the city's first temple.",
      buildings: [
        {
          id: 'harbor',
          label: 'Carthage Harbor',
          icon: '⚓',
          x: 340, y: 520,
          w: 110, h: 40,
          color: 0x5a4020,
          roofColor: null,
          desc: 'The largest harbor in North Africa. Ships from Africa, Iberia, and Phoenicia crowd the docks.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'grand_market',
          label: 'Grand Market',
          icon: '🛒',
          x: 160, y: 260,
          w: 120, h: 90,
          color: 0x8B2D2D,
          roofColor: 0x5a1010,
          desc: 'The greatest market in North Africa. Everything from ivory to exotic animals.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'warehouse',
          label: 'Great Warehouse',
          icon: '📦',
          x: 430, y: 200,
          w: 110, h: 85,
          color: 0x7a5a3a,
          roofColor: 0x4a3a20,
          desc: 'Massive stone warehouses storing goods from across the known world.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'tavern_carthage',
          label: "Dido's Tavern",
          icon: '🍷',
          x: 580, y: 290,
          w: 100, h: 80,
          color: 0x8B5a2D,
          roofColor: 0x5a3010,
          desc: 'Named after the queen who founded Carthage. Political deals are made here nightly.',
          action: 'talk',
          dialogs: [
            '"Carthage will outshine Tyre within a generation. The new city is hungry."',
            '"Queen Dido buried a treasure beneath the first temple. Nobody has found it yet."',
            '"The Africans south of here trade gold for glass beads. Simple glass beads."'
          ]
        }
      ]
    },
    {
      id: 'tartessos',
      name: 'Tartessos',
      type: 'Foreign Kingdom',
      region: 'Far West — Iberia',
      x: 48, y: 178,
      color: 0x6B8B2D,
      isHome: false,
      sells: ['silver', 'copper', 'wine'],
      buys:  ['purple_dye', 'fine_glass', 'ivory', 'perfume'],
      description: 'A legendary kingdom at the far western edge of the known world.',
      secret: 'The king knows what lies beyond the Pillars — and will share it for a price.',
      buildings: [
        {
          id: 'harbor',
          label: 'Tartessos Harbor',
          icon: '⚓',
          x: 340, y: 520,
          w: 100, h: 40,
          color: 0x5a4020,
          roofColor: null,
          desc: 'Few Phoenician ships have ever docked here. You are far from home.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'silver_exchange',
          label: 'Silver Exchange',
          icon: '⬜',
          x: 170, y: 260,
          w: 110, h: 85,
          color: 0x6B8B2D,
          roofColor: 0x3a5a10,
          desc: 'Iberian silver — heavier than gold and nearly as valuable on eastern markets.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'kings_court',
          label: "King's Court",
          icon: '👑',
          x: 400, y: 190,
          w: 130, h: 95,
          color: 0xc4a44a,
          roofColor: 0x8a7020,
          desc: 'The court of the Tartessian king. He knows what lies beyond the Pillars.',
          action: 'talk',
          dialogs: [
            '"You have traveled far, Phoenician. Few of your kind reach Tartessos."',
            '"Beyond the Pillars? Yes. I know what is there. But knowledge has a price."',
            '"Bring me something I have never seen before — and I will tell you what lies to the west."'
          ]
        },
        {
          id: 'trader_post',
          label: "Trader's Post",
          icon: '🪙',
          x: 580, y: 290,
          w: 100, h: 80,
          color: 0x7a6a3a,
          roofColor: 0x4a4010,
          desc: 'Local Iberian traders gather here. They have never seen Tyrian Purple before.',
          action: 'talk',
          dialogs: [
            '"What is that purple cloth? We have never seen a color like that."',
            '"The mountains east of here are full of silver. We use it for everything."',
            '"Tin comes from islands far to the north. Cold, foggy islands beyond imagination."'
          ]
        }
      ]
    },
    {
      id: 'memphis',
      name: 'Memphis',
      type: 'Foreign City',
      region: 'Egypt',
      x: 330, y: 258,
      color: 0x8B7A2D,
      isHome: false,
      sells: ['grain', 'linen', 'papyrus', 'olive_oil'],
      buys:  ['cedar', 'fine_glass', 'purple_dye', 'ivory'],
      description: 'The great Egyptian capital on the Nile. Proud, ancient, and wealthy.',
      secret: 'A disgraced scribe sells forbidden maps of the Red Sea and beyond.',
      buildings: [
        {
          id: 'harbor',
          label: 'Nile Dock',
          icon: '⚓',
          x: 340, y: 520,
          w: 100, h: 40,
          color: 0x5a4020,
          roofColor: null,
          desc: 'The great Nile River dock. Egyptian grain travels the world from here.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'pharaoh_market',
          label: "Pharaoh's Market",
          icon: '🏺',
          x: 160, y: 260,
          w: 120, h: 90,
          color: 0x8B7A2D,
          roofColor: 0x5a4a10,
          desc: 'The royal market of Memphis. Everything traded here is taxed by the Pharaoh.',
          action: 'trade',
          dialogs: []
        },
        {
          id: 'scribe_quarter',
          label: 'Scribe Quarter',
          icon: '✍',
          x: 430, y: 200,
          w: 110, h: 85,
          color: 0xc4aa5a,
          roofColor: 0x8a7a30,
          desc: 'Hundreds of scribes work here. One of them sells forbidden maps of the Red Sea.',
          action: 'talk',
          dialogs: [
            '"The Egyptians think they are the center of the world. Perhaps they are right."',
            '"A scribe here was dismissed from the royal court. He sells maps he should not have."',
            '"The Red Sea leads to lands of spice and gold that even Phoenicia has not reached."'
          ]
        },
        {
          id: 'temple_ptah',
          label: 'Temple of Ptah',
          icon: '🏛',
          x: 580, y: 280,
          w: 110, h: 85,
          color: 0xd4b84b,
          roofColor: 0x9a8020,
          desc: 'The great temple of the craftsman god. Egyptians look down on foreign traders here.',
          action: 'talk',
          dialogs: [
            '"This is Egypt. You are a guest here, Phoenician. Remember that."',
            '"Ptah created everything with his mind and his tongue. What have you created?"',
            '"The Pharaoh knows about your trading networks. He is... watching."'
          ]
        }
      ]
    }
  ]

};