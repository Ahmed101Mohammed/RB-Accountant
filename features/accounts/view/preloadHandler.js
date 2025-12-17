import { ipcMain } from "electron"
import { Account } from "../controllers/Account.js"

ipcMain.handle('getAllAccounts', ()=> {
    let response = Account.getAllAccounts()
    return response.toJson()
  })

ipcMain.handle('createAccount', (event, id, name)=>
{
  let response = Account.create(id, name)
  return response.toJson()
})

ipcMain.handle('deleteAccount', (event, id) =>
{
  let response = Account.delete(id)
  return response.toJson()
})

ipcMain.handle('updateAccount', (event, id, name) =>
{
  let response = Account.update(id, name)
  return response.toJson()
})

ipcMain.handle('createTransaction', (event, transactionData) =>
{
  let response = Transaction.create(transactionData)
  return response.toJson()
})

ipcMain.handle('getAccountsItsIdContain', (event, partialId) =>
{
  let response = Account.getAccountsItsIdContain(partialId)
  return response.toJson()
})

ipcMain.handle('getAccountsItsNameContain', (event, partialName)=>
{
  let response = Account.getAccountsItsNameContain(partialName)
  return response.toJson()
})