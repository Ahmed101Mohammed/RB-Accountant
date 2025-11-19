import BaseDB from "../../../../models/BaseDB.js"

export class TransactionsDetailsV1ToV2
{
  static db = BaseDB.getDB();
  static createTransactionsDetailsTable = this.db.prepare(`CREATE TABLE IF NOT EXISTS transactions(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  transaction_id INTEGER NOT NULL,
                  account_id TEXT NOT NULL,
                  amount REAL NOT NULL,
                  role INTEGER NOT NULL,

                  FOREIGN KEY (transaction_id) REFERENCES transactions_heads(id) ON DELETE CASCADE,
                  FOREIGN KEY (account_id) REFERENCES accounts(id)
                ) STRICT`
                );

  static insertDataFromTransactionsHeadsTable = this.db.prepare(`INSERT INTO transactions (transaction_id, account_id, amount, role)
                SELECT id, debtor_id, amount, 0 FROM old_transactions
                UNION ALL
                SELECT id, creditor_id, amount, 1 FROM old_transactions;`
              );

  static deleteTransactionsOfDeletedAccounts = this.db.prepare(`DELETE FROM transactions
        WHERE account_id NOT IN (SELECT id FROM accounts);`
      );

  static deleteIncompleteTransactions = this.db.prepare(`DELETE FROM transactions
        WHERE transaction_id IN (
            SELECT transaction_id 
            FROM transactions 
            GROUP BY transaction_id 
            HAVING COUNT(DISTINCT role) = 1
        );`
      );
}