# Tokyo Hunt

A self-contained, static Tokyo trip-planning map — architecture, historic sites, cafes & eateries, neighborhoods, and day trips outside the city — with a Leaflet map, per-place distance from your hotel, photo previews, and local visited/archived tracking.

## Pages

- [`index.html`](index.html) — entry point, redirects straight to `mobile.html`.
- [`mobile.html`](mobile.html) — the app. Mobile-first (list/map tab switcher, filter bottom sheet); on a wide desktop browser it renders itself inside a centered phone-sized frame instead of stretching full-width.

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
