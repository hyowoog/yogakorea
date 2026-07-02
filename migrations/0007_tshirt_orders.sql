CREATE TABLE IF NOT EXISTS tshirt_orders (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  studio_name TEXT NOT NULL,
  color TEXT NOT NULL,
  size_code TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tshirt_orders_name ON tshirt_orders(name);
CREATE INDEX IF NOT EXISTS idx_tshirt_orders_created ON tshirt_orders(created_at);
