import BaseDB from "./BaseDB.js";
import AccountEntity from "../entities/Account.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Transaction from "./Transaction.js";

export class Accounts
{
  static db = BaseDB.getDB();
	static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS accounts(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  financial_representative_entity_id INTEGER UNIQUE NOT NULL,
                  account_group_id INTEGER UNIQUE,
                  registration_time TEXT NOT NULL,
                  last_update_time TEXT NOT NULL,

                  FOREIGN KEY (financial_representative_entity_id) REFERENCES financial_representative_entity(id),
                  FOREIGN KEY (account_group_id) REFERENCES accounts_groups(id)
                ) STRICT`
              );
  static isSetUped = false
  static setUp()
  {
    BaseDB.updateDB()
    const db = BaseDB.getDB()
    const create = db.prepare(`CREATE TABLE IF NOT EXISTS accounts(
                  id TEXT PRIMARY KEY,
                  name TEXT UNIQUE
                ) STRICT`
              )
    create.run()
    Account.isSetUped = true;
  }

  static create(account)
  {
    if(!Account.isSetUped) Account.setUp()
    if(!AccountEntity.isAccount(account)) throw new Error('Account.create method: expect Account object');
    const accountId = account.getId()
    const accountName = account.getName()
    const db = BaseDB.getDB()
    const insert = db.prepare('INSERT INTO accounts (id, name) VALUES (@id, @name)');
    try
    {
      const response = insert.run({
        id: accountId,
        name: accountName
      })

      return response
    }
    catch(error)
    {
      ErrorHandler.logError(error)
      throw error
    }
  }

  static getAllAccounts()
  {
    if(!Account.isSetUped) Account.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM accounts ORDER BY id ASC;')
    const accounts = query.all()
    const accountsEntities = AccountEntity.createMultibleAccountsEntities(accounts)
    return accountsEntities
  }

  static getAccountByName(name)
  {
    if(!Account.isSetUped) Account.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM accounts WHERE name = @name')
    let account = query.get({name})
    if(account) return new AccountEntity(account.id, account.name)
    return false
  }

  static getAccountById(id)
  {
    if(!Account.isSetUped) Account.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM accounts WHERE id = @id')
    let account = query.get({id})
    if(account) return new AccountEntity(account.id, account.name)
    return false
  }

  static getAccountsItsNameContain(partialName) {
    if(!Account.isSetUped) Account.setUp();
    const db = BaseDB.getDB();
    
    const query = db.prepare('SELECT * FROM accounts WHERE name LIKE @name');
    const accounts = query.all({ name: `%${partialName}%` });
    const accountsEntities = AccountEntity.createMultibleAccountsEntities(accounts)
    return accountsEntities;
  }

  static getAccountsItsIdContain(partialId) {
    if(!Account.isSetUped) Account.setUp();
    const db = BaseDB.getDB();
    
    const query = db.prepare('SELECT * FROM accounts WHERE id LIKE @id');
    const accounts = query.all({ id: `%${partialId}%` });
    const accountsEntities = AccountEntity.createMultibleAccountsEntities(accounts)
    return accountsEntities;
  }

  static delete(id)
  {
    if(!Account.isSetUped) Account.setUp();
    if(!Transaction.isSetUped) Transaction.setUp();
    const db = BaseDB.getDB();

    const deleteAccount = db.prepare('DELETE FROM accounts WHERE id = @id');
    return deleteAccount.run({id});
  }

  static update(account)
  {
    if(!Account.isSetUped) Account.setUp();
    if(!AccountEntity.isAccount(account)) throw new Error('Account.update method: expect Account object');
    const accountId = account.getId()
    const accountName = account.getName()
    const db = BaseDB.getDB();
    const query = db.prepare('UPDATE accounts SET name = @newName WHERE id = @id');
    try
    {
      query.run({
        id: accountId,
        newName: accountName
      })
    }
    catch(error)
    {
      ErrorHandler.logError(error)
      return error
    }
  }

  static getMissingIds(ids) {
    if (!ids.length) return [];

    const db = BaseDB.getDB();

    // Create the VALUES list: (?, ?), (?, ?), ...
    const valuesClause = ids.map(() => '(?)').join(', ');
    const query = `
      WITH input_ids(id) AS (
        VALUES ${valuesClause}
      )
      SELECT input_ids.id
      FROM input_ids
      LEFT JOIN accounts ON input_ids.id = accounts.id
      WHERE accounts.id IS NULL;
    `;

    const stmt = db.prepare(query);
    const result = stmt.all(...ids);

    return result.map(row => row.id);
  }



}