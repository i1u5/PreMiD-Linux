import { dialog } from "electron";
import { trayManager } from "..";
import { autoUpdater } from "electron-updater";


export let updateProcess : string = "standby";
autoUpdater.autoDownload = false;
let aU : boolean = false;

export async function checkForUpdate(auto = false) {
  if(auto) aU = true;
  updateTray("installing");
  autoUpdater.checkForUpdates();
}

autoUpdater.on('update-available', () => {
  if(aU) {
    aU = false;
    updateTray("installing");
  }
  else {
    updateTray("available");
  }
})

autoUpdater.on('update-not-available', (info) => {
  updateTray("standby");
  if(aU) {
    aU = false;
  }
})

export async function update() {
  updateTray("installing");
	autoUpdater.downloadUpdate();
}

autoUpdater.on('error', (error) => {
  updateTray("standby");
  dialog.showErrorBox('An error occured while updating ' + aU ? '[AUTO] :' : '[MANUAL] :', error == null ? "unknown" : (error.stack || error).toString());
  if(aU) {
    aU = false;
  }
})

autoUpdater.on('update-downloaded', () => {
  setImmediate(() => autoUpdater.quitAndInstall());
})

function updateTray(reason : string) {
	updateProcess = reason;
	trayManager.update();
}