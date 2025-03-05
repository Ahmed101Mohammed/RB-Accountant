class Account
{
  #id;
  #name;
  constructor(id, name)
  {
    this.#id = id
    this.#name = name
  }

  getId()
  {
    return this.#id
  }

  getName()
  {
    return this.#name
  }

  toJson()
  {
    return {
      id: this.getId(),
      name: this.getName()
    }
  }

  static isAccount(object)
  {
    return object instanceof Account
  }

  static createMultibleAccountsEntities(accountsData)
  {
    let accounts = [];
    for(let account of accountsData)
    {
      let newAccount = new Account(account.id, account.name)
      accounts.push(newAccount)
    }
    return accounts
  }

  static print(account)
  {
    if(Account.isAccount(account))
    {
      console.log({id: account.getId(), name: account.getName()})
    }
  }
}

export default Account