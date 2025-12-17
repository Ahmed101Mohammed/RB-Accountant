import { ipcMain } from "electron"
import { Transaction } from "../controllers/Transaction.js"

ipcMain.handle('getAllTransactions', () =>
{
  let response = Transaction.getAllTransactions() 
  return response.toJson()
})

ipcMain.handle('deleteTransaction', (evnet, id) =>
{
  let response = Transaction.delete(id)
  return response.toJson()
})

ipcMain.handle('updateTransaction', (event, id, transactionData) =>
{
  let response = Transaction.update(id, transactionData)
  return response.toJson()
})

ipcMain.handle('getAllTransactionsForAccountForPeriod', (event, id, startPeriod, endPeriod) =>
{
  let response = Transaction.getAllTransactionsForAccountForPeriod(id, startPeriod, endPeriod)
  return response.toJson()
})

ipcMain.handle('getAllTransactionsForSpecificPeriod', (event, startPeriod, endPeriod) =>
{
  let response = Transaction.getAllTransactionsForSpecificPeriod(startPeriod, endPeriod)
  return response.toJson()
})

ipcMain.handle('getAllTransactionsForAccount', (event, id) =>
{
  let response = Transaction.getAllTransactionsForAccount(id)
  return response.toJson()
})

ipcMain.handle('getAccountById', (event, id)=>
{
  let response = Account.getAccountById(id)
  return response.toJson()
})

ipcMain.handle('getAccountBalanceAtStartPeriod', (event, id, startPeriod) =>
{
  let response = Transaction.getAccountBalanceAtStartPeriod(id, startPeriod)
  return response.toJson()
})

ipcMain.handle('getAcccountStatementForSpecificPeriod', (event, id, startPeriod, endPeriod)=>
{
  let response = Transaction.getAcccountStatementForSpecificPeriod(id, startPeriod, endPeriod)
  return response.toJson()
})

ipcMain.handle('getAllTransactionsWithPaging', (event, page)=>
{
  let response = Transaction.getAllTransactionsWithPaging(page)
  return response.toJson()
})

ipcMain.handle('getTransactionById', (event, id)=>
{
  let response = Transaction.getTransactionById(id)
  return response.toJson()
})

ipcMain.handle('getFirstTransactionDateOfAccount', (event, id)=>
{
  let response = Transaction.getFirstTransactionDateOfAccount(id)
  return response.toJson()
})

ipcMain.handle('getLastTransactionDateOfAccount', (event, id)=>
{
  let response = Transaction.getLastTransactionDateOfAccount(id)
  return response.toJson()
})

ipcMain.handle('getAccountTransactionsCount', (event, accountId) =>
{
  let response = Transaction.getAccountTransactionsCount(accountId)
  return response.toJson()
})