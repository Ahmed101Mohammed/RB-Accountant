import { ipcMain } from "electron";
import { ShiftsProduction } from "../controllers/ShiftsProduction.js";


ipcMain.handle('createDailyProductionRecord', (event, dailyProductionData)=> {
  let response = ShiftsProduction.create(dailyProductionData)
  return response.toJson()
})

ipcMain.handle('updateDailyProductionWithId', (event, dailyProductionId, dailyProductionData)=> {
  let response = ShiftsProduction.update(dailyProductionId, dailyProductionData)
  return response.toJson()
})

ipcMain.handle('getAllDailyProductionRecords', ()=>
{
  let response = ShiftsProduction.getAllDailyProductions();
  return response.toJson();
})

ipcMain.handle('getDailyProductionById', (event, dailyProductionId)=>
{
  let response = ShiftsProduction.getDailyProductionById(dailyProductionId);
  return response.toJson();
})

ipcMain.handle('getItemStartAndEndProductionsDate', (event, itemId)=>
{
  let response = ShiftsProduction.getItemStartAndEndProductionsDate(itemId);
  return response.toJson();
})

ipcMain.handle('getItemProductionQuantitiesTotalForAPeriod', (event, itemId, startPeriod, endPeriod)=>
{
  let response = ShiftsProduction.getItemProductionQuantitiesTotalForAPeriod(itemId, startPeriod, endPeriod);
  return response.toJson();
})

ipcMain.handle('deleteDailyProductionById', (event, dailyProductionId)=>
{
  let response = ShiftsProduction.delete(dailyProductionId);
  return response.toJson();
})

ipcMain.handle('getAllDailyProductionsForItemForPeriod', (event, itemId, startPeriod, endPeriod)=>
{
  let response = ShiftsProduction.getAllDailyProductionsForItemForPeriod(itemId, startPeriod, endPeriod);
  return response.toJson();
})