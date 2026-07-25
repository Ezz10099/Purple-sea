class WorldScene extends Phaser.Scene {
  constructor() { super({ key: 'WorldScene' }); }

  create() {
    this.W = this.cameras.main.width;
    this.H = this.cameras.main.height;

    // Map virtual size — larger than screen
    this.MAP_W = this.W * 1.4;
this.MAP_H = this.H * 1.4;

    this.playerData = (this.scene.settings.data && this.scene.settings.data.playerData)
      ? this.scene.settings.data.playerData
      : JSON.parse(JSON.stringify(GAME_DATA.player));

    // Zoom state
    this.zoomLevel  = 0;         // 0=overview, 1=regional, 2=closeup
    this.zoomLevels = [1, 1.8, 3.0];
    this.panX = 0;
    this.panY = 0;

    // Map container — everything on the map lives here
    this.mapContainer = this.add.container(0, 58);

    this.drawMap();
    this.drawRoutes();
    this.createCityMarkers();

    // HUD & controls (screen space, don't zoom)
    this.createHUD();
    this.createZoomButtons();
    this.createTravelPanel();
    this.setupPanDrag();
    this.startTimeLoop();

    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  // ── MAP BACKGROUND ───────────────────────────────────────────
  drawMap() {
    const W = this.MAP_W;
    const H = this.MAP_H;
    const g = this.add.graphics();

    // ── Parchment base ──────────────────────────────────────
    g.fillStyle(0xc4a46a);
    g.fillRect(0, 0, W, H);

    // Parchment texture — subtle variation
    g.fillStyle(0xb8944a, 0.3);
    g.fillRect(0, 0, W * 0.6, H * 0.5);
    g.fillStyle(0xd4b47a, 0.2);
    g.fillRect(W * 0.3, H * 0.2, W * 0.7, H * 0.8);
    g.fillStyle(0xa8843a, 0.15);
    g.fillRect(0, H * 0.5, W * 0.5, H * 0.5);

    // Aged edges — darker border
    g.fillStyle(0x7a5a2a, 0.4);
    g.fillRect(0, 0, W, 8);
    g.fillRect(0, H-8, W, 8);
    g.fillRect(0, 0, 8, H);
    g.fillRect(W-8, 0, 8, H);

    // ── Mediterranean Sea ────────────────────────────────────
    g.fillStyle(0x4a7a9a, 0.75);
    g.fillRect(20, 20, W - 40, H - 40);

    // Sea texture — horizontal wave lines
    g.lineStyle(1, 0x5a8aaa, 0.35);
    for (let y = 30; y < H - 30; y += 14) {
      g.beginPath();
      g.moveTo(20, y);
      for (let x = 20; x < W - 20; x += 20) {
        g.lineTo(x + 10, y - 3);
        g.lineTo(x + 20, y);
      }
      g.strokePath();
    }

    // Sea depth variation
    g.fillStyle(0x3a6a8a, 0.2);
    g.fillEllipse(W * 0.5, H * 0.5, W * 0.7, H * 0.5);

    // ── LAND MASSES ──────────────────────────────────────────

    // Europe / Iberia (top left)
    g.fillStyle(0xc8a85a);
    g.fillRect(20, 20, 220, 160);
    g.fillStyle(0xb89848);
    g.fillTriangle(20, 180, 240, 180, 130, 220);
    // Iberia detail
    g.fillStyle(0xd4b46a);
    g.fillRect(30, 30, 180, 100);
    g.fillStyle(0xa08030, 0.3);
    g.fillEllipse(120, 100, 120, 60);

    // Southern France / Italy hints (top middle)
    g.fillStyle(0xc8a85a);
    g.fillRect(240, 20, 180, 80);
    g.fillTriangle(320, 100, 360, 100, 340, 160);

    // North Africa (bottom) — sandy desert
    g.fillStyle(0xd4aa5a);
    g.fillRect(20, H - 180, W - 40, 160);
    // Desert dunes texture
    g.fillStyle(0xe4ba6a, 0.4);
    for (let x = 40; x < W - 40; x += 60) {
      g.fillEllipse(x, H - 120, 70, 30);
    }
    g.fillStyle(0xc49a4a, 0.3);
    for (let x = 70; x < W - 40; x += 80) {
      g.fillEllipse(x, H - 90, 90, 25);
    }
    // Nile delta hint
    g.fillStyle(0x7a9a4a, 0.5);
    g.fillTriangle(W - 100, H - 180, W - 40, H - 180, W - 70, H - 220);

    // Phoenician Coast (right side)
    g.fillStyle(0xb89848);
    g.fillRect(W - 130, 20, 110, H - 200);
    // Mountain range on coast
    g.fillStyle(0x8a7040);
    [[W-110, 80],[W-85, 60],[W-60, 90],[W-100, 120],[W-75, 140]].forEach(([mx,my]) => {
      g.fillTriangle(mx, my+35, mx-18, my+35, mx, my);
      g.fillStyle(0x9a8050);
      g.fillTriangle(mx, my+35, mx+18, my+35, mx, my);
      g.fillStyle(0xffffff, 0.3);
      g.fillTriangle(mx, my, mx-6, my+12, mx+6, my+12);
      g.fillStyle(0x8a7040);
    });

    // Cyprus island
    g.fillStyle(0xb89848);
    g.fillEllipse(W * 0.62, H * 0.45, 65, 28);
    g.fillStyle(0x8a7040, 0.3);
    g.fillEllipse(W * 0.62, H * 0.44, 40, 14);

    // Crete island
    g.fillStyle(0xb08840);
    g.fillEllipse(W * 0.46, H - 195, 90, 28);

    // Sicily
    g.fillStyle(0xb08840);
    g.fillTriangle(W*0.32, H-180, W*0.38, H-180, W*0.35, H-215);

    // Sardinia
    g.fillStyle(0xb08840);
    g.fillEllipse(W*0.27, H*0.35, 28, 48);

    // ── TERRAIN DETAILS ──────────────────────────────────────

    // European forests
    g.fillStyle(0x6a8a3a, 0.5);
    [[60,40],[100,55],[140,40],[80,70],[120,68]].forEach(([tx,ty]) => {
      g.fillTriangle(tx, ty, tx-10, ty+18, tx+10, ty+18);
      g.fillStyle(0x5a7a2a, 0.5);
      g.fillTriangle(tx, ty+6, tx-8, ty+22, tx+8, ty+22);
      g.fillStyle(0x6a8a3a, 0.5);
    });

    // African palm trees
    g.fillStyle(0x7a9a3a, 0.4);
    [[W*0.15, H-185],[W*0.25, H-190],[W*0.45, H-188],[W*0.6, H-185]].forEach(([tx,ty]) => {
      g.fillRect(tx-2, ty, 4, 18);
      g.fillStyle(0x4a7a2a, 0.5);
      g.fillEllipse(tx, ty, 20, 10);
      g.fillStyle(0x7a9a3a, 0.4);
    });

    // ── PILLARS OF HERCULES ───────────────────────────────────
    g.fillStyle(0x5a4020);
    g.fillRect(218, 165, 8, 40);
    g.fillRect(218, H-182, 8, 40);
    g.lineStyle(2, 0xd4a017, 0.7);
    g.lineBetween(222, 205, 222, H-182);
    // Pillar tops
    g.fillStyle(0xd4a017, 0.6);
    g.fillRect(214, 158, 16, 8);
    g.fillRect(214, H-190, 16, 8);

    this.add.text(228, 200, 'Pillars of\nHercules', {
      fontSize: '10px', fontFamily: 'Georgia, serif',
      fill: '#7a5020'
    });

    // ── COMPASS ROSE ─────────────────────────────────────────
    const cx = 55, cy = H - 55;
    g.fillStyle(0x8a6030, 0.8);
    g.fillCircle(cx, cy, 22);
    g.lineStyle(1, 0xd4a017, 0.6);
    g.strokeCircle(cx, cy, 22);
    // N/S/E/W lines
    g.lineStyle(2, 0xd4a017, 0.8);
    g.lineBetween(cx, cy-18, cx, cy+18);
    g.lineBetween(cx-18, cy, cx+18, cy);
    // Diagonal lines
    g.lineStyle(1, 0xd4a017, 0.4);
    g.lineBetween(cx-13, cy-13, cx+13, cy+13);
    g.lineBetween(cx+13, cy-13, cx-13, cy+13);
    this.add.text(cx, cy-26, 'N', {
      fontSize: '11px', fontFamily: 'Georgia, serif',
      fill: '#d4a017', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.text(cx, cy+16, 'S', {
      fontSize: '9px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setOrigin(0.5);
    this.add.text(cx+20, cy, 'E', {
      fontSize: '9px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setOrigin(0.5);
    this.add.text(cx-20, cy, 'W', {
      fontSize: '9px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setOrigin(0.5);

    // ── MAP BORDER ───────────────────────────────────────────
    g.lineStyle(3, 0x7a5020, 0.9);
    g.strokeRect(10, 10, W - 20, H - 20);
    g.lineStyle(1, 0xd4a017, 0.4);
    g.strokeRect(14, 14, W - 28, H - 28);

    // Corner ornaments
    [[10,10],[W-10,10],[10,H-10],[W-10,H-10]].forEach(([cx,cy]) => {
      g.fillStyle(0xd4a017, 0.8);
      g.fillCircle(cx, cy, 5);
    });

    // Map title (on parchment)
    this.add.text(W/2, 28, 'MARE NOSTRUM', {
      fontSize: '16px', fontFamily: 'Georgia, serif',
      fill: '#5a3a10', stroke: '#c4a46a', strokeThickness: 2,
      letterSpacing: 6
    }).setOrigin(0.5);

    this.add.text(W/2, 48, '~ Our Sea ~', {
      fontSize: '10px', fontFamily: 'Georgia, serif',
      fill: '#7a5a20', fontStyle: 'italic'
    }).setOrigin(0.5);

    this.mapContainer.add(g);
  }

  // ── TRADE ROUTES ─────────────────────────────────────────────
  drawRoutes() {
    const g = this.add.graphics();
    const scale = this.MAP_W / this.W;
    const towns = GAME_DATA.towns;

    const routes = [
      ['kefr-yamm','tyre'], ['kefr-yamm','sidon'],
      ['kefr-yamm','byblos'], ['kefr-yamm','kition'],
      ['kefr-yamm','memphis'], ['tyre','sidon'],
      ['sidon','byblos'], ['kition','memphis'],
      ['kefr-yamm','carthage'], ['carthage','tartessos'],
    ];

    routes.forEach(([fromId, toId]) => {
      const from = towns.find(t => t.id === fromId);
      const to   = towns.find(t => t.id === toId);
      if (!from || !to) return;

      const fx = from.x * scale;
      const fy = from.y * scale;
      const tx = to.x * scale;
      const ty = to.y * scale;

      // Dashed route line
      g.lineStyle(1.5, 0x7a5020, 0.5);
      g.beginPath();
      g.moveTo(fx, fy);
      g.lineTo(tx, ty);
      g.strokePath();

      // Midpoint dot
      g.fillStyle(0xd4a017, 0.4);
      g.fillCircle((fx+tx)/2, (fy+ty)/2, 3);
    });

    this.mapContainer.add(g);
  }

  // ── CITY MARKERS ─────────────────────────────────────────────
  createCityMarkers() {
    this.cityMarkers = [];
    const scale = this.MAP_W / this.W;

    GAME_DATA.towns.forEach(td => {
      const sx = td.x * scale;
      const sy = td.y * scale;

      // Glow
      const glow = this.add.graphics();
      glow.fillStyle(td.color, 0.2);
      glow.fillCircle(sx, sy, 35);

      // City icon
      const icon = this.add.graphics();
      if (td.isHome) {
        // Star shape for home
        icon.fillStyle(0xd4a017);
        icon.fillCircle(sx, sy, 12);
        icon.lineStyle(2, 0xffffff, 0.8);
        icon.strokeCircle(sx, sy, 12);
      } else {
        // Building icon for other cities
        icon.fillStyle(td.color, 0.95);
        icon.fillCircle(sx, sy, 9);
        icon.lineStyle(1.5, 0xffffff, 0.6);
        icon.strokeCircle(sx, sy, 9);
        // Inner dot
        icon.fillStyle(0xffffff, 0.7);
        icon.fillCircle(sx, sy, 3);
      }

      // Home marker
      if (td.isHome) {
        this.add.text(sx, sy, '⚓', {
          fontSize: '10px'
        }).setOrigin(0.5).setDepth(1);
      }

      // Label position — avoid edges
      const onRight = sx < this.MAP_W * 0.7;
      const labelX  = sx + (onRight ? 16 : -16);
      const labelY  = sy - 20;

      // Label background
      const labelBg = this.add.graphics();
      labelBg.fillStyle(0xc4a46a, 0.85);
      labelBg.fillRoundedRect(
        labelX - (onRight ? 2 : 72), labelY - 2, 74, 32, 3
      );
      labelBg.lineStyle(1, 0x7a5020, 0.5);
      labelBg.strokeRoundedRect(
        labelX - (onRight ? 2 : 72), labelY - 2, 74, 32, 3
      );

      // City name
      const label = this.add.text(
        labelX + (onRight ? 0 : -70),
        labelY,
        td.name, {
          fontSize: '11px', fontFamily: 'Georgia, serif',
          fill: '#2a1000', fontStyle: 'bold'
        }
      );

      // City type
      const typeLabel = this.add.text(
        labelX + (onRight ? 0 : -70),
        labelY + 14,
        td.type, {
          fontSize: '8px', fontFamily: 'Georgia, serif',
          fill: '#6a4010'
        }
      );

      // Pulse glow
      this.tweens.add({
        targets: glow,
        alpha: { from: 0.6, to: 0.1 },
        scaleX: { from: 1, to: 1.4 },
        scaleY: { from: 1, to: 1.4 },
        duration: Phaser.Math.Between(1800, 2800),
        yoyo: true, repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Tap zone
      const zone = this.add.zone(sx, sy, 44, 44).setInteractive();
      zone.on('pointerdown', () => this.showTravelPanel(td));

      this.mapContainer.add([glow, labelBg, icon, label, typeLabel, zone]);
      this.cityMarkers.push({ glow, icon, label, data: td, sx, sy });
    });
  }
// ── ZOOM ─────────────────────────────────────────────────────
  createZoomButtons() {
    const W = this.W;
    const H = this.H;

    // + button
    const plusG = this.add.graphics().setDepth(30);
    plusG.fillStyle(0x2a1800, 0.9);
    plusG.fillRoundedRect(W - 50, H - 100, 36, 36, 8);
    plusG.lineStyle(1, 0xd4a017, 0.6);
    plusG.strokeRoundedRect(W - 50, H - 100, 36, 36, 8);

    this.add.text(W - 32, H - 82, '+', {
      fontSize: '22px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setOrigin(0.5).setDepth(31);

    const plusZone = this.add.zone(W - 32, H - 82, 36, 36)
      .setDepth(32).setInteractive();
    plusZone.on('pointerdown', () => this.zoomIn());

    // - button
    const minusG = this.add.graphics().setDepth(30);
    minusG.fillStyle(0x2a1800, 0.9);
    minusG.fillRoundedRect(W - 50, H - 58, 36, 36, 8);
    minusG.lineStyle(1, 0xd4a017, 0.6);
    minusG.strokeRoundedRect(W - 50, H - 58, 36, 36, 8);

    this.add.text(W - 32, H - 40, '−', {
      fontSize: '22px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setOrigin(0.5).setDepth(31);

    const minusZone = this.add.zone(W - 32, H - 40, 36, 36)
      .setDepth(32).setInteractive();
    minusZone.on('pointerdown', () => this.zoomOut());

    // Zoom level indicator
    this.zoomIndicator = this.add.text(W - 32, H - 112, '1x', {
      fontSize: '10px', fontFamily: 'Georgia, serif', fill: '#8B6B3A'
    }).setOrigin(0.5).setDepth(31);
  }

  zoomIn() {
    if (this.zoomLevel >= this.zoomLevels.length - 1) return;
    this.zoomLevel++;
    this.applyZoom();
  }

  zoomOut() {
    if (this.zoomLevel <= 0) return;
    this.zoomLevel--;
    this.panX = 0;
    this.panY = 0;
    this.applyZoom();
  }

  applyZoom() {
    const zoom = this.zoomLevels[this.zoomLevel];
    const labels = ['1x', '2x', '3x'];
    this.zoomIndicator.setText(labels[this.zoomLevel]);

    this.tweens.add({
      targets: this.mapContainer,
      scaleX: zoom,
      scaleY: zoom,
      x: this.panX,
      y: 58,
      duration: 300,
      ease: 'Power2'
    });

    // Update edge indicators after zoom
    this.time.delayedCall(350, () => this.updateEdgeIndicators());
  }

  // ── PAN (drag to move map when zoomed) ───────────────────────
  setupPanDrag() {
    this.isDragging  = false;
    this.dragStartX  = 0;
    this.dragStartY  = 0;
    this.panStartX   = 0;
    this.panStartY   = 0;

    this.input.on('pointerdown', (ptr) => {
      // Only drag if not on HUD or panel
      if (ptr.y < 58 || ptr.y > this.H - 52) return;
      if (this.panelVisible) return;

      this.isDragging = true;
      this.dragStartX = ptr.x;
      this.dragStartY = ptr.y;
      this.panStartX  = this.mapContainer.x;
      this.panStartY  = this.mapContainer.y;
    });

    this.input.on('pointermove', (ptr) => {
      if (!this.isDragging) return;

      const zoom    = this.zoomLevels[this.zoomLevel];
      const scaledW = this.MAP_W * zoom;
const scaledH = this.MAP_H * zoom;

const minPanX = -(scaledW - this.W);
const minPanY = 58 - (scaledH - (this.H - 106));

this.panX = Phaser.Math.Clamp(
  this.panStartX + (ptr.x - this.dragStartX),
  minPanX, 0
);
this.panY = Phaser.Math.Clamp(
  this.panStartY + (ptr.y - this.dragStartY),
  minPanY, 58
);

this.mapContainer.x = this.panX;
this.mapContainer.y = this.panY;

      this.mapContainer.x = this.panX;
      this.mapContainer.y = this.panY;

      this.updateEdgeIndicators();
    });

    this.input.on('pointerup', () => {
      this.isDragging = false;
    });
  }
  // ── EDGE INDICATORS ──────────────────────────────────────────
  updateEdgeIndicators() {
    // Clear old indicators
    if (this.edgeIndicators) {
      this.edgeIndicators.forEach(e => e.destroy());
    }
    this.edgeIndicators = [];

    if (this.zoomLevel === 0) return;

    const zoom   = this.zoomLevels[this.zoomLevel];
    const scale  = this.MAP_W / this.W;
    const margin = 16;
    const W = this.W;
    const H = this.H;

    GAME_DATA.towns.forEach(td => {
      // World position of city in screen space
      const worldX = td.x * scale * zoom + this.mapContainer.x;
      const worldY = td.y * scale * zoom + this.mapContainer.y + 58;

      const onScreen =
        worldX > margin && worldX < W - margin &&
        worldY > 58 + margin && worldY < H - 52 - margin;

      if (onScreen) return;

      // Calculate edge position
      const centerX = W / 2;
      const centerY = (H - 106) / 2 + 58;
      const angle   = Math.atan2(worldY - centerY, worldX - centerX);

      // Find intersection with screen boundary
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const mapTop    = 68;
      const mapBottom = H - 62;
      const mapLeft   = margin;
      const mapRight  = W - margin;

      let edgeX, edgeY;
      const tRight  = (mapRight  - centerX) / cos;
      const tLeft   = (mapLeft   - centerX) / cos;
      const tBottom = (mapBottom - centerY) / sin;
      const tTop    = (mapTop    - centerY) / sin;

      const tCands = [tRight, tLeft, tBottom, tTop].filter(t => t > 0);
      const t      = Math.min(...tCands);

      edgeX = centerX + cos * t;
      edgeY = centerY + sin * t;

      edgeX = Phaser.Math.Clamp(edgeX, mapLeft + 10, mapRight - 10);
      edgeY = Phaser.Math.Clamp(edgeY, mapTop  + 10, mapBottom - 10);

      // Draw indicator
      const ind = this.add.graphics().setDepth(35);
      ind.fillStyle(td.color, 0.9);
      ind.fillCircle(edgeX, edgeY, 10);
      ind.lineStyle(2, 0xffffff, 0.6);
      ind.strokeCircle(edgeX, edgeY, 10);

      // Arrow pointing toward city
      const arrowLen = 14;
      ind.lineStyle(2, 0xffffff, 0.8);
      ind.lineBetween(
        edgeX,
        edgeY,
        edgeX + Math.cos(angle) * arrowLen,
        edgeY + Math.sin(angle) * arrowLen
      );

      // City name label
      const lbl = this.add.text(edgeX, edgeY + 14, td.name, {
        fontSize: '9px', fontFamily: 'Georgia, serif',
        fill: '#ffffff', stroke: '#000000', strokeThickness: 3
      }).setOrigin(0.5).setDepth(35);

      // Pulse
      this.tweens.add({
        targets: ind,
        alpha: { from: 1, to: 0.4 },
        duration: 700, yoyo: true, repeat: -1
      });

      // Tap indicator to snap to that city
      const zone = this.add.zone(edgeX, edgeY, 28, 28)
        .setInteractive().setDepth(36);
      zone.on('pointerdown', () => this.snapToCity(td));

      this.edgeIndicators.push(ind, lbl, zone);
    });
  }

  snapToCity(td) {
    const zoom   = this.zoomLevels[this.zoomLevel];
    const scale  = this.MAP_W / this.W;
    const cityX  = td.x * scale * zoom;
    const cityY  = td.y * scale * zoom;

    this.panX = this.W / 2 - cityX;
    this.panY = 58 + (this.H - 106) / 2 - cityY;

    const maxPanX = (this.MAP_W * zoom - this.W) / 2;
    const maxPanY = (this.MAP_H * zoom - (this.H - 106)) / 2;

    this.panX = Phaser.Math.Clamp(this.panX, -maxPanX, maxPanX);
    this.panY = Phaser.Math.Clamp(this.panY, 58 - maxPanY, 58 + maxPanY);

    this.tweens.add({
      targets: this.mapContainer,
      x: this.panX,
      y: this.panY,
      duration: 400,
      ease: 'Power2',
      onComplete: () => this.updateEdgeIndicators()
    });
  }

  // ── TRAVEL COST ───────────────────────────────────────────────
  getTravelCost(town) {
    if (town.isHome) return 0;
    const home = GAME_DATA.towns.find(t => t.isHome);
    const dist = Phaser.Math.Distance.Between(home.x, home.y, town.x, town.y);
    return Math.max(10, Math.round(dist * 0.5));
  }

  // ── HUD ───────────────────────────────────────────────────────
  createHUD() {
    const W = this.W;
    const H = this.H;

    const hud = this.add.graphics().setDepth(10);
    hud.fillStyle(0x1a0e00, 0.92);
    hud.fillRect(0, 0, W, 56);
    hud.lineStyle(2, 0xd4a017, 0.5);
    hud.lineBetween(0, 56, W, 56);

    const bot = this.add.graphics().setDepth(10);
    bot.fillStyle(0x1a0e00, 0.88);
    bot.fillRect(0, H - 50, W, 50);
    bot.lineStyle(1, 0xd4a017, 0.4);
    bot.lineBetween(0, H - 50, W, H - 50);

    this.goldText = this.add.text(16, 9, '', {
      fontSize: '18px', fontFamily: 'Georgia, serif', fill: '#ffd700'
    }).setDepth(11);

    this.cargoText = this.add.text(16, 32, '', {
      fontSize: '11px', fontFamily: 'Georgia, serif', fill: '#b0b8c0'
    }).setDepth(11);

    this.dayText = this.add.text(W - 14, 9, '', {
      fontSize: '12px', fontFamily: 'Georgia, serif', fill: '#e8d5a0'
    }).setDepth(11).setOrigin(1, 0);

    // Journal button
    const jG = this.add.graphics().setDepth(11);
    jG.fillStyle(0x3a2800);
    jG.fillRoundedRect(14, H - 44, 38, 32, 7);
    jG.lineStyle(1, 0xd4a017, 0.5);
    jG.strokeRoundedRect(14, H - 44, 38, 32, 7);

    this.add.text(33, H - 28, '📖', {
      fontSize: '16px'
    }).setDepth(12).setOrigin(0.5);

    const jZone = this.add.zone(33, H - 28, 38, 32)
      .setDepth(13).setInteractive();
    jZone.on('pointerdown', () => {
      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.start('JournalScene', { playerData: this.playerData });
      });
    });
    
    // Settings button
const setG2 = this.add.graphics().setDepth(11);
setG2.fillStyle(0x3a2800);
setG2.fillRoundedRect(14, 50, 38, 38, 8);
setG2.lineStyle(1, 0xd4a017, 0.5);
setG2.strokeRoundedRect(14, 50, 38, 38, 8);

this.add.text(33, 70, '⚙', {
  fontSize: '22px'
}).setDepth(12).setOrigin(0.5);

const setZone2 = this.add.zone(33, 27, 38, 38)
  .setDepth(13).setInteractive();
setZone2.on('pointerdown', () => {
  if (!this.settingsPanel) {
    this.settingsPanel = new SettingsPanel(
      this, this.playerData, null
    );
  }
  this.settingsPanel.show();
});
    this.hintText = this.add.text(W/2, H - 26, 'Tap a city to travel', {
      fontSize: '11px', fontFamily: 'Georgia, serif', fill: '#c8c8a0'
    }).setDepth(11).setOrigin(0.5);

    this.updateHUD();
  }

  updateHUD() {
    const d = this.playerData;
    this.goldText.setText(`⚜  ${d.gold} Coins`);
    const carried = d.inventory.reduce((sum, e) => {
      const def = GAME_DATA.items.find(i => i.id === e.itemId);
      return sum + (def ? def.weight : 0);
    }, 0);
    this.cargoText.setText(`Cargo: ${carried} / ${d.maxCarryWeight}  ·  Rep: ${d.reputation}`);
    this.dayText.setText(`Day ${d.day}`);
  }

  // ── TRAVEL PANEL ─────────────────────────────────────────────
  createTravelPanel() {
    this.panelVisible = false;

    this.panelBg = this.add.graphics().setDepth(20).setAlpha(0);
    this.panelContainer = this.add.container(0, 0).setDepth(21).setAlpha(0);

    this.overlay = this.add.zone(0, 0, this.W, this.H)
      .setOrigin(0).setDepth(19).setInteractive();
    this.overlay.on('pointerdown', () => this.hideTravelPanel());
    this.overlay.setActive(false).setVisible(false);
  }

  showTravelPanel(town) {
    const W = this.W;
    const H = this.H;
    const panelH = 250;
    const panelY = H - panelH - 54;
    const travelCost = this.getTravelCost(town);

    this.panelBg.clear();
    this.panelBg.fillStyle(0x000000, 0.5);
    this.panelBg.fillRect(0, 0, W, H);

    // Parchment-style panel
    this.panelBg.fillStyle(0x1a1008, 0.97);
    this.panelBg.fillRoundedRect(14, panelY, W - 28, panelH, 14);
    this.panelBg.lineStyle(2, town.color, 0.8);
    this.panelBg.strokeRoundedRect(14, panelY, W - 28, panelH, 14);
    // Gold inner line
    this.panelBg.lineStyle(1, 0xd4a017, 0.3);
    this.panelBg.strokeRoundedRect(18, panelY+4, W-36, panelH-8, 11);

    this.panelContainer.removeAll(true);

    // Town name
    const nameT = this.add.text(W/2, panelY + 22, town.name, {
      fontSize: '24px', fontFamily: 'Georgia, serif',
      fill: '#d4a017', stroke: '#1a0800', strokeThickness: 3
    }).setOrigin(0.5);
    this.panelContainer.add(nameT);

    // Type badge
    const typeT = this.add.text(W/2, panelY + 50, `${town.emoji || '🏛'}  ${town.type}  ·  ${town.region}`, {
      fontSize: '11px', fontFamily: 'Georgia, serif', fill: '#8B6B3A'
    }).setOrigin(0.5);
    this.panelContainer.add(typeT);

    // Divider
    const div = this.add.graphics();
    div.lineStyle(1, 0xd4a017, 0.3);
    div.lineBetween(30, panelY + 64, W - 30, panelY + 64);
    this.panelContainer.add(div);

    // Description
    const descT = this.add.text(W/2, panelY + 72, town.description, {
      fontSize: '12px', fontFamily: 'Georgia, serif',
      fill: '#b0a080', wordWrap: { width: W - 60 }, align: 'center'
    }).setOrigin(0.5, 0);
    this.panelContainer.add(descT);

    // Travel cost
    const isHome     = town.isHome;
    const costColor  = travelCost > 100 ? '#ee6655' : travelCost > 50 ? '#ffaa44' : '#70dd70';
    const costLabel  = isHome ? '⚓  Your home port' : `⛵  ${travelCost} Coins to travel`;

    const costT = this.add.text(W/2, panelY + 158,  costLabel, {
      fontSize: '14px', fontFamily: 'Georgia, serif',
      fill: isHome ? '#70dd70' : costColor
    }).setOrigin(0.5);
    this.panelContainer.add(costT);

    // Button
    const canAfford = this.playerData.gold >= travelCost || isHome;
    const btnColor  = canAfford ? 0xd4a017 : 0x333333;
    const btnLabel  = isHome
      ? 'Enter Village'
      : canAfford
      ? `Set Sail  →`
      : 'Not enough Coins';

    const btnG = this.add.graphics();
    btnG.fillStyle(btnColor);
    btnG.fillRoundedRect(W/2 - 110, panelY + 188, 220, 44, 10);
    if (canAfford) {
      btnG.lineStyle(1, 0xfff0c0, 0.4);
      btnG.strokeRoundedRect(W/2 - 110, panelY + 188, 220, 44, 10);
    }
    this.panelContainer.add(btnG);

    const btnT = this.add.text(W/2, panelY + 210, btnLabel, {
      fontSize: '16px', fontFamily: 'Georgia, serif',
      fill: canAfford ? '#1a0800' : '#555555', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.panelContainer.add(btnT);

    if (canAfford) {
      const travelZone = this.add.zone(W/2, panelY + 210, 220, 44).setInteractive();
      travelZone.on('pointerdown', () => {
        if (!isHome) {
          this.playerData.gold -= travelCost;
          this.playerData.day  += 1;
        }
        SaveSystem.autoSave(this.playerData, town.id);
        this.cameras.main.fade(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
          this.scene.start('LocationMapScene', {
  town: town,
  playerData: this.playerData
});
        });
      });
      this.panelContainer.add(travelZone);
    }

    this.overlay.setActive(true).setVisible(true);
    this.panelBg.setAlpha(0);
    this.panelContainer.setAlpha(0);
    this.tweens.add({
      targets: [this.panelBg, this.panelContainer],
      alpha: 1, duration: 250, ease: 'Power2'
    });
    this.panelVisible = true;
  }

  hideTravelPanel() {
    if (!this.panelVisible) return;
    this.tweens.add({
      targets: [this.panelBg, this.panelContainer],
      alpha: 0, duration: 150, ease: 'Power2'
    });
    this.overlay.setActive(false).setVisible(false);
    this.panelVisible = false;
  }
  // ── DAY / NIGHT ───────────────────────────────────────────────
  startTimeLoop() {
    this.currentPhase = 0;
    this.skyOverlay = this.add.graphics().setDepth(9);

    this.time.addEvent({
      delay: 90000,
      loop: true,
      callback: () => {
        this.currentPhase = (this.currentPhase + 1) % 2;
        if (this.currentPhase === 0) this.playerData.day += 1;
        this.applyDayNight();
        this.updateHUD();
      }
    });
  }

  applyDayNight() {
    const phases = [
      { label: 'Day',   color: '#d4a84b', alpha: 0.12 },
      { label: 'Night', color: '#1a2a4a', alpha: 0.60 },
    ];
    const phase = phases[this.currentPhase];
    this.tweens.killTweensOf(this.skyOverlay);

    if (phase.label === 'Night') {
      this.skyOverlay.clear();
      const c = Phaser.Display.Color.HexStringToColor(phase.color);
      this.skyOverlay.fillStyle(c.color, 1);
      this.skyOverlay.fillRect(0, 58, this.W, this.H - 106);
      this.skyOverlay.alpha = 0;
      this.tweens.add({
        targets: this.skyOverlay,
        alpha: phase.alpha, duration: 8000, ease: 'Sine.easeInOut'
      });
    } else {
      this.tweens.add({
        targets: this.skyOverlay,
        alpha: 0, duration: 8000, ease: 'Sine.easeInOut',
        onComplete: () => {
          this.skyOverlay.clear();
          const c = Phaser.Display.Color.HexStringToColor(phase.color);
          this.skyOverlay.fillStyle(c.color, 1);
          this.skyOverlay.fillRect(0, 58, this.W, this.H - 106);
          this.skyOverlay.alpha = 0.12;
          this.tweens.add({
            targets: this.skyOverlay,
            alpha: phase.alpha, duration: 6000, ease: 'Sine.easeInOut'
          });
        }
      });
    }

    if (this.dayText) {
      this.dayText.setText(`Day ${this.playerData.day}  —  ${phase.label}`);
    }
  }
}