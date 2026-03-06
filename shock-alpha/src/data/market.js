const yahooFinance = require('yahoo-finance2').default;
const { getMarketRows, upsertMarketRows } = require('../db/repositories');

function normalizeRows(symbol, interval, result) {
  const quotes = result?.quotes || [];
  return quotes
    .filter((q) => q?.date && q?.open != null && q?.close != null)
    .map((q) => ({
      symbol,
      interval,
      ts: Math.floor(new Date(q.date).getTime() / 1000),
      open: Number(q.open),
      high: Number(q.high),
      low: Number(q.low),
      close: Number(q.close),
      volume: Number(q.volume || 0)
    }));
}

async function fetchMarket(db, { symbol = 'BTC-USD', interval = '1d', range = '2y' }) {
  try {
    const result = await yahooFinance.chart(symbol, { interval, range });
    const rows = normalizeRows(symbol, interval, result);
    if (rows.length > 0) upsertMarketRows(db, symbol, interval, rows);
    return { source: 'yahoo', rows };
  } catch (err) {
    const cached = getMarketRows(db, symbol, interval);
    return { source: 'cache', rows: cached, warning: `Yahoo failed: ${err.message}` };
  }
}

function chooseFrequency(rows1d, rows1h) {
  if (!rows1h || rows1h.length < 200) return '1d';
  const byChunk = rows1h.slice(-24 * 7);
  if (byChunk.length < 20) return '1d';
  const rets = [];
  for (let i = 1; i < byChunk.length; i += 1) {
    rets.push((byChunk[i].close - byChunk[i - 1].close) / byChunk[i - 1].close);
  }
  const vol = Math.sqrt(rets.reduce((a, b) => a + b * b, 0) / Math.max(rets.length, 1));
  return vol > 0.02 ? '1h' : '1d';
}

module.exports = { fetchMarket, chooseFrequency };
