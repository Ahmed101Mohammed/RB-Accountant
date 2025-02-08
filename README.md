# RB Accountant 
## Tasks
- [ ] Build the app *Abstract Data*
  - [ ] Build AbstractData class.
  - [ ] Build Account class.
  - [ ] Build Transaction class.
  - [ ] Build Double class.

- [ ] Build the Response class.

- [ ] Build the back-end of the account logic.
  - [ ] Build the **AccountModel** class.
  - [ ] Build the **AccountController** class.

- [ ] Build the front-end of the account logic (This page will called: "الحسابات").

  - [ ] Build header that contain:
      - [ ] Word or Icon to navigate to **main page** (it will build later).
      - [ ] 2 Inputs to filter/search accounts by name or id.
      
  - [ ] Build Form to create an account (The form will be in the left side of the page, in fixed position):
    - [ ] The form will contain:
      - [ ] 2 Inputs:
        - [ ] Input for the *name*, this input will called in your UI "إسم الحساب".
        - [ ] Input for the *id*, this input will called in your UI "كود الحساب".
      - [ ] One button named "create".

  - [ ] The remainder space will be for the table which contain all accounts.
    - [ ] The table header will be fixed position and contain: | اسم الحساب | كود الحساب |
    - [ ] When the client click on a row, the data of the raw will present on the form and the form button  will changed to "edit", and another button will apear with name "delete".
    - [ ] Don't delete directly UI should pop a confirm message.
    - [ ] When an entity updated or delated the parts changed from the table will updated directly in UI after confirm that the change is done in the DB.

- [ ] Build the back-end of the transaction logic.
  - [ ] Build the **TransactionModel** class.
  - [ ] Build the **TransactionController** class.

- [ ] Build the front-end of the transaction logic (Thid page will called: "المعاملات اليومية").

  - [ ] Build header that contain:
    - [ ] Word or Icon to navigate to **main page** (it will build later).
    - [ ] 2 Inputs to filter/search transactions by startPeriod and endPeriod.

  - [ ] Build Form to create an account (The form will be in the left side of the page, in fixed position):
    - [ ] The form will contain:
      - [ ] 5 Inputs:
        - [ ] Input for the *creditor_id*, this input will called in your UI "كود الدائن".
        - [ ] Input for the *debtor_id*, this input will called in your UI "كود المدين".
        - [ ] Input for the *transaction_ammount*, this input will called in your UI "الدفعه".
        - [ ] Input for the *comment*, this input will called in your UI "ملاحظة"
        - [ ] Input for the *date*, this input value by default the current data, and it called in your UI "تاريخ المعاملة" 
      - [ ] One button for creation named "إنشاء".

  - [ ] The remainder space will be for the table which contain all transactions.
    - [ ] The table header will be fixed position and contain: 
    | كود المعاملة | تاريخ المعاملة | مبلغ المعاملة | كود المدين | اسم حساب المدين | كود الدائن | اسم حساب الدائن | ملاحظة |
    - [ ] When the client click on a row, the data of the raw will present on the form and the form button  will changed to "edit", and another button will apear with name "delete". 
    - [ ] Don't delete directly UI should pop a confirm message.
    - [ ] When an entity updated or delated the parts changed from the table will updated directly in UI after confirm that the change is done in the DB.

- [ ] Build the front-end of the transaction logic (Thid page will called: "كشف حساب").
  - [ ] Build header that contain:
    - [ ] Word or Icon to navigate to **main page** (it will build later).
  - [ ] Build secondary header that contain form contain:
    - [ ] 3 inputs:
      - [ ] Input for the *startPeriod*, this input will called in your UI "بداية الفترة".
      - [ ] Input for the *endPeriod*, this input will called in your UI "نهاية الفترة".
      - [ ] Input for the *accountCode*, this input will called in your UI "كود الحساب".
    - [ ] Button called in your UI "كشف معاملات الحساب"
  - [ ] When client click on "كشف معاملات الحساب" and the data recived from the server the sub secondary headery will appear and it will present:
    - [ ] The title: معاملات اسم الحساب 
    - [ ] accoutn id: "كود الحساب"
    - [ ] accoutn name: "اسم الحساب"
    - [ ] start period: "من"
    - [ ] end period: "إلى"
    - [ ] account balance before the period directly: "الرصيد أول الفترة"
    - [ ] account balance after the period directly: "الرصيد آخر الفترة"
  - [ ] When client click on "كشف معاملات الحساب" and the data recived from the server in the remainder space the table will created:
    - [ ] The table header will be fixed and contain:
      | كود المعاملة | تاريخ المعاملة | مبلغ المعاملة | حالة الحساب | رصيد الحساب | ملاحظة |
      

