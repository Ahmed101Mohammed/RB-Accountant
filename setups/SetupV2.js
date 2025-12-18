import { TransactionsV2 } from "../features/transactions/setups/transactions/TransactionsV2.js";
import { TransactionsDetailsV2 } from "../features/transactions/setups/transactionsDetails/TransactionsDetailsV2.js";
import { EmployeesV2 } from "../features/employees/setups/employees/EmployeesV2.js";
import { MachinesV2 } from "../features/machines/setups/MachinesV2.js";
import { ProductsV2 } from "../features/products/setups/ProductsV2.js";
import { ShiftsProductionV2 } from "../features/shiftsProduction/setups/shiftsProduction/ShiftsProductionV2.js";
import { ShiftsProductionDetailsV2 } from "../features/shiftsProduction/setups/shiftsProductionDetails/ShiftsProductionDetailsV2.js";


export class SetupV2
{
  static setups = [
    TransactionsV2.createTableCommand,
    TransactionsDetailsV2.createTableCommand,
    EmployeesV2.createTableCommand,
    MachinesV2.createTableCommand,
    ProductsV2.createTableCommand,
    ShiftsProductionV2.createTableCommand,
    ShiftsProductionDetailsV2.createTableCommand1,
    ShiftsProductionDetailsV2.createTableCommand2,
    ShiftsProductionDetailsV2.createTableCommand3,
    ShiftsProductionDetailsV2.createTableCommand4
  ]
}