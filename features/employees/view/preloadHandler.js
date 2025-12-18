import { ipcMain } from "electron"
import { Employee } from "../controllers/Employee.js"

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