import { TransactionsV2ToV3 } from "../features/transactions/migrations/migrationFromV2ToV3/TransactionsV2ToV3.js";
import { TransactionsDetailsV2ToV3 } from "../features/transactions/migrations/migrationFromV2ToV3/TransactionsDetailsV2ToV3.js";
import { FinancialRepresentativeEntity } from "../models/FinancialRepresentativeEntity.js";
import { AccountsGroups } from "../features/accountsGroups/models/AccountsGroups.js";
import { AccountsV2ToV3 } from "../features/accounts/migrations/migrationFromV2ToV3/AccountsV2ToV3.js";
import { Accounts } from "../features/accounts/models/Accounts.js";
import { EmployeesV2ToV3 } from "../features/employees/migrationFromV2ToV3/EmployeesV2ToV3.js";
import { Shifts } from "../features/shifts/models/Shifts.js";
import { ShiftsDetails } from "../features/shifts/models/ShiftsDetails.js";
import { Employees } from "../features/employees/models/Employees.js";
import { PermanentEmployees } from "../features/employees/models/PermanentEmployees.js";
import { MachineTypes } from "../features/machineTypes/models/MachineTypes.js";
import { MachinesV2ToV3 } from "../features/machines/migrations/migrationFromV2ToV3/MachinesV2ToV3.js";
import { Machines } from "../features/machines/models/Machines.js";
import { ProductRepresentativeEntity } from "../models/ProductRepresentativeEntity.js";
import { RawMaterials } from "../features/rawMaterials/models/RawMaterial.js";
import { RawMaterialShapes } from "../features/rawMaterialShapes/models/RawMaterialShapes.js";
import { RawMaterialTypes } from "../features/rawMaterialTypes/models/RawMaterialTypes.js";
import { ProductsV2ToV3 } from "../features/products/migrations/migrationFromV2ToV3/ProductsV2ToV3.js";
import { Products } from "../features/products/models/Products.js";
export class MigrationV2ToV3 {
  static migrations = [
    // Transactions Migration
    TransactionsDetailsV2ToV3.changeTableName,
    TransactionsDetailsV2ToV3.addCommentColumn,
    TransactionsDetailsV2ToV3.updateCommentColumn,
    TransactionsDetailsV2ToV3.addNewRoleColumn,
    TransactionsDetailsV2ToV3.updateNewRoleColumn,
    TransactionsDetailsV2ToV3.deleteRoleColumn,
    TransactionsDetailsV2ToV3.changeNewRoleColumnName,

    TransactionsV2ToV3.changeTableName,
    TransactionsV2ToV3.deleteCommentColumn,
    TransactionsV2ToV3.addRegistrationTimeColumn,
    TransactionsV2ToV3.addLastUpdateTimeColumn,

    // Accounts & Employees Migration
    FinancialRepresentativeEntity.createTableCommand,

    AccountsGroups.createTableCommand,

    AccountsV2ToV3.renameOldTable,
    AccountsV2ToV3.insertOldAccountsToFinancialRepresentativeEntity,
    AccountsV2ToV3.deleteOldTable,
    Accounts.createTableCommand,

    EmployeesV2ToV3.insertEmployeesToFinancialRepresentativeEntity,

    AccountsV2ToV3.insertFinancialRepresentativeEntitiesToAccounts,

    Shifts.createTableCommand,
    ShiftsDetails.createTableCommand,

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
    Employees.createTableCommand,
    EmployeesV2ToV3.insertOldEmployeesToEmployees,

    PermanentEmployees.createTableCommand,
    EmployeesV2ToV3.insertAllEmployeesToPermenantEmployees,

    // Machines
    MachineTypes.createTableCommand,
    MachinesV2ToV3.insertDefaultMachineType,
    MachinesV2ToV3.addMachineTypeIdColumn,
    MachinesV2ToV3.updateMachineTypeIdForMachines,
    MachinesV2ToV3.renameMachinesTableToOldMachines,
    Machines.createTableCommand,
    MachinesV2ToV3.insertOldMachineToMachines,
    MachinesV2ToV3.deleteOldMachines,

    // Products
    ProductRepresentativeEntity.createTableCommand,
    RawMaterials.createTableCommand,
    RawMaterialShapes.createTableCommand,
    RawMaterialTypes.createTableCommand,
    Products.createTableCommand,

    ProductsV2ToV3.insertOldProductsToProductRepresentativeEntity,
    ProductsV2ToV3.insertDefaultProductRepresentativeEntity,
    ProductsV2ToV3.insertDefaultRawMaterialType,
    ProductsV2ToV3.insertDefaultRawMaterialShape,
    ProductsV2ToV3.insertDefaultRawMaterial,
    ProductsV2ToV3.insertProductRepresentativeEntitiesForItems,

    ProductsV2ToV3.addProductRepresentativeEntityIdColumnToItems,
    ProductsV2ToV3.updateProductRepresentativeEntityIdForItems,
    ProductsV2ToV3.insertOldProductsToProducts,
    ProductsV2ToV3.deleteItemsTable,

    // Shift Production
  ];
}
