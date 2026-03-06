const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDb } = require('./src/db/sqlite');
const { fetchMarket, chooseFrequency } = require('./src/data/market');
const { fetchNews, aggregateDaily, shockScore } = require('./src/news/gdelt');
const { listShocks, saveShock } = require('./src/db/repositories');
const { computeIndicators, findPivots, fibonacciLevels } = require('./src/indicators/technical');
const { walkForwardArx } = require('./src/models/arx');
const { buildSetups } = require('./src/strategy/setup');
const { backtestWalkForward } = require('./src/strategy/backtest');

const app = express();
const db = initDb();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function toDate(ts) {
  return new Date(ts * 1000).toISOString().slice(0, 10);
}

function validateSignalInput(body) {
  const errors = [];
  if (!(body.capital > 0)) errors.push('capital debe ser > 0');
  if (!(body.riskPct > 0 && body.riskPct <= 1)) errors.push('riskPct debe estar en (0,1]');
  if (body.leverageEnabled && !(body.leverageFactor >= 1)) errors.push('leverageFactor debe ser >= 1');
  if (!body.symbol) errors.push('symbol es obligatorio');
  if (!['ATR', 'Estructura', 'Mixto'].includes(body.stopPreference)) errors.push('stopPreference inválida');
  return errors;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'shock-alpha-node' });
});

app.get('/api/market', async (req, res) => {
  const symbol = req.query.symbol || 'BTC-USD';
  const interval = req.query.interval || '1d';
  const range = req.query.range || '2y';
  const data = await fetchMarket(db, { symbol, interval, range });
  res.json(data);
});

app.get('/api/news', async (req, res) => {
  const from = req.query.from || new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10);
  const to = req.query.to || new Date().toISOString().slice(0, 10);
  const news = await fetchNews({ from, to });
  const daily = aggregateDaily(news);
  res.json({ from, to, count: news.length, daily, news });
});

app.get('/api/shocks', (req, res) => {
  res.json({ shocks: listShocks(db) });
});

app.post('/api/shocks', (req, res) => {
  const { name, start_date, end_date, intensity } = req.body;
  if (!name || !start_date || !end_date || intensity == null) {
    return res.status(400).json({ error: 'name, start_date, end_date, intensity son obligatorios' });
  }
  const saved = saveShock(db, { name, start_date, end_date, intensity: Number(intensity) });
  return res.json({ ok: true, shock: saved });
});

app.post('/api/train', async (req, res) => {
  const symbol = req.body.symbol || 'BTC-USD';
  const day = await fetchMarket(db, { symbol, interval: '1d', range: '2y' });
  const hour = await fetchMarket(db, { symbol, interval: '1h', range: '60d' });
  const selectedInterval = chooseFrequency(day.rows, hour.rows);

  const rows = (selectedInterval === '1h' ? hour.rows : day.rows).map((r) => ({ ...r, date: toDate(r.ts) }));
  const news = await fetchNews({ from: rows[0]?.date || '2020-01-01', to: rows[rows.length - 1]?.date || '2030-01-01' });
  const daily = aggregateDaily(news);
  const exog = {};
  daily.forEach((d) => {
    exog[d.date] = { news_count: d.news_count, avg_tone: d.avg_tone, dummy_shock: 0 };
  });

  listShocks(db).forEach((s) => {
    rows.forEach((r) => {
      if (r.date >= s.start_date && r.date <= s.end_date) {
        exog[r.date] = exog[r.date] || { news_count: 0, avg_tone: 0, dummy_shock: 0 };
        exog[r.date].dummy_shock = Math.max(exog[r.date].dummy_shock, Number(s.intensity || 0));
      }
    });
  });

  const model = walkForwardArx(rows, exog);
  res.json({ selectedInterval, model });
});

app.post('/api/signal', async (req, res) => {
  const errors = validateSignalInput(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const { symbol, capital, riskPct, leverageEnabled, leverageFactor, allowShort, stopPreference } = req.body;
  const market = await fetchMarket(db, { symbol, interval: '1d', range: '1y' });
  const rows = market.rows.map((r) => ({ ...r, date: toDate(r.ts) }));
  const indicators = computeIndicators(rows);
  const piv = findPivots(indicators, 34);
  const fib = fibonacciLevels(piv.swingHigh, piv.swingLow);

  const news = await fetchNews({ from: rows[0].date, to: rows[rows.length - 1].date });
  const daily = aggregateDaily(news);
  const exog = {};
  daily.forEach((d) => {
    exog[d.date] = { news_count: d.news_count, avg_tone: d.avg_tone, dummy_shock: 0 };
  });

  const manual = listShocks(db);
  manual.forEach((s) => {
    rows.forEach((r) => {
      if (r.date >= s.start_date && r.date <= s.end_date) {
        exog[r.date] = exog[r.date] || { news_count: 0, avg_tone: 0, dummy_shock: 0 };
        exog[r.date].dummy_shock = Math.max(exog[r.date].dummy_shock, Number(s.intensity || 0));
      }
    });
  });

  const arx = walkForwardArx(rows, exog);
  const lastDate = rows[rows.length - 1].date;
  const ex = exog[lastDate] || { news_count: 0, avg_tone: 0, dummy_shock: 0 };
  const score = shockScore({ newsCount: ex.news_count, avgTone: ex.avg_tone, manualIntensity: ex.dummy_shock });

  const out = buildSetups({
    rows,
    indicators,
    fib,
    input: { capital: Number(capital), riskPct: Number(riskPct), leverageEnabled: !!leverageEnabled, leverageFactor: Number(leverageFactor || 1), allowShort: !!allowShort, stopPreference },
    modelResult: arx,
    shockScore: score
  });

  res.json({ symbol, shock_score: score, fib, model: arx, ...out });
});

app.post('/api/backtest', async (req, res) => {
  const symbol = req.body.symbol || 'BTC-USD';
  const market = await fetchMarket(db, { symbol, interval: '1d', range: '2y' });
  const rows = computeIndicators(market.rows.map((r) => ({ ...r, date: toDate(r.ts) })));
  const signals = rows.map((r) => {
    if (r.ma_fast == null || r.ma_slow == null) return 0;
    return r.ma_fast > r.ma_slow ? 1 : 0;
  });
  const result = backtestWalkForward(rows, signals);
  res.json(result);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Shock Alpha Node running on port ${port}`);
});
