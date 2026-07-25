// ================================================================
//  SAVE SYSTEM
//  Handles all read/write to localStorage
//  3 save slots — key format: 'purpleSea_save_1', etc.
// ================================================================

const SaveSystem = {

  SLOT_COUNT: 3,
  KEY_PREFIX: 'purpleSea_save_',

  // ── Save to a slot ──────────────────────────────────────────
  save(slotNumber, playerData, currentCityId) {
    const data = {
      playerData:    JSON.parse(JSON.stringify(playerData)),
      currentCityId: currentCityId,
      timestamp:     Date.now(),
      day:           playerData.day,
      gold:          playerData.gold,
      cityName:      GAME_DATA.towns.find(t => t.id === currentCityId)?.name || '?'
    };
    try {
      localStorage.setItem(
        this.KEY_PREFIX + slotNumber,
        JSON.stringify(data)
      );
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      return false;
    }
  },

  // ── Load from a slot ────────────────────────────────────────
  load(slotNumber) {
    try {
      const raw = localStorage.getItem(this.KEY_PREFIX + slotNumber);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('Load failed:', e);
      return null;
    }
  },

  // ── Delete a slot ───────────────────────────────────────────
  delete(slotNumber) {
    localStorage.removeItem(this.KEY_PREFIX + slotNumber);
  },

  // ── Get all slot summaries ──────────────────────────────────
  getAllSlots() {
    const slots = [];
    for (let i = 1; i <= this.SLOT_COUNT; i++) {
      const data = this.load(i);
      if (data) {
        slots.push({
          slot:      i,
          exists:    true,
          cityName:  data.cityName,
          day:       data.day,
          gold:      data.gold,
          timestamp: this.formatTime(data.timestamp)
        });
      } else {
        slots.push({ slot: i, exists: false });
      }
    }
    return slots;
  },

  // ── Auto-save to slot 0 (hidden continuous slot) ────────────
  autoSave(playerData, currentCityId) {
    this.save('auto', playerData, currentCityId);
  },

  loadAutoSave() {
    return this.load('auto');
  },

  // ── Format timestamp ────────────────────────────────────────
  formatTime(ts) {
    const d = new Date(ts);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth()+1)}  ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

};