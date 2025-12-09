import BaseDB from "../../../models/BaseDB.js";

export class RawMaterials
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS raw_materials(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  product_representative_entity_id INTEGER UNIQUE NOT NULL,
                  raw_material_type_id INTEGER UNIQUE NOT NULL,
                  raw_material_shape_id_of_external_diameter INTEGER UNIQUE NOT NULL,
                  external_diameter INTEGER NOT NULL CHECK (external_diameter BETWEEN 1 AND 1000000000000000),
                  raw_material_shape_id_of_internal_diameter INTEGER UNIQUE NOT NULL,
                  internal_diameter INTEGER NOT NULL CHECK (internal_diameter BETWEEN 0 AND 1000000000000000),
                  registration_time TEXT NOT NULL,
                  last_update_time TEXT NOT NULL,
                  
                  FOREIGN KEY (product_representative_entity_id) REFERENCES product_representative_entity(id),
                  FOREIGN KEY (raw_material_type_id) REFERENCES raw_material_types(id),
                  FOREIGN KEY (raw_material_shape_id_of_external_diameter) REFERENCES raw_material_shapes(id),
                  FOREIGN KEY (raw_material_shape_id_of_internal_diameter) REFERENCES raw_material_shapes(id),
                  CHECK (internal_diameter < external_diameter)
                  
                ) STRICT`
              );
  
}