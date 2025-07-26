import { ipcMain } from "electron"
import { Machine } from "../controllers/Machine.js"
ipcMain.handle('getAllMachines', ()=> {
  let response = Machine.getAllMachines()
  return response.toJson()
})

ipcMain.handle('createMachine', (event, id, name) =>
{
  let response = Machine.create(id, name); 
  return response.toJson();
})

ipcMain.handle('getMachineById', (event, id) =>
{
  let response = Machine.getMachineById(id);
  return response.toJson();
})

ipcMain.handle('updateMachine', (event, internalId, body) =>
{
  let response = Machine.update(internalId, body);
  return response.toJson();
})

ipcMain.handle('getMachinesItsIdContain', (event, partialId) =>
  {
  let response = Machine.getMachinesItsIdContain(partialId)
  return response.toJson()
})

ipcMain.handle('getMachinesItsNameContain', (event, partialName)=>
{
  let response = Machine.getMachinesItsNameContain(partialName)
  return response.toJson()
})

ipcMain.handle('deleteMachine', (event, internalId) =>
{
  let response = Machine.delete(internalId);
  return response.toJson();
})