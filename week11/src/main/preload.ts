// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  toggleScene: (callback: any) => {
    return ipcRenderer.on("toggle-scene", callback);
  },
  updateAngle: (callback: any) => {
    return ipcRenderer.on("update-angle", callback);
  },
  scaleShape: (callback: any) => {
    return ipcRenderer.on("scale-shape", callback);
  },
  updateBackground: (callback: any) => {
    return ipcRenderer.on("update-background", callback);
  },
  writeLEDStatus: (value: 1 | 0) => {
    ipcRenderer.invoke("write:LEDStatus", value);
  },
  writeLEDBrightness: (brightness: number) => {
    ipcRenderer.invoke("write:LEDBrightness", brightness);
  },
});
