// ================================================================
//  FOREST SCENE — Weakwood Grove
//  A showcase for Purple Sea's asset-free illustrated 2.5D method.
//  Every visible object is generated at runtime from Phaser shapes.
// ================================================================

class ForestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ForestScene' });
  }

  create(data) {
    this.W = this.cameras.main.width;
    this.H = this.cameras.main.height;
    this.WORLD_W = 1440;
    this.WORLD_H = 1080;

    this.playerData = data.playerData || JSON.parse(JSON.stringify(GAME_DATA.player));
    this.saveSlot = data.saveSlot || null;
    this.returnTown = data.returnTown || GAME_DATA.towns.find(t => t.id === 'kefr-yamm');
    this.playerData.forestDefeats = Number(this.playerData.forestDefeats || 0);

    this.physics.world.setBounds(0, 0, this.WORLD_W, this.WORLD_H);
    this.cameras.main.setBounds(0, 0, this.WORLD_W, this.WORLD_H);
    this.cameras.main.setBackgroundColor('#07140f');

    this.generateProceduralArt();
    this.drawForestFloor();
    this.createEnvironment();
    this.createEnemies();
    this.createPlayer();
    this.createAmbientLife();
    this.createControls();
    this.createHUD();
    this.setupInput();

    this.selectedEnemy = null;
    this.moveTarget = null;
    this.attackTimer = 0;
    this.playerHP = 100;
    this.maxPlayerHP = 100;

    this.cameras.main.startFollow(this.player, true, 0.085, 0.085);
    this.cameras.main.setDeadzone(this.W * 0.18, this.H * 0.22);
    this.cameras.main.setZoom(1.04);
    this.cameras.main.fadeIn(650, 3, 10, 7);

    this.updateHUD();
    SaveSystem.autoSave(this.playerData, this.returnTown.id);
  }

  makeTexture(key, width, height, painter) {
    if (this.textures.exists(key)) return;
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    painter(g);
    g.generateTexture(key, width, height);
    g.destroy();
  }

  generateProceduralArt() {
    this.makeTexture('ps-tree-cedar-a', 190, 230, g => {
      g.fillStyle(0x07100c, 0.30); g.fillEllipse(104, 207, 124, 28);
      g.fillStyle(0x3b2a1d); g.fillRoundedRect(86, 88, 20, 116, 7);
      g.fillStyle(0x76543a, 0.65); g.fillRoundedRect(89, 91, 5, 105, 3);
      g.fillStyle(0x2c2118); g.fillTriangle(87, 135, 56, 150, 88, 126);
      g.fillTriangle(104, 120, 137, 140, 103, 111);
      g.fillStyle(0x102f21); g.fillCircle(50, 101, 42); g.fillCircle(83, 80, 53); g.fillCircle(125, 98, 47);
      g.fillStyle(0x19432b); g.fillCircle(55, 82, 38); g.fillCircle(96, 60, 52); g.fillCircle(137, 84, 36);
      g.fillStyle(0x28603a); g.fillCircle(76, 47, 30); g.fillCircle(111, 42, 34); g.fillCircle(143, 62, 27);
      g.fillStyle(0x5a8150, 0.58); g.fillCircle(79, 37, 17); g.fillCircle(122, 35, 18); g.fillCircle(144, 55, 12);
      g.fillStyle(0x0b2118, 0.75); g.fillCircle(63, 104, 16); g.fillCircle(123, 107, 18);
      g.lineStyle(2, 0x07140e, 0.70); g.strokeCircle(96, 70, 58);
    });

    this.makeTexture('ps-tree-cedar-b', 180, 220, g => {
      g.fillStyle(0x07100c, 0.32); g.fillEllipse(96, 199, 118, 27);
      g.fillStyle(0x49321f); g.fillRoundedRect(82, 79, 18, 118, 7);
      g.fillStyle(0x8b6340, 0.55); g.fillRoundedRect(86, 82, 4, 108, 2);
      g.fillStyle(0x113421); g.fillCircle(53, 93, 37); g.fillCircle(87, 65, 51); g.fillCircle(128, 92, 41);
      g.fillStyle(0x1f5130); g.fillCircle(44, 72, 30); g.fillCircle(101, 52, 47); g.fillCircle(142, 72, 28);
      g.fillStyle(0x3f7145, 0.90); g.fillCircle(76, 44, 25); g.fillCircle(119, 39, 27); g.fillCircle(142, 59, 16);
      g.fillStyle(0x8da269, 0.28); g.fillCircle(84, 32, 12); g.fillCircle(126, 31, 12);
      g.fillStyle(0x0a2418, 0.70); g.fillCircle(66, 96, 15); g.fillCircle(119, 104, 17);
    });

    this.makeTexture('ps-tree-olive', 150, 180, g => {
      g.fillStyle(0x07100c, 0.28); g.fillEllipse(82, 162, 102, 24);
      g.lineStyle(14, 0x51402b, 1); g.lineBetween(74, 157, 76, 83);
      g.lineStyle(8, 0x5f4930, 1); g.lineBetween(76, 105, 49, 72); g.lineBetween(78, 99, 105, 65);
      g.fillStyle(0x304c35); g.fillCircle(43, 66, 30); g.fillCircle(74, 50, 38); g.fillCircle(111, 69, 30);
      g.fillStyle(0x526b49); g.fillCircle(56, 48, 25); g.fillCircle(91, 39, 30); g.fillCircle(123, 56, 20);
      g.fillStyle(0x91a06f, 0.46); g.fillCircle(63, 38, 12); g.fillCircle(102, 31, 13); g.fillCircle(126, 49, 8);
      g.fillStyle(0x243f2d); g.fillCircle(34, 78, 18); g.fillCircle(103, 84, 20);
    });

    this.makeTexture('ps-bush', 100, 64, g => {
      g.fillStyle(0x07100c, 0.28); g.fillEllipse(52, 55, 82, 16);
      g.fillStyle(0x193e29); g.fillCircle(26, 37, 20); g.fillCircle(49, 28, 27); g.fillCircle(77, 38, 21);
      g.fillStyle(0x2f6240); g.fillCircle(35, 26, 16); g.fillCircle(61, 19, 19); g.fillCircle(83, 32, 12);
      g.fillStyle(0x728556, 0.45); g.fillCircle(42, 17, 7); g.fillCircle(68, 15, 7);
    });

    this.makeTexture('ps-rock', 86, 62, g => {
      g.fillStyle(0x07100c, 0.33); g.fillEllipse(45, 53, 70, 16);
      g.fillStyle(0x4a5047); g.fillTriangle(9, 49, 30, 13, 76, 48);
      g.fillStyle(0x6e7465); g.fillTriangle(30, 13, 76, 48, 47, 38);
      g.fillStyle(0x949784, 0.48); g.fillTriangle(30, 13, 47, 38, 18, 42);
      g.lineStyle(1, 0x252c26, 0.65); g.lineBetween(47, 38, 58, 45);
    });

    this.makeTexture('ps-grass', 44, 38, g => {
      g.lineStyle(3, 0x456642, 0.92);
      g.lineBetween(21, 35, 8, 13); g.lineBetween(22, 35, 17, 5); g.lineBetween(23, 35, 27, 8);
      g.lineBetween(24, 35, 37, 13); g.lineBetween(20, 35, 4, 24); g.lineBetween(25, 35, 40, 25);
      g.lineStyle(1, 0x9aac6a, 0.58); g.lineBetween(22, 32, 18, 7); g.lineBetween(24, 31, 36, 14);
    });

    this.makeTexture('ps-fern', 64, 62, g => {
      g.lineStyle(3, 0x31583a, 1); g.lineBetween(32, 58, 32, 10);
      for (let i = 0; i < 6; i += 1) {
        const y = 18 + i * 6;
        const reach = 24 - i * 2;
        g.lineBetween(32, y, 32 - reach, y - 10); g.lineBetween(32, y + 2, 32 + reach, y - 8);
      }
      g.lineStyle(1, 0x8ba06a, 0.45); g.lineBetween(32, 57, 32, 12);
    });

    this.makeTexture('ps-mushrooms', 52, 44, g => {
      g.fillStyle(0xc6b98c); g.fillRoundedRect(11, 23, 5, 16, 2); g.fillRoundedRect(30, 20, 6, 19, 2);
      g.fillStyle(0x8f4334); g.fillEllipse(13, 21, 18, 10); g.fillEllipse(33, 18, 22, 12);
      g.fillStyle(0xe0c789, 0.85); g.fillCircle(9, 19, 2); g.fillCircle(17, 21, 2); g.fillCircle(29, 15, 2); g.fillCircle(37, 19, 2);
    });

    this.makeTexture('ps-rune-stone', 100, 132, g => {
      g.fillStyle(0x06100c, 0.34); g.fillEllipse(54, 119, 82, 20);
      g.fillStyle(0x4d554b); g.fillTriangle(23, 112, 29, 23, 74, 15); g.fillTriangle(23, 112, 74, 15, 78, 113);
      g.fillStyle(0x72796a, 0.65); g.fillTriangle(29, 23, 74, 15, 60, 105);
      g.lineStyle(3, 0xa7c287, 0.58); g.strokeCircle(52, 63, 18); g.lineBetween(52, 42, 52, 84); g.lineBetween(37, 63, 67, 63);
      g.fillStyle(0x9ecb7b, 0.20); g.fillCircle(52, 63, 26);
      g.fillStyle(0x21462e); g.fillCircle(31, 90, 8); g.fillCircle(70, 95, 10);
    });

    this.makeTexture('ps-player', 64, 92, g => {
      g.fillStyle(0x06100c, 0.36); g.fillEllipse(35, 82, 44, 12);
      g.fillStyle(0x7c2220); g.fillTriangle(17, 48, 47, 48, 39, 82); g.fillTriangle(17, 48, 25, 82, 39, 82);
      g.fillStyle(0x2f6980); g.fillCircle(32, 39, 15);
      g.fillStyle(0xdcae77); g.fillCircle(32, 24, 9);
      g.fillStyle(0x2a1b13); g.fillRect(22, 13, 20, 7); g.fillRoundedRect(26, 4, 12, 13, 3);
      g.fillStyle(0xb98631); g.fillRect(45, 40, 10, 23); g.fillStyle(0xedd79d); g.fillRect(48, 42, 4, 18);
      g.lineStyle(3, 0x281812, 1); g.lineBetween(24, 76, 21, 86); g.lineBetween(39, 76, 43, 86);
      g.lineStyle(1, 0xe6d39b, 0.6); g.strokeCircle(32, 39, 15);
    });

    this.makeTexture('ps-rat', 72, 58, g => {
      g.fillStyle(0x06100c, 0.32); g.fillEllipse(38, 49, 52, 12);
      g.fillStyle(0x75634b); g.fillEllipse(32, 31, 38, 23); g.fillCircle(52, 28, 11);
      g.fillStyle(0x9b8663); g.fillTriangle(47, 20, 49, 9, 55, 20); g.fillTriangle(55, 20, 63, 11, 62, 24);
      g.fillStyle(0x17120f); g.fillCircle(56, 26, 2); g.fillCircle(63, 32, 2);
      g.lineStyle(3, 0x5a4636, 1); g.beginPath(); g.moveTo(14, 32); g.lineTo(4, 25); g.lineTo(1, 31); g.strokePath();
      g.lineStyle(3, 0x3a2b20, 1); g.lineBetween(24, 41, 20, 52); g.lineBetween(43, 41, 46, 52);
    });

    this.makeTexture('ps-jackal', 94, 72, g => {
      g.fillStyle(0x06100c, 0.33); g.fillEllipse(50, 62, 70, 15);
      g.fillStyle(0x8f623a); g.fillEllipse(42, 40, 50, 28); g.fillCircle(70, 32, 14);
      g.fillStyle(0xb7834d); g.fillTriangle(61, 22, 63, 5, 71, 23); g.fillTriangle(70, 20, 83, 6, 81, 26);
      g.fillStyle(0x3a291c); g.fillRect(25, 49, 6, 17); g.fillRect(55, 50, 6, 16); g.fillTriangle(17, 36, 3, 27, 20, 45);
      g.fillStyle(0x16100c); g.fillCircle(75, 29, 2); g.fillCircle(84, 36, 2);
      g.fillStyle(0xd9bb72, 0.7); g.fillTriangle(68, 28, 80, 35, 68, 38);
    });

    this.makeTexture('ps-crawler', 82, 76, g => {
      g.fillStyle(0x06100c, 0.32); g.fillEllipse(42, 67, 60, 14);
      g.fillStyle(0x476d3b); g.fillCircle(41, 40, 22); g.fillStyle(0x648c4b); g.fillCircle(41, 37, 15);
      g.fillStyle(0x799c57);
      for (let i = 0; i < 8; i += 1) {
        const a = (Math.PI * 2 * i) / 8;
        const x1 = 41 + Math.cos(a) * 17; const y1 = 40 + Math.sin(a) * 17;
        const x2 = 41 + Math.cos(a - 0.18) * 32; const y2 = 40 + Math.sin(a - 0.18) * 32;
        const x3 = 41 + Math.cos(a + 0.18) * 32; const y3 = 40 + Math.sin(a + 0.18) * 32;
        g.fillTriangle(x1, y1, x2, y2, x3, y3);
      }
      g.fillStyle(0x142015); g.fillCircle(34, 34, 3); g.fillCircle(48, 34, 3);
      g.fillStyle(0xc8d46a, 0.7); g.fillCircle(34, 34, 1); g.fillCircle(48, 34, 1);
    });
  }

  drawForestFloor() {
    const g = this.add.graphics().setDepth(-1000);
    g.fillStyle(0x10271b); g.fillRect(0, 0, this.WORLD_W, this.WORLD_H);

    const patches = [
      [230, 220, 420, 260, 0x193a26, 0.82], [690, 210, 580, 300, 0x24452c, 0.65],
      [1120, 250, 520, 360, 0x173724, 0.78], [340, 720, 620, 430, 0x29472e, 0.58],
      [900, 760, 720, 420, 0x1b3c27, 0.76], [1240, 850, 390, 300, 0x122d20, 0.84]
    ];
    patches.forEach(([x, y, w, h, c, a]) => { g.fillStyle(c, a); g.fillEllipse(x, y, w, h); });

    for (let i = 0; i < 420; i += 1) {
      const x = (i * 173 + 41) % this.WORLD_W;
      const y = (i * 97 + 83) % this.WORLD_H;
      const size = 1 + (i % 5);
      g.fillStyle(i % 4 === 0 ? 0x77845a : 0x071a12, i % 4 === 0 ? 0.14 : 0.13);
      g.fillEllipse(x, y, size * 3, size);
    }

    const path = [
      { x: 125, y: 950 }, { x: 245, y: 850 }, { x: 390, y: 770 }, { x: 515, y: 690 },
      { x: 655, y: 600 }, { x: 780, y: 510 }, { x: 925, y: 425 }, { x: 1100, y: 350 }, { x: 1320, y: 300 }
    ];
    g.lineStyle(78, 0x554e37, 0.78); g.beginPath(); g.moveTo(path[0].x, path[0].y);
    path.slice(1).forEach(p => g.lineTo(p.x, p.y)); g.strokePath();
    g.lineStyle(57, 0x7c704f, 0.86); g.beginPath(); g.moveTo(path[0].x, path[0].y);
    path.slice(1).forEach(p => g.lineTo(p.x, p.y)); g.strokePath();
    g.lineStyle(19, 0xa19469, 0.18); g.beginPath(); g.moveTo(path[0].x, path[0].y);
    path.slice(1).forEach(p => g.lineTo(p.x, p.y)); g.strokePath();

    const fork = [{ x: 650, y: 600 }, { x: 620, y: 740 }, { x: 720, y: 875 }, { x: 900, y: 970 }];
    g.lineStyle(52, 0x665d41, 0.68); g.beginPath(); g.moveTo(fork[0].x, fork[0].y); fork.slice(1).forEach(p => g.lineTo(p.x, p.y)); g.strokePath();
    g.lineStyle(34, 0x8a7d58, 0.52); g.beginPath(); g.moveTo(fork[0].x, fork[0].y); fork.slice(1).forEach(p => g.lineTo(p.x, p.y)); g.strokePath();

    const stream = [{ x: 1160, y: -30 }, { x: 1090, y: 170 }, { x: 1125, y: 350 }, { x: 1040, y: 545 }, { x: 1060, y: 750 }, { x: 940, y: 1110 }];
    g.lineStyle(126, 0x081712, 0.85); g.beginPath(); g.moveTo(stream[0].x, stream[0].y); stream.slice(1).forEach(p => g.lineTo(p.x, p.y)); g.strokePath();
    g.lineStyle(96, 0x1a4d55, 0.98); g.beginPath(); g.moveTo(stream[0].x, stream[0].y); stream.slice(1).forEach(p => g.lineTo(p.x, p.y)); g.strokePath();
    g.lineStyle(6, 0x84b6a9, 0.34); g.beginPath(); g.moveTo(stream[0].x + 10, stream[0].y); stream.slice(1).forEach(p => g.lineTo(p.x + 10, p.y)); g.strokePath();
    for (let i = 0; i < 15; i += 1) {
      const y = 40 + i * 72; const x = 1100 - Math.sin(i * 1.3) * 52;
      g.lineStyle(2, 0xb3d4c5, 0.28); g.lineBetween(x - 18, y, x + 20, y - 4);
    }

    this.drawBridge(1038, 555);
    this.drawCaveEntrance(105, 930);
    this.drawShrineClearing(790, 275);
  }

  drawBridge(x, y) {
    const g = this.add.graphics().setDepth(y - 10);
    g.fillStyle(0x06100c, 0.28); g.fillEllipse(x + 6, y + 30, 150, 36);
    g.fillStyle(0x51351f); g.fillRect(x - 67, y - 18, 134, 58);
    g.lineStyle(3, 0x2a1a11, 0.75);
    for (let i = -58; i <= 58; i += 16) g.lineBetween(x + i, y - 16, x + i, y + 38);
    g.lineStyle(5, 0x6f4b2c, 1); g.lineBetween(x - 70, y - 23, x - 70, y + 43); g.lineBetween(x + 70, y - 23, x + 70, y + 43);
    g.lineStyle(2, 0xa17a45, 0.52); g.lineBetween(x - 60, y - 13, x + 60, y - 13);
  }

  drawCaveEntrance(x, y) {
    const g = this.add.graphics().setDepth(y - 5);
    g.fillStyle(0x06100c, 0.38); g.fillEllipse(x + 10, y + 20, 150, 44);
    g.fillStyle(0x4d5149); g.fillEllipse(x, y - 12, 130, 122);
    g.fillStyle(0x74786c, 0.56); g.fillEllipse(x - 12, y - 25, 92, 86);
    g.fillStyle(0x050806); g.fillEllipse(x + 3, y - 2, 72, 86);
    g.fillStyle(0x1b3c28); g.fillCircle(x - 48, y - 47, 21); g.fillCircle(x + 50, y - 42, 18);
    g.lineStyle(2, 0xa39d79, 0.35); g.strokeEllipse(x + 3, y - 2, 72, 86);
    this.add.text(x, y + 48, 'CLIFF CAVE', {
      fontFamily: 'Georgia, serif', fontSize: '11px', fontStyle: 'bold', color: '#c9b887',
      stroke: '#06100c', strokeThickness: 4, letterSpacing: 2
    }).setOrigin(0.5).setDepth(y + 5);
  }

  drawShrineClearing(x, y) {
    const g = this.add.graphics().setDepth(-900);
    g.fillStyle(0x879060, 0.16); g.fillCircle(x, y, 155);
    g.lineStyle(3, 0x9aaa72, 0.20); g.strokeCircle(x, y, 122);
    g.lineStyle(1, 0xc3d29a, 0.16); g.strokeCircle(x, y, 84);
    for (let i = 0; i < 10; i += 1) {
      const a = (Math.PI * 2 * i) / 10;
      g.fillStyle(0x596052, 0.72); g.fillCircle(x + Math.cos(a) * 116, y + Math.sin(a) * 72, 9);
    }
    const rune = this.add.image(x, y + 20, 'ps-rune-stone').setOrigin(0.5, 1).setDepth(y + 5);
    this.tweens.add({ targets: rune, alpha: { from: 0.88, to: 1 }, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  createEnvironment() {
    const trees = [
      [40, 170, 1.20, 'a'], [150, 120, 0.94, 'b'], [280, 100, 1.08, 'a'], [430, 150, 0.86, 'b'],
      [580, 105, 1.15, 'a'], [725, 115, 0.94, 'olive'], [890, 110, 1.08, 'b'], [1040, 120, 1.18, 'a'],
      [1220, 120, 0.98, 'b'], [1375, 170, 1.20, 'a'], [90, 355, 1.05, 'olive'], [230, 330, 1.16, 'a'],
      [390, 300, 0.92, 'b'], [565, 315, 1.04, 'olive'], [970, 300, 0.90, 'b'], [1310, 340, 1.12, 'a'],
      [80, 540, 1.24, 'a'], [250, 540, 0.96, 'olive'], [415, 505, 1.08, 'b'], [1265, 530, 1.18, 'a'],
      [1400, 585, 1.00, 'b'], [90, 740, 1.10, 'olive'], [290, 760, 1.18, 'a'], [465, 850, 0.92, 'b'],
      [610, 910, 1.15, 'a'], [790, 1005, 1.04, 'olive'], [1035, 980, 1.20, 'a'], [1230, 880, 0.95, 'b'],
      [1380, 830, 1.18, 'a'], [1220, 720, 0.90, 'olive'], [925, 760, 0.88, 'b'], [730, 720, 0.78, 'olive'],
      [535, 590, 0.76, 'b'], [385, 980, 1.06, 'a'], [150, 1030, 1.14, 'b']
    ];
    trees.forEach(([x, y, scale, variant], index) => {
      const key = variant === 'olive' ? 'ps-tree-olive' : variant === 'b' ? 'ps-tree-cedar-b' : 'ps-tree-cedar-a';
      const tree = this.add.image(x, y, key).setOrigin(0.5, 1).setScale(scale).setDepth(y);
      if (index % 4 === 0) this.tweens.add({ targets: tree, angle: { from: -0.6, to: 0.6 }, duration: 2600 + index * 35, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    });

    const bushes = [
      [315, 195, 0.75], [500, 220, 0.95], [675, 195, 0.74], [920, 205, 0.86], [1180, 250, 0.82],
      [170, 470, 0.86], [345, 430, 0.72], [565, 445, 0.90], [905, 500, 0.76], [1190, 450, 0.95],
      [210, 680, 0.80], [445, 685, 0.92], [630, 815, 0.75], [850, 860, 0.88], [1170, 805, 0.84]
    ];
    bushes.forEach(([x, y, s]) => this.add.image(x, y, 'ps-bush').setOrigin(0.5, 1).setScale(s).setDepth(y));

    const rocks = [[210, 895, 0.9], [370, 725, 0.7], [545, 620, 0.85], [900, 470, 0.75], [1180, 390, 0.9], [990, 805, 0.72], [770, 930, 0.82], [1310, 700, 1.0]];
    rocks.forEach(([x, y, s]) => this.add.image(x, y, 'ps-rock').setOrigin(0.5, 1).setScale(s).setDepth(y));

    for (let i = 0; i < 92; i += 1) {
      const x = 70 + ((i * 149) % 1300); const y = 120 + ((i * 223) % 880);
      if ((x > 80 && x < 1120 && y > 250 && y < 980 && i % 3 === 0)) continue;
      const key = i % 5 === 0 ? 'ps-fern' : 'ps-grass';
      const item = this.add.image(x, y, key).setOrigin(0.5, 1).setScale(0.56 + (i % 4) * 0.10).setDepth(y - 2).setAlpha(0.72 + (i % 3) * 0.08);
      if (i % 7 === 0) this.tweens.add({ targets: item, angle: { from: -1.5, to: 1.5 }, duration: 1700 + i * 11, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }

    [[455, 405], [690, 330], [865, 640], [1165, 610], [320, 880]].forEach(([x, y]) => this.add.image(x, y, 'ps-mushrooms').setOrigin(0.5, 1).setDepth(y));

    this.drawFallenLog(475, 365, 1.0);
    this.drawFallenLog(820, 690, 0.82);
    this.drawFallenLog(1180, 760, 0.92);
  }

  drawFallenLog(x, y, scale) {
    const g = this.add.graphics().setDepth(y);
    g.fillStyle(0x06100b, 0.30); g.fillEllipse(x + 8, y + 13, 126 * scale, 25 * scale);
    g.lineStyle(21 * scale, 0x4d3824, 1); g.lineBetween(x - 52 * scale, y, x + 55 * scale, y + 9 * scale);
    g.lineStyle(5 * scale, 0x81603c, 0.58); g.lineBetween(x - 48 * scale, y - 4, x + 48 * scale, y + 5);
    g.fillStyle(0x6b4d31); g.fillCircle(x + 56 * scale, y + 9 * scale, 11 * scale);
    g.fillStyle(0x243f2a, 0.92); g.fillCircle(x - 16, y - 10, 9 * scale); g.fillCircle(x + 15, y + 3, 7 * scale);
  }

  createPlayer() {
    const ring = this.add.graphics();
    ring.lineStyle(2, 0xe7d28a, 0.66); ring.strokeEllipse(0, 13, 46, 17);
    const body = this.add.image(0, 7, 'ps-player').setOrigin(0.5, 1).setScale(0.88);
    this.player = this.add.container(145, 920, [ring, body]).setDepth(920);
    this.player.bodyArt = body;
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(26, 26);
    this.player.body.setOffset(-13, -4);
  }

  createEnemies() {
    this.enemies = [];
    const defs = [
      { id: 'brush_rat_1', name: 'Brush Rat', level: 1, x: 390, y: 790, hp: 20, reward: 2, kind: 'rat', texture: 'ps-rat' },
      { id: 'brush_rat_2', name: 'Brush Rat', level: 1, x: 550, y: 675, hp: 20, reward: 2, kind: 'rat', texture: 'ps-rat' },
      { id: 'young_jackal', name: 'Young Jackal', level: 2, x: 755, y: 565, hp: 29, reward: 3, kind: 'jackal', texture: 'ps-jackal' },
      { id: 'thorn_crawler', name: 'Thorn Crawler', level: 2, x: 720, y: 835, hp: 31, reward: 3, kind: 'crawler', texture: 'ps-crawler' },
      { id: 'creek_rat', name: 'Creek Rat', level: 1, x: 985, y: 700, hp: 22, reward: 2, kind: 'rat', texture: 'ps-rat' },
      { id: 'rune_jackal', name: 'Rune Jackal', level: 3, x: 830, y: 335, hp: 40, reward: 5, kind: 'jackal', texture: 'ps-jackal' }
    ];
    defs.forEach((def, index) => this.spawnEnemy(def, index));
  }

  spawnEnemy(def, index) {
    const aura = this.add.graphics();
    aura.fillStyle(0x9a342b, 0.15); aura.fillEllipse(0, 18, 64, 24);
    aura.lineStyle(2, 0xd4b269, 0.72); aura.strokeEllipse(0, 18, 64, 24);

    const body = this.add.image(0, 10, def.texture).setOrigin(0.5, 1).setScale(def.kind === 'jackal' ? 0.78 : 0.84);
    const hpBack = this.add.graphics(); hpBack.fillStyle(0x050806, 0.92); hpBack.fillRoundedRect(-28, -41, 56, 7, 3);
    const hpFill = this.add.graphics();
    const badge = this.add.text(0, -56, String(def.level), {
      fontFamily: 'Georgia, serif', fontSize: '13px', fontStyle: 'bold', color: '#ffe3a1',
      stroke: '#100d09', strokeThickness: 5
    }).setOrigin(0.5);
    const name = this.add.text(0, 36, def.name, {
      fontFamily: 'Georgia, serif', fontSize: '11px', color: '#efe1ba', stroke: '#06100b', strokeThickness: 4
    }).setOrigin(0.5);

    const enemy = this.add.container(def.x, def.y, [aura, body, hpBack, hpFill, badge, name]);
    enemy.setSize(82, 90).setInteractive({ useHandCursor: true }).setDepth(def.y);
    enemy.def = def; enemy.maxHP = def.hp; enemy.hp = def.hp; enemy.alive = true;
    enemy.hpFill = hpFill; enemy.aura = aura; enemy.bodyArt = body; enemy.respawnAt = 0; enemy.nextAttackAt = 0;
    enemy.homeX = def.x; enemy.homeY = def.y;
    enemy.on('pointerdown', pointer => { pointer.event?.stopPropagation?.(); this.selectEnemy(enemy); });

    this.tweens.add({ targets: aura, scaleX: 1.10, scaleY: 1.10, alpha: 0.58, duration: 900 + index * 75, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.tweens.add({ targets: body, y: 7, duration: 950 + index * 90, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.enemies.push(enemy);
    this.redrawEnemyHP(enemy);
  }

  selectEnemy(enemy) {
    if (!enemy.alive) return;
    this.selectedEnemy = enemy;
    this.moveTarget = null;
    this.targetNameText.setText(`${enemy.def.name}  ·  Level ${enemy.def.level}`);
    this.enemies.forEach(e => {
      e.aura.clear();
      const selected = e === enemy;
      e.aura.fillStyle(selected ? 0xc84d31 : 0x9a342b, selected ? 0.30 : 0.15);
      e.aura.fillEllipse(0, 18, selected ? 74 : 64, selected ? 29 : 24);
      e.aura.lineStyle(selected ? 3 : 2, selected ? 0xffe29a : 0xd4b269, selected ? 1 : 0.72);
      e.aura.strokeEllipse(0, 18, selected ? 74 : 64, selected ? 29 : 24);
    });
  }

  redrawEnemyHP(enemy) {
    enemy.hpFill.clear();
    if (!enemy.alive) return;
    const ratio = Phaser.Math.Clamp(enemy.hp / enemy.maxHP, 0, 1);
    enemy.hpFill.fillStyle(ratio > 0.45 ? 0x7baa55 : 0xb54a35, 1);
    enemy.hpFill.fillRoundedRect(-27, -40, 54 * ratio, 5, 2);
  }

  createAmbientLife() {
    this.fireflies = [];
    for (let i = 0; i < 22; i += 1) {
      const x = 120 + ((i * 191) % 1190); const y = 130 + ((i * 127) % 820);
      const glow = this.add.graphics().setDepth(y + 10);
      glow.fillStyle(0xd7df7a, 0.16); glow.fillCircle(0, 0, 8);
      glow.fillStyle(0xf2e990, 0.70); glow.fillCircle(0, 0, 2);
      glow.setPosition(x, y);
      this.tweens.add({ targets: glow, x: x + 18 - (i % 5) * 7, y: y - 18 - (i % 3) * 9, alpha: { from: 0.25, to: 0.9 }, duration: 1700 + i * 67, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      this.fireflies.push(glow);
    }

    const mist = this.add.graphics().setScrollFactor(0).setDepth(3500);
    mist.fillStyle(0xbfd0b2, 0.028); mist.fillEllipse(this.W * 0.20, this.H * 0.38, this.W * 0.72, this.H * 0.18);
    mist.fillEllipse(this.W * 0.82, this.H * 0.70, this.W * 0.80, this.H * 0.21);
    this.tweens.add({ targets: mist, x: 18, alpha: { from: 0.55, to: 1 }, duration: 4800, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    const rays = this.add.graphics().setScrollFactor(0).setDepth(3499);
    rays.fillStyle(0xdbe7af, 0.035); rays.fillTriangle(this.W * 0.06, 0, this.W * 0.37, 0, this.W * 0.26, this.H * 0.78);
    rays.fillTriangle(this.W * 0.62, 0, this.W * 0.91, 0, this.W * 0.77, this.H * 0.67);

    const frame = this.add.graphics().setScrollFactor(0).setDepth(5000);
    frame.fillStyle(0x020605, 0.22); frame.fillRect(0, 0, this.W, 10); frame.fillRect(0, this.H - 10, this.W, 10);
    frame.fillRect(0, 0, 8, this.H); frame.fillRect(this.W - 8, 0, 8, this.H);
    frame.fillStyle(0x07110c, 0.42); frame.fillCircle(-18, -10, 95); frame.fillCircle(this.W + 20, -16, 100);
    frame.fillStyle(0x183624, 0.72);
    for (let i = 0; i < 7; i += 1) { frame.fillEllipse(i * 31 - 12, 8 + (i % 2) * 12, 54, 22); frame.fillEllipse(this.W - i * 31 + 10, 10 + ((i + 1) % 2) * 10, 52, 21); }
  }

  createControls() {
    this.cursors = this.input.keyboard ? this.input.keyboard.createCursorKeys() : null;
    this.joy = { active: false, id: null, baseX: 0, baseY: 0, dx: 0, dy: 0 };
    this.joyBase = this.add.graphics().setScrollFactor(0).setDepth(6000);
    this.joyKnob = this.add.graphics().setScrollFactor(0).setDepth(6001);
  }

  setupInput() {
    this.input.on('pointerdown', pointer => {
      if (pointer.y < 64 || pointer.y > this.H - 54) return;
      if (pointer.x < this.W * 0.48 && pointer.y > this.H * 0.60) {
        this.joy.active = true; this.joy.id = pointer.id; this.joy.baseX = pointer.x; this.joy.baseY = pointer.y;
        this.joy.dx = 0; this.joy.dy = 0; this.selectedEnemy = null; this.drawJoystick(); return;
      }
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const tappedEnemy = this.enemies.find(enemy => enemy.alive && Phaser.Math.Distance.Between(worldPoint.x, worldPoint.y, enemy.x, enemy.y) < 54);
      if (tappedEnemy) { this.selectEnemy(tappedEnemy); return; }
      this.selectedEnemy = null; this.moveTarget = { x: worldPoint.x, y: worldPoint.y }; this.showMoveMarker(worldPoint.x, worldPoint.y);
    });

    this.input.on('pointermove', pointer => {
      if (!this.joy.active || pointer.id !== this.joy.id) return;
      const dx = pointer.x - this.joy.baseX; const dy = pointer.y - this.joy.baseY;
      const distance = Math.sqrt(dx * dx + dy * dy); const max = 48; const angle = Math.atan2(dy, dx); const amount = Math.min(distance, max) / max;
      this.joy.dx = Math.cos(angle) * amount; this.joy.dy = Math.sin(angle) * amount; this.drawJoystick();
    });

    const release = pointer => {
      if (pointer && pointer.id !== this.joy.id) return;
      this.joy.active = false; this.joy.dx = 0; this.joy.dy = 0; this.joyBase.clear(); this.joyKnob.clear();
    };
    this.input.on('pointerup', release); this.input.on('pointercancel', release);
  }

  drawJoystick() {
    this.joyBase.clear(); this.joyKnob.clear();
    this.joyBase.fillStyle(0x07110c, 0.52); this.joyBase.fillCircle(this.joy.baseX, this.joy.baseY, 48);
    this.joyBase.lineStyle(2, 0xbaca91, 0.42); this.joyBase.strokeCircle(this.joy.baseX, this.joy.baseY, 48);
    this.joyBase.lineStyle(1, 0xeff0c5, 0.16); this.joyBase.strokeCircle(this.joy.baseX, this.joy.baseY, 33);
    this.joyKnob.fillStyle(0xd0b86f, 0.86); this.joyKnob.fillCircle(this.joy.baseX + this.joy.dx * 48, this.joy.baseY + this.joy.dy * 48, 18);
    this.joyKnob.lineStyle(2, 0xffe9aa, 0.48); this.joyKnob.strokeCircle(this.joy.baseX + this.joy.dx * 48, this.joy.baseY + this.joy.dy * 48, 18);
  }

  showMoveMarker(x, y) {
    if (this.moveMarker) this.moveMarker.destroy();
    const marker = this.add.graphics().setDepth(y + 1);
    marker.lineStyle(2, 0xe2d089, 0.78); marker.strokeCircle(x, y, 17); marker.lineStyle(1, 0xffffff, 0.35); marker.strokeCircle(x, y, 9);
    this.moveMarker = marker;
    this.tweens.add({ targets: marker, alpha: 0, scaleX: 1.7, scaleY: 1.7, duration: 520, ease: 'Power2', onComplete: () => marker.destroy() });
  }

  createHUD() {
    const top = this.add.graphics().setScrollFactor(0).setDepth(7000);
    top.fillStyle(0x06100c, 0.88); top.fillRoundedRect(8, 7, this.W - 16, 50, 14);
    top.lineStyle(1, 0xb9a46a, 0.42); top.strokeRoundedRect(8, 7, this.W - 16, 50, 14);

    const exitG = this.add.graphics().setScrollFactor(0).setDepth(7001);
    exitG.fillStyle(0x263526, 0.98); exitG.fillRoundedRect(14, 13, 68, 38, 11); exitG.lineStyle(1, 0xd2bd7c, 0.56); exitG.strokeRoundedRect(14, 13, 68, 38, 11);
    this.add.text(48, 32, '←  Cave', { fontFamily: 'Georgia, serif', fontSize: '12px', color: '#ecddb0' }).setScrollFactor(0).setDepth(7002).setOrigin(0.5);
    this.add.zone(48, 32, 68, 38).setScrollFactor(0).setDepth(7003).setInteractive().on('pointerdown', () => this.exitForest());

    this.add.text(this.W / 2, 14, 'WEAKWOOD GROVE', {
      fontFamily: 'Georgia, serif', fontSize: '15px', fontStyle: 'bold', color: '#ddc980', letterSpacing: 2
    }).setScrollFactor(0).setDepth(7002).setOrigin(0.5, 0);
    this.add.text(this.W / 2, 36, 'Tap a creature to hunt', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#8fa189'
    }).setScrollFactor(0).setDepth(7002).setOrigin(0.5, 0);

    this.coinText = this.add.text(this.W - 16, 17, '', { fontFamily: 'Georgia, serif', fontSize: '12px', color: '#f1d477' }).setScrollFactor(0).setDepth(7002).setOrigin(1, 0);
    this.killText = this.add.text(this.W - 16, 37, '', { fontFamily: 'Georgia, serif', fontSize: '10px', color: '#a7b99a' }).setScrollFactor(0).setDepth(7002).setOrigin(1, 0);

    const bottom = this.add.graphics().setScrollFactor(0).setDepth(7000);
    bottom.fillStyle(0x06100c, 0.86); bottom.fillRoundedRect(8, this.H - 48, this.W - 16, 40, 14);
    bottom.lineStyle(1, 0xb9a46a, 0.34); bottom.strokeRoundedRect(8, this.H - 48, this.W - 16, 40, 14);
    bottom.fillStyle(0x121b15, 1); bottom.fillRoundedRect(16, this.H - 33, 120, 10, 5);

    this.healthBar = this.add.graphics().setScrollFactor(0).setDepth(7001);
    this.healthText = this.add.text(76, this.H - 45, '', { fontFamily: 'system-ui', fontSize: '9px', color: '#e7eadc' }).setScrollFactor(0).setDepth(7002).setOrigin(0.5, 0);
    this.targetNameText = this.add.text(this.W * 0.64, this.H - 28, 'Explore the grove', {
      fontFamily: 'Georgia, serif', fontSize: '12px', color: '#d1d9c0', stroke: '#041009', strokeThickness: 3
    }).setScrollFactor(0).setDepth(7002).setOrigin(0.5);
  }

  updateHUD() {
    this.coinText.setText(`⚜ ${this.playerData.gold}`);
    this.killText.setText(`Defeated ${this.playerData.forestDefeats}`);
    this.healthText.setText(`Health ${Math.ceil(this.playerHP)}/${this.maxPlayerHP}`);
    this.healthBar.clear();
    const ratio = Phaser.Math.Clamp(this.playerHP / this.maxPlayerHP, 0, 1);
    this.healthBar.fillStyle(ratio > 0.4 ? 0x78a653 : 0xb64d37, 1); this.healthBar.fillRoundedRect(17, this.H - 32, 118 * ratio, 8, 4);
    this.healthBar.lineStyle(1, 0xe7e2bd, 0.24); this.healthBar.strokeRoundedRect(16, this.H - 33, 120, 10, 5);
  }

  exitForest() {
    SaveSystem.autoSave(this.playerData, this.returnTown.id);
    this.cameras.main.fade(350, 0, 0, 0);
    this.time.delayedCall(350, () => {
      this.scene.start('LocationMapScene', { town: this.returnTown, playerData: this.playerData, saveSlot: this.saveSlot, spawnX: 620, spawnY: 205 });
    });
  }

  attackEnemy(enemy, time) {
    if (!enemy.alive || time < this.attackTimer) return;
    this.attackTimer = time + 530;
    const damage = Phaser.Math.Between(7, 11);
    enemy.hp -= damage; this.redrawEnemyHP(enemy);

    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
    const originX = this.player.x; const originY = this.player.y;
    this.tweens.add({ targets: this.player, x: originX + Math.cos(angle) * 14, y: originY + Math.sin(angle) * 9, duration: 90, yoyo: true, ease: 'Quad.Out' });
    this.showStrike(enemy.x, enemy.y, 0xf1d785);
    this.floatText(enemy.x, enemy.y - 62, `-${damage}`, '#ffe0a0');
    this.tweens.add({ targets: enemy.bodyArt, angle: enemy.x > this.player.x ? 7 : -7, alpha: 0.52, duration: 70, yoyo: true });

    if (enemy.hp <= 0) { this.defeatEnemy(enemy, time); return; }

    if (time >= enemy.nextAttackAt) {
      enemy.nextAttackAt = time + 900;
      const retaliation = Phaser.Math.Between(2, 5);
      this.playerHP = Math.max(0, this.playerHP - retaliation);
      this.showStrike(this.player.x, this.player.y, 0xc65d44);
      this.floatText(this.player.x, this.player.y - 56, `-${retaliation}`, '#ffad91');
      this.tweens.add({ targets: this.player.bodyArt, alpha: 0.42, angle: enemy.x > this.player.x ? -6 : 6, duration: 75, yoyo: true });
      if (this.playerHP <= 0) this.playerDefeated();
    }
    this.updateHUD();
  }

  showStrike(x, y, colour) {
    const fx = this.add.graphics().setDepth(y + 120);
    fx.lineStyle(6, colour, 0.96); fx.beginPath(); fx.arc(x, y - 22, 28, -1.1, 0.65); fx.strokePath();
    fx.lineStyle(2, 0xffffff, 0.72); fx.beginPath(); fx.arc(x + 3, y - 25, 20, -1.0, 0.55); fx.strokePath();
    fx.fillStyle(colour, 0.25); fx.fillCircle(x, y - 20, 20);
    this.tweens.add({ targets: fx, alpha: 0, scaleX: 1.25, scaleY: 1.25, duration: 170, onComplete: () => fx.destroy() });
  }

  floatText(x, y, text, colour) {
    const label = this.add.text(x, y, text, { fontFamily: 'Georgia, serif', fontSize: '16px', fontStyle: 'bold', color: colour, stroke: '#06100b', strokeThickness: 4 }).setOrigin(0.5).setDepth(y + 150);
    this.tweens.add({ targets: label, y: y - 35, alpha: 0, duration: 690, ease: 'Power2', onComplete: () => label.destroy() });
  }

  defeatEnemy(enemy, time) {
    enemy.alive = false; enemy.hp = 0; enemy.respawnAt = time + 8000; enemy.disableInteractive(); this.redrawEnemyHP(enemy);
    const burst = this.add.graphics().setDepth(enemy.y + 150);
    burst.fillStyle(0xe4c66e, 0.60);
    for (let i = 0; i < 8; i += 1) { const a = (Math.PI * 2 * i) / 8; burst.fillCircle(enemy.x + Math.cos(a) * 18, enemy.y - 22 + Math.sin(a) * 14, 3); }
    this.tweens.add({ targets: burst, alpha: 0, scaleX: 1.7, scaleY: 1.7, duration: 380, onComplete: () => burst.destroy() });
    this.tweens.add({ targets: enemy, alpha: 0, scaleX: 0.72, scaleY: 0.72, y: enemy.y - 12, duration: 260 });

    const reward = enemy.def.reward;
    this.playerData.gold += reward; this.playerData.forestDefeats += 1; this.playerHP = Math.min(this.maxPlayerHP, this.playerHP + 8);
    this.floatText(enemy.x, enemy.y - 68, `+${reward} coins`, '#f4d66e');
    this.targetNameText.setText(`${enemy.def.name} defeated`); this.selectedEnemy = null;
    SaveSystem.autoSave(this.playerData, this.returnTown.id); this.updateHUD();
  }

  respawnEnemy(enemy) {
    enemy.alive = true; enemy.hp = enemy.maxHP; enemy.respawnAt = 0; enemy.nextAttackAt = 0;
    enemy.setPosition(enemy.homeX, enemy.homeY); enemy.setScale(1); enemy.setAlpha(1); enemy.setInteractive({ useHandCursor: true });
    this.redrawEnemyHP(enemy);
    this.tweens.add({ targets: enemy, alpha: { from: 0.08, to: 1 }, scaleX: { from: 0.75, to: 1 }, scaleY: { from: 0.75, to: 1 }, duration: 420, ease: 'Back.Out' });
  }

  playerDefeated() {
    this.playerHP = this.maxPlayerHP; this.selectedEnemy = null; this.moveTarget = null; this.player.setPosition(145, 920);
    this.cameras.main.flash(260, 105, 22, 18); this.targetNameText.setText('You retreat to the cave and recover'); this.updateHUD();
  }

  update(time, delta) {
    const speed = 185;
    let vx = 0; let vy = 0;
    if (this.cursors) {
      if (this.cursors.left.isDown) vx -= 1; if (this.cursors.right.isDown) vx += 1;
      if (this.cursors.up.isDown) vy -= 1; if (this.cursors.down.isDown) vy += 1;
    }
    if (this.joy.active) { vx += this.joy.dx; vy += this.joy.dy; }

    const manual = Math.abs(vx) > 0.04 || Math.abs(vy) > 0.04;
    if (manual) { this.selectedEnemy = null; this.moveTarget = null; }
    else if (this.selectedEnemy && this.selectedEnemy.alive) {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.selectedEnemy.x, this.selectedEnemy.y);
      if (distance > 62) {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.selectedEnemy.x, this.selectedEnemy.y);
        vx = Math.cos(angle); vy = Math.sin(angle);
      } else this.attackEnemy(this.selectedEnemy, time);
    } else if (this.moveTarget) {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.moveTarget.x, this.moveTarget.y);
      if (distance > 8) {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.moveTarget.x, this.moveTarget.y);
        vx = Math.cos(angle); vy = Math.sin(angle);
      } else this.moveTarget = null;
    }

    const length = Math.sqrt(vx * vx + vy * vy);
    if (length > 0) {
      vx /= Math.max(1, length); vy /= Math.max(1, length);
      this.player.body.setVelocity(vx * speed, vy * speed); this.player.setDepth(this.player.y + 30);
      this.player.bodyArt.setFlipX(vx < -0.05); this.player.bodyArt.rotation = Math.sin(time * 0.018) * 0.022;
    } else {
      this.player.body.setVelocity(0, 0); this.player.bodyArt.rotation = 0;
      if (!this.selectedEnemy && this.playerHP < this.maxPlayerHP) this.playerHP = Math.min(this.maxPlayerHP, this.playerHP + delta * 0.003);
    }

    this.enemies.forEach(enemy => {
      enemy.setDepth(enemy.y);
      if (!enemy.alive && enemy.respawnAt > 0 && time >= enemy.respawnAt) this.respawnEnemy(enemy);
    });
    this.updateHUD();
  }
}
