# App features from user prespective
- [X] Create new account.
- [X] Get data of an account by code or name.
- [X] Edit account data
- [ ] Delete an account with delete button (verify button to delete all the transactions related to the account (metion the number of transactions)).
- [X] Create new transaction.
- [X] Get all transactions.
- [X] Edit transaction.
- [X] Delete transaction.
- [ ] Can get account statement: by adding the account code he get all transactions from first transaction to the last one, then he can specify the data.
- [X] Create worker.
- [X] GEt workers.
- [ ] Get Worker by code or name.
- [ ] Delete woker with any related data (now their no related data).
- [X] Edit worker data.
- [ ] Create machien.
- [ ] Get machien with name or code.
- [ ] Get all machiens.
- [ ] Delete machien with any related data.
- [ ] Update machien.
- [ ] Create product.
- [ ] Get Products.
- [ ] Get Product with code or name.
- [ ] Delete Product with any related data.
- [ ] Update Product.

# Bonus features
- Ability to print the results of "Get transactions for specific account in date range." feature.
- Make your db queries more accurate, and check that the queries done and all saved, or failed, and reaturn to the last state.

# Bug
- Transaction header can created without transaction body. that mean if the transaction body creation fail, this lead to header without body.
- When user click on transaction entity in transactions page, then he can edit, cancel, or delete, but when he click another entity, the date of entity appear but the edit, delete, and cancel features disapear, untile the next click.
- Your accont services is not flixable, because user can't change the account, id; because this will lead to a alot of realted changes. (the soluion is internal_id seprate that the id, user show)
- Your db is weak, because, you not make the descripe the reslations of "forigen kays and so on, that save your db integrity".