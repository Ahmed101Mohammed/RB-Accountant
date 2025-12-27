import { Account } from "./Account.js";

export class Accounts {
  #accounts = [];

  constructor() {}
  get accounts() {
    return this.#accounts;
  }

  push(account) {
    if (Account.isAccount(account) === false)
      throw new Error("Invalid account, it must be instance of Account");
    this.#accounts.push(account);
  }

  toJson() {
    return this.accounts.map((account) => account.toJson());
  }
}
