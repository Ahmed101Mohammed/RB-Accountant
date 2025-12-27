import { BaseDB } from "../../../models/BaseDB.js";
import { LightAccount } from "../entities/LightAccount.js";
import { Account as AccountEntity } from "../entities/Account.js";
import { Accounts as AccountsEntity } from "../entities/Accounts.js";
import { FinancialRepresentativeEntity } from "../../../models/financialRepresentativeEntity/FinancialRepresentativeEntity.js";
import { currentTimeStamp } from "../../../utils/currentTimeStamp.js";

export class Accounts {
  static db = BaseDB.getDB();

  static isAccountIdHasAccountChild(AccountId) {
    const command = Accounts.db.prepare(`SELECT 1
        FROM accounts
        WHERE accounts.account_group_id = @AccountId;`);
    const result = command.all({ AccountId });
    if (result.length > 0) {
      return true;
    }
    return false;
  }

  static create(lightAccount) {
    // Data Validations
    if (LightAccount.isLightAccount(lightAccount) === false)
      throw new Error(
        "Invalid lightAccount, it must be instance of LightAccount"
      );

    // Create transaction
    const createTransaction = Accounts.db.transaction(() => {
      // Crate FinancialRepresentativeEntity;
      const createFinancialRepresentativeEntityResponse =
        FinancialRepresentativeEntity.createFinancialRepresentativeEntityCommand.run(
          {
            entity_id: lightAccount.entityId,
            name: lightAccount.name,
            registration_time: currentTimeStamp(),
            last_update_time: currentTimeStamp(),
          }
        );
      const lastInsertedId =
        createFinancialRepresentativeEntityResponse.lastInsertRowid;

      // Create account
      const createAccountsCommand = Accounts.db
        .prepare(`INSERT INTO accounts (financial_representative_entity_id, account_group_id, registration_time, last_update_time)
              VALUES (@financial_representative_entity_id, @account_group_id, @registration_time, @last_update_time);`);
      const createAccountsResponse = createAccountsCommand.run({
        financial_representative_entity_id: lastInsertedId,
        account_group_id: lightAccount.accountsGroupId,
        registration_time: currentTimeStamp(),
        last_update_time: currentTimeStamp(),
      });

      return { lastInsertRowid: createAccountsResponse.lastInsertRowid };
    });

    try {
      return createTransaction();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static update(account) {
    // Data Validations
    if (AccountEntity.isAccount(account) === false)
      throw new Error("Invalid account, it must be instance of Account");

    // Update transaction
    const updateTransaction = Accounts.db.transaction(() => {
      // Update FinancialRepresentativeEntity;
      const getFinancialRepresentativeEntityIdCommand = Accounts.db
        .prepare(`SELECT financial_representative_entity_id
              FROM accounts
              WHERE accounts.id = @id;`);
      const financialRepresentativeEntityId =
        getFinancialRepresentativeEntityIdCommand.get({
          id,
        }).financial_representative_entity_id;

      FinancialRepresentativeEntity.updateFinancialRepresentativeEntityCommand.run(
        {
          id: financialRepresentativeEntityId,
          entity_id: account.entityId,
          name: account.name,
          last_update_time: currentTimeStamp(),
        }
      );

      // Update account
      const updateAccountsCommand = Accounts.db.prepare(`UPDATE accounts
              SET account_group_id = @account_group_id, 
                last_update_time = @last_update_time
              WHERE accounts.id = @id;`);

      const updateAccountsResponse = updateAccountsCommand.run({
        account_group_id: account.accountGroupId,
        last_update_time: currentTimeStamp(),
        id: account.id,
      });

      return updateAccountsResponse.changes;
    });

    try {
      return updateTransaction();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static delete(id) {
    // Delete transaction
    const deleteTransaction = Accounts.db.transaction(() => {
      // Delete account
      const getFinancialRepresentativeEntityIdCommand = Accounts.db
        .prepare(`SELECT financial_representative_entity_id
              FROM accounts
              WHERE accounts.id = @id;`);
      const financialRepresentativeEntityId =
        getFinancialRepresentativeEntityIdCommand.get({
          id,
        }).financial_representative_entity_id;

      const deleteAccountsCommand = Accounts.db.prepare(`DELETE FROM accounts
              WHERE accounts.id = @id;`);
      const deleteAccountsResponse = deleteAccountsCommand.run({ id });

      // Delete FinancialRepresentativeEntity
      FinancialRepresentativeEntity.deleteFinancialRepresentativeEntityCommand.run(
        { id: financialRepresentativeEntityId }
      );

      return deleteAccountsResponse.changes;
    });

    try {
      return deleteTransaction();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static getAccounts(page, pageSize) {
    const offset = (page - 1) * pageSize;
    const command = Accounts.db.prepare(`
          SELECT 
            acc.id AS id, 
            fre.entity_id AS entityId, 
            fre.name AS name, 
            fre2.name AS accountsGroupName
          FROM accounts acc
          LEFT JOIN accounts_groups acg
            ON acc.account_group_id = acg.id
          JOIN financial_representative_entity fre
            ON acc.financial_representative_entity_id = fre.id
          LEFT JOIN financial_representative_entity fre2 
            ON acg.financial_representative_entity_id = fre2.id
          ORDER BY entityId
          LIMIT @pageSize 
          OFFSET @offset;`);

    try {
      const result = command.all({ pageSize, offset });
      const Accounts = new AccountsEntity();
      result.forEach(({ id, entityId, name, accountsGroupName }) => {
        const Account = new AccountEntity(
          id,
          entityId,
          name,
          accountsGroupName === null ? undefined : AccountName
        );
        Accounts.push(Account);
      });
      return Accounts;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static getAccountById(id) {
    const command = Accounts.db.prepare(`SELECT 
          acc.id AS id, 
          fre.entity_id AS entity_id, 
          fre.name AS name, 
          fre2.name AS AccountName
        FROM accounts acc
        LEFT JOIN accounts_groups acg
          ON acc.account_group_id = acg.id
        JOIN financial_representative_entity fre
          ON acc.financial_representative_entity_id = fre.id
        LEFT JOIN financial_representative_entity fre2 
          ON acg.financial_representative_entity_id = fre2.id
        WHERE acc.id = @id;`);

    try {
      const result = command.get({ id });
      if (!result) return null;
      return new AccountEntity(
        result.id,
        result.entity_id,
        result.name,
        result.accountsGroupName
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static getAccountsByEntityIdContains(partialEntityId, page, pageSize) {
    const offset = (page - 1) * pageSize;
    const command = Accounts.db.prepare(`
          SELECT 
            acc.id AS id, 
            fre.entity_id AS entityId, 
            fre.name AS name, 
            fre2.name AS AccountName
          FROM accounts acc
          LEFT JOIN accounts_groups acg
            ON acc.account_group_id = acg.id
          JOIN financial_representative_entity fre
            ON acc.financial_representative_entity_id = fre.id
          LEFT JOIN financial_representative_entity fre2 
            ON acg.financial_representative_entity_id = fre2.id
          WHERE entityId LIKE @partialEntityId
          ORDER BY entityId
          LIMIT @pageSize 
          OFFSET @offset;`);

    try {
      const result = command.all({
        partialEntityId: `%${partialEntityId}%`,
        pageSize,
        offset,
      });
      const Accounts = new AccountsEntity();
      result.forEach(({ id, entityId, name, accountsGroupName }) => {
        const Account = new AccountEntity(
          id,
          entityId,
          name,
          accountsGroupName === null ? undefined : accountsGroupName
        );
        Accounts.push(Account);
      });
      return Accounts;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static getAccountsByNameContains(partialName, page, pageSize) {
    const offset = (page - 1) * pageSize;
    const command = Accounts.db.prepare(`
          SELECT 
            acc.id AS id, 
            fre.entity_id AS entityId, 
            fre.name AS name, 
            fre2.name AS AccountName
          FROM accounts acc
          LEFT JOIN accounts_groups acg
            ON acc.account_group_id = ag2.id
          JOIN financial_representative_entity fre
            ON acc.financial_representative_entity_id = fre.id
          LEFT JOIN financial_representative_entity fre2 
            ON acg.financial_representative_entity_id = fre2.id
          WHERE fre.name LIKE @partialName
          ORDER BY entityId
          LIMIT @pageSize 
          OFFSET @offset;`);

    try {
      const result = command.all({
        partialName: `%${partialName}%`,
        pageSize,
        offset,
      });
      const Accounts = new AccountsEntity();
      result.forEach(({ id, entityId, name, accountsGroupName }) => {
        const Account = new AccountEntity(
          id,
          entityId,
          name,
          accountsGroupName === null ? undefined : accountsGroupName
        );
        Accounts.push(Account);
      });
      return Accounts;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static IsAccountIdExist(id) {
    const command = Accounts.db.prepare(`SELECT 1
          FROM accounts
          WHERE accounts.id = @id;`);
    const result = command.all({ id });
    if (result.length > 0) {
      return true;
    }
    return false;
  }

  static isAccountIdChildOfAccountGroupId(AccountId, parentAccountGroupId) {
    const command = Accounts.db.prepare(`
      WITH RECURSIVE allowed_groups(id) AS (
        SELECT id 
        FROM accounts_groups 
        WHERE id = @parentAccountGroupId

        UNION ALL

        SELECT ag.id
        FROM accounts_groups ag
        JOIN allowed_groups recursive_parent ON ag.account_group_id = recursive_parent.id
      )

      SELECT 1 
      FROM accounts 
      WHERE id = @AccountId 
      AND account_group_id IN (SELECT id FROM allowed_groups)
    `);

    const result = command.all({ parentAccountGroupId, AccountId });
    return result.length > 0;
  }

  static isAccountIdHasTransaction(accountId) {
    // Check if the account is used in any transaction detail
    const command = Accounts.db.prepare(`SELECT 1
        FROM transactions_details
        WHERE transactions_details.account_id = @accountId
        LIMIT 1;`); // LIMIT 1 optimizes performance

    const result = command.all({ accountId });

    if (result.length > 0) {
      return true;
    }
    return false;
  }
}
