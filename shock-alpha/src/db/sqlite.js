const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

function ensureStorage() {
  const storagePath = path.resolve(process.cwd(), 'storage');
  const reportsPath = path.join(storagePath, 'reports');
  if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath, { recursive: true });
  if (!fs.existsSync(reportsPath)) fs.mkdirSync(reportsPath, { recursive: true });
  const shocksFile = path.join(storagePath, 'shocks.json');
  if (!fs.existsSync(shocksFile)) fs.writeFileSync(shocksFile, '[]\n', 'utf-8');
  return storagePath;
}

function initDb() {
  const storagePath = ensureStorage();
  const dbPath = process.env.DB_PATH || path.join(storagePath, 'shockalpha.db');
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS market_cache (
      symbol TEXT NOT NULL,
      interval TEXT NOT NULL,
      ts INTEGER NOT NULL,
      open REAL,
      high REAL,
      low REAL,
      close REAL,
      volume REAL,
      PRIMARY KEY(symbol, interval, ts)
    );

    CREATE TABLE IF NOT EXISTS shocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      intensity REAL NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  return db;
}

module.exports = { initDb, ensureStorage };
