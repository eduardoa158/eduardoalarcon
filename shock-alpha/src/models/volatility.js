function ewmaVol(returns, lambda = 0.94) {
  let v = returns[0] ? returns[0] ** 2 : 0.0001;
  for (let i = 1; i < returns.length; i += 1) {
    v = lambda * v + (1 - lambda) * (returns[i] ** 2);
  }
  return Math.sqrt(v);
}

function garchLike(returns) {
  if (!returns.length) return { vol: 0.01, model: 'EWMA-fallback' };
  const vol = ewmaVol(returns);
  return { vol, model: 'EWMA-fallback' };
}

module.exports = { garchLike };
