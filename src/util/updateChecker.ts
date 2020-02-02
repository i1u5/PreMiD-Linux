import { MenuItem, app } from "electron";
import { autoUpdater } from "electron-updater";
import { trayContextMenu } from "../managers/trayManager";
import { tray } from "../managers/trayManager";

export async function checkForUpdate() {
  autoUpdater.checkForUpdatesAndNotify();
}