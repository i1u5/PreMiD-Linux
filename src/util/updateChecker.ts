import { dialog } from "electron";
import { trayManager } from "..";
import { autoUpdater } from "electron-updater";

export let updateProcess: string = "standby";
autoUpdater.autoDownload = false;

export async function checkForUpdate(auto = false) {
  autoUpdater.autoDownload = auto;
  updateTray("checking");
  autoUpdater.checkForUpdates();
}

autoUpdater.on("checking-for-update", () => {
  updateTray("checking");
});

autoUpdater.on("update-available", () => {
  if (autoUpdater.autoDownload === true) {
    updateTray("installing");
  } else {
    updateTray("available");
  }
});

autoUpdater.on("update-not-available", () => {
  updateTray("standby");
});

export async function update() {
  updateTray("installing");
  autoUpdater.downloadUpdate();
}

autoUpdater.on("error", error => {
  updateTray("standby");
  dialog.showErrorBox(
    "An error occured while updating " +
      (autoUpdater.autoDownload === true ? "[AUTO] :" : "[MANUAL] :"),
    error == null ? "unknown" : (error.stack || error).toString()
  );
});

autoUpdater.on("update-downloaded", () => {
  autoUpdater.quitAndInstall();
});

function updateTray(reason: string) {
  console.log(
    (autoUpdater.autoDownload === true ? "[A/" : "[M/") + "UPDATER] - " + reason.toUpperCase()
  );
  updateProcess = reason;
  trayManager.update();
}