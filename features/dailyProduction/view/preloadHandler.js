import { ipcMain } from "electron";
import { DailyProduction } from "../controllers/DailyProduction.js";


ipcMain.handle('createDailyProductionRecord', (event, dailyProductionData)=> {
  let response = DailyProduction.create(dailyProductionData)
  return response.toJson()
})

ipcMain.handle('updateDailyProductionWithId', (event, dailyProductionId, dailyProductionData)=> {
  let response = DailyProduction.update(dailyProductionId, dailyProductionData)
  return response.toJson()
})

ipcMain.handle('getAllDailyProductionRecords', ()=>
{
  let response = DailyProduction.getAllDailyProductions();
  return response.toJson();
})

ipcMain.handle('getDailyProductionById', (event, dailyProductionId)=>
{
  let response = DailyProduction.getDailyProductionById(dailyProductionId);
  return response.toJson();
})

ipcMain.handle('getItemStartAndEndProductionsDate', (event, itemId)=>
{
  let response = DailyProduction.getItemStartAndEndProductionsDate(itemId);
  return response.toJson();
})

ipcMain.handle('getItemProductionQuantitiesTotalForAPeriod', (event, itemId, startPeriod, endPeriod)=>
{
  let response = DailyProduction.getItemProductionQuantitiesTotalForAPeriod(itemId, startPeriod, endPeriod);
  return response.toJson();
})

ipcMain.handle('deleteDailyProductionById', (event, dailyProductionId)=>
{
  let response = DailyProduction.delete(dailyProductionId);
  return response.toJson();
})

ipcMain.handle('getAllDailyProductionsForItemForPeriod', (event, itemId, startPeriod, endPeriod)=>
{
  let response = DailyProduction.getAllDailyProductionsForItemForPeriod(itemId, startPeriod, endPeriod);
  return response.toJson();
})