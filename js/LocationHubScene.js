class LocationHubScene extends Phaser.Scene {
  constructor() { super({ key: 'LocationHubScene' }); }

  create(data) {
    this.W = this.cameras.main.width;
    this.H = this.cameras.main.height;
    this.town = data.town;
    this.playerData = data.playerData;
    this.saveSlot = data.saveSlot || null;

    this.drawBackground();
    this.drawHeader();
    this.createHubMenu();
    this.createBackButton();
    SaveSystem.autoSave(this.playerData, this.town.id);
    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  drawBackground() {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0810, 0x0a0810, 0x150e20, 0x150e20, 1);
    bg.fillRect(0, 0, this.W, this.H);

    // Stars
    for (let i = 0; i < 50; i++) {
      bg.fillStyle(0xffffff, Math.random() * 0.15 + 0.03);
      bg.fillCircle(
        Phaser.Math.Between(0, this.W),
        Phaser.Math.Between(0, this.H),
        Math.random() * 1.2 + 0.3
      );
    }

    // location color accent top bar
    const c = Phaser.Display.Color.IntegerToColor(this.town.color);
    bg.fillStyle(this.town.color, 0.15);
    bg.fillRect(0, 0, this.W, 90);

    // Panel
    bg.fillStyle(0x120d22, 0.95);
    bg.fillRoundedRect(12, 95, this.W - 24, this.H - 165, 14);
    bg.lineStyle(1.5, this.town.color, 0.5);
    bg.strokeRoundedRect(12, 95, this.W - 24, this.H - 165, 14);
  }

  drawHeader() {
    // location name
    this.add.text(this.W / 2, 28, this.town.name, {
      fontSize: '26px', fontFamily: 'Georgia, serif',
      fill: '#d4a017', stroke: '#1a0800', strokeThickness: 4
    }).setOrigin(0.5);

    // Tagline
    this.add.text(this.W / 2, 62, this.town.description, {
      fontSize: '12px', fontFamily: 'Georgia, serif',
      fill: '#9090a8', wordWrap: { width: this.W - 40 }, align: 'center'
    }).setOrigin(0.5, 0);

    // Gold display
    this.add.text(this.W / 2, 108, `⚜  ${this.playerData.gold} Gold  ·  Day ${this.playerData.day}`, {
      fontSize: '14px', fontFamily: 'Georgia, serif', fill: '#ffd700'
    }).setOrigin(0.5);
  }

  createHubMenu() {
    const options = [
  { icon: '📦', label: 'Market',       sub: 'Buy & sell goods',        action: () => this.goToMarket()   },
  { icon: '📜', label: 'Quests',       sub: 'View available quests',   action: () => this.goToQuests()   },
  { icon: '💾', label: 'Save Game',    sub: 'Save your progress',      action: () => this.saveGame()     },
  { icon: '🚪', label: 'Main Menu',    sub: 'Return to main menu',     action: () => this.goToMainMenu() },
  { icon: '👥', label: 'People',       sub: 'Coming soon',             action: null                      },
  { icon: '🏛️', label: 'Explore',      sub: 'Coming soon',             action: null                      },
];

    const startY = 148;
    const rowH   = 80;

    options.forEach((opt, i) => {
      const y = startY + i * rowH;
      const available = opt.action !== null;

      // Row bg
      const rowG = this.add.graphics();
      rowG.fillStyle(available ? 0x1c1530 : 0x111118, 0.9);
      rowG.fillRoundedRect(20, y, this.W - 40, rowH - 8, 10);
      rowG.lineStyle(1, available ? this.town.color : 0x333333, available ? 0.4 : 0.2);
      rowG.strokeRoundedRect(20, y, this.W - 40, rowH - 8, 10);

      // Icon
      this.add.text(52, y + 28, opt.icon, {
        fontSize: '24px'
      }).setOrigin(0.5);

      // Label
      this.add.text(76, y + 16, opt.label, {
        fontSize: '16px', fontFamily: 'Georgia, serif',
        fill: available ? '#e8d090' : '#444455', fontStyle: 'bold'
      });

      // Sub label
      this.add.text(76, y + 38, opt.sub, {
        fontSize: '12px', fontFamily: 'Georgia, serif',
        fill: available ? '#6a7a8a' : '#333344'
      });

      // Arrow
      if (available) {
        this.add.text(this.W - 32, y + 28, '›', {
          fontSize: '24px', fontFamily: 'Georgia, serif', fill: '#d4a017'
        }).setOrigin(0.5);
      }

      // Tap zone
      if (available) {
        const zone = this.add.zone(this.W / 2, y + 36, this.W - 40, rowH - 8)
          .setInteractive();
        zone.on('pointerdown', opt.action);
      }
    });
  }

  goToMarket() {
  this.cameras.main.fade(300, 0, 0, 0);
  this.time.delayedCall(300, () => {
    this.scene.start('TradeScene', {
      town: this.town,
      playerData: this.playerData,
      fromBuilding: { x: 400, y: 300 }
    });
  });
}

  goToQuests() {
  this.cameras.main.fade(300, 0, 0, 0);
  this.time.delayedCall(300, () => {
    this.scene.start('TradeScene', {
      town: this.town,
      playerData: this.playerData,
      startTab: 'QUESTS',
      fromBuilding: { x: 400, y: 300 }
    });
  });
}
  saveGame() {
    // Find first available slot or overwrite current
    let slot = this.saveSlot;
    if (!slot) {
      const slots = SaveSystem.getAllSlots();
      const empty = slots.find(s => !s.exists);
      slot = empty ? empty.slot : 1;
      this.saveSlot = slot;
    }

    const success = SaveSystem.save(slot, this.playerData, this.town.id);
    SaveSystem.autoSave(this.playerData, this.town.id);

    // Show feedback
    const msg = this.add.text(this.W/2, this.H/2, success ? `✓ Saved to Slot ${slot}` : '✗ Save failed', {
      fontSize: '18px', fontFamily: 'Georgia, serif',
      fill: success ? '#70dd70' : '#ee6655',
      stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(99);

    this.tweens.add({
      targets: msg, y: msg.y - 60, alpha: 0,
      duration: 1500, ease: 'Power2',
      onComplete: () => msg.destroy()
    });
  }

  goToMainMenu() {
    SaveSystem.autoSave(this.playerData, this.town.id);
    this.cameras.main.fade(400, 0, 0, 0);
    this.time.delayedCall(400, () => {
      this.scene.start('MenuScene');
    });
  }

  createBackButton() {
    const backG = this.add.graphics();
    backG.fillStyle(0x2a1a00);
    backG.fillRoundedRect(this.W/2 - 90, this.H - 58, 180, 42, 10);
    backG.lineStyle(1, 0xd4a017, 0.5);
    backG.strokeRoundedRect(this.W/2 - 90, this.H - 58, 180, 42, 10);

    this.add.text(this.W/2, this.H - 37, '← World Map', {
      fontSize: '15px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setOrigin(0.5);

    const zone = this.add.zone(this.W/2, this.H - 37, 180, 42).setInteractive();
    zone.on('pointerdown', () => {
      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.start('LocationHubScene', { playerData: this.playerData });
      });
    });
  }
}