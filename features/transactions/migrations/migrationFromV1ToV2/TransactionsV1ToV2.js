import BaseDB from "../../../../models/BaseDB.js"

export class TransactionsV1ToV2
{
  static db = BaseDB.getDB();
  static changeTableName = this.db.prepare(`ALTER TABLE transactions
                            RENAME TO transactions_heads;`);

  static deleteAmountColumn = this.db.prepare(`ALTER TABLE transactions_heads
    DROP COLUMN amount;`);

  static deleteDebtorIdColumn = this.db.prepare(`ALTER TABLE transactions_heads
    DROP COLUMN debtor_id;`);

  static deleteCreditorIdColumn = this.db.prepare(`ALTER TABLE transactions_heads
    DROP COLUMN creditor_id;`);

  static deleteOrphanedTransactionsHeads = db.prepare(`
        DELETE FROM transactions_heads
        WHERE id NOT IN (SELECT transaction_id FROM transactions);
      `);
}