import { ipcMain } from "electron"
import { Setup } from "../controllers/Setup.js"

ipcMain.handle('dbVersion', ()=> {
  let response = Setup.dbVersion()
  return response.toJson();
})

ipcMain.handle('setup', ()=> {
  let response = Setup.setup();
  return response.toJson();
})

ipcMain.handle('updateDB', ()=> {
  let response = Setup.updateDB();
  return response.toJson();
})