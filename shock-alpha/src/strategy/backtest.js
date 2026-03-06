const fs = require('fs');
const path = require('path');

function backtestWalkForward(rows, signals) {
  const ret = [];
  for (let i = 1; i < rows.length; i += 1) {
    const r = (rows[i].close - rows[i - 1].close) / rows[i - 1].close;
    const s = signals[i - 1] || 0;
    ret.push(r * s);
  }

  let equity = 1;
  const curve = [equity];
  let wins = 0;
  let grossWin = 0;
  let grossLoss = 0;
  ret.forEach((r) => {
    equity *= (1 + r);
    curve.push(equity);
    if (r > 0) {
      wins += 1;
      grossWin += r;
    } else {
      grossLoss += Math.abs(r);
    }
  });

  let peak = curve[0];
  let maxDd = 0;
  curve.forEach((e) => {
    if (e > peak) peak = e;
    const dd = (e - peak) / peak;
    if (dd < maxDd) maxDd = dd;
  });

  const report = {
    totalReturn: equity - 1,
    maxDrawdown: maxDd,
    winRate: ret.length ? wins / ret.length : 0,
    profitFactor: grossLoss > 0 ? grossWin / grossLoss : 0,
    equityCurve: curve
  };

  const outDir = path.resolve(process.cwd(), 'storage', 'reports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `backtest_${Date.now()}.json`);
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2), 'utf-8');
  return { report, outFile };
}

module.exports = { backtestWalkForward };
