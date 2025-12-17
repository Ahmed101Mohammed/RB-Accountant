import { ipcMain } from "electron"
import { Products } from "../controllers/Products.js"

ipcMain.handle('getAllItems', ()=> {
  let response = Products.getAllItems()
  return response.toJson()
})

ipcMain.handle('getItemById', (event, id) =>
{
  let response = Products.getItemById(id);
  return response.toJson();
})

ipcMain.handle('getItemsItsIdContain', (event, partialId) =>
{
  let response = Products.getItemsItsIdContain(partialId);
  return response.toJson();
})

ipcMain.handle('getItemsItsNameContain', (event, partialName)=>
{
  let response = Products.getItemsItsNameContain(partialName)
  return response.toJson()
})

ipcMain.handle('createItem', (event, id, name) =>
{
  let response = Products.create(id, name); 
  return response.toJson();
})


ipcMain.handle('updateItem', (event, internalId, body) =>
{
  let response = Products.update(internalId, body);
  return response.toJson();
})

ipcMain.handle('deleteItem', (event, internalId) =>
{
  let response = Products.delete(internalId);
  return response.toJson();
})