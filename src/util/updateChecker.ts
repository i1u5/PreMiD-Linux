import { dialog } from "electron";
import { trayManager } from "..";
import { autoUpdater } from "electron-updater";


export let updateProcess : string = "standby";
let aU : boolean = false;

export async function checkForUpdate(autoUpdate = false) {
  if(autoUpdate) aU = true;
  updateTray("installing");
  autoUpdater.checkForUpdates();
}

autoUpdater.on('update-available', () => {
  if(aU) {
    aU = false;
    update();
  }
	updateTray("available");
})

autoUpdater.on('update-not-available', (info) => {
  if(aU) {
    aU = false;
  }
  updateTray("standby");
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