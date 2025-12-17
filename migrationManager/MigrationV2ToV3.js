import { SetupV3 } from "../setups/SetupV3.js"
import { TransactionsV2ToV3 } from "../features/transactions/migrations/migrationFromV2ToV3/TransactionsV2ToV3.js";
import { TransactionsDetailsV2ToV3 } from "../features/transactions/migrations/migrationFromV2ToV3/TransactionsDetailsV2ToV3.js";
import { FinancialRepresentativeEntityV3 } from "../models/financialRepresentativeEntity/setups/FinancialRepresentativeEntityV3.js";
import { AccountsGroupsV3 } from "../features/accountsGroups/setups/AccountsGroupsV3.js";
import { AccountsV2ToV3 } from "../features/accounts/migrations/migrationFromV2ToV3/AccountsV2ToV3.js";
import { AccountsV3 } from "../features/accounts/setups/AccountsV3.js";
import { EmployeesV2ToV3 } from "../features/employees/migrationFromV2ToV3/EmployeesV2ToV3.js";
import { ShiftsV3 } from "../features/shifts/setups/shifts/ShiftsV3.js";
import { ShiftsDetailsV3 } from "../features/shifts/setups/shiftsDetails/ShiftsDetailsV3.js";
import { EmployeesV3 } from "../features/employees/setups/employees/EmployeesV3.js";
import { PermanentEmployeesV3 } from "../features/employees/setups/permanentEmployees/PermanenetEmployeesV3.js";
import { MachineTypesV3 } from "../features/machineTypes/setups/MachineTypesV3.js";
import { MachinesV2ToV3 } from "../features/machines/migrations/migrationFromV2ToV3/MachinesV2ToV3.js";
import { MachinesV3 } from "../features/machines/setups/MachinesV3.js";
import { ProductRepresentativeEntityV3 } from "../models/productRepresentativeEntity/setups/ProductRepresentativeEntityV3.js";
import { RawMaterialsV3 } from "../features/rawMaterials/setups/RawMaterialsV3.js";
import { RawMaterialShapesV3 } from "../features/rawMaterialShapes/setups/RawMaterialShapesV3.js";
import { RawMaterialTypesV3 } from "../features/rawMaterialTypes/setups/RawMaterialTypesV3.js";
import { ProductsV2ToV3 } from "../features/products/migrations/migrationFromV2ToV3/ProductsV2ToV3.js";
import { ProductsV3 } from "../features/products/setups/ProductsV3.js";
import { ShiftsProductionV3 } from "../features/shiftsProduction/setups/shiftsProduction/ShiftsProductionV3.js";
import { ShiftsProductionDetailsV3 } from "../features/shiftsProduction/setups/shiftsProductionDetails/ShiftsProductionDetailsV3.js";
import { ShiftsProductionV2ToV3 } from "../features/shiftsProduction/migrations/migrationFromV2ToV3/ShiftsProductionV2ToV3.js";
import { ShiftsProductionDetailsV2ToV3 } from "../features/shiftsProduction/migrations/migrationFromV2ToV3/ShiftsProductionDetailsV2ToV3.js";
import { BaseDB } from "../models/BaseDB.js";
import { TransactionsDetailsV3 } from "../features/transactions/setups/transactionsDetails/TransactionsDetailsV3.js";
import { TransactionsV3 } from "../features/transactions/setups/transactions/TransactionsV3.js";

export class MigrationV2ToV3 {
  static updateDBVersion = 'user_version = 3';
  static migrations = [
    // Accounts & Employees Migration
    FinancialRepresentativeEntityV3.createTableCommand,

    AccountsGroupsV3.createTableCommand,

    AccountsV2ToV3.renameOldTable,
    AccountsV2ToV3.insertOldAccountsToFinancialRepresentativeEntity,
    AccountsV3.createTableCommand,

    EmployeesV2ToV3.insertEmployeesToFinancialRepresentativeEntity,

    AccountsV2ToV3.insertFinancialRepresentativeEntitiesToAccounts,

    EmployeesV2ToV3.renameOldShiftsTable, // Renaming old shifts table

    ShiftsV3.createTableCommand,
    ShiftsDetailsV3.createTableCommand,

    EmployeesV2ToV3.createDefaultShift,
    EmployeesV2ToV3.createDefaultShiftDetails,

    EmployeesV2ToV3.addAccountIdColumn,
    EmployeesV2ToV3.addShiftIdColumn,
    EmployeesV2ToV3.addRegistrationTimeColumn,
    EmployeesV2ToV3.addLastUpdateTimeColumn,

    EmployeesV2ToV3.updateAccountIdForEmployees,
    EmployeesV2ToV3.updateShiftIdForEmployees,
    EmployeesV2ToV3.updateRegistrationTimeAndLastUpdateTimeForEmployees,

    EmployeesV2ToV3.renameEmployeesTableToOldEmployees,
    EmployeesV3.createTableCommand,
    EmployeesV2ToV3.insertOldEmployeesToEmployees,

    PermanentEmployeesV3.createTableCommand,
    EmployeesV2ToV3.insertAllEmployeesToPermenantEmployees,

    // Transactions Migration
    TransactionsDetailsV2ToV3.changeTableName,
    
    TransactionsDetailsV2ToV3.addCommentColumn,
    TransactionsDetailsV2ToV3.updateCommentColumn,
    TransactionsDetailsV2ToV3.addNewRoleColumn,
    TransactionsDetailsV2ToV3.updateNewRoleColumn,
    TransactionsDetailsV2ToV3.deleteRoleColumn,
    TransactionsDetailsV2ToV3.changeNewRoleColumnName,
    TransactionsDetailsV2ToV3.addAccountNewIdColumn,
    TransactionsDetailsV2ToV3.updateAccountNewIdColumn,

    TransactionsV2ToV3.deleteCommentColumn,
    TransactionsV2ToV3.addRegistrationTimeColumn,
    TransactionsV2ToV3.addLastUpdateTimeColumn,
    TransactionsV2ToV3.updateTransactionsRegistrationTimeAndLastUpdateTime,

    TransactionsV3.createTableCommand,
    TransactionsDetailsV3.createTableCommand,

    TransactionsV2ToV3.insertAllTransactionsHeadsToTransactions,
    TransactionsDetailsV2ToV3.insertAllOldTransactionToTransactionsDetails,

    TransactionsDetailsV2ToV3.deleteOldTransactionsTable,
    TransactionsV2ToV3.deleteTransactionsHeadsTable,

    // Machines
    MachineTypesV3.createTableCommand,
    MachinesV2ToV3.insertDefaultMachineType,
    MachinesV2ToV3.addMachineTypeIdColumn,
    MachinesV2ToV3.updateMachineTypeIdForMachines,
    MachinesV2ToV3.renameMachinesTableToOldMachines,
    MachinesV3.createTableCommand,
    MachinesV2ToV3.insertOldMachineToMachines,

    // Products
    ProductRepresentativeEntityV3.createTableCommand,
    RawMaterialsV3.createTableCommand,
    RawMaterialShapesV3.createTableCommand,
    RawMaterialTypesV3.createTableCommand,
    ProductsV3.createTableCommand,

    ProductsV2ToV3.updateItemsIds,
    ProductsV2ToV3.insertDefaultProductRepresentativeEntity,
    ProductsV2ToV3.insertDefaultRawMaterialType,
    ProductsV2ToV3.insertDefaultRawMaterialShape,
    ProductsV2ToV3.insertDefaultRawMaterial,
    ProductsV2ToV3.insertProductRepresentativeEntitiesForItems,

    ProductsV2ToV3.addProductRepresentativeEntityIdColumnToItems,
    ProductsV2ToV3.updateProductRepresentativeEntityIdForItems,
    ProductsV2ToV3.insertOldProductsToProducts,

    // Shift Production
    ShiftsProductionV3.createTableCommand,
    ShiftsProductionDetailsV3.createTableCommand,
    ShiftsProductionV2ToV3.insertOldShiftsToShiftsProduction,
    ShiftsProductionDetailsV2ToV3.insertOldShiftsProductionDetailsToShiftsProductionDetails,

    ShiftsProductionDetailsV2ToV3.deleteShiftsItemsAssignments,
    ShiftsProductionDetailsV2ToV3.deleteShiftsItemsAccounts,
    ShiftsProductionDetailsV2ToV3.deleteShiftsItems,
    ShiftsProductionV2ToV3.deleteOldShiftsTable, // Deleting old shifts table
    ShiftsProductionV2ToV3.deleteDailyProductionTable,

    AccountsV2ToV3.deleteOldTable,
    EmployeesV2ToV3.deleteOldEmployees,
    MachinesV2ToV3.deleteOldMachines,
    ProductsV2ToV3.deleteItemsTable,
    // setup dbv3
    ...SetupV3.setups
  ];

  static checkEachEmployeeOrClientHaveUniqueId = {
    run: function()
      {
        const db = BaseDB.getDB();
        const query = db.prepare(`SELECT id
            FROM employees
            WHERE id IN ( SELECT id 
              FROM accounts
            )
          `);
        const ids = query.all();
        if(ids.length > 0)
        {
          throw new Error(`هذه الأكواد ${ids.map(idObject => idObject.id).join(', ')} مشتركة بي عدد من الموظفين والحسابات، يجب أن تعود للإصدار القديم (v2)، وجعل كل حساب وموظف له كود مميز.`)
        }
        return true;
      }
  }

  static checks = [MigrationV2ToV3.checkEachEmployeeOrClientHaveUniqueId]
}
