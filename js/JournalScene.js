// ================================================================
// 6. JOURNAL SCENE
//    Shows active and completed quests from the world map.
// ================================================================
class JournalScene extends Phaser.Scene {
  constructor() { super({ key: 'JournalScene' }); }

  create(data) {
    this.W = this.cameras.main.width;
    this.H = this.cameras.main.height;
    this.playerData = data.playerData;
    this.scrollY = 0;

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0818, 0x0a0818, 0x180e28, 0x180e28, 1);
    bg.fillRect(0, 0, this.W, this.H);
    bg.fillStyle(0x120d22, 0.97);
    bg.fillRoundedRect(8, 70, this.W - 16, this.H - 80, 14);
    bg.lineStyle(1.5, 0xd4a017, 0.45);
    bg.strokeRoundedRect(8, 70, this.W - 16, this.H - 80, 14);

    // Header
    this.add.text(this.W / 2, 92, '📖  Quest Journal', {
      fontSize: '20px', fontFamily: 'Georgia, serif',
      fill: '#d4a017', stroke: '#2a1500', strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(this.W / 2, 118, `Day ${this.playerData.day}  ·  ${this.playerData.gold}g  ·  Rep: ${this.playerData.reputation}`, {
      fontSize: '12px', fontFamily: 'Georgia, serif', fill: '#7a7a9a'
    }).setOrigin(0.5);

    // Scrollable area
    this.scrollAreaTop = 140;
    this.scrollAreaH   = this.H - 200;

    this.listContainer = this.add.container(0, this.scrollAreaTop);

    const mask = this.add.graphics();
    mask.fillStyle(0xffffff);
    mask.fillRect(0, this.scrollAreaTop, this.W, this.scrollAreaH);
    mask.setVisible(false);
    this.listContainer.setMask(
      new Phaser.Display.Masks.GeometryMask(this, mask)
    );

    this.renderJournal();
    this.setupScrolling();

    // Back button
    const backG = this.add.graphics().setDepth(5);
    backG.fillStyle(0x2a1a00);
    backG.fillRoundedRect(this.W/2 - 90, this.H - 56, 180, 40, 10);
    backG.lineStyle(1, 0xd4a017, 0.5);
    backG.strokeRoundedRect(this.W/2 - 90, this.H - 56, 180, 40, 10);

    this.add.text(this.W/2, this.H - 36, '← Back to World', {
      fontSize: '15px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setOrigin(0.5).setDepth(6);

    const backZone = this.add.zone(this.W/2, this.H - 36, 180, 40)
      .setInteractive().setDepth(7);
    backZone.on('pointerdown', () => {
      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.start('WorldScene', { playerData: this.playerData }); 
      });
    });

    this.cameras.main.fadeIn(300, 0, 0, 0);
  }

  renderJournal() {
    const rowH = 140;
    let index  = 0;

    const sections = [
      { label: '⚔  Active Quests',    ids: this.playerData.activeQuests,    color: '#44aaff' },
      { label: '✓  Completed Quests',  ids: this.playerData.completedQuests, color: '#44aa44' },
    ];

    sections.forEach(section => {
      const quests = GAME_DATA.quests.filter(q => section.ids.includes(q.id));
      if (quests.length === 0) return;

      // Section header
      const header = this.add.text(20, index * rowH, section.label, {
        fontSize: '13px', fontFamily: 'Georgia, serif',
        fill: section.color, fontStyle: 'bold'
      });
      this.listContainer.add(header);
      index += 0.45;

      quests.forEach(quest => {
        const y = index * rowH;

        const rowBg = this.add.graphics();
        rowBg.fillStyle(0x1c1530, 0.9);
        rowBg.fillRoundedRect(16, y, this.W - 32, rowH - 12, 8);
        rowBg.lineStyle(1, 0x3a3060, 0.5);
        rowBg.strokeRoundedRect(16, y, this.W - 32, rowH - 12, 8);
        this.listContainer.add(rowBg);

        const title = this.add.text(28, y + 10, quest.title, {
          fontSize: '14px', fontFamily: 'Georgia, serif',
          fill: '#e8d090', fontStyle: 'bold'
        });
        this.listContainer.add(title);

        const loc = this.add.text(28, y + 30, `📍 ${quest.location}`, {
          fontSize: '11px', fontFamily: 'Georgia, serif', fill: '#7a8a9a'
        });
        this.listContainer.add(loc);

        const obj = this.add.text(28, y + 48, quest.objective, {
          fontSize: '11px', fontFamily: 'Georgia, serif',
          fill: '#9090a8', wordWrap: { width: this.W - 60 }
        });
        this.listContainer.add(obj);

        const lore = this.add.text(28, y + 96, `"${quest.reward.lore}"`, {
          fontSize: '10px', fontFamily: 'Georgia, serif',
          fill: '#5a6a4a', fontStyle: 'italic', wordWrap: { width: this.W - 60 }
        });
        this.listContainer.add(lore);

        index++;
      });
    });

    // Nothing at all
    if (this.playerData.activeQuests.length === 0 &&
        this.playerData.completedQuests.length === 0) {
      const empty = this.add.text(this.W / 2, 60,
        'No quests yet.\nVisit a town market\nto find opportunities.', {
          fontSize: '14px', fontFamily: 'Georgia, serif',
          fill: '#556677', align: 'center'
        }).setOrigin(0.5);
      this.listContainer.add(empty);
    }

    this.maxScrollY = Math.max(0, index * rowH - this.scrollAreaH + 20);
  }

  setupScrolling() {
    this.scrolling = false;
    this.input.on('pointerdown', (ptr) => {
      if (ptr.y < this.scrollAreaTop) return;
      this.scrolling    = true;
      this.scrollStartY = ptr.y;
      this.scrollOffset = this.scrollY;
    });
    this.input.on('pointermove', (ptr) => {
      if (!this.scrolling) return;
      const delta = this.scrollStartY - ptr.y;
      this.scrollY = Phaser.Math.Clamp(this.scrollOffset + delta, 0, this.maxScrollY);
      this.listContainer.y = this.scrollAreaTop - this.scrollY;
    });
    this.input.on('pointerup', () => { this.scrolling = false; });
  }
}