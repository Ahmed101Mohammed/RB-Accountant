import Joi from "joi";

import Response from "../../../utils/Response.js";
import { DailyProductionBody } from "../entities/DailyProductionBody.js";
import { ShiftBody } from "../entities/ShiftBody.js";
import { DayDuration } from "../entities/DayDuration.js";
import Account from "../../../entities/Account.js";
import { EmployeeBody } from "../../../entities/employee/EmployeeBody.js";
import { MachineBody } from "../../machines/entities/MachineBody.js";
import { ItemBody } from "../../items/entities/ItemBody.js";
import { DetailBody } from "../entities/DetailBody.js";
import { Item } from "../../items/models/Item.js";
import { Machine } from "../../machines/models/Machine.js";
import { Employee } from "../../../models/Employee.js";
import { DailyProduction as DailyProductionModel }  from "../models/DailyProduction.js"
import ErrorHandler from "../../../utils/ErrorHandler.js";
import { currentDate } from "../../../utils/currentDate.js";
import { DailyProduction as DailyProductionEntity } from "../entities/DailyProduction.js";
export class DailyProduction
{
  static create(dailyProductionData)
  {
    const schema = Joi.object({
      date: DailyProductionBody.dateSchema.required(),
      shifts: Joi
        .array()
        .min(1)
        .items(Joi.object({
          name: ShiftBody.nameSchema.required(),
          startAt: DayDuration.hourSchema.required(),
          endAt: DayDuration.hourSchema.required(),
          items: Joi
            .array()
            .min(1)
            .items(Joi.object({
              accountId: Account.idSchema.required(),
              itemId: ItemBody.idSchema.required(),
              details: Joi
                .array()
                .min(1)
                .items(Joi.object({
                  machineId: MachineBody.idSchema.required(),
                  employeeId: EmployeeBody.idSchema.required(),
                  startAt: DayDuration.hourSchema.required(),
                  endAt: DayDuration.hourSchema.required(),
                  highQualityQuantity: DetailBody.quantitySchema.required(),
                  lowQualityQuantity: DetailBody.quantitySchema.required(),
                }))
                .required()
            }))
            .required()
        })
        )
        .required()
    })

    const validationResponse = schema.validate(dailyProductionData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message);
    }

    if(currentDate() < dailyProductionData.date)
    {
      return new Response(false, 'لا يمكن إنشاء يومية إنتاج بتاريخ في المستقبل')
    }
    // Get all ids and categrized them. 
    const machinesIds = [];
    const employeesIds = [];
    const itemsIds = [];

    for(let shift of dailyProductionData.shifts)
    {
      for(let item of shift.items)
      {
        itemsIds.push(item.itemId);
        for(let detail of item.details)
        {
          machinesIds.push(detail.machineId);
          employeesIds.push(detail.employeeId);
        }
      }
    }

    // Get internalIds for ids and categrized them
    const itemsInternalIds = Item.getInternalIdsForIds(itemsIds);
    const machinesInternalIds = Machine.getInternalIdsForIds(machinesIds);
    const employeesInternalIds = Employee.getInternalIdsForIds(employeesIds);

    // Check each id has its internalid, and give error if they not.
    const machinesIdsMaping = {};
    const employeesIdsMaping = {};
    const itemsIdsMaping = {};

    for(let index = 0; index < itemsIds.length; index++)
    {
      const itemInternalId = itemsInternalIds[index];
      const itemId = itemsIds[index];
      if(itemsIdsMaping[itemId]) continue;
      if(itemInternalId === null) return new Response(false, `لا يوجد صنف بهذا الكود ${itemId}`);
      itemsIdsMaping[itemId] = itemInternalId;
    }

    for(let index = 0; index < machinesIds.length; index++)
    {
      const machineInternalId = machinesInternalIds[index];
      const machineId = machinesIds[index];
      if(machinesIdsMaping[machineId]) continue;
      if(machineInternalId === null) return new Response(false, `لا يوجد ماكينة بهذا الكود ${machineId}`);
      machinesIdsMaping[machineId] = machineInternalId;
    }

    for(let index = 0; index < employeesIds.length; index++)
    {
      const employeeInternalId = employeesInternalIds[index];
      const employeeId = employeesIds[index];
      if(employeesIdsMaping[employeeId]) continue;
      if(employeeInternalId === null) return new Response(false, `لا يوجد موظف بهذا الكود ${employeeId}`);
      employeesIdsMaping[employeeId] = employeeInternalId;
    }

    // Replace ids with its internalIds

    for(let shift of dailyProductionData.shifts)
    {
      for(let item of shift.items)
      {
        item.itemId = itemsIdsMaping[item.itemId];
        for(let detail of item.details)
        {
          detail.machineId = machinesIdsMaping[detail.machineId];
          detail.employeeId = employeesIdsMaping[detail.employeeId];
        }
      }
    }
    

    const newDailyProduction = DailyProductionBody.createDailyProductionBodyEntityForWriting(dailyProductionData); 
    try
    {
      const response = DailyProductionModel.create(newDailyProduction);
      return new Response(true, null, response);
    }
    catch(error)
    {
      ErrorHandler.logError(error)
      return new Response(false, error.message);
    }
  }

  static update(dailyProductionId, dailyProductionData)
  {
    const dailyProductionIdSchema = DailyProductionEntity.idSchema.required();
    const schema = Joi.object({
      date: DailyProductionBody.dateSchema.required(),
      shifts: Joi
        .array()
        .min(1)
        .items(Joi.object({
          name: ShiftBody.nameSchema.required(),
          startAt: DayDuration.hourSchema.required(),
          endAt: DayDuration.hourSchema.required(),
          items: Joi
            .array()
            .min(1)
            .items(Joi.object({
              accountId: Account.idSchema.required(),
              itemId: ItemBody.idSchema.required(),
              details: Joi
                .array()
                .min(1)
                .items(Joi.object({
                  machineId: MachineBody.idSchema.required(),
                  employeeId: EmployeeBody.idSchema.required(),
                  startAt: DayDuration.hourSchema.required(),
                  endAt: DayDuration.hourSchema.required(),
                  highQualityQuantity: DetailBody.quantitySchema.required(),
                  lowQualityQuantity: DetailBody.quantitySchema.required(),
                }))
                .required()
            }))
            .required()
        })
        )
        .required()
    })

    const validationResponse = schema.validate(dailyProductionData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message);
    }

    const validId = dailyProductionIdSchema.validate(dailyProductionId);
    if(validId.error)
    {
      return new Response(false, validId.error.message);
    }

    if(currentDate() < dailyProductionData.date)
    {
      return new Response(false, 'لا يمكن إنشاء يومية إنتاج بتاريخ في المستقبل')
    }
    // Get all ids and categrized them. 
    const machinesIds = [];
    const employeesIds = [];
    const itemsIds = [];

    for(let shift of dailyProductionData.shifts)
    {
      for(let item of shift.items)
      {
        itemsIds.push(item.itemId);
        for(let detail of item.details)
        {
          machinesIds.push(detail.machineId);
          employeesIds.push(detail.employeeId);
        }
      }
    }

    // Get internalIds for ids and categrized them
    const itemsInternalIds = Item.getInternalIdsForIds(itemsIds);
    const machinesInternalIds = Machine.getInternalIdsForIds(machinesIds);
    const employeesInternalIds = Employee.getInternalIdsForIds(employeesIds);

    // Check each id has its internalid, and give error if they not.
    const machinesIdsMaping = {};
    const employeesIdsMaping = {};
    const itemsIdsMaping = {};

    for(let index = 0; index < itemsIds.length; index++)
    {
      const itemInternalId = itemsInternalIds[index];
      const itemId = itemsIds[index];
      if(itemsIdsMaping[itemId]) continue;
      if(itemInternalId === null) return new Response(false, `لا يوجد صنف بهذا الكود ${itemId}`);
      itemsIdsMaping[itemId] = itemInternalId;
    }

    for(let index = 0; index < machinesIds.length; index++)
    {
      const machineInternalId = machinesInternalIds[index];
      const machineId = machinesIds[index];
      if(machinesIdsMaping[machineId]) continue;
      if(machineInternalId === null) return new Response(false, `لا يوجد ماكينة بهذا الكود ${machineId}`);
      machinesIdsMaping[machineId] = machineInternalId;
    }

    for(let index = 0; index < employeesIds.length; index++)
    {
      const employeeInternalId = employeesInternalIds[index];
      const employeeId = employeesIds[index];
      if(employeesIdsMaping[employeeId]) continue;
      if(employeeInternalId === null) return new Response(false, `لا يوجد موظف بهذا الكود ${employeeId}`);
      employeesIdsMaping[employeeId] = employeeInternalId;
    }

    // Replace ids with its internalIds

    for(let shift of dailyProductionData.shifts)
    {
      for(let item of shift.items)
      {
        item.itemId = itemsIdsMaping[item.itemId];
        for(let detail of item.details)
        {
          detail.machineId = machinesIdsMaping[detail.machineId];
          detail.employeeId = employeesIdsMaping[detail.employeeId];
        }
      }
    }
    

    const newDailyProduction = DailyProductionBody.createDailyProductionBodyEntityForWriting(dailyProductionData); 
    try
    {
      const response = DailyProductionModel.update(dailyProductionId, newDailyProduction);
      return new Response(true, null, response);
    }
    catch(error)
    {
      ErrorHandler.logError(error)
      return new Response(false, error.message);
    }
  }
  
  static getAllDailyProductions()
  {
    try
    {
      const dailyProductions = DailyProductionModel.getAllDailyProductions();
      return new Response(true, null, dailyProductions);
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getDailyProductionById(id)
  {
    const dailyProductionData = {
      id: id.toString().trim(),
    }
    const schema = Joi.object({
      id: DailyProductionEntity.idSchema.required(),
    })

    const validationResponse = schema.validate(dailyProductionData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    try
    {
      const dailyProduction = DailyProductionModel.getDailyProductionById(id)
      if(!dailyProduction) 
			{
				return new Response(false, `لا يوجد صنف بهاذا الكود ${id}`)
			}
      return new Response(true, null, dailyProduction)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static delete(id)
  {
    const dailyProductionData = {
      id: id.toString().trim()
    }
    const schema = Joi.object({
      id: DailyProductionEntity.idSchema.required()
    })

    const validationResponse = schema.validate(dailyProductionData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    try
    {
      const response = DailyProductionModel.delete(id)
      return new Response(true, null, response)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getItemStartAndEndProductionsDate = (itemId)=>
  {
    const schema = ItemBody.idSchema;
    const validate = schema.validate(itemId);
    if(validate.error)
    {
      return new Response(false, validate.error.message);
    }
    try
    {
      const response = DailyProductionModel.getItemStartAndEndProductionsDate(itemId);
      return new Response(true, null, response);
    }
    catch(error)
    {
      return new Response(false, error.message);
    }
  }

  static getItemProductionQuantitiesTotalForAPeriod = (itemId, startPeriod, endPeriod) =>
  {
    const data = {
      id: itemId, 
      startPeriod, 
      endPeriod
    }

    const schema = Joi.object({
      id: ItemBody.idSchema,
      startPeriod: DailyProductionBody.dateSchema,
      endPeriod: DailyProductionBody.dateSchema
    })
    
    const validate = schema.validate(data);
    if(validate.error)
    {
      return new Response(false, validate.error.message);
    }

    // check period logic
    if(startPeriod > endPeriod)
    {
      return new Response(false, 'بداية فترة الإنتاج يجب أن تسبق نهاية فترة الإنتاج');
    }

    try
    {
      // check item existance
      const item = Item.getItemByIdExactly(itemId);
      if(item === false) return new Response(false, `لا يوجد عنصر مسجل بكود ${itemId}`)

      const response = DailyProductionModel.getItemProductionQuantitiesTotalForAPeriod(itemId, startPeriod, endPeriod);
      return new Response(true, null, response);
    }
    catch(error)
    {
      return new Response(false, error.message);
    }
  }
}