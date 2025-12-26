import Database from "better-sqlite3";
import {app} from 'electron'
import fs from 'fs';
import path from 'path';

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

  static dbVersion()
  {
    const version = BaseDB.getDB().pragma('user_version', {simple: true});
    return version === 0 ? 1 : version;
  }
}