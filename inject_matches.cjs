const fs = require('fs');

const extractedMatches = [
  {
    "id": "ext_1",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Ecuador Liga Pro" },
      "country": { "name": "Ekvador" },
      "participants": { "home": "Leones Del Norte", "away": "Guayaquil City FC" },
      "start_time": "2026-07-24T00:30:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~1.76!~draw~3.35!~away~4.94"] }
    }
  },
  {
    "id": "ext_2",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Ecuador Liga Pro" },
      "country": { "name": "Ekvador" },
      "participants": { "home": "Orense", "away": "SD Aucas" },
      "start_time": "2026-07-24T00:30:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~2.49!~draw~3.09!~away~2.93"] }
    }
  },
  {
    "id": "ext_3",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Copa Sudamericana" },
      "country": { "name": "Güney Amerika" },
      "participants": { "home": "Bolivar", "away": "Gremio" },
      "start_time": "2026-07-24T01:00:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~1.58!~draw~4.24!~away~5.36"] }
    }
  },
  {
    "id": "ext_4",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Brazil Serie B" },
      "country": { "name": "Brezilya" },
      "participants": { "home": "Athletic Club", "away": "Sao Bernardo FC" },
      "start_time": "2026-07-24T01:30:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~2.00!~draw~3.15!~away~3.99"] }
    }
  },
  {
    "id": "ext_5",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Liga Profesional" },
      "country": { "name": "Arjantin" },
      "participants": { "home": "Belgrano", "away": "Rosario Central" },
      "start_time": "2026-07-24T01:30:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~2.69!~draw~2.83!~away~3.03"] }
    }
  },
  {
    "id": "ext_6",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Liga Profesional" },
      "country": { "name": "Arjantin" },
      "participants": { "home": "Sarmiento Junin", "away": "Argentinos Juniors" },
      "start_time": "2026-07-24T01:30:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~4.28!~draw~3.00!~away~2.05"] }
    }
  },
  {
    "id": "ext_7",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Série A" },
      "country": { "name": "Brezilya" },
      "participants": { "home": "Botafogo RJ", "away": "Esporte Clube Vitória" },
      "start_time": "2026-07-24T01:30:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~1.82!~draw~3.67!~away~4.40"] }
    }
  },
  {
    "id": "ext_8",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Série A" },
      "country": { "name": "Brezilya" },
      "participants": { "home": "Corinthians SP", "away": "Club Do Remo" },
      "start_time": "2026-07-24T01:30:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~1.53!~draw~4.11!~away~6.50"] }
    }
  },
  {
    "id": "ext_9",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Brazil Serie B" },
      "country": { "name": "Brezilya" },
      "participants": { "home": "Cuiaba EC", "away": "Atletico GO" },
      "start_time": "2026-07-24T02:30:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~2.01!~draw~3.08!~away~4.08"] }
    }
  },
  {
    "id": "ext_10",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Ecuador Liga Pro" },
      "country": { "name": "Ekvador" },
      "participants": { "home": "Club Sport Emelec", "away": "Mushuc Runa" },
      "start_time": "2026-07-24T03:00:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~1.81!~draw~3.62!~away~4.18"] }
    }
  },
  {
    "id": "ext_11",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Brazil Serie B" },
      "country": { "name": "Brezilya" },
      "participants": { "home": "Botafogo FC", "away": "EC Juventude" },
      "start_time": "2026-07-24T03:30:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~2.61!~draw~2.76!~away~3.11"] }
    }
  },
  {
    "id": "ext_12",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Copa Sudamericana" },
      "country": { "name": "Güney Amerika" },
      "participants": { "home": "Boca Juniors", "away": "O'Higgins" },
      "start_time": "2026-07-24T03:30:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~-!~draw~-!~away~-"] }
    }
  },
  {
    "id": "ext_13",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Copa Sudamericana" },
      "country": { "name": "Güney Amerika" },
      "participants": { "home": "Independiente Santa Fe", "away": "Caracas FC" },
      "start_time": "2026-07-24T03:30:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~1.37!~draw~4.47!~away~9.86"] }
    }
  },
  {
    "id": "ext_14",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Liga Profesional" },
      "country": { "name": "Arjantin" },
      "participants": { "home": "Defensa y Justicia", "away": "CA Aldosivi" },
      "start_time": "2026-07-24T03:45:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~1.95!~draw~3.22!~away~4.29"] }
    }
  },
  {
    "id": "ext_15",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Costa Rica - Primera Division" },
      "country": { "name": "Kosta Rika" },
      "participants": { "home": "CS Herediano", "away": "Puntarenas FC" },
      "start_time": "2026-07-24T05:00:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~1.51!~draw~3.35!~away~5.00"] }
    }
  },
  {
    "id": "ext_16",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Australia Queensland Premier League" },
      "country": { "name": "Avustralya" },
      "participants": { "home": "Mitchelton", "away": "Souths United" },
      "start_time": "2026-07-24T13:00:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~1.75!~draw~4.58!~away~3.49"] }
    }
  },
  {
    "id": "ext_17",
    "data": {
      "status": "not_started",
      "sport": { "name": "Futbol" },
      "tournament": { "name": "Romania Liga 1" },
      "country": { "name": "Romanya" },
      "participants": { "home": "AFC Uta Arad", "away": "FC Otelul Galati" },
      "start_time": "2026-07-24T18:30:00.000Z",
      "group_markets": { "full_event|0": ["|1x2|~home~2.09!~draw~3.28!~away~3.48"] }
    }
  }
];

try {
    const raw = fs.readFileSync('public/prelive_matches.json', 'utf8');
    const current = JSON.parse(raw);
    const updated = [...extractedMatches, ...current];
    fs.writeFileSync('public/prelive_matches.json', JSON.stringify(updated, null, 2));
    console.log('Successfully injected 17 matches to public/prelive_matches.json');
} catch (e) {
    console.error('Error injecting matches:', e.message);
}
