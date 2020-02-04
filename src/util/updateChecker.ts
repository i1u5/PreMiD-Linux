import { dialog } from "electron";
import { trayManager } from "..";
import { autoUpdater } from "electron-updater";


export let updateProcess : string = "standby";

export async function checkForUpdate(autoUpdate = false) {
  if (autoUpdate) {
    updateTray("installing");
    autoUpdater.checkForUpdatesAndNotify();
    return;
  }
  autoUpdater.checkForUpdates();
}

autoUpdater.on('update-available', () => {
	updateTray("available");
})

export async function update() {
  updateTray("installing");
	autoUpdater.downloadUpdate();
}

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString());
})

autoUpdater.on('update-downloaded', () => {
  setImmediate(() => autoUpdater.quitAndInstall());
})

function updateTray(reason : string) {
	updateProcess = reason;
	trayManager.update();
}