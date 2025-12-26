import Joi from "joi";
import { FinancialRepresentativeEntity } from "../../../models/financialRepresentativeEntity/entities/FinancialRepresentativeEntity.js"

export class LightAccountsGroup
{
  static entityIdSchema = FinancialRepresentativeEntity.entityIdSchema;
  static nameSchema = FinancialRepresentativeEntity.nameSchema;
  static accountsGroupIdSchema = Joi
    .number()
    .integer()
    .min(1);

  #entityId
  #name
  #accountsGroupId

  constructor(entityId, name, accountsGroupId)
  {
    this.entityId = entityId;
    this.name = name;
    this.accountsGroupId = accountsGroupId;
  }

  static isLightAccountsGroup(object)
  {
    return object instanceof LightAccountsGroup;
  }

  print()
  {
    console.log({
      entityId: this.entityId, 
      name: this.name, 
      accountsGroupId: this.accountsGroupId
    });
  }

  get entityId()
  {
    return this.#entityId;
  }

  set entityId(entityId)
  {
    const {error, value} = LightAccountsGroup.entityIdSchema.validate(entityId);
    if(error) throw new Error(error.message);
    this.#entityId = value;
  }

  get name()
  {
    return this.#name;
  }

  set name(name)
  {
    const {error, value} = LightAccountsGroup.nameSchema.validate(name);
    if(error) throw new Error(error.message);
    this.#name = value;
  }

  get accountsGroupId()
  {
    return this.#accountsGroupId;
  }

  set accountsGroupId(accountsGroupId)
  {
    const {error, value} = LightAccountsGroup.accountsGroupIdSchema.validate(accountsGroupId);
    if(error) throw new Error(error.message);
    this.#accountsGroupId = value;
  }
}