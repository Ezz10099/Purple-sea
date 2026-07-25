// ================================================================
//  FOREST SCENE — Weakwood Grove
//  Procedural, asset-free farming area reached through Kefr-Yamm's
//  cliff cave. Visible weak enemies, direct movement, auto-combat.
// ================================================================

class ForestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ForestScene' });
  }

  create(data) {
    this.W = this.cameras.main.width;
    this.H = this.cameras.main.height;
    this.WORLD_W = 1120;
    this.WORLD_H = 900;

    this.playerData = data.playerData || JSON.parse(JSON.stringify(GAME_DATA.player));
    this.saveSlot = data.saveSlot || null;
    this.returnTown = data.returnTown || GAME_DATA.towns.find(t => t.id === 'kefr-yamm');
    this.playerData.forestDefeats = Number(this.playerData.forestDefeats || 0);

    this.physics.world.setBounds(0, 0, this.WORLD_W, this.WORLD_H);
    this.cameras.main.setBounds(0, 0, this.WORLD_W, this.WORLD_H);
    this.cameras.main.setBackgroundColor('#0b2118');

    this.drawForest();
    this.createEnemies();
    this.createPlayer();
    this.createControls();
    this.createHUD();
    this.setupInput();

    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setDeadzone(this.W * 0.22, this.H * 0.24);
    this.cameras.main.fadeIn(500, 4, 12, 8);

    this.selectedEnemy = null;
    this.moveTarget = null;
    this.attackTimer = 0;
    this.playerHP = 100;
    this.maxPlayerHP = 100;
    this.updateHUD();

    SaveSystem.autoSave(this.playerData, this.returnTown.id);
  }

  drawForest() {
    const g = this.add.graphics().setDepth(0);

    g.fillStyle(0x173a27);
    g.fillRect(0, 0, this.WORLD_W, this.WORLD_H);
    g.fillStyle(0x254a31, 0.9);
    g.fillEllipse(530, 420, 760, 530);
    g.fillStyle(0x314f32, 0.72);
    g.fillEllipse(780, 650, 620, 360);
    g.fillStyle(0x102f24, 0.8);
    g.fillEllipse(220, 200, 470, 330);

    for (let i = 0; i < 260; i += 1) {
      const x = (i * 83) % this.WORLD_W;
      const y = (i * 137) % this.WORLD_H;
      const r = 2 + (i % 5);
      g.fillStyle(i % 3 === 0 ? 0x506545 : 0x0e2a20, 0.18);
      g.fillEllipse(x, y, r * 2.6, r);
    }

    const trail = [
      { x: 120, y: 790 },
      { x: 220, y: 700 },
      { x: 310, y: 640 },
      { x: 410, y: 570 },
      { x: 520, y: 500 },
      { x: 650, y: 430 },
      { x: 800, y: 360 },
      { x: 970, y: 300 }
    ];
    g.lineStyle(58, 0x7f7654, 0.84);
    g.beginPath();
    g.moveTo(trail[0].x, trail[0].y);
    for (let i = 1; i < trail.length; i += 1) g.lineTo(trail[i].x, trail[i].y);
    g.strokePath();
    g.lineStyle(38, 0xa09168, 0.58);
    g.beginPath();
    g.moveTo(trail[0].x, trail[0].y);
    for (let i = 1; i < trail.length; i += 1) g.lineTo(trail[i].x, trail[i].y);
    g.strokePath();

    g.lineStyle(28, 0x817554, 0.64);
    g.beginPath();
    g.moveTo(540, 500);
    g.lineTo(610, 610);
    g.lineTo(760, 720);
    g.strokePath();

    g.lineStyle(94, 0x071d1a, 0.72);
    g.beginPath();
    g.moveTo(950, -30);
    g.lineTo(900, 130);
    g.lineTo(930, 270);
    g.lineTo(850, 430);
    g.lineTo(880, 590);
    g.lineTo(790, 930);
    g.strokePath();
    g.lineStyle(70, 0x1f5960, 0.96);
    g.beginPath();
    g.moveTo(950, -30);
    g.lineTo(900, 130);
    g.lineTo(930, 270);
    g.lineTo(850, 430);
    g.lineTo(880, 590);
    g.lineTo(790, 930);
    g.strokePath();
    g.lineStyle(3, 0x81b9ad, 0.45);
    for (let i = 0; i < 12; i += 1) {
      const y = 40 + i * 74;
      const x = 925 - Math.sin(i * 1.4) * 42;
      g.lineBetween(x - 16, y, x + 17, y - 4);
    }

    g.fillStyle(0x1a1a17);
    g.fillEllipse(85, 820, 96, 110);
    g.fillStyle(0x090b0a);
    g.fillEllipse(88, 830, 48, 72);
    g.lineStyle(5, 0x5f5b4e, 0.75);
    g.strokeEllipse(85, 820, 96, 110);

    this.drawRuins(600, 365);

    const trees = [
      [70, 80, 1.15], [160, 120, 0.9], [270, 70, 1.08], [390, 110, 0.82],
      [520, 75, 1.1], [660, 90, 0.9], [790, 70, 1.2], [1040, 110, 1.0],
      [90, 250, 0.95], [210, 260, 1.14], [345, 230, 0.82], [490, 220, 1.0],
      [710, 225, 1.08], [1030, 245, 1.18], [110, 420, 1.12], [245, 420, 0.9],
      [360, 395, 1.02], [1030, 430, 1.05], [70, 600, 1.2], [205, 560, 0.94],
      [330, 720, 1.08], [490, 735, 0.88], [620, 790, 1.12], [1000, 680, 1.2],
      [1080, 790, 0.98], [520, 620, 0.78], [690, 610, 0.96], [760, 800, 0.88]
    ];
    trees.forEach(([x, y, scale], index) => this.drawTree(x, y, scale, index));

    const rocks = [
      [145, 690, 24], [280, 610, 18], [440, 530, 22], [690, 470, 20],
      [980, 340, 24], [730, 690, 18], [900, 650, 22], [570, 820, 17]
    ];
    rocks.forEach(([x, y, s], i) => {
      const rock = this.add.graphics().setDepth(y - 8);
      rock.fillStyle(0x08130f, 0.38);
      rock.fillEllipse(x + 5, y + 9, s * 1.8, s * 0.58);
      rock.fillStyle(i % 2 ? 0x5c6758 : 0x6b6f5d);
      rock.fillTriangle(x - s, y + 4, x - s * 0.15, y - s * 0.55, x + s, y + 5);
      rock.fillStyle(0x879078, 0.35);
      rock.fillTriangle(x - s * 0.15, y - s * 0.55, x + s * 0.35, y, x - s * 0.65, y + 2);
    });

    this.drawFallenLog(360, 310, 0.92);
    this.drawFallenLog(760, 560, 0.78);

    const light = this.add.graphics().setDepth(2000).setScrollFactor(0);
    light.fillStyle(0xd4e59b, 0.035);
    light.fillTriangle(this.W * 0.2, 0, this.W * 0.58, 0, this.W * 0.4, this.H);
    light.fillTriangle(this.W * 0.66, 0, this.W * 0.93, 0, this.W * 0.72, this.H * 0.78);

    const vignette = this.add.graphics().setDepth(2001).setScrollFactor(0);
    vignette.fillStyle(0x020705, 0.18);
    vignette.fillRect(0, 0, this.W, 18);
    vignette.fillRect(0, this.H - 18, this.W, 18);
    vignette.fillRect(0, 0, 14, this.H);
    vignette.fillRect(this.W - 14, 0, 14, this.H);
  }

  drawTree(x, y, scale, variant) {
    const shadow = this.add.graphics().setDepth(y - 2);
    shadow.fillStyle(0x04110b, 0.44);
    shadow.fillEllipse(x + 12 * scale, y + 13 * scale, 66 * scale, 23 * scale);

    const trunk = this.add.graphics().setDepth(y);
    trunk.fillStyle(0x463623);
    trunk.fillRect(x - 6 * scale, y - 46 * scale, 12 * scale, 49 * scale);
    trunk.fillStyle(0x735638, 0.68);
    trunk.fillRect(x - 5 * scale, y - 44 * scale, 3 * scale, 43 * scale);

    const crown = this.add.graphics().setDepth(y + 1);
    const dark = variant % 3 === 0 ? 0x153f29 : 0x1c4b2d;
    const mid = variant % 2 === 0 ? 0x2e6840 : 0x357047;
    const light = variant % 3 === 1 ? 0x6e8c55 : 0x587f4b;
    crown.fillStyle(dark);
    crown.fillTriangle(x - 43 * scale, y - 34 * scale, x, y - 96 * scale, x + 44 * scale, y - 34 * scale);
    crown.fillStyle(mid);
    crown.fillTriangle(x - 34 * scale, y - 55 * scale, x + 4 * scale, y - 112 * scale, x + 39 * scale, y - 52 * scale);
    crown.fillStyle(light, 0.82);
    crown.fillTriangle(x - 18 * scale, y - 66 * scale, x + 5 * scale, y - 105 * scale, x + 10 * scale, y - 59 * scale);
    crown.lineStyle(1, 0x0c2519, 0.45);
    crown.strokeTriangle(x - 43 * scale, y - 34 * scale, x, y - 96 * scale, x + 44 * scale, y - 34 * scale);
  }

  drawRuins(x, y) {
    const shadow = this.add.graphics().setDepth(y - 3);
    shadow.fillStyle(0x06110d, 0.38);
    shadow.fillEllipse(x + 18, y + 28, 190, 55);

    const ruin = this.add.graphics().setDepth(y - 1);
    ruin.fillStyle(0x5d6252);
    ruin.fillRect(x - 70, y - 36, 26, 78);
    ruin.fillRect(x + 46, y - 55, 24, 97);
    ruin.fillRect(x - 44, y - 22, 90, 18);
    ruin.fillStyle(0x8f9278, 0.56);
    ruin.fillRect(x - 66, y - 33, 5, 68);
    ruin.fillRect(x + 50, y - 51, 5, 87);
    ruin.fillStyle(0x273f2b, 0.9);
    ruin.fillTriangle(x - 50, y - 28, x - 10, y - 62, x + 15, y - 22);
    ruin.fillTriangle(x + 18, y - 16, x + 52, y - 50, x + 68, y - 8);

    const sigil = this.add.graphics().setDepth(y);
    sigil.lineStyle(3, 0x9bb887, 0.5);
    sigil.strokeCircle(x, y + 18, 30);
    sigil.lineBetween(x - 20, y + 18, x + 20, y + 18);
    sigil.lineBetween(x, y - 2, x, y + 38);
  }

  drawFallenLog(x, y, scale) {
    const log = this.add.graphics().setDepth(y);
    log.fillStyle(0x06100b, 0.32);
    log.fillEllipse(x + 10, y + 11, 110 * scale, 22 * scale);
    log.lineStyle(17 * scale, 0x59412a, 1);
    log.lineBetween(x - 45 * scale, y, x + 48 * scale, y + 8 * scale);
    log.lineStyle(4 * scale, 0x8b6a42, 0.55);
    log.lineBetween(x - 42 * scale, y - 3, x + 42 * scale, y + 5);
    log.fillStyle(0x775838);
    log.fillCircle(x + 49 * scale, y + 8 * scale, 9 * scale);
    log.fillStyle(0x2f5f38, 0.75);
    log.fillCircle(x - 8, y - 8, 8 * scale);
    log.fillCircle(x + 12, y + 4, 6 * scale);
  }

  createPlayer() {
    const body = this.add.graphics();
    body.fillStyle(0x07110d, 0.42);
    body.fillEllipse(4, 20, 30, 11);
    body.fillStyle(0x7a1918);
    body.fillTriangle(-14, 2, 14, 2, 5, 26);
    body.fillStyle(0x285f7a);
    body.fillCircle(0, -3, 12);
    body.fillStyle(0xe4b780);
    body.fillCircle(0, -15, 7);
    body.fillStyle(0x332015);
    body.fillRect(-8, -24, 16, 5);
    body.fillStyle(0xc8983a);
    body.fillRect(8, -8, 9, 15);

    const selection = this.add.graphics();
    selection.lineStyle(2, 0xe8d08a, 0.68);
    selection.strokeEllipse(0, 16, 42, 17);

    this.player = this.add.container(130, 760, [selection, body]).setDepth(760);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(24, 24);
    this.player.body.setOffset(-12, 2);
  }

  createEnemies() {
    this.enemies = [];
    const defs = [
      { id: 'brush_rat_1', name: 'Brush Rat', level: 1, x: 360, y: 675, hp: 20, reward: 2, colour: 0x766447, kind: 'rat' },
      { id: 'brush_rat_2', name: 'Brush Rat', level: 1, x: 505, y: 555, hp: 20, reward: 2, colour: 0x766447, kind: 'rat' },
      { id: 'young_jackal', name: 'Young Jackal', level: 2, x: 720, y: 470, hp: 28, reward: 3, colour: 0x9a6b3d, kind: 'jackal' },
      { id: 'thorn_crawler', name: 'Thorn Crawler', level: 2, x: 660, y: 690, hp: 30, reward: 3, colour: 0x557541, kind: 'crawler' },
      { id: 'creek_rat', name: 'Creek Rat', level: 1, x: 840, y: 610, hp: 22, reward: 2, colour: 0x665d4a, kind: 'rat' },
      { id: 'ruin_jackal', name: 'Ruin Jackal', level: 3, x: 615, y: 330, hp: 38, reward: 5, colour: 0x865534, kind: 'jackal' }
    ];

    defs.forEach((def, index) => this.spawnEnemy(def, index));
  }

  spawnEnemy(def, index) {
    const ring = this.add.graphics();
    ring.fillStyle(0x8f2d24, 0.18);
    ring.fillEllipse(0, 15, 58, 22);
    ring.lineStyle(2, 0xd5b56f, 0.8);
    ring.strokeEllipse(0, 15, 58, 22);

    const body = this.add.graphics();
    body.fillStyle(0x06110d, 0.38);
    body.fillEllipse(5, 18, 28, 10);
    body.fillStyle(def.colour);

    if (def.kind === 'rat') {
      body.fillEllipse(0, 2, 26, 15);
      body.fillCircle(12, -1, 7);
      body.fillTriangle(12, -7, 16, -14, 18, -5);
      body.lineStyle(2, 0x5b4735, 0.85);
      body.beginPath();
      body.moveTo(-12, 3);
      body.lineTo(-22, -3);
      body.lineTo(-27, 2);
      body.strokePath();
    } else if (def.kind === 'jackal') {
      body.fillEllipse(0, 0, 30, 16);
      body.fillCircle(15, -4, 8);
      body.fillTriangle(11, -9, 12, -18, 17, -10);
      body.fillTriangle(17, -10, 21, -18, 22, -7);
      body.fillStyle(0x3c2a1e);
      body.fillRect(-10, 5, 4, 13);
      body.fillRect(7, 5, 4, 13);
    } else {
      body.fillCircle(0, 1, 15);
      body.fillStyle(0x6f8e52);
      for (let i = 0; i < 6; i += 1) {
        const a = (Math.PI * 2 * i) / 6;
        body.fillTriangle(
          Math.cos(a) * 8, Math.sin(a) * 8,
          Math.cos(a - 0.18) * 23, Math.sin(a - 0.18) * 23,
          Math.cos(a + 0.18) * 23, Math.sin(a + 0.18) * 23
        );
      }
    }

    const levelBadge = this.add.text(0, -34, String(def.level), {
      fontFamily: 'Georgia, serif', fontSize: '13px', fontStyle: 'bold',
      color: '#ffe3a3', stroke: '#17110b', strokeThickness: 5
    }).setOrigin(0.5);

    const name = this.add.text(0, 31, def.name, {
      fontFamily: 'Georgia, serif', fontSize: '11px', color: '#efe2bd',
      stroke: '#07100c', strokeThickness: 4
    }).setOrigin(0.5);

    const hpBack = this.add.graphics();
    hpBack.fillStyle(0x090b09, 0.9);
    hpBack.fillRoundedRect(-25, -25, 50, 6, 3);
    const hpFill = this.add.graphics();

    const enemy = this.add.container(def.x, def.y, [ring, body, hpBack, hpFill, levelBadge, name]);
    enemy.setSize(72, 72).setInteractive({ useHandCursor: true });
    enemy.setDepth(def.y);
    enemy.def = def;
    enemy.maxHP = def.hp;
    enemy.hp = def.hp;
    enemy.alive = true;
    enemy.hpFill = hpFill;
    enemy.ring = ring;
    enemy.respawnAt = 0;
    enemy.nextAttackAt = 0;
    enemy.on('pointerdown', (pointer) => {
      pointer.event?.stopPropagation?.();
      this.selectEnemy(enemy);
    });

    this.tweens.add({
      targets: ring,
      scaleX: 1.08,
      scaleY: 1.08,
      alpha: 0.62,
      yoyo: true,
      repeat: -1,
      duration: 850 + index * 70,
      ease: 'Sine.InOut'
    });

    this.enemies.push(enemy);
    this.redrawEnemyHP(enemy);
  }

  selectEnemy(enemy) {
    if (!enemy.alive) return;
    this.selectedEnemy = enemy;
    this.moveTarget = null;
    this.targetNameText.setText(`${enemy.def.name}  •  Level ${enemy.def.level}`);
    this.enemies.forEach(e => {
      e.ring.clear();
      const selected = e === enemy;
      e.ring.fillStyle(selected ? 0xc54a2e : 0x8f2d24, selected ? 0.34 : 0.18);
      e.ring.fillEllipse(0, 15, selected ? 66 : 58, selected ? 26 : 22);
      e.ring.lineStyle(selected ? 3 : 2, selected ? 0xffdf8b : 0xd5b56f, selected ? 1 : 0.8);
      e.ring.strokeEllipse(0, 15, selected ? 66 : 58, selected ? 26 : 22);
    });
  }

  redrawEnemyHP(enemy) {
    enemy.hpFill.clear();
    if (!enemy.alive) return;
    const ratio = Phaser.Math.Clamp(enemy.hp / enemy.maxHP, 0, 1);
    enemy.hpFill.fillStyle(ratio > 0.45 ? 0x73a84d : 0xb24a32, 1);
    enemy.hpFill.fillRoundedRect(-24, -24, 48 * ratio, 4, 2);
  }

  createControls() {
    this.cursors = this.input.keyboard ? this.input.keyboard.createCursorKeys() : null;
    this.joy = { active: false, id: null, baseX: 0, baseY: 0, dx: 0, dy: 0 };
    this.joyBase = this.add.graphics().setScrollFactor(0).setDepth(3000);
    this.joyKnob = this.add.graphics().setScrollFactor(0).setDepth(3001);
  }

  setupInput() {
    this.input.on('pointerdown', (pointer) => {
      if (pointer.y < 72 || pointer.y > this.H - 58) return;

      if (pointer.x < this.W * 0.48 && pointer.y > this.H * 0.58) {
        this.joy.active = true;
        this.joy.id = pointer.id;
        this.joy.baseX = pointer.x;
        this.joy.baseY = pointer.y;
        this.joy.dx = 0;
        this.joy.dy = 0;
        this.selectedEnemy = null;
        this.drawJoystick();
        return;
      }

      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const tappedEnemy = this.enemies.find(enemy => enemy.alive && Phaser.Math.Distance.Between(worldPoint.x, worldPoint.y, enemy.x, enemy.y) < 48);
      if (tappedEnemy) {
        this.selectEnemy(tappedEnemy);
        return;
      }

      this.selectedEnemy = null;
      this.moveTarget = { x: worldPoint.x, y: worldPoint.y };
      this.showMoveMarker(worldPoint.x, worldPoint.y);
    });

    this.input.on('pointermove', (pointer) => {
      if (!this.joy.active || pointer.id !== this.joy.id) return;
      const dx = pointer.x - this.joy.baseX;
      const dy = pointer.y - this.joy.baseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const max = 48;
      const angle = Math.atan2(dy, dx);
      const amount = Math.min(distance, max) / max;
      this.joy.dx = Math.cos(angle) * amount;
      this.joy.dy = Math.sin(angle) * amount;
      this.drawJoystick();
    });

    this.input.on('pointerup', (pointer) => {
      if (pointer.id !== this.joy.id) return;
      this.joy.active = false;
      this.joy.dx = 0;
      this.joy.dy = 0;
      this.joyBase.clear();
      this.joyKnob.clear();
    });

    this.input.on('pointercancel', () => {
      this.joy.active = false;
      this.joy.dx = 0;
      this.joy.dy = 0;
      this.joyBase.clear();
      this.joyKnob.clear();
    });
  }

  drawJoystick() {
    this.joyBase.clear();
    this.joyKnob.clear();
    this.joyBase.fillStyle(0x0b1711, 0.45);
    this.joyBase.fillCircle(this.joy.baseX, this.joy.baseY, 48);
    this.joyBase.lineStyle(2, 0xb9ca91, 0.35);
    this.joyBase.strokeCircle(this.joy.baseX, this.joy.baseY, 48);
    this.joyKnob.fillStyle(0xc6b06f, 0.78);
    this.joyKnob.fillCircle(this.joy.baseX + this.joy.dx * 48, this.joy.baseY + this.joy.dy * 48, 18);
  }

  showMoveMarker(x, y) {
    if (this.moveMarker) this.moveMarker.destroy();
    const marker = this.add.graphics().setDepth(y + 1);
    marker.lineStyle(2, 0xd8c67b, 0.72);
    marker.strokeCircle(x, y, 17);
    this.moveMarker = marker;
    this.tweens.add({
      targets: marker,
      alpha: 0,
      scaleX: 1.55,
      scaleY: 1.55,
      duration: 500,
      onComplete: () => marker.destroy()
    });
  }

  createHUD() {
    const top = this.add.graphics().setScrollFactor(0).setDepth(4000);
    top.fillStyle(0x07100c, 0.92);
    top.fillRect(0, 0, this.W, 66);
    top.lineStyle(1, 0xb9a46a, 0.5);
    top.lineBetween(0, 66, this.W, 66);

    const exitG = this.add.graphics().setScrollFactor(0).setDepth(4001);
    exitG.fillStyle(0x243425, 0.96);
    exitG.fillRoundedRect(10, 12, 56, 40, 10);
    exitG.lineStyle(1, 0xc0ad72, 0.55);
    exitG.strokeRoundedRect(10, 12, 56, 40, 10);
    this.add.text(38, 32, '← Cave', {
      fontFamily: 'Georgia, serif', fontSize: '11px', color: '#e8d8a8'
    }).setScrollFactor(0).setDepth(4002).setOrigin(0.5);
    this.add.zone(38, 32, 56, 40).setScrollFactor(0).setDepth(4003).setInteractive().on('pointerdown', () => this.exitForest());

    this.add.text(this.W / 2, 14, 'WEAKWOOD GROVE', {
      fontFamily: 'Georgia, serif', fontSize: '15px', fontStyle: 'bold',
      color: '#d7c27c', letterSpacing: 2
    }).setScrollFactor(0).setDepth(4002).setOrigin(0.5, 0);
    this.add.text(this.W / 2, 36, 'Weak enemies return after a short time', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#82977c'
    }).setScrollFactor(0).setDepth(4002).setOrigin(0.5, 0);

    this.coinText = this.add.text(this.W - 12, 18, '', {
      fontFamily: 'Georgia, serif', fontSize: '12px', color: '#f1d477'
    }).setScrollFactor(0).setDepth(4002).setOrigin(1, 0);
    this.killText = this.add.text(this.W - 12, 38, '', {
      fontFamily: 'Georgia, serif', fontSize: '10px', color: '#a7b99a'
    }).setScrollFactor(0).setDepth(4002).setOrigin(1, 0);

    const bottom = this.add.graphics().setScrollFactor(0).setDepth(4000);
    bottom.fillStyle(0x07100c, 0.9);
    bottom.fillRect(0, this.H - 54, this.W, 54);
    bottom.lineStyle(1, 0xb9a46a, 0.35);
    bottom.lineBetween(0, this.H - 54, this.W, this.H - 54);
    bottom.fillStyle(0x121b15, 1);
    bottom.fillRoundedRect(14, this.H - 38, 132, 13, 7);

    this.healthBar = this.add.graphics().setScrollFactor(0).setDepth(4001);
    this.healthText = this.add.text(80, this.H - 47, '', {
      fontFamily: 'system-ui', fontSize: '10px', color: '#e7eadc'
    }).setScrollFactor(0).setDepth(4002).setOrigin(0.5, 0);

    this.targetNameText = this.add.text(this.W / 2, this.H - 38, 'Tap an enemy to hunt', {
      fontFamily: 'Georgia, serif', fontSize: '12px', color: '#c8d2b6',
      stroke: '#041009', strokeThickness: 3
    }).setScrollFactor(0).setDepth(4002).setOrigin(0.5);
  }

  updateHUD() {
    this.coinText.setText(`⚜ ${this.playerData.gold}`);
    this.killText.setText(`Defeated ${this.playerData.forestDefeats}`);
    this.healthText.setText(`Health ${Math.ceil(this.playerHP)}/${this.maxPlayerHP}`);
    this.healthBar.clear();
    const ratio = Phaser.Math.Clamp(this.playerHP / this.maxPlayerHP, 0, 1);
    this.healthBar.fillStyle(ratio > 0.4 ? 0x6f9d4d : 0xb14a36, 1);
    this.healthBar.fillRoundedRect(16, this.H - 36, 128 * ratio, 9, 5);
  }

  exitForest() {
    SaveSystem.autoSave(this.playerData, this.returnTown.id);
    this.cameras.main.fade(350, 0, 0, 0);
    this.time.delayedCall(350, () => {
      this.scene.start('LocationMapScene', {
        town: this.returnTown,
        playerData: this.playerData,
        saveSlot: this.saveSlot,
        spawnX: 620,
        spawnY: 205
      });
    });
  }

  attackEnemy(enemy, time) {
    if (!enemy.alive || time < this.attackTimer) return;
    this.attackTimer = time + 520;

    const damage = Phaser.Math.Between(7, 11);
    enemy.hp -= damage;
    this.redrawEnemyHP(enemy);
    this.showStrike(this.player.x, this.player.y, enemy.x, enemy.y, 0xe9d487);
    this.floatText(enemy.x, enemy.y - 50, `-${damage}`, '#ffe0a0');
    this.tweens.add({ targets: enemy, x: enemy.x + (enemy.x > this.player.x ? 8 : -8), duration: 75, yoyo: true });

    if (enemy.hp <= 0) {
      this.defeatEnemy(enemy, time);
      return;
    }

    if (time >= enemy.nextAttackAt) {
      enemy.nextAttackAt = time + 900;
      const retaliation = Phaser.Math.Between(2, 5);
      this.playerHP = Math.max(0, this.playerHP - retaliation);
      this.showStrike(enemy.x, enemy.y, this.player.x, this.player.y, 0xbf563d);
      this.floatText(this.player.x, this.player.y - 46, `-${retaliation}`, '#ffad91');
      this.tweens.add({ targets: this.player, alpha: 0.45, duration: 70, yoyo: true });
      if (this.playerHP <= 0) this.playerDefeated();
    }
    this.updateHUD();
  }

  showStrike(fromX, fromY, toX, toY, colour) {
    const slash = this.add.graphics().setDepth(Math.max(fromY, toY) + 50);
    slash.lineStyle(5, colour, 0.9);
    slash.lineBetween(fromX, fromY - 18, toX, toY - 18);
    this.tweens.add({ targets: slash, alpha: 0, duration: 140, onComplete: () => slash.destroy() });
  }

  floatText(x, y, text, colour) {
    const label = this.add.text(x, y, text, {
      fontFamily: 'Georgia, serif', fontSize: '15px', fontStyle: 'bold',
      color: colour, stroke: '#06100b', strokeThickness: 4
    }).setOrigin(0.5).setDepth(y + 100);
    this.tweens.add({
      targets: label,
      y: y - 30,
      alpha: 0,
      duration: 650,
      ease: 'Power2',
      onComplete: () => label.destroy()
    });
  }

  defeatEnemy(enemy, time) {
    enemy.alive = false;
    enemy.hp = 0;
    enemy.respawnAt = time + 8000;
    enemy.disableInteractive();
    this.redrawEnemyHP(enemy);
    this.tweens.add({ targets: enemy, alpha: 0, scaleX: 0.75, scaleY: 0.75, duration: 240 });

    const reward = enemy.def.reward;
    this.playerData.gold += reward;
    this.playerData.forestDefeats += 1;
    this.playerHP = Math.min(this.maxPlayerHP, this.playerHP + 8);
    this.floatText(enemy.x, enemy.y - 58, `+${reward} coins`, '#f4d66e');
    this.targetNameText.setText(`${enemy.def.name} defeated — returning soon`);
    this.selectedEnemy = null;
    SaveSystem.autoSave(this.playerData, this.returnTown.id);
    this.updateHUD();
  }

  respawnEnemy(enemy) {
    enemy.alive = true;
    enemy.hp = enemy.maxHP;
    enemy.respawnAt = 0;
    enemy.nextAttackAt = 0;
    enemy.setScale(1);
    enemy.setAlpha(1);
    enemy.setInteractive({ useHandCursor: true });
    this.redrawEnemyHP(enemy);
    this.tweens.add({ targets: enemy, alpha: { from: 0.1, to: 1 }, duration: 360 });
  }

  playerDefeated() {
    this.playerHP = this.maxPlayerHP;
    this.selectedEnemy = null;
    this.moveTarget = null;
    this.player.setPosition(130, 760);
    this.cameras.main.flash(260, 110, 20, 16);
    this.targetNameText.setText('You retreat to the cave and recover');
    this.updateHUD();
  }

  update(time, delta) {
    const speed = 180;
    let vx = 0;
    let vy = 0;

    if (this.cursors) {
      if (this.cursors.left.isDown) vx -= 1;
      if (this.cursors.right.isDown) vx += 1;
      if (this.cursors.up.isDown) vy -= 1;
      if (this.cursors.down.isDown) vy += 1;
    }
    if (this.joy.active) {
      vx += this.joy.dx;
      vy += this.joy.dy;
    }

    const manual = Math.abs(vx) > 0.04 || Math.abs(vy) > 0.04;
    if (manual) {
      this.selectedEnemy = null;
      this.moveTarget = null;
    } else if (this.selectedEnemy && this.selectedEnemy.alive) {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.selectedEnemy.x, this.selectedEnemy.y);
      if (distance > 58) {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.selectedEnemy.x, this.selectedEnemy.y);
        vx = Math.cos(angle);
        vy = Math.sin(angle);
      } else {
        this.attackEnemy(this.selectedEnemy, time);
      }
    } else if (this.moveTarget) {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.moveTarget.x, this.moveTarget.y);
      if (distance > 8) {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.moveTarget.x, this.moveTarget.y);
        vx = Math.cos(angle);
        vy = Math.sin(angle);
      } else {
        this.moveTarget = null;
      }
    }

    const length = Math.sqrt(vx * vx + vy * vy);
    if (length > 0) {
      vx /= Math.max(1, length);
      vy /= Math.max(1, length);
      this.player.body.setVelocity(vx * speed, vy * speed);
      this.player.setDepth(this.player.y + 30);
      this.player.rotation = Math.sin(time * 0.018) * 0.018;
    } else {
      this.player.body.setVelocity(0, 0);
      this.player.rotation = 0;
      if (!this.selectedEnemy && this.playerHP < this.maxPlayerHP) {
        this.playerHP = Math.min(this.maxPlayerHP, this.playerHP + delta * 0.003);
      }
    }

    this.enemies.forEach(enemy => {
      enemy.setDepth(enemy.y);
      if (!enemy.alive && enemy.respawnAt > 0 && time >= enemy.respawnAt) this.respawnEnemy(enemy);
    });

    this.updateHUD();
  }
}
