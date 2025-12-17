export class TransactionsV2
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS transactions_heads(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  comment TEXT,
                  date TEXT NOT NULL
                ) STRICT`;
}