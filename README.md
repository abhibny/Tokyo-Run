# Tokyo Run

A self-contained, static Tokyo architecture itinerary map — 165 places (buildings, historic/cultural sites, cafes & eateries, neighborhoods) with a Leaflet map, per-place distance from your hotel, photo previews, and local visited/archived tracking.

## Pages

- [`index.html`](index.html) — auto-detecting entry point. Redirects to `mobile.html` or `desktop.html` based on viewport width (`< 700px` = mobile), no visible choice shown.
- [`desktop.html`](desktop.html) — desktop layout (side-by-side list + map)
- [`mobile.html`](mobile.html) — phone layout, built for the Galaxy S24 viewport (list/map tab switcher, filter bottom sheet)

All pages read the same 165-place dataset and share saved state (selections, archived places, visited flags) via the browser's local storage, since they're served from the same origin.

## Data

`data/` holds the source data behind the map:
- `tokyo-architecture-35-coordinates.json` / `.csv` — the original 35 curated architecture picks, geocoded
- `new-places-geocoded.json` — the additional 130 places (architecture, architectural places, cafes/eateries, neighborhoods) geocoded via OpenStreetMap/Nominatim

## Scripts

`scripts/` holds the PowerShell/Node geocoding scripts used to build the data above (Nominatim lookups with rate-limiting).

## Running locally

No build step — these are plain static HTML files. Serve the folder with any static server, e.g.:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.
