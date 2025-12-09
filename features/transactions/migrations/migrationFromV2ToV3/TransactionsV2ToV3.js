import BaseDB from "../../../../models/BaseDB.js";

export class TransactionsV2ToV3
{
  static db = BaseDB.getDB();
  static changeTableName = this.db.prepare(`ALTER TABLE transactions_heads
                            RENAME TO transactions;`);

  static deleteCommentColumn = this.db.prepare(`ALTER TABLE transactions
    DROP COLUMN comment;`);

  static addRegistrationTimeColumn = this.db.prepare(`ALTER TABLE transactions
    ADD COLUMN registration_time 
    TEXT 
    NOT NULL 
    DEFAULT CURRENT_TIMESTAMP
    CHECK (registration_time GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]');`);

  static addLastUpdateTimeColumn = this.db.prepare(`ALTER TABLE transactions
    ADD COLUMN last_update_time 
    TEXT 
    NOT NULL 
    DEFAULT CURRENT_TIMESTAMP 
    CHECK (last_update_time GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]');`);
}