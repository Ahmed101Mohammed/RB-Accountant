import { app, BrowserWindow, ipcMain, screen } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'url';
import Account from './controllers/Account.js';
import Transaction from './controllers/Transaction.js';
import generatePDF from './services/exportPdf.js';
import generateExcel from './services/exportExcel.js';
import { Employee } from './controllers/Employee.js';

// preload absolute path
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const preloadLocation = path.resolve(__dirname, 'preload.js')

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width, height,
    resizable: true,
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

// Accounts
app.whenReady().then(async () => {
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
  // Empolyees
  ipcMain.handle('getAllEmployees', ()=> {
    let response = Employee.getAllEmployees()
    return response.toJson()
  })

  ipcMain.handle('createEmployee', (event, id, name) =>
  {
    let response = Employee.create(id, name); 
    return response.toJson();
  })

  ipcMain.handle('getEmployeeById', (event, id) =>
  {
    let response = Employee.getEmployeeById(id);
    return response.toJson();
  })

  ipcMain.handle('updateEmployee', (event, internalId, body) =>
  {
    let response = Employee.update(internalId, body);
    return response.toJson();
  })

  ipcMain.handle('getEmployeesItsIdContain', (event, partialId) =>
  {
    let response = Employee.getEmployeesItsIdContain(partialId)
    return response.toJson()
  })

  ipcMain.handle('getEmployeesItsNameContain', (event, partialName)=>
  {
    let response = Employee.getEmployeesItsNameContain(partialName)
    return response.toJson()
  })

  ipcMain.handle('deleteEmployee', (event, internalId) =>
  {
    let response = Employee.delete(internalId);
    return response.toJson();
  })

  // Machines
  await import('./features/machines/view/preloadHandler.js');

  // Items
  await import('./features/items/view/preloadHandler.js');

  // DailyProduction
  await import('./features/dailyProduction/view/preloadHandler.js');
  
  // Transactions
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

  ipcMain.handle('exportPDF', (event, data)=>
  {
    generatePDF(data)
  })

  ipcMain.handle('exportExcel', (event, data)=>
  {
    generateExcel(data)
  })

  createWindow()

  app.on('activate', ()=>
  {
    if(BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
