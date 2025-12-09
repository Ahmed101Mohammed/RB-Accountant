import BaseDB from "../../../../models/BaseDB.js";
import { currentTimeStamp } from "../../../../utils/currentTimeStamp.js";

export class ProductsV2ToV3 {
  static db = BaseDB.getDB();

  static insertOldProductsToProductRepresentativeEntity = this.db
    .prepare(`INSERT INTO product_representative_entity (entity_id, name, registration_time, last_update_time)
    SELECT id, name, '${currentTimeStamp()}', '${currentTimeStamp()}'
    FROM items;`);

  static insertDefaultProductRepresentativeEntity = this.db
    .prepare(`INSERT INTO product_representative_entity (entity_id, name, registration_time, last_update_time)
    VALUES ('0-0', 'Default Product Representative entity', '${currentTimeStamp()}', '${currentTimeStamp()}');`);

  static insertDefaultRawMaterialType = this.db
    .prepare(`INSERT INTO raw_material_types (raw_material_type_id, name, density, price, recycling_price, registration_time, last_update_time)
    VALUES ('0-0', 'Default Raw Material Type', 0.001, 0, 0, '${currentTimeStamp()}', '${currentTimeStamp()}')`);

  static insertDefaultRawMaterialShape = this.db
    .prepare(`INSERT INTO raw_material_shapes (raw_material_shape_id, name, factor, registration_time, last_update_time)
    VALUES ('0-0', 'Default Raw Material Shape', 0.001, '${currentTimeStamp()}', '${currentTimeStamp()}')`);

  static insertDefaultRawMaterial = this.db
    .prepare(`INSERT INTO raw_materials (product_representative_entity_id, raw_material_type_id, raw_material_shape_id_of_external_diameter, external_diameter, raw_material_shape_id_of_internal_diameter, internal_diameter, registration_time, last_update_time)
    VALUES ((SELECT id FROM product_representative_entity WHERE entity_id = '0-0'),
            (SELECT id FROM raw_material_types WHERE raw_material_type_id = '0-0'),
            (SELECT id FROM raw_material_shapes WHERE raw_material_shape_id = '0-0'),
            1,
            (SELECT id FROM raw_material_shapes WHERE raw_material_shape_id = '0-0'),
            0,
            '${currentTimeStamp()}',
            '${currentTimeStamp()}')`);

  static insertProductRepresentativeEntitiesForItems = this.db
    .prepare(`INSERT INTO product_representative_entity (entity_id, name, registration_time, last_update_time)
    SELECT DISTINCT id, name, '${currentTimeStamp()}', '${currentTimeStamp()}'
    FROM items;`);

  static addProductRepresentativeEntityIdColumnToItems = this.db
    .prepare(`ALTER TABLE items
    ADD COLUMN product_representative_entity_id INTEGER`);

  static updateProductRepresentativeEntityIdForItems = this.db
    .prepare(`UPDATE items
    SET product_representative_entity_id = (SELECT id 
      FROM product_representative_entity
      WHERE entity_id = items.id
        );`);

  static insertOldProductsToProducts = this.db
    .prepare(`INSERT INTO products (product_representative_entity_id, raw_material_id, registration_time, last_update_time)
    SELECT product_representative_entity_id,
           (SELECT id FROM raw_materials ORDER BY id ASC LIMIT 1),
                        '${currentTimeStamp()}',
                        '${currentTimeStamp()}'
    FROM items;`);

  static deleteItemsTable = this.db.prepare(`DROP TABLE items;`);
}
