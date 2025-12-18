import { FinancialRepresentativeEntityV3 } from "../models/financialRepresentativeEntity/setups/FinancialRepresentativeEntityV3.js";
import { AccountsGroupsV3 } from "../features/accountsGroups/setups/AccountsGroupsV3.js";
import { AccountsV3 } from "../features/accounts/setups/AccountsV3.js";
import { ClientsV3 } from "../features/clients/setups/ClientsV3.js";
import { ShiftsV3 } from "../features/shifts/setups/shifts/ShiftsV3.js";
import { ShiftsDetailsV3 } from "../features/shifts/setups/shiftsDetails/ShiftsDetailsV3.js";
import { EmployeesV3 } from "../features/employees/setups/employees/EmployeesV3.js";
import { PermanentEmployeesV3 } from "../features/employees/setups/permanentEmployees/PermanenetEmployeesV3.js";
import { CasualEmployeesV3 } from "../features/employees/setups/casualEmployees/CasualEmployeesV3.js";
import { TechniciansV3 } from "../features/technicians/setups/TechniciansV3.js";
import { ProductRepresentativeEntityV3 } from "../models/productRepresentativeEntity/setups/ProductRepresentativeEntityV3.js";
import { RawMaterialTypesV3 } from "../features/rawMaterialTypes/setups/RawMaterialTypesV3.js";
import { RawMaterialShapesV3 } from "../features/rawMaterialShapes/setups/RawMaterialShapesV3.js";
import { RawMaterialsV3 } from "../features/rawMaterials/setups/RawMaterialsV3.js";
import { ProductsV3 } from "../features/products/setups/ProductsV3.js";
import { MachineTypesV3 } from "../features/machineTypes/setups/MachineTypesV3.js";
import { MachinesV3 } from "../features/machines/setups/MachinesV3.js";
import { MachinesFaultsV3 } from "../features/machinesFaults/setups/MachinesFaultsV3.js";
import { ProductionRatesV3 } from "../features/productionRates/setups/ProductionRatesV3.js";
import { ShiftsProductionV3 } from "../features/shiftsProduction/setups/shiftsProduction/ShiftsProductionV3.js";
import { ShiftsProductionDetailsV3 } from "../features/shiftsProduction/setups/shiftsProductionDetails/ShiftsProductionDetailsV3.js";
import { NonProductivePeriodsV3 } from "../features/nonProductivePeriods/setups/nonProductivePeriods/NonProductivePeriodsV3.js"; 
import { NonProductiveDurationsV3 } from "../features/nonProductivePeriods/setups/nonProductiveDurations/NonProductiveDurationsV3.js";
import { NonProductiveTimeBlocksV3 } from "../features/nonProductivePeriods/setups/nonProductiveTimeBlocks/NonProductiveTimeBlocksV3.js";
import { TransactionsV3 } from "../features/transactions/setups/transactions/TransactionsV3.js";
import { TransactionsDetailsV3 } from "../features/transactions/setups/transactionsDetails/TransactionsDetailsV3.js";

export class SetupV3
{
  static setups = [
    FinancialRepresentativeEntityV3.createTableCommand,
    AccountsGroupsV3.createTableCommand,
    AccountsV3.createTableCommand,
    ClientsV3.createTableCommand,
    ShiftsV3.createTableCommand,
    ShiftsDetailsV3.createTableCommand,
    EmployeesV3.createTableCommand,
    PermanentEmployeesV3.createTableCommand,
    CasualEmployeesV3.createTableCommand,
    TechniciansV3.createTableCommand,
    ProductRepresentativeEntityV3.createTableCommand,
    RawMaterialTypesV3.createTableCommand,
    RawMaterialShapesV3.createTableCommand,
    RawMaterialsV3.createTableCommand,
    ProductsV3.createTableCommand,
    MachineTypesV3.createTableCommand,
    MachinesV3.createTableCommand,
    MachinesFaultsV3.createTableCommand,
    ProductionRatesV3.createTableCommand,
    ShiftsProductionV3.createTableCommand,
    ShiftsProductionDetailsV3.createTableCommand,
    NonProductivePeriodsV3.createTableCommand,
    NonProductiveDurationsV3.createTableCommand,
    NonProductiveTimeBlocksV3.createTableCommand,
    TransactionsV3.createTableCommand,
    TransactionsDetailsV3.createTableCommand
  ]
}