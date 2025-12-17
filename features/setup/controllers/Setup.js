import { Response } from "../../../utils/Response.js";
import { BaseDB } from "../../../models/BaseDB.js";
import { SetupV3 } from "../../../setups/SetupV3.js";
import { MigrationManager } from "../../../migrationManager/MigrationManager.js";
export class Setup
{
  static db = BaseDB.getDB();

  static dbVersion()
  {    
    return new Response(true, null, {dbVersion: BaseDB.dbVersion()});
  }


  static setup()
  {
    const setupTransaction = Setup.db.transaction(()=>
    {
      for(let command of SetupV3.setups)
      {
        Setup.db.prepare(command).run();
      }
      Setup.db.pragma('user_version = 3');
    })

    try
    {
      setupTransaction()
      return new Response(true, 'Setup successed', {setup: true});
    }
    catch(error)
    {
      return new Response(false, error.message, null);
    }
  }

  static updateDB()
  {
    const dbVersion = BaseDB.dbVersion();
    try
    {
      MigrationManager.migrate(dbVersion);
      return new Response(true, 'DB updating successed', {updateDB: true});
    }
    catch(error)
    {
      return new Response(false, error.message, null);
    }
  }

}