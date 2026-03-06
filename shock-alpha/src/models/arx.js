function olsFit(features, y) {
  const n = features.length;
  const k = features[0].length;
  const w = new Array(k).fill(0);
  const lr = 0.01;
  for (let iter = 0; iter < 1000; iter += 1) {
    const grad = new Array(k).fill(0);
    for (let i = 0; i < n; i += 1) {
      const pred = w.reduce((a, wi, j) => a + wi * features[i][j], 0);
      const e = pred - y[i];
      for (let j = 0; j < k; j += 1) grad[j] += (2 / n) * e * features[i][j];
    }
    for (let j = 0; j < k; j += 1) w[j] -= lr * grad[j];
  }
  return w;
}

function predictRow(weights, x) {
  return weights.reduce((a, w, i) => a + w * x[i], 0);
}

function buildDataset(rows, exogByDate) {
  const out = [];
  for (let i = 3; i < rows.length; i += 1) {
    const r0 = rows[i - 1];
    const r1 = rows[i - 2];
    const r2 = rows[i - 3];
    const ret = (rows[i].close - rows[i - 1].close) / rows[i - 1].close;
    const ex = exogByDate[r0.date] || { news_count: 0, avg_tone: 0, dummy_shock: 0 };
    out.push({
      x: [1, (r0.close - r1.close) / r1.close, (r1.close - r2.close) / r2.close, ex.news_count, ex.avg_tone, ex.dummy_shock],
      y: ret,
      date: rows[i].date
    });
  }
  return out;
}

function walkForwardArx(rows, exogByDate) {
  const ds = buildDataset(rows, exogByDate);
  if (ds.length < 60) return { mae: null, rmse: null, hitRate: null, forecast: 0, model: 'ARX-insufficient' };

  const split = Math.floor(ds.length * 0.8);
  const tr = ds.slice(0, split);
  const te = ds.slice(split);
  const w = olsFit(tr.map((r) => r.x), tr.map((r) => r.y));

  const errors = [];
  let hits = 0;
  te.forEach((r) => {
    const p = predictRow(w, r.x);
    const e = r.y - p;
    errors.push(e);
    if ((r.y >= 0 && p >= 0) || (r.y < 0 && p < 0)) hits += 1;
  });

  const mae = errors.reduce((a, e) => a + Math.abs(e), 0) / errors.length;
  const rmse = Math.sqrt(errors.reduce((a, e) => a + e * e, 0) / errors.length);
  const lastX = ds[ds.length - 1].x;
  const forecast = predictRow(w, lastX);

  return { mae, rmse, hitRate: hits / te.length, forecast, model: 'ARX' };
}

module.exports = { walkForwardArx };
