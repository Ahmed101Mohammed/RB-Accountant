import {BaseDB} from "../../../models/BaseDB.js";
// import ErrorHandler from "../../../utils/ErrorHandler.js";
// import { DailyProductionBody } from "../entities/DailyProductionBody.js";
// import { DailyProduction as DailyProductionEntity } from "../entities/DailyProduction.js";

export class ShiftsProduction
{
  
  // static isSetUped = false
  // static setUp()
  // {
  //   try
  //   {
  //     BaseDB.updateDB();
  //     DailyProduction.createDailyProductionTables();
  //     DailyProduction.isSetUped = true;
  //   }
  //   catch(error)
  //   {
  //     ErrorHandler.logError(error);
  //     DailyProduction.isSetUped = false;
  //   }
  // }

  // static createDailyProductionTables()
  // {
  //   const db = BaseDB.getDB();
  //   const createDailyProductionTables_ = db.transaction(()=>
  //   {
  //     DailyProduction.createDailyProductionsTable.run();
  //     DailyProduction.createShiftsTable.run();
  //     DailyProduction.createShiftsItemsTable.run();
  //     DailyProduction.createShiftsItemsAccountsTable.run();
  //     DailyProduction.createShiftsItemsAssignmentsTable.run();
  //   })

  //   createDailyProductionTables_();
  // }

  // static get createDailyProductionsTable()
  // {
  //   const db = BaseDB.getDB()
  //   const createDailyProductions = db.prepare(`
  //                 CREATE TABLE IF NOT EXISTS daily_production (
  //                     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //                     date TEXT UNIQUE NOT NULL,
  //                     CHECK (date >= '0001-01-01')
  //                 ) STRICT`
  //             );
  //   return createDailyProductions;
  // }

  // static get createShiftsTable()
  // {
  //   const db = BaseDB.getDB()
  //   const createShifts = db.prepare(`
  //     CREATE TABLE IF NOT EXISTS shifts (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       daily_production_id INTEGER NOT NULL,
  //       name TEXT NOT NULL CHECK (name IN ('morning', 'night', 'overtime')),
  //       start_at INTEGER NOT NULL CHECK (start_at BETWEEN 0 AND 23),
  //       end_at INTEGER NOT NULL CHECK (end_at BETWEEN 0 AND 23),
        
  //       FOREIGN KEY (daily_production_id) REFERENCES daily_production(id) ON DELETE CASCADE,

  //       UNIQUE (daily_production_id, name),
  //       UNIQUE (daily_production_id, start_at),
  //       UNIQUE (daily_production_id, end_at)
  //     ) STRICT`);
  //   return createShifts;
  // }

  // static get createShiftsItemsTable()
  // {
  //   const db = BaseDB.getDB()
  //   const createShiftsItems = db.prepare(`
  //     CREATE TABLE IF NOT EXISTS shifts_items (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       shift_id INTEGER NOT NULL,
  //       item_id INTEGER NOT NULL,
  //       FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
  //       FOREIGN KEY (item_id) REFERENCES items(internal_id)
  //     ) STRICT`);
  //   return createShiftsItems;
  // }

  // static get createShiftsItemsAccountsTable()
  // {
  //   const db = BaseDB.getDB()
  //   const createShiftsItemsAccounts = db.prepare(`
  //     CREATE TABLE IF NOT EXISTS shifts_items_accounts (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       shift_item_id INTEGER NOT NULL,
  //       account_id INTEGER NOT NULL,
  //       FOREIGN KEY (shift_item_id) REFERENCES shifts_items(id) ON DELETE CASCADE,
  //       FOREIGN KEY (account_id) REFERENCES accounts(id)
  //     ) STRICT`);
  //   return createShiftsItemsAccounts;
  // }

  // static get createShiftsItemsAssignmentsTable()
  // {
  //   const db = BaseDB.getDB()
  //   const createShiftsItemsAssignments = db.prepare(`
  //     CREATE TABLE IF NOT EXISTS shifts_items_assignments (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       shift_item_id INTEGER NOT NULL,
  //       employee_id INTEGER NOT NULL,
  //       machine_id INTEGER NOT NULL,
  //       start_at INTEGER NOT NULL CHECK (start_at BETWEEN 0 AND 23),
  //       end_at INTEGER NOT NULL CHECK (end_at BETWEEN 0 AND 23),
  //       high_quality_quantity INTEGER NOT NULL CHECK (high_quality_quantity >= 0),
  //       low_quality_quantity INTEGER NOT NULL CHECK (low_quality_quantity >= 0),
  //       FOREIGN KEY (shift_item_id) REFERENCES shifts_items(id) ON DELETE CASCADE,
  //       FOREIGN KEY (employee_id) REFERENCES employees(internal_id),
  //       FOREIGN KEY (machine_id) REFERENCES machines(internal_id),

  //       UNIQUE (shift_item_id, employee_id, machine_id, start_at),
  //       UNIQUE (shift_item_id, employee_id, machine_id, end_at)
  //     ) STRICT`);
  //   return createShiftsItemsAssignments;
  // }

  // static create(dailyProductionBody)
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   if(!DailyProductionBody.isDailyProductionBody(dailyProductionBody)) throw new Error('DailyProduction.create method: expect DailyProductionBody object');
  //   const db = BaseDB.getDB()

  //   const createDailyProduction = db.transaction(()=>
  //   {
  //     // create head
  //     const createDailyProductionHead = db.prepare('INSERT INTO daily_production (date) VALUES (@date)');
  //     const createDailyProductionHeadResponse = createDailyProductionHead.run({date: dailyProductionBody.date});
  //     const dailyProductionHeadId = createDailyProductionHeadResponse.lastInsertRowid;

  //     // prepare queries needed:createDetail
  //     const createShift = db.prepare('INSERT INTO shifts (daily_production_id, name, start_at, end_at) VALUES (@dailyProductionHeadId, @name, @startAt, @endAt)');
  //     const createProductionItem = db.prepare('INSERT INTO shifts_items (shift_id, item_id) VALUES (@shiftId, @itemId)');
  //     const createProductionItemAccount = db.prepare('INSERT INTO shifts_items_accounts (shift_item_id, account_id) VALUES (@shiftItemId, @accountId)');
  //     const createDetail = db.prepare('INSERT INTO shifts_items_assignments (shift_item_id, employee_id, machine_id, start_at, end_at, high_quality_quantity, low_quality_quantity) VALUES (@shiftItemId, @employeeId, @machineId, @startAt, @endAt, @highQualityQuantity, @lowQualityQuantity)');
      
  //     // create shifts
  //     for(let shift of dailyProductionBody.shifts)
  //     {
  //       const createShiftResponse = createShift.run({dailyProductionHeadId, name: shift.name, startAt: shift.startAt, endAt: shift.endAt});
  //       const shiftId = createShiftResponse.lastInsertRowid;

  //       // create productionItems
  //       for(let productionItem of shift.productionItems)
  //       {
  //         const createProductionItemResponse = createProductionItem.run({shiftId, itemId: productionItem.itemId});
  //         const shiftItemId = createProductionItemResponse.lastInsertRowid;
  //         createProductionItemAccount.run({shiftItemId, accountId: productionItem.accountId});

  //         // create details
  //         for(let detail of productionItem.details)
  //         {
  //           createDetail.run({
  //             shiftItemId, 
  //             employeeId: detail.employeeId, 
  //             machineId: detail.machineId, 
  //             startAt: detail.startAt, 
  //             endAt: detail.endAt,
  //             highQualityQuantity: detail.highQualityQuantity, 
  //             lowQualityQuantity: detail.lowQualityQuantity
  //           })
  //         }
  //       }
  //     }

  //     // response
  //     return {dailyProductionId: dailyProductionHeadId};
  //   })

  //   try
  //   {
  //     const response = createDailyProduction();
  //     return response;
  //   }
  //   catch(error)
  //   {
  //     throw error;
  //   }
  // }

  // static update(dailyProductionId, dailyProductionBody)
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   if(!DailyProductionBody.isDailyProductionBody(dailyProductionBody)) throw new Error('DailyProduction.create method: expect DailyProductionBody object');
  //   const db = BaseDB.getDB()

  //   const createDailyProduction = db.transaction(()=>
  //   {
  //     // delete old head
  //     const deleteDailyProductionHead = db.prepare('DELETE FROM daily_production WHERE id = @id');
  //     deleteDailyProductionHead.run({id: dailyProductionId});

  //     // create head
  //     const createDailyProductionHead = db.prepare('INSERT INTO daily_production (id, date) VALUES (@id, @date)');
  //     createDailyProductionHead.run({id: dailyProductionId, date: dailyProductionBody.date});
  //     const dailyProductionHeadId = dailyProductionId;

  //     // prepare queries needed:createDetail
  //     const createShift = db.prepare('INSERT INTO shifts (daily_production_id, name, start_at, end_at) VALUES (@dailyProductionHeadId, @name, @startAt, @endAt)');
  //     const createProductionItem = db.prepare('INSERT INTO shifts_items (shift_id, item_id) VALUES (@shiftId, @itemId)');
  //     const createProductionItemAccount = db.prepare('INSERT INTO shifts_items_accounts (shift_item_id, account_id) VALUES (@shiftItemId, @accountId)');
  //     const createDetail = db.prepare('INSERT INTO shifts_items_assignments (shift_item_id, employee_id, machine_id, start_at, end_at, high_quality_quantity, low_quality_quantity) VALUES (@shiftItemId, @employeeId, @machineId, @startAt, @endAt, @highQualityQuantity, @lowQualityQuantity)');
      
  //     // create shifts
  //     for(let shift of dailyProductionBody.shifts)
  //     {
  //       const createShiftResponse = createShift.run({dailyProductionHeadId, name: shift.name, startAt: shift.startAt, endAt: shift.endAt});
  //       const shiftId = createShiftResponse.lastInsertRowid;

  //       // create productionItems
  //       for(let productionItem of shift.productionItems)
  //       {
  //         const createProductionItemResponse = createProductionItem.run({shiftId, itemId: productionItem.itemId});
  //         const shiftItemId = createProductionItemResponse.lastInsertRowid;
  //         createProductionItemAccount.run({shiftItemId, accountId: productionItem.accountId});

  //         // create details
  //         for(let detail of productionItem.details)
  //         {
  //           createDetail.run({
  //             shiftItemId, 
  //             employeeId: detail.employeeId, 
  //             machineId: detail.machineId, 
  //             startAt: detail.startAt, 
  //             endAt: detail.endAt,
  //             highQualityQuantity: detail.highQualityQuantity, 
  //             lowQualityQuantity: detail.lowQualityQuantity
  //           })
  //         }
  //       }
  //     }

  //     // response
  //     return {dailyProductionId};
  //   })

  //   try
  //   {
  //     const response = createDailyProduction();
  //     return response;
  //   }
  //   catch(error)
  //   {
  //     throw error;
  //   }
  // }

  // static getAllDailyProductions()
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               dp.id AS id,
  //                               dp.date AS date,
  //                               json_group_array(
  //                                 json_object(
  //                                   'shiftId', shifts.id,
  //                                   'shiftName', shifts.name,
  //                                   'shiftStartAt', shifts.start_at,
  //                                   'shiftEndAt', shifts.end_at,
  //                                   'items', (
  //                                     SELECT json_group_array(
  //                                       json_object(
  //                                         'itemId', items.id,
  //                                         'itemName', items.name,
  //                                         'accounts', (
  //                                           SELECT json_group_array(
  //                                             json_object(
  //                                               'accountId', accounts.id,
  //                                               'accountName', accounts.name
  //                                             )
  //                                           )
  //                                           FROM shifts_items_accounts pAcc
  //                                           JOIN accounts ON accounts.id = pAcc.account_id
  //                                           WHERE pAcc.shift_item_id = pItem.id
  //                                         ),
  //                                         'assignments', (
  //                                           SELECT json_group_array(
  //                                             json_object(
  //                                               'machineId', machines.id,
  //                                               'machineName', machines.name,
  //                                               'employeeId', employees.id,
  //                                               'employeeName', employees.name,
  //                                               'detailStartAt', details.start_at,
  //                                               'detailEndAt', details.end_at,
  //                                               'highQualityQuantity', details.high_quality_quantity,
  //                                               'lowQualityQuantity', details.low_quality_quantity
  //                                             )
  //                                           )
  //                                           FROM shifts_items_assignments details
  //                                           JOIN machines ON machines.internal_id = details.machine_id
  //                                           JOIN employees ON employees.internal_id = details.employee_id
  //                                           WHERE details.shift_item_id = pItem.id
  //                                         )
  //                                       )
  //                                     )
  //                                     FROM shifts_items pItem
  //                                     JOIN items ON items.internal_id = pItem.item_id
  //                                     WHERE pItem.shift_id = shifts.id
  //                                   )
  //                                 )
  //                               ) AS shifts
  //                             FROM daily_production dp
  //                             JOIN shifts ON shifts.daily_production_id = dp.id
  //                             GROUP BY dp.id
  //                             ORDER BY dp.date ASC;
  //                             `)
  //   try
  //   {
  //     const dailyProductions = query.all();
  //     const parsedDailyProductions = dailyProductions.map(dailyProduction => {
  //       dailyProduction.shifts = JSON.parse(dailyProduction.shifts);
  //       return dailyProduction;
  //     });
  //     const dailyProductionEntities = DailyProductionEntity.createMultipleDailyProductions(parsedDailyProductions);
  //     return dailyProductionEntities;
  //   }
  //   catch(error)
  //   {
  //     ErrorHandler.logError(error)
  //     return false;
  //   }
   
  // }

  // static getAllDailyProductionsForItemForPeriod(itemId, startPeriod, endPeriod)
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               dp.id AS id,
  //                               dp.date AS date,
  //                               json_group_array(
  //                                 json_object(
  //                                   'shiftId', shifts.id,
  //                                   'shiftName', shifts.name,
  //                                   'shiftStartAt', shifts.start_at,
  //                                   'shiftEndAt', shifts.end_at,
  //                                   'items', (
  //                                     SELECT json_group_array(
  //                                       json_object(
  //                                         'itemId', items.id,
  //                                         'itemName', items.name,
  //                                         'accounts', (
  //                                           SELECT json_group_array(
  //                                             json_object(
  //                                               'accountId', accounts.id,
  //                                               'accountName', accounts.name
  //                                             )
  //                                           )
  //                                           FROM shifts_items_accounts pAcc
  //                                           JOIN accounts ON accounts.id = pAcc.account_id
  //                                           WHERE pAcc.shift_item_id = pItem.id
  //                                         ),
  //                                         'assignments', (
  //                                           SELECT json_group_array(
  //                                             json_object(
  //                                               'machineId', machines.id,
  //                                               'machineName', machines.name,
  //                                               'employeeId', employees.id,
  //                                               'employeeName', employees.name,
  //                                               'detailStartAt', details.start_at,
  //                                               'detailEndAt', details.end_at,
  //                                               'highQualityQuantity', details.high_quality_quantity,
  //                                               'lowQualityQuantity', details.low_quality_quantity
  //                                             )
  //                                           )
  //                                           FROM shifts_items_assignments details
  //                                           JOIN machines ON machines.internal_id = details.machine_id
  //                                           JOIN employees ON employees.internal_id = details.employee_id
  //                                           WHERE details.shift_item_id = pItem.id
  //                                         )
  //                                       )
  //                                     )
  //                                     FROM shifts_items pItem
  //                                     JOIN items ON items.internal_id = pItem.item_id
  //                                     WHERE pItem.shift_id = shifts.id
  //                                   )
  //                                 )
  //                               ) AS shifts
  //                             FROM daily_production dp
  //                             JOIN shifts ON shifts.daily_production_id = dp.id
  //                             WHERE dp.date BETWEEN MIN(@startPeriod, @endPeriod) AND MAX(@startPeriod, @endPeriod)
  //                               AND EXISTS (
  //                                             SELECT 1
  //                                             FROM shifts_items si
  //                                             JOIN items ON items.internal_id = si.item_id
  //                                             WHERE si.shift_id = shifts.id
  //                                               AND items.id = @id
  //                                           )
  //                             GROUP BY dp.id
  //                             ORDER BY dp.date ASC;
  //                             `)
  //   try
  //   {
  //     const dailyProductions = query.all({id: itemId, startPeriod, endPeriod});
  //     const parsedDailyProductions = dailyProductions.map(dailyProduction => {
  //       dailyProduction.shifts = JSON.parse(dailyProduction.shifts);
  //       return dailyProduction;
  //     });
  //     const dailyProductionEntities = DailyProductionEntity.createMultipleDailyProductions(parsedDailyProductions);
  //     return dailyProductionEntities;
  //   }
  //   catch(error)
  //   {
  //     ErrorHandler.logError(error)
  //     return false;
  //   }
   
  // }

  // static getDailyProductionById(id)
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               dp.id AS id,
  //                               dp.date AS date,
  //                               json_group_array(
  //                                 json_object(
  //                                   'shiftId', shifts.id,
  //                                   'shiftName', shifts.name,
  //                                   'shiftStartAt', shifts.start_at,
  //                                   'shiftEndAt', shifts.end_at,
  //                                   'items', (
  //                                     SELECT json_group_array(
  //                                       json_object(
  //                                         'itemId', items.id,
  //                                         'itemName', items.name,
  //                                         'accounts', (
  //                                           SELECT json_group_array(
  //                                             json_object(
  //                                               'accountId', accounts.id,
  //                                               'accountName', accounts.name
  //                                             )
  //                                           )
  //                                           FROM shifts_items_accounts pAcc
  //                                           JOIN accounts ON accounts.id = pAcc.account_id
  //                                           WHERE pAcc.shift_item_id = pItem.id
  //                                         ),
  //                                         'assignments', (
  //                                           SELECT json_group_array(
  //                                             json_object(
  //                                               'machineId', machines.id,
  //                                               'machineName', machines.name,
  //                                               'employeeId', employees.id,
  //                                               'employeeName', employees.name,
  //                                               'detailStartAt', details.start_at,
  //                                               'detailEndAt', details.end_at,
  //                                               'highQualityQuantity', details.high_quality_quantity,
  //                                               'lowQualityQuantity', details.low_quality_quantity
  //                                             )
  //                                           )
  //                                           FROM shifts_items_assignments details
  //                                           JOIN machines ON machines.internal_id = details.machine_id
  //                                           JOIN employees ON employees.internal_id = details.employee_id
  //                                           WHERE details.shift_item_id = pItem.id
  //                                         )
  //                                       )
  //                                     )
  //                                     FROM shifts_items pItem
  //                                     JOIN items ON items.internal_id = pItem.item_id
  //                                     WHERE pItem.shift_id = shifts.id
  //                                   )
  //                                 )
  //                               ) AS shifts
  //                             FROM daily_production dp
  //                             JOIN shifts ON shifts.daily_production_id = dp.id
  //                             WHERE dp.id = @id
  //                             ORDER BY dp.date ASC;`)
  //   try
  //   {
  //     const dailyProduction = query.get({id});
  //     if(!dailyProduction) return false;
  //     dailyProduction.shifts = JSON.parse(dailyProduction.shifts);

  //     const dailyProductionsEntity = DailyProductionEntity.createDailyProductionForReading(dailyProduction);
  //     return dailyProductionsEntity;
  //   }
  //   catch(error)
  //   {
  //     ErrorHandler.logError(error);
  //     throw error;
  //   }
  // }

  // static getItemStartAndEndProductionsDate = (itemId)=>
  // {
  //    if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`
  //     SELECT MIN(dp.date) as startPeriod, MAX(dp.date) as endPeriod
  //     FROM shifts_items si
  //     JOIN shifts ON shifts.id = si.shift_id
  //     JOIN daily_production dp ON dp.id = shifts.daily_production_id
  //     JOIN items ON si.item_id = items.internal_id
  //     WHERE items.id = @id;
  //   `)
  //   try
  //   {
  //     const startAndEndPeriods = query.get({id: itemId});
  //     return startAndEndPeriods;
  //   }
  //   catch(error)
  //   {
  //     ErrorHandler.logError(error);
  //     throw error;
  //   }

  // }

  // static getItemProductionQuantitiesTotalForAPeriod = (itemId, startPeriod, endPeriod)=>
  // {
  //    if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`
  //     SELECT COALESCE(SUM(sia.high_quality_quantity), 0) AS highQualityQuantity,
  //             COALESCE(SUM(sia.low_quality_quantity), 0) AS lowQualityQuantity
  //     FROM shifts_items si
  //     JOIN shifts ON shifts.id = si.shift_id
  //     JOIN daily_production dp ON dp.id = shifts.daily_production_id
  //     JOIN shifts_items_assignments sia ON sia.shift_item_id = si.id
  //     JOIN items ON si.item_id = items.internal_id
  //     WHERE items.id = @id AND dp.date BETWEEN MIN(@startPeriod, @endPeriod) AND MAX(@startPeriod, @endPeriod)
  //   `)
  //   try
  //   {
  //     const startAndEndPeriods = query.get({id: itemId, startPeriod, endPeriod});
  //     return startAndEndPeriods;
  //   }
  //   catch(error)
  //   {
  //     ErrorHandler.logError(error);
  //     throw error;
  //   }

  // }

  // static delete(id)
  // {

  //   if(!DailyProduction.isSetUped) DailyProduction.setUp();
  //   const db = BaseDB.getDB();
  //   const deleteQuery = db.prepare('DELETE FROM daily_production WHERE id = @id')

  //   try
  //   {
  //     const deleteResponse = deleteQuery.run({id});
  //     return deleteResponse;
  //   }
  //   catch(error)
  //   {
  //     ErrorHandler.logError(error);
  //     throw error;
  //   }
  // }
}