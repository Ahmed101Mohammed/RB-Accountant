import Joi from "joi";
import { FinancialRepresentativeEntity } from "../../../models/financialRepresentativeEntity/entities/FinancialRepresentativeEntity.js";

export class AccountsGroup
{
  #id = null;
  #entityId = null;
  #name = null;
  #accountsGroupName = null;

  static idSchema = Joi
    .number()
    .integer()
    .min(1)

  static entityIdSchema = FinancialRepresentativeEntity.entityIdSchema;

  static nameSchema = FinancialRepresentativeEntity.nameSchema;

  constructor(id, entityId, name, accountsGroupName)
  {
    this.id = id;
    this.entityId = entityId;
    this.name = name;
    this.accountsGroupName = accountsGroupName;
  }

  static isAccountGroup(object)
  {
    return object instanceof AccountsGroup;
  }

  print()
  {
    console.log({
      id: this.id,
      entityId: this.entityId,
      name: this.name,
      accountsGroupName: this.accountsGroupName
    });
  }
  toJson()
  {
    return {
      id: this.id,
      entityId: this.entityId,
      name: this.name,
      accountsGroupName: this.accountsGroupName
    };
  }

  get id()
  {
    return this.#id;
  }

  set id(id)
  {
    const {error, value} = AccountsGroup.idSchema.validate(id);
    if(error) throw new Error(error.message);
    this.#id = value;
  }

  get entityId()
  {
    return this.#entityId;
  }

  set entityId(entityId)
  {
    const {error, value} = AccountsGroup.entityIdSchema.validate(entityId);
    if(error) throw new Error(error.message);
    this.#entityId = value;
  }

  get name()
  {
    return this.#name;
  }

  set name(name)
  {
    const {error, value} = AccountsGroup.nameSchema.validate(name);
    if(error) throw new Error(error.message);
    this.#name = value;
  }

  get accountsGroupName()
  {
    return this.#accountsGroupName;
  }

  set accountsGroupName(accountsGroupName)
  {
    const {error, value} = AccountsGroup.nameSchema.validate(accountsGroupName);
    if(error) throw new Error(error.message);
    this.#accountsGroupName = value;
  }
}