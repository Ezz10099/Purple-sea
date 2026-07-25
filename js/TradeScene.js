// ================================================================
// 5. TRADE SCENE — Full market UI
//    Tabs: BUY (town stock) | SELL (your inventory)
//    Prices vary per town — core of the logistics puzzle
// ================================================================
class TradeScene extends Phaser.Scene {
  constructor() { super({ key: 'TradeScene' }); }

  create(data) {
    this.W = this.cameras.main.width;
    this.H = this.cameras.main.height;
    this.town = data.town;
    this.playerData = data.playerData;
    this.activeTab = data.startTab || 'BUY';
this.fromBuilding = data.fromBuilding || null;
this.itemFilter = data.itemFilter || null;
    this.traded = false; // tracks if any trade happened this visit

    this.drawBackground();
    this.drawHeader();
    this.drawTabs();
    this.drawGoldBar();
    this.renderList();
    this.drawBackButton();

    this.cameras.main.fadeIn(300, 0, 0, 0);
  }

  // ── Price Logic ─────────────────────────────────────────────
  // Towns that SELL an item → 30% cheaper (good to BUY here)
  // Towns that BUY an item  → 40% pricier (good to SELL here)
  getBuyPrice(itemId) {
    const item = GAME_DATA.items.find(i => i.id === itemId);
    if (this.town.sells.includes(itemId)) {
      return Math.floor(item.basePrice * 0.70); // 30% discount
    }
    return item.basePrice;
  }

  getSellPrice(itemId) {
    const item = GAME_DATA.items.find(i => i.id === itemId);
    if (this.town.buys.includes(itemId)) {
      return Math.floor(item.basePrice * 1.40); // 40% premium
    }
    return Math.floor(item.basePrice * 0.80); // slight loss elsewhere
  }

  // ── Background ───────────────────────────────────────────────
  drawBackground() {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0818, 0x0a0818, 0x180e28, 0x180e28, 1);
    bg.fillRect(0, 0, this.W, this.H);

    // Decorative stars
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, this.W);
      const y = Phaser.Math.Between(0, this.H);
      bg.fillStyle(0xffffff, Math.random() * 0.3 + 0.05);
      bg.fillCircle(x, y, Math.random() * 1.2 + 0.3);
    }

    // Main panel
    bg.fillStyle(0x120d22, 0.97);
    bg.fillRoundedRect(8, 70, this.W - 16, this.H - 80, 14);
    bg.lineStyle(1.5, 0xd4a017, 0.45);
    bg.strokeRoundedRect(8, 70, this.W - 16, this.H - 80, 14);
  }

  // ── Header ───────────────────────────────────────────────────
  drawHeader() {
    this.add.text(this.W / 2, 90, this.town.name, {
      fontSize: '22px', fontFamily: 'Georgia, serif',
      fill: '#d4a017', stroke: '#2a1500', strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(this.W / 2, 116, this.town.description, {
      fontSize: '11px', fontFamily: 'Georgia, serif',
      fill: '#7a7a9a', wordWrap: { width: this.W - 60 }, align: 'center'
    }).setOrigin(0.5, 0);
  }

  // ── Tabs ─────────────────────────────────────────────────────
  drawTabs() {
  const tabY = 148;
  const showQuests = !this.fromBuilding;
  const tabCount = showQuests ? 3 : 2;
  const tabW = (this.W - 44) / (showQuests ? 3 : 2);

  this.buyTabGfx  = this.add.graphics();
  this.sellTabGfx = this.add.graphics();

  this.drawTab(this.buyTabGfx,  20,          tabY, tabW, this.activeTab === 'BUY');
  this.drawTab(this.sellTabGfx, 22 + tabW,   tabY, tabW, this.activeTab === 'SELL');

  const buyZone  = this.add.zone(20 + tabW/2,         tabY + 18, tabW, 36).setInteractive();
  const sellZone = this.add.zone(22 + tabW + tabW/2,  tabY + 18, tabW, 36).setInteractive();

  buyZone.on('pointerdown',  () => this.switchTab('BUY'));
  sellZone.on('pointerdown', () => this.switchTab('SELL'));

  this.buyTabText = this.add.text(20 + tabW/2, tabY + 18, '🛒 BUY', {
    fontSize: '12px', fontFamily: 'Georgia, serif',
    fill: this.activeTab === 'BUY' ? '#1a0800' : '#8899aa', fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);

  this.sellTabText = this.add.text(22 + tabW + tabW/2, tabY + 18, '💰 SELL', {
    fontSize: '12px', fontFamily: 'Georgia, serif',
    fill: this.activeTab === 'SELL' ? '#1a0800' : '#8899aa', fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);

  if (showQuests) {
    this.questTabGfx = this.add.graphics();
    this.drawTab(this.questTabGfx, 24 + tabW * 2, tabY, tabW, this.activeTab === 'QUESTS');

    const questZone = this.add.zone(24 + tabW*2 + tabW/2, tabY + 18, tabW, 36).setInteractive();
    questZone.on('pointerdown', () => this.switchTab('QUESTS'));

    this.questTabText = this.add.text(24 + tabW*2 + tabW/2, tabY + 18, '📜 QUESTS', {
      fontSize: '12px', fontFamily: 'Georgia, serif',
      fill: this.activeTab === 'QUESTS' ? '#1a0800' : '#8899aa', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2);
  }
}

  drawTab(gfx, x, y, w, active) {
    gfx.clear();
    gfx.fillStyle(active ? 0xd4a017 : 0x1e1630);
    gfx.fillRoundedRect(x, y, w, 36, { tl: 10, tr: 10, bl: 0, br: 0 });
    if (!active) {
      gfx.lineStyle(1, 0xd4a017, 0.3);
      gfx.strokeRoundedRect(x, y, w, 36, { tl: 10, tr: 10, bl: 0, br: 0 });
    }
  }

  switchTab(tab) {
  this.activeTab = tab;
  const tabW = (this.W - 44) / (this.fromBuilding ? 2 : 3);

  this.drawTab(this.buyTabGfx,  20,          148, tabW, tab === 'BUY');
  this.drawTab(this.sellTabGfx, 22 + tabW,   148, tabW, tab === 'SELL');
  if (this.questTabGfx) {
    this.drawTab(this.questTabGfx, 24 + tabW * 2, 148, tabW, tab === 'QUESTS');
  }

  this.buyTabText.setStyle({
    fill: tab === 'BUY' ? '#1a0800' : '#8899aa'
  });
  this.sellTabText.setStyle({
    fill: tab === 'SELL' ? '#1a0800' : '#8899aa'
  });
  if (this.questTabText) {
    this.questTabText.setStyle({
      fill: tab === 'QUESTS' ? '#1a0800' : '#8899aa'
    });
  }

  if (this.listContainer) this.listContainer.destroy();
  this.renderList();
  this.refreshGoldBar();
}

  // ── Gold Bar ─────────────────────────────────────────────────
  drawGoldBar() {
    this.goldBarGfx = this.add.graphics().setDepth(5);
    this.goldBarText = this.add.text(this.W / 2, this.H - 68, '', {
      fontSize: '17px', fontFamily: 'Georgia, serif', fill: '#ffd700'
    }).setOrigin(0.5).setDepth(6);
    this.refreshGoldBar();
  }

  refreshGoldBar() {
  const carriedWeight = this.playerData.inventory.reduce((sum, e) => {
    const def = GAME_DATA.items.find(i => i.id === e.itemId);
    return sum + (def ? def.weight : 0);
  }, 0);

  this.goldBarGfx.clear();
  this.goldBarGfx.fillStyle(0x0a0818, 0.95);
  this.goldBarGfx.fillRect(8, this.H - 86, this.W - 16, 30);
  this.goldBarGfx.lineStyle(1, 0xd4a017, 0.3);
  this.goldBarGfx.lineBetween(8, this.H - 86, this.W - 8, this.H - 86);
  this.goldBarText.setText(`⚜  ${this.playerData.gold} Gold   ·   Cargo ${carriedWeight} / ${this.playerData.maxCarryWeight}`);
}

  // ── Item List ────────────────────────────────────────────────
  renderList() {
  if (this.listContainer) this.listContainer.destroy();
  if (this.listMask) this.listMask.destroy();
  if (this.scrollTrack) this.scrollTrack.destroy();

  // Scrollable area boundaries
  this.scrollTop    = 192;                  // where list starts
  this.scrollBottom = this.H - 95;         // where list ends (above gold bar)
  this.scrollAreaH  = this.scrollBottom - this.scrollTop;
  this.scrollY      = 0;                   // current scroll offset

  // Container holds all rows
  this.listContainer = this.add.container(0, this.scrollTop);

  // Mask — only show items inside the scroll area
  this.listMask = this.add.graphics();
this.listMask.fillStyle(0xffffff);
this.listMask.fillRect(0, this.scrollTop, this.W, this.scrollAreaH);
this.listMask.setVisible(false);
  this.listContainer.setMask(
    new Phaser.Display.Masks.GeometryMask(this, this.listMask)
  );

  const rowH = 72;
  if (this.activeTab === 'BUY') {
  this.renderBuyList(rowH);
} else if (this.activeTab === 'SELL') {
  this.renderSellList(rowH);
} else {
  this.renderQuestList(rowH);
}

  // Total content height
  const itemCount = this.activeTab === 'BUY'
  ? GAME_DATA.items.length
  : this.activeTab === 'SELL'
  ? Math.max(this.playerData.inventory.length, 1)
  : this.activeTab === 'QUESTS'
  ? (GAME_DATA.quests.filter(q => q.location === this.town.id).length || 1)
  : 1;
  this.maxScrollY = Math.max(0, itemCount * rowH - this.scrollAreaH + 16);

  // Touch scroll handling
  this.setupScrolling();
}

renderBuyList(rowH) {
    const carriedWeight = this.playerData.inventory.reduce((sum, e) => {
      const def = GAME_DATA.items.find(i => i.id === e.itemId);
      return sum + (def ? def.weight : 0);
    }, 0);

    const items = this.itemFilter
  ? GAME_DATA.items.filter(it => this.itemFilter.includes(it.id))
  : GAME_DATA.items;

items.forEach((item, i) => {
      const y = i * rowH;
      const price       = this.getBuyPrice(item.id);
      const isSpecial   = this.town.sells.includes(item.id);
      const canAfford   = this.playerData.gold >= price;
      const wouldExceed = carriedWeight + item.weight > this.playerData.maxCarryWeight;

      let btnLabel;
      if (wouldExceed)     btnLabel = 'FULL';
      else if (!canAfford) btnLabel = 'POOR';
      else                 btnLabel = 'BUY';

      this.drawItemRow(
        this.listContainer, y, rowH,
        item.name,
        isSpecial
          ? `${price}g  ✦ Specialty  ·  ${item.weight} units`
          : `${price}g  ·  ${item.weight} units`,
        isSpecial ? '#70dd70' : '#c8c8a8',
        btnLabel,
        () => this.buyItem(item.id, price)
      );
    });
  }

  renderSellList(rowH) {
    if (this.playerData.inventory.length === 0) {
      const empty = this.add.text(this.W / 2, 60,
        'Your cargo is empty.\nBuy items first!', {
          fontSize: '14px', fontFamily: 'Georgia, serif',
          fill: '#556677', align: 'center'
        }).setOrigin(0.5);
      this.listContainer.add(empty);
      return;
    }

    this.playerData.inventory.forEach((entry, i) => {
      const y         = i * rowH;
      const itemDef   = GAME_DATA.items.find(it => it.id === entry.itemId);
      const sellPrice = this.getSellPrice(entry.itemId);
      const profit    = sellPrice - entry.buyPrice;
      const profitStr = profit >= 0 ? `+${profit}g profit` : `${profit}g loss`;
      const profitCol = profit >= 0 ? '#70dd70' : '#ee6655';
      const isWanted  = this.town.buys.includes(entry.itemId);

      this.drawItemRow(
        this.listContainer, y, rowH,
        itemDef.name,
        `Sell: ${sellPrice}g  (${profitStr})${isWanted ? '  ★ Wanted' : ''}`,
        isWanted ? '#70dd70' : profitCol,
        'SELL',
        () => this.sellItem(i, sellPrice)
      );
    });
  }
renderQuestList(rowH) {
  const townQuests = GAME_DATA.quests.filter(q => q.location === this.town.id);

  if (townQuests.length === 0) {
    const msg = this.add.text(this.W / 2, 60,
      'No quests available\nin this town.', {
        fontSize: '14px', fontFamily: 'Georgia, serif',
        fill: '#556677', align: 'center'
      }).setOrigin(0.5);
    this.listContainer.add(msg);
    return;
  }

  townQuests.forEach((quest, i) => {
    const y          = i * 130;
    const isActive   = this.playerData.activeQuests.includes(quest.id);
    const isDone     = this.playerData.completedQuests.includes(quest.id);
    const isLocked   = quest.status === 'locked' && !isActive && !isDone;
    const canAfford  = this.playerData.gold >= quest.costToUnlock;

    // Row background
    const rowBg = this.add.graphics();
    rowBg.fillStyle(isActive ? 0x1a2a1a : isLocked ? 0x1a1a1a : 0x1c1530, 0.9);
    rowBg.fillRoundedRect(16, y, this.W - 32, 122, 8);
    rowBg.lineStyle(1, isActive ? 0x44aa44 : isLocked ? 0x444444 : 0xd4a017, 0.5);
    rowBg.strokeRoundedRect(16, y, this.W - 32, 122, 8);
    this.listContainer.add(rowBg);

    // Quest title
    const titleColor = isDone ? '#aaaaaa' : isLocked ? '#555566' : '#e8d090';
    const title = this.add.text(28, y + 10, quest.title, {
      fontSize: '14px', fontFamily: 'Georgia, serif',
      fill: titleColor, fontStyle: 'bold'
    });
    this.listContainer.add(title);

    // Status tag
    const tag     = isDone ? '✓ Complete' : isActive ? '⚔ Active' : isLocked ? '🔒 Locked' : `Cost: ${quest.costToUnlock}g`;
    const tagColor = isDone ? '#44aa44' : isActive ? '#44aaff' : isLocked ? '#555566' : '#d4a017';
    const tagText = this.add.text(28, y + 28, tag, {
      fontSize: '11px', fontFamily: 'Georgia, serif', fill: tagColor
    });
    this.listContainer.add(tagText);

    // Objective text
    const obj = this.add.text(28, y + 46, quest.objective, {
      fontSize: '11px', fontFamily: 'Georgia, serif',
      fill: '#7a8a9a', wordWrap: { width: this.W - 120 }
    });
    this.listContainer.add(obj);

    // Reward text
    const rewardText = this.add.text(28, y + 96, `Reward: ${quest.reward.gold}g`, {
      fontSize: '11px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    });
    this.listContainer.add(rewardText);

    // Button
    if (!isLocked && !isDone && !isActive) {
  const btnColor = canAfford ? 0x7a5500 : 0x333333;
  const btnG = this.add.graphics();
  btnG.fillStyle(btnColor);
  btnG.fillRoundedRect(this.W - 96, y + 44, 72, 30, 8);
  this.listContainer.add(btnG);

  const btnT = this.add.text(this.W - 60, y + 59,
    canAfford ? 'ACCEPT' : 'POOR', {
      fontSize: '11px', fontFamily: 'Georgia, serif',
      fill: canAfford ? '#ffd700' : '#666666', fontStyle: 'bold'
    }).setOrigin(0.5);
  this.listContainer.add(btnT);

  if (canAfford) {
    const zone = this.add.zone(this.W - 60, y + 59, 72, 30).setInteractive();
    zone.on('pointerdown', () => this.acceptQuest(quest));
    this.listContainer.add(zone);
  }
}

if (isActive) {
  const completable = this.canCompleteQuest(quest);
  const btnColor = completable ? 0x2a6622 : 0x1a1a2a;
  const btnLabel = completable ? 'COMPLETE' : 'IN PROGRESS';
  const btnTextColor = completable ? '#ffd700' : '#445566';

  const btnG = this.add.graphics();
  btnG.fillStyle(btnColor);
  btnG.fillRoundedRect(this.W - 106, y + 44, 82, 30, 8);
  if (completable) {
    btnG.lineStyle(1, 0x44aa44, 0.8);
    btnG.strokeRoundedRect(this.W - 106, y + 44, 82, 30, 8);
  }
  this.listContainer.add(btnG);

  const btnT = this.add.text(this.W - 65, y + 59, btnLabel, {
    fontSize: '10px', fontFamily: 'Georgia, serif',
    fill: btnTextColor, fontStyle: 'bold'
  }).setOrigin(0.5);
  this.listContainer.add(btnT);

  if (completable) {
    const zone = this.add.zone(this.W - 65, y + 59, 82, 30).setInteractive();
    zone.on('pointerdown', () => this.completeQuest(quest));
    this.listContainer.add(zone);
  }
}
  });
}
  setupScrolling() {
    this.input.off('pointerdown', this.onScrollStart, this);
    this.input.off('pointermove', this.onScrollMove,  this);
    this.input.off('pointerup',   this.onScrollEnd,   this);

    this.scrolling         = false;
    this.scrollStartY      = 0;
    this.scrollStartOffset = 0;

    this.onScrollStart = (ptr) => {
      if (ptr.y < this.scrollTop || ptr.y > this.scrollBottom) return;
      this.scrolling         = true;
      this.scrollStartY      = ptr.y;
      this.scrollStartOffset = this.scrollY;
    };

    this.onScrollMove = (ptr) => {
      if (!this.scrolling) return;
      const delta = this.scrollStartY - ptr.y;
      this.scrollY = Phaser.Math.Clamp(
        this.scrollStartOffset + delta,
        0,
        this.maxScrollY
      );
      this.listContainer.y = this.scrollTop - this.scrollY;
    };

    this.onScrollEnd = () => {
      this.scrolling = false;
    };

    this.input.on('pointerdown', this.onScrollStart, this);
    this.input.on('pointermove', this.onScrollMove,  this);
    this.input.on('pointerup',   this.onScrollEnd,   this);
  }

  // ── Draw a single item row ───────────────────────────────────
  drawItemRow(container, y, rowH, name, subtitle, subtitleColor, btnLabel, onPress) {
    const rowBg = this.add.graphics();
    rowBg.fillStyle(0x1c1530, 0.8);
    rowBg.fillRoundedRect(16, y, this.W - 32, rowH - 6, 8);
    rowBg.lineStyle(1, 0x3a3060, 0.6);
    rowBg.strokeRoundedRect(16, y, this.W - 32, rowH - 6, 8);
    container.add(rowBg);

    // Item name
    const nameText = this.add.text(28, y + 10, name, {
      fontSize: '15px', fontFamily: 'Georgia, serif', fill: '#e8e0c8'
    });
    container.add(nameText);

    // Subtitle (price / profit)
    const subText = this.add.text(28, y + 32, subtitle, {
      fontSize: '12px', fontFamily: 'Georgia, serif', fill: subtitleColor
    });
    container.add(subText);

    // Button
    const disabled = btnLabel === 'FULL' || btnLabel === 'POOR';
    const btnColor = disabled ? 0x333333 : (btnLabel === 'SELL' ? 0x336622 : 0x7a5500);
    const btnTextColor = disabled ? '#666666' : '#ffd700';

    const btnG = this.add.graphics();
    btnG.fillStyle(btnColor);
    btnG.fillRoundedRect(this.W - 90, y + 10, 70, 34, 8);
    container.add(btnG);

    const btnT = this.add.text(this.W - 55, y + 27, btnLabel, {
      fontSize: '13px', fontFamily: 'Georgia, serif',
      fill: btnTextColor, fontStyle: 'bold'
    }).setOrigin(0.5);
    container.add(btnT);

    if (!disabled) {
      const zone = this.add.zone(this.W - 55, y + 27, 70, 34).setInteractive();
      zone.on('pointerdown', onPress);
      container.add(zone);
    }
  }

  // ── Buy an item ──────────────────────────────────────────────
  buyItem(itemId, price) {
    if (this.playerData.gold < price) return;
    const carriedWeight = this.playerData.inventory.reduce((sum, e) => {
  const def = GAME_DATA.items.find(i => i.id === e.itemId);
  return sum + (def ? def.weight : 0);
}, 0);
if (carriedWeight + GAME_DATA.items.find(i => i.id === itemId).weight > this.playerData.maxCarryWeight) return;

    this.playerData.gold -= price;
    this.playerData.inventory.push({ itemId, buyPrice: price, quantity: 1 });
    this.traded = true;
    SaveSystem.autoSave(this.playerData, this.town.id);
    this.showFeedback(`Bought! -${price}g`, '#ffaa44');
    this.flashScreen(0xffaa44, 0.12);
    this.switchTab('BUY');
  }

  // ── Sell an item ─────────────────────────────────────────────
  sellItem(index, price) {
    const entry = this.playerData.inventory[index];
    if (!entry) return;

    const profit = price - entry.buyPrice;
    this.playerData.gold += price;
    this.playerData.inventory.splice(index, 1);

    // Reputation grows with profitable trades
    if (profit > 0) this.playerData.reputation += 1;
    this.traded = true;
    SaveSystem.autoSave(this.playerData, this.town.id);
    const msg = profit >= 0 ? `Sold! +${price}g  (profit: +${profit}g)` : `Sold! +${price}g  (loss: ${profit}g)`;
    this.showFeedback(msg, profit >= 0 ? '#70dd70' : '#ee6655');
    this.flashScreen(profit >= 0 ? 0x70dd70 : 0xee6655, 0.12);
    this.switchTab('SELL');
  }
  canCompleteQuest(quest) {
    if (!this.playerData.activeQuests.includes(quest.id)) return false;
    if (quest.location !== this.town.id) return false;

    if (quest.id === 'first_delivery_sidon') {
      return this.town.id === 'sidon' &&
             this.playerData.inventory.some(e => e.itemId === 'dagons_sealed_box');
    }
    if (quest.id === 'dagons_missing_shipment') {
      return this.town.id === 'kefr-yamm' &&
             (this.playerData.loreFlags || []).includes('tyre_harbor_reputation');
    }
    if (quest.id === 'rib_addis_last_wish') {
      return this.town.id === 'kefr-yamm' &&
             this.playerData.inventory.some(e => e.itemId === 'blue_kition_shell');
    }
    return false;
  }

  completeQuest(quest) {
    this.playerData.gold += quest.reward.gold || 0;
    this.playerData.activeQuests = this.playerData.activeQuests.filter(id => id !== quest.id);
    this.playerData.completedQuests.push(quest.id);
    this.playerData.reputation += 2;

    if (quest.reward.flag) {
      if (!this.playerData.loreFlags) this.playerData.loreFlags = [];
      if (!this.playerData.loreFlags.includes(quest.reward.flag)) {
        this.playerData.loreFlags.push(quest.reward.flag);
      }
    }

    if (quest.id === 'first_delivery_sidon') {
      const idx = this.playerData.inventory.findIndex(e => e.itemId === 'dagons_sealed_box');
      if (idx !== -1) this.playerData.inventory.splice(idx, 1);
    }
    if (quest.id === 'rib_addis_last_wish') {
      const idx = this.playerData.inventory.findIndex(e => e.itemId === 'blue_kition_shell');
      if (idx !== -1) this.playerData.inventory.splice(idx, 1);
    }

    const nextQuest = GAME_DATA.quests.find(q => q.order === quest.order + 1);
    if (nextQuest && nextQuest.status === 'locked') {
      nextQuest.status = 'available';
    }

    this.traded = true;
    SaveSystem.autoSave(this.playerData, this.town.id);
    this.showFeedback(quest.reward.gold > 0
      ? `Quest complete! +${quest.reward.gold} Coins`
      : 'Quest complete!', '#ffd700');
    this.questCompleteVFX();
    this.switchTab('QUESTS');
  }
  acceptQuest(quest) {
  if (this.playerData.gold < quest.costToUnlock) return;

  this.playerData.gold -= quest.costToUnlock;
  this.playerData.activeQuests.push(quest.id);

  // Unlock next quest in chain
  const nextQuest = GAME_DATA.quests.find(q => q.order === quest.order + 1);
  if (nextQuest && nextQuest.status === 'locked') {
    nextQuest.status = 'available';
  }

  this.traded = true;
  this.showFeedback(`Quest accepted! -${quest.costToUnlock}g`, '#d4a017');
  this.switchTab('QUESTS');
}

 // ── Floating feedback message ────────────────────────────────
  showFeedback(msg, color) {
    const txt = this.add.text(this.W / 2, this.H - 100, msg, {
      fontSize: '14px', fontFamily: 'Georgia, serif',
      fill: color, stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(20);

    this.tweens.add({
      targets: txt, y: txt.y - 40, alpha: 0,
      duration: 1200, ease: 'Power2',
      onComplete: () => txt.destroy()
    });
  }
  flashScreen(color, intensity) {
  const flash = this.add.graphics().setDepth(50);
  flash.fillStyle(color, intensity);
  flash.fillRect(0, 0, this.W, this.H);
  this.tweens.add({
    targets: flash,
    alpha: 0,
    duration: 220,
    ease: 'Power2',
    onComplete: () => flash.destroy()
  });
}
questCompleteVFX() {
  // Full screen gold flash
  this.flashScreen(0xffd700, 0.35);

  // Coin burst — 18 particles exploding from center
  for (let i = 0; i < 18; i++) {
    const angle  = (i / 18) * Math.PI * 2;
    const speed  = Phaser.Math.FloatBetween(120, 280);
    const size   = Phaser.Math.Between(5, 12);
    const coin   = this.add.graphics().setDepth(60);

    coin.fillStyle(0xffd700, 1);
    coin.fillCircle(0, 0, size);
    coin.lineStyle(1.5, 0xaa7700, 0.8);
    coin.strokeCircle(0, 0, size);
    coin.x = this.W / 2;
    coin.y = this.H / 2;

    const targetX = coin.x + Math.cos(angle) * speed;
    const targetY = coin.y + Math.sin(angle) * speed;

    this.tweens.add({
      targets: coin,
      x: targetX,
      y: targetY + 80,
      alpha: 0,
      scaleX: 0.2,
      scaleY: 0.2,
      duration: Phaser.Math.Between(500, 900),
      ease: 'Power2',
      onComplete: () => coin.destroy()
    });
  }

  // Big center text
  const txt = this.add.text(this.W / 2, this.H / 2 - 40,
    '✦ QUEST COMPLETE ✦', {
      fontSize: '22px', fontFamily: 'Georgia, serif',
      fill: '#ffd700', stroke: '#3a2000', strokeThickness: 5
    }).setOrigin(0.5).setDepth(61);

  this.tweens.add({
    targets: txt,
    y: txt.y - 60,
    alpha: 0,
    duration: 1800,
    ease: 'Power2',
    onComplete: () => txt.destroy()
  });
}

  // ── Back Button ──────────────────────────────────────────────
  drawBackButton() {
    const backG = this.add.graphics().setDepth(5);
    backG.fillStyle(0x2a1a00);
    backG.fillRoundedRect(this.W/2 - 90, this.H - 56, 180, 40, 10);
    backG.lineStyle(1, 0xd4a017, 0.5);
    backG.strokeRoundedRect(this.W/2 - 90, this.H - 56, 180, 40, 10);

    this.add.text(this.W / 2, this.H - 36,
    this.fromBuilding ? '← Back' : '← Leave', {
      fontSize: '15px', fontFamily: 'Georgia, serif', fill: '#d4a017'
    }).setOrigin(0.5).setDepth(6);

    const zone = this.add.zone(this.W/2, this.H - 36, 180, 40)
      .setInteractive().setDepth(7);

    zone.on('pointerdown', () => {

      

      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        if (this.fromBuilding) {
  this.scene.start('LocationMapScene', {
    town: this.town,
    playerData: this.playerData,
    spawnX: this.fromBuilding.x,
    spawnY: this.fromBuilding.y + 40
  });
} else {
  this.scene.start('LocationMapScene', {
    town: this.town,
    playerData: this.playerData
  });
}
      });
    });
  }
}