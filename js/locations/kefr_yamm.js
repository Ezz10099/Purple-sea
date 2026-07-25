// ================================================================
//  LOCATION DATA: Kefr-Yamm
// ================================================================

window.Kefr_Yamm = {
  id: "kefr-yamm",
  type: "starting_village",
  displayName: "Kefr-Yamm",
  grid: { width: 12, height: 10 },
  mapEntry: { x: 400, y: 540 },
  lore: {
    note: "Everything in Kefr-Yamm should feel smaller, quieter, and older than Tyre. No purple. No marble. No crowds."
  },

  drawTerrain(scene) {
    const g = scene.add.graphics();
    const W = scene.WORLD_W;
const H = scene.WORLD_H;
const SAFE_TOP = 72;

    g.fillStyle(0xd4c4a0);
    g.fillRect(0, 0, W, H);

    g.fillStyle(0xc4b490, 0.40);
    g.fillRect(0, SAFE_TOP, 533, 120);

    g.fillStyle(0xb4a478, 0.50);
    g.fillRect(0, 240, 133, 300);

    g.fillStyle(0x8a7a6a, 0.60);
    g.fillRect(600, 0, 133, 300);

    g.fillStyle(0x7a6a5a, 0.50);
    [
      [610, 20], [640, 50], [670, 30], [700, 60],
      [620, 90], [660, 110], [690, 80], [640, 150], [708, 138]
    ].forEach(([rx, ry]) => g.fillEllipse(rx, ry, 30, 18));

    g.lineStyle(2, 0x6a5a4a, 0.60);
    g.lineBetween(600, 0, 600, 300);

    g.fillStyle(0x1a1210, 0.85);
    g.fillRect(663, 105, 6, 28);
    g.fillStyle(0x0a0808, 0.60);
    g.fillRect(664, 108, 4, 22);

    g.fillStyle(0xb8a880, 0.55);
    g.fillRect(133, 270, 467, 35);
    g.fillRect(370, 270, 55, 270);
    g.fillRect(230, SAFE_TOP + 10, 55, 210);

    g.fillStyle(0x6a4a2a);
    [[20, 260], [70, 260], [20, 340], [70, 340]].forEach(([x, y]) => g.fillRect(x, y, 5, 60));

    g.lineStyle(1, 0x4a6a3a, 0.50);
    for (let y = 265; y < 320; y += 8) g.lineBetween(20, y, 75, y);
    for (let x = 20; x < 75; x += 10) g.lineBetween(x, 260, x, 320);
    for (let y = 345; y < 400; y += 8) g.lineBetween(20, y, 75, y);
    for (let x = 20; x < 75; x += 10) g.lineBetween(x, 340, x, 400);

    g.fillStyle(0x2a5a7a);
    g.fillRect(0, 440, W, 160);

    g.fillStyle(0x3a6a8a, 0.35);
    for (let x = 0; x < W; x += 44) {
      g.fillRect(x, 442, 22, 4);
      g.fillRect(x + 12, 458, 18, 3);
      g.fillRect(x + 5, 474, 20, 3);
    }

    g.fillStyle(0xb4a070, 0.60);
    g.fillRect(0, 432, W, 12);

    g.fillStyle(0x3a6a8a, 0.20);
    [[80, 436], [200, 438], [360, 435], [520, 437], [680, 436]].forEach(([sx, sy]) => {
      g.fillEllipse(sx, sy, 60, 12);
    });

    g.fillStyle(0x6a4a2a);
    g.fillRect(360, 430, 80, 80);
    g.lineStyle(1, 0x4a2a10, 0.50);
    for (let py = 433; py < 508; py += 12) g.lineBetween(360, py, 440, py);

    g.fillStyle(0x4a2a10);
    g.fillRect(357, 428, 8, 82);
    g.fillRect(435, 428, 8, 82);

    g.fillStyle(0x3a1a00);
    g.fillRect(355, 424, 12, 8);
    g.fillRect(433, 424, 12, 8);

    g.lineStyle(2, 0x5a5a5a, 0.80);
    g.strokeCircle(361, 448, 4);

    g.fillStyle(0x6a4a2a);
    g.fillEllipse(400, 490, 90, 28);
    g.fillStyle(0x4a2a10, 0.40);
    g.fillEllipse(400, 490, 70, 16);

    g.fillStyle(0x5a3a10);
    g.fillRect(398, 462, 4, 34);

    g.fillStyle(0xc8b890, 0.70);
    g.fillTriangle(402, 462, 402, 484, 428, 476);

    g.lineStyle(1, 0x8a6a3a, 0.60);
    g.lineBetween(361, 448, 355, 480);

    g.fillStyle(0x8a7a6a);
    [[100, 440], [220, 443], [560, 441], [680, 443]].forEach(([rx, ry]) => {
      g.fillEllipse(rx, ry, 24, 12);
      g.fillStyle(0x9a8a7a);
      g.fillEllipse(rx + 6, ry - 4, 14, 7);
      g.fillStyle(0x8a7a6a);
    });

  [
  [60, 40 + SAFE_TOP, 55, 45],
  [140, 30 + SAFE_TOP, 60, 50],
  [320, 35 + SAFE_TOP, 50, 45],
  [430, 40 + SAFE_TOP, 65, 48],
  [510, 25 + SAFE_TOP, 55, 45]
].forEach(([bx, by, bw, bh]) => {
      g.fillStyle(0x0a1018, 0.12);
      g.fillRect(bx + 4, by + 4, bw, bh);

      g.fillStyle(0xa08060);
      g.fillRect(bx, by, bw, bh);

      g.fillStyle(0x907050);
      g.fillRect(bx - 2, by - 4, bw + 4, 7);

      g.fillStyle(0x5a3a10);
      g.fillRect(bx + bw / 2 - 6, by + bh - 18, 12, 18);

      g.fillStyle(0xffe090, 0.60);
      g.fillRect(bx + 8, by + 10, 10, 9);
    });

    g.fillStyle(0xe89820, 0.60);
    [[268, 68 + SAFE_TOP], [402, 68 + SAFE_TOP], [404, 295]].forEach(([tx, ty]) => {
      g.fillCircle(tx, ty, 4);
      g.fillStyle(0xe89820, 0.15);
      g.fillCircle(tx, ty, 12);
      g.fillStyle(0xe89820, 0.60);
    });

    g.fillStyle(0x5a7a3a, 0.60);
    [[150, 200], [500, 180], [560, 350], [90, 380]].forEach(([vx, vy]) => {
      g.fillCircle(vx, vy, 10);
      g.fillStyle(0x4a6a2a, 0.50);
      g.fillCircle(vx + 8, vy - 4, 7);
      g.fillStyle(0x5a7a3a, 0.60);
    });

    g.fillStyle(0x8a7a6a, 0.80);
    g.fillEllipse(310, 255, 18, 10);
    g.fillCircle(320, 251, 6);
    g.lineStyle(2, 0x8a7a6a, 0.70);
    g.beginPath();
    g.moveTo(302, 255);
    g.lineTo(292, 248);
    g.strokePath();
  },

  getBuildings(scene) {
    const H = scene.WORLD_H;
const SAFE_TOP = 72;

    return [
      {
        id: "village_dock",
        label: "The Village Dock",
        icon: "⚓",
        x: 400,
        y: H - 70,
        w: 80,
        h: 20,
        color: 0x6a4a2a,
        roofColor: null,
        desc: "Three old wooden planks extending into the sea. One iron ring to tie boats. A crate used as a seat.",
        action: "services",
        dialogs: [
          "Your battered fishing boat waits at the dock. It can reach Sidon or Tyre, but not much farther yet."
        ],
        shipData: {
          name: "Your Fishing Boat",
          cargoCapacity: 20,
          travelSpeed: 1.0,
          stormResistance: 0.2,
          durability: 40,
          maxDurability: 40,
          maxDockRepairPercent: 0.7,
          repairCostPerPoint: 1
        },
        services: [
          { id: "sail", label: "Set Sail", icon: "⛵", type: "scene_world" },
          { id: "inspect", label: "Inspect Boat", icon: "🔎", type: "ship_status" },
          { id: "repair", label: "Basic Repair", icon: "🪚", type: "repair_ship" }
        ]
      },
      {
        id: "dagons_supply_hut",
        label: "Dagon's Supply Hut",
        icon: "🛒",
        x: 400,
        y: 300,
        w: 100,
        h: 80,
        color: 0xa08060,
        roofColor: 0x6a4020,
        desc: "A low mud-brick building with an open front counter. Sacks of grain, bundles of rope, and clay pots stacked outside.",
        action: "trade",
        itemFilter: [
          "fish_dried",
          "fish_fresh",
          "clay_pot_empty",
          "clay_pot_oil",
          "rope_basic",
          "cheap_wine_jug",
          "grain_sack_small",
          "sail_patch_kit"
        ],
        marketInventory: [
          { itemId: "fish_dried", stock: 20, buyPrice: 5, sellPrice: 3, restockDays: 1 },
          { itemId: "fish_fresh", stock: 30, buyPrice: 3, sellPrice: 1, restockDays: 1 },
          { itemId: "clay_pot_empty", stock: 15, buyPrice: 4, sellPrice: 2, restockDays: 3 },
          { itemId: "clay_pot_oil", stock: 8, buyPrice: 14, sellPrice: 7, restockDays: 4 },
          { itemId: "rope_basic", stock: 10, buyPrice: 8, sellPrice: 4, restockDays: 5 },
          { itemId: "cheap_wine_jug", stock: 10, buyPrice: 10, sellPrice: 5, restockDays: 4 },
          { itemId: "grain_sack_small", stock: 20, buyPrice: 7, sellPrice: 3, restockDays: 2 },
          { itemId: "sail_patch_kit", stock: 5, buyPrice: 12, sellPrice: 6, restockDays: 7 }
        ]
      },
      {
        id: "village_well",
        label: "The Village Well",
        icon: "💧",
        x: 333,
        y: 240,
        w: 40,
        h: 40,
        color: 0x8a7a6a,
        roofColor: 0x5a4a3a,
        desc: "A stone well in the center of the village. The main place to hear local rumors.",
        action: "services",
        rumorPool: [
          "A merchant in Sidon is paying double for dried fish this week.",
          "Tyre's harbor has been busy — grain prices may be low there.",
          "Someone saw a strange light on the cliffside last night."
        ],
        services: [
          { id: "rumor", label: "Listen to Villagers", icon: "👂", type: "rumor" }
        ]
      },
      {
        id: "mothers_house",
        label: "Mother Ashera's House",
        icon: "🏠",
        x: 267,
        y: 150,
        w: 90,
        h: 60,
        color: 0xc8b89a,
        roofColor: 0x7a5030,
        desc: "The house you grew up in. Small, clean, smells of bread and fish oil. A sleeping mat, a chest, and a sea-facing window.",
        action: "services",
        services: [
          { id: "sleep", label: "Sleep Until Morning", icon: "😴", type: "sleep" },
          { id: "storage", label: "Open Storage Chest", icon: "🧰", type: "storage" },
          { id: "save", label: "Save Game", icon: "💾", type: "save_game" }
        ]
      },
      {
        id: "cliff_cave",
        label: "The Cliff Cave",
        icon: "🕳",
        x: 667,
        y: 170,
        w: 20,
        h: 30,
        color: 0x1a1210,
        roofColor: null,
        desc: "A narrow crack in the cliff face at the end of the path. Easy to miss on first visit.",
        action: "explore",
        exploreData: {
          loreFlags: ["cave_carvings_found", "fathers_coin_found"],
          rewards: [
            { itemId: "fathers_old_coin", quantity: 1 },
            { itemId: "scrap_of_old_map", quantity: 1 }
          ],
          text: "Inside are old carvings of a ship, stars, and an arrow pointing west. A rusted tin box holds your father's old coin and a torn local waters map."
        }
      }
    ];
  },

  getNPCs(scene) {
    const H = scene.WORLD_H;
const SAFE_TOP = 72;

    return [
      {
        id: "mother_ashera",
        displayName: "Mother Ashera",
        role: "Tutorial Guide",
        x: 267,
        y: 170,
        clothColor: 0xc4a870,
        skinColor: 0xe8b87a,
        accentColor: 0x8a6040,
        headCovering: "headscarf",
        accessory: null,
        dialogues: [
          "You've been staring at those ships since you were a child. I always knew this day would come.",
          "Take what's in the chest. And come back.",
          "Your father had a trader's eye too. That is not always a blessing."
        ],
        choices: null
      },
      {
        id: "dagon",
        displayName: "Dagon",
        role: "Shopkeeper",
        x: 400,
        y: 265,
        clothColor: 0x8a6a3a,
        skinColor: 0xd4a070,
        accentColor: 0x4a3010,
        headCovering: "default",
        accessory: "scroll",
        dialogues: [
          "Buy here cheap. Sell in Sidon or Tyre for more. That's all trading is.",
          "Fish goes better in Tyre. Clay pots do decent in Sidon. Keep that in your head.",
          "Actually — I have a sealed box for a merchant in Sidon. You're sailing anyway."
        ],
        choices: [
          { text: "Ask about prices", outcome: { type: "close" } },
          { text: "Ask about Sidon", outcome: { type: "close" } },
          { text: "Maybe later", outcome: { type: "close" } }
        ]
      },
      {
        id: "rib_addi",
        displayName: "Rib-Addi the Blind",
        role: "Old Sailor",
        x: 333,
        y: H - 185,
        clothColor: 0x6a5a4a,
        skinColor: 0xb08050,
        accentColor: 0x3a2a1a,
        headCovering: "bald",
        accessory: "cane",
        dialogues: [
          "You're going to sail. I can hear it. The way your feet stop at the dock edge — that's not a fisherman's pause.",
          "I went west once. Far west. Past where the maps end. I saw something green and enormous and impossible.",
          "Go on. Sail. Come back and tell me what you find."
        ],
        choices: [
          { text: "What did you see?", outcome: { type: "dialogue", dialogueId: "rib_addi_refuses" } },
          { text: "How far west?", outcome: { type: "dialogue", dialogueId: "rib_addi_vague" } },
          { text: "Nod and leave", outcome: { type: "lore_flag", flag: "rib_addi_met" } }
        ],
        followUpDialogues: {
          rib_addi_refuses: {
            lines: [
              "No. You wouldn't understand yet. See the world first. Then ask me again."
            ],
            choices: []
          },
          rib_addi_vague: {
            lines: [
              "Past the Pillars. Keep sailing until you think you've made a  mistake. Then keep sailing."
            ],
            choices: []
          }
        }
      }
    ];
  }
};