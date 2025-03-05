import Database from "better-sqlite3";
import {app} from 'electron'
import fs from 'fs';
import path from 'path';
class BaseDB
{
  static database;
  static isOpen = false;

  static close()
  {
    if(!BaseDB.isOpen) return;
    BaseDB.database.close()
    BaseDB.isOpen = false
  }

  static open()
  {
    if(BaseDB.isOpen) return;
    const dbPolderPath = app.getPath('userData');
    const dbPath = path.join(dbPolderPath, 'db.sqlite');
    console.log({dbPath})
    BaseDB.database = new Database(dbPath);
    BaseDB.isOpen = true
  }

  static getDB()
  {
    if(!BaseDB.isOpen) BaseDB.open()
    return BaseDB.database 
  }
}

export default BaseDB