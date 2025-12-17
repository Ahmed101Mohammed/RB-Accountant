import Database from "better-sqlite3";
import {app} from 'electron'
import fs from 'fs';
import path from 'path';

import Transaction from "./Transaction.js";
import {ErrorHandler} from "../utils/ErrorHandler.js";

export class BaseDB
{
  static database;
  static isOpen = false;
  static dbFolderPath = app.getPath('userData');
  static dbPath = path.join(BaseDB.dbFolderPath, 'db.sqlite');
  
  static isDBExist()
  {
    return fs.existsSync(BaseDB.dbPath);
  }

  static close()
  {
    if(!BaseDB.isOpen) return;
    BaseDB.database.close()
    BaseDB.isOpen = false
  }

  static open()
  {
    if(BaseDB.isOpen) return; 
    if(!BaseDB.isDBExist())
    {
      BaseDB.database = new Database(BaseDB.dbPath);
      BaseDB.database.pragma('user_version = -1');
    }
    else
    {
      BaseDB.database = new Database(BaseDB.dbPath);
    }
    
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
    const version = BaseDB.getDB().pragma('user_version', {simple: true});
    return version === 0 ? 1 : version;
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