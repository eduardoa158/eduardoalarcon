let chart;
let marketRows = [];

function payload() {
  return {
    symbol: document.getElementById('symbol').value,
    capital: Number(document.getElementById('capital').value),
    riskPct: Number(document.getElementById('riskPct').value),
    leverageEnabled: document.getElementById('leverageEnabled').checked,
    leverageFactor: Number(document.getElementById('leverageFactor').value),
    allowShort: document.getElementById('allowShort').checked,
    stopPreference: document.getElementById('stopPreference').value
  };
}

async function jget(url) {
  const r = await fetch(url);
  return r.json();
}

async function jpost(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return r.json();
}

function renderChart(rows) {
  const labels = rows.map((r) => new Date(r.ts * 1000).toISOString().slice(0, 10));
  const close = rows.map((r) => r.close);

  const ma = (period) => rows.map((_, i) => {
    if (i < period - 1) return null;
    const win = close.slice(i - period + 1, i + 1);
    return win.reduce((a, b) => a + b, 0) / period;
  });

  const maFast = ma(10);
  const maSlow = ma(30);
  const bbMid = ma(20);
  const bbUpper = bbMid.map((m, i) => {
    if (m == null) return null;
    const win = close.slice(i - 19, i + 1);
    const sd = Math.sqrt(win.reduce((a, b) => a + (b - m) ** 2, 0) / 20);
    return m + 2 * sd;
  });
  const bbLower = bbMid.map((m, i) => {
    if (m == null) return null;
    const win = close.slice(i - 19, i + 1);
    const sd = Math.sqrt(win.reduce((a, b) => a + (b - m) ** 2, 0) / 20);
    return m - 2 * sd;
  });

  const ctx = document.getElementById('priceChart');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Close', data: close, borderColor: '#60a5fa', pointRadius: 0 },
        { label: 'MA 10', data: maFast, borderColor: '#22c55e', pointRadius: 0 },
        { label: 'MA 30', data: maSlow, borderColor: '#f59e0b', pointRadius: 0 },
        { label: 'BB Upper', data: bbUpper, borderColor: '#a78bfa', pointRadius: 0 },
        { label: 'BB Lower', data: bbLower, borderColor: '#a78bfa', pointRadius: 0 }
      ]
    },
    options: { responsive: true }
  });
}

document.getElementById('loadBtn').onclick = async () => {
  const symbol = document.getElementById('symbol').value;
  const data = await jget(`/api/market?symbol=${encodeURIComponent(symbol)}&interval=1d&range=2y`);
  marketRows = data.rows || [];
  renderChart(marketRows);
};

document.getElementById('trainBtn').onclick = async () => {
  const out = await jpost('/api/train', { symbol: document.getElementById('symbol').value });
  document.getElementById('modelOut').textContent = JSON.stringify(out, null, 2);
};

document.getElementById('signalBtn').onclick = async () => {
  const out = await jpost('/api/signal', payload());
  document.getElementById('signalOut').textContent = JSON.stringify(out, null, 2);
};

document.getElementById('backtestBtn').onclick = async () => {
  const out = await jpost('/api/backtest', { symbol: document.getElementById('symbol').value });
  document.getElementById('modelOut').textContent = JSON.stringify(out, null, 2);
};

document.getElementById('saveShockBtn').onclick = async () => {
  const out = await jpost('/api/shocks', {
    name: document.getElementById('shockName').value,
    start_date: document.getElementById('shockStart').value,
    end_date: document.getElementById('shockEnd').value,
    intensity: Number(document.getElementById('shockIntensity').value)
  });
  document.getElementById('shockOut').textContent = JSON.stringify(out, null, 2);
};
