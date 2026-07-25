class SettingsPanel {
  constructor(scene, playerData, town) {
    this.scene      = scene;
    this.playerData = playerData;
    this.town       = town;
    this.visible    = false;
    this.objects    = []; // track all created objects
  }

  show() {
    if (this.visible) return;
    this.visible = true;
    this.draw();
  }

  hide() {
    this.objects.forEach(o => { if (o && o.destroy) o.destroy(); });
    this.objects = [];
    this.visible = false;
  }

  add(obj) {
    this.objects.push(obj);
    return obj;
  }

  draw() {
    const scene = this.scene;
    const W     = scene.cameras.main.width;
    const H     = scene.cameras.main.height;
    const D     = 200; // base depth

    // Backdrop — absorbs all taps behind panel
    const backdrop = this.add(scene.add.graphics()
      .setScrollFactor(0).setDepth(D));
    backdrop.fillStyle(0x000000, 0.75);
    backdrop.fillRect(0, 0, W, H);

    const backdropZone = this.add(
      scene.add.zone(W/2, H/2, W, H)
        .setScrollFactor(0).setDepth(D + 1).setInteractive()
    );
    backdropZone.on('pointerdown', () => {}); // swallow taps

    // Panel background
    const pH = 340;
    const pY = (H - pH) / 2;

    const panel = this.add(scene.add.graphics()
      .setScrollFactor(0).setDepth(D + 2));
    panel.fillStyle(0x1a0e00, 0.98);
    panel.fillRoundedRect(18, pY, W - 36, pH, 16);
    panel.lineStyle(2, 0xd4a017, 0.8);
    panel.strokeRoundedRect(18, pY, W - 36, pH, 16);
    panel.lineStyle(1, 0xd4a017, 0.2);
    panel.strokeRoundedRect(22, pY + 4, W - 44, pH - 8, 13);

    // Title
    this.add(scene.add.text(W/2, pY + 24, '⚙  Settings', {
      fontSize: '20px', fontFamily: 'Georgia, serif',
      fill: '#d4a017', stroke: '#1a0800', strokeThickness: 3
    }).setScrollFactor(0).setDepth(D + 3).setOrigin(0.5));

    // Divider
    const div = this.add(scene.add.graphics()
      .setScrollFactor(0).setDepth(D + 3));
    div.lineStyle(1, 0xd4a017, 0.3);
    div.lineBetween(30, pY + 48, W - 30, pY + 48);

    // Movement hint
    this.add(scene.add.text(W/2, pY + 64,
      'Move: drag joystick on lower screen', {
        fontSize: '11px', fontFamily: 'Georgia, serif',
        fill: '#556677', fontStyle: 'italic'
      }).setScrollFactor(0).setDepth(D + 3).setOrigin(0.5));

    // Buttons
    this.addButton(pY + 100, '💾  Save Game',    0x2a5a22, 0x44aa44, D, () => this.doSave());
    this.addButton(pY + 160, '🏠  Main Menu',    0x2a1800, 0xd4a017, D, () => this.goMainMenu());
    this.addButton(pY + 220, '▶  Resume Game',   0x1a1228, 0xd4a017, D, () => this.hide());

    // Close X button
    const closeG = this.add(scene.add.graphics()
      .setScrollFactor(0).setDepth(D + 3));
    closeG.fillStyle(0x3a2800);
    closeG.fillCircle(W - 28, pY + 16, 14);

    this.add(scene.add.text(W - 28, pY + 16, '✕', {
      fontSize: '14px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setScrollFactor(0).setDepth(D + 4).setOrigin(0.5));

    const closeZone = this.add(
      scene.add.zone(W - 28, pY + 16, 30, 30)
        .setScrollFactor(0).setDepth(D + 5).setInteractive()
    );
    closeZone.on('pointerdown', () => this.hide());

    // Save feedback text
    this.feedbackText = this.add(scene.add.text(W/2, pY + pH - 24, '', {
      fontSize: '13px', fontFamily: 'Georgia, serif', fill: '#70dd70'
    }).setScrollFactor(0).setDepth(D + 3).setOrigin(0.5));
  }

  addButton(y, label, bgColor, borderColor, D, onPress) {
    const scene = this.scene;
    const W     = scene.cameras.main.width;

    const btnG = this.add(scene.add.graphics()
      .setScrollFactor(0).setDepth(D + 3));
    btnG.fillStyle(bgColor);
    btnG.fillRoundedRect(W/2 - 130, y, 260, 46, 10);
    btnG.lineStyle(1.5, borderColor, 0.7);
    btnG.strokeRoundedRect(W/2 - 130, y, 260, 46, 10);

    this.add(scene.add.text(W/2, y + 23, label, {
      fontSize: '15px', fontFamily: 'Georgia, serif',
      fill: '#' + borderColor.toString(16).padStart(6, '0'),
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(D + 4).setOrigin(0.5));

    const zone = this.add(
      scene.add.zone(W/2, y + 23, 260, 46)
        .setScrollFactor(0).setDepth(D + 5).setInteractive()
    );
    zone.on('pointerdown', onPress);
  }

  doSave() {
    const scene = this.scene;
    let slot = scene.saveSlot || null;

    if (!slot) {
      const slots = SaveSystem.getAllSlots();
      const empty = slots.find(s => !s.exists);
      slot = empty ? empty.slot : 1;
      if (scene.saveSlot !== undefined) scene.saveSlot = slot;
    }

    const success = SaveSystem.save(
      slot, this.playerData,
      this.town?.id || 'kefr-yamm'
    );
    SaveSystem.autoSave(this.playerData, this.town?.id || 'kefr-yamm');

    if (this.feedbackText) {
      this.feedbackText.setText(
        success ? `✓ Saved to Slot ${slot}` : '✗ Save failed'
      );
    }
  }

  goMainMenu() {
    SaveSystem.autoSave(this.playerData, this.town?.id || 'kefr-yamm');
    this.hide();
    this.scene.cameras.main.fade(400, 0, 0, 0);
    this.scene.time.delayedCall(400, () => {
      this.scene.scene.start('MenuScene');
    });
  }
}