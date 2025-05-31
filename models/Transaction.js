import BaseDB from "./BaseDB.js";
import TransactionDBEntity from "../entities/TransactionBody.js";
import TransactionEntity from "../entities/Transaction.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import TransactionBody from "../entities/transaction/TransactionBody.js";
class Transaction
{
  static isSetUped = false
  static setUp()
  {
    try
    {
      BaseDB.updateDB()
      Transaction.createTransactionsHeadsTable()
      Transaction.createTransactionsTable()
      Transaction.isSetUped = true;
    }
    catch(error)
    {
      ErrorHandler.logError(error);
      Transaction.isSetUped = false;
    }
  }

  static createTransactionsHeadsTable()
  {
    const db = BaseDB.getDB()
    const createTransactionsHeads = db.prepare(`CREATE TABLE IF NOT EXISTS transactions_heads(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  comment TEXT,
                  date TEXT NOT NULL
                ) STRICT`
              )
      createTransactionsHeads.run()
  }

  static createTransactionsTable()
  {
    const db = BaseDB.getDB()
    const createTransactions = db.prepare(`CREATE TABLE IF NOT EXISTS transactions(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  transaction_id INTEGER NOT NULL,
                  account_id TEXT NOT NULL,
                  amount REAL NOT NULL,
                  role INTEGER NOT NULL
                ) STRICT`)
      createTransactions.run()
  }

  static migrateToDBVersion2()
  {
    console.log('Start migration from data base v0 to v2')
    const db = BaseDB.getDB()

    const fullTransfareDataFromOldTransactionToNewTables = db.transaction(() => 
    {
      console.log('Transfare data from the old transactions table to new one [transactions_heads, transactions]')
      
      const transfareDataFromOldTrsToTrsHeadsTableQuery = db.prepare(`
            INSERT INTO transactions_heads (id, comment, date)
            SELECT id, comment, date FROM old_transactions;
        `)
      const transfareDataFromOldTrsToNewTrsTableQuery =  db.prepare(`
              INSERT INTO transactions (transaction_id, account_id, amount, role)
              SELECT id, debtor_id, amount, 0 FROM old_transactions
              UNION ALL
              SELECT id, creditor_id, amount, 1 FROM old_transactions;
          `)
        
      transfareDataFromOldTrsToTrsHeadsTableQuery.run();
      transfareDataFromOldTrsToNewTrsTableQuery.run();
    });

    const deleteAnyLeakagedTransactions = db.transaction(()=>
    {
      console.log('Delete any transactions or transactions_heads records has no account')
      const deleteOrphanedTransactionsQuery = db.prepare(`
        DELETE FROM transactions
        WHERE account_id NOT IN (SELECT id FROM accounts);
      `);

      const deleteIncompleteTransactionsQuery = db.prepare(`
        DELETE FROM transactions
        WHERE transaction_id IN (
            SELECT transaction_id 
            FROM transactions 
            GROUP BY transaction_id 
            HAVING COUNT(DISTINCT role) = 1
        );
      `);

      const deleteOrphanedTransactionsHeadsQuery = db.prepare(`
        DELETE FROM transactions_heads
        WHERE id NOT IN (SELECT transaction_id FROM transactions);
      `);

      deleteOrphanedTransactionsQuery.run();
      deleteIncompleteTransactionsQuery.run();
      deleteOrphanedTransactionsHeadsQuery.run();
    })
    const checkTable = db.prepare(`
        SELECT COUNT(*) as count 
        FROM pragma_table_info('transactions') 
        WHERE name IN ('debtor_id', 'creditor_id', 'comment', 'date')
    `).get();

    // Reaname old transactions table from last version
    if(checkTable.count === 4)
    {
      const old_transactions = db.prepare(`ALTER TABLE transactions RENAME TO old_transactions`);
      old_transactions.run()
    }

    // Create new version db tables if not exist
    Transaction.createTransactionsHeadsTable()
    Transaction.createTransactionsTable()

    // Transfare the data from the old structure to the new one if every table ready.
    const allTablesExists = BaseDB.tableExists('old_transactions') 
      && BaseDB.tableExists('transactions_heads') 
      && BaseDB.tableExists('transactions');
    const allNewTablesEmpty = BaseDB.isTableEmpty('transactions_heads') && BaseDB.isTableEmpty('transactions')
    if(allTablesExists && allNewTablesEmpty) fullTransfareDataFromOldTransactionToNewTables()
    
    // Delete the old transactions table if it exist
    db.prepare('DROP TABLE IF EXISTS old_transactions').run();

    // Delete any leakage in the db from last version bug
    const newTablesExists = BaseDB.tableExists('transactions_heads') && BaseDB.tableExists('transactions');
    if(newTablesExists) deleteAnyLeakagedTransactions()
  }

  getCreateTransactionsQueries(transactionParticipants)
  {
    // SQLite accept to insert 999 row in one at maximum.
    // This function will return 2D array.
    // The nested arrays contain 2 values: [query, listOfvalues]
    /*
      Example of code to insert multible values:
        const stmt = db.prepare(`
          INSERT INTO transactions_heads (date, comment) VALUES 
            (?, ?), (?, ?), (?, ?)
        `);

        stmt.run(
          '2025-04-18', 'First transaction',
          '2025-04-19', 'Second transaction',
          '2025-04-20', 'Third transaction'
        );
    */
    let init = `INSERT INTO transactions (transaction_id, account_id, amount, role) VALUES`
  }

  static create(transactionBody)
  {
    if(!Transaction.isSetUped) Transaction.setUp()
    if(!TransactionBody.isTransactionBody(transactionBody)) throw new Error('Transaction.create method: expect TransactionBody object');
    const date = transactionBody.getMetaData().getDate()
    const comment = transactionBody.getMetaData().getComment()
    const db = BaseDB.getDB()
    const createTransactionHeader = db.prepare('INSERT INTO transactions_heads (date, comment) VALUES (@date, @comment)')
    const createTransactions =  db.prepare('INSERT INTO transactions (transaction_id, account_id, amount, role) VALUES (?, ?, ?, ?)')
    try
    {
      const response = createTransactionHeader.run({
       date, comment
      })
      const transactionHeadId = response.lastInsertRowid;

      return response
    }
    catch(error)
    {
      ErrorHandler.logError(error)
      throw error
    }
  }

  static getAllTransactions()
  {
    if(!Transaction.isSetUped) Transaction.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare(`SELECT 
                                th.id AS id,
                                th.date AS date,
                                th.comment AS comment,
                                t.amount AS amount,
                                t.account_id AS account_id,
                                t.role AS role,
                                acc.name AS account_name,
                                t.id AS detail_id
                              FROM transactions_heads th
                              JOIN 
                                transactions t ON t.transaction_id = th.id
                              JOIN 
                                accounts acc  ON acc.id = t.account_id
                              ORDER BY 
                                th.date ASC, th.id ASC, t.role ASC;`)
    // [{id, date, comment, amount, account_id, account_name, role, detail_id},...]
    try
    {
      const transactions = query.all() 
      const TransactionsEntities = TransactionEntity.createMultibleTransactionsEntities(transactions)
      console.log({transactions})
      return TransactionsEntities
    }
    catch(error)
    {
      ErrorHandler.logError(error)
      return false;
    }
   
  }

  static getTransactionById(id)
  {
    if(!Transaction.isSetUped) Transaction.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare(`SELECT 
                                t.id AS id,
                                t.amount AS amount,
                                t.debtor_id AS debtor_id,
                                debtor.name AS debtor_name,
                                t.creditor_id AS creditor_id,
                                creditor.name AS creditor_name,
                                t.comment AS comment,
                                t.date AS date
                              FROM transactions t
                              LEFT JOIN 
                                accounts debtor  ON t.debtor_id = debtor.id
                              LEFT JOIN
                                accounts creditor ON t.creditor_id = creditor.id
                              WHERE t.id = @id
                              ORDER BY 
                                t.date ASC, t.id ASC;`)
    const transaction = query.get({id})
    if(!transaction) return false
    const TransactionsEntities = TransactionEntity.createMultibleTransactionsEntities([transaction])
    return TransactionsEntities
  }

  static getAllTransactionsWithPaging(page)
  {
    if(!Transaction.isSetUped) Transaction.setUp()
    const pageSize = 3;
    const offset = page * pageSize
    const db = BaseDB.getDB()
    const query = db.prepare(`SELECT 
                                t.id AS id,
                                t.amount AS amount,
                                t.debtor_id AS debtor_id,
                                debtor.name AS debtor_name,
                                t.creditor_id AS creditor_id,
                                creditor.name AS creditor_name,
                                t.comment AS comment,
                                t.date AS date
                              FROM transactions t
                              JOIN 
                                accounts debtor  ON t.debtor_id = debtor.id
                              JOIN
                                accounts creditor ON t.creditor_id = creditor.id
                              ORDER BY 
                                t.date ASC, t.id ASC
                                LIMIT @pageSize OFFSET @offset;`)
    const transactions = query.all({
      pageSize: pageSize,
      offset: offset
    })
    const TransactionsEntities = TransactionEntity.createMultibleTransactionsEntities(transactions)
    return TransactionsEntities
  }

  static getAllTransactionsForSpecificPeriod(startPeriod, endPeriod)
  {
    if(!Transaction.isSetUped) Transaction.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare(`SELECT 
                                t.id AS id,
                                t.amount AS amount,
                                t.debtor_id AS debtor_id,
                                debtor.name AS debtor_name,
                                t.creditor_id AS creditor_id,
                                creditor.name AS creditor_name,
                                t.comment AS comment,
                                t.date AS date
                              FROM transactions t
                              JOIN 
                                accounts debtor  ON t.debtor_id = debtor.id
                              JOIN
                                accounts creditor ON t.creditor_id = creditor.id
                              WHERE 
                                (
                                  (t.date BETWEEN @startPeriod AND @endPeriod)
                                OR
                                  (t.date BETWEEN @endPeriod AND @startPeriod)
                                ) 
                              ORDER BY 
                                t.date ASC, t.id ASC;`
                              )
    const transactions = query.all({startPeriod, endPeriod})
    const transactionsEntities = TransactionEntity.createMultibleTransactionsEntities(transactions)
    return transactionsEntities
  }

  static getAllTransactionsForAccountForPeriod(accountId, startPeriod, endPeriod)
  {
    if(!Transaction.isSetUped) Transaction.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare(`SELECT 
                                t.id AS id,
                                t.amount AS amount,
                                t.debtor_id AS debtor_id,
                                debtor.name AS debtor_name,
                                t.creditor_id AS creditor_id,
                                creditor.name AS creditor_name,
                                t.comment AS comment,
                                t.date AS date
                              FROM transactions t
                              JOIN 
                                accounts debtor  ON t.debtor_id = debtor.id
                              JOIN
                                accounts creditor ON t.creditor_id = creditor.id
                              WHERE 
                                (
                                  (t.date BETWEEN @startPeriod AND @endPeriod)
                                OR
                                  (t.date BETWEEN @endPeriod AND @startPeriod)
                                ) 
                              AND 
                                  (debtor.id = @accountId OR creditor.id = @accountId)
                              ORDER BY 
                                t.date ASC, t.id ASC;`
                              )
    const transactions = query.all({accountId, startPeriod, endPeriod})
    const transactionsEntities = TransactionEntity.createMultibleTransactionsEntities(transactions)
    return transactionsEntities
  }
  static getAcccountStatementForSpecificPeriod(accountId, startPeriod, endPeriod)
  {
    if(!Transaction.isSetUped) Transaction.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare(`SELECT 
                                t.id AS transaction_id,
                                (
                                    COALESCE((
                                        SELECT SUM(CASE 
                                                    WHEN t2.debtor_id = @accountId THEN t2.amount 
                                                    ELSE -t2.amount 
                                                  END)
                                        FROM transactions t2
                                        WHERE (t2.date < t.date OR (t2.date = t.date AND t2.id <= t.id))
                                          AND (t2.debtor_id = @accountId OR t2.creditor_id = @accountId)
                                    ), 0)
                                ) AS balance,
                                t.amount AS amount,
                                CASE 
                                    WHEN t.debtor_id = @accountId THEN 1
                                    ELSE 0
                                END AS role,
                                t.comment AS comment,
                                t.date AS date
                            FROM transactions t
                            WHERE 
                                (t.date BETWEEN @startPeriod AND @endPeriod OR t.date BETWEEN @endPeriod AND @startPeriod)
                                AND (t.debtor_id = @accountId OR t.creditor_id = @accountId)
                            ORDER BY 
                                t.date ASC, t.id ASC;
                            `
                              )
    const transactions = query.all({accountId, startPeriod, endPeriod})

    return transactions
  }

  static getAllTransactionsForAccount(accountId)
  {
    if(!Transaction.isSetUped) Transaction.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare(`SELECT 
                                t.id AS id,
                                t.amount AS amount,
                                t.debtor_id AS debtor_id,
                                debtor.name AS debtor_name,
                                t.creditor_id AS creditor_id,
                                creditor.name AS creditor_name,
                                t.comment AS comment,
                                t.date AS date
                              FROM transactions t
                              JOIN 
                                accounts debtor  ON t.debtor_id = debtor.id
                              JOIN
                                accounts creditor ON t.creditor_id = creditor.id
                              WHERE 
                                  debtor.id = @accountId OR creditor.id = @accountId
                              ORDER BY 
                                t.date ASC, t.id ASC;`
                              )
    const transactions = query.all({accountId})
    const transactionsEntities = TransactionEntity.createMultibleTransactionsEntities(transactions)
    return transactionsEntities
  }

  static getAccountBalanceAtStartPeriod(accountId, startPeriod)
  {
    if(!Transaction.isSetUped) Transaction.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare(`SELECT 
                                COALESCE(
                                  SUM(
                                    CASE
                                      WHEN t.debtor_id = @accountId THEN t.amount
                                      WHEN t.creditor_id = @accountId THEN -t.amount
                                      ELSE 0
                                    END
                                  ), 0
                                ) AS balance
                              FROM transactions t
                              WHERE 
                                t.date < @startPeriod
                                AND (@accountId = t.debtor_id OR @accountId = t.creditor_id);
                              `
                              )
    const balance = query.get({accountId, startPeriod})
    return balance
  }

  static getFirstTransactionDateOfAccount(accountId)
  {
    if(!Transaction.isSetUped) Transaction.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare(`SELECT MIN(date) AS date
                              FROM transactions
                              WHERE debtor_id = @accountId OR creditor_id = @accountId;
                              `
                              )
    const date = query.get({accountId})
    if(!date.date) return false;
    return date
  }

  static getLastTransactionDateOfAccount(accountId)
  {
    if(!Transaction.isSetUped) Transaction.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare(`SELECT MAX(date) AS date
                              FROM transactions
                              WHERE debtor_id = @accountId OR creditor_id = @accountId;
                              `
                              )
    const date = query.get({accountId})
    if(!date.date) return false; 
    return date
  }

  static delete(id)
  {
    if(!Transaction.isSetUped) Transaction.setUp();
    const db = BaseDB.getDB();
    const query = db.prepare('DELETE FROM transactions WHERE id = @id');
    const deleteResponse = query.run({
      id
    })
    return deleteResponse
  }

  static update(transactionId, transaction)
  {
    if(!Transaction.isSetUped) Transaction.setUp();
    if(!TransactionDBEntity.isTransactionDBEntity(transaction)) throw new Error('Transaction.update method: expect Transaction object');
    const transactionAmount = transaction.getAmount()
    const transactionDebtorId = transaction.getDebtorId()
    const transactionCreditorId = transaction.getCreditorId()
    const transactionComment = transaction.getComment()
    const transactionDate = transaction.getDate()
    const db = BaseDB.getDB();
    const query = db.prepare('UPDATE transactions SET amount=@amount, debtor_id=@debtor_id, creditor_id=@creditor_id, comment=@comment, date=@date WHERE id=@id');
    try
    {
      const response = query.run({
        id: transactionId,
        amount: transactionAmount,
        debtor_id: transactionDebtorId,
        creditor_id: transactionCreditorId,
        comment: transactionComment,
        date: transactionDate
      })
      return response
    }
    catch(error)
    {
      ErrorHandler.logError(error)
      return error
    }
  }

}

export default Transaction