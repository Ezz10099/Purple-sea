// ================================================================
//  FOREST VISUAL UPGRADE
//  Improves enemy silhouettes and prevents tree crowns from hiding
//  the player or living enemies. Loaded after ForestScene.js.
// ================================================================

(() => {
  'use strict';

  if (typeof ForestScene === 'undefined') return;

  const originalGenerateProceduralArt = ForestScene.prototype.generateProceduralArt;
  ForestScene.prototype.generateProceduralArt = function generateUpgradedForestArt() {
    originalGenerateProceduralArt.call(this);

    this.makeTexture('ps-rat-v2', 118, 84, g => {
      g.fillStyle(0x030806, 0.46); g.fillEllipse(62, 76, 82, 16);
      g.lineStyle(7, 0x241b16, 1); g.beginPath(); g.moveTo(35, 53); g.lineTo(14, 43); g.lineTo(4, 51); g.strokePath();
      g.lineStyle(3, 0xa57b61, 0.75); g.beginPath(); g.moveTo(34, 51); g.lineTo(14, 44); g.lineTo(5, 50); g.strokePath();

      g.fillStyle(0x211b17); g.fillEllipse(52, 49, 64, 38); g.fillCircle(88, 43, 21);
      g.fillStyle(0x806a52); g.fillEllipse(50, 46, 58, 32); g.fillCircle(86, 42, 17);
      g.fillStyle(0xaa9170, 0.88); g.fillEllipse(48, 40, 38, 16); g.fillEllipse(91, 49, 21, 12);
      g.fillStyle(0x5d4b3c); g.fillEllipse(49, 55, 48, 16);

      g.fillStyle(0x2b211b); g.fillCircle(77, 25, 12); g.fillCircle(96, 25, 12);
      g.fillStyle(0xb58a7c); g.fillCircle(78, 26, 7); g.fillCircle(96, 26, 7);
      g.fillStyle(0x17120f); g.fillCircle(91, 39, 3); g.fillCircle(103, 48, 3);
      g.fillStyle(0xf1c96a); g.fillCircle(91, 38, 1.4);

      g.lineStyle(2, 0xd8cbb3, 0.78);
      g.lineBetween(95, 47, 114, 41); g.lineBetween(95, 50, 116, 50); g.lineBetween(95, 52, 113, 59);
      g.lineStyle(5, 0x2b211b, 1); g.lineBetween(39, 62, 35, 76); g.lineBetween(66, 62, 70, 76);
      g.lineStyle(2, 0xb49a75, 0.9); g.lineBetween(34, 76, 27, 78); g.lineBetween(69, 76, 77, 78);
      g.lineStyle(2, 0xd8c49a, 0.55); g.strokeEllipse(50, 46, 58, 32);
    });

    this.makeTexture('ps-jackal-v2', 142, 106, g => {
      g.fillStyle(0x030806, 0.46); g.fillEllipse(74, 98, 104, 20);
      g.lineStyle(13, 0x241a13, 1); g.beginPath(); g.moveTo(38, 58); g.lineTo(12, 40); g.lineTo(29, 69); g.strokePath();
      g.lineStyle(7, 0x9d6a3d, 1); g.beginPath(); g.moveTo(39, 57); g.lineTo(15, 42); g.lineTo(31, 67); g.strokePath();

      g.fillStyle(0x261a12); g.fillEllipse(66, 61, 82, 45); g.fillCircle(108, 48, 28);
      g.fillStyle(0x9a6638); g.fillEllipse(64, 58, 76, 39); g.fillCircle(106, 47, 23);
      g.fillStyle(0xc68a4f); g.fillEllipse(69, 48, 47, 19); g.fillTriangle(93, 30, 95, 4, 106, 31); g.fillTriangle(108, 29, 129, 7, 124, 38);
      g.fillStyle(0x3c291d); g.fillTriangle(97, 27, 98, 12, 104, 29); g.fillTriangle(112, 27, 125, 13, 121, 34);
      g.fillStyle(0xead0a0, 0.84); g.fillTriangle(103, 46, 135, 57, 105, 64); g.fillEllipse(99, 66, 24, 18);
      g.fillStyle(0x17100c); g.fillCircle(116, 45, 3); g.fillCircle(135, 57, 4);
      g.fillStyle(0xf1c15e); g.fillCircle(116, 44, 1.5);

      g.fillStyle(0x2f2118); g.fillRoundedRect(43, 72, 9, 28, 4); g.fillRoundedRect(78, 72, 9, 28, 4);
      g.fillStyle(0xb77b43); g.fillRoundedRect(46, 70, 5, 23, 3); g.fillRoundedRect(81, 70, 5, 23, 3);
      g.fillStyle(0x19110d); g.fillRect(40, 96, 16, 5); g.fillRect(75, 96, 16, 5);
      g.lineStyle(2, 0xe2bb78, 0.48); g.strokeEllipse(64, 58, 76, 39);
      g.lineStyle(3, 0x4a2e1d, 0.9); g.lineBetween(88, 57, 105, 61);
    });

    this.makeTexture('ps-crawler-v2', 118, 112, g => {
      g.fillStyle(0x030806, 0.46); g.fillEllipse(59, 103, 86, 18);
      g.fillStyle(0x1a2c1d);
      for (let i = 0; i < 10; i += 1) {
        const a = (Math.PI * 2 * i) / 10;
        const x1 = 59 + Math.cos(a) * 29; const y1 = 59 + Math.sin(a) * 29;
        const x2 = 59 + Math.cos(a - 0.16) * 49; const y2 = 59 + Math.sin(a - 0.16) * 49;
        const x3 = 59 + Math.cos(a + 0.16) * 49; const y3 = 59 + Math.sin(a + 0.16) * 49;
        g.fillTriangle(x1, y1, x2, y2, x3, y3);
      }
      g.fillStyle(0x416b3b); g.fillCircle(59, 59, 34);
      g.fillStyle(0x68964f); g.fillCircle(59, 54, 25);
      g.fillStyle(0x8db565, 0.72); g.fillEllipse(50, 43, 23, 12); g.fillEllipse(69, 50, 18, 10);
      g.fillStyle(0x263f27); g.fillCircle(45, 64, 12); g.fillCircle(74, 65, 13);
      g.fillStyle(0x151e15); g.fillCircle(49, 53, 5); g.fillCircle(69, 53, 5);
      g.fillStyle(0xe4ef74); g.fillCircle(49, 52, 2); g.fillCircle(69, 52, 2);
      g.lineStyle(5, 0x243b25, 1);
      g.lineBetween(39, 79, 28, 101); g.lineBetween(51, 86, 47, 106); g.lineBetween(67, 86, 72, 106); g.lineBetween(80, 79, 92, 101);
      g.lineStyle(2, 0xa8c778, 0.5); g.strokeCircle(59, 58, 34);
    });
  };

  const originalCreateEnvironment = ForestScene.prototype.createEnvironment;
  ForestScene.prototype.createEnvironment = function createReadableForestEnvironment() {
    originalCreateEnvironment.call(this);
    const treeKeys = new Set(['ps-tree-cedar-a', 'ps-tree-cedar-b', 'ps-tree-olive']);
    this.treeCanopies = this.children.list.filter(child => child.texture && treeKeys.has(child.texture.key));
    this.treeCanopies.forEach(tree => {
      tree.setData('normalAlpha', tree.alpha);
      tree.setData('canopyRadiusX', tree.texture.key === 'ps-tree-olive' ? 58 * tree.scaleX : 82 * tree.scaleX);
      tree.setData('canopyHeight', tree.texture.key === 'ps-tree-olive' ? 118 * tree.scaleY : 168 * tree.scaleY);
    });
  };

  ForestScene.prototype.createEnemies = function createReadableEnemies() {
    this.enemies = [];
    const defs = [
      { id: 'brush_rat_1', name: 'Brush Rat', level: 1, x: 360, y: 820, hp: 20, reward: 2, kind: 'rat', texture: 'ps-rat-v2' },
      { id: 'brush_rat_2', name: 'Brush Rat', level: 1, x: 535, y: 690, hp: 20, reward: 2, kind: 'rat', texture: 'ps-rat-v2' },
      { id: 'young_jackal', name: 'Young Jackal', level: 2, x: 715, y: 575, hp: 29, reward: 3, kind: 'jackal', texture: 'ps-jackal-v2' },
      { id: 'thorn_crawler', name: 'Thorn Crawler', level: 2, x: 750, y: 865, hp: 31, reward: 3, kind: 'crawler', texture: 'ps-crawler-v2' },
      { id: 'creek_rat', name: 'Creek Rat', level: 1, x: 960, y: 715, hp: 22, reward: 2, kind: 'rat', texture: 'ps-rat-v2' },
      { id: 'rune_jackal', name: 'Rune Jackal', level: 3, x: 800, y: 365, hp: 40, reward: 5, kind: 'jackal', texture: 'ps-jackal-v2' }
    ];
    defs.forEach((def, index) => this.spawnEnemy(def, index));
  };

  const originalSpawnEnemy = ForestScene.prototype.spawnEnemy;
  ForestScene.prototype.spawnEnemy = function spawnReadableEnemy(def, index) {
    originalSpawnEnemy.call(this, def, index);
    const enemy = this.enemies[this.enemies.length - 1];
    if (!enemy) return;

    const scale = def.kind === 'jackal' ? 0.74 : def.kind === 'crawler' ? 0.78 : 0.82;
    enemy.bodyArt.setScale(scale);

    const outline = this.add.image(enemy.bodyArt.x, enemy.bodyArt.y, def.texture)
      .setOrigin(enemy.bodyArt.originX, enemy.bodyArt.originY)
      .setScale(scale * 1.08)
      .setTintFill(0xf4ddb0)
      .setAlpha(0.28);
    enemy.addAt(outline, 1);
    enemy.outlineArt = outline;

    enemy.setSize(def.kind === 'jackal' ? 112 : 96, 104);

    const markerArt = this.add.graphics();
    markerArt.fillStyle(0x07100c, 0.82); markerArt.fillCircle(0, 0, 10);
    markerArt.lineStyle(2, 0xf2d181, 0.92); markerArt.strokeCircle(0, 0, 10);
    markerArt.fillStyle(0xf2d181, 1); markerArt.fillTriangle(-5, 10, 5, 10, 0, 18);
    const markerLevel = this.add.text(0, 0, String(def.level), {
      fontFamily: 'Georgia, serif', fontSize: '10px', fontStyle: 'bold', color: '#fff0bd'
    }).setOrigin(0.5);
    enemy.visibilityMarker = this.add.container(enemy.x, enemy.y - 80, [markerArt, markerLevel]).setDepth(2600);
  };

  const originalSelectEnemy = ForestScene.prototype.selectEnemy;
  ForestScene.prototype.selectEnemy = function selectReadableEnemy(enemy) {
    originalSelectEnemy.call(this, enemy);
    this.enemies.forEach(item => {
      if (!item.visibilityMarker) return;
      const selected = item === enemy;
      item.visibilityMarker.setScale(selected ? 1.24 : 1);
      item.visibilityMarker.setAlpha(selected ? 1 : 0.82);
    });
  };

  ForestScene.prototype.updateTreeOcclusion = function updateTreeOcclusion() {
    if (!this.treeCanopies || !this.player) return;
    const actors = [this.player, ...(this.enemies || []).filter(enemy => enemy.alive)];

    this.treeCanopies.forEach(tree => {
      const radiusX = tree.getData('canopyRadiusX') || 80;
      const canopyHeight = tree.getData('canopyHeight') || 160;
      const obscuresActor = actors.some(actor => {
        if (!actor || tree.depth <= actor.depth) return false;
        const dx = Math.abs(actor.x - tree.x);
        const insideVerticalCanopy = actor.y >= tree.y - canopyHeight && actor.y <= tree.y + 12;
        return dx <= radiusX && insideVerticalCanopy;
      });
      const targetAlpha = obscuresActor ? 0.30 : (tree.getData('normalAlpha') || 1);
      tree.alpha = Phaser.Math.Linear(tree.alpha, targetAlpha, 0.20);
    });
  };

  ForestScene.prototype.updateEnemyMarkers = function updateEnemyMarkers() {
    (this.enemies || []).forEach(enemy => {
      if (!enemy.visibilityMarker) return;
      if (enemy.outlineArt && enemy.bodyArt) {
        enemy.outlineArt.setPosition(enemy.bodyArt.x, enemy.bodyArt.y);
        enemy.outlineArt.setRotation(enemy.bodyArt.rotation);
      }
      enemy.visibilityMarker.setPosition(enemy.x, enemy.y - (enemy.def.kind === 'jackal' ? 92 : 82));
      enemy.visibilityMarker.setVisible(enemy.alive && enemy.alpha > 0.08);
      enemy.visibilityMarker.setAlpha(enemy === this.selectedEnemy ? 1 : 0.82);
    });
  };

  const originalUpdate = ForestScene.prototype.update;
  ForestScene.prototype.update = function updateReadableForest(time, delta) {
    originalUpdate.call(this, time, delta);
    this.updateTreeOcclusion();
    this.updateEnemyMarkers();
  };
})();
