export class ProductsV3
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS products(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  product_representative_entity_id INTEGER UNIQUE NOT NULL,
                  raw_material_id INTEGER NOT NULL,
                  production_statges INTEGER DEFAULT 1 CHECK (production_statges BETWEEN 1 AND 1000),
                  net_weight INTEGER NOT NULL DEFAULT 1 CHECK (net_weight BETWEEN 1 AND 1000000000000000),
                  time_estimation INTEGER NOT NULL DEFAULT 1 CHECK (time_estimation BETWEEN 1 AND 1000000000000000),
                  length INTEGER NOT NULL DEFAULT 1 CHECK (length BETWEEN 1 AND 1000000000000000),
                  segment_length INTEGER NOT NULL DEFAULT 1 CHECK (segment_length BETWEEN 0 AND 1000000000000000),
                  registration_time TEXT NOT NULL,
                  last_update_time TEXT NOT NULL,
                  
                  FOREIGN KEY (product_representative_entity_id) REFERENCES product_representative_entity(id),
                  FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id)
                  
                ) STRICT`;
  
}