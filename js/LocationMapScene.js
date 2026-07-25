// ================================================================
//  LOCATION MAP SCENE
//  Engine only — no location-specific data lives here.
//  All terrain, buildings, and NPCs come from LocationRegistry.
// ================================================================

class LocationMapScene extends Phaser.Scene {
  constructor() { super({ key: 'LocationMapScene' }); }

  create(data) {
    this.W = this.cameras.main.width;
    this.H = this.cameras.main.height;

    this.playerData  = data.playerData || JSON.parse(JSON.stringify(GAME_DATA.player));
    this.location    = data.town       || GAME_DATA.towns.find(t => t.isHome);
    this.saveSlot    = data.saveSlot   || null;
    this.spawnX      = data.spawnX     || 400;
    this.spawnY      = data.spawnY     || 300;

    this.WORLD_W = 800;
    this.WORLD_H = 600;
    this.physics.world.setBounds(0, 0, this.WORLD_W, this.WORLD_H);

    // Load location-specific data
    const locationData = LocationRegistry[this.location.id];

    if (locationData) {
      // Use registry data
      locationData.drawTerrain(this);
      this.buildingDefs = locationData.getBuildings(this);
      this.drawBuildingsFromDefs();
      this.createPlayer();
      this.createBuildingZones();
      this.npcSystem = new NPCSystem(this);
      this.npcSystem.create(locationData.getNPCs(this));
    } else {
      // Fallback for locations not yet in registry
      this.drawGenericTerrain();
      this.buildingDefs = this.location.buildings || [];
      this.drawCityBuildings();
      this.createPlayer();
      this.createBuildingZones();
    }

    // Camera
    this.cameras.main.setBounds(0, 0, this.WORLD_W, this.WORLD_H);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Controls
    this.cursors = this.input.keyboard
      ? this.input.keyboard.createCursorKeys() : null;
    this.createJoystick();
    this.setupInput();
    this.createHUD();

    // State
    this.isWalking      = false;
    this.walkTarget     = null;
    this.targetBuilding = null;
    this.panelObjects   = [];
    this.npcObjects     = [];

    SaveSystem.autoSave(this.playerData, this.location.id);
    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  // ── GENERIC TERRAIN (fallback for unbuilt locations) ─────────
  drawGenericTerrain() {
    const g = this.add.graphics();
    const W = this.WORLD_W;
    const H = this.WORLD_H;

    g.fillStyle(0xc4a050);
    g.fillRect(0, 0, W, H);

    g.fillStyle(0xb08830, 0.5);
    g.fillRect(60, 160, W-120, 40);
    g.fillRect(W/2-20, 160, 40, H-300);

    g.fillStyle(0x2a6a9a);
    g.fillRect(0, H-140, W, 140);

    g.fillStyle(0xe4c870, 0.5);
    g.fillRect(0, H-148, W, 12);

    // Dock
    g.fillStyle(0x7a5a2a);
    g.fillRect(310, H-148, 60, 60);
    g.fillStyle(0x5a3a10);
    g.fillRect(308, H-150, 8, 70);
    g.fillRect(364, H-150, 8, 70);

    // Boat
    g.fillStyle(0x8B5E2D);
    g.fillEllipse(340, H-104, 70, 24);
    g.fillStyle(0x6a3a10);
    g.fillRect(338, H-118, 4, 26);

    // location color accent
    g.fillStyle(this.location.color, 0.12);
    g.fillRect(0, 0, 200, 160);
    g.fillRect(W-200, 0, 200, 160);

    // Location name watermark
    this.add.text(W/2, 80, this.location.name.toUpperCase(), {
      fontSize: '22px', fontFamily: 'Georgia, serif',
      fill: '#' + this.location.color.toString(16).padStart(6,'0'),
      stroke: '#1a0800', strokeThickness: 4, alpha: 0.3
    }).setOrigin(0.5);
  }

  // ── DRAW BUILDINGS FROM DEFS ──────────────────────────────────
  drawBuildingsFromDefs() {
    this.buildingDefs.forEach(bd => {
      if (bd.id === 'village_dock' || bd.id === 'harbor') {
        this.add.text(bd.x, bd.y - 22, bd.icon, {
          fontSize: '14px'
        }).setOrigin(0.5);
        this.add.text(bd.x, bd.y - 8, bd.label, {
          fontSize: '10px', fontFamily: 'Georgia, serif',
          fill: '#fff8dc', stroke: '#1a0800', strokeThickness: 3
        }).setOrigin(0.5);
        return;
      }

      if (bd.id === 'cliff_cave') {
        this.add.text(bd.x, bd.y - 20, bd.icon, {
          fontSize: '12px'
        }).setOrigin(0.5);
        this.add.text(bd.x, bd.y - 8, bd.label, {
          fontSize: '8px', fontFamily: 'Georgia, serif',
          fill: '#8a7a6a', stroke: '#0a0808', strokeThickness: 2
        }).setOrigin(0.5);
        return;
      }

      const g  = this.add.graphics();
      const bx = bd.x - bd.w/2;
      const by = bd.y - bd.h;

      g.fillStyle(0x000000, 0.15);
      g.fillRect(bx+5, by+5, bd.w, bd.h);

      g.fillStyle(bd.color);
      g.fillRect(bx, by, bd.w, bd.h);

      g.fillStyle(0x000000, 0.1);
      g.fillRect(bx+bd.w-14, by, 14, bd.h);

      if (bd.roofColor) {
        g.fillStyle(bd.roofColor);
        g.fillTriangle(bx-8, by, bx+bd.w/2, by-32, bx+bd.w+8, by);
        g.fillStyle(0x000000, 0.1);
        g.fillTriangle(bx+bd.w/2, by-32, bx+bd.w+8, by, bx+bd.w/2+10, by);
      }

      g.fillStyle(0x3a2000);
      g.fillRect(bx+bd.w/2-8, by+bd.h-24, 16, 24);
      g.fillStyle(0xd4a017);
      g.fillCircle(bx+bd.w/2+4, by+bd.h-14, 2);

      g.fillStyle(0xffee88, 0.8);
      g.fillRect(bx+10, by+12, 14, 12);
      if (bd.w > 70) { g.fillRect(bx+bd.w-24, by+12, 14, 12); }

      g.lineStyle(1, 0x8B6914, 0.4);
      g.lineBetween(bx+10, by+18, bx+24, by+18);
      g.lineBetween(bx+17, by+12, bx+17, by+24);

      // Location color accent stripe
      g.fillStyle(this.location.color, 0.25);
      g.fillRect(bx, by, bd.w, 5);

      this.add.text(bd.x, by-22, bd.icon, { fontSize: '13px' }).setOrigin(0.5);
      this.add.text(bd.x, by-8, bd.label, {
        fontSize: '10px', fontFamily: 'Georgia, serif',
        fill: '#fff8dc', stroke: '#1a0800', strokeThickness: 3
      }).setOrigin(0.5);
    });
  }

  // ── GENERIC location BUILDINGS (used by fallback) ─────────────────
  drawCityBuildings() {
    this.buildingDefs.forEach(bd => {
      if (bd.id === 'harbor') {
        this.add.text(340, this.WORLD_H-165, bd.icon, { fontSize: '14px' }).setOrigin(0.5);
        this.add.text(340, this.WORLD_H-152, bd.label, {
          fontSize: '10px', fontFamily: 'Georgia, serif',
          fill: '#fff8dc', stroke: '#1a0800', strokeThickness: 3
        }).setOrigin(0.5);
        return;
      }
      const g  = this.add.graphics();
      const bx = bd.x - bd.w/2;
      const by = bd.y - bd.h;
      g.fillStyle(0x000000, 0.15); g.fillRect(bx+5, by+5, bd.w, bd.h);
      g.fillStyle(bd.color);       g.fillRect(bx, by, bd.w, bd.h);
      if (bd.roofColor) {
        g.fillStyle(bd.roofColor);
        g.fillTriangle(bx-8, by, bx+bd.w/2, by-34, bx+bd.w+8, by);
      }
      g.fillStyle(0x3a2000); g.fillRect(bx+bd.w/2-9, by+bd.h-26, 18, 26);
      g.fillStyle(0xffee88, 0.8); g.fillRect(bx+10, by+12, 16, 14);
      this.add.text(bd.x, by-22, bd.icon, { fontSize: '14px' }).setOrigin(0.5);
      this.add.text(bd.x, by-8, bd.label, {
        fontSize: '10px', fontFamily: 'Georgia, serif',
        fill: '#fff8dc', stroke: '#1a0800', strokeThickness: 3
      }).setOrigin(0.5);
    });
  }

  // ── PLAYER ────────────────────────────────────────────────────
  createPlayer() {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.2); g.fillEllipse(0, 18, 22, 8);
    g.fillStyle(0x7a1010);
    g.fillTriangle(-12, 4, 12, 4, 3, 22);
    g.fillTriangle(-12, 4, -3, 22, 3, 22);
    g.fillStyle(0x3a70b8); g.fillCircle(0, -4, 11);
    g.fillStyle(0xf5c8a0); g.fillCircle(0, -13, 7);
    g.fillStyle(0x2c1208); g.fillRect(-10, -20, 20, 4);
    g.fillStyle(0x3a1a0a); g.fillRect(-6, -32, 12, 14);
    g.fillStyle(0xd4a017); g.fillTriangle(4, -32, 9, -42, 7, -30);
    g.fillStyle(0x8B6914); g.fillRect(7, -7, 10, 12);

    g.x = this.spawnX;
    g.y = this.spawnY;
    g.setDepth(5);

    this.player = g;
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(18, 18);
    this.player.body.setOffset(-9, -9);
  }

  // ── BUILDING ZONES ────────────────────────────────────────────
  createBuildingZones() {
    this.interactionZones = [];
    this.buildingDefs.forEach(bd => {
      const zone = this.add.zone(bd.x, bd.y - bd.h/2, bd.w+20, bd.h+20)
        .setInteractive();
      zone.on('pointerdown', () => this.walkToBuilding(bd));
      this.interactionZones.push({ zone, building: bd });
    });
  }

  // ── JOYSTICK ──────────────────────────────────────────────────
  createJoystick() {
    this.joy = { active: false, baseX: 0, baseY: 0, dx: 0, dy: 0, pid: null };
    this.joyBaseGfx  = this.add.graphics().setScrollFactor(0).setDepth(40);
    this.joyStickGfx = this.add.graphics().setScrollFactor(0).setDepth(41);
  }

  setupInput() {
    this.input.on('pointerdown', (ptr) => {
      if (ptr.y < 58 || ptr.y > this.H - 50) return;
      if (this.panelObjects && this.panelObjects.length > 0) return;
      if (this.npcSystem && this.npcSystem.dialogueObjects && this.npcSystem.dialogueObjects.length > 0) return;
      if (this.settingsPanel && this.settingsPanel.visible) return;

      // Check building tap
      const hit = this.buildingDefs.find(bd => {
        const bx = bd.x - bd.w/2;
        const by = bd.y - bd.h;
        return ptr.worldX >= bx-10 && ptr.worldX <= bx+bd.w+10 &&
               ptr.worldY >= by-10 && ptr.worldY <= by+bd.h+10;
      });

      if (hit) {
        this.joy.active = false;
        this.joy.dx = 0; this.joy.dy = 0;
        this.joyBaseGfx.clear(); this.joyStickGfx.clear();
        this.walkToBuilding(hit);
        return;
      }

      // Joystick — lower third only
      if (ptr.y > this.H * 0.67) {
        this.joy.active = true;
        this.joy.baseX  = ptr.x;
        this.joy.baseY  = ptr.y;
        this.joy.dx     = 0;
        this.joy.dy     = 0;
        this.joy.pid    = ptr.id;
        this.isWalking  = false;
        this.walkTarget = null;
        this.redrawJoystick();
      }
    });

    this.input.on('pointermove', (ptr) => {
      if (this.joy.active && ptr.id === this.joy.pid) {
        const dx    = ptr.x - this.joy.baseX;
        const dy    = ptr.y - this.joy.baseY;
        const dist  = Math.sqrt(dx*dx + dy*dy);
        const maxR  = 50;
        const angle = Math.atan2(dy, dx);
        const clamp = Math.min(dist, maxR);
        this.joy.dx = Math.cos(angle) * (clamp/maxR);
        this.joy.dy = Math.sin(angle) * (clamp/maxR);
        this.redrawJoystick();
      }
    });

    this.input.on('pointerup', (ptr) => {
      if (ptr.id === this.joy.pid) {
        this.joy.active = false;
        this.joy.dx = 0; this.joy.dy = 0;
        this.joyBaseGfx.clear(); this.joyStickGfx.clear();
      }
    });
  }

  redrawJoystick() {
    const { baseX: bx, baseY: by, dx, dy } = this.joy;
    const maxR = 50;
    this.joyBaseGfx.clear();
    this.joyBaseGfx.lineStyle(2, 0xffffff, 0.2);
    this.joyBaseGfx.strokeCircle(bx, by, maxR);
    this.joyBaseGfx.fillStyle(0xffffff, 0.05);
    this.joyBaseGfx.fillCircle(bx, by, maxR);
    const sx = bx + dx*maxR, sy = by + dy*maxR;
    this.joyStickGfx.clear();
    this.joyStickGfx.fillStyle(0xd4a017, 0.7);
    this.joyStickGfx.fillCircle(sx, sy, 20);
    this.joyStickGfx.lineStyle(1.5, 0xfff0c0, 0.4);
    this.joyStickGfx.strokeCircle(sx, sy, 20);
  }
// ── HUD ───────────────────────────────────────────────────────
  createHUD() {
    const W = this.W;
    const H = this.H;

    const hud = this.add.graphics().setScrollFactor(0).setDepth(30);
    hud.fillStyle(0x1a0e00, 0.92);
    hud.fillRect(0, 0, W, 56);
    hud.lineStyle(2, 0xd4a017, 0.5);
    hud.lineBetween(0, 56, W, 56);

    const bot = this.add.graphics().setScrollFactor(0).setDepth(30);
    bot.fillStyle(0x1a0e00, 0.88);
    bot.fillRect(0, H-48, W, 48);
    bot.lineStyle(1, 0xd4a017, 0.3);
    bot.lineBetween(0, H-48, W, H-48);

    this.add.text(W/2, 10, this.location.name, {
      fontSize: '16px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setScrollFactor(0).setDepth(31).setOrigin(0.5, 0);

    this.goldText = this.add.text(14, 34, '', {
      fontSize: '13px', fontFamily: 'Georgia, serif', fill: '#ffd700'
    }).setScrollFactor(0).setDepth(31);

    this.dayText = this.add.text(W-14, 34, '', {
      fontSize: '12px', fontFamily: 'Georgia, serif', fill: '#e8d5a0'
    }).setScrollFactor(0).setDepth(31).setOrigin(1, 0);

    // World map button
    const mapG = this.add.graphics().setScrollFactor(0).setDepth(31);
    mapG.fillStyle(0x3a2800);
    mapG.fillRoundedRect(W/2-55, H-42, 110, 34, 8);
    mapG.lineStyle(1, 0xd4a017, 0.5);
    mapG.strokeRoundedRect(W/2-55, H-42, 110, 34, 8);

    this.add.text(W/2, H-25, '🗺  World Map', {
      fontSize: '13px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setScrollFactor(0).setDepth(32).setOrigin(0.5);

    const mapZone = this.add.zone(W/2, H-25, 110, 34)
      .setScrollFactor(0).setDepth(33).setInteractive();
    mapZone.on('pointerdown', () => {
      SaveSystem.autoSave(this.playerData, this.location.id);
      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.start('WorldScene', { playerData: this.playerData });
      });
    });

    // Journal button
    const jG = this.add.graphics().setScrollFactor(0).setDepth(31);
    jG.fillStyle(0x3a2800);
    jG.fillRoundedRect(W-50, H-42, 38, 34, 8);
    jG.lineStyle(1, 0xd4a017, 0.5);
    jG.strokeRoundedRect(W-50, H-42, 38, 34, 8);
    this.add.text(W-31, H-25, '📖', { fontSize: '16px' })
      .setScrollFactor(0).setDepth(32).setOrigin(0.5);
    const jZone = this.add.zone(W-31, H-25, 38, 34)
      .setScrollFactor(0).setDepth(33).setInteractive();
    jZone.on('pointerdown', () => {
      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.start('JournalScene', { playerData: this.playerData });
      });
    });

    // Settings button
    const setG = this.add.graphics().setScrollFactor(0).setDepth(31);
    setG.fillStyle(0x3a2800);
    setG.fillRoundedRect(14, 8, 38, 38, 8);
    setG.lineStyle(1, 0xd4a017, 0.5);
    setG.strokeRoundedRect(14, 8, 38, 38, 8);
    this.add.text(33, 27, '⚙', { fontSize: '18px' })
      .setScrollFactor(0).setDepth(32).setOrigin(0.5);
    const setZone = this.add.zone(33, 27, 38, 38)
      .setScrollFactor(0).setDepth(33).setInteractive();
    setZone.on('pointerdown', () => {
      if (!this.settingsPanel) {
        this.settingsPanel = new SettingsPanel(this, this.playerData, this.location);
      }
      this.settingsPanel.show();
    });

    this.updateHUD();
  }

  updateHUD() {
    this.goldText.setText(`⚜ ${this.playerData.gold} Coins`);
    this.dayText.setText(`Day ${this.playerData.day}`);
  }

  // ── WALK TO BUILDING ──────────────────────────────────────────
  walkToBuilding(building) {
    this.walkTarget     = { x: building.x, y: building.y };
    this.isWalking      = true;
    this.targetBuilding = building;

    if (this.walkIndicator) this.walkIndicator.destroy();
    this.walkIndicator = this.add.graphics().setDepth(4);
    this.walkIndicator.lineStyle(2, 0xd4a017, 0.6);
    this.walkIndicator.strokeCircle(building.x, building.y, 20);
    this.tweens.add({
      targets: this.walkIndicator,
      alpha: 0, scaleX: 1.5, scaleY: 1.5,
      duration: 500, ease: 'Power2',
      onComplete: () => { if (this.walkIndicator) this.walkIndicator.destroy(); }
    });
  }

  // ── BUILDING PANEL ────────────────────────────────────────────
  showBuildingPanel(building) {
    if (this.panelObjects) {
      this.panelObjects.forEach(o => { if (o && o.destroy) o.destroy(); });
    }
    this.panelObjects = [];

    const W = this.W, H = this.H;
    const pH = 210, pY = H - pH - 50, D = 50;
    const add = (obj) => { this.panelObjects.push(obj); return obj; };

    const bg = add(this.add.graphics().setScrollFactor(0).setDepth(D));
    bg.fillStyle(0x000000, 0.45); bg.fillRect(0, 0, W, H);
    bg.fillStyle(0x1a0e00, 0.97); bg.fillRoundedRect(14, pY, W-28, pH, 14);
    bg.lineStyle(2, 0xd4a017, 0.6); bg.strokeRoundedRect(14, pY, W-28, pH, 14);

    add(this.add.text(W/2, pY+22, `${building.icon}  ${building.label}`, {
      fontSize: '18px', fontFamily: 'Georgia, serif',
      fill: '#d4a017', stroke: '#1a0800', strokeThickness: 3
    }).setScrollFactor(0).setDepth(D+1).setOrigin(0.5));

    add(this.add.text(W/2, pY+54, building.desc, {
      fontSize: '12px', fontFamily: 'Georgia, serif',
      fill: '#b0a080', wordWrap: { width: W-60 }, align: 'center'
    }).setScrollFactor(0).setDepth(D+1).setOrigin(0.5, 0));

    const btnLabel = building.action === 'trade'   ? '📦  Enter Market'
                   : building.action === 'talk'    ? '💬  Talk'
                   : building.action === 'rumors'  ? '👂  Listen to Rumors'
                   : building.action === 'explore' ? '🔍  Explore'
                   : '😴  Rest Here';

    const btnG = add(this.add.graphics().setScrollFactor(0).setDepth(D+1));
    btnG.fillStyle(0xd4a017);
    btnG.fillRoundedRect(W/2-100, pY+138, 200, 42, 10);

    add(this.add.text(W/2, pY+159, btnLabel, {
      fontSize: '15px', fontFamily: 'Georgia, serif',
      fill: '#1a0800', fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(D+2).setOrigin(0.5));

    const actZone = add(this.add.zone(W/2, pY+159, 200, 42)
      .setScrollFactor(0).setDepth(D+3).setInteractive());
    actZone.on('pointerdown', () => {
      this.panelObjects.forEach(o => { if (o && o.destroy) o.destroy(); });
      this.panelObjects = [];
      this.handleBuildingAction(building);
    });

    const closeG = add(this.add.graphics().setScrollFactor(0).setDepth(D+1));
    closeG.fillStyle(0x3a2800); closeG.fillCircle(W-28, pY+16, 14);
    add(this.add.text(W-28, pY+16, '✕', {
      fontSize: '13px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setScrollFactor(0).setDepth(D+2).setOrigin(0.5));
    const closeZone = add(this.add.zone(W-28, pY+16, 30, 30)
      .setScrollFactor(0).setDepth(D+3).setInteractive());
    closeZone.on('pointerdown', () => {
      this.panelObjects.forEach(o => { if (o && o.destroy) o.destroy(); });
      this.panelObjects = [];
    });
  }

  // ── BUILDING ACTION ───────────────────────────────────────────
  handleBuildingAction(building) {
    if (building.action === 'trade') {
      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.start('TradeScene', {
          town:         this.location,
          playerData:   this.playerData,
          fromBuilding: { x: building.x, y: building.y },
          itemFilter:   building.itemFilter || null
        });
      });
    } else if (building.action === 'rest') {
      this.playerData.day += 1;
      SaveSystem.autoSave(this.playerData, this.location.id);
      this.updateHUD();
      this.showFeedback('You rest for the night.  Day ' + this.playerData.day);
    } else if (building.action === 'talk') {
      this.showLocationDialog(building);
    } else if (building.action === 'rumors') {
      this.showRumors(building);
    } else if (building.action === 'explore') {
      this.showExplore(building);
    }
  }

  // ── RUMORS (village well) ─────────────────────────────────────
  showRumors(building) {
    if (!building.rumors || building.rumors.length === 0) {
      this.showLocationDialog(building);
      return;
    }

    const rumors  = building.rumors;
    const rumor   = rumors[Math.floor(Math.random() * rumors.length)];

    const W = this.W, H = this.H;
    const pH = 240, pY = H - pH - 50, D = 50;

    if (this.npcObjects) this.npcObjects.forEach(o => { if (o && o.destroy) o.destroy(); });
    this.npcObjects = [];
    const add = (obj) => { this.npcObjects.push(obj); return obj; };

    const bg = add(this.add.graphics().setScrollFactor(0).setDepth(D));
    bg.fillStyle(0x000000, 0.5);  bg.fillRect(0, 0, W, H);
    bg.fillStyle(0x1a0e00, 0.97); bg.fillRoundedRect(14, pY, W-28, pH, 14);
    bg.lineStyle(2, 0xd4a017, 0.5); bg.strokeRoundedRect(14, pY, W-28, pH, 14);

    add(this.add.text(W/2, pY+20, '💧  Village Well', {
      fontSize: '16px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setScrollFactor(0).setDepth(D+1).setOrigin(0.5));

    add(this.add.text(W/2, pY+44, 'You listen to the morning gossip...', {
      fontSize: '11px', fontFamily: 'Georgia, serif',
      fill: '#8B6B3A', fontStyle: 'italic'
    }).setScrollFactor(0).setDepth(D+1).setOrigin(0.5));

    add(this.add.text(W/2, pY+68, rumor, {
      fontSize: '13px', fontFamily: 'Georgia, serif',
      fill: '#c0a870', wordWrap: { width: W-60 },
      align: 'center', fontStyle: 'italic'
    }).setScrollFactor(0).setDepth(D+1).setOrigin(0.5, 0));

    add(this.add.text(W/2, pY+175, '(Free rumors — local area only)', {
      fontSize: '10px', fontFamily: 'Georgia, serif',
      fill: '#445566', fontStyle: 'italic'
    }).setScrollFactor(0).setDepth(D+1).setOrigin(0.5));

    const btnG = add(this.add.graphics().setScrollFactor(0).setDepth(D+1));
    btnG.fillStyle(0x3a2800);
    btnG.fillRoundedRect(W/2-70, pY+pH-52, 140, 40, 8);
    btnG.lineStyle(1, 0xd4a017, 0.5);
    btnG.strokeRoundedRect(W/2-70, pY+pH-52, 140, 40, 8);

    add(this.add.text(W/2, pY+pH-32, 'Walk Away', {
      fontSize: '14px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setScrollFactor(0).setDepth(D+2).setOrigin(0.5));

    const closeZone = add(this.add.zone(W/2, pY+pH-32, 140, 40)
      .setScrollFactor(0).setDepth(D+3).setInteractive());
    closeZone.on('pointerdown', () => {
      this.npcObjects.forEach(o => { if (o && o.destroy) o.destroy(); });
      this.npcObjects = [];
    });
  }

  // ── CAVE EXPLORATION ──────────────────────────────────────────
  showExplore(building) {
    if (!building.caveContent) {
      this.showLocationDialog(building);
      return;
    }

    const flags    = this.playerData.loreFlags || [];
    const visited  = flags.includes('cave_carvings_found');
    const looted   = flags.includes('fathers_coin_found');

    // Determine what to show
    let title, text, loreFlag, grantItems = [];

    if (!visited) {
      title    = '🕳  The Cliff Cave';
      text     = building.caveContent.firstVisit.text;
      loreFlag = building.caveContent.firstVisit.loreFlag;
    } else if (!looted) {
      title    = '🕳  The Cliff Cave';
      text     = building.caveContent.tinBox.text;
      loreFlag = building.caveContent.tinBox.loreFlag;
      grantItems = building.caveContent.tinBox.items;
    } else {
      title = '🕳  The Cliff Cave';
      text  = 'The cave is quiet. The carvings on the wall still point west.\n\nYou sit for a moment and watch the horizon.';
    }

    const W = this.W, H = this.H;
    const pH = 260, pY = H - pH - 50, D = 50;

    if (this.npcObjects) this.npcObjects.forEach(o => { if (o && o.destroy) o.destroy(); });
    this.npcObjects = [];
    const add = (obj) => { this.npcObjects.push(obj); return obj; };

    const bg = add(this.add.graphics().setScrollFactor(0).setDepth(D));
    bg.fillStyle(0x000000, 0.6);  bg.fillRect(0, 0, W, H);
    bg.fillStyle(0x0a0808, 0.98); bg.fillRoundedRect(14, pY, W-28, pH, 14);
    bg.lineStyle(2, 0x8a7a6a, 0.6); bg.strokeRoundedRect(14, pY, W-28, pH, 14);

    add(this.add.text(W/2, pY+20, title, {
      fontSize: '16px', fontFamily: 'Georgia, serif', fill: '#c8b89a'
    }).setScrollFactor(0).setDepth(D+1).setOrigin(0.5));

    add(this.add.text(W/2, pY+50, text, {
      fontSize: '12px', fontFamily: 'Georgia, serif',
      fill: '#a09880', wordWrap: { width: W-60 },
      align: 'center', fontStyle: 'italic'
    }).setScrollFactor(0).setDepth(D+1).setOrigin(0.5, 0));

    // Show granted items if any
    if (grantItems.length > 0) {
      const itemNames = grantItems.map(id => {
        const def = GAME_DATA.items.find(i => i.id === id);
        return def ? def.emoji + ' ' + def.name : id;
      }).join('  ');

      add(this.add.text(W/2, pY+pH-80, 'Found: ' + itemNames, {
        fontSize: '13px', fontFamily: 'Georgia, serif', fill: '#d4a017'
      }).setScrollFactor(0).setDepth(D+2).setOrigin(0.5));
    }

    const btnG = add(this.add.graphics().setScrollFactor(0).setDepth(D+1));
    btnG.fillStyle(0x2a2018);
    btnG.fillRoundedRect(W/2-70, pY+pH-52, 140, 40, 8);
    btnG.lineStyle(1, 0x8a7a6a, 0.5);
    btnG.strokeRoundedRect(W/2-70, pY+pH-52, 140, 40, 8);

    add(this.add.text(W/2, pY+pH-32, 'Leave Cave', {
      fontSize: '14px', fontFamily: 'Georgia, serif', fill: '#c8b89a'
    }).setScrollFactor(0).setDepth(D+2).setOrigin(0.5));

    const closeZone = add(this.add.zone(W/2, pY+pH-32, 140, 40)
      .setScrollFactor(0).setDepth(D+3).setInteractive());
    closeZone.on('pointerdown', () => {
      // Grant lore flag
      if (loreFlag) {
        if (!this.playerData.loreFlags) this.playerData.loreFlags = [];
        if (!this.playerData.loreFlags.includes(loreFlag)) {
          this.playerData.loreFlags.push(loreFlag);
        }
      }
      // Grant items
      grantItems.forEach(itemId => {
        const def = GAME_DATA.items.find(i => i.id === itemId);
        if (def) {
          this.playerData.inventory.push({ itemId, buyPrice: 0, quantity: 1 });
          this.showFeedback('Found: ' + def.emoji + ' ' + def.name);
        }
      });
      SaveSystem.autoSave(this.playerData, this.location.id);
      this.npcObjects.forEach(o => { if (o && o.destroy) o.destroy(); });
      this.npcObjects = [];
    });
  }

  // ── LOCATION DIALOG (buildings with talk/explore) ─────────────
  showLocationDialog(building) {
    if (this.npcObjects) {
      this.npcObjects.forEach(o => { if (o && o.destroy) o.destroy(); });
    }
    this.npcObjects = [];

    const lines = (building.dialogs && building.dialogs.length > 0)
      ? building.dialogs
      : [building.desc || '"..."'];

    const line = lines[Math.floor(Math.random() * lines.length)];

    const W = this.W, H = this.H;
    const pH = 230, pY = H - pH - 50, D = 50;
    const add = (obj) => { this.npcObjects.push(obj); return obj; };

    const bg = add(this.add.graphics().setScrollFactor(0).setDepth(D));
    bg.fillStyle(0x000000, 0.5); bg.fillRect(0, 0, W, H);
    bg.fillStyle(0x1a0e00, 0.97); bg.fillRoundedRect(14, pY, W-28, pH, 14);
    bg.lineStyle(2, 0xd4a017, 0.5); bg.strokeRoundedRect(14, pY, W-28, pH, 14);

    add(this.add.text(W/2, pY+22, `${building.icon}  ${building.label}`, {
      fontSize: '16px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setScrollFactor(0).setDepth(D+1).setOrigin(0.5));

    add(this.add.text(W/2, pY+52, line, {
      fontSize: '13px', fontFamily: 'Georgia, serif',
      fill: '#c0a870', wordWrap: { width: W-60 },
      align: 'center', fontStyle: 'italic'
    }).setScrollFactor(0).setDepth(D+1).setOrigin(0.5, 0));

    const btnG = add(this.add.graphics().setScrollFactor(0).setDepth(D+1));
    btnG.fillStyle(0x3a2800);
    btnG.fillRoundedRect(W/2-70, pY+pH-52, 140, 40, 8);
    btnG.lineStyle(1, 0xd4a017, 0.5);
    btnG.strokeRoundedRect(W/2-70, pY+pH-52, 140, 40, 8);

    add(this.add.text(W/2, pY+pH-32, 'Walk Away', {
      fontSize: '14px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setScrollFactor(0).setDepth(D+2).setOrigin(0.5));

    const closeZone = add(this.add.zone(W/2, pY+pH-32, 140, 40)
      .setScrollFactor(0).setDepth(D+3).setInteractive());
    closeZone.on('pointerdown', () => {
      this.npcObjects.forEach(o => { if (o && o.destroy) o.destroy(); });
      this.npcObjects = [];
    });
  }

  // ── FEEDBACK ──────────────────────────────────────────────────
  showFeedback(msg) {
    const txt = this.add.text(this.W/2, this.H/2, msg, {
      fontSize: '16px', fontFamily: 'Georgia, serif',
      fill: '#ffd700', stroke: '#000000', strokeThickness: 4
    }).setScrollFactor(0).setOrigin(0.5).setDepth(60);
    this.tweens.add({
      targets: txt, y: txt.y-50, alpha: 0,
      duration: 1400, ease: 'Power2',
      onComplete: () => txt.destroy()
    });
  }

  // ── UPDATE LOOP ───────────────────────────────────────────────
  update() {
    const SPEED = 160;
    let vx = 0, vy = 0;

    if (this.cursors) {
      if (this.cursors.left.isDown)  vx = -SPEED;
      if (this.cursors.right.isDown) vx =  SPEED;
      if (this.cursors.up.isDown)    vy = -SPEED;
      if (this.cursors.down.isDown)  vy =  SPEED;
    }

    if (this.joy.active && (this.joy.dx !== 0 || this.joy.dy !== 0)) {
      vx = this.joy.dx * SPEED;
      vy = this.joy.dy * SPEED;
      this.isWalking = false;
    }

    if (this.isWalking && this.walkTarget) {
      const dx   = this.walkTarget.x - this.player.x;
      const dy   = this.walkTarget.y - this.player.y;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < 12) {
        this.isWalking = false;
        this.player.body.setVelocity(0, 0);
        if (this.targetBuilding) {
          this.showBuildingPanel(this.targetBuilding);
          this.targetBuilding = null;
        }
        return;
      }

      vx = (dx/dist) * SPEED;
      vy = (dy/dist) * SPEED;
    }

    this.player.body.setVelocity(vx, vy);
    this.player.rotation = vx !== 0 ? vx * 0.001 : 0;
  }
}