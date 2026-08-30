import { readFileSync, writeFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('./new-places-geocoded.json', import.meta.url)));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const retries = {
  'Akagi-jinja Shrine': '赤城神社 神楽坂 東京',
  'Zuisho-ji Temple': '瑞聖寺 白金台 東京',
  'Fuji Television Headquarters': 'フジテレビ本社ビル 台場',
  'Toyoko Line Shibuya Station': '東急東横線 渋谷駅',
  'Museum of Contemporary Art Tokyo': '東京都現代美術館',
  'Sumida Hokusai Museum': 'すみだ北斎美術館',
  'Reiyukai Shakaden Temple': '霊友会釈迦殿 麻布',
  'Catholic Saint Alfonso Hatsudai Church': 'カトリック初台教会',
  'Starbucks Reserve Roastery Tokyo': 'スターバックス リザーブ ロースタリー 東京 中目黒',
  'Jugetsudo Tsukiji': '築地 寿月堂',
  'Century Tower Ochanomizu': 'センチュリータワー 御茶ノ水',
  'Komaba Campus II University of Tokyo': '東京大学駒場II キャンパス',
  'Octagon Building Ebisu': 'オクタゴン 恵比寿',
  'Museum of Narratives Takanawa Gateway': 'ものがたりミュージアム 高輪ゲートウェイシティ',
  'Tokyo Station Marunouchi Building': '東京駅丸の内駅舎',
  'Toyoko Line Shibuya Station ': '',
};

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Codex-Tokyo-Map/1.0' } });
  if (!res.ok) return null;
  const d = await res.json();
  return d && d.length ? { lat: parseFloat(d[0].lat), lon: parseFloat(d[0].lon), found: d[0].display_name } : null;
}

for (const item of data) {
  if (!retries[item.name]) continue;
  const hit = await geocode(retries[item.name]);
  if (hit) {
    console.log(`REFINED ${item.name}: ${item.lat},${item.lon} -> ${hit.lat},${hit.lon} (${hit.found})`);
    item.lat = hit.lat;
    item.lon = hit.lon;
    item.found = hit.found;
  } else {
    console.log(`NO CHANGE ${item.name} (no better match)`);
  }
  await sleep(1100);
}

writeFileSync(new URL('./new-places-geocoded.json', import.meta.url), JSON.stringify(data, null, 2));
console.log('Done.');
