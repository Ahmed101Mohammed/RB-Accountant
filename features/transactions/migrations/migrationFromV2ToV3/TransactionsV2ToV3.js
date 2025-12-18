import { currentTimeStamp } from "../../../../utils/currentTimeStamp.js";

export class TransactionsV2ToV3
{
  static deleteCommentColumn = `ALTER TABLE transactions_heads
    DROP COLUMN comment;`;

  static addRegistrationTimeColumn = `ALTER TABLE transactions_heads
    ADD COLUMN registration_time 
    TEXT
    CHECK (registration_time GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]');`;

  static addLastUpdateTimeColumn = `ALTER TABLE transactions_heads
    ADD COLUMN last_update_time 
    TEXT 
    CHECK (last_update_time GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]');`;

  static updateTransactionsRegistrationTimeAndLastUpdateTime = `UPDATE transactions_heads 
    SET registration_time = '${currentTimeStamp()}', 
      last_update_time = '${currentTimeStamp()}';`;
  
  static insertAllTransactionsHeadsToTransactions = `INSERT INTO transactions (id, date, registration_time, last_update_time)
    SELECT id, date, registration_time, last_update_time
    FROM transactions_heads;`

  static deleteTransactionsHeadsTable = `DROP TABLE transactions_heads;`
}