import Joi from "joi";
import { FinancialRepresentativeEntity } from "../../../models/financialRepresentativeEntity/entities/FinancialRepresentativeEntity.js";
import { LightAccountsGroup } from "../../accountsGroups/entities/LightAccountsGroup.js";
export class LightAccount {
  static entityIdSchema = FinancialRepresentativeEntity.entityIdSchema;
  static nameSchema = FinancialRepresentativeEntity.nameSchema;
  static accountsGroupIdSchema = LightAccountsGroup.accountsGroupIdSchema;

  #entityId;
  #name;
  #accountsGroupId;

  constructor(entityId, name, accountsGroupId) {
    this.entityId = entityId;
    this.name = name;
    this.accountsGroupId = accountsGroupId;
  }

  static isLightAccount(object) {
    return object instanceof LightAccount;
  }

  print() {
    console.log({
      entityId: this.entityId,
      name: this.name,
      accountsGroupId: this.accountsGroupId,
    });
  }

  get entityId() {
    return this.#entityId;
  }

  set entityId(entityId) {
    const { error, value } = LightAccount.entityIdSchema.validate(entityId);
    if (error) throw new Error(error.message);
    this.#entityId = value;
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    const { error, value } = LightAccount.nameSchema.validate(name);
    if (error) throw new Error(error.message);
    this.#name = value;
  }

  get accountsGroupId() {
    return this.#accountsGroupId;
  }

  set accountsGroupId(accountsGroupId) {
    const { error, value } =
      LightAccount.accountsGroupIdSchema.validate(accountsGroupId);
    if (error) throw new Error(error.message);
    this.#accountsGroupId = value;
  }
}
