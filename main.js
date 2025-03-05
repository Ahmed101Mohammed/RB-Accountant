import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import Account from './controllers/Account.js';
import Transaction from './controllers/Transaction.js';
import { fileURLToPath } from 'url';

// preload absolute path
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const preloadLocation = path.resolve(__dirname, 'preload.js')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadLocation,
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false
    }
  })

  // win.loadURL('http://localhost:9000/')
  win.loadFile('./dist/index.html')
}

app.on('window-all-closed', ()=>
{
  if(process.platform !== 'darwin') app.quit()
})
app.whenReady().then(() => {
  ipcMain.handle('getAllAccounts', async()=> {
    let response = await Account.getAllAccounts()
    return response.toJson()
  })

  ipcMain.handle('createAccount', async(event, id, name)=>
  {
    let response = await Account.create(id, name)
    return response.toJson()
  })

  ipcMain.handle('deleteAccount', async(event, id) =>
  {
    let response = await Account.delete(id)
    return response.toJson()
  })

  ipcMain.handle('updateAccount', async(event, id, name) =>
  {
    let response = await Account.update(id, name)
    return response.toJson()
  })

  ipcMain.handle('createTransaction', async(event, amount, debtorId, creditorId, comment, date) =>
  {
    let response = await Transaction.create(amount, debtorId, creditorId, comment, date)
    return response.toJson()
  })

  ipcMain.handle('getAccountsItsIdContain', async(event, partialId) =>
  {
    let response = await Account.getAccountsItsIdContain(partialId)
    return response.toJson()
  })

  ipcMain.handle('getAllTransactions', async() =>
  {
    let response = await Transaction.getAllTransactions()
    return response.toJson()
  })

  ipcMain.handle('deleteTransaction', async(evnet, id) =>
  {
    let response = await Transaction.delete(id)
    return response.toJson()
  })

  ipcMain.handle('updateTransaction', async(event, id, amount, debtorId, creditorId, comment, date) =>
  {
    let response = await Transaction.update(id, amount, debtorId, creditorId, comment, date)
    return response.toJson()
  })

  ipcMain.handle('getAllTransactionsForAccountForPeriod', async(event, id, startPeriod, endPeriod) =>
  {
    let response = await Transaction.getAllTransactionsForAccountForPeriod(id, startPeriod, endPeriod)
    return response.toJson()
  })

  ipcMain.handle('getAllTransactionsForSpecificPeriod', async(event, startPeriod, endPeriod) =>
  {
    let response = await Transaction.getAllTransactionsForSpecificPeriod(startPeriod, endPeriod)
    return response.toJson()
  })

  ipcMain.handle('getAllTransactionsForAccount', async(event, id) =>
  {
    let response = await Transaction.getAllTransactionsForAccount(id)
    return response.toJson()
  })

  ipcMain.handle('getAccountById', async(event, id)=>
  {
    let response = await Account.getAccountById(id)
    return response.toJson()
  })

  ipcMain.handle('getAccountBalanceAtStartPeriod', async(event, id, startPeriod) =>
  {
    let response = await Transaction.getAccountBalanceAtStartPeriod(id, startPeriod)
    return response.toJson()
  })

  ipcMain.handle('getAcccountStatementForSpecificPeriod', async(event, id, startPeriod, endPeriod)=>
  {
    let response = await Transaction.getAcccountStatementForSpecificPeriod(id, startPeriod, endPeriod)
    return response.toJson()
  })

  ipcMain.handle('getAccountsItsNameContain', async(event, partialName)=>
  {
    let response = await Account.getAccountsItsNameContain(partialName)
    return response.toJson()
  })

  ipcMain.handle('getAllTransactionsWithPaging', async(event, page)=>
  {
    let response = await Transaction.getAllTransactionsWithPaging(page)
    return response.toJson()
  })

  ipcMain.handle('getTransactionById', async(event, id)=>
  {
    let response = await Transaction.getTransactionById(id)
    return response.toJson()
  })

  createWindow()

  app.on('activate', ()=>
  {
    if(BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})