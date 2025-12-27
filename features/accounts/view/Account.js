import { ipcMain } from "electron";
import { Account } from "../controllers/Account.js";

ipcMain.handle("getAllAccounts", () => {
  let response = Account.getAllAccounts();
  return response.toJson();
});

ipcMain.handle("createAccount", (event, entityId, name, accountsGroupId) => {
  let response = Account.create(entityId, name, accountsGroupId);
  return response.toJson();
});

ipcMain.handle("deleteAccount", (event, id) => {
  let response = Account.delete(id);
  return response.toJson();
});

ipcMain.handle(
  "updateAccount",
  (event, id, { entityId, name, accountsGroupId }) => {
    let response = Account.update(id, { entityId, name, accountsGroupId });
    return response.toJson();
  }
);

ipcMain.handle("getAccountById", (event, id) => {
  let response = Account.getAccountById(id);
  return response.toJson();
});

ipcMain.handle(
  "getAccountsByEntityIdContains",
  (event, partialId, page, pageSize) => {
    let response = Account.getAccountsByEntityIdContains(
      partialId,
      page,
      pageSize
    );
    return response.toJson();
  }
);

ipcMain.handle(
  "getAccountsByNameContains",
  (event, partialName, page, pageSize) => {
    let response = Account.getAccountsByNameContains(
      partialName,
      page,
      pageSize
    );
    return response.toJson();
  }
);
