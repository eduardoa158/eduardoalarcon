const fs = require('fs');
const path = require('path');

function upsertMarketRows(db, symbol, interval, rows) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO market_cache(symbol, interval, ts, open, high, low, close, volume)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const tx = db.transaction((input) => {
    input.forEach((r) => {
      stmt.run(symbol, interval, r.ts, r.open, r.high, r.low, r.close, r.volume);
    });
  });
  tx(rows);
}

function getMarketRows(db, symbol, interval) {
  return db
    .prepare('SELECT symbol, interval, ts, open, high, low, close, volume FROM market_cache WHERE symbol=? AND interval=? ORDER BY ts ASC')
    .all(symbol, interval);
}

function listShocks(db) {
  return db.prepare('SELECT id, name, start_date, end_date, intensity, created_at FROM shocks ORDER BY id DESC').all();
}

function saveShock(db, shock) {
  const now = new Date().toISOString();
  db.prepare(
    'INSERT INTO shocks(name, start_date, end_date, intensity, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(shock.name, shock.start_date, shock.end_date, shock.intensity, now);

  const jsonPath = path.resolve(process.cwd(), 'storage', 'shocks.json');
  let items = [];
  if (fs.existsSync(jsonPath)) items = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  items.push({ ...shock, created_at: now });
  fs.writeFileSync(jsonPath, JSON.stringify(items, null, 2), 'utf-8');
  return shock;
}

module.exports = { upsertMarketRows, getMarketRows, listShocks, saveShock };
