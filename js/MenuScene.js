class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    this.W = this.cameras.main.width;
    this.H = this.cameras.main.height;

    this.drawBackground();
    this.drawTitle();
    this.drawSaveSlots();
  }

  drawBackground() {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x050518, 0x050518, 0x100820, 0x100820, 1);
    bg.fillRect(0, 0, this.W, this.H);

    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, this.W);
      const y = Phaser.Math.Between(0, this.H);
      const r = Math.random() * 1.5 + 0.3;
      const alpha = Math.random() * 0.6 + 0.2;
      const star = this.add.graphics();
      star.fillStyle(0xffffff, alpha);
      star.fillCircle(x, y, r);
      this.tweens.add({
        targets: star,
        alpha: { from: alpha, to: alpha * 0.2 },
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true, repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }

    // Decorative lines
    const deco = this.add.graphics();
    deco.lineStyle(1, 0xd4a017, 0.35);
    deco.lineBetween(this.W*0.1, this.H*0.28, this.W*0.9, this.H*0.28);
  }

  drawTitle() {
    this.add.text(this.W/2, this.H * 0.10, 'THE PURPLE SEA', {
      fontSize: '36px', fontFamily: 'Georgia, serif',
      fill: '#d4a017', stroke: '#1a0800', strokeThickness: 5,
      letterSpacing: 4
    }).setOrigin(0.5);

    this.add.text(this.W/2, this.H * 0.18, "A Merchant's Tale", {
      fontSize: '14px', fontFamily: 'Georgia, serif',
      fill: '#8899bb', fontStyle: 'italic'
    }).setOrigin(0.5);

    // New Game button
    const ngY = this.H * 0.23;
    const ngG = this.add.graphics();
    ngG.fillStyle(0xd4a017);
    ngG.fillRoundedRect(this.W/2 - 100, ngY, 200, 38, 8);

    this.add.text(this.W/2, ngY + 19, '⚓  New Game', {
      fontSize: '15px', fontFamily: 'Georgia, serif',
      fill: '#1a0800', fontStyle: 'bold'
    }).setOrigin(0.5);

    const ngZone = this.add.zone(this.W/2, ngY + 19, 200, 38).setInteractive();
    ngZone.on('pointerdown', () => this.startNewGame());
  }

  drawSaveSlots() {
    const slots = SaveSystem.getAllSlots();
    const startY = this.H * 0.33;
    const slotH  = (this.H * 0.58) / 3;

    this.add.text(this.W/2, startY - 22, 'SAVE SLOTS', {
      fontSize: '11px', fontFamily: 'Georgia, serif',
      fill: '#8B6B3A', letterSpacing: 4
    }).setOrigin(0.5);

    slots.forEach((slot, i) => {
      const y = startY + i * slotH;
      this.drawSlot(slot, y, slotH - 8);
    });
  }

  drawSlot(slot, y, h) {
    const W = this.W;
    const g = this.add.graphics();

    if (slot.exists) {
      // Filled slot
      g.fillStyle(0x1a1228, 0.95);
      g.fillRoundedRect(16, y, W - 32, h, 10);
      g.lineStyle(1.5, 0xd4a017, 0.5);
      g.strokeRoundedRect(16, y, W - 32, h, 10);

      // Slot number
      this.add.text(32, y + 12, `SLOT ${slot.slot}`, {
        fontSize: '10px', fontFamily: 'Georgia, serif',
        fill: '#8B6B3A', letterSpacing: 3
      });

      // City & day
      this.add.text(32, y + 28, `${slot.cityName}  —  Day ${slot.day}`, {
        fontSize: '15px', fontFamily: 'Georgia, serif', fill: '#e8d090'
      });

      // Gold
      this.add.text(32, y + 50, `⚜ ${slot.gold} Coins`, {
        fontSize: '12px', fontFamily: 'Georgia, serif', fill: '#ffd700'
      });

      // Timestamp
      this.add.text(32, y + 68, slot.timestamp, {
        fontSize: '11px', fontFamily: 'Georgia, serif', fill: '#556677'
      });

      // Continue button
      const btnG = this.add.graphics();
      btnG.fillStyle(0x2a5a22);
      btnG.fillRoundedRect(W - 110, y + 20, 86, 32, 8);
      btnG.lineStyle(1, 0x44aa44, 0.5);
      btnG.strokeRoundedRect(W - 110, y + 20, 86, 32, 8);

      this.add.text(W - 67, y + 36, '▶ Continue', {
        fontSize: '12px', fontFamily: 'Georgia, serif', fill: '#70dd70'
      }).setOrigin(0.5);

      const contZone = this.add.zone(W - 67, y + 36, 86, 32).setInteractive();
      contZone.on('pointerdown', () => this.loadSlot(slot.slot));

      // Delete button
      const delG = this.add.graphics();
      delG.fillStyle(0x3a1010);
      delG.fillRoundedRect(W - 110, y + 58, 86, 26, 6);
      delG.lineStyle(1, 0xaa3333, 0.4);
      delG.strokeRoundedRect(W - 110, y + 58, 86, 26, 6);

      this.add.text(W - 67, y + 71, '🗑 Delete', {
        fontSize: '11px', fontFamily: 'Georgia, serif', fill: '#ee6655'
      }).setOrigin(0.5);

      const delZone = this.add.zone(W - 67, y + 71, 86, 26).setInteractive();
      delZone.on('pointerdown', () => this.deleteSlot(slot.slot));

    } else {
      // Empty slot
      g.fillStyle(0x0e0a18, 0.7);
      g.fillRoundedRect(16, y, W - 32, h, 10);
      g.lineStyle(1, 0x2a2040, 0.8);
      g.strokeRoundedRect(16, y, W - 32, h, 10);

      this.add.text(W/2, y + h/2 - 8, `SLOT ${slot.slot}`, {
        fontSize: '10px', fontFamily: 'Georgia, serif',
        fill: '#3a3050', letterSpacing: 3
      }).setOrigin(0.5);

      this.add.text(W/2, y + h/2 + 10, '— Empty —', {
        fontSize: '13px', fontFamily: 'Georgia, serif', fill: '#2a2040'
      }).setOrigin(0.5);
    }
  }

  startNewGame() {
    this.cameras.main.fade(400, 0, 0, 0);
    this.time.delayedCall(400, () => {
      const homeTown = GAME_DATA.towns.find(t => t.isHome);
this.scene.start('LocationMapScene', {
  town: homeTown,
  playerData: JSON.parse(JSON.stringify(GAME_DATA.player)),
  saveSlot: null
});
    });
  }

  loadSlot(slotNumber) {
    const saved = SaveSystem.load(slotNumber);
    if (!saved) return;

    const town = GAME_DATA.towns.find(t => t.id === saved.currentCityId)
               || GAME_DATA.towns.find(t => t.isHome);

    this.cameras.main.fade(400, 0, 0, 0);
    this.time.delayedCall(400, () => {
      this.scene.start('LocationMapScene', {
  town: town,
  playerData: saved.playerData,
  saveSlot: slotNumber
});
    });
  }

  deleteSlot(slotNumber) {
    SaveSystem.delete(slotNumber);
    // Refresh the scene to update UI
    this.scene.restart();
  }
}