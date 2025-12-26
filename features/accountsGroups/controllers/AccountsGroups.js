import Joi from "joi";
import { LightAccountsGroup } from "../entities/LightAccountsGroup.js";
import { AccountsGroups as AccountsGroupsModel } from "../models/AccountsGroups.js";
import { FinancialRepresentativeEntity } from "../../../models/financialRepresentativeEntity/FinancialRepresentativeEntity.js";
import { Response } from "../../../utils/Response.js";
export class AccountsGroups
{
  static create(entityId, name, accountsGroupId)
    {
      // Data Validations
      const createSchema = Joi
        .object({
          entityId: LightAccountsGroup.entityIdSchema.required(),
          name: LightAccountsGroup.nameSchema.required(),
          accountsGroupId: LightAccountsGroup.accountsGroupIdSchema.optional()
        })
  
      const {error} = createSchema.validate({entityId, name, accountsGroupId});
      if(error) return new Response(false, error.message);
  
      // Logic validations
        // Id shall be unique
      if(FinancialRepresentativeEntity.isEntityIdUnique(entityId) === false)
        return new Response(false, "هذا الكود مستخدم من قبل، إختر كود جديد");
  
        // Name shall be unique
      if(FinancialRepresentativeEntity.isNameUnique(name) === false) 
        return new Response(false, "اسم تبويب الحسابات مستخدم من قبل، استخدم اسم جديد");

        // accountsGroupId shall be exist in db
      if(accountsGroupId !== undefined && AccountsGroupsModel.IsAccountsGroupIdExist(accountsGroupId) === false) 
        return new Response(false, "تبويب الحسابات غير موجودة");
  
      // Create LightAccountsGroup entity
      const lightAccountsGroup = new LightAccountsGroup(entityId, name, accountsGroupId);

      // Create
      try
      {
        const response = AccountsGroupsModel.create(lightAccountsGroup);
        return new Response(true, "تم إنشاء تبويب الحساب بنجاح", response);
      }
      catch(error)
      {
        return new Response(false, "فشل انشاء تبويب الحسابات: " + error.message, null);
      }
    }
  
    static update(id, {entityId, name, accountsGroupId})
    {
      // Data Validations
      const updateSchema = Joi
        .object({
          entityId: LightAccountsGroup.entityIdSchema,
          name: LightAccountsGroup.nameSchema,
          accountsGroupId: LightAccountsGroup.accountsGroupIdSchema
        })
      const {error} = updateSchema.validate({entityId, name, accountsGroupId});
      if(error) throw new Error(error.message);
  
      // Logic validations
        // Id shall be unique
      if(FinancialRepresentativeEntity.isEntityIdUnique(entityId) === false) 
        return new Response(false, "هذا الكود مستخدم من قبل، إختر كود جديد");

        // Name shall be unique
      if(FinancialRepresentativeEntity.isNameUnique(name) === false) 
        return new Response(false, "اسم تبويب الحسابات مستخدم من قبل، استخدم اسم جديد");
  
        // accountGroupId shall not be the account group itself
      if(id === accountsGroupId) 
        return new Response(false, "لا يمكن لتبويب حسابات أن يتفرع من نفسه");
  
        // accountsGroupId shall be exist
      if(accountsGroupId !== undefined && AccountsGroupsModel.IsAccountsGroupIdExist(accountsGroupId) === false) 
        return new Response(false, "تبويب الحسابات غير موجودة");
  
        // accountsGroupId shall be not a child account group of current account group
      if(accountsGroupId !== undefined && AccountsGroups.isAccountGroupIdChildOfAccountsGroupId(accountsGroupId, id) === true) 
        return new Response(false, "لا يمكن لتبويب حسابات أن يتفرع من تبويب آخر متفرع منه، أو تبويب متفرع من فروعه");

      if(accountsGroupId === uundefined)
        accountsGroupId = null;
  
      // Create AccountsGroup entity
      const accountsGroup = new AccountsGroups(id, entityId, name, accountsGroupId);

      // Update transaction
      try
      {
        const response = AccountsGroupsModel.update(accountsGroup);
        return new Response(true, "تم تحديث تبويب الحسابات بنجاح", response);
      }
      catch(error)
      {
        return new Response(false, "فشل تحديث تبويب الحسابات: " + error.message, null);
      }
  
    }
  
    static delete(id)
    {
      // Data Validations
      const deleteSchema = AccountsGroups.idSchema;
      const {error} = deleteSchema.validate(id);
      if(error) 
        return new Response(false, error.message);

      // Logic Validations
        // accounts group shall has no child account group
      if(AccountsGroupsModel.isAccountGroupIdHasAcountsGroupChild(id) === true) 
        throw new Error("لا يمكن حذف تبويب حسابات متفرع منه تبويب حسابات آخر");
  
      // accounts group shall has no child account
      if(Accounts.isAccountsGroupIdHasAccountChild(id) === true) 
        throw new Error("لا يمكن حذف تبويب حسابات متفرع منه حسابات");
  
      // Delete
      try
      {
        const response = AccountsGroupsModel.delete(id);
        return new Response(true, "تم حذف تبويب الحسابات بنجاح", response);
      }
      catch(error)
      {
        return new Response(false, "فشل حذف تبويب الحسابات: " + error.message, null);
      }
    }
  
    static getAccountsGroups(page, pageSize)
    {
      // Data Validations
      const getSchema = Joi
        .object({
          page: Joi
            .number()
            .integer()
            .min(1)
            .required(),
          pageSize: Joi
            .number()
            .integer()
            .min(1)
            .required()
        });

      const {error} = getSchema.validate({page, pageSize});
      if(error) 
        return new Response(false, error.message);

      // Get
      try
      {
        const response = AccountsGroupsModel.getAccountsGroups(page, pageSize);
        return new Response(true, "تم الحصول على تبويبات الحسابات بنجاح", response);
      }
      catch(error)
      {
        return new Response(false, "فشل الحصول على تبويبات الحسابات: " + error.message, null);
      }
      
    }

    static getAccountsGroupById(id)
    {
      // Data Validations
      const getSchema = AccountsGroups.idSchema;
      const {error} = getSchema.validate(id);
      if(error) 
        return new Response(false, error.message);

      // Get
      try
      {
        const response = AccountsGroupsModel.getAccountsGroupById(id);
        return new Response(true, "تم الحصول على تبويب الحسابات بنجاح", response);
      }
      catch(error)
      {
        return new Response(false, "فشل الحصول على تبويب الحسابات: " + error.message, null);
      }
      
    }

    static getAccountsGroupsByEntityIdContains(partialEntityId, page, pageSize)
    {
      // Data Validations
      const getSchema = Joi
        .object({
          partialEntityId: Joi
            .string()
            .trim()
            .max(100)
            .pattern( /^[0-9]{1,100}$/),
          page: Joi
            .number()
            .integer()
            .min(1)
            .required(),
          pageSize: Joi
            .number()
            .integer()
            .min(1)
            .required()
        });

      const {error} = getSchema.validate({partialEntityId, page, pageSize});
      if(error) 
        return new Response(false, error.message);

      // Get
      try
      {
        const response = AccountsGroupsModel.getAccountsGroupsByEntityIdContains(partialEntityId, page, pageSize);
        return new Response(true, "تم الحصول على تبويبات الحسابات بنجاح", response);
      }
      catch(error)
      {
        return new Response(false, "فشل الحصول على تبويبات الحسابات: " + error.message, null);
      }
      
    }

    static getAccountsGroupsByNameContains(partialName, page, pageSize)
    {
      // Data Validations
      const getSchema = Joi
        .object({
          partialName: Joi
            .string()
            .trim()
            .max(100),
          page: Joi
            .number()
            .integer()
            .min(1)
            .required(),
          pageSize: Joi
            .number()
            .integer()
            .min(1)
            .required()
        });

      const {error} = getSchema.validate({partialName, page, pageSize});
      if(error) 
        return new Response(false, error.message);

      // Get
      try
      {
        const response = AccountsGroupsModel.getAccountsGroupsByNameContains(partialName, page, pageSize);
        return new Response(true, "تم الحصول على تبويبات الحسابات بنجاح", response);
      }
      catch(error)
      {
        return new Response(false, "فشل الحصول على تبويبات الحسابات: " + error.message, null);
      }
      
    } 

}