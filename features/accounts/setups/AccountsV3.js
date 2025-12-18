export class AccountsV3
{
	static createTableCommand = `CREATE TABLE IF NOT EXISTS accounts(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  financial_representative_entity_id INTEGER UNIQUE NOT NULL,
                  account_group_id INTEGER UNIQUE,
                  registration_time TEXT NOT NULL,
                  last_update_time TEXT NOT NULL,

                  FOREIGN KEY (financial_representative_entity_id) REFERENCES financial_representative_entity(id),
                  FOREIGN KEY (account_group_id) REFERENCES accounts_groups(id)
                ) STRICT`;
}