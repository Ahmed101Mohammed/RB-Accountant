import Joi from "joi";
import { LightAccount } from "../entities/LightAccount.js";
import { Account as AccountEntity } from "../entities/Account.js";
import { AccountsGroups as AccountsGroupsModel } from "../../accountsGroups/models/AccountsGroups.js";
import { Accounts as AccountsModel } from "../models/Accounts.js";
import { FinancialRepresentativeEntity } from "../../../models/financialRepresentativeEntity/FinancialRepresentativeEntity.js";
import { Response } from "../../../utils/Response.js";

export class Account {
  static create(entityId, name, accountsGroupId) {
    // Data Validations
    const createSchema = Joi.object({
      entityId: LightAccount.entityIdSchema.required(),
      name: LightAccount.nameSchema.required(),
      accountsGroupId: LightAccount.accountsGroupIdSchema.optional(),
    });

    const { error } = createSchema.validate({
      entityId,
      name,
      accountsGroupId,
    });
    if (error) return new Response(false, error.message);

    // Logic validations
    // Id shall be unique
    if (FinancialRepresentativeEntity.isEntityIdUnique(entityId) === false)
      return new Response(false, "هذا الكود مستخدم من قبل، إختر كود جديد");

    // Name shall be unique
    if (FinancialRepresentativeEntity.isNameUnique(name) === false)
      return new Response(false, "اسم الحساب مستخدم من قبل، استخدم اسم جديد");

    // accountsGroupId shall be exist in db
    if (
      accountsGroupId !== undefined &&
      AccountsGroupsModel.IsAccountsGroupIdExist(accountsGroupId) === false
    )
      return new Response(false, "تبويب الحسابات غير موجود");

    // Create LightAccount entity
    const lightAccount = new LightAccount(entityId, name, accountsGroupId);

    // Create
    try {
      const response = AccountsModel.create(lightAccount);
      return new Response(true, "تم إنشاء الحساب بنجاح", response);
    } catch (error) {
      return new Response(false, "فشل انشاءالحساب: " + error.message, null);
    }
  }

  static update(id, { entityId, name, accountsGroupId }) {
    // Data Validations
    const updateSchema = Joi.object({
      entityId: LightAccount.entityIdSchema,
      name: LightAccount.nameSchema,
      accountsGroupId: LightAccount.accountsGroupIdSchema,
    });
    const { error } = updateSchema.validate({
      entityId,
      name,
      accountsGroupId,
    });
    if (error) throw new Error(error.message);

    // Logic validations
    // Id shall be unique
    if (FinancialRepresentativeEntity.isEntityIdUnique(entityId) === false)
      return new Response(false, "هذا الكود مستخدم من قبل، إختر كود جديد");

    // Name shall be unique
    if (FinancialRepresentativeEntity.isNameUnique(name) === false)
      return new Response(false, "اسم الحساب مستخدم من قبل، استخدم اسم جديد");

    // accountsGroupId shall be exist
    if (
      accountsGroupId !== undefined &&
      AccountsGroupsModel.IsAccountsGroupIdExist(accountsGroupId) === false
    )
      return new Response(false, "تبويب الحسابات غير موجود");

    if (accountsGroupId === undefined) accountsGroupId = null;

    // Create Account entity
    const account = new AccountEntity(id, entityId, name, accountsGroupId);

    // Update transaction
    try {
      const response = AccountsModel.update(account);
      return new Response(true, "تم تحديث الحساب بنجاح", response);
    } catch (error) {
      return new Response(false, "فشل تحديث الحساب: " + error.message, null);
    }
  }

  static delete(id) {
    // Data Validations
    const deleteSchema = AccountEntity.idSchema;
    const { error } = deleteSchema.validate(id);
    if (error) return new Response(false, error.message);

    // Logic Validation: Cannot delete if it has transactions
    if (AccountsModel.isAccountIdHasTransaction(id) === true) {
      throw new Error("لا يمكن حذف حساب له معاملات مالية سابقة");
    }

    // Delete
    try {
      const response = AccountsGroupsModel.delete(id);
      return new Response(true, "تم حذف الحساب بنجاح", response);
    } catch (error) {
      return new Response(false, "فشل حذف الحساب: " + error.message, null);
    }
  }

  static getAccounts(page, pageSize) {
    // Data Validations
    const getSchema = Joi.object({
      page: Joi.number().integer().min(1).required(),
      pageSize: Joi.number().integer().min(1).required(),
    });

    const { error } = getSchema.validate({ page, pageSize });
    if (error) return new Response(false, error.message);

    // Get
    try {
      const response = AccountsModel.getAccounts(page, pageSize);
      return new Response(true, "تم الحصول على الحسابات بنجاح", response);
    } catch (error) {
      return new Response(
        false,
        "فشل الحصول على الحسابات: " + error.message,
        null
      );
    }
  }

  static getAccountById(id) {
    // Data Validations
    const getSchema = AccountEntity.idSchema;
    const { error } = getSchema.validate(id);
    if (error) return new Response(false, error.message);

    // Get
    try {
      const response = AccountsModel.getAccountById(id);
      return new Response(true, "تم الحصول على الحساب بنجاح", response);
    } catch (error) {
      return new Response(
        false,
        "فشل الحصول على الحساب: " + error.message,
        null
      );
    }
  }

  static getAccountsByEntityIdContains(partialEntityId, page, pageSize) {
    // Data Validations
    const getSchema = Joi.object({
      partialEntityId: Joi.string()
        .trim()
        .max(100)
        .pattern(/^[0-9]{1,100}$/),
      page: Joi.number().integer().min(1).required(),
      pageSize: Joi.number().integer().min(1).required(),
    });

    const { error } = getSchema.validate({ partialEntityId, page, pageSize });
    if (error) return new Response(false, error.message);

    // Get
    try {
      const response = AccountsModel.getAccountsByEntityIdContains(
        partialEntityId,
        page,
        pageSize
      );
      return new Response(true, "تم الحصول على الحسابات بنجاح", response);
    } catch (error) {
      return new Response(
        false,
        "فشل الحصول على الحسابات: " + error.message,
        null
      );
    }
  }

  static getAccountsByNameContains(partialName, page, pageSize) {
    // Data Validations
    const getSchema = Joi.object({
      partialName: Joi.string().trim().max(100),
      page: Joi.number().integer().min(1).required(),
      pageSize: Joi.number().integer().min(1).required(),
    });

    const { error } = getSchema.validate({ partialName, page, pageSize });
    if (error) return new Response(false, error.message);

    // Get
    try {
      const response = AccountsModel.getAccountsByNameContains(
        partialName,
        page,
        pageSize
      );
      return new Response(true, "تم الحصول على الحسابات بنجاح", response);
    } catch (error) {
      return new Response(
        false,
        "فشل الحصول على الحسابات: " + error.message,
        null
      );
    }
  }
}
