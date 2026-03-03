const https = require('https');

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

async function fetchNews({ from, to }) {
  const q = encodeURIComponent('(Iran Israel conflict OR oil supply risk OR sanctions OR missile OR hormuz)');
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${q}&mode=ArtList&maxrecords=100&format=json&startdatetime=${from.replace(/-/g, '')}000000&enddatetime=${to.replace(/-/g, '')}235959`;
  try {
    const json = await httpGetJson(url);
    const articles = json.articles || [];
    return articles.map((a) => ({
      date: a.seendate?.slice(0, 10) || from,
      title: a.title || '',
      source: a.sourceCommonName || 'gdelt',
      url: a.url || '',
      tone: Number(a?.tone || 0)
    }));
  } catch (err) {
    return [];
  }
}

function aggregateDaily(news) {
  const map = new Map();
  news.forEach((n) => {
    if (!map.has(n.date)) map.set(n.date, { date: n.date, news_count: 0, tone_sum: 0 });
    const row = map.get(n.date);
    row.news_count += 1;
    row.tone_sum += Number(n.tone || 0);
  });
  return Array.from(map.values()).map((r) => ({
    date: r.date,
    news_count: r.news_count,
    avg_tone: r.news_count > 0 ? r.tone_sum / r.news_count : 0
  }));
}

function shockScore({ newsCount = 0, avgTone = 0, manualIntensity = 0 }) {
  const countPart = Math.min(60, newsCount * 3);
  const tonePart = Math.min(20, Math.max(0, 10 - avgTone));
  const manualPart = Math.min(20, manualIntensity * 4);
  return Math.max(0, Math.min(100, countPart + tonePart + manualPart));
}

module.exports = { fetchNews, aggregateDaily, shockScore };
