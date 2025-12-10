import { MigrationV1ToV2 } from "./MigrationV1ToV2.js";
import { MigrationV2ToV3 } from "./MigrationV2ToV3.js";
import BaseDB from "../models/BaseDB.js";

export class MigrationManager
{
  static migrations = [MigrationV1ToV2, MigrationV2ToV3]
  static db = BaseDB.getDB();

  static migrate(dbVersion = null)
  {
    if(!Number.isInteger(dbVersion)) return;
    const migrate = MigrationManager.db.transaction(() => 
      {
        for (let stepIndex = dbVersion-1; stepIndex < MigrationManager.migrations.length; stepIndex++)
        {
          let migrationStep = MigrationManager.migrations[stepIndex];
          for(let subStep of migrationStep.migrations)
          {
            subStep.run();
          }
        }
      })
    try
    {
      migrate();
    }
    catch(error)
    {
      console.error(`Migration Error: ${error.message}`);
      throw error;
    }
  }
}