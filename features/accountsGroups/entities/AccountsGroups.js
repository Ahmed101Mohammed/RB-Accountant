import { AccountsGroup } from "./AccountsGroup.js";

export class AccountsGroups
{
  #accountsGroups = [];
  
  constructor(){}
  get accountsGroups()
  {
    return this.#accountsGroups;
  }

  push(accountsGroup)
  {
    if(AccountsGroup.isAccountGroup(accountsGroup) === false)
      throw new Error("Invalid accountsGroup, it must be instance of AccountsGroup");
    this.#accountsGroups.push(accountsGroup);
  }

  toJson()
  {
    return this.accountsGroups.map(accountsGroup => accountsGroup.toJson());
  }
}