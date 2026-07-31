// ================================================================
//  FOREST VISUAL UPGRADE
//  Improves enemy silhouettes and prevents tree crowns from hiding
//  the player or living enemies. Loaded after ForestScene.js.
// ================================================================

(() => {
  'use strict';

  if (typeof ForestScene === 'undefined') return;

  const JACKAL_TEXTURE = 'ps-jackal-set';
  const JACKAL_PATH = 'assets/enemies/jackal/jackal-contact-sheet.png';
  const JACKAL_ORIGIN_Y = 84 / 96;
  const JACKAL_FRAME = Object.freeze({
    IDLE_A: 0,
    IDLE_B: 1,
    ALERT: 2,
    ATTACK_ANTICIPATION: 3,
    ATTACK_IMPACT: 4,
    HURT: 5,
    DEFEATED: 6,
    IDLE_C: 7,
    IDLE_D: 8
  });

  const originalPreload = ForestScene.prototype.preload;
  ForestScene.prototype.preload = function preloadForestAssets() {
    if (originalPreload) originalPreload.call(this);
    this.load.spritesheet(JACKAL_TEXTURE, JACKAL_PATH, {
      frameWidth: 96,
      frameHeight: 96,
      margin: 0,
      spacing: 0
    });
  };

  ForestScene.prototype.prepareJackalAnimations = function prepareJackalAnimations() {
    this.textures.get(JACKAL_TEXTURE).setFilter(Phaser.Textures.FilterMode.NEAREST);

    if (!this.anims.exists('ps-jackal-idle')) {
      this.anims.create({
        key: 'ps-jackal-idle',
        frames: this.anims.generateFrameNumbers(JACKAL_TEXTURE, {
          frames: [
            JACKAL_FRAME.IDLE_A,
            JACKAL_FRAME.IDLE_B,
            JACKAL_FRAME.IDLE_C,
            JACKAL_FRAME.IDLE_D
          ]
        }),
        frameRate: 5,
        repeat: -1
      });
    }

    if (!this.anims.exists('ps-jackal-attack')) {
      this.anims.create({
        key: 'ps-jackal-attack',
        frames: this.anims.generateFrameNumbers(JACKAL_TEXTURE, {
          frames: [JACKAL_FRAME.ATTACK_ANTICIPATION, JACKAL_FRAME.ATTACK_IMPACT]
        }),
        frameRate: 8,
        repeat: 0
      });
    }
  };

  const originalGenerateProceduralArt = ForestScene.prototype.generateProceduralArt;
  ForestScene.prototype.generateProceduralArt = function generateUpgradedForestArt() {
    originalGenerateProceduralArt.call(this);
    this.prepareJackalAnimations();

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

  ForestScene.prototype.setJackalState = function setJackalState(enemy, state) {
    if (!enemy || enemy.def.kind !== 'jackal' || !enemy.bodyArt) return;
    const body = enemy.bodyArt;
    const idleStartAt = enemy.jackalIdleStartAt || 0;

    if (enemy.jackalState === state) {
      if (state === 'idle' && !body.anims.isPlaying && this.time.now >= idleStartAt) {
        body.play('ps-jackal-idle');
      }
      return;
    }

    body.clearTint();
    body.setX(0);
    body.setAngle(0);

    if (state === 'idle') {
      if (this.time.now < idleStartAt) {
        body.anims.stop();
        body.setFrame(JACKAL_FRAME.IDLE_A);
      } else {
        body.play('ps-jackal-idle', true);
      }
    } else {
      body.anims.stop();
      const frame = {
        alert: JACKAL_FRAME.ALERT,
        hurt: JACKAL_FRAME.HURT,
        defeated: JACKAL_FRAME.DEFEATED
      }[state];
      if (frame !== undefined) body.setFrame(frame);
    }

    enemy.jackalState = state;
  };

  ForestScene.prototype.createEnemies = function createReadableEnemies() {
    this.enemies = [];
    const defs = [
      { id: 'brush_rat_1', name: 'Brush Rat', level: 1, x: 360, y: 820, hp: 20, reward: 2, kind: 'rat', texture: 'ps-rat-v2' },
      { id: 'brush_rat_2', name: 'Brush Rat', level: 1, x: 535, y: 690, hp: 20, reward: 2, kind: 'rat', texture: 'ps-rat-v2' },
      { id: 'young_jackal', name: 'Young Jackal', level: 2, x: 715, y: 575, hp: 29, reward: 3, kind: 'jackal', texture: JACKAL_TEXTURE },
      { id: 'thorn_crawler', name: 'Thorn Crawler', level: 2, x: 750, y: 865, hp: 31, reward: 3, kind: 'crawler', texture: 'ps-crawler-v2' },
      { id: 'creek_rat', name: 'Creek Rat', level: 1, x: 960, y: 715, hp: 22, reward: 2, kind: 'rat', texture: 'ps-rat-v2' },
      { id: 'rune_jackal', name: 'Rune Jackal', level: 3, x: 800, y: 365, hp: 40, reward: 5, kind: 'jackal', texture: JACKAL_TEXTURE }
    ];
    defs.forEach((def, index) => this.spawnEnemy(def, index));
  };

  const originalSpawnEnemy = ForestScene.prototype.spawnEnemy;
  ForestScene.prototype.spawnEnemy = function spawnReadableEnemy(def, index) {
    originalSpawnEnemy.call(this, def, index);
    const enemy = this.enemies[this.enemies.length - 1];
    if (!enemy) return;

    const isJackal = def.kind === 'jackal';
    if (isJackal) {
      const oldBody = enemy.bodyArt;
      const bodyIndex = enemy.list.indexOf(oldBody);
      this.tweens.killTweensOf(oldBody);
      enemy.remove(oldBody, true);

      enemy.bodyArt = this.add.sprite(0, 5, JACKAL_TEXTURE, JACKAL_FRAME.IDLE_A)
        .setOrigin(0.5, JACKAL_ORIGIN_Y)
        .setScale(1);
      enemy.addAt(enemy.bodyArt, bodyIndex);
      enemy.jackalActionToken = 0;
      enemy.jackalPoseUntil = 0;
      enemy.jackalIdlePhaseOffset = (index % 2) * 180;
      enemy.jackalIdleStartAt = this.time.now + enemy.jackalIdlePhaseOffset;
      enemy.jackalState = '';

      const hpBack = enemy.list[2];
      const levelBadge = enemy.list[4];
      hpBack.setY(-38);
      enemy.hpFill.setY(-38);
      levelBadge.setY(-92);
      this.setJackalState(enemy, 'idle');
    }

    const scale = isJackal ? 1 : def.kind === 'crawler' ? 0.78 : 0.82;
    enemy.bodyArt.setScale(scale);

    if (!isJackal) {
      const outline = this.add.image(enemy.bodyArt.x, enemy.bodyArt.y, def.texture)
        .setOrigin(enemy.bodyArt.originX, enemy.bodyArt.originY)
        .setScale(scale * 1.08)
        .setTintFill(0xf4ddb0)
        .setAlpha(0.28);
      enemy.addAt(outline, 1);
      enemy.outlineArt = outline;
    } else {
      enemy.outlineArt = null;
    }

    enemy.setSize(isJackal ? 112 : 96, 104);

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
      if (item.def.kind === 'jackal' && item.alive && this.time.now >= item.jackalPoseUntil) {
        this.setJackalState(item, 'idle');
      }
    });
  };

  ForestScene.prototype.playJackalHurt = function playJackalHurt(enemy, time) {
    if (!enemy || enemy.def.kind !== 'jackal' || !enemy.alive) return;
    const token = ++enemy.jackalActionToken;
    const body = enemy.bodyArt;
    const recoilX = body.flipX ? 5 : -5;
    enemy.jackalPoseUntil = time + 190;
    this.setJackalState(enemy, 'hurt');
    body.setTintFill(0xffe7b5);
    this.tweens.add({
      targets: body,
      x: { from: 0, to: recoilX },
      angle: { from: 0, to: body.flipX ? -4 : 4 },
      duration: 70,
      yoyo: true,
      ease: 'Quad.Out',
      onComplete: () => {
        if (enemy.jackalActionToken !== token) return;
        body.clearTint().setX(0).setAngle(0);
      }
    });
  };

  ForestScene.prototype.showJackalImpact = function showJackalImpact(enemy) {
    if (!enemy || !enemy.bodyArt) return;
    const direction = enemy.bodyArt.flipX ? -1 : 1;
    const x = enemy.x + direction * 38;
    const y = enemy.y - 22;
    const dust = this.add.graphics().setDepth(enemy.y + 130);
    dust.fillStyle(0xd8bc78, 0.70);
    dust.fillCircle(x, y + 9, 4);
    dust.fillCircle(x - direction * 8, y + 14, 3);
    dust.fillCircle(x + direction * 7, y + 13, 2);
    dust.lineStyle(3, 0xffe29a, 0.82);
    dust.lineBetween(x - direction * 7, y - 4, x + direction * 11, y + 5);
    this.tweens.add({
      targets: dust,
      alpha: 0,
      scaleX: 1.45,
      scaleY: 1.45,
      duration: 210,
      ease: 'Quad.Out',
      onComplete: () => dust.destroy()
    });
    this.cameras.main.shake(55, 0.0012);
  };

  ForestScene.prototype.playJackalAttack = function playJackalAttack(enemy, time, onImpact) {
    if (!enemy || enemy.def.kind !== 'jackal' || !enemy.alive) return;
    const token = ++enemy.jackalActionToken;
    const body = enemy.bodyArt;
    const startDelay = 95;
    enemy.jackalPoseUntil = time + 420;

    this.time.delayedCall(startDelay, () => {
      if (!enemy.alive || enemy.jackalActionToken !== token) return;
      const target = this.player;
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, target.x, target.y);
      const originX = enemy.x;
      const originY = enemy.y;
      body.clearTint().setX(0).setAngle(0).setFlipX(target.x < enemy.x);
      body.play('ps-jackal-attack', true);
      enemy.jackalState = 'attack';

      this.tweens.add({
        targets: enemy,
        x: originX + Math.cos(angle) * 18,
        y: originY + Math.sin(angle) * 11,
        duration: 125,
        yoyo: true,
        ease: 'Quad.In',
        onComplete: () => {
          if (enemy.jackalActionToken === token && enemy.alive) {
            enemy.setPosition(originX, originY);
          }
        }
      });

      this.time.delayedCall(125, () => {
        if (!enemy.alive || enemy.jackalActionToken !== token) return;
        this.showJackalImpact(enemy);
        onImpact();
      });
    });
  };

  const originalAttackEnemy = ForestScene.prototype.attackEnemy;
  ForestScene.prototype.attackEnemy = function attackAnimatedEnemy(enemy, time) {
    if (enemy.def.kind !== 'jackal') {
      originalAttackEnemy.call(this, enemy, time);
      return;
    }
    if (!enemy.alive || time < this.attackTimer) return;

    this.attackTimer = time + 530;
    const damage = Phaser.Math.Between(7, 11);
    enemy.hp -= damage;
    this.redrawEnemyHP(enemy);

    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
    const originX = this.player.x;
    const originY = this.player.y;
    this.tweens.add({
      targets: this.player,
      x: originX + Math.cos(angle) * 14,
      y: originY + Math.sin(angle) * 9,
      duration: 90,
      yoyo: true,
      ease: 'Quad.Out'
    });
    this.showStrike(enemy.x, enemy.y, 0xf1d785);
    this.floatText(enemy.x, enemy.y - 62, `-${damage}`, '#ffe0a0');
    this.playJackalHurt(enemy, time);

    if (enemy.hp <= 0) {
      this.defeatEnemy(enemy, time);
      return;
    }

    if (time >= enemy.nextAttackAt) {
      enemy.nextAttackAt = time + 900;
      const retaliation = Phaser.Math.Between(2, 5);
      this.playJackalAttack(enemy, time, () => {
        this.playerHP = Math.max(0, this.playerHP - retaliation);
        this.showStrike(this.player.x, this.player.y, 0xc65d44);
        this.floatText(this.player.x, this.player.y - 56, `-${retaliation}`, '#ffad91');
        this.tweens.add({
          targets: this.player.bodyArt,
          angle: enemy.x > this.player.x ? -6 : 6,
          duration: 75,
          yoyo: true
        });
        if (this.playerHP <= 0) this.playerDefeated();
        this.updateHUD();
      });
    }
    this.updateHUD();
  };

  const originalDefeatEnemy = ForestScene.prototype.defeatEnemy;
  ForestScene.prototype.defeatEnemy = function defeatAnimatedEnemy(enemy, time) {
    const isJackal = enemy.def.kind === 'jackal';
    if (isJackal) {
      ++enemy.jackalActionToken;
      enemy.jackalPoseUntil = Number.POSITIVE_INFINITY;
      this.tweens.killTweensOf(enemy.bodyArt);
      enemy.bodyArt.anims.stop();
      enemy.bodyArt
        .clearTint()
        .setFrame(JACKAL_FRAME.DEFEATED)
        .setPosition(0, 5)
        .setScale(1)
        .setAngle(0)
        .setAlpha(1);
      enemy.jackalState = 'defeated';
    }

    originalDefeatEnemy.call(this, enemy, time);

    if (isJackal) {
      this.tweens.killTweensOf(enemy);
      enemy.setPosition(enemy.homeX, enemy.homeY).setScale(1).setAlpha(1);
      this.time.delayedCall(260, () => {
        if (enemy.alive) return;
        this.tweens.add({
          targets: enemy,
          scaleX: 0.88,
          scaleY: 0.88,
          y: enemy.homeY + 4,
          duration: 360,
          ease: 'Quad.In'
        });
      });
    }
  };

  const originalRespawnEnemy = ForestScene.prototype.respawnEnemy;
  ForestScene.prototype.respawnEnemy = function respawnAnimatedEnemy(enemy) {
    originalRespawnEnemy.call(this, enemy);
    if (enemy.def.kind !== 'jackal') return;
    this.tweens.killTweensOf(enemy);
    enemy.setAlpha(1);
    this.tweens.add({
      targets: enemy,
      scaleX: { from: 0.75, to: 1 },
      scaleY: { from: 0.75, to: 1 },
      duration: 420,
      ease: 'Back.Out'
    });
    ++enemy.jackalActionToken;
    enemy.jackalPoseUntil = 0;
    enemy.jackalIdleStartAt = this.time.now + enemy.jackalIdlePhaseOffset;
    enemy.jackalState = '';
    enemy.bodyArt.setFlipX(false).setPosition(0, 5).setScale(1);
    this.setJackalState(enemy, 'idle');
  };

  ForestScene.prototype.updateJackalPresence = function updateJackalPresence(time) {
    if (!this.player) return;
    (this.enemies || []).forEach(enemy => {
      if (!enemy.alive || enemy.def.kind !== 'jackal' || !enemy.bodyArt) return;
      enemy.bodyArt.setFlipX(this.player.x < enemy.x);
      if (time < enemy.jackalPoseUntil) return;
      this.setJackalState(enemy, 'idle');
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
        if (enemy.def.kind === 'jackal') {
          enemy.outlineArt
            .setFrame(enemy.bodyArt.frame.name)
            .setFlipX(enemy.bodyArt.flipX)
            .setScale(enemy.bodyArt.scaleX * 1.06, enemy.bodyArt.scaleY * 1.06);
        }
      }
      enemy.visibilityMarker.setPosition(enemy.x, enemy.y - (enemy.def.kind === 'jackal' ? 92 : 82));
      enemy.visibilityMarker.setVisible(enemy.alive && enemy.alpha > 0.08);
      enemy.visibilityMarker.setAlpha(enemy === this.selectedEnemy ? 1 : 0.82);
    });
  };

  const originalUpdate = ForestScene.prototype.update;
  ForestScene.prototype.update = function updateReadableForest(time, delta) {
    originalUpdate.call(this, time, delta);
    this.updateJackalPresence(time);
    this.updateTreeOcclusion();
    this.updateEnemyMarkers();
  };
})();
