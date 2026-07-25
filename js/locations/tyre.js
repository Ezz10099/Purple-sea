// ================================================================
//  LOCATION DATA: Tyre
//  The crown jewel of Phoenicia. Dense, wealthy, purple-stained.
//  Bigger and louder than Kefr-Yamm in every way.
// ================================================================

window.Tyre = {
  id: "tyre",
  type: "major_city",
  displayName: "Tyre",
  grid: { width: 12, height: 10 },
  mapEntry: { x: 400, y: 540 },
  lore: {
    note: "Tyre should feel crowded, rich, and overwhelming. Purple everywhere. Stone and marble. The smell of dye and the sea."
  },

  drawTerrain(scene) {
    const g = scene.add.graphics();
    const W = scene.WORLD_W;
    const H = scene.WORLD_H;
    const SAFE_TOP = 72;

    // ── Base ground: pale limestone ──────────────────────────────
    g.fillStyle(0xd8ccb4);
    g.fillRect(0, 0, W, H);

    // ── Sea (south) ──────────────────────────────────────────────
    g.fillStyle(0x1e4a6a);
    g.fillRect(0, 440, W, 160);

    // Sea shimmer
    g.fillStyle(0x2a5a7a, 0.30);
    for (let x = 0; x < W; x += 44) {
      g.fillRect(x,      442, 22, 4);
      g.fillRect(x + 12, 458, 18, 3);
      g.fillRect(x + 5,  474, 20, 3);
    }

    // Shoreline strip
    g.fillStyle(0xb8a87a, 0.70);
    g.fillRect(0, 430, W, 14);

    // ── Main stone avenue (vertical) ─────────────────────────────
    g.fillStyle(0xc4b89a, 0.60);
    g.fillRect(370, SAFE_TOP, 60, 440 - SAFE_TOP);

    // Cross-street (horizontal, mid-map)
    g.fillStyle(0xc4b89a, 0.50);
    g.fillRect(0, 290, W, 40);

    // ── Purple dye workshop (left side, large) ───────────────────
    // Shadow
    g.fillStyle(0x0a0818, 0.15);
    g.fillRect(34, SAFE_TOP + 64, 118, 98);
    // Walls
    g.fillStyle(0x5a2270);
    g.fillRect(30, SAFE_TOP + 60, 114, 94);
    // Purple-stained lower wall
    g.fillStyle(0x7a3090, 0.70);
    g.fillRect(30, SAFE_TOP + 120, 114, 34);
    // Roof beam
    g.fillStyle(0x3a1050);
    g.fillRect(28, SAFE_TOP + 56, 118, 8);
    // Door
    g.fillStyle(0x1a0820);
    g.fillRect(78, SAFE_TOP + 116, 18, 38);
    // Windows
    g.fillStyle(0xffe090, 0.50);
    g.fillRect(38, SAFE_TOP + 74, 14, 12);
    g.fillRect(118, SAFE_TOP + 74, 14, 12);
    // Dye vat (outside)
    g.fillStyle(0x8b2090);
    g.fillEllipse(46, SAFE_TOP + 168, 28, 16);
    g.fillStyle(0x6a1870, 0.60);
    g.fillEllipse(46, SAFE_TOP + 168, 20, 10);
    // Purple puddles on ground
    g.fillStyle(0x7a2080, 0.25);
    g.fillEllipse(70, SAFE_TOP + 172, 40, 10);
    g.fillEllipse(110, SAFE_TOP + 178, 24, 8);

    // ── Temple of Melqart (center, imposing) ─────────────────────
    // Shadow
    g.fillStyle(0x0a0818, 0.18);
    g.fillRect(344, SAFE_TOP + 64, 132, 104);
    // Base plinth (marble steps)
    g.fillStyle(0xe8e0c8);
    g.fillRect(334, SAFE_TOP + 120, 132, 12);
    g.fillRect(340, SAFE_TOP + 112, 120, 10);
    // Main walls
    g.fillStyle(0xd4c090);
    g.fillRect(344, SAFE_TOP + 60, 112, 64);
    // Gold roof
    g.fillStyle(0xc8a030);
    g.fillRect(340, SAFE_TOP + 54, 120, 10);
    // Columns (4 pillars)
    g.fillStyle(0xe8e0c8);
    [352, 378, 404, 430].forEach(cx => {
      g.fillRect(cx, SAFE_TOP + 62, 8, 60);
    });
    // Doorway
    g.fillStyle(0x1a1000);
    g.fillRect(386, SAFE_TOP + 96, 28, 36);
    // Gold flame on top
    g.fillStyle(0xffcc00, 0.90);
    g.fillTriangle(400, SAFE_TOP + 42, 394, SAFE_TOP + 56, 406, SAFE_TOP + 56);
    g.fillStyle(0xff8800, 0.70);
    g.fillTriangle(400, SAFE_TOP + 48, 397, SAFE_TOP + 56, 403, SAFE_TOP + 56);

    // ── Glass market (right side) ─────────────────────────────────
    // Shadow
    g.fillStyle(0x0a0818, 0.12);
    g.fillRect(554, 214, 108, 94);
    // Walls
    g.fillStyle(0x4a7a8a);
    g.fillRect(550, 210, 104, 90);
    // Roof
    g.fillStyle(0x2a5a6a);
    g.fillRect(548, 206, 108, 8);
    // Glinting glass display (pale reflective strips)
    g.fillStyle(0xd0f0ff, 0.55);
    g.fillRect(558, 220, 18, 30);
    g.fillRect(582, 218, 18, 30);
    g.fillRect(606, 222, 18, 28);
    g.fillStyle(0xa0d8ef, 0.35);
    g.fillRect(558, 222, 18, 6);
    g.fillRect(582, 220, 18, 6);
    // Door
    g.fillStyle(0x1a2a30);
    g.fillRect(592, 260, 16, 40);

    // ── Harbor (south, wide wooden structure) ────────────────────
    g.fillStyle(0x6a4a2a);
    g.fillRect(290, 428, 220, 24);
    // Planking lines
    g.lineStyle(1, 0x4a2a10, 0.45);
    for (let px = 292; px < 508; px += 18) g.lineBetween(px, 428, px, 452);
    // Dock posts
    g.fillStyle(0x4a2a10);
    [300, 340, 400, 460, 500].forEach(px => {
      g.fillRect(px - 3, 424, 6, 32);
    });
    // Mooring rings
    g.lineStyle(2, 0x7a7a7a, 0.90);
    [310, 400, 490].forEach(px => g.strokeCircle(px, 432, 4));
    // Ship hull suggestion
    g.fillStyle(0x6a4a2a);
    g.fillEllipse(400, 448, 140, 30);
    g.fillStyle(0x4a2a10, 0.45);
    g.fillEllipse(400, 448, 110, 18);
    // Mast
    g.fillStyle(0x5a3a10);
    g.fillRect(398, 400, 4, 52);
    // Sail
    g.fillStyle(0xd4b880, 0.75);
    g.fillTriangle(402, 402, 402, 432, 434, 420);
    // Ropes
    g.lineStyle(1, 0x8a6a3a, 0.55);
    g.lineBetween(400, 432, 392, 452);
    g.lineBetween(400, 432, 408, 452);
    // Barrels on dock
    g.fillStyle(0x7a5a2a);
    [[320, 420], [360, 418], [446, 420]].forEach(([bx, by]) => {
      g.fillEllipse(bx, by, 20, 14);
      g.fillStyle(0x5a3a10, 0.50);
      g.fillEllipse(bx, by, 14, 8);
      g.fillStyle(0x7a5a2a);
    });

    // ── Street details ────────────────────────────────────────────
    // Torch posts
    g.fillStyle(0x4a3a2a);
    [[200, 282], [560, 282], [200, 308], [560, 308]].forEach(([tx, ty]) => {
      g.fillRect(tx - 2, ty, 4, 22);
      g.fillStyle(0xffaa22, 0.80);
      g.fillTriangle(tx, ty - 6, tx - 4, ty + 2, tx + 4, ty + 2);
      g.fillStyle(0xff6600, 0.50);
      g.fillTriangle(tx, ty - 2, tx - 3, ty + 2, tx + 3, ty + 2);
      g.fillStyle(0x4a3a2a);
    });

    // Market stalls (mid street)
    [[170, 310], [230, 310], [530, 310], [590, 310]].forEach(([sx, sy]) => {
      g.fillStyle(0xd4a030, 0.70);
      g.fillRect(sx - 22, sy - 2, 44, 4);
      g.fillStyle(0xb08020, 0.60);
      g.fillRect(sx - 20, sy + 2, 40, 12);
      g.fillStyle(0x8a6010);
      g.fillRect(sx - 20, sy + 2, 3, 18);
      g.fillRect(sx + 17, sy + 2, 3, 18);
    });

    // Scattered pots on ground
    g.fillStyle(0xa08060, 0.70);
    [[140, 350], [250, 380], [620, 355], [680, 380]].forEach(([px, py]) => {
      g.fillEllipse(px, py, 16, 20);
      g.fillStyle(0x808050, 0.50);
      g.fillEllipse(px, py - 4, 12, 8);
      g.fillStyle(0xa08060, 0.70);
    });

    // Sparse trees (cypress style)
    g.fillStyle(0x3a5a2a, 0.75);
    [[660, 160], [680, 200], [50, 350], [70, 390]].forEach(([tx, ty]) => {
      g.fillTriangle(tx, ty - 30, tx - 10, ty + 10, tx + 10, ty + 10);
      g.fillStyle(0x2a4a1a, 0.55);
      g.fillTriangle(tx, ty - 20, tx - 8, ty + 14, tx + 8, ty + 14);
      g.fillStyle(0x5a4a2a);
      g.fillRect(tx - 3, ty + 10, 6, 16);
      g.fillStyle(0x3a5a2a, 0.75);
    });

    // ── Crowd dots (city feels busy) ─────────────────────────────
    const crowdColors = [0xc49060, 0xd4a870, 0xa07040, 0xe0b880];
    [
      [180, 310], [210, 315], [155, 305],
      [550, 308], [575, 312], [600, 306],
      [390, 310], [410, 308], [370, 314]
    ].forEach(([cx, cy], i) => {
      g.fillStyle(crowdColors[i % crowdColors.length], 0.80);
      g.fillCircle(cx, cy, 5);
    });
  },

  getBuildings(scene) {
    const SAFE_TOP = 72;

    return [
      {
        id: "tyre_harbor",
        label: "Tyre Harbor",
        icon: "⚓",
        x: 400,
        y: 440,
        w: 220,
        h: 24,
        color: 0x6a4a2a,
        roofColor: null,
        desc: "The greatest harbor in the world. Ships from every known land dock here. The smell of salt, cedar, and foreign spice.",
        action: "services",
        dialogs: [
          "A dozen ships are moored here. Yours is the smallest by far."
        ],
        shipData: {
          name: "Your Fishing Boat",
          cargoCapacity: 20,
          travelSpeed: 1.0,
          stormResistance: 0.2,
          durability: 40,
          maxDurability: 40,
          maxDockRepairPercent: 0.85,
          repairCostPerPoint: 2
        },
        services: [
          { id: "sail",    label: "Set Sail",     icon: "⛵", type: "scene_world" },
          { id: "inspect", label: "Inspect Boat", icon: "🔎", type: "ship_status" },
          { id: "repair",  label: "Repair Ship",  icon: "🪚", type: "repair_ship" }
        ]
      },
      {
        id: "dye_workshop",
        label: "Purple Dye Workshop",
        icon: "🟣",
        x: 87,
        y: SAFE_TOP + 107,
        w: 114,
        h: 94,
        color: 0x5a2270,
        roofColor: 0x3a1050,
        desc: "The smell is unbearable — rotting murex shells and brine. The wealth is unimaginable. A small vial of this dye costs more than your boat.",
        action: "trade",
        itemFilter: [
          "purple_dye",
          "fine_glass",
          "ivory",
          "cedar",
          "perfume"
        ],
        marketInventory: [
          { itemId: "purple_dye", stock: 3,  buyPrice: 380, sellPrice: 200, restockDays: 14 },
          { itemId: "fine_glass", stock: 6,  buyPrice: 85,  sellPrice: 45,  restockDays: 7  },
          { itemId: "ivory",      stock: 4,  buyPrice: 140, sellPrice: 70,  restockDays: 10 },
          { itemId: "cedar",      stock: 8,  buyPrice: 38,  sellPrice: 20,  restockDays: 5  },
          { itemId: "perfume",    stock: 5,  buyPrice: 65,  sellPrice: 35,  restockDays: 7  }
        ]
      },
      {
        id: "temple_melqart",
        label: "Temple of Melqart",
        icon: "🏛",
        x: 400,
        y: SAFE_TOP + 92,
        w: 112,
        h: 80,
        color: 0xd4c090,
        roofColor: 0xc8a030,
        desc: "The great temple of the Phoenician god. Gold flame burns at the entrance day and night. Priests hold ancient knowledge — and charge for it.",
        action: "talk",
        dialogs: [
          '"Melqart blessed every Phoenician ship that ever sailed. Pray before you leave."',
          '"The god demands tribute — but rewards those who give generously."',
          '"There is a sea route around all of Africa. The High Priest knows it. He does not share freely."'
        ]
      },
      {
        id: "glass_market",
        label: "Glass Market",
        icon: "🫙",
        x: 602,
        y: 255,
        w: 104,
        h: 90,
        color: 0x4a7a8a,
        roofColor: 0x2a5a6a,
        desc: "Shelves of transparent glass — a Phoenician invention that shocks every foreign buyer. The merchant watches you closely.",
        action: "trade",
        itemFilter: [
          "fine_glass",
          "papyrus",
          "linen",
          "bronze_tools",
          "copper"
        ],
        marketInventory: [
          { itemId: "fine_glass",   stock: 10, buyPrice: 82,  sellPrice: 44,  restockDays: 6  },
          { itemId: "papyrus",      stock: 12, buyPrice: 16,  sellPrice: 9,   restockDays: 4  },
          { itemId: "linen",        stock: 8,  buyPrice: 20,  sellPrice: 11,  restockDays: 5  },
          { itemId: "bronze_tools", stock: 7,  buyPrice: 23,  sellPrice: 12,  restockDays: 6  },
          { itemId: "copper",       stock: 6,  buyPrice: 32,  sellPrice: 17,  restockDays: 7  }
        ]
      },
      {
        id: "street_stall",
        label: "Street Vendor",
        icon: "🛒",
        x: 200,
        y: 316,
        w: 90,
        h: 36,
        color: 0xb08020,
        roofColor: 0xd4a030,
        desc: "A busy open stall in the middle of the street. The vendor sells basic supplies to passing traders at a slight markup.",
        action: "trade",
        itemFilter: [
          "fish",
          "grain",
          "olive_oil",
          "rope",
          "wine"
        ],
        marketInventory: [
          { itemId: "fish",      stock: 15, buyPrice: 7,  sellPrice: 10, restockDays: 2 },
          { itemId: "grain",     stock: 20, buyPrice: 8,  sellPrice: 12, restockDays: 2 },
          { itemId: "olive_oil", stock: 10, buyPrice: 14, sellPrice: 20, restockDays: 3 },
          { itemId: "rope",      stock: 8,  buyPrice: 5,  sellPrice: 8,  restockDays: 4 },
          { itemId: "wine",      stock: 12, buyPrice: 10, sellPrice: 14, restockDays: 3 }
        ]
      }
    ];
  },

  getNPCs(scene) {
    const H = scene.WORLD_H;
    const SAFE_TOP = 72;

    return [
      {
        id: "hiram_merchant",
        displayName: "Hiram",
        role: "Tyre Merchant",
        x: 550,
        y: 260,
        clothColor: 0x6a2a8a,
        skinColor: 0xd4a060,
        accentColor: 0x3a1050,
        headCovering: "default",
        accessory: "scroll",
        dialogues: [
          "First time in Tyre? You have the look of a village sailor. No offence.",
          "Fish and grain sell well here — we don't produce enough of our own. Bring more next time.",
          "Purple dye is the real money. But you'll need a bigger ship and more trust before anyone sells you a full stock."
        ],
        choices: [
          { text: "Ask what sells well",    outcome: { type: "close" } },
          { text: "Ask about purple dye",   outcome: { type: "close" } },
          { text: "Leave",                  outcome: { type: "close" } }
        ]
      },
      {
        id: "temple_priest",
        displayName: "Priest of Melqart",
        role: "Temple Priest",
        x: 400,
        y: SAFE_TOP + 165,
        clothColor: 0xd4c060,
        skinColor: 0xc89858,
        accentColor: 0x8a6010,
        headCovering: "headscarf",
        accessory: null,
        dialogues: [
          "You are far from home, sailor. Melqart guides those who make offerings.",
          "The flame has burned for three hundred years. It will burn three hundred more.",
          "Come back when your cargo is worth praying over."
        ],
        choices: [
          { text: "Make an offering",   outcome: { type: "close" } },
          { text: "Ask about the route",outcome: { type: "dialogue", dialogueId: "priest_secret" } },
          { text: "Bow and leave",      outcome: { type: "close" } }
        ],
        followUpDialogues: {
          priest_secret: {
            lines: [
              "The route around Africa? That knowledge belongs to Melqart — and to those who have earned his favour. Return when you are more than a fisherman."
            ],
            choices: []
          }
        }
      },
      {
        id: "dock_worker",
        displayName: "Yehawmilk",
        role: "Dock Worker",
        x: 310,
        y: 415,
        clothColor: 0x5a4a3a,
        skinColor: 0xb07840,
        accentColor: 0x2a1a10,
        headCovering: "bald",
        accessory: "cane",
        dialogues: [
          "Watch where you step. That purple stain doesn't wash out.",
          "Grain from Egypt or dried fish from the coast — that's what the city always wants more of. Always.",
          "You thinking about a bigger ship? Smart. You can't carry real cargo in that thing."
        ],
        choices: [
          { text: "Ask about cargo demand", outcome: { type: "close" } },
          { text: "Ask about ships",        outcome: { type: "close" } },
          { text: "Nod and move on",        outcome: { type: "close" } }
        ]
      }
    ];
  }
};
