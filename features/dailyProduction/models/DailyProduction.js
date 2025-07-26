import BaseDB from "../../../models/BaseDB.js";
import ErrorHandler from "../../../utils/ErrorHandler.js";
import { DailyProductionBody } from "../entities/DailyProductionBody.js";
import { DailyProduction as DailyProductionEntity } from "../entities/DailyProduction.js";

export class DailyProduction
{
  static isSetUped = false
  static setUp()
  {
    try
    {
      BaseDB.updateDB();
      DailyProduction.createDailyProductionTables();
      DailyProduction.isSetUped = true;
    }
    catch(error)
    {
      ErrorHandler.logError(error);
      DailyProduction.isSetUped = false;
    }
  }

  static createDailyProductionTables()
  {
    const db = BaseDB.getDB();
    const createDailyProductionTables_ = db.transaction(()=>
    {
      DailyProduction.createDailyProductionsTable.run();
      DailyProduction.createShiftsTable.run();
      DailyProduction.createShiftsItemsTable.run();
      DailyProduction.createShiftsItemsAccountsTable.run();
      DailyProduction.createShiftsItemsAssignmentsTable.run();
    })

    createDailyProductionTables_();
  }

  static get createDailyProductionsTable()
  {
    const db = BaseDB.getDB()
    const createDailyProductions = db.prepare(`
                  CREATE TABLE IF NOT EXISTS daily_production (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      date TEXT UNIQUE NOT NULL,
                      CHECK (date >= '0001-01-01')
                  ) STRICT`
              );
    return createDailyProductions;
  }

  static get createShiftsTable()
  {
    const db = BaseDB.getDB()
    const createShifts = db.prepare(`
      CREATE TABLE IF NOT EXISTS shifts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        daily_production_id INTEGER NOT NULL,
        name TEXT NOT NULL CHECK (name IN ('morning', 'night', 'overtime')),
        start_at INTEGER NOT NULL CHECK (start_at BETWEEN 0 AND 23),
        end_at INTEGER NOT NULL CHECK (end_at BETWEEN 0 AND 23),
        
        FOREIGN KEY (daily_production_id) REFERENCES daily_production(id) ON DELETE CASCADE,

        UNIQUE (daily_production_id, name),
        UNIQUE (daily_production_id, start_at),
        UNIQUE (daily_production_id, end_at)
      ) STRICT`);
    return createShifts;
  }

  static get createShiftsItemsTable()
  {
    const db = BaseDB.getDB()
    const createShiftsItems = db.prepare(`
      CREATE TABLE IF NOT EXISTS shifts_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shift_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
        FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES items(internal_id)
      ) STRICT`);
    return createShiftsItems;
  }

  static get createShiftsItemsAccountsTable()
  {
    const db = BaseDB.getDB()
    const createShiftsItemsAccounts = db.prepare(`
      CREATE TABLE IF NOT EXISTS shifts_items_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shift_item_id INTEGER NOT NULL,
        account_id INTEGER NOT NULL,
        FOREIGN KEY (shift_item_id) REFERENCES shifts_items(id) ON DELETE CASCADE,
        FOREIGN KEY (account_id) REFERENCES accounts(id)
      ) STRICT`);
    return createShiftsItemsAccounts;
  }

  static get createShiftsItemsAssignmentsTable()
  {
    const db = BaseDB.getDB()
    const createShiftsItemsAssignments = db.prepare(`
      CREATE TABLE IF NOT EXISTS shifts_items_assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shift_item_id INTEGER NOT NULL,
        employee_id INTEGER NOT NULL,
        machine_id INTEGER NOT NULL,
        start_at INTEGER NOT NULL CHECK (start_at BETWEEN 0 AND 23),
        end_at INTEGER NOT NULL CHECK (end_at BETWEEN 0 AND 23),
        high_quality_quantity INTEGER NOT NULL CHECK (high_quality_quantity >= 0),
        low_quality_quantity INTEGER NOT NULL CHECK (low_quality_quantity >= 0),
        FOREIGN KEY (shift_item_id) REFERENCES shifts_items(id) ON DELETE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES employees(internal_id),
        FOREIGN KEY (machine_id) REFERENCES machines(internal_id),

        UNIQUE (shift_item_id, employee_id, machine_id, start_at),
        UNIQUE (shift_item_id, employee_id, machine_id, end_at)
      ) STRICT`);
    return createShiftsItemsAssignments;
  }

  static create(dailyProductionBody)
  {
    if(!DailyProduction.isSetUped) DailyProduction.setUp()
    if(!DailyProductionBody.isDailyProductionBody(dailyProductionBody)) throw new Error('DailyProduction.create method: expect DailyProductionBody object');
    const db = BaseDB.getDB()

    const createDailyProduction = db.transaction(()=>
    {
      // create head
      const createDailyProductionHead = db.prepare('INSERT INTO daily_production (date) VALUES (@date)');
      const createDailyProductionHeadResponse = createDailyProductionHead.run({date: dailyProductionBody.date});
      const dailyProductionHeadId = createDailyProductionHeadResponse.lastInsertRowid;

      // prepare queries needed:createDetail
      const createShift = db.prepare('INSERT INTO shifts (daily_production_id, name, start_at, end_at) VALUES (@dailyProductionHeadId, @name, @startAt, @endAt)');
      const createProductionItem = db.prepare('INSERT INTO shifts_items (shift_id, item_id) VALUES (@shiftId, @itemId)');
      const createProductionItemAccount = db.prepare('INSERT INTO shifts_items_accounts (shift_item_id, account_id) VALUES (@shiftItemId, @accountId)');
      const createDetail = db.prepare('INSERT INTO shifts_items_assignments (shift_item_id, employee_id, machine_id, start_at, end_at, high_quality_quantity, low_quality_quantity) VALUES (@shiftItemId, @employeeId, @machineId, @startAt, @endAt, @highQualityQuantity, @lowQualityQuantity)');
      
      // create shifts
      for(let shift of dailyProductionBody.shifts)
      {
        const createShiftResponse = createShift.run({dailyProductionHeadId, name: shift.name, startAt: shift.startAt, endAt: shift.endAt});
        const shiftId = createShiftResponse.lastInsertRowid;

        // create productionItems
        for(let productionItem of shift.productionItems)
        {
          const createProductionItemResponse = createProductionItem.run({shiftId, itemId: productionItem.itemId});
          const shiftItemId = createProductionItemResponse.lastInsertRowid;
          createProductionItemAccount.run({shiftItemId, accountId: productionItem.accountId});

          // create details
          for(let detail of productionItem.details)
          {
            createDetail.run({
              shiftItemId, 
              employeeId: detail.employeeId, 
              machineId: detail.machineId, 
              startAt: detail.startAt, 
              endAt: detail.endAt,
              highQualityQuantity: detail.highQualityQuantity, 
              lowQualityQuantity: detail.lowQualityQuantity
            })
          }
        }
      }

      // response
      return {dailyProductionId: dailyProductionHeadId};
    })

    try
    {
      const response = createDailyProduction();
      return response;
    }
    catch(error)
    {
      throw error;
    }
  }

  static update(dailyProductionId, dailyProductionBody)
  {
    if(!DailyProduction.isSetUped) DailyProduction.setUp()
    if(!DailyProductionBody.isDailyProductionBody(dailyProductionBody)) throw new Error('DailyProduction.create method: expect DailyProductionBody object');
    const db = BaseDB.getDB()

    const createDailyProduction = db.transaction(()=>
    {
      // delete old head
      const deleteDailyProductionHead = db.prepare('DELETE FROM daily_production WHERE id = @id');
      deleteDailyProductionHead.run({id: dailyProductionId});

      // create head
      const createDailyProductionHead = db.prepare('INSERT INTO daily_production (id, date) VALUES (@id, @date)');
      createDailyProductionHead.run({id: dailyProductionId, date: dailyProductionBody.date});
      const dailyProductionHeadId = dailyProductionId;

      // prepare queries needed:createDetail
      const createShift = db.prepare('INSERT INTO shifts (daily_production_id, name, start_at, end_at) VALUES (@dailyProductionHeadId, @name, @startAt, @endAt)');
      const createProductionItem = db.prepare('INSERT INTO shifts_items (shift_id, item_id) VALUES (@shiftId, @itemId)');
      const createProductionItemAccount = db.prepare('INSERT INTO shifts_items_accounts (shift_item_id, account_id) VALUES (@shiftItemId, @accountId)');
      const createDetail = db.prepare('INSERT INTO shifts_items_assignments (shift_item_id, employee_id, machine_id, start_at, end_at, high_quality_quantity, low_quality_quantity) VALUES (@shiftItemId, @employeeId, @machineId, @startAt, @endAt, @highQualityQuantity, @lowQualityQuantity)');
      
      // create shifts
      for(let shift of dailyProductionBody.shifts)
      {
        const createShiftResponse = createShift.run({dailyProductionHeadId, name: shift.name, startAt: shift.startAt, endAt: shift.endAt});
        const shiftId = createShiftResponse.lastInsertRowid;

        // create productionItems
        for(let productionItem of shift.productionItems)
        {
          const createProductionItemResponse = createProductionItem.run({shiftId, itemId: productionItem.itemId});
          const shiftItemId = createProductionItemResponse.lastInsertRowid;
          createProductionItemAccount.run({shiftItemId, accountId: productionItem.accountId});

          // create details
          for(let detail of productionItem.details)
          {
            createDetail.run({
              shiftItemId, 
              employeeId: detail.employeeId, 
              machineId: detail.machineId, 
              startAt: detail.startAt, 
              endAt: detail.endAt,
              highQualityQuantity: detail.highQualityQuantity, 
              lowQualityQuantity: detail.lowQualityQuantity
            })
          }
        }
      }

      // response
      return {dailyProductionId};
    })

    try
    {
      const response = createDailyProduction();
      return response;
    }
    catch(error)
    {
      throw error;
    }
  }

  static getAllDailyProductions()
  {
    if(!DailyProduction.isSetUped) DailyProduction.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare(`SELECT 
                                dp.id AS id,
                                dp.date AS date,
                                json_group_array(
                                  json_object(
                                    'shiftId', shifts.id,
                                    'shiftName', shifts.name,
                                    'shiftStartAt', shifts.start_at,
                                    'shiftEndAt', shifts.end_at,
                                    'items', (
                                      SELECT json_group_array(
                                        json_object(
                                          'itemId', items.id,
                                          'itemName', items.name,
                                          'accounts', (
                                            SELECT json_group_array(
                                              json_object(
                                                'accountId', accounts.id,
                                                'accountName', accounts.name
                                              )
                                            )
                                            FROM shifts_items_accounts pAcc
                                            JOIN accounts ON accounts.id = pAcc.account_id
                                            WHERE pAcc.shift_item_id = pItem.id
                                          ),
                                          'assignments', (
                                            SELECT json_group_array(
                                              json_object(
                                                'machineId', machines.id,
                                                'machineName', machines.name,
                                                'employeeId', employees.id,
                                                'employeeName', employees.name,
                                                'detailStartAt', details.start_at,
                                                'detailEndAt', details.end_at,
                                                'highQualityQuantity', details.high_quality_quantity,
                                                'lowQualityQuantity', details.low_quality_quantity
                                              )
                                            )
                                            FROM shifts_items_assignments details
                                            JOIN machines ON machines.internal_id = details.machine_id
                                            JOIN employees ON employees.internal_id = details.employee_id
                                            WHERE details.shift_item_id = pItem.id
                                          )
                                        )
                                      )
                                      FROM shifts_items pItem
                                      JOIN items ON items.internal_id = pItem.item_id
                                      WHERE pItem.shift_id = shifts.id
                                    )
                                  )
                                ) AS shifts
                              FROM daily_production dp
                              JOIN shifts ON shifts.daily_production_id = dp.id
                              GROUP BY dp.id
                              ORDER BY dp.date ASC;
                              `)
    try
    {
      const dailyProductions = query.all();
      const parsedDailyProductions = dailyProductions.map(dailyProduction => {
        dailyProduction.shifts = JSON.parse(dailyProduction.shifts);
        return dailyProduction;
      });
      const dailyProductionEntities = DailyProductionEntity.createMultipleDailyProductions(parsedDailyProductions);
      return dailyProductionEntities;
    }
    catch(error)
    {
      ErrorHandler.logError(error)
      return false;
    }
   
  }

  static getDailyProductionById(id)
  {
    if(!DailyProduction.isSetUped) DailyProduction.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare(`SELECT 
                                dp.id AS id,
                                dp.date AS date,
                                json_group_array(
                                  json_object(
                                    'shiftId', shifts.id,
                                    'shiftName', shifts.name,
                                    'shiftStartAt', shifts.start_at,
                                    'shiftEndAt', shifts.end_at,
                                    'items', (
                                      SELECT json_group_array(
                                        json_object(
                                          'itemId', items.id,
                                          'itemName', items.name,
                                          'accounts', (
                                            SELECT json_group_array(
                                              json_object(
                                                'accountId', accounts.id,
                                                'accountName', accounts.name
                                              )
                                            )
                                            FROM shifts_items_accounts pAcc
                                            JOIN accounts ON accounts.id = pAcc.account_id
                                            WHERE pAcc.shift_item_id = pItem.id
                                          ),
                                          'assignments', (
                                            SELECT json_group_array(
                                              json_object(
                                                'machineId', machines.id,
                                                'machineName', machines.name,
                                                'employeeId', employees.id,
                                                'employeeName', employees.name,
                                                'detailStartAt', details.start_at,
                                                'detailEndAt', details.end_at,
                                                'highQualityQuantity', details.high_quality_quantity,
                                                'lowQualityQuantity', details.low_quality_quantity
                                              )
                                            )
                                            FROM shifts_items_assignments details
                                            JOIN machines ON machines.internal_id = details.machine_id
                                            JOIN employees ON employees.internal_id = details.employee_id
                                            WHERE details.shift_item_id = pItem.id
                                          )
                                        )
                                      )
                                      FROM shifts_items pItem
                                      JOIN items ON items.internal_id = pItem.item_id
                                      WHERE pItem.shift_id = shifts.id
                                    )
                                  )
                                ) AS shifts
                              FROM daily_production dp
                              JOIN shifts ON shifts.daily_production_id = dp.id
                              WHERE dp.id = @id
                              ORDER BY dp.date ASC;`)
    try
    {
      const dailyProduction = query.get({id});
      if(!dailyProduction) return false;
      dailyProduction.shifts = JSON.parse(dailyProduction.shifts);

      const dailyProductionsEntity = DailyProductionEntity.createDailyProductionForReading(dailyProduction);
      return dailyProductionsEntity;
    }
    catch(error)
    {
      ErrorHandler.logError(error);
      throw error;
    }
  }

  // static getAllDailyProductionsWithPaging(page)
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   const pageSize = 3;
  //   const offset = page * pageSize
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               t.id AS id,
  //                               t.amount AS amount,
  //                               t.debtor_id AS debtor_id,
  //                               debtor.name AS debtor_name,
  //                               t.creditor_id AS creditor_id,
  //                               creditor.name AS creditor_name,
  //                               t.comment AS comment,
  //                               t.date AS date
  //                             FROM dailyProductions t
  //                             JOIN 
  //                               accounts debtor  ON t.debtor_id = debtor.id
  //                             JOIN
  //                               accounts creditor ON t.creditor_id = creditor.id
  //                             ORDER BY 
  //                               t.date ASC, t.id ASC
  //                               LIMIT @pageSize OFFSET @offset;`)
  //   const dailyProductions = query.all({
  //     pageSize: pageSize,
  //     offset: offset
  //   })
  //   const DailyProductionsEntities = DailyProductionEntity.createMultibleDailyProductionsEntities(dailyProductions)
  //   return DailyProductionsEntities
  // }

  // static getAllDailyProductionsForSpecificPeriod(startPeriod, endPeriod)
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               t.id AS id,
  //                               t.amount AS amount,
  //                               t.debtor_id AS debtor_id,
  //                               debtor.name AS debtor_name,
  //                               t.creditor_id AS creditor_id,
  //                               creditor.name AS creditor_name,
  //                               t.comment AS comment,
  //                               t.date AS date
  //                             FROM dailyProductions t
  //                             JOIN 
  //                               accounts debtor  ON t.debtor_id = debtor.id
  //                             JOIN
  //                               accounts creditor ON t.creditor_id = creditor.id
  //                             WHERE 
  //                               (
  //                                 (t.date BETWEEN @startPeriod AND @endPeriod)
  //                               OR
  //                                 (t.date BETWEEN @endPeriod AND @startPeriod)
  //                               ) 
  //                             ORDER BY 
  //                               t.date ASC, t.id ASC;`
  //                             )
  //   const dailyProductions = query.all({startPeriod, endPeriod})
  //   const dailyProductionsEntities = DailyProductionEntity.createMultibleDailyProductionsEntities(dailyProductions)
  //   return dailyProductionsEntities
  // }

  // static getAllDailyProductionsForAccountForPeriod(accountId, startPeriod, endPeriod)
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               t.id AS id,
  //                               t.amount AS amount,
  //                               t.debtor_id AS debtor_id,
  //                               debtor.name AS debtor_name,
  //                               t.creditor_id AS creditor_id,
  //                               creditor.name AS creditor_name,
  //                               t.comment AS comment,
  //                               t.date AS date
  //                             FROM dailyProductions t
  //                             JOIN 
  //                               accounts debtor  ON t.debtor_id = debtor.id
  //                             JOIN
  //                               accounts creditor ON t.creditor_id = creditor.id
  //                             WHERE 
  //                               (
  //                                 (t.date BETWEEN @startPeriod AND @endPeriod)
  //                               OR
  //                                 (t.date BETWEEN @endPeriod AND @startPeriod)
  //                               ) 
  //                             AND 
  //                                 (debtor.id = @accountId OR creditor.id = @accountId)
  //                             ORDER BY 
  //                               t.date ASC, t.id ASC;`
  //                             )
  //   const dailyProductions = query.all({accountId, startPeriod, endPeriod})
  //   const dailyProductionsEntities = DailyProductionEntity.createMultibleDailyProductionsEntities(dailyProductions)
  //   return dailyProductionsEntities
  // }
  // static getAcccountStatementForSpecificPeriod(accountId, startPeriod, endPeriod)
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               t.id AS dailyProduction_id,
  //                               (
  //                                   COALESCE((
  //                                       SELECT SUM(CASE 
  //                                                   WHEN t2.debtor_id = @accountId THEN t2.amount 
  //                                                   ELSE -t2.amount 
  //                                                 END)
  //                                       FROM dailyProductions t2
  //                                       WHERE (t2.date < t.date OR (t2.date = t.date AND t2.id <= t.id))
  //                                         AND (t2.debtor_id = @accountId OR t2.creditor_id = @accountId)
  //                                   ), 0)
  //                               ) AS balance,
  //                               t.amount AS amount,
  //                               CASE 
  //                                   WHEN t.debtor_id = @accountId THEN 1
  //                                   ELSE 0
  //                               END AS role,
  //                               t.comment AS comment,
  //                               t.date AS date
  //                           FROM dailyProductions t
  //                           WHERE 
  //                               (t.date BETWEEN @startPeriod AND @endPeriod OR t.date BETWEEN @endPeriod AND @startPeriod)
  //                               AND (t.debtor_id = @accountId OR t.creditor_id = @accountId)
  //                           ORDER BY 
  //                               t.date ASC, t.id ASC;
  //                           `
  //                             )
  //   const dailyProductions = query.all({accountId, startPeriod, endPeriod})

  //   return dailyProductions
  // }

  // static getAllDailyProductionsForAccount(accountId)
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               t.id AS id,
  //                               t.amount AS amount,
  //                               t.debtor_id AS debtor_id,
  //                               debtor.name AS debtor_name,
  //                               t.creditor_id AS creditor_id,
  //                               creditor.name AS creditor_name,
  //                               t.comment AS comment,
  //                               t.date AS date
  //                             FROM dailyProductions t
  //                             JOIN 
  //                               accounts debtor  ON t.debtor_id = debtor.id
  //                             JOIN
  //                               accounts creditor ON t.creditor_id = creditor.id
  //                             WHERE 
  //                                 debtor.id = @accountId OR creditor.id = @accountId
  //                             ORDER BY 
  //                               t.date ASC, t.id ASC;`
  //                             )
  //   const dailyProductions = query.all({accountId})
  //   const dailyProductionsEntities = DailyProductionEntity.createMultibleDailyProductionsEntities(dailyProductions)
  //   return dailyProductionsEntities
  // }

  // static getAccountBalanceAtStartPeriod(accountId, startPeriod)
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               COALESCE(
  //                                 SUM(
  //                                   CASE
  //                                     WHEN t.debtor_id = @accountId THEN t.amount
  //                                     WHEN t.creditor_id = @accountId THEN -t.amount
  //                                     ELSE 0
  //                                   END
  //                                 ), 0
  //                               ) AS balance
  //                             FROM dailyProductions t
  //                             WHERE 
  //                               t.date < @startPeriod
  //                               AND (@accountId = t.debtor_id OR @accountId = t.creditor_id);
  //                             `
  //                             )
  //   const balance = query.get({accountId, startPeriod})
  //   return balance
  // }

  // static getFirstDailyProductionDateOfAccount(accountId)
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT MIN(date) AS date
  //                             FROM dailyProductions
  //                             WHERE debtor_id = @accountId OR creditor_id = @accountId;
  //                             `
  //                             )
  //   const date = query.get({accountId})
  //   if(!date.date) return false;
  //   return date
  // }

  // static getLastDailyProductionDateOfAccount(accountId)
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT MAX(date) AS date
  //                             FROM dailyProductions
  //                             WHERE debtor_id = @accountId OR creditor_id = @accountId;
  //                             `
  //                             )
  //   const date = query.get({accountId})
  //   if(!date.date) return false; 
  //   return date
  // }

  // static getAccountDailyProductionsCount(accountId)
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp()
  //   const db = BaseDB.getDB()
  //   const accountDailyProductionsNumberQuery = db.prepare(`
  //     SELECT COUNT(DISTINCT dailyProduction_id) AS count
  //     FROM dailyProductions
  //     WHERE account_id = @id;
  //     `)
  //   const accountDailyProductionsNumberResponse = accountDailyProductionsNumberQuery.all({id: accountId});
  //   return accountDailyProductionsNumberResponse;
  // }

  static delete(id)
  {

    if(!DailyProduction.isSetUped) DailyProduction.setUp();
    const db = BaseDB.getDB();
    const deleteQuery = db.prepare('DELETE FROM daily_production WHERE id = @id')

    try
    {
      const deleteResponse = deleteQuery.run({id});
      return deleteResponse;
    }
    catch(error)
    {
      ErrorHandler.logError(error);
      throw error;
    }
  }

  // static update(dailyProductionId, dailyProductionBody)
  // {
  //   if(!DailyProduction.isSetUped) DailyProduction.setUp();
  //   if(!DailyProductionBody.isDailyProductionBody(dailyProductionBody)) throw new Error('DailyProduction.update method: expect DailyProductionBody object');
  //   const date = dailyProductionBody.getMetaData().getDate()
  //   const comment = dailyProductionBody.getMetaData().getComment()
  //   const db = BaseDB.getDB()

  //   const updateDailyProduction = db.dailyProduction((dailyProductionId, participants)=>
  //   {
  //     const updateDailyProductionHead = db.prepare('UPDATE dailyProductions_heads SET comment=@comment, date=@date WHERE id=@id');
  //     const deleteDailyProductionDetails =  db.prepare('DELETE FROM dailyProductions WHERE dailyProduction_id = @id');
  //     const createDailyProductionDetails =  db.prepare('INSERT INTO dailyProductions (dailyProduction_id, account_id, amount, role) VALUES (?, ?, ?, ?)');

  //     let updateResponse = updateDailyProductionHead.run({id: dailyProductionId, date, comment});
  //     let deleteResponse = deleteDailyProductionDetails.run({id: dailyProductionId});
  //     let insertCount = 0;
  //     for(const participant of participants)
  //     {
  //       let insertResponse = createDailyProductionDetails.run(dailyProductionId, participant.id, participant.body.amount, participant.body.role)
  //       insertCount += insertResponse.changes;
  //     }
  //     return {
  //       dailyProductionsHeads: updateResponse.changes,
  //       dailyProductionsDetails: {
  //         delete: deleteResponse.changes,
  //         create: insertCount,
  //       }
  //     }
  //   })

  //   try
  //   {
  //     let participants = dailyProductionBody.participants;
  //     if(!Array.isArray(participants)) throw new Error('DailyProduction modle -> update method: expect dailyProductionBody.participants to be an array')
  //     let response = updateDailyProduction(dailyProductionId, [...participants])
  //     return response
  //   }
  //   catch(error)
  //   {
  //     ErrorHandler.logError(error)
  //     throw error
  //   }
  // }

}