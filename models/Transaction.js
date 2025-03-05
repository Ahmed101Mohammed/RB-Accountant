import BaseDB from "./BaseDB.js";
import TransactionDBEntity from "../entities/TransactionDBEntity.js";
import TransactionEntity from "../entities/Transaction.js";
import ErrorHandler from "../utils/ErrorHandler.js";
class Transaction
{
  static isSetUped = false
  static async setUp()
  {
    const db = BaseDB.getDB()
    const create = db.prepare(`CREATE TABLE IF NOT EXISTS transactions(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  amount REAL NOT NULL,
                  debtor_id TEXT NOT NULL,
                  creditor_id TEXT NOT NULL,
                  comment TEXT,
                  date TEXT NOT NULL
                ) STRICT`
              )
    
    await create.run()
    Transaction.isSetUped = true;
  }

  static async create(transaction)
  {
    if(!Transaction.isSetUped) await Transaction.setUp()
    if(!TransactionDBEntity.isTransactionDBEntity(transaction)) throw new Error('Transaction.create method: expect Transaction object');
    const transactionAmount = transaction.getAmount()
    const transactionDebtorId = transaction.getDebtorId()
    const transactionCreditorId = transaction.getCreditorId()
    const transactionComment = transaction.getComment()
    const transactionDate = transaction.getDate()
    const db = BaseDB.getDB()
    const insert = db.prepare('INSERT INTO Transactions (amount, debtor_id, creditor_id, comment, date) VALUES (@amount, @debtor_id, @creditor_id, @comment, @date)');
    try
    {
      const response = await insert.run({
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
      throw error
    }
  }

  static async getAllTransactions()
  {
    if(!Transaction.isSetUped) await Transaction.setUp()
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
                                t.date DESC, t.id DESC;`)
    const transactions = await query.all()
    const TransactionsEntities = TransactionEntity.createMultibleTransactionsEntities(transactions)
    return TransactionsEntities
  }

  static async getTransactionById(id)
  {
    if(!Transaction.isSetUped) await Transaction.setUp()
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
                              WHERE t.id = @id
                              ORDER BY 
                                t.date DESC, t.id DESC;`)
    const transaction = await query.get({id})
    if(!transaction) return false
    const TransactionsEntities = TransactionEntity.createMultibleTransactionsEntities([transaction])
    return TransactionsEntities
  }

  static async getAllTransactionsWithPaging(page)
  {
    if(!Transaction.isSetUped) await Transaction.setUp()
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
                                t.date DESC, t.id DESC
                                LIMIT @pageSize OFFSET @offset;`)
    const transactions = await query.all({
      pageSize: pageSize,
      offset: offset
    })
    const TransactionsEntities = TransactionEntity.createMultibleTransactionsEntities(transactions)
    return TransactionsEntities
  }

  static async getAllTransactionsForSpecificPeriod(startPeriod, endPeriod)
  {
    if(!Transaction.isSetUped) await Transaction.setUp()
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
                                t.date DESC, t.id DESC;`
                              )
    const transactions = await query.all({startPeriod, endPeriod})
    const transactionsEntities = TransactionEntity.createMultibleTransactionsEntities(transactions)
    return transactionsEntities
  }

  static async getAllTransactionsForAccountForPeriod(accountId, startPeriod, endPeriod)
  {
    if(!Transaction.isSetUped) await Transaction.setUp()
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
                                t.date DESC, t.id DESC;`
                              )
    const transactions = await query.all({accountId, startPeriod, endPeriod})
    const transactionsEntities = TransactionEntity.createMultibleTransactionsEntities(transactions)
    return transactionsEntities
  }
  static async getAcccountStatementForSpecificPeriod(accountId, startPeriod, endPeriod)
  {
    if(!Transaction.isSetUped) await Transaction.setUp()
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
                                END AS state,
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
    const transactions = await query.all({accountId, startPeriod, endPeriod})

    return transactions
  }

  static async getAllTransactionsForAccount(accountId)
  {
    if(!Transaction.isSetUped) await Transaction.setUp()
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
                                t.date DESC, t.id DESC;`
                              )
    const transactions = await query.all({accountId})
    const transactionsEntities = TransactionEntity.createMultibleTransactionsEntities(transactions)
    return transactionsEntities
  }
  static async getAccountBalanceAtStartPeriod(accountId, startPeriod)
  {
    if(!Transaction.isSetUped) await Transaction.setUp()
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
    const balance = await query.get({accountId, startPeriod})
    return balance
  }

  static async delete(id)
  {
    if(!Transaction.isSetUped) await Transaction.setUp();
    const db = BaseDB.getDB();
    const query = db.prepare('DELETE FROM transactions WHERE id = @id');
    const deleteResponse = await query.run({
      id
    })
    return deleteResponse
  }

  static async update(transactionId, transaction)
  {
    if(!Transaction.isSetUped) await Transaction.setUp();
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
      const response = await query.run({
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