import Database from "better-sqlite3";
import {app} from 'electron'
import fs from 'fs';
import path from 'path';
import Transaction from "./Transaction.js";
import ErrorHandler from "../utils/ErrorHandler.js";
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
    if(!fs.existsSync(BaseDB.dbPath)) return BaseDB.database.pragma('user_version = 2');
    BaseDB.getDB().pragma('user_version = 0')
    let dbVersion = BaseDB.dbVersion();
    console.log({dbVersion});
    if (dbVersion === 2) return;

    try
    {
      Transaction.migrateToDBVersion2()
      BaseDB.database.pragma('user_version = 2');
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
}

export default BaseDB