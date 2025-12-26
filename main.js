import { app, BrowserWindow, ipcMain, screen } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'url';
import generatePDF from './services/exportPdf.js';
import generateExcel from './services/exportExcel.js';
import { Setup} from './features/setup/controllers/Setup.js';

// test
console.log(Setup.dbVersion().getData())


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
  win.loadURL('http://localhost:9000/')
  // win.loadFile('./dist/index.html')
}

app.on('window-all-closed', ()=>
{
  if(process.platform !== 'darwin') app.quit()
})

app.whenReady().then(async () => {
  // Setup
  await import('./features/setup/view/preloadHandler.js');

  // AccountsGroups
  await import('./features/accountsGroups/view/AccountsGroups.js');

  // Accounts
  await import('./features/accounts/view/preloadHandler.js');

  // Empolyees
  
  await import('./features/employees/view/preloadHandler.js');

  // Machines
  await import('./features/machines/view/preloadHandler.js');

  // Products
  await import('./features/products/view/preloadHandler.js');

  // DailyProduction
  await import('./features/shiftsProduction/view/preloadHandler.js');
  
  // Transactions
  await import('./features/transactions/view/preloadHandler.js');

  // services
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
