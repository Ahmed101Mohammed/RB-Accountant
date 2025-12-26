import {BaseDB} from "../BaseDB.js";

export class FinancialRepresentativeEntity
{
  static db = BaseDB.getDB();

  static isEntityIdUnique(id)
  {
    const command = FinancialRepresentativeEntity
      .db.prepare(`SELECT id
        FROM financial_representative_entity
        WHERE financial_representative_entity.entity_id = @id;`);
    const result = command.all({id});
    if(result.length > 0)
    {
      return false;
    }
    return true;
  }

  static isNameUnique(name)
  {
    const command = FinancialRepresentativeEntity
      .db.prepare(`SELECT id
        FROM financial_representative_entity
        WHERE financial_representative_entity.name = @name;`);
    const result = command.all({name});
    if(result.length > 0)
    {
      return false;
    }
    return true;
  }

  static get createFinancialRepresentativeEntityCommand()
  {
    return FinancialRepresentativeEntity
      .db.prepare(`INSERT INTO financial_representative_entity (entity_id, name, registration_time, last_update_time)
        VALUES (@entity_id, @name, @registration_time, @last_update_time);`);
  }

  static get updateFinancialRepresentativeEntityCommand()
  {
    return FinancialRepresentativeEntity
      .db.prepare(`UPDATE financial_representative_entity
        SET name = @name, 
          entity_id = @entity_id,
          last_update_time = @last_update_time
        WHERE id = @id;`);
  }

  static get deleteFinancialRepresentativeEntityCommand()
  {
    return FinancialRepresentativeEntity
      .db.prepare(`DELETE FROM financial_representative_entity
        WHERE id = @id;`);
  }
}