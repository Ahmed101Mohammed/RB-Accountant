import {currentTimeStamp} from "../../../../utils/currentTimeStamp.js"
export class AccountsV2ToV3
{
  static renameOldTable = `ALTER TABLE accounts
                            RENAME TO old_accounts;`;
  
  static insertOldAccountsToFinancialRepresentativeEntity = `INSERT INTO financial_representative_entity (entity_id, name, registration_time, last_update_time)
                SELECT id, name, '${currentTimeStamp()}', '${currentTimeStamp()}' FROM old_accounts;`;

  static deleteOldTable = `DROP TABLE old_accounts;`;

  static insertFinancialRepresentativeEntitiesToAccounts = `INSERT INTO accounts (financial_representative_entity_id, registration_time, last_update_time)
                SELECT id, '${currentTimeStamp()}', '${currentTimeStamp()}' FROM financial_representative_entity;`;

}