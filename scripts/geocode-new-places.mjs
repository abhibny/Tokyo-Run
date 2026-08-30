import { readFileSync, writeFileSync } from 'node:fs';

const places = JSON.parse(readFileSync(new URL('./new-places.json', import.meta.url)));
const outPath = new URL('./new-places-geocoded.json', import.meta.url);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Codex-Tokyo-Map/1.0' } });
  if (!res.ok) return null;
  const data = await res.json();
  return data && data.length ? { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), found: data[0].display_name } : null;
}

const results = [];
for (const p of places) {
  const query = p.cat === 'neigh' ? `${p.area}, Tokyo, Japan` : `${p.name}, ${p.area}, Tokyo, Japan`;
  let hit = await geocode(query);
  if (!hit && p.cat !== 'neigh') {
    hit = await geocode(`${p.area}, Tokyo, Japan`);
  }
  results.push({ ...p, lat: hit ? hit.lat : null, lon: hit ? hit.lon : null, found: hit ? hit.found : null });
  console.log(`${hit ? 'OK ' : 'MISS'} ${p.name} -> ${hit ? `${hit.lat},${hit.lon}` : 'no match'}`);
  await sleep(1100);
}

writeFileSync(outPath, JSON.stringify(results, null, 2));
const missed = results.filter((r) => r.lat === null);
console.log(`\nDone. ${results.length - missed.length}/${results.length} geocoded.`);
if (missed.length) console.log('Missed:', missed.map((m) => m.name).join(', '));
