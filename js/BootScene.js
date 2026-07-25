class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    const barBg = this.add.graphics();
    barBg.fillStyle(0x1a1a3e);
    barBg.fillRect(0, 0, W, H);
    barBg.fillStyle(0x2a2a5e);
    barBg.fillRoundedRect(W/2 - 160, H/2 - 18, 320, 36, 8);

    const bar = this.add.graphics();

    this.add.text(W/2, H/2 - 45, 'MERCHANT ODYSSEY', {
      fontSize: '22px', fontFamily: 'Georgia, serif',
      fill: '#d4a017', stroke: '#5a3a00', strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(W/2, H/2 + 35, 'Loading world...', {
      fontSize: '13px', fontFamily: 'Georgia, serif', fill: '#8899aa'
    }).setOrigin(0.5);

    this.time.delayedCall(800, () => {
      this.scene.start('MenuScene');
    });
  }
}