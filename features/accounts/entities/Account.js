import Joi from "joi";
import { FinancialRepresentativeEntity } from "../../../models/financialRepresentativeEntity/entities/FinancialRepresentativeEntity";

export class Account {
  #id = null;
  #entityId = null;
  #name = null;
  #accountsGroupName = null;
  static idSchema = Joi.number().integer().min(1);

  static entityIdSchema = FinancialRepresentativeEntity.entityIdSchema;

  static nameSchema = FinancialRepresentativeEntity.nameSchema;

  // static nameSearchSchema = Joi.string()
  //   .pattern(/^[^\d].*$/, "اسم الحساب يجب أن يبدأ بحرف")
  //   .max(100)
  //   .messages({
  //     "string.base": "يجب أن يكون الإسم نصا",
  //     "string.min": "يجب أن يحتوي الإسم على حرفان على الأقل",
  //     "string.max": "إسم الحساب يجب أن لا يتجاوز 100 حرفا",
  //     "any.required": "يجب أن يكون للحساب اسم",
  //     "string.pattern.base": "اسم الحساب يجب أن يبدأ بحرف",
  //   });

  constructor(id, entityId, name, accountsGroupName) {
    this.entityId = entityId;
    this.accountsGroupName = accountsGroupName;
    this.id = id;
    this.name = name;
  }

  static isAccount(object) {
    return object instanceof Account;
  }

  print() {
    console.log({
      id: this.id,
      entityId: this.entityId,
      name: this.name,
      accountsGroupName: this.accountsGroupName,
    });
  }
  toJson() {
    return {
      id: this.id,
      entityId: this.entityId,
      name: this.name,
      accountsGroupName: this.accountsGroupName,
    };
  }

  get id() {
    return this.#id;
  }

  set id(id) {
    const { error, value } = Account.idSchema.validate(id);
    if (error) throw new Error(error.message);
    this.#id = value;
  }

  get entityId() {
    return this.#entityId;
  }

  set entityId(entityId) {
    const { error, value } = Account.entityIdSchema.validate(entityId);
    if (error) throw new Error(error.message);
    this.#entityId = value;
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    const { error, value } = Account.nameSchema.validate(name);
    if (error) throw new Error(error.message);
    this.#name = value;
  }

  get accountsGroupName() {
    return this.#accountsGroupName;
  }

  set accountsGroupName(accountsGroupName) {
    const { error, value } = Account.nameSchema.validate(accountsGroupName);
    if (error) throw new Error(error.message);
    this.#accountsGroupName = value;
  }
}
