export class TransactionsDetailsV2
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS transactions(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  transaction_id INTEGER NOT NULL,
                  account_id TEXT NOT NULL,
                  amount REAL NOT NULL,
                  role INTEGER NOT NULL,

                  FOREIGN KEY (transaction_id) REFERENCES transactions_heads(id) ON DELETE CASCADE,
                  FOREIGN KEY (account_id) REFERENCES accounts(id)
                ) STRICT`;
}