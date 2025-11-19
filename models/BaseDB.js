import Database from "better-sqlite3";
import {app} from 'electron'
import fs from 'fs';
import path from 'path';

import Transaction from "./Transaction.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// models
import { FinancialRepresentativeEntity } from "./FinancialRepresentativeEntity.js";
import { AccountsGroups } from "../features/accountsGroups/models/AccountsGroups.js";
import { Accounts } from "../features/accounts/models/Accounts.js";
import { Clients } from "../features/clients/models/Clients.js";
import { Shifts } from "../features/shifts/models/Shifts.js";
import { ShiftsDetails } from "../features/shifts/models/ShiftsDetails.js";
import { Employees } from "../features/employees/models/Employees.js";
import { PermanentEmployees } from "../features/employees/models/PermanentEmployees.js";
import { CasualEmployees } from "../features/employees/models/CasualEmployees.js";
import { Technicians } from "../features/technicians/models/Technicians.js";
import { ProductRepresentativeEntity } from "./ProductRepresentativeEntity.js";
import { RawMaterialTypes } from "../features/rawMaterialTypes/models/RawMaterialTypes.js";
import { RawMaterialShapes } from "../features/rawMaterialShapes/models/RawMaterialShapes.js";
import { RawMaterials } from "../features/rawMaterials/models/RawMaterial.js";
import { Products } from "../features/products/models/Products.js";
import { MachineTypes } from "../features/machineTypes/models/MachineTypes.js";
import { Machines } from "../features/machines/models/Machines.js";
import { MachinesFaults } from "../features/machinesFaults/models/MachinesFaults.js";
import { ProductionRates } from "../features/productionRates/models/ProductionRates.js";
import { ShiftsProduction } from "../features/shiftsProductions/models/ShiftsProduction.js";
import { ShiftsProductionDetails } from "../features/shiftsProductions/models/ShiftsProductionDetails.js";
import { NonProductivePeriods } from "../features/nonProductivePeriods/models/NonProductivePeriods.js";
import { NonProductiveDurations } from "../features/nonProductivePeriods/models/NonProductiveDurations.js";
import { NonProductiveTimeBlocks } from "../features/nonProductivePeriods/models/NonProductiveTimeBlocks.js";
import { Transactions } from "../features/transactions/models/Transactions.js";
import { TransactionsDetails } from "../features/transactions/models/TransactionsDetails.js";

class BaseDB
{
  static database;
  static isOpen = false;
  static dbFolderPath = app.getPath('userData');
  static dbPath = path.join(BaseDB.dbFolderPath, 'db.sqlite');
  
  static close()
  {
    if(!BaseDB.isOpen) return;
    BaseDB.database.close()
    BaseDB.isOpen = false
  }

  static open()
  {
    if(BaseDB.isOpen) return; 
    BaseDB.database = new Database(BaseDB.dbPath);
    BaseDB.isOpen = true
  }

  static getDB()
  {
    if(!BaseDB.isOpen) BaseDB.open()
    return BaseDB.database 
  }

  static updateDB()
  {
		console.log({ db: BaseDB.dbFolderPath });
		// Start from here and sure that database evaluated before tryint to read it's pragma
    if(!fs.existsSync(BaseDB.dbPath))
    {
      if(!BaseDB.database) BaseDB.open();
      BaseDB.database.pragma('user_version = 2');
      db.exec('PRAGMA foreign_keys = ON');
      console.log(`DB updated to version: ${BaseDB.dbVersion()}`);
      return;
    }
    let dbVersion = BaseDB.dbVersion();
    console.log({dbVersion});
    if (dbVersion === 2) return;

    try
    {
      Transaction.migrateToDBVersion2()
      BaseDB.database.pragma('user_version = 2');
      db.exec('PRAGMA foreign_keys = ON');
      console.log(`DB updated to version: ${BaseDB.dbVersion()}`);
      return;
    } 
    catch(error)
    {
      ErrorHandler.logError(error)
    }
  }

  static dbVersion()
  {
    return BaseDB.getDB().pragma('user_version', {simple: true});
  }

  static tableExists(tableName) {
    const row = BaseDB.getDB().prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(tableName);
    return !!row;
  } 
	
  static isTableEmpty(tableName) {
    const row = BaseDB.getDB().prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get();
    return row.count === 0;
  }

  static setup()
  {
    // Make the setup in one transision.
    const TABLES = [FinancialRepresentativeEntity, AccountsGroups, Accounts, Clients, Shifts, ShiftsDetails, Employees, PermanentEmployees, CasualEmployees,
      Technicians, ProductRepresentativeEntity, RawMaterialTypes, RawMaterialShapes, RawMaterials, Products, MachineTypes, Machines, MachinesFaults,
      ProductionRates, ShiftsProduction, ShiftsProductionDetails, NonProductivePeriods, NonProductiveDurations, NonProductiveTimeBlocks, Transactions,
      TransactionsDetails
    ]

    BaseDB.database.transaction(()=>
    {
      for(let table of TABLES)
      {
        table.createTableCommand.run();
      }
    })
  }
}

export default BaseDB