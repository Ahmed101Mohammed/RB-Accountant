import BaseDB from "./BaseDB.js";
import AccountEntity from "../entities/Account.js";
import ErrorHandler from "../utils/ErrorHandler.js";
class Account
{
  static isSetUped = false
  static async setUp()
  {
    const db = BaseDB.getDB()
    const create = db.prepare(`CREATE TABLE IF NOT EXISTS accounts(
                  id TEXT PRIMARY KEY,
                  name TEXT UNIQUE
                ) STRICT`
              )
    
    await create.run()
    Account.isSetUped = true;
  }

  static async create(account)
  {
    if(!Account.isSetUped) Account.setUp()
    if(!AccountEntity.isAccount(account)) throw new Error('Account.create method: expect Account object');
    const accountId = account.getId()
    const accountName = account.getName()
    const db = BaseDB.getDB()
    const insert = db.prepare('INSERT INTO accounts (id, name) VALUES (@id, @name)');
    try
    {
      const response = await insert.run({
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

  static async getAllAccounts()
  {
    if(!Account.isSetUped) Account.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM accounts')
    const accounts = await query.all()
    const accountsEntities = AccountEntity.createMultibleAccountsEntities(accounts)
    return accountsEntities
  }

  static async getAccountByName(name)
  {
    if(!Account.isSetUped) Account.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM accounts WHERE name = @name')
    let account = await query.get({name})
    if(account) return new AccountEntity(account.id, account.name)
    return false
  }

  static async getAccountById(id)
  {
    if(!Account.isSetUped) Account.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM accounts WHERE id = @id')
    let account = await query.get({id})
    if(account) return new AccountEntity(account.id, account.name)
    return false
  }

  static async getAccountsItsNameContain(partialName) {
    if(!Account.isSetUped) Account.setUp();
    const db = BaseDB.getDB();
    
    const query = db.prepare('SELECT * FROM accounts WHERE name LIKE @name');
    const accounts = await query.all({ name: `%${partialName}%` });
    const accountsEntities = AccountEntity.createMultibleAccountsEntities(accounts)
    return accountsEntities;
  }

  static async getAccountsItsIdContain(partialId) {
    if(!Account.isSetUped) Account.setUp();
    const db = BaseDB.getDB();
    
    const query = db.prepare('SELECT * FROM accounts WHERE id LIKE @id');
    const accounts = await query.all({ id: `%${partialId}%` });
    const accountsEntities = AccountEntity.createMultibleAccountsEntities(accounts)
    return accountsEntities;
  }

  static async delete(id)
  {
    if(!Account.isSetUped) Account.setUp();
    const db = BaseDB.getDB();
    const query = db.prepare('DELETE FROM accounts WHERE id = @id');
    const deleteResponse = await query.run({
      id
    })
    return deleteResponse
  }

  static async update(account)
  {
    if(!Account.isSetUped) Account.setUp();
    if(!AccountEntity.isAccount(account)) throw new Error('Account.update method: expect Account object');
    const accountId = account.getId()
    const accountName = account.getName()
    const db = BaseDB.getDB();
    const query = db.prepare('UPDATE accounts SET name = @newName WHERE id = @id');
    try
    {
      await query.run({
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

}

export default Account