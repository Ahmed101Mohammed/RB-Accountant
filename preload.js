const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('apis', {
  getAllAccounts: () => ipcRenderer.invoke('getAllAccounts'),
  getAccountsItsIdContain: (partialId) => ipcRenderer.invoke('getAccountsItsIdContain', partialId),
  getAccountsItsNameContain: (partialName) => ipcRenderer.invoke('getAccountsItsNameContain', partialName),
  getAccountById: (id) => ipcRenderer.invoke('getAccountById', id),
  createAccount: (id, name)=> ipcRenderer.invoke('createAccount', id, name),
  deleteAccount: (id)=> ipcRenderer.invoke('deleteAccount', id),
  updateAccount: (id, name) => ipcRenderer.invoke('updateAccount', id, name),
  createTransaction: (amount, debtorId, creditorId, comment, date) => ipcRenderer.invoke('createTransaction', amount, debtorId, creditorId, comment, date),
  getAllTransactions: ()=> ipcRenderer.invoke('getAllTransactions'),
  getAllTransactionsWithPaging: (page) => ipcRenderer.invoke('getAllTransactionsWithPaging', page),
  deleteTransaction: (id)=> ipcRenderer.invoke('deleteTransaction', id),
  updateTransaction: (id, amount, debtorId, creditorId, comment, date) => ipcRenderer.invoke('updateTransaction', id, amount, debtorId, creditorId, comment, date),
  getAllTransactionsForAccountForPeriod: (id, startPeriod, endPeriod) => ipcRenderer.invoke('getAllTransactionsForAccountForPeriod', id, startPeriod, endPeriod),
  getAllTransactionsForSpecificPeriod: (startPeriod, endPeriod) => ipcRenderer.invoke('getAllTransactionsForSpecificPeriod', startPeriod, endPeriod),
  getAllTransactionsForAccount: (id) => ipcRenderer.invoke('getAllTransactionsForAccount', id),
  getAccountBalanceAtStartPeriod: (id, startPeriod) => ipcRenderer.invoke('getAccountBalanceAtStartPeriod', id, startPeriod),
  getAcccountStatementForSpecificPeriod: (id, startPeriod, endPeriod) => ipcRenderer.invoke('getAcccountStatementForSpecificPeriod', id, startPeriod, endPeriod),
  getTransactionById: (id)=> ipcRenderer.invoke('getTransactionById', id),
});

// contextBridge.exposeInMainWorld('apis', {
//   create: async(account)=> await Account.create(account),
//   getAllAccounts: async()=> await Account.getAllAccounts()
// })
