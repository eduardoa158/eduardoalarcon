const API = '/api';
let chart;
let candleSeries;
let ma20Series;
let ma50Series;
let bbUpperSeries;
let bbLowerSeries;
let forecastSeries;
let fibLines = [];

function currentQuery() {
  const ticker = document.getElementById('ticker').value || 'BTC-USD';
  const start = document.getElementById('start').value || '2022-01-01';
  const end = document.getElementById('end').value || 'today';
  return `ticker=${encodeURIComponent(ticker)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
}

function ensureChart() {
  if (chart) return;
  const container = document.getElementById('chartContainer');
  chart = LightweightCharts.createChart(container, {
    layout: { background: { color: '#0f172a' }, textColor: '#cbd5e1' },
    grid: { vertLines: { color: '#1e293b' }, horzLines: { color: '#1e293b' } },
    width: container.clientWidth,
    height: 620,
    timeScale: { timeVisible: true, secondsVisible: false },
  });
  candleSeries = chart.addCandlestickSeries({
    upColor: '#22c55e', downColor: '#ef4444', borderDownColor: '#ef4444', borderUpColor: '#22c55e', wickDownColor: '#ef4444', wickUpColor: '#22c55e'
  });
  ma20Series = chart.addLineSeries({ color: '#60a5fa', lineWidth: 2, title: 'MA20' });
  ma50Series = chart.addLineSeries({ color: '#f59e0b', lineWidth: 2, title: 'MA50' });
  bbUpperSeries = chart.addLineSeries({ color: '#a78bfa', lineWidth: 1, lineStyle: 2, title: 'BB Upper' });
  bbLowerSeries = chart.addLineSeries({ color: '#a78bfa', lineWidth: 1, lineStyle: 2, title: 'BB Lower' });
  forecastSeries = chart.addLineSeries({ color: '#34d399', lineWidth: 2, lineStyle: 0, title: 'Forecast' });
  window.addEventListener('resize', () => chart.applyOptions({ width: container.clientWidth }));
}

function clearFibLines() {
  fibLines.forEach(line => candleSeries.removePriceLine(line));
  fibLines = [];
}

function drawFibonacci(fib) {
  clearFibLines();
  const legend = document.getElementById('fibLegend');
  legend.innerHTML = '';
  Object.entries(fib || {}).forEach(([k, v]) => {
    const line = candleSeries.createPriceLine({
      price: Number(v),
      color: k.includes('ext_') ? '#f97316' : '#06b6d4',
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: k,
    });
    fibLines.push(line);
    const item = document.createElement('div');
    item.className = 'fib-item';
    item.textContent = `${k}: ${Number(v).toFixed(2)}`;
    legend.appendChild(item);
  });
}

async function loadChart() {
  ensureChart();
  const res = await fetch(`${API}/asset/chart?${currentQuery()}`);
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  candleSeries.setData(data.candles);
  ma20Series.setData(data.ma20);
  ma50Series.setData(data.ma50);
  bbUpperSeries.setData(data.bbUpper);
  bbLowerSeries.setData(data.bbLower);
  drawFibonacci(data.fibonacci);
  forecastSeries.setData(data.projection.map(p => ({ time: p.time, value: p.expected })));
  chart.timeScale().fitContent();
  document.getElementById('freqInfo').textContent = `Fuente principal: Yahoo Finance (con fallback) · Frecuencia sugerida: ${data.frequency_selected}`;
}

async function loadPredictions() {
  const res = await fetch(`${API}/predictions?${currentQuery()}`);
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  document.getElementById('predictionOut').textContent = JSON.stringify(data, null, 2);
}

async function loadNews() {
  const res = await fetch(`${API}/shocks/news`);
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  const el = document.getElementById('newsList');
  if (!data.news || !data.news.length) {
    el.innerHTML = '<p>Sin noticias por ahora; el sistema sigue operativo con datos de mercado.</p>';
    return;
  }
  el.innerHTML = data.news.slice(0, 14).map(n =>
    `<div class="news-item"><strong>${n.title || 'Sin título'}</strong><br/>${n.source || 'source'} · impact=${n.impact_score}<br/><a href="${n.url}" target="_blank">abrir</a></div>`
  ).join('');
}

document.getElementById('refreshChart').onclick = async () => {
  await loadChart();
  await loadPredictions();
};
document.getElementById('loadPredictions').onclick = loadPredictions;
document.getElementById('loadNews').onclick = loadNews;

(async () => {
  await loadChart();
  await loadPredictions();
  await loadNews();
  setInterval(loadChart, 60000);
})();
