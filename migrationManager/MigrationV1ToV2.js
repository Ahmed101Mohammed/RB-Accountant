import { TransactionsV1ToV2 } from "../features/transactions/migrations/migrationFromV1ToV2/TransactionsV1ToV2.js";
import { TransactionsDetailsV1ToV2 } from "../features/transactions/migrations/migrationFromV1ToV2/TransactionsDetailsV1ToV2.js";
import { SetupV2 } from "../setups/SetupV2.js";

export class MigrationV1ToV2
{
  static updateDBVersion = 'user_version = 2';
  static migrations = [
    TransactionsDetailsV1ToV2.deleteTransactionsOfDeletedAccounts,
    TransactionsV1ToV2.changeTableName, 
    TransactionsDetailsV1ToV2.createTransactionsDetailsTable, 
    TransactionsDetailsV1ToV2.insertDataFromTransactionsHeadsTable,
    TransactionsV1ToV2.deleteAmountColumn,
    TransactionsV1ToV2.deleteCreditorIdColumn,
    TransactionsV1ToV2.deleteDebtorIdColumn,
    TransactionsDetailsV1ToV2.deleteIncompleteTransactions,
    TransactionsV1ToV2.deleteOrphanedTransactionsHeads,

    // setup dbv2
    ...SetupV2.setups
  ]

  static checks = [];
}