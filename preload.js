const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('apis', {
  // Setup
  dbVersion: () => ipcRenderer.invoke('dbVersion'),
  setup: () => ipcRenderer.invoke('setup'),
  updateDB: () => ipcRenderer.invoke('updateDB'),
  
  // AccountsGroups
  createAccountsGroup: (entityId, name, accountsGroupId)=> ipcRenderer.invoke('createAccountsGroup', entityId, name, accountsGroupId),
  getAccountsGroups: (page, pageSize)=> ipcRenderer.invoke('getAccountsGroups', page, pageSize),
  getAccountsGroupsByEntityIdContains: (partialEntityId, page, pageSize)=> ipcRenderer.invoke('getAccountsGroupsByEntityIdContains', partialEntityId, page, pageSize),
  getAccountsGroupsByNameContains: (partialName, page, pageSize)=> ipcRenderer.invoke('getAccountsGroupsByNameContains', partialName, page, pageSize),
  
  // Account
  getAllAccounts: () => ipcRenderer.invoke('getAllAccounts'),
  getAccountsItsIdContain: (partialId) => ipcRenderer.invoke('getAccountsItsIdContain', partialId),
  getAccountsItsNameContain: (partialName) => ipcRenderer.invoke('getAccountsItsNameContain', partialName),
  getAccountById: (id) => ipcRenderer.invoke('getAccountById', id),
  createAccount: (id, name)=> ipcRenderer.invoke('createAccount', id, name),
  deleteAccount: (id)=> ipcRenderer.invoke('deleteAccount', id),
  updateAccount: (id, name) => ipcRenderer.invoke('updateAccount', id, name),
  
  // Employee
  getAllEmployees: () => ipcRenderer.invoke('getAllEmployees'),
  createEmployee: (id, name) => ipcRenderer.invoke('createEmployee', id ,name),
  getEmployeeById: (id) => ipcRenderer.invoke('getEmployeeById', id),
  updateEmployee: (internalId, body) => ipcRenderer.invoke('updateEmployee', internalId, body),
  getEmployeesItsIdContain: (partialId) => ipcRenderer.invoke('getEmployeesItsIdContain', partialId),
  getEmployeesItsNameContain: (partialName) => ipcRenderer.invoke('getEmployeesItsNameContain', partialName),
  deleteEmployee: (internalId) => ipcRenderer.invoke('deleteEmployee', internalId),
  
  // Machine
  getAllMachines: () => ipcRenderer.invoke('getAllMachines'),
  createMachine: (id, name) => ipcRenderer.invoke('createMachine', id ,name),
  getMachineById: (id) => ipcRenderer.invoke('getMachineById', id),
  updateMachine: (internalId, body) => ipcRenderer.invoke('updateMachine', internalId, body),
  getMachinesItsIdContain: (partialId) => ipcRenderer.invoke('getMachinesItsIdContain', partialId),
  getMachinesItsNameContain: (partialName) => ipcRenderer.invoke('getMachinesItsNameContain', partialName),
  deleteMachine: (internalId) => ipcRenderer.invoke('deleteMachine', internalId),

  // Item
  getAllItems: () => ipcRenderer.invoke('getAllItems'),
  getItemById: (id) => ipcRenderer.invoke('getItemById', id),
  getItemsItsIdContain: (partialId) => ipcRenderer.invoke('getItemsItsIdContain', partialId),
  getItemsItsNameContain: (partialName) => ipcRenderer.invoke('getItemsItsNameContain', partialName),
  createItem: (id, name) => ipcRenderer.invoke('createItem', id ,name),
  deleteItem: (id) => ipcRenderer.invoke('deleteItem', id),
  updateItem: (internalId, body) => ipcRenderer.invoke('updateItem', internalId, body),

  // DailyProduction
  createDailyProductionRecord: (dailyProductionData) => ipcRenderer.invoke('createDailyProductionRecord', dailyProductionData),
  getAllDailyProductionRecords: () => ipcRenderer.invoke('getAllDailyProductionRecords'),
  getDailyProductionById: (dailyProductionId) => ipcRenderer.invoke('getDailyProductionById', dailyProductionId),
  deleteDailyProductionById: (dailyProductionId) => ipcRenderer.invoke('deleteDailyProductionById', dailyProductionId),
  updateDailyProductionWithId: (dailyProductionId, dailyProductionData) => ipcRenderer.invoke('updateDailyProductionWithId', dailyProductionId, dailyProductionData),
  getItemStartAndEndProductionsDate: (itemId) => ipcRenderer.invoke('getItemStartAndEndProductionsDate', itemId),
  getItemProductionQuantitiesTotalForAPeriod: (itemId, startPeriod, endPeriod) => ipcRenderer.invoke('getItemProductionQuantitiesTotalForAPeriod', itemId, startPeriod, endPeriod),
  getAllDailyProductionsForItemForPeriod: (itemId, startPeriod, endPeriod) => ipcRenderer.invoke('getAllDailyProductionsForItemForPeriod', itemId, startPeriod, endPeriod),
  
  // Transaction
  createTransaction: (transactionData) => ipcRenderer.invoke('createTransaction', transactionData),
  getAllTransactions: ()=> ipcRenderer.invoke('getAllTransactions'),
  getAllTransactionsWithPaging: (page) => ipcRenderer.invoke('getAllTransactionsWithPaging', page),
  deleteTransaction: (id)=> ipcRenderer.invoke('deleteTransaction', id),
  updateTransaction: (id, transactionData) => ipcRenderer.invoke('updateTransaction', id, transactionData),
  getAllTransactionsForAccountForPeriod: (id, startPeriod, endPeriod) => ipcRenderer.invoke('getAllTransactionsForAccountForPeriod', id, startPeriod, endPeriod),
  getAllTransactionsForSpecificPeriod: (startPeriod, endPeriod) => ipcRenderer.invoke('getAllTransactionsForSpecificPeriod', startPeriod, endPeriod),
  getAllTransactionsForAccount: (id) => ipcRenderer.invoke('getAllTransactionsForAccount', id),
  getAccountBalanceAtStartPeriod: (id, startPeriod) => ipcRenderer.invoke('getAccountBalanceAtStartPeriod', id, startPeriod),
  getAcccountStatementForSpecificPeriod: (id, startPeriod, endPeriod) => ipcRenderer.invoke('getAcccountStatementForSpecificPeriod', id, startPeriod, endPeriod),
  getTransactionById: (id)=> ipcRenderer.invoke('getTransactionById', id),
  getFirstTransactionDateOfAccount: (id) => ipcRenderer.invoke('getFirstTransactionDateOfAccount', id),
  getLastTransactionDateOfAccount: (id) => ipcRenderer.invoke('getLastTransactionDateOfAccount', id),
  getAccountTransactionsCount: (accountId) => ipcRenderer.invoke('getAccountTransactionsCount', accountId),
  exportPDF: (data)=> ipcRenderer.invoke('exportPDF', data),
  exportExcel: (data)=> ipcRenderer.invoke('exportExcel', data),
});
