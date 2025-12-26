# Tasks
- [X] Add the pagination for getAccountsGroups
- [X] Seperate the model and controller of AccountsGroups feature 
- [ ] Add getAccountsGroup api.

# Bonus features
- Ability to print the results of "Get transactions for specific account in date range." feature.
- Make your db queries more accurate, and check that the queries done and all saved, or failed, and reaturn to the last state.

# Bug
- Transaction header can created without transaction body. that mean if the transaction body creation fail, this lead to header without body.
- When user click on transaction entity in transactions page, then he can edit, cancel, or delete, but when he click another entity, the date of entity appear but the edit, delete, and cancel features disapear, untile the next click.
- Your accont services is not flixable, because user can't change the account, id; because this will lead to a alot of realted changes. (the soluion is internal_id seprate that the id, user show)
- Your db is weak, because, you not make the descripe the reslations of "forigen kays and so on, that save your db integrity".