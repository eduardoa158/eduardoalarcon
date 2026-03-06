(function () {
  const symbolSelect = document.getElementById('symbolSelect');
  const horizonSelect = document.getElementById('horizonSelect');
  const priceInput = document.getElementById('currentPrice');
  const projectionBox = document.getElementById('projectionBox');
  const projectBtn = document.getElementById('projectBtn');

  let chartWidget = null;
  let taWidget = null;
  let newsWidget = null;

  function buildChart(symbol) {
    if (chartWidget) document.getElementById('tv_chart').innerHTML = '';
    chartWidget = new TradingView.widget({
      autosize: true,
      symbol,
      interval: '240',
      timezone: window.SHOCK_ALPHA_CONFIG.timezone,
      theme: 'dark',
      style: '1',
      locale: window.SHOCK_ALPHA_CONFIG.locale,
      enable_publishing: false,
      withdateranges: true,
      hide_side_toolbar: false,
      container_id: 'tv_chart',
      studies: ['MASimple@tv-basicstudies', 'BB@tv-basicstudies', 'RSI@tv-basicstudies']
    });
  }

  function buildTechnical(symbol) {
    if (taWidget) document.getElementById('tv_technical').innerHTML = '';
    taWidget = new TradingView.widget({
      container_id: 'tv_technical',
      width: '100%',
      height: 430,
      symbol,
      interval: '1D',
      timezone: window.SHOCK_ALPHA_CONFIG.timezone,
      theme: 'dark',
      style: '1',
      locale: window.SHOCK_ALPHA_CONFIG.locale,
      toolbar_bg: '#0f172a',
      hide_top_toolbar: true,
      withdateranges: false,
      allow_symbol_change: false,
      details: true,
      hotlist: false,
      calendar: false
    });
  }

  function buildNews(symbol) {
    if (newsWidget) document.getElementById('tv_news').innerHTML = '';
    newsWidget = new TradingView.widget({
      container_id: 'tv_news',
      width: '100%',
      height: 430,
      symbol,
      colorTheme: 'dark',
      isTransparent: false,
      locale: window.SHOCK_ALPHA_CONFIG.locale,
      feedMode: 'symbol',
      autosize: true
    });
  }

  function project() {
    const p0 = Number(priceInput.value);
    const n = Number(horizonSelect.value);
    if (!p0 || p0 <= 0) {
      projectionBox.textContent = '{"error":"Ingresa un precio válido"}';
      return;
    }
    const driftDaily = 0.0015;
    const volDaily = 0.02;
    const expected = p0 * (1 + driftDaily * n);
    const upper = expected * (1 + volDaily * Math.sqrt(n));
    const lower = expected * (1 - volDaily * Math.sqrt(n));
    const out = {
      symbol: symbolSelect.value,
      horizon_days: n,
      scenario_base: Number(expected.toFixed(4)),
      scenario_high: Number(upper.toFixed(4)),
      scenario_low: Number(lower.toFixed(4)),
      note: 'Proyección educativa basada en drift/vol heurístico; no es señal de inversión.'
    };
    projectionBox.textContent = JSON.stringify(out, null, 2);
  }

  function refreshAll() {
    const symbol = symbolSelect.value;
    buildChart(symbol);
    buildTechnical(symbol);
    buildNews(symbol);
    project();
  }

  symbolSelect.addEventListener('change', refreshAll);
  horizonSelect.addEventListener('change', project);
  projectBtn.addEventListener('click', project);

  refreshAll();
})();
