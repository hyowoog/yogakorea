CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  starts_on TEXT NOT NULL,
  ends_on TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS event_applications (
  id INTEGER PRIMARY KEY,
  event_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('m', 'f')),
  studio_name TEXT NOT NULL,
  region_code INTEGER NOT NULL,
  mobile TEXT NOT NULL,
  member_role TEXT NOT NULL,
  bank_name TEXT,
  bank_num TEXT,
  bank_owner TEXT,
  tshirt_size TEXT,
  extra_data TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_event_applications_event ON event_applications(event_id);
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(starts_on, ends_on);
