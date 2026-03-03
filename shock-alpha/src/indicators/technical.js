const ti = require('technicalindicators');

function pad(values, targetLength) {
  const missing = Math.max(0, targetLength - values.length);
  return new Array(missing).fill(null).concat(values);
}

function computeIndicators(rows) {
  const closes = rows.map((r) => r.close);
  const highs = rows.map((r) => r.high);
  const lows = rows.map((r) => r.low);

  const maFast = pad(ti.SMA.calculate({ period: 10, values: closes }), rows.length);
  const maSlow = pad(ti.SMA.calculate({ period: 30, values: closes }), rows.length);
  const bb = ti.BollingerBands.calculate({ period: 20, stdDev: 2, values: closes });
  const bbPad = pad(bb, rows.length);
  const atr = pad(ti.ATR.calculate({ period: 14, high: highs, low: lows, close: closes }), rows.length);

  return rows.map((r, i) => ({
    ...r,
    ma_fast: maFast[i],
    ma_slow: maSlow[i],
    ma_slope: i > 0 && maFast[i] != null && maFast[i - 1] != null ? maFast[i] - maFast[i - 1] : null,
    bb_upper: bbPad[i]?.upper ?? null,
    bb_middle: bbPad[i]?.middle ?? null,
    bb_lower: bbPad[i]?.lower ?? null,
    atr: atr[i]
  }));
}

function findPivots(rows, lookback = 20) {
  const win = rows.slice(-lookback);
  const high = Math.max(...win.map((r) => r.high));
  const low = Math.min(...win.map((r) => r.low));
  return { swingHigh: high, swingLow: low };
}

function fibonacciLevels(swingHigh, swingLow) {
  const r = swingHigh - swingLow;
  return {
    fib236: swingHigh - 0.236 * r,
    fib382: swingHigh - 0.382 * r,
    fib500: swingHigh - 0.5 * r,
    fib618: swingHigh - 0.618 * r,
    fib786: swingHigh - 0.786 * r,
    ext1272: swingHigh + 0.272 * r,
    ext1618: swingHigh + 0.618 * r
  };
}

module.exports = { computeIndicators, findPivots, fibonacciLevels };
