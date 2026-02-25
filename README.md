# FIFA World Cup 2026™ — Transportation Command Center

Real-time fleet management dashboard for coordinating transportation across all 16 FIFA World Cup 2026 host cities (USA, Mexico, Canada).

![Dashboard Preview](https://img.shields.io/badge/FIFA-World%20Cup%202026-00997b?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live%20Demo-10b981?style=for-the-badge)

## Features

- **Live Interactive Map** — Leaflet-powered dark map with TomTom traffic flow overlay
- **16 Host Cities** — All venues with real coordinates, capacities, and fleet data
- **Real-Time Fleet Tracking** — 78 animated vehicles (buses, sprinters, SUVs) with status indicators
- **HERE Routing** — Click any city to see calculated driving routes from airports/hotels to stadiums with real ETAs
- **TomTom Traffic** — Live traffic flow tiles and incident data across North America
- **Route Management** — Full route table with filtering, status tracking, and rerouting
- **AI Operations** — Decision engine with route optimization recommendations
- **Driver Management** — Driver cards with stats, messaging, and alert capabilities
- **Live Feed** — Real-time event stream with arrivals, delays, and disruptions

## Tech Stack

- React 18 + Vite
- Leaflet (mapping)
- TomTom Traffic API (flow tiles + incidents)
- HERE Routing API (route calculations)

## Host Cities

| Region | City | Stadium | Capacity |
|--------|------|---------|----------|
| Western | Vancouver 🇨🇦 | BC Place | 54,000 |
| Western | Seattle 🇺🇸 | Lumen Field | 69,000 |
| Western | SF Bay Area 🇺🇸 | Levi's Stadium | 71,000 |
| Western | Los Angeles 🇺🇸 | SoFi Stadium | 70,000 |
| Central | Guadalajara 🇲🇽 | Estadio Akron | 48,000 |
| Central | Mexico City 🇲🇽 | Estadio Azteca | 83,000 |
| Central | Monterrey 🇲🇽 | Estadio BBVA | 53,000 |
| Central | Houston 🇺🇸 | NRG Stadium | 72,000 |
| Central | Dallas 🇺🇸 | AT&T Stadium | 94,000 |
| Central | Kansas City 🇺🇸 | Arrowhead Stadium | 76,000 |
| Eastern | Atlanta 🇺🇸 | Mercedes-Benz Stadium | 75,000 |
| Eastern | Miami 🇺🇸 | Hard Rock Stadium | 65,000 |
| Eastern | Toronto 🇨🇦 | BMO Field | 45,500 |
| Eastern | Boston 🇺🇸 | Gillette Stadium | 65,000 |
| Eastern | Philadelphia 🇺🇸 | Lincoln Financial Field | 69,000 |
| Eastern | New York/NJ 🇺🇸 | MetLife Stadium | 87,000 |

## Getting Started

```bash
npm install
npm run dev
```

## Deployment

Configured for Netlify. Push to GitHub and connect your repo to Netlify for automatic deploys.

```bash
npm run build
```

## Tournament Info

- **Dates:** June 11 – July 19, 2026
- **Teams:** 48
- **Matches:** 104
- **Final:** MetLife Stadium, July 19, 2026
- **First-ever 3-nation host** (USA, Mexico, Canada)

## License

MIT
