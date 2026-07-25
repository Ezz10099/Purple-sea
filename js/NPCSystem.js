// ================================================================
//  NPC SYSTEM
//  Reusable for all cities.
//  Usage: this.npcSystem = new NPCSystem(scene);
//         this.npcSystem.create(npcDataArray);
// ================================================================

class NPCSystem {
  constructor(scene) {
    this.scene = scene;
    this.npcs  = [];
  }

  create(npcDataArray) {
    npcDataArray.forEach(data => this.spawnNPC(data));
  }

  spawnNPC(data) {
    const scene = this.scene;
    const x     = data.x;
    const y     = data.y;

    // Draw NPC character
    const g = scene.add.graphics();
    this.drawCharacter(g, data);
    g.x = x;
    g.y = y;
    g.setDepth(4);

    // Name label
    const label = scene.add.text(x, y - 28, data.displayName, {
      fontSize: '9px', fontFamily: 'Georgia, serif',
      fill: '#fff8dc', stroke: '#1a0800', strokeThickness: 3
    }).setOrigin(0.5).setDepth(4);

    // Role label
    const roleLabel = scene.add.text(x, y - 18, data.role || '', {
      fontSize: '8px', fontFamily: 'Georgia, serif',
      fill: '#d4a017'
    }).setOrigin(0.5).setDepth(4);

    // Tap zone
    const zone = scene.add.zone(x, y, 40, 40).setInteractive().setDepth(5);
    zone.on('pointerdown', () => this.openDialogue(data));

    // Idle animation — gentle float
    scene.tweens.add({
      targets: [g, label, roleLabel],
      y: '-=3',
      duration: Phaser.Math.Between(1400, 1800),
      yoyo: true, repeat: -1,
      ease: 'Sine.easeInOut',
      delay: Phaser.Math.Between(0, 600)
    });

    this.npcs.push({ g, label, roleLabel, zone, data });
  }

  drawCharacter(g, data) {
    const style = data.visualStyle || 'default';

    // Shadow
    g.fillStyle(0x000000, 0.15);
    g.fillEllipse(0, 16, 20, 7);

    // Clothing base — varies per NPC
    const clothColor  = data.clothColor  || 0xb08840;
    const skinColor   = data.skinColor   || 0xe8b87a;
    const accentColor = data.accentColor || 0x6a4820;

    // Body/robe
    g.fillStyle(clothColor);
    g.fillTriangle(-10, 2, 10, 2, 5, 18);
    g.fillTriangle(-10, 2, -5, 18, 5, 18);

    // Head
    g.fillStyle(skinColor);
    g.fillCircle(0, -8, 8);

    // Hair / head covering
    g.fillStyle(accentColor);
    if (data.headCovering === 'headscarf') {
      g.fillEllipse(0, -12, 18, 10);
      g.fillRect(-9, -12, 18, 5);
    } else if (data.headCovering === 'bald') {
      // nothing
    } else {
      // Default hair
      g.fillEllipse(0, -14, 16, 8);
    }

    // Eyes
    g.fillStyle(0x1a0800);
    g.fillCircle(-3, -8, 1.5);
    g.fillCircle(3,  -8, 1.5);

    // Accessory
    if (data.accessory === 'scroll') {
      g.fillStyle(0xd4c090);
      g.fillRect(8, -2, 5, 10);
      g.fillStyle(0x8a6040);
      g.fillRect(7, -3, 7, 2);
      g.fillRect(7, 10, 7, 2);
    } else if (data.accessory === 'cane') {
      g.fillStyle(0x7a5020);
      g.fillRect(10, -5, 3, 24);
    }
  }

  openDialogue(data) {
    const scene = this.scene;

    // Block if settings or building panel open
    if (scene.settingsPanel && scene.settingsPanel.visible) return;
    if (scene.panelObjects && scene.panelObjects.length > 0) return;

    // Clear existing dialogue
    this.closeDialogue();

    const W  = scene.cameras.main.width;
    const H  = scene.cameras.main.height;
    const pH = 260;
    const pY = H - pH - 50;
    const D  = 60;

    this.dialogueObjects = [];
    const add = (obj) => { this.dialogueObjects.push(obj); return obj; };

    // Choose dialogue line
    const lines   = data.dialogues || ['"..."'];
    const line    = lines[Math.floor(Math.random() * lines.length)];

    // Background
    const bg = add(scene.add.graphics().setScrollFactor(0).setDepth(D));
    bg.fillStyle(0x000000, 0.45);
    bg.fillRect(0, 0, W, H);
    bg.fillStyle(0x1a0e00, 0.97);
    bg.fillRoundedRect(14, pY, W - 28, pH, 14);
    bg.lineStyle(2, 0xd4a017, 0.6);
    bg.strokeRoundedRect(14, pY, W - 28, pH, 14);
    bg.lineStyle(1, 0xd4a017, 0.2);
    bg.strokeRoundedRect(18, pY+4, W-36, pH-8, 11);

    // NPC name
    add(scene.add.text(W/2, pY + 22, data.displayName, {
      fontSize: '17px', fontFamily: 'Georgia, serif',
      fill: '#d4a017', stroke: '#1a0800', strokeThickness: 3
    }).setScrollFactor(0).setDepth(D+1).setOrigin(0.5));

    // Role
    add(scene.add.text(W/2, pY + 44, data.role || '', {
      fontSize: '11px', fontFamily: 'Georgia, serif',
      fill: '#8B6B3A', fontStyle: 'italic'
    }).setScrollFactor(0).setDepth(D+1).setOrigin(0.5));

    // Divider
    const div = add(scene.add.graphics().setScrollFactor(0).setDepth(D+1));
    div.lineStyle(1, 0xd4a017, 0.3);
    div.lineBetween(30, pY + 58, W - 30, pY + 58);

    // Dialogue text
    add(scene.add.text(W/2, pY + 70, line, {
      fontSize: '13px', fontFamily: 'Georgia, serif',
      fill: '#c0a870', wordWrap: { width: W - 60 },
      align: 'center', fontStyle: 'italic'
    }).setScrollFactor(0).setDepth(D+1).setOrigin(0.5, 0));

    // Player choice buttons if defined
    if (data.choices && data.choices.length > 0) {
      data.choices.forEach((choice, i) => {
        const btnY = pY + 160 + i * 44;

        const btnG = add(scene.add.graphics().setScrollFactor(0).setDepth(D+1));
        btnG.fillStyle(0x2a1800);
        btnG.fillRoundedRect(W/2 - 130, btnY, 260, 36, 8);
        btnG.lineStyle(1, 0xd4a017, 0.4);
        btnG.strokeRoundedRect(W/2 - 130, btnY, 260, 36, 8);

        add(scene.add.text(W/2, btnY + 18, choice.text, {
          fontSize: '12px', fontFamily: 'Georgia, serif', fill: '#e8d090'
        }).setScrollFactor(0).setDepth(D+2).setOrigin(0.5));

        const choiceZone = add(
          scene.add.zone(W/2, btnY + 18, 260, 36)
            .setScrollFactor(0).setDepth(D+3).setInteractive()
        );
        choiceZone.on('pointerdown', () => {
          if (choice.outcome) {
            this.handleChoiceOutcome(choice.outcome, data);
          } else {
            this.closeDialogue();
          }
        });
      });
    } else {
      // Simple walk away button
      const btnG = add(scene.add.graphics().setScrollFactor(0).setDepth(D+1));
      btnG.fillStyle(0x2a1800);
      btnG.fillRoundedRect(W/2 - 80, pY + pH - 52, 160, 38, 8);
      btnG.lineStyle(1, 0xd4a017, 0.4);
      btnG.strokeRoundedRect(W/2 - 80, pY + pH - 52, 160, 38, 8);

      add(scene.add.text(W/2, pY + pH - 33, 'Walk Away', {
        fontSize: '14px', fontFamily: 'Georgia, serif', fill: '#d4a017'
      }).setScrollFactor(0).setDepth(D+2).setOrigin(0.5));

      const closeZone = add(
        scene.add.zone(W/2, pY + pH - 33, 160, 38)
          .setScrollFactor(0).setDepth(D+3).setInteractive()
      );
      closeZone.on('pointerdown', () => this.closeDialogue());
    }
  }

  handleChoiceOutcome(outcome, npcData) {
    const scene = this.scene;
    this.closeDialogue();

    if (outcome.type === 'dialogue') {
      // Show follow-up dialogue
      const followUp = npcData.followUpDialogues &&
                       npcData.followUpDialogues[outcome.dialogueId];
      if (followUp) {
        const tempData = Object.assign({}, npcData, {
          dialogues: followUp.lines,
          choices:   followUp.choices || []
        });
        this.openDialogue(tempData);
      }
    } else if (outcome.type === 'lore_flag') {
      if (!scene.playerData.loreFlags) scene.playerData.loreFlags = [];
      if (!scene.playerData.loreFlags.includes(outcome.flag)) {
        scene.playerData.loreFlags.push(outcome.flag);
      }
      SaveSystem.autoSave(scene.playerData, scene.town.id);
    } else if (outcome.type === 'close') {
      // just close — already done
    }
  }

  closeDialogue() {
    if (this.dialogueObjects) {
      this.dialogueObjects.forEach(o => { if (o && o.destroy) o.destroy(); });
      this.dialogueObjects = [];
    }
  }

  destroy() {
    this.closeDialogue();
    this.npcs.forEach(n => {
      if (n.g)         n.g.destroy();
      if (n.label)     n.label.destroy();
      if (n.roleLabel) n.roleLabel.destroy();
      if (n.zone)      n.zone.destroy();
    });
    this.npcs = [];
  }
}