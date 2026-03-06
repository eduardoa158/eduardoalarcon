const { garchLike } = require('../models/volatility');

function rr(entry, sl, tp) {
  return Math.abs((tp - entry) / (entry - sl));
}

function chooseDirection({ forecast, allowShort, score }) {
  if (forecast > 0.0005 && score >= 40) return 'LONG';
  if (allowShort && forecast < -0.0005 && score >= 50) return 'SHORT';
  return 'FLAT';
}

function buildSetups({ rows, indicators, fib, input, modelResult, shockScore }) {
  const last = indicators[indicators.length - 1];
  const entry = last.close;
  const atr = last.atr || Math.abs(last.close * 0.02);

  const returns = rows.slice(1).map((r, i) => (r.close - rows[i].close) / rows[i].close);
  const volRes = garchLike(returns);
  const comboScore = Math.min(100, Math.max(0, (modelResult.hitRate || 0.5) * 60 + shockScore * 0.4));
  const direction = chooseDirection({ forecast: modelResult.forecast, allowShort: input.allowShort, score: comboScore });

  if (direction === 'FLAT') {
    return {
      modelSelected: modelResult.model,
      volatilityModel: volRes.model,
      setups: [],
      note: 'No setup válido (filtro direccional/riesgo).'
    };
  }

  let sl;
  if (input.stopPreference === 'ATR') sl = direction === 'LONG' ? entry - 1.5 * atr : entry + 1.5 * atr;
  else if (input.stopPreference === 'Estructura') sl = direction === 'LONG' ? fib.fib786 : fib.ext1272;
  else sl = direction === 'LONG' ? Math.min(entry - 1.2 * atr, fib.fib786) : Math.max(entry + 1.2 * atr, fib.ext1272);

  const tp1 = direction === 'LONG' ? fib.fib236 : entry - 1.5 * atr;
  const tp2 = direction === 'LONG' ? fib.ext1272 : entry - 2.5 * atr;

  const riskAmount = input.capital * input.riskPct;
  const slDist = Math.max(0.0000001, Math.abs(entry - sl));
  const posSize = riskAmount / slDist;
  const levFactor = input.leverageEnabled ? input.leverageFactor : 1;

  const invalidation = [
    'Ruptura sostenida contra MA rápida/lenta',
    'Cierre diario fuera de sesgo de Bollinger esperado',
    'Shock score sube > 80 en contra de la tesis',
    'Pérdida de nivel Fibonacci clave'
  ];

  return {
    modelSelected: shockScore > 60 ? 'ARX_exogenous_priority' : modelResult.model,
    volatilityModel: volRes.model,
    setups: [
      {
        direction,
        entryZone: [entry * 0.998, entry * 1.002],
        stopLoss: sl,
        takeProfit1: tp1,
        takeProfit2: tp2,
        rr_tp1: rr(entry, sl, tp1),
        positionSize: posSize * levFactor,
        confidence: comboScore / 100,
        invalidationChecklist: invalidation,
        disclaimer: 'No es recomendación. Solo educativo.'
      }
    ]
  };
}

module.exports = { buildSetups };
