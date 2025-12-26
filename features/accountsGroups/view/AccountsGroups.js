import { ipcMain } from "electron"
import { AccountsGroups } from "../controllers/AccountsGroups.js"

ipcMain.handle('createAccountsGroup', (event, entityId, name, accountsGroupId)=> {
  let response = AccountsGroups.create(entityId, name, accountsGroupId)
  return response.toJson();
})

ipcMain.handle('getAccountsGroups', (event, page, pageSize)=> {
  let response = AccountsGroups.getAccountsGroups(page, pageSize);
  return response.toJson();
})

ipcMain.handle('getAccountsGroupsByEntityIdContains', (event, partialId, page, pageSize)=> {
  let response = AccountsGroups.getAccountsGroupsByEntityIdContains(partialId, page, pageSize);
  return response.toJson();
})

ipcMain.handle('getAccountsGroupsByNameContains', (event, partialName, page, pageSize)=> {
  let response = AccountsGroups.getAccountsGroupsByNameContains(partialName, page, pageSize);
  return response.toJson();
})