CREATE TABLE IF NOT EXISTS challenges (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS challenge_expiry ON challenges(expires);
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY,
  time TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  message TEXT NOT NULL
);
