export class TransactionsDetailsV2ToV3
{
  static changeTableName = `ALTER TABLE transactions
                            RENAME TO old_transactions;`

  static addCommentColumn = `ALTER TABLE old_transactions
    ADD COLUMN comment 
    TEXT 
    NOT NULL
    DEFAULT ''
    CHECK (length(comment) <= 500);`;

  static updateCommentColumn = `UPDATE old_transactions 
    SET comment = (SELECT
                  CASE 
                    WHEN (length(transactions_heads.comment) > 500)
                      THEN substr(transactions_heads.comment, 1, 500)
                    ELSE transactions_heads.comment
                  END
    FROM transactions_heads
    WHERE old_transactions.transaction_id = transactions_heads.id);`;

  static addNewRoleColumn = `ALTER TABLE old_transactions
    ADD COLUMN new_role 
    TEXT 
    NOT NULL
    DEFAULT 'debtor'
    CHECK (new_role IN ('creditor', 'debtor'));`;

  static updateNewRoleColumn = `UPDATE old_transactions 
    SET new_role =  CASE 
                    WHEN (role = 0)
                      THEN 'debtor'
                    WHEN (role = 1)
                      THEN 'creditor'
                    else 'debtor'
                  END;`;

  static deleteRoleColumn = `ALTER TABLE old_transactions
    DROP COLUMN role;`;

  static changeNewRoleColumnName = `ALTER TABLE old_transactions
    RENAME COLUMN new_role TO role;`;

  static addAccountNewIdColumn = `ALTER TABLE old_transactions
    ADD COLUMN account_new_id 
    INTEGER;`;
  
  static updateAccountNewIdColumn = `UPDATE old_transactions 
    SET account_new_id =  (SELECT accounts.id
    FROM accounts
    JOIN financial_representative_entity AS fre ON fre.id = accounts.financial_representative_entity_id
    WHERE entity_id = old_transactions.account_id
    );`;
  
  static insertAllOldTransactionToTransactionsDetails = `INSERT INTO transactions_details (transaction_id, account_id, amount, role, comment)
    SELECT transaction_id, account_new_id, amount, role, comment
    FROM old_transactions;`;

  static deleteOldTransactionsTable = `DROP TABLE old_transactions;`;
}