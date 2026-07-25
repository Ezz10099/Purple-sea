// Connect Kefr-Yamm's cliff cave to the Weakwood Grove farming scene.
(() => {
  'use strict';

  const originalHandleBuildingAction = LocationMapScene.prototype.handleBuildingAction;

  LocationMapScene.prototype.handleBuildingAction = function handleBuildingActionWithForest(building) {
    if (building && building.id === 'cliff_cave') {
      SaveSystem.autoSave(this.playerData, this.location.id);
      this.cameras.main.fade(350, 0, 0, 0);
      this.time.delayedCall(350, () => {
        this.scene.start('ForestScene', {
          playerData: this.playerData,
          saveSlot: this.saveSlot,
          returnTown: this.location
        });
      });
      return;
    }

    return originalHandleBuildingAction.call(this, building);
  };
})();
