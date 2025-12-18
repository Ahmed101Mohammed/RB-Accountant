export class TransactionsV1ToV2
{
  static changeTableName = `ALTER TABLE transactions
                            RENAME TO transactions_heads;`;

  static deleteAmountColumn = `ALTER TABLE transactions_heads
    DROP COLUMN amount;`;

  static deleteDebtorIdColumn = `ALTER TABLE transactions_heads
    DROP COLUMN debtor_id;`;

  static deleteCreditorIdColumn = `ALTER TABLE transactions_heads
    DROP COLUMN creditor_id;`;

  static deleteOrphanedTransactionsHeads = `
        DELETE FROM transactions_heads
        WHERE id NOT IN (SELECT transaction_id FROM transactions);
      `;
}