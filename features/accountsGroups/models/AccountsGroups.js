import Joi from "joi";
import {BaseDB} from "../../../models/BaseDB.js";
import { LightAccountsGroup } from "../entities/LightAccountsGroup.js";
import { AccountsGroup } from "../entities/AccountsGroup.js";
import { AccountsGroups as AccountsGroupsEntity } from "../entities/AccountsGroups.js";
import { FinancialRepresentativeEntity } from "../../../models/financialRepresentativeEntity/FinancialRepresentativeEntity.js";
import { currentTimeStamp } from "../../../utils/currentTimeStamp.js"
export class AccountsGroups
{
  static db = BaseDB.getDB();

  static create(lightAccountsGroup)
  {
    // Data Validations
    if(LightAccountsGroup.isLightAccountsGroup(lightAccountsGroup) === false)
      throw new Error("Invalid lightAccountsGroup, it must be instance of LightAccountsGroup");
    
    // Create transaction
    const createTransaction = AccountsGroups
      .db.transaction(() => {
        // Crate FinancialRepresentativeEntity;
        const createFinancialRepresentativeEntityResponse = FinancialRepresentativeEntity
          .createFinancialRepresentativeEntityCommand
          .run(
            {
              entity_id: lightAccountsGroup.entityId,
              name: lightAccountsGroup.name,
              registration_time: currentTimeStamp(),
              last_update_time: currentTimeStamp()
            });
        const lastInsertedId = createFinancialRepresentativeEntityResponse.lastInsertRowid;

        // Create accounts group
        const createAccountsGroupsCommand = AccountsGroups
          .db.prepare(`INSERT INTO accounts_groups (financial_representative_entity_id, account_group_id, registration_time, last_update_time)
            VALUES (@financial_representative_entity_id, @account_group_id, @registration_time, @last_update_time);`);
        const createAccountsGroupsResponse = createAccountsGroupsCommand.run(
          {
            financial_representative_entity_id: lastInsertedId,
            account_group_id: lightAccountsGroup.accountsGroupId,
            registration_time: currentTimeStamp(),
            last_update_time: currentTimeStamp()
          });

        return {lastInsertRowid: createAccountsGroupsResponse.lastInsertRowid};
      })

    try
    {
      return createTransaction();
    }
    catch(error)
    {
      throw new Error(error.message);
    }
  }

  static update(accountsGroup)
  {
    // Data Validations
    if(AccountsGroup.isAccountGroup(accountsGroup) === false)
      throw new Error("Invalid accountsGroup, it must be instance of AccountsGroup");

    // Update transaction
    const updateTransaction = AccountsGroups
      .db.transaction(() => {
        // Update FinancialRepresentativeEntity;
        const getFinancialRepresentativeEntityIdCommand = AccountsGroups
          .db.prepare(`SELECT financial_representative_entity_id
            FROM accounts_groups
            WHERE accounts_groups.id = @id;`);
        const financialRepresentativeEntityId = getFinancialRepresentativeEntityIdCommand.get({id}).financial_representative_entity_id;

        FinancialRepresentativeEntity
          .updateFinancialRepresentativeEntityCommand
          .run(
            {
              id: financialRepresentativeEntityId,
              entity_id: accountsGroup.entityId,
              name: accountsGroup.name,
              last_update_time: currentTimeStamp()
            });

        // Update accounts group
        const updateAccountsGroupsCommand = AccountsGroups
          .db.prepare(`UPDATE accounts_groups
            SET account_group_id = @account_group_id, 
              last_update_time = @last_update_time
            WHERE accounts_groups.id = @id;`);

        const updateAccountsGroupsResponse = updateAccountsGroupsCommand.run(
          {
            account_group_id: accountsGroup.accountGroupId,
            last_update_time: currentTimeStamp(),
            id: accountsGroup.id
          });

        return updateAccountsGroupsResponse.changes;
      })

    try
    {
      return updateTransaction();
    }
    catch(error)
    {
      throw new Error(error.message);
    }

  }

  static delete(id)
  {
    // Delete transaction
    const deleteTransaction = AccountsGroups
      .db.transaction(() => {
        // Delete accounts group
        const getFinancialRepresentativeEntityIdCommand = AccountsGroups
          .db.prepare(`SELECT financial_representative_entity_id
            FROM accounts_groups
            WHERE accounts_groups.id = @id;`);
        const financialRepresentativeEntityId = getFinancialRepresentativeEntityIdCommand.get({id}).financial_representative_entity_id;

        const deleteAccountsGroupsCommand = AccountsGroups
          .db.prepare(`DELETE FROM accounts_groups
            WHERE accounts_groups.id = @id;`);
        const deleteAccountsGroupsResponse = deleteAccountsGroupsCommand.run({id});

        // Delete FinancialRepresentativeEntity
        FinancialRepresentativeEntity
          .deleteFinancialRepresentativeEntityCommand
          .run({id: financialRepresentativeEntityId});

        return deleteAccountsGroupsResponse.changes; 
      })

    try
    {
      return deleteTransaction();
    }
    catch(error)
    {
      throw new Error(error.message);
    }
  }

  static getAccountsGroups(page, pageSize)
  {
    const offset = (page - 1) * pageSize;
    const command = AccountsGroups
      .db.prepare(`
        SELECT 
          ag1.id AS id, 
          fre.entity_id AS entityId, 
          fre.name AS name, 
          fre2.name AS accountsGroupName
        FROM accounts_groups ag1
        LEFT JOIN accounts_groups ag2
          ON ag1.account_group_id = ag2.id
        JOIN financial_representative_entity fre
          ON ag1.financial_representative_entity_id = fre.id
        LEFT JOIN financial_representative_entity fre2 
          ON ag2.financial_representative_entity_id = fre2.id
        ORDER BY entityId
        LIMIT @pageSize 
        OFFSET @offset;`);

    try
    {
      const result = command.all({pageSize, offset});
      const accountsGroups = new AccountsGroupsEntity();
      result.forEach(({id, entityId, name, accountsGroupName}) => {
        const accountsGroup = new AccountsGroup(id, entityId, name, accountsGroupName === null ? undefined : accountsGroupName);
        accountsGroups.push(accountsGroup);
      }); 
      return accountsGroups;
    }
    catch(error)
    {
      throw new Error(error.message);
    }
  }

  static getAccountsGroupById(id)
  {
    const command = AccountsGroups
      .db.prepare(`SELECT 
        ag1.id AS id, 
        fre.entity_id AS entity_id, 
        fre.name AS name, 
        fre2.name AS accountsGroupName
      FROM accounts_groups ag1
      LEFT JOIN accounts_groups ag2
        ON ag1.account_group_id = ag2.id
      JOIN financial_representative_entity fre
        ON ag1.financial_representative_entity_id = fre.id
      LEFT JOIN financial_representative_entity fre2 
        ON ag2.financial_representative_entity_id = fre2.id
      WHERE ag1.id = @id;`);

    try
    {
      const result = command.get({id});
      if(!result) return null;
      return new AccountsGroup(result.id, result.entity_id, result.name, result.accountsGroupName);
    }
    catch(error)
    {
      throw new Error(error.message);
    }
  }

  static getAccountsGroupsByEntityIdContains(partialEntityId, page, pageSize)
  {
    const offset = (page - 1) * pageSize;
    const command = AccountsGroups
      .db.prepare(`
        SELECT 
          ag1.id AS id, 
          fre.entity_id AS entityId, 
          fre.name AS name, 
          fre2.name AS accountsGroupName
        FROM accounts_groups ag1
        LEFT JOIN accounts_groups ag2
          ON ag1.account_group_id = ag2.id
        JOIN financial_representative_entity fre
          ON ag1.financial_representative_entity_id = fre.id
        LEFT JOIN financial_representative_entity fre2 
          ON ag2.financial_representative_entity_id = fre2.id
        WHERE entityId LIKE @partialEntityId
        ORDER BY entityId
        LIMIT @pageSize 
        OFFSET @offset;`);

    try
    {
      const result = command.all({partialEntityId: `%${partialEntityId}%`, pageSize, offset});
      const accountsGroups = new AccountsGroupsEntity();
      result.forEach(({id, entityId, name, accountsGroupName}) => {
        const accountsGroup = new AccountsGroup(id, entityId, name, accountsGroupName === null ? undefined : accountsGroupName);
        accountsGroups.push(accountsGroup);
      }); 
      return accountsGroups;
    }
    catch(error)
    {
      throw new Error(error.message);
    }
  }

  static getAccountsGroupsByNameContains(partialName, page, pageSize)
  {
    const offset = (page - 1) * pageSize;
    const command = AccountsGroups
      .db.prepare(`
        SELECT 
          ag1.id AS id, 
          fre.entity_id AS entityId, 
          fre.name AS name, 
          fre2.name AS accountsGroupName
        FROM accounts_groups ag1
        LEFT JOIN accounts_groups ag2
          ON ag1.account_group_id = ag2.id
        JOIN financial_representative_entity fre
          ON ag1.financial_representative_entity_id = fre.id
        LEFT JOIN financial_representative_entity fre2 
          ON ag2.financial_representative_entity_id = fre2.id
        WHERE fre.name LIKE @partialName
        ORDER BY entityId
        LIMIT @pageSize 
        OFFSET @offset;`);

    try
    {
      const result = command.all({partialName: `%${partialName}%`, pageSize, offset});
      const accountsGroups = new AccountsGroupsEntity();
      result.forEach(({id, entityId, name, accountsGroupName}) => {
        const accountsGroup = new AccountsGroup(id, entityId, name, accountsGroupName === null ? undefined : accountsGroupName);
        accountsGroups.push(accountsGroup);
      }); 
      return accountsGroups;
    }
    catch(error)
    {
      throw new Error(error.message);
    }
  }

  static IsAccountsGroupIdExist(id)
  {
    const command = AccountsGroups
      .db.prepare(`SELECT 1
        FROM accounts_groups
        WHERE accounts_groups.id = @id;`);
    const result = command.all({id});
    if(result.length > 0)
    {
      return true;
    }
    return false;
  }

  static isAccountGroupIdChildOfAccountsGroupId(accountsGroupId, parentAccountsGroupId)
  {
    const command = AccountsGroups
      .db.prepare(`
        WITH RECURSIVE accounts_group_children(id) AS (
          SELECT ag1.id
          FROM accounts_groups ag1
          WHERE ag1.account_group_id = @parentAccountsGroupId

          UNION ALL

          SELECT ag2.id
          FROM accounts_groups ag2
          JOIN accounts_group_children agc
            ON ag2.account_group_id = agc.id
        )
        SELECT 1
        FROM accounts_group_children
        WHERE accounts_group_children.id = @accountsGroupId
      `);
    const result = command.all({parentAccountsGroupId, accountsGroupId});
    if(result.length > 0)
    {
      return true;
    }
    return false;
  }

  static isAccountGroupIdHasAcountsGroupChild(accountsGroupId)
  {
    const command = AccountsGroups
      .db.prepare(`SELECT 1
        FROM accounts_groups
        WHERE accounts_groups.account_group_id = @accountsGroupId;`);
    const result = command.all({accountsGroupId});
    if(result.length > 0)
    {
      return true;
    }
    return false;
  }
}