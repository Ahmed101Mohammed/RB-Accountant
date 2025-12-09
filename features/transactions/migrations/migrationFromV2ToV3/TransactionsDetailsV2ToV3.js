import BaseDB from "../../../../models/BaseDB.js";

export class TransactionsDetailsV2ToV3
{
  static db = BaseDB.getDB();
  static changeTableName = this.db.prepare(`ALTER TABLE transactions
                            RENAME TO transactions_details;`
                );

  static addCommentColumn = this.db.prepare(`ALTER TABLE transactions_details
    ADD COLUMN comment 
    TEXT 
    NOT NULL
    DEFAULT ''
    CHECK (length(comment) <= 500);`);

  static updateCommentColumn = this.db.prepare(`UPDATE transactions_details 
    SET comment = (SELECT
                  CASE 
                    WHEN (length(t.comment) > 500)
                      THEN substr(t.comment, 1, 500)
                    ELSE t.comment
                  END
    FROM transactions
    WHERE transactions_details.transaction_id = transactions.id);`
              );

  static addNewRoleColumn = this.db.prepare(`ALTER TABLE transactions_details
    ADD COLUMN new_role 
    TEXT 
    NOT NULL
    DEFAULT 'debtor'
    CHECK (new_role IN ('creditor', 'debtor'));`);

  static updateNewRoleColumn = this.db.prepare(`UPDATE transactions_details 
    SET new_role =  CASE 
                    WHEN (role = 0)
                      THEN 'debtor'
                    WHEN (role = 1)
                      THEN 'creditor'
                    else 'debtor'
                  END;`
            );

  static deleteRoleColumn = this.db.prepare(`ALTER TABLE transactions_details
    DROP COLUMN role;`);

  static changeNewRoleColumnName = this.db.prepare(`ALTER TABLE transactions_details
    RENAME COLUMN new_role TO role;`);
}