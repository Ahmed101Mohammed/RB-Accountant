import { ipcMain } from "electron"
import { Item } from "../controllers/Item.js"

ipcMain.handle('getAllItems', ()=> {
  let response = Item.getAllItems()
  return response.toJson()
})

ipcMain.handle('getItemById', (event, id) =>
{
  let response = Item.getItemById(id);
  return response.toJson();
})

ipcMain.handle('getItemsItsIdContain', (event, partialId) =>
{
  let response = Item.getItemsItsIdContain(partialId);
  return response.toJson();
})

ipcMain.handle('getItemsItsNameContain', (event, partialName)=>
{
  let response = Item.getItemsItsNameContain(partialName)
  return response.toJson()
})

ipcMain.handle('createItem', (event, id, name) =>
{
  let response = Item.create(id, name); 
  return response.toJson();
})


ipcMain.handle('updateItem', (event, internalId, body) =>
{
  let response = Item.update(internalId, body);
  return response.toJson();
})

ipcMain.handle('deleteItem', (event, internalId) =>
{
  let response = Item.delete(internalId);
  return response.toJson();
})