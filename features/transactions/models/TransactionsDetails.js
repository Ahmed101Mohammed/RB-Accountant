import { BaseDB } from "../../../models/BaseDB.js";
// 2 Components commented here are probaply outdated ones (I mean that may I develkp other entities and comment these files internally)
//import TransactionDBEntity from "../entities/TransactionBody.js";
// import { Transaction as TransactionEntity} from "../entities/transaction/Transaction.js"

// import ErrorHandler from "../utils/ErrorHandler.js";
// import {TransactionBody} from "../entities/transaction/TransactionBody.js";

export class TransactionsDetails
{
  
  // static isSetUped = false
  // static setUp()
  // {
  //   try
  //   {
  //     BaseDB.updateDB()
  //     Transaction.createTransactionsHeadsTable()
  //     Transaction.createTransactionsTable()
  //     Transaction.isSetUped = true;
  //   }
  //   catch(error)
  //   {
  //     ErrorHandler.logError(error);
  //     Transaction.isSetUped = false;
  //   }
  // }

  // static createTransactionsHeadsTable()
  // {
  //   const db = BaseDB.getDB()
  //   const createTransactionsHeads = db.prepare(`CREATE TABLE IF NOT EXISTS transactions_heads(
  //                 id INTEGER PRIMARY KEY AUTOINCREMENT,
  //                 comment TEXT,
  //                 date TEXT NOT NULL
  //               ) STRICT`
  //             )
  //     createTransactionsHeads.run()
  // }

  // static createTransactionsTable()
  // {
  //   const db = BaseDB.getDB()
  //   const createTransactions = db.prepare(`CREATE TABLE IF NOT EXISTS transactions(
  //                 id INTEGER PRIMARY KEY AUTOINCREMENT,
  //                 transaction_id INTEGER NOT NULL,
  //                 account_id TEXT NOT NULL,
  //                 amount REAL NOT NULL,
  //                 role INTEGER NOT NULL,

  //                 FOREIGN KEY (transaction_id) REFERENCES transactions_heads(id) ON DELETE CASCADE,
  //                 FOREIGN KEY (account_id) REFERENCES accounts(id)
  //               ) STRICT`)
  //     createTransactions.run()
  // }

  // static migrateToDBVersion2()
  // {
  //   console.log('Start migration from data base v0 to v2')
  //   const db = BaseDB.getDB()

  //   const fullTransfareDataFromOldTransactionToNewTables = db.transaction(() => 
  //   {
  //     console.log('Transfare data from the old transactions table to new one [transactions_heads, transactions]')
      
  //     const transfareDataFromOldTrsToTrsHeadsTableQuery = db.prepare(`
  //           INSERT INTO transactions_heads (id, comment, date)
  //           SELECT id, comment, date FROM old_transactions;
  //       `)
  //     const transfareDataFromOldTrsToNewTrsTableQuery =  db.prepare(`
  //             INSERT INTO transactions (transaction_id, account_id, amount, role)
  //             SELECT id, debtor_id, amount, 0 FROM old_transactions
  //             UNION ALL
  //             SELECT id, creditor_id, amount, 1 FROM old_transactions;
  //         `)
        
  //     transfareDataFromOldTrsToTrsHeadsTableQuery.run();
  //     transfareDataFromOldTrsToNewTrsTableQuery.run();
  //   });

  //   const deleteAnyLeakagedTransactions = db.transaction(()=>
  //   {
  //     console.log('Delete any transactions or transactions_heads records has no account')
  //     const deleteOrphanedTransactionsQuery = db.prepare(`
  //       DELETE FROM transactions
  //       WHERE account_id NOT IN (SELECT id FROM accounts);
  //     `);

  //     const deleteIncompleteTransactionsQuery = db.prepare(`
  //       DELETE FROM transactions
  //       WHERE transaction_id IN (
  //           SELECT transaction_id 
  //           FROM transactions 
  //           GROUP BY transaction_id 
  //           HAVING COUNT(DISTINCT role) = 1
  //       );
  //     `);

  //     const deleteOrphanedTransactionsHeadsQuery = db.prepare(`
  //       DELETE FROM transactions_heads
  //       WHERE id NOT IN (SELECT transaction_id FROM transactions);
  //     `);

  //     deleteOrphanedTransactionsQuery.run();
  //     deleteIncompleteTransactionsQuery.run();
  //     deleteOrphanedTransactionsHeadsQuery.run();
  //   })
  //   const checkTable = db.prepare(`
  //       SELECT COUNT(*) as count 
  //       FROM pragma_table_info('transactions') 
  //       WHERE name IN ('debtor_id', 'creditor_id', 'comment', 'date')
  //   `).get();

  //   // Reaname old transactions table from last version
  //   if(checkTable.count === 4)
  //   {
  //     const old_transactions = db.prepare(`ALTER TABLE transactions RENAME TO old_transactions`);
  //     old_transactions.run()
  //   }

  //   // Create new version db tables if not exist
  //   Transaction.createTransactionsHeadsTable()
  //   Transaction.createTransactionsTable()

  //   // Transfare the data from the old structure to the new one if every table ready.
  //   const allTablesExists = BaseDB.tableExists('old_transactions') 
  //     && BaseDB.tableExists('transactions_heads') 
  //     && BaseDB.tableExists('transactions');
  //   const allNewTablesEmpty = BaseDB.isTableEmpty('transactions_heads') && BaseDB.isTableEmpty('transactions')
  //   if(allTablesExists && allNewTablesEmpty) fullTransfareDataFromOldTransactionToNewTables()
    
  //   // Delete the old transactions table if it exist
  //   db.prepare('DROP TABLE IF EXISTS old_transactions').run();

  //   // Delete any leakage in the db from last version bug
  //   const newTablesExists = BaseDB.tableExists('transactions_heads') && BaseDB.tableExists('transactions');
  //   if(newTablesExists) deleteAnyLeakagedTransactions()
  // }

  // getCreateTransactionsQueries(transactionParticipants)
  // {
  //   // SQLite accept to insert 999 row in one at maximum.
  //   // This function will return 2D array.
  //   // The nested arrays contain 2 values: [query, listOfvalues]
  //   /*
  //     Example of code to insert multible values:
  //       const stmt = db.prepare(`
  //         INSERT INTO transactions_heads (date, comment) VALUES 
  //           (?, ?), (?, ?), (?, ?)
  //       `);

  //       stmt.run(
  //         '2025-04-18', 'First transaction',
  //         '2025-04-19', 'Second transaction',
  //         '2025-04-20', 'Third transaction'
  //       );
	// 	*/
  //   let init = `INSERT INTO transactions (transaction_id, account_id, amount, role) VALUES`
  // }

  // static create(transactionBody) // Need to improve: The whole process must success, or failed (no partial success or failed).
  // {
  //   if(!Transaction.isSetUped) Transaction.setUp()
  //   if(!TransactionBody.isTransactionBody(transactionBody)) throw new Error('Transaction.create method: expect TransactionBody object');
  //   const date = transactionBody.getMetaData().getDate()
  //   const comment = transactionBody.getMetaData().getComment()
  //   const db = BaseDB.getDB()
  //   const createTransactionHeader = db.prepare('INSERT INTO transactions_heads (date, comment) VALUES (@date, @comment)')

  //   const insertMany = db.transaction((transactionId, records)=>
  //   {
  //     const createTransaction =  db.prepare('INSERT INTO transactions (transaction_id, account_id, amount, role) VALUES (?, ?, ?, ?)')
  //     for(const record of records)
  //     {
  //       createTransaction.run(transactionId, record.id, record.body.amount, record.body.role)
  //     }
  //   })

  //   try
  //   {
  //     const response = createTransactionHeader.run({
  //      date, comment
  //     })
  //     const transactionHeadId = response.lastInsertRowid;
  //     if(!Array.isArray(transactionBody.participantsList.participants)) throw new Error('Transaction modle -> create method: expect transactionBody.participantsList.participants to be an array')
  //     insertMany(transactionHeadId, [...transactionBody.participantsList.participants])
  //     return response
  //   }
  //   catch(error)
  //   {
  //     ErrorHandler.logError(error)
  //     throw error
  //   }
  // }

  // static getAllTransactions()
  // {
  //   if(!Transaction.isSetUped) Transaction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               th.id AS id,
  //                               th.date AS date,
  //                               th.comment AS comment,
  //                               t.amount AS amount,
  //                               t.account_id AS account_id,
  //                               t.role AS role,
  //                               acc.name AS account_name,
  //                               t.id AS detail_id
  //                             FROM transactions_heads th
  //                             JOIN 
  //                               transactions t ON t.transaction_id = th.id
  //                             JOIN 
  //                               accounts acc  ON acc.id = t.account_id
  //                             ORDER BY 
  //                               th.date ASC, th.id ASC, t.role ASC;`)
  //   // [{id, date, comment, amount, account_id, account_name, role, detail_id},...]
  //   try
  //   {
  //     const transactions = query.all()
  //     const transactionEntities = TransactionEntity.createMultipleTransactions(transactions);
  //     return transactionEntities;
  //   }
  //   catch(error)
  //   {
  //     ErrorHandler.logError(error)
  //     return false;
  //   }
   
  // }

  // static getTransactionById(id)
  // {
  //   if(!Transaction.isSetUped) Transaction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               th.id AS id,
  //                               th.date AS date,
  //                               th.comment AS comment,
  //                               t.amount AS amount,
  //                               t.account_id AS account_id,
  //                               t.role AS role,
  //                               acc.name AS account_name,
  //                               t.id AS detail_id
  //                             FROM transactions_heads th
  //                             JOIN 
  //                               transactions t ON t.transaction_id = th.id
  //                             JOIN 
  //                               accounts acc  ON acc.id = t.account_id
  //                             WHERE
  //                               th.id = @id
  //                             ORDER BY 
  //                               t.role ASC;`)
  //   const transaction = query.all({id: id});
  //   if(!transaction) return false;
  //   const transactionsEntities = TransactionEntity.createMultipleTransactions(transaction);
  //   return transactionsEntities;
  // }

  // static getAllTransactionsWithPaging(page)
  // {
  //   if(!Transaction.isSetUped) Transaction.setUp()
  //   const pageSize = 3;
  //   const offset = page * pageSize
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               t.id AS id,
  //                               t.amount AS amount,
  //                               t.debtor_id AS debtor_id,
  //                               debtor.name AS debtor_name,
  //                               t.creditor_id AS creditor_id,
  //                               creditor.name AS creditor_name,
  //                               t.comment AS comment,
  //                               t.date AS date
  //                             FROM transactions t
  //                             JOIN 
  //                               accounts debtor  ON t.debtor_id = debtor.id
  //                             JOIN
  //                               accounts creditor ON t.creditor_id = creditor.id
  //                             ORDER BY 
  //                               t.date ASC, t.id ASC
  //                               LIMIT @pageSize OFFSET @offset;`)
  //   const transactions = query.all({
  //     pageSize: pageSize,
  //     offset: offset
  //   })
  //   const TransactionsEntities = TransactionEntity.createMultibleTransactionsEntities(transactions)
  //   return TransactionsEntities
  // }

  // static getAllTransactionsForSpecificPeriod(startPeriod, endPeriod)
  // {
  //   if(!Transaction.isSetUped) Transaction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               t.id AS id,
  //                               t.amount AS amount,
  //                               t.debtor_id AS debtor_id,
  //                               debtor.name AS debtor_name,
  //                               t.creditor_id AS creditor_id,
  //                               creditor.name AS creditor_name,
  //                               t.comment AS comment,
  //                               t.date AS date
  //                             FROM transactions t
  //                             JOIN 
  //                               accounts debtor  ON t.debtor_id = debtor.id
  //                             JOIN
  //                               accounts creditor ON t.creditor_id = creditor.id
  //                             WHERE 
  //                               (
  //                                 (t.date BETWEEN @startPeriod AND @endPeriod)
  //                               OR
  //                                 (t.date BETWEEN @endPeriod AND @startPeriod)
  //                               ) 
  //                             ORDER BY 
  //                               t.date ASC, t.id ASC;`
  //                             )
  //   const transactions = query.all({startPeriod, endPeriod})
  //   const transactionsEntities = TransactionEntity.createMultibleTransactionsEntities(transactions)
  //   return transactionsEntities
  // }

  // static getAllTransactionsForAccountForPeriod(accountId, startPeriod, endPeriod)
  // {
  //   if(!Transaction.isSetUped) Transaction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               t.id AS id,
  //                               t.amount AS amount,
  //                               t.debtor_id AS debtor_id,
  //                               debtor.name AS debtor_name,
  //                               t.creditor_id AS creditor_id,
  //                               creditor.name AS creditor_name,
  //                               t.comment AS comment,
  //                               t.date AS date
  //                             FROM transactions t
  //                             JOIN 
  //                               accounts debtor  ON t.debtor_id = debtor.id
  //                             JOIN
  //                               accounts creditor ON t.creditor_id = creditor.id
  //                             WHERE 
  //                               (
  //                                 (t.date BETWEEN @startPeriod AND @endPeriod)
  //                               OR
  //                                 (t.date BETWEEN @endPeriod AND @startPeriod)
  //                               ) 
  //                             AND 
  //                                 (debtor.id = @accountId OR creditor.id = @accountId)
  //                             ORDER BY 
  //                               t.date ASC, t.id ASC;`
  //                             )
  //   const transactions = query.all({accountId, startPeriod, endPeriod})
  //   const transactionsEntities = TransactionEntity.createMultibleTransactionsEntities(transactions)
  //   return transactionsEntities
  // }
  // static getAcccountStatementForSpecificPeriod(accountId, startPeriod, endPeriod)
  // {
  //   if(!Transaction.isSetUped) Transaction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               th.id AS transaction_id,
  //                               th.date AS date,
  //                               th.comment AS comment,
  //                               t.role AS role,
  //                               t.amount AS amount,
                                
  //                               (
  //                                   SELECT COALESCE(SUM(
  //                                       CASE 
  //                                           WHEN t2.role = 0 THEN t2.amount
  //                                           ELSE -t2.amount
  //                                       END
  //                                   ), 0)
  //                                   FROM transactions t2
  //                                   JOIN transactions_heads th2 ON t2.transaction_id = th2.id
  //                                   WHERE 
  //                                       t2.account_id = @accountId
  //                                       AND (
  //                                           th2.date < th.date
  //                                           OR (th2.date = th.date AND t2.id <= t.id)
  //                                       )
  //                               ) AS balance

  //                           FROM transactions t
  //                           JOIN transactions_heads th ON t.transaction_id = th.id
  //                           WHERE 
  //                               th.date BETWEEN MIN(@startPeriod, @endPeriod) AND MAX(@startPeriod, @endPeriod)
  //                               AND t.account_id = @accountId
  //                           ORDER BY 
  //                               th.date ASC, t.id ASC;

  //                           `
  //                             )
  //   const transactions = query.all({accountId, startPeriod, endPeriod})

  //   return transactions
  // }

  // static getAllTransactionsForAccount(accountId)
  // {
  //   if(!Transaction.isSetUped) Transaction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               t.id AS id,
  //                               t.amount AS amount,
  //                               t.debtor_id AS debtor_id,
  //                               debtor.name AS debtor_name,
  //                               t.creditor_id AS creditor_id,
  //                               creditor.name AS creditor_name,
  //                               t.comment AS comment,
  //                               t.date AS date
  //                             FROM transactions t
  //                             JOIN 
  //                               accounts debtor  ON t.debtor_id = debtor.id
  //                             JOIN
  //                               accounts creditor ON t.creditor_id = creditor.id
  //                             WHERE 
  //                                 debtor.id = @accountId OR creditor.id = @accountId
  //                             ORDER BY 
  //                               t.date ASC, t.id ASC;`
  //                             )
  //   const transactions = query.all({accountId})
  //   const transactionsEntities = TransactionEntity.createMultibleTransactionsEntities(transactions)
  //   return transactionsEntities
  // }

  // static getAccountBalanceAtStartPeriod(accountId, startPeriod)
  // {
  //   if(!Transaction.isSetUped) Transaction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT 
  //                               COALESCE(
  //                                 SUM(
  //                                   CASE
  //                                     WHEN t.role = 0 THEN t.amount
  //                                     ELSE -t.amount
  //                                   END
  //                                 ), 0
  //                               ) AS balance
  //                             FROM transactions t
  //                             JOIN transactions_heads th ON th.id = t.transaction_id
  //                             WHERE 
  //                               th.date < @startPeriod
  //                               AND t.account_id = @accountId;
  //                             `
  //                             )
  //   const balance = query.get({accountId, startPeriod})
  //   return balance
  // }

  // static getFirstTransactionDateOfAccount(accountId)
  // {
  //   if(!Transaction.isSetUped) Transaction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT MIN(th.date) AS date
  //                             FROM transactions t
  //                             JOIN transactions_heads th ON t.transaction_id = th.id
  //                             WHERE t.account_id = @accountId;
  //                             `
  //                             )
  //   const date = query.get({accountId})
  //   if(!date.date) return false;
  //   return date
  // }

  // static getLastTransactionDateOfAccount(accountId)
  // {
  //   if(!Transaction.isSetUped) Transaction.setUp()
  //   const db = BaseDB.getDB()
  //   const query = db.prepare(`SELECT MAX(th.date) AS date
  //                             FROM transactions t
  //                             JOIN transactions_heads th ON t.transaction_id = th.id
  //                             WHERE t.account_id = @accountId;
  //                             `
  //                             )
  //   const date = query.get({accountId})
  //   if(!date.date) return false; 
  //   return date
  // }

  // static getAccountTransactionsCount(accountId)
  // {
  //   if(!Transaction.isSetUped) Transaction.setUp()
  //   const db = BaseDB.getDB()
  //   const accountTransactionsNumberQuery = db.prepare(`
  //     SELECT COUNT(DISTINCT transaction_id) AS count
  //     FROM transactions
  //     WHERE account_id = @id;
  //     `)
  //   const accountTransactionsNumberResponse = accountTransactionsNumberQuery.all({id: accountId});
  //   return accountTransactionsNumberResponse;
  // }

  // static delete(id)
  // {

  //   if(!Transaction.isSetUped) Transaction.setUp();
  //   const db = BaseDB.getDB();

  //   const deleteTransaction = db.prepare('DELETE FROM transactions_heads WHERE id = @id');
  //   return deleteTransaction.run({id});
  // }

  // static update(transactionId, transactionBody)
  // {
  //   if(!Transaction.isSetUped) Transaction.setUp();
  //   if(!TransactionBody.isTransactionBody(transactionBody)) throw new Error('Transaction.update method: expect TransactionBody object');
  //   const date = transactionBody.getMetaData().getDate()
  //   const comment = transactionBody.getMetaData().getComment()
  //   const db = BaseDB.getDB()

  //   const updateTransaction = db.transaction((transactionId, participants)=>
  //   {
  //     const updateTransactionHead = db.prepare('UPDATE transactions_heads SET comment=@comment, date=@date WHERE id=@id');
  //     const deleteTransactionDetails =  db.prepare('DELETE FROM transactions WHERE transaction_id = @id');
  //     const createTransactionDetails =  db.prepare('INSERT INTO transactions (transaction_id, account_id, amount, role) VALUES (?, ?, ?, ?)');

  //     let updateResponse = updateTransactionHead.run({id: transactionId, date, comment});
  //     let deleteResponse = deleteTransactionDetails.run({id: transactionId});
  //     let insertCount = 0;
  //     for(const participant of participants)
  //     {
  //       let insertResponse = createTransactionDetails.run(transactionId, participant.id, participant.body.amount, participant.body.role)
  //       insertCount += insertResponse.changes;
  //     }
  //     return {
  //       transactionsHeads: updateResponse.changes,
  //       transactionsDetails: {
  //         delete: deleteResponse.changes,
  //         create: insertCount,
  //       }
  //     }
  //   })

  //   try
  //   {
  //     let participants = transactionBody.participants;
  //     if(!Array.isArray(participants)) throw new Error('Transaction modle -> update method: expect transactionBody.participants to be an array')
  //     let response = updateTransaction(transactionId, [...participants])
  //     return response
  //   }
  //   catch(error)
  //   {
  //     ErrorHandler.logError(error)
  //     throw error
  //   }
  // }
}