export class TransactionsDetailsV3
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS transactions_details(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  transaction_id INTEGER NOT NULL,
                  account_id TEXT NOT NULL,
                  amount INTEGER NOT NULL CHECK (amount BETWEEN 1 AND 1000000000000000),
                  role TEXT NOT NULL CHECK (role IN ('creditor', 'debtor')),
                  comment TEXT NOT NULL DEFAULT '' CHECK (length(comment) < 500),

                  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
                  FOREIGN KEY (account_id) REFERENCES accounts(id)                 
                ) STRICT`;
}